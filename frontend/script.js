const API_BASE = "http://localhost:3000/api";
const STUDENT_ID = 1;

let subjects = [];
let assessments = [];
let calendarEvents = [];

let currentStartDate = "";
let currentEndDate = "";


/* =========================
   API
========================= */

async function apiRequest(url, options = {}) {

    const response = await fetch(
        API_BASE + url,
        options
    );

    if (!response.ok) {

        let message =
            `Request failed: ${response.status}`;

        try {

            const data =
                await response.json();

            if (data.message) {
                message = data.message;
            }

        }
        catch (error) {

        }

        throw new Error(message);

    }

    return await response.json();

}


/* =========================
   DATE FUNCTIONS
========================= */

function getWeekStart() {

    const date = new Date();

    const day = date.getDay();

    const difference =
        day === 0
            ? -6
            : 1 - day;

    date.setDate(
        date.getDate() + difference
    );

    date.setHours(
        0,
        0,
        0,
        0
    );

    return date;

}


function addDays(date, days) {

    const result =
        new Date(date);

    result.setDate(
        result.getDate() + days
    );

    return result;

}


function dateToString(date) {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;

}


function formatDate(dateString) {

    if (!dateString) {
        return "";
    }

    const date =
        new Date(
            `${dateString}T00:00:00`
        );

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return dateString;

    }

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


function formatDateParts(dateString) {

    const date =
        new Date(
            `${dateString}T00:00:00`
        );

    return {

        day:
            String(
                date.getDate()
            ).padStart(2, "0"),

        month:
            date.toLocaleDateString(
                "en-IN",
                {
                    month: "short"
                }
            )

    };

}


/* =========================
   HTML SAFETY
========================= */

function escapeHTML(value) {

    return String(
        value ?? ""
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}


/* =========================
   MODALS
========================= */

function openModal(id) {

    const modal =
        document.getElementById(
            id
        );

    if (!modal) {
        return;
    }

    modal.classList.add(
        "active"
    );

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "modal-open"
    );

}


function closeModal(id) {

    const modal =
        document.getElementById(
            id
        );

    if (!modal) {
        return;
    }

    modal.classList.remove(
        "active"
    );

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    if (
        !document.querySelector(
            ".modal.active"
        )
    ) {

        document.body.classList.remove(
            "modal-open"
        );

    }

}


function setupModals() {

    const modalButtons = [

        [
            "add-assessment-btn",
            "assessment-modal"
        ],

        [
            "add-subject-btn",
            "subject-modal"
        ],

        [
            "add-calendar-btn",
            "calendar-modal"
        ]

    ];


    modalButtons.forEach(
        ([buttonId, modalId]) => {

            const button =
                document.getElementById(
                    buttonId
                );

            if (!button) {
                return;
            }

            button.addEventListener(
                "click",
                () => {

                    openModal(
                        modalId
                    );

                }
            );

        }
    );


    const closeButtons = [

        [
            "close-assessment-modal",
            "assessment-modal"
        ],

        [
            "close-subject-modal",
            "subject-modal"
        ],

        [
            "close-calendar-modal",
            "calendar-modal"
        ]

    ];


    closeButtons.forEach(
        ([buttonId, modalId]) => {

            const button =
                document.getElementById(
                    buttonId
                );

            if (!button) {
                return;
            }

            button.addEventListener(
                "click",
                () => {

                    closeModal(
                        modalId
                    );

                }
            );

        }
    );


    document
        .querySelectorAll(
            ".modal"
        )
        .forEach(
            (modal) => {

                modal.addEventListener(
                    "click",
                    (event) => {

                        if (
                            event.target ===
                            modal
                        ) {

                            closeModal(
                                modal.id
                            );

                        }

                    }
                );

            }
        );


    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key ===
                "Escape"
            ) {

                document
                    .querySelectorAll(
                        ".modal.active"
                    )
                    .forEach(
                        (modal) => {

                            closeModal(
                                modal.id
                            );

                        }
                    );

            }

        }
    );

}


/* =========================
   SUBJECTS
========================= */

async function loadSubjects() {

    try {

        const data =
            await apiRequest(
                "/details_subject",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            student_id:
                                STUDENT_ID
                        })
                }
            );


        subjects =
            Array.isArray(
                data.data
            )
                ? data.data
                : [];


        renderSubjects();

        populateSubjectSelect();

        renderSubjectWorkload();

    }
    catch (error) {

        console.log(
            "Subject loading error:",
            error.message
        );

        subjects = [];

        renderSubjects();

        populateSubjectSelect();

    }

}


