#!/usr/bin/env node
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/cli.ts
var import_yargs = __toESM(require("yargs"));
var import_helpers = require("yargs/helpers");

// src/genDir.ts
var import_minimatch = require("minimatch");

// src/io.ts
var import_path = require("path");
var import_promises = require("fs/promises");
async function* getFiles(dir, rel) {
  const dirents = await (0, import_promises.readdir)(dir, { withFileTypes: true });
  for (const dirent of dirents) {
    const res = (0, import_path.resolve)(dir, dirent.name);
    if (dirent.isDirectory()) {
      yield* getFiles(res, rel || dir);
    } else {
      yield (0, import_path.relative)(rel || dir, res);
    }
  }
}

// src/genDir.ts
var import_os = require("os");
var import_path2 = require("path");

// src/balance.ts
function balance(arr, n, shaking) {
  let roll = 0;
  let result = Array(n);
  let shaker = false;
  for (let i = 0; i < arr.length; i++) {
    let o = arr[i];
    if (!o) {
      console.warn(`idx ${arr.length - (i + 1)} undef.`);
    }
    if (!result[roll])
      result[roll] = [];
    result[roll].push(o);
    roll++;
    if (roll >= result.length)
      roll = 0;
  }
  if (shaking) {
    for (let i = 0; i < result.length; i++) {
      if (i % 2 == 0 && result[i])
        result[i] = result[i].reverse();
    }
  }
  return result.filter((e) => e.length);
}

// src/genDir.ts
var import_promises2 = require("fs/promises");
var import_long = __toESM(require("long"));

// src/work/esbuild/worker_generator_code.js
var worker_generator_code_default = `var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/worker_generator.ts
var import_worker_threads = require("worker_threads");

// src/genFile.ts
var import_fs = require("fs");
var import_promises = require("fs/promises");
var import_path = require("path");
var import_long = __toESM(require("long"));
var import_xxhash_addon = require("xxhash-addon");
async function genFileReference(path, relPath, maxChunk, skipHash, threadId, log) {
  if (!log)
    log = function(data, ms) {
      console.log(
        \`\\x1B[2m\${(/* @__PURE__ */ new Date()).toLocaleString("ru-RU")}\${ms ? \` \${ms}\` : \`\`}\\x1B[0m\\x1B[0m \${\`genFile\`}:  \\x1B[0m \${data}\`
      );
    };
  let s = await (0, import_promises.stat)((0, import_path.resolve)(path, relPath));
  if (!s.isFile())
    return void 0;
  let chunkLength = 0;
  let chunkStart = 0;
  let isChunked = false;
  let xxh32;
  let h = new import_xxhash_addon.XXHash32(Buffer.from([0, 0, 0, 0]));
  if (skipHash)
    xxh32 = void 0;
  else {
    if (s.size > maxChunk && maxChunk != 0) {
      let maxOffset = s.size - maxChunk;
      chunkStart = Math.floor(Math.random() * (maxOffset - 0) + 0);
      chunkLength = maxChunk;
      isChunked = true;
    } else
      chunkLength = s.size;
    let time = Date.now();
    let readStream = (0, import_fs.createReadStream)((0, import_path.resolve)(path, relPath), { start: chunkStart, end: chunkStart + chunkLength, highWaterMark: (
      /*100M*/
      1024 * 1024 * 100
    ) });
    await new Promise((rr) => {
      readStream.on("readable", () => {
        let chunk = readStream.read();
        if (chunk) {
          h.update(chunk);
        }
      });
      readStream.on("end", () => {
        rr();
      });
    });
    xxh32 = h.digest().readUInt32BE(0);
    log(\`\${relPath}\`, Date.now() - time);
    if (!readStream.closed)
      readStream.close();
  }
  return {
    chunkLength,
    chunkStart,
    isChunked,
    filedate: s.mtimeMs,
    fileLength: s.size,
    relativePath: relPath.replaceAll("\\\\", "/"),
    xxh32: new import_long.default(xxh32)
  };
}

// src/balance.ts
function balance(arr, n, shaking) {
  let roll = 0;
  let result = Array(n);
  let shaker = false;
  for (let i = 0; i < arr.length; i++) {
    let o = arr[i];
    if (!o) {
      console.warn(\`idx \${arr.length - (i + 1)} undef.\`);
    }
    if (!result[roll])
      result[roll] = [];
    result[roll].push(o);
    roll++;
    if (roll >= result.length)
      roll = 0;
  }
  if (shaking) {
    for (let i = 0; i < result.length; i++) {
      if (i % 2 == 0 && result[i])
        result[i] = result[i].reverse();
    }
  }
  return result.filter((e) => e.length);
}

// src/worker_generator.ts
(async function() {
  let ref = [];
  async function hash(tasks) {
    for (var { dir, file, maxChunk, skipHash, limit } of tasks) {
      let startTime = Date.now();
      let result = await genFileReference(dir, file, maxChunk, skipHash, import_worker_threads.workerData.thread);
      if (result == void 0)
        console.log(\`\${file} \\x1B[31mfailed\\x1B[0m\`);
      else
        ref.push(result);
    }
  }
  let promises = [];
  let balancedTasks = balance(import_worker_threads.workerData.tasks, 2);
  for (var t of balancedTasks) {
    promises.push(hash(t));
  }
  await Promise.all(promises);
  import_worker_threads.parentPort.postMessage({ result: ref });
})();
`;

// src/work/worker.ts
var import_worker_threads = require("worker_threads");

// src/work/electronFix.js
var electronFix_default = ``;

// src/work/worker.ts
async function createWorker(code, data, events) {
  return new Promise(function(resolve9, reject) {
    const worker = new import_worker_threads.Worker(electronFix_default + code, {
      workerData: { cwd: __dirname, ...data },
      eval: true
    });
    worker.on("message", (data2) => {
      if (data2.result)
        resolve9(data2.result);
      if (data2.event) {
        if (events[data2.event.$])
          events[data2.event.$](data2.event.data);
      }
    });
    worker.on("error", (msg) => {
      console.error(msg);
      reject(`ERROR: ${msg}`);
    });
  });
}

// src/work/generate.ts
function worker_generateIntegrityEntry(data) {
  return createWorker(worker_generator_code_default, data);
}

// src/work/esbuild/worker_verifier_code.js
var worker_verifier_code_default = `var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/worker_verifier.ts
var import_worker_threads = require("worker_threads");

// src/genFile.ts
var import_fs = require("fs");
var import_promises = require("fs/promises");
var import_path = require("path");
var import_long = __toESM(require("long"));
var import_xxhash_addon = require("xxhash-addon");
function longtonum(l) {
  return new import_long.default(l.low, l.high, l.unsigned).toNumber();
}
async function verifyFileReference(path, entry, threadId = 0) {
  if (!(0, import_fs.existsSync)((0, import_path.resolve)(path, entry.relativePath))) {
    return { result: false, reason: "not-exists", filePath: path, entry, source: entry.source };
  }
  let s = await (0, import_promises.stat)((0, import_path.resolve)(path, entry.relativePath));
  if (!new import_long.default(entry.fileLength.low, entry.fileLength.high, entry.fileLength.unsigned).equals(s.size)) {
    let l = new import_long.default(entry.fileLength.low, entry.fileLength.high, entry.fileLength.unsigned);
    return { result: false, reason: "length-mismatch", filePath: path, entry, source: entry.source };
  }
  let start, length;
  let chunkStart = longtonum(entry.chunkStart);
  let chunkLength = longtonum(entry.chunkLength);
  if (!entry.xxh32 || entry.xxh32 === 0 || // @ts-ignore
  new import_long.default(entry.xxh32.low, entry.xxh32.high, entry.xxh32.unsigned).equals(0))
    return { result: true, reason: "successful-compare-without-hash", filePath: path, entry, source: entry.source };
  let readStream = await (0, import_fs.createReadStream)((0, import_path.resolve)(path, entry.relativePath), { start: chunkStart, end: chunkStart + chunkLength, highWaterMark: (
    /*100M*/
    1024 * 1024 * 100
  ) });
  let h = new import_xxhash_addon.XXHash32(Buffer.from([0, 0, 0, 0]));
  await new Promise((rr) => {
    readStream.on("readable", () => {
      let chunk = readStream.read();
      if (chunk) {
        h.update(chunk);
      }
    });
    readStream.on("end", () => {
      rr();
    });
  });
  let xxh32 = h.digest().readUInt32BE(0);
  let entry_xxh32 = entry.xxh32;
  if (!new import_long.default(entry_xxh32.low, entry_xxh32.high, entry_xxh32.unsigned).equals(xxh32)) {
    return { result: false, reason: "xxh32-mismatch", filePath: path, entry, source: entry.source };
  }
  return { result: true, reason: "successful-compare", filePath: path, entry, source: entry.source };
}

// src/biglong.ts
function BigLongL(l) {
  if (typeof l === "bigint")
    return BigInt(l);
  if (typeof l == "number")
    return BigInt(Number(l));
  return BigLong(l.low, l.high, l.unsigned);
}
function BigLong(low, high, unsigned) {
  low = BigInt.asUintN(32, BigInt(low));
  high = BigInt.asUintN(32, BigInt(high));
  var combined = high << 32n | low;
  return unsigned ? BigInt.asUintN(64, combined) : BigInt.asIntN(64, combined);
}

// src/worker_verifier.ts
(async function() {
  let bytesVerified = 0n;
  let progressInterval = setInterval(() => {
    if (bytesVerified > 0) {
      import_worker_threads.parentPort.postMessage({ event: {
        $: "progress",
        data: bytesVerified
      } });
      bytesVerified = 0n;
    }
  }, 150);
  let workerResult = [];
  for (var { dir, entry } of import_worker_threads.workerData.tasks) {
    let startTime = Date.now();
    let result = await verifyFileReference(dir, entry, import_worker_threads.workerData.thread);
    workerResult.push(result);
    bytesVerified += BigLongL(entry.chunkLength ?? entry.fileLength);
    if (import_worker_threads.workerData.cliLog) {
      if (result.reason != "successful-compare")
        console.log(\`\${entry.relativePath} -> \${result.reason} [\${Date.now() - startTime}ms]\`);
    }
  }
  clearInterval(progressInterval);
  import_worker_threads.parentPort.postMessage({ result: workerResult });
})();
`;

// src/work/verify.ts
function worker_verifyIntegrityEntry(data, events) {
  return createWorker(worker_verifier_code_default, data, events);
}

// src/biglong.ts
function BigLongL(l) {
  if (typeof l === "bigint")
    return BigInt(l);
  if (typeof l == "number")
    return BigInt(Number(l));
  return BigLong(l.low, l.high, l.unsigned);
}
function BigLong(low, high, unsigned) {
  low = BigInt.asUintN(32, BigInt(low));
  high = BigInt.asUintN(32, BigInt(high));
  var combined = high << 32n | low;
  return unsigned ? BigInt.asUintN(64, combined) : BigInt.asIntN(64, combined);
}

// src/genDir.ts
async function verifyDirReference(dir, entries, cli, onProgress) {
  let tasks = entries.map((entry) => {
    return { dir, entry };
  });
  let alreadyDone = 0n;
  let totalBytes = entries.reduce((a, b) => a + BigLongL(b.chunkLength), 0n);
  tasks = tasks.sort((b, a) => new import_long.default(a.entry.chunkLength.low, a.entry.chunkLength.high, a.entry.chunkLength.unsigned).compare(new import_long.default(b.entry.chunkLength.low, b.entry.chunkLength.high, b.entry.chunkLength.unsigned)));
  let r = await Promise.all(balance(tasks, (0, import_os.cpus)().length, true).map((e, i) => {
    return worker_verifyIntegrityEntry({ thread: i, cliLog: cli, tasks: e }, {
      progress(bytes) {
        alreadyDone += bytes;
        if (onProgress) {
          onProgress(alreadyDone, totalBytes);
        }
      }
    });
  })).then((e) => e.flat(2)).then((r2) => {
    return r2;
  });
  return r;
}
async function genDirReference(dir, rules, limit, multithreaded) {
  let ref = [];
  let generateTasks = [];
  let getFilesDir = getFiles(dir);
  for await (let file of getFilesDir) {
    let applyRule = { ignore: false, skipHash: false, maxChunk: 0 };
    let ignore = false;
    for (var r in rules) {
      if ((0, import_minimatch.minimatch)(file, r, { nocase: true, dot: true })) {
        let currentRule = rules[r];
        if (currentRule.ignore) {
          process.stdout.write(` \x1B[35mignored\x1B[0m`);
          ignore = true;
          continue;
        }
        if (currentRule.skipHash) {
          applyRule.skipHash = true;
          process.stdout.write(" \x1B[34mskipHash\x1B[0m");
        }
        if (currentRule.maxChunk && currentRule.maxChunk != 0) {
          applyRule.maxChunk = currentRule.maxChunk;
          process.stdout.write(` \x1B[36m\x1B[2mmaxChunk\x1B[0m=\x1B[36m${applyRule.maxChunk}\x1B[0m`);
        }
      }
    }
    if (ignore)
      continue;
    if (multithreaded)
      generateTasks.push({
        type: "generate",
        dir,
        file,
        maxChunk: applyRule.maxChunk,
        skipHash: applyRule.skipHash,
        limit,
        size: (await (0, import_promises2.stat)((0, import_path2.resolve)(dir, file))).size
      });
  }
  if (multithreaded) {
    generateTasks = generateTasks.sort((b, a) => a.size - b.size);
    let workResult = (await Promise.all(
      balance(generateTasks, (0, import_os.cpus)().length * 2, true).map((e, i) => {
        return worker_generateIntegrityEntry({ thread: i, tasks: e });
      })
    )).flat(2);
    return workResult;
  } else
    return ref;
}

