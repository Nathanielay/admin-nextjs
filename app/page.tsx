import { redirect } from "next/navigation";
import { getSessionUser, hasAdmins } from "@/lib/auth";

export default async function Home() {
  const anyAdmin = await hasAdmins();

  if (!anyAdmin) {
    redirect("/signup");
  }

  const user = await getSessionUser();
  if (user) {
    redirect("/books");
  }

  redirect("/signin");
}
