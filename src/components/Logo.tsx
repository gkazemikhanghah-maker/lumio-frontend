import { Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";

const Logo = () => (
  <Link to="/" className="flex items-center gap-2.5">
    <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
      <Lightbulb className="w-5 h-5 text-primary-foreground" />
    </div>
    <span className="text-xl font-heading font-bold text-foreground">Lumio</span>
  </Link>
);

export default Logo;
