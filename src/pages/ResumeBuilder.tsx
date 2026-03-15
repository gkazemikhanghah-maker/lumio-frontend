import { useState, useRef, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Lock, FileDown, Save, Sparkles, Check, X, Plus, Pencil, RefreshCw, Loader2 } from "lucide-react";
import Logo from "@/components/Logo";
import ResumeIntakeScreen from "@/components/ResumeIntakeScreen";

// Market context (passed from dashboard)
const marketContext = {
  jobTitle: "Product Manager",
  experienceLevel: "Senior",
  workType: "Remote",
  topSkills: [
    { name: "Product Strategy", percentage: 82, trend: "up" as const },
    { name: "Agile", percentage: 76, trend: "stable" as const },
    { name: "Data Analysis", percentage: 64, trend: "up" as const },
    { name: "SQL", percentage: 43, trend: "stable" as const },
    { name: "AI Product Strategy", percentage: 38, trend: "up" as const },
    { name: "Stakeholder Management", percentage: 71, trend: "stable" as const },
  ],
  salaryMedian: 155000,
  topCompanies: ["Google", "Amazon", "Salesforce", "Microsoft", "Stripe"],
};

type StepId = 1 | 2 | 3 | 4 | 5 | 6;

const STEPS = [
  { id: 1 as StepId, label: "Personal Info" },
  { id: 2 as StepId, label: "Summary" },
  { id: 3 as StepId, label: "Experience" },
  { id: 4 as StepId, label: "Skills" },
  { id: 5 as StepId, label: "Education" },
  { id: 6 as StepId, label: "Review" },
];

interface ChatMessage {
  id: string;
  role: "ai" | "user";
  content: string;
  chips?: string[];
  optionCards?: { id: string; title: string; content: string; tag: string }[];
  skillGrid?: boolean;
  scoreCard?: boolean;
}

interface ResumeData {
  name: string;
  title: string;
  email: string;
  linkedin: string;
  location: string;
  summary: string;
  experience: { company: string; role: string; dates: string; bullets: string[] }[];
  skills: { name: string; percentage: number; included: boolean }[];
  education: string;
  atsScore: number;
}

const summaryOptions = [
  {
    id: "results",
    title: "Results-Driven",
    content: "Results-driven Senior Product Manager with 7+ years of experience delivering data-informed products that drive user engagement and revenue growth. Expert in cross-functional leadership, agile methodologies, and translating complex business requirements into scalable product solutions.",
    tag: "ATS Score: 94%",
  },
  {
    id: "strategic",
    title: "Strategic Leader",
    content: "Strategic product leader passionate about building products that solve real user problems at scale. Proven track record of managing cross-functional teams, defining product vision, and driving 0-to-1 initiatives from ideation to market launch across B2B and B2C platforms.",
    tag: "Matches 85% of postings",
  },
  {
    id: "innovation",
    title: "Innovation-First",
    content: "Innovation-focused Product Manager who combines design thinking with data analytics to create breakthrough product experiences. Skilled at identifying market opportunities, leveraging emerging technologies including AI, and building products that delight users and drive business impact.",
    tag: "Matches 78% of postings",
  },
];

const defaultResume: ResumeData = {
  name: "",
  title: "",
  email: "",
  linkedin: "",
  location: "",
  summary: "",
  experience: [],
  skills: marketContext.topSkills.map((s) => ({ name: s.name, percentage: s.percentage, included: true })),
  education: "",
  atsScore: 0,
};

const uid = () => Math.random().toString(36).slice(2, 10);

