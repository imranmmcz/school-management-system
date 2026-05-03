/**
 * পাঠশালা ই-ম্যানেজার - মূল অ্যাপ্লিকেশন
 * School Management System - Main initialization and global Application
 * Handles functions
 */

// ==================== Application Initialization ====================

document.addEventListener('DOMContentLoaded', function() {
    console.log('পাঠশালা ই-ম্যানেজার লোড হচ্ছে...');
    
    // Initialize storage
    StorageManager.init();
    
    // Check admin session
    if (StorageManager.isAdminLoggedIn()) {
        showAdminPanel();
    }
    
    // Render public landing page
    RenderManager.renderLandingPage();
    
    // Initialize admin manager
    AdminManager.init();
    
    // Initialize sidebar navigation
    initSidebarNavigation();
    
    console.log('পাঠশালা ই-ম্যানেজার সফলভাবে লোড হয়েছে!');
});

// ==================== Sidebar Navigation ====================

function initSidebarNavigation() {
    const navItems = document.querySelectorAll('.sidebar-nav > ul > li:not(:last-child)');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const section = this.dataset.section;
            if (section) {
                RenderManager.switchAdminSection(section);
            }
        });
    });
    
    // Initialize dropdown toggles
    initDropdownToggles();
}

// ==================== Dropdown Menu Functions ====================

function initDropdownToggles() {
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const parent = this.closest('.has-dropdown');
            const isActive = parent.classList.contains('active');
            
            // Close all dropdowns first
            closeAllDropdowns();
            
            // Toggle current dropdown
            if (!isActive) {
                parent.classList.add('active');
            }
        });
    });
}

function toggleDropdown(element) {
    if (!element) return;
    
    const parent = element.closest('.has-dropdown');
    if (!parent) return;
    
    const isActive = parent.classList.contains('active');
    
    // Close all dropdowns first
    closeAllDropdowns();
    
    // Toggle current dropdown
    if (!isActive) {
        parent.classList.add('active');
    }
}

function closeAllDropdowns() {
    const activeDropdowns = document.querySelectorAll('.sidebar-nav .has-dropdown.active');
    activeDropdowns.forEach(dropdown => {
        dropdown.classList.remove('active');
    });
}

function closeDropdown(element) {
    if (!element) return;
    
    const parent = element.closest('.has-dropdown');
    if (parent) {
        parent.classList.remove('active');
    }
}

// Close dropdowns when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.has-dropdown')) {
        closeAllDropdowns();
    }
});

// Close dropdowns on escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeAllDropdowns();
    }
});

// ==================== Global Functions ====================

// Toggle sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('admin-sidebar');
    sidebar.classList.toggle('collapsed');
}

// Toggle mobile menu
function toggleMobileMenu() {
    const navbarToggle = document.getElementById('navbar-toggle');
    const navbarMenu = document.getElementById('navbar-menu');
    const navbarOverlay = document.getElementById('navbar-overlay');
    
    navbarToggle.classList.toggle('active');
    navbarMenu.classList.toggle('active');
    
    if (navbarOverlay) {
        navbarOverlay.classList.toggle('active');
    }
}

// Show admin login modal
function showAdminLogin() {
    document.getElementById('login-modal').classList.add('active');
}

// Hide admin login modal
function hideAdminLogin() {
    document.getElementById('login-modal').classList.remove('active');
}

// Show admin panel
function showAdminPanel() {
    document.getElementById('login-modal').classList.remove('active');
    document.getElementById('public-view').classList.add('hidden');
    document.getElementById('admin-view').classList.remove('hidden');
    
    // Initialize admin content
    RenderManager.renderAdminMenu();
    RenderManager.renderPageSections();
    RenderManager.renderContentEditor();
    RenderManager.renderLandingSettings();
}

// Logout admin
function logoutAdmin() {
    StorageManager.clearAdminSession();
    document.getElementById('public-view').classList.remove('hidden');
    document.getElementById('admin-view').classList.add('hidden');
    showToast('লগআউট সম্পন্ন হয়েছে', 'info');
}

// View site (switch to public view)
function viewSite() {
    document.getElementById('admin-view').classList.add('hidden');
    document.getElementById('public-view').classList.remove('hidden');
    RenderManager.renderLandingPage();
}

// Open in new tab
function openInNewTab() {
    const content = document.getElementById('landing-content').innerHTML;
    const config = StorageManager.getConfig();
    
    const newWindow = window.open('', '_blank');
    newWindow.document.write(`
        <!DOCTYPE html>
        <html lang="bn">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${config.name}</title>
            <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&display=swap" rel="stylesheet">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Hind Siliguri', sans-serif; background: #fff; }
                ${getMainStyles()}
            </style>
        </head>
        <body>
            <div id="landing-content">${content}</div>
        </body>
        </html>
    `);
    newWindow.document.close();
}

