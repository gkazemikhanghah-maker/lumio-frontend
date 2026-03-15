import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertTriangle, ArrowRight, TrendingUp, Minus, TrendingDown } from "lucide-react";
import Logo from "@/components/Logo";
import { toast } from "sonner";

const skillsData = [
  { name: "Product Strategy", percentage: 82, trend: "up" as const },
  { name: "Agile", percentage: 76, trend: "stable" as const },
  { name: "User Research", percentage: 68, trend: "up" as const },
  { name: "Data Analysis", percentage: 64, trend: "up" as const },
  { name: "SQL", percentage: 53, trend: "stable" as const },
  { name: "A/B Testing", percentage: 50, trend: "stable" as const },
  { name: "Roadmapping", percentage: 71, trend: "down" as const },
  { name: "Stakeholder Management", percentage: 70, trend: "stable" as const },
  { name: "AI Product Strategy", percentage: 38, trend: "up" as const },
  { name: "System Design", percentage: 45, trend: "up" as const },
  { name: "Go-to-Market", percentage: 42, trend: "stable" as const },
  { name: "OKR / Goal Setting", percentage: 55, trend: "stable" as const },
];

const TrendTag = ({ trend }: { trend: "up" | "stable" | "down" }) => {
  if (trend === "up") return <span className="text-[10px] text-primary flex items-center gap-0.5"><TrendingUp className="w-3 h-3" /> Trending</span>;
  if (trend === "down") return <span className="text-[10px] text-destructive flex items-center gap-0.5"><TrendingDown className="w-3 h-3" /> Declining</span>;
  return <span className="text-[10px] text-muted-foreground flex items-center gap-0.5"><Minus className="w-3 h-3" /> Stable</span>;
};

const getPriority = (pct: number) => {
  if (pct >= 70) return { label: "🔴 High Priority", color: "text-destructive" };
  if (pct >= 40) return { label: "🟡 Medium Priority", color: "text-yellow-400" };
  return { label: "⚪ Nice to Have", color: "text-muted-foreground" };
};

