const API_BASE = "http://localhost:3000/api";
const STUDENT_ID = 1;
const SUBJECT_ID=1;
let subjects = [];
let assessments = [];
let calendarEvents = [];
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

const subjectList = document.getElementById("subject-list");
const assessmentList = document.getElementById("assessment-list");
const calendarGrid = document.getElementById("calendar-grid");

const subjectCount = document.getElementById("subject-count");
const assessmentCount = document.getElementById("assessment-count");
const requiredHours = document.getElementById("required-hours");
const loadStatus = document.getElementById("load-status");

const welcomeName = document.getElementById("welcome-name");
const todayDate = document.getElementById("today-date");

async function apiRequest(url, options = {}) {
    const response = await fetch(API_BASE + url, options);

    if (!response.ok) {
        throw new Error("Request failed");
    }

    return await response.json();
}

async function loadSubjects() {
    const data = await apiRequest("/details_subject", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            student_id: STUDENT_ID
        })
    });
    subjects = data.data;
    displaySubjects();
     const subjectSelect = document.getElementById("assessment-subject");

    subjectSelect.innerHTML = `
        <option value="">
            Select subject
        </option>
    `;

    subjects.forEach(function(subject) {
        subjectSelect.innerHTML += `
            <option value="${subject.id}">
                ${subject.subject_name}
            </option>
        `;
    });
}

function displaySubjects() {
    subjectList.innerHTML = "";

    subjects.forEach(function(subject) {
        subjectList.innerHTML += `
            <tr>
                <td>${subject.subject_name}</td>
                <td>${subject.subject_code}</td>
            </tr>
        `;
    });
}

function getSubjectName(subjectId) {
    const subject = subjects.find(function(subject) {
        return subject.id == subjectId;
    });

    return subject.subject_name;
}

const addSubjectButton = document.getElementById("add-subject-btn");
const subjectModal = document.getElementById("subject-modal");

addSubjectButton.addEventListener("click", function() {
    subjectModal.classList.remove("hidden");
});

const subjectForm = document.getElementById("subject-form");

subjectForm.addEventListener("submit",async function(event) {
    event.preventDefault();

    const subjectName = document.getElementById("subject-name");
    const subjectCode = document.getElementById("subject-code");
    await apiRequest("/register_subject", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            student_id: STUDENT_ID,
            subject_name: subjectName.value,
            subject_code: subjectCode.value
        })
    });
    await loadSubjects();
    subjectModal.classList.add("hidden");
    subjectForm.reset();
});
const closeButtons = document.querySelectorAll("[data-close]");

closeButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        const modalId = button.getAttribute("data-close");
        const modal = document.getElementById(modalId);

        modal.classList.add("hidden");
    });
});

async function loadassesments() {
    const data = await apiRequest("/details_assessment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            student_id: STUDENT_ID,
            subject_id:SUBJECT_ID
        })
    });
    assessments= data.assessments;
    displayassesments();
}
function displayassesments() {
    assessmentList.innerHTML = "";

    assessments.forEach(function(assessment) {
        assessmentList.innerHTML += `
            <tr>
                <td>${assessment.title}</td>
                <td>${getSubjectName(assessment.subject_id)}</td>
                <td>${assessment.type}</td>
                <td>${assessment.due_date}</td>
                <td>${assessment.weight}</td>
                <td>${assessment.difficulty}</td>
                <td>${assessment.estimated_hours}</td>
            </tr>
        `;
    });
}
const addassessmentButton = document.getElementById("add-assessment-btn");
const assessmentModal = document.getElementById("assessment-modal");
addassessmentButton.addEventListener("click", function() {
    assessmentModal.classList.remove("hidden");
});
const assessmentForm = document.getElementById("assessment-form");

assessmentForm.addEventListener("submit",async function(event) {
    event.preventDefault();

    const title= document.getElementById("assessment-title");
    const assessmentsubject= document.getElementById("assessment-subject");
    const type=document.getElementById("assessment-type");
    const assessmentdate=document.getElementById("assessment-date");
    const assessmentweight=document.getElementById("assessment-weight");
    const assessmentdifficulty=document.getElementById("assessment-difficulty");
    const assessmenthours=document.getElementById("assessment-hours");
    await apiRequest("/register_assessment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            student_id:STUDENT_ID,
            subject_id: Number(assessmentsubject.value),
            title:title.value,
            type:type.value,
            due_date:assessmentdate.value,
            weight:assessmentweight.value,
            difficulty:assessmentdifficulty.value,
            estimated_hours:assessmenthours.value

        })
    });
    await loadassesments();
    assessmentModal.classList.add("hidden");
    assessmentForm.reset();
});
async function startApp() {
    await loadSubjects();
    await loadassesments();
}
startApp();