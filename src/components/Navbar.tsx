import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const isLanding = location.pathname === "/";

  const handleSearch = () => {
    if (!query.trim()) return;
    navigate(`/dashboard?q=${encodeURIComponent(query)}`);
    setQuery("");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container flex items-center justify-between h-16">
        <Logo />
        <div className="flex items-center gap-4">
          {!isLanding && (
            <div className="relative flex items-center">
              <Search className="absolute left-2.5 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search a job title..."
                className="h-8 w-44 rounded-lg border border-border bg-card pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          )}
          <Link to="/company-intel">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Company Intel
            </Button>
          </Link>
          <Link to="/templates">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Templates
            </Button>
          </Link>
          <Link to="/signin">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Sign In
            </Button>
          </Link>
          <Link to="/signup">
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
