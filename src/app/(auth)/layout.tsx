import Link from 'next/link'
import { PaletteIcon } from 'lucide-react'
import { ThemeProvider } from "@/components/theme-provider"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="">
        {/* Logo Header */}
        <header className="absolute top-0 left-0 w-full p-6">
          <div className="container mx-auto">
            <Link
              href="/"
              className="flex flex-row items-center justify-start"
            >
              <PaletteIcon className="h-6 w-6" />
              <span className="ml-2 text-lg font-semibold">pep-gallery</span>
            </Link>
          </div>
        </header>
        
        {/* Main Content */}
        <main>
          {children}
        </main>
      </div>
    </ThemeProvider>
  )
}
