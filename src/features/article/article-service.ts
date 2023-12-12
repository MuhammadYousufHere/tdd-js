import * as articleRepository from "./article-repository";
import {
  ArticleEntity,
  GetAllArticlesQuery,
  ICreateArticleData,
  IPatchArticleData,
} from "./article-types";
import { parseQuery } from "./article-utils";

export async function getAll(
  query: GetAllArticlesQuery
): Promise<ArticleEntity[] | number> {
  const parsedQuery = parseQuery(query);

  if (parsedQuery.count) {
    return articleRepository.countDocumentsByQuery(parsedQuery);
  }

  return articleRepository.findArticlesByQuery(parsedQuery);
}

export async function getOne(
  id: string,
  query: any
): Promise<ArticleEntity | null> {
  let populate = "";
  let limitPopulate = "";

  if (query.populate) {
    populate += query.populate;

    if (query.populate.includes("owner")) {
      limitPopulate += "username firstName lastName";
    }
  }

  return articleRepository.findArticleById(id);
}

export async function create(data: ICreateArticleData): Promise<ArticleEntity> {
  return articleRepository.createArticle(data);
}

export async function update(
  id: string,
  userId: string,
  data: IPatchArticleData
): Promise<ArticleEntity> {
  return articleRepository.findAndUpdateArticleById(id, userId, data);
}

export async function remove(id: string, userId: string): Promise<void> {
  const item = await articleRepository.findArticleById(id);

  if (!item) throw new Error("Article does not exist");
  if (item.ownerId !== userId) throw new Error("Only owners can delete items");

  await articleRepository.deleteArticleById(id);
}
