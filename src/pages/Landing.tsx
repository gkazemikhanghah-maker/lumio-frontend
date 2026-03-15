import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import { motion } from "framer-motion";
import {
  BarChart3, Target, FileText, Building2, Check, X,
  Clock, HelpCircle, XCircle, ArrowRight, Search } from
"lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] as const }
  })
};

const steps = [
{ num: "1", emoji: "🔍", title: "Search Your Target Role", desc: "Type any job title. We analyze thousands of real postings instantly." },
{ num: "2", emoji: "📊", title: "See Market Intelligence", desc: "Skills in demand, salary ranges, top hiring companies, and trending skills." },
{ num: "3", emoji: "🎯", title: "Find Your Skill Gap", desc: "Tick what you know. Get your Market Fit Score and see exactly what's missing." },
{ num: "4", emoji: "📄", title: "Build Your Resume", desc: "We write your resume around real market data — section by section, with your approval." }];


const features = [
{ icon: BarChart3, title: "Real Market Intelligence", desc: "See exactly which skills appear in 82% of job postings vs which ones are dying. Updated daily from real job data.", badge: null },
{ icon: Target, title: "Skill Gap & Market Fit Score", desc: "Tick what you already know. Get a score out of 100 and see your biggest opportunities ranked by impact.", badge: "Most Popular" },
{ icon: Building2, title: "Company Intel", desc: "Search any company. See which roles they hire for, what skills they want, and how their salaries compare to market.", badge: null },
{ icon: FileText, title: "Conversational Resume Builder", desc: "Not a form. An AI that asks you questions, writes your resume section by section, and optimizes for ATS.", badge: null }];


const comparisonRows = [
{ feature: "Starts from real market data", lumio: true, jobscan: false, teal: false, resumax: false },
{ feature: "Skill Gap Score", lumio: true, jobscan: false, teal: false, resumax: false },
{ feature: "Company Intelligence", lumio: true, jobscan: false, teal: false, resumax: false },
{ feature: "AI Resume Builder", lumio: true, jobscan: false, teal: true, resumax: true },
{ feature: "Real-time skill trends", lumio: true, jobscan: false, teal: false, resumax: false },
{ feature: "Resume Templates", lumio: true, jobscan: false, teal: true, resumax: true }];


