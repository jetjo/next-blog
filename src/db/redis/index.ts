import { createClient } from 'redis';
// import type { RedisCommandArgument, RedisCommandArguments } from '@redis/client';

const url = process.env.db_redis;

const client = await createClient({
    url
})
    .on('error', err => console.log('Redis Client Error', err))
    .connect();

// await client.set('key', 'value');
// const value = await client.get('key');
// await client.disconnect();

export const redis = client;
export const backendCache = client;