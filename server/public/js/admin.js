/**
 * পাঠশালা ই-ম্যানেজার - অ্যাডমিন ম্যানেজার
 * School Management System - Admin Manager
 * Orchestrator that fetches data via DataManager and passes to RenderManager
 */

const AdminManager = {
    // Drag and drop instances
    menuSortable: null,
    sectionSortable: null,
    
    // Current module state
    currentModule: 'dashboard',
    currentSubModule: null,
    
    // Data cache for performance
    dataCache: {},
    
    // Initialize admin panel
    async init() {
        this.initDragAndDrop();
        this.initEventListeners();
        this.initContentEditorTabs();
        this.initModuleTabs();
        
        // Load initial dashboard data
        await this.loadDashboardData();
    },
    
    // Initialize module tabs
    initModuleTabs() {
        const moduleTabs = document.querySelectorAll('.module-tab');
        moduleTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const module = tab.dataset.module;
                this.switchModule(module);
            });
        });
    },
    
    // Switch between modules
    async switchModule(moduleName) {
        this.currentModule = moduleName;
        
        // Update tab active states
        document.querySelectorAll('.module-tab').forEach(t => t.classList.remove('active'));
        document.querySelector(`.module-tab[data-module="${moduleName}"]`)?.classList.add('active');
        
        // Render module content with data
        await this.renderModuleContent(moduleName);
    },
    
    // Render module content based on module name
    async renderModuleContent(moduleName) {
        switch (moduleName) {
            case 'dashboard':
                await this.loadDashboardData();
                break;
            case 'students':
                await this.loadStudentData();
                break;
            case 'teachers':
                await this.loadTeacherData();
                break;
            case 'attendance':
                await this.loadAttendanceData();
                break;
            case 'classes':
                await this.loadClassData();
                break;
            case 'subjects':
                await this.loadSubjectData();
                break;
            case 'exams':
                await this.loadExamData();
                break;
            case 'results':
                await this.loadResultData();
                break;
            case 'routines':
                await this.loadRoutineData();
                break;
            case 'fees':
                await this.loadFeeData();
                break;
            case 'payments':
                await this.loadPaymentData();
                break;
            case 'calendar':
                await this.loadCalendarData();
                break;
            case 'notifications':
                await this.loadNotificationData();
                break;
            case 'settings':
                await this.loadSettingsData();
                break;
            default:
                RenderManager.switchAdminSection(moduleName);
        }
    },
    
    // ==================== Data Loading Methods ====================
    
    // Load dashboard data
    async loadDashboardData() {
        try {
            // Load all necessary data for dashboard
            const [students, teachers, classes, fees, notices, activities] = await Promise.all([
                DataManager.getStudents(),
                DataManager.getTeachers(),
                DataManager.getClasses(),
                DataManager.getFees(),
                DataManager.getNotices(),
                DataManager.getActivities()
            ]);
            
            // Calculate stats
            const stats = {
                totalStudents: students.length,
                activeStudents: students.filter(s => s.status === 'active').length,
                totalTeachers: teachers.length,
                activeTeachers: teachers.filter(t => t.status === 'active').length,
                totalClasses: classes.length,
                totalFeesCollected: fees.filter(f => f.status === 'paid').reduce((sum, f) => sum + (f.finalAmount || 0), 0),
                pendingFees: fees.filter(f => f.status !== 'paid').reduce((sum, f) => sum + (f.finalAmount || 0), 0),
                recentActivities: activities.slice(0, 5),
                recentNotices: notices.slice(0, 3)
            };
            
            RenderManager.renderDashboard(stats);
            RenderManager.switchAdminSection('dashboard');
            
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            RenderManager.renderError('dashboard-stats', 'ড্যাশবোর্ড ডেটা লোড করতে ব্যর্থ');
        }
    },
    
    // Load student data
    async loadStudentData() {
        try {
            RenderManager.renderLoading('student-table-container');
            
            const [students, classes] = await Promise.all([
                DataManager.getStudents(),
                DataManager.getClasses()
            ]);
            
            RenderManager.renderStudentList(students, classes);
            RenderManager.renderClassDropdown(classes);
            RenderManager.switchAdminSection('students');
            
        } catch (error) {
            console.error('Error loading student data:', error);
            RenderManager.renderError('student-table-container', 'শিক্ষার্থী ডেটা লোড করতে ব্যর্থ');
        }
    },
    
    // Load teacher data
    async loadTeacherData() {
        try {
            RenderManager.renderLoading('teacher-table-container');
            
            const teachers = await DataManager.getTeachers();
            RenderManager.renderTeacherList(teachers);
            RenderManager.switchAdminSection('teachers');
            
        } catch (error) {
            console.error('Error loading teacher data:', error);
            RenderManager.renderError('teacher-table-container', 'শিক্ষক ডেটা লোড করতে ব্যর্থ');
        }
    },
    
    // Load attendance data
    async loadAttendanceData() {
        try {
            const [classes, students] = await Promise.all([
                DataManager.getClasses(),
                DataManager.getStudents()
            ]);
            
            RenderManager.renderClassDropdown(classes);
            RenderManager.switchAdminSection('attendance');
            
        } catch (error) {
            console.error('Error loading attendance data:', error);
        }
    },
    
    // Load class data
    async loadClassData() {
        try {
            const classes = await DataManager.getClasses();
            RenderManager.renderClassList(classes);
            RenderManager.switchAdminSection('classes');
            
        } catch (error) {
            console.error('Error loading class data:', error);
        }
    },
    
    // Load subject data
    async loadSubjectData() {
        try {
            const subjects = await DataManager.getSubjects();
            RenderManager.renderSubjectList(subjects);
            RenderManager.switchAdminSection('subjects');
            
        } catch (error) {
            console.error('Error loading subject data:', error);
        }
    },
    
    // Load exam data
    async loadExamData() {
        try {
            RenderManager.renderLoading('exam-table-container');
            
            const [exams, classes] = await Promise.all([
                DataManager.getExams(),
                DataManager.getClasses()
            ]);
            
            RenderManager.renderExamList(exams, classes);
            RenderManager.renderClassDropdown(classes);
            RenderManager.switchAdminSection('exams');
            
        } catch (error) {
            console.error('Error loading exam data:', error);
            RenderManager.renderError('exam-table-container', 'পরীক্ষা ডেটা লোড করতে ব্যর্থ');
        }
    },
    
    // Load result data
    async loadResultData() {
        try {
            const [results, exams, students] = await Promise.all([
                DataManager.getResults(),
                DataManager.getExams(),
                DataManager.getStudents()
            ]);
            
            RenderManager.renderResultList(results, exams, students);
            RenderManager.switchAdminSection('results');
            
        } catch (error) {
            console.error('Error loading result data:', error);
        }
    },
    
    // Load routine data
    async loadRoutineData() {
        try {
            const [routines, classes] = await Promise.all([
                DataManager.getRoutines(),
                DataManager.getClasses()
            ]);
            
            RenderManager.renderRoutine(routines, classes);
            RenderManager.switchAdminSection('routines');
            
        } catch (error) {
            console.error('Error loading routine data:', error);
        }
    },
    
    // Load fee data
    async loadFeeData() {
        try {
            RenderManager.renderLoading('fee-table-container');
            
            const [fees, students, feeTypes] = await Promise.all([
                DataManager.getFees(),
                DataManager.getStudents(),
                DataManager.getFeeTypes()
            ]);
            
            RenderManager.renderFeeList(fees, students, feeTypes);
            RenderManager.renderClassDropdown(await DataManager.getClasses());
            RenderManager.switchAdminSection('fees');
            
        } catch (error) {
            console.error('Error loading fee data:', error);
            RenderManager.renderError('fee-table-container', 'ফি ডেটা লোড করতে ব্যর্থ');
        }
    },
    
    // Load payment data
    async loadPaymentData() {
        try {
            const [payments, students] = await Promise.all([
                DataManager.getPayments(),
                DataManager.getStudents()
            ]);
            
            RenderManager.renderPaymentList(payments, students);
            RenderManager.switchAdminSection('payments');
            
        } catch (error) {
            console.error('Error loading payment data:', error);
        }
    },
    
    // Load calendar data
    async loadCalendarData() {
        try {
            const events = await DataManager.getCalendarEvents();
            RenderManager.renderAcademicCalendar(events);
            RenderManager.switchAdminSection('calendar');
            
        } catch (error) {
            console.error('Error loading calendar data:', error);
        }
    },
    
    // Load notification data
    async loadNotificationData() {
        try {
            RenderManager.renderLoading('notification-list-container');
            
            const notifications = await DataManager.getNotifications();
            RenderManager.renderNotificationList(notifications);
            RenderManager.switchAdminSection('notifications');
            
        } catch (error) {
            console.error('Error loading notification data:', error);
            RenderManager.renderError('notification-list-container', 'নোটিফিকেশন ডেটা লোড করতে ব্যর্থ');
        }
    },
    
    // Load settings data
    async loadSettingsData() {
        try {
            const config = await DataManager.getConfig();
            RenderManager.renderLandingSettings(config);
            RenderManager.switchAdminSection('landing-settings');
            
        } catch (error) {
            console.error('Error loading settings data:', error);
        }
    },
    
    // Initialize drag and drop functionality
    initDragAndDrop() {
        // Menu drag and drop
        const menuList = document.getElementById('admin-menu-list');
        if (menuList) {
            this.menuSortable = new Sortable(menuList, {
                animation: 150,
                handle: '.drag-handle',
                ghostClass: 'sortable-ghost',
                onEnd: function(evt) {
                    console.log('Menu order changed');
                }
            });
        }
        
        // Section drag and drop
        const sectionList = document.getElementById('section-list');
        if (sectionList) {
            this.sectionSortable = new Sortable(sectionList, {
                animation: 150,
                handle: '.drag-handle',
                ghostClass: 'sortable-ghost',
                onEnd: function(evt) {
                    console.log('Section order changed');
                }
            });
        }
    },
    
    // Initialize all event listeners
    initEventListeners() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }
        
        // Add menu form
        const addMenuForm = document.getElementById('add-menu-form');
        if (addMenuForm) {
            addMenuForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addMenuItem();
            });
        }
        
        // Hero form
        const heroForm = document.getElementById('hero-form');
        if (heroForm) {
            heroForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveHeroContent();
            });
        }
        
        // About form
        const aboutForm = document.getElementById('about-form');
        if (aboutForm) {
            aboutForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveAboutContent();
            });
        }
        
        // CTA form
        const ctaForm = document.getElementById('cta-form');
        if (ctaForm) {
            ctaForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveCTAContent();
            });
        }
        
        // Add notice form
        const addNoticeForm = document.getElementById('add-notice-form');
        if (addNoticeForm) {
            addNoticeForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addNotice();
            });
        }
        
        // School info form
        const schoolInfoForm = document.getElementById('school-info-form');
        if (schoolInfoForm) {
            schoolInfoForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveSchoolInfo();
            });
        }
        
        // Gallery upload
        this.initGalleryUpload();
        
        // Image inputs with preview
        this.initImagePreviews();
        
        // Module form listeners
        this.initStudentFormListeners();
        this.initTeacherFormListeners();
        this.initAttendanceFormListeners();
        this.initFeeFormListeners();
        this.initExamFormListeners();
        this.initPaymentFormListeners();
        this.initNotificationFormListeners();
    },
    
    // Initialize content editor tabs
    initContentEditorTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabPanels = document.querySelectorAll('.tab-panel');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.dataset.tab;
                
                // Remove active from all
                tabBtns.forEach(b => b.classList.remove('active'));
                tabPanels.forEach(p => p.classList.remove('active'));
                
                // Add active to clicked
                btn.classList.add('active');
                const panel = document.getElementById(tabId);
                if (panel) panel.classList.add('active');
            });
        });
    },
    
    // Initialize gallery upload
    initGalleryUpload() {
        const uploadZone = document.getElementById('gallery-upload-zone');
        const uploadInput = document.getElementById('gallery-upload');
        
        if (uploadZone && uploadInput) {
            uploadZone.addEventListener('click', () => {
                uploadInput.click();
            });
            
            uploadZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadZone.style.borderColor = '#4f46e5';
            });
            
            uploadZone.addEventListener('dragleave', () => {
                uploadZone.style.borderColor = '#e5e7eb';
            });
            
            uploadZone.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadZone.style.borderColor = '#e5e7eb';
                const files = e.dataTransfer.files;
                this.handleGalleryUpload(files);
            });
            
            uploadInput.addEventListener('change', (e) => {
                this.handleGalleryUpload(e.target.files);
            });
        }
    },
    
    // Handle gallery image upload
    async handleGalleryUpload(files) {
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const imageData = {
                        src: e.target.result,
                        caption: file.name.replace(/\.[^/.]+$/, '')
                    };
                    
                    // Add via DataManager
                    DataManager.addGalleryImage(imageData).then(() => {
                        // Refresh gallery editor
                        this.refreshContentEditor();
                        showToast('ছবি যোগ করা হয়েছে', 'success');
                    });
                };
                reader.readAsDataURL(file);
            }
        });
    },
    
    // Refresh content editor with fresh data
    async refreshContentEditor() {
        const [hero, features, about, gallery, notices, cta] = await Promise.all([
            DataManager.getHero(),
            DataManager.getFeatures(),
            DataManager.getAbout(),
            DataManager.getGallery(),
            DataManager.getNotices(),
            DataManager.getCTA()
        ]);
        
        RenderManager.renderContentEditor({
            hero,
            features,
            about,
            gallery,
            notices,
            cta
        });
    },
    
    // Initialize image previews
    initImagePreviews() {
        // Hero background image
        const heroBgInput = document.getElementById('hero-bg-image');
        if (heroBgInput) {
            heroBgInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.previewImage(file, 'hero-bg-preview');
                }
            });
        }
        
        // About image
        const aboutImageInput = document.getElementById('about-image');
        if (aboutImageInput) {
            aboutImageInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.previewImage(file, 'about-image-preview');
                }
            });
        }
        
        // Student image
        const studentImageInput = document.getElementById('student-image');
        if (studentImageInput) {
            studentImageInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.previewImage(file, 'student-image-preview');
                }
            });
        }
        
        // Teacher image
        const teacherImageInput = document.getElementById('teacher-image');
        if (teacherImageInput) {
            teacherImageInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.previewImage(file, 'teacher-image-preview');
                }
            });
        }
    },
    
    // Preview image before upload
    previewImage(file, previewId) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById(previewId);
            if (preview) {
                preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            }
        };
        reader.readAsDataURL(file);
    },
    
    // ==================== Login Handling ====================
    
    handleLogin() {
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        // Simple admin check (in production, use proper authentication)
        if (username === 'admin' && password === 'admin123') {
            DataManager.setAdminSession({ username, loginTime: Date.now() });
            this.showAdminPanel();
            showToast('স্বাগতম! অ্যাডমিন প্যানেলে প্রবেশ করুন', 'success');
        } else {
            showToast('ব্যবহারকারীর নাম বা পাসওয়ার্ড ভুল', 'error');
        }
    },
    
    async showAdminPanel() {
        document.getElementById('login-modal').classList.remove('active');
        document.getElementById('public-view').classList.add('hidden');
        document.getElementById('admin-view').classList.remove('hidden');
        
        // Load admin content data
        const [menu, sections, config, hero, features, about, gallery, notices, cta] = await Promise.all([
            DataManager.getMenu(),
            DataManager.getSections(),
            DataManager.getConfig(),
            DataManager.getHero(),
            DataManager.getFeatures(),
            DataManager.getAbout(),
            DataManager.getGallery(),
            DataManager.getNotices(),
            DataManager.getCTA()
        ]);
        
        // Render all admin content
        RenderManager.renderAdminMenu(menu);
        RenderManager.renderPageSections(sections);
        RenderManager.renderContentEditor({
            hero,
            features,
            about,
            gallery,
            notices,
            cta
        });
        RenderManager.renderLandingSettings(config);
        
        // Load dashboard
        await this.loadDashboardData();
    },
    
    logout() {
        DataManager.clearAdminSession();
        document.getElementById('public-view').classList.remove('hidden');
        document.getElementById('admin-view').classList.add('hidden');
        showToast('লগআউট সম্পন্ন হয়েছে', 'info');
    },
    
    // ==================== Menu Management ====================
    
    async addMenuItem() {
        const name = document.getElementById('menu-item-name').value;
        const link = document.getElementById('menu-item-link').value;
        const parent = document.getElementById('menu-item-parent').value;
        
        if (!name || !link) {
            showToast('অনুগ্রহ করে সমস্ত ফিল্ড পূরণ করুন', 'error');
            return;
        }
        
        await DataManager.addMenuItem({
            name,
            link,
            parent: parent ? parseInt(parent) : null
        });
        
        // Reset form
        document.getElementById('menu-item-name').value = '';
        document.getElementById('menu-item-link').value = '';
        document.getElementById('menu-item-parent').value = '';
        
        // Refresh menu list
        const menu = await DataManager.getMenu();
        RenderManager.renderAdminMenu(menu);
        showToast('মেনু আইটেম যোগ করা হয়েছে', 'success');
    },
    
    async saveMenuOrder() {
        const menuList = document.getElementById('admin-menu-list');
        const items = menuList.querySelectorAll('li');
        const newOrder = [];
        
        items.forEach(item => {
            const id = parseInt(item.dataset.id);
            newOrder.push(id);
        });
        
        // Get current menu and reorder
        const currentMenu = await DataManager.getMenu();
        const reorderedMenu = newOrder.map(id => {
            return currentMenu.find(item => item.id === id);
        }).filter(Boolean);
        
        await DataManager.saveMenu(reorderedMenu);
        
        // Show success message
        const status = document.getElementById('menu-save-status');
        status.textContent = '✓ সেভ হয়েছে';
        status.classList.add('show');
        setTimeout(() => status.classList.remove('show'), 2000);
        
        // Refresh public menu
        const [config, menu] = await Promise.all([
            DataManager.getConfig(),
            DataManager.getMenu()
        ]);
        const sections = await DataManager.getSections();
        RenderManager.renderLandingPage(config, menu, sections);
    },
    
    // ==================== Section Management ====================
    
    async saveSectionOrder() {
        const sectionList = document.getElementById('section-list');
        const items = sectionList.querySelectorAll('li');
        const newOrder = [];
        
        items.forEach(item => {
            newOrder.push(item.dataset.id);
        });
        
        await DataManager.updateSectionOrder(newOrder);
        
        // Show success message
        const status = document.getElementById('section-save-status');
        status.textContent = '✓ সেভ হয়েছে';
        status.classList.add('show');
        setTimeout(() => status.classList.remove('show'), 2000);
        
        showToast('সেকশন অর্ডার সেভ করা হয়েছে', 'success');
    },
    
    async addNewSection() {
        const sectionName = prompt('নতুন সেকশনের নাম লিখুন:');
        if (sectionName) {
            const sectionId = 'custom_' + Date.now();
            await DataManager.addSection({
                id: sectionId,
                name: sectionName,
                type: 'custom'
            });
            const sections = await DataManager.getSections();
            RenderManager.renderPageSections(sections);
            showToast('নতুন সেকশন যোগ করা হয়েছে', 'success');
        }
    },
    
    async deleteSection(id) {
        if (confirm('এই সেকশন মুছে ফেলতে চান?')) {
            await DataManager.deleteSection(id);
            const sections = await DataManager.getSections();
            RenderManager.renderPageSections(sections);
            showToast('সেকশন মুছে ফেলা হয়েছে', 'success');
        }
    },
    
    // ==================== Content Editing ====================
    
    async saveHeroContent() {
        const title = document.getElementById('hero-title').value;
        const subtitle = document.getElementById('hero-subtitle').value;
        const buttonText = document.getElementById('hero-btn-text').value;
        const buttonLink = document.getElementById('hero-btn-link').value;
        
        const heroData = {
            title,
            subtitle,
            buttonText,
            buttonLink
        };
        
        // Handle background image
        const bgInput = document.getElementById('hero-bg-image');
        if (bgInput.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                heroData.backgroundImage = e.target.result;
                DataManager.updateHero(heroData).then(() => {
                    showToast('হিরো কন্টেন্ট সেভ করা হয়েছে', 'success');
                });
            };
            reader.readAsDataURL(bgInput.files[0]);
        } else {
            await DataManager.updateHero(heroData);
            showToast('হিরো কন্টেন্ট সেভ করা হয়েছে', 'success');
        }
    },
    
    async saveAboutContent() {
        const title = document.getElementById('about-title').value;
        const description = document.getElementById('about-description').value;
        
        const aboutData = {
            title,
            description
        };
        
        // Handle image
        const imageInput = document.getElementById('about-image');
        if (imageInput.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                aboutData.image = e.target.result;
                DataManager.updateAbout(aboutData).then(() => {
                    showToast('এবাউট কন্টেন্ট সেভ করা হয়েছে', 'success');
                });
            };
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            await DataManager.updateAbout(aboutData);
            showToast('এবাউট কন্টেন্ট সেভ করা হয়েছে', 'success');
        }
    },
    
    async saveCTAContent() {
        const title = document.getElementById('cta-title').value;
        const description = document.getElementById('cta-description').value;
        const buttonText = document.getElementById('cta-btn-text').value;
        const buttonLink = document.getElementById('cta-btn-link').value;
        
        await DataManager.updateCTA({
            title,
            description,
            buttonText,
            buttonLink
        });
        
        showToast('কল টু অ্যাকশন কন্টেন্ট সেভ করা হয়েছে', 'success');
    },
    
    async addFeature() {
        const title = prompt('ফিচার শিরোনাম লিখুন:');
        if (title) {
            const description = prompt('ফিচার বিবরণ লিখুন:') || '';
            const icon = prompt('আইকন ক্লাস (যেমন: fas fa-star):', 'fas fa-star');
            
            await DataManager.addFeature({ title, description, icon });
            
            const features = await DataManager.getFeatures();
            RenderManager.renderFeaturesEditor(features);
            showToast('ফিচার যোগ করা হয়েছে', 'success');
        }
    },
    
    async updateFeature(id, field, value) {
        await DataManager.updateFeature(id, { [field]: value });
    },
    
    async deleteFeature(id) {
        if (confirm('এই ফিচার মুছে ফেলতে চান?')) {
            await DataManager.deleteFeature(id);
            
            const features = await DataManager.getFeatures();
            RenderManager.renderFeaturesEditor(features);
            showToast('ফিচার মুছে ফেলা হয়েছে', 'success');
        }
    },
    
    async addNotice() {
        const title = document.getElementById('notice-title').value;
        const date = document.getElementById('notice-date').value;
        const description = document.getElementById('notice-description').value;
        
        if (!title || !date) {
            showToast('শিরোনাম এবং তারিখ প্রয়োজন', 'error');
            return;
        }
        
        // Format date
        const formattedDate = this.formatDate(date);
        
        await DataManager.addNotice({
            title,
            date: formattedDate,
            description
        });
        
        // Reset form
        document.getElementById('notice-title').value = '';
        document.getElementById('notice-date').value = '';
        document.getElementById('notice-description').value = '';
        
        const notices = await DataManager.getNotices();
        RenderManager.renderNoticesEditor(notices);
        showToast('নোটিশ যোগ করা হয়েছে', 'success');
    },
    
    async deleteNotice(id) {
        if (confirm('এই নোটিশ মুছে ফেলতে চান?')) {
            await DataManager.deleteNotice(id);
            
            const notices = await DataManager.getNotices();
            RenderManager.renderNoticesEditor(notices);
            showToast('নোটিশ মুছে ফেলা হয়েছে', 'success');
        }
    },
    
    async deleteGalleryImage(id) {
        if (confirm('এই ছবি মুছে ফেলতে চান?')) {
            await DataManager.deleteGalleryImage(id);
            
            const gallery = await DataManager.getGallery();
            RenderManager.renderGalleryEditor(gallery);
            showToast('ছবি মুছে ফেলা হয়েছে', 'success');
        }
    },
    
    // ==================== School Settings ====================
    
    async saveSchoolInfo() {
        const config = await DataManager.getConfig();
        
        config.name = document.getElementById('school-name').value;
        config.tagline = document.getElementById('school-tagline').value;
        config.established = document.getElementById('school-established').value;
        config.address = document.getElementById('school-address').value;
        config.phone = document.getElementById('school-phone').value;
        config.email = document.getElementById('school-email').value;
        config.facebook = document.getElementById('school-facebook').value;
        config.youtube = document.getElementById('school-youtube').value;
        
        // Handle logo upload
        const logoInput = document.getElementById('school-logo-upload');
        if (logoInput.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                config.logo = e.target.result;
                DataManager.saveConfig(config).then(() => {
                    showToast('সমস্ত সেটিংস সেভ করা হয়েছে', 'success');
                });
            };
            reader.readAsDataURL(logoInput.files[0]);
        } else {
            await DataManager.saveConfig(config);
            showToast('সমস্ত সেটিংস সেভ করা হয়েছে', 'success');
        }
    },
    
    // ==================== Student Module ====================
    
    initStudentFormListeners() {
        // Add student form
        const addStudentForm = document.getElementById('add-student-form');
        if (addStudentForm) {
            addStudentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addStudent();
            });
        }
        
        // Search students
        const studentSearch = document.getElementById('student-search');
        if (studentSearch) {
            studentSearch.addEventListener('input', (e) => {
                this.searchStudents(e.target.value);
            });
        }
        
        // Filter by class
        const studentClassFilter = document.getElementById('student-class-filter');
        if (studentClassFilter) {
            studentClassFilter.addEventListener('change', async (e) => {
                const classId = parseInt(e.target.value);
                const students = await DataManager.getStudentsByClass(classId);
                const classes = await DataManager.getClasses();
                RenderManager.renderStudentList(students, classes);
            });
        }
    },
    
    async addStudent() {
        const studentData = {
            firstName: document.getElementById('student-first-name').value,
            lastName: document.getElementById('student-last-name').value,
            gender: document.getElementById('student-gender').value,
            dateOfBirth: document.getElementById('student-dob').value,
            religion: document.getElementById('student-religion').value,
            bloodGroup: document.getElementById('student-blood-group').value,
            phone: document.getElementById('student-phone').value,
            email: document.getElementById('student-email').value,
            classId: parseInt(document.getElementById('student-class').value),
            section: document.getElementById('student-section').value,
            rollNumber: parseInt(document.getElementById('student-roll').value) || 0,
            fatherName: document.getElementById('student-father-name').value,
            fatherPhone: document.getElementById('student-father-phone').value,
            motherName: document.getElementById('student-mother-name').value,
            address: document.getElementById('student-address').value
        };
        
        if (!studentData.firstName || !studentData.classId) {
            showToast('অনুগ্রহ করে প্রয়োজনীয় তথ্য পূরণ করুন', 'error');
            return;
        }
        
        const newStudent = await DataManager.addStudent(studentData);
        
        // Handle image
        const imageInput = document.getElementById('student-image');
        if (imageInput.files[0]) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                await DataManager.updateStudent(newStudent.id, { image: e.target.result });
                this.resetStudentForm();
                showToast('শিক্ষার্থী যোগ করা হয়েছে', 'success');
            };
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            this.resetStudentForm();
            showToast('শিক্ষার্থী যোগ করা হয়েছে', 'success');
        }
    },
    
    async updateStudent() {
        const studentId = document.getElementById('edit-student-id').value;
        if (!studentId) return;
        
        const studentData = {
            firstName: document.getElementById('edit-student-first-name').value,
            lastName: document.getElementById('edit-student-last-name').value,
            gender: document.getElementById('edit-student-gender').value,
            dateOfBirth: document.getElementById('edit-student-dob').value,
            religion: document.getElementById('edit-student-religion').value,
            bloodGroup: document.getElementById('edit-student-blood-group').value,
            phone: document.getElementById('edit-student-phone').value,
            email: document.getElementById('edit-student-email').value,
            classId: parseInt(document.getElementById('edit-student-class').value),
            section: document.getElementById('edit-student-section').value,
            rollNumber: parseInt(document.getElementById('edit-student-roll').value) || 0,
            fatherName: document.getElementById('edit-student-father-name').value,
            fatherPhone: document.getElementById('edit-student-father-phone').value,
            motherName: document.getElementById('edit-student-mother-name').value,
            address: document.getElementById('edit-student-address').value,
            status: document.getElementById('edit-student-status').value
        };
        
        await DataManager.updateStudent(parseInt(studentId), studentData);
        this.closeModal('student-edit-modal');
        await this.loadStudentData();
        showToast('শিক্ষার্থীর তথ্য আপডেট হয়েছে', 'success');
    },
    
    async deleteStudent(id) {
        if (confirm('এই শিক্ষার্থী মুছে ফেলতে চান?')) {
            await DataManager.deleteStudent(id);
            await this.loadStudentData();
            showToast('শিক্ষার্থী মুছে ফেলা হয়েছে', 'success');
        }
    },
    
    async editStudent(id) {
        const student = await DataManager.getStudentById(id);
        if (!student) return;
        
        document.getElementById('edit-student-id').value = student.id;
        document.getElementById('edit-student-first-name').value = student.firstName || '';
        document.getElementById('edit-student-last-name').value = student.lastName || '';
        document.getElementById('edit-student-gender').value = student.gender || '';
        document.getElementById('edit-student-dob').value = student.dateOfBirth || '';
        document.getElementById('edit-student-religion').value = student.religion || '';
        document.getElementById('edit-student-blood-group').value = student.bloodGroup || '';
        document.getElementById('edit-student-phone').value = student.phone || '';
        document.getElementById('edit-student-email').value = student.email || '';
        document.getElementById('edit-student-class').value = student.classId || '';
        document.getElementById('edit-student-section').value = student.section || '';
        document.getElementById('edit-student-roll').value = student.rollNumber || '';
        document.getElementById('edit-student-father-name').value = student.fatherName || '';
        document.getElementById('edit-student-father-phone').value = student.fatherPhone || '';
        document.getElementById('edit-student-mother-name').value = student.motherName || '';
        document.getElementById('edit-student-address').value = student.address || '';
        document.getElementById('edit-student-status').value = student.status || 'active';
        
        this.openModal('student-edit-modal');
    },
    
    async resetStudentForm() {
        document.getElementById('add-student-form').reset();
        document.getElementById('student-image-preview').innerHTML = '<i class="fas fa-user"></i>';
        await this.loadStudentData();
    },
    
    async searchStudents(query) {
        if (query.length < 2) {
            await this.loadStudentData();
            return;
        }
        const results = await DataManager.searchStudents(query);
        const classes = await DataManager.getClasses();
        RenderManager.renderStudentList(results, classes);
    },
    
    // ==================== Teacher Module ====================
    
    initTeacherFormListeners() {
        const addTeacherForm = document.getElementById('add-teacher-form');
        if (addTeacherForm) {
            addTeacherForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addTeacher();
            });
        }
        
        const teacherSearch = document.getElementById('teacher-search');
        if (teacherSearch) {
            teacherSearch.addEventListener('input', (e) => {
                this.searchTeachers(e.target.value);
            });
        }
    },
    
    async addTeacher() {
        const teacherData = {
            firstName: document.getElementById('teacher-first-name').value,
            lastName: document.getElementById('teacher-last-name').value,
            gender: document.getElementById('teacher-gender').value,
            dateOfBirth: document.getElementById('teacher-dob').value,
            qualification: document.getElementById('teacher-qualification').value,
            designation: document.getElementById('teacher-designation').value,
            subject: document.getElementById('teacher-subject').value,
            phone: document.getElementById('teacher-phone').value,
            email: document.getElementById('teacher-email').value,
            joinDate: document.getElementById('teacher-join-date').value,
            address: document.getElementById('teacher-address').value
        };
        
        if (!teacherData.firstName || !teacherData.subject) {
            showToast('অনুগ্রহ করে প্রয়োজনীয় তথ্য পূরণ করুন', 'error');
            return;
        }
        
        const newTeacher = await DataManager.addTeacher(teacherData);
        
        // Handle image
        const imageInput = document.getElementById('teacher-image');
        if (imageInput.files[0]) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                await DataManager.updateTeacher(newTeacher.id, { image: e.target.result });
                this.resetTeacherForm();
                showToast('শিক্ষক যোগ করা হয়েছে', 'success');
            };
            reader.readAsDataURL(imageInput.files[0]);
        } else {
            this.resetTeacherForm();
            showToast('শিক্ষক যোগ করা হয়েছে', 'success');
        }
    },
    
    async updateTeacher() {
        const teacherId = document.getElementById('edit-teacher-id').value;
        if (!teacherId) return;
        
        const teacherData = {
            firstName: document.getElementById('edit-teacher-first-name').value,
            lastName: document.getElementById('edit-teacher-last-name').value,
            gender: document.getElementById('edit-teacher-gender').value,
            dateOfBirth: document.getElementById('edit-teacher-dob').value,
            qualification: document.getElementById('edit-teacher-qualification').value,
            designation: document.getElementById('edit-teacher-designation').value,
            subject: document.getElementById('edit-teacher-subject').value,
            phone: document.getElementById('edit-teacher-phone').value,
            email: document.getElementById('edit-teacher-email').value,
            joinDate: document.getElementById('edit-teacher-join-date').value,
            address: document.getElementById('edit-teacher-address').value,
            status: document.getElementById('edit-teacher-status').value
        };
        
        await DataManager.updateTeacher(parseInt(teacherId), teacherData);
        this.closeModal('teacher-edit-modal');
        await this.loadTeacherData();
        showToast('শিক্ষকের তথ্য আপডেট হয়েছে', 'success');
    },
    
    async deleteTeacher(id) {
        if (confirm('এই শিক্ষক মুছে ফেলতে চান?')) {
            await DataManager.deleteTeacher(id);
            await this.loadTeacherData();
            showToast('শিক্ষক মুছে ফেলা হয়েছে', 'success');
        }
    },
    
    async editTeacher(id) {
        const teacher = await DataManager.getTeacherById(id);
        if (!teacher) return;
        
        document.getElementById('edit-teacher-id').value = teacher.id;
        document.getElementById('edit-teacher-first-name').value = teacher.firstName || '';
        document.getElementById('edit-teacher-last-name').value = teacher.lastName || '';
        document.getElementById('edit-teacher-gender').value = teacher.gender || '';
        document.getElementById('edit-teacher-dob').value = teacher.dateOfBirth || '';
        document.getElementById('edit-teacher-qualification').value = teacher.qualification || '';
        document.getElementById('edit-teacher-designation').value = teacher.designation || '';
        document.getElementById('edit-teacher-subject').value = teacher.subject || '';
        document.getElementById('edit-teacher-phone').value = teacher.phone || '';
        document.getElementById('edit-teacher-email').value = teacher.email || '';
        document.getElementById('edit-teacher-join-date').value = teacher.joinDate || '';
        document.getElementById('edit-teacher-address').value = teacher.address || '';
        document.getElementById('edit-teacher-status').value = teacher.status || 'active';
        
        this.openModal('teacher-edit-modal');
    },
    
    async resetTeacherForm() {
        document.getElementById('add-teacher-form').reset();
        document.getElementById('teacher-image-preview').innerHTML = '<i class="fas fa-user"></i>';
        await this.loadTeacherData();
    },
    
    async searchTeachers(query) {
        if (query.length < 2) {
            await this.loadTeacherData();
            return;
        }
        const results = await DataManager.searchTeachers(query);
        RenderManager.renderTeacherList(results);
    },
    
    // ==================== Attendance Module ====================
    
    initAttendanceFormListeners() {
        const takeAttendanceBtn = document.getElementById('take-attendance-btn');
        if (takeAttendanceBtn) {
            takeAttendanceBtn.addEventListener('click', () => {
                this.loadAttendanceForm();
            });
        }
        
        const saveAttendanceBtn = document.getElementById('save-attendance-btn');
        if (saveAttendanceBtn) {
            saveAttendanceBtn.addEventListener('click', () => {
                this.saveDailyAttendance();
            });
        }
        
        const attendanceDate = document.getElementById('attendance-date');
        if (attendanceDate) {
            attendanceDate.valueAsDate = new Date();
            attendanceDate.addEventListener('change', () => {
                this.loadAttendanceForm();
            });
        }
        
        const attendanceClass = document.getElementById('attendance-class');
        if (attendanceClass) {
            attendanceClass.addEventListener('change', () => {
                this.loadAttendanceForm();
            });
        }
        
        // Mark all buttons
        const markAllPresent = document.getElementById('mark-all-present');
        if (markAllPresent) {
            markAllPresent.addEventListener('click', () => {
                this.markAllAttendance('present');
            });
        }
        
        const markAllAbsent = document.getElementById('mark-all-absent');
        if (markAllAbsent) {
            markAllAbsent.addEventListener('click', () => {
                this.markAllAttendance('absent');
            });
        }
    },
    
    async loadAttendanceForm() {
        const classId = parseInt(document.getElementById('attendance-class').value);
        const date = document.getElementById('attendance-date').value;
        
        if (!classId) {
            showToast('শ্রেণি নির্বাচন করুন', 'error');
            return;
        }
        
        const [students, existingAttendance] = await Promise.all([
            DataManager.getStudentsByClass(classId),
            DataManager.getAttendanceByDate(date, classId)
        ]);
        
        RenderManager.renderAttendanceForm(students, existingAttendance?.records || {});
    },
    
    markAllAttendance(status) {
        const buttons = document.querySelectorAll('.attendance-btn');
        buttons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.status === status) {
                btn.classList.add('active');
            }
        });
        
        // Also update hidden inputs
        const inputs = document.querySelectorAll('[name="attendance-status"]');
        inputs.forEach(input => {
            input.value = status;
        });
    },
    
    async saveDailyAttendance() {
        const classId = parseInt(document.getElementById('attendance-class').value);
        const date = document.getElementById('attendance-date').value;
        
        if (!classId) {
            showToast('শ্রেণি নির্বাচন করুন', 'error');
            return;
        }
        
        const records = {};
        const studentInputs = document.querySelectorAll('[name="attendance-status"]');
        studentInputs.forEach(input => {
            records[input.dataset.studentId] = input.value;
        });
        
        await DataManager.saveDailyAttendance(date, classId, records);
        showToast('উপস্থিতি সেভ করা হয়েছে', 'success');
    },
    
    // ==================== Fee Module ====================
    
    initFeeFormListeners() {
        const createInvoiceBtn = document.getElementById('create-invoice-btn');
        if (createInvoiceBtn) {
            createInvoiceBtn.addEventListener('click', () => {
                this.createInvoice();
            });
        }
        
        const feeClassFilter = document.getElementById('fee-class-filter');
        if (feeClassFilter) {
            feeClassFilter.addEventListener('change', async (e) => {
                const classId = parseInt(e.target.value);
                const fees = await DataManager.getFeesByClass(classId);
                const students = await DataManager.getStudents();
                const feeTypes = await DataManager.getFeeTypes();
                RenderManager.renderFeeList(fees, students, feeTypes);
            });
        }
        
        const feeStatusFilter = document.getElementById('fee-status-filter');
        if (feeStatusFilter) {
            feeStatusFilter.addEventListener('change', async (e) => {
                const status = e.target.value;
                const fees = await DataManager.getFeesByStatus(status);
                const students = await DataManager.getStudents();
                const feeTypes = await DataManager.getFeeTypes();
                RenderManager.renderFeeList(fees, students, feeTypes);
            });
        }
    },
    
    async createInvoice() {
        const studentId = document.getElementById('invoice-student').value;
        const feeTypeId = document.getElementById('invoice-fee-type').value;
        const dueDate = document.getElementById('invoice-due-date').value;
        const notes = document.getElementById('invoice-notes').value;
        
        if (!studentId || !feeTypeId) {
            showToast('শিক্ষার্থী এবং ফি প্রকার নির্বাচন করুন', 'error');
            return;
        }
        
        const [feeTypes, student] = await Promise.all([
            DataManager.getFeeTypes(),
            DataManager.getStudentById(parseInt(studentId))
        ]);
        
        const feeType = feeTypes.find(f => f.id === parseInt(feeTypeId));
        
        if (!feeType || !student) return;
        
        await DataManager.addFee({
            studentId: parseInt(studentId),
            feeTypeId: parseInt(feeTypeId),
            feeTypeName: feeType.name,
            amount: feeType.amount,
            waiver: 0,
            finalAmount: feeType.amount,
            dueDate: dueDate,
            status: 'unpaid',
            notes: notes
        });
        
        showToast('ইনভয়েস তৈরি হয়েছে', 'success');
        await this.loadFeeData();
    },
    
    async generateBulkInvoice() {
        const classId = parseInt(document.getElementById('bulk-fee-class').value);
        const feeTypeId = document.getElementById('bulk-fee-type').value;
        const dueDate = document.getElementById('bulk-fee-due-date').value;
        
        if (!classId || !feeTypeId) {
            showToast('শ্রেণি এবং ফি প্রকার নির্বাচন করুন', 'error');
            return;
        }
        
        const [students, feeTypes] = await Promise.all([
            DataManager.getStudentsByClass(classId),
            DataManager.getFeeTypes()
        ]);
        
        const feeType = feeTypes.find(f => f.id === parseInt(feeTypeId));
        
        if (!feeType) return;
        
        let count = 0;
        for (const student of students) {
            await DataManager.addFee({
                studentId: student.id,
                feeTypeId: feeType.id,
                feeTypeName: feeType.name,
                amount: feeType.amount,
                waiver: 0,
                finalAmount: feeType.amount,
                dueDate: dueDate,
                status: 'unpaid'
            });
            count++;
        }
        
        showToast(`${count}টি ইনভয়েস তৈরি হয়েছে`, 'success');
        await this.loadFeeData();
    },
    
    async deleteFee(id) {
        if (confirm('এই ইনভয়েস মুছে ফেলতে চান?')) {
            await DataManager.deleteFee(id);
            await this.loadFeeData();
            showToast('ইনভয়েস মুছে ফেলা হয়েছে', 'success');
        }
    },
    
    // ==================== Exam Module ====================
    
    initExamFormListeners() {
        const addExamForm = document.getElementById('add-exam-form');
        if (addExamForm) {
            addExamForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addExam();
            });
        }
        
        const examClassFilter = document.getElementById('exam-class-filter');
        if (examClassFilter) {
            examClassFilter.addEventListener('change', async (e) => {
                const classId = parseInt(e.target.value);
                const exams = await DataManager.getExamsByClass(classId);
                const classes = await DataManager.getClasses();
                RenderManager.renderExamList(exams, classes);
            });
        }
    },
    
    async addExam() {
        const examData = {
            name: document.getElementById('exam-name').value,
            type: document.getElementById('exam-type').value,
            classId: parseInt(document.getElementById('exam-class').value),
            startDate: document.getElementById('exam-start-date').value,
            endDate: document.getElementById('exam-end-date').value
        };
        
        if (!examData.name || !examData.startDate) {
            showToast('পরীক্ষার নাম এবং তারিখ প্রয়োজন', 'error');
            return;
        }
        
        examData.startDate = this.formatDate(examData.startDate);
        examData.endDate = this.formatDate(examData.endDate);
        
        await DataManager.addExam(examData);
        document.getElementById('add-exam-form').reset();
        await this.loadExamData();
        showToast('পরীক্ষা যোগ করা হয়েছে', 'success');
    },
    
    async updateExam() {
        const examId = document.getElementById('edit-exam-id').value;
        if (!examId) return;
        
        const examData = {
            name: document.getElementById('edit-exam-name').value,
            type: document.getElementById('edit-exam-type').value,
            classId: parseInt(document.getElementById('edit-exam-class').value),
            status: document.getElementById('edit-exam-status').value
        };
        
        await DataManager.updateExam(parseInt(examId), examData);
        this.closeModal('exam-edit-modal');
        await this.loadExamData();
        showToast('পরীক্ষার তথ্য আপডেট হয়েছে', 'success');
    },
    
    async deleteExam(id) {
        if (confirm('এই পরীক্ষা মুছে ফেলতে চান?')) {
            await DataManager.deleteExam(id);
            await this.loadExamData();
            showToast('পরীক্ষা মুছে ফেলা হয়েছে', 'success');
        }
    },
    
    async editExam(id) {
        const exam = await DataManager.getExamById(id);
        if (!exam) return;
        
        document.getElementById('edit-exam-id').value = exam.id;
        document.getElementById('edit-exam-name').value = exam.name || '';
        document.getElementById('edit-exam-type').value = exam.type || '';
        document.getElementById('edit-exam-class').value = exam.classId || '';
        document.getElementById('edit-exam-status').value = exam.status || 'upcoming';
        
        this.openModal('exam-edit-modal');
    },
    
    // ==================== Result Module ====================
    
    async addResult(examId, studentId, marks) {
        const student = await DataManager.getStudentById(studentId);
        
        if (!student) return;
        
        // Calculate grade based on first subject for simplicity
        const gradeResult = await DataManager.calculateGrade(marks, 100);
        
        await DataManager.addResult({
            examId: examId,
            studentId: studentId,
            marks: marks,
            grade: gradeResult.grade,
            gpa: gradeResult.gpa
        });
    },
    
    // ==================== Payment Module ====================
    
    initPaymentFormListeners() {
        const paymentForm = document.getElementById('payment-form');
        if (paymentForm) {
            paymentForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.processPayment();
            });
        }
        
        const paymentMethodBtns = document.querySelectorAll('.payment-method');
        paymentMethodBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.payment-method').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById('selected-payment-method').value = btn.dataset.method;
            });
        });
    },
    
    async processPayment() {
        const studentId = parseInt(document.getElementById('payment-student').value);
        const feeId = parseInt(document.getElementById('payment-fee').value);
        const method = document.getElementById('selected-payment-method').value;
        
        if (!studentId || !feeId || !method) {
            showToast('সমস্ত তথ্য পূরণ করুন', 'error');
            return;
        }
        
        const fee = await DataManager.getFeeById(feeId);
        
        if (!fee) return;
        
        // Process payment
        const transactionId = 'TXN-' + Date.now();
        
        await DataManager.addPayment({
            studentId: studentId,
            feeId: feeId,
            amount: fee.finalAmount,
            method: method,
            transactionId: transactionId
        });
        
        // Update fee status
        await DataManager.updateFee(feeId, {
            status: 'paid',
            paidDate: new Date().toLocaleDateString('bn-BD'),
            paymentMethod: method,
            transactionId: transactionId
        });
        
        showToast('পেমেন্ট সফল! লেনদেন আইডি: ' + transactionId, 'success');
        this.closeModal('payment-modal');
        await this.loadFeeData();
    },
    
    async openPaymentModal(feeId) {
        const fee = await DataManager.getFeeById(feeId);
        
        if (!fee) return;
        
        const student = await DataManager.getStudentById(fee.studentId);
        if (!student) return;
        
        document.getElementById('payment-student').value = student.id;
        document.getElementById('payment-student-name').textContent = student.banglaName || `${student.firstName} ${student.lastName}`;
        document.getElementById('payment-fee').value = fee.id;
        document.getElementById('payment-amount').textContent = RenderManager.formatCurrency(fee.finalAmount);
        document.getElementById('payment-description').textContent = fee.feeTypeName;
        
        this.openModal('payment-modal');
    },
    
    // ==================== Notification Module ====================
    
    initNotificationFormListeners() {
        const sendNotificationForm = document.getElementById('send-notification-form');
        if (sendNotificationForm) {
            sendNotificationForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.sendNotification();
            });
        }
        
        const notificationTypeBtns = document.querySelectorAll('.notification-type-btn');
        notificationTypeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.notification-type-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    },
    
    async sendNotification() {
        const type = document.querySelector('.notification-type-btn.active')?.dataset.type || 'system';
        const title = document.getElementById('notification-title').value;
        const message = document.getElementById('notification-message').value;
        const recipients = document.getElementById('notification-recipients').value;
        
        if (!title || !message) {
            showToast('শিরোনাম এবং বার্তা প্রয়োজন', 'error');
            return;
        }
        
        let recipientList = [];
        if (recipients === 'all') {
            const students = await DataManager.getStudents();
            recipientList = students.map(s => s.id);
        } else if (recipients) {
            recipientList = recipients.split(',').map(id => parseInt(id.trim()));
        }
        
        // Send notification
        await DataManager.addNotification({
            type: type,
            title: title,
            message: message,
            recipients: recipientList,
            status: 'sent'
        });
        
        showToast('নোটিফিকেশন পাঠানো হয়েছে', 'success');
        document.getElementById('send-notification-form').reset();
        await this.loadNotificationData();
    },
    
    async deleteNotification(id) {
        if (confirm('এই নোটিফিকেশন মুছে ফেলতে চান?')) {
            await DataManager.deleteNotification(id);
            await this.loadNotificationData();
            showToast('নোটিফিকেশন মুছে ফেলা হয়েছে', 'success');
        }
    },
    
    // ==================== Modal Helpers ====================
    
    openModal(modalId) {
        document.getElementById(modalId)?.classList.add('open');
    },
    
    closeModal(modalId) {
        document.getElementById(modalId)?.classList.remove('open');
    },
    
    // ==================== Utility Functions ====================
    
    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 
                       'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
        return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
    },
    
    formatCurrency(amount) {
        return new Intl.NumberFormat('bn-BD').format(amount) + ' টাকা';
    },
    
    getBanglaNumber(number) {
        const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
        return String(number).split('').map(d => banglaDigits[parseInt(d)] || d).join('');
    }
};

// Make it globally accessible
window.AdminManager = AdminManager;
