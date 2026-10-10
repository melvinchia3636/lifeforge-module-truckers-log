import { parseAsInteger, useQueryStates } from 'nuqs'

export default function useFilter() {
  const [filter, setFilter] = useQueryStates({
    page: parseAsInteger.withDefault(1)
  })

  function updateFilter<K extends keyof typeof filter>(
    keyOrUpdates: K | Partial<typeof filter>,
    value?: (typeof filter)[K]
  ) {
    if (typeof keyOrUpdates === 'string') {
      setFilter(prev => ({
        ...prev,
        [keyOrUpdates]: value
      }))
    } else {
      setFilter(prev => ({
        ...prev,
        ...keyOrUpdates
      }))
    }
  }

  return {
    ...filter,
    updateFilter
  }
}
