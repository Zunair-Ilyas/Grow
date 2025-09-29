# iCanGrow Backend API

A comprehensive backend API for cannabis cultivation management system built with Express.js, TypeScript, and Supabase.

## Features

- 🔐 **Authentication & Authorization**: JWT-based auth with role-based access control
- 🌱 **ERP Management**: Batch tracking, growth cycles, daily logs, packaging, inventory
- 📋 **Quality Management System (QMS)**: Document control, training, deviations, CAPAs, environmental monitoring, electronic batch records
- 🏭 **Inventory Management**: Stock tracking, supplier management
- 📦 **Sales & CRM**: Client management, orders, dispatch
- 🛒 **Procurement**: Purchase orders, deliveries, supplier management
- 📊 **Compliance**: Audit trails, compliance scoring, reporting

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth + JWT
- **Validation**: Zod
- **Security**: Helmet, CORS, Rate Limiting

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Supabase account and project

### Installing pnpm

If you don't have pnpm installed, you can install it globally:

```bash
npm install -g pnpm
```

Or using other package managers:

```bash
# Using Homebrew (macOS)
brew install pnpm

# Using Scoop (Windows)
scoop install pnpm

# Using Chocolatey (Windows)
choco install pnpm
```

**Why pnpm?** pnpm is faster, more efficient, and uses less disk space than npm. It creates a global store for packages and uses hard links, making installations much faster and saving disk space.

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd icangrow-backend
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Environment Setup**

   ```bash
   cp .env .env
   ```

   Fill in your environment variables:

   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # Supabase Configuration
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_here
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d

   # CORS Configuration
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start Development Server**

   ```bash
   pnpm run dev
   ```

   The server will start on `http://localhost:3000`

## API Documentation

### Authentication Endpoints

| Method | Endpoint                           | Description               | Access  |
| ------ | ---------------------------------- | ------------------------- | ------- |
| POST   | `/api/v1/auth/signup`              | Register new user         | Public  |
| POST   | `/api/v1/auth/login`               | User login                | Public  |
| POST   | `/api/v1/auth/refresh`             | Refresh access token      | Public  |
| POST   | `/api/v1/auth/verify-email`        | Verify email address      | Public  |
| POST   | `/api/v1/auth/resend-verification` | Resend verification email | Public  |
| POST   | `/api/v1/auth/forgot-password`     | Send password reset email | Public  |
| POST   | `/api/v1/auth/reset-password`      | Reset password with token | Public  |
| POST   | `/api/v1/auth/change-password`     | Change user password      | Private |
| POST   | `/api/v1/auth/logout`              | User logout               | Private |
| GET    | `/api/v1/auth/me`                  | Get current user profile  | Private |

### Request/Response Examples

#### Signup

```bash
POST /api/v1/auth/signup
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123"
}
```

#### Login

```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Response Format

**Login Response:**

```json
{
	"success": true,
	"message": "Login successful",
	"data": {
		"user": {
			"id": "user-uuid",
			"email": "john@example.com",
			"fullName": "John Doe",
			"emailVerified": true,
			"role": "admin"
		},
		"accessToken": "jwt-access-token",
		"refreshToken": "jwt-refresh-token"
	}
}
```

**Signup Response (New User):**

```json
{
	"success": true,
	"message": "User registered successfully. Please check your email to verify your account.",
	"data": {
		"user": {
			"id": "user-uuid",
			"email": "john@example.com",
			"fullName": "John Doe",
			"emailVerified": false,
			"role": "admin"
		},
		"accessToken": null,
		"refreshToken": null
	}
}
```

**Signup Response (Existing Unverified User):**

```json
{
	"success": true,
	"message": "User already exists but email is not verified. A new verification email has been sent to your email address.",
	"data": {
		"user": {
			"id": "user-uuid",
			"email": "john@example.com",
			"fullName": "John Doe",
			"emailVerified": false,
			"role": "admin"
		},
		"accessToken": null,
		"refreshToken": null,
		"message": "verification_resent"
	}
}
```

**Signup Error (Existing Verified User):**

```json
{
	"success": false,
	"error": "An account with this email already exists. Please use login instead."
}
```

## Project Structure

```
src/
├── index.ts                 # Application entry point
├── types/
│   └── database.types.ts    # Supabase generated types
├── routes/
│   ├── auth.ts             # Authentication routes
│   └── qms/                # QMS routes
│       ├── index.ts        # QMS route aggregator
│       ├── qms-sops.ts     # SOP Control routes
│       ├── qms-training.ts # Training & Competency routes
│       ├── qms-deviations.ts # Deviation routes
│       ├── qms-capas.ts    # CAPA routes
│       ├── qms-environmental.ts # Environmental Monitoring routes
│       └── qms-ebr.ts      # Electronic Batch Records routes
├── services/
│   ├── auth.ts             # Authentication service
│   ├── supabase.ts         # Supabase client configuration
│   └── qms/                # QMS services
│       ├── qms-sops.ts     # SOP Control service
│       ├── qms-training.ts # Training & Competency service
│       ├── qms-deviations.ts # Deviation service
│       ├── qms-capas.ts    # CAPA service
│       ├── qms-environmental.ts # Environmental Monitoring service
│       └── qms-ebr.ts      # Electronic Batch Records service
├── middleware/
│   ├── auth.ts             # Authentication & RBAC middleware
│   ├── error-handler.ts    # Error handling middleware
│   └── not-found.ts        # 404 handler
└── utils/
    ├── jwt.ts              # JWT utilities
    ├── validation.ts       # General validation schemas
    ├── erp-validation.ts   # ERP validation schemas
    └── qms-validation.ts   # QMS validation schemas
