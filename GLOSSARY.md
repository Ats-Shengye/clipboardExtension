# Glossary
updated: 2026-01-30

## 変数・State
| 名前 | 種別 | 役割 |
|------|------|------|
| `templateSelect` | DOM要素 | テンプレート選択用セレクトボックス (`#templateSelect`) |
| `copyButton` | DOM要素 | コピー実行ボタン (`#copyButton`) |
| `statusDiv` | DOM要素 | 操作結果のステータスメッセージ表示エリア (`#status`) |
| `templates` | 配列 | `items.txt`から読み込んだテンプレートデータ。各要素は `{ title, content }` |

## 関数
| 名前 | 種別 | 役割 |
|------|------|------|
| `loadTemplates()` | async関数 | `items.txt`をfetchしてCSV形式をパース、`templates`配列に格納 |
| `populateSelect()` | 関数 | `templates`配列からセレクトボックスの選択肢を動的生成 |
| `showStatus(message, type)` | 関数 | ステータスメッセージを表示。`type`は `'success'` or `'error'` |
| `hideStatus()` | 関数 | ステータスメッセージを非表示にする |

## データファイル
| 名前 | 形式 | 役割 |
|------|------|------|
| `items.txt` | CSV (`タイトル,内容`) | テンプレート定義。改行は `\n` リテラルで記述、コピー時に実際の改行に変換 |

## イベントリスナー
| 対象 | イベント | 動作 |
|------|----------|------|
| `document` | `DOMContentLoaded` | 全体の初期化。DOM取得→`loadTemplates()`実行 |
| `templateSelect` | `change` | 選択状態に応じてコピーボタンの有効/無効を切り替え |
| `copyButton` | `click` | 選択中テンプレートの`content`をClipboard APIでコピー、1.5秒後にポップアップを閉じる |

## Chrome API
| API | 用途 |
|-----|------|
| `chrome.runtime.getURL()` | `items.txt`の拡張機能内パスを解決 |
| `navigator.clipboard.writeText()` | テキストをクリップボードに書き込み |

## パーミッション
| 権限 | 理由 |
|------|------|
| `activeTab` | Clipboard API使用に必要な最小権限 |
