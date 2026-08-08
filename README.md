# 🕉️ ಸ್ತೋತ್ರ ಸಂಗ್ರಹ | Stotra Sangraha

A clean, fast, ad-free static website for storing, reading, and chanting **Kannada and English Stotras**.

---

## ✨ Key Features

1. **Google Fonts Kannada Typography**: Uses `Noto Serif Kannada` for high legibility of complex Kannada conjunct letters (ಒತ್ತಕ್ಷರ).
2. **Interlinear Verse View**: Each verse presents:
   - 🕉️ **Kannada Script**
   - 🔤 **English Transliteration (IAST)**
   - 📖 **English Translation / Meaning**
3. **Dynamic Font Resizer**: `A+` / `A-` buttons to scale font size on mobile/desktop during pooja.
4. **Keep Screen Awake (Wake Lock)**: Screen lock button prevents phone screen from auto-dimming while chanting.
5. **Instant Catalog Search & Deity Filters**: Filter stotras by deity (Ganesha, Vishnu, Shiva, Devi, Hanuman) or search titles in both Kannada and English.
6. **Dark / Light Theme**: Built-in toggle saved in browser storage.
7. **Copy Verse**: Quick button to copy verse text.

---

## 💻 Local Development & Testing

To test your website locally before pushing to GitHub:

* **Windows Batch (Double-Click)**: Double-click `run_local.bat` inside `C:\myLocalData\code\stotra-web\`.
* **PowerShell**: Run `.\run_local.ps1` or `python -m http.server 8080`.

It will automatically launch your default web browser at **`http://localhost:8080/`** so you can preview all font sizes, stotras, and theme switches instantly!

---

## 📁 Repository Structure

```
C:\myLocalData\code\stotra\
├── index.html                   # Main landing page & search catalog
├── assets/
│   ├── css/style.css            # Custom CSS & Google Fonts loader
│   └── js/app.js                # Font scaling, search filter, wake lock & theme
└── stotras/
    ├── ganesha-pancharatnam.html # Complete Ganesha Pancharatnam
    ├── vishnu-sahasranama-dhyanam.html # Vishnu Sahasranama Dhyanam
    ├── hanuman-chalisa.html     # Hanuman Chalisa Opening Verses
    └── template.html            # Starter template for adding new stotras
```

---

## 🚀 How to Publish on GitHub Pages (Free Setup in 2 Minutes)

### Step 1: Initialize Git & Commit Files
Open PowerShell / Command Prompt inside `C:\myLocalData\code\stotra` and run:

```bash
git init
git add .
git commit -m "Initial commit of Stotra Sangraha web app"
```

### Step 2: Push to GitHub
1. Go to [GitHub.com/new](https://github.com/new) and create a repository named `stotra` (or any name you like).
2. Run the commands shown by GitHub to push your local code:

```bash
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/stotra.git
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. On GitHub.com, go to your repository **Settings** tab $\rightarrow$ **Pages** (on the left menu).
2. Under **Build and deployment** $\rightarrow$ **Branch**, select **`main`** and **`/ (root)`**.
3. Click **Save**.

🎉 Within 60 seconds, your site will be live at:
**`https://YOUR_GITHUB_USERNAME.github.io/stotra/`**

---

## ➕ How to Add a New Stotra
1. Duplicate `stotras/template.html` and rename it (e.g. `stotras/shiva-tandava.html`).
2. Add your verses inside the `.verse-card` sections.
3. Open `index.html` and add a new card pointing to your new stotra page.
4. Commit and push to GitHub!
