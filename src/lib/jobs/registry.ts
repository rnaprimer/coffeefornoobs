import { JobCategory, WorkerModule } from './types';
import searchWorker from './workers/search.worker';
import cacheWorker from './workers/cache.worker';
import affiliateWorker from './workers/affiliate.worker';
import mediaWorker from './workers/media.worker';
import seoWorker from './workers/seo.worker';
import systemWorker from './workers/system.worker';

// The Worker Registry maps job categories to their respective worker modules
const registry: Record<string, WorkerModule> = {
  SEARCH: searchWorker,
  CACHE: cacheWorker,
  AFFILIATE: affiliateWorker,
  MEDIA: mediaWorker,
  SEO: seoWorker,
  SYSTEM: systemWorker,
};

export function getWorkerForCategory(category: JobCategory): WorkerModule | undefined {
  return registry[category];
}
