import * as TimeEntry from '../../models/time-entries.model.js';
import AppError from '../../utils/app-error.js';

export default async (id, client = undefined) => {
  const timeEntry = await TimeEntry.getTimeEntry(id, client);
  if (!timeEntry?.id) {
    throw new AppError(404, 'No se encuentra este registro horario.');
  }

  return timeEntry;
};
