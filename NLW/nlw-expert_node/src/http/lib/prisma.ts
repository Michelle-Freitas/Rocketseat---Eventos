import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({ //conexão banco
    //configs
    log: ['query'] //mostrar no console tds as queries qd feitas pelo banco
})
