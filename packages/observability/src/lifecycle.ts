export function resolveWithin<T>(
  task: Promise<T>,
  timeoutMilliseconds: number,
  fallback: T,
): Promise<T> {
  return new Promise<T>((resolve) => {
    let completed = false;

    const finish = (value: T): void => {
      if (completed) {
        return;
      }

      completed = true;
      clearTimeout(timeoutHandle);
      resolve(value);
    };

    const timeoutHandle = setTimeout(
      () => finish(fallback),
      Math.max(0, timeoutMilliseconds),
    );

    void task.then(finish, () => finish(fallback));
  });
}
