from selenium.webdriver.common.by import By

class LandingPage:
    def __init__(self, driver):
        self.driver = driver

    def load(self):
        self.driver.get("http://localhost:5173/main")

    HERO_TITLE = (By.XPATH, "//h1[text()='CookFlow']")
    START_BUTTON = (By.XPATH, "//a[contains(@href, '/signup')]//button[contains(text(), 'Empezar')]")
    RECIPE_CARDS = (By.CLASS_NAME, "shadow-md")
    COOKFLOW_BUTTON = (By.XPATH, "//a[contains(@href, '/signup')]//button[contains(text(), 'A cocinar')]")

    def get_hero_title_text(self):
        return self.driver.find_element(*self.HERO_TITLE).text

    def click_start_button(self):
        self.driver.find_element(*self.START_BUTTON).click()

    def get_recipe_cards(self):
        return self.driver.find_elements(*self.RECIPE_CARDS)

    def click_cookflow_button(self):
        self.driver.find_element(*self.COOKFLOW_BUTTON).click()
