// Example fetch (replace the demo submit handler)
bookingForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!bookingForm.checkValidity()) {
    bookingForm.reportValidity();
    return;
  }

  const formData = new FormData(bookingForm);

  try {
    const response = await fetch("http://127.0.0.1:5000/book", {
      method: "POST",
      body: formData
    });

    const result = await response.json();

    if (formMessage) {
      formMessage.textContent = result.message || "Something went wrong.";
    }
  } catch (err) {
    if (formMessage) {
      formMessage.textContent = "Could not reach the server.";
    }
  }
});