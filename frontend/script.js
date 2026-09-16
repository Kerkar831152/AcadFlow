const API_BASE = "http://localhost:3000/api";

const authScreen = document.getElementById("auth-screen");
const appScreen = document.getElementById("app-screen");

const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");

const showLoginButton = document.getElementById("show-login-btn");
const showRegisterButton = document.getElementById("show-register-btn");

let subjects = [];
let assessments = [];
let calendarEvents = [];
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

let totalHours = 0;
let loadPercentage = 0;
let weeklyHours = 0;
let savedStudyHours = 0;

const subjectList = document.getElementById("subject-list");
const assessmentList = document.getElementById("assessment-list");
const calendarGrid = document.getElementById("calendar-grid");

const subjectCount = document.getElementById("subject-count");
const assessmentCount = document.getElementById("assessment-count");
const requiredHours = document.getElementById("required-hours");

const loadStatus = document.getElementById("load-status");
const loadResultStatus = document.getElementById("load-result-status");
const loadCircle = document.getElementById("load-circle");
const loadPercentageElement = document.getElementById("load-percentage");
const analysisstatus = document.getElementById("load-status-text");

const welcomeName = document.getElementById("welcome-name");
const todayDate = document.getElementById("today-date");

const assessmentFilter = document.getElementById("assessment-filter");
const rangeFilter = document.getElementById("assessment-range");

const calendarMonth = document.getElementById("calendar-month");
const previousMonthButton = document.getElementById("previous-month");
const nextMonthButton = document.getElementById("next-month");

const addCalendarButton = document.getElementById("add-calendar-btn");
const calendarModal = document.getElementById("calendar-modal");

const workingDays = document.getElementById("working-days");
const collegeHours = document.getElementById("college-hours");
const studyHours = document.getElementById("study-hours");
const saveAvailabilityButton = document.getElementById("save-availability");

const studentName = document.getElementById("welcome-name");

async function apiRequest(url, options = {}) {
    const token = localStorage.getItem("token");

    if (!options.headers) {
        options.headers = {};
    }

    options.headers["Content-Type"] = "application/json";

    if (token) {
        options.headers["Authorization"] = "Bearer " + token;
    }

    const response = await fetch(API_BASE + url, options);

    if (!response.ok) {
        const error = await response.json();

        if (response.status === 401) {
            localStorage.removeItem("token");
        }

        throw new Error(error.message);
    }

    return await response.json();
}

function formatDate(dateValue) {
    if (dateValue instanceof Date) {
        return dateValue.getFullYear() + "-" +
            String(dateValue.getMonth() + 1).padStart(2, "0") + "-" +
            String(dateValue.getDate()).padStart(2, "0");
    }

    const dateString = String(dateValue);

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return dateString;
    }

    const date = new Date(dateString);

    return date.getFullYear() + "-" +
        String(date.getMonth() + 1).padStart(2, "0") + "-" +
        String(date.getDate()).padStart(2, "0");
}

function getLocalDate(dateValue) {
    const dateString = String(dateValue);

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        const parts = dateString.split("-");

        return new Date(
            Number(parts[0]),
            Number(parts[1]) - 1,
            Number(parts[2])
        );
    }

    const date = new Date(dateValue);

    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    );
}

