import type { FieldErrors, UseFormRegister } from "react-hook-form";

import { Label } from "@/components/ui/label";

import type { CustomerFormValues } from "../schemas";



type ProductInfoProps = {
  register: UseFormRegister<CustomerFormValues>;
  errors: FieldErrors<CustomerFormValues>;
};
    

export function ProductInfo(props: ProductInfoProps) {
    const { register, errors } = props;

    return (
        <section className="space-y-3">
            <h2 className="text-lg font-semibold">Produkt informasjon</h2>

            <div className="grid gap-4 md:grid-cols-2">

                <article className="space-y-2">

                    <Label htmlFor="productNameModel">Produktnavn / Modell *</Label>

                    <input
                        id="productNameModel"
                        type="text"
                        placeholder="Skriv produkt navn her"
                        {...register("productNameModel")}
                        className="w-full border p-2"
                    />
                    {errors.productNameModel && (
                        <p className="text-sm text-red-600">
                            {errors.productNameModel.message}
                        </p>
                    )}
                </article>

                <article className="space-y-2">

                    <Label htmlFor="productSpacerNumber">Spacer nummer *</Label>

                    <input
                        id="productSpacerNumber"
                        type="text"
                        placeholder="Skriv produkt spacer nummer her"
                        {...register("productSpacerNumber")}
                        className="w-full border p-2"
                    />
                    {errors.productSpacerNumber && (
                        <p className="text-sm text-red-600">
                            {errors.productSpacerNumber.message}
                        </p>
                    )}
                </article>
                
                <article className="space-y-2">

                    <Label htmlFor="productSerialNumber">Serienummer *</Label>

                    <input
                        id="productSerialNumber"
                        type="text"
                        placeholder="Skriv produkt serienummer her"
                        {...register("productSerialNumber")}
                        className="w-full border p-2"
                    />
                    {errors.productSerialNumber && (
                        <p className="text-sm text-red-600">
                            {errors.productSerialNumber.message}
                        </p>
                    )}
                </article>
                
                <article className="space-y-2">

                    <Label htmlFor="productReceitNumber">Ordrenummer / Kvittering *</Label>

                    <input
                        id="productReceitNumber"
                        type="text"
                        placeholder="Skriv produkt serienummer her"
                        {...register("productReceitNumber")}
                        className="w-full border p-2"
                    />
                    {errors.productReceitNumber && (
                        <p className="text-sm text-red-600">
                            {errors.productReceitNumber.message}
                        </p>
                    )}
                </article>
                
                <article className="space-y-2">

                    <Label htmlFor="productPurchaseDate">Kjøpsdato *</Label>

                    <input
                        id="productPurchaseDate"
                        type="text"
                        placeholder="Skriv produkt serienummer her"
                        {...register("productPurchaseDate")}
                        className="w-full border p-2"
                    />
                    {errors.productPurchaseDate && (
                        <p className="text-sm text-red-600">
                            {errors.productPurchaseDate.message}
                        </p>
                    )}
                </article>

            </div>
        </section>
    );
}
