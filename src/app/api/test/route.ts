import { NextResponse } from "next/server"

export async function GET() {
    return NextResponse.json({ 
        message: "Test API working!", 
        timestamp: new Date().toISOString(),
        posts: [
            { id: 1, title: "Test Post 1" },
            { id: 2, title: "Test Post 2" }
        ]
    })
} 