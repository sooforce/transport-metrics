# Transport Dashboard VM Deployment Guide (LAN Access)

This guide shows how to deploy your dashboard from zero to production-like LAN access using a Linux VM (Ubuntu 22.04/24.04), so anyone in the same network can open it from a browser.

## 1. Target Result

At the end, users on your LAN will open:

- `http://<VM_IP>`

or (if you keep direct Vite dev server):

- `http://<VM_IP>:5173`

Recommended approach is Nginx + production build (`http://<VM_IP>`).

---

## 2. Prerequisites

- A VM running Ubuntu.
- VM network adapter set to one of:
  - `Bridged` (best for direct LAN reachability)
  - `NAT + Port Forwarding` (works but extra setup)
- You can SSH into VM or use VM terminal.

---

## 3. VM Network Setup

## 3.1 Set VM Adapter

In your hypervisor (VirtualBox/VMware/Hyper-V):

1. Power off VM.
2. Open VM network settings.
3. Set adapter to `Bridged`.
4. Start VM.

## 3.2 Find VM IP

Inside VM:

```bash
ip a
```

Find your interface IP (example: `192.168.1.80`).

Test from your host machine:

```bash
ping 192.168.1.80
```

If ping fails, check firewall and adapter mode.

---

## 4. Install Base Software on VM

```bash
sudo apt update
sudo apt install -y curl git ufw nginx
```

Install Node.js LTS (20.x):

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

---

## 5. Prepare the React Project

If your project already has `package.json`, skip to step 6.

If you only have `transport_fiber_cut_dashboard.jsx`, create a Vite React app:

```bash
npm create vite@latest transport-dashboard -- --template react
cd transport-dashboard
npm install
```

Copy your dashboard file into `src/transport_fiber_cut_dashboard.jsx`.

Then edit `src/App.jsx` to render it:

```jsx
import TransportFiberCutDashboard from "./transport_fiber_cut_dashboard";

export default function App() {
  return <TransportFiberCutDashboard />;
}
```

If your dashboard uses UI aliases like `@/components/...`, ensure those components and alias config exist in your project. If not, replace those imports with your local components or plain HTML equivalents.

Install required packages used by your file:

```bash
npm install recharts jspdf lucide-react
```

---

## 6. Add/Edit/Delete Data in UI

Your dashboard now supports:

- Add incident
- Edit incident
- Delete incident

Use the form in the Incident Register section.

Notes:

- IDs must be unique for new records.
- Edit mode locks Incident ID to avoid accidental key changes.

---

## 7. Quick LAN Test (Dev Mode)

Run Vite in listen-all mode:

```bash
npm run dev -- --host 0.0.0.0 --port 5173
```

From another device in same network open:

- `http://<VM_IP>:5173`

If not reachable, allow firewall port:

```bash
sudo ufw allow 5173/tcp
sudo ufw status
```

---

## 8. Production-Like Deployment (Recommended)

## 8.1 Build static files

```bash
npm run build
```

This creates `dist/`.

## 8.2 Serve with Nginx

Remove default site and create your site config:

```bash
sudo rm -f /etc/nginx/sites-enabled/default
sudo tee /etc/nginx/sites-available/transport-dashboard >/dev/null <<'EOF'
server {
    listen 80;
    server_name _;

    root /var/www/transport-dashboard;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF
```

Copy build files:

```bash
sudo mkdir -p /var/www/transport-dashboard
sudo cp -r dist/* /var/www/transport-dashboard/
```

Enable site and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/transport-dashboard /etc/nginx/sites-enabled/transport-dashboard
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx
```

Allow HTTP through firewall:

```bash
sudo ufw allow 80/tcp
sudo ufw enable
sudo ufw status
```

Now open from any LAN device:

- `http://<VM_IP>`

---

## 9. Updating the Website Later

When you change code:

```bash
npm run build
sudo cp -r dist/* /var/www/transport-dashboard/
sudo systemctl reload nginx
```

---

## 10. Optional: Run Dev Server as a Service

If you want `npm run dev` auto-start (not recommended for production), use systemd:

```bash
sudo tee /etc/systemd/system/transport-dashboard-dev.service >/dev/null <<'EOF'
[Unit]
Description=Transport Dashboard Vite Dev Server
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/transport-dashboard
ExecStart=/usr/bin/npm run dev -- --host 0.0.0.0 --port 5173
Restart=always
Environment=NODE_ENV=development

[Install]
WantedBy=multi-user.target
EOF
```

Then:

```bash
sudo systemctl daemon-reload
sudo systemctl enable transport-dashboard-dev
sudo systemctl start transport-dashboard-dev
sudo systemctl status transport-dashboard-dev
```

Use your actual username and project path.

---

## 11. Troubleshooting Checklist

- Cannot open from LAN:
  - Confirm VM is bridged and got LAN IP.
  - Confirm service is listening on `0.0.0.0`, not `127.0.0.1`.
  - Confirm firewall allows port 80 (or 5173).
  - Test from VM itself: `curl http://localhost`.
  - Test from host: `curl http://<VM_IP>`.

- Blank page / 404 on refresh:
  - Ensure Nginx config includes: `try_files $uri $uri/ /index.html;`

- After changes nothing updates:
  - Re-run `npm run build`.
  - Re-copy `dist/*` to `/var/www/transport-dashboard/`.
  - Reload Nginx.

---

## 12. Security Minimum

For internal LAN use, at least do:

```bash
sudo apt update && sudo apt upgrade -y
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw status
```

If SSH is not needed from LAN, close port 22.

---

## 13. Final Validation

From another LAN device:

1. Open `http://<VM_IP>`.
2. Add a new incident from form.
3. Edit same incident.
4. Delete it.
5. Confirm charts/summary update immediately.

If these pass, deployment is complete.
