"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import FloatingElements from "@/components/FloatingElements";
import KneelingCharacter from "@/components/KneelingCharacter";

type Screen =
  | "landing"
  | "q1"
  | "q2"
  | "hook"
  | "q3a"
  | "q3b"
  | "proposal"
  | "finale";

const NO_TEXTS = [
  "Be serious.",
  "Why are you like this?",
  "You don't mean that.",
  "The universe says yes.",
  "Just press yes.",
];

const btnPrimary: React.CSSProperties = {
  background: "#7B2CBF",
  color: "#fff",
  fontWeight: 700,
  fontSize: "1rem",
  padding: "0.75rem 1rem",
  borderRadius: "9999px",
  border: "none",
  cursor: "pointer",
  boxShadow: "0 4px 20px rgba(123,44,191,0.3)",
  whiteSpace: "nowrap",
  display: "inline-block",
};

const btnSecondary: React.CSSProperties = {
  background: "#fff",
  color: "#7B2CBF",
  fontWeight: 700,
  fontSize: "1rem",
  padding: "0.75rem 1rem",
  borderRadius: "9999px",
  border: "2px solid #C8A2FF",
  cursor: "pointer",
  boxShadow: "0 4px 16px rgba(123,44,191,0.12)",
  whiteSpace: "nowrap",
  display: "inline-block",
};

