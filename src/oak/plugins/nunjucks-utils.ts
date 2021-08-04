import {Pod} from '@oak/oak/dist/src/cms/pod';

/**
 * Utility functions.
 */
export class NunjucksUtilsPlugin {
  pod: Pod;

  constructor(pod: Pod) {
    this.pod = pod;

    const nunjucks = pod.getEngine('nunjucks');
  }
}
