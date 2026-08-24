# Pushing this to GitHub from your PC

Written for someone who has never used Git before. Follow it top to bottom once; after that, the only part you'll repeat is [Step 7](#step-7-making-changes-later).

Anything in `CAPITALS` is a placeholder you replace with your own value.

---

## Step 1 — Install Git

**Windows** — download from <https://git-scm.com/download/win>. Run the installer and click Next through every screen; the defaults are fine. This also installs **Git Bash**, a terminal you'll use in a moment.

**macOS** — open Terminal and type `git --version`. If Git isn't installed, macOS offers to install it. Accept.

**Linux** — `sudo apt install git` (Ubuntu/Debian) or `sudo dnf install git` (Fedora).

Now open a terminal — **Git Bash** on Windows, **Terminal** on macOS or Linux — and check it worked:

```bash
git --version
```

You should see something like `git version 2.45.1`. If you get "command not found", close the terminal, open a new one, and try again.

---

## Step 2 — Tell Git who you are

This name and email get attached to every change you save. Use the same email as your GitHub account.

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

Also set the default branch name to `main`, which is what GitHub and the deploy workflow expect:

```bash
git config --global init.defaultBranch main
```

---

## Step 3 — Put the project folder somewhere sensible

Unzip `halfseam-store` and move it wherever you keep your work — for example `Documents\projects\halfseam-store` on Windows, or `~/projects/halfseam-store` on macOS or Linux.

Then move your terminal into that folder using `cd` ("change directory"):

```bash
cd ~/projects/halfseam-store
```

On Windows with Git Bash, the path looks like this:

```bash
cd /c/Users/YOUR-WINDOWS-NAME/Documents/projects/halfseam-store
```

> **Shortcut:** in Windows File Explorer, right-click inside the folder and choose **Open Git Bash here** — that skips the `cd` entirely. On macOS, right-click the folder → Services → New Terminal at Folder.

Check you're in the right place:

```bash
ls
```

You should see `index.html`, `css`, `js`, `README.md`. If you don't, you're in the wrong folder.

---

## Step 4 — Create the repository on GitHub

1. Sign in at <https://github.com>. If you don't have an account, make one — it's free.
2. Click the **+** in the top-right corner → **New repository**.
3. **Repository name:** `halfseam-store` (or whatever you like — just remember it).
4. **Public** or **Private:** choose Public. GitHub Pages needs a paid plan to publish from a private repo.
5. **Leave every checkbox unticked.** Do not add a README, .gitignore or licence — you already have all three, and adding them here causes a conflict on your first push.
6. Click **Create repository**.

GitHub now shows you a page of setup commands. Ignore it; the next step covers the same ground more carefully.

---

## Step 5 — Turn your folder into a repository and make the first commit

Back in your terminal, in the project folder, run these one at a time:

```bash
git init
```

Creates a hidden `.git` folder. This is the repository — it's what tracks your history.

```bash
git add .
```

Stages every file, meaning "include these in the next save". The `.` means "everything in this folder". Files listed in `.gitignore` are skipped automatically.

```bash
git commit -m "Initial commit: Halfseam storefront"
```

Saves a snapshot. The text after `-m` is the message describing what changed — you'll write a new one each time.

Check what happened:

```bash
git status
```

`nothing to commit, working tree clean` means everything is saved locally. It is not on GitHub yet.

---

## Step 6 — Connect to GitHub and push

Tell Git where your GitHub repository lives. Replace `YOUR-USERNAME` with your actual GitHub username:

```bash
git remote add origin https://github.com/YOUR-USERNAME/halfseam-store.git
```

`origin` is just a nickname for that address. Confirm it's right:

```bash
git remote -v
```

Now rename your branch to `main` and push:

```bash
git branch -M main
git push -u origin main
```

**A login window will appear.** Sign in with your GitHub account in the browser window that opens, and allow access. Git remembers this, so you only do it once.

> **If no window appears and it asks for a password in the terminal:** GitHub stopped accepting account passwords for this in 2021. You need a *personal access token* instead. Go to <https://github.com/settings/tokens> → **Generate new token (classic)** → tick the **repo** box → generate → copy the token. Paste it where Git asks for a password. (Nothing appears as you paste — that's normal, just press Enter.) Save the token somewhere safe; GitHub never shows it again.

Refresh your repository page on GitHub. Your files are there.

The `-u` flag in that command means from now on you can just type `git push` with nothing after it.

---

## Step 7 — Turn on GitHub Pages

Your first push already started the deploy workflow, but Pages needs to be switched on once:

1. On your repository page, click **Settings**.
2. In the left sidebar, click **Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.

That's it. Click the **Actions** tab to watch the deploy run — a green tick means done, usually inside a minute. Your site is now live at:

```
https://YOUR-USERNAME.github.io/halfseam-store/
```

The very first deploy can take a few minutes to become reachable. If you get a 404 straight away, wait five minutes and reload.

---

## Making changes later

This is the loop you'll use from now on. Edit your files, then:

```bash
git add .
git commit -m "Describe what you changed"
git push
```

Three commands, every time. The site rebuilds and goes live automatically about a minute after the push.

Good commit messages describe the change, not the file: `"Add three new men's shirts"` beats `"update app.js"`.

---

## Commands worth knowing

| Command | What it does |
| --- | --- |
| `git status` | What's changed and what's staged. Run it whenever you're unsure. |
| `git log --oneline` | Your commit history, newest first. Press `q` to exit. |
| `git diff` | Shows exactly what you changed since the last commit. `q` to exit. |
| `git pull` | Downloads changes made on GitHub (or another PC) into your folder. |
| `git restore FILENAME` | Throws away your unsaved edits to that file. Careful — no undo. |

---

## When something goes wrong

**`fatal: not a git repository`**
You're in the wrong folder. `cd` into the project folder and try again.

**`Support for password authentication was removed`**
Use a personal access token instead of your password — see the note in Step 6.

**`Updates were rejected because the remote contains work that you do not have locally`**
GitHub has something your PC doesn't, usually because you ticked "Add a README" in Step 4. Fix it with:

```bash
git pull origin main --allow-unrelated-histories
```

Resolve any conflicts it reports, then `git push` again.

**`error: remote origin already exists`**
You ran `git remote add` twice. Point it at the right address instead:

```bash
git remote set-url origin https://github.com/YOUR-USERNAME/halfseam-store.git
```

**The site is live but looks unstyled**
The CSS path is case-sensitive on GitHub's servers even though it isn't on Windows. Check that the folder really is `css/styles.css`, all lowercase, matching what `index.html` asks for.

**A terminal opens a strange editor asking for a message**
That's Vim. Type `:q` and press Enter to leave. Then redo your command with `-m "your message"` included.

---

## Prefer clicking to typing?

Install **GitHub Desktop** from <https://desktop.github.com>, then: **File → Add local repository** → pick your `halfseam-store` folder → **Publish repository**. After that, every change shows up in the left panel; write a summary, click **Commit to main**, then **Push origin**. Steps 1–3 and Step 7 above still apply.
