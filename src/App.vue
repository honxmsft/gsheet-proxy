<template>
    <div class="p-4">
        <div class="flex mb-4 justify-center items-center">
            <h2 class="text-xl font-bold leading-10">
                Import Forms Quiz
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
                Analyze Forms Quiz
            </h2>
            <div class="flex-grow">

            </div>
        </div>

        <div class="flex flex-col  bg-white">
            <button class="p-2 text-teal-400 font-semibold hover:(bg-teal-100) transition-all duration-300 "
                @click="analyzeByQuiz()">By Quiz</button>
            <button class="p-2 text-teal-400 font-semibold hover:(bg-teal-100) transition-all duration-300 "
                @click="analyzeByUser()">By Students</button>
        </div>



        <div class="flex mb-4 justify-center items-center">
            <h2 class="text-xl font-bold leading-10">
                Share Quiz Result
            </h2>
            <div class="flex-grow">

            </div>
        </div>


        <div class="flex flex-col  bg-white">
            <button
                class="p-2 text-teal-400 font-semibold hover:(bg-teal-100) transition-all duration-300 flex items-center justify-center"
                @click="getAndSendStudentReport()">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-green"
                    :class="{'hidden': !gettingAndSendStudentReport}" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                </svg>
                <template v-if="sentReport">
                    ✔️
                </template>
                Send report to each student
            </button>
            <button class="p-2 text-teal-400 font-semibold hover:(bg-teal-100) transition-all duration-300 flex items-center justify-center"
                @click="getAndSendStudentGrading()">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-green"
                    :class="{'hidden': !gettingAndSendStudentGrading}" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                </svg>
                <template v-if="sentCertificate">
                    ✔️
                </template>
                Send credential to each stendent with A level
            </button>
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
import { onErrorCaptured, onMounted, ref } from 'vue';
import { getListFormsQuiz, sendCredential as sendCertificate, sendStudentReport, StudentReport } from './api';
import { useLocalStorage } from './composables/localStorage';
import { useRefreshable } from './composables/refreshable';
import { resolveForms } from './responseResolver';
import { calculateStudentReport } from './studentReport';
import { ResolvedForms, ResolvedQuestion } from './type';
import { ensureTable, ensureWorksheet, normalizeWorksheetName } from './utils'

const error = ref(undefined as undefined | Error)
const quiz = useLocalStorage<ResolvedForms[]>('quiz', () => [] as ResolvedForms[], JSON.stringify, JSON.parse)
const sentReport = ref(false)
const sentCertificate = ref(false)

const { refresh, refreshing } = useRefreshable(async () => {
    const forms = await getListFormsQuiz()
    quiz.value = await Promise.all(forms.map(resolveForms))
})

onMounted(refresh)

