"use client";

import { useState } from 'react';
import { useAssignmentStore } from '../store/useAssignmentStore';
import { AssignmentSchema } from '@veda/shared-types';
import { UploadCloud, AlertCircle, Calendar, ListChecks, FileText, Sparkles, ArrowRight } from 'lucide-react';

/* ── design tokens ── */
const navy = '#1C2B4A';
const navyM = '#2E4270';
const gold = '#C4873A';
const cream = '#F9F5EE';
const creamD = '#EDE7D9';
const inkL = '#4A4540';
const inkM = '#8C8580';
const border = 'rgba(26,23,20,0.1)';

const AVAILABLE_QUESTION_TYPES = [
  'Multiple Choice',
  'Short Answer',
  'Long Answer',
  'Coding',
  'True / False',
];

/* ── shared input style ── */
const inp: React.CSSProperties = {
  width: '100%',
  fontFamily: 'inherit',
  fontSize: '0.9375rem',
  color: '#1A1714',
  background: cream,
  border: `1px solid ${border}`,
  borderRadius: 8,
  padding: '0.6rem 0.85rem',
  outline: 'none',
  transition: 'all 0.2s',
};
const inpFocus: React.CSSProperties = {
  borderColor: navy,
  background: '#fff',
  boxShadow: '0 0 0 3px rgba(28,43,74,0.08)',
};
const inpBlur: React.CSSProperties = {
  borderColor: border,
  background: cream,
  boxShadow: 'none',
};

function FieldLabel({ icon, children }: { icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <label
      className="flex items-center gap-1.5 mb-1.5"
      style={{
        fontSize: '0.7rem',
        fontWeight: 500,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: inkL,
      }}
    >
      {icon && <span style={{ color: inkM }}>{icon}</span>}
      {children}
    </label>
  );
}

