# 🏺 Chinese Porcelain Gallery

A modern, responsive web application showcasing traditional Chinese porcelain masterpieces with an elegant admin management system.

![Porcelain Gallery](https://img.shields.io/badge/Status-Live-brightgreen)
![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6)
![Node.js](https://img.shields.io/badge/Node.js-18.x-339933)

## ✨ Features

### 🎨 Frontend Features
- **Responsive Design**: Beautiful, mobile-first design with Tailwind CSS
- **Multi-language Support**: English and Chinese (中文) localization
- **Interactive Gallery**: Dynamic product showcase with filtering and pagination
- **Admin Panel**: Complete content management system
- **Image Optimization**: Unified image processing with lazy loading
- **Modern UI/UX**: Smooth animations and transitions

### 🛠️ Backend Features
- **RESTful API**: Clean API endpoints for products and admin operations
- **File Upload**: Image and media management system
- **Database Integration**: SQLite database with schema management
- **Admin Authentication**: Secure admin access control

### 📱 Pages & Sections
- **Homepage**: Hero section, best sellers, dynasty collection, heritage story
- **Products Page**: Filterable product gallery with search functionality
- **Product Details**: Detailed product information with image galleries
- **Admin Dashboard**: Complete content management interface
- **Cart System**: Shopping cart functionality (ready for e-commerce integration)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/luckycn9527/tea-web.git
   cd tea-web
   ```

2. **Install backend dependencies**
   ```bash
   cd porcelain-gallery/backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**
   ```bash
   # Create .env file in frontend directory
   echo "VITE_API_BASE_URL=http://localhost:3000" > .env
   ```

5. **Start the development servers**
   ```bash
   # Terminal 1: Start backend server
   cd porcelain-gallery/backend
   npm start

   # Terminal 2: Start frontend development server
   cd porcelain-gallery/frontend
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - Admin Panel: http://localhost:5173/admin

## 🏗️ Project Structure

```
tea-web/
├── porcelain-gallery/
│   ├── backend/                 # Node.js + Express backend
│   │   ├── database/            # SQL schemas and sample data
│   │   ├── routes/              # API routes
│   │   ├── uploads/             # File upload directory
│   │   └── server.js            # Main server file
│   │
│   └── frontend/                # Vue.js + TypeScript frontend
│       ├── src/
│       │   ├── components/      # Reusable Vue components
│       │   ├── views/          # Page components
│       │   ├── stores/         # Pinia state management
│       │   ├── config/         # Configuration files
│       │   ├── assets/         # Static assets (images, styles)
│       │   ├── router/         # Vue Router configuration
│       │   └── i18n/           # Internationalization
│       ├── public/             # Public static files
│       └── package.json        # Frontend dependencies
│
├── .gitignore                  # Git ignore rules
└── README.md                   # This file
```

## 🎯 Key Technologies

### Frontend Stack
- **Vue.js 3**: Progressive JavaScript framework
- **TypeScript**: Type-safe JavaScript
- **Pinia**: State management for Vue
- **Vue Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast build tool and dev server

### Backend Stack
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **SQLite**: Lightweight database
- **Multer**: File upload handling

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Static type checking

## 📱 Admin Panel Features

The admin panel provides comprehensive content management:

### Product Management
- ✅ Add/Edit/Delete products
- ✅ Upload product images
- ✅ Set product details (price, dimensions, dynasty, etc.)
- ✅ Manage product categories and tags

### Content Management
- ✅ Edit homepage sections (Best Sellers, Dynasty Collection, Heritage Story)
- ✅ Manage dynasty information and images
- ✅ Update site settings and content

### Media Library
- ✅ Upload and manage images
- ✅ Organize media files
- ✅ Bulk upload functionality

## 🌐 Deployment

### Production Deployment

1. **Build the frontend**
   ```bash
   cd porcelain-gallery/frontend
   npm run build
   ```

2. **Set production environment**
   ```bash
   echo "VITE_API_BASE_URL=https://your-domain.com" > .env.production
   ```

3. **Deploy backend**
   - Deploy to platforms like Heroku, Vercel, or DigitalOcean
   - Set up database (PostgreSQL recommended for production)
   - Configure environment variables

4. **Deploy frontend**
   - Deploy to Vercel, Netlify, or GitHub Pages
   - Configure build settings and environment variables

### Docker Deployment (Optional)

```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔧 Configuration

### Environment Variables

**Frontend (.env)**
```env
VITE_API_BASE_URL=http://localhost:3000
```

**Backend (.env)**
```env
PORT=3000
NODE_ENV=development
DATABASE_URL=./database.sqlite
```

### Database Setup

The application uses SQLite by default. For production, consider:
- PostgreSQL
- MySQL
- MongoDB

## 📊 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Admin
- `POST /api/admin/upload` - Upload images
- `GET /api/admin/media` - Get media library
- `DELETE /api/admin/media/:id` - Delete media file

## 🎨 Customization

### Adding New Product Categories
1. Update the database schema
2. Add new dynasty/shape options in admin panel
3. Update frontend filtering logic

### Styling Customization
- Modify Tailwind CSS classes
- Update color scheme in `tailwind.config.js`
- Customize component styles

### Adding New Languages
1. Add translation files in `src/i18n/`
2. Update language switcher component
3. Add new locale to router configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Traditional Chinese porcelain artisans and their timeless craftsmanship
- Vue.js and TypeScript communities for excellent documentation
- Tailwind CSS for beautiful, utility-first styling

## 📞 Support

If you have any questions or need help:

- 📧 Email: [your-email@example.com]
- 🐛 Issues: [GitHub Issues](https://github.com/luckycn9527/tea-web/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/luckycn9527/tea-web/discussions)

---

**Made with ❤️ for preserving and showcasing Chinese cultural heritage**

![Chinese Porcelain](https://img.shields.io/badge/Heritage-Chinese%20Porcelain-red)
![Culture](https://img.shields.io/badge/Culture-Traditional%20Arts-gold)
