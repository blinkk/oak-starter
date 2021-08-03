import {Pod} from '@oak/oak/dist/src/cms/pod';
import {createHash} from 'crypto';

const DEFAULT_BREAKPOINTS = {
  all: 'all',
  mobile: '@media (max-width: 767px)',
  tablet: '@media (min-width: 768px) and (max-width: 1023px)',
  tablet_gt: '@media (min-width: 768px)',
  tablet_lt: '@media (max-width: 1023px)',
  laptop: '@media (min-width: 1024px) and (max-width: 1439px)',
  laptop_gt: '@media (min-width: 1024px)',
  laptop_lt: '@media (max-width: 1439px)',
  desktop: '@media (min-width: 1440px)',
};

/**
 * Plugin for responsive styles.
 *
 * Usage:
 *
 * Add the plugin to `oak.ts`:
 *
 * ```
 * // oak.ts
 * import {ResponsiveStylesPlugin} from './plugins/responsive-styles';
 *
 * module.exports = function(pod) {
 *   new ResponsiveStylesPlugin(pod);
 * };
 * ```
 *
 * Define responsive styles in your yaml (or elsewhere):
 *
 * ```
 * # /content/pages/home.yaml
 * fields:
 *   foo:
 *     responsive_styles:
 *       desktop: 'max-width: 300px'
 * ```
 *
 * Inject a `responsiveStyles` variable into the `doc` context variable.
 *
 * ```
 * <!-- top of base.njk -->
 * {{doc|responsiveStyles}}
 * ```
 *
 * Within your template, apply responsive styles to any elements that require
 * them:
 *
 * ```
 * <!-- /views/pages/home.njk -->
 * {% extends "/views/base.njk" %}
 * {% block main %}
 *   {% set responsive_styles = doc.fields.foo.responsive_styles %}
 *   <div {{doc.responsiveStyles.add(responsive_styles)}}>
 *     ...
 *   </div>
 * {% endblock %}
 * ```
 *
 * Then render the styles at the bottom of your base template:
 *
 * ```
 * <!-- bottom of base.njk -->
 * <style>{{doc.responsiveStyles.css()}}</style>
 * ```
 */
export class ResponsiveStylesPlugin {
  pod: Pod;
  config: any;
  breakpoints: any;

  constructor(pod: Pod, config?: any) {
    this.pod = pod;
    this.config = config || {};
    this.breakpoints = this.config.breakpoints || DEFAULT_BREAKPOINTS;

    const nunjucks = pod.getEngine('nunjucks');
    nunjucks.addFilter('responsiveStyles', (doc: any) => {
      if (!doc.responsiveStyles) {
        doc.responsiveStyles = new ResponsiveStyles(this.breakpoints);
      }
      return doc.responsiveStyles;
    });
  }
}

/**
 * ResponsiveStyles is a class that converts a responsive styles config into
 * CSS that can be rendered into the page.
 *
 * The `add()` method returns an element attribute used to tag the responsive
 * style with an identifier, and `styles()` method renders the CSS to the page.
 */
class ResponsiveStyles {
  /**
   * A map of style id => CSS string. The style id is a short hash of the
   * CSS string, which is used to de-dupe multiple styles that contain the
   * same CSS.
   */
  styles: Record<string, string> = {};

  /**
   * A map of breakpoint name => media query. Use a media query of `all` for
   * global styles with no media query.
   */
  breakpoints: any;

  constructor(breakpoints: any) {
    this.breakpoints = breakpoints;
  }

  /**
   * Adds a responsive style config. The config object should be key-value pairs
   * where the keys are the name of the breakpoint and value is the CSS style to
   * apply for that breakpoint.
   *
   * For example:
   *
   * ```
   * const rs = new ResponsiveStyles();
   * rs.add({
   *   all: 'max-width: 500px',
   *   desktop: 'max-width: 1024px',
   * });
   * ```
   */
  add(config: any) {
    if (!config) {
      return;
    }

    const styles: string[] = [];
    const hash = createHash('sha256');
    Object.keys(config).forEach(breakpoint => {
      const mediaQuery = this.breakpoints[breakpoint];
      if (!mediaQuery) {
        console.log(`unknown breakpoint: ${breakpoint}`);
        return;
      }
      let style;
      if (mediaQuery === 'all') {
        style = `[data-rs="{{id}}"]{${config[breakpoint]}}`;
      } else {
        style = `${mediaQuery}{[data-rs="{{id}}"]{${config[breakpoint]}}}`;
      }
      hash.update(style);
      styles.push(style);
    });

    const id = hash.digest('hex').slice(0, 8);
    const css = styles.map(style => {
      return style.replace('{{id}}', id);
    }).join(' ');
    this.styles[id] = css;
    return id;
  }

  /**
   * Renders the CSS styles added to the object.
   */
  css() {
    const styles = Object.values(this.styles);
    if (styles.length === 0) {
      return '';
    }
    const css = styles.join(' ');
    return css;
  }
}
