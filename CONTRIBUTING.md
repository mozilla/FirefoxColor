# Contributing

We are open for new issues and pull requests. By participating in this project, you
agree to abide by our [License][license].

Developer setup steps are covered in the [README][dev setup]. This file explains how our dev process works. If you'd like to contribute and don't understand something here, reach out on IRC, and we'll be happy to offer solutions. Additionally, we welcome any attempts to engage with the project - through acquiring the source code, following documentation steps to get started, and then offering feedback in our communications channels on how this process could be improved.

[license]: https://github.com/mozilla/Themer/blob/master/LICENSE
[dev setup]: https://github.com/mozilla/Themer/blob/master/README.md

### Say Hi!

If you're new to the project, please say hello in IRC! We can help you succeed
by finding issues that are a good fit for your skills/interests, and ensuring
you have a contact person to guide you through the bug fixing process, answer
any questions, and help if you get stuck.

Find us in #themer IRC. If you need help with IRC setup, the Mozilla [wiki][wiki] has instructions.

[wiki]: https://wiki.mozilla.org/IRC

### Find issues to work on

The project uses an [issue tracker][issue] to keep information about bugs to fix, project features to implement, documentation to write, and more. If you're new to the project, you can look for newcomer-friendly issues to use for their first contributions by looking for the following [good first issue][good first] tags in the project issue tracker.

[issue]: https://github.com/mozilla/Themer/issues/
[good first]: https://github.com/mozilla/Themer/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22

### Contributing code

We use the same process for community members and paid staff.

#### Fork and Clone

Fork the [repository][repo] and create a clone to your personal system.

[repo]: https://github.com/mozilla/Themer

#### Branches

Fork the project and create one branch per bug on your personal repo.

The branch name should describe the bug, not the fix. It should start with the bug number, and include a very short description of the bug, or a short version of the bug's title, like `101-Remove-broken-links`.

#### Commit messages

Commit messages should generally follow [this helpful advice][commit], but please start your commit message with "Fixes #nn:", which eases skimming history later. For this reason, the first line will tend to be longer than the 50 chars suggested in that article, aim to keep it less than 72 chars.

[commit]: http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html

#### Submitting the pull request

When you submit a pull request, please use the description field to explain in words the overall intention of your changes. A few sentences should be plenty. It's also ok to reuse the commit message, if you included a lot of discussion there.

At this point you're waiting on us. We like to at least comment on pull requests within three business days (and, typically, one business day). We may suggest some changes or improvements or alternatives.

#### Reviews

We try to avoid landing any code without at least a cursory review.

General rules for picking up reviews:
 - if you are going to review a PR, assign yourself to it
 - assigned person is responsible for helping get the PR over the finish line
 - if a PR doesn't have an assigned person, it's up for grabs

Reviewers will run through roughly the following checklist:
- Does the code do what it says it does?
- Is the proposed fix the right fix? Does it address the underlying cause of the bug?
- Is the code as simple as possible, while still addressing the issue? Are there unnecessary abstractions or optimizations?
- Does the code make sense? Can you understand it on a localized and global level?
- Does the code belong where it is? Is there a better place to put it?
- Does the code fit the overall style? This includes simple syntactic choices, as well as following broader patterns/architectural approaches used elsewhere in the codebase.
- Are there enough comments in the code? If commented code was changed, have the comments been updated?
- Are class, function, event, and variable names descriptive? Do they match the existing style?
- Are boundary cases considered?
- Are error cases handled?
- All tests and linting pass on travisci?
- Are there tests for new/changed code?

#### Merging

When a pull request has passed review, the reviewer generally merges the code.