"use client";

import { useAssignmentStore } from '../store/useAssignmentStore';
import { LayoutGrid, Users, FileBarChart, Wrench, Clock, Plus } from 'lucide-react';

/* ── design tokens ── */
const navy = '#1C2B4A';
const navyMid = '#2E4270';
const gold = '#C4873A';
const cream = '#F9F5EE';
const creamD = '#EDE7D9';
const inkL = '#4A4540';
const inkM = '#8C8580';
const border = 'rgba(26,23,20,0.1)';

const navItems = [
  { icon: LayoutGrid, label: 'Home', view: null },
  { icon: Users, label: 'My Groups', view: null },
  { icon: FileBarChart, label: 'Assignments', view: 'list' },
  { icon: Wrench, label: "AI Teacher's Toolkit", view: null },
  { icon: Clock, label: 'My Library', view: null },
];

export function Sidebar() {
  const store = useAssignmentStore();

  return (
    <aside
      className="hidden md:flex w-64 flex-col shrink-0 print:hidden" 
      style={{
        background: '#fff',
        borderRight: `1px solid ${border}`,
        height: '100vh',
        position: 'sticky',
        top: 0,
      }}
    >
      {/* ── Logo ─────────────────────────────────────── */}
      <div
        className="flex items-center gap-3 px-6 py-5"
        style={{ borderBottom: `1px solid ${border}` }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: navy }}
        >
          {/* book icon inline */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
        </div>
        <span
          className="text-lg font-bold tracking-tight"
          style={{ color: navy, fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          AssignmentAI
        </span>
        <span
          className="ml-auto text-[9px] font-medium tracking-widest uppercase px-1.5 py-0.5 rounded border"
          style={{ color: gold, borderColor: gold, letterSpacing: '0.12em' }}
        >
          AI
        </span>
      </div>

      {/* ── Create button ─────────────────────────────── */}
      <div className="px-4 py-4">
        <button
          onClick={() => store.setView('create')}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm transition-all duration-200"
          style={{
            background: navy,
            color: '#fff',
            border: `1px solid ${navy}`,
          }}
          onMouseEnter={e => Object.assign((e.currentTarget as HTMLElement).style, {
            background: navyMid,
            boxShadow: '0 4px 16px rgba(28,43,74,0.28)',
            transform: 'translateY(-1px)',
          })}
          onMouseLeave={e => Object.assign((e.currentTarget as HTMLElement).style, {
            background: navy,
            boxShadow: 'none',
            transform: 'translateY(0)',
          })}
        >
          <Plus size={16} />
          Create Assignment
        </button>
      </div>

      {/* ── Nav ───────────────────────────────────────── */}
      <nav className="flex-1 px-3 py-1 space-y-0.5">
        {navItems.map((item, idx) => {
          const isActive =
            store.currentView === item.view ||
            (item.label === 'Assignments' && store.currentView === 'list');

          return (
            <button
              key={idx}
              onClick={() => item.view && store.setView(item.view as any)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150"
              style={{
                background: isActive ? cream : 'transparent',
                color: isActive ? navy : inkL,
                fontWeight: isActive ? 500 : 400,
                border: isActive ? `1px solid ${creamD}` : '1px solid transparent',
              }}
              onMouseEnter={e => {
                if (!isActive)
                  (e.currentTarget as HTMLElement).style.background = cream;
              }}
              onMouseLeave={e => {
                if (!isActive)
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
              }}
            >
              <item.icon
                size={17}
                style={{ color: isActive ? navy : inkM, flexShrink: 0 }}
              />
              {item.label}

              {/* active indicator dot */}
              {isActive && (
                <span
                  className="ml-auto w-1.5 h-1.5 rounded-full"
                  style={{ background: gold }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* ── School card ───────────────────────────────── */}
      <div className="p-4" style={{ borderTop: `1px solid ${border}` }}>
        <div
          className="flex items-center gap-3 p-3 rounded-xl"
          style={{ background: cream, border: `1px solid ${creamD}` }}
        >
          {/* avatar */}
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
            style={{ background: navy, color: '#fff', fontFamily: 'inherit' }}
          >
            DPS
          </div>
          <div className="min-w-0">
            <p
              className="text-xs font-semibold truncate"
              style={{ color: navy }}
            >
              Delhi Public School
            </p>
            <p className="text-xs truncate" style={{ color: inkM }}>
              Bokaro Steel City
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}