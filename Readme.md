# 🧠 AI Automated Blog

An intelligent agent to automate the end-to-end deployment of blog content — from setup to publication across Blogger, LinkedIn, BlueSky and track progress in a Google Spreadsheet file.
The whole integration is done  via MCP (Model Context Protocol) or regular code, depending when it's more appropriate.
It's a good example of how an IDE (for example with Cline) can be turn in a Agent creation and management platform.

---

## 🚀 Quick Start

1. **Initialize the project**

   Run the setup script:

   ```bash
   node setup_dir.js
   ```

2. **Add your content**

   Copy/paste your AI-generated content into the correct locations:

   * 📝 Blog article → `blog/article.md`
   * 🖼️ Image → `assets/image.jpg` (**1200×630 pixels** required)
   * 📱 Social media text → `social/text.txt`

3. **Start the agent in Cline**

   In your Cline terminal, type:

   ```
   Let's work on article
   ```

   The agent will take over from there and guide the publishing process.

---

## 📄 Full Workflow & Agent Details

See [agent.md](./agent.md) for a complete breakdown of how the agent works, what it automates, and how to extend it.

---

## 🛠️ About

This project is designed to streamline AI-assisted blog publishing by minimizing manual steps:

* AI-generated content (article, image, social text)
* Structured folder setup
* Step-by-step orchestration by an agent using Cline