// src/util/rules.ts
var import_node_fs = require("node:fs");
var YAML = __toESM(require("yaml"));

// src/strval.ts
function strval(v) {
  if (v == "0")
    return 0;
  try {
    let on = JSON.parse(v);
    if (on)
      return on;
  } catch (e) {
    return v;
  }
}

// src/util/rules.ts
function ruleValue(val) {
  if (typeof val !== "string")
    return val;
  let vall = val;
  if (val.toString().endsWith("b"))
    vall = val.toString().substring(0, val.toString().length - 1);
  if (vall.toString().toLowerCase().endsWith("k"))
    return Number(vall.toString().toLowerCase().replace("k", "")) * 1024;
  else if (vall.toString().toLowerCase().endsWith("m"))
    return Number(vall.toString().toLowerCase().replace("m", "")) * 1024 * 1024;
  else if (vall.toString().toLowerCase().endsWith("g"))
    return Number(vall.toString().toLowerCase().replace("g", "")) * 1024 * 1024 * 1024;
  else if (vall.toString().toLowerCase().endsWith("t"))
    return Number(vall.toString().toLowerCase().replace("t", "")) * 1024 * 1024 * 1024 * 1024;
  else
    return val;
}
function readRules(rulesetPath, rules) {
  let r = {};
  if (rulesetPath) {
    let ruleset = YAML.parse((0, import_node_fs.readFileSync)(rulesetPath, "utf8"));
    for (let [key, rule] of Object.entries(ruleset)) {
      for (let key2 in rule) {
        if (key2 == "maxChunk")
          rule[key2] = ruleValue(rule[key2]);
        if (key2.includes(".")) {
          let i = 0;
          let target = rule;
          for (var k of key2.split(".")) {
            i++;
            if (!target[k]) {
              if (i == key2.split(".").length) {
                if (k == "size" || k == "divide")
                  target[k] = ruleValue(rule[key2]);
                else
                  target[k] = rule[key2];
              } else
                target[k] = {};
            }
            target = target[k];
          }
        }
      }
    }
    r = ruleset;
  }
  if (rules) {
    for (let rule of rules) {
      var glob = rule.split(":")[0];
      var rules = rule.split(":")[1].replaceAll(" ", "").split(",");
      let result = { ignore: false, maxChunk: 0, skipHash: false };
      for (var ruleEntry of rules) {
        let val = void 0;
        let key = "";
        if (!ruleEntry.includes("=")) {
          val = true;
          key = ruleEntry;
        } else {
          val = strval(ruleEntry.split("=")[1]);
          key = ruleEntry.split("=")[0];
        }
        if (typeof val !== "undefined") {
          if (val.toString().toLowerCase().endsWith("k"))
            val = Number(val.toString().replace("k", "")) * 1024;
          else if (val.toString().toLowerCase().endsWith("m"))
            val = Number(val.toString().replace("m", "")) * 1024 * 1024;
          else if (val.toString().toLowerCase().endsWith("g"))
            val = Number(val.toString().replace("g", "")) * 1024 * 1024 * 1024;
          else if (val.toString().toLowerCase().endsWith("t"))
            val = Number(val.toString().replace("t", "")) * 1024 * 1024 * 1024 * 1024;
        } else
          console.warn(`warning: value of rule "${key}" is undefined`);
        let target = result;
        let i = 0;
        for (var k of key.split(".")) {
          i++;
          if (!target[k]) {
            if (i == key.split(".").length)
              target[k] = val;
            else
              target[k] = {};
          }
          target = target[k];
        }
        target = val;
        if (!["ignore", "skipHash", "maxChunk", "pack.name", "pack.divide", "pack.exclusive", "pack.compression", "pack.method"].includes(key))
          console.log(`warning: unknown rule key "${key}"`);
        r[glob] = result;
      }
    }
  }
  return r;
}

// src/util/log.ts
function log_default(mod) {
  function log6(data, color, type) {
    if (data.toString().endsWith("\n"))
      data = data.toString().slice(0, -1);
    console.log(
      `${color}\x1B[2m${(/* @__PURE__ */ new Date()).toLocaleString("ru-RU")}\x1B[0m\x1B[0m${color} ${mod}:  \x1B[0m ${data}`
    );
  }
  return {
    log: (data) => log6(data, "", "info   "),
    err: (data) => log6(data, "\x1B[30m", "error  "),
    warn: (data) => log6(data, "\x1B[33m", "warning"),
    su: (data) => log6(data, "\x1B[32m", "success")
  };
}

// src/cli/new.ts
var import_promises5 = require("fs/promises");

