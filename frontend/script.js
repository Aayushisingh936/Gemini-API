
const questionInput = document.getElementById("question");
const askBtn = document.getElementById("askBtn");
const clearBtn = document.getElementById("clearBtn");
const answer = document.getElementById("answer");
const answerStatus = document.getElementById("answerStatus");
const charCount = document.getElementById("charCount");

questionInput.addEventListener("input", () => {
    charCount.textContent = `${questionInput.value.length} / 5000`;
});

document.querySelectorAll(".suggestion").forEach((button) => {
    button.addEventListener("click", () => {
        questionInput.value = button.dataset.question;
        charCount.textContent = `${questionInput.value.length} / 5000`;
        questionInput.focus();
    });
});

async function askGemini() {
    const question = questionInput.value.trim();

    if (!question) {
        answer.textContent = "Please enter a question first.";
        answerStatus.textContent = "Question required";
        questionInput.focus();
        return;
    }

    askBtn.disabled = true;
    askBtn.textContent = "Thinking...";
    answer.textContent = "Gemini is preparing your answer...";
    answerStatus.textContent = "Generating response";

    try {
        const response = await fetch("/ask-gemini", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ question })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Unable to get an answer.");
        }

        answer.innerHTML = DOMPurify.sanitize(marked.parse(data.answer || "No answer received."));
        answerStatus.textContent = "Response complete";

    } catch (error) {
        console.error(error);
        answer.textContent = error.message || "Unable to connect to the server.";
        answerStatus.textContent = "Something went wrong";

    } finally {
        askBtn.disabled = false;
        askBtn.innerHTML = "Ask Gemini <span>→</span>";
    }
}

askBtn.addEventListener("click", askGemini);

questionInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        askGemini();
    }
});

clearBtn.addEventListener("click", () => {
    questionInput.value = "";
    charCount.textContent = "0 / 5000";
    answer.innerHTML = '<p class="placeholder">Your answer will appear here. Enter a question above to get started!</p>';
    answerStatus.textContent = "Waiting for your question";
    questionInput.focus();
});
