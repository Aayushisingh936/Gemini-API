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
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ question })
        });

        // Read the response as text first.
        const responseText = await response.text();

        // Parse JSON safely instead of assuming it is valid.
        let data = {};

        if (responseText.trim()) {
            try {
                data = JSON.parse(responseText);
            } catch {
                throw new Error(
                    `The server returned an invalid response (HTTP ${response.status}). Check the backend server.`
                );
            }
        } else if (response.ok) {
            throw new Error(
                "The server returned an empty response. Check the backend API."
            );
        }

        if (!response.ok) {
            throw new Error(
                data.error || `Request failed with status ${response.status}.`
            );
        }

        if (typeof data.answer !== "string" || !data.answer.trim()) {
            throw new Error("Gemini did not return an answer. Please try again.");
        }

        if (typeof marked !== "undefined" &&
            typeof DOMPurify !== "undefined") {
            answer.innerHTML = DOMPurify.sanitize(
                marked.parse(data.answer)
            );
        } else {
            answer.textContent = data.answer;
        }

        answerStatus.textContent = "Response complete";

    } catch (error) {
        console.error("Ask Gemini error:", error);

        answer.textContent = error.message ||
            "Unable to connect to the server. Please try again.";

        answerStatus.textContent = "Something went wrong";

    } finally {
        askBtn.disabled = false;
        askBtn.innerHTML = 'Ask Gemini <span>→</span>';
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

    answer.innerHTML = `
        <p class="placeholder">
            Your answer will appear here. Enter a question above
            to get started!
        </p>
    `;

    answerStatus.textContent = "Waiting for your question";
    questionInput.focus();
});

