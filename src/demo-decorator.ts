export function Demo(
  demoInstance: Object,
  isDemoEnabled: () => boolean,
): <TFunction extends Function>(target: TFunction) => TFunction {
  return function x(target) {
    for (const propertyName of Object.getOwnPropertyNames(target.prototype)) {
      const descriptor = Object.getOwnPropertyDescriptor(
        target.prototype,
        propertyName,
      );
      if (descriptor) {
        const isMethod = descriptor.value instanceof Function;
        if (!isMethod) {
          continue;
        }

        const originalMethod = descriptor.value;
        descriptor.value = function (...args: any[]) {
          if (isDemoEnabled()) {
            if (typeof demoInstance[propertyName] === 'function') {
              return demoInstance[propertyName](...args);
            } else {
              return originalMethod.apply(this, args);
            }
          } else {
            return originalMethod.apply(this, args);
          }
        };
        Object.defineProperty(target.prototype, propertyName, descriptor);
      }
    }

    return target;
  };
}
