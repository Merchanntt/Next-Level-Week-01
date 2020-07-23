import express from 'express'
import {celebrate, Joi} from 'celebrate'

import multer from 'multer'
import multerConfig from './config/multer'

import PointControllers from './controllers/PointsController'
import ItemsControllers from './controllers/ItemsControllers'

const route = express.Router()
const upload = multer(multerConfig)

const pointControllers = new PointControllers();
const itemsControllers = new ItemsControllers();

route.get('/items', itemsControllers.index)

route.get('/points', pointControllers.index)
route.get('/points/:id', pointControllers.show)

route.post('/points',
  upload.single('image'),
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().required().email(),
      whatsapp: Joi.number().required(),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      city: Joi.string().required(),
      uf: Joi.string().required().max(2),
      items: Joi.string().required(),
    })
  }, {
    abortEarly: false
  }),
  pointControllers.create)

export default route;
