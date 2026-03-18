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
                <div className="space-y-2">

                    <Label htmlFor="productNameModel">Produktnavn / Modell *</Label>

                    <input
                        id="productNameModel"
                        type="text"
                        placeholder="Produkt-Navn"
                        {...register("productNameModel")}
                        className="w-full border p-2"
                    />
                    {errors.productNameModel && (
                        <p className="text-sm text-red-600">
                            {errors.productNameModel.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">

                </div>



            </div>
        </section>
    );
}
