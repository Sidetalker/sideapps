import { put } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

// Add OPTIONS handler for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

// Add GET handler for debugging
export async function GET() {
  return NextResponse.json({
    message: 'Upload endpoint is working. Use POST to upload images.',
    methods: ['POST'],
  });
}

export async function POST(request: NextRequest) {
  console.log('POST /api/upload-image called');
  console.log('Request method:', request.method);
  console.log('Request headers:', Object.fromEntries(request.headers.entries()));
  
  try {
    const formData = await request.formData();
    console.log('FormData received, entries:', Array.from(formData.entries()).map(([key, value]) => [key, typeof value]));
    
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Image size must be less than 5MB' },
        { status: 400 }
      );
    }

    // Generate a unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const filename = `signature-images/${timestamp}-${Math.random().toString(36).substring(2)}.${fileExtension}`;

    // Upload to Vercel Blob
    console.log('Uploading to Vercel Blob with filename:', filename);
    console.log('BLOB_READ_WRITE_TOKEN present:', !!process.env.BLOB_READ_WRITE_TOKEN);
    
    const blob = await put(filename, file, {
      access: 'public',
    });

    console.log('Upload successful, blob URL:', blob.url);
    
    return NextResponse.json({
      url: blob.url,
      filename: filename
    });

  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}