# 📚 Documentation Index

Selamat datang di dokumentasi lengkap WhatsApp Numbers Management System! Berikut adalah panduan untuk mengakses semua dokumentasi yang tersedia.

## 🚀 Quick Start
Untuk memulai dengan cepat:
1. Baca [README.md](../README.md) - Overview dan quick start
2. Ikuti [Installation Guide](./INSTALLATION.md) - Setup lengkap
3. Baca [API Documentation](./API.md) - Panduan API

## 📖 Dokumentasi Lengkap

### 🏗️ **Core Documentation**
| Dokumen | Deskripsi | Target Audience |
|---------|-----------|-----------------|
| [📄 README.md](../README.md) | Overview project, fitur utama, quick start | Semua pengguna |
| [⚙️ Installation Guide](./INSTALLATION.md) | Panduan instalasi lengkap untuk semua environment | Developer, DevOps |
| [🔧 Configuration Guide](./CONFIGURATION.md) | Konfigurasi environment, database, security | System Admin |

### 🔌 **API & Backend**
| Dokumen | Deskripsi | Target Audience |
|---------|-----------|-----------------|
| [📡 API Documentation](./API.md) | Complete API reference dengan contoh | Frontend Developer, Tester |
| [🗄️ Database Schema](./DATABASE.md) | Schema database, queries, optimization | Database Admin, Backend Developer |

### 🎨 **Frontend & UI**
| Dokumen | Deskripsi | Target Audience |
|---------|-----------|-----------------|
| [🎨 Components Guide](./COMPONENTS.md) | React components, styling, state management | Frontend Developer |

### 🚀 **Deployment & Operations**
| Dokumen | Deskripsi | Target Audience |
|---------|-----------|-----------------|
| [🚀 Deployment Guide](./DEPLOYMENT.md) | Deployment untuk VPS, Docker, Cloud, K8s | DevOps, System Admin |

### 📋 **Project Management**
| Dokumen | Deskripsi | Target Audience |
|---------|-----------|-----------------|
| [📋 Changelog](../CHANGELOG.md) | Riwayat perubahan dan versi | Product Manager, Developer |

---

## 🎯 Berdasarkan Peran

### 👨‍💻 **Untuk Developer**
**Baru memulai?**
1. [README.md](../README.md) - Pahami project overview
2. [Installation Guide](./INSTALLATION.md) - Setup development environment
3. [API Documentation](./API.md) - Pelajari API endpoints
4. [Components Guide](./COMPONENTS.md) - Pahami struktur frontend

**Sudah familiar?**
- [Database Schema](./DATABASE.md) - Deep dive database
- [Configuration Guide](./CONFIGURATION.md) - Advanced configuration
- [Changelog](../CHANGELOG.md) - Track perubahan terbaru

### 🛡️ **Untuk System Administrator**
**Setup Production:**
1. [Installation Guide](./INSTALLATION.md) - System requirements
2. [Configuration Guide](./CONFIGURATION.md) - Security & performance
3. [Deployment Guide](./DEPLOYMENT.md) - Production deployment
4. [Database Schema](./DATABASE.md) - Database management

**Monitoring & Maintenance:**
- [API Documentation](./API.md) - Health check endpoints
- [Deployment Guide](./DEPLOYMENT.md) - Monitoring setup

### 📊 **Untuk Product Manager**
**Project Overview:**
1. [README.md](../README.md) - Features dan capabilities
2. [Changelog](../CHANGELOG.md) - Roadmap dan versi history
3. [API Documentation](./API.md) - Technical capabilities

### 🧪 **Untuk Tester**
**Testing Resources:**
1. [API Documentation](./API.md) - Complete API reference
2. [Installation Guide](./INSTALLATION.md) - Setup test environment
3. Test scripts di root folder: `testAPI.js`, `testBulkImport.js`

---

## 🔍 Pencarian Cepat

### **Mencari informasi tentang...**

