import { Button } from "@/components/ui/button";
export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-red-600">404</h1>
      <p className="text-lg text-gray-600 mt-2">Oops! Page not found.</p>
      <Button
        className="mt-4"
        onClick={() => console.log("click go back home")}
      >
        Go Home
      </Button>
    </div>
  );
}