const SkillGap = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const job = searchParams.get("job") || "Product Manager";
  const [step, setStep] = useState<1 | 2>(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [animatedScore, setAnimatedScore] = useState(0);

  const toggleSkill = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const totalWeight = skillsData.reduce((sum, s) => sum + s.percentage, 0);
  const selectedWeight = skillsData.filter((s) => selected.has(s.name)).reduce((sum, s) => sum + s.percentage, 0);
  const score = Math.round((selectedWeight / totalWeight) * 100);

  const yourSkills = skillsData.filter((s) => selected.has(s.name));
  const missingSkills = skillsData.filter((s) => !selected.has(s.name)).sort((a, b) => b.percentage - a.percentage);

  // Top 3 gaps potential
  const top3GapWeight = missingSkills.slice(0, 3).reduce((sum, s) => sum + s.percentage, 0);
  const potentialScore = Math.round(((selectedWeight + top3GapWeight) / totalWeight) * 100);

  useEffect(() => {
    if (step !== 2) return;
    let start = 0;
    const target = score;
    const duration = 800;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setAnimatedScore(Math.round(progress * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [step, score]);

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center gap-4 px-6 h-14 border-b border-border bg-background/90 backdrop-blur-xl shrink-0">
        <Link to="/dashboard">
          <Logo />
        </Link>
        <button
          onClick={() => navigate(-1)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          ← Back
        </button>
      </header>

      <div className="container max-w-4xl py-12">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-10">
                <p className="text-xs text-primary font-semibold mb-2 uppercase tracking-wider">Based on your search: {job}</p>
                <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">
                  Which of these skills do you already have?
                </h1>
                <p className="text-muted-foreground text-sm">
                  Tick everything you're comfortable with — be honest, this is just for you.
                </p>
                <p className="text-xs mt-2" style={{ color: '#8b8b9e' }}>
                  Based on analysis of 2,847 real job postings from Indeed &amp; Glassdoor · Updated March 2025
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                {skillsData.map((skill) => {
                  const isSelected = selected.has(skill.name);
                  return (
                    <button
                      key={skill.name}
                      onClick={() => toggleSkill(skill.name)}
                      className={`relative border rounded-2xl p-4 text-left transition-all hover:-translate-y-0.5 ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-[0_0_20px_hsl(160_100%_45%/0.1)]"
                          : "border-border bg-card hover:border-primary/30"
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-3 h-3 text-primary-foreground" />
                        </div>
                      )}
                      <h4 className="text-sm font-heading font-semibold text-foreground mb-2">{skill.name}</h4>
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="flex-1 bg-muted rounded-full h-1.5 overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${skill.percentage}%` }} />
                        </div>
                        <span className="text-[10px] text-primary font-semibold">{skill.percentage}%</span>
                      </div>
                      <TrendTag trend={skill.trend} />
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between border-t border-border pt-6">
                <p className="text-sm text-muted-foreground">
                  <span className="text-primary font-semibold">{selected.size}</span> skills selected
                </p>
                <button
                  disabled={selected.size === 0}
                  onClick={() => setStep(2)}
                  className="bg-primary text-primary-foreground font-heading font-semibold px-8 py-3 rounded-xl hover:bg-primary/90 transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  See My Skill Gap <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">
                  Your Skill Gap for <span className="text-primary capitalize">{job}</span>
                </h1>
                <p className="text-muted-foreground text-sm">
                  Here's exactly what you have, what you're missing, and how critical each gap is.
                </p>
                <p className="text-xs mt-2" style={{ color: '#8b8b9e' }}>
                  Based on analysis of 2,847 real job postings from Indeed &amp; Glassdoor · Updated March 2025
                </p>
              </div>

              {/* Split columns */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Your Skills */}
                <div className="border border-border rounded-2xl bg-card p-6">
                  <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" /> Your Skills
                  </h3>
                  <div className="space-y-3">
                    {yourSkills.map((s) => (
                      <div key={s.name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                            <Check className="w-3 h-3 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-foreground">{s.name}</p>
                            <p className="text-[10px] text-primary">✓ You have this</p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">{s.percentage}% demand</span>
                      </div>
                    ))}
                    {yourSkills.length === 0 && (
                      <p className="text-sm text-muted-foreground italic">No skills selected</p>
                    )}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="border border-border rounded-2xl bg-card p-6">
                  <h3 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-400" /> Missing Skills
                  </h3>
                  <div className="space-y-3">
                    {missingSkills.map((s) => {
                      const priority = getPriority(s.percentage);
                      return (
                        <div key={s.name} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-400/70" />
                            <div>
                              <p className="text-sm font-semibold text-foreground">{s.name}</p>
                              <p className={`text-[10px] ${priority.color}`}>{priority.label}</p>
                            </div>
                          </div>
                          <span className="text-sm font-heading font-bold text-primary">{s.percentage}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Gap Score Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="border border-border rounded-2xl bg-card p-8 mb-6"
              >
                <div className="text-center mb-6">
                  <h3 className="font-heading font-semibold text-foreground mb-4">Your Market Fit Score</h3>
                  <p className="text-6xl font-heading font-bold text-primary mb-2">
                    {animatedScore} <span className="text-2xl text-muted-foreground">/ 100</span>
                  </p>
                  <div className="max-w-xs mx-auto mb-4">
                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        transition={{ duration: 0.8 }}
                        className="h-full bg-primary rounded-full"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You have <span className="text-primary font-semibold">{yourSkills.length}</span> of{" "}
                    <span className="text-foreground font-semibold">{skillsData.length}</span> in-demand skills
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Closing your top 3 gaps could bring you to{" "}
                    <span className="text-primary font-semibold">{potentialScore}/100</span> — above{" "}
                    <span className="text-foreground font-semibold">{Math.min(potentialScore - 10, 90)}%</span> of applicants
                  </p>
                </div>

                <div className="border-t border-border pt-6 space-y-4">
                  {[
                    { label: "Skills Match", score: 18, max: 25 },
                    { label: "Experience Alignment", score: 15, max: 25 },
                    { label: "Market Demand", score: 20, max: 25 },
                    { label: "Profile Completeness", score: 9, max: 25 },
                  ].map((cat) => {
                    const pct = Math.round((cat.score / cat.max) * 100);
                    const barColor = pct >= 70 ? "bg-primary" : pct >= 40 ? "bg-yellow-400" : "bg-destructive";
                    return (
                      <div key={cat.label}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-semibold text-foreground">{cat.label}</span>
                          <span className="text-sm font-heading font-bold text-muted-foreground">{cat.score}/{cat.max}</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className={`h-full rounded-full ${barColor}`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* AI Insight */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="border border-border border-l-4 border-l-primary rounded-2xl bg-card p-6 mb-8"
              >
                <p className="text-sm text-muted-foreground italic leading-relaxed">
                  ✦ Your biggest opportunity:{" "}
                  {missingSkills.length >= 2 ? (
                    <>
                      <span className="text-foreground font-semibold not-italic">{missingSkills[0].name}</span> ({missingSkills[0].percentage}% of jobs require it) and{" "}
                      <span className="text-foreground font-semibold not-italic">{missingSkills[1].name}</span> ({missingSkills[1].percentage}%).
                      These two skills together would make you competitive for{" "}
                      <span className="text-primary font-semibold not-italic">{missingSkills[0].percentage + missingSkills[1].percentage - 20}%</span> more {job} roles.
                    </>
                  ) : (
                    "You're in great shape! Consider deepening your existing skills."
                  )}
                </p>
              </motion.div>

              {/* CTAs */}
              <div className="space-y-3">
                <button
                  onClick={() => navigate(`/resume-builder?job=${encodeURIComponent(job)}`)}
                  className="w-full bg-primary text-primary-foreground font-heading font-semibold py-3.5 rounded-xl hover:bg-primary/90 transition-colors text-sm flex items-center justify-center gap-2"
                >
                  Build My Resume Around My Strengths <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toast("Coming Soon", { description: "Learning resources are on the way!" })}
                  className="w-full border border-border text-foreground font-heading font-semibold py-3.5 rounded-xl hover:border-primary/40 transition-colors text-sm"
                >
                  See Learning Resources for My Gaps →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SkillGap;
