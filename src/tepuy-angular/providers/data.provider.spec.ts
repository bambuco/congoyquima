import {} from 'jasmine';
import { DataProviderFactory, IDataProvider, NumbersProvider } from './data.provider';

describe('Data Provider Service', () => {
  let factory: DataProviderFactory;
  let service: IDataProvider;


  beforeEach(() => {
    factory = new DataProviderFactory();
  });

  describe('Data provider factory', () => {
    beforeEach(() => {
      service = factory.create('sequenceof:numbers:min=0;max=93');
    });

    it('should create a NumbersProvider', () => {
      expect(service instanceof NumbersProvider)
    });

  });
  describe('sequential numbers provider', () => {
    let n1, n2, n3, n4, n5, n6;

    beforeEach(() => {
      service = factory.create('sequenceof:numbers:min=0;max=93');
      n1 = service.next();
      n2 = service.next();
      n3 = service.next();
      n4 = service.next();
      n5 = service.next();
      n6 = service.next();
    });

    it('should return numbers', () => {
      expect(n1).not.toBeNaN();
      expect(n2).not.toBeNaN();
      expect(n3).not.toBeNaN();
      expect(n4).not.toBeNaN();
      expect(n5).not.toBeNaN();
      expect(n6).not.toBeNaN();
    });

    it('should return sequential numbers', () => {
      expect(n2).toEqual(n1+1);
      expect(n3).toEqual(n2+1);
      expect(n4).toEqual(n3+1);
      expect(n5).toEqual(n4+1);
      expect(n6).toEqual(n5+1);
    });
  });
  describe('group of numbers with distance', () => {
    let g1, g2, g3, g4;

    beforeEach(() => {
      service = factory.create('randomof:numbers:min=1;max=12;count=2;max-dist=4');
      g1 = service.nextGroup();
      g2 = service.nextGroup();
      service = factory.create('randomof:numbers:min=1;max=12;count=3;max-dist=4');
      g3 = service.nextGroup();
      g4 = service.nextGroup();
    });

    it('should return group of N', () => {
      expect(g1.length).toBe(2);
      expect(g2.length).toBe(2);
      expect(g3.length).toBe(3);
      expect(g4.length).toBe(3);
    });

    it('should not be equals', () => {
      expect(g1[0]).not.toBe(g1[1]);
      expect(g2[0]).not.toBe(g2[1]);
      expect(g3[0]).not.toBe(g3[1]);
      expect(g3[0]).not.toBe(g3[2]);
      expect(g3[1]).not.toBe(g3[2]);
      expect(g4[0]).not.toBe(g4[1]);
      expect(g4[0]).not.toBe(g4[2]);
      expect(g4[1]).not.toBe(g4[2]);
    });

    it('should not be distanced more than X', () => {
      expect(Math.abs(g1[0]-g1[1])).toBeLessThanOrEqual(4);
      expect(Math.abs(g2[0]-g2[1])).toBeLessThanOrEqual(4);
      expect(Math.abs(g3[0]-g3[1])).toBeLessThanOrEqual(4);
      expect(Math.abs(g3[0]-g3[2])).toBeLessThanOrEqual(4);
      //expect(Math.abs(g3[1]-g3[2])).toBeLessThanOrEqual(4);
      expect(Math.abs(g4[0]-g4[1])).toBeLessThanOrEqual(4);
      expect(Math.abs(g4[0]-g4[2])).toBeLessThanOrEqual(4);
      //expect(Math.abs(g4[1]-g4[2])).toBeLessThanOrEqual(4);
    });
  });
});
