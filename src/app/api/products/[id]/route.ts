// // pages/api/products/[id].ts
// import type { NextApiResponse } from 'next'
// import { AuthenticatedRequest, authMiddleware, adminMiddleware } from '../../../../lib/authMiddleware'
// import prisma from '../../../../lib/prisma'

// const handleProduct = async (req: AuthenticatedRequest, res: NextApiResponse) => {
//   const { id } = req.query as { id: string }

//   switch (req.method) {
//     case 'GET':
//       try {
//         const product = await prisma.product.findUnique({ where: { id } })
//         if (!product) {
//           return res.status(404).json({ message: 'Product not found' })
//         }
//         res.status(200).json(product)
//       } catch (error) {
//         console.error('Get product error:', error)
//         res.status(500).json({ message: 'Something went wrong fetching product' })
//       }
//       break

//     case 'PUT':
//       // Only admins can update products
//       return adminMiddleware(async (adminReq, adminRes) => {
//         try {
//           const { name, description, price, imageUrl, category, stock } = adminReq.body
//           const updatedProduct = await prisma.product.update({
//             where: { id },
//             data: { name, description, price, imageUrl, category, stock: parseInt(stock) },
//           })
//           adminRes.status(200).json(updatedProduct)
//         } catch (error) {
//           console.error('Update product error:', error)
//           adminRes.status(500).json({ message: 'Something went wrong updating product' })
//         }
//       })(req, res) // Pass req and res to the middleware

//     case 'DELETE':
//       // Only admins can delete products
//       return adminMiddleware(async (adminReq, adminRes) => {
//         try {
//           await prisma.product.delete({ where: { id } })
//           adminRes.status(204).end() // No content
//         } catch (error) {
//           console.error('Delete product error:', error)
//           adminRes.status(500).json({ message: 'Something went wrong deleting product' })
//         }
//       })(req, res)

//     default:
//       res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
//       res.status(405).end(`Method ${req.method} Not Allowed`)
//   }
// }

// export default authMiddleware(handleProduct) // All product operations require authentication
// app/api/products/[id]/route.ts
import { NextResponse } from "next/server";
import { authMiddleware, adminMiddleware } from "../../../../../lib/authMiddleware";
import prisma from "../../../../../lib/prisma";
import formidable from "formidable";
import { Readable } from "stream";
import fs from 'fs';
import path from 'path';

// GET /api/products/[id]
export const GET = authMiddleware(async (req, { params }) => {
  try {
    const { id } = params;
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Get product error:", error);
    return NextResponse.json(
      { message: "Something went wrong fetching product" },
      { status: 500 }
    );
  }
});

// PUT /api/products/[id]
// export const PUT = adminMiddleware(async (req, { params }) => {
//   try {
//     const { id } = params;
//     const body = await req.json();
//     const { name, description, price, imageUrl, category, stock } = body;

//     const updatedProduct = await prisma.product.update({
//       where: { id },
//       data: {
//         name,
//         description,
//         price,
//         imageUrl,
//         category,
//         stock: parseInt(stock),
//       },
//     });

//     return NextResponse.json(updatedProduct, { status: 200 });
//   } catch (error) {
//     console.error("Update product error:", error);
//     return NextResponse.json(
//       { message: "Something went wrong updating product" },
//       { status: 500 }
//     );
//   }
// });
export const config = {
  api: {
    bodyParser: false, // required for file uploads
  },
};

// export const PUT = adminMiddleware(async (req: Request, { params }: { params: { id: string } }) => {
//   const { id } = params;

//   const form = formidable({ multiples: false, uploadDir: './public/uploads', keepExtensions: true });

//   return new Promise<NextResponse>((resolve) => {
//     form.parse(req as any, async (err, fields, files) => {
//       if (err) {
//         console.error(err);
//         return resolve(
//           NextResponse.json({ message: 'File parsing failed' }, { status: 500 })
//         );
//       }

//       const { name, description, price, category, stock } = fields;
//       let imageUrl: string | undefined;

//       if (files.image) {
//         const file = files.image as formidable.File;
//         imageUrl = `/uploads/${path.basename(file.filepath)}`;
//       }

//       try {
//         const updatedProduct = await prisma.product.update({
//           where: { id },
//           data: {
//             name: name as string,
//             description: description as string,
//             price: parseFloat(price as string),
//             category: category as string,
//             stock: parseInt(stock as string),
//             ...(imageUrl && { imageUrl }), // only update if new file uploaded
//           },
//         });

//         resolve(NextResponse.json(updatedProduct, { status: 200 }));
//       } catch (error) {
//         console.error('Update product error:', error);
//         resolve(
//           NextResponse.json(
//             { message: 'Something went wrong updating product' },
//             { status: 500 }
//           )
//         );
//       }
//     });
//   });
// });

// DELETE /api/products/[id]
// export const DELETE = adminMiddleware(async (req, { params }) => {
//   try {
//     const { id } = params;
//     await prisma.product.delete({ where: { id } });
//     return new NextResponse(null, { status: 204 });
//   } catch (error) {
//     console.error("Delete product error:", error);
//     return NextResponse.json(
//       { message: "Something went wrong deleting product" },
//       { status: 500 }
//     );
//   }
// });



