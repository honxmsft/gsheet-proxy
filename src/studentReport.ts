import { StudentReport } from "./api"
import { ResolvedForms } from "./type"

export function calculateStudentReport(quiz: ResolvedForms[]): StudentReport[] {
    const summarized: Record<string, StudentReport> = {}
    for (const q of quiz) {
        for (const r of q.responses) {
            if (!summarized[r.responder]) {
                summarized[r.responder] = {
                    name: r.responderName,
                    email: r.responder,
                    summary: '',
                    quiz: [],
                    grade: '',
                }
            }
            summarized[r.responder].quiz.push({
                quizName: q.title,
                quizDate: q.createdDate,
                score: r.score,
                totalPoint: q.totalPoint,
                classAverageScore: q.averageScore,
                classMaxScore: q.maxScore,
                classMinScore: q.minScore,
                quizId: q.id,
            })
        }
    }
    const allReports = Object.values(summarized)
    for (const r of allReports) {
        const total = r.quiz.reduce((a, b) => a + b.totalPoint, 0)
        const score = r.quiz.reduce((a, b) => a + b.score, 0)
        const percentage = score / total
        let grade = ''
        if (percentage >= 0.9) {
            grade = 'A'
        } else if (percentage >= 0.8) {
            grade = 'B'
        } else if (percentage >= 0.7) {
            grade = 'C'
        } else if (percentage >= 0.6) {
            grade = 'D'
        } else {
            grade = 'F'
        }
        r.grade = grade

        switch (grade) {
            case "A":
                r.summary = "Great job, keep it!";
                break;
            case "B":
                r.summary = "Good job, can be better!";
                break;
            case "C":
                r.summary = "Have big improve space!";
                break;
            case "D":
                r.summary = "You need to put more effort on it!";
                break;
            case "F":
                r.summary = "Let's have a talk if needed.";
                break;
            default:
                break;
        }
    }
    return allReports
}