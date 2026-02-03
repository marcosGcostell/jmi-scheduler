import * as Contractor from '../../models/contractor.model.js';
import AppError from '../../utils/app-error.js';

export default async (id, client = undefined) => {
  const contractor = await Contractor.getContractor(id, client);
  if (!contractor) {
    throw new AppError(404, 'La subcontrata no existe.');
  }

  return contractor;
};
