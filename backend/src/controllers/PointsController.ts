import { Request, Response } from 'express'
import knex from '../database/connection'

class PointsController {
  async index(request: Request, response: Response) {
    const { city, uf, items } = request.query;

    const parsedItems = String(items).split(',').map(item => Number(item.trim()))

    const points = await knex('points')
      .join('items_point', 'point_id', '=', 'items_point.point_id')
      .whereIn('items_point.items_id', parsedItems )
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('points.*')

      const serializedPoints = points.map(point => ({
        ...point,
        image_url: `http://192.168.0.3:3333/uploads/${point.image}`
      }))

    return response.json(serializedPoints)
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const point = await knex('points').where('id', id).first();

    if (!point) {
      return response.status(400).json({message: 'item not found'})
    }

    const serializedPoints = {
      ...point,
      image_url: `http://192.168.0.3:3333/uploads/${point.image}`
    }

    const items = await knex('items')
      .join('items_point', 'items.id', '=', 'items_point.items_id')
      .where('items_point.point_id', id )
      .select('items.title')



    return response.json({point: serializedPoints, items})
  }

  async create(request: Request, response: Response) {
    const {
      name,
      email,
      whatsapp,
      longitude,
      latitude,
      city,
      uf,
      items
    } = request.body;

    const tsx = await knex.transaction()

    const point = {
      image: 'image_url',
      name,
      email,
      whatsapp,
      longitude,
      latitude,
      city,
      uf
    }

    const insertedIds = await tsx('points').insert(point)

    const point_id = insertedIds[0]

    const itemsPoint = items
      .split(',')
      .map((items: string) => Number(items.trim()))
      .map((items_id: number) => {
      return {
        items_id,
        point_id
      }
    })

    await tsx('items_point').insert(itemsPoint)

    await tsx.commit()

    return response.json({
      id: point_id,
      ...point
    })
  }
}

export default PointsController