function getSubjectName(subjectId) {

    const subject =
        subjects.find(
            (item) => {

                return String(
                    item.id
                ) ===
                String(
                    subjectId
                );

            }
        );


    if (!subject) {

        return `Subject ${subjectId}`;

    }


    return (
        subject.subject_name ||
        `Subject ${subjectId}`
    );

}


function renderSubjects() {

    const container =
        document.getElementById(
            "subject-list"
        );

    if (!container) {
        return;
    }


    if (
        subjects.length === 0
    ) {

        container.innerHTML = `
            <div class="empty-state">
                No subjects added yet.
            </div>
        `;

        return;

    }


    container.innerHTML =
        subjects.map(
            (subject) => {

                return `
                    <div class="subject-card">

                        <div class="subject-top">

                            <span class="subject-code">

                                ${escapeHTML(
                                    subject.subject_code
                                )}

                            </span>

                            <span class="subject-dot">
                            </span>

                        </div>

                        <h3>

                            ${escapeHTML(
                                subject.subject_name
                            )}

                        </h3>

                        <p>

                            Subject ID:
                            ${escapeHTML(
                                subject.id
                            )}

                        </p>

                    </div>
                `;

            }
        ).join("");

}


function populateSubjectSelect() {

    const select =
        document.getElementById(
            "assessment-subject"
        );

    if (!select) {
        return;
    }


    select.innerHTML = `
        <option value="">
            Select subject
        </option>
    `;


    subjects.forEach(
        (subject) => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                subject.id;

            option.textContent =
                `${subject.subject_name} (${subject.subject_code})`;

            select.appendChild(
                option
            );

        }
    );

}


async function addSubject(event) {

    event.preventDefault();


    const subjectName =
        document.getElementById(
            "subject-name"
        ).value.trim();


    const subjectCode =
        document.getElementById(
            "subject-code"
        ).value.trim();


    if (
        !subjectName ||
        !subjectCode
    ) {

        alert(
            "Enter subject name and subject code."
        );

        return;

    }


    try {

        await apiRequest(
            "/register_subject",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify({

                        student_id:
                            STUDENT_ID,

                        subject_name:
                            subjectName,

                        subject_code:
                            subjectCode

                    })
            }
        );


        document
            .getElementById(
                "subject-form"
            )
            .reset();


        closeModal(
            "subject-modal"
        );


        await loadSubjects();


        alert(
            "Subject added successfully."
        );

    }
    catch (error) {

        console.log(error);

        alert(
            "Subject could not be added.\n" +
            error.message
        );

    }

}


/* =========================
   ASSESSMENTS
========================= */

async function loadAssessments() {

    /*
       We load a very wide range so the
       assessment list shows all saved
       assessments, not only the selected
       workload period.
    */

    try {

        const data =
            await apiRequest(
                "/get_assessments_by_date_range",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            student_id:
                                STUDENT_ID,

                            start_date:
                                "2000-01-01",

                            end_date:
                                "2100-12-31"

                        })
                }
            );


        assessments =
            Array.isArray(
                data.data
            )
                ? data.data
                : [];


    }
    catch (error) {

        console.log(
            "Assessment loading error:",
            error.message
        );

        assessments = [];

    }


    renderAssessments();

    renderDeadlines();

    updateAssessmentCount();

    renderSubjectWorkload();

}


