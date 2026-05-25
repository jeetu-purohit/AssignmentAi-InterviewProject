"use client";

import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAssignmentStore } from '../src/store/useAssignmentStore';
import { Sidebar } from '../src/components/Sidebar';
import { Header } from '../src/components/Header';
import { CreateForm } from '../src/components/CreateForm';
import { PaperView } from '../src/components/PaperView';
import { Plus } from 'lucide-react';

/* ── design tokens ── */
const navy = '#1C2B4A';
const navyM = '#2E4270';
const gold = '#C4873A';
const cream = '#F9F5EE';
const creamD = '#EDE7D9';
const inkL = '#4A4540';
const inkM = '#8C8580';
const border = 'rgba(26,23,20,0.1)';

export default function Dashboard() {
  const store = useAssignmentStore();

  const { isGenerating, assignmentId, setGeneratedPaper, setView, fetchAssignments, pastAssignments } = store;

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  useEffect(() => {
    if (!isGenerating || !assignmentId) return;

    const socket = io('api-production-45794.up.railway.app');

    socket.on('connect', () => {
      console.log('Connected to socket, joining room:', assignmentId);
      socket.emit('join_assignment', assignmentId);
    });

    socket.on('paper_ready', (payload) => {
      console.log('Received paper from AI!', payload);
      const finalPaper = typeof payload === 'string' ? JSON.parse(payload) : payload;
      setGeneratedPaper(finalPaper);
      setView('paper');
    });

    return () => {
      socket.disconnect();
    };
  }, [isGenerating, assignmentId, setGeneratedPaper, setView]);

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: cream, fontFamily: "'DM Sans', sans-serif" }}
    >
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto">

          {/* ══ LIST VIEW ══════════════════════════════════ */}
          {store.currentView === 'list' && (
            <div className="h-full px-8 py-12">

              {/* Conditional Rendering: Empty State vs Grid */}
              {pastAssignments.length === 0 ? (

                /* --- EMPTY STATE (Your exact design) --- */
                <div className="h-full flex flex-col items-center justify-center">
                  <div className="mb-8 relative">
                    <div
                      className="absolute inset-0 rounded-2xl"
                      style={{ background: creamD, transform: 'rotate(3deg) translate(6px, 6px)' }}
                    />
                    <div
                      className="absolute inset-0 rounded-2xl"
                      style={{ background: '#E8E2D6', transform: 'rotate(-2deg) translate(-4px, 4px)' }}
                    />
                    <div
                      className="relative w-32 h-40 rounded-2xl flex flex-col items-center justify-center gap-2"
                      style={{ background: '#fff', border: `1px solid ${border}`, boxShadow: '0 4px 20px rgba(26,23,20,0.08)' }}
                    >
                      {[0, 1, 2, 3, 4].map(i => (
                        <div
                          key={i} className="rounded-full"
                          style={{ width: i === 0 ? 56 : 72, height: 3, background: i === 0 ? gold : creamD, opacity: i === 0 ? 1 : 0.8 }}
                        />
                      ))}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-2 text-center" style={{ color: navy, fontFamily: "'Playfair Display', Georgia, serif" }}>
                    No assignments yet
                  </h3>
                  <p className="text-sm text-center mb-8 max-w-xs leading-relaxed" style={{ color: inkM }}>
                    Create your first assignment to start collecting and grading student submissions.
                  </p>

                  <button
                    onClick={() => store.setView('create')}
                    className="flex items-center gap-2 px-7 py-3 rounded-xl font-medium text-sm transition-all duration-200"
                    style={{ background: navy, color: '#fff', border: `1px solid ${navy}`, fontSize: '0.9375rem' }}
                    onMouseEnter={e => Object.assign((e.currentTarget as HTMLElement).style, { background: navyM, transform: 'translateY(-1px)', boxShadow: '0 6px 20px rgba(28,43,74,0.28)' })}
                    onMouseLeave={e => Object.assign((e.currentTarget as HTMLElement).style, { background: navy, transform: 'translateY(0)', boxShadow: 'none' })}
                  >
                    <Plus size={16} />
                    Create Your First Assignment
                  </button>

                  <div className="flex items-center gap-6 mt-10 pt-8" style={{ borderTop: `1px solid ${border}` }}>
                    {[
                      { num: '2.4k', label: 'Papers Generated' },
                      { num: '340', label: 'Teachers' },
                      { num: '45s', label: 'Avg. Generation' },
                    ].map(s => (
                      <div key={s.label} className="text-center">
                        <div className="text-xl font-bold" style={{ color: navy, fontFamily: "'Playfair Display', Georgia, serif" }}>{s.num}</div>
                        <div className="text-xs uppercase tracking-widest mt-0.5" style={{ color: inkM, letterSpacing: '0.08em' }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

              ) : (

                /* --- GRID STATE (Matches your design tokens) --- */
                <div className="max-w-6xl mx-auto">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold" style={{ color: navy, fontFamily: "'Playfair Display', Georgia, serif" }}>
                      Recent Assignments
                    </h2>
                    <button
                      onClick={() => store.setView('create')}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200"
                      style={{ background: navy, color: '#fff', border: `1px solid ${navy}` }}
                      onMouseEnter={e => Object.assign((e.currentTarget as HTMLElement).style, { background: navyM })}
                      onMouseLeave={e => Object.assign((e.currentTarget as HTMLElement).style, { background: navy })}
                    >
                      <Plus size={16} /> New Assessment
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pastAssignments.map((assignment: any) => (
                      <div
                        key={assignment._id}
                        className="p-7 rounded-2xl flex flex-col justify-between transition-all duration-300 bg-white group cursor-pointer"
                        style={{ border: `1px solid ${border}`, boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}
                        onMouseEnter={e => Object.assign((e.currentTarget as HTMLElement).style, { transform: 'translateY(-2px)', boxShadow: '0 8px 30px rgba(28,43,74,0.08)' })}
                        onMouseLeave={e => Object.assign((e.currentTarget as HTMLElement).style, { transform: 'translateY(0)', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' })}
                      >
                        <div>
                          <h4 className="text-lg font-bold mb-4" style={{ color: navy, fontFamily: "'Playfair Display', Georgia, serif" }}>
                            AI Generated Assessment
                          </h4>
                          <div className="space-y-2 mb-8">
                            <div className="flex justify-between items-center border-b pb-2" style={{ borderColor: border }}>
                              <span className="text-sm font-medium tracking-wide" style={{ color: inkM }}>ASSIGNED</span>
                              <span className="text-sm font-bold" style={{ color: inkL }}>
                                {new Date(assignment.createdAt).toLocaleDateString('en-GB')}
                              </span>
                            </div>
                            <div className="flex justify-between items-center border-b pb-2" style={{ borderColor: border }}>
                              <span className="text-sm font-medium tracking-wide" style={{ color: inkM }}>DUE DATE</span>
                              <span className="text-sm font-bold" style={{ color: gold }}>
                                {new Date(assignment.dueDate).toLocaleDateString('en-GB')}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            if (assignment.generatedPaper) {
                              store.setGeneratedPaper(assignment.generatedPaper);
                              store.setView('paper');
                            }
                          }}
                          className="w-full py-3 rounded-xl text-sm font-bold transition-all tracking-wide"
                          style={{ background: cream, color: navy, border: `1px solid ${border}` }}
                          onMouseEnter={e => Object.assign((e.currentTarget as HTMLElement).style, { background: creamD })}
                          onMouseLeave={e => Object.assign((e.currentTarget as HTMLElement).style, { background: cream })}
                        >
                          {assignment.status === 'PENDING' ? 'Processing...' : 'View Assessment'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══ CREATE VIEW ══════════════════════════════════ */}
          {store.currentView === 'create' && (
            <div className="px-8">
              <CreateForm />
            </div>
          )}

          {/* ══ PAPER VIEW ═══════════════════════════════════ */}
          {store.currentView === 'paper' && <PaperView />}

        </main>
      </div>
    </div>
  );
}