// ============================================================================
// ============================ HENT ELEMENTER ================================
// ============================================================================

const newHendelsesReportBtn = document.getElementById("newHendelsesReportBtn");
const backHendelsesBtn = document.getElementById("backToHendelsesReportsBtn");
const saveHendelsesButton = document.getElementById("saveHendelsesReportBtn");
const hendelsesReportSearch = document.getElementById("hendelsesReportSearch");

const hendelsesReportHome = document.getElementById("hendelsesReportHome");
const hendelsesReportEditor = document.getElementById("hendelsesReportEditor");
const hendelsesReportList = document.getElementById("hendelsesReportList");

const hendelsesImageBox = document.getElementById("hendelsesImageUploadBox");
const hendelsesImageInput = document.getElementById("hendelsesImageInput");
const hendelsesImagePreviewList = document.getElementById("hendelsesImagePreviewList");

const hendelsesTagPickerOpenBtn = document.getElementById("hendelsesTagPickerOpenBtn");
const hendelsesTagPickerOverlay = document.getElementById("hendelsesTagPickerOverlay");
const hendelsesTagPickerCloseBtn = document.getElementById("hendelsesTagPickerCloseBtn");
const hendelsesTagPickerOptions = document.querySelectorAll(".hendelses-tag-picker-option");

const hendelsesEditorToolButtons = document.querySelectorAll(".hendelses-editor-tool-btn");
const hendelsesEditorFontSize = document.getElementById("hendelsesEditorFontSize");
const hendelsesEditorFontFamily = document.getElementById("hendelsesEditorFontFamily");
const hendelsesEditorColorPicker = document.getElementById("hendelsesEditorColorPicker");
const hendelsesColorButtons = document.querySelectorAll(".hendelses-color-btn");
const hendelsesTemplateButtons = document.querySelectorAll(".hendelses-template-btn");

const hendelsesReportTextEditor = document.getElementById("hendelsesReportText");
const addSiktetBtn = document.getElementById("addSiktetBtn");
const siktetContainer = document.getElementById("siktetContainer");


// ============================================================================
// ============================== RAPPORT DATA ================================
// ============================================================================

let hendelsesReportId = 1;
let currentHendelsesReport = null;
let currentHendelsesTemplate = "standard";


// ============================================================================
// ============================== RAPPORTMALER ================================
// ============================================================================

const hendelsesReportTemplates = {
    standard: `Kl: – [Sted]<br><br>
---<br><br>
Hendelsesforløp<br>
---<br><br>
Navn / Person ID:<br>
Straff:<br>
Fengslingstid:<br><br>
Kallesignal, Navn, Tjenestenummer:`,

    arrest: `ARRESTRAPPORT<br><br>
Navn på person:<br>
Person ID:<br>
Straffeforhold:<br>
Fengslingstid:<br>
Bøter:<br><br>
---<br><br>
Hendelsesforløp:<br>
---<br><br>
Beslag:<br>
Våpen:<br>
Narkotika:<br><br>
---<br><br>
Kallesignal, Navn, Tjenestenummer:`,

    narkotika: `NARKOTIKA-SAK<br><br>
Navn på person:<br>
Person ID:<br>
Beslag type:<br>
Mengde:<br>
Straff:<br><br>
---<br><br>
Hendelsesforløp:<br>
---<br><br>
Videre behandling:<br><br>
Kallesignal, Navn, Tjenestenummer:`,

    våpen: `VÅPEN-SAK<br><br>
Navn på person:<br>
Person ID:<br>
Våpen type:<br>
Serienummer:<br>
Straff:<br><br>
---<br><br>
Hendelsesforløp:<br>
---<br><br>
Beslag og vurdering:<br><br>
Kallesignal, Navn, Tjenestenummer:`
};


// ============================================================================
// =========================== AKTIV MAL-KNAPP ================================
// ============================================================================

