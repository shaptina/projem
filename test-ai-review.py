"""
Test file for AI code review
This file contains intentional issues for AI to detect
"""

import os
import sys

# Security issue: Hardcoded password
PASSWORD = "admin123"
API_KEY = "sk-proj-12345abcdef"

# SQL Injection vulnerability
def get_user(user_id):
    query = f"SELECT * FROM users WHERE id = {user_id}"  # SQL injection risk
    return query

# Performance issue: Inefficient loop
def slow_function(data):
    result = []
    for i in range(len(data)):  # Should use enumerate or direct iteration
        for j in range(len(data)):
            if data[i] == data[j]:
                result.append(data[i])
    return result

# Memory leak potential
class MemoryLeaker:
    def __init__(self):
        self.big_data = []
    
    def add_data(self, item):
        self.big_data.append(item * 1000000)  # Never cleared

# Turkish localization issue
def get_message(lang):
    if lang == "tr":
        return "Merhaba Dunya"  # Missing Turkish character: Dünya
    return "Hello World"

# Unused variable
def calculate():
    x = 10
    y = 20
    z = 30  # Unused variable
    return x + y

# Missing error handling
def risky_operation():
    file = open("important.txt", "r")  # No try-except, no close
    data = file.read()
    return data

# Type hint issues
def process_data(data):  # Missing type hints
    return data * 2

# Bug: Division by zero
def divide(a, b):
    return a / b  # No check for b == 0

if __name__ == "__main__":
    # Test the functions
    print(get_user("1; DROP TABLE users;"))
    print(slow_function([1, 2, 3, 1, 2]))
    print(divide(10, 0))  # Will crash