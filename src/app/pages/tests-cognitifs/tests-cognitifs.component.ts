import { Component, signal, effect, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Brain, MessageSquare, Compass, Plus, Activity, Stethoscope, Users, UserCircle, ChevronRight, Calendar, AlertTriangle, TrendingDown, FileText, FlaskConical, ClipboardList, BarChart3, BookOpen, Phone, Users2, CheckCircle2, Clock, Info, ExternalLink, Search, X, Volume2, Pencil } from 'lucide-angular';
import { CognitiveTestService } from '../../services/cognitive-test.service';
import { TestResultService } from '../../services/test-result.service';
import { CognitiveTest, TestResult, DifficultyLevel } from '../../models/cognitive-models';

@Component({
  selector: 'app-tests-cognitifs',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    LucideAngularModule
  ],
  templateUrl: './tests-cognitifs.component.html',
  styleUrl: './tests-cognitifs.component.css'
})
export class TestsCognitifsComponent implements OnInit {
  private cognitiveTestService = inject(CognitiveTestService);
  private testResultService = inject(TestResultService);
  router = inject(Router);

  showNewTestModal = signal(false);
  selectedRole = signal<string | null>(null);

  // New Test Form State
  searchQuery = signal('');
  selectedPatientId = signal<string | null>(null);
  testStage = signal<'STABLE' | 'MOYEN' | 'CRITIQUE' | null>(null);
  selectedTestId = signal<string | null>(null);
  testDeadline = signal('');
  testNotes = signal('');

  availableTests = signal<CognitiveTest[]>([]);
  recentResults = signal<any[]>([]);

  readonly icons = {
    Brain,
    MessageSquare,
    Compass,
    Plus,
    Activity,
    Stethoscope,
    Users,
    UserCircle,
    ChevronRight,
    Calendar,
    AlertTriangle,
    TrendingDown,
    FileText,
    FlaskConical,
    ClipboardList,
    BarChart: BarChart3,
    BookOpen,
    Phone,
    Users2,
    CheckCircle2,
    Clock,
    Info,
    ExternalLink,
    Search,
    XMark: X,
    Volume2
  };

  dashboardStats = {
    totalPatients: 23,
    newThisMonth: 3,
    stage1: 12,
    stage2: 8,
    stage3: 3
  };

  criticalAlerts = [
    { name: 'Pierre Martin', stage: 'STAGE 3 — CRITIQUE', score: '14/30', trend: '-5 pts', alerts: 3, color: 'red' },
    { name: 'Anne Petit', stage: 'STAGE 3 — CRITIQUE', score: '16/30', trend: '-4 pts', alerts: 2, color: 'pink' }
  ];

  recentDecisions = [
    { patient: 'Pierre Martin', status: 'CRITIQUE', urgency: 'URGENCE', description: 'Déclin rapide détecté - Score passé de 19 à 14 en 1 mois. Intervention immédiate recommandée.', type: 'HYBRID', date: '08/02/2026' },
    { patient: 'Jean Dupont', status: 'MOYEN', urgency: 'SURVEILLANCE', description: 'Léger déclin observé. Surveillance renforcée recommandée.', type: 'RULE BASED', date: '15/02/2026' }
  ];

  // Aidant Mock Data
  aidantData = {
    patientName: 'Jean Dupont',
    patientAge: 65,
    stage: 'STAGE 2 — SURVEILLANCE',
    currentScore: '22/30',
    percentage: 73.3,
    trend: 'Déclin -2 pts',
    nextTest: '29/03/2026',
    statusMessage: 'Surveillance renforcée',
    statusDesc: 'Score en baisse de 2 points ce mois. Suivez bien les recommandations du médecin.',
    tasks: [
      { id: 1, title: 'Appeler le médecin', urgency: 'URGENTE', date: '17/02/2026', color: 'red' },
      { id: 2, title: 'Exercices mémoire quotidiens', urgency: 'ÉLEVÉE', date: '17/02/2026', color: 'yellow' },
      { id: 3, title: 'Préparer cahier de suivi', urgency: 'MOYENNE', date: '20/02/2026', color: 'blue' }
    ],
    appointment: {
      date: '25 Février 2026',
      time: '10h00',
      description: 'Test Cognitif + Consultation',
      location: 'Cabinet Dr. Martin'
    },
    resources: [
      { title: "Guide de l'aidant", desc: 'Conseils et bonnes pratiques', icon: BookOpen },
      { title: "Ligne d'urgence", desc: '0800 XXX XXX (24/7)', icon: Phone },
      { title: 'Groupe de soutien', desc: 'Rejoindre la communauté', icon: Users2 }
    ]
  };

