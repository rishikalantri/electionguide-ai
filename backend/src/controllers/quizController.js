'use strict';

const { initializeApp, getApps, cert, applicationDefault } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

// ─── Firestore initialisation ─────────────────────────────────────────────────
//
// Credential resolution (same logic as toolsController — pure ADC):
//
//   Local dev  → set GOOGLE_APPLICATION_CREDENTIALS in .env pointing to a
//                service account JSON file in secrets/.  The Firebase Admin
//                SDK reads this env var automatically after dotenv.config().
//
//   Cloud Run  → attach a service account to the Cloud Run service in GCP
//                Console. The SDK uses the GCE metadata server automatically.
//                Do NOT set GOOGLE_APPLICATION_CREDENTIALS on Cloud Run.
//
// FIRESTORE_DATABASE_ID:
//   Defaults to "(default)".  Set to a custom ID in .env if you are using
//   a named Firestore database (Firebase / GCP named databases feature).

const DATABASE_ID = process.env.FIRESTORE_DATABASE_ID || '(default)';
const PROJECT_ID  = process.env.GOOGLE_CLOUD_PROJECT_ID;

let db = null;

function initFirestore() {
  // Avoid re-initialising if already done (module cache re-use).
  if (db) return;

  // Firebase Admin SDK can only have one default app; guard against double-init.
  if (getApps().length === 0) {
    try {
      initializeApp({
        credential: applicationDefault(),
        // projectId is optional when running on GCP infrastructure (Cloud Run,
        // GCE, etc.) — the SDK detects it from the metadata server.
        // Providing it explicitly helps when running locally with ADC.
        ...(PROJECT_ID && { projectId: PROJECT_ID }),
      });
      console.log(`[quiz] Firebase Admin initialised. Firestore database: "${DATABASE_ID}"`);
    } catch (err) {
      console.warn('[quiz] Firebase Admin init failed — Firestore will mock.', err.message);
      return; // db stays null → handlers fall through to mock paths
    }
  }

  try {
    // getFirestore(app, databaseId) selects the named database.
    // Passing "(default)" is equivalent to calling getFirestore() with no args.
    db = getFirestore(getApps()[0], DATABASE_ID);
  } catch (err) {
    console.warn('[quiz] getFirestore failed — Firestore will mock.', err.message);
    db = null;
  }
}

// Initialise eagerly at module load so any credential problem surfaces in
// server logs at startup rather than silently on first request.
initFirestore();

// ─── Save quiz score ──────────────────────────────────────────────────────────

exports.saveScore = async (req, res) => {
  const { sessionId, score, totalQuestions } = req.body;

  if (!sessionId || score === undefined || !totalQuestions) {
    return res.status(400).json({ error: 'sessionId, score, and totalQuestions are required' });
  }

  if (!db) {
    console.log(`[quiz] Mock save: ${sessionId} → ${score}/${totalQuestions}`);
    return res.json({ message: 'Score saved successfully (mocked — Firestore not connected)' });
  }

  try {
    await db.collection('quiz_scores').doc(sessionId).set({
      score,
      totalQuestions,
      timestamp: FieldValue.serverTimestamp(),
    });
    res.json({ message: 'Score saved successfully' });
  } catch (err) {
    console.error('[quiz] saveScore error:', err.message);
    res.status(500).json({ error: 'Failed to save score' });
  }
};

// ─── Get leaderboard ──────────────────────────────────────────────────────────

exports.getLeaderboard = async (req, res) => {
  if (!db) {
    return res.json({
      leaderboard: [
        { id: 'session-1', score: 10, totalQuestions: 10 },
        { id: 'session-2', score: 9,  totalQuestions: 10 },
        { id: 'session-3', score: 8,  totalQuestions: 10 },
      ],
      mock: true,
    });
  }

  try {
    const snapshot = await db.collection('quiz_scores')
      .orderBy('score', 'desc')
      .limit(10)
      .get();

    const leaderboard = [];
    snapshot.forEach((doc) => leaderboard.push({ id: doc.id, ...doc.data() }));
    res.json({ leaderboard });
  } catch (err) {
    console.error('[quiz] getLeaderboard error:', err.message);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
};

// Export db reference so tests can inspect it.
exports._getDb = () => db;
