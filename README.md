# Windows95Folio (Windows 95–style Portfolio)

This project is a single-page, “Windows 95” themed portfolio built with plain HTML, CSS, and JavaScript.

## Quick Start

1. Keep the folder structure exactly as-is:
   - `index.html`
   - `css/style.css`
   - `js/script.js`
2. Open `index.html` in your browser (double-click is usually enough).
3. Use the desktop icons (double-click) or the **Start** menu to open windows.

No build step or dependencies are required.

## What You Can Do (In-App)

- **About / My Computer**: Shows your intro text and “spec” rows.
- **My Projects**: A grid populated from `PROJECTS` in `js/script.js`.
- **Skills.txt**: A Notepad-style window with a prefilled skills template.
- **Contact.exe**: A contact form that validates input and shows a confirmation message (it does not actually send messages yet).
- **Recycle Bin**: A placeholder window.

On page load, the boot screen animation plays and then the **About** window auto-opens.

## Customization Guide

### 1) Update the About window

Edit the placeholder content inside `index.html`:

- Replace `[Your Name]`
- Update the “Role / Based in / Status / Interests” rows in the `.spec-box`

### 2) Update your projects

All projects come from this array in `js/script.js`:

- `const PROJECTS = [ ... ]`

Each project object supports:

- `id` (unique key used internally)
- `icon` (emoji or short character)
- `name`
- `desc` (shown in project detail)
- `tech` (array of strings rendered as tags)
- `links` (object of `{ label: url }`, rendered as external links)

Tip: The project grid is built automatically by `buildProjectGrid()` when the page loads.

### 3) Update Contact social links

In `index.html`, inside the `Contact.exe` window, update the anchors:

- `GitHub`
- `LinkedIn`
- `Twitter/X`

Right now, they default to `href="#"`. Replace `#` with your real URLs.

### 4) Update the “Skills.txt” contents

In `index.html`, find the Notepad textarea under `win-skills` and edit its text.

## How the UI Works (So You Can Extend It)

### Windows / programs

Windows are defined in `index.html` as elements like:

- `div#win-about`
- `div#win-projects`
- `div#win-skills`
- `div#win-contact`
- `div#win-bin`
- `div#win-projdetail`

The JavaScript window manager in `js/script.js` provides:

- `openWin(id)` / `closeWin(id)`
- `minimizeWin(id)` / `maximizeWin(id)`
- drag behavior via the title bar (`startDrag(...)`)
- taskbar buttons automatically created for open/minimized windows

### Project details

Double-clicking a project opens the `win-projdetail` window using `openProjectDetail(id)`, which fills:

- title and icon
- description
- tech tags
- links

## Building Upon It (Suggested Next Steps)

### Add a new “program” window

1. Create a new window in `index.html`:
   - `div id="win-yourId" class="win" ...`
   - Give it a `win-tb` title bar and a `win-body` content area.
2. Add a desktop icon:
   - a `.d-icon` with `ondblclick="openWin('yourId')"`
3. Add a Start menu item:
   - another `.sm-item` that calls `openWin('yourId')`
4. If the window needs custom behavior, add that JS function to `js/script.js` and call it from your HTML buttons/handlers.

Most of the window “chrome” (dragging, z-index, taskbar) already works for any `win-*` id.

### Make the Projects data external (JSON)

Right now, projects are hardcoded in `js/script.js`.
If you want cleaner content management:

- Move project data into a JSON file (ex: `data/projects.json`)
- Load it with `fetch(...)` on page load
- Then render the grid the same way (`buildProjectGrid`)

If you start using `fetch` for local files, consider running a tiny local web server to avoid browser file/CORS limitations.

### Implement real Contact submission

`sendContact()` currently:
- validates required fields
- clears the inputs
- shows a “Message Sent!” dialog

To make it real, choose one:

- **Backend endpoint**: POST the message to your server and then show success/failure.
- **Email link**: generate a `mailto:` link with subject/body and open the user’s email client.

### Improve authenticity / UX

Common enhancements you can add:

- keyboard controls (focus + shortcuts for window actions)
- more “native” behaviors (e.g., icon selection persistence)
- small animation and sound effects (careful with accessibility)
- responsive adjustments for smaller screens

## License

If you want, you can add a license file (e.g. MIT) and mention it here.

