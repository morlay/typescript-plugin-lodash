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


## Notice

No support `* as _` 