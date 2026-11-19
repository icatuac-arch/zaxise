"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap } from "lucide-react";
import EventsPane from "./EventsPane";
import DealsPane from "./DealsPane";
import SpacePane from "./SpacePane";
import FactsPane from "./FactsPane";
import WorldClockPane from "./WorldClockPane";
import TravelPane from "./TravelPane";
import QuickToolsPane from "./QuickToolsPane";

export default function PortalHome() {
  return (
    <div className="relative">
      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-indigo-500/10 blur-[150px]" />
        <div className="absolute -right-40 top-40 h-96 w-96 rounded-full bg-purple-500/8 blur-[150px]" />
        <div className="absolute bottom-20 left-1/3 h-80 w-80 rounded-full bg-pink-500/5 blur-[120px]" />
      </div>

      {/* Hero — compact for portal */}
      <section className="relative px-4 pt-12 pb-6 sm:px-6 sm:pt-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-300 mb-4">
              <Sparkles className="h-4 w-4" />
              <span>Your Daily Portal</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Everything You Need,{" "}
              <span className="gradient-text">Right Here</span>
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-muted">
              Events, deals, space news, world clocks, tools, travel, and trivia
              — all in one place, updated daily.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Portal Grid */}
      <section className="relative px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Row 1: Events + Deals (the two most actionable panes) */}
          <div className="grid gap-6 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <EventsPane />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <DealsPane />
            </motion.div>
          </div>

          {/* Row 2: World Clock (full width) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6"
          >
            <WorldClockPane />
          </motion.div>

          {/* Row 3: Space + Facts */}
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <SpacePane />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <FactsPane />
            </motion.div>
          </div>

          {/* Row 4: Quick Tools (full width) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-6"
          >
            <QuickToolsPane />
          </motion.div>

          {/* Row 5: Travel (full width) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6"
          >
            <TravelPane />
          </motion.div>
        </div>
      </section>
    </div>
  );
}
