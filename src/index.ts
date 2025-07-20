import { Client, LocalAuth } from 'whatsapp-web.js';
import qrCode from 'qrcode-terminal';
import { findGroupChat } from './utils/group';
import { exitWithError } from './lib/process';
import { btcPriceFetcher, etfDataFetcher, fearGreedIndexFetcher, fetchNetworkData } from './utils/fetch';
import { writeReport } from './utils/msg';
import cron from 'node-cron';

const main = async () => {
  const client = new Client({
    authStrategy: new LocalAuth(),
  });

  // WA auth
  client.on('qr', (qr) => {
    qrCode.generate(qr, { small: true });
    console.log('Scan the QR code with your WhatsApp app');
  });

  // Logic
  client.on('ready', async () => {
    const chat = await findGroupChat(client);
    if (!chat) {
      exitWithError();
      return;
    }

    // Schedule the report every day at 9am Rome time
    cron.schedule(
      '0 9 * * *',
      async () => {
        const [etfData, priceData, fearAndGreedData, networkData] = await Promise.all([
          etfDataFetcher().catch(() => null),
          btcPriceFetcher().catch(() => null),
          fearGreedIndexFetcher().catch(() => null),
          fetchNetworkData().catch(() => null),
        ]);

        const report = writeReport({
          etfData,
          priceData,
          fearAndGreedData,
          networkData,
        });

        await chat.sendMessage(report);
      },
      {
        timezone: 'Europe/Rome',
      }
    );
  });

  await client.initialize();
};

main();

export default main;