const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="gradient-mesh pt-32 pb-24 px-4">
        <div className="container flex flex-col items-center text-center">
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
            className="text-primary font-heading font-semibold text-sm tracking-widest uppercase mb-4">
            Job Market Intelligence
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-foreground mb-6 leading-tight max-w-4xl">
            Know Exactly What the Job Market Wants{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Before You Apply
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 font-body">Stop guessing. Lumio analyzes thousands of real job postings to show you the skills you need, the gaps you have, and builds your resume around real data, not templates!

          </motion.p>
          <SearchBar size="large" />
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="mt-6 flex gap-2 flex-wrap justify-center">
            {["Product Manager", "Data Scientist", "UX Designer"].map((s) =>
            <span key={s} onClick={() => navigate(`/dashboard?q=${encodeURIComponent(s)}`)}
            className="text-xs text-muted-foreground border border-border rounded-full px-3 py-1 cursor-pointer hover:border-primary/40 hover:text-primary transition-colors">
                {s}
              </span>
            )}
          </motion.div>
          <motion.button
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            onClick={() => navigate("/templates?from=resume-builder")}
            className="mt-6 border border-border rounded-xl px-6 py-2.5 text-sm font-heading font-semibold text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors flex items-center gap-2">
            <FileText className="w-4 h-4" /> Build Your Resume
          </motion.button>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="mt-8 text-xs text-muted-foreground font-body">
            Trusted by 2,400+ job seekers · Updated daily from LinkedIn, Indeed & Glassdoor
          </motion.p>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-24 px-4" style={{ backgroundColor: "#0d0d14" }}>
        <div className="container">
          <motion.p
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}
            className="text-primary font-heading font-semibold text-sm tracking-widest uppercase text-center mb-4">
            The Problem
          </motion.p>
          <motion.h2
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.5}
            className="text-3xl md:text-4xl font-heading font-bold text-center text-foreground mb-16">
            Job seekers are flying blind
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
            { icon: Clock, color: "text-amber-400", title: "Hours wasted scrolling job boards", desc: "Manually reading hundreds of postings to figure out what skills matter" },
            { icon: HelpCircle, color: "text-amber-400", title: "No idea what the market actually wants", desc: "Everyone says 'tailor your resume' but nobody tells you how" },
            { icon: XCircle, color: "text-red-400", title: "Generic resumes that get ignored", desc: "Templates built from thin air, not from real hiring data" }].
            map((item, i) =>
            <motion.div
              key={item.title}
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i + 1}
              className="rounded-2xl p-6 border transition-colors"
              style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}>
                <item.icon className={`w-10 h-10 ${item.color} mb-4`} />
                <h3 className="text-lg font-heading font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-4">
        <div className="container">
          <motion.p
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}
            className="text-primary font-heading font-semibold text-sm tracking-widest uppercase text-center mb-4">
            How It Works
          </motion.p>
          <motion.h2
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.5}
            className="text-3xl md:text-4xl font-heading font-bold text-center text-foreground mb-16">
            From market data to dream job — in 4 steps
          </motion.h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {steps.map((step, i) =>
            <motion.div
              key={step.num}
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i + 1}
              className="text-center relative">
                <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-heading font-bold text-lg">{step.num}</span>
                </div>
                {i < steps.length - 1 &&
              <ArrowRight className="hidden md:block absolute top-6 -right-3 w-5 h-5 text-primary/30" />
              }
                <p className="text-2xl mb-2">{step.emoji}</p>
                <h3 className="text-base font-heading font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-4 border-t border-border">
        <div className="container">
          <motion.p
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}
            className="text-primary font-heading font-semibold text-sm tracking-widest uppercase text-center mb-4">
            Features
          </motion.p>
          <motion.h2
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.5}
            className="text-3xl md:text-4xl font-heading font-bold text-center text-foreground mb-16">
            Everything you need. Nothing you don't.
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {features.map((f, i) =>
            <motion.div
              key={f.title}
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i + 1}
              className="rounded-2xl p-6 border transition-all hover:-translate-y-1 hover:shadow-lg relative"
              style={{ backgroundColor: "#111118", borderColor: "#1e1e2e" }}>
                {f.badge &&
              <span className="absolute top-4 right-4 bg-primary/15 text-primary text-xs font-heading font-semibold px-2.5 py-0.5 rounded-full">
                    {f.badge}
                  </span>
              }
                <f.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-lg font-heading font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24 px-4 border-t border-border">
        <div className="container">
          <motion.p
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}
            className="text-primary font-heading font-semibold text-sm tracking-widest uppercase text-center mb-4">
            Why Lumio
          </motion.p>
          <motion.h2
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.5}
            className="text-3xl md:text-4xl font-heading font-bold text-center text-foreground mb-16">
            The only tool that starts from the market — not your resume
          </motion.h2>
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
            className="max-w-3xl mx-auto overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 text-muted-foreground font-heading font-semibold">Feature</th>
                  <th className="py-4 px-4 text-primary font-heading font-semibold border-x border-primary/20">Lumio</th>
                  <th className="py-4 px-4 text-muted-foreground font-heading font-semibold">Jobscan</th>
                  <th className="py-4 px-4 text-muted-foreground font-heading font-semibold">Teal</th>
                  <th className="py-4 px-4 text-muted-foreground font-heading font-semibold">ResuMax</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row) =>
                <tr key={row.feature} className="border-b border-border/50">
                    <td className="py-3 px-4 text-foreground">{row.feature}</td>
                    <td className="py-3 px-4 text-center border-x border-primary/20">
                      {row.lumio ? <Check className="w-4 h-4 text-primary mx-auto" /> : <X className="w-4 h-4 text-muted-foreground/40 mx-auto" />}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.jobscan ? <Check className="w-4 h-4 text-primary mx-auto" /> : <X className="w-4 h-4 text-muted-foreground/40 mx-auto" />}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.teal ? <Check className="w-4 h-4 text-primary mx-auto" /> : <X className="w-4 h-4 text-muted-foreground/40 mx-auto" />}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.resumax ? <Check className="w-4 h-4 text-primary mx-auto" /> : <X className="w-4 h-4 text-muted-foreground/40 mx-auto" />}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-4 border-t border-border">
        <div className="container">
          <motion.h2
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}
            className="text-3xl md:text-4xl font-heading font-bold text-center text-foreground mb-4">
            Simple Pricing
          </motion.h2>
          <p className="text-center text-muted-foreground mb-16">Start free, upgrade when you're ready.</p>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Free */}
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
              className="border border-border rounded-2xl bg-card p-8">
              <h3 className="font-heading font-semibold text-foreground mb-1">Free</h3>
              <div className="text-3xl font-heading font-bold text-foreground mb-4">$0<span className="text-sm text-muted-foreground font-body font-normal">/mo</span></div>
              <ul className="space-y-3 mb-8">
                {["3 searches/month", "Skill Gap Analysis", "Market Intelligence"].map((item) =>
                <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary" /> {item}
                  </li>
                )}
              </ul>
              <button onClick={() => navigate("/signup")} className="w-full py-2.5 rounded-xl border border-border text-foreground font-heading font-semibold text-sm hover:bg-muted transition-colors">
                Get Started
              </button>
            </motion.div>
            {/* Pro */}
            <motion.div
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2}
              className="border border-primary/40 rounded-2xl bg-card p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-heading font-semibold px-3 py-1 rounded-bl-xl">Popular</div>
              <h3 className="font-heading font-semibold text-foreground mb-1">Pro</h3>
              <div className="text-3xl font-heading font-bold text-foreground mb-4">$15<span className="text-sm text-muted-foreground font-body font-normal">/mo</span></div>
              <ul className="space-y-3 mb-8">
                {["Unlimited searches", "AI Resume Builder", "Company Intel", "Resume Templates", "Priority support"].map((item) =>
                <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary" /> {item}
                  </li>
                )}
              </ul>
              <button onClick={() => navigate("/signup")} className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-heading font-semibold text-sm hover:bg-primary/90 transition-colors">
                Upgrade to Pro
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
        <div className="container relative text-center">
          <motion.h2
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0}
            className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            Your next job starts with knowing the market.
          </motion.h2>
          <motion.p
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={0.5}
            className="text-muted-foreground mb-10 text-lg font-body">
            Join 2,400+ job seekers who search smarter with Lumio.
          </motion.p>
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
            className="flex gap-4 justify-center flex-wrap">
            <button onClick={() => navigate("/signup")}
            className="bg-primary text-primary-foreground font-heading font-semibold rounded-xl px-8 py-3 text-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
            className="border border-border text-foreground font-heading font-semibold rounded-xl px-8 py-3 text-sm hover:bg-muted transition-colors">
              See How It Works ↓
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 px-4">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-heading font-bold text-foreground text-lg mb-2">Lumio</h4>
              <p className="text-sm text-muted-foreground">Your career, illuminated.</p>
            </div>
            <div className="flex gap-6 md:justify-center">
              {[
              { label: "Market Intelligence", path: "/dashboard" },
              { label: "Company Intel", path: "/company-intel" },
              { label: "Templates", path: "/templates" },
              { label: "Pricing", path: "#" }].
              map((link) =>
              <span key={link.label} onClick={() => navigate(link.path)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  {link.label}
                </span>
              )}
            </div>
            <div className="md:text-right">
              <p className="text-sm text-muted-foreground">Built with real job market data</p>
            </div>
          </div>
          <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">© 2025 Lumio · Privacy · Terms</p>
          </div>
        </div>
      </footer>
    </div>);

};

export default Landing;