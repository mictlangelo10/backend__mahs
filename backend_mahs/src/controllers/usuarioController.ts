import { Request, Response } from "express";
import validator from "validator";
import model from "../models/usuarioModelo";
import { utils } from "../utils/utils"; // Asegúrate de que la ruta sea correcta

class UsuarioController {
  public async list(req: Request, res: Response) {
    try {
      return res.json({ message: "Listado de Usuario", code: 0 });
    } catch (error: any) {
      return res.status(500).json({ message: `${error.message}` });
    }
  }

  public async add(req: Request, res: Response) {
    const { email, password, role } = req.body;

    // Validar email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Email no válido" });
    }

    // Validar otros campos según sea necesario
    if (!password || !role) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    try {
      // Verificar si el usuario ya existe
      const existingUser = await model.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "El email ya está en uso" });
      }

      // Encriptar la contraseña
      const encryptedPassword = await utils.hashPassword(password);

      // Si no existe, agregar el nuevo usuario
      const newUser = { email, password: encryptedPassword, role };
      await model.add(newUser);
      return res.json({ message: "Usuario agregado exitosamente", code: 0 });
    } catch (error: any) {
      return res.status(500).json({ message: `${error.message}` });
    }
  }

  public async update(req: Request, res: Response) {
    const { email, password } = req.body;

    // Validar email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Email no válido" });
    }

    // Validar otros campos según sea necesario
    if (!password) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    try {
      // Verificar si el usuario existe
      const existingUser = await model.findByEmail(email);
      if (!existingUser) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      // Encriptar la contraseña
      const encryptedPassword = await utils.hashPassword(password);

      // Si existe, actualizar el usuario
      const updatedUser = { email, password: encryptedPassword };
      await model.update(updatedUser);
      return res.json({ message: "Usuario actualizado exitosamente", code: 0 });
    } catch (error: any) {
      return res.status(500).json({ message: `${error.message}` });
    }
  }

  public async delete(req: Request, res: Response) {
    const { email } = req.body;

    // Validar email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Email no válido" });
    }

    try {
      // Verificar si el usuario existe
      const existingUser = await model.findByEmail(email);
      if (!existingUser) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }

      // Si existe, eliminar el usuario
      await model.delete(email);
      return res.json({ message: "Usuario eliminado exitosamente", code: 0 });
    } catch (error: any) {
      return res.status(500).json({ message: `${error.message}` });
    }
  }
}

export const usuarioController = new UsuarioController();
