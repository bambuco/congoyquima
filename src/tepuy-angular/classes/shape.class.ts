export type ShapeType = "circle" | "rect" | "poly";

export class Shape {
  type: ShapeType;
  correct: boolean;
  coords: number[];
  data: any;
  state: string;  

  private boundingRect:number[]; //[x, y, w, h]
  private pixels:number[];

  constructor(){

  }

  /**
   * Convert a percentage position to a pixel position.
   */
  toPixels(image: HTMLImageElement): number[] {
    switch (this.type) {
      case "circle":
        this.pixels = [(image.clientWidth / 100) * this.coords[0],
          (image.clientHeight / 100) * this.coords[1],
          (image.clientHeight / 100) * this.coords[2]
        ];
        break;
      case "rect":
        this.pixels = [];
        this.pixels.push((image.clientWidth / 100) * this.coords[0]);
        this.pixels.push((image.clientHeight / 100) * this.coords[1]);
        this.pixels.push((image.clientWidth / 100) * (this.coords[2]));
        this.pixels.push((image.clientHeight / 100) * (this.coords[3]));
        break;
      case "poly":
        this.pixels = [];
        for(var i = 0; i < this.coords.length; i+=2) {
          this.pixels.push((image.clientWidth / 100) * this.coords[i]);
          this.pixels.push((image.clientHeight / 100) * this.coords[i+1]);
        }
        break;
    }
    return this.pixels;
  }

  contains(point) {
    switch (this.type) {
      case "circle":
        return this.inCircle(point);

      case "rect":
        return this.inRect(point);
      
      case "poly":
        return this.pointInPolyWindingNumber(point);
      default:
        return false;
    }
  }


  private inRect(point) {
    if (!this.boundingRect) {
      this.setBoundingRect();
    }
    return  (this.boundingRect[0] <= point[0]) && ((this.boundingRect[0] + this.boundingRect[2]) >= point[0]) &&
          (this.boundingRect[1] <= point[1]) && ((this.boundingRect[1] + this.boundingRect[3]) >= point[1]);
  }

  private inCircle(point){
    const x = point[0] - this.pixels[0];
    const y = point[1] - this.pixels[1];
    const r = this.pixels[2];
    return ((x * x) + (y * y)) < (r * r); // distance ^ 2  < radius ^ 2
  }



  /**
   * Returns whether a point is in a polygon using a winding number test
   *
   * Algorithm by Dan Sunday: http://geomalgorithms.com/a03-_inclusion.html
   *
   * @param point {Array} should be a 2-item array of coordinates
   * @param polygon {Array} should be an array of 2-item arrays of coordinates.
   * @return {boolean} true if inside, false if outside
   */
  private pointInPolyWindingNumber(point) {
    if (this.pixels.length === 0) {
      return false;
    }

    if (!this.inRect(point)) {
      return false;
    }

    var n = this.pixels.length;
    var newPoints = this.pixels.slice(0);
    newPoints.push(this.pixels[0]);
    newPoints.push(this.pixels[1]);
    var wn = 0; // wn counter

    // loop through all edges of the polygon
    for (var i = 0; i < n; i+=2) {
      if (newPoints[i+1] <= point[1]) {
        if (newPoints[i + 3] > point[1]) {
          if (this.isLeft([newPoints[i], newPoints[i+1]], [newPoints[i + 2],newPoints[i + 3]], point) > 0) {
            wn++;
          }
        }
      } else {
        if (newPoints[i + 3] <= point[1]) {
          if (this.isLeft([newPoints[i],newPoints[i+1]], [newPoints[i + 2],newPoints[i + 3]], point) < 0) {
            wn--;
          }
        }
      }
    }
    // the point is outside only when this winding number wn===0, otherwise it's inside
    return wn !== 0;
  }

  /**
   * Tests if a point is Left|On|Right of an infinite line.
   *
   * See http://geomalgorithms.com/a01-_area.html
   *
   * @param p0 {object} x,y point
   * @param p1 {object} x,y point
   * @param p2 {object} x,y point
   * @returns {number}
   *  >0 for P2 left of the line through P0 and P1,
   *  =0 for P2  on the line,
   *  <0 for P2  right of the line
   */
  private isLeft(p0, p1, p2) {
    return ( (p1[0] - p0[0]) * (p2[1] - p0[1]) ) -
      ((p2[0] - p0[0]) * (p1[1] - p0[1]) );
  }

  private setBoundingRect() {
    if (this.type == 'circle') return; //it does not apply

    if (this.type == 'rect') {
      this.boundingRect = this.pixels.slice(0); //it is the same as the rect.
      return;
    }

    const n = this.pixels.length;
    let minx = this.pixels[0], maxx=minx, miny = this.pixels[1], maxy = miny;

    for(let i = 2; i < n; i+=2) {
      if (this.pixels[i] < minx) {
        minx = this.pixels[i];
      }
      if (this.pixels[i] > maxx) {
        maxx = this.pixels[i];
      }
      if (this.pixels[i+1] < miny) {
        miny = this.pixels[i+1];
      }
      if (this.pixels[i+1] > maxy) {
        maxy = this.pixels[i+1];
      }
    }
    this.boundingRect = [minx, miny, maxx, maxy];
  }

}

