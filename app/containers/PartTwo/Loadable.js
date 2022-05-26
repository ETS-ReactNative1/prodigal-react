/**
 *
 * Asynchronously loads the component for PartTwo
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
