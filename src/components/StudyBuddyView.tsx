import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  BookOpen, 
  HelpCircle, 
  Lightbulb, 
  Check, 
  X, 
  RotateCw, 
  Award, 
  BrainCircuit, 
  FileText, 
  Layers, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { Flashcard, QuizQuestion } from '../types';

const SAMPLE_NOTES = {
  deepLearning: `Deep Learning architectures rely on gradient-based backpropagation through multi-layered artificial neural networks. Convolutional Neural Networks (CNNs) utilize spatial parameter sharing through kernel convolution filters and pooling layers (such as max pooling) to maintain translational invariance. During backpropagation, the chain rule computes partial derivatives of the loss function with respect to weight matrices. Vanishing gradients in deep networks are mitigated via Rectified Linear Units (ReLU) and Residual connections (skip connections) pioneered by ResNet architectures. Batch normalization further stabilizes internal covariate shift across training epochs.`,
  compilerDesign: `A compiler transforms high-level source code into low-level machine instructions across multiple sequential phases: Lexical Analysis, Syntax Analysis, Semantic Analysis, Intermediate Code Generation, Optimization, and Target Code Generation. The Syntax Analyzer constructs a Parse Tree according to Context-Free Grammars (CFGs). LR(1) and LALR parsers operate bottom-up, performing shift-reduce actions using deterministic finite automata with lookahead tokens. Ambiguous grammars can lead to shift-reduce or reduce-reduce conflicts which must be resolved using operator precedence or grammar restructuring.`,
  distributedSystems: `Distributed systems require consensus algorithms to maintain a replicated state machine across independent nodes facing network partitions and node crashes. The CAP theorem states that a distributed data store can guarantee at most two of: Consistency, Availability, and Partition Tolerance. The Raft consensus algorithm achieves leader-based consensus through three subproblems: Leader Election with randomized election timeouts, Log Replication via AppendEntries RPCs, and Safety invariant verification. In Byzantine fault tolerance (BFT), consensus is maintained even when nodes act maliciously or forge messages.`,
};

