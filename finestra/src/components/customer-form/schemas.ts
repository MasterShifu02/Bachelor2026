import { z } from "zod";

export const customerFormSchema = z.object({

  productNameModel: z
    .string()
    .min(5, {
      message: "Skriv inn produktnavn eller modell.",
    })
    .max(100, {
      message: "Produktnavn eller modell er for lang.",}),

  productSerialNumber: z
    .string()
    .min(5)
    .max(100)
    .optional(),


  productSpacerNumber: z
    .string()
    .min(5)
    .max(100),

  productPurchaseDate: z
    .string()
    .optional(),
    //https://ui.shadcn.com/docs/components/radix/date-picker

  productReceitNumber: z
    .string()
    .min(5)
    .max(100),




  problemType: z
    .string()
    .min(1, {
      message: "Velg hva problemet gjelder.", }),

  problemDescription: z
    .string()
    .trim()
    .min(10, {
      message: "Beskriv problemet litt mer detaljert.", })
    .max(1000, {
      message: "Beskrivelsen er for lang.", }),

  problemDate: z
    .string()
    .optional(),
    //https://ui.shadcn.com/docs/components/radix/date-picker




  confirmCorrectInfo: z
  .boolean()
  .refine((value) => value, {
    message: "Bekrefte at informasjonen er korrekt.", }),



});

export type CustomerFormValues = z.infer<typeof customerFormSchema>;

export const customerFormDefaultValues: CustomerFormValues = {
  productNameModel: "",
  productSerialNumber: "",
  productSpacerNumber: "",
  productPurchaseDate: "",
  productReceitNumber: "",

  
  problemType: "",
  problemDescription: "",
  problemDate: "",


  confirmCorrectInfo: false,
};
