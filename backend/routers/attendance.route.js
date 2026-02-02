import express from 'express';

import * as authController from '../controllers/auth.controller.js';
import * as companyAttendanceController from '../controllers/attendance.controller.js';
import { checkRecordFields } from '../middleware/data-validators.js';
import filterQuery from '../middleware/filter-query.js';
import filterFieldsQuery from '../middleware/filter-fields-query.js';

const router = express.Router();
const recordFields = [
  { name: 'workSiteId', type: 'id', required: true, message: 'Obra' },
  { name: 'companyId', type: 'id', required: true, message: 'Empresa' },
  { name: 'date', type: 'date', required: true, message: 'Fecha' },
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
  .get(
    filterQuery,
    filterFieldsQuery,
    companyAttendanceController.getCompanyAttendanceBy,
  )
  .post(
    checkRecordFields(recordFields),
    companyAttendanceController.createCompanyAttendance,
  );

router
  .route('/:id')
  .get(companyAttendanceController.getCompanyAttendance)
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
    companyAttendanceController.updateCompanyAttendance,
  )
  .delete(companyAttendanceController.deleteCompanyAttendance);

export default router;