  // Patient Mock Data
  patientData = {
    stage: 'STAGE 2 — SURVEILLANCE',
    currentScore: '22/30',
    percentage: 73.3,
    doctorNote: 'Votre médecin suit votre mémoire de près. Ce n’est PAS une maladie grave. C’est une surveillance préventive. Faites vos exercices quotidiens et passez les tests demandés.',
    testsToDo: [
      { title: 'Test de Stroop', desc: 'Évaluation de l’attention sélective et de l’inhibition cognitive', duration: '10 min', deadline: '29/03/2026' }
    ],
    recommendations: [
      { title: 'Exercices de mémoire quotidiens', desc: '15 minutes par jour d’exercices cognitifs', icon: Brain },
      { title: 'Rendez-vous médical', desc: 'Consultation de suivi le 25 février', icon: Stethoscope }
    ],
    nextAppointment: {
      date: '25 Février 2026 à 10h00',
      location: 'Cabinet Dr. Martin'
    }
  };

  // Mock patients until we have a PatientService
  patients = [
    { id: '101', name: 'Jean DUPONT', age: 80 },
    { id: '102', name: 'Marie MARTIN', age: 75 },
    { id: '103', name: 'Paul DURAND', age: 82 },
    { id: '104', name: 'Sophie Laurent', age: 68 },
    { id: '105', name: 'Pierre Martin', age: 72 },
  ];

  get filteredPatients() {
    const query = this.searchQuery().toLowerCase();
    if (!query) return [];
    return this.patients.filter(p => p.name.toLowerCase().includes(query));
  }

  get selectedPatientData() {
    return this.patients.find(p => p.id === this.selectedPatientId());
  }

  selectedTestType = signal<string | null>(null);

  // Personalized tests filled by the doctor
  personalizedTests: { STABLE: { name: string; selected: boolean }[]; MOYEN: { name: string; selected: boolean }[]; CRITIQUE: { name: string; selected: boolean }[] } = {
    STABLE: [
      { name: 'Mémoire des visages personnalisée', selected: false },
      { name: 'Mots croisés personnalisés', selected: false }
    ],
    MOYEN: [
      { name: 'Memory personnalisé', selected: false },
      { name: 'Reconnaissance d\'odeurs personnalisée', selected: false }
    ],
    CRITIQUE: [
      { name: 'Reconnaissance des proches personnalisée', selected: false },
      { name: 'Chansons personnalisées', selected: false }
    ]
  };

  // Helper to map UI stage to numeric difficulty level
  private getDifficultyFromStage(stage: string): DifficultyLevel {
    const stageDifficultyMap: Record<string, DifficultyLevel> = {
      'STABLE': DifficultyLevel.FACILE,
      'MOYEN': DifficultyLevel.MOYEN,
      'CRITIQUE': DifficultyLevel.AVANCE
    };
    return stageDifficultyMap[stage];
  }

  readonly typeLabels: Record<string, string> = {
    'MEMORY': 'MEMORY (Tests de mémoire)',
    'LANGUAGE': 'LANGUAGE (Tests de langage)',
    'REFLECTION': 'REFLECTION (Tests de réflexion)',
    'LOGIC': 'LOGIC (Tests de logique)',
    'AUDIO': 'AUDIO (Tests sonores)',
    'ATTENTION': 'ATTENTION (Tests d\'attention)',
    'DRAWING': 'DRAWING (Tests de dessin)'
  };

  get groupedTestsHierarchy() {
    const tests = this.availableTests();
    const stages: { id: 'STABLE' | 'MOYEN' | 'CRITIQUE', label: string, difficulty: DifficultyLevel }[] = [
      { id: 'STABLE', label: 'STABLE (Facile)', difficulty: DifficultyLevel.FACILE },
      { id: 'MOYEN', label: 'MOYEN (Intermédiaire)', difficulty: DifficultyLevel.MOYEN },
      { id: 'CRITIQUE', label: 'CRITIQUE (Avancé)', difficulty: DifficultyLevel.AVANCE }
    ];

    return stages.map(stage => {
      const testsInStage = tests.filter(t => t.difficultyLevel === stage.difficulty);
      const uniqueTypes = [...new Set(testsInStage.map(t => t.type))];

      const categories = uniqueTypes.map(type => ({
        type,
        label: this.typeLabels[type] || type,
        tests: testsInStage.filter(t => t.type === type)
      }));

      return {
        ...stage,
        categories
      };
    });
  }

