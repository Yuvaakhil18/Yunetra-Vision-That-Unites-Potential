import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Resource from "@/models/Resource";
import mongoose from "mongoose";

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await connectDB();
        const userId = new mongoose.Types.ObjectId((session.user as any).id);
        const resourceId = params.id;

        const resource = await Resource.findById(resourceId);
        if (!resource) return NextResponse.json({ error: "Resource not found" }, { status: 404 });

        const isUpvotedIndex = resource.upvotes.findIndex((id: any) => id.toString() === userId.toString());

        let isUpvoted = false;
        if (isUpvotedIndex === -1) {
            resource.upvotes.push(userId);
            resource.upvoteCount += 1;
            isUpvoted = true;
        } else {
            resource.upvotes.splice(isUpvotedIndex, 1);
            resource.upvoteCount -= 1;
        }

        await resource.save();
        return NextResponse.json({ upvoteCount: resource.upvoteCount, isUpvoted });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
