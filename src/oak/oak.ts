import {BasicMinifierPlugin} from './plugins/basic-minifier';
import {ResponsiveStylesPlugin} from './plugins/responsive-styles';
import {CloudImagesPlugin} from './plugins/cloud-images';
import {NunjucksUtilsPlugin} from './plugins/nunjucks-utils';
import {Pod} from '@oak/oak/dist/src/cms/pod';

module.exports = function(pod: Pod) {
  // Minify rendered HTML.
  new BasicMinifierPlugin(pod);
  // Cloud images.
  new CloudImagesPlugin(pod);
  // Utility functions.
  new NunjucksUtilsPlugin(pod);
  // Responsive styles.
  new ResponsiveStylesPlugin(pod);
};
