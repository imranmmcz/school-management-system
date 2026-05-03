/**
 * পাঠশালা ই-ম্যানেজার - স্টোরেজ ম্যানেজার
 * School Management System - Storage Manager
 * Handles all database operations using LocalStorage
 */

const StorageManager = {
    // Database prefix for all keys
    DB_PREFIX: 'pathshala_',
    
    // ==================== Default School Data ====================
    
    defaultConfig: {
        name: 'পাঠশালা ই-ম্যানেজার',
        tagline: 'আমাদের স্কুল, আমাদের গর্ব',
        logo: '',
        established: '২০২০',
        address: '১২৩, শিক্ষা রোড, ঢাকা-১০০০',
        phone: '+৮৮০১২৩৪৫৬৭৮৯০',
        email: 'info@pathshala.edu.bd',
        facebook: '',
        youtube: ''
    },
    
    defaultMenu: [
        { id: 1, name: 'হোম', link: '#hero', parent: null },
        { id: 2, name: 'ফিচার্স', link: '#features', parent: null },
        { id: 3, name: 'আমাদের সম্পর্কে', link: '#about', parent: null },
        { id: 4, name: 'গ্যালারি', link: '#gallery', parent: null },
        { id: 5, name: 'নোটিশ বোর্ড', link: '#notices', parent: null },
        { id: 6, name: 'যোগাযোগ', link: '#contact', parent: null }
    ],
    
    defaultSections: [
        { id: 'hero', name: 'হিরো সেকশন', type: 'hero', visible: true, order: 1 },
        { id: 'features', name: 'ফিচার্স', type: 'features', visible: true, order: 2 },
        { id: 'about', name: 'আমাদের সম্পর্কে', type: 'about', visible: true, order: 3 },
        { id: 'gallery', name: 'গ্যালারি', type: 'gallery', visible: true, order: 4 },
        { id: 'notices', name: 'নোটিশ বোর্ড', type: 'notices', visible: true, order: 5 },
        { id: 'cta', name: 'কল টু অ্যাকশন', type: 'cta', visible: true, order: 6 }
    ],
    
    defaultHero: {
        title: 'পাঠশালা ই-ম্যানেজারে স্বাগতম',
        subtitle: 'আমরা শিক্ষার্থীদের উজ্জ্বল ভবিষ্যত গড়তে প্রতিশ্রুতিবদ্ধ। আমাদের সাথে শিক্ষার যাত্রা শুরু করুন।',
        buttonText: 'ভর্তি হোন',
        buttonLink: '#admission',
        backgroundImage: ''
    },
    
    defaultFeatures: [
        {
            id: 1,
            icon: 'fas fa-graduation-cap',
            title: 'অভিজ্ঞ শিক্ষকমণ্ডলী',
            description: 'আমাদের দক্ষ এবং অভিজ্ঞ শিক্ষকরা শিক্ষার্থীদের সর্বোত্তম শিক্ষা প্রদান করেন।'
        },
        {
            id: 2,
            icon: 'fas fa-laptop',
            title: 'আধুনিক প্রযুক্তি',
            description: 'সর্বোত্তম শিক্ষার জন্য স্মার্ট ক্লাসরুম এবং ডিজিটাল লার্নিং প্ল্যাটফর্ম।'
        },
        {
            id: 3,
            icon: 'fas fa-book',
            title: 'সমৃদ্ধ লাইব্রেরি',
            description: 'বিশাল গ্রন্থাগারে হাজারো বই এবং ডিজিটাল রিসোর্স।'
        },
        {
            id: 4,
            icon: 'fas fa-futbol',
            title: 'ক্রীড়া ও সাংস্কৃতিক কার্যক্রম',
            description: 'শারীরিক ও মানসিক বিকাশের জন্য বিভিন্ন ক্রীড়া ও সাংস্কৃতিক কার্যক্রম।'
        }
    ],
    
    defaultAbout: {
        title: 'আমাদের সম্পর্কে',
        description: 'পাঠশালা ই-ম্যানেজার একটি আধুনিক শিক্ষাপ্রতিষ্ঠান যেখানে শিক্ষার্থীরা তাদের সর্বোচ্চ সম্ভাবনা অর্জন করতে পারে। আমরা মনে করি প্রতিটি শিশুর অনন্য প্রতিভা রয়েছে এবং আমাদের লক্ষ্য সেই প্রতিভাকে বিকাশিত করা।\n\nআমাদের শিক্ষা ব্যবস্থা মূলত ছাত্র-কেন্দ্রিক যেখানে প্রতিটি শিক্ষার্থীর ব্যক্তিগত চাহিদা পূরণ করা হয়।',
        image: ''
    },
    
    defaultNotices: [
        {
            id: 1,
            title: 'মাসিক পরীক্ষার সময়সূচি প্রকাশ',
            date: '১৩ জানুয়ারি, ২০২৫',
            description: 'জানুয়ারি মাসের মাসিক পরীক্ষার সময়সূচি প্রকাশ করা হয়েছে। সকল শিক্ষার্থীদের নির্ধারিত সময়ে পরীক্ষা কেন্দ্রে উপস্থিত থাকতে হবে।'
        },
        {
            id: 2,
            title: '৬ষ্ঠ শ্রেণির ক্লাস রুটিন পরিবর্তন',
            date: '১২ জানুয়ারি, ২০২৫',
            description: '৬ষ্ঠ শ্রেণির ক্লাস রুটিনে কিছু পরিবর্তন করা হয়েছে। নতুন রুটিন স্কুল নোটিশ বোর্ডে দেওয়া হয়েছে।'
        },
        {
            id: 3,
            title: 'বার্ষিক ক্রীড়া প্রতিযোগিতার তারিখ ঘোষণা',
            date: '১১ জানুয়ারি, ২০২৫',
            description: 'আগামী ২৫ জানুয়ারি বার্ষিক ক্রীড়া প্রতিযোগিতা অনুষ্ঠিত হবে। সকল শিক্ষার্থীদের অংশগ্রহণের জন্য আমন্ত্রণ জানানো হয়েছে।'
        }
    ],
    
    defaultCTA: {
        title: 'আজই ভর্তি হন',
        description: 'আপনার সন্তানের উজ্জ্বল ভবিষ্যতের জন্য আজই আমাদের সাথে যোগ দিন। ভর্তি চলছে।',
        buttonText: 'ভর্তি ফর্ম দেখুন',
        buttonLink: '#admission'
    },
    
    // ==================== Module Default Data ====================
    
    // Default Classes
    defaultClasses: [
        { id: 1, name: '৬ষ্ঠ শ্রেণি', section: 'ক', capacity: 40 },
        { id: 2, name: '৬ষ্ঠ শ্রেণি', section: 'খ', capacity: 40 },
        { id: 3, name: '৭ম শ্রেণি', section: 'ক', capacity: 40 },
        { id: 4, name: '৭ম শ্রেণি', section: 'খ', capacity: 40 },
        { id: 5, name: '৮ম শ্রেণি', section: 'ক', capacity: 40 },
        { id: 6, name: '৮ম শ্রেণি', section: 'খ', capacity: 40 },
        { id: 7, name: '৯ম শ্রেণি', section: 'ক', capacity: 35 },
        { id: 8, name: '১০ম শ্রেণি', section: 'ক', capacity: 35 }
    ],
    
    // Default Subjects
    defaultSubjects: [
        { id: 1, name: 'বাংলা', code: 'BAN', type: 'compulsory', fullMarks: 100 },
        { id: 2, name: 'ইংরেজি', code: 'ENG', type: 'compulsory', fullMarks: 100 },
        { id: 3, name: 'গণিত', code: 'MATH', type: 'compulsory', fullMarks: 100 },
        { id: 4, name: 'বিজ্ঞান', code: 'SCI', type: 'compulsory', fullMarks: 100 },
        { id: 5, name: 'বাংলাদেশ ও বিশ্বপরিচয়', code: 'BGS', type: 'compulsory', fullMarks: 100 },
        { id: 6, name: 'ইসলাম ধর্ম', code: 'ISL', type: 'compulsory', fullMarks: 100 },
        { id: 7, name: 'ডিজাইন অ্যান্ড টেকনোলজি', code: 'DT', type: 'optional', fullMarks: 50 },
        { id: 8, name: 'কৃষি শিক্ষা', code: 'AGRI', type: 'optional', fullMarks: 50 },
        { id: 9, name: 'গার্হস্থ্য বিজ্ঞান', code: 'HE', type: 'optional', fullMarks: 50 },
        { id: 10, name: 'চারু ও কারুকলা', code: 'ART', type: 'optional', fullMarks: 50 }
    ],
    
    // Default Students
    defaultStudents: [
        {
            id: 1,
            studentId: 'STU-2025-001',
            firstName: 'আব্দুল',
            lastName: 'রহমান',
            banglaName: 'আব্দুল রহমান',
            gender: 'male',
            dateOfBirth: '১৫ মার্চ ২০১২',
            religion: 'ইসলাম',
            bloodGroup: 'A+',
            phone: '+৮৮০১৭১১২৩৪৫৬৭',
            email: 'abdur@pathshala.edu.bd',
            classId: 1,
            section: 'ক',
            rollNumber: ১,
            admissionDate: '১ জানুয়ারি ২০২৫',
            image: '',
            fatherName: 'করিম মিয়া',
            fatherPhone: '+৮৮০১৮১১২৩৪৫৬৭',
            motherName: 'জাহানারা বেগম',
            address: '১২৩, মোহাম্মদপুর, ঢাকা-১২০৭',
            status: 'active'
        },
        {
            id: 2,
            studentId: 'STU-2025-002',
            firstName: 'সারা',
            lastName: 'আক্তার',
            banglaName: 'সারা আক্তার',
            gender: 'female',
            dateOfBirth: '২০ এপ্রিল ২০১২',
            religion: 'ইসলাম',
            bloodGroup: 'O+',
            phone: '+৮৮০১৭২২৩৪৫৬৭৮',
            email: 'sara@pathshala.edu.bd',
            classId: 1,
            section: 'ক',
            rollNumber: ২,
            admissionDate: '১ জানুয়ারি ২০২৫',
            image: '',
            fatherName: 'রাকিব আহমেদ',
            fatherPhone: '+৮৮০১৮২২৩৪৫৬৭৮',
            motherName: 'রোকেয়া আক্তার',
            address: '৪৫৬, ধানমণ্ডি, ঢাকা-১২০৫',
            status: 'active'
        }
    ],
    
    // Default Teachers
    defaultTeachers: [
        {
            id: 1,
            teacherId: 'TCH-2025-001',
            firstName: 'মোহাম্মদ',
            lastName: 'হানিফ',
            banglaName: 'মোহাম্মদ হানিফ',
            gender: 'male',
            dateOfBirth: '১০ মে ১৯৮০',
            qualification: 'এম.এ. (বাংলা)',
            designation: 'সিনিয়র শিক্ষক',
            subject: 'বাংলা',
            phone: '+৮৮০১৭১১১২২৩৪',
            email: 'hanif@pathshala.edu.bd',
            joinDate: '১৫ জুন ২০১৫',
            image: '',
            address: '৭৮, গুলশান, ঢাকা-১২১২',
            status: 'active'
        },
        {
            id: 2,
            teacherId: 'TCH-2025-002',
            firstName: 'ফাতেমা',
            lastName: 'খানম',
            banglaName: 'ফাতেমা খানম',
            gender: 'female',
            dateOfBirth: '২৫ নভেম্বর ১৯৮৫',
            qualification: 'বি.এসসি. (গণিত)',
            designation: 'শিক্ষিকা',
            subject: 'গণিত',
            phone: '+৮৮০১৭২২২৩৩৪৫',
            email: 'fatema@pathshala.edu.bd',
            joinDate: '১ সেপ্টেম্বর ২০১৮',
            image: '',
            address: '৯০, বনানী, ঢাকা-১২১৩',
            status: 'active'
        }
    ],
    
    // Default Fee Types
    defaultFeeTypes: [
        { id: 1, name: 'মাসিক বেতন', amount: ৫০০, type: 'monthly', description: 'প্রতি মাসে পরিশোধযোগ্য' },
        { id: 2, name: 'ভর্তি ফি', amount: ২০০০, type: 'onetime', description: 'ভর্তির সময় পরিশোধযোগ্য' },
        { id: 3, name: 'পরীক্ষার ফি', amount: ৩০০, type: 'exam', description: 'প্রতিটি পরীক্ষার জন্য' },
        { id: 4, name: 'বার্ষিক ফি', amount: ৩০০০, type: 'yearly', description: 'প্রতি বছর পরিশোধযোগ্য' },
        { id: 5, name: 'লাইব্রেরি ফি', amount: ২০০, type: 'yearly', description: 'বই ও রিসোর্স ব্যবহারের জন্য' },
        { id: 6, name: 'স্পোর্টস ফি', amount: ১৫০, type: 'yearly', description: 'ক্রীড়া কার্যক্রমের জন্য' },
        { id: 7, name: 'সার্টিফিকেট ফি', amount: ১০০, type: 'onetime', description: 'সার্টিফিকেট প্রদানের জন্য' }
    ],
    
    // Default Fee Waivers
    defaultFeeWaivers: [
        { id: 1, name: 'কোটা', percentage: ১০০, description: 'মুক্তিযোদ্ধা পরিবার' },
        { id: 2, name: 'অর্ধ-ছাত্রবৃত্তি', percentage: ৫০, description: 'মেধাবী ছাত্রদের জন্য' },
        { id: 3, name: 'সম্পূর্ণ ছাত্রবৃত্তি', percentage: ১০০, description: 'অসচ্ছল মেধাবী ছাত্রদের জন্য' }
    ],
    
    // Default Exams
    defaultExams: [
        {
            id: 1,
            name: 'জানুয়ারি মাসিক পরীক্ষা',
            type: 'monthly',
            classId: 1,
            startDate: '২০ জানুয়ারি ২০২৫',
            endDate: '২৫ জানুয়ারি ২০২৫',
            status: 'upcoming'
        },
        {
            id: 2,
            name: 'প্রথম সাময়িক পরীক্ষা',
            type: 'terminal',
            classId: 0,
            startDate: '১৫ ফেব্রুয়ারি ২০২৫',
            endDate: '২৮ ফেব্রুয়ারি ২০২৫',
            status: 'upcoming'
        }
    ],
    
    // ==================== Initialize Database ====================
    
    init() {
        if (!this.isInitialized()) {
            console.log('Initializing Pathshala e-Manager Database...');
            this.seedDatabase();
        }
    },
    
    isInitialized() {
        return localStorage.getItem(this.DB_PREFIX + 'initialized') === 'true';
    },
    
    seedDatabase() {
        // Save basic config
        this.saveConfig(this.defaultConfig);
        this.saveMenu(this.defaultMenu);
        this.saveSections(this.defaultSections);
        this.saveHero(this.defaultHero);
        this.saveFeatures(this.defaultFeatures);
        this.saveAbout(this.defaultAbout);
        this.saveNotices(this.defaultNotices);
        this.saveCTA(this.defaultCTA);
        this.saveGallery([]);
        
        // Save module data
        this.saveClasses(this.defaultClasses);
        this.saveSubjects(this.defaultSubjects);
        this.saveStudents(this.defaultStudents);
        this.saveTeachers(this.defaultTeachers);
        this.saveFeeTypes(this.defaultFeeTypes);
        this.saveFeeWaivers(this.defaultFeeWaivers);
        this.saveExams(this.defaultExams);
        this.saveAttendance([]);
        this.saveFees([]);
        this.saveResults([]);
        this.savePayments([]);
        this.saveNotifications([]);
        
        // Mark as initialized
        localStorage.setItem(this.DB_PREFIX + 'initialized', 'true');
        console.log('Database initialized successfully!');
    },
    
    clearAll() {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith(this.DB_PREFIX)) {
                localStorage.removeItem(key);
            }
        });
        localStorage.removeItem(this.DB_PREFIX + 'initialized');
        console.log('All data cleared!');
    },
    
    resetToDefaults() {
        this.clearAll();
        this.seedDatabase();
        showToast('ডেটাবেস রিসেট করা হয়েছে', 'success');
    },
    
    // ==================== Config Operations ====================
    
    saveConfig(config) {
        localStorage.setItem(this.DB_PREFIX + 'config', JSON.stringify(config));
    },
    
    getConfig() {
        const config = localStorage.getItem(this.DB_PREFIX + 'config');
        return config ? JSON.parse(config) : { ...this.defaultConfig };
    },
    
    updateConfig(updates) {
        const config = this.getConfig();
        const updatedConfig = { ...config, ...updates };
        this.saveConfig(updatedConfig);
        return updatedConfig;
    },
    
    // ==================== Menu Operations ====================
    
    saveMenu(menu) {
        localStorage.setItem(this.DB_PREFIX + 'menu', JSON.stringify(menu));
    },
    
    getMenu() {
        const menu = localStorage.getItem(this.DB_PREFIX + 'menu');
        return menu ? JSON.parse(menu) : [...this.defaultMenu];
    },
    
    addMenuItem(item) {
        const menu = this.getMenu();
        const newItem = {
            id: Date.now(),
            name: item.name,
            link: item.link,
            parent: item.parent || null
        };
        menu.push(newItem);
        this.saveMenu(menu);
        return newItem;
    },
    
    updateMenuItem(id, updates) {
        const menu = this.getMenu();
        const index = menu.findIndex(item => item.id === id);
        if (index !== -1) {
            menu[index] = { ...menu[index], ...updates };
            this.saveMenu(menu);
            return menu[index];
        }
        return null;
    },
    
    deleteMenuItem(id) {
        let menu = this.getMenu();
        menu = menu.filter(item => item.id !== id);
        this.saveMenu(menu);
    },
    
    updateMenuOrder(newOrder) {
        this.saveMenu(newOrder);
    },
    
    // ==================== Section Operations ====================
    
    saveSections(sections) {
        localStorage.setItem(this.DB_PREFIX + 'sections', JSON.stringify(sections));
    },
    
    getSections() {
        const sections = localStorage.getItem(this.DB_PREFIX + 'sections');
        return sections ? JSON.parse(sections) : [...this.defaultSections];
    },
    
    updateSection(id, updates) {
        const sections = this.getSections();
        const index = sections.findIndex(section => section.id === id);
        if (index !== -1) {
            sections[index] = { ...sections[index], ...updates };
            this.saveSections(sections);
            return sections[index];
        }
        return null;
    },
    
    updateSectionOrder(newOrder) {
        const sections = this.getSections();
        newOrder.forEach((id, index) => {
            const sectionIndex = sections.findIndex(s => s.id === id);
            if (sectionIndex !== -1) {
                sections[sectionIndex].order = index + 1;
            }
        });
        this.saveSections(sections);
    },
    
    toggleSectionVisibility(id) {
        const sections = this.getSections();
        const index = sections.findIndex(section => section.id === id);
        if (index !== -1) {
            sections[index].visible = !sections[index].visible;
            this.saveSections(sections);
            return sections[index];
        }
        return null;
    },
    
    addSection(section) {
        const sections = this.getSections();
        const newSection = {
            id: section.id || 'custom_' + Date.now(),
            name: section.name,
            type: section.type || 'custom',
            visible: true,
            order: sections.length + 1
        };
        sections.push(newSection);
        this.saveSections(sections);
        return newSection;
    },
    
    deleteSection(id) {
        let sections = this.getSections();
        sections = sections.filter(section => section.id !== id);
        this.saveSections(sections);
    },
    
    // ==================== Hero Operations ====================
    
    saveHero(hero) {
        localStorage.setItem(this.DB_PREFIX + 'hero', JSON.stringify(hero));
    },
    
    getHero() {
        const hero = localStorage.getItem(this.DB_PREFIX + 'hero');
        return hero ? JSON.parse(hero) : { ...this.defaultHero };
    },
    
    updateHero(updates) {
        const hero = this.getHero();
        const updatedHero = { ...hero, ...updates };
        this.saveHero(updatedHero);
        return updatedHero;
    },
    
    // ==================== Features Operations ====================
    
    saveFeatures(features) {
        localStorage.setItem(this.DB_PREFIX + 'features', JSON.stringify(features));
    },
    
    getFeatures() {
        const features = localStorage.getItem(this.DB_PREFIX + 'features');
        return features ? JSON.parse(features) : [...this.defaultFeatures];
    },
    
    addFeature(feature) {
        const features = this.getFeatures();
        const newFeature = {
            id: Date.now(),
            icon: feature.icon || 'fas fa-star',
            title: feature.title,
            description: feature.description
        };
        features.push(newFeature);
        this.saveFeatures(features);
        return newFeature;
    },
    
    updateFeature(id, updates) {
        const features = this.getFeatures();
        const index = features.findIndex(f => f.id === id);
        if (index !== -1) {
            features[index] = { ...features[index], ...updates };
            this.saveFeatures(features);
            return features[index];
        }
        return null;
    },
    
    deleteFeature(id) {
        let features = this.getFeatures();
        features = features.filter(f => f.id !== id);
        this.saveFeatures(features);
    },
    
    // ==================== About Operations ====================
    
    saveAbout(about) {
        localStorage.setItem(this.DB_PREFIX + 'about', JSON.stringify(about));
    },
    
    getAbout() {
        const about = localStorage.getItem(this.DB_PREFIX + 'about');
        return about ? JSON.parse(about) : { ...this.defaultAbout };
    },
    
    updateAbout(updates) {
        const about = this.getAbout();
        const updatedAbout = { ...about, ...updates };
        this.saveAbout(updatedAbout);
        return updatedAbout;
    },
    
    // ==================== Notices Operations ====================
    
    saveNotices(notices) {
        localStorage.setItem(this.DB_PREFIX + 'notices', JSON.stringify(notices));
    },
    
    getNotices() {
        const notices = localStorage.getItem(this.DB_PREFIX + 'notices');
        return notices ? JSON.parse(notices) : [...this.defaultNotices];
    },
    
    addNotice(notice) {
        const notices = this.getNotices();
        const newNotice = {
            id: Date.now(),
            title: notice.title,
            date: notice.date,
            description: notice.description
        };
        notices.unshift(newNotice);
        this.saveNotices(notices);
        return newNotice;
    },
    
    updateNotice(id, updates) {
        const notices = this.getNotices();
        const index = notices.findIndex(n => n.id === id);
        if (index !== -1) {
            notices[index] = { ...notices[index], ...updates };
            this.saveNotices(notices);
            return notices[index];
        }
        return null;
    },
    
    deleteNotice(id) {
        let notices = this.getNotices();
        notices = notices.filter(n => n.id !== id);
        this.saveNotices(notices);
    },
    
    // ==================== CTA Operations ====================
    
    saveCTA(cta) {
        localStorage.setItem(this.DB_PREFIX + 'cta', JSON.stringify(cta));
    },
    
    getCTA() {
        const cta = localStorage.getItem(this.DB_PREFIX + 'cta');
        return cta ? JSON.parse(cta) : { ...this.defaultCTA };
    },
    
    updateCTA(updates) {
        const cta = this.getCTA();
        const updatedCTA = { ...cta, ...updates };
        this.saveCTA(updatedCTA);
        return updatedCTA;
    },
    
    // ==================== Gallery Operations ====================
    
    saveGallery(images) {
        localStorage.setItem(this.DB_PREFIX + 'gallery', JSON.stringify(images));
    },
    
    getGallery() {
        const gallery = localStorage.getItem(this.DB_PREFIX + 'gallery');
        return gallery ? JSON.parse(gallery) : [];
    },
    
    addGalleryImage(imageData) {
        const gallery = this.getGallery();
        const newImage = {
            id: Date.now(),
            src: imageData.src,
            caption: imageData.caption || ''
        };
        gallery.push(newImage);
        this.saveGallery(gallery);
        return newImage;
    },
    
    deleteGalleryImage(id) {
        let gallery = this.getGallery();
        gallery = gallery.filter(img => img.id !== id);
        this.saveGallery(gallery);
    },
    
    // ==================== Class Operations ====================
    
    saveClasses(classes) {
        localStorage.setItem(this.DB_PREFIX + 'classes', JSON.stringify(classes));
    },
    
    getClasses() {
        const classes = localStorage.getItem(this.DB_PREFIX + 'classes');
        return classes ? JSON.parse(classes) : [...this.defaultClasses];
    },
    
    addClass(classData) {
        const classes = this.getClasses();
        const newClass = {
            id: Date.now(),
            name: classData.name,
            section: classData.section,
            capacity: classData.capacity || 40
        };
        classes.push(newClass);
        this.saveClasses(classes);
        return newClass;
    },
    
    updateClass(id, updates) {
        const classes = this.getClasses();
        const index = classes.findIndex(c => c.id === id);
        if (index !== -1) {
            classes[index] = { ...classes[index], ...updates };
            this.saveClasses(classes);
            return classes[index];
        }
        return null;
    },
    
    deleteClass(id) {
        let classes = this.getClasses();
        classes = classes.filter(c => c.id !== id);
        this.saveClasses(classes);
    },
    
    getClassById(id) {
        const classes = this.getClasses();
        return classes.find(c => c.id === id);
    },
    
    // ==================== Subject Operations ====================
    
    saveSubjects(subjects) {
        localStorage.setItem(this.DB_PREFIX + 'subjects', JSON.stringify(subjects));
    },
    
    getSubjects() {
        const subjects = localStorage.getItem(this.DB_PREFIX + 'subjects');
        return subjects ? JSON.parse(subjects) : [...this.defaultSubjects];
    },
    
    addSubject(subjectData) {
        const subjects = this.getSubjects();
        const newSubject = {
            id: Date.now(),
            name: subjectData.name,
            code: subjectData.code,
            type: subjectData.type || 'compulsory',
            fullMarks: subjectData.fullMarks || 100
        };
        subjects.push(newSubject);
        this.saveSubjects(subjects);
        return newSubject;
    },
    
    updateSubject(id, updates) {
        const subjects = this.getSubjects();
        const index = subjects.findIndex(s => s.id === id);
        if (index !== -1) {
            subjects[index] = { ...subjects[index], ...updates };
            this.saveSubjects(subjects);
            return subjects[index];
        }
        return null;
    },
    
    deleteSubject(id) {
        let subjects = this.getSubjects();
        subjects = subjects.filter(s => s.id !== id);
        this.saveSubjects(subjects);
    },
    
    // ==================== Student Operations ====================
    
    saveStudents(students) {
        localStorage.setItem(this.DB_PREFIX + 'students', JSON.stringify(students));
    },
    
    getStudents() {
        const students = localStorage.getItem(this.DB_PREFIX + 'students');
        return students ? JSON.parse(students) : [...this.defaultStudents];
    },
    
    addStudent(studentData) {
        const students = this.getStudents();
        const studentCount = students.length + 1;
        const newStudent = {
            id: Date.now(),
            studentId: studentData.studentId || `STU-2025-${String(studentCount).padStart(3, '0')}`,
            firstName: studentData.firstName,
            lastName: studentData.lastName,
            banglaName: studentData.banglaName || `${studentData.firstName} ${studentData.lastName}`,
            gender: studentData.gender,
            dateOfBirth: studentData.dateOfBirth,
            religion: studentData.religion || 'ইসলাম',
            bloodGroup: studentData.bloodGroup || '',
            phone: studentData.phone || '',
            email: studentData.email || '',
            classId: studentData.classId,
            section: studentData.section,
            rollNumber: studentData.rollNumber || studentCount,
            admissionDate: studentData.admissionDate || new Date().toLocaleDateString('bn-BD'),
            image: studentData.image || '',
            fatherName: studentData.fatherName || '',
            fatherPhone: studentData.fatherPhone || '',
            motherName: studentData.motherName || '',
            address: studentData.address || '',
            status: studentData.status || 'active'
        };
        students.push(newStudent);
        this.saveStudents(students);
        return newStudent;
    },
    
    updateStudent(id, updates) {
        const students = this.getStudents();
        const index = students.findIndex(s => s.id === id);
        if (index !== -1) {
            students[index] = { ...students[index], ...updates };
            this.saveStudents(students);
            return students[index];
        }
        return null;
    },
    
    deleteStudent(id) {
        let students = this.getStudents();
        students = students.filter(s => s.id !== id);
        this.saveStudents(students);
    },
    
    getStudentById(id) {
        const students = this.getStudents();
        return students.find(s => s.id === id);
    },
    
    getStudentsByClass(classId) {
        const students = this.getStudents();
        return students.filter(s => s.classId === classId);
    },
    
    searchStudents(query) {
        const students = this.getStudents();
        const searchTerm = query.toLowerCase();
        return students.filter(s => 
            s.banglaName.toLowerCase().includes(searchTerm) ||
            s.studentId.toLowerCase().includes(searchTerm) ||
            s.fatherName.toLowerCase().includes(searchTerm)
        );
    },
    
    // ==================== Teacher Operations ====================
    
    saveTeachers(teachers) {
        localStorage.setItem(this.DB_PREFIX + 'teachers', JSON.stringify(teachers));
    },
    
    getTeachers() {
        const teachers = localStorage.getItem(this.DB_PREFIX + 'teachers');
        return teachers ? JSON.parse(teachers) : [...this.defaultTeachers];
    },
    
    addTeacher(teacherData) {
        const teachers = this.getTeachers();
        const teacherCount = teachers.length + 1;
        const newTeacher = {
            id: Date.now(),
            teacherId: teacherData.teacherId || `TCH-2025-${String(teacherCount).padStart(3, '0')}`,
            firstName: teacherData.firstName,
            lastName: teacherData.lastName,
            banglaName: teacherData.banglaName || `${teacherData.firstName} ${teacherData.lastName}`,
            gender: teacherData.gender,
            dateOfBirth: teacherData.dateOfBirth,
            qualification: teacherData.qualification,
            designation: teacherData.designation || 'শিক্ষক',
            subject: teacherData.subject,
            phone: teacherData.phone || '',
            email: teacherData.email || '',
            joinDate: teacherData.joinDate || new Date().toLocaleDateString('bn-BD'),
            image: teacherData.image || '',
            address: teacherData.address || '',
            status: teacherData.status || 'active'
        };
        teachers.push(newTeacher);
        this.saveTeachers(teachers);
        return newTeacher;
    },
    
    updateTeacher(id, updates) {
        const teachers = this.getTeachers();
        const index = teachers.findIndex(t => t.id === id);
        if (index !== -1) {
            teachers[index] = { ...teachers[index], ...updates };
            this.saveTeachers(teachers);
            return teachers[index];
        }
        return null;
    },
    
    deleteTeacher(id) {
        let teachers = this.getTeachers();
        teachers = teachers.filter(t => t.id !== id);
        this.saveTeachers(teachers);
    },
    
    getTeacherById(id) {
        const teachers = this.getTeachers();
        return teachers.find(t => t.id === id);
    },
    
    searchTeachers(query) {
        const teachers = this.getTeachers();
        const searchTerm = query.toLowerCase();
        return teachers.filter(t => 
            t.banglaName.toLowerCase().includes(searchTerm) ||
            t.teacherId.toLowerCase().includes(searchTerm) ||
            t.subject.toLowerCase().includes(searchTerm)
        );
    },
    
    // ==================== Fee Operations ====================
    
    saveFeeTypes(feeTypes) {
        localStorage.setItem(this.DB_PREFIX + 'feeTypes', JSON.stringify(feeTypes));
    },
    
    getFeeTypes() {
        const feeTypes = localStorage.getItem(this.DB_PREFIX + 'feeTypes');
        return feeTypes ? JSON.parse(feeTypes) : [...this.defaultFeeTypes];
    },
    
    addFeeType(feeTypeData) {
        const feeTypes = this.getFeeTypes();
        const newFeeType = {
            id: Date.now(),
            name: feeTypeData.name,
            amount: feeTypeData.amount,
            type: feeTypeData.type,
            description: feeTypeData.description || ''
        };
        feeTypes.push(newFeeType);
        this.saveFeeTypes(feeTypes);
        return newFeeType;
    },
    
    updateFeeType(id, updates) {
        const feeTypes = this.getFeeTypes();
        const index = feeTypes.findIndex(f => f.id === id);
        if (index !== -1) {
            feeTypes[index] = { ...feeTypes[index], ...updates };
            this.saveFeeTypes(feeTypes);
            return feeTypes[index];
        }
        return null;
    },
    
    deleteFeeType(id) {
        let feeTypes = this.getFeeTypes();
        feeTypes = feeTypes.filter(f => f.id !== id);
        this.saveFeeTypes(feeTypes);
    },
    
    // Fee Waivers
    saveFeeWaivers(feeWaivers) {
        localStorage.setItem(this.DB_PREFIX + 'feeWaivers', JSON.stringify(feeWaivers));
    },
    
    getFeeWaivers() {
        const feeWaivers = localStorage.getItem(this.DB_PREFIX + 'feeWaivers');
        return feeWaivers ? JSON.parse(feeWaivers) : [...this.defaultFeeWaivers];
    },
    
    // Student Fees (Invoice records)
    saveFees(fees) {
        localStorage.setItem(this.DB_PREFIX + 'fees', JSON.stringify(fees));
    },
    
    getFees() {
        const fees = localStorage.getItem(this.DB_PREFIX + 'fees');
        return fees ? JSON.parse(fees) : [];
    },
    
    addFee(feeData) {
        const fees = this.getFees();
        const newFee = {
            id: Date.now(),
            studentId: feeData.studentId,
            feeTypeId: feeData.feeTypeId,
            feeTypeName: feeData.feeTypeName,
            amount: feeData.amount,
            waiver: feeData.waiver || 0,
            finalAmount: feeData.finalAmount || feeData.amount,
            dueDate: feeData.dueDate,
            paidDate: feeData.paidDate || null,
            status: feeData.status || 'unpaid',
            paymentMethod: feeData.paymentMethod || null,
            transactionId: feeData.transactionId || null,
            notes: feeData.notes || ''
        };
        fees.push(newFee);
        this.saveFees(fees);
        return newFee;
    },
    
    updateFee(id, updates) {
        const fees = this.getFees();
        const index = fees.findIndex(f => f.id === id);
        if (index !== -1) {
            fees[index] = { ...fees[index], ...updates };
            this.saveFees(fees);
            return fees[index];
        }
        return null;
    },
    
    getFeesByStudent(studentId) {
        const fees = this.getFees();
        return fees.filter(f => f.studentId === studentId);
    },
    
    getUnpaidFees() {
        const fees = this.getFees();
        return fees.filter(f => f.status === 'unpaid');
    },
    
    getStudentFeeSummary(studentId) {
        const fees = this.getFeesByStudent(studentId);
        const total = fees.reduce((sum, f) => sum + f.amount, 0);
        const paid = fees.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.finalAmount, 0);
        const due = total - paid;
        return { total, paid, due, totalCount: fees.length, paidCount: fees.filter(f => f.status === 'paid').length };
    },
    
    // ==================== Attendance Operations ====================
    
    saveAttendance(attendance) {
        localStorage.setItem(this.DB_PREFIX + 'attendance', JSON.stringify(attendance));
    },
    
    getAttendance() {
        const attendance = localStorage.getItem(this.DB_PREFIX + 'attendance');
        return attendance ? JSON.parse(attendance) : [];
    },
    
    saveDailyAttendance(date, classId, records) {
        const attendance = this.getAttendance();
        const existingIndex = attendance.findIndex(a => a.date === date && a.classId === classId);

        const dailyRecord = {
            date: date,
            classId: classId,
            records: records,
            savedAt: new Date().toISOString()
        };

        if (existingIndex !== -1) {
            attendance[existingIndex] = dailyRecord;
        } else {
            attendance.push(dailyRecord);
        }

        this.saveAttendance(attendance);
        return dailyRecord;
    },

    // Save attendance with notes
    saveDailyAttendanceWithNotes(date, classId, records, notes = {}) {
        const attendance = this.getAttendance();
        const existingIndex = attendance.findIndex(a => a.date === date && a.classId === classId);

        const dailyRecord = {
            date: date,
            classId: classId,
            records: records,
            notes: notes,
            savedAt: new Date().toISOString()
        };

        if (existingIndex !== -1) {
            // Merge with existing notes
            const existingNotes = attendance[existingIndex].notes || {};
            dailyRecord.notes = { ...existingNotes, ...notes };
            attendance[existingIndex] = dailyRecord;
        } else {
            attendance.push(dailyRecord);
        }

        this.saveAttendance(attendance);
        return dailyRecord;
    },,
    
    getAttendanceByDate(date, classId) {
        const attendance = this.getAttendance();
        return attendance.find(a => a.date === date && a.classId === classId);
    },
    
    getStudentAttendance(studentId, month, year) {
        const attendance = this.getAttendance();
        return attendance.filter(a => {
            const recordDate = new Date(a.date);
            return recordDate.getMonth() + 1 === month && 
                   recordDate.getFullYear() === year && 
                   a.records && a.records[studentId];
        });
    },
    
    getAttendanceSummary(classId, month, year) {
        const attendance = this.getAttendance();
        const monthAttendance = attendance.filter(a => {
            const recordDate = new Date(a.date);
            return recordDate.getMonth() + 1 === month && 
                   recordDate.getFullYear() === year && 
                   a.classId === classId;
        });
        
        let present = 0, absent = 0, late = 0, leave = 0;
        
        monthAttendance.forEach(record => {
            if (record.records) {
                Object.values(record.records).forEach(status => {
                    if (status === 'present') present++;
                    else if (status === 'absent') absent++;
                    else if (status === 'late') late++;
                    else if (status === 'leave') leave++;
                });
            }
        });
        
        return { present, absent, late, leave, totalDays: monthAttendance.length };
    },
    
    // ==================== Exam Operations ====================
    
    saveExams(exams) {
        localStorage.setItem(this.DB_PREFIX + 'exams', JSON.stringify(exams));
    },
    
    getExams() {
        const exams = localStorage.getItem(this.DB_PREFIX + 'exams');
        return exams ? JSON.parse(exams) : [...this.defaultExams];
    },
    
    addExam(examData) {
        const exams = this.getExams();
        const newExam = {
            id: Date.now(),
            name: examData.name,
            type: examData.type,
            classId: examData.classId,
            startDate: examData.startDate,
            endDate: examData.endDate,
            status: examData.status || 'upcoming'
        };
        exams.push(newExam);
        this.saveExams(exams);
        return newExam;
    },
    
    updateExam(id, updates) {
        const exams = this.getExams();
        const index = exams.findIndex(e => e.id === id);
        if (index !== -1) {
            exams[index] = { ...exams[index], ...updates };
            this.saveExams(exams);
            return exams[index];
        }
        return null;
    },
    
    deleteExam(id) {
        let exams = this.getExams();
        exams = exams.filter(e => e.id !== id);
        this.saveExams(exams);
    },
    
    getExamById(id) {
        const exams = this.getExams();
        return exams.find(e => e.id === id);
    },
    
    getExamsByClass(classId) {
        const exams = this.getExams();
        return exams.filter(e => e.classId === 0 || e.classId === classId);
    },
    
    // ==================== Result Operations ====================
    
    saveResults(results) {
        localStorage.setItem(this.DB_PREFIX + 'results', JSON.stringify(results));
    },
    
    getResults() {
        const results = localStorage.getItem(this.DB_PREFIX + 'results');
        return results ? JSON.parse(results) : [];
    },
    
    addResult(resultData) {
        const results = this.getResults();
        const newResult = {
            id: Date.now(),
            examId: resultData.examId,
            studentId: resultData.studentId,
            marks: resultData.marks,
            grade: resultData.grade,
            gpa: resultData.gpa,
            position: resultData.position || null,
            savedAt: new Date().toISOString()
        };
        results.push(newResult);
        this.saveResults(results);
        return newResult;
    },
    
    updateResult(id, updates) {
        const results = this.getResults();
        const index = results.findIndex(r => r.id === id);
        if (index !== -1) {
            results[index] = { ...results[index], ...updates };
            this.saveResults(results);
            return results[index];
        }
        return null;
    },
    
    getResultsByExam(examId) {
        const results = this.getResults();
        return results.filter(r => r.examId === examId);
    },
    
    getResultsByStudent(studentId) {
        const results = this.getResults();
        return results.filter(r => r.studentId === studentId);
    },
    
    getStudentResult(studentId, examId) {
        const results = this.getResults();
        return results.find(r => r.studentId === studentId && r.examId === examId);
    },
    
    calculateGrade(marks, totalMarks) {
        const percentage = (marks / totalMarks) * 100;
        if (percentage >= 90) return { grade: 'A+', gpa: 5.00 };
        if (percentage >= 80) return { grade: 'A', gpa: 4.00 };
        if (percentage >= 70) return { grade: 'A-', gpa: 3.50 };
        if (percentage >= 60) return { grade: 'B', gpa: 3.00 };
        if (percentage >= 50) return { grade: 'C', gpa: 2.00 };
        if (percentage >= 40) return { grade: 'D', gpa: 1.00 };
        return { grade: 'F', gpa: 0.00 };
    },
    
    getClassResults(examId, classId) {
        const students = this.getStudentsByClass(classId);
        const results = this.getResultsByExam(examId);
        
        return students.map(student => {
            const result = results.find(r => r.studentId === student.id);
            return {
                student: student,
                result: result
            };
        }).filter(item => item.student);
    },
    
    // ==================== Payment Operations ====================
    
    savePayments(payments) {
        localStorage.setItem(this.DB_PREFIX + 'payments', JSON.stringify(payments));
    },
    
    getPayments() {
        const payments = localStorage.getItem(this.DB_PREFIX + 'payments');
        return payments ? JSON.parse(payments) : [];
    },
    
    addPayment(paymentData) {
        const payments = this.getPayments();
        const newPayment = {
            id: Date.now(),
            transactionId: paymentData.transactionId || 'PAY-' + Date.now(),
            studentId: paymentData.studentId,
            feeId: paymentData.feeId,
            amount: paymentData.amount,
            method: paymentData.method,
            status: paymentData.status || 'completed',
            paidAt: new Date().toISOString(),
            processedBy: paymentData.processedBy || 'System'
        };
        payments.push(newPayment);
        this.savePayments(payments);
        return newPayment;
    },
    
    getPaymentsByStudent(studentId) {
        const payments = this.getPayments();
        return payments.filter(p => p.studentId === studentId);
    },
    
    getPaymentByTransactionId(transactionId) {
        const payments = this.getPayments();
        return payments.find(p => p.transactionId === transactionId);
    },
    
    getPaymentSummary(startDate, endDate) {
        const payments = this.getPayments();
        const filteredPayments = payments.filter(p => {
            const paymentDate = new Date(p.paidAt);
            return paymentDate >= new Date(startDate) && paymentDate <= new Date(endDate);
        });
        
        const total = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
        const byMethod = {};
        
        filteredPayments.forEach(p => {
            if (!byMethod[p.method]) byMethod[p.method] = 0;
            byMethod[p.method] += p.amount;
        });
        
        return { total, count: filteredPayments.length, byMethod };
    },
    
    // ==================== Notification Operations ====================
    
    saveNotifications(notifications) {
        localStorage.setItem(this.DB_PREFIX + 'notifications', JSON.stringify(notifications));
    },
    
    getNotifications() {
        const notifications = localStorage.getItem(this.DB_PREFIX + 'notifications');
        return notifications ? JSON.parse(notifications) : [];
    },
    
    addNotification(notificationData) {
        const notifications = this.getNotifications();
        const newNotification = {
            id: Date.now(),
            type: notificationData.type, // sms, email, whatsapp, system
            title: notificationData.title,
            message: notificationData.message,
            recipients: notificationData.recipients || [], // student IDs or 'all'
            sentAt: new Date().toISOString(),
            status: notificationData.status || 'sent',
            sentBy: notificationData.sentBy || 'Admin'
        };
        notifications.unshift(newNotification);
        this.saveNotifications(notifications);
        return newNotification;
    },
    
    getUnreadNotifications() {
        const notifications = this.getNotifications();
        return notifications.filter(n => n.status !== 'read');
    },
    
    markNotificationRead(id) {
        const notifications = this.getNotifications();
        const index = notifications.findIndex(n => n.id === id);
        if (index !== -1) {
            notifications[index].status = 'read';
            this.saveNotifications(notifications);
        }
    },
    
    markAllNotificationsRead() {
        const notifications = this.getNotifications();
        notifications.forEach(n => n.status = 'read');
        this.saveNotifications(notifications);
    },
    
    deleteNotification(id) {
        let notifications = this.getNotifications();
        notifications = notifications.filter(n => n.id !== id);
        this.saveNotifications(notifications);
    },
    
    // ==================== Admin Session ====================
    
    setAdminSession(user) {
        sessionStorage.setItem(this.DB_PREFIX + 'admin_user', JSON.stringify(user));
    },
    
    getAdminSession() {
        const user = sessionStorage.getItem(this.DB_PREFIX + 'admin_user');
        return user ? JSON.parse(user) : null;
    },
    
    clearAdminSession() {
        sessionStorage.removeItem(this.DB_PREFIX + 'admin_user');
    },
    
    isAdminLoggedIn() {
        return this.getAdminSession() !== null;
    },
    
    // ==================== Export/Import ====================
    
    exportData() {
        const data = {
            config: this.getConfig(),
            menu: this.getMenu(),
            sections: this.getSections(),
            hero: this.getHero(),
            features: this.getFeatures(),
            about: this.getAbout(),
            notices: this.getNotices(),
            cta: this.getCTA(),
            gallery: this.getGallery(),
            classes: this.getClasses(),
            subjects: this.getSubjects(),
            students: this.getStudents(),
            teachers: this.getTeachers(),
            feeTypes: this.getFeeTypes(),
            feeWaivers: this.getFeeWaivers(),
            fees: this.getFees(),
            exams: this.getExams(),
            results: this.getResults(),
            payments: this.getPayments(),
            notifications: this.getNotifications(),
            attendance: this.getAttendance()
        };
        return JSON.stringify(data, null, 2);
    },
    
    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            
            if (data.config) this.saveConfig(data.config);
            if (data.menu) this.saveMenu(data.menu);
            if (data.sections) this.saveSections(data.sections);
            if (data.hero) this.saveHero(data.hero);
            if (data.features) this.saveFeatures(data.features);
            if (data.about) this.saveAbout(data.about);
            if (data.notices) this.saveNotices(data.notices);
            if (data.cta) this.saveCTA(data.cta);
            if (data.gallery) this.saveGallery(data.gallery);
            if (data.classes) this.saveClasses(data.classes);
            if (data.subjects) this.saveSubjects(data.subjects);
            if (data.students) this.saveStudents(data.students);
            if (data.teachers) this.saveTeachers(data.teachers);
            if (data.feeTypes) this.saveFeeTypes(data.feeTypes);
            if (data.feeWaivers) this.saveFeeWaivers(data.feeWaivers);
            if (data.fees) this.saveFees(data.fees);
            if (data.exams) this.saveExams(data.exams);
            if (data.results) this.saveResults(data.results);
            if (data.payments) this.savePayments(data.payments);
            if (data.notifications) this.saveNotifications(data.notifications);
            if (data.attendance) this.saveAttendance(data.attendance);
            
            showToast('ডেটা ইমপোর্ট সফল হয়েছে', 'success');
            return true;
        } catch (error) {
            console.error('Import error:', error);
            showToast('ডেটা ইমপোর্ট ব্যর্থ হয়েছে', 'error');
            return false;
        }
    },
    
    // ==================== Statistics Helpers ====================
    
    getDashboardStats() {
        const students = this.getStudents();
        const teachers = this.getTeachers();
        const fees = this.getFees();
        const payments = this.getPayments();
        
        const activeStudents = students.filter(s => s.status === 'active').length;
        const activeTeachers = teachers.filter(t => t.status === 'active').length;
        
        const totalFeeCollection = payments.reduce((sum, p) => sum + p.amount, 0);
        const pendingFees = fees.filter(f => f.status === 'unpaid').length;
        
        const today = new Date().toLocaleDateString('bn-BD');
        const todayAttendance = this.getAttendance().filter(a => a.date === today).length;
        
        return {
            totalStudents: students.length,
            activeStudents,
            totalTeachers: teachers.length,
            activeTeachers,
            totalFeeCollection,
            pendingFees,
            todayAttendance
        };
    }
};

// Make it globally accessible
window.StorageManager = StorageManager;
