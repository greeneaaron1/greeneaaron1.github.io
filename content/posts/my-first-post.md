+++
title = 'Git workflows I actually use'
date = 2025-11-23T10:00:00-05:00
draft = false
+++

Note: I keep this as a quick cheat sheet and update it whenever I learn a better habit.

This is the guide I wanted when learning how to code and use git. Hope you find it useful too :)

## Typical flow (the one you’ll repeat)

```
git clone                   # get repo (first time)

OR (if you already cloned it)

git pull origin main                  # update local main

git checkout -b new-branch            # create branch

make edits

git diff                              # see what you changed
git status                            # see what’s staged vs not

git add .                             # stage changes
git commit -m “message”               # snapshot commit
git push origin new-branch            # push branch

create PR on GitHub

after merge:

git checkout main
git pull origin main

git branch -D old-branch              # delete local branch
```

## Quick checks (inspect before you touch)

Use these anytime you’re unsure what’s going on.

```bash
git status
```

Shows:
- what branch you’re on
- what’s modified / staged / untracked

```bash
git diff
```

Shows exactly what changed.

```bash
git diff --staged
```

Shows what will be committed.

If you ever feel lost: run `git status`, then `git diff`.

## Staging and undoing (clear + safe)

Stage everything in the current directory:

```bash
git add .
```

Unstage a file (keeps your edits):

```bash
git restore --staged path/to/file
```

Throw away your local edits to that file (restore last committed version):

```bash
git restore path/to/file
```

Tip: run `git diff` first so you see what you’re about to lose.

## Stash: how to “put changes in your pocket”

What it is: a temporary shelf for uncommitted work. Use it when you need to switch branches but you’re not ready to commit.

Main stash workflow (if you made local changes and want to pause them):

```bash
git status
git stash -u            # stashes tracked edits + untracked new files

git checkout other-branch

do whatever you needed on the other branch…

git checkout new-branch
git stash pop           # reapply the stash and remove it from the stash list
```

Helpful stash commands (only the essentials):

```bash
git stash list
git stash apply         # apply stash but keep it in the list
git stash drop          # drop a stash you no longer need
```

Rule of thumb:
- pop = use it and remove it
- apply = use it but keep it

## Quick fixes (common mistakes)

I staged too much:

```bash
git restore --staged .
```

I need to abandon all my local edits in one go (be careful, this discards everything not committed):

```bash
git restore .
```

I need to undo a commit that already exists on the remote (safe for shared branches):

```bash
git log --oneline
git revert <commit-sha>
git push
```

## Minimal command set to remember

- `git pull origin main`
- `git checkout -b <new-branch>`
- `git status`
- `git diff` / `git diff --staged`
- `git add .`
- `git commit -m "msg"`
- `git push origin <branch>`
- `git restore <file>` / `git restore --staged <file>`
- `git stash -u` / `git stash pop` / `git stash list`
- `git branch -D <old-branch>`

## References

- [Nicholas Chen's Git Guide](https://nicholaschen.me/blogs/git)
- [Dangit, Git!](https://dangitgit.com/)
- [Zach Greathouse](https://github.com/zgreathouse)
