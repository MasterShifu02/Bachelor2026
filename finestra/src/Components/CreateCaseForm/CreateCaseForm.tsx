import "./CreateCaseForm.css"
import { ActionButton } from "../ActionButton/ActionButton"
import { createCase } from "@/services/caseService"
import { getCurrentUser } from "@/services/authService"

function handlePrefillForm() {
  console.log("funksjon for å åpne forhåndsutfyllingsskjema")
}

function CreateCaseForm() {

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    console.log(e.currentTarget)
    const form = e.currentTarget as HTMLFormElement
    console.log(form)

    try {
      const user = await getCurrentUser()
      if (!user) throw new Error("Ikke logget inn")
      const formData = new FormData(form)

      const result = await createCase({
        first_name: formData.get("fname") as string,
        last_name: formData.get("lname") as string,
        email: formData.get("epost") as string,
        message: formData.get("messagefield") as string,
        created_by: user.id
      })

      if (result.mail_sent === false) {
        alert(result.warning || "Sak opprettet, men e-post ble ikke sendt.")
      } else {
        alert("Sak opprettet og mail sendt!")
      }

    } catch (err: unknown) {
      console.error(err)
      
      if (err instanceof Error) {
        alert(err.message)
      } else {
        alert("Noe gikk galt")
      }
    }
  }

  return (
    <>
      <h1 className="create-case-header">Opprett Sak</h1>

      <form className="form-container" onSubmit={handleSubmit}>

        <div className="inputSection">
          <label className="inputLabel">Fornavn...</label>
          <input type="text" name="fname" className="inputfield" />
        </div>

        <div className="inputSection">
          <label className="inputLabel">Etternavn...</label>
          <input type="text" name="lname" className="inputfield" />
        </div>

        <div className="inputSection">
          <label className="inputLabel">E-post...</label>
          <input type="text" name="epost" className="inputfield" />
        </div>

        <div className="message">
          <label className="inputLabel">Melding (valgfritt)</label>
          <textarea name="messagefield"></textarea>

          <div className="buttonSection">
            <ActionButton
              name="Forhåndsutfyll skjema"
              variant="secondary"
              type="button"
              onClick={handlePrefillForm}
            />
            <ActionButton name="Avbryt" variant="secondary" type="button" />
            <ActionButton name="Send" variant="primary" type="submit" />
          </div>
        </div>

      </form>
    </>
  )
}

export { CreateCaseForm }