async function loadSubjects() {
    const data = await apiRequest("/details_subject", {
        method: "POST"
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

    subjectCount.textContent = subjects.length;
}

function getSubjectName(subjectId) {
    const subject = subjects.find(function(subject) {
        return subject.id == subjectId;
    });

    return subject.subject_name;
}

const addSubjectButton = document.getElementById("add-subject-btn");
const subjectModal = document.getElementById("subject-modal");
const subjectForm = document.getElementById("subject-form");

addSubjectButton.addEventListener("click", function() {
    subjectModal.classList.remove("hidden");
});

subjectForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const subjectName = document.getElementById("subject-name");
    const subjectCode = document.getElementById("subject-code");

    await apiRequest("/register_subject", {
        method: "POST",
        body: JSON.stringify({
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

async function loadassessments() {
    assessments = [];

    for (const subject of subjects) {
        const data = await apiRequest("/details_assessment", {
            method: "POST",
            body: JSON.stringify({
                subject_id: subject.id
            })
        });

        assessments = assessments.concat(data.assessments);
    }

    displayassessments(assessments);
}

function displayassessments(list) {
    assessmentList.innerHTML = "";

    list.forEach(function(assessment) {
        assessmentList.innerHTML += `
            <tr>
                <td>${assessment.title}</td>
                <td>${getSubjectName(assessment.subject_id)}</td>
                <td>${assessment.type.toUpperCase()}</td>
                <td>${assessment.due_date}</td>
                <td>${assessment.weight}</td>
                <td>${assessment.difficulty}</td>
                <td>${assessment.estimated_hours}</td>
            </tr>
        `;
    });

    totalHours = 0;
    assessmentCount.textContent = assessments.length;

    for (let i = 0; i < assessments.length; i++) {
        totalHours += Number(assessments[i].estimated_hours);
    }

    requiredHours.innerText = totalHours + " hrs";
}

async function loadAvailability() {
    const data = await apiRequest("/get_availability", {
        method: "POST"
    });

    if (data.data.length > 0) {
        const availability = data.data[0];

        workingDays.value = availability.working_days;
        collegeHours.value = availability.college_hours_per_day;
        studyHours.value = availability.study_hours_per_week;

        savedStudyHours = Number(availability.study_hours_per_week);
    }
}

function calculateWorkload() {
    weeklyHours = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    for (let i = 0; i < assessments.length; i++) {
        const dueDate = getLocalDate(assessments[i].due_date);

        if (dueDate >= today && dueDate <= nextWeek) {
            weeklyHours += Number(assessments[i].estimated_hours);
        }
    }

    if (savedStudyHours === 0) {
        loadPercentage = 0;
        return;
    }

    loadPercentage = (weeklyHours / savedStudyHours) * 100;

    if (loadPercentage <= 70) {
        loadStatus.textContent = "Normal";
    }
    else if (loadPercentage <= 100) {
        loadStatus.textContent = "High";
    }
    else {
        loadStatus.textContent = "Overload";
    }
}

function loadpercent() {
    const percentage = Math.min(loadPercentage, 100);

    if (loadPercentage <= 70) {
        loadResultStatus.textContent = "Normal";
    }
    else if (loadPercentage <= 100) {
        loadResultStatus.textContent = "High";
    }
    else {
        loadResultStatus.textContent = "Overload";
    }

    loadPercentageElement.textContent = Math.round(loadPercentage) + "%";
    analysisstatus.textContent = "Analysis Done.";

    loadCircle.style.background =
        `conic-gradient(
            #0f766e 0%,
            #0f766e ${percentage}%,
            #dff5f1 ${percentage}%,
            #dff5f1 100%
        )`;
}

const calculateWorkloadButton = document.getElementById("calculate-workload");

calculateWorkloadButton.addEventListener("click", function() {
    calculateWorkload();
    loadpercent();
});

const addassessmentButton = document.getElementById("add-assessment-btn");
const assessmentModal = document.getElementById("assessment-modal");
const assessmentForm = document.getElementById("assessment-form");

addassessmentButton.addEventListener("click", function() {
    assessmentModal.classList.remove("hidden");
});

function applyFilters() {
    const selectedType = assessmentFilter.value;
    const selectedRange = rangeFilter.value;

    let filteredAssessments = assessments;

    if (selectedType !== "all") {
        filteredAssessments = filteredAssessments.filter(function(assessment) {
            return assessment.type.toLowerCase() === selectedType;
        });
    }

    if (selectedRange === "upcoming") {
        const today = new Date();
        const todayDate = formatDate(today);

        filteredAssessments = filteredAssessments.filter(function(assessment) {
            return String(assessment.due_date).slice(0, 10) >= todayDate;
        });
    }
    else if (selectedRange === "week") {
        const today = new Date();
        const day = today.getDay();

        const monday = new Date(today);
        monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1));

        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);

        const mondayDate = formatDate(monday);
        const sundayDate = formatDate(sunday);

        filteredAssessments = filteredAssessments.filter(function(assessment) {
            const dueDate = String(assessment.due_date).slice(0, 10);

            return dueDate >= mondayDate &&
                   dueDate <= sundayDate;
        });
    }

    displayassessments(filteredAssessments);
}

assessmentFilter.addEventListener("change", function() {
    applyFilters();
});

rangeFilter.addEventListener("change", function() {
    applyFilters();
});

assessmentForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const title = document.getElementById("assessment-title");
    const assessmentsubject = document.getElementById("assessment-subject");
    const type = document.getElementById("assessment-type");
    const assessmentdate = document.getElementById("assessment-date");
    const assessmentweight = document.getElementById("assessment-weight");
    const assessmentdifficulty = document.getElementById("assessment-difficulty");
    const assessmenthours = document.getElementById("assessment-hours");

    await apiRequest("/register_assessment", {
        method: "POST",
        body: JSON.stringify({
            subject_id: Number(assessmentsubject.value),
            title: title.value,
            type: type.value,
            due_date: assessmentdate.value,
            weight: assessmentweight.value,
            difficulty: assessmentdifficulty.value,
            estimated_hours: assessmenthours.value
        })
    });

    await loadassessments();
    calculateWorkload();
    loadpercent();

    assessmentModal.classList.add("hidden");
    assessmentForm.reset();
});

function displayCalendar() {
    calendarGrid.innerHTML = "";

    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);

    const startDay = (firstDay.getDay() + 6) % 7;
    const daysInMonth = lastDay.getDate();

    calendarMonth.textContent =
        firstDay.toLocaleString("default", {
            month: "long",
            year: "numeric"
        });

    for (let i = 0; i < startDay; i++) {
        calendarGrid.innerHTML += `
            <div class="empty-day"></div>
        `;
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, currentMonth, day);
        const fullDate = formatDate(date);
        const isSunday = date.getDay() === 0;

        let eventHTML = "";
        let assessmentHTML = "";

        calendarEvents.forEach(function(event) {
            const eventDate = formatDate(event.calendar_date);

            if (eventDate === fullDate) {
                eventHTML += `
                    <div class="calendar-event ${event.day_type}">
                        ${event.description}
                    </div>
                `;
            }
        });

        assessments.forEach(function(assessment) {
            const assessmentDate = formatDate(assessment.due_date);

            if (assessmentDate === fullDate) {
                assessmentHTML += `
                    <div class="calendar-event assessment">
                        ${assessment.title}
                    </div>
                `;
            }
        });

        calendarGrid.innerHTML += `
            <div class="calendar-day ${isSunday ? "sunday" : ""}">
                <strong>${day}</strong>
                ${isSunday ? `<span>Sunday</span>` : ""}
                ${eventHTML}
                ${assessmentHTML}
            </div>
        `;
    }
}

