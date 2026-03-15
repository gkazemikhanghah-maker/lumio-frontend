import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";

const CompanyIntel = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (!query.trim()) return;
    navigate(`/company/${encodeURIComponent(query.trim().toLowerCase())}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl w-full"
        >
          <h1 className="text-4xl font-heading font-bold text-foreground mb-3">Company Intel</h1>
          <p className="text-muted-foreground text-sm mb-8">
            Search any company to see who they hire, what skills they want, and what they pay.
          </p>
          <div className="relative flex items-center w-full max-w-xl mx-auto border border-border rounded-2xl bg-card overflow-hidden focus-within:border-primary/50 focus-within:shadow-[0_0_20px_hsl(160_100%_45%/0.1)] transition-all">
            <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="e.g. Google, Stripe, Amazon..."
              className="w-full bg-transparent outline-none text-foreground placeholder:text-muted-foreground font-body pl-12 pr-28 py-4 text-base"
            />
            <button
              onClick={handleSearch}
              className="absolute right-3 bg-primary text-primary-foreground font-heading font-semibold rounded-xl px-5 py-2 text-sm hover:bg-primary/90 transition-colors"
            >
              Search
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CompanyIntel;
