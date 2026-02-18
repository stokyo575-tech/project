# 🚀 WhiteGPT - GITHUB & LOCALHOST SETUP GUIDE

## ⚡ TLDR (30 Detik)

```bash
# 1. Clone & install
git clone <repo-url>
cd RianModss-main
npm install

# 2. Run localhost
npm start
# Buka: http://localhost:5000

# 3. Deploy ke GitHub Pages
npm run deploy
# Live di: https://username.github.io/RianModss-main
```

---

## 📁 FOLDER STRUCTURE (RAPI)

```
RianModss-main/
│
├── 📂 src/
│   ├── 📂 js/
│   │   ├── main.js              (Chat logic)
│   │   ├── thinking-ui.js       ✨ NEW (Qwen AI thinking)
│   │   ├── chat-logger.js       (Chat logging)
│   │   ├── sidebar.js           (Sidebar)
│   │   ├── auth.js              (Authentication)
│   │   └── utils/
│   │       ├── api-helper.js
│   │       └── storage.js
│   │
│   ├── 📂 css/
│   │   ├── style.css            (Main style)
│   │   ├── thinking-ui.css      ✨ NEW (Thinking style)
│   │   ├── sidebar.css          (Sidebar)
│   │   ├── animations.css       (Animations)
│   │   └── responsive.css       (Mobile)
│   │
│   └── 📂 pages/
│       ├── index.html           (Main page)
│       ├── login.html           (Login page)
│       └── admin.html           (Admin panel)
│
├── 📂 public/
│   ├── 📂 assets/
│   │   ├── 📂 icons/
│   │   ├── 📂 images/
│   │   └── manifest.json
│   │
│   └── favicon.ico
│
├── 📂 docs/
│   ├── API.md                   (API documentation)
│   ├── SETUP.md                 (Setup guide)
│   ├── GITHUB-DEPLOY.md         (GitHub Pages deploy)
│   └── LOCALHOST.md             (Localhost setup)
│
├── 📂 config/
│   ├── package.json             (Dependencies)
│   ├── .env.example             (Environment template)
│   ├── .env.local               (Local config)
│   └── vercel.json              (Vercel deploy)
│
├── 📄 index.html                (Root entry point)
├── 📄 package.json              (NPM config)
├── 📄 .gitignore                (Git ignore)
├── 📄 README.md                 ✨ (Main guide)
└── 📄 LICENSE
```

---

## 🏃 QUICK START (LOCALHOST)

### Step 1: Setup (First Time Only)

```bash
# Clone repository
git clone https://github.com/your-username/RianModss-main.git
cd RianModss-main

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local

# Install dev server
npm install -g live-server
# ATAU
npm install --save-dev live-server
```

### Step 2: Run Localhost

**Option A: Using npm script (Recommended)**
```bash
npm start
```

**Option B: Using live-server directly**
```bash
npx live-server --port=5000
```

**Option C: Python (if no Node.js)**
```bash
# Python 3
python -m http.server 5000

# Python 2
python -m SimpleHTTPServer 5000
```

### Step 3: Access

```
Open browser: http://localhost:5000
atau: http://127.0.0.1:5000
```

---

## 🎯 LOCALHOST DETAILED STEPS

### Dengan VS Code Live Server

```
1. Install extension: "Live Server"
2. Right-click index.html
3. Click "Open with Live Server"
4. Browser auto-open di port 5500
```

### Dengan Node.js (Recommended)

```bash
# Terminal
npm start

# Output:
# > live-server

# http://127.0.0.1:5000
# Hit CTRL-C to stop the server
```

### Troubleshoot Localhost

```bash
# Port sudah terpakai?
lsof -i :5000  # Cek port
kill -9 <PID>   # Kill process

# Dependencies error?
rm -rf node_modules package-lock.json
npm install

# Cache issue?
npx live-server --port=5000 --no-css-inject
```

---

## 🚀 DEPLOY KE GITHUB PAGES

### Step 1: Setup GitHub Pages

```bash
# 1. Push ke GitHub
git add .
git commit -m "Initial commit"
git push origin main

# 2. Di GitHub:
#    - Go to: Settings > Pages
#    - Source: Deploy from a branch
#    - Branch: main, root folder
#    - Save
```

### Step 2: Automatic Deploy

```bash
# NPM script
npm run deploy

# Manual
# 1. Buat gh-pages branch
# 2. Push ke gh-pages branch
```

### Step 3: Access Live

```
https://username.github.io/RianModss-main
```

---

## 📦 PACKAGE.JSON SCRIPTS

```json
{
  "name": "whitegpt-qwen-ai",
  "version": "1.0.0",
  "scripts": {
    "start": "live-server --port=5000",
    "dev": "live-server --port=5000 --no-css-inject",
    "deploy": "gh-pages -d . -b gh-pages",
    "build": "echo 'Build ready'",
    "test": "echo 'Tests ready'"
  },
  "devDependencies": {
    "live-server": "^1.2.2",
    "gh-pages": "^4.0.0"
  }
}
```

