/**
 * পাঠশালা ই-ম্যানেজার - ডাটা ম্যানেজার
 * School Management System - Data Manager
 * Unified interface for switching between Storage and API modes
 */

const DataManager = {
    mode: 'hybrid', // 'storage', 'api', or 'hybrid'
    useAPIFirst: true,
    initialized: false,
    
    // Initialize data manager
    async init(options = {}) {
        this.mode = options.mode || 'hybrid';
        this.useAPIFirst = options.useAPIFirst !== false;
        
        // Check if API is available
        if (this.mode === 'api' || this.useAPIFirst) {
            try {
                const response = await fetch(API_CONFIG.baseURL.replace('/api', '/health'), {
                    method: 'GET',
                    timeout: 5000
                });
                if (response.ok) {
                    console.log('API server is available');
                    this.mode = 'api';
                } else {
                    this.fallbackToStorage();
                }
            } catch (error) {
                console.warn('API server not available, using storage mode');
                this.fallbackToStorage();
            }
        }
        
        this.initialized = true;
        return this;
    },
    
    fallbackToStorage() {
        this.mode = 'storage';
        // Initialize storage if needed
        if (typeof StorageManager !== 'undefined') {
            StorageManager.init();
        }
    },
    
    // Generic CRUD operations
    async get(entity, params = {}) {
        if (this.mode === 'api') {
            return API[entity].getAll(params);
        } else {
            return StorageManager[`get${this.capitalize(entity)}`]();
        }
    },
    
    async getById(entity, id) {
        if (this.mode === 'api') {
            return API[entity].getById(id);
        } else {
            return StorageManager[`get${this.capitalize(entity)}ById`](id);
        }
    },
    
    async create(entity, data) {
        if (this.mode === 'api') {
            return API[entity].create(data);
        } else {
            return StorageManager[`add${this.capitalize(entity)}`](data);
        }
    },
    
    async update(entity, id, data) {
        if (this.mode === 'api') {
            return API[entity].update(id, data);
        } else {
            return StorageManager[`update${this.capitalize(entity)}`](id, data);
        }
    },
    
    async delete(entity, id) {
        if (this.mode === 'api') {
            return API[entity].delete(id);
        } else {
            return StorageManager[`delete${this.capitalize(entity)}`](id);
        }
    },
    
    // Utility method
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },
    
    // Dashboard stats
    async getDashboardStats() {
        if (this.mode === 'api') {
            return API.dashboard.getStats();
        } else {
            return StorageManager.getDashboardStats();
        }
    },
    
    // Search operations
    async search(entity, query) {
        if (this.mode === 'api') {
            return API[entity].search(query);
        } else {
            return StorageManager[`search${this.capitalize(entity)}`](query);
        }
    },
    
    // Get by class
    async getByClass(entity, classId, section = null) {
        if (this.mode === 'api') {
            return API[entity].getByClass(classId, section);
        } else {
            const method = `get${this.capitalize(entity)}ByClass`;
            if (typeof StorageManager[method] === 'function') {
                return section ? 
                    StorageManager[method](classId).filter(item => item.section === section) :
                    StorageManager[method](classId);
            }
            return [];
        }
    }
};

// ==================== API Status Checker ====================

const APIStatus = {
    checkInterval: null,
    status: 'unknown',
    
    async check() {
        try {
            const response = await fetch(API_CONFIG.baseURL.replace('/api', '/health'), {
                method: 'GET',
                timeout: 3000
            });
            this.status = response.ok ? 'online' : 'offline';
            return this.status;
        } catch (error) {
            this.status = 'offline';
            return 'offline';
        }
    },
    
    startMonitoring(interval = 30000) {
        this.check();
        this.checkInterval = setInterval(() => this.check(), interval);
    },
    
    stopMonitoring() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
        }
    },
    
    isOnline() {
        return this.status === 'online';
    }
};

// ==================== Data Sync Manager ====================

