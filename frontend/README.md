# Warehouse Inventory Management - Frontend

A modern React-based frontend for the Warehouse Inventory Management System.

## Features

- 🏭 Complete product management (CRUD operations)
- 📦 Transaction management with multi-item support
- 📊 Real-time inventory tracking and reporting
- 🔐 JWT-based authentication
- 📱 Responsive design with Tailwind CSS
- ⚙️ Environment-based configuration

## Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API running (see backend README)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Copy the example environment file:
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # Backend API Configuration
   VITE_API_URL=http://127.0.0.1:8000/api
   
   # Environment
   VITE_ENV=development
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## Environment Configuration

### Development
```env
VITE_API_URL=http://127.0.0.1:8000/api
VITE_ENV=development
```

### Production
```env
VITE_API_URL=https://your-production-api.com/api
VITE_ENV=production
```

### Staging
```env
VITE_API_URL=https://your-staging-api.com/api
VITE_ENV=staging
```

## Project Structure

```
src/
├── components/          # React components
│   ├── DashboardStats.jsx
│   ├── InventorySummary.jsx
│   ├── Login.jsx
│   ├── Navbar.jsx
│   ├── ProductForm.jsx
│   ├── ProductList.jsx
│   ├── ProtectedRoute.jsx
│   ├── Signup.jsx
│   ├── TransactionForm.jsx
│   └── TransactionList.jsx
├── config/             # Configuration files
│   └── index.js        # Environment and app configuration
├── services/           # API services
│   ├── api.js          # Base API functions
│   ├── auth.js         # Authentication services
│   ├── inventory.js    # Inventory reporting services
│   ├── products.js     # Product management services
│   └── transactions.js # Transaction management services
├── App.jsx             # Main app component
├── index.css           # Global styles
└── main.jsx            # App entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

The frontend uses a centralized configuration system for API endpoints:

### Configuration File (`src/config/index.js`)
```javascript
export const config = {
  API_URL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api",
  ENV: import.meta.env.VITE_ENV || "development",
  ENDPOINTS: {
    AUTH: {
      LOGIN: "/auth/login/",
      REGISTER: "/auth/register/",
      REFRESH: "/auth/refresh/",
    },
    PRODUCTS: "/products/",
    TRANSACTIONS: "/transactions/",
    // ... more endpoints
  }
};
```

### Usage in Services
```javascript
import { config } from "../config";

export async function getProducts() {
  return apiFetch(config.ENDPOINTS.PRODUCTS);
}
```

## Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables for Production
Make sure to set the correct environment variables in your production environment:

```env
VITE_API_URL=https://your-production-api.com/api
VITE_ENV=production
```

### Deployment Platforms

#### Vercel
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

#### Netlify
1. Connect your repository to Netlify
2. Set environment variables in Netlify dashboard
3. Build command: `npm run build`
4. Publish directory: `dist`

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## Troubleshooting

### Common Issues

1. **API Connection Error**
   - Check if backend server is running
   - Verify `VITE_API_URL` in `.env` file
   - Check CORS configuration in backend

2. **Build Errors**
   - Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
   - Check for missing environment variables

3. **Authentication Issues**
   - Clear browser localStorage
   - Check JWT token expiration
   - Verify backend authentication endpoints

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