function setActiveHendelsesTemplate(templateKey) {
    currentHendelsesTemplate = templateKey;

    hendelsesTemplateButtons.forEach(function(button) {
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

function getHendelsesReportFormData() {
    return {
        type: document.getElementById("hendelsesReportType").value,
        title: document.getElementById("hendelsesReportTitle").value,
        creator: document.getElementById("hendelsesReportCreator").value,
        tags: document.getElementById("hendelsesReportTags").value,
        officers: document.getElementById("hendelsesReportOfficers").value,
        civilians: document.getElementById("hendelsesReportCivilians").value,
        text: document.getElementById("hendelsesReportText").innerHTML,
        evidence: document.getElementById("hendelsesReportEvidence").value
    };
}

function getCurrentHendelsesImages() {
    const images = [];
    const previewImages = hendelsesImagePreviewList.querySelectorAll("img");

    previewImages.forEach(function (img) {
        images.push(img.src);
    });

    return images;
}

function closeHendelsesTagPicker() {
    if (hendelsesTagPickerOverlay) {
        hendelsesTagPickerOverlay.style.display = "none";
    }
}

function openHendelsesTagPicker() {
    if (hendelsesTagPickerOverlay) {
        hendelsesTagPickerOverlay.style.display = "flex";
    }
}

function getEmptySiktetData() {
    return {
        name: "",
        laws: "",
        fine: "",
        sentence: ""
    };
}

function createEmptySiktetMessage() {
    if (!siktetContainer) return;

    if (siktetContainer.children.length === 0) {
        siktetContainer.innerHTML = `<div class="empty-siktet-text">Ingen siktede lagt til enda.</div>`;
    }
}

function removeEmptySiktetMessage() {
    if (!siktetContainer) return;

    const emptyMessage = siktetContainer.querySelector(".empty-siktet-text");
    if (emptyMessage) {
        emptyMessage.remove();
    }
}

function updateSiktetHeader(card) {
    const nameInput = card.querySelector(".siktet-name-input");
    const title = card.querySelector(".siktet-card-title");
    const subtitle = card.querySelector(".siktet-card-subtitle");

    const nameValue = nameInput.value.trim();

    if (nameValue !== "") {
        title.textContent = nameValue;
        subtitle.textContent = "Siktet person";
    } else {
        title.textContent = "Ukjent siktet";
        subtitle.textContent = "Trykk for å åpne og fylle ut";
    }
}

function toggleSiktetCard(card) {
    const icon = card.querySelector(".siktet-toggle-icon");
    const isOpen = card.classList.contains("open");

    if (isOpen) {
        card.classList.remove("open");
        icon.textContent = "▼";
    } else {
        card.classList.add("open");
        icon.textContent = "▲";
    }
}

function buildSiktetCard(data = null) {
    if (!siktetContainer) return;

    removeEmptySiktetMessage();

    const siktetData = data || getEmptySiktetData();

    const card = document.createElement("div");
    card.className = "siktet-card open";

    card.innerHTML = `
        <div class="siktet-card-header">
            <div class="siktet-card-title-wrap">
                <div class="siktet-card-title">Ukjent siktet</div>
                <div class="siktet-card-subtitle">Trykk for å åpne og fylle ut</div>
            </div>

            <div class="siktet-card-actions">
                <button type="button" class="remove-siktet-btn">Fjern</button>
                <div class="siktet-toggle-icon">▲</div>
            </div>
        </div>

        <div class="siktet-card-body">
            <div class="siktet-card-grid">
                <div class="siktet-input-group">
                    <label>Navn på siktede</label>
                    <input type="text" class="siktet-name-input" placeholder="Skriv navn på siktede..." value="${siktetData.name || ""}">
                </div>

                <div class="siktet-input-group">
                    <label>Anbefalt bot</label>
                    <input type="text" class="siktet-fine-input" placeholder="Skriv anbefalt bot..." value="${siktetData.fine || ""}">
                </div>

                <div class="siktet-input-group">
                    <label>Anbefalt dom</label>
                    <input type="text" class="siktet-sentence-input" placeholder="Skriv anbefalt dom..." value="${siktetData.sentence || ""}">
                </div>

                <div class="siktet-input-group siktet-field-full">
                    <label>Paragrafer</label>
                    <textarea class="siktet-laws-input" placeholder="Skriv inn paragrafer...">${siktetData.laws || ""}</textarea>
                </div>
            </div>
        </div>
    `;

    const header = card.querySelector(".siktet-card-header");
    const removeBtn = card.querySelector(".remove-siktet-btn");
    const nameInput = card.querySelector(".siktet-name-input");

    header.addEventListener("click", function (e) {
        if (e.target.closest(".remove-siktet-btn")) return;
        toggleSiktetCard(card);
    });

    removeBtn.addEventListener("click", function () {
        card.remove();
        createEmptySiktetMessage();
    });

    nameInput.addEventListener("input", function () {
        updateSiktetHeader(card);
    });

    siktetContainer.appendChild(card);
    updateSiktetHeader(card);
}

function getSiktedeData() {
    if (!siktetContainer) return [];

    const cards = siktetContainer.querySelectorAll(".siktet-card");
    const siktede = [];

    cards.forEach(function (card) {
        siktede.push({
            name: card.querySelector(".siktet-name-input")?.value || "",
            laws: card.querySelector(".siktet-laws-input")?.value || "",
            fine: card.querySelector(".siktet-fine-input")?.value || "",
            sentence: card.querySelector(".siktet-sentence-input")?.value || ""
        });
    });

    return siktede;
}

function loadSiktedeData(siktede) {
    if (!siktetContainer) return;

    siktetContainer.innerHTML = "";

    if (!siktede || siktede.length === 0) {
        createEmptySiktetMessage();
        return;
    }

    siktede.forEach(function (siktet) {
        buildSiktetCard(siktet);
    });
}


// ============================================================================
// ================================ TAGS ======================================
// ============================================================================

function getHendelsesTagsFromInput() {
    return document.getElementById("hendelsesReportTags").value
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag !== "");
}

function setHendelsesTagsToInput(tags) {
    document.getElementById("hendelsesReportTags").value = tags.join(", ");
}

function updateHendelsesTagPreview() {
    const tagPreview = document.getElementById("hendelsesTagPreview");
    const tags = getHendelsesTagsFromInput();

    if (!tagPreview) return;

    tagPreview.innerHTML = "";

    tags.forEach(function (tag) {
        const chip = document.createElement("span");
        chip.className = "hendelses-tag-chip";
        chip.textContent = tag;

        chip.addEventListener("click", function () {
            removeHendelsesTag(tag);
        });

        tagPreview.appendChild(chip);
    });
}

function addHendelsesTag(tag) {
    if (!tag) return;

    const tags = getHendelsesTagsFromInput();

    if (!tags.includes(tag)) {
        tags.push(tag);
        setHendelsesTagsToInput(tags);
        updateHendelsesTagPreview();
    }
}

function removeHendelsesTag(tagToRemove) {
    const tags = getHendelsesTagsFromInput().filter(function (tag) {
        return tag !== tagToRemove;
    });

    setHendelsesTagsToInput(tags);
    updateHendelsesTagPreview();
}


// ============================================================================
// ========================== RAPPORTVISNING / FORM ===========================
// ============================================================================

function clearHendelsesReportForm() {
    document.getElementById("hendelsesReportType").value = "";
    document.getElementById("hendelsesReportTitle").value = "";
    document.getElementById("hendelsesReportCreator").value = "";
    document.getElementById("hendelsesReportTags").value = "";
    document.getElementById("hendelsesReportOfficers").value = "";
    document.getElementById("hendelsesReportCivilians").value = "";
    document.getElementById("hendelsesReportEvidence").value = "";

    document.getElementById("hendelsesReportText").innerHTML = hendelsesReportTemplates.standard;

    hendelsesImagePreviewList.innerHTML = "";
    hendelsesImageInput.value = "";

    updateHendelsesTagPreview();
    closeHendelsesTagPicker();

    setActiveHendelsesTemplate("standard");
}

function fillHendelsesReportForm(reportBubble) {
    document.getElementById("hendelsesReportType").value = reportBubble.dataset.type || "";
    document.getElementById("hendelsesReportTitle").value = reportBubble.dataset.title || "";
    document.getElementById("hendelsesReportCreator").value = reportBubble.dataset.creator || "";
    document.getElementById("hendelsesReportTags").value = reportBubble.dataset.tags || "";
    document.getElementById("hendelsesReportOfficers").value = reportBubble.dataset.officers || "";
    document.getElementById("hendelsesReportCivilians").value = reportBubble.dataset.civilians || "";
    document.getElementById("hendelsesReportText").innerHTML = reportBubble.dataset.text || "";
    document.getElementById("hendelsesReportEvidence").value = reportBubble.dataset.evidence || "";

    updateHendelsesTagPreview();
    closeHendelsesTagPicker();

    hendelsesImagePreviewList.innerHTML = "";
    hendelsesImageInput.value = "";

    if (reportBubble.dataset.images) {
        const images = JSON.parse(reportBubble.dataset.images);

        images.forEach(function (src) {
            const img = document.createElement("img");
            img.src = src;
            hendelsesImagePreviewList.appendChild(img);
        });
    }

    if (reportBubble.dataset.siktede) {
        loadSiktedeData(JSON.parse(reportBubble.dataset.siktede));
    } else {
        loadSiktedeData([]);
    }

    setActiveHendelsesTemplate(reportBubble.dataset.template || "standard");
}

function updateHendelsesReportBubbleContent(reportBubble) {
    let tagsHtml = "";
    const tags = (reportBubble.dataset.tags || "")
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag !== "");

    tags.forEach(function (tag) {
        tagsHtml += `<span class="hendelses-tag-chip">${tag}</span>`;
    });

    reportBubble.innerHTML = `
        <h3>${reportBubble.dataset.title || "Uten tittel"}</h3>
        <p><strong>Type hendelse:</strong> ${reportBubble.dataset.type || "Ingen type"}</p>
        <div class="hendelses-tag-preview">${tagsHtml}</div>
        <small>Rapport ID: ${reportBubble.dataset.id}</small>
    `;
}


// ============================================================================
// ========================= LAGRER DATA TIL RAPPORT ==========================
// ============================================================================

function saveToHendelsesBubble(reportBubble) {
    const data = getHendelsesReportFormData();

    reportBubble.dataset.template = currentHendelsesTemplate;
    reportBubble.dataset.type = data.type;
    reportBubble.dataset.title = data.title;
    reportBubble.dataset.creator = data.creator;
    reportBubble.dataset.tags = data.tags;
    reportBubble.dataset.officers = data.officers;
    reportBubble.dataset.civilians = data.civilians;
    reportBubble.dataset.text = data.text;
    reportBubble.dataset.evidence = data.evidence;
    reportBubble.dataset.images = JSON.stringify(getCurrentHendelsesImages());
    reportBubble.dataset.siktede = JSON.stringify(getSiktedeData());

    updateHendelsesReportBubbleContent(reportBubble);
}


// ============================================================================
// ============================= SØKEFUNKSJONER ===============================
// ============================================================================

function filterHendelsesReports() {
    const searchValue = hendelsesReportSearch.value.toLowerCase();
    const reportBubbles = hendelsesReportList.querySelectorAll("div");

    reportBubbles.forEach(function (reportBubble) {
        const id = (reportBubble.dataset.id || "").toLowerCase();
        const type = (reportBubble.dataset.type || "").toLowerCase();
        const title = (reportBubble.dataset.title || "").toLowerCase();
        const tags = (reportBubble.dataset.tags || "").toLowerCase();

        const matches =
            id.includes(searchValue) ||
            type.includes(searchValue) ||
            title.includes(searchValue) ||
            tags.includes(searchValue);

        reportBubble.style.display = matches ? "block" : "none";
    });
}


// ============================================================================
// ============================= TOOLBAR FUNKSJONER ===========================
// ============================================================================

hendelsesEditorToolButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        const command = button.dataset.command;

        document.getElementById("hendelsesReportText").focus();
        document.execCommand(command, false, null);
    });
});

