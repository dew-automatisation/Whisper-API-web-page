document.getElementById("transcription-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const apiKey = document.getElementById("api-key").value;
    const audioFileInput = document.getElementById("audio-file");
    const audioFile = audioFileInput.files[0];
    const transcriptionResultElement = document.getElementById("transcription-result");

    const formData = new FormData();
    formData.append("file", audioFile);
    formData.append("model", "whisper-1");

    try {
        const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
            },
            body: formData
        });

        if (response.ok) {
            const jsonResponse = await response.json();
            transcriptionResultElement.textContent = jsonResponse.text;
        } else {
            transcriptionResultElement.textContent = `Erreur: ${response.statusText}`;
        }
    } catch (error) {
        transcriptionResultElement.textContent = `Erreur: ${error.message}`;
    }
});