export const StudyBuddyView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'summarizer' | 'quiz' | 'explainer'>('summarizer');

  // Summarizer State
  const [notesInput, setNotesInput] = useState(SAMPLE_NOTES.deepLearning);
  const [notesTopic, setNotesTopic] = useState('Deep Learning & Neural Networks');
  const [summaryResult, setSummaryResult] = useState<string | null>(null);
  const [keyConcepts, setKeyConcepts] = useState<string[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [summarizing, setSummarizing] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Quiz State
  const [quizTopic, setQuizTopic] = useState('Operating System Deadlocks & Semaphores');
  const [quizDifficulty, setQuizDifficulty] = useState('Medium');
  const [quizCount, setQuizCount] = useState(4);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);

  // Explainer State
  const [explainTopic, setExplainTopic] = useState('Eigenvalues & PCA Dimensionality Reduction');
  const [explainResult, setExplainResult] = useState<{
    concept: string;
    explanation: string;
    analogy: string;
    keyTakeaway: string;
  } | null>(null);
  const [explaining, setExplaining] = useState(false);

  // Handler: Summarize
  const handleSummarize = async () => {
    if (!notesInput.trim() || summarizing) return;
    setSummarizing(true);
    setSummaryResult(null);

    try {
      const res = await fetch('/api/study/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: notesInput, topic: notesTopic }),
      });

      if (!res.ok) throw new Error('Failed to summarize');
      const data = await res.json();
      setSummaryResult(data.summary);
      setKeyConcepts(data.keyConcepts || []);
      setFlashcards(data.flashcards || []);
      setActiveCardIndex(0);
      setIsFlipped(false);
    } catch (err: any) {
      console.error(err);
      setSummaryResult('Failed to contact Gemini summarizer. Please verify your connection.');
    } finally {
      setSummarizing(false);
    }
  };

  // Handler: Generate Quiz
  const handleGenerateQuiz = async () => {
    if (!quizTopic.trim() || generatingQuiz) return;
    setGeneratingQuiz(true);
    setQuizFinished(false);
    setSelectedAnswers({});
    setCurrentQIndex(0);

    try {
      const res = await fetch('/api/study/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: quizTopic,
          difficulty: quizDifficulty,
          count: quizCount,
        }),
      });

      if (!res.ok) throw new Error('Failed to generate quiz');
      const data = await res.json();
      if (Array.isArray(data.quiz) && data.quiz.length > 0) {
        setQuizQuestions(data.quiz);
      } else {
        throw new Error('No questions returned');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingQuiz(false);
    }
  };

  // Answer Quiz question
  const handleAnswerSelect = (optionIdx: number) => {
    if (selectedAnswers[currentQIndex] !== undefined) return; // already answered

    const updated = { ...selectedAnswers, [currentQIndex]: optionIdx };
    setSelectedAnswers(updated);

    // If last question
    if (currentQIndex === quizQuestions.length - 1) {
      setTimeout(() => {
        setQuizFinished(true);
        // Calculate score
        let correctCount = 0;
        quizQuestions.forEach((q, idx) => {
          if (updated[idx] === q.answerIndex) correctCount++;
        });
        if (correctCount >= quizQuestions.length * 0.7) {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      }, 800);
    }
  };

  // Handler: Explain Concept
  const handleExplain = async () => {
    if (!explainTopic.trim() || explaining) return;
    setExplaining(true);
    setExplainResult(null);

    try {
      const res = await fetch('/api/study/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: explainTopic }),
      });

      if (!res.ok) throw new Error('Failed to explain');
      const data = await res.json();
      setExplainResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setExplaining(false);
    }
  };

  const calculateScore = () => {
    let score = 0;
    quizQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answerIndex) score++;
    });
    return score;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-400/30">
              <Sparkles className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold tracking-tight">AI Study Buddy & Academic Coach</h2>
          </div>
          <p className="text-xs sm:text-sm text-purple-200 mt-1 max-w-2xl">
            Supercharge your exam revision: summarize lengthy lecture slides, test retention with auto-generated multiple choice quizzes, and master tough formulas with intuitive analogies.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center p-1 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
          <button
            onClick={() => setActiveTab('summarizer')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'summarizer' ? 'bg-white text-purple-950 shadow-sm' : 'text-purple-200 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Summarizer & Cards</span>
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'quiz' ? 'bg-white text-purple-950 shadow-sm' : 'text-purple-200 hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Smart Quiz</span>
          </button>
          <button
            onClick={() => setActiveTab('explainer')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'explainer' ? 'bg-white text-purple-950 shadow-sm' : 'text-purple-200 hover:text-white'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>ELI5 Explainer</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Summarizer & Flashcards */}
      {activeTab === 'summarizer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Notes Input Area (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600" />
                Lecture Notes or Syllabus Snippet
              </h3>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Topic / Course Name</label>
              <input
                type="text"
                value={notesTopic}
                onChange={(e) => setNotesTopic(e.target.value)}
                className="w-full text-xs px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-purple-500"
              />
            </div>

            {/* Pre-fill Sample Chips */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Load Sample Lecture Notes:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => {
                    setNotesTopic('Deep Learning & Neural Networks');
                    setNotesInput(SAMPLE_NOTES.deepLearning);
                  }}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 font-semibold"
                >
                  Neural Networks
                </button>
                <button
                  onClick={() => {
                    setNotesTopic('Compiler Design & Parsing');
                    setNotesInput(SAMPLE_NOTES.compilerDesign);
                  }}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 font-semibold"
                >
                  Compiler Parsing
                </button>
                <button
                  onClick={() => {
                    setNotesTopic('Distributed Systems & Raft Consensus');
                    setNotesInput(SAMPLE_NOTES.distributedSystems);
                  }}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-semibold"
                >
                  Distributed Raft
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Notes Content</label>
              <textarea
                rows={8}
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                placeholder="Paste your lecture notes, textbook excerpts, or syllabus points here..."
                className="w-full text-xs p-3.5 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-purple-500 font-mono"
              />
            </div>

            <button
              onClick={handleSummarize}
              disabled={summarizing || !notesInput.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-purple-600/25 transition-all disabled:opacity-50"
            >
              {summarizing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Synthesizing with Gemini 3.8 Flash...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Summary & Flashcards</span>
                </>
              )}
            </button>
          </div>

          {/* Results Area (7 Cols) */}
          <div className="lg:col-span-7 space-y-5">
            {summaryResult ? (
              <div className="space-y-5 animate-in fade-in">
                {/* Key Concepts Pills */}
                {keyConcepts.length > 0 && (
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                      <BrainCircuit className="w-3.5 h-3.5 text-purple-600" />
                      Core Conceptual Invariants
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {keyConcepts.map((c, i) => (
                        <span key={i} className="text-xs font-bold px-3 py-1 rounded-lg bg-purple-50 text-purple-800 border border-purple-200/60">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Structured Summary Card */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    Structured Knowledge Summary
                  </h4>
                  <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {summaryResult}
                  </div>
                </div>

                {/* Interactive Flashcard Card */}
                {flashcards.length > 0 && (
                  <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Layers className="w-4 h-4 text-purple-600" />
                        Interactive Revision Flashcards ({activeCardIndex + 1} / {flashcards.length})
                      </h4>
                      <span className="text-xs text-slate-400 font-medium">Click card to flip</span>
                    </div>

                    {/* 3D Flip Card Container */}
                    <div
                      onClick={() => setIsFlipped(!isFlipped)}
                      className="cursor-pointer min-h-[170px] p-6 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center text-center shadow-xs select-none bg-gradient-to-br from-indigo-50/60 to-purple-50/60 border-purple-200 hover:border-purple-300"
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white text-purple-700 border border-purple-200 mb-2">
                        {isFlipped ? 'Answer / Concept' : 'Flashcard Question'}
                      </span>
                      <p className="text-sm sm:text-base font-extrabold text-slate-900 max-w-md leading-snug">
                        {isFlipped ? flashcards[activeCardIndex].back : flashcards[activeCardIndex].front}
                      </p>
                      <p className="text-[11px] text-purple-600 font-semibold mt-3">
                        {isFlipped ? 'Tap to flip back' : 'Tap to reveal answer'}
                      </p>
                    </div>

                    {/* Navigation between cards */}
                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={() => {
                          setActiveCardIndex((prev) => (prev > 0 ? prev - 1 : flashcards.length - 1));
                          setIsFlipped(false);
                        }}
                        className="px-3.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                      >
                        Previous Card
                      </button>

                      <div className="flex gap-1">
                        {flashcards.map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full transition-all ${
                              i === activeCardIndex ? 'w-6 bg-purple-600' : 'bg-slate-200'
                            }`}
                          />
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          setActiveCardIndex((prev) => (prev < flashcards.length - 1 ? prev + 1 : 0));
                          setIsFlipped(false);
                        }}
                        className="px-3.5 py-1.5 text-xs font-bold text-purple-700 hover:bg-purple-50 rounded-xl"
                      >
                        Next Card
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="text-sm font-bold text-slate-800">Your AI Study Digest will appear here</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Paste notes or choose one of the pre-loaded academic samples on the left and click Generate.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Smart Quiz */}
      {activeTab === 'quiz' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
          {/* Quiz Configuration Bar */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-6">
              <label className="block text-xs font-bold text-slate-700 mb-1">Quiz Topic / Course</label>
              <input
                type="text"
                value={quizTopic}
                onChange={(e) => setQuizTopic(e.target.value)}
                placeholder="e.g. Computer Networks TCP/IP, SQL B-Trees, Graph Algorithms"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 outline-none focus:border-purple-500 font-semibold text-slate-900"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-slate-700 mb-1">Difficulty</label>
              <select
                value={quizDifficulty}
                onChange={(e) => setQuizDifficulty(e.target.value)}
                className="w-full text-xs px-3 py-2.5 rounded-xl bg-white border border-slate-200 outline-none focus:border-purple-500 font-semibold"
              >
                <option value="Easy">Easy (Basics & Definitions)</option>
                <option value="Medium">Medium (Application & Logic)</option>
                <option value="Hard">Hard (Edge Cases & Proofs)</option>
              </select>
            </div>

            <div className="sm:col-span-3">
              <button
                onClick={handleGenerateQuiz}
                disabled={generatingQuiz || !quizTopic.trim()}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/20 transition-all disabled:opacity-50"
              >
                {generatingQuiz ? (
                  <>
                    <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Generate Quiz</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Active Quiz Area */}
          {quizQuestions.length > 0 ? (
            <div className="space-y-6">
              {/* Progress & Score Bar */}
              <div className="flex items-center justify-between text-xs font-bold text-slate-600 pb-2 border-b border-slate-100">
                <span>Question {currentQIndex + 1} of {quizQuestions.length}</span>
                <span className="text-purple-700">Topic: {quizTopic}</span>
                <span>Answered: {Object.keys(selectedAnswers).length}/{quizQuestions.length}</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-purple-600 h-1.5 transition-all duration-300"
                  style={{ width: `${((currentQIndex + 1) / quizQuestions.length) * 100}%` }}
                />
              </div>

              {!quizFinished ? (
                /* Single Question Runner */
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100">
                    <p className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                      {quizQuestions[currentQIndex].question}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {quizQuestions[currentQIndex].options.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[currentQIndex] === optIdx;
                      const hasAnswered = selectedAnswers[currentQIndex] !== undefined;
                      const isCorrect = optIdx === quizQuestions[currentQIndex].answerIndex;

                      let btnStyle = 'bg-white border-slate-200 text-slate-800 hover:border-purple-300 hover:bg-purple-50/30';
                      if (hasAnswered) {
                        if (isCorrect) {
                          btnStyle = 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold';
                        } else if (isSelected) {
                          btnStyle = 'bg-rose-50 border-rose-300 text-rose-950 font-bold';
                        } else {
                          btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={hasAnswered}
                          onClick={() => handleAnswerSelect(optIdx)}
                          className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between gap-3 ${btnStyle}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt}</span>
                          </div>

                          {hasAnswered && isCorrect && (
                            <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                          )}
                          {hasAnswered && isSelected && !isCorrect && (
                            <X className="w-5 h-5 text-rose-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation Card if answered */}
                  {selectedAnswers[currentQIndex] !== undefined && (
                    <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 space-y-1 animate-in fade-in">
                      <h5 className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-purple-700" />
                        Explanation:
                      </h5>
                      <p className="text-xs text-purple-950 leading-relaxed">
                        {quizQuestions[currentQIndex].explanation}
                      </p>
                    </div>
                  )}

                  {/* Nav buttons */}
                  <div className="flex items-center justify-between pt-4">
                    <button
                      onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
                      disabled={currentQIndex === 0}
                      className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl disabled:opacity-40"
                    >
                      Previous
                    </button>

                    {currentQIndex < quizQuestions.length - 1 ? (
                      <button
                        onClick={() => setCurrentQIndex((prev) => Math.min(quizQuestions.length - 1, prev + 1))}
                        className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs"
                      >
                        Next Question
                      </button>
                    ) : (
                      <button
                        onClick={() => setQuizFinished(true)}
                        className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md"
                      >
                        Complete Quiz & View Score
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* Quiz Complete Score Card */
                <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-purple-200 text-center space-y-4 animate-in zoom-in-95">
                  <div className="w-16 h-16 rounded-full bg-purple-600 text-white flex items-center justify-center mx-auto shadow-md">
                    <Award className="w-8 h-8" />
                  </div>

                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900">Quiz Completed!</h3>
                    <p className="text-xs text-slate-600 mt-1">
                      You scored <strong className="text-purple-700 text-base">{calculateScore()}</strong> out of {quizQuestions.length} correct.
                    </p>
                  </div>

                  <div className="flex justify-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        setSelectedAnswers({});
                        setCurrentQIndex(0);
                        setQuizFinished(false);
                      }}
                      className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50"
                    >
                      Retry Same Quiz
                    </button>
                    <button
                      onClick={handleGenerateQuiz}
                      className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs"
                    >
                      Generate New Topic
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400">
              <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-600">Enter any topic above and click Generate Quiz</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: ELI5 Explainer */}
      {activeTab === 'explainer' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6">
          <div className="max-w-2xl">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              ELI5 Concept Explainer & Exam Rule
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Struggling with an abstract mathematical proof or technical architecture? Let Gemini explain it like you are a college freshman.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={explainTopic}
              onChange={(e) => setExplainTopic(e.target.value)}
              placeholder="e.g. Fourier Transform, Paxos, B-Tree splitting, Kalman Filters"
              className="flex-1 text-xs px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-purple-500 font-semibold"
            />
            <button
              onClick={handleExplain}
              disabled={explaining || !explainTopic.trim()}
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
            >
              {explaining ? (
                <>
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Explaining...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Explain Concept</span>
                </>
              )}
            </button>
          </div>

          {explainResult && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">The Intuitive Concept</span>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                  {explainResult.explanation}
                </p>
              </div>

              {explainResult.analogy && (
                <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                    <Lightbulb className="w-3.5 h-3.5" /> Real-World Analogy
                  </span>
                  <p className="text-xs sm:text-sm text-amber-950 leading-relaxed font-medium">
                    "{explainResult.analogy}"
                  </p>
                </div>
              )}

              {explainResult.keyTakeaway && (
                <div className="p-4 rounded-xl bg-purple-900 text-white space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-300">
                    Golden Exam Rule to Remember:
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-purple-100">
                    {explainResult.keyTakeaway}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
