import { Request, Response } from "express";
import validator from "validator";
import model from "../models/authModelo";
import { utils } from "../utils/utils";
import jwt from "jsonwebtoken";

class AuthController {
  /**
   * Método para valida Inicio de sesión
   * @param req Petición
   * @param res respuesta
   * @returns
   */
  public async iniciarSesion(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // verificar que los datos no esten vacios
      if (
        validator.isEmpty(email.trim()) ||
        validator.isEmpty(password.trim())
      ) {
        return res
          .status(400)
          .json({ message: "Los campos son requeridos", code: 1 });
      }
      const lstUsers = await model.getuserByEmail(email);
      if (lstUsers.length <= 0) {
        return res.status(404).json({
          message: "El usuario y/o contraseña es incorrecto",
          code: 1,
        });
      }

      let result = utils.checkPassword(password, lstUsers[0].password);
      result.then((value) => {
        if (value) {
          const newUser = {
            email: lstUsers[0].email,
            password: lstUsers[0].password,
            role: lstUsers[0].role,
          };
          console.log(lstUsers[0].username, lstUsers[0].password);

          console.log(process.env.SECRET);
          const env = require("dotenv").config();
          let token = jwt.sign(newUser, process.env.SECRET, {
            expiresIn: "1h",
          });
          return res.json({
            message: "Autenticación correcta",
            token,
            code: 0,
          });
        } else {
          return res.json({ message: "Password Incorrecto", code: 1 });
        }
      });
    } catch (error: any) {
      return res.status(500).json({ message: `${error.message}` });
    }
  }
}
export const authController = new AuthController();
