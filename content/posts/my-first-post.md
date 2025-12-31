+++
title = 'Helpful Git Commands'
date = 2025-11-23T10:00:00-05:00
draft = false
+++

## Quick checks

Use these when you want to see what changed and what is staged.

```bash
git status
git diff
git diff --staged
```

## Staging and committing

Stage a set of files, then commit with a short message.

```bash
git add .
git commit -m "Summarize the change"
```

## Branching and switching

Create a new branch and hop between branches.

```bash
git switch -c feature/short-name
git switch main
```

## Syncing with remotes

Pull updates and send your changes upstream.

```bash
git fetch --all --prune
git pull --rebase
git push origin main
```

## Reading history

Scan logs or inspect a specific commit.

```bash
git log --oneline --decorate --graph --all
git show <commit-sha>
```

## Undoing safely

When in doubt, prefer restore and revert over `git reset --hard`.

```bash
git restore --staged <file>
git restore <file>
git revert <commit-sha>
```
