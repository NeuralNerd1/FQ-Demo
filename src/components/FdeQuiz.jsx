import { useState } from 'react';
import { ArrowRight, ChevronRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const QUESTIONS = [
  {
    id: 'q1',
    question: 'What best describes your organisation?',
    options: ['Startup (< 50 people)', 'SMB (50–500 people)', 'Enterprise (500+)', 'Government / Public Sector'],
  },
  {
    id: 'q2',
    question: 'What is your biggest technology challenge right now?',
    options: ['Compliance & Data Privacy', 'Building a digital product', 'AI & Automation', 'Scaling operations & infrastructure'],
  },
  {
    id: 'q3',
    question: 'How large is your internal tech team?',
    options: ['No dedicated tech team', '1–5 engineers', '6–20 engineers', '20+ engineers'],
  },
  {
    id: 'q4',
    question: 'What engagement model works best for you?',
    options: ['One-time project', 'Monthly retainer / subscription', 'Part-time embedded expert', 'Not sure yet'],
  },
  {
    id: 'q5',
    question: 'What is your implementation timeline?',
    options: ['Urgent — this month', '1–3 months', '3–6 months', 'Still planning'],
  },
];

const RESULT_MAP = {
  'Compliance & Data Privacy': {
    engineId: 'e4',
    service: 'DPDPA Compliance',
    slug: 'dpdpa-compliance',
    reason: 'Your compliance needs are best solved by an embedded FDE who acts as your DPO, handling DPDPA end-to-end.',
    color: 'text-dpdpa-500',
    badge: 'Engine 4 — Deployment',
  },
  'Building a digital product': {
    engineId: 'e5',
    service: 'AI Product Engineering',
    slug: 'ai-product-engineering',
    reason: 'An FDE product engineer embedded in your team can take your idea from architecture to launch, faster than any agency.',
    color: 'text-engine-5',
    badge: 'Engine 5 — AI Factory',
  },
  'AI & Automation': {
    engineId: 'e5',
    service: 'Agentic AI Systems',
    slug: 'agentic-ai-systems',
    reason: 'Agentic AI deployed by an embedded FDE will automate workflows that currently eat 40%+ of your team\'s time.',
    color: 'text-engine-5',
    badge: 'Engine 5 — AI Factory',
  },
  'Scaling operations & infrastructure': {
    engineId: 'e6',
    service: 'FDE-as-a-Subscription',
    slug: 'fde-subscription',
    reason: 'A dedicated FDE team on retainer gives you continuous engineering capacity without the hiring overhead.',
    color: 'text-engine-6',
    badge: 'Engine 6 — Managed',
  },
};

export default function FdeQuiz() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  function handleAnswer(option) {
    const updated = { ...answers, [QUESTIONS[currentQ].id]: option };
    setAnswers(updated);

    if (currentQ < QUESTIONS.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      const challenge = updated.q2;
      const rec = RESULT_MAP[challenge] || RESULT_MAP['Building a digital product'];
      setResult(rec);
    }
  }

  function reset() {
    setCurrentQ(0);
    setAnswers({});
    setResult(null);
  }

  const q = QUESTIONS[currentQ];
  const progress = ((Object.keys(answers).length) / QUESTIONS.length) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      {!result ? (
        <>
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between text-xs text-dark-200 mb-2">
              <span>Question {currentQ + 1} of {QUESTIONS.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <div className="h-1 bg-dark-500 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-600 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <h3 className="text-xl font-semibold text-white mb-6 leading-tight">
            {q.question}
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {q.options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleAnswer(opt)}
                className="w-full text-left px-5 py-4 bg-dark-700 border border-dark-400 hover:border-brand-500/50 hover:bg-dark-600 rounded-xl transition-all duration-200 group"
              >
                <span className="flex items-center justify-between text-dark-100 group-hover:text-white transition-colors">
                  {opt}
                  <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity text-brand-400" />
                </span>
              </button>
            ))}
          </div>
        </>
      ) : (
        /* Result */
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-600/15 border border-brand-600/30 mb-6">
            <CheckCircle size={32} className="text-brand-400" />
          </div>

          <p className="eyebrow text-brand-400 mb-3">Your FDE Recommendation</p>
          <h3 className="text-2xl font-bold text-white mb-2">{result.service}</h3>
          <span className={cn('badge bg-dark-500 border-dark-300 mb-6', result.color)}>
            {result.badge}
          </span>

          <p className="text-dark-100 leading-relaxed mb-8 max-w-lg mx-auto">
            {result.reason}
          </p>

          {/* Answer summary */}
          <div className="text-left bg-dark-700 border border-dark-400 rounded-xl p-5 mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-dark-200 mb-3">Your Answers</p>
            {QUESTIONS.map((item) => (
              <div key={item.id} className="flex items-start gap-2 py-2 border-b border-dark-500 last:border-0">
                <CheckCircle size={14} className="text-brand-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-dark-200">{item.question}</p>
                  <p className="text-sm text-white mt-0.5">{answers[item.id]}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to={`/services/${result.slug}`}
              className="btn-primary"
            >
              Explore {result.service} <ArrowRight size={16} />
            </Link>
            <Link to="/contact" className="btn-secondary">
              Talk to an FDE
            </Link>
            <button onClick={reset} className="btn-ghost text-sm">
              Retake Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
