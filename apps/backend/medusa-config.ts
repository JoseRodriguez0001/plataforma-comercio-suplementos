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
      resolve: "./src/modules/supplement",
    },
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [fileProvider],
      },
    },
  ],
})
