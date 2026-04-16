// ============================================================================
// ============================ HENT ELEMENTER ================================
// ============================================================================

const newReportBtn = document.getElementById("newReportBtn");
const backBtn = document.getElementById("backToReportsBtn");
const saveButton = document.getElementById("saveReportBtn");
const reportSearch = document.getElementById("reportSearch");

const reportHome = document.getElementById("reportHome");
const reportEditor = document.getElementById("reportEditor");
const reportList = document.getElementById("reportList");

const imageBox = document.getElementById("imageUploadBox");
const imageInput = document.getElementById("imageInput");
const imagePreviewList = document.getElementById("imagePreviewList");

const tagPickerOpenBtn = document.getElementById("tagPickerOpenBtn");
const tagPickerOverlay = document.getElementById("tagPickerOverlay");
const tagPickerCloseBtn = document.getElementById("tagPickerCloseBtn");
const tagPickerOptions = document.querySelectorAll(".tag-picker-option");

const editorToolButtons = document.querySelectorAll(".editor-tool-btn");
const editorFontSize = document.getElementById("editorFontSize");
const editorFontFamily = document.getElementById("editorFontFamily");
const editorColorPicker = document.getElementById("editorColorPicker");
const colorButtons = document.querySelectorAll(".color-btn");
const templateButtons = document.querySelectorAll(".template-btn");

const reportTextEditor = document.getElementById("reportText");


// ============================================================================
// ============================== RAPPORT DATA ================================
// ============================================================================

let reportId = 1;
let currentReport = null;
let currentTemplate = "standard";


// ============================================================================
// ============================== RAPPORTMALER ================================
// ============================================================================

const reportTemplates = {
    standard: `Kl: – [Sted]<br><br>
---<br><br>
Hendelsesforløp<br>
---<br><br>
Kallesignal, Navn, Tjenestenummer:`,

    kripos: `KRIPOS-SAK<br><br>
Saksnummer:<br>
Ansvarlig etterforsker:<br>
Etterforskere:<br>
Ansvarlig påtalemyndighet:<br><br>
---<br><br>
Innledende opplysninger<br>
Dato:<br>
Tidspunkt:<br>
Sted:<br><br>
---<br><br>
Mistenkte<br>
Navn:<br>
Beskrivelse:<br>
Tilknytning:<br><br>
---<br><br>
Bevis / beslag<br>
Bevis 1:<br>
Bevis 2:<br>
Beslag:<br><br>
---<br><br>
Videre etterforskning<br>
Tiltak:<br>
Avhør:<br>
Oppfølging:<br><br>
---<br><br>
Saken etterforskes videre.`,

    ran: `RAN<br><br>
Lokasjon:<br>
Klokkeslett:<br>
Butikk:<br><br>
---<br><br>
OPL:<br>
Sikrer:<br>
Forhandler:<br><br>
---<br><br>
Bil 1:<br>
Bil 2:<br>
Bil 3:<br>
Avskjærende:<br><br>
---<br><br>
Hendelsesforløp:<br>
---<br><br>
Gisselforklaring:<br>
---<br><br>
Biljakt:<br>
---<br><br>
Krav:<br>
---<br><br>
Gjerningsperson info:<br>
Antall gjerningspersoner:<br>
Antall gisler:<br><br>
Ransbil registreringsnummer:<br><br>
Våpen:<br><br>
---<br><br>
Saken etterforskes videre.<br><br>
Kallesignal, Navn, Tjenestenummer:`,

    biljakt: `BILJAKT<br><br>
Startsted:<br>
Starttid:<br>
Årsak:<br><br>
---<br><br>
Mistenkt kjøretøy<br>
Merke/modell:<br>
Farge:<br>
Registreringsnummer:<br><br>
---<br><br>
Rute / kjøreretning<br>
1.<br>
2.<br>
3.<br><br>
---<br><br>
Passasjerer / mistenkte<br>
Antall:<br>
Beskrivelse:<br><br>
---<br><br>
Avslutning<br>
Hvordan stoppet jakten:<br>
Pågripelser:<br>
Skader:<br><br>
---<br><br>
Kallesignal, Navn, Tjenestenummer:`
};

// ============================================================================
// =========================== AKTIV MAL-KNAPP ================================
// ============================================================================

function setActiveTemplate(templateKey) {
    currentTemplate = templateKey;

    templateButtons.forEach(function(button) {
        if (button.dataset.template === templateKey) {
            button.classList.add("active");
        } else {
            button.classList.remove("active");
        }
    });
}

// ============================================================================
// ============================= HJELPEFUNKSJONER =============================
// ============================================================================

function getReportFormData() {
    return {
        type: document.getElementById("reportType").value,
        title: document.getElementById("reportTitle").value,
        creator: document.getElementById("reportCreator").value,
        tags: document.getElementById("reportTags").value,
        officers: document.getElementById("reportOfficers").value,
        civilians: document.getElementById("reportCivilians").value,
        text: document.getElementById("reportText").innerHTML,
        evidence: document.getElementById("reportEvidence").value
    };
}

