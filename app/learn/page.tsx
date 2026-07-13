// import { prisma } from "@/lib/db";
// import { requireUser } from "@/lib/authz";
// import Sidebar from "@/components/Sidebar";
// import LearnView from "./LearnView";
// import { redirect } from "next/navigation";

// export const dynamic = "force-dynamic";

// export default async function LearnPage() {
//   const sessionUser = await requireUser();

//   const user = await prisma.user.findUnique({
//     where: { id: sessionUser.id }
//   });

//   if (!user) redirect('/signin');

//   // Fetch tutorials and user watch history in parallel
//   const [tutorials, watchedItems] = await Promise.all([
//     prisma.tutorial.findMany({
//       orderBy: { createdAt: "desc" },
//       include: {
//         uploadedBy: { select: { name: true } },
//         _count: { select: { views: true } },
//       },
//     }),
//     prisma.tutorialView.findMany({
//       where: { userId: user.id },
//       select: { tutorialId: true }
//     })
//   ]);

//   const watchedIds = watchedItems.map(w => w.tutorialId);

//   return (
//     <LearnView 
//       user={user} 
//       tutorials={tutorials} 
//       watchedIds={watchedIds} 
//     />
//   );
// }

import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/authz";
import Sidebar from "@/components/Sidebar";
import DIYVideosView from "./LearnView";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DIYVideosPage() {
  const sessionUser = await requireUser();

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id }
  });

  if (!user) redirect('/signin');

  // Load backend collections in parallel
  const [tutorials, watchedItems] = await Promise.all([
    prisma.tutorial.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        uploadedBy: { select: { name: true } },
        _count: { select: { views: true } },
      },
    }),
    prisma.tutorialView.findMany({
      where: { userId: user.id },
      select: { tutorialId: true }
    })
  ]);

  const watchedIds = watchedItems.map(w => w.tutorialId);

  return (
    <DIYVideosView 
      user={user} 
      tutorials={tutorials} 
      watchedIds={watchedIds} 
    />
  );
}