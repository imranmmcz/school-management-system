/**
 * পাঠশালা ই-ম্যানেজার - এপিআই ক্লায়েন্ট
 * School Management System - API Client
 * Handles all database operations via REST API
 */

// API Configuration
const API_CONFIG = {
    baseURL: 'http://localhost:3000/api',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
};

// Token management
const TokenManager = {
    getToken() {
        return localStorage.getItem('pathshala_auth_token');
    },
    
    setToken(token) {
        localStorage.setItem('pathshala_auth_token', token);
    },
    
    removeToken() {
        localStorage.removeItem('pathshala_auth_token');
    },
    
    getAuthHeader() {
        const token = this.getToken();
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    }
};

// HTTP Request helper
async function apiRequest(endpoint, options = {}) {
    const url = `${API_CONFIG.baseURL}${endpoint}`;
    
    const config = {
        ...API_CONFIG,
        ...options,
        headers: {
            ...API_CONFIG.headers,
            ...options.headers,
            ...TokenManager.getAuthHeader()
        }
    };
    
    try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP Error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`API Request Error [${endpoint}]:`, error);
        throw error;
    }
}

// Main API Client
const API = {
    // ==================== Authentication ====================
    
    auth: {
        async login(email, password) {
            const data = await apiRequest('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });
            
            if (data.token) {
                TokenManager.setToken(data.token);
            }
            
            return data;
        },
        
        async register(userData) {
            return apiRequest('/auth/register', {
                method: 'POST',
                body: JSON.stringify(userData)
            });
        },
        
        async logout() {
            try {
                await apiRequest('/auth/logout', { method: 'POST' });
            } catch (error) {
                console.log('Logout API call failed, clearing local token');
            }
            TokenManager.removeToken();
        },
        
        async getProfile() {
            return apiRequest('/auth/profile');
        },
        
        async updateProfile(profileData) {
            return apiRequest('/auth/profile', {
                method: 'PUT',
                body: JSON.stringify(profileData)
            });
        },
        
        async changePassword(currentPassword, newPassword) {
            return apiRequest('/auth/change-password', {
                method: 'POST',
                body: JSON.stringify({ currentPassword, newPassword })
            });
        },
        
        isLoggedIn() {
            return !!TokenManager.getToken();
        }
    },
    
    // ==================== School Configuration ====================
    
    config: {
        async get() {
            return apiRequest('/config');
        },
        
        async update(updates) {
            return apiRequest('/config', {
                method: 'PUT',
                body: JSON.stringify(updates)
            });
        }
    },
    
    // ==================== Classes ====================
    
    classes: {
        async getAll(params = {}) {
            const queryString = new URLSearchParams(params).toString();
            return apiRequest(`/classes${queryString ? `?${queryString}` : ''}`);
        },
        
        async getById(id) {
            return apiRequest(`/classes/${id}`);
        },
        
        async create(data) {
            return apiRequest('/classes', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },
        
        async update(id, data) {
            return apiRequest(`/classes/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        },
        
        async delete(id) {
            return apiRequest(`/classes/${id}`, { method: 'DELETE' });
        },
        
        async getSections(classId) {
            return apiRequest(`/classes/${classId}/sections`);
        }
    },
    
    // ==================== Sections ====================
    
    sections: {
        async getAll(params = {}) {
            const queryString = new URLSearchParams(params).toString();
            return apiRequest(`/sections${queryString ? `?${queryString}` : ''}`);
        },
        
        async getById(id) {
            return apiRequest(`/sections/${id}`);
        },
        
        async create(data) {
            return apiRequest('/sections', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },
        
        async update(id, data) {
            return apiRequest(`/sections/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        },
        
        async delete(id) {
            return apiRequest(`/sections/${id}`, { method: 'DELETE' });
        }
    },
    
    // ==================== Subjects ====================
    
    subjects: {
        async getAll(params = {}) {
            const queryString = new URLSearchParams(params).toString();
            return apiRequest(`/subjects${queryString ? `?${queryString}` : ''}`);
        },
        
        async getById(id) {
            return apiRequest(`/subjects/${id}`);
        },
        
        async create(data) {
            return apiRequest('/subjects', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },
        
        async update(id, data) {
            return apiRequest(`/subjects/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        },
        
        async delete(id) {
            return apiRequest(`/subjects/${id}`, { method: 'DELETE' });
        },
        
        async getByClass(classId) {
            return apiRequest(`/subjects/class/${classId}`);
        }
    },
    
    // ==================== Students ====================
    
    students: {
        async getAll(params = {}) {
            const queryString = new URLSearchParams(params).toString();
            return apiRequest(`/students${queryString ? `?${queryString}` : ''}`);
        },
        
        async getById(id) {
            return apiRequest(`/students/${id}`);
        },
        
        async create(data) {
            return apiRequest('/students', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },
        
        async update(id, data) {
            return apiRequest(`/students/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        },
        
        async delete(id) {
            return apiRequest(`/students/${id}`, { method: 'DELETE' });
        },
        
        async search(query) {
            return apiRequest(`/students/search?q=${encodeURIComponent(query)}`);
        },
        
        async getByClass(classId, section = null) {
            const params = new URLSearchParams({ classId });
            if (section) params.append('section', section);
            return apiRequest(`/students/class/${classId}?${params.toString()}`);
        },
        
        async getAttendance(id, month, year) {
            return apiRequest(`/students/${id}/attendance?month=${month}&year=${year}`);
        },
        
        async getFees(id) {
            return apiRequest(`/students/${id}/fees`);
        },
        
        async getResults(id) {
            return apiRequest(`/students/${id}/results`);
        },
        
        async importFromCSV(formData) {
            return apiRequest('/students/import', {
                method: 'POST',
                body: formData,
                headers: {} // Let browser set content-type for multipart
            });
        },
        
        async exportToCSV(params = {}) {
            const queryString = new URLSearchParams(params).toString();
            return apiRequest(`/students/export${queryString ? `?${queryString}` : ''}`);
        }
    },
    
    // ==================== Teachers ====================
    
    teachers: {
        async getAll(params = {}) {
            const queryString = new URLSearchParams(params).toString();
            return apiRequest(`/teachers${queryString ? `?${queryString}` : ''}`);
        },
        
        async getById(id) {
            return apiRequest(`/teachers/${id}`);
        },
        
        async create(data) {
            return apiRequest('/teachers', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },
        
        async update(id, data) {
            return apiRequest(`/teachers/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        },
        
        async delete(id) {
            return apiRequest(`/teachers/${id}`, { method: 'DELETE' });
        },
        
        async search(query) {
            return apiRequest(`/teachers/search?q=${encodeURIComponent(query)}`);
        },
        
            async getBySubject(subject) {
            return apiRequest(`/teachers/subject/${encodeURIComponent(subject)}`);
        },
        
        async getSubjects(id) {
            return apiRequest(`/teachers/${id}/subjects`);
        }
    },
    
    // ==================== Fee Types ====================
    
    feeTypes: {
        async getAll() {
            return apiRequest('/fee-types');
        },
        
        async getById(id) {
            return apiRequest(`/fee-types/${id}`);
        },
        
        async create(data) {
            return apiRequest('/fee-types', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },
        
        async update(id, data) {
            return apiRequest(`/fee-types/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        },
        
        async delete(id) {
            return apiRequest(`/fee-types/${id}`, { method: 'DELETE' });
        }
    },
    
    // ==================== Fee Waivers ====================
    
    feeWaivers: {
        async getAll() {
            return apiRequest('/fee-waivers');
        },
        
        async getById(id) {
            return apiRequest(`/fee-waivers/${id}`);
        },
        
        async create(data) {
            return apiRequest('/fee-waivers', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },
        
        async update(id, data) {
            return apiRequest(`/fee-waivers/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        },
        
        async delete(id) {
            return apiRequest(`/fee-waivers/${id}`, { method: 'DELETE' });
        }
    },
    
    // ==================== Student Fees (Invoices) ====================
    
    fees: {
        async getAll(params = {}) {
            const queryString = new URLSearchParams(params).toString();
            return apiRequest(`/fees${queryString ? `?${queryString}` : ''}`);
        },
        
        async getById(id) {
            return apiRequest(`/fees/${id}`);
        },
        
        async getByStudent(studentId) {
            return apiRequest(`/fees/student/${studentId}`);
        },
        
        async getUnpaid() {
            return apiRequest('/fees/unpaid');
        },
        
        async create(data) {
            return apiRequest('/fees', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },
        
        async update(id, data) {
            return apiRequest(`/fees/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        },
        
        async delete(id) {
            return apiRequest(`/fees/${id}`, { method: 'DELETE' });
        },
        
        async markAsPaid(id, paymentData) {
            return apiRequest(`/fees/${id}/pay`, {
                method: 'POST',
                body: JSON.stringify(paymentData)
            });
        },
        
        async getSummary(studentId) {
            return apiRequest(`/fees/student/${studentId}/summary`);
        },
        
        async generateBulk(classId, feeTypeId, dueDate) {
            return apiRequest('/fees/generate-bulk', {
                method: 'POST',
                body: JSON.stringify({ classId, feeTypeId, dueDate })
            });
        }
    },
    
    // ==================== Payments ====================
    
    payments: {
        async getAll(params = {}) {
            const queryString = new URLSearchParams(params).toString();
            return apiRequest(`/payments${queryString ? `?${queryString}` : ''}`);
        },
        
        async getById(id) {
            return apiRequest(`/payments/${id}`);
        },
        
        async getByStudent(studentId) {
            return apiRequest(`/payments/student/${studentId}`);
        },
        
        async getByTransactionId(transactionId) {
            return apiRequest(`/payments/transaction/${transactionId}`);
        },
        
        async create(data) {
            return apiRequest('/payments', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },
        
        async getSummary(startDate, endDate) {
            return apiRequest(`/payments/summary?startDate=${startDate}&endDate=${endDate}`);
        },
        
        async getDailyReport(date) {
            return apiRequest(`/payments/daily-report?date=${date}`);
        },
        
        async getMonthlyReport(year, month) {
            return apiRequest(`/payments/monthly-report?year=${year}&month=${month}`);
        }
    },
    
    // ==================== Attendance ====================
    
    attendance: {
        async getAll(params = {}) {
            const queryString = new URLSearchParams(params).toString();
            return apiRequest(`/attendance${queryString ? `?${queryString}` : ''}`);
        },
        
        async getByDate(date, classId) {
            return apiRequest(`/attendance/date/${date}?classId=${classId}`);
        },
        
        async save(date, classId, records, notes = {}) {
            return apiRequest('/attendance', {
                method: 'POST',
                body: JSON.stringify({ date, classId, records, notes })
            });
        },
        
        async update(date, classId, records) {
            return apiRequest('/attendance', {
                method: 'PUT',
                body: JSON.stringify({ date, classId, records })
            });
        },
        
        async getStudentReport(studentId, month, year) {
            return apiRequest(`/attendance/student/${studentId}?month=${month}&year=${year}`);
        },
        
        async getClassReport(classId, month, year) {
            return apiRequest(`/attendance/class/${classId}?month=${month}&year=${year}`);
        },
        
        async getSummary(classId, month, year) {
            return apiRequest(`/attendance/summary?classId=${classId}&month=${month}&year=${year}`);
        }
    },
    
    // ==================== Exams ====================
    
    exams: {
        async getAll(params = {}) {
            const queryString = new URLSearchParams(params).toString();
            return apiRequest(`/exams${queryString ? `?${queryString}` : ''}`);
        },
        
        async getById(id) {
            return apiRequest(`/exams/${id}`);
        },
        
        async create(data) {
            return apiRequest('/exams', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },
        
        async update(id, data) {
            return apiRequest(`/exams/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        },
        
        async delete(id) {
            return apiRequest(`/exams/${id}`, { method: 'DELETE' });
        },
        
        async getByClass(classId) {
            return apiRequest(`/exams/class/${classId}`);
        },
        
        async publishResults(id) {
            return apiRequest(`/exams/${id}/publish-results`, { method: 'POST' });
        }
    },
    
    // ==================== Results ====================
    
    results: {
        async getAll(params = {}) {
            const queryString = new URLSearchParams(params).toString();
            return apiRequest(`/results${queryString ? `?${queryString}` : ''}`);
        },
        
        async getById(id) {
            return apiRequest(`/results/${id}`);
        },
        
        async getByExam(examId) {
            return apiRequest(`/results/exam/${examId}`);
        },
        
        async getByStudent(studentId) {
            return apiRequest(`/results/student/${studentId}`);
        },
        
        async getStudentResult(studentId, examId) {
            return apiRequest(`/results/student/${studentId}/exam/${examId}`);
        },
        
        async getClassResults(examId, classId) {
            return apiRequest(`/results/class/${classId}/exam/${examId}`);
        },
        
        async create(data) {
            return apiRequest('/results', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },
        
        async createBulk(examId, resultsData) {
            return apiRequest('/results/bulk', {
                method: 'POST',
                body: JSON.stringify({ examId, results: resultsData })
            });
        },
        
        async update(id, data) {
            return apiRequest(`/results/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        },
        
        async delete(id) {
            return apiRequest(`/results/${id}`, { method: 'DELETE' });
        },
        
        async calculateGrade(marks, totalMarks) {
            return apiRequest('/results/calculate-grade', {
                method: 'POST',
                body: JSON.stringify({ marks, totalMarks })
            });
        }
    },
    
    // ==================== Exam Routines ====================
    
    examRoutines: {
        async getAll(params = {}) {
            const queryString = new URLSearchParams(params).toString();
            return apiRequest(`/exam-routines${queryString ? `?${queryString}` : ''}`);
        },
        
        async getById(id) {
            return apiRequest(`/exam-routines/${id}`);
        },
        
        async create(data) {
            return apiRequest('/exam-routines', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },
        
        async update(id, data) {
            return apiRequest(`/exam-routines/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        },
        
        async delete(id) {
            return apiRequest(`/exam-routines/${id}`, { method: 'DELETE' });
        },
        
        async getByExam(examId) {
            return apiRequest(`/exam-routines/exam/${examId}`);
        },
        
        async getByClass(examId, classId) {
            return apiRequest(`/exam-routines/exam/${examId}/class/${classId}`);
        }
    },
    
    // ==================== Class Routines ====================
    
    classRoutines: {
        async getAll(params = {}) {
            const queryString = new URLSearchParams(params).toString();
            return apiRequest(`/class-routines${queryString ? `?${queryString}` : ''}`);
        },
        
        async getById(id) {
            return apiRequest(`/class-routines/${id}`);
        },
        
        async create(data) {
            return apiRequest('/class-routines', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },
        
        async update(id, data) {
            return apiRequest(`/class-routines/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        },
        
        async delete(id) {
            return apiRequest(`/class-routines/${id}`, { method: 'DELETE' });
        },
        
        async getByClass(classId, section = null) {
            const params = new URLSearchParams({ classId });
            if (section) params.append('section', section);
            return apiRequest(`/class-routines/class/${classId}?${params.toString()}`);
        },
        
        async getByDay(classId, day) {
            return apiRequest(`/class-routines/class/${classId}/day/${day}`);
        }
    },
    
    // ==================== Academic Calendar ====================
    
    academicCalendar: {
        async getAll(params = {}) {
            const queryString = new URLSearchParams(params).toString();
            return apiRequest(`/academic-calendar${queryString ? `?${queryString}` : ''}`);
        },
        
        async getById(id) {
            return apiRequest(`/academic-calendar/${id}`);
        },
        
        async create(data) {
            return apiRequest('/academic-calendar', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },
        
        async update(id, data) {
            return apiRequest(`/academic-calendar/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        },
        
        async delete(id) {
            return apiRequest(`/academic-calendar/${id}`, { method: 'DELETE' });
        },
        
        async getByDateRange(startDate, endDate) {
            return apiRequest(`/academic-calendar/range?start=${startDate}&end=${endDate}`);
        },
        
        async getByMonth(year, month) {
            return apiRequest(`/academic-calendar/month/${year}/${month}`);
        }
    },
    
    // ==================== Syllabus ====================
    
    syllabus: {
        async getAll(params = {}) {
            const queryString = new URLSearchParams(params).toString();
            return apiRequest(`/syllabus${queryString ? `?${queryString}` : ''}`);
        },
        
        async getById(id) {
            return apiRequest(`/syllabus/${id}`);
        },
        
        async create(data) {
            return apiRequest('/syllabus', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },
        
        async update(id, data) {
            return apiRequest(`/syllabus/${id}`, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        },
        
        async delete(id) {
            return apiRequest(`/syllabus/${id}`, { method: 'DELETE' });
        },
        
        async getByClass(classId, section = null) {
            const params = new URLSearchParams({ classId });
            if (section) params.append('section', section);
            return apiRequest(`/syllabus/class/${classId}?${params.toString()}`);
        },
        
        async uploadFile(formData) {
            return apiRequest('/syllabus/upload', {
                method: 'POST',
                body: formData,
                headers: {}
            });
        }
    },
    
    // ==================== Notifications ====================
    
    notifications: {
        async getAll(params = {}) {
            const queryString = new URLSearchParams(params).toString();
            return apiRequest(`/notifications${queryString ? `?${queryString}` : ''}`);
        },
        
        async getById(id) {
            return apiRequest(`/notifications/${id}`);
        },
        
        async create(data) {
            return apiRequest('/notifications', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },
        
        async sendSMS(data) {
            return apiRequest('/notifications/sms', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },
        
        async sendEmail(data) {
            return apiRequest('/notifications/email', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },
        
        async sendWhatsApp(data) {
            return apiRequest('/notifications/whatsapp', {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },
        
        async delete(id) {
            return apiRequest(`/notifications/${id}`, { method: 'DELETE' });
        },
        
        async getUnread() {
            return apiRequest('/notifications/unread');
        },
        
        async markAsRead(id) {
            return apiRequest(`/notifications/${id}/read`, { method: 'PUT' });
        },
        
        async markAllAsRead() {
            return apiRequest('/notifications/read-all', { method: 'PUT' });
        }
    },
    
    // ==================== Dashboard Statistics ====================
    
    dashboard: {
        async getStats() {
            return apiRequest('/dashboard/stats');
        },
        
        async getRecentActivities() {
            return apiRequest('/dashboard/recent-activities');
        },
        
        async getFeeCollectionChart(year) {
            return apiRequest(`/dashboard/fee-chart?year=${year}`);
        },
        
        async getAttendanceChart(month, year) {
            return apiRequest(`/dashboard/attendance-chart?month=${month}&year=${year}`);
        },
        
        async getStudentClassDistribution() {
            return apiRequest('/dashboard/student-distribution');
        }
    },
    
    // ==================== Reports ====================
    
    reports: {
        async generateStudentListReport(classId, section = null) {
            const params = new URLSearchParams({ classId });
            if (section) params.append('section', section);
            return apiRequest(`/reports/students?${params.toString()}`);
        },
        
        async generateAttendanceReport(classId, month, year) {
            return apiRequest(`/reports/attendance?classId=${classId}&month=${month}&year=${year}`);
        },
        
        async generateExamResultReport(examId, classId) {
            return apiRequest(`/reports/results?examId=${examId}&classId=${classId}`);
        },
        
        async generateFeeCollectionReport(startDate, endDate) {
            return apiRequest(`/reports/fees?startDate=${startDate}&endDate=${endDate}`);
        },
        
        async generateDueFeesReport(classId = null) {
            const params = new URLSearchParams();
            if (classId) params.append('classId', classId);
            return apiRequest(`/reports/due-fees?${params.toString()}`);
        },
        
        async generateTransactionReport(startDate, endDate) {
            return apiRequest(`/reports/transactions?startDate=${startDate}&endDate=${endDate}`);
        }
    },
    
    // ==================== File Upload ====================
    
    files: {
        async upload(file, type = 'general') {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', type);
            
            return apiRequest('/files/upload', {
                method: 'POST',
                body: formData,
                headers: {}
            });
        },
        
        async uploadStudentImage(file, studentId) {
            const formData = new FormData();
            formData.append('file', file);
            
            return apiRequest(`/files/student/${studentId}/image`, {
                method: 'POST',
                body: formData,
                headers: {}
            });
        },
        
        async uploadTeacherImage(file, teacherId) {
            const formData = new FormData();
            formData.append('file', file);
            
            return apiRequest(`/files/teacher/${teacherId}/image`, {
                method: 'POST',
                body: formData,
                headers: {}
            });
        },
        
        async uploadGalleryImage(file, caption = '') {
            const formData = new FormData();
            formData.append('file', file);
            if (caption) formData.append('caption', caption);
            
            return apiRequest('/files/gallery', {
                method: 'POST',
                body: formData,
                headers: {}
            });
        },
        
        async delete(url) {
            return apiRequest('/files/delete', {
                method: 'POST',
                body: JSON.stringify({ url })
            });
        }
    },
    
    // ==================== Settings ====================
    
    settings: {
        async getAll() {
            return apiRequest('/settings');
        },
        
        async update(settingsData) {
            return apiRequest('/settings', {
                method: 'PUT',
                body: JSON.stringify(settingsData)
            });
        },
        
        async getAcademicYear() {
            return apiRequest('/settings/academic-year');
        },
        
        async setAcademicYear(year) {
            return apiRequest('/settings/academic-year', {
                method: 'PUT',
                body: JSON.stringify({ year })
            });
        }
    },
    
    // ==================== Backup & Restore ====================
    
    backup: {
        async create() {
            return apiRequest('/backup/create', { method: 'POST' });
        },
        
        async restore(file) {
            const formData = new FormData();
            formData.append('backupFile', file);
            
            return apiRequest('/backup/restore', {
                method: 'POST',
                body: formData,
                headers: {}
            });
        },
        
        async getList() {
            return apiRequest('/backup/list');
        },
        
        async download(id) {
            return apiRequest(`/backup/download/${id}`);
        },
        
        async delete(id) {
            return apiRequest(`/backup/${id}`, { method: 'DELETE' });
        }
    }
};

// Make API globally accessible
window.API = API;
window.TokenManager = TokenManager;
