import { workshops, mentors, tasks } from './data.js';

// Form Submission Handler
document.getElementById("student-form").addEventListener("submit", function (e) {
    e.preventDefault();

    // Get Form Data
    const name = document.getElementById("name").value;
    const strengths = document.getElementById("strengths").value.split(",").map(s => s.trim());
    const weaknesses = document.getElementById("weaknesses").value.split(",").map(w => w.trim());
    const interests = document.getElementById("interests").value.split(",").map(i => i.trim());
    const preferredTopics = document.getElementById("preferred-topics").value.split(",").map(pt => pt.trim());
    const learningStyle = document.getElementById("learning-style").value;

    // Create Student Object
    const student = { name, strengths, weaknesses, interests, preferences: { preferredTopics }, learningStyle };

    // Save Student Data to localStorage
    const students = JSON.parse(localStorage.getItem("students") || "[]");
    students.push(student);
    localStorage.setItem("students", JSON.stringify(students));

    // Generate Recommendations
    const recommendations = generateRecommendations(student);

    // Update UI
    updateUI(recommendations, student);
    console.log(student);
});

// Recommendation Algorithm
function generateRecommendations(student) {
    // Suggest Workshops
    const suggestedWorkshops = workshops.filter(workshop =>
        workshop.target_interests.some(interest => student.interests.includes(interest)) ||
        workshop.target_strengths.some(strength => student.strengths.includes(strength))
    );

    // Recommend Task
    const suggestedTask = tasks.find(task =>
        task.related_topics.some(topic => student.preferences.preferredTopics.includes(topic))
    ) || { description: "Explore a topic of your choice to build a new skill." };

    // Match Mentor
    const matchedMentor = mentors.find(mentor =>
        mentor.expertise.some(expertise =>
            student.weaknesses.includes(expertise) || student.interests.includes(expertise)
        )
    );

    // Adjust recommendations based on Learning Style
    let learningStyleSuggestion = "";
    if (student.learningStyle === "visual") {
        learningStyleSuggestion = "We recommend workshops focused on visual learning techniques.";
    } else if (student.learningStyle === "auditory") {
        learningStyleSuggestion = "We recommend workshops focused on auditory learning techniques.";
    } else if (student.learningStyle === "kinesthetic") {
        learningStyleSuggestion = "We recommend workshops focused on kinesthetic learning techniques.";
    }

    return {
        workshops: suggestedWorkshops,
        dailyTask: suggestedTask.description,
        mentor: matchedMentor ? matchedMentor.name : "No suitable mentor found",
        learningStyleSuggestion: learningStyleSuggestion
    };
};

// Update UI
function updateUI(recommendations, student) {
    // Display student name
    document.getElementById("student-name").textContent = student.name;

    // Display workshops
    document.getElementById("workshops").innerHTML = recommendations.workshops
        .map(workshop => `<li>${workshop.topic}</li>`)
        .join("");

    // Display daily task
    document.getElementById("daily-task").textContent = recommendations.dailyTask;

    // Display mentor
    document.getElementById("mentor").textContent = recommendations.mentor;

    // Display learning style suggestion
    document.getElementById("learning-style-suggestion").textContent = recommendations.learningStyleSuggestion;
};

document.getElementById("clear-btn").addEventListener("click", () => {
    document.getElementById("student-form").reset();

    document.getElementById("student-name").textContent = "";
    document.getElementById("workshops").textContent = "";
    document.getElementById("daily-task").textContent = "";
    document.getElementById("mentor").textContent = "";
    document.getElementById("learning-style-suggestion").textContent = "";
});