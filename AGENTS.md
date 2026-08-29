# Codex project instructions

## Git remote operations on Windows

There is currently a known issue with the Git runtime bundled with Codex on this Windows machine: `git-remote-https.exe` may crash during remote HTTPS operations.

Do NOT run remote Git commands from the local Windows Codex runtime.

In particular, do not run:

- `git fetch`
- `git pull`
- `git push`
- `git clone`
- `git ls-remote`
- `git remote update`
- `git submodule update`

or any other Git command that contacts the remote repository over HTTPS.

Local Git operations are allowed, including:

- `git status`
- `git diff`
- `git add`
- `git commit`
- `git log`

When remote repository access is required, use GitHub/Codex cloud functionality instead of the local Windows Git runtime.

If the required remote operation cannot be performed without local Git HTTPS access, stop and tell the user. Do NOT fall back to running the remote Git command locally.