// src/proto/ref.js
var import_protobufjs = __toESM(require("protobufjs"));
var $Reader = import_protobufjs.default.Reader;
var $Writer = import_protobufjs.default.Writer;
var $util = import_protobufjs.default.util;
var $root = import_protobufjs.default.roots["default"] || (import_protobufjs.default.roots["default"] = {});
var IntegrityReference = $root.IntegrityReference = (() => {
  function IntegrityReference2(properties) {
    this.entries = [];
    this.packs = [];
    this.splitFiles = [];
    if (properties) {
      for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
        if (properties[keys[i]] != null)
          this[keys[i]] = properties[keys[i]];
    }
  }
  IntegrityReference2.prototype.version = 0;
  IntegrityReference2.prototype.uuid = "";
  IntegrityReference2.prototype.createdDate = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;
  IntegrityReference2.prototype.contentVersion = 0;
  IntegrityReference2.prototype.entries = $util.emptyArray;
  IntegrityReference2.prototype.packs = $util.emptyArray;
  IntegrityReference2.prototype.splitFiles = $util.emptyArray;
  IntegrityReference2.create = function create(properties) {
    return new IntegrityReference2(properties);
  };
  IntegrityReference2.encode = function encode(message, writer) {
    if (!writer)
      writer = $Writer.create();
    if (message.version != null && Object.hasOwnProperty.call(message, "version"))
      writer.uint32(
        /* id 1, wireType 0 =*/
        8
      ).int32(message.version);
    if (message.uuid != null && Object.hasOwnProperty.call(message, "uuid"))
      writer.uint32(
        /* id 2, wireType 2 =*/
        18
      ).string(message.uuid);
    if (message.createdDate != null && Object.hasOwnProperty.call(message, "createdDate"))
      writer.uint32(
        /* id 3, wireType 0 =*/
        24
      ).int64(message.createdDate);
    if (message.contentVersion != null && Object.hasOwnProperty.call(message, "contentVersion"))
      writer.uint32(
        /* id 4, wireType 0 =*/
        32
      ).int32(message.contentVersion);
    if (message.entries != null && message.entries.length)
      for (let i = 0; i < message.entries.length; ++i)
        $root.IntegrityEntry.encode(message.entries[i], writer.uint32(
          /* id 5, wireType 2 =*/
          42
        ).fork()).ldelim();
    if (message.packs != null && message.packs.length)
      for (let i = 0; i < message.packs.length; ++i)
        $root.IntegrityPack.encode(message.packs[i], writer.uint32(
          /* id 6, wireType 2 =*/
          50
        ).fork()).ldelim();
    if (message.splitFiles != null && message.splitFiles.length)
      for (let i = 0; i < message.splitFiles.length; ++i)
        $root.IntegritySplit.encode(message.splitFiles[i], writer.uint32(
          /* id 7, wireType 2 =*/
          58
        ).fork()).ldelim();
    return writer;
  };
  IntegrityReference2.encodeDelimited = function encodeDelimited(message, writer) {
    return this.encode(message, writer).ldelim();
  };
  IntegrityReference2.decode = function decode(reader, length) {
    if (!(reader instanceof $Reader))
      reader = $Reader.create(reader);
    let end = length === void 0 ? reader.len : reader.pos + length, message = new $root.IntegrityReference();
    while (reader.pos < end) {
      let tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          message.version = reader.int32();
          break;
        }
        case 2: {
          message.uuid = reader.string();
          break;
        }
        case 3: {
          message.createdDate = reader.int64();
          break;
        }
        case 4: {
          message.contentVersion = reader.int32();
          break;
        }
        case 5: {
          if (!(message.entries && message.entries.length))
            message.entries = [];
          message.entries.push($root.IntegrityEntry.decode(reader, reader.uint32()));
          break;
        }
        case 6: {
          if (!(message.packs && message.packs.length))
            message.packs = [];
          message.packs.push($root.IntegrityPack.decode(reader, reader.uint32()));
          break;
        }
        case 7: {
          if (!(message.splitFiles && message.splitFiles.length))
            message.splitFiles = [];
          message.splitFiles.push($root.IntegritySplit.decode(reader, reader.uint32()));
          break;
        }
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  };
  IntegrityReference2.decodeDelimited = function decodeDelimited(reader) {
    if (!(reader instanceof $Reader))
      reader = new $Reader(reader);
    return this.decode(reader, reader.uint32());
  };
  IntegrityReference2.verify = function verify(message) {
    if (typeof message !== "object" || message === null)
      return "object expected";
    if (message.version != null && message.hasOwnProperty("version")) {
      if (!$util.isInteger(message.version))
        return "version: integer expected";
    }
    if (message.uuid != null && message.hasOwnProperty("uuid")) {
      if (!$util.isString(message.uuid))
        return "uuid: string expected";
    }
    if (message.createdDate != null && message.hasOwnProperty("createdDate")) {
      if (!$util.isInteger(message.createdDate) && !(message.createdDate && $util.isInteger(message.createdDate.low) && $util.isInteger(message.createdDate.high)))
        return "createdDate: integer|Long expected";
    }
    if (message.contentVersion != null && message.hasOwnProperty("contentVersion")) {
      if (!$util.isInteger(message.contentVersion))
        return "contentVersion: integer expected";
    }
    if (message.entries != null && message.hasOwnProperty("entries")) {
      if (!Array.isArray(message.entries))
        return "entries: array expected";
      for (let i = 0; i < message.entries.length; ++i) {
        let error = $root.IntegrityEntry.verify(message.entries[i]);
        if (error)
          return "entries." + error;
      }
    }
    if (message.packs != null && message.hasOwnProperty("packs")) {
      if (!Array.isArray(message.packs))
        return "packs: array expected";
      for (let i = 0; i < message.packs.length; ++i) {
        let error = $root.IntegrityPack.verify(message.packs[i]);
        if (error)
          return "packs." + error;
      }
    }
    if (message.splitFiles != null && message.hasOwnProperty("splitFiles")) {
      if (!Array.isArray(message.splitFiles))
        return "splitFiles: array expected";
      for (let i = 0; i < message.splitFiles.length; ++i) {
        let error = $root.IntegritySplit.verify(message.splitFiles[i]);
        if (error)
          return "splitFiles." + error;
      }
    }
    return null;
  };
  IntegrityReference2.fromObject = function fromObject(object) {
    if (object instanceof $root.IntegrityReference)
      return object;
    let message = new $root.IntegrityReference();
    if (object.version != null)
      message.version = object.version | 0;
    if (object.uuid != null)
      message.uuid = String(object.uuid);
    if (object.createdDate != null) {
      if ($util.Long)
        (message.createdDate = $util.Long.fromValue(object.createdDate)).unsigned = false;
      else if (typeof object.createdDate === "string")
        message.createdDate = parseInt(object.createdDate, 10);
      else if (typeof object.createdDate === "number")
        message.createdDate = object.createdDate;
      else if (typeof object.createdDate === "object")
        message.createdDate = new $util.LongBits(object.createdDate.low >>> 0, object.createdDate.high >>> 0).toNumber();
    }
    if (object.contentVersion != null)
      message.contentVersion = object.contentVersion | 0;
    if (object.entries) {
      if (!Array.isArray(object.entries))
        throw TypeError(".IntegrityReference.entries: array expected");
      message.entries = [];
      for (let i = 0; i < object.entries.length; ++i) {
        if (typeof object.entries[i] !== "object")
          throw TypeError(".IntegrityReference.entries: object expected");
        message.entries[i] = $root.IntegrityEntry.fromObject(object.entries[i]);
      }
    }
    if (object.packs) {
      if (!Array.isArray(object.packs))
        throw TypeError(".IntegrityReference.packs: array expected");
      message.packs = [];
      for (let i = 0; i < object.packs.length; ++i) {
        if (typeof object.packs[i] !== "object")
          throw TypeError(".IntegrityReference.packs: object expected");
        message.packs[i] = $root.IntegrityPack.fromObject(object.packs[i]);
      }
    }
    if (object.splitFiles) {
      if (!Array.isArray(object.splitFiles))
        throw TypeError(".IntegrityReference.splitFiles: array expected");
      message.splitFiles = [];
      for (let i = 0; i < object.splitFiles.length; ++i) {
        if (typeof object.splitFiles[i] !== "object")
          throw TypeError(".IntegrityReference.splitFiles: object expected");
        message.splitFiles[i] = $root.IntegritySplit.fromObject(object.splitFiles[i]);
      }
    }
    return message;
  };
  IntegrityReference2.toObject = function toObject(message, options) {
    if (!options)
      options = {};
    let object = {};
    if (options.arrays || options.defaults) {
      object.entries = [];
      object.packs = [];
      object.splitFiles = [];
    }
    if (options.defaults) {
      object.version = 0;
      object.uuid = "";
      if ($util.Long) {
        let long = new $util.Long(0, 0, false);
        object.createdDate = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
      } else
        object.createdDate = options.longs === String ? "0" : 0;
      object.contentVersion = 0;
    }
    if (message.version != null && message.hasOwnProperty("version"))
      object.version = message.version;
    if (message.uuid != null && message.hasOwnProperty("uuid"))
      object.uuid = message.uuid;
    if (message.createdDate != null && message.hasOwnProperty("createdDate"))
      if (typeof message.createdDate === "number")
        object.createdDate = options.longs === String ? String(message.createdDate) : message.createdDate;
      else
        object.createdDate = options.longs === String ? $util.Long.prototype.toString.call(message.createdDate) : options.longs === Number ? new $util.LongBits(message.createdDate.low >>> 0, message.createdDate.high >>> 0).toNumber() : message.createdDate;
    if (message.contentVersion != null && message.hasOwnProperty("contentVersion"))
      object.contentVersion = message.contentVersion;
    if (message.entries && message.entries.length) {
      object.entries = [];
      for (let j = 0; j < message.entries.length; ++j)
        object.entries[j] = $root.IntegrityEntry.toObject(message.entries[j], options);
    }
    if (message.packs && message.packs.length) {
      object.packs = [];
      for (let j = 0; j < message.packs.length; ++j)
        object.packs[j] = $root.IntegrityPack.toObject(message.packs[j], options);
    }
    if (message.splitFiles && message.splitFiles.length) {
      object.splitFiles = [];
      for (let j = 0; j < message.splitFiles.length; ++j)
        object.splitFiles[j] = $root.IntegritySplit.toObject(message.splitFiles[j], options);
    }
    return object;
  };
  IntegrityReference2.prototype.toJSON = function toJSON() {
    return this.constructor.toObject(this, import_protobufjs.default.util.toJSONOptions);
  };
  IntegrityReference2.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
    if (typeUrlPrefix === void 0) {
      typeUrlPrefix = "type.googleapis.com";
    }
    return typeUrlPrefix + "/IntegrityReference";
  };
  return IntegrityReference2;
})();
var IntegrityPack = $root.IntegrityPack = (() => {
  function IntegrityPack2(properties) {
    if (properties) {
      for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
        if (properties[keys[i]] != null)
          this[keys[i]] = properties[keys[i]];
    }
  }
  IntegrityPack2.prototype.name = "";
  IntegrityPack2.prototype.type = "";
  IntegrityPack2.prototype.method = "";
  IntegrityPack2.prototype.compression = 0;
  IntegrityPack2.prototype.totalFilesSize = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;
  IntegrityPack2.prototype.packSize = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;
  IntegrityPack2.prototype.splitFileName = null;
  IntegrityPack2.prototype.splitPartName = null;
  let $oneOfFields;
  Object.defineProperty(IntegrityPack2.prototype, "_splitFileName", {
    get: $util.oneOfGetter($oneOfFields = ["splitFileName"]),
    set: $util.oneOfSetter($oneOfFields)
  });
  Object.defineProperty(IntegrityPack2.prototype, "_splitPartName", {
    get: $util.oneOfGetter($oneOfFields = ["splitPartName"]),
    set: $util.oneOfSetter($oneOfFields)
  });
  IntegrityPack2.create = function create(properties) {
    return new IntegrityPack2(properties);
  };
  IntegrityPack2.encode = function encode(message, writer) {
    if (!writer)
      writer = $Writer.create();
    if (message.name != null && Object.hasOwnProperty.call(message, "name"))
      writer.uint32(
        /* id 1, wireType 2 =*/
        10
      ).string(message.name);
    if (message.type != null && Object.hasOwnProperty.call(message, "type"))
      writer.uint32(
        /* id 2, wireType 2 =*/
        18
      ).string(message.type);
    if (message.method != null && Object.hasOwnProperty.call(message, "method"))
      writer.uint32(
        /* id 3, wireType 2 =*/
        26
      ).string(message.method);
    if (message.compression != null && Object.hasOwnProperty.call(message, "compression"))
      writer.uint32(
        /* id 4, wireType 0 =*/
        32
      ).int32(message.compression);
    if (message.totalFilesSize != null && Object.hasOwnProperty.call(message, "totalFilesSize"))
      writer.uint32(
        /* id 5, wireType 0 =*/
        40
      ).int64(message.totalFilesSize);
    if (message.packSize != null && Object.hasOwnProperty.call(message, "packSize"))
      writer.uint32(
        /* id 6, wireType 0 =*/
        48
      ).int64(message.packSize);
    if (message.splitFileName != null && Object.hasOwnProperty.call(message, "splitFileName"))
      writer.uint32(
        /* id 7, wireType 2 =*/
        58
      ).string(message.splitFileName);
    if (message.splitPartName != null && Object.hasOwnProperty.call(message, "splitPartName"))
      writer.uint32(
        /* id 8, wireType 2 =*/
        66
      ).string(message.splitPartName);
    return writer;
  };
  IntegrityPack2.encodeDelimited = function encodeDelimited(message, writer) {
    return this.encode(message, writer).ldelim();
  };
  IntegrityPack2.decode = function decode(reader, length) {
    if (!(reader instanceof $Reader))
      reader = $Reader.create(reader);
    let end = length === void 0 ? reader.len : reader.pos + length, message = new $root.IntegrityPack();
    while (reader.pos < end) {
      let tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          message.name = reader.string();
          break;
        }
        case 2: {
          message.type = reader.string();
          break;
        }
        case 3: {
          message.method = reader.string();
          break;
        }
        case 4: {
          message.compression = reader.int32();
          break;
        }
        case 5: {
          message.totalFilesSize = reader.int64();
          break;
        }
        case 6: {
          message.packSize = reader.int64();
          break;
        }
        case 7: {
          message.splitFileName = reader.string();
          break;
        }
        case 8: {
          message.splitPartName = reader.string();
          break;
        }
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  };
  IntegrityPack2.decodeDelimited = function decodeDelimited(reader) {
    if (!(reader instanceof $Reader))
      reader = new $Reader(reader);
    return this.decode(reader, reader.uint32());
  };
  IntegrityPack2.verify = function verify(message) {
    if (typeof message !== "object" || message === null)
      return "object expected";
    let properties = {};
    if (message.name != null && message.hasOwnProperty("name")) {
      if (!$util.isString(message.name))
        return "name: string expected";
    }
    if (message.type != null && message.hasOwnProperty("type")) {
      if (!$util.isString(message.type))
        return "type: string expected";
    }
    if (message.method != null && message.hasOwnProperty("method")) {
      if (!$util.isString(message.method))
        return "method: string expected";
    }
    if (message.compression != null && message.hasOwnProperty("compression")) {
      if (!$util.isInteger(message.compression))
        return "compression: integer expected";
    }
    if (message.totalFilesSize != null && message.hasOwnProperty("totalFilesSize")) {
      if (!$util.isInteger(message.totalFilesSize) && !(message.totalFilesSize && $util.isInteger(message.totalFilesSize.low) && $util.isInteger(message.totalFilesSize.high)))
        return "totalFilesSize: integer|Long expected";
    }
    if (message.packSize != null && message.hasOwnProperty("packSize")) {
      if (!$util.isInteger(message.packSize) && !(message.packSize && $util.isInteger(message.packSize.low) && $util.isInteger(message.packSize.high)))
        return "packSize: integer|Long expected";
    }
    if (message.splitFileName != null && message.hasOwnProperty("splitFileName")) {
      properties._splitFileName = 1;
      if (!$util.isString(message.splitFileName))
        return "splitFileName: string expected";
    }
    if (message.splitPartName != null && message.hasOwnProperty("splitPartName")) {
      properties._splitPartName = 1;
      if (!$util.isString(message.splitPartName))
        return "splitPartName: string expected";
    }
    return null;
  };
  IntegrityPack2.fromObject = function fromObject(object) {
    if (object instanceof $root.IntegrityPack)
      return object;
    let message = new $root.IntegrityPack();
    if (object.name != null)
      message.name = String(object.name);
    if (object.type != null)
      message.type = String(object.type);
    if (object.method != null)
      message.method = String(object.method);
    if (object.compression != null)
      message.compression = object.compression | 0;
    if (object.totalFilesSize != null) {
      if ($util.Long)
        (message.totalFilesSize = $util.Long.fromValue(object.totalFilesSize)).unsigned = false;
      else if (typeof object.totalFilesSize === "string")
        message.totalFilesSize = parseInt(object.totalFilesSize, 10);
      else if (typeof object.totalFilesSize === "number")
        message.totalFilesSize = object.totalFilesSize;
      else if (typeof object.totalFilesSize === "object")
        message.totalFilesSize = new $util.LongBits(object.totalFilesSize.low >>> 0, object.totalFilesSize.high >>> 0).toNumber();
    }
    if (object.packSize != null) {
      if ($util.Long)
        (message.packSize = $util.Long.fromValue(object.packSize)).unsigned = false;
      else if (typeof object.packSize === "string")
        message.packSize = parseInt(object.packSize, 10);
      else if (typeof object.packSize === "number")
        message.packSize = object.packSize;
      else if (typeof object.packSize === "object")
        message.packSize = new $util.LongBits(object.packSize.low >>> 0, object.packSize.high >>> 0).toNumber();
    }
    if (object.splitFileName != null)
      message.splitFileName = String(object.splitFileName);
    if (object.splitPartName != null)
      message.splitPartName = String(object.splitPartName);
    return message;
  };
  IntegrityPack2.toObject = function toObject(message, options) {
    if (!options)
      options = {};
    let object = {};
    if (options.defaults) {
      object.name = "";
      object.type = "";
      object.method = "";
      object.compression = 0;
      if ($util.Long) {
        let long = new $util.Long(0, 0, false);
        object.totalFilesSize = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
      } else
        object.totalFilesSize = options.longs === String ? "0" : 0;
      if ($util.Long) {
        let long = new $util.Long(0, 0, false);
        object.packSize = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
      } else
        object.packSize = options.longs === String ? "0" : 0;
    }
    if (message.name != null && message.hasOwnProperty("name"))
      object.name = message.name;
    if (message.type != null && message.hasOwnProperty("type"))
      object.type = message.type;
    if (message.method != null && message.hasOwnProperty("method"))
      object.method = message.method;
    if (message.compression != null && message.hasOwnProperty("compression"))
      object.compression = message.compression;
    if (message.totalFilesSize != null && message.hasOwnProperty("totalFilesSize"))
      if (typeof message.totalFilesSize === "number")
        object.totalFilesSize = options.longs === String ? String(message.totalFilesSize) : message.totalFilesSize;
      else
        object.totalFilesSize = options.longs === String ? $util.Long.prototype.toString.call(message.totalFilesSize) : options.longs === Number ? new $util.LongBits(message.totalFilesSize.low >>> 0, message.totalFilesSize.high >>> 0).toNumber() : message.totalFilesSize;
    if (message.packSize != null && message.hasOwnProperty("packSize"))
      if (typeof message.packSize === "number")
        object.packSize = options.longs === String ? String(message.packSize) : message.packSize;
      else
        object.packSize = options.longs === String ? $util.Long.prototype.toString.call(message.packSize) : options.longs === Number ? new $util.LongBits(message.packSize.low >>> 0, message.packSize.high >>> 0).toNumber() : message.packSize;
    if (message.splitFileName != null && message.hasOwnProperty("splitFileName")) {
      object.splitFileName = message.splitFileName;
      if (options.oneofs)
        object._splitFileName = "splitFileName";
    }
    if (message.splitPartName != null && message.hasOwnProperty("splitPartName")) {
      object.splitPartName = message.splitPartName;
      if (options.oneofs)
        object._splitPartName = "splitPartName";
    }
    return object;
  };
  IntegrityPack2.prototype.toJSON = function toJSON() {
    return this.constructor.toObject(this, import_protobufjs.default.util.toJSONOptions);
  };
  IntegrityPack2.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
    if (typeUrlPrefix === void 0) {
      typeUrlPrefix = "type.googleapis.com";
    }
    return typeUrlPrefix + "/IntegrityPack";
  };
  return IntegrityPack2;
})();
var IntegrityEntry = $root.IntegrityEntry = (() => {
  function IntegrityEntry2(properties) {
    if (properties) {
      for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
        if (properties[keys[i]] != null)
          this[keys[i]] = properties[keys[i]];
    }
  }
  IntegrityEntry2.prototype.relativePath = "";
  IntegrityEntry2.prototype.filedate = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;
  IntegrityEntry2.prototype.fileLength = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;
  IntegrityEntry2.prototype.xxh32 = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;
  IntegrityEntry2.prototype.isChunked = false;
  IntegrityEntry2.prototype.chunkStart = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;
  IntegrityEntry2.prototype.chunkLength = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;
  IntegrityEntry2.prototype.packUid = null;
  IntegrityEntry2.prototype.downloadableRaw = false;
  let $oneOfFields;
  Object.defineProperty(IntegrityEntry2.prototype, "_packUid", {
    get: $util.oneOfGetter($oneOfFields = ["packUid"]),
    set: $util.oneOfSetter($oneOfFields)
  });
  IntegrityEntry2.create = function create(properties) {
    return new IntegrityEntry2(properties);
  };
  IntegrityEntry2.encode = function encode(message, writer) {
    if (!writer)
      writer = $Writer.create();
    if (message.relativePath != null && Object.hasOwnProperty.call(message, "relativePath"))
      writer.uint32(
        /* id 1, wireType 2 =*/
        10
      ).string(message.relativePath);
    if (message.filedate != null && Object.hasOwnProperty.call(message, "filedate"))
      writer.uint32(
        /* id 2, wireType 0 =*/
        16
      ).int64(message.filedate);
    if (message.fileLength != null && Object.hasOwnProperty.call(message, "fileLength"))
      writer.uint32(
        /* id 3, wireType 0 =*/
        24
      ).int64(message.fileLength);
    if (message.xxh32 != null && Object.hasOwnProperty.call(message, "xxh32"))
      writer.uint32(
        /* id 4, wireType 0 =*/
        32
      ).int64(message.xxh32);
    if (message.isChunked != null && Object.hasOwnProperty.call(message, "isChunked"))
      writer.uint32(
        /* id 5, wireType 0 =*/
        40
      ).bool(message.isChunked);
    if (message.chunkStart != null && Object.hasOwnProperty.call(message, "chunkStart"))
      writer.uint32(
        /* id 6, wireType 0 =*/
        48
      ).int64(message.chunkStart);
    if (message.chunkLength != null && Object.hasOwnProperty.call(message, "chunkLength"))
      writer.uint32(
        /* id 7, wireType 0 =*/
        56
      ).int64(message.chunkLength);
    if (message.packUid != null && Object.hasOwnProperty.call(message, "packUid"))
      writer.uint32(
        /* id 8, wireType 2 =*/
        66
      ).string(message.packUid);
    if (message.downloadableRaw != null && Object.hasOwnProperty.call(message, "downloadableRaw"))
      writer.uint32(
        /* id 9, wireType 0 =*/
        72
      ).bool(message.downloadableRaw);
    return writer;
  };
  IntegrityEntry2.encodeDelimited = function encodeDelimited(message, writer) {
    return this.encode(message, writer).ldelim();
  };
  IntegrityEntry2.decode = function decode(reader, length) {
    if (!(reader instanceof $Reader))
      reader = $Reader.create(reader);
    let end = length === void 0 ? reader.len : reader.pos + length, message = new $root.IntegrityEntry();
    while (reader.pos < end) {
      let tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          message.relativePath = reader.string();
          break;
        }
        case 2: {
          message.filedate = reader.int64();
          break;
        }
        case 3: {
          message.fileLength = reader.int64();
          break;
        }
        case 4: {
          message.xxh32 = reader.int64();
          break;
        }
        case 5: {
          message.isChunked = reader.bool();
          break;
        }
        case 6: {
          message.chunkStart = reader.int64();
          break;
        }
        case 7: {
          message.chunkLength = reader.int64();
          break;
        }
        case 8: {
          message.packUid = reader.string();
          break;
        }
        case 9: {
          message.downloadableRaw = reader.bool();
          break;
        }
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  };
  IntegrityEntry2.decodeDelimited = function decodeDelimited(reader) {
    if (!(reader instanceof $Reader))
      reader = new $Reader(reader);
    return this.decode(reader, reader.uint32());
  };
  IntegrityEntry2.verify = function verify(message) {
    if (typeof message !== "object" || message === null)
      return "object expected";
    let properties = {};
    if (message.relativePath != null && message.hasOwnProperty("relativePath")) {
      if (!$util.isString(message.relativePath))
        return "relativePath: string expected";
    }
    if (message.filedate != null && message.hasOwnProperty("filedate")) {
      if (!$util.isInteger(message.filedate) && !(message.filedate && $util.isInteger(message.filedate.low) && $util.isInteger(message.filedate.high)))
        return "filedate: integer|Long expected";
    }
    if (message.fileLength != null && message.hasOwnProperty("fileLength")) {
      if (!$util.isInteger(message.fileLength) && !(message.fileLength && $util.isInteger(message.fileLength.low) && $util.isInteger(message.fileLength.high)))
        return "fileLength: integer|Long expected";
    }
    if (message.xxh32 != null && message.hasOwnProperty("xxh32")) {
      if (!$util.isInteger(message.xxh32) && !(message.xxh32 && $util.isInteger(message.xxh32.low) && $util.isInteger(message.xxh32.high)))
        return "xxh32: integer|Long expected";
    }
    if (message.isChunked != null && message.hasOwnProperty("isChunked")) {
      if (typeof message.isChunked !== "boolean")
        return "isChunked: boolean expected";
    }
    if (message.chunkStart != null && message.hasOwnProperty("chunkStart")) {
      if (!$util.isInteger(message.chunkStart) && !(message.chunkStart && $util.isInteger(message.chunkStart.low) && $util.isInteger(message.chunkStart.high)))
        return "chunkStart: integer|Long expected";
    }
    if (message.chunkLength != null && message.hasOwnProperty("chunkLength")) {
      if (!$util.isInteger(message.chunkLength) && !(message.chunkLength && $util.isInteger(message.chunkLength.low) && $util.isInteger(message.chunkLength.high)))
        return "chunkLength: integer|Long expected";
    }
    if (message.packUid != null && message.hasOwnProperty("packUid")) {
      properties._packUid = 1;
      if (!$util.isString(message.packUid))
        return "packUid: string expected";
    }
    if (message.downloadableRaw != null && message.hasOwnProperty("downloadableRaw")) {
      if (typeof message.downloadableRaw !== "boolean")
        return "downloadableRaw: boolean expected";
    }
    return null;
  };
  IntegrityEntry2.fromObject = function fromObject(object) {
    if (object instanceof $root.IntegrityEntry)
      return object;
    let message = new $root.IntegrityEntry();
    if (object.relativePath != null)
      message.relativePath = String(object.relativePath);
    if (object.filedate != null) {
      if ($util.Long)
        (message.filedate = $util.Long.fromValue(object.filedate)).unsigned = false;
      else if (typeof object.filedate === "string")
        message.filedate = parseInt(object.filedate, 10);
      else if (typeof object.filedate === "number")
        message.filedate = object.filedate;
      else if (typeof object.filedate === "object")
        message.filedate = new $util.LongBits(object.filedate.low >>> 0, object.filedate.high >>> 0).toNumber();
    }
    if (object.fileLength != null) {
      if ($util.Long)
        (message.fileLength = $util.Long.fromValue(object.fileLength)).unsigned = false;
      else if (typeof object.fileLength === "string")
        message.fileLength = parseInt(object.fileLength, 10);
      else if (typeof object.fileLength === "number")
        message.fileLength = object.fileLength;
      else if (typeof object.fileLength === "object")
        message.fileLength = new $util.LongBits(object.fileLength.low >>> 0, object.fileLength.high >>> 0).toNumber();
    }
    if (object.xxh32 != null) {
      if ($util.Long)
        (message.xxh32 = $util.Long.fromValue(object.xxh32)).unsigned = false;
      else if (typeof object.xxh32 === "string")
        message.xxh32 = parseInt(object.xxh32, 10);
      else if (typeof object.xxh32 === "number")
        message.xxh32 = object.xxh32;
      else if (typeof object.xxh32 === "object")
        message.xxh32 = new $util.LongBits(object.xxh32.low >>> 0, object.xxh32.high >>> 0).toNumber();
    }
    if (object.isChunked != null)
      message.isChunked = Boolean(object.isChunked);
    if (object.chunkStart != null) {
      if ($util.Long)
        (message.chunkStart = $util.Long.fromValue(object.chunkStart)).unsigned = false;
      else if (typeof object.chunkStart === "string")
        message.chunkStart = parseInt(object.chunkStart, 10);
      else if (typeof object.chunkStart === "number")
        message.chunkStart = object.chunkStart;
      else if (typeof object.chunkStart === "object")
        message.chunkStart = new $util.LongBits(object.chunkStart.low >>> 0, object.chunkStart.high >>> 0).toNumber();
    }
    if (object.chunkLength != null) {
      if ($util.Long)
        (message.chunkLength = $util.Long.fromValue(object.chunkLength)).unsigned = false;
      else if (typeof object.chunkLength === "string")
        message.chunkLength = parseInt(object.chunkLength, 10);
      else if (typeof object.chunkLength === "number")
        message.chunkLength = object.chunkLength;
      else if (typeof object.chunkLength === "object")
        message.chunkLength = new $util.LongBits(object.chunkLength.low >>> 0, object.chunkLength.high >>> 0).toNumber();
    }
    if (object.packUid != null)
      message.packUid = String(object.packUid);
    if (object.downloadableRaw != null)
      message.downloadableRaw = Boolean(object.downloadableRaw);
    return message;
  };
  IntegrityEntry2.toObject = function toObject(message, options) {
    if (!options)
      options = {};
    let object = {};
    if (options.defaults) {
      object.relativePath = "";
      if ($util.Long) {
        let long = new $util.Long(0, 0, false);
        object.filedate = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
      } else
        object.filedate = options.longs === String ? "0" : 0;
      if ($util.Long) {
        let long = new $util.Long(0, 0, false);
        object.fileLength = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
      } else
        object.fileLength = options.longs === String ? "0" : 0;
      if ($util.Long) {
        let long = new $util.Long(0, 0, false);
        object.xxh32 = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
      } else
        object.xxh32 = options.longs === String ? "0" : 0;
      object.isChunked = false;
      if ($util.Long) {
        let long = new $util.Long(0, 0, false);
        object.chunkStart = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
      } else
        object.chunkStart = options.longs === String ? "0" : 0;
      if ($util.Long) {
        let long = new $util.Long(0, 0, false);
        object.chunkLength = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
      } else
        object.chunkLength = options.longs === String ? "0" : 0;
      object.downloadableRaw = false;
    }
    if (message.relativePath != null && message.hasOwnProperty("relativePath"))
      object.relativePath = message.relativePath;
    if (message.filedate != null && message.hasOwnProperty("filedate"))
      if (typeof message.filedate === "number")
        object.filedate = options.longs === String ? String(message.filedate) : message.filedate;
      else
        object.filedate = options.longs === String ? $util.Long.prototype.toString.call(message.filedate) : options.longs === Number ? new $util.LongBits(message.filedate.low >>> 0, message.filedate.high >>> 0).toNumber() : message.filedate;
    if (message.fileLength != null && message.hasOwnProperty("fileLength"))
      if (typeof message.fileLength === "number")
        object.fileLength = options.longs === String ? String(message.fileLength) : message.fileLength;
      else
        object.fileLength = options.longs === String ? $util.Long.prototype.toString.call(message.fileLength) : options.longs === Number ? new $util.LongBits(message.fileLength.low >>> 0, message.fileLength.high >>> 0).toNumber() : message.fileLength;
    if (message.xxh32 != null && message.hasOwnProperty("xxh32"))
      if (typeof message.xxh32 === "number")
        object.xxh32 = options.longs === String ? String(message.xxh32) : message.xxh32;
      else
        object.xxh32 = options.longs === String ? $util.Long.prototype.toString.call(message.xxh32) : options.longs === Number ? new $util.LongBits(message.xxh32.low >>> 0, message.xxh32.high >>> 0).toNumber() : message.xxh32;
    if (message.isChunked != null && message.hasOwnProperty("isChunked"))
      object.isChunked = message.isChunked;
    if (message.chunkStart != null && message.hasOwnProperty("chunkStart"))
      if (typeof message.chunkStart === "number")
        object.chunkStart = options.longs === String ? String(message.chunkStart) : message.chunkStart;
      else
        object.chunkStart = options.longs === String ? $util.Long.prototype.toString.call(message.chunkStart) : options.longs === Number ? new $util.LongBits(message.chunkStart.low >>> 0, message.chunkStart.high >>> 0).toNumber() : message.chunkStart;
    if (message.chunkLength != null && message.hasOwnProperty("chunkLength"))
      if (typeof message.chunkLength === "number")
        object.chunkLength = options.longs === String ? String(message.chunkLength) : message.chunkLength;
      else
        object.chunkLength = options.longs === String ? $util.Long.prototype.toString.call(message.chunkLength) : options.longs === Number ? new $util.LongBits(message.chunkLength.low >>> 0, message.chunkLength.high >>> 0).toNumber() : message.chunkLength;
    if (message.packUid != null && message.hasOwnProperty("packUid")) {
      object.packUid = message.packUid;
      if (options.oneofs)
        object._packUid = "packUid";
    }
    if (message.downloadableRaw != null && message.hasOwnProperty("downloadableRaw"))
      object.downloadableRaw = message.downloadableRaw;
    return object;
  };
  IntegrityEntry2.prototype.toJSON = function toJSON() {
    return this.constructor.toObject(this, import_protobufjs.default.util.toJSONOptions);
  };
  IntegrityEntry2.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
    if (typeUrlPrefix === void 0) {
      typeUrlPrefix = "type.googleapis.com";
    }
    return typeUrlPrefix + "/IntegrityEntry";
  };
  return IntegrityEntry2;
})();
var IntegritySplit = $root.IntegritySplit = (() => {
  function IntegritySplit2(properties) {
    this.packs = [];
    this.files = [];
    if (properties) {
      for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
        if (properties[keys[i]] != null)
          this[keys[i]] = properties[keys[i]];
    }
  }
  IntegritySplit2.prototype.originalName = "";
  IntegritySplit2.prototype.packs = $util.emptyArray;
  IntegritySplit2.prototype.files = $util.emptyArray;
  IntegritySplit2.create = function create(properties) {
    return new IntegritySplit2(properties);
  };
  IntegritySplit2.encode = function encode(message, writer) {
    if (!writer)
      writer = $Writer.create();
    writer.uint32(
      /* id 1, wireType 2 =*/
      10
    ).string(message.originalName);
    if (message.packs != null && message.packs.length)
      for (let i = 0; i < message.packs.length; ++i)
        writer.uint32(
          /* id 2, wireType 2 =*/
          18
        ).string(message.packs[i]);
    if (message.files != null && message.files.length)
      for (let i = 0; i < message.files.length; ++i)
        writer.uint32(
          /* id 3, wireType 2 =*/
          26
        ).string(message.files[i]);
    return writer;
  };
  IntegritySplit2.encodeDelimited = function encodeDelimited(message, writer) {
    return this.encode(message, writer).ldelim();
  };
  IntegritySplit2.decode = function decode(reader, length) {
    if (!(reader instanceof $Reader))
      reader = $Reader.create(reader);
    let end = length === void 0 ? reader.len : reader.pos + length, message = new $root.IntegritySplit();
    while (reader.pos < end) {
      let tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          message.originalName = reader.string();
          break;
        }
        case 2: {
          if (!(message.packs && message.packs.length))
            message.packs = [];
          message.packs.push(reader.string());
          break;
        }
        case 3: {
          if (!(message.files && message.files.length))
            message.files = [];
          message.files.push(reader.string());
          break;
        }
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    if (!message.hasOwnProperty("originalName"))
      throw $util.ProtocolError("missing required 'originalName'", { instance: message });
    return message;
  };
  IntegritySplit2.decodeDelimited = function decodeDelimited(reader) {
    if (!(reader instanceof $Reader))
      reader = new $Reader(reader);
    return this.decode(reader, reader.uint32());
  };
  IntegritySplit2.verify = function verify(message) {
    if (typeof message !== "object" || message === null)
      return "object expected";
    if (!$util.isString(message.originalName))
      return "originalName: string expected";
    if (message.packs != null && message.hasOwnProperty("packs")) {
      if (!Array.isArray(message.packs))
        return "packs: array expected";
      for (let i = 0; i < message.packs.length; ++i)
        if (!$util.isString(message.packs[i]))
          return "packs: string[] expected";
    }
    if (message.files != null && message.hasOwnProperty("files")) {
      if (!Array.isArray(message.files))
        return "files: array expected";
      for (let i = 0; i < message.files.length; ++i)
        if (!$util.isString(message.files[i]))
          return "files: string[] expected";
    }
    return null;
  };
  IntegritySplit2.fromObject = function fromObject(object) {
    if (object instanceof $root.IntegritySplit)
      return object;
    let message = new $root.IntegritySplit();
    if (object.originalName != null)
      message.originalName = String(object.originalName);
    if (object.packs) {
      if (!Array.isArray(object.packs))
        throw TypeError(".IntegritySplit.packs: array expected");
      message.packs = [];
      for (let i = 0; i < object.packs.length; ++i)
        message.packs[i] = String(object.packs[i]);
    }
    if (object.files) {
      if (!Array.isArray(object.files))
        throw TypeError(".IntegritySplit.files: array expected");
      message.files = [];
      for (let i = 0; i < object.files.length; ++i)
        message.files[i] = String(object.files[i]);
    }
    return message;
  };
  IntegritySplit2.toObject = function toObject(message, options) {
    if (!options)
      options = {};
    let object = {};
    if (options.arrays || options.defaults) {
      object.packs = [];
      object.files = [];
    }
    if (options.defaults)
      object.originalName = "";
    if (message.originalName != null && message.hasOwnProperty("originalName"))
      object.originalName = message.originalName;
    if (message.packs && message.packs.length) {
      object.packs = [];
      for (let j = 0; j < message.packs.length; ++j)
        object.packs[j] = message.packs[j];
    }
    if (message.files && message.files.length) {
      object.files = [];
      for (let j = 0; j < message.files.length; ++j)
        object.files[j] = message.files[j];
    }
    return object;
  };
  IntegritySplit2.prototype.toJSON = function toJSON() {
    return this.constructor.toObject(this, import_protobufjs.default.util.toJSONOptions);
  };
  IntegritySplit2.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
    if (typeUrlPrefix === void 0) {
      typeUrlPrefix = "type.googleapis.com";
    }
    return typeUrlPrefix + "/IntegritySplit";
  };
  return IntegritySplit2;
})();

