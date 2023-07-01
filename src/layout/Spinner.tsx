export const Spinner = (props: {show: boolean, color: string, is_short: boolean}) => {
    const spinnerSm = props.is_short ? ' spinner-border-sm' : ''
    return props.show ? (
        <>
            <div className={`spinner-border${spinnerSm} text-${props.color}`} role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </>
    ) : null
}
export default Spinner