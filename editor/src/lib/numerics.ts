export class Vector3 {
    x: number;
    y: number;
    z: number;

    constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    static zero(): Vector3 {
        return new Vector3(0, 0, 0);
    }

    static one(): Vector3 {
        return new Vector3(1, 1, 1);
    }

    static distance(a: Vector3, b: Vector3): number {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dz = a.z - b.z;

        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }

    magnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    normalize(): Vector3 {
        const mag = this.magnitude();

        if (mag === 0) 
          return new Vector3();
        
        return new Vector3(this.x / mag, this.y / mag, this.z / mag);
    }

    add(other: Vector3): Vector3 {
        return new Vector3(this.x + other.x, this.y + other.y, this.z + other.z);
    }

    subtract(other: Vector3): Vector3 {
        return new Vector3(this.x - other.x, this.y - other.y, this.z - other.z);
    }

    multiply(scalar: number): Vector3 {
        return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
    }

    divide(scalar: number): Vector3 {
        if (scalar === 0) 
          throw new Error('Cannot divide by zero');
        
        return new Vector3(this.x / scalar, this.y / scalar, this.z / scalar);
    }

    dot(other: Vector3): number {
        return this.x * other.x + this.y * other.y + this.z * other.z;
    }

    cross(other: Vector3): Vector3 {
        const x = this.y * other.z - this.z * other.y;
        const y = this.z * other.x - this.x * other.z;
        const z = this.x * other.y - this.y * other.x;
        
        return new Vector3(x, y, z);
    }
}