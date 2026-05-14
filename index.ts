import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import { currentUser } from "./middleware/currentUser";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const app = express();
const port = process.env.PORT || 3000;

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: User unique identifier
 *         name:
 *           type: string
 *           description: User's full name
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Account creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *     Flashcard:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Flashcard unique identifier
 *         userId:
 *           type: string
 *           description: ID of the user who owns the flashcard
 *         question:
 *           type: string
 *           description: The question on the flashcard
 *         answer:
 *           type: string
 *           description: The answer to the question
 *         imageUrl:
 *           type: string
 *           format: url
 *           description: URL of the associated image (optional)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Flashcard API",
      version: "1.0.0",
      description:
        "API for managing flashcards with authentication and image uploads",
      contact: {
        name: "Developer",
      },
    },
    servers: [
      {
        url: `http://localhost:${port}`,
        description: "Development server",
      },
    ],
  },
  apis: ["./routes/*.ts", "./index.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Configure EJS templating engine
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(currentUser);

const Routes = require("./routes");
app.use(`/`, Routes);

mongoose.connect(process.env.MONGO_URI ?? "").catch((err) => {
  console.error("kaboom!", err);
});

mongoose.connection.once("open", async () => {
  console.log("i am one with the mongo");
  app.listen(port, () => {
    console.log(`App is listening at http://localhost:${port}`);
    console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
  });
});
