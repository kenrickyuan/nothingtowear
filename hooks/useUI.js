import { useContext } from "react"
import { UIContext } from "../contexts"

export const useUI = () => {
  const UI = useContext(UIContext)
  return UI
}