async function loadCalendarEvents() {
    const data = await apiRequest("/get_calendar", {
        method: "POST"
    });

    calendarEvents = data.data;
    displayCalendar();
}

const calendarForm = document.getElementById("calendar-form");

calendarForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const calendarDate = document.getElementById("calendar-date");
    const calendarType = document.getElementById("calendar-type");
    const calendarDescription = document.getElementById("calendar-description");

    await apiRequest("/register_calendar", {
        method: "POST",
        body: JSON.stringify({
            calendar_date: calendarDate.value,
            day_type: calendarType.value,
            description: calendarDescription.value
        })
    });

    await loadCalendarEvents();

    calendarModal.classList.add("hidden");
    calendarForm.reset();
});

addCalendarButton.addEventListener("click", function() {
    calendarModal.classList.remove("hidden");
});

previousMonthButton.addEventListener("click", function() {
    currentMonth--;

    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }

    displayCalendar();
});

nextMonthButton.addEventListener("click", function() {
    currentMonth++;

    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }

    displayCalendar();
});

saveAvailabilityButton.addEventListener("click", async function() {
    const workingDaysValue = Number(workingDays.value);
    const collegeHoursValue = Number(collegeHours.value);
    const studyHoursValue = Number(studyHours.value);

    const data = await apiRequest("/get_availability", {
        method: "POST"
    });

    let message = "";

    if (data.data.length === 0) {
        await apiRequest("/register_availability", {
            method: "POST",
            body: JSON.stringify({
                working_days: workingDaysValue,
                college_hours_per_day: collegeHoursValue,
                study_hours_per_week: studyHoursValue
            })
        });

        message = "Availability saved";
    }
    else {
        await apiRequest("/update_availability", {
            method: "PATCH",
            body: JSON.stringify({
                working_days: workingDaysValue,
                college_hours_per_day: collegeHoursValue,
                study_hours_per_week: studyHoursValue
            })
        });

        message = "Availability updated";
    }

    await loadAvailability();
    calculateWorkload();
    alert(message);
});

