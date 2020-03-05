import PskScrollEvent from "../events/ScrollEvent";

export function format(first: string, middle: string, last: string): string {
  return (
    (first || "") + (middle ? ` ${middle}` : "") + (last ? ` ${last}` : "")
  );
}

export function scrollToElement(
  elementId: string,
  htmlView: HTMLElement
): void {
  const selector = elementId.replace(/( |:|\/|\.)/g, "-").toLowerCase();
  const chapterElm = htmlView.querySelector(`#${selector}`);

  if (!chapterElm) {
    return;
  }

  chapterElm.scrollIntoView({
    behavior: "smooth"
  });

  let basePath = window.location.href;
  let queryOperator = "?";
  if (basePath.indexOf("chapter=") !== -1) {
    basePath = window.location.href.split("chapter=")[0];
    if (basePath.length > 0) {
      queryOperator = basePath[basePath.length - 1];
      basePath = basePath.substring(0, basePath.length - 1);
    }
  } else {
    queryOperator = basePath.indexOf("?") > 0 ? "&" : "?";
  }
  let chapterKey = `${queryOperator}chapter=`;
  window.history.pushState({}, "", `${basePath}${chapterKey}${selector}`);
}
//TODO refactor this
/**
 * @deprecated You should create your own Event. See /events/PskButtonEvent.ts example
 * @param eventName
 * @param options
 * @param trigger
 * @param triggerElement
 */
export function createCustomEvent(
  eventName: string,
  options: any,
  trigger: boolean = false,
  triggerElement: HTMLElement = null
) {
  const customEvent = new CustomEvent(eventName, options);

  if (trigger) {
    if (triggerElement) {
      triggerElement.dispatchEvent(customEvent);
    } else {
      document.dispatchEvent(customEvent);
    }
  }
}

export function closestParentElement(
  el: HTMLElement,
  selector: string,
  stopSelector?: string
): HTMLElement {
  let retval = null;
  while (el) {
    if (el.matches(selector)) {
      retval = el;
      break;
    } else if (stopSelector && el.matches(stopSelector)) {
      break;
    }
    el = el.parentElement;
  }
  return retval;
}

export function normalizeInnerHTML(source: string = ""): string {
  return source.replace(/<!----->/g, "").replace(/<!---->/g, "");
}

export function normalizeCamelCaseToDashed(source: string): string {
  return source
    .split("")
    .map((letter: string) => {
      if (letter === letter.toLowerCase()) {
        return letter;
      }

      return `-${letter.toLowerCase()}`;
    })
    .join("");
}

/**
 *
 * @param source
 * @param regex
 * @param replaceString
 * @param applyCallback - A callback function that will be applyed to the string result
 */
export function normalizeRegexToString(
  source: string,
  regex: RegExp,
  replaceString: string,
  applyCallback: Function = null
): string {
  let result = source.replace(regex, replaceString);
  if (applyCallback) {
    return applyCallback(result);
  }
  return result;
}

export function canAttachShadow(tagName: string): boolean {
  if (tagName.startsWith("psk-")) {
    return true;
  }

  const found = [
    "article",
    "aside",
    "blockquote",
    "body",
    "div",
    "footer",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "header",
    "main",
    "nav",
    "p",
    "section",
    "span"
  ].find((htmlTag: string) => htmlTag === tagName);

  return found === tagName;
}

export function highlightCurentChapter(evt: PskScrollEvent) {
  let self = this;

  const scrollSectionElement: HTMLElement = evt.parentEventData
    && evt.parentEventData as HTMLElement;
  if (!scrollSectionElement) {
    return;
  }

  self.activeChapter = null;
  let foundChapterId: string = null;
  let lastChapterVerticalOffset: number = 0;

  let chapterList: Array<HTMLElement> = Array.from(self.element.querySelectorAll('psk-chapter'));
  chapterList.forEach((chapter: HTMLElement) => {
    if (foundChapterId !== null || self.activeChapter !== null) {
      return;
    }

    const chapterId: string = chapter.getAttribute('guid');
    if (!chapterId) {
      return;
    }

    const child: HTMLElement = chapter.getElementsByTagName('psk-card') ?
      chapter.getElementsByTagName('psk-card')[0] : null;

    if (child === null) {
      return;
    }

    let chapterVerticalOffset: number = 0;
    if (lastChapterVerticalOffset >= child.offsetTop) {
      chapterVerticalOffset = lastChapterVerticalOffset + child.offsetTop;
    } else {
      chapterVerticalOffset = child.offsetTop;
    }

    const pageVerticalOffset: number = scrollSectionElement.scrollTop;

    if (pageVerticalOffset >= lastChapterVerticalOffset
      && pageVerticalOffset <= chapterVerticalOffset) {
      foundChapterId = chapterId;
      self.activeChapter = foundChapterId;
    }

    lastChapterVerticalOffset = chapterVerticalOffset;
  });

  if (chapterList.length > 0) {
    self.activeChapter = foundChapterId
      ? foundChapterId
      : chapterList[0].getAttribute('guid');
  }
}