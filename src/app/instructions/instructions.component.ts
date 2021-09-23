import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import {animate, transition, state, trigger, style} from '@angular/animations';


@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.css'],
  animations: [
    trigger('toggleButton', [
      state("Hide Image", style({
        transform: "translateY(0px)",
      })),
      state("Show Image", style({
        transform: "translateY(-{{retracted}}px)",
      }),
      {params: {retracted: "0px"}}),
      transition("* => *", animate('500ms ease-in-out')),
    ]),
    trigger('toggleImage', [
      state("Hide Image", style({
        transform: "translateY(0px)",
      })),
      state("Show Image", style({
        transform: "translateY(-{{retracted}}px)",
      }),
      {params: {retracted: "0px"}}),
      transition("* => *", animate('500ms ease-in-out')),
    ])
  ]
})

export class InstructionsComponent implements OnInit {

  @ViewChild('imageContainer') imageContainer;
  @ViewChild('buttonContainer') buttonContainer;
  @ViewChild('image') image;
  @ViewChild('heightBalancer') heightBalancer;
  @ViewChild('ref') ref;
  @ViewChild('arrow') arrow;

  toggleMessage = "Hide Image";

  mouseDown = false;
  scrolled = false;

  imgHeight: number;
  imgOffset: number;

  bounce = false;
  skip = false;

  currentScrollPos = 0;

  noScrollEl: HTMLStyleElement;

  //scrolling = true;
  scrollEnd = true;
  endCB = null;
  //imgChanged = false;


  constructor(private changeDetector: ChangeDetectorRef) { }

  updatePosition() {
    if(this.image.nativeElement.offsetHeight > 0) {
      this.imgHeight = this.image.nativeElement.offsetHeight;
      this.imgOffset = this.imgHeight + 10;
    }
    requestAnimationFrame(() => {
      if(this.scrollEnd || this.toggleMessage == "Show Image") {
        this.currentScrollPos = window.pageYOffset;
        let height = Math.max(this.currentScrollPos - 125, 0);
        this.heightBalancer.nativeElement.style.height = height + 'px';
        this.buttonContainer.nativeElement.style.top = height + this.imgHeight - 15 + 'px';
        //this.imgChanged = false;

        if(this.currentScrollPos != window.pageYOffset) {
          window.scrollTo(window.pageXOffset, this.currentScrollPos);
        }
      }

      
      
      //this.bounce = !this.bounce;
      
      // setTimeout(() => {
      //   
      //   this.updatePosition();
      // }, throttle);
      this.updatePosition();
    });
    //}
    //this.bounce = !this.bounce;
  }

  ngOnInit() {
    // this.buttonRetract = 0;
    // this.buttonExpand = 182;
    this.imgHeight = 182;
    this.imgOffset = 190;

    // requestAnimationFrame(() => {
    //   this.hover("../assets/instruction_images/lc_vis.PNG");
    this.updatePosition();
    // });

    //let throttlePeriod = 

    

    //this.noScrollEl = this.buildStyleElement()

    // let __this = this;

    // let bounceSentinal = new MutationObserver((mutationsList, observer) => {
    //   __this.bounce = false;
    //   console.log("!");
    // });
    // bounceSentinal.observe(document, {attributes: true , childList: true, subtree: true});

    let endThreshold = 200
    document.addEventListener('scroll', (e) => {
      this.scrollEnd = false;
      if(this.endCB != null) {
        clearTimeout(this.endCB);
      }
      this.endCB = setTimeout(() => {
        this.scrollEnd = true;
        this.endCB = null;
      }, endThreshold);

    });

    // let observer = new MutationObserver((mutations, observer) => {
    //   if(this.toggleMessage == "Hide Image") {
    //     let imghDelta = this.image.nativeElement.offsetHeight - this.imgHeight;
    //     this.imgHeight = this.image.nativeElement.offsetHeight;
    //     this.imgOffset = this.imgHeight + 10;
    //     this.buttonContainer.nativeElement.style.top = parseInt(this.buttonContainer.nativeElement.style.top) + imghDelta + 'px';
    //   }
    // });

    // observer.observe(this.image.nativeElement, {attributes: true});

    // document.addEventListener('scroll', (e) => {
      
    //   // if(e.timeStamp - this.lastTimestamp < 10) {
    //   //   this.lastTimestamp = e.timeStamp;
    //   //   return;
    //   // }
    //   // this.lastTimestamp = e.timeStamp;
    //   // if(!this.bounce) {
    //   if(this.skip) {
    //     this.skip = false;
    //     return;
    //   }

    //   if(!this.bounce) {
    //     let test = window.pageYOffset;
    //     setTimeout(() => {
    //       console.log(test - window.pageYOffset)
    //     }, 100);
    //     console.log(this.currentScrollPos - window.pageYOffset)
    //     //console.log(this.test++);
    //     this.bounce = true;

    //     this.currentScrollPos = window.pageYOffset;

    //     let height = Math.max(this.currentScrollPos - 125, 0);
    //     this.heightBalancer.nativeElement.style.height = height + 'px';
    //     this.buttonContainer.nativeElement.style.top = height + this.imgHeight - 15 + 'px';
    //     // });
        
    //     //console.log(window.pageYOffset < this.currentScrollPos)
    //     if(window.pageYOffset != this.currentScrollPos) {
    //       // requestAnimationFrame(() => {
    //       //   console.log("Test");
    //       // });
    //       this.skip = true;
    //       //console.log("end");
    //       this.bounce = false;
    //     }
    //     else {
    //       this.bounce = false;
    //     }
    //     // else {
    //     //   console.log("end");
    //     //   this.bounce = false;
    //     // }
    //     // this.bounce = false;
    //     //document.body.removeChild(this.noScrollEl);
    //     // setTimeout(() => {
    //     //   this.bounce = false;
    //     // }, 1000);
        
    //   }
      
    //   // }
    // });

    window.addEventListener("resize", () => {
      if(this.toggleMessage == "Hide Image") {
        let height = Math.max(this.currentScrollPos - 125, 0);

        // this.imgHeight = this.image.nativeElement.offsetHeight;
        // this.imgOffset = this.imgHeight + 10;
  
        this.buttonContainer.nativeElement.style.top = height + this.imgHeight - 15 + 'px';
      }
    });
  }

  hover(src) {
    this.image.nativeElement.setAttribute("src", src);
    this.ref.nativeElement.setAttribute("href", src);

    if(this.toggleMessage == "Hide Image") {
      let height = Math.max(this.currentScrollPos - 125, 0);

      this.buttonContainer.nativeElement.style.top = height + this.imgHeight - 15 + 'px';
    }
    
  }

  toggleImage() {
    if(this.toggleMessage == "Hide Image") {
      this.imageContainer.nativeElement.style.display = "none";
      this.arrow.nativeElement.innerHTML = "&#187;";
      this.toggleMessage = "Show Image";
    }
    else {
      this.imageContainer.nativeElement.style.display = "block";
      let height = Math.max(window.pageYOffset - 125, 0);
      this.imgHeight = this.image.nativeElement.offsetHeight;
      this.imgOffset = this.imgHeight + 10;
      this.buttonContainer.nativeElement.style.top = height + this.imgHeight - 15 + 'px';
      setTimeout(() => {
        this.arrow.nativeElement.innerHTML = "&#171;";
        this.toggleMessage = "Hide Image";
      }, 0);
    }
  }

}
