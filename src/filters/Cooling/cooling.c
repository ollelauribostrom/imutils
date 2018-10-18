#include <webassembly.h>

export uint8_t *create_buffer(int size)
{
  return malloc(size * sizeof(uint8_t));
}

export void destroy_buffer(uint8_t *p)
{
  free(p);
}

export int8_t *cooling(uint8_t *imageData, int width, int height, int size)
{
  int8_t *blurred = malloc(size * sizeof(uint8_t));
  for (int i = 0; i < size; i++)
  {
    blurred[i] = imageData[i] * imageData[i];
  }
  return blurred;
}
