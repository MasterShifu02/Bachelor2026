import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { Label } from "../../ui/label";

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
            <Label htmlFor="firstName">Fornavn *</Label>
            <input
            id="firstName"
            type="text"
            placeholder="Skriv fornavn"
            {...register("firstName")}
            className="w-full border p-2"
            />
            {errors.firstName && (
            <p className="text-sm text-red-600">{errors.firstName.message}</p>
            )}
        </article>

        <article className="space-y-2">
            <Label htmlFor="lastName">Etternavn *</Label>
            <input
            id="lastName"
            type="text"
            placeholder="Skriv etternavn"
            {...register("lastName")}
            className="w-full border p-2"
            />
            {errors.lastName && (
            <p className="text-sm text-red-600">{errors.lastName.message}</p>
            )}
        </article>

        <article className="space-y-2">
            <Label htmlFor="phone">Telefon *</Label>
            <input
            id="phone"
            type="text"
            inputMode="numeric"
            placeholder="Skriv telefonnummer"
            {...register("phone")}
            className="w-full border p-2"
            />
            {errors.phone && (
            <p className="text-sm text-red-600">{errors.phone.message}</p>
            )}
        </article>

        <article className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <input
            id="email"
            type="email"
            placeholder="Skriv email"
            {...register("email")}
            className="w-full border p-2"
            />
            {errors.email && (
            <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
        </article>

        </div>
      </section>
    );
  }


