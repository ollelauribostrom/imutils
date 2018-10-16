#include <webassembly.h>

export uint8_t* create_buffer(int size) {
  return malloc(size * sizeof(uint8_t));
}

export void destroy_buffer(uint8_t* p) {
  free(p);
}

export int8_t* boxBlur(uint8_t *imageData, int size) {
  int8_t *output = malloc(size * sizeof(uint8_t));
  for (int i = 0; i < size; i++) {
    output[i] = imageData[i] * imageData[i];
  }
  return output;
} 
