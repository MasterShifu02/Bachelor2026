import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { Label } from "@/components/ui/label";

import type { CustomerFormValues } from "../schemas";

type ContactInfoProps = {
  register: UseFormRegister<CustomerFormValues>;
  errors: FieldErrors<CustomerFormValues>;
};


export function ContactInfo(props: ContactInfoProps) {
    const { register, errors } = props;

    return (
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Kontakt Informasjon</h2>

        <div className="grid gap-4 md:grid-cols-2">

          <article className="space-y-2">

            <Label htmlFor="contactName">Navn *</Label>

            <input
              id="contactName"
              type="text"
              placeholder="Skriv kontakt navn her"
              {...register("contactName")}
              className="w-full border p-2"

            />
              {errors.contactName && (
                  <p className="text-sm text-red-600">
                      {errors.contactName.message}
                  </p>
              )}

          </article>

          <article className="space-y-2">

              <Label htmlFor="telefonNumber">Telefon *</Label>

              <input
                  id="telefonNumber"
                  type="text"
                  placeholder="Skriv din telefon her"
                  {...register("telefonNumber")}
                  className="w-full border p-2"
              />
              {errors.telefonNumber && (
                  <p className="text-sm text-red-600">
                      {errors.telefonNumber.message}
                  </p>
              )}

          </article>

          <article className="space-y-2">

              <Label htmlFor="email">Email *</Label>

              <input
                  id="email"
                  type="text"
                  placeholder="Skriv din email her"
                  {...register("email")}
                  className="w-full border p-2"
              />
              {errors.email && (
                  <p className="text-sm text-red-600">
                      {errors.email.message}
                  </p>
              )}

          </article>

        </div>
      </section>
    );
  }