// src/cli/new.ts
var import_uuid2 = require("uuid");

// src/bytesToString.ts
function bytesToString(val) {
  if (val >= 1024 * 1024 * 1024)
    return `${(val / 1024 / 1024 / 1024).toFixed(2)} GiB`;
  if (val >= 1024 * 1024)
    return `${(val / 1024 / 1024).toFixed(2)} MiB`;
  if (val >= 1024)
    return `${(val / 1024).toFixed(0)} KiB`;
  if (val < 1024)
    return `${val} bytes`;
}

// src/pack.ts
var import_long2 = __toESM(require("long"));

// src/getRule.ts
var import_minimatch2 = require("minimatch");
function getRule(file, rules) {
  let applyRule = { ignore: false, skipHash: false, maxChunk: 0 };
  let ignore = false;
  for (var r in rules) {
    if ((0, import_minimatch2.minimatch)(file, r, { nocase: true, dot: true })) {
      let currentRule = rules[r];
      if (currentRule.ignore) {
        ignore = true;
        applyRule.ignore = true;
      }
      if (currentRule.skipHash) {
        applyRule.skipHash = true;
      }
      if (currentRule.maxChunk && currentRule.maxChunk != 0) {
        applyRule.maxChunk = currentRule.maxChunk;
      }
      if (currentRule.pack) {
        if (!applyRule.pack)
          applyRule.pack = {};
        if (currentRule.pack.name)
          applyRule.pack.name = currentRule.pack.name;
        if (currentRule.pack.divide)
          applyRule.pack.divide = currentRule.pack.divide;
        if (currentRule.pack.exclusive)
          applyRule.pack.exclusive = currentRule.pack.exclusive;
        if (currentRule.pack.method)
          applyRule.pack.method = currentRule.pack.method;
        if (currentRule.pack.compression)
          applyRule.pack.compression = currentRule.pack.compression;
      }
    }
  }
  return applyRule;
}

