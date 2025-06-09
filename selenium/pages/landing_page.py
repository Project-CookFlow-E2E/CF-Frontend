from selenium.webdriver.common.by import By
from pages.base_page import BasePage

class LandingPage(BasePage):
    def __init__(self, driver):
        super().__init__(driver)

    PAGE_HEADING = (By.ID, "hero-title")
    EMPEZAR_BUTTON = (By.XPATH, "//a[contains(@href, '/signup')]//button[contains(text(), 'Empezar')]")
    RECIPE_CARDS = (By.CSS_SELECTOR, "[data-testid^='card-recipe-card']")
    ACOCINAR_BUTTON = (By.XPATH, "//a[contains(@href, '/signup')]//button[contains(text(), 'A cocinar')]")

    def load_page(self, base_url):
        self.go_to(f"{base_url}/main")

    def get_page_title(self):
        return self.driver.title

    def get_page_heading(self):
        return self.get_text(self.PAGE_HEADING)

    def click_empezar_button(self):
        self.click_element(self.EMPEZAR_BUTTON)

    def click_acocinar_button(self):
        self.click_element(self.ACOCINAR_BUTTON)

    def get_recipe_cards(self):
        return self.get_elements(self.RECIPE_CARDS)

    def is_recipe_card_displayed(self):
        try:
            self.scroll_to_element(self.RECIPE_CARD)
            return self.is_element_visible(self.RECIPE_CARD)
        except Exception as e:
            print(f"Error checking recipe card visibility: {e}")
            return False
