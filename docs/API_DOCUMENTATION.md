# পাঠশালা ই-ম্যানেজার এপিআই ডকুমেন্টেশন

## ওভারভিউ

পাঠশালা ই-ম্যানেজার এখন সম্পূর্ণ ডাইনামিক মোড সাপোর্ট করে। এই ডকুমেন্টেশনে ব্যাকএন্ড এপিআই এবং ফ্রন্টএন্ড ইন্টিগ্রেশন সম্পর্কে বিস্তারিত তথ্য দেওয়া হয়েছে। পূর্বে সিস্টেমটি শুধুমাত্র লোকাল স্টোরেজ ব্যবহার করত যার ফলে ডেটা শুধুমাত্র একটি ব্রাউজারে সংরক্ষিত থাকত এবং মাল্টি-ডিভাইস সাপোর্ট ছিল না। এখন নতুন আর্কিটেকচারে রেস্টফুল এপিআই এবং মঙ্গোডিবি ডাটাবেস ব্যবহার করা হচ্ছে যা আধুনিক স্কুল ম্যানেজমেন্ট সিস্টেমের সকল প্রয়োজনীয়তা পূরণ করে। এই ডকুমেন্টেশনটি ডেভেলপার এবং সিস্টেম অ্যাডমিনিস্ট্রেটরদের জন্য তৈরি করা হয়েছে যাতে তারা সিস্টেমটি সহজে বুঝতে এবং কাস্টমাইজ করতে পারেন।

## সিস্টেম আর্কিটেকচার

### প্রযুক্তি স্ট্যাক

সিস্টেমটির ব্যাকএন্ড নোডজেস এক্সপ্রেস ফ্রেমওয়ার্ক ব্যবহার করে তৈরি যা মডার্ন জাভাস্ক্রিপ্ট রানটাইমের উপর ভিত্তি করে কাজ করে। ডাটাবেস হিসেবে মঙ্গোডিবি নোএসকিউএল ডাটাবেস ব্যবহার করা হয়েছে যা ফ্লেক্সিবল স্কিমা এবং স্কেলেবল আর্কিটেকচার প্রদান করে। ফ্রন্টএন্ড পার্শিয়ালি স্ট্যাটিক HTML/CSS/JavaScript দিয়ে তৈরি এবং এখন এপিআই ক্লায়েন্টের মাধ্যমে ব্যাকএন্ডের সাথে যুক্ত। এই আর্কিটেকচারের মূল সুবিধা হলো ক্লায়েন্ট এবং সার্ভার সম্পূর্ণ সেপারেট থাকায় যেকোনো প্ল্যাটফর্ম থেকে এপিআই অ্যাক্সেস করা সম্ভব এবং মোবাইল অ্যাপ বা অন্যান্য ক্লায়েন্ট তৈরি করা যাবে।

```
┌─────────────────────────────────────────────────────────────────┐
│                      ফ্রন্টএন্ড (Admin Panel)                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐   │
│  │ admin.html  │  │ students.html │  │   api.js + data-manager.js │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │ REST API Calls
┌────────────────────────────▼────────────────────────────────────┐
│                      ব্যাকএন্ড সার্ভার                            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   Node.js + Express                      │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐   │   │
│  │  │ Auth Routes │  │ API Routes  │  │  MongoDB Model  │   │   │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘   │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                      ডাটাবেস                                     │
│                  MongoDB Atlas / Local                          │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────────┐    │
│  │ Students  │ │ Teachers  │ │  Classes  │ │   Fees/More   │    │
│  └───────────┘ └───────────┘ └───────────┘ └───────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### এপিআই বেস ইউআরএল

সার্ভার লোকালহোস্টে চালু থাকলে এপিআই বেস ইউআরএল হবে `http://localhost:3000/api`। প্রোডাকশন এনভায়রনমেন্টে এই ইউআরএল আপনার ডোমেইন অনুযায়ী পরিবর্তন করতে হবে। এপিআই কনফিগারেশন ফাইল `js/api.js` এ পাওয়া যাবে যেখানে `API_CONFIG` অবজেক্টে বেস ইউআরএল এবং অন্যান্য সেটিংস পরিবর্তন করা যাবে। সার্ভার ডিপ্লয় করার পর এই কনফিগারেশন আপডেট করতে ভুলবেন না।

