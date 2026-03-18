import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { customerFormDefaultValues, customerFormSchema, type CustomerFormValues } from "./schemas";
import { getProblemTypeDescription, getProblemTypeDocumentationHelpText } from "./ConfigForm";

import { ProductInfo } from "./sections/ProductInfo";
import { ProblemInfo } from "./sections/ProblemInfo";
import { ContactInfo } from "./sections/ContactInfo";


type CustomerFormProps = {
  token: string;
};

export function CustomerForm({ token }: CustomerFormProps) {
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: customerFormDefaultValues,
    mode: "onSubmit",
  });

  const { register, watch, handleSubmit, formState } = form;
  const { errors, isSubmitting, isSubmitSuccessful } = formState;

  const selectedProblemType = watch("problemType");

  const problemDescriptionHelpText = getProblemTypeDescription(selectedProblemType);

  const documentationHelpText = getProblemTypeDocumentationHelpText(selectedProblemType);

  const onSubmit = (values: CustomerFormValues) => {
    console.log("Customer form submit:", { token, values });
  };


  return (
    <main className="mx-auto max-w-a3xl border bg-background px-4 py-6">

      <header className="space-y-2">
        <h1 className="text-2xl font-bold">Skjema for saksopprettelse</h1>
        <h2 className="mb-4">Vennligst fyll ut skjemaet nedenfor og send inn din sak.</h2>
      </header>
      
      <Separator className="p-1 mb-4" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>

        <ProductInfo
          register={register}
          errors={errors}
        />

      <Separator className="p-1 mb-4" />




        <ProblemInfo
          register={register}
          errors={errors}
          selectedProblemType={selectedProblemType}
          problemDescriptionHelpText={problemDescriptionHelpText}
          documentationHelpText={documentationHelpText}
        />



      <Separator className="p-1 mb-4" />

        <ContactInfo

        />

      <Separator className="p-1 mb-4" />

        <section className="space-y-3">
          <div className="flex items-start gap-3">
            <input
              id="confirmCorrectInfo"
              type="checkbox"
              {...register("confirmCorrectInfo")}
            />
            <Label htmlFor="confirmCorrectInfo">
              Jeg bekrefter at informasjonen er korrekt *
            </Label>
          </div>

          {errors.confirmCorrectInfo && (
            <p className="text-sm text-red-600">
              {errors.confirmCorrectInfo.message}
            </p>
          )}

          <Button type="submit" disabled={isSubmitting}>
            Send inn
          </Button>

          {isSubmitSuccessful && (
            <p className="text-green-500 font-medium">
              Skjemaet er sendt in
            </p>
          )}
        </section>

      </form>
    </main>
  );
}
