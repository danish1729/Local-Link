# Software Requirement Specification and Design Document
## Project: Local Link

---

## Chapter 2: Software Requirement Specification

### 2.1 Overall Description

#### 2.1.1 Product Perspective
Local Link is an independent, monolithic web application engineered entirely upon the Next.js framework (utilizing modern App Router paradigms). It operates as a fully contained professional services marketplace ecosystem, yet heavily interfaces with specific external enterprise APIs to achieve its core functionality: Google Cloud Platform for OAuth 2.0 Identity Management, Google DeepMind's Gemini API for proactive AI analysis, and MongoDB Atlas for high-availability persistent storage. 

The system replaces traditional manual service directories by introducing algorithmic discovery, stateful booking logic, and real-time automated fraud mitigation. It is architected to be deployed as a serverless Edge-compatible application via Vercel, ensuring global low-latency content delivery.

#### 2.1.2 Product Functions
The major functions performed by the Local Link platform are broadly categorized as follows:
*   **Identity Provisioning & RBAC:** Establishing and validating distinct system roles (Customer, Provider, Super Admin) via Google Single Sign-On (SSO) and enforcing rigorous Role-Based Access Control on both frontend routes and backend APIs.
*   **Dynamic Catalog Management:** Allowing authenticated providers to create, iteratively update, and categorize highly detailed service listings, complete with pricing matrices and rich media.
*   **Transaction Orchestration:** Facilitating a highly complex, multi-state booking workflow that guides users from initial request, through provider approval and scheduling, to ultimate completion.
*   **Automated Threat & Policy Analysis:** Passively consuming marketplace interactions (chats, bookings, listing descriptions) and utilizing Large Language Models to flag anomalies indicative of financial fraud or platform disintermediation.
*   **Administrative Oversight & Command:** Providing high-level, data-dense dashboards allowing system administrators to freeze accounts, override bookings, and review AI-flagged incidents.

#### 2.1.3 User Characteristics
The system must cater to three drastically different user personas:
*   **Customers (High Volume):** Exhibit highly varied technical proficiency. They demand extremely intuitive interfaces, zero-learning-curve navigation, clear error states, and absolutely minimal friction in the booking process. Patience for latency or confusing UI is exceptionally low.
*   **Providers (Medium Volume):** Exhibit moderate to high technical proficiency. They require dense, data-rich dashboards, granular control over their operational schedules, clear financial metrics, and comprehensive onboarding assistance.
*   **Super Admins (Low Volume):** Exhibit maximum technical and operational proficiency. They are capable of interpreting complex AI confidence scores, analyzing database-level user metrics, and executing severe system-level overrides safely.

#### 2.1.4 Operating Environment
*   **Client Side Environment:** The platform must execute flawlessly on modern web browsers (Chrome, Safari, Firefox, Edge) supporting ECMAScript 2022 features. The UI architecture must be fundamentally responsive, scaling seamlessly from narrow mobile viewports (min-width: 320px) to ultra-wide desktop monitors without layout breakage.
*   **Server Side Environment:** A Node.js runtime environment (version 18.x or strictly higher) hosted on Vercel's serverless infrastructure. Edge functions may be utilized for specific middleware routing.
*   **Database Environment:** MongoDB Atlas deployed as a managed NoSQL Document Store, accessed strictly via the Mongoose Object Data Modeling (ODM) library for schema enforcement.

#### 2.1.5 Design and Implementation Constraints
*   **Constraint 1 (Synchronous AI Latency):** Any AI fraud detection payloads executing in the critical path of a user interaction must not block the main UI thread. They must execute asynchronously or within Edge Functions subjected to strict timeout limits (e.g., maximum 2500ms execution time) to prevent timeouts.
*   **Constraint 2 (End-to-End Type Safety):** All data moving across system boundaries (Client Component -> Server API -> Database) must be strictly typed using TypeScript interfaces to prevent runtime crashes.
*   **Constraint 3 (State Management Overhead):** The application must eschew heavy, global state management libraries (such as Redux) unless absolutely critical. Localized React Contexts or URL-based state (search parameters) must be prioritized to minimize the JavaScript client bundle size.