## এপিআই ক্লায়েন্ট ব্যবহার গাইড

### প্রাথমিক সেটআপ

এপিআই ক্লায়েন্ট ব্যবহার করতে হলে প্রথমে আপনার HTML ফাইলে প্রয়োজনীয় স্ক্রিপ্ট ফাইলগুলো যোগ করতে হবে। নিচের কোড স্নিপেটটি দেখুন যেখানে api.js এবং data-manager.js ফাইলগুলো সঠিক ক্রমে যোগ করা হয়েছে। স্ক্রিপ্ট ফাইলগুলো বডি ট্যাগের শেষে যোগ করা উচিত যাতে পেজ লোডের সময় ডম এলিমেন্ট আগে রেডি হয়।

```html
<!-- এপিআই ক্লায়েন্ট স্ক্রিপ্ট -->
<script src="js/api.js"></script>
<script src="js/data-manager.js"></script>
```

### অথেনটিকেশন

অথেনটিকেশন মডিউলে লগইন, রেজিস্ট্রেশন এবং প্রোফাইল ম্যানেজমেন্টের জন্য মেথড রয়েছে। লগইন করার পর সার্ভার থেকে একটি JWT টোকেন পাওয়া যায় যা পরবর্তী সকল রিকোয়েস্টের হেডারে অটোমেটিক্যালি যুক্ত হয়। টোকেন লোকাল স্টোরেজে সংরক্ষিত হয় এবং ব্রাউজার রিফ্রেশেও থাকে। সেশন ম্যানেজমেন্টের জন্য সার্ভার সাইড ভ্যালিডেশনও করা হয়।

```javascript
// লগইন করুন
async function login() {
    try {
        const user = await API.auth.login('admin@pathshala.edu.bd', 'password123');
        console.log('লগইন সফল:', user);
        return user;
    } catch (error) {
        console.error('লগইন ব্যর্থ:', error.message);
    }
}

// প্রোফাইল আপডেট করুন
async function updateProfile() {
    try {
        const updated = await API.auth.updateProfile({
            name: 'নতুন নাম',
            phone: '+8801234567890'
        });
        console.log('প্রোফাইল আপডেট হয়েছে:', updated);
    } catch (error) {
        console.error('আপডেট ব্যর্থ:', error.message);
    }
}

// লগআউট করুন
async function logout() {
    await API.auth.logout();
    window.location.href = 'login.html';
}
```

### ক্রুড অপারেশন

সকল এনটিটির জন্য স্ট্যান্ডার্ড ক্রুড অপারেশন (ক্রিয়েট, রিড, আপডেট, ডিলিট) সাপোর্ট করা হয়। প্রতিটি অপারেশন অ্যাসিঙ্ক্রোনাস এবং প্রমিস-বেসড যাতে মডার্ন জাভাস্ক্রিপ্টের async/await সিনট্যাক্স ব্যবহার করা যায়। এরর হ্যান্ডলিং ট্রাই-ক্যাচ ব্লকের মাধ্যমে করা হয় এবং ব্যর্থ রিকোয়েস্টের ক্ষেত্রে সঠিক এরর মেসেজ দেখানো হয়।

```javascript
// সকল শিক্ষার্থী পড়ুন
async function getAllStudents() {
    try {
        const students = await API.students.getAll();
        return students;
    } catch (error) {
        console.error('শিক্ষার্থী লোড ব্যর্থ:', error.message);
        return [];
    }
}

// আইডি দিয়ে শিক্ষার্থী পড়ুন
async function getStudentById(id) {
    try {
        const student = await API.students.getById(id);
        return student;
    } catch (error) {
        console.error('শিক্ষার্থী পাওয়া যায়নি:', error.message);
        return null;
    }
}

// নতুন শিক্ষার্থী তৈরি করুন
async function addStudent(studentData) {
    try {
        const newStudent = await API.students.create(studentData);
        console.log('শিক্ষার্থী যোগ হয়েছে:', newStudent);
        return newStudent;
    } catch (error) {
        console.error('শিক্ষার্থী যোগ ব্যর্থ:', error.message);
        return null;
    }
}

// শিক্ষার্থী আপডেট করুন
async function updateStudent(id, updates) {
    try {
        const updated = await API.students.update(id, updates);
        console.log('শিক্ষার্থী আপডেট হয়েছে:', updated);
        return updated;
    } catch (error) {
        console.error('আপডেট ব্যর্থ:', error.message);
        return null;
    }
}

// শিক্ষার্থী মুছুন
async function removeStudent(id) {
    try {
        await API.students.delete(id);
        console.log('শিক্ষার্থী মুছে ফেলা হয়েছে');
        return true;
    } catch (error) {
        console.error('মুছে ফেলা ব্যর্থ:', error.message);
        return false;
    }
}
```

