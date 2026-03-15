import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, TrendingUp, DollarSign, MessageSquare, Lightbulb, ExternalLink, ArrowLeft } from "lucide-react";
import Logo from "@/components/Logo";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

// Mock data per company
const companyData: Record<string, {
  industry: string;
  positions: number;
  roles: { title: string; openings: number }[];
  skills: { name: string; percentage: number }[];
  salary: { level: string; range: string; vsMarket: string }[];
  cultureTags: string[];
  aiTip: string;
}> = {
  google: {
    industry: "Tech",
    positions: 145,
    roles: [
      { title: "Senior Product Manager", openings: 38 },
      { title: "Software Engineer (L4/L5)", openings: 29 },
      { title: "Data Scientist", openings: 22 },
      { title: "UX Designer", openings: 14 },
      { title: "Engineering Manager", openings: 11 },
    ],
    skills: [
      { name: "System Design", percentage: 92 },
      { name: "Python", percentage: 88 },
      { name: "Leadership", percentage: 79 },
      { name: "Data Analysis", percentage: 74 },
      { name: "Machine Learning", percentage: 68 },
      { name: "SQL", percentage: 65 },
    ],
    salary: [
      { level: "Junior", range: "$95K – $130K", vsMarket: "+12%" },
      { level: "Mid", range: "$140K – $185K", vsMarket: "+18%" },
      { level: "Senior", range: "$190K – $260K", vsMarket: "+22%" },
      { level: "Lead/Principal", range: "$270K – $380K", vsMarket: "+25%" },
    ],
    cultureTags: ["Data-driven", "Fast-paced", "Cross-functional", "0-to-1 experience", "Leadership required", "Remote-friendly"],
    aiTip: "Based on 145 Google PM postings, they consistently look for candidates with System Design experience, prior startup or 0-to-1 ownership, and strong data analysis skills. Mention specific metrics in your resume.",
  },
  amazon: {
    industry: "Tech",
    positions: 132,
    roles: [
      { title: "Product Manager - Technical", openings: 34 },
      { title: "Software Development Engineer", openings: 28 },
      { title: "Business Intelligence Engineer", openings: 19 },
      { title: "UX Researcher", openings: 12 },
      { title: "Program Manager", openings: 9 },
    ],
    skills: [
      { name: "Leadership Principles", percentage: 95 },
      { name: "Data Analysis", percentage: 85 },
      { name: "SQL", percentage: 80 },
      { name: "Customer Obsession", percentage: 78 },
      { name: "A/B Testing", percentage: 65 },
      { name: "Agile", percentage: 62 },
    ],
    salary: [
      { level: "Junior", range: "$90K – $125K", vsMarket: "+8%" },
      { level: "Mid", range: "$135K – $175K", vsMarket: "+14%" },
      { level: "Senior", range: "$180K – $245K", vsMarket: "+18%" },
      { level: "Lead/Principal", range: "$250K – $350K", vsMarket: "+20%" },
    ],
    cultureTags: ["Customer-obsessed", "Ownership mentality", "Bias for action", "High bar", "Data-driven", "Day 1 culture"],
    aiTip: "Amazon heavily weighs their Leadership Principles in interviews. Structure your resume with STAR-format bullets that demonstrate Customer Obsession, Ownership, and Bias for Action. Quantify everything.",
  },
};

const defaultCompany = {
  industry: "Tech",
  positions: 67,
  roles: [
    { title: "Product Manager", openings: 18 },
    { title: "Software Engineer", openings: 15 },
    { title: "Data Analyst", openings: 10 },
    { title: "Designer", openings: 8 },
    { title: "Engineering Manager", openings: 5 },
  ],
  skills: [
    { name: "Product Strategy", percentage: 82 },
    { name: "Agile", percentage: 76 },
    { name: "Data Analysis", percentage: 64 },
    { name: "SQL", percentage: 53 },
    { name: "Stakeholder Management", percentage: 71 },
    { name: "User Research", percentage: 68 },
  ],
  salary: [
    { level: "Junior", range: "$80K – $110K", vsMarket: "+5%" },
    { level: "Mid", range: "$120K – $160K", vsMarket: "+8%" },
    { level: "Senior", range: "$160K – $220K", vsMarket: "+12%" },
    { level: "Lead/Principal", range: "$220K – $300K", vsMarket: "+15%" },
  ],
  cultureTags: ["Collaborative", "Innovation-focused", "Fast-paced", "Remote-friendly", "Growth mindset"],
  aiTip: "Focus on demonstrating measurable impact and cross-functional collaboration. Highlight any experience with data-driven decision making and agile methodologies.",
};

