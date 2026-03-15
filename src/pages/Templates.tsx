import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FileCheck, Sparkles, Download } from "lucide-react";
import Navbar from "@/components/Navbar";

const templates = [
  { name: "Modern", badge: "Most Popular" },
  { name: "Executive", badge: null },
  { name: "Minimal", badge: null },
  { name: "Creative", badge: "New" },
  { name: "Technical", badge: null },
  { name: "Graduate", badge: null },
];

const ModernPreview = () => (
  <div className="w-full aspect-[3/4] bg-white rounded-lg p-3 flex flex-col text-left overflow-hidden">
    <p className="text-[9px] font-semibold text-gray-900 leading-tight">Alexandra Chen</p>
    <div className="h-[1px] w-8 bg-emerald-500 mt-0.5 mb-1" />
    <p className="text-[5px] text-gray-500 leading-tight">alex.chen@email.com · (555) 234-5678 · San Francisco, CA</p>
    <p className="text-[6px] font-semibold text-gray-800 mt-2 mb-0.5">Experience</p>
    <p className="text-[5px] text-gray-700 leading-snug">Senior Product Designer — Stripe Inc.</p>
    <p className="text-[4.5px] text-gray-400 leading-snug mb-0.5">Jan 2021 – Present</p>
    <p className="text-[4.5px] text-gray-500 leading-snug">Led redesign of checkout flow, increasing conversion by 18%. Managed a team of 4 designers across 3 product lines.</p>
    <p className="text-[6px] font-semibold text-gray-800 mt-2 mb-0.5">Skills</p>
    <p className="text-[4.5px] text-gray-500 leading-snug">Figma, Prototyping, Design Systems, User Research, A/B Testing</p>
    <p className="text-[6px] font-semibold text-gray-800 mt-2 mb-0.5">Education</p>
    <p className="text-[4.5px] text-gray-500 leading-snug">B.A. Design, Stanford University — 2018</p>
  </div>
);

const ExecutivePreview = () => (
  <div className="w-full aspect-[3/4] bg-white rounded-lg p-3 flex text-left overflow-hidden gap-2">
    <div className="flex-1 flex flex-col">
      <p className="text-[9px] font-bold text-gray-900 leading-tight">James Whitfield</p>
      <p className="text-[4.5px] text-gray-400 leading-tight mt-0.5">james@whitfield.com · (555) 901-2345</p>
      <p className="text-[6px] font-bold text-gray-800 mt-2 mb-0.5 uppercase tracking-wider">Experience</p>
      <div className="h-[1px] bg-gray-300 mb-0.5" />
      <p className="text-[5px] text-gray-700 leading-snug font-medium">VP of Operations — Deloitte</p>
      <p className="text-[4.5px] text-gray-500 leading-snug">Oversaw $40M budget and 120-person division. Drove 25% efficiency gains through process automation.</p>
      <p className="text-[6px] font-bold text-gray-800 mt-2 mb-0.5 uppercase tracking-wider">Education</p>
      <div className="h-[1px] bg-gray-300 mb-0.5" />
      <p className="text-[4.5px] text-gray-500 leading-snug">MBA, Harvard Business School — 2015</p>
    </div>
    <div className="w-[35%] flex flex-col border-l border-gray-200 pl-2">
      <p className="text-[6px] font-bold text-gray-800 mb-0.5 uppercase tracking-wider">Skills</p>
      <div className="h-[1px] bg-gray-300 mb-0.5" />
      <p className="text-[4.5px] text-gray-500 leading-snug">Strategy, P&L Management, M&A, Six Sigma, Executive Leadership</p>
      <p className="text-[6px] font-bold text-gray-800 mt-2 mb-0.5 uppercase tracking-wider">Certs</p>
      <div className="h-[1px] bg-gray-300 mb-0.5" />
      <p className="text-[4.5px] text-gray-500 leading-snug">PMP, Lean Six Sigma Black Belt</p>
    </div>
  </div>
);

