## Runback

Broadcast graphics app for fighting games.

### Setup

```
git clone https://github.com/nodecg/nodecg
cd nodecg && npm install --production
cd bundles && git clone https://github.com/opeik/runback
cd runback && git submodule update --init --recursive
yarn install
```

- For live development:
  - `yarn watch`
- For production:
  - `yarn build`
