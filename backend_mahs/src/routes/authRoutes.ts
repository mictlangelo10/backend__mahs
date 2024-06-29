import { Router, RouterOptions } from "express";
import { authController } from "../controllers/authController";
/*
 * Clase para funcionalidad de rutas Login
 */
class AuthRoutes {
  //Objeto de tipo Router public router: Router;
  public router: Router;
  //Inicializa
  constructor() {
    this.router = Router();
    this.config();
  }
  config() {
    this.router.post("/", authController.iniciarSesion);
  }
}
const authRoutes = new AuthRoutes();
export default authRoutes.router;
