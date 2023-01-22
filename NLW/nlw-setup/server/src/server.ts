import Fastify from 'fastify'
import cors from '@fastify/cors'
import { appRoutes } from './routes'


const app = Fastify() //criando aplicação

app.register(cors) //front end consiguirá acessar dados do backend

app.register(appRoutes)

/* Convenções http
 Método http a rota fará:
    Get = buscar
    Post = criar
    Put = atualizar por completo
    Patch = atualizar info especifica
    Delete = deletar recurso

*/



//aplicação ouvir porta 3333, passar como objeto
app.listen({
    port: 3333,
    //host:'26.41.93.55',
    host: '0.0.0.0',
}).then(()=>{ //só para visualizarmos que está rodando o server
    console.log('HTTP server running')
})

