2# ChatGPT Clone

A production-ready ChatGPT-style UI built with Next.js 15, TypeScript, Tailwind CSS, and Clerk authentication. Features a fully responsive design with collapsible sidebar, message streaming, and modern chat interface.

## 🚀 Features

- **Modern UI/UX**: ChatGPT-inspired design with dark sidebar and clean message interface
- **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **Collapsible Sidebar**: Easy navigation with chat history and management
- **Message Streaming**: Simulated real-time message streaming with typing indicators
- **Authentication**: Secure user authentication with Clerk
- **TypeScript**: Fully typed for better developer experience and code reliability
- **Accessible**: Built with accessibility best practices
- **Component Architecture**: Modular, reusable components following React best practices

## 🏗️ Project Structure

```
src/
├── app/
│   ├── dashboard/
│   │   └── page.tsx           # Main chat dashboard
│   ├── sign-in/
│   │   └── page.tsx           # Sign in page
│   ├── sign-up/
│   │   └── page.tsx           # Sign up page
│   ├── globals.css            # Global styles with custom CSS variables
│   ├── layout.tsx             # Root layout with Clerk provider
│   └── page.tsx               # Landing page
├── components/
│   ├── chat/
│   │   ├── ChatInterface.tsx  # Main chat container component
│   │   ├── ChatInput.tsx      # Message input with auto-resize
│   │   ├── MessageItem.tsx    # Individual message component
│   │   ├── MessageList.tsx    # Message list with auto-scroll
│   │   ├── Sidebar.tsx        # Collapsible sidebar with chat history
│   │   └── index.ts           # Component exports
│   └── ui/
│       ├── button.tsx         # Reusable button component
│       ├── input.tsx          # Styled input component
│       ├── scroll-area.tsx    # Custom scroll area
│       └── separator.tsx      # UI separator component
├── contexts/
│   └── ChatContext.tsx        # Chat state management with React Context
├── lib/
│   └── utils.ts               # Utility functions (cn helper)
├── types/
│   └── chat.ts                # TypeScript type definitions
└── middleware.ts              # Clerk authentication middleware
```

## 🧩 Component Architecture

### Core Components

1. **ChatInterface** - Main container that orchestrates the entire chat experience
2. **Sidebar** - Collapsible navigation with chat history and management
3. **MessageList** - Displays chat messages with auto-scrolling
4. **MessageItem** - Individual message with user/assistant styling
5. **ChatInput** - Message input with auto-resize and example prompts

### Context Management

**ChatContext** provides:

- Chat state management (chats, current chat, loading states)
- Message operations (send, update, stream)
- Chat operations (create, select, delete, clear)
- Mock AI response simulation

### UI Components

Built with shadcn/ui patterns:

- **Button** - Flexible button with multiple variants
- **Input** - Styled input fields
- **ScrollArea** - Custom scrollable areas
- **Separator** - Visual separators

## 🎨 Design System

### Color Scheme

- **Sidebar**: Dark gray (#1f2937) with hover states
- **Messages**: White background for user, light gray for assistant
- **Accents**: Blue for primary actions, green for assistant avatar

### Typography

- **Font**: Geist Sans (modern, clean)
- **Sizing**: Responsive text sizing with proper hierarchy
- **Spacing**: Consistent padding and margins

### Responsiveness

- **Mobile**: Overlay sidebar, optimized touch targets
- **Tablet**: Adaptive layout with proper spacing
- **Desktop**: Full sidebar with optimal chat width

## 🔧 Technical Features

### State Management

- React Context with useReducer for predictable state updates
- Optimistic UI updates for better user experience
- Proper error handling and loading states

### Performance

- Server components by default
- Client components only where interactivity is needed
- Efficient re-renders with proper React patterns
- Auto-scrolling with smooth animations

### Accessibility

- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly
- Focus management

### TypeScript

- Strict typing for all components and functions
- Well-defined interfaces for data structures
- Type-safe context and props

## 🚀 Getting Started

1. **Clone and Install**

   ```bash
   git clone <repository-url>
   cd chatgpt-clone
   npm install
   ```

2. **Environment Setup**
   Create `.env.local` with your Clerk credentials:

   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
   CLERK_SECRET_KEY=your_secret_key
   ```

3. **Run Development Server**

   ```bash
   npm run dev
   ```

4. **Open in Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Development

### Adding New Components

1. Create component in appropriate directory
2. Follow TypeScript interfaces
3. Add to index.ts for exports
4. Include proper accessibility attributes

### Extending Chat Functionality

1. Update types in `src/types/chat.ts`
2. Modify context in `src/contexts/ChatContext.tsx`
3. Update relevant components
4. Test across different screen sizes

### Styling Guidelines

1. Use Tailwind CSS classes
2. Follow the established color scheme
3. Ensure responsive design
4. Test dark mode compatibility

## 📦 Dependencies

### Core

- **Next.js 15**: React framework with App Router
- **React 19**: UI library with latest features
- **TypeScript**: Type safety and developer experience
- **Tailwind CSS**: Utility-first CSS framework

### Authentication

- **Clerk**: User authentication and management

### UI Components

- **Lucide React**: Modern icon library
- **Radix UI**: Accessible component primitives
- **Class Variance Authority**: Component variant management
- **clsx & tailwind-merge**: Conditional styling utilities

## 🔮 Future Enhancements

- **Real AI Integration**: Replace mock responses with actual AI API
- **Message Persistence**: Database integration for chat history
- **File Uploads**: Support for image and document sharing
- **Message Reactions**: Like/dislike and emoji reactions
- **Chat Sharing**: Public link sharing for conversations
- **Themes**: Light/dark mode toggle
- **Voice Input**: Speech-to-text functionality
- **Export Options**: Download conversations as PDF/text

## 📝 License

MIT License - feel free to use this project for your own applications.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
