/// <reference types="redis" />

import { createClient } from 'redis';
// import type { RedisCommandArgument, RedisCommandArguments } from '@redis/client';

const url = process.env.db_redis;

export type RedisClient = Awaited<ReturnType<typeof createClient>>;


const client: RedisClient = await createClient({
    url
})
    .on('error', err => console.log('Redis Client Error', err))
    .connect();

// await client.set('key', 'value');
// const value = await client.get('key');
// await client.disconnect();

// 必须明确指定导出的`redis`的类型, 以解决若干如下问题:
// The inferred type of 'redis' cannot be named without a reference to 
// '.pnpm/@redis+bloom@1.2.0_@redis+client@1.5.14/node_modules/@redis/bloom/dist/commands/bloom/ADD'. 
// This is likely not portable. A type annotation is necessary.ts(2742)
export const redis: RedisClient = client;
export const backendCache: RedisClient = client;