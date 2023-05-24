import style from '../styles/PatternBt.module.css'

const Button = (props: {name: string, clickAction: Function}) => {
    return (
        <div className={style.Button}>
            <button onClick={() => props.clickAction()}>{props.name}</button>
        </div>
    )
}
export default Button