// Get main styles for preview
function getMainStyles() {
    // Extract critical styles for preview
    return `
        :root {
            --primary-color: #00695C;
            --secondary-color: #F57F17;
            --text-dark: #263238;
            --text-medium: #546E7A;
            --bg-light: #F5F7FA;
            --bg-white: #FFFFFF;
        }
        
        section { padding: 80px 24px; }
        .section-header { text-align: center; margin-bottom: 60px; }
        .section-header h2 { font-size: 2.5rem; color: var(--primary-color); margin-bottom: 16px; }
        .section-header p { color: var(--text-medium); max-width: 600px; margin: 0 auto; }
        
        .hero-section {
            min-height: 80vh;
            background: linear-gradient(135deg, var(--primary-color), #004D40);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 100px 24px;
        }
        .hero-content h1 { font-size: 3rem; margin-bottom: 16px; }
        .hero-content p { font-size: 1.3rem; margin-bottom: 32px; opacity: 0.9; }
        .btn-cta {
            background: var(--secondary-color);
            color: white;
            padding: 16px 40px;
            border-radius: 30px;
            font-size: 1.1rem;
            font-weight: 600;
            text-decoration: none;
            display: inline-block;
        }
        
        .features-section { background: var(--bg-white); }
        .features-grid {
            max-width: 1200px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 32px;
        }
        .feature-card {
            background: var(--bg-light);
            padding: 40px 32px;
            border-radius: 12px;
            text-align: center;
        }
        .feature-icon {
            width: 80px;
            height: 80px;
            margin: 0 auto 24px;
            background: var(--primary-color);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            color: white;
        }
        .feature-card h3 { font-size: 1.3rem; margin-bottom: 12px; }
        .feature-card p { color: var(--text-medium); }
        
        .about-section { background: var(--bg-light); }
        .about-container {
            max-width: 1200px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 60px;
            align-items: center;
        }
        .about-content h2 { font-size: 2.5rem; color: var(--primary-color); margin-bottom: 24px; }
        .about-content p { color: var(--text-medium); margin-bottom: 16px; }
        
        .gallery-section { background: var(--bg-white); }
        .gallery-grid {
            max-width: 1200px;
            margin: 0 auto;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 24px;
        }
        .gallery-item {
            border-radius: 12px;
            overflow: hidden;
            aspect-ratio: 1;
        }
        .gallery-item img { width: 100%; height: 100%; object-fit: cover; }
        
        .notice-section { background: var(--bg-light); }
        .notice-container { max-width: 900px; margin: 0 auto; }
        .notice-board {
            background: var(--bg-white);
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .notice-header {
            background: var(--primary-color);
            color: white;
            padding: 24px;
        }
        .notice-header h3 { color: white; }
        .notice-list { padding: 24px; }
        .notice-item {
            padding: 20px;
            border-left: 4px solid var(--primary-color);
            background: var(--bg-light);
            margin-bottom: 16px;
            border-radius: 0 8px 8px 0;
        }
        .notice-date { font-size: 0.85rem; color: var(--primary-color); font-weight: 500; }
        .notice-item h4 { font-size: 1.1rem; margin: 8px 0; }
        .notice-item p { color: var(--text-medium); font-size: 0.95rem; }
        
        .cta-section {
            background: var(--secondary-color);
            text-align: center;
            padding: 100px 24px;
        }
        .cta-content { max-width: 700px; margin: 0 auto; }
        .cta-content h2 { font-size: 2.5rem; color: white; margin-bottom: 16px; }
        .cta-content p { color: rgba(255,255,255,0.9); font-size: 1.2rem; margin-bottom: 32px; }
        
        @media (max-width: 768px) {
            .about-container { grid-template-columns: 1fr; }
            .hero-content h1 { font-size: 2rem; }
            .section-header h2 { font-size: 1.8rem; }
        }
    `;
}

// ==================== Section Visibility Toggle ====================

function toggleSectionVisibility(sectionId) {
    const section = StorageManager.toggleSectionVisibility(sectionId);
    if (section) {
        showToast(
            section.visible 
                ? `${section.name} দৃশ্যমান হয়েছে` 
                : `${section.name} লুকানো হয়েছে}`,
            'info'
        );
    }
}

// ==================== Feature Management ====================

function addFeature() {
    const title = prompt('ফিচার শিরোনাম লিখুন:');
    if (title) {
        const description = prompt('ফিচার বিবরণ লিখুন:') || '';
        const icon = prompt('আইকন ক্লাস (যেমন: fas fa-star):', 'fas fa-star');
        
        StorageManager.addFeature({ title, description, icon });
        RenderManager.renderFeaturesEditor();
        showToast('ফিচার যোগ করা হয়েছে', 'success');
    }
}

function updateFeature(id, field, value) {
    StorageManager.updateFeature(id, { [field]: value });
}

function deleteFeature(id) {
    if (confirm('এই ফিচার মুছে ফেলতে চান?')) {
        StorageManager.deleteFeature(id);
        RenderManager.renderFeaturesEditor();
        showToast('ফিচার মুছে ফেলা হয়েছে', 'success');
    }
}

// ==================== Notice Management ====================

function deleteNotice(id) {
    if (confirm('এই নোটিশ মুছে ফেলতে চান?')) {
        StorageManager.deleteNotice(id);
        RenderManager.renderNoticesEditor();
        showToast('নোটিশ মুছে ফেলা হয়েছে', 'success');
    }
}