const DataSync = {
    syncQueue: [],
    syncing: false,
    
    addToQueue(operation) {
        this.syncQueue.push({
            ...operation,
            timestamp: Date.now(),
            retries: 0
        });
        this.processQueue();
    },
    
    async processQueue() {
        if (this.syncing || this.syncQueue.length === 0) return;
        
        this.syncing = true;
        
        while (this.syncQueue.length > 0) {
            const operation = this.syncQueue[0];
            
            try {
                await this.executeOperation(operation);
                this.syncQueue.shift();
            } catch (error) {
                console.error('Sync operation failed:', error);
                operation.retries++;
                
                if (operation.retries >= 3) {
                    // Move to failed operations storage
                    this.saveFailedOperation(operation);
                    this.syncQueue.shift();
                } else {
                    // Wait before retry
                    await new Promise(resolve => setTimeout(resolve, 5000));
                }
            }
        }
        
        this.syncing = false;
    },
    
    async executeOperation(operation) {
        const { entity, action, data, id } = operation;
        
        switch (action) {
            case 'create':
                return API[entity].create(data);
            case 'update':
                return API[entity].update(id, data);
            case 'delete':
                return API[entity].delete(id);
            default:
                throw new Error('Unknown action: ' + action);
        }
    },
    
    saveFailedOperation(operation) {
        const failedOps = JSON.parse(localStorage.getItem('pathshala_failed_sync') || '[]');
        failedOps.push(operation);
        localStorage.setItem('pathshala_failed_sync', JSON.stringify(failedOps));
    },
    
    retryFailedOperations() {
        const failedOps = JSON.parse(localStorage.getItem('pathshala_failed_sync') || '[]');
        failedOps.forEach(op => {
            op.retries = 0;
            this.addToQueue(op);
        });
        localStorage.removeItem('pathshala_failed_sync');
    }
};

// ==================== Migration Helper ====================

const Migration = {
    async migrateFromStorageToAPI() {
        const entities = ['Classes', 'Subjects', 'Students', 'Teachers', 'FeeTypes', 'FeeWaivers', 'Fees', 'Exams', 'Results', 'Attendance', 'Payments', 'Notifications'];
        
        const results = {
            success: [],
            failed: []
        };
        
        for (const entity of entities) {
            try {
                const storageData = StorageManager[`get${entity}`]();
                const normalizedEntity = entity.toLowerCase();
                
                if (Array.isArray(storageData)) {
                    for (const item of storageData) {
                        try {
                            // Skip default data to avoid duplicates
                            if (item.id && item.id < 1000 && !item.studentId && !item.teacherId) {
                                continue;
                            }
                            await API[normalizedEntity].create(item);
                        } catch (error) {
                            console.warn(`Failed to migrate ${entity} item:`, item.id, error.message);
                        }
                    }
                }
                
                results.success.push(entity);
            } catch (error) {
                results.failed.push({ entity, error: error.message });
            }
        }
        
        return results;
    },
    
    async seedDefaultData() {
        const defaultData = {
            classes: StorageManager.defaultClasses,
            subjects: StorageManager.defaultSubjects,
            feeTypes: StorageManager.defaultFeeTypes,
            feeWaivers: StorageManager.defaultFeeWaivers,
            exams: StorageManager.defaultExams
        };
        
        for (const [entity, data] of Object.entries(defaultData)) {
            try {
                const existing = await API[entity].getAll();
                if (existing.length === 0) {
                    for (const item of data) {
                        await API[entity].create(item);
                    }
                }
            } catch (error) {
                console.warn(`Failed to seed ${entity}:`, error.message);
            }
        }
    }
};

// ==================== Offline Data Handler ====================

const OfflineHandler = {
    isOnline: true,
    
    init() {
        this.isOnline = navigator.onLine;
        
        window.addEventListener('online', () => {
            this.isOnline = true;
            showToast('ইন্টারনেট সংযোগ পুনরুদ্ধার হয়েছে', 'success');
            DataSync.retryFailedOperations();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            showToast('অফলাইন মোডে কাজ করছি', 'warning');
        });
    },
    
    handleRequest(operation) {
        if (this.isOnline) {
            return API[operation.entity][operation.action](operation.data);
        } else {
            // Queue for later sync
            DataSync.addToQueue(operation);
            return { offline: true, queued: true };
        }
    }
};

// Make it globally accessible
window.DataManager = DataManager;
window.APIStatus = APIStatus;
window.DataSync = DataSync;
window.Migration = Migration;
window.OfflineHandler = OfflineHandler;
