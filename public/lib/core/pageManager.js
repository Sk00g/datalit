export class PageManager {
  constructor(eventManager) {
    this.eventManager = eventManager;

    this.pageStack = [];
  }

  peek() {
    return this.pageStack.length > 0 ? this.pageStack[this.pageStack.length - 1] : null;
  }

  popPage() {
    oldPage = this.pageStack.pop();
    oldPage.deactivate();

    if (this.peek()) {
      this.peek().activate();
    }
  }

  changePage(page) {
    while (this.peek()) {
      page = this.pageStack.pop();
      page.deactivate();
    }

    this.pushPage(page);
  }

  pushPage(page) {
    if (this.peek()) this.peek().deactivate();

    this.pageStack.push(page);
    page.activate();
  }

  update(elapsed) {
    this.peek().update(elapsed);
  }

  draw(context) {
    this.peek().draw(context);
  }
}
