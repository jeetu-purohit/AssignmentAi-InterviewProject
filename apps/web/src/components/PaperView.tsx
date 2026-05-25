"use client";

import { useAssignmentStore } from '../store/useAssignmentStore';
import { Download } from 'lucide-react';

export function PaperView() {
  const store = useAssignmentStore();
  const paper = store.generatedPaper;

  if (!paper) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Top Dark Banner (Hidden during PDF export) */}
      <div className="bg-[#2A2A2A] text-white rounded-t-3xl p-6 px-8 print:hidden">
        <p className="text-[15px] font-medium leading-relaxed mb-6 w-3/4">
          Certainly! Here is your customized Question Paper based on your parameters.
          You can download it for distribution.
        </p>
        <button
          onClick={handlePrint}
          className="bg-white text-black px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 hover:bg-gray-100 transition-colors"
        >
          <Download className="w-4 h-4" /> Download as PDF
        </button>
      </div>

      {/* The Physical Paper Canvas */}
      <div className="bg-white rounded-b-3xl shadow-sm p-12 print:shadow-none print:p-0 print:text-black">

        {/* School Header */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Delhi Public School, Sector-4, Bokaro</h1>
          <p className="text-lg font-semibold text-gray-800">Subject: Assessment</p>
          <p className="text-lg font-semibold text-gray-800">Class: 5th</p>
        </div>

        {/* Exam Metadata */}
        <div className="flex justify-between text-sm font-semibold text-gray-800 mb-8">
          <p>Time Allowed: 45 minutes</p>
          <p>Maximum Marks: {store.totalMarks}</p>
        </div>

        <p className="text-sm font-semibold text-gray-800 mb-8 border-b border-gray-300 pb-6">
          All questions are compulsory unless stated otherwise.
        </p>

        {/* Student Fill-in Fields */}
        <div className="space-y-4 mb-12">
          <div className="flex items-end gap-2 max-w-sm">
            <span className="text-sm font-semibold">Name:</span>
            <div className="border-b border-gray-800 flex-1 h-4"></div>
          </div>
          <div className="flex items-end gap-2 max-w-sm">
            <span className="text-sm font-semibold">Roll Number:</span>
            <div className="border-b border-gray-800 flex-1 h-4"></div>
          </div>
          <div className="flex items-end gap-2 max-w-sm">
            <span className="text-sm font-semibold">Class: 5th</span>
            <span className="text-sm font-semibold ml-4">Section:</span>
            <div className="border-b border-gray-800 flex-1 h-4"></div>
          </div>
        </div>

        {/* Dynamic AI Questions Sections */}
        <div className="space-y-12">
          {paper.sections?.map((section: any, sIdx: number) => (
            <div key={sIdx}>
              <h3 className="text-lg font-bold text-center mb-4">{section.title}</h3>
              <p className="text-sm italic text-gray-700 mb-6 font-medium">
                {section.instructions}
              </p>

              <div className="space-y-6">
                {/* Notice the added '?.' after questions to prevent map() crashes */}
                {section.questions?.map((q: any, qIdx: number) => (
                  <div key={qIdx} className="flex gap-3 text-[15px] text-gray-900 leading-relaxed">
                    <span className="font-semibold">{qIdx + 1}.</span>
                    <p className="flex-1">
                      {/* Difficulty Badging */}
                      <span className={`font-bold mr-2 ${q.difficulty === 'Easy' ? 'text-green-600 print:text-black' :
                          q.difficulty === 'Moderate' ? 'text-amber-600 print:text-black' :
                            'text-red-600 print:text-black'
                        }`}>
                        [{q.difficulty}]
                      </span>
                      {q.text}
                      <span className="font-semibold ml-2">[{q.marks} Marks]</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}