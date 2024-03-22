import subprocess
import time

def get_git_commit_count():
    try:
        return int(subprocess.check_output(["git", "rev-list", "HEAD", "--count"]).decode('utf-8').strip())
    except Exception:
        return -1


def write_version_info(filepath):
    vercount = get_git_commit_count()
    if vercount > -1:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write('// Deployed from: {}\n'.format(time.strftime("%Y-%m-%d %H:%M:%S")))
            f.write('version = "v{:.2f}";\n'.format(vercount/100.0))


if __name__ == "__main__":
    write_version_info("version.js")
