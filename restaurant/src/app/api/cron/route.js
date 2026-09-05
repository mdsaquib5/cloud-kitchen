import { NextResponse } from 'next/server';

export async function GET(req) {
    // Vercel cron jobs can be secured with a CRON_SECRET if needed,
    // but for a simple health check ping, it's safe to leave open.

    try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://shree-shyaam-backend.onrender.com/api'; // Fallback to a production URL if env is missing in cron context
        // Ensure we hit the health endpoint
        const healthUrl = backendUrl.includes('/api') ? backendUrl.replace('/api', '/api/health') : `${backendUrl}/health`;

        console.log("Cron Job: Pinging backend at", healthUrl);

        const res = await fetch(healthUrl, { cache: 'no-store' });

        if (res.ok) {
            const data = await res.json();
            return NextResponse.json({ success: true, message: "Backend pinged successfully", data });
        } else {
            return NextResponse.json({ success: false, message: "Backend responded with error", status: res.status }, { status: 500 });
        }
    } catch (error) {
        console.error("Cron Job Error:", error);
        return NextResponse.json({ success: false, message: "Failed to ping backend", error: error.message }, { status: 500 });
    }
}