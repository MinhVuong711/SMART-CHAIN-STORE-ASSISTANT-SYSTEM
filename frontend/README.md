# Smart Chain Store – Frontend

Dashboard Home cho hệ thống quản lý chuỗi cửa hàng. Frontend là service Express tĩnh, không thay đổi backend.

## Công nghệ

HTML5, CSS3, JavaScript ES modules, Bootstrap 5, Bootstrap Icons, Axios, Chart.js, Node.js và Express.

## Chạy ứng dụng

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Mở `http://localhost:8080`; health check tại `http://localhost:8080/health`. API Gateway mặc định là `http://localhost:3000` và có thể đổi bằng `API_GATEWAY_URL` trong `.env`.

Home dùng token trong localStorage với key `smart_chain_access_token`. Khi chưa có trang Login, có thể đăng nhập qua backend rồi đặt token tạm thời trong DevTools (không ghi token thật vào source hoặc tài liệu). Frontend không gọi trực tiếp các cổng service 3001–3007.

Các trang Cửa hàng, Sản phẩm, Khách hàng, Đơn hàng, Thống kê, Trợ lý AI và Nhân viên mới chỉ là menu chuẩn bị; chúng hiển thị thông báo đang phát triển.