async function displaystudentdata() {
    const data = await apiRequest("/details", {
        method: "POST",
        body: JSON.stringify({})
    });

    const student = data.data[0];

    document.getElementById("student-name").textContent = student.name;
    document.getElementById("student-email").textContent = student.email;
    document.getElementById("student-college").textContent = student.college;
    document.getElementById("student-course").textContent = student.course;
    document.getElementById("student-semester").textContent = student.semester;

    document.getElementById("welcome-name").textContent = student.name;
    document.getElementById("nav-student-name").textContent = student.name;
}

showLoginButton.addEventListener("click", function() {
    registerForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
});

showRegisterButton.addEventListener("click", function() {
    loginForm.classList.add("hidden");
    registerForm.classList.remove("hidden");
});

loginForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.getElementById("login-email");
    const password = document.getElementById("login-password");

    try {
        const data = await apiRequest("/login", {
            method: "POST",
            body: JSON.stringify({
                email: email.value,
                password: password.value
            })
        });

        localStorage.setItem("token", data.token);

        authScreen.classList.add("hidden");
        appScreen.classList.remove("hidden");

        await startApp();

        loginForm.reset();
    }
    catch(error) {
        alert(error.message);
    }
});

registerForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const name = document.getElementById("register-name");
    const email = document.getElementById("register-email");
    const password = document.getElementById("register-password");
    const college = document.getElementById("register-college");
    const course = document.getElementById("register-course");
    const semester = document.getElementById("register-semester");

    try {
        await apiRequest("/register", {
            method: "POST",
            body: JSON.stringify({
                name: name.value,
                email: email.value,
                password: password.value,
                college: college.value,
                course: course.value,
                semester: semester.value
            })
        });

        alert("Account created successfully. Please login.");

        const registeredEmail = email.value;

        registerForm.reset();

        registerForm.classList.add("hidden");
        loginForm.classList.remove("hidden");

        document.getElementById("login-email").value = registeredEmail;
    }
    catch(error) {
        alert(error.message);
    }
});

const logoutButton = document.getElementById("logout-btn");

logoutButton.addEventListener("click", function() {
    const confirmLogout = confirm("Are you sure you want to sign out?");

    if(!confirmLogout) {
        return;
    }

    localStorage.removeItem("token");

    authScreen.classList.remove("hidden");
    appScreen.classList.add("hidden");

    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");

    loginForm.reset();
    registerForm.reset();
});

async function startApp() {
    await displaystudentdata();
    await loadSubjects();
    await loadassessments();
    await loadCalendarEvents();
    await loadAvailability();
    calculateWorkload();
    loadpercent();
}

const token = localStorage.getItem("token");

if(token) {
    authScreen.classList.add("hidden");
    appScreen.classList.remove("hidden");

    startApp().catch(function(error) {
        console.log(error);

        localStorage.removeItem("token");

        authScreen.classList.remove("hidden");
        appScreen.classList.add("hidden");

        registerForm.classList.remove("hidden");
        loginForm.classList.add("hidden");
    });
}
else {
    authScreen.classList.remove("hidden");
    appScreen.classList.add("hidden");

    registerForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
}