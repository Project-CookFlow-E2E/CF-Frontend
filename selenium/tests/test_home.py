import pytest
from pages.home_page import HomePage
import time

@pytest.mark.home
def test_homepage_categories_and_search(driver):
    home = HomePage(driver)
    home.load()
    home.click_category_by_name("Comida")
    home.click_search()
    assert "search?category=comida" in driver.current_url

@pytest.mark.home
def test_recipe_cards_visible(driver):
    home = HomePage(driver)
    home.load()
    cards = home.get_recipe_cards()
    assert len(cards) >= 1

@pytest.mark.home
def test_inspire_me_button(driver):
    home = HomePage(driver)
    home.load()
    home.click_inspire_me()
    time.sleep(1)
    assert "/inspire-me" in driver.current_url