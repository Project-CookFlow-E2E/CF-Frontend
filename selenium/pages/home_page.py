# pages/home_page.py
from selenium.webdriver.common.by import By

class HomePage:
    def __init__(self, driver):
        self.driver = driver

    def load(self):
        self.driver.get("http://localhost:5173/")

    CATEGORY_BADGE = (By.CLASS_NAME, "cursor-pointer")
    SEARCH_BUTTON = (By.XPATH, "//button[text()='Buscar']")
    INSPIRE_BUTTON = (By.XPATH, "//span[text()='Inspire me']/parent::div")
    RECIPE_CARD = (By.CLASS_NAME, "shadow-lg")

    def click_category_by_name(self, name):
        categories = self.driver.find_elements(*self.CATEGORY_BADGE)
        for cat in categories:
            if cat.text.strip() == name:
                cat.click()
                break

    def click_search(self):
        self.driver.find_element(*self.SEARCH_BUTTON).click()

    def click_inspire_me(self):
        self.driver.find_element(*self.INSPIRE_BUTTON).click()

    def get_recipe_cards(self):
        return self.driver.find_elements(*self.RECIPE_CARD)
