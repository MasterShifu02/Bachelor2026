import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";
import { Separator } from "../../ui/separator";


import { problemTypeOptions } from "../ConfigForm";
import type { CustomerFormValues } from "../schemas";

type ExistingFile = {
  id: string;
  file_url: string;
  signedUrl: string | null;
};

type ProblemInfoProps = {
  register: UseFormRegister<CustomerFormValues>;
  errors: FieldErrors<CustomerFormValues>;
  selectedProblemType: string;
  problemDescriptionHelpText: string;
  documentationHelpText: string;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
  files: File[];
  existingFiles: ExistingFile[];
  onRemoveExistingFile: (file: ExistingFile) => void;
};

export function ProblemInfo(props: ProblemInfoProps) {
  const {
    register,
    errors,
    selectedProblemType,
    problemDescriptionHelpText,
    documentationHelpText,
    onFileChange,
    files,
    onRemoveFile,
    existingFiles,
    onRemoveExistingFile,
  } = props;

  // const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

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
        <Label htmlFor="problemDate">
          Når oppsto problemet (valgfritt)
        </Label>

        <input
          id="problemDate"
          type="date"
          {...register("problemDate")}
          className="w-full border p-2"
        />

        {errors.problemDate && (
          <p className="text-sm text-red-600">
            {errors.problemDate.message}
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

        <label className="block">
          <span className="sr-only">Velg filer</span>

          <input
            id="problemDocumentation"
            type="file"
            multiple
            onChange={onFileChange}
            className="hidden"
          />

          <div className="cursor-pointer border p-4 text-center rounded bg-gray-50 hover:bg-gray-100">
            📎 Klikk for å laste opp filer
          </div>
        </label>

        {/* PREVIEW GRID */}
        {(existingFiles.length > 0 || files.length > 0) && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">

            {/* PREVIEW EKSISTERENDE FILER */}
            {existingFiles.map((file) => {
              const isImage = file.file_url.match(/\.(jpg|jpeg|png|webp|gif)$/i);

              return (
                <div key={file.id} className="relative border rounded p-2">

                  {isImage ? (
                    <img
                      src={file.signedUrl ?? ""}
                      alt="Vedlegg"
                      className="w-full h-32 object-cover rounded"
                    />
                  ) : (
                    <div className="text-sm break-words">
                      📎 {file.file_url.split("/").pop()}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => onRemoveExistingFile(file)}
                    className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
                  >
                    ✕
                  </button>
                </div>
              );
            })}

            {/* PREVIEW NYE FILER */}
            {files.map((file, i) => {
              const isImage = file.type.startsWith("image/");

              return (
                <div key={i} className="relative border rounded p-2">

                  {isImage ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-32 object-cover rounded"
                      onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                    />
                  ) : (
                    <div className="text-sm break-words">
                      📎 {file.name}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => onRemoveFile(i)}
                    className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
                  >
                    ✕
                  </button>
                </div>
              );
            })}

          </div>
        )}
      </section>

    </>
  );
}
