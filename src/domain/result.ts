export type Success<T> = {
  isSuccess: true;
  value: T;
};

export type Failure<E> = {
  isSuccess: false;
  error: E;
};

export type Result<T, E> = Success<T> | Failure<E>;

export const success = <T>(value: T): Success<T> => ({
  isSuccess: true,
  value,
});

export const failure = <E>(error: E): Failure<E> => ({
  isSuccess: false,
  error,
});
