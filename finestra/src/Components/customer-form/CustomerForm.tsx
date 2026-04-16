import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Label } from "../../Components/ui/label";
import { Button } from "../../Components/ui/button";
import { Separator } from "../../Components/ui/separator";

import {
  customerFormDefaultValues,
  customerFormSchema,
  type CustomerFormValues,
} from "./schemas";

import {
  getProblemTypeDescription,
  getProblemTypeDocumentationHelpText,
} from "./ConfigForm";

import { ProductInfo } from "../../Components/customer-form/sections/ProductInfo";
import { ProblemInfo } from "../../Components/customer-form/sections/ProblemInfo";
import { ContactInfo } from "../../Components/customer-form/sections/ContactInfo";

import { toast } from "sonner"
// import { useNavigate } from "react-router-dom"

type ExistingFile = {
  id: string;
  file_url: string;
  signedUrl: string | null;
};

type CustomerFormProps = {
  token: string;
};

export function CustomerForm({ token }: CustomerFormProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<ExistingFile[]>([]);

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: customerFormDefaultValues,
    mode: "onSubmit",
  });

  const { register, watch, handleSubmit, reset, formState } = form;
  const { errors, isSubmitting, isSubmitSuccessful } = formState;

  const selectedProblemType = watch("problemType");
  const problemDescriptionHelpText = getProblemTypeDescription(selectedProblemType);
  const documentationHelpText = getProblemTypeDocumentationHelpText(selectedProblemType);

  // LEGG TIL filer (ikke overskriv)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;

    const newFiles = Array.from(fileList);

    setFiles((prev) => {
      const isDuplicate = (file: File) =>
        prev.some(
          (f) =>
            f.name === file.name &&
            f.size === file.size &&
            f.lastModified === file.lastModified
        );

      return [
        ...prev,
        ...newFiles.filter((file) => !isDuplicate(file)),
      ];
    });

    if (newFiles.some((file) => 
      files.some(
        (f) => 
          f.name === file.name && 
          f.size === file.size && 
          f.lastModified === file.lastModified))
        ) 
    {
      toast.error("Denne filen er allerede lagt til!");
      // toast.error("Denne filen er allerede lagt til: " + newFiles.map(f => f.name).join(", "));
    }

    e.target.value = "";
  };

  // fjerne fil
  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  //  DELETE existing file (backend + storage)
  const removeExistingFile = async (fileId: string) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/case-token?token=${token}&action=delete-file&id=${fileId}`,
        { method: "POST" }
      );

      if (!res.ok) {
        throw new Error(await res.text());
      }

      setExistingFiles((prev) => prev.filter((f) => f.id !== fileId));

      toast.success("Vedlegg slettet");
    } catch (err) {
      console.error(err);
      toast.error("Kunne ikke slette vedlegg");
    }
  };  

  // Prefill via token
  useEffect(() => {
    async function fetchCaseData() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/case-token?token=${token}`
        );

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Ukjent feil");
          setLoading(false);
          return;
        }

        // Prefill form
        reset({
          firstName: data.firstName ?? "",
          lastName: data.lastName ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",

          productNameModel: data.productNameModel ?? "",
          productSpacerNumber: data.productSpacerNumber ?? "",
          productSerialNumber: data.productSerialNumber ?? "",
          productReceitNumber: data.productReceitNumber ?? "",
          productPurchaseDate: data.productPurchaseDate ?? "",

          problemType: data.problemType ?? "",
          problemDescription: data.problemDescription ?? "",
          problemDate: data.problemDate ?? "",
        });

        setExistingFiles(data.attachments || []);

        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Kunne ikke hente saken. Prøv igjen senere.");
        setLoading(false);
      }
    }

    fetchCaseData();
  }, [token, reset]);

  // const navigate = useNavigate()

  const onSubmit = async (values: CustomerFormValues) => {
    try {
      // -------------------
      // 1. LAST OPP FILER FØRST
      // -------------------
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/case-token?token=${token}&action=upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!uploadRes.ok) {
          console.error("Filopplasting feilet:", await uploadRes.text());
        }
      }

      // -------------------
      // 2. DERETTER SUBMIT
      // -------------------
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/case-token?token=${token}&action=submit`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Noe gikk galt ved innsending");
      }

      toast.success("Skjema sendt inn!");
      setFiles([]);

    } catch (err) {
      console.error("Submit failed:", err);

      toast.error(
        err instanceof Error ? err.message : "Noe gikk galt"
      );
    }
  };

  if (loading) return <div>Laster...</div>;
  if (error) return <div>Feil: {error}</div>;

  if (isSubmitSuccessful) {
  return (
      <main className="mx-auto max-w-4xl border bg-background px-4 py-6 text-center">
        <h2 className="text-2xl font-bold mb-2">Takk! 🎉</h2>
        <p>Skjemaet er sendt inn.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl border bg-background px-4 py-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">Skjema for saksopprettelse</h1>
        <h2 className="mb-4">
          Vennligst fyll ut skjemaet nedenfor og send inn din sak.
        </h2>
      </header>

      <Separator className="p-1 mb-4" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <ProductInfo register={register} errors={errors} />

        <Separator className="p-1 mb-4" />

        <ProblemInfo
          register={register}
          errors={errors}
          selectedProblemType={selectedProblemType}
          problemDescriptionHelpText={problemDescriptionHelpText}
          documentationHelpText={documentationHelpText}
          onFileChange={handleFileChange}
          existingFiles={existingFiles}
          onRemoveFile={removeFile}
          onRemoveExistingFile={(file) => removeExistingFile(file.id)}
          files={files}
        />

        <Separator className="p-1 mb-4" />

        <ContactInfo register={register} errors={errors} />

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
            <p className="text-sm text-red-600">{errors.confirmCorrectInfo.message}</p>
          )}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sender..." : "Send inn"}
          </Button>
        </section>
      </form>
    </main>
  );
}