---

### 2.2 System Features

This section details the explicit functional requirements of the system, adhering strictly to IEEE 830 formatting standards.

#### 2.2.1 System Feature 1: Authentication and Identity Management

**Description:** The subsystem responsible for securely authenticating users, establishing secure sessions, and appropriately assigning privileges based on persistent database-stored roles.

*   **REQ-001: Google OAuth 2.0 Integration**
    *   **Description:** The system shall utilize Google OAuth 2.0 as the primary mechanism for user registration and subsequent login events.
    *   **Priority:** Critical
    *   **Complexity:** High
    *   **Risk:** High (Authentication failure prevents all platform access; misconfiguration leads to token leakage).
    *   **Technical Detail:** Upon initiating login, the application must redirect the user to Google's authorization server. The resulting callback must be handled by secure Next.js route handlers. If the returning user email does not exist in the MongoDB `users` collection, a new user document is instantiated mapping the Google profile data (email, display name, avatar URL) to the Local Link core schema.

*   **REQ-002: Dynamic Role-Based Routing and Protection**
    *   **Description:** The system shall restrict access to specific Next.js page routes and API endpoints based strictly on the authenticated user's role (Customer, Provider, Admin).
    *   **Priority:** Critical
    *   **Complexity:** Medium
    *   **Risk:** High (Failure results in unauthorized access to administrative controls or financial data).
    *   **Technical Detail:** Next.js Edge Middleware (`middleware.ts`) shall intercept all incoming requests. Attempts by a `Customer` to access protected routes like `/provider/dashboard` or `/admin` must be intercepted server-side and result in an immediate 307 redirect to an unauthorized error page or the platform root.

*   **REQ-003: Post-Authentication Intent Preservation**
    *   **Description:** The system shall capture a user's intended destination URL and return them to that precise location immediately following a successful login flow.
    *   **Priority:** High
    *   **Complexity:** Medium
    *   **Risk:** Low (UX degradation only).
    *   **Technical Detail:** When the system forces an unauthenticated user to the login view, it must append a `callbackUrl` query parameter (e.g., `?callbackUrl=/service/123/book`). Post-authentication, the callback handler must parse this parameter, validate it to prevent Open Redirect vulnerabilities, and execute the final redirect.

#### 2.2.2 System Feature 2: Provider Onboarding and Catalog Management

**Description:** The workflows and interfaces empowering users to elevate their accounts to Provider status and subsequently manage their marketplace offerings.

*   **REQ-004: Multi-Step Provider Onboarding Workflow**
    *   **Description:** The system shall guide prospective providers through a multi-stage, stateful data collection wizard.
    *   **Priority:** High
    *   **Complexity:** High
    *   **Risk:** Medium (Complex state management; high drop-off rate if poorly implemented).
    *   **Technical Detail:** The UI must be implemented as a stateful React component with rigorous client-side step validation. Form data must be persisted in state (or utilizing `localStorage` to prevent catastrophic data loss upon page refresh) until the final submission constructs and POSTs a comprehensive JSON payload to the `/api/provider/onboard` endpoint.

*   **REQ-005: Service Catalog CRUD Operations**
    *   **Description:** Authenticated Providers shall possess the capability to Create, Read, Update, and Delete (Archive) highly customized service listings.
    *   **Priority:** High
    *   **Complexity:** High
    *   **Risk:** Medium (Data integrity risks if updates are not atomic).
    *   **Technical Detail:** The Mongoose schema for a `Service` document must encompass detailed arrays and nested objects including: `title`, `description`, `categoryId`, `priceMetrics` (base rate, hourly rate), and `mediaUrls`. The backend API must aggressively sanitize all rich-text inputs to categorically prevent Cross-Site Scripting (XSS) payload injections.

#### 2.2.3 System Feature 3: Service Discovery and Booking Engine

**Description:** The highly interactive core transactional mechanism connecting Customers to Provider services.

