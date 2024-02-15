import z from "zod"
import { prisma } from "../lib/prisma"
import { FastifyInstance } from "fastify"

export async function createPoll(app: FastifyInstance) { // http://localhost:3333/polls
    app.post('/polls', async (request, reply) => {
        const createPollBody = z.object({
            title: z.string(),
            options: z.array(z.string())
        })

        const { title, options } = createPollBody.parse(request.body)

        // const poll = await prisma.poll.create({ //isso se fosse postgress
        //     data: {
        //         title,
        //         options: {
        //             createMany: { //no prisma qd cria rel qd cria o registro da tabela pai não precisa informar o Id , retirado poll.id de data
        //                 data: options.map((option) => {
        //                     return { title: option}
        //                 })
        //             }
        //         }
        //     }
        // })

        /* não é possível utilizar o createMany com o SQLite, vamos então trocar para:*/
        const poll = await prisma.poll.create({
            data: {
              title,
            }
          })

          await Promise.all(options.map((option) => {
            return prisma.pollOption.create({
              data: {
                title: option,
                pollId: poll.id
              }
            })
          }))

        return reply.status(201).send({ pollId: poll.id})
    })
}
