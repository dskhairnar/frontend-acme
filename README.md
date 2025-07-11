# 🏥 Acme Corp Patient Dashboard

A comprehensive and responsive dashboard designed for participants of Acme Corp’s GLP-1 weight-loss program. Built as a take-home challenge to demonstrate full-stack application development with a healthcare-focused UI.

---

## 📌 Overview

This project simulates a production-ready dashboard for patients, offering key health insights, shipment tracking, and progress monitoring. Built with React and TypeScript, the app emphasizes security, usability, and scalability.

---

## 🌟 Key Features

### 🧩 Core Functionality

* 🔐 **User Authentication**: Secure login with session persistence
* 📊 **Dashboard Overview**: Summary of weight, BMI, and shipment status
* 📉 **Weight Tracking**: Visualize progress over time with interactive charts
* 💊 **Medication & Shipment Management**: View orders, delivery statuses
* 📱 **Responsive UI**: Seamless experience across devices

### 🎁 Additional Highlights

* 🎨 **Healthcare UI**: Soothing palette with accessible design
* 📈 **Recharts Integration**: Clean and responsive data visualizations
* 🔒 **Protected Routes**: Secure navigation across the application
* ⚡ **Optimized Performance**: Fast, smooth, and efficient

---

## ⚙️ Tech Stack

### 🖥 Frontend

* **Framework**: React 18 + TypeScript
* **Styling**: Tailwind CSS + custom healthcare color scheme
* **UI Library**: [shadcn/ui](https://ui.shadcn.com)
* **Charts**: Recharts
* **Routing**: React Router v6
* **State Management**: React Context API
* **Build Tool**: Vite

### 🖥 Backend (Proposed)

* **Runtime**: Node.js + Express
* **Database**: PostgreSQL with Prisma ORM
* **Auth**: JWT with refresh tokens
* **API Design**: RESTful + OpenAPI
* **Deployment**: AWS (EC2, RDS, S3, CloudFront)
* **Monitoring**: AWS CloudWatch

---

## 🖼 Design System

* **Primary Colors**:

  * Light Blue: `#0ea5e9`
  * Deep Blue: `#0284c7`
* **Typography**: Clean sans-serif fonts for clinical readability
* **Layouts**: Accessible and mobile-first grid system
* **Components**: Consistent shadows, padding, and spacing for clarity

---

## 🧪 Demo Credentials

```
Email:    patient@example.com  
Password: demo123
```

Features include:

* Form validation & feedback
* Persistent sessions via `localStorage`
* Secure logout & protected routes

---

## 🚀 Getting Started

### 📋 Prerequisites

* Node.js v18+
* Git

### 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd acme-patient-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

Open in browser: [http://localhost:8080](http://localhost:8080)

---

## 🧱 System Architecture

### 📊 Database Schema (Proposed)

```sql
-- users, weight_entries, medications, shipments (see original content)
```

### 🔗 API Endpoints

```
Authentication:
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh

User Management:
GET    /api/users/profile
PUT    /api/users/profile
GET    /api/users/dashboard-stats

Weight Tracking:
GET    /api/weight-entries
POST   /api/weight-entries
PUT    /api/weight-entries/:id
DELETE /api/weight-entries/:id

Shipments:
GET    /api/shipments
GET    /api/shipments/:id
POST   /api/shipments
PUT    /api/shipments/:id

Medications:
GET    /api/medications
```

---

## ☁️ Cloud Architecture (AWS)

```
Frontend:
- S3 + CloudFront
- Route 53

Backend:
- EC2 / ECS
- Load Balancer + Auto Scaling

Database:
- RDS PostgreSQL
- ElastiCache for Redis sessions

Security:
- AWS WAF
- Secrets Manager
- VPC

Monitoring:
- CloudWatch
- AWS X-Ray
```

---

## 🛡 Security Practices

* 🔐 **JWT + httpOnly Cookies**
* 🔏 **RBAC (Role-Based Access Control)**
* 🧪 **Input Validation & Sanitization**
* 🧊 **Encryption at Rest and Transit**
* 🧱 **Rate Limiting**
* 🏥 **HIPAA-Oriented Best Practices**

---

## ⚙️ Performance

* ✂️ Code Splitting & Lazy Loading
* 🌐 Optimized for WebP & CDN
* 📦 Bundle Analysis with `webpack-bundle-analyzer`
* 🧵 Indexed DB queries and pagination

---

## 🧪 Testing Strategy

### Scripts

```bash
npm run test:unit         # Unit Tests
npm run test:integration  # Integration Tests
npm run test:e2e          # E2E Tests
npm run test:coverage     # Code Coverage
```

Includes:

* **Unit Tests**: React Testing Library
* **Integration**: Jest
* **E2E**: Cypress
* **Visual**: Chromatic

---

## 🚢 Deployment

### Local Production Build

```bash
npm run build
npm run preview
```

### Docker

```bash
docker build -t acme-patient-dashboard .
docker run -p 8080:8080 acme-patient-dashboard
```

### CI/CD

* 🛠 GitHub Actions
* ✅ Lint, Type Check, and Test Gates
* 🚧 Staging via preview deploys
* ✅ Manual approvals with Blue-Green strategy

---

## 🧭 Roadmap & Future Enhancements

* 📣 **Real-time Shipment Notifications (WebSockets)**
* 🗓️ **Calendar & Appointment Integration**
* 📄 **PDF/CSV Data Exports**
* 📞 **Telehealth (Video) Integration**
* 📱 **React Native Mobile App**
* 🧠 **AI Insights on Health Trends**

---

## 🤝 Contributing

> This is a take-home demonstration. For active development:

```bash
# Fork and clone
git checkout -b feature/awesome-feature
# Make your changes and push
git commit -m "Add awesome feature"
git push origin feature/awesome-feature
# Open a Pull Request
```

---

## 📜 License

This project was developed as part of a **technical challenge** and is intended for demonstration purposes only.

---

## 📬 Contact

Feel free to reach out regarding:

* 📐 **System Design Decisions**
* 🎨 **Healthcare UI/UX**
* 🔐 **Security & Compliance**

---

**Built with ❤️ for Acme Corp | Take-Home Challenge**
