import express from 'express';

const router = express.Router();

router.get('/heartbeat', (_, res) => {
  console.log('❤️ Heartbeat OK');
  res.send('❤️ Heartbeat OK');
});

export default router;
