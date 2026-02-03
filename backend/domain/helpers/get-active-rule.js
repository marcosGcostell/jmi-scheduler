import * as WorkRule from '../../models/work-rule.model.js';
import * as Schedule from '../../models/schedule.model.js';

export default async (company, workSiteId, workDate, client) => {
  const companyIsMain = company.is_main;
  let appliedRuleId = null;
  let mainSchedule = null;

  if (!companyIsMain) {
    const workRules = await WorkRule.getConditionedWorkRules(
      workSiteId,
      company.id,
      { from: workDate, to: workDate },
      client,
    );
    appliedRuleId = workRules.shift()?.id;
  }

  if (companyIsMain)
    mainSchedule = await Schedule.getCompanySchedules(
      company.id,
      workDate,
      client,
    );

  if (companyIsMain && !mainSchedule)
    throw new AppError(
      400,
      'La empresa principal debe tener siempre un horario activo. Avise a un administrador.',
    );

  return { appliedRuleId, mainSchedule };
};
