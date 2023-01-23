import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
    log: ['query']
}) //acesso as tabelas do banco de dados
