// Detect intent từ câu hỏi dựa trên keyword matching
// Theo báo cáo: "Intent được xác định dựa trên từ khóa (keyword matching)"

exports.detect = (question) => {
  const q = question.toLowerCase();

  // REVENUE intent
  if (
    q.includes("doanh thu") ||
    q.includes("revenue") ||
    q.includes("tiền") ||
    q.includes("thu nhập") ||
    q.includes("bán được") ||
    q.includes("tổng tiền")
  ) {
    // Check xem hỏi theo ngày hay tổng
    if (
      q.includes("hôm nay") ||
      q.includes("ngày") ||
      q.includes("today") ||
      q.includes("theo ngày")
    ) {
      return "revenue_daily";
    }
    return "revenue";
  }

  // TOP PRODUCTS intent
  if (
    q.includes("sản phẩm") ||
    q.includes("product") ||
    q.includes("bán chạy") ||
    q.includes("hot") ||
    q.includes("tồn kho") ||
    q.includes("stock") ||
    q.includes("inventory")
  ) {
    return "top_products";
  }

  // ORDERS intent
  if (
    q.includes("đơn hàng") ||
    q.includes("order") ||
    q.includes("giao dịch") ||
    q.includes("transaction")
  ) {
    return "orders";
  }

  // CUSTOMERS intent
  if (
    q.includes("khách hàng") ||
    q.includes("customer") ||
    q.includes("khách") ||
    q.includes("vip")
  ) {
    return "customers";
  }

  // SUMMARY intent
  if (
    q.includes("tổng quan") ||
    q.includes("summary") ||
    q.includes("báo cáo") ||
    q.includes("thống kê") ||
    q.includes("tổng hợp") ||
    q.includes("overview")
  ) {
    return "summary";
  }

  // Không rõ intent
  return "general";
};