const MinimalPreview = () => (
  <div className="w-full aspect-[3/4] bg-white rounded-lg p-4 flex flex-col text-left overflow-hidden">
    <p className="text-[9px] font-light text-gray-800 leading-tight tracking-wide">Sofia Reyes</p>
    <p className="text-[4.5px] text-gray-400 leading-tight mt-1 tracking-wide">sofia.reyes@email.com · Portland, OR</p>
    <div className="h-[0.5px] bg-gray-200 mt-2.5 mb-2.5" />
    <p className="text-[5.5px] text-gray-600 mb-0.5 tracking-widest uppercase">Experience</p>
    <p className="text-[5px] text-gray-700 leading-snug">Content Strategist — Nike</p>
    <p className="text-[4.5px] text-gray-400 leading-snug mt-0.5">Developed brand voice guidelines adopted across 12 global markets.</p>
    <div className="h-[0.5px] bg-gray-200 mt-2.5 mb-2.5" />
    <p className="text-[5.5px] text-gray-600 mb-0.5 tracking-widest uppercase">Skills</p>
    <p className="text-[4.5px] text-gray-400 leading-snug">Copywriting, SEO, Brand Strategy, Analytics</p>
    <div className="h-[0.5px] bg-gray-200 mt-2.5 mb-2.5" />
    <p className="text-[5.5px] text-gray-600 mb-0.5 tracking-widest uppercase">Education</p>
    <p className="text-[4.5px] text-gray-400 leading-snug">B.A. English, Reed College — 2019</p>
  </div>
);

const CreativePreview = () => (
  <div className="w-full aspect-[3/4] bg-white rounded-lg flex flex-col text-left overflow-hidden">
    <div className="bg-indigo-600 px-3 py-2.5 rounded-t-lg">
      <p className="text-[9px] font-bold text-white leading-tight">Marcus Obi</p>
      <p className="text-[4.5px] text-indigo-200 leading-tight mt-0.5">marcus@obidesign.co · Lagos / Remote</p>
    </div>
    <div className="px-3 py-2 flex flex-col">
      <p className="text-[6px] font-semibold text-indigo-600 mb-0.5">Experience</p>
      <p className="text-[5px] text-gray-700 leading-snug">Creative Director — Spotify</p>
      <p className="text-[4.5px] text-gray-500 leading-snug">Directed visual identity for Wrapped 2024 campaign reaching 200M+ users.</p>
      <p className="text-[6px] font-semibold text-indigo-600 mt-2 mb-0.5">Skills</p>
      <p className="text-[4.5px] text-gray-500 leading-snug">Branding, Motion Design, Illustration, After Effects, Figma</p>
      <p className="text-[6px] font-semibold text-indigo-600 mt-2 mb-0.5">Education</p>
      <p className="text-[4.5px] text-gray-500 leading-snug">B.F.A. Graphic Design, RISD — 2017</p>
    </div>
  </div>
);

const TechnicalPreview = () => (
  <div className="w-full aspect-[3/4] bg-white rounded-lg p-3 flex flex-col text-left overflow-hidden" style={{ fontFamily: 'ui-monospace, monospace' }}>
    <p className="text-[8px] font-bold text-gray-900 leading-tight">Priya Sharma</p>
    <p className="text-[4px] text-gray-500 leading-tight mt-0.5">priya@sharma.dev · github.com/priyash</p>
    <p className="text-[5.5px] font-bold text-gray-800 mt-1.5 mb-0.5">Skills</p>
    <div className="flex flex-wrap gap-0.5 mb-1.5">
      {["Python", "Go", "AWS", "K8s", "React", "PostgreSQL", "Docker", "CI/CD"].map(s => (
        <span key={s} className="text-[4px] bg-gray-100 border border-gray-200 text-gray-600 px-1 py-[1px] rounded">{s}</span>
      ))}
    </div>
    <p className="text-[5.5px] font-bold text-gray-800 mb-0.5">Experience</p>
    <p className="text-[4.5px] text-gray-700 leading-snug">Staff Engineer — Cloudflare</p>
    <p className="text-[4px] text-gray-500 leading-snug">Architected edge caching layer handling 2M req/s. Reduced p99 latency by 40%.</p>
    <p className="text-[5.5px] font-bold text-gray-800 mt-1.5 mb-0.5">Education</p>
    <p className="text-[4px] text-gray-500 leading-snug">M.S. Computer Science, MIT — 2016</p>
  </div>
);

