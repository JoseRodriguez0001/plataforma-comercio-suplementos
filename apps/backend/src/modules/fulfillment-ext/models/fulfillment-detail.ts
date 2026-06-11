import { model } from "@medusajs/framework/utils"

/**
 * Datos de cumplimiento manual (lo que Medusa no modela). Uno a uno con el
 * Fulfillment nativo (module link). Envío: carrier + fecha de envío + guía/etc.
 * Retiro: fecha "listo" + fecha de retiro.
 */
export const FulfillmentDetail = model.define("fulfillment_detail", {
  id: model.id().primaryKey(),
  method: model.enum(["shipping", "pickup"]),
  carrier_id: model.text().nullable(), // referencia a ShippingCarrier
  tracking_number: model.text().nullable(),
  shipped_at: model.dateTime().nullable(),
  estimated_delivery_at: model.dateTime().nullable(),
  delivery_note: model.text().nullable(),
  ready_for_pickup_at: model.dateTime().nullable(),
  picked_up_at: model.dateTime().nullable(),
})
