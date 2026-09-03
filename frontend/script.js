const questionInput = document.getElementById("question");

const askBtn = document.getElementById("askBtn");

const answer = document.getElementById("answer");

askBtn.addEventListener("click", async () => {
    const question = questionInput.value.trim();

    if (question === "") {
        answer.textContent = "Please enter a question.";
        return;
    }
    answer.textContent = "Thinking...";

    try {

        const response = await fetch("/ask-gemini", {
            method: "POST", 

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                question: question
            })
        });

        const data = await response.json();

        if (data.error) {
            answer.textContent = data.error;

            return;
        }

        answer.textContent = data.answer;

    } catch (error) {
        console.error(error);

        answer.textContent = "Unable to connect to the server";
    }
});