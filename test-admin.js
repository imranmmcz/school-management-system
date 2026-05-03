const { chromium } = require('playwright');

async function testAdminPages() {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    const adminPages = [
        'admin-dashboard.html',
        'admin-students.html',
        'admin-teachers.html',
        'admin-attendance.html',
        'admin-fees.html',
        'admin-exams.html',
        'admin-results.html',
        'admin-payments.html',
        'admin-notifications.html',
        'admin-settings.html'
    ];
    
    const baseUrl = 'file:///workspace/school-management-system/admin';
    let allPassed = true;
    const results = [];
    
    for (const adminPage of adminPages) {
        const pageErrors = [];
        const consoleErrors = [];
        
        page.on('console', msg => {
            if (msg.type() === 'error') {
                consoleErrors.push(`Console error: ${msg.text()}`);
            }
        });
        
        page.on('pageerror', err => {
            pageErrors.push(`Page error: ${err.message}`);
        });
        
        try {
            const url = `${baseUrl}/${adminPage}`;
            console.log(`Testing: ${adminPage}`);
            
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
            await page.waitForTimeout(1000);
            
            // Check if main elements exist
            const sidebar = await page.$('.admin-sidebar');
            const mainContent = await page.$('.admin-main');
            const topbar = await page.$('.admin-topbar');
            
            if (!sidebar || !mainContent || !topbar) {
                console.log(`  WARNING: Missing main layout elements in ${adminPage}`);
            }
            
            if (pageErrors.length > 0 || consoleErrors.length > 0) {
                console.log(`  ERRORS in ${adminPage}:`);
                pageErrors.forEach(e => console.log(`    ${e}`));
                consoleErrors.forEach(e => console.log(`    ${e}`));
                allPassed = false;
            } else {
                console.log(`  ✓ ${adminPage} loaded successfully`);
            }
            
            results.push({
                page: adminPage,
                passed: pageErrors.length === 0 && consoleErrors.length === 0,
                errors: [...pageErrors, ...consoleErrors]
            });
            
        } catch (err) {
            console.log(`  FAILED: ${adminPage} - ${err.message}`);
            allPassed = false;
            results.push({
                page: adminPage,
                passed: false,
                errors: [err.message]
            });
        }
    }
    
    await browser.close();
    
    console.log('\n========================================');
    console.log('Test Summary:');
    console.log('========================================');
    
    const passedCount = results.filter(r => r.passed).length;
    const totalCount = results.length;
    
    console.log(`Passed: ${passedCount}/${totalCount}`);
    
    if (allPassed) {
        console.log('✓ All admin pages loaded successfully!');
    } else {
        console.log('Some pages have issues. Check errors above.');
    }
    
    return allPassed;
}

testAdminPages()
    .then(success => process.exit(success ? 0 : 1))
    .catch(err => {
        console.error('Test failed:', err);
        process.exit(1);
    });
