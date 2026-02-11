import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { provideRouter } from '@angular/router';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  // it('should create the app', () => {
  //   const fixture = TestBed.createComponent(App);
  //   const app = fixture.componentInstance;
  //   expect(app).toBeTruthy();
  // });

  // it('should render title', async () => {
  //   const fixture = TestBed.createComponent(App);
  //   await fixture.whenStable();
  //   const compiled = fixture.nativeElement as HTMLElement;
  //   expect(compiled.querySelector('h1')?.textContent).toContain('Hello, mi_app_03');
  // });

  // it('should be true', () => {
  //   expect(true).toBe(true);
  // });
  // it('should be 4', () => {
  //   expect(2 + 2).toBe(4);
  // });

  // it('should not divide by 0', () => {
  //   let a = 2;
  //   let b = 1;
  //   let result = a / b;
  //   expect(result).not.toBe(Infinity);
  // });

  // it('should stop test execution when an expect fails', () => {
  //   const a = 2;
  //   const b = 2;

  //   // Este expect es correcto
  //   expect(a - b).toBe(0);

  //   // Este expect FALLA
  //   expect(a + b).toBe(5);

  //   // Este expect NO se ejecuta nunca
  //   expect(true).toBe(true);
  // });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should keep the title and subTitle unchanged', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    // app.subTitle.set('IES Gregorio Prieto');

    console.log('>>>Privado:', app['title']());
    console.log('>>>Publico:', app.subTitle());
    console.log('>>>Publico:', app.year);
    console.log('>>>Publico:', app.showTitleAndsubTitle());

    expect(app.year).toBe(new Date().getFullYear());
    expect(app['title']()).toBe('mi_app_03');
    expect(app.subTitle()).toBe('DWEC & Frameworks');
  });

  it('should return formatted title, subtitle and year', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    const result = app.showTitleAndsubTitle();

    expect(result).toContain('DWEC & Frameworks');
  });

  it('should render a router-outlet inside section.content', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    const compiled = fixture.nativeElement as HTMLElement;

    console.log('>>>Render:', compiled.innerHTML);

    // router-outlet existe
    const routerOutlet = compiled.querySelector('router-outlet');
    expect(routerOutlet).toBeTruthy();

    // router-outlet está dentro de section.content
    const contentSection = compiled.querySelector('section.content');
    console.log('>>>Render section.content:', contentSection?.innerHTML);
    console.log('>>>Render class section.content:', contentSection?.classList.value);

    expect(contentSection).toBeTruthy();
    expect(contentSection?.querySelector('router-outlet')).toBeTruthy();
  });
  it('should render header with class brand-name', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    const header = compiled.querySelector('header');
    expect(header?.classList).toContain('brand-name');
  });
  it('should render brand logo and link to "/"', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    const compiled = fixture.nativeElement as HTMLElement;

    // existe el logo dentro del header y tiene la imagen correcta
    const logo = compiled.querySelector(
      'header.brand-name>img.brand-logo',
    ) as HTMLImageElement | null;
    expect(logo).toBeTruthy();
    expect(logo?.src).toContain('/images/logo.svg');

    // existe el enlace que envuelve header/logo
    const header = compiled.querySelector('header.brand-name');
    const link = header?.parentElement as HTMLAnchorElement | null;

    expect(link).toBeTruthy();
    expect(link?.getAttribute('href')).toBe('/');
  });
  it('should apply auxStyle on aux section', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const section = compiled.querySelector('section.aux') as HTMLElement;

    expect(section.style.textAlign).toBe('center');
    expect(section.style.marginTop).toBe('100px');
  });
  it('should not render footer element', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    const footer = compiled.querySelector('footer');
    expect(footer).toBeNull();
  });
  it('should increase clicks when buttons are clicked', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll('button.btn-test');
    expect(buttons).toBeTruthy();

    const button1 = buttons[0] as HTMLButtonElement;
    const button2 = buttons[1] as HTMLButtonElement;

    button1.click(); //+1
    button1.click(); //+1
    button2.click(); //+2
    button1.click(); //1
    fixture.detectChanges();

    const counter = compiled.querySelector('.click-counter') as HTMLElement;
    expect(counter.textContent).toContain('5');
    expect(app.clicks).toBe(5);
  });
});
