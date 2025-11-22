import { TestBed } from '@angular/core/testing';

<<<<<<<< HEAD:mobile/src/app/services/taskService/task.spec.ts
import { TaskService } from './task';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskService);
========
import { ClassService } from './class';

describe('Class', () => {
  let service: ClassService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClassService);
>>>>>>>> 5ecd4927ffe6236613e585ed0fb126130f7a86f3:mobile/src/app/services/classService/class.spec.ts
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
