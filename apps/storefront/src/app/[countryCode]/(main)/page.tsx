import { Metadata } from "next"

import LatestProducts from "@modules/home/components/latest-products"
import Hero from "@modules/home/components/hero"
import ValueProps from "@modules/home/components/value-props"
import CtaBanner from "@modules/home/components/cta-banner"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "NATURZEN — Suplementos para tu salud",
  description:
    "Tienda de suplementos en Panamá. Proteínas, creatina, vitaminas y más.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  return (
    <>
      <Hero />
      <ValueProps />
      <div className="bg-brand-50/40">
        <LatestProducts region={region} />
      </div>
      <CtaBanner />
    </>
  )
}
