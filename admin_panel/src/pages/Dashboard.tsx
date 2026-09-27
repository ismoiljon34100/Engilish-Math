import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Flame, 
  FileText, 
  Award, 
  Search, 
  ArrowUpRight, 
  Calendar,
  Filter,
  RefreshCw
} from 'lucide-react';
import { Student } from '../types';
import { getStudents } from '../services/api';
import { ScoreBadge } from '../components/ScoreBadge';

export const Dashboard: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'avg_band' | 'streak_days' | 'submissions_count'>('avg_band');

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await getStudents();
      setStudents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Filter and sort students
  const filteredStudents = useMemo(() => {
    return students
      .filter((s) => {
        const query = searchQuery.toLowerCase();
        return s.name.toLowerCase().includes(query) || s.username.toLowerCase().includes(query);
      })
      .sort((a, b) => b[sortBy] - a[sortBy]);
  }, [students, searchQuery, sortBy]);

  // Overall statistics
  const stats = useMemo(() => {
    if (students.length === 0) return { total: 0, avgScore: '0.0', totalSubmissions: 0, maxStreak: 0 };
    const total = students.length;
    const avgScore = (students.reduce((acc, cur) => acc + cur.avg_band, 0) / total).toFixed(1);
    const totalSubmissions = students.reduce((acc, cur) => acc + cur.submissions_count, 0);
    const maxStreak = Math.max(...students.map((s) => s.streak_days));
    return { total, avgScore, totalSubmissions, maxStreak };
  }, [students]);

  return (
    <div className="p-6 space-y-6">
      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Jami O'quvchilar</span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{stats.total} ta</div>
            <span className="text-[11px] text-emerald-600 font-medium">Telegram bot orqali</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">O'rtacha Band Ball</span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{stats.avgScore}</div>
            <span className="text-[11px] text-indigo-600 font-medium">Barcha topshiriqlar</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Eng Yuqori Streak</span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{stats.maxStreak} kun</div>
            <span className="text-[11px] text-amber-600 font-medium">Kunlik muntazamlik</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tekshirilgan Insholar</span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{stats.totalSubmissions} ta</div>
            <span className="text-[11px] text-emerald-600 font-medium">AI tekshiruvidan o'tgan</span>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Table Header Controls */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">O'quvchilar Ro'yxati</h2>
            <p className="text-xs text-slate-500">IELTS Writing topshirayotgan o'quvchilar va ularning umumiy statistikasi</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ism yoki username..."
                className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 placeholder-slate-400 transition-all"
              />
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-2.5 py-2 font-medium focus:outline-none focus:border-indigo-500"
              >
                <option value="avg_band">Band ball bo'yicha</option>
                <option value="streak_days">Streak bo'yicha</option>
                <option value="submissions_count">Insholar soni bo'yicha</option>
              </select>
            </div>

            <button
              onClick={fetchStudents}
              title="Yangilash"
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-indigo-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">O'quvchi</th>
                <th className="py-3.5 px-4 text-center">O'rtacha Band</th>
                <th className="py-3.5 px-4 text-center">Streak</th>
                <th className="py-3.5 px-4 text-center">Insholar Soni</th>
                <th className="py-3.5 px-4">Oxirgi Faollik</th>
                <th className="py-3.5 px-6 text-right">Harakat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-indigo-500 mb-2" />
                    <span>Ma'lumotlar yuklanmoqda...</span>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Hech qanday o'quvchi topilmadi.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const initials = student.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase();

                  return (
                    <tr 
                      key={student.id} 
                      className="hover:bg-indigo-50/30 transition-colors group"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-100 to-slate-200 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                            {initials}
                          </div>
                          <div>
                            <Link 
                              to={`/students/${student.id}`} 
                              className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors block"
                            >
                              {student.name}
                            </Link>
                            <span className="text-xs text-slate-400 font-medium">@{student.username}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-center">
                        <ScoreBadge score={student.avg_band} showLabel={false} />
                      </td>

                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60 text-xs font-bold">
                          <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>{student.streak_days} kun</span>
                        </span>
                      </td>

                      <td className="py-4 px-4 text-center">
                        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                          {student.submissions_count} ta
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{student.last_active}</span>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <Link
                          to={`/students/${student.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                        >
                          <span>Tafsilotlar</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
