import "./globals.css";
import { AppQueryProvider } from "@/lib/query/provider";
import { ToastProvider } from "@/app/components/ui/Toast";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="bg-white text-neutral-900" suppressHydrationWarning>
        <AppQueryProvider>
          <ToastProvider>{children}</ToastProvider>
        </AppQueryProvider>
      </body>
    </html>
  );
}