function renderAssessments() {

    const tbody =
        document.getElementById(
            "assessment-list"
        );

    if (!tbody) {
        return;
    }


    if (
        assessments.length === 0
    ) {

        tbody.innerHTML = `

            <tr>

                <td colspan="6">

                    No assessments added yet.

                </td>

            </tr>

        `;

        return;

    }


    const sorted =
        [...assessments].sort(
            (a, b) => {

                return String(
                    a.due_date
                ).localeCompare(
                    String(
                        b.due_date
                    )
                );

            }
        );


    tbody.innerHTML =
        sorted.map(
            (assessment) => {

                const difficulty =
                    Number(
                        assessment.difficulty
                    );


                let difficultyClass =
                    "medium";


                if (
                    difficulty >= 4
                ) {

                    difficultyClass =
                        "hard";

                }
                else if (
                    difficulty <= 2
                ) {

                    difficultyClass =
                        "easy";

                }


                return `

                    <tr>

                        <td>

                            <strong>

                                ${escapeHTML(
                                    assessment.title
                                )}

                            </strong>

                        </td>


                        <td>

                            ${escapeHTML(
                                getSubjectName(
                                    assessment.subject_id
                                )
                            )}

                        </td>


                        <td>

                            ${escapeHTML(
                                assessment.type
                            )}

                        </td>


                        <td>

                            ${formatDate(
                                String(
                                    assessment.due_date
                                ).slice(
                                    0,
                                    10
                                )
                            )}

                        </td>


                        <td>

                            <span
                                class="tag ${difficultyClass}"
                            >

                                ${difficulty}/5

                            </span>

                        </td>


                        <td>

                            ${Number(
                                assessment.estimated_hours ||
                                0
                            ).toFixed(1)}

                            hrs

                        </td>

                    </tr>

                `;

            }
        ).join("");

}


function renderDeadlines() {

    const container =
        document.getElementById(
            "deadline-list"
        );

    if (!container) {
        return;
    }


    const today =
        dateToString(
            new Date()
        );


    const upcoming =
        [...assessments]

            .filter(
                (assessment) => {

                    const date =
                        String(
                            assessment.due_date
                        ).slice(
                            0,
                            10
                        );

                    return (
                        date >=
                        today
                    );

                }
            )

            .sort(
                (a, b) => {

                    return String(
                        a.due_date
                    ).localeCompare(
                        String(
                            b.due_date
                        )
                    );

                }
            )

            .slice(
                0,
                4
            );


    const count =
        document.getElementById(
            "upcoming-count"
        );


    if (count) {

        count.textContent =
            upcoming.length;

    }


    if (
        upcoming.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                No upcoming deadlines.

            </div>

        `;

        return;

    }


    container.innerHTML =
        upcoming.map(
            (assessment) => {

                const date =
                    String(
                        assessment.due_date
                    ).slice(
                        0,
                        10
                    );


                const parts =
                    formatDateParts(
                        date
                    );


                const difficulty =
                    Number(
                        assessment.difficulty
                    );


                let difficultyClass =
                    "medium";

                let difficultyText =
                    "Medium";


                if (
                    difficulty >= 4
                ) {

                    difficultyClass =
                        "hard";

                    difficultyText =
                        "Hard";

                }
                else if (
                    difficulty <= 2
                ) {

                    difficultyClass =
                        "easy";

                    difficultyText =
                        "Easy";

                }


                return `

                    <div class="deadline">

                        <div class="date-box">

                            <strong>
                                ${parts.day}
                            </strong>

                            <span>
                                ${parts.month}
                            </span>

                        </div>


                        <div>

                            <h3>

                                ${escapeHTML(
                                    assessment.title
                                )}

                            </h3>


                            <p>

                                ${escapeHTML(
                                    getSubjectName(
                                        assessment.subject_id
                                    )
                                )}

                                ·

                                ${escapeHTML(
                                    assessment.type
                                )}

                            </p>

                        </div>


                        <span
                            class="difficulty ${difficultyClass}"
                        >

                            ${difficultyText}

                        </span>

                    </div>

                `;

            }
        ).join("");

}


function updateAssessmentCount() {

    const total =
        document.getElementById(
            "total-assessments"
        );


    if (total) {

        total.textContent =
            assessments.length;

    }

}


async function addAssessment(event) {

    event.preventDefault();


    const assessmentData = {

        student_id:
            STUDENT_ID,

        subject_id:
            Number(
                document.getElementById(
                    "assessment-subject"
                ).value
            ),

        title:
            document.getElementById(
                "assessment-title"
            ).value.trim(),

        type:
            document.getElementById(
                "assessment-type"
            ).value,

        due_date:
            document.getElementById(
                "assessment-date"
            ).value,

        weight:
            Number(
                document.getElementById(
                    "assessment-weight"
                ).value
            ),

        difficulty:
            Number(
                document.getElementById(
                    "assessment-difficulty"
                ).value
            ),

        estimated_hours:
            Number(
                document.getElementById(
                    "assessment-hours"
                ).value
            )

    };


    if (
        !assessmentData.subject_id
    ) {

        alert(
            "Please select a subject."
        );

        return;

    }


    if (
        !assessmentData.due_date
    ) {

        alert(
            "Please select a due date."
        );

        return;

    }


    try {

        await apiRequest(
            "/register_assessment",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(
                        assessmentData
                    )
            }
        );


        document
            .getElementById(
                "assessment-form"
            )
            .reset();


        closeModal(
            "assessment-modal"
        );


        await loadAssessments();

        await calculateWorkload();


        alert(
            "Assessment added successfully."
        );

    }
    catch (error) {

        console.log(error);

        alert(
            "Assessment could not be added.\n" +
            error.message
        );

    }

}


/* =========================
   CALENDAR
========================= */

async function loadCalendar() {

    try {

        const data =
            await apiRequest(
                "/get_calendar",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            student_id:
                                STUDENT_ID

                        })
                }
            );


        calendarEvents =
            Array.isArray(
                data.data
            )
                ? data.data
                : [];


        renderCalendar();

    }
    catch (error) {

        console.log(
            "Calendar loading error:",
            error.message
        );

        calendarEvents = [];

        renderCalendar();

    }

}


function renderCalendar() {

    const container =
        document.getElementById(
            "calendar-list"
        );

    if (!container) {
        return;
    }


    if (
        calendarEvents.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                No calendar events added yet.

            </div>

        `;

        return;

    }


    const sorted =
        [...calendarEvents].sort(
            (a, b) => {

                return String(
                    a.calendar_date
                ).localeCompare(
                    String(
                        b.calendar_date
                    )
                );

            }
        );


    container.innerHTML =
        sorted.map(
            (event) => {

                const date =
                    String(
                        event.calendar_date
                    ).slice(
                        0,
                        10
                    );


                const parts =
                    formatDateParts(
                        date
                    );


                const type =
                    String(
                        event.day_type ||
                        ""
                    ).toLowerCase();


                return `

                    <div
                        class="calendar-day ${escapeHTML(type)}"
                    >

                        <span>

                            ${parts.day}

                        </span>


                        <strong>

                            ${parts.month}

                        </strong>


                        <small>

                            ${escapeHTML(
                                event.day_type ||
                                "Event"
                            )}

                        </small>


                        ${
                            event.description
                                ? `
                                    <p>
                                        ${escapeHTML(
                                            event.description
                                        )}
                                    </p>
                                `
                                : ""
                        }

                    </div>

                `;

            }
        ).join("");

}


