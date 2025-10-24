// // pages/api/products/index.ts
// import type { NextApiResponse } from 'next'
// import { AuthenticatedRequest, authMiddleware, adminMiddleware } from '../../../../lib/authMiddleware'
// import prisma from '../../../../lib/prisma'

// const handleProducts = async (req: AuthenticatedRequest, res: NextApiResponse) => {
//   switch (req.method) {
//     case 'GET':
//       // Anyone authenticated can get products
//       try {
//         const products = await prisma.product.findMany({
//           orderBy: { createdAt: 'desc' },
//         })
//         res.status(200).json(products)
//       } catch (error) {
//         console.error('Get all products error:', error)
//         res.status(500).json({ message: 'Something went wrong fetching products' })
//       }
//       break

//     case 'POST':
//       // Only admins can create products
//       return adminMiddleware(async (adminReq, adminRes) => {
//         try {
//           const { name, description, price, imageUrl, category, stock } = adminReq.body
//           const newProduct = await prisma.product.create({
//             data: { name, description, price: parseFloat(price), imageUrl, category, stock: parseInt(stock) },
//           })
//           adminRes.status(201).json(newProduct)
//         } catch (error) {
//           console.error('Create product error:', error)
//           adminRes.status(500).json({ message: 'Something went wrong creating product' })
//         }
//       })(req, res)

//     default:
//       res.setHeader('Allow', ['GET', 'POST'])
//       res.status(405).end(`Method ${req.method} Not Allowed`)
//   }
// }

// export default authMiddleware(handleProducts)
// app/api/products/route.ts
import { NextResponse } from "next/server";
import { authMiddleware, adminMiddleware } from "../../../../lib/authMiddleware";
import prisma from "../../../../lib/prisma";
import formidable from "formidable";
import { Readable } from "stream";

// GET /api/products
// export const GET = authMiddleware(async () => {
//   try {
//     const products = await prisma.product.findMany({
//       orderBy: { createdAt: "desc" },
//     });
//     return NextResponse.json(products, { status: 200 });
//   } catch (error) {
//     console.error("Get all products error:", error);
//     return NextResponse.json(
//       { message: "Something went wrong fetching products" },
//       { status: 500 }
//     );
//   }
// });

// export const GET = authMiddleware(async (req) => {
//   try {
//     const { searchParams } = new URL(req.url);

//     // 🧭 Pagination
//     const page = parseInt(searchParams.get("page") || "1", 10);
//     const limit = parseInt(searchParams.get("limit") || "10", 10);
//     const skip = (page - 1) * limit;

//     // 🔍 Filters
//     const search = searchParams.get("search")?.trim() || "";
//     const category = searchParams.get("category")?.trim() || "";
//     const status = searchParams.get("status")?.trim() || "";

//     // 🔽 Sorting
//     const sortField = searchParams.get("sortField") || "createdAt";
//     const sortOrder = searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

//     // ✅ Build Prisma filter dynamically
//     const whereClause: any = {};

//     // 🔍 Search filter
//     if (search) {
//       whereClause.OR = [
//         { name: { contains: search, mode: "insensitive" } },
//         { description: { contains: search, mode: "insensitive" } },
//       ];
//     }

//     // 🏷 Category filter (if applicable)
//     if (category) {
//       whereClause.category = { equals: category, mode: "insensitive" };
//     }

//     // ⚙️ Status filter (if applicable)
//     if (status) {
//       whereClause.status = { equals: status, mode: "insensitive" };
//     }

//     // 📊 Count total matching records
//     const totalCount = await prisma.product.count({ where: whereClause });

//     // ✅ Fetch paginated, sorted data
//     const products = await prisma.product.findMany({
//       where: whereClause,
//       orderBy: { [sortField]: sortOrder },
//       skip,
//       take: limit,
//     });

//     const totalPages = Math.ceil(totalCount / limit);

//     // ✅ Response
//     return NextResponse.json(
//       {
//         data: products,
//         meta: {
//           page,
//           limit,
//           totalCount,
//           totalPages,
//           hasNextPage: page < totalPages,
//           hasPrevPage: page > 1,
//           sortField,
//           sortOrder,
//           appliedFilters: {
//             search: search || null,
//             category: category || null,
//             status: status || null,
//           },
//         },
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Get all products error:", error);
//     return NextResponse.json(
//       { message: "Something went wrong fetching products" },
//       { status: 500 }
//     );
//   }
// });


