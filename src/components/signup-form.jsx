'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useActionState } from "react"
import { signup } from "@/app/auth/signup/actions"
import { ErrorMessage } from "./ui/error-label"
import { Loader2 } from "lucide-react"

export function SignupForm({
  className,
  ...props
}) {
  const [state, action, pending] = useActionState(signup)

  // function handleSubmit(event) {
  //   event.preventDefault();
  //   const formData = new FormData(event.target);
  //   startTransition(() => action(formData));
  // }
  return (
    (<div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create an account</CardTitle>
          <CardDescription>
            Create an account first to use our services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action}>
            <div className="grid gap-6">
              <div
                className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              </div>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input name="name" id="name" type="text" placeholder="Josh Singh" defaultValue={(state?.payload?.get("name") || "")} required />
                  {state?.errors?.name && <ErrorMessage>{state.errors.name}</ErrorMessage>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input name="email" id="email" type="email" placeholder="m@example.com" defaultValue={(state?.payload?.get("email") || "")} required />
                  {state?.errors?.email && <ErrorMessage>{state.errors.email}</ErrorMessage>}
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input name="password" id="password" type="password"  defaultValue={(state?.payload?.get("password") || "")} required />
                  {state?.errors?.password && <ErrorMessage>{state.errors.password}</ErrorMessage>}
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password-cnf">Confirm Password</Label>
                  </div>
                  <Input name="passwordcnf" id="password-cnf" type="password" required />
                  {state?.errors?.passwordcnf && <ErrorMessage>{state.errors.passwordcnf}</ErrorMessage>}
                </div>
                {
                  state?.error &&
                  <ErrorMessage className={'text-center'}>{state.error}</ErrorMessage>
                }
                <Button type="submit" className="w-full" disabled={pending}>
                  {
                    pending &&
                    <Loader2 className="animate-spin" />
                  }
                  Sign Up
                </Button>
              </div>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <a href="/auth/login" className="underline underline-offset-4">
                  Sign in
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>)
  );
}
