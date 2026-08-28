import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  req: NextRequest,
  { params }: { params: { file: string } }
) {
  try {
    const filename = params.file;
    const rootDir = process.cwd();
    const filePath = path.join(rootDir, filename);

    if (fs.existsSync(filePath)) {
      const fileBuffer = fs.readFileSync(filePath);
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    return new NextResponse('Not Found', { status: 404 });
  } catch (error) {
    return new NextResponse('Error loading image', { status: 500 });
  }
}
