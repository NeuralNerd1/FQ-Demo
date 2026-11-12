import { Link } from 'react-router-dom';
import { ArrowRight, XCircle, CheckCircle, Zap, Users, Shield, Building2 } from 'lucide-react';

const FDE_STAGES = [
  { step: '01', title: 'Embed',    desc: 'Your FDE joins your team — Slack, standups, Jira, all of it. No separate workspace, no "client" framing.' },
  { step: '02', title: 'Context',  desc: 'First week: deep context-building. Codebase, architecture, team dynamics, stakeholder map, blockers.' },
  { step: '03', title: 'Build',    desc: 'FDE starts shipping — not documenting. Code, infrastructure, integrations, tests. Real output from week two.' },
  { step: '04', title: 'Own',      desc: 'FDE takes accountability for the outcome, not just the task. They stay until it works in production.' },
  { step: '05', title: 'Transfer', desc: 'Before the engagement ends: documentation, pair programming, runbooks. Your team can operate what was built.' },
];

const PROBLEMS = [
  'Consultants who deliver decks, not systems',
  'Staff aug who need constant management',
  'Hiring timelines that take 4+ months',
  'Offshore teams with no context or ownership',
];

const SOLUTIONS = [
  { icon: Zap,       title: 'Ships production code',          desc: 'FDEs write, review, and deploy. Not slides.' },
  { icon: Users,     title: 'Embedded in your daily workflow', desc: 'Standup, Slack, planning — they are part of your team.' },
  { icon: Shield,    title: 'Accountable for the outcome',     desc: 'The engagement ends when it works, not when the invoice is paid.' },
  { icon: Building2, title: 'Transfers knowledge on exit',     desc: 'Runbooks, docs, pair programming — your team can own it.' },
];

