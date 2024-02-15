import { FastifyInstance } from "fastify";
import { voting } from "../../utils/voting-pub-sub";
import { z } from "zod";

export async function pollResults(app: FastifyInstance) {
    app.get('/polls/:pollId/results', { websocket: true }, (connection, request) => {

        // Inscrever apenas as mensagens publicadas no canal com o ID da enquete (pollId)
        // na rota vote-on-poll, publicar msgs dentro do canal com aquele ID (pollId)

        const getPollParams = z.object({
            pollId: z.string().uuid(),
        })

        const { pollId } = getPollParams.parse(request.params)

        voting.subscribe(pollId, (message) => {
            connection.socket.send(JSON.stringify(message))
        })

        // connection.socket.on('message', (message: string) => {
        //     // https://github.com/fastify/fastify-websocket
        //     // message.toString() === 'hi from client'
        //     connection.socket.send('you sent: '+ message)
        // })

    })
}

// Pub / Sub - Publish  Subscribes (categorizar eventos)
// (publica msgs em listas cria canais de msg) "1" => 1,2,3 (canal 1, msgs 1,2,3)
// Pattern muito usado em aplicação que lidam com eventos
// algo acontece na minha aplicação e precisa gerar um efeito colateral (ex: cadastro, então envia email)

