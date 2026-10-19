# MeraMahan (मेरा महान)
### *Your Voice. Your Community. Your India.*

[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.4.1-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)

MeraMahan is a modern, privacy-respecting citizen reporting and civic awareness platform designed for India. The platform enables citizens across all Indian states and union territories to document and submit observable community issues—ranging from environmental degradation and illegal dumping to public infrastructure deterioration and suspected misuse of public resources—under an impartial, moderated civic framework.

---

## ⚖️ Legal & Editorial Principles

MeraMahan is an independent citizen reporting platform, **not an enforcement body or a court of law**.

1. **Neutral Civic Terminology**: Citizen submissions represent citizen allegations/observations and are **never** presented as proven legal facts. The platform strictly enforces neutral terms:
   - *Citizen Report* / *User Report*
   - *Alleged Incident* / *Suspected Bribery*
   - *Under Review* / *Verified Report* / *Resolved*
   - Never states defamatory phrases such as *"This person is corrupt"* or *"This organization is guilty"*.
2. **Strict Privacy Standards**:
   - **NO MAPS / NO GPS / NO BROWSER GEOLOCATION**: Users manually select their **State** and **City** from curated dropdowns and optionally provide an area/landmark description. The platform never requests browser location permissions, coordinates, or device tracking.
   - **No Sensitive Identity Collection**: No Aadhaar numbers, PAN, or exact home addresses are ever collected or stored.
   - **Email Masking**: Citizen email addresses are automatically masked in public discussions (e.g., `c***n@meramahan.in`).
3. **Pre-Publication Moderation**: Every citizen report undergoes administrative review before public publication to prevent defamation, spam, and unverified allegations.

---

## 🏗️ Architecture & Technology Stack

```
MeraMahan/
├── backend/                  # Java 21 + Spring Boot 3.4.1 Web API
│   ├── src/main/java/com/meramahan/
│   │   ├── config/           # Security, Cloudinary, Auditing, CORS configs
│   │   ├── controller/       # Auth, Reports, Admin, Meta, Notification, ContentReport
│   │   ├── dto/              # Strongly-typed request/response records & DTOs
│   │   ├── model/            # JPA Entities (User, Report, Comment, Like, Notification, etc.)
│   │   ├── repository/       # Spring Data JPA repositories
│   │   ├── security/         # JWT filter, JwtService, CustomUserDetails
│   │   └── service/          # Business logic, OTP hashing, Image storage, Email
│   ├── src/main/resources/   # application.yml, seed data configs
│   └── Dockerfile            # Multi-stage Eclipse Temurin JDK 21 build
├── frontend/                 # React 18 + Vite 6 + Tailwind CSS SPA
│   ├── src/
│   │   ├── api/              # Axios client with interceptors & auto-refresh
│   │   ├── components/       # Common Navbar, 50/50 BottomNav, Footer, StatusBadge
│   │   ├── context/          # AuthContext (JWT session, login, OTP, logout)
│   │   └── pages/            # Home, Explore, Submit, Details, Admin, Profile, Auth, Help
│   ├── nginx.conf            # Production Nginx reverse-proxy & SPA routing
│   └── Dockerfile            # Multi-stage Node 20 build + Nginx Alpine
├── MeraMahan.postman_collection.json # Complete API test suite
├── docker-compose.yml        # Orchestration (PostgreSQL 16 + Backend + Frontend)
└── README.md
```

### Technology Highlights
- **Backend**: Spring Boot 3.4.1, Java 21, Hibernate, Spring Security (Stateless JWT + Refresh tokens), BCrypt password hashing, SHA-256 OTP hashing with 5-minute expiry and rate limiting.
- **Image Storage**: Pluggable `ImageStorageService` supporting Cloudinary with automatic fallback to local filesystem storage (`uploads/`). Easily swappable with AWS S3.
- **Frontend**: React 18, Vite 6, Tailwind CSS, React Router v6, Lucide React icons.
- **Mobile-First UX**: Dedicated 50/50 mobile bottom navigation bar (**LEFT 50%: 📷 POST** | **RIGHT 50%: 👤 PROFILE**).

---

## 🔑 Pre-Seeded Default Accounts

