# GitHub Publication Guide

Dein Projekt ist **Git-Ready**! Folge diese Schritte, um es auf GitHub zu publishen.

## ✅ Vorbereitung

- [x] Repository lokal initialisiert
- [x] README.md komplett überarbeitet
- [x] Legacy-Dateien gelöscht
- [x] .gitignore konfiguriert (data/, node_modules, .env)
- [x] Initial Commit gemacht

## 🚀 GitHub Publication (3 Schritte)

### Schritt 1: GitHub Repository erstellen

Gehe zu https://github.com/new und erstelle ein neues Repository:

**Einstellungen:**
- **Repository Name:** `controlled-shopping-research-assistant`
- **Beschreibung:** 
  ```
  A controlled research platform for studying nudging and agentic commerce in shopping behavior. 
  Features a single-variant AI shopping assistant prototype with comprehensive study workflow, 
  anonymous data collection, and reproducible research design for Bachelor thesis research.
  ```
- **Visibility:** `Public` ✅
- **Initialize repository:** NICHT ankreuzen (wir haben schon Commits!)

Dann: **Create Repository**

### Schritt 2: Remote hinzufügen

Nach dem Erstellen siehst du Befehle. Nutze diese (ersetze USERNAME):

```powershell
git remote add origin https://github.com/YOUR_USERNAME/controlled-shopping-research-assistant.git
git push -u origin main
```

**Beispiel** (wenn dein GitHub Username `daoud` ist):
```powershell
git remote add origin https://github.com/daoud/controlled-shopping-research-assistant.git
git push -u origin main
```

### Schritt 3: Push ausführen

Im Terminal (im Projekt-Ordner):

```powershell
git push -u origin main
```

Du wirst gefragt nach GitHub Credentials. Nutze:
- **Option 1:** GitHub Desktop App (einfacher)
- **Option 2:** PAT (Personal Access Token) - https://github.com/settings/tokens/new

---

## 📋 Nach dem Push - Optional aber empfohlen

### GitHub Repository beschreiben

1. Gehe zu deinem Repo auf GitHub
2. Klick auf **Settings** → **About** (rechts oben)
3. Trage Beschreibung ein:
   ```
   A controlled research platform for studying nudging and agentic commerce
   ```
4. Wähle Themen (Topics):
   - `research`
   - `bachelor-thesis`
   - `commerce`
   - `nudging`
   - `react`
   - `expressjs`
   - `study-platform`

### Weitere Verbesserungen (optional)

- Füge **License** hinzu (MIT ist schon im Repo)
- Erstelle **Releases** wenn Version veröffentlicht wird
- Nutze **GitHub Discussions** für Feedback

---

## ✅ Finale Checkliste vor Abgabe

- [ ] Repository auf GitHub public
- [ ] README.md auf GitHub sichtbar
- [ ] Alle Commits sind dort
- [ ] `.gitignore` funktioniert (data/, node_modules nicht visible)
- [ ] Beschreibung + Topics gesetzt
- [ ] GitHub Link weitergeben an Betreuer

---

## Schnellbefehl (all in one)

Falls du alles auf einmal machen willst (nachdem Repo erstellt):

```powershell
# Im Projekt-Ordner:
git remote add origin https://github.com/YOUR_USERNAME/controlled-shopping-research-assistant.git
git push -u origin main
```

Fertig! 🎉

---

**Hilfe?** GitHub Fehler sind meist:
- `fatal: remote origin already exists` → `git remote remove origin` dann nochmal
- `push rejected` → Pull zuerst: `git pull origin main`
- Credentials Fehler → Personal Access Token verwenden
