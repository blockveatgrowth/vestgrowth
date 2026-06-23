import { NextResponse } from 'next/server';

// This route is called by Vercel Cron Jobs daily at midnight UTC
// Configure in vercel.json: { "crons": [{ "path": "/api/cron/daily-trade", "schedule": "0 0 * * *" }] }
export async function GET(request: Request) {
  try {
    // Verify this is called by Vercel Cron (or with the correct secret)
    const authHeader = request.headers.get('authorization');
    if (
      process.env.CRON_SECRET &&
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Call the trade generation endpoint
    const baseUrl = process.env.NEXTAUTH_URL || 'https://vestgrowth.vercel.app';
    const res = await fetch(`${baseUrl}/api/admin/trade/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-cron-secret': process.env.CRON_SECRET || '',
      },
      body: JSON.stringify({ secret: process.env.CRON_SECRET }),
    });

    const data = await res.json();
    return NextResponse.json({ success: true, result: data });
  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 });
  }
}
