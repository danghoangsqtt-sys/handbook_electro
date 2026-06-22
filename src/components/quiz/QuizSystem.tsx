'use client';
import { useState } from 'react';

interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswerIndex: number;
    explanation: string;
}

export default function QuizSystem() {
    const [questions, setQuestions] = useState<QuizQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [showExplanation, setShowExplanation] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [loading, setLoading] = useState(false);

    const [category, setCategory] = useState('all');
    const [limit, setLimit] = useState(5);

    const loadQuiz = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/terms/quiz?category=${category}&limit=${limit}`);
            const data = await res.json();
            if (data && data.length > 0) {
                setQuestions(data);
                setCurrentQuestionIndex(0);
                setScore(0);
                setIsFinished(false);
                setSelectedOption(null);
                setShowExplanation(false);
            }
        } catch (e) {
            console.error('Lỗi tải câu hỏi quiz', e);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectOption = (index: number) => {
        if (showExplanation) return;
        setSelectedOption(index);
        setShowExplanation(true);
        if (index === questions[currentQuestionIndex].correctAnswerIndex) {
            setScore(s => s + 1);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(c => c + 1);
            setSelectedOption(null);
            setShowExplanation(false);
        } else {
            setIsFinished(true);
        }
    };

    if (questions.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center h-[800px] text-center">
                <div className="w-16 h-16 bg-amber-50 dark:bg-amber-950/40 text-amber-500 rounded-2xl flex items-center justify-center mb-4">
                    <i className="fa-solid fa-gamepad text-2xl"></i>
                </div>
                <h2 className="text-xl font-bold mb-2">Trắc nghiệm Kiến thức</h2>
                <p className="text-sm text-slate-500 mb-6 max-w-sm">Kiểm tra kiến thức của bạn với ngân hàng 3000 thuật ngữ chuyên ngành.</p>
                
                <div className="flex gap-4 w-full max-w-sm mb-4">
                    <select className="flex-1 p-2 border rounded-xl bg-slate-50 dark:bg-slate-800 text-sm" value={category} onChange={e => setCategory(e.target.value)}>
                        <option value="all">Tất cả lĩnh vực</option>
                        <option value="Tự động hóa">Tự động hóa</option>
                        <option value="Cơ điện tử">Cơ điện tử</option>
                        <option value="Khoa học máy tính">Khoa học máy tính</option>
                        <option value="Kỹ thuật vi xử lý">Vi xử lý</option>
                        <option value="Điện tử số">Điện tử số</option>
                        <option value="Module & MCU">Module & MCU</option>
                    </select>
                    <select className="w-24 p-2 border rounded-xl bg-slate-50 dark:bg-slate-800 text-sm" value={limit} onChange={e => setLimit(Number(e.target.value))}>
                        <option value="5">5 câu</option>
                        <option value="10">10 câu</option>
                        <option value="20">20 câu</option>
                    </select>
                </div>

                <button onClick={loadQuiz} className="bg-amber-500 text-white font-bold py-3 px-8 rounded-xl shadow-md hover:bg-amber-600 transition-all flex items-center gap-2">
                    {loading ? <i className="fa-solid fa-spinner animate-spin"></i> : <i className="fa-solid fa-play"></i>} Bắt đầu Thi
                </button>
            </div>
        );
    }

    if (isFinished) {
        const percentage = Math.round((score / questions.length) * 100);
        return (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center h-[800px] text-center">
                <div className="w-24 h-24 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 rounded-full flex items-center justify-center mb-6 text-4xl font-black shadow-inner">
                    {percentage}%
                </div>
                <h2 className="text-2xl font-bold mb-2">Hoàn thành bài thi!</h2>
                <p className="text-slate-500 mb-6">Bạn đã trả lời đúng {score} trên tổng số {questions.length} câu hỏi.</p>
                <button onClick={() => setQuestions([])} className="bg-blue-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-blue-700 transition-all">Thi lại</button>
            </div>
        );
    }

    const currentQ = questions[currentQuestionIndex];

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm h-[800px] flex flex-col">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h3 className="font-bold text-slate-700 dark:text-slate-200">Câu hỏi {currentQuestionIndex + 1}/{questions.length}</h3>
                <span className="text-sm font-bold bg-amber-100 text-amber-700 px-3 py-1 rounded-full">Điểm: {score}</span>
            </div>

            <p className="text-lg font-medium leading-relaxed mb-8">{currentQ.question}</p>

            <div className="flex flex-col gap-3 flex-1">
                {currentQ.options.map((opt, idx) => {
                    let btnClass = "text-left p-4 rounded-xl border-2 transition-all font-medium text-sm ";
                    if (!showExplanation) {
                        btnClass += "border-slate-100 hover:border-blue-500 hover:bg-blue-50 dark:border-slate-800 dark:hover:bg-blue-900/20";
                    } else {
                        if (idx === currentQ.correctAnswerIndex) {
                            btnClass += "border-emerald-500 bg-emerald-50 text-emerald-700";
                        } else if (idx === selectedOption) {
                            btnClass += "border-red-500 bg-red-50 text-red-700";
                        } else {
                            btnClass += "border-slate-100 dark:border-slate-800 opacity-50";
                        }
                    }

                    return (
                        <button key={idx} disabled={showExplanation} className={btnClass} onClick={() => handleSelectOption(idx)}>
                            {String.fromCharCode(65 + idx)}. {opt}
                        </button>
                    );
                })}
            </div>

            {showExplanation && (
                <div className="mt-6">
                    <div className={`p-4 rounded-xl text-sm leading-relaxed mb-4 ${selectedOption === currentQ.correctAnswerIndex ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}`}>
                        {currentQ.explanation}
                    </div>
                    <button onClick={handleNext} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg">
                        {currentQuestionIndex < questions.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả'} <i className="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            )}
        </div>
    );
}
