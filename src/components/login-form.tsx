"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import loginImage from "@/static/img/dala meats.png";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LogInWithEmailAndPassword from "@/lib/firebase/auth/signin";

import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/app/store/store";

import { addNotification } from "@/app/store/features/notificationSlice";
import { addItemToCart } from "@/app/store/features/cartSlice";
import { Product } from "@/types/products";
import GoogleLoginButton from "./login-google";




export function LoginForm() {
  const [useremail, setUseremail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log(user);
    const { result, error } = await LogInWithEmailAndPassword(
      useremail,
      password,
      dispatch
    );
    console.log("the following are the results", result, error);

    if (result && result.user) {
      console.log("result from sugnup", result, error);

      dispatch(
        addNotification({
          type: "success",
          message: "Successfully Logged in!",
        })
      );
      const cartFromLocalStorage = JSON.parse(
        localStorage.getItem("cart") || "[]"
      );
      cartFromLocalStorage.forEach((item: Product) => {
        return dispatch(addItemToCart({ uid: result.user.uid, item }));
      });
      localStorage.removeItem("cart"); // Clear localStorage after syncing
      return router.push("/dashboard");
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
  };

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your Dala Meats account
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  onChange={(e) => setUseremail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-3">
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
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>
              <div className="grid">
                <GoogleLoginButton />
              </div>
              <div className="text-center text-sm">
                <Link href="/signup" className="underline underline-offset-4">
                  Don&apos;t have an account? Sign up
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
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
