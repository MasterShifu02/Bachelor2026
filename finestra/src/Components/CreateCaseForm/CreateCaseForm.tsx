import "./CreateCaseForm.css";
import { ActionButton } from "../ActionButton/ActionButton";

function handlePrefillForm() {
  console.log("funksjon for å åpne forhåndsutfyllingsskjema");
}

function CreateCaseForm() {
  return (
    <>
      <h1 className="create-case-header">Opprett Sak</h1>
      <form className="form-container">
        <div className="inputSection">
          <label className="inputLabel">Fornavn...</label>
          <input
            type="text"
            id="fname"
            name="fname"
            className="inputfield"
          ></input>
        </div>
        <div className="inputSection">
          <label className="inputLabel">Etternavn...</label>
          <input
            type="text"
            id="lname"
            name="lname"
            className="inputfield"
          ></input>
        </div>
        <div className="inputSection">
          <label htmlFor="email" className="inputLabel">
            E-post...
          </label>
          <input
            type="text"
            id="email"
            name="epost"
            className="inputfield"
          ></input>
        </div>

        <div className="message">
          <label htmlFor="messagefield" className="inputLabel">
            Melding (valgfritt)
          </label>
          <textarea id="messagefield" name="messagefield"></textarea>
          <div className="buttonSection">
            <ActionButton
              name="Forhåndsutfyll skjema"
              variant="secondary"
              onClick={handlePrefillForm}
            />
            <ActionButton name="Avbryt" variant="secondary" />
            <ActionButton name="Send" variant="primary" />
          </div>
        </div>
      </form>
    </>
  );
}
export { CreateCaseForm };
