import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Flame, 
  Calendar, 
  Clock, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid
} from 'recharts';
import { Student, StudentHistoryPoint, SubmissionDetail } from '../types';
import { getStudentById, getStudentHistory, getStudentSubmissions } from '../services/api';
import { ScoreBadge } from '../components/ScoreBadge';
import { SubmissionModal } from '../components/SubmissionModal';

export const StudentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const studentId = Number(id);

  const [student, setStudent] = useState<Student | null>(null);
  const [history, setHistory] = useState<StudentHistoryPoint[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionDetail[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [studentData, historyData, submissionsData] = await Promise.all([
          getStudentById(studentId),
          getStudentHistory(studentId),
          getStudentSubmissions(studentId),
        ]);
        if (studentData) setStudent(studentData);
        setHistory(historyData);
        setSubmissions(submissionsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [studentId]);

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center min-h-[50vh] text-slate-400">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <span>O'quvchi ma'lumotlari yuklanmoqda...</span>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">O'quvchi topilmadi</h2>
        <Link to="/" className="text-indigo-600 hover:underline text-sm font-medium">
          Ro'yxatga qaytish
        </Link>
      </div>
    );
  }

  const initials = student.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  // Format history data for chart
  const chartData = history.map((item) => ({
    date: item.date.slice(5), // MM-DD
    band: item.band,
    task_type: item.task_type.toUpperCase(),
    fullDate: item.date,
  }));

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Back Button and Breadcrumb */}
      <div className="flex items-center gap-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 shadow-sm transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>O'quvchilar ro'yxatiga qaytish</span>
        </Link>
      </div>

      {/* Student Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-extrabold text-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            {initials}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-black text-slate-900">{student.name}</h2>
              <ScoreBadge score={student.avg_band} size="lg" showLabel={true} />
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">@{student.username} • Telegram ID: {1002340 + student.id}</p>
          </div>
        </div>

        {/* Quick Stats Pills */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex-1 sm:flex-initial bg-amber-50/80 border border-amber-200/70 px-4 py-2.5 rounded-xl text-center">
            <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider block">Muntazamlik</span>
            <div className="flex items-center justify-center gap-1.5 font-black text-amber-900 text-base mt-0.5">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>{student.streak_days} kun streak</span>
            </div>
          </div>

          <div className="flex-1 sm:flex-initial bg-indigo-50/80 border border-indigo-200/70 px-4 py-2.5 rounded-xl text-center">
            <span className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wider block">Yuborilgan insholar</span>
            <div className="font-black text-indigo-900 text-base mt-0.5">
              {student.submissions_count} ta insho
            </div>
          </div>

          <div className="flex-1 sm:flex-initial bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-center">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Oxirgi faollik</span>
            <div className="font-bold text-slate-700 text-sm mt-0.5 flex items-center justify-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{student.last_active}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Chart Section (Line Chart as requested in SPEC.md) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold text-slate-900">Band Ball Tarixi va Dinamikasi</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Vaqt o'tishi bilan o'quvchining yozma ishlarida band ball o'sish ko'rsatkichi
            </p>
          </div>
          <span className="hidden sm:inline-flex text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            Maqsad: 7.5+
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} 
                stroke="#cbd5e1"
              />
              <YAxis 
                domain={[4.0, 9.0]} 
                ticks={[4.0, 5.0, 6.0, 7.0, 8.0, 9.0]}
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                stroke="#cbd5e1"
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-800 text-xs space-y-1">
                        <div className="text-slate-400">{data.fullDate}</div>
                        <div className="font-bold text-indigo-300">{data.task_type}</div>
                        <div className="text-sm font-extrabold text-white flex items-center gap-1.5">
                          <span>Natija:</span>
                          <span className="text-emerald-400">Band {data.band.toFixed(1)}</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line 
                type="monotone" 
                dataKey="band" 
                stroke="#4f46e5" 
                strokeWidth={3}
                dot={{ fill: '#4f46e5', stroke: '#ffffff', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, fill: '#6366f1', stroke: '#ffffff', strokeWidth: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Submissions List Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">Barcha Yuborilgan Insholar</h3>
            <p className="text-xs text-slate-500">Inshoning to'liq matni, mezonlar va AI tavsiyalarini ko'rish uchun tanlang</p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-lg">
            {submissions.length} ta mavjud
          </span>
        </div>

        <div className="space-y-3">
          {submissions.map((sub) => (
            <div
              key={sub.id}
              onClick={() => setSelectedSubmission(sub)}
              className="p-4 rounded-xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-md bg-white hover:bg-indigo-50/20 transition-all cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
            >
              <div className="flex-1 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wide ${
                    sub.task_type === 'task2' ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {sub.task_type === 'task2' ? 'Task 2 Essay' : 'Task 1 Report'}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(sub.created_at).toLocaleDateString('uz-UZ')}</span>
                  </div>
                </div>
                <h4 className="text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
                  {sub.topic}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {sub.essay}
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0 self-end sm:self-center">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Natija</span>
                  <ScoreBadge score={sub.band_score} size="md" />
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white text-slate-400 flex items-center justify-center transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      <SubmissionModal
        submission={selectedSubmission}
        onClose={() => setSelectedSubmission(null)}
      />
    </div>
  );
};
