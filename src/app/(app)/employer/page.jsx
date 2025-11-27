import { redirect } from "next/navigation";

export default function EmployerRedirectPage() {
  redirect("/employer/jobs");
}
