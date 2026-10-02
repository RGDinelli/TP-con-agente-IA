import * as Yup from "yup";

export const registerScheme = Yup.object({
  nombre: Yup.string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre debe tener como máximo 50 caracteres")
    .required("Este campo es obligatorio"),
  email: Yup.string()
    .trim()
    .email("El correo es inválido")
    .required("Este campo es obligatorio"),
  password: Yup.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(20, "La contraseña debe tener como máximo 20 caracteres")
    .required("Este campo es obligatorio"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
    .required("Este campo es obligatorio"),
});