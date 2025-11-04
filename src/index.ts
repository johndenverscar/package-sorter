/**
 * Custom error thrown when package dimensions or mass are invalid
 */
export class InvalidPackageError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidPackageError'

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, InvalidPackageError)
    }
  }
}

// Package sorting thresholds
export const VOLUME_THRESHOLD = 1000000
export const DIMENSION_THRESHOLD = 150
export const MASS_THRESHOLD = 20

/**
 * Classification categories for package sorting
 */
export enum Stack {
  STANDARD = "STANDARD", // Not bulky AND not heavy
  SPECIAL = "SPECIAL", // Either bulky OR heavy
  REJECTED = "REJECTED" // Both bulky AND heavy
}

/**
 * Represents a package with physical dimensions and mass (pure data)
 */
export class Package {
  readonly width: number
  readonly height: number
  readonly length: number
  readonly mass: number
  readonly volume: number

  /**
   * Creates a new Package instance
   * @param width Package width in cm (must be positive)
   * @param height Package height in cm (must be positive)
   * @param length Package length in cm (must be positive)
   * @param mass Package mass in kg (must be positive)
   * @throws {InvalidPackageError} If any dimension is non-positive, mass is negative, or any value is not finite
   */
  constructor(width: number, height: number, length: number, mass: number) {

    // Make sure we're working on the right side of zero
    if (width <= 0 || height <= 0 || length <= 0 || mass <= 0) {
      throw new InvalidPackageError(
        `Invalid package dimensions or mass: width=${width}, height=${height}, length=${length}, mass=${mass}`
      )
    }

    // If someone passes NaN or Infinity, we should throw an error
    if (!isFinite(width) || !isFinite(height) || !isFinite(length) || !isFinite(mass)) {
      throw new InvalidPackageError(
        `Invalid package dimensions or mass: width=${width}, height=${height}, length=${length}, mass=${mass}`
      )
    }

    this.width = width
    this.height = height
    this.length = length
    this.mass = mass
    this.volume = this.width * this.height * this.length
  }
}

/**
 * Checks if a package is considered bulky
 * A package is bulky if its volume >= 1,000,000 cm^3 or any dimension >= 150 cm
 * @param pkg The package to check
 * @returns true if the package is bulky, false otherwise
 */
export function isBulky(pkg: Package): boolean {
  return (
    pkg.volume >= VOLUME_THRESHOLD ||
    pkg.width >= DIMENSION_THRESHOLD ||
    pkg.height >= DIMENSION_THRESHOLD ||
    pkg.length >= DIMENSION_THRESHOLD
  )
}

/**
 * Checks if a package is considered heavy
 * A package is heavy if its mass >= 20 kg
 * @param pkg The package to check
 * @returns true if the package is heavy, false otherwise
 */
export function isHeavy(pkg: Package): boolean {
  return pkg.mass >= MASS_THRESHOLD
}

/**
 * Sorts a package into the appropriate stack based on its dimensions and mass
 * @param width Package width in cm
 * @param height Package height in cm
 * @param length Package length in cm
 * @param mass Package mass in kg
 * @returns The stack classification for the entered package (STANDARD, SPECIAL, or REJECTED)
 * @throws {InvalidPackageError} If package dimensions or mass are invalid
 */
export function sortPackage(width: number, height: number, length: number, mass: number): Stack {
  const pkg = new Package(width, height, length, mass)

  if (isBulky(pkg) && isHeavy(pkg)) {
    return Stack.REJECTED
  }
  if (isBulky(pkg) || isHeavy(pkg)) {
    return Stack.SPECIAL
  }
  return Stack.STANDARD
}