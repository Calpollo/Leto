
![Logo](./app/src/assets/Leto%20-%20Text.svg)


# Leto

Der ultimative Terminplaner für junge Physiotherapeuten und neue Gründer: Einfach, Schnell und Preiswert!

![Version](https://img.shields.io/github/v/release/Calpollo/leto?style=for-the-badge&logo=github)
![Workflow status](https://img.shields.io/github/actions/workflow/status/Calpollo/leto/docker-images.yml?style=for-the-badge&logo=github)
[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg?style=for-the-badge&logo=github)](https://opensource.org/licenses/Apache-2.0)
![License](https://img.shields.io/github/last-commit/Calpollo/leto?style=for-the-badge&logo=github)
![Github Repo size](https://img.shields.io/github/repo-size/Calpollo/leto?style=for-the-badge&logo=github)
[![Docker Image Size](https://img.shields.io/docker/image-size/letoapp/leto/latest?style=for-the-badge&logo=docker)](https://hub.docker.com/repository/docker/letoapp/leto/general)


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
- Terminerinnerungen per E-Mail
- Automatische Terminerstellung
- Verwaltung von Stammdaten
- Abrechnungserstellung

## Demo

Log dich unter [https://app.leto.andreasnicklaus.de]() ein oder lade ein Release herunter und probiere [Leto](https://leot.andreasnicklaus.de) aus!

| Benutzername | Passwort |
| ------------ | -------- |
| testNutzer   | test123  |
| basisNutzer  | basis123 |

## Authors

- [@andreasnicklaus](https://www.github.com/andreasnicklaus)


## Tech Stack

<a href="https://vuejs.org/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/vuejs/vuejs-original-wordmark.svg" alt="vuejs" width="40" height="40"/> </a>
<a href="https://www.electronjs.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/electron/electron-original.svg" alt="electron" width="40" height="40"/> </a>
<a href="https://getbootstrap.com" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/bootstrap/bootstrap-plain-wordmark.svg" alt="bootstrap" width="40" height="40"/> </a>
<a href="https://www.sqlite.org/" target="_blank" rel="noreferrer"> <img src="https://www.vectorlogo.zone/logos/sqlite/sqlite-icon.svg" alt="sqlite" width="40" height="40"/> </a>

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