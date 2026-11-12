-- ══════════════════════════════════════════════════════════════
-- Migration 002: Admin visibility controls, social links, mockup data
-- ══════════════════════════════════════════════════════════════

-- ─── Engine configuration (admin-controlled overrides) ───────
CREATE TABLE IF NOT EXISTS engine_configs (
  engine_id      INTEGER PRIMARY KEY,
  is_coming_soon BOOLEAN NOT NULL DEFAULT FALSE,
  is_visible     BOOLEAN NOT NULL DEFAULT TRUE,
  display_order  INTEGER NOT NULL DEFAULT 0,
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO engine_configs (engine_id, is_coming_soon, is_visible, display_order) VALUES
  (4, FALSE, TRUE, 1),
  (5, FALSE, TRUE, 2),
  (6, FALSE, TRUE, 3),
  (1, FALSE, TRUE, 4),
  (2, TRUE,  TRUE, 5),
  (3, TRUE,  TRUE, 6)
ON CONFLICT (engine_id) DO NOTHING;

-- ─── Service configuration (admin-controlled visibility) ──────
CREATE TABLE IF NOT EXISTS service_configs (
  service_slug  TEXT PRIMARY KEY,
  is_visible    BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured   BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INTEGER NOT NULL DEFAULT 0,
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO service_configs (service_slug, is_visible, is_featured, display_order) VALUES
  -- E4 Build & Deploy
  ('dpdpa-compliance-build',    TRUE, TRUE,  1),
  ('mvp-development',           TRUE, FALSE, 2),
  ('api-integration',           TRUE, FALSE, 3),
  ('cloud-migration',           TRUE, FALSE, 4),
  ('devops-cicd',               TRUE, FALSE, 5),
  ('legacy-modernisation',      TRUE, FALSE, 6),
  ('mobile-development',        TRUE, FALSE, 7),
  ('frontend-engineering',      TRUE, FALSE, 8),
  ('quality-engineering',       TRUE, FALSE, 9),
  ('security-engineering',      TRUE, FALSE, 10),
  -- E5 AI & Automation
  ('llm-integration',           TRUE, TRUE,  11),
  ('ml-pipeline',               TRUE, FALSE, 12),
  ('process-automation',        TRUE, FALSE, 13),
  ('data-engineering',          TRUE, FALSE, 14),
  ('ai-product-features',       TRUE, FALSE, 15),
  ('rag-knowledge-systems',     TRUE, FALSE, 16),
  ('ai-audit-compliance',       TRUE, FALSE, 17),
  ('chatbot-development',       TRUE, FALSE, 18),
  ('predictive-analytics',      TRUE, FALSE, 19),
  -- E6 Managed Services
  ('fractional-cto',            TRUE, TRUE,  20),
  ('engineering-support',       TRUE, FALSE, 21),
  ('infrastructure-management', TRUE, FALSE, 22),
  ('performance-monitoring',    TRUE, FALSE, 23),
  ('tech-debt-management',      TRUE, FALSE, 24),
  ('compliance-monitoring',     TRUE, FALSE, 25)
ON CONFLICT (service_slug) DO NOTHING;

-- ─── Social links ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS social_links (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform      TEXT NOT NULL,
  label         TEXT NOT NULL,
  url           TEXT NOT NULL,
  icon          TEXT NOT NULL DEFAULT 'Globe',
  is_visible    BOOLEAN NOT NULL DEFAULT TRUE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO social_links (platform, label, url, icon, is_visible, display_order) VALUES
  ('linkedin',  'LinkedIn',  'https://linkedin.com/company/formatiqs', 'Linkedin',   TRUE, 1),
  ('twitter',   'X (Twitter)', 'https://twitter.com/formatiqs',        'Twitter',    TRUE, 2),
  ('instagram', 'Instagram', 'https://instagram.com/formatiqs',        'Instagram',  FALSE, 3),
  ('youtube',   'YouTube',   'https://youtube.com/@formatiqs',         'Youtube',    FALSE, 4),
  ('github',    'GitHub',    'https://github.com/formatiqs',           'Github',     TRUE, 5)
ON CONFLICT DO NOTHING;

-- ─── Site content blocks (admin-editable) ────────────────────
CREATE TABLE IF NOT EXISTS site_content (
  key        TEXT PRIMARY KEY,
  value      TEXT NOT NULL DEFAULT '',
  label      TEXT NOT NULL,
  type       TEXT NOT NULL DEFAULT 'text',  -- text | url | boolean | richtext
  section    TEXT NOT NULL DEFAULT 'general',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO site_content (key, value, label, type, section) VALUES
  -- Contact info
  ('contact_email',     'hello@formatiqs.in',       'Contact Email',         'text',    'contact'),
  ('contact_phone',     '+91 98765 43210',           'Contact Phone',         'text',    'contact'),
  ('contact_address',   'Mumbai, Maharashtra, India', 'Office Address',       'text',    'contact'),
  ('calendly_url',      'https://calendly.com/formatiqs/fde-discovery', 'Calendly URL', 'url', 'contact'),
  -- Homepage
  ('hero_badge',        'India''s First FDE Company', 'Hero Badge Text',     'text',    'homepage'),
  ('hero_headline',     'Engineers Embedded.\nResults Owned.',  'Hero Headline', 'text', 'homepage'),
  ('hero_subline',      'FormatiQs places Forward Deployed Engineers inside your organisation — not as consultants, but as embedded builders accountable for outcomes.', 'Hero Subline', 'text', 'homepage'),
  ('hero_cta_primary',  'Get Your FDE',              'Hero CTA Primary',      'text',    'homepage'),
  ('hero_cta_secondary','See How It Works',          'Hero CTA Secondary',    'text',    'homepage'),
  -- Section visibility
  ('show_quiz_section', 'true',                      'Show FDE Quiz Section', 'boolean', 'homepage'),
  ('show_case_studies', 'true',                      'Show Case Studies',     'boolean', 'homepage'),
  ('show_newsletter',   'true',                      'Show Newsletter Bar',   'boolean', 'general'),
  -- Footer
  ('footer_tagline',    'India''s first Forward Deployed Engineering company.', 'Footer Tagline', 'text', 'footer'),
  ('footer_copyright',  '© 2025 FormatiQs. All rights reserved.',              'Footer Copyright', 'text', 'footer')
ON CONFLICT (key) DO NOTHING;

-- ─── Mockup team data ─────────────────────────────────────────
INSERT INTO team (name, role, bio, engine_focus, linkedin_url, is_visible, display_order)
VALUES
  ('Arjun Mehta',
   'Co-Founder & Chief FDE Officer',
   'Former engineering lead at two Series B startups. Arjun pioneered the FDE model in India after spending three years as a forward-deployed engineer at a US-based SaaS company.',
   ARRAY[4, 5],
   'https://linkedin.com/in/arjunmehta',
   TRUE, 1),
  ('Priya Sharma',
   'Co-Founder & Head of AI Practice',
   'ML engineer turned product builder. Priya leads FormatiQs AI & Automation engine, bringing LLM integrations and intelligent workflow automation to mid-market companies.',
   ARRAY[5],
   'https://linkedin.com/in/priyasharma',
   TRUE, 2),
  ('Rahul Krishnan',
   'Head of Build & Deploy',
   'Full-stack architect with 10+ years shipping production systems. Rahul oversees all software delivery engagements, from MVP builds to complex legacy modernisations.',
   ARRAY[4],
   'https://linkedin.com/in/rahulkrishnan',
   TRUE, 3),
  ('Divya Nair',
   'Head of Managed Services',
   'Infrastructure and DevOps specialist who has managed engineering operations for fintech and healthtech clients. Divya builds the operational backbone of ongoing FDE engagements.',
   ARRAY[6],
   'https://linkedin.com/in/divyanair',
   TRUE, 4),
  ('Siddharth Patel',
   'Senior Forward Deployed Engineer',
   'Full-stack generalist embedded with two FormatiQs clients simultaneously. Siddharth specialises in rapid prototyping, API design, and DPDPA compliance implementations.',
   ARRAY[4, 5, 6],
   'https://linkedin.com/in/siddharthpatel',
   TRUE, 5)
ON CONFLICT DO NOTHING;

-- ─── Mockup case studies ──────────────────────────────────────
INSERT INTO case_studies (title, slug, client_industry, engine_id, challenge, solution, outcome, is_published, display_order)
VALUES
  ('Shipping DPDPA Compliance in 6 Weeks for a Mumbai Fintech',
   'dpdpa-fintech-mumbai',
   'Financial Services',
   4,
   'A regulated fintech with 200k+ users needed full DPDPA compliance before their Series A close. Internal teams had no bandwidth, and consultants quoted 6 months.',
   'FormatiQs embedded two FDEs inside the product team. We mapped all personal data flows, built the consent management layer, implemented data-subject request workflows, and shipped the full compliance build in 6 weeks — alongside the existing product roadmap.',
   '100% DPDPA compliance achieved. Series A closed on schedule. Zero disruption to product velocity during the engagement.',
   TRUE, 1),
  ('Building an AI-Powered Document Processing System for a Legal SaaS',
   'ai-legal-saas',
   'Legal Technology',
   5,
   'A Bangalore-based legal SaaS was manually reviewing thousands of contracts per month. OCR tools were unreliable and the team lacked ML expertise to build something better.',
   'Our AI & Automation FDEs designed and built a RAG-based document intelligence system using GPT-4 with a custom fine-tuned extraction layer. The system processes contracts, flags risk clauses, and surfaces summaries in under 30 seconds.',
   'Processing time reduced by 87%. Contract review capacity tripled. The system now handles 15,000+ documents per month with 94% accuracy on key clause extraction.',
   TRUE, 2),
  ('Modernising a 10-Year-Old Logistics Platform Without Downtime',
   'logistics-modernisation',
   'Supply Chain & Logistics',
   4,
   'A logistics company was running critical operations on a monolithic PHP application from 2013. The team wanted to move to microservices without taking systems offline.',
   'FormatiQs used a strangler-fig pattern — embedding an FDE team to progressively extract services while keeping the monolith running. We rebuilt authentication, shipment tracking, and billing as independent services over 4 months.',
   'Zero downtime during migration. API response times improved 3x. The engineering team now ships features 2x faster with independent service deployments.',
   TRUE, 3)
ON CONFLICT DO NOTHING;

-- ─── Mockup blog posts ────────────────────────────────────────
INSERT INTO posts (title, slug, excerpt, content, engine_tag, author_name, is_published, published_at)
VALUES
  ('What Forward Deployed Engineering Actually Means in India',
   'what-fde-means-india',
   'Everyone talks about FDE after Palantir popularised it. Here is what it actually looks like when you apply the model to the Indian tech ecosystem.',
   '<h2>The term gets misused a lot</h2><p>Forward Deployed Engineering started as a Palantir concept — engineers who live inside client organisations and build from within. But in India, the term has been borrowed loosely to describe everything from on-site consulting to staff augmentation.</p><p>At FormatiQs, we use it to mean something specific: an engineer embedded inside your organisation who is accountable for outcomes, not just deliverables.</p><h2>The difference from consulting</h2><p>A consultant delivers a document. An FDE delivers a system. A consultant leaves after the project. An FDE stays until the outcome is achieved — and sometimes beyond.</p><p>The key shift is accountability. When an FDE builds your compliance layer, they are not done when the code is merged. They are done when compliance is live, tested, and your team understands it.</p><h2>Why it works in India</h2><p>Indian engineering talent is world-class. The gap has never been skill — it has been context. FDEs close that gap by being present in your standup, your Slack, your planning sessions. They build context that no offshore team ever can.</p>',
   NULL,
   'Arjun Mehta',
   TRUE,
   NOW() - INTERVAL '5 days'),

  ('DPDPA in Plain English: What Every Tech Team Needs to Know',
   'dpdpa-plain-english',
   'India''s Digital Personal Data Protection Act is now in force. Here is a practical breakdown of what it means for product teams building in 2025.',
   '<h2>The law is live. Are you ready?</h2><p>The Digital Personal Data Protection Act (DPDPA) 2023 is India''s first comprehensive data protection law. It applies to any organisation that processes personal data of Indian residents — which means virtually every tech product operating in India.</p><h2>The five things you need to do now</h2><p>First: map your data. You cannot protect data you cannot see. Build an inventory of every personal data point your product collects, processes, or stores.</p><p>Second: get valid consent. The DPDPA requires specific, informed, and unambiguous consent before processing personal data. Your existing "I agree to terms" checkbox may not be sufficient.</p><p>Third: implement data subject rights. Users have the right to access, correct, and erase their data. You need workflows for all three — and you need to be able to respond within prescribed timelines.</p><p>Fourth: appoint a Data Protection Officer if required. Significant Data Fiduciaries need a DPO. Check whether this applies to you.</p><p>Fifth: build a breach response plan. Data breaches must be reported to the Data Protection Board within prescribed timelines. Have a runbook ready before you need it.</p><h2>The penalties are real</h2><p>DPDPA penalties go up to ₹250 crore for significant breaches. This is not a law to file and forget.</p>',
   4,
   'Priya Sharma',
   TRUE,
   NOW() - INTERVAL '12 days'),

  ('LLMs in Production: What We Have Learned After 15 Integrations',
   'llms-production-learnings',
   'After integrating large language models into 15 different client products, here are the patterns that consistently work — and the mistakes every team makes once.',
   '<h2>Everyone underestimates the prompt engineering work</h2><p>LLM integration is not just an API call. The majority of the engineering effort goes into prompt design, output validation, fallback handling, and cost management — not the integration itself.</p><h2>Build evals from day one</h2><p>You cannot improve what you cannot measure. Before you ship an LLM feature to production, build a test suite of representative inputs and expected outputs. Run it on every model update. Run it before every prompt change.</p><h2>Latency matters more than accuracy for most products</h2><p>Users tolerate occasional wrong answers better than they tolerate slow answers. For most product use cases, a 95%-accurate response in 1 second beats a 99%-accurate response in 8 seconds.</p><h2>The RAG vs fine-tuning question is usually answered by your data</h2><p>Fine-tuning makes sense when you have thousands of high-quality labelled examples and want the model to change its behaviour. RAG makes sense when you want the model to know about your specific documents and data. Most product use cases need RAG, not fine-tuning.</p>',
   5,
   'Divya Nair',
   TRUE,
   NOW() - INTERVAL '20 days'),

  ('The Case for Managed Engineering: Why On-Demand Beats Hiring',
   'managed-engineering-vs-hiring',
   'Hiring a senior engineer in 2025 takes 4 months and costs ₹40 lakh per year. Managed engineering gives you the same capacity — without the overhead.',
   '<h2>The hiring math no longer works for most companies</h2><p>For a Series A company in India, a senior full-stack engineer costs ₹30-50 lakh per year — before ESOP, benefits, and the 4-6 months it takes to find and onboard them. During a crunch, you need capacity now, not in Q2.</p><h2>Managed engineering is not outsourcing</h2><p>The traditional outsourcing model sells you outputs. A vendor builds what you spec, hands it over, and disappears. When something breaks at 2am, you raise a ticket and wait.</p><p>Managed engineering with an FDE model is different. You get an embedded team with deep context in your systems — not a team reading documentation for the first time when a critical bug appears.</p><h2>When it makes sense</h2><p>Managed engineering works best when you have ongoing technical needs that do not justify a full-time hire, when you need specialised capacity (ML, security, mobile) that your team lacks, or when you want engineering accountability without the overhead of management.</p>',
   6,
   'Rahul Krishnan',
   TRUE,
   NOW() - INTERVAL '30 days'),

  ('How We Built a DPDPA Consent Layer in 3 Weeks',
   'dpdpa-consent-layer-3-weeks',
   'A step-by-step walkthrough of how our FDE team shipped a production-grade DPDPA consent management system inside a client''s product — without touching their existing database schema.',
   '<h2>The constraint: no schema changes</h2><p>Our client had a strict rule: no changes to their existing PostgreSQL schema. Their data team had built custom tooling on top of it, and any migration would break downstream systems.</p><p>We needed to bolt DPDPA consent onto a live product without touching the data model. Here is how we did it.</p><h2>The architecture</h2><p>We built a consent sidecar — an independent microservice that sits alongside the main application and manages all consent state. The main app sends consent events to the sidecar via a lightweight API. The sidecar stores and enforces consent rules independently.</p><h2>Week 1: Consent capture</h2><p>We built the user-facing consent UI — a modal that surfaces on first login, presents purposes clearly (not hidden in terms), and stores granular consent per data purpose.</p><h2>Week 2: Enforcement layer</h2><p>We built middleware that checks consent before any personal data operation. If a user has not consented to a data purpose, the operation is blocked and logged.</p><h2>Week 3: DSR workflows</h2><p>We built the data subject request workflows — access, correction, and erasure — with admin tooling for the client''s operations team to process requests.</p>',
   4,
   'Siddharth Patel',
   TRUE,
   NOW() - INTERVAL '45 days'),

  ('5 Signs Your Engineering Team Needs an FDE, Not a Consultant',
   'signs-you-need-fde',
   'Consultants produce documents. FDEs produce systems. Here are the five patterns that tell us a company is ready for the embedded engineering model.',
   '<h2>1. You have hired consultants before and nothing shipped</h2><p>If you have paid for a technical strategy document that is now sitting in a Drive folder, you do not need more strategy. You need someone who will build the thing.</p><h2>2. Your team is blocked on something outside their core skill</h2><p>Your backend team is excellent, but they have never built an ML pipeline. Your frontend team can build anything, but they have never handled DPDPA compliance. FDEs fill specific skill gaps without you needing to hire and onboard a full-time specialist.</p><h2>3. You need to ship in weeks, not quarters</h2><p>An FDE who has shipped 15 similar systems will move faster on your problem than your team who is doing it for the first time. Speed is the most underrated value proposition.</p><h2>4. You want someone who stays on when it goes wrong</h2><p>Consultants scope what they deliver. FDEs stay accountable for outcomes. If the system breaks the week after launch, your FDE is in your Slack helping fix it — not raising a change request.</p><h2>5. You want to build internal capability, not dependency</h2><p>Good FDEs document, teach, and transfer knowledge. After a FormatiQs engagement, your team should be able to operate what was built without us.</p>',
   NULL,
   'Arjun Mehta',
   TRUE,
   NOW() - INTERVAL '60 days')
ON CONFLICT DO NOTHING;

-- ─── RLS policies for new tables ──────────────────────────────
ALTER TABLE engine_configs  ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links    ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content    ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "engine_configs_public_read"  ON engine_configs  FOR SELECT USING (TRUE);
CREATE POLICY "service_configs_public_read" ON service_configs FOR SELECT USING (TRUE);
CREATE POLICY "social_links_public_read"    ON social_links    FOR SELECT USING (TRUE);
CREATE POLICY "site_content_public_read"    ON site_content    FOR SELECT USING (TRUE);

-- Auth-only write
CREATE POLICY "engine_configs_auth_write"  ON engine_configs  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "service_configs_auth_write" ON service_configs FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "social_links_auth_write"    ON social_links    FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "site_content_auth_write"    ON site_content    FOR ALL USING (auth.role() = 'authenticated');

-- ─── updated_at triggers ──────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER engine_configs_updated_at  BEFORE UPDATE ON engine_configs  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER service_configs_updated_at BEFORE UPDATE ON service_configs FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER social_links_updated_at    BEFORE UPDATE ON social_links    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER site_content_updated_at    BEFORE UPDATE ON site_content    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
