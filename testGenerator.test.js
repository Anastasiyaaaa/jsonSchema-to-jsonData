const {
  getJsonObjFromJsonSchema, getRandomNumberOrInteger, returnDataForStringType,
} = require('./dataGenerator');

describe('getJsonObjFromJsonSchema', () => {

  test('it should return an object with the specified properties', () => {
    const schema = {
      type: 'object',
      properties: {
        name: {type: 'string'},
        age: {type: 'integer'},
      },
      required: ['name', 'age'],
    };
    const result = getJsonObjFromJsonSchema(schema);
    expect(result).toEqual(expect.objectContaining({
      name: expect.any(String),
      age: expect.any(Number),
    }));
  });

  test('it should return a string', () => {
    const schema = {
      type: 'string',
      minLength: 15,
      maxLength: 25,
    };
    const result = getJsonObjFromJsonSchema(schema);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThanOrEqual(15);
    expect(result.length).toBeLessThanOrEqual(25);
  });

  // Test case 2
  test('it should return a string', () => {
    const schema = {
      type: 'string',
      minLength: 5,
      maxLength: 10,
    };
    const result = returnDataForStringType(schema);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThanOrEqual(5);
    expect(result.length).toBeLessThanOrEqual(10);
  });

  test('it should return a number >= minimum && number <= maximum', () => {
    const schema = {
      type: 'number',
      minimum: 5,
      maximum: 10,
    };
    const result = getJsonObjFromJsonSchema(schema);
    expect(typeof result).toBe('number');
    expect(result).toBeGreaterThanOrEqual(5);
    expect(result).toBeLessThanOrEqual(11);
  });

  test('it should return a number > minimum && number < maximum', () => {
    const schema = {
      type: 'number',
      exclusiveMinimum: 1,
      exclusiveMaximum: 3,
    };
    const result = getJsonObjFromJsonSchema(schema);
    expect(typeof result).toBe('number');
    expect(result).toBeGreaterThan(1);
    expect(result).toBeLessThan(3);
  });

  test('it should return a number > minimum && number < maximum / by getRandomNumberOrInteger fn', () => {
    const schema = {
      type: 'number',
      exclusiveMinimum: 1,
      exclusiveMaximum: 3,
    };
    const result = getRandomNumberOrInteger(schema);
    expect(typeof result).toBe('number');
    expect(result).toBeGreaterThan(1);
    expect(result).toBeLessThan(3);
  });

  test('it should return an obj with the specified properties', () => {
    const schema = {
      type: 'object',
      properties: {
        name: {type: 'string'},
        age: {type: 'integer'},
        extraProp: {
          type: "array",
          prefixItems: [
            {type: "number"},
            {type: "string"},
            {enum: ["Street", "Avenue", "Boulevard"]},
            {enum: ["NW", "NE", "SW", "SE"]},
          ]
        },
        required: ['prefixItems'],
      },
      required: ['name', 'age', 'extraProp'],
    };
    const result = getJsonObjFromJsonSchema(schema);

    expect(typeof result.age).toBe('number');
    expect(typeof result.name).toBe('string');
    expect(Array.isArray(result.extraProp)).toBe(true);
    expect(result.extraProp.length).toBe(4);
    expect(["Street", "Avenue", "Boulevard"]).toContain(result.extraProp[2]);
    expect(["NW", "NE", "SW", "SE"]).toContain(result.extraProp[3]);
  });

  test('it should return an obj with the specified properties', () => {
    const schema = {
      type: "array",
      minItems: 3,
      maxItems: 6,
    };
    const result = getJsonObjFromJsonSchema(schema);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThanOrEqual(3);
    expect(result.length).toBeLessThanOrEqual(6);

  });
});