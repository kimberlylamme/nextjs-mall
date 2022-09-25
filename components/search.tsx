import { useRef } from 'react'
import { SearchIcon } from './svg'
const Search = ({ keyWord = '', onSearch = (f: any) => f }: any) => {
  const searchRef = useRef<HTMLInputElement>(null)
  const onSearchClick = () => {
    if (searchRef.current) {
      onSearch(searchRef.current.value)
    }
  }
  return (
    <div className="relative">
      <input
        ref={searchRef}
        type="text"
        className="w-full rounded-3xl border border-solid border-gray-300 px-4 py-1 text-gray-700 outline-none"
        placeholder="Search..."
        name="search"
        defaultValue={keyWord ? keyWord : ''}
      />
      <div className="absolute right-2 top-1 z-10 text-gray-400" onClick={onSearchClick}>
        <SearchIcon />
      </div>
    </div>
  )
}

export default Search
