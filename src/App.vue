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
                    @click="generate(q)">Import</button>
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
                @click="analyzeByUser()">Analyze User</button>
            <button class="p-2 text-teal-400 font-semibold hover:(bg-teal-100) transition-all duration-300 "
                @click="analyzeByUser()">Genea</button>
        </div>

    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { getListFormsQuiz } from './api';
import { useRefreshable } from './composables/refreshable';
import { resolveForms } from './responseResolver';
import { FormsData, ResolvedQuestion } from './type';

const quiz = ref([] as FormsData[])

const { refresh, refreshing } = useRefreshable(async () => {
    quiz.value = await getListFormsQuiz()
})

onMounted(refresh)

async function generateAll() {
    await Promise.all(quiz.value.map(generate))
}

async function generate(f: FormsData) {
    const resolved = await resolveForms(f)

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
    const name = `${f.title}-${f.id}`.substring(0, 31).replace(':', ' ')

    await Excel.run(async (context) => {
        let ws = context.workbook.worksheets.getItemOrNullObject(name)
        ws.load()
        await context.sync()
        if (ws.isNullObject) {
            ws = context.workbook.worksheets.add(name)
            await context.sync()
        }
        let table = ws.tables.getItemOrNullObject(`responses-${f.id}`)
        table.load()
        const start = ws.getRange('A1')
        const end = start.getOffsetRange(rows.length - 1, rows[0].length - 1)
        const range = start.getBoundingRect(end)
        range.load('address')
        await context.sync()
        if (table.isNullObject) {
            range.values = rows
            table = ws.tables.add(range, true)
        } else {
            range.values = rows
        }
        await context.sync()
    }).catch(e => {
        console.error(e)
    })
}

async function analyzeByUser() {

}

async function analyzeByQuiz() {

}

</script>