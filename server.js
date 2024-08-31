const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const QRCode = require('qrcode');
const QRCodeModel = require('./models/QRCode.models')
require('dotenv').config();
// Connect to MongoDB
const port=process.env.PORT
const dbUrl = process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/qrcodedb"; // Use environment variable or fallback to default

mongoose.connect(dbUrl).then(() => {
  console.log('Database connected');
}).catch((err) => {
  console.error('Database connection error', err);
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
    res.render('index');
});

app.get("/about", (req, res) => {
    res.render('about');
});

// Function to generate a QR code
let generateQRCode = async (link) => {
    try {
        const url = await QRCode.toDataURL(link);
        return url;
    } catch (err) {
        console.error(err);
        return null;
    }
};

// Route to generate and save QR Code
app.post('/generate-qr', async (req, res) => {
    const { link } = req.body;

    // Generate the QR code
    const qrCodeUrl = await generateQRCode(link);

    if (qrCodeUrl) {
        // Save the generated QR code and link to the database
        const qrCode = new QRCodeModel({ link, qrCodeUrl });
        await qrCode.save();

        // Render the page with the generated QR code
        res.render('qrcodePage', { url: qrCodeUrl });
    } else {
        res.status(500).send('Failed to generate QR code');
    }
});

app.get('/view-qr', async (req, res) => {
    const qrCodes = await QRCodeModel.find().sort({ createdAt: -1 });
    res.render('viewQRCodes', { qrCodes });
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
