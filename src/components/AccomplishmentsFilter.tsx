import { createEffect, createMemo, createSignal } from "solid-js"
import SearchBar from "@components/SearchBar"

type Item = {
  id: string
  title: string
  summary: string
  tags: string[]
}

type Props = {
  items: Item[]
  tags: string[]
}

export default function AccomplishmentsFilter({ items, tags }: Props) {
  const [query, setQuery] = createSignal("")
  const [selectedTags, setSelectedTags] = createSignal<Set<string>>(new Set())

  const filtered = createMemo(() => {
    const q = query().trim().toLowerCase()
    const active = selectedTags()
    let results = items
    if (q.length > 0) {
      results = results.filter((item) => {
        const haystack = [
          item.title,
          item.summary,
          ...item.tags,
        ]
          .join(" ")
          .toLowerCase()
        return haystack.includes(q)
      })
    }
    if (active.size > 0) {
      results = results.filter((item) =>
        Array.from(active).every((tag) => item.tags.includes(tag))
      )
    }
    return results
  })

  createEffect(() => {
    const visible = new Set(filtered().map((i) => i.id))
    for (const item of items) {
      const el = document.querySelector(
        `[data-accomplishment-id="${item.id}"]`
      )
      if (!el) continue
      el.classList.toggle("hidden", !visible.has(item.id))
    }
  })

  const onSearchInput = (e: Event) => {
    setQuery((e.target as HTMLInputElement).value)
  }

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      const next = new Set(prev)
      if (next.has(tag)) next.delete(tag)
      else next.add(tag)
      return next
    })
  }

  const clearAll = () => {
    setQuery("")
    setSelectedTags(new Set<string>())
  }

  const hasActiveFilters = () =>
    query().length > 0 || selectedTags().size > 0

  return (
    <div class="flex flex-col gap-3">
      <SearchBar
        onSearchInput={onSearchInput}
        query={query}
        setQuery={setQuery}
        placeholderText="Filter accomplishments..."
      />
      <div class="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const isSelected = () => selectedTags().has(tag)
          return (
            <button
              type="button"
              aria-pressed={isSelected()}
              onClick={() => toggleTag(tag)}
              class={`text-xs rounded px-2 py-0.5 border blend ${
                isSelected()
                  ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white"
                  : "border-black/15 dark:border-white/20 hover:bg-black/5 hover:dark:bg-white/10"
              }`}
            >
              {tag}
            </button>
          )
        })}
      </div>
      <div class="flex items-center justify-between text-sm opacity-60">
        <div>
          Showing {filtered().length} of {items.length}
        </div>
        {hasActiveFilters() && (
          <button
            type="button"
            onClick={clearAll}
            class="text-xs underline hover:opacity-75"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  )
}
