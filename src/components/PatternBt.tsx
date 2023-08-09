import style from '../styles/PatternBt.module.css'

const Button = (props: {name: string, clickAction: Function, addClass?: string}) => {
    return (
        <div className={`${style.Button} ${props.addClass ? style.MarginZero : ''}`}>
            <button onClick={() => props.clickAction()}>{props.name}</button>
        </div>
    )
}
export default Button