# 🎓 Assessify - Projekt-Bewertungs- und Verwaltungssystem

## 📋 Übersicht

**Assessify** ist eine digitale Plattform zur Verwaltung und Bewertung von Schülerleistungen. Das System ermöglicht Lehrkräften die effiziente Verwaltung von Noten und Projekten, während Schüler ihre eigenen Bewertungen einsehen und an Peer-Evaluationen teilnehmen können.

### 🎯 Ziele des Projekts

- Vereinfachung des Bewertungsprozesses
- Erhöhte Transparenz für Schüler und Lehrkräfte
- Förderung von Peer-Evaluationen
- Intuitive Benutzeroberfläche für alle Nutzertypen

---

## 📚 Inhaltsverzeichnis

- [Übersicht](#-assessify---projekt-bewertungs--und-verwaltungssystem)
- [Technologie-Stack](#-technologie-stack)
- [Benutzergruppen](#-benutzergruppen)
- [Installation & Setup](#-installation--setup)
- [Verwendung](#-verwendung)
- [API Dokumentation](#-api-dokumentation)
- [Projektstruktur](#-projektstruktur)
- [Datenbankstruktur](#-datenbankstruktur)
- [Entwicklung](#-entwicklung)
- [Lizenz](#-lizenz)

---

## 🛠️ Technologie-Stack

| Komponente | Technologie | Version |
|-----------|------------|---------|
| **Backend** | Java + Spring Boot | 3.2.3 |
| **Frontend** | TypeScript + Angular | Latest |
| **Datenbank** | PostgreSQL | 16 |
| **Styling** | CSS + TailwindCSS | - |
| **Containerisierung** | Docker & Docker Compose | - |

### Backend-Dependencies
- Spring Boot Web
- Spring Data JPA
- PostgreSQL Driver
- Security & JWT Authentication

---

## 👥 Benutzergruppen

Das System unterstützt drei verschiedene Benutzerrollen mit unterschiedlichen Berechtigungen:

### 🔐 Admin
- Verwaltung aller Benutzer (Lehrkräfte, Schüler)
- Verwaltung von Klassen und Lernfeldern
- Verwaltung von Fragen und Quiz
- Systemkonfiguration

### 👨‍🏫 Lehrkraft (Teacher)
- Noten und Bewertungen verwalten
- Schüler und ihre Leistungen überwachen
- Projektgruppen erstellen und verwalten
- Lernfelder definieren
- Bewertungsberichte einsehen

### 👨‍🎓 Schüler (Student)
- Eigene Noten und Bewertungen einsehen
- Klassen und Kurse anzeigen
- Peer-Evaluationen durchführen
- Profil und Klassenzugehörigkeit verwalten

---

## 🚀 Installation & Setup

### Voraussetzungen
- Docker & Docker Compose
- Git
- Java 21 (für lokale Backend-Entwicklung)
- Node.js 18+ (für lokale Frontend-Entwicklung)

### Schnellstart mit Docker

1. **Repository klonen**
```bash
git clone https://github.com/fes-wiesbaden/12BE13_ProjektbewertungenSoftware_P4G2.git
cd 12BE13_ProjektbewertungenSoftware_P4G2
```

2. **Docker Container starten**
```bash
docker-compose up -d
```

3. **Zugriff auf die Anwendung**
   - Frontend: `http://localhost:4200`
   - Backend API: `http://localhost:4100`
   - Datenbank: `postgresql://localhost:55432`

### Lokale Entwicklung

#### Backend starten
```bash
cd Assessify.Backend
mvn spring-boot:run
```

#### Frontend starten
```bash
cd frontend
npm install
ng serve --open
```

---

## 💻 Verwendung

### Anmeldung
Alle Benutzer melden sich mit ihren Zugangsdaten an. Die Authentifizierung erfolgt über JWT-Token.

### Hauptfunktionen

**Für Lehrkräfte:**
- Dashboards mit Schülerübersicht
- Noten verwalten und berechnen
- Projekte und Lernfelder erstellen
- Studentengruppen verwalten

**Für Schüler:**
- Persönliches Dashboard mit Noten
- Klassenzugehörigkeiten einsehen
- Peer-Evaluationen durchführen
- Profil verwalten

**Für Admins:**
- Benutzerverwaltung
- Klassenverwaltung
- System-Einstellungen

---

## 📡 API Dokumentation

Für detaillierte Informationen zu API-Endpoints, Request/Response-Format und Beispiele siehe:
- [Vollständige API Dokumentation](API.md)

### Basis URL
```
http://localhost:4100/api
```

### Hauptendpunkte
- `GET /api/users` - Alle Benutzer abrufen
- `POST /api/user` - Neuen Benutzer erstellen
- `GET /api/grades` - Noten abrufen
- `GET /api/classes` - Klassen abrufen
- Weitere Endpoints siehe [API.md](API.md)

---

## 📁 Projektstruktur

```
├── frontend/                          # Angular Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── Features/             # Feature Module (Admin, Teacher, Student, Auth)
│   │   │   ├── layout/               # Layouts (Navbar, Sidebar, Main)
│   │   │   ├── Shared/               # Gemeinsame Komponenten & Services
│   │   │   └── core/                 # Guards, Services, Auth
│   │   └── assets/                   # Bilder, Übersetzungen
│   └── package.json
│
├── Assessify.Backend/                 # Spring Boot Backend
│   ├── src/
│   │   └── main/
│   │       ├── java/de/assessify/    # Java Source Code
│   │       └── resources/            # Konfigurationsdateien
│   └── pom.xml                       # Maven Konfiguration
│
├── docker-compose.yml                # Docker Orchestration
├── API.md                            # API Dokumentation
└── README.md                         # Diese Datei
```

---

## 🗄️ Datenbankstruktur

### Haupt-Tabellen

#### `User`
- `uuid` - Eindeutige Benutzer-ID
- `fullName` - Vollständiger Name
- `username` - Benutzername
- `password` - Gehashtes Passwort (BCrypt)
- `role` - Benutzerrolle (ADMIN, TEACHER, STUDENT)
- `school` - Schule des Benutzers
- `class_id` - Referenz zu Klasse (Fremdschlüssel)

#### `Noten` (Bewertungen)
- `Note_ID` - Eindeutige Noten-ID
- `LF_ID` - Referenz zu Lernfeld

#### `Noten_Entries` (Einzelne Einträge)
- `NE_ID` - Eindeutige Eintrags-ID
- `Note` - Bewertungswert
- `Note_ID` - Referenz zu Noten

#### `Lernfelder` (Learning Fields)
- `LF_ID` - Eindeutige Lernfeld-ID
- `LF_Number` - Lernfeldnummer

#### `Classes` (Klassen)
- `class_id` - Eindeutige Klassen-ID
- `class_name` - Name der Klasse

---

## 👨‍💻 Entwicklung

### Projektstruktur für neue Features

1. **Frontend Feature hinzufügen**
   - Neues Modul unter `frontend/src/app/Features/`
   - Routing-Module erstellen
   - Komponenten und Services hinzufügen

2. **Backend Endpoint hinzufügen**
   - Controller unter `Assessify.Backend/src/main/java/de/assessify/`
   - Service-Klasse für Geschäftslogik
   - Entity-Klasse für Datenbankmodell

3. **Tests schreiben**
   - Frontend: `*.spec.ts` Dateien
   - Backend: JUnit Tests in `src/test/`

### Code-Style
- Frontend: TypeScript, Angular Best Practices
- Backend: Java 21, Spring Framework Conventions

---

## 📝 Lizenz

Dieses Projekt ist unter der [LICENSE](LICENSE) lizenziert.
