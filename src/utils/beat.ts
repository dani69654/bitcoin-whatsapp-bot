import axios from 'axios';
import cron from 'node-cron';
import { env } from '../lib/env';

export const startHeartbeat = () => {
  cron.schedule('* * * * *', async () => {
    try {
      await axios.get(`${env.serverUrl}/heartbeat`);
    } catch (err) {
      console.error('Heartbeat ping failed', err);
    }
  });
};