// src/pack.ts
var import_node_7z = __toESM(require("node-7z"));
var import_path3 = require("path");
var import_os2 = require("os");
var import_fs = require("fs");
var import_promises3 = require("fs/promises");
var import_process = require("process");
var import_promises4 = require("node:stream/promises");
var import_uuid = require("uuid");
var { log, su, err, warn } = log_default("packgrity");
async function rmFileFromPack(entry, reference, packPath) {
  if (!entry.packUid)
    return reference;
  let packs = [reference.packs.find((e) => e.name == entry.packUid)];
  let split = reference.splitFiles.find((e) => e.originalName == entry.relativePath);
  if (split)
    packs = packs.concat(split.packs.map((e) => reference.packs.find((p) => p.name == e)));
  for (var pack of packs) {
    let samePackEntries = reference.entries.filter((e) => e.packUid == pack.name);
    if (samePackEntries.length == 1) {
      log(`removing pack ${pack.name} as it is no longer needed`);
      if (packPath) {
        if ((0, import_fs.existsSync)(packPath))
          await (0, import_promises3.rm)((0, import_path3.resolve)(packPath, pack.name));
        else
          warn("pack " + (0, import_path3.basename)(packPath) + "does not exist!!");
      } else
        warn("no pack path provided, not removing anything");
      reference.packs = reference.packs.filter((e) => e.name != pack.name);
    } else if (packPath) {
      if ((0, import_fs.existsSync)(packPath))
        await new Promise((rr) => import_node_7z.default.delete((0, import_path3.resolve)(packPath, pack.name), entry.relativePath, {
          $bin: get7zbin()
        }).on("end", () => {
          log(`removed ${entry.relativePath} from ${pack.name}`);
          rr();
        }));
      else
        warn(`pack ${packPath} does not exist. could not remove file`);
    }
  }
  if (split)
    reference.splitFiles = reference.splitFiles.filter((e) => e.originalName != entry.relativePath);
  return reference;
}
function assignPacks(entries, rules) {
  let packs = {};
  let packEntries = [];
  let packNameCounter = {};
  let splits = [];
  let splitsToGenerate = {};
  for (var e of entries) {
    let rule = getRule(e.relativePath, rules);
    if (rule.ignore)
      continue;
    if (!rule.pack || !rule.pack.name)
      continue;
    if (!packNameCounter[rule.pack.name])
      packNameCounter[rule.pack.name] = 0;
    let packName = rule.pack.name.includes("$") ? rule.pack.name.replace("$", packNameCounter[rule.pack.name].toString()) : rule.pack.name.split(".").slice(0, -1).join(".") + "." + packNameCounter[rule.pack.name] + "." + rule.pack.name.split(".").slice(-1)[0];
    if (!packs[packName]) {
      packs[packName] = { files: [], size: 0 };
      packEntries.push({
        name: packName,
        compression: rule.pack.compression ?? 4,
        method: rule.pack.method ?? "BROTLI",
        type: "7z"
      });
    }
    if (rule.pack.divide && BigInt(packs[packName].size) + BigLongL(e.fileLength) >= BigInt(rule.pack.divide)) {
      if (BigLongL(e.fileLength) >= BigInt(rule.pack.divide)) {
        let sizeLeft = BigLongL(e.fileLength);
        let chunkStart = 0n;
        let i = 0;
        let split = {
          originalName: e.relativePath,
          files: [],
          packs: []
        };
        while (sizeLeft > 0) {
          packNameCounter[rule.pack.name]++;
          packName = rule.pack.name.includes("$") ? rule.pack.name.replace("$", packNameCounter[rule.pack.name].toString()) : rule.pack.name.split(".").slice(0, -1).join(".") + "." + packNameCounter[rule.pack.name] + "." + rule.pack.name.split(".").slice(-1)[0];
          e.packUid = packName;
          let chunkLength = sizeLeft > BigInt(rule.pack.divide) ? BigInt(rule.pack.divide) : sizeLeft;
          if (!splitsToGenerate[e.relativePath])
            splitsToGenerate[e.relativePath] = [];
          splitsToGenerate[e.relativePath].push(
            {
              name: `${e.relativePath}.part${i}`,
              start: Number(chunkStart),
              length: Number(chunkLength),
              pack: packName
            }
          );
          sizeLeft -= chunkLength;
          chunkStart += chunkLength + BigInt(1);
          packs[packName] = { files: [{ relativePath: `${e.relativePath}.part${i}`, fileLength: new import_long2.default(Number(chunkLength)) }], size: Number(chunkLength) };
          packEntries.push({
            name: packName,
            compression: rule.pack.compression ?? 4,
            method: rule.pack.method ?? "BROTLI",
            totalFilesSize: Number(chunkLength),
            splitFileName: e.relativePath,
            splitPartName: `${e.relativePath}.part${i}`,
            type: "7z"
          });
          split.packs.push(packName);
          split.files.push(`${e.relativePath}.part${i}`);
          i++;
        }
        splits.push(split);
        packNameCounter[rule.pack.name]++;
        packName = rule.pack.name.includes("$") ? rule.pack.name.replace("$", packNameCounter[rule.pack.name].toString()) : rule.pack.name.split(".").slice(0, -1).join(".") + "." + packNameCounter[rule.pack.name] + "." + rule.pack.name.split(".").slice(-1)[0];
        continue;
      } else {
        packNameCounter[rule.pack.name]++;
        packName = rule.pack.name.includes("$") ? rule.pack.name.replace("$", packNameCounter[rule.pack.name].toString()) : rule.pack.name.split(".").slice(0, -1).join(".") + "." + packNameCounter[rule.pack.name] + "." + rule.pack.name.split(".").slice(-1)[0];
        packs[packName] = { files: [], size: 0 };
        packEntries.push({
          name: packName,
          compression: rule.pack.compression ?? 4,
          method: rule.pack.method ?? "BROTLI",
          type: "7z"
        });
      }
    }
    packs[packName].files.push(e);
    packs[packName].size += Number(BigLongL(e.fileLength));
    let packEntry = packEntries.find((e2) => e2.name == packName);
    packEntry.totalFilesSize = Number(BigLongL(packEntry.totalFilesSize ?? new import_long2.default(0))) + Number(BigLongL(e.fileLength));
    e.packUid = packName;
  }
  return {
    entries,
    packs: packEntries,
    splits,
    splitsForGenerator: splitsToGenerate
  };
}
function get7zbin(basePath) {
  if (process.env.BIN7Z)
    return process.env.BIN7Z;
  let relPath = "";
  relPath = `${process.platform}/${(0, import_os2.arch)()}/${process.platform == "win32" ? "7za.exe" : "7z"}`;
  let r = (0, import_path3.resolve)(basePath ?? __dirname, "./bin/7z", relPath);
  if (!(0, import_fs.existsSync)(r))
    throw `unsupported platform or missing 7z binary: ${(0, import_path3.resolve)(basePath ?? __dirname, "./bin/7z", relPath)}`;
  return r.replaceAll("app.asar", "app.asar.unpacked");
}
async function buildPacks(path, packPath, entries, packs, splitsToGenerate, relpath7z, log6) {
  if (!log6)
    log6 = function(data, ms) {
      console.log(
        `\x1B[2m${(/* @__PURE__ */ new Date()).toLocaleString("ru-RU")}${ms ? ` ${ms}` : ``}\x1B[0m\x1B[0m ${`pack`}:  \x1B[0m ${data}`
      );
    };
  if (!(0, import_fs.existsSync)(packPath))
    await (0, import_promises3.mkdir)(packPath, { recursive: true });
  for (var [key, value] of Object.entries(splitsToGenerate)) {
    log6(`splitting ${key} into ${value.length} parts...`);
    process.stdout.write("...");
    let i = 0;
    for (var v of value) {
      i++;
      if (!(0, import_fs.existsSync)((0, import_path3.resolve)(path, v.name)))
        (await (0, import_promises3.open)((0, import_path3.resolve)(path, v.name), "w")).close();
      process.stdout.write(`\r ${i}/${value.length}    ${v.start} - ${v.start + v.length}`);
      let readStream = (0, import_fs.createReadStream)((0, import_path3.resolve)(path, key), { start: v.start, end: v.start + v.length });
      let writeStream = (0, import_fs.createWriteStream)((0, import_path3.resolve)(path, v.name));
      await (0, import_promises4.pipeline)(readStream, writeStream);
      readStream.close();
      writeStream.close();
    }
    process.stdout.write(`\rcompleted                    
`);
  }
  let oldDir = process.cwd();
  (0, import_process.chdir)(path);
  for (let pack of packs) {
    let time = Date.now();
    let packEntries = entries.filter((e) => e.packUid == pack.name);
    let packsSplit = Object.values(splitsToGenerate).flatMap((e) => {
      return e.map((e2) => {
        if (e2.pack != pack.name)
          return void 0;
        return { relativePath: e2.name, fileLength: new import_long2.default(e2.length), packUid: e2.pack };
      });
    });
    if (packsSplit.filter((e) => e) && packsSplit.filter((e) => e).length)
      packEntries = packsSplit.filter((e) => e);
    log6(`packing ${pack.name} with ${packEntries.length} entries (${pack.method} ${pack.compression})`);
    process.stdout.write("...");
    let tmpFileName = `listfile__` + (0, import_uuid.v4)().replaceAll("-", "") + ".txt";
    let tmpFile = (0, import_path3.resolve)((0, import_os2.tmpdir)(), tmpFileName);
    await (0, import_promises3.writeFile)(tmpFile, packEntries.map((e) => e.relativePath).join("\n"));
    await new Promise((rr, rj) => {
      let task = import_node_7z.default.add(
        (0, import_path3.resolve)(packPath, pack.name),
        /*packEntries.map(e=>e.relativePath)*/
        `@${tmpFile}`,
        {
          $bin: get7zbin(relpath7z),
          $progress: true,
          recursive: true,
          //workingDir: path,
          archiveType: "7z",
          $spawnOptions: {
            cwd: path
          },
          //method: [pack.method],
          $raw: [`-spf`, `-m0=${pack.method}`, `-mx=${pack.compression}`]
        }
      );
      task.on("progress", (progress) => {
        process.stdout.write(`\r${progress.percent}% --	${progress.file}`);
      });
      task.on("error", (e) => {
        process.stdout.write(`\rfailed
`);
        rj(e);
      });
      task.on("end", async () => {
        await (0, import_promises3.rm)(tmpFile);
        let size = (await (0, import_promises3.stat)((0, import_path3.resolve)(packPath, pack.name))).size;
        pack.packSize = new import_long2.default(size);
        process.stdout.write(`\rcompleted in ${Date.now() - time}ms
`);
        rr();
      });
    });
  }
  (0, import_process.chdir)(oldDir);
  for (var [key, value] of Object.entries(splitsToGenerate)) {
    log6(`cleaning up split ${key}`);
    for (var v of value) {
      if ((0, import_fs.existsSync)((0, import_path3.resolve)(path, v.name)))
        await (0, import_promises3.rm)((0, import_path3.resolve)(path, v.name));
    }
  }
  return { packs };
}

