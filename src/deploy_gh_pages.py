import os
import shutil
import subprocess
import tempfile

def deploy_gh_pages():
    repo_url = "https://github.com/Rohitpvt/Poisonous-Gas-Identification-Project.git"
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    dist_dir = os.path.join(base_dir, "frontend", "dist")

    if not os.path.exists(dist_dir):
        print("Building frontend...")
        subprocess.run(["npm", "run", "build"], cwd=os.path.join(base_dir, "frontend"), check=True)

    temp_dir = tempfile.mkdtemp(prefix="gh_pages_")
    print(f"Deploying from temp directory: {temp_dir}")

    try:
        # Initialize fresh repo for gh-pages
        subprocess.run(["git", "init"], cwd=temp_dir, check=True)
        subprocess.run(["git", "checkout", "-b", "gh-pages"], cwd=temp_dir, check=True)

        # Copy dist contents to temp dir
        for item in os.listdir(dist_dir):
            s = os.path.join(dist_dir, item)
            d = os.path.join(temp_dir, item)
            if os.path.isdir(s):
                shutil.copytree(s, d, dirs_exist_ok=True)
            else:
                shutil.copy2(s, d)

        # Add .nojekyll to ensure asset paths are not filtered by Jekyll
        with open(os.path.join(temp_dir, ".nojekyll"), "w") as f:
            f.write("")

        subprocess.run(["git", "add", "-A"], cwd=temp_dir, check=True)
        subprocess.run(["git", "commit", "-m", "deploy: release production dashboard to gh-pages"], cwd=temp_dir, check=True)
        subprocess.run(["git", "remote", "add", "origin", repo_url], cwd=temp_dir, check=True)
        
        print("Pushing to remote origin gh-pages...")
        subprocess.run(["git", "push", "origin", "gh-pages", "--force"], cwd=temp_dir, check=True)
        print("Deployment to gh-pages branch completed successfully!")
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)

if __name__ == "__main__":
    deploy_gh_pages()
