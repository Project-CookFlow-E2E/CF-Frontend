import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from pages.home_page import HomePage

@pytest.fixture(scope="session")
def base_url():
    """Base URL for the application"""
    return "http://localhost:5173"

@pytest.fixture(scope="function")
def driver():
    """Chrome driver fixture - one per test function"""
    options = Options()
    # options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--window-size=1920,1080")
    options.add_argument("--disable-gpu")
    options.add_argument("--disable-extensions")
    
    driver = webdriver.Chrome(options=options)
    driver.implicitly_wait(5)
    yield driver
    driver.quit()

@pytest.fixture()
def home_page(driver):
    """HomePage instance fixture"""
    return HomePage(driver)