import type { HttpContext } from '@adonisjs/core/http'
import { SimpleMessagesProvider } from '@vinejs/vine'
import Ficha from '#models/ficha'
import { fichaValidator, fichaMessages } from '#validators/ficha_validator'

export default class FichasController {
  // ── index ─────────────────────────────────────────────────────────────────────

  async index({ response }: HttpContext) {
    const fichas = await Ficha.query()
      .where('activa', true)
      .orderBy('codigo', 'asc')

    return response.ok({ success: true, data: fichas })
  }

  // ── store ─────────────────────────────────────────────────────────────────────

  async store({ request, response }: HttpContext) {
    const payload = await request.validateUsing(fichaValidator, {
      messagesProvider: new SimpleMessagesProvider(fichaMessages, {}),
    })

    const ficha = await Ficha.create({
      codigo: payload.codigo,
      nombre: payload.programa,
      activa: true,
    })

    return response.created({ success: true, data: ficha })
  }
}
