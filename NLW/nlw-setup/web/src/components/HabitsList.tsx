import * as Checkbox from '@radix-ui/react-checkbox';
import dayjs from 'dayjs';

import { Check } from 'phosphor-react';
import { useEffect, useState } from 'react';
import { api } from '../lib/axios';


interface HabitsListProps {
    date: Date;
    onCompletedChanged: (completed: number) => void
}

interface HabitsInfoProps {
    possibleHabits: {
        id: string;
        title: string;
        created_at: string;
    }[],
    //array poderia escrever : Array <{....}>,
    completedHabits: string[]
}

export function HabitsList( { date, onCompletedChanged } : HabitsListProps ){

    const [habitsInfo, setHabitsInfo] = useState<HabitsInfoProps>()

    useEffect(() => {
        api.get('day', {
            params: {
                date: date.toISOString(), //formato ISO a data
            }
        }).then(response => {
            setHabitsInfo(response.data)
        })
    }, [])

    async function handleToggleHabit(habitId: string){

        await api.patch(`/habits/${habitId}/toggle`)
        //api não precisa da informação se quer remover ou add, tem isso no bd

        //função de toogle (marca e desmarca)
        const isHabitAlreadyCompleted = habitsInfo!.completedHabits.includes(habitId)
        // ! -> informa o TS q vai ter essa informação no momento que chamar a função

        let completedHabits: string[] = []

        if (isHabitAlreadyCompleted) { //remover da lista
            completedHabits = habitsInfo!.completedHabits.filter(id => id !== habitId)
            // = lista anterior + filter da completedHabits

        } else { //add na lista
            completedHabits = [...habitsInfo!.completedHabits, habitId]
        }

        setHabitsInfo({
            possibleHabits: habitsInfo!.possibleHabits,
            //(possibleHabits) não qremos alterar, então colocar pra receber o mesmo
            completedHabits
        })

        onCompletedChanged(completedHabits.length)
    }

    const isDateInPast = dayjs(date).endOf('day').isBefore(new Date())
    //mas todas as datas irão passar por conta da hr:min:seg usar endOf() que vai colocar a data com hr 23:59:59


    return (
        /*CHECKBOX*/
        <div className="mt-6 flex flex-col gap-3">
            {habitsInfo?.possibleHabits.map(habit => {
                return (

                    <Checkbox.Root
                        key={habit.id}
                        onCheckedChange={() => handleToggleHabit(habit.id)}
                        checked={habitsInfo.completedHabits.includes(habit.id)}
                        disabled={isDateInPast}
                        //se o hábito está dentro da lista está completado e será checked
                        className="flex items-center gap-3 group focus:outline-none disabled:cursor-not-allowed">
                    {/*colocando group pode estilizar outros baseado no que esse elemento tem no caso (data-) */}


                    {/*aqui estilizou a div para no Indicator ter só o icone checked */}
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800
                    group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-colors
                    group-focus:outline-none group-focus:ring-2 group-focus:ring-violet-700 group-focus:ring-offset-2 group-focus:ring-offset-background">
                    {/*qd o meu grupo, q é onde etá a classe group, tiver atributo state-data com valor checked: será estilizado com */}

                        <Checkbox.Indicator>
                            <Check size={20} className="text-white"/>
                        </Checkbox.Indicator>
                    </div>

                    <span className="font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400">
                        {habit.title}
                    </span>
                </Checkbox.Root>
                )
            })}

        </div>
    )
}
