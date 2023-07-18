import Spinner from "./Spinner"

export default function WaitingWindow() {
    return (
        <div className='WaitingWindow'>
            <div className="WaitingCenter">
                <Spinner color="warning" is_short={false} show={true}/>
            </div>
        </div>
    )
}