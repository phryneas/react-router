import type { CreateServerLoaderArgs } from "react-router/types";
import type { ApolloClient } from "./ApolloClient";
import type { PreloadedQueryRef, QueryRef } from "@apollo/client/index.js";
import { type PreloadQueryFunction } from "@apollo/client/index.js";
import { createTransportedQueryPreloader } from "./createQueryPreloader";
import type { SerializesTo } from "react-router/types";

type MarkedForSerialization<T> = T extends PreloadedQueryRef<
  infer Data,
  infer Variables
>
  ? SerializesTo<QueryRef<Data, Variables>>
  : { [K in keyof T]: MarkedForSerialization<T[K]> };

type ApolloLoader = <LoaderArgs extends CreateServerLoaderArgs<unknown>>() => <
  ReturnValue
>(
  loader: (
    args: LoaderArgs & {
      preloadQuery: PreloadQueryFunction;
    }
  ) => ReturnValue
) => (args: LoaderArgs) => MarkedForSerialization<ReturnValue>;

export function createApolloLoaderHandler(
  makeClient: (request: Request) => ApolloClient
): ApolloLoader {
  return () => (loader) => (args) => {
    const client = makeClient(args.request);
    const preloadQuery = createTransportedQueryPreloader(client);
    return loader({
      ...args,
      preloadQuery,
    }) as any;
  };
}
