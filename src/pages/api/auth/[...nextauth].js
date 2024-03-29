import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import Credentials from "next-auth/providers/credentials";
import { credentials as credentialsModel, payloadUserSendMail } from '../models/userModels'
import { checkPass } from '../helpers/bcrypt'
import { sendAuthMail } from '../services/userServices'

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_AUTH_ID,
            clientSecret: process.env.GOOGLE_AUTH_SECRET
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_ID,
            clientSecret: process.env.FACEBOOK_SECRET
        }),
        Credentials({
            name: "Credentials",
            type: "credentials",
            async authorize(credentials, req) {
              try {
                if (credentials.authorization !== process.env.NEXT_PUBLIC_API_TOKEN) {
                  console.log('Autorization error')
                  return null
                }
                const response = credentialsModel.safeParse(credentials)
                if (!response.success) {
                  const { error } = response.error;
                  console.log('erros ' + error)
                  return null
                }
                const getUser = fetch(`${process.env.API_URL}/auth/login`, {
                  method: 'POST',
                  body: JSON.stringify(response.data),
                  headers: {
                    'Content-Type': 'application/json',
                    'authenticator': process.env.AUTH_KEY
                  }
                })
                .then(response => response.json())
                .then(data => {
                  data.is_authenticated = false
                  return data
                })
                const user = await getUser
                console.log(credentials)
                console.log(user)
                if (!user || !await checkPass(credentials.password, user.hash)) {
                  return null
                }
                
                console.log('até aqui')
                const payload = payloadUserSendMail.safeParse(user)
                if (!payload.success) {
                  const { error } = payload.error;
                  console.log('erros ' + error)
                  return null
                }
                const sendMail = await sendAuthMail(payload.data)
                if (sendMail) {
                  return user
                }
                return null
                
              } catch (error) {
                console.log('erro ' + error)
                return null
              }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, account, trigger, session }) {
          // Persist the OAuth access_token to the token right after signin
          if (account) {
            token.accessToken = account.access_token
            if (account.provider == 'credentials') {
              token.provider = 1
            } else {
              token.provider = account.provider
            }
          }
          if (user) {
            token.id = user.id
            token.alternative_id = user.alternative_id
            token.is_authenticated = user.is_authenticated
            token.is_admin = user.is_admin
            let data = new Date()
            data.setHours(data.getHours() + 1)
            token.last_email_exp = data
          }
          if (trigger === "update") {
            if (session?.id) {
              token.adminId = session.id
            }
            if (session?.is_admin != null && session?.is_admin != undefined) {
              token.is_admin = session.is_admin
            }
            if (session?.is_authenticated) {
              token.is_authenticated = session.is_authenticated
            }
            if (session?.last_email_exp) {
              token.last_email_exp = session.last_email_exp
            }
          }
          return token
        },
        async session({ session, token, user }) {
          // Send properties to the client, like an access_token from a provider.
          session.accessToken = token.accessToken
          if (token.adminId) {
            session.user.id = token.adminId
          }
          if (token.is_admin != null && token.is_admin != undefined) {
            session.user.is_admin = token.is_admin
          }
          if (session?.user) {
            if (token.provider == 'google') {
              session.user.provider = 2
              session.user.is_authenticated = true
            } else if (token.provider == 'facebook') {
              session.user.provider = 3
              session.user.is_authenticated = true
            } else {
              session.user.id = token.id
              session.user.is_admin = token.is_admin
              session.user.alternative_id = token.alternative_id
              session.user.provider = token.provider
              session.user.is_authenticated = token.is_authenticated
              session.user.last_email_exp = token.last_email_exp
            }
          }
          return session
        },
        async signIn({ user, account, profile, email, credentials }) {
          const isAllowedToSignIn = true
          if (isAllowedToSignIn) {
            return true
          } else {
            // Return false to display a default error message
            return false
            // Or you can return a URL to redirect to:
            // return '/unauthorized'
          }
        }
    },
    secret: process.env.NEXT_AUTH_SECRET
}
export default NextAuth(authOptions)