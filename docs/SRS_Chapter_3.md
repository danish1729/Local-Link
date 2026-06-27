# Software Requirement Specification and Design Document
## Project: Local Link

---

## Chapter 3: Analysis

### 3.1 Identifying Actors and Use Cases using Textual Analysis

#### 3.1.1 Methodology
Textual Analysis is a formalized, deterministic requirement engineering technique utilized to derive object-oriented system boundaries, active entities (Actors), and distinct functional operations (Use Cases) directly from the project's foundational problem statement and business logic descriptions. The methodology follows a rigorous two-step semantic process:
1.  **Noun Phrase Extraction:** Identifying explicit nouns and noun phrases to isolate candidate Actors (human and non-human), system boundaries, and conceptual data objects.
2.  **Verb Phrase Extraction:** Identifying transitive verbs and verb phrases inherently linked to the identified actors. These verbs isolate the explicit actions performed upon the system, which translate directly into candidate Use Cases.

#### 3.1.2 The Base Problem Statement
*The following text serves as the baseline for extraction for the Local Link ecosystem:*
"Local Link is a digital marketplace where a **Customer** can search for a localized **Service**. To request work, the Customer initiates a **Booking**. A **Provider** receives the request and can either accept or reject the Booking. If accepted, the Customer and Provider can engage in a real-time **Chat**. Throughout this process, an automated **AI Engine** continuously monitors the Chat to detect **Fraud** or off-platform communication. If a policy violation is found, the AI Engine flags the interaction for the **Super Admin**, who can subsequently **Freeze** the user's account."

#### 3.1.3 Noun Extraction and Actor Identification
By parsing the baseline problem statement, we identify the following categorical nouns, which are subsequently classified into system entities and active actors.

| Extracted Noun Phrase | Categorization | Conceptual Mapping (Actor vs Object) | Justification |
| :--- | :--- | :--- | :--- |
| Customer | Human Entity | **Primary Actor** | Actively initiates external stimuli (searching, booking) against the system boundaries. |
| Provider | Human Entity | **Primary Actor** | Responds to system stimuli (bookings) and manipulates system data (service listings). |
| Service | Conceptual Object | Data Entity | Represents the transactional product stored in the database; it is not an actor. |
| Booking | Conceptual Object | Data Entity | Represents the stateful transaction linking Customer and Provider. |
| Chat | Conceptual Object | Interface/Data | The communication medium; acted upon by users, not an actor itself. |
| AI Engine | Non-Human Entity | **Secondary System Actor** | An autonomous external subsystem (Google Gemini) that actively monitors system state and triggers internal architectural actions. |
| Super Admin | Human Entity | **Primary Actor** | A privileged human actor interacting with distinct administrative interfaces. |

#### 3.1.4 Verb Extraction and Use Case Identification
Next, we isolate the verbs associated with the identified actors to mathematically formulate the candidate Use Cases.

| Actor | Extracted Verb Phrase | Candidate Use Case Identification | Complexity |
| :--- | :--- | :--- | :--- |
| Customer | "search for a localized Service" | **UC-01: Search and Filter Services** | Medium |
| Customer | "initiates a Booking" | **UC-02: Initiate Service Booking** | High |
| Provider | "receives the request" | **UC-03: View Pending Bookings** | Low |
| Provider | "accept or reject the Booking" | **UC-04: Process Booking Request** | High |
| Customer/Provider | "engage in a real-time Chat" | **UC-05: Participate in Real-Time Chat** | High |
| AI Engine | "continuously monitors... detect Fraud" | **UC-06: Analyze Payload for Fraud** | Very High |
| AI Engine | "flags the interaction" | **UC-07: Generate Fraud Alert** | Medium |
| Super Admin | "Freeze the user's account" | **UC-08: Execute Account Freeze** | High |

---

### 3.2 Use Case Diagram with Candidate Actors

The following Unified Modeling Language (UML) Use Case diagram visualizes the behavioral boundaries of the Local Link platform. It illustrates the exact relationships between our identified Actors (Customer, Provider, Super Admin, AI Engine) and the highest-level system Use Cases. 

Crucially, it utilizes explicit `<<include>>` tags to denote mandatory sub-processes (e.g., you *must* authenticate to initiate a booking) and `<<extend>>` tags to denote optional/conditional sub-processes (e.g., the AI engine only analyzes chat if chat is actively engaged).