// export const GET = authMiddleware(async (req) => {
//   try {
//     const { searchParams } = new URL(req.url);

//     // 📄 Pagination
//     const page = parseInt(searchParams.get("page") || "1", 10);
//     const limit = parseInt(searchParams.get("limit") || "10", 10);
//     const skip = (page - 1) * limit;

//     // 🔍 Filters
//     const category = searchParams.get("category")?.trim() || "";
//     const search = searchParams.get("search")?.trim() || "";

//     // 🧠 Build filter
//     const whereClause: any = {};

//     if (category && category !== "ALL") {
//       whereClause.category = { equals: category, mode: "insensitive" };
//     }

//     if (search) {
//       whereClause.OR = [
//         { name: { contains: search, mode: "insensitive" } },
//         { description: { contains: search, mode: "insensitive" } },
//       ];
//     }

//     // 📊 Count total
//     const totalCount = await prisma.product.count({
//       where: whereClause,
//     });

//     // ✅ Fetch paginated products
//     const products = await prisma.product.findMany({
//       where: whereClause,
//       orderBy: { createdAt: "desc" },
//       skip, // ✅ Fixed position
//       take: limit, // ✅ Correct pagination key
//       select: {
//         id: true,
//         name: true,
//         description: true,
//         category: true,
//         price: true,
//         stock: true,
//         imageUrl: true,
//         createdAt: true,
//       },
//     });

//     const totalPages = Math.ceil(totalCount / limit);

//     return NextResponse.json(
//       {
//         data: products,
//         meta: {
//           page,
//           limit,
//           totalCount,
//           totalPages,
//           hasNextPage: page < totalPages,
//           hasPrevPage: page > 1,
//         },
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Get all products error:", error);
//     return NextResponse.json(
//       { message: "Something went wrong fetching products" },
//       { status: 500 }
//     );
//   }
// });

export const GET = authMiddleware(async (req) => {
  try {
    const { searchParams } = new URL(req.url);

    // 📄 Pagination
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    // 🔍 Filters
    const category = searchParams.get("category")?.trim() || "";
    const search = searchParams.get("search")?.trim() || "";

    // 🧠 Build filter
    const whereClause: any = {};

    if (category && category !== "ALL") {
      whereClause.category = { equals: category, mode: "insensitive" };
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // 📊 Count total
    const totalCount = await prisma.product.count({
      where: whereClause,
    });

    // ✅ Fetch paginated products
    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        price: true,
        stock: true,
        imageUrl: true,
        createdAt: true,
      },
    });

    // 🌐 Add full image URLs
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const productsWithFullUrls = products.map((p) => ({
      ...p,
      imageUrl: p.imageUrl ? `${baseUrl}${p.imageUrl}` : null,
    }));

    const totalPages = Math.ceil(totalCount / limit);

    // ✅ Send formatted response
    return NextResponse.json(
      {
        data: productsWithFullUrls,
        meta: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Get all products error:", error);
    return NextResponse.json(
      { message: "Something went wrong fetching products" },
      { status: 500 }
    );
  }
});



import { IncomingMessage } from "http";


function toNodeRequest(req: Request): IncomingMessage {
  const body = Readable.fromWeb(req.body as any); // Convert Web stream → Node stream
  const headers = Object.fromEntries(req.headers.entries());

  const nodeReq = Object.assign(body, {
    headers,
    method: req.method,
    url: req.url,
  });

  return nodeReq as unknown as IncomingMessage;
}




// POST /api/products
// export const POST = adminMiddleware(async (req) => {
//   try {
//     const body = await req.json();
//     const { name, description, price, imageUrl, category, stock } = body;

//     const newProduct = await prisma.product.create({
//       data: {
//         name,
//         description,
//         price: parseFloat(price),
//         imageUrl,
//         category,
//         stock: parseInt(stock),
//       },
//     });

//     return NextResponse.json(newProduct, { status: 201 });
//   } catch (error) {
//     console.error("Create product error:", error);
//     return NextResponse.json(
//       { message: "Something went wrong creating product" },
//       { status: 500 }
//     );
//   }
// });

