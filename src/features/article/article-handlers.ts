import { IJsonResponse } from "../../utils/json-response";
import * as articleService from "./article-service";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../../utils/app-error";
import { HttpStatusCode } from "../../utils/http-status-code";
import { GetAllArticlesQuery } from "./article-types";

export function getAll() {
  return async (
    req: Request<{}, {}, {}, GetAllArticlesQuery>,
    res: Response<IJsonResponse>,
    next: NextFunction
  ) => {
    try {
      const query = req.query;
      const result = await articleService.getAll(query);

      return res.json({
        code: HttpStatusCode.OK,
        message: "Articles",
        data: result,
      });
    } catch (err) {
      next(
        new AppError(
          HttpStatusCode.INTERNAL_SERVER_ERROR,
          "Something went wrong"
        )
      );
    }
  };
}

export function getOne() {
  return async (
    req: Request,
    res: Response<IJsonResponse>,
    next: NextFunction
  ) => {
    try {
      const id = req.params.id;
      const query = req.query;
      const result = await articleService.getOne(id, query);

      if (!result) {
        throw new Error("Not found");
      }

      return res.json({
        code: HttpStatusCode.OK,
        message: "Details",
        data: result,
      });
    } catch (err) {
      next(new AppError(HttpStatusCode.NOT_FOUND, "Not found"));
    }
  };
}

export function create() {
  return async (
    req: Request,
    res: Response<IJsonResponse>,
    next: NextFunction
  ) => {
    try {
      const data = req.body;
      const userId = res.locals.user.id;
      const result = await articleService.create({
        owner: userId,
        ...data,
      });

      return res.status(HttpStatusCode.CREATED).json({
        code: HttpStatusCode.CREATED,
        message: "Created item in articles collection",
        data: result,
      });
    } catch (err) {
      next(
        new AppError(HttpStatusCode.BAD_REQUEST, "Failed to create article")
      );
    }
  };
}

export function patch() {
  return async (
    req: Request,
    res: Response<IJsonResponse>,
    next: NextFunction
  ) => {
    try {
      const id = req.params.id;
      const userId = res.locals.user.id;
      const result = await articleService.update(id, userId, req.body);

      return res.json({
        code: HttpStatusCode.OK,
        message: "Updated item in articles collection",
        data: result,
      });
    } catch (err) {
      next(
        new AppError(HttpStatusCode.BAD_REQUEST, "Failed to update article")
      );
    }
  };
}

export function remove() {
  return async (
    req: Request,
    res: Response<IJsonResponse>,
    next: NextFunction
  ) => {
    try {
      const id = req.params.id;
      const userId = res.locals.user.id;

      await articleService.remove(id, userId);

      return res.status(HttpStatusCode.NO_CONTENT).json({
        code: HttpStatusCode.NO_CONTENT,
        message: "Deleted item in articles",
        data: null,
      });
    } catch (err) {
      next(
        new AppError(HttpStatusCode.BAD_REQUEST, "Failed to delete article")
      );
    }
  };
}