---

## 🌐 GITHUB DEPLOYMENT OPTIONS

### Option 1: GitHub Pages (FREE, Recommended)
```bash
npm install -g gh-pages
npm run deploy
# Live: https://username.github.io/RianModss-main
```

### Option 2: Vercel (FREE + Advanced)
```bash
# 1. Vercel CLI
npm i -g vercel

# 2. Deploy
vercel
# Live: https://whitegpt.vercel.app
```

### Option 3: Netlify (FREE + Easy)
```bash
# 1. Netlify CLI
npm install -g netlify-cli

# 2. Deploy
netlify deploy --prod
# Live: https://whitegpt.netlify.app
```

---

## 📝 ENVIRONMENT SETUP

### .env.example
```env
# Backend API
REACT_APP_API_URL=http://localhost:3000
REACT_APP_API_TIMEOUT=5000

# Features
REACT_APP_ENABLE_LOGGING=true
REACT_APP_LOG_LEVEL=debug

# GitHub Pages
HOMEPAGE=https://username.github.io/RianModss-main
```

### .env.local (Don't commit!)
```env
REACT_APP_API_URL=http://localhost:3000
REACT_APP_ENABLE_LOGGING=true
```

---

## 🔧 BACKEND SETUP (Optional)

### Node.js Backend

```bash
# Terminal 1: Frontend
npm start

# Terminal 2: Backend
cd backend
npm install
npm start
# Runs on http://localhost:3000
```

### Backend Files

```bash
backend/
├── server.js
├── .env
├── package.json
├── logs/
└── chats/
```

---

## 🐛 TROUBLESHOOTING

### "Port already in use"
```bash
# Linux/Mac
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### "Module not found"
```bash
npm install
# atau
npm ci --force
```

### "GitHub Pages not updating"
```bash
# 1. Clear cache
npm cache clean --force

# 2. Force push
git push origin main --force

# 3. Check GitHub Pages setting
# Settings > Pages > Check "Enforce HTTPS"
```

### "CORS Error"
```javascript
// di index.html
// Add proxy di development
// Or use CORS proxy service
```

---

## 🎯 PRODUCTION CHECKLIST

- [ ] GitHub repo setup
- [ ] GitHub Pages enabled
- [ ] Domain custom (optional)
- [ ] HTTPS enabled
- [ ] Environment variables set
- [ ] Backend deployed (if needed)
- [ ] Testing complete
- [ ] Monitoring setup
- [ ] Backup configured

---

## 📊 FILE ORGANIZATION

### Sebelum (Berantakan)
```
RianModss-main/
├── admin.css
├── admin.html
├── admin.js
├── main.js
├── index.html
├── style.css
├── sidebar.js
├── ...15+ files
└── chaos.md
```

### Sesudah (Rapi)
```
RianModss-main/
├── src/
│   ├── js/ (all JS files)
│   ├── css/ (all CSS files)
│   └── pages/ (HTML files)
├── public/ (static assets)
├── docs/ (documentation)
├── config/ (config files)
└── index.html (entry point)
```

---

## 🚀 DEPLOYMENT WORKFLOW

```
Local Development
       ↓
git push origin main
       ↓
GitHub Pages Auto-Deploy
       ↓
https://username.github.io/RianModss-main
       ↓
LIVE! ✨
```

---

## 📈 PERFORMANCE OPTIMIZATION

```bash
# Minify CSS/JS (Optional)
npm install -g terser

# Compress images
npm install -g imagemin

# Build optimized
npm run build
```

---

## 🔐 SECURITY

```bash
# Scanning dependencies
npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies
npm update
```

---

## 📞 QUICK COMMANDS

```bash
# Development
npm start               # Run localhost

# Deployment
npm run deploy         # Deploy ke GitHub Pages
vercel                 # Deploy ke Vercel
netlify deploy --prod  # Deploy ke Netlify

# Maintenance
npm install            # Install deps
npm update            # Update packages
npm audit             # Check security
rm -rf node_modules   # Clean install
```

---

## 🎓 USEFUL RESOURCES

- [Live Server Docs](https://github.com/tapio/live-server)
- [GitHub Pages](https://pages.github.com/)
- [Vercel Deploy](https://vercel.com/)
- [Netlify Deploy](https://netlify.com/)

---

## 🎉 YOU'RE SET!

**Localhost Ready:** ✅ `npm start`  
**GitHub Pages Ready:** ✅ `npm run deploy`  
**Folder Structure:** ✅ Clean & organized  
**Qwen AI Theme:** ✅ Complete with thinking UI

---

**Last Updated:** 2025-02-19  
**Status:** ✅ Production Ready  
**Ready to deploy!** 🚀
