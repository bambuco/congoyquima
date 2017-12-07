import { Directive, ElementRef, Input, Renderer2, OnInit } from '@angular/core';

@Directive({ 
  selector: '[tepuy-random]',
  host: {  }
})
export class TepuyRandomDirective implements OnInit {
  @Input('tepuy-random') range: string;
  pool: Array<any>;
  value: string;

  constructor(private el: ElementRef, private renderer: Renderer2) 
  {

  }

  ngOnInit(){
    this.preparePool();
    this.randomize();
  }

  randomize(){
    this.value = this.pool[this.randomInt(0, this.pool.length - 1)];
    this.renderer.setAttribute(this.el.nativeElement, "data-value", this.value);
    if (this.el.nativeElement.value) {
      this.el.nativeElement.value = this.value;
    }
    else {
      this.el.nativeElement.innerText = this.value;
    }
  }

  preparePool(){
    let zippedpool = this.range.split(',');
    this.pool = [];

    for(let item of zippedpool){
      if (/^\d+-\d+$/.test(item)){
        let parts = item.split('-');
        let a:number, b:number;
        a = parseInt(parts[0]);
        b = parseInt(parts[1]);
        if (a > b) {
          a = b;
          b = parseInt(parts[0]);
        }

        for(var i = a; i <= b; i++) {
          this.pool.push(i);
        }
      }
      else {
        this.pool.push(item);
      }
    }
  }

  randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  randomFloat(min, max){
    return Math.random() * (max - min) + min;
  }
}
