// --- SECURITY UTILITIES ---
function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/[&<>'"]/g, tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
    }[tag] || tag));
}

// --- GLOBAL STATE VARIABLES ---
let currentTab = 'all';
let activeMessageId = null;
let pendingDeleteAction = null;
let currentAttachments = [];

const STORAGE_KEY = 'puplms_instructor_inbox'; 

// --- INITIALIZATION ---
window.onload = () => {
    const savedMessages = localStorage.getItem(STORAGE_KEY);
    const messageList = document.getElementById('messageList');
    
    if (savedMessages && messageList) {
        messageList.innerHTML = savedMessages;
    }
    
    filterMessages();
};

// --- STORAGE LOGIC ---
function saveToStorage() {
    const messageList = document.getElementById('messageList');
    if (messageList) {
        localStorage.setItem(STORAGE_KEY, messageList.innerHTML);
    }
}

// --- TAB SWITCHING LOGIC ---
function switchTab(tabName) {
    currentTab = tabName;
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active-tab');
    });
    document.getElementById(`tab-${tabName}`).classList.add('active-tab');

    const emptyTrashBtn = document.getElementById('emptyTrashBtn');
    if (emptyTrashBtn) {
        emptyTrashBtn.style.display = (tabName === 'trash') ? 'inline-flex' : 'none';
    }

    filterMessages();
    resetPreview();
}

// --- FILTER MESSAGES LOGIC ---
function filterMessages() {
    const messages = document.querySelectorAll('.msg-card');
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    let visibleCount = 0; 

    messages.forEach(msg => {
        const folder = msg.getAttribute('data-folder');
        const isStarred = msg.getAttribute('data-starred') === 'true';
        const sender = msg.getAttribute('data-sender').toLowerCase();
        const subject = msg.getAttribute('data-subject').toLowerCase();
        
        let belongsInTab = false;
        
        if (currentTab === 'all') {
            belongsInTab = (folder !== 'trash' && folder !== 'archived'); 
        } else if (currentTab === 'sent') {
            belongsInTab = (folder === 'sent');
        } else if (currentTab === 'starred') {
            belongsInTab = (isStarred && folder !== 'trash'); 
        } else if (currentTab === 'archived') {
            belongsInTab = (folder === 'archived');
        } else if (currentTab === 'trash') {
            belongsInTab = (folder === 'trash');
        }

        const matchesSearch = sender.includes(searchQuery) || subject.includes(searchQuery);

        if (belongsInTab && matchesSearch) {
            msg.style.display = 'block';
            visibleCount++;
        } else {
            msg.style.display = 'none';
        }
    });

    const noMessageList = document.getElementById('noMessageList');
    if (noMessageList) {
        if (visibleCount === 0) {
            noMessageList.style.display = 'flex';
            const textEl = document.getElementById('noMessageText');
            
            if (searchQuery) {
                textEl.innerText = 'No messages match your search.';
            } else if (currentTab === 'trash') {
                textEl.innerText = 'Trash is empty.';
            } else if (currentTab === 'starred') {
                textEl.innerText = 'No starred messages.';
            } else if (currentTab === 'archived') {
                textEl.innerText = 'No archived messages.';
            } else if (currentTab === 'sent') {
                textEl.innerText = 'No sent messages.';
            } else {
                textEl.innerText = 'No messages found.';
            }
        } else {
            noMessageList.style.display = 'none';
        }
    }
}

// --- SEARCH BOX LOGIC ---
function searchMessages() {
    const searchInput = document.getElementById('searchInput');
    const clearIcon = document.getElementById('clearSearch');
    
    clearIcon.style.display = (searchInput.value.length > 0) ? 'block' : 'none';
    filterMessages(); 
}

function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.value = '';
    searchMessages(); 
    searchInput.focus(); 
}

