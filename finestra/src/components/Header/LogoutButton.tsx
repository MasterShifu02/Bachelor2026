import { logout } from "../../services/authService"

type LogoutButtonProps = {
  onLogout: () => void;
};

export default function LogoutButton({ onLogout }: LogoutButtonProps) {

  async function handleLogout() {

    await logout()
    onLogout()

  }

  return (

    <button onClick={handleLogout}>
      Log out
    </button>

  )

}