const CompanyIntelligence = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const companyName = name ? name.charAt(0).toUpperCase() + name.slice(1) : "Company";
  const data = companyData[name?.toLowerCase() || ""] || defaultCompany;
  const maxOpenings = Math.max(...data.roles.map((r) => r.openings));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container flex items-center gap-4 h-16">
          <Link to="/dashboard">
            <Logo />
          </Link>
        </div>
      </header>

      <div className="container py-8 space-y-8">
        {/* Back + Company Header */}
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center text-2xl font-heading font-bold text-foreground">
              {companyName[0]}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-heading font-bold text-foreground">{companyName}</h1>
                <span className="text-xs text-muted-foreground border border-border rounded px-2 py-0.5">{data.industry}</span>
              </div>
              <p className="text-sm text-muted-foreground">Currently hiring: <span className="text-primary font-semibold">{data.positions} positions</span></p>
            </div>
            <a
              href={`https://www.linkedin.com/jobs/search/?keywords=${companyName}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-xl px-4 py-2.5 hover:bg-primary/90 transition-colors"
            >
              See open roles <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Most In-Demand Roles */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={0}
            className="border border-border rounded-2xl bg-card p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <Building2 className="w-5 h-5 text-primary" />
              <h3 className="font-heading font-semibold text-foreground">Most In-Demand Roles</h3>
            </div>
            <div className="space-y-3">
              {data.roles.map((role, i) => (
                <div key={role.title} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-5 text-right">{i + 1}.</span>
                  <span className="text-sm text-foreground w-48 shrink-0 truncate">{role.title}</span>
                  <div className="flex-1 bg-muted rounded-full h-2.5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(role.openings / maxOpenings) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.1 + i * 0.05 }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                  <span className="text-xs text-primary font-semibold w-20 text-right">{role.openings} openings</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Skills */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="border border-border rounded-2xl bg-card p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="font-heading font-semibold text-foreground">Top Skills They Look For</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-4">{companyName} specifically values:</p>
            <div className="space-y-3">
              {data.skills.map((s, i) => (
                <div key={s.name} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-40 shrink-0">{s.name}</span>
                  <div className="flex-1 bg-muted rounded-full h-2.5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${s.percentage}%` }}
                      transition={{ duration: 0.8, delay: 0.2 + i * 0.05 }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                  <span className="text-xs text-primary font-semibold w-10 text-right">{s.percentage}%</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Salary Ranges */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="border border-border rounded-2xl bg-card p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <DollarSign className="w-5 h-5 text-primary" />
              <h3 className="font-heading font-semibold text-foreground">Salary Ranges at {companyName}</h3>
            </div>
            <div className="space-y-3">
              {data.salary.map((s) => (
                <div key={s.level} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                  <span className="text-sm text-foreground font-medium">{s.level}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">{s.range}</span>
                    <span className="text-xs text-primary font-semibold bg-primary/10 rounded-full px-2 py-0.5">{s.vsMarket} vs market</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Culture & Interview Signals */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="border border-border rounded-2xl bg-card p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare className="w-5 h-5 text-primary" />
              <h3 className="font-heading font-semibold text-foreground">Culture & Interview Signals</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-4">Extracted from their job postings:</p>
            <div className="flex flex-wrap gap-2">
              {data.cultureTags.map((tag) => (
                <span key={tag} className="text-xs border border-primary/20 bg-primary/5 text-primary rounded-full px-3 py-1.5">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* AI Tip */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={4}
          className="border border-border rounded-2xl bg-card p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-primary" />
            <h3 className="font-heading font-semibold text-foreground">How to Get In</h3>
          </div>
          <blockquote className="text-sm text-muted-foreground leading-relaxed border-l-2 border-primary pl-4">
            {data.aiTip}
          </blockquote>
          <p className="text-xs text-muted-foreground/50 mt-4 italic">✦ Generated by AI based on current posting analysis</p>
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={fadeUp} initial="hidden" animate="visible" custom={5}
          className="text-center py-8"
        >
          <button
            onClick={() => navigate(`/resume-builder?company=${encodeURIComponent(companyName)}`)}
            className="bg-primary text-primary-foreground font-heading font-semibold px-8 py-3 rounded-xl hover:bg-primary/90 transition-colors text-sm"
          >
            Build a Resume Tailored for {companyName} →
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default CompanyIntelligence;
