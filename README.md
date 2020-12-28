[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![License][license-shield]][license-url]

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/opeik/runback">
    <img src="https://raw.githubusercontent.com/opeik/runback/dd6ae2fb89757746fa2251d18b39de86e1f88aa2/src/dashboard/runback/_img/runback-logo-light.svg" alt="Logo" width="120" height="120">
  </a>

  <h3 align="center">Runback</h3>

  <p align="center">
    Broadcast graphics for fighting games
    <br />
    <a href="https://github.com/opeik/runback/releases/latest">Download</a>
    ·
    <a href="https://github.com/opeik/runback/issues">Report Bug</a>
    ·
    <a href="https://github.com/opeik/runback/issues">Request Feature</a>
  </p>
</p>

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#screenshots">Screenshots</a></li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#building">Building</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

## About The Project

![Runback Screen Shot 1][product-screenshot1]

Runback is a broadcast graphics system designed for fighting games tournaments, featuring:

- Scoreboard and commentator overlays
- Player management
- Player import and export
- Player detail overrides for on-the-fly editing
- Auto gamertag Latinization for non-Latin scripts
- smash.gg integration
  - Import tournament entrant data
- Light and dark mode
- Windows, macOS, Linux support

### Built With

- [NodeCG](https://github.com/nodecg/nodecg)
- [Electron](https://github.com/electron/electron)
- [Vue.js](https://github.com/vuejs/vue)

## Screenshots

![Runback Screen Shot 2][product-screenshot2]
![Runback Screen Shot 3][product-screenshot3]

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

- git
- npm
- yarn
- node

### Building

1. Clone NodeCG
   ```sh
   git clone https://github.com/nodecg/nodecg
   ```
2. Install NodeCG npm packages

   ```sh
   cd nodecg && npm install --production
   ```

3. Clone runback

   ```sh
   cd bundles && git clone https://github.com/opeik/runback
   cd runback && git submodule update --init --recursive
   ```

4. Install runback npm packages

   ```sh
   yarn install
   ```

5. Build runback

   ```sh
   yarn watch
   ```

6. Start the NodeCG server

   ```sh
   node ../..
   ```

7. Open http://localhost:9090/

## Usage

### Installing

- Download runback from the [releases page](https://github.com/opeik/runback/releases/latest)
- Once installed, open runback; the Dashboard tab will open

### Importing overlays

- Open the Graphics tab
- Click and drag from the "Drag into OBS" button into OBS for the overlay you wish to import
  - If you're on macOS, click and drag isn't supported in OBS; use the settings below
- Edit the newly created Browser Source, set:
  - FPS to **60**
  - Shutdown source when not visible to **ON**
  - Refresh browser when scene becomes available to **ON**
- [Screenshot](https://i.imgur.com/AsOmUPY.png) for reference

### Setup smash.gg integration

- Create a [smash.gg API key](https://developer.smash.gg/docs/authentication)
- Enter the key in Settings→Set API Keys

### Import players from smash.gg

- Open the Dashboard tab
- Click "Set Tournament" and enter the tournament URL
- Click "Fetch Entrants"
  - The players will be imported and can be found in the Players tab

## Roadmap

See the [open issues](https://github.com/opeik/runback/issues) for a list of proposed features (and known issues).

## Contributing

Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/amazing-feature`)
3. Commit your Changes (`git commit -m 'Add some amazing feature'`)
4. Push to the Branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Distributed under the GPLv3 License. See `LICENSE.md` for more information.

[contributors-shield]: https://img.shields.io/github/contributors/opeik/runback.svg?style=for-the-badge
[contributors-url]: https://github.com/opeik/runback/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/opeik/runback.svg?style=for-the-badge
[forks-url]: https://github.com/opeik/runback/network/members
[stars-shield]: https://img.shields.io/github/stars/opeik/runback.svg?style=for-the-badge
[stars-url]: https://github.com/opeik/runback/stargazers
[issues-shield]: https://img.shields.io/github/issues/opeik/runback.svg?style=for-the-badge
[issues-url]: https://github.com/opeik/runback/issues
[license-shield]: https://img.shields.io/github/license/opeik/runback.svg?style=for-the-badge
[license-url]: https://github.com/opeik/runback/blob/master/LICENSE.md
[product-screenshot1]: https://i.imgur.com/lBs6iE1.png
[product-screenshot2]: https://i.imgur.com/Brtca30.png
[product-screenshot3]: https://i.imgur.com/cAYt0CP.png