async function addCalendar(event) {

    event.preventDefault();


    const calendarData = {

        student_id:
            STUDENT_ID,

        calendar_date:
            document.getElementById(
                "calendar-date"
            ).value,

        day_type:
            document.getElementById(
                "calendar-type"
            ).value,

        description:
            document.getElementById(
                "calendar-description"
            ).value.trim()

    };


    if (
        !calendarData.calendar_date ||
        !calendarData.day_type
    ) {

        alert(
            "Please enter the date and day type."
        );

        return;

    }


    try {

        await apiRequest(
            "/register_calendar",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify(
                        calendarData
                    )
            }
        );


        document
            .getElementById(
                "calendar-form"
            )
            .reset();


        closeModal(
            "calendar-modal"
        );


        await loadCalendar();

        await calculateWorkload();


        alert(
            "Calendar event added successfully."
        );

    }
    catch (error) {

        console.log(error);

        alert(
            "Calendar event could not be added.\n" +
            error.message
        );

    }

}


/* =========================
   WORKLOAD
========================= */

async function calculateWorkload() {

    if (
        !currentStartDate ||
        !currentEndDate
    ) {

        return;

    }


    try {

        const data =
            await apiRequest(
                "/calculate_required_work",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({

                            student_id:
                                STUDENT_ID,

                            start_date:
                                currentStartDate,

                            end_date:
                                currentEndDate

                        })
                }
            );


        renderWorkload(
            data
        );

    }
    catch (error) {

        console.log(
            "Workload error:",
            error.message
        );

    }

}


