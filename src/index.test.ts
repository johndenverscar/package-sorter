import {
  Package,
  Stack,
  sortPackage,
  isBulky,
  isHeavy,
  InvalidPackageError,
  VOLUME_THRESHOLD,
  DIMENSION_THRESHOLD,
  MASS_THRESHOLD
} from './index'

describe('sortPackage', () => {
  describe('STANDARD classification', () => {
    it('should classify small, light package as STANDARD', () => {
      expect(sortPackage(10, 10, 10, 5)).toBe(Stack.STANDARD)
    })
  })

  describe('SPECIAL classification - bulky packages', () => {
    it('should classify package as SPECIAL when volume >= threshold', () => {
      expect(sortPackage(100, 100, 100, 5)).toBe(Stack.SPECIAL) // 1,000,000 cm^3
    })

    it('should classify package as SPECIAL when width >= threshold', () => {
      expect(sortPackage(DIMENSION_THRESHOLD, 10, 10, 5)).toBe(Stack.SPECIAL)
    })

    it('should classify package as SPECIAL when height >= threshold', () => {
      expect(sortPackage(10, DIMENSION_THRESHOLD, 10, 5)).toBe(Stack.SPECIAL)
    })

    it('should classify package as SPECIAL when length >= threshold', () => {
      expect(sortPackage(10, 10, DIMENSION_THRESHOLD, 5)).toBe(Stack.SPECIAL)
    })
  })

  describe('SPECIAL classification - heavy packages', () => {
    it('should classify package as SPECIAL when mass >= threshold', () => {
      expect(sortPackage(10, 10, 10, MASS_THRESHOLD)).toBe(Stack.SPECIAL)
    })
  })

  describe('REJECTED classification', () => {
    it('should classify package as REJECTED when bulky AND heavy', () => {
      expect(sortPackage(DIMENSION_THRESHOLD, 10, 10, MASS_THRESHOLD)).toBe(Stack.REJECTED)
    })

    it('should classify package as REJECTED when large volume AND heavy', () => {
      expect(sortPackage(100, 100, 100, MASS_THRESHOLD + 5)).toBe(Stack.REJECTED)
    })

    it('should classify very large and very heavy package as REJECTED', () => {
      expect(sortPackage(200, 200, 200, 100)).toBe(Stack.REJECTED)
    })
  })

  describe('boundary conditions', () => {
    it('should be STANDARD when just below dimension threshold', () => {
      expect(sortPackage(DIMENSION_THRESHOLD - 0.1, 10, 10, 5)).toBe(Stack.STANDARD)
      expect(sortPackage(10, DIMENSION_THRESHOLD - 0.1, 10, 5)).toBe(Stack.STANDARD)
      expect(sortPackage(10, 10, DIMENSION_THRESHOLD - 0.1, 5)).toBe(Stack.STANDARD)
    })

    it('should be STANDARD when just below mass threshold', () => {
      expect(sortPackage(10, 10, 10, MASS_THRESHOLD - 0.01)).toBe(Stack.STANDARD)
    })

    it('should be SPECIAL when exactly at dimension threshold', () => {
      expect(sortPackage(DIMENSION_THRESHOLD, 10, 10, 5)).toBe(Stack.SPECIAL)
      expect(sortPackage(10, DIMENSION_THRESHOLD, 10, 5)).toBe(Stack.SPECIAL)
      expect(sortPackage(10, 10, DIMENSION_THRESHOLD, 5)).toBe(Stack.SPECIAL)
    })

    it('should be SPECIAL when exactly at mass threshold', () => {
      expect(sortPackage(10, 10, 10, MASS_THRESHOLD)).toBe(Stack.SPECIAL)
    })

    it('should be STANDARD when volume is just below threshold', () => {
      // 99.99 x 100 x 100 = 999,900 cm^3 (< 1,000,000)
      expect(sortPackage(99.99, 100, 100, 5)).toBe(Stack.STANDARD)
    })

    it('should be SPECIAL when volume is exactly at threshold', () => {
      // 100 x 100 x 100 = 1,000,000 cm^3
      expect(sortPackage(100, 100, 100, 5)).toBe(Stack.SPECIAL)
    })
  })

  describe('error handling', () => {
    it('should throw InvalidPackageError for negative width', () => {
      expect(() => sortPackage(-10, 10, 10, 5)).toThrow(InvalidPackageError)
    })

    it('should throw InvalidPackageError for negative height', () => {
      expect(() => sortPackage(10, -10, 10, 5)).toThrow(InvalidPackageError)
    })

    it('should throw InvalidPackageError for negative length', () => {
      expect(() => sortPackage(10, 10, -10, 5)).toThrow(InvalidPackageError)
    })

    it('should throw InvalidPackageError for negative mass', () => {
      expect(() => sortPackage(10, 10, 10, -5)).toThrow(InvalidPackageError)
    })

    it('should throw InvalidPackageError for zero dimensions', () => {
      expect(() => sortPackage(0, 10, 10, 5)).toThrow(InvalidPackageError)
      expect(() => sortPackage(10, 0, 10, 5)).toThrow(InvalidPackageError)
      expect(() => sortPackage(10, 10, 0, 5)).toThrow(InvalidPackageError)
      expect(() => sortPackage(10, 10, 10, 0)).toThrow(InvalidPackageError)
    })

    it('should throw InvalidPackageError for NaN values', () => {
      expect(() => sortPackage(NaN, 10, 10, 5)).toThrow(InvalidPackageError)
      expect(() => sortPackage(10, 10, 10, NaN)).toThrow(InvalidPackageError)
    })

    it('should throw InvalidPackageError for Infinity values', () => {
      expect(() => sortPackage(Infinity, 10, 10, 5)).toThrow(InvalidPackageError)
      expect(() => sortPackage(10, 10, 10, Infinity)).toThrow(InvalidPackageError)
    })
  })
})

