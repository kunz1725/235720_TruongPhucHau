# Hệ thống quản lý thiết bị phòng học

- Sinh viên: Trương Phúc Hậu
- MSSV: 235720

## Giới thiệu
Ứng dụng quản lý thiết bị phòng học gồm frontend, backend API và cơ sở dữ liệu MongoDB Atlas. Hỗ trợ thêm, xem, tìm kiếm, cập nhật, xóa thiết bị và theo dõi tình trạng sử dụng (Đang sử dụng, Hư hỏng, Đang sửa chữa, Ngừng sử dụng).

## Công nghệ sử dụng
- Frontend: React (Vite)
- Backend: Node.js, Express
- Cơ sở dữ liệu: MongoDB Atlas
- Đóng gói và triển khai: Git/GitHub, Docker, Docker Hub, Render

## Cấu trúc dự án
- backend/: API Node.js + Express
- frontend/: giao diện React
- README.md: tài liệu dự án
- .gitignore: danh sách tệp không đưa lên GitHub

## Hướng dẫn cài đặt và chạy

### Backend
    cd backend
    npm install
Tạo file .env từ .env.example, điền thông tin kết nối MongoDB Atlas, sau đó chạy:
    npm start

### Frontend
    cd frontend
    npm install
    npm run dev