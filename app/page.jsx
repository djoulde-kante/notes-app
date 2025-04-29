import { redirect } from "next/navigation";

export default function Home() {
  redirect("/connexion");
  return null;
}