// Disable Next.js default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

// export const POST = adminMiddleware(async (req: Request) => {

//   const form = formidable({ multiples: false, uploadDir: './public/uploads', keepExtensions: true });

//   return new Promise<NextResponse>((resolve, reject) => {
//     form.parse(req as any, async (err, fields, files) => {
//       if (err) {
//         console.error(err);
//         return resolve(NextResponse.json({ message: 'File upload failed' }, { status: 500 }));
//       }

//       const { name, description, price, category, stock } = fields;
//       const file = files.image as formidable.File;

//       // Create a relative URL to serve the image
//       const imageUrl = `/uploads/${path.basename(file.filepath)}`;

//       try {
//         const newProduct = await prisma.product.create({
//           data: {
//             name: name as string,
//             description: description as string,
//             price: parseFloat(price as string),
//             category: category as string,
//             stock: parseInt(stock as string),
//             imageUrl,
//           },
//         });

//         resolve(NextResponse.json(newProduct, { status: 201 }));
//       } catch (error) {
//         console.error(error);
//         resolve(NextResponse.json({ message: 'Something went wrong creating product' }, { status: 500 }));
//       }
//     });
//   });
// });
// export const POST = adminMiddleware(async (req) => {
//   try {
//     const form = new IncomingForm({
//       uploadDir: path.join(process.cwd(), "public/uploads"),
//       keepExtensions: true,
//     });

//     const data: any = await new Promise((resolve, reject) => {
//       form.parse(req as any, (err, fields, files) => {
//         if (err) reject(err);
//         resolve({ fields, files });
//       });
//     });

//     const { name, description, price, category, stock } = data.fields;
//     const file = data.files.imageFile?.[0];

//     const imageUrl = file
//       ? `/uploads/${path.basename(file.filepath)}`
//       : null;

//     const newProduct = await prisma.product.create({
//       data: {
//         name: String(name),
//         description: String(description),
//         price: parseFloat(price),
//         category: String(category),
//         stock: parseInt(stock),
//         imageUrl,
//       },
//     });

//     return NextResponse.json(newProduct, { status: 201 });
//   } catch (error) {
//     console.error("Create product error:", error);
//     return NextResponse.json(
//       { message: "Something went wrong creating product" },
//       { status: 500 }
//     );
//   }
// });



export const runtime = "nodejs"; // ✅ Required for formidable

