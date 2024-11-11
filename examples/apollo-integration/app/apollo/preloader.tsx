import type { CreateServerLoaderArgs } from "react-router/types";
import type { ApolloClient } from "./ApolloClient";
import { type PreloadQueryFunction } from "@apollo/client/index.js";
import { createTransportedQueryPreloader } from "./createQueryPreloader";

type ApolloLoader = <LoaderArgs extends CreateServerLoaderArgs<unknown>>() => <
  ReturnValue
>(
  loader: (
    args: LoaderArgs & {
      preloadQuery: PreloadQueryFunction;
    }
  ) => ReturnValue
) => (args: LoaderArgs) => ReturnValue;

export function createApolloLoaderHandler(
  makeClient: (request: Request) => ApolloClient
): ApolloLoader {
  return () => (loader) => (args) => {
    const client = makeClient(args.request);
    const preloadQuery = createTransportedQueryPreloader(client);
    return loader({
      ...args,
      preloadQuery,
    });
  };
}
