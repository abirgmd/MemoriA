export enum TestType {
    MEMORY = 'MEMORY',
    LANGUAGE = 'LANGUAGE',
    REFLECTION = 'REFLECTION',
    LOGIC = 'LOGIC',
    AUDIO = 'AUDIO',
    ATTENTION = 'ATTENTION',
    DRAWING = 'DRAWING'
}

export enum QuestionType {
    MCQ = 'MCQ',
    TEXT = 'TEXT',
    IMAGE = 'IMAGE',
    TRUE_FALSE = 'TRUE_FALSE',
    NUMERIC = 'NUMERIC',
    DRAWING = 'DRAWING',
    AUDIO = 'AUDIO'
}

export enum AssignmentStatus {
    ASSIGNED = 'ASSIGNED',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED',
    EXPIRED = 'EXPIRED',
    CANCELLED = 'CANCELLED'
}

export enum SeverityLevel {
    NORMAL = 'NORMAL',
    MILD = 'MILD',
    MODERATE = 'MODERATE',
    SEVERE = 'SEVERE'
}

export enum DecisionType {
    SURVEILLANCE = 'SURVEILLANCE',
    ALERTE = 'ALERTE',
    CONSULTATION = 'CONSULTATION',
    URGENCE = 'URGENCE'
}

export enum DifficultyLevel {
    FACILE = 'FACILE',
    MOYEN = 'MOYEN',
    AVANCE = 'AVANCE'
}

export interface CognitiveTest {
    id?: number;
    titre: string;
    description?: string;
    type: TestType;
    difficultyLevel?: DifficultyLevel;
    totalScore?: number;
    durationMinutes?: number;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
    idUser?: number;
    questions?: TestQuestion[];
}

export interface TestQuestion {
    id?: number;
    test?: CognitiveTest;
    questionText: string;
    questionType: QuestionType;
    correctAnswer?: string;
    answerOptions?: string[]; // JSON list
    score: number;
    orderIndex?: number;
    timeLimitSeconds?: number;
    imageUrl?: string;
    explanation?: string;
    isRequired?: boolean;
}

export interface PatientTestAssignment {
    id?: number;
    patientId: number;
    test: CognitiveTest;
    assignedBy?: number;
    assignedDate?: string;
    dueDate?: string;
    status: AssignmentStatus;
    completedDate?: string;
    notes?: string;
    reminderSent?: boolean;
    reminderCount?: number;
    priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
}

export interface TestResult {
    id?: number;
    patientId: number;
    test?: CognitiveTest;
    assignmentId?: number;
    scoreTotale?: number;
    maxPossibleScore?: number;
    scorePercentage?: number;
    zScore?: number;
    percentile?: number;
    interpretation?: string;
    severityLevel?: SeverityLevel;
    testDate?: string;
    durationSeconds?: number;
    completionRate?: number;
    isValid?: boolean;
    flaggedReasons?: string;
    reviewedBy?: number;
    reviewedAt?: string;
}

export interface Decision {
    id?: number;
    patientId: number;
    testResult?: TestResult;
    decisionType?: DecisionType;
    riskLevel?: 'FAIBLE' | 'MOYEN' | 'ELEVE' | 'CRITIQUE';
    confidence?: number;
    explanation?: string;
    sourceType?: 'MANUAL' | 'AI_MODEL' | 'RULE_BASED' | 'HYBRID';
    createdAt?: string;
    createdBy?: string;
    approved?: boolean;
    approvedBy?: number;
    approvedAt?: string;
    recommendations?: Recommendation[];
}

export interface Recommendation {
    id?: number;
    decision?: Decision;
    action: string;
    priority?: 'FAIBLE' | 'MOYENNE' | 'ELEVEE' | 'URGENTE';
    targetRole?: 'MEDECIN' | 'AIDANT' | 'PATIENT';
    deadline?: string;
    status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DISMISSED';
    notes?: string;
    completedAt?: string;
    completedBy?: number;
}
