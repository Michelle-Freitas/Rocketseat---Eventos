import z from "zod"
import { prisma } from "../lib/prisma"
import { FastifyInstance } from "fastify"
import { randomUUID } from 'node:crypto'
import { redis } from "../lib/redis"
import { voting } from "../lib/utils/voting-pub-sub"

export async function voteOnPoll(app: FastifyInstance) { // http://localhost:3333/polls/id
    app.post('/polls/:pollId/votes', async (request, reply) => {
        const voteOnPollBody = z.object({
            pollOptionId: z.string().uuid()
        })

        const voteOnPollParams = z.object({
            pollId: z.string().uuid()
        })

        const { pollOptionId } = voteOnPollBody.parse(request.body)
        const { pollId } = voteOnPollParams.parse(request.params)

        // COOKIES (npm i @fastify/cookie)
        // VERIFICAR SE JÁ TEM COOKIE DE USER PARA NÃO DUPLICAR O VOTO (JÁ TEM SESSION ID ?)
        let { sessionId } = request.cookies

        if (sessionId) {
            const userPreviousVoteOnPoll = await prisma.vote.findUnique({
                where: {
                    sessionId_pollId: { //indices da tabela, muito mais performatica, não precisa fazer uma varredura para encontrar
                        sessionId,
                        pollId
                    }
                }
            })

            if (userPreviousVoteOnPoll && userPreviousVoteOnPoll.pollOptionId !== pollOptionId){
                // Apagar voto anterior e para criar um voto novo lá pra baixo
                await prisma.vote.delete({
                    where: {
                        id: userPreviousVoteOnPoll.id
                    }
                })

                const votes = await redis.zincrby(pollId, -1, userPreviousVoteOnPoll.pollOptionId) //decrementando em 1 da opção anterior

                voting.publish(pollId, {
                    pollOptionId: userPreviousVoteOnPoll.pollOptionId,
                    votes: Number(votes),
                })

            } else if (userPreviousVoteOnPoll) {
                return reply.status(400).send({message: 'You already voted on this poll'})
            }
        }

        if (!sessionId) {
            sessionId = randomUUID() //gerar id unico

            reply.setCookie('sessionId', sessionId, {
                path: '/', // quais rotas terão acesso a informação / = todas
                maxAge: 60 * 60 * 24 * 30, //qt tempo ficará salvo => 30 dias
                signed: true, //para que o user não possa alterar
                httpOnly: true, //front não acessa info, apenas o backend
            })
            // nome, variavel, {opções no cookie}
        }

        await prisma.vote.create({
            data: {
                sessionId,
                pollId,
                pollOptionId
            }
        })

        const votes = await redis.zincrby(pollId, 1, pollOptionId) //incrementando em 1  essa opção dentro dessa enquete

        voting.publish(pollId, {
            pollOptionId,
            votes: Number(votes),
        })

        return reply.status(201).send()
    })
}