```mermaid
usecaseDiagram
  actor Customer as "Customer"
  actor Provider as "Provider"
  actor Admin as "Super Admin"
  actor AI as "<<System>> AI Engine (Gemini)"

  rectangle "Local Link Ecosystem (Next.js & MongoDB)" {
    usecase UCAuth as "Authenticate via Google OAuth"
    usecase UCSearch as "Search & Filter Service Catalog"
    usecase UCBook as "Initiate Service Booking Transaction"
    usecase UCProcess as "Process Booking (Accept/Reject)"
    usecase UCChat as "Engage in WebSocket Chat"
    usecase UCAnalyze as "Analyze Semantic Payload"
    usecase UCFlag as "Generate Admin Fraud Alert"
    usecase UCManage as "Manage Service Listings CRUD"
    usecase UCFreeze as "Execute Global Account Freeze"
    
    Customer --> UCAuth
    Customer --> UCSearch
    Customer --> UCBook
    Customer --> UCChat
    
    Provider --> UCAuth
    Provider --> UCProcess
    Provider --> UCManage
    Provider --> UCChat
    
    Admin --> UCAuth
    Admin --> UCFreeze
    
    AI --> UCAnalyze
    
    UCBook ..> UCAuth : <<include>>
    UCProcess ..> UCAuth : <<include>>
    UCManage ..> UCAuth : <<include>>
    UCFreeze ..> UCAuth : <<include>>
    
    UCChat ..> UCAnalyze : <<extend>> (If text length > 0)
    UCAnalyze ..> UCFlag : <<include>> (If confidence score > threshold)
    UCFlag ..> Admin : Asynchronous Dashboard Alert
  }
```

*Architectural Note: In the diagram above, the AI Engine operates as a unique autonomous external system actor. It is not triggered by a human clicking a button, but rather triggered conditionally by the system's internal message bus.*

---

### 3.3 Describe the Events Flow for Use Case

To ensure rigorous architectural understanding and to provide precise blueprints for frontend component logic and backend API development, the highest-complexity Use Cases are explicitly broken down into tabular Event Flows. These matrices detail the exact "ping-pong" interaction sequence between the external Actor and the internal System, including critical alternative pathways and error handling logic.

#### 3.3.1 UC-02: Initiate Service Booking (End-to-End Flow)

| Attribute | Description |
| :--- | :--- |
| **Use Case ID** | UC-02 |
| **Use Case Name** | Initiate Service Booking Transaction |
| **Primary Actor** | Customer |
| **Secondary Actor** | System (Next.js API & MongoDB) |
| **Pre-Conditions** | 1. Customer maintains a valid, unexpired JWT session. <br> 2. Customer is currently viewing an active, non-archived Service Listing. <br> 3. Provider has available schedule slots in their database matrix. |
| **Post-Conditions** | 1. A new `Booking` document is instantiated in the database with status set to `PENDING`. <br> 2. Provider receives a real-time notification. |

**Primary Flow of Events (Happy Path):**
| Step | Actor Action (Customer) | System Response (Local Link Framework) |
| :--- | :--- | :--- |
| 1 | Clicks the primary "Book Now" call-to-action button on the service detail page. | System intercepts the click event, verifies client-side authentication state. If valid, the system renders the dynamic multi-step booking modal interface. |
| 2 | Selects a desired date from the dynamically rendered calendar component. | System executes an API `GET` request to query the `availability` matrix for the specific provider/date combination and renders available time slots. |
| 3 | Clicks a specific available time slot (e.g., 14:00 - 15:00). | System temporarily locks the time slot in React client-state to visually indicate selection and advances to the job details form. |
| 4 | Inputs specific job requirements into the text area and clicks "Confirm Booking". | System triggers strict client-side validation using Zod schemas. If valid, the system constructs a complex JSON payload and dispatches an asynchronous `POST` request to `/api/bookings/create`. |
| 5 | *Waits for network resolution (observes loading state).* | System receives the payload, verifies the session token, sanitizes text input against XSS, validates database referential integrity, and atomically inserts the `PENDING` booking document into MongoDB. |
| 6 | *Observes UI state mutation.* | System returns HTTP 201 Created. The frontend consumes the response, updates the UI to display a high-fidelity "Success" animation, and redirects the Customer to the "My Bookings" dashboard. |

**Alternative Flows & Exceptions:**
*   **Exception 3.1a (Authentication Failure / Session Timeout):** If at Step 1 the system detects an expired JWT, the system suspends the booking flow and triggers a 307 redirect to the Google SSO login wall. Upon successful login, the system utilizes the preserved `callbackUrl` search parameter to return the user directly to Step 1 without losing context.
*   **Exception 3.3a (Concurrency Database Conflict):** If at Step 5, the backend database determines the exact time slot was booked by a different concurrent user milliseconds prior (a race condition), the transaction is immediately rolled back. The API returns an HTTP 409 Conflict. The UI catches this specific error, displays an error toast ("Time slot no longer available"), and automatically refreshes the calendar availability matrix.

#### 3.3.2 UC-04: Process Booking Request (Provider Flow)

| Attribute | Description |
| :--- | :--- |
| **Use Case ID** | UC-04 |
| **Use Case Name** | Process Booking Request |
| **Primary Actor** | Provider |
| **Pre-Conditions** | 1. Provider is authenticated via Google SSO. <br> 2. Provider has at least one active booking in the `PENDING` state. |
| **Post-Conditions** | 1. Booking document state mutates permanently to `ACCEPTED` or `REJECTED`. <br> 2. If accepted, the System calendar permanently locks the associated time slot to prevent double-booking. |

