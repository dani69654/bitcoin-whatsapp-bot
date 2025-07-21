import express from 'express';

const router = express.Router();

router.get('/heartbeat', (_, res) => {
  res.send('❤️ Heartbeat OK');
});

export default router;
