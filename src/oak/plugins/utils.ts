import {Pod} from '@oak/oak/dist/src/cms/pod';

/**
 * Utility functions.
 */
export class UtilsPlugin {
  pod: Pod;

  constructor(pod: Pod) {
    this.pod = pod;

    const nunjucks = pod.getEngine('nunjucks');
    nunjucks.addFilter('joinLines', joinLines)
  }
}

function joinLines(s: string, sep?: string) {
  return s.split('\n').join(sep || ' ');
}
