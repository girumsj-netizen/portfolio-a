\# MASTER PROJECT ARCHITECTURE \& PRE-BUILD SPECIFICATION



> \*\*CRITICAL COMPLIANCE NOTICE FOR THE AI DEVELOPER / AGENT:\*\* You are an elite Full-Stack Software Engineer, DevSecOps Specialist, and Cybersecurity Architect. You are strictly forbidden from writing code, provisioning infrastructure, designing APIs, or setting up databases that violate the security parameters, infrastructure limits, testing requirements, or architectural patterns defined in this document.



\---



\## 1. SERVER \& INFRASTRUCTURE TOPOLOGY

All application components must adhere to immutable, multi-environment isolation rules. Production assets must remain decoupled from development and staging pipelines.



\### Environment \& Compute Isolation:

\- \*\*Containerization \& Immutability:\*\* Build all services as stateless, production-ready OCI containers (Docker / Podman). Prevent horizontal privilege escalation by forcing processes to execute under non-root system users.

\- \*\*Strict Environment Partitioning:\*\* Maintain complete cryptographic separation across `development`, `staging`, and `production`. Never share databases, cloud storage buckets, or authentication servers across environments.

\- \*\*Secrets Architecture:\*\* Hard-coding credentials or checking configuration files like `.env` into version control is strictly prohibited. All sensitive inputs—including database strings, private encryption keys, and external API tokens—must be fetched at runtime from an authenticated cloud secrets manager.



\### Network Layer Controls:

\- \*\*Ingress Port Hardening:\*\* Shut down all ingress ports on public internet interfaces except for TLS Port `443` and Port `80` (which must immediately issue a permanent `301 Redirect` to `443`). Internal utilities or server administration (SSH) must be inaccessible via the open internet, routing exclusively through secure VPNs or Jump Boxes.

\- \*\*Edge Routing \& Caching (CDN):\*\* Proxy all incoming public user traffic through an edge-compute CDN layer (e.g., Cloudflare, AWS CloudFront) equipped with automated DDoS mitigation, rate limiting, and an active Web Application Firewall (WAF).



\---



\## 2. PRODUCTION SECURITY PROTOCOLS \& DATA PROTECTION

Implement a rigorous "Zero Trust" framework across the entire software application surface layer.



\### Cryptographic Baseline:

\- \*\*In-Transit Encryption:\*\* Enforce TLS 1.3 exclusively. Deprecate and reject all handshake requests originating from TLS 1.0, 1.1, and 1.2 protocol variants.

\- \*\*At-Rest Data Hardening:\*\* Encrypt all user Personally Identifiable Information (PII), transactional histories, and financial data using AES-256-GCM. 

\- \*\*Cryptographic Password Hashing:\*\* User passwords must never exist as plain text or weak hashes. Process all registration strings using adaptive, compute-heavy stretching algorithms (`Argon2id` or `bcrypt`) paired with uniquely generated cryptographic salts.



\### HTTP Defensive Hardening Headers:

Every outbound server response configuration must append the following security headers to mitigate cross-site exploits:



| HTTP Security Header | Mandatory Configuration Value | Target Vulnerability Defended |

| :--- | :--- | :--- |

| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains` | Man-in-the-Middle (MitM) \& Downgrade Attacks |

| `Content-Security-Policy` | `default-src 'self'; script-src 'self'; object-src 'none';` (Tailored to app specs) | Cross-Site Scripting (XSS) \& UI Redressing |

| `X-Frame-Options` | `DENY` or `SAMEORIGIN` | Clickjacking Injection |

| `X-Content-Type-Options` | `nosniff` | MIME-type Sniffing Exploits |

| `Referrer-Policy` | `strict-origin-when-cross-origin` | Credential and Private Data Leaks via Referrers |



\### Stateful Session Isolation:

\- \*\*Cookie Security Architecture:\*\* Store all persistent session identifiers inside cookies configured with `HttpOnly` (preventing client-side JavaScript access), `Secure` (restricting transmission to HTTPS-encrypted pipelines), and `SameSite=Strict` (blocking Cross-Site Request Forgery).

\- \*\*Session Rotations:\*\* Force immediate session ID re-generation upon every privilege change (e.g., successful user login or administrative escalation) to prevent session fixation hijacking.



\---



\## 3. DEFENSIVE API ARCHITECTURE \& ACCESS MANAGEMENT



\### Authorization \& Cross-Origin Security:

\- \*\*Strict CORS Policy:\*\* Do not use wildcard headers (`Access-Control-Allow-Origin: \*`). Explicitly whitelist exact, trusted origins for API interactions.

\- \*\*Role-Based Access Control (RBAC):\*\* Map endpoint execution rights to explicitly structured user role permissions (`Admin`, `Manager`, `Client`). Evaluate user credentials server-side on every request; never rely on frontend visual presentation adjustments for access control.

\- \*\*IDOR Neutralization:\*\* Eliminate Insecure Direct Object References. When parsing incoming database fetch routes (e.g., `/api/v1/orders/\[order\_id]`), validate that the authenticated session token possesses clear ownership authorization for that requested record prior to execution.



\### Input Sanitization \& Threat Mitigation:

\- \*\*Parameterized Database Queries:\*\* Eliminate SQL Injection vectors entirely by requiring object-relational mappers (ORMs) or strictly parameterized statements. Never assemble strings by concatenating raw client-side inputs.

\- \*\*Runtime Data Validation:\*\* Validate all incoming API request payloads against a strict schema compiler (e.g., Zod, Joi, or native language types). Strip out unmapped parameters automatically.

\- \*\*Autonomous Agent \& Bot Protection:\*\* Implement background behavior analysis (e.g., CAPTCHA) alongside token-bucket rate limiting on high-value endpoints (such as `/api/auth/login` or `/api/checkout`) to block automated credential stuffing and rapid scraping loops.

\- \*\*Supply Chain Integrity (SBOM):\*\* Validate third-party code packages on compilation using automated vulnerability scanning pipelines (`npm audit`, `pip-audit`). Enforce Subresource Integrity (SRI) cryptographic hashes on all assets pulled via public web networks.



\---



\## 4. DATABASE INTEGRITY, SCHEMA MIGRATIONS, \& BACKUPS

\- \*\*Code-Driven Schemas:\*\* Direct structural manipulation of production databases via a GUI or raw terminal inputs is strictly banned. All database schema adjustments must be executed via time-stamped, version-controlled database migration scripts.

\- \*\*Automated Redundancy:\*\* Configure automated, daily database snapshots. Backups must be cryptographically encrypted at rest, stored in an independent geographical cloud zone, and governed by a retention policy of at least 30 days.



\---



\## 5. CACHING STRATEGY \& MEMORY MANAGEMENT

\- \*\*Edge Cache Optimization:\*\* Deliver static frontend UI views, assets, and media components with explicit, aggressive browser `Cache-Control` response directives (e.g., `public, max-age=31536000, immutable`).

\- \*\*Database Load Mitigation:\*\* Implement an in-memory storage layer (e.g., Redis, Memcached) to handle high-frequency, read-intensive API query returns or session stores to avoid choking the primary transactional database under high user traffic.



\---



\## 6. FAIL-SAFE ERROR MANAGEMENT \& TELEMETRY

\- \*\*Error Obfuscation:\*\* Under no circumstances should backend system diagnostics, raw database errors, or granular programming stack traces be returned to user interfaces. Catch application errors gracefully, outputting uninformative user-facing messages (e.g., \*"An internal error occurred. Reference ID: XYZ"\*).

\- \*\*Centralized Structural Logging:\*\* Stream structured logs (JSON formatting containing event timestamp, severity level, origin service, and unidentifiable request metadata) to a centralized, access-controlled tracking hub. 



\---



\## 7. CI/CD QUALITY GATES \& TESTING PRINCIPLES

Code cannot transition to staging or production environments without passing automated verification steps:

\- \*\*Code Formatting Code Checks:\*\* Enforce strict style guidelines and code evaluation standards via linting rules (e.g., ESLint, Flake8) and automated formatters (e.g., Prettier) on commit.

\- \*\*Automated Quality Testing:\*\* Maintain an absolute minimal threshold of \*\*80% code coverage\*\* verified via automated pipelines running Unit tests (core logic), Integration tests (API connectivity), and End-to-End browser simulation tests (critical flows like login and checkout).



\---



\## 8. REGULATORY PRIVACY \& COMPLIANCE

\- \*\*Privacy By Design:\*\* Build native systems to cleanly handle user data erasure requests ("Right to be Forgotten") across all databases and logging services automatically.

\- \*\*Consent-State Compliance:\*\* Embed zero-tracking logic by default. No analytics scripts, marketing trackers, or cookies outside of those classified as "Strictly Necessary" may execute until the user explicitly toggles a valid cookie preference banner (GDPR/CCPA framework compliance).



\---



\## 9. CORE WEB VITALS \& WEB PERFORMANCE BUDGETS

The frontend application must compile to pass strict layout and responsiveness metrics without relying on post-build scripts.



\### Core Metrics:

\- \*\*LCP (Largest Contentful Paint):\*\* `< 2.5 seconds`. Flag above-the-fold media elements with `fetchpriority="high"`. Render media exclusively via efficient generation models (`AVIF` or `WebP`).

\- \*\*INP (Interaction to Next Paint):\*\* `< 200 milliseconds`. Code-split hefty modules. Keep script processing off the main thread execution loop.

\- \*\*CLS (Cumulative Layout Shift):\*\* `< 0.1`. Define absolute aspect ratios, static heights, and explicit structural constraints across image placeholders, widgets, and text elements to eliminate layout shift during async asset generation.



\---



\## 10. SEMANTIC CODE ARCHITECTURE \& SEARCH ENGINE OPTIMIZATION (SEO)

\- \*\*Semantic DOM Elements:\*\* Abandon generic multi-nested `<div>` styling practices. Rely entirely on clear semantic structures (`<main>`, `<article>`, `<nav>`, `<header>`, `<footer>`).

\- \*\*Heading Level Integrity:\*\* Enforce a single semantic `<h1>` element per route block. Advance nested child tags cleanly sequentially (`<h1>` $\\rightarrow$ `<h2>` $\\rightarrow$ `<h3>`). 

\- \*\*Automated Canonical Identifiers:\*\* Inject explicit self-referencing links (`<link rel="canonical" href="\[CURRENT\_URL]" />`) dynamically within every compiled route header context to prevent internal search engine indexing fragmentation.

\- \*\*JSON-LD Schema Integration:\*\* Automate structural schema generation by outputting inline micro-data formats (`Organization`, `BreadcrumbList`, and contextual blocks like `Product` or `Article` schemas) to anchor topical identity.



\---



\## 11. AI SYSTEM SEARCH \& RETRIEVAL OPTIMIZATION (GEO)

Maximize indexing readability across Large Language Models and AI scrapers (e.g., OpenAI, Gemini, Perplexity) by organizing layout content logically:



\- \*\*BLUF Formatting (Bottom Line Up Front):\*\* Lead core feature or informational modules with a concise conclusion sentence summarizing the intent of the block before detailing adjacent analysis.

\- \*\*Structured Data Arrays:\*\* Present technical product tables, metrics, and reference values inside standard markdown/HTML tables or native data lists (`<dl>`, `<dt>`, `<dd>`) to accelerate clean machine parsing.

\- \*\*Root Map Manifest (`llms.txt`):\*\* Compile and maintain a clean, semantic markdown file at the root path (`/llms.txt`) detailing the underlying application data patterns, structural endpoint maps, and architectural goals to assist developer AI scraping systems.

