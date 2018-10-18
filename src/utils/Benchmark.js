import Filters from '../filters/Filters';

export default class Benchmark {
  constructor(tasks, images, onProgress) {
    this.tasks = tasks;
    this.images = images;
    this.onProgress = onProgress;
    this.filters = new Filters();
  }
  async run() {
    await this.filters.build();
    return Promise.all(
      this.tasks.map(async task => {
        const taskResult = await this.runTask(task);
        this.onProgress(taskResult);
        return taskResult;
      })
    );
  }
  async runTask(task) {
    const results = [];
    await Promise.all(
      this.images.map(async image => {
        const result = await this.filters.apply(task.name, image, task.config);
        results.push(result);
      })
    );
    const duration = results.reduce((total, result) => total + result.duration, 0);
    const average = duration / this.images.length;
    return { duration, average, ...task };
  }
}
