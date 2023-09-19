class KeyGen {
  private keysGenerated = new Map<string, number>();
  public generate(clientId: string): string {
    let keyCount = this.keysGenerated.get(clientId) || 0;
    this.keysGenerated.set(clientId, keyCount++);
    return `${clientId}-${keyCount}`;
  }
}

export const keyGen = new KeyGen();
