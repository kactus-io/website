# How does it work?

That's a good question. Instead of tracking the *actual* sketch files (or *binaries*) in git, Kactus transforms your sketch file into groups of individual text files – one for each layer/page – that are much more suited for `git` to work with. 

## Workflow

The basic workflow looks very similar to how many developers use `git`:

1. Clone your repo locally
2. Make your changes in Sketch
3. Commit your changes
4. Push your changes

However, when working with multiple designers, the [git-flow](https://www.atlassian.com/git/tutorials/comparing-workflows#gitflow-workflow) methodology works very well:

1. Clone your repo (if you're just getting started)
2. Checkout a feature branch (e.g. `feat/background-color`)
3. Make your changes in Sketch
4. Commit your changes
5. Either:
    - Push your changes to your git server for others to review/merge
    - Merge your changes into another branch (master) yourself

## Committing Changes

When Kactus is running (with your repository open), it watches your sketch files and re-parses them when a change is detected. This parsed (or exploded) view of your sketch file is what git tracks.

![commit](https://user-images.githubusercontent.com/3254314/28254880-df5a388e-6a65-11e7-8b73-8de6fe227927.gif)

---

## Merging two parallel branches

1. Checkout the branch you want to merge *into*
2. Select "Merge into Current Branch" from the "Branch" menu
3. Select the branch that you want to merge *from*

![merge](https://user-images.githubusercontent.com/3254314/28254882-e28fb8d0-6a65-11e7-86a5-d766d4303959.gif)

---

## Sharing text styles across multiple sketch files

![sharetextstyle](https://user-images.githubusercontent.com/3254314/28254883-e5f79a92-6a65-11e7-86cc-3cfdc687a454.gif)

---

## Existing Repos

If your sketch files are already tracked in a git repository, there are few things you need to do to get the most out of Kactus.

1. Open your repo in Kactus to generate the JSON representation of your sketch files
2. Commit the generated JSON directories
3. Untrack sketch files
    - In most cases, this can be done with git by running: `git rm --cached *.sketch`
4. Tell git to [ignore](/help/glossary/#ignore) sketch files by adding `*.sketch` to your repo's `.gitignore` file
    - This can be done from within Kactus ("Repository" > "Repository Settings" > "Ignored Files")
5. **IMPORTANT:** Add (or modify) your repository's `.gitattributes` file to include `* text=auto`. This helps git determine when files actually differ by normalizing line endings ([more details](https://git-scm.com/docs/gitattributes#_end_of_line_conversion))

> *Note:* When you create a new repository with Kactus, it is automatically configured to [ignore](/help/glossary/#ignore) sketch files.

