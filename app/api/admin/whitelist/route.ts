import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';

// Memory store fallbacks if DB table doesn't have custom columns
let globalWhitelistLive = true;
let globalWhitelistTasks = [
  {
    id: 'task_1',
    title: 'Follow @potionpunks on X',
    url: 'https://x.com/potionpunks',
    proofPlaceholder: 'Enter your @username',
    required: true,
  },
  {
    id: 'task_2',
    title: 'Like & Retweet Pinned Post',
    url: 'https://x.com/potionpunks',
    proofPlaceholder: 'Enter Tweet / Retweet proof URL',
    required: true,
  },
];

export async function GET(req: NextRequest) {
  try {
    const session = await getSession(req);

    // Try fetching from db
    let entries: any[] = [];
    try {
      entries = await db.whitelistSubmission.findMany({
        orderBy: { createdAt: 'desc' },
      });
    } catch (e) {}

    // Check live setting from SiteSetting
    try {
      const liveSetting = await db.siteSetting.findUnique({
        where: { key: 'whitelist_live' },
      });
      if (liveSetting) {
        globalWhitelistLive = liveSetting.value === 'true';
      }

      const tasksSetting = await db.siteSetting.findUnique({
        where: { key: 'whitelist_tasks' },
      });
      if (tasksSetting) {
        globalWhitelistTasks = JSON.parse(tasksSetting.value);
      }
    } catch (e) {}

    return NextResponse.json({
      success: true,
      entries,
      isLive: globalWhitelistLive,
      tasks: globalWhitelistTasks,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      entries: [],
      isLive: globalWhitelistLive,
      tasks: globalWhitelistTasks,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { action, id, status, isLive, tasks } = body;

    // Toggle Whitelist Live / Paused
    if (action === 'TOGGLE_LIVE') {
      globalWhitelistLive = Boolean(isLive);
      try {
        await db.siteSetting.upsert({
          where: { key: 'whitelist_live' },
          update: { value: String(globalWhitelistLive) },
          create: {
            key: 'whitelist_live',
            value: String(globalWhitelistLive),
            label: 'Whitelist Live Status',
            group: 'system',
          },
        });
      } catch (e) {}

      return NextResponse.json({ success: true, isLive: globalWhitelistLive });
    }

    // Save Whitelist Tasks
    if (action === 'SAVE_TASKS' && Array.isArray(tasks)) {
      globalWhitelistTasks = tasks;
      try {
        await db.siteSetting.upsert({
          where: { key: 'whitelist_tasks' },
          update: { value: JSON.stringify(tasks) },
          create: {
            key: 'whitelist_tasks',
            value: JSON.stringify(tasks),
            label: 'Whitelist Tasks Config',
            group: 'system',
          },
        });
      } catch (e) {}

      return NextResponse.json({ success: true, tasks: globalWhitelistTasks });
    }

    // Update Whitelist Entry Status
    if (action === 'UPDATE_STATUS' && id && status) {
      try {
        await db.whitelistSubmission.update({
          where: { id },
          data: { status },
        });
      } catch (e) {}
      return NextResponse.json({ success: true });
    }

    // Delete Whitelist Entry
    if (action === 'DELETE' && id) {
      try {
        await db.whitelistSubmission.delete({
          where: { id },
        });
      } catch (e) {}
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Operation failed' }, { status: 500 });
  }
}
