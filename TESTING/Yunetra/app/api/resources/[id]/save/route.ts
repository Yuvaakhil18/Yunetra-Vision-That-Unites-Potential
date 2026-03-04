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

        const isSavedIndex = resource.saves.findIndex((id: any) => id.toString() === userId.toString());

        let isSaved = false;
        if (isSavedIndex === -1) {
            resource.saves.push(userId);
            resource.saveCount += 1;
            isSaved = true;
        } else {
            resource.saves.splice(isSavedIndex, 1);
            resource.saveCount -= 1;
        }

        await resource.save();
        return NextResponse.json({ saveCount: resource.saveCount, isSaved });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
