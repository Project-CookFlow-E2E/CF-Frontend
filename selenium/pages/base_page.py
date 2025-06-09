from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException

class BasePage:
    def __init__(self, driver):
        self.driver = driver
        self.wait = WebDriverWait(driver, 10)
    
    def go_to(self, url):
        """Navigate to URL"""
        self.driver.get(url)
    
    def get_current_url(self):
        """Get current page URL"""
        return self.driver.current_url
    
    def wait_for_element(self, locator):
        """Wait for element to be present"""
        try:
            return self.wait.until(EC.presence_of_element_located(locator))
        except TimeoutException:
            return None
    
    def wait_for_element_visible(self, locator):
        """Wait for element to be visible"""
        try:
            return self.wait.until(EC.visibility_of_element_located(locator))
        except TimeoutException:
            return None
    
    def wait_for_element_clickable(self, locator):
        """Wait for element to be clickable"""
        try:
            return self.wait.until(EC.element_to_be_clickable(locator))
        except TimeoutException:
            return None
    
    def get_element(self, locator):
        """Get element by locator"""
        return self.driver.find_element(*locator)

    def get_elements(self, locator):
        """Get multiple elements by locator"""
        return self.driver.find_elements(*locator)

    
    def get_text(self, locator):
        """Get text from element"""
        element = self.wait_for_element(locator)
        return element.text if element else ""
    
    def click_element(self, locator):
        """Click element with scroll and retry"""
        element = self.wait_for_element_clickable(locator)
        if element:
            self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", element)
            import time
            time.sleep(0.5)
            try:
                element.click()
            except:
                self.driver.execute_script("arguments[0].click();", element)
    
    def is_element_visible(self, locator):
        """Check if element is visible"""
        try:
            element = self.wait_for_element(locator)
            return element.is_displayed() if element else False
        except:
            return False 
    
    def get_element_attribute(self, locator, attribute):
        """Get attribute value from element"""
        element = self.wait_for_element(locator)
        return element.get_attribute(attribute) if element else ""
    
    def wait_for_url_contains(self, text):
        """Wait for URL to contain specific text"""
        try:
            self.wait.until(EC.url_contains(text))
            return True
        except TimeoutException:
            return False

    def scroll_to_element(self, locator, max_scrolls=10, scroll_pause=0.5):
        """Scrolls down the page until the element is visible or max_scrolls reached"""
        import time

        for i in range(max_scrolls):
            try:
                element = self.driver.find_element(*locator)
                if element.is_displayed():
                    return element
            except:
                pass  # Ignore if not found

            self.driver.execute_script("window.scrollBy(0, window.innerHeight);")
            time.sleep(scroll_pause)

        return None
