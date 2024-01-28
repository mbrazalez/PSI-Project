import unittest
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class TestProcessChess(unittest.TestCase):
    @classmethod
    def setUp(self):
        self.driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
        self.driver.get("https://procesos-bnruumvxca-ew.a.run.app")
          
    @classmethod
    def tearDown(self):
        self.driver.close()

    def test_login_correct(self):
        self.login(username="test@test.es", password="test", loginSuccess=True)
        welcome_text_element = self.driver.find_element(By.XPATH, '//*[contains(text(), "Welcome to ProcessChess!")]')
        self.assertTrue(welcome_text_element.is_displayed())
    
    def test_login_incorrect(self):
        self.login(username="error@test.es", password="error", loginSuccess=False)
        error_text_element = self.driver.find_element(By.XPATH, '//*[contains(text(), "The introduced data is not correct, please try it again.")]')
        self.assertTrue(error_text_element.is_displayed())
       
    def test_create_game_left(self):
        self.create_game(username="test@test.es", password="test", loginSuccess=True)
        game_creation_msg = self.driver.find_element(By.TAG_NAME, 'h1').text
        self.assertTrue(str(game_creation_msg), "Game created successfully")
        leave_game_button = self.driver.find_element(By.XPATH,'/html/body/div[1]/div[4]/div/div/div/div/div[2]/button[2]')
        leave_game_button.click()
        game_list = self.driver.find_element(By.ID, 'gameContainer')
        self.assertFalse(game_list.is_displayed())
    
    def test_game_and_join_using_code(self):
        game_code = self.create_game(username="test@test.es", password="test", loginSuccess=True)
        #Join game
        self.driver2 = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
        self.driver2.get("https://procesos-bnruumvxca-ew.a.run.app")  
        WebDriverWait(self.driver2, 10).until(EC.element_to_be_clickable((By.ID, 'login-link'))).click()
        WebDriverWait(self.driver2, 10).until(EC.visibility_of_element_located((By.ID, 'email')))
        user_input = self.driver2.find_element(By.ID, 'email')
        password_input = self.driver2.find_element(By.ID, 'pwd')
        user_input.send_keys('test@test2.es')
        password_input.send_keys('test2')
        login_button = self.driver2.find_element(By.ID, 'btnLogin')
        login_button.click()
        WebDriverWait(self.driver2, 10).until(EC.visibility_of_element_located((By.XPATH, '//*[contains(text(), "Welcome to ProcessChess!")]')))
        join_game_button = self.driver2.find_element(By.ID, 'btnJoinGame')
        join_game_button.click()
        WebDriverWait(self.driver2, 10).until(EC.visibility_of_element_located((By.ID, 'code')))
        code_input = self.driver2.find_element(By.ID, 'code')
        code_input.send_keys(game_code)
        join_game_button = self.driver2.find_element(By.XPATH,'/html/body/div[1]/div[4]/div/div/div[3]/form/div/button')
        join_game_button.click()
        WebDriverWait(self.driver2, 10).until(EC.visibility_of_element_located((By.ID, 'gameContainer')))
        self.assertTrue(self.driver.find_element(By.ID, "gameContainer").is_displayed())
        self.assertTrue(self.driver2.find_element(By.ID, "gameContainer").is_displayed())
        left_game_button = self.driver2.find_element(By.XPATH,'/html/body/nav/div/div/ul/li[3]/a')
        left_game_button.click()
        left_game_button = self.driver.find_element(By.XPATH,'/html/body/nav/div/div/ul/li[3]/a')
        left_game_button.click()
        WebDriverWait(self.driver, 10).until(EC.visibility_of_element_located((By.ID, 'gameMenu')))
        WebDriverWait(self.driver2, 10).until(EC.visibility_of_element_located((By.ID, 'gameMenu')))
        self.assertFalse(self.driver.find_element(By.ID, "gameContainer").is_displayed())
        self.assertFalse(self.driver2.find_element(By.ID, "gameContainer").is_displayed())
        self.driver2.close()

    
    def test_game_and_join_using_code_write_in_chat(self):
        game_code = self.create_game(username="test@test.es", password="test", loginSuccess=True)
        #Join game
        self.driver2 = webdriver.Chrome(service=Service(ChromeDriverManager().install()))
        self.driver2.get("https://procesos-bnruumvxca-ew.a.run.app")  
        WebDriverWait(self.driver2, 10).until(EC.element_to_be_clickable((By.ID, 'login-link'))).click()
        WebDriverWait(self.driver2, 10).until(EC.visibility_of_element_located((By.ID, 'email')))
        user_input = self.driver2.find_element(By.ID, 'email')
        password_input = self.driver2.find_element(By.ID, 'pwd')
        user_input.send_keys('test@test2.es')
        password_input.send_keys('test2')
        login_button = self.driver2.find_element(By.ID, 'btnLogin')
        login_button.click()
        WebDriverWait(self.driver2, 10).until(EC.visibility_of_element_located((By.XPATH, '//*[contains(text(), "Welcome to ProcessChess!")]')))
        join_game_button = self.driver2.find_element(By.ID, 'btnJoinGame')
        join_game_button.click()
        WebDriverWait(self.driver2, 10).until(EC.visibility_of_element_located((By.ID, 'code')))
        code_input = self.driver2.find_element(By.ID, 'code')
        code_input.send_keys(game_code)
        join_game_button = self.driver2.find_element(By.XPATH,'/html/body/div[1]/div[4]/div/div/div[3]/form/div/button')
        join_game_button.click()
        WebDriverWait(self.driver2, 10).until(EC.visibility_of_element_located((By.ID, 'gameContainer')))
        self.assertTrue(self.driver.find_element(By.ID, "gameContainer").is_displayed())
        self.assertTrue(self.driver2.find_element(By.ID, "gameContainer").is_displayed())
        #Write in chat
        self.driver.find_element(By.ID, 'inputChat').send_keys('Hello')
        self.driver.find_element(By.XPATH,'/html/body/div[1]/div[6]/div[2]/div/div[4]/form/div/div/button').click()
        WebDriverWait(self.driver2, 10).until(EC.visibility_of_element_located((By.XPATH, '//*[contains(text(), "Hello")]')))
        message = self.driver2.find_element(By.XPATH, '//*[contains(text(), "Hello")]').text
        left_game_button = self.driver2.find_element(By.XPATH,'/html/body/nav/div/div/ul/li[3]/a')
        left_game_button.click()
        left_game_button = self.driver.find_element(By.XPATH,'/html/body/nav/div/div/ul/li[3]/a')
        left_game_button.click()
        WebDriverWait(self.driver, 10).until(EC.visibility_of_element_located((By.ID, 'gameMenu')))
        WebDriverWait(self.driver2, 10).until(EC.visibility_of_element_located((By.ID, 'gameMenu')))
        self.assertFalse(self.driver.find_element(By.ID, "gameContainer").is_displayed())
        self.assertFalse(self.driver2.find_element(By.ID, "gameContainer").is_displayed())
        self.driver2.close()
        assert message == 'Hello'
    
    def test_game_vs_computer_and_leave(self):
        self.login(username="test@test.es", password="test", loginSuccess=True)
        create_game_button = self.driver.find_element(By.ID, 'btnVsComputer')
        create_game_button.click()
        WebDriverWait(self.driver, 10).until(EC.visibility_of_element_located((By.ID, 'gameContainer')))
        self.assertTrue(self.driver.find_element(By.ID, "gameContainer").is_displayed())
        self.assert_(self.driver.find_element(By.XPATH, '//*[contains(text(), "You are playing against the computer, you will receive just messages about the game status")]').is_displayed())
        left_game_button = self.driver.find_element(By.XPATH,'/html/body/nav/div/div/ul/li[3]/a')
        left_game_button.click()
        WebDriverWait(self.driver, 10).until(EC.visibility_of_element_located((By.ID, 'gameMenu')))
        self.assertFalse(self.driver.find_element(By.ID, "gameContainer").is_displayed())
    
    def test_log_out(self):
        self.login(username="test@test.es", password="test", loginSuccess=True)
        log_out_button = self.driver.find_element(By.XPATH,'/html/body/nav/div/div/ul/li[4]/a')
        log_out_button.click()
        WebDriverWait(self.driver, 10).until(EC.visibility_of_element_located((By.ID, 'iniText')))
        assert self.driver.find_element(By.ID, "iniText").is_displayed()


    # Auxiliary methods
    def login(self, username, password, loginSuccess):
        WebDriverWait(self.driver, 10).until(EC.element_to_be_clickable((By.ID, 'login-link'))).click()
        # Wait for the login form to be visible
        WebDriverWait(self.driver, 10).until(EC.visibility_of_element_located((By.ID, 'email')))
        user_input = self.driver.find_element(By.ID, 'email')
        password_input = self.driver.find_element(By.ID, 'pwd')
        user_input.send_keys(username)
        password_input.send_keys(password)
        # Wait for the login button to be clickable
        WebDriverWait(self.driver, 10).until(EC.element_to_be_clickable((By.ID, 'btnLogin'))).click()
        # Wait for the welcome text to be visible
        if loginSuccess:
            WebDriverWait(self.driver, 10).until(EC.visibility_of_element_located((By.XPATH, '//*[contains(text(), "Welcome to ProcessChess!")]')))
        if not loginSuccess:
            WebDriverWait(self.driver, 10).until(EC.visibility_of_element_located((By.XPATH, '//*[contains(text(), "The introduced data is not correct, please try it again.")]')))

    def create_game(self, username, password, loginSuccess):
        self.login(username, password, loginSuccess)
        create_game_button = self.driver.find_element(By.ID, 'btnCreateGame')
        create_game_button.click()
        # Wait for the create game form to be visible
        WebDriverWait(self.driver, 10).until(EC.element_to_be_clickable((By.TAG_NAME, 'h1')))
        return str(self.driver.find_element(By.ID, "gameCodeValue").text)

if __name__ == '__main__':
    unittest.main()
