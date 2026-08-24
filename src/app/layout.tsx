import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Filo Yönetimi",
  description: "Araç envanter ve bakım/tamir takip sistemi",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
