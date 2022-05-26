/**
 *
 * Asynchronously loads the component for PartOne
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
