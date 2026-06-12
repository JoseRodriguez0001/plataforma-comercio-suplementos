import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

// Imágenes de producto: Cloudflare R2 (S3-compatible) si hay credenciales;
// si no, almacenamiento local para desarrollo. Las credenciales reales van
// en variables de entorno (nunca en el repo) — ver módulos 13/14.
const useR2 = !!(process.env.S3_BUCKET && process.env.S3_ACCESS_KEY_ID)

const fileProvider = useR2
  ? {
      resolve: "@medusajs/medusa/file-s3",
      id: "r2",
      options: {
        file_url: process.env.S3_FILE_URL,
        access_key_id: process.env.S3_ACCESS_KEY_ID,
        secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
        region: process.env.S3_REGION || "auto",
        bucket: process.env.S3_BUCKET,
        endpoint: process.env.S3_ENDPOINT,
        // R2 usa path-style
        additional_client_config: {
          forcePathStyle: true,
        },
      },
    }
  : {
      resolve: "@medusajs/medusa/file-local",
      id: "local",
    }

// Auth: email/contraseña siempre; Google solo si hay credenciales (env).
// Activar Google en producción = definir GOOGLE_CLIENT_ID/SECRET (sin tocar código).
const authProviders: any[] = [
  { resolve: "@medusajs/medusa/auth-emailpass", id: "emailpass" },
]
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  authProviders.push({
    resolve: "@medusajs/medusa/auth-google",
    id: "google",
    options: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackUrl:
        process.env.GOOGLE_CALLBACK_URL ||
        "http://localhost:9000/auth/customer/google/callback",
    },
  })
}

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  modules: [
    {
      resolve: "@medusajs/medusa/auth",
      options: {
        providers: authProviders,
      },
    },
    {
      resolve: "./src/modules/supplement",
    },
    {
      resolve: "./src/modules/inventory-ext",
    },
    {
      resolve: "./src/modules/payment-audit",
    },
    {
      resolve: "./src/modules/fulfillment-ext",
    },
    {
      resolve: "./src/modules/compliance",
    },
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [fileProvider],
      },
    },
    {
      resolve: "@medusajs/medusa/payment",
      options: {
        providers: [
          // Proveedor de prueba para desarrollar el checkout sin credenciales.
          {
            resolve: "./src/modules/payment-mock",
            id: "mock",
          },
          // Yappy (Botón de Pago, Banco General). Credenciales por env.
          {
            resolve: "./src/modules/payment-yappy",
            id: "yappy",
            options: {
              merchant_id: process.env.YAPPY_MERCHANT_ID,
              secret: process.env.YAPPY_SECRET,
              mode: process.env.PAYMENT_MODE || "sandbox",
            },
          },
          // PagueloFacil (tarjetas / Sistema Clave). Credenciales por env.
          {
            resolve: "./src/modules/payment-paguelofacil",
            id: "paguelofacil",
            options: {
              cclw: process.env.PAGUELOFACIL_CCLW,
              api_key: process.env.PAGUELOFACIL_API_KEY,
              mode: process.env.PAYMENT_MODE || "sandbox",
            },
          },
        ],
      },
    },
  ],
})
