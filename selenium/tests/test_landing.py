import pytest
from pages.landing_page import LandingPage

@pytest.mark.landing
def test_landing_page_elements(driver):
    landing = LandingPage(driver)
    landing.load()
    assert landing.get_hero_title_text() == "CookFlow"

    cards = landing.get_recipe_cards()
    assert len(cards) >= 1

@pytest.mark.landing
def test_start_button_redirects_to_signup(driver):
    landing = LandingPage(driver)
    landing.load()
    landing.click_start_button()

    assert "/signup" in driver.current_url

@pytest.mark.landing
def test_cookflow_button_redirects_to_signup(driver):
    landing = LandingPage(driver)
    landing.load()
    landing.click_cookflow_button()

    assert "/signup" in driver.current_url
