import "./CreateCaseForm.css"
import { ActionButton } from "../ActionButton/ActionButton"
import { createCase } from "@/services/caseService"
import { getCurrentUser } from "@/services/authService"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

function handlePrefillForm() {
  console.log("funksjon for å åpne forhåndsutfyllingsskjema")
}

function CreateCaseForm() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget

    try {
      setLoading(true)

      const user = await getCurrentUser()
      if (!user) throw new Error("Ikke logget inn")

      const formData = new FormData(form)

      const result = await createCase({
        first_name: formData.get("fname") as string,
        last_name: formData.get("lname") as string,
        email: formData.get("epost") as string,
        phone: formData.get("phone") as string || null,
        message: formData.get("messagefield") as string,
        created_by: user.id
      })

      if (!result.success) {
        throw new Error("Kunne ikke opprette sak")
      }

      if (result.mail_sent === false) {
        toast.warning("Sak opprettet, men e-post ble ikke sendt")
      } else {
        toast.success("Sak opprettet og mail sendt!")
      }

      form.reset()

      // redirect etter 1.5s
      setTimeout(() => {
        navigate("/dashboard")
      }, 1500)

    } catch (err: unknown) {
      console.error(err)

      const message =
        err instanceof Error ? err.message : "Noe gikk galt"

      toast.error(message)

    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <h1 className="create-case-header">Opprett Sak</h1>

      <form className="form-container" onSubmit={handleSubmit}>
        <div className="inputSection">
          <label className="inputLabel">Fornavn...</label>
          <input type="text" name="fname" className="inputfield" required />
        </div>

        <div className="inputSection">
          <label className="inputLabel">Etternavn...</label>
          <input type="text" name="lname" className="inputfield" required />
        </div>

        <div className="inputSection">
          <label className="inputLabel">E-post...</label>
          <input type="email" name="epost" className="inputfield" required />
        </div>

        <div className="inputSection">
          <label className="inputLabel">Telefon (valgfritt)...</label>
          <input type="text" name="phone" className="inputfield" />
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

            <ActionButton
              name="Avbryt"
              variant="secondary"
              type="button"
              disabled={loading}
            />

            <ActionButton
              name={loading ? "Sender..." : "Send"}
              variant="primary"
              type="submit"
              disabled={loading}
            />
          </div>
        </div>
      </form>
    </>
  )
}

export { CreateCaseForm }