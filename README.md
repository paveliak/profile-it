# profile-it
This actions is intended to profile `macOS` job using [Instruments](https://developer.apple.com/tutorials/instruments) profile templates. Profiling starts at the point when action is used and continutes until job ends. Trace is uploaded as job artifact. 

# Available parameters
| Argument         | Description              | default            |
|------------------|--------------------------|--------------------|
| `name`           | Name of the job artifact | `xtrace`           |
| `template`       | Profile template         | `Activity Monitor` |

# Usage

Collect profile using default settings:
```
jobs:
  test:
    runs-on: macos-latest
    steps:
    - uses: paveliak/profile-it@v1
```
