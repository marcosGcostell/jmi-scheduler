import express from 'express';

import * as authController from '../controllers/auth.controller.js';
import * as timeEntryController from '../controllers/time-entries.controller.js';
import { checkRecordFields } from '../middleware/data-validators.js';
import filterQuery from '../middleware/filter-query.js';
import filterFieldsQuery from '../middleware/filter-fields-query.js';

const router = express.Router();
const recordFields = [
  { name: 'workSiteId', type: 'id', required: true, message: 'Obra' },
  {
    name: 'resourceId',
    type: 'id',
    required: true,
    message: 'Trabajador/equipo',
  },
  {
    name: 'appliedRuleId',
    type: 'id',
    required: false,
    message: 'Regla de horario aplicada',
  },
  {
    name: 'workDate',
    type: 'date',
    required: true,
    message: 'Fecha de jornada',
  },
  {
    name: 'startTime',
    type: 'date',
    required: true,
    message: 'Hora de inicio',
  },
  { name: 'endTime', type: 'date', required: false, message: 'Hora de fin' },
  { name: 'comment', type: 'text', required: false, message: 'Comentario' },
];

// Routes for logged in users
router.use(authController.protect);

router
  .route('/')
  .get(filterQuery, filterFieldsQuery, timeEntryController.getAllTimeEntries)
  .post(checkRecordFields(recordFields), timeEntryController.createTimeEntry);

router
  .route('/:id')
  .get(timeEntryController.getTimeEntry)
  .patch(
    checkRecordFields(recordFields, { exclude: ['all'] }),
    timeEntryController.updateTimeEntry,
  )
  .delete(timeEntryController.deleteTimeEntry);

router.route('/:id/fix-worked-minutes').patch(
  checkRecordFields([
    {
      name: 'workedMinutes',
      type: 'int',
      required: true,
      message: 'Horas trabajadas',
    },
  ]),
  timeEntryController.fixWorkedMinutes,
);

export default router;
