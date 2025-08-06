import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });
    
    const webpBuffer = await sharp(buffer).webp({ quality: 80 }).toBuffer();
    const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/\s+/g, '-');
    const filename = `${Date.now()}-${baseName}.webp`;
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, webpBuffer);
    const url = `/uploads/${filename}`;
    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json({ error: 'Upload gagal' }, { status: 500 });
  }
}
