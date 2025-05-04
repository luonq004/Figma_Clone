<div align="center">
  <div>
    <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="typescript" />
    <img src="https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="nextdotjs" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
  </div>

  <h3 align="center">Real Time Figma Clone</h3>
</div>

## 📋 <a name="table">Bảng nội dung</a>

1. 🤖 [Giới thiệu](#introduction)
2. ⚙️ [Công nghệ](#tech-stack)
3. 🔋 [Tính năng](#features)
4. 🤸 [Bắt đầu nhanh](#quick-start)

## <a name="introduction">🤖 Introduction</a>

Bản sao tối giản của Figma cho thấy cách thêm các tính năng thực tế như cộng tác trực tiếp với trò chuyện bằng con trỏ, bình luận, phản ứng và thiết kế bản vẽ (hình dạng, tải hình ảnh lên) trên canvas bằng fabric.js.

## <a name="tech-stack">⚙️ Công nghệ</a>

- Angular
- TypeScript
- Liveblocks
- Fabric.js
- Angular Material
- Tailwind CSS

## <a name="features">🔋 Tính năng</a>

👉 **Nhiều con trỏ, Trò chuyện bằng con trỏ và Phản ứng**: Cho phép nhiều người dùng cộng tác cùng lúc bằng cách hiển thị con trỏ riêng lẻ, cho phép trò chuyện thời gian thực và phản hồi để giao tiếp tương tác.

👉 **Người dùng đang hoạt động**: Hiển thị danh sách những người dùng đang hoạt động trong môi trường cộng tác, cung cấp khả năng hiển thị những người dùng hiện đang tương tác.

👉 **Tạo ra các hình dạng khác nhau**: Cung cấp các công cụ cho người dùng tạo ra nhiều hình dạng khác nhau trên canvas, cho phép tạo ra nhiều yếu tố thiết kế khác nhau

👉 **Tải lên hình ảnh**: Nhập hình ảnh vào canvas, mở rộng phạm vi nội dung trực quan trong thiết kế

👉 **Tùy chỉnh**: Cho phép người dùng điều chỉnh các thuộc tính của các thành phần thiết kế, mang lại sự linh hoạt trong việc tùy chỉnh và tinh chỉnh các thành phần trực quan

👉 **Vẽ tự do**: Cho phép người dùng vẽ tự do trên canvas, thúc đẩy khả năng thể hiện nghệ thuật và thiết kế sáng tạo.

👉 **Hoàn tác/Làm lại**: Cung cấp khả năng đảo ngược (hoàn tác) hoặc khôi phục (làm lại) các hành động trước đó, mang lại sự linh hoạt trong việc ra quyết định thiết kế

👉 **Hành động bàn phím**: Cho phép người dùng sử dụng phím tắt cho nhiều hành động khác nhau, bao gồm sao chép, dán, xóa và kích hoạt phím tắt cho các tính năng như mở trò chuyện bằng con trỏ, phản ứng, v.v., giúp tăng hiệu quả và khả năng truy cập.

👉 **Xóa, Thay đổi kích thước, Di chuyển, Xóa, Xuất Canvas**: Cung cấp nhiều chức năng để quản lý các thành phần thiết kế, bao gồm xóa, thay đổi tỷ lệ, di chuyển, xóa khung vẽ và xuất bản thiết kế cuối cùng để sử dụng bên ngoài.

## <a name="quick-start">🤸 Bắt đầu nhanh</a>

Thực hiện theo các bước sau để thiết lập dự án

**Điều kiện tiên quyết**

Hãy đảm bảo rằng đã cài đặt những phần mềm sau trên máy:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)

**Sao chép từ repo**

```bash
git clone https://github.com/luonq004/Figma_Clone
cd Figma_Clone
```

**Cài đặt**

Cài đặt các dependencies của dự án bằng npm

```bash
npm install
```

**Cấu hình biến toàn cục**

Tạo 1 folder có tên là `environments` bên trong folder `src` sau đó tạo 1 file `environments.development.ts` và thêm nội dung:

```env
export const environment = {
  LIVEBLOCKS_PUBLIC_KEY:
};
```

Thay thế các giá trị để trống bằng thông tin xác thực Liveblocks. Ta có thể lấy được các thông tin xác thực này bằng cách đăng ký trên [Liveblocks website](https://liveblocks.io).

**Chạy dự án**

```bash
ng serve
```

Mở [http://localhost:4200](http://localhost:4200) trên trình duyệt
