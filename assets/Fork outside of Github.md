# How to Fork outside of Github

### 0. Create an empty Repo in your git

### 1. Create a bare Clone of the Repo
```
git clone --bare https://github.com/H0rn0chse/team-bookmarks.git
```
If you already have a bare clone you can update the clone
```
git fetch origin main:main
```

### 2. Change directory to your bare Clone

### 3. Push to your Fork in your git
```
git push --mirror <https://your-git.com/yourUser/yourFork.git>
```
