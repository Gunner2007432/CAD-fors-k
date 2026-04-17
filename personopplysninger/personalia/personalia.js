const personList = document.getElementById("personList");
const personDetail = document.getElementById("personDetail");
const personSearch = document.getElementById("personSearch");

let currentPerson = null;
let editMode = false;

let people = [
    {
        id: "01019512345",
        firstName: "Ola",
        lastName: "Nordmann",
        phone: "12345678",
        dob: "01.01.1995",
        gender: "Mann",
        status: "Ikke etterlyst",
        address: "Oslo",
        image: "https://i.imgur.com/1X6b7hR.png",
        licenses: ["Bil", "MC"],
        pastCases: ["Ingen registrert"],
        vehicles: ["AB12345"],
        weapons: ["Ingen"],
        notes: ""
    }
];

function renderPersonList(filter = "") {
    personList.innerHTML = "";

    people.forEach(function (person) {
        const fullName = person.firstName + " " + person.lastName;

        if (!fullName.toLowerCase().includes(filter.toLowerCase())) return;

        const div = document.createElement("div");
        div.className = "person-item";

        div.innerHTML = `
            <img src="${person.image}" class="person-avatar-small">
            <span>${fullName}</span>
        `;

        div.onclick = function () {
            showPerson(person);
        };

        personList.appendChild(div);
    });
}

function createTagList(tags, type) {
    if (!tags || tags.length === 0) {
        return `<span class="tag-empty">Ingen registrert</span>`;
    }

    return tags.map(function (tag) {
        if (editMode) {
            return `<span class="tag edit-mode" onclick="removeTag('${type}', '${tag.replace(/'/g, "\\'")}')">${tag}</span>`;
        }

        return `<span class="tag">${tag}</span>`;
    }).join("");
}

function showPerson(person) {
    currentPerson = person;

    personDetail.innerHTML = `
        <div class="person-controls">
            ${
                editMode
                    ? `<button type="button" class="person-action-btn save-btn" onclick="savePerson()">Lagre</button>`
                    : `<button type="button" class="person-action-btn edit-btn" onclick="enableEditMode()">Rediger</button>`
            }
        </div>

        <div class="person-header">
            ${
                editMode
                    ? `<input type="text" id="edit-image" class="edit-image-input" value="${person.image}" placeholder="Lim inn bilde-link...">`
                    : `<img src="${person.image}" class="person-avatar">`
            }

            <div class="person-main-info">
                <div class="person-info-row">
                    <span class="person-info-label">Navn</span>
                    ${
                        editMode
                            ? `<input id="edit-name" class="edit-input" value="${person.firstName} ${person.lastName}">`
                            : `<span class="person-info-value">${person.firstName} ${person.lastName}</span>`
                    }
                </div>

                <div class="person-info-row">
                    <span class="person-info-label">Fødselsnummer</span>
                    ${
                        editMode
                            ? `<input id="edit-id" class="edit-input" value="${person.id}">`
                            : `<span class="person-info-value">${person.id}</span>`
                    }
                </div>

                <div class="person-info-row">
                    <span class="person-info-label">Telefonnummer</span>
                    ${
                        editMode
                            ? `<input id="edit-phone" class="edit-input" value="${person.phone}">`
                            : `<span class="person-info-value">${person.phone}</span>`
                    }
                </div>

                <div class="person-info-row">
                    <span class="person-info-label">Fødselsdato</span>
                    ${
                        editMode
                            ? `<input id="edit-dob" class="edit-input" value="${person.dob}">`
                            : `<span class="person-info-value">${person.dob}</span>`
                    }
                </div>

                <div class="person-info-row">
                    <span class="person-info-label">Kjønn</span>
                    ${
                        editMode
                            ? `<input id="edit-gender" class="edit-input" value="${person.gender}">`
                            : `<span class="person-info-value">${person.gender}</span>`
                    }
                </div>

                <div class="person-info-row">
                    <span class="person-info-label">Status</span>
                    ${
                        editMode
                            ? `<input id="edit-status" class="edit-input" value="${person.status}">`
                            : `<span class="person-info-value">${person.status}</span>`
                    }
                </div>
            </div>
        </div>

        <div class="person-notes">
            <h3>Notater</h3>
            ${
                editMode
                    ? `<textarea id="edit-notes">${person.notes}</textarea>`
                    : `<textarea readonly>${person.notes}</textarea>`
            }
        </div>

        <div class="person-extra-grid">
            <div class="extra-card">
                <h4>Sertifikater</h4>
                <div class="tag-container">
                    ${createTagList(person.licenses, "licenses")}
                </div>
                ${
                    editMode
                        ? `<button type="button" class="mini-add-btn" onclick="addTag('licenses', 'Legg til sertifikat')">+ Legg til</button>`
                        : ``
                }
            </div>

            <div class="extra-card">
                <h4>Tidligere forhold</h4>
                <div class="tag-container">
                    ${createTagList(person.pastCases, "pastCases")}
                </div>
                ${
                    editMode
                        ? `<button type="button" class="mini-add-btn" onclick="addTag('pastCases', 'Legg til tidligere forhold')">+ Legg til</button>`
                        : ``
                }
            </div>

            <div class="extra-card">
                <h4>Registrerte kjøretøy</h4>
                <div class="tag-container">
                    ${createTagList(person.vehicles, "vehicles")}
                </div>
                ${
                    editMode
                        ? `<button type="button" class="mini-add-btn" onclick="addTag('vehicles', 'Legg til kjøretøy')">+ Legg til</button>`
                        : ``
                }
            </div>

            <div class="extra-card">
                <h4>Registrerte våpen</h4>
                <div class="tag-container">
                    ${createTagList(person.weapons, "weapons")}
                </div>
                ${
                    editMode
                        ? `<button type="button" class="mini-add-btn" onclick="addTag('weapons', 'Legg til våpen')">+ Legg til</button>`
                        : ``
                }
            </div>
        </div>
    `;
}

function enableEditMode() {
    editMode = true;
    showPerson(currentPerson);
}

function savePerson() {
    if (!currentPerson) return;

    const fullName = document.getElementById("edit-name").value.trim().split(" ");
    const firstName = fullName[0] || "";
    const lastName = fullName.slice(1).join(" ") || "";

    currentPerson.firstName = firstName;
    currentPerson.lastName = lastName;
    currentPerson.id = document.getElementById("edit-id").value;
    currentPerson.phone = document.getElementById("edit-phone").value;
    currentPerson.dob = document.getElementById("edit-dob").value;
    currentPerson.gender = document.getElementById("edit-gender").value;
    currentPerson.status = document.getElementById("edit-status").value;
    currentPerson.notes = document.getElementById("edit-notes").value;

    const imageInput = document.getElementById("edit-image");
    if (imageInput && imageInput.value.trim() !== "") {
        currentPerson.image = imageInput.value.trim();
    }

    editMode = false;
    renderPersonList(personSearch.value);
    showPerson(currentPerson);
}

function addTag(type, promptText) {
    if (!currentPerson) return;

    const value = prompt(promptText);
    if (!value || value.trim() === "") return;

    if (!Array.isArray(currentPerson[type])) {
        currentPerson[type] = [];
    }

    currentPerson[type].push(value.trim());
    showPerson(currentPerson);
}

function removeTag(type, value) {
    if (!currentPerson || !Array.isArray(currentPerson[type])) return;

    currentPerson[type] = currentPerson[type].filter(function (tag) {
        return tag !== value;
    });

    showPerson(currentPerson);
}

personSearch.addEventListener("input", () => {
    renderPersonList(personSearch.value);
});

renderPersonList();