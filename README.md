🧠 MemorIA - Plateforme de Soins Connectés
📝 Overview
MemorIA est une application innovante dédiée à l'accompagnement des patients atteints de troubles cognitifs (type Alzheimer) et de leurs aidants. Elle permet de créer des communautés de soins, de faciliter la communication en temps réel et de centraliser le suivi médical et administratif (abonnements, facturation, documents).

✨ Features
👥 Communauté (Community)
Le cœur social de l'application. Elle permet de briser l'isolement des patients et des aidants.

Espaces de discussion : Création de groupes thématiques ou familiaux.

Rôles d'utilisateurs : Distinction claire entre patients, proches aidants et professionnels de santé.

Modération active : Possibilité pour le créateur de gérer les membres (ajouter, supprimer, bloquer).

Présence en temps réel : Système de "Last Seen" et indicateur de connexion pour savoir qui est disponible pour échanger.

📅 Planning & Suivi (Planning)
Une organisation rigoureuse pour pallier les troubles de la mémoire.

Calendrier partagé : Synchronisation des rendez-vous médicaux et des prises de médicaments entre tous les membres de la communauté.

Rappels intelligents : Notifications automatiques pour ne jamais oublier un événement important.

Gestion des tâches : Attribution de missions spécifiques aux aidants (courses, soins, visites).

🩺 Diagnostic & Monitoring (Diagnostic)
Un outil d'aide à la décision pour les professionnels et les familles.

Suivi de l'évolution : Graphiques de progression des symptômes basés sur les données saisies quotidiennement.

Journal de bord : Note des changements de comportement ou d'humeur du patient.

Alertes de santé : Détection automatique de schémas anormaux (ex: oublis répétés de médicaments) envoyée aux soignants.

📝 Tests Cognitifs (Test)
Des outils d'évaluation intégrés pour stimuler et mesurer les capacités.

Tests d'auto-évaluation : Exercices interactifs basés sur des standards médicaux pour évaluer la mémoire et l'orientation.

Jeux de stimulation : Activités ludiques quotidiennes pour maintenir l'activité cérébrale.

Rapports de résultats : Génération de bilans PDF après chaque test pour faciliter le partage avec le médecin traitant.

🛠 Tech Stack
Frontend
Framework : Angular
Backend
Langage : Java 17+.

Framework : Spring Boot 3.

Sécurité : Spring Security & JWT.

Base de données : PostgreSQL / MySQL (via Hibernate/JPA).


🏗 Architecture
L'application suit une architecture Microservices-ready ou Monolithe Modulaire basée sur le modèle MVC (Model-View-Controller) côté backend :

Controllers : Portes d'entrée API REST .

Services : Logique métier.

Repositories : Accès aux données.

Entities : Modèles de données

👥 Contributors
Memoria groupe
abir gammoudi 
jasser chouat 
raed nefzi 
fatma ellouze 
oussea mrayah 

🎓 Academic Context
Ce projet a été réalisé dans le cadre de [Nom de votre formation/Université]. Il démontre la capacité à intégrer des services complexes (Paiement, IA, Temps réel) dans une solution logicielle à fort impact social.

🚀 Getting Started
Pré-requis
JDK 17 ou plus.

Maven.

Une clé API Stripe et une clé API Groq.

Installation
Cloner le dépôt : git clone https://github.com/abirgmd/Esprit-PIDEV-4SAE3-2026-Memoria.git
Lancer le projet : mvn spring-boot:run | ng serve


🙏 Acknowledgment
Nous remercions ainsi que tous les testeurs qui ont aidé à améliorer l'expérience utilisateur de MemorIA.
