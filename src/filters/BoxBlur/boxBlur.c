#include <webassembly.h>

export uint8_t* create_buffer(int size) {
  return malloc(size * sizeof(uint8_t));
}

export void destroy_buffer(uint8_t* p) {
  free(p);
}

export int8_t* boxBlur(uint8_t *imageData, int width, int height, int size) {
  int8_t *blurred = malloc(size * sizeof(uint8_t));
  for (int i = 0; i < size; i++) {
    uint8_t avg = (
      ((i - 4) - (i - (4 * width))) >= 0 ? imageData[(i - 4) - (i - (4 * width))] : imageData[i] +
      ((i - (4 * width))) >= 0 ? imageData[i - (4 * width)] : imageData[i] +
      ((i + 4) - (i - (4 * width))) >= 0 ? imageData[(i + 4) - (i - (4 * width))] : imageData[i] +
      (i - 4) >= 0 ? imageData[i - 4] : imageData[i] +
      imageData[i] +
      (i + 4) < size ? imageData[i + 4] : imageData[i] +
      ((i - 4) + (i + (4 * width))) < size ? imageData[(i - 4) + (i + (4 * width))] : imageData[i] +
      ((i + (4 * width))) < size ? imageData[(i + (4 * width))] : imageData[i] +
      ((i + 4) + (i + (4 * width))) < size ? imageData[(i + 4) + (i + (4 * width))] : imageData[i]
    ) / 9 ;
    blurred[i] = width;
  }
  return blurred;
} 
