// app/api/sensor/route.ts
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { siteId, score } = body;

    // Validate inputs
    if (!siteId || typeof score !== "number") {
      return NextResponse.json(
        { error: "siteId and numeric score are required" },
        { status: 400 }
      );
    }
    if (score < 0 || score > 100) {
      return NextResponse.json(
        { error: "score must be between 0 and 100" },
        { status: 400 }
      );
    }

    // Check if site exists
    const site = await prisma.dumpSite.findUnique({ 
      where: { id: siteId },
      select: { id: true } // Only select id for existence check
    });
    
    if (!site) {
      return NextResponse.json({ error: "Unknown siteId" }, { status: 404 });
    }

    // Ensure score is an integer for pollutionScore
    const pollutionScore = Math.round(score);

    // Use transaction to create reading and update site
    const [reading] = await prisma.$transaction([
      prisma.sensorReading.create({ 
        data: { 
          siteId, 
          score // If your sensorReading uses Float
        } 
      }),
      prisma.dumpSite.update({
        where: { id: siteId },
        data: { pollutionScore }, // Int
      }),
    ]);

    return NextResponse.json({ 
      ok: true, 
      reading,
      pollutionScore 
    }, { status: 201 });
  } catch (err) {
    console.error("sensor ingest error", err);
    return NextResponse.json({ 
      error: "Internal error",
      details: err instanceof Error ? err.message : String(err)
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const siteId = req.nextUrl.searchParams.get("siteId");
  if (!siteId) {
    return NextResponse.json({ error: "siteId is required" }, { status: 400 });
  }

  const readings = await prisma.sensorReading.findMany({
    where: { siteId },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return NextResponse.json({ readings });
}