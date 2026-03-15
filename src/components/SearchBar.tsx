import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

interface SearchBarProps {
  defaultValue?: string;
  onSearch?: (query: string) => void;
  size?: "large" | "default";
}

const SearchBar = ({ defaultValue = "", onSearch, size = "default" }: SearchBarProps) => {
  const [query, setQuery] = useState(defaultValue);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!query.trim()) return;
    if (onSearch) {
      onSearch(query);
    } else {
      navigate(`/dashboard?q=${encodeURIComponent(query)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const isLarge = size === "large";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`relative flex items-center w-full border border-border rounded-2xl bg-card overflow-hidden transition-all focus-within:border-primary/50 focus-within:shadow-[0_0_20px_hsl(160_100%_45%/0.1)] ${isLarge ? "max-w-3xl" : "max-w-2xl"}`}
    >
      <Search className={`absolute left-4 text-muted-foreground ${isLarge ? "w-5 h-5" : "w-4 h-4"}`} />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter a job title (e.g. Product Manager)"
        className={`w-full bg-transparent outline-none text-foreground placeholder:text-muted-foreground font-body ${isLarge ? "pl-12 pr-32 py-5 text-lg" : "pl-11 pr-28 py-3.5 text-sm"}`}
      />
      <button
        onClick={handleSearch}
        className={`absolute right-3 bg-primary text-primary-foreground font-heading font-semibold rounded-xl hover:bg-primary/90 transition-colors ${isLarge ? "px-6 py-2.5 text-sm" : "px-5 py-2 text-xs"}`}
      >
        Search
      </button>
    </motion.div>
  );
};

export default SearchBar;
