import {Pod} from '@oak/oak/dist/src/cms/pod';
import {NunjucksEngine} from '@oak/oak/dist/src/engines/nunjucksengine';

/**
 * Basic HTML minifier that removes empty lines and trims any leading
 * whitespace.
 *
 * Usage:
 *
 * ```
 * import {BasicMinifierPlugin} from './plugins/basic-minifier';
 *
 * module.exports = function(pod) {
 *   new BasicMinifierPlugin(pod);
 * };
 */
export class BasicMinifierPlugin {
  pod: Pod;
  nunjucks: NunjucksEngine;

  constructor(pod: Pod) {
    this.pod = pod;
    this.nunjucks = this.pod.getEngine('nunjucks');
    this.nunjucks.setHtmlMinifier((html: string) => this.minify(html));
  }

  minify(html: string): string {
    const lines: string[] = [];
    html.split('\n').forEach(line => {
      line = line.trim();
      if (line) {
        lines.push(line);
      }
    });
    return lines.join('\n') + '\n';
  }
}
