import "./globals.css";
import ToastContainer from "@/app/components/toast_comp/ToastContainer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
