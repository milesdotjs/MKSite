# -*- coding: utf-8 -*-
"""Case-sensitive internal link check against what git will actually deploy.

Windows is case-insensitive, so `os.path.exists` happily resolves
`projects/Study Something!/` when the repo really holds
`projects/study-something/`. GitHub Pages is case-SENSITIVE and would 404.
So the source of truth here is `git ls-files`, which is the exact set of paths
that get published.

    cd tools && python check_links.py
"""
import io, re, subprocess, sys, os, posixpath

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES = ['index.html', 'about.html', 'projects.html']

def tracked():
    out = subprocess.run(['git', 'ls-files', '-z'], cwd=ROOT,
                         capture_output=True, check=True).stdout
    return set(p for p in out.decode('utf-8').split('\0') if p)

FILES = tracked()
DIRS = set()
for f in FILES:
    parts = f.split('/')
    for i in range(1, len(parts)):
        DIRS.add('/'.join(parts[:i]))

ATTR = re.compile(r'(?:href|src)\s*=\s*"([^"]+)"')
EXTERNAL = re.compile(r'^(?:https?:|mailto:|tel:|data:|#|//)')

def resolve(page, url):
    """Return the repo-relative path a browser would fetch, or None."""
    url = url.split('#')[0].split('?')[0]
    if not url:
        return None
    base = posixpath.dirname(page)
    path = posixpath.normpath(posixpath.join(base, url)) if not url.startswith('/') else url.lstrip('/')
    return path

problems, checked = [], 0
for page in PAGES:
    src = io.open(os.path.join(ROOT, page), encoding='utf-8').read()
    for url in ATTR.findall(src):
        if EXTERNAL.match(url):
            continue
        path = resolve(page, url)
        if path is None:
            continue
        checked += 1
        if path in FILES:
            continue
        # a directory URL is served as its index.html
        if path in DIRS:
            if posixpath.join(path, 'index.html') in FILES:
                if not url.endswith('/'):
                    problems.append((page, url, 'directory link is missing its trailing slash'))
                continue
            problems.append((page, url, 'directory has no index.html'))
            continue
        # help diagnose: is it only the case that is wrong?
        near = [f for f in FILES if f.lower() == path.lower()
                or f.lower() == posixpath.join(path, 'index.html').lower()]
        problems.append((page, url, 'NOT DEPLOYED' + (' - case mismatch, repo has: ' + near[0] if near else '')))

print('checked %d internal links across %d pages' % (checked, len(PAGES)))
if problems:
    print('\n%d PROBLEM(S):' % len(problems))
    for page, url, why in problems:
        print('  %-14s %-42s %s' % (page, url, why))
    sys.exit(1)
print('all internal links resolve to deployed, correctly-cased paths')
