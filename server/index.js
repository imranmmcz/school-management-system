/**
 * School Management System - Dynamic Backend Server
 * Node.js + Express + MongoDB
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
});

// Configuration
const JWT_SECRET = process.env.JWT_SECRET || 'pathshala-secret-key-2025';
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pathshala_sms';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ==================== MongoDB Connection ====================
const connectDB = async () => {
    try {
        // For demo purposes, we'll use in-memory data if MongoDB is not available
        console.log('Attempting to connect to MongoDB...');
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log('✓ MongoDB connected successfully');
    } catch (error) {
        console.log('⚠ MongoDB not available, using in-memory storage');
        console.log('⚠ For production, please set MONGODB_URI environment variable');
    }
};

connectDB();

// ==================== In-Memory Database (Fallback) ====================
const db = {
    users: [],
    students: [],
    teachers: [],
    classes: [],
    sections: [],
    subjects: [],
    syllabi: [],
    classRoutines: [],
    examRoutines: [],
    calendarEvents: [],
    feeTypes: [],
    studentFees: [],
    payments: [],
    exams: [],
    results: [],
    attendance: [],
    notices: [],
    config: {
        name: 'পাঠশালা ই-ম্যানেজার',
        tagline: 'আমাদের স্কুল, আমাদের গর্ব',
        logo: '',
        established: '২০২০',
        address: '১২৩, শিক্ষা রোড, ঢাকা-১০০০',
        phone: '+৮৮০১২৩৪৫৬৭৮৯০',
        email: 'info@pathshala.edu.bd'
    }
};

// Initialize with default data
const initDefaultData = () => {
    // Default admin user
    db.users.push({
        id: '1',
        username: 'admin',
        email: 'admin@pathshala.edu.bd',
        password: bcrypt.hashSync('admin123', 10),
        role: 'admin',
        name: 'Administrator',
        createdAt: new Date().toISOString()
    });

    // Default classes
    const defaultClasses = [
        { id: '1', name: '৬ষ্ঠ শ্রেণি', capacity: 40 },
        { id: '2', name: '৭ম শ্রেণি', capacity: 40 },
        { id: '3', name: '৮ম শ্রেণি', capacity: 40 },
        { id: '4', name: '৯ম শ্রেণি', capacity: 35 },
        { id: '5', name: '১০ম শ্রেণি', capacity: 35 }
    ];
    db.classes = defaultClasses;

    // Default sections
    const defaultSections = [
        { id: '1', name: 'ক', classId: '1' },
        { id: '2', name: 'খ', classId: '1' },
        { id: '3', name: 'ক', classId: '2' },
        { id: '4', name: 'খ', classId: '2' },
        { id: '5', name: 'ক', classId: '3' },
        { id: '6', name: 'ক', classId: '4' },
        { id: '7', name: 'ক', classId: '5' }
    ];
    db.sections = defaultSections;

    // Default subjects
    const defaultSubjects = [
        { id: '1', name: 'বাংলা', code: 'BAN', type: 'compulsory', fullMarks: 100 },
        { id: '2', name: 'ইংরেজি', code: 'ENG', type: 'compulsory', fullMarks: 100 },
        { id: '3', name: 'গণিত', code: 'MATH', type: 'compulsory', fullMarks: 100 },
        { id: '4', name: 'বিজ্ঞান', code: 'SCI', type: 'compulsory', fullMarks: 100 },
        { id: '5', name: 'বাংলাদেশ ও বিশ্বপরিচয়', code: 'BGS', type: 'compulsory', fullMarks: 100 },
        { id: '6', name: 'ইসলাম ধর্ম', code: 'ISL', type: 'compulsory', fullMarks: 100 },
        { id: '7', name: 'কৃষি শিক্ষা', code: 'AGRI', type: 'optional', fullMarks: 50 }
    ];
    db.subjects = defaultSubjects;

    // Default exams
    const defaultExams = [
        { id: '1', name: 'জানুয়ারি মাসিক পরীক্ষা', type: 'monthly', classId: '0', startDate: '২০ জানুয়ারি ২০২৫', endDate: '২৫ জানুয়ারি ২০২৫', status: 'upcoming' },
        { id: '2', name: 'প্রথম সাময়িক পরীক্ষা', type: 'terminal', classId: '0', startDate: '১৫ ফেব্রুয়ারি ২০২৫', endDate: '২৮ ফেব্রুয়ারি ২০২৫', status: 'upcoming' }
    ];
    db.exams = defaultExams;

    // Default fee types
    const defaultFeeTypes = [
        { id: '1', name: 'মাসিক টিউশন ফি', amount: 500, type: 'monthly', description: 'প্রতি মাসে পরিশোধযোগ্য' },
        { id: '2', name: 'ভর্তি ফি', amount: 1000, type: 'onetime', description: 'ভর্তির সময় পরিশোধযোগ্য' },
        { id: '3', name: 'পরীক্ষার ফি', amount: 200, type: 'exam', description: 'প্রতিটি পরীক্ষার জন্য' },
        { id: '4', name: 'লাইব্রেরি ফি', amount: 100, type: 'yearly', description: 'বই ও রিসোর্স ব্যবহারের জন্য' },
        { id: '5', name: 'স্পোর্টস ফি', amount: 150, type: 'yearly', description: 'ক্রীড়া কার্যক্রমের জন্য' }
    ];
    db.feeTypes = defaultFeeTypes;

    // Default notice
    db.notices.push({
        id: '1',
        title: 'মাসিক পরীক্ষার সময়সূচি প্রকাশ',
        date: '১৩ জানুয়ারি, ২০২৫',
        description: 'জানুয়ারি মাসের মাসিক পরীক্ষার সময়সূচি প্রকাশ করা হয়েছে।',
        createdAt: new Date().toISOString()
    });

    console.log('✓ Default data initialized');
};

initDefaultData();

// ==================== Authentication Middleware ====================
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Authentication required' 
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ 
            success: false, 
            message: 'Invalid token' 
        });
    }
};

const adminOnly = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ 
            success: false, 
            message: 'Admin access required' 
        });
    }
    next();
};

// ==================== Utility Functions ====================
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

const toBengaliNumber = (num) => {
    const english = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const bengali = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return String(num).split('').map(char => {
        const index = english.indexOf(char);
        return index !== -1 ? bengali[index] : char;
    }).join('');
};

const formatCurrency = (amount) => {
    return '৳ ' + toBengaliNumber(Number(amount).toFixed(2));
};

// ==================== API Routes ====================

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Auth Routes
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const user = db.users.find(u => u.username === username || u.email === username);
        
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/api/auth/register', authMiddleware, adminOnly, async (req, res) => {
    try {
        const { username, email, password, role, name } = req.body;
        
        const existingUser = db.users.find(u => u.username === username || u.email === email);
        if (existingUser) {
            return res.status(400).json({ 
                success: false, 
                message: 'User already exists' 
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = {
            id: generateId(),
            username,
            email,
            password: hashedPassword,
            role: role || 'teacher',
            name,
            createdAt: new Date().toISOString()
        };

        db.users.push(newUser);
        
        // Emit update event
        io.emit('usersUpdated', db.users);

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: { id: newUser.id, username, email, role, name }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
    const user = db.users.find(u => u.id === req.user.id);
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({
        success: true,
        user: {
            id: user.id,
            username: user.username,
            name: user.name,
            role: user.role
        }
    });
});

// Students Routes
app.get('/api/students', authMiddleware, (req, res) => {
    const students = db.students.map(student => {
        const classObj = db.classes.find(c => c.id === student.classId);
        return { ...student, className: classObj ? classObj.name : '-' };
    });
    res.json({ success: true, data: students, total: students.length });
});

app.get('/api/students/:id', authMiddleware, (req, res) => {
    const student = db.students.find(s => s.id === req.params.id);
    if (!student) {
        return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.json({ success: true, data: student });
});

app.post('/api/students', authMiddleware, adminOnly, (req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        const nextId = db.students.length + 1;
        const studentId = `STU-${currentYear}-${String(nextId).padStart(3, '0')}`;

        const newStudent = {
            id: generateId(),
            studentId,
            ...req.body,
            status: req.body.status || 'active',
            createdAt: new Date().toISOString()
        };

        db.students.push(newStudent);
        
        // Emit update event
        io.emit('studentsUpdated', db.students);

        res.status(201).json({
            success: true,
            message: 'Student added successfully',
            data: newStudent
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.put('/api/students/:id', authMiddleware, adminOnly, (req, res) => {
    const index = db.students.findIndex(s => s.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Student not found' });
    }

    db.students[index] = {
        ...db.students[index],
        ...req.body,
        updatedAt: new Date().toISOString()
    };

    // Emit update event
    io.emit('studentsUpdated', db.students);

    res.json({
        success: true,
        message: 'Student updated successfully',
        data: db.students[index]
    });
});

app.delete('/api/students/:id', authMiddleware, adminOnly, (req, res) => {
    const index = db.students.findIndex(s => s.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Student not found' });
    }

    db.students.splice(index, 1);
    
    // Emit update event
    io.emit('studentsUpdated', db.students);

    res.json({ success: true, message: 'Student deleted successfully' });
});

// Get students by class
app.get('/api/students/class/:classId', authMiddleware, (req, res) => {
    const students = db.students.filter(s => s.classId === req.params.classId);
    res.json({ success: true, data: students, total: students.length });
});

// Teachers Routes
app.get('/api/teachers', authMiddleware, (req, res) => {
    res.json({ success: true, data: db.teachers, total: db.teachers.length });
});

app.get('/api/teachers/:id', authMiddleware, (req, res) => {
    const teacher = db.teachers.find(t => t.id === req.params.id);
    if (!teacher) {
        return res.status(404).json({ success: false, message: 'Teacher not found' });
    }
    res.json({ success: true, data: teacher });
});

app.post('/api/teachers', authMiddleware, adminOnly, (req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        const nextId = db.teachers.length + 1;
        const teacherId = `TCH-${currentYear}-${String(nextId).padStart(3, '0')}`;

        const newTeacher = {
            id: generateId(),
            teacherId,
            ...req.body,
            status: 'active',
            createdAt: new Date().toISOString()
        };

        db.teachers.push(newTeacher);
        io.emit('teachersUpdated', db.teachers);

        res.status(201).json({
            success: true,
            message: 'Teacher added successfully',
            data: newTeacher
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.put('/api/teachers/:id', authMiddleware, adminOnly, (req, res) => {
    const index = db.teachers.findIndex(t => t.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    db.teachers[index] = {
        ...db.teachers[index],
        ...req.body,
        updatedAt: new Date().toISOString()
    };

    io.emit('teachersUpdated', db.teachers);

    res.json({
        success: true,
        message: 'Teacher updated successfully',
        data: db.teachers[index]
    });
});

app.delete('/api/teachers/:id', authMiddleware, adminOnly, (req, res) => {
    const index = db.teachers.findIndex(t => t.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    db.teachers.splice(index, 1);
    io.emit('teachersUpdated', db.teachers);

    res.json({ success: true, message: 'Teacher deleted successfully' });
});

// Classes Routes
app.get('/api/classes', authMiddleware, (req, res) => {
    res.json({ success: true, data: db.classes, total: db.classes.length });
});

app.get('/api/classes/:id', authMiddleware, (req, res) => {
    const classObj = db.classes.find(c => c.id === req.params.id);
    if (!classObj) {
        return res.status(404).json({ success: false, message: 'Class not found' });
    }
    res.json({ success: true, data: classObj });
});

app.post('/api/classes', authMiddleware, adminOnly, (req, res) => {
    const newClass = {
        id: generateId(),
        ...req.body,
        createdAt: new Date().toISOString()
    };

    db.classes.push(newClass);
    io.emit('classesUpdated', db.classes);

    res.status(201).json({
        success: true,
        message: 'Class added successfully',
        data: newClass
    });
});

app.put('/api/classes/:id', authMiddleware, adminOnly, (req, res) => {
    const index = db.classes.findIndex(c => c.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Class not found' });
    }

    db.classes[index] = {
        ...db.classes[index],
        ...req.body,
        updatedAt: new Date().toISOString()
    };

    io.emit('classesUpdated', db.classes);

    res.json({
        success: true,
        message: 'Class updated successfully',
        data: db.classes[index]
    });
});

app.delete('/api/classes/:id', authMiddleware, adminOnly, (req, res) => {
    const index = db.classes.findIndex(c => c.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Class not found' });
    }

    db.classes.splice(index, 1);
    io.emit('classesUpdated', db.classes);

    res.json({ success: true, message: 'Class deleted successfully' });
});

// Sections Routes
app.get('/api/sections', authMiddleware, (req, res) => {
    res.json({ success: true, data: db.sections, total: db.sections.length });
});

app.post('/api/sections', authMiddleware, adminOnly, (req, res) => {
    const newSection = {
        id: generateId(),
        ...req.body,
        createdAt: new Date().toISOString()
    };

    db.sections.push(newSection);
    io.emit('sectionsUpdated', db.sections);

    res.status(201).json({
        success: true,
        message: 'Section added successfully',
        data: newSection
    });
});

app.delete('/api/sections/:id', authMiddleware, adminOnly, (req, res) => {
    const index = db.sections.findIndex(s => s.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Section not found' });
    }

    db.sections.splice(index, 1);
    io.emit('sectionsUpdated', db.sections);

    res.json({ success: true, message: 'Section deleted successfully' });
});

// Subjects Routes
app.get('/api/subjects', authMiddleware, (req, res) => {
    res.json({ success: true, data: db.subjects, total: db.subjects.length });
});

app.post('/api/subjects', authMiddleware, adminOnly, (req, res) => {
    const newSubject = {
        id: generateId(),
        ...req.body,
        createdAt: new Date().toISOString()
    };

    db.subjects.push(newSubject);
    io.emit('subjectsUpdated', db.subjects);

    res.status(201).json({
        success: true,
        message: 'Subject added successfully',
        data: newSubject
    });
});

app.delete('/api/subjects/:id', authMiddleware, adminOnly, (req, res) => {
    const index = db.subjects.findIndex(s => s.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Subject not found' });
    }

    db.subjects.splice(index, 1);
    io.emit('subjectsUpdated', db.subjects);

    res.json({ success: true, message: 'Subject deleted successfully' });
});

// Fee Types Routes
app.get('/api/fee-types', authMiddleware, (req, res) => {
    res.json({ success: true, data: db.feeTypes });
});

app.post('/api/fee-types', authMiddleware, adminOnly, (req, res) => {
    const newFeeType = {
        id: generateId(),
        ...req.body,
        createdAt: new Date().toISOString()
    };

    db.feeTypes.push(newFeeType);
    io.emit('feeTypesUpdated', db.feeTypes);

    res.status(201).json({
        success: true,
        message: 'Fee type added successfully',
        data: newFeeType
    });
});

// Student Fees Routes
app.get('/api/student-fees/:studentId', authMiddleware, (req, res) => {
    const fees = db.studentFees.filter(f => f.studentId === req.params.studentId);
    res.json({ success: true, data: fees });
});

app.post('/api/student-fees', authMiddleware, (req, res) => {
    const newFee = {
        id: generateId(),
        ...req.body,
        createdAt: new Date().toISOString()
    };

    db.studentFees.push(newFee);
    io.emit('studentFeesUpdated', db.studentFees);

    res.status(201).json({
        success: true,
        message: 'Fee added successfully',
        data: newFee
    });
});

app.put('/api/student-fees/:id', authMiddleware, (req, res) => {
    const index = db.studentFees.findIndex(f => f.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Fee not found' });
    }

    db.studentFees[index] = {
        ...db.studentFees[index],
        ...req.body,
        updatedAt: new Date().toISOString()
    };

    io.emit('studentFeesUpdated', db.studentFees);

    res.json({
        success: true,
        message: 'Fee updated successfully',
        data: db.studentFees[index]
    });
});

// Get all fees for dashboard
app.get('/api/fees/all', authMiddleware, (req, res) => {
    const fees = db.studentFees.map(fee => {
        const student = db.students.find(s => s.id === fee.studentId);
        const classObj = db.classes.find(c => c.id === student?.classId);
        return {
            ...fee,
            studentName: student?.banglaName || '-',
            studentId: student?.studentId || '-',
            className: classObj?.name || '-'
        };
    });
    res.json({ success: true, data: fees });
});

// Attendance Routes
app.get('/api/attendance', authMiddleware, (req, res) => {
    const { date, classId } = req.query;
    let attendance = db.attendance;
    
    if (date) {
        attendance = attendance.filter(a => a.date === date);
    }
    if (classId) {
        const students = db.students.filter(s => s.classId === classId);
        const studentIds = students.map(s => s.id);
        attendance = attendance.filter(a => 
            date && studentIds.some(id => a.records && a.records[id])
        );
    }
    
    res.json({ success: true, data: attendance });
});

app.get('/api/attendance/:date/:classId', authMiddleware, (req, res) => {
    const { date, classId } = req.params;
    const attendance = db.attendance.find(a => a.date === date && a.classId === classId);
    
    if (!attendance) {
        return res.json({ success: true, data: null });
    }
    
    res.json({ success: true, data: attendance });
});

app.post('/api/attendance', authMiddleware, (req, res) => {
    const { date, classId, records, notes } = req.body;
    
    const existingIndex = db.attendance.findIndex(a => a.date === date && a.classId === classId);
    
    const attendanceData = {
        id: existingIndex >= 0 ? db.attendance[existingIndex].id : generateId(),
        date,
        classId,
        records: records || {},
        notes: notes || {},
        createdAt: existingIndex >= 0 ? db.attendance[existingIndex].createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    if (existingIndex >= 0) {
        db.attendance[existingIndex] = attendanceData;
    } else {
        db.attendance.push(attendanceData);
    }

    io.emit('attendanceUpdated', { date, classId, data: attendanceData });

    res.json({
        success: true,
        message: 'Attendance saved successfully',
        data: attendanceData
    });
});

// Class Routine Routes
app.get('/api/class-routines', authMiddleware, (req, res) => {
    res.json({ success: true, data: db.classRoutines });
});

app.post('/api/class-routines', authMiddleware, adminOnly, (req, res) => {
    const newRoutine = {
        id: generateId(),
        ...req.body,
        createdAt: new Date().toISOString()
    };

    db.classRoutines.push(newRoutine);
    io.emit('classRoutinesUpdated', db.classRoutines);

    res.status(201).json({
        success: true,
        message: 'Routine added successfully',
        data: newRoutine
    });
});

app.put('/api/class-routines/:id', authMiddleware, adminOnly, (req, res) => {
    const index = db.classRoutines.findIndex(r => r.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Routine not found' });
    }

    db.classRoutines[index] = {
        ...db.classRoutines[index],
        ...req.body,
        updatedAt: new Date().toISOString()
    };

    io.emit('classRoutinesUpdated', db.classRoutines);

    res.json({
        success: true,
        message: 'Routine updated successfully',
        data: db.classRoutines[index]
    });
});

app.delete('/api/class-routines/:id', authMiddleware, adminOnly, (req, res) => {
    const index = db.classRoutines.findIndex(r => r.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Routine not found' });
    }

    db.classRoutines.splice(index, 1);
    io.emit('classRoutinesUpdated', db.classRoutines);

    res.json({ success: true, message: 'Routine deleted successfully' });
});

// Calendar Events Routes
app.get('/api/calendar-events', authMiddleware, (req, res) => {
    res.json({ success: true, data: db.calendarEvents });
});

app.post('/api/calendar-events', authMiddleware, (req, res) => {
    const newEvent = {
        id: generateId(),
        ...req.body,
        createdAt: new Date().toISOString()
    };

    db.calendarEvents.push(newEvent);
    io.emit('calendarEventsUpdated', db.calendarEvents);

    res.status(201).json({
        success: true,
        message: 'Event added successfully',
        data: newEvent
    });
});

app.put('/api/calendar-events/:id', authMiddleware, (req, res) => {
    const index = db.calendarEvents.findIndex(e => e.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Event not found' });
    }

    db.calendarEvents[index] = {
        ...db.calendarEvents[index],
        ...req.body,
        updatedAt: new Date().toISOString()
    };

    io.emit('calendarEventsUpdated', db.calendarEvents);

    res.json({
        success: true,
        message: 'Event updated successfully',
        data: db.calendarEvents[index]
    });
});

app.delete('/api/calendar-events/:id', authMiddleware, (req, res) => {
    const index = db.calendarEvents.findIndex(e => e.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Event not found' });
    }

    db.calendarEvents.splice(index, 1);
    io.emit('calendarEventsUpdated', db.calendarEvents);

    res.json({ success: true, message: 'Event deleted successfully' });
});

// Notices Routes
app.get('/api/notices', authMiddleware, (req, res) => {
    res.json({ success: true, data: db.notices });
});

app.post('/api/notices', authMiddleware, adminOnly, (req, res) => {
    const newNotice = {
        id: generateId(),
        ...req.body,
        createdAt: new Date().toISOString()
    };

    db.notices.unshift(newNotice);
    io.emit('noticesUpdated', db.notices);

    res.status(201).json({
        success: true,
        message: 'Notice published successfully',
        data: newNotice
    });
});

app.delete('/api/notices/:id', authMiddleware, adminOnly, (req, res) => {
    const index = db.notices.findIndex(n => n.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Notice not found' });
    }

    db.notices.splice(index, 1);
    io.emit('noticesUpdated', db.notices);

    res.json({ success: true, message: 'Notice deleted successfully' });
});

// ==================== Search API ====================
app.get('/api/search', authMiddleware, (req, res) => {
    const { q, type } = req.query;
    const query = (q || '').toLowerCase();
    const results = {};
    
    if (!type || type === 'students') {
        results.students = db.students.filter(s => 
            (s.banglaName || '').toLowerCase().includes(query) ||
            (s.studentId || '').toLowerCase().includes(query) ||
            (s.fatherName || '').toLowerCase().includes(query)
        );
    }
    
    if (!type || type === 'teachers') {
        results.teachers = db.teachers.filter(t => 
            (t.banglaName || '').toLowerCase().includes(query) ||
            (t.teacherId || '').toLowerCase().includes(query) ||
            (t.subject || '').toLowerCase().includes(query)
        );
    }
    
    res.json({ success: true, query, results });
});

// ==================== Exams Routes ====================
app.get('/api/exams', authMiddleware, (req, res) => {
    const { classId } = req.query;
    let exams = db.exams;
    if (classId && classId !== '0') {
        exams = exams.filter(e => e.classId === '0' || e.classId === classId);
    }
    res.json({ success: true, data: exams, total: exams.length });
});

app.get('/api/exams/:id', authMiddleware, (req, res) => {
    const exam = db.exams.find(e => e.id === req.params.id);
    if (!exam) {
        return res.status(404).json({ success: false, message: 'Exam not found' });
    }
    res.json({ success: true, data: exam });
});

app.post('/api/exams', authMiddleware, adminOnly, (req, res) => {
    const newExam = {
        id: generateId(),
        ...req.body,
        status: 'upcoming',
        createdAt: new Date().toISOString()
    };
    
    db.exams.push(newExam);
    io.emit('examsUpdated', db.exams);
    
    res.status(201).json({
        success: true,
        message: 'Exam added successfully',
        data: newExam
    });
});

app.put('/api/exams/:id', authMiddleware, adminOnly, (req, res) => {
    const index = db.exams.findIndex(e => e.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Exam not found' });
    }
    
    db.exams[index] = {
        ...db.exams[index],
        ...req.body,
        updatedAt: new Date().toISOString()
    };
    
    io.emit('examsUpdated', db.exams);
    
    res.json({
        success: true,
        message: 'Exam updated successfully',
        data: db.exams[index]
    });
});

app.delete('/api/exams/:id', authMiddleware, adminOnly, (req, res) => {
    const index = db.exams.findIndex(e => e.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Exam not found' });
    }
    
    db.exams.splice(index, 1);
    io.emit('examsUpdated', db.exams);
    
    res.json({ success: true, message: 'Exam deleted successfully' });
});

// ==================== Results Routes ====================
app.get('/api/results', authMiddleware, (req, res) => {
    const { examId, studentId, classId } = req.query;
    let results = db.results;
    
    if (examId) {
        results = results.filter(r => r.examId === examId);
    }
    if (studentId) {
        results = results.filter(r => r.studentId === studentId);
    }
    
    // Enrich with student and exam data
    const enrichedResults = results.map(result => {
        const student = db.students.find(s => s.id === result.studentId);
        const exam = db.exams.find(e => e.id === result.examId);
        return {
            ...result,
            studentName: student?.banglaName || '-',
            studentId: student?.studentId || '-',
            examName: exam?.name || '-'
        };
    });
    
    res.json({ success: true, data: enrichedResults });
});

app.post('/api/results', authMiddleware, (req, res) => {
    const { examId, studentId, marks, grade, gpa } = req.body;
    
    // Check if result already exists
    const existingIndex = db.results.findIndex(r => r.examId === examId && r.studentId === studentId);
    
    const resultData = {
        id: existingIndex >= 0 ? db.results[existingIndex].id : generateId(),
        examId,
        studentId,
        marks: Number(marks),
        grade: grade || calculateGrade(Number(marks)),
        gpa: gpa || calculateGPA(Number(marks)),
        savedAt: new Date().toISOString()
    };
    
    if (existingIndex >= 0) {
        db.results[existingIndex] = resultData;
    } else {
        db.results.push(resultData);
    }
    
    io.emit('resultsUpdated', db.results);
    
    res.json({
        success: true,
        message: 'Result saved successfully',
        data: resultData
    });
});

// ==================== Payments Routes ====================
app.get('/api/payments', authMiddleware, (req, res) => {
    const { studentId, startDate, endDate } = req.query;
    let payments = db.payments;
    
    if (studentId) {
        payments = payments.filter(p => p.studentId === studentId);
    }
    
    // Enrich with student data
    const enrichedPayments = payments.map(payment => {
        const student = db.students.find(s => s.id === payment.studentId);
        return {
            ...payment,
            studentName: student?.banglaName || '-',
            studentId: student?.studentId || '-'
        };
    });
    
    res.json({ success: true, data: enrichedPayments });
});

app.post('/api/payments', authMiddleware, (req, res) => {
    const { studentId, feeId, amount, method, transactionId } = req.body;
    
    const newPayment = {
        id: generateId(),
        studentId,
        feeId,
        amount: Number(amount),
        method: method || 'cash',
        transactionId: transactionId || `PAY-${Date.now()}`,
        status: 'completed',
        paidAt: new Date().toISOString()
    };
    
    db.payments.push(newPayment);
    
    // Update student fee status
    if (feeId) {
        const feeIndex = db.studentFees.findIndex(f => f.id === feeId);
        if (feeIndex >= 0) {
            db.studentFees[feeIndex].status = 'paid';
            db.studentFees[feeIndex].paidDate = new Date().toISOString();
        }
    }
    
    io.emit('paymentsUpdated', db.payments);
    
    res.status(201).json({
        success: true,
        message: 'Payment recorded successfully',
        data: newPayment
    });
});

app.get('/api/payments/summary', authMiddleware, (req, res) => {
    const { startDate, endDate } = req.query;
    const payments = db.payments;
    
    const total = payments.reduce((sum, p) => sum + Number(p.amount), 0);
    const byMethod = {};
    payments.forEach(p => {
        byMethod[p.method] = (byMethod[p.method] || 0) + Number(p.amount);
    });
    
    res.json({
        success: true,
        data: {
            total,
            count: payments.length,
            byMethod
        }
    });
});

// ==================== Syllabus Routes ====================
app.get('/api/syllabus', authMiddleware, (req, res) => {
    const { classId } = req.query;
    let syllabus = db.syllabi;
    
    if (classId) {
        syllabus = syllabus.filter(s => s.classId === classId);
    }
    
    res.json({ success: true, data: syllabus });
});

app.post('/api/syllabus', authMiddleware, adminOnly, (req, res) => {
    const newSyllabus = {
        id: generateId(),
        ...req.body,
        createdAt: new Date().toISOString()
    };
    
    db.syllabi.push(newSyllabus);
    io.emit('syllabusUpdated', db.syllabi);
    
    res.status(201).json({
        success: true,
        message: 'Syllabus added successfully',
        data: newSyllabus
    });
});

app.delete('/api/syllabus/:id', authMiddleware, adminOnly, (req, res) => {
    const index = db.syllabi.findIndex(s => s.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Syllabus not found' });
    }
    
    db.syllabi.splice(index, 1);
    io.emit('syllabusUpdated', db.syllabi);
    
    res.json({ success: true, message: 'Syllabus deleted successfully' });
});

// ==================== Exam Routines Routes ====================
app.get('/api/exam-routines', authMiddleware, (req, res) => {
    const { examId, classId } = req.query;
    let routines = db.examRoutines;
    
    if (examId) {
        routines = routines.filter(r => r.examId === examId);
    }
    if (classId) {
        routines = routines.filter(r => r.classId === classId);
    }
    
    res.json({ success: true, data: routines });
});

app.post('/api/exam-routines', authMiddleware, adminOnly, (req, res) => {
    const newRoutine = {
        id: generateId(),
        ...req.body,
        createdAt: new Date().toISOString()
    };
    
    db.examRoutines.push(newRoutine);
    io.emit('examRoutinesUpdated', db.examRoutines);
    
    res.status(201).json({
        success: true,
        message: 'Exam routine added successfully',
        data: newRoutine
    });
});

app.delete('/api/exam-routines/:id', authMiddleware, adminOnly, (req, res) => {
    const index = db.examRoutines.findIndex(r => r.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Exam routine not found' });
    }
    
    db.examRoutines.splice(index, 1);
    io.emit('examRoutinesUpdated', db.examRoutines);
    
    res.json({ success: true, message: 'Exam routine deleted successfully' });
});

// ==================== Utility Functions ====================
const calculateGrade = (marks) => {
    if (marks >= 90) return 'A+';
    if (marks >= 80) return 'A';
    if (marks >= 70) return 'A-';
    if (marks >= 60) return 'B';
    if (marks >= 50) return 'C';
    if (marks >= 40) return 'D';
    return 'F';
};

const calculateGPA = (marks) => {
    if (marks >= 90) return 5.00;
    if (marks >= 80) return 4.00;
    if (marks >= 70) return 3.50;
    if (marks >= 60) return 3.00;
    if (marks >= 50) return 2.00;
    if (marks >= 40) return 1.00;
    return 0.00;
};

// ==================== Dashboard Stats ====================
app.get('/api/dashboard/stats', authMiddleware, (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    
    const stats = {
        totalStudents: db.students.length,
        activeStudents: db.students.filter(s => s.status === 'active').length,
        totalTeachers: db.teachers.length,
        activeTeachers: db.teachers.filter(t => t.status === 'active').length,
        totalClasses: db.classes.length,
        totalExams: db.exams.length,
        upcomingExams: db.exams.filter(e => e.status === 'upcoming').length,
        totalRevenue: db.payments.reduce((sum, p) => sum + Number(p.amount), 0),
        todayRevenue: db.payments
            .filter(p => p.paidAt && p.paidAt.startsWith(today))
            .reduce((sum, p) => sum + Number(p.amount), 0),
        pendingFees: db.studentFees.filter(f => f.status === 'unpaid').length,
        todayAttendance: {
            total: db.students.length,
            present: 0,
            absent: 0,
            percentage: 0
        }
    };

    // Calculate today's attendance
    const todayAttendance = db.attendance.find(a => a.date === today);
    if (todayAttendance && todayAttendance.records) {
        const records = todayAttendance.records;
        stats.todayAttendance.present = Object.values(records).filter(s => s === 'present').length;
        stats.todayAttendance.absent = Object.values(records).filter(s => s === 'absent').length;
        if (stats.todayAttendance.total > 0) {
            stats.todayAttendance.percentage = Math.round((stats.todayAttendance.present / stats.todayAttendance.total) * 100);
        }
    }

    res.json({ success: true, data: stats });
});

// Export all data
app.get('/api/export', authMiddleware, adminOnly, (req, res) => {
    const exportData = {
        students: db.students,
        teachers: db.teachers,
        classes: db.classes,
        sections: db.sections,
        subjects: db.subjects,
        feeTypes: db.feeTypes,
        studentFees: db.studentFees,
        attendance: db.attendance,
        notices: db.notices,
        exportDate: new Date().toISOString()
    };
    
    res.json({ success: true, data: exportData });
});

// Import data
app.post('/api/import', authMiddleware, adminOnly, (req, res) => {
    const { data } = req.body;
    
    if (data.students) db.students = [...db.students, ...data.students];
    if (data.teachers) db.teachers = [...db.teachers, ...data.teachers];
    if (data.classes) db.classes = [...db.classes, ...data.classes];
    if (data.sections) db.sections = [...db.sections, ...data.sections];
    if (data.subjects) db.subjects = [...db.subjects, ...data.subjects];
    if (data.feeTypes) db.feeTypes = [...db.feeTypes, ...data.feeTypes];
    if (data.studentFees) db.studentFees = [...db.studentFees, ...data.studentFees];
    if (data.attendance) db.attendance = [...db.attendance, ...data.attendance];
    if (data.notices) db.notices = [...db.notices, ...data.notices];

    res.json({ success: true, message: 'Data imported successfully' });
});

// Config Routes
app.get('/api/config', authMiddleware, (req, res) => {
    res.json({ success: true, data: db.config });
});

app.put('/api/config', authMiddleware, adminOnly, (req, res) => {
    db.config = { ...db.config, ...req.body };
    io.emit('configUpdated', db.config);
    res.json({ success: true, message: 'Config updated successfully', data: db.config });
});

// ==================== Socket.IO Events ====================
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
    
    // Join room for specific updates
    socket.on('joinRoom', (room) => {
        socket.join(room);
    });
    
    // Request current state
    socket.emit('initialState', {
        students: db.students,
        teachers: db.teachers,
        classes: db.classes
    });
});

// ==================== Serve Frontend ====================
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ==================== Start Server ====================
server.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║   🏫 পাঠশালা ই-ম্যানেজার                           ║
║   School Management System - Dynamic Server       ║
║                                                   ║
║   Server running on port ${PORT}                    ║
║   API Base: http://localhost:${PORT}/api            ║
║                                                   ║
║   Default Login:                                  ║
║   Username: admin                                 ║
║   Password: admin123                              ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
    `);
});

module.exports = { app, server, io };
