export class VersionInfo {
  private static readonly MAJOR = 1;
  private static readonly MINOR = 0;
  private static readonly PATCH = 16;

  /**
   * Get version string in semver format
   */
  public static string(): string {
    return `${this.MAJOR}.${this.MINOR}.${this.PATCH}`;
  }

  /**
   * Get version as object
   */
  public static toJSON(): object {
    return {
      major: this.MAJOR,
      minor: this.MINOR,
      patch: this.PATCH
    };
  }
}
