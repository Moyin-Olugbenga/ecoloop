import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  getSellerDashboard,
  getMiddlemanDashboard,
  getBuyerDashboard,
  getSchoolDashboard,
} from "@/app/actions/dashboard";
import DashboardShell from "./DashboardShell";
import { getCurrentUser } from "../actions/user";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();
      
      if (!user) {
        redirect("/signin");
      }
      const role = user.role;
    

  let data: any = null;
  if (role === "SELLER" || role === "ADMIN") {
    data = await getSellerDashboard();
  } else if (role === "MIDDLEMAN") {
    data = await getMiddlemanDashboard();
  } else if (role === "BUYER") {
    data = await getBuyerDashboard();
  } else if (role === "SCHOOL") {
    data = await getSchoolDashboard();
  }

  return (
    <DashboardShell
      role={role}
      user={user}
      data={data}
    />
  );
}