  get availableTestTypes() {
    const stage = this.testStage();
    if (!stage) return [];

    const targetDifficulty = this.getDifficultyFromStage(stage);

    // Filter tests by difficulty
    const tests = this.availableTests().filter(t =>
      t.difficultyLevel === targetDifficulty
    );

    // Get unique types
    const types = [...new Set(tests.map(t => t.type))];
    return types;
  }

  get availableSpecificTests() {
    const stage = this.testStage();
    const type = this.selectedTestType();

    if (!stage || !type) return [];

    const targetDifficulty = this.getDifficultyFromStage(stage);

    return this.availableTests().filter(t =>
      t.difficultyLevel === targetDifficulty &&
      t.type === type
    );
  }

  isFormValid() {
    return this.selectedPatientId() && this.testStage() && this.selectedTestType() && this.selectedTestId() && this.testDeadline();
  }

  // Helper to map test type to color/icon
  getTestStyle(type: string) {
    switch (type) {
      case 'MEMORY': return { color: 'blue', icon: Brain };
      case 'LANGUAGE': return { color: 'green', icon: MessageSquare };
      case 'LOGIC': return { color: 'indigo', icon: Activity };
      case 'REFLECTION': return { color: 'purple', icon: Activity };
      case 'AUDIO': return { color: 'pink', icon: Volume2 };
      case 'ATTENTION': return { color: 'teal', icon: Activity };
      case 'DRAWING': return { color: 'orange', icon: Pencil };
      default: return { color: 'purple', icon: Activity };
    }
  }

  constructor() {
    effect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && this.showNewTestModal()) {
          this.handleCloseModal();
        }
      };

      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    });
  }

  ngOnInit() {
    this.loadTests();
    this.loadRecentResults();
  }

  loadTests() {
    this.cognitiveTestService.getAll().subscribe({
      next: (tests) => {
        console.log('[DEBUG] Tests chargés depuis le backend:', tests);
        this.availableTests.set(tests);
      },
      error: (err) => console.error('Error loading tests', err)
    });
  }

  loadRecentResults() {
    // Ideally we'd have a specific endpoint for "recent results" across all patients
    // For now, we'll mock it or fetch for a specific patient if we had one selected
    // But since this is a general view, we might need a new endpoint in backend or just map manually 
    // from a specific patient for demo purposes (e.g. patient 101)

    // Using a mock patient ID for demo or looping through known patients
    this.testResultService.getByPatient(101).subscribe({
      next: (results) => {
        const mappedResults = results.map(r => ({
          patient: 'Marie Dubois', // Mock name matching ID 101
          test: r.test?.titre || 'Test Inconnu',
          date: r.testDate,
          score: r.scoreTotale,
          duration: r.durationSeconds ? `${Math.floor(r.durationSeconds / 60)} min` : 'N/A'
        }));
        this.recentResults.set(mappedResults);
      },
      error: (err) => console.error('Error loading results', err)
    });
  }

  handleCloseModal() {
    this.showNewTestModal.set(false);
    setTimeout(() => {
      this.resetForm();
    }, 300);
  }

  resetForm() {
    this.searchQuery.set('');
    this.selectedPatientId.set(null);
    this.testStage.set(null);
    this.selectedTestType.set(null);
    this.selectedTestId.set(null);
    this.testDeadline.set('');
    this.testNotes.set('');
  }

  selectTestFromHierarchy(stageId: 'STABLE' | 'MOYEN' | 'CRITIQUE', type: string, testTitre: string) {
    this.testStage.set(stageId);
    this.selectedTestType.set(type);
    this.selectedTestId.set(testTitre);
  }

  togglePersonalizedTest(stage: 'STABLE' | 'MOYEN' | 'CRITIQUE', testName: string) {
    const tests = this.personalizedTests[stage];
    const test = tests.find((t: { name: string; selected: boolean }) => t.name === testName);
    if (test) {
      test.selected = !test.selected;
    }
  }

  selectPatient(patient: any) {
    this.selectedPatientId.set(patient.id);
    this.searchQuery.set(patient.name);
  }

  handleAssignTest() {
    if (this.isFormValid()) {
      console.log('Assigning test:', {
        patient: this.selectedPatientId(),
        stage: this.testStage(),
        type: this.selectedTestType(),
        test: this.selectedTestId(),
        deadline: this.testDeadline(),
        notes: this.testNotes()
      });
      this.handleCloseModal();
    }
  }

  openCalendar() {
    this.router.navigate(['/calendar']);
  }
}

