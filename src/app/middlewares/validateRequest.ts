import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";

const validateRequest =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse the request body against the schema
      await schema.parseAsync({
        body: req.body,
      });
      // If validation is successful, continue to the next middleware/controller
      return next();
    } catch (err) {
      // If validation fails, check if it's a ZodError and format the response
      if (err instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: err.errors.map((error) => ({
            path: error.path.join("."),
            message: error.message,
          })),
        });
      }
      // If it's not a ZodError, forward it to the global error handler
      return next(err);
    }
  };

export default validateRequest;
