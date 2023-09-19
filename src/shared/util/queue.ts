export class Queue<T> {
  private a: T[] = [];
  private b: T[] = [];
  public push(...elts: T[]) {
    this.a.push(...elts);
  }

  private shuffleElements() {
    if (this.b.length === 0) {
      while (this.a.length > 0) {
        this.b.push(this.a.pop()!);
      }
    }
  }

  public shift(): T | undefined {
    this.shuffleElements();
    return this.b.pop();
  }

  public peek(): T | undefined {
    this.shuffleElements();
    return this.b[this.b.length - 1];
  }

  public length() {
    return this.a.length + this.b.length;
  }

  public getAtIndex(index: number) {
    if (index >= this.b.length) return this.a[index - this.b.length];
    else return this.b[this.b.length - 1 - index];
  }
}
