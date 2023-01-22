import dayjs from "dayjs"
import { useEffect, useState } from "react"
import { api } from "../lib/axios"
import { generateDatesFromYearBeginning } from "../utils/generate-dates-from-year-beginning"
import { HabitDay } from "./HabitDay"

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

const summaryDates = generateDatesFromYearBeginning()

const minimumSummaryDatesSize = 18 * 7 //minimo 18 semanas * nº quadrados
const amountOfDaysToFill = minimumSummaryDatesSize - summaryDates.length

type Summary = Array<{ //interface é meio ruim para array então usa type -> Array de <{objeto}>
    id: string;
    date: string;
    amount: number;
    completed: number;
}>
//pode ser tbm type Summary = {....}[]

export function SummaryTable(){

    const [summary, setSummary] = useState<Summary>([]) //nosso backend retorna info em array de {}

    api.get('/summary').then(response => { //.then() pq é uma promise e demora pra responder
            setSummary(response.data) //preenchendo valor da variavel
        })
    // => qual a função, e quando vai executar q é um array
    useEffect(() => {

    }, [])

    return (
        <div className="w-full flex">
            {/*Dias da semana*/}
            <div className="grid grid-rows-7 grid-flow-row gap-3">
                {weekDays.map((weekDay, i) => {//o react obriga a ter uma key no primeiro elemento do map, react quer saber a informação unica e weekday se repete então usar weekday e indice
                    return (//a key tem que ser uma string
                        <div key={`${weekDay}-${i}`} className="text-zinc-400 text-xl font-bold h-10 w-10 flex items-center justify-center">
                            {weekDay}
                        </div>
                    )
                })}
            </div>

            {/*Quadradinhos dos dias*/}
            <div className="grid grid-rows-7 grid-flow-col gap-3">
                {/*Só executa se já tiver carregado os dados do backend (summary.length > 0) */}
                {summary.length > 0 && summaryDates.map((date) => {//a key tem que ser uma string
                    const dayInSummary = summary.find(day => {//verificar se o dia date está dentro do nosso resumo
                        return dayjs(date).isSame(day.date, 'day') //usar o dayjs para facilicar comparação de datas - day=aa/mm/dd
                })

                    return (
                        <HabitDay
                        key={date.toString()}
                        date={date}
                        amount={dayInSummary?.amount} //podem ter dias que não vão estar
                        defaultCompleted={dayInSummary?.completed}
                        />
                    )
                })}

                {/*Quadradinhos ainda não usados para preencher */}
                {amountOfDaysToFill > 0 && Array.from({ length: amountOfDaysToFill }).map((_, i) =>{
                    //Array.from(length: tamanho) para criar um array de uma tamano determinado
                    //map(_, i) nesse caso não tem problema pq ele não muda e não afeta, e tbm é vazio o array
                    return (
                        <div key={i} className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg
                        opacity-40 cursor-not-allowed"></div>

                    )}
                )}
            </div>
        </div>

    )
}
