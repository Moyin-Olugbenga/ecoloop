// app/api/sensor/route.ts
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Request body:", body); // Log the request

    const { siteId, score } = body;

    if (!siteId || typeof score !== "number") {
      return NextResponse.json(
        { error: "siteId and numeric score are required" },
        { status: 400 }
      );
    }

    // Check if the field exists in the model
    console.log("Checking if DumpSite model has pollutionScore...");
    const site = await prisma.dumpSite.findUnique({
      where: { id: siteId },
    });

    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }

    console.log("Site found:", site.id);

    // Try to create reading
    const reading = await prisma.sensorReading.create({
      data: {
        siteId,
        score,
      },
    });

    console.log("Reading created:", reading.id);

    // Try to update site
    const updatedSite = await prisma.dumpSite.update({
      where: { id: siteId },
      data: {
        pollutionScore: Math.round(score),
      },
    });

    console.log("Site updated:", updatedSite.id);

    return NextResponse.json({
      ok: true,
      reading,
      updatedSite,
    }, { status: 201 });
  } catch (error) {
    console.error("Detailed error:", error);
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}