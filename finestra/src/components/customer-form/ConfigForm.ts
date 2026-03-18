type ProblemTypeOption = {
  value: string;
  label: string;
  description: string;
  documentationHelpText: string;
};

export const problemTypeOptions: ProblemTypeOption[] = [
  {
    value: "skade_pa_glass",
    label: "Skade på glass",
    description:
      "Beskriv hvor skaden er på glasset, hvor stor den er, og om den ble oppdaget ved levering eller senere.",
    documentationHelpText:
      "Last opp minst 2 bilder. Et nærbilde av skaden og et oversiktsbilde av hele vinduet.",
  },
  {
    value: "skade_pa_overflate",
    label: "Skade på overflate",
    description:
      "Beskriv skaden på karm, ramme eller annen overflate, og hvor synlig den er.",
    documentationHelpText:
      "Last opp minst 2 bilder. Et bilde av skaden tett på og et bilde som viser plasseringen på produktet.",
  },
  {
    value: "funksjonsfeil",
    label: "Funksjonsfeil",
    description:
      "Beskriv hva som ikke fungerer, for eksempel åpning, lukking, låsing eller justering.",
    documentationHelpText:
      "Hvis mulig, legg ved bilder som viser hvordan vinduet står eller hva som ikke fungerer.",
  },
  {
    value: "feil_produkt",
    label: "Feil produkt",
    description:
      "Beskriv hva som er feil med produktet sammenlignet med det som ble bestilt.",
    documentationHelpText:
      "Legg ved bilder av produktet og gjerne merking eller detaljer som viser avviket.",
  },
  {
    value: "mangler_pa_produkt",
    label: "Mangler på produkt",
    description:
      "Beskriv hvilke deler eller egenskaper som mangler på produktet.",
    documentationHelpText:
      "Legg ved bilder som viser hva som mangler, og gjerne oversiktsbilde av hele produktet.",
  },
  {
    value: "darlig_utforelse",
    label: "Dårlig utførelse",
    description:
      "Beskriv hva du opplever som dårlig utførelse og hvordan det påvirker produktet.",
    documentationHelpText:
      "Legg ved bilder fra flere vinkler som tydelig viser utførelsen.",
  },
  {
    value: "annet",
    label: "Annet",
    description:
      "Beskriv problemet så konkret som mulig slik at saken kan vurderes riktig.",
    documentationHelpText:
      "Legg ved relevant dokumentasjon som gjør problemet lettere å forstå.",
  },
];

export function getProblemTypeDescription(problemType: string) {
  return (
    problemTypeOptions.find((option) => option.value === problemType)
      ?.description ?? ""
  );
}

export function getProblemTypeDocumentationHelpText(problemType: string) {
  return (
    problemTypeOptions.find((option) => option.value === problemType)
      ?.documentationHelpText ?? ""
  );
}
