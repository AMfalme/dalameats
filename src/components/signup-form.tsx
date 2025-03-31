"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import loginImage from "@/static/img/dala meats.png";
import Link from "next/link";
import { useState } from "react";
import signUp from "@/lib/firebase/auth/signup";
import { useRouter } from "next/navigation";
import { saveUserDetails } from "@/lib/firebase/auth/signup";
import { userDetails } from "@/types/user";
import { useDispatch } from "react-redux";
import { addNotification } from "@/app/store/features/notificationSlice";
export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const router = useRouter();

  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(name, email, password, role, dob, phone, address);

    const { result, error } = await signUp(email, password, dispatch);
    if (result && result.user) {
      console.log("result from sugnup", result, error);
      const userData: userDetails = {
        id: result.user.uid,
        name: name,
        role: "customer",
        email: result.user?.email ?? "",
        phone: phone,
        address: address,
      };
      const { userInfo } = await saveUserDetails(result.user.uid, userData);
      dispatch(
        addNotification({
          type: "success",
          message: "Successfully created an account!",
        })
      );
      return router.push("/login");
    }
    console.log(error);
    if (error) {
      dispatch(
        addNotification({
          type: "error",
          message: "An error occured!",
        })
      );

      return console.log(error);
    }

    // else successful
    console.log(result, error);
    // return router.push("/catalogue");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Sign Up</h1>
                <p className="text-muted-foreground text-balance">
                  Create New Dala Meats account
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Full Name"
                  onChange={(e) => setName(e.target.value)}
                  required
                  name="username"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  name="email"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Phone Number"
                  onChange={(e) => setPhone(e.target.value)}
                  name="phonenumber"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="Address"
                  onChange={(e) => setAddress(e.target.value)}
                  name="address"
                />
              </div>
              <Button type="submit" className="w-full">
                Create Account
              </Button>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline underline-offset-4">
                  Sign in
                </Link>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <Image
              src={loginImage}
              width={500}
              height={600}
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground text-center text-xs">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
