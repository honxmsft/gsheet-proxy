import { getFormsQuestionResponses } from "./api";
import { FormsData, ResolvedAnswer, ResolvedForms, ResolvedQuestion, ResolvedResponse } from "./type";

export async function resolveForms(f: FormsData) {
    const { responses, questions } = await getFormsQuestionResponses(f.id)
    questions.sort((a, b) => a.order - b.order)
    const resolvedQuestions = questions.map((q) => {
        const info = JSON.parse(q.questionInfo)
        const point = info.Point ?? 0
        const grading = info.GradingBasis ? JSON.parse(info.GradingBasis) : []
        const correctChoice = info.Choices?.find((c: any) => c.IsAnswerKey)?.Description
        const expectAnswer = grading[0]?.answer ?? correctChoice ?? ''
        const resolved: ResolvedQuestion = {
            id: q.id,
            title: q.title,
            order: q.order,
            point: Number.parseInt(point),
            correctAnswer: expectAnswer,
        }
        return resolved
    })
    const totalScore = resolvedQuestions.reduce((a, b) => a + b.point, 0)

    const mapping: Record<string, ResolvedQuestion> = {}
    for (const q of resolvedQuestions) {
        mapping[q.id] = q
    }
    const resolvedRes = responses.map((r) => {
        const answ = JSON.parse(r.answers) as any[]
        const answers = answ.map((a: any) => {
            const q = mapping[a.questionId]
            const answer1 = a.answer1
            const correct = q.correctAnswer === answer1
            const result: ResolvedAnswer = {
                questionId: a.questionId,
                answer1,
                correct,
                score: correct ? q.point : 0,
            }
            return result
        })
        const result: ResolvedResponse = {
            id: r.id,
            startDate: r.startDate,
            submitDate: r.submitDate,
            responder: r.responder,
            responderName: r.responderName,
            score: answers.reduce((a, b) => a + b.score, 0),
            answers,
        }
        return result
    })

    const result: ResolvedForms = {
        title: f.title,
        id: f.id,
        createdDate: f.createdDate,
        questions: resolvedQuestions,
        totalPoint: totalScore,
        maxScore: resolvedRes.reduce((v, c) => v > c.score ? v : c.score, 0),
        minScore: resolvedRes.reduce((v, c) => v < c.score ? v : c.score, 0),
        averageScore: resolvedRes.reduce((v, c) => v + c.score, 0) / resolvedRes.length,
        responses: resolvedRes
    }

    return result
}