export default function Home() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [noAttempts, setNoAttempts] = useState(0);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [noScale, setNoScale] = useState(1);
  const [noVisible, setNoVisible] = useState(true);
  const [proposalText, setProposalText] = useState(
    "Will you be my girlfriend?",
  );
  const [shaking, setShaking] = useState(false);
  const [showFaintText, setShowFaintText] = useState(false);
  const [bgClicks, setBgClicks] = useState(0);
  const [easterEggMsg, setEasterEggMsg] = useState("");
  const [idleShown, setIdleShown] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<
    { id: number; x: number }[]
  >([]);
  const [flashMsg, setFlashMsg] = useState("");
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Typewriter effect for landing screen
  const landingText = "Let's play a trivia game 😌";
  useEffect(() => {
    if (screen !== "landing") return;
    let i = 0;
    setTypedText("");
    const interval = setInterval(() => {
      if (i < landingText.length) {
        setTypedText(landingText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowCursor(false), 1500);
      }
    }, 55);
    return () => clearInterval(interval);
  }, [screen]);

  // Idle timer easter egg (20 seconds on proposal screen)
  useEffect(() => {
    if (screen !== "proposal" || idleShown) return;
    idleTimerRef.current = setTimeout(() => {
      setEasterEggMsg("Overthinking won't change the answer.");
      setIdleShown(true);
      setTimeout(() => setEasterEggMsg(""), 4000);
    }, 20000);
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [screen, idleShown]);

  // Refresh detection easter egg
  useEffect(() => {
    const hasVisited = sessionStorage.getItem("visited");
    if (hasVisited) {
      setEasterEggMsg("My Heart I need you to lock in 🥺");
      setTimeout(() => setEasterEggMsg(""), 4000);
    }
    sessionStorage.setItem("visited", "true");
  }, []);

  // Background click easter egg
  const handleBgClick = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).tagName === "BUTTON") return;
      const newCount = bgClicks + 1;
      setBgClicks(newCount);
      if (newCount === 5) {
        setEasterEggMsg("Okay chaotic queen.");
        setTimeout(() => setEasterEggMsg(""), 4000);
        setBgClicks(0);
      }
    },
    [bgClicks],
  );

  // Celebration sound effect (subtle pop)
  const playPop = useCallback(() => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } catch {
      // Audio not supported, silently continue
    }
  }, []);

  // No button chaos engine
  const handleNo = useCallback(() => {
    const attempt = noAttempts + 1;
    setNoAttempts(attempt);

    // Reset idle timer
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

    if (attempt === 1) {
      // Slide away slightly
      setNoPosition({ x: 120, y: -30 });
      setProposalText(NO_TEXTS[0]);
    } else if (attempt === 2) {
      // Teleport randomly
      const x = (Math.random() - 0.5) * 250;
      const y = (Math.random() - 0.5) * 200;
      setNoPosition({ x, y });
      setProposalText(NO_TEXTS[1]);
    } else if (attempt === 3) {
      // Shrink
      const x = (Math.random() - 0.5) * 200;
      const y = (Math.random() - 0.5) * 150;
      setNoPosition({ x, y });
      setNoScale(0.6);
      setProposalText(NO_TEXTS[2]);
    } else if (attempt === 4) {
      // Disappear briefly + confetti teaser
      setNoVisible(false);
      setProposalText(NO_TEXTS[3]);
      confetti({
        particleCount: 15,
        spread: 40,
        origin: { y: 0.6 },
        colors: ["#C8A2FF", "#7B2CBF"],
      });
      setTimeout(() => {
        setNoVisible(true);
        setNoScale(0.3);
        setNoPosition({
          x: (Math.random() - 0.5) * 300,
          y: (Math.random() - 0.5) * 250,
        });
      }, 1500);
    } else {
      // After 5+ attempts: tiny, page shakes, faint background text
      setNoScale(0.2);
      setNoPosition({
        x: (Math.random() - 0.5) * 300,
        y: (Math.random() - 0.5) * 250,
      });
      setProposalText(NO_TEXTS[4]);
      setShaking(true);
      setShowFaintText(true);
      setTimeout(() => setShaking(false), 600);
    }
  }, [noAttempts]);

  // Yes button handler
  const handleYes = useCallback(() => {
    playPop();

    // Full confetti explosion
    const duration = 4000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#C8A2FF", "#7B2CBF", "#FF6B9D", "#FFD700", "#F2E6FF"],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#C8A2FF", "#7B2CBF", "#FF6B9D", "#FFD700", "#F2E6FF"],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();

    // Purple heart particles
    const hearts: { id: number; x: number }[] = [];
    for (let i = 0; i < 12; i++) {
      hearts.push({ id: i, x: 10 + Math.random() * 80 });
    }
    setFloatingHearts(hearts);

    setScreen("finale");
  }, [playPop]);

  // Flash message helper
  const showFlash = useCallback((msg: string) => {
    setFlashMsg(msg);
    setTimeout(() => setFlashMsg(""), 2500);
  }, []);

  // Replay
  const handleReplay = useCallback(() => {
    setScreen("landing");
    setNoAttempts(0);
    setNoPosition({ x: 0, y: 0 });
    setNoScale(1);
    setNoVisible(true);
    setProposalText("Will you be my girlfriend?");
    setShaking(false);
    setShowFaintText(false);
    setShowCursor(true);
    setFloatingHearts([]);
    setIdleShown(false);
    setBgClicks(0);
    setFlashMsg("");
  }, []);

  // Screen transition variants
  const pageVariants = {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -20 },
  };

  const pageTransition = {
    type: "spring" as const,
    stiffness: 200,
    damping: 25,
  };

  return (
    <div
      ref={containerRef}
      onClick={handleBgClick}
      className={`relative min-h-dvh flex flex-col items-center justify-center px-6 py-8 overflow-x-hidden ${
        screen === "finale" ? "glow-bg" : ""
      } ${shaking ? "page-shake" : ""}`}
    >
      <FloatingElements />

      {/* Faint background text after 5+ no attempts */}
      {showFaintText && <div className="faint-text">Just press yes.</div>}

      {/* Easter egg message toast */}
      <AnimatePresence>
        {easterEggMsg && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-white/90 backdrop-blur-sm font-bold px-8 py-3 rounded-2xl shadow-lg border border-lavender/50 body-font text-sm whitespace-nowrap"
            style={{ color: "#7B2CBF" }}
          >
            {easterEggMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating hearts on finale */}
      {floatingHearts.map((h) => (
        <div
          key={h.id}
          className="fixed bottom-0 text-2xl float-heart pointer-events-none z-40"
          style={{ left: `${h.x}%`, animationDelay: `${h.id * 0.2}s` }}
        >
          💜
        </div>
      ))}

      {/* Flash message */}
      <AnimatePresence>
        {flashMsg && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", bounce: 0.5, duration: 0.5 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 body-font font-bold text-[#7B2CBF] text-xl italic pointer-events-none tracking-wide whitespace-nowrap drop-shadow-md"
          >
            {flashMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {/* ===== SCREEN 1: LANDING ===== */}
        {screen === "landing" && (
          <motion.div
            key="landing"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="relative z-10 flex flex-col items-center gap-2 text-center max-w-md mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.6, delay: 0.2 }}
              className="text-6xl"
            >
              🎀
            </motion.div>

            <div className="min-h-[80px]">
              <h1
                className={`text-3xl md:text-4xl font-bold heading-font text-[#3A0066] leading-relaxed ${
                  showCursor ? "typewriter-cursor" : ""
                }`}
              >
                {typedText}
              </h1>
            </div>

            {typedText.length === landingText.length && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col items-center gap-2"
              >
                <p className="text-lg body-font text-[#7B2CBF] font-semibold">
                  Answer honestly. There's pressure oh.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setScreen("q1")}
                  style={btnPrimary}
                  className="body-font"
                >
                  Start 🎀
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* ===== SCREEN 2: Q1 — Sexy ===== */}
        {screen === "q1" && (
          <motion.div
            key="q1"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="relative z-10 flex flex-col items-center gap-6 text-center max-w-md mx-auto"
          >
            <motion.div
              initial={{ rotate: -5, scale: 0.8 }}
              animate={{ rotate: 1, scale: 1 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="torn-paper p-6 md:p-8 max-w-sm w-full"
            >
              <div className="tape-strip" />
              <p className="text-2xl md:text-3xl font-bold heading-font text-[#3A0066] mt-2 leading-relaxed">
                Baby girl… you find me extremely sexy?
              </p>
            </motion.div>

            <div className="flex gap-4 flex-wrap justify-center">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => {
                  playPop();
                  showFlash("I knew it.");
                  setTimeout(() => setScreen("q2"), 900);
                }}
                style={btnPrimary}
                className="body-font"
              >
                Yes
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => {
                  playPop();
                  showFlash("I knew it.");
                  setTimeout(() => setScreen("q2"), 900);
                }}
                style={btnSecondary}
                className="body-font"
              >
                Absolutely yes
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ===== SCREEN 3: Q2 — Voice ===== */}
        {screen === "q2" && (
          <motion.div
            key="q2"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="relative z-10 flex flex-col items-center gap-6 text-center max-w-md mx-auto"
          >
            <motion.div
              initial={{ rotate: 3, scale: 0.8 }}
              animate={{ rotate: -1, scale: 1 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="torn-paper p-6 md:p-8 max-w-sm w-full"
            >
              <div className="tape-strip" />
              <p className="text-2xl md:text-3xl font-bold heading-font text-[#3A0066] mt-2 leading-relaxed">
                I know you love hearing my voice… <br />I love hearing your
                voice more.
              </p>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                playPop();
                showFlash("Say it louder.");
                setTimeout(() => setScreen("hook"), 900);
              }}
              style={btnPrimary}
              className="body-font"
            >
              Next 😌
            </motion.button>
          </motion.div>
        )}

        {/* ===== SCREEN 4: INSIDE JOKE HOOK ===== */}
        {screen === "hook" && (
          <motion.div
            key="hook"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="relative z-10 flex flex-col items-center gap-6 text-center max-w-md mx-auto"
          >
            <motion.div
              initial={{ x: -300, rotate: -20 }}
              animate={{ x: 0, rotate: -1 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="sticky-note max-w-sm w-full"
            >
              <p className="text-xl md:text-2xl font-bold heading-font text-[#5B4A2F] leading-relaxed">
                &ldquo;Remember when you said I wouldn&apos;t ever kiss you?
                &rdquo;
              </p>
            </motion.div>

            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8, type: "spring", bounce: 0.5 }}
            >
              <p className="text-2xl md:text-3xl font-bold heading-font text-[#3A0066]">
                How's that going?
              </p>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setScreen("q3a")}
              style={btnSecondary}
              className="body-font"
            >
              Continue.
            </motion.button>
          </motion.div>
        )}

        {/* ===== SCREEN 5a: Q3a — Emotional build card 1 ===== */}
        {screen === "q3a" && (
          <motion.div
            key="q3a"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="relative z-10 flex flex-col items-center gap-6 text-center max-w-md mx-auto"
          >
            <motion.div
              initial={{ rotate: -2, scale: 0.8 }}
              animate={{ rotate: 1, scale: 1 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="torn-paper p-6 md:p-8 max-w-sm w-full"
            >
              <div className="tape-strip" />
              <p className="text-2xl md:text-3xl font-bold heading-font text-[#3A0066] mt-2 leading-relaxed">
                Okay but let me ask you something real quick…
              </p>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setScreen("q3b")}
              style={btnPrimary}
              className="body-font"
            >
              What?
            </motion.button>
          </motion.div>
        )}

        {/* ===== SCREEN 5b: Q3b — Emotional build card 2 ===== */}
        {screen === "q3b" && (
          <motion.div
            key="q3b"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="relative z-10 flex flex-col items-center gap-6 text-center max-w-md mx-auto"
          >
            <motion.div
              initial={{ rotate: 2, scale: 0.8 }}
              animate={{ rotate: -1, scale: 1 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="torn-paper p-6 md:p-8 max-w-sm w-full"
            >
              <div className="tape-strip" />
              <p className="text-2xl md:text-3xl font-bold heading-font text-[#3A0066] mt-2 leading-relaxed">
                Do you think we look cute together?
              </p>
            </motion.div>

            <div className="flex gap-4 flex-wrap justify-center">
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => {
                  playPop();
                  setScreen("proposal");
                }}
                style={btnPrimary}
                className="body-font"
              >
                Obviously 💜
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => {
                  playPop();
                  setScreen("proposal");
                }}
                style={btnSecondary}
                className="body-font"
              >
                We really do
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ===== SCREEN 6: PROPOSAL ===== */}
        {screen === "proposal" && (
          <motion.div
            key="proposal"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="relative z-10 flex flex-col items-center gap-6 text-center max-w-lg mx-auto"
          >
            <KneelingCharacter />

            <motion.h1
              key={proposalText}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold heading-font text-[#3A0066] leading-tight"
            >
              {proposalText}
            </motion.h1>

            <div className="flex gap-4 items-center justify-center flex-wrap relative min-h-[80px]">
              {/* Yes button - always prominent */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={
                  noAttempts >= 3
                    ? {
                        scale: [1, 1.05, 1],
                        boxShadow: [
                          "0 0 0px rgba(123,44,191,0.3)",
                          "0 0 25px rgba(123,44,191,0.6)",
                          "0 0 0px rgba(123,44,191,0.3)",
                        ],
                      }
                    : {}
                }
                transition={
                  noAttempts >= 3
                    ? { duration: 1.5, repeat: Infinity }
                    : undefined
                }
                onClick={handleYes}
                style={{ ...btnPrimary, fontSize: "1.25rem" }}
                className="body-font z-10"
              >
                Yes 💜
              </motion.button>

              {/* No button - chaos engine */}
              {noVisible && (
                <motion.button
                  animate={{
                    x: noPosition.x,
                    y: noPosition.y,
                    scale: noScale,
                  }}
                  transition={{ type: "spring", bounce: 0.6 }}
                  whileHover={{ scale: noScale * 0.9 }}
                  onClick={handleNo}
                  style={{ ...btnSecondary, fontSize: "1.25rem" }}
                  className="body-font z-10"
                >
                  No 🙃
                </motion.button>
              )}
            </div>
          </motion.div>
        )}

        {/* ===== SCREEN 7: FINALE ===== */}
        {screen === "finale" && (
          <motion.div
            key="finale"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="relative z-10 flex flex-col items-center gap-8 text-center max-w-md mx-auto"
          >
            <KneelingCharacter happy />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              <p className="text-2xl md:text-3xl font-bold heading-font text-[#3A0066]">
                You just made me the happiest person alive.
              </p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="text-3xl md:text-4xl font-bold heading-font text-[#7B2CBF]"
              >
                I love you baby. 💜
              </motion.p>
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReplay}
              style={{ ...btnSecondary, background: "rgba(255,255,255,0.85)" }}
              className="body-font"
            >
              Replay because that was iconic. ✨
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
