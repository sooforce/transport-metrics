# Transport Metrics Dashboard

A React-based desktop application for tracking fiber cuts, downtime exposure, protected vs unprotected routes, reroute success, and service continuity metrics to justify transport platform investment.

![Transport Metrics Dashboard](https://img.shields.io/badge/Platform-Windows%20%7C%20Linux-blue)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)
![Electron](https://img.shields.io/badge/Electron-28.0.0-47848F?logo=electron)

## Features

- **Incident Tracking**: Log and manage fiber cut incidents with full details
- **Real-time Metrics**: Track fiber cuts, downtime, reroute success, and protection rates
- **Service Continuity Profile**: Visualize protected vs unprotected outcome mix
- **Route Analysis**: Identify top routes by cut frequency, downtime, or weighted risk
- **Forecasting**: 30/90-day forecasts using SMA or exponential smoothing
- **PDF Export**: Generate comprehensive reports
- **Searchable**: Full-text search across all incident fields (ID, date, route, severity, protection status, etc.)

## Key Metrics

| Metric | Description |
|--------|-------------|
| Fiber Cuts | Total incidents in selected range |
| Total Downtime | Sum of all fiber cut downtime |
| Actual Downtime | Downtime from non-rerouted incidents only |
| Reroute Success | Percentage of incidents rerouted through transport |
| Incidents with Downtime | Unprotected, non-rerouted incidents with service impact |
| Gain from OTN | Downtime avoided via OTN transport rerouting |

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- npm (included with Node.js)

### Setup

```bash
# Clone the repository
git clone https://github.com/sooforce/transport-metrics.git
cd transport-metrics

# Install dependencies
npm install
```

## Usage

### Development Mode

```bash
# Run web development server
npm run dev

# Run Electron development mode
npm run electron:dev
```

### Build for Production

```bash
# Build for Windows
npm run electron:build:win

# Build for Linux
npm run electron:build:linux

# Build for both platforms
npm run electron:build:all
```

Built applications are output to the `release/` directory:
- Windows: `release/win-unpacked/`
- Linux: `release/linux-unpacked/`

## Project Structure

```
transport-metrics/
├── electron/           # Electron main process
│   ├── main.cjs       # Main entry point
│   └── preload.js     # Preload scripts
├── src/               # React source files
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── public/            # Static assets
├── release/           # Built applications
├── transport_fiber_cut_dashboard.jsx  # Main dashboard component
├── package.json
├── vite.config.js
└── index.html
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run electron:dev` | Run in Electron dev mode |
| `npm run electron:build:win` | Build Windows package |
| `npm run electron:build:linux` | Build Linux package |
| `npm run electron:build:all` | Build for all platforms |

## Technologies

- **React 18** - UI framework
- **Vite** - Build tool
- **Electron** - Desktop application framework
- **Recharts** - Charting library
- **jsPDF** - PDF generation
- **Lucide React** - Icon library

## Incident Data Structure

Each incident includes:
- `id` - Unique identifier (e.g., FC-2026-001)
- `date` - Incident date
- `route` - Affected route
- `cutType` - Cause of the cut
- `affectedLinks` - Number of affected links
- `downtimeMin` - Downtime in minutes
- `rerouted` - Whether traffic was rerouted
- `otnProtected` - Whether path was OTN protected
- `severity` - Incident severity level
- `site` - Segment location
- `capacityGbps` - Affected capacity

## License

MIT License

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
