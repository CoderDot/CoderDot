class Point {
  constructor(x, y , userData) {
    this.x = x;
    this.y = y;
    this.userData = userData;
  }
}

class Rectangle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  contains(point) {
    return (
      this.x < point.x &&
      this.y < point.y &&
      this.x + this.w > point.x &&
      this.y + this.h > point.y
    );
  }

  intersects(rect) {
    return (
      this.x < rect.x + rect.w &&
      this.x + this.w > rect.x &&
      this.y < rect.y + rect.h &&
      this.y + this.h > rect.y
    );
  }
}

class QuadTree {
  constructor(boundary, capacity) {
    this.boundary = boundary;
    this.capacity = capacity;
    this.divided = false;
    this.points = [];
  }

  subdivide() {
    let x = this.boundary.x;
    let y = this.boundary.y;
    let w = this.boundary.w;
    let h = this.boundary.h;

    let tl = new Rectangle(x, y, w / 2, h / 2);
    this.topLeft = new QuadTree(tl, this.capacity);
    let tr = new Rectangle(x + w / 2, y, w / 2, h / 2);
    this.topRight = new QuadTree(tr, this.capacity);
    let br = new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2);
    this.bottomRight = new QuadTree(br, this.capacity);
    let bl = new Rectangle(x, y + h / 2, w / 2, h / 2);
    this.bottomLeft = new QuadTree(bl, this.capacity);
    this.divided = true;
  }

  query(range, found) {
    if (!found) {
      found = [];
    }

    if (!this.boundary.intersects(range)) {
      return;
    } else {
      if (!this.divided) {
        return;
      }

      for (let p of this.points) {
        found.push(p);
      }

      this.topLeft.query(range, found);
      this.topRight.query(range, found);
      this.bottomRight.query(range, found);
      this.bottomLeft.query(range, found);
    }

    return found;
  }

  insert(point) {
    if (!this.boundary.contains(point)) {
      return;
    }
    if (this.points.length < this.capacity) {
      this.points.push(point);
    } else {
      if (!this.divided) {
        this.subdivide();
      }

      this.topLeft.insert(point);
      this.topRight.insert(point);
      this.bottomRight.insert(point);
      this.bottomLeft.insert(point);
    }
  }

  show() {
    stroke(255);
    noFill();
    rect(this.boundary.x, this.boundary.y, this.boundary.w, this.boundary.h);
    if (this.divided) {
      this.topLeft.show();
      this.topRight.show();
      this.bottomLeft.show();
      this.bottomRight.show();
      for (let i = 0; i < this.points.length; i++) {
        noStroke();
        fill(255);
        ellipse(this.points[i].x, this.points[i].y, 5, 5);
      }
    }
  }
}
