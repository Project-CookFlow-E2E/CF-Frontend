from selenium.webdriver.common.by import By
from pages.base_page import BasePage

class InspireMePage(BasePage):
    def __init__(self, driver):
        super().__init__(driver)

    HEADING = (By.XPATH, "//h1[contains(text(), 'Swipe the Dish')]")
    FAVORITE_BUTTON = (By.CSS_SELECTOR, "[data-testid='favorite-button']")
    SKIP_BUTTON = (By.CSS_SELECTOR, "[data-testid='skip-button']")
    SWIPE_CARD = (By.CSS_SELECTOR, "[data-testid='swipe-card']")
    RECIPE_TITLE = (By.CSS_SELECTOR, "[data-testid='recipe-title']")
    OPEN_RECIPE_BUTTON = (By.CSS_SELECTOR, "[data-testid='open-recipe-button']")

    def load_page(self, base_url):
        self.go_to(f"{base_url}/inspire-me")

    def get_recipe_title(self, recipe_number=1):
        return self.get_text(self.RECIPE_1)

    def get_page_title(self):
        return self.driver.title

    def get_heading_text(self):
        return self.driver.find_element(*self.HEADING).text

    def is_swipe_card_visible(self):
        try:
            self.scroll_to_element(self.SWIPE_CARD)
            return self.is_element_visible(self.SWIPE_CARD)
        except Exception as e:
            print(f"Error checking recipe card visibility: {e}")
            return False

    def click_favorite(self):
        self.click_element(self.FAVORITE_BUTTON)

    def click_skip(self):
        self.click_element(self.SKIP_BUTTON)

    def click_open_recipe(self):
        self.click_element(self.OPEN_RECIPE_BUTTON)

    def get_recipe_title(self):
        return self.get_text(self.RECIPE_TITLE)