export default async function parseForm(req: Request) {
  const form = formidable({ multiples: false });
  const nodeReq = toNodeRequest(req);

  return new Promise<{ fields: formidable.Fields; files: formidable.Files }>(
    (resolve, reject) => {
      form.parse(nodeReq, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    }
  );
}
import fs from "fs";
import path from "path";
import sharp from "sharp";
// export const POST = adminMiddleware(async (req: Request) => {
//   try {
//     const { fields, files } = await parseForm(req);

//     const { name, description, price, category, stock } = fields;
//     let imageUrl = "";

//     if (files.image) {
//       // For now just store file path, you can upload to cloud storage
//       // const file = Array.isArray(files.image) ? files.image[0] : files.image;
//       // const tempPath = file.filepath;
//       // const uploadDir = path.join(process.cwd(), "public/uploads");
//       // if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      
//       // const fileName = file.originalFilename || "uploaded.png";
//       // const destPath = path.join(uploadDir, fileName);
//       // await sharp(tempPath)
//       // .webp({ quality: 80 }) // adjust quality if needed
//       // .toFile(destPath);
//       // fs.renameSync(tempPath, destPath); // move file
//       // imageUrl = `/uploads/${fileName}`;
//       // console.log(imageUrl,'inside')
//       const file = Array.isArray(files.image) ? files.image[0] : files.image;
//       const tempPath = file.filepath;
//       const uploadDir = path.join(process.cwd(), "public/uploads");
//       if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    
//       // Change extension to .webp
//       const fileName = (file.originalFilename || "uploaded.png").split(".")[0] + ".webp";
//       const destPath = path.join(uploadDir, fileName);
    
//       // Convert PNG/JPG to WebP
//       await sharp(tempPath)
//         .webp({ quality: 80 })
//         .toFile(destPath);
    
//       // Remove temp file if needed
//       fs.unlinkSync(tempPath);
    
//       imageUrl = `/uploads/${fileName}`;
//       console.log(imageUrl, "inside");
//     }
//     console.log(imageUrl,'outside')
//     const newProduct = await prisma.product.create({
//       data: {
//         name: String(name),
//         description: String(description),
//         price: parseFloat(String(price)),
//         category: String(category),
//         stock: parseInt(String(stock)),
//         imageUrl,
//       },
//     });

//     return NextResponse.json(newProduct, { status: 201 });
//   } catch (error) {
//     console.error("Create product error:", error);
//     return NextResponse.json(
//       { message: "Something went wrong creating product" },
//       { status: 500 }
//     );
//   }
// });import { NextResponse } from "next/server";


// export const POST = adminMiddleware(async (req: Request) => {
//   try {
//     const { fields, files } = await parseForm(req);

//     const { name, description, price, category, stock } = fields;

//     // 🧩 Basic field validation
//     if (!name || !price || !category || !stock) {
//       return NextResponse.json(
//         { message: "Missing required fields: name, price, category, or stock" },
//         { status: 400 }
//       );
//     }

//     let imageUrl = "";

//     // 🖼 Handle image upload
//     if (files.image) {
//       const file = Array.isArray(files.image) ? files.image[0] : files.image;
//       const tempPath = file.filepath;

//       const uploadDir = path.join(process.cwd(), "public/uploads");
//       if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

//       // Convert to .webp (for consistency and performance)
//       const fileName =
//         (file.originalFilename || "uploaded").split(".")[0] +
//         "-" +
//         Date.now() +
//         ".webp";
//       const destPath = path.join(uploadDir, fileName);

//       await sharp(tempPath)
//         .webp({ quality: 80 })
//         .toFile(destPath);

//       fs.unlinkSync(tempPath); // cleanup temp file
//       imageUrl = `/uploads/${fileName}`;
//     }

//     // 💾 Create Product in DB
//     const newProduct = await prisma.product.create({
//       data: {
//         name: String(name),
//         description: description ? String(description) : "",
//         price: parseFloat(String(price)),
//         category: String(category),
//         stock: parseInt(String(stock)),
//         imageUrl,
//         // status: "ACTIVE", // optional default
//       },
//       select: {
//         id: true,
//         name: true,
//         description: true,
//         price: true,
//         category: true,
//         stock: true,
//         imageUrl: true,
//         createdAt: true,
//       },
//     });

//     return NextResponse.json(
//       {
//         message: "Product created successfully",
//         data: newProduct,
//       },
//       { status: 201 }
//     );
//   } catch (error: any) {
//     console.error("❌ Create product error:", error);
//     return NextResponse.json(
//       {
//         message:
//           error.message || "Something went wrong while creating the product",
//       },
//       { status: 500 }
//     );
//   }
// });


export const POST = adminMiddleware(async (req: Request) => {
  try {
    const { fields, files } = await parseForm(req);
    const { name, description, price, category, stock } = fields;

    if (!name || !price || !category || !stock) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    let imageUrl = "";

    if (files.image) {
      const file = Array.isArray(files.image) ? files.image[0] : files.image;
      const tempPath = file.filepath;
      const fileName =
        (file.originalFilename || "uploaded").split(".")[0] +
        "-" +
        Date.now() +
        ".webp";
      const destPath = path.join(uploadDir, fileName);

      await sharp(tempPath).webp({ quality: 80 }).toFile(destPath);
      fs.unlinkSync(tempPath);

      imageUrl = `/uploads/${fileName}`;
    }

    const newProduct = await prisma.product.create({
      data: {
        name: String(name),
        description: description ? String(description) : "",
        price: parseFloat(String(price)),
        category: String(category),
        stock: parseInt(String(stock)),
        imageUrl,
      },
    });

    // Ensure full URL for React Native
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    return NextResponse.json(
      {
        message: "Product created successfully",
        data: {
          ...newProduct,
          imageUrl: newProduct.imageUrl
            ? `${baseUrl}${newProduct.imageUrl}`
            : null,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("❌ Create product error:", error);
    return NextResponse.json(
      { message: error.message || "Error creating product" },
      { status: 500 }
    );
  }
});


