
export interface FormsData {
    id: string;
    title: string;
    createdDate: string;
}

export interface QuestionData {
    id: string
    title: string
    type: string
    order: number
    /**
     * JSON info
     */
    questionInfo: string
    isQuiz: string
}

export interface ResponseData {
    id: string
    startDate: string
    submitDate: string
    responder: string
    responderName: string
    /**
     * JSON answers
     */
    answers: string
}

export interface ResolvedForms {
    id: string
    title: string
    createdDate: string
    /**
     * Max point a user can get
     */
    totalPoint: number
    averageScore: number
    maxScore: number
    minScore: number
    questions: Array<ResolvedQuestion>
    responses: Array<ResolvedResponse>
}

export interface ResolvedQuestion {
    id: string
    title: string
    order: number
    point: number
    correctAnswer: string
}

export interface ResolvedAnswer {
    questionId: string;
    answer1: string;
    score: number
    correct: boolean
}

export interface ResolvedResponse {
    id: string
    startDate: string
    submitDate: string
    responder: string
    responderName: string
    /**
     * student score for this quiz
     */
    score: number
    answers: Array<ResolvedAnswer>
}
