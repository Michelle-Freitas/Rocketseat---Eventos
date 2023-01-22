import { Check } from "phosphor-react";
import * as Checkbox from '@radix-ui/react-checkbox';
import { FormEvent, useState } from "react";
import { api } from "../lib/axios";


const availableWeekDays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']

export function NewHabitForm(){

    const [title, setTitle] = useState('') //vamos nesse caso criar um useState para cada campo do nosso form
    const [weekDays, setWeekDays] = useState<number[]>([]) //aqui para dias semana vamos armazenar um array

    async function createNewHabit(event: FormEvent){ //receber o evento de subtmit, mas como TS não entende precisamos usar o type
        //clicando onSubit pode ver q ele recebe uma função e clicando na função vemos q ele recebe FormEvent

        event.preventDefault() //para não redirecionar usuario para outra página


        if (!title || weekDays.length == 0){
            return //apenas não acontece nada
        }
        //caso contrario irá chamar nossa api
        await api.post('habits', {//post = criar informação
            title,
            weekDays,
        }) //objetos que serão enviados no corpo da requisição

        setTitle('')
        setWeekDays([])

        alert('Hábito criado com sucesso')
    }

    function handleToggleWeekDays(weekDay: number){
        if (weekDays.includes(weekDay)){ //se já está no array

            //No React não podemos modificar um variavel (imutabilidade), substitui por completo com uma nova
            /*então não podemos utilizar
            const weekDayIndex = weekDays.findIndex(day => day == weekDay)
            e utilizar splice, push    ->  TEMOS QUE CRIAR UM NOVO ARRAY */

            const weekDaysWithRemovedOne = weekDays.filter(day => day !== weekDay)
            //procurar e deixar apenas dias que são diferentes do que quero remover

            setWeekDays(weekDaysWithRemovedOne)

        } else {
            const weekDaysWithAddedOne = [...weekDays, weekDay]
            //...todos que já tinha, e incluir weekday

            setWeekDays(weekDaysWithAddedOne)
        }

    }

    return (
        <form onSubmit={createNewHabit} className="w-full flex flex-col mt-6">
            <label htmlFor="title"
            className="font-semibold leading-tight" >Qual seu comprometimento
            </label>

            <input
            type="text" id="title" placeholder="Ex: Exercícios, dormir bem, etc..." autoFocus
            className="p-4 rounded-lf mt-3 bg-zinc-800 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 focus:ring-offset-zinc-900"
            onChange={event => setTitle(event.target.value)}
            //onChange = sempre que mudar recebe o evento, executa a função (target->input) retorna valor do input
            value={title} //que será setada como ''
            />

            <label htmlFor=""
            className="font-semibold leading-tight mt-4" >Qual a recorrência?
            </label>

            {/*CHECKBOX*/}
            <div className="mt-3 flex flex-col gap-2">

                {availableWeekDays.map((weekDay, index) => {
                    return (
                        <Checkbox.Root
                            key={weekDay}
                            className="flex items-center gap-3 group focus:outline-none"
                            onCheckedChange={() => { //podemos usar o availableWeekDays que já temos só acrescentar no map o index
                                handleToggleWeekDays(index)
                            }}
                        checked={weekDays.includes(index)}
                        >

                        <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800
                        group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-colors
                        group-focus:ring-2 group-focus:ring-violet-700 group-focus:ring-offset-2 group-focus:ring-offset-background">
                            <Checkbox.Indicator>
                                <Check size={20} className="text-white"/>
                            </Checkbox.Indicator>
                        </div>

                        <span className="text-white leading-tight">
                            {weekDay}
                        </span>

                    </Checkbox.Root>
                    )
                })}

            </div>

            <button
                type="submit"
                className="mt-6 rounded-lg p-4 flex items-center justify-center gap-3 font-semibold bg-green-600 hover:bg-green-500 transition-colors
                focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-zinc-900">

                <Check size={20} weight="bold"/>
                Confirmar
            </button>
        </form>
    )
}
