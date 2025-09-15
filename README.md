# 🐾 Pet Cheap E-commerce Store

Welcome to **Pet Cheap** – a full-stack e-commerce web application for pet supplies!  
Built with **React**, **Express.js**, and **Stripe**, Pet Cheap offers a modern shopping experience for pet lovers.  
Enjoy browsing, cart management, secure checkout, and more – all with a beautiful UI powered by [shadcn/ui](https://ui.shadcn.com/) and **Tailwind CSS**.

---

## 🚀 Features

- 🛒 **Shopping Cart**: Add, remove, and manage products in your cart
- 💳 **Secure Checkout**: Stripe integration for safe payments
- 🐶 **Product Catalog**: Browse high-quality pet supplies
- 📦 **Order Management**: Track your orders with ease
- 📱 **Responsive Design**: Mobile-first, works on any device
- 🔔 **Toast Notifications**: Instant feedback for user actions
- 🦴 **Skeleton Loaders**: Smooth loading states for better UX
- 🧑‍💻 **Type Safety**: Built with TypeScript throughout

---

## 🏗️ Tech Stack

| Frontend      | Backend    | Database          | Styling      | Utilities            |
| ------------- | ---------- | ----------------- | ------------ | -------------------- |
| React 18 + TS | Express.js | PostgreSQL (Neon) | Tailwind CSS | TanStack Query, Zod  |
| Wouter Router | REST API   | Drizzle ORM       | shadcn/ui    | Stripe, Lucide Icons |

---

## 📦 Project Structure

```
client/
  src/
    pages/         # Page components (Home, Products, About, Contact, Checkout)
    components/    # UI and layout components
    hooks/         # Custom React hooks
    lib/           # Utilities and query client
server/
  index.ts         # Express server entry
  routes.ts        # API routes
  storage.ts       # In-memory storage
shared/
  schema.ts        # Shared type definitions
```
## 🧹 Code Formatting with Prettier

This project uses [Prettier](https://prettier.io/) for code formatting. To format your code, make sure Prettier is installed:

```sh
npm install --save-dev prettier
```

### Format the whole project
```sh
npx prettier --write .
```

### Format a specific file
```sh
npx prettier --write path/to/file.js
```

### Format a specific folder
```sh
npx prettier --write path/to/folder/
```

Prettier will automatically ignore files and folders listed in `.prettierignore`.

---

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### Installation

```sh
git clone https://github.com/your-username/pet-cheap.git
cd pet-cheap
npm install
```

### Development

Start both frontend and backend:

```sh
npm run dev
```

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:3000](http://localhost:3000)

### Build for Production

```sh
npm run build
npm start
```

---

## 🧪 Testing

- Unit and integration tests are supported via your IDE (VS Code).
- Run type checks:
  ```sh
  npm run check
  ```

---

## 🔐 Environment Variables

Create a `.env` file for sensitive keys (Stripe, database, etc):

```
STRIPE_SECRET_KEY=your_stripe_key
DATABASE_URL=your_database_url
```

---

## 📝 License

MIT © 2024 Pet Cheap

---

## 🤝 Contributing

Pull requests and issues are welcome!  
Please follow the [Code of Conduct](CODE_OF_CONDUCT.md) and [Contributing Guidelines](CONTRIBUTING.md).

---

## 📣 Contact

Questions? Email us at [support@petcheap.com](mailto:support@petcheap.com)

---

## 🌟 Acknowledgements

- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Stripe](https://stripe.com/)
- [Lucide Icons](https://lucide.dev/)

---

> _Quality pet supplies at unbeatable prices. Your pets deserve the best!_ 🐕🐈🐇