When the application boots, `DataSeeder` automatically initializes Indian states (15), major cities (43), civic categories (13), and the following default accounts:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@meramahan.in` | `Admin@1234` | Full platform governance, user management, metrics, moderation |
| **Moderator** | `moderator@meramahan.in` | `Moderator@1234` | Report verification, status updates, content abuse resolution |
| **Citizen** | `citizen@meramahan.in` | `Citizen@1234` | Report submission, likes, community comments, bookmarking |

---

## 🚀 Quickstart: Running Locally

### Prerequisites
- **Java 21** or later
- **Node.js 20+** and **npm**
- **Maven** (a wrapper `./mvnw` is included in `backend/`)

### 1. Start the Backend API
```bash
cd backend

# Compile and run unit tests (14 tests)
./mvnw test

# Start the Spring Boot server (uses in-memory H2 database with pre-seeded data by default)
./mvnw spring-boot:run
```
The backend API starts on `http://localhost:8080`.
H2 Web Console is available at `http://localhost:8080/h2-console` (`JDBC URL: jdbc:h2:mem:meramahandb`, User: `sa`, Password: empty).

### 2. Start the Frontend Application
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```
The React frontend starts on `http://localhost:5173`.

---

## 🐳 Running with Docker & Docker Compose

Deploy the complete stack (PostgreSQL 16 + Spring Boot + React/Nginx) with a single command:

```bash
# From project root
docker compose up --build -d
```

- **Frontend Application**: `http://localhost:3000` or `http://localhost:80`
- **Backend API**: `http://localhost:8080`
- **PostgreSQL Database**: `localhost:5432` (`meramahan` / `postgres` / `postgres`)

To stop all services:
```bash
docker compose down
```

---

## 🧪 API Testing with Postman

The project includes a ready-to-run Postman collection: `MeraMahan.postman_collection.json`.

1. Open **Postman** and click **Import**.
2. Select `MeraMahan.postman_collection.json` located in the root directory.
3. The collection includes automatic token capture scripts:
   - Run **Login (Citizen)** or **Login (Admin)** to automatically populate `{{accessToken}}` and `{{refreshToken}}`.
4. Test endpoints across all 6 modules:
   - **Authentication**: OTP send/verify, Citizen registration, JWT login, token refresh, password recovery.
   - **Metadata**: Indian States, Cities by State, Civic Categories.
   - **Citizen Reports**: Public feed, report details, multipart photo submission, personal reports, likes toggle, masked comments.
   - **Notifications**: User notification polling, read status updates.
   - **Abuse Reporting**: Content flagging for inaccurate/violating submissions.
   - **Admin & Moderation**: System analytics, report moderation queue, status transitions, user account toggling, abuse resolution.

---

## 📱 Frontend Page Directory

- `/` — Public Community Reports Feed (filtered by State, City, Category, Status)
- `/explore` — Search & Discover citizen reports with sorting and filters
- `/reports/:id` — Detailed Report View with photographic evidence, timeline, like counter, and masked community discussion
- `/submit` / `/create-report` — Protected Citizen Report Creation (camera upload, category, manual state/city, landmark description)
- `/my-reports` / `/profile` — Personal Citizen Profile & report history
- `/help` — Indian Civic Helplines, Evidence Photography Tips & Platform Principles
- `/login` — Secure JWT Login
- `/register` — 2-Step Registration with Email OTP verification and cascading State/City dropdowns
- `/verify-otp` — Standalone Email OTP Verification
- `/forgot-password` / `/reset-password` — Password Recovery via OTP
- `/admin` (and `/admin/reports`, `/admin/users`, `/admin/analytics`, `/admin/content-reports`) — Moderation Dashboard with live analytics and moderation controls
- `*` — Custom 404 Not Found Page

---

## 🛡️ Security Features

- **Stateless JWT Architecture**: Short-lived Access Tokens (24h) + Long-lived Refresh Tokens (7d).
- **Password Protection**: BCrypt hashing with strength factor 12.
- **Hashed OTP Tokens**: Cryptographically secure 6-digit OTPs hashed with SHA-256 before storage; expires in 5 minutes with maximum 5 attempts and 60-second resend cooldown.
- **Role-Based Access Control**: `ROLE_CITIZEN`, `ROLE_MODERATOR`, `ROLE_ADMIN` enforced via `@PreAuthorize` and Spring Security Filter Chains.
- **Rate Limiting**: IP and user-based throttling on authentication and OTP endpoints.
- **CORS Protection**: Restricted to trusted frontend origins.

---

## 🇮🇳 License

Built with pride for Indian civic empowerment. Open source under the [MIT License](LICENSE).
