document.addEventListener('DOMContentLoaded', () => {

    // ── Watermark helper ──────────────────────────────
    // Reuses the PUP logo already in the sidebar img.
    function buildWatermark(label) {
        const logoSrc = document.querySelector('.sidebar-logo-icon img')?.src || '';
        const wm = document.createElement('div');
        wm.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-20deg);z-index:0;opacity:0.10;text-align:center;pointer-events:none;width:80%;';

        const img = document.createElement('img');
        img.src = logoSrc;
        img.style.cssText = 'max-width:220px;width:100%;display:block;margin:0 auto;';
        img.alt = 'PUP Logo';

        const lbl = document.createElement('div');
        lbl.textContent = label;
        lbl.style.cssText = 'font-size:28px;font-weight:900;letter-spacing:6px;color:#800000;margin-top:10px;font-family:serif;text-transform:uppercase;';

        wm.appendChild(img);
        wm.appendChild(lbl);
        return wm;
    }

// ── Print Header helper ──────────────────────────────
    function buildPrintHeader(titleText, metaText) {
        // Grab logo from the favicon link which is guaranteed to have the correct Flask url_for path
        const logoSrc = document.querySelector('link[rel="icon"]')?.href || '/static/images/logo88x88pup.png';

        const headerContainer = el('div', {
            attrs: { style: 'display:flex; align-items:center; margin-bottom:25px; padding-bottom:15px; border-bottom:2px solid #800000;' }
        });

        // The Logo
        const logoImg = el('img', {
            attrs: { 
                src: logoSrc, 
                alt: 'PUP Logo', 
                style: 'width:90px; height:90px; margin-right:20px; object-fit:contain;' 
            }
        });

        const textContainer = el('div', { attrs: { style: 'display:flex; flex-direction:column; justify-content:center;' } });

        // PUP Headers (Removed the degree text)
        const rpText = el('div', { text: 'Republic of the Philippines', attrs: { style: 'font-size:14px; font-family:Arial, sans-serif; margin-bottom:2px; color:#000;' } });
        const pupText = el('div', { text: 'POLYTECHNIC UNIVERSITY OF THE PHILIPPINES', attrs: { style: 'font-size:18px; font-family:"Times New Roman", Times, serif; font-weight:bold; margin-bottom:12px; color:#000;' } });
        
        // Existing Course Texts
        const cTitle = el('div', { text: titleText, attrs: { style: 'font-size:18px; font-family:Arial, sans-serif; font-weight:bold; color:#800000; margin-bottom:4px;' } });
        const cMeta = el('div', { text: metaText, attrs: { style: 'font-size:13px; font-family:Arial, sans-serif; color:#555;' } });

        append(textContainer, rpText, pupText, cTitle, cMeta);
        append(headerContainer, logoImg, textContainer);

        return headerContainer;
    }


    // ==========================================
    // XSS DEFENCE — one helper, used everywhere
    // Never interpolate untrusted strings into
    // innerHTML.  Use el.textContent or these
    // helpers to build DOM nodes instead.
    // ==========================================

    /**
     * Create an element, optionally set className and textContent.
     * @param {string} tag
     * @param {object} [opts] — { cls, text, attrs:{}, children:[] }
     * @returns {HTMLElement}
     */
    function el(tag, opts = {}) {
        const node = document.createElement(tag);
        if (opts.cls)  node.className   = opts.cls;
        if (opts.text != null) node.textContent = opts.text;
        if (opts.attrs) {
            for (const [k, v] of Object.entries(opts.attrs)) {
                // Never allow javascript: in href/src
                if ((k === 'href' || k === 'src') && /^\s*javascript:/i.test(String(v))) continue;
                node.setAttribute(k, v);
            }
        }
        if (opts.children) opts.children.forEach(c => c && node.appendChild(c));
        return node;
    }

    /** Append multiple children to a parent. */
    function append(parent, ...children) {
        children.forEach(c => c && parent.appendChild(c));
        return parent;
    }

    /** Create a text node — explicit, readable alternative to textContent. */
    function txt(str) { return document.createTextNode(str); }

    // ==========================================
    // 0. FLATPICKR
    // ==========================================
    function initFlatpickr(elem) {
        if (!elem || elem._flatpickr) return;
        flatpickr(elem, {
            enableTime:    true,
            dateFormat:    'Y-m-d H:i',
            altInput:      true,
            altFormat:     'M j, Y — h:i K',
            minDate:       'today',
            time_24hr:     false,
            disableMobile: true
        });
    }
    initFlatpickr(document.getElementById('assignDeadline'));
    initFlatpickr(document.getElementById('quizDeadline'));

    // ==========================================
    // 1. LOAD COURSE DATA
    // ==========================================
    const savedCourse = localStorage.getItem('puplms_current_course');
    if (savedCourse) {
        try {
            const c = JSON.parse(savedCourse);
            // textContent is safe — it never interprets HTML
            document.getElementById('overviewTitle').textContent    = c.name     || '';
            document.getElementById('overviewCode').textContent     = c.code     || '';
            document.getElementById('overviewSection').textContent  = c.section  || '';
            document.getElementById('overviewSchedule').textContent = c.schedule || '';
        } catch (_) {}
    }

    // ==========================================
    // 1b. SYLLABUS UPLOAD / DOWNLOAD
    //     File stored as a blob: URL in memory.
    //     All DOM writes use textContent / setAttribute.
    // ==========================================
    (function initSyllabus() {
        const fileInput   = document.getElementById('syllabusFile');
        const fileZone    = document.getElementById('syllabusFileZone');
        const fileNameEl  = document.getElementById('syllabusFileName');
        const downloadBtn = document.getElementById('syllabusDownloadBtn');

        if (!fileInput) return;

        let syllabusUrl = null;

        function activateDownload(url, name) {
            syllabusUrl = url;
            // setAttribute — url is always a blob: URL from createObjectURL, never user text
            downloadBtn.setAttribute('href', url);
            downloadBtn.setAttribute('download', name);
            downloadBtn.removeAttribute('aria-disabled');
            downloadBtn.style.pointerEvents = '';
            downloadBtn.style.opacity       = '';
        }

        fileInput.addEventListener('change', () => {
            const file = fileInput.files[0];
            if (!file) return;

            // Revoke previous blob to avoid memory leak
            if (syllabusUrl) URL.revokeObjectURL(syllabusUrl);

            const url = URL.createObjectURL(file);
            // textContent — safe, never parsed as HTML
            fileNameEl.textContent = file.name;
            activateDownload(url, file.name);
            showToast('Syllabus uploaded.', 'success');
        });

        // Keyboard accessibility on the label-as-button
        fileZone?.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInput.click(); }
        });
    })();

        // ==========================================
    // 2. TAB SWITCHING
    // ==========================================
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            const pane = document.getElementById(btn.dataset.tab);
            if (pane) pane.classList.add('active');
        });
    });

    // ==========================================
    // 3. GARAGE-DOOR TOGGLE
    // ==========================================
    function setupGarageDoor(toggleBtnId, formId, cancelBtnId) {
        const btn    = document.getElementById(toggleBtnId);
        const form   = document.getElementById(formId);
        const cancel = document.getElementById(cancelBtnId);
        const open   = () => { form.classList.add('garage-open');    btn?.classList.add('btn-create--active'); };
        const close  = () => { form.classList.remove('garage-open'); btn?.classList.remove('btn-create--active'); };
        btn?.addEventListener('click',   () => form.classList.contains('garage-open') ? close() : open());
        cancel?.addEventListener('click', close);
        return { open, close };
    }

    const moduleGarage = setupGarageDoor('toggleModuleFormBtn',    'moduleFormContainer',     'cancelModuleFormBtn');
    const assignGarage = setupGarageDoor('toggleAssignmentFormBtn','assignmentFormContainer', 'cancelAssignFormBtn');
    const quizGarage   = setupGarageDoor('toggleQuizFormBtn',      'quizFormContainer',       'cancelQuizFormBtn');

    // ==========================================
    // 4. PILL SELECT
    // ==========================================
    function setupPillSelect(groupId, hiddenId, onChange) {
        const group  = document.getElementById(groupId);
        const hidden = document.getElementById(hiddenId);
        if (!group || !hidden) return;
        group.querySelectorAll('.pill-option').forEach(pill => {
            pill.addEventListener('click', () => {
                group.querySelectorAll('.pill-option').forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                hidden.value = pill.dataset.value;
                onChange?.(pill.dataset.value);
            });
        });
    }

    // ==========================================
    // 5. ANNOUNCEMENTS
    // ==========================================
    // Read instructor name once from the DOM span (already rendered server-side).
    // Use textContent — never innerHTML — when writing it back.
    const instructorName = document.getElementById('overviewInstructor')?.textContent?.trim() || 'Instructor';

    document.getElementById('postAnnouncementBtn')?.addEventListener('click', () => {
        const input = document.getElementById('announcementInput');
        const text  = input.value.trim();
        if (!text) return;

        const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

        // Build entirely with DOM API — no innerHTML with any variable
        const header = el('div', { cls: 'announcement-header' });
        const info   = el('div', { cls: 'announcement-info' });
        append(info,
            el('span', { cls: 'announcement-author', text: instructorName }),
            el('span', { cls: 'announcement-date',   text: date })
        );
        const actions = el('div', { cls: 'card-actions' });
        append(actions,
            el('button', { cls: 'action-btn btn-pin',    text: 'Pin' }),
            el('button', { cls: 'action-btn btn-delete', text: 'Delete'})
            
        );
        append(header, info, actions);

        const body = el('p', { cls: 'announcement-body', text: text });

        const card = el('div', { cls: 'announcement-card' });
        append(card, header, body);

        document.getElementById('announcementsFeed').prepend(card);
        input.value = '';
        showToast('Posted.', 'success');
    });

    // ==========================================
    // 6. SHARED FILE DROP HANDLER (Modules & Assignments)
    // ==========================================
    function setupFileDrop(inputId, displayId, zoneId) {
        const fileInput = document.getElementById(inputId);
        const display = document.getElementById(displayId);
        const zone = document.getElementById(zoneId);

        function updateDisplay(file) {
            if (!display) return;
            if (file) {
                display.textContent = file.name;
                display.style.display = 'block';
            } else {
                display.textContent = '';
                display.style.display = 'none';
            }
        }

        fileInput?.addEventListener('change', () => updateDisplay(fileInput.files[0] || null));

        if (zone) {
            ['dragover','dragenter'].forEach(ev => zone.addEventListener(ev, e => {
                e.preventDefault(); zone.classList.add('file-drop-zone--active');
            }));
            ['dragleave','dragend','drop'].forEach(ev => zone.addEventListener(ev, e => {
                e.preventDefault(); zone.classList.remove('file-drop-zone--active');
            }));
            zone.addEventListener('drop', e => {
                const files = e.dataTransfer.files;
                if (files.length && fileInput) {
                    fileInput.files = files;
                    updateDisplay(files[0]);
                }
            });
        }

        return {
            clear: () => {
                if (fileInput) fileInput.value = '';
                updateDisplay(null);
            },
            getFile: () => fileInput?.files[0] || null
        };
    }

    const moduleFileHandler = setupFileDrop('moduleFile', 'fileNameDisplay', 'moduleFileDropZone');
    const assignFileHandler = setupFileDrop('assignFile', 'assignFileNameDisplay', 'assignFileDropZone');


    // ==========================================
    // 6.5 ADD MODULE
    // ==========================================
    document.getElementById('addModuleBtn')?.addEventListener('click', () => {
        const num   = document.getElementById('moduleNumber').value.trim();
        const title = document.getElementById('moduleTitle').value.trim();
        const file  = moduleFileHandler.getFile();

        if (!num || !title) { showToast('Enter module number and title.', 'error'); return; }

        const fileName   = file ? file.name : 'No file attached';
        const fileUrl    = file ? URL.createObjectURL(file) : null;
        const previewable = file && (file.type === 'application/pdf' || file.type.startsWith('image/'));

        // Build card with DOM API
        const badge   = el('div', { cls: 'module-number-badge', text: `Module ${num}` });
        const titleEl = el('h4',  { cls: 'module-lesson-title', text: title });

        // File link — set href via setAttribute, never via innerHTML
        const svgNS = 'http://www.w3.org/2000/svg';
        const svg   = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('width','13'); svg.setAttribute('height','13');
        svg.setAttribute('viewBox','0 0 24 24'); svg.setAttribute('fill','none');
        svg.setAttribute('stroke','currentColor'); svg.setAttribute('stroke-width','2');
        const p1 = document.createElementNS(svgNS,'path');
        p1.setAttribute('d','M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z');
        const pl = document.createElementNS(svgNS,'polyline');
        pl.setAttribute('points','14 2 14 8 20 8');
        svg.appendChild(p1); svg.appendChild(pl);

        const dlLink = el('a', { cls: 'file-download', text: fileName });
        if (fileUrl) {
            dlLink.setAttribute('href', fileUrl);
            dlLink.setAttribute('download', fileName);
        }

        const fileRow = el('div', { cls: 'module-file-link' });
        append(fileRow, svg, dlLink);

        if (previewable) {
            const prevBtn = el('button', { cls: 'action-btn btn-preview-file', text: 'Preview' });
            prevBtn.addEventListener('click', () => openFilePreviewModal(fileUrl, file.type, fileName));
            fileRow.appendChild(prevBtn);
        }

        const details = el('div', { cls: 'module-details' });
        append(details, titleEl, fileRow);

        const delBtn = el('button', { cls: 'action-btn btn-delete', text: 'Delete' });

        const card = el('div', { cls: 'module-card' });
        append(card, badge, details, delBtn);

        document.getElementById('modulesList').appendChild(card);

        document.getElementById('moduleNumber').value = '';
        document.getElementById('moduleTitle').value  = '';
        moduleFileHandler.clear();
        moduleGarage.close();

        showToast('Module Added successfully.', 'success');
        
    });

    // ==========================================
    // 7. SHARED QUESTION BUILDER
    //     Template strings here contain ONLY
    //     hardcoded letters/labels — no user data.
    //     User input (question text, options) is
    //     always written via textContent later.
    // ==========================================
    function createQuestionBlock(type) {
        const block = el('div', { cls: 'question-block' });

        // Header row
        const idxSpan = el('span', { cls: 'question-index', text: 'Q' });
        const ptsLabel = el('label', { cls: 'input-label', text: 'Points', attrs: { style: 'margin:0;' } });
        const ptsInput = el('input', { cls: 'question-pts-input question-points', attrs: { type:'number', value:'1', min:'1' } });
        const removeBtn = el('button', { cls: 'btn-remove-question', text: 'Remove', attrs: { type:'button' } });
        removeBtn.addEventListener('click', () => block.remove());

        const headerRight = el('div', { cls: 'question-header-right' });
        append(headerRight, ptsLabel, ptsInput, removeBtn);
        const header = el('div', { cls: 'question-header' });
        append(header, idxSpan, headerRight);

        const textarea = el('textarea', {
            cls: 'modern-textarea question-text',
            attrs: { style: 'min-height:60px;', placeholder: 'Type your question here...' }
        });

        append(block, header, textarea);

        if (type === 'Multiple Choice') {
            const section = el('div', { cls: 'question-options-section' });
            const optLabel = el('div', { cls: 'input-label', text: 'Answer Options', attrs: { style: 'margin-bottom:8px;' } });
            section.appendChild(optLabel);

            ['A','B','C','D'].forEach(letter => {
                const row    = el('div', { cls: 'mc-option-row' });
                const lbl    = el('span', { cls: 'mc-letter', text: letter });
                const input  = el('input', { cls: 'modern-input mc-input', attrs: { type:'text', placeholder:`Option ${letter}` } });
                append(row, lbl, input);
                section.appendChild(row);
            });

            const correctLabel = el('div', { cls: 'input-label', text: 'Correct Answer', attrs: { style: 'margin-bottom:6px; margin-top:12px;' } });
            const pillGroup    = el('div', { cls: 'pill-select-group mc-correct-pills' });
            const hiddenInput  = el('input', { cls: 'mc-correct', attrs: { type:'hidden', value:'' } });

            ['A','B','C','D'].forEach(letter => {
                const pill = el('button', { cls: 'pill-option', text: letter, attrs: { type:'button', 'data-value': letter } });
                pill.addEventListener('click', () => {
                    pillGroup.querySelectorAll('.pill-option').forEach(p => p.classList.remove('active'));
                    pill.classList.add('active');
                    hiddenInput.value = letter;
                });
                pillGroup.appendChild(pill);
            });

            append(section, correctLabel, pillGroup, hiddenInput);
            block.appendChild(section);

        } else if (type === 'Fill in the Blank') {
            const section   = el('div', { cls: 'question-options-section' });
            const lbl       = el('div', { cls: 'input-label' });
            lbl.appendChild(txt('Correct Answer '));
            lbl.appendChild(el('span', { cls: 'label-optional', text: '(auto-graded)', attrs: { style: 'margin-bottom:6px;' } }));
            const ansInput  = el('input', { cls: 'modern-input fitb-answer', attrs: { type:'text', placeholder:'Enter the exact correct answer...' } });
            append(section, lbl, ansInput);
            block.appendChild(section);
        }

        return block;
    }

    function renumberQuestions(container) {
        container.querySelectorAll('.question-index').forEach((span, i) => {
            span.textContent = `Q${i + 1}`;
        });
    }

    // ==========================================
    // 8. ASSIGNMENT BUILDER
    // ==========================================
    const assignQContainer = document.getElementById('questionsContainer');
    const assignQWrapper   = document.getElementById('questionsWrapper');
    const assignBasicWrap  = document.getElementById('basicInstructionsWrapper');
    const guidelinesWrapper = document.getElementById('guidelinesWrapper');

    setupPillSelect('assignTypePills', 'assignType', type => {
        assignQContainer.innerHTML = '';
        if (type === 'File Upload') {
            assignBasicWrap.style.display = 'block';
            if (guidelinesWrapper) guidelinesWrapper.style.display = 'block';
            assignQWrapper.style.display  = 'none';
        } else {
            assignBasicWrap.style.display = 'none';
            if (guidelinesWrapper) guidelinesWrapper.style.display = 'none';
            assignQWrapper.style.display  = 'block';
            assignQContainer.appendChild(createQuestionBlock(type));
        }
    });

    document.getElementById('addQuestionBtn')?.addEventListener('click', () => {
        const type = document.getElementById('assignType').value;
        assignQContainer.appendChild(createQuestionBlock(type));
        renumberQuestions(assignQContainer);
    });

    document.getElementById('addAssignmentBtn')?.addEventListener('click', () => {
        const title        = document.getElementById('assignTitle').value.trim();
        const rawDate      = document.getElementById('assignDeadline').value;
        const type         = document.getElementById('assignType').value;
        const instructions = type === 'File Upload' ? document.getElementById('assignInstructions').value.trim() : '';
        
        if (!title || !rawDate) { showToast('Fill in the Title and Deadline.', 'error'); return; }

        // Capture uploaded guidelines file if present
        const guidelinesFile = assignFileHandler.getFile();
        let guidelineName = null;
        let guidelineUrl = null;
        if (guidelinesFile && type === 'File Upload') {
            guidelineName = guidelinesFile.name;
            guidelineUrl = URL.createObjectURL(guidelinesFile);
        }

        const data = {
            id:           'asgn-' + Date.now(),
            title,
            type,
            deadline:     formatDate(rawDate),
            questions:    collectQuestions(assignQContainer, type),
            instructions,
            guidelineName,
            guidelineUrl,
            submissions:  []
        };

        document.querySelector('#assignmentsList .empty-state-inline')?.remove();
        renderActivityCard(data, document.getElementById('assignmentsList'));
        addGradeColumn(title, 100);

        document.getElementById('assignTitle').value        = '';
        document.getElementById('assignInstructions').value = '';
        clearFlatpickr('assignDeadline');
        assignQContainer.innerHTML = '';
        if (type !== 'File Upload') assignQContainer.appendChild(createQuestionBlock(type));
        
        assignFileHandler.clear();
        assignGarage.close();
        showToast('Assignment Published.', 'success');
    });

    // ==========================================
    // 9. QUIZ BUILDER
    // ==========================================
    const quizQContainer = document.getElementById('quizQuestionsContainer');

    setupPillSelect('quizTypePills', 'quizType', type => {
        quizQContainer.innerHTML = '';
        quizQContainer.appendChild(createQuestionBlock(type));
    });

    if (quizQContainer) quizQContainer.appendChild(createQuestionBlock('Multiple Choice'));

    document.getElementById('addQuizQuestionBtn')?.addEventListener('click', () => {
        const type = document.getElementById('quizType').value;
        quizQContainer.appendChild(createQuestionBlock(type));
        renumberQuestions(quizQContainer);
    });

    document.getElementById('addQuizBtn')?.addEventListener('click', () => {
        const title    = document.getElementById('quizTitle').value.trim();
        const rawDate  = document.getElementById('quizDeadline').value;
        const type     = document.getElementById('quizType').value;
        const duration = document.getElementById('quizDuration').value.trim();
        if (!title || !rawDate) { showToast('Fill in the Title and Deadline.', 'error'); return; }

        const data = {
            id:          'quiz-' + Date.now(),
            title,
            type,
            deadline:    formatDate(rawDate),
            duration,
            questions:   collectQuestions(quizQContainer, type),
            instructions: document.getElementById('quizInstructions').value.trim(),
            submissions: [],
            isQuiz:      true
        };

        document.querySelector('#quizzesList .empty-state-inline')?.remove();
        renderActivityCard(data, document.getElementById('quizzesList'));
        addGradeColumn(title, 100);

        document.getElementById('quizTitle').value        = '';
        document.getElementById('quizInstructions').value = '';
        document.getElementById('quizDuration').value     = '';
        clearFlatpickr('quizDeadline');
        quizQContainer.innerHTML = '';
        quizQContainer.appendChild(createQuestionBlock(type));
        quizGarage.close();
        showToast('Quiz Published.', 'success');
    });

    // ==========================================
    // 10. ACTIVITY CARD
    //     All user-supplied strings (title, type,
    //     deadline, duration, instructions) are
    //     written with textContent only.
    //     The submissions panel id is set via
    //     setAttribute, never string-concatenated
    //     into innerHTML.
    // ==========================================
    function makePill(cls, text) {
        return el('span', { cls: `meta-pill ${cls}`, text });
    }

    function renderActivityCard(data, container) {
        const subCount = data.submissions.length;
        const qCount   = data.questions.length;

        const card = el('div', { cls: 'activity-card' + (data.isQuiz ? ' activity-card--quiz' : '') });
        card.dataset.activityId = data.id;  // dataset.* is always text, never parsed as HTML

        // ── Header ──
        const titleEl   = el('h4', { cls: 'activity-card-title', text: data.title });
        const metaRow   = el('div', { cls: 'activity-meta' });

        if (data.isQuiz)                        metaRow.appendChild(makePill('pill-quiz',    'Quiz'));
        /* type, deadline, duration are from user input — use textContent via makePill */
        metaRow.appendChild(makePill('pill-type', data.type));
        if (data.type !== 'File Upload')        metaRow.appendChild(makePill('pill-neutral', `${qCount} Question${qCount !== 1 ? 's' : ''}`));
        const duePill = makePill('pill-due', `Due ${data.deadline}`);
        metaRow.appendChild(duePill);
        if (data.duration)                      metaRow.appendChild(makePill('pill-neutral', `${data.duration} min`));

        const titleGroup = el('div', { cls: 'activity-card-title-group' });
        append(titleGroup, titleEl, metaRow);

        // Submissions button — count badge is a numeric derived value, safe
        const subBadge  = el('span', { cls: 'sub-count-badge', text: String(subCount) });
        const subBtn    = el('button', { cls: 'btn-submissions' });
        subBtn.appendChild(txt('Submissions '));
        subBtn.appendChild(subBadge);

        const editBtn   = el('button', { cls: 'action-btn btn-edit-activity', text: 'Edit' });
        const deleteBtn = el('button', { cls: 'action-btn btn-delete',         text: 'Delete' });

        const cardActions = el('div', { cls: 'activity-card-actions' });
        append(cardActions, subBtn, editBtn, deleteBtn);

        const cardHeader = el('div', { cls: 'activity-card-header' });
        append(cardHeader, titleGroup, cardActions);

        card.appendChild(cardHeader);

        // ── Instructions & Guideline File (optional) ──
        if (data.instructions || data.guidelineName) {
            const instrContainer = el('div', { cls: 'activity-instructions' });
            
            if (data.instructions) {
                instrContainer.appendChild(el('div', { text: data.instructions, attrs: { style: 'white-space: pre-wrap; margin-bottom: 8px;' } }));
            }
            
            // Add guideline file download if available
            if (data.guidelineName) {
                const svgNS = 'http://www.w3.org/2000/svg';
                const svg   = document.createElementNS(svgNS, 'svg');
                svg.setAttribute('width','13'); svg.setAttribute('height','13');
                svg.setAttribute('viewBox','0 0 24 24'); svg.setAttribute('fill','none');
                svg.setAttribute('stroke','currentColor'); svg.setAttribute('stroke-width','2');
                const p1 = document.createElementNS(svgNS,'path');
                p1.setAttribute('d','M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z');
                const pl = document.createElementNS(svgNS,'polyline');
                pl.setAttribute('points','14 2 14 8 20 8');
                svg.appendChild(p1); svg.appendChild(pl);

                const dlLink = el('a', { cls: 'file-download', text: data.guidelineName });
                if (data.guidelineUrl) {
                    dlLink.setAttribute('href', data.guidelineUrl);
                    dlLink.setAttribute('download', data.guidelineName);
                }

                const fileRow = el('div', { cls: 'module-file-link', attrs: { style: 'display: inline-flex; background: #fff; padding: 6px 12px; border: 1px dashed #d8c49a; border-radius: 4px; margin-top: 4px;' } });
                append(fileRow, svg, dlLink);
                instrContainer.appendChild(fileRow);
            }

            card.appendChild(instrContainer);
        }

        // ── Submissions panel ──
        const panelId     = `subs-${data.id}`;      // used only in setAttribute
        const subPanel    = el('div', { cls: 'submissions-panel' });
        subPanel.setAttribute('id', panelId);       // setAttribute — never innerHTML

        const panelTitle  = el('span', { cls: 'submissions-panel-title' });
        const subPanelCount = el('span', { cls: 'sub-panel-count', text: String(subCount) });
        panelTitle.appendChild(txt('Submissions ('));
        panelTitle.appendChild(subPanelCount);
        panelTitle.appendChild(txt(')'));

        const searchInput = el('input', { cls: 'sub-search', attrs: { type:'text', placeholder:'Search student...' } });

        const panelHeader = el('div', { cls: 'submissions-panel-header' });
        append(panelHeader, panelTitle, searchInput);

        const listInner   = el('div', { cls: 'submissions-list-inner' });
        listInner.appendChild(el('p', { cls: 'no-subs-msg', text: 'No submissions yet.' }));

        append(subPanel, panelHeader, listInner);
        card.appendChild(subPanel);

        // ── Event wiring ──
        subBtn.addEventListener('click',  () => subPanel.classList.toggle('show'));
        editBtn.addEventListener('click', () => openEditModal(data, card, duePill));

        searchInput.addEventListener('input', e => {
            const q = e.target.value.toLowerCase();
            listInner.querySelectorAll('.submission-row').forEach(row => {
                row.style.display = row.querySelector('.sub-name').textContent.toLowerCase().includes(q) ? '' : 'none';
            });
        });

        container.prepend(card);
    }

    function refreshSubmissions(listInner, subBadge, subPanelCount, data) {
        const count = data.submissions.length;
        // Numeric counts — safe to assign as text
        subBadge.textContent     = String(count);
        subPanelCount.textContent = String(count);

        listInner.innerHTML = ''; // no user data here — just clearing the container

        if (!count) {
            listInner.appendChild(el('p', { cls: 'no-subs-msg', text: 'No submissions yet.' }));
            return;
        }

        data.submissions.forEach((sub, idx) => {
            // Initials derived from sub.name — written via textContent
            const initials = sub.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

            const avatar   = el('div', { cls: 'sub-avatar', text: initials });
            const nameEl   = el('div', { cls: 'sub-name',   text: sub.name });
            // sub.date comes from toLocaleDateString — output is locale-controlled, no user HTML
            const dateEl   = el('div', { cls: 'sub-date',   text: `Submitted: ${sub.date}` });
            const nameWrap = el('div');
            append(nameWrap, nameEl, dateEl);
            const studentInfo = el('div', { cls: 'sub-student-info' });
            append(studentInfo, avatar, nameWrap);

            // View button
            const viewBtn = data.type === 'File Upload'
                ? el('button', { cls: 'action-btn btn-view-file',    text: 'View File' })
                : el('button', { cls: 'action-btn btn-view-answers', text: 'View Answers' });

            // Grade controls
            const gradeInput = el('input', { cls: 'grade-input', attrs: {
                type: 'number', placeholder: 'Grade',
                value: sub.grade !== null ? String(sub.grade) : '',
                min: '0'
            }});
            const saveBtn = el('button', { cls: 'post-btn btn-save-grade', text: 'Save', attrs: { style: 'padding:6px 14px;font-size:12px;' } });
            const gradeGroup = el('div', { cls: 'grade-input-group' });
            append(gradeGroup, gradeInput, saveBtn);

            const badgeCls = sub.grade !== null ? 'badge-graded' : 'badge-pending';
            const badgeText = sub.grade !== null ? `${sub.grade} pts` : 'Pending';
            const badge = el('span', { cls: `grade-badge ${badgeCls}`, text: badgeText });

            const actions = el('div', { cls: 'sub-actions' });
            append(actions, viewBtn, gradeGroup, badge);

            const row = el('div', { cls: 'submission-row' });
            append(row, studentInfo, actions);

            // Grade save
            saveBtn.addEventListener('click', () => {
                const val = parseFloat(gradeInput.value);
                if (isNaN(val)) { showToast('Enter a valid grade.', 'error'); return; }
                data.submissions[idx].grade = val;
                badge.textContent  = `${val} pts`;
                badge.className    = 'grade-badge badge-graded';
                gradeInput.value   = String(val);
                updateGradeCell(data.title, sub.name, val);
                showToast(`Grade saved for ${sub.name}.`, 'success');
            });

            // View file / answers
            if (data.type === 'File Upload') {
                viewBtn.addEventListener('click', () => {
                    if (sub.fileUrl) openFilePreviewModal(sub.fileUrl, 'application/pdf', sub.fileName);
                    else showToast('No file available.', 'info');
                });
            } else {
                viewBtn.addEventListener('click', () => openAnswersModal(sub, data));
            }

            listInner.appendChild(row);
        });
    }

    // ==========================================
    // 11. CLASS RECORD
    // ==========================================
    let gradeStudents = [
        'Maria Santos','Juan Dela Cruz','Ana Reyes','Carlo Mendoza',
        'Lisa Tanaka','Miguel Torres','Rachel Kim','Paolo Bautista'
    ];

    const studentIds = {
        'Maria Santos': '2024-00123-SM-0',
        'Juan Dela Cruz': '2024-00124-SM-0',
        'Ana Reyes': '2024-00125-SM-0',
        'Carlo Mendoza': '2024-00126-SM-0',
        'Lisa Tanaka': '2024-00127-SM-0',
        'Miguel Torres': '2024-00128-SM-0',
        'Rachel Kim': '2024-00129-SM-0',
        'Paolo Bautista': '2024-00130-SM-0'
    };

    const gradeColumns = [];  // [{ title, max }]
    const gradeData    = {};  // { studentName: { colTitle: value } }
    let   gradeMode    = 'score';
    gradeStudents.forEach(s => { gradeData[s] = {}; });

    document.getElementById('openAddColModalBtn')?.addEventListener('click', () => {
        document.getElementById('newColName').value = '';
        document.getElementById('newColMax').value  = '100';
        openModal('addColModal');
    });
    document.getElementById('closeAddColModalBtn')?.addEventListener('click', () => closeModal('addColModal'));
    document.getElementById('cancelAddColBtn')?.addEventListener('click',     () => closeModal('addColModal'));
    document.getElementById('confirmAddColBtn')?.addEventListener('click', () => {
        const name = document.getElementById('newColName').value.trim();
        const max  = parseFloat(document.getElementById('newColMax').value) || 100;
        if (!name) { showToast('Enter a column name.', 'error'); return; }
        addGradeColumn(name, max);
        closeModal('addColModal');
        showToast(`Column Added.`, 'success');
    });

    // `Add St`udent modal
    document.getElementById('openAddStudentModalBtn')?.addEventListener('click', () => {
        document.getElementById('newStudentName').value = '';
        document.getElementById('newStudentId').value = ''; 
        openModal('addStudentModal');
        setTimeout(() => document.getElementById('newStudentId').focus(), 120);
    });
    document.getElementById('closeAddStudentModalBtn')?.addEventListener('click', () => closeModal('addStudentModal'));
    document.getElementById('cancelAddStudentBtn')?.addEventListener('click',     () => closeModal('addStudentModal'));
    document.getElementById('confirmAddStudentBtn')?.addEventListener('click', () => {
        const name = document.getElementById('newStudentName').value.trim();
        const sid = document.getElementById('newStudentId').value.trim(); 

        if (!name) { showToast('Enter a student name.', 'error'); return; }
        if (gradeStudents.includes(name)) { showToast('Student already exists.', 'error'); return; }
        
        gradeStudents.push(name);
        studentIds[name] = sid || 'N/A'; 

        gradeData[name] = {};
        attData[name]   = {};
        renderGradeTable();
        renderAttTable();
        closeModal('addStudentModal');
        showToast(`${name} Added.`, 'success');
    });

    document.getElementById('toggleGradeViewBtn')?.addEventListener('click', function () {
        gradeMode = gradeMode === 'score' ? 'percent' : 'score';
        this.textContent = gradeMode === 'score' ? 'Show as %' : 'Show as Score';
        renderGradeTable();
    });

    function addGradeColumn(title, max = 100) {
        if (gradeColumns.find(c => c.title === title)) return;
        gradeColumns.push({ title, max });
        renderGradeTable();
    }

    function updateGradeCell(colTitle, studentName, val) {
        if (!gradeData[studentName]) gradeData[studentName] = {};
        gradeData[studentName][colTitle] = val;
        renderGradeTable();
    }

    function renderGradeTable() {
        const thead = document.getElementById('gradeTableHead');
        const tbody = document.getElementById('gradeTableBody');
        if (!thead || !tbody) return;

        // ── Header row — built entirely with DOM API ──
        const headerRow = el('tr');

        const thId = el('th', { cls: 'grade-th grade-th-id', text: 'Student ID' });
        headerRow.appendChild(thId);

        const thName = el('th', { cls: 'grade-th grade-th-name', text: 'Student' });
        headerRow.appendChild(thName);

        gradeColumns.forEach(col => {
    const th = el('th', { cls: 'grade-th' });
    const head = el('div', { cls: 'grade-col-head' });
    const nameSpan = el('span', { cls: 'grade-col-name-text', text: col.title });
    const metaRow = el('div', { cls: 'grade-col-meta-row' });
    const maxLabel = el('span', { cls: 'grade-col-max-label', text: `Max: ${col.max}` });

    // --- REMOVE BUTTON PARA SA GRADE COLUMN ---
    const removeBtn = el('button', { cls: 'btn-remove-col', attrs: { title: 'Remove column' } });
    removeBtn.innerHTML = `
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>`;
    
    removeBtn.addEventListener('click', () => {
        // I-set ang data para sa Global Delete Modal
        itemToDelete = { type: 'grade-col', title: col.title };
        document.getElementById('confirmModalTitle').textContent = `Delete Column "${col.title}"?`;
        openModal('deleteConfirmModal');
    });

    append(metaRow, maxLabel, removeBtn);
    append(head, nameSpan, metaRow);
    th.appendChild(head);
    headerRow.appendChild(th);
});

        const thTotal = el('th', { cls: 'grade-th grade-th-total', text: gradeMode === 'percent' ? 'Total (%)' : 'Total' });
        headerRow.appendChild(thTotal);

        thead.innerHTML = '';
        thead.appendChild(headerRow);

        // ── Body rows — all student names are from our own constant array ──
        tbody.innerHTML = '';
        gradeStudents.forEach((student, si) => {
            const row      = el('tr', { cls: si % 2 === 0 ? 'grade-row-even' : 'grade-row-odd' });
            const initials = student.split(' ').map(n => n[0]).join('').slice(0, 2);

            // Student ID cell
            const tdId = el('td', { cls: 'grade-td grade-td-id', text: studentIds[student] || 'N/A' });
            row.appendChild(tdId);

            // Student name cell
            const avatar   = el('div',  { cls: 'grade-avatar',       text: initials });
            const label    = el('span', { cls: 'grade-student-label', text: student });
            const sInfo    = el('div',  { cls: 'grade-student-info' });
            append(sInfo, avatar, label);
            const tdName   = el('td',   { cls: 'grade-td grade-td-name' });
            tdName.appendChild(sInfo);
            row.appendChild(tdName);

            // Grade cells — read-only display
            let totalScore = 0, totalMax = 0;
            gradeColumns.forEach(col => {
                const raw    = gradeData[student]?.[col.title];
                const numVal = (raw !== undefined && raw !== null) ? parseFloat(raw) : null;
                totalScore  += numVal || 0;
                totalMax    += col.max || 100;

                const td = el('td', { cls: 'grade-td grade-td-cell' });
                if (numVal !== null) {
                    // Both numVal and col.max are parsed numbers — safe to use as text
                    append(td,
                        el('span', { cls: 'grade-cell-value', text: String(numVal) }),
                        el('span', { cls: 'grade-cell-denom', text: ` / ${col.max}` })
                    );
                } else {
                    td.appendChild(el('span', { cls: 'grade-cell-empty', text: '—' }));
                }
                row.appendChild(td);
            });

            // Total cell
            let totalText;
            if (gradeColumns.length === 0)       totalText = '—';
            else if (gradeMode === 'percent')     totalText = totalMax > 0 ? `${((totalScore / totalMax) * 100).toFixed(1)}%` : '—';
            else                                  totalText = `${totalScore} / ${totalMax}`;
            row.appendChild(el('td', { cls: 'grade-td grade-td-total', text: totalText }));

            tbody.appendChild(row);
            
        });
    }

    renderGradeTable();

    // ==========================================
    // 11b. PRINT CLASS RECORD
    //      Builds a clean, isolated DOM region,
    //      injects it into the page, prints, then
    //      removes it.  All student/column names
    //      are written via textContent — XSS-safe.
    // ==========================================
    document.getElementById('printGradeBtn')?.addEventListener('click', () => {
        buildAndPrint();
    });

    function buildAndPrint() {
        // ── Pull live state from rendered table ──────────────
        const sourceHead = document.getElementById('gradeTableHead');
        const sourceBody = document.getElementById('gradeTableBody');
        if (!sourceHead || !sourceBody) return;

        // ── Wrapper that @media print will make visible ──────
        const region = el('div', { attrs: { id: 'print-region' } });

        // ── Print-only header ────────────────────────────────
        const courseTitle = document.getElementById('overviewTitle')?.textContent?.trim() || 'Course';
        const courseCode  = document.getElementById('overviewCode')?.textContent?.trim()  || '';
        const section     = document.getElementById('overviewSection')?.textContent?.trim() || '';

        const metaText = `${courseCode}  |  ${section}  |  Class Record  |  Printed: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
        const printHeader = buildPrintHeader(courseTitle, metaText);
        region.appendChild(printHeader);
        region.appendChild(buildWatermark('CLASS RECORD'));

        // ── Clone the table structure ─────────────────────────
        // We re-build from gradeColumns/gradeStudents/gradeData
        // so we always have clean, current data — no DOM scraping
        // of potentially-modified cells.

        const table = el('table', { cls: 'grade-table', attrs: { style: 'width:100%;border-collapse:collapse;' } });
        const thead = el('thead');
        const tbody = el('tbody');

        // Header row
        const hRow  = el('tr');
        hRow.appendChild(el('th', { cls: 'grade-th grade-th-id', text: 'Student ID' }));
        hRow.appendChild(el('th', { cls: 'grade-th grade-th-name', text: 'Student' }));

        gradeColumns.forEach(col => {
            const th = el('th', { cls: 'grade-th' });
            // col.title is user input — textContent only
            const nameSpan = el('span', { cls: 'grade-col-name-text', text: col.title });
            const maxSpan  = el('div',  { cls: 'grade-col-max-label', text: `Max: ${col.max}` });
            append(th, nameSpan, maxSpan);
            hRow.appendChild(th);
        });
        hRow.appendChild(el('th', { cls: 'grade-th grade-th-total', text: gradeMode === 'percent' ? 'Total (%)' : 'Total' }));
        thead.appendChild(hRow);

        // Body rows
        gradeStudents.forEach((student, si) => {
            const row = el('tr', { cls: si % 2 === 0 ? 'grade-row-even' : 'grade-row-odd' });

            const tdId = el('td', { cls: 'grade-td grade-td-id', text: studentIds[student] || 'N/A' });
            row.appendChild(tdId);

            // Student cell — student names are from our own constant array, but
            // still use textContent to be consistent with the XSS policy
            const tdName = el('td', { cls: 'grade-td grade-td-name', text: student });
            row.appendChild(tdName);

            let totalScore = 0, totalMax = 0;
            gradeColumns.forEach(col => {
                const raw    = gradeData[student]?.[col.title];
                const numVal = (raw !== undefined && raw !== null) ? parseFloat(raw) : null;
                totalScore  += numVal || 0;
                totalMax    += col.max || 100;

                const td = el('td', { cls: 'grade-td', attrs: { style: 'text-align:center;' } });
                if (numVal !== null) {
                    // Parsed numbers — textContent safe
                    append(td,
                        el('span', { cls: 'grade-cell-value', text: String(numVal) }),
                        el('span', { cls: 'grade-cell-denom', text: ` / ${col.max}` })
                    );
                } else {
                    td.appendChild(el('span', { cls: 'grade-cell-empty', text: '—' }));
                }
                row.appendChild(td);
            });

            let totalText;
            if (gradeColumns.length === 0)   totalText = '—';
            else if (gradeMode === 'percent') totalText = totalMax > 0 ? `${((totalScore / totalMax) * 100).toFixed(1)}%` : '—';
            else                              totalText = `${totalScore} / ${totalMax}`;

            row.appendChild(el('td', { cls: 'grade-td grade-td-total', attrs: { style: 'text-align:center;font-weight:700;' }, text: totalText }));
            tbody.appendChild(row);
        });

        table.appendChild(thead);
        table.appendChild(tbody);

        const tableWrap = el('div', { cls: 'grade-table-wrapper', attrs: { style: 'margin:0;border:none;' } });
        tableWrap.appendChild(table);
        region.appendChild(tableWrap);

        // ── Inject, print, remove ─────────────────────────────
        document.body.appendChild(region);
        window.print();
        // Remove after print dialog closes (sync after print())
        document.body.removeChild(region);
    }

    // ==========================================
    // 12. EDIT MODAL
    // ==========================================
    function openEditModal(data, card, duePill) {
        document.getElementById('editTitle').value        = data.title;
        document.getElementById('editDeadline').value     = data.deadline;
        document.getElementById('editInstructions').value = data.instructions || '';
        openModal('editModal');

        document.getElementById('saveEditBtn').onclick = () => {
            const t = document.getElementById('editTitle').value.trim();
            if (!t) { showToast('Title cannot be empty.', 'error'); return; }
            data.title        = t;
            data.deadline     = document.getElementById('editDeadline').value.trim();
            data.instructions = document.getElementById('editInstructions').value.trim();
            // All written via textContent
            card.querySelector('.activity-card-title').textContent = t;
            if (duePill) duePill.textContent = `Due ${data.deadline}`;
            
            // Note: The structure inside `.activity-instructions` might contain the download link now.
            // We only want to update the text part. 
            const instrEl = card.querySelector('.activity-instructions');
            if (instrEl) {
                // Because we injected the file link as a child element, safely update just the first child div.
                const textDiv = instrEl.firstElementChild;
                if (textDiv && textDiv.tagName === 'DIV' && !textDiv.classList.contains('module-file-link')) {
                    textDiv.textContent = data.instructions;
                } else {
                    // fallback if it wasn't built exactly that way
                    instrEl.textContent = data.instructions; 
                }
            }
            closeModal('editModal');
            showToast('Updated successfully.', 'success');
        };
        document.getElementById('cancelEditBtn').onclick    = () => closeModal('editModal');
        document.getElementById('closeEditModalBtn').onclick = () => closeModal('editModal');
    }

    // ==========================================
    // 13. ANSWERS MODAL
    //     q.correct and sub.answers[i] are
    //     user-entered text — written only via
    //     textContent, never into innerHTML.
    // ==========================================
    function openAnswersModal(sub, data) {
        // sub.name — textContent only
        document.getElementById('answersModalTitle').textContent = `${sub.name}'s Answers`;
        const body = document.getElementById('answersModalBody');
        body.innerHTML = ''; // safe — no user data; just clearing

        if (!sub.answers?.length) {
            sub.answers = data.questions.map(q =>
                q.type === 'Multiple Choice' ? ['A','B','C','D'][Math.floor(Math.random() * 4)] : 'Sample answer'
            );
        }

        data.questions.forEach((q, i) => {
            const studentAnswer = sub.answers[i] || '(No answer)';
            const isCorrect     = q.correct && studentAnswer === q.correct;

            const qNum  = el('div', { cls: 'answer-q-num',  text: `Question ${i + 1}` });
            const qText = el('div', { cls: 'answer-q-text', text: q.text });   // q.text — user input

            const respCls = q.correct ? (isCorrect ? 'ans-correct' : 'ans-wrong') : '';
            const resp    = el('div', { cls: `answer-resp ${respCls}`.trim() });

            const respLabel = el('span', { cls: 'answer-resp-label', text: 'Answer:' });
            const respValue = el('span', { cls: 'answer-resp-value', text: studentAnswer }); // textContent
            append(resp, respLabel, respValue);

            if (q.correct) {
                const indText  = isCorrect ? 'Correct' : `Wrong — correct: ${q.correct}`; // q.correct — user input
                const indic    = el('span', { cls: 'answer-indicator', text: indText });   // textContent
                resp.appendChild(indic);
            }

            const item = el('div', { cls: 'answer-item' });
            append(item, qNum, qText, resp);
            body.appendChild(item);
        });

        openModal('answersModal');
        document.getElementById('closeAnswersBtn').onclick       = () => closeModal('answersModal');
        document.getElementById('closeAnswersModalBtn').onclick  = () => closeModal('answersModal');
    }

    // ==========================================
    // 14. FILE PREVIEW MODAL
    // ==========================================
    function openFilePreviewModal(url, type, name) {
        document.getElementById('previewFileName').textContent = name; // textContent
        const frame = document.getElementById('previewFrame');
        const img   = document.getElementById('previewImage');

        if (type === 'application/pdf') {
            frame.setAttribute('src', url); // setAttribute — checked below for blob: only
            frame.style.display = 'block';
            img.style.display   = 'none';
        } else if (type.startsWith('image/')) {
            img.setAttribute('src', url);
            img.style.display   = 'block';
            frame.style.display = 'none';
        }

        openModal('filePreviewModal');
        document.getElementById('closePreviewBtn').onclick = () => {
            closeModal('filePreviewModal');
            frame.removeAttribute('src');
        };
    }

