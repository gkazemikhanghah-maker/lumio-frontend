import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Upload, Linkedin, ArrowRight } from "lucide-react";
import Logo from "@/components/Logo";
import { Link } from "react-router-dom";

type IntakeMode = null | "fresh" | "upload" | "linkedin";

interface ResumeIntakeScreenProps {
  onStart: (mode: "fresh" | "upload" | "linkedin", data?: string) => void;
  initialMode?: string | null;
}

const importSteps = [
  "🔍 Reading your LinkedIn profile...",
  "⚡ Extracting experience and skills...",
  "✅ Profile imported successfully!",
];

const ResumeIntakeScreen = ({ onStart, initialMode }: ResumeIntakeScreenProps) => {
  const [selected, setSelected] = useState<IntakeMode>(
    initialMode === "upload" ? "upload" : initialMode === "linkedin" ? "linkedin" : null
  );
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importStep, setImportStep] = useState(0);

  useEffect(() => {
    if (!isImporting) return;
    if (importStep < importSteps.length) {
      const t = setTimeout(() => setImportStep((s) => s + 1), 1000);
      return () => clearTimeout(t);
    }
    // All steps done — proceed
    const t = setTimeout(() => onStart("linkedin", linkedinUrl.trim()), 600);
    return () => clearTimeout(t);
  }, [isImporting, importStep]);

  const handleLinkedinImport = () => {
    if (!linkedinUrl.trim()) return;
    setIsImporting(true);
    setImportStep(0);
  };

  const handleFileUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.docx";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setFileName(file.name);
      }
    };
    input.click();
  };

  const cards = [
    {
      id: "fresh" as const,
      emoji: "📄",
      title: "Start Fresh",
      desc: "Build from your market data",
    },
    {
      id: "upload" as const,
      emoji: "⬆️",
      title: "Upload Resume",
      desc: "Upload your PDF or DOCX and we'll improve it",
    },
    {
      id: "linkedin" as const,
      emoji: "🔗",
      title: "From LinkedIn",
      desc: "Paste your LinkedIn URL",
    },
  ];

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="flex items-center gap-4 px-6 h-14 border-b border-border bg-background/90 backdrop-blur-xl shrink-0">
        <Link to="/dashboard">
          <Logo />
        </Link>
        <Link to="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          ← Back
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl w-full text-center"
        >
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">
            How would you like to start?
          </h1>
          <p className="text-muted-foreground mb-10">Choose your starting point — we'll guide you from there.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {cards.map((card) => (
              <button
                key={card.id}
                disabled={isImporting}
                onClick={() => {
                  setSelected(card.id);
                  if (card.id === "fresh") {
                    onStart("fresh");
                  }
                }}
                className={`border rounded-2xl p-6 text-left transition-all hover:border-primary/50 ${
                  selected === card.id
                    ? "border-primary bg-primary/5 shadow-[0_0_20px_hsl(160_100%_45%/0.1)]"
                    : "border-border bg-card"
                }`}
              >
                <span className="text-2xl mb-3 block">{card.emoji}</span>
                <h3 className="text-sm font-heading font-semibold text-foreground mb-1">{card.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{card.desc}</p>
              </button>
            ))}
          </div>

          {/* Upload zone */}
          {selected === "upload" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-dashed border-border rounded-2xl p-8 bg-card mb-6"
            >
              {fileName ? (
                <div className="space-y-3">
                  <p className="text-sm text-foreground">📄 {fileName}</p>
                  <button
                    onClick={() => onStart("upload", fileName)}
                    className="bg-primary text-primary-foreground font-heading font-semibold px-6 py-2.5 rounded-xl hover:bg-primary/90 transition-colors text-sm flex items-center gap-2 mx-auto"
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto" />
                  <p className="text-sm text-muted-foreground">Drop your resume here or click to browse</p>
                  <button
                    onClick={handleFileUpload}
                    className="border border-border rounded-xl px-4 py-2 text-sm text-foreground hover:border-primary/40 transition-colors"
                  >
                    Choose File
                  </button>
                  <p className="text-[10px] text-muted-foreground">.pdf or .docx</p>
                </div>
              )}
            </motion.div>
          )}

          {/* LinkedIn input */}
          {selected === "linkedin" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-border rounded-2xl p-6 bg-card mb-6"
            >
              {isImporting ? (
                <div className="space-y-4 max-w-md mx-auto py-2">
                  {importSteps.map((step, i) => (
                    <AnimatePresence key={i}>
                      {importStep > i && (
                        <motion.p
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-sm text-foreground text-left"
                        >
                          {step}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  ))}
                  {importStep < importSteps.length && (
                    <div className="flex justify-start">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="max-w-md mx-auto space-y-3">
                  <label className="text-sm font-heading font-semibold text-foreground text-left block">
                    Your LinkedIn Profile URL
                  </label>
                  <input
                    type="text"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="linkedin.com/in/yourname"
                    className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/40 transition-colors"
                  />
                  <p className="text-xs text-muted-foreground text-left">
                    We'll extract your experience, skills, and education automatically
                  </p>
                  <button
                    onClick={handleLinkedinImport}
                    disabled={!linkedinUrl.trim()}
                    className="w-full bg-primary text-primary-foreground font-heading font-semibold px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Import & Build Resume <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ResumeIntakeScreen;
