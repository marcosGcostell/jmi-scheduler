import express from 'express';

import * as authController from '../controllers/auth.controller.js';
import * as attendanceController from '../controllers/attendance.controller.js';
import { checkRecordFields } from '../middleware/data-validators.js';
import filterQuery from '../middleware/filter-query.js';
import filterFieldsQuery from '../middleware/filter-fields-query.js';

const router = express.Router();
const recordFields = [
  { name: 'workSiteId', type: 'id', required: true, message: 'Obra' },
  { name: 'contractorId', type: 'id', required: true, message: 'Subcontrata' },
  { name: 'workDate', type: 'date', required: true, message: 'Fecha' },
  {
    name: 'workersCount',
    type: 'int',
    required: true,
    message: 'Cantidad de trabajadores',
  },
];

// Routes for logged in users
router.use(authController.protect);

router
  .route('/')
  .get(filterQuery, filterFieldsQuery, attendanceController.getAllAttendances)
  .post(checkRecordFields(recordFields), attendanceController.createAttendance);

router
  .route('/:id')
  .get(attendanceController.getAttendance)
  .patch(
    checkRecordFields(
      [
        {
          name: 'workersCount',
          type: 'int',
          required: true,
          message: 'Cantidad de trabajadores',
        },
      ],
      { exclude: ['all'] },
    ),
    attendanceController.updateAttendance,
  )
  .delete(attendanceController.deleteAttendance);

export default router;
