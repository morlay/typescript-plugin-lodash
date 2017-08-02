## typescript-plugin-lodash

A simple typescript transform to cherry-pick Lodash modules so you don’t have to.

### Example

Transforms
```
import { map } from 'lodash';
import { add } from 'lodash/fp';

const addOne = add(1);
map([1, 2, 3], addOne);
```
roughly to

```
import * as map from 'lodash/map';
import * as add from 'lodash/fp/add';

const addOne = add(1);
map([1, 2, 3], addOne);
```

## Usage 

like https://github.com/Igorbek/typescript-plugin-styled-components

```ts
// 1. import default from the plugin module
import { createLodashTransformer } from 'typescript-plugin-lodash');

// 2. add getCustomTransformer method to the loader config
var config = {
    ...
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    ... // other loader's options
                    getCustomTransformers: () => ({ before: [createLodashTransformer()] })
                }
            }
        ]
    }
    ...
};
```

## Notice

No support `* as _` 