if (hendelsesEditorFontSize) {
    hendelsesEditorFontSize.addEventListener("change", function () {
        if (!hendelsesEditorFontSize.value) return;

        const selectedSize = hendelsesEditorFontSize.value + "px";
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

            const fonts = document.querySelectorAll("#hendelsesReportText font[size='7']");
            fonts.forEach(function (fontTag) {
                fontTag.removeAttribute("size");
                fontTag.style.fontSize = selectedSize;
            });
        }

        hendelsesEditorFontSize.value = "";
    });
}

if (hendelsesEditorFontFamily) {
    hendelsesEditorFontFamily.addEventListener("change", function () {
        if (!hendelsesEditorFontFamily.value) return;

        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        if (range.collapsed) return;

        const span = document.createElement("span");
        span.style.fontFamily = hendelsesEditorFontFamily.value;

        try {
            range.surroundContents(span);
        } catch (e) {
            // fallback tom foreløpig
        }

        hendelsesEditorFontFamily.value = "";
    });
}

if (hendelsesEditorColorPicker) {
    hendelsesEditorColorPicker.addEventListener("input", function () {
        document.getElementById("hendelsesReportText").focus();
        document.execCommand("foreColor", false, hendelsesEditorColorPicker.value);
    });
}

hendelsesColorButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
        const color = btn.dataset.color;

        document.getElementById("hendelsesReportText").focus();
        document.execCommand("foreColor", false, color);
    });
});


