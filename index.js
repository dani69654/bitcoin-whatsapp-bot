const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

async function main() {
  const client = new Client();

  client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('Scansiona il QR code con WhatsApp');
  });

  client.on('ready', async () => {
    console.log('Connected!');

    try {
      // Find group by name
      const chats = await client.getChats();
      const group = chats.find((chat) => chat.isGroup && chat.name === '₿ 🇸🇻🌋🧑‍🚀🌱⚡🚚⛓️‍💥');

      if (group) {
        console.log('Gruppo trovato:', group.name);

        // Invia il primo aggiornamento immediatamente
        await sendBitcoinUpdate(group);

        // Programma aggiornamenti ogni 24 ore (86400000 ms)
        setInterval(
          async () => {
            try {
              await sendBitcoinUpdate(group);
            } catch (error) {
              console.error("Errore nell'invio dell'aggiornamento programmato:", error);
            }
          },
          24 * 60 * 60 * 1000
        );

        console.log('Bot avviato! Aggiornamenti programmati ogni 24 ore.');
      } else {
        console.log('Gruppo non trovato');
        console.log('Gruppi disponibili:');
        chats
          .filter((chat) => chat.isGroup)
          .forEach((chat) => {
            console.log(`- ${chat.name} (ID: ${chat.id._serialized})`);
          });
      }
    } catch (error) {
      console.error("Errore nell'inizializzazione:", error);
    }
  });

  client.on('message', async (message) => {
    // Rispondi a comandi specifici
    if (message.body.toLowerCase() === '!btc' || message.body.toLowerCase() === '!bitcoin') {
      try {
        const chat = await message.getChat();
        if (chat.isGroup) {
          await sendBitcoinUpdate(chat);
        }
      } catch (error) {
        console.error('Errore nel comando manuale:', error);
      }
    }
  });

  await client.initialize();
}

// Funzione principale per inviare aggiornamenti Bitcoin
async function sendBitcoinUpdate(group) {
  try {
    console.log('Recuperando dati Bitcoin...');

    const [priceData, bitcoinStats, nodeData, fearGreedData] = await Promise.all([
      getBitcoinPrice(),
      getBitcoinStats(),
      getBitcoinNodes(),
      getFearGreedIndex(),
    ]);

    const message = formatBitcoinMessage(priceData, bitcoinStats, nodeData, fearGreedData);

    await group.sendMessage(message);
    console.log('Aggiornamento Bitcoin inviato alle:', new Date().toLocaleString('it-IT'));
  } catch (error) {
    console.error("Errore nell'invio dell'aggiornamento Bitcoin:", error);
    await group.sendMessage('❌ Errore nel recuperare i dati Bitcoin. Riproverò più tardi.');
  }
}

// Recupera prezzi Bitcoin
async function getBitcoinPrice() {
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,eur&include_24hr_change=true&include_market_cap=true'
    );

    const data = response.data.bitcoin;
    return {
      usd: data.usd,
      eur: data.eur,
      usd_24h_change: data.usd_24h_change,
      eur_24h_change: data.eur_24h_change,
      market_cap: data.usd_market_cap,
    };
  } catch (error) {
    console.error('Errore nel recuperare i prezzi:', error);
    return null;
  }
}

// Recupera dati ETF Bitcoin
async function getBitcoinStats() {
  try {
    // Utilizzo API alternativa per dati ETF
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/bitcoin');
    const marketData = response.data.market_data;

    return {
      volume_24h: marketData.total_volume.usd,
      market_cap_change_24h: marketData.market_cap_change_percentage_24h,
    };
  } catch (error) {
    console.error('Errore nel recuperare dati ETF:', error);
    return null;
  }
}

// Recupera dati nodi Bitcoin
async function getBitcoinNodes() {
  try {
    const response = await axios.get('https://bitnodes.io/api/v1/snapshots/latest/');

    return {
      total_nodes: response.data.total_nodes,
      timestamp: response.data.timestamp,
    };
  } catch (error) {
    console.error('Errore nel recuperare dati nodi:', error);
    return null;
  }
}

