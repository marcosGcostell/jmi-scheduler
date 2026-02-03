import express from 'express';

import * as authController from '../controllers/auth.controller.js';
import * as contractorController from '../controllers/contractor.controller.js';
import { checkRecordFields } from '../middleware/data-validators.js';
import filterQuery from '../middleware/filter-query.js';

const router = express.Router();
const requiredFields = [
  { name: 'name', type: 'text', required: true, message: 'Nombre' },
  {
    name: 'fullName',
    type: 'text',
    required: false,
    message: 'Nombre completo',
  },
];

// Routes for logged in users
router.use(authController.protect);

router
  .route('/')
  .get(filterQuery, contractorController.getAllContractors)
  .post(
    checkRecordFields(requiredFields),
    contractorController.createContractor,
  );

router
  .route('/:id')
  .get(contractorController.getContractor)
  .patch(
    checkRecordFields(requiredFields, { exclude: ['all'] }),
    contractorController.updateContractor,
  );

// Routes for admins only
router.use(authController.restrictTo('admin'));

router.route('/:id').delete(contractorController.deleteContractor);

export default router;