// ============================================================================
// ================================ MALER =====================================
// ============================================================================

hendelsesTemplateButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        const templateKey = button.dataset.template;
        const editor = document.getElementById("hendelsesReportText");

        if (!editor || !hendelsesReportTemplates[templateKey]) return;

        editor.innerHTML = hendelsesReportTemplates[templateKey];
        editor.focus();

        setActiveHendelsesTemplate(templateKey);
    });
});


// ============================================================================
// ============================== EVENT LISTENERS =============================
// ============================================================================

if (newHendelsesReportBtn) {
    newHendelsesReportBtn.onclick = function () {
        currentHendelsesReport = null;
        clearHendelsesReportForm();

        hendelsesReportHome.style.display = "none";
        hendelsesReportEditor.style.display = "block";
    };
}

if (backHendelsesBtn) {
    backHendelsesBtn.onclick = function () {
        hendelsesReportEditor.style.display = "none";
        hendelsesReportHome.style.display = "block";
    };
}

if (saveHendelsesButton) {
    saveHendelsesButton.onclick = function () {
        if (currentHendelsesReport !== null) {
            saveToHendelsesBubble(currentHendelsesReport);
        } else {
            const reportBubble = document.createElement("div");

            reportBubble.dataset.id = hendelsesReportId;
            saveToHendelsesBubble(reportBubble);

            reportBubble.onclick = function () {
                currentHendelsesReport = reportBubble;
                fillHendelsesReportForm(reportBubble);

                hendelsesReportHome.style.display = "none";
                hendelsesReportEditor.style.display = "block";
            };

            hendelsesReportList.appendChild(reportBubble);
            hendelsesReportId++;
        }

        hendelsesReportEditor.style.display = "none";
        hendelsesReportHome.style.display = "block";
    };
}