// Recupera Fear & Greed Index
async function getFearGreedIndex() {
  try {
    const response = await axios.get('https://api.alternative.me/fng/');
    const data = response.data.data[0];

    return {
      value: data.value,
      classification: data.value_classification,
    };
  } catch (error) {
    console.error('Errore nel recuperare Fear & Greed Index:', error);
    return null;
  }
}

// Formatta il messaggio con tutti i dati
function formatBitcoinMessage(priceData, bitcoinStats, nodeData, fearGreedData) {
  const timestamp = new Date().toLocaleString('it-IT', {
    timeZone: 'Europe/Rome',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  let message = `🚀 *AGGIORNAMENTO BITCOIN* 🚀\n`;
  message += `📅 ${timestamp}\n\n`;

  // Prezzi
  if (priceData) {
    const usdChange = priceData.usd_24h_change >= 0 ? '📈' : '📉';
    const eurChange = priceData.eur_24h_change >= 0 ? '📈' : '📉';

    message += `💰 *PREZZI*\n`;
    message += `🇺🇸 $${priceData.usd.toLocaleString('en-US')} ${usdChange} ${priceData.usd_24h_change.toFixed(2)}%\n`;
    message += `🇪🇺 €${priceData.eur.toLocaleString('it-IT')} ${eurChange} ${priceData.eur_24h_change.toFixed(2)}%\n`;
    message += `📊 Market Cap: $${(priceData.market_cap / 1000000000).toFixed(0)}B\n\n`;
  }

  // ETF e Volume
  if (bitcoinStats) {
    message += `📈 *MERCATO*\n`;
    message += `💹 Volume 24h: $${(bitcoinStats.volume_24h / 1000000000).toFixed(1)}B\n`;
    message += `📊 Market Cap Change: ${bitcoinStats.market_cap_change_24h.toFixed(2)}%\n\n`;
  }

  // Nodi Bitcoin
  if (nodeData) {
    message += `🌐 *RETE BITCOIN*\n`;
    message += `⚡ Nodi attivi: ${nodeData.total_nodes.toLocaleString('it-IT')}\n`;
  }

  // Fear & Greed Index
  if (fearGreedData) {
    const emoji = getFearGreedEmoji(fearGreedData.value);
    message += `😱 *FEAR & GREED INDEX*\n`;
    message += `${emoji} ${fearGreedData.value}/100 - ${fearGreedData.classification}\n\n`;
  }

  // Informazioni aggiuntive
  message += `⚡ *INFO EXTRA*\n`;
  message += `🏦 Next halving: ~2028\n`;

  message += `🤖 _Aggiornamento automatico ogni 24h_\n`;
  message += `💡 _Scrivi !btc per aggiornamento manuale_`;

  return message;
}

// Emoji per Fear & Greed Index
function getFearGreedEmoji(value) {
  if (value <= 25) return '😱'; // Extreme Fear
  if (value <= 45) return '😰'; // Fear
  if (value <= 55) return '😐'; // Neutral
  if (value <= 75) return '😃'; // Greed
  return '🤑'; // Extreme Greed
}

// Funzioni di utilità esistenti
async function sendToGroupById(client, groupId, message) {
  try {
    const chatId = groupId + '@g.us';
    await client.sendMessage(chatId, message);
    console.log('Messaggio inviato al gruppo con ID:', groupId);
  } catch (error) {
    console.error("Errore nell'invio:", error);
  }
}

async function findGroupByPartialName(client, partialName) {
  const chats = await client.getChats();
  const groups = chats.filter((chat) => chat.isGroup && chat.name.toLowerCase().includes(partialName.toLowerCase()));

  console.log('Gruppi trovati:');
  groups.forEach((group) => {
    console.log(`- ${group.name} (ID: ${group.id._serialized})`);
  });

  return groups;
}

main().catch(console.error);
