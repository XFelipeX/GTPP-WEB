export function convertImage(src) {
    if (src != null) {
      var image = new Image();
      image.src = "data:image/jpeg;base64, " + src;
      return image.src;
    } else {
      return null;
    }
  }