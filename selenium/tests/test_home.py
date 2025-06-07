import pytest
from pages.home_page import HomePage

@pytest.mark.home
def test_page_has_title(home_page, base_url):
    home_page.load_page(base_url)
    title = home_page.get_page_title()
    assert "Home" in title, f"Expected title to contain 'Home', but got '{title}'"

@pytest.mark.home  
def test_page_loads_with_correct_heading(home_page, base_url):
    home_page.load_page(base_url)
    main_title = home_page.get_main_title()
    assert main_title == "¿Qué te apetece?", f"Expected '¿Qué te apetece?' but got '{main_title}'"

@pytest.mark.home
def test_click_category_badge(home_page, base_url):
    home_page.load_page(base_url)
    home_page.click_category_badge()
    assert home_page.is_category_badge_selected(), "Badge should appear visually selected"


@pytest.mark.home
def test_search_navigation(home_page, base_url):
    home_page.load_page(base_url)
    original_url = home_page.get_current_url()
    home_page.click_category_badge()
    assert home_page.is_category_badge_selected(), "Badge should appear visually selected"
    home_page.click_search_button()
    new_url = home_page.get_current_url()
    assert new_url != original_url, f"URL should change after search. Original: {original_url}, New: {new_url}"

@pytest.mark.home
def test_inspire_button_navigation(home_page, base_url):
    home_page.load_page(base_url)
    home_page.click_inspire_button()
    success = home_page.wait_for_url_contains("inspire-me")
    current_url = home_page.get_current_url()
    assert success, "Should navigate to inspire-me page"
    assert "inspire-me" in current_url, f"URL should contain 'inspire-me', got: {current_url}"

@pytest.mark.home
def test_recipe_cards_display(home_page, base_url):
    home_page.load_page(base_url)
    assert home_page.is_recipe_card_displayed(), "Recipe card should be visible"