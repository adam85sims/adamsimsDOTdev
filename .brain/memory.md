# Memory and Decision Log

- *Decision:* Cleaned up `index.html` to only load `js/bundle.css` and removed individual CSS files, since they are compiled via `scripts/bundle.sh`.
- *Decision:* Added a GitHub Action to automatically run `bundle.sh` and deploy to GitHub Pages, so we don't have to rely on checked-in build artifacts.
