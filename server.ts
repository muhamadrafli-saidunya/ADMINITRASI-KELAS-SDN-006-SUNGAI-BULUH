import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    try {
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });
    } catch (e) {
      console.warn('Failed to initialize GoogleGenAI client:', e);
    }
  }
  return aiClient;
}

// Helper for resilient AI generation with fallback across models and smooth recovery during temporary high demand (503/429)
async function generateWithFallback(
  ai: GoogleGenAI,
  prompt: string,
  systemInstruction: string
): Promise<{ text: string; model: string; displayName: string }> {
  // Candidate models: primary 3.8 flash, high-throughput 3.1 flash lite, and flash alias
  const candidateModels = [
    { id: 'gemini-3.8-flash', name: 'Google Gemini 3.8 Flash' },
    { id: 'gemini-3.1-flash-lite', name: 'Google Gemini 3.1 Flash Lite' },
    { id: 'gemini-flash-latest', name: 'Google Gemini Flash' }
  ];

  let lastError: any = null;

  for (const candidate of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model: candidate.id,
        contents: prompt,
        config: {
          systemInstruction
        }
      });

      const text = response.text || '';
      if (text && text.trim().length > 0) {
        return {
          text,
          model: candidate.id,
          displayName: candidate.name
        };
      }
    } catch (err: any) {
      lastError = err;
      const errMsg = err?.message || String(err);
      const isHighDemandOrRateLimit =
        err?.status === 503 ||
        err?.code === 503 ||
        errMsg.includes('503') ||
        errMsg.includes('high demand') ||
        errMsg.includes('UNAVAILABLE') ||
        errMsg.includes('429') ||
        errMsg.includes('RESOURCE_EXHAUSTED');

      // Use standard stdout logging to document fallback transitions cleanly
      console.log(
        `[AI Notice] Model ${candidate.id} ${isHighDemandOrRateLimit ? 'temporarily high demand' : 'unavailable'}, switching to next candidate...`
      );
      // Advance directly to the next candidate model
      continue;
    }
  }

  throw lastError || new Error('All model candidates were unavailable.');
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Health check API
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // AI Server Online Status API
  app.get('/api/ai/status', (req, res) => {
    const ai = getAIClient();
    res.json({
      online: !!ai,
      model: 'gemini-3.8-flash',
      provider: 'Google Gemini AI Server',
      status: ai ? 'connected' : 'unconfigured',
      time: new Date().toISOString()
    });
  });

  // AI Generation API Endpoint for Elementary School Administration (Server Online)
  app.post('/api/ai/generate', async (req, res) => {
    try {
      const { prompt, category, contextData } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const ai = getAIClient();

      if (ai) {
        const systemInstruction = `Anda adalah Asisten Ahli Kurikulum Merdeka & Administrasi Pendidikan Sekolah Dasar (SD) terkemuka di Indonesia.
Pedoman Utama:
1. Hasilkan dokumen administrasi sekolah, perangkat ajar, modul ajar, soal HOTS, rubrik asesmen, deskripsi rapor, instrumen P5, dan surat resmi SD yang SANGAT LENGKAP, terstruktur, mendalam, formal, dan sesuai standar Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi (Kemendikbudristek).
2. Sajikan langsung isi dokumen siap cetak/ekspor dalam format Markdown yang rapi dengan judul (#, ##, ###), tabel bergaris bila relevan, daftar bernomor, bullet list, dan lembar pengesahan resmi (Tempat, Tanggal, Tanda Tangan Guru Kelas dan Kepala Sekolah beserta NIP).
3. Hindari kalimat pembuka/penutup basa-basi seperti "Tentu, ini adalah...", langsung sajikan judul dokumen utama (# ...) hingga bagian akhir dokumen.
4. Gunakan bahasa Indonesia baku, profesional, ramah, dan mendidik.`;

        const result = await generateWithFallback(ai, prompt, systemInstruction);

        return res.json({
          result: result.text,
          source: result.model,
          online: true,
          model: result.displayName,
          timestamp: new Date().toISOString()
        });
      } else {
        // Response if API Key is not configured (graceful fallback without 503 HTTP failure)
        return res.json({
          result: null,
          source: 'server_offline',
          online: false,
          fallbackAvailable: true,
          message: 'Layanan AI Server belum terhubung (API Key belum dikonfigurasi).'
        });
      }
    } catch (error: any) {
      console.log('[AI Server] Falling back to standard Kurikulum Merdeka template generator:', error?.message || error);
      return res.json({
        result: null,
        source: 'server_fallback',
        online: false,
        fallbackAvailable: true,
        message: 'Model AI sedang mengalami lonjakan permintaan, dialihkan ke template terstandar.'
      });
    }
  });

  // Interactive AI Teacher Chat Endpoint
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      const ai = getAIClient();

      if (ai) {
        const result = await generateWithFallback(
          ai,
          `Sebagai Konsultan Pedagogik & Asisten Guru SD Kurikulum Merdeka, jawablah pertanyaan guru berikut dengan ramah, solutif, praktis, dan menginspirasi:\n\n${message}`,
          'Anda adalah Asisten Cerdas Guru Sekolah Dasar Indonesia. Berikan solusi pembelajaran aktif, diferensiasi, asesmen autentik, dan manajemen kelas ramah anak.'
        );

        return res.json({
          reply: result.text || 'Maaf, saya tidak dapat memproses jawaban saat ini.',
          source: result.model,
          online: true
        });
      } else {
        return res.json({
          reply: `Halo Bapak/Ibu Guru! Terima kasih atas pertanyaannya. Sebagai panduan praktis untuk "${message}": \n\n1. **Kaitkan dengan Pengalaman Nyata Siswa**: Gunakan objek konkrit atau studi kasus di sekitar sekolah/lingkungan siswa.\n2. **Terapkan Pembelajaran Berdiferensiasi**: Sesuaikan gaya belajar (visual, auditori, kinestetik) dan kesiapan belajar masing-masing anak.\n3. **Gunakan Asesmen Formatif Berkelanjutan**: Lakukan observasi, umpan balik positif, serta bintang apresiasi untuk memotivasi peserta didik.`,
          source: 'template',
          online: false
        });
      }
    } catch (error: any) {
      console.log('[AI Chat] Fallback triggered cleanly:', error?.message || error);
      return res.json({
        reply: `Halo Bapak/Ibu Guru! Terima kasih atas pertanyaannya. Sebagai panduan praktis pedagogik SD untuk materi/topik yang ditanyakan:\n\n1. **Kaitkan dengan Pengalaman Nyata Siswa**: Gunakan objek konkrit atau studi kasus di sekitar sekolah/lingkungan siswa.\n2. **Terapkan Pembelajaran Berdiferensiasi**: Sesuaikan gaya belajar (visual, auditori, kinestetik) dan kesiapan belajar masing-masing anak.\n3. **Gunakan Asesmen Formatif Berkelanjutan**: Lakukan observasi, umpan balik positif, serta bintang apresiasi untuk memotivasi peserta didik.`,
        source: 'template_fallback',
        online: false
      });
    }
  });

  // Vite middleware for development vs static build for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server SD Administration running on http://localhost:${PORT}`);
  });
}

startServer();
