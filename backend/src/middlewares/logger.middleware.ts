//PUNTO 4

import * as Yup from "yup";

export const loginScheme = Yup.object({
  email: Yup.string()
    .trim()
    .email("El correo es inválido")
    .required("Este campo es obligatorio"),
  password: Yup.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(20, "La contraseña debe tener como máximo 20 caracteres")
    .required("Este campo es obligatorio"),
});