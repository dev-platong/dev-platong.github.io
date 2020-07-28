export function isVideoElement(a: any): a is HTMLVideoElement {
  if (!a || !a.tagName) {
    return false;
  }
  if (a.tagName === 'VIDEO') {
    return true;
  }
  return false;
}
