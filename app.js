const express = require('express');
const qrcode = require('wifi-qr-code-generator');

const app = express();

// Static Files
app.use(express.static('./public'));

// Body Parser
app.use(express.json());

const PORT = 8000;

const generateQR = async (req, res) => {
  const { sid, password, encryption } = req.body;

  // encryption can be None, WPA, and WEP

  try {
    const pr = await qrcode.generateWifiQRCode({
      ssid: sid,
      password: password,
      encryption: encryption ? encryption : 'WPA',
      hiddenSSID: false,
      outputFormat: { type: 'image/png' },
    });

    res.status(201).json({ QR: pr });
  } catch (error) {
    res.json({ error });
  }
};

const generateQRTerminal = async (req, res) => {
  try {
    const pr = await qrcode.generateWifiQRCode({
      ssid: 'Hello world',
      password: 'testpass',
      encryption: 'WPA',
      hiddenSSID: false,
      outputFormat: { type: 'terminal' },
    });
    res.status(201).json({ QR: pr });
  } catch (error) {
    res.status(200).json({ error });
  }
};

app.post('/api/v1/qr', generateQR);
app.post('/api/v1/qr/terminal', generateQRTerminal);

app.listen(PORT, console.log(`The server is listening on the port ${PORT}`));