*   **REQ-006: Parametric Category Filtering Engine**
    *   **Description:** The primary marketplace interfaces shall allow instantaneous filtering of services via category parameters without requiring full page reloads.
    *   **Priority:** High
    *   **Complexity:** Medium
    *   **Risk:** Low.
    *   **Technical Detail:** Category selection shall dynamically update Next.js URL search parameters (e.g., `?category=digital-marketing`). The underlying Next.js Page component must consume these `searchParams` server-side to construct targeted MongoDB queries, thereby ensuring complete SEO indexability of specific category views.

*   **REQ-007: Stateful Booking Transaction Architecture**
    *   **Description:** The system shall orchestrate service bookings through a rigidly enforced finite state machine architecture: `PENDING` -> `ACCEPTED`/`REJECTED` -> `COMPLETED`/`CANCELLED`.
    *   **Priority:** Critical
    *   **Complexity:** Very High
    *   **Risk:** Critical (Booking logic failures lead directly to financial disputes and total loss of platform trust).
    *   **Technical Detail:** A booking request instantiates a document in the `bookings` collection locked in a `PENDING` state. The Provider's dashboard must reflect this via polling or Server-Sent Events. Upon Provider acceptance, the API must atomically transition the state to `ACCEPTED` and concurrently lock the corresponding chronological slots in the provider's availability matrix to prevent double-booking.

#### 2.2.4 System Feature 4: AI-Driven Fraud Detection Engine

**Description:** The seamless integration of Google Gemini LLM technology to proactively monitor, analyze, and secure platform integrity.

*   **REQ-008: Real-Time Semantic Communication Analysis**
    *   **Description:** The system shall analyze messages sent between users to detect policy violations, specifically off-platform contact sharing and illicit service requests.
    *   **Priority:** High
    *   **Complexity:** Very High
    *   **Risk:** High (False positives degrade UX; synchronous API failures cause critical message delivery delays).
    *   **Technical Detail:** Upon message transmission, a non-blocking background process must construct a specialized engineering prompt containing the message text and contextual metadata. This payload is dispatched to the Gemini API. The prompt must explicitly instruct Gemini to return a strictly structured JSON object containing three exact fields: `isFraud` (boolean), `confidenceScore` (float 0.0-1.0), and `reason` (string).

*   **REQ-009: Automated Triage and Escalation**
    *   **Description:** If the AI engine returns a `confidenceScore` exceeding a predefined system threshold (e.g., `>= 0.85`), the system must immediately flag the interaction.
    *   **Priority:** High
    *   **Complexity:** Medium
    *   **Risk:** Medium.
    *   **Technical Detail:** The backend must instantiate a `FraudAlert` document cross-referenced to the offending user, the specific message/booking, and the AI's `reason`. The system must simultaneously trigger an update to the Super Admin Moderation Dashboard ensuring rapid human assessment.

#### 2.2.5 System Feature 5: Super Admin Command and Control

**Description:** The overriding operational tools provided to system administrators.

*   **REQ-010: Immediate Account Freezing Protocol**
    *   **Description:** Super Admins shall possess the capability to instantly and globally freeze user accounts, terminating their ability to authenticate or interact with the API.
    *   **Priority:** Critical
    *   **Complexity:** Medium
    *   **Risk:** High (Accidental or malicious freezing by an Admin causes severe business disruption).
    *   **Technical Detail:** Executing an account freeze dispatches a `PATCH` request to the target user document, mutating the `accountStatus` enum to `"FROZEN"`. The Next.js Edge Middleware must be programmed to intercept every authenticated request, verify this status flag, and forcefully destroy the session/redirect to a ban page if detected.

---

### 2.3 External Interface Requirements

