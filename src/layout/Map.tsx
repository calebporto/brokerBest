/*global google*/
import { Project } from "@/helpers/interfaces";
import { GoogleMap, Marker, useLoadScript, DrawingManager, MARKER_LAYER, Circle } from "@react-google-maps/api";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import style from '../styles/Map.module.css'
import Alert, { _throwAlert } from "./Alert";
import { LatLng } from "use-places-autocomplete";
import Modal from "./Modal";

enum OverlayType {
    /**
     * Specifies that the <code>DrawingManager</code> creates circles, and that
     * the overlay given in the <code>overlaycomplete</code> event is a circle.
     */
    CIRCLE = 'circle',
    /**
     * Specifies that the <code>DrawingManager</code> creates markers, and that
     * the overlay given in the <code>overlaycomplete</code> event is a marker.
     */
    MARKER = 'marker',
    /**
     * Specifies that the <code>DrawingManager</code> creates polygons, and that
     * the overlay given in the <code>overlaycomplete</code> event is a polygon.
     */
    POLYGON = 'polygon',
    /**
     * Specifies that the <code>DrawingManager</code> creates polylines, and
     * that the overlay given in the <code>overlaycomplete</code> event is a
     * polyline.
     */
    POLYLINE = 'polyline',
    /**
     * Specifies that the <code>DrawingManager</code> creates rectangles, and
     * that the overlay given in the <code>overlaycomplete</code> event is a
     * rectangle.
     */
    RECTANGLE = 'rectangle',
  }

export default function Map() {
    /*global google*/
    const router = useRouter()
    const libraries = useMemo(() => ['places', 'drawing'], [])
    const mapCenter = useMemo(() => ({ lat: -18.919455, lng: -48.277303 }), []);
    const mapOptions = useMemo<google.maps.MapOptions>(() => ({
        clickableIcons: true
    }), []);
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
        libraries: libraries as any
    });
    const [markers, setMarkers] = useState<Array<JSX.Element>>([])
    const [radius, setRadius] = useState<number>(5)
    const [alertShow, setAlertShow] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [alertType, setAlertType] = useState('danger')
    const [drawingManager, setDrawingManager] = useState<google.maps.drawing.OverlayType | null>(OverlayType.MARKER)
    const [circleCenter, setCircleCenter] = useState<{lat: number, lng: number} | null>(null)
    const [showModal, setShowModal] = useState(false)
    const [modalTitle, setModalTitle] = useState('')
    const [modalChildren, setModalChildren] = useState<JSX.Element | null>(null)


    function throwAlert(message:string, type: 'warning' | 'danger' | 'success') {
        _throwAlert(setAlertShow, setAlertMessage, setAlertType, message, type)
    }
    function markersGenerate(projects: Array<Project> | null) {
        function modalGenerate(project: Project) {
            setModalChildren(
                <div className={style.ModalBody}>
                    <div className={style.Description}>
                        <p>{project.description}</p>
                    </div>
                    <button className="btn btn-warning" onClick={() => {router.push(`/painel/empreendimentos?id=${project.id}`), setShowModal(false)}}>Abrir</button>
                </div>
            )
            setModalTitle(project.name)
            setShowModal(true)
        }
        if (!projects) {
            throwAlert('A busca falhou. Tente novamente mais tarde.', "danger")
            return
        }
        let markerList = [] as Array<JSX.Element>
        projects.forEach((project, index) => {
            if (project.latitude && project.longitude) {
                let marker = <Marker
                key={`marker${index.toString()}`}
                position={{lat: project.latitude, lng: project.longitude}}
                onClick={() => modalGenerate(project)}
                icon={'media/marker.png'}
                ></Marker>
                markerList.push(marker)
            }
        })
        setMarkers(markerList)
        setDrawingManager(null)
    }
    async function getProjectsByPosition(e: google.maps.Marker) {
        e.setMap(null)
        let position = e.getPosition()?.toJSON()
        let url = `/api/projects/get-projects-by-position?lat=${position?.lat}&lng=${position?.lng}&radius=${radius}`
        const projects = await fetch(url).then(response => {
            if (!response.ok) {
                return null
            } else return response.json().then((data: Array<Project>) => {
                return data
            })
        })
        setCircleCenter(position as LatLng)
        markersGenerate(projects)
    }

    return (
        isLoaded ? (
            <div>
                <Alert show={alertShow} handleShow={setAlertShow} message={alertMessage} type={alertType}></Alert>
                <div className={style.RadioInput}>
                    <div className={style.Input}>
                        <p>1º - Escolha o raio da busca:</p>
                        <input value={radius?.toString()} onChange={(e) => setRadius(parseInt(e.target.value))} type="range" className="form-range" min={0} max={50} step={1} id="radius"/>
                        <span>{radius?.toString() + ' ' + 'Km'}</span>

                    </div>
                    <div className={style.Input}>
                        <p>2º - Clique no local do mapa que você deseja buscar:</p>
                    </div>
                </div>
                <Modal shortModal={true} show={showModal} setShow={setShowModal} title={modalTitle}>
                    {modalChildren}
                </Modal>
                <GoogleMap
                    options={mapOptions}
                    zoom={13}
                    center={mapCenter}
                    mapTypeId={google.maps.MapTypeId.ROADMAP}
                    mapContainerStyle={{ width: '100%', height: '550px' }}
                    onLoad={() => console.log('Map Component Loaded...')}
                >
                    {[...markers]}
                    {circleCenter ? <Circle center={circleCenter} radius={radius * 1000}></Circle> : null}
                    <DrawingManager
                        onMarkerComplete={(e) => getProjectsByPosition(e)}
                        options={{
                            drawingControlOptions: {
                                drawingModes: [
                                    google.maps.drawing.OverlayType.MARKER
                                ]
                            }
                        }} drawingMode={drawingManager}></DrawingManager>
                </GoogleMap>
            </div>
        ) : (
            <div>Carregando ...</div>
        )
    )
}