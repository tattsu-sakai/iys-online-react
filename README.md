# React Project

This is a new React project scaffold generated in this workspace.

## shadcn/ui の有効化

このプロジェクトは shadcn/ui が使えるように設定しています。

- `@radix-ui/react-slot`
- `class-variance-authority`
- `clsx`
- `tailwind-merge`
- `lucide-react`
- `tailwindcss`, `postcss`, `autoprefixer`, `tailwindcss-animate`

を `package.json` に追加しています。

## 立ち上げ

```bash
npm install
npm run dev
```

## shadcn/ui コンポーネント追加

```bash
npx shadcn@latest add button
```

※ 既存の `src/components/ui/button.tsx` はサンプルとして既に用意しています。
