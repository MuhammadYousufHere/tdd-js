import Article from "./article-schema";
import {
  ArticleEntity,
  ICreateArticleData,
  IPatchArticleData,
} from "./article-types";
import { IParsedQuery } from "./article-utils";

export async function findArticlesByQuery(
  parsedQuery: IParsedQuery
): Promise<ArticleEntity[]> {
  const articles = await Article.find(parsedQuery.find)
    .sort(parsedQuery.sort)
    .limit(parsedQuery.pagination.limit)
    .skip(parsedQuery.pagination.skip)
    .populate(parsedQuery.populate, parsedQuery.limitPopulate)
    .select(parsedQuery.select);

  if (!articles) {
    return [];
  }

  return articles.map((x) => new ArticleEntity(x));
}

export async function countDocumentsByQuery(
  parsedQuery: IParsedQuery
): Promise<number> {
  if (parsedQuery.find) {
    return Article.find(parsedQuery.find).countDocuments();
  }

  return Article.find().estimatedDocumentCount();
}

export async function findArticleById(
  id: string,
  populateField?: any
): Promise<ArticleEntity | null> {
  // TODO: Make it more sensible
  const article = await Article.findById(id).populate(
    populateField.populate,
    populateField.limitPopulate
  );

  if (!article) {
    return null;
  }

  return new ArticleEntity(article);
}

export async function createArticle(
  data: ICreateArticleData
): Promise<ArticleEntity> {
  const result = new Article(data);
  await result.save();

  return new ArticleEntity(result);
}

export async function findAndUpdateArticleById(
  id: string,
  userId: string,
  data: IPatchArticleData
): Promise<ArticleEntity> {
  const article = await Article.findById(id);

  if (article === null) throw new Error("Article not found");
  if (article.owner.toString() !== userId)
    throw new Error("Only owners can update article");

  for (const key of Object.keys(data)) {
    //@ts-ignore
    article[key] = data[key];
  }

  await article.save();

  return new ArticleEntity(article);
}

export async function deleteArticleById(id: string) {
  await Article.findOneAndDelete({ _id: id });
}
