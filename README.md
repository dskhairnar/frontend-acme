
# Acme Corp Patient Dashboard

A comprehensive patient dashboard for GLP-1 weight-loss program participants, built as a take-home challenge demonstration.

## 🎯 Challenge Overview

This project demonstrates a full-stack approach to building a patient dashboard for Acme Corp's weight-loss program. The application showcases:

- **Secure Authentication**: Mock login system with demo credentials
- **Dashboard Overview**: Key metrics and progress summaries
- **Weight Tracking**: Interactive charts and progress visualization
- **Shipment Management**: Medication delivery tracking and history
- **User Profile**: Personal information and health summary

## 🚀 Features

### Core Functionality
- ✅ **Secure User Authentication** - Login/logout with session management
- ✅ **Dashboard Overview** - Weight, BMI, shipment status at a glance
- ✅ **Weight Loss Progress** - Interactive charts with historical data
- ✅ **Medication & Shipment Tracking** - Order history and delivery status
- ✅ **Responsive Design** - Works seamlessly on all devices

### Additional Features
- 🎨 **Healthcare-focused Design** - Calming colors and professional UI
- 📊 **Interactive Charts** - Using Recharts for data visualization  
- 🔒 **Protected Routes** - Secure navigation and state management
- 📱 **Mobile Responsive** - Optimized for mobile and tablet usage
- ⚡ **Performance Optimized** - Fast loading and smooth interactions

## 🛠 Technical Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom healthcare color palette
- **Components**: shadcn/ui component library
- **Charts**: Recharts for data visualization
- **Routing**: React Router v6 with protected routes
- **State Management**: React Context for authentication
- **Build Tool**: Vite for fast development and builds

### Backend Architecture (Proposed)
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens with refresh token rotation
- **API Design**: RESTful API with OpenAPI documentation
- **Cloud Platform**: AWS (EC2, RDS, S3, CloudFront)
- **Monitoring**: CloudWatch for logging and metrics

## 🎨 Design System

The application uses a healthcare-focused design system:

- **Primary Colors**: Medical blues (#0ea5e9, #0284c7)
- **Success Colors**: Healthcare greens for positive metrics
- **Typography**: Clean, readable fonts optimized for medical data
- **Layout**: Spacious, accessible design following healthcare UI patterns
- **Components**: Consistent spacing, shadows, and interaction patterns

## 📊 Mock Data

The application includes realistic mock data for demonstration:

- **User Profile**: Complete patient information
- **Weight Entries**: 6+ months of weight tracking data
- **Medications**: GLP-1 (Semaglutide) prescription details
- **Shipments**: Order history with various delivery statuses
- **Health Metrics**: BMI, progress calculations, and goals

## 🔐 Authentication

**Demo Credentials:**
- Email: `patient@example.com`  
- Password: `demo123`

The authentication system includes:
- Form validation and error handling
- Loading states and user feedback
- Session persistence via localStorage
- Protected route authentication
- Secure logout functionality

## 📱 Responsive Design

The dashboard is fully responsive with:
- **Desktop**: Full sidebar navigation with detailed layouts
- **Tablet**: Optimized grid layouts and touch interactions  
- **Mobile**: Collapsed navigation and mobile-first components
- **Accessibility**: WCAG compliant with keyboard navigation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd acme-patient-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080`

5. **Login with demo credentials**
   - Email: `patient@example.com`
   - Password: `demo123`

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🏗 System Architecture

### Database Schema (Proposed)

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  password_hash VARCHAR NOT NULL,
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  date_of_birth DATE,
  phone VARCHAR,
  enrollment_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Weight entries table  
CREATE TABLE weight_entries (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  weight DECIMAL(5,2) NOT NULL,
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Medications table
CREATE TABLE medications (
  id UUID PRIMARY KEY,
  name VARCHAR NOT NULL,
  dosage VARCHAR NOT NULL,
  frequency VARCHAR NOT NULL
);

-- Shipments table
CREATE TABLE shipments (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  medication_id UUID REFERENCES medications(id),
  status VARCHAR NOT NULL,
  order_date DATE NOT NULL,
  shipped_date DATE,
  expected_delivery_date DATE NOT NULL,
  tracking_number VARCHAR,
  quantity INTEGER NOT NULL,
  address JSONB NOT NULL
);
```

### API Endpoints (Proposed)

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

### Cloud Architecture (AWS)

```
Frontend:
- S3 + CloudFront for static hosting
- Route 53 for DNS management

Backend:
- EC2/ECS for application servers
- Application Load Balancer
- Auto Scaling Groups

Database:
- RDS PostgreSQL with read replicas
- ElastiCache Redis for sessions

Security:
- AWS WAF for application protection
- AWS Secrets Manager for sensitive data
- VPC with private subnets

Monitoring:
- CloudWatch for logs and metrics
- AWS X-Ray for distributed tracing
```

## 🔒 Security Considerations

- **Authentication**: JWT with secure httpOnly cookies
- **Authorization**: Role-based access control (RBAC)  
- **Data Protection**: Encryption at rest and in transit
- **Input Validation**: Server-side validation for all inputs
- **Rate Limiting**: API endpoint protection
- **HIPAA Compliance**: Healthcare data protection standards

## 📈 Performance Optimizations

- **Code Splitting**: Route-based lazy loading
- **Image Optimization**: WebP format with fallbacks
- **Caching**: Browser caching and CDN optimization
- **Bundle Analysis**: Webpack bundle analyzer integration
- **Database**: Proper indexing and query optimization

## 🧪 Testing Strategy

```bash
# Unit Tests
npm run test:unit

# Integration Tests  
npm run test:integration

# E2E Tests
npm run test:e2e

# Coverage Report
npm run test:coverage
```

Testing includes:
- Component unit tests with React Testing Library
- API integration tests with Jest
- E2E tests with Cypress
- Visual regression tests with Chromatic

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run preview  # Test production build locally
```

### Docker Deployment
```bash
# Build container
docker build -t acme-patient-dashboard .

# Run container
docker run -p 8080:8080 acme-patient-dashboard
```

### CI/CD Pipeline
- **GitHub Actions** for automated testing and deployment
- **Quality Gates**: ESLint, TypeScript, and test coverage
- **Staging Environment**: Automatic deployment for testing
- **Production Deployment**: Manual approval with blue-green strategy

## 📝 Future Enhancements

- **Real-time Notifications**: WebSocket integration for shipment updates
- **Data Export**: PDF reports and CSV downloads
- **Appointment Scheduling**: Integration with calendar systems
- **Telehealth Integration**: Video consultation capabilities
- **Mobile App**: React Native version for iOS/Android
- **AI Insights**: Machine learning for health trend analysis

## 🤝 Contributing

This is a take-home challenge demonstration. For actual development:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is created for demonstration purposes as part of the Acme Corp technical challenge.

## 👥 Contact

For questions about this implementation:
- **Technical Questions**: Focus on architecture and implementation decisions
- **Design Questions**: Healthcare UI/UX patterns and accessibility
- **System Design**: Scalability, security, and performance considerations

---

**Built with ❤️ for Acme Corp Take-Home Challenge**
#   f r o n t e n d - a c m e  
 