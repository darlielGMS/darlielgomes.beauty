from flask import Flask, request, jsonify
import re
from html import escape

app = Flask(__name__)

# ---------- Configuration ----------
MAX_NAME_LEN = 80
MAX_EMAIL_LEN = 120
MAX_PHONE_LEN = 20
MAX_MESSAGE_LEN = 1000
MAX_DATE_LEN = 30

# Simple allow-lists / patterns
EMAIL_RE = re.compile(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
PHONE_RE = re.compile(r"^[\d\s\-\+\(\)]{7,20}$")
# Date: keep it simple (YYYY-MM-DD or similar). Adjust as needed.
DATE_RE = re.compile(r"^[\d\-/]{8,12}$")


def sanitize_string(value: str, max_len: int) -> str:
    """
    Treat input as untrusted data.
    - Force to string
    - Strip leading/trailing whitespace
    - Remove control characters
    - Enforce max length
    - Never execute / evaluate the content
    """
    if value is None:
        return ""

    # Force string (never trust the type)
    text = str(value)

    # Remove control characters (except common whitespace)
    text = "".join(ch for ch in text if ch.isprintable() or ch in "\n\r\t")

    # Strip and limit length
    text = text.strip()[:max_len]

    return text


def is_safe_email(email: str) -> bool:
    return bool(EMAIL_RE.match(email)) and len(email) <= MAX_EMAIL_LEN


def is_safe_phone(phone: str) -> bool:
    return bool(PHONE_RE.match(phone)) if phone else True  # phone optional


@app.route("/book", methods=["POST"])
def book():
    """
    Accept booking form data.
    All fields are treated as untrusted.
    """
    # Prefer JSON, fall back to form data
    data = request.get_json(silent=True) or request.form

    # Extract + sanitize every field
    name = sanitize_string(data.get("name"), MAX_NAME_LEN)
    email = sanitize_string(data.get("email"), MAX_EMAIL_LEN).lower()
    phone = sanitize_string(data.get("phone"), MAX_PHONE_LEN)
    date = sanitize_string(data.get("date"), MAX_DATE_LEN)
    message = sanitize_string(data.get("message"), MAX_MESSAGE_LEN)

    # ---------- Validation (reject early) ----------
    errors = []

    if not name or len(name) < 2:
        errors.append("Name is required (min 2 characters).")

    if not email or not is_safe_email(email):
        errors.append("A valid email address is required.")

    if phone and not is_safe_phone(phone):
        errors.append("Phone number format is invalid.")

    if not date or not DATE_RE.match(date):
        errors.append("A valid date is required.")

    if errors:
        return jsonify({
            "success": False,
            "message": "Validation failed.",
            "errors": errors
        }), 400

    # ---------- At this point data is sanitized + validated ----------
    # In a real app you would:
    #   - Save to a database (using parameterized queries / ORM)
    #   - Send an email via a trusted library
    #   - Never build SQL/HTML/commands by concatenating these values

    # Example safe response (never reflect raw user input back as HTML)
    safe_name = escape(name)  # extra protection if later used in HTML templates

    return jsonify({
        "success": True,
        "message": f"Thank you, {safe_name}. Your booking request was received (demo)."
    }), 200


@app.route("/health")
def health():
    return jsonify({"status": "ok"}), 200


if __name__ == "__main__":
    # Debug=False in production!
    app.run(host="127.0.0.1", port=5000, debug=False)