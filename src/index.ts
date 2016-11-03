import { Directive, ElementRef, Renderer } from 'angular2/core';

@Directive({
  selector: '[elasticInput]'
})
export class ElasticInputDirective {

  private keyUpListener:  Function;
  private submitListener: Function;
  private initialHeight:  number;
  private inputNode:      any;
  private formNode:       any;

  constructor(private elementRef: ElementRef, private renderer: Renderer) {
    this.keyUpListener = renderer.listen(this.elementRef.nativeElement, 'keyup', (event: any) => { this.onKeyUp(event); });
  }

  ngAfterViewInit() {
    this.initFormNode();

    this.submitListener = this.renderer.listen(this.formNode, 'submit', (event: any) => { this.reset(event); })
  }

  ngOnDestroy() {
    // Stop listening to events
    this.keyUpListener();
    this.submitListener();
  }

  private initFormNode() {
    let parentNode = this.elementRef.nativeElement.parentNode;

    while (parentNode != null) {
      if (parentNode.localName == "form") {
        this.formNode = parentNode;
        break;
      }

      parentNode = parentNode.parentNode;
    }
  }

  private onKeyUp(event: any) {
    this.inputNode = event.target;

    if (this.initialHeight == null) {
      this.initialHeight = this.inputNode.clientHeight;
    }

    this.inputNode.style.height = 'auto'; // Reset height in case user starts deleting text
    this.inputNode.style.height = `${this.inputNode.scrollHeight}px`;

    // Keep the scroll position at the bottom so user can see what she's typing on mobile
    this.inputNode.scrollTop = this.inputNode.scrollHeight;
  }

  public reset(event: any) {
    this.inputNode.style.height = `${this.initialHeight}px`;
    this.inputNode.scrollTop = 0;
  }
}
