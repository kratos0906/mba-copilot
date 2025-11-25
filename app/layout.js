import "./globals.css";

export const metadata = {
  title: "MBA CoPilot",
  description: "AI-powered MBA schedule keeper"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
