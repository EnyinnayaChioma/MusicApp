import * as yup from "yup";

const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,20}$/;

export const basicSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(5, "Password must be at least 8 characters")
    .max(15, "Password must be at most 20 characters")   
    .matches(passwordRegex, "password must have a capital letter, a small letter, a number and a special character")
    .required("Password is required"),

    confirmPassword: yup.string().oneOf([yup.ref("password"), null], "Passwords must match").required("Confirm Password is required"),
});