// src/cli/new.ts
var import_path4 = require("path");
var import_fs2 = require("fs");
var import_terminal_kit = __toESM(require("terminal-kit"));
var { log: log2, su: su2, err: err2, warn: warn2 } = log_default("integrity");
var term = import_terminal_kit.default.terminal;
async function cliNew({ path, ref, packpath, rule, ruleset, saveAsJson, workdir, contentVersion }) {
  let packPathCheck;
  let isPackPathDefault = false;
  if (!packpath) {
    packPathCheck = (0, import_path4.resolve)((0, import_path4.dirname)((0, import_path4.resolve)(workdir ?? process.cwd(), ref)), "pack");
    isPackPathDefault = true;
  } else
    packPathCheck = (0, import_path4.resolve)(workdir ?? process.cwd(), packpath);
  if ((0, import_fs2.existsSync)(packPathCheck) && (await (0, import_promises5.stat)(packPathCheck)).isDirectory() && (await (0, import_promises5.readdir)(packPathCheck)).length > 0) {
    warn2(`${isPackPathDefault ? "default " : ""}pack path [${packPathCheck}] is not empty`);
    term((isPackPathDefault ? "default " : "") + "pack path is not empty, do you want to continue? (y/n) ");
    if (!await term.yesOrNo({ yes: ["y", "ENTER"], no: ["n"], echoNo: "yes", echoYes: "no" }).promise) {
      err2("aborted.");
      return;
    }
    term("\n");
  }
  let r = readRules(ruleset, rule);
  let startTime = Date.now();
  let pa = (0, import_path4.resolve)(workdir ?? process.cwd(), path);
  log2(`generating reference for ${pa}...`);
  let entries = await genDirReference(pa, r, void 0, true);
  let size = entries.reduce((a, b) => a + Number(BigLongL(b.fileLength)), 0);
  let entriesEndTime = Date.now();
  su2(`done ${entries.length} entires, ${bytesToString(size)} in ${Date.now() - startTime}ms (${bytesToString(size / ((Date.now() - startTime) / 1e3))}/s)
	`);
  await new Promise((rr) => setTimeout(rr, 400));
  let packStartTime = Date.now();
  let p = assignPacks(entries, r);
  let totalPackSize;
  if (p.packs.length) {
    entries = p.entries;
    if (!packpath) {
      packpath = (0, import_path4.resolve)((0, import_path4.dirname)((0, import_path4.resolve)(workdir ?? process.cwd(), ref)), "pack");
      warn2("pack path is not specified, using default path " + packpath);
    }
    log2(`generating ${p.packs.length} packs with ${p.splits.length} split files..`);
    let packResult = await buildPacks(path, packpath, p.entries, p.packs, p.splitsForGenerator);
    p.packs = packResult.packs;
    new Promise((rr) => setTimeout(rr, 400));
    totalPackSize = packResult.packs.reduce((a, b) => a + Number(BigLongL(b.packSize)), 0);
    su2(`done ${p.packs.length} packs, ${bytesToString(totalPackSize)} [${Math.floor(totalPackSize / size * 100)} %] in ${Date.now() - packStartTime}ms (${bytesToString(totalPackSize / ((Date.now() - packStartTime) / 1e3))}/s)
	`);
  }
  let packsEndTime = Date.now();
  let file = {
    createdDate: Date.now(),
    uuid: (0, import_uuid2.v4)(),
    version: 0,
    entries,
    splitFiles: p.splits,
    packs: p.packs,
    contentVersion: contentVersion ?? 0
  };
  let basePath = workdir ?? process.cwd();
  await (0, import_promises5.writeFile)((0, import_path4.resolve)(basePath, ref), IntegrityReference.encode(file).finish()).then((r2) => {
    let refFileSize = (0, import_fs2.statSync)((0, import_path4.resolve)(basePath, ref)).size;
    su2(`saved reference to ${(0, import_path4.resolve)(basePath, ref)} [${bytesToString(refFileSize)}]`);
  });
  if (saveAsJson) {
    await (0, import_promises5.writeFile)((0, import_path4.resolve)(basePath, ref + ".json"), JSON.stringify(file, null, 2)).then((r2) => {
      let refFileSize = (0, import_fs2.statSync)((0, import_path4.resolve)(basePath, ref + ".json")).size;
      su2(`saved reference to ${(0, import_path4.resolve)(basePath, ref + ".json")} [${bytesToString(refFileSize)}]`);
    });
  }
  console.log("\n");
  su2(`
generated reference in ${(Date.now() - startTime) / 1e3}s
	${entries.length} entires, ${bytesToString(size)}	in ${entriesEndTime - startTime} ms (${bytesToString(size / ((entriesEndTime - startTime) / 100))}/s)` + (p.packs.length ? `
	${p.packs.length} packs, ${bytesToString(totalPackSize)} [${Math.floor(totalPackSize / size * 100)} %]	in ${packsEndTime - packStartTime} ms, (${bytesToString(totalPackSize / ((packsEndTime - packStartTime) / 100))}/s)` : ""));
}