if (hendelsesImageBox && hendelsesImageInput && hendelsesImagePreviewList) {
    hendelsesImageBox.onclick = function () {
        hendelsesImageInput.click();
    };

    hendelsesImageInput.addEventListener("change", function () {
        const file = hendelsesImageInput.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (e) {
            const img = document.createElement("img");
            img.src = e.target.result;
            hendelsesImagePreviewList.appendChild(img);
        };

        reader.readAsDataURL(file);
    });
}

if (hendelsesReportSearch) {
    hendelsesReportSearch.addEventListener("input", function () {
        filterHendelsesReports();
    });
}

if (hendelsesTagPickerOpenBtn) {
    hendelsesTagPickerOpenBtn.addEventListener("click", function () {
        openHendelsesTagPicker();
    });
}

if (hendelsesTagPickerCloseBtn) {
    hendelsesTagPickerCloseBtn.addEventListener("click", function () {
        closeHendelsesTagPicker();
    });
}

if (hendelsesTagPickerOverlay) {
    hendelsesTagPickerOverlay.addEventListener("click", function (e) {
        if (e.target === hendelsesTagPickerOverlay) {
            closeHendelsesTagPicker();
        }
    });
}

hendelsesTagPickerOptions.forEach(function (option) {
    option.addEventListener("click", function () {
        const selectedTag = option.dataset.tag;
        addHendelsesTag(selectedTag);
        closeHendelsesTagPicker();
    });
});

if (addSiktetBtn) {
    addSiktetBtn.addEventListener("click", function () {
        buildSiktetCard();
    });
}

createEmptySiktetMessage();