// ==================== Gallery Management ====================

function deleteGalleryImage(id) {
    if (confirm('এই ছবি মুছে ফেলতে চান?')) {
        StorageManager.deleteGalleryImage(id);
        RenderManager.renderGalleryEditor();
        showToast('ছবি মুছে ফেলা হয়েছে', 'success');
    }
}

// ==================== Save Functions ====================

function saveMenuOrder() {
    const menuList = document.getElementById('admin-menu-list');
    const items = menuList.querySelectorAll('li');
    const newOrder = [];
    
    items.forEach(item => {
        const id = parseInt(item.dataset.id);
        newOrder.push(id);
    });
    
    const currentMenu = StorageManager.getMenu();
    const reorderedMenu = newOrder.map(id => {
        return currentMenu.find(item => item.id === id);
    });
    
    StorageManager.saveMenu(reorderedMenu);
    
    const status = document.getElementById('menu-save-status');
    status.textContent = '✓ সেভ হয়েছে';
    status.classList.add('show');
    setTimeout(() => status.classList.remove('show'), 2000);
    
    RenderManager.renderLandingPage();
    showToast('মেনু অর্ডার সেভ করা হয়েছে', 'success');
}

function saveSectionOrder() {
    const sectionList = document.getElementById('section-list');
    const items = sectionList.querySelectorAll('li');
    const newOrder = [];
    
    items.forEach(item => {
        newOrder.push(item.dataset.id);
    });
    
    StorageManager.updateSectionOrder(newOrder);
    
    const status = document.getElementById('section-save-status');
    status.textContent = '✓ সেভ হয়েছে';
    status.classList.add('show');
    setTimeout(() => status.classList.remove('show'), 2000);
    
    RenderManager.renderLandingPage();
    showToast('সেকশন অর্ডার সেভ করা হয়েছে', 'success');
}

function addNewSection() {
    const sectionName = prompt('নতুন সেকশনের নাম লিখুন:');
    if (sectionName) {
        const sectionId = 'custom_' + Date.now();
        StorageManager.addSection({
            id: sectionId,
            name: sectionName,
            type: 'custom'
        });
        RenderManager.renderPageSections();
        showToast('নতুন সেকশন যোগ করা হয়েছে', 'success');
    }
}

// ==================== Toast Notification System ====================

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-times-circle',
        info: 'fas fa-info-circle',
        warning: 'fas fa-exclamation-triangle'
    };
    
    toast.innerHTML = `
        <i class="${icons[type] || icons.info}"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            container.removeChild(toast);
        }, 300);
    }, 3000);
}

// ==================== Utility Functions ====================

// Format date to Bengali
function formatDateToBengali(dateString) {
    const date = new Date(dateString);
    const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 
                   'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
    const days = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
    
    return {
        full: `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`,
        short: `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`,
        date: date.getDate(),
        month: months[date.getMonth()],
        year: date.getFullYear()
    };
}

// Convert English numbers to Bengali
function toBengaliNumber(num) {
    const english = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const bengali = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    
    return String(num).split('').map(char => {
        const index = english.indexOf(char);
        return index !== -1 ? bengali[index] : char;
    }).join('');
}

// Scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export data
function exportData() {
    const data = StorageManager.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pathshala-backup-' + new Date().toISOString().split('T')[0] + '.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('ডেটা এক্সপোর্ট করা হয়েছে', 'success');
}

// Import data
function importData(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            StorageManager.importData(e.target.result);
            RenderManager.renderLandingPage();
        };
        reader.readAsText(file);
    }
}

// Reset database
function resetDatabase() {
    if (confirm('আপনি কি নিশ্চিত যে আপনি সমস্ত ডেটা রিসেট করতে চান? এই কাজটি ফিরে আনা যাবে না।')) {
        StorageManager.resetToDefaults();
        RenderManager.renderLandingPage();
        location.reload();
    }
}

// Make functions globally accessible
window.showAdminLogin = showAdminLogin;
window.hideAdminLogin = hideAdminLogin;
window.showAdminPanel = showAdminPanel;
window.logoutAdmin = logoutAdmin;
window.viewSite = viewSite;
window.openInNewTab = openInNewTab;
window.toggleSidebar = toggleSidebar;
window.toggleMobileMenu = toggleMobileMenu;
window.saveMenuOrder = saveMenuOrder;
window.saveSectionOrder = saveSectionOrder;
window.addNewSection = addNewSection;
window.toggleSectionVisibility = toggleSectionVisibility;
window.addFeature = addFeature;
window.updateFeature = updateFeature;
window.deleteFeature = deleteFeature;
window.deleteNotice = deleteNotice;
window.deleteGalleryImage = deleteGalleryImage;
window.showToast = showToast;
window.toBengaliNumber = toBengaliNumber;
window.formatDateToBengali = formatDateToBengali;
window.scrollToSection = scrollToSection;
window.exportData = exportData;
window.importData = importData;
window.resetDatabase = resetDatabase;
window.toggleDropdown = toggleDropdown;
window.closeAllDropdowns = closeAllDropdowns;
window.closeDropdown = closeDropdown;
