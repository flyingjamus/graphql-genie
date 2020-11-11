'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var graphql = require('graphql');
var graphql__default = _interopDefault(graphql);
var graphqlTools = require('graphql-tools');
var language = _interopDefault(require('graphql/language'));
var lodash = require('lodash');
var fortune = _interopDefault(require('fortune'));
var fortuneCommon = require('fortune/lib/adapter/adapters/common');

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
}

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var formatter = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * Copyright (c) 2017, Dirk-Jan Rutten
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// Parses an RFC 3339 compliant time-string into a Date.
// It does this by combining the current date with the time-string
// to create a new Date instance.
//
// Example:
// Suppose the current date is 2016-01-01, then
// parseTime('11:00:12Z') parses to a Date corresponding to
// 2016-01-01T11:00:12Z.
var parseTime = exports.parseTime = function parseTime(time) {
  var currentDateString = new Date().toISOString();
  return new Date(currentDateString.substr(0, currentDateString.indexOf('T') + 1) + time);
};

// Serializes a Date into an RFC 3339 compliant time-string in the
// format hh:mm:ss.sssZ.
var serializeTime = exports.serializeTime = function serializeTime(date) {
  var dateTimeString = date.toISOString();
  return dateTimeString.substr(dateTimeString.indexOf('T') + 1);
};

// Serializes an RFC 3339 compliant time-string by shifting
// it to UTC.
var serializeTimeString = exports.serializeTimeString = function serializeTimeString(time) {
  // If already formatted to UTC then return the time string
  if (time.indexOf('Z') !== -1) {
    return time;
  } else {
    // These are time-strings with timezone information,
    // these need to be shifted to UTC.

    // Convert to UTC time string in
    // format hh:mm:ss.sssZ.
    var date = parseTime(time);
    var timeUTC = serializeTime(date);

    // Regex to look for fractional second part in time string
    // such as 00:00:00.345+01:00
    var regexFracSec = /\.\d{1,}/;

    // Retrieve the fractional second part of the time
    // string if it exists.
    var fractionalPart = time.match(regexFracSec);
    if (fractionalPart == null) {
      // These are time-strings without the fractional
      // seconds. So we remove them from the UTC time-string.
      timeUTC = timeUTC.replace(regexFracSec, '');
      return timeUTC;
    } else {
      // These are time-string with fractional seconds.
      // Make sure that we inject the fractional
      // second part back in. The `timeUTC` variable
      // has millisecond precision, we may want more or less
      // depending on the string that was passed.
      timeUTC = timeUTC.replace(regexFracSec, fractionalPart[0]);
      return timeUTC;
    }
  }
};

// Parses an RFC 3339 compliant date-string into a Date.
//
// Example:
// parseDate('2016-01-01') parses to a Date corresponding to
// 2016-01-01T00:00:00.000Z.
var parseDate = exports.parseDate = function parseDate(date) {
  return new Date(date);
};

// Serializes a Date into a RFC 3339 compliant date-string
// in the format YYYY-MM-DD.
var serializeDate = exports.serializeDate = function serializeDate(date) {
  return date.toISOString().split('T')[0];
};

// Parses an RFC 3339 compliant date-time-string into a Date.
var parseDateTime = exports.parseDateTime = function parseDateTime(dateTime) {
  return new Date(dateTime);
};

// Serializes a Date into an RFC 3339 compliant date-time-string
// in the format YYYY-MM-DDThh:mm:ss.sssZ.
var serializeDateTime = exports.serializeDateTime = function serializeDateTime(dateTime) {
  return dateTime.toISOString();
};

// Serializes an RFC 3339 compliant date-time-string by shifting
// it to UTC.
var serializeDateTimeString = exports.serializeDateTimeString = function serializeDateTimeString(dateTime) {
  // If already formatted to UTC then return the time string
  if (dateTime.indexOf('Z') !== -1) {
    return dateTime;
  } else {
    // These are time-strings with timezone information,
    // these need to be shifted to UTC.

    // Convert to UTC time string in
    // format YYYY-MM-DDThh:mm:ss.sssZ.
    var dateTimeUTC = new Date(dateTime).toISOString();

    // Regex to look for fractional second part in date-time string
    var regexFracSec = /\.\d{1,}/;

    // Retrieve the fractional second part of the time
    // string if it exists.
    var fractionalPart = dateTime.match(regexFracSec);
    if (fractionalPart == null) {
      // The date-time-string has no fractional part,
      // so we remove it from the dateTimeUTC variable.
      dateTimeUTC = dateTimeUTC.replace(regexFracSec, '');
      return dateTimeUTC;
    } else {
      // These are datetime-string with fractional seconds.
      // Make sure that we inject the fractional
      // second part back in. The `dateTimeUTC` variable
      // has millisecond precision, we may want more or less
      // depending on the string that was passed.
      dateTimeUTC = dateTimeUTC.replace(regexFracSec, fractionalPart[0]);
      return dateTimeUTC;
    }
  }
};

// Serializes a Unix timestamp to an RFC 3339 compliant date-time-string
// in the format YYYY-MM-DDThh:mm:ss.sssZ
var serializeUnixTimestamp = exports.serializeUnixTimestamp = function serializeUnixTimestamp(timestamp) {
  return new Date(timestamp * 1000).toISOString();
};
});

unwrapExports(formatter);
var formatter_1 = formatter.parseTime;
var formatter_2 = formatter.serializeTime;
var formatter_3 = formatter.serializeTimeString;
var formatter_4 = formatter.parseDate;
var formatter_5 = formatter.serializeDate;
var formatter_6 = formatter.parseDateTime;
var formatter_7 = formatter.serializeDateTime;
var formatter_8 = formatter.serializeDateTimeString;
var formatter_9 = formatter.serializeUnixTimestamp;

var validator = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

/**
 * Copyright (c) 2017, Dirk-Jan Rutten
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// Check whether a certain year is a leap year.
//
// Every year that is exactly divisible by four
// is a leap year, except for years that are exactly
// divisible by 100, but these centurial years are
// leap years if they are exactly divisible by 400.
// For example, the years 1700, 1800, and 1900 are not leap years,
// but the years 1600 and 2000 are.
//
var leapYear = function leapYear(year) {
  return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
};

// Function that checks whether a time-string is RFC 3339 compliant.
//
// It checks whether the time-string is structured in one of the
// following formats:
//
// - hh:mm:ssZ
// - hh:mm:ss±hh:mm
// - hh:mm:ss.*sZ
// - hh:mm:ss.*s±hh:mm
//
// Where *s is a fraction of seconds with at least 1 digit.
//
// Note, this validator assumes that all minutes have
// 59 seconds. This assumption does not follow RFC 3339
// which includes leap seconds (in which case it is possible that
// there are 60 seconds in a minute).
//
// Leap seconds are ignored because it adds complexity in
// the following areas:
// - The native Javascript Date ignores them; i.e. Date.parse('1972-12-31T23:59:60Z')
//   equals NaN.
// - Leap seconds cannot be known in advance.
//
var validateTime = exports.validateTime = function validateTime(time) {
  var TIME_REGEX = /^([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])(\.\d{1,})?(([Z])|([+|-]([01][0-9]|2[0-3]):[0-5][0-9]))$/;
  return TIME_REGEX.test(time);
};

// Function that checks whether a date-string is RFC 3339 compliant.
//
// It checks whether the date-string is a valid date in the YYYY-MM-DD.
//
// Note, the number of days in each date are determined according to the
// following lookup table:
//
// Month Number  Month/Year           Maximum value of date-mday
// ------------  ----------           --------------------------
// 01            January              31
// 02            February, normal     28
// 02            February, leap year  29
// 03            March                31
// 04            April                30
// 05            May                  31
// 06            June                 30
// 07            July                 31
// 08            August               31
// 09            September            30
// 10            October              31
// 11            November             30
// 12            December             31
//
var validateDate = exports.validateDate = function validateDate(datestring) {
  var RFC_3339_REGEX = /^(\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01]))$/;

  if (!RFC_3339_REGEX.test(datestring)) {
    return false;
  }

  // Verify the correct number of days for
  // the month contained in the date-string.
  var year = Number(datestring.substr(0, 4));
  var month = Number(datestring.substr(5, 2));
  var day = Number(datestring.substr(8, 2));

  switch (month) {
    case 2:
      // February
      if (leapYear(year) && day > 29) {
        return false;
      } else if (!leapYear(year) && day > 28) {
        return false;
      }
      return true;
    case 4: // April
    case 6: // June
    case 9: // September
    case 11:
      // November
      if (day > 30) {
        return false;
      }
      break;
  }

  return true;
};

// Function that checks whether a date-time-string is RFC 3339 compliant.
//
// It checks whether the time-string is structured in one of the
//
// - YYYY-MM-DDThh:mm:ssZ
// - YYYY-MM-DDThh:mm:ss±hh:mm
// - YYYY-MM-DDThh:mm:ss.*sZ
// - YYYY-MM-DDThh:mm:ss.*s±hh:mm
//
// Where *s is a fraction of seconds with at least 1 digit.
//
var validateDateTime = exports.validateDateTime = function validateDateTime(dateTimeString) {
  var RFC_3339_REGEX = /^(\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]|60))(\.\d{1,})?(([Z])|([+|-]([01][0-9]|2[0-3]):[0-5][0-9]))$/;

  // Validate the structure of the date-string
  if (!RFC_3339_REGEX.test(dateTimeString)) {
    return false;
  }

  // Check if it is a correct date using the javascript Date parse() method.
  var time = Date.parse(dateTimeString);
  if (time !== time) {
    // eslint-disable-line
    return false;
  }
  // Split the date-time-string up into the string-date and time-string part.
  // and check whether these parts are RFC 3339 compliant.
  var index = dateTimeString.indexOf('T');
  var dateString = dateTimeString.substr(0, index);
  var timeString = dateTimeString.substr(index + 1);
  return validateDate(dateString) && validateTime(timeString);
};

// Function that checks whether a given number is a valid
// Unix timestamp.
//
// Unix timestamps are signed 32-bit integers. They are interpreted
// as the number of seconds since 00:00:00 UTC on 1 January 1970.
//
var validateUnixTimestamp = exports.validateUnixTimestamp = function validateUnixTimestamp(timestamp) {
  var MAX_INT = 2147483647;
  var MIN_INT = -2147483648;
  return timestamp === timestamp && timestamp <= MAX_INT && timestamp >= MIN_INT; // eslint-disable-line
};

// Function that checks whether a javascript Date instance
// is valid.
//
var validateJSDate = exports.validateJSDate = function validateJSDate(date) {
  var time = date.getTime();
  return time === time; // eslint-disable-line
};
});

unwrapExports(validator);
var validator_1 = validator.validateTime;
var validator_2 = validator.validateDate;
var validator_3 = validator.validateDateTime;
var validator_4 = validator.validateUnixTimestamp;
var validator_5 = validator.validateJSDate;

var utils = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});



Object.defineProperty(exports, 'serializeTime', {
  enumerable: true,
  get: function get() {
    return formatter.serializeTime;
  }
});
Object.defineProperty(exports, 'serializeTimeString', {
  enumerable: true,
  get: function get() {
    return formatter.serializeTimeString;
  }
});
Object.defineProperty(exports, 'serializeDate', {
  enumerable: true,
  get: function get() {
    return formatter.serializeDate;
  }
});
Object.defineProperty(exports, 'serializeDateTime', {
  enumerable: true,
  get: function get() {
    return formatter.serializeDateTime;
  }
});
Object.defineProperty(exports, 'serializeDateTimeString', {
  enumerable: true,
  get: function get() {
    return formatter.serializeDateTimeString;
  }
});
Object.defineProperty(exports, 'serializeUnixTimestamp', {
  enumerable: true,
  get: function get() {
    return formatter.serializeUnixTimestamp;
  }
});
Object.defineProperty(exports, 'parseTime', {
  enumerable: true,
  get: function get() {
    return formatter.parseTime;
  }
});
Object.defineProperty(exports, 'parseDate', {
  enumerable: true,
  get: function get() {
    return formatter.parseDate;
  }
});
Object.defineProperty(exports, 'parseDateTime', {
  enumerable: true,
  get: function get() {
    return formatter.parseDateTime;
  }
});



Object.defineProperty(exports, 'validateTime', {
  enumerable: true,
  get: function get() {
    return validator.validateTime;
  }
});
Object.defineProperty(exports, 'validateDate', {
  enumerable: true,
  get: function get() {
    return validator.validateDate;
  }
});
Object.defineProperty(exports, 'validateDateTime', {
  enumerable: true,
  get: function get() {
    return validator.validateDateTime;
  }
});
Object.defineProperty(exports, 'validateUnixTimestamp', {
  enumerable: true,
  get: function get() {
    return validator.validateUnixTimestamp;
  }
});
Object.defineProperty(exports, 'validateJSDate', {
  enumerable: true,
  get: function get() {
    return validator.validateJSDate;
  }
});
});

unwrapExports(utils);

var date = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});





/**
 * An RFC 3339 compliant date scalar.
 *
 * Input:
 *    This scalar takes an RFC 3339 date string as input and
 *    parses it to a javascript Date.
 *
 * Output:
 *    This scalar serializes javascript Dates and
 *    RFC 3339 date strings to RFC 3339 date strings.
 */

/**
 * Copyright (c) 2017, Dirk-Jan Rutten
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

var config = {
  name: 'Date',
  description: 'A date string, such as 2007-12-03, compliant with the `full-date` ' + 'format outlined in section 5.6 of the RFC 3339 profile of the ' + 'ISO 8601 standard for representation of dates and times using ' + 'the Gregorian calendar.',
  serialize: function serialize(value) {
    if (value instanceof Date) {
      if ((0, utils.validateJSDate)(value)) {
        return (0, utils.serializeDate)(value);
      }
      throw new TypeError('Date cannot represent an invalid Date instance');
    } else if (typeof value === 'string' || value instanceof String) {
      if ((0, utils.validateDate)(value)) {
        return value;
      }
      throw new TypeError('Date cannot represent an invalid date-string ' + value + '.');
    } else {
      throw new TypeError('Date cannot represent a non string, or non Date type ' + JSON.stringify(value));
    }
  },
  parseValue: function parseValue(value) {
    if (!(typeof value === 'string' || value instanceof String)) {
      throw new TypeError('Date cannot represent non string type ' + JSON.stringify(value));
    }

    if ((0, utils.validateDate)(value)) {
      return (0, utils.parseDate)(value);
    }
    throw new TypeError('Date cannot represent an invalid date-string ' + value + '.');
  },
  parseLiteral: function parseLiteral(ast) {
    if (ast.kind !== graphql__default.Kind.STRING) {
      throw new TypeError('Date cannot represent non string type ' + String(ast.value != null ? ast.value : null));
    }
    var value = ast.value;

    if ((0, utils.validateDate)(value)) {
      return (0, utils.parseDate)(value);
    }
    throw new TypeError('Date cannot represent an invalid date-string ' + String(value) + '.');
  }
}; // eslint-disable-line
exports.default = new graphql__default.GraphQLScalarType(config);
});

unwrapExports(date);

var time = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});





/**
 * An RFC 3339 compliant time scalar.
 *
 * Input:
 *    This scalar takes an RFC 3339 time string as input and
 *    parses it to a javascript Date (with a year-month-day relative
 *    to the current day).
 *
 * Output:
 *    This scalar serializes javascript Dates and
 *    RFC 3339 time strings to RFC 3339 UTC time strings.
 */

/**
 * Copyright (c) 2017, Dirk-Jan Rutten
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

var config = {
  name: 'Time',
  description: 'A time string at UTC, such as 10:15:30Z, compliant with ' + 'the `full-time` format outlined in section 5.6 of the RFC 3339' + 'profile of the ISO 8601 standard for representation of dates and ' + 'times using the Gregorian calendar.',
  serialize: function serialize(value) {
    if (value instanceof Date) {
      if ((0, utils.validateJSDate)(value)) {
        return (0, utils.serializeTime)(value);
      }
      throw new TypeError('Time cannot represent an invalid Date instance');
    } else if (typeof value === 'string' || value instanceof String) {
      if ((0, utils.validateTime)(value)) {
        return (0, utils.serializeTimeString)(value);
      }
      throw new TypeError('Time cannot represent an invalid time-string ' + value + '.');
    } else {
      throw new TypeError('Time cannot be serialized from a non string, ' + 'or non Date type ' + JSON.stringify(value));
    }
  },
  parseValue: function parseValue(value) {
    if (!(typeof value === 'string' || value instanceof String)) {
      throw new TypeError('Time cannot represent non string type ' + JSON.stringify(value));
    }

    if ((0, utils.validateTime)(value)) {
      return (0, utils.parseTime)(value);
    }
    throw new TypeError('Time cannot represent an invalid time-string ' + value + '.');
  },
  parseLiteral: function parseLiteral(ast) {
    if (ast.kind !== graphql__default.Kind.STRING) {
      throw new TypeError('Time cannot represent non string type ' + String(ast.value != null ? ast.value : null));
    }
    var value = ast.value;
    if ((0, utils.validateTime)(value)) {
      return (0, utils.parseTime)(value);
    }
    throw new TypeError('Time cannot represent an invalid time-string ' + String(value) + '.');
  }
}; // eslint-disable-line
exports.default = new graphql__default.GraphQLScalarType(config);
});

unwrapExports(time);

var dateTime = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});





/**
 * An RFC 3339 compliant date-time scalar.
 *
 * Input:
 *    This scalar takes an RFC 3339 date-time string as input and
 *    parses it to a javascript Date.
 *
 * Output:
 *    This scalar serializes javascript Dates,
 *    RFC 3339 date-time strings and unix timestamps
 *    to RFC 3339 UTC date-time strings.
 */

/**
 * Copyright (c) 2017, Dirk-Jan Rutten
 * All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

var config = {
  name: 'DateTime',
  description: 'A date-time string at UTC, such as 2007-12-03T10:15:30Z, ' + 'compliant with the `date-time` format outlined in section 5.6 of ' + 'the RFC 3339 profile of the ISO 8601 standard for representation ' + 'of dates and times using the Gregorian calendar.',
  serialize: function serialize(value) {
    if (value instanceof Date) {
      if ((0, utils.validateJSDate)(value)) {
        return (0, utils.serializeDateTime)(value);
      }
      throw new TypeError('DateTime cannot represent an invalid Date instance');
    } else if (typeof value === 'string' || value instanceof String) {
      if ((0, utils.validateDateTime)(value)) {
        return (0, utils.serializeDateTimeString)(value);
      }
      throw new TypeError('DateTime cannot represent an invalid date-time-string ' + value + '.');
    } else if (typeof value === 'number' || value instanceof Number) {
      if ((0, utils.validateUnixTimestamp)(value)) {
        return (0, utils.serializeUnixTimestamp)(value);
      }
      throw new TypeError('DateTime cannot represent an invalid Unix timestamp ' + value);
    } else {
      throw new TypeError('DateTime cannot be serialized from a non string, ' + 'non numeric or non Date type ' + JSON.stringify(value));
    }
  },
  parseValue: function parseValue(value) {
    if (!(typeof value === 'string' || value instanceof String)) {
      throw new TypeError('DateTime cannot represent non string type ' + JSON.stringify(value));
    }

    if ((0, utils.validateDateTime)(value)) {
      return (0, utils.parseDateTime)(value);
    }
    throw new TypeError('DateTime cannot represent an invalid date-time-string ' + value + '.');
  },
  parseLiteral: function parseLiteral(ast) {
    if (ast.kind !== graphql__default.Kind.STRING) {
      throw new TypeError('DateTime cannot represent non string type ' + String(ast.value != null ? ast.value : null));
    }
    var value = ast.value;

    if ((0, utils.validateDateTime)(value)) {
      return (0, utils.parseDateTime)(value);
    }
    throw new TypeError('DateTime cannot represent an invalid date-time-string ' + String(value) + '.');
  }
}; // eslint-disable-line
exports.default = new graphql__default.GraphQLScalarType(config);
});

unwrapExports(dateTime);

var dist = createCommonjsModule(function (module, exports) {

Object.defineProperty(exports, "__esModule", {
  value: true
});



Object.defineProperty(exports, 'GraphQLDate', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(date).default;
  }
});



Object.defineProperty(exports, 'GraphQLTime', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(time).default;
  }
});



Object.defineProperty(exports, 'GraphQLDateTime', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(dateTime).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
});

unwrapExports(dist);
var dist_1 = dist.GraphQLDate;
var dist_2 = dist.GraphQLTime;
var dist_3 = dist.GraphQLDateTime;

var lib = createCommonjsModule(function (module, exports) {

exports.__esModule = true;
exports.default = void 0;





function identity(value) {
  return value;
}

function parseLiteral(ast, variables) {
  switch (ast.kind) {
    case language.Kind.STRING:
    case language.Kind.BOOLEAN:
      return ast.value;

    case language.Kind.INT:
    case language.Kind.FLOAT:
      return parseFloat(ast.value);

    case language.Kind.OBJECT:
      {
        var value = Object.create(null);
        ast.fields.forEach(function (field) {
          value[field.name.value] = parseLiteral(field.value, variables);
        });
        return value;
      }

    case language.Kind.LIST:
      return ast.values.map(function (n) {
        return parseLiteral(n, variables);
      });

    case language.Kind.NULL:
      return null;

    case language.Kind.VARIABLE:
      {
        var name = ast.name.value;
        return variables ? variables[name] : undefined;
      }

    default:
      return undefined;
  }
}

var _default = new graphql__default.GraphQLScalarType({
  name: 'JSON',
  description: 'The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).',
  serialize: identity,
  parseValue: identity,
  parseLiteral: parseLiteral
});

exports.default = _default;
module.exports = exports.default;
});

var GraphQLJSON = unwrapExports(lib);
var lib_1 = lib.GraphQLJSON;

var pluralize = createCommonjsModule(function (module, exports) {
/* global define */

