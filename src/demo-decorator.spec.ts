import Demo from './index';

const mockDemoIsActive = jest.fn();

beforeEach(() => {
  jest.restoreAllMocks();
});

describe('class decorated with a demo class instance', () => {
  // this is our mock
  class MockTestServiceCls {
    add(_a: number, _b: number): number {
      return 42;
    }
    reverse(_x: string): string {
      return 'miau';
    }
  }

  const MockTestService = new MockTestServiceCls();
  @Demo(MockTestService, () => mockDemoIsActive())
  class MockableTestServiceCls {
    add(a: number, b: number): number {
      return a + b;
    }
    reverse(x: string): string {
      return x
        .split('')
        .reverse()
        .join('');
    }

    alwaysOriginal(): string {
      return 'the one and only';
    }
  }

  const MockableTestService = new MockableTestServiceCls();

  describe('demo mode disabled', () => {
    it('should call original add function', async () => {
      mockDemoIsActive.mockImplementation(() => false);
      const spyOriginalTestServiceAdd = jest.spyOn(MockableTestService, 'add');
      const spyMockedTestServiceAdd = jest.spyOn(MockTestService, 'add');

      const result = MockableTestService.add(2, 3);

      expect(result).toBe(5);
      expect(spyOriginalTestServiceAdd).toBeCalledTimes(1);
      expect(spyMockedTestServiceAdd).toBeCalledTimes(0);
    });

    it('should call original reverse function', async () => {
      mockDemoIsActive.mockImplementation(() => false);
      const mockTestServiceReverse = jest.spyOn(MockableTestService, 'reverse');
      const mockMockedTestServiceReverse = jest.spyOn(
        MockTestService,
        'reverse',
      );

      const result = MockableTestService.reverse('hola');
      expect(result).toBe('aloh');

      expect(mockTestServiceReverse).toBeCalledTimes(1);
      expect(mockMockedTestServiceReverse).toBeCalledTimes(0);
    });

    it('should call original alwaysOriginal function', async () => {
      mockDemoIsActive.mockImplementation(() => false);
      const mockTestServiceAlwaysOriginal = jest.spyOn(
        MockableTestService,
        'alwaysOriginal',
      );

      const result = MockableTestService.alwaysOriginal();
      expect(result).toBe('the one and only');

      expect(mockTestServiceAlwaysOriginal).toBeCalledTimes(1);
    });
  });

  describe('demo mode enabled', () => {
    it('should call demo add function', async () => {
      mockDemoIsActive.mockImplementation(() => true);
      const mockMockedTestServiceAdd = jest.spyOn(MockTestService, 'add');

      const result = MockableTestService.add(2, 3);

      expect(result).toBe(42);
      expect(mockMockedTestServiceAdd).toBeCalledTimes(1);
    });

    it('should call demo reverse function', async () => {
      mockDemoIsActive.mockImplementation(() => true);
      const mockMockedTestServiceReverse = jest.spyOn(
        MockTestService,
        'reverse',
      );

      const result = MockableTestService.reverse('hola');

      expect(result).toBe('miau');
      expect(mockMockedTestServiceReverse).toBeCalledTimes(1);
    });

    it('should call original alwaysOriginal function because not available in demo', async () => {
      mockDemoIsActive.mockImplementation(() => true);
      const mockTestServiceAlwaysOriginal = jest.spyOn(
        MockableTestService,
        'alwaysOriginal',
      );

      const result = MockableTestService.alwaysOriginal();
      expect(result).toBe('the one and only');

      expect(mockTestServiceAlwaysOriginal).toBeCalledTimes(1);
    });
  });
});