const GraduatePreview = () => (
  <div className="w-full aspect-[3/4] bg-white rounded-lg p-3 flex flex-col text-left overflow-hidden">
    <p className="text-[9px] font-semibold text-gray-900 leading-tight text-center">Emily Tanaka</p>
    <p className="text-[4.5px] text-gray-400 leading-tight mt-0.5 text-center">emily.t@university.edu · (555) 678-1234</p>
    <div className="h-[1px] bg-gray-200 mt-1.5 mb-1.5" />
    <p className="text-[6px] font-semibold text-gray-800 mb-0.5">Education</p>
    <p className="text-[5px] text-gray-700 leading-snug">B.S. Biology, UC Berkeley — Expected May 2025</p>
    <p className="text-[4.5px] text-gray-500 leading-snug">GPA: 3.8/4.0 · Dean's List · Honors Thesis on CRISPR applications</p>
    <p className="text-[6px] font-semibold text-gray-800 mt-2 mb-0.5">Experience</p>
    <p className="text-[5px] text-gray-700 leading-snug">Research Intern — Genentech</p>
    <p className="text-[4.5px] text-gray-500 leading-snug">Assisted in clinical trial data analysis for Phase II oncology study.</p>
    <p className="text-[6px] font-semibold text-gray-800 mt-2 mb-0.5">Skills</p>
    <p className="text-[4.5px] text-gray-500 leading-snug">R, SPSS, Lab Techniques, Technical Writing</p>
  </div>
);

const previewComponents: Record<string, React.FC> = {
  Modern: ModernPreview,
  Executive: ExecutivePreview,
  Minimal: MinimalPreview,
  Creative: CreativePreview,
  Technical: TechnicalPreview,
  Graduate: GraduatePreview,
};

const features = [
  { icon: FileCheck, label: "Industry Tested" },
  { icon: Sparkles, label: "AI-Powered Bullet Points" },
  { icon: Download, label: "Instant PDF Download" },
];

const Templates = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const fromResume = searchParams.get("from") === "resume-builder";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container max-w-6xl pt-28 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-5xl font-heading font-bold text-foreground mb-3">
            Professional Resume Templates
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
            ATS-optimized templates designed to get you noticed.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-16">
          {templates.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="relative border border-border rounded-2xl bg-card p-4 group hover:border-primary/40 transition-all flex flex-col"
            >
              {t.badge && (
                <span className="absolute top-3 right-3 z-10 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/20">
                  {t.badge}
                </span>
              )}
              <div className="flex-1">
                {(() => { const Preview = previewComponents[t.name]; return Preview ? <Preview /> : null; })()}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-semibold text-foreground text-sm">{t.name}</h3>
                  <span className="text-[10px] font-semibold text-primary">ATS Friendly</span>
                </div>
                <button
                  onClick={() => {
                    localStorage.setItem("lumio_selected_template", t.name);
                    navigate("/resume-builder?template=" + encodeURIComponent(t.name));
                  }}
                  className="text-xs font-heading font-semibold bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Build My Resume With This Template
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 border border-border rounded-2xl bg-card p-8"
        >
          {features.map((f) => (
            <div key={f.label} className="flex items-center gap-3 justify-center">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <f.icon className="w-4 h-4 text-primary" />
              </div>
              <span className="font-heading font-semibold text-foreground text-sm">{f.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Templates;
