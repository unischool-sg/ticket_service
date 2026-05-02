import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import LoginClient from "./Client";

export default async function Login() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session) redirect("/manager");
  else return <LoginClient />;
}
