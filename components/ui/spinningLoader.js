export const SpinningLoader = ({ big, dark }) => <div className={`${dark ? "dark" : ""} ${big ? "" : "scale-50"} lds-ring`}><div></div><div></div><div></div><div></div></div>