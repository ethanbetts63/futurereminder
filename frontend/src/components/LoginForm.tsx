"use client"

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { cn } from "@/utils/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import formImage from '@/assets/faq_image_landscape.webp';
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner"; // Import the spinner

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Add isLoading state
  const navigate = useNavigate();
  const { loginWithPassword } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true); // Set loading to true
    try {
      await loginWithPassword(email, password);
      toast.success("Login successful!");
      // On success, we navigate away, so no need to set isLoading to false
      navigate('/dashboard/events');
    } catch (error) {
      console.error("Login failed", error);
      toast.error("Login Failed", {
        description: "Please check your email and password and try again.",
      });
      setIsLoading(false); // Only set loading to false on error
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          
          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Header */}
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance text-sm">
                  Login to your  account
                </p>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="username"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading} // Disable input while loading
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  autoComplete="current-password"
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading} // Disable input while loading
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center">
                    <Spinner className="mr-2 h-4 w-4" />
                    <span>Logging In...</span>
                  </div>
                ) : (
                  "Login"
                )}
              </Button>
              
              {/* Signup Link */}
              <div className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link to="/event-gate" className="underline underline-offset-2 hover:underline hover:text-primary">
                  Create an Event
                </Link>
              </div>

            </form>
          </div>

          {/* Image Section */}
          <div className="bg-muted relative hidden md:block">
            <img
              src={formImage}
              alt="An abstract image representing security or memory"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.3]"
            />
          </div>

        </CardContent>
      </Card>
    </div>
  )
}