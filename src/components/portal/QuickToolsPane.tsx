"use client";

import { motion } from "framer-motion";
import {
  Calculator,
  FileText,
  Image,
  QrCode,
  Palette,
  Code2,
  Timer,
  Ruler,
  DollarSign,
  Heart,
  Wrench,
} from "lucide-react";

const QUICK_TOOLS = [
  { name: "PDF Merge", icon: FileText, color: "from-red-500 to-orange-500", href: "/tools/pdf-merge" },
  { name: "Image Compress", icon: Image, color: "from-blue-500 to-cyan-500", href: "/tools/image-compress" },
  { name: "QR Generator", icon: QrCode, color: "from-green-500 to-emerald-500", href: "/tools/qr-generator" },
  { name: "Color Picker", icon: Palette, color: "from-purple-500 to-pink-500", href: "/tools/color-picker" },
  { name: "JSON Formatter", icon: Code2, color: "from-yellow-500 to-amber-500", href: "/tools/json-formatter" },
  { name: "Pomodoro", icon: Timer, color: "from-rose-500 to-red-500", href: "/tools/pomodoro" },
  { name: "Loan Calc", icon: DollarSign, color: "from-emerald-500 to-teal-500", href: "/calc/loan" },
  { name: "BMI Calc", icon: Heart, color: "from-pink-500 to-rose-500", href: "/calc/bmi" },
  { name: "Unit Convert", icon: Ruler, color: "from-indigo-500 to-violet-500", href: "/calc/length" },
  { name: "Tip Calc", icon: Calculator, color: "from-amber-500 to-yellow-500", href: "/calc/tip" },
];

export default function QuickToolsPane() {
  return (
    <section className="rounded-2xl border border-border bg-surface/50 p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500">
            <Wrench className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Quick Tools</h2>
            <p className="text-xs text-muted">Free browser tools & calculators</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2 sm:grid-cols-5">
        {QUICK_TOOLS.map((tool, i) => (
          <motion.a
            key={tool.name}
            href={tool.href}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.03 }}
            whileHover={{ scale: 1.05, y: -2 }}
            className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-surface p-3 transition-all hover:border-cyan-500/30 hover:bg-surface-hover"
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${tool.color} shadow-lg transition-shadow group-hover:shadow-xl`}
            >
              <tool.icon className="h-5 w-5 text-white" />
            </div>
            <span className="text-[10px] font-medium text-muted text-center leading-tight group-hover:text-foreground transition-colors">
              {tool.name}
            </span>
          </motion.a>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <a
          href="/tools"
          className="flex-1 rounded-xl border border-border py-2 text-center text-xs font-medium text-muted transition-all hover:border-cyan-500/30 hover:text-cyan-400"
        >
          All 47 Tools →
        </a>
        <a
          href="/calc"
          className="flex-1 rounded-xl border border-border py-2 text-center text-xs font-medium text-muted transition-all hover:border-emerald-500/30 hover:text-emerald-400"
        >
          All 37 Calculators →
        </a>
      </div>
    </section>
  );
}
