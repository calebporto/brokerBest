import { globalSignOut, setWindowDimensions } from "@/helpers/helpers";
import { GeneralContext, Session, User, WindowDimensions } from "@/helpers/interfaces";
import { contextUserModel, user } from "@/pages/api/models/userModels";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { createContext, ReactNode, useEffect, useState } from "react";


const initialData = {
    session: undefined,
    update: undefined,
    user: {
        id: null,
        alternative_id: null,
        name: null,
        email: null,
        tel: null,
        cep: null,
        endereco: null,
        num: null,
        complemento: null,
        bairro: null,
        cidade: null,
        uf: null,
        provider: null,
        is_admin: null,
        is_complete_data: null,
        lastUpdate: null
    },
    windowDimensions: {
        width: null,
        height: null
    },
    systemMessage: '',
    setSystemMessage: () => null,
    setUser: null,
    contextUpdate: () => null,
    loginRequire: () => null,
    checkPremiumView: false,
    setCheckPremiumView: () => null
}

export const AuthContext = createContext<GeneralContext>(initialData)


export function AuthProvider(props: {children: ReactNode}) {
    const [systemMessage, setSystemMessage] = useState<string>('')
    const [checkPremiumView, setCheckPremiumView] = useState<boolean>(false)
    const [contextUser, setContextUser] = useState<User>(initialData.user)
    const [contextWindowDimensions, setContextWindowDimensions] = useState<WindowDimensions>(initialData.windowDimensions)
    const { data: session, update} = useSession() as any
    const router = useRouter()
    
    useEffect(() => {
        const { width, height } = contextWindowDimensions
        if (!width || !height) {
            setWindowDimensions(setContextWindowDimensions)
        }
        window.removeEventListener('resize', () => setWindowDimensions(setContextWindowDimensions))
        window.addEventListener('resize', () => setWindowDimensions(setContextWindowDimensions))
    },[])

    useEffect(() => {
        if (session) {
            // Carrega os dados do usuário toda vez que fizer login
            contextUpdate()
        } else if (session === null) {
            // Quando fizer logoff, zera o context user
            setContextUser(initialData.user)
        }
    }, [session])

    function loginRequire(successCb: Function): void {
        // useEffect(() => {
        //     if (session === undefined) return
        //     if (session == null) {
        //         router.push('/entrar')
        //     } else {
        //         if (session.user.is_authenticated == false) {
        //             if (router.route != '/entrar/auth-email' && router.route != '/auth/e-mail-validate') {
        //                 router.push('/entrar/auth-email')
        //             }
        //         } else if (session.user.is_authenticated === undefined) {
        //             if (contextUser.is_complete_data) {
        //                 successCb()
        //             } else {
        //                 router.route != '/painel/completar-cadastro' ? router.push('/painel/completar-cadastro') : null
        //             }
        //         } else {
        //             successCb()
        //         }
        //     }
        // }, [session, contextUser])
    }

    function contextUpdate() {
        let date = new Date();
        if (!session) {
            return;
        }
        fetch('/api/user/context-update', {
            method: 'GET',
            headers: {
                'authorization': process.env.NEXT_PUBLIC_API_TOKEN as string
            }
        })
            .then(response => {
                if (!response.ok) {
                    if (response.status == 460) {
                        let userData = {
                            id: null,
                            alternative_id: null,
                            name: session.user.name,
                            email: session.user.email,
                            tel: null,
                            cep: null,
                            endereco: null,
                            num: null,
                            complemento: null,
                            bairro: null,
                            cidade: null,
                            uf:null,
                            provider: session.user.provider,
                            is_admin: false,
                            is_complete_data: false,
                            lastUpdate: date
                        };
                        let user = contextUserModel.safeParse(userData);
                        if (!user.success) {
                            const { errors } = user.error;
                            console.log(errors);
                            return;
                        }
                        setContextUser(user.data);
                        return;
                    } else {
                        console.log('logout')
                        globalSignOut();
                        return
                    }
                } else {
                    return response.json().then(data => {
                        if (session.user.alternative_id && session.user.alternative_id != data.alternative_id) {
                            console.log('logout')
                            globalSignOut();
                        }
                        let userData = {
                            id: data.id,
                            alternative_id: data.alternative_id,
                            name: data.name,
                            email: data.email,
                            tel: data.tel,
                            cep: data.cep,
                            endereco: data.address,
                            num: data.num,
                            complemento: data.complement,
                            bairro: data.district,
                            cidade: data.city,
                            uf: data.uf,
                            provider: data.provider,
                            is_admin: data.is_admin,
                            is_complete_data: data.is_complete_data,
                            lastUpdate: date
                        };
                        let user = contextUserModel.safeParse(userData);
                        if (!user.success) {
                            const { errors } = user.error;
                            console.log(errors);
                            return;
                        }
                        setContextUser(user.data);
                        if (!session.user.id) {
                            update({id: data.id})
                        }
                        if (session.user.is_admin == null || session.user.is_admin != data.is_admin) {
                            update({is_admin: data.is_admin})
                        }
                        return;
                    });
                }
            })
            
    }

    const context = {
        session: session,
        update: update,
        user: contextUser,
        windowDimensions: contextWindowDimensions,
        systemMessage: systemMessage,
        setSystemMessage: setSystemMessage,
        setUser: setContextUser,
        contextUpdate: contextUpdate,
        loginRequire: loginRequire,
        checkPremiumView: checkPremiumView,
        setCheckPremiumView: setCheckPremiumView
    }

    return (
        <AuthContext.Provider value={context}>
            {props.children}
        </AuthContext.Provider>
    )
}