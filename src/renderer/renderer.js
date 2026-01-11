// Tab Switching Logic
function setupTabs() {
    const tabs = {
        'tab-compress': 'compress',
        'tab-extract': 'extract'
    };

    Object.keys(tabs).forEach(tabId => {
        const btn = document.getElementById(tabId);
        btn.addEventListener('click', () => {
            const panelId = tabs[tabId];
            
            // Hide all panels
            document.querySelectorAll('.panel').forEach(panel => {
                panel.classList.remove('active');
            });
            // Deselect all tabs
            document.querySelectorAll('.tab-btn').forEach(b => {
                b.classList.remove('active');
            });

            // Show selected panel
            document.getElementById(panelId).classList.add('active');
            // Activate selected tab button
            btn.classList.add('active');
            
            // Clear status
            showStatus('');
        });
    });
}

// Initialize tabs when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setupTabs();
});

function showStatus(message, type = 'success') {
    const statusEl = document.getElementById('status');
    if (!message) {
        statusEl.style.display = 'none';
        return;
    }
    statusEl.textContent = message;
    statusEl.className = `status-message ${type}`;
    statusEl.style.display = 'block';
}

// COMPRESS LOGIC
const compressSourceInput = document.getElementById('compress-source');

document.getElementById('btn-select-source-file').addEventListener('click', async () => {
    const path = await window.electron.openFile();
    if (path) compressSourceInput.value = path;
});

document.getElementById('btn-select-source-dir').addEventListener('click', async () => {
    const path = await window.electron.openDirectory();
    if (path) compressSourceInput.value = path;
});

document.getElementById('btn-compress').addEventListener('click', async () => {
    const source = compressSourceInput.value;
    if (!source) return showStatus('Please select a source first', 'error');

    // Suggest saving
    const defaultName = source + '.gjar';
    const outputPath = await window.electron.saveFile(defaultName);

    if (outputPath) {
        showStatus('Compressing...', 'success');
        const result = await window.electron.compress(source, outputPath);
        if (result.success) {
            showStatus('Archive created successfully!', 'success');
        } else {
            showStatus('Error: ' + result.error, 'error');
        }
    }
});

// EXTRACT LOGIC
const extractSourceInput = document.getElementById('extract-source');
const extractDestInput = document.getElementById('extract-dest');

document.getElementById('btn-select-archive').addEventListener('click', async () => {
    const path = await window.electron.openFile();
    if (path) extractSourceInput.value = path;
});

document.getElementById('btn-select-dest').addEventListener('click', async () => {
    const path = await window.electron.openDirectory();
    if (path) extractDestInput.value = path;
});

document.getElementById('btn-extract').addEventListener('click', async () => {
    const source = extractSourceInput.value;
    const dest = extractDestInput.value;

    if (!source || !dest) return showStatus('Please select source and destination', 'error');

    showStatus('Extracting...', 'success');
    const result = await window.electron.extract(source, dest);
    
    if (result.success) {
        showStatus('Extraction complete!', 'success');
    } else {
        showStatus('Error: ' + result.error, 'error');
    }
});
