# README – **Blog Factory Agent**

This agent, executed through **Cline** in VS Code, automates operations to publish a blog post, promote it on social network and update a spreadsheet used to track the progress
Before calling for you, the user will have created the project layout directory using setup_dir.js '<blog title>' and will have stored an image in the images directory with the size of 1200 pixels wide × 630 pixels high

**Publish** the post on Blogger.
**Promote** it on LinkedIn (with image) and Bluesky (without image).
**Update** the Google Sheet with all generated links and dates.

All run‑time data for a given article lives in a single file: `BlogDataTracking.json` located in the article’s folder.

When the user ask you something similar to:
"Work on the blog <blog title>> you will find the correct <slug> directory in <userhome>/Documents/VS Code/Dev/AI Automated Blog/Blogs content. upload the image to Google Cloud, publish the blog to blogger, communicate on Bluesky and LinkedIn and update the spreadsheet.  Try to run everything in an automated way.

---

## 1  Project layout

```
<userhome>/Documents/VS Code/Dev/AI Automated Blog/Blogs content
 └─ <slug>/                # lower‑case, no accents, words separated by dashes
    ├─ blogContent.md       # markdown body (NO title line)
    ├─ SocialNetworkPost.md # markdown body
    ├─ BlogDataTracking.json# metadata generated during the workflow
    └─ images/              # images you drop here from outside VS Code
```

---

## 2  Environment variables (`.env`)

```env
# Google Cloud Storage
BUCKET_NAME=chatbot-uploads-17191
GOOGLE_APPLICATION_CREDENTIALS=key.json

# Google Sheets
GoogleSheetsAccount=shaunavmw@gmail.com
Drive=My Google Drive
Spreadsheet=1QPpaHXCfu5oHl8yu6WGls_sNGEQ_IpPMCjNPj8Hh-QI
Worksheet=Feuille 1

# Tracking file name (do NOT change)
BlogTrackingFile=BlogDataTracking.json
```
You need to read the .env file

> **Never** print secret values to the console or logs.

---

## 3  Available MCP tools

| Provider | Tool name                              | Purpose                                            |
| -------- | -------------------------------------- | -------------------------------------------------- |
| Zapier   | `google_sheets_lookup_spreadsheet_row` | 
| Zapier   | `google_sheets_update_spreadsheet_row` | Write publication info back to the sheet           |
| Zapier   | `linkedin_create_share_update`         | Share on LinkedIn                                  |
| Make     | `scenario_5079639_integration_blogger` | Publish to Blogger                                 |
| Make     | `scenario_5116851_integration_bluesky` | Post on Bluesky                                    |

Screenshots of the parameter lists are available above for quick reference.

---

## 4  Workflow in detail

If the user give the row number of the blog in the spreadsheet file, Save the row number in `BlogDataTracking.json` :

```json
{ "sheetRow": 42 }
```

### 4.Upload image

1.  The user has dropped images into `<slug>/images/`.
2. Upload each file:

   ```bash
   node upload.js --file <slug>/images/hero.png
   ```

### 4.5 Embed a header image (optional)

Once the previous step is done, 

### 4.6 Publish on Blogger

* Convert markdown → HTML by yourself. Do not use external tool. 
* SEO Enhancements to apply during Markdown → HTML conversion
**Apply Proper Heading Structure**
Ensure only **one ************************`<h1>`************************ tag** is used (for the main title). Use `<h2>`, `<h3>`, etc., for subheadings to reflect the logical structure of the content.
**SEO-Friendly URL Slug**
If possible, use a clean and descriptive slug (e.g., `from-chat-to-action-gen-ai-revolution`) instead of generic or numeric suffixes.
**de Alt Text for Images**
For every `<img>` tag, include an `alt="..."` attribute with a relevant and descriptive phrase related to the blog content
**Ensure Keyword Usage**
   Maintain a **keyword density of around 1.3%** for the focus keyword, and include it within:

   * The `<title>` tag
   * The first 100 words
   * At least one subheading
   * The meta description
**Mobile-Friendly Layout**
     Ensure responsive HTML output (using `%`-based widths, flexible image styles) so the article displays properly on all screen sizes.

* insert the following HTML snippet at the top  (replace `${url}` with the url of the image in the BlogDataTracking.json):

```html
<div class="separator" style="clear: both; text-align: center;">
  <a href="${url}" imageanchor="1" style="margin-left: 1em; margin-right: 1em;">
    <img border="0"
         data-original-width="1200"
         data-original-height="630"
         width="100%"
         style="max-width:1200px;height:auto;"
         src="${url}" />
  </a>
</div>
```
* Call `scenario_5079639_integration_blogger`:

  ```json
  { "BlogTitle": "<approved title to retrieve from BlogDataTracking.json>", "BlogContent": "<HTML payload>" }
  ```