async function generateAll() {
    resetError()
    await Promise.all(quiz.value.map(generateV2))
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

const { refresh: getAndSendStudentReport, refreshing: gettingAndSendStudentReport } = useRefreshable(async function getAndSendStudentReport() {
    resetError()
    const reports = calculateStudentReport(quiz.value)
    await Excel.run(async (context) => {
        const summary = context.workbook.tables.getItem('StudentSummary')
        summary.load('rows/items,rows/items/length,rows/items/values')
        await context.sync()
        for (const r of summary.rows.items) {
            const summary = r.values[0][3]
            const student = reports.find(student => r.values[0][0] === student.name && r.values[0][1] === student.email)
            if (student) {
                student.summary = summary ?? ''
            }
        }
    }).catch(handleError)
    if (false) {
        await new Promise((resolve) => {
            setTimeout(resolve, 1000)
        })
    } else {
        await Promise.all(reports
        // .filter(r => r.name === 'Hongze Xu' || r.email === 'gingjia@microsoft.com')
        .map(sendStudentReport))
    }
    sentReport.value = true
})

const { refresh: getAndSendStudentGrading, refreshing: gettingAndSendStudentGrading } = useRefreshable(async () => {
    resetError()
    const reports = calculateStudentReport(quiz.value)
    if (false) {
        await new Promise((resolve) => {
            setTimeout(resolve, 1000)
        })
    } else {
        await Promise.all(reports
        .filter(r => r.grade.startsWith('A') || r.grade.startsWith('B'))
        .map((r) => {
            return sendCertificate(r.name, r.email, r.grade)
        }))
    }
    sentCertificate.value = true
})

window.onrejectionhandled = (e) => {
    handleError(e.reason)
}

onErrorCaptured((e) => {
    handleError(e)
})

async function analyzeByUser() {
    resetError()
    await Excel.run(async (context) => {
        const worksheet = await ensureWorksheet(context, 'StudentsSummary')
        worksheet.tabColor = '#F9BF00'
        const header = ['Name', 'Email', 'Grade', 'Summary'] as (string | number)[]
        const rows = [header] as (string | number)[][]
        const reports = calculateStudentReport(quiz.value)
        for (const q of quiz.value) {
            header.push(q.title)
        }
        for (const r of reports) {
            const row = [r.name, r.email, r.grade, r.summary] as (string | number)[]
            for (const q of quiz.value) {
                row.push(r.quiz.find(res => res.quizId === q.id)?.score ?? 'Not Attend')
            }
            rows.push(row)
        }

        console.log(rows)

        const table = await ensureTable(worksheet.tables, worksheet.getRange("A1"), rows, 'StudentSummary')

        const tableRange = table.getRange()
        tableRange.load('address')
        await context.sync()
        const conditionalFormat = tableRange.conditionalFormats.add(Excel.ConditionalFormatType.iconSet);
        const iconSetCF = conditionalFormat.iconSet;
        iconSetCF.style = Excel.IconSet.threeTriangles;
        iconSetCF.criteria = [
            {} as any,
            {
                type: Excel.ConditionalFormatIconRuleType.number,
                operator: Excel.ConditionalIconCriterionOperator.greaterThanOrEqual,
                formula: "=PERCENTILE(" + tableRange.address + ",0.25)"
            },
            {
                type: Excel.ConditionalFormatIconRuleType.number,
                operator: Excel.ConditionalIconCriterionOperator.greaterThanOrEqual,
                formula: "=PERCENTILE(" + tableRange.address + ",0.75)"
            }
        ];

        // const conditionalFormatColor = tableRange.conditionalFormats.add(Excel.ConditionalFormatType.custom);
        // conditionalFormatColor.colorScale.threeColorScale

        await context.sync()
    }).catch(handleError)
}

async function analyzeByQuiz() {
    resetError()
    await Excel.run(async (context) => {
        const worksheet = await ensureWorksheet(context, 'QuizSummary')
        worksheet.tabColor = '#F9BF00'
        const header = ['Name', 'Date', 'TotalScore', 'AverageScore', 'HighestScore', 'LowestScore']
        const rows = [header] as (string | number)[][]
        for (const q of quiz.value) {
            rows.push([q.title, q.createdDate, q.totalPoint, q.averageScore, q.maxScore, q.minScore])
        }

        const start = worksheet.getRange('A1')
        const table = await ensureTable(worksheet.tables, start, rows, 'QuizSummary')
        await context.sync()

        const dataRange = start.getBoundingRect(table.getRange())
        let chart = worksheet.charts.add(Excel.ChartType.line, dataRange, "Auto");
        const chartStart = table.getRange().getLastColumn().getOffsetRange(0, 2)
        const chartEnd = chartStart.getAbsoluteResizedRange(20, 11)
        chart.setPosition(chartStart, chartEnd)//, "M15");
        chart.title.text = "Quiz Summary"
        chart.legend.position = "Bottom"
        chart.legend.format.fill.setSolidColor("white")
        chart.dataLabels.format.font.size = 15
        chart.dataLabels.format.font.color = "black"
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
