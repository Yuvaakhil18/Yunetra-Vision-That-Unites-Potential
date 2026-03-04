import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Resource from "@/models/Resource";
import User from "@/models/User";
import mongoose from "mongoose";
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);
        const userId = session?.user ? new mongoose.Types.ObjectId((session.user as any).id) : null;

        // Parse Query Params
        const url = new URL(req.url);
        const skill = url.searchParams.get("skill");
        const type = url.searchParams.get("type");
        const sort = url.searchParams.get("sort") || "newest";
        const search = url.searchParams.get("search");

        let query: any = {};
        if (skill && skill !== "All") query.skill = skill;
        if (type && type !== "All Types") query.type = type.toLowerCase();
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        let sortOption: any = { createdAt: -1 };
        if (sort === "popular") sortOption = { saveCount: -1 };
        if (sort === "top") sortOption = { upvoteCount: -1 };

        const resources = await Resource.find(query)
            .sort(sortOption)
            .populate("uploadedBy", "name college")
            .lean();

        // Map boolean flags for the current user
        const formatted = resources.map((r: any) => ({
            ...r,
            isSaved: userId && r.saves ? (r.saves || []).some((id: any) => id.toString() === userId.toString()) : false,
            isUpvoted: userId && r.upvotes ? (r.upvotes || []).some((id: any) => id.toString() === userId.toString()) : false,
            // remove large arrays from payload to save bandwidth
            saves: undefined,
            upvotes: undefined
        }));

        return NextResponse.json(formatted);
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const body = await req.json();
        const { title, description, url, type, skill } = body;

        if (!title || !url || !type || !skill) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Basic URL validation
        try { new URL(url); } catch (_) {
            return NextResponse.json({ error: "Invalid URL format" }, { status: 400 });
        }

        const newResource = await Resource.create({
            title,
            description,
            url,
            type,
            skill,
            uploadedBy: (session.user as any).id
        });

        // Add activity feed entry
        const user = await User.findById((session.user as any).id);
        if (user) {
            user.activityFeed = user.activityFeed || [];
            user.activityFeed.push({
                type: 'shared_resource',
                description: `Shared ${title}`,
                createdAt: new Date()
            });

            // Keep max 100 entries
            if (user.activityFeed.length > 100) {
                user.activityFeed = user.activityFeed.slice(-100);
            }

            await user.save();
        }

        const populated = await Resource.findById(newResource._id).populate("uploadedBy", "name college").lean();

        return NextResponse.json(populated, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
