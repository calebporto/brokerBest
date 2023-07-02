import { ReactNode, useEffect, useState } from 'react'
import style from '../styles/DriveBar.module.css'
import Container from './Container'

export default () => {
    const [bairroSelect, setBairroSelect] = useState(false)
    const [regiaoSelect, setRegiaoSelect] = useState(false)
    const [construtoraSelect, setContrutoraSelect] = useState(false)
    const [filterType, setFilterType] = useState('')
    const [itemList, setItemList] = useState<ReactNode>(null)

    useEffect(() => {
        if (filterType == '') return
        getData()

    }, [filterType])

    function listGenerate(data: Array<string>) {
        if (data.length == 0) {
            return null
        }
        let bts = data.map((item, index) => {
            return (
                <div className={`btn btn-outline-dark ${style.ListBt}`} key={index}>{item}</div>
            )
        })
        return (
            <>
             {bts}
            </>
        )
    }

    function getData() {
        fetch(`/api/projects/drive-list?type=${filterType}`, {
            headers: {
                'authorization': process.env.NEXT_PUBLIC_API_TOKEN as string
            }
        })
        .then(response => {
            if (!response.ok) return null
            else {
                return response.json()
                .then((data: Array<string>) => {
                    setItemList(listGenerate(data))
                })
            }
        })
    }

    function porBairro() {
        if (bairroSelect) return
        
        setBairroSelect(true)
        setRegiaoSelect(false)
        setContrutoraSelect(false)
        setFilterType('bairro')
    }
    function porRegiao() {
        if (regiaoSelect) return
        
        setRegiaoSelect(true)
        setBairroSelect(false)
        setContrutoraSelect(false)
        setFilterType('regiao')
    }
    function porConstrutora() {
        if (construtoraSelect) return
        
        setContrutoraSelect(true)
        setBairroSelect(false)
        setRegiaoSelect(false)
        setFilterType('construtora')
    }
    return (
        <div style={{width: '100%', display: 'flex', height: 'auto'}}>
            <Container>
                <div className={style.DriveBar}>
                    <p className={style.Title}>
                        Drive Imobiliário
                    </p>
                    <div className={style.Filter}>
                        <button onClick={() => porBairro()} className={"btn " + `${bairroSelect ? 'btn-dark' : 'btn-warning'}`}>Por Bairro</button>
                        <button onClick={() => porRegiao()} className={"btn " + `${regiaoSelect ? 'btn-dark' : 'btn-warning'}`}>Por Região</button>
                        <button onClick={() => porConstrutora()} className={"btn " + `${construtoraSelect ? 'btn-dark' : 'btn-warning'}`}>Por Construtora</button>
                    </div>
                    <div className={style.List}>
                        { itemList ? itemList : <p style={{width: '100%', textAlign: 'center'}}>Nenhum dado encontrado</p>}
                    </div>
                </div>
            </Container>
        </div>
    )
}