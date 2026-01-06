# Skill Examples

Good and bad examples for skill authoring.

## Good: Concise Quick Start

```markdown
## Quick Start

Extract text from PDF:

```python
import pdfplumber
with pdfplumber.open("file.pdf") as pdf:
    text = pdf.pages[0].extract_text()
```
```

**Why good:** Minimal, assumes agent knows Python basics.

---

## Bad: Over-explained

```markdown
## Quick Start

PDF (Portable Document Format) files are a common file format that contains 
text, images, and other content. To extract text from a PDF, you'll need to 
use a library. There are many libraries available for PDF processing, but we 
recommend pdfplumber because it's easy to use and handles most cases well. 
First, you'll need to install it using pip. Then you can use the code below...
```

**Why bad:** Explains what agent already knows, wastes context.

---

## Good: Workflow with Checklist

```markdown
## Deployment Workflow

Track progress:

```
- [ ] Step 1: Run tests
- [ ] Step 2: Build container
- [ ] Step 3: Push to registry
- [ ] Step 4: Deploy
```

### Step 1: Run Tests
```bash
npm test
```

### Step 2: Build Container
```bash
docker build -t app .
```
```

**Why good:** Copyable checklist, clear steps, concrete commands.

---

## Bad: Vague Instructions

```markdown
## Deployment

First you should run the tests to make sure everything works. Then build 
the container image. After that, push it somewhere and deploy it. Make sure 
to check the logs afterward.
```

**Why bad:** No concrete commands, unclear steps, not trackable.

---

## Good: Progressive Disclosure

```markdown
## Form Filling

Basic fill:
```python
fill_form(pdf, {"name": "John"})
```

**Advanced options:** See [FORMS.md](FORMS.md)
**All parameters:** See [REFERENCE.md](REFERENCE.md)
```

**Why good:** Quick answer upfront, details linked.

---

## Bad: Everything in SKILL.md

```markdown
## Form Filling

[500 lines of every possible parameter, edge case, and variation...]
```

**Why bad:** Bloats context, hard to navigate.

---

## Good: Input/Output Examples

```markdown
## Commit Messages

**Input:** Added user authentication with JWT tokens
**Output:**
```
feat(auth): implement JWT-based authentication

Add login endpoint and token validation middleware
```

**Input:** Fixed bug where dates displayed wrong
**Output:**
```
fix(reports): correct date timezone handling
```
```

**Why good:** Concrete examples show expected format.

---

## Bad: Abstract Descriptions

```markdown
## Commit Messages

Write commit messages that are descriptive and follow conventional 
commit format. Use appropriate types like feat, fix, chore, etc.
```

**Why bad:** Doesn't show HOW, agent must guess format.
