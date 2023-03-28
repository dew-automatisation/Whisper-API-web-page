function copyToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
}

document.getElementById("copy-to-clipboard").addEventListener("click", () => {
    const transcriptionResultElement = document.getElementById("transcription-result");
    copyToClipboard(transcriptionResultElement.textContent);
});

document.getElementById("transcription-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const apiKey = document.getElementById("api-key").value;
    const audioFileInput = document.getElementById("audio-file");
    const audioFile = audioFileInput.files[0];
    const outputFormat = document.getElementById("output-format").value;
    const transcriptionResultElement = document.getElementById("transcription-result");

    const formData = new FormData();
    formData.append("file", audioFile);
    formData.append("model", "whisper-1");
    formData.append("response_format", outputFormat);

    try {
        const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
            },
            body: formData
        });

        if (response.ok) {
            const copyButton = document.getElementById("copy-to-clipboard");
            if (outputFormat === "json" || outputFormat === "verbose_json") {
                const jsonResponse = await response.json();
                transcriptionResultElement.textContent = JSON.stringify(jsonResponse, null, 2);
            } else {
                const textResponse = await response.text();
                transcriptionResultElement.textContent = textResponse;
            }
            copyButton.disabled = false;
        } else {
            transcriptionResultElement.textContent = `Erreur: ${response.statusText}`;
            copyButton.disabled = true;
        }
    } catch (error) {
        transcriptionResultElement.textContent = `Erreur: ${error.message}`;
        copyButton.disabled = true;
    }
});
