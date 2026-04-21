const axios = require("axios");
const intentService = require("./intent.service");
const dataService = require("./data.service");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Gọi Gemini API
async function callGemini(systemPrompt, userMessage) {
  const res = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      contents: [
        {
          parts: [
            {
              text: `${systemPrompt}\n\nCâu hỏi: ${userMessage}`,
            },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      },
    },
    {
      headers: { "Content-Type": "application/json" },
      timeout: 15000,
    },
  );

  return res.data.candidates[0].content.parts[0].text;
}

// Fallback khi không có API key hoặc Gemini lỗi
function generateFallbackAnswer(intent, data) {
  if (!data) {
    return "Hiện tại không thể lấy dữ liệu từ hệ thống. Vui lòng thử lại sau.";
  }

  if (intent === "revenue") {
    return `Tổng doanh thu cửa hàng đạt ${Number(data.total_revenue).toLocaleString("vi-VN")} VNĐ với ${data.total_orders} đơn hàng.`;
  }

  if (intent === "revenue_daily") {
    if (!data.length) return "Chưa có dữ liệu doanh thu theo ngày.";
    const latest = data[0];
    return `Ngày ${latest.date}: doanh thu đạt ${Number(latest.total_revenue).toLocaleString("vi-VN")} VNĐ với ${latest.total_orders} đơn hàng.`;
  }

  if (intent === "top_products") {
    if (!data.top_products?.length) return "Chưa có dữ liệu sản phẩm bán chạy.";
    const list = data.top_products
      .map((p, i) => `${i + 1}. ${p.name} (${p.total_quantity} cái)`)
      .join(", ");
    return `Sản phẩm bán chạy: ${list}.`;
  }

  if (intent === "orders") {
    const pending = data.filter((o) => o.status === "pending").length;
    return `Tổng ${data.length} đơn hàng, ${pending} đơn đang chờ xử lý.`;
  }

  if (intent === "customers") {
    return `Cửa hàng hiện có ${data.length} khách hàng.`;
  }

  if (intent === "summary" || intent === "general") {
    return `Tổng quan: ${data.total_orders} đơn hàng, doanh thu ${Number(data.total_revenue).toLocaleString("vi-VN")} VNĐ. Hôm nay ${data.today_orders} đơn, doanh thu ${Number(data.today_revenue).toLocaleString("vi-VN")} VNĐ. Tổng ${data.total_products} sản phẩm.`;
  }

  return "Xin lỗi, tôi chưa hiểu câu hỏi. Bạn có thể hỏi về doanh thu, sản phẩm bán chạy, đơn hàng hoặc khách hàng.";
}

// MAIN
exports.ask = async ({ question, store_id, user, token }) => {
  // BƯỚC 1: Detect intent
  const intent = intentService.detect(question);

  // BƯỚC 2: Lấy data thật
  let data = null;
  let dataContext = "";

  try {
    if (intent === "revenue") {
      data = await dataService.getRevenue(store_id, token);
      dataContext = `
Dữ liệu doanh thu:
- Tổng đơn hàng: ${data.total_orders}
- Tổng doanh thu: ${Number(data.total_revenue).toLocaleString("vi-VN")} VNĐ
      `;
    } else if (intent === "revenue_daily") {
      data = await dataService.getDailyRevenue(store_id, token);
      const lines = data
        .slice(0, 7)
        .map(
          (d) =>
            `  Ngày ${d.date}: ${d.total_orders} đơn, ${Number(d.total_revenue).toLocaleString("vi-VN")} VNĐ`,
        )
        .join("\n");
      dataContext = `Doanh thu 7 ngày gần nhất:\n${lines}`;
    } else if (intent === "top_products") {
      data = await dataService.getTopProducts(store_id, token);
      const lines = data.top_products
        .map(
          (p, i) =>
            `  ${i + 1}. ${p.name}: ${p.total_quantity} cái, ${Number(p.total_revenue).toLocaleString("vi-VN")} VNĐ`,
        )
        .join("\n");
      dataContext = `Top sản phẩm bán chạy:\n${lines || "Chưa có dữ liệu"}`;
    } else if (intent === "orders") {
      data = await dataService.getOrders(store_id, token);
      const pending = data.filter((o) => o.status === "pending").length;
      dataContext = `
Thông tin đơn hàng:
- Tổng đơn: ${data.length}
- Đang chờ xử lý: ${pending}
      `;
    } else if (intent === "customers") {
      data = await dataService.getCustomers(store_id, token);
      dataContext = `Tổng khách hàng: ${data.length}`;
    } else {
      // summary hoặc general
      data = await dataService.getSummary(store_id, token);
      dataContext = `
Tổng quan cửa hàng:
- Tổng đơn hàng: ${data.total_orders}
- Tổng doanh thu: ${Number(data.total_revenue).toLocaleString("vi-VN")} VNĐ
- Đơn hôm nay: ${data.today_orders}
- Doanh thu hôm nay: ${Number(data.today_revenue).toLocaleString("vi-VN")} VNĐ
- Tổng sản phẩm: ${data.total_products}
      `;
    }
  } catch (err) {
    dataContext = "Không thể lấy dữ liệu từ hệ thống.";
  }

  // BƯỚC 3: Gọi Gemini hoặc fallback
  const systemPrompt = `
Bạn là trợ lý kinh doanh thông minh cho hệ thống quản lý chuỗi cửa hàng.
Chỉ trả lời dựa trên dữ liệu thực tế được cung cấp.
Trả lời ngắn gọn, rõ ràng bằng tiếng Việt.
Không bịa đặt số liệu.

Dữ liệu thực tế:
${dataContext}
  `;

  if (GEMINI_API_KEY && GEMINI_API_KEY !== "your_gemini_api_key") {
    try {
      const answer = await callGemini(systemPrompt, question);
      return answer;
    } catch (err) {
      console.error("Gemini error, dùng fallback:", err.message);
      return generateFallbackAnswer(intent, data);
    }
  } else {
    return generateFallbackAnswer(intent, data);
  }
};
