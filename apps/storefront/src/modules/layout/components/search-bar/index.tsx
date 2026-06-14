"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"

const SearchBar = () => {
  const params = useParams()
  const countryCode = (params?.countryCode as string) || "pa"
  const router = useRouter()
  const [q, setQ] = useState("")

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const term = q.trim()
    if (term) router.push(`/${countryCode}/search?q=${encodeURIComponent(term)}`)
  }

  return (
    <form onSubmit={submit} className="w-full max-w-xs">
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar productos…"
        aria-label="Buscar productos"
        className="w-full rounded-md border border-ui-border-base bg-ui-bg-field px-3 py-1.5 text-sm outline-none focus:border-ui-border-interactive"
      />
    </form>
  )
}

export default SearchBar
