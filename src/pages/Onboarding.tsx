import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import Logo from "@/components/Logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const roleChips = ["Product Manager", "Software Engineer", "Data Scientist", "UX Designer", "Marketing Manager"];

const experienceLevels = [
  { emoji: "🌱", title: "Entry Level", range: "0–2 years" },
  { emoji: "💼", title: "Mid Level", range: "2–5 years" },
  { emoji: "🚀", title: "Senior Level", range: "5–10 years" },
  { emoji: "👑", title: "Lead / Principal", range: "10+ years" },
];

const journeyOptions = [
  { emoji: "🔥", title: "Actively applying", desc: "I'm sending applications now" },
  { emoji: "📚", title: "Preparing", desc: "Building skills, updating resume" },
  { emoji: "👀", title: "Just exploring", desc: "Curious about the market" },
];

const slideVariants = {
  enter: { x: 80, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -80, opacity: 0 },
};

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [journey, setJourney] = useState("");

  const handleFinish = () => {
    const user = JSON.parse(localStorage.getItem("lumio_user") || "{}");
    localStorage.setItem(
      "lumio_user",
      JSON.stringify({ ...user, role, experience, journey, onboarded: true })
    );
    navigate(`/dashboard?q=${encodeURIComponent(role)}`);
  };

  const canProceed = [!!role, !!experience, !!journey][step];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="p-6">
        <Logo />
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-12">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              i <= step ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Steps */}
      <div className="flex-1 flex items-start justify-center px-4">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            {/* Step 1: Target Role */}
            {step === 0 && (
              <motion.div
                key="step-0"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground text-center mb-8">
                  What role are you targeting?
                </h2>
                <Input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Product Manager, Data Scientist..."
                  className="h-12 text-base mb-6"
                />
                <div className="flex flex-wrap gap-2 justify-center mb-10">
                  {roleChips.map((r) => (
                    <button
                      key={r}
                      onClick={() => setRole(r)}
                      className={`text-sm border rounded-full px-4 py-1.5 transition-colors ${
                        role === r
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Experience Level */}
            {step === 1 && (
              <motion.div
                key="step-1"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground text-center mb-8">
                  What's your experience level?
                </h2>
                <div className="grid grid-cols-2 gap-4 mb-10">
                  {experienceLevels.map((l) => (
                    <button
                      key={l.title}
                      onClick={() => setExperience(l.title)}
                      className={`relative border rounded-2xl p-5 text-left transition-colors ${
                        experience === l.title
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card hover:border-primary/30"
                      }`}
                    >
                      {experience === l.title && (
                        <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-3 h-3 text-primary-foreground" />
                        </div>
                      )}
                      <span className="text-2xl mb-2 block">{l.emoji}</span>
                      <p className="text-sm font-heading font-semibold text-foreground">{l.title}</p>
                      <p className="text-xs text-muted-foreground">{l.range}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 3: Journey */}
            {step === 2 && (
              <motion.div
                key="step-2"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground text-center mb-8">
                  Where are you in your journey?
                </h2>
                <div className="space-y-3 mb-10">
                  {journeyOptions.map((j) => (
                    <button
                      key={j.title}
                      onClick={() => setJourney(j.title)}
                      className={`relative w-full border rounded-2xl p-5 text-left transition-colors flex items-center gap-4 ${
                        journey === j.title
                          ? "border-primary bg-primary/5"
                          : "border-border bg-card hover:border-primary/30"
                      }`}
                    >
                      <span className="text-2xl">{j.emoji}</span>
                      <div>
                        <p className="text-sm font-heading font-semibold text-foreground">{j.title}</p>
                        <p className="text-xs text-muted-foreground">{j.desc}</p>
                      </div>
                      {journey === j.title && (
                        <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-3 h-3 text-primary-foreground" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-center">
            <Button
              disabled={!canProceed}
              onClick={() => (step < 2 ? setStep(step + 1) : handleFinish())}
              className="px-8 h-11 bg-primary text-primary-foreground font-heading font-semibold hover:bg-primary/90 disabled:opacity-40"
            >
              {step < 2 ? "Next →" : "Let's Go →"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