// export const PUT = adminMiddleware(async (req, { params }) => {
//   try {
//     const { id } = params;

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
//       : undefined; // keep old image if not uploaded

//     const updatedProduct = await prisma.product.update({
//       where: { id },
//       data: {
//         name: String(name),
//         description: String(description),
//         price: parseFloat(price),
//         category: String(category),
//         stock: parseInt(stock),
//         ...(imageUrl ? { imageUrl } : {}),
//       },
//     });

//     return NextResponse.json(updatedProduct, { status: 200 });
//   } catch (error) {
//     console.error("Update product error:", error);
//     return NextResponse.json(
//       { message: "Something went wrong updating product" },
//       { status: 500 }
//     );
//   }
// });

import { IncomingMessage } from "http";
import sharp from "sharp";

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


export const runtime = "nodejs";


async function parseForm(req: Request) {
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

export const PUT = adminMiddleware(async (req: Request, context: { params: { id: string } }) => {
  try {
    const { id } = context.params; 
    const { fields, files } = await parseForm(req);

    const { name, description, price, category, stock } = fields;
    let imageUrl : string | undefined;

    if (files.image) {
      // For now just store file path, you can upload to cloud storage
      const file = Array.isArray(files.image) ? files.image[0] : files.image;
      const tempPath = file.filepath;
      const uploadDir = path.join(process.cwd(), "public/uploads");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
      
      const fileName = file.originalFilename || "uploaded.png";
      const destPath = path.join(uploadDir, fileName);
    
      await sharp(tempPath)
      .webp({ quality: 80 })
      .toFile(destPath);
  
    // Remove temp file if needed
    fs.unlinkSync(tempPath);
      imageUrl = `/uploads/${fileName}`;
      console.log(imageUrl,'inside')
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name: String(name),
        description: String(description),
        price: parseFloat(String(price)),
        category: String(category),
        stock: parseInt(String(stock)),
        // ...(imageUrl ? { imageUrl } : {}), 
        ...(imageUrl !== undefined ? { imageUrl } : {}),// Only update if file uploaded
      },
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json(
      { message: "Something went wrong updating product" },
      { status: 500 }
    );
  }
});


// export const runtime = "nodejs"; /// required since we're using fs

// export const DELETE = adminMiddleware(async (req: Request, { params }: { params: { id: string } }) => {
//   try {
//     const { id } = params;

//     // Find the product first to get the image URL
//     const product = await prisma.product.findUnique({ where: { id } });

//     if (!product) {
//       return NextResponse.json({ message: "Product not found" }, { status: 404 });
//     }

//     // Delete the product record
//     await prisma.product.delete({ where: { id } });

//     // Delete the image file if it exists
//     if (product.imageUrl) {
//       const filePath = path.join(process.cwd(), "public", product.imageUrl);
//       if (fs.existsSync(filePath)) {
//         fs.unlinkSync(filePath);
//       }
//     }

//     return new NextResponse(null, { status: 204 });
//   } catch (error) {
//     console.error("Delete product error:", error);
//     return NextResponse.json(
//       { message: "Something went wrong deleting product" },
//       { status: 500 }
//     );
//   }
// });
// export const DELETE = adminMiddleware(async (req: Request, { params }: { params: { id: string } }) => {
//   try {
//     const { id } = params;

//     // Find the product first
//     const product = await prisma.product.findUnique({ where: { id } });

//     if (!product) {
//       return NextResponse.json({ message: "Product not found" }, { status: 404 });
//     }

//     // Delete image file if exists
//     if (product.imageUrl) {
//       const imagePath = path.join(process.cwd(), "public", product.imageUrl);
//       if (fs.existsSync(imagePath)) {
//         fs.unlinkSync(imagePath); // remove the file
//       }
//     }

//     // Delete product from DB
//     await prisma.product.delete({ where: { id } });

//     return new NextResponse(null, { status: 204 });
//   } catch (error) {
//     console.error("Delete product error:", error);
//     return NextResponse.json(
//       { message: "Something went wrong deleting product" },
//       { status: 500 }
//     );
//   }
// });
// export const DELETE = adminMiddleware(async (req: Request, context: { params: any }) => {
//   const { params } = await context; // ✅ await params before using
//   const { id } = params;

//   try {
//     const product = await prisma.product.findUnique({ where: { id } });

//     if (!product) {
//       return NextResponse.json({ message: "Product not found" }, { status: 404 });
//     }

//     // Delete image from /public/uploads
//     if (product.imageUrl) {
//       const imagePath = path.join(process.cwd(), "public", product.imageUrl);
//       if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
//     }

//     await prisma.product.delete({ where: { id } });

//     return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
//   } catch (error) {
//     console.error("Delete product error:", error);
//     return NextResponse.json(
//       { message: "Something went wrong deleting product" },
//       { status: 500 }
//     );
//   }
// });
export const DELETE = adminMiddleware(async (req: Request, { params }: { params: { id: string } }) => {
  const { id } = params;

  try {
    // Find product
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    // Delete image from /public/uploads if exists
    if (product.imageUrl) {
      const imagePath = path.join(process.cwd(), "public", product.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // Delete product from database
    await prisma.product.delete({ where: { id } });

    // Return JSON response (do not use 204)
    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      { message: "Something went wrong deleting product" },
      { status: 500 }
    );
  }
});


