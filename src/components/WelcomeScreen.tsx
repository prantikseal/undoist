"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useThemeStore } from "@/store/themeStore";

interface WelcomeScreenProps {
  onContinue: () => void;
}

interface PreferencesForm {
  name: string;
  theme: "light" | "dark";
}

const GradientBg = () => (
  <div className="fixed inset-0 -z-10">
    <div className="absolute inset-0 bg-gradient-to-b from-primary-dark to-primary-light dark:from-gray-950 dark:to-gray-900" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
    <motion.div
      animate={{
        backgroundPosition: ["0% 0%", "100% 100%"],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        repeatType: "reverse",
      }}
      className="absolute inset-0 opacity-30 bg-[length:400%_400%] bg-gradient-to-br from-primary-light via-primary-dark to-primary-light"
    />
  </div>
);

export default function WelcomeScreen({ onContinue }: WelcomeScreenProps) {
  const [step, setStep] = useState<"welcome" | "preferences">("welcome");
  const [preferences, setPreferences] = useState<PreferencesForm>({
    name: "",
    theme: "light",
  });
  const setTheme = useThemeStore((state) => state.setTheme);

  const handleContinue = () => {
    if (step === "welcome") {
      setStep("preferences");
    } else {
      setTheme(preferences.theme);
      localStorage.setItem("userName", preferences.name);
      onContinue();
    }
  };

  const scrollingItems = [
    "Checklists",
    "Reminders",
    "Todo",
    "Notes",
    "Pictures",
    "Videos",
    "Checklists",
    "Reminders",
  ];

  return (
    <div className="fixed inset-0 overflow-hidden">
      <GradientBg />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-full flex flex-col items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-md space-y-8 text-center"
        >
          {step === "welcome" ? (
            <>
              <div className="space-y-2">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center justify-center gap-2 text-white"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M3 5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M7 9L17 9"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M7 13L17 13"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M7 17L13 17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="text-xl font-semibold">KeepNotes</span>
                </motion.div>

                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-4xl font-light text-white text-center leading-tight"
                >
                  Keep all your private notes, todo list in one place safely
                </motion.h1>
              </div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="relative"
              >
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase overflow-hidden">
                  <motion.div
                    animate={{
                      x: [0, -50 * scrollingItems.length],
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="flex whitespace-nowrap px-4 py-2 bg-primary-dark/50 text-gray-400"
                  >
                    {scrollingItems.map((item, index) => (
                      <span key={index} className="inline-flex items-center">
                        {item}
                        <span className="mx-2">•</span>
                      </span>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 text-white"
            >
              <h2 className="text-2xl font-semibold">Set your preferences</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={preferences.name}
                    onChange={(e) =>
                      setPreferences((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Theme</label>
                  <div className="grid grid-cols-2 gap-4">
                    {["light", "dark"].map((theme) => (
                      <button
                        key={theme}
                        onClick={() =>
                          setPreferences((prev) => ({
                            ...prev,
                            theme: theme as "light" | "dark",
                          }))
                        }
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          preferences.theme === theme
                            ? "bg-white/20 border-white"
                            : "border-white/20 hover:border-white"
                        }`}
                      >
                        {theme.charAt(0).toUpperCase() + theme.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
            onClick={handleContinue}
            className="w-full bg-[#98fb98] text-black py-4 px-6 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-opacity-90 transition-colors"
          >
            {step === "welcome" ? "Continue" : "Get Started"}
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
} 