"use strict";
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
const electron = require("electron");
const fs = require("fs");
const util2 = require("util");
const process2 = require("process");
const os = require("os");
const tty = require("tty");
const byteToHex = [];
for (let i2 = 0; i2 < 256; ++i2) {
  byteToHex.push((i2 + 256).toString(16).slice(1));
}
function unsafeStringify(arr, offset = 0) {
  return (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase();
}
let getRandomValues;
const rnds8 = new Uint8Array(16);
function rng() {
  if (!getRandomValues) {
    if (typeof crypto === "undefined" || !crypto.getRandomValues) {
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    }
    getRandomValues = crypto.getRandomValues.bind(crypto);
  }
  return getRandomValues(rnds8);
}
const randomUUID = typeof crypto !== "undefined" && crypto.randomUUID && crypto.randomUUID.bind(crypto);
const native = { randomUUID };
function _v4(options, buf, offset) {
  var _a;
  options = options || {};
  const rnds = options.random ?? ((_a = options.rng) == null ? void 0 : _a.call(options)) ?? rng();
  if (rnds.length < 16) {
    throw new Error("Random bytes length must be >= 16");
  }
  rnds[6] = rnds[6] & 15 | 64;
  rnds[8] = rnds[8] & 63 | 128;
  return unsafeStringify(rnds);
}
function v4(options, buf, offset) {
  if (native.randomUUID && true && !options) {
    return native.randomUUID();
  }
  return _v4(options);
}
var define_process_env_default = {};
var __create = Object.create;
var __defProp2 = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp2(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  __defProp2(target, "default", { value: mod, enumerable: true }),
  mod
));
var require_tokens = __commonJS({
  "../../node_modules/.pnpm/ret@0.5.0/node_modules/ret/dist/types/tokens.js"(exports$1) {
    Object.defineProperty(exports$1, "__esModule", { value: true });
  }
});
var require_types = __commonJS({
  "../../node_modules/.pnpm/ret@0.5.0/node_modules/ret/dist/types/types.js"(exports$1) {
    Object.defineProperty(exports$1, "__esModule", { value: true });
    exports$1.types = void 0;
    (function(types2) {
      types2[types2["ROOT"] = 0] = "ROOT";
      types2[types2["GROUP"] = 1] = "GROUP";
      types2[types2["POSITION"] = 2] = "POSITION";
      types2[types2["SET"] = 3] = "SET";
      types2[types2["RANGE"] = 4] = "RANGE";
      types2[types2["REPETITION"] = 5] = "REPETITION";
      types2[types2["REFERENCE"] = 6] = "REFERENCE";
      types2[types2["CHAR"] = 7] = "CHAR";
    })(exports$1.types || (exports$1.types = {}));
  }
});
var require_set_lookup = __commonJS({
  "../../node_modules/.pnpm/ret@0.5.0/node_modules/ret/dist/types/set-lookup.js"(exports$1) {
    Object.defineProperty(exports$1, "__esModule", { value: true });
  }
});
var require_types2 = __commonJS({
  "../../node_modules/.pnpm/ret@0.5.0/node_modules/ret/dist/types/index.js"(exports$1) {
    var __createBinding = exports$1 && exports$1.__createBinding || (Object.create ? function(o2, m2, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o2, k2, { enumerable: true, get: function() {
        return m2[k];
      } });
    } : function(o2, m2, k, k2) {
      if (k2 === void 0) k2 = k;
      o2[k2] = m2[k];
    });
    var __exportStar = exports$1 && exports$1.__exportStar || function(m2, exports2) {
      for (var p2 in m2) if (p2 !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p2)) __createBinding(exports2, m2, p2);
    };
    Object.defineProperty(exports$1, "__esModule", { value: true });
    __exportStar(require_tokens(), exports$1);
    __exportStar(require_types(), exports$1);
    __exportStar(require_set_lookup(), exports$1);
  }
});
var require_sets = __commonJS({
  "../../node_modules/.pnpm/ret@0.5.0/node_modules/ret/dist/sets.js"(exports$1) {
    Object.defineProperty(exports$1, "__esModule", { value: true });
    exports$1.anyChar = exports$1.notWhitespace = exports$1.whitespace = exports$1.notInts = exports$1.ints = exports$1.notWords = exports$1.words = void 0;
    var types_1 = require_types2();
    var INTS = () => [{ type: types_1.types.RANGE, from: 48, to: 57 }];
    var WORDS = () => [
      { type: types_1.types.CHAR, value: 95 },
      { type: types_1.types.RANGE, from: 97, to: 122 },
      { type: types_1.types.RANGE, from: 65, to: 90 },
      { type: types_1.types.RANGE, from: 48, to: 57 }
    ];
    var WHITESPACE = () => [
      { type: types_1.types.CHAR, value: 9 },
      { type: types_1.types.CHAR, value: 10 },
      { type: types_1.types.CHAR, value: 11 },
      { type: types_1.types.CHAR, value: 12 },
      { type: types_1.types.CHAR, value: 13 },
      { type: types_1.types.CHAR, value: 32 },
      { type: types_1.types.CHAR, value: 160 },
      { type: types_1.types.CHAR, value: 5760 },
      { type: types_1.types.RANGE, from: 8192, to: 8202 },
      { type: types_1.types.CHAR, value: 8232 },
      { type: types_1.types.CHAR, value: 8233 },
      { type: types_1.types.CHAR, value: 8239 },
      { type: types_1.types.CHAR, value: 8287 },
      { type: types_1.types.CHAR, value: 12288 },
      { type: types_1.types.CHAR, value: 65279 }
    ];
    var NOTANYCHAR = () => [
      { type: types_1.types.CHAR, value: 10 },
      { type: types_1.types.CHAR, value: 13 },
      { type: types_1.types.CHAR, value: 8232 },
      { type: types_1.types.CHAR, value: 8233 }
    ];
    exports$1.words = () => ({ type: types_1.types.SET, set: WORDS(), not: false });
    exports$1.notWords = () => ({ type: types_1.types.SET, set: WORDS(), not: true });
    exports$1.ints = () => ({ type: types_1.types.SET, set: INTS(), not: false });
    exports$1.notInts = () => ({ type: types_1.types.SET, set: INTS(), not: true });
    exports$1.whitespace = () => ({ type: types_1.types.SET, set: WHITESPACE(), not: false });
    exports$1.notWhitespace = () => ({ type: types_1.types.SET, set: WHITESPACE(), not: true });
    exports$1.anyChar = () => ({ type: types_1.types.SET, set: NOTANYCHAR(), not: true });
  }
});
var require_util = __commonJS({
  "../../node_modules/.pnpm/ret@0.5.0/node_modules/ret/dist/util.js"(exports$1) {
    var __createBinding = exports$1 && exports$1.__createBinding || (Object.create ? function(o2, m2, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o2, k2, { enumerable: true, get: function() {
        return m2[k];
      } });
    } : function(o2, m2, k, k2) {
      if (k2 === void 0) k2 = k;
      o2[k2] = m2[k];
    });
    var __setModuleDefault = exports$1 && exports$1.__setModuleDefault || (Object.create ? function(o2, v) {
      Object.defineProperty(o2, "default", { enumerable: true, value: v });
    } : function(o2, v) {
      o2["default"] = v;
    });
    var __importStar = exports$1 && exports$1.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports$1, "__esModule", { value: true });
    exports$1.tokenizeClass = exports$1.strToChars = void 0;
    var types_1 = require_types2();
    var sets = __importStar(require_sets());
    var CTRL = "@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^ ?";
    exports$1.strToChars = (str) => {
      const charsRegex = /(\[\\b\])|(\\)?\\(?:u([A-F0-9]{4})|x([A-F0-9]{2})|c([@A-Z[\\\]^?])|([0tnvfr]))/g;
      return str.replace(charsRegex, (s2, b, lbs, a16, b16, dctrl, eslsh) => {
        if (lbs) {
          return s2;
        }
        let code = b ? 8 : a16 ? parseInt(a16, 16) : b16 ? parseInt(b16, 16) : dctrl ? CTRL.indexOf(dctrl) : {
          0: 0,
          t: 9,
          n: 10,
          v: 11,
          f: 12,
          r: 13
        }[eslsh];
        let c2 = String.fromCharCode(code);
        return /[[\]{}^$.|?*+()]/.test(c2) ? `\\${c2}` : c2;
      });
    };
    exports$1.tokenizeClass = (str, regexpStr) => {
      var _a, _b, _c, _d, _e, _f, _g;
      let tokens = [], rs, c2;
      const regexp = /\\(?:(w)|(d)|(s)|(W)|(D)|(S))|((?:(?:\\)(.)|([^\]\\]))-(((?:\\)])|(((?:\\)?([^\]])))))|(\])|(?:\\)?([^])/g;
      while ((rs = regexp.exec(str)) !== null) {
        const p2 = (_g = (_f = (_e = (_d = (_c = (_b = (_a = rs[1] && sets.words()) !== null && _a !== void 0 ? _a : rs[2] && sets.ints()) !== null && _b !== void 0 ? _b : rs[3] && sets.whitespace()) !== null && _c !== void 0 ? _c : rs[4] && sets.notWords()) !== null && _d !== void 0 ? _d : rs[5] && sets.notInts()) !== null && _e !== void 0 ? _e : rs[6] && sets.notWhitespace()) !== null && _f !== void 0 ? _f : rs[7] && {
          type: types_1.types.RANGE,
          from: (rs[8] || rs[9]).charCodeAt(0),
          to: (c2 = rs[10]).charCodeAt(c2.length - 1)
        }) !== null && _g !== void 0 ? _g : (c2 = rs[16]) && { type: types_1.types.CHAR, value: c2.charCodeAt(0) };
        if (p2) {
          tokens.push(p2);
        } else {
          return [tokens, regexp.lastIndex];
        }
      }
      throw new SyntaxError(`Invalid regular expression: /${regexpStr}/: Unterminated character class`);
    };
  }
});
var require_tokenizer = __commonJS({
  "../../node_modules/.pnpm/ret@0.5.0/node_modules/ret/dist/tokenizer.js"(exports$1) {
    var __createBinding = exports$1 && exports$1.__createBinding || (Object.create ? function(o2, m2, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o2, k2, { enumerable: true, get: function() {
        return m2[k];
      } });
    } : function(o2, m2, k, k2) {
      if (k2 === void 0) k2 = k;
      o2[k2] = m2[k];
    });
    var __setModuleDefault = exports$1 && exports$1.__setModuleDefault || (Object.create ? function(o2, v) {
      Object.defineProperty(o2, "default", { enumerable: true, value: v });
    } : function(o2, v) {
      o2["default"] = v;
    });
    var __importStar = exports$1 && exports$1.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports$1, "__esModule", { value: true });
    exports$1.tokenizer = void 0;
    var util3 = __importStar(require_util());
    var types_1 = require_types2();
    var sets = __importStar(require_sets());
    var captureGroupFirstChar = /^[a-zA-Z_$]$/i;
    var captureGroupChars = /^[a-zA-Z0-9_$]$/i;
    var digit = /\d/;
    exports$1.tokenizer = (regexpStr) => {
      let i2 = 0, c2;
      let start = { type: types_1.types.ROOT, stack: [] };
      let lastGroup = start;
      let last = start.stack;
      let groupStack = [];
      let referenceQueue = [];
      let groupCount = 0;
      const repeatErr = (col) => {
        throw new SyntaxError(`Invalid regular expression: /${regexpStr}/: Nothing to repeat at column ${col - 1}`);
      };
      let str = util3.strToChars(regexpStr);
      while (i2 < str.length) {
        switch (c2 = str[i2++]) {
          case "\\":
            if (i2 === str.length) {
              throw new SyntaxError(`Invalid regular expression: /${regexpStr}/: \\ at end of pattern`);
            }
            switch (c2 = str[i2++]) {
              case "b":
                last.push({ type: types_1.types.POSITION, value: "b" });
                break;
              case "B":
                last.push({ type: types_1.types.POSITION, value: "B" });
                break;
              case "w":
                last.push(sets.words());
                break;
              case "W":
                last.push(sets.notWords());
                break;
              case "d":
                last.push(sets.ints());
                break;
              case "D":
                last.push(sets.notInts());
                break;
              case "s":
                last.push(sets.whitespace());
                break;
              case "S":
                last.push(sets.notWhitespace());
                break;
              default:
                if (digit.test(c2)) {
                  let digits = c2;
                  while (i2 < str.length && digit.test(str[i2])) {
                    digits += str[i2++];
                  }
                  let value = parseInt(digits, 10);
                  const reference = { type: types_1.types.REFERENCE, value };
                  last.push(reference);
                  referenceQueue.push({ reference, stack: last, index: last.length - 1 });
                } else {
                  last.push({ type: types_1.types.CHAR, value: c2.charCodeAt(0) });
                }
            }
            break;
          case "^":
            last.push({ type: types_1.types.POSITION, value: "^" });
            break;
          case "$":
            last.push({ type: types_1.types.POSITION, value: "$" });
            break;
          case "[": {
            let not;
            if (str[i2] === "^") {
              not = true;
              i2++;
            } else {
              not = false;
            }
            let classTokens = util3.tokenizeClass(str.slice(i2), regexpStr);
            i2 += classTokens[1];
            last.push({
              type: types_1.types.SET,
              set: classTokens[0],
              not
            });
            break;
          }
          case ".":
            last.push(sets.anyChar());
            break;
          case "(": {
            let group = {
              type: types_1.types.GROUP,
              stack: [],
              remember: true
            };
            if (str[i2] === "?") {
              c2 = str[i2 + 1];
              i2 += 2;
              if (c2 === "=") {
                group.followedBy = true;
                group.remember = false;
              } else if (c2 === "!") {
                group.notFollowedBy = true;
                group.remember = false;
              } else if (c2 === "<") {
                let name = "";
                if (captureGroupFirstChar.test(str[i2])) {
                  name += str[i2];
                  i2++;
                } else {
                  throw new SyntaxError(`Invalid regular expression: /${regexpStr}/: Invalid capture group name, character '${str[i2]}' after '<' at column ${i2 + 1}`);
                }
                while (i2 < str.length && captureGroupChars.test(str[i2])) {
                  name += str[i2];
                  i2++;
                }
                if (!name) {
                  throw new SyntaxError(`Invalid regular expression: /${regexpStr}/: Invalid capture group name, character '${str[i2]}' after '<' at column ${i2 + 1}`);
                }
                if (str[i2] !== ">") {
                  throw new SyntaxError(`Invalid regular expression: /${regexpStr}/: Unclosed capture group name, expected '>', found '${str[i2]}' at column ${i2 + 1}`);
                }
                group.name = name;
                i2++;
              } else if (c2 === ":") {
                group.remember = false;
              } else {
                throw new SyntaxError(`Invalid regular expression: /${regexpStr}/: Invalid group, character '${c2}' after '?' at column ${i2 - 1}`);
              }
            } else {
              groupCount += 1;
            }
            last.push(group);
            groupStack.push(lastGroup);
            lastGroup = group;
            last = group.stack;
            break;
          }
          case ")":
            if (groupStack.length === 0) {
              throw new SyntaxError(`Invalid regular expression: /${regexpStr}/: Unmatched ) at column ${i2 - 1}`);
            }
            lastGroup = groupStack.pop();
            last = lastGroup.options ? lastGroup.options[lastGroup.options.length - 1] : lastGroup.stack;
            break;
          case "|": {
            if (!lastGroup.options) {
              lastGroup.options = [lastGroup.stack];
              delete lastGroup.stack;
            }
            let stack = [];
            lastGroup.options.push(stack);
            last = stack;
            break;
          }
          case "{": {
            let rs = /^(\d+)(,(\d+)?)?\}/.exec(str.slice(i2)), min, max;
            if (rs !== null) {
              if (last.length === 0) {
                repeatErr(i2);
              }
              min = parseInt(rs[1], 10);
              max = rs[2] ? rs[3] ? parseInt(rs[3], 10) : Infinity : min;
              i2 += rs[0].length;
              last.push({
                type: types_1.types.REPETITION,
                min,
                max,
                value: last.pop()
              });
            } else {
              last.push({
                type: types_1.types.CHAR,
                value: 123
              });
            }
            break;
          }
          case "?":
            if (last.length === 0) {
              repeatErr(i2);
            }
            last.push({
              type: types_1.types.REPETITION,
              min: 0,
              max: 1,
              value: last.pop()
            });
            break;
          case "+":
            if (last.length === 0) {
              repeatErr(i2);
            }
            last.push({
              type: types_1.types.REPETITION,
              min: 1,
              max: Infinity,
              value: last.pop()
            });
            break;
          case "*":
            if (last.length === 0) {
              repeatErr(i2);
            }
            last.push({
              type: types_1.types.REPETITION,
              min: 0,
              max: Infinity,
              value: last.pop()
            });
            break;
          default:
            last.push({
              type: types_1.types.CHAR,
              value: c2.charCodeAt(0)
            });
        }
      }
      if (groupStack.length !== 0) {
        throw new SyntaxError(`Invalid regular expression: /${regexpStr}/: Unterminated group`);
      }
      updateReferences(referenceQueue, groupCount);
      return start;
    };
    function updateReferences(referenceQueue, groupCount) {
      for (const elem of referenceQueue.reverse()) {
        if (groupCount < elem.reference.value) {
          elem.reference.type = types_1.types.CHAR;
          const valueString = elem.reference.value.toString();
          elem.reference.value = parseInt(valueString, 8);
          if (!/^[0-7]+$/.test(valueString)) {
            let i2 = 0;
            while (valueString[i2] !== "8" && valueString[i2] !== "9") {
              i2 += 1;
            }
            if (i2 === 0) {
              elem.reference.value = valueString.charCodeAt(0);
              i2 += 1;
            } else {
              elem.reference.value = parseInt(valueString.slice(0, i2), 8);
            }
            if (valueString.length > i2) {
              const tail = elem.stack.splice(elem.index + 1);
              for (const char of valueString.slice(i2)) {
                elem.stack.push({
                  type: types_1.types.CHAR,
                  value: char.charCodeAt(0)
                });
              }
              elem.stack.push(...tail);
            }
          }
        }
      }
    }
  }
});
var require_sets_lookup = __commonJS({
  "../../node_modules/.pnpm/ret@0.5.0/node_modules/ret/dist/sets-lookup.js"(exports$1) {
    var __createBinding = exports$1 && exports$1.__createBinding || (Object.create ? function(o2, m2, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o2, k2, { enumerable: true, get: function() {
        return m2[k];
      } });
    } : function(o2, m2, k, k2) {
      if (k2 === void 0) k2 = k;
      o2[k2] = m2[k];
    });
    var __setModuleDefault = exports$1 && exports$1.__setModuleDefault || (Object.create ? function(o2, v) {
      Object.defineProperty(o2, "default", { enumerable: true, value: v });
    } : function(o2, v) {
      o2["default"] = v;
    });
    var __importStar = exports$1 && exports$1.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports$1, "__esModule", { value: true });
    exports$1.NOTANYCHAR = exports$1.WHITESPACE = exports$1.WORDS = exports$1.INTS = void 0;
    var Sets = __importStar(require_sets());
    var types_1 = require_types2();
    function setToLookup(tokens) {
      let lookup = {};
      let len = 0;
      for (const token of tokens) {
        if (token.type === types_1.types.CHAR) {
          lookup[token.value] = true;
        }
        if (token.type === types_1.types.RANGE) {
          lookup[`${token.from}-${token.to}`] = true;
        }
        len += 1;
      }
      return {
        lookup: () => Object.assign({}, lookup),
        len
      };
    }
    exports$1.INTS = setToLookup(Sets.ints().set);
    exports$1.WORDS = setToLookup(Sets.words().set);
    exports$1.WHITESPACE = setToLookup(Sets.whitespace().set);
    exports$1.NOTANYCHAR = setToLookup(Sets.anyChar().set);
  }
});
var require_write_set_tokens = __commonJS({
  "../../node_modules/.pnpm/ret@0.5.0/node_modules/ret/dist/write-set-tokens.js"(exports$1) {
    var __createBinding = exports$1 && exports$1.__createBinding || (Object.create ? function(o2, m2, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o2, k2, { enumerable: true, get: function() {
        return m2[k];
      } });
    } : function(o2, m2, k, k2) {
      if (k2 === void 0) k2 = k;
      o2[k2] = m2[k];
    });
    var __setModuleDefault = exports$1 && exports$1.__setModuleDefault || (Object.create ? function(o2, v) {
      Object.defineProperty(o2, "default", { enumerable: true, value: v });
    } : function(o2, v) {
      o2["default"] = v;
    });
    var __importStar = exports$1 && exports$1.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    Object.defineProperty(exports$1, "__esModule", { value: true });
    exports$1.writeSetTokens = exports$1.setChar = void 0;
    var types_1 = require_types2();
    var sets = __importStar(require_sets_lookup());
    function setChar(charCode) {
      return charCode === 94 ? "\\^" : charCode === 92 ? "\\\\" : charCode === 93 ? "\\]" : charCode === 45 ? "\\-" : String.fromCharCode(charCode);
    }
    exports$1.setChar = setChar;
    function isSameSet(set, { lookup, len }) {
      if (len !== set.length) {
        return false;
      }
      const map = lookup();
      for (const elem of set) {
        if (elem.type === types_1.types.SET) {
          return false;
        }
        const key = elem.type === types_1.types.CHAR ? elem.value : `${elem.from}-${elem.to}`;
        if (map[key]) {
          map[key] = false;
        } else {
          return false;
        }
      }
      return true;
    }
    function writeSetTokens(set, isNested = false) {
      if (isSameSet(set.set, sets.INTS)) {
        return set.not ? "\\D" : "\\d";
      }
      if (isSameSet(set.set, sets.WORDS)) {
        return set.not ? "\\W" : "\\w";
      }
      if (set.not && isSameSet(set.set, sets.NOTANYCHAR)) {
        return ".";
      }
      if (isSameSet(set.set, sets.WHITESPACE)) {
        return set.not ? "\\S" : "\\s";
      }
      let tokenString = "";
      for (let i2 = 0; i2 < set.set.length; i2++) {
        const subset = set.set[i2];
        tokenString += writeSetToken(subset);
      }
      const contents = `${set.not ? "^" : ""}${tokenString}`;
      return isNested ? contents : `[${contents}]`;
    }
    exports$1.writeSetTokens = writeSetTokens;
    function writeSetToken(set) {
      if (set.type === types_1.types.CHAR) {
        return setChar(set.value);
      } else if (set.type === types_1.types.RANGE) {
        return `${setChar(set.from)}-${setChar(set.to)}`;
      }
      return writeSetTokens(set, true);
    }
  }
});
var require_reconstruct = __commonJS({
  "../../node_modules/.pnpm/ret@0.5.0/node_modules/ret/dist/reconstruct.js"(exports$1) {
    Object.defineProperty(exports$1, "__esModule", { value: true });
    exports$1.reconstruct = void 0;
    var types_1 = require_types2();
    var write_set_tokens_1 = require_write_set_tokens();
    var reduceStack = (stack) => stack.map(exports$1.reconstruct).join("");
    var createAlternate = (token) => {
      if ("options" in token) {
        return token.options.map(reduceStack).join("|");
      } else if ("stack" in token) {
        return reduceStack(token.stack);
      } else {
        throw new Error(`options or stack must be Root or Group token`);
      }
    };
    exports$1.reconstruct = (token) => {
      switch (token.type) {
        case types_1.types.ROOT:
          return createAlternate(token);
        case types_1.types.CHAR: {
          const c2 = String.fromCharCode(token.value);
          return (/[[\\{}$^.|?*+()]/.test(c2) ? "\\" : "") + c2;
        }
        case types_1.types.POSITION:
          if (token.value === "^" || token.value === "$") {
            return token.value;
          } else {
            return `\\${token.value}`;
          }
        case types_1.types.REFERENCE:
          return `\\${token.value}`;
        case types_1.types.SET:
          return write_set_tokens_1.writeSetTokens(token);
        case types_1.types.GROUP: {
          const prefix2 = token.name ? `?<${token.name}>` : token.remember ? "" : token.followedBy ? "?=" : token.notFollowedBy ? "?!" : "?:";
          return `(${prefix2}${createAlternate(token)})`;
        }
        case types_1.types.REPETITION: {
          const { min, max } = token;
          let endWith;
          if (min === 0 && max === 1) {
            endWith = "?";
          } else if (min === 1 && max === Infinity) {
            endWith = "+";
          } else if (min === 0 && max === Infinity) {
            endWith = "*";
          } else if (max === Infinity) {
            endWith = `{${min},}`;
          } else if (min === max) {
            endWith = `{${min}}`;
          } else {
            endWith = `{${min},${max}}`;
          }
          return `${exports$1.reconstruct(token.value)}${endWith}`;
        }
        case types_1.types.RANGE:
          return `${write_set_tokens_1.setChar(token.from)}-${write_set_tokens_1.setChar(token.to)}`;
        default:
          throw new Error(`Invalid token type ${token}`);
      }
    };
  }
});
var require_dist = __commonJS({
  "../../node_modules/.pnpm/ret@0.5.0/node_modules/ret/dist/index.js"(exports$1, module2) {
    var __createBinding = exports$1 && exports$1.__createBinding || (Object.create ? function(o2, m2, k, k2) {
      if (k2 === void 0) k2 = k;
      Object.defineProperty(o2, k2, { enumerable: true, get: function() {
        return m2[k];
      } });
    } : function(o2, m2, k, k2) {
      if (k2 === void 0) k2 = k;
      o2[k2] = m2[k];
    });
    var __exportStar = exports$1 && exports$1.__exportStar || function(m2, exports2) {
      for (var p2 in m2) if (p2 !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p2)) __createBinding(exports2, m2, p2);
    };
    Object.defineProperty(exports$1, "__esModule", { value: true });
    exports$1.types = void 0;
    var types_1 = require_types2();
    Object.defineProperty(exports$1, "types", { enumerable: true, get: function() {
      return types_1.types;
    } });
    __exportStar(require_tokenizer(), exports$1);
    __exportStar(require_reconstruct(), exports$1);
    var tokenizer_1 = require_tokenizer();
    var reconstruct_1 = require_reconstruct();
    __exportStar(require_types2(), exports$1);
    exports$1.default = tokenizer_1.tokenizer;
    module2.exports = tokenizer_1.tokenizer;
    module2.exports.types = types_1.types;
    module2.exports.reconstruct = reconstruct_1.reconstruct;
  }
});
var require_safe_regex2 = __commonJS({
  "../../node_modules/.pnpm/safe-regex2@5.0.0/node_modules/safe-regex2/index.js"(exports$1, module2) {
    var parse = require_dist();
    var types = parse.types;
    function safeRegex(re, opts) {
      if (!opts) opts = {};
      const replimit = opts.limit === void 0 ? 25 : opts.limit;
      if (isRegExp(re)) re = re.source;
      else if (typeof re !== "string") re = String(re);
      try {
        re = parse(re);
      } catch {
        return false;
      }
      let reps = 0;
      return function walk(node, starHeight) {
        var _a;
        let i2;
        let ok;
        let len;
        if (node.type === types.REPETITION) {
          starHeight++;
          reps++;
          if (starHeight > 1) return false;
          if (reps > replimit) return false;
        }
        if (node.options) {
          for (i2 = 0, len = node.options.length; i2 < len; i2++) {
            ok = walk({ stack: node.options[i2] }, starHeight);
            if (!ok) return false;
          }
        }
        const stack = node.stack || ((_a = node.value) == null ? void 0 : _a.stack);
        if (!stack) return true;
        for (i2 = 0; i2 < stack.length; i2++) {
          ok = walk(stack[i2], starHeight);
          if (!ok) return false;
        }
        return true;
      }(re, 0);
    }
    function isRegExp(x) {
      return {}.toString.call(x) === "[object RegExp]";
    }
    module2.exports = safeRegex;
    module2.exports.default = safeRegex;
    module2.exports.safeRegex = safeRegex;
  }
});
var require_loglevel = __commonJS({
  "../../node_modules/.pnpm/loglevel@1.9.2/node_modules/loglevel/lib/loglevel.js"(exports$1, module2) {
    (function(root, definition) {
      if (typeof define === "function" && define.amd) {
        define(definition);
      } else if (typeof module2 === "object" && module2.exports) {
        module2.exports = definition();
      } else {
        root.log = definition();
      }
    })(exports$1, function() {
      var noop = function() {
      };
      var undefinedType = "undefined";
      var isIE = typeof window !== undefinedType && typeof window.navigator !== undefinedType && /Trident\/|MSIE /.test(window.navigator.userAgent);
      var logMethods = [
        "trace",
        "debug",
        "info",
        "warn",
        "error"
      ];
      var _loggersByName = {};
      var defaultLogger = null;
      function bindMethod(obj, methodName) {
        var method = obj[methodName];
        if (typeof method.bind === "function") {
          return method.bind(obj);
        } else {
          try {
            return Function.prototype.bind.call(method, obj);
          } catch (e2) {
            return function() {
              return Function.prototype.apply.apply(method, [obj, arguments]);
            };
          }
        }
      }
      function traceForIE() {
        if (console.log) {
          if (console.log.apply) {
            console.log.apply(console, arguments);
          } else {
            Function.prototype.apply.apply(console.log, [console, arguments]);
          }
        }
        if (console.trace) console.trace();
      }
      function realMethod(methodName) {
        if (methodName === "debug") {
          methodName = "log";
        }
        if (typeof console === undefinedType) {
          return false;
        } else if (methodName === "trace" && isIE) {
          return traceForIE;
        } else if (console[methodName] !== void 0) {
          return bindMethod(console, methodName);
        } else if (console.log !== void 0) {
          return bindMethod(console, "log");
        } else {
          return noop;
        }
      }
      function replaceLoggingMethods() {
        var level = this.getLevel();
        for (var i2 = 0; i2 < logMethods.length; i2++) {
          var methodName = logMethods[i2];
          this[methodName] = i2 < level ? noop : this.methodFactory(methodName, level, this.name);
        }
        this.log = this.debug;
        if (typeof console === undefinedType && level < this.levels.SILENT) {
          return "No console available for logging";
        }
      }
      function enableLoggingWhenConsoleArrives(methodName) {
        return function() {
          if (typeof console !== undefinedType) {
            replaceLoggingMethods.call(this);
            this[methodName].apply(this, arguments);
          }
        };
      }
      function defaultMethodFactory(methodName, _level, _loggerName) {
        return realMethod(methodName) || enableLoggingWhenConsoleArrives.apply(this, arguments);
      }
      function Logger(name, factory) {
        var self = this;
        var inheritedLevel;
        var defaultLevel;
        var userLevel;
        var storageKey = "loglevel";
        if (typeof name === "string") {
          storageKey += ":" + name;
        } else if (typeof name === "symbol") {
          storageKey = void 0;
        }
        function persistLevelIfPossible(levelNum) {
          var levelName = (logMethods[levelNum] || "silent").toUpperCase();
          if (typeof window === undefinedType || !storageKey) return;
          try {
            window.localStorage[storageKey] = levelName;
            return;
          } catch (ignore) {
          }
          try {
            window.document.cookie = encodeURIComponent(storageKey) + "=" + levelName + ";";
          } catch (ignore) {
          }
        }
        function getPersistedLevel() {
          var storedLevel;
          if (typeof window === undefinedType || !storageKey) return;
          try {
            storedLevel = window.localStorage[storageKey];
          } catch (ignore) {
          }
          if (typeof storedLevel === undefinedType) {
            try {
              var cookie = window.document.cookie;
              var cookieName = encodeURIComponent(storageKey);
              var location = cookie.indexOf(cookieName + "=");
              if (location !== -1) {
                storedLevel = /^([^;]+)/.exec(
                  cookie.slice(location + cookieName.length + 1)
                )[1];
              }
            } catch (ignore) {
            }
          }
          if (self.levels[storedLevel] === void 0) {
            storedLevel = void 0;
          }
          return storedLevel;
        }
        function clearPersistedLevel() {
          if (typeof window === undefinedType || !storageKey) return;
          try {
            window.localStorage.removeItem(storageKey);
          } catch (ignore) {
          }
          try {
            window.document.cookie = encodeURIComponent(storageKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
          } catch (ignore) {
          }
        }
        function normalizeLevel(input) {
          var level = input;
          if (typeof level === "string" && self.levels[level.toUpperCase()] !== void 0) {
            level = self.levels[level.toUpperCase()];
          }
          if (typeof level === "number" && level >= 0 && level <= self.levels.SILENT) {
            return level;
          } else {
            throw new TypeError("log.setLevel() called with invalid level: " + input);
          }
        }
        self.name = name;
        self.levels = {
          "TRACE": 0,
          "DEBUG": 1,
          "INFO": 2,
          "WARN": 3,
          "ERROR": 4,
          "SILENT": 5
        };
        self.methodFactory = factory || defaultMethodFactory;
        self.getLevel = function() {
          if (userLevel != null) {
            return userLevel;
          } else if (defaultLevel != null) {
            return defaultLevel;
          } else {
            return inheritedLevel;
          }
        };
        self.setLevel = function(level, persist) {
          userLevel = normalizeLevel(level);
          if (persist !== false) {
            persistLevelIfPossible(userLevel);
          }
          return replaceLoggingMethods.call(self);
        };
        self.setDefaultLevel = function(level) {
          defaultLevel = normalizeLevel(level);
          if (!getPersistedLevel()) {
            self.setLevel(level, false);
          }
        };
        self.resetLevel = function() {
          userLevel = null;
          clearPersistedLevel();
          replaceLoggingMethods.call(self);
        };
        self.enableAll = function(persist) {
          self.setLevel(self.levels.TRACE, persist);
        };
        self.disableAll = function(persist) {
          self.setLevel(self.levels.SILENT, persist);
        };
        self.rebuild = function() {
          if (defaultLogger !== self) {
            inheritedLevel = normalizeLevel(defaultLogger.getLevel());
          }
          replaceLoggingMethods.call(self);
          if (defaultLogger === self) {
            for (var childName in _loggersByName) {
              _loggersByName[childName].rebuild();
            }
          }
        };
        inheritedLevel = normalizeLevel(
          defaultLogger ? defaultLogger.getLevel() : "WARN"
        );
        var initialLevel = getPersistedLevel();
        if (initialLevel != null) {
          userLevel = normalizeLevel(initialLevel);
        }
        replaceLoggingMethods.call(self);
      }
      defaultLogger = new Logger();
      defaultLogger.getLogger = function getLogger2(name) {
        if (typeof name !== "symbol" && typeof name !== "string" || name === "") {
          throw new TypeError("You must supply a name when creating a logger.");
        }
        var logger2 = _loggersByName[name];
        if (!logger2) {
          logger2 = _loggersByName[name] = new Logger(
            name,
            defaultLogger.methodFactory
          );
        }
        return logger2;
      };
      var _log = typeof window !== undefinedType ? window.log : void 0;
      defaultLogger.noConflict = function() {
        if (typeof window !== undefinedType && window.log === defaultLogger) {
          window.log = _log;
        }
        return defaultLogger;
      };
      defaultLogger.getLoggers = function getLoggers() {
        return _loggersByName;
      };
      defaultLogger["default"] = defaultLogger;
      return defaultLogger;
    });
  }
});
var require_loglevel_plugin_prefix = __commonJS({
  "../../node_modules/.pnpm/loglevel-plugin-prefix@0.8.4/node_modules/loglevel-plugin-prefix/lib/loglevel-plugin-prefix.js"(exports$1, module2) {
    (function(root, factory) {
      if (typeof define === "function" && define.amd) {
        define(factory);
      } else if (typeof module2 === "object" && module2.exports) {
        module2.exports = factory();
      } else {
        root.prefix = factory(root);
      }
    })(exports$1, function(root) {
      var merge = function(target) {
        var i2 = 1;
        var length = arguments.length;
        var key;
        for (; i2 < length; i2++) {
          for (key in arguments[i2]) {
            if (Object.prototype.hasOwnProperty.call(arguments[i2], key)) {
              target[key] = arguments[i2][key];
            }
          }
        }
        return target;
      };
      var defaults = {
        template: "[%t] %l:",
        levelFormatter: function(level) {
          return level.toUpperCase();
        },
        nameFormatter: function(name) {
          return name || "root";
        },
        timestampFormatter: function(date) {
          return date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
        },
        format: void 0
      };
      var loglevel;
      var configs = {};
      var reg = function(rootLogger) {
        if (!rootLogger || !rootLogger.getLogger) {
          throw new TypeError("Argument is not a root logger");
        }
        loglevel = rootLogger;
      };
      var apply = function(logger2, config) {
        if (!logger2 || !logger2.setLevel) {
          throw new TypeError("Argument is not a logger");
        }
        var originalFactory2 = logger2.methodFactory;
        var name = logger2.name || "";
        var parent = configs[name] || configs[""] || defaults;
        function methodFactory(methodName, logLevel, loggerName) {
          var originalMethod = originalFactory2(methodName, logLevel, loggerName);
          var options = configs[loggerName] || configs[""];
          var hasTimestamp = options.template.indexOf("%t") !== -1;
          var hasLevel = options.template.indexOf("%l") !== -1;
          var hasName = options.template.indexOf("%n") !== -1;
          return function() {
            var content = "";
            var length = arguments.length;
            var args = Array(length);
            var key = 0;
            for (; key < length; key++) {
              args[key] = arguments[key];
            }
            if (name || !configs[loggerName]) {
              var timestamp = options.timestampFormatter(/* @__PURE__ */ new Date());
              var level = options.levelFormatter(methodName);
              var lname = options.nameFormatter(loggerName);
              if (options.format) {
                content += options.format(level, lname, timestamp);
              } else {
                content += options.template;
                if (hasTimestamp) {
                  content = content.replace(/%t/, timestamp);
                }
                if (hasLevel) content = content.replace(/%l/, level);
                if (hasName) content = content.replace(/%n/, lname);
              }
              if (args.length && typeof args[0] === "string") {
                args[0] = content + " " + args[0];
              } else {
                args.unshift(content);
              }
            }
            originalMethod.apply(void 0, args);
          };
        }
        if (!configs[name]) {
          logger2.methodFactory = methodFactory;
        }
        config = config || {};
        if (config.template) config.format = void 0;
        configs[name] = merge({}, parent, config);
        logger2.setLevel(logger2.getLevel());
        if (!loglevel) {
          logger2.warn(
            "It is necessary to call the function reg() of loglevel-plugin-prefix before calling apply. From the next release, it will throw an error. See more: https://github.com/kutuluk/loglevel-plugin-prefix/blob/master/README.md"
          );
        }
        return logger2;
      };
      var api = {
        reg,
        apply
      };
      var save2;
      if (root) {
        save2 = root.prefix;
        api.noConflict = function() {
          if (root.prefix === api) {
            root.prefix = save2;
          }
          return api;
        };
      }
      return api;
    });
  }
});
var import_safe_regex2 = __toESM(require_safe_regex2());
var import_loglevel = __toESM(require_loglevel());
var ANSI_BACKGROUND_OFFSET = 10;
var wrapAnsi16 = (offset = 0) => (code) => `\x1B[${code + offset}m`;
var wrapAnsi256 = (offset = 0) => (code) => `\x1B[${38 + offset};5;${code}m`;
var wrapAnsi16m = (offset = 0) => (red, green, blue) => `\x1B[${38 + offset};2;${red};${green};${blue}m`;
var styles = {
  modifier: {
    reset: [0, 0],
    // 21 isn't widely supported and 22 does the same thing
    bold: [1, 22],
    dim: [2, 22],
    italic: [3, 23],
    underline: [4, 24],
    overline: [53, 55],
    inverse: [7, 27],
    hidden: [8, 28],
    strikethrough: [9, 29]
  },
  color: {
    black: [30, 39],
    red: [31, 39],
    green: [32, 39],
    yellow: [33, 39],
    blue: [34, 39],
    magenta: [35, 39],
    cyan: [36, 39],
    white: [37, 39],
    // Bright color
    blackBright: [90, 39],
    gray: [90, 39],
    // Alias of `blackBright`
    grey: [90, 39],
    // Alias of `blackBright`
    redBright: [91, 39],
    greenBright: [92, 39],
    yellowBright: [93, 39],
    blueBright: [94, 39],
    magentaBright: [95, 39],
    cyanBright: [96, 39],
    whiteBright: [97, 39]
  },
  bgColor: {
    bgBlack: [40, 49],
    bgRed: [41, 49],
    bgGreen: [42, 49],
    bgYellow: [43, 49],
    bgBlue: [44, 49],
    bgMagenta: [45, 49],
    bgCyan: [46, 49],
    bgWhite: [47, 49],
    // Bright color
    bgBlackBright: [100, 49],
    bgGray: [100, 49],
    // Alias of `bgBlackBright`
    bgGrey: [100, 49],
    // Alias of `bgBlackBright`
    bgRedBright: [101, 49],
    bgGreenBright: [102, 49],
    bgYellowBright: [103, 49],
    bgBlueBright: [104, 49],
    bgMagentaBright: [105, 49],
    bgCyanBright: [106, 49],
    bgWhiteBright: [107, 49]
  }
};
Object.keys(styles.modifier);
var foregroundColorNames = Object.keys(styles.color);
var backgroundColorNames = Object.keys(styles.bgColor);
[...foregroundColorNames, ...backgroundColorNames];
function assembleStyles() {
  const codes = /* @__PURE__ */ new Map();
  for (const [groupName, group] of Object.entries(styles)) {
    for (const [styleName, style] of Object.entries(group)) {
      styles[styleName] = {
        open: `\x1B[${style[0]}m`,
        close: `\x1B[${style[1]}m`
      };
      group[styleName] = styles[styleName];
      codes.set(style[0], style[1]);
    }
    Object.defineProperty(styles, groupName, {
      value: group,
      enumerable: false
    });
  }
  Object.defineProperty(styles, "codes", {
    value: codes,
    enumerable: false
  });
  styles.color.close = "\x1B[39m";
  styles.bgColor.close = "\x1B[49m";
  styles.color.ansi = wrapAnsi16();
  styles.color.ansi256 = wrapAnsi256();
  styles.color.ansi16m = wrapAnsi16m();
  styles.bgColor.ansi = wrapAnsi16(ANSI_BACKGROUND_OFFSET);
  styles.bgColor.ansi256 = wrapAnsi256(ANSI_BACKGROUND_OFFSET);
  styles.bgColor.ansi16m = wrapAnsi16m(ANSI_BACKGROUND_OFFSET);
  Object.defineProperties(styles, {
    rgbToAnsi256: {
      value(red, green, blue) {
        if (red === green && green === blue) {
          if (red < 8) {
            return 16;
          }
          if (red > 248) {
            return 231;
          }
          return Math.round((red - 8) / 247 * 24) + 232;
        }
        return 16 + 36 * Math.round(red / 255 * 5) + 6 * Math.round(green / 255 * 5) + Math.round(blue / 255 * 5);
      },
      enumerable: false
    },
    hexToRgb: {
      value(hex) {
        const matches2 = /[a-f\d]{6}|[a-f\d]{3}/i.exec(hex.toString(16));
        if (!matches2) {
          return [0, 0, 0];
        }
        let [colorString] = matches2;
        if (colorString.length === 3) {
          colorString = [...colorString].map((character) => character + character).join("");
        }
        const integer = Number.parseInt(colorString, 16);
        return [
          /* eslint-disable no-bitwise */
          integer >> 16 & 255,
          integer >> 8 & 255,
          integer & 255
          /* eslint-enable no-bitwise */
        ];
      },
      enumerable: false
    },
    hexToAnsi256: {
      value: (hex) => styles.rgbToAnsi256(...styles.hexToRgb(hex)),
      enumerable: false
    },
    ansi256ToAnsi: {
      value(code) {
        if (code < 8) {
          return 30 + code;
        }
        if (code < 16) {
          return 90 + (code - 8);
        }
        let red;
        let green;
        let blue;
        if (code >= 232) {
          red = ((code - 232) * 10 + 8) / 255;
          green = red;
          blue = red;
        } else {
          code -= 16;
          const remainder = code % 36;
          red = Math.floor(code / 36) / 5;
          green = Math.floor(remainder / 6) / 5;
          blue = remainder % 6 / 5;
        }
        const value = Math.max(red, green, blue) * 2;
        if (value === 0) {
          return 30;
        }
        let result = 30 + (Math.round(blue) << 2 | Math.round(green) << 1 | Math.round(red));
        if (value === 2) {
          result += 60;
        }
        return result;
      },
      enumerable: false
    },
    rgbToAnsi: {
      value: (red, green, blue) => styles.ansi256ToAnsi(styles.rgbToAnsi256(red, green, blue)),
      enumerable: false
    },
    hexToAnsi: {
      value: (hex) => styles.ansi256ToAnsi(styles.hexToAnsi256(hex)),
      enumerable: false
    }
  });
  return styles;
}
var ansiStyles = assembleStyles();
var ansi_styles_default = ansiStyles;
function hasFlag(flag, argv = globalThis.Deno ? globalThis.Deno.args : process2.argv) {
  const prefix2 = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
  const position = argv.indexOf(prefix2 + flag);
  const terminatorPosition = argv.indexOf("--");
  return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
}
var { env } = process2;
var flagForceColor;
if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) {
  flagForceColor = 0;
} else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) {
  flagForceColor = 1;
}
function envForceColor() {
  if ("FORCE_COLOR" in env) {
    if (env.FORCE_COLOR === "true") {
      return 1;
    }
    if (env.FORCE_COLOR === "false") {
      return 0;
    }
    return env.FORCE_COLOR.length === 0 ? 1 : Math.min(Number.parseInt(env.FORCE_COLOR, 10), 3);
  }
}
function translateLevel(level) {
  if (level === 0) {
    return false;
  }
  return {
    level,
    hasBasic: true,
    has256: level >= 2,
    has16m: level >= 3
  };
}
function _supportsColor(haveStream, { streamIsTTY, sniffFlags = true } = {}) {
  const noFlagForceColor = envForceColor();
  if (noFlagForceColor !== void 0) {
    flagForceColor = noFlagForceColor;
  }
  const forceColor = sniffFlags ? flagForceColor : noFlagForceColor;
  if (forceColor === 0) {
    return 0;
  }
  if (sniffFlags) {
    if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) {
      return 3;
    }
    if (hasFlag("color=256")) {
      return 2;
    }
  }
  if ("TF_BUILD" in env && "AGENT_NAME" in env) {
    return 1;
  }
  if (haveStream && !streamIsTTY && forceColor === void 0) {
    return 0;
  }
  const min = forceColor || 0;
  if (env.TERM === "dumb") {
    return min;
  }
  if (process2.platform === "win32") {
    const osRelease = os.release().split(".");
    if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
      return Number(osRelease[2]) >= 14931 ? 3 : 2;
    }
    return 1;
  }
  if ("CI" in env) {
    if (["GITHUB_ACTIONS", "GITEA_ACTIONS", "CIRCLECI"].some((key) => key in env)) {
      return 3;
    }
    if (["TRAVIS", "APPVEYOR", "GITLAB_CI", "BUILDKITE", "DRONE"].some((sign) => sign in env) || env.CI_NAME === "codeship") {
      return 1;
    }
    return min;
  }
  if ("TEAMCITY_VERSION" in env) {
    return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
  }
  if (env.COLORTERM === "truecolor") {
    return 3;
  }
  if (env.TERM === "xterm-kitty") {
    return 3;
  }
  if (env.TERM === "xterm-ghostty") {
    return 3;
  }
  if (env.TERM === "wezterm") {
    return 3;
  }
  if ("TERM_PROGRAM" in env) {
    const version = Number.parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
    switch (env.TERM_PROGRAM) {
      case "iTerm.app": {
        return version >= 3 ? 3 : 2;
      }
      case "Apple_Terminal": {
        return 2;
      }
    }
  }
  if (/-256(color)?$/i.test(env.TERM)) {
    return 2;
  }
  if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
    return 1;
  }
  if ("COLORTERM" in env) {
    return 1;
  }
  return min;
}
function createSupportsColor(stream, options = {}) {
  const level = _supportsColor(stream, {
    streamIsTTY: stream && stream.isTTY,
    ...options
  });
  return translateLevel(level);
}
var supportsColor = {
  stdout: createSupportsColor({ isTTY: tty.isatty(1) }),
  stderr: createSupportsColor({ isTTY: tty.isatty(2) })
};
var supports_color_default = supportsColor;
function stringReplaceAll(string, substring, replacer) {
  let index = string.indexOf(substring);
  if (index === -1) {
    return string;
  }
  const substringLength = substring.length;
  let endIndex = 0;
  let returnValue = "";
  do {
    returnValue += string.slice(endIndex, index) + substring + replacer;
    endIndex = index + substringLength;
    index = string.indexOf(substring, endIndex);
  } while (index !== -1);
  returnValue += string.slice(endIndex);
  return returnValue;
}
function stringEncaseCRLFWithFirstIndex(string, prefix2, postfix, index) {
  let endIndex = 0;
  let returnValue = "";
  do {
    const gotCR = string[index - 1] === "\r";
    returnValue += string.slice(endIndex, gotCR ? index - 1 : index) + prefix2 + (gotCR ? "\r\n" : "\n") + postfix;
    endIndex = index + 1;
    index = string.indexOf("\n", endIndex);
  } while (index !== -1);
  returnValue += string.slice(endIndex);
  return returnValue;
}
var { stdout: stdoutColor, stderr: stderrColor } = supports_color_default;
var GENERATOR = Symbol("GENERATOR");
var STYLER = Symbol("STYLER");
var IS_EMPTY = Symbol("IS_EMPTY");
var levelMapping = [
  "ansi",
  "ansi",
  "ansi256",
  "ansi16m"
];
var styles2 = /* @__PURE__ */ Object.create(null);
var applyOptions = (object, options = {}) => {
  if (options.level && !(Number.isInteger(options.level) && options.level >= 0 && options.level <= 3)) {
    throw new Error("The `level` option should be an integer from 0 to 3");
  }
  const colorLevel = stdoutColor ? stdoutColor.level : 0;
  object.level = options.level === void 0 ? colorLevel : options.level;
};
var chalkFactory = (options) => {
  const chalk2 = (...strings) => strings.join(" ");
  applyOptions(chalk2, options);
  Object.setPrototypeOf(chalk2, createChalk.prototype);
  return chalk2;
};
function createChalk(options) {
  return chalkFactory(options);
}
Object.setPrototypeOf(createChalk.prototype, Function.prototype);
for (const [styleName, style] of Object.entries(ansi_styles_default)) {
  styles2[styleName] = {
    get() {
      const builder = createBuilder(this, createStyler(style.open, style.close, this[STYLER]), this[IS_EMPTY]);
      Object.defineProperty(this, styleName, { value: builder });
      return builder;
    }
  };
}
styles2.visible = {
  get() {
    const builder = createBuilder(this, this[STYLER], true);
    Object.defineProperty(this, "visible", { value: builder });
    return builder;
  }
};
var getModelAnsi = (model, level, type, ...arguments_) => {
  if (model === "rgb") {
    if (level === "ansi16m") {
      return ansi_styles_default[type].ansi16m(...arguments_);
    }
    if (level === "ansi256") {
      return ansi_styles_default[type].ansi256(ansi_styles_default.rgbToAnsi256(...arguments_));
    }
    return ansi_styles_default[type].ansi(ansi_styles_default.rgbToAnsi(...arguments_));
  }
  if (model === "hex") {
    return getModelAnsi("rgb", level, type, ...ansi_styles_default.hexToRgb(...arguments_));
  }
  return ansi_styles_default[type][model](...arguments_);
};
var usedModels = ["rgb", "hex", "ansi256"];
for (const model of usedModels) {
  styles2[model] = {
    get() {
      const { level } = this;
      return function(...arguments_) {
        const styler = createStyler(getModelAnsi(model, levelMapping[level], "color", ...arguments_), ansi_styles_default.color.close, this[STYLER]);
        return createBuilder(this, styler, this[IS_EMPTY]);
      };
    }
  };
  const bgModel = "bg" + model[0].toUpperCase() + model.slice(1);
  styles2[bgModel] = {
    get() {
      const { level } = this;
      return function(...arguments_) {
        const styler = createStyler(getModelAnsi(model, levelMapping[level], "bgColor", ...arguments_), ansi_styles_default.bgColor.close, this[STYLER]);
        return createBuilder(this, styler, this[IS_EMPTY]);
      };
    }
  };
}
var proto = Object.defineProperties(() => {
}, {
  ...styles2,
  level: {
    enumerable: true,
    get() {
      return this[GENERATOR].level;
    },
    set(level) {
      this[GENERATOR].level = level;
    }
  }
});
var createStyler = (open, close, parent) => {
  let openAll;
  let closeAll;
  if (parent === void 0) {
    openAll = open;
    closeAll = close;
  } else {
    openAll = parent.openAll + open;
    closeAll = close + parent.closeAll;
  }
  return {
    open,
    close,
    openAll,
    closeAll,
    parent
  };
};
var createBuilder = (self, _styler, _isEmpty) => {
  const builder = (...arguments_) => applyStyle(builder, arguments_.length === 1 ? "" + arguments_[0] : arguments_.join(" "));
  Object.setPrototypeOf(builder, proto);
  builder[GENERATOR] = self;
  builder[STYLER] = _styler;
  builder[IS_EMPTY] = _isEmpty;
  return builder;
};
var applyStyle = (self, string) => {
  if (self.level <= 0 || !string) {
    return self[IS_EMPTY] ? "" : string;
  }
  let styler = self[STYLER];
  if (styler === void 0) {
    return string;
  }
  const { openAll, closeAll } = styler;
  if (string.includes("\x1B")) {
    while (styler !== void 0) {
      string = stringReplaceAll(string, styler.close, styler.open);
      styler = styler.parent;
    }
  }
  const lfIndex = string.indexOf("\n");
  if (lfIndex !== -1) {
    string = stringEncaseCRLFWithFirstIndex(string, closeAll, openAll, lfIndex);
  }
  return openAll + string + closeAll;
};
Object.defineProperties(createChalk.prototype, styles2);
var chalk = createChalk();
createChalk({ level: stderrColor ? stderrColor.level : 0 });
var source_default = chalk;
var import_loglevel_plugin_prefix = __toESM(require_loglevel_plugin_prefix());
function ansiRegex({ onlyFirst = false } = {}) {
  const ST = "(?:\\u0007|\\u001B\\u005C|\\u009C)";
  const osc = `(?:\\u001B\\][\\s\\S]*?${ST})`;
  const csi = "[\\u001B\\u009B][[\\]()#;?]*(?:\\d{1,4}(?:[;:]\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]";
  const pattern = `${osc}|${csi}`;
  return new RegExp(pattern, onlyFirst ? void 0 : "g");
}
var regex = ansiRegex();
function stripAnsi(string) {
  if (typeof string !== "string") {
    throw new TypeError(`Expected a \`string\`, got \`${typeof string}\``);
  }
  return string.replace(regex, "");
}
var SENSITIVE_DATA_REPLACER = "**MASKED**";
var skipError = (aFunction) => {
  try {
    return aFunction();
  } catch {
    return void 0;
  }
};
var parseMaskingPatterns = (maskingRegexString) => {
  if (typeof maskingRegexString !== "string") {
    return void 0;
  }
  const regexStrings = maskingRegexString == null ? void 0 : maskingRegexString.split(/,\s*/).filter((regexStr) => regexStr.trim() !== "");
  return regexStrings == null ? void 0 : regexStrings.map((regexStr) => {
    const regexParts = regexStr.match(/^\/(.*?)\/([gimsuy]*)$/);
    if (!regexParts && (0, import_safe_regex2.default)(regexStr)) {
      return skipError(() => new RegExp(regexStr));
    }
    if ((regexParts == null ? void 0 : regexParts[1]) && (0, import_safe_regex2.default)(regexParts[1])) {
      return skipError(() => regexParts[2] ? new RegExp(regexParts[1], regexParts[2]) : new RegExp(regexParts[1]));
    }
    return void 0;
  }).filter((regex2) => regex2 !== void 0);
};
var mask = (text, maskingPatterns) => {
  if (!maskingPatterns || typeof text !== "string") {
    return text;
  }
  const endsWithNewline = text.endsWith("\n");
  let maskedText = text;
  maskingPatterns.forEach((maskingRegex) => {
    maskedText = maskedText.replace(maskingRegex, (fullMatch, ...capturedGroupsAndMore) => {
      const capturedGroups = capturedGroupsAndMore.slice(0, capturedGroupsAndMore.length - 2);
      if (capturedGroups.length === 0) {
        return SENSITIVE_DATA_REPLACER;
      }
      let matchedMaskedText = fullMatch;
      capturedGroups.forEach((group) => {
        matchedMaskedText = matchedMaskedText.replace(group, SENSITIVE_DATA_REPLACER);
      });
      return matchedMaskedText;
    });
  });
  if (endsWithNewline && !maskedText.endsWith("\n")) {
    maskedText += "\n";
  }
  return maskedText;
};
import_loglevel_plugin_prefix.default.reg(import_loglevel.default);
var DEFAULT_LEVEL = define_process_env_default.WDIO_DEBUG ? "trace" : "info";
var COLORS = {
  error: "red",
  warn: "yellow",
  info: "cyanBright",
  debug: "green",
  trace: "cyan",
  progress: "magenta"
};
var matches = {
  COMMAND: "COMMAND",
  BIDICOMMAND: "BIDI COMMAND",
  DATA: "DATA",
  RESULT: "RESULT",
  BIDIRESULT: "BIDI RESULT"
};
var SERIALIZERS = [{
  /**
   * display error stack
   */
  matches: (err) => err instanceof Error,
  serialize: (err) => err.stack
}, {
  /**
   * color commands blue
   */
  matches: (log22) => log22 === matches.COMMAND || log22 === matches.BIDICOMMAND,
  serialize: (log22) => source_default.magenta(log22)
}, {
  /**
   * color data yellow
   */
  matches: (log22) => log22 === matches.DATA,
  serialize: (log22) => source_default.yellow(log22)
}, {
  /**
   * color result cyan
   */
  matches: (log22) => log22 === matches.RESULT || log22 === matches.BIDIRESULT,
  serialize: (log22) => source_default.cyan(log22)
}];
var loggers = import_loglevel.default.getLoggers();
var logLevelsConfig = {};
var maskingPatternsConfig = {};
var logCache = /* @__PURE__ */ new Set();
var logFile;
var originalFactory = import_loglevel.default.methodFactory;
var wdioLoggerMethodFactory = (wdioLogger) => function(methodName, logLevel, loggerName) {
  const rawMethod = originalFactory(methodName, logLevel, loggerName);
  return (...args) => {
    if (!logFile && define_process_env_default.WDIO_LOG_PATH) {
      logFile = fs.createWriteStream(define_process_env_default.WDIO_LOG_PATH);
    }
    const match = Object.values(matches).filter((x) => args[0].endsWith(`: ${x}`))[0];
    if (match) {
      const prefixStr = args.shift().slice(0, -match.length - 1);
      args.unshift(prefixStr, match);
    }
    args = args.map((arg) => {
      for (const s2 of SERIALIZERS) {
        if (s2.matches(arg)) {
          return s2.serialize(arg);
        }
      }
      return arg;
    });
    const unmaskedLogText = stripAnsi(`${util2.format.apply(this, args)}
`);
    const maskedLogText = mask(unmaskedLogText, wdioLogger.maskingPatterns);
    if (logFile && logFile.writable) {
      if (logCache.size) {
        logCache.forEach((log22) => {
          if (logFile) {
            logFile.write(log22);
          }
        });
        logCache.clear();
      }
      if (!logsContainInitPackageError(unmaskedLogText)) {
        return logFile.write(maskedLogText);
      }
      logFile.write(maskedLogText);
    }
    logCache.add(maskedLogText);
    if (maskedLogText === unmaskedLogText) {
      rawMethod(...args);
    } else {
      rawMethod(maskedLogText.replace(/\n$/, ""));
    }
  };
};
var progress = function(data) {
  if (process.stdout.isTTY && this.getLevel() <= import_loglevel.default.levels.INFO) {
    const level = "progress";
    const timestampFormatter = source_default.gray((/* @__PURE__ */ new Date()).toISOString());
    const levelFormatter = source_default[COLORS[level]](level.toUpperCase());
    const nameFormatter = source_default.whiteBright(this.name);
    const _data = data.length > 0 ? `${timestampFormatter} ${levelFormatter} ${nameFormatter}: ${data}` : "\r\x1B[K\x1B[?25h";
    process.stdout.write("\x1B[?25l");
    process.stdout.write(`${_data}\r`);
  }
};
function getLogger(name) {
  if (loggers[name]) {
    return loggers[name];
  }
  let logLevel = define_process_env_default.WDIO_LOG_LEVEL || DEFAULT_LEVEL;
  const logLevelName = getLogLevelName(name);
  if (logLevelsConfig[logLevelName]) {
    logLevel = logLevelsConfig[logLevelName];
  }
  loggers[name] = import_loglevel.default.getLogger(name);
  const logger2 = loggers[name];
  logger2.setLevel(logLevel);
  logger2.maskingPatterns = maskingPatternsConfig[name] ?? parseMaskingPatterns(define_process_env_default.WDIO_LOG_MASKING_PATTERNS);
  logger2.progress = progress;
  logger2.methodFactory = wdioLoggerMethodFactory(logger2);
  import_loglevel_plugin_prefix.default.apply(logger2, {
    template: "%t %l %n:",
    timestampFormatter: (date) => source_default.gray(date.toISOString()),
    levelFormatter: (level) => source_default[COLORS[level]](level.toUpperCase()),
    nameFormatter: (name2) => source_default.whiteBright(name2)
  });
  return logger2;
}
getLogger.waitForBuffer = async () => new Promise((resolve) => {
  if (logFile && Array.isArray(logFile.writableBuffer) && logFile.writableBuffer.length !== 0) {
    return setTimeout(async () => {
      await getLogger.waitForBuffer();
      resolve();
    }, 20);
  }
  resolve();
});
getLogger.setLevel = (name, level) => loggers[name].setLevel(level);
getLogger.clearLogger = () => {
  if (logFile) {
    logFile.end();
  }
  logFile = null;
};
getLogger.setLogLevelsConfig = (logLevels = {}, wdioLogLevel = DEFAULT_LEVEL) => {
  if (define_process_env_default.WDIO_LOG_LEVEL === void 0) {
    define_process_env_default.WDIO_LOG_LEVEL = wdioLogLevel;
  }
  logLevelsConfig = {};
  Object.entries(logLevels).forEach(([logName, logLevel]) => {
    const logLevelName = getLogLevelName(logName);
    logLevelsConfig[logLevelName] = logLevel;
  });
  Object.keys(loggers).forEach((logName) => {
    const logLevelName = getLogLevelName(logName);
    const logLevel = typeof logLevelsConfig[logLevelName] !== "undefined" ? logLevelsConfig[logLevelName] : define_process_env_default.WDIO_LOG_LEVEL;
    loggers[logName].setLevel(logLevel);
  });
};
getLogger.setMaskingPatterns = (pattern) => {
  if (typeof pattern === "string") {
    if (define_process_env_default.WDIO_LOG_MASKING_PATTERNS === void 0) {
      define_process_env_default.WDIO_LOG_MASKING_PATTERNS = pattern;
    }
  } else if (typeof pattern === "object") {
    maskingPatternsConfig = Object.entries(pattern).reduce((acc, [logName, maskingPatternsString]) => {
      acc[logName] = parseMaskingPatterns(maskingPatternsString);
      return acc;
    }, maskingPatternsConfig);
  } else {
    throw new Error(`Invalid pattern property, expected \`string\` or \`Record<string, string>\` but received \`${typeof pattern}\``);
  }
  Object.keys(loggers).forEach((logName) => {
    const maskingPatterns = maskingPatternsConfig[logName] ?? parseMaskingPatterns(define_process_env_default.WDIO_LOG_MASKING_PATTERNS);
    loggers[logName].maskingPatterns = maskingPatterns;
  });
};
var getLogLevelName = (logName) => logName.split(":").shift();
function logsContainInitPackageError(logText) {
  return ERROR_LOG_VALIDATOR.every((pattern) => logText.includes(pattern));
}
var ERROR_LOG_VALIDATOR = [
  "Couldn't find plugin",
  "neither as wdio scoped package",
  "nor as community package",
  "Please make sure you have it installed"
];
var e = 1e3;
var t = e * 60;
var n = t * 60;
var r = n * 24;
var i = r * 7;
var a = r * 365.25;
var o = a / 12;
function s(e2, t2) {
  if (typeof e2 == `string`) return l(e2);
  if (typeof e2 == `number`) return p(e2, t2);
  throw Error(`Value provided to ms() must be a string or number. value=${JSON.stringify(e2)}`);
}
var c = s;
function l(s2) {
  if (typeof s2 != `string` || s2.length === 0 || s2.length > 100) throw Error(`Value provided to ms.parse() must be a string with length between 1 and 99. value=${JSON.stringify(s2)}`);
  let c2 = /^(?<value>-?\d*\.?\d+) *(?<unit>milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|months?|mo|years?|yrs?|y)?$/i.exec(s2);
  if (!(c2 == null ? void 0 : c2.groups)) return NaN;
  let { value: l2, unit: u = `ms` } = c2.groups, d2 = parseFloat(l2), f2 = u.toLowerCase();
  switch (f2) {
    case `years`:
    case `year`:
    case `yrs`:
    case `yr`:
    case `y`:
      return d2 * a;
    case `months`:
    case `month`:
    case `mo`:
      return d2 * o;
    case `weeks`:
    case `week`:
    case `w`:
      return d2 * i;
    case `days`:
    case `day`:
    case `d`:
      return d2 * r;
    case `hours`:
    case `hour`:
    case `hrs`:
    case `hr`:
    case `h`:
      return d2 * n;
    case `minutes`:
    case `minute`:
    case `mins`:
    case `min`:
    case `m`:
      return d2 * t;
    case `seconds`:
    case `second`:
    case `secs`:
    case `sec`:
    case `s`:
      return d2 * e;
    case `milliseconds`:
    case `millisecond`:
    case `msecs`:
    case `msec`:
    case `ms`:
      return d2;
    default:
      throw Error(`Unknown unit "${f2}" provided to ms.parse(). value=${JSON.stringify(s2)}`);
  }
}
function d(s2) {
  let c2 = Math.abs(s2);
  return c2 >= a ? `${Math.round(s2 / a)}y` : c2 >= o ? `${Math.round(s2 / o)}mo` : c2 >= i ? `${Math.round(s2 / i)}w` : c2 >= r ? `${Math.round(s2 / r)}d` : c2 >= n ? `${Math.round(s2 / n)}h` : c2 >= t ? `${Math.round(s2 / t)}m` : c2 >= e ? `${Math.round(s2 / e)}s` : `${s2}ms`;
}
function f(s2) {
  let c2 = Math.abs(s2);
  return c2 >= a ? m(s2, c2, a, `year`) : c2 >= o ? m(s2, c2, o, `month`) : c2 >= i ? m(s2, c2, i, `week`) : c2 >= r ? m(s2, c2, r, `day`) : c2 >= n ? m(s2, c2, n, `hour`) : c2 >= t ? m(s2, c2, t, `minute`) : c2 >= e ? m(s2, c2, e, `second`) : `${s2} ms`;
}
function p(e2, t2) {
  if (typeof e2 != `number` || !Number.isFinite(e2)) throw Error(`Value provided to ms.format() must be of type number.`);
  return (t2 == null ? void 0 : t2.long) ? f(e2) : d(e2);
}
function m(e2, t2, n2, r2) {
  let i2 = t2 >= n2 * 1.5;
  return `${Math.round(e2 / n2)} ${r2}${i2 ? `s` : ``}`;
}
function hasFlag2(flag, argv = globalThis.Deno ? globalThis.Deno.args : process2.argv) {
  const prefix2 = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
  const position = argv.indexOf(prefix2 + flag);
  const terminatorPosition = argv.indexOf("--");
  return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
}
var { env: env2 } = process2;
var flagForceColor2;
if (hasFlag2("no-color") || hasFlag2("no-colors") || hasFlag2("color=false") || hasFlag2("color=never")) {
  flagForceColor2 = 0;
} else if (hasFlag2("color") || hasFlag2("colors") || hasFlag2("color=true") || hasFlag2("color=always")) {
  flagForceColor2 = 1;
}
function envForceColor2() {
  if (!("FORCE_COLOR" in env2)) {
    return;
  }
  if (env2.FORCE_COLOR === "true") {
    return 1;
  }
  if (env2.FORCE_COLOR === "false") {
    return 0;
  }
  if (env2.FORCE_COLOR.length === 0) {
    return 1;
  }
  const level = Math.min(Number.parseInt(env2.FORCE_COLOR, 10), 3);
  if (![0, 1, 2, 3].includes(level)) {
    return;
  }
  return level;
}
function translateLevel2(level) {
  if (level === 0) {
    return false;
  }
  return {
    level,
    hasBasic: true,
    has256: level >= 2,
    has16m: level >= 3
  };
}
function _supportsColor2(haveStream, { streamIsTTY, sniffFlags = true } = {}) {
  const noFlagForceColor = envForceColor2();
  if (noFlagForceColor !== void 0) {
    flagForceColor2 = noFlagForceColor;
  }
  const forceColor = sniffFlags ? flagForceColor2 : noFlagForceColor;
  if (forceColor === 0) {
    return 0;
  }
  if (sniffFlags) {
    if (hasFlag2("color=16m") || hasFlag2("color=full") || hasFlag2("color=truecolor")) {
      return 3;
    }
    if (hasFlag2("color=256")) {
      return 2;
    }
  }
  if ("TF_BUILD" in env2 && "AGENT_NAME" in env2) {
    return 1;
  }
  if (haveStream && !streamIsTTY && forceColor === void 0) {
    return 0;
  }
  const min = forceColor || 0;
  if (env2.TERM === "dumb") {
    return min;
  }
  if (process2.platform === "win32") {
    const osRelease = os.release().split(".");
    if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
      return Number(osRelease[2]) >= 14931 ? 3 : 2;
    }
    return 1;
  }
  if ("CI" in env2) {
    if (["GITHUB_ACTIONS", "GITEA_ACTIONS", "CIRCLECI"].some((key) => key in env2)) {
      return 3;
    }
    if (["TRAVIS", "APPVEYOR", "GITLAB_CI", "BUILDKITE", "DRONE"].some((sign) => sign in env2) || env2.CI_NAME === "codeship") {
      return 1;
    }
    return min;
  }
  if ("TEAMCITY_VERSION" in env2) {
    return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env2.TEAMCITY_VERSION) ? 1 : 0;
  }
  if (env2.COLORTERM === "truecolor") {
    return 3;
  }
  if (env2.TERM === "xterm-kitty") {
    return 3;
  }
  if (env2.TERM === "xterm-ghostty") {
    return 3;
  }
  if (env2.TERM === "wezterm") {
    return 3;
  }
  if ("TERM_PROGRAM" in env2) {
    const version = Number.parseInt((env2.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
    switch (env2.TERM_PROGRAM) {
      case "iTerm.app": {
        return version >= 3 ? 3 : 2;
      }
      case "Apple_Terminal": {
        return 2;
      }
    }
  }
  if (/-256(color)?$/i.test(env2.TERM)) {
    return 2;
  }
  if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env2.TERM)) {
    return 1;
  }
  if ("COLORTERM" in env2) {
    return 1;
  }
  return min;
}
function createSupportsColor2(stream, options = {}) {
  const level = _supportsColor2(stream, {
    streamIsTTY: stream && stream.isTTY,
    ...options
  });
  return translateLevel2(level);
}
var supportsColor2 = {
  stdout: createSupportsColor2({ isTTY: tty.isatty(1) }),
  stderr: createSupportsColor2({ isTTY: tty.isatty(2) })
};
var supports_color_default2 = supportsColor2;
function setup(env3) {
  createDebug.debug = createDebug;
  createDebug.default = createDebug;
  createDebug.coerce = coerce;
  createDebug.disable = disable;
  createDebug.enable = enable;
  createDebug.enabled = enabled;
  createDebug.humanize = c;
  createDebug.destroy = destroy;
  Object.keys(env3).forEach((key) => {
    createDebug[key] = env3[key];
  });
  createDebug.names = [];
  createDebug.skips = [];
  createDebug.formatters = {};
  function selectColor(namespace) {
    let hash = 0;
    for (let i2 = 0; i2 < namespace.length; i2++) {
      hash = (hash << 5) - hash + namespace.charCodeAt(i2);
      hash |= 0;
    }
    return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
  }
  createDebug.selectColor = selectColor;
  function createDebug(namespace) {
    let prevTime;
    let enableOverride = null;
    let namespacesCache;
    let enabledCache;
    function debug(...args) {
      if (!debug.enabled) {
        return;
      }
      const self = debug;
      const curr = Number(/* @__PURE__ */ new Date());
      const ms = curr - (prevTime || curr);
      self.diff = ms;
      self.prev = prevTime;
      self.curr = curr;
      prevTime = curr;
      args[0] = createDebug.coerce(args[0]);
      if (typeof args[0] !== "string") {
        args.unshift("%O");
      }
      let index = 0;
      args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
        if (match === "%%") {
          return "%";
        }
        index++;
        const formatter = createDebug.formatters[format];
        if (typeof formatter === "function") {
          const val = args[index];
          match = formatter.call(self, val);
          args.splice(index, 1);
          index--;
        }
        return match;
      });
      createDebug.formatArgs.call(self, args);
      const logFn = self.log || createDebug.log;
      logFn.apply(self, args);
    }
    debug.namespace = namespace;
    debug.useColors = createDebug.useColors();
    debug.color = createDebug.selectColor(namespace);
    debug.extend = extend;
    debug.destroy = createDebug.destroy;
    Object.defineProperty(debug, "enabled", {
      enumerable: true,
      configurable: false,
      get: () => {
        if (enableOverride !== null) {
          return enableOverride;
        }
        if (namespacesCache !== createDebug.namespaces) {
          namespacesCache = createDebug.namespaces;
          enabledCache = createDebug.enabled(namespace);
        }
        return enabledCache;
      },
      set: (v) => {
        enableOverride = v;
      }
    });
    if (typeof createDebug.init === "function") {
      createDebug.init(debug);
    }
    return debug;
  }
  function extend(namespace, delimiter) {
    const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
    newDebug.log = this.log;
    return newDebug;
  }
  function enable(namespaces) {
    createDebug.save(namespaces);
    createDebug.namespaces = namespaces;
    createDebug.names = [];
    createDebug.skips = [];
    let i2;
    const split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
    const len = split.length;
    for (i2 = 0; i2 < len; i2++) {
      if (!split[i2]) {
        continue;
      }
      namespaces = split[i2].replace(/\*/g, ".*?");
      if (namespaces[0] === "-") {
        createDebug.skips.push(new RegExp("^" + namespaces.substr(1) + "$"));
      } else {
        createDebug.names.push(new RegExp("^" + namespaces + "$"));
      }
    }
  }
  function disable() {
    const namespaces = [
      ...createDebug.names.map(toNamespace),
      ...createDebug.skips.map(toNamespace).map((namespace) => "-" + namespace)
    ].join(",");
    createDebug.enable("");
    return namespaces;
  }
  function enabled(name) {
    if (name[name.length - 1] === "*") {
      return true;
    }
    let i2;
    let len;
    for (i2 = 0, len = createDebug.skips.length; i2 < len; i2++) {
      if (createDebug.skips[i2].test(name)) {
        return false;
      }
    }
    for (i2 = 0, len = createDebug.names.length; i2 < len; i2++) {
      if (createDebug.names[i2].test(name)) {
        return true;
      }
    }
    return false;
  }
  function toNamespace(regexp) {
    return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, "*");
  }
  function coerce(val) {
    if (val instanceof Error) {
      return val.stack ?? val.message;
    }
    return val;
  }
  function destroy() {
    console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
  }
  createDebug.setupFormatters(createDebug.formatters);
  createDebug.enable(createDebug.load());
  return createDebug;
}
var colors = [6, 2, 3, 4, 5, 1];
if (supports_color_default2.stderr !== false && (supports_color_default2.stderr ?? supports_color_default2).level >= 2) {
  colors = [
    20,
    21,
    26,
    27,
    32,
    33,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    56,
    57,
    62,
    63,
    68,
    69,
    74,
    75,
    76,
    77,
    78,
    79,
    80,
    81,
    92,
    93,
    98,
    99,
    112,
    113,
    128,
    129,
    134,
    135,
    148,
    149,
    160,
    161,
    162,
    163,
    164,
    165,
    166,
    167,
    168,
    169,
    170,
    171,
    172,
    173,
    178,
    179,
    184,
    185,
    196,
    197,
    198,
    199,
    200,
    201,
    202,
    203,
    204,
    205,
    206,
    207,
    208,
    209,
    214,
    215,
    220,
    221
  ];
}
var inspectOpts = Object.keys(define_process_env_default).filter((key) => {
  return /^debug_/i.test(key);
}).reduce((obj, key) => {
  const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k) => {
    return k.toUpperCase();
  });
  let val = define_process_env_default[key];
  if (/^(yes|on|true|enabled)$/i.test(val)) {
    val = true;
  } else if (/^(no|off|false|disabled)$/i.test(val)) {
    val = false;
  } else if (val === "null") {
    val = null;
  } else {
    val = Number(val);
  }
  obj[prop] = val;
  return obj;
}, {});
function useColors() {
  return "colors" in inspectOpts ? Boolean(inspectOpts.colors) : tty.isatty(process.stderr.fd);
}
function formatArgs(args) {
  const { namespace: name, useColors: useColors2 } = this;
  if (useColors2 === true) {
    const c2 = this.color;
    const colorCode = "\x1B[3" + (c2 < 8 ? c2 : "8;5;" + c2);
    const prefix2 = `  ${colorCode};1m${name} \x1B[0m`;
    args[0] = prefix2 + args[0].split("\n").join("\n" + prefix2);
    args.push(colorCode + "m+" + c(this.diff) + "\x1B[0m");
  } else {
    args[0] = getDate() + name + " " + args[0];
  }
}
function getDate() {
  if (inspectOpts.hideDate != null) {
    return "";
  }
  return (/* @__PURE__ */ new Date()).toISOString() + " ";
}
function log2(...args) {
  return process.stderr.write(util2.format(...args) + "\n");
}
function save(namespaces) {
  if (namespaces != null) {
    define_process_env_default.DEBUG = namespaces;
  } else {
    delete define_process_env_default.DEBUG;
  }
}
function load() {
  return define_process_env_default.DEBUG;
}
function init(debug) {
  debug.inspectOpts = {};
  const keys = Object.keys(inspectOpts);
  for (let i2 = 0; i2 < keys.length; i2++) {
    debug.inspectOpts[keys[i2]] = inspectOpts[keys[i2]];
  }
}
function setupFormatters(formatters) {
  formatters.o = function(v) {
    this.inspectOpts.colors = this.useColors;
    return util2.inspect(v, this.inspectOpts).split("\n").map((str) => str.trim()).join(" ");
  };
  formatters.O = function(v) {
    this.inspectOpts.colors = this.useColors;
    return util2.inspect(v, this.inspectOpts);
  };
}
var node_default = setup({ init, log: log2, formatArgs, save, load, useColors, setupFormatters, colors, inspectOpts });
var src_default = node_default;
var logger = getLogger("zubridge");
var debuggers = {
  core: src_default("zubridge:core"),
  ipc: src_default("zubridge:ipc"),
  store: src_default("zubridge:store"),
  adapters: src_default("zubridge:adapters"),
  windows: src_default("zubridge:windows"),
  serialization: src_default("zubridge:serialization")
};
var dynamicDebuggers = /* @__PURE__ */ new Map();
function getDebugger(area) {
  if (area in debuggers) {
    return debuggers[area];
  }
  if (!dynamicDebuggers.has(area)) {
    dynamicDebuggers.set(area, src_default(`zubridge:${area}`));
  }
  const debugFn = dynamicDebuggers.get(area);
  if (!debugFn)
    throw new Error(`Failed to create debugger for area: ${area}`);
  return debugFn;
}
function debugLog(area, ...args) {
  const debugInstance = getDebugger(area);
  debugInstance(args);
  if (area.endsWith(":error")) {
    logger.error(area, ...args);
  } else if (area.endsWith(":warn")) {
    logger.warn(area, ...args);
  } else if (area.endsWith(":info")) {
    logger.info(area, ...args);
  } else {
    logger.debug(area, ...args);
  }
}
var QueueOverflowError = class extends Error {
  constructor(queueSize, maxSize) {
    super(`Action queue overflow: ${queueSize} actions pending, maximum allowed is ${maxSize}`);
    __publicField(this, "queueSize");
    __publicField(this, "maxSize");
    this.name = "QueueOverflowError";
    this.queueSize = queueSize;
    this.maxSize = maxSize;
  }
};
var BaseThunkProcessor = class {
  constructor(options, logPrefix) {
    // Configuration options
    __publicField(this, "actionCompletionTimeoutMs");
    __publicField(this, "maxQueueSize");
    // Action completion tracking
    __publicField(this, "actionCompletionCallbacks", /* @__PURE__ */ new Map());
    __publicField(this, "actionTimeouts", /* @__PURE__ */ new Map());
    this.logPrefix = logPrefix;
    this.actionCompletionTimeoutMs = options.actionCompletionTimeoutMs;
    this.maxQueueSize = options.maxQueueSize;
    debugLog(
      "core",
      `[${this.logPrefix}] Initialized with timeout: ${this.actionCompletionTimeoutMs}ms, maxQueueSize: ${this.maxQueueSize}`
    );
  }
  /**
   * Generate a unique action ID if one doesn't exist
   */
  ensureActionId(action, payload) {
    const actionObj = typeof action === "string" ? { type: action, payload, __id: v4() } : { ...action, __id: action.__id || v4() };
    if (!actionObj.__id) {
      actionObj.__id = v4();
    }
    return actionObj;
  }
  /**
   * Check if queue has capacity and throw QueueOverflowError if not
   */
  checkQueueCapacity(currentSize) {
    if (currentSize >= this.maxQueueSize) {
      const error = new QueueOverflowError(currentSize, this.maxQueueSize);
      debugLog("core:error", `[${this.logPrefix}] Queue overflow: ${error.message}`);
      throw error;
    }
  }
  /**
   * Set up action completion tracking with timeout
   */
  setupActionCompletion(actionId, callback, timeoutCallback) {
    this.actionCompletionCallbacks.set(actionId, callback);
    debugLog("core", `[${this.logPrefix}] Set completion callback for action ${actionId}`);
    const safetyTimeout = setTimeout(() => {
      if (this.actionCompletionCallbacks.has(actionId)) {
        debugLog(
          "core",
          `[${this.logPrefix}] Safety timeout triggered for action ${actionId} after ${this.actionCompletionTimeoutMs}ms`
        );
        if (timeoutCallback) {
          timeoutCallback();
        } else {
          this.completeActionInternal(actionId, { __timeout: true });
        }
      }
    }, this.actionCompletionTimeoutMs);
    this.actionTimeouts.set(actionId, safetyTimeout);
  }
  /**
   * Complete an action and call its callback
   */
  completeActionInternal(actionId, result) {
    const callback = this.actionCompletionCallbacks.get(actionId);
    if (!callback) {
      debugLog("core", `[${this.logPrefix}] No completion callback found for action ${actionId}`);
      return false;
    }
    const timeout = this.actionTimeouts.get(actionId);
    if (timeout) {
      clearTimeout(timeout);
      this.actionTimeouts.delete(actionId);
    }
    try {
      debugLog("core", `[${this.logPrefix}] Action ${actionId} result: ${JSON.stringify(result)}`);
    } catch {
      debugLog("core", `[${this.logPrefix}] Action ${actionId} result: [Non-serializable result]`);
    }
    try {
      callback(result);
      debugLog("core", `[${this.logPrefix}] Completion callback executed for action ${actionId}`);
    } catch (callbackError) {
      debugLog(
        "core:error",
        `[${this.logPrefix}] Error in completion callback for action ${actionId}: ${callbackError}`
      );
    }
    this.actionCompletionCallbacks.delete(actionId);
    return true;
  }
  /**
   * Handle action completion with error checking
   */
  completeAction(actionId, result) {
    debugLog("core", `[${this.logPrefix}] Action completed: ${actionId}`);
    const { error: errorString } = result;
    if (errorString) {
      debugLog(
        "core:error",
        `[${this.logPrefix}] Action ${actionId} completed with error: ${errorString}`
      );
    }
    this.completeActionInternal(actionId, result);
  }
  /**
   * Force cleanup of expired actions and timeouts
   * This prevents memory leaks from stale actions
   */
  forceCleanupExpiredActions() {
    debugLog("core", `[${this.logPrefix}] Force cleaning up expired actions and timeouts`);
    for (const [actionId, timeout] of this.actionTimeouts) {
      debugLog("core", `[${this.logPrefix}] Force clearing timeout for action ${actionId}`);
      clearTimeout(timeout);
    }
    const clearedTimeouts = this.actionTimeouts.size;
    const clearedCallbacks = this.actionCompletionCallbacks.size;
    this.actionTimeouts.clear();
    this.actionCompletionCallbacks.clear();
    debugLog(
      "core",
      `[${this.logPrefix}] Force cleaned up ${clearedTimeouts} timeouts, ${clearedCallbacks} callbacks`
    );
  }
  /**
   * Test method to check queue capacity (for testing purposes)
   */
  testCheckQueueCapacity(currentSize) {
    this.checkQueueCapacity(currentSize);
  }
  /**
   * Destroy and cleanup all resources
   */
  destroy() {
    debugLog("core", `[${this.logPrefix}] Destroying processor instance`);
    this.forceCleanupExpiredActions();
    debugLog("core", `[${this.logPrefix}] Processor instance destroyed`);
  }
};
var Thunk = class {
  constructor(options) {
    /** Unique identifier for this thunk */
    __publicField(this, "id");
    /** ID of the window that dispatched this thunk */
    __publicField(this, "_sourceWindowId");
    /** Parent thunk ID if this is a nested thunk */
    __publicField(this, "parentId");
    /** Thunk source - the process that dispatched this thunk */
    __publicField(this, "source");
    /** Current state of the thunk */
    __publicField(this, "_state");
    /** Time when the thunk was created */
    __publicField(this, "startTime");
    /** Set of child thunk IDs */
    __publicField(this, "children");
    /** Keys this thunk will affect (for key-based locking) */
    __publicField(this, "keys");
    /** Flag for lock bypass */
    __publicField(this, "bypassThunkLock");
    /** Flag for access control bypass */
    __publicField(this, "bypassAccessControl");
    /** ID of the linked execution context */
    __publicField(this, "_contextId");
    this.id = options.id || v4();
    this._sourceWindowId = options.sourceWindowId;
    this.parentId = options.parentId;
    this.source = options.source;
    this._state = "pending";
    this.startTime = Date.now();
    this.children = /* @__PURE__ */ new Set();
    this.keys = options.keys;
    this.bypassThunkLock = options.bypassThunkLock;
    this.bypassAccessControl = options.bypassAccessControl;
    this._contextId = options.contextId;
    debugLog(
      "thunk",
      `Created thunk ${this.id} (type: ${this.source}, bypassThunkLock: ${this.bypassThunkLock})`
    );
  }
  /**
   * Get the source window ID
   */
  get sourceWindowId() {
    return this._sourceWindowId;
  }
  /**
   * Set the source window ID
   */
  set sourceWindowId(windowId) {
    this._sourceWindowId = windowId;
  }
  /**
   * Get the current state of the thunk
   */
  get state() {
    return this._state;
  }
  /**
   * Get the execution context ID
   */
  get contextId() {
    return this._contextId;
  }
  /**
   * Set the execution context ID
   */
  set contextId(contextId) {
    this._contextId = contextId;
  }
  /**
   * Mark the thunk as active (processing)
   */
  activate() {
    this._state = "executing";
  }
  /**
   * Mark the thunk as completed
   */
  complete() {
    this._state = "completed";
  }
  /**
   * Mark the thunk as failed
   */
  fail() {
    this._state = "failed";
  }
  /**
   * Add a child thunk to this thunk
   */
  addChild(childId) {
    this.children.add(childId);
  }
  /**
   * Get all child thunk IDs
   */
  getChildren() {
    return Array.from(this.children);
  }
  /**
   * Check if the thunk is in a terminal state (completed or failed)
   */
  isComplete() {
    return this.state === "completed" || this.state === "failed";
  }
};
var THUNK_PROCESSOR_DEFAULTS = {
  /** Default maximum queue size */
  maxQueueSize: 100,
  /** Platform-specific timeout - Linux gets longer timeout due to slower IPC */
  actionCompletionTimeoutMs: process.platform === "linux" ? 6e4 : 3e4
};
function getThunkProcessorOptions(userOptions) {
  return {
    maxQueueSize: (userOptions == null ? void 0 : userOptions.maxQueueSize) ?? THUNK_PROCESSOR_DEFAULTS.maxQueueSize,
    actionCompletionTimeoutMs: (userOptions == null ? void 0 : userOptions.actionCompletionTimeoutMs) ?? THUNK_PROCESSOR_DEFAULTS.actionCompletionTimeoutMs
  };
}
var RendererThunkProcessor = class extends BaseThunkProcessor {
  constructor(options) {
    const config = getThunkProcessorOptions(options);
    super(config, "RENDERER_THUNK");
    // Current window ID
    __publicField(this, "currentWindowId");
    // Function to send actions to main process
    __publicField(this, "actionSender");
    // Function to register thunks with main process
    __publicField(this, "thunkRegistrar");
    // Function to notify thunk completion
    __publicField(this, "thunkCompleter");
    // Custom state provider function
    __publicField(this, "stateProvider");
    // Queue of pending dispatches (action IDs)
    __publicField(this, "pendingDispatches", /* @__PURE__ */ new Set());
  }
  /**
   * Initialize the processor with all required dependencies
   */
  initialize(options) {
    debugLog("ipc", "[RENDERER_THUNK] Initializing with options:", options);
    this.currentWindowId = options.windowId;
    this.actionSender = options.actionSender;
    this.thunkRegistrar = options.thunkRegistrar;
    this.thunkCompleter = options.thunkCompleter;
    if (options.actionCompletionTimeoutMs !== void 0) {
      this.actionCompletionTimeoutMs = options.actionCompletionTimeoutMs;
      debugLog("ipc", "[RENDERER_THUNK] Updated timeout:", this.actionCompletionTimeoutMs);
    }
    debugLog("ipc", "[RENDERER_THUNK] Action sender:", this.actionSender);
    debugLog("ipc", `[RENDERER_THUNK] Initialized with window ID ${options.windowId}`);
  }
  /**
   * Set a custom state provider function
   * This allows explicitly registering a way to get state after initialization
   */
  setStateProvider(provider) {
    this.stateProvider = provider;
    debugLog("ipc", "[RENDERER_THUNK] Custom state provider registered");
  }
  /**
   * Handle action completion notification
   * This should be called when an action acknowledgment is received from the main process
   */
  completeAction(actionId, result) {
    debugLog("ipc", `[RENDERER_THUNK] Action completed: ${actionId}`);
    super.completeAction(actionId, result);
    this.pendingDispatches.delete(actionId);
    debugLog(
      "ipc",
      `[RENDERER_THUNK] Removed ${actionId} from pending dispatches, remaining: ${this.pendingDispatches.size}`
    );
    if (this.pendingDispatches.size > 0) {
      debugLog(
        "ipc",
        `[RENDERER_THUNK] Remaining dispatch IDs: ${Array.from(this.pendingDispatches).join(", ")}`
      );
    }
  }
  /**
   * Execute a thunk function
   */
  async executeThunk(thunkFn, options, parentId) {
    const thunk = new Thunk({
      sourceWindowId: this.currentWindowId ?? 0,
      source: "renderer",
      parentId,
      bypassAccessControl: (options == null ? void 0 : options.bypassAccessControl) ?? false,
      bypassThunkLock: (options == null ? void 0 : options.bypassThunkLock) ?? false
    });
    debugLog(
      "ipc",
      `[RENDERER_THUNK] Executing thunk ${thunk.id} (bypassThunkLock=${thunk.bypassThunkLock})`
    );
    let isFirstAction = true;
    debugLog("ipc", `[RENDERER_THUNK] Thunk ${thunk.id} bypassThunkLock: ${thunk.bypassThunkLock}`);
    if (this.thunkRegistrar && this.currentWindowId) {
      try {
        debugLog(
          "ipc",
          `[RENDERER_THUNK] Registering thunk ${thunk.id} with main process (bypassThunkLock=${thunk.bypassThunkLock})`
        );
        await this.thunkRegistrar(
          thunk.id,
          parentId,
          options == null ? void 0 : options.bypassThunkLock,
          options == null ? void 0 : options.bypassAccessControl
        );
        debugLog("ipc", `[RENDERER_THUNK] Thunk ${thunk.id} registered successfully`);
      } catch (error) {
        debugLog("ipc:error", `[RENDERER_THUNK] Error registering thunk: ${error}`);
      }
    }
    try {
      const getState = async (getStateOptions) => {
        debugLog("ipc", `[RENDERER_THUNK] getState called for thunk ${thunk.id}`);
        if (this.stateProvider) {
          debugLog("ipc", `[RENDERER_THUNK] Using registered state provider for thunk ${thunk.id}`);
          return this.stateProvider({
            bypassAccessControl: (getStateOptions == null ? void 0 : getStateOptions.bypassAccessControl) ?? thunk.bypassAccessControl
          });
        }
        throw new Error("No state provider available");
      };
      const dispatch = async (action, payload) => {
        debugLog(
          "ipc",
          `[RENDERER_THUNK] [${thunk.id}] Dispatch called (bypassThunkLock=${thunk.bypassThunkLock})`,
          action
        );
        if (typeof action === "function") {
          debugLog("ipc", `[RENDERER_THUNK] Handling nested thunk in ${thunk.id}`);
          return this.executeThunk(action, options, thunk.id);
        }
        const actionObj = this.ensureActionId(action, payload);
        if (thunk.bypassThunkLock) {
          actionObj.__bypassThunkLock = true;
        }
        if (thunk.bypassAccessControl) {
          actionObj.__bypassAccessControl = true;
        }
        const actionId = actionObj.__id;
        debugLog(
          "ipc",
          `[RENDERER_THUNK] Thunk ${thunk.id} dispatching action ${actionObj.type} (${actionId})`
        );
        if (isFirstAction) {
          debugLog("ipc", `[RENDERER_THUNK] Marking action ${actionId} as starting thunk ${thunk.id}`);
          actionObj.__startsThunk = true;
          isFirstAction = false;
        }
        this.checkQueueCapacity(this.pendingDispatches.size);
        this.pendingDispatches.add(actionId);
        debugLog(
          "ipc",
          `[RENDERER_THUNK] Added ${actionId} to pending dispatches, now pending: ${this.pendingDispatches.size}/${this.maxQueueSize}`
        );
        const actionPromise = new Promise((resolve, reject) => {
          this.setupActionCompletion(
            actionId,
            (result2) => {
              const { error: errorString } = result2;
              debugLog(
                "ipc",
                `[RENDERER_THUNK] Action ${actionId} completion callback called with result`,
                result2
              );
              if (errorString) {
                debugLog(
                  "ipc:error",
                  `[RENDERER_THUNK] Rejecting promise for action ${actionId} with error: ${errorString}`
                );
                reject(new Error(errorString));
              } else {
                resolve(result2 || actionObj);
              }
            },
            () => {
              debugLog("ipc", `[RENDERER_THUNK] Safety timeout triggered for action ${actionId}`);
              this.completeAction(actionId, actionObj);
            }
          );
        });
        if (this.actionSender) {
          try {
            debugLog("ipc", `[RENDERER_THUNK] Sending action ${actionId} to main process`);
            await this.actionSender(actionObj, thunk.id);
            debugLog("ipc", `[RENDERER_THUNK] Action ${actionId} sent to main process`);
          } catch (error) {
            this.completeAction(actionId, { error: String(error) });
            this.pendingDispatches.delete(actionId);
            debugLog("ipc:error", `[RENDERER_THUNK] Error sending action ${actionId}:`, error);
            throw error;
          }
        } else {
          debugLog(
            "ipc:error",
            `[RENDERER_THUNK] No action sender configured, cannot send action ${actionId}`
          );
          throw new Error("Action sender not configured for renderer thunk processor");
        }
        return actionPromise;
      };
      debugLog("ipc", `[RENDERER_THUNK] Executing thunk function for ${thunk.id}`);
      const result = await thunkFn(getState, dispatch);
      debugLog("ipc", `[RENDERER_THUNK] Thunk ${thunk.id} execution completed, result:`, result);
      return result;
    } catch (error) {
      debugLog("ipc:error", `[RENDERER_THUNK] Error executing thunk ${thunk.id}:`, error);
      throw error;
    } finally {
      if (this.thunkCompleter && this.currentWindowId) {
        try {
          debugLog("ipc", `[RENDERER_THUNK] Notifying main process of thunk ${thunk.id} completion`);
          await this.thunkCompleter(thunk.id);
          debugLog("ipc", `[RENDERER_THUNK] Thunk ${thunk.id} completion notified`);
        } catch (e2) {
          debugLog("ipc:error", `[RENDERER_THUNK] Error notifying thunk completion: ${e2}`);
        }
      }
    }
  }
  /**
   * Dispatch an action to the main process (for non-thunk scenarios)
   */
  async dispatchAction(action, payload, parentId) {
    var _a;
    debugLog("ipc", "[RENDERER_THUNK] dispatchAction called with:", { action, payload, parentId });
    if (typeof window !== "undefined" && ((_a = window.zubridge) == null ? void 0 : _a.dispatch)) {
      debugLog("ipc", "[RENDERER_THUNK] Using window.zubridge.dispatch for action");
      try {
        if (typeof action === "string") {
          await window.zubridge.dispatch(action, payload);
        } else {
          await window.zubridge.dispatch(action);
        }
        return;
      } catch (error) {
        debugLog("ipc:error", "[RENDERER_THUNK] Error dispatching through window.zubridge:", error);
      }
    }
    if (!this.actionSender) {
      debugLog(
        "ipc:error",
        "[RENDERER_THUNK] dispatchAction: No action sender configured, cannot dispatch."
      );
      throw new Error("Action sender not configured for direct dispatch.");
    }
    const actionObj = this.ensureActionId(action, payload);
    const actionId = actionObj.__id;
    return new Promise((resolve, reject) => {
      var _a2;
      try {
        this.checkQueueCapacity(this.pendingDispatches.size);
      } catch (error) {
        reject(error);
        return;
      }
      this.pendingDispatches.add(actionId);
      debugLog(
        "ipc",
        `[RENDERER_THUNK] Added ${actionId} to pending dispatches, now pending: ${this.pendingDispatches.size}/${this.maxQueueSize}`
      );
      this.setupActionCompletion(
        actionId,
        (result) => {
          const { error: errorString } = result;
          debugLog(
            "ipc",
            `[RENDERER_THUNK] Action ${actionId} completion callback called with result:`,
            result
          );
          if (errorString) {
            debugLog(
              "ipc:error",
              `[RENDERER_THUNK] Rejecting promise for action ${actionId} with error: ${errorString}`
            );
            reject(new Error(errorString));
          } else {
            resolve();
          }
        },
        () => {
          debugLog("ipc", `[RENDERER_THUNK] Safety timeout triggered for action ${actionId}`);
          this.completeAction(actionId, actionObj);
        }
      );
      debugLog(
        "ipc",
        `[RENDERER_THUNK] dispatchAction: Sending action ${actionObj.type} (${actionObj.__id})`
      );
      (_a2 = this.actionSender) == null ? void 0 : _a2.call(this, actionObj, parentId).then(() => {
        debugLog("ipc", `[RENDERER_THUNK] dispatchAction: Action ${actionObj.__id} sent.`);
      }).catch((error) => {
        this.completeAction(actionId, { error: error.message });
        this.pendingDispatches.delete(actionId);
        debugLog("ipc:error", `[RENDERER_THUNK] Error sending action ${actionId}:`, error);
        reject(error);
      });
    });
  }
  /**
   * Force cleanup of expired timeouts and callbacks
   * This prevents memory leaks from stale actions
   */
  forceCleanupExpiredActions() {
    debugLog("ipc", "[RENDERER_THUNK] Force cleaning up expired actions and timeouts");
    super.forceCleanupExpiredActions();
    const clearedDispatches = this.pendingDispatches.size;
    this.pendingDispatches.clear();
    debugLog("ipc", `[RENDERER_THUNK] Force cleaned up ${clearedDispatches} pending dispatches`);
  }
  /**
   * Destroy the processor and cleanup all resources
   */
  destroy() {
    debugLog("ipc", "[RENDERER_THUNK] Destroying RendererThunkProcessor instance");
    this.forceCleanupExpiredActions();
    this.actionSender = void 0;
    this.thunkRegistrar = void 0;
    this.thunkCompleter = void 0;
    this.stateProvider = void 0;
    this.currentWindowId = void 0;
    super.destroy();
  }
};
var ZubridgeError = class extends Error {
  constructor(message, context) {
    super(message);
    __publicField(this, "timestamp");
    __publicField(this, "context");
    this.name = this.constructor.name;
    this.timestamp = Date.now();
    this.context = context;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
  /**
   * Get error details for logging
   */
  getDetails() {
    return {
      name: this.name,
      message: this.message,
      timestamp: this.timestamp,
      context: this.context,
      stack: this.stack
    };
  }
};
var ConfigurationError = class extends ZubridgeError {
  constructor(message, context) {
    super(message, context);
    __publicField(this, "configPath");
    __publicField(this, "expectedType");
    __publicField(this, "actualType");
    this.configPath = context == null ? void 0 : context.configPath;
    this.expectedType = context == null ? void 0 : context.expectedType;
    this.actualType = context == null ? void 0 : context.actualType;
  }
};
function logZubridgeError(error, additionalInfo) {
  const contextName = error.constructor.name.replace("Error", "").toLowerCase();
  debugLog(`${contextName}:error`, `${error.name}:`, {
    ...error.getDetails(),
    ...additionalInfo
  });
}
function setupRendererErrorHandlers() {
  if (typeof window !== "undefined") {
    window.addEventListener("unhandledrejection", (event) => {
      const error = new ConfigurationError("Unhandled promise rejection in renderer process", {
        reason: event.reason instanceof Error ? event.reason.message : String(event.reason),
        originalReason: event.reason
      });
      logZubridgeError(error);
      debugLog("renderer:error", "Unhandled promise rejection detected and logged");
      event.preventDefault();
    });
    window.addEventListener("error", (event) => {
      const error = new ConfigurationError("Uncaught error in renderer process", {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        originalError: event.error
      });
      logZubridgeError(error);
      debugLog("renderer:error", "Uncaught error detected and logged");
    });
    debugLog("renderer", "Global error handlers setup for renderer process");
  }
}
var THUNK_PROCESSOR_DEFAULTS2 = {
  /** Default maximum queue size */
  maxQueueSize: 100,
  /** Platform-specific timeout - Linux gets longer timeout due to slower IPC */
  actionCompletionTimeoutMs: process.platform === "linux" ? 6e4 : 3e4
};
function getThunkProcessorOptions2(userOptions) {
  return {
    maxQueueSize: (userOptions == null ? void 0 : userOptions.maxQueueSize) ?? THUNK_PROCESSOR_DEFAULTS2.maxQueueSize,
    actionCompletionTimeoutMs: (userOptions == null ? void 0 : userOptions.actionCompletionTimeoutMs) ?? THUNK_PROCESSOR_DEFAULTS2.actionCompletionTimeoutMs
  };
}
function getPreloadOptions(userOptions) {
  const thunkProcessorOptions = getThunkProcessorOptions2(userOptions);
  return {
    ...thunkProcessorOptions
    // Add any preload-specific option handling here in the future
  };
}
var preloadBridge = (options) => {
  setupRendererErrorHandlers();
  const listeners = /* @__PURE__ */ new Set();
  let initialized = false;
  const resolvedOptions = getPreloadOptions(options);
  const getThunkProcessorWithConfig = () => {
    debugLog(
      "core",
      `Creating thunk processor with timeout: ${resolvedOptions.actionCompletionTimeoutMs}ms, maxQueueSize: ${resolvedOptions.maxQueueSize} for platform ${process.platform}`
    );
    return new RendererThunkProcessor(resolvedOptions);
  };
  const thunkProcessor = getThunkProcessorWithConfig();
  const pendingThunkRegistrations = /* @__PURE__ */ new Map();
  class CleanupRegistry {
    constructor() {
      __publicField(this, "cleanups", []);
    }
    add(cleanup) {
      this.cleanups.push(cleanup);
    }
    async cleanupAll() {
      const results = await Promise.allSettled(this.cleanups.map((cleanup) => cleanup()));
      results.forEach((result, index) => {
        if (result.status === "rejected") {
          debugLog("cleanup:error", `Cleanup ${index} failed:`, result.reason);
        }
      });
      this.cleanups.length = 0;
    }
  }
  const cleanupRegistry = {
    ipc: new CleanupRegistry(),
    dom: new CleanupRegistry(),
    thunks: new CleanupRegistry(),
    async cleanupAll() {
      await Promise.all([this.ipc.cleanupAll(), this.dom.cleanupAll(), this.thunks.cleanupAll()]);
    }
  };
  const ipcListeners = /* @__PURE__ */ new Map();
  const registerIpcListener = (channel, listener) => {
    try {
      const existingListener = ipcListeners.get(channel);
      if (existingListener) {
        electron.ipcRenderer.removeListener(channel, existingListener);
      }
      electron.ipcRenderer.on(channel, listener);
      ipcListeners.set(channel, listener);
      cleanupRegistry.ipc.add(() => {
        electron.ipcRenderer.removeListener(channel, listener);
        ipcListeners.delete(channel);
      });
    } catch (error) {
      debugLog("ipc:error", `Failed to register IPC listener for channel ${channel}:`, error);
    }
  };
  const trackActionDispatch = (action) => {
    try {
      if (action.__id) {
        debugLog("middleware", `Tracking dispatch of action ${action.__id} (${action.type})`);
        electron.ipcRenderer.send("zubridge:track-action-dispatch", { action });
      }
    } catch (error) {
      debugLog("middleware:error", "Error tracking action dispatch:", error);
    }
  };
  const handlers2 = {
    // Subscribe to state changes
    subscribe(callback) {
      listeners.add(callback);
      debugLog("ipc", "Subscribing to state changes");
      if (listeners.size === 1) {
        debugLog("ipc", "First subscriber - setting up state update listener");
        registerIpcListener("zubridge:state-update", async (_event, payload) => {
          const { updateId, state, thunkId } = payload;
          debugLog("ipc", `Received state update ${updateId} for thunk ${thunkId || "none"}`);
          listeners.forEach((fn) => {
            fn(state);
          });
          debugLog("ipc", `Sending acknowledgment for state update ${updateId}`);
          try {
            const windowId = await electron.ipcRenderer.invoke(
              "zubridge:get-window-id"
              /* GET_WINDOW_ID */
            );
            electron.ipcRenderer.send("zubridge:state-update-ack", {
              updateId,
              windowId,
              thunkId
            });
          } catch (error) {
            debugLog("ipc:error", `Error sending state update acknowledgment: ${error}`);
          }
        });
      }
      return () => {
        debugLog("ipc", "Unsubscribing from state changes");
        listeners.delete(callback);
        if (listeners.size === 0) {
          debugLog("ipc", "Last subscriber removed - cleaning up IPC listeners");
          const stateUpdateListener = ipcListeners.get(
            "zubridge:state-update"
            /* STATE_UPDATE */
          );
          if (stateUpdateListener) {
            electron.ipcRenderer.removeListener("zubridge:state-update", stateUpdateListener);
            ipcListeners.delete(
              "zubridge:state-update"
              /* STATE_UPDATE */
            );
          }
        }
      };
    },
    // Get current state from main process
    async getState(options2) {
      debugLog("ipc", "Getting state from main process");
      return electron.ipcRenderer.invoke("zubridge:get-state", options2);
    },
    // Dispatch actions to main process
    async dispatch(action, payloadOrOptions, options2) {
      debugLog("ipc", "Dispatch called with:", { action, payloadOrOptions, options: options2 });
      let dispatchOptions;
      const isOptions = payloadOrOptions && typeof payloadOrOptions === "object" && !Array.isArray(payloadOrOptions) && ("bypassAccessControl" in payloadOrOptions || "bypassThunkLock" in payloadOrOptions);
      if (isOptions) {
        dispatchOptions = payloadOrOptions;
      } else {
        dispatchOptions = options2 || {};
      }
      const bypassAccessControl = dispatchOptions.bypassAccessControl;
      const bypassThunkLock = dispatchOptions.bypassThunkLock;
      debugLog(
        "ipc",
        `Dispatch called with bypass flags: accessControl=${bypassAccessControl}, thunkLock=${bypassThunkLock}`
      );
      if (typeof action === "function") {
        debugLog(
          "ipc",
          `Executing thunk in renderer, bypassAccessControl=${bypassAccessControl}, bypassThunkLock=${bypassThunkLock}`
        );
        const thunk = action;
        const thunkOptions = {
          bypassAccessControl: !!bypassAccessControl,
          bypassThunkLock: !!bypassThunkLock
        };
        debugLog(
          "ipc",
          `[PRELOAD] Set bypassThunkLock: ${thunkOptions.bypassThunkLock} for thunk execution`
        );
        const thunkResult = await thunkProcessor.executeThunk(thunk, thunkOptions);
        if (thunkResult && typeof thunkResult === "object" && "type" in thunkResult) {
          return {
            ...thunkResult,
            __id: thunkResult.__id || v4()
          };
        }
        if (typeof thunkResult === "string") {
          return {
            type: thunkResult,
            __id: v4()
          };
        }
        return {
          type: "THUNK_RESULT",
          payload: thunkResult,
          __id: v4()
        };
      }
      const actionObj = typeof action === "string" ? {
        type: action,
        payload: !isOptions ? payloadOrOptions : void 0,
        __id: v4()
      } : {
        ...action,
        __id: action.__id || v4()
      };
      if (bypassAccessControl) {
        actionObj.__bypassAccessControl = true;
      }
      if (bypassThunkLock) {
        actionObj.__bypassThunkLock = true;
      }
      debugLog(
        "ipc",
        `Dispatching action: ${actionObj.type}, bypassAccessControl=${!!actionObj.__bypassAccessControl}, bypassThunkLock=${!!actionObj.__bypassThunkLock}`
      );
      trackActionDispatch(actionObj);
      return new Promise((resolve, reject) => {
        const actionId = actionObj.__id;
        const timeoutMs = process.platform === "linux" ? 6e4 : 3e4;
        debugLog(
          "ipc",
          `Setting up acknowledgment timeout of ${timeoutMs}ms for platform ${process.platform}`
        );
        const timeoutId = setTimeout(() => {
          electron.ipcRenderer.removeListener("zubridge:dispatch-ack", ackListener);
          debugLog("ipc:error", `Timeout waiting for acknowledgment of action ${actionId}`);
          reject(new Error(`Timeout waiting for acknowledgment of action ${actionId}`));
        }, timeoutMs);
        const safeResolve = (value) => {
          clearTimeout(timeoutId);
          resolve(value);
        };
        const safeReject = (error) => {
          clearTimeout(timeoutId);
          reject(error);
        };
        const ackListener = (_event, payload) => {
          const ackPayload = payload;
          if (ackPayload && ackPayload.actionId === actionId) {
            electron.ipcRenderer.removeListener("zubridge:dispatch-ack", ackListener);
            if (ackPayload.error) {
              debugLog("ipc:error", `Action ${actionId} failed with error: ${ackPayload.error}`);
              safeReject(new Error(ackPayload.error));
            } else {
              debugLog("ipc", `Action ${actionId} completed successfully`);
              safeResolve(actionObj);
            }
          }
        };
        electron.ipcRenderer.on("zubridge:dispatch-ack", ackListener);
        debugLog("ipc", `Sending action ${actionId} to main process`);
        electron.ipcRenderer.send("zubridge:dispatch", { action: actionObj });
      });
    }
  };
  if (!initialized) {
    initialized = true;
    debugLog("ipc", "Set up IPC acknowledgement listener for thunk processor");
    registerIpcListener("zubridge:dispatch-ack", (_event, payload) => {
      var _a;
      const { actionId, thunkState } = payload || {};
      debugLog("ipc", `Received acknowledgment for action: ${actionId}`);
      if (thunkState) {
        debugLog(
          "ipc",
          `Received thunk state with ${((_a = thunkState == null ? void 0 : thunkState.activeThunks) == null ? void 0 : _a.length) || 0} active thunks`
        );
      }
      debugLog("ipc", `Notifying thunk processor of action completion: ${actionId}`);
      thunkProcessor.completeAction(actionId, payload);
    });
    registerIpcListener(
      "zubridge:register-thunk-ack",
      (_event, payload) => {
        const thunkPayload = payload;
        const { thunkId, success, error } = thunkPayload || {};
        if (thunkId) {
          const entry = pendingThunkRegistrations.get(thunkId);
          if (entry) {
            if (success) {
              entry.resolve();
            } else {
              entry.reject(error || new Error("Thunk registration failed"));
            }
            pendingThunkRegistrations.delete(thunkId);
          }
        }
      }
    );
    void (async () => {
      try {
        const windowId = await electron.ipcRenderer.invoke(
          "zubridge:get-window-id"
          /* GET_WINDOW_ID */
        );
        debugLog("ipc", `Got current window ID: ${windowId}`);
        thunkProcessor.initialize({
          windowId,
          // Function to send actions to main process
          actionSender: async (action, parentId) => {
            debugLog(
              "ipc",
              `Sending action: ${action.type}, id: ${action.__id}${parentId ? `, parent: ${parentId}` : ""}`
            );
            electron.ipcRenderer.send("zubridge:dispatch", { action, parentId });
          },
          // Function to register thunks with main process
          thunkRegistrar: async (thunkId, parentId, bypassThunkLock, bypassAccessControl) => {
            debugLog(
              "ipc",
              `[PRELOAD] Registering thunk: thunkId=${thunkId}, bypassThunkLock=${bypassThunkLock}`
            );
            return new Promise((resolve, reject) => {
              pendingThunkRegistrations.set(thunkId, { resolve, reject });
              electron.ipcRenderer.send("zubridge:register-thunk", {
                thunkId,
                parentId,
                bypassThunkLock,
                bypassAccessControl
              });
            });
          },
          // Function to notify thunk completion
          thunkCompleter: async (thunkId) => {
            debugLog("ipc", `Notifying main process of thunk completion: ${thunkId}`);
            electron.ipcRenderer.send("zubridge:complete-thunk", { thunkId });
          }
        });
        debugLog("ipc", "Renderer thunk processor initialized");
        const subscriptionValidatorAPI = {
          // Get window subscriptions via IPC
          getWindowSubscriptions: async () => {
            try {
              const windowId2 = await electron.ipcRenderer.invoke(
                "zubridge:get-window-id"
                /* GET_WINDOW_ID */
              );
              const result = await electron.ipcRenderer.invoke(
                "zubridge:get-window-subscriptions",
                windowId2
              );
              return Array.isArray(result) ? result : [];
            } catch (error) {
              debugLog("subscription:error", "Error getting window subscriptions:", error);
              return [];
            }
          },
          // Check if window is subscribed to a key
          isSubscribedToKey: async (key) => {
            const subscriptions = await subscriptionValidatorAPI.getWindowSubscriptions();
            if (subscriptions.includes("*")) {
              return true;
            }
            if (subscriptions.includes(key)) {
              return true;
            }
            if (key.includes(".")) {
              const keyParts = key.split(".");
              for (let i2 = 1; i2 <= keyParts.length; i2++) {
                const parentKey = keyParts.slice(0, i2).join(".");
                if (subscriptions.includes(parentKey)) {
                  return true;
                }
              }
            }
            for (const subscription of subscriptions) {
              if (key.startsWith(`${subscription}.`)) {
                return true;
              }
            }
            return false;
          },
          // Validate that we have access to a key
          validateStateAccess: async (key) => {
            const isSubscribed = await subscriptionValidatorAPI.isSubscribedToKey(key);
            if (!isSubscribed) {
              debugLog(
                "subscription:error",
                `State access validation failed: not subscribed to key '${key}'`
              );
              return false;
            }
            return true;
          },
          // Check if a state key exists in an object
          stateKeyExists: (state, key) => {
            if (!key || !state || typeof state !== "object") return false;
            const parts = key.split(".");
            let current = state;
            for (const part of parts) {
              if (current === void 0 || current === null || typeof current !== "object") {
                return false;
              }
              if (!(part in current)) {
                return false;
              }
              current = current[part];
            }
            return true;
          }
        };
        debugLog("ipc", "Exposing subscription validator API to window");
        if (process.contextIsolated) {
          electron.contextBridge.exposeInMainWorld(
            "__zubridge_subscriptionValidator",
            subscriptionValidatorAPI
          );
        } else {
          window.__zubridge_subscriptionValidator = subscriptionValidatorAPI;
        }
        thunkProcessor.setStateProvider((opts) => handlers2.getState(opts));
        debugLog("ipc", "Preload script initialized successfully");
        if (typeof window !== "undefined") {
          const beforeUnloadHandler = () => {
            debugLog("ipc", "Page unloading, performing critical synchronous cleanup");
            performCriticalCleanup();
          };
          const pagehideHandler = async (event) => {
            if (event.persisted) {
              debugLog("ipc", "Page cached, performing partial cleanup");
              await performPartialCleanup();
            } else {
              debugLog("ipc", "Page unloading, performing complete cleanup");
              await performCompleteCleanup();
            }
          };
          const visibilityChangeHandler = () => {
            if (document.visibilityState === "hidden") {
              debugLog("ipc", "Page hidden, cleaning up expired resources");
              performPartialCleanup().catch((error) => {
                debugLog("cleanup:error", "Error during visibility cleanup:", error);
              });
            }
          };
          window.addEventListener("beforeunload", beforeUnloadHandler);
          window.addEventListener("pagehide", pagehideHandler);
          document.addEventListener("visibilitychange", visibilityChangeHandler);
          cleanupRegistry.dom.add(() => {
            window.removeEventListener("beforeunload", beforeUnloadHandler);
            window.removeEventListener("pagehide", pagehideHandler);
            document.removeEventListener("visibilitychange", visibilityChangeHandler);
          });
        }
      } catch (error) {
        debugLog("core:error", "Error initializing preload script:", error);
      }
    })();
  }
  const performPartialCleanup = async () => {
    debugLog("ipc", "Performing partial cleanup of expired resources");
    cleanupRegistry.thunks.add(async () => {
      thunkProcessor.forceCleanupExpiredActions();
    });
    await cleanupRegistry.thunks.cleanupAll();
    if (pendingThunkRegistrations.size > 0) {
      debugLog(
        "ipc",
        `Found ${pendingThunkRegistrations.size} pending thunk registrations during partial cleanup`
      );
    }
  };
  const performCriticalCleanup = () => {
    debugLog("ipc", "Performing critical synchronous cleanup");
    listeners.clear();
    for (const [thunkId, { reject }] of pendingThunkRegistrations) {
      try {
        reject(new Error("Page unload - thunk registration cancelled"));
      } catch (error) {
        console.error(`Error rejecting thunk registration ${thunkId}:`, error);
      }
    }
    pendingThunkRegistrations.clear();
  };
  const performCompleteCleanup = async () => {
    debugLog("ipc", "Performing complete cleanup of all resources");
    cleanupRegistry.thunks.add(async () => {
      thunkProcessor.destroy();
    });
    cleanupRegistry.thunks.add(async () => {
      const pendingCount = pendingThunkRegistrations.size;
      for (const [thunkId, { reject }] of pendingThunkRegistrations) {
        try {
          reject(new Error("Complete cleanup - thunk registration cancelled"));
        } catch (error) {
          debugLog("ipc:error", `Error rejecting pending thunk registration ${thunkId}:`, error);
        }
      }
      pendingThunkRegistrations.clear();
      debugLog("ipc", `Cleaned up ${pendingCount} pending registrations`);
    });
    await cleanupRegistry.cleanupAll();
    listeners.clear();
    debugLog("ipc", "Complete cleanup finished successfully");
  };
  return {
    handlers: handlers2,
    initialized
  };
};
const { handlers } = preloadBridge();
electron.contextBridge.exposeInMainWorld("zubridge", handlers);
