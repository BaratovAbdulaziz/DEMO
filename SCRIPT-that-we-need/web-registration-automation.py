from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
import time
import random
import string
import traceback
import os

def generate_temp_email():
    # Replace this with a real temporary email generator if needed
    return f"user{random.randint(1000, 9999)}@examplemail.com"

def generate_credentials():
    username = "user_" + ''.join(random.choices(string.ascii_lowercase, k=6))
    password = ''.join(random.choices(string.ascii_letters + string.digits, k=12))
    return username, password

def register_on_bolt(temp_email, username, password):
    print("🔧 Registering on Bolt...")
    try:
        browser.get("https://example.com/bolt-signup")  # Replace with real URL
        time.sleep(1)

        # Example form filling
        browser.find_element(By.NAME, "email").send_keys(temp_email)
        browser.find_element(By.NAME, "username").send_keys(username)
        browser.find_element(By.NAME, "password").send_keys(password)
        browser.find_element(By.NAME, "submit").click()

        time.sleep(2)  # Wait for any redirects
        print("✅ Bolt registration successful!")
        return True
    except Exception as e:
        print("❌ Bolt registration failed:", e)
        return False

def register_on_superbase(temp_email, username, password):
    print("🔧 Registering on Superbase...")
    try:
        browser.get("https://example.com/superbase-signup")  # Replace with real URL
        time.sleep(1)

        browser.find_element(By.NAME, "email").send_keys(temp_email)
        browser.find_element(By.NAME, "user").send_keys(username)
        browser.find_element(By.NAME, "pass").send_keys(password)
        browser.find_element(By.NAME, "submit").click()

        time.sleep(2)
        print("✅ Superbase registration successful!")
        return True
    except Exception as e:
        print("❌ Superbase registration failed:", e)
        return False

def save_credentials(email, username, password, bolt_success, superbase_success):
    filename = "credentials.txt"
    with open(filename, "a") as f:
        f.write(f"\nEmail: {email}\nUsername: {username}\nPassword: {password}")
        f.write(f"\nBolt success: {bolt_success}\nSuperbase success: {superbase_success}\n")
        f.write("-" * 40 + "\n")
    return os.path.abspath(filename)

def main():
    global browser
    try:
        print("🚀 Starting browser...")
        options = webdriver.ChromeOptions()
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--headless")  # remove this line if you want to see the browser
        browser = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

        temp_email = generate_temp_email()
        username, password = generate_credentials()

        bolt_success = register_on_bolt(temp_email, username, password)
        superbase_success = register_on_superbase(temp_email, username, password)

        print(f"Superbase registration status: {'Completed' if superbase_success else 'May need manual verification'}")

        creds_file = save_credentials(temp_email, username, password, bolt_success, superbase_success)
        if creds_file:
            print(f"📁 Credentials saved to: {creds_file}")

    except Exception as e:
        print("❌ An unexpected error occurred:", e)
        traceback.print_exc()

    finally:
        if 'browser' in locals():
            print("🧹 Closing browser...")
            browser.quit()

if __name__ == "__main__":
    main()

