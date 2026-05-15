/**
 * /chatbot — Legacy route. Redirects to /assistant (Lexi AI).
 */
import { redirect } from "next/navigation";

export default function ChatbotPage() {
  redirect("/assistant");
}
