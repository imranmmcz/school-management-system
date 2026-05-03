/**
 * পাঠশালা ই-ম্যানেজার - রেন্ডার ম্যানেজার
 * School Management System - Render Manager
 * Pure rendering engine - all functions accept data as arguments
 */

const RenderManager = {
    // ==================== Public Landing Page Rendering ====================
    
    // Render complete landing page
    renderLandingPage(config, menu, sections) {
        // Update header
        this.renderHeader(config, menu);
        
        // Update footer
        this.renderFooter(config);
        
        // Render content sections
        const contentContainer = document.getElementById('landing-content');
        if (contentContainer) {
            contentContainer.innerHTML = '';
            
            // Sort sections by order
            sections.sort((a, b) => a.order - b.order);
            
            // Render each section
            sections.forEach(section => {
                const sectionElement = this.renderSection(section);
                if (sectionElement) {
                    contentContainer.appendChild(sectionElement);
                }
            });
        }
    },
    
    // Render header
    renderHeader(config, menu) {
        // Update school name
        const headerName = document.getElementById('header-school-name');
        if (headerName) headerName.textContent = config.name;
        
        const headerTagline = document.getElementById('header-school-tagline');
        if (headerTagline) headerTagline.textContent = config.tagline;
        
        // Update logo
        const logoImg = document.getElementById('school-logo');
        if (logoImg && config.logo) {
            logoImg.src = config.logo;
        }
        
        // Render navigation menu
        const navMenu = document.getElementById('nav-menu');
        const mobileNav = document.getElementById('mobile-nav-menu');
        
        if (navMenu) {
            navMenu.innerHTML = '';
            menu.forEach(item => {
                if (!item.parent) {
                    const li = document.createElement('li');
                    li.innerHTML = `<a href="${item.link}">${item.name}</a>`;
                    navMenu.appendChild(li);
                }
            });
        }
        
        if (mobileNav) {
            mobileNav.innerHTML = '';
            menu.forEach(item => {
                if (!item.parent) {
                    const li = document.createElement('li');
                    li.innerHTML = `<a href="${item.link}">${item.name}</a>`;
                    mobileNav.appendChild(li);
                }
            });
        }
    },
    
    // Render footer
    renderFooter(config) {
        const footerAddress = document.getElementById('footer-address');
        const footerPhone = document.getElementById('footer-phone');
        const footerEmail = document.getElementById('footer-email');
        
        if (footerAddress) footerAddress.textContent = config.address;
        if (footerPhone) footerPhone.textContent = config.phone;
        if (footerEmail) footerEmail.textContent = config.email;
    },
    
    // Render a section
    renderSection(section) {
        switch (section.type) {
            case 'hero':
                return this.renderHeroSection(section.data);
            case 'features':
                return this.renderFeaturesSection(section.data);
            case 'about':
                return this.renderAboutSection(section.data);
            case 'gallery':
                return this.renderGallerySection(section.data);
            case 'notices':
                return this.renderNoticesSection(section.data);
            case 'cta':
                return this.renderCTASection(section.data);
            default:
                return this.renderCustomSection(section);
        }
    },
    
    // Render hero section
    renderHeroSection(hero = {}) {
        const section = document.createElement('section');
        section.className = 'hero-section';
        section.id = 'hero';
        
        const bgStyle = hero.backgroundImage 
            ? `background-image: linear-gradient(135deg, rgba(0, 105, 92, 0.9), rgba(0, 77, 64, 0.8)), url('${hero.backgroundImage}');`
            : '';
        
        section.innerHTML = `
            <div class="hero-content">
                <h1>${hero.title || ''}</h1>
                <p>${hero.subtitle || ''}</p>
                <a href="${hero.buttonLink || '#'}" class="btn-cta">${hero.buttonText || ''}</a>
            </div>
        `;
        
        if (bgStyle) {
            section.style = bgStyle;
        }
        
        return section;
    },
    
    // Render features section
    renderFeaturesSection(features = []) {
        const section = document.createElement('section');
        section.className = 'features-section';
        section.id = 'features';
        
        let featuresHTML = '<div class="features-grid">';
        features.forEach(feature => {
            featuresHTML += `
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="${feature.icon || 'fas fa-star'}"></i>
                    </div>
                    <h3>${feature.title || ''}</h3>
                    <p>${feature.description || ''}</p>
                </div>
            `;
        });
        featuresHTML += '</div>';
        
        section.innerHTML = `
            <div class="section-header">
                <h2>আমাদের বৈশিষ্ট্য</h2>
                <p>শিক্ষার্থীদের সর্বোত্তম শিক্ষা প্রদানের জন্য আমরা যা করি</p>
            </div>
            ${featuresHTML}
        `;
        
        return section;
    },
    
    // Render about section
    renderAboutSection(about = {}) {
        const section = document.createElement('section');
        section.className = 'about-section';
        section.id = 'about';
        
        section.innerHTML = `
            <div class="about-container">
                <div class="about-image">
                    ${about.image 
                        ? `<img src="${about.image}" alt="আমাদের সম্পর্কে">`
                        : '<div style="background: linear-gradient(135deg, var(--primary-color), var(--primary-light)); width: 100%; height: 400px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem;">ছবি যোগ করুন</div>'
                    }
                </div>
                <div class="about-content">
                    <h2>${about.title || ''}</h2>
                    ${(about.description || '').split('\n').map(p => `<p>${p}</p>`).join('')}
                    <div class="about-features">
                        <div class="about-feature-item">
                            <i class="fas fa-check-circle"></i>
                            <span>অভিজ্ঞ শিক্ষকমণ্ডলী</span>
                        </div>
                        <div class="about-feature-item">
                            <i class="fas fa-check-circle"></i>
                            <span>আধুনিক সুবিধাদি</span>
                        </div>
                        <div class="about-feature-item">
                            <i class="fas fa-check-circle"></i>
                            <span>সুরক্ষিত পরিবেশ</span>
                        </div>
                        <div class="about-feature-item">
                            <i class="fas fa-check-circle"></i>
                            <span>সর্বোত্তম শিক্ষা</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        return section;
    },
    
    // Render gallery section
    renderGallerySection(gallery = []) {
        const section = document.createElement('section');
        section.className = 'gallery-section';
        section.id = 'gallery';
        
        let galleryHTML = '<div class="gallery-grid">';
        if (gallery.length === 0) {
            galleryHTML += `
                <div class="gallery-item" style="background: var(--bg-light); display: flex; align-items: center; justify-content: center; min-height: 250px;">
                    <p style="color: var(--text-medium);">এখনো কোনো ছবি যোগ করা হয়নি</p>
                </div>
            `;
        } else {
            gallery.forEach(img => {
                galleryHTML += `
                    <div class="gallery-item">
                        <img src="${img.src || ''}" alt="${img.caption || ''}">
                        <div class="gallery-overlay">
                            <span>${img.caption || ''}</span>
                        </div>
                    </div>
                `;
            });
        }
        galleryHTML += '</div>';
        
        section.innerHTML = `
            <div class="section-header">
                <h2>ফটো গ্যালারি</h2>
                <p>আমাদের স্কুলের মুহূর্তগুলো</p>
            </div>
            ${galleryHTML}
        `;
        
        return section;
    },
    
    // Render notices section
    renderNoticesSection(notices = []) {
        const section = document.createElement('section');
        section.className = 'notice-section';
        section.id = 'notices';
        
        let noticesHTML = '';
        notices.forEach(notice => {
            noticesHTML += `
                <div class="notice-item">
                    <span class="notice-date">${notice.date || ''}</span>
                    <h4>${notice.title || ''}</h4>
                    <p>${notice.description || ''}</p>
                </div>
            `;
        });
        
        section.innerHTML = `
            <div class="notice-container">
                <div class="section-header">
                    <h2>নোটিশ বোর্ড</h2>
                    <p>সাম্প্রতিক নোটিশ এবং ঘোষণা</p>
                </div>
                <div class="notice-board">
                    <div class="notice-header">
                        <h3><i class="fas fa-bullhorn"></i> সাম্প্রতিক নোটিশ</h3>
                    </div>
                    <div class="notice-list">
                        ${noticesHTML}
                    </div>
                </div>
            </div>
        `;
        
        return section;
    },
    
    // Render CTA section
    renderCTASection(cta = {}) {
        const section = document.createElement('section');
        section.className = 'cta-section';
        section.id = 'cta';
        
        section.innerHTML = `
            <div class="cta-content">
                <h2>${cta.title || ''}</h2>
                <p>${cta.description || ''}</p>
                <a href="${cta.buttonLink || '#'}" class="btn-cta">${cta.buttonText || ''}</a>
            </div>
        `;
        
        return section;
    },
    
    // Render custom section
    renderCustomSection(section) {
        const el = document.createElement('section');
        el.id = section.id;
        el.className = 'custom-section';
        el.innerHTML = `
            <div class="section-header">
                <h2>${section.name || ''}</h2>
            </div>
            <p style="text-align: center; color: var(--text-medium);">এই সেকশনের জন্য কন্টেন্ট যোগ করুন</p>
        `;
        return el;
    },
    
    // ==================== Admin Panel Rendering ====================
    
    // Render admin menu
    renderAdminMenu(menu = []) {
        const menuList = document.getElementById('admin-menu-list');
        const parentSelect = document.getElementById('menu-item-parent');
        
        if (menuList) {
            menuList.innerHTML = '';
            menu.forEach(item => {
                const li = document.createElement('li');
                li.dataset.id = item.id;
                li.innerHTML = `
                    <div class="menu-item-info">
                        <span class="drag-handle"><i class="fas fa-grip-vertical"></i></span>
                        <span>${item.name || ''}</span>
                    </div>
                    <div class="menu-actions">
                        <button class="edit-menu" title="সম্পাদনা"><i class="fas fa-edit"></i></button>
                        <button class="delete" title="মুছুন"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                menuList.appendChild(li);
            });
        }
        
        if (parentSelect) {
            parentSelect.innerHTML = '<option value="">কোনো প্যারেন্ট নেই (মূল মেনু)</option>';
            menu.forEach(item => {
                if (!item.parent) {
                    const option = document.createElement('option');
                    option.value = item.id;
                    option.textContent = item.name;
                    parentSelect.appendChild(option);
                }
            });
        }
    },
    
    // Render page sections
    renderPageSections(sections = []) {
        const sectionList = document.getElementById('section-list');
        
        if (sectionList) {
            sectionList.innerHTML = '';
            sections.sort((a, b) => a.order - b.order).forEach(section => {
                const li = document.createElement('li');
                li.dataset.id = section.id;
                li.innerHTML = `
                    <div class="section-info">
                        <span class="drag-handle"><i class="fas fa-grip-vertical"></i></span>
                        <span>${section.name || ''}</span>
                    </div>
                    <label class="visibility-toggle">
                        <input type="checkbox" ${section.visible ? 'checked' : ''} onchange="toggleSectionVisibility('${section.id}')">
                        <span class="toggle-label">${section.visible ? 'সক্রিয়' : 'নিষ্ক্রিয়'}</span>
                    </label>
                `;
                sectionList.appendChild(li);
            });
        }
    },
    
    // Render content editor - accepts all data objects
    renderContentEditor(editorData = {}) {
        this.renderHeroEditor(editorData.hero);
        this.renderFeaturesEditor(editorData.features);
        this.renderAboutEditor(editorData.about);
        this.renderGalleryEditor(editorData.gallery);
        this.renderNoticesEditor(editorData.notices);
        this.renderCTAEditor(editorData.cta);
    },
    
    // Render hero editor
    renderHeroEditor(hero = {}) {
        const titleInput = document.getElementById('hero-title');
        const subtitleInput = document.getElementById('hero-subtitle');
        const btnTextInput = document.getElementById('hero-btn-text');
        const btnLinkInput = document.getElementById('hero-btn-link');
        
        if (titleInput) titleInput.value = hero.title || '';
        if (subtitleInput) subtitleInput.value = hero.subtitle || '';
        if (btnTextInput) btnTextInput.value = hero.buttonText || '';
        if (btnLinkInput) btnLinkInput.value = hero.buttonLink || '';
        
        // Render preview
        const preview = document.getElementById('hero-bg-preview');
        if (preview && hero.backgroundImage) {
            preview.innerHTML = `<img src="${hero.backgroundImage}" alt="Preview">`;
        } else if (preview) {
            preview.innerHTML = '';
        }
    },
    
    // Render features editor
    renderFeaturesEditor(features = []) {
        const featuresList = document.getElementById('features-list');
        
        if (featuresList) {
            featuresList.innerHTML = '';
            features.forEach(feature => {
                const div = document.createElement('div');
                div.className = 'feature-edit-item';
                div.innerHTML = `
                    <button class="remove-feature" onclick="deleteFeature(${feature.id})">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="form-group">
                        <label>ফিচার শিরোনাম</label>
                        <input type="text" value="${feature.title || ''}" onchange="updateFeature(${feature.id}, 'title', this.value)">
                    </div>
                    <div class="form-group">
                        <label>ফিচার বিবরণ</label>
                        <textarea rows="2" onchange="updateFeature(${feature.id}, 'description', this.value)">${feature.description || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label>আইকন</label>
                        <input type="text" value="${feature.icon || ''}" placeholder="fas fa-star" onchange="updateFeature(${feature.id}, 'icon', this.value)">
                    </div>
                `;
                featuresList.appendChild(div);
            });
        }
    },
    
    // Render about editor
    renderAboutEditor(about = {}) {
        const titleInput = document.getElementById('about-title');
        const descInput = document.getElementById('about-description');
        
        if (titleInput) titleInput.value = about.title || '';
        if (descInput) descInput.value = about.description || '';
        
        // Render preview
        const preview = document.getElementById('about-image-preview');
        if (preview && about.image) {
            preview.innerHTML = `<img src="${about.image}" alt="Preview">`;
        } else if (preview) {
            preview.innerHTML = '';
        }
    },
    
    // Render gallery editor
    renderGalleryEditor(gallery = []) {
        const galleryList = document.getElementById('gallery-images-list');
        
        if (galleryList) {
            galleryList.innerHTML = '';
            gallery.forEach(img => {
                const div = document.createElement('div');
                div.className = 'gallery-edit-item';
                div.innerHTML = `
                    <img src="${img.src || ''}" alt="${img.caption || ''}">
                    <button class="remove-image" onclick="deleteGalleryImage(${img.id})">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                galleryList.appendChild(div);
            });
        }
    },
    
    // Render notices editor
    renderNoticesEditor(notices = []) {
        const noticesList = document.getElementById('notices-list');
        
        if (noticesList) {
            noticesList.innerHTML = '';
            notices.forEach(notice => {
                const div = document.createElement('div');
                div.className = 'notice-edit-item';
                div.innerHTML = `
                    <div class="notice-info">
                        <h4>${notice.title || ''}</h4>
                        <span>${notice.date || ''}</span>
                    </div>
                    <button class="delete" onclick="deleteNotice(${notice.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                noticesList.appendChild(div);
            });
        }
    },
    
    // Render CTA editor
    renderCTAEditor(cta = {}) {
        const titleInput = document.getElementById('cta-title');
        const descInput = document.getElementById('cta-description');
        const btnTextInput = document.getElementById('cta-btn-text');
        const btnLinkInput = document.getElementById('cta-btn-link');
        
        if (titleInput) titleInput.value = cta.title || '';
        if (descInput) descInput.value = cta.description || '';
        if (btnTextInput) btnTextInput.value = cta.buttonText || '';
        if (btnLinkInput) btnLinkInput.value = cta.buttonLink || '';
    },
    
    // Render landing settings
    renderLandingSettings(config = {}) {
        document.getElementById('school-name').value = config.name || '';
        document.getElementById('school-tagline').value = config.tagline || '';
        document.getElementById('school-established').value = config.established || '';
        document.getElementById('school-address').value = config.address || '';
        document.getElementById('school-phone').value = config.phone || '';
        document.getElementById('school-email').value = config.email || '';
        document.getElementById('school-facebook').value = config.facebook || '';
        document.getElementById('school-youtube').value = config.youtube || '';
    },
    
    // Render preview
    renderPreview() {
        const previewContent = document.getElementById('preview-content');
        if (previewContent) {
            const content = document.getElementById('landing-content');
            if (content) {
                previewContent.innerHTML = content.innerHTML;
            }
        }
    },
    
    // ==================== Dashboard Rendering ====================
    
    // Render dashboard statistics
    renderDashboard(stats = {}) {
        // Render student stats
        const totalStudents = document.getElementById('total-students');
        if (totalStudents) totalStudents.textContent = this.formatNumber(stats.totalStudents || 0);
        
        const activeStudents = document.getElementById('active-students');
        if (activeStudents) activeStudents.textContent = this.formatNumber(stats.activeStudents || 0);
        
        // Render teacher stats
        const totalTeachers = document.getElementById('total-teachers');
        if (totalTeachers) totalTeachers.textContent = this.formatNumber(stats.totalTeachers || 0);
        
        const activeTeachers = document.getElementById('active-teachers');
        if (activeTeachers) activeTeachers.textContent = this.formatNumber(stats.activeTeachers || 0);
        
        // Render class stats
        const totalClasses = document.getElementById('total-classes');
        if (totalClasses) totalClasses.textContent = this.formatNumber(stats.totalClasses || 0);
        
        // Render fee stats
        const totalFees = document.getElementById('total-fees');
        if (totalFees) totalFees.textContent = this.formatCurrency(stats.totalFeesCollected || 0);
        
        const pendingFees = document.getElementById('pending-fees');
        if (pendingFees) pendingFees.textContent = this.formatCurrency(stats.pendingFees || 0);
        
        // Render recent activities
        this.renderRecentActivities(stats.recentActivities || []);
        
        // Render notices
        this.renderDashboardNotices(stats.recentNotices || []);
    },
    
    // Format number
    formatNumber(num) {
        return new Intl.NumberFormat('bn-BD').format(num);
    },
    
    // Format currency
    formatCurrency(amount) {
        return new Intl.NumberFormat('bn-BD').format(amount) + ' টাকা';
    },
    
    // Render recent activities
    renderRecentActivities(activities = []) {
        const activityList = document.getElementById('recent-activities');
        if (!activityList) return;
        
        activityList.innerHTML = '';
        activities.forEach(activity => {
            const li = document.createElement('li');
            li.className = 'activity-item';
            li.innerHTML = `
                <div class="activity-icon">
                    <i class="${activity.icon || 'fas fa-circle'}"></i>
                </div>
                <div class="activity-content">
                    <p>${activity.description || ''}</p>
                    <span class="activity-time">${activity.time || ''}</span>
                </div>
            `;
            activityList.appendChild(li);
        });
    },
    
    // Render dashboard notices
    renderDashboardNotices(notices = []) {
        const noticesContainer = document.getElementById('dashboard-notices');
        if (!noticesContainer) return;
        
        noticesContainer.innerHTML = '';
        notices.forEach(notice => {
            const div = document.createElement('div');
            div.className = 'dashboard-notice-item';
            div.innerHTML = `
                <span class="notice-date">${notice.date || ''}</span>
                <h4>${notice.title || ''}</h4>
            `;
            noticesContainer.appendChild(div);
        });
    },
    
    // ==================== Module List Rendering ====================
    
    // Render student list
    renderStudentList(students = [], classes = []) {
        const studentTable = document.getElementById('student-table');
        if (!studentTable) return;
        
        const tbody = studentTable.querySelector('tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        if (students.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="10" style="text-align: center; padding: 40px; color: var(--text-medium);">
                        কোনো শিক্ষার্থী পাওয়া যায়নি
                    </td>
                </tr>
            `;
            return;
        }
        
        students.forEach(student => {
            const tr = document.createElement('tr');
            tr.dataset.id = student.id;
            
            // Find class name
            const classObj = classes.find(c => c.id === student.classId);
            const className = classObj ? classObj.name : '-';
            
            tr.innerHTML = `
                <td>
                    <div class="student-info">
                        <div class="student-avatar">
                            ${student.image ? `<img src="${student.image}" alt="${student.firstName}">` : '<i class="fas fa-user"></i>'}
                        </div>
                        <div class="student-details">
                            <span class="student-name">${student.firstName || ''} ${student.lastName || ''}</span>
                            <span class="student-id">আইডি: ${student.id}</span>
                        </div>
                    </div>
                </td>
                <td>${student.banglaName || '-'}</td>
                <td>${className}</td>
                <td>${student.rollNumber || '-'}</td>
                <td>${student.gender || '-'}</td>
                <td>${student.phone || '-'}</td>
                <td>${student.fatherName || '-'}</td>
                <td>
                    <span class="status-badge ${student.status || 'active'}">${student.status === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}</span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon edit" onclick="editStudent(${student.id})" title="সম্পাদনা">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon delete" onclick="deleteStudent(${student.id})" title="মুছুন">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    },
    
    // Render teacher list
    renderTeacherList(teachers = []) {
        const teacherTable = document.getElementById('teacher-table');
        if (!teacherTable) return;
        
        const tbody = teacherTable.querySelector('tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        if (teachers.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="9" style="text-align: center; padding: 40px; color: var(--text-medium);">
                        কোনো শিক্ষক পাওয়া যায়নি
                    </td>
                </tr>
            `;
            return;
        }
        
        teachers.forEach(teacher => {
            const tr = document.createElement('tr');
            tr.dataset.id = teacher.id;
            
            tr.innerHTML = `
                <td>
                    <div class="teacher-info">
                        <div class="teacher-avatar">
                            ${teacher.image ? `<img src="${teacher.image}" alt="${teacher.firstName}">` : '<i class="fas fa-user"></i>'}
                        </div>
                        <div class="teacher-details">
                            <span class="teacher-name">${teacher.firstName || ''} ${teacher.lastName || ''}</span>
                            <span class="teacher-id">আইডি: ${teacher.id}</span>
                        </div>
                    </div>
                </td>
                <td>${teacher.designation || '-'}</td>
                <td>${teacher.subject || '-'}</td>
                <td>${teacher.qualification || '-'}</td>
                <td>${teacher.phone || '-'}</td>
                <td>${teacher.email || '-'}</td>
                <td>
                    <span class="status-badge ${teacher.status || 'active'}">${teacher.status === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}</span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon edit" onclick="editTeacher(${teacher.id})" title="সম্পাদনা">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon delete" onclick="deleteTeacher(${teacher.id})" title="মুছুন">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    },
    
    // Render attendance form
    renderAttendanceForm(students = [], existingRecords = {}) {
        const formContainer = document.getElementById('attendance-form-container');
        if (!formContainer) return;
        
        formContainer.innerHTML = '';
        
        if (students.length === 0) {
            formContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-users"></i>
                    <p>এই শ্রেণিতে কোনো শিক্ষার্থী নেই</p>
                </div>
            `;
            return;
        }
        
        students.forEach(student => {
            const record = existingRecords[student.id] || 'present';
            const div = document.createElement('div');
            div.className = 'attendance-row';
            div.dataset.studentId = student.id;
            
            div.innerHTML = `
                <div class="student-info">
                    <div class="student-avatar">
                        ${student.image ? `<img src="${student.image}" alt="${student.firstName}">` : '<i class="fas fa-user"></i>'}
                    </div>
                    <div class="student-details">
                        <span class="student-name">${student.firstName || ''} ${student.lastName || ''}</span>
                        <span class="student-roll">রোল: ${student.rollNumber || '-'}</span>
                    </div>
                </div>
                <div class="attendance-buttons">
                    <button type="button" class="attendance-btn ${record === 'present' ? 'active' : ''}" data-status="present" onclick="setAttendance(this, 'present')">
                        <i class="fas fa-check"></i> উপস্থিত
                    </button>
                    <button type="button" class="attendance-btn ${record === 'absent' ? 'active' : ''}" data-status="absent" onclick="setAttendance(this, 'absent')">
                        <i class="fas fa-times"></i> অনুপস্থিত
                    </button>
                    <button type="button" class="attendance-btn ${record === 'late' ? 'active' : ''}" data-status="late" onclick="setAttendance(this, 'late')">
                        <i class="fas fa-clock"></i> দেরি
                    </button>
                    <button type="button" class="attendance-btn ${record === 'leave' ? 'active' : ''}" data-status="leave" onclick="setAttendance(this, 'leave')">
                        <i class="fas fa-calendar"></i> ছুটি
                    </button>
                </div>
                <input type="hidden" name="attendance-status" data-student-id="${student.id}" value="${record}">
            `;
            formContainer.appendChild(div);
        });
    },
    
    // Render fee list
    renderFeeList(fees = [], students = [], feeTypes = []) {
        const feeTable = document.getElementById('fee-table');
        if (!feeTable) return;
        
        const tbody = feeTable.querySelector('tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        if (fees.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="9" style="text-align: center; padding: 40px; color: var(--text-medium);">
                        কোনো ফি রেকর্ড পাওয়া যায়নি
                    </td>
                </tr>
            `;
            return;
        }
        
        fees.forEach(fee => {
            const student = students.find(s => s.id === fee.studentId);
            const tr = document.createElement('tr');
            tr.dataset.id = fee.id;
            
            tr.innerHTML = `
                <td>${fee.id}</td>
                <td>${student ? `${student.firstName} ${student.lastName}` : '-'}</td>
                <td>${fee.feeTypeName || '-'}</td>
                <td>${this.formatCurrency(fee.amount)}</td>
                <td>${this.formatCurrency(fee.waiver || 0)}</td>
                <td>${this.formatCurrency(fee.finalAmount)}</td>
                <td>${fee.dueDate || '-'}</td>
                <td>
                    <span class="status-badge ${fee.status}">${fee.status === 'paid' ? 'পরিশোধিত' : 'বকেয়া'}</span>
                </td>
                <td>
                    <div class="action-buttons">
                        ${fee.status !== 'paid' ? `
                            <button class="btn-icon pay" onclick="openPaymentModal(${fee.id})" title="পেমেন্ট">
                                <i class="fas fa-credit-card"></i>
                            </button>
                        ` : ''}
                        <button class="btn-icon delete" onclick="deleteFee(${fee.id})" title="মুছুন">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    },
    
    // Render exam list
    renderExamList(exams = [], classes = []) {
        const examTable = document.getElementById('exam-table');
        if (!examTable) return;
        
        const tbody = examTable.querySelector('tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        if (exams.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-medium);">
                        কোনো পরীক্ষা পাওয়া যায়নি
                    </td>
                </tr>
            `;
            return;
        }
        
        exams.forEach(exam => {
            const classObj = classes.find(c => c.id === exam.classId);
            const tr = document.createElement('tr');
            tr.dataset.id = exam.id;
            
            tr.innerHTML = `
                <td>${exam.name || '-'}</td>
                <td>${exam.type || '-'}</td>
                <td>${classObj ? classObj.name : '-'}</td>
                <td>${exam.startDate || '-'}</td>
                <td>${exam.endDate || '-'}</td>
                <td>
                    <span class="status-badge ${exam.status || 'upcoming'}">${exam.status === 'upcoming' ? 'আসন্ন' : exam.status === 'ongoing' : 'চলমান' : 'সম্পন্ন'}</span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon edit" onclick="editExam(${exam.id})" title="সম্পাদনা">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon delete" onclick="deleteExam(${exam.id})" title="মুছুন">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    },
    
    // Render notification list
    renderNotificationList(notifications = []) {
        const notificationList = document.getElementById('notification-list');
        if (!notificationList) return;
        
        notificationList.innerHTML = '';
        
        if (notifications.length === 0) {
            notificationList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-bell"></i>
                    <p>কোনো নোটিফিকেশন নেই</p>
                </div>
            `;
            return;
        }
        
        notifications.forEach(notification => {
            const div = document.createElement('div');
            div.className = 'notification-item';
            div.dataset.id = notification.id;
            
            div.innerHTML = `
                <div class="notification-header">
                    <h4>${notification.title || ''}</h4>
                    <span class="notification-time">${notification.time || ''}</span>
                </div>
                <p>${notification.message || ''}</p>
                <div class="notification-footer">
                    <span class="notification-type">${notification.type || 'system'}</span>
                    <button class="btn-icon delete" onclick="deleteNotification(${notification.id})" title="মুছুন">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            notificationList.appendChild(div);
        });
    },
    
    // Render classes for dropdowns
    renderClassDropdown(classes = [], selectedId = null) {
        const classSelects = document.querySelectorAll('[id*="class"][id*="-filter"], [id*="-class"], [id*="class-"]');
        
        classSelects.forEach(select => {
            const currentValue = select.value;
            select.innerHTML = '<option value="">শ্রেণি নির্বাচন করুন</option>';
            
            classes.forEach(cls => {
                const option = document.createElement('option');
                option.value = cls.id;
                option.textContent = cls.name;
                if (selectedId && cls.id === selectedId) {
                    option.selected = true;
                }
                select.appendChild(option);
            });
            
            // Restore value if it was set
            if (currentValue) {
                select.value = currentValue;
            }
        });
    },
    
    // Render subjects
    renderSubjectList(subjects = []) {
        const subjectTable = document.getElementById('subject-table');
        if (!subjectTable) return;
        
        const tbody = subjectTable.querySelector('tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        subjects.forEach(subject => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${subject.code || '-'}</td>
                <td>${subject.name || '-'}</td>
                <td>${subject.type || '-'}</td>
                <td>${subject.fullMarks || 100}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon edit" onclick="editSubject(${subject.id})" title="সম্পাদনা">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon delete" onclick="deleteSubject(${subject.id})" title="মুছুন">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    },
    
    // Render class list
    renderClassList(classes = []) {
        const classTable = document.getElementById('class-table');
        if (!classTable) return;
        
        const tbody = classTable.querySelector('tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        if (classes.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 40px; color: var(--text-medium);">
                        কোনো শ্রেণি পাওয়া যায়নি
                    </td>
                </tr>
            `;
            return;
        }
        
        classes.forEach(cls => {
            const tr = document.createElement('tr');
            tr.dataset.id = cls.id;
            
            tr.innerHTML = `
                <td>${cls.id}</td>
                <td>${cls.name || '-'}</td>
                <td>${cls.section || '-'}</td>
                <td>${cls.teacher || '-'}</td>
                <td>
                    <span class="status-badge ${cls.status || 'active'}">${cls.status === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}</span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon edit" onclick="editClass(${cls.id})" title="সম্পাদনা">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon delete" onclick="deleteClass(${cls.id})" title="মুছুন">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    },
    
    // Render routine
    renderRoutine(routineData = [], classes = []) {
        const routineContainer = document.getElementById('routine-container');
        if (!routineContainer) return;
        
        routineContainer.innerHTML = '';
        
        const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
        const dayNames = ['শনিবার', 'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার'];
        
        // Create class tabs
        if (classes.length > 0) {
            const tabsContainer = document.createElement('div');
            tabsContainer.className = 'routine-tabs';
            tabsContainer.innerHTML = classes.map(cls => 
                `<button class="routine-tab" data-class-id="${cls.id}">${cls.name}</button>`
            ).join('');
            routineContainer.appendChild(tabsContainer);
        }
        
        // Create routine table
        const table = document.createElement('table');
        table.className = 'routine-table';
        table.innerHTML = `
            <thead>
                <tr>
                    <th>দিন</th>
                    <th>পিরিয়ড ১</th>
                    <th>পিরিয়ড ২</th>
                    <th>পিরিয়ড ৩</th>
                    <th>পিরিয়ড ৪</th>
                    <th>পিরিয়ড ৫</th>
                    <th>পিরিয়ড ৬</th>
                </tr>
            </thead>
            <tbody>
                ${days.map((day, index) => `
                    <tr>
                        <td>${dayNames[index]}</td>
                        ${[1, 2, 3, 4, 5, 6].map(period => {
                            const periodData = routineData.find(r => r.day === day && r.period === period) || {};
                            return `
                                <td class="routine-cell" data-day="${day}" data-period="${period}">
                                    ${periodData.subject || '-'}
                                    ${periodData.teacher ? `<br><small>${periodData.teacher}</small>` : ''}
                                </td>
                            `;
                        }).join('')}
                    </tr>
                `).join('')}
            </tbody>
        `;
        routineContainer.appendChild(table);
    },
    
    // Render results
    renderResultList(results = [], exams = [], students = []) {
        const resultTable = document.getElementById('result-table');
        if (!resultTable) return;
        
        const tbody = resultTable.querySelector('tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        results.forEach(result => {
            const exam = exams.find(e => e.id === result.examId);
            const student = students.find(s => s.id === result.studentId);
            const tr = document.createElement('tr');
            
            tr.innerHTML = `
                <td>${exam ? exam.name : '-'}</td>
                <td>${student ? `${student.firstName} ${student.lastName}` : '-'}</td>
                <td>${result.totalMarks || 0}</td>
                <td>${result.grade || '-'}</td>
                <td>${result.gpa || 0}</td>
                <td>
                    <span class="status-badge ${result.status || 'published'}">${result.status === 'published' ? 'প্রকাশিত' : 'খসড়া'}</span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon view" onclick="viewResult(${result.id})" title="দেখুন">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    },
    
    // Render payments
    renderPaymentList(payments = [], students = []) {
        const paymentTable = document.getElementById('payment-table');
        if (!paymentTable) return;
        
        const tbody = paymentTable.querySelector('tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        payments.forEach(payment => {
            const student = students.find(s => s.id === payment.studentId);
            const tr = document.createElement('tr');
            
            tr.innerHTML = `
                <td>${payment.id}</td>
                <td>${student ? `${student.firstName} ${student.lastName}` : '-'}</td>
                <td>${this.formatCurrency(payment.amount)}</td>
                <td>${payment.method || '-'}</td>
                <td>${payment.transactionId || '-'}</td>
                <td>${payment.date || '-'}</td>
                <td>
                    <span class="status-badge success">সফল</span>
                </td>
            `;
            tbody.appendChild(tr);
        });
    },
    
    // Render academic calendar
    renderAcademicCalendar(events = []) {
        const calendarContainer = document.getElementById('academic-calendar');
        if (!calendarContainer) return;
        
        calendarContainer.innerHTML = '';
        
        events.forEach(event => {
            const div = document.createElement('div');
            div.className = 'calendar-event';
            div.dataset.id = event.id;
            
            div.innerHTML = `
                <div class="event-date">
                    <span class="day">${event.day || ''}</span>
                    <span class="month">${event.month || ''}</span>
                </div>
                <div class="event-details">
                    <h4>${event.title || ''}</h4>
                    <p>${event.description || ''}</p>
                    <span class="event-type">${event.type || 'holiday'}</span>
                </div>
            `;
            calendarContainer.appendChild(div);
        });
    },
    
    // ==================== Utility Functions ====================
    
    // Switch admin section
    switchAdminSection(sectionName, data = {}) {
        // Hide all sections
        document.querySelectorAll('.admin-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Remove active class from nav items
        document.querySelectorAll('.sidebar-nav li').forEach(li => {
            li.classList.remove('active');
        });
        
        // Show selected section
        const targetSection = document.getElementById(sectionName + '-section');
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        // Update nav active state
        const navItem = document.querySelector(`.sidebar-nav li[data-section="${sectionName}"]`);
        if (navItem) {
            navItem.classList.add('active');
        }
        
        // Update breadcrumb
        const breadcrumbTitle = document.getElementById('current-section-title');
        if (breadcrumbTitle) {
            const titles = {
                'dashboard': 'ড্যাশবোর্ড',
                'menu-manager': 'মেনু ম্যানেজার',
                'page-builder': 'পেজ বিল্ডার',
                'content-editor': 'কন্টেন্ট এডিটর',
                'landing-settings': 'ল্যান্ডিং সেটিংস',
                'full-menu': 'সম্পূর্ণ মেনু',
                'preview': 'সাইট প্রিভিউ'
            };
            breadcrumbTitle.textContent = titles[sectionName] || sectionName;
        }
    },
    
    // Render loading state
    renderLoading(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="loading-state">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>লোড হচ্ছে...</p>
                </div>
            `;
        }
    },
    
    // Render error state
    renderError(containerId, message) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>${message || 'কিছু ভুল হয়েছে'}</p>
                </div>
            `;
        }
    },
    
    // Render empty state
    renderEmpty(containerId, message) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <p>${message || 'কোনো ডেটা নেই'}</p>
                </div>
            `;
        }
    }
};

// Make it globally accessible
window.RenderManager = RenderManager;
