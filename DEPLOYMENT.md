# পাঠশালা ই-ম্যানেজার - ডিপ্লয়মেন্ট গাইড

## বর্তমান ডিপ্লয়মেন্ট স্ট্যাটাস

### স্ট্যাটিক ডিপ্লয়মেন্ট (ফ্রন্টএন্ড)
- **URL**: https://airrgpwqt2hy.space.minimax.io
- **স্ট্যাটাস**: ✅ ডিপ্লয় করা হয়েছে
- **ফাংশনালিটি**: ফ্রন্টএন্ড কাজ করছে, localStorage ফলব্যাক মোডে

### ডায়নামিক API সার্ভার
- **স্ট্যাটাস**: ⏳ আলাদা ডিপ্লয়মেন্ট প্রয়োজন
- **কারণ**: ডিপ্লয়মেন্ট টুল স্ট্যাটিক ফাইল হোস্টিং সাপোর্ট করে, Node.js সার্ভার সরাসরি রান করাতে পারে না

---

## সম্পূর্ণ ডায়নামিক ডিপ্লয়মেন্টের জন্য পদক্ষেপ

### অপশন ১: Railway.app (সুপারিশকৃত)

**সুবিধা**: বিনামূল্যে, সহজ সেটআপ, MongoDB সাপোর্ট

1. **Railway-এ অ্যাকাউন্ট তৈরি করুন**: https://railway.app

2. **GitHub রিপোজিটরি কানেক্ট করুন**:
   ```bash
   # প্রজেক্ট ফোল্ডারে Git init করুন
   cd /workspace/school-management-system
   git init
   git add .
   git commit -m "Initial commit"
   ```

3. **Railway-এ নতুন প্রজেক্ট তৈরি করুন**:
   - "New Project" → "Deploy from GitHub"
   - আপনার রিপোজিটরি সিলেক্ট করুন
   - "Configure" ক্লিক করে স্টার্ট কমান্ড সেট করুন: `cd server && node index.js`

4. **Environment Variables সেট করুন**:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/pathshala_sms
   JWT_SECRET=your-secret-key-here
   ```

5. **MongoDB যোগ করুন** (ঐচ্ছিক - ইন-মেমরি ডাটাবেস ডিফল্টে কাজ করবে):
   - "Add Plugin" → "MongoDB"
   - Railway会自动生成 MongoDB URI

**ডিপ্লয়মেন্টের পর**:
- API Base URL: `https://your-project.railway.app/api`
- ফ্রন্টএন্ড কনফিগারেশন আপডেট করুন

---

### অপশন ২: Render.com

**সুবিধা**: বিনামূল্যে টায়ার আছে, সহজ

1. **Render.com-এ সাইন আপ করুন**: https://render.com

2. **"Web Service" তৈরি করুন**:
   - Build Command: `npm install`
   - Start Command: `cd server && node index.js`

3. **Environment Variables যোগ করুন** (উপরের মতো)

---

### অপশন ৩: VPS/সার্ভার (ডিজিটাল ওশেন, AWS, ইত্যাদি)

**সার্ভার সেটআপ**:
```bash
# সার্ভারে লগইন করুন
ssh root@your-server-ip

# Node.js ইনস্টল করুন
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# PM2 ইনস্টল করুন (প্রোডাকশন ম্যানেজার)
npm install -g pm2

# প্রজেক্ট কপি করুন
git clone https://github.com/your-repo/pathshala-sms.git
cd pathshala-sms

# dependencies ইনস্টল করুন
cd server && npm install

# PM2 দিয়ে সার্ভার চালান
pm2 start server/index.js --name pathshala-api

# সার্ভার রিস্টার্টে অটো স্টার্ট
pm2 startup
pm2 save
```

**Nginx রিভার্স প্রক্সি সেটআপ**:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /var/www/pathshala-frontend;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## ফ্রন্টএন্ড API কনফিগারেশন আপডেট

ডায়নামিক API সার্ভার ডিপ্লয় করার পর, `js/api.js` ফাইল আপডেট করুন:

```javascript
const getBaseURL = () => {
    // আপনার API সার্ভার URL এখানে দিন
    const API_BASE_URL = 'https://your-api-server.com/api';
    return API_BASE_URL;
};

const API_CONFIG = {
    baseURL: getBaseURL(),
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
};
```

---

## সার্ভার বিহাইন্ড ক্লাউডফ্লেয়ার প্রক্সি (ঐচ্ছিক)

SSL এবং ক্যাশিংয়ের জন্য ক্লাউডফ্লেয়ার ব্যবহার করুন:

1. ক্লাউডফ্লেয়ারে ডোমেইন যোগ করুন
2. DNS রেকর্ড পয়েন্ট করুন:
   - `@` → A রেকর্ড → আপনার সার্ভার IP
   - `api` → A রেকর্ড → আপনার সার্ভার IP
3. SSL/TLS → "Full" মোড সিলেক্ট করুন

---

## ডাটাবেস ব্যাকআপ স্ট্র্যাটেজি

### MongoDB ব্যাকআপ (Railway/Atlas):
```bash
# MongoDB URI সহ dump
mongodump --uri="your-mongodb-uri" --out=/backup/pathshala

# restore
mongorestore --uri="your-mongodb-uri" /backup/pathshala
```

### সার্ভার ফাইল ব্যাকআপ:
```bash
# rsync ব্যবহার করে
rsync -avz server/data/ backup@remote-server:/backups/pathshala/
```

---

## মনিটরিং এবং লগিং

### PM2 মনিটরিং:
```bash
pm2 monit
pm2 logs pathshala-api
```

### Application Logs:
```bash
# সার্ভার লগ ফাইল
tail -f /var/log/pathshala/app.log
```

---

## সিকিউরিটি চেকলিস্ট

- [ ] JWT_SECRET পরিবর্তন করুন (ডিফল্ট ব্যবহার করবেন না)
- [ ] Admin পাসওয়ার্ড পরিবর্তন করুন (ডিফল্ট: admin123)
- [ ] HTTPS এনেবল করুন
- [ ] ফায়ারওয়াল কনফিগার করুন
- [ ] CORS সেটিংস চেক করুন (প্রোডাকশনে origin সীমাবদ্ধ করুন)

---

## সাপোর্ট এবং ট্রাবলশুটিং

**সাধারণ সমস্যা**:

1. **API কানেক্ট হচ্ছে না**:
   - সার্ভার চালু আছে কিনা চেক করুন
   - API URL সঠিক কিনা ভেরিফাই করুন
   - CORS সেটিংস চেক করুন

2. **ডাটা সেভ হচ্ছে না**:
   - MongoDB কানেকশন চেক করুন
   - ইন-মেমরি মোডে থাকলে ডাটা রিফ্রেশে মুছে যাবে

3. **লগইন কাজ করছে না**:
   - Token expire হয়ে যেতে পারে
   - JWT_SECRET কনফিগারেশন চেক করুন

---

## দ্রুত স্টার্ট গাইড (Railway)

```bash
# ১. Railway CLI ইনস্টল করুন
npm install -g @railway/cli

# ২. লগইন করুন
railway login

# ৩. প্রজেক্ট ফোল্ডারে যান
cd /workspace/school-management-system/server

# ৪. ডিপ্লয় করুন
railway init
railway up

# ৫. ডোমেইন পান
railway domain
```

এর পরে প্রাপ্ত ডোমেইন ব্যবহার করে API কনফিগারেশন আপডেট করুন।
