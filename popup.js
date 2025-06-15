document.addEventListener('DOMContentLoaded', function() {
    const templateSelect = document.getElementById('templateSelect');
    const copyButton = document.getElementById('copyButton');
    const statusDiv = document.getElementById('status');
    
    let templates = [];

    // items.txtを読み込む
    async function loadTemplates() {
        try {
            const response = await fetch(chrome.runtime.getURL('items.txt'));
            const text = await response.text();
            
            templates = [];
            const lines = text.split('\n').filter(line => line.trim() !== '');
            
            lines.forEach(line => {
                const commaIndex = line.indexOf(',');
                if (commaIndex > 0) {
                    const title = line.substring(0, commaIndex).trim();
                    const content = line.substring(commaIndex + 1).trim();
                    templates.push({ title, content });
                }
            });
            
            populateSelect();
        } catch (error) {
            console.error('Error loading templates:', error);
            showStatus('テンプレートの読み込みに失敗しました', 'error');
        }
    }

    // セレクトボックスにオプションを追加
    function populateSelect() {
        // 既存のオプションをクリア（最初のデフォルトオプション以外）
        templateSelect.innerHTML = '<option value="">テンプレートを選択してください</option>';
        
        templates.forEach((template, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = template.title;
            templateSelect.appendChild(option);
        });
    }

    // セレクトボックスの変更イベント
    templateSelect.addEventListener('change', function() {
        copyButton.disabled = this.value === '';
        hideStatus();
    });

    // コピーボタンのクリックイベント
    copyButton.addEventListener('click', async function() {
        const selectedIndex = templateSelect.value;
        if (selectedIndex === '') return;
        
        const template = templates[selectedIndex];
        if (!template) return;
        
        try {
            // \nを改行文字に変換
            const textToCopy = template.content.replace(/\\n/g, '\n');
            
            await navigator.clipboard.writeText(textToCopy);
            showStatus('クリップボードにコピーしました', 'success');
            
            // 3秒後にポップアップを閉じる
            setTimeout(() => {
                window.close();
            }, 1500);
        } catch (error) {
            console.error('Error copying to clipboard:', error);
            showStatus('クリップボードへのコピーに失敗しました', 'error');
        }
    });

    // ステータスメッセージを表示
    function showStatus(message, type) {
        statusDiv.textContent = message;
        statusDiv.className = type;
        statusDiv.style.display = 'block';
    }

    // ステータスメッセージを非表示
    function hideStatus() {
        statusDiv.style.display = 'none';
    }

    // 初期化
    loadTemplates();
});