### সার্চ এবং ফিল্টারিং

ডেটা সার্চ এবং ফিল্টার করার জন্য বিশেষ মেথড রয়েছে যা সার্ভার-সাইড প্রসেসিং করে। সার্চ অপারেশনে মাল্টিপল ফিল্ড ম্যাচ করা হয় যেমন নাম, আইডি, এবং অভিভাবকের নাম। প্যারামিটার দিয়ে ফিল্টারিং করা যায় যেমন ক্লাস আইডি বা সেকশন অনুযায়ী ডেটা ফিল্টার করা।

```javascript
// শিক্ষার্থী সার্চ করুন
async function searchStudents(query) {
    try {
        const results = await API.students.search(query);
        return results;
    } catch (error) {
        console.error('সার্চ ব্যর্থ:', error.message);
        return [];
    }
}

// ক্লাস অনুযায়ী শিক্ষার্থী
async function getStudentsByClass(classId, section = null) {
    try {
        const students = await API.students.getByClass(classId, section);
        return students;
    } catch (error) {
        console.error('শিক্ষার্থী লোড ব্যর্থ:', error.message);
        return [];
    }
}

// সকল ক্লাস পড়ুন
async function getAllClasses() {
    try {
        const classes = await API.classes.getAll();
        return classes;
    } catch (error) {
        console.error('ক্লাস লোড ব্যর্থ:', error.message);
        return [];
    }
}
```

## ডেটা ম্যানেজার ব্যবহার

### হাইব্রিড মোড

DataManager একটি ইউনিফাইড ইন্টারফেস যা অটোমেটিক্যালি API বা স্টোরেজ মোড নির্বাচন করে। সার্ভার অনলাইন থাকলে এপিআই ব্যবহার করে, অন্যথায় স্টোরেজ মোডে চলে যায়। এই হাইব্রিড অ্যাপ্রোচে পূর্বে লেখা কোড সামান্য পরিবর্তনে কাজ করবে এবং অফলাইন ফাংশনালিটি বজায় থাকবে। এটি বিশেষভাবে উপকারী যখন ইন্টারনেট কানেকশন অস্থির।

```javascript
// ডেটা ম্যানেজার ইনিশিয়ালাইজ করুন
async function initializeApp() {
    await DataManager.init({
        mode: 'hybrid',      // 'api', 'storage', or 'hybrid'
        useAPIFirst: true    // API আগে চেষ্টা করবে
    });
    
    console.log('বর্তমান মোড:', DataManager.mode);
}

// সার্বজনীন CRUD অপারেশন
async function universalCrud() {
    // পড়ুন
    const students = await DataManager.get('students');
    
    // আইডি দিয়ে পড়ুন
    const student = await DataManager.getById('students', 'id');
    
    // তৈরি করুন
    await DataManager.create('students', { name: 'নতুন' });
    
    // আপডেট করুন
    await DataManager.update('students', 'id', { name: 'আপডেটেড' });
    
    // মুছুন
    await DataManager.delete('students', 'id');
    
    // ড্যাশবোর্ড স্ট্যাটিস
    const stats = await DataManager.getDashboardStats();
    
    // সার্চ
    const results = await DataManager.search('students', 'কুয়ারি');
    
    // ক্লাস অনুযায়ী
    const classStudents = await DataManager.getByClass('students', 1, 'ক');
}
```

### অফলাইন সাপোর্ট

