# imageware
### Problem
Often cameras store in the EXIF metadata the orientation of the picture, rather than modify the image itself to permanently rotate it. Browsers typically don't take EXIF metadata into account when drawing a picture, and some image viewers don't too
(taken from and more details here: https://github.com/TryGhost/Ghost/issues/1688).

### Solution
I decided to try and tackle the EXIF problem, so I grabbed [jimp](https://github.com/oliver-moran/jimp) and built a small demo. It's running on node and is pure JS, so no 'hard to install' dependencies. Also, I'm thinking of turning this into express middleware.

* Demo: https://imageware.herokuapp.com/
* Example images: https://github.com/recurser/exif-orientation-examples
* Repo: https://github.com/ekulabuhov/imageware