function getCurrentImages() {
    const images = [];
    const previewImages = imagePreviewList.querySelectorAll("img");

    previewImages.forEach(function (img) {
        images.push(img.src);
    });

    return images;
}

function closeTagPicker() {
    if (tagPickerOverlay) {
        tagPickerOverlay.style.display = "none";
    }
}

function openTagPicker() {
    if (tagPickerOverlay) {
        tagPickerOverlay.style.display = "flex";
    }
}


// ============================================================================
// ================================ TAGS ======================================
// ============================================================================

function getTagsFromInput() {
    return document.getElementById("reportTags").value
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag !== "");
}

function setTagsToInput(tags) {
    document.getElementById("reportTags").value = tags.join(", ");
}

function updateTagPreview() {
    const tagPreview = document.getElementById("tagPreview");
    const tags = getTagsFromInput();

    if (!tagPreview) return;

    tagPreview.innerHTML = "";

    tags.forEach(function (tag) {
        const chip = document.createElement("span");
        chip.className = "tag-chip";
        chip.textContent = tag;

        chip.addEventListener("click", function () {
            removeTag(tag);
        });

        tagPreview.appendChild(chip);
    });
}

function addTag(tag) {
    if (!tag) return;

    const tags = getTagsFromInput();

    if (!tags.includes(tag)) {
        tags.push(tag);
        setTagsToInput(tags);
        updateTagPreview();
    }
}

function removeTag(tagToRemove) {
    const tags = getTagsFromInput().filter(function (tag) {
        return tag !== tagToRemove;
    });

    setTagsToInput(tags);
    updateTagPreview();
}


// ============================================================================
// ========================== RAPPORTVISNING / FORM ===========================
// ============================================================================

function clearReportForm() {
    document.getElementById("reportType").value = "";
    document.getElementById("reportTitle").value = "";
    document.getElementById("reportCreator").value = "";
    document.getElementById("reportTags").value = "";
    document.getElementById("reportOfficers").value = "";
    document.getElementById("reportCivilians").value = "";
    document.getElementById("reportEvidence").value = "";

    document.getElementById("reportText").innerHTML = reportTemplates.standard;

    imagePreviewList.innerHTML = "";
    imageInput.value = "";

    updateTagPreview();
    closeTagPicker();

    // setter Standard rapport som aktiv automatisk
    setActiveTemplate("standard");
}

function fillReportForm(reportBubble) {
    document.getElementById("reportType").value = reportBubble.dataset.type || "";
    document.getElementById("reportTitle").value = reportBubble.dataset.title || "";
    document.getElementById("reportCreator").value = reportBubble.dataset.creator || "";
    document.getElementById("reportTags").value = reportBubble.dataset.tags || "";
    document.getElementById("reportOfficers").value = reportBubble.dataset.officers || "";
    document.getElementById("reportCivilians").value = reportBubble.dataset.civilians || "";
    document.getElementById("reportText").innerHTML = reportBubble.dataset.text || "";
    document.getElementById("reportEvidence").value = reportBubble.dataset.evidence || "";

    updateTagPreview();
    closeTagPicker();

    imagePreviewList.innerHTML = "";
    imageInput.value = "";

    if (reportBubble.dataset.images) {
        const images = JSON.parse(reportBubble.dataset.images);

        images.forEach(function (src) {
            const img = document.createElement("img");
            img.src = src;
            imagePreviewList.appendChild(img);
        });
    }
    // setter riktig mal når rapport åpnes
    setActiveTemplate(reportBubble.dataset.template || "standard");
}

function updateReportBubbleContent(reportBubble) {
    let tagsHtml = "";
    const tags = (reportBubble.dataset.tags || "")
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag !== "");

    tags.forEach(function (tag) {
        tagsHtml += `<span class="tag-chip">${tag}</span>`;
    });

    reportBubble.innerHTML = `
        <h3>${reportBubble.dataset.title || "Uten tittel"}</h3>
        <p><strong>Type hendelse:</strong> ${reportBubble.dataset.type || "Ingen type"}</p>
        <div class="tag-preview">${tagsHtml}</div>
        <small>Rapport ID: ${reportBubble.dataset.id}</small>
    `;
}

// ============================================================================
// ========================= LAGRER DATA TIL RAPPORT ==========================
// ============================================================================

function saveToBubble(reportBubble) {
    const data = getReportFormData();

    reportBubble.dataset.template = currentTemplate;
    reportBubble.dataset.type = data.type;
    reportBubble.dataset.title = data.title;
    reportBubble.dataset.creator = data.creator;
    reportBubble.dataset.tags = data.tags;
    reportBubble.dataset.officers = data.officers;
    reportBubble.dataset.civilians = data.civilians;
    reportBubble.dataset.text = data.text;
    reportBubble.dataset.evidence = data.evidence;
    reportBubble.dataset.images = JSON.stringify(getCurrentImages());

    updateReportBubbleContent(reportBubble);
}


// ============================================================================
// ============================= SØKEFUNKSJONER ===============================
// ============================================================================

