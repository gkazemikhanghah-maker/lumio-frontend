import { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, TrendingUp, TrendingDown, Minus, Building2, DollarSign, Sparkles, Lightbulb } from "lucide-react";
import Logo from "@/components/Logo";
import SearchBar from "@/components/SearchBar";
import { exampleSearches } from "@/lib/mockData";
import { analyzeJob, type SkillData, type SalaryData, type CompanyData, type TrendData } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const experienceLevels = ["All Experience Levels", "Entry Level", "Mid Level", "Senior Level", "Lead/Principal"];
const workTypes = ["All Work Types", "Remote", "Hybrid", "On-site"];
const industries = ["All Industries", "Tech", "Finance", "Healthcare", "E-commerce", "SaaS"];

const FilterDropdown = ({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="bg-card border border-border rounded-lg px-3 py-2 text-xs text-primary font-body outline-none cursor-pointer hover:border-primary/40 transition-colors appearance-none pr-8"
    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2300e5a0' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}
  >
    {options.map((o) => <option key={o} value={o}>{o}</option>)}
  </select>
);

const TrendIcon = ({ trend }: { trend: "up" | "down" | "stable" }) => {
  if (trend === "up") return <TrendingUp className="w-3.5 h-3.5 text-primary" />;
  if (trend === "down") return <TrendingDown className="w-3.5 h-3.5 text-destructive" />;
  return <Minus className="w-3.5 h-3.5 text-muted-foreground" />;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [hasSearched, setHasSearched] = useState(!!initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  const user = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("lumio_user") || "{}"); } catch { return {}; }
  }, []);
  const [loadingStep, setLoadingStep] = useState(0);
  const [experience, setExperience] = useState(experienceLevels[0]);
  const [workType, setWorkType] = useState(workTypes[0]);
  const [industry, setIndustry] = useState(industries[0]);

  // API result state
  const [skillsData, setSkillsData] = useState<SkillData[]>([]);
  const [salaryData, setSalaryData] = useState<SalaryData>({ median: 0, min: 0, max: 0 });
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [summary, setSummary] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  const loadingSteps = ["Scanning job postings...", "Extracting skills...", "Analyzing salaries...", "Generating insights..."];

  const handleSearch = (q: string) => {
    setQuery(q);
    setIsLoading(true);
    setLoadingStep(0);
    setHasSearched(false);

    // Cancel previous request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    analyzeJob({
      job_title: q,
      experience_level: experience === experienceLevels[0] ? "" : experience,
      work_type: workType === workTypes[0] ? "" : workType,
      country: "US",
      max_jobs: 30,
    }, controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        console.log("API Response:", data);
        setSkillsData(data.skills || []);
        setSalaryData(data.salary || { median: 0, min: 0, max: 0 });
        setCompanies(data.companies || []);
        setTrends(data.trends || []);
        setSummary(data.summary || "");
        setIsLoading(false);
        setHasSearched(true);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        console.error("API Error:", err);
        setIsLoading(false);
        toast({ title: "Analysis failed. Please try again.", variant: "destructive" });
      });
  };

  useEffect(() => {
    if (!isLoading) return;
    if (loadingStep < loadingSteps.length) {
      const timer = setTimeout(() => setLoadingStep((s) => s + 1), 800);
      return () => clearTimeout(timer);
    }
    // Don't auto-end loading — the API promise handles that
  }, [isLoading, loadingStep]);

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
    if (user.onboarded) {
      setShowWelcome(true);
    }
  }, []);

  const formatSalary = (n: number) => `$${(n / 1000).toFixed(0)}K`;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container flex items-center gap-4 h-16">
          <Logo />
          <div className="flex-1 max-w-xl">
            <p className="text-xs font-heading mb-1" style={{ color: "#8b8b9e" }}></p>
            <SearchBar defaultValue={query} onSearch={handleSearch} />
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="border-b border-border">
        <div className="container flex items-center gap-3 py-3">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Filters:</span>
          <FilterDropdown options={experienceLevels} value={experience} onChange={setExperience} />
          <FilterDropdown options={workTypes} value={workType} onChange={setWorkType} />
          <FilterDropdown options={industries} value={industry} onChange={setIndustry} />
        </div>
      </div>

      <div className="container py-8">
        {/* Welcome Banner */}
        <AnimatePresence>
          {showWelcome && user.name && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 border-l-4 border-l-primary border border-border rounded-xl bg-card p-4 flex items-center justify-between"
            >
              <p className="text-sm text-muted-foreground">
                👋 <span className="text-foreground font-semibold">Welcome, {user.name}!</span>{" "}
                Here's the market for <span className="text-primary font-semibold">{user.role || query}</span> roles at your level.
              </p>
              <button
                onClick={() => setShowWelcome(false)}
                className="text-xs text-muted-foreground hover:text-foreground ml-4 shrink-0"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence mode="wait">
          {/* Loading */}
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-32"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 animate-pulse">
                <Search className="w-6 h-6 text-primary" />
              </div>
              <div className="space-y-2">
                {loadingSteps.map((step, i) => (
                  <motion.p
                    key={step}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: i <= loadingStep ? 1 : 0.3, x: 0 }}
                    className={`text-sm font-body ${i <= loadingStep ? "text-primary" : "text-muted-foreground"}`}
                  >
                    {i < loadingStep ? "✓" : i === loadingStep ? "◉" : "○"} {step}
                  </motion.p>
                ))}
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {!isLoading && !hasSearched && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-32"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Search className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-2">Discover Job Market Intelligence</h2>
              <p className="text-muted-foreground mb-8">Enter a job title above to get instant insights on skills, salaries, and trends</p>
              <div className="flex gap-2 flex-wrap justify-center">
                {exampleSearches.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSearch(s)}
                    className="text-xs border border-border rounded-full px-4 py-1.5 text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Results */}
          {!isLoading && hasSearched && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Title */}
              <div className="mb-8">
                <h1 className="text-3xl font-heading font-bold text-foreground capitalize">{query}</h1>
                <p className="text-sm text-muted-foreground">Market Intelligence and trends</p>
              </div>

              {/* Grid */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Skills */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="border border-border rounded-2xl bg-card p-6"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <h3 className="font-heading font-semibold text-foreground">Top Skills in Demand</h3>
                  </div>
                  <div className="space-y-4">
                    {skillsData.map((s, i) => (
                      <div key={s.name || s.skill} className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground w-40 shrink-0">{s.name || s.skill}</span>
                        <div className="flex-1 bg-muted rounded-full h-2.5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${s.percentage}%` }}
                            transition={{ duration: 0.8, delay: 0.2 + i * 0.05 }}
                            className="h-full bg-primary rounded-full"
                          />
                        </div>
                        <span className="text-xs text-primary font-semibold w-10 text-right">{s.percentage}%</span>
                        <TrendIcon trend={s.trend} />
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Salary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="border border-border rounded-2xl bg-card p-6"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <DollarSign className="w-5 h-5 text-primary" />
                    <h3 className="font-heading font-semibold text-foreground">Salary Range</h3>
                  </div>
                  <div className="text-center py-4">
                    <p className="text-xs text-muted-foreground mb-1">Median Salary</p>
                    <p className="text-4xl font-heading font-bold text-primary">${salaryData.median.toLocaleString()}</p>
                    <div className="mt-6 flex items-center justify-center gap-12">
                      <div>
                        <p className="text-xs text-muted-foreground">Min</p>
                        <p className="text-lg font-heading font-semibold text-foreground">${salaryData.min.toLocaleString()}</p>
                      </div>
                      <div className="w-32 h-2 bg-muted rounded-full overflow-hidden relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-primary to-primary/30 rounded-full" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Max</p>
                        <p className="text-lg font-heading font-semibold text-foreground">${salaryData.max.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Companies */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="border border-border rounded-2xl bg-card p-6"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <Building2 className="w-5 h-5 text-primary" />
                    <h3 className="font-heading font-semibold text-foreground">Top Hiring Companies</h3>
                  </div>
                  <div className="space-y-3">
                    {companies.map((c, i) => (
                      <div key={c.name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-xs font-heading font-bold text-foreground">
                            {c.name[0]}
                          </div>
                          <Link to={`/company/${c.name.toLowerCase()}`} className="text-sm text-foreground hover:text-primary transition-colors">{c.name}</Link>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground border border-border rounded px-2 py-0.5">{c.industry}</span>
                          <span className="text-sm font-semibold text-primary">{c.positions}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Trends */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="border border-border rounded-2xl bg-card p-6"
                >
                  <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <h3 className="font-heading font-semibold text-foreground">Skill Trends</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {trends.map((t) => (
                      <div
                        key={t.skill}
                        className={`border rounded-xl p-3 ${t.direction === "up" ? "border-primary/20 bg-primary/5" : "border-destructive/20 bg-destructive/5"}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs">{t.icon}</span>
                          {t.direction === "up" ? (
                            <TrendingUp className="w-3.5 h-3.5 text-primary" />
                          ) : (
                            <TrendingDown className="w-3.5 h-3.5 text-destructive" />
                          )}
                        </div>
                        <p className="text-xs font-semibold text-foreground">{t.skill}</p>
                        <p className={`text-sm font-heading font-bold ${t.direction === "up" ? "text-primary" : "text-destructive"}`}>
                          {(t.change_pct ?? t.change ?? 0) > 0 ? "+" : ""}{t.change_pct ?? t.change ?? 0}%
                          <span className="text-[10px] text-muted-foreground font-body font-normal ml-1">vs last year</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* AI Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="border border-border rounded-2xl bg-card p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  <h3 className="font-heading font-semibold text-foreground">AI Market Summary</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>
                <p className="text-xs text-muted-foreground/50 mt-4 italic">
                  ✦ Generated by AI based on current market trends and data
                </p>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-center py-8"
              >
                <button
                  onClick={() => navigate(`/skill-gap?job=${encodeURIComponent(query)}`)}
                  className="bg-primary text-primary-foreground font-heading font-semibold px-8 py-3 rounded-xl hover:bg-primary/90 transition-colors text-sm"
                >
                  Build Your Resume Based on This Data →
                </button>
              </motion.div>
              {/* Spacer for sticky bar */}
              <div className="h-16" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sticky bottom bar — only when results are showing */}
      {hasSearched && !isLoading && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t" style={{ background: '#111118', borderColor: '#1e1e2e', padding: '16px' }}>
          <div className="container flex items-center justify-between">
            <p className="text-sm text-muted-foreground font-heading">Ready to close your skill gaps?</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/skill-gap?job=${encodeURIComponent(query)}`)}
                className="bg-primary text-primary-foreground font-heading font-semibold px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors text-sm"
              >
                Check My Skill Gap →
              </button>
              <button
                onClick={() => navigate('/resume-builder')}
                className="border border-border text-foreground font-heading font-semibold px-5 py-2.5 rounded-lg hover:border-primary/40 transition-colors text-sm"
              >
                Build Resume
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