function renderWorkload(data) {

    const required =
        Number(
            data.total_estimated_hours ||
            0
        );


    const capacity =
        Number(
            data.adjusted_study_hours ??
            data.study_hours_per_week ??
            0
        );


    const pressure =
        Number(
            data.workload_pressure ||
            0
        );


    const percentage =
        Math.round(
            pressure * 100
        );


    let status =
        data.workload_status;


    if (!status) {

        if (
            pressure >= 1
        ) {

            status =
                "Overload";

        }
        else if (
            pressure >= 0.7
        ) {

            status =
                "High";

        }
        else {

            status =
                "Normal";

        }

    }


    const loadPercentage =
        document.getElementById(
            "load-percentage"
        );

    const currentLoad =
        document.getElementById(
            "current-load"
        );

    const studyCapacity =
        document.getElementById(
            "study-capacity"
        );

    const requiredHours =
        document.getElementById(
            "required-hours"
        );

    const availableHours =
        document.getElementById(
            "available-hours"
        );

    const loadStatus =
        document.getElementById(
            "load-status"
        );

    const currentLoadStatus =
        document.getElementById(
            "current-load-status"
        );

    const periodStatus =
        document.getElementById(
            "period-status"
        );

    const description =
        document.getElementById(
            "load-description"
        );

    const recommendation =
        document.getElementById(
            "recommendation-text"
        );

    const progress =
        document.getElementById(
            "workload-progress"
        );

    const circle =
        document.getElementById(
            "load-circle"
        );

    const dot =
        document.getElementById(
            "load-status-dot"
        );


    if (loadPercentage) {

        loadPercentage.textContent =
            `${percentage}%`;

    }


    if (currentLoad) {

        currentLoad.textContent =
            `${percentage}%`;

    }


    if (studyCapacity) {

        studyCapacity.textContent =
            `${capacity.toFixed(1)} hrs`;

    }


    if (requiredHours) {

        requiredHours.textContent =
            `${required.toFixed(1)} hrs required`;

    }


    if (availableHours) {

        availableHours.textContent =
            `${capacity.toFixed(1)} hrs available`;

    }


    if (loadStatus) {

        loadStatus.textContent =
            status;

    }


    if (currentLoadStatus) {

        currentLoadStatus.textContent =
            status;

    }


    if (periodStatus) {

        periodStatus.textContent =
            `${status} workload`;

    }


    let statusColor =
        "#15803d";

    let statusDescription =
        "Your academic workload is currently manageable.";

    let recommendationText =
        "Your workload is manageable. Maintain a steady study pace.";


    if (
        status === "High"
    ) {

        statusColor =
            "#b45309";

        statusDescription =
            "Your academic workload is becoming concentrated in this period.";

        recommendationText =
            "Consider starting upcoming assessments earlier to prevent workload buildup.";

    }


    if (
        status === "Overload"
    ) {

        statusColor =
            "#c2413c";

        statusDescription =
            "Your estimated work is at or above your available study capacity.";

        recommendationText =
            "Prioritize the nearest deadlines and start high-effort assessments early.";

    }


    if (description) {

        description.textContent =
            statusDescription;

    }


    if (recommendation) {

        recommendation.textContent =
            data.recommendation ||
            recommendationText;

    }


    if (progress) {

        progress.style.width =
            `${Math.min(
                percentage,
                100
            )}%`;

        progress.style.background =
            statusColor;

    }


    if (dot) {

        dot.style.background =
            statusColor;

    }


    if (circle) {

        const degrees =
            Math.min(
                percentage,
                100
            ) * 3.6;


        circle.style.background =
            `
            conic-gradient(
                ${statusColor}
                0deg
                ${degrees}deg,
                #dceeed
                ${degrees}deg
                360deg
            )
            `;

    }

}


/* =========================
   PERIOD SELECTION
========================= */

function setPeriod(period) {

    const weekStart =
        getWeekStart();


    let start;
    let end;


    if (
        period === "next"
    ) {

        start =
            addDays(
                weekStart,
                7
            );

        end =
            addDays(
                start,
                6
            );

    }
    else if (
        period === "two-weeks"
    ) {

        start =
            weekStart;

        end =
            addDays(
                start,
                13
            );

    }
    else {

        start =
            weekStart;

        end =
            addDays(
                start,
                6
            );

    }


    currentStartDate =
        dateToString(
            start
        );

    currentEndDate =
        dateToString(
            end
        );


    const selectedPeriod =
        document.getElementById(
            "selected-period"
        );


    if (selectedPeriod) {

        selectedPeriod.textContent =
            `${formatDate(
                currentStartDate
            )} – ${formatDate(
                currentEndDate
            )}`;

    }

}


