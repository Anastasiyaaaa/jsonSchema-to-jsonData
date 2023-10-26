function getRandomNumberOrInteger(schema) {
  let min = schema.minimum;
  let max = schema.maximum + 1;
  const exclusiveMin = schema.exclusiveMinimum + 1;
  const exclusiveMax = schema.exclusiveMaximum;

  let randomInt;

  if (exclusiveMin) {
    min = exclusiveMin;
  } else if (!min) {
    min = 1;
  }
  if (exclusiveMax) {
    max = exclusiveMax;
  } else if (!max) {
    max = 100;
  }

  randomInt = Math.random() * (max - min) + min;
  return randomInt;
}

function returnDataForObjType(schema, jsonData) {
  const properties = schema.properties;
  const required = schema.required;
  for (const key in properties) {
    if (required.includes(key) || Math.random() < 0.5) {
      jsonData[key] = getJsonObjFromJsonSchema(properties[key]);
    }
  }
  return jsonData;
}

function returnDataForStringType(schema) {
  let randomStr = 'Random string';
  const minLength = schema.minLength;
  const maxLength = schema.maxLength;

  if (!minLength && !maxLength) {
    return randomStr;
  }
  while (randomStr.length < minLength) {
    randomStr = randomStr.concat(randomStr);
  }
  if (randomStr.length > maxLength) {
    randomStr = randomStr.slice(0, maxLength);
  }
  return randomStr;
}

function returnDataForArrType(schema) {
  const arrOfItem = [];
  const minItems = schema.minItems || 1;
  const maxItems = schema.maxItems || 10;
  let quantityItems = Math.floor(Math.random() * (maxItems - minItems) + minItems);

  let items = schema.items && schema.items.type ? schema.items.type : { type: 'string' };
  if (schema.prefixItems) {
    quantityItems = schema.prefixItems.length;
    items = schema.prefixItems;
  }

  for (let i = 0; i < quantityItems; i++) {
    let itemSchema = items;

    if (Array.isArray(items)) {
      itemSchema = items.length > i ? items[i] : items[0];
    }

    arrOfItem.push(getJsonObjFromJsonSchema(itemSchema));
  }

  return arrOfItem;
}

function returnDataForEnumOrAnyOf(property) {
  const propertyLength = property.length;
  const index = Math.floor(Math.random() * propertyLength);
  return property[index];
}

function getJsonObjFromJsonSchema(schema) {
  let jsonData = {};
  if (schema.type === 'object') {
    jsonData = returnDataForObjType(schema, jsonData);
  } else if (schema.type === 'string') {
    return returnDataForStringType(schema);
  } else if (schema.type === 'integer') {
    const random = getRandomNumberOrInteger(schema);
    return Math.floor(random);
  } else if (schema.type === 'number') {
    return parseFloat(getRandomNumberOrInteger(schema).toFixed(2));
  } else if (schema.type === "array") {
    return returnDataForArrType(schema);
  } else if (schema.type === "boolean") {
    return Math.random() < 0.5;
  } else if (schema.anyOf || schema.enum) {
    const property = schema.anyOf || schema.enum;
    if (schema.anyOf) {
      const type = returnDataForEnumOrAnyOf(property);
      return getJsonObjFromJsonSchema(type);
    }
    return returnDataForEnumOrAnyOf(property);
  } else {
    return '';
  }
  return jsonData;
}

module.exports = {
  getJsonObjFromJsonSchema,
  getRandomNumberOrInteger,
  returnDataForStringType,
};
