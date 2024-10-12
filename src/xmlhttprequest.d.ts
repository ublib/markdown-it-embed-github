declare module "xmlhttprequest" {
  export class XMLHttpRequest {
    open(method: string, url: string, async?: boolean, user?: string, password?: string): void;
    send(data?: string): void;
    get responseText(): string;
  }
}