#### 2.3.1 User Interfaces (UI)
The user interface architecture is strictly defined by highly premium, modern web aesthetic standards to ensure maximum conversion and trust:
*   **Design Language:** Strict adherence to modern principles including glassmorphism, subtle micro-animations on interactive elements, and highly legible, modern sans-serif typography (e.g., Inter, Outfit).
*   **Responsive Reflow:** The platform employs a mobile-first CSS architecture. Elements must gracefully reflow using CSS Grid and Flexbox. Off-canvas navigation menus are mandatory for viewports below 768px.
*   **Interaction States:** All interactive elements (buttons, inputs, cards) must possess explicitly defined `hover`, `focus`, `active`, and `disabled` visual states. 
*   **Asynchronous Feedback:** All network actions (e.g., submitting a booking form) must immediately display localized loading spinners, skeleton loaders, or progress bars to disable the trigger element and prevent duplicate submissions.

#### 2.3.2 Hardware Interfaces
As a cloud-hosted web application, Local Link does not directly interface with specialized client hardware beyond standard peripherals. 
*   **Network Hardware Interaction:** The platform assumes a variable broadband connection. The frontend architecture must gracefully handle network dropouts with standardized React Error Boundaries, intuitive offline notifications, and fetch retry logic for non-mutating requests.

#### 2.3.3 Software Interfaces
The operational integrity of the system relies on the flawless integration of several critical software interfaces:

1.  **Google Cloud OAuth 2.0 API:**
    *   **Protocol:** HTTPS / OAuth 2.0.
    *   **Purpose:** Secure identity verification and user data extraction.
    *   **Data Exchanged:** Authorization codes, JWT tokens, user email addresses, and profile avatar URIs.

2.  **Google DeepMind Gemini API (Generative Language API):**
    *   **Protocol:** HTTPS (RESTful).
    *   **Purpose:** Complex semantic analysis of user-generated text payloads for fraud detection.
    *   **Format Constraints:** JSON payloads containing highly specific instructional prompts. The integration must implement robust error handling, including exponential backoff for `HTTP 429 Too Many Requests` responses.

3.  **MongoDB Atlas (Database Engine):**
    *   **Protocol:** MongoDB Wire Protocol over TCP/IP.
    *   **Purpose:** Persistent, highly available data storage.
    *   **Format Constraints:** BSON documents. Strict, application-level schema enforcement is mandated via Mongoose models on the Node.js backend.

#### 2.3.4 Communications Interfaces
*   **Internal Application Routing:** Next.js App Router (file-based routing). Client-to-API communication is executed via internal `fetch` calls utilizing relative paths (e.g., `POST /api/bookings/create`).
*   **External Network Communication:** Standard HTTPS requests using the native `fetch` API. Absolutely all communication, both internal and external, must be encrypted in transit via TLS 1.2 or strictly higher.

---

### 2.4 Other Nonfunctional Requirements

#### 2.4.1 Performance Requirements
*   **Core Web Vitals Adherence:** The application is mandated to pass Google's Core Web Vitals assessment to ensure SEO dominance and user retention.
    *   **Largest Contentful Paint (LCP):** Must occur within a maximum of 2.5 seconds of the initial browser request on a simulated 4G network.
    *   **Total Blocking Time (TBT):** The main thread blocking time must remain below 200 milliseconds to guarantee UI responsiveness during complex client-side renders.
    *   **Cumulative Layout Shift (CLS):** Must remain below 0.1. All visual media (images, iframes) must possess explicitly defined width and height attributes or CSS aspect ratios to categorically prevent post-load layout jitter.
*   **Database Query Optimization:** Any MongoDB query exhibiting an execution time exceeding 100ms must be logged, profiled, and mitigated. Appropriate database indexes (e.g., compound indexes on `categoryId` and `providerId`) are mandatory.

#### 2.4.2 Safety and Continuity Requirements
*   **Data Resiliency:** Critical transactional and financial data (Bookings, Audits) must be housed in a MongoDB cluster utilizing, at minimum, a 3-node replica set to ensure automated failover and zero data loss in the event of primary node catastrophic failure.

#### 2.4.3 Security Requirements
*   **Aggressive Input Sanitization:** All user-provided inputs—especially service descriptions, review text, and real-time chat messages—must be heavily sanitized on the server side prior to database insertion to mitigate Cross-Site Scripting (XSS) injection vectors.
*   **NoSQL Injection Mitigation:** While Mongoose ODM implicitly protects against rudimentary NoSQL injection by enforcing strict primitive typing, any dynamic query construction based on user input must be heavily audited.
*   **Session Integrity:** Authentication payloads (JWTs) must be securely stored in `HttpOnly`, `Secure`, `SameSite=Lax` cookies, rendering them entirely inaccessible to client-side JavaScript.

