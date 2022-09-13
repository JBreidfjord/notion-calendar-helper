import {
  DatabaseObjectResponse,
  PageObjectResponse,
  PartialDatabaseObjectResponse,
  PartialPageObjectResponse,
  SearchParameters,
} from "@notionhq/client/build/src/api-endpoints";
import { useEffect, useState } from "react";

import { Client } from "@notionhq/client";
import { uniqBy } from "lodash";

type SearchResults = (
  | PageObjectResponse
  | PartialPageObjectResponse
  | DatabaseObjectResponse
  | PartialDatabaseObjectResponse
)[];

const useSearch = (client: Client, params: SearchParameters) => {
  const [results, setResults] = useState<SearchResults>([]);
  const [shouldSearch, setShouldSearch] = useState(true);
  const [startCursor, setStartCursor] = useState<string | undefined>(undefined);

  useEffect(() => {
    const search = async () => {
      const response = await client.search({
        ...params,
        start_cursor: startCursor,
      });
      setResults((prev) => uniqBy([...prev, ...response.results], "id"));
      if (response.has_more && response.next_cursor) {
        setStartCursor(response.next_cursor);
        setShouldSearch(true);
      } else {
        setShouldSearch(false);
      }
    };

    if (shouldSearch) search();
  }, [shouldSearch, startCursor]);

  return { results, loading: shouldSearch };
};

export default useSearch;