describe('Package class', () => {
  describe('constructor', () => {
    it('should create a package with correct properties', () => {
      const pkg = new Package(10, 20, 30, 5)
      expect(pkg.width).toBe(10)
      expect(pkg.height).toBe(20)
      expect(pkg.length).toBe(30)
      expect(pkg.mass).toBe(5)
    })

    it('should calculate volume correctly', () => {
      const pkg = new Package(10, 20, 30, 5)
      expect(pkg.volume).toBe(6000)
    })

    it('should throw InvalidPackageError for invalid dimensions', () => {
      expect(() => new Package(-1, 10, 10, 5)).toThrow(InvalidPackageError)
      expect(() => new Package(10, 0, 10, 5)).toThrow(InvalidPackageError)
      expect(() => new Package(10, 10, 10, -5)).toThrow(InvalidPackageError)
    })

    it('should throw InvalidPackageError for non-finite values', () => {
      expect(() => new Package(NaN, 10, 10, 5)).toThrow(InvalidPackageError)
      expect(() => new Package(Infinity, 10, 10, 5)).toThrow(InvalidPackageError)
    })
  })

})

describe('isBulky', () => {
  it('should return true when volume >= threshold', () => {
    const pkg = new Package(100, 100, 100, 5)
    expect(pkg.volume).toBe(VOLUME_THRESHOLD)
    expect(isBulky(pkg)).toBe(true)
  })

  it('should return true when any dimension >= threshold', () => {
    const pkgWidth = new Package(DIMENSION_THRESHOLD, 10, 10, 5)
    const pkgHeight = new Package(10, DIMENSION_THRESHOLD, 10, 5)
    const pkgLength = new Package(10, 10, DIMENSION_THRESHOLD, 5)

    expect(isBulky(pkgWidth)).toBe(true)
    expect(isBulky(pkgHeight)).toBe(true)
    expect(isBulky(pkgLength)).toBe(true)
  })

  it('should return false when not bulky', () => {
    const pkg = new Package(10, 10, 10, 5)
    expect(isBulky(pkg)).toBe(false)
  })
})

describe('isHeavy', () => {
  it('should return true when mass >= threshold', () => {
    const pkg = new Package(10, 10, 10, MASS_THRESHOLD)
    expect(isHeavy(pkg)).toBe(true)
  })

  it('should return true when mass exceeds threshold', () => {
    const pkg = new Package(10, 10, 10, MASS_THRESHOLD + 50)
    expect(isHeavy(pkg)).toBe(true)
  })

  it('should return false when mass < threshold', () => {
    const pkg = new Package(10, 10, 10, MASS_THRESHOLD - 1)
    expect(isHeavy(pkg)).toBe(false)
  })
})