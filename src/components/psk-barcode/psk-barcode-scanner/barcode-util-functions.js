function isMobile(restrict) {
  if (restrict) return false;
  let userAgentKey ='userAgent';
  let sUserAgent = navigator[userAgentKey].toLowerCase();
  let bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
  let bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
  let bIsMidp = sUserAgent.match(/midp/i) == "midp";
  let bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
  let bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
  let bIsAndroid = sUserAgent.match(/android/i) == "android";
  let bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
  let bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
  return bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM;
}

function getScaledDim(img, maxWidth, maxHeight) {
  let scaled = {
    ratio: img.width / img.height,
    width: img.width,
    height: img.height
  }
  if (scaled.width > maxWidth) {
    scaled.width = maxWidth;
    scaled.height = scaled.width / scaled.ratio;
  }
  if (scaled.height > maxHeight) {
    scaled.height = maxHeight;
    scaled.width = scaled.height / scaled.ratio;
  }

  return scaled;

}

/* https://stackoverflow.com/questions/59287928/algorithm-to-create-a-polygon-from-points */
function polySort(points) {
  function squaredPolar(point, centre) {
    return [
      Math.atan2(point[1] - centre[1], point[0] - centre[0]),
      (point[0] - centre[0]) ** 2 + (point[1] - centre[1]) ** 2 // Square of distance
    ];
  }

  // Get "centre of mass"
  let centre = [points.reduce((sum, p) => sum + p[0], 0) / points.length,
    points.reduce((sum, p) => sum + p[1], 0) / points.length];

  // Sort by polar angle and distance, centered at this centre of mass.
  for (let point of points) point.push(...squaredPolar(point, centre));
  points.sort((a, b) => a[2] - b[2] || a[3] - b[3]);
  // Throw away the temporary polar coordinates
  for (let point of points) point.length -= 2;
}



export default{
  isMobile, polySort, getScaledDim
}
