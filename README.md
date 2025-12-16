# Template Text Copier

テンプレート文をクリップボードにワンクリックでコピーするChrome拡張機能。
メールの定型文やAIプロンプトの管理・使用効率化を目的として作成。

## 機能

- ドロップダウンから選択してワンクリックコピー
- `items.txt`でテンプレート管理（編集しやすいCSV形式）
- 改行コード（`\n`）の自動変換
- コピー後に自動でポップアップを閉じる

## 技術スタック

| カテゴリ | 技術 |
|----------|------|
| プラットフォーム | Chrome Extension (Manifest V3) |
| 言語 | JavaScript (ES6+) |
| API | Clipboard API, Chrome Extension API |

## セキュリティ

- **最小権限原則**: `activeTab`権限のみ使用
- **外部通信なし**: 全処理をローカルで完結
- **XSS対策**: DOM操作にtextContentを使用（innerHTML不使用）
- **本番ログ削除**: console出力を除去

## ファイル構成

```
clipboardExtension/
├── manifest.json    # 拡張機能設定
├── popup.html       # ポップアップUI
├── popup.js         # メインロジック
├── items.txt        # テンプレートデータ
└── README.md
```

## 使用方法

### インストール
1. `chrome://extensions/` を開く
2. 「デベロッパーモード」を有効化
3. 「パッケージ化されていない拡張機能を読み込む」でこのフォルダを選択

### テンプレート編集
`items.txt` を編集してテンプレートを追加・変更：

```
テンプレート名,コピーする内容
挨拶,お疲れ様です。\n本日もよろしくお願いいたします。
```

- カンマ区切りで `タイトル,内容` の形式
- 改行は `\n` で記述

## 用途例

- メールテンプレート管理
- AIプロンプト一覧化
- 定型文の効率的入力
- コードスニペット管理

## License

This project is for portfolio purposes. All rights reserved.