function setupWorkloadPeriod() {

    const select =
        document.getElementById(
            "workload-period"
        );


    const customRange =
        document.getElementById(
            "custom-range"
        );


    const startInput =
        document.getElementById(
            "custom-start-date"
        );


    const endInput =
        document.getElementById(
            "custom-end-date"
        );


    if (!select) {
        return;
    }


    select.addEventListener(
        "change",
        async () => {

            if (
                select.value ===
                "custom"
            ) {

                if (customRange) {

                    customRange.classList.add(
                        "active"
                    );

                }

                return;

            }


            if (customRange) {

                customRange.classList.remove(
                    "active"
                );

            }


            setPeriod(
                select.value
            );


            renderSubjectWorkload();

            await calculateWorkload();

        }
    );


    async function updateCustomRange() {

        if (
            select.value !==
            "custom"
        ) {

            return;

        }


        if (
            !startInput ||
            !endInput ||
            !startInput.value ||
            !endInput.value
        ) {

            return;

        }


        if (
            startInput.value >
            endInput.value
        ) {

            alert(
                "End date must be on or after start date."
            );

            return;

        }


        currentStartDate =
            startInput.value;

        currentEndDate =
            endInput.value;


        updateSelectedPeriod();

        renderSubjectWorkload();

        await calculateWorkload();

    }


    if (startInput) {

        startInput.addEventListener(
            "change",
            updateCustomRange
        );

    }


    if (endInput) {

        endInput.addEventListener(
            "change",
            updateCustomRange
        );

    }

}


function updateSelectedPeriod() {

    const element =
        document.getElementById(
            "selected-period"
        );


    if (element) {

        element.textContent =
            `${formatDate(
                currentStartDate
            )} – ${formatDate(
                currentEndDate
            )}`;

    }

}


/* =========================
   SUBJECT WORKLOAD
========================= */

function renderSubjectWorkload() {

    const container =
        document.getElementById(
            "workload-subject-list"
        );

    if (!container) {
        return;
    }


    const periodAssessments =
        assessments.filter(
            (assessment) => {

                const date =
                    String(
                        assessment.due_date
                    ).slice(
                        0,
                        10
                    );


                return (
                    date >=
                    currentStartDate &&
                    date <=
                    currentEndDate
                );

            }
        );


    if (
        periodAssessments.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-state">

                No assessment workload
                in this period.

            </div>

        `;

        return;

    }


    const workload = {};


    periodAssessments.forEach(
        (assessment) => {

            const id =
                String(
                    assessment.subject_id
                );


            workload[id] =
                (
                    workload[id] ||
                    0
                )
                +
                Number(
                    assessment
                        .estimated_hours ||
                    0
                );

        }
    );


    const entries =
        Object.entries(
            workload
        );


    const maximum =
        Math.max(
            ...entries.map(
                ([id, hours]) =>
                    hours
            ),
            1
        );


    container.innerHTML =
        entries.map(
            ([id, hours]) => {

                const width =
                    (
                        hours /
                        maximum
                    ) * 100;


                return `

                    <div class="subject-row">

                        <div class="subject-name">

                            <strong>

                                ${escapeHTML(
                                    getSubjectName(id)
                                )}

                            </strong>


                            <span>

                                ${hours.toFixed(1)}
                                hrs workload

                            </span>

                        </div>


                        <div class="subject-progress">

                            <div class="bar">

                                <div
                                    class="bar-fill"
                                    style="width:${width}%"
                                ></div>

                            </div>

                        </div>


                        <strong>

                            ${hours.toFixed(1)}
                            hrs

                        </strong>

                    </div>

                `;

            }
        ).join("");

}


/* =========================
   FORMS
========================= */

function setupForms() {

    const assessmentForm =
        document.getElementById(
            "assessment-form"
        );

    const subjectForm =
        document.getElementById(
            "subject-form"
        );

    const calendarForm =
        document.getElementById(
            "calendar-form"
        );


    if (assessmentForm) {

        assessmentForm.addEventListener(
            "submit",
            addAssessment
        );

    }


    if (subjectForm) {

        subjectForm.addEventListener(
            "submit",
            addSubject
        );

    }


    if (calendarForm) {

        calendarForm.addEventListener(
            "submit",
            addCalendar
        );

    }

}


/* =========================
   INITIALIZE
========================= */

async function init() {

    setPeriod(
        "current"
    );

    setupModals();

    setupForms();

    setupWorkloadPeriod();

    await loadSubjects();

    await loadCalendar();

    await loadAssessments();

    await calculateWorkload();

}


document.addEventListener(
    "DOMContentLoaded",
    init
);