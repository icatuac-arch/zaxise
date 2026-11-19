"use client";

import { useState } from "react";

interface Props {
  searchQuery: string;
}

interface ToolConfig {
  id: string;
  icon: string;
  label: string;
  title: string;
  fields: { label: string; type: string; defaultValue: string }[];
  calculate: (values: string[]) => string;
}

const TOOLS: ToolConfig[] = [
  {
    id: "tip",
    icon: "％",
    label: "Tip calculator",
    title: "Tip calculator",
    fields: [
      { label: "Bill amount", type: "number", defaultValue: "100" },
      { label: "Tip %", type: "number", defaultValue: "18" },
    ],
    calculate: (v) => {
      const bill = +v[0], pct = +v[1];
      if (!isFinite(bill) || !isFinite(pct) || bill < 0) return "Please enter valid values.";
      const tip = bill * pct / 100;
      return `Tip: $${tip.toFixed(2)} · Total: $${(bill + tip).toFixed(2)}`;
    },
  },
  {
    id: "unit",
    icon: "⇄",
    label: "Miles / kilometers",
    title: "Miles to kilometers",
    fields: [{ label: "Miles", type: "number", defaultValue: "10" }],
    calculate: (v) => {
      const miles = +v[0];
      if (!isFinite(miles)) return "Please enter valid values.";
      return `${(miles * 1.609344).toFixed(3)} km`;
    },
  },
  {
    id: "bmi",
    icon: "♡",
    label: "BMI calculator",
    title: "BMI calculator",
    fields: [
      { label: "Weight (lb)", type: "number", defaultValue: "150" },
      { label: "Height (inches)", type: "number", defaultValue: "65" },
    ],
    calculate: (v) => {
      const w = +v[0], h = +v[1];
      if (w <= 0 || h <= 0) return "Please enter valid values.";
      return `BMI: ${(703 * w / (h ** 2)).toFixed(1)}`;
    },
  },
  {
    id: "date",
    icon: "▦",
    label: "Date difference",
    title: "Date difference",
    fields: [
      { label: "Start date", type: "date", defaultValue: "2026-11-18" },
      { label: "End date", type: "date", defaultValue: "2026-12-25" },
    ],
    calculate: (v) => {
      const diff = Math.abs(Date.parse(v[1]) - Date.parse(v[0])) / 86400000;
      if (!isFinite(diff)) return "Please enter valid values.";
      return `${diff} days`;
    },
  },
  {
    id: "json",
    icon: "{ }",
    label: "JSON formatter",
    title: "JSON formatter",
    fields: [
      { label: "JSON", type: "textarea", defaultValue: '{"hello":"Zaxise"}' },
    ],
    calculate: (v) => {
      try {
        return JSON.stringify(JSON.parse(v[0]), null, 2);
      } catch {
        return "Invalid JSON.";
      }
    },
  },
  {
    id: "color",
    icon: "◈",
    label: "Color picker",
    title: "Color picker",
    fields: [
      { label: "Choose color", type: "color", defaultValue: "#e8ac51" },
    ],
    calculate: (v) => v[0],
  },
  {
    id: "loan",
    icon: "$",
    label: "Loan calculator",
    title: "Loan calculator",
    fields: [
      { label: "Principal ($)", type: "number", defaultValue: "10000" },
      { label: "Annual interest %", type: "number", defaultValue: "6" },
      { label: "Term (years)", type: "number", defaultValue: "5" },
    ],
    calculate: (v) => {
      const p = +v[0], r = +v[1] / 1200, n = +v[2] * 12;
      if (p < 0 || r < 0 || n <= 0) return "Please enter valid values.";
      const monthly = r ? p * r / (1 - (1 + r) ** -n) : p / n;
      return `$${monthly.toFixed(2)} / month`;
    },
  },
  {
    id: "zone",
    icon: "◷",
    label: "USA to India time",
    title: "Local time to India",
    fields: [
      { label: "Local date and time", type: "datetime-local", defaultValue: "" },
    ],
    calculate: (v) => {
      const d = new Date(v[0]);
      if (isNaN(d.getTime())) return "Please enter a valid date/time.";
      return d.toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "short",
      }) + " IST";
    },
  },
];

export default function QuickTools({ searchQuery }: Props) {
  const [activeTool, setActiveTool] = useState<ToolConfig | null>(null);
  const [fieldValues, setFieldValues] = useState<string[]>([]);
  const [result, setResult] = useState("");

  const q = searchQuery.toLowerCase().trim();

  const openTool = (tool: ToolConfig) => {
    setActiveTool(tool);
    setFieldValues(tool.fields.map((f) => f.defaultValue));
    setResult("");
  };

  const closeTool = () => {
    setActiveTool(null);
    setResult("");
  };

  const calculate = () => {
    if (!activeTool) return;
    if (fieldValues.some((v) => v === "")) {
      setResult("Please enter valid values.");
      return;
    }
    setResult(activeTool.calculate(fieldValues));
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {TOOLS.map((tool) => {
          const visible = !q || tool.label.toLowerCase().includes(q);
          if (!visible) return null;
          return (
            <button
              key={tool.id}
              onClick={() => openTool(tool)}
              className="card-lift flex items-center gap-3 rounded-[10px] border border-line bg-white p-3.5 text-left text-ink"
            >
              <span className="text-xl">{tool.icon}</span>
              <b className="text-[13px]">{tool.label}</b>
            </button>
          );
        })}
      </div>

      {/* No results */}
      {q &&
        TOOLS.every((t) => !t.label.toLowerCase().includes(q)) && (
          <div className="mt-3 rounded-[17px] border border-line bg-white p-5 text-sm text-muted">
            No matching services. Try another search.
          </div>
        )}

      {/* Modal */}
      {activeTool && (
        <div
          className="fixed inset-0 z-20 grid place-items-center bg-navy/50 p-5"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeTool();
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") closeTool();
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="tool-title"
        >
          <div className="w-full max-w-[460px] rounded-[18px] bg-white p-6">
            <div className="flex items-start justify-between">
              <h2 id="tool-title" className="font-serif text-xl">
                {activeTool.title}
              </h2>
              <button
                onClick={closeTool}
                className="border-0 bg-transparent text-2xl leading-none text-muted"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {activeTool.fields.map((field, i) => (
                <label key={field.label} className="block">
                  <span className="text-sm text-muted">{field.label}</span>
                  {field.type === "textarea" ? (
                    <textarea
                      value={fieldValues[i]}
                      onChange={(e) => {
                        const next = [...fieldValues];
                        next[i] = e.target.value;
                        setFieldValues(next);
                      }}
                      className="mt-1 block w-full rounded-lg border border-line p-2.5 text-sm outline-none focus:border-gold"
                      rows={3}
                    />
                  ) : (
                    <input
                      type={field.type}
                      value={fieldValues[i]}
                      onChange={(e) => {
                        const next = [...fieldValues];
                        next[i] = e.target.value;
                        setFieldValues(next);
                      }}
                      className="mt-1 block w-full rounded-lg border border-line p-2.5 text-sm outline-none focus:border-gold"
                    />
                  )}
                </label>
              ))}
            </div>

            <button
              onClick={calculate}
              className="mt-4 w-full rounded-[9px] bg-gold px-5 py-3 font-[800] text-[#16283b]"
            >
              Calculate
            </button>

            {result && (
              <div
                className="mt-4 whitespace-pre-wrap break-all text-[22px] font-bold"
                aria-live="polite"
              >
                {result}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