OfflineHandler অটোমেটিক্যালি নেটওয়ার্ক স্ট্যাটাস মনিটর করে এবং অফলাইন হলে ডেটা সিঙ্ক কিউতে রাখে। ইন্টারনেট পুনরুদ্ধার হলে স্বয়ংক্রিয়ভাবে পেন্ডিং অপারেশনগুলো এগজিকিউট করে। এই ফিচারটি বিশেষভাবে গুরুত্বপূর্ণ যখন ব্যবহারকারীরা অনলাইন এবং অফলাইন উভয় মোডে কাজ করেন।

```javascript
// অফলাইন হ্যান্ডলার ইনিশিয়ালাইজ করুন
OfflineHandler.init();

// অপারেশন কিউতে যোগ করুন (অফলাইন হলে)
const result = OfflineHandler.handleRequest({
    entity: 'students',
    action: 'create',
    data: studentData
});

// ফেইলড অপারেশন পুনরায় চেষ্টা করুন
DataSync.retryFailedOperations();
```

## এন্ডপয়েন্ট রেফারেন্স

### স্টুডেন্টস এন্ডপয়েন্ট

শিক্ষার্থী ম্যানেজমেন্টের জন্য সম্পূর্ণ CRUD অপারেশন সাপোর্ট করা হয়। এছাড়াও ইমপোর্ট এবং এক্সপোর্ট ফাংশনালিটি রয়েছে যা CSV ফাইল থেকে বাল্ক ডেটা ইমপোর্ট এবং ডেটা ব্যাকআপের জন্য এক্সপোর্ট করা সম্ভব করে। প্রতিটি শিক্ষার্থীর সাথে তাদের ফি, উপস্থিতি এবং রেজাল্টের সংযোগ রয়েছে।

```
GET    /api/students                    - সকল শিক্ষার্থী পড়ুন
GET    /api/students/:id                - আইডি দিয়ে পড়ুন
POST   /api/students                    - নতুন শিক্ষার্থী তৈরি করুন
PUT    /api/students/:id                - আপডেট করুন
DELETE /api/students/:id                - মুছুন
GET    /api/students/search?q=          - সার্চ করুন
GET    /api/students/class/:classId     - ক্লাস অনুযায়ী
GET    /api/students/:id/attendance     - উপস্থিতি রেকর্ড
GET    /api/students/:id/fees           - ফি রেকর্ড
GET    /api/students/:id/results        - রেজাল্ট রেকর্ড
POST   /api/students/import             - CSV ইমপোর্ট
GET    /api/students/export             - CSV এক্সপোর্ট
```

### টিচার্স এন্ডপয়েন্ট

শিক্ষক ম্যানেজমেন্টে সব স্ট্যান্ডার্ড অপারেশন ছাড়াও সাবজেক্ট অনুযায়ী শিক্ষক খোঁজার সুবিধা রয়েছে। প্রতিটি শিক্ষকের জন্য তাদের দায়িত্বপ্রাপ্ত বিষয় এবং ক্লাসের তালিকা সংরক্ষিত থাকে।

```
GET    /api/teachers                    - সকল শিক্ষক পড়ুন
GET    /api/teachers/:id                - আইডি দিয়ে পড়ুন
POST   /api/teachers                    - নতুন শিক্ষক তৈরি করুন
PUT    /api/teachers/:id                - আপডেট করুন
DELETE /api/teachers/:id                - মুছুন
GET    /api/teachers/search?q=          - সার্চ করুন
GET    /api/teachers/subject/:subject   - বিষয় অনুযায়ী
GET    /api/teachers/:id/subjects       - বিষয় তালিকা
```

### ফি ম্যানেজমেন্ট এন্ডপয়েন্ট

ফি ম্যানেজমেন্ট সিস্টেমে ফি টাইপ, ছাড় এবং শিক্ষার্থী ফি রেকর্ড আলাদা এন্ডপয়েন্টে ম্যানেজ করা হয়। বাল্ক ফি জেনারেশনের মাধ্যমে একসাথে অনেক শিক্ষার্থীর জন্য ফি ইনভয়েস তৈরি করা যায় এবং পেমেন্ট ট্র্যাকিং সিস্টেম ফি সংগ্রহ পরিচালনা করে।

