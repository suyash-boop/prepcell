import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Github } from "lucide-react";
import { SignInButton } from "@/components/auth/sign-in-button";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white text-black border-2 border-white shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-4xl font-bold">Prepcell</CardTitle>
          <CardDescription className="text-lg text-gray-700">
            Track your placement preparation journey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <p className="text-sm">Track skills across multiple categories</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <p className="text-sm">Company-wise preparation notes</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <p className="text-sm">Daily goals and progress tracking</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-black rounded-full"></div>
              <p className="text-sm">Resume management</p>
            </div>
          </div>

          <SignInButton />
        </CardContent>
      </Card>
    </div>
  );
}
