import { useState } from 'react'
import { useRuntime } from 'vtex.render-runtime'

import { tuple } from '.'

const useSearch = () => {
  const { query, setQuery } = useRuntime()

  const [displayValue, setDisplayValue] = useState(query.search)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayValue(e.target.value)
  }

  const handleSearchClear = () => {
    setQuery({ search: undefined })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSearchSubmit = (e: any) => {
    e.preventDefault()

    setQuery({ search: displayValue })
  }

  return tuple([
    { displayValue: displayValue || '', searchValue: query.search },
    {
      onSearchChange: handleSearchChange,
      onSearchClear: handleSearchClear,
      onSearchSubmit: handleSearchSubmit,
    },
  ])
}
export default useSearch