```
GET    /api/fee-types                   - সকল ফি টাইপ পড়ুন
POST   /api/fee-types                   - নতুন ফি টাইপ যোগ করুন
PUT    /api/fee-types/:id               - আপডেট করুন
DELETE /api/fee-types/:id               - মুছুন

GET    /api/fee-waivers                 - সকল ছাড় পড়ুন
POST   /api/fee-waivers                 - নতুন ছাড় যোগ করুন

GET    /api/fees                        - সকল ফি রেকর্ড পড়ুন
GET    /api/fees/:id                    - আইডি দিয়ে পড়ুন
POST   /api/fees                        - নতুন ফি তৈরি করুন
PUT    /api/fees/:id                    - আপডেট করুন
DELETE /api/fees/:id                    - মুছুন
POST   /api/fees/:id/pay                - পেমেন্ট করুন
GET    /api/fees/student/:id            - শিক্ষার্থীর ফি
GET    /api/fees/unpaid                 - বকেয়া ফি
POST   /api/fees/generate-bulk          - বাল্ক ফি জেনারেট
```

### অ্যাটেনডেন্স এন্ডপয়েন্ট

উপস্থিতি সিস্টেম দৈনিক রেকর্ড সংরক্ষণ করে এবং মাসিক ও বার্ষিক রিপোর্ট জেনারেট করতে পারে। প্রতিটি ক্লাসের জন্য দিনে একবার উপস্থিতি সেভ করা হয় এবং পরবর্তীতে বিশ্লেষণের জন্য ব্যবহার করা যায়।

```
GET    /api/attendance                  - সকল রেকর্ড পড়ুন
GET    /api/attendance/date/:date       - তারিখ দিয়ে পড়ুন
POST   /api/attendance                  - উপস্থিতি সেভ করুন
PUT    /api/attendance                  - আপডেট করুন
GET    /api/attendance/student/:id      - শিক্ষার্থীর উপস্থিতি
GET    /api/attendance/class/:id        - ক্লাসের উপস্থিতি
GET    /api/attendance/summary          - সারাংশ রিপোর্ট
```

## এরর হ্যান্ডলিং

### এরর রেসপন্স ফরম্যাট

সার্ভার সবসময় স্ট্যান্ডার্ড জেসন ফরম্যাটে রেসপন্স দেয় এবং এরর হলে এরর মেসেজ সহ রেসপন্স আসে। সফল অপারেশনে `data` ফিল্ডে মূল ডেটা থাকে এবং ব্যর্থ অপারেশনে `message` ফিল্ডে এররের বিবরণ থাকে। এই স্ট্রাকচার ফ্রন্টএন্ডে সহজে পার্স এবং ডিসপ্লে করা যায়।

```javascript
// সফল রেসপন্স
{
    "success": true,
    "data": { /* রিকোয়েস্টেড ডেটা */ },
    "message": "অপারেশন সফল হয়েছে"
}

// এরর রেসপন্স
{
    "success": false,
    "message": "এররের বিবরণ",
    "code": "ERROR_CODE"
}
```

### কমন এরর কোড

কিছু কমন এরর কোড যা আপনি দেখতে পারেন এবং তাদের অর্থ সংক্ষেপে ব্যাখ্যা করা হলো। এই কোডগুলো জানা থাকলে ডিবাগিং সহজ হয়। 401 এরর মানে অথেনটিকেশন ব্যর্থ হয়েছে অর্থাৎ লগইন করা নেই বা টোকেন এক্সপায়ার্ড হয়ে গেছে। 403 এরর মানে অথরাইজেশন ব্যর্থ অর্থাৎ ব্যবহারকারীর এই অপারেশন করার অনুমতি নেই। 404 মানে রিকোয়েস্টেড রিসোর্স পাওয়া যায়নি এবং 500 এরর মানে সার্ভার সাইড সমস্যা।

```
400 - Bad Request       - ভুল ইনপুট ডেটা
401 - Unauthorized      - লগইন প্রয়োজন
403 - Forbidden         - অনুমতি নেই
404 - Not Found         - রিসোর্স পাওয়া যায়নি
500 - Server Error      - সার্ভার সমস্যা
```

