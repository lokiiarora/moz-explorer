
// This class is used to keep track of all the resources that are being loaded asynchronously
export class ResourceRegistry {
  private static ASYNC_LOADABLES: Promise<unknown>[] = [];

  public static addLoadable<T>(promise: Promise<T>) {
    this.ASYNC_LOADABLES.push(promise);
    return promise;
  }

  public static whenAllLoaded() {
    return Promise.all(this.ASYNC_LOADABLES).then(() => {
      this.ASYNC_LOADABLES = [];
    });
  }
}