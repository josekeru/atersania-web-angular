import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageModalComponent } from './message-modal.component';
import { By } from '@angular/platform-browser';

describe('MessageModalComponent', () => {
  let component: MessageModalComponent;
  let fixture: ComponentFixture<MessageModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the modal component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title and message', () => {
    component.title = 'Test Title';
    component.message = 'This is a test message';
    component.isVisible = true;
    fixture.detectChanges();

    const titleEl = fixture.debugElement.query(By.css('h2')).nativeElement;
    const messageEl = fixture.debugElement.query(By.css('.modal-body p')).nativeElement;

    expect(titleEl.textContent).toContain('Test Title');
    expect(messageEl.textContent).toContain('This is a test message');
  });

  it('should hide the modal when close button is clicked', () => {
    component.isVisible = true;
    fixture.detectChanges();

    const closeButton = fixture.debugElement.query(By.css('.close-btn'));
    closeButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.isVisible).toBeFalse();
  });

  it('should emit "closed" event when close() is called', () => {
    spyOn(component.closed, 'emit');

    component.close();

    expect(component.closed.emit).toHaveBeenCalled();
  });

  it('should hide modal when "Aceptar" button is clicked', () => {
    component.isVisible = true;
    fixture.detectChanges();

    const acceptButton = fixture.debugElement.query(By.css('.btn-primary'));
    acceptButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.isVisible).toBeFalse();
  });
});
