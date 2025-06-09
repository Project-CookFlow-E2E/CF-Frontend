import pytest
from pages.landing_page import LandingPage

@pytest.fixture()
def page(driver):
    return LandingPage(driver)

# This test fails as title is not added yet
@pytest.mark.landing
def test_page_has_title(page, base_url):
    page.load_page(base_url)
    title = page.get_page_title()
    assert "CookFlow" in title, f"Expected title to contain 'CookFlow', but got '{title}'"

@pytest.mark.landing
def test_page_heading(page, base_url):
    page.load_page(base_url)
    heading = page.get_page_heading()
    assert heading == "CookFlow", f"Expected 'CookFlow' but got '{heading}'"

@pytest.mark.landing
def test_recipe_cards_display(page, base_url):
    page.load_page(base_url)
    cards = page.get_recipe_cards()
    assert len(cards) == 3, f"Expected 3 recipe cards, but found {len(cards)}"
    for i, card in enumerate(cards, start=1):
        assert card.is_displayed(), f"Card {i} is not visible"

@pytest.mark.landing
def test_empezar_button_redirects_to_signup(page, base_url):
    page.load_page(base_url)
    page.click_empezar_button()
    assert "/signup" in page.get_current_url(), f"Expected URL to contain '/signup', but got '{driver.get_current_url()}'"

@pytest.mark.landing
def test_a_cocinar_button_redirects_to_signup(page, base_url):
    page.load_page(base_url)
    page.click_acocinar_button()
    assert "/signup" in page.get_current_url(), f"Expected URL to contain '/signup', but got '{driver.get_current_url()}'"
