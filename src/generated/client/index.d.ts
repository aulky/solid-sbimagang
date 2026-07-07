
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Divisi
 * 
 */
export type Divisi = $Result.DefaultSelection<Prisma.$DivisiPayload>
/**
 * Model Absensi
 * 
 */
export type Absensi = $Result.DefaultSelection<Prisma.$AbsensiPayload>
/**
 * Model Izin
 * 
 */
export type Izin = $Result.DefaultSelection<Prisma.$IzinPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Role: {
  ADMIN: 'ADMIN',
  USER: 'USER'
};

export type Role = (typeof Role)[keyof typeof Role]


export const AttendanceStatus: {
  HADIR: 'HADIR',
  TELAT: 'TELAT',
  ALPHA: 'ALPHA',
  IZIN: 'IZIN'
};

export type AttendanceStatus = (typeof AttendanceStatus)[keyof typeof AttendanceStatus]


export const IzinType: {
  SAKIT: 'SAKIT',
  IZIN: 'IZIN',
  CUTI: 'CUTI'
};

export type IzinType = (typeof IzinType)[keyof typeof IzinType]


export const IzinStatus: {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};

export type IzinStatus = (typeof IzinStatus)[keyof typeof IzinStatus]

}

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

export type AttendanceStatus = $Enums.AttendanceStatus

export const AttendanceStatus: typeof $Enums.AttendanceStatus

export type IzinType = $Enums.IzinType

export const IzinType: typeof $Enums.IzinType

export type IzinStatus = $Enums.IzinStatus