#### 2.4.4 Software Quality Attributes
*   **Maintainability & Code Hygiene:** The codebase must adhere to strict, automated ESLint configurations and Prettier formatting rules enforced via pre-commit hooks. Complex business logic must be ruthlessly decoupled from UI components (e.g., extracting state machines into custom React hooks).
*   **Fault Tolerance & Reliability:** The application architecture must anticipate and gracefully handle third-party API degradation. If the Gemini AI API experiences an outage, the system must degrade to a "fail-open" state (allowing messages to send while queuing them for retrospective AI analysis) rather than critically blocking the core user workflow.

### 2.5 Comprehensive Requirements Matrix

This section provides an aggregated matrix of 50 discrete functional and non-functional requirements necessary for the complete implementation of the Local Link platform.

| Req ID | Type | Description | Priority | Complexity |
| :--- | :--- | :--- | :--- | :--- |
| **REQ-011** | Functional | Users shall be able to register using a verified email and secure password as an alternative to Google Auth. | Medium | Medium |
| **REQ-012** | Functional | Users shall be able to request a secure password reset link sent to their registered email address. | High | Low |
| **REQ-013** | Functional | Users shall be able to upload, crop, and save a profile avatar image (Max 2MB, JPEG/PNG). | Medium | Medium |
| **REQ-014** | Functional | Users shall be able to update their profile information including Display Name, Bio, and Location. | Medium | Low |
| **REQ-015** | Functional | The system shall provide a mechanism for users to permanently delete their account and associated data (GDPR Right to be Forgotten). | High | High |
| **REQ-016** | Functional | Prospective providers must submit Government-issued ID documentation during the onboarding workflow. | High | High |
| **REQ-017** | Functional | Providers shall be able to access an analytical dashboard displaying total earnings, pending payouts, and profile views. | Medium | High |
| **REQ-018** | Functional | Providers shall be able to define custom categorical tags for their service listings. | Low | Low |
| **REQ-019** | Functional | Providers shall be able to set a maximum travel distance for in-person service categories. | Medium | Medium |
| **REQ-020** | Functional | The system shall allow providers to pause their entire profile (Vacation Mode) removing them from search results. | Medium | Low |
| **REQ-021** | Functional | Providers shall be able to define a multi-tiered pricing matrix (e.g., Basic, Standard, Premium packages). | High | High |
| **REQ-022** | Functional | Customers shall be able to search for services utilizing a full-text keyword search bar. | High | Medium |
| **REQ-023** | Functional | The search interface shall support filtering results by a minimum and maximum price range. | High | Low |
| **REQ-024** | Functional | The search interface shall support sorting results by aggregate review score (highest to lowest). | High | Low |
| **REQ-025** | Functional | Customers shall be able to view a detailed service page containing description, pricing, and provider reviews. | Critical | Medium |
| **REQ-026** | Functional | Customers shall be able to view a provider's public profile page containing all active service listings. | Medium | Low |
| **REQ-027** | Functional | The system shall display a dynamic calendar allowing customers to select available dates for a booking. | Critical | High |
| **REQ-028** | Functional | Customers shall be required to input specific job details/requirements when submitting a booking request. | High | Low |
| **REQ-029** | Functional | Providers shall receive an immediate UI notification upon the creation of a new pending booking. | High | Medium |
| **REQ-030** | Functional | Providers shall be able to accept a pending booking, transitioning the state and locking the calendar. | Critical | High |
| **REQ-031** | Functional | Providers shall be able to reject a pending booking, requiring a mandatory text reason for rejection. | High | Medium |
| **REQ-032** | Functional | Customers shall be able to cancel an accepted booking up to 24 hours prior to the scheduled service time. | High | High |
| **REQ-033** | Functional | The system shall facilitate real-time, WebSocket-driven text messaging between the Customer and Provider. | Critical | High |
| **REQ-034** | Functional | Users shall be able to attach and send image files (Max 5MB) within the real-time chat interface. | Medium | High |
| **REQ-035** | Functional | The system shall automatically send an email notification to the Customer when a booking is accepted. | High | Low |
| **REQ-036** | Functional | Super Admins shall be able to view a paginated table of all registered users on the platform. | High | Low |
| **REQ-037** | Functional | Super Admins shall be able to manually verify or reject a Provider's uploaded identification documents. | High | Medium |
| **REQ-038** | Functional | Super Admins shall be able to globally edit or delete any active service listing on the platform. | Medium | Low |
| **REQ-039** | Functional | Customers shall be able to leave a 1-to-5 star rating and text review after a booking is marked COMPLETED. | High | Medium |
| **REQ-040** | Functional | Providers shall be able to publicly reply to a customer review on their service listing. | Medium | Low |
| **REQ-041** | Non-Functional | The system architecture must guarantee an operational uptime of 99.9% (excluding planned maintenance). | Critical | High |
| **REQ-042** | Non-Functional | All standard internal API route responses must execute in under 200 milliseconds (P95). | High | High |
| **REQ-043** | Non-Functional | The initial page load (Largest Contentful Paint) must render in under 2.5 seconds on simulated 4G networks. | High | High |
| **REQ-044** | Non-Functional | The platform database must support up to 10,000 concurrent read/write operations without locking. | High | High |
| **REQ-045** | Non-Functional | All sensitive data at rest within MongoDB Atlas must be encrypted using the AES-256 encryption standard. | Critical | Low |
| **REQ-046** | Non-Functional | All data in transit between the client, Vercel edge, and MongoDB must utilize TLS 1.3 encryption. | Critical | Low |
| **REQ-047** | Non-Functional | User passwords (if implemented) must be hashed using the bcrypt algorithm with a minimum work factor of 12. | Critical | Low |
| **REQ-048** | Non-Functional | The Next.js client bundle size must not exceed 250kb (gzipped) for the initial application load. | Medium | High |
| **REQ-049** | Non-Functional | The AI fraud detection background process must enforce a strict 2500ms execution timeout to prevent queue stalling. | High | Medium |
| **REQ-050** | Non-Functional | API routes handling authentication must implement strict IP-based rate limiting (maximum 5 requests per minute). | High | Medium |
| **REQ-051** | Non-Functional | The application codebase must maintain 100% strict TypeScript compilation without 'any' type overrides. | Medium | High |
| **REQ-052** | Non-Functional | The user interface must comply with WCAG 2.1 AA accessibility guidelines (contrast ratios, ARIA labels). | High | High |
| **REQ-053** | Non-Functional | The database shall undergo automated, geo-redundant snapshot backups every 24 hours. | Critical | Low |
| **REQ-054** | Non-Functional | Cross-Site Request Forgery (CSRF) tokens must be mandated for all POST/PUT/DELETE state-mutating API calls. | Critical | Medium |
| **REQ-055** | Non-Functional | The platform must be strictly deployable via Vercel's serverless/edge infrastructure without containerization dependencies. | High | Low |
| **REQ-056** | Non-Functional | The system must implement robust React Error Boundaries to prevent total white-screen failure upon component crash. | High | Medium |
| **REQ-057** | Non-Functional | All server-side errors must be logged to a centralized telemetry service (e.g., Sentry) without exposing PII. | High | Medium |
| **REQ-058** | Non-Functional | Session JSON Web Tokens (JWT) must have a strict expiration time of exactly 1 hour from issuance. | High | Low |
| **REQ-059** | Non-Functional | The frontend must utilize responsive image optimization (Next/Image) serving WebP formats by default. | Medium | Low |
| **REQ-060** | Non-Functional | The platform must gracefully degrade its real-time WebSocket features to long-polling if WebSockets are blocked by client firewalls. | Low | High |

---
*End of Chapter 2*
