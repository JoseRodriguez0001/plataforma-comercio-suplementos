import { Metadata } from "next"
import ContentPage from "@modules/content/templates/content-page"

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Cómo NATURZEN recopila, usa y protege tus datos personales.",
}

export default function PrivacyPolicyPage() {
  return (
    <ContentPage
      eyebrow="Legal"
      title="Política de privacidad"
      subtitle="Tu privacidad es importante para nosotros."
      updatedAt="junio de 2026"
    >
      <p>
        En NATURZEN nos comprometemos a proteger tu información personal. Esta
        política explica qué datos recopilamos, cómo los usamos y qué derechos
        tienes sobre ellos.
      </p>

      <h2>1. Información que recopilamos</h2>
      <p>Cuando compras o creas una cuenta podemos recopilar:</p>
      <ul>
        <li>Datos de contacto: nombre, correo electrónico y teléfono.</li>
        <li>Dirección de envío y facturación.</li>
        <li>Detalles de tus pedidos e historial de compras.</li>
        <li>
          Datos técnicos básicos (cookies, tipo de dispositivo) para que la
          tienda funcione correctamente.
        </li>
      </ul>
      <p>
        <strong>No almacenamos los datos de tu tarjeta.</strong> Los pagos se
        procesan a través de proveedores autorizados (Yappy, PagueloFácil).
      </p>

      <h2>2. Cómo usamos tu información</h2>
      <ul>
        <li>Procesar y enviar tus pedidos.</li>
        <li>Comunicarnos contigo sobre el estado de tu compra.</li>
        <li>Brindarte atención al cliente.</li>
        <li>Mejorar nuestros productos y tu experiencia de compra.</li>
      </ul>

      <h2>3. Con quién compartimos tu información</h2>
      <p>
        Solo compartimos tus datos con terceros necesarios para operar la
        tienda: empresas de mensajería para la entrega y procesadores de pago.
        No vendemos tu información personal.
      </p>

      <h2>4. Tus derechos</h2>
      <p>
        Puedes solicitar acceso, corrección o eliminación de tus datos
        personales escribiéndonos a{" "}
        <a href="mailto:hola@naturzen.com">hola@naturzen.com</a>.
      </p>

      <h2>5. Contacto</h2>
      <p>
        Si tienes dudas sobre esta política, contáctanos en{" "}
        <a href="mailto:hola@naturzen.com">hola@naturzen.com</a>.
      </p>

      <p className="text-sm text-grey-40">
        Este documento es una plantilla inicial y debe ser revisada por un
        asesor legal antes de su publicación definitiva.
      </p>
    </ContentPage>
  )
}
