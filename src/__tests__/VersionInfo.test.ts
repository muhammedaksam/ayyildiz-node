import { VersionInfo } from '../VersionInfo';

describe('VersionInfo', () => {
  describe('string method', () => {
    it('should return version string in semver format', () => {
      const versionString = VersionInfo.string();
      expect(versionString).toMatch(/^\d+\.\d+\.\d+$/);
    });

    it('should return consistent version string', () => {
      const version1 = VersionInfo.string();
      const version2 = VersionInfo.string();
      expect(version1).toBe(version2);
    });

    it('should return current version', () => {
      const versionString = VersionInfo.string();
      expect(versionString).toBe('1.0.1');
    });
  });

  describe('toJSON method', () => {
    it('should return version object with major, minor, patch', () => {
      const versionObj = VersionInfo.toJSON();
      expect(versionObj).toHaveProperty('major');
      expect(versionObj).toHaveProperty('minor');
      expect(versionObj).toHaveProperty('patch');
    });

    it('should return consistent version object', () => {
      const version1 = VersionInfo.toJSON();
      const version2 = VersionInfo.toJSON();
      expect(version1).toEqual(version2);
    });

    it('should return current version values', () => {
      const versionObj = VersionInfo.toJSON();
      expect(versionObj).toEqual({
        major: 1,
        minor: 0,
        patch: 1
      });
    });

    it('should return version object with number values', () => {
      const versionObj = VersionInfo.toJSON() as any;
      expect(typeof versionObj.major).toBe('number');
      expect(typeof versionObj.minor).toBe('number');
      expect(typeof versionObj.patch).toBe('number');
    });
  });

  describe('version consistency', () => {
    it('should have consistent versions between string and JSON methods', () => {
      const versionString = VersionInfo.string();
      const versionObj = VersionInfo.toJSON() as any;
      const reconstructedString = `${versionObj.major}.${versionObj.minor}.${versionObj.patch}`;
      expect(versionString).toBe(reconstructedString);
    });
  });
});
