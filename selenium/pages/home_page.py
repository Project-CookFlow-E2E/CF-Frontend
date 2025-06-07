from selenium.webdriver.common.by import By
from pages.base_page import BasePage

class HomePage(BasePage):
    def __init__(self, driver):
        super().__init__(driver)
        
    MAIN_TITLE = (By.CSS_SELECTOR, "[data-testid='main-title']")
    CATEGORY_BADGE = (By.ID, "category-badge")
    CATEGORY_BADGE_LABEL = (By.CSS_SELECTOR, "[data-testid='badge-label']")
    SEARCH_BUTTON = (By.XPATH, "//button[normalize-space()='Buscar']")
    INSPIRE_BUTTON = (By.CSS_SELECTOR, "[data-testid='inspire-button']")
    RECIPE_CARD_1 = (By.CSS_SELECTOR, "[data-testid='card-recipe-card-1']")

    def load_page(self, url):
        self.go_to(url)
        return self.wait_for_element(self.MAIN_TITLE)
        
    def get_page_title(self):
        return self.driver.title
        
    def get_main_title(self):
        return self.get_text(self.MAIN_TITLE)

    def click_category_badge(self):
        self.click_element(self.CATEGORY_BADGE)
    
    def is_category_badge_selected(self):
        label = self.driver.find_element(*self.CATEGORY_BADGE_LABEL)
        return "bg-accent" in label.get_attribute("class")

    def click_search_button(self):
        element = self.wait_for_element_clickable(self.SEARCH_BUTTON)
        if element is None:
            raise Exception("Search button not found or not clickable")
        self.click_element(self.SEARCH_BUTTON)
        
    def click_inspire_button(self):
        self.click_element(self.INSPIRE_BUTTON)
        
    def is_recipe_card_displayed(self):
        try:
            self.scroll_to_element(self.RECIPE_CARD_1)
            return self.is_element_visible(self.RECIPE_CARD_1)
        except Exception as e:
            print(f"Error checking recipe card visibility: {e}")
            return False

