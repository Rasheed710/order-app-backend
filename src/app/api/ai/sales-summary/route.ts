// import { NextResponse } from "next/server";
// import OpenAI from "openai";
// import prisma from "../../../../../lib/prisma";
// import { authMiddleware } from "../../../../../lib/authMiddleware";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY!,
// });

// export const GET = authMiddleware(async (req, context) => {
//   try {
//     const { userRole } = context;

//     if (userRole.toUpperCase() !== "ADMIN") {
//       return NextResponse.json({ message: "Access denied" }, { status: 403 });
//     }

//     // 📦 Fetch last 30 days of orders
//     const orders = await prisma.order.findMany({
//       where: {
//         createdAt: {
//           gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
//         },
//       },
//       include: {
//         party: { select: { name: true } },
//       },
//       orderBy: { createdAt: "desc" },
//     });

//     if (!orders.length)
//       return NextResponse.json({ summary: "No orders in the last 30 days." });

//     // 📊 Aggregate Data
//     const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);
//     const topParties = Object.entries(
//       orders.reduce((acc: Record<string, number>, order) => {
//         const partyName = order.party?.name || "Unknown";
//         acc[partyName] = (acc[partyName] || 0) + order.total;
//         return acc;
//       }, {})
//     )
//       .sort((a, b) => b[1] - a[1])
//       .slice(0, 3)
//       .map(([name, total]) => `${name} (₹${total.toFixed(0)})`);

//     // 🧠 Send to GPT
//     const prompt = `
//       You are a business analyst. Summarize this sales data in 3–4 concise sentences:
//       - Total sales in the last 30 days: ₹${totalSales.toFixed(0)}
//       - Total orders: ${orders.length}
//       - Top customers: ${topParties.join(", ")}
//       Provide a motivating, professional summary.
//     `;

//     const aiResponse = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       messages: [{ role: "user", content: prompt }],
//     });

//     const summary = aiResponse.choices[0]?.message?.content || "No summary generated.";

//     return NextResponse.json({
//       summary,
//       stats: {
//         totalSales,
//         totalOrders: orders.length,
//         topParties,
//       },
//     });
//   } catch (error) {
//     console.error("AI Sales Summary error:", error);
//     return NextResponse.json(
//       { message: "Failed to generate summary" },
//       { status: 500 }
//     );
//   }
// });
import { NextResponse } from "next/server";

import OpenAI from "openai";
import { authMiddleware } from "../../../../../lib/authMiddleware";
import prisma from "../../../../../lib/prisma";


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export const GET = authMiddleware(async (req, context) => {
  try {
    const { userRole } = context;

    if (userRole !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // 📆 Define two ranges: current & previous 30 days
    const today = new Date();
    const currentStart = new Date(today);
    currentStart.setDate(today.getDate() - 30);

    const previousEnd = new Date(currentStart);
    const previousStart = new Date(previousEnd);
    previousStart.setDate(previousEnd.getDate() - 30);

    // === Current Period ===
    const currentOrders = await prisma.order.findMany({
      where: {
        createdAt: { gte: currentStart, lte: today },
      },
      select: { createdAt: true, total: true },
    });

    // === Previous Period ===
    const previousOrders = await prisma.order.findMany({
      where: {
        createdAt: { gte: previousStart, lt: currentStart },
      },
      select: { createdAt: true, total: true },
    });

    // === No data edge case ===
    if (currentOrders.length === 0 && previousOrders.length === 0) {
      return NextResponse.json({
        summary: "No sales data available for the past two months.",
      });
    }

    // === Compute current stats ===
    const currentTotals: Record<string, number> = {};
    let currentRevenue = 0;

    for (const order of currentOrders) {
      const date = order.createdAt.toISOString().split("T")[0];
      currentTotals[date] = (currentTotals[date] || 0) + order.total;
      currentRevenue += order.total;
    }

    const currentSorted = Object.entries(currentTotals).sort((a, b) =>
      a[0] > b[0] ? 1 : -1
    );

    const currentHighest = currentSorted.reduce(
      (max, curr) => (curr[1] > max[1] ? curr : max),
      ["", 0]
    );
    const currentLowest = currentSorted.reduce(
      (min, curr) => (curr[1] < min[1] ? curr : min),
      ["", Number.MAX_VALUE]
    );

    // === Compute previous stats ===
    let previousRevenue = previousOrders.reduce((sum, o) => sum + o.total, 0);

    // === Compare performance ===
    const growth =
      previousRevenue > 0
        ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
        : 0;

    const trend = growth > 5 ? "upward" : growth < -5 ? "downward" : "stable";

    const salesStats = {
      currentRevenue,
      previousRevenue,
      growth: Number(growth.toFixed(2)),
      trend,
      highestDay: currentHighest[0],
      highestValue: currentHighest[1],
      lowestDay: currentLowest[0],
      lowestValue: currentLowest[1],
      totalDays: currentSorted.length,
    };

    // 🧠 Build GPT prompt
    const prompt = `
You are a business intelligence assistant. Write a 3-5 sentence summary of the sales performance
based on this data, focusing on trends, growth, and performance highlights.
Use a professional, positive, and concise tone suitable for a dashboard.

Sales Data:
- Current Period Revenue (Last 30 Days): ₹${salesStats.currentRevenue.toFixed(2)}
- Previous Period Revenue: ₹${salesStats.previousRevenue.toFixed(2)}
- Growth: ${salesStats.growth.toFixed(2)}%
- Highest Sales Day: ${salesStats.highestDay} (₹${salesStats.highestValue.toFixed(2)})
- Lowest Sales Day: ${salesStats.lowestDay} (₹${salesStats.lowestValue.toFixed(2)})
- Overall Trend: ${salesStats.trend}

Keep the language simple, informative, and motivational.
    `;

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a financial analysis assistant for business dashboards." },
        { role: "user", content: prompt },
      ],
    });

    const aiSummary = aiResponse.choices[0]?.message?.content?.trim();

    return NextResponse.json({
      summary: aiSummary || "No AI summary generated.",
      stats: salesStats,
    });
  } catch (error: any) {
    console.error("AI Sales Summary Error:", error);
    return NextResponse.json(
      { message: "Error generating AI summary" },
      { status: 500 }
    );
  }
});
