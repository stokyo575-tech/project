# 🚀 Cara Jalankan WhiteGpt Locally

## Prerequisites
- Python 3.x terinstall
- Browser modern (Chrome, Firefox, Edge, Safari)
- Internet connection (untuk API)

---

## Step 1: Navigate to Project Folder

```bash
cd c:\Users\ASUS\Downloads\RianModss-main
```

---

## Step 2: Start Local Server

### Option A: Gunakan Python (Recommended)
```bash
python -m http.server 8000
```

### Option B: Gunakan Python 2 (Jika Python 3 tidak ada)
```bash
python -m SimpleHTTPServer 8000
```

**Expected Output**:
```
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
```

---

## Step 3: Buka di Browser

1. **Buka URL ini di browser**:
   ```
   http://localhost:8000
   ```

2. **Atau direct link**:
   - http://127.0.0.1:8000

3. **Jika ada redirect ke login**:
   - http://localhost:8000/src/pages/login.html

---

## Step 4: Login

**Default Test Credentials**:
- Username: `admin` atau `user`
- Password: Check di `config.js` atau localStorage

---

## 🎯 Test Features

### ✅ Test Thinking Display
1. Kirim message: "Halo"
2. Lihat: 🤔 Thinking muncul 1x (tidak dobel)
3. Tunggu: ~2 detik
4. Lihat: Response muncul dengan cepat

### ✅ Test File Upload
1. Klik tombol 📎 (file button di kiri)
2. Upload file: `.js`, `.py`, `.txt`, dll
3. Lihat: File preview muncul
4. Kirim message

### ✅ Test Voice Note
1. Klik tombol 🎤 (voice button di kanan)
2. Izinkan akses microphone
3. Bicara ke microphone
4. Klik tombol 🛑 untuk stop
5. Audio player muncul di chat

### ✅ Test New Chat
1. Kirim beberapa message
2. Klik tombol "Chat Baru" atau menu → "Chat Baru"
3. Lihat: Chat screen reset ke welcome
4. Chat sebelumnya tersimpan di history

### ✅ Test Sidebar
1. Klik tombol toggle ◀️ di kiri atas
2. Sidebar collapse menjadi icon-only
3. Klik lagi untuk expand

### ✅ Test Chat History
1. Klik tombol ⏱️ (History) di menu
2. Lihat: Daftar chat sebelumnya
3. Klik chat untuk load ulang

---

## 🛠️ Troubleshooting

### Masalah: Page blank / 404
**Solusi**:
- Pastikan sudah di folder project
- Check URL: `http://localhost:8000`
- Reload page (Ctrl+R)

### Masalah: File tidak terupload
**Solusi**:
- Periksa ukuran file (max sesuai limit)
- Format file harus didukung (.js, .py, .txt, dll)
- Check browser console (F12) untuk error

### Masalah: Microphone tidak bekerja
**Solusi**:
- Allow browser untuk akses microphone
- HTTPS atau localhost harus digunakan
- Check browser permission settings

### Masalah: Chat tidak tersimpan
**Solusi**:
- Check browser localStorage
- Pastikan 1-2 message sudah terkirim
- Reload page untuk verify

### Masalah: Thinking tidak hilang
**Solusi**:
- Refresh page (Ctrl+R)
- Check browser console untuk error
- Pastikan API key valid di `config.js`

---

## 📊 Check Console

**Buka Developer Tools** (F12) → Console tab untuk:
- Verify thinking animation (should be 150ms)
- Check API response status
- See any error messages
- Monitor performance

---

## 🔧 Config Files

Jika perlu ubah settings:

### API Keys - `apikey.js`
```javascript
window.CONFIG.API_KEYS = ['your-api-key-1', 'your-api-key-2'];
```

### System Prompt - `config.js`
```javascript
window.CONFIG.SYSTEM_PROMPT = 'Your custom prompt here...';
```

### Model Name - `config.js`
```javascript
window.CONFIG.MODEL_NAME = 'gemini-1.5-flash';
```

---

## 🌐 Deploy ke GitHub Pages (Optional)

**Settings sudah siap!**
- Repository: https://github.com/stokyo575-tech/project
- Akses live di: https://stokyo575-tech.github.io/project/

**Untuk enable GitHub Pages**:
1. Go to https://github.com/stokyo575-tech/project/settings/pages
2. Select Branch: `main`
3. Select Folder: `/ (root)`
4. Click Save
5. Wait 2-3 minutes for deployment

---

## 📁 Project Structure

```
root/
├── index.html              # Main page
├── config.js               # Configuration
├── apikey.js               # API keys
├── main.js                 # Main chat logic
│
├── src/
│   ├── js/
│   │   ├── thinking-ui.js           # Thinking display
│   │   ├── main-qwen-ui.js          # Qwen AI integration
│   │   ├── sidebar.js               # Sidebar logic
│   │   └── ... (10+ more files)
│   ├── css/
│   │   ├── thinking-ui.css          # Thinking styles
│   │   ├── style.css                # Main styles
│   │   └── ... (5+ more files)
│   └── pages/
│       ├── login.html               # Login page
│       ├── admin.html               # Admin panel
│       └── loading.html             # Loading screen
│
└── docs/                    # Documentation
    └── ... (30+ guide files)
```

---

## ✨ Quick Commands

```bash
# Start server
python -m http.server 8000

# View logs (in terminal where server running)
# Any errors/requests will show there

# Stop server
Ctrl + C

# Push changes to GitHub
git add .
git commit -m "Your message"
git push origin main
```

---

## 🎓 Tips & Tricks

1. **Auto-reload on file change**: Use VS Code Live Server extension
2. **Debug mode**: Open DevTools (F12) → Console to see logs
3. **Clear cache**: Ctrl+Shift+Delete to clear browser cache
4. **Test with VPN**: If API calls fail, might be blocked by region
5. **Use incognito**: To test without cookies/cache interference

---

## 📞 Support

Issues? Check:
- `FIXES_APPLIED.md` - What was fixed
- `README.md` - General info
- Browser console (F12) for errors
- GitHub issues: https://github.com/stokyo575-tech/project/issues

---

**Status**: ✅ Ready to run!

Silakan jalankan dengan: `python -m http.server 8000`

