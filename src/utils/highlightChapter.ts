import { ChapterDetails } from "../interfaces/ChapterDetails";
import { closestParentTagElement } from "./utilFunctions";

export function highlightChapter(): void {
  let self = this;
  let targetElement: HTMLElement = self.element;

  let chapterList: HTMLElement[] = Array.from(
    self.element.querySelectorAll("psk-chapter")
  );

  self.activeChapter = null;
  const pageVerticalOffset: number = targetElement.scrollTop;
  const pageHeight: number = targetElement.offsetHeight;

  let chapterListDetails: ChapterDetails[] = _getChapterDetails(chapterList);

  _highlight.call(self, chapterListDetails, pageVerticalOffset, pageHeight);
}

function _getChapterDetails(chapterList: HTMLElement[]): ChapterDetails[] {
  let chapterListInfo: ChapterDetails[] = [];

  chapterList.forEach((chapter: HTMLElement): void => {
    const chapterId: string = chapter.getAttribute("guid");
    if (!chapterId) {
      return null;
    }

    const child: HTMLElement = chapter.getElementsByClassName("card psk-card")
      ? (chapter.getElementsByClassName("card psk-card")[0] as HTMLElement)
      : null;

    if (!child) {
      return null;
    }

    const verticalOffset: number = _getVerticalOffset(child, chapterListInfo);

    chapterListInfo.push({
      guid: chapterId,
      height: child.offsetHeight,
      verticalOffset: verticalOffset,
      title: chapter.title
    });
  });

  return chapterListInfo;
}

function _highlight(
  chapterListDetails: ChapterDetails[],
  pageVerticalOffset: number,
  pageHeight: number
): void {
  let self = this;

  /**
   * First, check if we have any chapter that is fully displayed.
   * If yes, this is the canditate.
   */
  let fullDisplayedChapter: ChapterDetails = chapterListDetails.find(
    (chapter: ChapterDetails): boolean => {
      return (
        pageVerticalOffset <= chapter.verticalOffset &&
        chapter.verticalOffset + chapter.height <=
          pageVerticalOffset + pageHeight
      );
    }
  );

  if (fullDisplayedChapter) {
    self.activeChapter = fullDisplayedChapter.guid;
    return;
  }
  /**
   * If no full chapter is displayed, then we should display the first chapter that has some visual
   */
  let lastChapterInView: ChapterDetails[] = chapterListDetails.filter(
    (chapter: ChapterDetails): boolean => {
      return (
        pageVerticalOffset >= chapter.verticalOffset &&
        (pageVerticalOffset + pageHeight <=
          chapter.verticalOffset + chapter.height ||
          pageVerticalOffset <= chapter.verticalOffset + chapter.height)
      );
    }
  );

  if (lastChapterInView.length > 0) {
    self.activeChapter = lastChapterInView[lastChapterInView.length - 1].guid;
    return;
  }

  /**
   * Last option. The first chapter is our canditate, as it should be the first chapter,
   * the scroll is on top of the page, and the chapter might be bigger than the browser's visual height
   */
  if (chapterListDetails.length > 0) {
    self.activeChapter = chapterListDetails[0].guid;
  }
}

function _getVerticalOffset(
  chapter: HTMLElement,
  chapterListInfo: ChapterDetails[]
): number {
  let vOffset: number = chapter.offsetTop;
  const vHeight: number = chapter.offsetHeight;
  let previousEntry: ChapterDetails = chapterListInfo[
    chapterListInfo.length - 1
  ]
    ? chapterListInfo[chapterListInfo.length - 1]
    : null;

  if (previousEntry) {
    let { verticalOffset, height } = previousEntry;

    if (
      verticalOffset > vOffset ||
      verticalOffset + height > vOffset + vHeight
    ) {
      const parentElement: HTMLElement = closestParentTagElement(
        chapter,
        "psk-chapter",
        2
      );
      const parent: ChapterDetails = chapterListInfo.find(
        (chapter: ChapterDetails): boolean => {
          return (
            parentElement && chapter.guid === parentElement.getAttribute("guid")
          );
        }
      );
      if (parent) {
        vOffset += parent.verticalOffset;
      }
    }
  }

  return vOffset;
}
