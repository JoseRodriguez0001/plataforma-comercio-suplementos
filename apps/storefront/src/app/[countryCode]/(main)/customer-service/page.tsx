import { Metadata } from "next"
import ContentPage from "@modules/content/templates/content-page"

export const metadata: Metadata = {
  title: "Atención al cliente",
  description: "Preguntas frecuentes y ayuda sobre tus compras en NATURZEN.",
}

export default function CustomerServicePage() {
  return (
    <ContentPage
      eyebrow="Ayuda"
      title="Atención al cliente"
      subtitle="Estamos aquí para ayudarte con tu compra y tu bienestar."
    >
      <h2>Preguntas frecuentes</h2>

      <h3>¿Cómo hago un pedido?</h3>
      <p>
        Agrega los productos al carrito, ve a "Pagar" y completa tus datos de
        envío y pago. Recibirás un correo de confirmación con el detalle.
      </p>

      <h3>¿Cuáles son los métodos de pago?</h3>
      <p>
        Aceptamos pagos con Yappy y tarjeta de crédito/débito a través de
        PagueloFácil. Todos los pagos se procesan de forma segura.
      </p>

      <h3>¿Cuánto tarda el envío?</h3>
      <p>
        Realizamos envíos a todo Panamá. El tiempo estimado es de 3 a 5 días
        hábiles según tu ubicación. Te avisaremos por correo cuando tu pedido
        sea despachado.
      </p>

      <h3>¿Puedo cambiar o devolver un producto?</h3>
      <p>
        Sí. Si tu producto llega dañado o con algún defecto, escríbenos y lo
        cambiamos o reembolsamos. Revisa los detalles en nuestros{" "}
        <a href="/content/terms-of-use">términos de uso</a>.
      </p>

      <h3>¿Los productos son seguros?</h3>
      <p>
        Trabajamos con productos de calidad y, cuando aplica, con su registro
        sanitario. Aun así, los suplementos no sustituyen el consejo médico;
        consulta a tu médico antes de usarlos.
      </p>

      <h2>¿Necesitas más ayuda?</h2>
      <p>
        Escríbenos a <a href="mailto:hola@naturzen.com">hola@naturzen.com</a> o
        visita nuestra página de <a href="/contact">contacto</a>. Con gusto te
        atendemos.
      </p>
    </ContentPage>
  )
}
