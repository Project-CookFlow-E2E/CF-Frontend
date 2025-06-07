import pytest
from pages.home_page import HomePage

@pytest.fixture()
def page(driver):
    return HomePage(driver)

# This test fails as title is not added yet
@pytest.mark.home
def test_page_has_title(page, base_url):
    page.load_page(base_url)
    title = page.get_page_title()
    assert "Home" in title, f"Expected title to contain 'Home', but got '{title}'"

@pytest.mark.home  
def test_page_loads_with_correct_heading(page, base_url):
    page.load_page(base_url)
    main_title = page.get_main_title()
    assert main_title == "¿Qué te apetece?", f"Expected '¿Qué te apetece?' but got '{main_title}'"

@pytest.mark.home
def test_click_category_badge(page, base_url):
    page.load_page(base_url)
    page.click_category_badge()
    assert page.is_category_badge_selected(), "Badge should appear visually selected"

@pytest.mark.home
def test_search_navigation(page, base_url):
    page.load_page(base_url)
    original_url = page.get_current_url()
    page.click_category_badge()
    assert page.is_category_badge_selected(), "Badge should appear visually selected"
    page.click_search_button()
    new_url = page.get_current_url()
    assert new_url != original_url, f"URL should change after search. Original: {original_url}, New: {new_url}"

@pytest.mark.home
def test_inspire_button_navigation(page, base_url):
    page.load_page(base_url)
    page.click_inspire_button()
    success = page.wait_for_url_contains("inspire-me")
    current_url = page.get_current_url()
    assert success, "Should navigate to inspire-me page"
    assert "inspire-me" in current_url, f"URL should contain 'inspire-me', got: {current_url}"

@pytest.mark.home
def test_recipe_cards_display(page, base_url):
    page.load_page(base_url)
    assert page.is_recipe_card_displayed(), "Recipe card should be visible"