* Record the returned URL in `BlogDataTracking.json. If the URL is not returned by the tool, request it at the user

  ```json
  { "blogArticle": { "name": "<title>", "url": "https://..." } }
  ```

### 4.7 Share on LinkedIn (with image)

Prepare the payload. For the content_description, use the file SocialNetworkPost.md:

```json
{
  "instructions": "Share this article on LinkedIn",
  "comment": "<catchy teaser>",
  "visibility__code": "Anyone",
  "content__title": "<title>",
  "content__description": "<short description> to retrieve from SocialNetworkPost.md",
  "content__submitted_image_url": "${images[0].url}",
  "content__submitted_url": "${blogArticle.url}"
}
```

Call `linkedin_create_share_update`. Then store the returned URL in **BlogDataTracking.json**:

```json
{ "linkedInPostUrl": "https://..." }
```

### 4.8 Post on Bluesky (no image)

Prepare the payload. For the LinkDescription, use the file SocialNetworkPost.md:

```json
{
  "PostContent": "<catchy teaser>",
  "Link": "${blogArticle.url}",
  "LinkTitle": "<title>",
  "LinkDescription": "<short description to read from SocialNetworkPost.md>"
}
```

Call `scenario_5116851_integration_bluesky`. Then start the script retrieveBlueSKyURL.js with the "AT_URI" as input like this
node .\retrieveBlueSKyURL.js 'at://did:plc:b62m2vjha2t6p6jw7il6elpi/app.bsky.feed.post/3lp6jgpe4ug2z'
It will return a URL like this:
https://bsky.app/profile/tibhgh.bsky.social/post/3lp6jgpe4ug2z

store the returned URL in **BlogDataTracking.json**:

```json
{ "blueSkyPostUrl": "https://..." }
```

### 4.9 Update the Google Sheet

Use **`google_sheets_lookup_spreadsheet_row`** to search in the Google Spreadsheet the row number of the row containing the <title> (to extract from BlogDatatracking.json)
```json
{
  "instructions": "Find the row in the worksheet 'Feuille 1' where the Title column equals 'From Chat to Action: The New Gen AI Revolution'.",
  "drive": "My Google Drive",
  "spreadsheet": "1QPpaHXCfu5oHl8yu6WGls_sNGEQ_IpPMCjNPj8Hh-QI",
  "worksheet": "Feuille 1",
  "lookup_key": "Title",
  "lookup_value": "From Chat to Action: The New Gen AI Revolution"
}
```

Use **`google_sheets_update_spreadsheet_row`**

Example payload (the one that worked):

```json
{
  {
  "instructions": "Update row number 4 in the Google Sheet. The sheet is named 'Feuille 1', within spreadsheet ID '1QPpaHXCfu5oHl8yu6WGls_sNGEQ_IpPMCjNPj8Hh-QI', located in 'My Google Drive'. The data to update in this row is: set the 'Title' column to 'From Chat to Action: The New Gen AI Revolution', 'Summary' column to 'There are 2 new buzz words in the Gen AI space: Agents and MCP. ...', 'Status' column to 'Published', 'Date published' column to '15/5/25', 'Blog Link' column to 'https://vincent-ai.blogspot.com/2025/05/the-rise-of-action-based-ai-mastering.html', 'BlueSky Link' column to 'https://bsky.app/profile/tibhgh.bsky.social/post/3lp7zzlu4ti2z', and 'LinkedIn Link' column to 'https://www.linkedin.com/feed/update/urn:li:share:7328832988134937600/'.",
  "drive": "My Google Drive",
  "spreadsheet": "1QPpaHXCfu5oHl8yu6WGls_sNGEQ_IpPMCjNPj8Hh-QI",
  "worksheet": "Feuille 1",
  "row": "4",  
  "Title": "From Chat to Action: The New Gen AI Revolution",
  "Summary": "There are 2 new buzz words in the Gen AI space: Agents and MCP. ...",
  "Status": "Published",
  "Date published": "15/5/25",
  "Blog Link": "https://vincent-ai.blogspot.com/2025/05/the-rise-of-action-based-ai-mastering.html",
  "BlueSky Link": "https://bsky.app/profile/tibhgh.bsky.social/post/3lp7zzlu4ti2z",
  "LinkedIn Link": "https://www.linkedin.com/feed/update/urn:li:share:7328832988134937600/"
}

```

**JSON source mapping**

| Column in Sheet | Field in `BlogDataTracking.json` |
| --------------- | -------------------------------- |
| Blog link       | `blogArticle.url`                |
| Bluesky link    | `blueSkyPostUrl`                 |
| LinkedIn link   | `linkedInPostUrl`                |

> Make sure the string contains **exactly the same number of columns** as your sheet, otherwise the update will fail.

## 5  Error handling & fallback  Error handling & fallback

> **If something goes wrong, report the error, analyse potential causes, and suggest concrete fixes.**


