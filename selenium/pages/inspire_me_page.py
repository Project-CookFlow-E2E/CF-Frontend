from selenium.webdriver.common.by import By

class InspireMePage:
    def __init__(self, driver):
        self.driver = driver

    def load(self):
        self.driver.get("http://localhost:5173/inspire-me")

    HEADING = (By.XPATH, "//h1[contains(text(), 'Swipe the Dish')]")
    FAVORITE_BUTTON = (By.XPATH, "//button[contains(@aria-label, 'favorite')]")
    SKIP_BUTTON = (By.XPATH, "//button[contains(., 'Skip') or contains(@aria-label, 'skip')]")
    SWIPE_CARD = (By.ID, "SwipeCard")

    def get_heading_text(self):
        return self.driver.find_element(*self.HEADING).text

    def swipe_card_exists(self):
        return len(self.driver.find_elements(*self.SWIPE_CARD)) > 0

    def click_favorite(self):
        self.driver.find_element(*self.FAVORITE_BUTTON).click()

    def click_skip(self):
        self.driver.find_element(*self.SKIP_BUTTON).click()
