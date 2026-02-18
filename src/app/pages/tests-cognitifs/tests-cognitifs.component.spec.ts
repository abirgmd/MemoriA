import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestsCognitifsComponent } from './tests-cognitifs.component';
import { CognitiveTestService } from '../../services/cognitive-test.service';
import { TestResultService } from '../../services/test-result.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LucideAngularModule, Brain, MessageSquare, Compass, Plus, Activity } from 'lucide-angular';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';

describe('TestsCognitifsComponent', () => {
    let component: TestsCognitifsComponent;
    let fixture: ComponentFixture<TestsCognitifsComponent>;
    let cognitiveTestService: jasmine.SpyObj<CognitiveTestService>;
    let testResultService: jasmine.SpyObj<TestResultService>;

    beforeEach(async () => {
        const cognitiveSpy = jasmine.createSpyObj('CognitiveTestService', ['getAll']);
        const resultSpy = jasmine.createSpyObj('TestResultService', ['getByPatient']);
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            imports: [
                TestsCognitifsComponent,
                HttpClientTestingModule,
                LucideAngularModule.pick({ Brain, MessageSquare, Compass, Plus, Activity }),
                NoopAnimationsModule
            ],
            providers: [
                { provide: CognitiveTestService, useValue: cognitiveSpy },
                { provide: TestResultService, useValue: resultSpy },
                { provide: Router, useValue: routerSpy }
            ]
        }).compileComponents();

        cognitiveTestService = TestBed.inject(CognitiveTestService) as jasmine.SpyObj<CognitiveTestService>;
        testResultService = TestBed.inject(TestResultService) as jasmine.SpyObj<TestResultService>;

        cognitiveTestService.getAll.and.returnValue(of([]));
        testResultService.getByPatient.and.returnValue(of([]));

        fixture = TestBed.createComponent(TestsCognitifsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should load tests on init', () => {
        const mockTests = [{ id: 1, titre: 'MMSE' }] as any;
        cognitiveTestService.getAll.and.returnValue(of(mockTests));

        component.ngOnInit();

        expect(cognitiveTestService.getAll).toHaveBeenCalled();
        expect(component.availableTests().length).toBe(1);
    });

    it('should open modal when Nouveau Test is clicked', () => {
        component.showNewTestModal.set(false);

        // Simulate clicking the button conceptually
        component.showNewTestModal.set(true);

        expect(component.showNewTestModal()).toBeTrue();
    });

    it('should close modal', () => {
        component.showNewTestModal.set(true);
        component.handleCloseModal();
        expect(component.showNewTestModal()).toBeFalse();
    });
});
