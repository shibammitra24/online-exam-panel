import { NextRequest, NextResponse } from "next/server";
import mongoClientPromise from "@/lib/mongodb";
import { MongoClient, Db } from "mongodb";

export async function POST(req: NextRequest, res: NextResponse) {
    const client: MongoClient = await mongoClientPromise;
    const db: Db = client.db("OnlineExam");

    const data = await req.json();
    console.log(`API: ${JSON.stringify(data)}`);

    const query = {
        candidateAuthId: data.candidateAuthId
    }

    try {
        const res = await db.collection('results').find(query).toArray();
        console.log(`API RES: ${JSON.stringify(res)}`);
        return NextResponse.json({data: res, success: true}, {status: 200});
    }
    catch (error) {
        return NextResponse.json({success: false}, {status: 400});
    }
}