## সার্ভার সেটআপ

### লোকাল ডেভেলপমেন্ট

লোকাল মেশিনে সার্ভার চালাতে প্রথমে প্রজেক্ট রুটে `npm install` চালিয়ে সকল ডিপেন্ডেন্সি ইনস্টল করুন। তারপর `.env` ফাইল তৈরি করে ডাটাবেস কানেকশন স্ট্রিং এবং অন্যান্য কনফিগারেশন সেট করুন। সার্ভার চালু করতে `npm run dev` অথবা `node server/index.js` কমান্ড ব্যবহার করুন।

```bash
# ডিপেন্ডেন্সি ইনস্টল করুন
npm install

# .env ফাইল তৈরি করুন
cp .env.example .env

# .env ফাইল এডিট করুন
# MONGODB_URI=mongodb://localhost:27017/pathshala
# JWT_SECRET=your-secret-key
# PORT=3000

# সার্ভার চালু করুন
npm run dev
```

### প্রোডাকশন ডিপ্লয়মেন্ট

প্রোডাকশনে ডিপ্লয় করার আগে বিল্ড কমান্ড চালিয়ে প্রোডাকশন বিল্ড তৈরি করুন এবং এনভায়রনমেন্ট ভেরিয়েবল সঠিকভাবে সেট করুন। PM2 বা অন্যান্য প্রসেস ম্যানেজার ব্যবহার করে সার্ভার চালানো উচিত যাতে ক্র্যাশ হলে অটো রিস্টার্ট হয়। Nginx দিয়ে রিভার্স প্রক্সি সেটআপ করলে বেটার পারফরম্যান্স এবং সিকিউরিটি পাওয়া যায়।

```bash
# প্রোডাকশন বিল্ড
npm run build

# PM2 দিয়ে চালান
pm2 start server/index.js --name pathshala-api

# Nginx কনফিগারেশন উদাহরণ
# server {
#     listen 80;
#     server_name api.yourdomain.com;
#     location / {
#         proxy_pass http://localhost:3000;
#         proxy_http_version 1.1;
#         proxy_set_header Upgrade $http_upgrade;
#         proxy_set_header Connection 'upgrade';
#         proxy_cache_bypass $http_upgrade;
#     }
# }
```

## ফ্রন্টএন্ড মাইগ্রেশন গাইড

### স্টোরেজম্যানেজার থেকে এপিআইতে মাইগ্রেশন

পুরাতন কোডবেস থেকে নতুন এপিআইতে মাইগ্রেশন করতে প্রথমে স্ক্রিপ্ট ফাইলগুলো যোগ করুন এবং পেজ লোডে DataManager ইনিশিয়ালাইজ করুন। তারপর এক এক করে StorageManager কলগুলো API কল দিয়ে রিপ্লেস করুন। অ্যাসিঙ্ক অপারেশনের জন্য async/await ব্যবহার করুন এবং এরর হ্যান্ডলিং যোগ করুন। মাইগ্রেশনের সময় হাইব্রিড মোড ব্যবহার করলে পুরাতন এবং নতুন কোড একসাথে কাজ করবে।

```javascript
// পুরাতন কোড
const students = StorageManager.getStudents();
StorageManager.addStudent(studentData);
StorageManager.updateStudent(id, data);
StorageManager.deleteStudent(id);

// নতুন কোড (async/await সহ)
async function manageStudents() {
    const students = await API.students.getAll();
    
    await API.students.create(studentData);
    
    await API.students.update(id, data);
    
    await API.students.delete(id);
}
```

### লাইভ উদাহরণ

নিচে একটি সম্পূর্ণ উদাহরণ দেওয়া হলো যেখানে শিক্ষার্থী লিস্ট পেজ এপিআই ব্যবহার করে রিফ্যাক্টর করা হয়েছে। এই কোডটি বুঝলে আপনি অন্যান্য পেজগুলোও সহজে রিফ্যাক্টর করতে পারবেন। প্রতিটি ফাংশন স্বতন্ত্র এবং পুনরায় ব্যবহারযোগ্য।

