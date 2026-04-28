import { LocationProvider } from "@/providers/LocationProvider";
import { GoogleOAuthProvider } from '@react-oauth/google';
import "./globals.css";
import ChatBot from "@/components/common/ChatBot";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "dummy_client_id"}>
          <ChatBot />
          <LocationProvider>{children}</LocationProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}