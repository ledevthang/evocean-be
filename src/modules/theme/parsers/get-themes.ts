import { IsBool, OptionalProperty, PaginatedQuery } from "@root/shared/parsers";

export class GetThemesQuery extends PaginatedQuery {
  @OptionalProperty()
  author?: string;

  @OptionalProperty()
  owner?: string;

  @OptionalProperty()
  @IsBool
  listing?: boolean;
}
