import { Student, StudentHistoryPoint, SubmissionDetail } from '../types';
import studentsMock from '../mock/students.json';
import historyMockRaw from '../mock/history.json';
import submissionsMock from '../mock/submissions.json';

const historyMock: Record<string, StudentHistoryPoint[]> = historyMockRaw as Record<string, StudentHistoryPoint[]>;

/**
 * Backend tayyor bo'lganda bu yerdagi `USE_MOCK` qiymatini `false` qilish
 * va `API_BASE_URL` ni haqiqiy backend manziliga ulash kifoya.
 */
export const USE_MOCK = true;
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

/**
 * Barcha o'quvchilar ro'yxati (GET /api/students)
 */
export async function getStudents(): Promise<Student[]> {
  if (USE_MOCK) {
    // Simulyatsiya qilingan kichik kechikish (realistik UX uchun)
    await new Promise((resolve) => setTimeout(resolve, 80));
    return [...studentsMock] as Student[];
  }

  const response = await fetch(`${API_BASE_URL}/students`);
  if (!response.ok) throw new Error("Talabalar ma'lumotlarini yuklab bo'lmadi");
  return response.json();
}

/**
 * ID bo'yicha bitta o'quvchi ma'lumotlari
 */
export async function getStudentById(id: number): Promise<Student | undefined> {
  const allStudents = await getStudents();
  return allStudents.find((s) => s.id === id);
}

/**
 * O'quvchining band ball tarixi (GET /api/students/{id}/history)
 */
export async function getStudentHistory(studentId: number): Promise<StudentHistoryPoint[]> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return historyMock[String(studentId)] || [
      { date: "2026-09-01", task_type: "task2", band: 6.0 },
      { date: "2026-09-15", task_type: "task1", band: 6.5 }
    ];
  }

  const response = await fetch(`${API_BASE_URL}/students/${studentId}/history`);
  if (!response.ok) throw new Error("O'quvchi tarixini yuklab bo'lmadi");
  return response.json();
}

/**
 * O'quvchining barcha yuborgan insholari
 */
export async function getStudentSubmissions(studentId: number): Promise<SubmissionDetail[]> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 90));
    const studentSubmissions = (submissionsMock as SubmissionDetail[]).filter(
      (sub) => sub.student_id === studentId
    );

    // Agar o'quvchiga aniq insho bog'lanmagan bo'lsa, umumiy namuna qaytaramiz
    if (studentSubmissions.length === 0) {
      return (submissionsMock as SubmissionDetail[]).slice(0, 2).map((sub, idx) => ({
        ...sub,
        id: 100 + studentId * 10 + idx,
        student_id: studentId,
      }));
    }
    return studentSubmissions;
  }

  const response = await fetch(`${API_BASE_URL}/students/${studentId}/submissions`);
  if (!response.ok) throw new Error("Insholarni yuklab bo'lmadi");
  return response.json();
}

/**
 * Bitta inshoning to'liq tafsiloti (GET /api/students/{id}/submissions/{submission_id})
 */
export async function getSubmissionDetail(
  studentId: number,
  submissionId: number
): Promise<SubmissionDetail | undefined> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 80));
    const found = (submissionsMock as SubmissionDetail[]).find(
      (s) => s.id === submissionId
    );
    if (found) return found;
    return (submissionsMock as SubmissionDetail[])[0];
  }

  const response = await fetch(
    `${API_BASE_URL}/students/${studentId}/submissions/${submissionId}`
  );
  if (!response.ok) throw new Error("Insho tafsilotlarini yuklab bo'lmadi");
  return response.json();
}
