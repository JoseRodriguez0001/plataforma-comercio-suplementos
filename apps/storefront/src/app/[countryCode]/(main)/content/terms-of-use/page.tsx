import { Metadata } from "next"
import ContentPage from "@modules/content/templates/content-page"

export const metadata: Metadata = {
  title: "Términos de uso",
  description: "Condiciones de uso de la tienda en línea de NATURZEN.",
}

export default function TermsOfUsePage() {
  return (
    <ContentPage
      eyebrow="Legal"
      title="Términos de uso"
      subtitle="Las condiciones que rigen el uso de nuestra tienda."
      updatedAt="junio de 2026"
    >
      <p>
        Al usar este sitio y realizar compras en NATURZEN, aceptas los
        siguientes términos y condiciones.
      </p>

      <h2>1. Productos</h2>
      <p>
        Vendemos suplementos alimenticios y productos de bienestar. Nuestros
        productos no son medicamentos y no sustituyen el consejo médico
        profesional. Consulta a tu médico antes de iniciar cualquier suplemento,
        especialmente si estás embarazada, lactando o bajo tratamiento.
      </p>

      <h2>2. Precios y pagos</h2>
      <p>
        Todos los precios se muestran en dólares estadounidenses (USD) e
        incluyen el ITBMS cuando aplica. Aceptamos los métodos de pago
        disponibles al momento de la compra. Nos reservamos el derecho de
        corregir errores de precio antes de confirmar un pedido.
      </p>

      <h2>3. Envíos y entregas</h2>
      <p>
        Realizamos envíos dentro de Panamá. Los tiempos de entrega son
        estimados y pueden variar según la zona y la disponibilidad. Te
        notificaremos por correo el estado de tu pedido.
      </p>

      <h2>4. Cambios y devoluciones</h2>
      <p>
        Si tu producto llega dañado o presenta un defecto, contáctanos dentro de
        los días indicados en nuestra página de atención al cliente para
        gestionar un cambio o reembolso.
      </p>

      <h2>5. Cuentas de usuario</h2>
      <p>
        Eres responsable de mantener la confidencialidad de tu cuenta y
        contraseña, así como de las actividades realizadas con ella.
      </p>

      <h2>6. Cambios a estos términos</h2>
      <p>
        Podemos actualizar estos términos en cualquier momento. La versión
        vigente será siempre la publicada en esta página.
      </p>

      <p className="text-sm text-grey-40">
        Este documento es una plantilla inicial y debe ser revisada por un
        asesor legal antes de su publicación definitiva.
      </p>
    </ContentPage>
  )
}
