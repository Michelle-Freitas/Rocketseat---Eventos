import { prisma } from './lib/prisma'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import dayjs from 'dayjs'

//como app não existe aqui dentro, no fastify podemos resolver exportando uma function passando app como parametro e declarar dentro as rotas
//e no parametro colocar o tipo FastifyInstance

export async function appRoutes(app: FastifyInstance ) {
    //TS parametros devem ter tipos
    app.post('/habits', async (request) => {
        //validação que os parametros chegaram nas rotas -> usar biblioteca zod
        const createHabitBody = z.object({
            title: z.string(),
            weekDays: z.array(z.number().min(0).max(6))
            //se não fosse obrigatória -> title: z.string().nullable()
        })

        //para criar novo habito -> title, weekDays
        const {title, weekDays} = createHabitBody.parse(request.body)

        const today = dayjs().startOf('day').toDate()
        //startOf() -> zera hr:min:seg

        await prisma.habit.create({
            data: {
                title, //titulo recebido acima
                created_at: today, //data atual

                //Prisma permite enquanto cria os habitos no bd pode criar os registros da tabela weekDays
                weekDays: {
                    //criar umarray pq são vários registros
                    //nesse caso um map para percorrer dias da semana e criar o array
                    create: weekDays.map(weekDay => {// e para cada dia da semana
                    return { //um objeto com as informações desejadas
                        week_day: weekDay,
                    }
                    })
                }
            }
        })

    })

    app.get('/day', async (request) => {

        const getDayParams = z.object({
            //unico parametro que precisamos nessa rota -> data
            date: z.coerce.date() // front manda em formato string então precisamos converter em data(coerce)
        })

        const { date } = getDayParams.parse(request.query)
        //recebe como query pq localhost:3333/day?date=2022-01-13T....data completa

        const parsedDate = dayjs(date).startOf('day')

        const weekDay = parsedDate.get('day')

        const possibleHabits = await prisma.habit.findMany({//Habitos possiveis
            where: {
                created_at: { //encontrar habitos criados até aquela if data <= date (if = lte ??)
                    lte: date,
                },
                //podemos criar where encadeados em relacionamento
                weekDays: {
                    some: { //alguma dia semana seja o dia que esta recebendo na date
                        week_day: weekDay,
                    }
                }
            }
        })

        const day = await prisma.day.findUnique({//Habitos completados no dia
            where: {
                date: parsedDate.toDate() //buscando dia na tabela de dias onde data seja igual a enviada
            },
            include: { //se dentro do include passar o relacionamento ex:dayHabit
                dayHabits: true //trás tds habits relacionados ao dia
            }
        })

        const completedHabits = day?.dayHabits.map(dayHabit => { // verificar se o day não está null -> .?
            return dayHabit.habit_id
        }) ?? [] //retorna array vazio

        return {
            possibleHabits,
            completedHabits, //apenas o id
        }

    })

    //marcar e desmarcar habito completo
    app.patch('/habits/:id/toggle', async (request) =>{
        // :id -> route param -> parametro de identificação localhost:3333/habits/1/toggle

        const toggleHabitsParams = z.object({
            id: z.string().uuid(), //uuid já valida se está no formato correto
        })

        const { id } = toggleHabitsParams.parse(request.params)

        //acompanhamento diario, não é retroativo
        const today = dayjs().startOf('day').toDate() //starOf('day') para constar apenas dia sem hora


        //apenas vamos criar tabela Day só vai ter registro a partir do primeiro habito criado e não para todos os dias
        let day = await prisma.day.findUnique({ //um dia onde a data é hoje
            where: {
                date: today,
            }
        })

        //caso não tenha o dia ele irá criar o day
        if (!day) {
            day = await prisma.day.create({
                data: {
                    date: today,
                }
            })
        }

        //Buscando registro na tabela DayHabits se o usuario já marcou completo o habito
        const dayHabit = await prisma.dayHabit.findUnique({ //Como colamos @@unique esses dois ele mostra a união entre eles para encontrar
            where: {
                day_id_habit_id:{
                    day_id: day.id,
                    habit_id: id,
                }
            }
        })

        if (dayHabit) { //se já completo
            await prisma.dayHabit.delete({
                where: {
                    id: dayHabit.id,
                }
            })
            //remover a marcação de completo
        } else { //Completar o hábito nesse dia
            await prisma.dayHabit.create({
                data: {
                    day_id: day.id,
                    habit_id: id, //vem do toggleHabitsParams
                }
            })
        }







    })

    //resumo do dia
    app.get('/summary', async () => {
        //retornar o resumo em lista = [{data, qtHabitosPossiveis, qtsHabitosCompletos},{}]

        //Para fazermos apenas uma requisição para o bd
        const summary = await prisma.$queryRaw`
            SELECT --query principal
                D.id,
                D.date,
                (--iremos utilizar Sub Queries = select dentro de outro
                    SELECT --nº habitos completados na data
                        cast(count(*) as float) --count retorna BigInt, converter para float para solucionar o bug e colocar cast em torno
                    FROM day_habits DH
                    WHERE DH.day_id = D.id --registros habitos completados que seja igual ao dia listado na query principal
                ) as completed, --nome do retorno

                (--total de habitos disponiveis
                    SELECT
                        cast(count(*) as float)
                    FROM habit_week_days HWD --todos habitos disponiveis em cada dia da semana
                    JOIN habits H -- buscar habito relacionado com cada habit_week_days
                        ON H.id = HWD.habit_id --ON = where
                    WHERE
                        HWD.week_day = cast(strftime('%w', D.date/1000.0, 'unixepoch') as int)--SQLite padrão  Epoch Timestamp
                        AND H.created_at <= D.date --habito criado antes ou no dia
                ) as amount

            FROM days D
        `

        return summary
    })



}

