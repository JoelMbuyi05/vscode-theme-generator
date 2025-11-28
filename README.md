## vscode-theme-generator

The VS Code Theme Generator is a web application that allows users to create customized Visual Studio Code color themes.
It provides a clean UI, live preview, and built-in exporting features, making it simple to design unique themes without manually editing JSON files.

# 🛠 Technologies Used

* HTML
* TailwindCSS
* JavaScript
* LocalStorage
* JSON

# ⭐ Features

* Color pickers for:
  * Editor background
  * Editor text
  * Keybords
  * Strings
  * Functions
  * Sidebar background
  * Sidebar text
* Live Preview
  * Instand visual preview of how the code editor and sidebar will look.
* Theme Persistence
  * Save Theme - stores your theme in localStorage
  * Load Theme - reloads saved theme instantly
* Export to JSON
  Exports a fully valid VS Code theme file ready to install or publish.
* Random Theme Generator
  Creates fun random themes for inspiration.
* Clean UI + Responsive Layout
  Looks good on desktop, tablet, and mobile.

# 🧪 Process

  The development of the VS Code Theme Generator began with planning the layout and identifying the essential features needed for a smooth theme-building experience. 
  I started by outlining the structure: a simple two-column interface with the color controls on the left and the live preview on the right. Once the layout was clear, 
  I built the HTML skeleton, keeping the markup clean and using clear IDs and classes to make JavaScript integration easier later.

  With the structure in place, I integrated TailwindCSS to style the application. This allowed me to quickly create a clean, modern, and responsive layout without writing custom CSS. 
  Using Tailwind’s utility classes, I styled the color pickers, buttons, headers, and the preview panel, ensuring everything remained consistent and visually appealing on all screen sizes.
  
  After the UI was polished, I moved to the JavaScript logic, which formed the core of the project. I implemented real-time updates so that whenever the user selected a new color, 
  the editor and sidebar preview would instantly reflect the change. I created afunction that applied all colors at once, which made the code more organized and easier to maintain. 
  Next, I added the save and load functionality using LocalStorage, allowing users to store their theme permanently inside their browser. 
  I then built the export feature, which converts the selected colors into a valid VS Code theme JSON file. Finally, I added the random theme generator to make the tool more fun and creative.

  Throughout the process, I tested each feature thoroughly, fixing issues like null element errors, incorrect color mappings, and JSON formatting problems. Once everything was stable, 
  I refined the UI, improved button interactions, and cleaned up the codebase.  The project was then finalized, version-controlled with Git, and prepared for deployment.

#  📚 What I Learned

  * Working with TailwindCSS and building UI fast
  * How to use JavaScript DOM manipulation effectively
  * Handling state without frameworks
  * Creating dynamic previews in real time
  * Working with LocalStorage
  * Formatting VS Code-compatible JSON themes
  * Writing cleaner JavaScript with reusable functions

# 🚀 Overall Growth
This project improved your abilities in:
  * Front-end thinking
  * Clean code structure
  * UI/UX design
  * Problem solving
  * Understanding developer tools
  * Creating real-world usable tools
  * Saving and exporting dynamic user data

# 🔧 How It Can Be Improved

  * Add multiple themes saving (+ theme gallery)
  * Add more color settings (comments, constants, variables, errors, tabs)
  * Add the ability to import an existing theme JSON
  * Add VS Code extension pack integration
  * Add dark/light mode toggle for the builder itself
  * Add a drag-and-drop VS Code editor mockup
  * Add full keyboard shortcut support

# ▶️ Running the Project
No installation needed.

1. Download the project folder
2. Open index.html in any browser
3. Done

# 🎥 Video Demo

