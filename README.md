
![Logo](./app/src/assets/Leto%20-%20Text.svg)


# Leto

Der ultimative Terminplaner für junge Physiotherapeuten und neue Gründer: Einfach, Schnell und Preiswert!


[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

- [Leto](#leto)
  - [Features](#features)
  - [Demo](#demo)
  - [Authors](#authors)
  - [Tech Stack](#tech-stack)
  - [Support](#support)
  - [Feedback](#feedback)
  - [Installation](#installation)
  - [Acknowledgements](#acknowledgements)
  - [License](#license)
  - [Developer notes](#developer-notes)
    - [Inter-process communication](#inter-process-communication)

## Features

- Einarbeitung von Behandlungsrezepten
- Automatische Terminerstellung
- Verwaltung von Stammdaten
- Abrechnungserstellung

## Demo

*Comming soon!*


## Authors

- [@andreasnicklaus](https://www.github.com/andreasnicklaus)


## Tech Stack

Vue, Electron, Bootstrap, Sqlite3



## Support

For support, email nicklaus.leto@gmail.com.


## Feedback

If you have any feedback, please reach out to us at system.leto@gmail.com


## Installation

*Instructions comming soon!*
## Acknowledgements

 - Anna-Lena Fezer und Erik Weßelborg für die tolle Beratung
 - Johanna Wagner als Early Adopter
 - Sportpraxis Spiller

## License

[Apache 2.0](https://opensource.org/licenses/Apache-2.0)



## Developer notes

### Inter-process communication

1. `windows.ipc` allows invocation of functions anywhere in the site code.
2. *src/preload.js* loads all functions available through `ipcRenderer.invoke`. All parameters have to passed through.
3. *src/db/localDbEndpoints.js* handles the function calls using `ipcMain.handle`. The parameters for these functions are *event* and the passed *data*.