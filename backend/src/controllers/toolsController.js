'use strict';

const { Translate } = require('@google-cloud/translate').v2;
const textToSpeech = require('@google-cloud/text-to-speech');

// ─── Lazy client initialisation ──────────────────────────────────────────────
//
// Credential resolution order (identical for local dev and Cloud Run):
//
//   1. GOOGLE_APPLICATION_CREDENTIALS env var (set in .env for local dev,
//      pointing to a service account JSON in secrets/).
//   2. Application Default Credentials (ADC) — Cloud Run automatically
//      injects credentials from the attached service account via the
//      GCE metadata server. No env var required on Cloud Run.
//
// The Google Cloud SDK reads GOOGLE_APPLICATION_CREDENTIALS automatically;
// no code here needs to parse it. dotenv.config() in index.js loads it from
// .env before any module runs.
//
// We initialise clients lazily (on first use) so that a missing credentials
// file during startup does not crash the process — it degrades to a mock.

let translate = null;
let ttsClient = null;
let initAttempted = false;

function initClients() {
  if (initAttempted) return;
  initAttempted = true;

  try {
    translate = new Translate();
    ttsClient = new textToSpeech.TextToSpeechClient();
    console.log('[tools] Google Cloud clients initialised (ADC).');
  } catch (err) {
    console.warn('[tools] Google Cloud client init failed — will use mock responses.', err.message);
    translate = null;
    ttsClient = null;
  }
}

// ─── Translation ─────────────────────────────────────────────────────────────

exports.translateText = async (req, res) => {
  const { text, targetLanguage } = req.body;

  if (!text || !targetLanguage) {
    return res.status(400).json({ error: 'text and targetLanguage are required' });
  }

  initClients();

  if (!translate) {
    // No credentials available — return a clearly labelled mock so the UI
    // can still function during local development without GCP credentials.
    return res.json({
      translatedText: `[Mock – ${targetLanguage}]: ${text}`,
      mock: true,
    });
  }

  try {
    const [translation] = await translate.translate(text, targetLanguage);
    res.json({ translatedText: translation });
  } catch (err) {
    console.error('[tools] Translation error:', err.message);
    res.status(500).json({ error: 'Failed to translate text' });
  }
};

// ─── Text-to-Speech ───────────────────────────────────────────────────────────

exports.textToSpeech = async (req, res) => {
  const { text, languageCode = 'en-US' } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'text is required' });
  }

  initClients();

  if (!ttsClient) {
    return res.status(503).json({
      error: 'Text-to-Speech requires Google Cloud credentials. '
        + 'Set GOOGLE_APPLICATION_CREDENTIALS in .env (local) '
        + 'or attach a service account to the Cloud Run service.',
    });
  }

  try {
    const [response] = await ttsClient.synthesizeSpeech({
      input: { text },
      voice: { languageCode, name: `${languageCode}-Standard-A` },
      audioConfig: { audioEncoding: 'MP3' },
    });

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': 'attachment; filename="speech.mp3"',
    });
    res.send(response.audioContent);
  } catch (err) {
    console.error('[tools] TTS error:', err.message);
    res.status(500).json({ error: 'Failed to generate speech' });
  }
};
