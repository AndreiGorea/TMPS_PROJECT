import { DynamicModule, FactoryProvider, ModuleMetadata } from '@nestjs/common';
import { Module } from '@nestjs/common';
import IORedis, { Redis, RedisOptions } from 'ioredis';

export const IORedisKey = 'IORedis';

type RedisModuleOptions = {
  connectionOptions: RedisOptions;
  onClientReady?: (client: Redis) => void;
};

type RedisAsyncModuleOptions = {
  useFactory: (
    ...args: any[]
  ) => Promise<RedisModuleOptions> | RedisModuleOptions;
} & Pick<ModuleMetadata, 'imports'> &
  Pick<FactoryProvider, 'inject'>;

@Module({})
export class RedisModule {
  private static redisClient: Redis;

  static async registerAsync({
    useFactory,
    imports,
    inject,
  }: RedisAsyncModuleOptions): Promise<DynamicModule> {
    if (!RedisModule.redisClient) {
      const redisProvider = {
        provide: IORedisKey,
        useFactory: async (...args) => {
          const { connectionOptions, onClientReady } = await useFactory(
            ...args,
          );

          RedisModule.redisClient = new IORedis(connectionOptions);

          onClientReady(RedisModule.redisClient);

          return RedisModule.redisClient;
        },
        inject,
      };

      return {
        module: RedisModule,
        imports,
        providers: [redisProvider],
        exports: [redisProvider],
      };
    } else {
      // If the Redis client instance already exists, return the module without creating a new instance
      return {
        module: RedisModule,
        imports,
        exports: [IORedisKey],
      };
    }
  }
}