// --- MESSAGE PREVIEW FUNCTION ---
function previewMessage(element) {
    activeMessageId = element.id; 

    const sender = element.getAttribute('data-sender');
    const subject = element.getAttribute('data-subject');
    const date = element.getAttribute('data-date');
    const fullMsg = element.getAttribute('data-fullmsg');
    const isStarred = element.getAttribute('data-starred') === 'true';
    const folder = element.getAttribute('data-folder');
    const eraseDate = element.getAttribute('data-erase-date');
    const attachmentsAttr = element.getAttribute('data-attachments');

    document.getElementById('emptyState').style.display = 'none';
    const activePreview = document.getElementById('activePreview');
    activePreview.style.display = 'block';

    document.getElementById('viewSender').innerText = sender;
    document.getElementById('viewSubject').innerText = subject;
    document.getElementById('viewDate').innerText = date;
    document.getElementById('viewBody').innerHTML = fullMsg;

    document.querySelectorAll('.msg-card').forEach(card => card.classList.remove('active-msg'));
    element.classList.add('active-msg');

    const viewAttachments = document.getElementById('viewAttachments');
    viewAttachments.innerHTML = ''; 
    
    if (attachmentsAttr) {
        try {
            const attachments = JSON.parse(decodeURIComponent(attachmentsAttr));
            if (attachments.length > 0) {
                viewAttachments.style.display = 'flex';
                
                attachments.forEach(att => {
                    const safeUrl = att.url.replace(/'/g, "\\'");
                    const safeNameAttr = att.name.replace(/'/g, "\\'");
                    const safeTypeAttr = att.type.replace(/'/g, "\\'");
                    
                    const displaySafeName = escapeHTML(att.name);

                    const content = `<span class="material-icons">attachment</span><span>${displaySafeName}</span>`;
                    viewAttachments.innerHTML += `<div class="att-card" onclick="openAttachmentPreview('${safeUrl}', '${safeNameAttr}', '${safeTypeAttr}')">${content}</div>`;
                });
            } else {
                viewAttachments.style.display = 'none';
            }
        } catch (e) {
            console.error("Error parsing attachments", e);
            viewAttachments.style.display = 'none';
        }
    } else {
        viewAttachments.style.display = 'none';
    }

    const trashWarning = document.getElementById('trashWarning');
    if (folder === 'trash') {
        if (trashWarning) trashWarning.style.display = 'flex';
        
        const eraseDateSpan = document.getElementById('eraseDateSpan');
        if (eraseDateSpan) eraseDateSpan.innerText = eraseDate || '30 days from now';
        
        document.getElementById('actionStar').style.display = 'none'; 
        
        document.getElementById('actionArchive').innerHTML = '<span class="material-icons">restore_from_trash</span> Restore';
        document.getElementById('actionArchive').setAttribute('onclick', "handleAction('restore')");
        
        document.getElementById('actionTrash').innerHTML = '<span class="material-icons">delete_forever</span> Delete Forever';
        document.getElementById('actionTrash').setAttribute('onclick', "handleAction('delete_forever')");
    } else {
        if (trashWarning) trashWarning.style.display = 'none';
        
        document.getElementById('actionStar').style.display = 'flex';
        document.getElementById('actionStar').innerHTML = isStarred 
            ? '<span class="material-icons">star</span> Unstar' 
            : '<span class="material-icons">star_border</span> Star';
        
        document.getElementById('actionArchive').innerHTML = folder === 'archived'
            ? '<span class="material-icons">unarchive</span> Unarchive'
            : '<span class="material-icons">archive</span> Archive';
        document.getElementById('actionArchive').setAttribute('onclick', "handleAction('archive')");

        document.getElementById('actionTrash').innerHTML = '<span class="material-icons">delete_outline</span> Trash';
        document.getElementById('actionTrash').setAttribute('onclick', "handleAction('delete')");
    }
}

function resetPreview() {
    document.getElementById('emptyState').style.display = 'block';
    document.getElementById('activePreview').style.display = 'none';
    document.querySelectorAll('.msg-card').forEach(card => card.classList.remove('active-msg'));
    activeMessageId = null;
}

// --- ATTACHMENT MODAL LOGIC ---
function openAttachmentPreview(url, name, type) {
    document.getElementById('attPreviewTitle').innerHTML = `<span class="material-icons">attachment</span> ${escapeHTML(name)}`;
    const previewBody = document.getElementById('attPreviewBody');
    
    if (type.startsWith('image/')) {
        previewBody.innerHTML = `<img src="${url}" style="max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 8px;">`;
    } else if (type === 'application/pdf') {
        previewBody.innerHTML = `<iframe src="${url}" style="width: 100%; height: 100%; border: none; border-radius: 8px;"></iframe>`;
    } else {
        previewBody.innerHTML = `
            <div style="color: #666; display: flex; flex-direction: column; align-items: center;">
                <span class="material-icons" style="font-size: 64px; color: #b08d57; margin-bottom: 15px;">insert_drive_file</span>
                <h2>Preview not available</h2>
                <p style="margin-top: 10px;">This file type cannot be previewed in the browser. Please download it to view.</p>
            </div>
        `;
    }

    const downloadBtn = document.getElementById('attDownloadBtn');
    downloadBtn.onclick = () => {
        const a = document.createElement('a');
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    document.getElementById('attachmentModal').style.display = 'block';
}

function closeAttachmentPreview() {
    document.getElementById('attachmentModal').style.display = 'none';
    document.getElementById('attPreviewBody').innerHTML = ''; 
}

// --- DROPDOWN & ACTIONS LOGIC ---
function toggleDropdown(event) {
    event.stopPropagation(); 
    document.getElementById("messageDropdown").classList.toggle("show");
}

function handleAction(action) {
    if (!activeMessageId) return;

    const msgElement = document.getElementById(activeMessageId);
    if (!msgElement) return;

    if (!msgElement.hasAttribute('data-base-folder')) {
        const currentFolder = msgElement.getAttribute('data-folder');
        const base = (currentFolder === 'archived' || currentFolder === 'trash') ? 'inbox' : currentFolder;
        msgElement.setAttribute('data-base-folder', base);
    }

    if (action === 'star') {
        const currentlyStarred = msgElement.getAttribute('data-starred') === 'true';
        msgElement.setAttribute('data-starred', !currentlyStarred); 
    } 
    else if (action === 'archive') {
        const currentFolder = msgElement.getAttribute('data-folder');
        if (currentFolder === 'archived') {
            const baseFolder = msgElement.getAttribute('data-base-folder');
            msgElement.setAttribute('data-folder', baseFolder);
        } else {
            msgElement.setAttribute('data-folder', 'archived');
        }
    } 
    else if (action === 'delete') {
        const currentFolder = msgElement.getAttribute('data-folder');
        msgElement.setAttribute('data-restore-folder', currentFolder); 
        msgElement.setAttribute('data-folder', 'trash'); 
        msgElement.setAttribute('data-starred', 'false'); 
        
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 30);
        const dateOptions = { month: 'short', day: 'numeric', year: 'numeric' };
        msgElement.setAttribute('data-erase-date', futureDate.toLocaleDateString('en-US', dateOptions));
    }
    else if (action === 'restore') {
        const baseFolder = msgElement.getAttribute('data-base-folder') || 'inbox';
        msgElement.setAttribute('data-folder', baseFolder);
        msgElement.removeAttribute('data-erase-date');
        msgElement.removeAttribute('data-restore-folder'); 
    }
    else if (action === 'delete_forever') {
        document.getElementById("messageDropdown").classList.remove("show");
        openConfirmModal(
            "Delete Forever", 
            "Are you sure you want to permanently delete this message? This action cannot be undone.", 
            "single"
        );
        return; 
    }

    document.getElementById("messageDropdown").classList.remove("show");
    
    saveToStorage();
    filterMessages();
    
    if (msgElement.style.display === 'none') {
        resetPreview();
    } else {
        previewMessage(msgElement); 
    }
}

window.onclick = function(event) {
    if (!event.target.matches('.dots-btn') && !event.target.matches('.material-icons')) {
        const dropdown = document.getElementById("messageDropdown");
        if (dropdown && dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
        }
    }
}

// --- COMPOSE, ATTACHMENTS & SEND LOGIC ---
function openCompose() {
    document.getElementById('composeModal').style.display = 'block';
}

function closeCompose() {
    document.getElementById('composeModal').style.display = 'none';
    document.getElementById('composeForm').reset();
    
    currentAttachments = [];
    document.getElementById('composeFileList').innerHTML = '';
}

function handleFileSelect(event) {
    const files = event.target.files;
    const fileList = document.getElementById('composeFileList');
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileUrl = URL.createObjectURL(file); 
        
        currentAttachments.push({
            name: file.name,
            type: file.type,
            url: fileUrl
        });

        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `<span class="material-icons">attachment</span> ${escapeHTML(file.name)}`;
        fileList.appendChild(fileItem);
    }
}

/**
 * Helper function to trigger your existing CSS Toast styles
 */
function showToast(message, type = 'success') {
    // 1. Get the container (Make sure this exists in your HTML!)
    const container = document.querySelector('.toast-container');
    if (!container) return;

    // 2. Create the element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerText = message;

    // 3. Add to container
    container.appendChild(toast);

    // 4. Trigger the "toast-show" class after a tiny delay so the transition works
    setTimeout(() => {
        toast.classList.add('toast-show');
    }, 10);

    // 5. Remove the toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('toast-show');
        
        // Wait for the transition to finish before deleting the element from the DOM
        toast.addEventListener('transitionend', () => {
            toast.remove();
        });
    }, 3000);
}

