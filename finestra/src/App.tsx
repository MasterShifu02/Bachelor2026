import { RouterProvider } from "react-router-dom";
import { AppProviders } from "./app/providers/AppProviders";
import { appRouter } from "./app/router";
import "./App.css";

function App() {
  return (
    <>
      <AppProviders>
        <RouterProvider router={appRouter} />
      </AppProviders>
    </>
  );
}

export default App;

{
  /*  
App.tsx er hovedinngangen til frontend-appen
Her pakkes hele appen inn i globale providers,
og RouterProvider sørger for at rutene i appRouter rendres riktig.

AppProviders legger globale wrappers rundt hele appen
RouterProvider leser rutene fra appRouter
Basert på URL-en rendrer React Router riktig layout og sideieieie oeoe

*/
}
