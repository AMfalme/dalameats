import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ActiveThemeProvider } from "@/components/providers/active-theme";
import { AuthProvider } from "@/components/providers/auth-provider";
import "./globals.css";
import { cn } from "@/lib/utils";
import { cookies } from "next/headers";
import Navbar from "@/components/navbar";
export const metadata: Metadata = {
  title: "Dala Meats",
  description: "Vetter for quality and impact",
};
import StoreProvider from "./store/StoreProvider";
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const activeThemeValue = cookieStore.get("active_theme")?.value;
  const isScaled = activeThemeValue?.endsWith("-scaled");
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "bg-background overscroll-none font-sans antialiased",
          activeThemeValue ? `theme-${activeThemeValue}` : "",
          isScaled ? "theme-scaled" : ""
        )}
      >
        <StoreProvider>
          <AuthProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
              enableColorScheme
            >
              <ActiveThemeProvider initialTheme={activeThemeValue}>
                <Navbar />
                {children}
              </ActiveThemeProvider>
            </ThemeProvider>
          </AuthProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
