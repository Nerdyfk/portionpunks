import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import { logActivity, getClientIp } from '@/lib/security';

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req, ['SUPER_ADMIN', 'ADMIN', 'EDITOR']);
    const { question, answer, category, displayOrder } = await req.json();

    const faq = await db.fAQ.create({
      data: {
        question: question || 'New Question',
        answer: answer || '',
        category: category || 'General',
        displayOrder: parseInt(displayOrder || '0', 10),
      },
    });

    await logActivity({
      userId: user.userId,
      userEmail: user.email,
      action: 'FAQ_CREATE',
      resource: 'FAQ',
      resourceId: faq.id,
      details: `Created FAQ item: "${faq.question}"`,
      ipAddress: getClientIp(req),
    });

    return NextResponse.json(faq, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create FAQ item' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requireAuth(req, ['SUPER_ADMIN', 'ADMIN', 'EDITOR']);
    const { id, question, answer, category, displayOrder } = await req.json();

    const faq = await db.fAQ.update({
      where: { id },
      data: {
        question,
        answer,
        category,
        displayOrder: parseInt(displayOrder || '0', 10),
      },
    });

    await logActivity({
      userId: user.userId,
      userEmail: user.email,
      action: 'FAQ_UPDATE',
      resource: 'FAQ',
      resourceId: faq.id,
      details: `Updated FAQ item: "${faq.question}"`,
      ipAddress: getClientIp(req),
    });

    return NextResponse.json(faq);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update FAQ item' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await requireAuth(req, ['SUPER_ADMIN', 'ADMIN']);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    await db.fAQ.delete({ where: { id } });

    await logActivity({
      userId: user.userId,
      userEmail: user.email,
      action: 'FAQ_DELETE',
      resource: 'FAQ',
      resourceId: id,
      details: `Deleted FAQ item ID: ${id}`,
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete FAQ item' }, { status: 500 });
  }
}