(function (root, pluralize) {
  /* istanbul ignore else */
  if (typeof commonjsRequire === 'function' && 'object' === 'object' && 'object' === 'object') {
    // Node.
    module.exports = pluralize();
  } else {
    // Browser global.
    root.pluralize = pluralize();
  }
})(commonjsGlobal, function () {
  // Rule storage - pluralize and singularize need to be run sequentially,
  // while other rules can be optimized using an object for instant lookups.
  var pluralRules = [];
  var singularRules = [];
  var uncountables = {};
  var irregularPlurals = {};
  var irregularSingles = {};

  /**
   * Sanitize a pluralization rule to a usable regular expression.
   *
   * @param  {(RegExp|string)} rule
   * @return {RegExp}
   */
  function sanitizeRule (rule) {
    if (typeof rule === 'string') {
      return new RegExp('^' + rule + '$', 'i');
    }

    return rule;
  }

  /**
   * Pass in a word token to produce a function that can replicate the case on
   * another word.
   *
   * @param  {string}   word
   * @param  {string}   token
   * @return {Function}
   */
  function restoreCase (word, token) {
    // Tokens are an exact match.
    if (word === token) return token;

    // Upper cased words. E.g. "HELLO".
    if (word === word.toUpperCase()) return token.toUpperCase();

    // Title cased words. E.g. "Title".
    if (word[0] === word[0].toUpperCase()) {
      return token.charAt(0).toUpperCase() + token.substr(1).toLowerCase();
    }

    // Lower cased words. E.g. "test".
    return token.toLowerCase();
  }

  /**
   * Interpolate a regexp string.
   *
   * @param  {string} str
   * @param  {Array}  args
   * @return {string}
   */
  function interpolate (str, args) {
    return str.replace(/\$(\d{1,2})/g, function (match, index) {
      return args[index] || '';
    });
  }

  /**
   * Replace a word using a rule.
   *
   * @param  {string} word
   * @param  {Array}  rule
   * @return {string}
   */
  function replace (word, rule) {
    return word.replace(rule[0], function (match, index) {
      var result = interpolate(rule[1], arguments);

      if (match === '') {
        return restoreCase(word[index - 1], result);
      }

      return restoreCase(match, result);
    });
  }

  /**
   * Sanitize a word by passing in the word and sanitization rules.
   *
   * @param  {string}   token
   * @param  {string}   word
   * @param  {Array}    rules
   * @return {string}
   */
  function sanitizeWord (token, word, rules) {
    // Empty string or doesn't need fixing.
    if (!token.length || uncountables.hasOwnProperty(token)) {
      return word;
    }

    var len = rules.length;

    // Iterate over the sanitization rules and use the first one to match.
    while (len--) {
      var rule = rules[len];

      if (rule[0].test(word)) return replace(word, rule);
    }

    return word;
  }

  /**
   * Replace a word with the updated word.
   *
   * @param  {Object}   replaceMap
   * @param  {Object}   keepMap
   * @param  {Array}    rules
   * @return {Function}
   */
  function replaceWord (replaceMap, keepMap, rules) {
    return function (word) {
      // Get the correct token and case restoration functions.
      var token = word.toLowerCase();

      // Check against the keep object map.
      if (keepMap.hasOwnProperty(token)) {
        return restoreCase(word, token);
      }

      // Check against the replacement map for a direct word replacement.
      if (replaceMap.hasOwnProperty(token)) {
        return restoreCase(word, replaceMap[token]);
      }

      // Run all the rules against the word.
      return sanitizeWord(token, word, rules);
    };
  }

  /**
   * Check if a word is part of the map.
   */
  function checkWord (replaceMap, keepMap, rules, bool) {
    return function (word) {
      var token = word.toLowerCase();

      if (keepMap.hasOwnProperty(token)) return true;
      if (replaceMap.hasOwnProperty(token)) return false;

      return sanitizeWord(token, token, rules) === token;
    };
  }

  /**
   * Pluralize or singularize a word based on the passed in count.
   *
   * @param  {string}  word
   * @param  {number}  count
   * @param  {boolean} inclusive
   * @return {string}
   */
  function pluralize (word, count, inclusive) {
    var pluralized = count === 1
      ? pluralize.singular(word) : pluralize.plural(word);

    return (inclusive ? count + ' ' : '') + pluralized;
  }

  /**
   * Pluralize a word.
   *
   * @type {Function}
   */
  pluralize.plural = replaceWord(
    irregularSingles, irregularPlurals, pluralRules
  );

  /**
   * Check if a word is plural.
   *
   * @type {Function}
   */
  pluralize.isPlural = checkWord(
    irregularSingles, irregularPlurals, pluralRules
  );

  /**
   * Singularize a word.
   *
   * @type {Function}
   */
  pluralize.singular = replaceWord(
    irregularPlurals, irregularSingles, singularRules
  );

  /**
   * Check if a word is singular.
   *
   * @type {Function}
   */
  pluralize.isSingular = checkWord(
    irregularPlurals, irregularSingles, singularRules
  );

  /**
   * Add a pluralization rule to the collection.
   *
   * @param {(string|RegExp)} rule
   * @param {string}          replacement
   */
  pluralize.addPluralRule = function (rule, replacement) {
    pluralRules.push([sanitizeRule(rule), replacement]);
  };

  /**
   * Add a singularization rule to the collection.
   *
   * @param {(string|RegExp)} rule
   * @param {string}          replacement
   */
  pluralize.addSingularRule = function (rule, replacement) {
    singularRules.push([sanitizeRule(rule), replacement]);
  };

  /**
   * Add an uncountable word rule.
   *
   * @param {(string|RegExp)} word
   */
  pluralize.addUncountableRule = function (word) {
    if (typeof word === 'string') {
      uncountables[word.toLowerCase()] = true;
      return;
    }

    // Set singular and plural references for the word.
    pluralize.addPluralRule(word, '$0');
    pluralize.addSingularRule(word, '$0');
  };

  /**
   * Add an irregular word definition.
   *
   * @param {string} single
   * @param {string} plural
   */
  pluralize.addIrregularRule = function (single, plural) {
    plural = plural.toLowerCase();
    single = single.toLowerCase();

    irregularSingles[single] = plural;
    irregularPlurals[plural] = single;
  };

  /**
   * Irregular rules.
   */
  [
    // Pronouns.
    ['I', 'we'],
    ['me', 'us'],
    ['he', 'they'],
    ['she', 'they'],
    ['them', 'them'],
    ['myself', 'ourselves'],
    ['yourself', 'yourselves'],
    ['itself', 'themselves'],
    ['herself', 'themselves'],
    ['himself', 'themselves'],
    ['themself', 'themselves'],
    ['is', 'are'],
    ['was', 'were'],
    ['has', 'have'],
    ['this', 'these'],
    ['that', 'those'],
    // Words ending in with a consonant and `o`.
    ['echo', 'echoes'],
    ['dingo', 'dingoes'],
    ['volcano', 'volcanoes'],
    ['tornado', 'tornadoes'],
    ['torpedo', 'torpedoes'],
    // Ends with `us`.
    ['genus', 'genera'],
    ['viscus', 'viscera'],
    // Ends with `ma`.
    ['stigma', 'stigmata'],
    ['stoma', 'stomata'],
    ['dogma', 'dogmata'],
    ['lemma', 'lemmata'],
    ['schema', 'schemata'],
    ['anathema', 'anathemata'],
    // Other irregular rules.
    ['ox', 'oxen'],
    ['axe', 'axes'],
    ['die', 'dice'],
    ['yes', 'yeses'],
    ['foot', 'feet'],
    ['eave', 'eaves'],
    ['goose', 'geese'],
    ['tooth', 'teeth'],
    ['quiz', 'quizzes'],
    ['human', 'humans'],
    ['proof', 'proofs'],
    ['carve', 'carves'],
    ['valve', 'valves'],
    ['looey', 'looies'],
    ['thief', 'thieves'],
    ['groove', 'grooves'],
    ['pickaxe', 'pickaxes'],
    ['whiskey', 'whiskies']
  ].forEach(function (rule) {
    return pluralize.addIrregularRule(rule[0], rule[1]);
  });

  /**
   * Pluralization rules.
   */
  [
    [/s?$/i, 's'],
    [/[^\u0000-\u007F]$/i, '$0'],
    [/([^aeiou]ese)$/i, '$1'],
    [/(ax|test)is$/i, '$1es'],
    [/(alias|[^aou]us|tlas|gas|ris)$/i, '$1es'],
    [/(e[mn]u)s?$/i, '$1s'],
    [/([^l]ias|[aeiou]las|[emjzr]as|[iu]am)$/i, '$1'],
    [/(alumn|syllab|octop|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i, '$1i'],
    [/(alumn|alg|vertebr)(?:a|ae)$/i, '$1ae'],
    [/(seraph|cherub)(?:im)?$/i, '$1im'],
    [/(her|at|gr)o$/i, '$1oes'],
    [/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|automat|quor)(?:a|um)$/i, '$1a'],
    [/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)(?:a|on)$/i, '$1a'],
    [/sis$/i, 'ses'],
    [/(?:(kni|wi|li)fe|(ar|l|ea|eo|oa|hoo)f)$/i, '$1$2ves'],
    [/([^aeiouy]|qu)y$/i, '$1ies'],
    [/([^ch][ieo][ln])ey$/i, '$1ies'],
    [/(x|ch|ss|sh|zz)$/i, '$1es'],
    [/(matr|cod|mur|sil|vert|ind|append)(?:ix|ex)$/i, '$1ices'],
    [/(m|l)(?:ice|ouse)$/i, '$1ice'],
    [/(pe)(?:rson|ople)$/i, '$1ople'],
    [/(child)(?:ren)?$/i, '$1ren'],
    [/eaux$/i, '$0'],
    [/m[ae]n$/i, 'men'],
    ['thou', 'you']
  ].forEach(function (rule) {
    return pluralize.addPluralRule(rule[0], rule[1]);
  });

  /**
   * Singularization rules.
   */
  [
    [/s$/i, ''],
    [/(ss)$/i, '$1'],
    [/(wi|kni|(?:after|half|high|low|mid|non|night|[^\w]|^)li)ves$/i, '$1fe'],
    [/(ar|(?:wo|[ae])l|[eo][ao])ves$/i, '$1f'],
    [/ies$/i, 'y'],
    [/\b([pl]|zomb|(?:neck|cross)?t|coll|faer|food|gen|goon|group|lass|talk|goal|cut)ies$/i, '$1ie'],
    [/\b(mon|smil)ies$/i, '$1ey'],
    [/(m|l)ice$/i, '$1ouse'],
    [/(seraph|cherub)im$/i, '$1'],
    [/(x|ch|ss|sh|zz|tto|go|cho|alias|[^aou]us|tlas|gas|(?:her|at|gr)o|ris)(?:es)?$/i, '$1'],
    [/(analy|ba|diagno|parenthe|progno|synop|the|empha|cri)(?:sis|ses)$/i, '$1sis'],
    [/(movie|twelve|abuse|e[mn]u)s$/i, '$1'],
    [/(test)(?:is|es)$/i, '$1is'],
    [/(alumn|syllab|octop|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i, '$1us'],
    [/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|quor)a$/i, '$1um'],
    [/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)a$/i, '$1on'],
    [/(alumn|alg|vertebr)ae$/i, '$1a'],
    [/(cod|mur|sil|vert|ind)ices$/i, '$1ex'],
    [/(matr|append)ices$/i, '$1ix'],
    [/(pe)(rson|ople)$/i, '$1rson'],
    [/(child)ren$/i, '$1'],
    [/(eau)x?$/i, '$1'],
    [/men$/i, 'man']
  ].forEach(function (rule) {
    return pluralize.addSingularRule(rule[0], rule[1]);
  });

  /**
   * Uncountable rules.
   */
  [
    // Singular words with no plurals.
    'adulthood',
    'advice',
    'agenda',
    'aid',
    'alcohol',
    'ammo',
    'anime',
    'athletics',
    'audio',
    'bison',
    'blood',
    'bream',
    'buffalo',
    'butter',
    'carp',
    'cash',
    'chassis',
    'chess',
    'clothing',
    'cod',
    'commerce',
    'cooperation',
    'corps',
    'debris',
    'diabetes',
    'digestion',
    'elk',
    'energy',
    'equipment',
    'excretion',
    'expertise',
    'flounder',
    'fun',
    'gallows',
    'garbage',
    'graffiti',
    'headquarters',
    'health',
    'herpes',
    'highjinks',
    'homework',
    'housework',
    'information',
    'jeans',
    'justice',
    'kudos',
    'labour',
    'literature',
    'machinery',
    'mackerel',
    'mail',
    'media',
    'mews',
    'moose',
    'music',
    'manga',
    'news',
    'pike',
    'plankton',
    'pliers',
    'pollution',
    'premises',
    'rain',
    'research',
    'rice',
    'salmon',
    'scissors',
    'series',
    'sewage',
    'shambles',
    'shrimp',
    'species',
    'staff',
    'swine',
    'tennis',
    'traffic',
    'transporation',
    'trout',
    'tuna',
    'wealth',
    'welfare',
    'whiting',
    'wildebeest',
    'wildlife',
    'you',
    // Regexes.
    /[^aeiou]ese$/i, // "chinese", "japanese"
    /deer$/i, // "deer", "reindeer"
    /fish$/i, // "fish", "blowfish", "angelfish"
    /measles$/i,
    /o[iu]s$/i, // "carnivorous"
    /pox$/i, // "chickpox", "smallpox"
    /sheep$/i
  ].forEach(pluralize.addUncountableRule);

  return pluralize;
});
});