function sendEmail(event) {
    event.preventDefault(); 

    // --- Validation (Optional but recommended) ---
    const toRaw = document.getElementById('composeTo').value;
    if (!toRaw) {
        showToast("Please specify a recipient", "error"); // Triggers red toast
        return;
    }

    const to = escapeHTML(toRaw);
    const subject = escapeHTML(document.getElementById('composeSubject').value);
    const rawMessage = document.getElementById('composeMessage').value;
    
    const message = escapeHTML(rawMessage).replace(/\n/g, '<br>');
    
    // ... (Your existing date and ID logic) ...
    const dateOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    const timeOptions = { hour: 'numeric', minute: '2-digit' };
    const now = new Date();
    const dateStr = `${now.toLocaleDateString('en-US', dateOptions)} | ${now.toLocaleTimeString('en-US', timeOptions)}`;
    const newMsgId = 'msg-' + Date.now(); 

    // ... (Your existing attachment logic) ...
    let attachmentsAttr = '';
    let paperclipIcon = '';
    if (currentAttachments.length > 0) {
        attachmentsAttr = `data-attachments="${encodeURIComponent(JSON.stringify(currentAttachments))}"`;
        paperclipIcon = '<span class="material-icons" style="font-size: 14px; vertical-align: middle;">attachment</span> ';
    }
    
    const newMsgHTML = `
        <div class="msg-card" id="${newMsgId}" onclick="previewMessage(this)" 
            data-folder="sent" 
            data-base-folder="sent"
            data-starred="false"
            data-sender="To: ${to}" 
            data-subject="${subject}" 
            data-date="${dateStr}"
            ${attachmentsAttr}
            data-fullmsg="${message}">
            <span class="material-icons star-indicator">star</span>
            <strong>To: ${to}</strong>
            <p class="subject">${subject}</p>
            <p class="snippet">${paperclipIcon}${message.substring(0, 40)}${message.length > 40 ? '...' : ''}</p>
        </div>
    `;
    
    document.getElementById('messageList').insertAdjacentHTML('afterbegin', newMsgHTML);
    
    saveToStorage();
    
    // ==========================================
    // TRIGGER GREEN TOAST HERE
    // ==========================================
    showToast(`Message sent to ${to}`, 'success');
    
    closeCompose();
    switchTab('sent'); 
}

