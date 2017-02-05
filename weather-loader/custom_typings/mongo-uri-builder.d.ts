declare namespace mongoUriBuilder {
  interface Replica {
    host: string,
    port?: number
  }

  interface mongoUriBuilderOpts {
    username?: string,
    password?: string,
    host: string,
    port?: number,
    replicas?: Replica[],
    database?: string,
    options?: any
  }
}

declare function mongoUriBuilder(
  options: mongoUriBuilder.mongoUriBuilderOpts
): string;

export = mongoUriBuilder;