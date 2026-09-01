# Smart Chain Store – Frontend

Frontend dashboard cho hệ thống quản lý chuỗi cửa hàng, chạy độc lập bằng Express và không thay đổi backend.

## Công nghệ

HTML5, CSS3, JavaScript ES modules, Bootstrap 5, Bootstrap Icons, Axios, Chart.js, Node.js và Express.

## Chạy ứng dụng

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Mở `http://localhost:8080`; health check tại `http://localhost:8080/health`. API Gateway mặc định là `http://localhost:3000`, có thể đổi bằng `API_GATEWAY_URL` trong `.env`.

## Các trang

- Đăng nhập và đăng xuất
- Tổng quan
- Quản lý cửa hàng
- Quản lý sản phẩm
- Quản lý khách hàng
- Quản lý đơn hàng
- Thống kê
- Trợ lý AI

Tài khoản Staff được Admin tạo qua `POST /auth/register`. Backend chưa có đủ API CRUD để xây dựng trang quản lý nhân viên.

Frontend gọi API qua Gateway và tự động gắn JWT từ localStorage; không gọi trực tiếp các service nội bộ.