**Primary Flow of Events (Happy Path - Acceptance):**
| Step | Actor Action (Provider) | System Response (Local Link Framework) |
| :--- | :--- | :--- |
| 1 | Navigates to the secure Provider Dashboard -> "Pending Requests" tab. | System executes a server-side DB query fetching all booking documents where `providerId === user.id` and `status === "PENDING"`. System renders the list as interactive cards. |
| 2 | Clicks on a specific pending booking card to view granular details. | System expands the card UI, retrieving and displaying the Customer's specific job requirements, requested date, and time slot. |
| 3 | Clicks the primary "Accept Booking" button. | System intercepts the click and displays a severe confirmation modal, warning the provider that acceptance irrevocably locks their schedule. |
| 4 | Clicks "Confirm Acceptance". | System dispatches an authenticated `PATCH` request to `/api/bookings/:id` containing the payload `{ action: "ACCEPT" }`. |
| 5 | *Waits for network processing.* | System begins a database transaction. It mutates the booking state to `ACCEPTED`. Concurrently, it executes a secondary write to the Provider's `availability` document matrix, permanently blocking out the specific time slot. Transaction commits. |
| 6 | *Observes UI update.* | System returns HTTP 200 OK. The frontend UI optimistically removes the booking from the "Pending" list DOM and prepends it to the "Upcoming" list. System queues an email notification to the Customer. |

**Alternative Flows:**
*   **Alternative 4.3a (Rejection Pathway):** At Step 3, the Provider clicks the secondary "Reject" button. The system immediately forces the Provider to input a "Reason for Rejection" within a mandatory text area to maintain marketplace transparency. The `PATCH` request payload is `{ action: "REJECT", reason: string }`. The booking state changes to `REJECTED`, the database availability matrix remains entirely untouched, and the Customer is automatically notified of the rejection along with the provided reason.

#### 3.3.3 UC-06 & UC-07: Analyze Payload & Generate Fraud Alert

| Attribute | Description |
| :--- | :--- |
| **Use Case ID** | UC-06 & UC-07 (Chained Process) |
| **Use Case Name** | Real-Time AI Semantic Fraud Detection |
| **Primary Actor** | AI Engine (Google Gemini) |
| **Secondary Actor** | System / Super Admin |
| **Pre-Conditions** | 1. A Customer or Provider successfully transmits a chat message over the platform. |
| **Post-Conditions** | 1. The message is semantically evaluated. <br> 2. If a policy violation is detected, a `FraudAlert` document is generated, and the Super Admin is notified instantly. |

**Primary Flow of Events:**
| Step | Actor Action (System / AI Engine) | System Response / Internal State Mutation |
| :--- | :--- | :--- |
| 1 | System (Chat API Route) successfully writes a new user message document to the MongoDB database. | System immediately spins off a non-blocking asynchronous background task (leveraging Vercel Edge functions or standard Promises) to ensure the user's chat experience is not delayed by AI latency. |
| 2 | System actively constructs the AI Prompt Payload. | System concatenates the last 5 chat messages to provide context, injects strict system instructions (e.g., "Detect covert attempts to share phone numbers, emails, or crypto wallets"), and formats the prompt into the exact JSON structure required by the Gemini API. |
| 3 | System dispatches the payload to the AI Engine via HTTPS POST. | AI Engine (Gemini) receives the payload, authenticates the API key, and begins deep semantic analysis of the text string. |
| 4 | AI Engine returns the computational response. | AI Engine responds via HTTPS with a strictly defined JSON object: `{"isFraud": true, "confidence": 0.94, "reason": "User explicitly shared a disguised WhatsApp number: 'catch me on WA nine eight seven...'"}` |
| 5 | System evaluates the AI Response against hardcoded parameters. | System parses the JSON. It evaluates the `confidence` score (0.94). Because it is greater than the system's hardcoded threshold of 0.85, the system immediately triggers the high-priority Alert Pipeline. |
| 6 | System generates the Alert and notifies administration. | System creates a new document in the `admin_alerts` MongoDB collection containing the `reason` and cross-referenced IDs. System pushes a real-time WebSocket update to the Super Admin dashboard indicating a critical priority alert requires human review. |

**Exceptions:**
*   **Exception 6.3a (Gemini API Timeout/Total Failure):** If the external Google Gemini API fails to respond within the mandated 2500ms timeout window, or returns an HTTP 5xx error, the System gracefully catches the exception. To maintain high platform availability, the user's chat message is NOT blocked or deleted. Instead, the `message_id` is pushed to a "Retry-Queue" collection within the database. A CRON job will pull from this queue for asynchronous batch AI analysis during low-traffic periods, ensuring no messages escape eventual scrutiny.

---
*End of Chapter 3*
