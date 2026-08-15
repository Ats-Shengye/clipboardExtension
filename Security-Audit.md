# Security Report
updated: 2026-08-16

## Latest Review

- Date: 2026-08-16
- Reviewer: Security reviewer (red-team perspective)
- Verdict: CONDITIONAL PASS
- Condition: M-1, M-2 を修正後に PASS
- ASVS L1 compliance: 80% (8/10) — Chapters: V1, V2, V12, V13, V14
- Static analysis: N/A (vanilla JS, no lint config)
- Supply chain: No external dependencies

## Finding History

### 2026-08-16 Review

#### Critical
- None

#### High
- None

#### Medium
- [M-1] `activeTab` permission unnecessary — Principle of Least Privilege violation (manifest.json:7)
  - manifest.json `permissions: ["activeTab"]` は本拡張の機能に不要。拡張はタブのコンテンツに一切アクセスしない。`navigator.clipboard.writeText()` はポップアップ内のユーザージェスチャ（ボタンクリック）で動作し、追加パーミッション不要
  - 攻撃シナリオ: 拡張コードが改変された場合（ローカル改ざん or フォーク先での悪意ある変更）、activeTab権限を悪用して現在のタブのURL・DOM・Cookieにアクセス可能
  - 実害の文脈: 環境固有 — 改ざんが前提であり現コードでは到達しない。ただしPUBLICリポジトリのフォーク先で悪用される攻撃面を不必要に広げている
  - 修正コスト: 1行で直る
  - 直し方: `manifest.json` の `permissions` を空配列 `[]` に変更。Clipboard APIはポップアップコンテキスト+ユーザージェスチャで動作する
  - Status: Open
- [M-2] items.txt がPUBLICリポジトリで追跡されている — 機密テンプレート混入時のデータ漏洩リスク (items.txt, .gitignore)
  - items.txt は「ログインID」テンプレートを含む設計。現在は `sample_user_id` だが、ユーザーが実際のログインIDやパスワードに書き換えて `git push` した場合、PUBLICリポジトリ経由で漏洩する
  - 攻撃シナリオ: ユーザーがitems.txtを実運用データに編集 → `git add .` → push → GitHub上でログインID/定型文が公開
  - 実害の文脈: 環境固有 — `git add .` 禁止ルール + gitleaks PII拡張で一定の防御があるが、items.txt内の単純なユーザー名文字列はgitleaksパターンにマッチしない可能性が高い
  - 修正コスト: 関数1つ追加（ファイル操作3手順）
  - 直し方: (1) `items.txt` を `.gitignore` に追加 (2) 現在の `items.txt` を `items.txt.example` にリネームしてサンプルとして追跡 (3) README.mdに「`items.txt.example` を `items.txt` にコピーして編集」と記載 (4) `git rm --cached items.txt` で追跡解除
  - Status: Open

#### Low
- [L-1] `innerHTML` による DOM リセット (popup.js:35) — 現在は安全だが防御的コーディングに反する
  - `templateSelect.innerHTML = '<option value="">テンプレートを選択してください</option>'` はハードコード文字列で安全。ただし将来の変更で動的コンテンツが混入した場合にXSSベクターになる
  - 修正コスト: 1行で直る（数行の置換）
  - 直し方: `while (templateSelect.firstChild) templateSelect.removeChild(templateSelect.firstChild);` + `createElement('option')` で再構築
  - Status: Open (修正推奨だが必須ではない)

## Risk Acceptance

(現時点で受容判定なし。M-1, M-2 の修正を推奨)

## Applied Security Measures

### Manifest / Permissions
- Manifest V3 使用（最新のセキュリティモデル）
- CSP: MV3 デフォルト (`script-src 'self'; object-src 'self'`) — カスタムCSP未設定、デフォルトが十分に厳格
- インラインスクリプトなし（popup.js を外部ファイルとして読み込み）
- インラインイベントハンドラなし
- `web_accessible_resources` 未宣言 — items.txt は外部Webページからアクセス不可

### XSS Prevention
- DOM操作は `document.createElement()` + `textContent` を使用（HTML解釈なし）
- items.txt のテンプレートタイトルは `option.textContent` で設定（HTMLエスケープ不要）
- 外部入力なし（ユーザー入力フォームなし、外部データソースなし）

### Data Flow
- items.txt → `chrome.runtime.getURL()` → `fetch()` → パース → `textContent` 描画 / `clipboard.writeText()` コピー
- 全経路でHTML解釈なし、外部通信なし

### Clipboard Security
- `navigator.clipboard.writeText()` 使用（Clipboard API、非推奨の `document.execCommand('copy')` ではない）
- ユーザージェスチャ（ボタンクリック）起点でのみ実行
- コピー元データは拡張バンドル内のitems.txtに限定

### Supply Chain
- 外部依存ライブラリ: なし（ゼロ依存）
- gitleaks 設定済み（.gitleaks.toml → PII拡張ルール参照）

## Conditional Application Decisions
- Network security: Not applicable (no network communication)
- Authentication/session: Not applicable (no multi-user, no server)
- CSRF/CORS: Not applicable (no web API)
- SQL injection: Not applicable (no database)
- Command injection: Not applicable (no subprocess)
- Path traversal: Not applicable (chrome.runtime.getURL only, no user-controlled paths)
- Rate limiting: Not applicable (no public API)
- SSRF: Not applicable (no URL fetching of external resources)
- WebSocket: Not applicable (no WebSocket)
- HTTP security headers: Not applicable (extension popup, not server-served page)
- npm audit: Not applicable (no npm dependencies)
- Prototype pollution: Not applicable (no dynamic property access from external input)