const ResumeBuilder = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const jobTitle = searchParams.get("job") || marketContext.jobTitle;
  const initialMode = searchParams.get("mode");
  const templateParam = searchParams.get("template");
  const selectedTemplate = templateParam || localStorage.getItem("lumio_selected_template") || "";
  const hasJob = !!searchParams.get("job");
  const hasCompany = !!searchParams.get("company");

  // Redirect to templates if no template selected
  useEffect(() => {
    if (!selectedTemplate) {
      navigate("/templates?from=resume-builder", { replace: true });
    }
  }, [selectedTemplate, navigate]);

  const [showIntake, setShowIntake] = useState(!hasJob && !hasCompany && (initialMode === "upload" || initialMode === "linkedin" || !initialMode));
  const [startedFresh] = useState(hasJob || hasCompany);

  const [currentStep, setCurrentStep] = useState<StepId>(1);
  const [completedSteps, setCompletedSteps] = useState<Set<StepId>>(new Set());
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [resume, setResume] = useState<ResumeData>(defaultResume);
  const [isTyping, setIsTyping] = useState(false);
  const [highlightSection, setHighlightSection] = useState<string | null>(null);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Clear highlight after animation
  useEffect(() => {
    if (highlightSection) {
      const t = setTimeout(() => setHighlightSection(null), 1500);
      return () => clearTimeout(t);
    }
  }, [highlightSection]);

  // Initial AI message
  useEffect(() => {
    if (!showIntake || startedFresh) {
      addAiMessage(
        `Let's build your resume based on real market data for **${jobTitle}** roles.\n\nFirst, tell me your full name and current job title.`
      );
    }
  }, [showIntake]);

  const addAiMessage = (
    content: string,
    extras?: Partial<ChatMessage>
  ) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: uid(), role: "ai", content, ...extras },
      ]);
    }, 800);
  };

  const addUserMessage = (content: string) => {
    setMessages((prev) => [...prev, { id: uid(), role: "user", content }]);
  };

  const completeStep = (step: StepId) => {
    setCompletedSteps((prev) => new Set([...prev, step]));
  };

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text) return;
    setInputValue("");
    handleUserInput(text);
  };

  const handleChipClick = (chip: string) => {
    handleUserInput(chip);
  };

  const handleOptionSelect = (optionId: string) => {
    const option = summaryOptions.find((o) => o.id === optionId);
    if (option) {
      addUserMessage(`I'll go with "${option.title}"`);
      setResume((r) => ({ ...r, summary: option.content, atsScore: Math.max(r.atsScore, 72) }));
      setHighlightSection("summary");
      completeStep(2);
      setCurrentStep(3);
      setTimeout(() => {
        addAiMessage(
          "Great choice! Now let's add your work experience.\n\nTell me about your most recent role: company name, your title, start/end dates, and what you worked on — even rough notes are fine.",
        );
      }, 600);
    }
  };

  const handleUserInput = (text: string) => {
    addUserMessage(text);

    switch (currentStep) {
      case 1: handleStep1(text); break;
      case 2: handleStep2Chip(text); break;
      case 3: handleStep3(text); break;
      case 4: handleStep4Chip(text); break;
      case 5: handleStep5(text); break;
      case 6: handleStep6Chip(text); break;
    }
  };

  const handleStep1 = (text: string) => {
    // Parse name + title from input
    const parts = text.split(",").map((s) => s.trim());
    const name = parts[0] || text;
    const title = parts[1] || "Senior Product Manager";
    setResume((r) => ({
      ...r,
      name,
      title,
      email: `${name.toLowerCase().replace(/\s+/g, ".")}@email.com`,
      linkedin: `linkedin.com/in/${name.toLowerCase().replace(/\s+/g, "")}`,
      location: "San Francisco, CA",
      atsScore: 15,
    }));
    setHighlightSection("personal");
    completeStep(1);
    setCurrentStep(2);
    addAiMessage(
      `Got it! I'll use:\n**${name}** · ${title}\n\nDoes this look right?`,
      { chips: ["Looks good!", "Edit name", "Change title"] }
    );
  };

  const handleStep2Chip = (text: string) => {
    if (text === "Looks good!" || text.toLowerCase().includes("good") || text.toLowerCase().includes("yes")) {
      addAiMessage(
        `Based on what **82% of ${jobTitle} job postings** actually ask for, here are 3 tailored summary options for you:`,
        {
          optionCards: summaryOptions,
        }
      );
    } else {
      addAiMessage("No problem! Just type your name and title again and I'll update it.");
      setCurrentStep(1);
    }
  };

  const handleStep3 = (text: string) => {
    if (text === "These look great" || text === "Add another role" || text.toLowerCase().includes("great") || text.toLowerCase().includes("good")) {
      if (resume.experience.length > 0) {
        completeStep(3);
        setCurrentStep(4);
        addAiMessage(
          `Based on your target role, I've pre-filled the most in-demand skills from the market.\nReview and confirm — you can add or remove any.`,
          { skillGrid: true, chips: ["Looks good!", "Add more skills"] }
        );
        return;
      }
    }

    // Parse rough experience
    const bullets = [
      `Led cross-functional team of 12 to launch 3 product features, increasing user retention by 24%`,
      `Partnered with engineering and design to ship 0-to-1 features within aggressive 6-week sprints`,
      `Defined product roadmap aligned with Q3 OKRs, presenting to C-suite stakeholders monthly`,
    ];

    const newExp = {
      company: text.includes("Google") ? "Google" : text.includes("Amazon") ? "Amazon" : "Acme Corp",
      role: resume.title || "Senior Product Manager",
      dates: "2021 — 2024",
      bullets,
    };

    setResume((r) => ({
      ...r,
      experience: [...r.experience, newExp],
      atsScore: Math.max(r.atsScore, 82),
    }));
    setHighlightSection("experience");

    addAiMessage(
      `Here's how I'd write that as polished resume bullets, optimized for ATS:\n\n• ${bullets[0]}\n• ${bullets[1]}\n• ${bullets[2]}`,
      { chips: ["These look great", "Stronger impact words", "Add metrics", "Add another role"] }
    );
  };

  const handleStep4Chip = (text: string) => {
    if (text === "Looks good!" || text.toLowerCase().includes("good")) {
      setResume((r) => ({ ...r, atsScore: Math.max(r.atsScore, 88) }));
      setHighlightSection("skills");
      completeStep(4);
      setCurrentStep(5);
      addAiMessage(
        "Almost done! What's your highest level of education?\n(University, degree, graduation year)"
      );
    } else {
      addAiMessage("Sure! Type the skill name to add it, or tell me what to remove.");
    }
  };

  const handleStep5 = (text: string) => {
    setResume((r) => ({
      ...r,
      education: text,
      atsScore: Math.max(r.atsScore, 91),
    }));
    setHighlightSection("education");
    completeStep(5);
    setCurrentStep(6);
    addAiMessage(
      "Your resume is ready! Here's my analysis:",
      {
        scoreCard: true,
        chips: ["Add certifications", "I'm happy with this", "Download PDF"],
      }
    );
  };

  const handleStep6Chip = (text: string) => {
    if (text === "I'm happy with this" || text === "Download PDF") {
      addAiMessage("Awesome! Your resume is complete. You can download it using the Export PDF button above. Good luck! 🚀");
    } else if (text === "Add certifications") {
      addAiMessage("Great idea! Type your certifications (e.g. PMP, CSPO, Google Analytics) and I'll add them.");
    }
  };

  const handlePdfExport = () => {
    if (isPdfLoading) return;
    setIsPdfLoading(true);
    setTimeout(() => {
      setIsPdfLoading(false);
      window.print();
    }, 1500);
  };

  const toggleSkill = (skillName: string) => {
    setResume((r) => ({
      ...r,
      skills: r.skills.map((s) =>
        s.name === skillName ? { ...s, included: !s.included } : s
      ),
    }));
  };

  if (showIntake && !startedFresh) {
    return (
      <ResumeIntakeScreen
        initialMode={initialMode}
        onStart={(mode, data) => {
          setShowIntake(false);
          if (mode === "upload" && data) {
            // Simulate pre-fill from uploaded file
            setTimeout(() => {
              addAiMessage(
                `I've analyzed your resume (**${data}**). Let's optimize it for **${jobTitle}** roles.\n\nFirst, confirm your full name and current title.`
              );
            }, 300);
          } else if (mode === "linkedin" && data) {
            setTimeout(() => {
              addAiMessage(
                `I've imported your LinkedIn profile! I can see you have experience in **Product Management**. Let me build your resume based on real market data.\n\nFirst, confirm your target role — is **${jobTitle}** still what you're aiming for?`,
                { chips: ["Yes, let's go!", "Change target role"] }
              );
            }, 300);
          }
        }}
      />
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Top Bar */}
      <header className="print-hide flex items-center justify-between px-6 h-14 border-b border-border bg-background/90 backdrop-blur-xl shrink-0">
        <Link to="/dashboard">
          <Logo />
        </Link>
        <div className="hidden md:flex items-center gap-2 bg-card border border-border rounded-full px-4 py-1.5 text-xs text-muted-foreground">
          📊 Based on: <span className="text-foreground font-medium">{jobTitle} · {marketContext.experienceLevel} · {marketContext.workType}</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-xs text-muted-foreground border border-border rounded-lg px-3 py-1.5 hover:border-primary/40 hover:text-foreground transition-colors">
            <Save className="w-3.5 h-3.5" /> Save Draft
          </button>
          <button
            disabled={currentStep < 6 || isPdfLoading}
            onClick={() => handlePdfExport()}
            className="flex items-center gap-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-lg px-3 py-1.5 hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isPdfLoading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating PDF...</> : <><FileDown className="w-3.5 h-3.5" /> Export PDF</>}
          </button>
        </div>
      </header>

      {/* Two Panel Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL — Chat */}
        <div className="print-hide w-full md:w-[42%] flex flex-col border-r border-border" style={{ background: "#0d0d14" }}>
          {/* Stepper */}
          <div className="px-4 py-3 border-b border-border overflow-x-auto shrink-0">
            <div className="flex items-center gap-1 min-w-max">
              {STEPS.map((step, i) => {
                const isDone = completedSteps.has(step.id);
                const isCurrent = currentStep === step.id;
                return (
                  <div key={step.id} className="flex items-center gap-1">
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-all ${
                          isDone
                            ? "bg-primary text-primary-foreground"
                            : isCurrent
                            ? "bg-primary/20 text-primary ring-2 ring-primary/50 animate-pulse"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {isDone ? <Check className="w-3 h-3" /> : step.id}
                      </div>
                      <span
                        className={`text-[11px] whitespace-nowrap ${
                          isCurrent ? "text-primary font-medium" : isDone ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className={`w-4 h-px mx-1 ${isDone ? "bg-primary" : "bg-border"}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "ai" && (
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center mr-2 mt-1 shrink-0">
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                    </div>
                  )}
                  <div className="max-w-[85%] space-y-3">
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-md"
                          : "bg-[hsl(240,20%,12%)] text-foreground rounded-bl-md"
                      }`}
                    >
                      {msg.content.split("\n").map((line, i) => (
                        <p key={i} className={i > 0 ? "mt-2" : ""}>
                          {line.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
                            part.startsWith("**") && part.endsWith("**") ? (
                              <strong key={j} className="font-semibold">{part.slice(2, -2)}</strong>
                            ) : (
                              <span key={j}>{part}</span>
                            )
                          )}
                        </p>
                      ))}
                    </div>

                    {/* Option Cards */}
                    {msg.optionCards && (
                      <div className="space-y-2">
                        {msg.optionCards.map((card) => (
                          <button
                            key={card.id}
                            onClick={() => handleOptionSelect(card.id)}
                            className="w-full text-left border border-border rounded-xl p-3 hover:border-primary/50 hover:shadow-[0_0_15px_hsl(160_100%_45%/0.1)] transition-all group"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-semibold text-foreground">{card.title}</span>
                              <span className="text-[10px] text-primary bg-primary/10 rounded-full px-2 py-0.5">{card.tag}</span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">{card.content}</p>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Skill Grid */}
                    {msg.skillGrid && (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          {resume.skills.map((s) => (
                            <button
                              key={s.name}
                              onClick={() => toggleSkill(s.name)}
                              className={`flex items-center gap-2 border rounded-lg px-3 py-2 text-xs transition-all ${
                                s.included
                                  ? "border-primary/40 bg-primary/5 text-foreground"
                                  : "border-border bg-card text-muted-foreground"
                              }`}
                            >
                              {s.included ? (
                                <Check className="w-3 h-3 text-primary shrink-0" />
                              ) : (
                                <X className="w-3 h-3 text-muted-foreground shrink-0" />
                              )}
                              <span className="truncate">{s.name}</span>
                              <div className="ml-auto flex items-center gap-1">
                                <div className="w-10 h-1.5 bg-muted rounded-full overflow-hidden">
                                  <div className="h-full bg-primary rounded-full" style={{ width: `${s.percentage}%` }} />
                                </div>
                                <span className="text-[10px] text-primary">{s.percentage}%</span>
                              </div>
                            </button>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-primary bg-primary/5 border border-primary/20 rounded-lg px-3 py-2">
                          <Sparkles className="w-3.5 h-3.5 shrink-0" />
                          Adding "AI Product Strategy" would match 38% more postings — trending up!
                        </div>
                      </div>
                    )}

                    {/* Score Card */}
                    {msg.scoreCard && (
                      <div className="border border-border rounded-xl p-4 bg-card space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">ATS Score</span>
                          <span className="text-lg font-heading font-bold text-primary">{resume.atsScore}/100</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">Keyword Match</span>
                          <span className="text-sm font-semibold text-foreground">78%</span>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">Market Fit</span>
                          <div className="w-full h-2 bg-muted rounded-full mt-1 overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: "85%" }} />
                          </div>
                        </div>
                        <div className="pt-2 space-y-1.5 border-t border-border">
                          <p className="text-xs text-primary">💡 Adding a "Certifications" section could improve your score by +6 points</p>
                          <p className="text-xs text-amber-400">⚠️ Consider adding "stakeholder management" — it appears in 71% of postings</p>
                        </div>
                      </div>
                    )}

                    {/* Chips */}
                    {msg.chips && (
                      <div className="flex flex-wrap gap-1.5">
                        {msg.chips.map((chip) => (
                          <button
                            key={chip}
                            onClick={() => handleChipClick(chip)}
                            className="text-xs border border-border rounded-full px-3 py-1.5 text-muted-foreground hover:border-primary hover:bg-primary hover:text-primary-foreground transition-all"
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2"
              >
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="bg-[hsl(240,20%,12%)] rounded-2xl rounded-bl-md px-4 py-3 flex gap-1">
                  <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </motion.div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-border shrink-0">
            <div className="flex items-center gap-2">
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your answer or choose an option above..."
                className="flex-1 bg-card border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/40 transition-colors"
              />
              <button
                onClick={handleSend}
                className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1">
              <Lock className="w-2.5 h-2.5" /> Your data is private and never shared
            </p>
          </div>
        </div>

        {/* RIGHT PANEL — Resume Preview */}
        <div className="hidden md:flex flex-col flex-1 bg-[#f0f0f0] overflow-hidden">
          {/* Preview header */}
          <div className="print-hide px-6 py-2.5 flex items-center justify-between bg-[#e8e8e8] border-b border-[#d0d0d0] shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#666] font-medium">Live Preview · Updates as you chat</span>
              {selectedTemplate && (
                <span className="text-[11px] text-[#555] flex items-center gap-1">
                  Template: <span className="font-semibold text-[#333]">{selectedTemplate}</span> <Check className="w-3 h-3 text-primary" />
                  <Link to="/templates?from=resume-builder" className="text-primary hover:underline ml-1 text-[10px]">Change</Link>
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-[#222] text-primary rounded-full px-2.5 py-0.5 font-semibold">
                ATS: {resume.atsScore}
              </span>
            </div>
          </div>

          {/* Resume document */}
          <div className="flex-1 overflow-y-auto p-8 flex justify-center">
            <div className="w-full max-w-[640px] bg-white rounded-lg shadow-[0_4px_24px_rgba(0,0,0,0.15)] p-10 min-h-[800px] text-[#1a1a1a] font-body relative">
              {/* Overlay when empty */}
              {!resume.name && (
                <div className="absolute inset-0 bg-white/80 rounded-lg flex items-center justify-center z-10">
                  <p className="text-[#999] text-sm font-medium">Your resume will appear here as we build it together</p>
                </div>
              )}

              {/* Personal Info */}
              <ResumeSection highlight={highlightSection === "personal"}>
                {resume.name ? (
                  <div className="text-center border-b-2 border-[#1a1a1a] pb-4 mb-6">
                    <h1 className="text-2xl font-heading font-bold tracking-wide uppercase text-[#1a1a1a]">{resume.name}</h1>
                    <p className="text-sm text-[#555] mt-1">{resume.title}</p>
                    <p className="text-xs text-[#888] mt-1">
                      {resume.email} · {resume.linkedin} · {resume.location}
                    </p>
                  </div>
                ) : (
                  <div className="text-center pb-4 mb-6 border-b border-[#e0e0e0]">
                    <SkeletonLines lines={3} />
                  </div>
                )}
              </ResumeSection>

              {/* Summary */}
              <ResumeSection highlight={highlightSection === "summary"}>
                <h2 className="text-xs font-heading font-bold tracking-widest uppercase text-[#1a1a1a] mb-2">Professional Summary</h2>
                {resume.summary ? (
                  <p className="text-xs text-[#444] leading-relaxed">{resume.summary}</p>
                ) : (
                  <SkeletonLines lines={3} />
                )}
              </ResumeSection>

              {/* Experience */}
              <ResumeSection highlight={highlightSection === "experience"}>
                <h2 className="text-xs font-heading font-bold tracking-widest uppercase text-[#1a1a1a] mb-2 mt-5">Work Experience</h2>
                {resume.experience.length > 0 ? (
                  resume.experience.map((exp, i) => (
                    <div key={i} className="mb-4">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-[#1a1a1a]">{exp.role}</p>
                        <p className="text-[10px] text-[#888]">{exp.dates}</p>
                      </div>
                      <p className="text-[10px] text-[#666] mb-1">{exp.company}</p>
                      <ul className="space-y-1">
                        {exp.bullets.map((b, j) => (
                          <li key={j} className="text-xs text-[#444] leading-relaxed pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-[#888]">
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                ) : (
                  <SkeletonLines lines={4} />
                )}
              </ResumeSection>

              {/* Skills */}
              <ResumeSection highlight={highlightSection === "skills"}>
                <h2 className="text-xs font-heading font-bold tracking-widest uppercase text-[#1a1a1a] mb-2 mt-5">Skills</h2>
                {completedSteps.has(4) ? (
                  <div className="flex flex-wrap gap-1.5">
                    {resume.skills
                      .filter((s) => s.included)
                      .map((s) => (
                        <span key={s.name} className="text-[10px] bg-[#f0f0f0] text-[#444] rounded px-2 py-0.5">
                          {s.name}
                        </span>
                      ))}
                  </div>
                ) : (
                  <SkeletonLines lines={2} />
                )}
              </ResumeSection>

              {/* Education */}
              <ResumeSection highlight={highlightSection === "education"}>
                <h2 className="text-xs font-heading font-bold tracking-widest uppercase text-[#1a1a1a] mb-2 mt-5">Education</h2>
                {resume.education ? (
                  <p className="text-xs text-[#444]">{resume.education}</p>
                ) : (
                  <SkeletonLines lines={1} />
                )}
              </ResumeSection>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="print-hide px-6 py-2.5 flex items-center justify-between bg-[#e8e8e8] border-t border-[#d0d0d0] shrink-0">
            <button
              disabled={currentStep < 6 || isPdfLoading}
              onClick={() => handlePdfExport()}
              className="flex items-center gap-1.5 text-xs font-medium bg-[#1a1a1a] text-white rounded-lg px-4 py-2 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#333] transition-colors"
            >
              {isPdfLoading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating PDF...</> : <><FileDown className="w-3.5 h-3.5" /> Download PDF</>}
            </button>
            <button className="flex items-center gap-1.5 text-xs text-[#888] border border-[#ccc] rounded-lg px-3 py-1.5 cursor-default group relative">
              Change Template
              <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#333] text-white text-[10px] rounded px-2 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Coming Soon
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper components
const ResumeSection = ({ children, highlight }: { children: React.ReactNode; highlight?: boolean }) => (
  <div
    className={`transition-all duration-500 rounded-md px-1 -mx-1 ${
      highlight ? "bg-[#00e5a0]/10 ring-1 ring-[#00e5a0]/30" : ""
    }`}
  >
    {children}
  </div>
);

const SkeletonLines = ({ lines }: { lines: number }) => (
  <div className="space-y-2">
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className="h-2.5 bg-[#e8e8e8] rounded"
        style={{ width: `${70 + Math.random() * 30}%` }}
      />
    ))}
  </div>
);

export default ResumeBuilder;