#### 📱 **Phone Number Formats**
- [API Documentation](./API.md#phone-number-normalization) - Format yang didukung
- [README.md](../README.md#-format-nomor-telepon-yang-didukung) - Contoh format

#### ⚡ **Performance**
- [Database Schema](./DATABASE.md#performance-optimization) - Database optimization
- [Configuration Guide](./CONFIGURATION.md#performance-optimization) - App optimization
- [Deployment Guide](./DEPLOYMENT.md#performance-optimization) - Production optimization

#### 🔒 **Security**
- [Configuration Guide](./CONFIGURATION.md#security-configuration) - Security setup
- [Deployment Guide](./DEPLOYMENT.md#security-considerations) - Production security
- [Installation Guide](./INSTALLATION.md#security-hardening) - Security hardening

#### 🐳 **Docker**
- [Deployment Guide](./DEPLOYMENT.md#docker-deployment) - Complete Docker setup
- [Installation Guide](./INSTALLATION.md#using-docker-alternative) - Docker development

#### ☸️ **Kubernetes**
- [Deployment Guide](./DEPLOYMENT.md#kubernetes-deployment) - K8s manifests
- [Configuration Guide](./CONFIGURATION.md) - Environment configuration

#### 📊 **Database**
- [Database Schema](./DATABASE.md) - Complete database documentation
- [Installation Guide](./INSTALLATION.md#setup-postgresql-database) - Database setup
- [Configuration Guide](./CONFIGURATION.md#database-configuration) - Database config

---

## 📱 **Contoh Use Cases**

### **Saya ingin...**

#### 🚀 **"Setup development environment"**
1. [Installation Guide](./INSTALLATION.md#step-by-step-installation)
2. [Configuration Guide](./CONFIGURATION.md#environment-variables)
3. Run: `npm install && npm run seed && npm start`

#### 🔄 **"Import 1000 phone numbers"**
1. [API Documentation](./API.md#bulk-import-phone-numbers) - Bulk import API
2. [Components Guide](./COMPONENTS.md#bulkimport-component) - Frontend bulk import
3. Run: `npm run test-bulk` untuk testing

#### 🌐 **"Deploy to production"**
1. [Deployment Guide](./DEPLOYMENT.md#traditional-vpsserver-deployment)
2. [Configuration Guide](./CONFIGURATION.md#production-environment-variables)
3. [Installation Guide](./INSTALLATION.md#production-deployment)

#### 🔍 **"Add new API endpoint"**
1. [API Documentation](./API.md) - Understand existing patterns
2. [Database Schema](./DATABASE.md) - Database operations
3. [Components Guide](./COMPONENTS.md#api-service) - Frontend integration

#### 🎨 **"Customize frontend UI"**
1. [Components Guide](./COMPONENTS.md#styling-system) - Styling guide
2. [Configuration Guide](./CONFIGURATION.md#frontend-configuration) - Frontend config
3. Lihat `/frontend/src/styles/` untuk CSS variables

---

## 🛠️ **Tools & Scripts**

### **Available Scripts**
```bash
# Backend
npm start          # Start production server
npm run dev        # Start development server  
npm run seed       # Seed database with categories
npm test           # Test all API endpoints
npm run test-bulk  # Test bulk import functionality

# Frontend
cd frontend
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

### **Useful Commands**
```bash
# Health check
curl http://localhost:3000/api/health

# Get categories
curl http://localhost:3000/api/categories

# Test bulk import
npm run test-bulk

# Database backup
pg_dump -U wa_user -d wa_db > backup.sql
```

---

## 🆘 **Troubleshooting**

### **Common Issues**
| Issue | Solution | Documentation |
|-------|----------|---------------|
| Database connection error | Check .env credentials | [Installation Guide](./INSTALLATION.md#troubleshooting) |
| Port 3000 in use | Change PORT in .env | [Configuration Guide](./CONFIGURATION.md#server-configuration) |
| Frontend build errors | Clear cache, reinstall | [Installation Guide](./INSTALLATION.md#frontend-build-issues) |
| CORS errors | Check CORS_ORIGIN | [Configuration Guide](./CONFIGURATION.md#cors-configuration) |
| Phone validation fails | Check format support | [API Documentation](./API.md#phone-number-normalization) |

### **Getting Help**
- 📖 Check this documentation index
- 🐛 [GitHub Issues](https://github.com/your-repo/issues) untuk bug reports
- 📧 Email: support@whatsapp-numbers.com
- 💬 Community Discord (link in README)

---

## 📝 **Contributing to Documentation**

### **Improving Documentation**
1. Fork repository
2. Edit documentation files in `/docs/`
3. Follow [markdown style guide](https://www.markdownguide.org/)
4. Submit pull request

### **Documentation Standards**
- Use clear, concise language
- Include code examples
- Add screenshots for UI features
- Update index when adding new docs
- Test all code examples

---

## 🏷️ **Tags & Labels**

**Difficulty Levels:**
- 🟢 **Beginner**: Basic setup dan usage
- 🟡 **Intermediate**: Configuration dan customization  
- 🔴 **Advanced**: Deployment dan scaling

**Categories:**
- 📱 **Phone Numbers**: Format, validation, import
- 🗄️ **Database**: Schema, queries, optimization
- 🎨 **Frontend**: Components, styling, UX
- 🔧 **Configuration**: Environment, security
- 🚀 **Deployment**: Production, scaling
- 🧪 **Testing**: API testing, validation

---

**📌 Bookmark halaman ini untuk akses cepat ke semua dokumentasi!**

*Last updated: January 1, 2024*