# 🧪 CookFlow UI Test Suite

This repository contains the end-to-end (E2E) UI tests for the **CookFlow** web application.  
The tests are written in **Python** using **pytest** and **Selenium**, and follow the **Page Object Model** design pattern.

---

## 📦 Requirements

- Python 3.8 or higher
- Google Chrome (or any supported browser)
- Virtualenv

---

## 🛠️ Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/cookflow.git
   cd cookflow-tests
   ```
```

### Set up a virtual environment (optional but recommended):

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

▶️ Running the Tests
To run all tests:

```bash
pytest
```
To run tests with a specific marker (e.g., landing page tests):
```bash
pytest -m landing
```

To run tests in parallel (e.g., 2 CPUs):
```bash
pytest -n 2
```

🧪 Example Test Cases

- Check page heading and title
- Verify visibility of recipe cards
- Test redirects from "Empezar" and "A Cocinar" buttons

🧰 Project Structure
```bash
tests/
│
├── test_landing_page.py      # Test cases for the landing page
pages/
│
├── base_page.py              # Reusable actions (click, get_text, scroll)
├── landing_page.py           # Page-specific locators and methods
conftest.py                   # Pytest fixtures (driver, base_url, etc.)
```

- Make sure to configure the base URL for the application under test.
- You can modify the base_url fixture in conftest.py or use .env loading for dynamic config.

💡 Tips

Add pytest.ini to manage markers and test options:

```ini
# pytest.ini
[pytest]
markers =
    landing: Landing page tests
addopts = -v --tb=short
```

📄 License
This project is licensed under the MIT License.
