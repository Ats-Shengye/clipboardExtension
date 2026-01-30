# Template Text Copier

よく使う定型文やプロンプトを、ドロップダウンから選んでワンクリックでコピーできるChrome拡張機能。
テキストファイル1つでテンプレートを管理でき、メールの挨拶文やAIプロンプトの使い回しが楽になる。

## 技術スタック

- Chrome Extension (Manifest V3)
- JavaScript (ES6+)
- Clipboard API

## セットアップ

1. `chrome://extensions/` を開く
2. 「デベロッパーモード」を有効化
3. 「パッケージ化されていない拡張機能を読み込む」でこのフォルダを選択

### テンプレート編集

`items.txt` をテキストエディタで開いて追加・変更：

```
テンプレート名,コピーする内容
挨拶,お疲れ様です。\n本日もよろしくお願いいたします。
```

- カンマ区切りで `タイトル,内容` の形式
- 改行は `\n` で記述

## 関連ドキュメント

- [GLOSSARY.md](./GLOSSARY.md) - コード内の主要な変数・関数・APIの役割一覧

## License

This project is for portfolio purposes. All rights reserved.
