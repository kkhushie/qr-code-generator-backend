const mongoose = require('mongoose');

const qrCodeSchema = new mongoose.Schema({
    mylink:String,
    link: {
        type: String,
        required: true,
        
    },
    qrCodeUrl: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const QRCode = mongoose.model('QRCode', qrCodeSchema);

module.exports = QRCode;