// --- CUSTOM CONFIRMATION MODAL LOGIC ---
function emptyTrash() {
    const trashedMessages = document.querySelectorAll('.msg-card[data-folder="trash"]');
    if (trashedMessages.length === 0) {
        openConfirmModal(
            "Empty Trash",
            "Trash is already empty.",
            "empty_alert"
        );
        
        return;
        
    }
    openConfirmModal(
        "Empty Trash",
        `Are you sure you want to permanently delete all ${trashedMessages.length} message(s) in the Trash? This cannot be undone.`,
        "all"
    );
}

function openConfirmModal(title, message, type) {
    document.getElementById('confirmTitle').innerText = title;
    document.getElementById('confirmMessage').innerText = message;
    pendingDeleteAction = type;

    const cancelBtn = document.getElementById('confirmCancelBtn');
    const submitBtn = document.getElementById('confirmSubmitBtn');

    if (type === 'empty_alert') {
        cancelBtn.style.display = 'none';
        submitBtn.innerText = 'OK';
    } else {
        cancelBtn.style.display = 'inline-block';
        submitBtn.innerText = 'Confirm';
    }

    document.getElementById('confirmModal').style.display = 'block';
}

function closeConfirmModal() {
    document.getElementById('confirmModal').style.display = 'none';
    pendingDeleteAction = null;
}

function executeConfirm() {
    if (pendingDeleteAction === 'single') {
        if (activeMessageId) {
            const msgElement = document.getElementById(activeMessageId);
            if (msgElement) msgElement.remove();
            resetPreview();
        }
    } else if (pendingDeleteAction === 'all') {
        const trashedMessages = document.querySelectorAll('.msg-card[data-folder="trash"]');
        trashedMessages.forEach(msg => msg.remove());
        resetPreview();
    } 
    
    saveToStorage();
    closeConfirmModal();
    filterMessages(); 
    showToast("Message permanently deleted!","error")
}

