type AccessorCallback = (data: any) => any;

export const uniqueBy = (data: any[], ...accessors: AccessorCallback[]) => {
  const result = [];

  const ittr = (arr: any[], depth: number) => {
    for (const a of arr) {
      const acc = accessors[depth];
      if (acc === undefined) {
        throw new Error(`Accessor not found for depth: ${depth}`);
      }

      const val = acc(a);
      if (Array.isArray(val)) {
        ittr(val, depth + 1);
      } else if (!result.includes(val)) {
        result.push(val);
      }
    }
  };

  ittr(data, 0);

  return result;
};
