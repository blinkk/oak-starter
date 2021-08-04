#!/bin/bash

set -e

if [ -z "$1" ]; then
  echo "usage: $0 <partialId>"
  echo "e.g.: $0 heroSimple"
  exit 1
fi

name="$1"

cat > views/partials/${name}.njk <<EOF
{% from "/views/macros/picture.html" import picture %}

<div class="${name}{% if partial.class %} {{partial.class}}{% endif %}">
</div>
EOF
echo "views/partials/${name}.njk"

cat > src/sass/partials/${name}.sass <<EOF
.${name}
EOF
echo "src/sass/partials/${name}.sass"

echo "@import \"./partials/${name}\"" >> src/sass/main.sass
echo "src/sass/main.sass"
