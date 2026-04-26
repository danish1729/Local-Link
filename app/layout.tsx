
import { LocationProvider } from "@/providers/LocationProvider";
import "./globals.css";
import ChatBot from "@/components/common/CharBot";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ChatBot />
        <LocationProvider>{children}</LocationProvider>
      </body>
    </html>
  );
}