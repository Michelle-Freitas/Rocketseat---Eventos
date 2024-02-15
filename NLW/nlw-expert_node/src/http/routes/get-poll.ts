import z from "zod"
import { prisma } from "../lib/prisma"
import { FastifyInstance } from "fastify"
import { redis } from "../lib/redis"

export async function getPoll(app: FastifyInstance) { // http://localhost:3333/polls/id
    app.get('/polls/:pollId', async (request, reply) => {
        const getPollParams = z.object({
            pollId: z.string().uuid()
        })

        const { pollId } = getPollParams.parse(request.params)

        const poll = await prisma.poll.findUnique({
            where: {
                id: pollId
            },
            include: { //inclui dados de relacionamento ao msm tempo de uma entidade especifica
                //trazer dados da enquete ao msm tempo join e busque dados das opções da enquete
                options: {
                    select: { //selecionar campos especificos
                        id: true,
                        title: true
                    }
                }
            }
        })
        if (!poll) return reply.status(400).send({ message: 'Poll not found' })

        const result = await redis.zrange(pollId, 0, -1, 'WITHSCORES') //zrange trás o ranking atraves de uma chave, posição 0 até -1 (TODAS)
        // se fosse 3 primeiras (key, 0, 3)
        // ultimo parametro tem varias opções, WITHSCORES para trazer a qt de votos e não só os nomes das opções de votos

        console.log(result) //retorna [ id, num, id, num]
        // converter para um objeto {id: numero_votos}
        const votes = result.reduce((obj, line, index) => { // obj as Record<string, number>
            if(index % 2 === 0 ){
                const score = result[index + 1]

                Object.assign(obj, { [line]: Number(score) })
                //Object.assign() => mesclar dois objetos
            }

            return obj

        }, {} as Record<string, number>)
        // {} vazio no TS colocamos as Record (objeto) <tipo_da_chave, valor_chave >

        console.log(votes) //{'id_opção' : total_votos}

        return reply.send({
            poll: {
                id: poll.id,
                title: poll.title,
                options: poll.options.map((option) => {
                    return {
                    id: option.id,
                    title: option.title,
                    score: (option.id in votes) ? votes[option.id] : 0,
                    }
                }),
            },
        })
    })
}
