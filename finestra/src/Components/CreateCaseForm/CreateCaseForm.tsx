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
        <div className="inputfield">
          <label>Fornavn...</label>
          <input
            type="text"
            id="fname"
            name="fname"
            className="inputfield"
          ></input>
        </div>
        <div className="inputfield">
          <label>Etternavn...</label>
          <input type="text" id="lname" name="lname"></input>
        </div>
        <div className="inputfield">
          <label htmlFor="email">E-post...</label>
          <input type="text" id="email" name="epost"></input>
        </div>

        <div className="message">
          <label htmlFor="messagefield">Melding (valgfritt)</label>
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
