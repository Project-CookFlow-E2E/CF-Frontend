import pytest
import time
from pages.inspire_me_page import InspireMePage

@pytest.mark.inspire
def test_inspire_me_page_loads(driver):
    page = InspireMePage(driver)
    page.load()
    time.sleep(1)
    assert page.get_heading_text() == "Swipe the Dish"
    assert page.swipe_card_exists()

@pytest.mark.inspire
def test_favorite_button(driver):
    page = InspireMePage(driver)
    page.load()
    assert page.swipe_card_exists()
    page.click_favorite()
    time.sleep(1)
    assert page.swipe_card_exists()

@pytest.mark.inspire
def test_skip_button(driver):
    page = InspireMePage(driver)
    assert page.swipe_card_exists()
    page.click_skip()
    time.sleep(1)
    assert page.swipe_card_exists()