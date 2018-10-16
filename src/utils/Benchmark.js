import Filters from '../filters/Filters';

export default class Benchmark {
  constructor(tasks, images, onProgress) {
    this.tasks = tasks;
    this.images = images;
    this.onProgress = onProgress;
    this.filters = new Filters();
  }
  async run() {
    const results = [];
    await this.filters.build();
    for (const task of this.tasks) {
      const taskResult = await this.runTask(task);
      results.push(taskResult);
      this.onProgress(taskResult);
    };
    return results;
  }
  async runTask(task) {
    const results = [];
    this.images.forEach(async (image) => {
      const result = await this.filters.apply(task.name, image, task.config);
      results.push(result);
    });
    const duration = results.reduce((total, result) => total + result.duration, 0);
    const average = duration / this.images.length;
    return { duration, average, ...task };
  }
}
