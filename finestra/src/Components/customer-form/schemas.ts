import { z } from "zod";

export const customerFormSchema = z.object({

// Produkt info schema
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



//Problem info schema
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



//kunde info schema
  firstName: z
    .string()
    .min(2, { message: "Skriv inn fornavn." })
  .max(50, { message: "Fornavn er for langt." }),

  lastName: z
    .string()
    .min(2, { message: "Skriv inn etternavn." })
    .max(50, { message: "Etternavn er for langt." }),

  phone: z.string()
    .min(8, { message: "Skriv inn telefonnummer." })
    .max(15)
    .optional(),

  email: z.email({ message: "Skriv inn en gyldig e-postadresse." }),

//Sluttlig bekreftelse
  confirmCorrectInfo: z
  .boolean()
  .refine((value) => value, {
    message: "Bekreft at informasjonen er korrekt.", }),



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


  firstName: "",
  lastName: "",
  phone: "",
  email: "",


  confirmCorrectInfo: false,
};
