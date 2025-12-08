// services/firebaseService.ts
import { rtdb } from '@/firebaseConfig';
import { get, push, ref, remove, set, update } from 'firebase/database';

// Student Profile Functions
export const studentService = {
  // Save student profile
  async saveStudentProfile(studentData: any, userId?: string) {
    try {
      const studentsRef = ref(rtdb, 'students');
      const newStudentRef = push(studentsRef);
      await set(newStudentRef, {
        ...studentData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: userId || 'anonymous',
      });
      return { id: newStudentRef.key, ...studentData };
    } catch (error) {
      console.error('Error saving student profile:', error);
      throw error;
    }
  },

  // Get all students
  async getAllStudents() {
    try {
      const studentsRef = ref(rtdb, 'students');
      const snapshot = await get(studentsRef);
      if (snapshot.exists()) {
        const students = snapshot.val();
        return Object.keys(students).map(key => ({ id: key, ...students[key] }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  },

  // Get student by ID
  async getStudentById(studentId: string) {
    try {
      const studentRef = ref(rtdb, `students/${studentId}`);
      const snapshot = await get(studentRef);
      if (snapshot.exists()) {
        return { id: studentId, ...snapshot.val() };
      }
      return null;
    } catch (error) {
      console.error('Error fetching student:', error);
      throw error;
    }
  },

  // Update student profile
  async updateStudentProfile(studentId: string, updatedData: any) {
    try {
      const studentRef = ref(rtdb, `students/${studentId}`);
      await update(studentRef, {
        ...updatedData,
        updatedAt: new Date().toISOString(),
      });
      return { id: studentId, ...updatedData };
    } catch (error) {
      console.error('Error updating student profile:', error);
      throw error;
    }
  },

  // Delete student profile
  async deleteStudentProfile(studentId: string) {
    try {
      const studentRef = ref(rtdb, `students/${studentId}`);
      await remove(studentRef);
      return true;
    } catch (error) {
      console.error('Error deleting student profile:', error);
      throw error;
    }
  }
};

// Teacher Profile Functions
export const teacherService = {
  // Save teacher profile
  async saveTeacherProfile(teacherData: any, userId?: string) {
    try {
      const teachersRef = ref(rtdb, 'teachers');
      const newTeacherRef = push(teachersRef);
      await set(newTeacherRef, {
        ...teacherData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: userId || 'anonymous',
        status: 'active',
        rating: 0,
        totalStudents: 0,
      });
      return { id: newTeacherRef.key, ...teacherData };
    } catch (error) {
      console.error('Error saving teacher profile:', error);
      throw error;
    }
  },

  // Get all teachers
  async getAllTeachers() {
    try {
      const teachersRef = ref(rtdb, 'teachers');
      const snapshot = await get(teachersRef);
      if (snapshot.exists()) {
        const teachers = snapshot.val();
        return Object.keys(teachers).map(key => ({ id: key, ...teachers[key] }));
      }
      return [];
    } catch (error) {
      console.error('Error fetching teachers:', error);
      throw error;
    }
  },

  // Get teacher by ID
  async getTeacherById(teacherId: string) {
    try {
      const teacherRef = ref(rtdb, `teachers/${teacherId}`);
      const snapshot = await get(teacherRef);
      if (snapshot.exists()) {
        return { id: teacherId, ...snapshot.val() };
      }
      return null;
    } catch (error) {
      console.error('Error fetching teacher:', error);
      throw error;
    }
  },

  // Update teacher profile
  async updateTeacherProfile(teacherId: string, updatedData: any) {
    try {
      const teacherRef = ref(rtdb, `teachers/${teacherId}`);
      await update(teacherRef, {
        ...updatedData,
        updatedAt: new Date().toISOString(),
      });
      return { id: teacherId, ...updatedData };
    } catch (error) {
      console.error('Error updating teacher profile:', error);
      throw error;
    }
  },

  // Search teachers by subject (note: this is a simple search, not efficient for large data)
  async searchTeachersBySubject(subject: string) {
    try {
      const teachersRef = ref(rtdb, 'teachers');
      const snapshot = await get(teachersRef);
      if (snapshot.exists()) {
        const teachers = snapshot.val();
        return Object.keys(teachers)
          .filter(key => teachers[key].subjects && teachers[key].subjects.includes(subject))
          .map(key => ({ id: key, ...teachers[key] }));
      }
      return [];
    } catch (error) {
      console.error('Error searching teachers:', error);
      throw error;
    }
  }
};