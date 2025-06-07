import pytest
from pages.inspire_me_page import InspireMePage

@pytest.fixture()
def page(driver):
    return InspireMePage(driver)

# This test fails as title is not added yet
@pytest.mark.inspire
def test_page_has_title(page, base_url):
    page.load_page(base_url)
    title = page.get_page_title()
    assert "Inspire Me" in title, f"Expected title to contain 'Inspire Me', but got '{title}'"

@pytest.mark.inspire
def test_swipeable_cards_are_visible(page, base_url):
    page.load_page(base_url)
    assert page.is_swipe_card_visible(), "Expected swipeable cards to be visible"

@pytest.mark.inspire
def test_favorite_button(page, base_url):
    page.load_page(base_url)
    assert page.is_swipe_card_visible(), "Expected swipeable cards to be visible"
    recipe_1_title = page.get_recipe_title()
    assert recipe_1_title, "Expected to get a recipe title"
    page.click_favorite()
    assert page.is_swipe_card_visible()
    recipe_2_title = page.get_recipe_title()
    assert recipe_1_title != recipe_2_title, "Expected different recipe titles after clicking favorite"

@pytest.mark.inspire
def test_skip_button(page, base_url):
    page.load_page(base_url)
    assert page.is_swipe_card_visible(), "Expected swipeable cards to be visible"
    recipe_1_title = page.get_recipe_title()
    assert recipe_1_title, "Expected to get a recipe title"
    page.click_skip()
    assert page.is_swipe_card_visible()
    recipe_2_title = page.get_recipe_title()
    assert recipe_1_title != recipe_2_title, "Expected different recipe titles after clicking skip"

# This test fails as the API is not implemented yet
@pytest.mark.inspire
def test_open_recipe(page, base_url):
    page.load_page(base_url)
    assert page.is_swipe_card_visible(), "Expected swipeable cards to be visible"
    recipe_card_title = page.get_recipe_title()
    assert recipe_card_title, "Expected to get a recipe title"
    page.click_open_recipe()
    recipe_page_title = page.get_recipe_title()
    assert recipe_card_title == recipe_page_title, "Expected to open the correct recipe page with the same title"