```

## Environment Variables

| Variable                    | Description                          | Required           |
| --------------------------- | ------------------------------------ | ------------------ |
| `PORT`                      | Server port                          | No (default: 3000) |
| `NODE_ENV`                  | Environment (development/production) | No                 |
| `SUPABASE_URL`              | Supabase project URL                 | Yes                |
| `SUPABASE_ANON_KEY`         | Supabase anonymous key               | Yes                |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key            | Yes                |
| `JWT_SECRET`                | JWT signing secret                   | Yes                |
| `JWT_REFRESH_SECRET`        | JWT refresh token secret             | Yes                |
| `JWT_EXPIRES_IN`            | Access token expiration              | No (default: 15m)  |
| `JWT_REFRESH_EXPIRES_IN`    | Refresh token expiration             | No (default: 7d)   |
| `FRONTEND_URL`              | Frontend URL for CORS                | No                 |

## Scripts

- `pnpm run dev` - Start development server with hot reload
- `pnpm run build` - Build TypeScript to JavaScript
- `pnpm start` - Start production server
- `pnpm test` - Run tests

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: API request throttling
- **JWT**: Secure token-based authentication
- **Input Validation**: Zod schema validation
- **Password Requirements**: Strong password enforcement

### QMS (Quality Management System) Endpoints

| Method                             | Endpoint                               | Description                 | Access                                                          |
| ---------------------------------- | -------------------------------------- | --------------------------- | --------------------------------------------------------------- |
| **SOP Control**                    |                                        |                             |                                                                 |
| GET                                | `/api/v1/qms/sops`                     | List SOPs                   | `admin`, `qa_manager`, `cultivation_lead`                       |
| POST                               | `/api/v1/qms/sops`                     | Create SOP                  | `admin`, `qa_manager`                                           |
| GET                                | `/api/v1/qms/sops/{id}`                | Get SOP                     | `admin`, `qa_manager`, `cultivation_lead`                       |
| PUT                                | `/api/v1/qms/sops/{id}`                | Update SOP                  | `admin`, `qa_manager`                                           |
| POST                               | `/api/v1/qms/sops/{id}/approve`        | Approve SOP                 | `admin`, `qa_manager`                                           |
| GET                                | `/api/v1/qms/sops/category/{category}` | Get SOPs by category        | `admin`, `qa_manager`, `cultivation_lead`                       |
| GET                                | `/api/v1/qms/sops/categories/list`     | Get SOP categories          | `admin`, `qa_manager`, `cultivation_lead`                       |
| **Training & Competency**          |                                        |                             |                                                                 |
| GET                                | `/api/v1/qms/training`                 | List training records       | `admin`, `qa_manager`, `cultivation_lead`                       |
| POST                               | `/api/v1/qms/training`                 | Assign training             | `admin`, `qa_manager`, `cultivation_lead`                       |
| GET                                | `/api/v1/qms/training/{id}`            | Get training record         | `admin`, `qa_manager`, `cultivation_lead`                       |
| PUT                                | `/api/v1/qms/training/{id}`            | Update training             | `admin`, `qa_manager`, `cultivation_lead`                       |
| POST                               | `/api/v1/qms/training/{id}/complete`   | Mark training complete      | `admin`, `qa_manager`, `cultivation_lead`                       |
| GET                                | `/api/v1/qms/training/user/{id}`       | Get user training           | `admin`, `qa_manager`, `cultivation_lead`                       |
| GET                                | `/api/v1/qms/training/users/list`      | Get users list              | `admin`, `qa_manager`, `cultivation_lead`                       |
| GET                                | `/api/v1/qms/training/sops/list`       | Get SOPs list               | `admin`, `qa_manager`, `cultivation_lead`                       |
| **Deviations**                     |                                        |                             |                                                                 |
| GET                                | `/api/v1/qms/deviations`               | List deviations             | `admin`, `qa_manager`, `cultivation_lead`                       |
| POST                               | `/api/v1/qms/deviations`               | Log deviation               | `admin`, `qa_manager`, `cultivation_lead`                       |
| GET                                | `/api/v1/qms/deviations/{id}`          | Get deviation               | `admin`, `qa_manager`, `cultivation_lead`                       |
| PUT                                | `/api/v1/qms/deviations/{id}`          | Update deviation            | `admin`, `qa_manager`, `cultivation_lead`                       |
| POST                               | `/api/v1/qms/deviations/{id}/resolve`  | Resolve deviation           | `admin`, `qa_manager`, `cultivation_lead`                       |
| GET                                | `/api/v1/qms/deviations/batch/{id}`    | Get batch deviations        | `admin`, `qa_manager`, `cultivation_lead`                       |
| **CAPAs**                          |                                        |                             |                                                                 |
| GET                                | `/api/v1/qms/capas`                    | List CAPAs                  | `admin`, `qa_manager`, `cultivation_lead`                       |
| POST                               | `/api/v1/qms/capas`                    | Add CAPA                    | `admin`, `qa_manager`, `cultivation_lead`                       |
| GET                                | `/api/v1/qms/capas/{id}`               | Get CAPA                    | `admin`, `qa_manager`, `cultivation_lead`                       |
| PUT                                | `/api/v1/qms/capas/{id}`               | Update CAPA                 | `admin`, `qa_manager`, `cultivation_lead`                       |
| POST                               | `/api/v1/qms/capas/{id}/complete`      | Complete CAPA               | `admin`, `qa_manager`, `cultivation_lead`                       |
| GET                                | `/api/v1/qms/capas/deviation/{id}`     | Get deviation CAPAs         | `admin`, `qa_manager`, `cultivation_lead`                       |
| **Environmental Monitoring**       |                                        |                             |                                                                 |
| GET                                | `/api/v1/qms/environment`              | List environmental readings | `admin`, `qa_manager`, `cultivation_lead`, `environmental_tech` |
| GET                                | `/api/v1/qms/environment/batch/{id}`   | Get batch readings          | `admin`, `qa_manager`, `cultivation_lead`, `environmental_tech` |
| GET                                | `/api/v1/qms/environment/room/{name}`  | Get room readings           | `admin`, `qa_manager`, `cultivation_lead`, `environmental_tech` |
| GET                                | `/api/v1/qms/environment/summary`      | Get environmental summary   | `admin`, `qa_manager`, `cultivation_lead`, `environmental_tech` |
| **Electronic Batch Records (eBR)** |                                        |                             |                                                                 |
| POST                               | `/api/v1/qms/ebr`                      | Create eBR record           | `admin`, `qa_manager`, `cultivation_lead`                       |
| GET                                | `/api/v1/qms/ebr`                      | List eBR records            | `admin`, `qa_manager`, `cultivation_lead`                       |
| GET                                | `/api/v1/qms/ebr/{id}`                 | Get eBR record              | `admin`, `qa_manager`, `cultivation_lead`                       |
| GET                                | `/api/v1/qms/ebr/batch/{id}`           | Get batch eBR               | `admin`, `qa_manager`, `cultivation_lead`                       |
| GET                                | `/api/v1/qms/ebr/{id}/checklist`       | Get eBR checklist           | `admin`, `qa_manager`, `cultivation_lead`                       |
| POST                               | `/api/v1/qms/ebr/{id}/checklist`       | Add eBR checklist item      | `admin`, `qa_manager`, `cultivation_lead`                       |
| PUT                                | `/api/v1/qms/ebr/checklist/{item_id}`  | Update eBR checklist item   | `admin`, `qa_manager`, `cultivation_lead`                       |
| POST                               | `/api/v1/qms/ebr/{id}/approve`         | Approve eBR record          | `admin`, `qa_manager`, `cultivation_lead`                       |
| POST                               | `/api/v1/qms/ebr/{id}/reject`          | Reject eBR record           | `admin`, `qa_manager`, `cultivation_lead`                       |
| GET                                | `/api/v1/qms/ebr/{id}/details`         | Get eBR details             | `admin`, `qa_manager`, `cultivation_lead`                       |
| GET                                | `/api/v1/qms/ebr/statistics`           | Get eBR statistics          | `admin`, `qa_manager`, `cultivation_lead`                       |
| GET                                | `/api/v1/qms/ebr/debug/list`           | Debug: List all eBR records | `admin`, `qa_manager`, `cultivation_lead`                       |

## Database Schema

The application uses a comprehensive database schema with 70+ tables covering:

- **Cultivation**: Batches, growth cycles, environmental monitoring
- **Quality Management**: QMS records, audits, CAPA processes
- **Inventory**: Stock management, suppliers, procurement
- **Sales**: Clients, orders, dispatch, invoicing
- **Compliance**: Audit trails, compliance scoring
- **User Management**: Profiles, roles, permissions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details
