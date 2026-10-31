require('dotenv').config();
const mongoose = require('mongoose');
const Device = require('./models/Device');

const samples = [
  { deviceId: 'TB001', name: 'Máy chiếu Epson EB-X06', deviceType: 'Máy chiếu', room: 'A101', brand: 'Epson', model: 'EB-X06', quantity: 1, status: 'Đang sử dụng', purchaseDate: '2024-08-15', description: 'Máy chiếu phòng học A101' },
  { deviceId: 'TB002', name: 'Máy tính Dell OptiPlex 3080', deviceType: 'Máy tính', room: 'B203', brand: 'Dell', model: 'OptiPlex 3080', quantity: 30, status: 'Đang sử dụng', purchaseDate: '2023-09-01', description: 'Máy tính phòng thực hành' },
  { deviceId: 'TB003', name: 'Loa kéo JBL PartyBox', deviceType: 'Thiết bị âm thanh', room: 'A102', brand: 'JBL', model: 'PartyBox 110', quantity: 2, status: 'Đang sửa chữa', purchaseDate: '2022-05-20', description: 'Loa bị rè âm thanh' },
  { deviceId: 'TB004', name: 'Máy lạnh Daikin', deviceType: 'Điều hòa', room: 'A101', brand: 'Daikin', model: 'FTKC25', quantity: 2, status: 'Hư hỏng', purchaseDate: '2021-03-10', description: 'Không làm lạnh' },
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    for (const d of samples) await Device.updateOne({ deviceId: d.deviceId }, d, { upsert: true });
    console.log('Đã thêm dữ liệu mẫu thành công');
  } catch (e) {
    console.error('Lỗi:', e.message);
  } finally {
    await mongoose.disconnect();
  }
})();