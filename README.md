# Sebastian Alvarez - Portfolio

A modern, responsive portfolio website built with Next.js 15, React 19, and Tailwind CSS.

![Portfolio Preview](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)

## ✨ Features

- **Modern Design**: Dark theme with emerald/cyan accents and glassmorphism effects
- **Responsive**: Fully responsive design for mobile, tablet, and desktop
- **Smooth Animations**: Entrance animations and hover effects
- **SEO Optimized**: Meta tags, Open Graph, and structured data ready
- **Fast Performance**: Built with Next.js App Router and optimized for speed

## 🚀 Quick Deploy to Vercel

The easiest way to deploy this portfolio is using Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```

2. Navigate to the project folder:
   ```bash
   cd sebastian-portfolio
   ```

3. Run the deploy command:
   ```bash
   vercel
   ```

4. Follow the prompts to link or create a new project.

### Option 2: Deploy via GitHub

1. Push this project to a new GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com) and sign in with GitHub.

3. Click "Add New Project" and import your repository.

4. Vercel will automatically detect Next.js and configure the build settings.

5. Click "Deploy" and wait for the build to complete.

## 🛠️ Local Development

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
sebastian-portfolio/
├── app/
│   ├── globals.css      # Global styles + Tailwind directives
│   ├── layout.jsx       # Root layout with metadata
│   └── page.jsx         # Main portfolio component
├── public/
│   └── icon.svg         # Favicon
├── .gitignore
├── jsconfig.json
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── README.md
```

## 🎨 Customization

### Update Personal Information

Edit `app/page.jsx` to update:

- **Contact Information**: Search for `alvarez.sebastian605@gmail.com` and replace with your email
- **Phone Number**: Search for `+54 9 2804206150` and replace with your number
- **Location**: Search for `Merlo, San Luis, Argentina` and replace with your location
- **Social Links**: Update the GitHub and LinkedIn URLs

### Update Experience & Skills

All data is stored as JavaScript objects in `app/page.jsx`:

- `skills` object: Update your technical skills by category
- `experience` array: Update your work history
- `achievements` array: Update your key achievements

### Update Styling

- **Colors**: The primary colors are `emerald` and `cyan`. Search and replace throughout the file.
- **Fonts**: Fonts are imported in `app/globals.css`. Update the Google Fonts import.
- **Animations**: Custom animations are defined in `app/globals.css`.

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔧 Build for Production

```bash
npm run build
# or
yarn build
```

This creates an optimized production build in the `.next` folder.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ by Sebastian Alvarez
