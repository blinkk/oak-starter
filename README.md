## <project_name>

<project_name> is a project powered by [Oak](https://github.com/blinkk/oak), a
CMS with website development tools and production serving.


### Setup

At a minimum, you will need:

- [Google Cloud SDK](https://cloud.google.com/sdk/docs/quickstart)
- [Node](https://github.com/nvm-sh/nvm#installing-and-updating) v14 or greater

After installing the `gcloud` command, make sure you're logged into the correct
account by running:

```bash
gcloud auth list
```

Request access to Oak's private NPM repo from [s@blinkk.com](mailto:s@blinkk.com)
and then run the following to set up local access to the repo:

```bash
make install
```

The above command will create a `.npmrc` file which tells NPM where to find the
`@oak/oak` project and how to access it.


### Development

Start an Oak server.

```bash
make run
```

Sync global strings sheet.

```bash
make strings
```


### Style Guide

#### Use BEM for CSS names

Block elements should use lowerCamelCase instead of dash-names. Modifiers should
use --doubleDash.

```html
<!-- Do: -->
<div class="foo foo--modifier">
  <div class="foo__barBaz"></div>
</div>

<!-- Don't: -->
<div class="foo foo-modifier">
  <div class="foo__bar-baz"></div>
</div>
```

#### Use consistent naming across CSS names and Nunjucks files

For example:

* CSS name: heroSimple
* Partial file: /views/partials/heroSimple.njk
* SASS file: /src/sass/partials/_heroSimple.sass

#### Use clear names for partials

Avoid generic terms for partials where its purpose is unclear.

```html
<!-- Don't: -->
<div class="feature">...</div>

<!-- Do: -->
<div class="featuredBlogPost">...</div>
```

Avoid reusing the same partial for layouts that are not at all similar. Opt to
create a new partial for it instead, even if the DOM structure is more or less
the same.

```html
<!-- Don't: -->
<div class="banner banner--5050WithImageOnLeft">...</div>
<div class="banner banner--fullWidthImage">...</div>

<!-- Do: -->
<div class="banner5050">...</div>
<div class="bannerFullWidth">...</div>
```

#### Optimize image sizes

For PNGs and JPGs, store images on GCS and use the `|cloudImage` filter when
possible. Use in conjunction with the `picture()` macro for automatic image
resizing for each responsive breakpoint.

```yaml
myimage:
  url: gs://bucket/path/to/image.png
```

```html
{% from "/views/macros/picture.njk" import picture %}

<div class="foo">
  <div class="foo__image">
    {{picture(myimage|cloudImage)}}
  </div>
</div>
```
