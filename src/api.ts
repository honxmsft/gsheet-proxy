import { FormsData, QuestionData, ResponseData } from "./type"

export async function sendCredential(name: string, email: string, grade: string) {
    const body = {
        name,
        email,
        grade,
    }
    const headers = new Headers()
    headers.append('content-type', 'application/json')
    await fetch('https://prod-10.westcentralus.logic.azure.com:443/workflows/2b46518333404b069ce403c5cb29a9eb/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=0SUYrqjM7z1keWnWcD-7MyUmkE1y2YN-hh33C69UAn8', {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
    })
}

export interface StudentReport {
    name: string
    email: string
    summary: string
    grade: string
    quiz: Array<{
        quizDate: string
        totalPoint: number
        score: number
        classAverageScore: number
        classMaxScore: number
        classMinScore: number
        quizName: string
    }>
}

export async function sendStudentReport(report: StudentReport) {
    const headers = new Headers()
    headers.append('content-type', 'application/json')
    await fetch('https://prod-20.westcentralus.logic.azure.com:443/workflows/c1788615cb964a3cb82518d0ba5536c1/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=FvapAcONPFvw6DjVPlpyuhjGProXlTg5NrDGCoHpnXM', {
        method: 'POST',
        headers,
        body: JSON.stringify(report)
    })
}

export async function sendEmailFromTable(tableName: string) {
    Excel.run(async (context) => {
        // Office.auth
        const table = context.workbook.tables.getItem(tableName)
        const columns = table.columns
        const nameColumn = columns.getItem('Name')
        const emailCol = columns.getItem('Email')
        nameColumn.load('index')
        emailCol.load('index')

        const rows = table.rows
        rows.load('items,items/values')
        await context.sync()

        console.log(rows.items[nameColumn.index].values)
        console.log(rows.items[emailCol.index].values)
    })
}

export async function getListFormsQuiz() {
    const response = await fetch('/formapi/api/forms')
    if (!response.ok) throw new Error('Fail to auth')
    const { value }: { value: FormsData[] } = await response.json()
    console.log(value)

    const allQuizs = value.filter(v => v.type === 'quiz')

    return allQuizs
}


export async function getFormsQuestionResponses(formId: string) {
    const [questionsRes, responsesRes] = await Promise.all([
        fetch(`/formapi/api/forms('${formId}')/questions`),
        fetch(`/formapi/api/forms('${formId}')/responses`),
    ])
    if (!questionsRes.ok || !responsesRes.ok) throw new Error('Fail to auth')

    const [question, response] = await Promise.all([
        questionsRes.json(),
        responsesRes.json(),
    ])
    return {
        questions: question.value as QuestionData[],
        responses: response.value as ResponseData[],
    }
}
