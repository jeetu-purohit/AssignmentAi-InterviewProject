"use client";

import { useAssignmentStore } from '../store/useAssignmentStore';
import { Bell, ArrowLeft } from 'lucide-react';

/* ── design tokens ── */
const navy = '#1C2B4A';
const gold = '#C4873A';
const inkL = '#4A4540';
const inkM = '#8C8580';
const border = 'rgba(26,23,20,0.1)';

export function Header() {
  const store = useAssignmentStore();

  const getTitle = () => {
    switch (store.currentView) {
      case 'create': return 'New Assessment';
      case 'paper': return 'Generated Paper';
      default: return 'Assignments';
    }
  };

  const getSubtitle = () => {
    switch (store.currentView) {
      case 'create': return 'Configure parameters and generate a question paper';
      case 'paper': return 'Review, edit and export your AI-generated paper';
      default: return 'Manage and track all your assessments';
    }
  };

  return (
    <header
      className="flex items-center justify-between px-8 py-0 shrink-0 print:hidden"
      style={{
        height: 72,
        borderBottom: `1px solid ${border}`,
        background: '#F9F1EA',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* ── Left: back + title ─────────────────────────── */}
      <div className="flex items-center gap-3">
        {store.currentView !== 'list' && (
          <button
            onClick={() => store.setView('list')}
            className="flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-150"
            style={{
              border: `1px solid ${border}`,
              background: '#fff',
              color: inkL,
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = '#EDE7D9';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = '#fff';
            }}
          >
            <ArrowLeft size={15} />
          </button>
        )}

        <div>
          <h2
            className="text-base font-bold leading-tight"
            style={{
              color: navy,
              fontFamily: "'Playfair Display', Georgia, serif",
            }}
          >
            {getTitle()}
          </h2>
          <p className="text-xs leading-tight mt-0.5" style={{ color: inkM }}>
            {getSubtitle()}
          </p>
        </div>
      </div>

      {/* ── Right: bell + user ─────────────────────────── */}
      <div className="flex items-center gap-3">

        {/* notification bell */}
        <button
          className="relative flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-150"
          style={{ border: `1px solid ${border}`, background: '#fff', color: inkM }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = '#EDE7D9';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = '#fff';
          }}
        >
          <Bell size={16} />
          {/* unread dot */}
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2"
            style={{ background: '#C94040', borderColor: 'rgba(249,245,238,0.9)' }}
          />
        </button>

        {/* user pill */}
        <div
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl"
          style={{
            background: '#fff',
            border: `1px solid ${border}`,
            boxShadow: '0 2px 8px rgba(26,23,20,0.06)',
          }}
        >
          {/* avatar */}
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
            style={{ background: navy, color: '#fff' }}
          >
            JP
          </div>
          <span className="text-sm font-medium pr-1" style={{ color: inkL }}>
            Jeetu Purohit
          </span>
        </div>
      </div>
    </header>
  );
}