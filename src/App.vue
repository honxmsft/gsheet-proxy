<template>
    <div class="p-4">
        <div class="flex mb-4 justify-center items-center">
            <h2 class="text-xl font-bold leading-10">
                Manage Forms Quiz
            </h2>
            <div class="flex-grow">
            </div>
            <button class="p-1 hover:(bg-teal-400 text-white) transition-all duration-300" @click="refresh">
                {{ refreshing ? 'Refreshing...' : 'Refreshed!' }}
            </button>
        </div>
        <div class="flex flex-col  bg-white">
            <div v-for="q of quiz" :key="q.id"
                class="flex hover:(bg-[rgba(0,0,0,0.04)]) transition-all duration-300 cursor-pointer">
                <div class="p-2">
                    {{ q.title }}
                    -
                    {{ new Date(q.createdDate).toLocaleDateString() }}
                </div>
                <div class="flex-grow"></div>
                <button class="p-2 text-teal-400 font-semibold hover:(bg-teal-100) transition-all duration-300 "
                    @click="generateV2(q)">Import</button>
            </div>

            <button class="p-2 text-teal-400 font-semibold hover:(bg-teal-100) transition-all duration-300 "
                @click="generateAll()">Import All</button>
        </div>

        <div class="flex mb-4 justify-center items-center">
            <h2 class="text-xl font-bold leading-10">
                Summarize Data
            </h2>
            <div class="flex-grow">

            </div>
        </div>

        <div class="flex flex-col  bg-white">
            <button class="p-2 text-teal-400 font-semibold hover:(bg-teal-100) transition-all duration-300 "
                @click="analyzeByQuiz()">Analyze Quiz</button>
            <button class="p-2 text-teal-400 font-semibold hover:(bg-teal-100) transition-all duration-300 "
                @click="analyzeByUser()">Analyze Student Score</button>
        </div>



        <div class="flex mb-4 justify-center items-center">
            <h2 class="text-xl font-bold leading-10">
                Reports
            </h2>
            <div class="flex-grow">

            </div>
        </div>


        <div class="flex flex-col  bg-white">
            <button class="p-2 text-teal-400 font-semibold hover:(bg-teal-100) transition-all duration-300 "
                @click="getAndSendStudentReport()">Send Report to All Students</button>
            <button class="p-2 text-teal-400 font-semibold hover:(bg-teal-100) transition-all duration-300 "
                @click="getAndSendStudentReport()">Send Credential to Stendents with A level</button>
        </div>


        <div v-if="error" class="p-3 text-red-500">
            {{ error }}
            <div v-if="'debugInfo' in error">
                <div class="font-bold leading-10">
                    {{error.debugInfo.errorLocation}}
                </div>
                <div class="pl-3">
                    <div v-for="s of error.debugInfo.surroundingStatements" :key="s">
                        {{s}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { report } from 'process';
import { onErrorCaptured, onMounted, ref } from 'vue';
import { getListFormsQuiz, sendStudentReport, StudentReport } from './api';
import { useLocalStorage } from './composables/localStorage';
import { useRefreshable } from './composables/refreshable';
import { resolveForms } from './responseResolver';
import { ResolvedForms, ResolvedQuestion } from './type';
import { ensureTable, ensureWorksheet, normalizeWorksheetName } from './utils'

const error = ref(undefined as undefined | Error)
const quiz = useLocalStorage<ResolvedForms[]>('quiz', () => [] as ResolvedForms[], JSON.stringify, JSON.parse)

const { refresh, refreshing } = useRefreshable(async () => {
    const forms = await getListFormsQuiz()
    quiz.value = await Promise.all(forms.map(resolveForms))
})

onMounted(refresh)

async function generateAll() {
    resetError()
    await Promise.all(quiz.value.map(generate))
}

async function generate(resolved: ResolvedForms) {
    resetError()
    const headerRow = ['Id', 'ResponderName', 'ResponderEmail', 'StartDate', 'SubmitDate', 'TotalScore', 'Score']
    const rows = [headerRow] as string[][]
    const mapping: Record<string, ResolvedQuestion> = {}
    for (const q of resolved.questions) {
        mapping[q.id] = q
        headerRow.push(q.title)
        headerRow.push(`Correct - ${q.title}`)
        headerRow.push(`Correct Answer - ${q.title}`)
    }

    for (const r of resolved.responses) {
        const questions = [] as string[]
        for (const ans of r.answers) {
            const q = mapping[ans.questionId]

            const userAnswer = ans.answer1
            const correct = ans.correct
            const correctAnswer = q.correctAnswer

            questions.push(userAnswer, correct + '', correctAnswer)
        }
        rows.push([r.id, r.responder, r.responderName, r.startDate, r.submitDate, resolved.totalPoint.toString(), r.score.toString(), ...questions])
    }
    const name = normalizeWorksheetName(`${resolved.title}-${resolved.id}`)

    await Excel.run(async (context) => {
        const worksheet = await ensureWorksheet(context, name)
        const start = worksheet.getRange('A1')
        const table = await ensureTable(worksheet.tables, start, rows, resolved.id)
        await context.sync()
    }).catch(handleError)
}


async function generateV2(resolved: ResolvedForms) {
    resetError()

    const mapping: Record<string, ResolvedQuestion> = {}
    for (const q of resolved.questions) {
        mapping[q.id] = q
    }
    const name = normalizeWorksheetName(`${resolved.title}-${resolved.id}`)

    const summarizedTableRows = [
        ['Id', 'ResponderName', 'ResponderEmail', 'StartDate', 'SubmitDate', 'TotalScore', 'Score'],
        ...resolved.responses.map(r => [r.id, r.responder, r.responderName, r.startDate, r.submitDate, resolved.totalPoint.toString(), r.score.toString()])
    ] as string[][]

    await Excel.run(async (context) => {
        const worksheet = await ensureWorksheet(context, name)
        const start = worksheet.getRange('A1')
        const summerizedTable = await ensureTable(worksheet.tables, start, summarizedTableRows, resolved.id)

        let rows: (string | number)[][] = []

        for (const r of resolved.responses) {
            for (const a of r.answers) {
                const row = [] as (string | number)[]
                const q = mapping[a.questionId]
                row.push(q.order, q.title, q.correctAnswer, r.responderName, a.answer1, a.correct + '', q.point, a.score)
                rows.push(row)
            }
        }

        rows.sort((a, b) => (a[0] as number) - (b[0] as number))
        rows = rows.map(r => r.slice(1))

        console.log(rows)

        await ensureTable(worksheet.tables, summerizedTable.getRange().getLastColumn().getOffsetRange(0, 2), [
            ['Question', 'CorrectAnswer', 'Responder', 'Response', 'Correct', 'Score', 'GotScore'],
            ...rows
        ], `Question_${resolved.id}`)

        await context.sync()
    }).catch(handleError)
}


async function getAndSendStudentReport() {
    resetError()
    const reports = generateStudentReport()
    await Excel.run(async (context) => {
        const summary = context.workbook.tables.getItem('StudentSummary')
        summary.load('rows/items,rows/items/length,rows/items/values')
        await context.sync()
        for (const r of summary.rows.items) {
            const summary = r.values[0][2]
            const student = reports.find(student => r.values[0][0] === student.name && r.values[0][1] === student.email)
            if (student) {
                student.summary = summary ?? ''
            }
        }
    }).catch(handleError)
    await Promise.all(reports
        // .filter(r => r.name === 'Hongze Xu' || r.email === 'gingjia@microsoft.com')
        .map(sendStudentReport))
}

window.onrejectionhandled = (e) => {
    handleError(e.reason)
}

function generateStudentReport() {
    const summarized: Record<string, StudentReport> = {}
    for (const q of quiz.value) {
        for (const r of q.responses) {
            if (!summarized[r.responder]) {
                summarized[r.responder] = {
                    name: r.responderName,
                    email: r.responder,
                    summary: '',
                    quiz: [],
                }
            }
            summarized[r.responder].quiz.push({
                quizName: q.title,
                quizDate: q.createdDate,
                score: r.score,
                classAverageScore: q.averageScore,
                classMaxScore: q.maxScore,
                classMinScore: q.minScore,
            })
        }
    }
    const allReports = Object.values(summarized)

    return allReports
    // await Promise.all(allReports.map(r => sendStudentReport(r)))
}

onErrorCaptured((e) => {
    handleError(e)
})

async function analyzeByUser() {
    resetError()
    await Excel.run(async (context) => {
        const worksheet = await ensureWorksheet(context, 'StudentsSummary')
        const header = ['Name', 'Email', 'Summary']
        const rows = [header] as string[][]
        const reports = generateStudentReport()
        for (const q of reports[0].quiz) {
            header.push(q.quizName)
        }
        for (const r of reports) {
            const row = [r.name, r.email, r.summary]
            for (const q of r.quiz) {
                row.push(q.score.toString())
            }
            rows.push(row)
        }

        const table = await ensureTable(worksheet.tables, worksheet.getRange("A1"), rows, 'StudentSummary')
        await context.sync()
    }).catch(handleError)
}

async function analyzeByQuiz() {
    resetError()
    await Excel.run(async (context) => {
        const worksheet = await ensureWorksheet(context, 'QuizSummary')
        const header = ['Name', 'Date', 'TotalScore', 'AverageScore', 'HighestScore', 'LowestScore']
        const rows = [header] as (string | number)[][]
        for (const q of quiz.value) {
            rows.push([q.title, q.createdDate, q.totalPoint, q.averageScore, q.maxScore, q.minScore])
        }

        const start = worksheet.getRange('A1')
        const table = await ensureTable(worksheet.tables, start, rows, 'QuizSummary')
        await context.sync()

    }).catch(handleError)
}

function resetError() {
    error.value = undefined
}

function handleError(e: any) {
    console.error(e)
    error.value = e
}

</script>