export default function WhatIsFde() {
  return (
    <main>
      {/* ── Header ─────────────────────────────────────────── */}
      <section className="bg-white pt-14 pb-16 border-b border-surface-200">
        <div className="container">
          <div className="max-w-3xl">
            <span className="section-eyebrow">The FDE Model</span>
            <h1 className="section-title mt-2 mb-5">
              What is Forward Deployed Engineering?
            </h1>
            <p className="text-xl text-surface-500 leading-relaxed">
              FDE is a model pioneered by Palantir where engineers are embedded inside client
              organisations — not as consultants who leave, but as builders who stay accountable
              until the outcome is achieved.
            </p>
          </div>
        </div>
      </section>

      {/* ── Problem / Solution ────────────────────────────── */}
      <section className="section bg-surface-50">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {/* Problem */}
            <div className="rounded-2xl border border-red-100 bg-red-50 p-7 flex flex-col">
              <div className="mb-5">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-red-600 mb-3">
                  <XCircle className="h-3.5 w-3.5" /> The Problem
                </span>
                <h2 className="text-xl font-bold text-surface-900 mb-3">
                  Existing models don't deliver outcomes
                </h2>
                <p className="text-sm text-surface-600 leading-relaxed">
                  Indian companies have tried consultants, offshore teams, and staff augmentation.
                  The pattern is consistent: high cost, low context, zero accountability.
                </p>
              </div>
              <div className="flex-1 space-y-2.5">
                {PROBLEMS.map((title) => (
                  <div key={title} className="flex items-start gap-3 bg-white border border-red-100 rounded-xl px-4 py-3 shadow-sm">
                    <XCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-surface-700">{title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Solution */}
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-7 flex flex-col">
              <div className="mb-5">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase text-emerald-600 mb-3">
                  <CheckCircle className="h-3.5 w-3.5" /> The Solution
                </span>
                <h2 className="text-xl font-bold text-surface-900 mb-3">
                  FDE: Embedded, accountable, shipped
                </h2>
                <p className="text-sm text-surface-600 leading-relaxed">
                  FormatiQs FDEs sit inside your team, write your code, and stay until outcomes are
                  real and production-proven — no scope creep, no handover failures.
                </p>
              </div>
              <div className="flex-1 space-y-2.5">
                {SOLUTIONS.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-3 bg-white border border-emerald-100 rounded-xl px-4 py-3 shadow-sm">
                    <div className="h-6 w-6 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="font-semibold text-surface-900 text-sm">{title}</p>
                      <p className="text-xs text-surface-500 mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FDE Stages ────────────────────────────────────── */}
      <section className="section bg-white">
        <div className="container max-w-3xl">
          <div className="text-center mb-12">
            <span className="section-eyebrow">How It Works</span>
            <h2 className="section-title">The FDE engagement model</h2>
            <p className="section-desc mt-3 max-w-xl mx-auto">
              Every engagement follows a structured five-step process — from the moment an FDE joins until
              they hand off a system your team can own and operate.
            </p>
          </div>

          <div className="relative">
            {/* Vertical connector line */}
            <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-surface-200" />

            <div className="space-y-4">
              {FDE_STAGES.map((stage, i) => (
                <div key={stage.step} className="relative flex gap-5 items-start">
                  {/* Step circle */}
                  <div className="relative z-10 flex-shrink-0 h-12 w-12 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                    {stage.step}
                  </div>

                  {/* Card */}
                  <div className="flex-1 card p-5 hover:shadow-md transition-shadow duration-200 mb-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-surface-900 text-base">{stage.title}</h3>
                      <span className="text-xs font-medium text-brand-500 bg-brand-50 px-2.5 py-1 rounded-full flex-shrink-0">
                        Step {stage.step}
                      </span>
                    </div>
                    <p className="text-sm text-surface-500 leading-relaxed mt-1.5">{stage.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Comparison table ──────────────────────────────── */}
      <section className="section bg-surface-50">
        <div className="container max-w-5xl">
          <div className="text-center mb-10">
            <span className="section-eyebrow">Why FDE</span>
            <h2 className="section-title-sm">FDE vs. everything else</h2>
            <p className="section-desc-sm mt-2 max-w-lg mx-auto">
              See how the FDE model compares to consultants, staff aug, and offshore teams across the dimensions that matter most.
            </p>
          </div>

          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[560px]">
                <thead>
                  <tr className="bg-surface-50 border-b border-surface-200">
                    <th className="text-left px-5 py-4 text-surface-600 font-semibold w-1/3">Dimension</th>
                    <th className="px-4 py-4 text-surface-500 font-medium text-center">Consultant</th>
                    <th className="px-4 py-4 text-surface-500 font-medium text-center">Staff Aug</th>
                    <th className="px-4 py-4 text-surface-500 font-medium text-center">Offshore</th>
                    <th className="px-4 py-4 text-brand-700 font-bold text-center bg-brand-50/60">FDE ✦</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100">
                  {[
                    ['Ships production code',          false, true,  true,  true],
                    ['Embedded in team',               false, false, false, true],
                    ['Owns outcomes',                  false, false, false, true],
                    ['Accountable post-launch',        false, false, false, true],
                    ['Transfers knowledge',            true,  false, false, true],
                    ['On-site / hybrid',               true,  false, false, true],
                    ['Available fast (< 1 week)',      true,  true,  true,  true],
                    ['Indian market context',          true,  false, false, true],
                  ].map(([dim, ...vals]) => (
                    <tr key={dim} className="hover:bg-surface-50/40">
                      <td className="px-5 py-3.5 text-surface-700 font-medium">{dim}</td>
                      {vals.map((v, i) => (
                        <td key={i} className={`px-4 py-3.5 text-center ${
                          i === 3
                            ? 'bg-brand-50/40 font-bold text-brand-600'
                            : v ? 'text-surface-600' : 'text-surface-300'
                        }`}>
                          {v
                            ? <span className={i === 3 ? 'text-brand-600' : 'text-emerald-600'}>✓</span>
                            : <span className="text-surface-300">—</span>
                          }
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="section bg-brand-600 text-center">
        <div className="container">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to try the FDE model?</h2>
          <p className="text-brand-100 mb-8 max-w-lg mx-auto">We'll match you with the right FDE within 48 hours of your first call.</p>
          <Link to="/contact" className="btn-gold-lg">
            Start the conversation <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}
