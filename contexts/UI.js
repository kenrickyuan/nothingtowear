import { createContext, useMemo, useReducer } from "react"

const initialState = {
  displayErrorModal: false,
  errorModalMessage: "",
}

export const UIContext = createContext(initialState)

function uiReducer(state, action) {
  switch (action.type) {
    case "OPEN_ERROR_MODAL": {
      return {
        ...state,
        errorModalMessage: action.payload,
        displayErrorModal: true,
      }
    }
    case "CLOSE_ERROR_MODAL": {
      return {
        ...state,
        displayErrorModal: false,
      }
    }
  }
}

export const UIProvider = ({ children }) => {
  const [state, dispatch] = useReducer(uiReducer, initialState)

  const openErrorModal = (message) => dispatch({ type: "OPEN_ERROR_MODAL", payload: message})
  const closeErrorModal = () => dispatch({ type: "CLOSE_ERROR_MODAL" })

  const value = useMemo(
    () => ({
      ...state,
      openErrorModal,
      closeErrorModal
    }),
    [state]
  )

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}
