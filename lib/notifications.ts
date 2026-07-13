import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";

export const SEVERE_THRESHOLD = 70;

/**
 * Called after a sensor reading updates a DumpSite's pollutionScore.
 * Only fires when the score crosses INTO severe territory (previousScore < threshold <= newScore),
 * so middlemen aren't spammed on every reading while a site stays severe.
 */
export async function notifyMiddlemenIfSevere(params: {
  dumpSiteId: string;
  siteName: string;
  siteLga: string | null;
  previousScore: number;
  newScore: number;
}) {
  const { dumpSiteId, siteName, siteLga, previousScore, newScore } = params;

  const justCrossed = previousScore < SEVERE_THRESHOLD && newScore >= SEVERE_THRESHOLD;
  if (!justCrossed || !siteLga) return { notified: 0 };

  const middlemenInLga = await prisma.user.findMany({
    where: { role: "MIDDLEMAN", lga: siteLga },
  });

  if (middlemenInLga.length === 0) return { notified: 0 };

  const title = `High pollution alert: ${siteName}`;
  const message = `${siteName} in ${siteLga} just hit a pollution score of ${newScore}/100. There may be a pickup opportunity nearby.`;

  await prisma.notification.createMany({
    data: middlemenInLga.map((m) => ({
      userId: m.id,
      title,
      message,
      dumpSiteId,
    })),
  });

  // Fire emails too, using the existing stub - swap lib/email.ts for a real provider later
  await Promise.all(
    middlemenInLga.map((m) =>
      sendEmail({
        to: m.email,
        subject: title,
        html: `<p>${message}</p>`,
      })
    )
  );

  return { notified: middlemenInLga.length };
}