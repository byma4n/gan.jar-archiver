<p align="center">
  <img src="src/renderer/sulapfoto_nobg.png" alt="Gan.Jar Logo" width="200"/>
</p>

# Gan.Jar

> **Modern Archive Manager** — Fast, Clean, and Powerful.

Gan.Jar is a desktop archive management tool built with **Node.js** and **Electron**.  
It features a hybrid **".gjar"** container format while maintaining full compatibility with standard ZIP files. Designed with a clean, flat aesthetic and a focus on developer experience.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20Linux%20%7C%20macOS-lightgrey.svg)

---

## 📥 Download

Don't want to build from source? Download the latest installable version for Windows:

### [Download Gan.Jar for Windows (.exe)](https://github.com/Start-With-A-Name/ganjar/releases/latest)

_Supported Platforms: Windows 10/11 (x64)_

---

## ✨ Features

- **Hybrid Container**: Custom `.gjar` format for your archives.
- **Universal Compatibility**: Full support for standard `.zip` files.
- **Flat Design**: Modern, distraction-free UI with dark mode support.
- **Drag & Drop**: Intuitive file handling (Coming Soon).
- **Fast Core**: Built on high-performance Node.js streams.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js 20+
- **Container**: Electron
- **Architecture**: Layered (UI -> IPC -> Service -> Core)
- **Engines**: `archiver`, `extract-zip`

---

## 🚀 Development

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ganjar.git

# Go into the app directory
cd ganjar

# Install dependencies
npm install
```

### Running Locally

```bash
npm start
```

### Building for Production

To create the `.exe` installer:

```bash
npm run build
```

The output file will be located in the `dist/` directory.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

<p align="center">
  Made with ❤️ by <b>Gan.Jar Team</b>
</p>
