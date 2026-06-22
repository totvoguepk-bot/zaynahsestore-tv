cd ~/Desktop/"Zaynahs e-store" && git add . && git commit -m "redeploy fix" && git push origin main m

git add .
git commit -m "feat: implement premiul fly-to-cart and fly-to-wishlist animations and custom toasts"
git push origin main


git remote set-url origin https://[YOUR_GITHUB_TOKEN]@github.com/totvoguepk-bot/zaynahsestore-tv.git
git push -u origin main




old git remove krna 

Manual reset karne ke liye aap ko terminal mein ye commands chalani hongi:

### Step 1: Purani Git History Delete Karein
Ye command local `.git` folder ko delete kar degi taake saari purani history aur leaks khatam ho jayen (aap ka actual code/files bilkul mehfooz rahengi):
```bash
rm -rf .git
```

### Step 2: Naya Git Initialize Karein
```bash
git init
```

### Step 3: Default Branch ka Naam 'main' Rakhein
```bash
git checkout -b main
```

### Step 4: Saari Files Add Karein (Zips ab skip ho jayengi)
Kyunke `.gitignore` mein `*.zip` add ho chuka hai, is liye ab koi bhi zip file Git mein add nahi hogi:
```bash
git add .
```

### Step 5: Clean Commit Banayein
```bash
git commit -m "feat: initial clean commit for redeploy"
```

### Step 6: Naye Repo ka URL Add Karein
```bash
git remote add origin https://[YOUR_GITHUB_TOKEN]@github.com/totvoguepk-bot/zaynahsestore-tv.git
```

### Step 7: GitHub par Push Karein
```bash
git push -u origin main --force
```

---

# **Agar aap chahein toh main ye khud automatic run kar sakta hoon** (aapko manually chalane ki zaroorat nahi paregi). Kya main ise run kar doon?


#if token in any file 

Token kisi file mein hardcoded hai. Dhundo aur hatao:

```bash
# Kon si file mein hai dhundo
grep -r "ghp_" . --include="*.ts" --include="*.js" --include="*.md" --include="*.json" --include="*.sql" -l
```

Jo files aayein unse token hata do, phir:

```bash
git add .
git commit -m "fix: remove hardcoded tokens"
git push -u origin main --force
```

**Ya** — GitHub pe jakar unblock link pe click karo (easy way):
```
https://github.com/totvoguepk-bot/zaynahsestore-tv/security/secret-scanning/unblock-secret/3FEJx91ou43kM9JxvWwgeTYehqM
```

Aur **wo token rotate karo abhi** — 2 baar expose ho chuka hai.

1. Zaynahs e-store ko pehle wali state par wapis laane ke liye:
Terminal mein Zaynahs e-store ke folder mein ye run karein:

bash
git reset --hard 20c3498
git push origin main --force



git remote set-url origin https://token@github.com/totvoguepk-bot/zaynahsestore-tv.git


git push -u origin main --force