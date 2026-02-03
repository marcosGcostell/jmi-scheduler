import * as CompanyAttendance from '../../models/attendance.model.js';
import AppError from '../../utils/app-error.js';

export default async (id, client = undefined) => {
  const attendance = await CompanyAttendance.getAttendance(id, client);
  if (!attendance?.id) {
    throw new AppError(404, 'No se encuentra este registro de asistencia.');
  }

  return attendance;
};
