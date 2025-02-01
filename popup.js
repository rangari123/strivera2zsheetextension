window.onload = function () {
  loadProblems();
};

async function loadProblems() {
  try {
    const response = await fetch(chrome.runtime.getURL("question_table.html"));
    const htmlText = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, "text/html");

    let problems = extractProblems(doc);
    if (problems.length === 0) {
      document.getElementById("problems").innerText = "No problems found.";
      return;
    }

    // Check for today's date and fetch the problems
    const todayDate = new Date().toISOString().split("T")[0]; // Get today's date (YYYY-MM-DD)
    const storedDate = localStorage.getItem("lastFetchedDate");

    if (storedDate !== todayDate) {
      // If the problems were not fetched today, fetch new problems
      saveProblemsForToday(problems);
      localStorage.setItem("lastFetchedDate", todayDate);
    }

    // Get problems from localStorage
    const problemsForToday = JSON.parse(
      localStorage.getItem("problemsForToday")
    );
    displayProblems(problemsForToday);
  } catch (error) {
    console.error("Error loading problems:", error);
    document.getElementById("problems").innerText = "Error loading problems.";
  }
}

function extractProblems(doc) {
  let problemList = [];

  doc.querySelectorAll("tr").forEach((row, index) => {
    if (index === 0) return; // Skip header row

    const cols = row.querySelectorAll("td");
    if (cols.length >= 3) {
      const question = cols[0].innerText.trim();
      const topic = cols[1].innerText.trim();
      const tags = cols[2].innerText.trim();
      problemList.push({ question, topic, tags });
    }
  });

  return problemList;
}

function saveProblemsForToday(problems) {
  // Store the top 3 problems for today
  const todayProblems = problems.slice(0, 3);
  localStorage.setItem("problemsForToday", JSON.stringify(todayProblems));
}

function displayProblems(problems) {
  let container = document.getElementById("problems");
  container.innerHTML = ""; // Clear previous problems

  problems.forEach((problem) => {
    let problemElement = document.createElement("div");
    problemElement.className = "problem";

    // Display Question - Topic - Tags horizontally
    problemElement.innerHTML = `
      <h3>${problem.question}</h3>
      <div class="problem-info">
        <p class="topic">${problem.topic}</p>
        <p class="tags ${getTagClass(problem.tags)}">${problem.tags}</p>
      </div>
    `;

    // Add click event to open Google search for the clicked question
    problemElement.onclick = function () {
      const searchQuery = `${problem.question} DSA problem`;
      window.open(
        `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`,
        "_blank"
      );
    };

    container.appendChild(problemElement);
  });
}

function getTagClass(tag) {
  if (tag.toLowerCase() === "easy") return "easy";
  if (tag.toLowerCase() === "medium") return "medium";
  if (tag.toLowerCase() === "hard") return "hard";
  return "";
}
