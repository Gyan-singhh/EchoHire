import { redirect } from "next/navigation";

export default function CandidateRedirectPage() {
  redirect("/candidate/jobs");
}
