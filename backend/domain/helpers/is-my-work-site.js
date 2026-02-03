import * as WorkSite from '../../models/work-site.model.js';

export default async (userId, workSiteId, client) => {
  if (!workSiteId) return false;

  const userWorkSites = await WorkSite.findMyWorkSites(userId, null, client);
  const userWorkSitesIds = userWorkSites.map(ws => ws.id);
  return userWorkSitesIds.includes(workSiteId);
};
