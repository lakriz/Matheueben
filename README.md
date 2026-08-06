# MatheÜben Webapp 🧮 🌈

Ein interaktives Mathe-Lernprogramm für Grundschüler (Klasse 1–3), entwickelt als **Vibe Coding Test** mit GitHub Copilot.

---

## 📌 Hintergrund & Kontext

- **Vibe Coding Experiment:** Dieses Repository entstand im Rahmen eines *Vibe Coding Tests* mit dem Fokus, mithilfe von **GitHub Copilot** eine ansprechende, kinderfreundliche Mathe-Übungsanwendung zu bauen.
- **Folgeprojekt / Bootcamp:** Auf Basis dieses Projekts wurde ein weiteres Trainingsprojekt entwickelt, welches die Lehrinhalte und Übungen aus dem **Data Engineering Bootcamp bei neue fische** abdeckt.

---

## 🚀 Quickstart: Webapp lokal starten

### Voraussetzungen
- **Node.js**: `>= 20.20.0`
- **npm**: `>= 10.8.0`

### Befehle

1. **Repository klonen & in das Verzeichnis wechseln:**
   ```bash
   cd Matheueben
   ```

2. **Abhängigkeiten installieren:**
   ```bash
   npm install
   ```

3. **Lokalen Entwicklungsserver starten:**
   ```bash
   npm run dev
   ```

4. **Im Browser öffnen:**
   Öffne den in der Konsole angezeigten Link (Standard: `http://localhost:5173`).

---

## ⚠️ Wichtiger Hinweis: Lokaler Modus ohne Login & Scoring

Die Webapp ist so konzipiert, dass sie **lokal sofort ohne vorherige Registrierung oder Anmeldung** genutzt werden kann.

### Was lokal funktioniert:
- ✅ Alle Mathe-Übungen für Klasse 1, 2 und 3 (Addition, Subtraktion, Einmaleins, Division, Zahlenraum 20/100/1000, Ergänzen, Vergleichen, Textaufgaben, Muster).
- ✅ Interaktive Feedback- und Ergebnis-Bildschirme am Ende jeder Übungssession.
- ✅ Themes & visuelle Anpassungen in der aktuellen Sitzung.

### Warum das Scoring / die Speicherung lokal nicht funktioniert:
- ❌ **Keine Datenbank-Persistence ohne Login:** Das dauerhafte Speichern von Highscores (`ExerciseResult`) sowie das Speichern des gewählten Profil-Themes (`UserProfile`) nutzt **AWS Amplify Gen 2** (Amazon Cognito & AWS AppSync / DynamoDB).
- ❌ **Verhalten im Quellcode (`App.tsx`):** Beim Abschluss einer Übung prüft die App, ob ein angemeldeter AWS-Benutzer (`user`) existiert:
  ```typescript
  if (user && selectedExercise) {
    await dataClient.models.ExerciseResult.create({ ... });
  }
  ```
  Ohne angebundenes AWS-Backend und ohne Login wird dieser Schritt übersprungen. Das Ergebnis wird zwar für den Moment auf dem Bildschirm angezeigt, aber **nicht dauerhaft in der Datenbank gespeichert** und taucht nicht in der Profil-Historie auf.

---

## 🛠️ Technologien & Code-Architektur

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS v4
- **Backend / Infrastructure (Optional):** AWS Amplify Gen 2 (`@aws-amplify/backend`)
- **Authentifizierung & Daten (bei Cloud-Anbindung):** Amazon Cognito, AWS AppSync, Amazon DynamoDB

---

## 📜 Skripte in `package.json`

| Befehl | Beschreibung |
|---|---|
| `npm run dev` | Startet den Vite Dev-Server (`--host 0.0.0.0`) |
| `npm run build` | Führt den TypeScript-Typecheck (`tsc`) aus und baut das Production-Bundle mit Vite |
| `npm run lint` | Prüft den Code mit ESLint |
| `npm run preview` | Vorschau des Production-Builds |
| `npx ampx sandbox` | (Optional) Startet eine persönliche AWS Amplify Cloud Sandbox für Backend-Tests |

---

## 📄 Lizenz

Dieses Projekt steht unter der [MIT-0 License](LICENSE).