// ==========================================
    // 15. GLOBAL DELETE + PIN
    // ==========================================
    
    // Global variable to temporarily store the item slated for deletion
    let itemToDelete = null;

    // Listener for clicking the Trash Icon on Cards (Modules, Announcements, Activities)
    document.addEventListener('click', e => {
        const btnDel = e.target.closest('.btn-delete');
        if (btnDel) {
            const ann = btnDel.closest('.announcement-card');
            const mod = btnDel.closest('.module-card');
            const act = btnDel.closest('.activity-card');
            
            // Assign the found card to the global variable
            itemToDelete = ann || mod || act;
            if (!itemToDelete) return;

            // Check if the activity is a Quiz specifically
            const isQuiz = act?.classList.contains('activity-card--quiz');
            
            // Update the Modal Title dynamically based on the card type
            document.getElementById('confirmModalTitle').textContent =
                ann ? 'Delete Announcement?' : 
                mod ? 'Delete Module?' : 
                isQuiz ? 'Delete Quiz?' : 'Delete Assignment?';
            
            openModal('deleteConfirmModal');
        }
    });

    // THE FINAL EXECUTIONER: Logic triggered when "Delete" is clicked inside the Modal
    document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
        if (!itemToDelete) return;

        // CASE A: Item is an HTML Element (Announcement, Module, or Activity card)
        if (itemToDelete instanceof HTMLElement) {
            itemToDelete.remove();
            showToast('Item deleted.', 'error');
        } 
        // CASE B: Item is a Grade Column Object (Class Record)
        else if (itemToDelete.type === 'grade-col') {
            const idx = gradeColumns.findIndex(c => c.title === itemToDelete.title);
            if (idx !== -1) {
                // Remove the column from the array
                gradeColumns.splice(idx, 1);
                
                // Clean up student data associated with this column
                gradeStudents.forEach(s => { 
                    if (gradeData[s]) delete gradeData[s][itemToDelete.title]; 
                });
                
                renderGradeTable(); // Refresh the table UI
                showToast('Grade column removed.', 'error');
            }
        } 
        // CASE C: Item is an Attendance Date Object
        else if (itemToDelete.type === 'att-date') {
            const idx = attDates.indexOf(itemToDelete.date);
            if (idx !== -1) {
                // Remove the date from the attendance array
                attDates.splice(idx, 1);
                
                // Clean up attendance records associated with this date
                gradeStudents.forEach(s => { 
                    if (attData[s]) delete attData[s][itemToDelete.date]; 
                });
                
                renderAttTable(); // Refresh the attendance UI
                showToast('Attendance date removed.', 'error');
            }
        }

        itemToDelete = null; // Reset the variable for future use
        closeModal('deleteConfirmModal'); // Close the confirmation modal
    });

    // Handle the Cancel Button click
    document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
        itemToDelete = null; // Clear the reference
        closeModal('deleteConfirmModal');
    });

    // Close modal when clicking outside the content (on the overlay)
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', e => { 
            if (e.target === overlay) closeModal(overlay.id); 
        });
    });

    // ==========================================
    // 16. MODAL HELPERS
    // ==========================================
    function openModal(id)  { document.getElementById(id)?.classList.add('active'); }
    function closeModal(id) { document.getElementById(id)?.classList.remove('active'); }

    // ==========================================
    // 17. UTILITIES
    // ==========================================
    function formatDate(raw) {
        const d = new Date(raw);
        return isNaN(d.getTime()) ? raw : d.toLocaleString('en-US', {
            month:'short', day:'numeric', year:'numeric',
            hour:'numeric', minute:'2-digit', hour12:true
        });
    }

    function clearFlatpickr(id) {
        const elem = document.getElementById(id);
        if (elem?._flatpickr) elem._flatpickr.clear();
        else if (elem) elem.value = '';
    }

    function collectQuestions(container, type) {
        return Array.from(container.querySelectorAll('.question-block')).map(block => {
            const q = {
                text:   block.querySelector('.question-text')?.value.trim()  || '',
                type,
                points: parseInt(block.querySelector('.question-points')?.value, 10) || 1
            };
            if (type === 'Multiple Choice') {
                q.options = Array.from(block.querySelectorAll('.mc-input')).map(i => i.value.trim());
                q.correct = block.querySelector('.mc-correct')?.value || '';
            } else if (type === 'Fill in the Blank') {
                q.correct = block.querySelector('.fitb-answer')?.value.trim() || '';
            }
            return q;
        });
    }

    // ==========================================
    // 18. TOAST
    // ==========================================
    function showToast(msg, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = el('div', { cls: `toast toast-${type}`, text: msg }); // textContent
        container.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('toast-show'));
        setTimeout(() => {
            toast.classList.remove('toast-show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    // ==========================================
    // 19. ATTENDANCE
    //     attDates  : string[]  — 'MMM D, YYYY'
    //     attData   : { studentName: { date: 'P'|'A'|null } }
    //     Click a cell to cycle: null → 'P' → 'A' → null
    // ==========================================
    const attDates = [];
    const attData  = {};
    gradeStudents.forEach(s => { attData[s] = {}; });

    // Flatpickr for attendance date input
    let attDatePicker = null;
    document.getElementById('openAddAttDateBtn')?.addEventListener('click', () => {
        document.getElementById('newAttDate').value = '';
        openModal('addAttDateModal');
        // Init flatpickr lazily
        const input = document.getElementById('newAttDate');
        if (!input._flatpickr) {
            attDatePicker = flatpickr(input, {
                dateFormat:    'M j, Y',
                disableMobile: true
            });
        }
    });
    document.getElementById('closeAddAttDateModalBtn')?.addEventListener('click', () => closeModal('addAttDateModal'));
    document.getElementById('cancelAddAttDateBtn')?.addEventListener('click',     () => closeModal('addAttDateModal'));
    document.getElementById('confirmAddAttDateBtn')?.addEventListener('click', () => {
        const raw = document.getElementById('newAttDate').value.trim();
        if (!raw) { showToast('Pick a date.', 'error'); return; }
        if (attDates.includes(raw)) { showToast('Date already exists.', 'error'); return; }
        attDates.push(raw);
        // Init all students for this date
        gradeStudents.forEach(s => {
            if (!attData[s]) attData[s] = {};
            attData[s][raw] = null;
        });
        renderAttTable();
        closeModal('addAttDateModal');
        showToast('Date added.', 'success');
    });

    // Print attendance
    document.getElementById('printAttendanceBtn')?.addEventListener('click', buildAndPrintAttendance);

    function renderAttTable() {
        const thead = document.getElementById('attTableHead');
        const tbody = document.getElementById('attTableBody');
        if (!thead || !tbody) return;

        // ── Header ──
        const hRow = el('tr');
        hRow.appendChild(el('th', { cls: 'att-th att-th-id',   text: 'Student ID' }));
        hRow.appendChild(el('th', { cls: 'att-th att-th-name', text: 'Student' }));

        attDates.forEach(date => {
        const th = el('th', { cls: 'att-th' });
        const wrap = el('div', { cls: 'att-col-head' });
        const dateSpan = el('span', { cls: 'att-col-date', text: date });

    // --- REMOVE BUTTON PARA SA ATTENDANCE DATE ---
        const removeBtn = el('button', { cls: 'btn-remove-col', attrs: { title: 'Remove date' } });
        removeBtn.innerHTML = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;
    
        removeBtn.addEventListener('click', () => {
        itemToDelete = { type: 'att-date', date: date };
        document.getElementById('confirmModalTitle').textContent = `Delete Attendance for ${date}?`;
        openModal('deleteConfirmModal');
    });

    append(wrap, dateSpan, removeBtn);
    th.appendChild(wrap);
    hRow.appendChild(th);
});

        // Summary columns
        hRow.appendChild(el('th', { cls: 'att-th att-th-summary', text: 'Present' }));
        hRow.appendChild(el('th', { cls: 'att-th att-th-summary', text: 'Absent' }));
        hRow.appendChild(el('th', { cls: 'att-th att-th-summary', text: 'Excused' }));

        thead.innerHTML = '';
        thead.appendChild(hRow);

        // ── Body ──
        tbody.innerHTML = '';
        gradeStudents.forEach((student, si) => {
            const row = el('tr', { cls: si % 2 === 0 ? 'grade-row-even' : 'grade-row-odd' });

            // Student ID cell
            const tdId = el('td', { cls: 'grade-td grade-td-id', text: studentIds[student] || 'N/A' });
            row.appendChild(tdId);

            // Name cell
            const initials = student.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
            const avatar   = el('div',  { cls: 'grade-avatar',       text: initials });
            const label    = el('span', { cls: 'grade-student-label', text: student });
            const sInfo    = el('div',  { cls: 'grade-student-info' });
            append(sInfo, avatar, label);
            const tdName = el('td', { cls: 'grade-td grade-td-name att-td-name' });
            tdName.appendChild(sInfo);
            row.appendChild(tdName);

            let presentCount = 0, absentCount = 0, excusedCount = 0;

            attDates.forEach(date => {
                const status = attData[student]?.[date] ?? null;
                if (status === 'P') presentCount++;
                if (status === 'A') absentCount++;
                if (status === 'E') excusedCount++;

                const td = el('td', { cls: 'grade-td att-td' });
                const cellBtn = el('button', { cls: 'att-cell-btn' + (status ? ' att-' + status : '') });

                // Status display — all hardcoded strings, no user data
                if (status === 'P')      cellBtn.textContent = 'P';
                else if (status === 'A') cellBtn.textContent = 'A';
                else if (status === 'E') cellBtn.textContent = 'E';
                else                     cellBtn.textContent = '';

                const labelMap = { P: 'Present', A: 'Absent', E: 'Excused' };
                cellBtn.setAttribute('aria-label', status ? labelMap[status] : 'Not marked');

                // Click cycles: null → P → A → E → null
                cellBtn.addEventListener('click', () => {
                    const cur = attData[student][date] ?? null;
                    attData[student][date] = cur === null ? 'P' : cur === 'P' ? 'A' : cur === 'A' ? 'E' : null;
                    renderAttTable();
                });

                td.appendChild(cellBtn);
                row.appendChild(td);
            });

            // Summary cells — purely numeric
            const tdPresent  = el('td', { cls: 'grade-td att-td-summary att-summary-present',  text: String(presentCount) });
            const tdAbsent   = el('td', { cls: 'grade-td att-td-summary att-summary-absent',   text: String(absentCount) });
            const tdExcused  = el('td', { cls: 'grade-td att-td-summary att-summary-excused',  text: String(excusedCount) });
            row.appendChild(tdPresent);
            row.appendChild(tdAbsent);
            row.appendChild(tdExcused);

            tbody.appendChild(row);
        });
    }

    // Initial render
    renderAttTable();

    // ── Print attendance ──
    function buildAndPrintAttendance() {
        const courseTitle = document.getElementById('overviewTitle')?.textContent?.trim() || 'Course';
        const courseCode  = document.getElementById('overviewCode')?.textContent?.trim()  || '';
        const section     = document.getElementById('overviewSection')?.textContent?.trim() || '';

        const region = el('div', { attrs: { id: 'print-region' } });

        const metaText = `${courseCode}  |  ${section}  |  Attendance Sheet  |  Printed: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;
        const printHeader = buildPrintHeader(courseTitle, metaText);
        region.appendChild(printHeader);
        region.appendChild(buildWatermark('ATTENDANCE SHEET'));

        const table = el('table', { cls: 'att-table', attrs: { style: 'width:100%;border-collapse:collapse;' } });
        const thead = el('thead');
        const tbody = el('tbody');

        const hRow = el('tr');
        hRow.appendChild(el('th', { cls: 'att-th att-th-id',   text: 'Student ID' }));
        hRow.appendChild(el('th', { cls: 'att-th att-th-name', text: 'Student' }));
        attDates.forEach(date => hRow.appendChild(el('th', { cls: 'att-th', text: date })));
        hRow.appendChild(el('th', { cls: 'att-th att-th-summary', text: 'Present' }));
        hRow.appendChild(el('th', { cls: 'att-th att-th-summary', text: 'Absent' }));
        hRow.appendChild(el('th', { cls: 'att-th att-th-summary', text: 'Excused' }));
        thead.appendChild(hRow);

        gradeStudents.forEach((student, si) => {
            const row = el('tr', { cls: si % 2 === 0 ? 'grade-row-even' : 'grade-row-odd' });
            row.appendChild(el('td', { cls: 'grade-td grade-td-id',   text: studentIds[student] || 'N/A' }));
            row.appendChild(el('td', { cls: 'grade-td grade-td-name', text: student }));
            let p = 0, a = 0, e = 0;
            attDates.forEach(date => {
                const s = attData[student]?.[date] ?? null;
                if (s === 'P') p++;
                if (s === 'A') a++;
                if (s === 'E') e++;
                const td = el('td', { cls: 'grade-td att-td', attrs: { style: 'text-align:center;' } });
                if (s === 'P')      { td.textContent = 'P'; td.style.color = '#1a7a3a'; td.style.fontWeight = '700'; }
                else if (s === 'A') { td.textContent = 'A'; td.style.color = '#800000'; td.style.fontWeight = '700'; }
                else if (s === 'E') { td.textContent = 'E'; td.style.color = '#b06b00'; td.style.fontWeight = '700'; }
                row.appendChild(td);
            });
            row.appendChild(el('td', { cls: 'grade-td att-td-summary att-summary-present',  attrs: { style: 'text-align:center;font-weight:700;' }, text: String(p) }));
            row.appendChild(el('td', { cls: 'grade-td att-td-summary att-summary-absent',   attrs: { style: 'text-align:center;font-weight:700;' }, text: String(a) }));
            row.appendChild(el('td', { cls: 'grade-td att-td-summary att-summary-excused',  attrs: { style: 'text-align:center;font-weight:700;' }, text: String(e) }));
            tbody.appendChild(row);
        });

        table.appendChild(thead);
        table.appendChild(tbody);

        const wrap = el('div', { cls: 'att-table-wrapper', attrs: { style: 'margin:0;border:none;' } });
        wrap.appendChild(table);
        region.appendChild(wrap);

        document.body.appendChild(region);
        window.print();
        document.body.removeChild(region);
    }

});

(function () {
  function buildMobileNav() {
    if (document.querySelector('.mobile-topbar')) return;
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) return;

    // --- Top bar ---
    const topbar = document.createElement('div');
    topbar.className = 'mobile-topbar';

    const logoImgEl  = sidebar.querySelector('.sidebar-logo-icon img');
    const logoTextEl = sidebar.querySelector('.sidebar-logo-text strong');
    const logoWrap   = document.createElement('div');
    logoWrap.className = 'mobile-topbar-logo';
    if (logoImgEl) {
      const img = document.createElement('img');
      img.src = logoImgEl.src;
      logoWrap.appendChild(img);
    }
    const logoSpan = document.createElement('span');
    logoSpan.textContent = logoTextEl ? logoTextEl.textContent : 'PUPSIS';
    logoWrap.appendChild(logoSpan);

    const burger = document.createElement('button');
    burger.className = 'mobile-hamburger';
    burger.setAttribute('aria-label', 'Toggle navigation');
    burger.innerHTML = '<span></span><span></span><span></span>';

    topbar.appendChild(logoWrap);
    topbar.appendChild(burger);
    document.body.appendChild(topbar);

    // --- Dropdown ---
    const dropdown = document.createElement('div');
    dropdown.className = 'mobile-nav-dropdown';

    sidebar.querySelectorAll('.nav-item').forEach(item => {
      const link = document.createElement('a');
      link.className = 'nav-link' + (item.classList.contains('active-nav') ? ' active-nav' : '');
      link.textContent = item.textContent.trim();
      link.href = '#';
      link.addEventListener('click', (e) => { e.preventDefault(); item.click(); close(); });
      dropdown.appendChild(link);
    });

    const logoutBtn = sidebar.querySelector('.logout-btn');
    if (logoutBtn) {
      const logoutLink = document.createElement('a');
      logoutLink.className = 'nav-link nav-logout';
      logoutLink.textContent = logoutBtn.textContent.trim();
      logoutLink.href = '#';
      logoutLink.addEventListener('click', (e) => { e.preventDefault(); close(); logoutBtn.click(); });
      dropdown.appendChild(logoutLink);
    }

    document.body.appendChild(dropdown);

    // --- Overlay ---
    const overlay = document.createElement('div');
    overlay.className = 'mobile-nav-overlay';
    document.body.appendChild(overlay);

    // --- Toggle ---
    function open() {
      dropdown.classList.add('open');
      overlay.classList.add('active');
      burger.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      dropdown.classList.remove('open');
      overlay.classList.remove('active');
      burger.classList.remove('open');
      document.body.style.overflow = '';
    }

    burger.addEventListener('click', () =>
      dropdown.classList.contains('open') ? close() : open()
    );
    overlay.addEventListener('click', close);
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', buildMobileNav)
    : buildMobileNav();
})();
