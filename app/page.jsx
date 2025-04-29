import Link from "next/link"
import { Button } from "@/components/ui/button"
import { translations } from "@/lib/translations"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-bold">NoteFlex</h1>
          <p className="mt-3 text-lg text-gray-600">{translations.landingPage.tagline}</p>
        </div>
        <div className="flex flex-col space-y-4">
          <Button asChild className="w-full">
            <Link href="/connexion">{translations.common.login}</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/inscription">{translations.common.register}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
