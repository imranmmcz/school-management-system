/**
 * পাঠশালা ই-ম্যানেজার - টেস্ট স্ক্রিপ্ট
 * School Management System - Test Script
 */

const { chromium } = require('playwright');

async function testSchoolManagementSystem() {
    console.log('পাঠশালা ই-ম্যানেজার টেস্ট শুরু হচ্ছে...');
    
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    const errors = [];
    
    // Listen for console errors
    page.on('console', msg => {
        if (msg.type() === 'error') {
            errors.push(msg.text());
        }
    });
    
    // Listen for page errors
    page.on('pageerror', error => {
        errors.push(error.message);
    });
    
    try {
        // Load the page
        const filePath = 'file:///workspace/school-management-system/index.html';
        console.log('পেজ লোড হচ্ছে:', filePath);
        
        await page.goto(filePath, { waitUntil: 'networkidle' });
        console.log('✓ পেজ সফলভাবে লোড হয়েছে');
        
        // Wait for content to render
        await page.waitForTimeout(2000);
        
        // Check main elements
        const header = await page.$('#main-header');
        const hero = await page.$('.hero-section');
        const footer = await page.$('#main-footer');
        
        if (header) {
            console.log('✓ হেডার উপস্থিত');
        } else {
            console.log('✗ হেডার পাওয়া যায়নি');
            errors.push('Header not found');
        }
        
        if (hero) {
            console.log('✓ হিরো সেকশন উপস্থিত');
        } else {
            console.log('✗ হিরো সেকশন পাওয়া যায়নি');
            errors.push('Hero section not found');
        }
        
        if (footer) {
            console.log('✓ ফুটার উপস্থিত');
        } else {
            console.log('✗ ফুটার পাওয়া যায়নি');
            errors.push('Footer not found');
        }
        
        // Check admin login button
        const loginBtn = await page.$('.btn-login');
        if (loginBtn) {
            console.log('✓ অ্যাডমিন লগইন বাটন উপস্থিত');
        }
        
        // Click admin login and check admin panel
        if (loginBtn) {
            await loginBtn.click();
            await page.waitForTimeout(500);
            
            const loginModal = await page.$('#login-modal.active');
            if (loginModal) {
                console.log('✓ লগইন মডাল খোলে');
                
                // Fill login form
                await page.fill('#login-username', 'admin');
                await page.fill('#login-password', 'admin123');
                
                // Submit login
                await page.click('.btn-login-submit');
                await page.waitForTimeout(1000);
                
                // Check admin view
                const adminView = await page.$('#admin-view:not(.hidden)');
                if (adminView) {
                    console.log('✓ অ্যাডমিন প্যানেল খোলে');
                    
                    // Check sidebar
                    const sidebar = await page.$('#admin-sidebar');
                    if (sidebar) {
                        console.log('✓ অ্যাডমিন সাইডবার উপস্থিত');
                    }
                    
                    // Check dashboard section
                    const dashboard = await page.$('#dashboard-section.active');
                    if (dashboard) {
                        console.log('✓ ড্যাশবোর্ড সেকশন সক্রিয়');
                    }
                    
                    // Check menu manager
                    await page.click('[data-section="menu-manager"]');
                    await page.waitForTimeout(500);
                    const menuManager = await page.$('#menu-manager-section.active');
                    if (menuManager) {
                        console.log('✓ মেনু ম্যানেজার সেকশন কাজ করছে');
                    }
                    
                    // Check page builder
                    await page.click('[data-section="page-builder"]');
                    await page.waitForTimeout(500);
                    const pageBuilder = await page.$('#page-builder-section.active');
                    if (pageBuilder) {
                        console.log('✓ পেজ বিল্ডার সেকশন কাজ করছে');
                    }
                    
                    // Check content editor
                    await page.click('[data-section="content-editor"]');
                    await page.waitForTimeout(500);
                    const contentEditor = await page.$('#content-editor-section.active');
                    if (contentEditor) {
                        console.log('✓ কন্টেন্ট এডিটর সেকশন কাজ করছে');
                    }
                }
            }
        }
        
        // Report errors
        if (errors.length > 0) {
            console.log('\n✗ কিছু ত্রুটি পাওয়া গেছে:');
            errors.forEach(err => console.log('  -', err));
        } else {
            console.log('\n✓ কোনো ত্রুটি পাওয়া যায়নি!');
        }
        
        console.log('\n========================================');
        console.log('টেস্ট সম্পন্ন!');
        console.log('========================================');
        
    } catch (error) {
        console.error('টেস্ট ব্যর্থ হয়েছে:', error.message);
    } finally {
        await browser.close();
    }
}

// Run the test
testSchoolManagementSystem();
