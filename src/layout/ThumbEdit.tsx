import { ChangeEvent, Dispatch, MouseEvent, SetStateAction, useEffect, useState } from "react";
import style from '../styles/ThumbEdit.module.css'
import Image from "next/image";
import Modal from "./Modal";

export default function ThumbEdit(props: {
    link: string | null | undefined,
    imgLoading: boolean,
    setFile: Dispatch<SetStateAction<FileList | null>>,
    size?: 'G' | 'M' | 'P'
}) {
    const [newImgLink, setNewImgLink] = useState<string | null>(null)
    const [divClass, setDivClass] = useState<string>()
    const [imgSize, setImgSize] = useState<Array<number>>([1000, 300])
    const [changeText, setChangeText] = useState<string>()

    useEffect(() => {
        if (!props.size || props.size == 'G') {
            if (divClass != style.ThumbG) {
                setDivClass(style.ThumbG)
                setImgSize([1000,300])
                setChangeText('Alterar Imagem (Medidas: 1000x300px)')
            }
        } else if (props.size == 'M') {
            if (divClass != style.ThumbM) {
                setDivClass(style.ThumbM)
                setImgSize([750,300])
                setChangeText('Alterar Imagem (Medidas: 750x300px)')
            }
        } else {
            if (divClass != style.ThumbP) {
                setDivClass(style.ThumbP)
                setImgSize([350,250])
                setChangeText('Alterar Imagem (Medidas: 350x250px)')
            }
        }
    }, [])
    function changeImg(fileList: FileList | null) {
        if (fileList && fileList.length > 0) {
            setNewImgLink(fileList[0].name)
            props.setFile(fileList)
        }

    }
    return (
        <div className={divClass}>
            <Modal show={props.imgLoading} title={'Carregando...'} shortModal={true}>
                <div style={{width: '100%', height: '100%', display: 'flex'}}>
                    <div className="spinner-border spinner-border-lg text-warning" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </Modal>
            <div className={style.ChangeBt}>
                <p style={{fontSize: props.size == 'P' ? '16px' : '25px'}}>{changeText}</p>
                <input accept="image/*" onChange={(e) => changeImg(e.target.files)} type="file" name="newImg" id="newImg" />
            </div>
            <Image alt="" src={props.link || ''} height={imgSize[1]} width={imgSize[0]}></Image>
            <p>{newImgLink}</p>
        </div>
    )
}