// src/cli/rm.ts
var import_promises6 = require("fs/promises");
var import_minimatch3 = require("minimatch");
var import_terminal_kit2 = __toESM(require("terminal-kit"));
var import_fs3 = require("fs");
var import_path5 = require("path");
var { log: log3, su: su3, err: err3, warn: warn3 } = log_default("integrity");
var terminal = import_terminal_kit2.default.terminal;
async function cliRm({ ask, force, match, packpath, path, recursive, ref, strict, tap, saveAsJson, workdir }) {
  if (recursive && strict) {
    err3("cannot use --recursive and --strict at the same time. recursive allows removing more than one entry, but strict limits match only for one totally matching entry. they are opposite of each other.");
    return;
  }
  let reference = await IntegrityReference.decode(await (0, import_promises6.readFile)((0, import_path5.resolve)(workdir ?? process.cwd(), ref)));
  let matchEntries = [];
  if (strict) {
    matchEntries = reference.entries.filter((e) => e.relativePath == match);
  } else {
    matchEntries = reference.entries.filter((e) => (0, import_minimatch3.minimatch)(e.relativePath, match, { dot: true }));
  }
  if (matchEntries.length == 0) {
    err3(`no matches found for "${match}"${strict ? " (strict)" : ""}`);
    return;
  }
  if (matchEntries.length > 1 && !recursive) {
    err3(`multiple matches found for "${match}"${strict ? " (strict)" : ""}. use --recursive or -r to allow removing multiple entries`);
    return;
  }
  if (matchEntries.length && !path && !tap)
    return err3(`no path specified. use --path to specify or --tap to remove only from reference without touching files`);
  if (matchEntries.some((e) => e.packUid && e.packUid.length) && !packpath && !tap)
    return err3(`reference has packs, but no packpath specified. use --packpath to specify  or --tap to remove only from reference without touching files`);
  log3(`removing ${matchEntries.length} entries..`);
  let i = 0;
  let basePath = workdir ?? process.cwd();
  let targetPath = (0, import_path5.resolve)(basePath, path ?? "");
  for (let entry of matchEntries) {
    i++;
    if (!force && (matchEntries.length > 1 || ask)) {
      terminal(`remove entry ${i}/${matchEntries.length} "${entry.relativePath}"? (y/n) `);
      if (!await terminal.yesOrNo({ yes: ["y", "ENTER"], no: ["n"], echoNo: "no", echoYes: "yes" }).promise) {
        terminal("\n");
        continue;
      }
      terminal("\n");
    }
    if (!tap) {
      if ((0, import_fs3.existsSync)((0, import_path5.resolve)(targetPath, entry.relativePath))) {
        if (entry.fileLength)
          su3(`removing ${entry.relativePath} (${entry.fileLength} bytes)`);
        else
          su3(`removing ${entry.relativePath}`);
        await (0, import_promises6.rm)((0, import_path5.resolve)(targetPath, entry.relativePath));
      } else
        warn3(`file ${entry.relativePath} does not exist`);
    }
    let packRemoveResult = await rmFileFromPack(entry, reference, tap ? void 0 : (0, import_path5.resolve)(basePath, packpath ?? ""));
    if (packRemoveResult)
      su3(`removed ${entry.relativePath} from packs and splits`);
    reference = packRemoveResult;
    reference.entries = reference.entries.filter((e) => e.relativePath != entry.relativePath);
  }
  await (0, import_promises6.writeFile)((0, import_path5.resolve)(basePath, ref), IntegrityReference.encode(reference).finish()).then((r) => {
    let refFileSize = (0, import_fs3.statSync)((0, import_path5.resolve)(basePath, ref)).size;
    su3(`saved reference to ${(0, import_path5.resolve)(basePath, ref)} [${bytesToString(refFileSize)}]`);
  });
  if (saveAsJson) {
    await (0, import_promises6.writeFile)((0, import_path5.resolve)(basePath, ref + ".json"), JSON.stringify(reference, null, 2)).then((r) => {
      let refFileSize = (0, import_fs3.statSync)((0, import_path5.resolve)(basePath, ref + ".json")).size;
      su3(`saved reference to ${(0, import_path5.resolve)(basePath, ref + ".json")} [${bytesToString(refFileSize)}]`);
    });
  }
}

// src/cli/sync.ts
var import_promises9 = require("fs/promises");
var import_path7 = require("path");

// src/download/initiate.ts
function initiateDownload(files, preferPacks = false, preferContent = false) {
  let dlList = [];
  let splitList = [];
  for (var f of files) {
    if (!preferContent && !f.source.preferContent && f.source.splits.some((e) => e.originalName == f.relativePath)) {
      let split = f.source.splits.find((e) => e.originalName == f.relativePath);
      splitList.push({
        originalFile: f.relativePath,
        split,
        sourceUuid: f.source.uuid,
        packs: []
      });
    }
    if (!preferContent && !f.source.preferContent && f.packUid && f.source.packs.some((e) => e.name == f.packUid)) {
      if (dlList.some((e) => e.name == f.packUid && e.sourceId == f.source.uuid)) {
        let l = dlList.find((e) => e.name == f.packUid && e.sourceId == f.source.uuid);
        l.filesToUnpack.push(f.relativePath);
        continue;
      } else if (splitList.some((e) => e.originalFile == f.relativePath && e.sourceUuid == f.source.uuid)) {
        let split = splitList.find((e) => e.originalFile == f.relativePath && e.sourceUuid == f.source.uuid);
        let packs = split.split.packs.map((e) => {
          return f.source.packs.find((p) => p.name == e);
        });
        let dlQueueItemsToadd = packs.map((e) => {
          return {
            name: e.name,
            remote: f.source.packRemote.replace("$$$", e.name),
            filesToUnpack: [e.splitPartName],
            sourceId: f.source.uuid,
            state: "queued",
            size: Number(BigLongL(e.packSize)),
            isPack: true
          };
        });
        split.packs.push(...dlQueueItemsToadd);
        dlList.push(...dlQueueItemsToadd);
        continue;
      } else if (!preferContent && !f.source.preferContent) {
        let pack = f.source.packs.find((e) => e.name == f.packUid);
        let push = () => {
          let dlListItem = {
            name: f.packUid,
            remote: f.source.packRemote.replace("$$$", f.packUid),
            filesToUnpack: [f.relativePath],
            state: "queued",
            sourceId: f.source.uuid,
            size: Number(BigLongL(pack.packSize)),
            isPack: true
          };
          dlList.push(dlListItem);
          return dlListItem;
        };
        let filesAlsoInPack = files.filter((e) => e.packUid == f.packUid && e.source.uuid == f.source.uuid);
        if (pack.splitFileName && files.some((e) => e.relativePath == pack.splitFileName)) {
          let i = push();
          splitList.find((e) => e.originalFile == pack.splitFileName)?.packs.push(i);
          continue;
        }
        if (preferPacks || f.source.preferPacks) {
          push();
          continue;
        }
        if (filesAlsoInPack.length >= 99) {
          push();
          continue;
        }
        if (filesAlsoInPack.reduce((p, c) => p + c.fileSize, 0) >= Number(BigLongL(pack.packSize)) * 0.7) {
          push();
          continue;
        }
      }
    }
    dlList.push({
      name: f.relativePath,
      sourceId: f.source.uuid,
      remote: f.source.contentRemote.replace("$$$", f.relativePath),
      state: "queued",
      size: f.fileSize
    });
  }
  console.log(JSON.stringify(dlList, null, 2));
  return {
    dlList,
    splitList
  };
}

// src/download/download.ts
var import_path6 = require("path");
var import_axios = __toESM(require("axios"));
var import_uuid3 = require("uuid");
var import_os3 = require("os");
var import_fs4 = require("fs");
var import_promises7 = require("fs/promises");
var import_promises8 = require("stream/promises");
var import_node_7z2 = __toESM(require("node-7z"));
function dlItemRate(dl, splitList) {
  if (splitList.some((e) => e.split && e.split.packs.includes(dl.name)))
    return 5;
  if (dl.isPack)
    return 2;
  return 1;
}
function download(local, dlList, splitList, onStatus, onEnd, relpath7z, failureBehaivour, log6) {
  return new Promise(async function(resolveDownloading, rejectDownloading) {
    if (!log6)
      log6 = function(data) {
        console.log(
          `\x1B[2m${(/* @__PURE__ */ new Date()).toLocaleString("ru-RU")}\x1B[0m\x1B[0m ${`download`}:  \x1B[0m ${data}`
        );
      };
    let a = import_axios.default.create();
    const Queue = await import("queue").then((e) => e.default);
    let q = new Queue({
      concurrency: 2
    });
    q.autostart = true;
    q.start();
    q.addEventListener("end", () => {
      if (allFilesDownloaded) {
        onEnd();
        clearInterval(intval);
        clearInterval(speedIntval);
        resolveDownloading();
      }
    });
    q.addEventListener("error", (e) => {
      log6("queue error: " + e.detail.error);
    });
    let tasks = [];
    let taskRunning = false;
    function task(t) {
      q.push((cb) => {
        t().then(cb);
      });
    }
    async function onSplitDone(s) {
      let start = 0;
      if ((0, import_fs4.existsSync)((0, import_path6.resolve)(local, s.originalFile))) {
        await (0, import_promises7.rm)((0, import_path6.resolve)(local, s.originalFile));
      }
      for (var filePart of s.split.files) {
        let originalFileWrite = (0, import_fs4.createWriteStream)((0, import_path6.resolve)(local, s.originalFile), { flags: "a+" });
        log6(`joining ${filePart} --> ${s.originalFile}`);
        let partStream = (0, import_fs4.createReadStream)((0, import_path6.resolve)(local, filePart));
        start += partStream.bytesRead;
        await (0, import_promises8.pipeline)(partStream, originalFileWrite);
        await partStream.close();
        await (0, import_promises7.rm)((0, import_path6.resolve)(local, filePart));
        originalFileWrite.close();
      }
    }
    async function onDownload(i, localPath) {
      if (!i.isPack)
        log6(`${i.name} ready`);
      if (i.isPack) {
        task(async () => {
          let tmpFileName = `listfile__` + (0, import_uuid3.v4)().replaceAll("-", "") + ".txt";
          let tmpFile = (0, import_path6.resolve)((0, import_os3.tmpdir)(), tmpFileName);
          await (0, import_promises7.writeFile)(tmpFile, i.filesToUnpack.join("\n"));
          console.log(i.filesToUnpack);
          await new Promise((rr, rj) => {
            let task2 = import_node_7z2.default.extractFull(`${localPath}`, local, {
              $bin: get7zbin(relpath7z),
              $progress: true,
              recursive: true,
              archiveType: "7z",
              outputDir: local,
              $cherryPick: [`@${tmpFile}`]
            });
            task2.on("progress", (progress) => {
            });
            task2.on("error", (e) => {
              log6("error on pack " + localPath + " " + e.toString());
              rj(e);
              rejectDownloading(e);
            });
            task2.on("end", async () => {
              i.state = "done";
              await (0, import_promises7.rm)(tmpFile);
              await (0, import_promises7.rm)(localPath);
              log6(`${i.name} extracted`);
              if (splitList.some((e) => e.packs.some((e2) => e2.name == i.name))) {
                let currentSplit = splitList.find((e) => e.packs.some((e2) => e2.name == i.name));
                if (currentSplit.packs.every((e) => e.state == "done")) {
                  q.push((cb) => {
                    onSplitDone(currentSplit).then((e) => cb()).catch(console.error);
                  });
                }
              }
              rr();
            });
          });
        });
      } else
        i.state = "done";
    }
    let dlSort = dlList.sort((b, a2) => dlItemRate(a2, splitList) - dlItemRate(b, splitList));
    let dlSize = dlSort.reduce((a2, b) => a2 + b.size, 0);
    let dlSizeDone = {};
    let allFilesDownloaded = false;
    let lastTotalBytes = 0;
    let speed = 0;
    let speedIntval = setInterval(() => {
      let totalBytes = Object.values(dlSizeDone).reduce((a2, b) => a2 + b, 0);
      let bytesPerSecond = totalBytes - lastTotalBytes;
      lastTotalBytes = totalBytes;
      speed = Number((bytesPerSecond / 5).toFixed(2));
    }, 5e3);
    let intval = setInterval(() => {
      let totalBytes = Object.values(dlSizeDone).reduce((a2, b) => a2 + b, 0);
      let percent = Number(Math.ceil(totalBytes / dlSize * 100));
      if (onStatus)
        onStatus(allFilesDownloaded ? "unpacking" : "downloading", totalBytes, dlSize, percent, speed);
    }, 500);
    let dl = balance(dlSort, 14, false);
    let filesAlreadyDownloaded = 0;
    log6("starting");
    let downloadersPromises = dl.map((d, index) => {
      return new Promise(async (promiseResolve, reject) => {
        await new Promise((rr) => setTimeout(rr, index * 100));
        for (var i of d) {
          i.state = "downloading";
          let done = false;
          let reTries = 0;
          while (!done) {
            await a.get(i.remote, {
              responseType: "stream",
              // adapter: adapter,
              onDownloadProgress(progressEvent) {
                if (!dlSizeDone[i.name])
                  dlSizeDone[i.name] = 0;
                dlSizeDone[i.name] = progressEvent.loaded;
              }
            }).then(async (r) => {
              let target;
              if (i.isPack)
                target = (0, import_path6.resolve)((0, import_os3.tmpdir)(), `${(0, import_uuid3.v4)()}.${(0, import_path6.basename)(i.name)}`);
              else
                target = (0, import_path6.resolve)(local, i.name);
              if (!(0, import_fs4.existsSync)((0, import_path6.dirname)(target)))
                await (0, import_promises7.mkdir)((0, import_path6.dirname)(target), { recursive: true });
              let tagetStream = (0, import_fs4.createWriteStream)(target);
              await (0, import_promises8.pipeline)(r.data, tagetStream);
              tagetStream.close();
              done = true;
              filesAlreadyDownloaded++;
              onDownload(i, target);
            }).catch(async (e) => {
              log6(`error on ${i.remote}: ${e}`);
              reTries++;
              if (reTries < 14)
                return;
              if (!failureBehaivour)
                throw e;
              let behaivour = await failureBehaivour(i, e);
              if (behaivour == "ignore") {
                done = true;
                return;
              } else if (behaivour == "stop")
                throw e;
              else if (behaivour == "retry")
                return;
            });
          }
        }
        promiseResolve();
      });
    });
    await Promise.all(downloadersPromises).then((e) => {
      log6("done downloading");
      allFilesDownloaded = true;
    }).catch((e) => {
      log6("error:" + e);
    });
    log6(`files already downloaded: ${filesAlreadyDownloaded} / ${dlList.length}`);
    if (!q.length) {
      log6(`queue is empty by the time all files have been downloaded`);
      onEnd();
      clearInterval(intval);
      clearInterval(speedIntval);
      resolveDownloading();
    }
  });
}

