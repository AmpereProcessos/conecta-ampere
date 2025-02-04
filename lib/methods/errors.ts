import { ZodError } from "zod";

export function getErrorMessage(error: unknown): string {
  console.log("Tipo do erro:", Object.prototype.toString.call(error));
  console.log("Erro completo:", error);

  // Caso 1: É um ZodError
  if (error instanceof ZodError) {
    console.log("ERRO NO CASO 1");

    return error.errors[0]?.message || "Oops, um erro desconhecido ocorreu.";
  }

  // Caso 3: É um objeto com uma propriedade 'message' que pode ser um JSON string
  if (typeof error === "object" && error !== null && "message" in error) {
    console.log("ERRO NO CASO 3");
    const messageError = (error as { message: unknown }).message;
    if (typeof messageError === "string") {
      return messageError;
    }
  }

  // Caso 4: É um Error padrão
  if (error instanceof Error) {
    return error.message;
  }

  // Caso 5: Qualquer outro tipo de erro
  return "Oops, um erro desconhecido ocorreu.";
}
