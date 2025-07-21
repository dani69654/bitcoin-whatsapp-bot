import axios from 'axios';
import cron from 'node-cron';
import { env } from '../lib/env';

export const startHeartbeat = () => {
  cron.schedule('* * * * *', () => {
    axios.get(`${env.serverUrl}/heartbeat`).catch(() => null);
  });
};
