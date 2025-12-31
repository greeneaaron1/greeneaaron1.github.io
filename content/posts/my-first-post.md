+++
title = 'Git workflows for beginners'
date = 2025-12-23T10:00:00-05:00
draft = false
+++

This is the guide I always wanted while learning how to code and use git -- I'll make changes and add to it as I learn more. Hope you find it useful too!

## Typical flow (for 90% of cases)

```
git clone                   # get repo (first time)

OR (if you already cloned it)

git pull origin main                  # update local main

git checkout -b new-branch            # create branch

[make edits]

git diff                              # (optional) see what you changed
git status                            # (optional) see what’s staged vs not

git add .                             # stage changes
git commit -m “message”               # snapshot commit
git push origin new-branch            # push branch

[create PR on GitHub]

after merging the PR:

git checkout main
git pull origin main

git branch -D old-branch              # delete local branch
```

## Quick checks

Use these when you’re unsure what’s going on.

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

## Staging and undoing changes

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

BTW, run `git diff` first so you see what you’re about to lose.

## Git Stash: great way to shelve your current changes

Use it when you need to switch branches but you’re not ready to commit.

Main stash workflow (if you made local changes and want to pause them):

```bash
git status
git stash -u            # stashes tracked edits + untracked new files

git checkout other-branch

do whatever you needed on the other branch…

git checkout new-branch
git stash pop           # reapply the stash and remove it from the stash list
```

Pulling main safely when you have local changes (stash > rebase pull > unstash):

```bash
git status
git stash push -u -m "WIP before pulling main"
git pull --rebase origin main
git stash pop
```

Helpful stash commands (only the essentials):

```bash
git stash list
git stash apply         # apply stash but keep it in the list
git stash drop          # drop a stash you no longer need
```

## Quick fixes (common situations)

I staged too much:

```bash
git restore --staged .
```

I need to abandon all my local edits in one go (discards everything not committed):

```bash
git restore .
```

I need to undo a commit that already exists on the remote (safe for shared branches):

```bash
git log --oneline
git revert <commit-sha>
git push
```

## References

- [Nicholas Chen's Git Guide](https://nicholaschen.me/blogs/git)
- [Dangit, Git!](https://dangitgit.com/)
- [Zach Greathouse](https://github.com/zgreathouse)
