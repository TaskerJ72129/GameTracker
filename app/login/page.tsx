import LoginForm from "@/components/loginForm";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function LoginPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (session) redirect("/games");
    
    return (
        <main className="flex-1 flex items-center justify-center p-6">
            <LoginForm />
        </main>
    );
}