export function CreateForm() {
  const store = useAssignmentStore();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const dataToValidate = {
        dueDate: store.dueDate,
        questionTypes: store.questionTypes,
        numQuestions: Number(store.numQuestions),
        totalMarks: Number(store.totalMarks),
        additionalInstructions: store.additionalInstructions,
      };
      const validData = AssignmentSchema.parse(dataToValidate);
      const response = await fetch('http://localhost:5000/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validData),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to create assignment');
      store.setGenerating(true, result.assignmentId);
    } catch (err: any) {
      setError(err.errors ? err.errors[0].message : err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8">

      {/* ── Card ─────────────────────────────────────────── */}
      <div
        className="rounded-2xl p-8"
        style={{
          background: '#fff',
          border: `1px solid ${border}`,
          boxShadow: '0 8px 40px rgba(26,23,20,0.07)',
        }}
      >
        {/* card header */}
        <div
          className="mb-7 pb-6"
          style={{ borderBottom: `1px solid rgba(26,23,20,0.07)` }}
        >
          <h3
            className="text-xl font-bold"
            style={{ color: navy, fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Assignment Details
          </h3>
          <p className="text-sm mt-1" style={{ color: inkM }}>
            Basic information about your assignment
          </p>
        </div>

        {/* ── File upload ─────────────────────────────────── */}
        <div
          className="rounded-xl border-2 border-dashed p-8 text-center cursor-pointer mb-7 transition-colors duration-150"
          style={{ borderColor: 'rgba(26,23,20,0.12)' }}
          onMouseEnter={e => (e.currentTarget.style.background = creamD)}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <UploadCloud size={28} style={{ color: inkM, margin: '0 auto 10px' }} />
          <p className="text-sm font-medium" style={{ color: inkL }}>
            Choose a file or drag & drop it here
          </p>
          <p className="text-xs mt-1" style={{ color: inkM }}>
            PDF, DOCX, or TXT · up to 10 MB
          </p>
        </div>

        {/* ── Error ───────────────────────────────────────── */}
        {error && (
          <div
            className="mb-6 p-4 rounded-xl flex items-start gap-3 text-sm"
            style={{
              background: 'rgba(201,64,64,0.06)',
              borderLeft: '3px solid #C94040',
              color: '#C94040',
              borderRadius: '0 10px 10px 0',
            }}
          >
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ── Row: due date + counts ───────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <FieldLabel icon={<Calendar size={13} />}>Due Date</FieldLabel>
              <input
                type="date"
                value={store.dueDate}
                onChange={e => store.updateForm('dueDate', e.target.value)}
                required
                style={inp}
                onFocus={e => Object.assign(e.currentTarget.style, inpFocus)}
                onBlur={e => Object.assign(e.currentTarget.style, inpBlur)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel>Total Qs</FieldLabel>
                <input
                  type="number" min="1"
                  value={store.numQuestions}
                  onChange={e => store.updateForm('numQuestions', e.target.value)}
                  required
                  style={inp}
                  onFocus={e => Object.assign(e.currentTarget.style, inpFocus)}
                  onBlur={e => Object.assign(e.currentTarget.style, inpBlur)}
                />
              </div>
              <div>
                <FieldLabel>Total Marks</FieldLabel>
                <input
                  type="number" min="1"
                  value={store.totalMarks}
                  onChange={e => store.updateForm('totalMarks', e.target.value)}
                  required
                  style={inp}
                  onFocus={e => Object.assign(e.currentTarget.style, inpFocus)}
                  onBlur={e => Object.assign(e.currentTarget.style, inpBlur)}
                />
              </div>
            </div>
          </div>

          {/* ── Question types ───────────────────────────── */}
          <div>
            <FieldLabel icon={<ListChecks size={13} />}>Question Types</FieldLabel>
            <div className="flex flex-wrap gap-2 mt-1">
              {AVAILABLE_QUESTION_TYPES.map(type => {
                const on = store.questionTypes.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => store.toggleQuestionType(type)}
                    className="transition-all duration-150"
                    style={{
                      padding: '5px 16px',
                      borderRadius: 100,
                      fontSize: '0.84rem',
                      fontWeight: on ? 500 : 400,
                      cursor: 'pointer',
                      border: `1px solid ${on ? navy : border}`,
                      background: on ? navy : '#fff',
                      color: on ? '#fff' : inkL,
                      boxShadow: on ? '0 2px 8px rgba(28,43,74,0.2)' : 'none',
                    }}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Additional instructions ──────────────────── */}
          <div>
            <FieldLabel icon={<FileText size={13} />}>Additional Instructions</FieldLabel>
            <textarea
              rows={3}
              value={store.additionalInstructions}
              onChange={e => store.updateForm('additionalInstructions', e.target.value)}
              placeholder="e.g. Focus on React Hooks and context API. Avoid class components."
              style={{ ...inp, resize: 'none', minHeight: 88 }}
              onFocus={e => Object.assign(e.currentTarget.style, inpFocus)}
              onBlur={e => Object.assign(e.currentTarget.style, inpBlur)}
            />
          </div>

          {/* ── Divider ──────────────────────────────────── */}
          <div style={{ borderTop: `1px solid rgba(26,23,20,0.07)` }} />

          {/* ── Submit ───────────────────────────────────── */}
          <button
            type="submit"
            disabled={store.isGenerating}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: store.isGenerating ? inkM : navy,
              color: '#fff',
              border: `1px solid ${store.isGenerating ? inkM : navy}`,
              fontSize: '0.9375rem',
            }}
            onMouseEnter={e => {
              if (!store.isGenerating)
                Object.assign((e.currentTarget as HTMLElement).style, {
                  background: navyM,
                  transform: 'translateY(-1px)',
                  boxShadow: '0 6px 20px rgba(28,43,74,0.28)',
                });
            }}
            onMouseLeave={e => {
              Object.assign((e.currentTarget as HTMLElement).style, {
                background: store.isGenerating ? inkM : navy,
                transform: 'translateY(0)',
                boxShadow: 'none',
              });
            }}
          >
            {store.isGenerating ? (
              <>
                <span
                  className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"
                />
                Processing with AI…
              </>
            ) : (
              <>
                <Sparkles size={15} />
                Generate Assignment
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}