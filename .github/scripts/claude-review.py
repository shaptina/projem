#!/usr/bin/env python3
"""
Claude AI Code Review Script for GitHub Actions
Analyzes code changes and provides intelligent feedback
"""

import os
import json
import sys
from pathlib import Path
import anthropic
import git
from typing import List, Dict, Any

class ClaudeCodeReviewer:
    def __init__(self):
        self.client = anthropic.Anthropic(
            api_key=os.environ.get("ANTHROPIC_API_KEY")
        )
        self.repo = git.Repo(".")
        self.github_token = os.environ.get("GITHUB_TOKEN")
        
    def get_changed_files(self) -> List[Dict[str, Any]]:
        """Get list of changed files in the commit/PR"""
        changed_files = []
        
        # Get diff between current and previous commit
        if os.environ.get("GITHUB_EVENT_NAME") == "pull_request":
            # For PRs, compare with base branch
            base_ref = os.environ.get("GITHUB_BASE_REF", "main")
            diff = self.repo.git.diff(f"origin/{base_ref}...HEAD", name_status=True)
        else:
            # For pushes, compare with previous commit
            diff = self.repo.git.diff("HEAD~1..HEAD", name_status=True)
        
        for line in diff.split('\n'):
            if line:
                parts = line.split('\t')
                if len(parts) >= 2:
                    status, filepath = parts[0], parts[1]
                    if Path(filepath).exists():
                        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                            content = f.read()
                        changed_files.append({
                            'path': filepath,
                            'status': status,
                            'content': content
                        })
        
        return changed_files
    
    def analyze_code(self, files: List[Dict[str, Any]]) -> str:
        """Send code to Claude for analysis"""
        if not files:
            return "No files to analyze"
        
        # Prepare context for Claude
        context = "You are reviewing code changes for a FreeCAD-based CNC/CAM/CAD production platform with Turkish UI/UX. Please analyze the following files for:\n\n"
        context += "1. Security vulnerabilities\n"
        context += "2. Performance issues\n"
        context += "3. Code quality and best practices\n"
        context += "4. Potential bugs\n"
        context += "5. Turkish localization issues\n"
        context += "6. FreeCAD integration problems\n\n"
        context += "Changed files:\n\n"
        
        for file in files[:10]:  # Limit to 10 files to avoid token limits
            context += f"File: {file['path']} (Status: {file['status']})\n"
            context += f"```{Path(file['path']).suffix[1:]}\n"
            context += file['content'][:5000]  # Limit content length
            context += "\n```\n\n"
        
        context += "\nPlease provide specific, actionable feedback in Turkish. Format your response as GitHub markdown."
        
        # Call Claude API
        message = self.client.messages.create(
            model="claude-3-opus-20240229",
            max_tokens=4000,
            temperature=0.3,
            messages=[
                {"role": "user", "content": context}
            ]
        )
        
        return message.content[0].text
    
    def post_review_comment(self, review_text: str):
        """Post review as GitHub comment"""
        import requests
        
        # Get PR/commit info from environment
        if os.environ.get("GITHUB_EVENT_NAME") == "pull_request":
            # Post to PR
            pr_number = os.environ.get("GITHUB_PR_NUMBER")
            if pr_number:
                repo = os.environ.get("GITHUB_REPOSITORY")
                url = f"https://api.github.com/repos/{repo}/issues/{pr_number}/comments"
                
                headers = {
                    "Authorization": f"token {self.github_token}",
                    "Accept": "application/vnd.github.v3+json"
                }
                
                data = {
                    "body": f"## 🤖 Claude AI Code Review\n\n{review_text}"
                }
                
                response = requests.post(url, headers=headers, json=data)
                if response.status_code == 201:
                    print("✅ Review posted successfully!")
                else:
                    print(f"❌ Failed to post review: {response.status_code}")
        else:
            # For push events, just output to console
            print("\n" + "="*50)
            print("CLAUDE AI CODE REVIEW")
            print("="*50)
            print(review_text)
    
    def run(self):
        """Main execution"""
        print("🔍 Claude Code Reviewer starting...")
        
        # Get changed files
        changed_files = self.get_changed_files()
        print(f"📁 Found {len(changed_files)} changed files")
        
        if not changed_files:
            print("✅ No files to review")
            return
        
        # Analyze with Claude
        print("🤖 Analyzing with Claude AI...")
        review = self.analyze_code(changed_files)
        
        # Post review
        self.post_review_comment(review)
        
        # Also save to file for artifact
        with open("claude-review.md", "w", encoding="utf-8") as f:
            f.write(review)
        
        print("✅ Review complete!")

if __name__ == "__main__":
    try:
        reviewer = ClaudeCodeReviewer()
        reviewer.run()
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)