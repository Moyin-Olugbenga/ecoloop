import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// app/api/sensor/route.ts
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { siteId, score } = body;

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

    const site = await prisma.dumpSite.findUnique({ 
      where: { id: siteId },
      select: { id: true } // Just check existence
    });
    
    if (!site) {
      return NextResponse.json({ error: "Unknown siteId" }, { status: 404 });
    }

    // Convert score to Int if needed
    const pollutionScore = Math.round(score); // Ensure it's an integer

    const [reading] = await prisma.$transaction([
      prisma.sensorReading.create({ 
        data: { siteId, score } // score might be Float
      }),
      prisma.dumpSite.update({
        where: { id: siteId },
        data: { pollutionScore: pollutionScore }, // Int
      }),
    ]);

    return NextResponse.json({ ok: true, reading }, { status: 201 });
  } catch (err) {
    console.error("sensor ingest error", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

// Optional: list recent readings for a site, e.g. for a small chart on the map popup
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