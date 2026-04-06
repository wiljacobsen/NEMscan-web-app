import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SignInForm } from "@/components/auth/signin-form";
import { Zap } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <Card className="w-full max-w-md border-nem-border bg-nem-card">
        <CardHeader className="text-center">
          <div className="mb-2 flex justify-center">
            <Zap className="h-8 w-8 text-nem-accent" />
          </div>
          <CardTitle className="text-xl">Sign in to NEMScan</CardTitle>
        </CardHeader>
        <CardContent>
          <SignInForm />
        </CardContent>
      </Card>
    </div>
  );
}
