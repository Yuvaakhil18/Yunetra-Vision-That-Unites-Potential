"use client";

import Link from "next/link";

export default function NotificationsPage() {
  // Replace with real notification data fetching if needed
  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-syne font-bold mb-8">Notifications</h1>
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-card border border-[rgba(255,255,255,0.06)] flex items-start gap-3">
          <span className="w-2 h-2 mt-1 rounded-full bg-primary inline-block" />
          <div>
            <div className="font-sans text-base text-white">You have 3 new match requests!</div>
            <div className="text-xs text-t2 mt-1">Just now</div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-card border border-[rgba(255,255,255,0.06)] flex items-start gap-3">
          <span className="w-2 h-2 mt-1 rounded-full bg-warning inline-block" />
          <div>
            <div className="font-sans text-base text-white">Your profile was viewed 5 times today.</div>
            <div className="text-xs text-t2 mt-1">2 hours ago</div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-card border border-[rgba(255,255,255,0.06)] flex items-start gap-3">
          <span className="w-2 h-2 mt-1 rounded-full bg-accent inline-block" />
          <div>
            <div className="font-sans text-base text-white">Session with Priya confirmed for tomorrow.</div>
            <div className="text-xs text-t2 mt-1">Yesterday</div>
          </div>
        </div>
      </div>
      <div className="mt-8 text-center">
        <Link href="/dashboard" className="text-primary font-sans text-sm font-semibold hover:underline">Back to Dashboard</Link>
      </div>
    </div>
  );
}
