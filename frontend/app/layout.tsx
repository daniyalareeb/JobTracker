import type { Metadata } from "next"
import { Geist } from "next/font/google"
import { Toaster } from "sonner"
import { Providers } from "@/components/providers"
import { Shell } from "@/components/layout/shell"
import "./globals.css"

const geist = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "JobsTrack",
  description: "Track your job search in one place",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.className}>
      <body>
        <Providers>
          <Shell>{children}</Shell>
          <Toaster richColors position="bottom-right" />
        </Providers>
      </body>
    </html>
  )
}