describe('class decorated with a demo object', () => {
  const demoObject = {
    add(a: number, b: number): number {
      return 100;
    },
  };

  @Demo(demoObject, () => mockDemoIsActive())
  class MockableTestServiceCls {
    add(a: number, b: number): number {
      return a + b;
    }
    subtract(a: number, b: number): number {
      return a - b;
    }
  }

  const mockableTestServiceInstance = new MockableTestServiceCls();

  describe('demo mode disabled', () => {
    it('should call original add method', () => {
      mockDemoIsActive.mockImplementation(() => false);
      const spyOriginalTestServiceAdd = jest.spyOn(
        mockableTestServiceInstance,
        'add',
      );
      const spyMockedTestServiceAdd = jest.spyOn(demoObject, 'add');

      const result = mockableTestServiceInstance.add(2, 3);

      expect(result).toBe(5);
      expect(spyOriginalTestServiceAdd).toBeCalledTimes(1);
      expect(spyMockedTestServiceAdd).toBeCalledTimes(0);
    });

    it('should call original subtract method', () => {
      mockDemoIsActive.mockImplementation(() => false);
      const spyOriginalTestServiceAdd = jest.spyOn(
        mockableTestServiceInstance,
        'subtract',
      );

      const result = mockableTestServiceInstance.subtract(2, 3);

      expect(result).toBe(-1);
      expect(spyOriginalTestServiceAdd).toBeCalledTimes(1);
    });
  });

  describe('demo mode enabled', () => {
    it('should call demo add method', () => {
      mockDemoIsActive.mockImplementation(() => true);
      const spyOriginalTestServiceAdd = jest.spyOn(
        mockableTestServiceInstance,
        'add',
      );
      const spyMockedTestServiceAdd = jest.spyOn(demoObject, 'add');

      const result = mockableTestServiceInstance.add(2, 3);

      expect(result).toBe(100);
      expect(spyMockedTestServiceAdd).toBeCalledTimes(1);
    });

    it('should call original (missing from demo) subtract method', () => {
      mockDemoIsActive.mockImplementation(() => true);
      const spyOriginalTestServiceAdd = jest.spyOn(
        mockableTestServiceInstance,
        'subtract',
      );

      const result = mockableTestServiceInstance.subtract(2, 3);

      expect(result).toBe(-1);
      expect(spyOriginalTestServiceAdd).toBeCalledTimes(1);
    });
  });
});

describe('demo without decorator syntax', () => {
  // this is our mock
  class MockTestServiceCls {
    add(_a: number, _b: number): number {
      return 42;
    }
    reverse(_x: string): string {
      return 'miau';
    }
  }

  const MockTestService = new MockTestServiceCls();
  class MockableTestService {
    add(a: number, b: number): number {
      return a + b;
    }
    reverse(x: string): string {
      return x
        .split('')
        .reverse()
        .join('');
    }

    alwaysOriginal(): string {
      return 'the one and only';
    }
  }

  const MockedTestServiceCls = Demo(MockTestService, () => mockDemoIsActive())(
    MockableTestService,
  );

  const MockedTestService = new MockedTestServiceCls();

  describe('demo mode disabled', () => {
    it('should call original add function', async () => {
      mockDemoIsActive.mockImplementation(() => false);
      const spyOriginalTestServiceAdd = jest.spyOn(MockedTestService, 'add');
      const spyMockedTestServiceAdd = jest.spyOn(MockTestService, 'add');

      const result = MockedTestService.add(2, 3);

      expect(result).toBe(5);
      expect(spyOriginalTestServiceAdd).toBeCalledTimes(1);
      expect(spyMockedTestServiceAdd).toBeCalledTimes(0);
    });

    it('should call original reverse function', async () => {
      mockDemoIsActive.mockImplementation(() => false);
      const mockTestServiceReverse = jest.spyOn(MockedTestService, 'reverse');
      const mockMockedTestServiceReverse = jest.spyOn(
        MockTestService,
        'reverse',
      );

      const result = MockedTestService.reverse('hola');
      expect(result).toBe('aloh');

      expect(mockTestServiceReverse).toBeCalledTimes(1);
      expect(mockMockedTestServiceReverse).toBeCalledTimes(0);
    });

    it('should call original alwaysOriginal function', async () => {
      mockDemoIsActive.mockImplementation(() => false);
      const mockTestServiceAlwaysOriginal = jest.spyOn(
        MockedTestService,
        'alwaysOriginal',
      );

      const result = MockedTestService.alwaysOriginal();
      expect(result).toBe('the one and only');

      expect(mockTestServiceAlwaysOriginal).toBeCalledTimes(1);
    });
  });

  describe('demo mode enabled', () => {
    it('should call demo add function', async () => {
      mockDemoIsActive.mockImplementation(() => true);
      const mockMockedTestServiceAdd = jest.spyOn(MockTestService, 'add');

      const result = MockedTestService.add(2, 3);

      expect(result).toBe(42);
      expect(mockMockedTestServiceAdd).toBeCalledTimes(1);
    });

    it('should call demo reverse function', async () => {
      mockDemoIsActive.mockImplementation(() => true);
      const mockMockedTestServiceReverse = jest.spyOn(
        MockTestService,
        'reverse',
      );

      const result = MockedTestService.reverse('hola');

      expect(result).toBe('miau');
      expect(mockMockedTestServiceReverse).toBeCalledTimes(1);
    });

    it('should call original alwaysOriginal function because not available in demo', async () => {
      mockDemoIsActive.mockImplementation(() => true);
      const mockTestServiceAlwaysOriginal = jest.spyOn(
        MockedTestService,
        'alwaysOriginal',
      );

      const result = MockedTestService.alwaysOriginal();
      expect(result).toBe('the one and only');

      expect(mockTestServiceAlwaysOriginal).toBeCalledTimes(1);
    });
  });
});