// src/cli/sync.ts
var { log: log4, su: su4, err: err4, warn: warn4 } = log_default("integrity");
async function cliSync({ ref, path, remoteSync, content, pack, workdir, preferPacks }) {
  let reference = await IntegrityReference.decode(await (0, import_promises9.readFile)((0, import_path7.resolve)(workdir ?? process.cwd(), ref)));
  let source = {
    contentRemote: content ?? "",
    packRemote: pack ?? "",
    packs: reference.packs,
    splits: reference.splitFiles,
    uuid: reference.uuid
  };
  let totalBytes = reference.entries.reduce((a, b) => a + Number(BigLongL(b.fileLength)), 0);
  log4(`verifying ${(0, import_path7.basename)(ref)} (${reference.uuid}${reference.contentVersion ? `@ ${reference.contentVersion}` : ""}) with ${reference.entries.length} entries, ${bytesToString(totalBytes)}`);
  let verifyPath = (0, import_path7.resolve)(workdir ?? process.cwd(), path);
  let verifyStartTime = Date.now();
  let veriResult = await verifyDirReference(verifyPath, reference.entries.map((e) => {
    return { ...e, source };
  }), false);
  let verifyEndTime = Date.now();
  let verifyTime = verifyEndTime - verifyStartTime;
  let failed = veriResult.filter((e) => !e.result);
  let failedBytes = failed.reduce((a, b) => a + Number(BigLongL(b.entry.fileLength)), 0);
  if (!failed.length) {
    su4(`done in ${verifyTime}ms; files are valid. ${bytesToString(totalBytes)} verified in ${veriResult.length} files (${bytesToString(totalBytes / (verifyTime / 1e3))}/s)`);
    return;
  }
  log4(`done in ${verifyTime}ms; ${failed.length}/${veriResult.length} failed ${bytesToString(failedBytes)}/${bytesToString(totalBytes)} [${(failedBytes / totalBytes * 100).toFixed(2)}%] (${bytesToString(failedBytes / (verifyTime / 1e3))}/s)`);
  if (!remoteSync)
    return;
  log4(`syncing ${failed.length} files...`);
  let syncStartTime = Date.now();
  let req = veriResult.filter((e) => !e.result).map((e) => {
    return {
      fileSize: Number(BigLongL(e.entry.fileLength)),
      packUid: e.entry.packUid,
      relativePath: e.entry.relativePath,
      source: e.source
    };
  });
  let d = initiateDownload(req, preferPacks);
  await new Promise((r) => {
    download(
      verifyPath,
      d.dlList,
      d.splitList,
      (status, bytes, totalBytes2, percent, bytesPerSecond) => {
        console.log(`\u{1F310} ${percent}% ${status} ${bytesToString(bytes)}/${bytesToString(totalBytes2)} (${bytesToString(bytesPerSecond)}/s)`);
      },
      () => {
        r();
      }
    );
  });
  return;
}

// src/cli/hashpatch.ts
var import_promises10 = require("fs/promises");
var import_path8 = require("path");
var import_fs5 = require("fs");
var import_terminal_kit3 = __toESM(require("terminal-kit"));
var { log: log5, su: su5, err: err5, warn: warn5 } = log_default("integrity");
var term2 = import_terminal_kit3.default.terminal;
async function cliHashpatch({ path, ref, saveAsJson, workdir, contentVersion }) {
  let startTime = Date.now();
  let p = (0, import_path8.resolve)(workdir ?? process.cwd(), path);
  log5(`updating reference for ${p}...`);
  let entries = await genDirReference(p, {}, void 0, true);
  let size = entries.reduce((a, b) => a + Number(BigLongL(b.fileLength)), 0);
  let entriesEndTime = Date.now();
  su5(`done ${entries.length} entires, ${bytesToString(size)} in ${Date.now() - startTime}ms (${bytesToString(size / ((Date.now() - startTime) / 1e3))}/s)
	`);
  let targetFile = (0, import_path8.resolve)(workdir ?? process.cwd(), ref);
  let reference = IntegrityReference.decode(await (0, import_promises10.readFile)(targetFile));
  for (var ent of entries) {
    if (!reference.entries.some((e) => e.relativePath == ent.relativePath)) {
      warn5(`entry ${ent.relativePath} does not exist in target reference !!!`);
      continue;
    }
    reference.entries.find((e) => e.relativePath == ent.relativePath).fileLength = ent.fileLength;
    reference.entries.find((e) => e.relativePath == ent.relativePath).xxh32 = Number(BigLongL(ent.xxh32));
  }
  let basePath = workdir ?? process.cwd();
  await (0, import_promises10.writeFile)((0, import_path8.resolve)(basePath, ref), IntegrityReference.encode(reference).finish()).then((r) => {
    let refFileSize = (0, import_fs5.statSync)((0, import_path8.resolve)(basePath, ref)).size;
    su5(`saved reference to ${(0, import_path8.resolve)(basePath, ref)} [${bytesToString(refFileSize)}]`);
  });
  if (saveAsJson) {
    await (0, import_promises10.writeFile)((0, import_path8.resolve)(basePath, ref + ".json"), JSON.stringify(reference, null, 2)).then((r) => {
      let refFileSize = (0, import_fs5.statSync)((0, import_path8.resolve)(basePath, ref + ".json")).size;
      su5(`saved reference to ${(0, import_path8.resolve)(basePath, ref + ".json")} [${bytesToString(refFileSize)}]`);
    });
  }
}

// src/cli.ts
(0, import_yargs.default)((0, import_helpers.hideBin)(process.argv)).command(
  "new",
  "Create a new integrity reference",
  (y) => y.option("path", { type: "string", demandOption: true, description: "Path to the directory to create the reference from" }).option("ref", { type: "string", demandOption: true, description: "Path to the reference file to create" }).option("ruleset", { type: "string", demandOption: false, description: "Path to the .yml ruleset file to use. Read more about rules: https://wiki.dragonhost.ru/launchers/" }).options("rule", { type: "array", demandOption: false, description: "Rule to use for a specific glob. Read more about rules: https://wiki.dragonhost.ru/launchers/" }).option("packpath", { type: "string", demandOption: false, description: "Path to the directory to store created packs in (if configured in rules or ruleset)" }).option("saveAsJson", { type: "boolean", demandOption: false, description: "Save reference as json (still does save to protobuf too)" }).option("contentVersion", { type: "number", demandOption: false, description: "Content version to set in the reference file" }),
  cliNew
).command(
  "rm [match]",
  "Remove entry from integrity reference",
  (y) => y.positional("match", { type: "string", desc: "Glob pattern or exact entry name to remove", demandOption: true }).option("ref", { type: "string", demandOption: true, description: "Path to the reference file to remove the entry from" }).option("path", { type: "string", demandOption: false, description: "(required if --tap=false) Path to the directory to remove the entry from" }).option("packpath", { type: "string", demandOption: false, description: "(required if --tap=false and reference has packs) Path to packs to remove entry from" }).option("recursive", { type: "boolean", demandOption: false, description: "Remove all entries that match the glob pattern" }).option("force", { type: "boolean", demandOption: false, description: "Do not ask for confirmation ON RECURSIVE MATCHES ONLY" }).option("ask", { type: "boolean", demandOption: false, description: "Ask for confirmation ON EVERYTHING" }).option("strict", { type: "boolean", demandOption: false, description: "Match for exact entry name instead of glob pattern" }).option("tap", { type: "boolean", demandOption: false, description: "Do not remove actual files, just remove entries from reference" }),
  cliRm
).command(
  "hashpatch",
  "patch hash",
  (y) => y.option("path", { type: "string", demandOption: true, description: "Path to the directory to create the reference from" }).option("ref", { type: "string", demandOption: true, description: "Path to the reference file to create" }).option("saveAsJson", { type: "boolean", demandOption: false, description: "Save reference as json (still does save to protobuf too)" }).option("contentVersion", { type: "number", demandOption: false, description: "Content version to set in the reference file" }),
  cliHashpatch,
  [],
  true
).command(
  "sync",
  "Verify and sync a directory",
  (y) => y.option("ref", { type: "string", demandOption: true, description: "Path to the reference file to verify against" }).option("path", { type: "string", demandOption: true, description: "Path to the directory to verify" }).option("remoteSync", { type: "boolean", demandOption: false, description: "Sync files that do not match the reference" }).option("content", { type: "string", demandOption: false, description: "URL to the remote content directory to use for syncing" }).option("pack", { type: "string", demandOption: false, description: "URL to the remote pack directory to use for syncing" }).option("preferPacks", { type: "boolean", demandOption: false, description: "Use only packs for downloading" }),
  cliSync
).option("workdir", { type: "string", demandOption: false, description: "Directory to use as a working directory. Defaults to cwd" }).middleware((argv) => {
  console.log(`\u{1F6E1}\uFE0F  integrity sync
   https://dragonhost.org/integrity-sync

`);
}).parseAsync().then(() => {
  process.exit(0);
});
