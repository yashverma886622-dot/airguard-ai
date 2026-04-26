import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebounce } from '../hooks/useDebounce';

export default function SearchBar({ value = '', onSearch, suggestions = [] }) {
  const [query, setQuery] = useState(value);
  const debouncedQuery = useDebounce(query);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    if (debouncedQuery.trim().length > 1) {
      onSearch(debouncedQuery.trim());
    }
  }, [debouncedQuery, onSearch]);

  const submit = (event) => {
    event.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <form onSubmit={submit} className="relative w-full">
      <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      <input
        className="focus-ring h-12 w-full rounded-lg border border-slate-200 bg-white/90 pl-11 pr-4 text-base text-slate-900 shadow-sm transition duration-300 placeholder:text-slate-400 hover:border-sea/40 hover:shadow-soft dark:border-slate-700 dark:bg-slate-900/90 dark:text-white"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        list="airguard-ai-cities"
        placeholder="Search city"
        aria-label="Search city"
      />
      <datalist id="airguard-ai-cities">
        {suggestions.map((city) => (
          <option key={city.name} value={city.name} />
        ))}
      </datalist>
    </form>
  );
}
