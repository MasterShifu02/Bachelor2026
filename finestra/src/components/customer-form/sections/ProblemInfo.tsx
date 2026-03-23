import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";


import { problemTypeOptions } from "../ConfigForm";
import type { CustomerFormValues } from "../schemas";


type ProblemInfoProps = {
  register: UseFormRegister<CustomerFormValues>;
  errors: FieldErrors<CustomerFormValues>;
  selectedProblemType: string;
  problemDescriptionHelpText: string;
  documentationHelpText: string;
};

export function ProblemInfo(props: ProblemInfoProps) {
  const {
    register,
    errors,
    selectedProblemType,
    problemDescriptionHelpText,
    documentationHelpText
  } = props;

  return (
    <>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Velg problem</h2>

          <Label htmlFor="problemType">
            Problemtype *
          </Label>

          <select
            id="problemType"
            {...register("problemType")}
            className="w-full border p-2"
          >
            <option value="">Velg problem</option>
            {problemTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {errors.problemType && (
            <p className="text-sm text-red-600">
              {errors.problemType.message}
            </p>
          )}
      </section>

      <Separator />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Problembeskrivelse</h2>

        <Label htmlFor="problemDescription">
          Beskriv problemet *
        </Label>

        {selectedProblemType && (
          <p className="text-sm text-muted-foreground">
            {problemDescriptionHelpText}
          </p>
        )}

        <Textarea
          id="problemDescription"
          {...register("problemDescription")}
          placeholder="Beskriv problemet her:"
          className="min-h-20 w-full"
        />

        {errors.problemDescription && (
          <p className="text-sm text-red-600">
            {errors.problemDescription.message}
          </p>
        )}
      </section>

      <Separator />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Dokumentasjon</h2>

        <Label htmlFor="problemDocumentation">
          Legg til dokumentasjon *
        </Label>

        <p className="text-sm text-muted-foreground">
          {selectedProblemType
            ? documentationHelpText
            : "Velg først problemtype for å se hvilken dokumentasjon som er mest relevant."}
        </p>

        <div className="border p-10 ">
          Opplasting kommer i neste sprint.
        </div>
      </section>

    </>
  );
}
