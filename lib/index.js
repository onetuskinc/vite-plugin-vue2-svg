"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSvgPlugin = void 0;
var fs_1 = require("fs");
var path_1 = require("path");
var svgo_1 = __importDefault(require("svgo"));
var component_compiler_utils_1 = require("@vue/component-compiler-utils");
var compiler = __importStar(require("vue-template-compiler"));
function compileSvg(svg, id) {
    var template = component_compiler_utils_1.parse({
        source: "\n      <template>\n        " + svg + "\n      </template>\n    ",
        compiler: compiler,
        filename: path_1.basename(id) + ".vue",
    }).template;
    if (!template)
        return "";
    var result = component_compiler_utils_1.compileTemplate({
        compiler: compiler,
        source: template.content,
        filename: path_1.basename(id) + ".vue",
    });
    return "\n    " + result.code + "\n    export default {\n      render: render,    \n    }\n  ";
}
function optimizeSvg(svgo, content, path) {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, svgo.optimize(content, {
                        path: path,
                    })];
                case 1:
                    data = (_a.sent()).data;
                    return [2, data];
            }
        });
    });
}
function createSvgPlugin(options) {
    if (options === void 0) { options = {}; }
    var svgoConfig = options.svgoConfig;
    var svgo = new svgo_1.default(svgoConfig);
    var svgRegex = /(^.*?\.svg)(\?.*)?$/;
    return {
        name: "vite-plugin-vue2-svg",
        transform: function (_source, id) {
            return __awaiter(this, void 0, void 0, function () {
                var match, code, svg, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            match = id.match(svgRegex);
                            if (!match) return [3, 2];
                            code = fs_1.readFileSync(match[1], { encoding: "utf-8" });
                            return [4, optimizeSvg(svgo, code, match[1])];
                        case 1:
                            svg = _a.sent();
                            if (!svg)
                                throw new Error("[vite-plugin-vue2-svg] fail to compile " + match[1]);
                            result = compileSvg(svg, match[1]);
                            return [2, result];
                        case 2: return [2, null];
                    }
                });
            });
        },
    };
}
exports.createSvgPlugin = createSvgPlugin;
//# sourceMappingURL=index.js.map