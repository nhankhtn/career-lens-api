export function cleanText(rawText: string): string {
  return rawText
    .replace(/\d+\.\s*/g, "") // Xóa các số thứ tự kiểu "1. ", "2. ", ...
    .replace(/\n+/g, " ") // Xóa xuống dòng thừa thành 1 khoảng trắng
    .replace(/\s+/g, " ") // Gom nhiều khoảng trắng thành 1
    .trim(); // Xóa khoảng trắng đầu cuối
}