function filterReports() {
    const searchValue = reportSearch.value.toLowerCase();
    const reportBubbles = reportList.querySelectorAll("div");

    reportBubbles.forEach(function (reportBubble) {
        const id = (reportBubble.dataset.id || "").toLowerCase();
        const type = (reportBubble.dataset.type || "").toLowerCase();
        const title = (reportBubble.dataset.title || "").toLowerCase();
        const creator = (reportBubble.dataset.creator || "").toLowerCase();
        const tags = (reportBubble.dataset.tags || "").toLowerCase();

        const matches =
            id.includes(searchValue) ||
            type.includes(searchValue) ||
            title.includes(searchValue) ||
            creator.includes(searchValue) ||
            tags.includes(searchValue);

        reportBubble.style.display = matches ? "block" : "none";
    });
}


// ============================================================================
// ============================= TOOLBAR FUNKSJONER ===========================
// ============================================================================

editorToolButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        const command = button.dataset.command;

        document.getElementById("reportText").focus();
        document.execCommand(command, false, null);
    });
});

if (editorFontSize) {
    editorFontSize.addEventListener("change", function () {
        if (!editorFontSize.value) return;

        const selectedSize = editorFontSize.value + "px";
        const selection = window.getSelection();

        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        if (range.collapsed) return;

        const span = document.createElement("span");
        span.style.fontSize = selectedSize;

        try {
            range.surroundContents(span);
        } catch (e) {
            document.execCommand("styleWithCSS", false, true);
            document.execCommand("fontSize", false, "7");

            const fonts = document.querySelectorAll("#reportText font[size='7']");
            fonts.forEach(function (fontTag) {
                fontTag.removeAttribute("size");
                fontTag.style.fontSize = selectedSize;
            });
        }

        editorFontSize.value = "";
    });
}

if (editorFontFamily) {
    editorFontFamily.addEventListener("change", function () {
        if (!editorFontFamily.value) return;

        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        if (range.collapsed) return;

        const span = document.createElement("span");
        span.style.fontFamily = editorFontFamily.value;

        try {
            range.surroundContents(span);
        } catch (e) {
            // Beholder tom fallback her foreløpig
        }

        editorFontFamily.value = "";
    });
}

if (editorColorPicker) {
    editorColorPicker.addEventListener("input", function () {
        document.getElementById("reportText").focus();
        document.execCommand("foreColor", false, editorColorPicker.value);
    });
}

colorButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
        const color = btn.dataset.color;

        document.getElementById("reportText").focus();
        document.execCommand("foreColor", false, color);
    });
});


// ============================================================================
// ================================ MALER =====================================
// ============================================================================

templateButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        const templateKey = button.dataset.template;
        const editor = document.getElementById("reportText");

        if (!editor || !reportTemplates[templateKey]) return;

        editor.innerHTML = reportTemplates[templateKey];
        editor.focus();

        // marker valgt mal visuelt
        setActiveTemplate(templateKey);
    });
});


// ============================================================================
// ============================== EVENT LISTENERS =============================
// ============================================================================

newReportBtn.onclick = function () {
    currentReport = null;
    clearReportForm();

    reportHome.style.display = "none";
    reportEditor.style.display = "block";
};

backBtn.onclick = function () {
    reportEditor.style.display = "none";
    reportHome.style.display = "block";
};

saveButton.onclick = function () {
    if (currentReport !== null) {
        saveToBubble(currentReport);
    } else {
        const reportBubble = document.createElement("div");

        reportBubble.dataset.id = reportId;
        saveToBubble(reportBubble);

        reportBubble.onclick = function () {
            currentReport = reportBubble;
            fillReportForm(reportBubble);

            reportHome.style.display = "none";
            reportEditor.style.display = "block";
        };

        reportList.appendChild(reportBubble);
        reportId++;
    }

    reportEditor.style.display = "none";
    reportHome.style.display = "block";
};

if (imageBox && imageInput && imagePreviewList) {
    imageBox.onclick = function () {
        imageInput.click();
    };

    imageInput.addEventListener("change", function () {
        const file = imageInput.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (e) {
            const img = document.createElement("img");
            img.src = e.target.result;
            imagePreviewList.appendChild(img);
        };

        reader.readAsDataURL(file);
    });
}

if (reportSearch) {
    reportSearch.addEventListener("input", function () {
        filterReports();
    });
}

if (tagPickerOpenBtn) {
    tagPickerOpenBtn.addEventListener("click", function () {
        openTagPicker();
    });
}

if (tagPickerCloseBtn) {
    tagPickerCloseBtn.addEventListener("click", function () {
        closeTagPicker();
    });
}

if (tagPickerOverlay) {
    tagPickerOverlay.addEventListener("click", function (e) {
        if (e.target === tagPickerOverlay) {
            closeTagPicker();
        }
    });
}

tagPickerOptions.forEach(function (option) {
    option.addEventListener("click", function () {
        const selectedTag = option.dataset.tag;
        addTag(selectedTag);
        closeTagPicker();
    });
});