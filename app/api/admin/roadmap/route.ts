import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';
import { logActivity, getClientIp } from '@/lib/security';

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req, ['SUPER_ADMIN', 'ADMIN', 'EDITOR']);
    const { phase, title, description, status, displayOrder } = await req.json();

    const item = await db.roadmapItem.create({
      data: {
        phase: phase || 'PHASE 01',
        title: title || 'NEW PHASE',
        description: description || '',
        status: status || 'UPCOMING',
        displayOrder: parseInt(displayOrder || '0', 10),
      },
    });

    await logActivity({
      userId: user.userId,
      userEmail: user.email,
      action: 'ROADMAP_CREATE',
      resource: 'RoadmapItem',
      resourceId: item.id,
      details: `Added roadmap phase: ${item.phase} - ${item.title}`,
      ipAddress: getClientIp(req),
    });

    return NextResponse.json(item, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create roadmap item' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requireAuth(req, ['SUPER_ADMIN', 'ADMIN', 'EDITOR']);
    const { id, phase, title, description, status, displayOrder } = await req.json();

    const item = await db.roadmapItem.update({
      where: { id },
      data: {
        phase,
        title,
        description,
        status,
        displayOrder: parseInt(displayOrder || '0', 10),
      },
    });

    await logActivity({
      userId: user.userId,
      userEmail: user.email,
      action: 'ROADMAP_UPDATE',
      resource: 'RoadmapItem',
      resourceId: item.id,
      details: `Updated roadmap phase: ${item.phase}`,
      ipAddress: getClientIp(req),
    });

    return NextResponse.json(item);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update roadmap item' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await requireAuth(req, ['SUPER_ADMIN', 'ADMIN']);
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });

    await db.roadmapItem.delete({ where: { id } });

    await logActivity({
      userId: user.userId,
      userEmail: user.email,
      action: 'ROADMAP_DELETE',
      resource: 'RoadmapItem',
      resourceId: id,
      details: `Deleted roadmap item ID: ${id}`,
      ipAddress: getClientIp(req),
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete roadmap item' }, { status: 500 });
  }
}