```javascript
// শিক্ষার্থী লিস্ট পেজ - এপিআই ইন্টিগ্রেশন

// ডেটা লোড
async function loadStudents() {
    showLoader();
    try {
        const students = await API.students.getAll();
        renderStudentsTable(students);
        updateStudentCount(students.length);
    } catch (error) {
        showToast('শিক্ষার্থী লোড ব্যর্থ: ' + error.message, 'error');
    } finally {
        hideLoader();
    }
}

// টেবিল রেন্ডার
function renderStudentsTable(students) {
    const tbody = document.getElementById('studentsTableBody');
    tbody.innerHTML = students.map(student => `
        <tr>
            <td>${student.studentId}</td>
            <td>${student.banglaName}</td>
            <td>${student.className || 'N/A'}</td>
            <td>${student.section}</td>
            <td>${student.rollNumber}</td>
            <td>
                <span class="badge badge-${student.status === 'active' ? 'success' : 'danger'}">
                    ${student.status === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-info" onclick="viewStudent('${student._id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-warning" onclick="editStudent('${student._id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteStudent('${student._id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// সার্চ ফাংশন
async function searchStudents(query) {
    if (!query.trim()) {
        loadStudents();
        return;
    }
    
    try {
        const results = await API.students.search(query);
        renderStudentsTable(results);
        updateStudentCount(results.length);
    } catch (error) {
        showToast('সার্চ ব্যর্থ: ' + error.message, 'error');
    }
}

// নতুন শিক্ষার্থী যোগ
async function createNewStudent(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const studentData = Object.fromEntries(formData.entries());
    
    try {
        await API.students.create(studentData);
        showToast('শিক্ষার্থী যোগ সফল', 'success');
        closeModal('add-student-modal');
        loadStudents();
    } catch (error) {
        showToast('যোগ ব্যর্থ: ' + error.message, 'error');
    }
}

// শিক্ষার্থী মুছুন
async function deleteStudent(id) {
    if (!confirm('আপনি কি নিশ্চিত যে এই শিক্ষার্থী মুছে ফেলতে চান?')) {
        return;
    }
    
    try {
        await API.students.delete(id);
        showToast('শিক্ষার্থী মুছে ফেলা হয়েছে', 'success');
        loadStudents();
    } catch (error) {
        showToast('মুছে ফেলা ব্যর্থ: ' + error.message, 'error');
    }
}

// পেজ লোড ইভেন্ট
document.addEventListener('DOMContentLoaded', () => {
    loadStudents();
    
    // সার্চ ইভেন্ট
    document.getElementById('searchInput').addEventListener('input', debounce((e) => {
        searchStudents(e.target.value);
    }, 300));
    
    // ফিল্টার ইভেন্ট
    document.getElementById('classFilter').addEventListener('change', (e) => {
        filterByClass(e.target.value);
    });
});
```

## ট্রাবলশুটিং

### সাধারণ সমস্যা এবং সমাধান

কিছু সাধারণ সমস্যা দেখা দিতে পারে যখন এপিআই ইন্টিগ্রেশন করছেন। সার্ভার কানেক্ট না হলে প্রথমে সার্ভার চলছে কিনা এবং পোর্ট সঠিক কিনা চেক করুন। CORS এরর দেখা দিলে সার্ভারের CORS কনফিগারেশন চেক করুন এবং প্রয়োজনে অরিজিন যোগ করুন। 401 এরর মানে টোকেন এক্সপায়ার্ড হয়ে গেছে, লগইন পেজে রিডিরেক্ট করুন।

```javascript
// কানেকশন টেস্ট
async function testConnection() {
    try {
        const response = await fetch(API_CONFIG.baseURL.replace('/api', '/health'));
        console.log('সার্ভার স্ট্যাটাস:', response.status);
    } catch (error) {
        console.error('কানেকশন ব্যর্থ:', error);
    }
}
```

এই ডকুমেন্টেশনটি পাঠশালা ই-ম্যানেজারের এপিআই ইন্টিগ্রেশন সম্পর্কে সম্পূর্ণ গাইড প্রদান করে। যেকোনো প্রশ্ন বা সমস্যার জন্য ডেভেলপার ডকুমেন্টেশন বা সোর্স কোড দেখুন।
