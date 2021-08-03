import {BasicMinifierPlugin} from './plugins/basic-minifier';
import {ResponsiveStylesPlugin} from './plugins/responsive-styles';
import {CloudImagesPlugin} from './plugins/cloud-images';
import {Pod} from '@oak/oak/dist/src/cms/pod';

module.exports = function(pod: Pod) {
  // Add a "responsiveStyles" object to the doc context object.
  new ResponsiveStylesPlugin(pod);
  // Minify rendered HTML.
  new BasicMinifierPlugin(pod);
  // Cloud images.
  new CloudImagesPlugin(pod);
};
