import { ChangeEvent, Dispatch, MouseEvent, SetStateAction, useState } from "react";
import style from '../styles/ThumbEdit.module.css'
import Image from "next/image";
import Modal from "./Modal";

export default function ThumbEdit(props: {
    link: string | null | undefined,
    imgLoading: boolean,
    setFile: Dispatch<SetStateAction<FileList | null>>
}) {
    const [newImgLink, setNewImgLink] = useState<string | null>(null)

    function changeImg(fileList: FileList | null) {
        if (fileList && fileList.length > 0) {
            setNewImgLink(fileList[0].name)
            props.setFile(fileList)
        }

    }
    return (
        <div className={style.Thumb}>
            <Modal show={props.imgLoading} title={'Carregando...'} shortModal={true}>
                <div style={{width: '100%', height: '100%', display: 'flex'}}>
                    <div className="spinner-border spinner-border-lg text-warning" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </Modal>
            <div className={style.ChangeBt}>
                <p>Clique para alterar</p>
                <input accept="image/*" onChange={(e) => changeImg(e.target.files)} type="file" name="newImg" id="newImg" />
            </div>
            <Image alt="" src={props.link || ''} height={724} width={1200}></Image>
            <p>{newImgLink}</p>
        </div>
    )
}