const typeIsList = (type) => {
    let isList = false;
    if (type.name && type.name.endsWith('Connection')) {
        isList = true;
    }
    while (!isList && (graphql.isListType(type) || graphql.isNonNullType(type) || type.kind === 'NON_NULL' || type.kind === 'LIST')) {
        if (graphql.isListType(type) || type.kind === 'LIST') {
            isList = true;
            break;
        }
        type = type.ofType;
    }
    return isList;
};
const getReturnType = (type) => {
    if (graphql.isListType(type) || graphql.isNonNullType(type) || type.kind === 'NON_NULL' || type.kind === 'LIST') {
        return getReturnType(type.ofType);
    }
    else {
        return type.name;
    }
};
class FindByUniqueError extends Error {
    constructor(message, code, properties) {
        super(message);
        if (properties) {
            Object.keys(properties).forEach(key => {
                this[key] = properties[key];
            });
        }
        // if no name provided, use the default. defineProperty ensures that it stays non-enumerable
        if (!this.name) {
            Object.defineProperty(this, 'name', { value: 'ApolloError' });
        }
        // extensions are flattened to be included in the root of GraphQLError's, so
        // don't add properties to extensions
        this.extensions = { code };
    }
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

class Relation {
    constructor($type, $field, $field0isList) {
        this.type0 = $type;
        this.field0 = $field;
        this.field0isList = $field0isList;
    }
    setRelative(relation) {
        this.type1 = relation.type0;
        this.field1 = relation.field0;
        this.field1isList = relation.field0isList;
    }
    isValidRelative(relation) {
        if (!this.type1) {
            return true;
        }
        else {
            return this.isSameRelation(relation) || this.isCurrentRelation(relation);
        }
    }
    isSameRelation(relation) {
        return this.type0 === relation.type0 && this.field0 === relation.field0 && this.field0isList === relation.field0isList;
    }
    isCurrentRelation(relation) {
        return this.type1 === relation.type0 && this.field1 === relation.field0 && this.field1isList === relation.field0isList;
    }
    getInverse(type, field, inverseType) {
        const inverse = this.getInverseTuple(type, field, inverseType);
        return inverse ? inverse[1] : null;
    }
    getInverseTuple(type, field, inverseType) {
        let inverse = null;
        if (this.type0 === type && this.field0 === field && (!inverseType || this.type1 === inverseType)) {
            inverse = [this.type1, this.field1];
        }
        else if (this.type1 === type && this.field1 === field && (!inverseType || this.type0 === inverseType)) {
            inverse = [this.type0, this.field0];
        }
        return inverse;
    }
}
class Relations {
    constructor() {
        this.relations = new Map();
    }
    getRelation(name) {
        let relations = null;
        if (this.relations.has(name)) {
            relations = this.relations.get(name);
        }
        return relations;
    }
    getInverseWithoutName(type, field, inverseType) {
        let inverse = null;
        const iter = this.relations.values();
        let relation = iter.next().value;
        while (!inverse && relation) {
            inverse = relation.getInverse(type, field, inverseType);
            relation = iter.next().value;
        }
        return inverse;
    }
    getInverse(name, type, field) {
        let inverse = null;
        if (this.relations.has(name)) {
            const relation = this.relations.get(name);
            inverse = relation.getInverse(type, field);
        }
        return inverse;
    }
    setRelation(name, type, field, fieldIsList) {
        const newRelation = new Relation(type, field, fieldIsList);
        if (!this.relations.has(name)) {
            this.relations.set(name, newRelation);
        }
        else {
            const relation = this.relations.get(name);
            if (relation.isValidRelative(newRelation)) {
                if (!relation.isSameRelation(newRelation)) {
                    relation.setRelative(newRelation);
                }
            }
            else {
                this.throwError(name, type, field, relation.field0);
            }
        }
    }
    setSelfRelation(name, type, field, fieldIsList) {
        const newRelation = new Relation(type, field, fieldIsList);
        newRelation.setRelative(newRelation);
        this.relations.set(name, newRelation);
    }
    throwError(name, type, primaryField, relatedField) {
        throw new Error(`Bad schema, relation could apply to multiple fields
			relation name: ${name}
			fortune name: ${type}
			curr field: ${primaryField}
			other field: ${relatedField}`);
    }
}
const computeNumFieldsOfType = (type, checkFieldTypeName) => {
    let resultNum = 0;
    lodash.each(type.fields, field => {
        if (checkFieldTypeName === getReturnType(field.type)) {
            resultNum++;
        }
    });
    return resultNum;
};
const getNumFieldsOfType = (cache, type, checkFieldTypeName) => {
    let numFields = 0;
    const typeName = getReturnType(type);
    if (cache.has(typeName) && cache.get(typeName).has(checkFieldTypeName)) {
        numFields = cache.get(typeName).get(checkFieldTypeName);
    }
    else {
        numFields = computeNumFieldsOfType(type, checkFieldTypeName);
        if (!cache.has(typeName)) {
            cache.set(typeName, new Map());
        }
        cache.get(typeName).set(checkFieldTypeName, numFields);
    }
    return numFields;
};
const computeRelations = (schemaInfo, typeNameResolver = (name) => name) => {
    const numFieldsOfTypeCache = new Map();
    const relations = new Relations();
    lodash.each(lodash.keys(schemaInfo), (typeName) => {
        const type = schemaInfo[typeName];
        lodash.each(type.fields, field => {
            const relation = lodash.get(field, 'metadata.relation');
            const fieldTypeName = getReturnType(field.type);
            const reslovedTypeName = typeNameResolver(fieldTypeName);
            if (relation) {
                relations.setRelation(relation.name, reslovedTypeName, field.name, typeIsList(field.type));
            }
            else if (typeName === fieldTypeName) {
                relations.setSelfRelation(`${field.name}On${typeName}`, reslovedTypeName, field.name, typeIsList(field.type));
            }
            else {
                const fieldTypeInfo = schemaInfo[fieldTypeName];
                if (type && fieldTypeInfo) {
                    const numFields = getNumFieldsOfType(numFieldsOfTypeCache, type, fieldTypeName);
                    const reverseNumFields = getNumFieldsOfType(numFieldsOfTypeCache, fieldTypeInfo, typeName);
                    if (numFields === 1 && reverseNumFields === 1) {
                        const possibleTypes = [typeName, fieldTypeName];
                        possibleTypes.sort();
                        relations.setRelation(possibleTypes.join('_'), reslovedTypeName, field.name, typeIsList(field.type));
                    }
                }
            }
        });
    });
    return relations;
};
var Mutation;
(function (Mutation) {
    Mutation[Mutation["Create"] = 0] = "Create";
    Mutation[Mutation["Update"] = 1] = "Update";
    Mutation[Mutation["Delete"] = 2] = "Delete";
    Mutation[Mutation["Upsert"] = 3] = "Upsert";
})(Mutation || (Mutation = {}));
const clean = (obj) => {
    const returnObj = {};
    for (const propName in obj) {
        if (obj[propName] !== null && obj[propName] !== undefined) {
            // tslint:disable-next-line:prefer-conditional-expression
            if (lodash.isObject(obj[propName]) && !lodash.isEmpty(obj[propName])) {
                returnObj[propName] = obj[propName];
            }
            else {
                returnObj[propName] = obj[propName];
            }
        }
    }
    return returnObj;
};
const setupArgs = (results, args) => {
    // setup the arguments to use the new types
    results.forEach((types) => {
        types = types ? types : [];
        types.forEach(type => {
            if (type && type.key && type.id && type.index > -1) {
                const key = type.key;
                const id = type.id;
                const arg = args[type.index];
                if (lodash.isArray(arg[key])) {
                    if (lodash.isArray(id)) {
                        arg[key] = lodash.union(id, arg[key]);
                    }
                    else if (!arg[key].includes(id)) {
                        arg[key].push(id);
                    }
                }
                else {
                    arg[key] = id;
                }
            }
        });
    });
    return args;
};
const resolveArgs = (args, returnType, mutation, dataResolver, currRecord, _args, _context, _info) => __awaiter(void 0, void 0, void 0, function* () {
    const promises = [];
    args.forEach((currArg, index) => {
        for (const argName in currArg) {
            let argReturnType;
            let argReturnRootType;
            if ((graphql.isObjectType(returnType) || graphql.isInterfaceType(returnType)) && returnType.getFields()[argName]) {
                argReturnType = returnType.getFields()[argName].type;
                argReturnRootType = graphql.getNamedType(argReturnType);
                if (argReturnRootType['name'].endsWith('Connection')) {
                    argReturnRootType = _info.schema.getType(argReturnRootType['name'].replace(/Connection$/g, ''));
                    argReturnType = new graphql.GraphQLList(argReturnRootType);
                }
            }
            if (argReturnRootType && !graphql.isScalarType(argReturnRootType) && !graphql.isEnumType(argReturnRootType)) {
                const arg = currArg[argName];
                if (lodash.isObject(arg) && argReturnType) {
                    currArg[argName] = typeIsList(argReturnType) ? [] : undefined;
                    if (graphql.isInterfaceType(argReturnRootType) || graphql.isUnionType(argReturnRootType)) {
                        for (const argKey in arg) {
                            const argTypeName = pluralize.singular(argKey).toLowerCase();
                            argReturnRootType = lodash.find(_info.schema.getTypeMap(), type => {
                                return type.name.toLowerCase() === argTypeName;
                            });
                            promises.push(mutateResolver(mutation, dataResolver)(currRecord, arg[argKey], _context, _info, index, argName, argReturnRootType));
                        }
                    }
                    else {
                        promises.push(mutateResolver(mutation, dataResolver)(currRecord, arg, _context, _info, index, argName, argReturnRootType));
                    }
                }
            }
        }
    });
    const results = yield Promise.all(promises);
    args = setupArgs(results, args);
    return args;
});
const mutateResolver = (mutation, dataResolver) => {
    return (currRecord, _args, _context, _info, index, key, returnType) => __awaiter(void 0, void 0, void 0, function* () {
        yield dataResolver.beginTransaction();
        // iterate over all the non-id arguments and recursively create new types
        const recursed = returnType ? true : false;
        if (!returnType) {
            returnType = _info.returnType.getFields().data.type;
            returnType = graphql.getNamedType(returnType);
        }
        const returnTypeName = getReturnType(returnType);
        const clientMutationId = _args.input && _args.input.clientMutationId ? _args.input.clientMutationId : '';
        let createArgs = _args.create ? _args.create : mutation === Mutation.Create && lodash.get(_args, 'input.data') ? lodash.get(_args, 'input.data') : [];
        createArgs = createArgs && !lodash.isArray(createArgs) ? [createArgs] : createArgs;
        let updateArgs = _args.update ? _args.update : mutation === Mutation.Update && lodash.get(_args, 'input.data') ? lodash.get(_args, 'input.data') : [];
        updateArgs = updateArgs && !lodash.isArray(updateArgs) ? [updateArgs] : updateArgs;
        let upsertArgs = _args.upsert ? _args.upsert : mutation === Mutation.Upsert && lodash.get(_args, 'input') ? lodash.get(_args, 'input') : [];
        upsertArgs = upsertArgs && !lodash.isArray(upsertArgs) ? [upsertArgs] : upsertArgs;
        let deleteArgs = _args.delete ? _args.delete : mutation === Mutation.Delete && _args.input.where ? _args.input.where : [];
        deleteArgs = deleteArgs && !lodash.isArray(deleteArgs) ? [deleteArgs] : deleteArgs;
        let connectArgs = _args.connect ? _args.connect : [];
        connectArgs = connectArgs && !lodash.isArray(connectArgs) ? [connectArgs] : connectArgs;
        let disconnectArgs = _args.disconnect ? _args.disconnect : [];
        disconnectArgs = disconnectArgs && !lodash.isArray(disconnectArgs) ? [disconnectArgs] : disconnectArgs;
        const whereArgs = _args.where ? _args.where : _args.input && _args.input.where ? _args.input.where : null;
        const conditionsArgs = _args.conditions ? _args.conditions : _args.input && _args.input.conditions ? _args.input.conditions : null;
        // lets make sure we are able to add this (prevent duplicates on unique fields, etc)
        const canAddResults = yield Promise.all([dataResolver.canAdd(returnTypeName, createArgs, { context: _context, info: _info }),
            dataResolver.canAdd(returnTypeName, updateArgs, { context: _context, info: _info })]);
        const cannotAdd = canAddResults.includes(false);
        if (cannotAdd) {
            throw new Error('Can not create record with duplicate on unique field on type ' + returnTypeName + ' ' + JSON.stringify(createArgs) + ' ' + JSON.stringify(updateArgs));
        }
        const dataResolverPromises = [];
        if (!lodash.isEmpty(updateArgs)) {
            if (whereArgs) {
                // we have a where so use that to get the record to update
                // pass true to where args if currRecord is already the one we want
                if (whereArgs !== true) {
                    const returnTypeName = getReturnType(returnType);
                    currRecord = yield dataResolver.getValueByUnique(returnTypeName, whereArgs, { context: _context, info: _info });
                    if (!currRecord || lodash.isEmpty(currRecord)) {
                        throw new FindByUniqueError(`${returnTypeName} does not exist with where args ${JSON.stringify(whereArgs)}`, 'update', { arg: whereArgs, typename: returnTypeName });
                    }
                }
            }
            else if (updateArgs[0].data && updateArgs[0].where) {
                // this is a nested update an a list type so we need to individually do updates
                updateArgs.forEach((currArg) => {
                    dataResolverPromises.push(new Promise((resolve, reject) => {
                        mutateResolver(mutation, dataResolver)(currRecord, { update: currArg.data, where: currArg.where }, _context, _info, index, key, returnType).then((result) => {
                            if (recursed) {
                                resolve();
                            }
                            else {
                                resolve(result[0]);
                            }
                        }).catch(reason => {
                            reject(reason);
                        });
                    }));
                });
                updateArgs = [];
            }
            else if (key && currRecord) {
                // this is a nested input on a single field so we already know the where
                const recordToUpdate = yield dataResolver.getValueByUnique(returnTypeName, { id: currRecord[key] }, { context: _context, info: _info });
                if (recordToUpdate) {
                    currRecord = recordToUpdate;
                }
                else {
                    // trying to update an empty field
                    updateArgs = [];
                }
            }
        }
        if (!lodash.isEmpty(upsertArgs)) {
            yield Promise.all(upsertArgs.map((currArg) => __awaiter(void 0, void 0, void 0, function* () {
                const whereArg = currArg.where;
                let upsertRecord = currRecord;
                if (whereArg) {
                    // this is a root upsert or nested upsert with a where field
                    upsertRecord = yield dataResolver.getValueByUnique(returnTypeName, whereArg, { context: _context, info: _info });
                }
                else if (upsertRecord && key) {
                    // this is a nested upsert on a single field so we already have the where
                    upsertRecord = upsertRecord[key] ? yield dataResolver.getValueByUnique(returnTypeName, { id: upsertRecord[key] }, { context: _context, info: _info }) : null;
                }
                let newArgs = { create: currArg.create };
                if (upsertRecord && !lodash.isEmpty(upsertRecord)) {
                    // pass true to where args if currRecord will already be the one we want
                    newArgs = { where: true, update: currArg.update, conditions: conditionsArgs };
                }
                dataResolverPromises.push(new Promise((resolve, reject) => {
                    mutateResolver(mutation, dataResolver)(upsertRecord, newArgs, _context, _info, index, key, returnType).then((result) => {
                        if (result[0]) {
                            resolve(result[0]);
                        }
                        else {
                            resolve();
                        }
                    }).catch(reason => {
                        reject(reason);
                    });
                }));
            })));
        }
        [createArgs, updateArgs] = yield Promise.all([
            resolveArgs(createArgs, returnType, Mutation.Create, dataResolver, currRecord, _args, _context, _info),
            resolveArgs(updateArgs, returnType, Mutation.Update, dataResolver, currRecord, _args, _context, _info)
        ]);
        // could be creating more than 1 type
        createArgs.forEach((createArg) => {
            createArg = createArg.hasOwnProperty ? createArg : Object.assign({}, createArg);
            createArg = clean(createArg);
            if (createArg && !lodash.isEmpty(createArg)) {
                dataResolverPromises.push(new Promise((resolve, reject) => {
                    dataResolver.create(returnTypeName, createArg, { context: _context, info: _info }).then(data => {
                        const id = lodash.isArray(data) ? lodash.map(data, 'id') : data.id;
                        resolve({ index, key, id, data });
                    }).catch(reason => {
                        reject(reason);
                    });
                }));
            }
        });
        // now updates
        updateArgs.forEach((updateArg) => {
            // make sure it is prototype correctly to prevent error
            updateArg = updateArg.hasOwnProperty ? updateArg : Object.assign({}, updateArg);
            // only do updates on new values
            for (const updateArgKey in updateArg) {
                const currArg = updateArg[updateArgKey];
                const currRecordArg = currRecord[updateArgKey];
                if (lodash.eq(currRecordArg, currArg)) {
                    delete currRecord[updateArgKey];
                }
                else if (lodash.isArray(currArg) && lodash.isArray(currRecordArg)) {
                    // for relations we can't have duplicates, only relations will be arrays
                    updateArg[updateArgKey] = lodash.difference(currArg, currRecordArg);
                }
            }
            const cleanArg = clean(updateArg);
            if (cleanArg && !lodash.isEmpty(cleanArg)) {
                dataResolverPromises.push(new Promise((resolve, reject) => {
                    cleanArg.id = currRecord.id;
                    const meta = { context: _context, info: _info };
                    meetsConditions(conditionsArgs, returnTypeName, returnType, currRecord, dataResolver, _context, _info).then(meetsConditionsResult => {
                        if (!meetsConditionsResult) {
                            resolve({ index, key, id: [], unalteredData: currRecord });
                        }
                        else {
                            dataResolver.update(returnTypeName, cleanArg, meta).then(data => {
                                const id = lodash.isArray(data) ? lodash.map(data, 'id') : data.id;
                                resolve({ index, key, id, data });
                            }).catch(reason => {
                                reject(reason);
                            });
                        }
                    }).catch(reason => {
                        reject(reason);
                    });
                }));
            }
            else if (currRecord) {
                currRecord = Object.assign(currRecord, updateArg);
            }
        });
        // now add the connect types
        connectArgs.forEach(connectArg => {
            dataResolverPromises.push(new Promise((resolve, reject) => {
                dataResolver.getValueByUnique(returnTypeName, connectArg, { context: _context, info: _info }).then(data => {
                    if (data && data['id']) {
                        resolve({ index, key, id: data['id'], data });
                    }
                    else {
                        reject(new FindByUniqueError(`connect: ${returnTypeName} does not exist with where args ${JSON.stringify(connectArg)}`, 'disconnect', { arg: connectArg, typename: returnTypeName }));
                    }
                }).catch(reason => {
                    reject(reason);
                });
            }));
        });
        // disconnect
        const disconnectPromises = [];
        disconnectArgs.forEach(disconnectArg => {
            if (disconnectArg === true) {
                dataResolverPromises.push(new Promise((resolve, reject) => {
                    dataResolver.update(currRecord.__typename, { id: currRecord.id, [key]: null }, { context: _context, info: _info }).then(data => {
                        resolve({ index, key, id: null, data });
                    }).catch(reason => {
                        reject(reason);
                    });
                }));
            }
            else {
                disconnectPromises.push(new Promise((resolve, reject) => {
                    dataResolver.getValueByUnique(returnTypeName, disconnectArg, { context: _context, info: _info }).then(data => {
                        if (data && data['id']) {
                            resolve(data['id']);
                        }
                        else {
                            reject(new FindByUniqueError(`disconnect: ${returnTypeName} does not exist with where args ${JSON.stringify(disconnectArg)}`, 'disconnect', { arg: disconnectArg, typename: returnTypeName }));
                        }
                    }).catch(reason => {
                        reject(reason);
                    });
                }));
            }
        });
        const disconnectIds = yield Promise.all(disconnectPromises);
        if (!lodash.isEmpty(disconnectIds)) {
            dataResolverPromises.push(new Promise((resolve, reject) => {
                dataResolver.update(currRecord.__typename, { id: currRecord.id, [key]: disconnectIds }, { context: _context, info: _info }, { pull: true }).then(data => {
                    resolve({ index, key, id: data[key], data });
                }).catch(reason => {
                    reject(reason);
                });
            }));
        }
        // delete
        const deletePromises = [];
        deleteArgs.forEach(deleteArg => {
            if (deleteArg === true) {
                // nested singular delete
                dataResolverPromises.push(new Promise((resolve, reject) => {
                    dataResolver.delete(dataResolver.getLink(currRecord.__typename, key), [currRecord[key]], { context: _context, info: _info }).then(data => {
                        resolve({ index, key, id: null, data });
                    }).catch(reason => {
                        reject(reason);
                    });
                }));
            }
            else if (whereArgs && !currRecord) {
                // delete resolver
                dataResolverPromises.push(new Promise((resolve, reject) => {
                    dataResolver.getValueByUnique(returnTypeName, whereArgs, { context: _context, info: _info }).then(whereData => {
                        currRecord = whereData;
                        if (!currRecord || lodash.isEmpty(currRecord)) {
                            throw new FindByUniqueError(`${returnTypeName} does not exist with where args ${JSON.stringify(whereArgs)}`, 'delete', { arg: whereArgs, typename: returnTypeName });
                        }
                        meetsConditions(conditionsArgs, returnTypeName, returnType, currRecord, dataResolver, _context, _info).then(meetsConditionsResult => {
                            if (!meetsConditionsResult) {
                                resolve({ index, key, id: [], unalteredData: currRecord });
                            }
                            else {
                                dataResolver.delete(currRecord.__typename, [currRecord.id], { context: _context, info: _info }).then(() => {
                                    resolve({ index, key, id: null, data: currRecord });
                                }).catch(reason => {
                                    reject(reason);
                                });
                            }
                        }).catch(reason => {
                            reject(reason);
                        });
                    }).catch(reason => {
                        reject(reason);
                    });
                }));
            }
            else {
                // nested delete on list
                deletePromises.push(new Promise((resolve, reject) => {
                    const deleteTypeName = dataResolver.getLink(currRecord.__typename, key);
                    dataResolver.getValueByUnique(deleteTypeName, deleteArg, { context: _context, info: _info }).then(data => {
                        if (data && data['id']) {
                            resolve(data['id']);
                        }
                        else {
                            reject(new FindByUniqueError(`${deleteTypeName} does not exist with where args ${JSON.stringify(deleteArg)}`, 'delete', { arg: deleteArg, typename: deleteTypeName }));
                        }
                    }).catch(reason => {
                        reject(reason);
                    });
                }));
            }
        });
        const deleteIds = yield Promise.all(deletePromises);
        if (!lodash.isEmpty(deleteIds)) {
            dataResolverPromises.push(new Promise((resolve, reject) => {
                dataResolver.delete(dataResolver.getLink(currRecord.__typename, key), deleteIds, { context: _context, info: _info }).then(data => {
                    resolve({ index, key, id: data[key], data });
                }).catch(reason => {
                    reject(reason);
                });
            }));
        }
        const dataResult = yield Promise.all(dataResolverPromises);
        // if key this is recursed else it's the final value
        if (recursed) {
            return dataResult;
        }
        else {
            yield dataResolver.endTransaction();
            let data = lodash.get(dataResult, '[0].data');
            const unalteredData = lodash.get(dataResult, '[0].unalteredData', null);
            if (!unalteredData && !data && mutation === Mutation.Delete) {
                data = currRecord;
            }
            else if (!unalteredData && !data) {
                // if everything was already done on the object (updates, deletions and disconnects) it should be the currRecord but with changes
                data = currRecord;
            }
            return {
                data,
                clientMutationId,
                unalteredData
            };
        }
    });
};
const createResolver = (dataResolver) => {
    return mutateResolver(Mutation.Create, dataResolver);
};
const updateResolver = (dataResolver) => {
    return mutateResolver(Mutation.Update, dataResolver);
};
const upsertResolver = (dataResolver) => {
    return mutateResolver(Mutation.Upsert, dataResolver);
};
const deleteResolver = (dataResolver) => {
    return mutateResolver(Mutation.Delete, dataResolver);
};
const getTypeResolver = (dataResolver, schema, field, returnConnection = false) => {
    const schemaType = schema.getType(getReturnType(field.type));
    let resolver;
    if (!graphql.isScalarType(schemaType) && !graphql.isEnumType(schemaType)) {
        resolver = (root, _args, _context, _info) => __awaiter(void 0, void 0, void 0, function* () {
            const fortuneReturn = root && root.fortuneReturn ? root.fortuneReturn : root;
            if (!fortuneReturn) {
                return fortuneReturn;
            }
            const cache = root && root.cache ? root.cache : new Map();
            const typeName = getReturnType(field.type);
            let result = [];
            let returnArray = false;
            let fieldValue = fortuneReturn[field.name];
            returnArray = lodash.isArray(fieldValue);
            fieldValue = returnArray ? fieldValue : [fieldValue];
            // actual value is filled from cache not just ids
            if (lodash.isObject(fieldValue[0])) {
                result = fieldValue;
            }
            const ids = [];
            let options = {};
            _args = moveArgsIntoWhere(_args);
            let where = null;
            if (_args && _args.where) {
                where = _args.where;
                options = parseFilter(where, schemaType);
            }
            if (_args.orderBy) {
                lodash.set(options, 'orderBy', _args.orderBy);
            }
            if (_args.skip) {
                lodash.set(options, 'offset', _args.skip);
            }
            let connection;
            options = clean(options);
            // I guess use the args here instead of args as a result of cache
            if (!lodash.isEmpty(options)) {
                result = [];
            }
            if (lodash.isEmpty(result)) {
                fieldValue.forEach(id => {
                    if (id) {
                        if (cache.has(id)) {
                            result.push(cache.get(id));
                        }
                        else {
                            ids.push(id);
                        }
                    }
                });
            }
            let findOptions = {};
            let applyOptionsWithCombinedResult = false;
            if (!lodash.isEmpty(result) && !lodash.isEmpty(options)) {
                applyOptionsWithCombinedResult = true;
            }
            else {
                findOptions = options;
            }
            if (!lodash.isEmpty(ids)) {
                let findResult = yield dataResolver.find(typeName, ids, findOptions, { context: _context, info: _info });
                if (findResult) {
                    findResult = lodash.isArray(findResult) ? findResult : [findResult];
                    // remove null values
                    findResult = findResult.filter(function (n) { return !!n; });
                    findResult.forEach(result => {
                        cache.set(result.id, result);
                    });
                    result = result.concat(findResult);
                }
            }
            if (applyOptionsWithCombinedResult) {
                result = dataResolver.applyOptions(typeName, result, options);
            }
            if ((_args.orderBy || where) && (graphql.isObjectType(schemaType) || graphql.isInterfaceType(schemaType))) {
                const pullIds = yield filterNested(where, _args.orderBy, schemaType, fortuneReturn, cache, dataResolver, _context, _info);
                result = result.filter(entry => !pullIds.has(entry.id));
            }
            // use cached data on subfields in order to support nested orderBy/where
            result.forEach(resultElement => {
                for (const resultElementField in resultElement) {
                    if (cache.has(`${resultElement.id}.${resultElementField}`)) {
                        resultElement[resultElementField] = cache.get(`${resultElement.id}.${resultElementField}`);
                    }
                }
            });
            connection = dataResolver.getConnection(result, _args.before, _args.after, _args.first, _args.last);
            result = connection.edges;
            result = result.map((entry) => {
                return {
                    fortuneReturn: entry,
                    cache: cache,
                    __typename: entry.__typename
                };
            });
            result = !returnArray && result.length === 0 ? null : returnArray ? result : result[0];
            if (returnConnection) {
                result = {
                    edges: result,
                    pageInfo: connection && connection.pageInfo ? connection.pageInfo : null,
                    aggregate: connection && connection.aggregate ? connection.aggregate : null
                };
            }
            return result;
        });
    }
    else {
        resolver = (root, _args, _context, _info) => __awaiter(void 0, void 0, void 0, function* () {
            const fortuneReturn = root && root.fortuneReturn ? root.fortuneReturn : root;
            const result = yield graphql.defaultFieldResolver.apply(this, [fortuneReturn, _args, _context, _info]);
            return result;
        });
    }
    return resolver;
};
const getAllResolver = (dataResolver, schema, type, returnConnection = false) => {
    return (_root, _args, _context, _info) => __awaiter(void 0, void 0, void 0, function* () {
        let options = {};
        let where = null;
        _args = moveArgsIntoWhere(_args);
        const schemaType = schema.getType(type.name);
        if (_args && _args.where) {
            where = _args.where;
            options = parseFilter(_args.where, schemaType);
        }
        if (_args.orderBy) {
            lodash.set(options, 'orderBy', _args.orderBy);
        }
        if (_args.skip) {
            lodash.set(options, 'offset', _args.skip);
        }
        let connection;
        let result = [];
        let fortuneReturn = yield dataResolver.find(type.name, null, options, { context: _context, info: _info });
        if (fortuneReturn && !lodash.isEmpty(fortuneReturn)) {
            fortuneReturn = lodash.isArray(fortuneReturn) ? fortuneReturn : [fortuneReturn];
            connection = dataResolver.getConnection(fortuneReturn, _args.before, _args.after, _args.first, _args.last);
            fortuneReturn = connection.edges;
            const cache = new Map();
            fortuneReturn.forEach(result => {
                if (result && result.id) {
                    cache.set(result.id, result);
                }
            });
            if ((_args.orderBy || where) && (graphql.isObjectType(schemaType) || graphql.isInterfaceType(schemaType))) {
                const pullIds = yield filterNested(where, _args.orderBy, schemaType, fortuneReturn, cache, dataResolver, _context, _info);
                fortuneReturn = pullIds.size > 0 ? fortuneReturn.filter(result => !pullIds.has(result ? result.id : '')) : fortuneReturn;
            }
            result = fortuneReturn.map((result) => {
                if (!result) {
                    return result;
                }
                return {
                    fortuneReturn: result,
                    cache: cache,
                    where,
                    __typename: result.__typename
                };
            });
        }
        if (returnConnection) {
            result = {
                edges: result,
                pageInfo: connection && connection.pageInfo ? connection.pageInfo : null,
                aggregate: connection && connection.aggregate ? connection.aggregate : null
            };
        }
        return result;
    });
};
const queryArgs = {
    'first': { type: 'Int', description: 'Slice result from the start' },
    'last': { type: 'Int', description: 'Slice result from the end' },
    'skip': { type: 'Int', description: 'Skip results' },
    'before': { type: 'String', description: 'Cursor returned by previous connection queries for pagination' },
    'after': { type: 'String', description: 'Cursor returned by previous connection queries for pagination' },
};
const fortuneFilters = ['not', 'or', 'and', 'range', 'match', 'exists'];
const genieFindArgs = ['first', 'where', 'orderBy', 'local', 'last', 'skip', 'before', 'after'];
const getRootMatchFields = (matchInput) => {
    const matchFields = matchInput.getFields();
    const args = {};
    Object.keys(matchFields).forEach(key => {
        let newKey = key;
        if (genieFindArgs.includes(key)) {
            newKey = `f_${key}`;
        }
        args[newKey] = matchFields[key];
        args[newKey].name = newKey;
        args[newKey].description = `${key} matches at least one of argument`;
    });
    return args;
};
const moveArgsIntoWhere = (args) => {
    if (!args) {
        return args;
    }
    Object.keys(args).forEach((argKey) => {
        if (!genieFindArgs.includes(argKey)) {
            lodash.set(args, 'where.match.' + argKey, args[argKey]);
            delete args[argKey];
        }
    });
    return args;
};
const parseFilter = (filter, type) => {
    if (!graphql.isObjectType(type) && !graphql.isInterfaceType(type)) {
        return filter;
    }
    if (!filter || !lodash.isObject(filter) || lodash.isArray(filter)) {
        return filter;
    }
    lodash.each(type.getFields(), field => {
        if (!fortuneFilters.includes(field.name) && filter[field.name]) {
            if (filter['and']) {
                filter['and'].push({ exists: { [field.name]: true } });
            }
            else {
                lodash.set(filter, `exists.${field.name}`, true);
            }
        }
    });
    return filter;
};
const filterNested = (filter, orderBy, type, fortuneReturn, cache, dataResolver, _context, _info) => __awaiter(void 0, void 0, void 0, function* () {
    // if they have nested filters on types we need to get that data now so we can filter at this root query
    const pullIds = new Set();
    if (!cache) {
        cache = new Map();
    }
    if ((orderBy || filter) && (graphql.isObjectType(type) || graphql.isInterfaceType(type))) {
        yield Promise.all(lodash.map(type.getFields(), (field) => __awaiter(void 0, void 0, void 0, function* () {
            const currFilter = filter && filter[field.name] ? filter[field.name] : filter && filter[`f_${field.name}`] ? filter[`f_${field.name}`] : null;
            const currOrderBy = orderBy && orderBy[field.name] ? orderBy[field.name] : orderBy && orderBy[`f_${field.name}`] ? orderBy[`f_${field.name}`] : null;
            const childType = graphql.getNamedType(field.type);
            if (!graphql.isScalarType(childType) && !graphql.isEnumType(childType) && (currFilter || currOrderBy)) {
                const options = currFilter ? parseFilter(currFilter, childType) : {};
                yield Promise.all(fortuneReturn.map((result) => __awaiter(void 0, void 0, void 0, function* () {
                    if (!result) {
                        return result;
                    }
                    const childIds = result[field.name];
                    if (childIds && !lodash.isEmpty(childIds)) {
                        if (currOrderBy) {
                            options['orderBy'] = currOrderBy;
                        }
                        let childReturn = yield dataResolver.find(childType.name, childIds, options, { context: _context, info: _info });
                        if (lodash.isArray(childReturn) && !lodash.isEmpty(childReturn)) {
                            const recursePullIds = yield filterNested(currFilter, currOrderBy, childType, childReturn, cache, dataResolver, _context, _info);
                            childReturn = childReturn ? childReturn.filter(result => {
                                if (!result) {
                                    return result;
                                }
                                return !recursePullIds.has(result.id);
                            }) : childReturn;
                        }
                        else if (childReturn && (currOrderBy || currFilter)) {
                            const recursePullIds = yield filterNested(currFilter, currOrderBy, childType, [childReturn], cache, dataResolver, _context, _info);
                            childReturn = childReturn ? [childReturn].filter(result => {
                                if (!result) {
                                    return result;
                                }
                                return !recursePullIds.has(result.id);
                            }) : childReturn;
                        }
                        if (childReturn && !lodash.isEmpty(childReturn)) {
                            if (cache) {
                                if (childReturn.id) {
                                    cache.set(childReturn.id, childReturn);
                                }
                                else {
                                    cache.set(`${result.id}.${field.name}`, childReturn);
                                }
                            }
                        }
                        else {
                            pullIds.add(result.id);
                        }
                    }
                })));
            }
        })));
    }
    return pullIds;
});
const getPayloadTypeName = (typeName) => {
    return `${typeName}Payload`;
};
const getPayloadTypeDef = (typeName) => {
    return `
		type ${getPayloadTypeName(typeName)} {
			data: ${typeName}
			clientMutationId: String
			#In the case of a update or delete and you had conditions, if the conditions did not match the existing object will be returned here. data will be null
			unalteredData: ${typeName}
		}`;
};
const capFirst = (val) => {
    return val ? val.charAt(0).toUpperCase() + val.slice(1) : '';
};
// resolvers may have meta info that's not wanted
const getRecordFromResolverReturn = (record) => {
    record = record && record.fortuneReturn ? record.fortuneReturn : record;
    record = record && record.edges ? record.edges : record;
    record = record && record.node ? record.node : record;
    record = record && record.fortuneReturn ? record.fortuneReturn : record;
    record = record && record.data ? record.data : record;
    return record;
};
const meetsConditions = (conditionsArgs, returnTypeName, returnType, currRecord, dataResolver, _context, _info) => __awaiter(void 0, void 0, void 0, function* () {
    let meetsConditions = true;
    if (conditionsArgs) {
        const conditionsOptions = parseFilter(conditionsArgs, returnType);
        let dataAfterConditions = dataResolver.applyOptions(returnTypeName, currRecord, conditionsOptions);
        if (!lodash.isEmpty(dataAfterConditions)) {
            if (conditionsArgs && (graphql.isObjectType(returnType) || graphql.isInterfaceType(returnType))) {
                const pullIds = yield filterNested(conditionsArgs, null, returnType, currRecord, null, dataResolver, _context, _info);
                dataAfterConditions = dataAfterConditions.filter(entry => !pullIds.has(entry.id));
            }
        }
        if (lodash.isEmpty(dataAfterConditions)) {
            meetsConditions = false;
        }
    }
    return meetsConditions;
});

class GraphQLSchemaBuilder {
    constructor(typeDefs = '', $config) {
        this.printSchemaWithDirectives = () => {
            const str = Object
                .keys(this.schema.getTypeMap())
                .filter(k => !k.match(/^__/))
                .reduce((accum, name) => {
                const type = this.schema.getType(name);
                return !graphql.isScalarType(type)
                    ? accum += `${graphql.print(type.astNode)}\n`
                    : accum;
            }, '');
            return this.schema
                .getDirectives()
                .reduce((accum, d) => {
                return !graphql.isSpecifiedDirective(d)
                    ? accum += `${graphql.print(d.astNode)}\n`
                    : accum;
            }, str + `${this.schema.astNode ? graphql.print(this.schema.astNode) : ''}\n`);
        };
        this.addTypeDefsToSchema = ($typeDefs = '') => {
            if ($typeDefs) {
                this.typeDefs += (typeof $typeDefs === 'string' ? $typeDefs : graphql.print($typeDefs));
            }
            if (this.typeDefs.includes('@model') && !this.typeDefs.includes('directive @model')) {
                this.typeDefs = '\ndirective @model on OBJECT' + this.typeDefs;
            }
            if (this.typeDefs.includes('@connection') && !this.typeDefs.includes('directive @connection')) {
                this.typeDefs = '\ndirective @connection on FIELD_DEFINITION' + this.typeDefs;
            }
            if ((this.config.generateGetAll || this.config.generateConnections) && !this.typeDefs.includes('enum ORDER_BY_OPTIONS')) {
                this.typeDefs += `
			enum ORDER_BY_OPTIONS {
				ASCENDING
				DESCENDING
				ASC
				DESC
			}
			`;
            }
            if (this.typeDefs.includes('type Query') && (this.config.generateDelete || this.config.generateUpdate) && !this.typeDefs.includes('type BatchPayload')) {
                this.typeDefs += `
				type BatchPayload {
					"""
					The number of nodes that have been affected by the Batch operation.
					"""
					count: Int!
					clientMutationId: String
				}
			`;
            }
            let newTypeDefs = this.typeDefs;
            if (!this.typeDefs.includes('type Query')) {
                newTypeDefs += 'type Query {noop:Int}';
            }
            // let's make sure we have a valid schema
            try {
                graphqlTools.buildSchemaFromTypeDefinitions(newTypeDefs);
            }
            catch (e) {
                // let's see if it errored due to unknown directive, which is something we can fake past and assume the directive will be added later
                let match;
                let hasMatch = false;
                const re = /Unknown directive\s*"(.*)"/g;
                let directiveTypeDefs = newTypeDefs;
                while ((match = re.exec(e.message)) != null) {
                    hasMatch = true;
                    if (match[1] && !directiveTypeDefs.includes(`directive @${match[1]}`)) {
                        directiveTypeDefs += `
						directive @${match[1]} on SCHEMA | SCALAR | OBJECT | FIELD_DEFINITION | ARGUMENT_DEFINITION | INTERFACE | UNION | ENUM | ENUM_VALUE | INPUT_OBJECT | INPUT_FIELD_DEFINITION
					`;
                    }
                }
                if (hasMatch) {
                    try {
                        graphqlTools.buildSchemaFromTypeDefinitions(directiveTypeDefs);
                        newTypeDefs = directiveTypeDefs;
                    }
                    catch (e) {
                        // we added the directive but still error, let's add the arguments
                        hasMatch = false;
                        const re = /Unknown argument\s*"(.*)"\s*on directive\s*"@(.*)"/g;
                        const directives = {};
                        while ((match = re.exec(e.message)) != null) {
                            hasMatch = true;
                            directives[match[2]] = directives[match[2]] ? directives[match[2]] : [];
                            const field = match[1] + ': JSON';
                            if (!directives[match[2]].includes(field)) {
                                directives[match[2]].push(field);
                            }
                        }
                        if (hasMatch) {
                            directiveTypeDefs = newTypeDefs;
                            lodash.each(directives, (fields, directive) => {
                                directiveTypeDefs += `
								directive @${directive} (
									${fields.join('\n')}
								) on SCHEMA | SCALAR | OBJECT | FIELD_DEFINITION | ARGUMENT_DEFINITION | INTERFACE | UNION | ENUM | ENUM_VALUE | INPUT_OBJECT | INPUT_FIELD_DEFINITION
						`;
                            });
                            newTypeDefs = directiveTypeDefs;
                        }
                    }
                }
            }
            this.schema = graphqlTools.makeExecutableSchema({
                typeDefs: newTypeDefs,
                resolvers: this.resolveFunctions,
                schemaDirectives: {
                    relation: RelationDirective,
                    default: DefaultDirective,
                    unique: UniqueDirective,
                    createdTimestamp: CreatedTimestampDirective,
                    updatedTimestamp: UpdatedTimestampDirective,
                    storeName: StoreNameDirective
                },
                resolverValidationOptions: {
                    requireResolversForResolveType: 'ignore'
                }
            });
            const typeMap = this.schema.getTypeMap();
            if (this.typeDefs.includes('@model')) {
                graphqlTools.SchemaDirectiveVisitor.visitSchemaDirectives(this.schema, {
                    model: ModelDirective
                });
            }
            else {
                Object.keys(typeMap).forEach(name => {
                    const type = typeMap[name];
                    if (this.isUserType(type) && graphql.isObjectType(type)) {
                        type['_interfaces'].push(typeMap.Node);
                        if (!type.getFields()['id']) {
                            throw new Error('every object type must have an ID if you are not using the model directive');
                        }
                        lodash.has(this.schema, '_implementations.Node') ? this.schema['_implementations'].Node.push(type) : lodash.set(this.schema, '_implementations.Node', [type]);
                    }
                });
            }
            // add args to type fields
            const queryTypeFields = this.schema.getType('Query').getFields();
            let visitUnique = false;
            const uniqueDirective = { arguments: [], kind: 'Directive', name: { kind: 'Name', value: 'unique' } };
            Object.keys(typeMap).forEach(name => {
                const type = typeMap[name];
                if (this.isUserType(type)) {
                    const fieldMap = type.getFields();
                    Object.keys(fieldMap).forEach(fieldName => {
                        const graphQLfield = fieldMap[fieldName];
                        const returnType = graphql.getNamedType(graphQLfield.type);
                        if (!graphql.isScalarType(returnType) && !graphql.isEnumType(returnType)) { // scalars don't have filters
                            if (graphql.isInterfaceType(returnType) || graphql.isUnionType(returnType)) { // can't grab args from existing query type
                                const where = this.schema.getType(returnType.name + 'WhereInput');
                                if (typeIsList(graphQLfield.type)) {
                                    const orderBy = this.schema.getType(returnType.name + 'OrderByInput');
                                    const queryField = queryTypeFields[Object.keys(queryTypeFields)[0]];
                                    const fullArgs = queryField ? queryField.args : [];
                                    if (!lodash.isEmpty(fullArgs)) {
                                        const interfaceQueryArgs = fullArgs.filter(({ name }) => {
                                            return Object.keys(queryArgs).includes(name);
                                        });
                                        if (interfaceQueryArgs && !lodash.isEmpty(interfaceQueryArgs)) {
                                            graphQLfield.args.push(...interfaceQueryArgs);
                                        }
                                    }
                                    if (orderBy && graphql.isInputType(orderBy)) {
                                        graphQLfield.args.push({ name: 'orderBy', type: orderBy });
                                    }
                                }
                                if (where && graphql.isInputObjectType(where)) {
                                    graphQLfield.args.push({ name: 'where', type: where });
                                    const matchField = where.getFields()['match'];
                                    if (matchField && graphql.isInputObjectType(matchField.type)) {
                                        const rootMatchFields = getRootMatchFields(matchField.type);
                                        if (!lodash.isEmpty(rootMatchFields)) {
                                            graphQLfield.args.push(...lodash.values(rootMatchFields));
                                        }
                                    }
                                }
                            }
                            else { // if an object type grab from existing query type
                                let queryFieldName = `${lodash.camelCase(pluralize(returnType.name))}`;
                                if (returnType.name.endsWith('Connection')) {
                                    queryFieldName = `${lodash.camelCase(pluralize(returnType.name.replace('Connection', '')))}Connection`;
                                }
                                const queryField = queryTypeFields[queryFieldName];
                                const fullArgs = queryField ? queryField.args : [];
                                if (!lodash.isEmpty(fullArgs)) {
                                    const filterArg = lodash.find(fullArgs, ['name', 'where']);
                                    graphQLfield.args = graphQLfield.args ? graphQLfield.args : [];
                                    if (typeIsList(graphQLfield.type)) {
                                        graphQLfield.args = graphQLfield.args.concat(fullArgs);
                                    }
                                    else {
                                        graphQLfield.args.push(filterArg);
                                    }
                                }
                            }
                        }
                        else if (fieldName === 'id') { // make sure id field has unique directive
                            const directives = graphQLfield.astNode.directives;
                            const hasUnique = directives.findIndex((directive) => {
                                return directive.name.value === 'unique';
                            }) > -1;
                            if (!hasUnique) {
                                visitUnique = true;
                                directives.push(uniqueDirective);
                            }
                        }
                    });
                }
            });
            if (this.typeDefs.includes('@connection')) {
                if (!this.config.generateConnections) {
                    throw new Error('Generate Connections must be true to use connection directive');
                }
                // don't want to attempt this if we didn't create the necessary types yet
                if (this.typeDefs.includes('Connection') && this.typeDefs.includes('Edge') && this.typeDefs.includes('PageInfo')) {
                    graphqlTools.SchemaDirectiveVisitor.visitSchemaDirectives(this.schema, {
                        connection: ConnectionDirective
                    });
                }
            }
            if (visitUnique) {
                graphqlTools.SchemaDirectiveVisitor.visitSchemaDirectives(this.schema, {
                    unique: UniqueDirective
                });
            }
            return this.schema;
        };
        this.getSchema = () => {
            if (!this.schema) {
                this.schema = this.addTypeDefsToSchema();
            }
            return this.schema;
        };
        this.setResolvers = (typeName, fieldResolvers) => {
            const resolverMap = {};
            resolverMap[typeName] = {};
            this.resolveFunctions[typeName] = this.resolveFunctions[typeName] ? this.resolveFunctions[typeName] : {};
            fieldResolvers.forEach((resolveFn, name) => {
                resolverMap[typeName][name] = resolveFn;
                this.resolveFunctions[typeName][name] = resolveFn; // save in case type defs changed
            });
            this.schema = graphqlTools.addResolversToSchema({
                schema: this.schema,
                resolvers: resolverMap,
                resolverValidationOptions: {
                    requireResolversForResolveType: 'ignore'
                }
            });
            return this.schema;
        };
        this.setIResolvers = (iResolvers) => {
            this.resolveFunctions = Object.assign(this.resolveFunctions, iResolvers);
            this.schema = graphqlTools.addResolversToSchema({
                schema: this.schema,
                resolvers: iResolvers,
                resolverValidationOptions: {
                    requireResolversForResolveType: 'ignore'
                }
            });
            return this.schema;
        };
        this.typeDefs = `
		scalar JSON
		scalar Date
		scalar Time
		scalar DateTime

		directive @relation(
			name: String!
		) on FIELD_DEFINITION

		directive @default(
			value: String!
		) on FIELD_DEFINITION

		directive @storeName(
			value: String!
		) on OBJECT | INTERFACE | UNION

		directive @unique on FIELD_DEFINITION

		directive @updatedTimestamp(allowManual: Boolean = false) on FIELD_DEFINITION

		directive @createdTimestamp(allowManual: Boolean = false) on FIELD_DEFINITION

		"""
		An object with an ID
		"""
		interface Node {
			"""
			The id of the object.
			"""
			id: ID! @unique
		}
		` + (typeof typeDefs === 'string' ? typeDefs : graphql.print(typeDefs));
        this.resolveFunctions = {
            JSON: GraphQLJSON,
            Date: dist_1,
            Time: dist_2,
            DateTime: dist_3,
        };
        this.config = $config;
    }
    isUserType(type) {
        let isUserType = false;
        if (graphql.isObjectType(type) && this.isUserTypeByName(type.name)) {
            isUserType = true;
        }
        return isUserType;
    }
    isUserTypeByName(typeName) {
        let isUserType = false;
        if (typeName !== 'PageInfo' && !typeName.includes('__') && !typeName.endsWith('Aggregate') && !typeName.endsWith('Connection') && !typeName.endsWith('Edge') && !typeName.endsWith('Payload') && !typeName.endsWith('PreviousValues') && !(typeName.toLowerCase() === 'query') && !(typeName.toLowerCase() === 'mutation') && !(typeName.toLowerCase() === 'subscription')) {
            isUserType = true;
        }
        return isUserType;
    }
}
// class DisplayDirective extends SchemaDirectiveVisitor {
// 	public visitFieldDefinition(field) {
// 		this.setDisplay(field);
// 	}
// 	public visitEnumValue(value) {
// 		this.setDisplay(value);
// 	}
// 	public visitObject(object) {
// 		this.setDisplay(object);
// 	}
// 	private setDisplay(field: any) {
// 		field.display = {};
// 		if (this.args.name) {
// 			field.display.name = this.args.name;
// 		}
// 	}
// }
class RelationDirective extends graphqlTools.SchemaDirectiveVisitor {
    visitFieldDefinition(field) {
        this.setRelation(field);
    }
    setRelation(field) {
        field.relation = {};
        if (this.args.name) {
            field.relation.name = this.args.name;
        }
        let type = field.type;
        while (graphql.isListType(type) || graphql.isNonNullType(type)) {
            type = type.ofType;
        }
        field.relation.outputType = type.name;
    }
}
class DefaultDirective extends graphqlTools.SchemaDirectiveVisitor {
    visitFieldDefinition(field) {
        const type = graphql.getNamedType(field.type);
        if (!graphql.isInputType(type)) {
            throw new Error('Can not set default on non input (scalar, enum, input) type which was attempted on ' + field.name);
        }
        if (this.args.value) {
            const currType = type.name;
            let value = this.args.value;
            if (currType === 'Int') {
                value = Number.parseInt(value, 10);
            }
            else if (currType === 'Float') {
                value = Number.parseFloat(value);
            }
            else if (currType === 'Boolean') {
                value = value.toLowerCase();
                if (value !== 'true' && value !== 'false') {
                    throw new Error('Default on field ' + field.name + ' which is of type Boolean must be "true" or "false"');
                }
                value = value === 'true';
            }
            field.defaultValue = value;
        }
    }
}
class ModelDirective extends graphqlTools.SchemaDirectiveVisitor {
    visitObject(object) {
        if (!object.getFields()['id']) {
            throw new Error('every model type must have an ID');
        }
        object._interfaces.push(this.schema.getTypeMap().Node);
        lodash.has(this.schema, '_implementations.Node') ? this.schema['_implementations'].Node.push(object) : lodash.set(this.schema, '_implementations.Node', [object]);
    }
}
class StoreNameDirective extends graphqlTools.SchemaDirectiveVisitor {
    visitObject(object) {
        this.setStoreName(object);
    }
    visitUnion(union) {
        this.setStoreName(union);
    }
    visitInterface(iface) {
        this.setStoreName(iface);
    }
    setStoreName(type) {
        type.storeName = this.args.value;
    }
}
class UniqueDirective extends graphqlTools.SchemaDirectiveVisitor {
    visitFieldDefinition(field) {
        field.unique = true;
    }
}
class UpdatedTimestampDirective extends graphqlTools.SchemaDirectiveVisitor {
    visitFieldDefinition(field) {
        const type = field.type;
        if (type.name === 'DateTime') {
            field['updatedTimestamp'] = true;
            if (this.args && this.args.allowManual) {
                field['updatedTimestampAllowManual'] = true;
            }
        }
    }
}
class CreatedTimestampDirective extends graphqlTools.SchemaDirectiveVisitor {
    visitFieldDefinition(field) {
        const type = field.type;
        if (type.name === 'DateTime') {
            field.createdTimestamp = true;
            if (this.args && this.args.allowManual) {
                field['createdTimestampAllowManual'] = true;
            }
        }
    }
}
class ConnectionDirective extends graphqlTools.SchemaDirectiveVisitor {
    visitFieldDefinition(field) {
        const fieldType = field.type;
        if (typeIsList(fieldType)) {
            const connectionName = getReturnType(fieldType) + 'Connection';
            let connectionType = this.schema.getType(connectionName);
            if (!connectionType) {
                throw new Error('Connections must be enabled and output type must be part of model');
            }
            if (graphql.isNonNullType(fieldType)) {
                connectionType = new graphql.GraphQLNonNull(connectionType);
            }
            field.type = connectionType;
        }
        else {
            throw new Error('Can\'t make connection on non list field');
        }
    }
}

class Connection {
    constructor() {
        this.aggregate = {
            count: -1
        };
        this.pageInfo = {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: '',
            endCursor: ''
        };
    }
}

/**
 * Implementation of atob() according to the HTML and Infra specs, except that
 * instead of throwing INVALID_CHARACTER_ERR we return null.
 */
function atob(data) {
  // Web IDL requires DOMStrings to just be converted using ECMAScript
  // ToString, which in our case amounts to using a template literal.
  data = `${data}`;
  // "Remove all ASCII whitespace from data."
  data = data.replace(/[ \t\n\f\r]/g, "");
  // "If data's length divides by 4 leaving no remainder, then: if data ends
  // with one or two U+003D (=) code points, then remove them from data."
  if (data.length % 4 === 0) {
    data = data.replace(/==?$/, "");
  }
  // "If data's length divides by 4 leaving a remainder of 1, then return
  // failure."
  //
  // "If data contains a code point that is not one of
  //
  // U+002B (+)
  // U+002F (/)
  // ASCII alphanumeric
  //
  // then return failure."
  if (data.length % 4 === 1 || /[^+/0-9A-Za-z]/.test(data)) {
    return null;
  }
  // "Let output be an empty byte sequence."
  let output = "";
  // "Let buffer be an empty buffer that can have bits appended to it."
  //
  // We append bits via left-shift and or.  accumulatedBits is used to track
  // when we've gotten to 24 bits.
  let buffer = 0;
  let accumulatedBits = 0;
  // "Let position be a position variable for data, initially pointing at the
  // start of data."
  //
  // "While position does not point past the end of data:"
  for (let i = 0; i < data.length; i++) {
    // "Find the code point pointed to by position in the second column of
    // Table 1: The Base 64 Alphabet of RFC 4648. Let n be the number given in
    // the first cell of the same row.
    //
    // "Append to buffer the six bits corresponding to n, most significant bit
    // first."
    //
    // atobLookup() implements the table from RFC 4648.
    buffer <<= 6;
    buffer |= atobLookup(data[i]);
    accumulatedBits += 6;
    // "If buffer has accumulated 24 bits, interpret them as three 8-bit
    // big-endian numbers. Append three bytes with values equal to those
    // numbers to output, in the same order, and then empty buffer."
    if (accumulatedBits === 24) {
      output += String.fromCharCode((buffer & 0xff0000) >> 16);
      output += String.fromCharCode((buffer & 0xff00) >> 8);
      output += String.fromCharCode(buffer & 0xff);
      buffer = accumulatedBits = 0;
    }
    // "Advance position by 1."
  }
  // "If buffer is not empty, it contains either 12 or 18 bits. If it contains
  // 12 bits, then discard the last four and interpret the remaining eight as
  // an 8-bit big-endian number. If it contains 18 bits, then discard the last
  // two and interpret the remaining 16 as two 8-bit big-endian numbers. Append
  // the one or two bytes with values equal to those one or two numbers to
  // output, in the same order."
  if (accumulatedBits === 12) {
    buffer >>= 4;
    output += String.fromCharCode(buffer);
  } else if (accumulatedBits === 18) {
    buffer >>= 2;
    output += String.fromCharCode((buffer & 0xff00) >> 8);
    output += String.fromCharCode(buffer & 0xff);
  }
  // "Return output."
  return output;
}
/**
 * A lookup table for atob(), which converts an ASCII character to the
 * corresponding six-bit number.
 */

const keystr =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

function atobLookup(chr) {
  const index = keystr.indexOf(chr);
  // Throw exception if character is not in the lookup string; should not be hit in tests
  return index < 0 ? undefined : index;
}

var atob_1 = atob;

/**
 * btoa() as defined by the HTML and Infra specs, which mostly just references
 * RFC 4648.
 */
function btoa(s) {
  let i;
  // String conversion as required by Web IDL.
  s = `${s}`;
  // "The btoa() method must throw an "InvalidCharacterError" DOMException if
  // data contains any character whose code point is greater than U+00FF."
  for (i = 0; i < s.length; i++) {
    if (s.charCodeAt(i) > 255) {
      return null;
    }
  }
  let out = "";
  for (i = 0; i < s.length; i += 3) {
    const groupsOfSix = [undefined, undefined, undefined, undefined];
    groupsOfSix[0] = s.charCodeAt(i) >> 2;
    groupsOfSix[1] = (s.charCodeAt(i) & 0x03) << 4;
    if (s.length > i + 1) {
      groupsOfSix[1] |= s.charCodeAt(i + 1) >> 4;
      groupsOfSix[2] = (s.charCodeAt(i + 1) & 0x0f) << 2;
    }
    if (s.length > i + 2) {
      groupsOfSix[2] |= s.charCodeAt(i + 2) >> 6;
      groupsOfSix[3] = s.charCodeAt(i + 2) & 0x3f;
    }
    for (let j = 0; j < groupsOfSix.length; j++) {
      if (typeof groupsOfSix[j] === "undefined") {
        out += "=";
      } else {
        out += btoaLookup(groupsOfSix[j]);
      }
    }
  }
  return out;
}

/**
 * Lookup table for btoa(), which converts a six-bit number into the
 * corresponding ASCII character.
 */
const keystr$1 =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

function btoaLookup(index) {
  if (index >= 0 && index < 64) {
    return keystr$1[index];
  }

  // Throw INVALID_CHARACTER_ERR exception here -- won't be hit in the tests.
  return undefined;
}

var btoa_1 = btoa;

var abab = {
  atob: atob_1,
  btoa: btoa_1
};
var abab_1 = abab.atob;
var abab_2 = abab.btoa;

class InputGenerator {
    constructor($type, $config, $currInputObjectTypes, $schemaInfo, $schema, $relations, $dummy = false) {
        this.generateFieldForInput = (fieldName, inputType, defaultValue) => {
            const field = {};
            field[fieldName] = {
                type: inputType,
                defaultValue: defaultValue
            };
            return field;
        };
        this.type = $type;
        this.config = $config;
        this.currInputObjectTypes = $currInputObjectTypes;
        this.schemaInfo = $schemaInfo;
        this.schema = $schema;
        this.relations = $relations;
        this.nestedGenerators = new Map();
        this.dummy = $dummy;
    }
    handleNestedGenerators() {
        this.nestedGenerators.forEach((generator) => {
            if (generator.function) {
                generator.function.apply(generator.this, generator.args);
            }
            generator.function = null;
        });
    }
    generateInputTypeForField(field, manyWithout, oneWithout, many, one, nameOfTypeFieldIsOn) {
        let inputType;
        const fieldType = graphql.getNamedType(field.type);
        const relationFieldName = this.relations.getInverseWithoutName(fieldType.name, field.name, nameOfTypeFieldIsOn);
        const isList = typeIsList(field.type);
        // tslint:disable-next-line:prefer-conditional-expression
        if (relationFieldName) {
            inputType = isList ? manyWithout.call(this, fieldType, relationFieldName) : oneWithout.call(this, fieldType, relationFieldName);
        }
        else {
            inputType = isList ? many.call(this, fieldType) : one.call(this, fieldType);
        }
        return inputType;
    }
    isAutomaticField(field) {
        let isAutoField = false;
        if (field) {
            if (field.name === 'id') {
                isAutoField = true;
            }
            else if (lodash.get(field, 'metadata.updatedTimestamp') === true && !lodash.get(field, 'metadata.updatedTimestampAllowManual', false)) {
                isAutoField = true;
            }
            else if (lodash.get(field, 'metadata.createdTimestamp') === true && !lodash.get(field, 'metadata.createdTimestampAllowManual', false)) {
                isAutoField = true;
            }
        }
        return isAutoField;
    }
    generateInputTypeForFieldInfo(field, mutation, nameOfTypeFieldIsOn) {
        let inputType;
        const fieldTypeName = getReturnType(field.type);
        const schemaType = this.schema.getType(fieldTypeName);
        if (graphql.isInputType(schemaType)) {
            if (mutation === Mutation.Update && !this.isAutomaticField(field)) {
                const nullableType = graphql.getNullableType(schemaType);
                const namedType = graphql.getNamedType(schemaType);
                // tslint:disable-next-line:prefer-conditional-expression
                if (typeIsList(field.type) && (graphql.isScalarType(namedType) || graphql.isEnumType(namedType))) {
                    inputType = this.getScalarListInput(namedType);
                }
                else {
                    inputType = nullableType;
                }
            }
            else {
                inputType = schemaType;
            }
        }
        else {
            const isArray = typeIsList(field.type);
            let fieldInputName = schemaType.name;
            let fieldSuffix = Mutation[mutation];
            fieldSuffix += isArray ? 'Many' : 'One';
            const relationFieldName = this.relations.getInverseWithoutName(fieldTypeName, field.name, nameOfTypeFieldIsOn);
            fieldSuffix += relationFieldName ? 'Without' : '';
            fieldInputName += fieldSuffix + capFirst(relationFieldName) + 'Input';
            if (graphql.isInterfaceType(schemaType) || graphql.isUnionType(schemaType)) {
                if (this.currInputObjectTypes.has(fieldInputName)) {
                    inputType = this.currInputObjectTypes.get(fieldInputName);
                }
                else {
                    const fields = {};
                    const possibleTypes = this.schemaInfo[fieldTypeName]['possibleTypes'];
                    possibleTypes.forEach(typeInfo => {
                        const typeName = isArray ? pluralize(typeInfo.name) : typeInfo.name;
                        const fieldName = lodash.camelCase(typeName);
                        const fieldInputTypeName = typeInfo.name + fieldSuffix + capFirst(relationFieldName) + 'Input';
                        lodash.merge(fields, this.generateFieldForInput(fieldName, new graphql.GraphQLInputObjectType({ name: fieldInputTypeName, fields: {} })));
                        const functionName = `generate${fieldSuffix}Input`;
                        if (!this.dummy && !this.nestedGenerators.has(fieldInputTypeName)) {
                            const possibleSchemaType = graphql.getNamedType(this.schema.getType(typeInfo.name));
                            const possibleTypeGenerator = new InputGenerator(possibleSchemaType, this.config, this.currInputObjectTypes, this.schemaInfo, this.schema, this.relations, true);
                            this.nestedGenerators.set(fieldInputTypeName, {
                                'function': possibleTypeGenerator[functionName],
                                'args': [possibleSchemaType, relationFieldName],
                                'this': possibleTypeGenerator
                            });
                        }
                    });
                    const newInputObject = new graphql.GraphQLInputObjectType({
                        name: fieldInputName,
                        fields
                    });
                    if (!this.dummy) {
                        this.currInputObjectTypes.set(fieldInputName, newInputObject);
                    }
                    inputType = newInputObject;
                }
            }
            else {
                if (!this.dummy) {
                    const typeGenerator = new InputGenerator(schemaType, this.config, this.currInputObjectTypes, this.schemaInfo, this.schema, this.relations, true);
                    const functionName = `generate${fieldSuffix}Input`;
                    inputType = typeGenerator[functionName].apply(typeGenerator, [schemaType, relationFieldName]);
                }
                else {
                    inputType = new graphql.GraphQLInputObjectType({ name: fieldInputName, fields: {} });
                }
            }
        }
        if (!this.dummy) {
            this.handleNestedGenerators();
        }
        return inputType;
    }
    generateWhereUniqueInput(fieldType = this.type) {
        const name = fieldType.name + 'WhereUniqueInput';
        if (!this.currInputObjectTypes.has(name)) {
            const fields = {};
            const infoType = this.schemaInfo[fieldType.name];
            infoType.fields.forEach(field => {
                if (lodash.get(field, 'metadata.unique') === true) {
                    const isArray = typeIsList(field.type);
                    const schemaType = this.schema.getType(getReturnType(field.type));
                    let inputType;
                    if (graphql.isInputType(schemaType)) {
                        inputType = schemaType;
                    }
                    else {
                        const fieldInputName = schemaType.name + 'WhereUniqueInput';
                        inputType = new graphql.GraphQLInputObjectType({ name: fieldInputName, fields: {} });
                    }
                    if (isArray) {
                        inputType = new graphql.GraphQLList(inputType);
                    }
                    lodash.merge(fields, this.generateFieldForInput(field.name, inputType, lodash.get(field, 'metadata.defaultValue')));
                }
            });
            this.currInputObjectTypes.set(name, new graphql.GraphQLInputObjectType({
                name,
                fields
            }));
        }
        return this.currInputObjectTypes.get(name);
    }
    getWhereInput(typeName, fields, existsFields, matchFields, rangeFields, addLogicalOperators) {
        const name = typeName + 'WhereInput';
        const existsName = typeName + 'ExistsInput';
        const matchName = typeName + 'MatchInput';
        const rangeName = typeName + 'RangeInput';
        const existsInput = new graphql.GraphQLInputObjectType({
            name: existsName,
            description: 'Specifies if a field should exist or not (true or false)',
            fields: existsFields
        });
        const matchInput = new graphql.GraphQLInputObjectType({
            name: matchName,
            description: 'Match the supplied values for each field',
            fields: matchFields
        });
        const rangeInput = new graphql.GraphQLInputObjectType({
            name: rangeName,
            description: 'Filter between lower and upper bounds, takes precedence over match',
            fields: rangeFields
        });
        this.currInputObjectTypes.set(existsName, existsInput);
        this.currInputObjectTypes.set(matchName, matchInput);
        this.currInputObjectTypes.set(rangeName, rangeInput);
        lodash.merge(fields, {
            exists: { type: existsInput },
            match: { type: matchInput },
            range: { type: rangeInput }
        });
        if (addLogicalOperators) {
            const dummyListOfFilterInput = new graphql.GraphQLInputObjectType({ name, fields: {} });
            lodash.merge(fields, {
                and: { type: new graphql.GraphQLList(new graphql.GraphQLNonNull(dummyListOfFilterInput)) },
                or: { type: new graphql.GraphQLList(new graphql.GraphQLNonNull(dummyListOfFilterInput)) },
                not: { type: dummyListOfFilterInput }
            });
        }
        this.currInputObjectTypes.set(name, new graphql.GraphQLInputObjectType({
            name,
            fields
        }));
        return this.currInputObjectTypes.get(name);
    }
    generateWhereInput(addLogicalOperators, fieldType = this.type) {
        const name = fieldType.name + 'WhereInput';
        if (!this.currInputObjectTypes.has(name)) {
            const existsFields = {};
            const matchFields = {};
            const rangeFields = {};
            const fields = {};
            const infoType = this.schemaInfo[fieldType.name];
            infoType.fields.forEach(field => {
                const schemaType = this.schema.getType(getReturnType(field.type));
                lodash.merge(existsFields, this.generateFieldForInput(field.name, graphql.GraphQLBoolean));
                let inputType;
                if (graphql.isInputType(schemaType)) {
                    inputType = graphql.getNamedType(schemaType);
                    lodash.merge(matchFields, this.generateFieldForInput(field.name, new graphql.GraphQLList(new graphql.GraphQLNonNull(inputType))));
                    lodash.merge(rangeFields, this.generateFieldForInput(field.name, new graphql.GraphQLList(inputType)));
                }
                else {
                    const fieldInputName = schemaType.name + 'WhereInput';
                    let fieldName = field.name;
                    if (!this.currInputObjectTypes.has(fieldInputName) && !this.dummy && (graphql.isInterfaceType(schemaType) || graphql.isUnionType(schemaType))) {
                        const interfaceExistsFields = {};
                        const interfaceMatchFields = {};
                        const interfaceRangeFields = {};
                        const interfaceFields = {};
                        const possibleTypes = this.schemaInfo[schemaType.name].possibleTypes;
                        possibleTypes.forEach(typeInfo => {
                            const possibleSchemaType = graphql.getNamedType(this.schema.getType(typeInfo.name));
                            const possibleTypeGenerator = new InputGenerator(possibleSchemaType, this.config, this.currInputObjectTypes, this.schemaInfo, this.schema, this.relations, true);
                            const possibleTypeFilter = possibleTypeGenerator.generateWhereInput(addLogicalOperators);
                            const possibleTypeFieldMap = possibleTypeFilter.getFields();
                            lodash.merge(interfaceFields, possibleTypeFieldMap);
                            lodash.merge(interfaceExistsFields, possibleTypeFieldMap['exists'].type.getFields());
                            lodash.merge(interfaceMatchFields, possibleTypeFieldMap['match'].type.getFields());
                            lodash.merge(interfaceRangeFields, possibleTypeFieldMap['range'].type.getFields());
                        });
                        inputType = this.getWhereInput(schemaType.name, interfaceFields, interfaceExistsFields, interfaceMatchFields, interfaceRangeFields, addLogicalOperators);
                    }
                    else {
                        inputType = new graphql.GraphQLInputObjectType({ name: fieldInputName, fields: {} });
                        if (fortuneFilters.includes(fieldName)) {
                            fieldName = 'f_' + fieldName;
                        }
                    }
                    lodash.merge(fields, this.generateFieldForInput(fieldName, inputType));
                }
            });
            this.getWhereInput(fieldType.name, fields, existsFields, matchFields, rangeFields, addLogicalOperators);
        }
        return this.currInputObjectTypes.get(name);
    }
    generateOrderByInput(fieldType = this.type) {
        const name = fieldType.name + 'OrderByInput';
        if (!this.currInputObjectTypes.has(name)) {
            const orderByEnum = this.schema.getType('ORDER_BY_OPTIONS');
            const fields = {};
            const infoType = this.schemaInfo[fieldType.name];
            infoType.fields.forEach(field => {
                const schemaType = this.schema.getType(getReturnType(field.type));
                let inputType;
                if (graphql.isInputType(schemaType)) {
                    inputType = graphql.getNamedType(schemaType);
                    lodash.merge(fields, this.generateFieldForInput(field.name, orderByEnum));
                }
                else {
                    const fieldInputName = schemaType.name + 'OrderByInput';
                    if (!this.currInputObjectTypes.has(fieldInputName) && !this.dummy && (graphql.isInterfaceType(schemaType) || graphql.isUnionType(schemaType))) {
                        const interfaceFields = {};
                        const possibleTypes = this.schemaInfo[schemaType.name].possibleTypes;
                        possibleTypes.forEach(typeInfo => {
                            const possibleSchemaType = graphql.getNamedType(this.schema.getType(typeInfo.name));
                            const possibleTypeGenerator = new InputGenerator(possibleSchemaType, this.config, this.currInputObjectTypes, this.schemaInfo, this.schema, this.relations, true);
                            const possibleTypeFilter = possibleTypeGenerator.generateOrderByInput();
                            const possibleTypeFieldMap = possibleTypeFilter.getFields();
                            lodash.merge(interfaceFields, possibleTypeFieldMap);
                        });
                        inputType = new graphql.GraphQLInputObjectType({
                            name: fieldInputName,
                            fields: interfaceFields
                        });
                        this.currInputObjectTypes.set(fieldInputName, inputType);
                    }
                    else {
                        inputType = new graphql.GraphQLInputObjectType({ name: fieldInputName, fields: {} });
                    }
                    lodash.merge(fields, this.generateFieldForInput(field.name, inputType));
                }
            });
            this.currInputObjectTypes.set(name, new graphql.GraphQLInputObjectType({
                name,
                fields
            }));
        }
        return this.currInputObjectTypes.get(name);
    }
    generateCreateWithoutInput(fieldType = this.type, relationFieldName) {
        let name = fieldType.name + 'Create';
        name += relationFieldName ? 'Without' + capFirst(relationFieldName) : '';
        name += 'Input';
        if (!relationFieldName) {
            return new graphql.GraphQLInputObjectType({ name, fields: {} });
        }
        if (!this.currInputObjectTypes.has(name)) {
            const fields = {};
            const infoType = this.schemaInfo[fieldType.name];
            infoType.fields.forEach(field => {
                if (!this.isAutomaticField(field) && field.name !== relationFieldName) {
                    let inputType = this.generateInputTypeForFieldInfo(field, Mutation.Create, fieldType.name);
                    if (field.type.kind === 'NON_NULL' && field.type.ofType.kind !== 'LIST') {
                        inputType = new graphql.GraphQLNonNull(inputType);
                    }
                    lodash.merge(fields, this.generateFieldForInput(field.name, inputType, lodash.get(field, 'metadata.defaultValue')));
                }
            });
            this.currInputObjectTypes.set(name, new graphql.GraphQLInputObjectType({
                name,
                fields
            }));
        }
        return this.currInputObjectTypes.get(name);
    }
    generateCreateManyWithoutInput(fieldType = this.type, relationFieldName) {
        const name = fieldType.name + 'CreateManyWithout' + capFirst(relationFieldName) + 'Input';
        if (!this.currInputObjectTypes.has(name)) {
            const fields = {};
            fields['create'] = { type: new graphql.GraphQLList(new graphql.GraphQLNonNull(this.generateCreateWithoutInput(fieldType, relationFieldName))) };
            fields['connect'] = { type: new graphql.GraphQLList(new graphql.GraphQLNonNull(this.generateWhereUniqueInput(fieldType))) };
            this.currInputObjectTypes.set(name, new graphql.GraphQLInputObjectType({
                name,
                fields
            }));
        }
        return this.currInputObjectTypes.get(name);
    }
    generateCreateOneWithoutInput(fieldType, relationFieldName) {
        const name = fieldType.name + 'CreateOneWithout' + capFirst(relationFieldName) + 'Input';
        if (!this.currInputObjectTypes.has(name)) {
            const fields = {};
            fields['create'] = { type: this.generateCreateWithoutInput(fieldType, relationFieldName) };
            fields['connect'] = { type: this.generateWhereUniqueInput(fieldType) };
            this.currInputObjectTypes.set(name, new graphql.GraphQLInputObjectType({
                name,
                fields
            }));
        }
        return this.currInputObjectTypes.get(name);
    }
    generateCreateManyInput(fieldType) {
        const name = fieldType.name + 'CreateManyInput';
        if (!this.currInputObjectTypes.has(name)) {
            const fields = {};
            fields['create'] = { type: new graphql.GraphQLList(new graphql.GraphQLNonNull(this.generateCreateWithoutInput(fieldType))) };
            fields['connect'] = { type: new graphql.GraphQLList(new graphql.GraphQLNonNull(this.generateWhereUniqueInput(fieldType))) };
            this.currInputObjectTypes.set(name, new graphql.GraphQLInputObjectType({
                name,
                fields
            }));
        }
        return this.currInputObjectTypes.get(name);
    }
    generateCreateOneInput(fieldType) {
        const name = fieldType.name + 'CreateOneInput';
        if (!this.currInputObjectTypes.has(name)) {
            const fields = {};
            fields['create'] = { type: this.generateCreateWithoutInput(fieldType) };
            fields['connect'] = { type: this.generateWhereUniqueInput(fieldType) };
            this.currInputObjectTypes.set(name, new graphql.GraphQLInputObjectType({
                name,
                fields
            }));
        }
        return this.currInputObjectTypes.get(name);
    }
    generateCreateInput() {
        const name = this.type.name + 'CreateInput';
        const infoType = this.schemaInfo[this.type.name];
        const fields = {};
        if (graphql.isObjectType(this.type) && !this.currInputObjectTypes.has(name)) {
            const infoTypeFields = infoType.fields;
            lodash.each(this.type.getFields(), field => {
                if (field.name !== 'id') {
                    let inputType;
                    const fieldNullableType = graphql.getNullableType(field.type);
                    if (graphql.isInputType(field.type)) {
                        const infoTypeField = infoTypeFields.find(infoTypeField => infoTypeField.name === field.name);
                        if (!this.isAutomaticField(infoTypeField)) {
                            inputType = graphql.isListType(fieldNullableType) ? fieldNullableType : field.type;
                        }
                    }
                    else if (graphql.isObjectType(field.type)) {
                        inputType = this.generateInputTypeForField(field, this.generateCreateManyWithoutInput, this.generateCreateOneWithoutInput, this.generateCreateManyInput, this.generateCreateOneInput, this.type.name);
                    }
                    else {
                        inputType = this.generateInputTypeForFieldInfo(infoTypeFields.find(currField => currField.name === field.name), Mutation.Create, this.type.name);
                    }
                    if (inputType && !graphql.isListType(fieldNullableType) && graphql.isNonNullType(field.type) && !graphql.isNonNullType(inputType)) {
                        inputType = new graphql.GraphQLNonNull(inputType);
                    }
                    if (inputType) {
                        lodash.merge(fields, this.generateFieldForInput(field.name, inputType, lodash.get(this.schemaInfo[this.type.name].fields.find((introField) => introField.name === field.name), 'metadata.defaultValue')));
                    }
                }
            });
            if (lodash.isEmpty(fields)) {
                throw new Error(`Types must have at least one field other than ID, ${this.type.name} does not`);
            }
            this.currInputObjectTypes.set(name, new graphql.GraphQLInputObjectType({
                name,
                fields
            }));
        }
        return this.currInputObjectTypes.get(name);
    }
    generateUpdateWithoutInput(fieldType, relationFieldName) {
        let name = fieldType.name + 'Update';
        name += relationFieldName ? 'Without' + capFirst(relationFieldName) : '';
        name += 'Input';
        if (!relationFieldName) {
            return new graphql.GraphQLInputObjectType({ name, fields: {} });
        }
        if (!this.currInputObjectTypes.has(name)) {
            const fields = {};
            const infoType = this.schemaInfo[fieldType.name];
            infoType.fields.forEach(field => {
                if (!this.isAutomaticField(field) && field.name !== relationFieldName) {
                    const inputType = this.generateInputTypeForFieldInfo(field, Mutation.Update, fieldType.name);
                    lodash.merge(fields, this.generateFieldForInput(field.name, inputType));
                }
            });
            this.currInputObjectTypes.set(name, new graphql.GraphQLInputObjectType({
                name,
                fields
            }));
        }
        return this.currInputObjectTypes.get(name);
    }
    generateUpdateWithWhereUniqueWithoutInput(fieldType, relationFieldName) {
        const name = fieldType.name + 'UpdateWithWhereUniqueWithout' + capFirst(relationFieldName) + 'Input';
        if (!this.currInputObjectTypes.has(name)) {
            const fields = {};
            fields['data'] = { type: new graphql.GraphQLNonNull(this.generateUpdateWithoutInput(fieldType, relationFieldName)) };
            fields['where'] = { type: new graphql.GraphQLNonNull(this.generateWhereUniqueInput(fieldType)) };
            this.currInputObjectTypes.set(name, new graphql.GraphQLInputObjectType({
                name,
                fields
            }));
        }
        return this.currInputObjectTypes.get(name);
    }
    generateUpdateManyWithoutInput(fieldType, relationFieldName) {
        const name = fieldType.name + 'UpdateManyWithout' + capFirst(relationFieldName) + 'Input';
        if (!this.currInputObjectTypes.has(name)) {
            const fields = {};
            fields['create'] = { type: new graphql.GraphQLList(new graphql.GraphQLNonNull(this.generateCreateWithoutInput(fieldType, relationFieldName))) };
            fields['connect'] = { type: new graphql.GraphQLList(new graphql.GraphQLNonNull(this.generateWhereUniqueInput(fieldType))) };
            fields['disconnect'] = { type: new graphql.GraphQLList(new graphql.GraphQLNonNull(this.generateWhereUniqueInput(fieldType))) };
            fields['delete'] = { type: new graphql.GraphQLList(new graphql.GraphQLNonNull(this.generateWhereUniqueInput(fieldType))) };
            fields['update'] = { type: new graphql.GraphQLList(new graphql.GraphQLNonNull(this.generateUpdateWithWhereUniqueWithoutInput(fieldType, relationFieldName))) };
            if (this.config.generateUpsert) {
                fields['upsert'] = { type: new graphql.GraphQLList(new graphql.GraphQLNonNull(this.generateUpsertWithWhereUniqueWithoutInput(fieldType, relationFieldName))) };
            }
            this.currInputObjectTypes.set(name, new graphql.GraphQLInputObjectType({
                name,
                fields
            }));
        }
        return this.currInputObjectTypes.get(name);
    }
    generateUpdateOneWithoutInput(fieldType, relationFieldName) {
        const name = fieldType.name + 'UpdateOneWithout' + capFirst(relationFieldName) + 'Input';
        if (!this.currInputObjectTypes.has(name)) {
            const fields = {};
            fields['create'] = { type: this.generateCreateWithoutInput(fieldType, relationFieldName) };
            fields['connect'] = { type: this.generateWhereUniqueInput(fieldType) };
            fields['disconnect'] = { type: graphql.GraphQLBoolean };
            fields['delete'] = { type: graphql.GraphQLBoolean };
            fields['update'] = { type: this.generateUpdateWithoutInput(fieldType, relationFieldName) };
            if (this.config.generateUpsert) {
                fields['upsert'] = { type: this.generateUpsertWithoutInput(fieldType, relationFieldName) };
            }
            this.currInputObjectTypes.set(name, new graphql.GraphQLInputObjectType({
                name,
                fields
            }));
        }
        return this.currInputObjectTypes.get(name);
    }
    generateUpdateManyInput(fieldType) {
        const name = fieldType.name + 'UpdateManyInput';
        if (!this.currInputObjectTypes.has(name)) {
            const fields = {};
            fields['create'] = { type: new graphql.GraphQLList(new graphql.GraphQLNonNull(this.generateCreateWithoutInput(fieldType))) };
            fields['connect'] = { type: new graphql.GraphQLList(new graphql.GraphQLNonNull(this.generateWhereUniqueInput(fieldType))) };
            fields['disconnect'] = { type: new graphql.GraphQLList(new graphql.GraphQLNonNull(this.generateWhereUniqueInput(fieldType))) };
            fields['delete'] = { type: new graphql.GraphQLList(new graphql.GraphQLNonNull(this.generateWhereUniqueInput(fieldType))) };
            fields['update'] = { type: new graphql.GraphQLList(new graphql.GraphQLNonNull(this.generateUpdateWithWhereUniqueWithoutInput(fieldType))) };
            if (this.config.generateUpsert) {
                fields['upsert'] = { type: new graphql.GraphQLList(new graphql.GraphQLNonNull(this.generateUpsertWithWhereUniqueWithoutInput(fieldType))) };
            }
            this.currInputObjectTypes.set(name, new graphql.GraphQLInputObjectType({
                name,
                fields
            }));
        }
        return this.currInputObjectTypes.get(name);
    }
    generateUpdateOneInput(fieldType) {
        const name = fieldType.name + 'UpdateOneInput';
        if (!this.currInputObjectTypes.has(name)) {
            const fields = {};
            fields['create'] = { type: this.generateCreateWithoutInput(fieldType) };
            fields['connect'] = { type: this.generateWhereUniqueInput(fieldType) };
            fields['disconnect'] = { type: graphql.GraphQLBoolean };
            fields['delete'] = { type: graphql.GraphQLBoolean };
            fields['update'] = { type: this.generateUpdateWithoutInput(fieldType) };
            if (this.config.generateUpsert) {
                fields['upsert'] = { type: this.generateUpsertWithoutInput(fieldType) };
            }
            this.currInputObjectTypes.set(name, new graphql.GraphQLInputObjectType({
                name,
                fields
            }));
        }
        return this.currInputObjectTypes.get(name);
    }
    generateUpdateInput() {
        const name = this.type.name + 'UpdateInput';
        const fields = {};
        if (graphql.isObjectType(this.type) && !this.currInputObjectTypes.has(name)) {
            const infoTypeFields = this.schemaInfo[this.type.name].fields;
            lodash.each(this.type.getFields(), field => {
                if (field.name !== 'id') {
                    let inputType;
                    if (graphql.isInputType(field.type)) {
                        const infoTypeField = infoTypeFields.find(infoTypeField => infoTypeField.name === field.name);
                        if (!this.isAutomaticField(infoTypeField)) {
                            const nullableType = graphql.getNullableType(field.type);
                            const namedType = graphql.getNamedType(field.type);
                            // tslint:disable-next-line:prefer-conditional-expression
                            if (graphql.isListType(nullableType) && (graphql.isScalarType(namedType) || graphql.isEnumType(namedType))) {
                                inputType = this.getScalarListInput(namedType);
                            }
                            else {
                                inputType = nullableType;
                            }
                        }
                    }
                    else if (graphql.isObjectType(field.type)) {
                        inputType = this.generateInputTypeForField(field, this.generateUpdateManyWithoutInput, this.generateUpdateOneWithoutInput, this.generateUpdateManyInput, this.generateUpdateOneInput, this.type.name);
                    }
                    else {
                        inputType = this.generateInputTypeForFieldInfo(infoTypeFields.find(currField => currField.name === field.name), Mutation.Update, this.type.name);
                    }
                    if (inputType) {
                        lodash.merge(fields, this.generateFieldForInput(field.name, inputType));
                    }
                }
            });
            if (lodash.isEmpty(fields)) {
                throw new Error(`Types must have at least one field other than ID, ${this.type.name} does not`);
            }
            this.currInputObjectTypes.set(name, new graphql.GraphQLInputObjectType({
                name,
                fields
            }));
        }
        return this.currInputObjectTypes.get(name);
    }
    generateUpsertWithoutInput(fieldType, relationFieldName) {
        let name = fieldType.name + 'Upsert';
        name += relationFieldName ? 'Without' + capFirst(relationFieldName) : '';
        name += 'Input';
        if (!this.currInputObjectTypes.has(name)) {
            const fields = {};
            fields['update'] = { type: new graphql.GraphQLNonNull(this.generateUpdateWithoutInput(fieldType, relationFieldName)) };
            fields['create'] = { type: new graphql.GraphQLNonNull(this.generateCreateWithoutInput(fieldType, relationFieldName)) };
            this.currInputObjectTypes.set(name, new graphql.GraphQLInputObjectType({
                name,
                fields
            }));
        }
        return this.currInputObjectTypes.get(name);
    }
    generateUpsertWithWhereUniqueWithoutInput(fieldType, relationFieldName) {
        const name = fieldType.name + 'UpsertWithWhereUniqueWithout' + capFirst(relationFieldName) + 'Input';
        if (!this.currInputObjectTypes.has(name)) {
            const fields = {};
            fields['update'] = { type: new graphql.GraphQLNonNull(this.generateUpdateWithoutInput(fieldType, relationFieldName)) };
            fields['create'] = { type: new graphql.GraphQLNonNull(this.generateCreateWithoutInput(fieldType, relationFieldName)) };
            fields['where'] = { type: new graphql.GraphQLNonNull(this.generateWhereUniqueInput(fieldType)) };
            this.currInputObjectTypes.set(name, new graphql.GraphQLInputObjectType({
                name,
                fields
            }));
        }
        return this.currInputObjectTypes.get(name);
    }
    getScalarListInput(scalarType) {
        const name = scalarType.name + 'ScalarListInput';
        if (!this.currInputObjectTypes.has(name)) {
            const fields = {};
            fields['set'] = { type: new graphql.GraphQLList(scalarType) };
            fields['push'] = { type: new graphql.GraphQLList(scalarType) };
            fields['pull'] = { type: new graphql.GraphQLList(scalarType) };
            this.currInputObjectTypes.set(name, new graphql.GraphQLInputObjectType({
                name,
                fields
            }));
        }
        return this.currInputObjectTypes.get(name);
    }
}

class GenerateUpsert {
    constructor(dataResolver, objectName, types, $config, currInputObjectTypes, currOutputObjectTypeDefs, schemaInfo, schema, $relations) {
        this.dataResolver = dataResolver;
        this.objectName = objectName;
        this.types = types;
        this.config = $config;
        this.currInputObjectTypes = currInputObjectTypes;
        this.currOutputObjectTypeDefs = currOutputObjectTypeDefs;
        this.schema = schema;
        this.schemaInfo = schemaInfo;
        this.relations = $relations;
        this.fields = {};
        this.resolvers = new Map();
        this.generate();
    }
    generate() {
        this.types.forEach(type => {
            const args = {};
            const generator = new InputGenerator(this.schema.getType(type.name), this.config, this.currInputObjectTypes, this.schemaInfo, this.schema, this.relations);
            const upsertInputName = `Upsert${type.name}MutationInput`;
            const upsertInput = new graphql.GraphQLInputObjectType({
                name: upsertInputName,
                fields: {
                    create: { type: new graphql.GraphQLNonNull(generator.generateCreateInput()) },
                    update: { type: new graphql.GraphQLNonNull(generator.generateUpdateInput()) },
                    where: { type: new graphql.GraphQLNonNull(generator.generateWhereUniqueInput()) },
                    conditions: { type: generator.generateWhereInput(this.dataResolver.getFeatures().logicalOperators), description: 'In case of update it will only be performed if these conditions are met' },
                    clientMutationId: { type: graphql.GraphQLString }
                }
            });
            this.currInputObjectTypes.set(upsertInputName, upsertInput);
            args['input'] = {
                type: new graphql.GraphQLNonNull(upsertInput)
            };
            const outputTypeName = getPayloadTypeName(type.name);
            this.fields[`upsert${type.name}`] = {
                type: outputTypeName,
                args: args
            };
            this.currOutputObjectTypeDefs.add(getPayloadTypeDef(type.name));
            this.resolvers.set(`upsert${type.name}`, upsertResolver(this.dataResolver));
        });
    }
    getResolvers() {
        return new Map([[this.objectName, this.resolvers]]);
    }
    getFieldsOnObject() {
        return new Map([[this.objectName, this.fields]]);
    }
}

class GenerateUpdate {
    constructor(dataResolver, objectName, types, $config, currInputObjectTypes, currOutputObjectTypeDefs, schemaInfo, schema, $relations) {
        this.dataResolver = dataResolver;
        this.objectName = objectName;
        this.types = types;
        this.config = $config;
        this.currInputObjectTypes = currInputObjectTypes;
        this.currOutputObjectTypeDefs = currOutputObjectTypeDefs;
        this.schema = schema;
        this.schemaInfo = schemaInfo;
        this.relations = $relations;
        this.fields = {};
        this.resolvers = new Map();
        this.generate();
    }
    generate() {
        this.types.forEach(type => {
            const args = {};
            const schemaType = this.schema.getType(type.name);
            const generator = new InputGenerator(schemaType, this.config, this.currInputObjectTypes, this.schemaInfo, this.schema, this.relations);
            const updateInputName = `Update${type.name}MutationInput`;
            const updateInput = new graphql.GraphQLInputObjectType({
                name: updateInputName,
                fields: {
                    data: { type: new graphql.GraphQLNonNull(generator.generateUpdateInput()) },
                    where: { type: new graphql.GraphQLNonNull(generator.generateWhereUniqueInput()) },
                    conditions: { type: generator.generateWhereInput(this.dataResolver.getFeatures().logicalOperators), description: 'Update will only be performed if these conditions are met' },
                    clientMutationId: { type: graphql.GraphQLString }
                }
            });
            this.currInputObjectTypes.set(updateInputName, updateInput);
            args['input'] = {
                type: new graphql.GraphQLNonNull(updateInput)
            };
            const outputTypeName = getPayloadTypeName(type.name);
            this.fields[`update${type.name}`] = {
                type: outputTypeName,
                args: args
            };
            this.currOutputObjectTypeDefs.add(getPayloadTypeDef(type.name));
            this.resolvers.set(`update${type.name}`, updateResolver(this.dataResolver));
            // UPDATE MANY
            const updateManyInputName = `UpdateMany${pluralize(type.name)}MutationInput`;
            const updateManyInput = new graphql.GraphQLInputObjectType({
                name: updateManyInputName,
                fields: {
                    data: { type: new graphql.GraphQLNonNull(generator.generateUpdateInput()) },
                    where: Object.assign({ type: new graphql.GraphQLNonNull(generator.generateWhereInput(this.dataResolver.getFeatures().logicalOperators)) }),
                    clientMutationId: { type: graphql.GraphQLString }
                }
            });
            this.currInputObjectTypes.set(updateManyInputName, updateManyInput);
            const manyArgs = {};
            manyArgs['input'] = {
                type: new graphql.GraphQLNonNull(updateManyInput)
            };
            this.fields[`updateMany${pluralize(type.name)}`] = {
                type: 'BatchPayload',
                args: manyArgs
            };
            this.resolvers.set(`updateMany${pluralize(type.name)}`, (_root, _args, _context, _info) => __awaiter(this, void 0, void 0, function* () {
                let count = 0;
                const clientMutationId = _args.input && _args.input.clientMutationId ? _args.input.clientMutationId : '';
                const filter = _args.input && _args.input.where ? _args.input.where : '';
                const updateArgs = _args.input && _args.input.data ? _args.input.data : '';
                if (filter && updateArgs) {
                    const options = parseFilter(filter, schemaType);
                    let fortuneReturn = yield this.dataResolver.find(type.name, null, options, { context: _context, info: _info });
                    fortuneReturn = fortuneReturn.filter(element => element !== null && element !== undefined);
                    count = fortuneReturn.length;
                    if (count > 1) {
                        Object.keys(updateArgs).forEach(fieldName => {
                            const fields = lodash.get(this.schemaInfo, [type.name, 'fields']);
                            if (fields) {
                                const field = lodash.find(fields, { name: fieldName });
                                if (lodash.get(field, ['metadata', 'unique']) === true) {
                                    throw new graphql.GraphQLError('Can\'t update multiple values on unique field ' + fieldName);
                                }
                            }
                        });
                    }
                    yield Promise.all(fortuneReturn.map((fortuneRecord) => __awaiter(this, void 0, void 0, function* () {
                        return yield updateResolver(this.dataResolver)(fortuneRecord, { update: updateArgs, where: true }, _context, _info, null, null, schemaType);
                    })));
                }
                return {
                    count,
                    clientMutationId
                };
            }));
        });
    }
    getResolvers() {
        return new Map([[this.objectName, this.resolvers]]);
    }
    getFieldsOnObject() {
        return new Map([[this.objectName, this.fields]]);
    }
}

/**
 * Copyright (c) 2019-present, GraphQL Foundation
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */
// A Function, which when given an Array of keys, returns a Promise of an Array
// of values or Errors.
// Optionally turn off batching or caching or provide a cache key function or a
// custom cache instance.
// If a custom cache is provided, it must be of this type (a subset of ES6 Map).

/**
 * A `DataLoader` creates a public API for loading data from a particular
 * data back-end with unique keys such as the `id` column of a SQL table or
 * document name in a MongoDB database, given a batch loading function.
 *
 * Each `DataLoader` instance contains a unique memoized cache. Use caution when
 * used in long-lived applications or those which serve many users with
 * different access permissions and consider creating a new instance per
 * web request.
 */
var DataLoader =
/*#__PURE__*/
function () {
  function DataLoader(batchLoadFn, options) {
    if (typeof batchLoadFn !== 'function') {
      throw new TypeError('DataLoader must be constructed with a function which accepts ' + ("Array<key> and returns Promise<Array<value>>, but got: " + batchLoadFn + "."));
    }

    this._batchLoadFn = batchLoadFn;
    this._maxBatchSize = getValidMaxBatchSize(options);
    this._batchScheduleFn = getValidBatchScheduleFn(options);
    this._cacheKeyFn = getValidCacheKeyFn(options);
    this._cacheMap = getValidCacheMap(options);
    this._batch = null;
  } // Private


  var _proto = DataLoader.prototype;

  /**
   * Loads a key, returning a `Promise` for the value represented by that key.
   */
  _proto.load = function load(key) {
    if (key === null || key === undefined) {
      throw new TypeError('The loader.load() function must be called with a value,' + ("but got: " + String(key) + "."));
    }

    var batch = getCurrentBatch(this);
    var cacheMap = this._cacheMap;

    var cacheKey = this._cacheKeyFn(key); // If caching and there is a cache-hit, return cached Promise.


    if (cacheMap) {
      var cachedPromise = cacheMap.get(cacheKey);

      if (cachedPromise) {
        var cacheHits = batch.cacheHits || (batch.cacheHits = []);
        return new Promise(function (resolve) {
          cacheHits.push(function () {
            return resolve(cachedPromise);
          });
        });
      }
    } // Otherwise, produce a new Promise for this key, and enqueue it to be
    // dispatched along with the current batch.


    batch.keys.push(key);
    var promise = new Promise(function (resolve, reject) {
      batch.callbacks.push({
        resolve: resolve,
        reject: reject
      });
    }); // If caching, cache this promise.

    if (cacheMap) {
      cacheMap.set(cacheKey, promise);
    }

    return promise;
  }
  /**
   * Loads multiple keys, promising an array of values:
   *
   *     var [ a, b ] = await myLoader.loadMany([ 'a', 'b' ]);
   *
   * This is similar to the more verbose:
   *
   *     var [ a, b ] = await Promise.all([
   *       myLoader.load('a'),
   *       myLoader.load('b')
   *     ]);
   *
   * However it is different in the case where any load fails. Where
   * Promise.all() would reject, loadMany() always resolves, however each result
   * is either a value or an Error instance.
   *
   *     var [ a, b, c ] = await myLoader.loadMany([ 'a', 'b', 'badkey' ]);
   *     // c instanceof Error
   *
   */
  ;

  _proto.loadMany = function loadMany(keys) {
    if (!isArrayLike(keys)) {
      throw new TypeError('The loader.loadMany() function must be called with Array<key> ' + ("but got: " + keys + "."));
    } // Support ArrayLike by using only minimal property access


    var loadPromises = [];

    for (var i = 0; i < keys.length; i++) {
      loadPromises.push(this.load(keys[i])["catch"](function (error) {
        return error;
      }));
    }

    return Promise.all(loadPromises);
  }
  /**
   * Clears the value at `key` from the cache, if it exists. Returns itself for
   * method chaining.
   */
  ;

  _proto.clear = function clear(key) {
    var cacheMap = this._cacheMap;

    if (cacheMap) {
      var cacheKey = this._cacheKeyFn(key);

      cacheMap["delete"](cacheKey);
    }

    return this;
  }
  /**
   * Clears the entire cache. To be used when some event results in unknown
   * invalidations across this particular `DataLoader`. Returns itself for
   * method chaining.
   */
  ;

  _proto.clearAll = function clearAll() {
    var cacheMap = this._cacheMap;

    if (cacheMap) {
      cacheMap.clear();
    }

    return this;
  }
  /**
   * Adds the provided key and value to the cache. If the key already
   * exists, no change is made. Returns itself for method chaining.
   *
   * To prime the cache with an error at a key, provide an Error instance.
   */
  ;

  _proto.prime = function prime(key, value) {
    var cacheMap = this._cacheMap;

    if (cacheMap) {
      var cacheKey = this._cacheKeyFn(key); // Only add the key if it does not already exist.


      if (cacheMap.get(cacheKey) === undefined) {
        // Cache a rejected promise if the value is an Error, in order to match
        // the behavior of load(key).
        var promise;

        if (value instanceof Error) {
          promise = Promise.reject(value); // Since this is a case where an Error is intentionally being primed
          // for a given key, we want to disable unhandled promise rejection.

          promise["catch"](function () {});
        } else {
          promise = Promise.resolve(value);
        }

        cacheMap.set(cacheKey, promise);
      }
    }

    return this;
  };

  return DataLoader;
}(); // Private: Enqueue a Job to be executed after all "PromiseJobs" Jobs.
//
// ES6 JavaScript uses the concepts Job and JobQueue to schedule work to occur
// after the current execution context has completed:
// http://www.ecma-international.org/ecma-262/6.0/#sec-jobs-and-job-queues
//
// Node.js uses the `process.nextTick` mechanism to implement the concept of a
// Job, maintaining a global FIFO JobQueue for all Jobs, which is flushed after
// the current call stack ends.
//
// When calling `then` on a Promise, it enqueues a Job on a specific
// "PromiseJobs" JobQueue which is flushed in Node as a single Job on the
// global JobQueue.
//
// DataLoader batches all loads which occur in a single frame of execution, but
// should include in the batch all loads which occur during the flushing of the
// "PromiseJobs" JobQueue after that same execution frame.
//
// In order to avoid the DataLoader dispatch Job occuring before "PromiseJobs",
// A Promise Job is created with the sole purpose of enqueuing a global Job,
// ensuring that it always occurs after "PromiseJobs" ends.
//
// Node.js's job queue is unique. Browsers do not have an equivalent mechanism
// for enqueuing a job to be performed after promise microtasks and before the
// next macrotask. For browser environments, a macrotask is used (via
// setImmediate or setTimeout) at a potential performance penalty.


var enqueuePostPromiseJob = typeof process === 'object' && typeof process.nextTick === 'function' ? function (fn) {
  if (!resolvedPromise) {
    resolvedPromise = Promise.resolve();
  }

  resolvedPromise.then(function () {
    return process.nextTick(fn);
  });
} : setImmediate || setTimeout; // Private: cached resolved Promise instance

var resolvedPromise; // Private: Describes a batch of requests

// Private: Either returns the current batch, or creates and schedules a
// dispatch of a new batch for the given loader.
function getCurrentBatch(loader) {
  // If there is an existing batch which has not yet dispatched and is within
  // the limit of the batch size, then return it.
  var existingBatch = loader._batch;

  if (existingBatch !== null && !existingBatch.hasDispatched && existingBatch.keys.length < loader._maxBatchSize && (!existingBatch.cacheHits || existingBatch.cacheHits.length < loader._maxBatchSize)) {
    return existingBatch;
  } // Otherwise, create a new batch for this loader.


  var newBatch = {
    hasDispatched: false,
    keys: [],
    callbacks: []
  }; // Store it on the loader so it may be reused.

  loader._batch = newBatch; // Then schedule a task to dispatch this batch of requests.

  loader._batchScheduleFn(function () {
    return dispatchBatch(loader, newBatch);
  });

  return newBatch;
}

function dispatchBatch(loader, batch) {
  // Mark this batch as having been dispatched.
  batch.hasDispatched = true; // If there's nothing to load, resolve any cache hits and return early.

  if (batch.keys.length === 0) {
    resolveCacheHits(batch);
    return;
  } // Call the provided batchLoadFn for this loader with the batch's keys and
  // with the loader as the `this` context.


  var batchPromise = loader._batchLoadFn(batch.keys); // Assert the expected response from batchLoadFn


  if (!batchPromise || typeof batchPromise.then !== 'function') {
    return failedDispatch(loader, batch, new TypeError('DataLoader must be constructed with a function which accepts ' + 'Array<key> and returns Promise<Array<value>>, but the function did ' + ("not return a Promise: " + String(batchPromise) + ".")));
  } // Await the resolution of the call to batchLoadFn.


  batchPromise.then(function (values) {
    // Assert the expected resolution from batchLoadFn.
    if (!isArrayLike(values)) {
      throw new TypeError('DataLoader must be constructed with a function which accepts ' + 'Array<key> and returns Promise<Array<value>>, but the function did ' + ("not return a Promise of an Array: " + String(values) + "."));
    }

    if (values.length !== batch.keys.length) {
      throw new TypeError('DataLoader must be constructed with a function which accepts ' + 'Array<key> and returns Promise<Array<value>>, but the function did ' + 'not return a Promise of an Array of the same length as the Array ' + 'of keys.' + ("\n\nKeys:\n" + String(batch.keys)) + ("\n\nValues:\n" + String(values)));
    } // Resolve all cache hits in the same micro-task as freshly loaded values.


    resolveCacheHits(batch); // Step through values, resolving or rejecting each Promise in the batch.

    for (var i = 0; i < batch.callbacks.length; i++) {
      var value = values[i];

      if (value instanceof Error) {
        batch.callbacks[i].reject(value);
      } else {
        batch.callbacks[i].resolve(value);
      }
    }
  })["catch"](function (error) {
    return failedDispatch(loader, batch, error);
  });
} // Private: do not cache individual loads if the entire batch dispatch fails,
// but still reject each request so they do not hang.


function failedDispatch(loader, batch, error) {
  // Cache hits are resolved, even though the batch failed.
  resolveCacheHits(batch);

  for (var i = 0; i < batch.keys.length; i++) {
    loader.clear(batch.keys[i]);
    batch.callbacks[i].reject(error);
  }
} // Private: Resolves the Promises for any cache hits in this batch.


function resolveCacheHits(batch) {
  if (batch.cacheHits) {
    for (var i = 0; i < batch.cacheHits.length; i++) {
      batch.cacheHits[i]();
    }
  }
} // Private: given the DataLoader's options, produce a valid max batch size.


function getValidMaxBatchSize(options) {
  var shouldBatch = !options || options.batch !== false;

  if (!shouldBatch) {
    return 1;
  }

  var maxBatchSize = options && options.maxBatchSize;

  if (maxBatchSize === undefined) {
    return Infinity;
  }

  if (typeof maxBatchSize !== 'number' || maxBatchSize < 1) {
    throw new TypeError("maxBatchSize must be a positive number: " + maxBatchSize);
  }

  return maxBatchSize;
} // Private


function getValidBatchScheduleFn(options) {
  var batchScheduleFn = options && options.batchScheduleFn;

  if (batchScheduleFn === undefined) {
    return enqueuePostPromiseJob;
  }

  if (typeof batchScheduleFn !== 'function') {
    throw new TypeError("batchScheduleFn must be a function: " + batchScheduleFn);
  }

  return batchScheduleFn;
} // Private: given the DataLoader's options, produce a cache key function.


function getValidCacheKeyFn(options) {
  var cacheKeyFn = options && options.cacheKeyFn;

  if (cacheKeyFn === undefined) {
    return function (key) {
      return key;
    };
  }

  if (typeof cacheKeyFn !== 'function') {
    throw new TypeError("cacheKeyFn must be a function: " + cacheKeyFn);
  }

  return cacheKeyFn;
} // Private: given the DataLoader's options, produce a CacheMap to be used.


function getValidCacheMap(options) {
  var shouldCache = !options || options.cache !== false;

  if (!shouldCache) {
    return null;
  }

  var cacheMap = options && options.cacheMap;

  if (cacheMap === undefined) {
    return new Map();
  }

  if (cacheMap !== null) {
    var cacheFunctions = ['get', 'set', 'delete', 'clear'];
    var missingFunctions = cacheFunctions.filter(function (fnName) {
      return cacheMap && typeof cacheMap[fnName] !== 'function';
    });

    if (missingFunctions.length !== 0) {
      throw new TypeError('Custom cacheMap missing methods: ' + missingFunctions.join(', '));
    }
  }

  return cacheMap;
} // Private


function isArrayLike(x) {
  return typeof x === 'object' && x !== null && typeof x.length === 'number' && (x.length === 0 || x.length > 0 && Object.prototype.hasOwnProperty.call(x, x.length - 1));
}

var dataloader = DataLoader;

class FortuneGraph {
    constructor(fortuneOptions, schemaInfo, fortuneRecordTypeDefinitions) {
        this.dataLoaders = new Map();
        this.computeId = (graphType, id) => {
            id = id || fortuneCommon.generateId();
            return abab_2(`${id}:${graphType}`);
        };
        this.getTypeFromId = (inputId) => {
            let result;
            try {
                result = abab_1(inputId).split(':')[1];
            }
            catch (e) {
                result = inputId;
            }
            return result;
        };
        this.getOriginalIdFromObjectId = (inputId) => {
            let result;
            try {
                result = abab_1(inputId).split(':')[0];
            }
            catch (e) {
                result = inputId;
            }
            return result;
        };
        this.getValueByUnique = (returnTypeName, args, meta) => __awaiter(this, void 0, void 0, function* () {
            let currValue;
            // tslint:disable-next-line:prefer-conditional-expression
            if (args.id) {
                currValue = yield this.find(returnTypeName, [args.id], undefined, meta);
            }
            else {
                currValue = yield this.find(returnTypeName, undefined, { match: args }, meta);
            }
            return lodash.isArray(currValue) ? currValue[0] : currValue;
        });
        this.canAdd = (graphQLTypeName, inputRecords, meta) => __awaiter(this, void 0, void 0, function* () {
            let canAdd = true;
            if (inputRecords && this.uniqueIndexes.has(graphQLTypeName)) {
                yield Promise.all(this.uniqueIndexes.get(graphQLTypeName).map((fieldName) => __awaiter(this, void 0, void 0, function* () {
                    yield Promise.all(inputRecords.map((inputRecord) => __awaiter(this, void 0, void 0, function* () {
                        if (canAdd && inputRecord[fieldName]) {
                            const dbRecord = yield this.getValueByUnique(graphQLTypeName, { [fieldName]: inputRecord[fieldName] }, meta);
                            if (dbRecord) {
                                canAdd = false;
                            }
                        }
                    })));
                })));
            }
            return canAdd;
        });
        this.getConnection = (allEdges, before, after, first, last) => {
            const connection = new Connection();
            const edgesWithCursorApplied = this.applyCursorsToEdges(allEdges, before, after);
            connection.aggregate.count = allEdges.length;
            connection.edges = this.edgesToReturn(edgesWithCursorApplied, first, last);
            if (typeof last !== 'undefined') {
                if (edgesWithCursorApplied.length > last) {
                    connection.pageInfo.hasPreviousPage = true;
                }
            }
            else if (typeof after !== 'undefined' && lodash.get(allEdges, '[0].id', 'id0') !== lodash.get(edgesWithCursorApplied, '[0].id', 'id1')) {
                connection.pageInfo.hasPreviousPage = true;
            }
            if (typeof first !== 'undefined') {
                if (edgesWithCursorApplied.length > first) {
                    connection.pageInfo.hasNextPage = true;
                }
            }
            else if (typeof before !== 'undefined' && lodash.get(allEdges, `[${allEdges.length - 1}].id`, 'id0') !== lodash.get(edgesWithCursorApplied, `[${edgesWithCursorApplied.length - 1}].id`, 'id1')) {
                connection.pageInfo.hasNextPage = true;
            }
            connection.pageInfo.startCursor = lodash.get(connection.edges, '[0].id');
            connection.pageInfo.endCursor = lodash.get(connection.edges, `[${connection.edges.length - 1}].id`);
            return connection;
        };
        this.edgesToReturn = (edgesWithCursorApplied, first, last) => {
            if (typeof first !== 'undefined') {
                if (first < 0) {
                    throw new Error('first must be greater than 0');
                }
                else if (edgesWithCursorApplied.length > first) {
                    edgesWithCursorApplied = edgesWithCursorApplied.slice(0, first);
                }
            }
            if (typeof last !== 'undefined') {
                if (last < 0) {
                    throw new Error('first must be greater than 0');
                }
                else if (edgesWithCursorApplied.length > last) {
                    edgesWithCursorApplied = edgesWithCursorApplied.slice(edgesWithCursorApplied.length - last, edgesWithCursorApplied.length);
                }
            }
            return edgesWithCursorApplied;
        };
        this.applyCursorsToEdges = (allEdges, before, after) => {
            let edges = allEdges;
            if (after) {
                const afterEdgeIndex = lodash.findIndex(edges, ['id', after]);
                if (afterEdgeIndex > -1) {
                    edges = edges.slice(afterEdgeIndex + 1, edges.length);
                }
            }
            if (before) {
                const beforeEdgeIndex = lodash.findIndex(edges, ['id', before]);
                if (beforeEdgeIndex > -1) {
                    edges = edges.slice(0, beforeEdgeIndex);
                }
            }
            return edges;
        };
        this.create = (graphQLTypeName, records, meta) => __awaiter(this, void 0, void 0, function* () {
            const fortuneType = this.getFortuneTypeName(graphQLTypeName);
            records['__typename'] = graphQLTypeName;
            if (!records['id']) {
                records['id'] = this.computeId(graphQLTypeName);
            }
            let results = this.transaction ? yield this.transaction.create(fortuneType, records, undefined, meta) : yield this.store.create(fortuneType, records, undefined, meta);
            results = results.payload.records;
            return lodash.isArray(records) ? results : results[0];
        });
        this.find = (graphQLTypeName, ids, options, meta) => __awaiter(this, void 0, void 0, function* () {
            let graphReturn;
            let fortuneType;
            if (graphQLTypeName === 'Node') {
                fortuneType = this.getFortuneTypeName(this.getTypeFromId(ids[0]));
                const results = this.transaction ? yield this.transaction.find(fortuneType, ids[0], options, undefined, meta) : yield this.store.find(fortuneType, ids[0], options, undefined, meta);
                graphReturn = lodash.get(results, 'payload.records');
            }
            else {
                fortuneType = this.getFortuneTypeName(graphQLTypeName);
                // pull the id out of the match options
                if (lodash.get(options, 'match.id')) {
                    ids = lodash.get(options, 'match.id');
                    delete options.match.id;
                }
                if (ids) {
                    ids = lodash.isArray(ids) ? ids : [ids];
                }
                options = this.generateOptions(options, graphQLTypeName, ids);
                if (!ids || (Object.keys(options).length && (Object.keys(options).length > 1 || !options.match))) {
                    const results = this.transaction
                        ? yield this.transaction.find(fortuneType, ids, options, undefined, meta)
                        : yield this.store.find(fortuneType, ids, options, undefined, meta);
                    graphReturn = lodash.get(results, 'payload.records');
                }
                else {
                    if (!this.dataLoaders.has(fortuneType)) {
                        this.dataLoaders.set(fortuneType, new dataloader((inputIds) => __awaiter(this, void 0, void 0, function* () {
                            const results = yield (this.transaction
                                ? this.transaction.find(fortuneType, inputIds, options, undefined, meta)
                                : this.store.find(fortuneType, inputIds, {}, undefined, meta));
                            const realreults = lodash.orderBy(lodash.get(results, 'payload.records'), v => inputIds.indexOf(v.id));
                            return realreults;
                        }), { batchScheduleFn: callback => setTimeout(callback, 0) }));
                    }
                    graphReturn = yield this.dataLoaders.get(fortuneType).loadMany(ids);
                }
            }
            if (graphReturn) {
                graphReturn = graphReturn.map((element) => {
                    element.id = lodash.isString(element.id) ? element.id : lodash.toString(element.id);
                    return element;
                });
                if (!lodash.get(options, 'sort')) {
                    // to support relay plural identifying root fields results should be in the order in which they were requested,
                    // with null being returned by failed finds
                    if (ids) {
                        const newReturn = [];
                        ids.forEach((value) => {
                            const foundResult = lodash.find(graphReturn, ['id', value]);
                            if (foundResult) {
                                newReturn.push(foundResult);
                            }
                            else {
                                newReturn.push(null);
                            }
                        });
                        graphReturn = newReturn;
                    }
                    else if (this.uniqueIndexes.has(graphQLTypeName)) {
                        const matches = options.match;
                        if (matches['__typename']) {
                            delete matches['__typename'];
                        }
                        const matchesKeys = Object.keys(matches);
                        if (matchesKeys.length === 1) {
                            const key = matchesKeys[0];
                            if (this.uniqueIndexes.get(graphQLTypeName).includes(key)) {
                                const theMatch = lodash.isArray(matches[key]) ? matches[key] : [matches[key]];
                                const newReturn = [];
                                theMatch.forEach((value) => {
                                    const foundResult = lodash.find(graphReturn, [key, value]);
                                    if (foundResult) {
                                        newReturn.push(foundResult);
                                    }
                                    else {
                                        newReturn.push(null);
                                    }
                                });
                                graphReturn = newReturn;
                            }
                        }
                    }
                }
                // if one id sent in we just want to return the value not an array
                // graphReturn = ids && ids.length === 1 ? graphReturn[0] : graphReturn;
            }
            if (!graphReturn) {
                console.log('Nothing Found ' + graphQLTypeName + ' ' + JSON.stringify(ids) + ' ' + JSON.stringify(options));
            }
            if (graphReturn && graphReturn[0] === null) {
                console.log(graphReturn, ids, graphQLTypeName);
            }
            return graphReturn;
        });
        this.update = (graphQLTypeName, records, meta, options) => __awaiter(this, void 0, void 0, function* () {
            const fortuneType = this.getFortuneTypeName(graphQLTypeName);
            let updates = records;
            if (!options || !options['fortuneFormatted']) {
                updates = lodash.isArray(records) ? records.map(value => this.generateUpdates(value, options)) : this.generateUpdates(records, options);
            }
            let results = this.transaction ? yield this.transaction.update(fortuneType, updates, undefined, meta) : yield this.store.update(fortuneType, updates, undefined, meta);
            results = results.payload.records;
            return lodash.isArray(records) ? results : results[0];
        });
        this.delete = (graphQLTypeName, ids, meta) => __awaiter(this, void 0, void 0, function* () {
            const fortuneType = this.getFortuneTypeName(graphQLTypeName);
            if (ids.length > 0) {
                this.transaction ? yield this.transaction.delete(fortuneType, ids, undefined, meta) : yield this.store.delete(fortuneType, ids, undefined, meta);
            }
            return true;
        });
        this.generateUpdates = (record, options = {}) => {
            const updates = { id: record['id'] };
            for (const argName in record) {
                const arg = record[argName];
                if (argName !== 'id') {
                    if (lodash.isArray(arg)) {
                        if (options['pull']) {
                            updates.pull = updates.pull || {};
                            updates.pull[argName] = arg;
                        }
                        else {
                            updates.push = updates.push || {};
                            updates.push[argName] = arg;
                        }
                    }
                    else if (lodash.isPlainObject(arg)) {
                        if (arg.push) {
                            updates.push = updates.push || {};
                            updates.push[argName] = arg.push;
                        }
                        if (arg.pull) {
                            updates.pull = updates.pull || {};
                            updates.pull[argName] = arg.pull;
                        }
                        if (arg.set) {
                            updates.replace = updates.replace || {};
                            updates.replace[argName] = arg.set;
                        }
                    }
                    else {
                        updates.replace = updates.replace || {};
                        updates.replace[argName] = arg;
                    }
                }
            }
            return updates;
        };
        this.getLink = (graphQLTypeName, field) => {
            const fortuneType = this.getFortuneTypeName(graphQLTypeName);
            return lodash.get(this.store, `recordTypes.${fortuneType}.${field}.link`);
        };
        this.getStore = () => {
            if (!this.store) {
                this.store = this.buildFortune();
            }
            return this.store;
        };
        this.computeFortuneTypeNames = () => {
            this.fortuneTypeNames = new Map();
            lodash.each(lodash.keys(this.schemaInfo), (typeName) => {
                if (typeName !== 'Node' && !this.fortuneTypeNames.has(typeName)) {
                    const type = this.schemaInfo[typeName];
                    let storeObj = this.getStoreName(type, null, null);
                    let storeName = storeObj.storeName;
                    let storeTypeName = storeObj.typeName;
                    if (!lodash.isEmpty(type.possibleTypes)) {
                        const possibleTypes = [type.name];
                        lodash.each(type.possibleTypes, possibleType => {
                            if (possibleTypes.indexOf(possibleType.name) < 0) {
                                possibleTypes.push(possibleType.name);
                            }
                            possibleType = this.schemaInfo[possibleType.name];
                            storeObj = this.getStoreName(possibleType, storeName, storeTypeName);
                            storeName = storeObj.storeName;
                            storeTypeName = storeObj.typeName;
                            lodash.each(possibleType['interfaces'], currInterface => {
                                currInterface = this.schemaInfo[currInterface.name];
                                if (currInterface.name !== 'Node' && currInterface.name !== storeTypeName) {
                                    storeObj = this.getStoreName(currInterface, storeName, storeTypeName);
                                    storeName = storeObj.storeName;
                                    storeTypeName = storeObj.typeName;
                                    if (possibleTypes.indexOf(currInterface.name) < 0) {
                                        possibleTypes.push(currInterface.name);
                                    }
                                    if (!lodash.isEmpty(currInterface.possibleTypes)) {
                                        lodash.each(currInterface.possibleTypes, currInterfacePossibleType => {
                                            if (possibleTypes.indexOf(currInterfacePossibleType.name) < 0) {
                                                currInterfacePossibleType = this.schemaInfo[currInterfacePossibleType.name];
                                                storeObj = this.getStoreName(currInterfacePossibleType, storeName, storeTypeName);
                                                storeName = storeObj.storeName;
                                                storeTypeName = storeObj.typeName;
                                                possibleTypes.push(currInterfacePossibleType.name);
                                            }
                                        });
                                    }
                                }
                            });
                            lodash.each(possibleType['unions'], currUnion => {
                                currUnion = this.schemaInfo[currUnion.name];
                                if (currUnion.name !== storeTypeName) {
                                    if (possibleTypes.indexOf(currUnion.name) < 0) {
                                        storeObj = this.getStoreName(currUnion, storeName, storeTypeName);
                                        storeName = storeObj.storeName;
                                        storeTypeName = storeObj.typeName;
                                        possibleTypes.push(currUnion.name);
                                    }
                                    if (!lodash.isEmpty(currUnion.possibleTypes)) {
                                        lodash.each(currUnion.possibleTypes, currUnionPossibleType => {
                                            if (possibleTypes.indexOf(currUnionPossibleType.name) < 0) {
                                                currUnionPossibleType = this.schemaInfo[currUnionPossibleType.name];
                                                storeObj = this.getStoreName(currUnionPossibleType, storeName, storeTypeName);
                                                storeName = storeObj.storeName;
                                                storeTypeName = storeObj.typeName;
                                                possibleTypes.push(currUnionPossibleType.name);
                                            }
                                        });
                                    }
                                }
                            });
                        });
                        const fortuneTypeName = storeName || (possibleTypes.sort() && possibleTypes.join('_'));
                        lodash.each(possibleTypes, currTypeName => {
                            this.fortuneTypeNames.set(currTypeName, fortuneTypeName);
                        });
                    }
                    else if (!lodash.isEmpty(storeName)) {
                        this.fortuneTypeNames.set(typeName, storeName);
                    }
                }
            });
            return this.fortuneTypeNames;
        };
        this.getStoreName = (type, currStoreName, currTypeName) => {
            let storeName = lodash.get(type, 'metadata.storeName', null);
            let typeName = type.name;
            if (!lodash.isEmpty(storeName) && currStoreName && currStoreName !== storeName) {
                throw new Error(`Conflictiing store names which need to be the same
			${storeName} on ${typeName}
			does not match
			${currStoreName} on ${currTypeName}
		`);
            }
            typeName = !lodash.isEmpty(storeName) ? typeName : currTypeName;
            storeName = !lodash.isEmpty(storeName) ? storeName : currStoreName;
            return {
                storeName,
                typeName
            };
        };
        this.getFortuneTypeName = (name) => {
            name = this.getDataTypeName(name);
            return this.fortuneTypeNames.has(name) ? this.fortuneTypeNames.get(name) : name;
        };
        this.buildFortune = (fortuneRecordTypeDefinitions) => {
            this.computeFortuneTypeNames();
            const relations = computeRelations(this.schemaInfo, this.getFortuneTypeName);
            const fortuneConfig = {};
            lodash.forOwn(this.schemaInfo, (type, name) => {
                if (type.kind === 'OBJECT' && name !== 'Query' && name !== 'Mutation' && name !== 'Subscription') {
                    const fields = {};
                    lodash.forOwn(type.fields, (field) => {
                        if (field.name !== 'id') {
                            let currType = field.type;
                            let isArray = false;
                            while (currType.kind === 'NON_NULL' || currType.kind === 'LIST') {
                                if (currType.kind === 'LIST') {
                                    isArray = true;
                                }
                                currType = currType.ofType;
                            }
                            if (lodash.get(field, 'metadata.unique') === true) {
                                if (isArray) {
                                    console.error('Unique may not work on list types', name, field.name);
                                }
                                if (!this.uniqueIndexes.has(name)) {
                                    this.uniqueIndexes.set(name, []);
                                }
                                this.uniqueIndexes.get(name).push(field.name);
                            }
                            if (lodash.get(field, 'metadata.createdTimestamp') === true) {
                                this.addInputHook(name, (context, record) => {
                                    switch (context.request.method) {
                                        case 'create':
                                            if (!record.hasOwnProperty(field.name)) {
                                                record[field.name] = new Date();
                                            }
                                            return record;
                                    }
                                });
                            }
                            if (lodash.get(field, 'metadata.updatedTimestamp') === true) {
                                this.addInputHook(name, (context, _record, update) => {
                                    switch (context.request.method) {
                                        case 'update':
                                            if (!('replace' in update))
                                                update.replace = {};
                                            if (!update.replace.hasOwnProperty(field.name)) {
                                                update.replace[field.name] = new Date();
                                            }
                                            return update;
                                    }
                                });
                            }
                            const currKind = currType.kind;
                            currType = currType.kind === 'ENUM' ? 'String' : currType.name;
                            if (currType === 'ID' || currType === 'String') {
                                currType = String;
                            }
                            else if (currType === 'Int' || currType === 'Float') {
                                currType = Number;
                            }
                            else if (currType === 'Boolean') {
                                currType = Boolean;
                            }
                            else if (currType === 'JSON') {
                                currType = Object;
                            }
                            else if (currType === 'Date' || currType === 'Time' || currType === 'DateTime') {
                                currType = Date;
                            }
                            else if (currKind === 'SCALAR') {
                                currType = Object;
                            }
                            let inverse;
                            if (lodash.isString(currType)) {
                                currType = this.getFortuneTypeName(currType);
                                inverse = relations.getInverseWithoutName(currType, field.name, this.getFortuneTypeName(type.name));
                            }
                            currType = isArray ? Array(currType) : currType;
                            if (inverse) {
                                currType = [currType, inverse];
                            }
                            fields[field.name] = currType;
                        }
                        fields.__typename = String;
                    });
                    const fortuneName = this.getFortuneTypeName(name);
                    const fortuneConfigForName = fortuneConfig[fortuneName] ? fortuneConfig[fortuneName] : {};
                    lodash.each(lodash.keys(fields), (fieldName) => {
                        const currType = fortuneConfigForName[fieldName];
                        const newType = fields[fieldName];
                        if (!currType) {
                            fortuneConfigForName[fieldName] = newType;
                        }
                        else {
                            let badSchema = typeof newType !== typeof currType;
                            badSchema = badSchema ? badSchema : !lodash.isEqual(fortuneConfigForName[fieldName], fields[fieldName]);
                            if (badSchema) {
                                console.error('Bad schema. Types that share unions/interfaces have fields of the same name but different types. This is not allowed\n', 'fortune type', fortuneName, '\n', 'field name', fieldName, '\n', 'currType', fortuneConfigForName[fieldName], '\n', 'newType', fields[fieldName]);
                            }
                        }
                    });
                    fortuneConfig[fortuneName] = fortuneConfigForName;
                    if (!this.fortuneOptions.hooks[fortuneName]) {
                        this.fortuneOptions.hooks[fortuneName] = [this.inputHook(fortuneName), this.outputHook(fortuneName)];
                    }
                }
            });
            if (fortuneRecordTypeDefinitions) {
                lodash.merge(fortuneConfig, fortuneRecordTypeDefinitions);
            }
            const store = fortune(fortuneConfig, this.fortuneOptions);
            return store;
        };
        this.generateOptions = (options, graphQLTypeName, ids) => {
            options = options ? Object.assign({}, options) : {};
            // if no ids we need to make sure we only get the necessary typename so that this works with interfaces/unions
            if (graphQLTypeName && (!ids || ids.length < 1)) {
                lodash.set(options, 'match.__typename', this.getDataTypeName(graphQLTypeName));
            }
            if (lodash.has(options, 'exists.id')) {
                delete options.exists.id;
            }
            // make sure sort is boolean rather than enum
            if (options.orderBy) {
                const sort = {};
                for (const fieldName in options.orderBy) {
                    if (options.orderBy[fieldName] === 'ASCENDING' || options.orderBy[fieldName] === 'ASC') {
                        sort[fieldName] = true;
                    }
                    else if (options.orderBy[fieldName] === 'DESCENDING' || options.orderBy[fieldName] === 'DESC') {
                        sort[fieldName] = false;
                    }
                }
                options.sort = sort;
                delete options.orderBy;
            }
            return options;
        };
        this.beginTransaction = () => __awaiter(this, void 0, void 0, function* () {
            if (!this.transaction && this.store.beginTransaction) {
                this.transaction = yield this.store.beginTransaction();
            }
        });
        this.endTransaction = () => __awaiter(this, void 0, void 0, function* () {
            if (this.transaction && this.store.endTransaction) {
                yield this.store.endTransaction();
            }
            this.transaction = null;
        });
        this.fortuneOptions = fortuneOptions;
        if (!this.fortuneOptions || !this.fortuneOptions.hooks) {
            lodash.set(this.fortuneOptions, 'hooks', {});
        }
        this.schemaInfo = schemaInfo;
        this.uniqueIndexes = new Map();
        this.inputHooks = new Map();
        this.outputHooks = new Map();
        this.store = this.buildFortune(fortuneRecordTypeDefinitions);
        console.log('CONTSTRUCTED');
    }
    getDataTypeName(graphQLTypeName) {
        graphQLTypeName = graphQLTypeName.endsWith('Connection') ? graphQLTypeName.replace(/Connection$/g, '') : graphQLTypeName;
        graphQLTypeName = graphQLTypeName.endsWith('Edge') ? graphQLTypeName.replace(/Edge$/g, '') : graphQLTypeName;
        return graphQLTypeName;
    }
    inputHook(_fortuneType) {
        return (context, record, update) => {
            const promises = [];
            if (record['__typename'] && this.inputHooks.has(record['__typename'])) {
                this.inputHooks.get(record['__typename']).forEach(hook => {
                    const returnVal = hook(context, record, update);
                    if (returnVal instanceof Promise) {
                        promises.push(returnVal);
                    }
                });
            }
            return new Promise((resolve, reject) => {
                Promise.all(promises).then(() => {
                    switch (context.request.method) {
                        // If it's a create request, return the record.
                        case 'create':
                            resolve(record);
                            break;
                        // If it's an update request, return the update.
                        case 'update':
                            resolve(update);
                            break;
                        // If it's a delete request, the return value doesn't matter.
                        case 'delete':
                            resolve(null);
                            break;
                    }
                }).catch(reason => {
                    reject(reason);
                });
            });
        };
    }
    outputHook(_fortuneType) {
        return (context, record) => {
            if (record['__typename'] && this.outputHooks.has(record['__typename'])) {
                const promises = [];
                this.outputHooks.get(record['__typename']).forEach(hook => {
                    const returnVal = hook(context, record);
                    if (returnVal instanceof Promise) {
                        promises.push(returnVal);
                    }
                });
                return new Promise((resolve, reject) => {
                    Promise.all(promises).then(() => {
                        resolve(record);
                    }).catch(reason => {
                        reject(reason);
                    });
                });
            }
        };
    }
    getFeatures() {
        return this.store.adapter.features || {};
    }
    applyOptions(graphQLTypeName, records, options, meta) {
        records = lodash.isArray(records) ? records : [records];
        options = this.generateOptions(options);
        const fortuneType = this.getFortuneTypeName(graphQLTypeName);
        return fortuneCommon.applyOptions(this.store.recordTypes[fortuneType], records, options, meta);
    }
    addOutputHook(graphQLTypeName, hook) {
        if (!this.outputHooks.has(graphQLTypeName)) {
            this.outputHooks.set(graphQLTypeName, [hook]);
        }
        else {
            this.outputHooks.get(graphQLTypeName).push(hook);
        }
    }
    addInputHook(graphQLTypeName, hook) {
        if (!this.inputHooks.has(graphQLTypeName)) {
            this.inputHooks.set(graphQLTypeName, [hook]);
        }
        else {
            this.inputHooks.get(graphQLTypeName).push(hook);
        }
    }
}

class GenerateConnections {
    constructor(dataResolver, objectName, types, $schema, $currOutputObjectTypeDefs, $currInputObjectTypes, $schemaInfo, $relations) {
        this.dataResolver = dataResolver;
        this.objectName = objectName;
        this.types = types;
        this.schema = $schema;
        this.currOutputObjectTypeDefs = $currOutputObjectTypeDefs;
        this.currInputObjectTypes = $currInputObjectTypes;
        this.schemaInfo = $schemaInfo;
        this.relations = $relations;
        this.fields = {};
        this.resolvers = new Map();
        this.edgeResolvers = new Map();
        this.currOutputObjectTypeDefs.add(`
			"""
			Information about pagination in a connection.
			"""
			type PageInfo {
				"""
				When paginating forwards, are there more items?
				"""
				hasNextPage: Boolean!
				"""
				When paginating backwards, are there more items?
				"""
				hasPreviousPage: Boolean!
				"""
				When paginating backwards, the cursor to continue.
				"""
				startCursor: String
				"""
				When paginating forwards, the cursor to continue.
				"""
				endCursor: String
			}
		`);
        this.generate();
    }
    generate() {
        Object.keys(this.schema.getTypeMap()).forEach(typeName => {
            const type = this.schema.getType(typeName);
            if (graphql.isInterfaceType(type) || graphql.isUnionType(type)) {
                this.createNewTypes(typeName);
                const edgeFieldResolvers = new Map();
                edgeFieldResolvers.set('node', (root) => {
                    return root;
                });
                edgeFieldResolvers.set('cursor', (root) => {
                    const fortuneReturn = root && root.fortuneReturn ? root.fortuneReturn : root;
                    return fortuneReturn.id;
                });
                this.edgeResolvers.set(`${typeName}Edge`, edgeFieldResolvers);
            }
        });
        this.types.forEach(type => {
            const fieldName = `${lodash.camelCase(pluralize(type.name))}Connection`;
            this.createNewTypes(type.name);
            const schemaType = this.schema.getType(type.name);
            const generator = new InputGenerator(schemaType, null, this.currInputObjectTypes, this.schemaInfo, this.schema, this.relations);
            const args = Object.assign({
                where: { type: generator.generateWhereInput(this.dataResolver.getFeatures().logicalOperators) },
                orderBy: { type: generator.generateOrderByInput() }
            }, queryArgs, getRootMatchFields(this.currInputObjectTypes.get(`${type.name}MatchInput`)));
            this.fields[fieldName] = {
                type: `${type.name}Connection`,
                args
            };
            this.resolvers.set(fieldName, getAllResolver(this.dataResolver, this.schema, type, true));
            const edgeFieldResolvers = new Map();
            edgeFieldResolvers.set('node', (root) => {
                return root;
            });
            edgeFieldResolvers.set('cursor', (root) => {
                const fortuneReturn = root && root.fortuneReturn ? root.fortuneReturn : root;
                return fortuneReturn.id;
            });
            this.edgeResolvers.set(`${type.name}Edge`, edgeFieldResolvers);
        });
    }
    getResolvers() {
        return new Map([[this.objectName, this.resolvers], ...this.edgeResolvers]);
    }
    getFieldsOnObject() {
        return new Map([[this.objectName, this.fields]]);
    }
    createNewTypes(typeName) {
        this.currOutputObjectTypeDefs.add(`
		"""
		A connection to a list of items.
		"""
		type ${typeName}Connection {
			"""
			A list of edges.
			"""
			edges: [${typeName}Edge]
			"""
			Information to aid in pagination.
			"""
			pageInfo: PageInfo
			"""
			Meta information
			"""
			aggregate: ${typeName}Aggregate
		}
	`);
        this.currOutputObjectTypeDefs.add(`
		type ${typeName}Aggregate {
			"""
			The total number that match the where clause
			"""
			count: Int!
		}
	`);
        this.currOutputObjectTypeDefs.add(`
		type ${typeName}Edge {
			node: ${typeName}!
			cursor: String!
		}
	`);
    }
}

class GenerateCreate {
    constructor(dataResolver, objectName, types, $config, currInputObjectTypes, currOutputObjectTypeDefs, schemaInfo, schema, relations) {
        this.dataResolver = dataResolver;
        this.objectName = objectName;
        this.types = types;
        this.config = $config;
        this.currInputObjectTypes = currInputObjectTypes;
        this.currOutputObjectTypeDefs = currOutputObjectTypeDefs;
        this.schema = schema;
        this.schemaInfo = schemaInfo;
        this.relations = relations;
        this.fields = {};
        this.resolvers = new Map();
        this.generate();
    }
    generate() {
        this.types.forEach(type => {
            const args = {};
            const createInputName = `Create${type.name}MutationInput`;
            const createInput = new graphql.GraphQLInputObjectType({
                name: createInputName,
                fields: {
                    data: { type: new graphql.GraphQLNonNull(new InputGenerator(this.schema.getType(type.name), this.config, this.currInputObjectTypes, this.schemaInfo, this.schema, this.relations).generateCreateInput()) },
                    clientMutationId: { type: graphql.GraphQLString }
                }
            });
            this.currInputObjectTypes.set(createInputName, createInput);
            args['input'] = {
                type: new graphql.GraphQLNonNull(createInput)
            };
            const outputTypeName = getPayloadTypeName(type.name);
            this.fields[`create${type.name}`] = {
                type: outputTypeName,
                args: args
            };
            this.currOutputObjectTypeDefs.add(getPayloadTypeDef(type.name));
            this.resolvers.set(`create${type.name}`, createResolver(this.dataResolver));
        });
    }
    getResolvers() {
        return new Map([[this.objectName, this.resolvers]]);
    }
    getFieldsOnObject() {
        return new Map([[this.objectName, this.fields]]);
    }
}

class GenerateDelete {
    constructor(dataResolver, objectName, types, $config, currInputObjectTypes, currOutputObjectTypeDefs, schemaInfo, schema, $relations) {
        this.dataResolver = dataResolver;
        this.objectName = objectName;
        this.types = types;
        this.config = $config;
        this.currInputObjectTypes = currInputObjectTypes;
        this.currOutputObjectTypeDefs = currOutputObjectTypeDefs;
        this.schema = schema;
        this.schemaInfo = schemaInfo;
        this.relations = $relations;
        this.fields = {};
        this.resolvers = new Map();
        this.generate();
    }
    generate() {
        this.types.forEach(type => {
            const args = {};
            const generator = new InputGenerator(this.schema.getType(type.name), this.config, this.currInputObjectTypes, this.schemaInfo, this.schema, this.relations);
            const deleteInputName = `Delete${type.name}MutationInput`;
            const deleteInput = new graphql.GraphQLInputObjectType({
                name: deleteInputName,
                fields: {
                    where: { type: new graphql.GraphQLNonNull(generator.generateWhereUniqueInput()) },
                    conditions: { type: generator.generateWhereInput(this.dataResolver.getFeatures().logicalOperators), description: 'Delete will only be performed if these conditions are met' },
                    clientMutationId: { type: graphql.GraphQLString }
                }
            });
            this.currInputObjectTypes.set(deleteInputName, deleteInput);
            args['input'] = {
                type: new graphql.GraphQLNonNull(deleteInput)
            };
            const outputTypeName = getPayloadTypeName(type.name);
            this.fields[`delete${type.name}`] = {
                type: outputTypeName,
                args: args
            };
            this.currOutputObjectTypeDefs.add(getPayloadTypeDef(type.name));
            this.resolvers.set(`delete${type.name}`, deleteResolver(this.dataResolver));
            // DELETE MANY
            const deleteManyInputName = `DeleteMany${pluralize(type.name)}MutationInput`;
            const deleteManyInput = new graphql.GraphQLInputObjectType({
                name: deleteManyInputName,
                fields: {
                    where: { type: new graphql.GraphQLNonNull(generator.generateWhereInput(this.dataResolver.getFeatures().logicalOperators)) },
                    clientMutationId: { type: graphql.GraphQLString }
                }
            });
            this.currInputObjectTypes.set(deleteManyInputName, deleteManyInput);
            const manyArgs = {};
            manyArgs['input'] = {
                type: new graphql.GraphQLNonNull(deleteManyInput)
            };
            this.fields[`deleteMany${pluralize(type.name)}`] = {
                type: 'BatchPayload',
                args: manyArgs
            };
            this.resolvers.set(`deleteMany${pluralize(type.name)}`, (_root, _args, _context, _info) => __awaiter(this, void 0, void 0, function* () {
                let count = 0;
                const clientMutationId = _args.input && _args.input.clientMutationId ? _args.input.clientMutationId : '';
                const filter = _args.input && _args.input.where ? _args.input.where : '';
                if (filter) {
                    const schemaType = this.schema.getType(type.name);
                    const options = parseFilter(filter, schemaType);
                    let fortuneReturn = yield this.dataResolver.find(type.name, null, options, { context: _context, info: _info });
                    fortuneReturn = fortuneReturn.filter(element => element !== null && element !== undefined);
                    count = fortuneReturn.length;
                    if (count > 0) {
                        fortuneReturn = fortuneReturn.map((value) => {
                            return value.id;
                        });
                        yield this.dataResolver.delete(type.name, fortuneReturn, { context: _context, info: _info });
                    }
                }
                return {
                    count,
                    clientMutationId
                };
            }));
        });
    }
    getResolvers() {
        return new Map([[this.objectName, this.resolvers]]);
    }
    getFieldsOnObject() {
        return new Map([[this.objectName, this.fields]]);
    }
}

class GenerateGetAll {
    constructor(dataResolver, objectName, types, $schema, $currInputObjectTypes, $schemaInfo, $relations) {
        this.dataResolver = dataResolver;
        this.objectName = objectName;
        this.types = types;
        this.schema = $schema;
        this.currInputObjectTypes = $currInputObjectTypes;
        this.schemaInfo = $schemaInfo;
        this.relations = $relations;
        this.fields = {};
        this.resolvers = new Map();
        this.generate();
    }
    generate() {
        this.types.forEach(type => {
            const schemaType = this.schema.getType(type.name);
            const generator = new InputGenerator(schemaType, null, this.currInputObjectTypes, this.schemaInfo, this.schema, this.relations);
            const args = Object.assign({
                where: { type: generator.generateWhereInput(this.dataResolver.getFeatures().logicalOperators) },
                orderBy: { type: generator.generateOrderByInput() }
            }, queryArgs, getRootMatchFields(this.currInputObjectTypes.get(`${type.name}MatchInput`)));
            const fieldName = `${lodash.camelCase(pluralize(type.name))}`;
            this.fields[fieldName] = {
                type: `[${type.name}!]!`,
                args
            };
            this.resolvers.set(fieldName, getAllResolver(this.dataResolver, this.schema, type));
        });
        // basic node query
        this.fields['node'] = {
            description: 'Fetches an object given its ID',
            type: 'Node',
            args: {
                id: {
                    description: 'The ID of an object',
                    type: 'ID!'
                }
            }
        };
        this.resolvers.set('node', (_root, _args, _context, _info) => __awaiter(this, void 0, void 0, function* () {
            const id = _args.id;
            const fortuneReturn = yield this.dataResolver.find('Node', [id], undefined, { context: _context, info: _info });
            if (fortuneReturn) {
                const cache = new Map();
                cache.set(id, fortuneReturn);
                return {
                    fortuneReturn: fortuneReturn,
                    cache: cache,
                    __typename: fortuneReturn.__typename
                };
            }
            else {
                return null;
            }
        }));
    }
    getResolvers() {
        return new Map([[this.objectName, this.resolvers]]);
    }
    getFieldsOnObject() {
        return new Map([[this.objectName, this.fields]]);
    }
}

class SchemaInfoBuilder {
    constructor(schema) {
        this.schema = schema;
    }
    getSchemaInfo() {
        if (!this.schemaInfo) {
            this.schemaInfo = this.buildSchemaInfo(this.schema);
        }
        return this.schemaInfo;
    }
    addDirectiveFromAST(astDirective, schemaInfo, path) {
        const name = astDirective.name.value;
        const args = [];
        lodash.each(astDirective.arguments, arg => {
            args.push(Object.assign({ name: arg.name.value }, lodash.omit(arg.value, ['loc'])));
        });
        const directives = lodash.get(schemaInfo, path) ? lodash.get(schemaInfo, path) : [];
        directives.push({ name: name, args: args });
        lodash.set(schemaInfo, path, directives);
    }
    buildSchemaInfo(schema) {
        const originalSchemaInfo = graphql.introspectionFromSchema(schema, { descriptions: true });
        let schemaInfo = originalSchemaInfo;
        schemaInfo = lodash.omitBy(schemaInfo.__schema.types, (value) => {
            return lodash.startsWith(value.name, '__') || lodash.includes(['Boolean', 'String', 'ID', 'Int', 'Float'], value.name);
        });
        schemaInfo = lodash.mapKeys(schemaInfo, (type) => type.name);
        lodash.each(lodash.keys(schemaInfo), (typeName) => {
            const type = schemaInfo[typeName];
            // directives on type
            lodash.each(lodash.get(schema.getType(typeName), 'astNode.directives'), (astDirective) => {
                this.addDirectiveFromAST(astDirective, schemaInfo, `${typeName}.directives`);
            });
            // directives on fields
            lodash.each(lodash.get(schema.getType(typeName), 'astNode.fields'), (field) => {
                const fieldName = field.name.value;
                lodash.each(lodash.get(field, 'directives'), (astDirective) => {
                    const fieldIndex = lodash.findIndex(lodash.get(schemaInfo, `${typeName}.fields`), { 'name': fieldName });
                    this.addDirectiveFromAST(astDirective, schemaInfo, `${typeName}.fields[${fieldIndex}].directives`);
                });
            });
            // metadata on type
            lodash.set(schemaInfo, `${typeName}.metadata`, lodash.omit(lodash.get(schema, `_typeMap.${typeName}`), ['astNode', 'name', 'description', 'extensionASTNodes', 'isTypeOf', '_fields', '_interfaces', '_typeConfig', 'getFields', 'getInterfaces', 'toString', 'inspect', 'toJSON', '_enumConfig', 'getValue', 'getValues', 'parseLiteral', 'parseValue', 'getValue', 'serialize', '_getNameLookup', '_getValueLookup', '_values', 'resolveType', 'getTypes', '_types']));
            // metadata of fields
            lodash.each(lodash.get(schema, `_typeMap.${typeName}._fields`), (field) => {
                const fieldIndex = lodash.findIndex(lodash.get(schemaInfo, `${typeName}.fields`), { 'name': field.name });
                lodash.set(schemaInfo, `${typeName}.fields[${fieldIndex}].metadata`, lodash.omit(field, ['type', 'description', 'args', 'deprecationReason', 'astNode', 'isDeprecated', 'name']));
            });
            // add unions to types
            if (type.kind === 'UNION') {
                lodash.each(type.possibleTypes, possibleType => {
                    schemaInfo[possibleType.name].unions = schemaInfo[possibleType.name].unions ? schemaInfo[possibleType.name].unions : [];
                    schemaInfo[possibleType.name].unions = lodash.concat(schemaInfo[possibleType.name].unions, [{ kind: type.kind, name: type.name, ofType: type.ofType }]);
                });
            }
        });
        return schemaInfo;
    }
}

class GenerateGetOne {
    constructor(dataResolver, objectName, types, $schema, $currInputObjectTypes, $schemaInfo, $relations, $getAll) {
        this.dataResolver = dataResolver;
        this.objectName = objectName;
        this.types = types;
        this.schema = $schema;
        this.currInputObjectTypes = $currInputObjectTypes;
        this.schemaInfo = $schemaInfo;
        this.relations = $relations;
        this.fields = {};
        this.resolvers = new Map();
        this.getAllResolvers = $getAll && $getAll.resolvers ? $getAll.resolvers : new Map();
        this.generate();
    }
    generate() {
        this.types.forEach(type => {
            const schemaType = this.schema.getType(type.name);
            const generator = new InputGenerator(schemaType, null, this.currInputObjectTypes, this.schemaInfo, this.schema, this.relations);
            const args = Object.assign({
                where: { type: generator.generateWhereUniqueInput() }
            }, getRootMatchFields(generator.generateWhereUniqueInput()));
            const fieldName = `${lodash.camelCase(type.name)}`;
            const allFieldName = `${lodash.camelCase(pluralize(type.name))}`;
            this.fields[fieldName] = {
                type: `${type.name}`,
                args
            };
            const allResolver = this.getAllResolvers.get(allFieldName) || getAllResolver(this.dataResolver, this.schema, type);
            this.resolvers.set(fieldName, (root, args, context, info) => __awaiter(this, void 0, void 0, function* () {
                if (lodash.isEmpty(args)) {
                    throw new graphql.GraphQLError('Singular queries must have an argument');
                }
                let resolveResult = yield allResolver.apply(this, [root, args, context, info]);
                if (lodash.isArray(resolveResult)) {
                    resolveResult = resolveResult.length > 0 ? resolveResult[0] : null;
                }
                return resolveResult;
            }));
        });
    }
    getResolvers() {
        return new Map([[this.objectName, this.resolvers]]);
    }
    getFieldsOnObject() {
        return new Map([[this.objectName, this.fields]]);
    }
}

class GenerateMigrations {
    constructor($genie, $currOutputObjectTypeDefs) {
        this.resolvers = new Map();
        this.fieldsOnObject = new Map();
        this.genie = $genie;
        this.currOutputObjectTypeDefs = $currOutputObjectTypeDefs;
        this.generate();
    }
    generate() {
        this.fieldsOnObject.set('Query', {
            'exportData': {
                description: 'Returns data in the database which can be sent to importData',
                type: GraphQLJSON,
                args: {
                    types: {
                        description: 'List of the GraphQL Object Types you want data for. If null or blank all data will be returned',
                        type: new graphql.GraphQLList(graphql.GraphQLString)
                    }
                }
            }
        });
        const exportDataResolver = new Map();
        exportDataResolver.set('exportData', (_root, args, context, _info) => __awaiter(this, void 0, void 0, function* () {
            return yield this.genie.getRawData(args.types || [], context);
        }));
        this.resolvers.set('Query', exportDataResolver);
        this.currOutputObjectTypeDefs.add(`
			type ImportDataPayload {
				data: JSON,
				unalteredData: JSON,
				missingData: JSON
			}
		`);
        this.currOutputObjectTypeDefs.add(`
			input ConditionsInput {
				id: [String]!,
				conditions: JSON!
			}
		`);
        this.fieldsOnObject.set('Mutation', {
            'importData': {
                type: 'ImportDataPayload',
                args: {
                    data: {
                        type: new graphql.GraphQLNonNull(new graphql.GraphQLList(GraphQLJSON))
                    },
                    merge: {
                        type: graphql.GraphQLBoolean,
                        description: `If false every object will create a new object, the id won't be preserved from the current data but relationships will still be built as they were in the provided data.
						If true data will be merged based on ID, with new entries only being created if the given id does not exist already. Provided id will be used for creating data as well.
						Note when merging list fields by default the array in the provided data will replace the existing data array. If you don't want to do that instead of providing an array you can provide an object with fields for push and pull or set. `
                    },
                    defaultTypename: {
                        type: graphql.GraphQLString,
                        descriptions: 'Must be provided if every object in data does not have a `__typename` property or ids with the typename encoded'
                    },
                    conditions: {
                        type: '[ConditionsInput]',
                        descriptions: 'Conditions can be used to only update records if they are met'
                    }
                }
            }
        });
        const importDataResolver = new Map();
        importDataResolver.set('importData', (_root, args, context, _info) => __awaiter(this, void 0, void 0, function* () {
            return yield this.genie.importRawData(args.data, args.merge, args.defaultTypename, context, args.conditions);
        }));
        this.resolvers.set('Mutation', importDataResolver);
    }
    getResolvers() {
        return this.resolvers;
    }
    getFieldsOnObject() {
        return this.fieldsOnObject;
    }
}

class GraphQLGenie {
    constructor(options) {
        this.config = {
            generateGetOne: true,
            generateGetAll: true,
            generateCreate: true,
            generateUpdate: true,
            generateDelete: true,
            generateUpsert: true,
            generateConnections: true,
            generateMigrations: true
        };
        this.validate = () => {
            const typeMap = this.schema.getTypeMap();
            Object.keys(typeMap).forEach(name => {
                const type = typeMap[name];
                if (graphql.isObjectType(type) && !type.name.includes('__') && !(type.name.toLowerCase() === 'query') && !(type.name.toLowerCase() === 'mutation') && !(type.name.toLowerCase() === 'subscription')) {
                    if (type.name.endsWith('Connection')) {
                        throw new Error(`${type.name} is invalid because it ends with Connection which could intefere with necessary generated types and genie logic`);
                    }
                    else if (type.name.endsWith('Edge')) {
                        throw new Error(`${type.name} is invalid because it ends with Edge which could intefere with necessary generated types and genie logic`);
                    }
                    else if (this.config.generateConnections && type.name === 'PageInfo') {
                        throw new Error(`${type.name} is invalid. PageInfo type is auto generated for connections`);
                    }
                }
            });
        };
        this.init = () => {
            this.generators = [];
            this.schemaInfoBuilder = new SchemaInfoBuilder(this.schema);
            this.schemaInfo = this.schemaInfoBuilder.getSchemaInfo();
            this.relations = computeRelations(this.schemaInfo);
            this.graphQLFortune = new FortuneGraph(this.fortuneOptions, this.schemaInfo, this.fortuneRecordTypeDefinitions);
            this.buildQueries();
            this.buildResolvers();
            this.plugins.forEach(plugin => {
                const pluginResult = plugin(this);
                if (pluginResult && lodash.isFunction(pluginResult.then)) {
                    throw new Error('You must use call .useAsync for plugins that are asynchronous');
                }
            });
            this.schema = this.schemaBuilder.getSchema();
        };
        this.buildResolvers = () => {
            lodash.forOwn(this.schemaInfo, (type, name) => {
                const fieldResolvers = new Map();
                const schemaType = this.schema.getType(type.name);
                if (graphql.isObjectType(schemaType) && name !== 'Query' && name !== 'Mutation' && name !== 'Subscription') {
                    const fieldMap = schemaType.getFields();
                    lodash.forOwn(type.fields, (field) => {
                        const graphQLfield = fieldMap[field.name];
                        const returnConnection = getReturnType(graphQLfield.type).endsWith('Connection');
                        fieldResolvers.set(field.name, getTypeResolver(this.graphQLFortune, this.schema, field, returnConnection));
                    });
                    this.schema = this.schemaBuilder.setResolvers(name, fieldResolvers);
                }
            });
        };
        this.buildQueries = () => {
            const nodeNames = this.getModelTypes();
            const nodeTypes = [];
            nodeNames.forEach(result => {
                nodeTypes.push(this.schemaInfo[result.name]);
            });
            const currInputObjectTypes = new Map();
            const currOutputObjectTypeDefs = new Set();
            let getAll;
            if (this.config.generateGetAll) {
                getAll = new GenerateGetAll(this.graphQLFortune, 'Query', nodeTypes, this.schema, currInputObjectTypes, this.schemaInfo, this.relations);
                this.generators.push(getAll);
            }
            if (this.config.generateGetOne) {
                this.generators.push(new GenerateGetOne(this.graphQLFortune, 'Query', nodeTypes, this.schema, currInputObjectTypes, this.schemaInfo, this.relations, getAll));
            }
            if (this.config.generateConnections) {
                this.generators.push(new GenerateConnections(this.graphQLFortune, 'Query', nodeTypes, this.schema, currOutputObjectTypeDefs, currInputObjectTypes, this.schemaInfo, this.relations));
            }
            if (this.config.generateCreate) {
                this.generators.push(new GenerateCreate(this.graphQLFortune, 'Mutation', nodeTypes, this.config, currInputObjectTypes, currOutputObjectTypeDefs, this.schemaInfo, this.schema, this.relations));
            }
            if (this.config.generateUpdate) {
                this.generators.push(new GenerateUpdate(this.graphQLFortune, 'Mutation', nodeTypes, this.config, currInputObjectTypes, currOutputObjectTypeDefs, this.schemaInfo, this.schema, this.relations));
            }
            if (this.config.generateUpsert) {
                this.generators.push(new GenerateUpsert(this.graphQLFortune, 'Mutation', nodeTypes, this.config, currInputObjectTypes, currOutputObjectTypeDefs, this.schemaInfo, this.schema, this.relations));
            }
            if (this.config.generateDelete) {
                this.generators.push(new GenerateDelete(this.graphQLFortune, 'Mutation', nodeTypes, this.config, currInputObjectTypes, currOutputObjectTypeDefs, this.schemaInfo, this.schema, this.relations));
            }
            if (this.config.generateMigrations) {
                this.generators.push(new GenerateMigrations(this, currOutputObjectTypeDefs));
            }
            let newTypes = '';
            currInputObjectTypes.forEach(inputObjectType => {
                // console.log(printType(inputObjectType));
                newTypes += graphql.printType(inputObjectType) + '\n';
            });
            currOutputObjectTypeDefs.forEach(newType => {
                newTypes += newType + '\n';
            });
            const fieldsOnObject = new Map();
            const resolvers = new Map();
            // merge maps and compute new input types
            this.generators.forEach(generator => {
                generator.getFieldsOnObject().forEach((fields, objectName) => {
                    fieldsOnObject.set(objectName, lodash.assign({}, fieldsOnObject.get(objectName), fields));
                });
                const generatorResolvers = generator.getResolvers();
                generatorResolvers.forEach((resolver, name) => {
                    if (!resolvers.has(name)) {
                        resolvers.set(name, new Map());
                    }
                    resolvers.set(name, new Map([...resolvers.get(name), ...resolver]));
                });
            });
            fieldsOnObject.forEach((fields, objName) => {
                newTypes += graphql.printType(new graphql.GraphQLObjectType({ name: objName, fields: fields })) + '\n';
            });
            // console.log(newTypes);
            this.schema = this.schemaBuilder.addTypeDefsToSchema(newTypes);
            resolvers.forEach((resolverMap, name) => {
                this.schemaBuilder.setResolvers(name, resolverMap);
            });
            this.schema = this.schemaBuilder.getSchema();
        };
        this.use = (plugin) => {
            const pluginResult = plugin(this);
            if (pluginResult && lodash.isFunction(pluginResult.then)) {
                throw new Error('You must use call .useAsync for plugins that are asynchronous');
            }
            this.schema = this.schemaBuilder.getSchema();
            return this;
        };
        this.useAsync = (plugin) => __awaiter(this, void 0, void 0, function* () {
            const pluginResult = plugin(this);
            if (pluginResult && lodash.isFunction(pluginResult.then)) {
                yield pluginResult;
            }
            this.schema = this.schemaBuilder.getSchema();
            return this;
        });
        this.getSchema = () => {
            return this.schemaBuilder.getSchema();
        };
        this.getDataResolver = () => {
            return this.graphQLFortune;
        };
        this.getSchemaBuilder = () => {
            return this.schemaBuilder;
        };
        this.printSchema = () => {
            return this.schemaBuilder.printSchemaWithDirectives();
        };
        this.mapIdsToCreatedIds = (currIDs, objectsMap) => {
            if (currIDs) {
                // tslint:disable-next-line:prefer-conditional-expression
                if (lodash.isArray(currIDs)) {
                    if (lodash.isPlainObject(currIDs[0])) {
                        currIDs = currIDs.map(element => element && element.id ? element.id : element);
                    }
                    currIDs = currIDs.map(currID => objectsMap.has(currID) && objectsMap.get(currID)['id'] ? objectsMap.get(currID)['id'] : currID);
                }
                else {
                    // handle in case it's the full object not just id
                    if (lodash.isPlainObject(currIDs) && currIDs.id) {
                        currIDs = currIDs.id;
                    }
                    currIDs = objectsMap.has(currIDs) && objectsMap.get(currIDs)['id'] ? objectsMap.get(currIDs)['id'] : currIDs;
                }
            }
            return currIDs;
        };
        this.importRawData = (data, merge = false, defaultTypename, context, conditions) => __awaiter(this, void 0, void 0, function* () {
            const meta = context ? { context } : undefined;
            conditions = conditions && merge ? conditions : [];
            // altered data
            const alteredData = new Map();
            // there is a condition but nothing with this id even exists
            const missingIds = [];
            const missingData = [];
            // didn't meet the condition
            const unalteredData = [];
            const userTypes = this.getUserTypes();
            const conditionsMap = new Map();
            conditions.forEach(condition => {
                if (!lodash.isEmpty(condition.conditions)) {
                    const ids = lodash.isArray(condition.id) ? condition.id : [condition.id];
                    ids.forEach(id => {
                        if (!conditionsMap.has(id)) {
                            conditionsMap.set(id, []);
                        }
                        conditionsMap.get(id).push(condition.conditions);
                    });
                }
            });
            const createPromises = [];
            let createData = data;
            const objectsMap = new Map();
            data = data.map((object, index) => {
                if (lodash.isEmpty(object)) {
                    throw new Error('Data has a null or empty object at index ' + index);
                }
                let typeName = object.__typename;
                let idTypename;
                if (!typeName && lodash.isString(object.id)) {
                    try {
                        idTypename = abab_1(object.id).split(':')[1];
                    }
                    catch (e) {
                        // empty by design
                    }
                }
                typeName = idTypename && !typeName ? idTypename : typeName;
                typeName = typeName ? typeName : defaultTypename;
                if (!typeName) {
                    throw new Error('Every object must have a __typename or defaultTypeName must be provided');
                }
                else if (!userTypes.includes(typeName)) {
                    throw new Error(`Bad typename in data, ${typeName} does not exist in schema`);
                }
                object.__typename = typeName;
                object.id = object.id || this.graphQLFortune.computeId(typeName);
                // make sure we parse the values
                const schemaType = this.schema.getType(typeName);
                const fieldMap = schemaType.getFields();
                const objectFields = Object.keys(object);
                objectFields.forEach(fieldName => {
                    const schemaField = fieldMap[fieldName];
                    if (schemaField) {
                        const namedType = graphql.getNamedType(schemaField.type);
                        if (graphql.isScalarType(namedType)) {
                            let currVal = object[fieldName];
                            const scalarType = this.schema.getType(namedType.name);
                            if (lodash.isArray(currVal) && !lodash.isEmpty(currVal)) {
                                currVal = currVal.map((val) => {
                                    if (val && lodash.isString(val)) {
                                        val = scalarType.parseValue(val);
                                    }
                                    return val;
                                });
                            }
                            else if (lodash.isString(currVal)) {
                                currVal = scalarType.parseValue(currVal);
                            }
                            object[fieldName] = currVal;
                        }
                    }
                });
                return object;
            });
            if (merge) {
                createData = [];
                const findPromises = [];
                data.forEach(object => {
                    const typeName = object.__typename;
                    findPromises.push(this.graphQLFortune.find(typeName, object.id));
                });
                const findResults = yield Promise.all(findPromises);
                findResults.forEach((result, index) => {
                    if (lodash.isEmpty(result)) {
                        if (conditionsMap.has(data[index].id)) {
                            missingIds.push(data[index].id);
                            missingData.push(data[index]);
                        }
                        else {
                            createData.push(data[index]);
                        }
                    }
                    else {
                        objectsMap.set(result.id, result);
                    }
                });
            }
            createData.forEach(object => {
                const typeName = object.__typename;
                const schemaType = this.schema.getType(typeName);
                const fieldMap = schemaType.getFields();
                const objectFields = Object.keys(object);
                const record = {};
                if (merge && object.id) {
                    record.id = object.id;
                }
                objectFields.forEach(fieldName => {
                    const schemaField = fieldMap[fieldName];
                    const currVal = object[fieldName];
                    // only add if truthy and not empty
                    let addToRecord = false;
                    if (lodash.isArray(currVal) && !lodash.isEmpty(currVal)) {
                        addToRecord = true;
                    }
                    else if (currVal !== undefined && currVal !== null) {
                        addToRecord = true;
                    }
                    if (addToRecord && fieldName !== 'id' && schemaField) {
                        const schemaFieldType = graphql.getNamedType(schemaField.type);
                        if (graphql.isScalarType(schemaFieldType)) {
                            record[fieldName] = currVal;
                        }
                    }
                });
                createPromises.push(new Promise((resolve, reject) => {
                    this.graphQLFortune.create(typeName, record, meta).then(createdObj => {
                        objectsMap.set(object.id, createdObj);
                        alteredData.set(object.id, createdObj);
                        resolve(createdObj);
                    }).catch(reason => {
                        reject(reason);
                    });
                }));
            });
            yield Promise.all(createPromises);
            const updatePromies = [];
            // do the updates
            yield Promise.all(data.map((object) => __awaiter(this, void 0, void 0, function* () {
                if (missingIds.includes(object.id)) {
                    return;
                }
                const typeName = object.__typename;
                const schemaType = this.schema.getType(typeName);
                const existingData = objectsMap.get(object.id);
                let objMeetsConditions = true;
                if (conditionsMap.has(object.id)) {
                    const allConditions = yield Promise.all(conditionsMap.get(object.id).map((condition) => __awaiter(this, void 0, void 0, function* () {
                        return yield meetsConditions(condition, typeName, schemaType, existingData, this.graphQLFortune, lodash.get(context, 'context', context), lodash.get(context, 'info'));
                    })));
                    objMeetsConditions = !allConditions.includes(false);
                }
                if (!objMeetsConditions) {
                    unalteredData.push(existingData);
                }
                else {
                    let update = {};
                    const objectFields = Object.keys(object);
                    const fieldMap = schemaType.getFields();
                    objectFields.forEach(fieldName => {
                        const schemaField = fieldMap[fieldName];
                        if (schemaField) {
                            const schemaFieldType = graphql.getNamedType(schemaField.type);
                            if (merge || (!graphql.isScalarType(schemaFieldType) && !graphql.isEnumType(schemaFieldType))) {
                                let currValue = object[fieldName];
                                if (!lodash.isEmpty(currValue)) {
                                    if (!graphql.isScalarType(schemaFieldType) && !graphql.isEnumType(schemaFieldType)) {
                                        if (lodash.isArray(currValue)) {
                                            // if it's an array then set
                                            // use new ids if found
                                            currValue = this.mapIdsToCreatedIds(currValue, objectsMap);
                                            update[fieldName] = { set: currValue };
                                        }
                                        else {
                                            // if not an array we need to handle scalars vs objects with push/pull/set
                                            // handle in case it's the full object not just id
                                            if (lodash.isPlainObject(currValue) && currValue.id) {
                                                currValue = currValue.id;
                                            }
                                            // if it's not an object than it's just an id so we should set it
                                            // tslint:disable-next-line:prefer-conditional-expression
                                            if (!lodash.isPlainObject(currValue)) {
                                                // use the new object id
                                                update[fieldName] = this.mapIdsToCreatedIds(currValue, objectsMap);
                                            }
                                            else {
                                                // it's an object so it is push/pull/set
                                                if (currValue.push) {
                                                    currValue.push = this.mapIdsToCreatedIds(currValue.push, objectsMap);
                                                }
                                                if (currValue.pull) {
                                                    currValue.pull = this.mapIdsToCreatedIds(currValue.pull, objectsMap);
                                                }
                                                if (currValue.set) {
                                                    currValue.set = this.mapIdsToCreatedIds(currValue.set, objectsMap);
                                                }
                                                update[fieldName] = currValue;
                                            }
                                        }
                                    }
                                    else if (!lodash.isPlainObject(currValue)) {
                                        currValue = this.mapIdsToCreatedIds(currValue, objectsMap);
                                        // not an object and a scalar but lets check if it's an array
                                        update[fieldName] = lodash.isArray(currValue) ? { set: currValue } : currValue;
                                    }
                                    else {
                                        // it's an object so it is push/pull/set
                                        if (currValue.push) {
                                            currValue.push = this.mapIdsToCreatedIds(currValue.push, objectsMap);
                                        }
                                        if (currValue.pull) {
                                            currValue.pull = this.mapIdsToCreatedIds(currValue.pull, objectsMap);
                                        }
                                        if (currValue.set) {
                                            currValue.set = this.mapIdsToCreatedIds(currValue.set, objectsMap);
                                        }
                                        update[fieldName] = currValue;
                                    }
                                }
                                else {
                                    update[fieldName] = graphql.isListType(graphql.getNullableType(schemaField.type)) ? { set: currValue } : currValue;
                                }
                            }
                        }
                    });
                    if (!lodash.isEmpty(update)) {
                        update.id = objectsMap.get(object.id).id;
                        update = this.graphQLFortune.generateUpdates(update);
                        updatePromies.push(new Promise((resolve, reject) => {
                            this.graphQLFortune.update(typeName, update, meta, { fortuneFormatted: true }).then(updatedObj => {
                                alteredData.set(object.id, updatedObj);
                                resolve(updatedObj);
                            }).catch(reason => {
                                reject(reason);
                            });
                        }));
                    }
                }
            })));
            yield Promise.all(updatePromies);
            return {
                data: [...alteredData.values()],
                unalteredData,
                missingData
            };
        });
        this.getUserTypes = () => {
            const introspection = graphql.introspectionFromSchema(this.schema, { descriptions: false });
            const types = introspection.__schema.types;
            const typeNames = types.filter(type => type.kind === 'OBJECT' && this.schemaBuilder.isUserTypeByName(type.name)).map(type => type.name);
            return typeNames;
        };
        this.getModelTypes = () => {
            return graphql.introspectionFromSchema(this.schema, { descriptions: false }).__schema.types.filter(v => { var _a; return ((_a = v.interfaces) === null || _a === void 0 ? void 0 : _a.some(v => v.name === 'Node')) && v.name !== 'Node'; });
        };
        this.getRawData = (types = [], context) => __awaiter(this, void 0, void 0, function* () {
            const meta = context ? { context } : undefined;
            let nodes = [];
            if (lodash.isEmpty(types)) {
                types = this.getUserTypes();
            }
            if (types) {
                const promises = [];
                types.forEach(typeName => {
                    promises.push(new Promise((resolve, reject) => {
                        this.graphQLFortune.find(typeName, undefined, undefined, meta).then(fortuneData => {
                            // make sure we serialize the values
                            const schemaType = this.getSchema().getType(typeName);
                            const fieldMap = schemaType.getFields();
                            if (lodash.isEmpty(fortuneData)) {
                                resolve(fortuneData);
                                return;
                            }
                            fortuneData = fortuneData.map((record) => {
                                const objectFields = Object.keys(record);
                                objectFields.forEach(fieldName => {
                                    const schemaField = fieldMap[fieldName];
                                    if (schemaField) {
                                        const namedType = graphql.getNamedType(schemaField.type);
                                        let currVal = record[fieldName];
                                        if (graphql.isScalarType(namedType)) {
                                            const scalarType = this.getSchema().getType(namedType.name);
                                            if (lodash.isArray(currVal)) {
                                                currVal = currVal.map((val) => {
                                                    if (val && !lodash.isString(val) && !lodash.isNumber(val)) {
                                                        val = scalarType.serialize(val);
                                                    }
                                                    return val;
                                                });
                                            }
                                            else if (currVal && !lodash.isString(currVal) && !lodash.isNumber(currVal)) {
                                                currVal = scalarType.serialize(currVal);
                                            }
                                            record[fieldName] = currVal;
                                        }
                                    }
                                });
                                return record;
                            });
                            resolve(fortuneData);
                        }).catch(reason => { reject(reason); });
                    }));
                });
                const allData = yield Promise.all(promises);
                nodes = [].concat.apply([], allData); // flatten
            }
            return nodes;
        });
        this.getFragmentTypes = () => {
            const introspection = graphql.introspectionFromSchema(this.schema, { descriptions: false });
            const types = introspection.__schema.types;
            // here we're filtering out any type information unrelated to unions or interfaces
            if (types) {
                const filteredData = types.filter(type => {
                    return type['possibleTypes'] !== null;
                });
                lodash.set(introspection, '__schema.types', filteredData);
            }
            return introspection;
        };
        /**
         * This method does not need to be called manually, it is automatically called upon the first request if it is not connected already.
         * However, it may be useful if manually reconnect is needed.
         * The resolved value is the instance itself.
         * @returns Promise<GraphQLGenie>
         */
        this.connect = () => __awaiter(this, void 0, void 0, function* () {
            yield this.graphQLFortune.getStore().connect();
            return this;
        });
        /**
         * Close adapter connection, and reset connection state.
         * The resolved value is the instance itself.
         * @returns Promise<GraphQLGenie>
         */
        this.disconnect = () => __awaiter(this, void 0, void 0, function* () {
            yield this.graphQLFortune.getStore().disconnect();
            return this;
        });
        this.fortuneOptions = options.fortuneOptions ? options.fortuneOptions : {};
        this.fortuneOptions.settings = this.fortuneOptions.settings ? this.fortuneOptions.settings : {};
        if (!this.fortuneOptions.settings.hasOwnProperty('enforceLinks')) {
            this.fortuneOptions.settings.enforceLinks = true;
        }
        this.fortuneRecordTypeDefinitions = options.fortuneRecordTypeDefinitions;
        if (options.generatorOptions) {
            this.config = Object.assign(this.config, options.generatorOptions);
        }
        if (options.schemaBuilder) {
            this.schemaBuilder = options.schemaBuilder;
        }
        else if (options.typeDefs) {
            this.schemaBuilder = new GraphQLSchemaBuilder(options.typeDefs, this.config);
        }
        else {
            throw new Error('Need a schemaBuilder or typeDefs');
        }
        this.plugins = lodash.isArray(options.plugins) ? options.plugins : options.plugins ? [options.plugins] : [];
        this.schema = this.schemaBuilder.getSchema();
        this.validate();
        this.init();
    }
}

exports.Connection = Connection;
exports.FindByUniqueError = FindByUniqueError;
exports.GraphQLGenie = GraphQLGenie;
exports.GraphQLSchemaBuilder = GraphQLSchemaBuilder;
exports.InputGenerator = InputGenerator;
exports.filterNested = filterNested;
exports.getRecordFromResolverReturn = getRecordFromResolverReturn;
exports.getReturnType = getReturnType;
exports.parseFilter = parseFilter;
exports.typeIsList = typeIsList;
