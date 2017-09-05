# Glossary

Below are a list of some Git and Kactus specific terms we use across our sites and documentation.

---

## Git

Git is an open source program for tracking changes in text files. It was written by the author of the Linux operating system, and is the core technology that Kactus and GitHub are built on top of.

## Repository (aka repo)

A repository is the most basic element of Kactus. They're easiest to imagine as a project's folder. A repository contains all of the project files, and stores each file's revision history. Repositories can have multiple collaborators and can be either public or private.

## Commit

A commit is an individual change to a file (or set of files). It's like when you save a file, except with Git, every time you save it creates a unique ID (a.k.a. the "SHA" or "hash") that allows you to keep record of what changes were made when and by who. Commits usually contain a commit message which is a brief description of what changes were made.

## Branch

A branch is a parallel version of a repository. It is contained within the repository, but does not affect the primary (usually called `master`) branch allowing you to work freely without disrupting the "live" version. When you've made the changes you want to make, you can merge your branch back into the `master` branch to publish your changes.

---

## Blame

The "blame" feature in Git describes the last modification to each line of a file, which generally displays the revision, author and time. This is helpful, for example, in tracking down when a feature was added, or which commit led to a particular bug.

## Clone

A clone is a copy of a repository that lives on your computer instead of on a website's server somewhere, or the act of making that copy. With your clone you can edit the files and use Git to keep track of your changes without having to be online. It is, however, connected to the remote version so that changes can be synced between the two. You can push your local changes to the remote to keep them synced when you're online.

## Diff

A diff is the _difference_ in changes between two commits, or saved changes. The diff will visually describe what was added or removed from a file since its last commit.

## Fetch

Fetching refers to getting the latest changes from an online repository without merging them in. Once these changes are fetched you can compare them to your local branches (the files residing on your local machine).

## Ignore (.gitignore)

Git will look for a special file in the root of your repo called `.gitignore` and ignore any files in the repo that match any of the patterns defined therein. You can read more about git ignore [here](https://git-scm.com/docs/gitignore).

Tip: Because Finder hides files with names starting in a `.`, you may have to edit this file from a terminal.

## Issue

Issues are suggested improvements, tasks or questions related to the repository. Issues can be created by anyone (for public repositories), and are moderated by repository collaborators. Each issue contains its own discussion forum, can be labeled and assigned to a user.

## Markdown

Markdown is a simple semantic file format, not too dissimilar from .doc, .rtf and .txt. Markdown makes it easy for even those without a web-publishing background to write prose (including with links, lists, bullets, etc.) and have it displayed like a website. GitHub supports Markdown, and you can [learn about the semantics](https://help.github.com/categories/writing-on-github/).

## Merge

Merging takes the changes from one branch (in the same repository or from a fork), and applies them into another. This often happens as a pull request (which can be thought of as a request to merge). For more information, see "[Merging a pull request](https://help.github.com/articles/merging-a-pull-request)."

## Open source

Open source software is software that can be [freely used, modified, and shared (in both modified and unmodified form) by anyone](http://opensource.org/definition). Today the concept of "open source" is often extended beyond software, to represent a philosophy of collaboration in which working materials are made available online for anyone to fork, modify, discuss, and contribute to.

For more information on open source, specifically how to create and grow an open source project, we've created [Open Source Guides](https://opensource.guide/) that will help you foster a healthy open source community.

## Private repository

Private repositories are repositories that can only be viewed or contributed to by their creator and collaborators the creator specified.

## Pull

Pull refers to when you are _fetching in_ changes and _merging_ them. For instance, if someone has edited the remote file you're both working on, you'll want to _pull_ in those changes to your local copy so that it's up to date.

## Pull request

Pull requests are proposed changes to a repository submitted by a user and accepted or rejected by a repository's collaborators. Like issues, pull requests each have their own discussion forum. For more information, see "[About pull requests](https://help.github.com/articles/about-pull-requests)".

## Push

Pushing refers to sending your committed changes to a remote repository, such as a repository hosted on GitHub. For instance, if you change something locally, you'd want to then _push_ those changes so that others may access them.

## Remote

This is the version of something that is hosted on a server, most likely GitHub. It can be connected to local clones so that changes can be synced.

## Upstream

When talking about a branch or a fork, the primary branch on the original repository is often referred to as the "upstream", since that is the main place that other changes will come in from. The branch/fork you are working on is then called the "downstream".
