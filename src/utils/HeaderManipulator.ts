export class HeaderManipulator {
  constructor(private readonly headers: Record<string, string[]>) {}

  record() {
    return this.headers;
  }

  get(header: string): string | undefined {
    let value: string | undefined = undefined;
    this.find(header, (key) => (value = key));
    return value;
  }

  delete(header: string) {
    this.find(header, (key) => delete this.headers[key]);
  }

  set(header: string, value: string[]) {
    this.delete(header);
    this.headers[header] = value;
  }

  modify(header: string, callback: (value: string) => string) {
    this.find(
      header,
      (key) => (this.headers[key] = this.headers[key].map(callback))
    );
  }

  private find(header: string, callback: (key: string) => void) {
    const regExp = new RegExp("^" + header + "$", "i");

    for (let key in this.headers) {
      if (this.headers.hasOwnProperty(key) && regExp.test(key)) {
        callback(key);
      }
    }
  }
}
