import { SortOrder } from "mongoose";
import { GetAllArticlesQuery } from "./article-types";

export interface IParsedQuery {
  find: { [key: string]: string | string[] };
  sort: { [key: string]: SortOrder | { $meta: any } };
  pagination: {
    limit: number;
    skip: number;
  };
  populate: string;
  limitPopulate: string;
  select: string;
  count: boolean;
}

export function parseQuery(query: GetAllArticlesQuery): IParsedQuery {
  const parsedQuery: IParsedQuery = {
    find: {},
    sort: {},
    pagination: {
      limit: 10,
      skip: 0,
    },
    populate: "",
    limitPopulate: "",
    select: "",
    count: false,
  };

  // Search
  if (Array.isArray(query.where)) {
    query.where.forEach((x) => {
      const [prop, value] = x.split("=");
      if (!parsedQuery.find[prop]) {
        parsedQuery.find[prop] = [];
      }

      (parsedQuery.find[prop] as string[]).push(value);
    });
  } else if (typeof query.where === "string") {
    const [prop, value] = query.where.split("=");
    parsedQuery.find[prop] = value;
  }

  // Sort
  if (Array.isArray(query.sortBy)) {
    query.sortBy.forEach((x) => {
      const [sortProp, order] = x.split(" ");
      parsedQuery.sort[sortProp] = order as SortOrder;
    });
  } else if (typeof query.sortBy === "string") {
    const [sortProp, order] = query.sortBy.split(" ");
    parsedQuery.sort[sortProp] = order as SortOrder;
  } else {
    parsedQuery.sort = { createdAt: "asc" };
  }

  if (query.page && query.pageSize) {
    parsedQuery.pagination.limit = parseInt(query.pageSize);
    parsedQuery.pagination.skip =
      Math.max(0, parseInt(query.page) - 1) * parsedQuery.pagination.limit;
  }

  // Populate properties
  if (Array.isArray(query.populate)) {
    parsedQuery.populate += query.populate.join(" ");
  } else if (typeof query.populate === "string") {
    parsedQuery.populate += query.populate;
  }

  if (query.populate && query.populate.includes("owner")) {
    parsedQuery.limitPopulate += "username firstName lastName";
  }

  // Select properties
  if (Array.isArray(query.select)) {
    parsedQuery.select += query.select.join(" ");
  } else if (typeof query.select === "string") {
    parsedQuery.select += query.select;
  }

  // Return count if specified
  if (query.count === "true") {
    parsedQuery.count = true;
  }

  return parsedQuery;
}
