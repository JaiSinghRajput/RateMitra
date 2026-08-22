# RateMitra 🏷️

RateMitra is a modern, dynamic, and responsive Progressive Web App (PWA) designed to help businesses manage, display, and share their price lists effortlessly. Built with Next.js, RateMitra provides a beautiful user interface for creating price items, generating QR codes for easy sharing, and tracking analytics.

## Features ✨

- **Price List Management**: Easily add, edit, and organize your products and their prices.
- **Progressive Web App (PWA)**: Install RateMitra on your device for a native app-like experience.
- **Authentication & Organizations**: Secure login and B2B organization management powered by [Clerk](https://clerk.com/).
- **QR Code Generation**: Instantly generate and download beautifully branded QR codes linking directly to your public price list.
- **Multi-language Support**: Reach a wider audience with built-in translation capabilities.
- **Analytics Dashboard**: Track page views, activity, and engagement with rich charts (Recharts).
- **Theming**: Sleek Light and Dark modes with customizable theme settings.
- **Database**: Robust data storage using MongoDB and Mongoose.

## Tech Stack 🛠️

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [Framer Motion](https://www.framer.com/motion/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **PWA**: `@ducanh2912/next-pwa`

## Getting Started 🚀

### Prerequisites

- Node.js 18.x or later
- MongoDB Database URI
- Clerk API Keys

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/rate-mitra.git
   cd rate-mitra
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following variables:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   MONGODB_URI=your_mongodb_connection_string
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage 💡

- **Dashboard**: Access the main dashboard to view analytics, manage items, and see activity logs.
- **Manage Prices**: Navigate to the list section to add new items, update prices, and organize your catalog.
- **Share**: Generate a QR code in the QR Code section, download it, and print or share it with your customers.
- **Settings**: Customize your theme and preferences in the Settings section.

## Contributing 🤝

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/rate-mitra/issues).

## License 📝

This project is licensed under the MIT License.
