# 🛠️ Zaynahs E-Store — Git Version Control Guide
> Project ke different code versions ko track, check, switch aur rollback (revert) karne ki complete guide.

---

## 📂 1. Git Records (Commits) Kahan Hote Hain?

1. **Local System Par (Hidden Repository)**:
   Aapke project directory (`zaynahsestore-tv-main/`) ke andar aik hidden directory hoti hai jise `.git/` kehte hain. Pura version history aur backups isi folder mein store hote hain.
2. **Online (GitHub)**:
   Aapki remote repository par, GitHub dashboard par **"Commits"** section mein har change ki updates saved hoti hain.

---

## 🔍 2. Code History (Versions) Kaise Dekhein?

### Terminal Command Ke Zariye:
Apne terminal mein project directory ke andar ye commands run karein:

* **Short View (Recommended)**: Har commit ka chota sa message aur short ID (Hash) dekhne ke liye:
  ```bash
  git log --oneline
  ```
  *Output Example:*
  ```text
  7997ef8 fix(security): append x-nextjs-redirect headers
  1570da3 fix(security): use window.location.href in layout
  507e462 fix: make in-stock quantity field read-only
  ```

* **Detailed View**: Kis developer ne kab, kis date ko aur kis email se commit kiya:
  ```bash
  git log
  ```

* **Recent Limits**: Sirf aakhri 5 commits dekhne ke liye:
  ```bash
  git log -n 5 --oneline
  ```

### VS Code UI Ke Zariye:
1. VS Code ke left sidebar mein **Source Control** icon (Teesra icon) par click karein.
2. Niche **Timeline** panel ko expand karein. 
3. Wahan aapko us file ki complete edit history (git commits) show ho jaye gi.

---

## 🔄 3. Apni Marzi Ke Version Par Kaise Jayein?

Git mein purane version par jane ke do tareeqe hote hain: **Temporary Check** ya **Permanent Rollback**.

### Method A: Temporary Check (Sirf Code dekhne ya test karne ke liye)
Agar aap chahte hain ke sirf temporary check karein ke 3 din pehle code kaisa kaam kar raha tha (bina kisi file ko permanently delete kiye):

1. Pehle terminal mein `git log --oneline` chalayein aur us version ki **Commit ID** copy karein (e.g., `507e462`).
2. Ye command run karein:
   ```bash
   git checkout <Commit-ID>
   ```
   *Example:*
   ```bash
   git checkout 507e462
   ```
   *Note: Aapki files temporarily us version par chali jayein gi. Aap app chala kar test kar sakte hain.*

3. **Wapas standard/latest version par aane ke liye**:
   ```bash
   git checkout main
   ```

---

### Method B: Permanent Rollback (Purane Version Par Hamesha Ke Liye Wapas Jana)
Agar aap chahte hain ke naye features/bugs ko permanently delete kar ke code ko kisi purane stable version par wapas reset kar dein:

> ⚠️ **Warning**: Ye command baad mein kiye gaye local changes ko permanently delete kar degi. Pehle apna kaam verify kar lein.

1. Apne terminal mein select karein ke kis commit par wapas jana hai (e.g., `507e462`).
2. Apni local files ko reset karne ke liye ye run karein:
   ```bash
   git reset --hard <Commit-ID>
   ```
   *Example:*
   ```bash
   git reset --hard 507e462
   ```

3. **Vercel / GitHub Par Live Update Bhejne Ke Liye (Force Push)**:
   Chunkay GitHub par naya code maujood hai, isliye standard push reject ho jaye ga. Aap ko force push karna pare ga taake live site (Vercel) bhi purane version par revert ho jaye:
   ```bash
   git push origin main --force
   ```

---

## 💡 Quick Cheat Sheet (Zaroori Commands)

| Kaam (Goal) | Command | Detail (Description) |
|---|---|---|
| **History Dekhna** | `git log --oneline` | Tamam commits/versions ki list unique IDs ke sath dikhata hai. |
| **Workspace Status** | `git status` | Check karta hai ke koi uncommitted ya edited file to nahi bachi. |
| **Temporary Switch** | `git checkout <ID>` | Kisi bhi purane version par temporarily shift hone ke liye. |
| **Back to Latest** | `git checkout main` | Temporary version se wapas main branch par aane ke liye. |
| **Permanent Revert** | `git reset --hard <ID>` | Local code ko kisi purane version par permanently reset karne ke liye. |
| **Force Update Live** | `git push origin main --force` | Purane version ko GitHub/Vercel par force push karne ke liye. |
| **Discard Local Changes** | `git restore .` | Agar aapne koi file manually edit ki aur save nahi karni, to use discard karne ke liye. |
