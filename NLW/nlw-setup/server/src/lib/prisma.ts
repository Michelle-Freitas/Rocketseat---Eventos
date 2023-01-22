import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
    log: ['query']
}) //assim tem acesso a todas as tabelas do banco de dados
