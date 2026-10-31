require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const deviceRoutes = require('./routes/devices');

const app = express();

const origins = (process.env.CORS_ORIGIN || '*').split(',').map((s) => s.trim());
app.use(cors({ origin: origins.includes('*') ? '*' : origins }));
app.use(express.json());

app.get('/health', (req, res) =>
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    time: new Date().toISOString(),
  })
);

app.use('/api/devices', deviceRoutes);

app.use((req, res) => res.status(404).json({ message: 'Không tìm thấy đường dẫn' }));

app.use((err, req, res, next) => {
  if (err.name === 'ValidationError')
    return res.status(400).json({
      message: 'Dữ liệu không hợp lệ',
      errors: Object.values(err.errors).map((e) => e.message),
    });
  if (err.code === 11000) return res.status(409).json({ message: 'Mã thiết bị đã tồn tại' });
  if (err.type === 'entity.parse.failed') return res.status(400).json({ message: 'JSON không hợp lệ' });
  if (err.name && err.name.startsWith('Mongo'))
    return res.status(503).json({ message: 'Lỗi kết nối cơ sở dữ liệu' });
  console.error(err);
  res.status(500).json({ message: 'Lỗi máy chủ' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server chạy ở cổng ${PORT}`));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Đã kết nối MongoDB Atlas'))
  .catch((e) => console.error('Lỗi kết nối MongoDB:', e.message));