export const IzinStatus: typeof $Enums.IzinStatus

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.divisi`: Exposes CRUD operations for the **Divisi** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Divisis
    * const divisis = await prisma.divisi.findMany()
    * ```
    */
  get divisi(): Prisma.DivisiDelegate<ExtArgs>;

  /**
   * `prisma.absensi`: Exposes CRUD operations for the **Absensi** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Absensis
    * const absensis = await prisma.absensi.findMany()
    * ```
    */
  get absensi(): Prisma.AbsensiDelegate<ExtArgs>;

  /**
   * `prisma.izin`: Exposes CRUD operations for the **Izin** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Izins
    * const izins = await prisma.izin.findMany()
    * ```
    */
  get izin(): Prisma.IzinDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Divisi: 'Divisi',
    Absensi: 'Absensi',
    Izin: 'Izin'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "user" | "divisi" | "absensi" | "izin"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Divisi: {
        payload: Prisma.$DivisiPayload<ExtArgs>
        fields: Prisma.DivisiFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DivisiFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DivisiPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DivisiFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DivisiPayload>
          }
          findFirst: {
            args: Prisma.DivisiFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DivisiPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DivisiFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DivisiPayload>
          }
          findMany: {
            args: Prisma.DivisiFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DivisiPayload>[]
          }
          create: {
            args: Prisma.DivisiCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DivisiPayload>
          }
          createMany: {
            args: Prisma.DivisiCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.DivisiDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DivisiPayload>
          }
          update: {
            args: Prisma.DivisiUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DivisiPayload>
          }
          deleteMany: {
            args: Prisma.DivisiDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DivisiUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DivisiUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DivisiPayload>
          }
          aggregate: {
            args: Prisma.DivisiAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDivisi>
          }
          groupBy: {
            args: Prisma.DivisiGroupByArgs<ExtArgs>
            result: $Utils.Optional<DivisiGroupByOutputType>[]
          }
          count: {
            args: Prisma.DivisiCountArgs<ExtArgs>
            result: $Utils.Optional<DivisiCountAggregateOutputType> | number
          }
        }
      }
      Absensi: {
        payload: Prisma.$AbsensiPayload<ExtArgs>
        fields: Prisma.AbsensiFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AbsensiFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AbsensiPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AbsensiFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AbsensiPayload>
          }
          findFirst: {
            args: Prisma.AbsensiFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AbsensiPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AbsensiFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AbsensiPayload>
          }
          findMany: {
            args: Prisma.AbsensiFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AbsensiPayload>[]
          }
          create: {
            args: Prisma.AbsensiCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AbsensiPayload>
          }
          createMany: {
            args: Prisma.AbsensiCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.AbsensiDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AbsensiPayload>
          }
          update: {
            args: Prisma.AbsensiUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AbsensiPayload>
          }
          deleteMany: {
            args: Prisma.AbsensiDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AbsensiUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.AbsensiUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AbsensiPayload>
          }
          aggregate: {
            args: Prisma.AbsensiAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAbsensi>
          }
          groupBy: {
            args: Prisma.AbsensiGroupByArgs<ExtArgs>
            result: $Utils.Optional<AbsensiGroupByOutputType>[]
          }
          count: {
            args: Prisma.AbsensiCountArgs<ExtArgs>
            result: $Utils.Optional<AbsensiCountAggregateOutputType> | number
          }
        }
      }
      Izin: {
        payload: Prisma.$IzinPayload<ExtArgs>
        fields: Prisma.IzinFieldRefs
        operations: {
          findUnique: {
            args: Prisma.IzinFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IzinPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.IzinFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IzinPayload>
          }
          findFirst: {
            args: Prisma.IzinFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IzinPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.IzinFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IzinPayload>
          }
          findMany: {
            args: Prisma.IzinFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IzinPayload>[]
          }
          create: {
            args: Prisma.IzinCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IzinPayload>
          }
          createMany: {
            args: Prisma.IzinCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.IzinDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IzinPayload>
          }
          update: {
            args: Prisma.IzinUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IzinPayload>
          }
          deleteMany: {
            args: Prisma.IzinDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.IzinUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.IzinUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$IzinPayload>
          }
          aggregate: {
            args: Prisma.IzinAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateIzin>
          }
          groupBy: {
            args: Prisma.IzinGroupByArgs<ExtArgs>
            result: $Utils.Optional<IzinGroupByOutputType>[]
          }
          count: {
            args: Prisma.IzinCountArgs<ExtArgs>
            result: $Utils.Optional<IzinCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    absensi: number
    izin: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    absensi?: boolean | UserCountOutputTypeCountAbsensiArgs
    izin?: boolean | UserCountOutputTypeCountIzinArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAbsensiArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AbsensiWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountIzinArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: IzinWhereInput
  }


  /**
   * Count Type DivisiCountOutputType
   */

  export type DivisiCountOutputType = {
    users: number
  }

  export type DivisiCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | DivisiCountOutputTypeCountUsersArgs
  }

  // Custom InputTypes
  /**
   * DivisiCountOutputType without action
   */
  export type DivisiCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DivisiCountOutputType
     */
    select?: DivisiCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DivisiCountOutputType without action
   */
  export type DivisiCountOutputTypeCountUsersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    username: string | null
    password: string | null
    fullName: string | null
    email: string | null
    phone: string | null
    role: $Enums.Role | null
    divisiId: string | null
    avatar: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    username: string | null
    password: string | null
    fullName: string | null
    email: string | null
    phone: string | null
    role: $Enums.Role | null
    divisiId: string | null
    avatar: string | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    username: number
    password: number
    fullName: number
    email: number
    phone: number
    role: number
    divisiId: number
    avatar: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    username?: true
    password?: true
    fullName?: true
    email?: true
    phone?: true
    role?: true
    divisiId?: true
    avatar?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    username?: true
    password?: true
    fullName?: true
    email?: true
    phone?: true
    role?: true
    divisiId?: true
    avatar?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    username?: true
    password?: true
    fullName?: true
    email?: true
    phone?: true
    role?: true
    divisiId?: true
    avatar?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    username: string
    password: string
    fullName: string
    email: string
    phone: string | null
    role: $Enums.Role
    divisiId: string | null
    avatar: string | null
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    username?: boolean
    password?: boolean
    fullName?: boolean
    email?: boolean
    phone?: boolean
    role?: boolean
    divisiId?: boolean
    avatar?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    divisi?: boolean | User$divisiArgs<ExtArgs>
    absensi?: boolean | User$absensiArgs<ExtArgs>
    izin?: boolean | User$izinArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>


  export type UserSelectScalar = {
    id?: boolean
    username?: boolean
    password?: boolean
    fullName?: boolean
    email?: boolean
    phone?: boolean
    role?: boolean
    divisiId?: boolean
    avatar?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    divisi?: boolean | User$divisiArgs<ExtArgs>
    absensi?: boolean | User$absensiArgs<ExtArgs>
    izin?: boolean | User$izinArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      divisi: Prisma.$DivisiPayload<ExtArgs> | null
      absensi: Prisma.$AbsensiPayload<ExtArgs>[]
      izin: Prisma.$IzinPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      username: string
      password: string
      fullName: string
      email: string
      phone: string | null
      role: $Enums.Role
      divisiId: string | null
      avatar: string | null
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    divisi<T extends User$divisiArgs<ExtArgs> = {}>(args?: Subset<T, User$divisiArgs<ExtArgs>>): Prisma__DivisiClient<$Result.GetResult<Prisma.$DivisiPayload<ExtArgs>, T, "findUniqueOrThrow"> | null, null, ExtArgs>
    absensi<T extends User$absensiArgs<ExtArgs> = {}>(args?: Subset<T, User$absensiArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AbsensiPayload<ExtArgs>, T, "findMany"> | Null>
    izin<T extends User$izinArgs<ExtArgs> = {}>(args?: Subset<T, User$izinArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IzinPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly username: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly fullName: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly phone: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'Role'>
    readonly divisiId: FieldRef<"User", 'String'>
    readonly avatar: FieldRef<"User", 'String'>
    readonly isActive: FieldRef<"User", 'Boolean'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User.divisi
   */
  export type User$divisiArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Divisi
     */
    select?: DivisiSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DivisiInclude<ExtArgs> | null
    where?: DivisiWhereInput
  }

  /**
   * User.absensi
   */
  export type User$absensiArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Absensi
     */
    select?: AbsensiSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AbsensiInclude<ExtArgs> | null
    where?: AbsensiWhereInput
    orderBy?: AbsensiOrderByWithRelationInput | AbsensiOrderByWithRelationInput[]
    cursor?: AbsensiWhereUniqueInput
    take?: number
    skip?: number
    distinct?: AbsensiScalarFieldEnum | AbsensiScalarFieldEnum[]
  }

  /**
   * User.izin
   */
  export type User$izinArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Izin
     */
    select?: IzinSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IzinInclude<ExtArgs> | null
    where?: IzinWhereInput
    orderBy?: IzinOrderByWithRelationInput | IzinOrderByWithRelationInput[]
    cursor?: IzinWhereUniqueInput
    take?: number
    skip?: number
    distinct?: IzinScalarFieldEnum | IzinScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Divisi
   */

  export type AggregateDivisi = {
    _count: DivisiCountAggregateOutputType | null
    _min: DivisiMinAggregateOutputType | null
    _max: DivisiMaxAggregateOutputType | null
  }

  export type DivisiMinAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DivisiMaxAggregateOutputType = {
    id: string | null
    name: string | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DivisiCountAggregateOutputType = {
    id: number
    name: number
    description: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DivisiMinAggregateInputType = {
    id?: true
    name?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DivisiMaxAggregateInputType = {
    id?: true
    name?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DivisiCountAggregateInputType = {
    id?: true
    name?: true
    description?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DivisiAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Divisi to aggregate.
     */
    where?: DivisiWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Divisis to fetch.
     */
    orderBy?: DivisiOrderByWithRelationInput | DivisiOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DivisiWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Divisis from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Divisis.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Divisis
    **/
    _count?: true | DivisiCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DivisiMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DivisiMaxAggregateInputType
  }

  export type GetDivisiAggregateType<T extends DivisiAggregateArgs> = {
        [P in keyof T & keyof AggregateDivisi]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDivisi[P]>
      : GetScalarType<T[P], AggregateDivisi[P]>
  }




  export type DivisiGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DivisiWhereInput
    orderBy?: DivisiOrderByWithAggregationInput | DivisiOrderByWithAggregationInput[]
    by: DivisiScalarFieldEnum[] | DivisiScalarFieldEnum
    having?: DivisiScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DivisiCountAggregateInputType | true
    _min?: DivisiMinAggregateInputType
    _max?: DivisiMaxAggregateInputType
  }

  export type DivisiGroupByOutputType = {
    id: string
    name: string
    description: string | null
    createdAt: Date
    updatedAt: Date
    _count: DivisiCountAggregateOutputType | null
    _min: DivisiMinAggregateOutputType | null
    _max: DivisiMaxAggregateOutputType | null
  }

  type GetDivisiGroupByPayload<T extends DivisiGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DivisiGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DivisiGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DivisiGroupByOutputType[P]>
            : GetScalarType<T[P], DivisiGroupByOutputType[P]>
        }
      >
    >


  export type DivisiSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    users?: boolean | Divisi$usersArgs<ExtArgs>
    _count?: boolean | DivisiCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["divisi"]>


  export type DivisiSelectScalar = {
    id?: boolean
    name?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DivisiInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    users?: boolean | Divisi$usersArgs<ExtArgs>
    _count?: boolean | DivisiCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $DivisiPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Divisi"
    objects: {
      users: Prisma.$UserPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      description: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["divisi"]>
    composites: {}
  }

  type DivisiGetPayload<S extends boolean | null | undefined | DivisiDefaultArgs> = $Result.GetResult<Prisma.$DivisiPayload, S>

  type DivisiCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DivisiFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DivisiCountAggregateInputType | true
    }

  export interface DivisiDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Divisi'], meta: { name: 'Divisi' } }
    /**
     * Find zero or one Divisi that matches the filter.
     * @param {DivisiFindUniqueArgs} args - Arguments to find a Divisi
     * @example
     * // Get one Divisi
     * const divisi = await prisma.divisi.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DivisiFindUniqueArgs>(args: SelectSubset<T, DivisiFindUniqueArgs<ExtArgs>>): Prisma__DivisiClient<$Result.GetResult<Prisma.$DivisiPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Divisi that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {DivisiFindUniqueOrThrowArgs} args - Arguments to find a Divisi
     * @example
     * // Get one Divisi
     * const divisi = await prisma.divisi.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DivisiFindUniqueOrThrowArgs>(args: SelectSubset<T, DivisiFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DivisiClient<$Result.GetResult<Prisma.$DivisiPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Divisi that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DivisiFindFirstArgs} args - Arguments to find a Divisi
     * @example
     * // Get one Divisi
     * const divisi = await prisma.divisi.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DivisiFindFirstArgs>(args?: SelectSubset<T, DivisiFindFirstArgs<ExtArgs>>): Prisma__DivisiClient<$Result.GetResult<Prisma.$DivisiPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Divisi that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DivisiFindFirstOrThrowArgs} args - Arguments to find a Divisi
     * @example
     * // Get one Divisi
     * const divisi = await prisma.divisi.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DivisiFindFirstOrThrowArgs>(args?: SelectSubset<T, DivisiFindFirstOrThrowArgs<ExtArgs>>): Prisma__DivisiClient<$Result.GetResult<Prisma.$DivisiPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Divisis that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DivisiFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Divisis
     * const divisis = await prisma.divisi.findMany()
     * 
     * // Get first 10 Divisis
     * const divisis = await prisma.divisi.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const divisiWithIdOnly = await prisma.divisi.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DivisiFindManyArgs>(args?: SelectSubset<T, DivisiFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DivisiPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Divisi.
     * @param {DivisiCreateArgs} args - Arguments to create a Divisi.
     * @example
     * // Create one Divisi
     * const Divisi = await prisma.divisi.create({
     *   data: {
     *     // ... data to create a Divisi
     *   }
     * })
     * 
     */
    create<T extends DivisiCreateArgs>(args: SelectSubset<T, DivisiCreateArgs<ExtArgs>>): Prisma__DivisiClient<$Result.GetResult<Prisma.$DivisiPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Divisis.
     * @param {DivisiCreateManyArgs} args - Arguments to create many Divisis.
     * @example
     * // Create many Divisis
     * const divisi = await prisma.divisi.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DivisiCreateManyArgs>(args?: SelectSubset<T, DivisiCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Divisi.
     * @param {DivisiDeleteArgs} args - Arguments to delete one Divisi.
     * @example
     * // Delete one Divisi
     * const Divisi = await prisma.divisi.delete({
     *   where: {
     *     // ... filter to delete one Divisi
     *   }
     * })
     * 
     */
    delete<T extends DivisiDeleteArgs>(args: SelectSubset<T, DivisiDeleteArgs<ExtArgs>>): Prisma__DivisiClient<$Result.GetResult<Prisma.$DivisiPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Divisi.
     * @param {DivisiUpdateArgs} args - Arguments to update one Divisi.
     * @example
     * // Update one Divisi
     * const divisi = await prisma.divisi.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DivisiUpdateArgs>(args: SelectSubset<T, DivisiUpdateArgs<ExtArgs>>): Prisma__DivisiClient<$Result.GetResult<Prisma.$DivisiPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Divisis.
     * @param {DivisiDeleteManyArgs} args - Arguments to filter Divisis to delete.
     * @example
     * // Delete a few Divisis
     * const { count } = await prisma.divisi.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DivisiDeleteManyArgs>(args?: SelectSubset<T, DivisiDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Divisis.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DivisiUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Divisis
     * const divisi = await prisma.divisi.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DivisiUpdateManyArgs>(args: SelectSubset<T, DivisiUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Divisi.
     * @param {DivisiUpsertArgs} args - Arguments to update or create a Divisi.
     * @example
     * // Update or create a Divisi
     * const divisi = await prisma.divisi.upsert({
     *   create: {
     *     // ... data to create a Divisi
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Divisi we want to update
     *   }
     * })
     */
    upsert<T extends DivisiUpsertArgs>(args: SelectSubset<T, DivisiUpsertArgs<ExtArgs>>): Prisma__DivisiClient<$Result.GetResult<Prisma.$DivisiPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Divisis.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DivisiCountArgs} args - Arguments to filter Divisis to count.
     * @example
     * // Count the number of Divisis
     * const count = await prisma.divisi.count({
     *   where: {
     *     // ... the filter for the Divisis we want to count
     *   }
     * })
    **/
    count<T extends DivisiCountArgs>(
      args?: Subset<T, DivisiCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DivisiCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Divisi.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DivisiAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DivisiAggregateArgs>(args: Subset<T, DivisiAggregateArgs>): Prisma.PrismaPromise<GetDivisiAggregateType<T>>

    /**
     * Group by Divisi.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DivisiGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DivisiGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DivisiGroupByArgs['orderBy'] }
        : { orderBy?: DivisiGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DivisiGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDivisiGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Divisi model
   */
  readonly fields: DivisiFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Divisi.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DivisiClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    users<T extends Divisi$usersArgs<ExtArgs> = {}>(args?: Subset<T, Divisi$usersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Divisi model
   */ 
  interface DivisiFieldRefs {
    readonly id: FieldRef<"Divisi", 'String'>
    readonly name: FieldRef<"Divisi", 'String'>
    readonly description: FieldRef<"Divisi", 'String'>
    readonly createdAt: FieldRef<"Divisi", 'DateTime'>
    readonly updatedAt: FieldRef<"Divisi", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Divisi findUnique
   */
  export type DivisiFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Divisi
     */
    select?: DivisiSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DivisiInclude<ExtArgs> | null
    /**
     * Filter, which Divisi to fetch.
     */
    where: DivisiWhereUniqueInput
  }

  /**
   * Divisi findUniqueOrThrow
   */
  export type DivisiFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Divisi
     */
    select?: DivisiSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DivisiInclude<ExtArgs> | null
    /**
     * Filter, which Divisi to fetch.
     */
    where: DivisiWhereUniqueInput
  }

  /**
   * Divisi findFirst
   */
  export type DivisiFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Divisi
     */
    select?: DivisiSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DivisiInclude<ExtArgs> | null
    /**
     * Filter, which Divisi to fetch.
     */
    where?: DivisiWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Divisis to fetch.
     */
    orderBy?: DivisiOrderByWithRelationInput | DivisiOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Divisis.
     */
    cursor?: DivisiWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Divisis from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Divisis.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Divisis.
     */
    distinct?: DivisiScalarFieldEnum | DivisiScalarFieldEnum[]
  }

  /**
   * Divisi findFirstOrThrow
   */
  export type DivisiFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Divisi
     */
    select?: DivisiSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DivisiInclude<ExtArgs> | null
    /**
     * Filter, which Divisi to fetch.
     */
    where?: DivisiWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Divisis to fetch.
     */
    orderBy?: DivisiOrderByWithRelationInput | DivisiOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Divisis.
     */
    cursor?: DivisiWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Divisis from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Divisis.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Divisis.
     */
    distinct?: DivisiScalarFieldEnum | DivisiScalarFieldEnum[]
  }

  /**
   * Divisi findMany
   */
  export type DivisiFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Divisi
     */
    select?: DivisiSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DivisiInclude<ExtArgs> | null
    /**
     * Filter, which Divisis to fetch.
     */
    where?: DivisiWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Divisis to fetch.
     */
    orderBy?: DivisiOrderByWithRelationInput | DivisiOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Divisis.
     */
    cursor?: DivisiWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Divisis from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Divisis.
     */
    skip?: number
    distinct?: DivisiScalarFieldEnum | DivisiScalarFieldEnum[]
  }

  /**
   * Divisi create
   */
  export type DivisiCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Divisi
     */
    select?: DivisiSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DivisiInclude<ExtArgs> | null
    /**
     * The data needed to create a Divisi.
     */
    data: XOR<DivisiCreateInput, DivisiUncheckedCreateInput>
  }

  /**
   * Divisi createMany
   */
  export type DivisiCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Divisis.
     */
    data: DivisiCreateManyInput | DivisiCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Divisi update
   */
  export type DivisiUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Divisi
     */
    select?: DivisiSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DivisiInclude<ExtArgs> | null
    /**
     * The data needed to update a Divisi.
     */
    data: XOR<DivisiUpdateInput, DivisiUncheckedUpdateInput>
    /**
     * Choose, which Divisi to update.
     */
    where: DivisiWhereUniqueInput
  }

  /**
   * Divisi updateMany
   */
  export type DivisiUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Divisis.
     */
    data: XOR<DivisiUpdateManyMutationInput, DivisiUncheckedUpdateManyInput>
    /**
     * Filter which Divisis to update
     */
    where?: DivisiWhereInput
  }

  /**
   * Divisi upsert
   */
  export type DivisiUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Divisi
     */
    select?: DivisiSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DivisiInclude<ExtArgs> | null
    /**
     * The filter to search for the Divisi to update in case it exists.
     */
    where: DivisiWhereUniqueInput
    /**
     * In case the Divisi found by the `where` argument doesn't exist, create a new Divisi with this data.
     */
    create: XOR<DivisiCreateInput, DivisiUncheckedCreateInput>
    /**
     * In case the Divisi was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DivisiUpdateInput, DivisiUncheckedUpdateInput>
  }

  /**
   * Divisi delete
   */
  export type DivisiDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Divisi
     */
    select?: DivisiSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DivisiInclude<ExtArgs> | null
    /**
     * Filter which Divisi to delete.
     */
    where: DivisiWhereUniqueInput
  }

  /**
   * Divisi deleteMany
   */
  export type DivisiDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Divisis to delete
     */
    where?: DivisiWhereInput
  }

  /**
   * Divisi.users
   */
  export type Divisi$usersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    cursor?: UserWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * Divisi without action
   */
  export type DivisiDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Divisi
     */
    select?: DivisiSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DivisiInclude<ExtArgs> | null
  }


  /**
   * Model Absensi
   */

  export type AggregateAbsensi = {
    _count: AbsensiCountAggregateOutputType | null
    _min: AbsensiMinAggregateOutputType | null
    _max: AbsensiMaxAggregateOutputType | null
  }

  export type AbsensiMinAggregateOutputType = {
    id: string | null
    userId: string | null
    date: Date | null
    checkIn: Date | null
    checkOut: Date | null
    status: $Enums.AttendanceStatus | null
    location: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AbsensiMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    date: Date | null
    checkIn: Date | null
    checkOut: Date | null
    status: $Enums.AttendanceStatus | null
    location: string | null
    notes: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type AbsensiCountAggregateOutputType = {
    id: number
    userId: number
    date: number
    checkIn: number
    checkOut: number
    status: number
    location: number
    notes: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type AbsensiMinAggregateInputType = {
    id?: true
    userId?: true
    date?: true
    checkIn?: true
    checkOut?: true
    status?: true
    location?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AbsensiMaxAggregateInputType = {
    id?: true
    userId?: true
    date?: true
    checkIn?: true
    checkOut?: true
    status?: true
    location?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
  }

  export type AbsensiCountAggregateInputType = {
    id?: true
    userId?: true
    date?: true
    checkIn?: true
    checkOut?: true
    status?: true
    location?: true
    notes?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type AbsensiAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Absensi to aggregate.
     */
    where?: AbsensiWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Absensis to fetch.
     */
    orderBy?: AbsensiOrderByWithRelationInput | AbsensiOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AbsensiWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Absensis from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Absensis.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Absensis
    **/
    _count?: true | AbsensiCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AbsensiMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AbsensiMaxAggregateInputType
  }

  export type GetAbsensiAggregateType<T extends AbsensiAggregateArgs> = {
        [P in keyof T & keyof AggregateAbsensi]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAbsensi[P]>
      : GetScalarType<T[P], AggregateAbsensi[P]>
  }




  export type AbsensiGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AbsensiWhereInput
    orderBy?: AbsensiOrderByWithAggregationInput | AbsensiOrderByWithAggregationInput[]
    by: AbsensiScalarFieldEnum[] | AbsensiScalarFieldEnum
    having?: AbsensiScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AbsensiCountAggregateInputType | true
    _min?: AbsensiMinAggregateInputType
    _max?: AbsensiMaxAggregateInputType
  }

  export type AbsensiGroupByOutputType = {
    id: string
    userId: string
    date: Date
    checkIn: Date | null
    checkOut: Date | null
    status: $Enums.AttendanceStatus
    location: string | null
    notes: string | null
    createdAt: Date
    updatedAt: Date
    _count: AbsensiCountAggregateOutputType | null
    _min: AbsensiMinAggregateOutputType | null
    _max: AbsensiMaxAggregateOutputType | null
  }

  type GetAbsensiGroupByPayload<T extends AbsensiGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AbsensiGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AbsensiGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AbsensiGroupByOutputType[P]>
            : GetScalarType<T[P], AbsensiGroupByOutputType[P]>
        }
      >
    >


  export type AbsensiSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    date?: boolean
    checkIn?: boolean
    checkOut?: boolean
    status?: boolean
    location?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["absensi"]>


  export type AbsensiSelectScalar = {
    id?: boolean
    userId?: boolean
    date?: boolean
    checkIn?: boolean
    checkOut?: boolean
    status?: boolean
    location?: boolean
    notes?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type AbsensiInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $AbsensiPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Absensi"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      date: Date
      checkIn: Date | null
      checkOut: Date | null
      status: $Enums.AttendanceStatus
      location: string | null
      notes: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["absensi"]>
    composites: {}
  }

  type AbsensiGetPayload<S extends boolean | null | undefined | AbsensiDefaultArgs> = $Result.GetResult<Prisma.$AbsensiPayload, S>

  type AbsensiCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<AbsensiFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: AbsensiCountAggregateInputType | true
    }

  export interface AbsensiDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Absensi'], meta: { name: 'Absensi' } }
    /**
     * Find zero or one Absensi that matches the filter.
     * @param {AbsensiFindUniqueArgs} args - Arguments to find a Absensi
     * @example
     * // Get one Absensi
     * const absensi = await prisma.absensi.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AbsensiFindUniqueArgs>(args: SelectSubset<T, AbsensiFindUniqueArgs<ExtArgs>>): Prisma__AbsensiClient<$Result.GetResult<Prisma.$AbsensiPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Absensi that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {AbsensiFindUniqueOrThrowArgs} args - Arguments to find a Absensi
     * @example
     * // Get one Absensi
     * const absensi = await prisma.absensi.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AbsensiFindUniqueOrThrowArgs>(args: SelectSubset<T, AbsensiFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AbsensiClient<$Result.GetResult<Prisma.$AbsensiPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Absensi that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AbsensiFindFirstArgs} args - Arguments to find a Absensi
     * @example
     * // Get one Absensi
     * const absensi = await prisma.absensi.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AbsensiFindFirstArgs>(args?: SelectSubset<T, AbsensiFindFirstArgs<ExtArgs>>): Prisma__AbsensiClient<$Result.GetResult<Prisma.$AbsensiPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Absensi that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AbsensiFindFirstOrThrowArgs} args - Arguments to find a Absensi
     * @example
     * // Get one Absensi
     * const absensi = await prisma.absensi.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AbsensiFindFirstOrThrowArgs>(args?: SelectSubset<T, AbsensiFindFirstOrThrowArgs<ExtArgs>>): Prisma__AbsensiClient<$Result.GetResult<Prisma.$AbsensiPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Absensis that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AbsensiFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Absensis
     * const absensis = await prisma.absensi.findMany()
     * 
     * // Get first 10 Absensis
     * const absensis = await prisma.absensi.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const absensiWithIdOnly = await prisma.absensi.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AbsensiFindManyArgs>(args?: SelectSubset<T, AbsensiFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AbsensiPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Absensi.
     * @param {AbsensiCreateArgs} args - Arguments to create a Absensi.
     * @example
     * // Create one Absensi
     * const Absensi = await prisma.absensi.create({
     *   data: {
     *     // ... data to create a Absensi
     *   }
     * })
     * 
     */
    create<T extends AbsensiCreateArgs>(args: SelectSubset<T, AbsensiCreateArgs<ExtArgs>>): Prisma__AbsensiClient<$Result.GetResult<Prisma.$AbsensiPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Absensis.
     * @param {AbsensiCreateManyArgs} args - Arguments to create many Absensis.
     * @example
     * // Create many Absensis
     * const absensi = await prisma.absensi.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AbsensiCreateManyArgs>(args?: SelectSubset<T, AbsensiCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Absensi.
     * @param {AbsensiDeleteArgs} args - Arguments to delete one Absensi.
     * @example
     * // Delete one Absensi
     * const Absensi = await prisma.absensi.delete({
     *   where: {
     *     // ... filter to delete one Absensi
     *   }
     * })
     * 
     */
    delete<T extends AbsensiDeleteArgs>(args: SelectSubset<T, AbsensiDeleteArgs<ExtArgs>>): Prisma__AbsensiClient<$Result.GetResult<Prisma.$AbsensiPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Absensi.
     * @param {AbsensiUpdateArgs} args - Arguments to update one Absensi.
     * @example
     * // Update one Absensi
     * const absensi = await prisma.absensi.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AbsensiUpdateArgs>(args: SelectSubset<T, AbsensiUpdateArgs<ExtArgs>>): Prisma__AbsensiClient<$Result.GetResult<Prisma.$AbsensiPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Absensis.
     * @param {AbsensiDeleteManyArgs} args - Arguments to filter Absensis to delete.
     * @example
     * // Delete a few Absensis
     * const { count } = await prisma.absensi.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AbsensiDeleteManyArgs>(args?: SelectSubset<T, AbsensiDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Absensis.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AbsensiUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Absensis
     * const absensi = await prisma.absensi.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AbsensiUpdateManyArgs>(args: SelectSubset<T, AbsensiUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Absensi.
     * @param {AbsensiUpsertArgs} args - Arguments to update or create a Absensi.
     * @example
     * // Update or create a Absensi
     * const absensi = await prisma.absensi.upsert({
     *   create: {
     *     // ... data to create a Absensi
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Absensi we want to update
     *   }
     * })
     */
    upsert<T extends AbsensiUpsertArgs>(args: SelectSubset<T, AbsensiUpsertArgs<ExtArgs>>): Prisma__AbsensiClient<$Result.GetResult<Prisma.$AbsensiPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Absensis.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AbsensiCountArgs} args - Arguments to filter Absensis to count.
     * @example
     * // Count the number of Absensis
     * const count = await prisma.absensi.count({
     *   where: {
     *     // ... the filter for the Absensis we want to count
     *   }
     * })
    **/
    count<T extends AbsensiCountArgs>(
      args?: Subset<T, AbsensiCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AbsensiCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Absensi.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AbsensiAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AbsensiAggregateArgs>(args: Subset<T, AbsensiAggregateArgs>): Prisma.PrismaPromise<GetAbsensiAggregateType<T>>

    /**
     * Group by Absensi.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AbsensiGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AbsensiGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AbsensiGroupByArgs['orderBy'] }
        : { orderBy?: AbsensiGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AbsensiGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAbsensiGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Absensi model
   */
  readonly fields: AbsensiFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Absensi.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AbsensiClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Absensi model
   */ 
  interface AbsensiFieldRefs {
    readonly id: FieldRef<"Absensi", 'String'>
    readonly userId: FieldRef<"Absensi", 'String'>
    readonly date: FieldRef<"Absensi", 'DateTime'>
    readonly checkIn: FieldRef<"Absensi", 'DateTime'>
    readonly checkOut: FieldRef<"Absensi", 'DateTime'>
    readonly status: FieldRef<"Absensi", 'AttendanceStatus'>
    readonly location: FieldRef<"Absensi", 'String'>
    readonly notes: FieldRef<"Absensi", 'String'>
    readonly createdAt: FieldRef<"Absensi", 'DateTime'>
    readonly updatedAt: FieldRef<"Absensi", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Absensi findUnique
   */
  export type AbsensiFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Absensi
     */
    select?: AbsensiSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AbsensiInclude<ExtArgs> | null
    /**
     * Filter, which Absensi to fetch.
     */
    where: AbsensiWhereUniqueInput
  }

  /**
   * Absensi findUniqueOrThrow
   */
  export type AbsensiFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Absensi
     */
    select?: AbsensiSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AbsensiInclude<ExtArgs> | null
    /**
     * Filter, which Absensi to fetch.
     */
    where: AbsensiWhereUniqueInput
  }

  /**
   * Absensi findFirst
   */
  export type AbsensiFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Absensi
     */
    select?: AbsensiSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AbsensiInclude<ExtArgs> | null
    /**
     * Filter, which Absensi to fetch.
     */
    where?: AbsensiWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Absensis to fetch.
     */
    orderBy?: AbsensiOrderByWithRelationInput | AbsensiOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Absensis.
     */
    cursor?: AbsensiWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Absensis from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Absensis.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Absensis.
     */
    distinct?: AbsensiScalarFieldEnum | AbsensiScalarFieldEnum[]
  }

  /**
   * Absensi findFirstOrThrow
   */
  export type AbsensiFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Absensi
     */
    select?: AbsensiSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AbsensiInclude<ExtArgs> | null
    /**
     * Filter, which Absensi to fetch.
     */
    where?: AbsensiWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Absensis to fetch.
     */
    orderBy?: AbsensiOrderByWithRelationInput | AbsensiOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Absensis.
     */
    cursor?: AbsensiWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Absensis from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Absensis.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Absensis.
     */
    distinct?: AbsensiScalarFieldEnum | AbsensiScalarFieldEnum[]
  }

  /**
   * Absensi findMany
   */
  export type AbsensiFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Absensi
     */
    select?: AbsensiSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AbsensiInclude<ExtArgs> | null
    /**
     * Filter, which Absensis to fetch.
     */
    where?: AbsensiWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Absensis to fetch.
     */
    orderBy?: AbsensiOrderByWithRelationInput | AbsensiOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Absensis.
     */
    cursor?: AbsensiWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Absensis from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Absensis.
     */
    skip?: number
    distinct?: AbsensiScalarFieldEnum | AbsensiScalarFieldEnum[]
  }

  /**
   * Absensi create
   */
  export type AbsensiCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Absensi
     */
    select?: AbsensiSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AbsensiInclude<ExtArgs> | null
    /**
     * The data needed to create a Absensi.
     */
    data: XOR<AbsensiCreateInput, AbsensiUncheckedCreateInput>
  }

  /**
   * Absensi createMany
   */
  export type AbsensiCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Absensis.
     */
    data: AbsensiCreateManyInput | AbsensiCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Absensi update
   */
  export type AbsensiUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Absensi
     */
    select?: AbsensiSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AbsensiInclude<ExtArgs> | null
    /**
     * The data needed to update a Absensi.
     */
    data: XOR<AbsensiUpdateInput, AbsensiUncheckedUpdateInput>
    /**
     * Choose, which Absensi to update.
     */
    where: AbsensiWhereUniqueInput
  }

  /**
   * Absensi updateMany
   */
  export type AbsensiUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Absensis.
     */
    data: XOR<AbsensiUpdateManyMutationInput, AbsensiUncheckedUpdateManyInput>
    /**
     * Filter which Absensis to update
     */
    where?: AbsensiWhereInput
  }

  /**
   * Absensi upsert
   */
  export type AbsensiUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Absensi
     */
    select?: AbsensiSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AbsensiInclude<ExtArgs> | null
    /**
     * The filter to search for the Absensi to update in case it exists.
     */
    where: AbsensiWhereUniqueInput
    /**
     * In case the Absensi found by the `where` argument doesn't exist, create a new Absensi with this data.
     */
    create: XOR<AbsensiCreateInput, AbsensiUncheckedCreateInput>
    /**
     * In case the Absensi was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AbsensiUpdateInput, AbsensiUncheckedUpdateInput>
  }

  /**
   * Absensi delete
   */
  export type AbsensiDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Absensi
     */
    select?: AbsensiSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AbsensiInclude<ExtArgs> | null
    /**
     * Filter which Absensi to delete.
     */
    where: AbsensiWhereUniqueInput
  }

  /**
   * Absensi deleteMany
   */
  export type AbsensiDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Absensis to delete
     */
    where?: AbsensiWhereInput
  }

  /**
   * Absensi without action
   */
  export type AbsensiDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Absensi
     */
    select?: AbsensiSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: AbsensiInclude<ExtArgs> | null
  }


  /**
   * Model Izin
   */

  export type AggregateIzin = {
    _count: IzinCountAggregateOutputType | null
    _min: IzinMinAggregateOutputType | null
    _max: IzinMaxAggregateOutputType | null
  }

  export type IzinMinAggregateOutputType = {
    id: string | null
    userId: string | null
    startDate: Date | null
    endDate: Date | null
    type: $Enums.IzinType | null
    reason: string | null
    attachment: string | null
    status: $Enums.IzinStatus | null
    approvedBy: string | null
    approvedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type IzinMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    startDate: Date | null
    endDate: Date | null
    type: $Enums.IzinType | null
    reason: string | null
    attachment: string | null
    status: $Enums.IzinStatus | null
    approvedBy: string | null
    approvedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type IzinCountAggregateOutputType = {
    id: number
    userId: number
    startDate: number
    endDate: number
    type: number
    reason: number
    attachment: number
    status: number
    approvedBy: number
    approvedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type IzinMinAggregateInputType = {
    id?: true
    userId?: true
    startDate?: true
    endDate?: true
    type?: true
    reason?: true
    attachment?: true
    status?: true
    approvedBy?: true
    approvedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type IzinMaxAggregateInputType = {
    id?: true
    userId?: true
    startDate?: true
    endDate?: true
    type?: true
    reason?: true
    attachment?: true
    status?: true
    approvedBy?: true
    approvedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type IzinCountAggregateInputType = {
    id?: true
    userId?: true
    startDate?: true
    endDate?: true
    type?: true
    reason?: true
    attachment?: true
    status?: true
    approvedBy?: true
    approvedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type IzinAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Izin to aggregate.
     */
    where?: IzinWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Izins to fetch.
     */
    orderBy?: IzinOrderByWithRelationInput | IzinOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: IzinWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Izins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Izins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Izins
    **/
    _count?: true | IzinCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: IzinMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: IzinMaxAggregateInputType
  }

  export type GetIzinAggregateType<T extends IzinAggregateArgs> = {
        [P in keyof T & keyof AggregateIzin]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateIzin[P]>
      : GetScalarType<T[P], AggregateIzin[P]>
  }




  export type IzinGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: IzinWhereInput
    orderBy?: IzinOrderByWithAggregationInput | IzinOrderByWithAggregationInput[]
    by: IzinScalarFieldEnum[] | IzinScalarFieldEnum
    having?: IzinScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: IzinCountAggregateInputType | true
    _min?: IzinMinAggregateInputType
    _max?: IzinMaxAggregateInputType
  }

  export type IzinGroupByOutputType = {
    id: string
    userId: string
    startDate: Date
    endDate: Date
    type: $Enums.IzinType
    reason: string
    attachment: string | null
    status: $Enums.IzinStatus
    approvedBy: string | null
    approvedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: IzinCountAggregateOutputType | null
    _min: IzinMinAggregateOutputType | null
    _max: IzinMaxAggregateOutputType | null
  }

  type GetIzinGroupByPayload<T extends IzinGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<IzinGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof IzinGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], IzinGroupByOutputType[P]>
            : GetScalarType<T[P], IzinGroupByOutputType[P]>
        }
      >
    >


  export type IzinSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    startDate?: boolean
    endDate?: boolean
    type?: boolean
    reason?: boolean
    attachment?: boolean
    status?: boolean
    approvedBy?: boolean
    approvedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["izin"]>


  export type IzinSelectScalar = {
    id?: boolean
    userId?: boolean
    startDate?: boolean
    endDate?: boolean
    type?: boolean
    reason?: boolean
    attachment?: boolean
    status?: boolean
    approvedBy?: boolean
    approvedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type IzinInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $IzinPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Izin"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      startDate: Date
      endDate: Date
      type: $Enums.IzinType
      reason: string
      attachment: string | null
      status: $Enums.IzinStatus
      approvedBy: string | null
      approvedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["izin"]>
    composites: {}
  }

  type IzinGetPayload<S extends boolean | null | undefined | IzinDefaultArgs> = $Result.GetResult<Prisma.$IzinPayload, S>

  type IzinCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<IzinFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: IzinCountAggregateInputType | true
    }

  export interface IzinDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Izin'], meta: { name: 'Izin' } }
    /**
     * Find zero or one Izin that matches the filter.
     * @param {IzinFindUniqueArgs} args - Arguments to find a Izin
     * @example
     * // Get one Izin
     * const izin = await prisma.izin.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends IzinFindUniqueArgs>(args: SelectSubset<T, IzinFindUniqueArgs<ExtArgs>>): Prisma__IzinClient<$Result.GetResult<Prisma.$IzinPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Izin that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {IzinFindUniqueOrThrowArgs} args - Arguments to find a Izin
     * @example
     * // Get one Izin
     * const izin = await prisma.izin.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends IzinFindUniqueOrThrowArgs>(args: SelectSubset<T, IzinFindUniqueOrThrowArgs<ExtArgs>>): Prisma__IzinClient<$Result.GetResult<Prisma.$IzinPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Izin that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IzinFindFirstArgs} args - Arguments to find a Izin
     * @example
     * // Get one Izin
     * const izin = await prisma.izin.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends IzinFindFirstArgs>(args?: SelectSubset<T, IzinFindFirstArgs<ExtArgs>>): Prisma__IzinClient<$Result.GetResult<Prisma.$IzinPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Izin that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IzinFindFirstOrThrowArgs} args - Arguments to find a Izin
     * @example
     * // Get one Izin
     * const izin = await prisma.izin.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends IzinFindFirstOrThrowArgs>(args?: SelectSubset<T, IzinFindFirstOrThrowArgs<ExtArgs>>): Prisma__IzinClient<$Result.GetResult<Prisma.$IzinPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Izins that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IzinFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Izins
     * const izins = await prisma.izin.findMany()
     * 
     * // Get first 10 Izins
     * const izins = await prisma.izin.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const izinWithIdOnly = await prisma.izin.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends IzinFindManyArgs>(args?: SelectSubset<T, IzinFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$IzinPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Izin.
     * @param {IzinCreateArgs} args - Arguments to create a Izin.
     * @example
     * // Create one Izin
     * const Izin = await prisma.izin.create({
     *   data: {
     *     // ... data to create a Izin
     *   }
     * })
     * 
     */
    create<T extends IzinCreateArgs>(args: SelectSubset<T, IzinCreateArgs<ExtArgs>>): Prisma__IzinClient<$Result.GetResult<Prisma.$IzinPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Izins.
     * @param {IzinCreateManyArgs} args - Arguments to create many Izins.
     * @example
     * // Create many Izins
     * const izin = await prisma.izin.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends IzinCreateManyArgs>(args?: SelectSubset<T, IzinCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Izin.
     * @param {IzinDeleteArgs} args - Arguments to delete one Izin.
     * @example
     * // Delete one Izin
     * const Izin = await prisma.izin.delete({
     *   where: {
     *     // ... filter to delete one Izin
     *   }
     * })
     * 
     */
    delete<T extends IzinDeleteArgs>(args: SelectSubset<T, IzinDeleteArgs<ExtArgs>>): Prisma__IzinClient<$Result.GetResult<Prisma.$IzinPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Izin.
     * @param {IzinUpdateArgs} args - Arguments to update one Izin.
     * @example
     * // Update one Izin
     * const izin = await prisma.izin.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends IzinUpdateArgs>(args: SelectSubset<T, IzinUpdateArgs<ExtArgs>>): Prisma__IzinClient<$Result.GetResult<Prisma.$IzinPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Izins.
     * @param {IzinDeleteManyArgs} args - Arguments to filter Izins to delete.
     * @example
     * // Delete a few Izins
     * const { count } = await prisma.izin.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends IzinDeleteManyArgs>(args?: SelectSubset<T, IzinDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Izins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IzinUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Izins
     * const izin = await prisma.izin.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends IzinUpdateManyArgs>(args: SelectSubset<T, IzinUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Izin.
     * @param {IzinUpsertArgs} args - Arguments to update or create a Izin.
     * @example
     * // Update or create a Izin
     * const izin = await prisma.izin.upsert({
     *   create: {
     *     // ... data to create a Izin
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Izin we want to update
     *   }
     * })
     */
    upsert<T extends IzinUpsertArgs>(args: SelectSubset<T, IzinUpsertArgs<ExtArgs>>): Prisma__IzinClient<$Result.GetResult<Prisma.$IzinPayload<ExtArgs>, T, "upsert">, never, ExtArgs>


    /**
     * Count the number of Izins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IzinCountArgs} args - Arguments to filter Izins to count.
     * @example
     * // Count the number of Izins
     * const count = await prisma.izin.count({
     *   where: {
     *     // ... the filter for the Izins we want to count
     *   }
     * })
    **/
    count<T extends IzinCountArgs>(
      args?: Subset<T, IzinCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], IzinCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Izin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IzinAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends IzinAggregateArgs>(args: Subset<T, IzinAggregateArgs>): Prisma.PrismaPromise<GetIzinAggregateType<T>>

    /**
     * Group by Izin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {IzinGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends IzinGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: IzinGroupByArgs['orderBy'] }
        : { orderBy?: IzinGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, IzinGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetIzinGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Izin model
   */
  readonly fields: IzinFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Izin.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__IzinClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Izin model
   */ 
  interface IzinFieldRefs {
    readonly id: FieldRef<"Izin", 'String'>
    readonly userId: FieldRef<"Izin", 'String'>
    readonly startDate: FieldRef<"Izin", 'DateTime'>
    readonly endDate: FieldRef<"Izin", 'DateTime'>
    readonly type: FieldRef<"Izin", 'IzinType'>
    readonly reason: FieldRef<"Izin", 'String'>
    readonly attachment: FieldRef<"Izin", 'String'>
    readonly status: FieldRef<"Izin", 'IzinStatus'>
    readonly approvedBy: FieldRef<"Izin", 'String'>
    readonly approvedAt: FieldRef<"Izin", 'DateTime'>
    readonly createdAt: FieldRef<"Izin", 'DateTime'>
    readonly updatedAt: FieldRef<"Izin", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Izin findUnique
   */
  export type IzinFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Izin
     */
    select?: IzinSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IzinInclude<ExtArgs> | null
    /**
     * Filter, which Izin to fetch.
     */
    where: IzinWhereUniqueInput
  }

  /**
   * Izin findUniqueOrThrow
   */
  export type IzinFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Izin
     */
    select?: IzinSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IzinInclude<ExtArgs> | null
    /**
     * Filter, which Izin to fetch.
     */
    where: IzinWhereUniqueInput
  }

  /**
   * Izin findFirst
   */
  export type IzinFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Izin
     */
    select?: IzinSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IzinInclude<ExtArgs> | null
    /**
     * Filter, which Izin to fetch.
     */
    where?: IzinWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Izins to fetch.
     */
    orderBy?: IzinOrderByWithRelationInput | IzinOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Izins.
     */
    cursor?: IzinWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Izins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Izins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Izins.
     */
    distinct?: IzinScalarFieldEnum | IzinScalarFieldEnum[]
  }

  /**
   * Izin findFirstOrThrow
   */
  export type IzinFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Izin
     */
    select?: IzinSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IzinInclude<ExtArgs> | null
    /**
     * Filter, which Izin to fetch.
     */
    where?: IzinWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Izins to fetch.
     */
    orderBy?: IzinOrderByWithRelationInput | IzinOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Izins.
     */
    cursor?: IzinWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Izins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Izins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Izins.
     */
    distinct?: IzinScalarFieldEnum | IzinScalarFieldEnum[]
  }

  /**
   * Izin findMany
   */
  export type IzinFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Izin
     */
    select?: IzinSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IzinInclude<ExtArgs> | null
    /**
     * Filter, which Izins to fetch.
     */
    where?: IzinWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Izins to fetch.
     */
    orderBy?: IzinOrderByWithRelationInput | IzinOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Izins.
     */
    cursor?: IzinWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Izins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Izins.
     */
    skip?: number
    distinct?: IzinScalarFieldEnum | IzinScalarFieldEnum[]
  }

  /**
   * Izin create
   */
  export type IzinCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Izin
     */
    select?: IzinSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IzinInclude<ExtArgs> | null
    /**
     * The data needed to create a Izin.
     */
    data: XOR<IzinCreateInput, IzinUncheckedCreateInput>
  }

  /**
   * Izin createMany
   */
  export type IzinCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Izins.
     */
    data: IzinCreateManyInput | IzinCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Izin update
   */
  export type IzinUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Izin
     */
    select?: IzinSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IzinInclude<ExtArgs> | null
    /**
     * The data needed to update a Izin.
     */
    data: XOR<IzinUpdateInput, IzinUncheckedUpdateInput>
    /**
     * Choose, which Izin to update.
     */
    where: IzinWhereUniqueInput
  }

  /**
   * Izin updateMany
   */
  export type IzinUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Izins.
     */
    data: XOR<IzinUpdateManyMutationInput, IzinUncheckedUpdateManyInput>
    /**
     * Filter which Izins to update
     */
    where?: IzinWhereInput
  }

  /**
   * Izin upsert
   */
  export type IzinUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Izin
     */
    select?: IzinSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IzinInclude<ExtArgs> | null
    /**
     * The filter to search for the Izin to update in case it exists.
     */
    where: IzinWhereUniqueInput
    /**
     * In case the Izin found by the `where` argument doesn't exist, create a new Izin with this data.
     */
    create: XOR<IzinCreateInput, IzinUncheckedCreateInput>
    /**
     * In case the Izin was found with the provided `where` argument, update it with this data.
     */
    update: XOR<IzinUpdateInput, IzinUncheckedUpdateInput>
  }

  /**
   * Izin delete
   */
  export type IzinDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Izin
     */
    select?: IzinSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IzinInclude<ExtArgs> | null
    /**
     * Filter which Izin to delete.
     */
    where: IzinWhereUniqueInput
  }

  /**
   * Izin deleteMany
   */
  export type IzinDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Izins to delete
     */
    where?: IzinWhereInput
  }

  /**
   * Izin without action
   */
  export type IzinDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Izin
     */
    select?: IzinSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: IzinInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    username: 'username',
    password: 'password',
    fullName: 'fullName',
    email: 'email',
    phone: 'phone',
    role: 'role',
    divisiId: 'divisiId',
    avatar: 'avatar',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const DivisiScalarFieldEnum: {
    id: 'id',
    name: 'name',
    description: 'description',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DivisiScalarFieldEnum = (typeof DivisiScalarFieldEnum)[keyof typeof DivisiScalarFieldEnum]


  export const AbsensiScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    date: 'date',
    checkIn: 'checkIn',
    checkOut: 'checkOut',
    status: 'status',
    location: 'location',
    notes: 'notes',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type AbsensiScalarFieldEnum = (typeof AbsensiScalarFieldEnum)[keyof typeof AbsensiScalarFieldEnum]


  export const IzinScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    startDate: 'startDate',
    endDate: 'endDate',
    type: 'type',
    reason: 'reason',
    attachment: 'attachment',
    status: 'status',
    approvedBy: 'approvedBy',
    approvedAt: 'approvedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type IzinScalarFieldEnum = (typeof IzinScalarFieldEnum)[keyof typeof IzinScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'AttendanceStatus'
   */
  export type EnumAttendanceStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AttendanceStatus'>
    


  /**
   * Reference to a field of type 'IzinType'
   */
  export type EnumIzinTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'IzinType'>
    


  /**
   * Reference to a field of type 'IzinStatus'
   */
  export type EnumIzinStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'IzinStatus'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    username?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    fullName?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    phone?: StringNullableFilter<"User"> | string | null
    role?: EnumRoleFilter<"User"> | $Enums.Role
    divisiId?: StringNullableFilter<"User"> | string | null
    avatar?: StringNullableFilter<"User"> | string | null
    isActive?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    divisi?: XOR<DivisiNullableRelationFilter, DivisiWhereInput> | null
    absensi?: AbsensiListRelationFilter
    izin?: IzinListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
    fullName?: SortOrder
    email?: SortOrder
    phone?: SortOrderInput | SortOrder
    role?: SortOrder
    divisiId?: SortOrderInput | SortOrder
    avatar?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    divisi?: DivisiOrderByWithRelationInput
    absensi?: AbsensiOrderByRelationAggregateInput
    izin?: IzinOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    username?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    password?: StringFilter<"User"> | string
    fullName?: StringFilter<"User"> | string
    phone?: StringNullableFilter<"User"> | string | null
    role?: EnumRoleFilter<"User"> | $Enums.Role
    divisiId?: StringNullableFilter<"User"> | string | null
    avatar?: StringNullableFilter<"User"> | string | null
    isActive?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    divisi?: XOR<DivisiNullableRelationFilter, DivisiWhereInput> | null
    absensi?: AbsensiListRelationFilter
    izin?: IzinListRelationFilter
  }, "id" | "username" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
    fullName?: SortOrder
    email?: SortOrder
    phone?: SortOrderInput | SortOrder
    role?: SortOrder
    divisiId?: SortOrderInput | SortOrder
    avatar?: SortOrderInput | SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    username?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    fullName?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    phone?: StringNullableWithAggregatesFilter<"User"> | string | null
    role?: EnumRoleWithAggregatesFilter<"User"> | $Enums.Role
    divisiId?: StringNullableWithAggregatesFilter<"User"> | string | null
    avatar?: StringNullableWithAggregatesFilter<"User"> | string | null
    isActive?: BoolWithAggregatesFilter<"User"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type DivisiWhereInput = {
    AND?: DivisiWhereInput | DivisiWhereInput[]
    OR?: DivisiWhereInput[]
    NOT?: DivisiWhereInput | DivisiWhereInput[]
    id?: StringFilter<"Divisi"> | string
    name?: StringFilter<"Divisi"> | string
    description?: StringNullableFilter<"Divisi"> | string | null
    createdAt?: DateTimeFilter<"Divisi"> | Date | string
    updatedAt?: DateTimeFilter<"Divisi"> | Date | string
    users?: UserListRelationFilter
  }

  export type DivisiOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    users?: UserOrderByRelationAggregateInput
  }

  export type DivisiWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: DivisiWhereInput | DivisiWhereInput[]
    OR?: DivisiWhereInput[]
    NOT?: DivisiWhereInput | DivisiWhereInput[]
    description?: StringNullableFilter<"Divisi"> | string | null
    createdAt?: DateTimeFilter<"Divisi"> | Date | string
    updatedAt?: DateTimeFilter<"Divisi"> | Date | string
    users?: UserListRelationFilter
  }, "id" | "name">

  export type DivisiOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DivisiCountOrderByAggregateInput
    _max?: DivisiMaxOrderByAggregateInput
    _min?: DivisiMinOrderByAggregateInput
  }

  export type DivisiScalarWhereWithAggregatesInput = {
    AND?: DivisiScalarWhereWithAggregatesInput | DivisiScalarWhereWithAggregatesInput[]
    OR?: DivisiScalarWhereWithAggregatesInput[]
    NOT?: DivisiScalarWhereWithAggregatesInput | DivisiScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Divisi"> | string
    name?: StringWithAggregatesFilter<"Divisi"> | string
    description?: StringNullableWithAggregatesFilter<"Divisi"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Divisi"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Divisi"> | Date | string
  }

  export type AbsensiWhereInput = {
    AND?: AbsensiWhereInput | AbsensiWhereInput[]
    OR?: AbsensiWhereInput[]
    NOT?: AbsensiWhereInput | AbsensiWhereInput[]
    id?: StringFilter<"Absensi"> | string
    userId?: StringFilter<"Absensi"> | string
    date?: DateTimeFilter<"Absensi"> | Date | string
    checkIn?: DateTimeNullableFilter<"Absensi"> | Date | string | null
    checkOut?: DateTimeNullableFilter<"Absensi"> | Date | string | null
    status?: EnumAttendanceStatusFilter<"Absensi"> | $Enums.AttendanceStatus
    location?: StringNullableFilter<"Absensi"> | string | null
    notes?: StringNullableFilter<"Absensi"> | string | null
    createdAt?: DateTimeFilter<"Absensi"> | Date | string
    updatedAt?: DateTimeFilter<"Absensi"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type AbsensiOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    date?: SortOrder
    checkIn?: SortOrderInput | SortOrder
    checkOut?: SortOrderInput | SortOrder
    status?: SortOrder
    location?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type AbsensiWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    userId_date?: AbsensiUserIdDateCompoundUniqueInput
    AND?: AbsensiWhereInput | AbsensiWhereInput[]
    OR?: AbsensiWhereInput[]
    NOT?: AbsensiWhereInput | AbsensiWhereInput[]
    userId?: StringFilter<"Absensi"> | string
    date?: DateTimeFilter<"Absensi"> | Date | string
    checkIn?: DateTimeNullableFilter<"Absensi"> | Date | string | null
    checkOut?: DateTimeNullableFilter<"Absensi"> | Date | string | null
    status?: EnumAttendanceStatusFilter<"Absensi"> | $Enums.AttendanceStatus
    location?: StringNullableFilter<"Absensi"> | string | null
    notes?: StringNullableFilter<"Absensi"> | string | null
    createdAt?: DateTimeFilter<"Absensi"> | Date | string
    updatedAt?: DateTimeFilter<"Absensi"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id" | "userId_date">

  export type AbsensiOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    date?: SortOrder
    checkIn?: SortOrderInput | SortOrder
    checkOut?: SortOrderInput | SortOrder
    status?: SortOrder
    location?: SortOrderInput | SortOrder
    notes?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: AbsensiCountOrderByAggregateInput
    _max?: AbsensiMaxOrderByAggregateInput
    _min?: AbsensiMinOrderByAggregateInput
  }

  export type AbsensiScalarWhereWithAggregatesInput = {
    AND?: AbsensiScalarWhereWithAggregatesInput | AbsensiScalarWhereWithAggregatesInput[]
    OR?: AbsensiScalarWhereWithAggregatesInput[]
    NOT?: AbsensiScalarWhereWithAggregatesInput | AbsensiScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Absensi"> | string
    userId?: StringWithAggregatesFilter<"Absensi"> | string
    date?: DateTimeWithAggregatesFilter<"Absensi"> | Date | string
    checkIn?: DateTimeNullableWithAggregatesFilter<"Absensi"> | Date | string | null
    checkOut?: DateTimeNullableWithAggregatesFilter<"Absensi"> | Date | string | null
    status?: EnumAttendanceStatusWithAggregatesFilter<"Absensi"> | $Enums.AttendanceStatus
    location?: StringNullableWithAggregatesFilter<"Absensi"> | string | null
    notes?: StringNullableWithAggregatesFilter<"Absensi"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Absensi"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Absensi"> | Date | string
  }

  export type IzinWhereInput = {
    AND?: IzinWhereInput | IzinWhereInput[]
    OR?: IzinWhereInput[]
    NOT?: IzinWhereInput | IzinWhereInput[]
    id?: StringFilter<"Izin"> | string
    userId?: StringFilter<"Izin"> | string
    startDate?: DateTimeFilter<"Izin"> | Date | string
    endDate?: DateTimeFilter<"Izin"> | Date | string
    type?: EnumIzinTypeFilter<"Izin"> | $Enums.IzinType
    reason?: StringFilter<"Izin"> | string
    attachment?: StringNullableFilter<"Izin"> | string | null
    status?: EnumIzinStatusFilter<"Izin"> | $Enums.IzinStatus
    approvedBy?: StringNullableFilter<"Izin"> | string | null
    approvedAt?: DateTimeNullableFilter<"Izin"> | Date | string | null
    createdAt?: DateTimeFilter<"Izin"> | Date | string
    updatedAt?: DateTimeFilter<"Izin"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type IzinOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    type?: SortOrder
    reason?: SortOrder
    attachment?: SortOrderInput | SortOrder
    status?: SortOrder
    approvedBy?: SortOrderInput | SortOrder
    approvedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type IzinWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: IzinWhereInput | IzinWhereInput[]
    OR?: IzinWhereInput[]
    NOT?: IzinWhereInput | IzinWhereInput[]
    userId?: StringFilter<"Izin"> | string
    startDate?: DateTimeFilter<"Izin"> | Date | string
    endDate?: DateTimeFilter<"Izin"> | Date | string
    type?: EnumIzinTypeFilter<"Izin"> | $Enums.IzinType
    reason?: StringFilter<"Izin"> | string
    attachment?: StringNullableFilter<"Izin"> | string | null
    status?: EnumIzinStatusFilter<"Izin"> | $Enums.IzinStatus
    approvedBy?: StringNullableFilter<"Izin"> | string | null
    approvedAt?: DateTimeNullableFilter<"Izin"> | Date | string | null
    createdAt?: DateTimeFilter<"Izin"> | Date | string
    updatedAt?: DateTimeFilter<"Izin"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id">

  export type IzinOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    type?: SortOrder
    reason?: SortOrder
    attachment?: SortOrderInput | SortOrder
    status?: SortOrder
    approvedBy?: SortOrderInput | SortOrder
    approvedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: IzinCountOrderByAggregateInput
    _max?: IzinMaxOrderByAggregateInput
    _min?: IzinMinOrderByAggregateInput
  }

  export type IzinScalarWhereWithAggregatesInput = {
    AND?: IzinScalarWhereWithAggregatesInput | IzinScalarWhereWithAggregatesInput[]
    OR?: IzinScalarWhereWithAggregatesInput[]
    NOT?: IzinScalarWhereWithAggregatesInput | IzinScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Izin"> | string
    userId?: StringWithAggregatesFilter<"Izin"> | string
    startDate?: DateTimeWithAggregatesFilter<"Izin"> | Date | string
    endDate?: DateTimeWithAggregatesFilter<"Izin"> | Date | string
    type?: EnumIzinTypeWithAggregatesFilter<"Izin"> | $Enums.IzinType
    reason?: StringWithAggregatesFilter<"Izin"> | string
    attachment?: StringNullableWithAggregatesFilter<"Izin"> | string | null
    status?: EnumIzinStatusWithAggregatesFilter<"Izin"> | $Enums.IzinStatus
    approvedBy?: StringNullableWithAggregatesFilter<"Izin"> | string | null
    approvedAt?: DateTimeNullableWithAggregatesFilter<"Izin"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Izin"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Izin"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    username: string
    password: string
    fullName: string
    email: string
    phone?: string | null
    role?: $Enums.Role
    avatar?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    divisi?: DivisiCreateNestedOneWithoutUsersInput
    absensi?: AbsensiCreateNestedManyWithoutUserInput
    izin?: IzinCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    username: string
    password: string
    fullName: string
    email: string
    phone?: string | null
    role?: $Enums.Role
    divisiId?: string | null
    avatar?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    absensi?: AbsensiUncheckedCreateNestedManyWithoutUserInput
    izin?: IzinUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    divisi?: DivisiUpdateOneWithoutUsersNestedInput
    absensi?: AbsensiUpdateManyWithoutUserNestedInput
    izin?: IzinUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    divisiId?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    absensi?: AbsensiUncheckedUpdateManyWithoutUserNestedInput
    izin?: IzinUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    username: string
    password: string
    fullName: string
    email: string
    phone?: string | null
    role?: $Enums.Role
    divisiId?: string | null
    avatar?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    divisiId?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DivisiCreateInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: UserCreateNestedManyWithoutDivisiInput
  }

  export type DivisiUncheckedCreateInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    users?: UserUncheckedCreateNestedManyWithoutDivisiInput
  }

  export type DivisiUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUpdateManyWithoutDivisiNestedInput
  }

  export type DivisiUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    users?: UserUncheckedUpdateManyWithoutDivisiNestedInput
  }

  export type DivisiCreateManyInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DivisiUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DivisiUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AbsensiCreateInput = {
    id?: string
    date: Date | string
    checkIn?: Date | string | null
    checkOut?: Date | string | null
    status?: $Enums.AttendanceStatus
    location?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutAbsensiInput
  }

  export type AbsensiUncheckedCreateInput = {
    id?: string
    userId: string
    date: Date | string
    checkIn?: Date | string | null
    checkOut?: Date | string | null
    status?: $Enums.AttendanceStatus
    location?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AbsensiUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    checkIn?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    checkOut?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumAttendanceStatusFieldUpdateOperationsInput | $Enums.AttendanceStatus
    location?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAbsensiNestedInput
  }

  export type AbsensiUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    checkIn?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    checkOut?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumAttendanceStatusFieldUpdateOperationsInput | $Enums.AttendanceStatus
    location?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AbsensiCreateManyInput = {
    id?: string
    userId: string
    date: Date | string
    checkIn?: Date | string | null
    checkOut?: Date | string | null
    status?: $Enums.AttendanceStatus
    location?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AbsensiUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    checkIn?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    checkOut?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumAttendanceStatusFieldUpdateOperationsInput | $Enums.AttendanceStatus
    location?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AbsensiUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    checkIn?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    checkOut?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumAttendanceStatusFieldUpdateOperationsInput | $Enums.AttendanceStatus
    location?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IzinCreateInput = {
    id?: string
    startDate: Date | string
    endDate: Date | string
    type: $Enums.IzinType
    reason: string
    attachment?: string | null
    status?: $Enums.IzinStatus
    approvedBy?: string | null
    approvedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutIzinInput
  }

  export type IzinUncheckedCreateInput = {
    id?: string
    userId: string
    startDate: Date | string
    endDate: Date | string
    type: $Enums.IzinType
    reason: string
    attachment?: string | null
    status?: $Enums.IzinStatus
    approvedBy?: string | null
    approvedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type IzinUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: EnumIzinTypeFieldUpdateOperationsInput | $Enums.IzinType
    reason?: StringFieldUpdateOperationsInput | string
    attachment?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumIzinStatusFieldUpdateOperationsInput | $Enums.IzinStatus
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutIzinNestedInput
  }

  export type IzinUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: EnumIzinTypeFieldUpdateOperationsInput | $Enums.IzinType
    reason?: StringFieldUpdateOperationsInput | string
    attachment?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumIzinStatusFieldUpdateOperationsInput | $Enums.IzinStatus
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IzinCreateManyInput = {
    id?: string
    userId: string
    startDate: Date | string
    endDate: Date | string
    type: $Enums.IzinType
    reason: string
    attachment?: string | null
    status?: $Enums.IzinStatus
    approvedBy?: string | null
    approvedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type IzinUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: EnumIzinTypeFieldUpdateOperationsInput | $Enums.IzinType
    reason?: StringFieldUpdateOperationsInput | string
    attachment?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumIzinStatusFieldUpdateOperationsInput | $Enums.IzinStatus
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IzinUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: EnumIzinTypeFieldUpdateOperationsInput | $Enums.IzinType
    reason?: StringFieldUpdateOperationsInput | string
    attachment?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumIzinStatusFieldUpdateOperationsInput | $Enums.IzinStatus
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type DivisiNullableRelationFilter = {
    is?: DivisiWhereInput | null
    isNot?: DivisiWhereInput | null
  }

  export type AbsensiListRelationFilter = {
    every?: AbsensiWhereInput
    some?: AbsensiWhereInput
    none?: AbsensiWhereInput
  }

  export type IzinListRelationFilter = {
    every?: IzinWhereInput
    some?: IzinWhereInput
    none?: IzinWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type AbsensiOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type IzinOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
    fullName?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    role?: SortOrder
    divisiId?: SortOrder
    avatar?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
    fullName?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    role?: SortOrder
    divisiId?: SortOrder
    avatar?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    username?: SortOrder
    password?: SortOrder
    fullName?: SortOrder
    email?: SortOrder
    phone?: SortOrder
    role?: SortOrder
    divisiId?: SortOrder
    avatar?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UserListRelationFilter = {
    every?: UserWhereInput
    some?: UserWhereInput
    none?: UserWhereInput
  }

  export type UserOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DivisiCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DivisiMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DivisiMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type EnumAttendanceStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AttendanceStatus | EnumAttendanceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AttendanceStatus[]
    notIn?: $Enums.AttendanceStatus[]
    not?: NestedEnumAttendanceStatusFilter<$PrismaModel> | $Enums.AttendanceStatus
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type AbsensiUserIdDateCompoundUniqueInput = {
    userId: string
    date: Date | string
  }

  export type AbsensiCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    date?: SortOrder
    checkIn?: SortOrder
    checkOut?: SortOrder
    status?: SortOrder
    location?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AbsensiMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    date?: SortOrder
    checkIn?: SortOrder
    checkOut?: SortOrder
    status?: SortOrder
    location?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type AbsensiMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    date?: SortOrder
    checkIn?: SortOrder
    checkOut?: SortOrder
    status?: SortOrder
    location?: SortOrder
    notes?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type EnumAttendanceStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AttendanceStatus | EnumAttendanceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AttendanceStatus[]
    notIn?: $Enums.AttendanceStatus[]
    not?: NestedEnumAttendanceStatusWithAggregatesFilter<$PrismaModel> | $Enums.AttendanceStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAttendanceStatusFilter<$PrismaModel>
    _max?: NestedEnumAttendanceStatusFilter<$PrismaModel>
  }

  export type EnumIzinTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.IzinType | EnumIzinTypeFieldRefInput<$PrismaModel>
    in?: $Enums.IzinType[]
    notIn?: $Enums.IzinType[]
    not?: NestedEnumIzinTypeFilter<$PrismaModel> | $Enums.IzinType
  }

  export type EnumIzinStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.IzinStatus | EnumIzinStatusFieldRefInput<$PrismaModel>
    in?: $Enums.IzinStatus[]
    notIn?: $Enums.IzinStatus[]
    not?: NestedEnumIzinStatusFilter<$PrismaModel> | $Enums.IzinStatus
  }

  export type IzinCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    type?: SortOrder
    reason?: SortOrder
    attachment?: SortOrder
    status?: SortOrder
    approvedBy?: SortOrder
    approvedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IzinMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    type?: SortOrder
    reason?: SortOrder
    attachment?: SortOrder
    status?: SortOrder
    approvedBy?: SortOrder
    approvedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type IzinMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    type?: SortOrder
    reason?: SortOrder
    attachment?: SortOrder
    status?: SortOrder
    approvedBy?: SortOrder
    approvedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type EnumIzinTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.IzinType | EnumIzinTypeFieldRefInput<$PrismaModel>
    in?: $Enums.IzinType[]
    notIn?: $Enums.IzinType[]
    not?: NestedEnumIzinTypeWithAggregatesFilter<$PrismaModel> | $Enums.IzinType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumIzinTypeFilter<$PrismaModel>
    _max?: NestedEnumIzinTypeFilter<$PrismaModel>
  }

  export type EnumIzinStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.IzinStatus | EnumIzinStatusFieldRefInput<$PrismaModel>
    in?: $Enums.IzinStatus[]
    notIn?: $Enums.IzinStatus[]
    not?: NestedEnumIzinStatusWithAggregatesFilter<$PrismaModel> | $Enums.IzinStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumIzinStatusFilter<$PrismaModel>
    _max?: NestedEnumIzinStatusFilter<$PrismaModel>
  }

  export type DivisiCreateNestedOneWithoutUsersInput = {
    create?: XOR<DivisiCreateWithoutUsersInput, DivisiUncheckedCreateWithoutUsersInput>
    connectOrCreate?: DivisiCreateOrConnectWithoutUsersInput
    connect?: DivisiWhereUniqueInput
  }

  export type AbsensiCreateNestedManyWithoutUserInput = {
    create?: XOR<AbsensiCreateWithoutUserInput, AbsensiUncheckedCreateWithoutUserInput> | AbsensiCreateWithoutUserInput[] | AbsensiUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AbsensiCreateOrConnectWithoutUserInput | AbsensiCreateOrConnectWithoutUserInput[]
    createMany?: AbsensiCreateManyUserInputEnvelope
    connect?: AbsensiWhereUniqueInput | AbsensiWhereUniqueInput[]
  }

  export type IzinCreateNestedManyWithoutUserInput = {
    create?: XOR<IzinCreateWithoutUserInput, IzinUncheckedCreateWithoutUserInput> | IzinCreateWithoutUserInput[] | IzinUncheckedCreateWithoutUserInput[]
    connectOrCreate?: IzinCreateOrConnectWithoutUserInput | IzinCreateOrConnectWithoutUserInput[]
    createMany?: IzinCreateManyUserInputEnvelope
    connect?: IzinWhereUniqueInput | IzinWhereUniqueInput[]
  }

  export type AbsensiUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<AbsensiCreateWithoutUserInput, AbsensiUncheckedCreateWithoutUserInput> | AbsensiCreateWithoutUserInput[] | AbsensiUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AbsensiCreateOrConnectWithoutUserInput | AbsensiCreateOrConnectWithoutUserInput[]
    createMany?: AbsensiCreateManyUserInputEnvelope
    connect?: AbsensiWhereUniqueInput | AbsensiWhereUniqueInput[]
  }

  export type IzinUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<IzinCreateWithoutUserInput, IzinUncheckedCreateWithoutUserInput> | IzinCreateWithoutUserInput[] | IzinUncheckedCreateWithoutUserInput[]
    connectOrCreate?: IzinCreateOrConnectWithoutUserInput | IzinCreateOrConnectWithoutUserInput[]
    createMany?: IzinCreateManyUserInputEnvelope
    connect?: IzinWhereUniqueInput | IzinWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type DivisiUpdateOneWithoutUsersNestedInput = {
    create?: XOR<DivisiCreateWithoutUsersInput, DivisiUncheckedCreateWithoutUsersInput>
    connectOrCreate?: DivisiCreateOrConnectWithoutUsersInput
    upsert?: DivisiUpsertWithoutUsersInput
    disconnect?: DivisiWhereInput | boolean
    delete?: DivisiWhereInput | boolean
    connect?: DivisiWhereUniqueInput
    update?: XOR<XOR<DivisiUpdateToOneWithWhereWithoutUsersInput, DivisiUpdateWithoutUsersInput>, DivisiUncheckedUpdateWithoutUsersInput>
  }

  export type AbsensiUpdateManyWithoutUserNestedInput = {
    create?: XOR<AbsensiCreateWithoutUserInput, AbsensiUncheckedCreateWithoutUserInput> | AbsensiCreateWithoutUserInput[] | AbsensiUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AbsensiCreateOrConnectWithoutUserInput | AbsensiCreateOrConnectWithoutUserInput[]
    upsert?: AbsensiUpsertWithWhereUniqueWithoutUserInput | AbsensiUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AbsensiCreateManyUserInputEnvelope
    set?: AbsensiWhereUniqueInput | AbsensiWhereUniqueInput[]
    disconnect?: AbsensiWhereUniqueInput | AbsensiWhereUniqueInput[]
    delete?: AbsensiWhereUniqueInput | AbsensiWhereUniqueInput[]
    connect?: AbsensiWhereUniqueInput | AbsensiWhereUniqueInput[]
    update?: AbsensiUpdateWithWhereUniqueWithoutUserInput | AbsensiUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AbsensiUpdateManyWithWhereWithoutUserInput | AbsensiUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AbsensiScalarWhereInput | AbsensiScalarWhereInput[]
  }

  export type IzinUpdateManyWithoutUserNestedInput = {
    create?: XOR<IzinCreateWithoutUserInput, IzinUncheckedCreateWithoutUserInput> | IzinCreateWithoutUserInput[] | IzinUncheckedCreateWithoutUserInput[]
    connectOrCreate?: IzinCreateOrConnectWithoutUserInput | IzinCreateOrConnectWithoutUserInput[]
    upsert?: IzinUpsertWithWhereUniqueWithoutUserInput | IzinUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: IzinCreateManyUserInputEnvelope
    set?: IzinWhereUniqueInput | IzinWhereUniqueInput[]
    disconnect?: IzinWhereUniqueInput | IzinWhereUniqueInput[]
    delete?: IzinWhereUniqueInput | IzinWhereUniqueInput[]
    connect?: IzinWhereUniqueInput | IzinWhereUniqueInput[]
    update?: IzinUpdateWithWhereUniqueWithoutUserInput | IzinUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: IzinUpdateManyWithWhereWithoutUserInput | IzinUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: IzinScalarWhereInput | IzinScalarWhereInput[]
  }

  export type AbsensiUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<AbsensiCreateWithoutUserInput, AbsensiUncheckedCreateWithoutUserInput> | AbsensiCreateWithoutUserInput[] | AbsensiUncheckedCreateWithoutUserInput[]
    connectOrCreate?: AbsensiCreateOrConnectWithoutUserInput | AbsensiCreateOrConnectWithoutUserInput[]
    upsert?: AbsensiUpsertWithWhereUniqueWithoutUserInput | AbsensiUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: AbsensiCreateManyUserInputEnvelope
    set?: AbsensiWhereUniqueInput | AbsensiWhereUniqueInput[]
    disconnect?: AbsensiWhereUniqueInput | AbsensiWhereUniqueInput[]
    delete?: AbsensiWhereUniqueInput | AbsensiWhereUniqueInput[]
    connect?: AbsensiWhereUniqueInput | AbsensiWhereUniqueInput[]
    update?: AbsensiUpdateWithWhereUniqueWithoutUserInput | AbsensiUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: AbsensiUpdateManyWithWhereWithoutUserInput | AbsensiUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: AbsensiScalarWhereInput | AbsensiScalarWhereInput[]
  }

  export type IzinUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<IzinCreateWithoutUserInput, IzinUncheckedCreateWithoutUserInput> | IzinCreateWithoutUserInput[] | IzinUncheckedCreateWithoutUserInput[]
    connectOrCreate?: IzinCreateOrConnectWithoutUserInput | IzinCreateOrConnectWithoutUserInput[]
    upsert?: IzinUpsertWithWhereUniqueWithoutUserInput | IzinUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: IzinCreateManyUserInputEnvelope
    set?: IzinWhereUniqueInput | IzinWhereUniqueInput[]
    disconnect?: IzinWhereUniqueInput | IzinWhereUniqueInput[]
    delete?: IzinWhereUniqueInput | IzinWhereUniqueInput[]
    connect?: IzinWhereUniqueInput | IzinWhereUniqueInput[]
    update?: IzinUpdateWithWhereUniqueWithoutUserInput | IzinUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: IzinUpdateManyWithWhereWithoutUserInput | IzinUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: IzinScalarWhereInput | IzinScalarWhereInput[]
  }

  export type UserCreateNestedManyWithoutDivisiInput = {
    create?: XOR<UserCreateWithoutDivisiInput, UserUncheckedCreateWithoutDivisiInput> | UserCreateWithoutDivisiInput[] | UserUncheckedCreateWithoutDivisiInput[]
    connectOrCreate?: UserCreateOrConnectWithoutDivisiInput | UserCreateOrConnectWithoutDivisiInput[]
    createMany?: UserCreateManyDivisiInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type UserUncheckedCreateNestedManyWithoutDivisiInput = {
    create?: XOR<UserCreateWithoutDivisiInput, UserUncheckedCreateWithoutDivisiInput> | UserCreateWithoutDivisiInput[] | UserUncheckedCreateWithoutDivisiInput[]
    connectOrCreate?: UserCreateOrConnectWithoutDivisiInput | UserCreateOrConnectWithoutDivisiInput[]
    createMany?: UserCreateManyDivisiInputEnvelope
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
  }

  export type UserUpdateManyWithoutDivisiNestedInput = {
    create?: XOR<UserCreateWithoutDivisiInput, UserUncheckedCreateWithoutDivisiInput> | UserCreateWithoutDivisiInput[] | UserUncheckedCreateWithoutDivisiInput[]
    connectOrCreate?: UserCreateOrConnectWithoutDivisiInput | UserCreateOrConnectWithoutDivisiInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutDivisiInput | UserUpsertWithWhereUniqueWithoutDivisiInput[]
    createMany?: UserCreateManyDivisiInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutDivisiInput | UserUpdateWithWhereUniqueWithoutDivisiInput[]
    updateMany?: UserUpdateManyWithWhereWithoutDivisiInput | UserUpdateManyWithWhereWithoutDivisiInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type UserUncheckedUpdateManyWithoutDivisiNestedInput = {
    create?: XOR<UserCreateWithoutDivisiInput, UserUncheckedCreateWithoutDivisiInput> | UserCreateWithoutDivisiInput[] | UserUncheckedCreateWithoutDivisiInput[]
    connectOrCreate?: UserCreateOrConnectWithoutDivisiInput | UserCreateOrConnectWithoutDivisiInput[]
    upsert?: UserUpsertWithWhereUniqueWithoutDivisiInput | UserUpsertWithWhereUniqueWithoutDivisiInput[]
    createMany?: UserCreateManyDivisiInputEnvelope
    set?: UserWhereUniqueInput | UserWhereUniqueInput[]
    disconnect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    delete?: UserWhereUniqueInput | UserWhereUniqueInput[]
    connect?: UserWhereUniqueInput | UserWhereUniqueInput[]
    update?: UserUpdateWithWhereUniqueWithoutDivisiInput | UserUpdateWithWhereUniqueWithoutDivisiInput[]
    updateMany?: UserUpdateManyWithWhereWithoutDivisiInput | UserUpdateManyWithWhereWithoutDivisiInput[]
    deleteMany?: UserScalarWhereInput | UserScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutAbsensiInput = {
    create?: XOR<UserCreateWithoutAbsensiInput, UserUncheckedCreateWithoutAbsensiInput>
    connectOrCreate?: UserCreateOrConnectWithoutAbsensiInput
    connect?: UserWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type EnumAttendanceStatusFieldUpdateOperationsInput = {
    set?: $Enums.AttendanceStatus
  }

  export type UserUpdateOneRequiredWithoutAbsensiNestedInput = {
    create?: XOR<UserCreateWithoutAbsensiInput, UserUncheckedCreateWithoutAbsensiInput>
    connectOrCreate?: UserCreateOrConnectWithoutAbsensiInput
    upsert?: UserUpsertWithoutAbsensiInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAbsensiInput, UserUpdateWithoutAbsensiInput>, UserUncheckedUpdateWithoutAbsensiInput>
  }

  export type UserCreateNestedOneWithoutIzinInput = {
    create?: XOR<UserCreateWithoutIzinInput, UserUncheckedCreateWithoutIzinInput>
    connectOrCreate?: UserCreateOrConnectWithoutIzinInput
    connect?: UserWhereUniqueInput
  }

  export type EnumIzinTypeFieldUpdateOperationsInput = {
    set?: $Enums.IzinType
  }

  export type EnumIzinStatusFieldUpdateOperationsInput = {
    set?: $Enums.IzinStatus
  }

  export type UserUpdateOneRequiredWithoutIzinNestedInput = {
    create?: XOR<UserCreateWithoutIzinInput, UserUncheckedCreateWithoutIzinInput>
    connectOrCreate?: UserCreateOrConnectWithoutIzinInput
    upsert?: UserUpsertWithoutIzinInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutIzinInput, UserUpdateWithoutIzinInput>, UserUncheckedUpdateWithoutIzinInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedEnumAttendanceStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.AttendanceStatus | EnumAttendanceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AttendanceStatus[]
    notIn?: $Enums.AttendanceStatus[]
    not?: NestedEnumAttendanceStatusFilter<$PrismaModel> | $Enums.AttendanceStatus
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedEnumAttendanceStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AttendanceStatus | EnumAttendanceStatusFieldRefInput<$PrismaModel>
    in?: $Enums.AttendanceStatus[]
    notIn?: $Enums.AttendanceStatus[]
    not?: NestedEnumAttendanceStatusWithAggregatesFilter<$PrismaModel> | $Enums.AttendanceStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumAttendanceStatusFilter<$PrismaModel>
    _max?: NestedEnumAttendanceStatusFilter<$PrismaModel>
  }

  export type NestedEnumIzinTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.IzinType | EnumIzinTypeFieldRefInput<$PrismaModel>
    in?: $Enums.IzinType[]
    notIn?: $Enums.IzinType[]
    not?: NestedEnumIzinTypeFilter<$PrismaModel> | $Enums.IzinType
  }

  export type NestedEnumIzinStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.IzinStatus | EnumIzinStatusFieldRefInput<$PrismaModel>
    in?: $Enums.IzinStatus[]
    notIn?: $Enums.IzinStatus[]
    not?: NestedEnumIzinStatusFilter<$PrismaModel> | $Enums.IzinStatus
  }

  export type NestedEnumIzinTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.IzinType | EnumIzinTypeFieldRefInput<$PrismaModel>
    in?: $Enums.IzinType[]
    notIn?: $Enums.IzinType[]
    not?: NestedEnumIzinTypeWithAggregatesFilter<$PrismaModel> | $Enums.IzinType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumIzinTypeFilter<$PrismaModel>
    _max?: NestedEnumIzinTypeFilter<$PrismaModel>
  }

  export type NestedEnumIzinStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.IzinStatus | EnumIzinStatusFieldRefInput<$PrismaModel>
    in?: $Enums.IzinStatus[]
    notIn?: $Enums.IzinStatus[]
    not?: NestedEnumIzinStatusWithAggregatesFilter<$PrismaModel> | $Enums.IzinStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumIzinStatusFilter<$PrismaModel>
    _max?: NestedEnumIzinStatusFilter<$PrismaModel>
  }

  export type DivisiCreateWithoutUsersInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DivisiUncheckedCreateWithoutUsersInput = {
    id?: string
    name: string
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DivisiCreateOrConnectWithoutUsersInput = {
    where: DivisiWhereUniqueInput
    create: XOR<DivisiCreateWithoutUsersInput, DivisiUncheckedCreateWithoutUsersInput>
  }

  export type AbsensiCreateWithoutUserInput = {
    id?: string
    date: Date | string
    checkIn?: Date | string | null
    checkOut?: Date | string | null
    status?: $Enums.AttendanceStatus
    location?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AbsensiUncheckedCreateWithoutUserInput = {
    id?: string
    date: Date | string
    checkIn?: Date | string | null
    checkOut?: Date | string | null
    status?: $Enums.AttendanceStatus
    location?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AbsensiCreateOrConnectWithoutUserInput = {
    where: AbsensiWhereUniqueInput
    create: XOR<AbsensiCreateWithoutUserInput, AbsensiUncheckedCreateWithoutUserInput>
  }

  export type AbsensiCreateManyUserInputEnvelope = {
    data: AbsensiCreateManyUserInput | AbsensiCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type IzinCreateWithoutUserInput = {
    id?: string
    startDate: Date | string
    endDate: Date | string
    type: $Enums.IzinType
    reason: string
    attachment?: string | null
    status?: $Enums.IzinStatus
    approvedBy?: string | null
    approvedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type IzinUncheckedCreateWithoutUserInput = {
    id?: string
    startDate: Date | string
    endDate: Date | string
    type: $Enums.IzinType
    reason: string
    attachment?: string | null
    status?: $Enums.IzinStatus
    approvedBy?: string | null
    approvedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type IzinCreateOrConnectWithoutUserInput = {
    where: IzinWhereUniqueInput
    create: XOR<IzinCreateWithoutUserInput, IzinUncheckedCreateWithoutUserInput>
  }

  export type IzinCreateManyUserInputEnvelope = {
    data: IzinCreateManyUserInput | IzinCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type DivisiUpsertWithoutUsersInput = {
    update: XOR<DivisiUpdateWithoutUsersInput, DivisiUncheckedUpdateWithoutUsersInput>
    create: XOR<DivisiCreateWithoutUsersInput, DivisiUncheckedCreateWithoutUsersInput>
    where?: DivisiWhereInput
  }

  export type DivisiUpdateToOneWithWhereWithoutUsersInput = {
    where?: DivisiWhereInput
    data: XOR<DivisiUpdateWithoutUsersInput, DivisiUncheckedUpdateWithoutUsersInput>
  }

  export type DivisiUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DivisiUncheckedUpdateWithoutUsersInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AbsensiUpsertWithWhereUniqueWithoutUserInput = {
    where: AbsensiWhereUniqueInput
    update: XOR<AbsensiUpdateWithoutUserInput, AbsensiUncheckedUpdateWithoutUserInput>
    create: XOR<AbsensiCreateWithoutUserInput, AbsensiUncheckedCreateWithoutUserInput>
  }

  export type AbsensiUpdateWithWhereUniqueWithoutUserInput = {
    where: AbsensiWhereUniqueInput
    data: XOR<AbsensiUpdateWithoutUserInput, AbsensiUncheckedUpdateWithoutUserInput>
  }

  export type AbsensiUpdateManyWithWhereWithoutUserInput = {
    where: AbsensiScalarWhereInput
    data: XOR<AbsensiUpdateManyMutationInput, AbsensiUncheckedUpdateManyWithoutUserInput>
  }

  export type AbsensiScalarWhereInput = {
    AND?: AbsensiScalarWhereInput | AbsensiScalarWhereInput[]
    OR?: AbsensiScalarWhereInput[]
    NOT?: AbsensiScalarWhereInput | AbsensiScalarWhereInput[]
    id?: StringFilter<"Absensi"> | string
    userId?: StringFilter<"Absensi"> | string
    date?: DateTimeFilter<"Absensi"> | Date | string
    checkIn?: DateTimeNullableFilter<"Absensi"> | Date | string | null
    checkOut?: DateTimeNullableFilter<"Absensi"> | Date | string | null
    status?: EnumAttendanceStatusFilter<"Absensi"> | $Enums.AttendanceStatus
    location?: StringNullableFilter<"Absensi"> | string | null
    notes?: StringNullableFilter<"Absensi"> | string | null
    createdAt?: DateTimeFilter<"Absensi"> | Date | string
    updatedAt?: DateTimeFilter<"Absensi"> | Date | string
  }

  export type IzinUpsertWithWhereUniqueWithoutUserInput = {
    where: IzinWhereUniqueInput
    update: XOR<IzinUpdateWithoutUserInput, IzinUncheckedUpdateWithoutUserInput>
    create: XOR<IzinCreateWithoutUserInput, IzinUncheckedCreateWithoutUserInput>
  }

  export type IzinUpdateWithWhereUniqueWithoutUserInput = {
    where: IzinWhereUniqueInput
    data: XOR<IzinUpdateWithoutUserInput, IzinUncheckedUpdateWithoutUserInput>
  }

  export type IzinUpdateManyWithWhereWithoutUserInput = {
    where: IzinScalarWhereInput
    data: XOR<IzinUpdateManyMutationInput, IzinUncheckedUpdateManyWithoutUserInput>
  }

  export type IzinScalarWhereInput = {
    AND?: IzinScalarWhereInput | IzinScalarWhereInput[]
    OR?: IzinScalarWhereInput[]
    NOT?: IzinScalarWhereInput | IzinScalarWhereInput[]
    id?: StringFilter<"Izin"> | string
    userId?: StringFilter<"Izin"> | string
    startDate?: DateTimeFilter<"Izin"> | Date | string
    endDate?: DateTimeFilter<"Izin"> | Date | string
    type?: EnumIzinTypeFilter<"Izin"> | $Enums.IzinType
    reason?: StringFilter<"Izin"> | string
    attachment?: StringNullableFilter<"Izin"> | string | null
    status?: EnumIzinStatusFilter<"Izin"> | $Enums.IzinStatus
    approvedBy?: StringNullableFilter<"Izin"> | string | null
    approvedAt?: DateTimeNullableFilter<"Izin"> | Date | string | null
    createdAt?: DateTimeFilter<"Izin"> | Date | string
    updatedAt?: DateTimeFilter<"Izin"> | Date | string
  }

  export type UserCreateWithoutDivisiInput = {
    id?: string
    username: string
    password: string
    fullName: string
    email: string
    phone?: string | null
    role?: $Enums.Role
    avatar?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    absensi?: AbsensiCreateNestedManyWithoutUserInput
    izin?: IzinCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutDivisiInput = {
    id?: string
    username: string
    password: string
    fullName: string
    email: string
    phone?: string | null
    role?: $Enums.Role
    avatar?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    absensi?: AbsensiUncheckedCreateNestedManyWithoutUserInput
    izin?: IzinUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutDivisiInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutDivisiInput, UserUncheckedCreateWithoutDivisiInput>
  }

  export type UserCreateManyDivisiInputEnvelope = {
    data: UserCreateManyDivisiInput | UserCreateManyDivisiInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithWhereUniqueWithoutDivisiInput = {
    where: UserWhereUniqueInput
    update: XOR<UserUpdateWithoutDivisiInput, UserUncheckedUpdateWithoutDivisiInput>
    create: XOR<UserCreateWithoutDivisiInput, UserUncheckedCreateWithoutDivisiInput>
  }

  export type UserUpdateWithWhereUniqueWithoutDivisiInput = {
    where: UserWhereUniqueInput
    data: XOR<UserUpdateWithoutDivisiInput, UserUncheckedUpdateWithoutDivisiInput>
  }

  export type UserUpdateManyWithWhereWithoutDivisiInput = {
    where: UserScalarWhereInput
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyWithoutDivisiInput>
  }

  export type UserScalarWhereInput = {
    AND?: UserScalarWhereInput | UserScalarWhereInput[]
    OR?: UserScalarWhereInput[]
    NOT?: UserScalarWhereInput | UserScalarWhereInput[]
    id?: StringFilter<"User"> | string
    username?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    fullName?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    phone?: StringNullableFilter<"User"> | string | null
    role?: EnumRoleFilter<"User"> | $Enums.Role
    divisiId?: StringNullableFilter<"User"> | string | null
    avatar?: StringNullableFilter<"User"> | string | null
    isActive?: BoolFilter<"User"> | boolean
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
  }

  export type UserCreateWithoutAbsensiInput = {
    id?: string
    username: string
    password: string
    fullName: string
    email: string
    phone?: string | null
    role?: $Enums.Role
    avatar?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    divisi?: DivisiCreateNestedOneWithoutUsersInput
    izin?: IzinCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAbsensiInput = {
    id?: string
    username: string
    password: string
    fullName: string
    email: string
    phone?: string | null
    role?: $Enums.Role
    divisiId?: string | null
    avatar?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    izin?: IzinUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAbsensiInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAbsensiInput, UserUncheckedCreateWithoutAbsensiInput>
  }

  export type UserUpsertWithoutAbsensiInput = {
    update: XOR<UserUpdateWithoutAbsensiInput, UserUncheckedUpdateWithoutAbsensiInput>
    create: XOR<UserCreateWithoutAbsensiInput, UserUncheckedCreateWithoutAbsensiInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAbsensiInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAbsensiInput, UserUncheckedUpdateWithoutAbsensiInput>
  }

  export type UserUpdateWithoutAbsensiInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    divisi?: DivisiUpdateOneWithoutUsersNestedInput
    izin?: IzinUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAbsensiInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    divisiId?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    izin?: IzinUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutIzinInput = {
    id?: string
    username: string
    password: string
    fullName: string
    email: string
    phone?: string | null
    role?: $Enums.Role
    avatar?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    divisi?: DivisiCreateNestedOneWithoutUsersInput
    absensi?: AbsensiCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutIzinInput = {
    id?: string
    username: string
    password: string
    fullName: string
    email: string
    phone?: string | null
    role?: $Enums.Role
    divisiId?: string | null
    avatar?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    absensi?: AbsensiUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutIzinInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutIzinInput, UserUncheckedCreateWithoutIzinInput>
  }

  export type UserUpsertWithoutIzinInput = {
    update: XOR<UserUpdateWithoutIzinInput, UserUncheckedUpdateWithoutIzinInput>
    create: XOR<UserCreateWithoutIzinInput, UserUncheckedCreateWithoutIzinInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutIzinInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutIzinInput, UserUncheckedUpdateWithoutIzinInput>
  }

  export type UserUpdateWithoutIzinInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    divisi?: DivisiUpdateOneWithoutUsersNestedInput
    absensi?: AbsensiUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutIzinInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    divisiId?: NullableStringFieldUpdateOperationsInput | string | null
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    absensi?: AbsensiUncheckedUpdateManyWithoutUserNestedInput
  }

  export type AbsensiCreateManyUserInput = {
    id?: string
    date: Date | string
    checkIn?: Date | string | null
    checkOut?: Date | string | null
    status?: $Enums.AttendanceStatus
    location?: string | null
    notes?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type IzinCreateManyUserInput = {
    id?: string
    startDate: Date | string
    endDate: Date | string
    type: $Enums.IzinType
    reason: string
    attachment?: string | null
    status?: $Enums.IzinStatus
    approvedBy?: string | null
    approvedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type AbsensiUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    checkIn?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    checkOut?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumAttendanceStatusFieldUpdateOperationsInput | $Enums.AttendanceStatus
    location?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AbsensiUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    checkIn?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    checkOut?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumAttendanceStatusFieldUpdateOperationsInput | $Enums.AttendanceStatus
    location?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AbsensiUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    checkIn?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    checkOut?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: EnumAttendanceStatusFieldUpdateOperationsInput | $Enums.AttendanceStatus
    location?: NullableStringFieldUpdateOperationsInput | string | null
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IzinUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: EnumIzinTypeFieldUpdateOperationsInput | $Enums.IzinType
    reason?: StringFieldUpdateOperationsInput | string
    attachment?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumIzinStatusFieldUpdateOperationsInput | $Enums.IzinStatus
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IzinUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: EnumIzinTypeFieldUpdateOperationsInput | $Enums.IzinType
    reason?: StringFieldUpdateOperationsInput | string
    attachment?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumIzinStatusFieldUpdateOperationsInput | $Enums.IzinStatus
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IzinUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    startDate?: DateTimeFieldUpdateOperationsInput | Date | string
    endDate?: DateTimeFieldUpdateOperationsInput | Date | string
    type?: EnumIzinTypeFieldUpdateOperationsInput | $Enums.IzinType
    reason?: StringFieldUpdateOperationsInput | string
    attachment?: NullableStringFieldUpdateOperationsInput | string | null
    status?: EnumIzinStatusFieldUpdateOperationsInput | $Enums.IzinStatus
    approvedBy?: NullableStringFieldUpdateOperationsInput | string | null
    approvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateManyDivisiInput = {
    id?: string
    username: string
    password: string
    fullName: string
    email: string
    phone?: string | null
    role?: $Enums.Role
    avatar?: string | null
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateWithoutDivisiInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    absensi?: AbsensiUpdateManyWithoutUserNestedInput
    izin?: IzinUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutDivisiInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    absensi?: AbsensiUncheckedUpdateManyWithoutUserNestedInput
    izin?: IzinUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateManyWithoutDivisiInput = {
    id?: StringFieldUpdateOperationsInput | string
    username?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    fullName?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    phone?: NullableStringFieldUpdateOperationsInput | string | null
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    avatar?: NullableStringFieldUpdateOperationsInput | string | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DivisiCountOutputTypeDefaultArgs instead
     */
    export type DivisiCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DivisiCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DivisiDefaultArgs instead
     */
    export type DivisiArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DivisiDefaultArgs<ExtArgs>
    /**
     * @deprecated Use AbsensiDefaultArgs instead
     */
    export type AbsensiArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = AbsensiDefaultArgs<ExtArgs>
    /**
     * @deprecated Use IzinDefaultArgs instead
     */
    export type IzinArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = IzinDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}