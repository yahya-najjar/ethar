(function webpackUniversalModuleDefinition(root, factory) {
    if(typeof exports === 'object' && typeof module === 'object')
        module.exports = factory();
    else if(typeof define === 'function' && define.amd)
        define([], factory);
    else if(typeof exports === 'object')
        exports["elastic-apm-rum"] = factory();
    else
        root["elastic-apm-rum"] = factory();
})(self, function() {
    return /******/ (function() { // webpackBootstrap
        /******/ 	var __webpack_modules__ = ({

            /***/ "../rum-core/dist/es/bootstrap.js":
            /*!****************************************!*\
  !*** ../rum-core/dist/es/bootstrap.js ***!
  \****************************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                    /* harmony export */   "bootstrap": function() { return /* binding */ bootstrap; }
                    /* harmony export */ });
                /* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./common/utils */ "../rum-core/dist/es/common/utils.js");
                /* harmony import */ var _common_patching__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./common/patching */ "../rum-core/dist/es/common/patching/index.js");
                /* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./state */ "../rum-core/dist/es/state.js");



                var enabled = false;
                function bootstrap() {
                    if ((0,_common_utils__WEBPACK_IMPORTED_MODULE_0__.isPlatformSupported)()) {
                        (0,_common_patching__WEBPACK_IMPORTED_MODULE_1__.patchAll)();
                        _state__WEBPACK_IMPORTED_MODULE_2__.state.bootstrapTime = (0,_common_utils__WEBPACK_IMPORTED_MODULE_0__.now)();
                        enabled = true;
                    } else if (_common_utils__WEBPACK_IMPORTED_MODULE_0__.isBrowser) {
                        console.log('[Elastic APM] platform is not supported!');
                    }

                    return enabled;
                }

                /***/ }),

            /***/ "../rum-core/dist/es/common/after-frame.js":
            /*!*************************************************!*\
  !*** ../rum-core/dist/es/common/after-frame.js ***!
  \*************************************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                    /* harmony export */   "default": function() { return /* binding */ afterFrame; }
                    /* harmony export */ });
                var RAF_TIMEOUT = 100;
                function afterFrame(callback) {
                    var handler = function handler() {
                        clearTimeout(timeout);
                        cancelAnimationFrame(raf);
                        setTimeout(callback);
                    };

                    var timeout = setTimeout(handler, RAF_TIMEOUT);
                    var raf = requestAnimationFrame(handler);
                }

                /***/ }),

            /***/ "../rum-core/dist/es/common/apm-server.js":
            /*!************************************************!*\
  !*** ../rum-core/dist/es/common/apm-server.js ***!
  \************************************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */ var _queue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./queue */ "../rum-core/dist/es/common/queue.js");
                /* harmony import */ var _throttle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./throttle */ "../rum-core/dist/es/common/throttle.js");
                /* harmony import */ var _ndjson__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./ndjson */ "../rum-core/dist/es/common/ndjson.js");
                /* harmony import */ var _truncate__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./truncate */ "../rum-core/dist/es/common/truncate.js");
                /* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./constants */ "../rum-core/dist/es/common/constants.js");
                /* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "../rum-core/dist/es/common/utils.js");
                /* harmony import */ var _polyfills__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./polyfills */ "../rum-core/dist/es/common/polyfills.js");
                /* harmony import */ var _compress__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./compress */ "../rum-core/dist/es/common/compress.js");
                /* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../state */ "../rum-core/dist/es/state.js");
                /* harmony import */ var _http_fetch__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./http/fetch */ "../rum-core/dist/es/common/http/fetch.js");
                /* harmony import */ var _http_xhr__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./http/xhr */ "../rum-core/dist/es/common/http/xhr.js");











                var THROTTLE_INTERVAL = 60000;

                var ApmServer = function () {
                    function ApmServer(configService, loggingService) {
                        this._configService = configService;
                        this._loggingService = loggingService;
                        this.queue = undefined;
                        this.throttleEvents = _utils__WEBPACK_IMPORTED_MODULE_0__.noop;
                    }

                    var _proto = ApmServer.prototype;

                    _proto.init = function init() {
                        var _this = this;

                        var queueLimit = this._configService.get('queueLimit');

                        var flushInterval = this._configService.get('flushInterval');

                        var limit = this._configService.get('eventsLimit');

                        var onFlush = function onFlush(events) {
                            var promise = _this.sendEvents(events);

                            if (promise) {
                                promise.catch(function (reason) {
                                    _this._loggingService.warn('Failed sending events!', _this._constructError(reason));
                                });
                            }
                        };

                        this.queue = new _queue__WEBPACK_IMPORTED_MODULE_1__.default(onFlush, {
                            queueLimit: queueLimit,
                            flushInterval: flushInterval
                        });
                        this.throttleEvents = (0,_throttle__WEBPACK_IMPORTED_MODULE_2__.default)(this.queue.add.bind(this.queue), function () {
                            return _this._loggingService.warn('Dropped events due to throttling!');
                        }, {
                            limit: limit,
                            interval: THROTTLE_INTERVAL
                        });

                        this._configService.observeEvent(_constants__WEBPACK_IMPORTED_MODULE_3__.QUEUE_FLUSH, function () {
                            _this.queue.flush();
                        });
                    };

                    _proto._postJson = function _postJson(endPoint, payload) {
                        var _this2 = this;

                        var headers = {
                            'Content-Type': 'application/x-ndjson'
                        };

                        var apmRequest = this._configService.get('apmRequest');

                        var params = {
                            payload: payload,
                            headers: headers,
                            beforeSend: apmRequest
                        };
                        return (0,_compress__WEBPACK_IMPORTED_MODULE_4__.compressPayload)(params).catch(function (error) {
                            if (_state__WEBPACK_IMPORTED_MODULE_5__.__DEV__) {
                                _this2._loggingService.debug('Compressing the payload using CompressionStream API failed', error.message);
                            }

                            return params;
                        }).then(function (result) {
                            return _this2._makeHttpRequest('POST', endPoint, result);
                        }).then(function (_ref) {
                            var responseText = _ref.responseText;
                            return responseText;
                        });
                    };

                    _proto._constructError = function _constructError(reason) {
                        var url = reason.url,
                            status = reason.status,
                            responseText = reason.responseText;

                        if (typeof status == 'undefined') {
                            return reason;
                        }

                        var message = url + ' HTTP status: ' + status;

                        if (_state__WEBPACK_IMPORTED_MODULE_5__.__DEV__ && responseText) {
                            try {
                                var serverErrors = [];
                                var response = JSON.parse(responseText);

                                if (response.errors && response.errors.length > 0) {
                                    response.errors.forEach(function (err) {
                                        return serverErrors.push(err.message);
                                    });
                                    message += ' ' + serverErrors.join(',');
                                }
                            } catch (e) {
                                this._loggingService.debug('Error parsing response from APM server', e);
                            }
                        }

                        return new Error(message);
                    };

                    _proto._makeHttpRequest = function _makeHttpRequest(method, url, _temp) {
                        var _ref2 = _temp === void 0 ? {} : _temp,
                            _ref2$timeout = _ref2.timeout,
                            timeout = _ref2$timeout === void 0 ? _constants__WEBPACK_IMPORTED_MODULE_3__.HTTP_REQUEST_TIMEOUT : _ref2$timeout,
                            payload = _ref2.payload,
                            headers = _ref2.headers,
                            beforeSend = _ref2.beforeSend;

                        var sendCredentials = this._configService.get('sendCredentials');

                        if (!beforeSend && (0,_http_fetch__WEBPACK_IMPORTED_MODULE_6__.shouldUseFetchWithKeepAlive)(method, payload)) {
                            return (0,_http_fetch__WEBPACK_IMPORTED_MODULE_6__.sendFetchRequest)(method, url, {
                                keepalive: true,
                                timeout: timeout,
                                payload: payload,
                                headers: headers,
                                sendCredentials: sendCredentials
                            }).catch(function (reason) {
                                if (reason instanceof TypeError) {
                                    return (0,_http_xhr__WEBPACK_IMPORTED_MODULE_7__.sendXHR)(method, url, {
                                        timeout: timeout,
                                        payload: payload,
                                        headers: headers,
                                        beforeSend: beforeSend,
                                        sendCredentials: sendCredentials
                                    });
                                }

                                throw reason;
                            });
                        }

                        return (0,_http_xhr__WEBPACK_IMPORTED_MODULE_7__.sendXHR)(method, url, {
                            timeout: timeout,
                            payload: payload,
                            headers: headers,
                            beforeSend: beforeSend,
                            sendCredentials: sendCredentials
                        });
                    };

                    _proto.fetchConfig = function fetchConfig(serviceName, environment) {
                        var _this3 = this;

                        var _this$getEndpoints = this.getEndpoints(),
                            configEndpoint = _this$getEndpoints.configEndpoint;

                        if (!serviceName) {
                            return _polyfills__WEBPACK_IMPORTED_MODULE_8__.Promise.reject('serviceName is required for fetching central config.');
                        }

                        configEndpoint += "?service.name=" + serviceName;

                        if (environment) {
                            configEndpoint += "&service.environment=" + environment;
                        }

                        var localConfig = this._configService.getLocalConfig();

                        if (localConfig) {
                            configEndpoint += "&ifnonematch=" + localConfig.etag;
                        }

                        var apmRequest = this._configService.get('apmRequest');

                        return this._makeHttpRequest('GET', configEndpoint, {
                            timeout: 5000,
                            beforeSend: apmRequest
                        }).then(function (xhr) {
                            var status = xhr.status,
                                responseText = xhr.responseText;

                            if (status === 304) {
                                return localConfig;
                            } else {
                                var remoteConfig = JSON.parse(responseText);
                                var etag = xhr.getResponseHeader('etag');

                                if (etag) {
                                    remoteConfig.etag = etag.replace(/["]/g, '');

                                    _this3._configService.setLocalConfig(remoteConfig, true);
                                }

                                return remoteConfig;
                            }
                        }).catch(function (reason) {
                            var error = _this3._constructError(reason);

                            return _polyfills__WEBPACK_IMPORTED_MODULE_8__.Promise.reject(error);
                        });
                    };

                    _proto.createMetaData = function createMetaData() {
                        var cfg = this._configService;
                        var metadata = {
                            service: {
                                name: cfg.get('serviceName'),
                                version: cfg.get('serviceVersion'),
                                agent: {
                                    name: 'rum-js',
                                    version: cfg.version
                                },
                                language: {
                                    name: 'javascript'
                                },
                                environment: cfg.get('environment')
                            },
                            labels: cfg.get('context.tags')
                        };
                        return (0,_truncate__WEBPACK_IMPORTED_MODULE_9__.truncateModel)(_truncate__WEBPACK_IMPORTED_MODULE_9__.METADATA_MODEL, metadata);
                    };

                    _proto.addError = function addError(error) {
                        var _this$throttleEvents;

                        this.throttleEvents((_this$throttleEvents = {}, _this$throttleEvents[_constants__WEBPACK_IMPORTED_MODULE_3__.ERRORS] = error, _this$throttleEvents));
                    };

                    _proto.addTransaction = function addTransaction(transaction) {
                        var _this$throttleEvents2;

                        this.throttleEvents((_this$throttleEvents2 = {}, _this$throttleEvents2[_constants__WEBPACK_IMPORTED_MODULE_3__.TRANSACTIONS] = transaction, _this$throttleEvents2));
                    };

                    _proto.ndjsonErrors = function ndjsonErrors(errors, compress) {
                        var key = compress ? 'e' : 'error';
                        return errors.map(function (error) {
                            var _NDJSON$stringify;

                            return _ndjson__WEBPACK_IMPORTED_MODULE_10__.default.stringify((_NDJSON$stringify = {}, _NDJSON$stringify[key] = compress ? (0,_compress__WEBPACK_IMPORTED_MODULE_4__.compressError)(error) : error, _NDJSON$stringify));
                        });
                    };

                    _proto.ndjsonMetricsets = function ndjsonMetricsets(metricsets) {
                        return metricsets.map(function (metricset) {
                            return _ndjson__WEBPACK_IMPORTED_MODULE_10__.default.stringify({
                                metricset: metricset
                            });
                        }).join('');
                    };

                    _proto.ndjsonTransactions = function ndjsonTransactions(transactions, compress) {
                        var _this4 = this;

                        var key = compress ? 'x' : 'transaction';
                        return transactions.map(function (tr) {
                            var _NDJSON$stringify2;

                            var spans = '',
                                breakdowns = '';

                            if (!compress) {
                                if (tr.spans) {
                                    spans = tr.spans.map(function (span) {
                                        return _ndjson__WEBPACK_IMPORTED_MODULE_10__.default.stringify({
                                            span: span
                                        });
                                    }).join('');
                                    delete tr.spans;
                                }

                                if (tr.breakdown) {
                                    breakdowns = _this4.ndjsonMetricsets(tr.breakdown);
                                    delete tr.breakdown;
                                }
                            }

                            return _ndjson__WEBPACK_IMPORTED_MODULE_10__.default.stringify((_NDJSON$stringify2 = {}, _NDJSON$stringify2[key] = compress ? (0,_compress__WEBPACK_IMPORTED_MODULE_4__.compressTransaction)(tr) : tr, _NDJSON$stringify2)) + spans + breakdowns;
                        });
                    };

                    _proto.sendEvents = function sendEvents(events) {
                        var _payload, _NDJSON$stringify3;

                        if (events.length === 0) {
                            return;
                        }

                        var transactions = [];
                        var errors = [];

                        for (var i = 0; i < events.length; i++) {
                            var event = events[i];

                            if (event[_constants__WEBPACK_IMPORTED_MODULE_3__.TRANSACTIONS]) {
                                transactions.push(event[_constants__WEBPACK_IMPORTED_MODULE_3__.TRANSACTIONS]);
                            }

                            if (event[_constants__WEBPACK_IMPORTED_MODULE_3__.ERRORS]) {
                                errors.push(event[_constants__WEBPACK_IMPORTED_MODULE_3__.ERRORS]);
                            }
                        }

                        if (transactions.length === 0 && errors.length === 0) {
                            return;
                        }

                        var cfg = this._configService;
                        var payload = (_payload = {}, _payload[_constants__WEBPACK_IMPORTED_MODULE_3__.TRANSACTIONS] = transactions, _payload[_constants__WEBPACK_IMPORTED_MODULE_3__.ERRORS] = errors, _payload);
                        var filteredPayload = cfg.applyFilters(payload);

                        if (!filteredPayload) {
                            this._loggingService.warn('Dropped payload due to filtering!');

                            return;
                        }

                        var apiVersion = cfg.get('apiVersion');
                        var compress = apiVersion > 2;
                        var ndjson = [];
                        var metadata = this.createMetaData();
                        var metadataKey = compress ? 'm' : 'metadata';
                        ndjson.push(_ndjson__WEBPACK_IMPORTED_MODULE_10__.default.stringify((_NDJSON$stringify3 = {}, _NDJSON$stringify3[metadataKey] = compress ? (0,_compress__WEBPACK_IMPORTED_MODULE_4__.compressMetadata)(metadata) : metadata, _NDJSON$stringify3)));
                        ndjson = ndjson.concat(this.ndjsonErrors(filteredPayload[_constants__WEBPACK_IMPORTED_MODULE_3__.ERRORS], compress), this.ndjsonTransactions(filteredPayload[_constants__WEBPACK_IMPORTED_MODULE_3__.TRANSACTIONS], compress));
                        var ndjsonPayload = ndjson.join('');

                        var _this$getEndpoints2 = this.getEndpoints(),
                            intakeEndpoint = _this$getEndpoints2.intakeEndpoint;

                        return this._postJson(intakeEndpoint, ndjsonPayload);
                    };

                    _proto.getEndpoints = function getEndpoints() {
                        var serverUrl = this._configService.get('serverUrl');

                        var apiVersion = this._configService.get('apiVersion');

                        var serverUrlPrefix = this._configService.get('serverUrlPrefix') || "/intake/v" + apiVersion + "/rum/events";
                        var intakeEndpoint = serverUrl + serverUrlPrefix;
                        var configEndpoint = serverUrl + "/config/v1/rum/agents";
                        return {
                            intakeEndpoint: intakeEndpoint,
                            configEndpoint: configEndpoint
                        };
                    };

                    return ApmServer;
                }();

                /* harmony default export */ __webpack_exports__["default"] = (ApmServer);

                /***/ }),

            /***/ "../rum-core/dist/es/common/compress.js":
            /*!**********************************************!*\
  !*** ../rum-core/dist/es/common/compress.js ***!
  \**********************************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                    /* harmony export */   "compressMetadata": function() { return /* binding */ compressMetadata; },
                    /* harmony export */   "compressTransaction": function() { return /* binding */ compressTransaction; },
                    /* harmony export */   "compressError": function() { return /* binding */ compressError; },
                    /* harmony export */   "compressMetricsets": function() { return /* binding */ compressMetricsets; },
                    /* harmony export */   "compressPayload": function() { return /* binding */ compressPayload; }
                    /* harmony export */ });
                /* harmony import */ var _polyfills__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./polyfills */ "../rum-core/dist/es/common/polyfills.js");
                /* harmony import */ var _performance_monitoring_navigation_marks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../performance-monitoring/navigation/marks */ "../rum-core/dist/es/performance-monitoring/navigation/marks.js");
                /* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils */ "../rum-core/dist/es/common/utils.js");




                function compressStackFrames(frames) {
                    return frames.map(function (frame) {
                        return {
                            ap: frame.abs_path,
                            f: frame.filename,
                            fn: frame.function,
                            li: frame.lineno,
                            co: frame.colno
                        };
                    });
                }

                function compressResponse(response) {
                    return {
                        ts: response.transfer_size,
                        ebs: response.encoded_body_size,
                        dbs: response.decoded_body_size
                    };
                }

                function compressHTTP(http) {
                    var compressed = {};
                    var method = http.method,
                        status_code = http.status_code,
                        url = http.url,
                        response = http.response;
                    compressed.url = url;

                    if (method) {
                        compressed.mt = method;
                    }

                    if (status_code) {
                        compressed.sc = status_code;
                    }

                    if (response) {
                        compressed.r = compressResponse(response);
                    }

                    return compressed;
                }

                function compressContext(context) {
                    if (!context) {
                        return null;
                    }

                    var compressed = {};
                    var page = context.page,
                        http = context.http,
                        response = context.response,
                        destination = context.destination,
                        user = context.user,
                        custom = context.custom;

                    if (page) {
                        compressed.p = {
                            rf: page.referer,
                            url: page.url
                        };
                    }

                    if (http) {
                        compressed.h = compressHTTP(http);
                    }

                    if (response) {
                        compressed.r = compressResponse(response);
                    }

                    if (destination) {
                        var service = destination.service;
                        compressed.dt = {
                            se: {
                                n: service.name,
                                t: service.type,
                                rc: service.resource
                            },
                            ad: destination.address,
                            po: destination.port
                        };
                    }

                    if (user) {
                        compressed.u = {
                            id: user.id,
                            un: user.username,
                            em: user.email
                        };
                    }

                    if (custom) {
                        compressed.cu = custom;
                    }

                    return compressed;
                }

                function compressMarks(marks) {
                    if (!marks) {
                        return null;
                    }

                    var compressedNtMarks = compressNavigationTimingMarks(marks.navigationTiming);
                    var compressed = {
                        nt: compressedNtMarks,
                        a: compressAgentMarks(compressedNtMarks, marks.agent)
                    };
                    return compressed;
                }

                function compressNavigationTimingMarks(ntMarks) {
                    if (!ntMarks) {
                        return null;
                    }

                    var compressed = {};
                    _performance_monitoring_navigation_marks__WEBPACK_IMPORTED_MODULE_0__.COMPRESSED_NAV_TIMING_MARKS.forEach(function (mark, index) {
                        var mapping = _performance_monitoring_navigation_marks__WEBPACK_IMPORTED_MODULE_0__.NAVIGATION_TIMING_MARKS[index];
                        compressed[mark] = ntMarks[mapping];
                    });
                    return compressed;
                }

                function compressAgentMarks(compressedNtMarks, agentMarks) {
                    var compressed = {};

                    if (compressedNtMarks) {
                        compressed = {
                            fb: compressedNtMarks.rs,
                            di: compressedNtMarks.di,
                            dc: compressedNtMarks.dc
                        };
                    }

                    if (agentMarks) {
                        var fp = agentMarks.firstContentfulPaint;
                        var lp = agentMarks.largestContentfulPaint;

                        if (fp) {
                            compressed.fp = fp;
                        }

                        if (lp) {
                            compressed.lp = lp;
                        }
                    }

                    if (Object.keys(compressed).length === 0) {
                        return null;
                    }

                    return compressed;
                }

                function compressMetadata(metadata) {
                    var service = metadata.service,
                        labels = metadata.labels;
                    var agent = service.agent,
                        language = service.language;
                    return {
                        se: {
                            n: service.name,
                            ve: service.version,
                            a: {
                                n: agent.name,
                                ve: agent.version
                            },
                            la: {
                                n: language.name
                            },
                            en: service.environment
                        },
                        l: labels
                    };
                }
                function compressTransaction(transaction) {
                    var spans = transaction.spans.map(function (span) {
                        var spanData = {
                            id: span.id,
                            n: span.name,
                            t: span.type,
                            s: span.start,
                            d: span.duration,
                            c: compressContext(span.context),
                            o: span.outcome,
                            sr: span.sample_rate
                        };

                        if (span.parent_id !== transaction.id) {
                            spanData.pid = span.parent_id;
                        }

                        if (span.sync === true) {
                            spanData.sy = true;
                        }

                        if (span.subtype) {
                            spanData.su = span.subtype;
                        }

                        if (span.action) {
                            spanData.ac = span.action;
                        }

                        return spanData;
                    });
                    var tr = {
                        id: transaction.id,
                        tid: transaction.trace_id,
                        n: transaction.name,
                        t: transaction.type,
                        d: transaction.duration,
                        c: compressContext(transaction.context),
                        k: compressMarks(transaction.marks),
                        me: compressMetricsets(transaction.breakdown),
                        y: spans,
                        yc: {
                            sd: spans.length
                        },
                        sm: transaction.sampled,
                        sr: transaction.sample_rate,
                        o: transaction.outcome
                    };

                    if (transaction.experience) {
                        var _transaction$experien = transaction.experience,
                            cls = _transaction$experien.cls,
                            fid = _transaction$experien.fid,
                            tbt = _transaction$experien.tbt,
                            longtask = _transaction$experien.longtask;
                        tr.exp = {
                            cls: cls,
                            fid: fid,
                            tbt: tbt,
                            lt: longtask
                        };
                    }

                    if (transaction.session) {
                        var _transaction$session = transaction.session,
                            id = _transaction$session.id,
                            sequence = _transaction$session.sequence;
                        tr.ses = {
                            id: id,
                            seq: sequence
                        };
                    }

                    return tr;
                }
                function compressError(error) {
                    var exception = error.exception;
                    var compressed = {
                        id: error.id,
                        cl: error.culprit,
                        ex: {
                            mg: exception.message,
                            st: compressStackFrames(exception.stacktrace),
                            t: error.type
                        },
                        c: compressContext(error.context)
                    };
                    var transaction = error.transaction;

                    if (transaction) {
                        compressed.tid = error.trace_id;
                        compressed.pid = error.parent_id;
                        compressed.xid = error.transaction_id;
                        compressed.x = {
                            t: transaction.type,
                            sm: transaction.sampled
                        };
                    }

                    return compressed;
                }
                function compressMetricsets(breakdowns) {
                    return breakdowns.map(function (_ref) {
                        var span = _ref.span,
                            samples = _ref.samples;
                        return {
                            y: {
                                t: span.type
                            },
                            sa: {
                                ysc: {
                                    v: samples['span.self_time.count'].value
                                },
                                yss: {
                                    v: samples['span.self_time.sum.us'].value
                                }
                            }
                        };
                    });
                }
                function compressPayload(params, type) {
                    if (type === void 0) {
                        type = 'gzip';
                    }

                    var isCompressionStreamSupported = typeof CompressionStream === 'function';
                    return new _polyfills__WEBPACK_IMPORTED_MODULE_1__.Promise(function (resolve) {
                        if (!isCompressionStreamSupported) {
                            return resolve(params);
                        }

                        if ((0,_utils__WEBPACK_IMPORTED_MODULE_2__.isBeaconInspectionEnabled)()) {
                            return resolve(params);
                        }

                        var payload = params.payload,
                            headers = params.headers,
                            beforeSend = params.beforeSend;
                        var payloadStream = new Blob([payload]).stream();
                        var compressedStream = payloadStream.pipeThrough(new CompressionStream(type));
                        return new Response(compressedStream).blob().then(function (payload) {
                            headers['Content-Encoding'] = type;
                            return resolve({
                                payload: payload,
                                headers: headers,
                                beforeSend: beforeSend
                            });
                        });
                    });
                }

                /***/ }),

            /***/ "../rum-core/dist/es/common/config-service.js":
            /*!****************************************************!*\
  !*** ../rum-core/dist/es/common/config-service.js ***!
  \****************************************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "../rum-core/dist/es/common/utils.js");
                /* harmony import */ var _event_handler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./event-handler */ "../rum-core/dist/es/common/event-handler.js");
                /* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ "../rum-core/dist/es/common/constants.js");
                function _extends() {
                    _extends = Object.assign || function (target) {
                        for (var i = 1; i < arguments.length; i++) {
                            var source = arguments[i];

                            for (var key in source) {
                                if (Object.prototype.hasOwnProperty.call(source, key)) {
                                    target[key] = source[key];
                                }
                            }
                        }

                        return target;
                    };

                    return _extends.apply(this, arguments);
                }





                function getConfigFromScript() {
                    var script = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.getCurrentScript)();
                    var config = getDataAttributesFromNode(script);
                    return config;
                }

                function getDataAttributesFromNode(node) {
                    if (!node) {
                        return {};
                    }

                    var dataAttrs = {};
                    var dataRegex = /^data-([\w-]+)$/;
                    var attrs = node.attributes;

                    for (var i = 0; i < attrs.length; i++) {
                        var attr = attrs[i];

                        if (dataRegex.test(attr.nodeName)) {
                            var key = attr.nodeName.match(dataRegex)[1];
                            var camelCasedkey = key.split('-').map(function (value, index) {
                                return index > 0 ? value.charAt(0).toUpperCase() + value.substring(1) : value;
                            }).join('');
                            dataAttrs[camelCasedkey] = attr.value || attr.nodeValue;
                        }
                    }

                    return dataAttrs;
                }

                var Config = function () {
                    function Config() {
                        this.config = {
                            serviceName: '',
                            serviceVersion: '',
                            environment: '',
                            serverUrl: 'http://localhost:8200',
                            serverUrlPrefix: '',
                            active: true,
                            instrument: true,
                            disableInstrumentations: [],
                            logLevel: 'warn',
                            breakdownMetrics: false,
                            ignoreTransactions: [],
                            eventsLimit: 80,
                            queueLimit: -1,
                            flushInterval: 500,
                            distributedTracing: true,
                            distributedTracingOrigins: [],
                            distributedTracingHeaderName: 'traceparent',
                            pageLoadTraceId: '',
                            pageLoadSpanId: '',
                            pageLoadSampled: false,
                            pageLoadTransactionName: '',
                            propagateTracestate: false,
                            transactionSampleRate: 1.0,
                            centralConfig: false,
                            monitorLongtasks: true,
                            apiVersion: 2,
                            context: {},
                            session: false,
                            apmRequest: null,
                            sendCredentials: false
                        };
                        this.events = new _event_handler__WEBPACK_IMPORTED_MODULE_1__.default();
                        this.filters = [];
                        this.version = '';
                    }

                    var _proto = Config.prototype;

                    _proto.init = function init() {
                        var scriptData = getConfigFromScript();
                        this.setConfig(scriptData);
                    };

                    _proto.setVersion = function setVersion(version) {
                        this.version = version;
                    };

                    _proto.addFilter = function addFilter(cb) {
                        if (typeof cb !== 'function') {
                            throw new Error('Argument to must be function');
                        }

                        this.filters.push(cb);
                    };

                    _proto.applyFilters = function applyFilters(data) {
                        for (var i = 0; i < this.filters.length; i++) {
                            data = this.filters[i](data);

                            if (!data) {
                                return;
                            }
                        }

                        return data;
                    };

                    _proto.get = function get(key) {
                        return key.split('.').reduce(function (obj, objKey) {
                            return obj && obj[objKey];
                        }, this.config);
                    };

                    _proto.setUserContext = function setUserContext(userContext) {
                        if (userContext === void 0) {
                            userContext = {};
                        }

                        var context = {};
                        var _userContext = userContext,
                            id = _userContext.id,
                            username = _userContext.username,
                            email = _userContext.email;

                        if (typeof id === 'number' || typeof id === 'string') {
                            context.id = id;
                        }

                        if (typeof username === 'string') {
                            context.username = username;
                        }

                        if (typeof email === 'string') {
                            context.email = email;
                        }

                        this.config.context.user = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.extend)(this.config.context.user || {}, context);
                    };

                    _proto.setCustomContext = function setCustomContext(customContext) {
                        if (customContext === void 0) {
                            customContext = {};
                        }

                        this.config.context.custom = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.extend)(this.config.context.custom || {}, customContext);
                    };

                    _proto.addLabels = function addLabels(tags) {
                        var _this = this;

                        if (!this.config.context.tags) {
                            this.config.context.tags = {};
                        }

                        var keys = Object.keys(tags);
                        keys.forEach(function (k) {
                            return (0,_utils__WEBPACK_IMPORTED_MODULE_0__.setLabel)(k, tags[k], _this.config.context.tags);
                        });
                    };

                    _proto.setConfig = function setConfig(properties) {
                        if (properties === void 0) {
                            properties = {};
                        }

                        var _properties = properties,
                            transactionSampleRate = _properties.transactionSampleRate,
                            serverUrl = _properties.serverUrl;

                        if (serverUrl) {
                            properties.serverUrl = serverUrl.replace(/\/+$/, '');
                        }

                        if (!(0,_utils__WEBPACK_IMPORTED_MODULE_0__.isUndefined)(transactionSampleRate)) {
                            if (transactionSampleRate < 0.0001 && transactionSampleRate > 0) {
                                transactionSampleRate = 0.0001;
                            }

                            properties.transactionSampleRate = Math.round(transactionSampleRate * 10000) / 10000;
                        }

                        (0,_utils__WEBPACK_IMPORTED_MODULE_0__.merge)(this.config, properties);
                        this.events.send(_constants__WEBPACK_IMPORTED_MODULE_2__.CONFIG_CHANGE, [this.config]);
                    };

                    _proto.validate = function validate(properties) {
                        if (properties === void 0) {
                            properties = {};
                        }

                        var requiredKeys = ['serviceName', 'serverUrl'];
                        var allKeys = Object.keys(this.config);
                        var errors = {
                            missing: [],
                            invalid: [],
                            unknown: []
                        };
                        Object.keys(properties).forEach(function (key) {
                            if (requiredKeys.indexOf(key) !== -1 && !properties[key]) {
                                errors.missing.push(key);
                            }

                            if (allKeys.indexOf(key) === -1) {
                                errors.unknown.push(key);
                            }
                        });

                        if (properties.serviceName && !/^[a-zA-Z0-9 _-]+$/.test(properties.serviceName)) {
                            errors.invalid.push({
                                key: 'serviceName',
                                value: properties.serviceName,
                                allowed: 'a-z, A-Z, 0-9, _, -, <space>'
                            });
                        }

                        var sampleRate = properties.transactionSampleRate;

                        if (typeof sampleRate !== 'undefined' && (typeof sampleRate !== 'number' || isNaN(sampleRate) || sampleRate < 0 || sampleRate > 1)) {
                            errors.invalid.push({
                                key: 'transactionSampleRate',
                                value: sampleRate,
                                allowed: 'Number between 0 and 1'
                            });
                        }

                        return errors;
                    };

                    _proto.getLocalConfig = function getLocalConfig() {
                        var storage = sessionStorage;

                        if (this.config.session) {
                            storage = localStorage;
                        }

                        var config = storage.getItem(_constants__WEBPACK_IMPORTED_MODULE_2__.LOCAL_CONFIG_KEY);

                        if (config) {
                            return JSON.parse(config);
                        }
                    };

                    _proto.setLocalConfig = function setLocalConfig(config, merge) {
                        if (config) {
                            if (merge) {
                                var prevConfig = this.getLocalConfig();
                                config = _extends({}, prevConfig, config);
                            }

                            var storage = sessionStorage;

                            if (this.config.session) {
                                storage = localStorage;
                            }

                            storage.setItem(_constants__WEBPACK_IMPORTED_MODULE_2__.LOCAL_CONFIG_KEY, JSON.stringify(config));
                        }
                    };

                    _proto.dispatchEvent = function dispatchEvent(name, args) {
                        this.events.send(name, args);
                    };

                    _proto.observeEvent = function observeEvent(name, fn) {
                        return this.events.observe(name, fn);
                    };

                    return Config;
                }();

                /* harmony default export */ __webpack_exports__["default"] = (Config);

                /***/ }),

            /***/ "../rum-core/dist/es/common/constants.js":
            /*!***********************************************!*\
  !*** ../rum-core/dist/es/common/constants.js ***!
  \***********************************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                    /* harmony export */   "SCHEDULE": function() { return /* binding */ SCHEDULE; },
                    /* harmony export */   "INVOKE": function() { return /* binding */ INVOKE; },
                    /* harmony export */   "ADD_EVENT_LISTENER_STR": function() { return /* binding */ ADD_EVENT_LISTENER_STR; },
                    /* harmony export */   "REMOVE_EVENT_LISTENER_STR": function() { return /* binding */ REMOVE_EVENT_LISTENER_STR; },
                    /* harmony export */   "RESOURCE_INITIATOR_TYPES": function() { return /* binding */ RESOURCE_INITIATOR_TYPES; },
                    /* harmony export */   "REUSABILITY_THRESHOLD": function() { return /* binding */ REUSABILITY_THRESHOLD; },
                    /* harmony export */   "MAX_SPAN_DURATION": function() { return /* binding */ MAX_SPAN_DURATION; },
                    /* harmony export */   "PAGE_LOAD_DELAY": function() { return /* binding */ PAGE_LOAD_DELAY; },
                    /* harmony export */   "PAGE_LOAD": function() { return /* binding */ PAGE_LOAD; },
                    /* harmony export */   "ROUTE_CHANGE": function() { return /* binding */ ROUTE_CHANGE; },
                    /* harmony export */   "NAME_UNKNOWN": function() { return /* binding */ NAME_UNKNOWN; },
                    /* harmony export */   "TYPE_CUSTOM": function() { return /* binding */ TYPE_CUSTOM; },
                    /* harmony export */   "USER_TIMING_THRESHOLD": function() { return /* binding */ USER_TIMING_THRESHOLD; },
                    /* harmony export */   "TRANSACTION_START": function() { return /* binding */ TRANSACTION_START; },
                    /* harmony export */   "TRANSACTION_END": function() { return /* binding */ TRANSACTION_END; },
                    /* harmony export */   "CONFIG_CHANGE": function() { return /* binding */ CONFIG_CHANGE; },
                    /* harmony export */   "QUEUE_FLUSH": function() { return /* binding */ QUEUE_FLUSH; },
                    /* harmony export */   "QUEUE_ADD_TRANSACTION": function() { return /* binding */ QUEUE_ADD_TRANSACTION; },
                    /* harmony export */   "XMLHTTPREQUEST": function() { return /* binding */ XMLHTTPREQUEST; },
                    /* harmony export */   "FETCH": function() { return /* binding */ FETCH; },
                    /* harmony export */   "HISTORY": function() { return /* binding */ HISTORY; },
                    /* harmony export */   "EVENT_TARGET": function() { return /* binding */ EVENT_TARGET; },
                    /* harmony export */   "CLICK": function() { return /* binding */ CLICK; },
                    /* harmony export */   "ERROR": function() { return /* binding */ ERROR; },
                    /* harmony export */   "BEFORE_EVENT": function() { return /* binding */ BEFORE_EVENT; },
                    /* harmony export */   "AFTER_EVENT": function() { return /* binding */ AFTER_EVENT; },
                    /* harmony export */   "LOCAL_CONFIG_KEY": function() { return /* binding */ LOCAL_CONFIG_KEY; },
                    /* harmony export */   "HTTP_REQUEST_TYPE": function() { return /* binding */ HTTP_REQUEST_TYPE; },
                    /* harmony export */   "LONG_TASK": function() { return /* binding */ LONG_TASK; },
                    /* harmony export */   "PAINT": function() { return /* binding */ PAINT; },
                    /* harmony export */   "MEASURE": function() { return /* binding */ MEASURE; },
                    /* harmony export */   "NAVIGATION": function() { return /* binding */ NAVIGATION; },
                    /* harmony export */   "RESOURCE": function() { return /* binding */ RESOURCE; },
                    /* harmony export */   "FIRST_CONTENTFUL_PAINT": function() { return /* binding */ FIRST_CONTENTFUL_PAINT; },
                    /* harmony export */   "LARGEST_CONTENTFUL_PAINT": function() { return /* binding */ LARGEST_CONTENTFUL_PAINT; },
                    /* harmony export */   "KEYWORD_LIMIT": function() { return /* binding */ KEYWORD_LIMIT; },
                    /* harmony export */   "TEMPORARY_TYPE": function() { return /* binding */ TEMPORARY_TYPE; },
                    /* harmony export */   "USER_INTERACTION": function() { return /* binding */ USER_INTERACTION; },
                    /* harmony export */   "TRANSACTION_TYPE_ORDER": function() { return /* binding */ TRANSACTION_TYPE_ORDER; },
                    /* harmony export */   "ERRORS": function() { return /* binding */ ERRORS; },
                    /* harmony export */   "TRANSACTIONS": function() { return /* binding */ TRANSACTIONS; },
                    /* harmony export */   "CONFIG_SERVICE": function() { return /* binding */ CONFIG_SERVICE; },
                    /* harmony export */   "LOGGING_SERVICE": function() { return /* binding */ LOGGING_SERVICE; },
                    /* harmony export */   "TRANSACTION_SERVICE": function() { return /* binding */ TRANSACTION_SERVICE; },
                    /* harmony export */   "APM_SERVER": function() { return /* binding */ APM_SERVER; },
                    /* harmony export */   "PERFORMANCE_MONITORING": function() { return /* binding */ PERFORMANCE_MONITORING; },
                    /* harmony export */   "ERROR_LOGGING": function() { return /* binding */ ERROR_LOGGING; },
                    /* harmony export */   "TRUNCATED_TYPE": function() { return /* binding */ TRUNCATED_TYPE; },
                    /* harmony export */   "FIRST_INPUT": function() { return /* binding */ FIRST_INPUT; },
                    /* harmony export */   "LAYOUT_SHIFT": function() { return /* binding */ LAYOUT_SHIFT; },
                    /* harmony export */   "OUTCOME_SUCCESS": function() { return /* binding */ OUTCOME_SUCCESS; },
                    /* harmony export */   "OUTCOME_FAILURE": function() { return /* binding */ OUTCOME_FAILURE; },
                    /* harmony export */   "OUTCOME_UNKNOWN": function() { return /* binding */ OUTCOME_UNKNOWN; },
                    /* harmony export */   "SESSION_TIMEOUT": function() { return /* binding */ SESSION_TIMEOUT; },
                    /* harmony export */   "HTTP_REQUEST_TIMEOUT": function() { return /* binding */ HTTP_REQUEST_TIMEOUT; }
                    /* harmony export */ });
                var SCHEDULE = 'schedule';
                var INVOKE = 'invoke';
                var ADD_EVENT_LISTENER_STR = 'addEventListener';
                var REMOVE_EVENT_LISTENER_STR = 'removeEventListener';
                var RESOURCE_INITIATOR_TYPES = ['link', 'css', 'script', 'img', 'xmlhttprequest', 'fetch', 'beacon', 'iframe'];
                var REUSABILITY_THRESHOLD = 5000;
                var MAX_SPAN_DURATION = 5 * 60 * 1000;
                var PAGE_LOAD_DELAY = 1000;
                var PAGE_LOAD = 'page-load';
                var ROUTE_CHANGE = 'route-change';
                var TYPE_CUSTOM = 'custom';
                var USER_INTERACTION = 'user-interaction';
                var HTTP_REQUEST_TYPE = 'http-request';
                var TEMPORARY_TYPE = 'temporary';
                var NAME_UNKNOWN = 'Unknown';
                var TRANSACTION_TYPE_ORDER = [PAGE_LOAD, ROUTE_CHANGE, USER_INTERACTION, HTTP_REQUEST_TYPE, TYPE_CUSTOM, TEMPORARY_TYPE];
                var OUTCOME_SUCCESS = 'success';
                var OUTCOME_FAILURE = 'failure';
                var OUTCOME_UNKNOWN = 'unknown';
                var USER_TIMING_THRESHOLD = 60;
                var TRANSACTION_START = 'transaction:start';
                var TRANSACTION_END = 'transaction:end';
                var CONFIG_CHANGE = 'config:change';
                var QUEUE_FLUSH = 'queue:flush';
                var QUEUE_ADD_TRANSACTION = 'queue:add_transaction';
                var XMLHTTPREQUEST = 'xmlhttprequest';
                var FETCH = 'fetch';
                var HISTORY = 'history';
                var EVENT_TARGET = 'eventtarget';
                var CLICK = 'click';
                var ERROR = 'error';
                var BEFORE_EVENT = ':before';
                var AFTER_EVENT = ':after';
                var LOCAL_CONFIG_KEY = 'elastic_apm_config';
                var LONG_TASK = 'longtask';
                var PAINT = 'paint';
                var MEASURE = 'measure';
                var NAVIGATION = 'navigation';
                var RESOURCE = 'resource';
                var FIRST_CONTENTFUL_PAINT = 'first-contentful-paint';
                var LARGEST_CONTENTFUL_PAINT = 'largest-contentful-paint';
                var FIRST_INPUT = 'first-input';
                var LAYOUT_SHIFT = 'layout-shift';
                var ERRORS = 'errors';
                var TRANSACTIONS = 'transactions';
                var CONFIG_SERVICE = 'ConfigService';
                var LOGGING_SERVICE = 'LoggingService';
                var TRANSACTION_SERVICE = 'TransactionService';
                var APM_SERVER = 'ApmServer';
                var PERFORMANCE_MONITORING = 'PerformanceMonitoring';
                var ERROR_LOGGING = 'ErrorLogging';
                var TRUNCATED_TYPE = '.truncated';
                var KEYWORD_LIMIT = 1024;
                var SESSION_TIMEOUT = 30 * 60000;
                var HTTP_REQUEST_TIMEOUT = 10000;


                /***/ }),

            /***/ "../rum-core/dist/es/common/context.js":
            /*!*********************************************!*\
  !*** ../rum-core/dist/es/common/context.js ***!
  \*********************************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                    /* harmony export */   "getPageContext": function() { return /* binding */ getPageContext; },
                    /* harmony export */   "addSpanContext": function() { return /* binding */ addSpanContext; },
                    /* harmony export */   "addTransactionContext": function() { return /* binding */ addTransactionContext; }
                    /* harmony export */ });
                /* harmony import */ var _url__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./url */ "../rum-core/dist/es/common/url.js");
                /* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ "../rum-core/dist/es/common/constants.js");
                /* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "../rum-core/dist/es/common/utils.js");
                var _excluded = ["tags"];

                function _objectWithoutPropertiesLoose(source, excluded) {
                    if (source == null) return {};
                    var target = {};
                    var sourceKeys = Object.keys(source);
                    var key, i;

                    for (i = 0; i < sourceKeys.length; i++) {
                        key = sourceKeys[i];
                        if (excluded.indexOf(key) >= 0) continue;
                        target[key] = source[key];
                    }

                    return target;
                }




                var LEFT_SQUARE_BRACKET = 91;
                var RIGHT_SQUARE_BRACKET = 93;
                var EXTERNAL = 'external';
                var RESOURCE = 'resource';
                var HARD_NAVIGATION = 'hard-navigation';

                function getPortNumber(port, protocol) {
                    if (port === '') {
                        port = protocol === 'http:' ? '80' : protocol === 'https:' ? '443' : '';
                    }

                    return port;
                }

                function getResponseContext(perfTimingEntry) {
                    var transferSize = perfTimingEntry.transferSize,
                        encodedBodySize = perfTimingEntry.encodedBodySize,
                        decodedBodySize = perfTimingEntry.decodedBodySize,
                        serverTiming = perfTimingEntry.serverTiming;
                    var respContext = {
                        transfer_size: transferSize,
                        encoded_body_size: encodedBodySize,
                        decoded_body_size: decodedBodySize
                    };
                    var serverTimingStr = (0,_utils__WEBPACK_IMPORTED_MODULE_0__.getServerTimingInfo)(serverTiming);

                    if (serverTimingStr) {
                        respContext.headers = {
                            'server-timing': serverTimingStr
                        };
                    }

                    return respContext;
                }

                function getDestination(parsedUrl) {
                    var port = parsedUrl.port,
                        protocol = parsedUrl.protocol,
                        hostname = parsedUrl.hostname;
                    var portNumber = getPortNumber(port, protocol);
                    var ipv6Hostname = hostname.charCodeAt(0) === LEFT_SQUARE_BRACKET && hostname.charCodeAt(hostname.length - 1) === RIGHT_SQUARE_BRACKET;
                    var address = hostname;

                    if (ipv6Hostname) {
                        address = hostname.slice(1, -1);
                    }

                    return {
                        service: {
                            resource: hostname + ':' + portNumber,
                            name: '',
                            type: ''
                        },
                        address: address,
                        port: Number(portNumber)
                    };
                }

                function getResourceContext(data) {
                    var entry = data.entry,
                        url = data.url;
                    var parsedUrl = new _url__WEBPACK_IMPORTED_MODULE_1__.Url(url);
                    var destination = getDestination(parsedUrl);
                    return {
                        http: {
                            url: url,
                            response: getResponseContext(entry)
                        },
                        destination: destination
                    };
                }

                function getExternalContext(data) {
                    var url = data.url,
                        method = data.method,
                        target = data.target,
                        response = data.response;
                    var parsedUrl = new _url__WEBPACK_IMPORTED_MODULE_1__.Url(url);
                    var destination = getDestination(parsedUrl);
                    var context = {
                        http: {
                            method: method,
                            url: parsedUrl.href
                        },
                        destination: destination
                    };
                    var statusCode;

                    if (target && typeof target.status !== 'undefined') {
                        statusCode = target.status;
                    } else if (response) {
                        statusCode = response.status;
                    }

                    context.http.status_code = statusCode;
                    return context;
                }

                function getNavigationContext(data) {
                    var url = data.url;
                    var parsedUrl = new _url__WEBPACK_IMPORTED_MODULE_1__.Url(url);
                    var destination = getDestination(parsedUrl);
                    return {
                        destination: destination
                    };
                }

                function getPageContext() {
                    return {
                        page: {
                            referer: document.referrer,
                            url: location.href
                        }
                    };
                }
                function addSpanContext(span, data) {
                    if (!data) {
                        return;
                    }

                    var type = span.type;
                    var context;

                    switch (type) {
                        case EXTERNAL:
                            context = getExternalContext(data);
                            break;

                        case RESOURCE:
                            context = getResourceContext(data);
                            break;

                        case HARD_NAVIGATION:
                            context = getNavigationContext(data);
                            break;
                    }

                    span.addContext(context);
                }
                function addTransactionContext(transaction, _temp) {
                    var _ref = _temp === void 0 ? {} : _temp,
                        tags = _ref.tags,
                        configContext = _objectWithoutPropertiesLoose(_ref, _excluded);

                    var pageContext = getPageContext();
                    var responseContext = {};

                    if (transaction.type === _constants__WEBPACK_IMPORTED_MODULE_2__.PAGE_LOAD && (0,_utils__WEBPACK_IMPORTED_MODULE_0__.isPerfTimelineSupported)()) {
                        var entries = _utils__WEBPACK_IMPORTED_MODULE_0__.PERF.getEntriesByType(_constants__WEBPACK_IMPORTED_MODULE_2__.NAVIGATION);

                        if (entries && entries.length > 0) {
                            responseContext = {
                                response: getResponseContext(entries[0])
                            };
                        }
                    }

                    transaction.addContext(pageContext, responseContext, configContext);
                }

                /***/ }),

            /***/ "../rum-core/dist/es/common/event-handler.js":
            /*!***************************************************!*\
  !*** ../rum-core/dist/es/common/event-handler.js ***!
  \***************************************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "../rum-core/dist/es/common/constants.js");


                var EventHandler = function () {
                    function EventHandler() {
                        this.observers = {};
                    }

                    var _proto = EventHandler.prototype;

                    _proto.observe = function observe(name, fn) {
                        var _this = this;

                        if (typeof fn === 'function') {
                            if (!this.observers[name]) {
                                this.observers[name] = [];
                            }

                            this.observers[name].push(fn);
                            return function () {
                                var index = _this.observers[name].indexOf(fn);

                                if (index > -1) {
                                    _this.observers[name].splice(index, 1);
                                }
                            };
                        }
                    };

                    _proto.sendOnly = function sendOnly(name, args) {
                        var obs = this.observers[name];

                        if (obs) {
                            obs.forEach(function (fn) {
                                try {
                                    fn.apply(undefined, args);
                                } catch (error) {
                                    console.log(error, error.stack);
                                }
                            });
                        }
                    };

                    _proto.send = function send(name, args) {
                        this.sendOnly(name + _constants__WEBPACK_IMPORTED_MODULE_0__.BEFORE_EVENT, args);
                        this.sendOnly(name, args);
                        this.sendOnly(name + _constants__WEBPACK_IMPORTED_MODULE_0__.AFTER_EVENT, args);
                    };

                    return EventHandler;
                }();

                /* harmony default export */ __webpack_exports__["default"] = (EventHandler);

                /***/ }),

            /***/ "../rum-core/dist/es/common/http/fetch.js":
            /*!************************************************!*\
  !*** ../rum-core/dist/es/common/http/fetch.js ***!
  \************************************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                    /* harmony export */   "BYTE_LIMIT": function() { return /* binding */ BYTE_LIMIT; },
                    /* harmony export */   "shouldUseFetchWithKeepAlive": function() { return /* binding */ shouldUseFetchWithKeepAlive; },
                    /* harmony export */   "sendFetchRequest": function() { return /* binding */ sendFetchRequest; },
                    /* harmony export */   "isFetchSupported": function() { return /* binding */ isFetchSupported; }
                    /* harmony export */ });
                /* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "../rum-core/dist/es/common/constants.js");
                /* harmony import */ var _response_status__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./response-status */ "../rum-core/dist/es/common/http/response-status.js");
                function _extends() {
                    _extends = Object.assign || function (target) {
                        for (var i = 1; i < arguments.length; i++) {
                            var source = arguments[i];

                            for (var key in source) {
                                if (Object.prototype.hasOwnProperty.call(source, key)) {
                                    target[key] = source[key];
                                }
                            }
                        }

                        return target;
                    };

                    return _extends.apply(this, arguments);
                }



                var BYTE_LIMIT = 60 * 1000;
                function shouldUseFetchWithKeepAlive(method, payload) {
                    if (!isFetchSupported()) {
                        return false;
                    }

                    var isKeepAliveSupported = ('keepalive' in new Request(''));

                    if (!isKeepAliveSupported) {
                        return false;
                    }

                    var size = calculateSize(payload);
                    return method === 'POST' && size < BYTE_LIMIT;
                }
                function sendFetchRequest(method, url, _ref) {
                    var _ref$keepalive = _ref.keepalive,
                        keepalive = _ref$keepalive === void 0 ? false : _ref$keepalive,
                        _ref$timeout = _ref.timeout,
                        timeout = _ref$timeout === void 0 ? _constants__WEBPACK_IMPORTED_MODULE_0__.HTTP_REQUEST_TIMEOUT : _ref$timeout,
                        payload = _ref.payload,
                        headers = _ref.headers,
                        sendCredentials = _ref.sendCredentials;
                    var timeoutConfig = {};

                    if (typeof AbortController === 'function') {
                        var controller = new AbortController();
                        timeoutConfig.signal = controller.signal;
                        setTimeout(function () {
                            return controller.abort();
                        }, timeout);
                    }

                    var fetchResponse;
                    return window.fetch(url, _extends({
                        body: payload,
                        headers: headers,
                        method: method,
                        keepalive: keepalive,
                        credentials: sendCredentials ? 'include' : 'omit'
                    }, timeoutConfig)).then(function (response) {
                        fetchResponse = response;
                        return fetchResponse.text();
                    }).then(function (responseText) {
                        var bodyResponse = {
                            url: url,
                            status: fetchResponse.status,
                            responseText: responseText
                        };

                        if (!(0,_response_status__WEBPACK_IMPORTED_MODULE_1__.isResponseSuccessful)(fetchResponse.status)) {
                            throw bodyResponse;
                        }

                        return bodyResponse;
                    });
                }
                function isFetchSupported() {
                    return typeof window.fetch === 'function' && typeof window.Request === 'function';
                }

                function calculateSize(payload) {
                    if (!payload) {
                        return 0;
                    }

                    if (payload instanceof Blob) {
                        return payload.size;
                    }

                    return new Blob([payload]).size;
                }

                /***/ }),

            /***/ "../rum-core/dist/es/common/http/response-status.js":
            /*!**********************************************************!*\
  !*** ../rum-core/dist/es/common/http/response-status.js ***!
  \**********************************************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                    /* harmony export */   "isResponseSuccessful": function() { return /* binding */ isResponseSuccessful; }
                    /* harmony export */ });
                function isResponseSuccessful(status) {
                    if (status === 0 || status > 399 && status < 600) {
                        return false;
                    }

                    return true;
                }

                /***/ }),

            /***/ "../rum-core/dist/es/common/http/xhr.js":
            /*!**********************************************!*\
  !*** ../rum-core/dist/es/common/http/xhr.js ***!
  \**********************************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                    /* harmony export */   "sendXHR": function() { return /* binding */ sendXHR; }
                    /* harmony export */ });
                /* harmony import */ var _patching_patch_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../patching/patch-utils */ "../rum-core/dist/es/common/patching/patch-utils.js");
                /* harmony import */ var _response_status__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./response-status */ "../rum-core/dist/es/common/http/response-status.js");
                /* harmony import */ var _polyfills__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../polyfills */ "../rum-core/dist/es/common/polyfills.js");



                function sendXHR(method, url, _ref) {
                    var _ref$timeout = _ref.timeout,
                        timeout = _ref$timeout === void 0 ? HTTP_REQUEST_TIMEOUT : _ref$timeout,
                        payload = _ref.payload,
                        headers = _ref.headers,
                        beforeSend = _ref.beforeSend,
                        sendCredentials = _ref.sendCredentials;
                    return new _polyfills__WEBPACK_IMPORTED_MODULE_0__.Promise(function (resolve, reject) {
                        var xhr = new window.XMLHttpRequest();
                        xhr[_patching_patch_utils__WEBPACK_IMPORTED_MODULE_1__.XHR_IGNORE] = true;
                        xhr.open(method, url, true);
                        xhr.timeout = timeout;
                        xhr.withCredentials = sendCredentials;

                        if (headers) {
                            for (var header in headers) {
                                if (headers.hasOwnProperty(header)) {
                                    xhr.setRequestHeader(header, headers[header]);
                                }
                            }
                        }

                        xhr.onreadystatechange = function () {
                            if (xhr.readyState === 4) {
                                var status = xhr.status,
                                    responseText = xhr.responseText;

                                if ((0,_response_status__WEBPACK_IMPORTED_MODULE_2__.isResponseSuccessful)(status)) {
                                    resolve(xhr);
                                } else {
                                    reject({
                                        url: url,
                                        status: status,
                                        responseText: responseText
                                    });
                                }
                            }
                        };

                        xhr.onerror = function () {
                            var status = xhr.status,
                                responseText = xhr.responseText;
                            reject({
                                url: url,
                                status: status,
                                responseText: responseText
                            });
                        };

                        var canSend = true;

                        if (typeof beforeSend === 'function') {
                            canSend = beforeSend({
                                url: url,
                                method: method,
                                headers: headers,
                                payload: payload,
                                xhr: xhr
                            });
                        }

                        if (canSend) {
                            xhr.send(payload);
                        } else {
                            reject({
                                url: url,
                                status: 0,
                                responseText: 'Request rejected by user configuration.'
                            });
                        }
                    });
                }

                /***/ }),

            /***/ "../rum-core/dist/es/common/instrument.js":
            /*!************************************************!*\
  !*** ../rum-core/dist/es/common/instrument.js ***!
  \************************************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                    /* harmony export */   "getInstrumentationFlags": function() { return /* binding */ getInstrumentationFlags; }
                    /* harmony export */ });
                /* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "../rum-core/dist/es/common/constants.js");

                function getInstrumentationFlags(instrument, disabledInstrumentations) {
                    var _flags;

                    var flags = (_flags = {}, _flags[_constants__WEBPACK_IMPORTED_MODULE_0__.XMLHTTPREQUEST] = false, _flags[_constants__WEBPACK_IMPORTED_MODULE_0__.FETCH] = false, _flags[_constants__WEBPACK_IMPORTED_MODULE_0__.HISTORY] = false, _flags[_constants__WEBPACK_IMPORTED_MODULE_0__.PAGE_LOAD] = false, _flags[_constants__WEBPACK_IMPORTED_MODULE_0__.ERROR] = false, _flags[_constants__WEBPACK_IMPORTED_MODULE_0__.EVENT_TARGET] = false, _flags[_constants__WEBPACK_IMPORTED_MODULE_0__.CLICK] = false, _flags);

                    if (!instrument) {
                        return flags;
                    }

                    Object.keys(flags).forEach(function (key) {
                        if (disabledInstrumentations.indexOf(key) === -1) {
                            flags[key] = true;
                        }
                    });
                    return flags;
                }

                /***/ }),

            /***/ "../rum-core/dist/es/common/logging-service.js":
            /*!*****************************************************!*\
  !*** ../rum-core/dist/es/common/logging-service.js ***!
  \*****************************************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "../rum-core/dist/es/common/utils.js");


                var LoggingService = function () {
                    function LoggingService(spec) {
                        if (spec === void 0) {
                            spec = {};
                        }

                        this.levels = ['trace', 'debug', 'info', 'warn', 'error'];
                        this.level = spec.level || 'warn';
                        this.prefix = spec.prefix || '';
                        this.resetLogMethods();
                    }

                    var _proto = LoggingService.prototype;

                    _proto.shouldLog = function shouldLog(level) {
                        return this.levels.indexOf(level) >= this.levels.indexOf(this.level);
                    };

                    _proto.setLevel = function setLevel(level) {
                        if (level === this.level) {
                            return;
                        }

                        this.level = level;
                        this.resetLogMethods();
                    };

                    _proto.resetLogMethods = function resetLogMethods() {
                        var _this = this;

                        this.levels.forEach(function (level) {
                            _this[level] = _this.shouldLog(level) ? log : _utils__WEBPACK_IMPORTED_MODULE_0__.noop;

                            function log() {
                                var normalizedLevel = level;

                                if (level === 'trace' || level === 'debug') {
                                    normalizedLevel = 'info';
                                }

                                var args = arguments;
                                args[0] = this.prefix + args[0];

                                if (console) {
                                    var realMethod = console[normalizedLevel] || console.log;

                                    if (typeof realMethod === 'function') {
                                        realMethod.apply(console, args);
                                    }
                                }
                            }
                        });
                    };

                    return LoggingService;
                }();

                /* harmony default export */ __webpack_exports__["default"] = (LoggingService);

                /***/ }),

            /***/ "../rum-core/dist/es/common/ndjson.js":
            /*!********************************************!*\
  !*** ../rum-core/dist/es/common/ndjson.js ***!
  \********************************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                var NDJSON = function () {
                    function NDJSON() {}

                    NDJSON.stringify = function stringify(object) {
                        return JSON.stringify(object) + '\n';
                    };

                    return NDJSON;
                }();

                /* harmony default export */ __webpack_exports__["default"] = (NDJSON);

                /***/ }),

            /***/ "../rum-core/dist/es/common/observers/page-clicks.js":
            /*!***********************************************************!*\
  !*** ../rum-core/dist/es/common/observers/page-clicks.js ***!
  \***********************************************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                    /* harmony export */   "observePageClicks": function() { return /* binding */ observePageClicks; }
                    /* harmony export */ });
                /* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "../rum-core/dist/es/common/constants.js");

                var INTERACTIVE_SELECTOR = 'a[data-transaction-name], button[data-transaction-name]';
                function observePageClicks(transactionService) {
                    var clickHandler = function clickHandler(event) {
                        if (event.target instanceof Element) {
                            createUserInteractionTransaction(transactionService, event.target);
                        }
                    };

                    var eventName = 'click';
                    var useCapture = true;
                    window.addEventListener(eventName, clickHandler, useCapture);
                    return function () {
                        window.removeEventListener(eventName, clickHandler, useCapture);
                    };
                }

                function createUserInteractionTransaction(transactionService, target) {
                    var _getTransactionMetada = getTransactionMetadata(target),
                        transactionName = _getTransactionMetada.transactionName,
                        context = _getTransactionMetada.context;

                    var tr = transactionService.startTransaction("Click - " + transactionName, _constants__WEBPACK_IMPORTED_MODULE_0__.USER_INTERACTION, {
                        managed: true,
                        canReuse: true,
                        reuseThreshold: 300
                    });

                    if (tr && context) {
                        tr.addContext(context);
                    }
                }

                function getTransactionMetadata(target) {
                    var metadata = {
                        transactionName: null,
                        context: null
                    };
                    metadata.transactionName = buildTransactionName(target);
                    var classes = target.getAttribute('class');

                    if (classes) {
                        metadata.context = {
                            custom: {
                                classes: classes
                            }
                        };
                    }

                    return metadata;
                }

                function buildTransactionName(target) {
                    var dtName = findCustomTransactionName(target);

                    if (dtName) {
                        return dtName;
                    }

                    var tagName = target.tagName.toLowerCase();
                    var name = target.getAttribute('name');

                    if (!!name) {
                        return tagName + "[\"" + name + "\"]";
                    }

                    return tagName;
                }

                function findCustomTransactionName(target) {
                    if (target.closest) {
                        var element = target.closest(INTERACTIVE_SELECTOR);
                        return element ? element.dataset.transactionName : null;
                    }

                    return target.dataset.transactionName;
                }

                /***/ }),

            /***/ "../rum-core/dist/es/common/observers/page-visibility.js":
            /*!***************************************************************!*\
  !*** ../rum-core/dist/es/common/observers/page-visibility.js ***!
  \***************************************************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                    /* harmony export */   "observePageVisibility": function() { return /* binding */ observePageVisibility; }
                    /* harmony export */ });
                /* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants */ "../rum-core/dist/es/common/constants.js");
                /* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../state */ "../rum-core/dist/es/state.js");
                /* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils */ "../rum-core/dist/es/common/utils.js");



                function observePageVisibility(configService, transactionService) {
                    if (document.visibilityState === 'hidden') {
                        _state__WEBPACK_IMPORTED_MODULE_0__.state.lastHiddenStart = 0;
                    }

                    var visibilityChangeHandler = function visibilityChangeHandler() {
                        if (document.visibilityState === 'hidden') {
                            onPageHidden(configService, transactionService);
                        }
                    };

                    var pageHideHandler = function pageHideHandler() {
                        return onPageHidden(configService, transactionService);
                    };

                    var useCapture = true;
                    window.addEventListener('visibilitychange', visibilityChangeHandler, useCapture);
                    window.addEventListener('pagehide', pageHideHandler, useCapture);
                    return function () {
                        window.removeEventListener('visibilitychange', visibilityChangeHandler, useCapture);
                        window.removeEventListener('pagehide', pageHideHandler, useCapture);
                    };
                }

                function onPageHidden(configService, transactionService) {
                    var tr = transactionService.getCurrentTransaction();

                    if (tr) {
                        var unobserve = configService.observeEvent(_constants__WEBPACK_IMPORTED_MODULE_1__.QUEUE_ADD_TRANSACTION, function () {
                            configService.dispatchEvent(_constants__WEBPACK_IMPORTED_MODULE_1__.QUEUE_FLUSH);
                            _state__WEBPACK_IMPORTED_MODULE_0__.state.lastHiddenStart = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.now)();
                            unobserve();
                        });
                        tr.end();
                    } else {
                        configService.dispatchEvent(_constants__WEBPACK_IMPORTED_MODULE_1__.QUEUE_FLUSH);
                        _state__WEBPACK_IMPORTED_MODULE_0__.state.lastHiddenStart = (0,_utils__WEBPACK_IMPORTED_MODULE_2__.now)();
                    }
                }

                /***/ }),

            /***/ "../rum-core/dist/es/common/patching/fetch-patch.js":
            /*!**********************************************************!*\
  !*** ../rum-core/dist/es/common/patching/fetch-patch.js ***!
  \**********************************************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                    /* harmony export */   "patchFetch": function() { return /* binding */ patchFetch; }
                    /* harmony export */ });
                /* harmony import */ var _polyfills__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../polyfills */ "../rum-core/dist/es/common/polyfills.js");
                /* harmony import */ var _patch_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./patch-utils */ "../rum-core/dist/es/common/patching/patch-utils.js");
                /* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants */ "../rum-core/dist/es/common/constants.js");
                /* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils */ "../rum-core/dist/es/common/utils.js");
                /* harmony import */ var _http_fetch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../http/fetch */ "../rum-core/dist/es/common/http/fetch.js");





                function patchFetch(callback) {
                    if (!(0,_http_fetch__WEBPACK_IMPORTED_MODULE_0__.isFetchSupported)()) {
                        return;
                    }

                    function scheduleTask(task) {
                        task.state = _constants__WEBPACK_IMPORTED_MODULE_1__.SCHEDULE;
                        callback(_constants__WEBPACK_IMPORTED_MODULE_1__.SCHEDULE, task);
                    }

                    function invokeTask(task) {
                        task.state = _constants__WEBPACK_IMPORTED_MODULE_1__.INVOKE;
                        callback(_constants__WEBPACK_IMPORTED_MODULE_1__.INVOKE, task);
                    }

                    function handleResponseError(task, error) {
                        task.data.aborted = isAbortError(error);
                        task.data.error = error;
                        invokeTask(task);
                    }

                    function readStream(stream, task) {
                        var reader = stream.getReader();

                        var read = function read() {
                            reader.read().then(function (_ref) {
                                var done = _ref.done;

                                if (done) {
                                    invokeTask(task);
                                } else {
                                    read();
                                }
                            }, function (error) {
                                handleResponseError(task, error);
                            });
                        };

                        read();
                    }

                    var nativeFetch = window.fetch;

                    window.fetch = function (input, init) {
                        var fetchSelf = this;
                        var args = arguments;
                        var request, url;
                        var isURL = input instanceof URL;

                        if (typeof input === 'string' || isURL) {
                            request = new Request(input, init);

                            if (isURL) {
                                url = request.url;
                            } else {
                                url = input;
                            }
                        } else if (input) {
                            request = input;
                            url = request.url;
                        } else {
                            return nativeFetch.apply(fetchSelf, args);
                        }

                        var task = {
                            source: _constants__WEBPACK_IMPORTED_MODULE_1__.FETCH,
                            state: '',
                            type: 'macroTask',
                            data: {
                                target: request,
                                method: request.method,
                                url: url,
                                aborted: false
                            }
                        };
                        return new _polyfills__WEBPACK_IMPORTED_MODULE_2__.Promise(function (resolve, reject) {
                            _patch_utils__WEBPACK_IMPORTED_MODULE_3__.globalState.fetchInProgress = true;
                            scheduleTask(task);
                            var promise;

                            try {
                                promise = nativeFetch.apply(fetchSelf, [request]);
                            } catch (error) {
                                reject(error);
                                task.data.error = error;
                                invokeTask(task);
                                _patch_utils__WEBPACK_IMPORTED_MODULE_3__.globalState.fetchInProgress = false;
                                return;
                            }

                            promise.then(function (response) {
                                var clonedResponse = response.clone ? response.clone() : {};
                                resolve(response);
                                (0,_utils__WEBPACK_IMPORTED_MODULE_4__.scheduleMicroTask)(function () {
                                    task.data.response = response;
                                    var body = clonedResponse.body;

                                    if (body) {
                                        readStream(body, task);
                                    } else {
                                        invokeTask(task);
                                    }
                                });
                            }, function (error) {
                                reject(error);
                                (0,_utils__WEBPACK_IMPORTED_MODULE_4__.scheduleMicroTask)(function () {
                                    handleResponseError(task, error);
                                });
                            });
                            _patch_utils__WEBPACK_IMPORTED_MODULE_3__.globalState.fetchInProgress = false;
                        });
                    };
                }

                function isAbortError(error) {
                    return error && error.name === 'AbortError';
                }

                /***/ }),

            /***/ "../rum-core/dist/es/common/patching/history-patch.js":
            /*!************************************************************!*\
  !*** ../rum-core/dist/es/common/patching/history-patch.js ***!
  \************************************************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                    /* harmony export */   "patchHistory": function() { return /* binding */ patchHistory; }
                    /* harmony export */ });
                /* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "../rum-core/dist/es/common/constants.js");

                function patchHistory(callback) {
                    if (!window.history) {
                        return;
                    }

                    var nativePushState = history.pushState;

                    if (typeof nativePushState === 'function') {
                        history.pushState = function (state, title, url) {
                            var task = {
                                source: _constants__WEBPACK_IMPORTED_MODULE_0__.HISTORY,
                                data: {
                                    state: state,
                                    title: title,
                                    url: url
                                }
                            };
                            callback(_constants__WEBPACK_IMPORTED_MODULE_0__.INVOKE, task);
                            nativePushState.apply(this, arguments);
                        };
                    }
                }

                /***/ }),

            /***/ "../rum-core/dist/es/common/patching/index.js":
            /*!****************************************************!*\
  !*** ../rum-core/dist/es/common/patching/index.js ***!
  \****************************************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                    /* harmony export */   "patchAll": function() { return /* binding */ patchAll; },
                    /* harmony export */   "patchEventHandler": function() { return /* binding */ patchEventHandler; }
                    /* harmony export */ });
                /* harmony import */ var _xhr_patch__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./xhr-patch */ "../rum-core/dist/es/common/patching/xhr-patch.js");
                /* harmony import */ var _fetch_patch__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./fetch-patch */ "../rum-core/dist/es/common/patching/fetch-patch.js");
                /* harmony import */ var _history_patch__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./history-patch */ "../rum-core/dist/es/common/patching/history-patch.js");
                /* harmony import */ var _event_handler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../event-handler */ "../rum-core/dist/es/common/event-handler.js");
                /* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../constants */ "../rum-core/dist/es/common/constants.js");





                var patchEventHandler = new _event_handler__WEBPACK_IMPORTED_MODULE_0__.default();
                var alreadyPatched = false;

                function patchAll() {
                    if (!alreadyPatched) {
                        alreadyPatched = true;
                        (0,_xhr_patch__WEBPACK_IMPORTED_MODULE_1__.patchXMLHttpRequest)(function (event, task) {
                            patchEventHandler.send(_constants__WEBPACK_IMPORTED_MODULE_2__.XMLHTTPREQUEST, [event, task]);
                        });
                        (0,_fetch_patch__WEBPACK_IMPORTED_MODULE_3__.patchFetch)(function (event, task) {
                            patchEventHandler.send(_constants__WEBPACK_IMPORTED_MODULE_2__.FETCH, [event, task]);
                        });
                        (0,_history_patch__WEBPACK_IMPORTED_MODULE_4__.patchHistory)(function (event, task) {
                            patchEventHandler.send(_constants__WEBPACK_IMPORTED_MODULE_2__.HISTORY, [event, task]);
                        });
                    }

                    return patchEventHandler;
                }



                /***/ }),

            /***/ "../rum-core/dist/es/common/patching/patch-utils.js":
            /*!**********************************************************!*\
  !*** ../rum-core/dist/es/common/patching/patch-utils.js ***!
  \**********************************************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                    /* harmony export */   "globalState": function() { return /* binding */ globalState; },
                    /* harmony export */   "apmSymbol": function() { return /* binding */ apmSymbol; },
                    /* harmony export */   "patchMethod": function() { return /* binding */ patchMethod; },
                    /* harmony export */   "XHR_IGNORE": function() { return /* binding */ XHR_IGNORE; },
                    /* harmony export */   "XHR_SYNC": function() { return /* binding */ XHR_SYNC; },
                    /* harmony export */   "XHR_URL": function() { return /* binding */ XHR_URL; },
                    /* harmony export */   "XHR_METHOD": function() { return /* binding */ XHR_METHOD; }
                    /* harmony export */ });
                var globalState = {
                    fetchInProgress: false
                };
                function apmSymbol(name) {
                    return '__apm_symbol__' + name;
                }

                function isPropertyWritable(propertyDesc) {
                    if (!propertyDesc) {
                        return true;
                    }

                    if (propertyDesc.writable === false) {
                        return false;
                    }

                    return !(typeof propertyDesc.get === 'function' && typeof propertyDesc.set === 'undefined');
                }

                function attachOriginToPatched(patched, original) {
                    patched[apmSymbol('OriginalDelegate')] = original;
                }

                function patchMethod(target, name, patchFn) {
                    var proto = target;

                    while (proto && !proto.hasOwnProperty(name)) {
                        proto = Object.getPrototypeOf(proto);
                    }

                    if (!proto && target[name]) {
                        proto = target;
                    }

                    var delegateName = apmSymbol(name);
                    var delegate;

                    if (proto && !(delegate = proto[delegateName])) {
                        delegate = proto[delegateName] = proto[name];
                        var desc = proto && Object.getOwnPropertyDescriptor(proto, name);

                        if (isPropertyWritable(desc)) {
                            var patchDelegate = patchFn(delegate, delegateName, name);

                            proto[name] = function () {
                                return patchDelegate(this, arguments);
                            };

                            attachOriginToPatched(proto[name], delegate);
                        }
                    }

                    return delegate;
                }
                var XHR_IGNORE = apmSymbol('xhrIgnore');
                var XHR_SYNC = apmSymbol('xhrSync');
                var XHR_URL = apmSymbol('xhrURL');
                var XHR_METHOD = apmSymbol('xhrMethod');

                /***/ }),

            /***/ "../rum-core/dist/es/common/patching/xhr-patch.js":
            /*!********************************************************!*\
  !*** ../rum-core/dist/es/common/patching/xhr-patch.js ***!
  \********************************************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                    /* harmony export */   "patchXMLHttpRequest": function() { return /* binding */ patchXMLHttpRequest; }
                    /* harmony export */ });
                /* harmony import */ var _patch_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./patch-utils */ "../rum-core/dist/es/common/patching/patch-utils.js");
                /* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../constants */ "../rum-core/dist/es/common/constants.js");


                function patchXMLHttpRequest(callback) {
                    var XMLHttpRequestPrototype = XMLHttpRequest.prototype;

                    if (!XMLHttpRequestPrototype || !XMLHttpRequestPrototype[_constants__WEBPACK_IMPORTED_MODULE_0__.ADD_EVENT_LISTENER_STR]) {
                        return;
                    }

                    var READY_STATE_CHANGE = 'readystatechange';
                    var LOAD = 'load';
                    var ERROR = 'error';
                    var TIMEOUT = 'timeout';
                    var ABORT = 'abort';

                    function invokeTask(task, status) {
                        if (task.state !== _constants__WEBPACK_IMPORTED_MODULE_0__.INVOKE) {
                            task.state = _constants__WEBPACK_IMPORTED_MODULE_0__.INVOKE;
                            task.data.status = status;
                            callback(_constants__WEBPACK_IMPORTED_MODULE_0__.INVOKE, task);
                        }
                    }

                    function scheduleTask(task) {
                        if (task.state === _constants__WEBPACK_IMPORTED_MODULE_0__.SCHEDULE) {
                            return;
                        }

                        task.state = _constants__WEBPACK_IMPORTED_MODULE_0__.SCHEDULE;
                        callback(_constants__WEBPACK_IMPORTED_MODULE_0__.SCHEDULE, task);
                        var target = task.data.target;

                        function addListener(name) {
                            target[_constants__WEBPACK_IMPORTED_MODULE_0__.ADD_EVENT_LISTENER_STR](name, function (_ref) {
                                var type = _ref.type;

                                if (type === READY_STATE_CHANGE) {
                                    if (target.readyState === 4 && target.status !== 0) {
                                        invokeTask(task, 'success');
                                    }
                                } else {
                                    var status = type === LOAD ? 'success' : type;
                                    invokeTask(task, status);
                                }
                            });
                        }

                        addListener(READY_STATE_CHANGE);
                        addListener(LOAD);
                        addListener(TIMEOUT);
                        addListener(ERROR);
                        addListener(ABORT);
                    }

                    var openNative = (0,_patch_utils__WEBPACK_IMPORTED_MODULE_1__.patchMethod)(XMLHttpRequestPrototype, 'open', function () {
                        return function (self, args) {
                            if (!self[_patch_utils__WEBPACK_IMPORTED_MODULE_1__.XHR_IGNORE]) {
                                self[_patch_utils__WEBPACK_IMPORTED_MODULE_1__.XHR_METHOD] = args[0];
                                self[_patch_utils__WEBPACK_IMPORTED_MODULE_1__.XHR_URL] = args[1];
                                self[_patch_utils__WEBPACK_IMPORTED_MODULE_1__.XHR_SYNC] = args[2] === false;
                            }

                            return openNative.apply(self, args);
                        };
                    });
                    var sendNative = (0,_patch_utils__WEBPACK_IMPORTED_MODULE_1__.patchMethod)(XMLHttpRequestPrototype, 'send', function () {
                        return function (self, args) {
                            if (self[_patch_utils__WEBPACK_IMPORTED_MODULE_1__.XHR_IGNORE]) {
                                return sendNative.apply(self, args);
                            }

                            var task = {
                                source: _constants__WEBPACK_IMPORTED_MODULE_0__.XMLHTTPREQUEST,
                                state: '',
                                type: 'macroTask',
                                data: {
                                    target: self,
                                    method: self[_patch_utils__WEBPACK_IMPORTED_MODULE_1__.XHR_METHOD],
                                    sync: self[_patch_utils__WEBPACK_IMPORTED_MODULE_1__.XHR_SYNC],
                                    url: self[_patch_utils__WEBPACK_IMPORTED_MODULE_1__.XHR_URL],
                                    status: ''
                                }
                            };

                            try {
                                scheduleTask(task);
                                return sendNative.apply(self, args);
                            } catch (e) {
                                invokeTask(task, ERROR);
                                throw e;
                            }
                        };
                    });
                }

                /***/ }),

            /***/ "../rum-core/dist/es/common/polyfills.js":
            /*!***********************************************!*\
  !*** ../rum-core/dist/es/common/polyfills.js ***!
  \***********************************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                    /* harmony export */   "Promise": function() { return /* binding */ Promise; }
                    /* harmony export */ });
                /* harmony import */ var promise_polyfill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! promise-polyfill */ "../../node_modules/promise-polyfill/src/index.js");
                /* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "../rum-core/dist/es/common/utils.js");


                var local = {};

                if (_utils__WEBPACK_IMPORTED_MODULE_1__.isBrowser) {
                    local = window;
                } else if (typeof self !== 'undefined') {
                    local = self;
                }

                var Promise = 'Promise' in local ? local.Promise : promise_polyfill__WEBPACK_IMPORTED_MODULE_0__.default;


                /***/ }),

            /***/ "../rum-core/dist/es/common/queue.js":
            /*!*******************************************!*\
  !*** ../rum-core/dist/es/common/queue.js ***!
  \*******************************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                var Queue = function () {
                    function Queue(onFlush, opts) {
                        if (opts === void 0) {
                            opts = {};
                        }

                        this.onFlush = onFlush;
                        this.items = [];
                        this.queueLimit = opts.queueLimit || -1;
                        this.flushInterval = opts.flushInterval || 0;
                        this.timeoutId = undefined;
                    }

                    var _proto = Queue.prototype;

                    _proto._setTimer = function _setTimer() {
                        var _this = this;

                        this.timeoutId = setTimeout(function () {
                            return _this.flush();
                        }, this.flushInterval);
                    };

                    _proto._clear = function _clear() {
                        if (typeof this.timeoutId !== 'undefined') {
                            clearTimeout(this.timeoutId);
                            this.timeoutId = undefined;
                        }

                        this.items = [];
                    };

                    _proto.flush = function flush() {
                        this.onFlush(this.items);

                        this._clear();
                    };

                    _proto.add = function add(item) {
                        this.items.push(item);

                        if (this.queueLimit !== -1 && this.items.length >= this.queueLimit) {
                            this.flush();
                        } else {
                            if (typeof this.timeoutId === 'undefined') {
                                this._setTimer();
                            }
                        }
                    };

                    return Queue;
                }();

                /* harmony default export */ __webpack_exports__["default"] = (Queue);

                /***/ }),

            /***/ "../rum-core/dist/es/common/service-factory.js":
            /*!*****************************************************!*\
  !*** ../rum-core/dist/es/common/service-factory.js ***!
  \*****************************************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                    /* harmony export */   "serviceCreators": function() { return /* binding */ serviceCreators; },
                    /* harmony export */   "ServiceFactory": function() { return /* binding */ ServiceFactory; }
                    /* harmony export */ });
                /* harmony import */ var _apm_server__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./apm-server */ "../rum-core/dist/es/common/apm-server.js");
                /* harmony import */ var _config_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./config-service */ "../rum-core/dist/es/common/config-service.js");
                /* harmony import */ var _logging_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./logging-service */ "../rum-core/dist/es/common/logging-service.js");
                /* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "../rum-core/dist/es/common/constants.js");
                /* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../state */ "../rum-core/dist/es/state.js");
                var _serviceCreators;






                var serviceCreators = (_serviceCreators = {}, _serviceCreators[_constants__WEBPACK_IMPORTED_MODULE_0__.CONFIG_SERVICE] = function () {
                    return new _config_service__WEBPACK_IMPORTED_MODULE_1__.default();
                }, _serviceCreators[_constants__WEBPACK_IMPORTED_MODULE_0__.LOGGING_SERVICE] = function () {
                    return new _logging_service__WEBPACK_IMPORTED_MODULE_2__.default({
                        prefix: '[Elastic APM] '
                    });
                }, _serviceCreators[_constants__WEBPACK_IMPORTED_MODULE_0__.APM_SERVER] = function (factory) {
                    var _factory$getService = factory.getService([_constants__WEBPACK_IMPORTED_MODULE_0__.CONFIG_SERVICE, _constants__WEBPACK_IMPORTED_MODULE_0__.LOGGING_SERVICE]),
                        configService = _factory$getService[0],
                        loggingService = _factory$getService[1];

                    return new _apm_server__WEBPACK_IMPORTED_MODULE_3__.default(configService, loggingService);
                }, _serviceCreators);

                var ServiceFactory = function () {
                    function ServiceFactory() {
                        this.instances = {};
                        this.initialized = false;
                    }

                    var _proto = ServiceFactory.prototype;

                    _proto.init = function init() {
                        if (this.initialized) {
                            return;
                        }

                        this.initialized = true;
                        var configService = this.getService(_constants__WEBPACK_IMPORTED_MODULE_0__.CONFIG_SERVICE);
                        configService.init();

                        var _this$getService = this.getService([_constants__WEBPACK_IMPORTED_MODULE_0__.LOGGING_SERVICE, _constants__WEBPACK_IMPORTED_MODULE_0__.APM_SERVER]),
                            loggingService = _this$getService[0],
                            apmServer = _this$getService[1];

                        configService.events.observe(_constants__WEBPACK_IMPORTED_MODULE_0__.CONFIG_CHANGE, function () {
                            var logLevel = configService.get('logLevel');
                            loggingService.setLevel(logLevel);
                        });
                        apmServer.init();
                    };

                    _proto.getService = function getService(name) {
                        var _this = this;

                        if (typeof name === 'string') {
                            if (!this.instances[name]) {
                                if (typeof serviceCreators[name] === 'function') {
                                    this.instances[name] = serviceCreators[name](this);
                                } else if (_state__WEBPACK_IMPORTED_MODULE_4__.__DEV__) {
                                    console.log('Cannot get service, No creator for: ' + name);
                                }
                            }

                            return this.instances[name];
                        } else if (Array.isArray(name)) {
                            return name.map(function (n) {
                                return _this.getService(n);
                            });
                        }
                    };

                    return ServiceFactory;
                }();



                /***/ }),

            /***/ "../rum-core/dist/es/common/throttle.js":
            /*!**********************************************!*\
  !*** ../rum-core/dist/es/common/throttle.js ***!
  \**********************************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                    /* harmony export */   "default": function() { return /* binding */ throttle; }
                    /* harmony export */ });
                function throttle(fn, onThrottle, opts) {
                    var context = this;
                    var limit = opts.limit;
                    var interval = opts.interval;
                    var counter = 0;
                    var timeoutId;
                    return function () {
                        counter++;

                        if (typeof timeoutId === 'undefined') {
                            timeoutId = setTimeout(function () {
                                counter = 0;
                                timeoutId = undefined;
                            }, interval);
                        }

                        if (counter > limit && typeof onThrottle === 'function') {
                            return onThrottle.apply(context, arguments);
                        } else {
                            return fn.apply(context, arguments);
                        }
                    };
                }

                /***/ }),

            /***/ "../rum-core/dist/es/common/truncate.js":
            /*!**********************************************!*\
  !*** ../rum-core/dist/es/common/truncate.js ***!
  \**********************************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                    /* harmony export */   "truncate": function() { return /* binding */ truncate; },
                    /* harmony export */   "truncateModel": function() { return /* binding */ truncateModel; },
                    /* harmony export */   "SPAN_MODEL": function() { return /* binding */ SPAN_MODEL; },
                    /* harmony export */   "TRANSACTION_MODEL": function() { return /* binding */ TRANSACTION_MODEL; },
                    /* harmony export */   "ERROR_MODEL": function() { return /* binding */ ERROR_MODEL; },
                    /* harmony export */   "METADATA_MODEL": function() { return /* binding */ METADATA_MODEL; },
                    /* harmony export */   "RESPONSE_MODEL": function() { return /* binding */ RESPONSE_MODEL; }
                    /* harmony export */ });
                /* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ "../rum-core/dist/es/common/constants.js");

                var METADATA_MODEL = {
                    service: {
                        name: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true],
                        version: true,
                        agent: {
                            version: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true]
                        },
                        environment: true
                    },
                    labels: {
                        '*': true
                    }
                };
                var RESPONSE_MODEL = {
                    '*': true,
                    headers: {
                        '*': true
                    }
                };
                var DESTINATION_MODEL = {
                    address: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT],
                    service: {
                        '*': [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true]
                    }
                };
                var CONTEXT_MODEL = {
                    user: {
                        id: true,
                        email: true,
                        username: true
                    },
                    tags: {
                        '*': true
                    },
                    http: {
                        response: RESPONSE_MODEL
                    },
                    destination: DESTINATION_MODEL,
                    response: RESPONSE_MODEL
                };
                var SPAN_MODEL = {
                    name: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true],
                    type: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true],
                    id: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true],
                    trace_id: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true],
                    parent_id: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true],
                    transaction_id: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true],
                    subtype: true,
                    action: true,
                    context: CONTEXT_MODEL
                };
                var TRANSACTION_MODEL = {
                    name: true,
                    parent_id: true,
                    type: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true],
                    id: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true],
                    trace_id: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true],
                    span_count: {
                        started: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true]
                    },
                    context: CONTEXT_MODEL
                };
                var ERROR_MODEL = {
                    id: [_constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT, true],
                    trace_id: true,
                    transaction_id: true,
                    parent_id: true,
                    culprit: true,
                    exception: {
                        type: true
                    },
                    transaction: {
                        type: true
                    },
                    context: CONTEXT_MODEL
                };

                function truncate(value, limit, required, placeholder) {
                    if (limit === void 0) {
                        limit = _constants__WEBPACK_IMPORTED_MODULE_0__.KEYWORD_LIMIT;
                    }

                    if (required === void 0) {
                        required = false;
                    }

                    if (placeholder === void 0) {
                        placeholder = 'N/A';
                    }

                    if (required && isEmpty(value)) {
                        value = placeholder;
                    }

                    if (typeof value === 'string') {
                        return value.substring(0, limit);
                    }

                    return value;
                }

                function isEmpty(value) {
                    return value == null || value === '' || typeof value === 'undefined';
                }

                function replaceValue(target, key, currModel) {
                    var value = truncate(target[key], currModel[0], currModel[1]);

                    if (isEmpty(value)) {
                        delete target[key];
                        return;
                    }

                    target[key] = value;
                }

                function truncateModel(model, target, childTarget) {
                    if (model === void 0) {
                        model = {};
                    }

                    if (childTarget === void 0) {
                        childTarget = target;
                    }

                    var keys = Object.keys(model);
                    var emptyArr = [];

                    var _loop = function _loop(i) {
                        var currKey = keys[i];
                        var currModel = model[currKey] === true ? emptyArr : model[currKey];

                        if (!Array.isArray(currModel)) {
                            truncateModel(currModel, target, childTarget[currKey]);
                        } else {
                            if (currKey === '*') {
                                Object.keys(childTarget).forEach(function (key) {
                                    return replaceValue(childTarget, key, currModel);
                                });
                            } else {
                                replaceValue(childTarget, currKey, currModel);
                            }
                        }
                    };

                    for (var i = 0; i < keys.length; i++) {
                        _loop(i);
                    }

                    return target;
                }



                /***/ }),

            /***/ "../rum-core/dist/es/common/url.js":
            /*!*****************************************!*\
  !*** ../rum-core/dist/es/common/url.js ***!
  \*****************************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                    /* harmony export */   "Url": function() { return /* binding */ Url; },
                    /* harmony export */   "slugifyUrl": function() { return /* binding */ slugifyUrl; }
                    /* harmony export */ });
                /* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "../rum-core/dist/es/common/utils.js");


                function isDefaultPort(port, protocol) {
                    switch (protocol) {
                        case 'http:':
                            return port === '80';

                        case 'https:':
                            return port === '443';
                    }

                    return true;
                }

                var RULES = [['#', 'hash'], ['?', 'query'], ['/', 'path'], ['@', 'auth', 1], [NaN, 'host', undefined, 1]];
                var PROTOCOL_REGEX = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\S\s]*)/i;
                var Url = function () {
                    function Url(url) {
                        var _this$extractProtocol = this.extractProtocol(url || ''),
                            protocol = _this$extractProtocol.protocol,
                            address = _this$extractProtocol.address,
                            slashes = _this$extractProtocol.slashes;

                        var relative = !protocol && !slashes;
                        var location = this.getLocation();
                        var instructions = RULES.slice();
                        address = address.replace('\\', '/');

                        if (!slashes) {
                            instructions[2] = [NaN, 'path'];
                        }

                        var index;

                        for (var i = 0; i < instructions.length; i++) {
                            var instruction = instructions[i];
                            var parse = instruction[0];
                            var key = instruction[1];

                            if (typeof parse === 'string') {
                                index = address.indexOf(parse);

                                if (~index) {
                                    var instLength = instruction[2];

                                    if (instLength) {
                                        var newIndex = address.lastIndexOf(parse);
                                        index = Math.max(index, newIndex);
                                        this[key] = address.slice(0, index);
                                        address = address.slice(index + instLength);
                                    } else {
                                        this[key] = address.slice(index);
                                        address = address.slice(0, index);
                                    }
                                }
                            } else {
                                this[key] = address;
                                address = '';
                            }

                            this[key] = this[key] || (relative && instruction[3] ? location[key] || '' : '');
                            if (instruction[3]) this[key] = this[key].toLowerCase();
                        }

                        if (relative && this.path.charAt(0) !== '/') {
                            this.path = '/' + this.path;
                        }

                        this.relative = relative;
                        this.protocol = protocol || location.protocol;
                        this.hostname = this.host;
                        this.port = '';

                        if (/:\d+$/.test(this.host)) {
                            var value = this.host.split(':');
                            var port = value.pop();
                            var hostname = value.join(':');

                            if (isDefaultPort(port, this.protocol)) {
                                this.host = hostname;
                            } else {
                                this.port = port;
                            }

                            this.hostname = hostname;
                        }

                        this.origin = this.protocol && this.host && this.protocol !== 'file:' ? this.protocol + '//' + this.host : 'null';
                        this.href = this.toString();
                    }

                    var _proto = Url.prototype;

                    _proto.toString = function toString() {
                        var result = this.protocol;
                        result += '//';

                        if (this.auth) {
                            var REDACTED = '[REDACTED]';
                            var userpass = this.auth.split(':');
                            var username = userpass[0] ? REDACTED : '';
                            var password = userpass[1] ? ':' + REDACTED : '';
                            result += username + password + '@';
                        }

                        result += this.host;
                        result += this.path;
                        result += this.query;
                        result += this.hash;
                        return result;
                    };

                    _proto.getLocation = function getLocation() {
                        var globalVar = {};

                        if (_utils__WEBPACK_IMPORTED_MODULE_0__.isBrowser) {
                            globalVar = window;
                        }

                        return globalVar.location;
                    };

                    _proto.extractProtocol = function extractProtocol(url) {
                        var match = PROTOCOL_REGEX.exec(url);
                        return {
                            protocol: match[1] ? match[1].toLowerCase() : '',
                            slashes: !!match[2],
                            address: match[3]
                        };
                    };

                    return Url;
                }();
                function slugifyUrl(urlStr, depth) {
                    if (depth === void 0) {
                        depth = 2;
                    }

                    var parsedUrl = new Url(urlStr);
                    var query = parsedUrl.query,
                        path = parsedUrl.path;
                    var pathParts = path.substring(1).split('/');
                    var redactString = ':id';
                    var wildcard = '*';
                    var specialCharsRegex = /\W|_/g;
                    var digitsRegex = /[0-9]/g;
                    var lowerCaseRegex = /[a-z]/g;
                    var upperCaseRegex = /[A-Z]/g;
                    var redactedParts = [];
                    var redactedBefore = false;

                    for (var index = 0; index < pathParts.length; index++) {
                        var part = pathParts[index];

                        if (redactedBefore || index > depth - 1) {
                            if (part) {
                                redactedParts.push(wildcard);
                            }

                            break;
                        }

                        var numberOfSpecialChars = (part.match(specialCharsRegex) || []).length;

                        if (numberOfSpecialChars >= 2) {
                            redactedParts.push(redactString);
                            redactedBefore = true;
                            continue;
                        }

                        var numberOfDigits = (part.match(digitsRegex) || []).length;

                        if (numberOfDigits > 3 || part.length > 3 && numberOfDigits / part.length >= 0.3) {
                            redactedParts.push(redactString);
                            redactedBefore = true;
                            continue;
                        }

                        var numberofUpperCase = (part.match(upperCaseRegex) || []).length;
                        var numberofLowerCase = (part.match(lowerCaseRegex) || []).length;
                        var lowerCaseRate = numberofLowerCase / part.length;
                        var upperCaseRate = numberofUpperCase / part.length;

                        if (part.length > 5 && (upperCaseRate > 0.3 && upperCaseRate < 0.6 || lowerCaseRate > 0.3 && lowerCaseRate < 0.6)) {
                            redactedParts.push(redactString);
                            redactedBefore = true;
                            continue;
                        }

                        part && redactedParts.push(part);
                    }

                    var redacted = '/' + (redactedParts.length >= 2 ? redactedParts.join('/') : redactedParts.join('')) + (query ? '?{query}' : '');
                    return redacted;
                }

                /***/ }),

            /***/ "../rum-core/dist/es/common/utils.js":
            /*!*******************************************!*\
  !*** ../rum-core/dist/es/common/utils.js ***!
  \*******************************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                    /* harmony export */   "extend": function() { return /* binding */ extend; },
                    /* harmony export */   "merge": function() { return /* binding */ merge; },
                    /* harmony export */   "isUndefined": function() { return /* binding */ isUndefined; },
                    /* harmony export */   "noop": function() { return /* binding */ noop; },
                    /* harmony export */   "baseExtend": function() { return /* binding */ baseExtend; },
                    /* harmony export */   "bytesToHex": function() { return /* binding */ bytesToHex; },
                    /* harmony export */   "isCORSSupported": function() { return /* binding */ isCORSSupported; },
                    /* harmony export */   "isObject": function() { return /* binding */ isObject; },
                    /* harmony export */   "isFunction": function() { return /* binding */ isFunction; },
                    /* harmony export */   "isPlatformSupported": function() { return /* binding */ isPlatformSupported; },
                    /* harmony export */   "isDtHeaderValid": function() { return /* binding */ isDtHeaderValid; },
                    /* harmony export */   "parseDtHeaderValue": function() { return /* binding */ parseDtHeaderValue; },
                    /* harmony export */   "getServerTimingInfo": function() { return /* binding */ getServerTimingInfo; },
                    /* harmony export */   "getDtHeaderValue": function() { return /* binding */ getDtHeaderValue; },
                    /* harmony export */   "getTSHeaderValue": function() { return /* binding */ getTSHeaderValue; },
                    /* harmony export */   "getCurrentScript": function() { return /* binding */ getCurrentScript; },
                    /* harmony export */   "getElasticScript": function() { return /* binding */ getElasticScript; },
                    /* harmony export */   "getTimeOrigin": function() { return /* binding */ getTimeOrigin; },
                    /* harmony export */   "generateRandomId": function() { return /* binding */ generateRandomId; },
                    /* harmony export */   "getEarliestSpan": function() { return /* binding */ getEarliestSpan; },
                    /* harmony export */   "getLatestNonXHRSpan": function() { return /* binding */ getLatestNonXHRSpan; },
                    /* harmony export */   "getLatestXHRSpan": function() { return /* binding */ getLatestXHRSpan; },
                    /* harmony export */   "getDuration": function() { return /* binding */ getDuration; },
                    /* harmony export */   "getTime": function() { return /* binding */ getTime; },
                    /* harmony export */   "now": function() { return /* binding */ now; },
                    /* harmony export */   "rng": function() { return /* binding */ rng; },
                    /* harmony export */   "checkSameOrigin": function() { return /* binding */ checkSameOrigin; },
                    /* harmony export */   "scheduleMacroTask": function() { return /* binding */ scheduleMacroTask; },
                    /* harmony export */   "scheduleMicroTask": function() { return /* binding */ scheduleMicroTask; },
                    /* harmony export */   "setLabel": function() { return /* binding */ setLabel; },
                    /* harmony export */   "setRequestHeader": function() { return /* binding */ setRequestHeader; },
                    /* harmony export */   "stripQueryStringFromUrl": function() { return /* binding */ stripQueryStringFromUrl; },
                    /* harmony export */   "find": function() { return /* binding */ find; },
                    /* harmony export */   "removeInvalidChars": function() { return /* binding */ removeInvalidChars; },
                    /* harmony export */   "PERF": function() { return /* binding */ PERF; },
                    /* harmony export */   "isPerfTimelineSupported": function() { return /* binding */ isPerfTimelineSupported; },
                    /* harmony export */   "isBrowser": function() { return /* binding */ isBrowser; },
                    /* harmony export */   "isPerfTypeSupported": function() { return /* binding */ isPerfTypeSupported; },
                    /* harmony export */   "isBeaconInspectionEnabled": function() { return /* binding */ isBeaconInspectionEnabled; },
                    /* harmony export */   "isRedirectInfoAvailable": function() { return /* binding */ isRedirectInfoAvailable; }
                    /* harmony export */ });
                /* harmony import */ var _polyfills__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./polyfills */ "../rum-core/dist/es/common/polyfills.js");

                var slice = [].slice;
                var isBrowser = typeof window !== 'undefined';
                var PERF = isBrowser && typeof performance !== 'undefined' ? performance : {};

                function isCORSSupported() {
                    var xhr = new window.XMLHttpRequest();
                    return 'withCredentials' in xhr;
                }

                var byteToHex = [];

                for (var i = 0; i < 256; ++i) {
                    byteToHex[i] = (i + 0x100).toString(16).substr(1);
                }

                function bytesToHex(buffer) {
                    var hexOctets = [];

                    for (var _i = 0; _i < buffer.length; _i++) {
                        hexOctets.push(byteToHex[buffer[_i]]);
                    }

                    return hexOctets.join('');
                }

                var destination = new Uint8Array(16);

                function rng() {
                    if (typeof crypto != 'undefined' && typeof crypto.getRandomValues == 'function') {
                        return crypto.getRandomValues(destination);
                    } else if (typeof msCrypto != 'undefined' && typeof msCrypto.getRandomValues == 'function') {
                        return msCrypto.getRandomValues(destination);
                    }

                    return destination;
                }

                function generateRandomId(length) {
                    var id = bytesToHex(rng());
                    return id.substr(0, length);
                }

                function getDtHeaderValue(span) {
                    var dtVersion = '00';
                    var dtUnSampledFlags = '00';
                    var dtSampledFlags = '01';

                    if (span && span.traceId && span.id && span.parentId) {
                        var flags = span.sampled ? dtSampledFlags : dtUnSampledFlags;
                        var id = span.sampled ? span.id : span.parentId;
                        return dtVersion + '-' + span.traceId + '-' + id + '-' + flags;
                    }
                }

                function parseDtHeaderValue(value) {
                    var parsed = /^([\da-f]{2})-([\da-f]{32})-([\da-f]{16})-([\da-f]{2})$/.exec(value);

                    if (parsed) {
                        var flags = parsed[4];
                        var sampled = flags !== '00';
                        return {
                            traceId: parsed[2],
                            id: parsed[3],
                            sampled: sampled
                        };
                    }
                }

                function isDtHeaderValid(header) {
                    return /^[\da-f]{2}-[\da-f]{32}-[\da-f]{16}-[\da-f]{2}$/.test(header) && header.slice(3, 35) !== '00000000000000000000000000000000' && header.slice(36, 52) !== '0000000000000000';
                }

                function getTSHeaderValue(_ref) {
                    var sampleRate = _ref.sampleRate;

                    if (typeof sampleRate !== 'number' || String(sampleRate).length > 256) {
                        return;
                    }

                    var NAMESPACE = 'es';
                    var SEPARATOR = '=';
                    return "" + NAMESPACE + SEPARATOR + "s:" + sampleRate;
                }

                function setRequestHeader(target, name, value) {
                    if (typeof target.setRequestHeader === 'function') {
                        target.setRequestHeader(name, value);
                    } else if (target.headers && typeof target.headers.append === 'function') {
                        target.headers.append(name, value);
                    } else {
                        target[name] = value;
                    }
                }

                function checkSameOrigin(source, target) {
                    var isSame = false;

                    if (typeof target === 'string') {
                        isSame = source === target;
                    } else if (target && typeof target.test === 'function') {
                        isSame = target.test(source);
                    } else if (Array.isArray(target)) {
                        target.forEach(function (t) {
                            if (!isSame) {
                                isSame = checkSameOrigin(source, t);
                            }
                        });
                    }

                    return isSame;
                }

                function isPlatformSupported() {
                    return isBrowser && typeof Set === 'function' && typeof JSON.stringify === 'function' && PERF && typeof PERF.now === 'function' && isCORSSupported();
                }

                function setLabel(key, value, obj) {
                    if (!obj || !key) return;
                    var skey = removeInvalidChars(key);
                    var valueType = typeof value;

                    if (value != undefined && valueType !== 'boolean' && valueType !== 'number') {
                        value = String(value);
                    }

                    obj[skey] = value;
                    return obj;
                }

                function getServerTimingInfo(serverTimingEntries) {
                    if (serverTimingEntries === void 0) {
                        serverTimingEntries = [];
                    }

                    var serverTimingInfo = [];
                    var entrySeparator = ', ';
                    var valueSeparator = ';';

                    for (var _i2 = 0; _i2 < serverTimingEntries.length; _i2++) {
                        var _serverTimingEntries$ = serverTimingEntries[_i2],
                            name = _serverTimingEntries$.name,
                            duration = _serverTimingEntries$.duration,
                            description = _serverTimingEntries$.description;
                        var timingValue = name;

                        if (description) {
                            timingValue += valueSeparator + 'desc=' + description;
                        }

                        if (duration) {
                            timingValue += valueSeparator + 'dur=' + duration;
                        }

                        serverTimingInfo.push(timingValue);
                    }

                    return serverTimingInfo.join(entrySeparator);
                }

                function getTimeOrigin() {
                    return PERF.timing.fetchStart;
                }

                function stripQueryStringFromUrl(url) {
                    return url && url.split('?')[0];
                }

                function isObject(value) {
                    return value !== null && typeof value === 'object';
                }

                function isFunction(value) {
                    return typeof value === 'function';
                }

                function baseExtend(dst, objs, deep) {
                    for (var i = 0, ii = objs.length; i < ii; ++i) {
                        var obj = objs[i];
                        if (!isObject(obj) && !isFunction(obj)) continue;
                        var keys = Object.keys(obj);

                        for (var j = 0, jj = keys.length; j < jj; j++) {
                            var key = keys[j];
                            var src = obj[key];

                            if (deep && isObject(src)) {
                                if (!isObject(dst[key])) dst[key] = Array.isArray(src) ? [] : {};
                                baseExtend(dst[key], [src], false);
                            } else {
                                dst[key] = src;
                            }
                        }
                    }

                    return dst;
                }

                function getElasticScript() {
                    if (typeof document !== 'undefined') {
                        var scripts = document.getElementsByTagName('script');

                        for (var i = 0, l = scripts.length; i < l; i++) {
                            var sc = scripts[i];

                            if (sc.src.indexOf('elastic') > 0) {
                                return sc;
                            }
                        }
                    }
                }

                function getCurrentScript() {
                    if (typeof document !== 'undefined') {
                        var currentScript = document.currentScript;

                        if (!currentScript) {
                            return getElasticScript();
                        }

                        return currentScript;
                    }
                }

                function extend(dst) {
                    return baseExtend(dst, slice.call(arguments, 1), false);
                }

                function merge(dst) {
                    return baseExtend(dst, slice.call(arguments, 1), true);
                }

                function isUndefined(obj) {
                    return typeof obj === 'undefined';
                }

                function noop() {}

                function find(array, predicate, thisArg) {
                    if (array == null) {
                        throw new TypeError('array is null or not defined');
                    }

                    var o = Object(array);
                    var len = o.length >>> 0;

                    if (typeof predicate !== 'function') {
                        throw new TypeError('predicate must be a function');
                    }

                    var k = 0;

                    while (k < len) {
                        var kValue = o[k];

                        if (predicate.call(thisArg, kValue, k, o)) {
                            return kValue;
                        }

                        k++;
                    }

                    return undefined;
                }

                function removeInvalidChars(key) {
                    return key.replace(/[.*"]/g, '_');
                }

                function getLatestSpan(spans, typeFilter) {
                    var latestSpan = null;

                    for (var _i3 = 0; _i3 < spans.length; _i3++) {
                        var span = spans[_i3];

                        if (typeFilter && typeFilter(span.type) && (!latestSpan || latestSpan._end < span._end)) {
                            latestSpan = span;
                        }
                    }

                    return latestSpan;
                }

                function getLatestNonXHRSpan(spans) {
                    return getLatestSpan(spans, function (type) {
                        return String(type).indexOf('external') === -1;
                    });
                }

                function getLatestXHRSpan(spans) {
                    return getLatestSpan(spans, function (type) {
                        return String(type).indexOf('external') !== -1;
                    });
                }

                function getEarliestSpan(spans) {
                    var earliestSpan = spans[0];

                    for (var _i4 = 1; _i4 < spans.length; _i4++) {
                        var span = spans[_i4];

                        if (earliestSpan._start > span._start) {
                            earliestSpan = span;
                        }
                    }

                    return earliestSpan;
                }

                function now() {
                    return PERF.now();
                }

                function getTime(time) {
                    return typeof time === 'number' && time >= 0 ? time : now();
                }

                function getDuration(start, end) {
                    if (isUndefined(end) || isUndefined(start)) {
                        return null;
                    }

                    return parseInt(end - start);
                }

                function scheduleMacroTask(callback) {
                    setTimeout(callback, 0);
                }

                function scheduleMicroTask(callback) {
                    _polyfills__WEBPACK_IMPORTED_MODULE_0__.Promise.resolve().then(callback);
                }

                function isPerfTimelineSupported() {
                    return typeof PERF.getEntriesByType === 'function';
                }

                function isPerfTypeSupported(type) {
                    return typeof PerformanceObserver !== 'undefined' && PerformanceObserver.supportedEntryTypes && PerformanceObserver.supportedEntryTypes.indexOf(type) >= 0;
                }

                function isBeaconInspectionEnabled() {
                    var flagName = '_elastic_inspect_beacon_';

                    if (sessionStorage.getItem(flagName) != null) {
                        return true;
                    }

                    if (!window.URL || !window.URLSearchParams) {
                        return false;
                    }

                    try {
                        var parsedUrl = new URL(window.location.href);
                        var isFlagSet = parsedUrl.searchParams.has(flagName);

                        if (isFlagSet) {
                            sessionStorage.setItem(flagName, true);
                        }

                        return isFlagSet;
                    } catch (e) {}

                    return false;
                }

                function isRedirectInfoAvailable(timing) {
                    return timing.redirectStart > 0;
                }



                /***/ }),

            /***/ "../rum-core/dist/es/error-logging/error-logging.js":
            /*!**********************************************************!*\
  !*** ../rum-core/dist/es/error-logging/error-logging.js ***!
  \**********************************************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */ var _stack_trace__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./stack-trace */ "../rum-core/dist/es/error-logging/stack-trace.js");
                /* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/utils */ "../rum-core/dist/es/common/utils.js");
                /* harmony import */ var _common_context__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/context */ "../rum-core/dist/es/common/context.js");
                /* harmony import */ var _common_truncate__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/truncate */ "../rum-core/dist/es/common/truncate.js");
                /* harmony import */ var error_stack_parser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! error-stack-parser */ "../../node_modules/error-stack-parser/error-stack-parser.js");
                /* harmony import */ var error_stack_parser__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(error_stack_parser__WEBPACK_IMPORTED_MODULE_0__);
                var _excluded = ["tags"];

                function _objectWithoutPropertiesLoose(source, excluded) {
                    if (source == null) return {};
                    var target = {};
                    var sourceKeys = Object.keys(source);
                    var key, i;

                    for (i = 0; i < sourceKeys.length; i++) {
                        key = sourceKeys[i];
                        if (excluded.indexOf(key) >= 0) continue;
                        target[key] = source[key];
                    }

                    return target;
                }






                var IGNORE_KEYS = ['stack', 'message'];

                function getErrorProperties(error) {
                    var propertyFound = false;
                    var properties = {};
                    Object.keys(error).forEach(function (key) {
                        if (IGNORE_KEYS.indexOf(key) >= 0) {
                            return;
                        }

                        var val = error[key];

                        if (val == null || typeof val === 'function') {
                            return;
                        }

                        if (typeof val === 'object') {
                            if (typeof val.toISOString !== 'function') return;
                            val = val.toISOString();
                        }

                        properties[key] = val;
                        propertyFound = true;
                    });

                    if (propertyFound) {
                        return properties;
                    }
                }

                var ErrorLogging = function () {
                    function ErrorLogging(apmServer, configService, transactionService) {
                        this._apmServer = apmServer;
                        this._configService = configService;
                        this._transactionService = transactionService;
                    }

                    var _proto = ErrorLogging.prototype;

                    _proto.createErrorDataModel = function createErrorDataModel(errorEvent) {
                        var frames = (0,_stack_trace__WEBPACK_IMPORTED_MODULE_1__.createStackTraces)((error_stack_parser__WEBPACK_IMPORTED_MODULE_0___default()), errorEvent);
                        var filteredFrames = (0,_stack_trace__WEBPACK_IMPORTED_MODULE_1__.filterInvalidFrames)(frames);
                        var culprit = '(inline script)';
                        var lastFrame = filteredFrames[filteredFrames.length - 1];

                        if (lastFrame && lastFrame.filename) {
                            culprit = lastFrame.filename;
                        }

                        var message = errorEvent.message,
                            error = errorEvent.error;
                        var errorMessage = message;
                        var errorType = '';
                        var errorContext = {};

                        if (error && typeof error === 'object') {
                            errorMessage = errorMessage || error.message;
                            errorType = error.name;
                            var customProperties = getErrorProperties(error);

                            if (customProperties) {
                                errorContext.custom = customProperties;
                            }
                        }

                        if (!errorType) {
                            if (errorMessage && errorMessage.indexOf(':') > -1) {
                                errorType = errorMessage.split(':')[0];
                            }
                        }

                        var currentTransaction = this._transactionService.getCurrentTransaction();

                        var transactionContext = currentTransaction ? currentTransaction.context : {};

                        var _this$_configService$ = this._configService.get('context'),
                            tags = _this$_configService$.tags,
                            configContext = _objectWithoutPropertiesLoose(_this$_configService$, _excluded);

                        var pageContext = (0,_common_context__WEBPACK_IMPORTED_MODULE_2__.getPageContext)();
                        var context = (0,_common_utils__WEBPACK_IMPORTED_MODULE_3__.merge)({}, pageContext, transactionContext, configContext, errorContext);
                        var errorObject = {
                            id: (0,_common_utils__WEBPACK_IMPORTED_MODULE_3__.generateRandomId)(),
                            culprit: culprit,
                            exception: {
                                message: errorMessage,
                                stacktrace: filteredFrames,
                                type: errorType
                            },
                            context: context
                        };

                        if (currentTransaction) {
                            errorObject = (0,_common_utils__WEBPACK_IMPORTED_MODULE_3__.extend)(errorObject, {
                                trace_id: currentTransaction.traceId,
                                parent_id: currentTransaction.id,
                                transaction_id: currentTransaction.id,
                                transaction: {
                                    type: currentTransaction.type,
                                    sampled: currentTransaction.sampled
                                }
                            });
                        }

                        return (0,_common_truncate__WEBPACK_IMPORTED_MODULE_4__.truncateModel)(_common_truncate__WEBPACK_IMPORTED_MODULE_4__.ERROR_MODEL, errorObject);
                    };

                    _proto.logErrorEvent = function logErrorEvent(errorEvent) {
                        if (typeof errorEvent === 'undefined') {
                            return;
                        }

                        var errorObject = this.createErrorDataModel(errorEvent);

                        if (typeof errorObject.exception.message === 'undefined') {
                            return;
                        }

                        this._apmServer.addError(errorObject);
                    };

                    _proto.registerListeners = function registerListeners() {
                        var _this = this;

                        window.addEventListener('error', function (errorEvent) {
                            return _this.logErrorEvent(errorEvent);
                        });
                        window.addEventListener('unhandledrejection', function (promiseRejectionEvent) {
                            return _this.logPromiseEvent(promiseRejectionEvent);
                        });
                    };

                    _proto.logPromiseEvent = function logPromiseEvent(promiseRejectionEvent) {
                        var prefix = 'Unhandled promise rejection: ';
                        var reason = promiseRejectionEvent.reason;

                        if (reason == null) {
                            reason = '<no reason specified>';
                        }

                        var errorEvent;

                        if (typeof reason.message === 'string') {
                            var name = reason.name ? reason.name + ': ' : '';
                            errorEvent = {
                                error: reason,
                                message: prefix + name + reason.message
                            };
                        } else {
                            reason = typeof reason === 'object' ? '<object>' : typeof reason === 'function' ? '<function>' : reason;
                            errorEvent = {
                                message: prefix + reason
                            };
                        }

                        this.logErrorEvent(errorEvent);
                    };

                    _proto.logError = function logError(messageOrError) {
                        var errorEvent = {};

                        if (typeof messageOrError === 'string') {
                            errorEvent.message = messageOrError;
                        } else {
                            errorEvent.error = messageOrError;
                        }

                        return this.logErrorEvent(errorEvent);
                    };

                    return ErrorLogging;
                }();

                /* harmony default export */ __webpack_exports__["default"] = (ErrorLogging);

                /***/ }),

            /***/ "../rum-core/dist/es/error-logging/index.js":
            /*!**************************************************!*\
  !*** ../rum-core/dist/es/error-logging/index.js ***!
  \**************************************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                    /* harmony export */   "registerServices": function() { return /* binding */ registerServices; }
                    /* harmony export */ });
                /* harmony import */ var _error_logging__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./error-logging */ "../rum-core/dist/es/error-logging/error-logging.js");
                /* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/constants */ "../rum-core/dist/es/common/constants.js");
                /* harmony import */ var _common_service_factory__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/service-factory */ "../rum-core/dist/es/common/service-factory.js");




                function registerServices() {
                    _common_service_factory__WEBPACK_IMPORTED_MODULE_0__.serviceCreators[_common_constants__WEBPACK_IMPORTED_MODULE_1__.ERROR_LOGGING] = function (serviceFactory) {
                        var _serviceFactory$getSe = serviceFactory.getService([_common_constants__WEBPACK_IMPORTED_MODULE_1__.APM_SERVER, _common_constants__WEBPACK_IMPORTED_MODULE_1__.CONFIG_SERVICE, _common_constants__WEBPACK_IMPORTED_MODULE_1__.TRANSACTION_SERVICE]),
                            apmServer = _serviceFactory$getSe[0],
                            configService = _serviceFactory$getSe[1],
                            transactionService = _serviceFactory$getSe[2];

                        return new _error_logging__WEBPACK_IMPORTED_MODULE_2__.default(apmServer, configService, transactionService);
                    };
                }



                /***/ }),

            /***/ "../rum-core/dist/es/error-logging/stack-trace.js":
            /*!********************************************************!*\
  !*** ../rum-core/dist/es/error-logging/stack-trace.js ***!
  \********************************************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                    /* harmony export */   "createStackTraces": function() { return /* binding */ createStackTraces; },
                    /* harmony export */   "filterInvalidFrames": function() { return /* binding */ filterInvalidFrames; }
                    /* harmony export */ });
                function filePathToFileName(fileUrl) {
                    var origin = window.location.origin || window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');

                    if (fileUrl.indexOf(origin) > -1) {
                        fileUrl = fileUrl.replace(origin + '/', '');
                    }

                    return fileUrl;
                }

                function cleanFilePath(filePath) {
                    if (filePath === void 0) {
                        filePath = '';
                    }

                    if (filePath === '<anonymous>') {
                        filePath = '';
                    }

                    return filePath;
                }

                function isFileInline(fileUrl) {
                    if (fileUrl) {
                        return window.location.href.indexOf(fileUrl) === 0;
                    }

                    return false;
                }

                function normalizeStackFrames(stackFrames) {
                    return stackFrames.map(function (frame) {
                        if (frame.functionName) {
                            frame.functionName = normalizeFunctionName(frame.functionName);
                        }

                        return frame;
                    });
                }

                function normalizeFunctionName(fnName) {
                    var parts = fnName.split('/');

                    if (parts.length > 1) {
                        fnName = ['Object', parts[parts.length - 1]].join('.');
                    } else {
                        fnName = parts[0];
                    }

                    fnName = fnName.replace(/.<$/gi, '.<anonymous>');
                    fnName = fnName.replace(/^Anonymous function$/, '<anonymous>');
                    parts = fnName.split('.');

                    if (parts.length > 1) {
                        fnName = parts[parts.length - 1];
                    } else {
                        fnName = parts[0];
                    }

                    return fnName;
                }

                function isValidStackTrace(stackTraces) {
                    if (stackTraces.length === 0) {
                        return false;
                    }

                    if (stackTraces.length === 1) {
                        var stackTrace = stackTraces[0];
                        return 'lineNumber' in stackTrace;
                    }

                    return true;
                }

                function createStackTraces(stackParser, errorEvent) {
                    var error = errorEvent.error,
                        filename = errorEvent.filename,
                        lineno = errorEvent.lineno,
                        colno = errorEvent.colno;
                    var stackTraces = [];

                    if (error) {
                        try {
                            stackTraces = stackParser.parse(error);
                        } catch (e) {}
                    }

                    if (!isValidStackTrace(stackTraces)) {
                        stackTraces = [{
                            fileName: filename,
                            lineNumber: lineno,
                            columnNumber: colno
                        }];
                    }

                    var normalizedStackTraces = normalizeStackFrames(stackTraces);
                    return normalizedStackTraces.map(function (stack) {
                        var fileName = stack.fileName,
                            lineNumber = stack.lineNumber,
                            columnNumber = stack.columnNumber,
                            _stack$functionName = stack.functionName,
                            functionName = _stack$functionName === void 0 ? '<anonymous>' : _stack$functionName;

                        if (!fileName && !lineNumber) {
                            return {};
                        }

                        if (!columnNumber && !lineNumber) {
                            return {};
                        }

                        var filePath = cleanFilePath(fileName);
                        var cleanedFileName = filePathToFileName(filePath);

                        if (isFileInline(filePath)) {
                            cleanedFileName = '(inline script)';
                        }

                        return {
                            abs_path: fileName,
                            filename: cleanedFileName,
                            function: functionName,
                            lineno: lineNumber,
                            colno: columnNumber
                        };
                    });
                }
                function filterInvalidFrames(frames) {
                    return frames.filter(function (_ref) {
                        var filename = _ref.filename,
                            lineno = _ref.lineno;
                        return typeof filename !== 'undefined' && typeof lineno !== 'undefined';
                    });
                }

                /***/ }),

            /***/ "../rum-core/dist/es/index.js":
            /*!************************************!*\
  !*** ../rum-core/dist/es/index.js ***!
  \************************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                    /* harmony export */   "createServiceFactory": function() { return /* binding */ createServiceFactory; },
                    /* harmony export */   "ServiceFactory": function() { return /* reexport safe */ _common_service_factory__WEBPACK_IMPORTED_MODULE_2__.ServiceFactory; },
                    /* harmony export */   "patchAll": function() { return /* reexport safe */ _common_patching__WEBPACK_IMPORTED_MODULE_3__.patchAll; },
                    /* harmony export */   "patchEventHandler": function() { return /* reexport safe */ _common_patching__WEBPACK_IMPORTED_MODULE_3__.patchEventHandler; },
                    /* harmony export */   "isPlatformSupported": function() { return /* reexport safe */ _common_utils__WEBPACK_IMPORTED_MODULE_4__.isPlatformSupported; },
                    /* harmony export */   "isBrowser": function() { return /* reexport safe */ _common_utils__WEBPACK_IMPORTED_MODULE_4__.isBrowser; },
                    /* harmony export */   "getInstrumentationFlags": function() { return /* reexport safe */ _common_instrument__WEBPACK_IMPORTED_MODULE_5__.getInstrumentationFlags; },
                    /* harmony export */   "createTracer": function() { return /* reexport safe */ _opentracing__WEBPACK_IMPORTED_MODULE_6__.createTracer; },
                    /* harmony export */   "scheduleMicroTask": function() { return /* reexport safe */ _common_utils__WEBPACK_IMPORTED_MODULE_4__.scheduleMicroTask; },
                    /* harmony export */   "scheduleMacroTask": function() { return /* reexport safe */ _common_utils__WEBPACK_IMPORTED_MODULE_4__.scheduleMacroTask; },
                    /* harmony export */   "afterFrame": function() { return /* reexport safe */ _common_after_frame__WEBPACK_IMPORTED_MODULE_7__.default; },
                    /* harmony export */   "ERROR": function() { return /* reexport safe */ _common_constants__WEBPACK_IMPORTED_MODULE_8__.ERROR; },
                    /* harmony export */   "PAGE_LOAD_DELAY": function() { return /* reexport safe */ _common_constants__WEBPACK_IMPORTED_MODULE_8__.PAGE_LOAD_DELAY; },
                    /* harmony export */   "PAGE_LOAD": function() { return /* reexport safe */ _common_constants__WEBPACK_IMPORTED_MODULE_8__.PAGE_LOAD; },
                    /* harmony export */   "CONFIG_SERVICE": function() { return /* reexport safe */ _common_constants__WEBPACK_IMPORTED_MODULE_8__.CONFIG_SERVICE; },
                    /* harmony export */   "LOGGING_SERVICE": function() { return /* reexport safe */ _common_constants__WEBPACK_IMPORTED_MODULE_8__.LOGGING_SERVICE; },
                    /* harmony export */   "TRANSACTION_SERVICE": function() { return /* reexport safe */ _common_constants__WEBPACK_IMPORTED_MODULE_8__.TRANSACTION_SERVICE; },
                    /* harmony export */   "APM_SERVER": function() { return /* reexport safe */ _common_constants__WEBPACK_IMPORTED_MODULE_8__.APM_SERVER; },
                    /* harmony export */   "PERFORMANCE_MONITORING": function() { return /* reexport safe */ _common_constants__WEBPACK_IMPORTED_MODULE_8__.PERFORMANCE_MONITORING; },
                    /* harmony export */   "ERROR_LOGGING": function() { return /* reexport safe */ _common_constants__WEBPACK_IMPORTED_MODULE_8__.ERROR_LOGGING; },
                    /* harmony export */   "EVENT_TARGET": function() { return /* reexport safe */ _common_constants__WEBPACK_IMPORTED_MODULE_8__.EVENT_TARGET; },
                    /* harmony export */   "CLICK": function() { return /* reexport safe */ _common_constants__WEBPACK_IMPORTED_MODULE_8__.CLICK; },
                    /* harmony export */   "bootstrap": function() { return /* reexport safe */ _bootstrap__WEBPACK_IMPORTED_MODULE_9__.bootstrap; },
                    /* harmony export */   "observePageVisibility": function() { return /* reexport safe */ _common_observers__WEBPACK_IMPORTED_MODULE_10__.observePageVisibility; },
                    /* harmony export */   "observePageClicks": function() { return /* reexport safe */ _common_observers__WEBPACK_IMPORTED_MODULE_11__.observePageClicks; }
                    /* harmony export */ });
                /* harmony import */ var _error_logging__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./error-logging */ "../rum-core/dist/es/error-logging/index.js");
                /* harmony import */ var _performance_monitoring__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./performance-monitoring */ "../rum-core/dist/es/performance-monitoring/index.js");
                /* harmony import */ var _common_service_factory__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./common/service-factory */ "../rum-core/dist/es/common/service-factory.js");
                /* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./common/utils */ "../rum-core/dist/es/common/utils.js");
                /* harmony import */ var _common_patching__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./common/patching */ "../rum-core/dist/es/common/patching/index.js");
                /* harmony import */ var _common_observers__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./common/observers */ "../rum-core/dist/es/common/observers/page-visibility.js");
                /* harmony import */ var _common_observers__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./common/observers */ "../rum-core/dist/es/common/observers/page-clicks.js");
                /* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./common/constants */ "../rum-core/dist/es/common/constants.js");
                /* harmony import */ var _common_instrument__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./common/instrument */ "../rum-core/dist/es/common/instrument.js");
                /* harmony import */ var _common_after_frame__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./common/after-frame */ "../rum-core/dist/es/common/after-frame.js");
                /* harmony import */ var _bootstrap__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./bootstrap */ "../rum-core/dist/es/bootstrap.js");
                /* harmony import */ var _opentracing__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./opentracing */ "../rum-core/dist/es/opentracing/index.js");












                function createServiceFactory() {
                    (0,_performance_monitoring__WEBPACK_IMPORTED_MODULE_0__.registerServices)();
                    (0,_error_logging__WEBPACK_IMPORTED_MODULE_1__.registerServices)();
                    var serviceFactory = new _common_service_factory__WEBPACK_IMPORTED_MODULE_2__.ServiceFactory();
                    return serviceFactory;
                }



                /***/ }),

            /***/ "../rum-core/dist/es/opentracing/index.js":
            /*!************************************************!*\
  !*** ../rum-core/dist/es/opentracing/index.js ***!
  \************************************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                    /* harmony export */   "Span": function() { return /* reexport safe */ _span__WEBPACK_IMPORTED_MODULE_2__.default; },
                    /* harmony export */   "Tracer": function() { return /* reexport safe */ _tracer__WEBPACK_IMPORTED_MODULE_1__.default; },
                    /* harmony export */   "createTracer": function() { return /* binding */ createTracer; }
                    /* harmony export */ });
                /* harmony import */ var _tracer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tracer */ "../rum-core/dist/es/opentracing/tracer.js");
                /* harmony import */ var _span__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./span */ "../rum-core/dist/es/opentracing/span.js");
                /* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/constants */ "../rum-core/dist/es/common/constants.js");




                function createTracer(serviceFactory) {
                    var performanceMonitoring = serviceFactory.getService(_common_constants__WEBPACK_IMPORTED_MODULE_0__.PERFORMANCE_MONITORING);
                    var transactionService = serviceFactory.getService(_common_constants__WEBPACK_IMPORTED_MODULE_0__.TRANSACTION_SERVICE);
                    var errorLogging = serviceFactory.getService(_common_constants__WEBPACK_IMPORTED_MODULE_0__.ERROR_LOGGING);
                    var loggingService = serviceFactory.getService(_common_constants__WEBPACK_IMPORTED_MODULE_0__.LOGGING_SERVICE);
                    return new _tracer__WEBPACK_IMPORTED_MODULE_1__.default(performanceMonitoring, transactionService, loggingService, errorLogging);
                }



                /***/ }),

            /***/ "../rum-core/dist/es/opentracing/span.js":
            /*!***********************************************!*\
  !*** ../rum-core/dist/es/opentracing/span.js ***!
  \***********************************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */ var opentracing_lib_span__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! opentracing/lib/span */ "../../node_modules/opentracing/lib/span.js");
                /* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/utils */ "../rum-core/dist/es/common/utils.js");
                /* harmony import */ var _performance_monitoring_transaction__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../performance-monitoring/transaction */ "../rum-core/dist/es/performance-monitoring/transaction.js");
                function _inheritsLoose(subClass, superClass) {
                    subClass.prototype = Object.create(superClass.prototype);
                    subClass.prototype.constructor = subClass;

                    _setPrototypeOf(subClass, superClass);
                }

                function _setPrototypeOf(o, p) {
                    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
                        o.__proto__ = p;
                        return o;
                    };

                    return _setPrototypeOf(o, p);
                }





                var Span = function (_otSpan) {
                    _inheritsLoose(Span, _otSpan);

                    function Span(tracer, span) {
                        var _this;

                        _this = _otSpan.call(this) || this;
                        _this.__tracer = tracer;
                        _this.span = span;
                        _this.isTransaction = span instanceof _performance_monitoring_transaction__WEBPACK_IMPORTED_MODULE_1__.default;
                        _this.spanContext = {
                            id: span.id,
                            traceId: span.traceId,
                            sampled: span.sampled
                        };
                        return _this;
                    }

                    var _proto = Span.prototype;

                    _proto._context = function _context() {
                        return this.spanContext;
                    };

                    _proto._tracer = function _tracer() {
                        return this.__tracer;
                    };

                    _proto._setOperationName = function _setOperationName(name) {
                        this.span.name = name;
                    };

                    _proto._addTags = function _addTags(keyValuePairs) {
                        var tags = (0,_common_utils__WEBPACK_IMPORTED_MODULE_2__.extend)({}, keyValuePairs);

                        if (tags.type) {
                            this.span.type = tags.type;
                            delete tags.type;
                        }

                        if (this.isTransaction) {
                            var userId = tags['user.id'];
                            var username = tags['user.username'];
                            var email = tags['user.email'];

                            if (userId || username || email) {
                                this.span.addContext({
                                    user: {
                                        id: userId,
                                        username: username,
                                        email: email
                                    }
                                });
                                delete tags['user.id'];
                                delete tags['user.username'];
                                delete tags['user.email'];
                            }
                        }

                        this.span.addLabels(tags);
                    };

                    _proto._log = function _log(log, timestamp) {
                        if (log.event === 'error') {
                            if (log['error.object']) {
                                this.__tracer.errorLogging.logError(log['error.object']);
                            } else if (log.message) {
                                this.__tracer.errorLogging.logError(log.message);
                            }
                        }
                    };

                    _proto._finish = function _finish(finishTime) {
                        this.span.end();

                        if (finishTime) {
                            this.span._end = finishTime - (0,_common_utils__WEBPACK_IMPORTED_MODULE_2__.getTimeOrigin)();
                        }
                    };

                    return Span;
                }(opentracing_lib_span__WEBPACK_IMPORTED_MODULE_0__.Span);

                /* harmony default export */ __webpack_exports__["default"] = (Span);

                /***/ }),

            /***/ "../rum-core/dist/es/opentracing/tracer.js":
            /*!*************************************************!*\
  !*** ../rum-core/dist/es/opentracing/tracer.js ***!
  \*************************************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */ var opentracing_lib_tracer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! opentracing/lib/tracer */ "../../node_modules/opentracing/lib/tracer.js");
                /* harmony import */ var opentracing_lib_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! opentracing/lib/constants */ "../../node_modules/opentracing/lib/constants.js");
                /* harmony import */ var opentracing_lib_span__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! opentracing/lib/span */ "../../node_modules/opentracing/lib/span.js");
                /* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/utils */ "../rum-core/dist/es/common/utils.js");
                /* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../state */ "../rum-core/dist/es/state.js");
                /* harmony import */ var _span__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./span */ "../rum-core/dist/es/opentracing/span.js");
                function _inheritsLoose(subClass, superClass) {
                    subClass.prototype = Object.create(superClass.prototype);
                    subClass.prototype.constructor = subClass;

                    _setPrototypeOf(subClass, superClass);
                }

                function _setPrototypeOf(o, p) {
                    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
                        o.__proto__ = p;
                        return o;
                    };

                    return _setPrototypeOf(o, p);
                }








                var Tracer = function (_otTracer) {
                    _inheritsLoose(Tracer, _otTracer);

                    function Tracer(performanceMonitoring, transactionService, loggingService, errorLogging) {
                        var _this;

                        _this = _otTracer.call(this) || this;
                        _this.performanceMonitoring = performanceMonitoring;
                        _this.transactionService = transactionService;
                        _this.loggingService = loggingService;
                        _this.errorLogging = errorLogging;
                        return _this;
                    }

                    var _proto = Tracer.prototype;

                    _proto._startSpan = function _startSpan(name, options) {
                        var spanOptions = {
                            managed: true
                        };

                        if (options) {
                            spanOptions.timestamp = options.startTime;

                            if (options.childOf) {
                                spanOptions.parentId = options.childOf.id;
                            } else if (options.references && options.references.length > 0) {
                                if (options.references.length > 1) {
                                    if (_state__WEBPACK_IMPORTED_MODULE_3__.__DEV__) {
                                        this.loggingService.debug('Elastic APM OpenTracing: Unsupported number of references, only the first childOf reference will be recorded.');
                                    }
                                }

                                var childRef = (0,_common_utils__WEBPACK_IMPORTED_MODULE_4__.find)(options.references, function (ref) {
                                    return ref.type() === opentracing_lib_constants__WEBPACK_IMPORTED_MODULE_1__.REFERENCE_CHILD_OF;
                                });

                                if (childRef) {
                                    spanOptions.parentId = childRef.referencedContext().id;
                                }
                            }
                        }

                        var span;
                        var currentTransaction = this.transactionService.getCurrentTransaction();

                        if (currentTransaction) {
                            span = this.transactionService.startSpan(name, undefined, spanOptions);
                        } else {
                            span = this.transactionService.startTransaction(name, undefined, spanOptions);
                        }

                        if (!span) {
                            return new opentracing_lib_span__WEBPACK_IMPORTED_MODULE_2__.Span();
                        }

                        if (spanOptions.timestamp) {
                            span._start = spanOptions.timestamp - (0,_common_utils__WEBPACK_IMPORTED_MODULE_4__.getTimeOrigin)();
                        }

                        var otSpan = new _span__WEBPACK_IMPORTED_MODULE_5__.default(this, span);

                        if (options && options.tags) {
                            otSpan.addTags(options.tags);
                        }

                        return otSpan;
                    };

                    _proto._inject = function _inject(spanContext, format, carrier) {
                        switch (format) {
                            case opentracing_lib_constants__WEBPACK_IMPORTED_MODULE_1__.FORMAT_TEXT_MAP:
                            case opentracing_lib_constants__WEBPACK_IMPORTED_MODULE_1__.FORMAT_HTTP_HEADERS:
                                this.performanceMonitoring.injectDtHeader(spanContext, carrier);
                                break;

                            case opentracing_lib_constants__WEBPACK_IMPORTED_MODULE_1__.FORMAT_BINARY:
                                if (_state__WEBPACK_IMPORTED_MODULE_3__.__DEV__) {
                                    this.loggingService.debug('Elastic APM OpenTracing: binary carrier format is not supported.');
                                }

                                break;
                        }
                    };

                    _proto._extract = function _extract(format, carrier) {
                        var ctx;

                        switch (format) {
                            case opentracing_lib_constants__WEBPACK_IMPORTED_MODULE_1__.FORMAT_TEXT_MAP:
                            case opentracing_lib_constants__WEBPACK_IMPORTED_MODULE_1__.FORMAT_HTTP_HEADERS:
                                ctx = this.performanceMonitoring.extractDtHeader(carrier);
                                break;

                            case opentracing_lib_constants__WEBPACK_IMPORTED_MODULE_1__.FORMAT_BINARY:
                                if (_state__WEBPACK_IMPORTED_MODULE_3__.__DEV__) {
                                    this.loggingService.debug('Elastic APM OpenTracing: binary carrier format is not supported.');
                                }

                                break;
                        }

                        if (!ctx) {
                            ctx = null;
                        }

                        return ctx;
                    };

                    return Tracer;
                }(opentracing_lib_tracer__WEBPACK_IMPORTED_MODULE_0__.Tracer);

                /* harmony default export */ __webpack_exports__["default"] = (Tracer);

                /***/ }),

            /***/ "../rum-core/dist/es/performance-monitoring/breakdown.js":
            /*!***************************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/breakdown.js ***!
  \***************************************************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                    /* harmony export */   "captureBreakdown": function() { return /* binding */ captureBreakdown; }
                    /* harmony export */ });
                /* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/utils */ "../rum-core/dist/es/common/utils.js");
                /* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/constants */ "../rum-core/dist/es/common/constants.js");


                var pageLoadBreakdowns = [['domainLookupStart', 'domainLookupEnd', 'DNS'], ['connectStart', 'connectEnd', 'TCP'], ['requestStart', 'responseStart', 'Request'], ['responseStart', 'responseEnd', 'Response'], ['domLoading', 'domComplete', 'Processing'], ['loadEventStart', 'loadEventEnd', 'Load']];

                function getValue(value) {
                    return {
                        value: value
                    };
                }

                function calculateSelfTime(transaction) {
                    var spans = transaction.spans,
                        _start = transaction._start,
                        _end = transaction._end;

                    if (spans.length === 0) {
                        return transaction.duration();
                    }

                    spans.sort(function (span1, span2) {
                        return span1._start - span2._start;
                    });
                    var span = spans[0];
                    var spanEnd = span._end;
                    var spanStart = span._start;
                    var lastContinuousEnd = spanEnd;
                    var selfTime = spanStart - _start;

                    for (var i = 1; i < spans.length; i++) {
                        span = spans[i];
                        spanStart = span._start;
                        spanEnd = span._end;

                        if (spanStart > lastContinuousEnd) {
                            selfTime += spanStart - lastContinuousEnd;
                            lastContinuousEnd = spanEnd;
                        } else if (spanEnd > lastContinuousEnd) {
                            lastContinuousEnd = spanEnd;
                        }
                    }

                    if (lastContinuousEnd < _end) {
                        selfTime += _end - lastContinuousEnd;
                    }

                    return selfTime;
                }

                function groupSpans(transaction) {
                    var spanMap = {};
                    var transactionSelfTime = calculateSelfTime(transaction);
                    spanMap['app'] = {
                        count: 1,
                        duration: transactionSelfTime
                    };
                    var spans = transaction.spans;

                    for (var i = 0; i < spans.length; i++) {
                        var span = spans[i];
                        var duration = span.duration();

                        if (duration === 0 || duration == null) {
                            continue;
                        }

                        var type = span.type,
                            subtype = span.subtype;
                        var key = type.replace(_common_constants__WEBPACK_IMPORTED_MODULE_0__.TRUNCATED_TYPE, '');

                        if (subtype) {
                            key += '.' + subtype;
                        }

                        if (!spanMap[key]) {
                            spanMap[key] = {
                                duration: 0,
                                count: 0
                            };
                        }

                        spanMap[key].count++;
                        spanMap[key].duration += duration;
                    }

                    return spanMap;
                }

                function getSpanBreakdown(transactionDetails, _ref) {
                    var details = _ref.details,
                        _ref$count = _ref.count,
                        count = _ref$count === void 0 ? 1 : _ref$count,
                        duration = _ref.duration;
                    return {
                        transaction: transactionDetails,
                        span: details,
                        samples: {
                            'span.self_time.count': getValue(count),
                            'span.self_time.sum.us': getValue(duration * 1000)
                        }
                    };
                }

                function captureBreakdown(transaction, timings) {
                    if (timings === void 0) {
                        timings = _common_utils__WEBPACK_IMPORTED_MODULE_1__.PERF.timing;
                    }

                    var breakdowns = [];
                    var name = transaction.name,
                        type = transaction.type,
                        sampled = transaction.sampled;
                    var transactionDetails = {
                        name: name,
                        type: type
                    };

                    if (!sampled) {
                        return breakdowns;
                    }

                    if (type === _common_constants__WEBPACK_IMPORTED_MODULE_0__.PAGE_LOAD && timings) {
                        for (var i = 0; i < pageLoadBreakdowns.length; i++) {
                            var current = pageLoadBreakdowns[i];
                            var start = timings[current[0]];
                            var end = timings[current[1]];
                            var duration = (0,_common_utils__WEBPACK_IMPORTED_MODULE_1__.getDuration)(start, end);

                            if (duration === 0 || duration == null) {
                                continue;
                            }

                            breakdowns.push(getSpanBreakdown(transactionDetails, {
                                details: {
                                    type: current[2]
                                },
                                duration: duration
                            }));
                        }
                    } else {
                        var spanMap = groupSpans(transaction);
                        Object.keys(spanMap).forEach(function (key) {
                            var _key$split = key.split('.'),
                                type = _key$split[0],
                                subtype = _key$split[1];

                            var _spanMap$key = spanMap[key],
                                duration = _spanMap$key.duration,
                                count = _spanMap$key.count;
                            breakdowns.push(getSpanBreakdown(transactionDetails, {
                                details: {
                                    type: type,
                                    subtype: subtype
                                },
                                duration: duration,
                                count: count
                            }));
                        });
                    }

                    return breakdowns;
                }

                /***/ }),

            /***/ "../rum-core/dist/es/performance-monitoring/index.js":
            /*!***********************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/index.js ***!
  \***********************************************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                    /* harmony export */   "registerServices": function() { return /* binding */ registerServices; }
                    /* harmony export */ });
                /* harmony import */ var _performance_monitoring__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./performance-monitoring */ "../rum-core/dist/es/performance-monitoring/performance-monitoring.js");
                /* harmony import */ var _transaction_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./transaction-service */ "../rum-core/dist/es/performance-monitoring/transaction-service.js");
                /* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/constants */ "../rum-core/dist/es/common/constants.js");
                /* harmony import */ var _common_service_factory__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/service-factory */ "../rum-core/dist/es/common/service-factory.js");





                function registerServices() {
                    _common_service_factory__WEBPACK_IMPORTED_MODULE_0__.serviceCreators[_common_constants__WEBPACK_IMPORTED_MODULE_1__.TRANSACTION_SERVICE] = function (serviceFactory) {
                        var _serviceFactory$getSe = serviceFactory.getService([_common_constants__WEBPACK_IMPORTED_MODULE_1__.LOGGING_SERVICE, _common_constants__WEBPACK_IMPORTED_MODULE_1__.CONFIG_SERVICE]),
                            loggingService = _serviceFactory$getSe[0],
                            configService = _serviceFactory$getSe[1];

                        return new _transaction_service__WEBPACK_IMPORTED_MODULE_2__.default(loggingService, configService);
                    };

                    _common_service_factory__WEBPACK_IMPORTED_MODULE_0__.serviceCreators[_common_constants__WEBPACK_IMPORTED_MODULE_1__.PERFORMANCE_MONITORING] = function (serviceFactory) {
                        var _serviceFactory$getSe2 = serviceFactory.getService([_common_constants__WEBPACK_IMPORTED_MODULE_1__.APM_SERVER, _common_constants__WEBPACK_IMPORTED_MODULE_1__.CONFIG_SERVICE, _common_constants__WEBPACK_IMPORTED_MODULE_1__.LOGGING_SERVICE, _common_constants__WEBPACK_IMPORTED_MODULE_1__.TRANSACTION_SERVICE]),
                            apmServer = _serviceFactory$getSe2[0],
                            configService = _serviceFactory$getSe2[1],
                            loggingService = _serviceFactory$getSe2[2],
                            transactionService = _serviceFactory$getSe2[3];

                        return new _performance_monitoring__WEBPACK_IMPORTED_MODULE_3__.default(apmServer, configService, loggingService, transactionService);
                    };
                }



                /***/ }),

            /***/ "../rum-core/dist/es/performance-monitoring/metrics.js":
            /*!*************************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/metrics.js ***!
  \*************************************************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                    /* harmony export */   "metrics": function() { return /* binding */ metrics; },
                    /* harmony export */   "createLongTaskSpans": function() { return /* binding */ createLongTaskSpans; },
                    /* harmony export */   "createFirstInputDelaySpan": function() { return /* binding */ createFirstInputDelaySpan; },
                    /* harmony export */   "createTotalBlockingTimeSpan": function() { return /* binding */ createTotalBlockingTimeSpan; },
                    /* harmony export */   "calculateTotalBlockingTime": function() { return /* binding */ calculateTotalBlockingTime; },
                    /* harmony export */   "calculateCumulativeLayoutShift": function() { return /* binding */ calculateCumulativeLayoutShift; },
                    /* harmony export */   "captureObserverEntries": function() { return /* binding */ captureObserverEntries; },
                    /* harmony export */   "PerfEntryRecorder": function() { return /* binding */ PerfEntryRecorder; }
                    /* harmony export */ });
                /* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/constants */ "../rum-core/dist/es/common/constants.js");
                /* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/utils */ "../rum-core/dist/es/common/utils.js");
                /* harmony import */ var _span__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./span */ "../rum-core/dist/es/performance-monitoring/span.js");



                var metrics = {
                    fid: 0,
                    fcp: 0,
                    tbt: {
                        start: Infinity,
                        duration: 0
                    },
                    cls: {
                        score: 0,
                        firstEntryTime: Number.NEGATIVE_INFINITY,
                        prevEntryTime: Number.NEGATIVE_INFINITY,
                        currentSessionScore: 0
                    },
                    longtask: {
                        count: 0,
                        duration: 0,
                        max: 0
                    }
                };
                var LONG_TASK_THRESHOLD = 50;
                function createLongTaskSpans(longtasks, agg) {
                    var spans = [];

                    for (var i = 0; i < longtasks.length; i++) {
                        var _longtasks$i = longtasks[i],
                            name = _longtasks$i.name,
                            startTime = _longtasks$i.startTime,
                            duration = _longtasks$i.duration,
                            attribution = _longtasks$i.attribution;
                        var end = startTime + duration;
                        var span = new _span__WEBPACK_IMPORTED_MODULE_0__.default("Longtask(" + name + ")", _common_constants__WEBPACK_IMPORTED_MODULE_1__.LONG_TASK, {
                            startTime: startTime
                        });
                        agg.count++;
                        agg.duration += duration;
                        agg.max = Math.max(duration, agg.max);

                        if (attribution.length > 0) {
                            var _attribution$ = attribution[0],
                                _name = _attribution$.name,
                                containerType = _attribution$.containerType,
                                containerName = _attribution$.containerName,
                                containerId = _attribution$.containerId;
                            var customContext = {
                                attribution: _name,
                                type: containerType
                            };

                            if (containerName) {
                                customContext.name = containerName;
                            }

                            if (containerId) {
                                customContext.id = containerId;
                            }

                            span.addContext({
                                custom: customContext
                            });
                        }

                        span.end(end);
                        spans.push(span);
                    }

                    return spans;
                }
                function createFirstInputDelaySpan(fidEntries) {
                    var firstInput = fidEntries[0];

                    if (firstInput) {
                        var startTime = firstInput.startTime,
                            processingStart = firstInput.processingStart;
                        var span = new _span__WEBPACK_IMPORTED_MODULE_0__.default('First Input Delay', _common_constants__WEBPACK_IMPORTED_MODULE_1__.FIRST_INPUT, {
                            startTime: startTime
                        });
                        span.end(processingStart);
                        return span;
                    }
                }
                function createTotalBlockingTimeSpan(tbtObject) {
                    var start = tbtObject.start,
                        duration = tbtObject.duration;
                    var tbtSpan = new _span__WEBPACK_IMPORTED_MODULE_0__.default('Total Blocking Time', _common_constants__WEBPACK_IMPORTED_MODULE_1__.LONG_TASK, {
                        startTime: start
                    });
                    tbtSpan.end(start + duration);
                    return tbtSpan;
                }
                function calculateTotalBlockingTime(longtaskEntries) {
                    longtaskEntries.forEach(function (entry) {
                        var name = entry.name,
                            startTime = entry.startTime,
                            duration = entry.duration;

                        if (startTime < metrics.fcp) {
                            return;
                        }

                        if (name !== 'self' && name.indexOf('same-origin') === -1) {
                            return;
                        }

                        metrics.tbt.start = Math.min(metrics.tbt.start, startTime);
                        var blockingTime = duration - LONG_TASK_THRESHOLD;

                        if (blockingTime > 0) {
                            metrics.tbt.duration += blockingTime;
                        }
                    });
                }
                function calculateCumulativeLayoutShift(clsEntries) {
                    clsEntries.forEach(function (entry) {
                        if (!entry.hadRecentInput && entry.value) {
                            var shouldCreateNewSession = entry.startTime - metrics.cls.firstEntryTime > 5000 || entry.startTime - metrics.cls.prevEntryTime > 1000;

                            if (shouldCreateNewSession) {
                                metrics.cls.firstEntryTime = entry.startTime;
                                metrics.cls.currentSessionScore = 0;
                            }

                            metrics.cls.prevEntryTime = entry.startTime;
                            metrics.cls.currentSessionScore += entry.value;
                            metrics.cls.score = Math.max(metrics.cls.score, metrics.cls.currentSessionScore);
                        }
                    });
                }
                function captureObserverEntries(list, _ref) {
                    var isHardNavigation = _ref.isHardNavigation,
                        trStart = _ref.trStart;
                    var longtaskEntries = list.getEntriesByType(_common_constants__WEBPACK_IMPORTED_MODULE_1__.LONG_TASK).filter(function (entry) {
                        return entry.startTime >= trStart;
                    });
                    var longTaskSpans = createLongTaskSpans(longtaskEntries, metrics.longtask);
                    var result = {
                        spans: longTaskSpans,
                        marks: {}
                    };

                    if (!isHardNavigation) {
                        return result;
                    }

                    var lcpEntries = list.getEntriesByType(_common_constants__WEBPACK_IMPORTED_MODULE_1__.LARGEST_CONTENTFUL_PAINT);
                    var lastLcpEntry = lcpEntries[lcpEntries.length - 1];

                    if (lastLcpEntry) {
                        var lcp = parseInt(lastLcpEntry.startTime);
                        metrics.lcp = lcp;
                        result.marks.largestContentfulPaint = lcp;
                    }

                    var timing = _common_utils__WEBPACK_IMPORTED_MODULE_2__.PERF.timing;
                    var unloadDiff = timing.fetchStart - timing.navigationStart;

                    if ((0,_common_utils__WEBPACK_IMPORTED_MODULE_2__.isRedirectInfoAvailable)(timing)) {
                        unloadDiff = 0;
                    }

                    var fcpEntry = list.getEntriesByName(_common_constants__WEBPACK_IMPORTED_MODULE_1__.FIRST_CONTENTFUL_PAINT)[0];

                    if (fcpEntry) {
                        var fcp = parseInt(unloadDiff >= 0 ? fcpEntry.startTime - unloadDiff : fcpEntry.startTime);
                        metrics.fcp = fcp;
                        result.marks.firstContentfulPaint = fcp;
                    }

                    var fidEntries = list.getEntriesByType(_common_constants__WEBPACK_IMPORTED_MODULE_1__.FIRST_INPUT);
                    var fidSpan = createFirstInputDelaySpan(fidEntries);

                    if (fidSpan) {
                        metrics.fid = fidSpan.duration();
                        result.spans.push(fidSpan);
                    }

                    calculateTotalBlockingTime(longtaskEntries);
                    var clsEntries = list.getEntriesByType(_common_constants__WEBPACK_IMPORTED_MODULE_1__.LAYOUT_SHIFT);
                    calculateCumulativeLayoutShift(clsEntries);
                    return result;
                }
                var PerfEntryRecorder = function () {
                    function PerfEntryRecorder(callback) {
                        this.po = {
                            observe: _common_utils__WEBPACK_IMPORTED_MODULE_2__.noop,
                            disconnect: _common_utils__WEBPACK_IMPORTED_MODULE_2__.noop
                        };

                        if (window.PerformanceObserver) {
                            this.po = new PerformanceObserver(callback);
                        }
                    }

                    var _proto = PerfEntryRecorder.prototype;

                    _proto.start = function start(type) {
                        try {
                            if (!(0,_common_utils__WEBPACK_IMPORTED_MODULE_2__.isPerfTypeSupported)(type)) {
                                return;
                            }

                            this.po.observe({
                                type: type,
                                buffered: true
                            });
                        } catch (_) {}
                    };

                    _proto.stop = function stop() {
                        this.po.disconnect();
                    };

                    return PerfEntryRecorder;
                }();

                /***/ }),

            /***/ "../rum-core/dist/es/performance-monitoring/navigation/capture-navigation.js":
            /*!***********************************************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/navigation/capture-navigation.js ***!
  \***********************************************************************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                    /* harmony export */   "captureNavigation": function() { return /* binding */ captureNavigation; },
                    /* harmony export */   "createNavigationTimingSpans": function() { return /* reexport safe */ _navigation_timing__WEBPACK_IMPORTED_MODULE_2__.createNavigationTimingSpans; },
                    /* harmony export */   "createResourceTimingSpans": function() { return /* reexport safe */ _resource_timing__WEBPACK_IMPORTED_MODULE_4__.createResourceTimingSpans; },
                    /* harmony export */   "createUserTimingSpans": function() { return /* reexport safe */ _user_timing__WEBPACK_IMPORTED_MODULE_6__.createUserTimingSpans; },
                    /* harmony export */   "getPageLoadMarks": function() { return /* reexport safe */ _marks__WEBPACK_IMPORTED_MODULE_3__.getPageLoadMarks; }
                    /* harmony export */ });
                /* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../common/utils */ "../rum-core/dist/es/common/utils.js");
                /* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/constants */ "../rum-core/dist/es/common/constants.js");
                /* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../state */ "../rum-core/dist/es/state.js");
                /* harmony import */ var _navigation_timing__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./navigation-timing */ "../rum-core/dist/es/performance-monitoring/navigation/navigation-timing.js");
                /* harmony import */ var _user_timing__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./user-timing */ "../rum-core/dist/es/performance-monitoring/navigation/user-timing.js");
                /* harmony import */ var _resource_timing__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./resource-timing */ "../rum-core/dist/es/performance-monitoring/navigation/resource-timing.js");
                /* harmony import */ var _marks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./marks */ "../rum-core/dist/es/performance-monitoring/navigation/marks.js");








                function captureNavigation(transaction) {
                    if (!transaction.captureTimings) {
                        return;
                    }

                    var trEnd = transaction._end;

                    if (transaction.type === _common_constants__WEBPACK_IMPORTED_MODULE_0__.PAGE_LOAD) {
                        if (transaction.marks && transaction.marks.custom) {
                            var customMarks = transaction.marks.custom;
                            Object.keys(customMarks).forEach(function (key) {
                                customMarks[key] += transaction._start;
                            });
                        }

                        var trStart = 0;
                        transaction._start = trStart;
                        var timings = _common_utils__WEBPACK_IMPORTED_MODULE_1__.PERF.timing;
                        var baseTime = (0,_common_utils__WEBPACK_IMPORTED_MODULE_1__.isRedirectInfoAvailable)(timings) ? timings.redirectStart : timings.fetchStart;
                        (0,_navigation_timing__WEBPACK_IMPORTED_MODULE_2__.createNavigationTimingSpans)(timings, baseTime, trStart, trEnd).forEach(function (span) {
                            span.traceId = transaction.traceId;
                            span.sampled = transaction.sampled;

                            if (span.pageResponse && transaction.options.pageLoadSpanId) {
                                span.id = transaction.options.pageLoadSpanId;
                            }

                            transaction.spans.push(span);
                        });
                        transaction.addMarks((0,_marks__WEBPACK_IMPORTED_MODULE_3__.getPageLoadMarks)(timings));
                    }

                    if ((0,_common_utils__WEBPACK_IMPORTED_MODULE_1__.isPerfTimelineSupported)()) {
                        var _trStart = transaction._start;
                        var resourceEntries = _common_utils__WEBPACK_IMPORTED_MODULE_1__.PERF.getEntriesByType(_common_constants__WEBPACK_IMPORTED_MODULE_0__.RESOURCE);
                        (0,_resource_timing__WEBPACK_IMPORTED_MODULE_4__.createResourceTimingSpans)(resourceEntries, _state__WEBPACK_IMPORTED_MODULE_5__.state.bootstrapTime, _trStart, trEnd).forEach(function (span) {
                            return transaction.spans.push(span);
                        });
                        var userEntries = _common_utils__WEBPACK_IMPORTED_MODULE_1__.PERF.getEntriesByType(_common_constants__WEBPACK_IMPORTED_MODULE_0__.MEASURE);
                        (0,_user_timing__WEBPACK_IMPORTED_MODULE_6__.createUserTimingSpans)(userEntries, _trStart, trEnd).forEach(function (span) {
                            return transaction.spans.push(span);
                        });
                    }
                }



                /***/ }),

            /***/ "../rum-core/dist/es/performance-monitoring/navigation/marks.js":
            /*!**********************************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/navigation/marks.js ***!
  \**********************************************************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                    /* harmony export */   "getPageLoadMarks": function() { return /* binding */ getPageLoadMarks; },
                    /* harmony export */   "NAVIGATION_TIMING_MARKS": function() { return /* binding */ NAVIGATION_TIMING_MARKS; },
                    /* harmony export */   "COMPRESSED_NAV_TIMING_MARKS": function() { return /* binding */ COMPRESSED_NAV_TIMING_MARKS; }
                    /* harmony export */ });
                /* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/utils */ "../rum-core/dist/es/common/utils.js");

                var NAVIGATION_TIMING_MARKS = ['fetchStart', 'domainLookupStart', 'domainLookupEnd', 'connectStart', 'connectEnd', 'requestStart', 'responseStart', 'responseEnd', 'domLoading', 'domInteractive', 'domContentLoadedEventStart', 'domContentLoadedEventEnd', 'domComplete', 'loadEventStart', 'loadEventEnd'];
                var COMPRESSED_NAV_TIMING_MARKS = ['fs', 'ls', 'le', 'cs', 'ce', 'qs', 'rs', 're', 'dl', 'di', 'ds', 'de', 'dc', 'es', 'ee'];

                function getPageLoadMarks(timing) {
                    var marks = getNavigationTimingMarks(timing);

                    if (marks == null) {
                        return null;
                    }

                    return {
                        navigationTiming: marks,
                        agent: {
                            timeToFirstByte: marks.responseStart,
                            domInteractive: marks.domInteractive,
                            domComplete: marks.domComplete
                        }
                    };
                }

                function getNavigationTimingMarks(timing) {
                    var redirectStart = timing.redirectStart,
                        fetchStart = timing.fetchStart,
                        navigationStart = timing.navigationStart,
                        responseStart = timing.responseStart,
                        responseEnd = timing.responseEnd;

                    if (fetchStart >= navigationStart && responseStart >= fetchStart && responseEnd >= responseStart) {
                        var marks = {};
                        NAVIGATION_TIMING_MARKS.forEach(function (timingKey) {
                            var m = timing[timingKey];

                            if (m && m >= fetchStart) {
                                if ((0,_common_utils__WEBPACK_IMPORTED_MODULE_0__.isRedirectInfoAvailable)(timing)) {
                                    marks[timingKey] = parseInt(m - redirectStart);
                                } else {
                                    marks[timingKey] = parseInt(m - fetchStart);
                                }
                            }
                        });
                        return marks;
                    }

                    return null;
                }



                /***/ }),

            /***/ "../rum-core/dist/es/performance-monitoring/navigation/navigation-timing.js":
            /*!**********************************************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/navigation/navigation-timing.js ***!
  \**********************************************************************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                    /* harmony export */   "createNavigationTimingSpans": function() { return /* binding */ createNavigationTimingSpans; }
                    /* harmony export */ });
                /* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "../rum-core/dist/es/performance-monitoring/navigation/utils.js");
                /* harmony import */ var _span__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../span */ "../rum-core/dist/es/performance-monitoring/span.js");


                var eventPairs = [['redirectStart', 'redirectEnd', 'Redirect'], ['domainLookupStart', 'domainLookupEnd', 'Domain lookup'], ['connectStart', 'connectEnd', 'Making a connection to the server'], ['requestStart', 'responseEnd', 'Requesting and receiving the document'], ['domLoading', 'domInteractive', 'Parsing the document, executing sync. scripts'], ['domContentLoadedEventStart', 'domContentLoadedEventEnd', 'Fire "DOMContentLoaded" event'], ['loadEventStart', 'loadEventEnd', 'Fire "load" event']];

                function createNavigationTimingSpans(timings, baseTime, trStart, trEnd) {
                    var spans = [];

                    for (var i = 0; i < eventPairs.length; i++) {
                        var start = timings[eventPairs[i][0]];
                        var end = timings[eventPairs[i][1]];

                        if (!(0,_utils__WEBPACK_IMPORTED_MODULE_0__.shouldCreateSpan)(start, end, trStart, trEnd, baseTime)) {
                            continue;
                        }

                        var span = new _span__WEBPACK_IMPORTED_MODULE_1__.default(eventPairs[i][2], 'hard-navigation.browser-timing');
                        var data = null;

                        if (eventPairs[i][0] === 'requestStart') {
                            span.pageResponse = true;
                            data = {
                                url: location.origin
                            };
                        }

                        span._start = start - baseTime;
                        span.end(end - baseTime, data);
                        spans.push(span);
                    }

                    return spans;
                }



                /***/ }),

            /***/ "../rum-core/dist/es/performance-monitoring/navigation/resource-timing.js":
            /*!********************************************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/navigation/resource-timing.js ***!
  \********************************************************************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                    /* harmony export */   "createResourceTimingSpans": function() { return /* binding */ createResourceTimingSpans; }
                    /* harmony export */ });
                /* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/utils */ "../rum-core/dist/es/common/utils.js");
                /* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils */ "../rum-core/dist/es/performance-monitoring/navigation/utils.js");
                /* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../common/constants */ "../rum-core/dist/es/common/constants.js");
                /* harmony import */ var _span__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../span */ "../rum-core/dist/es/performance-monitoring/span.js");





                function createResourceTimingSpan(resourceTimingEntry) {
                    var name = resourceTimingEntry.name,
                        initiatorType = resourceTimingEntry.initiatorType,
                        startTime = resourceTimingEntry.startTime,
                        responseEnd = resourceTimingEntry.responseEnd;
                    var kind = 'resource';

                    if (initiatorType) {
                        kind += '.' + initiatorType;
                    }

                    var spanName = (0,_common_utils__WEBPACK_IMPORTED_MODULE_0__.stripQueryStringFromUrl)(name);
                    var span = new _span__WEBPACK_IMPORTED_MODULE_1__.default(spanName, kind);
                    span._start = startTime;
                    span.end(responseEnd, {
                        url: name,
                        entry: resourceTimingEntry
                    });
                    return span;
                }

                function isCapturedByPatching(resourceStartTime, requestPatchTime) {
                    return requestPatchTime != null && resourceStartTime > requestPatchTime;
                }

                function isIntakeAPIEndpoint(url) {
                    return /intake\/v\d+\/rum\/events/.test(url);
                }

                function createResourceTimingSpans(entries, requestPatchTime, trStart, trEnd) {
                    var spans = [];

                    for (var i = 0; i < entries.length; i++) {
                        var _entries$i = entries[i],
                            initiatorType = _entries$i.initiatorType,
                            name = _entries$i.name,
                            startTime = _entries$i.startTime,
                            responseEnd = _entries$i.responseEnd;

                        if (_common_constants__WEBPACK_IMPORTED_MODULE_2__.RESOURCE_INITIATOR_TYPES.indexOf(initiatorType) === -1 || name == null) {
                            continue;
                        }

                        if ((initiatorType === 'xmlhttprequest' || initiatorType === 'fetch') && (isIntakeAPIEndpoint(name) || isCapturedByPatching(startTime, requestPatchTime))) {
                            continue;
                        }

                        if ((0,_utils__WEBPACK_IMPORTED_MODULE_3__.shouldCreateSpan)(startTime, responseEnd, trStart, trEnd)) {
                            spans.push(createResourceTimingSpan(entries[i]));
                        }
                    }

                    return spans;
                }



                /***/ }),

            /***/ "../rum-core/dist/es/performance-monitoring/navigation/user-timing.js":
            /*!****************************************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/navigation/user-timing.js ***!
  \****************************************************************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                    /* harmony export */   "createUserTimingSpans": function() { return /* binding */ createUserTimingSpans; }
                    /* harmony export */ });
                /* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/constants */ "../rum-core/dist/es/common/constants.js");
                /* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "../rum-core/dist/es/performance-monitoring/navigation/utils.js");
                /* harmony import */ var _span__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../span */ "../rum-core/dist/es/performance-monitoring/span.js");




                function createUserTimingSpans(entries, trStart, trEnd) {
                    var userTimingSpans = [];

                    for (var i = 0; i < entries.length; i++) {
                        var _entries$i = entries[i],
                            name = _entries$i.name,
                            startTime = _entries$i.startTime,
                            duration = _entries$i.duration;
                        var end = startTime + duration;

                        if (duration <= _common_constants__WEBPACK_IMPORTED_MODULE_0__.USER_TIMING_THRESHOLD || !(0,_utils__WEBPACK_IMPORTED_MODULE_1__.shouldCreateSpan)(startTime, end, trStart, trEnd)) {
                            continue;
                        }

                        var kind = 'app';
                        var span = new _span__WEBPACK_IMPORTED_MODULE_2__.default(name, kind);
                        span._start = startTime;
                        span.end(end);
                        userTimingSpans.push(span);
                    }

                    return userTimingSpans;
                }



                /***/ }),

            /***/ "../rum-core/dist/es/performance-monitoring/navigation/utils.js":
            /*!**********************************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/navigation/utils.js ***!
  \**********************************************************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                    /* harmony export */   "shouldCreateSpan": function() { return /* binding */ shouldCreateSpan; }
                    /* harmony export */ });
                /* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../common/constants */ "../rum-core/dist/es/common/constants.js");


                function shouldCreateSpan(start, end, trStart, trEnd, baseTime) {
                    if (baseTime === void 0) {
                        baseTime = 0;
                    }

                    return typeof start === 'number' && typeof end === 'number' && start >= baseTime && end > start && start - baseTime >= trStart && end - baseTime <= trEnd && end - start < _common_constants__WEBPACK_IMPORTED_MODULE_0__.MAX_SPAN_DURATION && start - baseTime < _common_constants__WEBPACK_IMPORTED_MODULE_0__.MAX_SPAN_DURATION && end - baseTime < _common_constants__WEBPACK_IMPORTED_MODULE_0__.MAX_SPAN_DURATION;
                }



                /***/ }),

            /***/ "../rum-core/dist/es/performance-monitoring/performance-monitoring.js":
            /*!****************************************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/performance-monitoring.js ***!
  \****************************************************************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                    /* harmony export */   "groupSmallContinuouslySimilarSpans": function() { return /* binding */ groupSmallContinuouslySimilarSpans; },
                    /* harmony export */   "adjustTransaction": function() { return /* binding */ adjustTransaction; },
                    /* harmony export */   "default": function() { return /* binding */ PerformanceMonitoring; }
                    /* harmony export */ });
                /* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/utils */ "../rum-core/dist/es/common/utils.js");
                /* harmony import */ var _common_url__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/url */ "../rum-core/dist/es/common/url.js");
                /* harmony import */ var _common_patching__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/patching */ "../rum-core/dist/es/common/patching/index.js");
                /* harmony import */ var _common_patching_patch_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/patching/patch-utils */ "../rum-core/dist/es/common/patching/patch-utils.js");
                /* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/constants */ "../rum-core/dist/es/common/constants.js");
                /* harmony import */ var _common_truncate__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../common/truncate */ "../rum-core/dist/es/common/truncate.js");
                /* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../state */ "../rum-core/dist/es/state.js");







                var SIMILAR_SPAN_TO_TRANSACTION_RATIO = 0.05;
                var TRANSACTION_DURATION_THRESHOLD = 60000;
                function groupSmallContinuouslySimilarSpans(originalSpans, transDuration, threshold) {
                    originalSpans.sort(function (spanA, spanB) {
                        return spanA._start - spanB._start;
                    });
                    var spans = [];
                    var lastCount = 1;
                    originalSpans.forEach(function (span, index) {
                        if (spans.length === 0) {
                            spans.push(span);
                        } else {
                            var lastSpan = spans[spans.length - 1];
                            var isContinuouslySimilar = lastSpan.type === span.type && lastSpan.subtype === span.subtype && lastSpan.action === span.action && lastSpan.name === span.name && span.duration() / transDuration < threshold && (span._start - lastSpan._end) / transDuration < threshold;
                            var isLastSpan = originalSpans.length === index + 1;

                            if (isContinuouslySimilar) {
                                lastCount++;
                                lastSpan._end = span._end;
                            }

                            if (lastCount > 1 && (!isContinuouslySimilar || isLastSpan)) {
                                lastSpan.name = lastCount + 'x ' + lastSpan.name;
                                lastCount = 1;
                            }

                            if (!isContinuouslySimilar) {
                                spans.push(span);
                            }
                        }
                    });
                    return spans;
                }
                function adjustTransaction(transaction) {
                    if (transaction.sampled) {
                        var filterdSpans = transaction.spans.filter(function (span) {
                            return span.duration() > 0 && span._start >= transaction._start && span._end <= transaction._end;
                        });

                        if (transaction.isManaged()) {
                            var duration = transaction.duration();
                            var similarSpans = groupSmallContinuouslySimilarSpans(filterdSpans, duration, SIMILAR_SPAN_TO_TRANSACTION_RATIO);
                            transaction.spans = similarSpans;
                        } else {
                            transaction.spans = filterdSpans;
                        }
                    } else {
                        transaction.resetFields();
                    }

                    return transaction;
                }

                var PerformanceMonitoring = function () {
                    function PerformanceMonitoring(apmServer, configService, loggingService, transactionService) {
                        this._apmServer = apmServer;
                        this._configService = configService;
                        this._logginService = loggingService;
                        this._transactionService = transactionService;
                    }

                    var _proto = PerformanceMonitoring.prototype;

                    _proto.init = function init(flags) {
                        var _this = this;

                        if (flags === void 0) {
                            flags = {};
                        }

                        this._configService.events.observe(_common_constants__WEBPACK_IMPORTED_MODULE_0__.TRANSACTION_END + _common_constants__WEBPACK_IMPORTED_MODULE_0__.AFTER_EVENT, function (tr) {
                            var payload = _this.createTransactionPayload(tr);

                            if (payload) {
                                _this._apmServer.addTransaction(payload);

                                _this._configService.dispatchEvent(_common_constants__WEBPACK_IMPORTED_MODULE_0__.QUEUE_ADD_TRANSACTION);
                            }
                        });

                        if (flags[_common_constants__WEBPACK_IMPORTED_MODULE_0__.HISTORY]) {
                            _common_patching__WEBPACK_IMPORTED_MODULE_1__.patchEventHandler.observe(_common_constants__WEBPACK_IMPORTED_MODULE_0__.HISTORY, this.getHistorySub());
                        }

                        if (flags[_common_constants__WEBPACK_IMPORTED_MODULE_0__.XMLHTTPREQUEST]) {
                            _common_patching__WEBPACK_IMPORTED_MODULE_1__.patchEventHandler.observe(_common_constants__WEBPACK_IMPORTED_MODULE_0__.XMLHTTPREQUEST, this.getXHRSub());
                        }

                        if (flags[_common_constants__WEBPACK_IMPORTED_MODULE_0__.FETCH]) {
                            _common_patching__WEBPACK_IMPORTED_MODULE_1__.patchEventHandler.observe(_common_constants__WEBPACK_IMPORTED_MODULE_0__.FETCH, this.getFetchSub());
                        }
                    };

                    _proto.getHistorySub = function getHistorySub() {
                        var transactionService = this._transactionService;
                        return function (event, task) {
                            if (task.source === _common_constants__WEBPACK_IMPORTED_MODULE_0__.HISTORY && event === _common_constants__WEBPACK_IMPORTED_MODULE_0__.INVOKE) {
                                transactionService.startTransaction(task.data.title, 'route-change', {
                                    managed: true,
                                    canReuse: true
                                });
                            }
                        };
                    };

                    _proto.getXHRSub = function getXHRSub() {
                        var _this2 = this;

                        return function (event, task) {
                            if (task.source === _common_constants__WEBPACK_IMPORTED_MODULE_0__.XMLHTTPREQUEST && !_common_patching_patch_utils__WEBPACK_IMPORTED_MODULE_2__.globalState.fetchInProgress) {
                                _this2.processAPICalls(event, task);
                            }
                        };
                    };

                    _proto.getFetchSub = function getFetchSub() {
                        var _this3 = this;

                        return function (event, task) {
                            if (task.source === _common_constants__WEBPACK_IMPORTED_MODULE_0__.FETCH) {
                                _this3.processAPICalls(event, task);
                            }
                        };
                    };

                    _proto.processAPICalls = function processAPICalls(event, task) {
                        var configService = this._configService;
                        var transactionService = this._transactionService;

                        if (task.data && task.data.url) {
                            var endpoints = this._apmServer.getEndpoints();

                            var isOwnEndpoint = Object.keys(endpoints).some(function (endpoint) {
                                return task.data.url.indexOf(endpoints[endpoint]) !== -1;
                            });

                            if (isOwnEndpoint) {
                                return;
                            }
                        }

                        if (event === _common_constants__WEBPACK_IMPORTED_MODULE_0__.SCHEDULE && task.data) {
                            var data = task.data;
                            var requestUrl = new _common_url__WEBPACK_IMPORTED_MODULE_3__.Url(data.url);
                            var spanName = data.method + ' ' + (requestUrl.relative ? requestUrl.path : (0,_common_utils__WEBPACK_IMPORTED_MODULE_4__.stripQueryStringFromUrl)(requestUrl.href));

                            if (!transactionService.getCurrentTransaction()) {
                                transactionService.startTransaction(spanName, _common_constants__WEBPACK_IMPORTED_MODULE_0__.HTTP_REQUEST_TYPE, {
                                    managed: true
                                });
                            }

                            var span = transactionService.startSpan(spanName, 'external.http', {
                                blocking: true
                            });

                            if (!span) {
                                return;
                            }

                            var isDtEnabled = configService.get('distributedTracing');
                            var dtOrigins = configService.get('distributedTracingOrigins');
                            var currentUrl = new _common_url__WEBPACK_IMPORTED_MODULE_3__.Url(window.location.href);
                            var isSameOrigin = (0,_common_utils__WEBPACK_IMPORTED_MODULE_4__.checkSameOrigin)(requestUrl.origin, currentUrl.origin) || (0,_common_utils__WEBPACK_IMPORTED_MODULE_4__.checkSameOrigin)(requestUrl.origin, dtOrigins);
                            var target = data.target;

                            if (isDtEnabled && isSameOrigin && target) {
                                this.injectDtHeader(span, target);
                                var propagateTracestate = configService.get('propagateTracestate');

                                if (propagateTracestate) {
                                    this.injectTSHeader(span, target);
                                }
                            } else if (_state__WEBPACK_IMPORTED_MODULE_5__.__DEV__) {
                                this._logginService.debug("Could not inject distributed tracing header to the request origin ('" + requestUrl.origin + "') from the current origin ('" + currentUrl.origin + "')");
                            }

                            if (data.sync) {
                                span.sync = data.sync;
                            }

                            data.span = span;
                        } else if (event === _common_constants__WEBPACK_IMPORTED_MODULE_0__.INVOKE) {
                            var _data = task.data;

                            if (_data && _data.span) {
                                var _span = _data.span,
                                    response = _data.response,
                                    _target = _data.target;
                                var status;

                                if (response) {
                                    status = response.status;
                                } else {
                                    status = _target.status;
                                }

                                var outcome;

                                if (_data.status != 'abort' && !_data.aborted) {
                                    if (status >= 400 || status == 0) {
                                        outcome = _common_constants__WEBPACK_IMPORTED_MODULE_0__.OUTCOME_FAILURE;
                                    } else {
                                        outcome = _common_constants__WEBPACK_IMPORTED_MODULE_0__.OUTCOME_SUCCESS;
                                    }
                                } else {
                                    outcome = _common_constants__WEBPACK_IMPORTED_MODULE_0__.OUTCOME_UNKNOWN;
                                }

                                _span.outcome = outcome;
                                var tr = transactionService.getCurrentTransaction();

                                if (tr && tr.type === _common_constants__WEBPACK_IMPORTED_MODULE_0__.HTTP_REQUEST_TYPE) {
                                    tr.outcome = outcome;
                                }

                                transactionService.endSpan(_span, _data);
                            }
                        }
                    };

                    _proto.injectDtHeader = function injectDtHeader(span, target) {
                        var headerName = this._configService.get('distributedTracingHeaderName');

                        var headerValue = (0,_common_utils__WEBPACK_IMPORTED_MODULE_4__.getDtHeaderValue)(span);
                        var isHeaderValid = (0,_common_utils__WEBPACK_IMPORTED_MODULE_4__.isDtHeaderValid)(headerValue);

                        if (isHeaderValid && headerValue && headerName) {
                            (0,_common_utils__WEBPACK_IMPORTED_MODULE_4__.setRequestHeader)(target, headerName, headerValue);
                        }
                    };

                    _proto.injectTSHeader = function injectTSHeader(span, target) {
                        var headerValue = (0,_common_utils__WEBPACK_IMPORTED_MODULE_4__.getTSHeaderValue)(span);

                        if (headerValue) {
                            (0,_common_utils__WEBPACK_IMPORTED_MODULE_4__.setRequestHeader)(target, 'tracestate', headerValue);
                        }
                    };

                    _proto.extractDtHeader = function extractDtHeader(target) {
                        var configService = this._configService;
                        var headerName = configService.get('distributedTracingHeaderName');

                        if (target) {
                            return (0,_common_utils__WEBPACK_IMPORTED_MODULE_4__.parseDtHeaderValue)(target[headerName]);
                        }
                    };

                    _proto.filterTransaction = function filterTransaction(tr) {
                        var duration = tr.duration();

                        if (!duration) {
                            if (_state__WEBPACK_IMPORTED_MODULE_5__.__DEV__) {
                                var message = "transaction(" + tr.id + ", " + tr.name + ") was discarded! ";

                                if (duration === 0) {
                                    message += "Transaction duration is 0";
                                } else {
                                    message += "Transaction wasn't ended";
                                }

                                this._logginService.debug(message);
                            }

                            return false;
                        }

                        if (tr.isManaged()) {
                            if (duration > TRANSACTION_DURATION_THRESHOLD) {
                                if (_state__WEBPACK_IMPORTED_MODULE_5__.__DEV__) {
                                    this._logginService.debug("transaction(" + tr.id + ", " + tr.name + ") was discarded! Transaction duration (" + duration + ") is greater than managed transaction threshold (" + TRANSACTION_DURATION_THRESHOLD + ")");
                                }

                                return false;
                            }

                            if (tr.sampled && tr.spans.length === 0) {
                                if (_state__WEBPACK_IMPORTED_MODULE_5__.__DEV__) {
                                    this._logginService.debug("transaction(" + tr.id + ", " + tr.name + ") was discarded! Transaction does not have any spans");
                                }

                                return false;
                            }
                        }

                        return true;
                    };

                    _proto.createTransactionDataModel = function createTransactionDataModel(transaction) {
                        var transactionStart = transaction._start;
                        var spans = transaction.spans.map(function (span) {
                            var spanData = {
                                id: span.id,
                                transaction_id: transaction.id,
                                parent_id: span.parentId || transaction.id,
                                trace_id: transaction.traceId,
                                name: span.name,
                                type: span.type,
                                subtype: span.subtype,
                                action: span.action,
                                sync: span.sync,
                                start: parseInt(span._start - transactionStart),
                                duration: span.duration(),
                                context: span.context,
                                outcome: span.outcome,
                                sample_rate: span.sampleRate
                            };
                            return (0,_common_truncate__WEBPACK_IMPORTED_MODULE_6__.truncateModel)(_common_truncate__WEBPACK_IMPORTED_MODULE_6__.SPAN_MODEL, spanData);
                        });
                        var transactionData = {
                            id: transaction.id,
                            trace_id: transaction.traceId,
                            session: transaction.session,
                            name: transaction.name,
                            type: transaction.type,
                            duration: transaction.duration(),
                            spans: spans,
                            context: transaction.context,
                            marks: transaction.marks,
                            breakdown: transaction.breakdownTimings,
                            span_count: {
                                started: spans.length
                            },
                            sampled: transaction.sampled,
                            sample_rate: transaction.sampleRate,
                            experience: transaction.experience,
                            outcome: transaction.outcome
                        };
                        return (0,_common_truncate__WEBPACK_IMPORTED_MODULE_6__.truncateModel)(_common_truncate__WEBPACK_IMPORTED_MODULE_6__.TRANSACTION_MODEL, transactionData);
                    };

                    _proto.createTransactionPayload = function createTransactionPayload(transaction) {
                        var adjustedTransaction = adjustTransaction(transaction);
                        var filtered = this.filterTransaction(adjustedTransaction);

                        if (filtered) {
                            return this.createTransactionDataModel(transaction);
                        }
                    };

                    return PerformanceMonitoring;
                }();



                /***/ }),

            /***/ "../rum-core/dist/es/performance-monitoring/span-base.js":
            /*!***************************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/span-base.js ***!
  \***************************************************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/utils */ "../rum-core/dist/es/common/utils.js");
                /* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/constants */ "../rum-core/dist/es/common/constants.js");



                var SpanBase = function () {
                    function SpanBase(name, type, options) {
                        if (options === void 0) {
                            options = {};
                        }

                        if (!name) {
                            name = _common_constants__WEBPACK_IMPORTED_MODULE_0__.NAME_UNKNOWN;
                        }

                        if (!type) {
                            type = _common_constants__WEBPACK_IMPORTED_MODULE_0__.TYPE_CUSTOM;
                        }

                        this.name = name;
                        this.type = type;
                        this.options = options;
                        this.id = options.id || (0,_common_utils__WEBPACK_IMPORTED_MODULE_1__.generateRandomId)(16);
                        this.traceId = options.traceId;
                        this.sampled = options.sampled;
                        this.sampleRate = options.sampleRate;
                        this.timestamp = options.timestamp;
                        this._start = (0,_common_utils__WEBPACK_IMPORTED_MODULE_1__.getTime)(options.startTime);
                        this._end = undefined;
                        this.ended = false;
                        this.outcome = undefined;
                        this.onEnd = options.onEnd;
                    }

                    var _proto = SpanBase.prototype;

                    _proto.ensureContext = function ensureContext() {
                        if (!this.context) {
                            this.context = {};
                        }
                    };

                    _proto.addLabels = function addLabels(tags) {
                        this.ensureContext();
                        var ctx = this.context;

                        if (!ctx.tags) {
                            ctx.tags = {};
                        }

                        var keys = Object.keys(tags);
                        keys.forEach(function (k) {
                            return (0,_common_utils__WEBPACK_IMPORTED_MODULE_1__.setLabel)(k, tags[k], ctx.tags);
                        });
                    };

                    _proto.addContext = function addContext() {
                        for (var _len = arguments.length, context = new Array(_len), _key = 0; _key < _len; _key++) {
                            context[_key] = arguments[_key];
                        }

                        if (context.length === 0) return;
                        this.ensureContext();
                        _common_utils__WEBPACK_IMPORTED_MODULE_1__.merge.apply(void 0, [this.context].concat(context));
                    };

                    _proto.end = function end(endTime) {
                        if (this.ended) {
                            return;
                        }

                        this.ended = true;
                        this._end = (0,_common_utils__WEBPACK_IMPORTED_MODULE_1__.getTime)(endTime);
                        this.callOnEnd();
                    };

                    _proto.callOnEnd = function callOnEnd() {
                        if (typeof this.onEnd === 'function') {
                            this.onEnd(this);
                        }
                    };

                    _proto.duration = function duration() {
                        return (0,_common_utils__WEBPACK_IMPORTED_MODULE_1__.getDuration)(this._start, this._end);
                    };

                    return SpanBase;
                }();

                /* harmony default export */ __webpack_exports__["default"] = (SpanBase);

                /***/ }),

            /***/ "../rum-core/dist/es/performance-monitoring/span.js":
            /*!**********************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/span.js ***!
  \**********************************************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */ var _span_base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./span-base */ "../rum-core/dist/es/performance-monitoring/span-base.js");
                /* harmony import */ var _common_context__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/context */ "../rum-core/dist/es/common/context.js");
                function _inheritsLoose(subClass, superClass) {
                    subClass.prototype = Object.create(superClass.prototype);
                    subClass.prototype.constructor = subClass;

                    _setPrototypeOf(subClass, superClass);
                }

                function _setPrototypeOf(o, p) {
                    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
                        o.__proto__ = p;
                        return o;
                    };

                    return _setPrototypeOf(o, p);
                }




                var Span = function (_SpanBase) {
                    _inheritsLoose(Span, _SpanBase);

                    function Span(name, type, options) {
                        var _this;

                        _this = _SpanBase.call(this, name, type, options) || this;
                        _this.parentId = _this.options.parentId;
                        _this.subtype = undefined;
                        _this.action = undefined;

                        if (_this.type.indexOf('.') !== -1) {
                            var fields = _this.type.split('.', 3);

                            _this.type = fields[0];
                            _this.subtype = fields[1];
                            _this.action = fields[2];
                        }

                        _this.sync = _this.options.sync;
                        return _this;
                    }

                    var _proto = Span.prototype;

                    _proto.end = function end(endTime, data) {
                        _SpanBase.prototype.end.call(this, endTime);

                        (0,_common_context__WEBPACK_IMPORTED_MODULE_0__.addSpanContext)(this, data);
                    };

                    return Span;
                }(_span_base__WEBPACK_IMPORTED_MODULE_1__.default);

                /* harmony default export */ __webpack_exports__["default"] = (Span);

                /***/ }),

            /***/ "../rum-core/dist/es/performance-monitoring/transaction-service.js":
            /*!*************************************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/transaction-service.js ***!
  \*************************************************************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */ var _common_polyfills__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../common/polyfills */ "../rum-core/dist/es/common/polyfills.js");
                /* harmony import */ var _transaction__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./transaction */ "../rum-core/dist/es/performance-monitoring/transaction.js");
                /* harmony import */ var _metrics__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./metrics */ "../rum-core/dist/es/performance-monitoring/metrics.js");
                /* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/utils */ "../rum-core/dist/es/common/utils.js");
                /* harmony import */ var _navigation_capture_navigation__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./navigation/capture-navigation */ "../rum-core/dist/es/performance-monitoring/navigation/capture-navigation.js");
                /* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/constants */ "../rum-core/dist/es/common/constants.js");
                /* harmony import */ var _common_context__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../common/context */ "../rum-core/dist/es/common/context.js");
                /* harmony import */ var _state__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../state */ "../rum-core/dist/es/state.js");
                /* harmony import */ var _common_url__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../common/url */ "../rum-core/dist/es/common/url.js");










                var TransactionService = function () {
                    function TransactionService(logger, config) {
                        var _this = this;

                        this._config = config;
                        this._logger = logger;
                        this.currentTransaction = undefined;
                        this.respIntervalId = undefined;
                        this.recorder = new _metrics__WEBPACK_IMPORTED_MODULE_0__.PerfEntryRecorder(function (list) {
                            var tr = _this.getCurrentTransaction();

                            if (tr && tr.captureTimings) {
                                var _tr$spans;

                                var isHardNavigation = tr.type === _common_constants__WEBPACK_IMPORTED_MODULE_1__.PAGE_LOAD;

                                var _captureObserverEntri = (0,_metrics__WEBPACK_IMPORTED_MODULE_0__.captureObserverEntries)(list, {
                                        isHardNavigation: isHardNavigation,
                                        trStart: isHardNavigation ? 0 : tr._start
                                    }),
                                    spans = _captureObserverEntri.spans,
                                    marks = _captureObserverEntri.marks;

                                (_tr$spans = tr.spans).push.apply(_tr$spans, spans);

                                tr.addMarks({
                                    agent: marks
                                });
                            }
                        });
                    }

                    var _proto = TransactionService.prototype;

                    _proto.createCurrentTransaction = function createCurrentTransaction(name, type, options) {
                        var tr = new _transaction__WEBPACK_IMPORTED_MODULE_2__.default(name, type, options);
                        this.currentTransaction = tr;
                        return tr;
                    };

                    _proto.getCurrentTransaction = function getCurrentTransaction() {
                        if (this.currentTransaction && !this.currentTransaction.ended) {
                            return this.currentTransaction;
                        }
                    };

                    _proto.createOptions = function createOptions(options) {
                        var config = this._config.config;
                        var presetOptions = {
                            transactionSampleRate: config.transactionSampleRate
                        };
                        var perfOptions = (0,_common_utils__WEBPACK_IMPORTED_MODULE_3__.extend)(presetOptions, options);

                        if (perfOptions.managed) {
                            perfOptions = (0,_common_utils__WEBPACK_IMPORTED_MODULE_3__.extend)({
                                pageLoadTraceId: config.pageLoadTraceId,
                                pageLoadSampled: config.pageLoadSampled,
                                pageLoadSpanId: config.pageLoadSpanId,
                                pageLoadTransactionName: config.pageLoadTransactionName
                            }, perfOptions);
                        }

                        return perfOptions;
                    };

                    _proto.startManagedTransaction = function startManagedTransaction(name, type, perfOptions) {
                        var tr = this.getCurrentTransaction();
                        var isRedefined = false;

                        if (!tr) {
                            tr = this.createCurrentTransaction(name, type, perfOptions);
                        } else if (tr.canReuse() && perfOptions.canReuse) {
                            var redefineType = tr.type;
                            var currentTypeOrder = _common_constants__WEBPACK_IMPORTED_MODULE_1__.TRANSACTION_TYPE_ORDER.indexOf(tr.type);
                            var redefineTypeOrder = _common_constants__WEBPACK_IMPORTED_MODULE_1__.TRANSACTION_TYPE_ORDER.indexOf(type);

                            if (currentTypeOrder >= 0 && redefineTypeOrder < currentTypeOrder) {
                                redefineType = type;
                            }

                            if (_state__WEBPACK_IMPORTED_MODULE_4__.__DEV__) {
                                this._logger.debug("redefining transaction(" + tr.id + ", " + tr.name + ", " + tr.type + ")", 'to', "(" + (name || tr.name) + ", " + redefineType + ")", tr);
                            }

                            tr.redefine(name, redefineType, perfOptions);
                            isRedefined = true;
                        } else {
                            if (_state__WEBPACK_IMPORTED_MODULE_4__.__DEV__) {
                                this._logger.debug("ending previous transaction(" + tr.id + ", " + tr.name + ")", tr);
                            }

                            tr.end();
                            tr = this.createCurrentTransaction(name, type, perfOptions);
                        }

                        if (tr.type === _common_constants__WEBPACK_IMPORTED_MODULE_1__.PAGE_LOAD) {
                            if (!isRedefined) {
                                this.recorder.start(_common_constants__WEBPACK_IMPORTED_MODULE_1__.LARGEST_CONTENTFUL_PAINT);
                                this.recorder.start(_common_constants__WEBPACK_IMPORTED_MODULE_1__.PAINT);
                                this.recorder.start(_common_constants__WEBPACK_IMPORTED_MODULE_1__.FIRST_INPUT);
                                this.recorder.start(_common_constants__WEBPACK_IMPORTED_MODULE_1__.LAYOUT_SHIFT);
                            }

                            if (perfOptions.pageLoadTraceId) {
                                tr.traceId = perfOptions.pageLoadTraceId;
                            }

                            if (perfOptions.pageLoadSampled) {
                                tr.sampled = perfOptions.pageLoadSampled;
                            }

                            if (tr.name === _common_constants__WEBPACK_IMPORTED_MODULE_1__.NAME_UNKNOWN && perfOptions.pageLoadTransactionName) {
                                tr.name = perfOptions.pageLoadTransactionName;
                            }
                        }

                        if (!isRedefined && this._config.get('monitorLongtasks')) {
                            this.recorder.start(_common_constants__WEBPACK_IMPORTED_MODULE_1__.LONG_TASK);
                        }

                        if (tr.sampled) {
                            tr.captureTimings = true;
                        }

                        return tr;
                    };

                    _proto.startTransaction = function startTransaction(name, type, options) {
                        var _this2 = this;

                        var perfOptions = this.createOptions(options);
                        var tr;
                        var fireOnstartHook = true;

                        if (perfOptions.managed) {
                            var current = this.currentTransaction;
                            tr = this.startManagedTransaction(name, type, perfOptions);

                            if (current === tr) {
                                fireOnstartHook = false;
                            }
                        } else {
                            tr = new _transaction__WEBPACK_IMPORTED_MODULE_2__.default(name, type, perfOptions);
                        }

                        tr.onEnd = function () {
                            return _this2.handleTransactionEnd(tr);
                        };

                        if (fireOnstartHook) {
                            if (_state__WEBPACK_IMPORTED_MODULE_4__.__DEV__) {
                                this._logger.debug("startTransaction(" + tr.id + ", " + tr.name + ", " + tr.type + ")");
                            }

                            this._config.events.send(_common_constants__WEBPACK_IMPORTED_MODULE_1__.TRANSACTION_START, [tr]);
                        }

                        return tr;
                    };

                    _proto.handleTransactionEnd = function handleTransactionEnd(tr) {
                        var _this3 = this;

                        this.recorder.stop();
                        var currentUrl = window.location.href;
                        return _common_polyfills__WEBPACK_IMPORTED_MODULE_5__.Promise.resolve().then(function () {
                            var name = tr.name,
                                type = tr.type;
                            var lastHiddenStart = _state__WEBPACK_IMPORTED_MODULE_4__.state.lastHiddenStart;

                            if (lastHiddenStart >= tr._start) {
                                if (_state__WEBPACK_IMPORTED_MODULE_4__.__DEV__) {
                                    _this3._logger.debug("transaction(" + tr.id + ", " + name + ", " + type + ") was discarded! The page was hidden during the transaction!");
                                }

                                return;
                            }

                            if (_this3.shouldIgnoreTransaction(name) || type === _common_constants__WEBPACK_IMPORTED_MODULE_1__.TEMPORARY_TYPE) {
                                if (_state__WEBPACK_IMPORTED_MODULE_4__.__DEV__) {
                                    _this3._logger.debug("transaction(" + tr.id + ", " + name + ", " + type + ") is ignored");
                                }

                                return;
                            }

                            if (type === _common_constants__WEBPACK_IMPORTED_MODULE_1__.PAGE_LOAD) {
                                var pageLoadTransactionName = _this3._config.get('pageLoadTransactionName');

                                if (name === _common_constants__WEBPACK_IMPORTED_MODULE_1__.NAME_UNKNOWN && pageLoadTransactionName) {
                                    tr.name = pageLoadTransactionName;
                                }

                                if (tr.captureTimings) {
                                    var cls = _metrics__WEBPACK_IMPORTED_MODULE_0__.metrics.cls,
                                        fid = _metrics__WEBPACK_IMPORTED_MODULE_0__.metrics.fid,
                                        tbt = _metrics__WEBPACK_IMPORTED_MODULE_0__.metrics.tbt,
                                        longtask = _metrics__WEBPACK_IMPORTED_MODULE_0__.metrics.longtask;

                                    if (tbt.duration > 0) {
                                        tr.spans.push((0,_metrics__WEBPACK_IMPORTED_MODULE_0__.createTotalBlockingTimeSpan)(tbt));
                                    }

                                    tr.experience = {};

                                    if ((0,_common_utils__WEBPACK_IMPORTED_MODULE_3__.isPerfTypeSupported)(_common_constants__WEBPACK_IMPORTED_MODULE_1__.LONG_TASK)) {
                                        tr.experience.tbt = tbt.duration;
                                    }

                                    if ((0,_common_utils__WEBPACK_IMPORTED_MODULE_3__.isPerfTypeSupported)(_common_constants__WEBPACK_IMPORTED_MODULE_1__.LAYOUT_SHIFT)) {
                                        tr.experience.cls = cls.score;
                                    }

                                    if (fid > 0) {
                                        tr.experience.fid = fid;
                                    }

                                    if (longtask.count > 0) {
                                        tr.experience.longtask = {
                                            count: longtask.count,
                                            sum: longtask.duration,
                                            max: longtask.max
                                        };
                                    }
                                }

                                _this3.setSession(tr);
                            }

                            if (tr.name === _common_constants__WEBPACK_IMPORTED_MODULE_1__.NAME_UNKNOWN) {
                                tr.name = (0,_common_url__WEBPACK_IMPORTED_MODULE_6__.slugifyUrl)(currentUrl);
                            }

                            (0,_navigation_capture_navigation__WEBPACK_IMPORTED_MODULE_7__.captureNavigation)(tr);

                            _this3.adjustTransactionTime(tr);

                            var breakdownMetrics = _this3._config.get('breakdownMetrics');

                            if (breakdownMetrics) {
                                tr.captureBreakdown();
                            }

                            var configContext = _this3._config.get('context');

                            (0,_common_context__WEBPACK_IMPORTED_MODULE_8__.addTransactionContext)(tr, configContext);

                            _this3._config.events.send(_common_constants__WEBPACK_IMPORTED_MODULE_1__.TRANSACTION_END, [tr]);

                            if (_state__WEBPACK_IMPORTED_MODULE_4__.__DEV__) {
                                _this3._logger.debug("end transaction(" + tr.id + ", " + tr.name + ", " + tr.type + ")", tr);
                            }
                        }, function (err) {
                            if (_state__WEBPACK_IMPORTED_MODULE_4__.__DEV__) {
                                _this3._logger.debug("error ending transaction(" + tr.id + ", " + tr.name + ")", err);
                            }
                        });
                    };

                    _proto.setSession = function setSession(tr) {
                        var session = this._config.get('session');

                        if (session) {
                            if (typeof session == 'boolean') {
                                tr.session = {
                                    id: (0,_common_utils__WEBPACK_IMPORTED_MODULE_3__.generateRandomId)(16),
                                    sequence: 1
                                };
                            } else {
                                if (session.timestamp && Date.now() - session.timestamp > _common_constants__WEBPACK_IMPORTED_MODULE_1__.SESSION_TIMEOUT) {
                                    tr.session = {
                                        id: (0,_common_utils__WEBPACK_IMPORTED_MODULE_3__.generateRandomId)(16),
                                        sequence: 1
                                    };
                                } else {
                                    tr.session = {
                                        id: session.id,
                                        sequence: session.sequence ? session.sequence + 1 : 1
                                    };
                                }
                            }

                            var sessionConfig = {
                                session: {
                                    id: tr.session.id,
                                    sequence: tr.session.sequence,
                                    timestamp: Date.now()
                                }
                            };

                            this._config.setConfig(sessionConfig);

                            this._config.setLocalConfig(sessionConfig, true);
                        }
                    };

                    _proto.adjustTransactionTime = function adjustTransactionTime(transaction) {
                        var spans = transaction.spans;
                        var earliestSpan = (0,_common_utils__WEBPACK_IMPORTED_MODULE_3__.getEarliestSpan)(spans);

                        if (earliestSpan && earliestSpan._start < transaction._start) {
                            transaction._start = earliestSpan._start;
                        }

                        var latestSpan = (0,_common_utils__WEBPACK_IMPORTED_MODULE_3__.getLatestNonXHRSpan)(spans) || {};
                        var latestSpanEnd = latestSpan._end || 0;

                        if (transaction.type === _common_constants__WEBPACK_IMPORTED_MODULE_1__.PAGE_LOAD) {
                            var transactionEndWithoutDelay = transaction._end - _common_constants__WEBPACK_IMPORTED_MODULE_1__.PAGE_LOAD_DELAY;
                            var lcp = _metrics__WEBPACK_IMPORTED_MODULE_0__.metrics.lcp || 0;
                            var latestXHRSpan = (0,_common_utils__WEBPACK_IMPORTED_MODULE_3__.getLatestXHRSpan)(spans) || {};
                            var latestXHRSpanEnd = latestXHRSpan._end || 0;
                            transaction._end = Math.max(latestSpanEnd, latestXHRSpanEnd, lcp, transactionEndWithoutDelay);
                        } else if (latestSpanEnd > transaction._end) {
                            transaction._end = latestSpanEnd;
                        }

                        this.truncateSpans(spans, transaction._end);
                    };

                    _proto.truncateSpans = function truncateSpans(spans, transactionEnd) {
                        for (var i = 0; i < spans.length; i++) {
                            var span = spans[i];

                            if (span._end > transactionEnd) {
                                span._end = transactionEnd;
                                span.type += _common_constants__WEBPACK_IMPORTED_MODULE_1__.TRUNCATED_TYPE;
                            }

                            if (span._start > transactionEnd) {
                                span._start = transactionEnd;
                            }
                        }
                    };

                    _proto.shouldIgnoreTransaction = function shouldIgnoreTransaction(transactionName) {
                        var ignoreList = this._config.get('ignoreTransactions');

                        if (ignoreList && ignoreList.length) {
                            for (var i = 0; i < ignoreList.length; i++) {
                                var element = ignoreList[i];

                                if (typeof element.test === 'function') {
                                    if (element.test(transactionName)) {
                                        return true;
                                    }
                                } else if (element === transactionName) {
                                    return true;
                                }
                            }
                        }

                        return false;
                    };

                    _proto.startSpan = function startSpan(name, type, options) {
                        var tr = this.getCurrentTransaction();

                        if (!tr) {
                            tr = this.createCurrentTransaction(undefined, _common_constants__WEBPACK_IMPORTED_MODULE_1__.TEMPORARY_TYPE, this.createOptions({
                                canReuse: true,
                                managed: true
                            }));
                        }

                        var span = tr.startSpan(name, type, options);

                        if (_state__WEBPACK_IMPORTED_MODULE_4__.__DEV__) {
                            this._logger.debug("startSpan(" + name + ", " + span.type + ")", "on transaction(" + tr.id + ", " + tr.name + ")");
                        }

                        return span;
                    };

                    _proto.endSpan = function endSpan(span, context) {
                        if (!span) {
                            return;
                        }

                        if (_state__WEBPACK_IMPORTED_MODULE_4__.__DEV__) {
                            var tr = this.getCurrentTransaction();
                            tr && this._logger.debug("endSpan(" + span.name + ", " + span.type + ")", "on transaction(" + tr.id + ", " + tr.name + ")");
                        }

                        span.end(null, context);
                    };

                    return TransactionService;
                }();

                /* harmony default export */ __webpack_exports__["default"] = (TransactionService);

                /***/ }),

            /***/ "../rum-core/dist/es/performance-monitoring/transaction.js":
            /*!*****************************************************************!*\
  !*** ../rum-core/dist/es/performance-monitoring/transaction.js ***!
  \*****************************************************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */ var _span__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./span */ "../rum-core/dist/es/performance-monitoring/span.js");
                /* harmony import */ var _span_base__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./span-base */ "../rum-core/dist/es/performance-monitoring/span-base.js");
                /* harmony import */ var _common_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common/utils */ "../rum-core/dist/es/common/utils.js");
                /* harmony import */ var _common_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../common/constants */ "../rum-core/dist/es/common/constants.js");
                /* harmony import */ var _breakdown__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./breakdown */ "../rum-core/dist/es/performance-monitoring/breakdown.js");
                function _inheritsLoose(subClass, superClass) {
                    subClass.prototype = Object.create(superClass.prototype);
                    subClass.prototype.constructor = subClass;

                    _setPrototypeOf(subClass, superClass);
                }

                function _setPrototypeOf(o, p) {
                    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
                        o.__proto__ = p;
                        return o;
                    };

                    return _setPrototypeOf(o, p);
                }







                var Transaction = function (_SpanBase) {
                    _inheritsLoose(Transaction, _SpanBase);

                    function Transaction(name, type, options) {
                        var _this;

                        _this = _SpanBase.call(this, name, type, options) || this;
                        _this.traceId = (0,_common_utils__WEBPACK_IMPORTED_MODULE_0__.generateRandomId)();
                        _this.marks = undefined;
                        _this.spans = [];
                        _this._activeSpans = {};
                        _this._activeTasks = new Set();
                        _this.blocked = false;
                        _this.captureTimings = false;
                        _this.breakdownTimings = [];
                        _this.sampleRate = _this.options.transactionSampleRate;
                        _this.sampled = Math.random() <= _this.sampleRate;
                        return _this;
                    }

                    var _proto = Transaction.prototype;

                    _proto.addMarks = function addMarks(obj) {
                        this.marks = (0,_common_utils__WEBPACK_IMPORTED_MODULE_0__.merge)(this.marks || {}, obj);
                    };

                    _proto.mark = function mark(key) {
                        var skey = (0,_common_utils__WEBPACK_IMPORTED_MODULE_0__.removeInvalidChars)(key);

                        var markTime = (0,_common_utils__WEBPACK_IMPORTED_MODULE_0__.now)() - this._start;

                        var custom = {};
                        custom[skey] = markTime;
                        this.addMarks({
                            custom: custom
                        });
                    };

                    _proto.canReuse = function canReuse() {
                        var threshold = this.options.reuseThreshold || _common_constants__WEBPACK_IMPORTED_MODULE_1__.REUSABILITY_THRESHOLD;
                        return !!this.options.canReuse && !this.ended && (0,_common_utils__WEBPACK_IMPORTED_MODULE_0__.now)() - this._start < threshold;
                    };

                    _proto.redefine = function redefine(name, type, options) {
                        if (name) {
                            this.name = name;
                        }

                        if (type) {
                            this.type = type;
                        }

                        if (options) {
                            this.options.reuseThreshold = options.reuseThreshold;
                            (0,_common_utils__WEBPACK_IMPORTED_MODULE_0__.extend)(this.options, options);
                        }
                    };

                    _proto.startSpan = function startSpan(name, type, options) {
                        var _this2 = this;

                        if (this.ended) {
                            return;
                        }

                        var opts = (0,_common_utils__WEBPACK_IMPORTED_MODULE_0__.extend)({}, options);

                        opts.onEnd = function (trc) {
                            _this2._onSpanEnd(trc);
                        };

                        opts.traceId = this.traceId;
                        opts.sampled = this.sampled;
                        opts.sampleRate = this.sampleRate;

                        if (!opts.parentId) {
                            opts.parentId = this.id;
                        }

                        var span = new _span__WEBPACK_IMPORTED_MODULE_2__.default(name, type, opts);
                        this._activeSpans[span.id] = span;

                        if (opts.blocking) {
                            this.addTask(span.id);
                        }

                        return span;
                    };

                    _proto.isFinished = function isFinished() {
                        return !this.blocked && this._activeTasks.size === 0;
                    };

                    _proto.detectFinish = function detectFinish() {
                        if (this.isFinished()) this.end();
                    };

                    _proto.end = function end(endTime) {
                        if (this.ended) {
                            return;
                        }

                        this.ended = true;
                        this._end = (0,_common_utils__WEBPACK_IMPORTED_MODULE_0__.getTime)(endTime);

                        for (var sid in this._activeSpans) {
                            var span = this._activeSpans[sid];
                            span.type = span.type + _common_constants__WEBPACK_IMPORTED_MODULE_1__.TRUNCATED_TYPE;
                            span.end(endTime);
                        }

                        this.callOnEnd();
                    };

                    _proto.captureBreakdown = function captureBreakdown() {
                        this.breakdownTimings = (0,_breakdown__WEBPACK_IMPORTED_MODULE_3__.captureBreakdown)(this);
                    };

                    _proto.block = function block(flag) {
                        this.blocked = flag;

                        if (!this.blocked) {
                            this.detectFinish();
                        }
                    };

                    _proto.addTask = function addTask(taskId) {
                        if (!taskId) {
                            taskId = 'task-' + (0,_common_utils__WEBPACK_IMPORTED_MODULE_0__.generateRandomId)(16);
                        }

                        this._activeTasks.add(taskId);

                        return taskId;
                    };

                    _proto.removeTask = function removeTask(taskId) {
                        var deleted = this._activeTasks.delete(taskId);

                        deleted && this.detectFinish();
                    };

                    _proto.resetFields = function resetFields() {
                        this.spans = [];
                        this.sampleRate = 0;
                    };

                    _proto._onSpanEnd = function _onSpanEnd(span) {
                        this.spans.push(span);
                        delete this._activeSpans[span.id];
                        this.removeTask(span.id);
                    };

                    _proto.isManaged = function isManaged() {
                        return !!this.options.managed;
                    };

                    return Transaction;
                }(_span_base__WEBPACK_IMPORTED_MODULE_4__.default);

                /* harmony default export */ __webpack_exports__["default"] = (Transaction);

                /***/ }),

            /***/ "../rum-core/dist/es/state.js":
            /*!************************************!*\
  !*** ../rum-core/dist/es/state.js ***!
  \************************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                    /* harmony export */   "__DEV__": function() { return /* binding */ __DEV__; },
                    /* harmony export */   "state": function() { return /* binding */ state; }
                    /* harmony export */ });
                var __DEV__ = "development" !== 'production';

                var state = {
                    bootstrapTime: null,
                    lastHiddenStart: Number.MIN_SAFE_INTEGER
                };


                /***/ }),

            /***/ "./src/apm-base.js":
            /*!*************************!*\
  !*** ./src/apm-base.js ***!
  \*************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                    /* harmony export */   "default": function() { return /* binding */ ApmBase; }
                    /* harmony export */ });
                /* harmony import */ var _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @elastic/apm-rum-core */ "../rum-core/dist/es/common/constants.js");
                /* harmony import */ var _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @elastic/apm-rum-core */ "../rum-core/dist/es/common/instrument.js");
                /* harmony import */ var _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @elastic/apm-rum-core */ "../rum-core/dist/es/common/observers/page-visibility.js");
                /* harmony import */ var _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @elastic/apm-rum-core */ "../rum-core/dist/es/common/observers/page-clicks.js");


                var ApmBase = function () {
                    function ApmBase(serviceFactory, disable) {
                        this._disable = disable;
                        this.serviceFactory = serviceFactory;
                        this._initialized = false;
                    }

                    var _proto = ApmBase.prototype;

                    _proto.isEnabled = function isEnabled() {
                        return !this._disable;
                    };

                    _proto.isActive = function isActive() {
                        var configService = this.serviceFactory.getService(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.CONFIG_SERVICE);
                        return this.isEnabled() && this._initialized && configService.get('active');
                    };

                    _proto.init = function init(config) {
                        var _this = this;

                        if (this.isEnabled() && !this._initialized) {
                            this._initialized = true;

                            var _this$serviceFactory$ = this.serviceFactory.getService([_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.CONFIG_SERVICE, _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.LOGGING_SERVICE, _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.TRANSACTION_SERVICE]),
                                configService = _this$serviceFactory$[0],
                                loggingService = _this$serviceFactory$[1],
                                transactionService = _this$serviceFactory$[2];

                            configService.setVersion('5.14.0');
                            this.config(config);
                            var logLevel = configService.get('logLevel');
                            loggingService.setLevel(logLevel);
                            var isConfigActive = configService.get('active');

                            if (isConfigActive) {
                                this.serviceFactory.init();
                                var flags = (0,_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_1__.getInstrumentationFlags)(configService.get('instrument'), configService.get('disableInstrumentations'));
                                var performanceMonitoring = this.serviceFactory.getService(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.PERFORMANCE_MONITORING);
                                performanceMonitoring.init(flags);

                                if (flags[_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.ERROR]) {
                                    var errorLogging = this.serviceFactory.getService(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.ERROR_LOGGING);
                                    errorLogging.registerListeners();
                                }

                                if (configService.get('session')) {
                                    var localConfig = configService.getLocalConfig();

                                    if (localConfig && localConfig.session) {
                                        configService.setConfig({
                                            session: localConfig.session
                                        });
                                    }
                                }

                                var sendPageLoad = function sendPageLoad() {
                                    return flags[_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.PAGE_LOAD] && _this._sendPageLoadMetrics();
                                };

                                if (configService.get('centralConfig')) {
                                    this.fetchCentralConfig().then(sendPageLoad);
                                } else {
                                    sendPageLoad();
                                }

                                (0,_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_2__.observePageVisibility)(configService, transactionService);

                                if (flags[_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.EVENT_TARGET] && flags[_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.CLICK]) {
                                    (0,_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_3__.observePageClicks)(transactionService);
                                }
                            } else {
                                this._disable = true;
                                loggingService.warn('RUM agent is inactive');
                            }
                        }

                        return this;
                    };

                    _proto.fetchCentralConfig = function fetchCentralConfig() {
                        var _this$serviceFactory$2 = this.serviceFactory.getService([_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.APM_SERVER, _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.LOGGING_SERVICE, _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.CONFIG_SERVICE]),
                            apmServer = _this$serviceFactory$2[0],
                            loggingService = _this$serviceFactory$2[1],
                            configService = _this$serviceFactory$2[2];

                        return apmServer.fetchConfig(configService.get('serviceName'), configService.get('environment')).then(function (config) {
                            var transactionSampleRate = config['transaction_sample_rate'];

                            if (transactionSampleRate) {
                                transactionSampleRate = Number(transactionSampleRate);
                                var _config2 = {
                                    transactionSampleRate: transactionSampleRate
                                };

                                var _configService$valida = configService.validate(_config2),
                                    invalid = _configService$valida.invalid;

                                if (invalid.length === 0) {
                                    configService.setConfig(_config2);
                                } else {
                                    var _invalid$ = invalid[0],
                                        key = _invalid$.key,
                                        value = _invalid$.value,
                                        allowed = _invalid$.allowed;
                                    loggingService.warn("invalid value \"" + value + "\" for " + key + ". Allowed: " + allowed + ".");
                                }
                            }

                            return config;
                        }).catch(function (error) {
                            loggingService.warn('failed fetching config:', error);
                        });
                    };

                    _proto._sendPageLoadMetrics = function _sendPageLoadMetrics() {
                        var tr = this.startTransaction(undefined, _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.PAGE_LOAD, {
                            managed: true,
                            canReuse: true
                        });

                        if (!tr) {
                            return;
                        }

                        tr.addTask(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.PAGE_LOAD);

                        var sendPageLoadMetrics = function sendPageLoadMetrics() {
                            setTimeout(function () {
                                return tr.removeTask(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.PAGE_LOAD);
                            }, _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.PAGE_LOAD_DELAY);
                        };

                        if (document.readyState === 'complete') {
                            sendPageLoadMetrics();
                        } else {
                            window.addEventListener('load', sendPageLoadMetrics);
                        }
                    };

                    _proto.observe = function observe(name, fn) {
                        var configService = this.serviceFactory.getService(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.CONFIG_SERVICE);
                        configService.events.observe(name, fn);
                    };

                    _proto.config = function config(_config) {
                        var _this$serviceFactory$3 = this.serviceFactory.getService([_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.CONFIG_SERVICE, _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.LOGGING_SERVICE]),
                            configService = _this$serviceFactory$3[0],
                            loggingService = _this$serviceFactory$3[1];

                        var _configService$valida2 = configService.validate(_config),
                            missing = _configService$valida2.missing,
                            invalid = _configService$valida2.invalid,
                            unknown = _configService$valida2.unknown;

                        if (unknown.length > 0) {
                            var message = 'Unknown config options are specified for RUM agent: ' + unknown.join(', ');
                            loggingService.warn(message);
                        }

                        if (missing.length === 0 && invalid.length === 0) {
                            configService.setConfig(_config);
                        } else {
                            var separator = ', ';
                            var _message = "RUM agent isn't correctly configured. ";

                            if (missing.length > 0) {
                                _message += missing.join(separator) + ' is missing';

                                if (invalid.length > 0) {
                                    _message += separator;
                                }
                            }

                            invalid.forEach(function (_ref, index) {
                                var key = _ref.key,
                                    value = _ref.value,
                                    allowed = _ref.allowed;
                                _message += key + " \"" + value + "\" contains invalid characters! (allowed: " + allowed + ")" + (index !== invalid.length - 1 ? separator : '');
                            });
                            loggingService.error(_message);
                            configService.setConfig({
                                active: false
                            });
                        }
                    };

                    _proto.setUserContext = function setUserContext(userContext) {
                        var configService = this.serviceFactory.getService(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.CONFIG_SERVICE);
                        configService.setUserContext(userContext);
                    };

                    _proto.setCustomContext = function setCustomContext(customContext) {
                        var configService = this.serviceFactory.getService(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.CONFIG_SERVICE);
                        configService.setCustomContext(customContext);
                    };

                    _proto.addLabels = function addLabels(labels) {
                        var configService = this.serviceFactory.getService(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.CONFIG_SERVICE);
                        configService.addLabels(labels);
                    };

                    _proto.setInitialPageLoadName = function setInitialPageLoadName(name) {
                        var configService = this.serviceFactory.getService(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.CONFIG_SERVICE);
                        configService.setConfig({
                            pageLoadTransactionName: name
                        });
                    };

                    _proto.startTransaction = function startTransaction(name, type, options) {
                        if (this.isEnabled()) {
                            var transactionService = this.serviceFactory.getService(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.TRANSACTION_SERVICE);
                            return transactionService.startTransaction(name, type, options);
                        }
                    };

                    _proto.startSpan = function startSpan(name, type, options) {
                        if (this.isEnabled()) {
                            var transactionService = this.serviceFactory.getService(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.TRANSACTION_SERVICE);
                            return transactionService.startSpan(name, type, options);
                        }
                    };

                    _proto.getCurrentTransaction = function getCurrentTransaction() {
                        if (this.isEnabled()) {
                            var transactionService = this.serviceFactory.getService(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.TRANSACTION_SERVICE);
                            return transactionService.getCurrentTransaction();
                        }
                    };

                    _proto.captureError = function captureError(error) {
                        if (this.isEnabled()) {
                            var errorLogging = this.serviceFactory.getService(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.ERROR_LOGGING);
                            return errorLogging.logError(error);
                        }
                    };

                    _proto.addFilter = function addFilter(fn) {
                        var configService = this.serviceFactory.getService(_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_0__.CONFIG_SERVICE);
                        configService.addFilter(fn);
                    };

                    return ApmBase;
                }();



                /***/ }),

            /***/ "../../node_modules/error-stack-parser/error-stack-parser.js":
            /*!*******************************************************************!*\
  !*** ../../node_modules/error-stack-parser/error-stack-parser.js ***!
  \*******************************************************************/
            /***/ (function(module, exports, __webpack_require__) {

                var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(root, factory) {
                    'use strict';
                    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.

                    /* istanbul ignore next */
                    if (true) {
                        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! stackframe */ "../../node_modules/stackframe/stackframe.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
                            __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
                                (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
                        __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
                    } else {}
                }(this, function ErrorStackParser(StackFrame) {
                    'use strict';

                    var FIREFOX_SAFARI_STACK_REGEXP = /(^|@)\S+\:\d+/;
                    var CHROME_IE_STACK_REGEXP = /^\s*at .*(\S+\:\d+|\(native\))/m;
                    var SAFARI_NATIVE_CODE_REGEXP = /^(eval@)?(\[native code\])?$/;

                    function _map(array, fn, thisArg) {
                        if (typeof Array.prototype.map === 'function') {
                            return array.map(fn, thisArg);
                        } else {
                            var output = new Array(array.length);
                            for (var i = 0; i < array.length; i++) {
                                output[i] = fn.call(thisArg, array[i]);
                            }
                            return output;
                        }
                    }

                    function _filter(array, fn, thisArg) {
                        if (typeof Array.prototype.filter === 'function') {
                            return array.filter(fn, thisArg);
                        } else {
                            var output = [];
                            for (var i = 0; i < array.length; i++) {
                                if (fn.call(thisArg, array[i])) {
                                    output.push(array[i]);
                                }
                            }
                            return output;
                        }
                    }

                    function _indexOf(array, target) {
                        if (typeof Array.prototype.indexOf === 'function') {
                            return array.indexOf(target);
                        } else {
                            for (var i = 0; i < array.length; i++) {
                                if (array[i] === target) {
                                    return i;
                                }
                            }
                            return -1;
                        }
                    }

                    return {
                        /**
                         * Given an Error object, extract the most information from it.
                         *
                         * @param {Error} error object
                         * @return {Array} of StackFrames
                         */
                        parse: function ErrorStackParser$$parse(error) {
                            if (typeof error.stacktrace !== 'undefined' || typeof error['opera#sourceloc'] !== 'undefined') {
                                return this.parseOpera(error);
                            } else if (error.stack && error.stack.match(CHROME_IE_STACK_REGEXP)) {
                                return this.parseV8OrIE(error);
                            } else if (error.stack) {
                                return this.parseFFOrSafari(error);
                            } else {
                                throw new Error('Cannot parse given Error object');
                            }
                        },

                        // Separate line and column numbers from a string of the form: (URI:Line:Column)
                        extractLocation: function ErrorStackParser$$extractLocation(urlLike) {
                            // Fail-fast but return locations like "(native)"
                            if (urlLike.indexOf(':') === -1) {
                                return [urlLike];
                            }

                            var regExp = /(.+?)(?:\:(\d+))?(?:\:(\d+))?$/;
                            var parts = regExp.exec(urlLike.replace(/[\(\)]/g, ''));
                            return [parts[1], parts[2] || undefined, parts[3] || undefined];
                        },

                        parseV8OrIE: function ErrorStackParser$$parseV8OrIE(error) {
                            var filtered = _filter(error.stack.split('\n'), function(line) {
                                return !!line.match(CHROME_IE_STACK_REGEXP);
                            }, this);

                            return _map(filtered, function(line) {
                                if (line.indexOf('(eval ') > -1) {
                                    // Throw away eval information until we implement stacktrace.js/stackframe#8
                                    line = line.replace(/eval code/g, 'eval').replace(/(\(eval at [^\()]*)|(\)\,.*$)/g, '');
                                }
                                var tokens = line.replace(/^\s+/, '').replace(/\(eval code/g, '(').split(/\s+/).slice(1);
                                var locationParts = this.extractLocation(tokens.pop());
                                var functionName = tokens.join(' ') || undefined;
                                var fileName = _indexOf(['eval', '<anonymous>'], locationParts[0]) > -1 ? undefined : locationParts[0];

                                return new StackFrame(functionName, undefined, fileName, locationParts[1], locationParts[2], line);
                            }, this);
                        },

                        parseFFOrSafari: function ErrorStackParser$$parseFFOrSafari(error) {
                            var filtered = _filter(error.stack.split('\n'), function(line) {
                                return !line.match(SAFARI_NATIVE_CODE_REGEXP);
                            }, this);

                            return _map(filtered, function(line) {
                                // Throw away eval information until we implement stacktrace.js/stackframe#8
                                if (line.indexOf(' > eval') > -1) {
                                    line = line.replace(/ line (\d+)(?: > eval line \d+)* > eval\:\d+\:\d+/g, ':$1');
                                }

                                if (line.indexOf('@') === -1 && line.indexOf(':') === -1) {
                                    // Safari eval frames only have function names and nothing else
                                    return new StackFrame(line);
                                } else {
                                    var tokens = line.split('@');
                                    var locationParts = this.extractLocation(tokens.pop());
                                    var functionName = tokens.join('@') || undefined;
                                    return new StackFrame(functionName,
                                        undefined,
                                        locationParts[0],
                                        locationParts[1],
                                        locationParts[2],
                                        line);
                                }
                            }, this);
                        },

                        parseOpera: function ErrorStackParser$$parseOpera(e) {
                            if (!e.stacktrace || (e.message.indexOf('\n') > -1 &&
                                e.message.split('\n').length > e.stacktrace.split('\n').length)) {
                                return this.parseOpera9(e);
                            } else if (!e.stack) {
                                return this.parseOpera10(e);
                            } else {
                                return this.parseOpera11(e);
                            }
                        },

                        parseOpera9: function ErrorStackParser$$parseOpera9(e) {
                            var lineRE = /Line (\d+).*script (?:in )?(\S+)/i;
                            var lines = e.message.split('\n');
                            var result = [];

                            for (var i = 2, len = lines.length; i < len; i += 2) {
                                var match = lineRE.exec(lines[i]);
                                if (match) {
                                    result.push(new StackFrame(undefined, undefined, match[2], match[1], undefined, lines[i]));
                                }
                            }

                            return result;
                        },

                        parseOpera10: function ErrorStackParser$$parseOpera10(e) {
                            var lineRE = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;
                            var lines = e.stacktrace.split('\n');
                            var result = [];

                            for (var i = 0, len = lines.length; i < len; i += 2) {
                                var match = lineRE.exec(lines[i]);
                                if (match) {
                                    result.push(
                                        new StackFrame(
                                            match[3] || undefined,
                                            undefined,
                                            match[2],
                                            match[1],
                                            undefined,
                                            lines[i]
                                        )
                                    );
                                }
                            }

                            return result;
                        },

                        // Opera 10.65+ Error.stack very similar to FF/Safari
                        parseOpera11: function ErrorStackParser$$parseOpera11(error) {
                            var filtered = _filter(error.stack.split('\n'), function(line) {
                                return !!line.match(FIREFOX_SAFARI_STACK_REGEXP) && !line.match(/^Error created at/);
                            }, this);

                            return _map(filtered, function(line) {
                                var tokens = line.split('@');
                                var locationParts = this.extractLocation(tokens.pop());
                                var functionCall = (tokens.shift() || '');
                                var functionName = functionCall
                                    .replace(/<anonymous function(: (\w+))?>/, '$2')
                                    .replace(/\([^\)]*\)/g, '') || undefined;
                                var argsRaw;
                                if (functionCall.match(/\(([^\)]*)\)/)) {
                                    argsRaw = functionCall.replace(/^[^\(]+\(([^\)]*)\)$/, '$1');
                                }
                                var args = (argsRaw === undefined || argsRaw === '[arguments not available]') ?
                                    undefined : argsRaw.split(',');
                                return new StackFrame(
                                    functionName,
                                    args,
                                    locationParts[0],
                                    locationParts[1],
                                    locationParts[2],
                                    line);
                            }, this);
                        }
                    };
                }));



                /***/ }),

            /***/ "../../node_modules/opentracing/lib/constants.js":
            /*!*******************************************************!*\
  !*** ../../node_modules/opentracing/lib/constants.js ***!
  \*******************************************************/
            /***/ (function(__unused_webpack_module, exports) {

                "use strict";

                Object.defineProperty(exports, "__esModule", ({ value: true }));
                /**
                 * The FORMAT_BINARY format represents SpanContexts in an opaque binary
                 * carrier.
                 *
                 * Tracer.inject() will set the buffer field to an Array-like (Array,
                 * ArrayBuffer, or TypedBuffer) object containing the injected binary data.
                 * Any valid Object can be used as long as the buffer field of the object
                 * can be set.
                 *
                 * Tracer.extract() will look for `carrier.buffer`, and that field is
                 * expected to be an Array-like object (Array, ArrayBuffer, or
                 * TypedBuffer).
                 */
                exports.FORMAT_BINARY = 'binary';
                /**
                 * The FORMAT_TEXT_MAP format represents SpanContexts using a
                 * string->string map (backed by a Javascript Object) as a carrier.
                 *
                 * NOTE: Unlike FORMAT_HTTP_HEADERS, FORMAT_TEXT_MAP places no restrictions
                 * on the characters used in either the keys or the values of the map
                 * entries.
                 *
                 * The FORMAT_TEXT_MAP carrier map may contain unrelated data (e.g.,
                 * arbitrary gRPC metadata); as such, the Tracer implementation should use
                 * a prefix or other convention to distinguish Tracer-specific key:value
                 * pairs.
                 */
                exports.FORMAT_TEXT_MAP = 'text_map';
                /**
                 * The FORMAT_HTTP_HEADERS format represents SpanContexts using a
                 * character-restricted string->string map (backed by a Javascript Object)
                 * as a carrier.
                 *
                 * Keys and values in the FORMAT_HTTP_HEADERS carrier must be suitable for
                 * use as HTTP headers (without modification or further escaping). That is,
                 * the keys have a greatly restricted character set, casing for the keys
                 * may not be preserved by various intermediaries, and the values should be
                 * URL-escaped.
                 *
                 * The FORMAT_HTTP_HEADERS carrier map may contain unrelated data (e.g.,
                 * arbitrary HTTP headers); as such, the Tracer implementation should use a
                 * prefix or other convention to distinguish Tracer-specific key:value
                 * pairs.
                 */
                exports.FORMAT_HTTP_HEADERS = 'http_headers';
                /**
                 * A Span may be the "child of" a parent Span. In a â€œchild ofâ€ reference,
                 * the parent Span depends on the child Span in some capacity.
                 *
                 * See more about reference types at https://github.com/opentracing/specification
                 */
                exports.REFERENCE_CHILD_OF = 'child_of';
                /**
                 * Some parent Spans do not depend in any way on the result of their child
                 * Spans. In these cases, we say merely that the child Span â€œfollows fromâ€
                 * the parent Span in a causal sense.
                 *
                 * See more about reference types at https://github.com/opentracing/specification
                 */
                exports.REFERENCE_FOLLOWS_FROM = 'follows_from';
//# sourceMappingURL=constants.js.map

                /***/ }),

            /***/ "../../node_modules/opentracing/lib/functions.js":
            /*!*******************************************************!*\
  !*** ../../node_modules/opentracing/lib/functions.js ***!
  \*******************************************************/
            /***/ (function(__unused_webpack_module, exports, __webpack_require__) {

                "use strict";

                Object.defineProperty(exports, "__esModule", ({ value: true }));
                var Constants = __webpack_require__(/*! ./constants */ "../../node_modules/opentracing/lib/constants.js");
                var reference_1 = __webpack_require__(/*! ./reference */ "../../node_modules/opentracing/lib/reference.js");
                var span_1 = __webpack_require__(/*! ./span */ "../../node_modules/opentracing/lib/span.js");
                /**
                 * Return a new REFERENCE_CHILD_OF reference.
                 *
                 * @param {SpanContext} spanContext - the parent SpanContext instance to
                 *        reference.
                 * @return a REFERENCE_CHILD_OF reference pointing to `spanContext`
                 */
                function childOf(spanContext) {
                    // Allow the user to pass a Span instead of a SpanContext
                    if (spanContext instanceof span_1.default) {
                        spanContext = spanContext.context();
                    }
                    return new reference_1.default(Constants.REFERENCE_CHILD_OF, spanContext);
                }
                exports.childOf = childOf;
                /**
                 * Return a new REFERENCE_FOLLOWS_FROM reference.
                 *
                 * @param {SpanContext} spanContext - the parent SpanContext instance to
                 *        reference.
                 * @return a REFERENCE_FOLLOWS_FROM reference pointing to `spanContext`
                 */
                function followsFrom(spanContext) {
                    // Allow the user to pass a Span instead of a SpanContext
                    if (spanContext instanceof span_1.default) {
                        spanContext = spanContext.context();
                    }
                    return new reference_1.default(Constants.REFERENCE_FOLLOWS_FROM, spanContext);
                }
                exports.followsFrom = followsFrom;
//# sourceMappingURL=functions.js.map

                /***/ }),

            /***/ "../../node_modules/opentracing/lib/noop.js":
            /*!**************************************************!*\
  !*** ../../node_modules/opentracing/lib/noop.js ***!
  \**************************************************/
            /***/ (function(__unused_webpack_module, exports, __webpack_require__) {

                "use strict";

                Object.defineProperty(exports, "__esModule", ({ value: true }));
                var span_1 = __webpack_require__(/*! ./span */ "../../node_modules/opentracing/lib/span.js");
                var span_context_1 = __webpack_require__(/*! ./span_context */ "../../node_modules/opentracing/lib/span_context.js");
                var tracer_1 = __webpack_require__(/*! ./tracer */ "../../node_modules/opentracing/lib/tracer.js");
                exports.tracer = null;
                exports.spanContext = null;
                exports.span = null;
// Deferred initialization to avoid a dependency cycle where Tracer depends on
// Span which depends on the noop tracer.
                function initialize() {
                    exports.tracer = new tracer_1.default();
                    exports.span = new span_1.default();
                    exports.spanContext = new span_context_1.default();
                }
                exports.initialize = initialize;
//# sourceMappingURL=noop.js.map

                /***/ }),

            /***/ "../../node_modules/opentracing/lib/reference.js":
            /*!*******************************************************!*\
  !*** ../../node_modules/opentracing/lib/reference.js ***!
  \*******************************************************/
            /***/ (function(__unused_webpack_module, exports, __webpack_require__) {

                "use strict";

                Object.defineProperty(exports, "__esModule", ({ value: true }));
                var span_1 = __webpack_require__(/*! ./span */ "../../node_modules/opentracing/lib/span.js");
                /**
                 * Reference pairs a reference type constant (e.g., REFERENCE_CHILD_OF or
                 * REFERENCE_FOLLOWS_FROM) with the SpanContext it points to.
                 *
                 * See the exported childOf() and followsFrom() functions at the package level.
                 */
                var Reference = /** @class */ (function () {
                    /**
                     * Initialize a new Reference instance.
                     *
                     * @param {string} type - the Reference type constant (e.g.,
                     *        REFERENCE_CHILD_OF or REFERENCE_FOLLOWS_FROM).
                     * @param {SpanContext} referencedContext - the SpanContext being referred
                     *        to. As a convenience, a Span instance may be passed in instead
                     *        (in which case its .context() is used here).
                     */
                    function Reference(type, referencedContext) {
                        this._type = type;
                        this._referencedContext = (referencedContext instanceof span_1.default ?
                            referencedContext.context() :
                            referencedContext);
                    }
                    /**
                     * @return {string} The Reference type (e.g., REFERENCE_CHILD_OF or
                     *         REFERENCE_FOLLOWS_FROM).
                     */
                    Reference.prototype.type = function () {
                        return this._type;
                    };
                    /**
                     * @return {SpanContext} The SpanContext being referred to (e.g., the
                     *         parent in a REFERENCE_CHILD_OF Reference).
                     */
                    Reference.prototype.referencedContext = function () {
                        return this._referencedContext;
                    };
                    return Reference;
                }());
                exports.default = Reference;
//# sourceMappingURL=reference.js.map

                /***/ }),

            /***/ "../../node_modules/opentracing/lib/span.js":
            /*!**************************************************!*\
  !*** ../../node_modules/opentracing/lib/span.js ***!
  \**************************************************/
            /***/ (function(__unused_webpack_module, exports, __webpack_require__) {

                "use strict";

                Object.defineProperty(exports, "__esModule", ({ value: true }));
                var noop = __webpack_require__(/*! ./noop */ "../../node_modules/opentracing/lib/noop.js");
                /**
                 * Span represents a logical unit of work as part of a broader Trace. Examples
                 * of span might include remote procedure calls or a in-process function calls
                 * to sub-components. A Trace has a single, top-level "root" Span that in turn
                 * may have zero or more child Spans, which in turn may have children.
                 */
                var Span = /** @class */ (function () {
                    function Span() {
                    }
                    // ---------------------------------------------------------------------- //
                    // OpenTracing API methods
                    // ---------------------------------------------------------------------- //
                    /**
                     * Returns the SpanContext object associated with this Span.
                     *
                     * @return {SpanContext}
                     */
                    Span.prototype.context = function () {
                        return this._context();
                    };
                    /**
                     * Returns the Tracer object used to create this Span.
                     *
                     * @return {Tracer}
                     */
                    Span.prototype.tracer = function () {
                        return this._tracer();
                    };
                    /**
                     * Sets the string name for the logical operation this span represents.
                     *
                     * @param {string} name
                     */
                    Span.prototype.setOperationName = function (name) {
                        this._setOperationName(name);
                        return this;
                    };
                    /**
                     * Sets a key:value pair on this Span that also propagates to future
                     * children of the associated Span.
                     *
                     * setBaggageItem() enables powerful functionality given a full-stack
                     * opentracing integration (e.g., arbitrary application data from a web
                     * client can make it, transparently, all the way into the depths of a
                     * storage system), and with it some powerful costs: use this feature with
                     * care.
                     *
                     * IMPORTANT NOTE #1: setBaggageItem() will only propagate baggage items to
                     * *future* causal descendants of the associated Span.
                     *
                     * IMPORTANT NOTE #2: Use this thoughtfully and with care. Every key and
                     * value is copied into every local *and remote* child of the associated
                     * Span, and that can add up to a lot of network and cpu overhead.
                     *
                     * @param {string} key
                     * @param {string} value
                     */
                    Span.prototype.setBaggageItem = function (key, value) {
                        this._setBaggageItem(key, value);
                        return this;
                    };
                    /**
                     * Returns the value for a baggage item given its key.
                     *
                     * @param  {string} key
                     *         The key for the given trace attribute.
                     * @return {string}
                     *         String value for the given key, or undefined if the key does not
                     *         correspond to a set trace attribute.
                     */
                    Span.prototype.getBaggageItem = function (key) {
                        return this._getBaggageItem(key);
                    };
                    /**
                     * Adds a single tag to the span.  See `addTags()` for details.
                     *
                     * @param {string} key
                     * @param {any} value
                     */
                    Span.prototype.setTag = function (key, value) {
                        // NOTE: the call is normalized to a call to _addTags()
                        this._addTags((_a = {}, _a[key] = value, _a));
                        return this;
                        var _a;
                    };
                    /**
                     * Adds the given key value pairs to the set of span tags.
                     *
                     * Multiple calls to addTags() results in the tags being the superset of
                     * all calls.
                     *
                     * The behavior of setting the same key multiple times on the same span
                     * is undefined.
                     *
                     * The supported type of the values is implementation-dependent.
                     * Implementations are expected to safely handle all types of values but
                     * may choose to ignore unrecognized / unhandle-able values (e.g. objects
                     * with cyclic references, function objects).
                     *
                     * @return {[type]} [description]
                     */
                    Span.prototype.addTags = function (keyValueMap) {
                        this._addTags(keyValueMap);
                        return this;
                    };
                    /**
                     * Add a log record to this Span, optionally at a user-provided timestamp.
                     *
                     * For example:
                     *
                     *     span.log({
                     *         size: rpc.size(),  // numeric value
                     *         URI: rpc.URI(),  // string value
                     *         payload: rpc.payload(),  // Object value
                     *         "keys can be arbitrary strings": rpc.foo(),
                     *     });
                     *
                     *     span.log({
                     *         "error.description": someError.description(),
                     *     }, someError.timestampMillis());
                     *
                     * @param {object} keyValuePairs
                     *        An object mapping string keys to arbitrary value types. All
                     *        Tracer implementations should support bool, string, and numeric
                     *        value types, and some may also support Object values.
                     * @param {number} timestamp
                     *        An optional parameter specifying the timestamp in milliseconds
                     *        since the Unix epoch. Fractional values are allowed so that
                     *        timestamps with sub-millisecond accuracy can be represented. If
                     *        not specified, the implementation is expected to use its notion
                     *        of the current time of the call.
                     */
                    Span.prototype.log = function (keyValuePairs, timestamp) {
                        this._log(keyValuePairs, timestamp);
                        return this;
                    };
                    /**
                     * DEPRECATED
                     */
                    Span.prototype.logEvent = function (eventName, payload) {
                        return this._log({ event: eventName, payload: payload });
                    };
                    /**
                     * Sets the end timestamp and finalizes Span state.
                     *
                     * With the exception of calls to Span.context() (which are always allowed),
                     * finish() must be the last call made to any span instance, and to do
                     * otherwise leads to undefined behavior.
                     *
                     * @param  {number} finishTime
                     *         Optional finish time in milliseconds as a Unix timestamp. Decimal
                     *         values are supported for timestamps with sub-millisecond accuracy.
                     *         If not specified, the current time (as defined by the
                     *         implementation) will be used.
                     */
                    Span.prototype.finish = function (finishTime) {
                        this._finish(finishTime);
                        // Do not return `this`. The Span generally should not be used after it
                        // is finished so chaining is not desired in this context.
                    };
                    // ---------------------------------------------------------------------- //
                    // Derived classes can choose to implement the below
                    // ---------------------------------------------------------------------- //
                    // By default returns a no-op SpanContext.
                    Span.prototype._context = function () {
                        return noop.spanContext;
                    };
                    // By default returns a no-op tracer.
                    //
                    // The base class could store the tracer that created it, but it does not
                    // in order to ensure the no-op span implementation has zero members,
                    // which allows V8 to aggressively optimize calls to such objects.
                    Span.prototype._tracer = function () {
                        return noop.tracer;
                    };
                    // By default does nothing
                    Span.prototype._setOperationName = function (name) {
                    };
                    // By default does nothing
                    Span.prototype._setBaggageItem = function (key, value) {
                    };
                    // By default does nothing
                    Span.prototype._getBaggageItem = function (key) {
                        return undefined;
                    };
                    // By default does nothing
                    //
                    // NOTE: both setTag() and addTags() map to this function. keyValuePairs
                    // will always be an associative array.
                    Span.prototype._addTags = function (keyValuePairs) {
                    };
                    // By default does nothing
                    Span.prototype._log = function (keyValuePairs, timestamp) {
                    };
                    // By default does nothing
                    //
                    // finishTime is expected to be either a number or undefined.
                    Span.prototype._finish = function (finishTime) {
                    };
                    return Span;
                }());
                exports.Span = Span;
                exports.default = Span;
//# sourceMappingURL=span.js.map

                /***/ }),

            /***/ "../../node_modules/opentracing/lib/span_context.js":
            /*!**********************************************************!*\
  !*** ../../node_modules/opentracing/lib/span_context.js ***!
  \**********************************************************/
            /***/ (function(__unused_webpack_module, exports) {

                "use strict";

                Object.defineProperty(exports, "__esModule", ({ value: true }));
                /**
                 * SpanContext represents Span state that must propagate to descendant Spans
                 * and across process boundaries.
                 *
                 * SpanContext is logically divided into two pieces: the user-level "Baggage"
                 * (see setBaggageItem and getBaggageItem) that propagates across Span
                 * boundaries and any Tracer-implementation-specific fields that are needed to
                 * identify or otherwise contextualize the associated Span instance (e.g., a
                 * <trace_id, span_id, sampled> tuple).
                 */
                var SpanContext = /** @class */ (function () {
                    function SpanContext() {
                    }
                    return SpanContext;
                }());
                exports.SpanContext = SpanContext;
                exports.default = SpanContext;
//# sourceMappingURL=span_context.js.map

                /***/ }),

            /***/ "../../node_modules/opentracing/lib/tracer.js":
            /*!****************************************************!*\
  !*** ../../node_modules/opentracing/lib/tracer.js ***!
  \****************************************************/
            /***/ (function(__unused_webpack_module, exports, __webpack_require__) {

                "use strict";

                Object.defineProperty(exports, "__esModule", ({ value: true }));
                var Functions = __webpack_require__(/*! ./functions */ "../../node_modules/opentracing/lib/functions.js");
                var Noop = __webpack_require__(/*! ./noop */ "../../node_modules/opentracing/lib/noop.js");
                var span_1 = __webpack_require__(/*! ./span */ "../../node_modules/opentracing/lib/span.js");
                /**
                 * Tracer is the entry-point between the instrumentation API and the tracing
                 * implementation.
                 *
                 * The default object acts as a no-op implementation.
                 *
                 * Note to implementators: derived classes can choose to directly implement the
                 * methods in the "OpenTracing API methods" section, or optionally the subset of
                 * underscore-prefixed methods to pick up the argument checking and handling
                 * automatically from the base class.
                 */
                var Tracer = /** @class */ (function () {
                    function Tracer() {
                    }
                    // ---------------------------------------------------------------------- //
                    // OpenTracing API methods
                    // ---------------------------------------------------------------------- //
                    /**
                     * Starts and returns a new Span representing a logical unit of work.
                     *
                     * For example:
                     *
                     *     // Start a new (parentless) root Span:
                     *     var parent = Tracer.startSpan('DoWork');
                     *
                     *     // Start a new (child) Span:
                     *     var child = Tracer.startSpan('load-from-db', {
                     *         childOf: parent.context(),
                     *     });
                     *
                     *     // Start a new async (FollowsFrom) Span:
                     *     var child = Tracer.startSpan('async-cache-write', {
                     *         references: [
                     *             opentracing.followsFrom(parent.context())
                     *         ],
                     *     });
                     *
                     * @param {string} name - the name of the operation (REQUIRED).
                     * @param {SpanOptions} [options] - options for the newly created span.
                     * @return {Span} - a new Span object.
                     */
                    Tracer.prototype.startSpan = function (name, options) {
                        if (options === void 0) { options = {}; }
                        // Convert options.childOf to fields.references as needed.
                        if (options.childOf) {
                            // Convert from a Span or a SpanContext into a Reference.
                            var childOf = Functions.childOf(options.childOf);
                            if (options.references) {
                                options.references.push(childOf);
                            }
                            else {
                                options.references = [childOf];
                            }
                            delete (options.childOf);
                        }
                        return this._startSpan(name, options);
                    };
                    /**
                     * Injects the given SpanContext instance for cross-process propagation
                     * within `carrier`. The expected type of `carrier` depends on the value of
                     * `format.
                     *
                     * OpenTracing defines a common set of `format` values (see
                     * FORMAT_TEXT_MAP, FORMAT_HTTP_HEADERS, and FORMAT_BINARY), and each has
                     * an expected carrier type.
                     *
                     * Consider this pseudocode example:
                     *
                     *     var clientSpan = ...;
                     *     ...
                     *     // Inject clientSpan into a text carrier.
                     *     var headersCarrier = {};
                     *     Tracer.inject(clientSpan.context(), Tracer.FORMAT_HTTP_HEADERS, headersCarrier);
                     *     // Incorporate the textCarrier into the outbound HTTP request header
                     *     // map.
                     *     Object.assign(outboundHTTPReq.headers, headersCarrier);
                     *     // ... send the httpReq
                     *
                     * @param  {SpanContext} spanContext - the SpanContext to inject into the
                     *         carrier object. As a convenience, a Span instance may be passed
                     *         in instead (in which case its .context() is used for the
                     *         inject()).
                     * @param  {string} format - the format of the carrier.
                     * @param  {any} carrier - see the documentation for the chosen `format`
                     *         for a description of the carrier object.
                     */
                    Tracer.prototype.inject = function (spanContext, format, carrier) {
                        // Allow the user to pass a Span instead of a SpanContext
                        if (spanContext instanceof span_1.default) {
                            spanContext = spanContext.context();
                        }
                        return this._inject(spanContext, format, carrier);
                    };
                    /**
                     * Returns a SpanContext instance extracted from `carrier` in the given
                     * `format`.
                     *
                     * OpenTracing defines a common set of `format` values (see
                     * FORMAT_TEXT_MAP, FORMAT_HTTP_HEADERS, and FORMAT_BINARY), and each has
                     * an expected carrier type.
                     *
                     * Consider this pseudocode example:
                     *
                     *     // Use the inbound HTTP request's headers as a text map carrier.
                     *     var headersCarrier = inboundHTTPReq.headers;
                     *     var wireCtx = Tracer.extract(Tracer.FORMAT_HTTP_HEADERS, headersCarrier);
                     *     var serverSpan = Tracer.startSpan('...', { childOf : wireCtx });
                     *
                     * @param  {string} format - the format of the carrier.
                     * @param  {any} carrier - the type of the carrier object is determined by
                     *         the format.
                     * @return {SpanContext}
                     *         The extracted SpanContext, or null if no such SpanContext could
                     *         be found in `carrier`
                     */
                    Tracer.prototype.extract = function (format, carrier) {
                        return this._extract(format, carrier);
                    };
                    // ---------------------------------------------------------------------- //
                    // Derived classes can choose to implement the below
                    // ---------------------------------------------------------------------- //
                    // NOTE: the input to this method is *always* an associative array. The
                    // public-facing startSpan() method normalizes the arguments so that
                    // all N implementations do not need to worry about variations in the call
                    // signature.
                    //
                    // The default behavior returns a no-op span.
                    Tracer.prototype._startSpan = function (name, fields) {
                        return Noop.span;
                    };
                    // The default behavior is a no-op.
                    Tracer.prototype._inject = function (spanContext, format, carrier) {
                    };
                    // The default behavior is to return a no-op SpanContext.
                    Tracer.prototype._extract = function (format, carrier) {
                        return Noop.spanContext;
                    };
                    return Tracer;
                }());
                exports.Tracer = Tracer;
                exports.default = Tracer;
//# sourceMappingURL=tracer.js.map

                /***/ }),

            /***/ "../../node_modules/promise-polyfill/src/finally.js":
            /*!**********************************************************!*\
  !*** ../../node_modules/promise-polyfill/src/finally.js ***!
  \**********************************************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /**
                 * @this {Promise}
                 */
                function finallyConstructor(callback) {
                    var constructor = this.constructor;
                    return this.then(
                        function(value) {
                            // @ts-ignore
                            return constructor.resolve(callback()).then(function() {
                                return value;
                            });
                        },
                        function(reason) {
                            // @ts-ignore
                            return constructor.resolve(callback()).then(function() {
                                // @ts-ignore
                                return constructor.reject(reason);
                            });
                        }
                    );
                }

                /* harmony default export */ __webpack_exports__["default"] = (finallyConstructor);


                /***/ }),

            /***/ "../../node_modules/promise-polyfill/src/index.js":
            /*!********************************************************!*\
  !*** ../../node_modules/promise-polyfill/src/index.js ***!
  \********************************************************/
            /***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

                "use strict";
                __webpack_require__.r(__webpack_exports__);
                /* harmony import */ var _finally__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./finally */ "../../node_modules/promise-polyfill/src/finally.js");


// Store setTimeout reference so promise-polyfill will be unaffected by
// other code modifying setTimeout (like sinon.useFakeTimers())
                var setTimeoutFunc = setTimeout;

                function isArray(x) {
                    return Boolean(x && typeof x.length !== 'undefined');
                }

                function noop() {}

// Polyfill for Function.prototype.bind
                function bind(fn, thisArg) {
                    return function() {
                        fn.apply(thisArg, arguments);
                    };
                }

                /**
                 * @constructor
                 * @param {Function} fn
                 */
                function Promise(fn) {
                    if (!(this instanceof Promise))
                        throw new TypeError('Promises must be constructed via new');
                    if (typeof fn !== 'function') throw new TypeError('not a function');
                    /** @type {!number} */
                    this._state = 0;
                    /** @type {!boolean} */
                    this._handled = false;
                    /** @type {Promise|undefined} */
                    this._value = undefined;
                    /** @type {!Array<!Function>} */
                    this._deferreds = [];

                    doResolve(fn, this);
                }

                function handle(self, deferred) {
                    while (self._state === 3) {
                        self = self._value;
                    }
                    if (self._state === 0) {
                        self._deferreds.push(deferred);
                        return;
                    }
                    self._handled = true;
                    Promise._immediateFn(function() {
                        var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
                        if (cb === null) {
                            (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
                            return;
                        }
                        var ret;
                        try {
                            ret = cb(self._value);
                        } catch (e) {
                            reject(deferred.promise, e);
                            return;
                        }
                        resolve(deferred.promise, ret);
                    });
                }

                function resolve(self, newValue) {
                    try {
                        // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
                        if (newValue === self)
                            throw new TypeError('A promise cannot be resolved with itself.');
                        if (
                            newValue &&
                            (typeof newValue === 'object' || typeof newValue === 'function')
                        ) {
                            var then = newValue.then;
                            if (newValue instanceof Promise) {
                                self._state = 3;
                                self._value = newValue;
                                finale(self);
                                return;
                            } else if (typeof then === 'function') {
                                doResolve(bind(then, newValue), self);
                                return;
                            }
                        }
                        self._state = 1;
                        self._value = newValue;
                        finale(self);
                    } catch (e) {
                        reject(self, e);
                    }
                }

                function reject(self, newValue) {
                    self._state = 2;
                    self._value = newValue;
                    finale(self);
                }

                function finale(self) {
                    if (self._state === 2 && self._deferreds.length === 0) {
                        Promise._immediateFn(function() {
                            if (!self._handled) {
                                Promise._unhandledRejectionFn(self._value);
                            }
                        });
                    }

                    for (var i = 0, len = self._deferreds.length; i < len; i++) {
                        handle(self, self._deferreds[i]);
                    }
                    self._deferreds = null;
                }

                /**
                 * @constructor
                 */
                function Handler(onFulfilled, onRejected, promise) {
                    this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
                    this.onRejected = typeof onRejected === 'function' ? onRejected : null;
                    this.promise = promise;
                }

                /**
                 * Take a potentially misbehaving resolver function and make sure
                 * onFulfilled and onRejected are only called once.
                 *
                 * Makes no guarantees about asynchrony.
                 */
                function doResolve(fn, self) {
                    var done = false;
                    try {
                        fn(
                            function(value) {
                                if (done) return;
                                done = true;
                                resolve(self, value);
                            },
                            function(reason) {
                                if (done) return;
                                done = true;
                                reject(self, reason);
                            }
                        );
                    } catch (ex) {
                        if (done) return;
                        done = true;
                        reject(self, ex);
                    }
                }

                Promise.prototype['catch'] = function(onRejected) {
                    return this.then(null, onRejected);
                };

                Promise.prototype.then = function(onFulfilled, onRejected) {
                    // @ts-ignore
                    var prom = new this.constructor(noop);

                    handle(this, new Handler(onFulfilled, onRejected, prom));
                    return prom;
                };

                Promise.prototype['finally'] = _finally__WEBPACK_IMPORTED_MODULE_0__.default;

                Promise.all = function(arr) {
                    return new Promise(function(resolve, reject) {
                        if (!isArray(arr)) {
                            return reject(new TypeError('Promise.all accepts an array'));
                        }

                        var args = Array.prototype.slice.call(arr);
                        if (args.length === 0) return resolve([]);
                        var remaining = args.length;

                        function res(i, val) {
                            try {
                                if (val && (typeof val === 'object' || typeof val === 'function')) {
                                    var then = val.then;
                                    if (typeof then === 'function') {
                                        then.call(
                                            val,
                                            function(val) {
                                                res(i, val);
                                            },
                                            reject
                                        );
                                        return;
                                    }
                                }
                                args[i] = val;
                                if (--remaining === 0) {
                                    resolve(args);
                                }
                            } catch (ex) {
                                reject(ex);
                            }
                        }

                        for (var i = 0; i < args.length; i++) {
                            res(i, args[i]);
                        }
                    });
                };

                Promise.resolve = function(value) {
                    if (value && typeof value === 'object' && value.constructor === Promise) {
                        return value;
                    }

                    return new Promise(function(resolve) {
                        resolve(value);
                    });
                };

                Promise.reject = function(value) {
                    return new Promise(function(resolve, reject) {
                        reject(value);
                    });
                };

                Promise.race = function(arr) {
                    return new Promise(function(resolve, reject) {
                        if (!isArray(arr)) {
                            return reject(new TypeError('Promise.race accepts an array'));
                        }

                        for (var i = 0, len = arr.length; i < len; i++) {
                            Promise.resolve(arr[i]).then(resolve, reject);
                        }
                    });
                };

// Use polyfill for setImmediate for performance gains
                Promise._immediateFn =
                    // @ts-ignore
                    (typeof setImmediate === 'function' &&
                        function(fn) {
                            // @ts-ignore
                            setImmediate(fn);
                        }) ||
                    function(fn) {
                        setTimeoutFunc(fn, 0);
                    };

                Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
                    if (typeof console !== 'undefined' && console) {
                        console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
                    }
                };

                /* harmony default export */ __webpack_exports__["default"] = (Promise);


                /***/ }),

            /***/ "../../node_modules/stackframe/stackframe.js":
            /*!***************************************************!*\
  !*** ../../node_modules/stackframe/stackframe.js ***!
  \***************************************************/
            /***/ (function(module, exports) {

                var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function (root, factory) {
                    'use strict';
                    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js, Rhino, and browsers.

                    /* istanbul ignore next */
                    if (true) {
                        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
                            __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
                                (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
                        __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
                    } else {}
                }(this, function () {
                    'use strict';
                    function _isNumber(n) {
                        return !isNaN(parseFloat(n)) && isFinite(n);
                    }

                    function StackFrame(functionName, args, fileName, lineNumber, columnNumber, source) {
                        if (functionName !== undefined) {
                            this.setFunctionName(functionName);
                        }
                        if (args !== undefined) {
                            this.setArgs(args);
                        }
                        if (fileName !== undefined) {
                            this.setFileName(fileName);
                        }
                        if (lineNumber !== undefined) {
                            this.setLineNumber(lineNumber);
                        }
                        if (columnNumber !== undefined) {
                            this.setColumnNumber(columnNumber);
                        }
                        if (source !== undefined) {
                            this.setSource(source);
                        }
                    }

                    StackFrame.prototype = {
                        getFunctionName: function () {
                            return this.functionName;
                        },
                        setFunctionName: function (v) {
                            this.functionName = String(v);
                        },

                        getArgs: function () {
                            return this.args;
                        },
                        setArgs: function (v) {
                            if (Object.prototype.toString.call(v) !== '[object Array]') {
                                throw new TypeError('Args must be an Array');
                            }
                            this.args = v;
                        },

                        // NOTE: Property name may be misleading as it includes the path,
                        // but it somewhat mirrors V8's JavaScriptStackTraceApi
                        // https://code.google.com/p/v8/wiki/JavaScriptStackTraceApi and Gecko's
                        // http://mxr.mozilla.org/mozilla-central/source/xpcom/base/nsIException.idl#14
                        getFileName: function () {
                            return this.fileName;
                        },
                        setFileName: function (v) {
                            this.fileName = String(v);
                        },

                        getLineNumber: function () {
                            return this.lineNumber;
                        },
                        setLineNumber: function (v) {
                            if (!_isNumber(v)) {
                                throw new TypeError('Line Number must be a Number');
                            }
                            this.lineNumber = Number(v);
                        },

                        getColumnNumber: function () {
                            return this.columnNumber;
                        },
                        setColumnNumber: function (v) {
                            if (!_isNumber(v)) {
                                throw new TypeError('Column Number must be a Number');
                            }
                            this.columnNumber = Number(v);
                        },

                        getSource: function () {
                            return this.source;
                        },
                        setSource: function (v) {
                            this.source = String(v);
                        },

                        toString: function() {
                            var functionName = this.getFunctionName() || '{anonymous}';
                            var args = '(' + (this.getArgs() || []).join(',') + ')';
                            var fileName = this.getFileName() ? ('@' + this.getFileName()) : '';
                            var lineNumber = _isNumber(this.getLineNumber()) ? (':' + this.getLineNumber()) : '';
                            var columnNumber = _isNumber(this.getColumnNumber()) ? (':' + this.getColumnNumber()) : '';
                            return functionName + args + fileName + lineNumber + columnNumber;
                        }
                    };

                    return StackFrame;
                }));


                /***/ })

            /******/ 	});
        /************************************************************************/
        /******/ 	// The module cache
        /******/ 	var __webpack_module_cache__ = {};
        /******/
        /******/ 	// The require function
        /******/ 	function __webpack_require__(moduleId) {
            /******/ 		// Check if module is in cache
            /******/ 		var cachedModule = __webpack_module_cache__[moduleId];
            /******/ 		if (cachedModule !== undefined) {
                /******/ 			return cachedModule.exports;
                /******/ 		}
            /******/ 		// Create a new module (and put it into the cache)
            /******/ 		var module = __webpack_module_cache__[moduleId] = {
                /******/ 			// no module.id needed
                /******/ 			// no module.loaded needed
                /******/ 			exports: {}
                /******/ 		};
            /******/
            /******/ 		// Execute the module function
            /******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
            /******/
            /******/ 		// Return the exports of the module
            /******/ 		return module.exports;
            /******/ 	}
        /******/
        /************************************************************************/
        /******/ 	/* webpack/runtime/compat get default export */
        /******/ 	!function() {
            /******/ 		// getDefaultExport function for compatibility with non-harmony modules
            /******/ 		__webpack_require__.n = function(module) {
                /******/ 			var getter = module && module.__esModule ?
                    /******/ 				function() { return module['default']; } :
                    /******/ 				function() { return module; };
                /******/ 			__webpack_require__.d(getter, { a: getter });
                /******/ 			return getter;
                /******/ 		};
            /******/ 	}();
        /******/
        /******/ 	/* webpack/runtime/define property getters */
        /******/ 	!function() {
            /******/ 		// define getter functions for harmony exports
            /******/ 		__webpack_require__.d = function(exports, definition) {
                /******/ 			for(var key in definition) {
                    /******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
                        /******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
                        /******/ 				}
                    /******/ 			}
                /******/ 		};
            /******/ 	}();
        /******/
        /******/ 	/* webpack/runtime/hasOwnProperty shorthand */
        /******/ 	!function() {
            /******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
            /******/ 	}();
        /******/
        /******/ 	/* webpack/runtime/make namespace object */
        /******/ 	!function() {
            /******/ 		// define __esModule on exports
            /******/ 		__webpack_require__.r = function(exports) {
                /******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
                    /******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
                    /******/ 			}
                /******/ 			Object.defineProperty(exports, '__esModule', { value: true });
                /******/ 		};
            /******/ 	}();
        /******/
        /************************************************************************/
        var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
        !function() {
            "use strict";
            /*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
            __webpack_require__.r(__webpack_exports__);
            /* harmony export */ __webpack_require__.d(__webpack_exports__, {
                /* harmony export */   "init": function() { return /* binding */ init; },
                /* harmony export */   "apmBase": function() { return /* binding */ apmBase; },
                /* harmony export */   "ApmBase": function() { return /* reexport safe */ _apm_base__WEBPACK_IMPORTED_MODULE_0__.default; },
                /* harmony export */   "apm": function() { return /* binding */ apmBase; }
                /* harmony export */ });
            /* harmony import */ var _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @elastic/apm-rum-core */ "../rum-core/dist/es/common/utils.js");
            /* harmony import */ var _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @elastic/apm-rum-core */ "../rum-core/dist/es/bootstrap.js");
            /* harmony import */ var _elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @elastic/apm-rum-core */ "../rum-core/dist/es/index.js");
            /* harmony import */ var _apm_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./apm-base */ "./src/apm-base.js");



            function getApmBase() {
                if (_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_1__.isBrowser && window.elasticApm) {
                    return window.elasticApm;
                }

                var enabled = (0,_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_2__.bootstrap)();
                var serviceFactory = (0,_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_3__.createServiceFactory)();
                var apmBase = new _apm_base__WEBPACK_IMPORTED_MODULE_0__.default(serviceFactory, !enabled);

                if (_elastic_apm_rum_core__WEBPACK_IMPORTED_MODULE_1__.isBrowser) {
                    window.elasticApm = apmBase;
                }

                return apmBase;
            }

            var apmBase = getApmBase();
            var init = apmBase.init.bind(apmBase);
            /* harmony default export */ __webpack_exports__["default"] = (init);

        }();
        /******/ 	return __webpack_exports__;
        /******/ })()
        ;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxhc3RpYy1hcG0tcnVtLnVtZC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovL1tuYW1lXS93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vW25hbWVdLy4uL3J1bS1jb3JlL2Rpc3QvZXMvYm9vdHN0cmFwLmpzIiwid2VicGFjazovL1tuYW1lXS8uLi9ydW0tY29yZS9kaXN0L2VzL2NvbW1vbi9hZnRlci1mcmFtZS5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vLi4vcnVtLWNvcmUvZGlzdC9lcy9jb21tb24vYXBtLXNlcnZlci5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vLi4vcnVtLWNvcmUvZGlzdC9lcy9jb21tb24vY29tcHJlc3MuanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4uL3J1bS1jb3JlL2Rpc3QvZXMvY29tbW9uL2NvbmZpZy1zZXJ2aWNlLmpzIiwid2VicGFjazovL1tuYW1lXS8uLi9ydW0tY29yZS9kaXN0L2VzL2NvbW1vbi9jb25zdGFudHMuanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4uL3J1bS1jb3JlL2Rpc3QvZXMvY29tbW9uL2NvbnRleHQuanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4uL3J1bS1jb3JlL2Rpc3QvZXMvY29tbW9uL2V2ZW50LWhhbmRsZXIuanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4uL3J1bS1jb3JlL2Rpc3QvZXMvY29tbW9uL2h0dHAvZmV0Y2guanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4uL3J1bS1jb3JlL2Rpc3QvZXMvY29tbW9uL2h0dHAvcmVzcG9uc2Utc3RhdHVzLmpzIiwid2VicGFjazovL1tuYW1lXS8uLi9ydW0tY29yZS9kaXN0L2VzL2NvbW1vbi9odHRwL3hoci5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vLi4vcnVtLWNvcmUvZGlzdC9lcy9jb21tb24vaW5zdHJ1bWVudC5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vLi4vcnVtLWNvcmUvZGlzdC9lcy9jb21tb24vbG9nZ2luZy1zZXJ2aWNlLmpzIiwid2VicGFjazovL1tuYW1lXS8uLi9ydW0tY29yZS9kaXN0L2VzL2NvbW1vbi9uZGpzb24uanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4uL3J1bS1jb3JlL2Rpc3QvZXMvY29tbW9uL29ic2VydmVycy9wYWdlLWNsaWNrcy5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vLi4vcnVtLWNvcmUvZGlzdC9lcy9jb21tb24vb2JzZXJ2ZXJzL3BhZ2UtdmlzaWJpbGl0eS5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vLi4vcnVtLWNvcmUvZGlzdC9lcy9jb21tb24vcGF0Y2hpbmcvZmV0Y2gtcGF0Y2guanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4uL3J1bS1jb3JlL2Rpc3QvZXMvY29tbW9uL3BhdGNoaW5nL2hpc3RvcnktcGF0Y2guanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4uL3J1bS1jb3JlL2Rpc3QvZXMvY29tbW9uL3BhdGNoaW5nL2luZGV4LmpzIiwid2VicGFjazovL1tuYW1lXS8uLi9ydW0tY29yZS9kaXN0L2VzL2NvbW1vbi9wYXRjaGluZy9wYXRjaC11dGlscy5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vLi4vcnVtLWNvcmUvZGlzdC9lcy9jb21tb24vcGF0Y2hpbmcveGhyLXBhdGNoLmpzIiwid2VicGFjazovL1tuYW1lXS8uLi9ydW0tY29yZS9kaXN0L2VzL2NvbW1vbi9wb2x5ZmlsbHMuanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4uL3J1bS1jb3JlL2Rpc3QvZXMvY29tbW9uL3F1ZXVlLmpzIiwid2VicGFjazovL1tuYW1lXS8uLi9ydW0tY29yZS9kaXN0L2VzL2NvbW1vbi9zZXJ2aWNlLWZhY3RvcnkuanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4uL3J1bS1jb3JlL2Rpc3QvZXMvY29tbW9uL3Rocm90dGxlLmpzIiwid2VicGFjazovL1tuYW1lXS8uLi9ydW0tY29yZS9kaXN0L2VzL2NvbW1vbi90cnVuY2F0ZS5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vLi4vcnVtLWNvcmUvZGlzdC9lcy9jb21tb24vdXJsLmpzIiwid2VicGFjazovL1tuYW1lXS8uLi9ydW0tY29yZS9kaXN0L2VzL2NvbW1vbi91dGlscy5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vLi4vcnVtLWNvcmUvZGlzdC9lcy9lcnJvci1sb2dnaW5nL2Vycm9yLWxvZ2dpbmcuanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4uL3J1bS1jb3JlL2Rpc3QvZXMvZXJyb3ItbG9nZ2luZy9pbmRleC5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vLi4vcnVtLWNvcmUvZGlzdC9lcy9lcnJvci1sb2dnaW5nL3N0YWNrLXRyYWNlLmpzIiwid2VicGFjazovL1tuYW1lXS8uLi9ydW0tY29yZS9kaXN0L2VzL2luZGV4LmpzIiwid2VicGFjazovL1tuYW1lXS8uLi9ydW0tY29yZS9kaXN0L2VzL29wZW50cmFjaW5nL2luZGV4LmpzIiwid2VicGFjazovL1tuYW1lXS8uLi9ydW0tY29yZS9kaXN0L2VzL29wZW50cmFjaW5nL3NwYW4uanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4uL3J1bS1jb3JlL2Rpc3QvZXMvb3BlbnRyYWNpbmcvdHJhY2VyLmpzIiwid2VicGFjazovL1tuYW1lXS8uLi9ydW0tY29yZS9kaXN0L2VzL3BlcmZvcm1hbmNlLW1vbml0b3JpbmcvYnJlYWtkb3duLmpzIiwid2VicGFjazovL1tuYW1lXS8uLi9ydW0tY29yZS9kaXN0L2VzL3BlcmZvcm1hbmNlLW1vbml0b3JpbmcvaW5kZXguanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4uL3J1bS1jb3JlL2Rpc3QvZXMvcGVyZm9ybWFuY2UtbW9uaXRvcmluZy9tZXRyaWNzLmpzIiwid2VicGFjazovL1tuYW1lXS8uLi9ydW0tY29yZS9kaXN0L2VzL3BlcmZvcm1hbmNlLW1vbml0b3JpbmcvbmF2aWdhdGlvbi9jYXB0dXJlLW5hdmlnYXRpb24uanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4uL3J1bS1jb3JlL2Rpc3QvZXMvcGVyZm9ybWFuY2UtbW9uaXRvcmluZy9uYXZpZ2F0aW9uL21hcmtzLmpzIiwid2VicGFjazovL1tuYW1lXS8uLi9ydW0tY29yZS9kaXN0L2VzL3BlcmZvcm1hbmNlLW1vbml0b3JpbmcvbmF2aWdhdGlvbi9uYXZpZ2F0aW9uLXRpbWluZy5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vLi4vcnVtLWNvcmUvZGlzdC9lcy9wZXJmb3JtYW5jZS1tb25pdG9yaW5nL25hdmlnYXRpb24vcmVzb3VyY2UtdGltaW5nLmpzIiwid2VicGFjazovL1tuYW1lXS8uLi9ydW0tY29yZS9kaXN0L2VzL3BlcmZvcm1hbmNlLW1vbml0b3JpbmcvbmF2aWdhdGlvbi91c2VyLXRpbWluZy5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vLi4vcnVtLWNvcmUvZGlzdC9lcy9wZXJmb3JtYW5jZS1tb25pdG9yaW5nL25hdmlnYXRpb24vdXRpbHMuanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4uL3J1bS1jb3JlL2Rpc3QvZXMvcGVyZm9ybWFuY2UtbW9uaXRvcmluZy9wZXJmb3JtYW5jZS1tb25pdG9yaW5nLmpzIiwid2VicGFjazovL1tuYW1lXS8uLi9ydW0tY29yZS9kaXN0L2VzL3BlcmZvcm1hbmNlLW1vbml0b3Jpbmcvc3Bhbi1iYXNlLmpzIiwid2VicGFjazovL1tuYW1lXS8uLi9ydW0tY29yZS9kaXN0L2VzL3BlcmZvcm1hbmNlLW1vbml0b3Jpbmcvc3Bhbi5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vLi4vcnVtLWNvcmUvZGlzdC9lcy9wZXJmb3JtYW5jZS1tb25pdG9yaW5nL3RyYW5zYWN0aW9uLXNlcnZpY2UuanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4uL3J1bS1jb3JlL2Rpc3QvZXMvcGVyZm9ybWFuY2UtbW9uaXRvcmluZy90cmFuc2FjdGlvbi5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vLi4vcnVtLWNvcmUvZGlzdC9lcy9zdGF0ZS5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vLi9zcmMvYXBtLWJhc2UuanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4uLy4uL25vZGVfbW9kdWxlcy9lcnJvci1zdGFjay1wYXJzZXIvZXJyb3Itc3RhY2stcGFyc2VyLmpzIiwid2VicGFjazovL1tuYW1lXS8uLi8uLi9ub2RlX21vZHVsZXMvb3BlbnRyYWNpbmcvbGliL2NvbnN0YW50cy5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vLi4vLi4vbm9kZV9tb2R1bGVzL29wZW50cmFjaW5nL2xpYi9mdW5jdGlvbnMuanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4uLy4uL25vZGVfbW9kdWxlcy9vcGVudHJhY2luZy9saWIvbm9vcC5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vLi4vLi4vbm9kZV9tb2R1bGVzL29wZW50cmFjaW5nL2xpYi9yZWZlcmVuY2UuanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4uLy4uL25vZGVfbW9kdWxlcy9vcGVudHJhY2luZy9saWIvc3Bhbi5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vLi4vLi4vbm9kZV9tb2R1bGVzL29wZW50cmFjaW5nL2xpYi9zcGFuX2NvbnRleHQuanMiLCJ3ZWJwYWNrOi8vW25hbWVdLy4uLy4uL25vZGVfbW9kdWxlcy9vcGVudHJhY2luZy9saWIvdHJhY2VyLmpzIiwid2VicGFjazovL1tuYW1lXS8uLi8uLi9ub2RlX21vZHVsZXMvcHJvbWlzZS1wb2x5ZmlsbC9zcmMvZmluYWxseS5qcyIsIndlYnBhY2s6Ly9bbmFtZV0vLi4vLi4vbm9kZV9tb2R1bGVzL3Byb21pc2UtcG9seWZpbGwvc3JjL2luZGV4LmpzIiwid2VicGFjazovL1tuYW1lXS8uLi8uLi9ub2RlX21vZHVsZXMvc3RhY2tmcmFtZS9zdGFja2ZyYW1lLmpzIiwid2VicGFjazovL1tuYW1lXS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9bbmFtZV0vd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vW25hbWVdL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9bbmFtZV0vd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9bbmFtZV0vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9bbmFtZV0vLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiZWxhc3RpYy1hcG0tcnVtXCJdID0gZmFjdG9yeSgpO1xuXHRlbHNlXG5cdFx0cm9vdFtcImVsYXN0aWMtYXBtLXJ1bVwiXSA9IGZhY3RvcnkoKTtcbn0pKHNlbGYsIGZ1bmN0aW9uKCkge1xucmV0dXJuICIsImltcG9ydCB7IGlzUGxhdGZvcm1TdXBwb3J0ZWQsIGlzQnJvd3Nlciwgbm93IH0gZnJvbSAnLi9jb21tb24vdXRpbHMnO1xuaW1wb3J0IHsgcGF0Y2hBbGwgfSBmcm9tICcuL2NvbW1vbi9wYXRjaGluZyc7XG5pbXBvcnQgeyBzdGF0ZSB9IGZyb20gJy4vc3RhdGUnO1xudmFyIGVuYWJsZWQgPSBmYWxzZTtcbmV4cG9ydCBmdW5jdGlvbiBib290c3RyYXAoKSB7XG4gIGlmIChpc1BsYXRmb3JtU3VwcG9ydGVkKCkpIHtcbiAgICBwYXRjaEFsbCgpO1xuICAgIHN0YXRlLmJvb3RzdHJhcFRpbWUgPSBub3coKTtcbiAgICBlbmFibGVkID0gdHJ1ZTtcbiAgfSBlbHNlIGlmIChpc0Jyb3dzZXIpIHtcbiAgICBjb25zb2xlLmxvZygnW0VsYXN0aWMgQVBNXSBwbGF0Zm9ybSBpcyBub3Qgc3VwcG9ydGVkIScpO1xuICB9XG5cbiAgcmV0dXJuIGVuYWJsZWQ7XG59IiwidmFyIFJBRl9USU1FT1VUID0gMTAwO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYWZ0ZXJGcmFtZShjYWxsYmFjaykge1xuICB2YXIgaGFuZGxlciA9IGZ1bmN0aW9uIGhhbmRsZXIoKSB7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHJhZik7XG4gICAgc2V0VGltZW91dChjYWxsYmFjayk7XG4gIH07XG5cbiAgdmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGhhbmRsZXIsIFJBRl9USU1FT1VUKTtcbiAgdmFyIHJhZiA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShoYW5kbGVyKTtcbn0iLCJpbXBvcnQgUXVldWUgZnJvbSAnLi9xdWV1ZSc7XG5pbXBvcnQgdGhyb3R0bGUgZnJvbSAnLi90aHJvdHRsZSc7XG5pbXBvcnQgTkRKU09OIGZyb20gJy4vbmRqc29uJztcbmltcG9ydCB7IHRydW5jYXRlTW9kZWwsIE1FVEFEQVRBX01PREVMIH0gZnJvbSAnLi90cnVuY2F0ZSc7XG5pbXBvcnQgeyBFUlJPUlMsIEhUVFBfUkVRVUVTVF9USU1FT1VULCBRVUVVRV9GTFVTSCwgVFJBTlNBQ1RJT05TIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgbm9vcCB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHsgUHJvbWlzZSB9IGZyb20gJy4vcG9seWZpbGxzJztcbmltcG9ydCB7IGNvbXByZXNzTWV0YWRhdGEsIGNvbXByZXNzVHJhbnNhY3Rpb24sIGNvbXByZXNzRXJyb3IsIGNvbXByZXNzUGF5bG9hZCB9IGZyb20gJy4vY29tcHJlc3MnO1xuaW1wb3J0IHsgX19ERVZfXyB9IGZyb20gJy4uL3N0YXRlJztcbmltcG9ydCB7IHNlbmRGZXRjaFJlcXVlc3QsIHNob3VsZFVzZUZldGNoV2l0aEtlZXBBbGl2ZSB9IGZyb20gJy4vaHR0cC9mZXRjaCc7XG5pbXBvcnQgeyBzZW5kWEhSIH0gZnJvbSAnLi9odHRwL3hocic7XG52YXIgVEhST1RUTEVfSU5URVJWQUwgPSA2MDAwMDtcblxudmFyIEFwbVNlcnZlciA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gQXBtU2VydmVyKGNvbmZpZ1NlcnZpY2UsIGxvZ2dpbmdTZXJ2aWNlKSB7XG4gICAgdGhpcy5fY29uZmlnU2VydmljZSA9IGNvbmZpZ1NlcnZpY2U7XG4gICAgdGhpcy5fbG9nZ2luZ1NlcnZpY2UgPSBsb2dnaW5nU2VydmljZTtcbiAgICB0aGlzLnF1ZXVlID0gdW5kZWZpbmVkO1xuICAgIHRoaXMudGhyb3R0bGVFdmVudHMgPSBub29wO1xuICB9XG5cbiAgdmFyIF9wcm90byA9IEFwbVNlcnZlci5wcm90b3R5cGU7XG5cbiAgX3Byb3RvLmluaXQgPSBmdW5jdGlvbiBpbml0KCkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgcXVldWVMaW1pdCA9IHRoaXMuX2NvbmZpZ1NlcnZpY2UuZ2V0KCdxdWV1ZUxpbWl0Jyk7XG5cbiAgICB2YXIgZmx1c2hJbnRlcnZhbCA9IHRoaXMuX2NvbmZpZ1NlcnZpY2UuZ2V0KCdmbHVzaEludGVydmFsJyk7XG5cbiAgICB2YXIgbGltaXQgPSB0aGlzLl9jb25maWdTZXJ2aWNlLmdldCgnZXZlbnRzTGltaXQnKTtcblxuICAgIHZhciBvbkZsdXNoID0gZnVuY3Rpb24gb25GbHVzaChldmVudHMpIHtcbiAgICAgIHZhciBwcm9taXNlID0gX3RoaXMuc2VuZEV2ZW50cyhldmVudHMpO1xuXG4gICAgICBpZiAocHJvbWlzZSkge1xuICAgICAgICBwcm9taXNlLmNhdGNoKGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgICAgICBfdGhpcy5fbG9nZ2luZ1NlcnZpY2Uud2FybignRmFpbGVkIHNlbmRpbmcgZXZlbnRzIScsIF90aGlzLl9jb25zdHJ1Y3RFcnJvcihyZWFzb24pKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRoaXMucXVldWUgPSBuZXcgUXVldWUob25GbHVzaCwge1xuICAgICAgcXVldWVMaW1pdDogcXVldWVMaW1pdCxcbiAgICAgIGZsdXNoSW50ZXJ2YWw6IGZsdXNoSW50ZXJ2YWxcbiAgICB9KTtcbiAgICB0aGlzLnRocm90dGxlRXZlbnRzID0gdGhyb3R0bGUodGhpcy5xdWV1ZS5hZGQuYmluZCh0aGlzLnF1ZXVlKSwgZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIF90aGlzLl9sb2dnaW5nU2VydmljZS53YXJuKCdEcm9wcGVkIGV2ZW50cyBkdWUgdG8gdGhyb3R0bGluZyEnKTtcbiAgICB9LCB7XG4gICAgICBsaW1pdDogbGltaXQsXG4gICAgICBpbnRlcnZhbDogVEhST1RUTEVfSU5URVJWQUxcbiAgICB9KTtcblxuICAgIHRoaXMuX2NvbmZpZ1NlcnZpY2Uub2JzZXJ2ZUV2ZW50KFFVRVVFX0ZMVVNILCBmdW5jdGlvbiAoKSB7XG4gICAgICBfdGhpcy5xdWV1ZS5mbHVzaCgpO1xuICAgIH0pO1xuICB9O1xuXG4gIF9wcm90by5fcG9zdEpzb24gPSBmdW5jdGlvbiBfcG9zdEpzb24oZW5kUG9pbnQsIHBheWxvYWQpIHtcbiAgICB2YXIgX3RoaXMyID0gdGhpcztcblxuICAgIHZhciBoZWFkZXJzID0ge1xuICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LW5kanNvbidcbiAgICB9O1xuXG4gICAgdmFyIGFwbVJlcXVlc3QgPSB0aGlzLl9jb25maWdTZXJ2aWNlLmdldCgnYXBtUmVxdWVzdCcpO1xuXG4gICAgdmFyIHBhcmFtcyA9IHtcbiAgICAgIHBheWxvYWQ6IHBheWxvYWQsXG4gICAgICBoZWFkZXJzOiBoZWFkZXJzLFxuICAgICAgYmVmb3JlU2VuZDogYXBtUmVxdWVzdFxuICAgIH07XG4gICAgcmV0dXJuIGNvbXByZXNzUGF5bG9hZChwYXJhbXMpLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgaWYgKF9fREVWX18pIHtcbiAgICAgICAgX3RoaXMyLl9sb2dnaW5nU2VydmljZS5kZWJ1ZygnQ29tcHJlc3NpbmcgdGhlIHBheWxvYWQgdXNpbmcgQ29tcHJlc3Npb25TdHJlYW0gQVBJIGZhaWxlZCcsIGVycm9yLm1lc3NhZ2UpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcGFyYW1zO1xuICAgIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgcmV0dXJuIF90aGlzMi5fbWFrZUh0dHBSZXF1ZXN0KCdQT1NUJywgZW5kUG9pbnQsIHJlc3VsdCk7XG4gICAgfSkudGhlbihmdW5jdGlvbiAoX3JlZikge1xuICAgICAgdmFyIHJlc3BvbnNlVGV4dCA9IF9yZWYucmVzcG9uc2VUZXh0O1xuICAgICAgcmV0dXJuIHJlc3BvbnNlVGV4dDtcbiAgICB9KTtcbiAgfTtcblxuICBfcHJvdG8uX2NvbnN0cnVjdEVycm9yID0gZnVuY3Rpb24gX2NvbnN0cnVjdEVycm9yKHJlYXNvbikge1xuICAgIHZhciB1cmwgPSByZWFzb24udXJsLFxuICAgICAgICBzdGF0dXMgPSByZWFzb24uc3RhdHVzLFxuICAgICAgICByZXNwb25zZVRleHQgPSByZWFzb24ucmVzcG9uc2VUZXh0O1xuXG4gICAgaWYgKHR5cGVvZiBzdGF0dXMgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHJldHVybiByZWFzb247XG4gICAgfVxuXG4gICAgdmFyIG1lc3NhZ2UgPSB1cmwgKyAnIEhUVFAgc3RhdHVzOiAnICsgc3RhdHVzO1xuXG4gICAgaWYgKF9fREVWX18gJiYgcmVzcG9uc2VUZXh0KSB7XG4gICAgICB0cnkge1xuICAgICAgICB2YXIgc2VydmVyRXJyb3JzID0gW107XG4gICAgICAgIHZhciByZXNwb25zZSA9IEpTT04ucGFyc2UocmVzcG9uc2VUZXh0KTtcblxuICAgICAgICBpZiAocmVzcG9uc2UuZXJyb3JzICYmIHJlc3BvbnNlLmVycm9ycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgcmVzcG9uc2UuZXJyb3JzLmZvckVhY2goZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgcmV0dXJuIHNlcnZlckVycm9ycy5wdXNoKGVyci5tZXNzYWdlKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBtZXNzYWdlICs9ICcgJyArIHNlcnZlckVycm9ycy5qb2luKCcsJyk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgdGhpcy5fbG9nZ2luZ1NlcnZpY2UuZGVidWcoJ0Vycm9yIHBhcnNpbmcgcmVzcG9uc2UgZnJvbSBBUE0gc2VydmVyJywgZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgfTtcblxuICBfcHJvdG8uX21ha2VIdHRwUmVxdWVzdCA9IGZ1bmN0aW9uIF9tYWtlSHR0cFJlcXVlc3QobWV0aG9kLCB1cmwsIF90ZW1wKSB7XG4gICAgdmFyIF9yZWYyID0gX3RlbXAgPT09IHZvaWQgMCA/IHt9IDogX3RlbXAsXG4gICAgICAgIF9yZWYyJHRpbWVvdXQgPSBfcmVmMi50aW1lb3V0LFxuICAgICAgICB0aW1lb3V0ID0gX3JlZjIkdGltZW91dCA9PT0gdm9pZCAwID8gSFRUUF9SRVFVRVNUX1RJTUVPVVQgOiBfcmVmMiR0aW1lb3V0LFxuICAgICAgICBwYXlsb2FkID0gX3JlZjIucGF5bG9hZCxcbiAgICAgICAgaGVhZGVycyA9IF9yZWYyLmhlYWRlcnMsXG4gICAgICAgIGJlZm9yZVNlbmQgPSBfcmVmMi5iZWZvcmVTZW5kO1xuXG4gICAgdmFyIHNlbmRDcmVkZW50aWFscyA9IHRoaXMuX2NvbmZpZ1NlcnZpY2UuZ2V0KCdzZW5kQ3JlZGVudGlhbHMnKTtcblxuICAgIGlmICghYmVmb3JlU2VuZCAmJiBzaG91bGRVc2VGZXRjaFdpdGhLZWVwQWxpdmUobWV0aG9kLCBwYXlsb2FkKSkge1xuICAgICAgcmV0dXJuIHNlbmRGZXRjaFJlcXVlc3QobWV0aG9kLCB1cmwsIHtcbiAgICAgICAga2VlcGFsaXZlOiB0cnVlLFxuICAgICAgICB0aW1lb3V0OiB0aW1lb3V0LFxuICAgICAgICBwYXlsb2FkOiBwYXlsb2FkLFxuICAgICAgICBoZWFkZXJzOiBoZWFkZXJzLFxuICAgICAgICBzZW5kQ3JlZGVudGlhbHM6IHNlbmRDcmVkZW50aWFsc1xuICAgICAgfSkuY2F0Y2goZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgICBpZiAocmVhc29uIGluc3RhbmNlb2YgVHlwZUVycm9yKSB7XG4gICAgICAgICAgcmV0dXJuIHNlbmRYSFIobWV0aG9kLCB1cmwsIHtcbiAgICAgICAgICAgIHRpbWVvdXQ6IHRpbWVvdXQsXG4gICAgICAgICAgICBwYXlsb2FkOiBwYXlsb2FkLFxuICAgICAgICAgICAgaGVhZGVyczogaGVhZGVycyxcbiAgICAgICAgICAgIGJlZm9yZVNlbmQ6IGJlZm9yZVNlbmQsXG4gICAgICAgICAgICBzZW5kQ3JlZGVudGlhbHM6IHNlbmRDcmVkZW50aWFsc1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhyb3cgcmVhc29uO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlbmRYSFIobWV0aG9kLCB1cmwsIHtcbiAgICAgIHRpbWVvdXQ6IHRpbWVvdXQsXG4gICAgICBwYXlsb2FkOiBwYXlsb2FkLFxuICAgICAgaGVhZGVyczogaGVhZGVycyxcbiAgICAgIGJlZm9yZVNlbmQ6IGJlZm9yZVNlbmQsXG4gICAgICBzZW5kQ3JlZGVudGlhbHM6IHNlbmRDcmVkZW50aWFsc1xuICAgIH0pO1xuICB9O1xuXG4gIF9wcm90by5mZXRjaENvbmZpZyA9IGZ1bmN0aW9uIGZldGNoQ29uZmlnKHNlcnZpY2VOYW1lLCBlbnZpcm9ubWVudCkge1xuICAgIHZhciBfdGhpczMgPSB0aGlzO1xuXG4gICAgdmFyIF90aGlzJGdldEVuZHBvaW50cyA9IHRoaXMuZ2V0RW5kcG9pbnRzKCksXG4gICAgICAgIGNvbmZpZ0VuZHBvaW50ID0gX3RoaXMkZ2V0RW5kcG9pbnRzLmNvbmZpZ0VuZHBvaW50O1xuXG4gICAgaWYgKCFzZXJ2aWNlTmFtZSkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KCdzZXJ2aWNlTmFtZSBpcyByZXF1aXJlZCBmb3IgZmV0Y2hpbmcgY2VudHJhbCBjb25maWcuJyk7XG4gICAgfVxuXG4gICAgY29uZmlnRW5kcG9pbnQgKz0gXCI/c2VydmljZS5uYW1lPVwiICsgc2VydmljZU5hbWU7XG5cbiAgICBpZiAoZW52aXJvbm1lbnQpIHtcbiAgICAgIGNvbmZpZ0VuZHBvaW50ICs9IFwiJnNlcnZpY2UuZW52aXJvbm1lbnQ9XCIgKyBlbnZpcm9ubWVudDtcbiAgICB9XG5cbiAgICB2YXIgbG9jYWxDb25maWcgPSB0aGlzLl9jb25maWdTZXJ2aWNlLmdldExvY2FsQ29uZmlnKCk7XG5cbiAgICBpZiAobG9jYWxDb25maWcpIHtcbiAgICAgIGNvbmZpZ0VuZHBvaW50ICs9IFwiJmlmbm9uZW1hdGNoPVwiICsgbG9jYWxDb25maWcuZXRhZztcbiAgICB9XG5cbiAgICB2YXIgYXBtUmVxdWVzdCA9IHRoaXMuX2NvbmZpZ1NlcnZpY2UuZ2V0KCdhcG1SZXF1ZXN0Jyk7XG5cbiAgICByZXR1cm4gdGhpcy5fbWFrZUh0dHBSZXF1ZXN0KCdHRVQnLCBjb25maWdFbmRwb2ludCwge1xuICAgICAgdGltZW91dDogNTAwMCxcbiAgICAgIGJlZm9yZVNlbmQ6IGFwbVJlcXVlc3RcbiAgICB9KS50aGVuKGZ1bmN0aW9uICh4aHIpIHtcbiAgICAgIHZhciBzdGF0dXMgPSB4aHIuc3RhdHVzLFxuICAgICAgICAgIHJlc3BvbnNlVGV4dCA9IHhoci5yZXNwb25zZVRleHQ7XG5cbiAgICAgIGlmIChzdGF0dXMgPT09IDMwNCkge1xuICAgICAgICByZXR1cm4gbG9jYWxDb25maWc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgcmVtb3RlQ29uZmlnID0gSlNPTi5wYXJzZShyZXNwb25zZVRleHQpO1xuICAgICAgICB2YXIgZXRhZyA9IHhoci5nZXRSZXNwb25zZUhlYWRlcignZXRhZycpO1xuXG4gICAgICAgIGlmIChldGFnKSB7XG4gICAgICAgICAgcmVtb3RlQ29uZmlnLmV0YWcgPSBldGFnLnJlcGxhY2UoL1tcIl0vZywgJycpO1xuXG4gICAgICAgICAgX3RoaXMzLl9jb25maWdTZXJ2aWNlLnNldExvY2FsQ29uZmlnKHJlbW90ZUNvbmZpZywgdHJ1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVtb3RlQ29uZmlnO1xuICAgICAgfVxuICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChyZWFzb24pIHtcbiAgICAgIHZhciBlcnJvciA9IF90aGlzMy5fY29uc3RydWN0RXJyb3IocmVhc29uKTtcblxuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KGVycm9yKTtcbiAgICB9KTtcbiAgfTtcblxuICBfcHJvdG8uY3JlYXRlTWV0YURhdGEgPSBmdW5jdGlvbiBjcmVhdGVNZXRhRGF0YSgpIHtcbiAgICB2YXIgY2ZnID0gdGhpcy5fY29uZmlnU2VydmljZTtcbiAgICB2YXIgbWV0YWRhdGEgPSB7XG4gICAgICBzZXJ2aWNlOiB7XG4gICAgICAgIG5hbWU6IGNmZy5nZXQoJ3NlcnZpY2VOYW1lJyksXG4gICAgICAgIHZlcnNpb246IGNmZy5nZXQoJ3NlcnZpY2VWZXJzaW9uJyksXG4gICAgICAgIGFnZW50OiB7XG4gICAgICAgICAgbmFtZTogJ3J1bS1qcycsXG4gICAgICAgICAgdmVyc2lvbjogY2ZnLnZlcnNpb25cbiAgICAgICAgfSxcbiAgICAgICAgbGFuZ3VhZ2U6IHtcbiAgICAgICAgICBuYW1lOiAnamF2YXNjcmlwdCdcbiAgICAgICAgfSxcbiAgICAgICAgZW52aXJvbm1lbnQ6IGNmZy5nZXQoJ2Vudmlyb25tZW50JylcbiAgICAgIH0sXG4gICAgICBsYWJlbHM6IGNmZy5nZXQoJ2NvbnRleHQudGFncycpXG4gICAgfTtcbiAgICByZXR1cm4gdHJ1bmNhdGVNb2RlbChNRVRBREFUQV9NT0RFTCwgbWV0YWRhdGEpO1xuICB9O1xuXG4gIF9wcm90by5hZGRFcnJvciA9IGZ1bmN0aW9uIGFkZEVycm9yKGVycm9yKSB7XG4gICAgdmFyIF90aGlzJHRocm90dGxlRXZlbnRzO1xuXG4gICAgdGhpcy50aHJvdHRsZUV2ZW50cygoX3RoaXMkdGhyb3R0bGVFdmVudHMgPSB7fSwgX3RoaXMkdGhyb3R0bGVFdmVudHNbRVJST1JTXSA9IGVycm9yLCBfdGhpcyR0aHJvdHRsZUV2ZW50cykpO1xuICB9O1xuXG4gIF9wcm90by5hZGRUcmFuc2FjdGlvbiA9IGZ1bmN0aW9uIGFkZFRyYW5zYWN0aW9uKHRyYW5zYWN0aW9uKSB7XG4gICAgdmFyIF90aGlzJHRocm90dGxlRXZlbnRzMjtcblxuICAgIHRoaXMudGhyb3R0bGVFdmVudHMoKF90aGlzJHRocm90dGxlRXZlbnRzMiA9IHt9LCBfdGhpcyR0aHJvdHRsZUV2ZW50czJbVFJBTlNBQ1RJT05TXSA9IHRyYW5zYWN0aW9uLCBfdGhpcyR0aHJvdHRsZUV2ZW50czIpKTtcbiAgfTtcblxuICBfcHJvdG8ubmRqc29uRXJyb3JzID0gZnVuY3Rpb24gbmRqc29uRXJyb3JzKGVycm9ycywgY29tcHJlc3MpIHtcbiAgICB2YXIga2V5ID0gY29tcHJlc3MgPyAnZScgOiAnZXJyb3InO1xuICAgIHJldHVybiBlcnJvcnMubWFwKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgdmFyIF9OREpTT04kc3RyaW5naWZ5O1xuXG4gICAgICByZXR1cm4gTkRKU09OLnN0cmluZ2lmeSgoX05ESlNPTiRzdHJpbmdpZnkgPSB7fSwgX05ESlNPTiRzdHJpbmdpZnlba2V5XSA9IGNvbXByZXNzID8gY29tcHJlc3NFcnJvcihlcnJvcikgOiBlcnJvciwgX05ESlNPTiRzdHJpbmdpZnkpKTtcbiAgICB9KTtcbiAgfTtcblxuICBfcHJvdG8ubmRqc29uTWV0cmljc2V0cyA9IGZ1bmN0aW9uIG5kanNvbk1ldHJpY3NldHMobWV0cmljc2V0cykge1xuICAgIHJldHVybiBtZXRyaWNzZXRzLm1hcChmdW5jdGlvbiAobWV0cmljc2V0KSB7XG4gICAgICByZXR1cm4gTkRKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIG1ldHJpY3NldDogbWV0cmljc2V0XG4gICAgICB9KTtcbiAgICB9KS5qb2luKCcnKTtcbiAgfTtcblxuICBfcHJvdG8ubmRqc29uVHJhbnNhY3Rpb25zID0gZnVuY3Rpb24gbmRqc29uVHJhbnNhY3Rpb25zKHRyYW5zYWN0aW9ucywgY29tcHJlc3MpIHtcbiAgICB2YXIgX3RoaXM0ID0gdGhpcztcblxuICAgIHZhciBrZXkgPSBjb21wcmVzcyA/ICd4JyA6ICd0cmFuc2FjdGlvbic7XG4gICAgcmV0dXJuIHRyYW5zYWN0aW9ucy5tYXAoZnVuY3Rpb24gKHRyKSB7XG4gICAgICB2YXIgX05ESlNPTiRzdHJpbmdpZnkyO1xuXG4gICAgICB2YXIgc3BhbnMgPSAnJyxcbiAgICAgICAgICBicmVha2Rvd25zID0gJyc7XG5cbiAgICAgIGlmICghY29tcHJlc3MpIHtcbiAgICAgICAgaWYgKHRyLnNwYW5zKSB7XG4gICAgICAgICAgc3BhbnMgPSB0ci5zcGFucy5tYXAoZnVuY3Rpb24gKHNwYW4pIHtcbiAgICAgICAgICAgIHJldHVybiBOREpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgc3Bhbjogc3BhblxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSkuam9pbignJyk7XG4gICAgICAgICAgZGVsZXRlIHRyLnNwYW5zO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRyLmJyZWFrZG93bikge1xuICAgICAgICAgIGJyZWFrZG93bnMgPSBfdGhpczQubmRqc29uTWV0cmljc2V0cyh0ci5icmVha2Rvd24pO1xuICAgICAgICAgIGRlbGV0ZSB0ci5icmVha2Rvd247XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIE5ESlNPTi5zdHJpbmdpZnkoKF9OREpTT04kc3RyaW5naWZ5MiA9IHt9LCBfTkRKU09OJHN0cmluZ2lmeTJba2V5XSA9IGNvbXByZXNzID8gY29tcHJlc3NUcmFuc2FjdGlvbih0cikgOiB0ciwgX05ESlNPTiRzdHJpbmdpZnkyKSkgKyBzcGFucyArIGJyZWFrZG93bnM7XG4gICAgfSk7XG4gIH07XG5cbiAgX3Byb3RvLnNlbmRFdmVudHMgPSBmdW5jdGlvbiBzZW5kRXZlbnRzKGV2ZW50cykge1xuICAgIHZhciBfcGF5bG9hZCwgX05ESlNPTiRzdHJpbmdpZnkzO1xuXG4gICAgaWYgKGV2ZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgdHJhbnNhY3Rpb25zID0gW107XG4gICAgdmFyIGVycm9ycyA9IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBldmVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBldmVudCA9IGV2ZW50c1tpXTtcblxuICAgICAgaWYgKGV2ZW50W1RSQU5TQUNUSU9OU10pIHtcbiAgICAgICAgdHJhbnNhY3Rpb25zLnB1c2goZXZlbnRbVFJBTlNBQ1RJT05TXSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChldmVudFtFUlJPUlNdKSB7XG4gICAgICAgIGVycm9ycy5wdXNoKGV2ZW50W0VSUk9SU10pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0cmFuc2FjdGlvbnMubGVuZ3RoID09PSAwICYmIGVycm9ycy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgY2ZnID0gdGhpcy5fY29uZmlnU2VydmljZTtcbiAgICB2YXIgcGF5bG9hZCA9IChfcGF5bG9hZCA9IHt9LCBfcGF5bG9hZFtUUkFOU0FDVElPTlNdID0gdHJhbnNhY3Rpb25zLCBfcGF5bG9hZFtFUlJPUlNdID0gZXJyb3JzLCBfcGF5bG9hZCk7XG4gICAgdmFyIGZpbHRlcmVkUGF5bG9hZCA9IGNmZy5hcHBseUZpbHRlcnMocGF5bG9hZCk7XG5cbiAgICBpZiAoIWZpbHRlcmVkUGF5bG9hZCkge1xuICAgICAgdGhpcy5fbG9nZ2luZ1NlcnZpY2Uud2FybignRHJvcHBlZCBwYXlsb2FkIGR1ZSB0byBmaWx0ZXJpbmchJyk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgYXBpVmVyc2lvbiA9IGNmZy5nZXQoJ2FwaVZlcnNpb24nKTtcbiAgICB2YXIgY29tcHJlc3MgPSBhcGlWZXJzaW9uID4gMjtcbiAgICB2YXIgbmRqc29uID0gW107XG4gICAgdmFyIG1ldGFkYXRhID0gdGhpcy5jcmVhdGVNZXRhRGF0YSgpO1xuICAgIHZhciBtZXRhZGF0YUtleSA9IGNvbXByZXNzID8gJ20nIDogJ21ldGFkYXRhJztcbiAgICBuZGpzb24ucHVzaChOREpTT04uc3RyaW5naWZ5KChfTkRKU09OJHN0cmluZ2lmeTMgPSB7fSwgX05ESlNPTiRzdHJpbmdpZnkzW21ldGFkYXRhS2V5XSA9IGNvbXByZXNzID8gY29tcHJlc3NNZXRhZGF0YShtZXRhZGF0YSkgOiBtZXRhZGF0YSwgX05ESlNPTiRzdHJpbmdpZnkzKSkpO1xuICAgIG5kanNvbiA9IG5kanNvbi5jb25jYXQodGhpcy5uZGpzb25FcnJvcnMoZmlsdGVyZWRQYXlsb2FkW0VSUk9SU10sIGNvbXByZXNzKSwgdGhpcy5uZGpzb25UcmFuc2FjdGlvbnMoZmlsdGVyZWRQYXlsb2FkW1RSQU5TQUNUSU9OU10sIGNvbXByZXNzKSk7XG4gICAgdmFyIG5kanNvblBheWxvYWQgPSBuZGpzb24uam9pbignJyk7XG5cbiAgICB2YXIgX3RoaXMkZ2V0RW5kcG9pbnRzMiA9IHRoaXMuZ2V0RW5kcG9pbnRzKCksXG4gICAgICAgIGludGFrZUVuZHBvaW50ID0gX3RoaXMkZ2V0RW5kcG9pbnRzMi5pbnRha2VFbmRwb2ludDtcblxuICAgIHJldHVybiB0aGlzLl9wb3N0SnNvbihpbnRha2VFbmRwb2ludCwgbmRqc29uUGF5bG9hZCk7XG4gIH07XG5cbiAgX3Byb3RvLmdldEVuZHBvaW50cyA9IGZ1bmN0aW9uIGdldEVuZHBvaW50cygpIHtcbiAgICB2YXIgc2VydmVyVXJsID0gdGhpcy5fY29uZmlnU2VydmljZS5nZXQoJ3NlcnZlclVybCcpO1xuXG4gICAgdmFyIGFwaVZlcnNpb24gPSB0aGlzLl9jb25maWdTZXJ2aWNlLmdldCgnYXBpVmVyc2lvbicpO1xuXG4gICAgdmFyIHNlcnZlclVybFByZWZpeCA9IHRoaXMuX2NvbmZpZ1NlcnZpY2UuZ2V0KCdzZXJ2ZXJVcmxQcmVmaXgnKSB8fCBcIi9pbnRha2UvdlwiICsgYXBpVmVyc2lvbiArIFwiL3J1bS9ldmVudHNcIjtcbiAgICB2YXIgaW50YWtlRW5kcG9pbnQgPSBzZXJ2ZXJVcmwgKyBzZXJ2ZXJVcmxQcmVmaXg7XG4gICAgdmFyIGNvbmZpZ0VuZHBvaW50ID0gc2VydmVyVXJsICsgXCIvY29uZmlnL3YxL3J1bS9hZ2VudHNcIjtcbiAgICByZXR1cm4ge1xuICAgICAgaW50YWtlRW5kcG9pbnQ6IGludGFrZUVuZHBvaW50LFxuICAgICAgY29uZmlnRW5kcG9pbnQ6IGNvbmZpZ0VuZHBvaW50XG4gICAgfTtcbiAgfTtcblxuICByZXR1cm4gQXBtU2VydmVyO1xufSgpO1xuXG5leHBvcnQgZGVmYXVsdCBBcG1TZXJ2ZXI7IiwiaW1wb3J0IHsgUHJvbWlzZSB9IGZyb20gJy4vcG9seWZpbGxzJztcbmltcG9ydCB7IE5BVklHQVRJT05fVElNSU5HX01BUktTLCBDT01QUkVTU0VEX05BVl9USU1JTkdfTUFSS1MgfSBmcm9tICcuLi9wZXJmb3JtYW5jZS1tb25pdG9yaW5nL25hdmlnYXRpb24vbWFya3MnO1xuaW1wb3J0IHsgaXNCZWFjb25JbnNwZWN0aW9uRW5hYmxlZCB9IGZyb20gJy4vdXRpbHMnO1xuXG5mdW5jdGlvbiBjb21wcmVzc1N0YWNrRnJhbWVzKGZyYW1lcykge1xuICByZXR1cm4gZnJhbWVzLm1hcChmdW5jdGlvbiAoZnJhbWUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYXA6IGZyYW1lLmFic19wYXRoLFxuICAgICAgZjogZnJhbWUuZmlsZW5hbWUsXG4gICAgICBmbjogZnJhbWUuZnVuY3Rpb24sXG4gICAgICBsaTogZnJhbWUubGluZW5vLFxuICAgICAgY286IGZyYW1lLmNvbG5vXG4gICAgfTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGNvbXByZXNzUmVzcG9uc2UocmVzcG9uc2UpIHtcbiAgcmV0dXJuIHtcbiAgICB0czogcmVzcG9uc2UudHJhbnNmZXJfc2l6ZSxcbiAgICBlYnM6IHJlc3BvbnNlLmVuY29kZWRfYm9keV9zaXplLFxuICAgIGRiczogcmVzcG9uc2UuZGVjb2RlZF9ib2R5X3NpemVcbiAgfTtcbn1cblxuZnVuY3Rpb24gY29tcHJlc3NIVFRQKGh0dHApIHtcbiAgdmFyIGNvbXByZXNzZWQgPSB7fTtcbiAgdmFyIG1ldGhvZCA9IGh0dHAubWV0aG9kLFxuICAgICAgc3RhdHVzX2NvZGUgPSBodHRwLnN0YXR1c19jb2RlLFxuICAgICAgdXJsID0gaHR0cC51cmwsXG4gICAgICByZXNwb25zZSA9IGh0dHAucmVzcG9uc2U7XG4gIGNvbXByZXNzZWQudXJsID0gdXJsO1xuXG4gIGlmIChtZXRob2QpIHtcbiAgICBjb21wcmVzc2VkLm10ID0gbWV0aG9kO1xuICB9XG5cbiAgaWYgKHN0YXR1c19jb2RlKSB7XG4gICAgY29tcHJlc3NlZC5zYyA9IHN0YXR1c19jb2RlO1xuICB9XG5cbiAgaWYgKHJlc3BvbnNlKSB7XG4gICAgY29tcHJlc3NlZC5yID0gY29tcHJlc3NSZXNwb25zZShyZXNwb25zZSk7XG4gIH1cblxuICByZXR1cm4gY29tcHJlc3NlZDtcbn1cblxuZnVuY3Rpb24gY29tcHJlc3NDb250ZXh0KGNvbnRleHQpIHtcbiAgaWYgKCFjb250ZXh0KSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICB2YXIgY29tcHJlc3NlZCA9IHt9O1xuICB2YXIgcGFnZSA9IGNvbnRleHQucGFnZSxcbiAgICAgIGh0dHAgPSBjb250ZXh0Lmh0dHAsXG4gICAgICByZXNwb25zZSA9IGNvbnRleHQucmVzcG9uc2UsXG4gICAgICBkZXN0aW5hdGlvbiA9IGNvbnRleHQuZGVzdGluYXRpb24sXG4gICAgICB1c2VyID0gY29udGV4dC51c2VyLFxuICAgICAgY3VzdG9tID0gY29udGV4dC5jdXN0b207XG5cbiAgaWYgKHBhZ2UpIHtcbiAgICBjb21wcmVzc2VkLnAgPSB7XG4gICAgICByZjogcGFnZS5yZWZlcmVyLFxuICAgICAgdXJsOiBwYWdlLnVybFxuICAgIH07XG4gIH1cblxuICBpZiAoaHR0cCkge1xuICAgIGNvbXByZXNzZWQuaCA9IGNvbXByZXNzSFRUUChodHRwKTtcbiAgfVxuXG4gIGlmIChyZXNwb25zZSkge1xuICAgIGNvbXByZXNzZWQuciA9IGNvbXByZXNzUmVzcG9uc2UocmVzcG9uc2UpO1xuICB9XG5cbiAgaWYgKGRlc3RpbmF0aW9uKSB7XG4gICAgdmFyIHNlcnZpY2UgPSBkZXN0aW5hdGlvbi5zZXJ2aWNlO1xuICAgIGNvbXByZXNzZWQuZHQgPSB7XG4gICAgICBzZToge1xuICAgICAgICBuOiBzZXJ2aWNlLm5hbWUsXG4gICAgICAgIHQ6IHNlcnZpY2UudHlwZSxcbiAgICAgICAgcmM6IHNlcnZpY2UucmVzb3VyY2VcbiAgICAgIH0sXG4gICAgICBhZDogZGVzdGluYXRpb24uYWRkcmVzcyxcbiAgICAgIHBvOiBkZXN0aW5hdGlvbi5wb3J0XG4gICAgfTtcbiAgfVxuXG4gIGlmICh1c2VyKSB7XG4gICAgY29tcHJlc3NlZC51ID0ge1xuICAgICAgaWQ6IHVzZXIuaWQsXG4gICAgICB1bjogdXNlci51c2VybmFtZSxcbiAgICAgIGVtOiB1c2VyLmVtYWlsXG4gICAgfTtcbiAgfVxuXG4gIGlmIChjdXN0b20pIHtcbiAgICBjb21wcmVzc2VkLmN1ID0gY3VzdG9tO1xuICB9XG5cbiAgcmV0dXJuIGNvbXByZXNzZWQ7XG59XG5cbmZ1bmN0aW9uIGNvbXByZXNzTWFya3MobWFya3MpIHtcbiAgaWYgKCFtYXJrcykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdmFyIGNvbXByZXNzZWROdE1hcmtzID0gY29tcHJlc3NOYXZpZ2F0aW9uVGltaW5nTWFya3MobWFya3MubmF2aWdhdGlvblRpbWluZyk7XG4gIHZhciBjb21wcmVzc2VkID0ge1xuICAgIG50OiBjb21wcmVzc2VkTnRNYXJrcyxcbiAgICBhOiBjb21wcmVzc0FnZW50TWFya3MoY29tcHJlc3NlZE50TWFya3MsIG1hcmtzLmFnZW50KVxuICB9O1xuICByZXR1cm4gY29tcHJlc3NlZDtcbn1cblxuZnVuY3Rpb24gY29tcHJlc3NOYXZpZ2F0aW9uVGltaW5nTWFya3MobnRNYXJrcykge1xuICBpZiAoIW50TWFya3MpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHZhciBjb21wcmVzc2VkID0ge307XG4gIENPTVBSRVNTRURfTkFWX1RJTUlOR19NQVJLUy5mb3JFYWNoKGZ1bmN0aW9uIChtYXJrLCBpbmRleCkge1xuICAgIHZhciBtYXBwaW5nID0gTkFWSUdBVElPTl9USU1JTkdfTUFSS1NbaW5kZXhdO1xuICAgIGNvbXByZXNzZWRbbWFya10gPSBudE1hcmtzW21hcHBpbmddO1xuICB9KTtcbiAgcmV0dXJuIGNvbXByZXNzZWQ7XG59XG5cbmZ1bmN0aW9uIGNvbXByZXNzQWdlbnRNYXJrcyhjb21wcmVzc2VkTnRNYXJrcywgYWdlbnRNYXJrcykge1xuICB2YXIgY29tcHJlc3NlZCA9IHt9O1xuXG4gIGlmIChjb21wcmVzc2VkTnRNYXJrcykge1xuICAgIGNvbXByZXNzZWQgPSB7XG4gICAgICBmYjogY29tcHJlc3NlZE50TWFya3MucnMsXG4gICAgICBkaTogY29tcHJlc3NlZE50TWFya3MuZGksXG4gICAgICBkYzogY29tcHJlc3NlZE50TWFya3MuZGNcbiAgICB9O1xuICB9XG5cbiAgaWYgKGFnZW50TWFya3MpIHtcbiAgICB2YXIgZnAgPSBhZ2VudE1hcmtzLmZpcnN0Q29udGVudGZ1bFBhaW50O1xuICAgIHZhciBscCA9IGFnZW50TWFya3MubGFyZ2VzdENvbnRlbnRmdWxQYWludDtcblxuICAgIGlmIChmcCkge1xuICAgICAgY29tcHJlc3NlZC5mcCA9IGZwO1xuICAgIH1cblxuICAgIGlmIChscCkge1xuICAgICAgY29tcHJlc3NlZC5scCA9IGxwO1xuICAgIH1cbiAgfVxuXG4gIGlmIChPYmplY3Qua2V5cyhjb21wcmVzc2VkKS5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBjb21wcmVzc2VkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29tcHJlc3NNZXRhZGF0YShtZXRhZGF0YSkge1xuICB2YXIgc2VydmljZSA9IG1ldGFkYXRhLnNlcnZpY2UsXG4gICAgICBsYWJlbHMgPSBtZXRhZGF0YS5sYWJlbHM7XG4gIHZhciBhZ2VudCA9IHNlcnZpY2UuYWdlbnQsXG4gICAgICBsYW5ndWFnZSA9IHNlcnZpY2UubGFuZ3VhZ2U7XG4gIHJldHVybiB7XG4gICAgc2U6IHtcbiAgICAgIG46IHNlcnZpY2UubmFtZSxcbiAgICAgIHZlOiBzZXJ2aWNlLnZlcnNpb24sXG4gICAgICBhOiB7XG4gICAgICAgIG46IGFnZW50Lm5hbWUsXG4gICAgICAgIHZlOiBhZ2VudC52ZXJzaW9uXG4gICAgICB9LFxuICAgICAgbGE6IHtcbiAgICAgICAgbjogbGFuZ3VhZ2UubmFtZVxuICAgICAgfSxcbiAgICAgIGVuOiBzZXJ2aWNlLmVudmlyb25tZW50XG4gICAgfSxcbiAgICBsOiBsYWJlbHNcbiAgfTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjb21wcmVzc1RyYW5zYWN0aW9uKHRyYW5zYWN0aW9uKSB7XG4gIHZhciBzcGFucyA9IHRyYW5zYWN0aW9uLnNwYW5zLm1hcChmdW5jdGlvbiAoc3Bhbikge1xuICAgIHZhciBzcGFuRGF0YSA9IHtcbiAgICAgIGlkOiBzcGFuLmlkLFxuICAgICAgbjogc3Bhbi5uYW1lLFxuICAgICAgdDogc3Bhbi50eXBlLFxuICAgICAgczogc3Bhbi5zdGFydCxcbiAgICAgIGQ6IHNwYW4uZHVyYXRpb24sXG4gICAgICBjOiBjb21wcmVzc0NvbnRleHQoc3Bhbi5jb250ZXh0KSxcbiAgICAgIG86IHNwYW4ub3V0Y29tZSxcbiAgICAgIHNyOiBzcGFuLnNhbXBsZV9yYXRlXG4gICAgfTtcblxuICAgIGlmIChzcGFuLnBhcmVudF9pZCAhPT0gdHJhbnNhY3Rpb24uaWQpIHtcbiAgICAgIHNwYW5EYXRhLnBpZCA9IHNwYW4ucGFyZW50X2lkO1xuICAgIH1cblxuICAgIGlmIChzcGFuLnN5bmMgPT09IHRydWUpIHtcbiAgICAgIHNwYW5EYXRhLnN5ID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoc3Bhbi5zdWJ0eXBlKSB7XG4gICAgICBzcGFuRGF0YS5zdSA9IHNwYW4uc3VidHlwZTtcbiAgICB9XG5cbiAgICBpZiAoc3Bhbi5hY3Rpb24pIHtcbiAgICAgIHNwYW5EYXRhLmFjID0gc3Bhbi5hY3Rpb247XG4gICAgfVxuXG4gICAgcmV0dXJuIHNwYW5EYXRhO1xuICB9KTtcbiAgdmFyIHRyID0ge1xuICAgIGlkOiB0cmFuc2FjdGlvbi5pZCxcbiAgICB0aWQ6IHRyYW5zYWN0aW9uLnRyYWNlX2lkLFxuICAgIG46IHRyYW5zYWN0aW9uLm5hbWUsXG4gICAgdDogdHJhbnNhY3Rpb24udHlwZSxcbiAgICBkOiB0cmFuc2FjdGlvbi5kdXJhdGlvbixcbiAgICBjOiBjb21wcmVzc0NvbnRleHQodHJhbnNhY3Rpb24uY29udGV4dCksXG4gICAgazogY29tcHJlc3NNYXJrcyh0cmFuc2FjdGlvbi5tYXJrcyksXG4gICAgbWU6IGNvbXByZXNzTWV0cmljc2V0cyh0cmFuc2FjdGlvbi5icmVha2Rvd24pLFxuICAgIHk6IHNwYW5zLFxuICAgIHljOiB7XG4gICAgICBzZDogc3BhbnMubGVuZ3RoXG4gICAgfSxcbiAgICBzbTogdHJhbnNhY3Rpb24uc2FtcGxlZCxcbiAgICBzcjogdHJhbnNhY3Rpb24uc2FtcGxlX3JhdGUsXG4gICAgbzogdHJhbnNhY3Rpb24ub3V0Y29tZVxuICB9O1xuXG4gIGlmICh0cmFuc2FjdGlvbi5leHBlcmllbmNlKSB7XG4gICAgdmFyIF90cmFuc2FjdGlvbiRleHBlcmllbiA9IHRyYW5zYWN0aW9uLmV4cGVyaWVuY2UsXG4gICAgICAgIGNscyA9IF90cmFuc2FjdGlvbiRleHBlcmllbi5jbHMsXG4gICAgICAgIGZpZCA9IF90cmFuc2FjdGlvbiRleHBlcmllbi5maWQsXG4gICAgICAgIHRidCA9IF90cmFuc2FjdGlvbiRleHBlcmllbi50YnQsXG4gICAgICAgIGxvbmd0YXNrID0gX3RyYW5zYWN0aW9uJGV4cGVyaWVuLmxvbmd0YXNrO1xuICAgIHRyLmV4cCA9IHtcbiAgICAgIGNsczogY2xzLFxuICAgICAgZmlkOiBmaWQsXG4gICAgICB0YnQ6IHRidCxcbiAgICAgIGx0OiBsb25ndGFza1xuICAgIH07XG4gIH1cblxuICBpZiAodHJhbnNhY3Rpb24uc2Vzc2lvbikge1xuICAgIHZhciBfdHJhbnNhY3Rpb24kc2Vzc2lvbiA9IHRyYW5zYWN0aW9uLnNlc3Npb24sXG4gICAgICAgIGlkID0gX3RyYW5zYWN0aW9uJHNlc3Npb24uaWQsXG4gICAgICAgIHNlcXVlbmNlID0gX3RyYW5zYWN0aW9uJHNlc3Npb24uc2VxdWVuY2U7XG4gICAgdHIuc2VzID0ge1xuICAgICAgaWQ6IGlkLFxuICAgICAgc2VxOiBzZXF1ZW5jZVxuICAgIH07XG4gIH1cblxuICByZXR1cm4gdHI7XG59XG5leHBvcnQgZnVuY3Rpb24gY29tcHJlc3NFcnJvcihlcnJvcikge1xuICB2YXIgZXhjZXB0aW9uID0gZXJyb3IuZXhjZXB0aW9uO1xuICB2YXIgY29tcHJlc3NlZCA9IHtcbiAgICBpZDogZXJyb3IuaWQsXG4gICAgY2w6IGVycm9yLmN1bHByaXQsXG4gICAgZXg6IHtcbiAgICAgIG1nOiBleGNlcHRpb24ubWVzc2FnZSxcbiAgICAgIHN0OiBjb21wcmVzc1N0YWNrRnJhbWVzKGV4Y2VwdGlvbi5zdGFja3RyYWNlKSxcbiAgICAgIHQ6IGVycm9yLnR5cGVcbiAgICB9LFxuICAgIGM6IGNvbXByZXNzQ29udGV4dChlcnJvci5jb250ZXh0KVxuICB9O1xuICB2YXIgdHJhbnNhY3Rpb24gPSBlcnJvci50cmFuc2FjdGlvbjtcblxuICBpZiAodHJhbnNhY3Rpb24pIHtcbiAgICBjb21wcmVzc2VkLnRpZCA9IGVycm9yLnRyYWNlX2lkO1xuICAgIGNvbXByZXNzZWQucGlkID0gZXJyb3IucGFyZW50X2lkO1xuICAgIGNvbXByZXNzZWQueGlkID0gZXJyb3IudHJhbnNhY3Rpb25faWQ7XG4gICAgY29tcHJlc3NlZC54ID0ge1xuICAgICAgdDogdHJhbnNhY3Rpb24udHlwZSxcbiAgICAgIHNtOiB0cmFuc2FjdGlvbi5zYW1wbGVkXG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBjb21wcmVzc2VkO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNvbXByZXNzTWV0cmljc2V0cyhicmVha2Rvd25zKSB7XG4gIHJldHVybiBicmVha2Rvd25zLm1hcChmdW5jdGlvbiAoX3JlZikge1xuICAgIHZhciBzcGFuID0gX3JlZi5zcGFuLFxuICAgICAgICBzYW1wbGVzID0gX3JlZi5zYW1wbGVzO1xuICAgIHJldHVybiB7XG4gICAgICB5OiB7XG4gICAgICAgIHQ6IHNwYW4udHlwZVxuICAgICAgfSxcbiAgICAgIHNhOiB7XG4gICAgICAgIHlzYzoge1xuICAgICAgICAgIHY6IHNhbXBsZXNbJ3NwYW4uc2VsZl90aW1lLmNvdW50J10udmFsdWVcbiAgICAgICAgfSxcbiAgICAgICAgeXNzOiB7XG4gICAgICAgICAgdjogc2FtcGxlc1snc3Bhbi5zZWxmX3RpbWUuc3VtLnVzJ10udmFsdWVcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH0pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNvbXByZXNzUGF5bG9hZChwYXJhbXMsIHR5cGUpIHtcbiAgaWYgKHR5cGUgPT09IHZvaWQgMCkge1xuICAgIHR5cGUgPSAnZ3ppcCc7XG4gIH1cblxuICB2YXIgaXNDb21wcmVzc2lvblN0cmVhbVN1cHBvcnRlZCA9IHR5cGVvZiBDb21wcmVzc2lvblN0cmVhbSA9PT0gJ2Z1bmN0aW9uJztcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG4gICAgaWYgKCFpc0NvbXByZXNzaW9uU3RyZWFtU3VwcG9ydGVkKSB7XG4gICAgICByZXR1cm4gcmVzb2x2ZShwYXJhbXMpO1xuICAgIH1cblxuICAgIGlmIChpc0JlYWNvbkluc3BlY3Rpb25FbmFibGVkKCkpIHtcbiAgICAgIHJldHVybiByZXNvbHZlKHBhcmFtcyk7XG4gICAgfVxuXG4gICAgdmFyIHBheWxvYWQgPSBwYXJhbXMucGF5bG9hZCxcbiAgICAgICAgaGVhZGVycyA9IHBhcmFtcy5oZWFkZXJzLFxuICAgICAgICBiZWZvcmVTZW5kID0gcGFyYW1zLmJlZm9yZVNlbmQ7XG4gICAgdmFyIHBheWxvYWRTdHJlYW0gPSBuZXcgQmxvYihbcGF5bG9hZF0pLnN0cmVhbSgpO1xuICAgIHZhciBjb21wcmVzc2VkU3RyZWFtID0gcGF5bG9hZFN0cmVhbS5waXBlVGhyb3VnaChuZXcgQ29tcHJlc3Npb25TdHJlYW0odHlwZSkpO1xuICAgIHJldHVybiBuZXcgUmVzcG9uc2UoY29tcHJlc3NlZFN0cmVhbSkuYmxvYigpLnRoZW4oZnVuY3Rpb24gKHBheWxvYWQpIHtcbiAgICAgIGhlYWRlcnNbJ0NvbnRlbnQtRW5jb2RpbmcnXSA9IHR5cGU7XG4gICAgICByZXR1cm4gcmVzb2x2ZSh7XG4gICAgICAgIHBheWxvYWQ6IHBheWxvYWQsXG4gICAgICAgIGhlYWRlcnM6IGhlYWRlcnMsXG4gICAgICAgIGJlZm9yZVNlbmQ6IGJlZm9yZVNlbmRcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0iLCJmdW5jdGlvbiBfZXh0ZW5kcygpIHsgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTsgZm9yICh2YXIga2V5IGluIHNvdXJjZSkgeyBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkgeyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IH0gfSByZXR1cm4gdGFyZ2V0OyB9OyByZXR1cm4gX2V4dGVuZHMuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfVxuXG5pbXBvcnQgeyBnZXRDdXJyZW50U2NyaXB0LCBzZXRMYWJlbCwgbWVyZ2UsIGV4dGVuZCwgaXNVbmRlZmluZWQgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCBFdmVudEhhbmRsZXIgZnJvbSAnLi9ldmVudC1oYW5kbGVyJztcbmltcG9ydCB7IENPTkZJR19DSEFOR0UsIExPQ0FMX0NPTkZJR19LRVkgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5cbmZ1bmN0aW9uIGdldENvbmZpZ0Zyb21TY3JpcHQoKSB7XG4gIHZhciBzY3JpcHQgPSBnZXRDdXJyZW50U2NyaXB0KCk7XG4gIHZhciBjb25maWcgPSBnZXREYXRhQXR0cmlidXRlc0Zyb21Ob2RlKHNjcmlwdCk7XG4gIHJldHVybiBjb25maWc7XG59XG5cbmZ1bmN0aW9uIGdldERhdGFBdHRyaWJ1dGVzRnJvbU5vZGUobm9kZSkge1xuICBpZiAoIW5vZGUpIHtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICB2YXIgZGF0YUF0dHJzID0ge307XG4gIHZhciBkYXRhUmVnZXggPSAvXmRhdGEtKFtcXHctXSspJC87XG4gIHZhciBhdHRycyA9IG5vZGUuYXR0cmlidXRlcztcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGF0dHJzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGF0dHIgPSBhdHRyc1tpXTtcblxuICAgIGlmIChkYXRhUmVnZXgudGVzdChhdHRyLm5vZGVOYW1lKSkge1xuICAgICAgdmFyIGtleSA9IGF0dHIubm9kZU5hbWUubWF0Y2goZGF0YVJlZ2V4KVsxXTtcbiAgICAgIHZhciBjYW1lbENhc2Vka2V5ID0ga2V5LnNwbGl0KCctJykubWFwKGZ1bmN0aW9uICh2YWx1ZSwgaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIGluZGV4ID4gMCA/IHZhbHVlLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgdmFsdWUuc3Vic3RyaW5nKDEpIDogdmFsdWU7XG4gICAgICB9KS5qb2luKCcnKTtcbiAgICAgIGRhdGFBdHRyc1tjYW1lbENhc2Vka2V5XSA9IGF0dHIudmFsdWUgfHwgYXR0ci5ub2RlVmFsdWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGRhdGFBdHRycztcbn1cblxudmFyIENvbmZpZyA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gQ29uZmlnKCkge1xuICAgIHRoaXMuY29uZmlnID0ge1xuICAgICAgc2VydmljZU5hbWU6ICcnLFxuICAgICAgc2VydmljZVZlcnNpb246ICcnLFxuICAgICAgZW52aXJvbm1lbnQ6ICcnLFxuICAgICAgc2VydmVyVXJsOiAnaHR0cDovL2xvY2FsaG9zdDo4MjAwJyxcbiAgICAgIHNlcnZlclVybFByZWZpeDogJycsXG4gICAgICBhY3RpdmU6IHRydWUsXG4gICAgICBpbnN0cnVtZW50OiB0cnVlLFxuICAgICAgZGlzYWJsZUluc3RydW1lbnRhdGlvbnM6IFtdLFxuICAgICAgbG9nTGV2ZWw6ICd3YXJuJyxcbiAgICAgIGJyZWFrZG93bk1ldHJpY3M6IGZhbHNlLFxuICAgICAgaWdub3JlVHJhbnNhY3Rpb25zOiBbXSxcbiAgICAgIGV2ZW50c0xpbWl0OiA4MCxcbiAgICAgIHF1ZXVlTGltaXQ6IC0xLFxuICAgICAgZmx1c2hJbnRlcnZhbDogNTAwLFxuICAgICAgZGlzdHJpYnV0ZWRUcmFjaW5nOiB0cnVlLFxuICAgICAgZGlzdHJpYnV0ZWRUcmFjaW5nT3JpZ2luczogW10sXG4gICAgICBkaXN0cmlidXRlZFRyYWNpbmdIZWFkZXJOYW1lOiAndHJhY2VwYXJlbnQnLFxuICAgICAgcGFnZUxvYWRUcmFjZUlkOiAnJyxcbiAgICAgIHBhZ2VMb2FkU3BhbklkOiAnJyxcbiAgICAgIHBhZ2VMb2FkU2FtcGxlZDogZmFsc2UsXG4gICAgICBwYWdlTG9hZFRyYW5zYWN0aW9uTmFtZTogJycsXG4gICAgICBwcm9wYWdhdGVUcmFjZXN0YXRlOiBmYWxzZSxcbiAgICAgIHRyYW5zYWN0aW9uU2FtcGxlUmF0ZTogMS4wLFxuICAgICAgY2VudHJhbENvbmZpZzogZmFsc2UsXG4gICAgICBtb25pdG9yTG9uZ3Rhc2tzOiB0cnVlLFxuICAgICAgYXBpVmVyc2lvbjogMixcbiAgICAgIGNvbnRleHQ6IHt9LFxuICAgICAgc2Vzc2lvbjogZmFsc2UsXG4gICAgICBhcG1SZXF1ZXN0OiBudWxsLFxuICAgICAgc2VuZENyZWRlbnRpYWxzOiBmYWxzZVxuICAgIH07XG4gICAgdGhpcy5ldmVudHMgPSBuZXcgRXZlbnRIYW5kbGVyKCk7XG4gICAgdGhpcy5maWx0ZXJzID0gW107XG4gICAgdGhpcy52ZXJzaW9uID0gJyc7XG4gIH1cblxuICB2YXIgX3Byb3RvID0gQ29uZmlnLnByb3RvdHlwZTtcblxuICBfcHJvdG8uaW5pdCA9IGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgdmFyIHNjcmlwdERhdGEgPSBnZXRDb25maWdGcm9tU2NyaXB0KCk7XG4gICAgdGhpcy5zZXRDb25maWcoc2NyaXB0RGF0YSk7XG4gIH07XG5cbiAgX3Byb3RvLnNldFZlcnNpb24gPSBmdW5jdGlvbiBzZXRWZXJzaW9uKHZlcnNpb24pIHtcbiAgICB0aGlzLnZlcnNpb24gPSB2ZXJzaW9uO1xuICB9O1xuXG4gIF9wcm90by5hZGRGaWx0ZXIgPSBmdW5jdGlvbiBhZGRGaWx0ZXIoY2IpIHtcbiAgICBpZiAodHlwZW9mIGNiICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FyZ3VtZW50IHRvIG11c3QgYmUgZnVuY3Rpb24nKTtcbiAgICB9XG5cbiAgICB0aGlzLmZpbHRlcnMucHVzaChjYik7XG4gIH07XG5cbiAgX3Byb3RvLmFwcGx5RmlsdGVycyA9IGZ1bmN0aW9uIGFwcGx5RmlsdGVycyhkYXRhKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmZpbHRlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGRhdGEgPSB0aGlzLmZpbHRlcnNbaV0oZGF0YSk7XG5cbiAgICAgIGlmICghZGF0YSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH07XG5cbiAgX3Byb3RvLmdldCA9IGZ1bmN0aW9uIGdldChrZXkpIHtcbiAgICByZXR1cm4ga2V5LnNwbGl0KCcuJykucmVkdWNlKGZ1bmN0aW9uIChvYmosIG9iaktleSkge1xuICAgICAgcmV0dXJuIG9iaiAmJiBvYmpbb2JqS2V5XTtcbiAgICB9LCB0aGlzLmNvbmZpZyk7XG4gIH07XG5cbiAgX3Byb3RvLnNldFVzZXJDb250ZXh0ID0gZnVuY3Rpb24gc2V0VXNlckNvbnRleHQodXNlckNvbnRleHQpIHtcbiAgICBpZiAodXNlckNvbnRleHQgPT09IHZvaWQgMCkge1xuICAgICAgdXNlckNvbnRleHQgPSB7fTtcbiAgICB9XG5cbiAgICB2YXIgY29udGV4dCA9IHt9O1xuICAgIHZhciBfdXNlckNvbnRleHQgPSB1c2VyQ29udGV4dCxcbiAgICAgICAgaWQgPSBfdXNlckNvbnRleHQuaWQsXG4gICAgICAgIHVzZXJuYW1lID0gX3VzZXJDb250ZXh0LnVzZXJuYW1lLFxuICAgICAgICBlbWFpbCA9IF91c2VyQ29udGV4dC5lbWFpbDtcblxuICAgIGlmICh0eXBlb2YgaWQgPT09ICdudW1iZXInIHx8IHR5cGVvZiBpZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGNvbnRleHQuaWQgPSBpZDtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHVzZXJuYW1lID09PSAnc3RyaW5nJykge1xuICAgICAgY29udGV4dC51c2VybmFtZSA9IHVzZXJuYW1lO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgZW1haWwgPT09ICdzdHJpbmcnKSB7XG4gICAgICBjb250ZXh0LmVtYWlsID0gZW1haWw7XG4gICAgfVxuXG4gICAgdGhpcy5jb25maWcuY29udGV4dC51c2VyID0gZXh0ZW5kKHRoaXMuY29uZmlnLmNvbnRleHQudXNlciB8fCB7fSwgY29udGV4dCk7XG4gIH07XG5cbiAgX3Byb3RvLnNldEN1c3RvbUNvbnRleHQgPSBmdW5jdGlvbiBzZXRDdXN0b21Db250ZXh0KGN1c3RvbUNvbnRleHQpIHtcbiAgICBpZiAoY3VzdG9tQ29udGV4dCA9PT0gdm9pZCAwKSB7XG4gICAgICBjdXN0b21Db250ZXh0ID0ge307XG4gICAgfVxuXG4gICAgdGhpcy5jb25maWcuY29udGV4dC5jdXN0b20gPSBleHRlbmQodGhpcy5jb25maWcuY29udGV4dC5jdXN0b20gfHwge30sIGN1c3RvbUNvbnRleHQpO1xuICB9O1xuXG4gIF9wcm90by5hZGRMYWJlbHMgPSBmdW5jdGlvbiBhZGRMYWJlbHModGFncykge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZiAoIXRoaXMuY29uZmlnLmNvbnRleHQudGFncykge1xuICAgICAgdGhpcy5jb25maWcuY29udGV4dC50YWdzID0ge307XG4gICAgfVxuXG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh0YWdzKTtcbiAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24gKGspIHtcbiAgICAgIHJldHVybiBzZXRMYWJlbChrLCB0YWdzW2tdLCBfdGhpcy5jb25maWcuY29udGV4dC50YWdzKTtcbiAgICB9KTtcbiAgfTtcblxuICBfcHJvdG8uc2V0Q29uZmlnID0gZnVuY3Rpb24gc2V0Q29uZmlnKHByb3BlcnRpZXMpIHtcbiAgICBpZiAocHJvcGVydGllcyA9PT0gdm9pZCAwKSB7XG4gICAgICBwcm9wZXJ0aWVzID0ge307XG4gICAgfVxuXG4gICAgdmFyIF9wcm9wZXJ0aWVzID0gcHJvcGVydGllcyxcbiAgICAgICAgdHJhbnNhY3Rpb25TYW1wbGVSYXRlID0gX3Byb3BlcnRpZXMudHJhbnNhY3Rpb25TYW1wbGVSYXRlLFxuICAgICAgICBzZXJ2ZXJVcmwgPSBfcHJvcGVydGllcy5zZXJ2ZXJVcmw7XG5cbiAgICBpZiAoc2VydmVyVXJsKSB7XG4gICAgICBwcm9wZXJ0aWVzLnNlcnZlclVybCA9IHNlcnZlclVybC5yZXBsYWNlKC9cXC8rJC8sICcnKTtcbiAgICB9XG5cbiAgICBpZiAoIWlzVW5kZWZpbmVkKHRyYW5zYWN0aW9uU2FtcGxlUmF0ZSkpIHtcbiAgICAgIGlmICh0cmFuc2FjdGlvblNhbXBsZVJhdGUgPCAwLjAwMDEgJiYgdHJhbnNhY3Rpb25TYW1wbGVSYXRlID4gMCkge1xuICAgICAgICB0cmFuc2FjdGlvblNhbXBsZVJhdGUgPSAwLjAwMDE7XG4gICAgICB9XG5cbiAgICAgIHByb3BlcnRpZXMudHJhbnNhY3Rpb25TYW1wbGVSYXRlID0gTWF0aC5yb3VuZCh0cmFuc2FjdGlvblNhbXBsZVJhdGUgKiAxMDAwMCkgLyAxMDAwMDtcbiAgICB9XG5cbiAgICBtZXJnZSh0aGlzLmNvbmZpZywgcHJvcGVydGllcyk7XG4gICAgdGhpcy5ldmVudHMuc2VuZChDT05GSUdfQ0hBTkdFLCBbdGhpcy5jb25maWddKTtcbiAgfTtcblxuICBfcHJvdG8udmFsaWRhdGUgPSBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wZXJ0aWVzKSB7XG4gICAgaWYgKHByb3BlcnRpZXMgPT09IHZvaWQgMCkge1xuICAgICAgcHJvcGVydGllcyA9IHt9O1xuICAgIH1cblxuICAgIHZhciByZXF1aXJlZEtleXMgPSBbJ3NlcnZpY2VOYW1lJywgJ3NlcnZlclVybCddO1xuICAgIHZhciBhbGxLZXlzID0gT2JqZWN0LmtleXModGhpcy5jb25maWcpO1xuICAgIHZhciBlcnJvcnMgPSB7XG4gICAgICBtaXNzaW5nOiBbXSxcbiAgICAgIGludmFsaWQ6IFtdLFxuICAgICAgdW5rbm93bjogW11cbiAgICB9O1xuICAgIE9iamVjdC5rZXlzKHByb3BlcnRpZXMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgaWYgKHJlcXVpcmVkS2V5cy5pbmRleE9mKGtleSkgIT09IC0xICYmICFwcm9wZXJ0aWVzW2tleV0pIHtcbiAgICAgICAgZXJyb3JzLm1pc3NpbmcucHVzaChrZXkpO1xuICAgICAgfVxuXG4gICAgICBpZiAoYWxsS2V5cy5pbmRleE9mKGtleSkgPT09IC0xKSB7XG4gICAgICAgIGVycm9ycy51bmtub3duLnB1c2goa2V5KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmIChwcm9wZXJ0aWVzLnNlcnZpY2VOYW1lICYmICEvXlthLXpBLVowLTkgXy1dKyQvLnRlc3QocHJvcGVydGllcy5zZXJ2aWNlTmFtZSkpIHtcbiAgICAgIGVycm9ycy5pbnZhbGlkLnB1c2goe1xuICAgICAgICBrZXk6ICdzZXJ2aWNlTmFtZScsXG4gICAgICAgIHZhbHVlOiBwcm9wZXJ0aWVzLnNlcnZpY2VOYW1lLFxuICAgICAgICBhbGxvd2VkOiAnYS16LCBBLVosIDAtOSwgXywgLSwgPHNwYWNlPidcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHZhciBzYW1wbGVSYXRlID0gcHJvcGVydGllcy50cmFuc2FjdGlvblNhbXBsZVJhdGU7XG5cbiAgICBpZiAodHlwZW9mIHNhbXBsZVJhdGUgIT09ICd1bmRlZmluZWQnICYmICh0eXBlb2Ygc2FtcGxlUmF0ZSAhPT0gJ251bWJlcicgfHwgaXNOYU4oc2FtcGxlUmF0ZSkgfHwgc2FtcGxlUmF0ZSA8IDAgfHwgc2FtcGxlUmF0ZSA+IDEpKSB7XG4gICAgICBlcnJvcnMuaW52YWxpZC5wdXNoKHtcbiAgICAgICAga2V5OiAndHJhbnNhY3Rpb25TYW1wbGVSYXRlJyxcbiAgICAgICAgdmFsdWU6IHNhbXBsZVJhdGUsXG4gICAgICAgIGFsbG93ZWQ6ICdOdW1iZXIgYmV0d2VlbiAwIGFuZCAxJ1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVycm9ycztcbiAgfTtcblxuICBfcHJvdG8uZ2V0TG9jYWxDb25maWcgPSBmdW5jdGlvbiBnZXRMb2NhbENvbmZpZygpIHtcbiAgICB2YXIgc3RvcmFnZSA9IHNlc3Npb25TdG9yYWdlO1xuXG4gICAgaWYgKHRoaXMuY29uZmlnLnNlc3Npb24pIHtcbiAgICAgIHN0b3JhZ2UgPSBsb2NhbFN0b3JhZ2U7XG4gICAgfVxuXG4gICAgdmFyIGNvbmZpZyA9IHN0b3JhZ2UuZ2V0SXRlbShMT0NBTF9DT05GSUdfS0VZKTtcblxuICAgIGlmIChjb25maWcpIHtcbiAgICAgIHJldHVybiBKU09OLnBhcnNlKGNvbmZpZyk7XG4gICAgfVxuICB9O1xuXG4gIF9wcm90by5zZXRMb2NhbENvbmZpZyA9IGZ1bmN0aW9uIHNldExvY2FsQ29uZmlnKGNvbmZpZywgbWVyZ2UpIHtcbiAgICBpZiAoY29uZmlnKSB7XG4gICAgICBpZiAobWVyZ2UpIHtcbiAgICAgICAgdmFyIHByZXZDb25maWcgPSB0aGlzLmdldExvY2FsQ29uZmlnKCk7XG4gICAgICAgIGNvbmZpZyA9IF9leHRlbmRzKHt9LCBwcmV2Q29uZmlnLCBjb25maWcpO1xuICAgICAgfVxuXG4gICAgICB2YXIgc3RvcmFnZSA9IHNlc3Npb25TdG9yYWdlO1xuXG4gICAgICBpZiAodGhpcy5jb25maWcuc2Vzc2lvbikge1xuICAgICAgICBzdG9yYWdlID0gbG9jYWxTdG9yYWdlO1xuICAgICAgfVxuXG4gICAgICBzdG9yYWdlLnNldEl0ZW0oTE9DQUxfQ09ORklHX0tFWSwgSlNPTi5zdHJpbmdpZnkoY29uZmlnKSk7XG4gICAgfVxuICB9O1xuXG4gIF9wcm90by5kaXNwYXRjaEV2ZW50ID0gZnVuY3Rpb24gZGlzcGF0Y2hFdmVudChuYW1lLCBhcmdzKSB7XG4gICAgdGhpcy5ldmVudHMuc2VuZChuYW1lLCBhcmdzKTtcbiAgfTtcblxuICBfcHJvdG8ub2JzZXJ2ZUV2ZW50ID0gZnVuY3Rpb24gb2JzZXJ2ZUV2ZW50KG5hbWUsIGZuKSB7XG4gICAgcmV0dXJuIHRoaXMuZXZlbnRzLm9ic2VydmUobmFtZSwgZm4pO1xuICB9O1xuXG4gIHJldHVybiBDb25maWc7XG59KCk7XG5cbmV4cG9ydCBkZWZhdWx0IENvbmZpZzsiLCJ2YXIgU0NIRURVTEUgPSAnc2NoZWR1bGUnO1xudmFyIElOVk9LRSA9ICdpbnZva2UnO1xudmFyIEFERF9FVkVOVF9MSVNURU5FUl9TVFIgPSAnYWRkRXZlbnRMaXN0ZW5lcic7XG52YXIgUkVNT1ZFX0VWRU5UX0xJU1RFTkVSX1NUUiA9ICdyZW1vdmVFdmVudExpc3RlbmVyJztcbnZhciBSRVNPVVJDRV9JTklUSUFUT1JfVFlQRVMgPSBbJ2xpbmsnLCAnY3NzJywgJ3NjcmlwdCcsICdpbWcnLCAneG1saHR0cHJlcXVlc3QnLCAnZmV0Y2gnLCAnYmVhY29uJywgJ2lmcmFtZSddO1xudmFyIFJFVVNBQklMSVRZX1RIUkVTSE9MRCA9IDUwMDA7XG52YXIgTUFYX1NQQU5fRFVSQVRJT04gPSA1ICogNjAgKiAxMDAwO1xudmFyIFBBR0VfTE9BRF9ERUxBWSA9IDEwMDA7XG52YXIgUEFHRV9MT0FEID0gJ3BhZ2UtbG9hZCc7XG52YXIgUk9VVEVfQ0hBTkdFID0gJ3JvdXRlLWNoYW5nZSc7XG52YXIgVFlQRV9DVVNUT00gPSAnY3VzdG9tJztcbnZhciBVU0VSX0lOVEVSQUNUSU9OID0gJ3VzZXItaW50ZXJhY3Rpb24nO1xudmFyIEhUVFBfUkVRVUVTVF9UWVBFID0gJ2h0dHAtcmVxdWVzdCc7XG52YXIgVEVNUE9SQVJZX1RZUEUgPSAndGVtcG9yYXJ5JztcbnZhciBOQU1FX1VOS05PV04gPSAnVW5rbm93bic7XG52YXIgVFJBTlNBQ1RJT05fVFlQRV9PUkRFUiA9IFtQQUdFX0xPQUQsIFJPVVRFX0NIQU5HRSwgVVNFUl9JTlRFUkFDVElPTiwgSFRUUF9SRVFVRVNUX1RZUEUsIFRZUEVfQ1VTVE9NLCBURU1QT1JBUllfVFlQRV07XG52YXIgT1VUQ09NRV9TVUNDRVNTID0gJ3N1Y2Nlc3MnO1xudmFyIE9VVENPTUVfRkFJTFVSRSA9ICdmYWlsdXJlJztcbnZhciBPVVRDT01FX1VOS05PV04gPSAndW5rbm93bic7XG52YXIgVVNFUl9USU1JTkdfVEhSRVNIT0xEID0gNjA7XG52YXIgVFJBTlNBQ1RJT05fU1RBUlQgPSAndHJhbnNhY3Rpb246c3RhcnQnO1xudmFyIFRSQU5TQUNUSU9OX0VORCA9ICd0cmFuc2FjdGlvbjplbmQnO1xudmFyIENPTkZJR19DSEFOR0UgPSAnY29uZmlnOmNoYW5nZSc7XG52YXIgUVVFVUVfRkxVU0ggPSAncXVldWU6Zmx1c2gnO1xudmFyIFFVRVVFX0FERF9UUkFOU0FDVElPTiA9ICdxdWV1ZTphZGRfdHJhbnNhY3Rpb24nO1xudmFyIFhNTEhUVFBSRVFVRVNUID0gJ3htbGh0dHByZXF1ZXN0JztcbnZhciBGRVRDSCA9ICdmZXRjaCc7XG52YXIgSElTVE9SWSA9ICdoaXN0b3J5JztcbnZhciBFVkVOVF9UQVJHRVQgPSAnZXZlbnR0YXJnZXQnO1xudmFyIENMSUNLID0gJ2NsaWNrJztcbnZhciBFUlJPUiA9ICdlcnJvcic7XG52YXIgQkVGT1JFX0VWRU5UID0gJzpiZWZvcmUnO1xudmFyIEFGVEVSX0VWRU5UID0gJzphZnRlcic7XG52YXIgTE9DQUxfQ09ORklHX0tFWSA9ICdlbGFzdGljX2FwbV9jb25maWcnO1xudmFyIExPTkdfVEFTSyA9ICdsb25ndGFzayc7XG52YXIgUEFJTlQgPSAncGFpbnQnO1xudmFyIE1FQVNVUkUgPSAnbWVhc3VyZSc7XG52YXIgTkFWSUdBVElPTiA9ICduYXZpZ2F0aW9uJztcbnZhciBSRVNPVVJDRSA9ICdyZXNvdXJjZSc7XG52YXIgRklSU1RfQ09OVEVOVEZVTF9QQUlOVCA9ICdmaXJzdC1jb250ZW50ZnVsLXBhaW50JztcbnZhciBMQVJHRVNUX0NPTlRFTlRGVUxfUEFJTlQgPSAnbGFyZ2VzdC1jb250ZW50ZnVsLXBhaW50JztcbnZhciBGSVJTVF9JTlBVVCA9ICdmaXJzdC1pbnB1dCc7XG52YXIgTEFZT1VUX1NISUZUID0gJ2xheW91dC1zaGlmdCc7XG52YXIgRVJST1JTID0gJ2Vycm9ycyc7XG52YXIgVFJBTlNBQ1RJT05TID0gJ3RyYW5zYWN0aW9ucyc7XG52YXIgQ09ORklHX1NFUlZJQ0UgPSAnQ29uZmlnU2VydmljZSc7XG52YXIgTE9HR0lOR19TRVJWSUNFID0gJ0xvZ2dpbmdTZXJ2aWNlJztcbnZhciBUUkFOU0FDVElPTl9TRVJWSUNFID0gJ1RyYW5zYWN0aW9uU2VydmljZSc7XG52YXIgQVBNX1NFUlZFUiA9ICdBcG1TZXJ2ZXInO1xudmFyIFBFUkZPUk1BTkNFX01PTklUT1JJTkcgPSAnUGVyZm9ybWFuY2VNb25pdG9yaW5nJztcbnZhciBFUlJPUl9MT0dHSU5HID0gJ0Vycm9yTG9nZ2luZyc7XG52YXIgVFJVTkNBVEVEX1RZUEUgPSAnLnRydW5jYXRlZCc7XG52YXIgS0VZV09SRF9MSU1JVCA9IDEwMjQ7XG52YXIgU0VTU0lPTl9USU1FT1VUID0gMzAgKiA2MDAwMDtcbnZhciBIVFRQX1JFUVVFU1RfVElNRU9VVCA9IDEwMDAwO1xuZXhwb3J0IHsgU0NIRURVTEUsIElOVk9LRSwgQUREX0VWRU5UX0xJU1RFTkVSX1NUUiwgUkVNT1ZFX0VWRU5UX0xJU1RFTkVSX1NUUiwgUkVTT1VSQ0VfSU5JVElBVE9SX1RZUEVTLCBSRVVTQUJJTElUWV9USFJFU0hPTEQsIE1BWF9TUEFOX0RVUkFUSU9OLCBQQUdFX0xPQURfREVMQVksIFBBR0VfTE9BRCwgUk9VVEVfQ0hBTkdFLCBOQU1FX1VOS05PV04sIFRZUEVfQ1VTVE9NLCBVU0VSX1RJTUlOR19USFJFU0hPTEQsIFRSQU5TQUNUSU9OX1NUQVJULCBUUkFOU0FDVElPTl9FTkQsIENPTkZJR19DSEFOR0UsIFFVRVVFX0ZMVVNILCBRVUVVRV9BRERfVFJBTlNBQ1RJT04sIFhNTEhUVFBSRVFVRVNULCBGRVRDSCwgSElTVE9SWSwgRVZFTlRfVEFSR0VULCBDTElDSywgRVJST1IsIEJFRk9SRV9FVkVOVCwgQUZURVJfRVZFTlQsIExPQ0FMX0NPTkZJR19LRVksIEhUVFBfUkVRVUVTVF9UWVBFLCBMT05HX1RBU0ssIFBBSU5ULCBNRUFTVVJFLCBOQVZJR0FUSU9OLCBSRVNPVVJDRSwgRklSU1RfQ09OVEVOVEZVTF9QQUlOVCwgTEFSR0VTVF9DT05URU5URlVMX1BBSU5ULCBLRVlXT1JEX0xJTUlULCBURU1QT1JBUllfVFlQRSwgVVNFUl9JTlRFUkFDVElPTiwgVFJBTlNBQ1RJT05fVFlQRV9PUkRFUiwgRVJST1JTLCBUUkFOU0FDVElPTlMsIENPTkZJR19TRVJWSUNFLCBMT0dHSU5HX1NFUlZJQ0UsIFRSQU5TQUNUSU9OX1NFUlZJQ0UsIEFQTV9TRVJWRVIsIFBFUkZPUk1BTkNFX01PTklUT1JJTkcsIEVSUk9SX0xPR0dJTkcsIFRSVU5DQVRFRF9UWVBFLCBGSVJTVF9JTlBVVCwgTEFZT1VUX1NISUZULCBPVVRDT01FX1NVQ0NFU1MsIE9VVENPTUVfRkFJTFVSRSwgT1VUQ09NRV9VTktOT1dOLCBTRVNTSU9OX1RJTUVPVVQsIEhUVFBfUkVRVUVTVF9USU1FT1VUIH07IiwidmFyIF9leGNsdWRlZCA9IFtcInRhZ3NcIl07XG5cbmZ1bmN0aW9uIF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlKHNvdXJjZSwgZXhjbHVkZWQpIHsgaWYgKHNvdXJjZSA9PSBudWxsKSByZXR1cm4ge307IHZhciB0YXJnZXQgPSB7fTsgdmFyIHNvdXJjZUtleXMgPSBPYmplY3Qua2V5cyhzb3VyY2UpOyB2YXIga2V5LCBpOyBmb3IgKGkgPSAwOyBpIDwgc291cmNlS2V5cy5sZW5ndGg7IGkrKykgeyBrZXkgPSBzb3VyY2VLZXlzW2ldOyBpZiAoZXhjbHVkZWQuaW5kZXhPZihrZXkpID49IDApIGNvbnRpbnVlOyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IHJldHVybiB0YXJnZXQ7IH1cblxuaW1wb3J0IHsgVXJsIH0gZnJvbSAnLi91cmwnO1xuaW1wb3J0IHsgUEFHRV9MT0FELCBOQVZJR0FUSU9OIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgZ2V0U2VydmVyVGltaW5nSW5mbywgUEVSRiwgaXNQZXJmVGltZWxpbmVTdXBwb3J0ZWQgfSBmcm9tICcuL3V0aWxzJztcbnZhciBMRUZUX1NRVUFSRV9CUkFDS0VUID0gOTE7XG52YXIgUklHSFRfU1FVQVJFX0JSQUNLRVQgPSA5MztcbnZhciBFWFRFUk5BTCA9ICdleHRlcm5hbCc7XG52YXIgUkVTT1VSQ0UgPSAncmVzb3VyY2UnO1xudmFyIEhBUkRfTkFWSUdBVElPTiA9ICdoYXJkLW5hdmlnYXRpb24nO1xuXG5mdW5jdGlvbiBnZXRQb3J0TnVtYmVyKHBvcnQsIHByb3RvY29sKSB7XG4gIGlmIChwb3J0ID09PSAnJykge1xuICAgIHBvcnQgPSBwcm90b2NvbCA9PT0gJ2h0dHA6JyA/ICc4MCcgOiBwcm90b2NvbCA9PT0gJ2h0dHBzOicgPyAnNDQzJyA6ICcnO1xuICB9XG5cbiAgcmV0dXJuIHBvcnQ7XG59XG5cbmZ1bmN0aW9uIGdldFJlc3BvbnNlQ29udGV4dChwZXJmVGltaW5nRW50cnkpIHtcbiAgdmFyIHRyYW5zZmVyU2l6ZSA9IHBlcmZUaW1pbmdFbnRyeS50cmFuc2ZlclNpemUsXG4gICAgICBlbmNvZGVkQm9keVNpemUgPSBwZXJmVGltaW5nRW50cnkuZW5jb2RlZEJvZHlTaXplLFxuICAgICAgZGVjb2RlZEJvZHlTaXplID0gcGVyZlRpbWluZ0VudHJ5LmRlY29kZWRCb2R5U2l6ZSxcbiAgICAgIHNlcnZlclRpbWluZyA9IHBlcmZUaW1pbmdFbnRyeS5zZXJ2ZXJUaW1pbmc7XG4gIHZhciByZXNwQ29udGV4dCA9IHtcbiAgICB0cmFuc2Zlcl9zaXplOiB0cmFuc2ZlclNpemUsXG4gICAgZW5jb2RlZF9ib2R5X3NpemU6IGVuY29kZWRCb2R5U2l6ZSxcbiAgICBkZWNvZGVkX2JvZHlfc2l6ZTogZGVjb2RlZEJvZHlTaXplXG4gIH07XG4gIHZhciBzZXJ2ZXJUaW1pbmdTdHIgPSBnZXRTZXJ2ZXJUaW1pbmdJbmZvKHNlcnZlclRpbWluZyk7XG5cbiAgaWYgKHNlcnZlclRpbWluZ1N0cikge1xuICAgIHJlc3BDb250ZXh0LmhlYWRlcnMgPSB7XG4gICAgICAnc2VydmVyLXRpbWluZyc6IHNlcnZlclRpbWluZ1N0clxuICAgIH07XG4gIH1cblxuICByZXR1cm4gcmVzcENvbnRleHQ7XG59XG5cbmZ1bmN0aW9uIGdldERlc3RpbmF0aW9uKHBhcnNlZFVybCkge1xuICB2YXIgcG9ydCA9IHBhcnNlZFVybC5wb3J0LFxuICAgICAgcHJvdG9jb2wgPSBwYXJzZWRVcmwucHJvdG9jb2wsXG4gICAgICBob3N0bmFtZSA9IHBhcnNlZFVybC5ob3N0bmFtZTtcbiAgdmFyIHBvcnROdW1iZXIgPSBnZXRQb3J0TnVtYmVyKHBvcnQsIHByb3RvY29sKTtcbiAgdmFyIGlwdjZIb3N0bmFtZSA9IGhvc3RuYW1lLmNoYXJDb2RlQXQoMCkgPT09IExFRlRfU1FVQVJFX0JSQUNLRVQgJiYgaG9zdG5hbWUuY2hhckNvZGVBdChob3N0bmFtZS5sZW5ndGggLSAxKSA9PT0gUklHSFRfU1FVQVJFX0JSQUNLRVQ7XG4gIHZhciBhZGRyZXNzID0gaG9zdG5hbWU7XG5cbiAgaWYgKGlwdjZIb3N0bmFtZSkge1xuICAgIGFkZHJlc3MgPSBob3N0bmFtZS5zbGljZSgxLCAtMSk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHNlcnZpY2U6IHtcbiAgICAgIHJlc291cmNlOiBob3N0bmFtZSArICc6JyArIHBvcnROdW1iZXIsXG4gICAgICBuYW1lOiAnJyxcbiAgICAgIHR5cGU6ICcnXG4gICAgfSxcbiAgICBhZGRyZXNzOiBhZGRyZXNzLFxuICAgIHBvcnQ6IE51bWJlcihwb3J0TnVtYmVyKVxuICB9O1xufVxuXG5mdW5jdGlvbiBnZXRSZXNvdXJjZUNvbnRleHQoZGF0YSkge1xuICB2YXIgZW50cnkgPSBkYXRhLmVudHJ5LFxuICAgICAgdXJsID0gZGF0YS51cmw7XG4gIHZhciBwYXJzZWRVcmwgPSBuZXcgVXJsKHVybCk7XG4gIHZhciBkZXN0aW5hdGlvbiA9IGdldERlc3RpbmF0aW9uKHBhcnNlZFVybCk7XG4gIHJldHVybiB7XG4gICAgaHR0cDoge1xuICAgICAgdXJsOiB1cmwsXG4gICAgICByZXNwb25zZTogZ2V0UmVzcG9uc2VDb250ZXh0KGVudHJ5KVxuICAgIH0sXG4gICAgZGVzdGluYXRpb246IGRlc3RpbmF0aW9uXG4gIH07XG59XG5cbmZ1bmN0aW9uIGdldEV4dGVybmFsQ29udGV4dChkYXRhKSB7XG4gIHZhciB1cmwgPSBkYXRhLnVybCxcbiAgICAgIG1ldGhvZCA9IGRhdGEubWV0aG9kLFxuICAgICAgdGFyZ2V0ID0gZGF0YS50YXJnZXQsXG4gICAgICByZXNwb25zZSA9IGRhdGEucmVzcG9uc2U7XG4gIHZhciBwYXJzZWRVcmwgPSBuZXcgVXJsKHVybCk7XG4gIHZhciBkZXN0aW5hdGlvbiA9IGdldERlc3RpbmF0aW9uKHBhcnNlZFVybCk7XG4gIHZhciBjb250ZXh0ID0ge1xuICAgIGh0dHA6IHtcbiAgICAgIG1ldGhvZDogbWV0aG9kLFxuICAgICAgdXJsOiBwYXJzZWRVcmwuaHJlZlxuICAgIH0sXG4gICAgZGVzdGluYXRpb246IGRlc3RpbmF0aW9uXG4gIH07XG4gIHZhciBzdGF0dXNDb2RlO1xuXG4gIGlmICh0YXJnZXQgJiYgdHlwZW9mIHRhcmdldC5zdGF0dXMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgc3RhdHVzQ29kZSA9IHRhcmdldC5zdGF0dXM7XG4gIH0gZWxzZSBpZiAocmVzcG9uc2UpIHtcbiAgICBzdGF0dXNDb2RlID0gcmVzcG9uc2Uuc3RhdHVzO1xuICB9XG5cbiAgY29udGV4dC5odHRwLnN0YXR1c19jb2RlID0gc3RhdHVzQ29kZTtcbiAgcmV0dXJuIGNvbnRleHQ7XG59XG5cbmZ1bmN0aW9uIGdldE5hdmlnYXRpb25Db250ZXh0KGRhdGEpIHtcbiAgdmFyIHVybCA9IGRhdGEudXJsO1xuICB2YXIgcGFyc2VkVXJsID0gbmV3IFVybCh1cmwpO1xuICB2YXIgZGVzdGluYXRpb24gPSBnZXREZXN0aW5hdGlvbihwYXJzZWRVcmwpO1xuICByZXR1cm4ge1xuICAgIGRlc3RpbmF0aW9uOiBkZXN0aW5hdGlvblxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGFnZUNvbnRleHQoKSB7XG4gIHJldHVybiB7XG4gICAgcGFnZToge1xuICAgICAgcmVmZXJlcjogZG9jdW1lbnQucmVmZXJyZXIsXG4gICAgICB1cmw6IGxvY2F0aW9uLmhyZWZcbiAgICB9XG4gIH07XG59XG5leHBvcnQgZnVuY3Rpb24gYWRkU3BhbkNvbnRleHQoc3BhbiwgZGF0YSkge1xuICBpZiAoIWRhdGEpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgdHlwZSA9IHNwYW4udHlwZTtcbiAgdmFyIGNvbnRleHQ7XG5cbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSBFWFRFUk5BTDpcbiAgICAgIGNvbnRleHQgPSBnZXRFeHRlcm5hbENvbnRleHQoZGF0YSk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgUkVTT1VSQ0U6XG4gICAgICBjb250ZXh0ID0gZ2V0UmVzb3VyY2VDb250ZXh0KGRhdGEpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlIEhBUkRfTkFWSUdBVElPTjpcbiAgICAgIGNvbnRleHQgPSBnZXROYXZpZ2F0aW9uQ29udGV4dChkYXRhKTtcbiAgICAgIGJyZWFrO1xuICB9XG5cbiAgc3Bhbi5hZGRDb250ZXh0KGNvbnRleHQpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGFkZFRyYW5zYWN0aW9uQ29udGV4dCh0cmFuc2FjdGlvbiwgX3RlbXApIHtcbiAgdmFyIF9yZWYgPSBfdGVtcCA9PT0gdm9pZCAwID8ge30gOiBfdGVtcCxcbiAgICAgIHRhZ3MgPSBfcmVmLnRhZ3MsXG4gICAgICBjb25maWdDb250ZXh0ID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UoX3JlZiwgX2V4Y2x1ZGVkKTtcblxuICB2YXIgcGFnZUNvbnRleHQgPSBnZXRQYWdlQ29udGV4dCgpO1xuICB2YXIgcmVzcG9uc2VDb250ZXh0ID0ge307XG5cbiAgaWYgKHRyYW5zYWN0aW9uLnR5cGUgPT09IFBBR0VfTE9BRCAmJiBpc1BlcmZUaW1lbGluZVN1cHBvcnRlZCgpKSB7XG4gICAgdmFyIGVudHJpZXMgPSBQRVJGLmdldEVudHJpZXNCeVR5cGUoTkFWSUdBVElPTik7XG5cbiAgICBpZiAoZW50cmllcyAmJiBlbnRyaWVzLmxlbmd0aCA+IDApIHtcbiAgICAgIHJlc3BvbnNlQ29udGV4dCA9IHtcbiAgICAgICAgcmVzcG9uc2U6IGdldFJlc3BvbnNlQ29udGV4dChlbnRyaWVzWzBdKVxuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICB0cmFuc2FjdGlvbi5hZGRDb250ZXh0KHBhZ2VDb250ZXh0LCByZXNwb25zZUNvbnRleHQsIGNvbmZpZ0NvbnRleHQpO1xufSIsImltcG9ydCB7IEJFRk9SRV9FVkVOVCwgQUZURVJfRVZFTlQgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5cbnZhciBFdmVudEhhbmRsZXIgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIEV2ZW50SGFuZGxlcigpIHtcbiAgICB0aGlzLm9ic2VydmVycyA9IHt9O1xuICB9XG5cbiAgdmFyIF9wcm90byA9IEV2ZW50SGFuZGxlci5wcm90b3R5cGU7XG5cbiAgX3Byb3RvLm9ic2VydmUgPSBmdW5jdGlvbiBvYnNlcnZlKG5hbWUsIGZuKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIGlmICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGlmICghdGhpcy5vYnNlcnZlcnNbbmFtZV0pIHtcbiAgICAgICAgdGhpcy5vYnNlcnZlcnNbbmFtZV0gPSBbXTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5vYnNlcnZlcnNbbmFtZV0ucHVzaChmbik7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaW5kZXggPSBfdGhpcy5vYnNlcnZlcnNbbmFtZV0uaW5kZXhPZihmbik7XG5cbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICBfdGhpcy5vYnNlcnZlcnNbbmFtZV0uc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gIH07XG5cbiAgX3Byb3RvLnNlbmRPbmx5ID0gZnVuY3Rpb24gc2VuZE9ubHkobmFtZSwgYXJncykge1xuICAgIHZhciBvYnMgPSB0aGlzLm9ic2VydmVyc1tuYW1lXTtcblxuICAgIGlmIChvYnMpIHtcbiAgICAgIG9icy5mb3JFYWNoKGZ1bmN0aW9uIChmbikge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGZuLmFwcGx5KHVuZGVmaW5lZCwgYXJncyk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coZXJyb3IsIGVycm9yLnN0YWNrKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIF9wcm90by5zZW5kID0gZnVuY3Rpb24gc2VuZChuYW1lLCBhcmdzKSB7XG4gICAgdGhpcy5zZW5kT25seShuYW1lICsgQkVGT1JFX0VWRU5ULCBhcmdzKTtcbiAgICB0aGlzLnNlbmRPbmx5KG5hbWUsIGFyZ3MpO1xuICAgIHRoaXMuc2VuZE9ubHkobmFtZSArIEFGVEVSX0VWRU5ULCBhcmdzKTtcbiAgfTtcblxuICByZXR1cm4gRXZlbnRIYW5kbGVyO1xufSgpO1xuXG5leHBvcnQgZGVmYXVsdCBFdmVudEhhbmRsZXI7IiwiZnVuY3Rpb24gX2V4dGVuZHMoKSB7IF9leHRlbmRzID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiAodGFyZ2V0KSB7IGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7IHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV07IGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHsgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHsgdGFyZ2V0W2tleV0gPSBzb3VyY2Vba2V5XTsgfSB9IH0gcmV0dXJuIHRhcmdldDsgfTsgcmV0dXJuIF9leHRlbmRzLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH1cblxuaW1wb3J0IHsgSFRUUF9SRVFVRVNUX1RJTUVPVVQgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgaXNSZXNwb25zZVN1Y2Nlc3NmdWwgfSBmcm9tICcuL3Jlc3BvbnNlLXN0YXR1cyc7XG5leHBvcnQgdmFyIEJZVEVfTElNSVQgPSA2MCAqIDEwMDA7XG5leHBvcnQgZnVuY3Rpb24gc2hvdWxkVXNlRmV0Y2hXaXRoS2VlcEFsaXZlKG1ldGhvZCwgcGF5bG9hZCkge1xuICBpZiAoIWlzRmV0Y2hTdXBwb3J0ZWQoKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciBpc0tlZXBBbGl2ZVN1cHBvcnRlZCA9ICgna2VlcGFsaXZlJyBpbiBuZXcgUmVxdWVzdCgnJykpO1xuXG4gIGlmICghaXNLZWVwQWxpdmVTdXBwb3J0ZWQpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgc2l6ZSA9IGNhbGN1bGF0ZVNpemUocGF5bG9hZCk7XG4gIHJldHVybiBtZXRob2QgPT09ICdQT1NUJyAmJiBzaXplIDwgQllURV9MSU1JVDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBzZW5kRmV0Y2hSZXF1ZXN0KG1ldGhvZCwgdXJsLCBfcmVmKSB7XG4gIHZhciBfcmVmJGtlZXBhbGl2ZSA9IF9yZWYua2VlcGFsaXZlLFxuICAgICAga2VlcGFsaXZlID0gX3JlZiRrZWVwYWxpdmUgPT09IHZvaWQgMCA/IGZhbHNlIDogX3JlZiRrZWVwYWxpdmUsXG4gICAgICBfcmVmJHRpbWVvdXQgPSBfcmVmLnRpbWVvdXQsXG4gICAgICB0aW1lb3V0ID0gX3JlZiR0aW1lb3V0ID09PSB2b2lkIDAgPyBIVFRQX1JFUVVFU1RfVElNRU9VVCA6IF9yZWYkdGltZW91dCxcbiAgICAgIHBheWxvYWQgPSBfcmVmLnBheWxvYWQsXG4gICAgICBoZWFkZXJzID0gX3JlZi5oZWFkZXJzLFxuICAgICAgc2VuZENyZWRlbnRpYWxzID0gX3JlZi5zZW5kQ3JlZGVudGlhbHM7XG4gIHZhciB0aW1lb3V0Q29uZmlnID0ge307XG5cbiAgaWYgKHR5cGVvZiBBYm9ydENvbnRyb2xsZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICB2YXIgY29udHJvbGxlciA9IG5ldyBBYm9ydENvbnRyb2xsZXIoKTtcbiAgICB0aW1lb3V0Q29uZmlnLnNpZ25hbCA9IGNvbnRyb2xsZXIuc2lnbmFsO1xuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGNvbnRyb2xsZXIuYWJvcnQoKTtcbiAgICB9LCB0aW1lb3V0KTtcbiAgfVxuXG4gIHZhciBmZXRjaFJlc3BvbnNlO1xuICByZXR1cm4gd2luZG93LmZldGNoKHVybCwgX2V4dGVuZHMoe1xuICAgIGJvZHk6IHBheWxvYWQsXG4gICAgaGVhZGVyczogaGVhZGVycyxcbiAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICBrZWVwYWxpdmU6IGtlZXBhbGl2ZSxcbiAgICBjcmVkZW50aWFsczogc2VuZENyZWRlbnRpYWxzID8gJ2luY2x1ZGUnIDogJ29taXQnXG4gIH0sIHRpbWVvdXRDb25maWcpKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgIGZldGNoUmVzcG9uc2UgPSByZXNwb25zZTtcbiAgICByZXR1cm4gZmV0Y2hSZXNwb25zZS50ZXh0KCk7XG4gIH0pLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlVGV4dCkge1xuICAgIHZhciBib2R5UmVzcG9uc2UgPSB7XG4gICAgICB1cmw6IHVybCxcbiAgICAgIHN0YXR1czogZmV0Y2hSZXNwb25zZS5zdGF0dXMsXG4gICAgICByZXNwb25zZVRleHQ6IHJlc3BvbnNlVGV4dFxuICAgIH07XG5cbiAgICBpZiAoIWlzUmVzcG9uc2VTdWNjZXNzZnVsKGZldGNoUmVzcG9uc2Uuc3RhdHVzKSkge1xuICAgICAgdGhyb3cgYm9keVJlc3BvbnNlO1xuICAgIH1cblxuICAgIHJldHVybiBib2R5UmVzcG9uc2U7XG4gIH0pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGlzRmV0Y2hTdXBwb3J0ZWQoKSB7XG4gIHJldHVybiB0eXBlb2Ygd2luZG93LmZldGNoID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiB3aW5kb3cuUmVxdWVzdCA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gY2FsY3VsYXRlU2l6ZShwYXlsb2FkKSB7XG4gIGlmICghcGF5bG9hZCkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgaWYgKHBheWxvYWQgaW5zdGFuY2VvZiBCbG9iKSB7XG4gICAgcmV0dXJuIHBheWxvYWQuc2l6ZTtcbiAgfVxuXG4gIHJldHVybiBuZXcgQmxvYihbcGF5bG9hZF0pLnNpemU7XG59IiwiZXhwb3J0IGZ1bmN0aW9uIGlzUmVzcG9uc2VTdWNjZXNzZnVsKHN0YXR1cykge1xuICBpZiAoc3RhdHVzID09PSAwIHx8IHN0YXR1cyA+IDM5OSAmJiBzdGF0dXMgPCA2MDApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn0iLCJpbXBvcnQgeyBYSFJfSUdOT1JFIH0gZnJvbSAnLi4vcGF0Y2hpbmcvcGF0Y2gtdXRpbHMnO1xuaW1wb3J0IHsgaXNSZXNwb25zZVN1Y2Nlc3NmdWwgfSBmcm9tICcuL3Jlc3BvbnNlLXN0YXR1cyc7XG5pbXBvcnQgeyBQcm9taXNlIH0gZnJvbSAnLi4vcG9seWZpbGxzJztcbmV4cG9ydCBmdW5jdGlvbiBzZW5kWEhSKG1ldGhvZCwgdXJsLCBfcmVmKSB7XG4gIHZhciBfcmVmJHRpbWVvdXQgPSBfcmVmLnRpbWVvdXQsXG4gICAgICB0aW1lb3V0ID0gX3JlZiR0aW1lb3V0ID09PSB2b2lkIDAgPyBIVFRQX1JFUVVFU1RfVElNRU9VVCA6IF9yZWYkdGltZW91dCxcbiAgICAgIHBheWxvYWQgPSBfcmVmLnBheWxvYWQsXG4gICAgICBoZWFkZXJzID0gX3JlZi5oZWFkZXJzLFxuICAgICAgYmVmb3JlU2VuZCA9IF9yZWYuYmVmb3JlU2VuZCxcbiAgICAgIHNlbmRDcmVkZW50aWFscyA9IF9yZWYuc2VuZENyZWRlbnRpYWxzO1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgIHZhciB4aHIgPSBuZXcgd2luZG93LlhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgeGhyW1hIUl9JR05PUkVdID0gdHJ1ZTtcbiAgICB4aHIub3BlbihtZXRob2QsIHVybCwgdHJ1ZSk7XG4gICAgeGhyLnRpbWVvdXQgPSB0aW1lb3V0O1xuICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSBzZW5kQ3JlZGVudGlhbHM7XG5cbiAgICBpZiAoaGVhZGVycykge1xuICAgICAgZm9yICh2YXIgaGVhZGVyIGluIGhlYWRlcnMpIHtcbiAgICAgICAgaWYgKGhlYWRlcnMuaGFzT3duUHJvcGVydHkoaGVhZGVyKSkge1xuICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKGhlYWRlciwgaGVhZGVyc1toZWFkZXJdKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQpIHtcbiAgICAgICAgdmFyIHN0YXR1cyA9IHhoci5zdGF0dXMsXG4gICAgICAgICAgICByZXNwb25zZVRleHQgPSB4aHIucmVzcG9uc2VUZXh0O1xuXG4gICAgICAgIGlmIChpc1Jlc3BvbnNlU3VjY2Vzc2Z1bChzdGF0dXMpKSB7XG4gICAgICAgICAgcmVzb2x2ZSh4aHIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlamVjdCh7XG4gICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgIHN0YXR1czogc3RhdHVzLFxuICAgICAgICAgICAgcmVzcG9uc2VUZXh0OiByZXNwb25zZVRleHRcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICB4aHIub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzdGF0dXMgPSB4aHIuc3RhdHVzLFxuICAgICAgICAgIHJlc3BvbnNlVGV4dCA9IHhoci5yZXNwb25zZVRleHQ7XG4gICAgICByZWplY3Qoe1xuICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgc3RhdHVzOiBzdGF0dXMsXG4gICAgICAgIHJlc3BvbnNlVGV4dDogcmVzcG9uc2VUZXh0XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgdmFyIGNhblNlbmQgPSB0cnVlO1xuXG4gICAgaWYgKHR5cGVvZiBiZWZvcmVTZW5kID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjYW5TZW5kID0gYmVmb3JlU2VuZCh7XG4gICAgICAgIHVybDogdXJsLFxuICAgICAgICBtZXRob2Q6IG1ldGhvZCxcbiAgICAgICAgaGVhZGVyczogaGVhZGVycyxcbiAgICAgICAgcGF5bG9hZDogcGF5bG9hZCxcbiAgICAgICAgeGhyOiB4aHJcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChjYW5TZW5kKSB7XG4gICAgICB4aHIuc2VuZChwYXlsb2FkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVqZWN0KHtcbiAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgIHN0YXR1czogMCxcbiAgICAgICAgcmVzcG9uc2VUZXh0OiAnUmVxdWVzdCByZWplY3RlZCBieSB1c2VyIGNvbmZpZ3VyYXRpb24uJ1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbn0iLCJpbXBvcnQgeyBYTUxIVFRQUkVRVUVTVCwgRkVUQ0gsIEhJU1RPUlksIFBBR0VfTE9BRCwgRVJST1IsIEVWRU5UX1RBUkdFVCwgQ0xJQ0sgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5leHBvcnQgZnVuY3Rpb24gZ2V0SW5zdHJ1bWVudGF0aW9uRmxhZ3MoaW5zdHJ1bWVudCwgZGlzYWJsZWRJbnN0cnVtZW50YXRpb25zKSB7XG4gIHZhciBfZmxhZ3M7XG5cbiAgdmFyIGZsYWdzID0gKF9mbGFncyA9IHt9LCBfZmxhZ3NbWE1MSFRUUFJFUVVFU1RdID0gZmFsc2UsIF9mbGFnc1tGRVRDSF0gPSBmYWxzZSwgX2ZsYWdzW0hJU1RPUlldID0gZmFsc2UsIF9mbGFnc1tQQUdFX0xPQURdID0gZmFsc2UsIF9mbGFnc1tFUlJPUl0gPSBmYWxzZSwgX2ZsYWdzW0VWRU5UX1RBUkdFVF0gPSBmYWxzZSwgX2ZsYWdzW0NMSUNLXSA9IGZhbHNlLCBfZmxhZ3MpO1xuXG4gIGlmICghaW5zdHJ1bWVudCkge1xuICAgIHJldHVybiBmbGFncztcbiAgfVxuXG4gIE9iamVjdC5rZXlzKGZsYWdzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICBpZiAoZGlzYWJsZWRJbnN0cnVtZW50YXRpb25zLmluZGV4T2Yoa2V5KSA9PT0gLTEpIHtcbiAgICAgIGZsYWdzW2tleV0gPSB0cnVlO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBmbGFncztcbn0iLCJpbXBvcnQgeyBub29wIH0gZnJvbSAnLi91dGlscyc7XG5cbnZhciBMb2dnaW5nU2VydmljZSA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gTG9nZ2luZ1NlcnZpY2Uoc3BlYykge1xuICAgIGlmIChzcGVjID09PSB2b2lkIDApIHtcbiAgICAgIHNwZWMgPSB7fTtcbiAgICB9XG5cbiAgICB0aGlzLmxldmVscyA9IFsndHJhY2UnLCAnZGVidWcnLCAnaW5mbycsICd3YXJuJywgJ2Vycm9yJ107XG4gICAgdGhpcy5sZXZlbCA9IHNwZWMubGV2ZWwgfHwgJ3dhcm4nO1xuICAgIHRoaXMucHJlZml4ID0gc3BlYy5wcmVmaXggfHwgJyc7XG4gICAgdGhpcy5yZXNldExvZ01ldGhvZHMoKTtcbiAgfVxuXG4gIHZhciBfcHJvdG8gPSBMb2dnaW5nU2VydmljZS5wcm90b3R5cGU7XG5cbiAgX3Byb3RvLnNob3VsZExvZyA9IGZ1bmN0aW9uIHNob3VsZExvZyhsZXZlbCkge1xuICAgIHJldHVybiB0aGlzLmxldmVscy5pbmRleE9mKGxldmVsKSA+PSB0aGlzLmxldmVscy5pbmRleE9mKHRoaXMubGV2ZWwpO1xuICB9O1xuXG4gIF9wcm90by5zZXRMZXZlbCA9IGZ1bmN0aW9uIHNldExldmVsKGxldmVsKSB7XG4gICAgaWYgKGxldmVsID09PSB0aGlzLmxldmVsKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5sZXZlbCA9IGxldmVsO1xuICAgIHRoaXMucmVzZXRMb2dNZXRob2RzKCk7XG4gIH07XG5cbiAgX3Byb3RvLnJlc2V0TG9nTWV0aG9kcyA9IGZ1bmN0aW9uIHJlc2V0TG9nTWV0aG9kcygpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgdGhpcy5sZXZlbHMuZm9yRWFjaChmdW5jdGlvbiAobGV2ZWwpIHtcbiAgICAgIF90aGlzW2xldmVsXSA9IF90aGlzLnNob3VsZExvZyhsZXZlbCkgPyBsb2cgOiBub29wO1xuXG4gICAgICBmdW5jdGlvbiBsb2coKSB7XG4gICAgICAgIHZhciBub3JtYWxpemVkTGV2ZWwgPSBsZXZlbDtcblxuICAgICAgICBpZiAobGV2ZWwgPT09ICd0cmFjZScgfHwgbGV2ZWwgPT09ICdkZWJ1ZycpIHtcbiAgICAgICAgICBub3JtYWxpemVkTGV2ZWwgPSAnaW5mbyc7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgICAgYXJnc1swXSA9IHRoaXMucHJlZml4ICsgYXJnc1swXTtcblxuICAgICAgICBpZiAoY29uc29sZSkge1xuICAgICAgICAgIHZhciByZWFsTWV0aG9kID0gY29uc29sZVtub3JtYWxpemVkTGV2ZWxdIHx8IGNvbnNvbGUubG9nO1xuXG4gICAgICAgICAgaWYgKHR5cGVvZiByZWFsTWV0aG9kID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICByZWFsTWV0aG9kLmFwcGx5KGNvbnNvbGUsIGFyZ3MpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiBMb2dnaW5nU2VydmljZTtcbn0oKTtcblxuZXhwb3J0IGRlZmF1bHQgTG9nZ2luZ1NlcnZpY2U7IiwidmFyIE5ESlNPTiA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gTkRKU09OKCkge31cblxuICBOREpTT04uc3RyaW5naWZ5ID0gZnVuY3Rpb24gc3RyaW5naWZ5KG9iamVjdCkge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShvYmplY3QpICsgJ1xcbic7XG4gIH07XG5cbiAgcmV0dXJuIE5ESlNPTjtcbn0oKTtcblxuZXhwb3J0IGRlZmF1bHQgTkRKU09OOyIsImltcG9ydCB7IFVTRVJfSU5URVJBQ1RJT04gfSBmcm9tICcuLi9jb25zdGFudHMnO1xudmFyIElOVEVSQUNUSVZFX1NFTEVDVE9SID0gJ2FbZGF0YS10cmFuc2FjdGlvbi1uYW1lXSwgYnV0dG9uW2RhdGEtdHJhbnNhY3Rpb24tbmFtZV0nO1xuZXhwb3J0IGZ1bmN0aW9uIG9ic2VydmVQYWdlQ2xpY2tzKHRyYW5zYWN0aW9uU2VydmljZSkge1xuICB2YXIgY2xpY2tIYW5kbGVyID0gZnVuY3Rpb24gY2xpY2tIYW5kbGVyKGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50LnRhcmdldCBpbnN0YW5jZW9mIEVsZW1lbnQpIHtcbiAgICAgIGNyZWF0ZVVzZXJJbnRlcmFjdGlvblRyYW5zYWN0aW9uKHRyYW5zYWN0aW9uU2VydmljZSwgZXZlbnQudGFyZ2V0KTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIGV2ZW50TmFtZSA9ICdjbGljayc7XG4gIHZhciB1c2VDYXB0dXJlID0gdHJ1ZTtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBjbGlja0hhbmRsZXIsIHVzZUNhcHR1cmUpO1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgY2xpY2tIYW5kbGVyLCB1c2VDYXB0dXJlKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlVXNlckludGVyYWN0aW9uVHJhbnNhY3Rpb24odHJhbnNhY3Rpb25TZXJ2aWNlLCB0YXJnZXQpIHtcbiAgdmFyIF9nZXRUcmFuc2FjdGlvbk1ldGFkYSA9IGdldFRyYW5zYWN0aW9uTWV0YWRhdGEodGFyZ2V0KSxcbiAgICAgIHRyYW5zYWN0aW9uTmFtZSA9IF9nZXRUcmFuc2FjdGlvbk1ldGFkYS50cmFuc2FjdGlvbk5hbWUsXG4gICAgICBjb250ZXh0ID0gX2dldFRyYW5zYWN0aW9uTWV0YWRhLmNvbnRleHQ7XG5cbiAgdmFyIHRyID0gdHJhbnNhY3Rpb25TZXJ2aWNlLnN0YXJ0VHJhbnNhY3Rpb24oXCJDbGljayAtIFwiICsgdHJhbnNhY3Rpb25OYW1lLCBVU0VSX0lOVEVSQUNUSU9OLCB7XG4gICAgbWFuYWdlZDogdHJ1ZSxcbiAgICBjYW5SZXVzZTogdHJ1ZSxcbiAgICByZXVzZVRocmVzaG9sZDogMzAwXG4gIH0pO1xuXG4gIGlmICh0ciAmJiBjb250ZXh0KSB7XG4gICAgdHIuYWRkQ29udGV4dChjb250ZXh0KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRUcmFuc2FjdGlvbk1ldGFkYXRhKHRhcmdldCkge1xuICB2YXIgbWV0YWRhdGEgPSB7XG4gICAgdHJhbnNhY3Rpb25OYW1lOiBudWxsLFxuICAgIGNvbnRleHQ6IG51bGxcbiAgfTtcbiAgbWV0YWRhdGEudHJhbnNhY3Rpb25OYW1lID0gYnVpbGRUcmFuc2FjdGlvbk5hbWUodGFyZ2V0KTtcbiAgdmFyIGNsYXNzZXMgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKCdjbGFzcycpO1xuXG4gIGlmIChjbGFzc2VzKSB7XG4gICAgbWV0YWRhdGEuY29udGV4dCA9IHtcbiAgICAgIGN1c3RvbToge1xuICAgICAgICBjbGFzc2VzOiBjbGFzc2VzXG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBtZXRhZGF0YTtcbn1cblxuZnVuY3Rpb24gYnVpbGRUcmFuc2FjdGlvbk5hbWUodGFyZ2V0KSB7XG4gIHZhciBkdE5hbWUgPSBmaW5kQ3VzdG9tVHJhbnNhY3Rpb25OYW1lKHRhcmdldCk7XG5cbiAgaWYgKGR0TmFtZSkge1xuICAgIHJldHVybiBkdE5hbWU7XG4gIH1cblxuICB2YXIgdGFnTmFtZSA9IHRhcmdldC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG4gIHZhciBuYW1lID0gdGFyZ2V0LmdldEF0dHJpYnV0ZSgnbmFtZScpO1xuXG4gIGlmICghIW5hbWUpIHtcbiAgICByZXR1cm4gdGFnTmFtZSArIFwiW1xcXCJcIiArIG5hbWUgKyBcIlxcXCJdXCI7XG4gIH1cblxuICByZXR1cm4gdGFnTmFtZTtcbn1cblxuZnVuY3Rpb24gZmluZEN1c3RvbVRyYW5zYWN0aW9uTmFtZSh0YXJnZXQpIHtcbiAgaWYgKHRhcmdldC5jbG9zZXN0KSB7XG4gICAgdmFyIGVsZW1lbnQgPSB0YXJnZXQuY2xvc2VzdChJTlRFUkFDVElWRV9TRUxFQ1RPUik7XG4gICAgcmV0dXJuIGVsZW1lbnQgPyBlbGVtZW50LmRhdGFzZXQudHJhbnNhY3Rpb25OYW1lIDogbnVsbDtcbiAgfVxuXG4gIHJldHVybiB0YXJnZXQuZGF0YXNldC50cmFuc2FjdGlvbk5hbWU7XG59IiwiaW1wb3J0IHsgUVVFVUVfQUREX1RSQU5TQUNUSU9OLCBRVUVVRV9GTFVTSCB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBzdGF0ZSB9IGZyb20gJy4uLy4uL3N0YXRlJztcbmltcG9ydCB7IG5vdyB9IGZyb20gJy4uL3V0aWxzJztcbmV4cG9ydCBmdW5jdGlvbiBvYnNlcnZlUGFnZVZpc2liaWxpdHkoY29uZmlnU2VydmljZSwgdHJhbnNhY3Rpb25TZXJ2aWNlKSB7XG4gIGlmIChkb2N1bWVudC52aXNpYmlsaXR5U3RhdGUgPT09ICdoaWRkZW4nKSB7XG4gICAgc3RhdGUubGFzdEhpZGRlblN0YXJ0ID0gMDtcbiAgfVxuXG4gIHZhciB2aXNpYmlsaXR5Q2hhbmdlSGFuZGxlciA9IGZ1bmN0aW9uIHZpc2liaWxpdHlDaGFuZ2VIYW5kbGVyKCkge1xuICAgIGlmIChkb2N1bWVudC52aXNpYmlsaXR5U3RhdGUgPT09ICdoaWRkZW4nKSB7XG4gICAgICBvblBhZ2VIaWRkZW4oY29uZmlnU2VydmljZSwgdHJhbnNhY3Rpb25TZXJ2aWNlKTtcbiAgICB9XG4gIH07XG5cbiAgdmFyIHBhZ2VIaWRlSGFuZGxlciA9IGZ1bmN0aW9uIHBhZ2VIaWRlSGFuZGxlcigpIHtcbiAgICByZXR1cm4gb25QYWdlSGlkZGVuKGNvbmZpZ1NlcnZpY2UsIHRyYW5zYWN0aW9uU2VydmljZSk7XG4gIH07XG5cbiAgdmFyIHVzZUNhcHR1cmUgPSB0cnVlO1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigndmlzaWJpbGl0eWNoYW5nZScsIHZpc2liaWxpdHlDaGFuZ2VIYW5kbGVyLCB1c2VDYXB0dXJlKTtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BhZ2VoaWRlJywgcGFnZUhpZGVIYW5kbGVyLCB1c2VDYXB0dXJlKTtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigndmlzaWJpbGl0eWNoYW5nZScsIHZpc2liaWxpdHlDaGFuZ2VIYW5kbGVyLCB1c2VDYXB0dXJlKTtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigncGFnZWhpZGUnLCBwYWdlSGlkZUhhbmRsZXIsIHVzZUNhcHR1cmUpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBvblBhZ2VIaWRkZW4oY29uZmlnU2VydmljZSwgdHJhbnNhY3Rpb25TZXJ2aWNlKSB7XG4gIHZhciB0ciA9IHRyYW5zYWN0aW9uU2VydmljZS5nZXRDdXJyZW50VHJhbnNhY3Rpb24oKTtcblxuICBpZiAodHIpIHtcbiAgICB2YXIgdW5vYnNlcnZlID0gY29uZmlnU2VydmljZS5vYnNlcnZlRXZlbnQoUVVFVUVfQUREX1RSQU5TQUNUSU9OLCBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25maWdTZXJ2aWNlLmRpc3BhdGNoRXZlbnQoUVVFVUVfRkxVU0gpO1xuICAgICAgc3RhdGUubGFzdEhpZGRlblN0YXJ0ID0gbm93KCk7XG4gICAgICB1bm9ic2VydmUoKTtcbiAgICB9KTtcbiAgICB0ci5lbmQoKTtcbiAgfSBlbHNlIHtcbiAgICBjb25maWdTZXJ2aWNlLmRpc3BhdGNoRXZlbnQoUVVFVUVfRkxVU0gpO1xuICAgIHN0YXRlLmxhc3RIaWRkZW5TdGFydCA9IG5vdygpO1xuICB9XG59IiwiaW1wb3J0IHsgUHJvbWlzZSB9IGZyb20gJy4uL3BvbHlmaWxscyc7XG5pbXBvcnQgeyBnbG9iYWxTdGF0ZSB9IGZyb20gJy4vcGF0Y2gtdXRpbHMnO1xuaW1wb3J0IHsgU0NIRURVTEUsIElOVk9LRSwgRkVUQ0ggfSBmcm9tICcuLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgc2NoZWR1bGVNaWNyb1Rhc2sgfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgeyBpc0ZldGNoU3VwcG9ydGVkIH0gZnJvbSAnLi4vaHR0cC9mZXRjaCc7XG5leHBvcnQgZnVuY3Rpb24gcGF0Y2hGZXRjaChjYWxsYmFjaykge1xuICBpZiAoIWlzRmV0Y2hTdXBwb3J0ZWQoKSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNjaGVkdWxlVGFzayh0YXNrKSB7XG4gICAgdGFzay5zdGF0ZSA9IFNDSEVEVUxFO1xuICAgIGNhbGxiYWNrKFNDSEVEVUxFLCB0YXNrKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGludm9rZVRhc2sodGFzaykge1xuICAgIHRhc2suc3RhdGUgPSBJTlZPS0U7XG4gICAgY2FsbGJhY2soSU5WT0tFLCB0YXNrKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZVJlc3BvbnNlRXJyb3IodGFzaywgZXJyb3IpIHtcbiAgICB0YXNrLmRhdGEuYWJvcnRlZCA9IGlzQWJvcnRFcnJvcihlcnJvcik7XG4gICAgdGFzay5kYXRhLmVycm9yID0gZXJyb3I7XG4gICAgaW52b2tlVGFzayh0YXNrKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlYWRTdHJlYW0oc3RyZWFtLCB0YXNrKSB7XG4gICAgdmFyIHJlYWRlciA9IHN0cmVhbS5nZXRSZWFkZXIoKTtcblxuICAgIHZhciByZWFkID0gZnVuY3Rpb24gcmVhZCgpIHtcbiAgICAgIHJlYWRlci5yZWFkKCkudGhlbihmdW5jdGlvbiAoX3JlZikge1xuICAgICAgICB2YXIgZG9uZSA9IF9yZWYuZG9uZTtcblxuICAgICAgICBpZiAoZG9uZSkge1xuICAgICAgICAgIGludm9rZVRhc2sodGFzayk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVhZCgpO1xuICAgICAgICB9XG4gICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgaGFuZGxlUmVzcG9uc2VFcnJvcih0YXNrLCBlcnJvcik7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgcmVhZCgpO1xuICB9XG5cbiAgdmFyIG5hdGl2ZUZldGNoID0gd2luZG93LmZldGNoO1xuXG4gIHdpbmRvdy5mZXRjaCA9IGZ1bmN0aW9uIChpbnB1dCwgaW5pdCkge1xuICAgIHZhciBmZXRjaFNlbGYgPSB0aGlzO1xuICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgIHZhciByZXF1ZXN0LCB1cmw7XG4gICAgdmFyIGlzVVJMID0gaW5wdXQgaW5zdGFuY2VvZiBVUkw7XG5cbiAgICBpZiAodHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJyB8fCBpc1VSTCkge1xuICAgICAgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KGlucHV0LCBpbml0KTtcblxuICAgICAgaWYgKGlzVVJMKSB7XG4gICAgICAgIHVybCA9IHJlcXVlc3QudXJsO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdXJsID0gaW5wdXQ7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChpbnB1dCkge1xuICAgICAgcmVxdWVzdCA9IGlucHV0O1xuICAgICAgdXJsID0gcmVxdWVzdC51cmw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBuYXRpdmVGZXRjaC5hcHBseShmZXRjaFNlbGYsIGFyZ3MpO1xuICAgIH1cblxuICAgIHZhciB0YXNrID0ge1xuICAgICAgc291cmNlOiBGRVRDSCxcbiAgICAgIHN0YXRlOiAnJyxcbiAgICAgIHR5cGU6ICdtYWNyb1Rhc2snLFxuICAgICAgZGF0YToge1xuICAgICAgICB0YXJnZXQ6IHJlcXVlc3QsXG4gICAgICAgIG1ldGhvZDogcmVxdWVzdC5tZXRob2QsXG4gICAgICAgIHVybDogdXJsLFxuICAgICAgICBhYm9ydGVkOiBmYWxzZVxuICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIGdsb2JhbFN0YXRlLmZldGNoSW5Qcm9ncmVzcyA9IHRydWU7XG4gICAgICBzY2hlZHVsZVRhc2sodGFzayk7XG4gICAgICB2YXIgcHJvbWlzZTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgcHJvbWlzZSA9IG5hdGl2ZUZldGNoLmFwcGx5KGZldGNoU2VsZiwgW3JlcXVlc3RdKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgIHRhc2suZGF0YS5lcnJvciA9IGVycm9yO1xuICAgICAgICBpbnZva2VUYXNrKHRhc2spO1xuICAgICAgICBnbG9iYWxTdGF0ZS5mZXRjaEluUHJvZ3Jlc3MgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBwcm9taXNlLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIHZhciBjbG9uZWRSZXNwb25zZSA9IHJlc3BvbnNlLmNsb25lID8gcmVzcG9uc2UuY2xvbmUoKSA6IHt9O1xuICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgICAgc2NoZWR1bGVNaWNyb1Rhc2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHRhc2suZGF0YS5yZXNwb25zZSA9IHJlc3BvbnNlO1xuICAgICAgICAgIHZhciBib2R5ID0gY2xvbmVkUmVzcG9uc2UuYm9keTtcblxuICAgICAgICAgIGlmIChib2R5KSB7XG4gICAgICAgICAgICByZWFkU3RyZWFtKGJvZHksIHRhc2spO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpbnZva2VUYXNrKHRhc2spO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgc2NoZWR1bGVNaWNyb1Rhc2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGhhbmRsZVJlc3BvbnNlRXJyb3IodGFzaywgZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgZ2xvYmFsU3RhdGUuZmV0Y2hJblByb2dyZXNzID0gZmFsc2U7XG4gICAgfSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGlzQWJvcnRFcnJvcihlcnJvcikge1xuICByZXR1cm4gZXJyb3IgJiYgZXJyb3IubmFtZSA9PT0gJ0Fib3J0RXJyb3InO1xufSIsImltcG9ydCB7IElOVk9LRSwgSElTVE9SWSB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5leHBvcnQgZnVuY3Rpb24gcGF0Y2hIaXN0b3J5KGNhbGxiYWNrKSB7XG4gIGlmICghd2luZG93Lmhpc3RvcnkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgbmF0aXZlUHVzaFN0YXRlID0gaGlzdG9yeS5wdXNoU3RhdGU7XG5cbiAgaWYgKHR5cGVvZiBuYXRpdmVQdXNoU3RhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICBoaXN0b3J5LnB1c2hTdGF0ZSA9IGZ1bmN0aW9uIChzdGF0ZSwgdGl0bGUsIHVybCkge1xuICAgICAgdmFyIHRhc2sgPSB7XG4gICAgICAgIHNvdXJjZTogSElTVE9SWSxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHN0YXRlOiBzdGF0ZSxcbiAgICAgICAgICB0aXRsZTogdGl0bGUsXG4gICAgICAgICAgdXJsOiB1cmxcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGNhbGxiYWNrKElOVk9LRSwgdGFzayk7XG4gICAgICBuYXRpdmVQdXNoU3RhdGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9XG59IiwiaW1wb3J0IHsgcGF0Y2hYTUxIdHRwUmVxdWVzdCB9IGZyb20gJy4veGhyLXBhdGNoJztcbmltcG9ydCB7IHBhdGNoRmV0Y2ggfSBmcm9tICcuL2ZldGNoLXBhdGNoJztcbmltcG9ydCB7IHBhdGNoSGlzdG9yeSB9IGZyb20gJy4vaGlzdG9yeS1wYXRjaCc7XG5pbXBvcnQgRXZlbnRIYW5kbGVyIGZyb20gJy4uL2V2ZW50LWhhbmRsZXInO1xuaW1wb3J0IHsgSElTVE9SWSwgRkVUQ0gsIFhNTEhUVFBSRVFVRVNUIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcbnZhciBwYXRjaEV2ZW50SGFuZGxlciA9IG5ldyBFdmVudEhhbmRsZXIoKTtcbnZhciBhbHJlYWR5UGF0Y2hlZCA9IGZhbHNlO1xuXG5mdW5jdGlvbiBwYXRjaEFsbCgpIHtcbiAgaWYgKCFhbHJlYWR5UGF0Y2hlZCkge1xuICAgIGFscmVhZHlQYXRjaGVkID0gdHJ1ZTtcbiAgICBwYXRjaFhNTEh0dHBSZXF1ZXN0KGZ1bmN0aW9uIChldmVudCwgdGFzaykge1xuICAgICAgcGF0Y2hFdmVudEhhbmRsZXIuc2VuZChYTUxIVFRQUkVRVUVTVCwgW2V2ZW50LCB0YXNrXSk7XG4gICAgfSk7XG4gICAgcGF0Y2hGZXRjaChmdW5jdGlvbiAoZXZlbnQsIHRhc2spIHtcbiAgICAgIHBhdGNoRXZlbnRIYW5kbGVyLnNlbmQoRkVUQ0gsIFtldmVudCwgdGFza10pO1xuICAgIH0pO1xuICAgIHBhdGNoSGlzdG9yeShmdW5jdGlvbiAoZXZlbnQsIHRhc2spIHtcbiAgICAgIHBhdGNoRXZlbnRIYW5kbGVyLnNlbmQoSElTVE9SWSwgW2V2ZW50LCB0YXNrXSk7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gcGF0Y2hFdmVudEhhbmRsZXI7XG59XG5cbmV4cG9ydCB7IHBhdGNoQWxsLCBwYXRjaEV2ZW50SGFuZGxlciB9OyIsImV4cG9ydCB2YXIgZ2xvYmFsU3RhdGUgPSB7XG4gIGZldGNoSW5Qcm9ncmVzczogZmFsc2Vcbn07XG5leHBvcnQgZnVuY3Rpb24gYXBtU3ltYm9sKG5hbWUpIHtcbiAgcmV0dXJuICdfX2FwbV9zeW1ib2xfXycgKyBuYW1lO1xufVxuXG5mdW5jdGlvbiBpc1Byb3BlcnR5V3JpdGFibGUocHJvcGVydHlEZXNjKSB7XG4gIGlmICghcHJvcGVydHlEZXNjKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAocHJvcGVydHlEZXNjLndyaXRhYmxlID09PSBmYWxzZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiAhKHR5cGVvZiBwcm9wZXJ0eURlc2MuZ2V0ID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBwcm9wZXJ0eURlc2Muc2V0ID09PSAndW5kZWZpbmVkJyk7XG59XG5cbmZ1bmN0aW9uIGF0dGFjaE9yaWdpblRvUGF0Y2hlZChwYXRjaGVkLCBvcmlnaW5hbCkge1xuICBwYXRjaGVkW2FwbVN5bWJvbCgnT3JpZ2luYWxEZWxlZ2F0ZScpXSA9IG9yaWdpbmFsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGF0Y2hNZXRob2QodGFyZ2V0LCBuYW1lLCBwYXRjaEZuKSB7XG4gIHZhciBwcm90byA9IHRhcmdldDtcblxuICB3aGlsZSAocHJvdG8gJiYgIXByb3RvLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YocHJvdG8pO1xuICB9XG5cbiAgaWYgKCFwcm90byAmJiB0YXJnZXRbbmFtZV0pIHtcbiAgICBwcm90byA9IHRhcmdldDtcbiAgfVxuXG4gIHZhciBkZWxlZ2F0ZU5hbWUgPSBhcG1TeW1ib2wobmFtZSk7XG4gIHZhciBkZWxlZ2F0ZTtcblxuICBpZiAocHJvdG8gJiYgIShkZWxlZ2F0ZSA9IHByb3RvW2RlbGVnYXRlTmFtZV0pKSB7XG4gICAgZGVsZWdhdGUgPSBwcm90b1tkZWxlZ2F0ZU5hbWVdID0gcHJvdG9bbmFtZV07XG4gICAgdmFyIGRlc2MgPSBwcm90byAmJiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHByb3RvLCBuYW1lKTtcblxuICAgIGlmIChpc1Byb3BlcnR5V3JpdGFibGUoZGVzYykpIHtcbiAgICAgIHZhciBwYXRjaERlbGVnYXRlID0gcGF0Y2hGbihkZWxlZ2F0ZSwgZGVsZWdhdGVOYW1lLCBuYW1lKTtcblxuICAgICAgcHJvdG9bbmFtZV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBwYXRjaERlbGVnYXRlKHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9O1xuXG4gICAgICBhdHRhY2hPcmlnaW5Ub1BhdGNoZWQocHJvdG9bbmFtZV0sIGRlbGVnYXRlKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZGVsZWdhdGU7XG59XG5leHBvcnQgdmFyIFhIUl9JR05PUkUgPSBhcG1TeW1ib2woJ3hocklnbm9yZScpO1xuZXhwb3J0IHZhciBYSFJfU1lOQyA9IGFwbVN5bWJvbCgneGhyU3luYycpO1xuZXhwb3J0IHZhciBYSFJfVVJMID0gYXBtU3ltYm9sKCd4aHJVUkwnKTtcbmV4cG9ydCB2YXIgWEhSX01FVEhPRCA9IGFwbVN5bWJvbCgneGhyTWV0aG9kJyk7IiwiaW1wb3J0IHsgcGF0Y2hNZXRob2QsIFhIUl9TWU5DLCBYSFJfVVJMLCBYSFJfTUVUSE9ELCBYSFJfSUdOT1JFIH0gZnJvbSAnLi9wYXRjaC11dGlscyc7XG5pbXBvcnQgeyBTQ0hFRFVMRSwgSU5WT0tFLCBYTUxIVFRQUkVRVUVTVCwgQUREX0VWRU5UX0xJU1RFTkVSX1NUUiB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5leHBvcnQgZnVuY3Rpb24gcGF0Y2hYTUxIdHRwUmVxdWVzdChjYWxsYmFjaykge1xuICB2YXIgWE1MSHR0cFJlcXVlc3RQcm90b3R5cGUgPSBYTUxIdHRwUmVxdWVzdC5wcm90b3R5cGU7XG5cbiAgaWYgKCFYTUxIdHRwUmVxdWVzdFByb3RvdHlwZSB8fCAhWE1MSHR0cFJlcXVlc3RQcm90b3R5cGVbQUREX0VWRU5UX0xJU1RFTkVSX1NUUl0pIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgUkVBRFlfU1RBVEVfQ0hBTkdFID0gJ3JlYWR5c3RhdGVjaGFuZ2UnO1xuICB2YXIgTE9BRCA9ICdsb2FkJztcbiAgdmFyIEVSUk9SID0gJ2Vycm9yJztcbiAgdmFyIFRJTUVPVVQgPSAndGltZW91dCc7XG4gIHZhciBBQk9SVCA9ICdhYm9ydCc7XG5cbiAgZnVuY3Rpb24gaW52b2tlVGFzayh0YXNrLCBzdGF0dXMpIHtcbiAgICBpZiAodGFzay5zdGF0ZSAhPT0gSU5WT0tFKSB7XG4gICAgICB0YXNrLnN0YXRlID0gSU5WT0tFO1xuICAgICAgdGFzay5kYXRhLnN0YXR1cyA9IHN0YXR1cztcbiAgICAgIGNhbGxiYWNrKElOVk9LRSwgdGFzayk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2NoZWR1bGVUYXNrKHRhc2spIHtcbiAgICBpZiAodGFzay5zdGF0ZSA9PT0gU0NIRURVTEUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0YXNrLnN0YXRlID0gU0NIRURVTEU7XG4gICAgY2FsbGJhY2soU0NIRURVTEUsIHRhc2spO1xuICAgIHZhciB0YXJnZXQgPSB0YXNrLmRhdGEudGFyZ2V0O1xuXG4gICAgZnVuY3Rpb24gYWRkTGlzdGVuZXIobmFtZSkge1xuICAgICAgdGFyZ2V0W0FERF9FVkVOVF9MSVNURU5FUl9TVFJdKG5hbWUsIGZ1bmN0aW9uIChfcmVmKSB7XG4gICAgICAgIHZhciB0eXBlID0gX3JlZi50eXBlO1xuXG4gICAgICAgIGlmICh0eXBlID09PSBSRUFEWV9TVEFURV9DSEFOR0UpIHtcbiAgICAgICAgICBpZiAodGFyZ2V0LnJlYWR5U3RhdGUgPT09IDQgJiYgdGFyZ2V0LnN0YXR1cyAhPT0gMCkge1xuICAgICAgICAgICAgaW52b2tlVGFzayh0YXNrLCAnc3VjY2VzcycpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgc3RhdHVzID0gdHlwZSA9PT0gTE9BRCA/ICdzdWNjZXNzJyA6IHR5cGU7XG4gICAgICAgICAgaW52b2tlVGFzayh0YXNrLCBzdGF0dXMpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBhZGRMaXN0ZW5lcihSRUFEWV9TVEFURV9DSEFOR0UpO1xuICAgIGFkZExpc3RlbmVyKExPQUQpO1xuICAgIGFkZExpc3RlbmVyKFRJTUVPVVQpO1xuICAgIGFkZExpc3RlbmVyKEVSUk9SKTtcbiAgICBhZGRMaXN0ZW5lcihBQk9SVCk7XG4gIH1cblxuICB2YXIgb3Blbk5hdGl2ZSA9IHBhdGNoTWV0aG9kKFhNTEh0dHBSZXF1ZXN0UHJvdG90eXBlLCAnb3BlbicsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHNlbGYsIGFyZ3MpIHtcbiAgICAgIGlmICghc2VsZltYSFJfSUdOT1JFXSkge1xuICAgICAgICBzZWxmW1hIUl9NRVRIT0RdID0gYXJnc1swXTtcbiAgICAgICAgc2VsZltYSFJfVVJMXSA9IGFyZ3NbMV07XG4gICAgICAgIHNlbGZbWEhSX1NZTkNdID0gYXJnc1syXSA9PT0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvcGVuTmF0aXZlLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgIH07XG4gIH0pO1xuICB2YXIgc2VuZE5hdGl2ZSA9IHBhdGNoTWV0aG9kKFhNTEh0dHBSZXF1ZXN0UHJvdG90eXBlLCAnc2VuZCcsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHNlbGYsIGFyZ3MpIHtcbiAgICAgIGlmIChzZWxmW1hIUl9JR05PUkVdKSB7XG4gICAgICAgIHJldHVybiBzZW5kTmF0aXZlLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgICAgfVxuXG4gICAgICB2YXIgdGFzayA9IHtcbiAgICAgICAgc291cmNlOiBYTUxIVFRQUkVRVUVTVCxcbiAgICAgICAgc3RhdGU6ICcnLFxuICAgICAgICB0eXBlOiAnbWFjcm9UYXNrJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHRhcmdldDogc2VsZixcbiAgICAgICAgICBtZXRob2Q6IHNlbGZbWEhSX01FVEhPRF0sXG4gICAgICAgICAgc3luYzogc2VsZltYSFJfU1lOQ10sXG4gICAgICAgICAgdXJsOiBzZWxmW1hIUl9VUkxdLFxuICAgICAgICAgIHN0YXR1czogJydcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgdHJ5IHtcbiAgICAgICAgc2NoZWR1bGVUYXNrKHRhc2spO1xuICAgICAgICByZXR1cm4gc2VuZE5hdGl2ZS5hcHBseShzZWxmLCBhcmdzKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaW52b2tlVGFzayh0YXNrLCBFUlJPUik7XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9XG4gICAgfTtcbiAgfSk7XG59IiwiaW1wb3J0IFByb21pc2VQb2xseWZpbGwgZnJvbSAncHJvbWlzZS1wb2x5ZmlsbCc7XG5pbXBvcnQgeyBpc0Jyb3dzZXIgfSBmcm9tICcuL3V0aWxzJztcbnZhciBsb2NhbCA9IHt9O1xuXG5pZiAoaXNCcm93c2VyKSB7XG4gIGxvY2FsID0gd2luZG93O1xufSBlbHNlIGlmICh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgbG9jYWwgPSBzZWxmO1xufVxuXG52YXIgUHJvbWlzZSA9ICdQcm9taXNlJyBpbiBsb2NhbCA/IGxvY2FsLlByb21pc2UgOiBQcm9taXNlUG9sbHlmaWxsO1xuZXhwb3J0IHsgUHJvbWlzZSB9OyIsInZhciBRdWV1ZSA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gUXVldWUob25GbHVzaCwgb3B0cykge1xuICAgIGlmIChvcHRzID09PSB2b2lkIDApIHtcbiAgICAgIG9wdHMgPSB7fTtcbiAgICB9XG5cbiAgICB0aGlzLm9uRmx1c2ggPSBvbkZsdXNoO1xuICAgIHRoaXMuaXRlbXMgPSBbXTtcbiAgICB0aGlzLnF1ZXVlTGltaXQgPSBvcHRzLnF1ZXVlTGltaXQgfHwgLTE7XG4gICAgdGhpcy5mbHVzaEludGVydmFsID0gb3B0cy5mbHVzaEludGVydmFsIHx8IDA7XG4gICAgdGhpcy50aW1lb3V0SWQgPSB1bmRlZmluZWQ7XG4gIH1cblxuICB2YXIgX3Byb3RvID0gUXVldWUucHJvdG90eXBlO1xuXG4gIF9wcm90by5fc2V0VGltZXIgPSBmdW5jdGlvbiBfc2V0VGltZXIoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHRoaXMudGltZW91dElkID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gX3RoaXMuZmx1c2goKTtcbiAgICB9LCB0aGlzLmZsdXNoSW50ZXJ2YWwpO1xuICB9O1xuXG4gIF9wcm90by5fY2xlYXIgPSBmdW5jdGlvbiBfY2xlYXIoKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLnRpbWVvdXRJZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXRJZCk7XG4gICAgICB0aGlzLnRpbWVvdXRJZCA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICB0aGlzLml0ZW1zID0gW107XG4gIH07XG5cbiAgX3Byb3RvLmZsdXNoID0gZnVuY3Rpb24gZmx1c2goKSB7XG4gICAgdGhpcy5vbkZsdXNoKHRoaXMuaXRlbXMpO1xuXG4gICAgdGhpcy5fY2xlYXIoKTtcbiAgfTtcblxuICBfcHJvdG8uYWRkID0gZnVuY3Rpb24gYWRkKGl0ZW0pIHtcbiAgICB0aGlzLml0ZW1zLnB1c2goaXRlbSk7XG5cbiAgICBpZiAodGhpcy5xdWV1ZUxpbWl0ICE9PSAtMSAmJiB0aGlzLml0ZW1zLmxlbmd0aCA+PSB0aGlzLnF1ZXVlTGltaXQpIHtcbiAgICAgIHRoaXMuZmx1c2goKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHR5cGVvZiB0aGlzLnRpbWVvdXRJZCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdGhpcy5fc2V0VGltZXIoKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIFF1ZXVlO1xufSgpO1xuXG5leHBvcnQgZGVmYXVsdCBRdWV1ZTsiLCJ2YXIgX3NlcnZpY2VDcmVhdG9ycztcblxuaW1wb3J0IEFwbVNlcnZlciBmcm9tICcuL2FwbS1zZXJ2ZXInO1xuaW1wb3J0IENvbmZpZ1NlcnZpY2UgZnJvbSAnLi9jb25maWctc2VydmljZSc7XG5pbXBvcnQgTG9nZ2luZ1NlcnZpY2UgZnJvbSAnLi9sb2dnaW5nLXNlcnZpY2UnO1xuaW1wb3J0IHsgQ09ORklHX0NIQU5HRSwgQ09ORklHX1NFUlZJQ0UsIExPR0dJTkdfU0VSVklDRSwgQVBNX1NFUlZFUiB9IGZyb20gJy4vY29uc3RhbnRzJztcbmltcG9ydCB7IF9fREVWX18gfSBmcm9tICcuLi9zdGF0ZSc7XG52YXIgc2VydmljZUNyZWF0b3JzID0gKF9zZXJ2aWNlQ3JlYXRvcnMgPSB7fSwgX3NlcnZpY2VDcmVhdG9yc1tDT05GSUdfU0VSVklDRV0gPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBuZXcgQ29uZmlnU2VydmljZSgpO1xufSwgX3NlcnZpY2VDcmVhdG9yc1tMT0dHSU5HX1NFUlZJQ0VdID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gbmV3IExvZ2dpbmdTZXJ2aWNlKHtcbiAgICBwcmVmaXg6ICdbRWxhc3RpYyBBUE1dICdcbiAgfSk7XG59LCBfc2VydmljZUNyZWF0b3JzW0FQTV9TRVJWRVJdID0gZnVuY3Rpb24gKGZhY3RvcnkpIHtcbiAgdmFyIF9mYWN0b3J5JGdldFNlcnZpY2UgPSBmYWN0b3J5LmdldFNlcnZpY2UoW0NPTkZJR19TRVJWSUNFLCBMT0dHSU5HX1NFUlZJQ0VdKSxcbiAgICAgIGNvbmZpZ1NlcnZpY2UgPSBfZmFjdG9yeSRnZXRTZXJ2aWNlWzBdLFxuICAgICAgbG9nZ2luZ1NlcnZpY2UgPSBfZmFjdG9yeSRnZXRTZXJ2aWNlWzFdO1xuXG4gIHJldHVybiBuZXcgQXBtU2VydmVyKGNvbmZpZ1NlcnZpY2UsIGxvZ2dpbmdTZXJ2aWNlKTtcbn0sIF9zZXJ2aWNlQ3JlYXRvcnMpO1xuXG52YXIgU2VydmljZUZhY3RvcnkgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFNlcnZpY2VGYWN0b3J5KCkge1xuICAgIHRoaXMuaW5zdGFuY2VzID0ge307XG4gICAgdGhpcy5pbml0aWFsaXplZCA9IGZhbHNlO1xuICB9XG5cbiAgdmFyIF9wcm90byA9IFNlcnZpY2VGYWN0b3J5LnByb3RvdHlwZTtcblxuICBfcHJvdG8uaW5pdCA9IGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgaWYgKHRoaXMuaW5pdGlhbGl6ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICB2YXIgY29uZmlnU2VydmljZSA9IHRoaXMuZ2V0U2VydmljZShDT05GSUdfU0VSVklDRSk7XG4gICAgY29uZmlnU2VydmljZS5pbml0KCk7XG5cbiAgICB2YXIgX3RoaXMkZ2V0U2VydmljZSA9IHRoaXMuZ2V0U2VydmljZShbTE9HR0lOR19TRVJWSUNFLCBBUE1fU0VSVkVSXSksXG4gICAgICAgIGxvZ2dpbmdTZXJ2aWNlID0gX3RoaXMkZ2V0U2VydmljZVswXSxcbiAgICAgICAgYXBtU2VydmVyID0gX3RoaXMkZ2V0U2VydmljZVsxXTtcblxuICAgIGNvbmZpZ1NlcnZpY2UuZXZlbnRzLm9ic2VydmUoQ09ORklHX0NIQU5HRSwgZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGxvZ0xldmVsID0gY29uZmlnU2VydmljZS5nZXQoJ2xvZ0xldmVsJyk7XG4gICAgICBsb2dnaW5nU2VydmljZS5zZXRMZXZlbChsb2dMZXZlbCk7XG4gICAgfSk7XG4gICAgYXBtU2VydmVyLmluaXQoKTtcbiAgfTtcblxuICBfcHJvdG8uZ2V0U2VydmljZSA9IGZ1bmN0aW9uIGdldFNlcnZpY2UobmFtZSkge1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZiAodHlwZW9mIG5hbWUgPT09ICdzdHJpbmcnKSB7XG4gICAgICBpZiAoIXRoaXMuaW5zdGFuY2VzW25hbWVdKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2VydmljZUNyZWF0b3JzW25hbWVdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgdGhpcy5pbnN0YW5jZXNbbmFtZV0gPSBzZXJ2aWNlQ3JlYXRvcnNbbmFtZV0odGhpcyk7XG4gICAgICAgIH0gZWxzZSBpZiAoX19ERVZfXykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdDYW5ub3QgZ2V0IHNlcnZpY2UsIE5vIGNyZWF0b3IgZm9yOiAnICsgbmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuaW5zdGFuY2VzW25hbWVdO1xuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShuYW1lKSkge1xuICAgICAgcmV0dXJuIG5hbWUubWFwKGZ1bmN0aW9uIChuKSB7XG4gICAgICAgIHJldHVybiBfdGhpcy5nZXRTZXJ2aWNlKG4pO1xuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBTZXJ2aWNlRmFjdG9yeTtcbn0oKTtcblxuZXhwb3J0IHsgc2VydmljZUNyZWF0b3JzLCBTZXJ2aWNlRmFjdG9yeSB9OyIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRocm90dGxlKGZuLCBvblRocm90dGxlLCBvcHRzKSB7XG4gIHZhciBjb250ZXh0ID0gdGhpcztcbiAgdmFyIGxpbWl0ID0gb3B0cy5saW1pdDtcbiAgdmFyIGludGVydmFsID0gb3B0cy5pbnRlcnZhbDtcbiAgdmFyIGNvdW50ZXIgPSAwO1xuICB2YXIgdGltZW91dElkO1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIGNvdW50ZXIrKztcblxuICAgIGlmICh0eXBlb2YgdGltZW91dElkID09PSAndW5kZWZpbmVkJykge1xuICAgICAgdGltZW91dElkID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGNvdW50ZXIgPSAwO1xuICAgICAgICB0aW1lb3V0SWQgPSB1bmRlZmluZWQ7XG4gICAgICB9LCBpbnRlcnZhbCk7XG4gICAgfVxuXG4gICAgaWYgKGNvdW50ZXIgPiBsaW1pdCAmJiB0eXBlb2Ygb25UaHJvdHRsZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIG9uVGhyb3R0bGUuYXBwbHkoY29udGV4dCwgYXJndW1lbnRzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZuLmFwcGx5KGNvbnRleHQsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9O1xufSIsImltcG9ydCB7IEtFWVdPUkRfTElNSVQgfSBmcm9tICcuL2NvbnN0YW50cyc7XG52YXIgTUVUQURBVEFfTU9ERUwgPSB7XG4gIHNlcnZpY2U6IHtcbiAgICBuYW1lOiBbS0VZV09SRF9MSU1JVCwgdHJ1ZV0sXG4gICAgdmVyc2lvbjogdHJ1ZSxcbiAgICBhZ2VudDoge1xuICAgICAgdmVyc2lvbjogW0tFWVdPUkRfTElNSVQsIHRydWVdXG4gICAgfSxcbiAgICBlbnZpcm9ubWVudDogdHJ1ZVxuICB9LFxuICBsYWJlbHM6IHtcbiAgICAnKic6IHRydWVcbiAgfVxufTtcbnZhciBSRVNQT05TRV9NT0RFTCA9IHtcbiAgJyonOiB0cnVlLFxuICBoZWFkZXJzOiB7XG4gICAgJyonOiB0cnVlXG4gIH1cbn07XG52YXIgREVTVElOQVRJT05fTU9ERUwgPSB7XG4gIGFkZHJlc3M6IFtLRVlXT1JEX0xJTUlUXSxcbiAgc2VydmljZToge1xuICAgICcqJzogW0tFWVdPUkRfTElNSVQsIHRydWVdXG4gIH1cbn07XG52YXIgQ09OVEVYVF9NT0RFTCA9IHtcbiAgdXNlcjoge1xuICAgIGlkOiB0cnVlLFxuICAgIGVtYWlsOiB0cnVlLFxuICAgIHVzZXJuYW1lOiB0cnVlXG4gIH0sXG4gIHRhZ3M6IHtcbiAgICAnKic6IHRydWVcbiAgfSxcbiAgaHR0cDoge1xuICAgIHJlc3BvbnNlOiBSRVNQT05TRV9NT0RFTFxuICB9LFxuICBkZXN0aW5hdGlvbjogREVTVElOQVRJT05fTU9ERUwsXG4gIHJlc3BvbnNlOiBSRVNQT05TRV9NT0RFTFxufTtcbnZhciBTUEFOX01PREVMID0ge1xuICBuYW1lOiBbS0VZV09SRF9MSU1JVCwgdHJ1ZV0sXG4gIHR5cGU6IFtLRVlXT1JEX0xJTUlULCB0cnVlXSxcbiAgaWQ6IFtLRVlXT1JEX0xJTUlULCB0cnVlXSxcbiAgdHJhY2VfaWQ6IFtLRVlXT1JEX0xJTUlULCB0cnVlXSxcbiAgcGFyZW50X2lkOiBbS0VZV09SRF9MSU1JVCwgdHJ1ZV0sXG4gIHRyYW5zYWN0aW9uX2lkOiBbS0VZV09SRF9MSU1JVCwgdHJ1ZV0sXG4gIHN1YnR5cGU6IHRydWUsXG4gIGFjdGlvbjogdHJ1ZSxcbiAgY29udGV4dDogQ09OVEVYVF9NT0RFTFxufTtcbnZhciBUUkFOU0FDVElPTl9NT0RFTCA9IHtcbiAgbmFtZTogdHJ1ZSxcbiAgcGFyZW50X2lkOiB0cnVlLFxuICB0eXBlOiBbS0VZV09SRF9MSU1JVCwgdHJ1ZV0sXG4gIGlkOiBbS0VZV09SRF9MSU1JVCwgdHJ1ZV0sXG4gIHRyYWNlX2lkOiBbS0VZV09SRF9MSU1JVCwgdHJ1ZV0sXG4gIHNwYW5fY291bnQ6IHtcbiAgICBzdGFydGVkOiBbS0VZV09SRF9MSU1JVCwgdHJ1ZV1cbiAgfSxcbiAgY29udGV4dDogQ09OVEVYVF9NT0RFTFxufTtcbnZhciBFUlJPUl9NT0RFTCA9IHtcbiAgaWQ6IFtLRVlXT1JEX0xJTUlULCB0cnVlXSxcbiAgdHJhY2VfaWQ6IHRydWUsXG4gIHRyYW5zYWN0aW9uX2lkOiB0cnVlLFxuICBwYXJlbnRfaWQ6IHRydWUsXG4gIGN1bHByaXQ6IHRydWUsXG4gIGV4Y2VwdGlvbjoge1xuICAgIHR5cGU6IHRydWVcbiAgfSxcbiAgdHJhbnNhY3Rpb246IHtcbiAgICB0eXBlOiB0cnVlXG4gIH0sXG4gIGNvbnRleHQ6IENPTlRFWFRfTU9ERUxcbn07XG5cbmZ1bmN0aW9uIHRydW5jYXRlKHZhbHVlLCBsaW1pdCwgcmVxdWlyZWQsIHBsYWNlaG9sZGVyKSB7XG4gIGlmIChsaW1pdCA9PT0gdm9pZCAwKSB7XG4gICAgbGltaXQgPSBLRVlXT1JEX0xJTUlUO1xuICB9XG5cbiAgaWYgKHJlcXVpcmVkID09PSB2b2lkIDApIHtcbiAgICByZXF1aXJlZCA9IGZhbHNlO1xuICB9XG5cbiAgaWYgKHBsYWNlaG9sZGVyID09PSB2b2lkIDApIHtcbiAgICBwbGFjZWhvbGRlciA9ICdOL0EnO1xuICB9XG5cbiAgaWYgKHJlcXVpcmVkICYmIGlzRW1wdHkodmFsdWUpKSB7XG4gICAgdmFsdWUgPSBwbGFjZWhvbGRlcjtcbiAgfVxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHZhbHVlLnN1YnN0cmluZygwLCBsaW1pdCk7XG4gIH1cblxuICByZXR1cm4gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIGlzRW1wdHkodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlID09IG51bGwgfHwgdmFsdWUgPT09ICcnIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCc7XG59XG5cbmZ1bmN0aW9uIHJlcGxhY2VWYWx1ZSh0YXJnZXQsIGtleSwgY3Vyck1vZGVsKSB7XG4gIHZhciB2YWx1ZSA9IHRydW5jYXRlKHRhcmdldFtrZXldLCBjdXJyTW9kZWxbMF0sIGN1cnJNb2RlbFsxXSk7XG5cbiAgaWYgKGlzRW1wdHkodmFsdWUpKSB7XG4gICAgZGVsZXRlIHRhcmdldFtrZXldO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRhcmdldFtrZXldID0gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIHRydW5jYXRlTW9kZWwobW9kZWwsIHRhcmdldCwgY2hpbGRUYXJnZXQpIHtcbiAgaWYgKG1vZGVsID09PSB2b2lkIDApIHtcbiAgICBtb2RlbCA9IHt9O1xuICB9XG5cbiAgaWYgKGNoaWxkVGFyZ2V0ID09PSB2b2lkIDApIHtcbiAgICBjaGlsZFRhcmdldCA9IHRhcmdldDtcbiAgfVxuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMobW9kZWwpO1xuICB2YXIgZW1wdHlBcnIgPSBbXTtcblxuICB2YXIgX2xvb3AgPSBmdW5jdGlvbiBfbG9vcChpKSB7XG4gICAgdmFyIGN1cnJLZXkgPSBrZXlzW2ldO1xuICAgIHZhciBjdXJyTW9kZWwgPSBtb2RlbFtjdXJyS2V5XSA9PT0gdHJ1ZSA/IGVtcHR5QXJyIDogbW9kZWxbY3VycktleV07XG5cbiAgICBpZiAoIUFycmF5LmlzQXJyYXkoY3Vyck1vZGVsKSkge1xuICAgICAgdHJ1bmNhdGVNb2RlbChjdXJyTW9kZWwsIHRhcmdldCwgY2hpbGRUYXJnZXRbY3VycktleV0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoY3VycktleSA9PT0gJyonKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKGNoaWxkVGFyZ2V0KS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICByZXR1cm4gcmVwbGFjZVZhbHVlKGNoaWxkVGFyZ2V0LCBrZXksIGN1cnJNb2RlbCk7XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVwbGFjZVZhbHVlKGNoaWxkVGFyZ2V0LCBjdXJyS2V5LCBjdXJyTW9kZWwpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICBfbG9vcChpKTtcbiAgfVxuXG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbmV4cG9ydCB7IHRydW5jYXRlLCB0cnVuY2F0ZU1vZGVsLCBTUEFOX01PREVMLCBUUkFOU0FDVElPTl9NT0RFTCwgRVJST1JfTU9ERUwsIE1FVEFEQVRBX01PREVMLCBSRVNQT05TRV9NT0RFTCB9OyIsImltcG9ydCB7IGlzQnJvd3NlciB9IGZyb20gJy4vdXRpbHMnO1xuXG5mdW5jdGlvbiBpc0RlZmF1bHRQb3J0KHBvcnQsIHByb3RvY29sKSB7XG4gIHN3aXRjaCAocHJvdG9jb2wpIHtcbiAgICBjYXNlICdodHRwOic6XG4gICAgICByZXR1cm4gcG9ydCA9PT0gJzgwJztcblxuICAgIGNhc2UgJ2h0dHBzOic6XG4gICAgICByZXR1cm4gcG9ydCA9PT0gJzQ0Myc7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxudmFyIFJVTEVTID0gW1snIycsICdoYXNoJ10sIFsnPycsICdxdWVyeSddLCBbJy8nLCAncGF0aCddLCBbJ0AnLCAnYXV0aCcsIDFdLCBbTmFOLCAnaG9zdCcsIHVuZGVmaW5lZCwgMV1dO1xudmFyIFBST1RPQ09MX1JFR0VYID0gL14oW2Etel1bYS16MC05ListXSo6KT8oXFwvXFwvKT8oW1xcU1xcc10qKS9pO1xuZXhwb3J0IHZhciBVcmwgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFVybCh1cmwpIHtcbiAgICB2YXIgX3RoaXMkZXh0cmFjdFByb3RvY29sID0gdGhpcy5leHRyYWN0UHJvdG9jb2wodXJsIHx8ICcnKSxcbiAgICAgICAgcHJvdG9jb2wgPSBfdGhpcyRleHRyYWN0UHJvdG9jb2wucHJvdG9jb2wsXG4gICAgICAgIGFkZHJlc3MgPSBfdGhpcyRleHRyYWN0UHJvdG9jb2wuYWRkcmVzcyxcbiAgICAgICAgc2xhc2hlcyA9IF90aGlzJGV4dHJhY3RQcm90b2NvbC5zbGFzaGVzO1xuXG4gICAgdmFyIHJlbGF0aXZlID0gIXByb3RvY29sICYmICFzbGFzaGVzO1xuICAgIHZhciBsb2NhdGlvbiA9IHRoaXMuZ2V0TG9jYXRpb24oKTtcbiAgICB2YXIgaW5zdHJ1Y3Rpb25zID0gUlVMRVMuc2xpY2UoKTtcbiAgICBhZGRyZXNzID0gYWRkcmVzcy5yZXBsYWNlKCdcXFxcJywgJy8nKTtcblxuICAgIGlmICghc2xhc2hlcykge1xuICAgICAgaW5zdHJ1Y3Rpb25zWzJdID0gW05hTiwgJ3BhdGgnXTtcbiAgICB9XG5cbiAgICB2YXIgaW5kZXg7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGluc3RydWN0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGluc3RydWN0aW9uID0gaW5zdHJ1Y3Rpb25zW2ldO1xuICAgICAgdmFyIHBhcnNlID0gaW5zdHJ1Y3Rpb25bMF07XG4gICAgICB2YXIga2V5ID0gaW5zdHJ1Y3Rpb25bMV07XG5cbiAgICAgIGlmICh0eXBlb2YgcGFyc2UgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGluZGV4ID0gYWRkcmVzcy5pbmRleE9mKHBhcnNlKTtcblxuICAgICAgICBpZiAofmluZGV4KSB7XG4gICAgICAgICAgdmFyIGluc3RMZW5ndGggPSBpbnN0cnVjdGlvblsyXTtcblxuICAgICAgICAgIGlmIChpbnN0TGVuZ3RoKSB7XG4gICAgICAgICAgICB2YXIgbmV3SW5kZXggPSBhZGRyZXNzLmxhc3RJbmRleE9mKHBhcnNlKTtcbiAgICAgICAgICAgIGluZGV4ID0gTWF0aC5tYXgoaW5kZXgsIG5ld0luZGV4KTtcbiAgICAgICAgICAgIHRoaXNba2V5XSA9IGFkZHJlc3Muc2xpY2UoMCwgaW5kZXgpO1xuICAgICAgICAgICAgYWRkcmVzcyA9IGFkZHJlc3Muc2xpY2UoaW5kZXggKyBpbnN0TGVuZ3RoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpc1trZXldID0gYWRkcmVzcy5zbGljZShpbmRleCk7XG4gICAgICAgICAgICBhZGRyZXNzID0gYWRkcmVzcy5zbGljZSgwLCBpbmRleCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzW2tleV0gPSBhZGRyZXNzO1xuICAgICAgICBhZGRyZXNzID0gJyc7XG4gICAgICB9XG5cbiAgICAgIHRoaXNba2V5XSA9IHRoaXNba2V5XSB8fCAocmVsYXRpdmUgJiYgaW5zdHJ1Y3Rpb25bM10gPyBsb2NhdGlvbltrZXldIHx8ICcnIDogJycpO1xuICAgICAgaWYgKGluc3RydWN0aW9uWzNdKSB0aGlzW2tleV0gPSB0aGlzW2tleV0udG9Mb3dlckNhc2UoKTtcbiAgICB9XG5cbiAgICBpZiAocmVsYXRpdmUgJiYgdGhpcy5wYXRoLmNoYXJBdCgwKSAhPT0gJy8nKSB7XG4gICAgICB0aGlzLnBhdGggPSAnLycgKyB0aGlzLnBhdGg7XG4gICAgfVxuXG4gICAgdGhpcy5yZWxhdGl2ZSA9IHJlbGF0aXZlO1xuICAgIHRoaXMucHJvdG9jb2wgPSBwcm90b2NvbCB8fCBsb2NhdGlvbi5wcm90b2NvbDtcbiAgICB0aGlzLmhvc3RuYW1lID0gdGhpcy5ob3N0O1xuICAgIHRoaXMucG9ydCA9ICcnO1xuXG4gICAgaWYgKC86XFxkKyQvLnRlc3QodGhpcy5ob3N0KSkge1xuICAgICAgdmFyIHZhbHVlID0gdGhpcy5ob3N0LnNwbGl0KCc6Jyk7XG4gICAgICB2YXIgcG9ydCA9IHZhbHVlLnBvcCgpO1xuICAgICAgdmFyIGhvc3RuYW1lID0gdmFsdWUuam9pbignOicpO1xuXG4gICAgICBpZiAoaXNEZWZhdWx0UG9ydChwb3J0LCB0aGlzLnByb3RvY29sKSkge1xuICAgICAgICB0aGlzLmhvc3QgPSBob3N0bmFtZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucG9ydCA9IHBvcnQ7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuaG9zdG5hbWUgPSBob3N0bmFtZTtcbiAgICB9XG5cbiAgICB0aGlzLm9yaWdpbiA9IHRoaXMucHJvdG9jb2wgJiYgdGhpcy5ob3N0ICYmIHRoaXMucHJvdG9jb2wgIT09ICdmaWxlOicgPyB0aGlzLnByb3RvY29sICsgJy8vJyArIHRoaXMuaG9zdCA6ICdudWxsJztcbiAgICB0aGlzLmhyZWYgPSB0aGlzLnRvU3RyaW5nKCk7XG4gIH1cblxuICB2YXIgX3Byb3RvID0gVXJsLnByb3RvdHlwZTtcblxuICBfcHJvdG8udG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICB2YXIgcmVzdWx0ID0gdGhpcy5wcm90b2NvbDtcbiAgICByZXN1bHQgKz0gJy8vJztcblxuICAgIGlmICh0aGlzLmF1dGgpIHtcbiAgICAgIHZhciBSRURBQ1RFRCA9ICdbUkVEQUNURURdJztcbiAgICAgIHZhciB1c2VycGFzcyA9IHRoaXMuYXV0aC5zcGxpdCgnOicpO1xuICAgICAgdmFyIHVzZXJuYW1lID0gdXNlcnBhc3NbMF0gPyBSRURBQ1RFRCA6ICcnO1xuICAgICAgdmFyIHBhc3N3b3JkID0gdXNlcnBhc3NbMV0gPyAnOicgKyBSRURBQ1RFRCA6ICcnO1xuICAgICAgcmVzdWx0ICs9IHVzZXJuYW1lICsgcGFzc3dvcmQgKyAnQCc7XG4gICAgfVxuXG4gICAgcmVzdWx0ICs9IHRoaXMuaG9zdDtcbiAgICByZXN1bHQgKz0gdGhpcy5wYXRoO1xuICAgIHJlc3VsdCArPSB0aGlzLnF1ZXJ5O1xuICAgIHJlc3VsdCArPSB0aGlzLmhhc2g7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcblxuICBfcHJvdG8uZ2V0TG9jYXRpb24gPSBmdW5jdGlvbiBnZXRMb2NhdGlvbigpIHtcbiAgICB2YXIgZ2xvYmFsVmFyID0ge307XG5cbiAgICBpZiAoaXNCcm93c2VyKSB7XG4gICAgICBnbG9iYWxWYXIgPSB3aW5kb3c7XG4gICAgfVxuXG4gICAgcmV0dXJuIGdsb2JhbFZhci5sb2NhdGlvbjtcbiAgfTtcblxuICBfcHJvdG8uZXh0cmFjdFByb3RvY29sID0gZnVuY3Rpb24gZXh0cmFjdFByb3RvY29sKHVybCkge1xuICAgIHZhciBtYXRjaCA9IFBST1RPQ09MX1JFR0VYLmV4ZWModXJsKTtcbiAgICByZXR1cm4ge1xuICAgICAgcHJvdG9jb2w6IG1hdGNoWzFdID8gbWF0Y2hbMV0udG9Mb3dlckNhc2UoKSA6ICcnLFxuICAgICAgc2xhc2hlczogISFtYXRjaFsyXSxcbiAgICAgIGFkZHJlc3M6IG1hdGNoWzNdXG4gICAgfTtcbiAgfTtcblxuICByZXR1cm4gVXJsO1xufSgpO1xuZXhwb3J0IGZ1bmN0aW9uIHNsdWdpZnlVcmwodXJsU3RyLCBkZXB0aCkge1xuICBpZiAoZGVwdGggPT09IHZvaWQgMCkge1xuICAgIGRlcHRoID0gMjtcbiAgfVxuXG4gIHZhciBwYXJzZWRVcmwgPSBuZXcgVXJsKHVybFN0cik7XG4gIHZhciBxdWVyeSA9IHBhcnNlZFVybC5xdWVyeSxcbiAgICAgIHBhdGggPSBwYXJzZWRVcmwucGF0aDtcbiAgdmFyIHBhdGhQYXJ0cyA9IHBhdGguc3Vic3RyaW5nKDEpLnNwbGl0KCcvJyk7XG4gIHZhciByZWRhY3RTdHJpbmcgPSAnOmlkJztcbiAgdmFyIHdpbGRjYXJkID0gJyonO1xuICB2YXIgc3BlY2lhbENoYXJzUmVnZXggPSAvXFxXfF8vZztcbiAgdmFyIGRpZ2l0c1JlZ2V4ID0gL1swLTldL2c7XG4gIHZhciBsb3dlckNhc2VSZWdleCA9IC9bYS16XS9nO1xuICB2YXIgdXBwZXJDYXNlUmVnZXggPSAvW0EtWl0vZztcbiAgdmFyIHJlZGFjdGVkUGFydHMgPSBbXTtcbiAgdmFyIHJlZGFjdGVkQmVmb3JlID0gZmFsc2U7XG5cbiAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IHBhdGhQYXJ0cy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICB2YXIgcGFydCA9IHBhdGhQYXJ0c1tpbmRleF07XG5cbiAgICBpZiAocmVkYWN0ZWRCZWZvcmUgfHwgaW5kZXggPiBkZXB0aCAtIDEpIHtcbiAgICAgIGlmIChwYXJ0KSB7XG4gICAgICAgIHJlZGFjdGVkUGFydHMucHVzaCh3aWxkY2FyZCk7XG4gICAgICB9XG5cbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIHZhciBudW1iZXJPZlNwZWNpYWxDaGFycyA9IChwYXJ0Lm1hdGNoKHNwZWNpYWxDaGFyc1JlZ2V4KSB8fCBbXSkubGVuZ3RoO1xuXG4gICAgaWYgKG51bWJlck9mU3BlY2lhbENoYXJzID49IDIpIHtcbiAgICAgIHJlZGFjdGVkUGFydHMucHVzaChyZWRhY3RTdHJpbmcpO1xuICAgICAgcmVkYWN0ZWRCZWZvcmUgPSB0cnVlO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgdmFyIG51bWJlck9mRGlnaXRzID0gKHBhcnQubWF0Y2goZGlnaXRzUmVnZXgpIHx8IFtdKS5sZW5ndGg7XG5cbiAgICBpZiAobnVtYmVyT2ZEaWdpdHMgPiAzIHx8IHBhcnQubGVuZ3RoID4gMyAmJiBudW1iZXJPZkRpZ2l0cyAvIHBhcnQubGVuZ3RoID49IDAuMykge1xuICAgICAgcmVkYWN0ZWRQYXJ0cy5wdXNoKHJlZGFjdFN0cmluZyk7XG4gICAgICByZWRhY3RlZEJlZm9yZSA9IHRydWU7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICB2YXIgbnVtYmVyb2ZVcHBlckNhc2UgPSAocGFydC5tYXRjaCh1cHBlckNhc2VSZWdleCkgfHwgW10pLmxlbmd0aDtcbiAgICB2YXIgbnVtYmVyb2ZMb3dlckNhc2UgPSAocGFydC5tYXRjaChsb3dlckNhc2VSZWdleCkgfHwgW10pLmxlbmd0aDtcbiAgICB2YXIgbG93ZXJDYXNlUmF0ZSA9IG51bWJlcm9mTG93ZXJDYXNlIC8gcGFydC5sZW5ndGg7XG4gICAgdmFyIHVwcGVyQ2FzZVJhdGUgPSBudW1iZXJvZlVwcGVyQ2FzZSAvIHBhcnQubGVuZ3RoO1xuXG4gICAgaWYgKHBhcnQubGVuZ3RoID4gNSAmJiAodXBwZXJDYXNlUmF0ZSA+IDAuMyAmJiB1cHBlckNhc2VSYXRlIDwgMC42IHx8IGxvd2VyQ2FzZVJhdGUgPiAwLjMgJiYgbG93ZXJDYXNlUmF0ZSA8IDAuNikpIHtcbiAgICAgIHJlZGFjdGVkUGFydHMucHVzaChyZWRhY3RTdHJpbmcpO1xuICAgICAgcmVkYWN0ZWRCZWZvcmUgPSB0cnVlO1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgcGFydCAmJiByZWRhY3RlZFBhcnRzLnB1c2gocGFydCk7XG4gIH1cblxuICB2YXIgcmVkYWN0ZWQgPSAnLycgKyAocmVkYWN0ZWRQYXJ0cy5sZW5ndGggPj0gMiA/IHJlZGFjdGVkUGFydHMuam9pbignLycpIDogcmVkYWN0ZWRQYXJ0cy5qb2luKCcnKSkgKyAocXVlcnkgPyAnP3txdWVyeX0nIDogJycpO1xuICByZXR1cm4gcmVkYWN0ZWQ7XG59IiwiaW1wb3J0IHsgUHJvbWlzZSB9IGZyb20gJy4vcG9seWZpbGxzJztcbnZhciBzbGljZSA9IFtdLnNsaWNlO1xudmFyIGlzQnJvd3NlciA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnO1xudmFyIFBFUkYgPSBpc0Jyb3dzZXIgJiYgdHlwZW9mIHBlcmZvcm1hbmNlICE9PSAndW5kZWZpbmVkJyA/IHBlcmZvcm1hbmNlIDoge307XG5cbmZ1bmN0aW9uIGlzQ09SU1N1cHBvcnRlZCgpIHtcbiAgdmFyIHhociA9IG5ldyB3aW5kb3cuWE1MSHR0cFJlcXVlc3QoKTtcbiAgcmV0dXJuICd3aXRoQ3JlZGVudGlhbHMnIGluIHhocjtcbn1cblxudmFyIGJ5dGVUb0hleCA9IFtdO1xuXG5mb3IgKHZhciBpID0gMDsgaSA8IDI1NjsgKytpKSB7XG4gIGJ5dGVUb0hleFtpXSA9IChpICsgMHgxMDApLnRvU3RyaW5nKDE2KS5zdWJzdHIoMSk7XG59XG5cbmZ1bmN0aW9uIGJ5dGVzVG9IZXgoYnVmZmVyKSB7XG4gIHZhciBoZXhPY3RldHMgPSBbXTtcblxuICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYnVmZmVyLmxlbmd0aDsgX2krKykge1xuICAgIGhleE9jdGV0cy5wdXNoKGJ5dGVUb0hleFtidWZmZXJbX2ldXSk7XG4gIH1cblxuICByZXR1cm4gaGV4T2N0ZXRzLmpvaW4oJycpO1xufVxuXG52YXIgZGVzdGluYXRpb24gPSBuZXcgVWludDhBcnJheSgxNik7XG5cbmZ1bmN0aW9uIHJuZygpIHtcbiAgaWYgKHR5cGVvZiBjcnlwdG8gIT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGNyeXB0by5nZXRSYW5kb21WYWx1ZXMgPT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKGRlc3RpbmF0aW9uKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgbXNDcnlwdG8gIT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG1zQ3J5cHRvLmdldFJhbmRvbVZhbHVlcyA9PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIG1zQ3J5cHRvLmdldFJhbmRvbVZhbHVlcyhkZXN0aW5hdGlvbik7XG4gIH1cblxuICByZXR1cm4gZGVzdGluYXRpb247XG59XG5cbmZ1bmN0aW9uIGdlbmVyYXRlUmFuZG9tSWQobGVuZ3RoKSB7XG4gIHZhciBpZCA9IGJ5dGVzVG9IZXgocm5nKCkpO1xuICByZXR1cm4gaWQuc3Vic3RyKDAsIGxlbmd0aCk7XG59XG5cbmZ1bmN0aW9uIGdldER0SGVhZGVyVmFsdWUoc3Bhbikge1xuICB2YXIgZHRWZXJzaW9uID0gJzAwJztcbiAgdmFyIGR0VW5TYW1wbGVkRmxhZ3MgPSAnMDAnO1xuICB2YXIgZHRTYW1wbGVkRmxhZ3MgPSAnMDEnO1xuXG4gIGlmIChzcGFuICYmIHNwYW4udHJhY2VJZCAmJiBzcGFuLmlkICYmIHNwYW4ucGFyZW50SWQpIHtcbiAgICB2YXIgZmxhZ3MgPSBzcGFuLnNhbXBsZWQgPyBkdFNhbXBsZWRGbGFncyA6IGR0VW5TYW1wbGVkRmxhZ3M7XG4gICAgdmFyIGlkID0gc3Bhbi5zYW1wbGVkID8gc3Bhbi5pZCA6IHNwYW4ucGFyZW50SWQ7XG4gICAgcmV0dXJuIGR0VmVyc2lvbiArICctJyArIHNwYW4udHJhY2VJZCArICctJyArIGlkICsgJy0nICsgZmxhZ3M7XG4gIH1cbn1cblxuZnVuY3Rpb24gcGFyc2VEdEhlYWRlclZhbHVlKHZhbHVlKSB7XG4gIHZhciBwYXJzZWQgPSAvXihbXFxkYS1mXXsyfSktKFtcXGRhLWZdezMyfSktKFtcXGRhLWZdezE2fSktKFtcXGRhLWZdezJ9KSQvLmV4ZWModmFsdWUpO1xuXG4gIGlmIChwYXJzZWQpIHtcbiAgICB2YXIgZmxhZ3MgPSBwYXJzZWRbNF07XG4gICAgdmFyIHNhbXBsZWQgPSBmbGFncyAhPT0gJzAwJztcbiAgICByZXR1cm4ge1xuICAgICAgdHJhY2VJZDogcGFyc2VkWzJdLFxuICAgICAgaWQ6IHBhcnNlZFszXSxcbiAgICAgIHNhbXBsZWQ6IHNhbXBsZWRcbiAgICB9O1xuICB9XG59XG5cbmZ1bmN0aW9uIGlzRHRIZWFkZXJWYWxpZChoZWFkZXIpIHtcbiAgcmV0dXJuIC9eW1xcZGEtZl17Mn0tW1xcZGEtZl17MzJ9LVtcXGRhLWZdezE2fS1bXFxkYS1mXXsyfSQvLnRlc3QoaGVhZGVyKSAmJiBoZWFkZXIuc2xpY2UoMywgMzUpICE9PSAnMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAnICYmIGhlYWRlci5zbGljZSgzNiwgNTIpICE9PSAnMDAwMDAwMDAwMDAwMDAwMCc7XG59XG5cbmZ1bmN0aW9uIGdldFRTSGVhZGVyVmFsdWUoX3JlZikge1xuICB2YXIgc2FtcGxlUmF0ZSA9IF9yZWYuc2FtcGxlUmF0ZTtcblxuICBpZiAodHlwZW9mIHNhbXBsZVJhdGUgIT09ICdudW1iZXInIHx8IFN0cmluZyhzYW1wbGVSYXRlKS5sZW5ndGggPiAyNTYpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgTkFNRVNQQUNFID0gJ2VzJztcbiAgdmFyIFNFUEFSQVRPUiA9ICc9JztcbiAgcmV0dXJuIFwiXCIgKyBOQU1FU1BBQ0UgKyBTRVBBUkFUT1IgKyBcInM6XCIgKyBzYW1wbGVSYXRlO1xufVxuXG5mdW5jdGlvbiBzZXRSZXF1ZXN0SGVhZGVyKHRhcmdldCwgbmFtZSwgdmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB0YXJnZXQuc2V0UmVxdWVzdEhlYWRlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHRhcmdldC5zZXRSZXF1ZXN0SGVhZGVyKG5hbWUsIHZhbHVlKTtcbiAgfSBlbHNlIGlmICh0YXJnZXQuaGVhZGVycyAmJiB0eXBlb2YgdGFyZ2V0LmhlYWRlcnMuYXBwZW5kID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdGFyZ2V0LmhlYWRlcnMuYXBwZW5kKG5hbWUsIHZhbHVlKTtcbiAgfSBlbHNlIHtcbiAgICB0YXJnZXRbbmFtZV0gPSB2YWx1ZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjaGVja1NhbWVPcmlnaW4oc291cmNlLCB0YXJnZXQpIHtcbiAgdmFyIGlzU2FtZSA9IGZhbHNlO1xuXG4gIGlmICh0eXBlb2YgdGFyZ2V0ID09PSAnc3RyaW5nJykge1xuICAgIGlzU2FtZSA9IHNvdXJjZSA9PT0gdGFyZ2V0O1xuICB9IGVsc2UgaWYgKHRhcmdldCAmJiB0eXBlb2YgdGFyZ2V0LnRlc3QgPT09ICdmdW5jdGlvbicpIHtcbiAgICBpc1NhbWUgPSB0YXJnZXQudGVzdChzb3VyY2UpO1xuICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkodGFyZ2V0KSkge1xuICAgIHRhcmdldC5mb3JFYWNoKGZ1bmN0aW9uICh0KSB7XG4gICAgICBpZiAoIWlzU2FtZSkge1xuICAgICAgICBpc1NhbWUgPSBjaGVja1NhbWVPcmlnaW4oc291cmNlLCB0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBpc1NhbWU7XG59XG5cbmZ1bmN0aW9uIGlzUGxhdGZvcm1TdXBwb3J0ZWQoKSB7XG4gIHJldHVybiBpc0Jyb3dzZXIgJiYgdHlwZW9mIFNldCA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgSlNPTi5zdHJpbmdpZnkgPT09ICdmdW5jdGlvbicgJiYgUEVSRiAmJiB0eXBlb2YgUEVSRi5ub3cgPT09ICdmdW5jdGlvbicgJiYgaXNDT1JTU3VwcG9ydGVkKCk7XG59XG5cbmZ1bmN0aW9uIHNldExhYmVsKGtleSwgdmFsdWUsIG9iaikge1xuICBpZiAoIW9iaiB8fCAha2V5KSByZXR1cm47XG4gIHZhciBza2V5ID0gcmVtb3ZlSW52YWxpZENoYXJzKGtleSk7XG4gIHZhciB2YWx1ZVR5cGUgPSB0eXBlb2YgdmFsdWU7XG5cbiAgaWYgKHZhbHVlICE9IHVuZGVmaW5lZCAmJiB2YWx1ZVR5cGUgIT09ICdib29sZWFuJyAmJiB2YWx1ZVR5cGUgIT09ICdudW1iZXInKSB7XG4gICAgdmFsdWUgPSBTdHJpbmcodmFsdWUpO1xuICB9XG5cbiAgb2JqW3NrZXldID0gdmFsdWU7XG4gIHJldHVybiBvYmo7XG59XG5cbmZ1bmN0aW9uIGdldFNlcnZlclRpbWluZ0luZm8oc2VydmVyVGltaW5nRW50cmllcykge1xuICBpZiAoc2VydmVyVGltaW5nRW50cmllcyA9PT0gdm9pZCAwKSB7XG4gICAgc2VydmVyVGltaW5nRW50cmllcyA9IFtdO1xuICB9XG5cbiAgdmFyIHNlcnZlclRpbWluZ0luZm8gPSBbXTtcbiAgdmFyIGVudHJ5U2VwYXJhdG9yID0gJywgJztcbiAgdmFyIHZhbHVlU2VwYXJhdG9yID0gJzsnO1xuXG4gIGZvciAodmFyIF9pMiA9IDA7IF9pMiA8IHNlcnZlclRpbWluZ0VudHJpZXMubGVuZ3RoOyBfaTIrKykge1xuICAgIHZhciBfc2VydmVyVGltaW5nRW50cmllcyQgPSBzZXJ2ZXJUaW1pbmdFbnRyaWVzW19pMl0sXG4gICAgICAgIG5hbWUgPSBfc2VydmVyVGltaW5nRW50cmllcyQubmFtZSxcbiAgICAgICAgZHVyYXRpb24gPSBfc2VydmVyVGltaW5nRW50cmllcyQuZHVyYXRpb24sXG4gICAgICAgIGRlc2NyaXB0aW9uID0gX3NlcnZlclRpbWluZ0VudHJpZXMkLmRlc2NyaXB0aW9uO1xuICAgIHZhciB0aW1pbmdWYWx1ZSA9IG5hbWU7XG5cbiAgICBpZiAoZGVzY3JpcHRpb24pIHtcbiAgICAgIHRpbWluZ1ZhbHVlICs9IHZhbHVlU2VwYXJhdG9yICsgJ2Rlc2M9JyArIGRlc2NyaXB0aW9uO1xuICAgIH1cblxuICAgIGlmIChkdXJhdGlvbikge1xuICAgICAgdGltaW5nVmFsdWUgKz0gdmFsdWVTZXBhcmF0b3IgKyAnZHVyPScgKyBkdXJhdGlvbjtcbiAgICB9XG5cbiAgICBzZXJ2ZXJUaW1pbmdJbmZvLnB1c2godGltaW5nVmFsdWUpO1xuICB9XG5cbiAgcmV0dXJuIHNlcnZlclRpbWluZ0luZm8uam9pbihlbnRyeVNlcGFyYXRvcik7XG59XG5cbmZ1bmN0aW9uIGdldFRpbWVPcmlnaW4oKSB7XG4gIHJldHVybiBQRVJGLnRpbWluZy5mZXRjaFN0YXJ0O1xufVxuXG5mdW5jdGlvbiBzdHJpcFF1ZXJ5U3RyaW5nRnJvbVVybCh1cmwpIHtcbiAgcmV0dXJuIHVybCAmJiB1cmwuc3BsaXQoJz8nKVswXTtcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9PSBudWxsICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCc7XG59XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gYmFzZUV4dGVuZChkc3QsIG9ianMsIGRlZXApIHtcbiAgZm9yICh2YXIgaSA9IDAsIGlpID0gb2Jqcy5sZW5ndGg7IGkgPCBpaTsgKytpKSB7XG4gICAgdmFyIG9iaiA9IG9ianNbaV07XG4gICAgaWYgKCFpc09iamVjdChvYmopICYmICFpc0Z1bmN0aW9uKG9iaikpIGNvbnRpbnVlO1xuICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqKTtcblxuICAgIGZvciAodmFyIGogPSAwLCBqaiA9IGtleXMubGVuZ3RoOyBqIDwgamo7IGorKykge1xuICAgICAgdmFyIGtleSA9IGtleXNbal07XG4gICAgICB2YXIgc3JjID0gb2JqW2tleV07XG5cbiAgICAgIGlmIChkZWVwICYmIGlzT2JqZWN0KHNyYykpIHtcbiAgICAgICAgaWYgKCFpc09iamVjdChkc3Rba2V5XSkpIGRzdFtrZXldID0gQXJyYXkuaXNBcnJheShzcmMpID8gW10gOiB7fTtcbiAgICAgICAgYmFzZUV4dGVuZChkc3Rba2V5XSwgW3NyY10sIGZhbHNlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRzdFtrZXldID0gc3JjO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBkc3Q7XG59XG5cbmZ1bmN0aW9uIGdldEVsYXN0aWNTY3JpcHQoKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgdmFyIHNjcmlwdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0Jyk7XG5cbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IHNjcmlwdHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICB2YXIgc2MgPSBzY3JpcHRzW2ldO1xuXG4gICAgICBpZiAoc2Muc3JjLmluZGV4T2YoJ2VsYXN0aWMnKSA+IDApIHtcbiAgICAgICAgcmV0dXJuIHNjO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRDdXJyZW50U2NyaXB0KCkge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgIHZhciBjdXJyZW50U2NyaXB0ID0gZG9jdW1lbnQuY3VycmVudFNjcmlwdDtcblxuICAgIGlmICghY3VycmVudFNjcmlwdCkge1xuICAgICAgcmV0dXJuIGdldEVsYXN0aWNTY3JpcHQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY3VycmVudFNjcmlwdDtcbiAgfVxufVxuXG5mdW5jdGlvbiBleHRlbmQoZHN0KSB7XG4gIHJldHVybiBiYXNlRXh0ZW5kKGRzdCwgc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLCBmYWxzZSk7XG59XG5cbmZ1bmN0aW9uIG1lcmdlKGRzdCkge1xuICByZXR1cm4gYmFzZUV4dGVuZChkc3QsIHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSwgdHJ1ZSk7XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKG9iaikge1xuICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ3VuZGVmaW5lZCc7XG59XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5mdW5jdGlvbiBmaW5kKGFycmF5LCBwcmVkaWNhdGUsIHRoaXNBcmcpIHtcbiAgaWYgKGFycmF5ID09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdhcnJheSBpcyBudWxsIG9yIG5vdCBkZWZpbmVkJyk7XG4gIH1cblxuICB2YXIgbyA9IE9iamVjdChhcnJheSk7XG4gIHZhciBsZW4gPSBvLmxlbmd0aCA+Pj4gMDtcblxuICBpZiAodHlwZW9mIHByZWRpY2F0ZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3ByZWRpY2F0ZSBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcbiAgfVxuXG4gIHZhciBrID0gMDtcblxuICB3aGlsZSAoayA8IGxlbikge1xuICAgIHZhciBrVmFsdWUgPSBvW2tdO1xuXG4gICAgaWYgKHByZWRpY2F0ZS5jYWxsKHRoaXNBcmcsIGtWYWx1ZSwgaywgbykpIHtcbiAgICAgIHJldHVybiBrVmFsdWU7XG4gICAgfVxuXG4gICAgaysrO1xuICB9XG5cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlSW52YWxpZENoYXJzKGtleSkge1xuICByZXR1cm4ga2V5LnJlcGxhY2UoL1suKlwiXS9nLCAnXycpO1xufVxuXG5mdW5jdGlvbiBnZXRMYXRlc3RTcGFuKHNwYW5zLCB0eXBlRmlsdGVyKSB7XG4gIHZhciBsYXRlc3RTcGFuID0gbnVsbDtcblxuICBmb3IgKHZhciBfaTMgPSAwOyBfaTMgPCBzcGFucy5sZW5ndGg7IF9pMysrKSB7XG4gICAgdmFyIHNwYW4gPSBzcGFuc1tfaTNdO1xuXG4gICAgaWYgKHR5cGVGaWx0ZXIgJiYgdHlwZUZpbHRlcihzcGFuLnR5cGUpICYmICghbGF0ZXN0U3BhbiB8fCBsYXRlc3RTcGFuLl9lbmQgPCBzcGFuLl9lbmQpKSB7XG4gICAgICBsYXRlc3RTcGFuID0gc3BhbjtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbGF0ZXN0U3Bhbjtcbn1cblxuZnVuY3Rpb24gZ2V0TGF0ZXN0Tm9uWEhSU3BhbihzcGFucykge1xuICByZXR1cm4gZ2V0TGF0ZXN0U3BhbihzcGFucywgZnVuY3Rpb24gKHR5cGUpIHtcbiAgICByZXR1cm4gU3RyaW5nKHR5cGUpLmluZGV4T2YoJ2V4dGVybmFsJykgPT09IC0xO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0TGF0ZXN0WEhSU3BhbihzcGFucykge1xuICByZXR1cm4gZ2V0TGF0ZXN0U3BhbihzcGFucywgZnVuY3Rpb24gKHR5cGUpIHtcbiAgICByZXR1cm4gU3RyaW5nKHR5cGUpLmluZGV4T2YoJ2V4dGVybmFsJykgIT09IC0xO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0RWFybGllc3RTcGFuKHNwYW5zKSB7XG4gIHZhciBlYXJsaWVzdFNwYW4gPSBzcGFuc1swXTtcblxuICBmb3IgKHZhciBfaTQgPSAxOyBfaTQgPCBzcGFucy5sZW5ndGg7IF9pNCsrKSB7XG4gICAgdmFyIHNwYW4gPSBzcGFuc1tfaTRdO1xuXG4gICAgaWYgKGVhcmxpZXN0U3Bhbi5fc3RhcnQgPiBzcGFuLl9zdGFydCkge1xuICAgICAgZWFybGllc3RTcGFuID0gc3BhbjtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZWFybGllc3RTcGFuO1xufVxuXG5mdW5jdGlvbiBub3coKSB7XG4gIHJldHVybiBQRVJGLm5vdygpO1xufVxuXG5mdW5jdGlvbiBnZXRUaW1lKHRpbWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB0aW1lID09PSAnbnVtYmVyJyAmJiB0aW1lID49IDAgPyB0aW1lIDogbm93KCk7XG59XG5cbmZ1bmN0aW9uIGdldER1cmF0aW9uKHN0YXJ0LCBlbmQpIHtcbiAgaWYgKGlzVW5kZWZpbmVkKGVuZCkgfHwgaXNVbmRlZmluZWQoc3RhcnQpKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gcGFyc2VJbnQoZW5kIC0gc3RhcnQpO1xufVxuXG5mdW5jdGlvbiBzY2hlZHVsZU1hY3JvVGFzayhjYWxsYmFjaykge1xuICBzZXRUaW1lb3V0KGNhbGxiYWNrLCAwKTtcbn1cblxuZnVuY3Rpb24gc2NoZWR1bGVNaWNyb1Rhc2soY2FsbGJhY2spIHtcbiAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbihjYWxsYmFjayk7XG59XG5cbmZ1bmN0aW9uIGlzUGVyZlRpbWVsaW5lU3VwcG9ydGVkKCkge1xuICByZXR1cm4gdHlwZW9mIFBFUkYuZ2V0RW50cmllc0J5VHlwZSA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaXNQZXJmVHlwZVN1cHBvcnRlZCh0eXBlKSB7XG4gIHJldHVybiB0eXBlb2YgUGVyZm9ybWFuY2VPYnNlcnZlciAhPT0gJ3VuZGVmaW5lZCcgJiYgUGVyZm9ybWFuY2VPYnNlcnZlci5zdXBwb3J0ZWRFbnRyeVR5cGVzICYmIFBlcmZvcm1hbmNlT2JzZXJ2ZXIuc3VwcG9ydGVkRW50cnlUeXBlcy5pbmRleE9mKHR5cGUpID49IDA7XG59XG5cbmZ1bmN0aW9uIGlzQmVhY29uSW5zcGVjdGlvbkVuYWJsZWQoKSB7XG4gIHZhciBmbGFnTmFtZSA9ICdfZWxhc3RpY19pbnNwZWN0X2JlYWNvbl8nO1xuXG4gIGlmIChzZXNzaW9uU3RvcmFnZS5nZXRJdGVtKGZsYWdOYW1lKSAhPSBudWxsKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAoIXdpbmRvdy5VUkwgfHwgIXdpbmRvdy5VUkxTZWFyY2hQYXJhbXMpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB0cnkge1xuICAgIHZhciBwYXJzZWRVcmwgPSBuZXcgVVJMKHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcbiAgICB2YXIgaXNGbGFnU2V0ID0gcGFyc2VkVXJsLnNlYXJjaFBhcmFtcy5oYXMoZmxhZ05hbWUpO1xuXG4gICAgaWYgKGlzRmxhZ1NldCkge1xuICAgICAgc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShmbGFnTmFtZSwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGlzRmxhZ1NldDtcbiAgfSBjYXRjaCAoZSkge31cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGlzUmVkaXJlY3RJbmZvQXZhaWxhYmxlKHRpbWluZykge1xuICByZXR1cm4gdGltaW5nLnJlZGlyZWN0U3RhcnQgPiAwO1xufVxuXG5leHBvcnQgeyBleHRlbmQsIG1lcmdlLCBpc1VuZGVmaW5lZCwgbm9vcCwgYmFzZUV4dGVuZCwgYnl0ZXNUb0hleCwgaXNDT1JTU3VwcG9ydGVkLCBpc09iamVjdCwgaXNGdW5jdGlvbiwgaXNQbGF0Zm9ybVN1cHBvcnRlZCwgaXNEdEhlYWRlclZhbGlkLCBwYXJzZUR0SGVhZGVyVmFsdWUsIGdldFNlcnZlclRpbWluZ0luZm8sIGdldER0SGVhZGVyVmFsdWUsIGdldFRTSGVhZGVyVmFsdWUsIGdldEN1cnJlbnRTY3JpcHQsIGdldEVsYXN0aWNTY3JpcHQsIGdldFRpbWVPcmlnaW4sIGdlbmVyYXRlUmFuZG9tSWQsIGdldEVhcmxpZXN0U3BhbiwgZ2V0TGF0ZXN0Tm9uWEhSU3BhbiwgZ2V0TGF0ZXN0WEhSU3BhbiwgZ2V0RHVyYXRpb24sIGdldFRpbWUsIG5vdywgcm5nLCBjaGVja1NhbWVPcmlnaW4sIHNjaGVkdWxlTWFjcm9UYXNrLCBzY2hlZHVsZU1pY3JvVGFzaywgc2V0TGFiZWwsIHNldFJlcXVlc3RIZWFkZXIsIHN0cmlwUXVlcnlTdHJpbmdGcm9tVXJsLCBmaW5kLCByZW1vdmVJbnZhbGlkQ2hhcnMsIFBFUkYsIGlzUGVyZlRpbWVsaW5lU3VwcG9ydGVkLCBpc0Jyb3dzZXIsIGlzUGVyZlR5cGVTdXBwb3J0ZWQsIGlzQmVhY29uSW5zcGVjdGlvbkVuYWJsZWQsIGlzUmVkaXJlY3RJbmZvQXZhaWxhYmxlIH07IiwidmFyIF9leGNsdWRlZCA9IFtcInRhZ3NcIl07XG5cbmZ1bmN0aW9uIF9vYmplY3RXaXRob3V0UHJvcGVydGllc0xvb3NlKHNvdXJjZSwgZXhjbHVkZWQpIHsgaWYgKHNvdXJjZSA9PSBudWxsKSByZXR1cm4ge307IHZhciB0YXJnZXQgPSB7fTsgdmFyIHNvdXJjZUtleXMgPSBPYmplY3Qua2V5cyhzb3VyY2UpOyB2YXIga2V5LCBpOyBmb3IgKGkgPSAwOyBpIDwgc291cmNlS2V5cy5sZW5ndGg7IGkrKykgeyBrZXkgPSBzb3VyY2VLZXlzW2ldOyBpZiAoZXhjbHVkZWQuaW5kZXhPZihrZXkpID49IDApIGNvbnRpbnVlOyB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldOyB9IHJldHVybiB0YXJnZXQ7IH1cblxuaW1wb3J0IHsgY3JlYXRlU3RhY2tUcmFjZXMsIGZpbHRlckludmFsaWRGcmFtZXMgfSBmcm9tICcuL3N0YWNrLXRyYWNlJztcbmltcG9ydCB7IGdlbmVyYXRlUmFuZG9tSWQsIG1lcmdlLCBleHRlbmQgfSBmcm9tICcuLi9jb21tb24vdXRpbHMnO1xuaW1wb3J0IHsgZ2V0UGFnZUNvbnRleHQgfSBmcm9tICcuLi9jb21tb24vY29udGV4dCc7XG5pbXBvcnQgeyB0cnVuY2F0ZU1vZGVsLCBFUlJPUl9NT0RFTCB9IGZyb20gJy4uL2NvbW1vbi90cnVuY2F0ZSc7XG5pbXBvcnQgc3RhY2tQYXJzZXIgZnJvbSAnZXJyb3Itc3RhY2stcGFyc2VyJztcbnZhciBJR05PUkVfS0VZUyA9IFsnc3RhY2snLCAnbWVzc2FnZSddO1xuXG5mdW5jdGlvbiBnZXRFcnJvclByb3BlcnRpZXMoZXJyb3IpIHtcbiAgdmFyIHByb3BlcnR5Rm91bmQgPSBmYWxzZTtcbiAgdmFyIHByb3BlcnRpZXMgPSB7fTtcbiAgT2JqZWN0LmtleXMoZXJyb3IpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgIGlmIChJR05PUkVfS0VZUy5pbmRleE9mKGtleSkgPj0gMCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciB2YWwgPSBlcnJvcltrZXldO1xuXG4gICAgaWYgKHZhbCA9PSBudWxsIHx8IHR5cGVvZiB2YWwgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIHZhbCA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGlmICh0eXBlb2YgdmFsLnRvSVNPU3RyaW5nICE9PSAnZnVuY3Rpb24nKSByZXR1cm47XG4gICAgICB2YWwgPSB2YWwudG9JU09TdHJpbmcoKTtcbiAgICB9XG5cbiAgICBwcm9wZXJ0aWVzW2tleV0gPSB2YWw7XG4gICAgcHJvcGVydHlGb3VuZCA9IHRydWU7XG4gIH0pO1xuXG4gIGlmIChwcm9wZXJ0eUZvdW5kKSB7XG4gICAgcmV0dXJuIHByb3BlcnRpZXM7XG4gIH1cbn1cblxudmFyIEVycm9yTG9nZ2luZyA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gRXJyb3JMb2dnaW5nKGFwbVNlcnZlciwgY29uZmlnU2VydmljZSwgdHJhbnNhY3Rpb25TZXJ2aWNlKSB7XG4gICAgdGhpcy5fYXBtU2VydmVyID0gYXBtU2VydmVyO1xuICAgIHRoaXMuX2NvbmZpZ1NlcnZpY2UgPSBjb25maWdTZXJ2aWNlO1xuICAgIHRoaXMuX3RyYW5zYWN0aW9uU2VydmljZSA9IHRyYW5zYWN0aW9uU2VydmljZTtcbiAgfVxuXG4gIHZhciBfcHJvdG8gPSBFcnJvckxvZ2dpbmcucHJvdG90eXBlO1xuXG4gIF9wcm90by5jcmVhdGVFcnJvckRhdGFNb2RlbCA9IGZ1bmN0aW9uIGNyZWF0ZUVycm9yRGF0YU1vZGVsKGVycm9yRXZlbnQpIHtcbiAgICB2YXIgZnJhbWVzID0gY3JlYXRlU3RhY2tUcmFjZXMoc3RhY2tQYXJzZXIsIGVycm9yRXZlbnQpO1xuICAgIHZhciBmaWx0ZXJlZEZyYW1lcyA9IGZpbHRlckludmFsaWRGcmFtZXMoZnJhbWVzKTtcbiAgICB2YXIgY3VscHJpdCA9ICcoaW5saW5lIHNjcmlwdCknO1xuICAgIHZhciBsYXN0RnJhbWUgPSBmaWx0ZXJlZEZyYW1lc1tmaWx0ZXJlZEZyYW1lcy5sZW5ndGggLSAxXTtcblxuICAgIGlmIChsYXN0RnJhbWUgJiYgbGFzdEZyYW1lLmZpbGVuYW1lKSB7XG4gICAgICBjdWxwcml0ID0gbGFzdEZyYW1lLmZpbGVuYW1lO1xuICAgIH1cblxuICAgIHZhciBtZXNzYWdlID0gZXJyb3JFdmVudC5tZXNzYWdlLFxuICAgICAgICBlcnJvciA9IGVycm9yRXZlbnQuZXJyb3I7XG4gICAgdmFyIGVycm9yTWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgdmFyIGVycm9yVHlwZSA9ICcnO1xuICAgIHZhciBlcnJvckNvbnRleHQgPSB7fTtcblxuICAgIGlmIChlcnJvciAmJiB0eXBlb2YgZXJyb3IgPT09ICdvYmplY3QnKSB7XG4gICAgICBlcnJvck1lc3NhZ2UgPSBlcnJvck1lc3NhZ2UgfHwgZXJyb3IubWVzc2FnZTtcbiAgICAgIGVycm9yVHlwZSA9IGVycm9yLm5hbWU7XG4gICAgICB2YXIgY3VzdG9tUHJvcGVydGllcyA9IGdldEVycm9yUHJvcGVydGllcyhlcnJvcik7XG5cbiAgICAgIGlmIChjdXN0b21Qcm9wZXJ0aWVzKSB7XG4gICAgICAgIGVycm9yQ29udGV4dC5jdXN0b20gPSBjdXN0b21Qcm9wZXJ0aWVzO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghZXJyb3JUeXBlKSB7XG4gICAgICBpZiAoZXJyb3JNZXNzYWdlICYmIGVycm9yTWVzc2FnZS5pbmRleE9mKCc6JykgPiAtMSkge1xuICAgICAgICBlcnJvclR5cGUgPSBlcnJvck1lc3NhZ2Uuc3BsaXQoJzonKVswXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgY3VycmVudFRyYW5zYWN0aW9uID0gdGhpcy5fdHJhbnNhY3Rpb25TZXJ2aWNlLmdldEN1cnJlbnRUcmFuc2FjdGlvbigpO1xuXG4gICAgdmFyIHRyYW5zYWN0aW9uQ29udGV4dCA9IGN1cnJlbnRUcmFuc2FjdGlvbiA/IGN1cnJlbnRUcmFuc2FjdGlvbi5jb250ZXh0IDoge307XG5cbiAgICB2YXIgX3RoaXMkX2NvbmZpZ1NlcnZpY2UkID0gdGhpcy5fY29uZmlnU2VydmljZS5nZXQoJ2NvbnRleHQnKSxcbiAgICAgICAgdGFncyA9IF90aGlzJF9jb25maWdTZXJ2aWNlJC50YWdzLFxuICAgICAgICBjb25maWdDb250ZXh0ID0gX29iamVjdFdpdGhvdXRQcm9wZXJ0aWVzTG9vc2UoX3RoaXMkX2NvbmZpZ1NlcnZpY2UkLCBfZXhjbHVkZWQpO1xuXG4gICAgdmFyIHBhZ2VDb250ZXh0ID0gZ2V0UGFnZUNvbnRleHQoKTtcbiAgICB2YXIgY29udGV4dCA9IG1lcmdlKHt9LCBwYWdlQ29udGV4dCwgdHJhbnNhY3Rpb25Db250ZXh0LCBjb25maWdDb250ZXh0LCBlcnJvckNvbnRleHQpO1xuICAgIHZhciBlcnJvck9iamVjdCA9IHtcbiAgICAgIGlkOiBnZW5lcmF0ZVJhbmRvbUlkKCksXG4gICAgICBjdWxwcml0OiBjdWxwcml0LFxuICAgICAgZXhjZXB0aW9uOiB7XG4gICAgICAgIG1lc3NhZ2U6IGVycm9yTWVzc2FnZSxcbiAgICAgICAgc3RhY2t0cmFjZTogZmlsdGVyZWRGcmFtZXMsXG4gICAgICAgIHR5cGU6IGVycm9yVHlwZVxuICAgICAgfSxcbiAgICAgIGNvbnRleHQ6IGNvbnRleHRcbiAgICB9O1xuXG4gICAgaWYgKGN1cnJlbnRUcmFuc2FjdGlvbikge1xuICAgICAgZXJyb3JPYmplY3QgPSBleHRlbmQoZXJyb3JPYmplY3QsIHtcbiAgICAgICAgdHJhY2VfaWQ6IGN1cnJlbnRUcmFuc2FjdGlvbi50cmFjZUlkLFxuICAgICAgICBwYXJlbnRfaWQ6IGN1cnJlbnRUcmFuc2FjdGlvbi5pZCxcbiAgICAgICAgdHJhbnNhY3Rpb25faWQ6IGN1cnJlbnRUcmFuc2FjdGlvbi5pZCxcbiAgICAgICAgdHJhbnNhY3Rpb246IHtcbiAgICAgICAgICB0eXBlOiBjdXJyZW50VHJhbnNhY3Rpb24udHlwZSxcbiAgICAgICAgICBzYW1wbGVkOiBjdXJyZW50VHJhbnNhY3Rpb24uc2FtcGxlZFxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1bmNhdGVNb2RlbChFUlJPUl9NT0RFTCwgZXJyb3JPYmplY3QpO1xuICB9O1xuXG4gIF9wcm90by5sb2dFcnJvckV2ZW50ID0gZnVuY3Rpb24gbG9nRXJyb3JFdmVudChlcnJvckV2ZW50KSB7XG4gICAgaWYgKHR5cGVvZiBlcnJvckV2ZW50ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBlcnJvck9iamVjdCA9IHRoaXMuY3JlYXRlRXJyb3JEYXRhTW9kZWwoZXJyb3JFdmVudCk7XG5cbiAgICBpZiAodHlwZW9mIGVycm9yT2JqZWN0LmV4Y2VwdGlvbi5tZXNzYWdlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX2FwbVNlcnZlci5hZGRFcnJvcihlcnJvck9iamVjdCk7XG4gIH07XG5cbiAgX3Byb3RvLnJlZ2lzdGVyTGlzdGVuZXJzID0gZnVuY3Rpb24gcmVnaXN0ZXJMaXN0ZW5lcnMoKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdlcnJvcicsIGZ1bmN0aW9uIChlcnJvckV2ZW50KSB7XG4gICAgICByZXR1cm4gX3RoaXMubG9nRXJyb3JFdmVudChlcnJvckV2ZW50KTtcbiAgICB9KTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigndW5oYW5kbGVkcmVqZWN0aW9uJywgZnVuY3Rpb24gKHByb21pc2VSZWplY3Rpb25FdmVudCkge1xuICAgICAgcmV0dXJuIF90aGlzLmxvZ1Byb21pc2VFdmVudChwcm9taXNlUmVqZWN0aW9uRXZlbnQpO1xuICAgIH0pO1xuICB9O1xuXG4gIF9wcm90by5sb2dQcm9taXNlRXZlbnQgPSBmdW5jdGlvbiBsb2dQcm9taXNlRXZlbnQocHJvbWlzZVJlamVjdGlvbkV2ZW50KSB7XG4gICAgdmFyIHByZWZpeCA9ICdVbmhhbmRsZWQgcHJvbWlzZSByZWplY3Rpb246ICc7XG4gICAgdmFyIHJlYXNvbiA9IHByb21pc2VSZWplY3Rpb25FdmVudC5yZWFzb247XG5cbiAgICBpZiAocmVhc29uID09IG51bGwpIHtcbiAgICAgIHJlYXNvbiA9ICc8bm8gcmVhc29uIHNwZWNpZmllZD4nO1xuICAgIH1cblxuICAgIHZhciBlcnJvckV2ZW50O1xuXG4gICAgaWYgKHR5cGVvZiByZWFzb24ubWVzc2FnZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHZhciBuYW1lID0gcmVhc29uLm5hbWUgPyByZWFzb24ubmFtZSArICc6ICcgOiAnJztcbiAgICAgIGVycm9yRXZlbnQgPSB7XG4gICAgICAgIGVycm9yOiByZWFzb24sXG4gICAgICAgIG1lc3NhZ2U6IHByZWZpeCArIG5hbWUgKyByZWFzb24ubWVzc2FnZVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVhc29uID0gdHlwZW9mIHJlYXNvbiA9PT0gJ29iamVjdCcgPyAnPG9iamVjdD4nIDogdHlwZW9mIHJlYXNvbiA9PT0gJ2Z1bmN0aW9uJyA/ICc8ZnVuY3Rpb24+JyA6IHJlYXNvbjtcbiAgICAgIGVycm9yRXZlbnQgPSB7XG4gICAgICAgIG1lc3NhZ2U6IHByZWZpeCArIHJlYXNvblxuICAgICAgfTtcbiAgICB9XG5cbiAgICB0aGlzLmxvZ0Vycm9yRXZlbnQoZXJyb3JFdmVudCk7XG4gIH07XG5cbiAgX3Byb3RvLmxvZ0Vycm9yID0gZnVuY3Rpb24gbG9nRXJyb3IobWVzc2FnZU9yRXJyb3IpIHtcbiAgICB2YXIgZXJyb3JFdmVudCA9IHt9O1xuXG4gICAgaWYgKHR5cGVvZiBtZXNzYWdlT3JFcnJvciA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGVycm9yRXZlbnQubWVzc2FnZSA9IG1lc3NhZ2VPckVycm9yO1xuICAgIH0gZWxzZSB7XG4gICAgICBlcnJvckV2ZW50LmVycm9yID0gbWVzc2FnZU9yRXJyb3I7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMubG9nRXJyb3JFdmVudChlcnJvckV2ZW50KTtcbiAgfTtcblxuICByZXR1cm4gRXJyb3JMb2dnaW5nO1xufSgpO1xuXG5leHBvcnQgZGVmYXVsdCBFcnJvckxvZ2dpbmc7IiwiaW1wb3J0IEVycm9yTG9nZ2luZyBmcm9tICcuL2Vycm9yLWxvZ2dpbmcnO1xuaW1wb3J0IHsgQ09ORklHX1NFUlZJQ0UsIFRSQU5TQUNUSU9OX1NFUlZJQ0UsIEVSUk9SX0xPR0dJTkcsIEFQTV9TRVJWRVIgfSBmcm9tICcuLi9jb21tb24vY29uc3RhbnRzJztcbmltcG9ydCB7IHNlcnZpY2VDcmVhdG9ycyB9IGZyb20gJy4uL2NvbW1vbi9zZXJ2aWNlLWZhY3RvcnknO1xuXG5mdW5jdGlvbiByZWdpc3RlclNlcnZpY2VzKCkge1xuICBzZXJ2aWNlQ3JlYXRvcnNbRVJST1JfTE9HR0lOR10gPSBmdW5jdGlvbiAoc2VydmljZUZhY3RvcnkpIHtcbiAgICB2YXIgX3NlcnZpY2VGYWN0b3J5JGdldFNlID0gc2VydmljZUZhY3RvcnkuZ2V0U2VydmljZShbQVBNX1NFUlZFUiwgQ09ORklHX1NFUlZJQ0UsIFRSQU5TQUNUSU9OX1NFUlZJQ0VdKSxcbiAgICAgICAgYXBtU2VydmVyID0gX3NlcnZpY2VGYWN0b3J5JGdldFNlWzBdLFxuICAgICAgICBjb25maWdTZXJ2aWNlID0gX3NlcnZpY2VGYWN0b3J5JGdldFNlWzFdLFxuICAgICAgICB0cmFuc2FjdGlvblNlcnZpY2UgPSBfc2VydmljZUZhY3RvcnkkZ2V0U2VbMl07XG5cbiAgICByZXR1cm4gbmV3IEVycm9yTG9nZ2luZyhhcG1TZXJ2ZXIsIGNvbmZpZ1NlcnZpY2UsIHRyYW5zYWN0aW9uU2VydmljZSk7XG4gIH07XG59XG5cbmV4cG9ydCB7IHJlZ2lzdGVyU2VydmljZXMgfTsiLCJmdW5jdGlvbiBmaWxlUGF0aFRvRmlsZU5hbWUoZmlsZVVybCkge1xuICB2YXIgb3JpZ2luID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbiB8fCB3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgKyAnLy8nICsgd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lICsgKHdpbmRvdy5sb2NhdGlvbi5wb3J0ID8gJzonICsgd2luZG93LmxvY2F0aW9uLnBvcnQgOiAnJyk7XG5cbiAgaWYgKGZpbGVVcmwuaW5kZXhPZihvcmlnaW4pID4gLTEpIHtcbiAgICBmaWxlVXJsID0gZmlsZVVybC5yZXBsYWNlKG9yaWdpbiArICcvJywgJycpO1xuICB9XG5cbiAgcmV0dXJuIGZpbGVVcmw7XG59XG5cbmZ1bmN0aW9uIGNsZWFuRmlsZVBhdGgoZmlsZVBhdGgpIHtcbiAgaWYgKGZpbGVQYXRoID09PSB2b2lkIDApIHtcbiAgICBmaWxlUGF0aCA9ICcnO1xuICB9XG5cbiAgaWYgKGZpbGVQYXRoID09PSAnPGFub255bW91cz4nKSB7XG4gICAgZmlsZVBhdGggPSAnJztcbiAgfVxuXG4gIHJldHVybiBmaWxlUGF0aDtcbn1cblxuZnVuY3Rpb24gaXNGaWxlSW5saW5lKGZpbGVVcmwpIHtcbiAgaWYgKGZpbGVVcmwpIHtcbiAgICByZXR1cm4gd2luZG93LmxvY2F0aW9uLmhyZWYuaW5kZXhPZihmaWxlVXJsKSA9PT0gMDtcbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplU3RhY2tGcmFtZXMoc3RhY2tGcmFtZXMpIHtcbiAgcmV0dXJuIHN0YWNrRnJhbWVzLm1hcChmdW5jdGlvbiAoZnJhbWUpIHtcbiAgICBpZiAoZnJhbWUuZnVuY3Rpb25OYW1lKSB7XG4gICAgICBmcmFtZS5mdW5jdGlvbk5hbWUgPSBub3JtYWxpemVGdW5jdGlvbk5hbWUoZnJhbWUuZnVuY3Rpb25OYW1lKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnJhbWU7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBub3JtYWxpemVGdW5jdGlvbk5hbWUoZm5OYW1lKSB7XG4gIHZhciBwYXJ0cyA9IGZuTmFtZS5zcGxpdCgnLycpO1xuXG4gIGlmIChwYXJ0cy5sZW5ndGggPiAxKSB7XG4gICAgZm5OYW1lID0gWydPYmplY3QnLCBwYXJ0c1twYXJ0cy5sZW5ndGggLSAxXV0uam9pbignLicpO1xuICB9IGVsc2Uge1xuICAgIGZuTmFtZSA9IHBhcnRzWzBdO1xuICB9XG5cbiAgZm5OYW1lID0gZm5OYW1lLnJlcGxhY2UoLy48JC9naSwgJy48YW5vbnltb3VzPicpO1xuICBmbk5hbWUgPSBmbk5hbWUucmVwbGFjZSgvXkFub255bW91cyBmdW5jdGlvbiQvLCAnPGFub255bW91cz4nKTtcbiAgcGFydHMgPSBmbk5hbWUuc3BsaXQoJy4nKTtcblxuICBpZiAocGFydHMubGVuZ3RoID4gMSkge1xuICAgIGZuTmFtZSA9IHBhcnRzW3BhcnRzLmxlbmd0aCAtIDFdO1xuICB9IGVsc2Uge1xuICAgIGZuTmFtZSA9IHBhcnRzWzBdO1xuICB9XG5cbiAgcmV0dXJuIGZuTmFtZTtcbn1cblxuZnVuY3Rpb24gaXNWYWxpZFN0YWNrVHJhY2Uoc3RhY2tUcmFjZXMpIHtcbiAgaWYgKHN0YWNrVHJhY2VzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChzdGFja1RyYWNlcy5sZW5ndGggPT09IDEpIHtcbiAgICB2YXIgc3RhY2tUcmFjZSA9IHN0YWNrVHJhY2VzWzBdO1xuICAgIHJldHVybiAnbGluZU51bWJlcicgaW4gc3RhY2tUcmFjZTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlU3RhY2tUcmFjZXMoc3RhY2tQYXJzZXIsIGVycm9yRXZlbnQpIHtcbiAgdmFyIGVycm9yID0gZXJyb3JFdmVudC5lcnJvcixcbiAgICAgIGZpbGVuYW1lID0gZXJyb3JFdmVudC5maWxlbmFtZSxcbiAgICAgIGxpbmVubyA9IGVycm9yRXZlbnQubGluZW5vLFxuICAgICAgY29sbm8gPSBlcnJvckV2ZW50LmNvbG5vO1xuICB2YXIgc3RhY2tUcmFjZXMgPSBbXTtcblxuICBpZiAoZXJyb3IpIHtcbiAgICB0cnkge1xuICAgICAgc3RhY2tUcmFjZXMgPSBzdGFja1BhcnNlci5wYXJzZShlcnJvcik7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgfVxuXG4gIGlmICghaXNWYWxpZFN0YWNrVHJhY2Uoc3RhY2tUcmFjZXMpKSB7XG4gICAgc3RhY2tUcmFjZXMgPSBbe1xuICAgICAgZmlsZU5hbWU6IGZpbGVuYW1lLFxuICAgICAgbGluZU51bWJlcjogbGluZW5vLFxuICAgICAgY29sdW1uTnVtYmVyOiBjb2xub1xuICAgIH1dO1xuICB9XG5cbiAgdmFyIG5vcm1hbGl6ZWRTdGFja1RyYWNlcyA9IG5vcm1hbGl6ZVN0YWNrRnJhbWVzKHN0YWNrVHJhY2VzKTtcbiAgcmV0dXJuIG5vcm1hbGl6ZWRTdGFja1RyYWNlcy5tYXAoZnVuY3Rpb24gKHN0YWNrKSB7XG4gICAgdmFyIGZpbGVOYW1lID0gc3RhY2suZmlsZU5hbWUsXG4gICAgICAgIGxpbmVOdW1iZXIgPSBzdGFjay5saW5lTnVtYmVyLFxuICAgICAgICBjb2x1bW5OdW1iZXIgPSBzdGFjay5jb2x1bW5OdW1iZXIsXG4gICAgICAgIF9zdGFjayRmdW5jdGlvbk5hbWUgPSBzdGFjay5mdW5jdGlvbk5hbWUsXG4gICAgICAgIGZ1bmN0aW9uTmFtZSA9IF9zdGFjayRmdW5jdGlvbk5hbWUgPT09IHZvaWQgMCA/ICc8YW5vbnltb3VzPicgOiBfc3RhY2skZnVuY3Rpb25OYW1lO1xuXG4gICAgaWYgKCFmaWxlTmFtZSAmJiAhbGluZU51bWJlcikge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cblxuICAgIGlmICghY29sdW1uTnVtYmVyICYmICFsaW5lTnVtYmVyKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuXG4gICAgdmFyIGZpbGVQYXRoID0gY2xlYW5GaWxlUGF0aChmaWxlTmFtZSk7XG4gICAgdmFyIGNsZWFuZWRGaWxlTmFtZSA9IGZpbGVQYXRoVG9GaWxlTmFtZShmaWxlUGF0aCk7XG5cbiAgICBpZiAoaXNGaWxlSW5saW5lKGZpbGVQYXRoKSkge1xuICAgICAgY2xlYW5lZEZpbGVOYW1lID0gJyhpbmxpbmUgc2NyaXB0KSc7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIGFic19wYXRoOiBmaWxlTmFtZSxcbiAgICAgIGZpbGVuYW1lOiBjbGVhbmVkRmlsZU5hbWUsXG4gICAgICBmdW5jdGlvbjogZnVuY3Rpb25OYW1lLFxuICAgICAgbGluZW5vOiBsaW5lTnVtYmVyLFxuICAgICAgY29sbm86IGNvbHVtbk51bWJlclxuICAgIH07XG4gIH0pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGZpbHRlckludmFsaWRGcmFtZXMoZnJhbWVzKSB7XG4gIHJldHVybiBmcmFtZXMuZmlsdGVyKGZ1bmN0aW9uIChfcmVmKSB7XG4gICAgdmFyIGZpbGVuYW1lID0gX3JlZi5maWxlbmFtZSxcbiAgICAgICAgbGluZW5vID0gX3JlZi5saW5lbm87XG4gICAgcmV0dXJuIHR5cGVvZiBmaWxlbmFtZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGxpbmVubyAhPT0gJ3VuZGVmaW5lZCc7XG4gIH0pO1xufSIsImltcG9ydCB7IHJlZ2lzdGVyU2VydmljZXMgYXMgcmVnaXN0ZXJFcnJvclNlcnZpY2VzIH0gZnJvbSAnLi9lcnJvci1sb2dnaW5nJztcbmltcG9ydCB7IHJlZ2lzdGVyU2VydmljZXMgYXMgcmVnaXN0ZXJQZXJmU2VydmljZXMgfSBmcm9tICcuL3BlcmZvcm1hbmNlLW1vbml0b3JpbmcnO1xuaW1wb3J0IHsgU2VydmljZUZhY3RvcnkgfSBmcm9tICcuL2NvbW1vbi9zZXJ2aWNlLWZhY3RvcnknO1xuaW1wb3J0IHsgaXNQbGF0Zm9ybVN1cHBvcnRlZCwgc2NoZWR1bGVNaWNyb1Rhc2ssIHNjaGVkdWxlTWFjcm9UYXNrLCBpc0Jyb3dzZXIgfSBmcm9tICcuL2NvbW1vbi91dGlscyc7XG5pbXBvcnQgeyBwYXRjaEFsbCwgcGF0Y2hFdmVudEhhbmRsZXIgfSBmcm9tICcuL2NvbW1vbi9wYXRjaGluZyc7XG5pbXBvcnQgeyBvYnNlcnZlUGFnZVZpc2liaWxpdHksIG9ic2VydmVQYWdlQ2xpY2tzIH0gZnJvbSAnLi9jb21tb24vb2JzZXJ2ZXJzJztcbmltcG9ydCB7IFBBR0VfTE9BRF9ERUxBWSwgUEFHRV9MT0FELCBFUlJPUiwgQ09ORklHX1NFUlZJQ0UsIExPR0dJTkdfU0VSVklDRSwgVFJBTlNBQ1RJT05fU0VSVklDRSwgQVBNX1NFUlZFUiwgUEVSRk9STUFOQ0VfTU9OSVRPUklORywgRVJST1JfTE9HR0lORywgRVZFTlRfVEFSR0VULCBDTElDSyB9IGZyb20gJy4vY29tbW9uL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBnZXRJbnN0cnVtZW50YXRpb25GbGFncyB9IGZyb20gJy4vY29tbW9uL2luc3RydW1lbnQnO1xuaW1wb3J0IGFmdGVyRnJhbWUgZnJvbSAnLi9jb21tb24vYWZ0ZXItZnJhbWUnO1xuaW1wb3J0IHsgYm9vdHN0cmFwIH0gZnJvbSAnLi9ib290c3RyYXAnO1xuaW1wb3J0IHsgY3JlYXRlVHJhY2VyIH0gZnJvbSAnLi9vcGVudHJhY2luZyc7XG5cbmZ1bmN0aW9uIGNyZWF0ZVNlcnZpY2VGYWN0b3J5KCkge1xuICByZWdpc3RlclBlcmZTZXJ2aWNlcygpO1xuICByZWdpc3RlckVycm9yU2VydmljZXMoKTtcbiAgdmFyIHNlcnZpY2VGYWN0b3J5ID0gbmV3IFNlcnZpY2VGYWN0b3J5KCk7XG4gIHJldHVybiBzZXJ2aWNlRmFjdG9yeTtcbn1cblxuZXhwb3J0IHsgY3JlYXRlU2VydmljZUZhY3RvcnksIFNlcnZpY2VGYWN0b3J5LCBwYXRjaEFsbCwgcGF0Y2hFdmVudEhhbmRsZXIsIGlzUGxhdGZvcm1TdXBwb3J0ZWQsIGlzQnJvd3NlciwgZ2V0SW5zdHJ1bWVudGF0aW9uRmxhZ3MsIGNyZWF0ZVRyYWNlciwgc2NoZWR1bGVNaWNyb1Rhc2ssIHNjaGVkdWxlTWFjcm9UYXNrLCBhZnRlckZyYW1lLCBFUlJPUiwgUEFHRV9MT0FEX0RFTEFZLCBQQUdFX0xPQUQsIENPTkZJR19TRVJWSUNFLCBMT0dHSU5HX1NFUlZJQ0UsIFRSQU5TQUNUSU9OX1NFUlZJQ0UsIEFQTV9TRVJWRVIsIFBFUkZPUk1BTkNFX01PTklUT1JJTkcsIEVSUk9SX0xPR0dJTkcsIEVWRU5UX1RBUkdFVCwgQ0xJQ0ssIGJvb3RzdHJhcCwgb2JzZXJ2ZVBhZ2VWaXNpYmlsaXR5LCBvYnNlcnZlUGFnZUNsaWNrcyB9OyIsImltcG9ydCBUcmFjZXIgZnJvbSAnLi90cmFjZXInO1xuaW1wb3J0IFNwYW4gZnJvbSAnLi9zcGFuJztcbmltcG9ydCB7IFRSQU5TQUNUSU9OX1NFUlZJQ0UsIExPR0dJTkdfU0VSVklDRSwgUEVSRk9STUFOQ0VfTU9OSVRPUklORywgRVJST1JfTE9HR0lORyB9IGZyb20gJy4uL2NvbW1vbi9jb25zdGFudHMnO1xuXG5mdW5jdGlvbiBjcmVhdGVUcmFjZXIoc2VydmljZUZhY3RvcnkpIHtcbiAgdmFyIHBlcmZvcm1hbmNlTW9uaXRvcmluZyA9IHNlcnZpY2VGYWN0b3J5LmdldFNlcnZpY2UoUEVSRk9STUFOQ0VfTU9OSVRPUklORyk7XG4gIHZhciB0cmFuc2FjdGlvblNlcnZpY2UgPSBzZXJ2aWNlRmFjdG9yeS5nZXRTZXJ2aWNlKFRSQU5TQUNUSU9OX1NFUlZJQ0UpO1xuICB2YXIgZXJyb3JMb2dnaW5nID0gc2VydmljZUZhY3RvcnkuZ2V0U2VydmljZShFUlJPUl9MT0dHSU5HKTtcbiAgdmFyIGxvZ2dpbmdTZXJ2aWNlID0gc2VydmljZUZhY3RvcnkuZ2V0U2VydmljZShMT0dHSU5HX1NFUlZJQ0UpO1xuICByZXR1cm4gbmV3IFRyYWNlcihwZXJmb3JtYW5jZU1vbml0b3JpbmcsIHRyYW5zYWN0aW9uU2VydmljZSwgbG9nZ2luZ1NlcnZpY2UsIGVycm9yTG9nZ2luZyk7XG59XG5cbmV4cG9ydCB7IFNwYW4sIFRyYWNlciwgY3JlYXRlVHJhY2VyIH07IiwiZnVuY3Rpb24gX2luaGVyaXRzTG9vc2Uoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzLnByb3RvdHlwZSk7IHN1YkNsYXNzLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IHN1YkNsYXNzOyBfc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpOyB9XG5cbmZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IF9zZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBvLl9fcHJvdG9fXyA9IHA7IHJldHVybiBvOyB9OyByZXR1cm4gX3NldFByb3RvdHlwZU9mKG8sIHApOyB9XG5cbmltcG9ydCB7IFNwYW4gYXMgb3RTcGFuIH0gZnJvbSAnb3BlbnRyYWNpbmcvbGliL3NwYW4nO1xuaW1wb3J0IHsgZXh0ZW5kLCBnZXRUaW1lT3JpZ2luIH0gZnJvbSAnLi4vY29tbW9uL3V0aWxzJztcbmltcG9ydCBUcmFuc2FjdGlvbiBmcm9tICcuLi9wZXJmb3JtYW5jZS1tb25pdG9yaW5nL3RyYW5zYWN0aW9uJztcblxudmFyIFNwYW4gPSBmdW5jdGlvbiAoX290U3Bhbikge1xuICBfaW5oZXJpdHNMb29zZShTcGFuLCBfb3RTcGFuKTtcblxuICBmdW5jdGlvbiBTcGFuKHRyYWNlciwgc3Bhbikge1xuICAgIHZhciBfdGhpcztcblxuICAgIF90aGlzID0gX290U3Bhbi5jYWxsKHRoaXMpIHx8IHRoaXM7XG4gICAgX3RoaXMuX190cmFjZXIgPSB0cmFjZXI7XG4gICAgX3RoaXMuc3BhbiA9IHNwYW47XG4gICAgX3RoaXMuaXNUcmFuc2FjdGlvbiA9IHNwYW4gaW5zdGFuY2VvZiBUcmFuc2FjdGlvbjtcbiAgICBfdGhpcy5zcGFuQ29udGV4dCA9IHtcbiAgICAgIGlkOiBzcGFuLmlkLFxuICAgICAgdHJhY2VJZDogc3Bhbi50cmFjZUlkLFxuICAgICAgc2FtcGxlZDogc3Bhbi5zYW1wbGVkXG4gICAgfTtcbiAgICByZXR1cm4gX3RoaXM7XG4gIH1cblxuICB2YXIgX3Byb3RvID0gU3Bhbi5wcm90b3R5cGU7XG5cbiAgX3Byb3RvLl9jb250ZXh0ID0gZnVuY3Rpb24gX2NvbnRleHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3BhbkNvbnRleHQ7XG4gIH07XG5cbiAgX3Byb3RvLl90cmFjZXIgPSBmdW5jdGlvbiBfdHJhY2VyKCkge1xuICAgIHJldHVybiB0aGlzLl9fdHJhY2VyO1xuICB9O1xuXG4gIF9wcm90by5fc2V0T3BlcmF0aW9uTmFtZSA9IGZ1bmN0aW9uIF9zZXRPcGVyYXRpb25OYW1lKG5hbWUpIHtcbiAgICB0aGlzLnNwYW4ubmFtZSA9IG5hbWU7XG4gIH07XG5cbiAgX3Byb3RvLl9hZGRUYWdzID0gZnVuY3Rpb24gX2FkZFRhZ3Moa2V5VmFsdWVQYWlycykge1xuICAgIHZhciB0YWdzID0gZXh0ZW5kKHt9LCBrZXlWYWx1ZVBhaXJzKTtcblxuICAgIGlmICh0YWdzLnR5cGUpIHtcbiAgICAgIHRoaXMuc3Bhbi50eXBlID0gdGFncy50eXBlO1xuICAgICAgZGVsZXRlIHRhZ3MudHlwZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5pc1RyYW5zYWN0aW9uKSB7XG4gICAgICB2YXIgdXNlcklkID0gdGFnc1sndXNlci5pZCddO1xuICAgICAgdmFyIHVzZXJuYW1lID0gdGFnc1sndXNlci51c2VybmFtZSddO1xuICAgICAgdmFyIGVtYWlsID0gdGFnc1sndXNlci5lbWFpbCddO1xuXG4gICAgICBpZiAodXNlcklkIHx8IHVzZXJuYW1lIHx8IGVtYWlsKSB7XG4gICAgICAgIHRoaXMuc3Bhbi5hZGRDb250ZXh0KHtcbiAgICAgICAgICB1c2VyOiB7XG4gICAgICAgICAgICBpZDogdXNlcklkLFxuICAgICAgICAgICAgdXNlcm5hbWU6IHVzZXJuYW1lLFxuICAgICAgICAgICAgZW1haWw6IGVtYWlsXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZGVsZXRlIHRhZ3NbJ3VzZXIuaWQnXTtcbiAgICAgICAgZGVsZXRlIHRhZ3NbJ3VzZXIudXNlcm5hbWUnXTtcbiAgICAgICAgZGVsZXRlIHRhZ3NbJ3VzZXIuZW1haWwnXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLnNwYW4uYWRkTGFiZWxzKHRhZ3MpO1xuICB9O1xuXG4gIF9wcm90by5fbG9nID0gZnVuY3Rpb24gX2xvZyhsb2csIHRpbWVzdGFtcCkge1xuICAgIGlmIChsb2cuZXZlbnQgPT09ICdlcnJvcicpIHtcbiAgICAgIGlmIChsb2dbJ2Vycm9yLm9iamVjdCddKSB7XG4gICAgICAgIHRoaXMuX190cmFjZXIuZXJyb3JMb2dnaW5nLmxvZ0Vycm9yKGxvZ1snZXJyb3Iub2JqZWN0J10pO1xuICAgICAgfSBlbHNlIGlmIChsb2cubWVzc2FnZSkge1xuICAgICAgICB0aGlzLl9fdHJhY2VyLmVycm9yTG9nZ2luZy5sb2dFcnJvcihsb2cubWVzc2FnZSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIF9wcm90by5fZmluaXNoID0gZnVuY3Rpb24gX2ZpbmlzaChmaW5pc2hUaW1lKSB7XG4gICAgdGhpcy5zcGFuLmVuZCgpO1xuXG4gICAgaWYgKGZpbmlzaFRpbWUpIHtcbiAgICAgIHRoaXMuc3Bhbi5fZW5kID0gZmluaXNoVGltZSAtIGdldFRpbWVPcmlnaW4oKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIFNwYW47XG59KG90U3Bhbik7XG5cbmV4cG9ydCBkZWZhdWx0IFNwYW47IiwiZnVuY3Rpb24gX2luaGVyaXRzTG9vc2Uoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzLnByb3RvdHlwZSk7IHN1YkNsYXNzLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IHN1YkNsYXNzOyBfc2V0UHJvdG90eXBlT2Yoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpOyB9XG5cbmZ1bmN0aW9uIF9zZXRQcm90b3R5cGVPZihvLCBwKSB7IF9zZXRQcm90b3R5cGVPZiA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBvLl9fcHJvdG9fXyA9IHA7IHJldHVybiBvOyB9OyByZXR1cm4gX3NldFByb3RvdHlwZU9mKG8sIHApOyB9XG5cbmltcG9ydCB7IFRyYWNlciBhcyBvdFRyYWNlciB9IGZyb20gJ29wZW50cmFjaW5nL2xpYi90cmFjZXInO1xuaW1wb3J0IHsgUkVGRVJFTkNFX0NISUxEX09GLCBGT1JNQVRfVEVYVF9NQVAsIEZPUk1BVF9IVFRQX0hFQURFUlMsIEZPUk1BVF9CSU5BUlkgfSBmcm9tICdvcGVudHJhY2luZy9saWIvY29uc3RhbnRzJztcbmltcG9ydCB7IFNwYW4gYXMgTm9vcFNwYW4gfSBmcm9tICdvcGVudHJhY2luZy9saWIvc3Bhbic7XG5pbXBvcnQgeyBnZXRUaW1lT3JpZ2luLCBmaW5kIH0gZnJvbSAnLi4vY29tbW9uL3V0aWxzJztcbmltcG9ydCB7IF9fREVWX18gfSBmcm9tICcuLi9zdGF0ZSc7XG5pbXBvcnQgU3BhbiBmcm9tICcuL3NwYW4nO1xuXG52YXIgVHJhY2VyID0gZnVuY3Rpb24gKF9vdFRyYWNlcikge1xuICBfaW5oZXJpdHNMb29zZShUcmFjZXIsIF9vdFRyYWNlcik7XG5cbiAgZnVuY3Rpb24gVHJhY2VyKHBlcmZvcm1hbmNlTW9uaXRvcmluZywgdHJhbnNhY3Rpb25TZXJ2aWNlLCBsb2dnaW5nU2VydmljZSwgZXJyb3JMb2dnaW5nKSB7XG4gICAgdmFyIF90aGlzO1xuXG4gICAgX3RoaXMgPSBfb3RUcmFjZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xuICAgIF90aGlzLnBlcmZvcm1hbmNlTW9uaXRvcmluZyA9IHBlcmZvcm1hbmNlTW9uaXRvcmluZztcbiAgICBfdGhpcy50cmFuc2FjdGlvblNlcnZpY2UgPSB0cmFuc2FjdGlvblNlcnZpY2U7XG4gICAgX3RoaXMubG9nZ2luZ1NlcnZpY2UgPSBsb2dnaW5nU2VydmljZTtcbiAgICBfdGhpcy5lcnJvckxvZ2dpbmcgPSBlcnJvckxvZ2dpbmc7XG4gICAgcmV0dXJuIF90aGlzO1xuICB9XG5cbiAgdmFyIF9wcm90byA9IFRyYWNlci5wcm90b3R5cGU7XG5cbiAgX3Byb3RvLl9zdGFydFNwYW4gPSBmdW5jdGlvbiBfc3RhcnRTcGFuKG5hbWUsIG9wdGlvbnMpIHtcbiAgICB2YXIgc3Bhbk9wdGlvbnMgPSB7XG4gICAgICBtYW5hZ2VkOiB0cnVlXG4gICAgfTtcblxuICAgIGlmIChvcHRpb25zKSB7XG4gICAgICBzcGFuT3B0aW9ucy50aW1lc3RhbXAgPSBvcHRpb25zLnN0YXJ0VGltZTtcblxuICAgICAgaWYgKG9wdGlvbnMuY2hpbGRPZikge1xuICAgICAgICBzcGFuT3B0aW9ucy5wYXJlbnRJZCA9IG9wdGlvbnMuY2hpbGRPZi5pZDtcbiAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5yZWZlcmVuY2VzICYmIG9wdGlvbnMucmVmZXJlbmNlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGlmIChvcHRpb25zLnJlZmVyZW5jZXMubGVuZ3RoID4gMSkge1xuICAgICAgICAgIGlmIChfX0RFVl9fKSB7XG4gICAgICAgICAgICB0aGlzLmxvZ2dpbmdTZXJ2aWNlLmRlYnVnKCdFbGFzdGljIEFQTSBPcGVuVHJhY2luZzogVW5zdXBwb3J0ZWQgbnVtYmVyIG9mIHJlZmVyZW5jZXMsIG9ubHkgdGhlIGZpcnN0IGNoaWxkT2YgcmVmZXJlbmNlIHdpbGwgYmUgcmVjb3JkZWQuJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGNoaWxkUmVmID0gZmluZChvcHRpb25zLnJlZmVyZW5jZXMsIGZ1bmN0aW9uIChyZWYpIHtcbiAgICAgICAgICByZXR1cm4gcmVmLnR5cGUoKSA9PT0gUkVGRVJFTkNFX0NISUxEX09GO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAoY2hpbGRSZWYpIHtcbiAgICAgICAgICBzcGFuT3B0aW9ucy5wYXJlbnRJZCA9IGNoaWxkUmVmLnJlZmVyZW5jZWRDb250ZXh0KCkuaWQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgc3BhbjtcbiAgICB2YXIgY3VycmVudFRyYW5zYWN0aW9uID0gdGhpcy50cmFuc2FjdGlvblNlcnZpY2UuZ2V0Q3VycmVudFRyYW5zYWN0aW9uKCk7XG5cbiAgICBpZiAoY3VycmVudFRyYW5zYWN0aW9uKSB7XG4gICAgICBzcGFuID0gdGhpcy50cmFuc2FjdGlvblNlcnZpY2Uuc3RhcnRTcGFuKG5hbWUsIHVuZGVmaW5lZCwgc3Bhbk9wdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzcGFuID0gdGhpcy50cmFuc2FjdGlvblNlcnZpY2Uuc3RhcnRUcmFuc2FjdGlvbihuYW1lLCB1bmRlZmluZWQsIHNwYW5PcHRpb25zKTtcbiAgICB9XG5cbiAgICBpZiAoIXNwYW4pIHtcbiAgICAgIHJldHVybiBuZXcgTm9vcFNwYW4oKTtcbiAgICB9XG5cbiAgICBpZiAoc3Bhbk9wdGlvbnMudGltZXN0YW1wKSB7XG4gICAgICBzcGFuLl9zdGFydCA9IHNwYW5PcHRpb25zLnRpbWVzdGFtcCAtIGdldFRpbWVPcmlnaW4oKTtcbiAgICB9XG5cbiAgICB2YXIgb3RTcGFuID0gbmV3IFNwYW4odGhpcywgc3Bhbik7XG5cbiAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLnRhZ3MpIHtcbiAgICAgIG90U3Bhbi5hZGRUYWdzKG9wdGlvbnMudGFncyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG90U3BhbjtcbiAgfTtcblxuICBfcHJvdG8uX2luamVjdCA9IGZ1bmN0aW9uIF9pbmplY3Qoc3BhbkNvbnRleHQsIGZvcm1hdCwgY2Fycmllcikge1xuICAgIHN3aXRjaCAoZm9ybWF0KSB7XG4gICAgICBjYXNlIEZPUk1BVF9URVhUX01BUDpcbiAgICAgIGNhc2UgRk9STUFUX0hUVFBfSEVBREVSUzpcbiAgICAgICAgdGhpcy5wZXJmb3JtYW5jZU1vbml0b3JpbmcuaW5qZWN0RHRIZWFkZXIoc3BhbkNvbnRleHQsIGNhcnJpZXIpO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSBGT1JNQVRfQklOQVJZOlxuICAgICAgICBpZiAoX19ERVZfXykge1xuICAgICAgICAgIHRoaXMubG9nZ2luZ1NlcnZpY2UuZGVidWcoJ0VsYXN0aWMgQVBNIE9wZW5UcmFjaW5nOiBiaW5hcnkgY2FycmllciBmb3JtYXQgaXMgbm90IHN1cHBvcnRlZC4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfTtcblxuICBfcHJvdG8uX2V4dHJhY3QgPSBmdW5jdGlvbiBfZXh0cmFjdChmb3JtYXQsIGNhcnJpZXIpIHtcbiAgICB2YXIgY3R4O1xuXG4gICAgc3dpdGNoIChmb3JtYXQpIHtcbiAgICAgIGNhc2UgRk9STUFUX1RFWFRfTUFQOlxuICAgICAgY2FzZSBGT1JNQVRfSFRUUF9IRUFERVJTOlxuICAgICAgICBjdHggPSB0aGlzLnBlcmZvcm1hbmNlTW9uaXRvcmluZy5leHRyYWN0RHRIZWFkZXIoY2Fycmllcik7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIEZPUk1BVF9CSU5BUlk6XG4gICAgICAgIGlmIChfX0RFVl9fKSB7XG4gICAgICAgICAgdGhpcy5sb2dnaW5nU2VydmljZS5kZWJ1ZygnRWxhc3RpYyBBUE0gT3BlblRyYWNpbmc6IGJpbmFyeSBjYXJyaWVyIGZvcm1hdCBpcyBub3Qgc3VwcG9ydGVkLicpO1xuICAgICAgICB9XG5cbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKCFjdHgpIHtcbiAgICAgIGN0eCA9IG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIGN0eDtcbiAgfTtcblxuICByZXR1cm4gVHJhY2VyO1xufShvdFRyYWNlcik7XG5cbmV4cG9ydCBkZWZhdWx0IFRyYWNlcjsiLCJpbXBvcnQgeyBnZXREdXJhdGlvbiwgUEVSRiB9IGZyb20gJy4uL2NvbW1vbi91dGlscyc7XG5pbXBvcnQgeyBQQUdFX0xPQUQsIFRSVU5DQVRFRF9UWVBFIH0gZnJvbSAnLi4vY29tbW9uL2NvbnN0YW50cyc7XG52YXIgcGFnZUxvYWRCcmVha2Rvd25zID0gW1snZG9tYWluTG9va3VwU3RhcnQnLCAnZG9tYWluTG9va3VwRW5kJywgJ0ROUyddLCBbJ2Nvbm5lY3RTdGFydCcsICdjb25uZWN0RW5kJywgJ1RDUCddLCBbJ3JlcXVlc3RTdGFydCcsICdyZXNwb25zZVN0YXJ0JywgJ1JlcXVlc3QnXSwgWydyZXNwb25zZVN0YXJ0JywgJ3Jlc3BvbnNlRW5kJywgJ1Jlc3BvbnNlJ10sIFsnZG9tTG9hZGluZycsICdkb21Db21wbGV0ZScsICdQcm9jZXNzaW5nJ10sIFsnbG9hZEV2ZW50U3RhcnQnLCAnbG9hZEV2ZW50RW5kJywgJ0xvYWQnXV07XG5cbmZ1bmN0aW9uIGdldFZhbHVlKHZhbHVlKSB7XG4gIHJldHVybiB7XG4gICAgdmFsdWU6IHZhbHVlXG4gIH07XG59XG5cbmZ1bmN0aW9uIGNhbGN1bGF0ZVNlbGZUaW1lKHRyYW5zYWN0aW9uKSB7XG4gIHZhciBzcGFucyA9IHRyYW5zYWN0aW9uLnNwYW5zLFxuICAgICAgX3N0YXJ0ID0gdHJhbnNhY3Rpb24uX3N0YXJ0LFxuICAgICAgX2VuZCA9IHRyYW5zYWN0aW9uLl9lbmQ7XG5cbiAgaWYgKHNwYW5zLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiB0cmFuc2FjdGlvbi5kdXJhdGlvbigpO1xuICB9XG5cbiAgc3BhbnMuc29ydChmdW5jdGlvbiAoc3BhbjEsIHNwYW4yKSB7XG4gICAgcmV0dXJuIHNwYW4xLl9zdGFydCAtIHNwYW4yLl9zdGFydDtcbiAgfSk7XG4gIHZhciBzcGFuID0gc3BhbnNbMF07XG4gIHZhciBzcGFuRW5kID0gc3Bhbi5fZW5kO1xuICB2YXIgc3BhblN0YXJ0ID0gc3Bhbi5fc3RhcnQ7XG4gIHZhciBsYXN0Q29udGludW91c0VuZCA9IHNwYW5FbmQ7XG4gIHZhciBzZWxmVGltZSA9IHNwYW5TdGFydCAtIF9zdGFydDtcblxuICBmb3IgKHZhciBpID0gMTsgaSA8IHNwYW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgc3BhbiA9IHNwYW5zW2ldO1xuICAgIHNwYW5TdGFydCA9IHNwYW4uX3N0YXJ0O1xuICAgIHNwYW5FbmQgPSBzcGFuLl9lbmQ7XG5cbiAgICBpZiAoc3BhblN0YXJ0ID4gbGFzdENvbnRpbnVvdXNFbmQpIHtcbiAgICAgIHNlbGZUaW1lICs9IHNwYW5TdGFydCAtIGxhc3RDb250aW51b3VzRW5kO1xuICAgICAgbGFzdENvbnRpbnVvdXNFbmQgPSBzcGFuRW5kO1xuICAgIH0gZWxzZSBpZiAoc3BhbkVuZCA+IGxhc3RDb250aW51b3VzRW5kKSB7XG4gICAgICBsYXN0Q29udGludW91c0VuZCA9IHNwYW5FbmQ7XG4gICAgfVxuICB9XG5cbiAgaWYgKGxhc3RDb250aW51b3VzRW5kIDwgX2VuZCkge1xuICAgIHNlbGZUaW1lICs9IF9lbmQgLSBsYXN0Q29udGludW91c0VuZDtcbiAgfVxuXG4gIHJldHVybiBzZWxmVGltZTtcbn1cblxuZnVuY3Rpb24gZ3JvdXBTcGFucyh0cmFuc2FjdGlvbikge1xuICB2YXIgc3Bhbk1hcCA9IHt9O1xuICB2YXIgdHJhbnNhY3Rpb25TZWxmVGltZSA9IGNhbGN1bGF0ZVNlbGZUaW1lKHRyYW5zYWN0aW9uKTtcbiAgc3Bhbk1hcFsnYXBwJ10gPSB7XG4gICAgY291bnQ6IDEsXG4gICAgZHVyYXRpb246IHRyYW5zYWN0aW9uU2VsZlRpbWVcbiAgfTtcbiAgdmFyIHNwYW5zID0gdHJhbnNhY3Rpb24uc3BhbnM7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzcGFucy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBzcGFuID0gc3BhbnNbaV07XG4gICAgdmFyIGR1cmF0aW9uID0gc3Bhbi5kdXJhdGlvbigpO1xuXG4gICAgaWYgKGR1cmF0aW9uID09PSAwIHx8IGR1cmF0aW9uID09IG51bGwpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHZhciB0eXBlID0gc3Bhbi50eXBlLFxuICAgICAgICBzdWJ0eXBlID0gc3Bhbi5zdWJ0eXBlO1xuICAgIHZhciBrZXkgPSB0eXBlLnJlcGxhY2UoVFJVTkNBVEVEX1RZUEUsICcnKTtcblxuICAgIGlmIChzdWJ0eXBlKSB7XG4gICAgICBrZXkgKz0gJy4nICsgc3VidHlwZTtcbiAgICB9XG5cbiAgICBpZiAoIXNwYW5NYXBba2V5XSkge1xuICAgICAgc3Bhbk1hcFtrZXldID0ge1xuICAgICAgICBkdXJhdGlvbjogMCxcbiAgICAgICAgY291bnQ6IDBcbiAgICAgIH07XG4gICAgfVxuXG4gICAgc3Bhbk1hcFtrZXldLmNvdW50Kys7XG4gICAgc3Bhbk1hcFtrZXldLmR1cmF0aW9uICs9IGR1cmF0aW9uO1xuICB9XG5cbiAgcmV0dXJuIHNwYW5NYXA7XG59XG5cbmZ1bmN0aW9uIGdldFNwYW5CcmVha2Rvd24odHJhbnNhY3Rpb25EZXRhaWxzLCBfcmVmKSB7XG4gIHZhciBkZXRhaWxzID0gX3JlZi5kZXRhaWxzLFxuICAgICAgX3JlZiRjb3VudCA9IF9yZWYuY291bnQsXG4gICAgICBjb3VudCA9IF9yZWYkY291bnQgPT09IHZvaWQgMCA/IDEgOiBfcmVmJGNvdW50LFxuICAgICAgZHVyYXRpb24gPSBfcmVmLmR1cmF0aW9uO1xuICByZXR1cm4ge1xuICAgIHRyYW5zYWN0aW9uOiB0cmFuc2FjdGlvbkRldGFpbHMsXG4gICAgc3BhbjogZGV0YWlscyxcbiAgICBzYW1wbGVzOiB7XG4gICAgICAnc3Bhbi5zZWxmX3RpbWUuY291bnQnOiBnZXRWYWx1ZShjb3VudCksXG4gICAgICAnc3Bhbi5zZWxmX3RpbWUuc3VtLnVzJzogZ2V0VmFsdWUoZHVyYXRpb24gKiAxMDAwKVxuICAgIH1cbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNhcHR1cmVCcmVha2Rvd24odHJhbnNhY3Rpb24sIHRpbWluZ3MpIHtcbiAgaWYgKHRpbWluZ3MgPT09IHZvaWQgMCkge1xuICAgIHRpbWluZ3MgPSBQRVJGLnRpbWluZztcbiAgfVxuXG4gIHZhciBicmVha2Rvd25zID0gW107XG4gIHZhciBuYW1lID0gdHJhbnNhY3Rpb24ubmFtZSxcbiAgICAgIHR5cGUgPSB0cmFuc2FjdGlvbi50eXBlLFxuICAgICAgc2FtcGxlZCA9IHRyYW5zYWN0aW9uLnNhbXBsZWQ7XG4gIHZhciB0cmFuc2FjdGlvbkRldGFpbHMgPSB7XG4gICAgbmFtZTogbmFtZSxcbiAgICB0eXBlOiB0eXBlXG4gIH07XG5cbiAgaWYgKCFzYW1wbGVkKSB7XG4gICAgcmV0dXJuIGJyZWFrZG93bnM7XG4gIH1cblxuICBpZiAodHlwZSA9PT0gUEFHRV9MT0FEICYmIHRpbWluZ3MpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhZ2VMb2FkQnJlYWtkb3ducy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGN1cnJlbnQgPSBwYWdlTG9hZEJyZWFrZG93bnNbaV07XG4gICAgICB2YXIgc3RhcnQgPSB0aW1pbmdzW2N1cnJlbnRbMF1dO1xuICAgICAgdmFyIGVuZCA9IHRpbWluZ3NbY3VycmVudFsxXV07XG4gICAgICB2YXIgZHVyYXRpb24gPSBnZXREdXJhdGlvbihzdGFydCwgZW5kKTtcblxuICAgICAgaWYgKGR1cmF0aW9uID09PSAwIHx8IGR1cmF0aW9uID09IG51bGwpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGJyZWFrZG93bnMucHVzaChnZXRTcGFuQnJlYWtkb3duKHRyYW5zYWN0aW9uRGV0YWlscywge1xuICAgICAgICBkZXRhaWxzOiB7XG4gICAgICAgICAgdHlwZTogY3VycmVudFsyXVxuICAgICAgICB9LFxuICAgICAgICBkdXJhdGlvbjogZHVyYXRpb25cbiAgICAgIH0pKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyIHNwYW5NYXAgPSBncm91cFNwYW5zKHRyYW5zYWN0aW9uKTtcbiAgICBPYmplY3Qua2V5cyhzcGFuTWFwKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHZhciBfa2V5JHNwbGl0ID0ga2V5LnNwbGl0KCcuJyksXG4gICAgICAgICAgdHlwZSA9IF9rZXkkc3BsaXRbMF0sXG4gICAgICAgICAgc3VidHlwZSA9IF9rZXkkc3BsaXRbMV07XG5cbiAgICAgIHZhciBfc3Bhbk1hcCRrZXkgPSBzcGFuTWFwW2tleV0sXG4gICAgICAgICAgZHVyYXRpb24gPSBfc3Bhbk1hcCRrZXkuZHVyYXRpb24sXG4gICAgICAgICAgY291bnQgPSBfc3Bhbk1hcCRrZXkuY291bnQ7XG4gICAgICBicmVha2Rvd25zLnB1c2goZ2V0U3BhbkJyZWFrZG93bih0cmFuc2FjdGlvbkRldGFpbHMsIHtcbiAgICAgICAgZGV0YWlsczoge1xuICAgICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgICAgc3VidHlwZTogc3VidHlwZVxuICAgICAgICB9LFxuICAgICAgICBkdXJhdGlvbjogZHVyYXRpb24sXG4gICAgICAgIGNvdW50OiBjb3VudFxuICAgICAgfSkpO1xuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIGJyZWFrZG93bnM7XG59IiwiaW1wb3J0IFBlcmZvcm1hbmNlTW9uaXRvcmluZyBmcm9tICcuL3BlcmZvcm1hbmNlLW1vbml0b3JpbmcnO1xuaW1wb3J0IFRyYW5zYWN0aW9uU2VydmljZSBmcm9tICcuL3RyYW5zYWN0aW9uLXNlcnZpY2UnO1xuaW1wb3J0IHsgQVBNX1NFUlZFUiwgQ09ORklHX1NFUlZJQ0UsIExPR0dJTkdfU0VSVklDRSwgVFJBTlNBQ1RJT05fU0VSVklDRSwgUEVSRk9STUFOQ0VfTU9OSVRPUklORyB9IGZyb20gJy4uL2NvbW1vbi9jb25zdGFudHMnO1xuaW1wb3J0IHsgc2VydmljZUNyZWF0b3JzIH0gZnJvbSAnLi4vY29tbW9uL3NlcnZpY2UtZmFjdG9yeSc7XG5cbmZ1bmN0aW9uIHJlZ2lzdGVyU2VydmljZXMoKSB7XG4gIHNlcnZpY2VDcmVhdG9yc1tUUkFOU0FDVElPTl9TRVJWSUNFXSA9IGZ1bmN0aW9uIChzZXJ2aWNlRmFjdG9yeSkge1xuICAgIHZhciBfc2VydmljZUZhY3RvcnkkZ2V0U2UgPSBzZXJ2aWNlRmFjdG9yeS5nZXRTZXJ2aWNlKFtMT0dHSU5HX1NFUlZJQ0UsIENPTkZJR19TRVJWSUNFXSksXG4gICAgICAgIGxvZ2dpbmdTZXJ2aWNlID0gX3NlcnZpY2VGYWN0b3J5JGdldFNlWzBdLFxuICAgICAgICBjb25maWdTZXJ2aWNlID0gX3NlcnZpY2VGYWN0b3J5JGdldFNlWzFdO1xuXG4gICAgcmV0dXJuIG5ldyBUcmFuc2FjdGlvblNlcnZpY2UobG9nZ2luZ1NlcnZpY2UsIGNvbmZpZ1NlcnZpY2UpO1xuICB9O1xuXG4gIHNlcnZpY2VDcmVhdG9yc1tQRVJGT1JNQU5DRV9NT05JVE9SSU5HXSA9IGZ1bmN0aW9uIChzZXJ2aWNlRmFjdG9yeSkge1xuICAgIHZhciBfc2VydmljZUZhY3RvcnkkZ2V0U2UyID0gc2VydmljZUZhY3RvcnkuZ2V0U2VydmljZShbQVBNX1NFUlZFUiwgQ09ORklHX1NFUlZJQ0UsIExPR0dJTkdfU0VSVklDRSwgVFJBTlNBQ1RJT05fU0VSVklDRV0pLFxuICAgICAgICBhcG1TZXJ2ZXIgPSBfc2VydmljZUZhY3RvcnkkZ2V0U2UyWzBdLFxuICAgICAgICBjb25maWdTZXJ2aWNlID0gX3NlcnZpY2VGYWN0b3J5JGdldFNlMlsxXSxcbiAgICAgICAgbG9nZ2luZ1NlcnZpY2UgPSBfc2VydmljZUZhY3RvcnkkZ2V0U2UyWzJdLFxuICAgICAgICB0cmFuc2FjdGlvblNlcnZpY2UgPSBfc2VydmljZUZhY3RvcnkkZ2V0U2UyWzNdO1xuXG4gICAgcmV0dXJuIG5ldyBQZXJmb3JtYW5jZU1vbml0b3JpbmcoYXBtU2VydmVyLCBjb25maWdTZXJ2aWNlLCBsb2dnaW5nU2VydmljZSwgdHJhbnNhY3Rpb25TZXJ2aWNlKTtcbiAgfTtcbn1cblxuZXhwb3J0IHsgcmVnaXN0ZXJTZXJ2aWNlcyB9OyIsImltcG9ydCB7IExPTkdfVEFTSywgTEFSR0VTVF9DT05URU5URlVMX1BBSU5ULCBGSVJTVF9DT05URU5URlVMX1BBSU5ULCBGSVJTVF9JTlBVVCwgTEFZT1VUX1NISUZUIH0gZnJvbSAnLi4vY29tbW9uL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBub29wLCBQRVJGLCBpc1BlcmZUeXBlU3VwcG9ydGVkLCBpc1JlZGlyZWN0SW5mb0F2YWlsYWJsZSB9IGZyb20gJy4uL2NvbW1vbi91dGlscyc7XG5pbXBvcnQgU3BhbiBmcm9tICcuL3NwYW4nO1xuZXhwb3J0IHZhciBtZXRyaWNzID0ge1xuICBmaWQ6IDAsXG4gIGZjcDogMCxcbiAgdGJ0OiB7XG4gICAgc3RhcnQ6IEluZmluaXR5LFxuICAgIGR1cmF0aW9uOiAwXG4gIH0sXG4gIGNsczoge1xuICAgIHNjb3JlOiAwLFxuICAgIGZpcnN0RW50cnlUaW1lOiBOdW1iZXIuTkVHQVRJVkVfSU5GSU5JVFksXG4gICAgcHJldkVudHJ5VGltZTogTnVtYmVyLk5FR0FUSVZFX0lORklOSVRZLFxuICAgIGN1cnJlbnRTZXNzaW9uU2NvcmU6IDBcbiAgfSxcbiAgbG9uZ3Rhc2s6IHtcbiAgICBjb3VudDogMCxcbiAgICBkdXJhdGlvbjogMCxcbiAgICBtYXg6IDBcbiAgfVxufTtcbnZhciBMT05HX1RBU0tfVEhSRVNIT0xEID0gNTA7XG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTG9uZ1Rhc2tTcGFucyhsb25ndGFza3MsIGFnZykge1xuICB2YXIgc3BhbnMgPSBbXTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxvbmd0YXNrcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBfbG9uZ3Rhc2tzJGkgPSBsb25ndGFza3NbaV0sXG4gICAgICAgIG5hbWUgPSBfbG9uZ3Rhc2tzJGkubmFtZSxcbiAgICAgICAgc3RhcnRUaW1lID0gX2xvbmd0YXNrcyRpLnN0YXJ0VGltZSxcbiAgICAgICAgZHVyYXRpb24gPSBfbG9uZ3Rhc2tzJGkuZHVyYXRpb24sXG4gICAgICAgIGF0dHJpYnV0aW9uID0gX2xvbmd0YXNrcyRpLmF0dHJpYnV0aW9uO1xuICAgIHZhciBlbmQgPSBzdGFydFRpbWUgKyBkdXJhdGlvbjtcbiAgICB2YXIgc3BhbiA9IG5ldyBTcGFuKFwiTG9uZ3Rhc2soXCIgKyBuYW1lICsgXCIpXCIsIExPTkdfVEFTSywge1xuICAgICAgc3RhcnRUaW1lOiBzdGFydFRpbWVcbiAgICB9KTtcbiAgICBhZ2cuY291bnQrKztcbiAgICBhZ2cuZHVyYXRpb24gKz0gZHVyYXRpb247XG4gICAgYWdnLm1heCA9IE1hdGgubWF4KGR1cmF0aW9uLCBhZ2cubWF4KTtcblxuICAgIGlmIChhdHRyaWJ1dGlvbi5sZW5ndGggPiAwKSB7XG4gICAgICB2YXIgX2F0dHJpYnV0aW9uJCA9IGF0dHJpYnV0aW9uWzBdLFxuICAgICAgICAgIF9uYW1lID0gX2F0dHJpYnV0aW9uJC5uYW1lLFxuICAgICAgICAgIGNvbnRhaW5lclR5cGUgPSBfYXR0cmlidXRpb24kLmNvbnRhaW5lclR5cGUsXG4gICAgICAgICAgY29udGFpbmVyTmFtZSA9IF9hdHRyaWJ1dGlvbiQuY29udGFpbmVyTmFtZSxcbiAgICAgICAgICBjb250YWluZXJJZCA9IF9hdHRyaWJ1dGlvbiQuY29udGFpbmVySWQ7XG4gICAgICB2YXIgY3VzdG9tQ29udGV4dCA9IHtcbiAgICAgICAgYXR0cmlidXRpb246IF9uYW1lLFxuICAgICAgICB0eXBlOiBjb250YWluZXJUeXBlXG4gICAgICB9O1xuXG4gICAgICBpZiAoY29udGFpbmVyTmFtZSkge1xuICAgICAgICBjdXN0b21Db250ZXh0Lm5hbWUgPSBjb250YWluZXJOYW1lO1xuICAgICAgfVxuXG4gICAgICBpZiAoY29udGFpbmVySWQpIHtcbiAgICAgICAgY3VzdG9tQ29udGV4dC5pZCA9IGNvbnRhaW5lcklkO1xuICAgICAgfVxuXG4gICAgICBzcGFuLmFkZENvbnRleHQoe1xuICAgICAgICBjdXN0b206IGN1c3RvbUNvbnRleHRcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHNwYW4uZW5kKGVuZCk7XG4gICAgc3BhbnMucHVzaChzcGFuKTtcbiAgfVxuXG4gIHJldHVybiBzcGFucztcbn1cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVGaXJzdElucHV0RGVsYXlTcGFuKGZpZEVudHJpZXMpIHtcbiAgdmFyIGZpcnN0SW5wdXQgPSBmaWRFbnRyaWVzWzBdO1xuXG4gIGlmIChmaXJzdElucHV0KSB7XG4gICAgdmFyIHN0YXJ0VGltZSA9IGZpcnN0SW5wdXQuc3RhcnRUaW1lLFxuICAgICAgICBwcm9jZXNzaW5nU3RhcnQgPSBmaXJzdElucHV0LnByb2Nlc3NpbmdTdGFydDtcbiAgICB2YXIgc3BhbiA9IG5ldyBTcGFuKCdGaXJzdCBJbnB1dCBEZWxheScsIEZJUlNUX0lOUFVULCB7XG4gICAgICBzdGFydFRpbWU6IHN0YXJ0VGltZVxuICAgIH0pO1xuICAgIHNwYW4uZW5kKHByb2Nlc3NpbmdTdGFydCk7XG4gICAgcmV0dXJuIHNwYW47XG4gIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUb3RhbEJsb2NraW5nVGltZVNwYW4odGJ0T2JqZWN0KSB7XG4gIHZhciBzdGFydCA9IHRidE9iamVjdC5zdGFydCxcbiAgICAgIGR1cmF0aW9uID0gdGJ0T2JqZWN0LmR1cmF0aW9uO1xuICB2YXIgdGJ0U3BhbiA9IG5ldyBTcGFuKCdUb3RhbCBCbG9ja2luZyBUaW1lJywgTE9OR19UQVNLLCB7XG4gICAgc3RhcnRUaW1lOiBzdGFydFxuICB9KTtcbiAgdGJ0U3Bhbi5lbmQoc3RhcnQgKyBkdXJhdGlvbik7XG4gIHJldHVybiB0YnRTcGFuO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNhbGN1bGF0ZVRvdGFsQmxvY2tpbmdUaW1lKGxvbmd0YXNrRW50cmllcykge1xuICBsb25ndGFza0VudHJpZXMuZm9yRWFjaChmdW5jdGlvbiAoZW50cnkpIHtcbiAgICB2YXIgbmFtZSA9IGVudHJ5Lm5hbWUsXG4gICAgICAgIHN0YXJ0VGltZSA9IGVudHJ5LnN0YXJ0VGltZSxcbiAgICAgICAgZHVyYXRpb24gPSBlbnRyeS5kdXJhdGlvbjtcblxuICAgIGlmIChzdGFydFRpbWUgPCBtZXRyaWNzLmZjcCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChuYW1lICE9PSAnc2VsZicgJiYgbmFtZS5pbmRleE9mKCdzYW1lLW9yaWdpbicpID09PSAtMSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG1ldHJpY3MudGJ0LnN0YXJ0ID0gTWF0aC5taW4obWV0cmljcy50YnQuc3RhcnQsIHN0YXJ0VGltZSk7XG4gICAgdmFyIGJsb2NraW5nVGltZSA9IGR1cmF0aW9uIC0gTE9OR19UQVNLX1RIUkVTSE9MRDtcblxuICAgIGlmIChibG9ja2luZ1RpbWUgPiAwKSB7XG4gICAgICBtZXRyaWNzLnRidC5kdXJhdGlvbiArPSBibG9ja2luZ1RpbWU7XG4gICAgfVxuICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjYWxjdWxhdGVDdW11bGF0aXZlTGF5b3V0U2hpZnQoY2xzRW50cmllcykge1xuICBjbHNFbnRyaWVzLmZvckVhY2goZnVuY3Rpb24gKGVudHJ5KSB7XG4gICAgaWYgKCFlbnRyeS5oYWRSZWNlbnRJbnB1dCAmJiBlbnRyeS52YWx1ZSkge1xuICAgICAgdmFyIHNob3VsZENyZWF0ZU5ld1Nlc3Npb24gPSBlbnRyeS5zdGFydFRpbWUgLSBtZXRyaWNzLmNscy5maXJzdEVudHJ5VGltZSA+IDUwMDAgfHwgZW50cnkuc3RhcnRUaW1lIC0gbWV0cmljcy5jbHMucHJldkVudHJ5VGltZSA+IDEwMDA7XG5cbiAgICAgIGlmIChzaG91bGRDcmVhdGVOZXdTZXNzaW9uKSB7XG4gICAgICAgIG1ldHJpY3MuY2xzLmZpcnN0RW50cnlUaW1lID0gZW50cnkuc3RhcnRUaW1lO1xuICAgICAgICBtZXRyaWNzLmNscy5jdXJyZW50U2Vzc2lvblNjb3JlID0gMDtcbiAgICAgIH1cblxuICAgICAgbWV0cmljcy5jbHMucHJldkVudHJ5VGltZSA9IGVudHJ5LnN0YXJ0VGltZTtcbiAgICAgIG1ldHJpY3MuY2xzLmN1cnJlbnRTZXNzaW9uU2NvcmUgKz0gZW50cnkudmFsdWU7XG4gICAgICBtZXRyaWNzLmNscy5zY29yZSA9IE1hdGgubWF4KG1ldHJpY3MuY2xzLnNjb3JlLCBtZXRyaWNzLmNscy5jdXJyZW50U2Vzc2lvblNjb3JlKTtcbiAgICB9XG4gIH0pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNhcHR1cmVPYnNlcnZlckVudHJpZXMobGlzdCwgX3JlZikge1xuICB2YXIgaXNIYXJkTmF2aWdhdGlvbiA9IF9yZWYuaXNIYXJkTmF2aWdhdGlvbixcbiAgICAgIHRyU3RhcnQgPSBfcmVmLnRyU3RhcnQ7XG4gIHZhciBsb25ndGFza0VudHJpZXMgPSBsaXN0LmdldEVudHJpZXNCeVR5cGUoTE9OR19UQVNLKS5maWx0ZXIoZnVuY3Rpb24gKGVudHJ5KSB7XG4gICAgcmV0dXJuIGVudHJ5LnN0YXJ0VGltZSA+PSB0clN0YXJ0O1xuICB9KTtcbiAgdmFyIGxvbmdUYXNrU3BhbnMgPSBjcmVhdGVMb25nVGFza1NwYW5zKGxvbmd0YXNrRW50cmllcywgbWV0cmljcy5sb25ndGFzayk7XG4gIHZhciByZXN1bHQgPSB7XG4gICAgc3BhbnM6IGxvbmdUYXNrU3BhbnMsXG4gICAgbWFya3M6IHt9XG4gIH07XG5cbiAgaWYgKCFpc0hhcmROYXZpZ2F0aW9uKSB7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHZhciBsY3BFbnRyaWVzID0gbGlzdC5nZXRFbnRyaWVzQnlUeXBlKExBUkdFU1RfQ09OVEVOVEZVTF9QQUlOVCk7XG4gIHZhciBsYXN0TGNwRW50cnkgPSBsY3BFbnRyaWVzW2xjcEVudHJpZXMubGVuZ3RoIC0gMV07XG5cbiAgaWYgKGxhc3RMY3BFbnRyeSkge1xuICAgIHZhciBsY3AgPSBwYXJzZUludChsYXN0TGNwRW50cnkuc3RhcnRUaW1lKTtcbiAgICBtZXRyaWNzLmxjcCA9IGxjcDtcbiAgICByZXN1bHQubWFya3MubGFyZ2VzdENvbnRlbnRmdWxQYWludCA9IGxjcDtcbiAgfVxuXG4gIHZhciB0aW1pbmcgPSBQRVJGLnRpbWluZztcbiAgdmFyIHVubG9hZERpZmYgPSB0aW1pbmcuZmV0Y2hTdGFydCAtIHRpbWluZy5uYXZpZ2F0aW9uU3RhcnQ7XG5cbiAgaWYgKGlzUmVkaXJlY3RJbmZvQXZhaWxhYmxlKHRpbWluZykpIHtcbiAgICB1bmxvYWREaWZmID0gMDtcbiAgfVxuXG4gIHZhciBmY3BFbnRyeSA9IGxpc3QuZ2V0RW50cmllc0J5TmFtZShGSVJTVF9DT05URU5URlVMX1BBSU5UKVswXTtcblxuICBpZiAoZmNwRW50cnkpIHtcbiAgICB2YXIgZmNwID0gcGFyc2VJbnQodW5sb2FkRGlmZiA+PSAwID8gZmNwRW50cnkuc3RhcnRUaW1lIC0gdW5sb2FkRGlmZiA6IGZjcEVudHJ5LnN0YXJ0VGltZSk7XG4gICAgbWV0cmljcy5mY3AgPSBmY3A7XG4gICAgcmVzdWx0Lm1hcmtzLmZpcnN0Q29udGVudGZ1bFBhaW50ID0gZmNwO1xuICB9XG5cbiAgdmFyIGZpZEVudHJpZXMgPSBsaXN0LmdldEVudHJpZXNCeVR5cGUoRklSU1RfSU5QVVQpO1xuICB2YXIgZmlkU3BhbiA9IGNyZWF0ZUZpcnN0SW5wdXREZWxheVNwYW4oZmlkRW50cmllcyk7XG5cbiAgaWYgKGZpZFNwYW4pIHtcbiAgICBtZXRyaWNzLmZpZCA9IGZpZFNwYW4uZHVyYXRpb24oKTtcbiAgICByZXN1bHQuc3BhbnMucHVzaChmaWRTcGFuKTtcbiAgfVxuXG4gIGNhbGN1bGF0ZVRvdGFsQmxvY2tpbmdUaW1lKGxvbmd0YXNrRW50cmllcyk7XG4gIHZhciBjbHNFbnRyaWVzID0gbGlzdC5nZXRFbnRyaWVzQnlUeXBlKExBWU9VVF9TSElGVCk7XG4gIGNhbGN1bGF0ZUN1bXVsYXRpdmVMYXlvdXRTaGlmdChjbHNFbnRyaWVzKTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmV4cG9ydCB2YXIgUGVyZkVudHJ5UmVjb3JkZXIgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFBlcmZFbnRyeVJlY29yZGVyKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5wbyA9IHtcbiAgICAgIG9ic2VydmU6IG5vb3AsXG4gICAgICBkaXNjb25uZWN0OiBub29wXG4gICAgfTtcblxuICAgIGlmICh3aW5kb3cuUGVyZm9ybWFuY2VPYnNlcnZlcikge1xuICAgICAgdGhpcy5wbyA9IG5ldyBQZXJmb3JtYW5jZU9ic2VydmVyKGNhbGxiYWNrKTtcbiAgICB9XG4gIH1cblxuICB2YXIgX3Byb3RvID0gUGVyZkVudHJ5UmVjb3JkZXIucHJvdG90eXBlO1xuXG4gIF9wcm90by5zdGFydCA9IGZ1bmN0aW9uIHN0YXJ0KHR5cGUpIHtcbiAgICB0cnkge1xuICAgICAgaWYgKCFpc1BlcmZUeXBlU3VwcG9ydGVkKHR5cGUpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5wby5vYnNlcnZlKHtcbiAgICAgICAgdHlwZTogdHlwZSxcbiAgICAgICAgYnVmZmVyZWQ6IHRydWVcbiAgICAgIH0pO1xuICAgIH0gY2F0Y2ggKF8pIHt9XG4gIH07XG5cbiAgX3Byb3RvLnN0b3AgPSBmdW5jdGlvbiBzdG9wKCkge1xuICAgIHRoaXMucG8uZGlzY29ubmVjdCgpO1xuICB9O1xuXG4gIHJldHVybiBQZXJmRW50cnlSZWNvcmRlcjtcbn0oKTsiLCJpbXBvcnQgeyBQRVJGLCBpc1BlcmZUaW1lbGluZVN1cHBvcnRlZCwgaXNSZWRpcmVjdEluZm9BdmFpbGFibGUgfSBmcm9tICcuLi8uLi9jb21tb24vdXRpbHMnO1xuaW1wb3J0IHsgUEFHRV9MT0FELCBSRVNPVVJDRSwgTUVBU1VSRSB9IGZyb20gJy4uLy4uL2NvbW1vbi9jb25zdGFudHMnO1xuaW1wb3J0IHsgc3RhdGUgfSBmcm9tICcuLi8uLi9zdGF0ZSc7XG5pbXBvcnQgeyBjcmVhdGVOYXZpZ2F0aW9uVGltaW5nU3BhbnMgfSBmcm9tICcuL25hdmlnYXRpb24tdGltaW5nJztcbmltcG9ydCB7IGNyZWF0ZVVzZXJUaW1pbmdTcGFucyB9IGZyb20gJy4vdXNlci10aW1pbmcnO1xuaW1wb3J0IHsgY3JlYXRlUmVzb3VyY2VUaW1pbmdTcGFucyB9IGZyb20gJy4vcmVzb3VyY2UtdGltaW5nJztcbmltcG9ydCB7IGdldFBhZ2VMb2FkTWFya3MgfSBmcm9tICcuL21hcmtzJztcblxuZnVuY3Rpb24gY2FwdHVyZU5hdmlnYXRpb24odHJhbnNhY3Rpb24pIHtcbiAgaWYgKCF0cmFuc2FjdGlvbi5jYXB0dXJlVGltaW5ncykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciB0ckVuZCA9IHRyYW5zYWN0aW9uLl9lbmQ7XG5cbiAgaWYgKHRyYW5zYWN0aW9uLnR5cGUgPT09IFBBR0VfTE9BRCkge1xuICAgIGlmICh0cmFuc2FjdGlvbi5tYXJrcyAmJiB0cmFuc2FjdGlvbi5tYXJrcy5jdXN0b20pIHtcbiAgICAgIHZhciBjdXN0b21NYXJrcyA9IHRyYW5zYWN0aW9uLm1hcmtzLmN1c3RvbTtcbiAgICAgIE9iamVjdC5rZXlzKGN1c3RvbU1hcmtzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgY3VzdG9tTWFya3Nba2V5XSArPSB0cmFuc2FjdGlvbi5fc3RhcnQ7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB2YXIgdHJTdGFydCA9IDA7XG4gICAgdHJhbnNhY3Rpb24uX3N0YXJ0ID0gdHJTdGFydDtcbiAgICB2YXIgdGltaW5ncyA9IFBFUkYudGltaW5nO1xuICAgIHZhciBiYXNlVGltZSA9IGlzUmVkaXJlY3RJbmZvQXZhaWxhYmxlKHRpbWluZ3MpID8gdGltaW5ncy5yZWRpcmVjdFN0YXJ0IDogdGltaW5ncy5mZXRjaFN0YXJ0O1xuICAgIGNyZWF0ZU5hdmlnYXRpb25UaW1pbmdTcGFucyh0aW1pbmdzLCBiYXNlVGltZSwgdHJTdGFydCwgdHJFbmQpLmZvckVhY2goZnVuY3Rpb24gKHNwYW4pIHtcbiAgICAgIHNwYW4udHJhY2VJZCA9IHRyYW5zYWN0aW9uLnRyYWNlSWQ7XG4gICAgICBzcGFuLnNhbXBsZWQgPSB0cmFuc2FjdGlvbi5zYW1wbGVkO1xuXG4gICAgICBpZiAoc3Bhbi5wYWdlUmVzcG9uc2UgJiYgdHJhbnNhY3Rpb24ub3B0aW9ucy5wYWdlTG9hZFNwYW5JZCkge1xuICAgICAgICBzcGFuLmlkID0gdHJhbnNhY3Rpb24ub3B0aW9ucy5wYWdlTG9hZFNwYW5JZDtcbiAgICAgIH1cblxuICAgICAgdHJhbnNhY3Rpb24uc3BhbnMucHVzaChzcGFuKTtcbiAgICB9KTtcbiAgICB0cmFuc2FjdGlvbi5hZGRNYXJrcyhnZXRQYWdlTG9hZE1hcmtzKHRpbWluZ3MpKTtcbiAgfVxuXG4gIGlmIChpc1BlcmZUaW1lbGluZVN1cHBvcnRlZCgpKSB7XG4gICAgdmFyIF90clN0YXJ0ID0gdHJhbnNhY3Rpb24uX3N0YXJ0O1xuICAgIHZhciByZXNvdXJjZUVudHJpZXMgPSBQRVJGLmdldEVudHJpZXNCeVR5cGUoUkVTT1VSQ0UpO1xuICAgIGNyZWF0ZVJlc291cmNlVGltaW5nU3BhbnMocmVzb3VyY2VFbnRyaWVzLCBzdGF0ZS5ib290c3RyYXBUaW1lLCBfdHJTdGFydCwgdHJFbmQpLmZvckVhY2goZnVuY3Rpb24gKHNwYW4pIHtcbiAgICAgIHJldHVybiB0cmFuc2FjdGlvbi5zcGFucy5wdXNoKHNwYW4pO1xuICAgIH0pO1xuICAgIHZhciB1c2VyRW50cmllcyA9IFBFUkYuZ2V0RW50cmllc0J5VHlwZShNRUFTVVJFKTtcbiAgICBjcmVhdGVVc2VyVGltaW5nU3BhbnModXNlckVudHJpZXMsIF90clN0YXJ0LCB0ckVuZCkuZm9yRWFjaChmdW5jdGlvbiAoc3Bhbikge1xuICAgICAgcmV0dXJuIHRyYW5zYWN0aW9uLnNwYW5zLnB1c2goc3Bhbik7XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IHsgY2FwdHVyZU5hdmlnYXRpb24sIGNyZWF0ZU5hdmlnYXRpb25UaW1pbmdTcGFucywgY3JlYXRlUmVzb3VyY2VUaW1pbmdTcGFucywgY3JlYXRlVXNlclRpbWluZ1NwYW5zLCBnZXRQYWdlTG9hZE1hcmtzIH07IiwiaW1wb3J0IHsgaXNSZWRpcmVjdEluZm9BdmFpbGFibGUgfSBmcm9tICcuLi8uLi9jb21tb24vdXRpbHMnO1xudmFyIE5BVklHQVRJT05fVElNSU5HX01BUktTID0gWydmZXRjaFN0YXJ0JywgJ2RvbWFpbkxvb2t1cFN0YXJ0JywgJ2RvbWFpbkxvb2t1cEVuZCcsICdjb25uZWN0U3RhcnQnLCAnY29ubmVjdEVuZCcsICdyZXF1ZXN0U3RhcnQnLCAncmVzcG9uc2VTdGFydCcsICdyZXNwb25zZUVuZCcsICdkb21Mb2FkaW5nJywgJ2RvbUludGVyYWN0aXZlJywgJ2RvbUNvbnRlbnRMb2FkZWRFdmVudFN0YXJ0JywgJ2RvbUNvbnRlbnRMb2FkZWRFdmVudEVuZCcsICdkb21Db21wbGV0ZScsICdsb2FkRXZlbnRTdGFydCcsICdsb2FkRXZlbnRFbmQnXTtcbnZhciBDT01QUkVTU0VEX05BVl9USU1JTkdfTUFSS1MgPSBbJ2ZzJywgJ2xzJywgJ2xlJywgJ2NzJywgJ2NlJywgJ3FzJywgJ3JzJywgJ3JlJywgJ2RsJywgJ2RpJywgJ2RzJywgJ2RlJywgJ2RjJywgJ2VzJywgJ2VlJ107XG5cbmZ1bmN0aW9uIGdldFBhZ2VMb2FkTWFya3ModGltaW5nKSB7XG4gIHZhciBtYXJrcyA9IGdldE5hdmlnYXRpb25UaW1pbmdNYXJrcyh0aW1pbmcpO1xuXG4gIGlmIChtYXJrcyA9PSBudWxsKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIG5hdmlnYXRpb25UaW1pbmc6IG1hcmtzLFxuICAgIGFnZW50OiB7XG4gICAgICB0aW1lVG9GaXJzdEJ5dGU6IG1hcmtzLnJlc3BvbnNlU3RhcnQsXG4gICAgICBkb21JbnRlcmFjdGl2ZTogbWFya3MuZG9tSW50ZXJhY3RpdmUsXG4gICAgICBkb21Db21wbGV0ZTogbWFya3MuZG9tQ29tcGxldGVcbiAgICB9XG4gIH07XG59XG5cbmZ1bmN0aW9uIGdldE5hdmlnYXRpb25UaW1pbmdNYXJrcyh0aW1pbmcpIHtcbiAgdmFyIHJlZGlyZWN0U3RhcnQgPSB0aW1pbmcucmVkaXJlY3RTdGFydCxcbiAgICAgIGZldGNoU3RhcnQgPSB0aW1pbmcuZmV0Y2hTdGFydCxcbiAgICAgIG5hdmlnYXRpb25TdGFydCA9IHRpbWluZy5uYXZpZ2F0aW9uU3RhcnQsXG4gICAgICByZXNwb25zZVN0YXJ0ID0gdGltaW5nLnJlc3BvbnNlU3RhcnQsXG4gICAgICByZXNwb25zZUVuZCA9IHRpbWluZy5yZXNwb25zZUVuZDtcblxuICBpZiAoZmV0Y2hTdGFydCA+PSBuYXZpZ2F0aW9uU3RhcnQgJiYgcmVzcG9uc2VTdGFydCA+PSBmZXRjaFN0YXJ0ICYmIHJlc3BvbnNlRW5kID49IHJlc3BvbnNlU3RhcnQpIHtcbiAgICB2YXIgbWFya3MgPSB7fTtcbiAgICBOQVZJR0FUSU9OX1RJTUlOR19NQVJLUy5mb3JFYWNoKGZ1bmN0aW9uICh0aW1pbmdLZXkpIHtcbiAgICAgIHZhciBtID0gdGltaW5nW3RpbWluZ0tleV07XG5cbiAgICAgIGlmIChtICYmIG0gPj0gZmV0Y2hTdGFydCkge1xuICAgICAgICBpZiAoaXNSZWRpcmVjdEluZm9BdmFpbGFibGUodGltaW5nKSkge1xuICAgICAgICAgIG1hcmtzW3RpbWluZ0tleV0gPSBwYXJzZUludChtIC0gcmVkaXJlY3RTdGFydCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWFya3NbdGltaW5nS2V5XSA9IHBhcnNlSW50KG0gLSBmZXRjaFN0YXJ0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBtYXJrcztcbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuXG5leHBvcnQgeyBnZXRQYWdlTG9hZE1hcmtzLCBOQVZJR0FUSU9OX1RJTUlOR19NQVJLUywgQ09NUFJFU1NFRF9OQVZfVElNSU5HX01BUktTIH07IiwiaW1wb3J0IHsgc2hvdWxkQ3JlYXRlU3BhbiB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IFNwYW4gZnJvbSAnLi4vc3Bhbic7XG52YXIgZXZlbnRQYWlycyA9IFtbJ3JlZGlyZWN0U3RhcnQnLCAncmVkaXJlY3RFbmQnLCAnUmVkaXJlY3QnXSwgWydkb21haW5Mb29rdXBTdGFydCcsICdkb21haW5Mb29rdXBFbmQnLCAnRG9tYWluIGxvb2t1cCddLCBbJ2Nvbm5lY3RTdGFydCcsICdjb25uZWN0RW5kJywgJ01ha2luZyBhIGNvbm5lY3Rpb24gdG8gdGhlIHNlcnZlciddLCBbJ3JlcXVlc3RTdGFydCcsICdyZXNwb25zZUVuZCcsICdSZXF1ZXN0aW5nIGFuZCByZWNlaXZpbmcgdGhlIGRvY3VtZW50J10sIFsnZG9tTG9hZGluZycsICdkb21JbnRlcmFjdGl2ZScsICdQYXJzaW5nIHRoZSBkb2N1bWVudCwgZXhlY3V0aW5nIHN5bmMuIHNjcmlwdHMnXSwgWydkb21Db250ZW50TG9hZGVkRXZlbnRTdGFydCcsICdkb21Db250ZW50TG9hZGVkRXZlbnRFbmQnLCAnRmlyZSBcIkRPTUNvbnRlbnRMb2FkZWRcIiBldmVudCddLCBbJ2xvYWRFdmVudFN0YXJ0JywgJ2xvYWRFdmVudEVuZCcsICdGaXJlIFwibG9hZFwiIGV2ZW50J11dO1xuXG5mdW5jdGlvbiBjcmVhdGVOYXZpZ2F0aW9uVGltaW5nU3BhbnModGltaW5ncywgYmFzZVRpbWUsIHRyU3RhcnQsIHRyRW5kKSB7XG4gIHZhciBzcGFucyA9IFtdO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZXZlbnRQYWlycy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBzdGFydCA9IHRpbWluZ3NbZXZlbnRQYWlyc1tpXVswXV07XG4gICAgdmFyIGVuZCA9IHRpbWluZ3NbZXZlbnRQYWlyc1tpXVsxXV07XG5cbiAgICBpZiAoIXNob3VsZENyZWF0ZVNwYW4oc3RhcnQsIGVuZCwgdHJTdGFydCwgdHJFbmQsIGJhc2VUaW1lKSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgdmFyIHNwYW4gPSBuZXcgU3BhbihldmVudFBhaXJzW2ldWzJdLCAnaGFyZC1uYXZpZ2F0aW9uLmJyb3dzZXItdGltaW5nJyk7XG4gICAgdmFyIGRhdGEgPSBudWxsO1xuXG4gICAgaWYgKGV2ZW50UGFpcnNbaV1bMF0gPT09ICdyZXF1ZXN0U3RhcnQnKSB7XG4gICAgICBzcGFuLnBhZ2VSZXNwb25zZSA9IHRydWU7XG4gICAgICBkYXRhID0ge1xuICAgICAgICB1cmw6IGxvY2F0aW9uLm9yaWdpblxuICAgICAgfTtcbiAgICB9XG5cbiAgICBzcGFuLl9zdGFydCA9IHN0YXJ0IC0gYmFzZVRpbWU7XG4gICAgc3Bhbi5lbmQoZW5kIC0gYmFzZVRpbWUsIGRhdGEpO1xuICAgIHNwYW5zLnB1c2goc3Bhbik7XG4gIH1cblxuICByZXR1cm4gc3BhbnM7XG59XG5cbmV4cG9ydCB7IGNyZWF0ZU5hdmlnYXRpb25UaW1pbmdTcGFucyB9OyIsImltcG9ydCB7IHN0cmlwUXVlcnlTdHJpbmdGcm9tVXJsIH0gZnJvbSAnLi4vLi4vY29tbW9uL3V0aWxzJztcbmltcG9ydCB7IHNob3VsZENyZWF0ZVNwYW4gfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IFJFU09VUkNFX0lOSVRJQVRPUl9UWVBFUyB9IGZyb20gJy4uLy4uL2NvbW1vbi9jb25zdGFudHMnO1xuaW1wb3J0IFNwYW4gZnJvbSAnLi4vc3Bhbic7XG5cbmZ1bmN0aW9uIGNyZWF0ZVJlc291cmNlVGltaW5nU3BhbihyZXNvdXJjZVRpbWluZ0VudHJ5KSB7XG4gIHZhciBuYW1lID0gcmVzb3VyY2VUaW1pbmdFbnRyeS5uYW1lLFxuICAgICAgaW5pdGlhdG9yVHlwZSA9IHJlc291cmNlVGltaW5nRW50cnkuaW5pdGlhdG9yVHlwZSxcbiAgICAgIHN0YXJ0VGltZSA9IHJlc291cmNlVGltaW5nRW50cnkuc3RhcnRUaW1lLFxuICAgICAgcmVzcG9uc2VFbmQgPSByZXNvdXJjZVRpbWluZ0VudHJ5LnJlc3BvbnNlRW5kO1xuICB2YXIga2luZCA9ICdyZXNvdXJjZSc7XG5cbiAgaWYgKGluaXRpYXRvclR5cGUpIHtcbiAgICBraW5kICs9ICcuJyArIGluaXRpYXRvclR5cGU7XG4gIH1cblxuICB2YXIgc3Bhbk5hbWUgPSBzdHJpcFF1ZXJ5U3RyaW5nRnJvbVVybChuYW1lKTtcbiAgdmFyIHNwYW4gPSBuZXcgU3BhbihzcGFuTmFtZSwga2luZCk7XG4gIHNwYW4uX3N0YXJ0ID0gc3RhcnRUaW1lO1xuICBzcGFuLmVuZChyZXNwb25zZUVuZCwge1xuICAgIHVybDogbmFtZSxcbiAgICBlbnRyeTogcmVzb3VyY2VUaW1pbmdFbnRyeVxuICB9KTtcbiAgcmV0dXJuIHNwYW47XG59XG5cbmZ1bmN0aW9uIGlzQ2FwdHVyZWRCeVBhdGNoaW5nKHJlc291cmNlU3RhcnRUaW1lLCByZXF1ZXN0UGF0Y2hUaW1lKSB7XG4gIHJldHVybiByZXF1ZXN0UGF0Y2hUaW1lICE9IG51bGwgJiYgcmVzb3VyY2VTdGFydFRpbWUgPiByZXF1ZXN0UGF0Y2hUaW1lO1xufVxuXG5mdW5jdGlvbiBpc0ludGFrZUFQSUVuZHBvaW50KHVybCkge1xuICByZXR1cm4gL2ludGFrZVxcL3ZcXGQrXFwvcnVtXFwvZXZlbnRzLy50ZXN0KHVybCk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVJlc291cmNlVGltaW5nU3BhbnMoZW50cmllcywgcmVxdWVzdFBhdGNoVGltZSwgdHJTdGFydCwgdHJFbmQpIHtcbiAgdmFyIHNwYW5zID0gW107XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbnRyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIF9lbnRyaWVzJGkgPSBlbnRyaWVzW2ldLFxuICAgICAgICBpbml0aWF0b3JUeXBlID0gX2VudHJpZXMkaS5pbml0aWF0b3JUeXBlLFxuICAgICAgICBuYW1lID0gX2VudHJpZXMkaS5uYW1lLFxuICAgICAgICBzdGFydFRpbWUgPSBfZW50cmllcyRpLnN0YXJ0VGltZSxcbiAgICAgICAgcmVzcG9uc2VFbmQgPSBfZW50cmllcyRpLnJlc3BvbnNlRW5kO1xuXG4gICAgaWYgKFJFU09VUkNFX0lOSVRJQVRPUl9UWVBFUy5pbmRleE9mKGluaXRpYXRvclR5cGUpID09PSAtMSB8fCBuYW1lID09IG51bGwpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmICgoaW5pdGlhdG9yVHlwZSA9PT0gJ3htbGh0dHByZXF1ZXN0JyB8fCBpbml0aWF0b3JUeXBlID09PSAnZmV0Y2gnKSAmJiAoaXNJbnRha2VBUElFbmRwb2ludChuYW1lKSB8fCBpc0NhcHR1cmVkQnlQYXRjaGluZyhzdGFydFRpbWUsIHJlcXVlc3RQYXRjaFRpbWUpKSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKHNob3VsZENyZWF0ZVNwYW4oc3RhcnRUaW1lLCByZXNwb25zZUVuZCwgdHJTdGFydCwgdHJFbmQpKSB7XG4gICAgICBzcGFucy5wdXNoKGNyZWF0ZVJlc291cmNlVGltaW5nU3BhbihlbnRyaWVzW2ldKSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHNwYW5zO1xufVxuXG5leHBvcnQgeyBjcmVhdGVSZXNvdXJjZVRpbWluZ1NwYW5zIH07IiwiaW1wb3J0IHsgVVNFUl9USU1JTkdfVEhSRVNIT0xEIH0gZnJvbSAnLi4vLi4vY29tbW9uL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBzaG91bGRDcmVhdGVTcGFuIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgU3BhbiBmcm9tICcuLi9zcGFuJztcblxuZnVuY3Rpb24gY3JlYXRlVXNlclRpbWluZ1NwYW5zKGVudHJpZXMsIHRyU3RhcnQsIHRyRW5kKSB7XG4gIHZhciB1c2VyVGltaW5nU3BhbnMgPSBbXTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGVudHJpZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgX2VudHJpZXMkaSA9IGVudHJpZXNbaV0sXG4gICAgICAgIG5hbWUgPSBfZW50cmllcyRpLm5hbWUsXG4gICAgICAgIHN0YXJ0VGltZSA9IF9lbnRyaWVzJGkuc3RhcnRUaW1lLFxuICAgICAgICBkdXJhdGlvbiA9IF9lbnRyaWVzJGkuZHVyYXRpb247XG4gICAgdmFyIGVuZCA9IHN0YXJ0VGltZSArIGR1cmF0aW9uO1xuXG4gICAgaWYgKGR1cmF0aW9uIDw9IFVTRVJfVElNSU5HX1RIUkVTSE9MRCB8fCAhc2hvdWxkQ3JlYXRlU3BhbihzdGFydFRpbWUsIGVuZCwgdHJTdGFydCwgdHJFbmQpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICB2YXIga2luZCA9ICdhcHAnO1xuICAgIHZhciBzcGFuID0gbmV3IFNwYW4obmFtZSwga2luZCk7XG4gICAgc3Bhbi5fc3RhcnQgPSBzdGFydFRpbWU7XG4gICAgc3Bhbi5lbmQoZW5kKTtcbiAgICB1c2VyVGltaW5nU3BhbnMucHVzaChzcGFuKTtcbiAgfVxuXG4gIHJldHVybiB1c2VyVGltaW5nU3BhbnM7XG59XG5cbmV4cG9ydCB7IGNyZWF0ZVVzZXJUaW1pbmdTcGFucyB9OyIsImltcG9ydCB7IE1BWF9TUEFOX0RVUkFUSU9OIH0gZnJvbSAnLi4vLi4vY29tbW9uL2NvbnN0YW50cyc7XG5cbmZ1bmN0aW9uIHNob3VsZENyZWF0ZVNwYW4oc3RhcnQsIGVuZCwgdHJTdGFydCwgdHJFbmQsIGJhc2VUaW1lKSB7XG4gIGlmIChiYXNlVGltZSA9PT0gdm9pZCAwKSB7XG4gICAgYmFzZVRpbWUgPSAwO1xuICB9XG5cbiAgcmV0dXJuIHR5cGVvZiBzdGFydCA9PT0gJ251bWJlcicgJiYgdHlwZW9mIGVuZCA9PT0gJ251bWJlcicgJiYgc3RhcnQgPj0gYmFzZVRpbWUgJiYgZW5kID4gc3RhcnQgJiYgc3RhcnQgLSBiYXNlVGltZSA+PSB0clN0YXJ0ICYmIGVuZCAtIGJhc2VUaW1lIDw9IHRyRW5kICYmIGVuZCAtIHN0YXJ0IDwgTUFYX1NQQU5fRFVSQVRJT04gJiYgc3RhcnQgLSBiYXNlVGltZSA8IE1BWF9TUEFOX0RVUkFUSU9OICYmIGVuZCAtIGJhc2VUaW1lIDwgTUFYX1NQQU5fRFVSQVRJT047XG59XG5cbmV4cG9ydCB7IHNob3VsZENyZWF0ZVNwYW4gfTsiLCJpbXBvcnQgeyBjaGVja1NhbWVPcmlnaW4sIGlzRHRIZWFkZXJWYWxpZCwgcGFyc2VEdEhlYWRlclZhbHVlLCBnZXREdEhlYWRlclZhbHVlLCBnZXRUU0hlYWRlclZhbHVlLCBzdHJpcFF1ZXJ5U3RyaW5nRnJvbVVybCwgc2V0UmVxdWVzdEhlYWRlciB9IGZyb20gJy4uL2NvbW1vbi91dGlscyc7XG5pbXBvcnQgeyBVcmwgfSBmcm9tICcuLi9jb21tb24vdXJsJztcbmltcG9ydCB7IHBhdGNoRXZlbnRIYW5kbGVyIH0gZnJvbSAnLi4vY29tbW9uL3BhdGNoaW5nJztcbmltcG9ydCB7IGdsb2JhbFN0YXRlIH0gZnJvbSAnLi4vY29tbW9uL3BhdGNoaW5nL3BhdGNoLXV0aWxzJztcbmltcG9ydCB7IFNDSEVEVUxFLCBJTlZPS0UsIFRSQU5TQUNUSU9OX0VORCwgQUZURVJfRVZFTlQsIEZFVENILCBISVNUT1JZLCBYTUxIVFRQUkVRVUVTVCwgSFRUUF9SRVFVRVNUX1RZUEUsIE9VVENPTUVfRkFJTFVSRSwgT1VUQ09NRV9TVUNDRVNTLCBPVVRDT01FX1VOS05PV04sIFFVRVVFX0FERF9UUkFOU0FDVElPTiB9IGZyb20gJy4uL2NvbW1vbi9jb25zdGFudHMnO1xuaW1wb3J0IHsgdHJ1bmNhdGVNb2RlbCwgU1BBTl9NT0RFTCwgVFJBTlNBQ1RJT05fTU9ERUwgfSBmcm9tICcuLi9jb21tb24vdHJ1bmNhdGUnO1xuaW1wb3J0IHsgX19ERVZfXyB9IGZyb20gJy4uL3N0YXRlJztcbnZhciBTSU1JTEFSX1NQQU5fVE9fVFJBTlNBQ1RJT05fUkFUSU8gPSAwLjA1O1xudmFyIFRSQU5TQUNUSU9OX0RVUkFUSU9OX1RIUkVTSE9MRCA9IDYwMDAwO1xuZXhwb3J0IGZ1bmN0aW9uIGdyb3VwU21hbGxDb250aW51b3VzbHlTaW1pbGFyU3BhbnMob3JpZ2luYWxTcGFucywgdHJhbnNEdXJhdGlvbiwgdGhyZXNob2xkKSB7XG4gIG9yaWdpbmFsU3BhbnMuc29ydChmdW5jdGlvbiAoc3BhbkEsIHNwYW5CKSB7XG4gICAgcmV0dXJuIHNwYW5BLl9zdGFydCAtIHNwYW5CLl9zdGFydDtcbiAgfSk7XG4gIHZhciBzcGFucyA9IFtdO1xuICB2YXIgbGFzdENvdW50ID0gMTtcbiAgb3JpZ2luYWxTcGFucy5mb3JFYWNoKGZ1bmN0aW9uIChzcGFuLCBpbmRleCkge1xuICAgIGlmIChzcGFucy5sZW5ndGggPT09IDApIHtcbiAgICAgIHNwYW5zLnB1c2goc3Bhbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBsYXN0U3BhbiA9IHNwYW5zW3NwYW5zLmxlbmd0aCAtIDFdO1xuICAgICAgdmFyIGlzQ29udGludW91c2x5U2ltaWxhciA9IGxhc3RTcGFuLnR5cGUgPT09IHNwYW4udHlwZSAmJiBsYXN0U3Bhbi5zdWJ0eXBlID09PSBzcGFuLnN1YnR5cGUgJiYgbGFzdFNwYW4uYWN0aW9uID09PSBzcGFuLmFjdGlvbiAmJiBsYXN0U3Bhbi5uYW1lID09PSBzcGFuLm5hbWUgJiYgc3Bhbi5kdXJhdGlvbigpIC8gdHJhbnNEdXJhdGlvbiA8IHRocmVzaG9sZCAmJiAoc3Bhbi5fc3RhcnQgLSBsYXN0U3Bhbi5fZW5kKSAvIHRyYW5zRHVyYXRpb24gPCB0aHJlc2hvbGQ7XG4gICAgICB2YXIgaXNMYXN0U3BhbiA9IG9yaWdpbmFsU3BhbnMubGVuZ3RoID09PSBpbmRleCArIDE7XG5cbiAgICAgIGlmIChpc0NvbnRpbnVvdXNseVNpbWlsYXIpIHtcbiAgICAgICAgbGFzdENvdW50Kys7XG4gICAgICAgIGxhc3RTcGFuLl9lbmQgPSBzcGFuLl9lbmQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChsYXN0Q291bnQgPiAxICYmICghaXNDb250aW51b3VzbHlTaW1pbGFyIHx8IGlzTGFzdFNwYW4pKSB7XG4gICAgICAgIGxhc3RTcGFuLm5hbWUgPSBsYXN0Q291bnQgKyAneCAnICsgbGFzdFNwYW4ubmFtZTtcbiAgICAgICAgbGFzdENvdW50ID0gMTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc0NvbnRpbnVvdXNseVNpbWlsYXIpIHtcbiAgICAgICAgc3BhbnMucHVzaChzcGFuKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4gc3BhbnM7XG59XG5leHBvcnQgZnVuY3Rpb24gYWRqdXN0VHJhbnNhY3Rpb24odHJhbnNhY3Rpb24pIHtcbiAgaWYgKHRyYW5zYWN0aW9uLnNhbXBsZWQpIHtcbiAgICB2YXIgZmlsdGVyZFNwYW5zID0gdHJhbnNhY3Rpb24uc3BhbnMuZmlsdGVyKGZ1bmN0aW9uIChzcGFuKSB7XG4gICAgICByZXR1cm4gc3Bhbi5kdXJhdGlvbigpID4gMCAmJiBzcGFuLl9zdGFydCA+PSB0cmFuc2FjdGlvbi5fc3RhcnQgJiYgc3Bhbi5fZW5kIDw9IHRyYW5zYWN0aW9uLl9lbmQ7XG4gICAgfSk7XG5cbiAgICBpZiAodHJhbnNhY3Rpb24uaXNNYW5hZ2VkKCkpIHtcbiAgICAgIHZhciBkdXJhdGlvbiA9IHRyYW5zYWN0aW9uLmR1cmF0aW9uKCk7XG4gICAgICB2YXIgc2ltaWxhclNwYW5zID0gZ3JvdXBTbWFsbENvbnRpbnVvdXNseVNpbWlsYXJTcGFucyhmaWx0ZXJkU3BhbnMsIGR1cmF0aW9uLCBTSU1JTEFSX1NQQU5fVE9fVFJBTlNBQ1RJT05fUkFUSU8pO1xuICAgICAgdHJhbnNhY3Rpb24uc3BhbnMgPSBzaW1pbGFyU3BhbnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyYW5zYWN0aW9uLnNwYW5zID0gZmlsdGVyZFNwYW5zO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0cmFuc2FjdGlvbi5yZXNldEZpZWxkcygpO1xuICB9XG5cbiAgcmV0dXJuIHRyYW5zYWN0aW9uO1xufVxuXG52YXIgUGVyZm9ybWFuY2VNb25pdG9yaW5nID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBQZXJmb3JtYW5jZU1vbml0b3JpbmcoYXBtU2VydmVyLCBjb25maWdTZXJ2aWNlLCBsb2dnaW5nU2VydmljZSwgdHJhbnNhY3Rpb25TZXJ2aWNlKSB7XG4gICAgdGhpcy5fYXBtU2VydmVyID0gYXBtU2VydmVyO1xuICAgIHRoaXMuX2NvbmZpZ1NlcnZpY2UgPSBjb25maWdTZXJ2aWNlO1xuICAgIHRoaXMuX2xvZ2dpblNlcnZpY2UgPSBsb2dnaW5nU2VydmljZTtcbiAgICB0aGlzLl90cmFuc2FjdGlvblNlcnZpY2UgPSB0cmFuc2FjdGlvblNlcnZpY2U7XG4gIH1cblxuICB2YXIgX3Byb3RvID0gUGVyZm9ybWFuY2VNb25pdG9yaW5nLnByb3RvdHlwZTtcblxuICBfcHJvdG8uaW5pdCA9IGZ1bmN0aW9uIGluaXQoZmxhZ3MpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKGZsYWdzID09PSB2b2lkIDApIHtcbiAgICAgIGZsYWdzID0ge307XG4gICAgfVxuXG4gICAgdGhpcy5fY29uZmlnU2VydmljZS5ldmVudHMub2JzZXJ2ZShUUkFOU0FDVElPTl9FTkQgKyBBRlRFUl9FVkVOVCwgZnVuY3Rpb24gKHRyKSB7XG4gICAgICB2YXIgcGF5bG9hZCA9IF90aGlzLmNyZWF0ZVRyYW5zYWN0aW9uUGF5bG9hZCh0cik7XG5cbiAgICAgIGlmIChwYXlsb2FkKSB7XG4gICAgICAgIF90aGlzLl9hcG1TZXJ2ZXIuYWRkVHJhbnNhY3Rpb24ocGF5bG9hZCk7XG5cbiAgICAgICAgX3RoaXMuX2NvbmZpZ1NlcnZpY2UuZGlzcGF0Y2hFdmVudChRVUVVRV9BRERfVFJBTlNBQ1RJT04pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKGZsYWdzW0hJU1RPUlldKSB7XG4gICAgICBwYXRjaEV2ZW50SGFuZGxlci5vYnNlcnZlKEhJU1RPUlksIHRoaXMuZ2V0SGlzdG9yeVN1YigpKTtcbiAgICB9XG5cbiAgICBpZiAoZmxhZ3NbWE1MSFRUUFJFUVVFU1RdKSB7XG4gICAgICBwYXRjaEV2ZW50SGFuZGxlci5vYnNlcnZlKFhNTEhUVFBSRVFVRVNULCB0aGlzLmdldFhIUlN1YigpKTtcbiAgICB9XG5cbiAgICBpZiAoZmxhZ3NbRkVUQ0hdKSB7XG4gICAgICBwYXRjaEV2ZW50SGFuZGxlci5vYnNlcnZlKEZFVENILCB0aGlzLmdldEZldGNoU3ViKCkpO1xuICAgIH1cbiAgfTtcblxuICBfcHJvdG8uZ2V0SGlzdG9yeVN1YiA9IGZ1bmN0aW9uIGdldEhpc3RvcnlTdWIoKSB7XG4gICAgdmFyIHRyYW5zYWN0aW9uU2VydmljZSA9IHRoaXMuX3RyYW5zYWN0aW9uU2VydmljZTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGV2ZW50LCB0YXNrKSB7XG4gICAgICBpZiAodGFzay5zb3VyY2UgPT09IEhJU1RPUlkgJiYgZXZlbnQgPT09IElOVk9LRSkge1xuICAgICAgICB0cmFuc2FjdGlvblNlcnZpY2Uuc3RhcnRUcmFuc2FjdGlvbih0YXNrLmRhdGEudGl0bGUsICdyb3V0ZS1jaGFuZ2UnLCB7XG4gICAgICAgICAgbWFuYWdlZDogdHJ1ZSxcbiAgICAgICAgICBjYW5SZXVzZTogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xuXG4gIF9wcm90by5nZXRYSFJTdWIgPSBmdW5jdGlvbiBnZXRYSFJTdWIoKSB7XG4gICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKGV2ZW50LCB0YXNrKSB7XG4gICAgICBpZiAodGFzay5zb3VyY2UgPT09IFhNTEhUVFBSRVFVRVNUICYmICFnbG9iYWxTdGF0ZS5mZXRjaEluUHJvZ3Jlc3MpIHtcbiAgICAgICAgX3RoaXMyLnByb2Nlc3NBUElDYWxscyhldmVudCwgdGFzayk7XG4gICAgICB9XG4gICAgfTtcbiAgfTtcblxuICBfcHJvdG8uZ2V0RmV0Y2hTdWIgPSBmdW5jdGlvbiBnZXRGZXRjaFN1YigpIHtcbiAgICB2YXIgX3RoaXMzID0gdGhpcztcblxuICAgIHJldHVybiBmdW5jdGlvbiAoZXZlbnQsIHRhc2spIHtcbiAgICAgIGlmICh0YXNrLnNvdXJjZSA9PT0gRkVUQ0gpIHtcbiAgICAgICAgX3RoaXMzLnByb2Nlc3NBUElDYWxscyhldmVudCwgdGFzayk7XG4gICAgICB9XG4gICAgfTtcbiAgfTtcblxuICBfcHJvdG8ucHJvY2Vzc0FQSUNhbGxzID0gZnVuY3Rpb24gcHJvY2Vzc0FQSUNhbGxzKGV2ZW50LCB0YXNrKSB7XG4gICAgdmFyIGNvbmZpZ1NlcnZpY2UgPSB0aGlzLl9jb25maWdTZXJ2aWNlO1xuICAgIHZhciB0cmFuc2FjdGlvblNlcnZpY2UgPSB0aGlzLl90cmFuc2FjdGlvblNlcnZpY2U7XG5cbiAgICBpZiAodGFzay5kYXRhICYmIHRhc2suZGF0YS51cmwpIHtcbiAgICAgIHZhciBlbmRwb2ludHMgPSB0aGlzLl9hcG1TZXJ2ZXIuZ2V0RW5kcG9pbnRzKCk7XG5cbiAgICAgIHZhciBpc093bkVuZHBvaW50ID0gT2JqZWN0LmtleXMoZW5kcG9pbnRzKS5zb21lKGZ1bmN0aW9uIChlbmRwb2ludCkge1xuICAgICAgICByZXR1cm4gdGFzay5kYXRhLnVybC5pbmRleE9mKGVuZHBvaW50c1tlbmRwb2ludF0pICE9PSAtMTtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoaXNPd25FbmRwb2ludCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGV2ZW50ID09PSBTQ0hFRFVMRSAmJiB0YXNrLmRhdGEpIHtcbiAgICAgIHZhciBkYXRhID0gdGFzay5kYXRhO1xuICAgICAgdmFyIHJlcXVlc3RVcmwgPSBuZXcgVXJsKGRhdGEudXJsKTtcbiAgICAgIHZhciBzcGFuTmFtZSA9IGRhdGEubWV0aG9kICsgJyAnICsgKHJlcXVlc3RVcmwucmVsYXRpdmUgPyByZXF1ZXN0VXJsLnBhdGggOiBzdHJpcFF1ZXJ5U3RyaW5nRnJvbVVybChyZXF1ZXN0VXJsLmhyZWYpKTtcblxuICAgICAgaWYgKCF0cmFuc2FjdGlvblNlcnZpY2UuZ2V0Q3VycmVudFRyYW5zYWN0aW9uKCkpIHtcbiAgICAgICAgdHJhbnNhY3Rpb25TZXJ2aWNlLnN0YXJ0VHJhbnNhY3Rpb24oc3Bhbk5hbWUsIEhUVFBfUkVRVUVTVF9UWVBFLCB7XG4gICAgICAgICAgbWFuYWdlZDogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgdmFyIHNwYW4gPSB0cmFuc2FjdGlvblNlcnZpY2Uuc3RhcnRTcGFuKHNwYW5OYW1lLCAnZXh0ZXJuYWwuaHR0cCcsIHtcbiAgICAgICAgYmxvY2tpbmc6IHRydWVcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoIXNwYW4pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgaXNEdEVuYWJsZWQgPSBjb25maWdTZXJ2aWNlLmdldCgnZGlzdHJpYnV0ZWRUcmFjaW5nJyk7XG4gICAgICB2YXIgZHRPcmlnaW5zID0gY29uZmlnU2VydmljZS5nZXQoJ2Rpc3RyaWJ1dGVkVHJhY2luZ09yaWdpbnMnKTtcbiAgICAgIHZhciBjdXJyZW50VXJsID0gbmV3IFVybCh3aW5kb3cubG9jYXRpb24uaHJlZik7XG4gICAgICB2YXIgaXNTYW1lT3JpZ2luID0gY2hlY2tTYW1lT3JpZ2luKHJlcXVlc3RVcmwub3JpZ2luLCBjdXJyZW50VXJsLm9yaWdpbikgfHwgY2hlY2tTYW1lT3JpZ2luKHJlcXVlc3RVcmwub3JpZ2luLCBkdE9yaWdpbnMpO1xuICAgICAgdmFyIHRhcmdldCA9IGRhdGEudGFyZ2V0O1xuXG4gICAgICBpZiAoaXNEdEVuYWJsZWQgJiYgaXNTYW1lT3JpZ2luICYmIHRhcmdldCkge1xuICAgICAgICB0aGlzLmluamVjdER0SGVhZGVyKHNwYW4sIHRhcmdldCk7XG4gICAgICAgIHZhciBwcm9wYWdhdGVUcmFjZXN0YXRlID0gY29uZmlnU2VydmljZS5nZXQoJ3Byb3BhZ2F0ZVRyYWNlc3RhdGUnKTtcblxuICAgICAgICBpZiAocHJvcGFnYXRlVHJhY2VzdGF0ZSkge1xuICAgICAgICAgIHRoaXMuaW5qZWN0VFNIZWFkZXIoc3BhbiwgdGFyZ2V0KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChfX0RFVl9fKSB7XG4gICAgICAgIHRoaXMuX2xvZ2dpblNlcnZpY2UuZGVidWcoXCJDb3VsZCBub3QgaW5qZWN0IGRpc3RyaWJ1dGVkIHRyYWNpbmcgaGVhZGVyIHRvIHRoZSByZXF1ZXN0IG9yaWdpbiAoJ1wiICsgcmVxdWVzdFVybC5vcmlnaW4gKyBcIicpIGZyb20gdGhlIGN1cnJlbnQgb3JpZ2luICgnXCIgKyBjdXJyZW50VXJsLm9yaWdpbiArIFwiJylcIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChkYXRhLnN5bmMpIHtcbiAgICAgICAgc3Bhbi5zeW5jID0gZGF0YS5zeW5jO1xuICAgICAgfVxuXG4gICAgICBkYXRhLnNwYW4gPSBzcGFuO1xuICAgIH0gZWxzZSBpZiAoZXZlbnQgPT09IElOVk9LRSkge1xuICAgICAgdmFyIF9kYXRhID0gdGFzay5kYXRhO1xuXG4gICAgICBpZiAoX2RhdGEgJiYgX2RhdGEuc3Bhbikge1xuICAgICAgICB2YXIgX3NwYW4gPSBfZGF0YS5zcGFuLFxuICAgICAgICAgICAgcmVzcG9uc2UgPSBfZGF0YS5yZXNwb25zZSxcbiAgICAgICAgICAgIF90YXJnZXQgPSBfZGF0YS50YXJnZXQ7XG4gICAgICAgIHZhciBzdGF0dXM7XG5cbiAgICAgICAgaWYgKHJlc3BvbnNlKSB7XG4gICAgICAgICAgc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN0YXR1cyA9IF90YXJnZXQuc3RhdHVzO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG91dGNvbWU7XG5cbiAgICAgICAgaWYgKF9kYXRhLnN0YXR1cyAhPSAnYWJvcnQnICYmICFfZGF0YS5hYm9ydGVkKSB7XG4gICAgICAgICAgaWYgKHN0YXR1cyA+PSA0MDAgfHwgc3RhdHVzID09IDApIHtcbiAgICAgICAgICAgIG91dGNvbWUgPSBPVVRDT01FX0ZBSUxVUkU7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG91dGNvbWUgPSBPVVRDT01FX1NVQ0NFU1M7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG91dGNvbWUgPSBPVVRDT01FX1VOS05PV047XG4gICAgICAgIH1cblxuICAgICAgICBfc3Bhbi5vdXRjb21lID0gb3V0Y29tZTtcbiAgICAgICAgdmFyIHRyID0gdHJhbnNhY3Rpb25TZXJ2aWNlLmdldEN1cnJlbnRUcmFuc2FjdGlvbigpO1xuXG4gICAgICAgIGlmICh0ciAmJiB0ci50eXBlID09PSBIVFRQX1JFUVVFU1RfVFlQRSkge1xuICAgICAgICAgIHRyLm91dGNvbWUgPSBvdXRjb21lO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJhbnNhY3Rpb25TZXJ2aWNlLmVuZFNwYW4oX3NwYW4sIF9kYXRhKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgX3Byb3RvLmluamVjdER0SGVhZGVyID0gZnVuY3Rpb24gaW5qZWN0RHRIZWFkZXIoc3BhbiwgdGFyZ2V0KSB7XG4gICAgdmFyIGhlYWRlck5hbWUgPSB0aGlzLl9jb25maWdTZXJ2aWNlLmdldCgnZGlzdHJpYnV0ZWRUcmFjaW5nSGVhZGVyTmFtZScpO1xuXG4gICAgdmFyIGhlYWRlclZhbHVlID0gZ2V0RHRIZWFkZXJWYWx1ZShzcGFuKTtcbiAgICB2YXIgaXNIZWFkZXJWYWxpZCA9IGlzRHRIZWFkZXJWYWxpZChoZWFkZXJWYWx1ZSk7XG5cbiAgICBpZiAoaXNIZWFkZXJWYWxpZCAmJiBoZWFkZXJWYWx1ZSAmJiBoZWFkZXJOYW1lKSB7XG4gICAgICBzZXRSZXF1ZXN0SGVhZGVyKHRhcmdldCwgaGVhZGVyTmFtZSwgaGVhZGVyVmFsdWUpO1xuICAgIH1cbiAgfTtcblxuICBfcHJvdG8uaW5qZWN0VFNIZWFkZXIgPSBmdW5jdGlvbiBpbmplY3RUU0hlYWRlcihzcGFuLCB0YXJnZXQpIHtcbiAgICB2YXIgaGVhZGVyVmFsdWUgPSBnZXRUU0hlYWRlclZhbHVlKHNwYW4pO1xuXG4gICAgaWYgKGhlYWRlclZhbHVlKSB7XG4gICAgICBzZXRSZXF1ZXN0SGVhZGVyKHRhcmdldCwgJ3RyYWNlc3RhdGUnLCBoZWFkZXJWYWx1ZSk7XG4gICAgfVxuICB9O1xuXG4gIF9wcm90by5leHRyYWN0RHRIZWFkZXIgPSBmdW5jdGlvbiBleHRyYWN0RHRIZWFkZXIodGFyZ2V0KSB7XG4gICAgdmFyIGNvbmZpZ1NlcnZpY2UgPSB0aGlzLl9jb25maWdTZXJ2aWNlO1xuICAgIHZhciBoZWFkZXJOYW1lID0gY29uZmlnU2VydmljZS5nZXQoJ2Rpc3RyaWJ1dGVkVHJhY2luZ0hlYWRlck5hbWUnKTtcblxuICAgIGlmICh0YXJnZXQpIHtcbiAgICAgIHJldHVybiBwYXJzZUR0SGVhZGVyVmFsdWUodGFyZ2V0W2hlYWRlck5hbWVdKTtcbiAgICB9XG4gIH07XG5cbiAgX3Byb3RvLmZpbHRlclRyYW5zYWN0aW9uID0gZnVuY3Rpb24gZmlsdGVyVHJhbnNhY3Rpb24odHIpIHtcbiAgICB2YXIgZHVyYXRpb24gPSB0ci5kdXJhdGlvbigpO1xuXG4gICAgaWYgKCFkdXJhdGlvbikge1xuICAgICAgaWYgKF9fREVWX18pIHtcbiAgICAgICAgdmFyIG1lc3NhZ2UgPSBcInRyYW5zYWN0aW9uKFwiICsgdHIuaWQgKyBcIiwgXCIgKyB0ci5uYW1lICsgXCIpIHdhcyBkaXNjYXJkZWQhIFwiO1xuXG4gICAgICAgIGlmIChkdXJhdGlvbiA9PT0gMCkge1xuICAgICAgICAgIG1lc3NhZ2UgKz0gXCJUcmFuc2FjdGlvbiBkdXJhdGlvbiBpcyAwXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWVzc2FnZSArPSBcIlRyYW5zYWN0aW9uIHdhc24ndCBlbmRlZFwiO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fbG9nZ2luU2VydmljZS5kZWJ1ZyhtZXNzYWdlKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmICh0ci5pc01hbmFnZWQoKSkge1xuICAgICAgaWYgKGR1cmF0aW9uID4gVFJBTlNBQ1RJT05fRFVSQVRJT05fVEhSRVNIT0xEKSB7XG4gICAgICAgIGlmIChfX0RFVl9fKSB7XG4gICAgICAgICAgdGhpcy5fbG9nZ2luU2VydmljZS5kZWJ1ZyhcInRyYW5zYWN0aW9uKFwiICsgdHIuaWQgKyBcIiwgXCIgKyB0ci5uYW1lICsgXCIpIHdhcyBkaXNjYXJkZWQhIFRyYW5zYWN0aW9uIGR1cmF0aW9uIChcIiArIGR1cmF0aW9uICsgXCIpIGlzIGdyZWF0ZXIgdGhhbiBtYW5hZ2VkIHRyYW5zYWN0aW9uIHRocmVzaG9sZCAoXCIgKyBUUkFOU0FDVElPTl9EVVJBVElPTl9USFJFU0hPTEQgKyBcIilcIik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmICh0ci5zYW1wbGVkICYmIHRyLnNwYW5zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBpZiAoX19ERVZfXykge1xuICAgICAgICAgIHRoaXMuX2xvZ2dpblNlcnZpY2UuZGVidWcoXCJ0cmFuc2FjdGlvbihcIiArIHRyLmlkICsgXCIsIFwiICsgdHIubmFtZSArIFwiKSB3YXMgZGlzY2FyZGVkISBUcmFuc2FjdGlvbiBkb2VzIG5vdCBoYXZlIGFueSBzcGFuc1wiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICBfcHJvdG8uY3JlYXRlVHJhbnNhY3Rpb25EYXRhTW9kZWwgPSBmdW5jdGlvbiBjcmVhdGVUcmFuc2FjdGlvbkRhdGFNb2RlbCh0cmFuc2FjdGlvbikge1xuICAgIHZhciB0cmFuc2FjdGlvblN0YXJ0ID0gdHJhbnNhY3Rpb24uX3N0YXJ0O1xuICAgIHZhciBzcGFucyA9IHRyYW5zYWN0aW9uLnNwYW5zLm1hcChmdW5jdGlvbiAoc3Bhbikge1xuICAgICAgdmFyIHNwYW5EYXRhID0ge1xuICAgICAgICBpZDogc3Bhbi5pZCxcbiAgICAgICAgdHJhbnNhY3Rpb25faWQ6IHRyYW5zYWN0aW9uLmlkLFxuICAgICAgICBwYXJlbnRfaWQ6IHNwYW4ucGFyZW50SWQgfHwgdHJhbnNhY3Rpb24uaWQsXG4gICAgICAgIHRyYWNlX2lkOiB0cmFuc2FjdGlvbi50cmFjZUlkLFxuICAgICAgICBuYW1lOiBzcGFuLm5hbWUsXG4gICAgICAgIHR5cGU6IHNwYW4udHlwZSxcbiAgICAgICAgc3VidHlwZTogc3Bhbi5zdWJ0eXBlLFxuICAgICAgICBhY3Rpb246IHNwYW4uYWN0aW9uLFxuICAgICAgICBzeW5jOiBzcGFuLnN5bmMsXG4gICAgICAgIHN0YXJ0OiBwYXJzZUludChzcGFuLl9zdGFydCAtIHRyYW5zYWN0aW9uU3RhcnQpLFxuICAgICAgICBkdXJhdGlvbjogc3Bhbi5kdXJhdGlvbigpLFxuICAgICAgICBjb250ZXh0OiBzcGFuLmNvbnRleHQsXG4gICAgICAgIG91dGNvbWU6IHNwYW4ub3V0Y29tZSxcbiAgICAgICAgc2FtcGxlX3JhdGU6IHNwYW4uc2FtcGxlUmF0ZVxuICAgICAgfTtcbiAgICAgIHJldHVybiB0cnVuY2F0ZU1vZGVsKFNQQU5fTU9ERUwsIHNwYW5EYXRhKTtcbiAgICB9KTtcbiAgICB2YXIgdHJhbnNhY3Rpb25EYXRhID0ge1xuICAgICAgaWQ6IHRyYW5zYWN0aW9uLmlkLFxuICAgICAgdHJhY2VfaWQ6IHRyYW5zYWN0aW9uLnRyYWNlSWQsXG4gICAgICBzZXNzaW9uOiB0cmFuc2FjdGlvbi5zZXNzaW9uLFxuICAgICAgbmFtZTogdHJhbnNhY3Rpb24ubmFtZSxcbiAgICAgIHR5cGU6IHRyYW5zYWN0aW9uLnR5cGUsXG4gICAgICBkdXJhdGlvbjogdHJhbnNhY3Rpb24uZHVyYXRpb24oKSxcbiAgICAgIHNwYW5zOiBzcGFucyxcbiAgICAgIGNvbnRleHQ6IHRyYW5zYWN0aW9uLmNvbnRleHQsXG4gICAgICBtYXJrczogdHJhbnNhY3Rpb24ubWFya3MsXG4gICAgICBicmVha2Rvd246IHRyYW5zYWN0aW9uLmJyZWFrZG93blRpbWluZ3MsXG4gICAgICBzcGFuX2NvdW50OiB7XG4gICAgICAgIHN0YXJ0ZWQ6IHNwYW5zLmxlbmd0aFxuICAgICAgfSxcbiAgICAgIHNhbXBsZWQ6IHRyYW5zYWN0aW9uLnNhbXBsZWQsXG4gICAgICBzYW1wbGVfcmF0ZTogdHJhbnNhY3Rpb24uc2FtcGxlUmF0ZSxcbiAgICAgIGV4cGVyaWVuY2U6IHRyYW5zYWN0aW9uLmV4cGVyaWVuY2UsXG4gICAgICBvdXRjb21lOiB0cmFuc2FjdGlvbi5vdXRjb21lXG4gICAgfTtcbiAgICByZXR1cm4gdHJ1bmNhdGVNb2RlbChUUkFOU0FDVElPTl9NT0RFTCwgdHJhbnNhY3Rpb25EYXRhKTtcbiAgfTtcblxuICBfcHJvdG8uY3JlYXRlVHJhbnNhY3Rpb25QYXlsb2FkID0gZnVuY3Rpb24gY3JlYXRlVHJhbnNhY3Rpb25QYXlsb2FkKHRyYW5zYWN0aW9uKSB7XG4gICAgdmFyIGFkanVzdGVkVHJhbnNhY3Rpb24gPSBhZGp1c3RUcmFuc2FjdGlvbih0cmFuc2FjdGlvbik7XG4gICAgdmFyIGZpbHRlcmVkID0gdGhpcy5maWx0ZXJUcmFuc2FjdGlvbihhZGp1c3RlZFRyYW5zYWN0aW9uKTtcblxuICAgIGlmIChmaWx0ZXJlZCkge1xuICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlVHJhbnNhY3Rpb25EYXRhTW9kZWwodHJhbnNhY3Rpb24pO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gUGVyZm9ybWFuY2VNb25pdG9yaW5nO1xufSgpO1xuXG5leHBvcnQgeyBQZXJmb3JtYW5jZU1vbml0b3JpbmcgYXMgZGVmYXVsdCB9OyIsImltcG9ydCB7IGdlbmVyYXRlUmFuZG9tSWQsIHNldExhYmVsLCBtZXJnZSwgZ2V0RHVyYXRpb24sIGdldFRpbWUgfSBmcm9tICcuLi9jb21tb24vdXRpbHMnO1xuaW1wb3J0IHsgTkFNRV9VTktOT1dOLCBUWVBFX0NVU1RPTSB9IGZyb20gJy4uL2NvbW1vbi9jb25zdGFudHMnO1xuXG52YXIgU3BhbkJhc2UgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIFNwYW5CYXNlKG5hbWUsIHR5cGUsIG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7XG4gICAgICBvcHRpb25zID0ge307XG4gICAgfVxuXG4gICAgaWYgKCFuYW1lKSB7XG4gICAgICBuYW1lID0gTkFNRV9VTktOT1dOO1xuICAgIH1cblxuICAgIGlmICghdHlwZSkge1xuICAgICAgdHlwZSA9IFRZUEVfQ1VTVE9NO1xuICAgIH1cblxuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIHRoaXMuaWQgPSBvcHRpb25zLmlkIHx8IGdlbmVyYXRlUmFuZG9tSWQoMTYpO1xuICAgIHRoaXMudHJhY2VJZCA9IG9wdGlvbnMudHJhY2VJZDtcbiAgICB0aGlzLnNhbXBsZWQgPSBvcHRpb25zLnNhbXBsZWQ7XG4gICAgdGhpcy5zYW1wbGVSYXRlID0gb3B0aW9ucy5zYW1wbGVSYXRlO1xuICAgIHRoaXMudGltZXN0YW1wID0gb3B0aW9ucy50aW1lc3RhbXA7XG4gICAgdGhpcy5fc3RhcnQgPSBnZXRUaW1lKG9wdGlvbnMuc3RhcnRUaW1lKTtcbiAgICB0aGlzLl9lbmQgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5lbmRlZCA9IGZhbHNlO1xuICAgIHRoaXMub3V0Y29tZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLm9uRW5kID0gb3B0aW9ucy5vbkVuZDtcbiAgfVxuXG4gIHZhciBfcHJvdG8gPSBTcGFuQmFzZS5wcm90b3R5cGU7XG5cbiAgX3Byb3RvLmVuc3VyZUNvbnRleHQgPSBmdW5jdGlvbiBlbnN1cmVDb250ZXh0KCkge1xuICAgIGlmICghdGhpcy5jb250ZXh0KSB7XG4gICAgICB0aGlzLmNvbnRleHQgPSB7fTtcbiAgICB9XG4gIH07XG5cbiAgX3Byb3RvLmFkZExhYmVscyA9IGZ1bmN0aW9uIGFkZExhYmVscyh0YWdzKSB7XG4gICAgdGhpcy5lbnN1cmVDb250ZXh0KCk7XG4gICAgdmFyIGN0eCA9IHRoaXMuY29udGV4dDtcblxuICAgIGlmICghY3R4LnRhZ3MpIHtcbiAgICAgIGN0eC50YWdzID0ge307XG4gICAgfVxuXG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh0YWdzKTtcbiAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24gKGspIHtcbiAgICAgIHJldHVybiBzZXRMYWJlbChrLCB0YWdzW2tdLCBjdHgudGFncyk7XG4gICAgfSk7XG4gIH07XG5cbiAgX3Byb3RvLmFkZENvbnRleHQgPSBmdW5jdGlvbiBhZGRDb250ZXh0KCkge1xuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBjb250ZXh0ID0gbmV3IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgY29udGV4dFtfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG5cbiAgICBpZiAoY29udGV4dC5sZW5ndGggPT09IDApIHJldHVybjtcbiAgICB0aGlzLmVuc3VyZUNvbnRleHQoKTtcbiAgICBtZXJnZS5hcHBseSh2b2lkIDAsIFt0aGlzLmNvbnRleHRdLmNvbmNhdChjb250ZXh0KSk7XG4gIH07XG5cbiAgX3Byb3RvLmVuZCA9IGZ1bmN0aW9uIGVuZChlbmRUaW1lKSB7XG4gICAgaWYgKHRoaXMuZW5kZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmVuZGVkID0gdHJ1ZTtcbiAgICB0aGlzLl9lbmQgPSBnZXRUaW1lKGVuZFRpbWUpO1xuICAgIHRoaXMuY2FsbE9uRW5kKCk7XG4gIH07XG5cbiAgX3Byb3RvLmNhbGxPbkVuZCA9IGZ1bmN0aW9uIGNhbGxPbkVuZCgpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMub25FbmQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXMub25FbmQodGhpcyk7XG4gICAgfVxuICB9O1xuXG4gIF9wcm90by5kdXJhdGlvbiA9IGZ1bmN0aW9uIGR1cmF0aW9uKCkge1xuICAgIHJldHVybiBnZXREdXJhdGlvbih0aGlzLl9zdGFydCwgdGhpcy5fZW5kKTtcbiAgfTtcblxuICByZXR1cm4gU3BhbkJhc2U7XG59KCk7XG5cbmV4cG9ydCBkZWZhdWx0IFNwYW5CYXNlOyIsImZ1bmN0aW9uIF9pbmhlcml0c0xvb3NlKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcy5wcm90b3R5cGUpOyBzdWJDbGFzcy5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBzdWJDbGFzczsgX3NldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKTsgfVxuXG5mdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBfc2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHsgby5fX3Byb3RvX18gPSBwOyByZXR1cm4gbzsgfTsgcmV0dXJuIF9zZXRQcm90b3R5cGVPZihvLCBwKTsgfVxuXG5pbXBvcnQgU3BhbkJhc2UgZnJvbSAnLi9zcGFuLWJhc2UnO1xuaW1wb3J0IHsgYWRkU3BhbkNvbnRleHQgfSBmcm9tICcuLi9jb21tb24vY29udGV4dCc7XG5cbnZhciBTcGFuID0gZnVuY3Rpb24gKF9TcGFuQmFzZSkge1xuICBfaW5oZXJpdHNMb29zZShTcGFuLCBfU3BhbkJhc2UpO1xuXG4gIGZ1bmN0aW9uIFNwYW4obmFtZSwgdHlwZSwgb3B0aW9ucykge1xuICAgIHZhciBfdGhpcztcblxuICAgIF90aGlzID0gX1NwYW5CYXNlLmNhbGwodGhpcywgbmFtZSwgdHlwZSwgb3B0aW9ucykgfHwgdGhpcztcbiAgICBfdGhpcy5wYXJlbnRJZCA9IF90aGlzLm9wdGlvbnMucGFyZW50SWQ7XG4gICAgX3RoaXMuc3VidHlwZSA9IHVuZGVmaW5lZDtcbiAgICBfdGhpcy5hY3Rpb24gPSB1bmRlZmluZWQ7XG5cbiAgICBpZiAoX3RoaXMudHlwZS5pbmRleE9mKCcuJykgIT09IC0xKSB7XG4gICAgICB2YXIgZmllbGRzID0gX3RoaXMudHlwZS5zcGxpdCgnLicsIDMpO1xuXG4gICAgICBfdGhpcy50eXBlID0gZmllbGRzWzBdO1xuICAgICAgX3RoaXMuc3VidHlwZSA9IGZpZWxkc1sxXTtcbiAgICAgIF90aGlzLmFjdGlvbiA9IGZpZWxkc1syXTtcbiAgICB9XG5cbiAgICBfdGhpcy5zeW5jID0gX3RoaXMub3B0aW9ucy5zeW5jO1xuICAgIHJldHVybiBfdGhpcztcbiAgfVxuXG4gIHZhciBfcHJvdG8gPSBTcGFuLnByb3RvdHlwZTtcblxuICBfcHJvdG8uZW5kID0gZnVuY3Rpb24gZW5kKGVuZFRpbWUsIGRhdGEpIHtcbiAgICBfU3BhbkJhc2UucHJvdG90eXBlLmVuZC5jYWxsKHRoaXMsIGVuZFRpbWUpO1xuXG4gICAgYWRkU3BhbkNvbnRleHQodGhpcywgZGF0YSk7XG4gIH07XG5cbiAgcmV0dXJuIFNwYW47XG59KFNwYW5CYXNlKTtcblxuZXhwb3J0IGRlZmF1bHQgU3BhbjsiLCJpbXBvcnQgeyBQcm9taXNlIH0gZnJvbSAnLi4vY29tbW9uL3BvbHlmaWxscyc7XG5pbXBvcnQgVHJhbnNhY3Rpb24gZnJvbSAnLi90cmFuc2FjdGlvbic7XG5pbXBvcnQgeyBQZXJmRW50cnlSZWNvcmRlciwgY2FwdHVyZU9ic2VydmVyRW50cmllcywgbWV0cmljcywgY3JlYXRlVG90YWxCbG9ja2luZ1RpbWVTcGFuIH0gZnJvbSAnLi9tZXRyaWNzJztcbmltcG9ydCB7IGV4dGVuZCwgZ2V0RWFybGllc3RTcGFuLCBnZXRMYXRlc3ROb25YSFJTcGFuLCBnZXRMYXRlc3RYSFJTcGFuLCBpc1BlcmZUeXBlU3VwcG9ydGVkLCBnZW5lcmF0ZVJhbmRvbUlkIH0gZnJvbSAnLi4vY29tbW9uL3V0aWxzJztcbmltcG9ydCB7IGNhcHR1cmVOYXZpZ2F0aW9uIH0gZnJvbSAnLi9uYXZpZ2F0aW9uL2NhcHR1cmUtbmF2aWdhdGlvbic7XG5pbXBvcnQgeyBQQUdFX0xPQUQsIE5BTUVfVU5LTk9XTiwgVFJBTlNBQ1RJT05fU1RBUlQsIFRSQU5TQUNUSU9OX0VORCwgVEVNUE9SQVJZX1RZUEUsIFRSQU5TQUNUSU9OX1RZUEVfT1JERVIsIExBUkdFU1RfQ09OVEVOVEZVTF9QQUlOVCwgTE9OR19UQVNLLCBQQUlOVCwgVFJVTkNBVEVEX1RZUEUsIEZJUlNUX0lOUFVULCBMQVlPVVRfU0hJRlQsIFNFU1NJT05fVElNRU9VVCwgUEFHRV9MT0FEX0RFTEFZIH0gZnJvbSAnLi4vY29tbW9uL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBhZGRUcmFuc2FjdGlvbkNvbnRleHQgfSBmcm9tICcuLi9jb21tb24vY29udGV4dCc7XG5pbXBvcnQgeyBfX0RFVl9fLCBzdGF0ZSB9IGZyb20gJy4uL3N0YXRlJztcbmltcG9ydCB7IHNsdWdpZnlVcmwgfSBmcm9tICcuLi9jb21tb24vdXJsJztcblxudmFyIFRyYW5zYWN0aW9uU2VydmljZSA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gVHJhbnNhY3Rpb25TZXJ2aWNlKGxvZ2dlciwgY29uZmlnKSB7XG4gICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgIHRoaXMuX2NvbmZpZyA9IGNvbmZpZztcbiAgICB0aGlzLl9sb2dnZXIgPSBsb2dnZXI7XG4gICAgdGhpcy5jdXJyZW50VHJhbnNhY3Rpb24gPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5yZXNwSW50ZXJ2YWxJZCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLnJlY29yZGVyID0gbmV3IFBlcmZFbnRyeVJlY29yZGVyKGZ1bmN0aW9uIChsaXN0KSB7XG4gICAgICB2YXIgdHIgPSBfdGhpcy5nZXRDdXJyZW50VHJhbnNhY3Rpb24oKTtcblxuICAgICAgaWYgKHRyICYmIHRyLmNhcHR1cmVUaW1pbmdzKSB7XG4gICAgICAgIHZhciBfdHIkc3BhbnM7XG5cbiAgICAgICAgdmFyIGlzSGFyZE5hdmlnYXRpb24gPSB0ci50eXBlID09PSBQQUdFX0xPQUQ7XG5cbiAgICAgICAgdmFyIF9jYXB0dXJlT2JzZXJ2ZXJFbnRyaSA9IGNhcHR1cmVPYnNlcnZlckVudHJpZXMobGlzdCwge1xuICAgICAgICAgIGlzSGFyZE5hdmlnYXRpb246IGlzSGFyZE5hdmlnYXRpb24sXG4gICAgICAgICAgdHJTdGFydDogaXNIYXJkTmF2aWdhdGlvbiA/IDAgOiB0ci5fc3RhcnRcbiAgICAgICAgfSksXG4gICAgICAgICAgICBzcGFucyA9IF9jYXB0dXJlT2JzZXJ2ZXJFbnRyaS5zcGFucyxcbiAgICAgICAgICAgIG1hcmtzID0gX2NhcHR1cmVPYnNlcnZlckVudHJpLm1hcmtzO1xuXG4gICAgICAgIChfdHIkc3BhbnMgPSB0ci5zcGFucykucHVzaC5hcHBseShfdHIkc3BhbnMsIHNwYW5zKTtcblxuICAgICAgICB0ci5hZGRNYXJrcyh7XG4gICAgICAgICAgYWdlbnQ6IG1hcmtzXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgdmFyIF9wcm90byA9IFRyYW5zYWN0aW9uU2VydmljZS5wcm90b3R5cGU7XG5cbiAgX3Byb3RvLmNyZWF0ZUN1cnJlbnRUcmFuc2FjdGlvbiA9IGZ1bmN0aW9uIGNyZWF0ZUN1cnJlbnRUcmFuc2FjdGlvbihuYW1lLCB0eXBlLCBvcHRpb25zKSB7XG4gICAgdmFyIHRyID0gbmV3IFRyYW5zYWN0aW9uKG5hbWUsIHR5cGUsIG9wdGlvbnMpO1xuICAgIHRoaXMuY3VycmVudFRyYW5zYWN0aW9uID0gdHI7XG4gICAgcmV0dXJuIHRyO1xuICB9O1xuXG4gIF9wcm90by5nZXRDdXJyZW50VHJhbnNhY3Rpb24gPSBmdW5jdGlvbiBnZXRDdXJyZW50VHJhbnNhY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuY3VycmVudFRyYW5zYWN0aW9uICYmICF0aGlzLmN1cnJlbnRUcmFuc2FjdGlvbi5lbmRlZCkge1xuICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFRyYW5zYWN0aW9uO1xuICAgIH1cbiAgfTtcblxuICBfcHJvdG8uY3JlYXRlT3B0aW9ucyA9IGZ1bmN0aW9uIGNyZWF0ZU9wdGlvbnMob3B0aW9ucykge1xuICAgIHZhciBjb25maWcgPSB0aGlzLl9jb25maWcuY29uZmlnO1xuICAgIHZhciBwcmVzZXRPcHRpb25zID0ge1xuICAgICAgdHJhbnNhY3Rpb25TYW1wbGVSYXRlOiBjb25maWcudHJhbnNhY3Rpb25TYW1wbGVSYXRlXG4gICAgfTtcbiAgICB2YXIgcGVyZk9wdGlvbnMgPSBleHRlbmQocHJlc2V0T3B0aW9ucywgb3B0aW9ucyk7XG5cbiAgICBpZiAocGVyZk9wdGlvbnMubWFuYWdlZCkge1xuICAgICAgcGVyZk9wdGlvbnMgPSBleHRlbmQoe1xuICAgICAgICBwYWdlTG9hZFRyYWNlSWQ6IGNvbmZpZy5wYWdlTG9hZFRyYWNlSWQsXG4gICAgICAgIHBhZ2VMb2FkU2FtcGxlZDogY29uZmlnLnBhZ2VMb2FkU2FtcGxlZCxcbiAgICAgICAgcGFnZUxvYWRTcGFuSWQ6IGNvbmZpZy5wYWdlTG9hZFNwYW5JZCxcbiAgICAgICAgcGFnZUxvYWRUcmFuc2FjdGlvbk5hbWU6IGNvbmZpZy5wYWdlTG9hZFRyYW5zYWN0aW9uTmFtZVxuICAgICAgfSwgcGVyZk9wdGlvbnMpO1xuICAgIH1cblxuICAgIHJldHVybiBwZXJmT3B0aW9ucztcbiAgfTtcblxuICBfcHJvdG8uc3RhcnRNYW5hZ2VkVHJhbnNhY3Rpb24gPSBmdW5jdGlvbiBzdGFydE1hbmFnZWRUcmFuc2FjdGlvbihuYW1lLCB0eXBlLCBwZXJmT3B0aW9ucykge1xuICAgIHZhciB0ciA9IHRoaXMuZ2V0Q3VycmVudFRyYW5zYWN0aW9uKCk7XG4gICAgdmFyIGlzUmVkZWZpbmVkID0gZmFsc2U7XG5cbiAgICBpZiAoIXRyKSB7XG4gICAgICB0ciA9IHRoaXMuY3JlYXRlQ3VycmVudFRyYW5zYWN0aW9uKG5hbWUsIHR5cGUsIHBlcmZPcHRpb25zKTtcbiAgICB9IGVsc2UgaWYgKHRyLmNhblJldXNlKCkgJiYgcGVyZk9wdGlvbnMuY2FuUmV1c2UpIHtcbiAgICAgIHZhciByZWRlZmluZVR5cGUgPSB0ci50eXBlO1xuICAgICAgdmFyIGN1cnJlbnRUeXBlT3JkZXIgPSBUUkFOU0FDVElPTl9UWVBFX09SREVSLmluZGV4T2YodHIudHlwZSk7XG4gICAgICB2YXIgcmVkZWZpbmVUeXBlT3JkZXIgPSBUUkFOU0FDVElPTl9UWVBFX09SREVSLmluZGV4T2YodHlwZSk7XG5cbiAgICAgIGlmIChjdXJyZW50VHlwZU9yZGVyID49IDAgJiYgcmVkZWZpbmVUeXBlT3JkZXIgPCBjdXJyZW50VHlwZU9yZGVyKSB7XG4gICAgICAgIHJlZGVmaW5lVHlwZSA9IHR5cGU7XG4gICAgICB9XG5cbiAgICAgIGlmIChfX0RFVl9fKSB7XG4gICAgICAgIHRoaXMuX2xvZ2dlci5kZWJ1ZyhcInJlZGVmaW5pbmcgdHJhbnNhY3Rpb24oXCIgKyB0ci5pZCArIFwiLCBcIiArIHRyLm5hbWUgKyBcIiwgXCIgKyB0ci50eXBlICsgXCIpXCIsICd0bycsIFwiKFwiICsgKG5hbWUgfHwgdHIubmFtZSkgKyBcIiwgXCIgKyByZWRlZmluZVR5cGUgKyBcIilcIiwgdHIpO1xuICAgICAgfVxuXG4gICAgICB0ci5yZWRlZmluZShuYW1lLCByZWRlZmluZVR5cGUsIHBlcmZPcHRpb25zKTtcbiAgICAgIGlzUmVkZWZpbmVkID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKF9fREVWX18pIHtcbiAgICAgICAgdGhpcy5fbG9nZ2VyLmRlYnVnKFwiZW5kaW5nIHByZXZpb3VzIHRyYW5zYWN0aW9uKFwiICsgdHIuaWQgKyBcIiwgXCIgKyB0ci5uYW1lICsgXCIpXCIsIHRyKTtcbiAgICAgIH1cblxuICAgICAgdHIuZW5kKCk7XG4gICAgICB0ciA9IHRoaXMuY3JlYXRlQ3VycmVudFRyYW5zYWN0aW9uKG5hbWUsIHR5cGUsIHBlcmZPcHRpb25zKTtcbiAgICB9XG5cbiAgICBpZiAodHIudHlwZSA9PT0gUEFHRV9MT0FEKSB7XG4gICAgICBpZiAoIWlzUmVkZWZpbmVkKSB7XG4gICAgICAgIHRoaXMucmVjb3JkZXIuc3RhcnQoTEFSR0VTVF9DT05URU5URlVMX1BBSU5UKTtcbiAgICAgICAgdGhpcy5yZWNvcmRlci5zdGFydChQQUlOVCk7XG4gICAgICAgIHRoaXMucmVjb3JkZXIuc3RhcnQoRklSU1RfSU5QVVQpO1xuICAgICAgICB0aGlzLnJlY29yZGVyLnN0YXJ0KExBWU9VVF9TSElGVCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChwZXJmT3B0aW9ucy5wYWdlTG9hZFRyYWNlSWQpIHtcbiAgICAgICAgdHIudHJhY2VJZCA9IHBlcmZPcHRpb25zLnBhZ2VMb2FkVHJhY2VJZDtcbiAgICAgIH1cblxuICAgICAgaWYgKHBlcmZPcHRpb25zLnBhZ2VMb2FkU2FtcGxlZCkge1xuICAgICAgICB0ci5zYW1wbGVkID0gcGVyZk9wdGlvbnMucGFnZUxvYWRTYW1wbGVkO1xuICAgICAgfVxuXG4gICAgICBpZiAodHIubmFtZSA9PT0gTkFNRV9VTktOT1dOICYmIHBlcmZPcHRpb25zLnBhZ2VMb2FkVHJhbnNhY3Rpb25OYW1lKSB7XG4gICAgICAgIHRyLm5hbWUgPSBwZXJmT3B0aW9ucy5wYWdlTG9hZFRyYW5zYWN0aW9uTmFtZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIWlzUmVkZWZpbmVkICYmIHRoaXMuX2NvbmZpZy5nZXQoJ21vbml0b3JMb25ndGFza3MnKSkge1xuICAgICAgdGhpcy5yZWNvcmRlci5zdGFydChMT05HX1RBU0spO1xuICAgIH1cblxuICAgIGlmICh0ci5zYW1wbGVkKSB7XG4gICAgICB0ci5jYXB0dXJlVGltaW5ncyA9IHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRyO1xuICB9O1xuXG4gIF9wcm90by5zdGFydFRyYW5zYWN0aW9uID0gZnVuY3Rpb24gc3RhcnRUcmFuc2FjdGlvbihuYW1lLCB0eXBlLCBvcHRpb25zKSB7XG4gICAgdmFyIF90aGlzMiA9IHRoaXM7XG5cbiAgICB2YXIgcGVyZk9wdGlvbnMgPSB0aGlzLmNyZWF0ZU9wdGlvbnMob3B0aW9ucyk7XG4gICAgdmFyIHRyO1xuICAgIHZhciBmaXJlT25zdGFydEhvb2sgPSB0cnVlO1xuXG4gICAgaWYgKHBlcmZPcHRpb25zLm1hbmFnZWQpIHtcbiAgICAgIHZhciBjdXJyZW50ID0gdGhpcy5jdXJyZW50VHJhbnNhY3Rpb247XG4gICAgICB0ciA9IHRoaXMuc3RhcnRNYW5hZ2VkVHJhbnNhY3Rpb24obmFtZSwgdHlwZSwgcGVyZk9wdGlvbnMpO1xuXG4gICAgICBpZiAoY3VycmVudCA9PT0gdHIpIHtcbiAgICAgICAgZmlyZU9uc3RhcnRIb29rID0gZmFsc2U7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRyID0gbmV3IFRyYW5zYWN0aW9uKG5hbWUsIHR5cGUsIHBlcmZPcHRpb25zKTtcbiAgICB9XG5cbiAgICB0ci5vbkVuZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBfdGhpczIuaGFuZGxlVHJhbnNhY3Rpb25FbmQodHIpO1xuICAgIH07XG5cbiAgICBpZiAoZmlyZU9uc3RhcnRIb29rKSB7XG4gICAgICBpZiAoX19ERVZfXykge1xuICAgICAgICB0aGlzLl9sb2dnZXIuZGVidWcoXCJzdGFydFRyYW5zYWN0aW9uKFwiICsgdHIuaWQgKyBcIiwgXCIgKyB0ci5uYW1lICsgXCIsIFwiICsgdHIudHlwZSArIFwiKVwiKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fY29uZmlnLmV2ZW50cy5zZW5kKFRSQU5TQUNUSU9OX1NUQVJULCBbdHJdKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHI7XG4gIH07XG5cbiAgX3Byb3RvLmhhbmRsZVRyYW5zYWN0aW9uRW5kID0gZnVuY3Rpb24gaGFuZGxlVHJhbnNhY3Rpb25FbmQodHIpIHtcbiAgICB2YXIgX3RoaXMzID0gdGhpcztcblxuICAgIHRoaXMucmVjb3JkZXIuc3RvcCgpO1xuICAgIHZhciBjdXJyZW50VXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIG5hbWUgPSB0ci5uYW1lLFxuICAgICAgICAgIHR5cGUgPSB0ci50eXBlO1xuICAgICAgdmFyIGxhc3RIaWRkZW5TdGFydCA9IHN0YXRlLmxhc3RIaWRkZW5TdGFydDtcblxuICAgICAgaWYgKGxhc3RIaWRkZW5TdGFydCA+PSB0ci5fc3RhcnQpIHtcbiAgICAgICAgaWYgKF9fREVWX18pIHtcbiAgICAgICAgICBfdGhpczMuX2xvZ2dlci5kZWJ1ZyhcInRyYW5zYWN0aW9uKFwiICsgdHIuaWQgKyBcIiwgXCIgKyBuYW1lICsgXCIsIFwiICsgdHlwZSArIFwiKSB3YXMgZGlzY2FyZGVkISBUaGUgcGFnZSB3YXMgaGlkZGVuIGR1cmluZyB0aGUgdHJhbnNhY3Rpb24hXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAoX3RoaXMzLnNob3VsZElnbm9yZVRyYW5zYWN0aW9uKG5hbWUpIHx8IHR5cGUgPT09IFRFTVBPUkFSWV9UWVBFKSB7XG4gICAgICAgIGlmIChfX0RFVl9fKSB7XG4gICAgICAgICAgX3RoaXMzLl9sb2dnZXIuZGVidWcoXCJ0cmFuc2FjdGlvbihcIiArIHRyLmlkICsgXCIsIFwiICsgbmFtZSArIFwiLCBcIiArIHR5cGUgKyBcIikgaXMgaWdub3JlZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGUgPT09IFBBR0VfTE9BRCkge1xuICAgICAgICB2YXIgcGFnZUxvYWRUcmFuc2FjdGlvbk5hbWUgPSBfdGhpczMuX2NvbmZpZy5nZXQoJ3BhZ2VMb2FkVHJhbnNhY3Rpb25OYW1lJyk7XG5cbiAgICAgICAgaWYgKG5hbWUgPT09IE5BTUVfVU5LTk9XTiAmJiBwYWdlTG9hZFRyYW5zYWN0aW9uTmFtZSkge1xuICAgICAgICAgIHRyLm5hbWUgPSBwYWdlTG9hZFRyYW5zYWN0aW9uTmFtZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0ci5jYXB0dXJlVGltaW5ncykge1xuICAgICAgICAgIHZhciBjbHMgPSBtZXRyaWNzLmNscyxcbiAgICAgICAgICAgICAgZmlkID0gbWV0cmljcy5maWQsXG4gICAgICAgICAgICAgIHRidCA9IG1ldHJpY3MudGJ0LFxuICAgICAgICAgICAgICBsb25ndGFzayA9IG1ldHJpY3MubG9uZ3Rhc2s7XG5cbiAgICAgICAgICBpZiAodGJ0LmR1cmF0aW9uID4gMCkge1xuICAgICAgICAgICAgdHIuc3BhbnMucHVzaChjcmVhdGVUb3RhbEJsb2NraW5nVGltZVNwYW4odGJ0KSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdHIuZXhwZXJpZW5jZSA9IHt9O1xuXG4gICAgICAgICAgaWYgKGlzUGVyZlR5cGVTdXBwb3J0ZWQoTE9OR19UQVNLKSkge1xuICAgICAgICAgICAgdHIuZXhwZXJpZW5jZS50YnQgPSB0YnQuZHVyYXRpb247XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGlzUGVyZlR5cGVTdXBwb3J0ZWQoTEFZT1VUX1NISUZUKSkge1xuICAgICAgICAgICAgdHIuZXhwZXJpZW5jZS5jbHMgPSBjbHMuc2NvcmU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGZpZCA+IDApIHtcbiAgICAgICAgICAgIHRyLmV4cGVyaWVuY2UuZmlkID0gZmlkO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChsb25ndGFzay5jb3VudCA+IDApIHtcbiAgICAgICAgICAgIHRyLmV4cGVyaWVuY2UubG9uZ3Rhc2sgPSB7XG4gICAgICAgICAgICAgIGNvdW50OiBsb25ndGFzay5jb3VudCxcbiAgICAgICAgICAgICAgc3VtOiBsb25ndGFzay5kdXJhdGlvbixcbiAgICAgICAgICAgICAgbWF4OiBsb25ndGFzay5tYXhcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgX3RoaXMzLnNldFNlc3Npb24odHIpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHIubmFtZSA9PT0gTkFNRV9VTktOT1dOKSB7XG4gICAgICAgIHRyLm5hbWUgPSBzbHVnaWZ5VXJsKGN1cnJlbnRVcmwpO1xuICAgICAgfVxuXG4gICAgICBjYXB0dXJlTmF2aWdhdGlvbih0cik7XG5cbiAgICAgIF90aGlzMy5hZGp1c3RUcmFuc2FjdGlvblRpbWUodHIpO1xuXG4gICAgICB2YXIgYnJlYWtkb3duTWV0cmljcyA9IF90aGlzMy5fY29uZmlnLmdldCgnYnJlYWtkb3duTWV0cmljcycpO1xuXG4gICAgICBpZiAoYnJlYWtkb3duTWV0cmljcykge1xuICAgICAgICB0ci5jYXB0dXJlQnJlYWtkb3duKCk7XG4gICAgICB9XG5cbiAgICAgIHZhciBjb25maWdDb250ZXh0ID0gX3RoaXMzLl9jb25maWcuZ2V0KCdjb250ZXh0Jyk7XG5cbiAgICAgIGFkZFRyYW5zYWN0aW9uQ29udGV4dCh0ciwgY29uZmlnQ29udGV4dCk7XG5cbiAgICAgIF90aGlzMy5fY29uZmlnLmV2ZW50cy5zZW5kKFRSQU5TQUNUSU9OX0VORCwgW3RyXSk7XG5cbiAgICAgIGlmIChfX0RFVl9fKSB7XG4gICAgICAgIF90aGlzMy5fbG9nZ2VyLmRlYnVnKFwiZW5kIHRyYW5zYWN0aW9uKFwiICsgdHIuaWQgKyBcIiwgXCIgKyB0ci5uYW1lICsgXCIsIFwiICsgdHIudHlwZSArIFwiKVwiLCB0cik7XG4gICAgICB9XG4gICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgaWYgKF9fREVWX18pIHtcbiAgICAgICAgX3RoaXMzLl9sb2dnZXIuZGVidWcoXCJlcnJvciBlbmRpbmcgdHJhbnNhY3Rpb24oXCIgKyB0ci5pZCArIFwiLCBcIiArIHRyLm5hbWUgKyBcIilcIiwgZXJyKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBfcHJvdG8uc2V0U2Vzc2lvbiA9IGZ1bmN0aW9uIHNldFNlc3Npb24odHIpIHtcbiAgICB2YXIgc2Vzc2lvbiA9IHRoaXMuX2NvbmZpZy5nZXQoJ3Nlc3Npb24nKTtcblxuICAgIGlmIChzZXNzaW9uKSB7XG4gICAgICBpZiAodHlwZW9mIHNlc3Npb24gPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgIHRyLnNlc3Npb24gPSB7XG4gICAgICAgICAgaWQ6IGdlbmVyYXRlUmFuZG9tSWQoMTYpLFxuICAgICAgICAgIHNlcXVlbmNlOiAxXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoc2Vzc2lvbi50aW1lc3RhbXAgJiYgRGF0ZS5ub3coKSAtIHNlc3Npb24udGltZXN0YW1wID4gU0VTU0lPTl9USU1FT1VUKSB7XG4gICAgICAgICAgdHIuc2Vzc2lvbiA9IHtcbiAgICAgICAgICAgIGlkOiBnZW5lcmF0ZVJhbmRvbUlkKDE2KSxcbiAgICAgICAgICAgIHNlcXVlbmNlOiAxXG4gICAgICAgICAgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0ci5zZXNzaW9uID0ge1xuICAgICAgICAgICAgaWQ6IHNlc3Npb24uaWQsXG4gICAgICAgICAgICBzZXF1ZW5jZTogc2Vzc2lvbi5zZXF1ZW5jZSA/IHNlc3Npb24uc2VxdWVuY2UgKyAxIDogMVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyIHNlc3Npb25Db25maWcgPSB7XG4gICAgICAgIHNlc3Npb246IHtcbiAgICAgICAgICBpZDogdHIuc2Vzc2lvbi5pZCxcbiAgICAgICAgICBzZXF1ZW5jZTogdHIuc2Vzc2lvbi5zZXF1ZW5jZSxcbiAgICAgICAgICB0aW1lc3RhbXA6IERhdGUubm93KClcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgdGhpcy5fY29uZmlnLnNldENvbmZpZyhzZXNzaW9uQ29uZmlnKTtcblxuICAgICAgdGhpcy5fY29uZmlnLnNldExvY2FsQ29uZmlnKHNlc3Npb25Db25maWcsIHRydWUpO1xuICAgIH1cbiAgfTtcblxuICBfcHJvdG8uYWRqdXN0VHJhbnNhY3Rpb25UaW1lID0gZnVuY3Rpb24gYWRqdXN0VHJhbnNhY3Rpb25UaW1lKHRyYW5zYWN0aW9uKSB7XG4gICAgdmFyIHNwYW5zID0gdHJhbnNhY3Rpb24uc3BhbnM7XG4gICAgdmFyIGVhcmxpZXN0U3BhbiA9IGdldEVhcmxpZXN0U3BhbihzcGFucyk7XG5cbiAgICBpZiAoZWFybGllc3RTcGFuICYmIGVhcmxpZXN0U3Bhbi5fc3RhcnQgPCB0cmFuc2FjdGlvbi5fc3RhcnQpIHtcbiAgICAgIHRyYW5zYWN0aW9uLl9zdGFydCA9IGVhcmxpZXN0U3Bhbi5fc3RhcnQ7XG4gICAgfVxuXG4gICAgdmFyIGxhdGVzdFNwYW4gPSBnZXRMYXRlc3ROb25YSFJTcGFuKHNwYW5zKSB8fCB7fTtcbiAgICB2YXIgbGF0ZXN0U3BhbkVuZCA9IGxhdGVzdFNwYW4uX2VuZCB8fCAwO1xuXG4gICAgaWYgKHRyYW5zYWN0aW9uLnR5cGUgPT09IFBBR0VfTE9BRCkge1xuICAgICAgdmFyIHRyYW5zYWN0aW9uRW5kV2l0aG91dERlbGF5ID0gdHJhbnNhY3Rpb24uX2VuZCAtIFBBR0VfTE9BRF9ERUxBWTtcbiAgICAgIHZhciBsY3AgPSBtZXRyaWNzLmxjcCB8fCAwO1xuICAgICAgdmFyIGxhdGVzdFhIUlNwYW4gPSBnZXRMYXRlc3RYSFJTcGFuKHNwYW5zKSB8fCB7fTtcbiAgICAgIHZhciBsYXRlc3RYSFJTcGFuRW5kID0gbGF0ZXN0WEhSU3Bhbi5fZW5kIHx8IDA7XG4gICAgICB0cmFuc2FjdGlvbi5fZW5kID0gTWF0aC5tYXgobGF0ZXN0U3BhbkVuZCwgbGF0ZXN0WEhSU3BhbkVuZCwgbGNwLCB0cmFuc2FjdGlvbkVuZFdpdGhvdXREZWxheSk7XG4gICAgfSBlbHNlIGlmIChsYXRlc3RTcGFuRW5kID4gdHJhbnNhY3Rpb24uX2VuZCkge1xuICAgICAgdHJhbnNhY3Rpb24uX2VuZCA9IGxhdGVzdFNwYW5FbmQ7XG4gICAgfVxuXG4gICAgdGhpcy50cnVuY2F0ZVNwYW5zKHNwYW5zLCB0cmFuc2FjdGlvbi5fZW5kKTtcbiAgfTtcblxuICBfcHJvdG8udHJ1bmNhdGVTcGFucyA9IGZ1bmN0aW9uIHRydW5jYXRlU3BhbnMoc3BhbnMsIHRyYW5zYWN0aW9uRW5kKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzcGFucy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHNwYW4gPSBzcGFuc1tpXTtcblxuICAgICAgaWYgKHNwYW4uX2VuZCA+IHRyYW5zYWN0aW9uRW5kKSB7XG4gICAgICAgIHNwYW4uX2VuZCA9IHRyYW5zYWN0aW9uRW5kO1xuICAgICAgICBzcGFuLnR5cGUgKz0gVFJVTkNBVEVEX1RZUEU7XG4gICAgICB9XG5cbiAgICAgIGlmIChzcGFuLl9zdGFydCA+IHRyYW5zYWN0aW9uRW5kKSB7XG4gICAgICAgIHNwYW4uX3N0YXJ0ID0gdHJhbnNhY3Rpb25FbmQ7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIF9wcm90by5zaG91bGRJZ25vcmVUcmFuc2FjdGlvbiA9IGZ1bmN0aW9uIHNob3VsZElnbm9yZVRyYW5zYWN0aW9uKHRyYW5zYWN0aW9uTmFtZSkge1xuICAgIHZhciBpZ25vcmVMaXN0ID0gdGhpcy5fY29uZmlnLmdldCgnaWdub3JlVHJhbnNhY3Rpb25zJyk7XG5cbiAgICBpZiAoaWdub3JlTGlzdCAmJiBpZ25vcmVMaXN0Lmxlbmd0aCkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpZ25vcmVMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBlbGVtZW50ID0gaWdub3JlTGlzdFtpXTtcblxuICAgICAgICBpZiAodHlwZW9mIGVsZW1lbnQudGVzdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIGlmIChlbGVtZW50LnRlc3QodHJhbnNhY3Rpb25OYW1lKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGVsZW1lbnQgPT09IHRyYW5zYWN0aW9uTmFtZSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIF9wcm90by5zdGFydFNwYW4gPSBmdW5jdGlvbiBzdGFydFNwYW4obmFtZSwgdHlwZSwgb3B0aW9ucykge1xuICAgIHZhciB0ciA9IHRoaXMuZ2V0Q3VycmVudFRyYW5zYWN0aW9uKCk7XG5cbiAgICBpZiAoIXRyKSB7XG4gICAgICB0ciA9IHRoaXMuY3JlYXRlQ3VycmVudFRyYW5zYWN0aW9uKHVuZGVmaW5lZCwgVEVNUE9SQVJZX1RZUEUsIHRoaXMuY3JlYXRlT3B0aW9ucyh7XG4gICAgICAgIGNhblJldXNlOiB0cnVlLFxuICAgICAgICBtYW5hZ2VkOiB0cnVlXG4gICAgICB9KSk7XG4gICAgfVxuXG4gICAgdmFyIHNwYW4gPSB0ci5zdGFydFNwYW4obmFtZSwgdHlwZSwgb3B0aW9ucyk7XG5cbiAgICBpZiAoX19ERVZfXykge1xuICAgICAgdGhpcy5fbG9nZ2VyLmRlYnVnKFwic3RhcnRTcGFuKFwiICsgbmFtZSArIFwiLCBcIiArIHNwYW4udHlwZSArIFwiKVwiLCBcIm9uIHRyYW5zYWN0aW9uKFwiICsgdHIuaWQgKyBcIiwgXCIgKyB0ci5uYW1lICsgXCIpXCIpO1xuICAgIH1cblxuICAgIHJldHVybiBzcGFuO1xuICB9O1xuXG4gIF9wcm90by5lbmRTcGFuID0gZnVuY3Rpb24gZW5kU3BhbihzcGFuLCBjb250ZXh0KSB7XG4gICAgaWYgKCFzcGFuKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKF9fREVWX18pIHtcbiAgICAgIHZhciB0ciA9IHRoaXMuZ2V0Q3VycmVudFRyYW5zYWN0aW9uKCk7XG4gICAgICB0ciAmJiB0aGlzLl9sb2dnZXIuZGVidWcoXCJlbmRTcGFuKFwiICsgc3Bhbi5uYW1lICsgXCIsIFwiICsgc3Bhbi50eXBlICsgXCIpXCIsIFwib24gdHJhbnNhY3Rpb24oXCIgKyB0ci5pZCArIFwiLCBcIiArIHRyLm5hbWUgKyBcIilcIik7XG4gICAgfVxuXG4gICAgc3Bhbi5lbmQobnVsbCwgY29udGV4dCk7XG4gIH07XG5cbiAgcmV0dXJuIFRyYW5zYWN0aW9uU2VydmljZTtcbn0oKTtcblxuZXhwb3J0IGRlZmF1bHQgVHJhbnNhY3Rpb25TZXJ2aWNlOyIsImZ1bmN0aW9uIF9pbmhlcml0c0xvb3NlKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7IHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcy5wcm90b3R5cGUpOyBzdWJDbGFzcy5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBzdWJDbGFzczsgX3NldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKTsgfVxuXG5mdW5jdGlvbiBfc2V0UHJvdG90eXBlT2YobywgcCkgeyBfc2V0UHJvdG90eXBlT2YgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gX3NldFByb3RvdHlwZU9mKG8sIHApIHsgby5fX3Byb3RvX18gPSBwOyByZXR1cm4gbzsgfTsgcmV0dXJuIF9zZXRQcm90b3R5cGVPZihvLCBwKTsgfVxuXG5pbXBvcnQgU3BhbiBmcm9tICcuL3NwYW4nO1xuaW1wb3J0IFNwYW5CYXNlIGZyb20gJy4vc3Bhbi1iYXNlJztcbmltcG9ydCB7IGdlbmVyYXRlUmFuZG9tSWQsIG1lcmdlLCBub3csIGdldFRpbWUsIGV4dGVuZCwgcmVtb3ZlSW52YWxpZENoYXJzIH0gZnJvbSAnLi4vY29tbW9uL3V0aWxzJztcbmltcG9ydCB7IFJFVVNBQklMSVRZX1RIUkVTSE9MRCwgVFJVTkNBVEVEX1RZUEUgfSBmcm9tICcuLi9jb21tb24vY29uc3RhbnRzJztcbmltcG9ydCB7IGNhcHR1cmVCcmVha2Rvd24gYXMgX2NhcHR1cmVCcmVha2Rvd24gfSBmcm9tICcuL2JyZWFrZG93bic7XG5cbnZhciBUcmFuc2FjdGlvbiA9IGZ1bmN0aW9uIChfU3BhbkJhc2UpIHtcbiAgX2luaGVyaXRzTG9vc2UoVHJhbnNhY3Rpb24sIF9TcGFuQmFzZSk7XG5cbiAgZnVuY3Rpb24gVHJhbnNhY3Rpb24obmFtZSwgdHlwZSwgb3B0aW9ucykge1xuICAgIHZhciBfdGhpcztcblxuICAgIF90aGlzID0gX1NwYW5CYXNlLmNhbGwodGhpcywgbmFtZSwgdHlwZSwgb3B0aW9ucykgfHwgdGhpcztcbiAgICBfdGhpcy50cmFjZUlkID0gZ2VuZXJhdGVSYW5kb21JZCgpO1xuICAgIF90aGlzLm1hcmtzID0gdW5kZWZpbmVkO1xuICAgIF90aGlzLnNwYW5zID0gW107XG4gICAgX3RoaXMuX2FjdGl2ZVNwYW5zID0ge307XG4gICAgX3RoaXMuX2FjdGl2ZVRhc2tzID0gbmV3IFNldCgpO1xuICAgIF90aGlzLmJsb2NrZWQgPSBmYWxzZTtcbiAgICBfdGhpcy5jYXB0dXJlVGltaW5ncyA9IGZhbHNlO1xuICAgIF90aGlzLmJyZWFrZG93blRpbWluZ3MgPSBbXTtcbiAgICBfdGhpcy5zYW1wbGVSYXRlID0gX3RoaXMub3B0aW9ucy50cmFuc2FjdGlvblNhbXBsZVJhdGU7XG4gICAgX3RoaXMuc2FtcGxlZCA9IE1hdGgucmFuZG9tKCkgPD0gX3RoaXMuc2FtcGxlUmF0ZTtcbiAgICByZXR1cm4gX3RoaXM7XG4gIH1cblxuICB2YXIgX3Byb3RvID0gVHJhbnNhY3Rpb24ucHJvdG90eXBlO1xuXG4gIF9wcm90by5hZGRNYXJrcyA9IGZ1bmN0aW9uIGFkZE1hcmtzKG9iaikge1xuICAgIHRoaXMubWFya3MgPSBtZXJnZSh0aGlzLm1hcmtzIHx8IHt9LCBvYmopO1xuICB9O1xuXG4gIF9wcm90by5tYXJrID0gZnVuY3Rpb24gbWFyayhrZXkpIHtcbiAgICB2YXIgc2tleSA9IHJlbW92ZUludmFsaWRDaGFycyhrZXkpO1xuXG4gICAgdmFyIG1hcmtUaW1lID0gbm93KCkgLSB0aGlzLl9zdGFydDtcblxuICAgIHZhciBjdXN0b20gPSB7fTtcbiAgICBjdXN0b21bc2tleV0gPSBtYXJrVGltZTtcbiAgICB0aGlzLmFkZE1hcmtzKHtcbiAgICAgIGN1c3RvbTogY3VzdG9tXG4gICAgfSk7XG4gIH07XG5cbiAgX3Byb3RvLmNhblJldXNlID0gZnVuY3Rpb24gY2FuUmV1c2UoKSB7XG4gICAgdmFyIHRocmVzaG9sZCA9IHRoaXMub3B0aW9ucy5yZXVzZVRocmVzaG9sZCB8fCBSRVVTQUJJTElUWV9USFJFU0hPTEQ7XG4gICAgcmV0dXJuICEhdGhpcy5vcHRpb25zLmNhblJldXNlICYmICF0aGlzLmVuZGVkICYmIG5vdygpIC0gdGhpcy5fc3RhcnQgPCB0aHJlc2hvbGQ7XG4gIH07XG5cbiAgX3Byb3RvLnJlZGVmaW5lID0gZnVuY3Rpb24gcmVkZWZpbmUobmFtZSwgdHlwZSwgb3B0aW9ucykge1xuICAgIGlmIChuYW1lKSB7XG4gICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIH1cblxuICAgIGlmICh0eXBlKSB7XG4gICAgICB0aGlzLnR5cGUgPSB0eXBlO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zKSB7XG4gICAgICB0aGlzLm9wdGlvbnMucmV1c2VUaHJlc2hvbGQgPSBvcHRpb25zLnJldXNlVGhyZXNob2xkO1xuICAgICAgZXh0ZW5kKHRoaXMub3B0aW9ucywgb3B0aW9ucyk7XG4gICAgfVxuICB9O1xuXG4gIF9wcm90by5zdGFydFNwYW4gPSBmdW5jdGlvbiBzdGFydFNwYW4obmFtZSwgdHlwZSwgb3B0aW9ucykge1xuICAgIHZhciBfdGhpczIgPSB0aGlzO1xuXG4gICAgaWYgKHRoaXMuZW5kZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgb3B0cyA9IGV4dGVuZCh7fSwgb3B0aW9ucyk7XG5cbiAgICBvcHRzLm9uRW5kID0gZnVuY3Rpb24gKHRyYykge1xuICAgICAgX3RoaXMyLl9vblNwYW5FbmQodHJjKTtcbiAgICB9O1xuXG4gICAgb3B0cy50cmFjZUlkID0gdGhpcy50cmFjZUlkO1xuICAgIG9wdHMuc2FtcGxlZCA9IHRoaXMuc2FtcGxlZDtcbiAgICBvcHRzLnNhbXBsZVJhdGUgPSB0aGlzLnNhbXBsZVJhdGU7XG5cbiAgICBpZiAoIW9wdHMucGFyZW50SWQpIHtcbiAgICAgIG9wdHMucGFyZW50SWQgPSB0aGlzLmlkO1xuICAgIH1cblxuICAgIHZhciBzcGFuID0gbmV3IFNwYW4obmFtZSwgdHlwZSwgb3B0cyk7XG4gICAgdGhpcy5fYWN0aXZlU3BhbnNbc3Bhbi5pZF0gPSBzcGFuO1xuXG4gICAgaWYgKG9wdHMuYmxvY2tpbmcpIHtcbiAgICAgIHRoaXMuYWRkVGFzayhzcGFuLmlkKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3BhbjtcbiAgfTtcblxuICBfcHJvdG8uaXNGaW5pc2hlZCA9IGZ1bmN0aW9uIGlzRmluaXNoZWQoKSB7XG4gICAgcmV0dXJuICF0aGlzLmJsb2NrZWQgJiYgdGhpcy5fYWN0aXZlVGFza3Muc2l6ZSA9PT0gMDtcbiAgfTtcblxuICBfcHJvdG8uZGV0ZWN0RmluaXNoID0gZnVuY3Rpb24gZGV0ZWN0RmluaXNoKCkge1xuICAgIGlmICh0aGlzLmlzRmluaXNoZWQoKSkgdGhpcy5lbmQoKTtcbiAgfTtcblxuICBfcHJvdG8uZW5kID0gZnVuY3Rpb24gZW5kKGVuZFRpbWUpIHtcbiAgICBpZiAodGhpcy5lbmRlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuZW5kZWQgPSB0cnVlO1xuICAgIHRoaXMuX2VuZCA9IGdldFRpbWUoZW5kVGltZSk7XG5cbiAgICBmb3IgKHZhciBzaWQgaW4gdGhpcy5fYWN0aXZlU3BhbnMpIHtcbiAgICAgIHZhciBzcGFuID0gdGhpcy5fYWN0aXZlU3BhbnNbc2lkXTtcbiAgICAgIHNwYW4udHlwZSA9IHNwYW4udHlwZSArIFRSVU5DQVRFRF9UWVBFO1xuICAgICAgc3Bhbi5lbmQoZW5kVGltZSk7XG4gICAgfVxuXG4gICAgdGhpcy5jYWxsT25FbmQoKTtcbiAgfTtcblxuICBfcHJvdG8uY2FwdHVyZUJyZWFrZG93biA9IGZ1bmN0aW9uIGNhcHR1cmVCcmVha2Rvd24oKSB7XG4gICAgdGhpcy5icmVha2Rvd25UaW1pbmdzID0gX2NhcHR1cmVCcmVha2Rvd24odGhpcyk7XG4gIH07XG5cbiAgX3Byb3RvLmJsb2NrID0gZnVuY3Rpb24gYmxvY2soZmxhZykge1xuICAgIHRoaXMuYmxvY2tlZCA9IGZsYWc7XG5cbiAgICBpZiAoIXRoaXMuYmxvY2tlZCkge1xuICAgICAgdGhpcy5kZXRlY3RGaW5pc2goKTtcbiAgICB9XG4gIH07XG5cbiAgX3Byb3RvLmFkZFRhc2sgPSBmdW5jdGlvbiBhZGRUYXNrKHRhc2tJZCkge1xuICAgIGlmICghdGFza0lkKSB7XG4gICAgICB0YXNrSWQgPSAndGFzay0nICsgZ2VuZXJhdGVSYW5kb21JZCgxNik7XG4gICAgfVxuXG4gICAgdGhpcy5fYWN0aXZlVGFza3MuYWRkKHRhc2tJZCk7XG5cbiAgICByZXR1cm4gdGFza0lkO1xuICB9O1xuXG4gIF9wcm90by5yZW1vdmVUYXNrID0gZnVuY3Rpb24gcmVtb3ZlVGFzayh0YXNrSWQpIHtcbiAgICB2YXIgZGVsZXRlZCA9IHRoaXMuX2FjdGl2ZVRhc2tzLmRlbGV0ZSh0YXNrSWQpO1xuXG4gICAgZGVsZXRlZCAmJiB0aGlzLmRldGVjdEZpbmlzaCgpO1xuICB9O1xuXG4gIF9wcm90by5yZXNldEZpZWxkcyA9IGZ1bmN0aW9uIHJlc2V0RmllbGRzKCkge1xuICAgIHRoaXMuc3BhbnMgPSBbXTtcbiAgICB0aGlzLnNhbXBsZVJhdGUgPSAwO1xuICB9O1xuXG4gIF9wcm90by5fb25TcGFuRW5kID0gZnVuY3Rpb24gX29uU3BhbkVuZChzcGFuKSB7XG4gICAgdGhpcy5zcGFucy5wdXNoKHNwYW4pO1xuICAgIGRlbGV0ZSB0aGlzLl9hY3RpdmVTcGFuc1tzcGFuLmlkXTtcbiAgICB0aGlzLnJlbW92ZVRhc2soc3Bhbi5pZCk7XG4gIH07XG5cbiAgX3Byb3RvLmlzTWFuYWdlZCA9IGZ1bmN0aW9uIGlzTWFuYWdlZCgpIHtcbiAgICByZXR1cm4gISF0aGlzLm9wdGlvbnMubWFuYWdlZDtcbiAgfTtcblxuICByZXR1cm4gVHJhbnNhY3Rpb247XG59KFNwYW5CYXNlKTtcblxuZXhwb3J0IGRlZmF1bHQgVHJhbnNhY3Rpb247IiwidmFyIF9fREVWX18gPSBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nO1xuXG52YXIgc3RhdGUgPSB7XG4gIGJvb3RzdHJhcFRpbWU6IG51bGwsXG4gIGxhc3RIaWRkZW5TdGFydDogTnVtYmVyLk1JTl9TQUZFX0lOVEVHRVJcbn07XG5leHBvcnQgeyBfX0RFVl9fLCBzdGF0ZSB9OyIsIi8qKlxuICogTUlUIExpY2Vuc2VcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTctcHJlc2VudCwgRWxhc3RpY3NlYXJjaCBCVlxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiAqIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiAqIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiAqIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiAqIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuICogZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuICogYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuICogSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gKiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiAqIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiAqIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gKiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gKiBUSEUgU09GVFdBUkUuXG4gKlxuICovXG5cbmltcG9ydCB7XG4gIGdldEluc3RydW1lbnRhdGlvbkZsYWdzLFxuICBQQUdFX0xPQURfREVMQVksXG4gIFBBR0VfTE9BRCxcbiAgRVJST1IsXG4gIENPTkZJR19TRVJWSUNFLFxuICBMT0dHSU5HX1NFUlZJQ0UsXG4gIFRSQU5TQUNUSU9OX1NFUlZJQ0UsXG4gIFBFUkZPUk1BTkNFX01PTklUT1JJTkcsXG4gIEVSUk9SX0xPR0dJTkcsXG4gIEFQTV9TRVJWRVIsXG4gIEVWRU5UX1RBUkdFVCxcbiAgQ0xJQ0ssXG4gIG9ic2VydmVQYWdlVmlzaWJpbGl0eSxcbiAgb2JzZXJ2ZVBhZ2VDbGlja3Ncbn0gZnJvbSAnQGVsYXN0aWMvYXBtLXJ1bS1jb3JlJ1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBcG1CYXNlIHtcbiAgY29uc3RydWN0b3Ioc2VydmljZUZhY3RvcnksIGRpc2FibGUpIHtcbiAgICB0aGlzLl9kaXNhYmxlID0gZGlzYWJsZVxuICAgIHRoaXMuc2VydmljZUZhY3RvcnkgPSBzZXJ2aWNlRmFjdG9yeVxuICAgIHRoaXMuX2luaXRpYWxpemVkID0gZmFsc2VcbiAgfVxuXG4gIGlzRW5hYmxlZCgpIHtcbiAgICByZXR1cm4gIXRoaXMuX2Rpc2FibGVcbiAgfVxuXG4gIGlzQWN0aXZlKCkge1xuICAgIGNvbnN0IGNvbmZpZ1NlcnZpY2UgPSB0aGlzLnNlcnZpY2VGYWN0b3J5LmdldFNlcnZpY2UoQ09ORklHX1NFUlZJQ0UpXG4gICAgcmV0dXJuIHRoaXMuaXNFbmFibGVkKCkgJiYgdGhpcy5faW5pdGlhbGl6ZWQgJiYgY29uZmlnU2VydmljZS5nZXQoJ2FjdGl2ZScpXG4gIH1cblxuICBpbml0KGNvbmZpZykge1xuICAgIGlmICh0aGlzLmlzRW5hYmxlZCgpICYmICF0aGlzLl9pbml0aWFsaXplZCkge1xuICAgICAgdGhpcy5faW5pdGlhbGl6ZWQgPSB0cnVlXG4gICAgICBjb25zdCBbXG4gICAgICAgIGNvbmZpZ1NlcnZpY2UsXG4gICAgICAgIGxvZ2dpbmdTZXJ2aWNlLFxuICAgICAgICB0cmFuc2FjdGlvblNlcnZpY2VcbiAgICAgIF0gPSB0aGlzLnNlcnZpY2VGYWN0b3J5LmdldFNlcnZpY2UoW1xuICAgICAgICBDT05GSUdfU0VSVklDRSxcbiAgICAgICAgTE9HR0lOR19TRVJWSUNFLFxuICAgICAgICBUUkFOU0FDVElPTl9TRVJWSUNFXG4gICAgICBdKVxuICAgICAgLyoqXG4gICAgICAgKiBTZXQgQWdlbnQgdmVyc2lvbiB0byBiZSBzZW50IGFzIHBhcnQgb2YgbWV0YWRhdGEgdG8gdGhlIEFQTSBTZXJ2ZXJcbiAgICAgICAqL1xuICAgICAgY29uZmlnU2VydmljZS5zZXRWZXJzaW9uKCc1LjE0LjAnKVxuICAgICAgdGhpcy5jb25maWcoY29uZmlnKVxuICAgICAgLyoqXG4gICAgICAgKiBTZXQgbGV2ZWwgaGVyZSB0byBhY2NvdW50IGZvciBib3RoIGFjdGl2ZSBhbmQgaW5hY3RpdmUgY2FzZXNcbiAgICAgICAqL1xuICAgICAgY29uc3QgbG9nTGV2ZWwgPSBjb25maWdTZXJ2aWNlLmdldCgnbG9nTGV2ZWwnKVxuICAgICAgbG9nZ2luZ1NlcnZpY2Uuc2V0TGV2ZWwobG9nTGV2ZWwpXG4gICAgICAvKipcbiAgICAgICAqIERlYWN0aXZlIGFnZW50IHdoZW4gdGhlIGFjdGl2ZSBjb25maWcgZmxhZyBpcyBzZXQgdG8gZmFsc2VcbiAgICAgICAqL1xuICAgICAgY29uc3QgaXNDb25maWdBY3RpdmUgPSBjb25maWdTZXJ2aWNlLmdldCgnYWN0aXZlJylcbiAgICAgIGlmIChpc0NvbmZpZ0FjdGl2ZSkge1xuICAgICAgICB0aGlzLnNlcnZpY2VGYWN0b3J5LmluaXQoKVxuXG4gICAgICAgIGNvbnN0IGZsYWdzID0gZ2V0SW5zdHJ1bWVudGF0aW9uRmxhZ3MoXG4gICAgICAgICAgY29uZmlnU2VydmljZS5nZXQoJ2luc3RydW1lbnQnKSxcbiAgICAgICAgICBjb25maWdTZXJ2aWNlLmdldCgnZGlzYWJsZUluc3RydW1lbnRhdGlvbnMnKVxuICAgICAgICApXG5cbiAgICAgICAgY29uc3QgcGVyZm9ybWFuY2VNb25pdG9yaW5nID0gdGhpcy5zZXJ2aWNlRmFjdG9yeS5nZXRTZXJ2aWNlKFxuICAgICAgICAgIFBFUkZPUk1BTkNFX01PTklUT1JJTkdcbiAgICAgICAgKVxuICAgICAgICBwZXJmb3JtYW5jZU1vbml0b3JpbmcuaW5pdChmbGFncylcblxuICAgICAgICBpZiAoZmxhZ3NbRVJST1JdKSB7XG4gICAgICAgICAgY29uc3QgZXJyb3JMb2dnaW5nID0gdGhpcy5zZXJ2aWNlRmFjdG9yeS5nZXRTZXJ2aWNlKEVSUk9SX0xPR0dJTkcpXG4gICAgICAgICAgZXJyb3JMb2dnaW5nLnJlZ2lzdGVyTGlzdGVuZXJzKClcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb25maWdTZXJ2aWNlLmdldCgnc2Vzc2lvbicpKSB7XG4gICAgICAgICAgbGV0IGxvY2FsQ29uZmlnID0gY29uZmlnU2VydmljZS5nZXRMb2NhbENvbmZpZygpXG4gICAgICAgICAgaWYgKGxvY2FsQ29uZmlnICYmIGxvY2FsQ29uZmlnLnNlc3Npb24pIHtcbiAgICAgICAgICAgIGNvbmZpZ1NlcnZpY2Uuc2V0Q29uZmlnKHtcbiAgICAgICAgICAgICAgc2Vzc2lvbjogbG9jYWxDb25maWcuc2Vzc2lvblxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzZW5kUGFnZUxvYWQgPSAoKSA9PlxuICAgICAgICAgIGZsYWdzW1BBR0VfTE9BRF0gJiYgdGhpcy5fc2VuZFBhZ2VMb2FkTWV0cmljcygpXG5cbiAgICAgICAgaWYgKGNvbmZpZ1NlcnZpY2UuZ2V0KCdjZW50cmFsQ29uZmlnJykpIHtcbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBXYWl0aW5nIGZvciB0aGUgcmVtb3RlIGNvbmZpZyBiZWZvcmUgc2VuZGluZyB0aGUgcGFnZSBsb2FkIHRyYW5zYWN0aW9uXG4gICAgICAgICAgICovXG4gICAgICAgICAgdGhpcy5mZXRjaENlbnRyYWxDb25maWcoKS50aGVuKHNlbmRQYWdlTG9hZClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZW5kUGFnZUxvYWQoKVxuICAgICAgICB9XG5cbiAgICAgICAgb2JzZXJ2ZVBhZ2VWaXNpYmlsaXR5KGNvbmZpZ1NlcnZpY2UsIHRyYW5zYWN0aW9uU2VydmljZSlcbiAgICAgICAgaWYgKGZsYWdzW0VWRU5UX1RBUkdFVF0gJiYgZmxhZ3NbQ0xJQ0tdKSB7XG4gICAgICAgICAgb2JzZXJ2ZVBhZ2VDbGlja3ModHJhbnNhY3Rpb25TZXJ2aWNlKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9kaXNhYmxlID0gdHJ1ZVxuICAgICAgICBsb2dnaW5nU2VydmljZS53YXJuKCdSVU0gYWdlbnQgaXMgaW5hY3RpdmUnKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgLyoqXG4gICAqIGBmZXRjaENlbnRyYWxDb25maWdgIHJldHVybnMgYSBwcm9taXNlIHRoYXQgd2lsbCBhbHdheXMgcmVzb2x2ZVxuICAgKiBpZiB0aGUgaW50ZXJuYWwgY29uZmlnIGZldGNoIGZhaWxzIHRoZSB0aGUgcHJvbWlzZSByZXNvbHZlcyB0byBgdW5kZWZpbmVkYCBvdGhlcndpc2VcbiAgICogaXQgcmVzb2x2ZXMgdG8gdGhlIGZldGNoZWQgY29uZmlnLlxuICAgKi9cbiAgZmV0Y2hDZW50cmFsQ29uZmlnKCkge1xuICAgIGNvbnN0IFtcbiAgICAgIGFwbVNlcnZlcixcbiAgICAgIGxvZ2dpbmdTZXJ2aWNlLFxuICAgICAgY29uZmlnU2VydmljZVxuICAgIF0gPSB0aGlzLnNlcnZpY2VGYWN0b3J5LmdldFNlcnZpY2UoW1xuICAgICAgQVBNX1NFUlZFUixcbiAgICAgIExPR0dJTkdfU0VSVklDRSxcbiAgICAgIENPTkZJR19TRVJWSUNFXG4gICAgXSlcblxuICAgIHJldHVybiBhcG1TZXJ2ZXJcbiAgICAgIC5mZXRjaENvbmZpZyhcbiAgICAgICAgY29uZmlnU2VydmljZS5nZXQoJ3NlcnZpY2VOYW1lJyksXG4gICAgICAgIGNvbmZpZ1NlcnZpY2UuZ2V0KCdlbnZpcm9ubWVudCcpXG4gICAgICApXG4gICAgICAudGhlbihjb25maWcgPT4ge1xuICAgICAgICB2YXIgdHJhbnNhY3Rpb25TYW1wbGVSYXRlID0gY29uZmlnWyd0cmFuc2FjdGlvbl9zYW1wbGVfcmF0ZSddXG4gICAgICAgIGlmICh0cmFuc2FjdGlvblNhbXBsZVJhdGUpIHtcbiAgICAgICAgICB0cmFuc2FjdGlvblNhbXBsZVJhdGUgPSBOdW1iZXIodHJhbnNhY3Rpb25TYW1wbGVSYXRlKVxuICAgICAgICAgIGNvbnN0IGNvbmZpZyA9IHsgdHJhbnNhY3Rpb25TYW1wbGVSYXRlIH1cbiAgICAgICAgICBjb25zdCB7IGludmFsaWQgfSA9IGNvbmZpZ1NlcnZpY2UudmFsaWRhdGUoY29uZmlnKVxuICAgICAgICAgIGlmIChpbnZhbGlkLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgY29uZmlnU2VydmljZS5zZXRDb25maWcoY29uZmlnKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCB7IGtleSwgdmFsdWUsIGFsbG93ZWQgfSA9IGludmFsaWRbMF1cbiAgICAgICAgICAgIGxvZ2dpbmdTZXJ2aWNlLndhcm4oXG4gICAgICAgICAgICAgIGBpbnZhbGlkIHZhbHVlIFwiJHt2YWx1ZX1cIiBmb3IgJHtrZXl9LiBBbGxvd2VkOiAke2FsbG93ZWR9LmBcbiAgICAgICAgICAgIClcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbmZpZ1xuICAgICAgfSlcbiAgICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgIGxvZ2dpbmdTZXJ2aWNlLndhcm4oJ2ZhaWxlZCBmZXRjaGluZyBjb25maWc6JywgZXJyb3IpXG4gICAgICB9KVxuICB9XG5cbiAgX3NlbmRQYWdlTG9hZE1ldHJpY3MoKSB7XG4gICAgLyoqXG4gICAgICogTmFtZSBvZiB0aGUgdHJhbnNhY3Rpb24gaXMgc2V0IGluIHRyYW5zYWN0aW9uIHNlcnZpY2UgdG9cbiAgICAgKiBhdm9pZCBkdXBsaWNhdGluZyB0aGUgbG9naWMgYXQgbXVsdGlwbGUgcGxhY2VzXG4gICAgICovXG4gICAgY29uc3QgdHIgPSB0aGlzLnN0YXJ0VHJhbnNhY3Rpb24odW5kZWZpbmVkLCBQQUdFX0xPQUQsIHtcbiAgICAgIG1hbmFnZWQ6IHRydWUsXG4gICAgICBjYW5SZXVzZTogdHJ1ZVxuICAgIH0pXG5cbiAgICBpZiAoIXRyKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB0ci5hZGRUYXNrKFBBR0VfTE9BRClcbiAgICBjb25zdCBzZW5kUGFnZUxvYWRNZXRyaWNzID0gKCkgPT4ge1xuICAgICAgLy8gVGhlIHJlYXNvbnMgb2YgdGhpcyB0aW1lb3V0IGFyZTpcbiAgICAgIC8vIDEuIHRvIG1ha2Ugc3VyZSBQZXJmb3JtYW5jZVRpbWluZy5sb2FkRXZlbnRFbmQgaGFzIGEgdmFsdWUuXG4gICAgICAvLyAyLiB0byBtYWtlIHN1cmUgdGhlIGFnZW50IGludGVyY2VwdHMgYWxsIHRoZSBMQ1AgZW50cmllcyB0cmlnZ2VyZWQgYnkgdGhlIGJyb3dzZXIgKGFkZGluZyBhIGRlbGF5IGluIHRoZSB0aW1lb3V0KS5cbiAgICAgIC8vIFRoZSBicm93c2VyIG1pZ2h0IG5lZWQgbW9yZSB0aW1lIGFmdGVyIHRoZSBwYWdlbG9hZCBldmVudCB0byByZW5kZXIgb3RoZXIgZWxlbWVudHMgKGUuZy4gaW1hZ2VzKS5cbiAgICAgIC8vIFRoYXQncyBpbXBvcnRhbnQgYmVjYXVzZSBhIExDUCBpcyBvbmx5IHRyaWdnZXJlZCB3aGVuIHRoZSByZWxhdGVkIGVsZW1lbnQgaXMgY29tcGxldGVseSByZW5kZXJlZC5cbiAgICAgIC8vIGh0dHBzOi8vdzNjLmdpdGh1Yi5pby9sYXJnZXN0LWNvbnRlbnRmdWwtcGFpbnQvI3NlYy1hZGQtbGNwLWVudHJ5XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHRyLnJlbW92ZVRhc2soUEFHRV9MT0FEKSwgUEFHRV9MT0FEX0RFTEFZKVxuICAgIH1cblxuICAgIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnKSB7XG4gICAgICBzZW5kUGFnZUxvYWRNZXRyaWNzKClcbiAgICB9IGVsc2Uge1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBzZW5kUGFnZUxvYWRNZXRyaWNzKVxuICAgIH1cbiAgfVxuXG4gIG9ic2VydmUobmFtZSwgZm4pIHtcbiAgICBjb25zdCBjb25maWdTZXJ2aWNlID0gdGhpcy5zZXJ2aWNlRmFjdG9yeS5nZXRTZXJ2aWNlKENPTkZJR19TRVJWSUNFKVxuICAgIGNvbmZpZ1NlcnZpY2UuZXZlbnRzLm9ic2VydmUobmFtZSwgZm4pXG4gIH1cblxuICAvKipcbiAgICogV2hlbiB0aGUgcmVxdWlyZWQgY29uZmlnIGtleXMgYXJlIGludmFsaWQsIHRoZSBhZ2VudCBpcyBkZWFjdGl2YXRlZCB3aXRoXG4gICAqIGxvZ2dpbmcgZXJyb3IgdG8gdGhlIGNvbnNvbGVcbiAgICpcbiAgICogdmFsaWRhdGlvbiBlcnJvciBmb3JtYXRcbiAgICoge1xuICAgKiAgbWlzc2luZzogWyAna2V5MScsICdrZXkyJ10sXG4gICAqICBpbnZhbGlkOiBbe1xuICAgKiAgICBrZXk6ICdhJyxcbiAgICogICAgdmFsdWU6ICdhYmNkJyxcbiAgICogICAgYWxsb3dlZDogJ3N0cmluZydcbiAgICogIH1dLFxuICAgKiAgdW5rbm93bjogWydrZXkzJywgJ2tleTQnXVxuICAgKiB9XG4gICAqL1xuICBjb25maWcoY29uZmlnKSB7XG4gICAgY29uc3QgW2NvbmZpZ1NlcnZpY2UsIGxvZ2dpbmdTZXJ2aWNlXSA9IHRoaXMuc2VydmljZUZhY3RvcnkuZ2V0U2VydmljZShbXG4gICAgICBDT05GSUdfU0VSVklDRSxcbiAgICAgIExPR0dJTkdfU0VSVklDRVxuICAgIF0pXG4gICAgY29uc3QgeyBtaXNzaW5nLCBpbnZhbGlkLCB1bmtub3duIH0gPSBjb25maWdTZXJ2aWNlLnZhbGlkYXRlKGNvbmZpZylcbiAgICBpZiAodW5rbm93bi5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBtZXNzYWdlID1cbiAgICAgICAgJ1Vua25vd24gY29uZmlnIG9wdGlvbnMgYXJlIHNwZWNpZmllZCBmb3IgUlVNIGFnZW50OiAnICtcbiAgICAgICAgdW5rbm93bi5qb2luKCcsICcpXG4gICAgICBsb2dnaW5nU2VydmljZS53YXJuKG1lc3NhZ2UpXG4gICAgfVxuXG4gICAgaWYgKG1pc3NpbmcubGVuZ3RoID09PSAwICYmIGludmFsaWQubGVuZ3RoID09PSAwKSB7XG4gICAgICBjb25maWdTZXJ2aWNlLnNldENvbmZpZyhjb25maWcpXG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHNlcGFyYXRvciA9ICcsICdcbiAgICAgIGxldCBtZXNzYWdlID0gXCJSVU0gYWdlbnQgaXNuJ3QgY29ycmVjdGx5IGNvbmZpZ3VyZWQuIFwiXG5cbiAgICAgIGlmIChtaXNzaW5nLmxlbmd0aCA+IDApIHtcbiAgICAgICAgbWVzc2FnZSArPSBtaXNzaW5nLmpvaW4oc2VwYXJhdG9yKSArICcgaXMgbWlzc2luZydcbiAgICAgICAgaWYgKGludmFsaWQubGVuZ3RoID4gMCkge1xuICAgICAgICAgIG1lc3NhZ2UgKz0gc2VwYXJhdG9yXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaW52YWxpZC5mb3JFYWNoKCh7IGtleSwgdmFsdWUsIGFsbG93ZWQgfSwgaW5kZXgpID0+IHtcbiAgICAgICAgbWVzc2FnZSArPVxuICAgICAgICAgIGAke2tleX0gXCIke3ZhbHVlfVwiIGNvbnRhaW5zIGludmFsaWQgY2hhcmFjdGVycyEgKGFsbG93ZWQ6ICR7YWxsb3dlZH0pYCArXG4gICAgICAgICAgKGluZGV4ICE9PSBpbnZhbGlkLmxlbmd0aCAtIDEgPyBzZXBhcmF0b3IgOiAnJylcbiAgICAgIH0pXG4gICAgICBsb2dnaW5nU2VydmljZS5lcnJvcihtZXNzYWdlKVxuICAgICAgY29uZmlnU2VydmljZS5zZXRDb25maWcoeyBhY3RpdmU6IGZhbHNlIH0pXG4gICAgfVxuICB9XG5cbiAgc2V0VXNlckNvbnRleHQodXNlckNvbnRleHQpIHtcbiAgICB2YXIgY29uZmlnU2VydmljZSA9IHRoaXMuc2VydmljZUZhY3RvcnkuZ2V0U2VydmljZShDT05GSUdfU0VSVklDRSlcbiAgICBjb25maWdTZXJ2aWNlLnNldFVzZXJDb250ZXh0KHVzZXJDb250ZXh0KVxuICB9XG5cbiAgc2V0Q3VzdG9tQ29udGV4dChjdXN0b21Db250ZXh0KSB7XG4gICAgdmFyIGNvbmZpZ1NlcnZpY2UgPSB0aGlzLnNlcnZpY2VGYWN0b3J5LmdldFNlcnZpY2UoQ09ORklHX1NFUlZJQ0UpXG4gICAgY29uZmlnU2VydmljZS5zZXRDdXN0b21Db250ZXh0KGN1c3RvbUNvbnRleHQpXG4gIH1cblxuICBhZGRMYWJlbHMobGFiZWxzKSB7XG4gICAgdmFyIGNvbmZpZ1NlcnZpY2UgPSB0aGlzLnNlcnZpY2VGYWN0b3J5LmdldFNlcnZpY2UoQ09ORklHX1NFUlZJQ0UpXG4gICAgY29uZmlnU2VydmljZS5hZGRMYWJlbHMobGFiZWxzKVxuICB9XG5cbiAgLy8gU2hvdWxkIGNhbGwgdGhpcyBtZXRob2QgYmVmb3JlICdsb2FkJyBldmVudCBvbiB3aW5kb3cgaXMgZmlyZWRcbiAgc2V0SW5pdGlhbFBhZ2VMb2FkTmFtZShuYW1lKSB7XG4gICAgY29uc3QgY29uZmlnU2VydmljZSA9IHRoaXMuc2VydmljZUZhY3RvcnkuZ2V0U2VydmljZShDT05GSUdfU0VSVklDRSlcbiAgICBjb25maWdTZXJ2aWNlLnNldENvbmZpZyh7XG4gICAgICBwYWdlTG9hZFRyYW5zYWN0aW9uTmFtZTogbmFtZVxuICAgIH0pXG4gIH1cblxuICBzdGFydFRyYW5zYWN0aW9uKG5hbWUsIHR5cGUsIG9wdGlvbnMpIHtcbiAgICBpZiAodGhpcy5pc0VuYWJsZWQoKSkge1xuICAgICAgdmFyIHRyYW5zYWN0aW9uU2VydmljZSA9IHRoaXMuc2VydmljZUZhY3RvcnkuZ2V0U2VydmljZShcbiAgICAgICAgVFJBTlNBQ1RJT05fU0VSVklDRVxuICAgICAgKVxuICAgICAgcmV0dXJuIHRyYW5zYWN0aW9uU2VydmljZS5zdGFydFRyYW5zYWN0aW9uKG5hbWUsIHR5cGUsIG9wdGlvbnMpXG4gICAgfVxuICB9XG5cbiAgc3RhcnRTcGFuKG5hbWUsIHR5cGUsIG9wdGlvbnMpIHtcbiAgICBpZiAodGhpcy5pc0VuYWJsZWQoKSkge1xuICAgICAgdmFyIHRyYW5zYWN0aW9uU2VydmljZSA9IHRoaXMuc2VydmljZUZhY3RvcnkuZ2V0U2VydmljZShcbiAgICAgICAgVFJBTlNBQ1RJT05fU0VSVklDRVxuICAgICAgKVxuICAgICAgcmV0dXJuIHRyYW5zYWN0aW9uU2VydmljZS5zdGFydFNwYW4obmFtZSwgdHlwZSwgb3B0aW9ucylcbiAgICB9XG4gIH1cblxuICBnZXRDdXJyZW50VHJhbnNhY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuaXNFbmFibGVkKCkpIHtcbiAgICAgIHZhciB0cmFuc2FjdGlvblNlcnZpY2UgPSB0aGlzLnNlcnZpY2VGYWN0b3J5LmdldFNlcnZpY2UoXG4gICAgICAgIFRSQU5TQUNUSU9OX1NFUlZJQ0VcbiAgICAgIClcbiAgICAgIHJldHVybiB0cmFuc2FjdGlvblNlcnZpY2UuZ2V0Q3VycmVudFRyYW5zYWN0aW9uKClcbiAgICB9XG4gIH1cblxuICBjYXB0dXJlRXJyb3IoZXJyb3IpIHtcbiAgICBpZiAodGhpcy5pc0VuYWJsZWQoKSkge1xuICAgICAgdmFyIGVycm9yTG9nZ2luZyA9IHRoaXMuc2VydmljZUZhY3RvcnkuZ2V0U2VydmljZShFUlJPUl9MT0dHSU5HKVxuICAgICAgcmV0dXJuIGVycm9yTG9nZ2luZy5sb2dFcnJvcihlcnJvcilcbiAgICB9XG4gIH1cblxuICBhZGRGaWx0ZXIoZm4pIHtcbiAgICB2YXIgY29uZmlnU2VydmljZSA9IHRoaXMuc2VydmljZUZhY3RvcnkuZ2V0U2VydmljZShDT05GSUdfU0VSVklDRSlcbiAgICBjb25maWdTZXJ2aWNlLmFkZEZpbHRlcihmbilcbiAgfVxufVxuIiwiKGZ1bmN0aW9uKHJvb3QsIGZhY3RvcnkpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgLy8gVW5pdmVyc2FsIE1vZHVsZSBEZWZpbml0aW9uIChVTUQpIHRvIHN1cHBvcnQgQU1ELCBDb21tb25KUy9Ob2RlLmpzLCBSaGlubywgYW5kIGJyb3dzZXJzLlxuXG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZSgnZXJyb3Itc3RhY2stcGFyc2VyJywgWydzdGFja2ZyYW1lJ10sIGZhY3RvcnkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeShyZXF1aXJlKCdzdGFja2ZyYW1lJykpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJvb3QuRXJyb3JTdGFja1BhcnNlciA9IGZhY3Rvcnkocm9vdC5TdGFja0ZyYW1lKTtcbiAgICB9XG59KHRoaXMsIGZ1bmN0aW9uIEVycm9yU3RhY2tQYXJzZXIoU3RhY2tGcmFtZSkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBGSVJFRk9YX1NBRkFSSV9TVEFDS19SRUdFWFAgPSAvKF58QClcXFMrXFw6XFxkKy87XG4gICAgdmFyIENIUk9NRV9JRV9TVEFDS19SRUdFWFAgPSAvXlxccyphdCAuKihcXFMrXFw6XFxkK3xcXChuYXRpdmVcXCkpL207XG4gICAgdmFyIFNBRkFSSV9OQVRJVkVfQ09ERV9SRUdFWFAgPSAvXihldmFsQCk/KFxcW25hdGl2ZSBjb2RlXFxdKT8kLztcblxuICAgIGZ1bmN0aW9uIF9tYXAoYXJyYXksIGZuLCB0aGlzQXJnKSB7XG4gICAgICAgIGlmICh0eXBlb2YgQXJyYXkucHJvdG90eXBlLm1hcCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgcmV0dXJuIGFycmF5Lm1hcChmbiwgdGhpc0FyZyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgb3V0cHV0ID0gbmV3IEFycmF5KGFycmF5Lmxlbmd0aCk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgb3V0cHV0W2ldID0gZm4uY2FsbCh0aGlzQXJnLCBhcnJheVtpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gb3V0cHV0O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX2ZpbHRlcihhcnJheSwgZm4sIHRoaXNBcmcpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBBcnJheS5wcm90b3R5cGUuZmlsdGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICByZXR1cm4gYXJyYXkuZmlsdGVyKGZuLCB0aGlzQXJnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBvdXRwdXQgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZiAoZm4uY2FsbCh0aGlzQXJnLCBhcnJheVtpXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgb3V0cHV0LnB1c2goYXJyYXlbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBfaW5kZXhPZihhcnJheSwgdGFyZ2V0KSB7XG4gICAgICAgIGlmICh0eXBlb2YgQXJyYXkucHJvdG90eXBlLmluZGV4T2YgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHJldHVybiBhcnJheS5pbmRleE9mKHRhcmdldCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFycmF5W2ldID09PSB0YXJnZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEdpdmVuIGFuIEVycm9yIG9iamVjdCwgZXh0cmFjdCB0aGUgbW9zdCBpbmZvcm1hdGlvbiBmcm9tIGl0LlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge0Vycm9yfSBlcnJvciBvYmplY3RcbiAgICAgICAgICogQHJldHVybiB7QXJyYXl9IG9mIFN0YWNrRnJhbWVzXG4gICAgICAgICAqL1xuICAgICAgICBwYXJzZTogZnVuY3Rpb24gRXJyb3JTdGFja1BhcnNlciQkcGFyc2UoZXJyb3IpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZXJyb3Iuc3RhY2t0cmFjZSAhPT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIGVycm9yWydvcGVyYSNzb3VyY2Vsb2MnXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZU9wZXJhKGVycm9yKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXJyb3Iuc3RhY2sgJiYgZXJyb3Iuc3RhY2subWF0Y2goQ0hST01FX0lFX1NUQUNLX1JFR0VYUCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZVY4T3JJRShlcnJvcik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGVycm9yLnN0YWNrKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFyc2VGRk9yU2FmYXJpKGVycm9yKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgcGFyc2UgZ2l2ZW4gRXJyb3Igb2JqZWN0Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gU2VwYXJhdGUgbGluZSBhbmQgY29sdW1uIG51bWJlcnMgZnJvbSBhIHN0cmluZyBvZiB0aGUgZm9ybTogKFVSSTpMaW5lOkNvbHVtbilcbiAgICAgICAgZXh0cmFjdExvY2F0aW9uOiBmdW5jdGlvbiBFcnJvclN0YWNrUGFyc2VyJCRleHRyYWN0TG9jYXRpb24odXJsTGlrZSkge1xuICAgICAgICAgICAgLy8gRmFpbC1mYXN0IGJ1dCByZXR1cm4gbG9jYXRpb25zIGxpa2UgXCIobmF0aXZlKVwiXG4gICAgICAgICAgICBpZiAodXJsTGlrZS5pbmRleE9mKCc6JykgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFt1cmxMaWtlXTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIHJlZ0V4cCA9IC8oLis/KSg/OlxcOihcXGQrKSk/KD86XFw6KFxcZCspKT8kLztcbiAgICAgICAgICAgIHZhciBwYXJ0cyA9IHJlZ0V4cC5leGVjKHVybExpa2UucmVwbGFjZSgvW1xcKFxcKV0vZywgJycpKTtcbiAgICAgICAgICAgIHJldHVybiBbcGFydHNbMV0sIHBhcnRzWzJdIHx8IHVuZGVmaW5lZCwgcGFydHNbM10gfHwgdW5kZWZpbmVkXTtcbiAgICAgICAgfSxcblxuICAgICAgICBwYXJzZVY4T3JJRTogZnVuY3Rpb24gRXJyb3JTdGFja1BhcnNlciQkcGFyc2VWOE9ySUUoZXJyb3IpIHtcbiAgICAgICAgICAgIHZhciBmaWx0ZXJlZCA9IF9maWx0ZXIoZXJyb3Iuc3RhY2suc3BsaXQoJ1xcbicpLCBmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICEhbGluZS5tYXRjaChDSFJPTUVfSUVfU1RBQ0tfUkVHRVhQKTtcbiAgICAgICAgICAgIH0sIHRoaXMpO1xuXG4gICAgICAgICAgICByZXR1cm4gX21hcChmaWx0ZXJlZCwgZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgICAgIGlmIChsaW5lLmluZGV4T2YoJyhldmFsICcpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gVGhyb3cgYXdheSBldmFsIGluZm9ybWF0aW9uIHVudGlsIHdlIGltcGxlbWVudCBzdGFja3RyYWNlLmpzL3N0YWNrZnJhbWUjOFxuICAgICAgICAgICAgICAgICAgICBsaW5lID0gbGluZS5yZXBsYWNlKC9ldmFsIGNvZGUvZywgJ2V2YWwnKS5yZXBsYWNlKC8oXFwoZXZhbCBhdCBbXlxcKCldKil8KFxcKVxcLC4qJCkvZywgJycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgdG9rZW5zID0gbGluZS5yZXBsYWNlKC9eXFxzKy8sICcnKS5yZXBsYWNlKC9cXChldmFsIGNvZGUvZywgJygnKS5zcGxpdCgvXFxzKy8pLnNsaWNlKDEpO1xuICAgICAgICAgICAgICAgIHZhciBsb2NhdGlvblBhcnRzID0gdGhpcy5leHRyYWN0TG9jYXRpb24odG9rZW5zLnBvcCgpKTtcbiAgICAgICAgICAgICAgICB2YXIgZnVuY3Rpb25OYW1lID0gdG9rZW5zLmpvaW4oJyAnKSB8fCB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgdmFyIGZpbGVOYW1lID0gX2luZGV4T2YoWydldmFsJywgJzxhbm9ueW1vdXM+J10sIGxvY2F0aW9uUGFydHNbMF0pID4gLTEgPyB1bmRlZmluZWQgOiBsb2NhdGlvblBhcnRzWzBdO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBTdGFja0ZyYW1lKGZ1bmN0aW9uTmFtZSwgdW5kZWZpbmVkLCBmaWxlTmFtZSwgbG9jYXRpb25QYXJ0c1sxXSwgbG9jYXRpb25QYXJ0c1syXSwgbGluZSk7XG4gICAgICAgICAgICB9LCB0aGlzKTtcbiAgICAgICAgfSxcblxuICAgICAgICBwYXJzZUZGT3JTYWZhcmk6IGZ1bmN0aW9uIEVycm9yU3RhY2tQYXJzZXIkJHBhcnNlRkZPclNhZmFyaShlcnJvcikge1xuICAgICAgICAgICAgdmFyIGZpbHRlcmVkID0gX2ZpbHRlcihlcnJvci5zdGFjay5zcGxpdCgnXFxuJyksIGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gIWxpbmUubWF0Y2goU0FGQVJJX05BVElWRV9DT0RFX1JFR0VYUCk7XG4gICAgICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICAgICAgcmV0dXJuIF9tYXAoZmlsdGVyZWQsIGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgICAgICAvLyBUaHJvdyBhd2F5IGV2YWwgaW5mb3JtYXRpb24gdW50aWwgd2UgaW1wbGVtZW50IHN0YWNrdHJhY2UuanMvc3RhY2tmcmFtZSM4XG4gICAgICAgICAgICAgICAgaWYgKGxpbmUuaW5kZXhPZignID4gZXZhbCcpID4gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgbGluZSA9IGxpbmUucmVwbGFjZSgvIGxpbmUgKFxcZCspKD86ID4gZXZhbCBsaW5lIFxcZCspKiA+IGV2YWxcXDpcXGQrXFw6XFxkKy9nLCAnOiQxJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKGxpbmUuaW5kZXhPZignQCcpID09PSAtMSAmJiBsaW5lLmluZGV4T2YoJzonKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gU2FmYXJpIGV2YWwgZnJhbWVzIG9ubHkgaGF2ZSBmdW5jdGlvbiBuYW1lcyBhbmQgbm90aGluZyBlbHNlXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgU3RhY2tGcmFtZShsaW5lKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdG9rZW5zID0gbGluZS5zcGxpdCgnQCcpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgbG9jYXRpb25QYXJ0cyA9IHRoaXMuZXh0cmFjdExvY2F0aW9uKHRva2Vucy5wb3AoKSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmdW5jdGlvbk5hbWUgPSB0b2tlbnMuam9pbignQCcpIHx8IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBTdGFja0ZyYW1lKGZ1bmN0aW9uTmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uUGFydHNbMF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvblBhcnRzWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgbG9jYXRpb25QYXJ0c1syXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHBhcnNlT3BlcmE6IGZ1bmN0aW9uIEVycm9yU3RhY2tQYXJzZXIkJHBhcnNlT3BlcmEoZSkge1xuICAgICAgICAgICAgaWYgKCFlLnN0YWNrdHJhY2UgfHwgKGUubWVzc2FnZS5pbmRleE9mKCdcXG4nKSA+IC0xICYmXG4gICAgICAgICAgICAgICAgZS5tZXNzYWdlLnNwbGl0KCdcXG4nKS5sZW5ndGggPiBlLnN0YWNrdHJhY2Uuc3BsaXQoJ1xcbicpLmxlbmd0aCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZU9wZXJhOShlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIWUuc3RhY2spIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wYXJzZU9wZXJhMTAoZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBhcnNlT3BlcmExMShlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBwYXJzZU9wZXJhOTogZnVuY3Rpb24gRXJyb3JTdGFja1BhcnNlciQkcGFyc2VPcGVyYTkoZSkge1xuICAgICAgICAgICAgdmFyIGxpbmVSRSA9IC9MaW5lIChcXGQrKS4qc2NyaXB0ICg/OmluICk/KFxcUyspL2k7XG4gICAgICAgICAgICB2YXIgbGluZXMgPSBlLm1lc3NhZ2Uuc3BsaXQoJ1xcbicpO1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMiwgbGVuID0gbGluZXMubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDIpIHtcbiAgICAgICAgICAgICAgICB2YXIgbWF0Y2ggPSBsaW5lUkUuZXhlYyhsaW5lc1tpXSk7XG4gICAgICAgICAgICAgICAgaWYgKG1hdGNoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKG5ldyBTdGFja0ZyYW1lKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBtYXRjaFsyXSwgbWF0Y2hbMV0sIHVuZGVmaW5lZCwgbGluZXNbaV0pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgcGFyc2VPcGVyYTEwOiBmdW5jdGlvbiBFcnJvclN0YWNrUGFyc2VyJCRwYXJzZU9wZXJhMTAoZSkge1xuICAgICAgICAgICAgdmFyIGxpbmVSRSA9IC9MaW5lIChcXGQrKS4qc2NyaXB0ICg/OmluICk/KFxcUyspKD86OiBJbiBmdW5jdGlvbiAoXFxTKykpPyQvaTtcbiAgICAgICAgICAgIHZhciBsaW5lcyA9IGUuc3RhY2t0cmFjZS5zcGxpdCgnXFxuJyk7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XG5cbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBsaW5lcy5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMikge1xuICAgICAgICAgICAgICAgIHZhciBtYXRjaCA9IGxpbmVSRS5leGVjKGxpbmVzW2ldKTtcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgU3RhY2tGcmFtZShcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXRjaFszXSB8fCB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoWzJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hdGNoWzFdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lc1tpXVxuICAgICAgICAgICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBPcGVyYSAxMC42NSsgRXJyb3Iuc3RhY2sgdmVyeSBzaW1pbGFyIHRvIEZGL1NhZmFyaVxuICAgICAgICBwYXJzZU9wZXJhMTE6IGZ1bmN0aW9uIEVycm9yU3RhY2tQYXJzZXIkJHBhcnNlT3BlcmExMShlcnJvcikge1xuICAgICAgICAgICAgdmFyIGZpbHRlcmVkID0gX2ZpbHRlcihlcnJvci5zdGFjay5zcGxpdCgnXFxuJyksIGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gISFsaW5lLm1hdGNoKEZJUkVGT1hfU0FGQVJJX1NUQUNLX1JFR0VYUCkgJiYgIWxpbmUubWF0Y2goL15FcnJvciBjcmVhdGVkIGF0Lyk7XG4gICAgICAgICAgICB9LCB0aGlzKTtcblxuICAgICAgICAgICAgcmV0dXJuIF9tYXAoZmlsdGVyZWQsIGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgICAgICB2YXIgdG9rZW5zID0gbGluZS5zcGxpdCgnQCcpO1xuICAgICAgICAgICAgICAgIHZhciBsb2NhdGlvblBhcnRzID0gdGhpcy5leHRyYWN0TG9jYXRpb24odG9rZW5zLnBvcCgpKTtcbiAgICAgICAgICAgICAgICB2YXIgZnVuY3Rpb25DYWxsID0gKHRva2Vucy5zaGlmdCgpIHx8ICcnKTtcbiAgICAgICAgICAgICAgICB2YXIgZnVuY3Rpb25OYW1lID0gZnVuY3Rpb25DYWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvPGFub255bW91cyBmdW5jdGlvbig6IChcXHcrKSk/Pi8sICckMicpXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFwoW15cXCldKlxcKS9nLCAnJykgfHwgdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIHZhciBhcmdzUmF3O1xuICAgICAgICAgICAgICAgIGlmIChmdW5jdGlvbkNhbGwubWF0Y2goL1xcKChbXlxcKV0qKVxcKS8pKSB7XG4gICAgICAgICAgICAgICAgICAgIGFyZ3NSYXcgPSBmdW5jdGlvbkNhbGwucmVwbGFjZSgvXlteXFwoXStcXCgoW15cXCldKilcXCkkLywgJyQxJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBhcmdzID0gKGFyZ3NSYXcgPT09IHVuZGVmaW5lZCB8fCBhcmdzUmF3ID09PSAnW2FyZ3VtZW50cyBub3QgYXZhaWxhYmxlXScpID9cbiAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkIDogYXJnc1Jhdy5zcGxpdCgnLCcpO1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgU3RhY2tGcmFtZShcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb25OYW1lLFxuICAgICAgICAgICAgICAgICAgICBhcmdzLFxuICAgICAgICAgICAgICAgICAgICBsb2NhdGlvblBhcnRzWzBdLFxuICAgICAgICAgICAgICAgICAgICBsb2NhdGlvblBhcnRzWzFdLFxuICAgICAgICAgICAgICAgICAgICBsb2NhdGlvblBhcnRzWzJdLFxuICAgICAgICAgICAgICAgICAgICBsaW5lKTtcbiAgICAgICAgICAgIH0sIHRoaXMpO1xuICAgICAgICB9XG4gICAgfTtcbn0pKTtcblxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG4vKipcbiAqIFRoZSBGT1JNQVRfQklOQVJZIGZvcm1hdCByZXByZXNlbnRzIFNwYW5Db250ZXh0cyBpbiBhbiBvcGFxdWUgYmluYXJ5XG4gKiBjYXJyaWVyLlxuICpcbiAqIFRyYWNlci5pbmplY3QoKSB3aWxsIHNldCB0aGUgYnVmZmVyIGZpZWxkIHRvIGFuIEFycmF5LWxpa2UgKEFycmF5LFxuICogQXJyYXlCdWZmZXIsIG9yIFR5cGVkQnVmZmVyKSBvYmplY3QgY29udGFpbmluZyB0aGUgaW5qZWN0ZWQgYmluYXJ5IGRhdGEuXG4gKiBBbnkgdmFsaWQgT2JqZWN0IGNhbiBiZSB1c2VkIGFzIGxvbmcgYXMgdGhlIGJ1ZmZlciBmaWVsZCBvZiB0aGUgb2JqZWN0XG4gKiBjYW4gYmUgc2V0LlxuICpcbiAqIFRyYWNlci5leHRyYWN0KCkgd2lsbCBsb29rIGZvciBgY2Fycmllci5idWZmZXJgLCBhbmQgdGhhdCBmaWVsZCBpc1xuICogZXhwZWN0ZWQgdG8gYmUgYW4gQXJyYXktbGlrZSBvYmplY3QgKEFycmF5LCBBcnJheUJ1ZmZlciwgb3JcbiAqIFR5cGVkQnVmZmVyKS5cbiAqL1xuZXhwb3J0cy5GT1JNQVRfQklOQVJZID0gJ2JpbmFyeSc7XG4vKipcbiAqIFRoZSBGT1JNQVRfVEVYVF9NQVAgZm9ybWF0IHJlcHJlc2VudHMgU3BhbkNvbnRleHRzIHVzaW5nIGFcbiAqIHN0cmluZy0+c3RyaW5nIG1hcCAoYmFja2VkIGJ5IGEgSmF2YXNjcmlwdCBPYmplY3QpIGFzIGEgY2Fycmllci5cbiAqXG4gKiBOT1RFOiBVbmxpa2UgRk9STUFUX0hUVFBfSEVBREVSUywgRk9STUFUX1RFWFRfTUFQIHBsYWNlcyBubyByZXN0cmljdGlvbnNcbiAqIG9uIHRoZSBjaGFyYWN0ZXJzIHVzZWQgaW4gZWl0aGVyIHRoZSBrZXlzIG9yIHRoZSB2YWx1ZXMgb2YgdGhlIG1hcFxuICogZW50cmllcy5cbiAqXG4gKiBUaGUgRk9STUFUX1RFWFRfTUFQIGNhcnJpZXIgbWFwIG1heSBjb250YWluIHVucmVsYXRlZCBkYXRhIChlLmcuLFxuICogYXJiaXRyYXJ5IGdSUEMgbWV0YWRhdGEpOyBhcyBzdWNoLCB0aGUgVHJhY2VyIGltcGxlbWVudGF0aW9uIHNob3VsZCB1c2VcbiAqIGEgcHJlZml4IG9yIG90aGVyIGNvbnZlbnRpb24gdG8gZGlzdGluZ3Vpc2ggVHJhY2VyLXNwZWNpZmljIGtleTp2YWx1ZVxuICogcGFpcnMuXG4gKi9cbmV4cG9ydHMuRk9STUFUX1RFWFRfTUFQID0gJ3RleHRfbWFwJztcbi8qKlxuICogVGhlIEZPUk1BVF9IVFRQX0hFQURFUlMgZm9ybWF0IHJlcHJlc2VudHMgU3BhbkNvbnRleHRzIHVzaW5nIGFcbiAqIGNoYXJhY3Rlci1yZXN0cmljdGVkIHN0cmluZy0+c3RyaW5nIG1hcCAoYmFja2VkIGJ5IGEgSmF2YXNjcmlwdCBPYmplY3QpXG4gKiBhcyBhIGNhcnJpZXIuXG4gKlxuICogS2V5cyBhbmQgdmFsdWVzIGluIHRoZSBGT1JNQVRfSFRUUF9IRUFERVJTIGNhcnJpZXIgbXVzdCBiZSBzdWl0YWJsZSBmb3JcbiAqIHVzZSBhcyBIVFRQIGhlYWRlcnMgKHdpdGhvdXQgbW9kaWZpY2F0aW9uIG9yIGZ1cnRoZXIgZXNjYXBpbmcpLiBUaGF0IGlzLFxuICogdGhlIGtleXMgaGF2ZSBhIGdyZWF0bHkgcmVzdHJpY3RlZCBjaGFyYWN0ZXIgc2V0LCBjYXNpbmcgZm9yIHRoZSBrZXlzXG4gKiBtYXkgbm90IGJlIHByZXNlcnZlZCBieSB2YXJpb3VzIGludGVybWVkaWFyaWVzLCBhbmQgdGhlIHZhbHVlcyBzaG91bGQgYmVcbiAqIFVSTC1lc2NhcGVkLlxuICpcbiAqIFRoZSBGT1JNQVRfSFRUUF9IRUFERVJTIGNhcnJpZXIgbWFwIG1heSBjb250YWluIHVucmVsYXRlZCBkYXRhIChlLmcuLFxuICogYXJiaXRyYXJ5IEhUVFAgaGVhZGVycyk7IGFzIHN1Y2gsIHRoZSBUcmFjZXIgaW1wbGVtZW50YXRpb24gc2hvdWxkIHVzZSBhXG4gKiBwcmVmaXggb3Igb3RoZXIgY29udmVudGlvbiB0byBkaXN0aW5ndWlzaCBUcmFjZXItc3BlY2lmaWMga2V5OnZhbHVlXG4gKiBwYWlycy5cbiAqL1xuZXhwb3J0cy5GT1JNQVRfSFRUUF9IRUFERVJTID0gJ2h0dHBfaGVhZGVycyc7XG4vKipcbiAqIEEgU3BhbiBtYXkgYmUgdGhlIFwiY2hpbGQgb2ZcIiBhIHBhcmVudCBTcGFuLiBJbiBhIOKAnGNoaWxkIG9m4oCdIHJlZmVyZW5jZSxcbiAqIHRoZSBwYXJlbnQgU3BhbiBkZXBlbmRzIG9uIHRoZSBjaGlsZCBTcGFuIGluIHNvbWUgY2FwYWNpdHkuXG4gKlxuICogU2VlIG1vcmUgYWJvdXQgcmVmZXJlbmNlIHR5cGVzIGF0IGh0dHBzOi8vZ2l0aHViLmNvbS9vcGVudHJhY2luZy9zcGVjaWZpY2F0aW9uXG4gKi9cbmV4cG9ydHMuUkVGRVJFTkNFX0NISUxEX09GID0gJ2NoaWxkX29mJztcbi8qKlxuICogU29tZSBwYXJlbnQgU3BhbnMgZG8gbm90IGRlcGVuZCBpbiBhbnkgd2F5IG9uIHRoZSByZXN1bHQgb2YgdGhlaXIgY2hpbGRcbiAqIFNwYW5zLiBJbiB0aGVzZSBjYXNlcywgd2Ugc2F5IG1lcmVseSB0aGF0IHRoZSBjaGlsZCBTcGFuIOKAnGZvbGxvd3MgZnJvbeKAnVxuICogdGhlIHBhcmVudCBTcGFuIGluIGEgY2F1c2FsIHNlbnNlLlxuICpcbiAqIFNlZSBtb3JlIGFib3V0IHJlZmVyZW5jZSB0eXBlcyBhdCBodHRwczovL2dpdGh1Yi5jb20vb3BlbnRyYWNpbmcvc3BlY2lmaWNhdGlvblxuICovXG5leHBvcnRzLlJFRkVSRU5DRV9GT0xMT1dTX0ZST00gPSAnZm9sbG93c19mcm9tJztcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNvbnN0YW50cy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBDb25zdGFudHMgPSByZXF1aXJlKFwiLi9jb25zdGFudHNcIik7XG52YXIgcmVmZXJlbmNlXzEgPSByZXF1aXJlKFwiLi9yZWZlcmVuY2VcIik7XG52YXIgc3Bhbl8xID0gcmVxdWlyZShcIi4vc3BhblwiKTtcbi8qKlxuICogUmV0dXJuIGEgbmV3IFJFRkVSRU5DRV9DSElMRF9PRiByZWZlcmVuY2UuXG4gKlxuICogQHBhcmFtIHtTcGFuQ29udGV4dH0gc3BhbkNvbnRleHQgLSB0aGUgcGFyZW50IFNwYW5Db250ZXh0IGluc3RhbmNlIHRvXG4gKiAgICAgICAgcmVmZXJlbmNlLlxuICogQHJldHVybiBhIFJFRkVSRU5DRV9DSElMRF9PRiByZWZlcmVuY2UgcG9pbnRpbmcgdG8gYHNwYW5Db250ZXh0YFxuICovXG5mdW5jdGlvbiBjaGlsZE9mKHNwYW5Db250ZXh0KSB7XG4gICAgLy8gQWxsb3cgdGhlIHVzZXIgdG8gcGFzcyBhIFNwYW4gaW5zdGVhZCBvZiBhIFNwYW5Db250ZXh0XG4gICAgaWYgKHNwYW5Db250ZXh0IGluc3RhbmNlb2Ygc3Bhbl8xLmRlZmF1bHQpIHtcbiAgICAgICAgc3BhbkNvbnRleHQgPSBzcGFuQ29udGV4dC5jb250ZXh0KCk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgcmVmZXJlbmNlXzEuZGVmYXVsdChDb25zdGFudHMuUkVGRVJFTkNFX0NISUxEX09GLCBzcGFuQ29udGV4dCk7XG59XG5leHBvcnRzLmNoaWxkT2YgPSBjaGlsZE9mO1xuLyoqXG4gKiBSZXR1cm4gYSBuZXcgUkVGRVJFTkNFX0ZPTExPV1NfRlJPTSByZWZlcmVuY2UuXG4gKlxuICogQHBhcmFtIHtTcGFuQ29udGV4dH0gc3BhbkNvbnRleHQgLSB0aGUgcGFyZW50IFNwYW5Db250ZXh0IGluc3RhbmNlIHRvXG4gKiAgICAgICAgcmVmZXJlbmNlLlxuICogQHJldHVybiBhIFJFRkVSRU5DRV9GT0xMT1dTX0ZST00gcmVmZXJlbmNlIHBvaW50aW5nIHRvIGBzcGFuQ29udGV4dGBcbiAqL1xuZnVuY3Rpb24gZm9sbG93c0Zyb20oc3BhbkNvbnRleHQpIHtcbiAgICAvLyBBbGxvdyB0aGUgdXNlciB0byBwYXNzIGEgU3BhbiBpbnN0ZWFkIG9mIGEgU3BhbkNvbnRleHRcbiAgICBpZiAoc3BhbkNvbnRleHQgaW5zdGFuY2VvZiBzcGFuXzEuZGVmYXVsdCkge1xuICAgICAgICBzcGFuQ29udGV4dCA9IHNwYW5Db250ZXh0LmNvbnRleHQoKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyByZWZlcmVuY2VfMS5kZWZhdWx0KENvbnN0YW50cy5SRUZFUkVOQ0VfRk9MTE9XU19GUk9NLCBzcGFuQ29udGV4dCk7XG59XG5leHBvcnRzLmZvbGxvd3NGcm9tID0gZm9sbG93c0Zyb207XG4vLyMgc291cmNlTWFwcGluZ1VSTD1mdW5jdGlvbnMuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgc3Bhbl8xID0gcmVxdWlyZShcIi4vc3BhblwiKTtcbnZhciBzcGFuX2NvbnRleHRfMSA9IHJlcXVpcmUoXCIuL3NwYW5fY29udGV4dFwiKTtcbnZhciB0cmFjZXJfMSA9IHJlcXVpcmUoXCIuL3RyYWNlclwiKTtcbmV4cG9ydHMudHJhY2VyID0gbnVsbDtcbmV4cG9ydHMuc3BhbkNvbnRleHQgPSBudWxsO1xuZXhwb3J0cy5zcGFuID0gbnVsbDtcbi8vIERlZmVycmVkIGluaXRpYWxpemF0aW9uIHRvIGF2b2lkIGEgZGVwZW5kZW5jeSBjeWNsZSB3aGVyZSBUcmFjZXIgZGVwZW5kcyBvblxuLy8gU3BhbiB3aGljaCBkZXBlbmRzIG9uIHRoZSBub29wIHRyYWNlci5cbmZ1bmN0aW9uIGluaXRpYWxpemUoKSB7XG4gICAgZXhwb3J0cy50cmFjZXIgPSBuZXcgdHJhY2VyXzEuZGVmYXVsdCgpO1xuICAgIGV4cG9ydHMuc3BhbiA9IG5ldyBzcGFuXzEuZGVmYXVsdCgpO1xuICAgIGV4cG9ydHMuc3BhbkNvbnRleHQgPSBuZXcgc3Bhbl9jb250ZXh0XzEuZGVmYXVsdCgpO1xufVxuZXhwb3J0cy5pbml0aWFsaXplID0gaW5pdGlhbGl6ZTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW5vb3AuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgc3Bhbl8xID0gcmVxdWlyZShcIi4vc3BhblwiKTtcbi8qKlxuICogUmVmZXJlbmNlIHBhaXJzIGEgcmVmZXJlbmNlIHR5cGUgY29uc3RhbnQgKGUuZy4sIFJFRkVSRU5DRV9DSElMRF9PRiBvclxuICogUkVGRVJFTkNFX0ZPTExPV1NfRlJPTSkgd2l0aCB0aGUgU3BhbkNvbnRleHQgaXQgcG9pbnRzIHRvLlxuICpcbiAqIFNlZSB0aGUgZXhwb3J0ZWQgY2hpbGRPZigpIGFuZCBmb2xsb3dzRnJvbSgpIGZ1bmN0aW9ucyBhdCB0aGUgcGFja2FnZSBsZXZlbC5cbiAqL1xudmFyIFJlZmVyZW5jZSA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICAvKipcbiAgICAgKiBJbml0aWFsaXplIGEgbmV3IFJlZmVyZW5jZSBpbnN0YW5jZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlIC0gdGhlIFJlZmVyZW5jZSB0eXBlIGNvbnN0YW50IChlLmcuLFxuICAgICAqICAgICAgICBSRUZFUkVOQ0VfQ0hJTERfT0Ygb3IgUkVGRVJFTkNFX0ZPTExPV1NfRlJPTSkuXG4gICAgICogQHBhcmFtIHtTcGFuQ29udGV4dH0gcmVmZXJlbmNlZENvbnRleHQgLSB0aGUgU3BhbkNvbnRleHQgYmVpbmcgcmVmZXJyZWRcbiAgICAgKiAgICAgICAgdG8uIEFzIGEgY29udmVuaWVuY2UsIGEgU3BhbiBpbnN0YW5jZSBtYXkgYmUgcGFzc2VkIGluIGluc3RlYWRcbiAgICAgKiAgICAgICAgKGluIHdoaWNoIGNhc2UgaXRzIC5jb250ZXh0KCkgaXMgdXNlZCBoZXJlKS5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBSZWZlcmVuY2UodHlwZSwgcmVmZXJlbmNlZENvbnRleHQpIHtcbiAgICAgICAgdGhpcy5fdHlwZSA9IHR5cGU7XG4gICAgICAgIHRoaXMuX3JlZmVyZW5jZWRDb250ZXh0ID0gKHJlZmVyZW5jZWRDb250ZXh0IGluc3RhbmNlb2Ygc3Bhbl8xLmRlZmF1bHQgP1xuICAgICAgICAgICAgcmVmZXJlbmNlZENvbnRleHQuY29udGV4dCgpIDpcbiAgICAgICAgICAgIHJlZmVyZW5jZWRDb250ZXh0KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHJldHVybiB7c3RyaW5nfSBUaGUgUmVmZXJlbmNlIHR5cGUgKGUuZy4sIFJFRkVSRU5DRV9DSElMRF9PRiBvclxuICAgICAqICAgICAgICAgUkVGRVJFTkNFX0ZPTExPV1NfRlJPTSkuXG4gICAgICovXG4gICAgUmVmZXJlbmNlLnByb3RvdHlwZS50eXBlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdHlwZTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEByZXR1cm4ge1NwYW5Db250ZXh0fSBUaGUgU3BhbkNvbnRleHQgYmVpbmcgcmVmZXJyZWQgdG8gKGUuZy4sIHRoZVxuICAgICAqICAgICAgICAgcGFyZW50IGluIGEgUkVGRVJFTkNFX0NISUxEX09GIFJlZmVyZW5jZSkuXG4gICAgICovXG4gICAgUmVmZXJlbmNlLnByb3RvdHlwZS5yZWZlcmVuY2VkQ29udGV4dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlZmVyZW5jZWRDb250ZXh0O1xuICAgIH07XG4gICAgcmV0dXJuIFJlZmVyZW5jZTtcbn0oKSk7XG5leHBvcnRzLmRlZmF1bHQgPSBSZWZlcmVuY2U7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1yZWZlcmVuY2UuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgbm9vcCA9IHJlcXVpcmUoXCIuL25vb3BcIik7XG4vKipcbiAqIFNwYW4gcmVwcmVzZW50cyBhIGxvZ2ljYWwgdW5pdCBvZiB3b3JrIGFzIHBhcnQgb2YgYSBicm9hZGVyIFRyYWNlLiBFeGFtcGxlc1xuICogb2Ygc3BhbiBtaWdodCBpbmNsdWRlIHJlbW90ZSBwcm9jZWR1cmUgY2FsbHMgb3IgYSBpbi1wcm9jZXNzIGZ1bmN0aW9uIGNhbGxzXG4gKiB0byBzdWItY29tcG9uZW50cy4gQSBUcmFjZSBoYXMgYSBzaW5nbGUsIHRvcC1sZXZlbCBcInJvb3RcIiBTcGFuIHRoYXQgaW4gdHVyblxuICogbWF5IGhhdmUgemVybyBvciBtb3JlIGNoaWxkIFNwYW5zLCB3aGljaCBpbiB0dXJuIG1heSBoYXZlIGNoaWxkcmVuLlxuICovXG52YXIgU3BhbiA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBTcGFuKCkge1xuICAgIH1cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG4gICAgLy8gT3BlblRyYWNpbmcgQVBJIG1ldGhvZHNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgU3BhbkNvbnRleHQgb2JqZWN0IGFzc29jaWF0ZWQgd2l0aCB0aGlzIFNwYW4uXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtTcGFuQ29udGV4dH1cbiAgICAgKi9cbiAgICBTcGFuLnByb3RvdHlwZS5jb250ZXh0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY29udGV4dCgpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgVHJhY2VyIG9iamVjdCB1c2VkIHRvIGNyZWF0ZSB0aGlzIFNwYW4uXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtUcmFjZXJ9XG4gICAgICovXG4gICAgU3Bhbi5wcm90b3R5cGUudHJhY2VyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdHJhY2VyKCk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBzdHJpbmcgbmFtZSBmb3IgdGhlIGxvZ2ljYWwgb3BlcmF0aW9uIHRoaXMgc3BhbiByZXByZXNlbnRzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAgICAgKi9cbiAgICBTcGFuLnByb3RvdHlwZS5zZXRPcGVyYXRpb25OYW1lID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgdGhpcy5fc2V0T3BlcmF0aW9uTmFtZShuYW1lKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBTZXRzIGEga2V5OnZhbHVlIHBhaXIgb24gdGhpcyBTcGFuIHRoYXQgYWxzbyBwcm9wYWdhdGVzIHRvIGZ1dHVyZVxuICAgICAqIGNoaWxkcmVuIG9mIHRoZSBhc3NvY2lhdGVkIFNwYW4uXG4gICAgICpcbiAgICAgKiBzZXRCYWdnYWdlSXRlbSgpIGVuYWJsZXMgcG93ZXJmdWwgZnVuY3Rpb25hbGl0eSBnaXZlbiBhIGZ1bGwtc3RhY2tcbiAgICAgKiBvcGVudHJhY2luZyBpbnRlZ3JhdGlvbiAoZS5nLiwgYXJiaXRyYXJ5IGFwcGxpY2F0aW9uIGRhdGEgZnJvbSBhIHdlYlxuICAgICAqIGNsaWVudCBjYW4gbWFrZSBpdCwgdHJhbnNwYXJlbnRseSwgYWxsIHRoZSB3YXkgaW50byB0aGUgZGVwdGhzIG9mIGFcbiAgICAgKiBzdG9yYWdlIHN5c3RlbSksIGFuZCB3aXRoIGl0IHNvbWUgcG93ZXJmdWwgY29zdHM6IHVzZSB0aGlzIGZlYXR1cmUgd2l0aFxuICAgICAqIGNhcmUuXG4gICAgICpcbiAgICAgKiBJTVBPUlRBTlQgTk9URSAjMTogc2V0QmFnZ2FnZUl0ZW0oKSB3aWxsIG9ubHkgcHJvcGFnYXRlIGJhZ2dhZ2UgaXRlbXMgdG9cbiAgICAgKiAqZnV0dXJlKiBjYXVzYWwgZGVzY2VuZGFudHMgb2YgdGhlIGFzc29jaWF0ZWQgU3Bhbi5cbiAgICAgKlxuICAgICAqIElNUE9SVEFOVCBOT1RFICMyOiBVc2UgdGhpcyB0aG91Z2h0ZnVsbHkgYW5kIHdpdGggY2FyZS4gRXZlcnkga2V5IGFuZFxuICAgICAqIHZhbHVlIGlzIGNvcGllZCBpbnRvIGV2ZXJ5IGxvY2FsICphbmQgcmVtb3RlKiBjaGlsZCBvZiB0aGUgYXNzb2NpYXRlZFxuICAgICAqIFNwYW4sIGFuZCB0aGF0IGNhbiBhZGQgdXAgdG8gYSBsb3Qgb2YgbmV0d29yayBhbmQgY3B1IG92ZXJoZWFkLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZVxuICAgICAqL1xuICAgIFNwYW4ucHJvdG90eXBlLnNldEJhZ2dhZ2VJdGVtID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgICAgICAgdGhpcy5fc2V0QmFnZ2FnZUl0ZW0oa2V5LCB2YWx1ZSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogUmV0dXJucyB0aGUgdmFsdWUgZm9yIGEgYmFnZ2FnZSBpdGVtIGdpdmVuIGl0cyBrZXkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0gIHtzdHJpbmd9IGtleVxuICAgICAqICAgICAgICAgVGhlIGtleSBmb3IgdGhlIGdpdmVuIHRyYWNlIGF0dHJpYnV0ZS5cbiAgICAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICAgICogICAgICAgICBTdHJpbmcgdmFsdWUgZm9yIHRoZSBnaXZlbiBrZXksIG9yIHVuZGVmaW5lZCBpZiB0aGUga2V5IGRvZXMgbm90XG4gICAgICogICAgICAgICBjb3JyZXNwb25kIHRvIGEgc2V0IHRyYWNlIGF0dHJpYnV0ZS5cbiAgICAgKi9cbiAgICBTcGFuLnByb3RvdHlwZS5nZXRCYWdnYWdlSXRlbSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dldEJhZ2dhZ2VJdGVtKGtleSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBBZGRzIGEgc2luZ2xlIHRhZyB0byB0aGUgc3Bhbi4gIFNlZSBgYWRkVGFncygpYCBmb3IgZGV0YWlscy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcbiAgICAgKiBAcGFyYW0ge2FueX0gdmFsdWVcbiAgICAgKi9cbiAgICBTcGFuLnByb3RvdHlwZS5zZXRUYWcgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICAvLyBOT1RFOiB0aGUgY2FsbCBpcyBub3JtYWxpemVkIHRvIGEgY2FsbCB0byBfYWRkVGFncygpXG4gICAgICAgIHRoaXMuX2FkZFRhZ3MoKF9hID0ge30sIF9hW2tleV0gPSB2YWx1ZSwgX2EpKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIHZhciBfYTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEFkZHMgdGhlIGdpdmVuIGtleSB2YWx1ZSBwYWlycyB0byB0aGUgc2V0IG9mIHNwYW4gdGFncy5cbiAgICAgKlxuICAgICAqIE11bHRpcGxlIGNhbGxzIHRvIGFkZFRhZ3MoKSByZXN1bHRzIGluIHRoZSB0YWdzIGJlaW5nIHRoZSBzdXBlcnNldCBvZlxuICAgICAqIGFsbCBjYWxscy5cbiAgICAgKlxuICAgICAqIFRoZSBiZWhhdmlvciBvZiBzZXR0aW5nIHRoZSBzYW1lIGtleSBtdWx0aXBsZSB0aW1lcyBvbiB0aGUgc2FtZSBzcGFuXG4gICAgICogaXMgdW5kZWZpbmVkLlxuICAgICAqXG4gICAgICogVGhlIHN1cHBvcnRlZCB0eXBlIG9mIHRoZSB2YWx1ZXMgaXMgaW1wbGVtZW50YXRpb24tZGVwZW5kZW50LlxuICAgICAqIEltcGxlbWVudGF0aW9ucyBhcmUgZXhwZWN0ZWQgdG8gc2FmZWx5IGhhbmRsZSBhbGwgdHlwZXMgb2YgdmFsdWVzIGJ1dFxuICAgICAqIG1heSBjaG9vc2UgdG8gaWdub3JlIHVucmVjb2duaXplZCAvIHVuaGFuZGxlLWFibGUgdmFsdWVzIChlLmcuIG9iamVjdHNcbiAgICAgKiB3aXRoIGN5Y2xpYyByZWZlcmVuY2VzLCBmdW5jdGlvbiBvYmplY3RzKS5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge1t0eXBlXX0gW2Rlc2NyaXB0aW9uXVxuICAgICAqL1xuICAgIFNwYW4ucHJvdG90eXBlLmFkZFRhZ3MgPSBmdW5jdGlvbiAoa2V5VmFsdWVNYXApIHtcbiAgICAgICAgdGhpcy5fYWRkVGFncyhrZXlWYWx1ZU1hcCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQWRkIGEgbG9nIHJlY29yZCB0byB0aGlzIFNwYW4sIG9wdGlvbmFsbHkgYXQgYSB1c2VyLXByb3ZpZGVkIHRpbWVzdGFtcC5cbiAgICAgKlxuICAgICAqIEZvciBleGFtcGxlOlxuICAgICAqXG4gICAgICogICAgIHNwYW4ubG9nKHtcbiAgICAgKiAgICAgICAgIHNpemU6IHJwYy5zaXplKCksICAvLyBudW1lcmljIHZhbHVlXG4gICAgICogICAgICAgICBVUkk6IHJwYy5VUkkoKSwgIC8vIHN0cmluZyB2YWx1ZVxuICAgICAqICAgICAgICAgcGF5bG9hZDogcnBjLnBheWxvYWQoKSwgIC8vIE9iamVjdCB2YWx1ZVxuICAgICAqICAgICAgICAgXCJrZXlzIGNhbiBiZSBhcmJpdHJhcnkgc3RyaW5nc1wiOiBycGMuZm9vKCksXG4gICAgICogICAgIH0pO1xuICAgICAqXG4gICAgICogICAgIHNwYW4ubG9nKHtcbiAgICAgKiAgICAgICAgIFwiZXJyb3IuZGVzY3JpcHRpb25cIjogc29tZUVycm9yLmRlc2NyaXB0aW9uKCksXG4gICAgICogICAgIH0sIHNvbWVFcnJvci50aW1lc3RhbXBNaWxsaXMoKSk7XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdH0ga2V5VmFsdWVQYWlyc1xuICAgICAqICAgICAgICBBbiBvYmplY3QgbWFwcGluZyBzdHJpbmcga2V5cyB0byBhcmJpdHJhcnkgdmFsdWUgdHlwZXMuIEFsbFxuICAgICAqICAgICAgICBUcmFjZXIgaW1wbGVtZW50YXRpb25zIHNob3VsZCBzdXBwb3J0IGJvb2wsIHN0cmluZywgYW5kIG51bWVyaWNcbiAgICAgKiAgICAgICAgdmFsdWUgdHlwZXMsIGFuZCBzb21lIG1heSBhbHNvIHN1cHBvcnQgT2JqZWN0IHZhbHVlcy5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdGltZXN0YW1wXG4gICAgICogICAgICAgIEFuIG9wdGlvbmFsIHBhcmFtZXRlciBzcGVjaWZ5aW5nIHRoZSB0aW1lc3RhbXAgaW4gbWlsbGlzZWNvbmRzXG4gICAgICogICAgICAgIHNpbmNlIHRoZSBVbml4IGVwb2NoLiBGcmFjdGlvbmFsIHZhbHVlcyBhcmUgYWxsb3dlZCBzbyB0aGF0XG4gICAgICogICAgICAgIHRpbWVzdGFtcHMgd2l0aCBzdWItbWlsbGlzZWNvbmQgYWNjdXJhY3kgY2FuIGJlIHJlcHJlc2VudGVkLiBJZlxuICAgICAqICAgICAgICBub3Qgc3BlY2lmaWVkLCB0aGUgaW1wbGVtZW50YXRpb24gaXMgZXhwZWN0ZWQgdG8gdXNlIGl0cyBub3Rpb25cbiAgICAgKiAgICAgICAgb2YgdGhlIGN1cnJlbnQgdGltZSBvZiB0aGUgY2FsbC5cbiAgICAgKi9cbiAgICBTcGFuLnByb3RvdHlwZS5sb2cgPSBmdW5jdGlvbiAoa2V5VmFsdWVQYWlycywgdGltZXN0YW1wKSB7XG4gICAgICAgIHRoaXMuX2xvZyhrZXlWYWx1ZVBhaXJzLCB0aW1lc3RhbXApO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIERFUFJFQ0FURURcbiAgICAgKi9cbiAgICBTcGFuLnByb3RvdHlwZS5sb2dFdmVudCA9IGZ1bmN0aW9uIChldmVudE5hbWUsIHBheWxvYWQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvZyh7IGV2ZW50OiBldmVudE5hbWUsIHBheWxvYWQ6IHBheWxvYWQgfSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBlbmQgdGltZXN0YW1wIGFuZCBmaW5hbGl6ZXMgU3BhbiBzdGF0ZS5cbiAgICAgKlxuICAgICAqIFdpdGggdGhlIGV4Y2VwdGlvbiBvZiBjYWxscyB0byBTcGFuLmNvbnRleHQoKSAod2hpY2ggYXJlIGFsd2F5cyBhbGxvd2VkKSxcbiAgICAgKiBmaW5pc2goKSBtdXN0IGJlIHRoZSBsYXN0IGNhbGwgbWFkZSB0byBhbnkgc3BhbiBpbnN0YW5jZSwgYW5kIHRvIGRvXG4gICAgICogb3RoZXJ3aXNlIGxlYWRzIHRvIHVuZGVmaW5lZCBiZWhhdmlvci5cbiAgICAgKlxuICAgICAqIEBwYXJhbSAge251bWJlcn0gZmluaXNoVGltZVxuICAgICAqICAgICAgICAgT3B0aW9uYWwgZmluaXNoIHRpbWUgaW4gbWlsbGlzZWNvbmRzIGFzIGEgVW5peCB0aW1lc3RhbXAuIERlY2ltYWxcbiAgICAgKiAgICAgICAgIHZhbHVlcyBhcmUgc3VwcG9ydGVkIGZvciB0aW1lc3RhbXBzIHdpdGggc3ViLW1pbGxpc2Vjb25kIGFjY3VyYWN5LlxuICAgICAqICAgICAgICAgSWYgbm90IHNwZWNpZmllZCwgdGhlIGN1cnJlbnQgdGltZSAoYXMgZGVmaW5lZCBieSB0aGVcbiAgICAgKiAgICAgICAgIGltcGxlbWVudGF0aW9uKSB3aWxsIGJlIHVzZWQuXG4gICAgICovXG4gICAgU3Bhbi5wcm90b3R5cGUuZmluaXNoID0gZnVuY3Rpb24gKGZpbmlzaFRpbWUpIHtcbiAgICAgICAgdGhpcy5fZmluaXNoKGZpbmlzaFRpbWUpO1xuICAgICAgICAvLyBEbyBub3QgcmV0dXJuIGB0aGlzYC4gVGhlIFNwYW4gZ2VuZXJhbGx5IHNob3VsZCBub3QgYmUgdXNlZCBhZnRlciBpdFxuICAgICAgICAvLyBpcyBmaW5pc2hlZCBzbyBjaGFpbmluZyBpcyBub3QgZGVzaXJlZCBpbiB0aGlzIGNvbnRleHQuXG4gICAgfTtcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG4gICAgLy8gRGVyaXZlZCBjbGFzc2VzIGNhbiBjaG9vc2UgdG8gaW1wbGVtZW50IHRoZSBiZWxvd1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cbiAgICAvLyBCeSBkZWZhdWx0IHJldHVybnMgYSBuby1vcCBTcGFuQ29udGV4dC5cbiAgICBTcGFuLnByb3RvdHlwZS5fY29udGV4dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5vb3Auc3BhbkNvbnRleHQ7XG4gICAgfTtcbiAgICAvLyBCeSBkZWZhdWx0IHJldHVybnMgYSBuby1vcCB0cmFjZXIuXG4gICAgLy9cbiAgICAvLyBUaGUgYmFzZSBjbGFzcyBjb3VsZCBzdG9yZSB0aGUgdHJhY2VyIHRoYXQgY3JlYXRlZCBpdCwgYnV0IGl0IGRvZXMgbm90XG4gICAgLy8gaW4gb3JkZXIgdG8gZW5zdXJlIHRoZSBuby1vcCBzcGFuIGltcGxlbWVudGF0aW9uIGhhcyB6ZXJvIG1lbWJlcnMsXG4gICAgLy8gd2hpY2ggYWxsb3dzIFY4IHRvIGFnZ3Jlc3NpdmVseSBvcHRpbWl6ZSBjYWxscyB0byBzdWNoIG9iamVjdHMuXG4gICAgU3Bhbi5wcm90b3R5cGUuX3RyYWNlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5vb3AudHJhY2VyO1xuICAgIH07XG4gICAgLy8gQnkgZGVmYXVsdCBkb2VzIG5vdGhpbmdcbiAgICBTcGFuLnByb3RvdHlwZS5fc2V0T3BlcmF0aW9uTmFtZSA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgfTtcbiAgICAvLyBCeSBkZWZhdWx0IGRvZXMgbm90aGluZ1xuICAgIFNwYW4ucHJvdG90eXBlLl9zZXRCYWdnYWdlSXRlbSA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgfTtcbiAgICAvLyBCeSBkZWZhdWx0IGRvZXMgbm90aGluZ1xuICAgIFNwYW4ucHJvdG90eXBlLl9nZXRCYWdnYWdlSXRlbSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9O1xuICAgIC8vIEJ5IGRlZmF1bHQgZG9lcyBub3RoaW5nXG4gICAgLy9cbiAgICAvLyBOT1RFOiBib3RoIHNldFRhZygpIGFuZCBhZGRUYWdzKCkgbWFwIHRvIHRoaXMgZnVuY3Rpb24uIGtleVZhbHVlUGFpcnNcbiAgICAvLyB3aWxsIGFsd2F5cyBiZSBhbiBhc3NvY2lhdGl2ZSBhcnJheS5cbiAgICBTcGFuLnByb3RvdHlwZS5fYWRkVGFncyA9IGZ1bmN0aW9uIChrZXlWYWx1ZVBhaXJzKSB7XG4gICAgfTtcbiAgICAvLyBCeSBkZWZhdWx0IGRvZXMgbm90aGluZ1xuICAgIFNwYW4ucHJvdG90eXBlLl9sb2cgPSBmdW5jdGlvbiAoa2V5VmFsdWVQYWlycywgdGltZXN0YW1wKSB7XG4gICAgfTtcbiAgICAvLyBCeSBkZWZhdWx0IGRvZXMgbm90aGluZ1xuICAgIC8vXG4gICAgLy8gZmluaXNoVGltZSBpcyBleHBlY3RlZCB0byBiZSBlaXRoZXIgYSBudW1iZXIgb3IgdW5kZWZpbmVkLlxuICAgIFNwYW4ucHJvdG90eXBlLl9maW5pc2ggPSBmdW5jdGlvbiAoZmluaXNoVGltZSkge1xuICAgIH07XG4gICAgcmV0dXJuIFNwYW47XG59KCkpO1xuZXhwb3J0cy5TcGFuID0gU3BhbjtcbmV4cG9ydHMuZGVmYXVsdCA9IFNwYW47XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zcGFuLmpzLm1hcCIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuLyoqXG4gKiBTcGFuQ29udGV4dCByZXByZXNlbnRzIFNwYW4gc3RhdGUgdGhhdCBtdXN0IHByb3BhZ2F0ZSB0byBkZXNjZW5kYW50IFNwYW5zXG4gKiBhbmQgYWNyb3NzIHByb2Nlc3MgYm91bmRhcmllcy5cbiAqXG4gKiBTcGFuQ29udGV4dCBpcyBsb2dpY2FsbHkgZGl2aWRlZCBpbnRvIHR3byBwaWVjZXM6IHRoZSB1c2VyLWxldmVsIFwiQmFnZ2FnZVwiXG4gKiAoc2VlIHNldEJhZ2dhZ2VJdGVtIGFuZCBnZXRCYWdnYWdlSXRlbSkgdGhhdCBwcm9wYWdhdGVzIGFjcm9zcyBTcGFuXG4gKiBib3VuZGFyaWVzIGFuZCBhbnkgVHJhY2VyLWltcGxlbWVudGF0aW9uLXNwZWNpZmljIGZpZWxkcyB0aGF0IGFyZSBuZWVkZWQgdG9cbiAqIGlkZW50aWZ5IG9yIG90aGVyd2lzZSBjb250ZXh0dWFsaXplIHRoZSBhc3NvY2lhdGVkIFNwYW4gaW5zdGFuY2UgKGUuZy4sIGFcbiAqIDx0cmFjZV9pZCwgc3Bhbl9pZCwgc2FtcGxlZD4gdHVwbGUpLlxuICovXG52YXIgU3BhbkNvbnRleHQgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gU3BhbkNvbnRleHQoKSB7XG4gICAgfVxuICAgIHJldHVybiBTcGFuQ29udGV4dDtcbn0oKSk7XG5leHBvcnRzLlNwYW5Db250ZXh0ID0gU3BhbkNvbnRleHQ7XG5leHBvcnRzLmRlZmF1bHQgPSBTcGFuQ29udGV4dDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNwYW5fY29udGV4dC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBGdW5jdGlvbnMgPSByZXF1aXJlKFwiLi9mdW5jdGlvbnNcIik7XG52YXIgTm9vcCA9IHJlcXVpcmUoXCIuL25vb3BcIik7XG52YXIgc3Bhbl8xID0gcmVxdWlyZShcIi4vc3BhblwiKTtcbi8qKlxuICogVHJhY2VyIGlzIHRoZSBlbnRyeS1wb2ludCBiZXR3ZWVuIHRoZSBpbnN0cnVtZW50YXRpb24gQVBJIGFuZCB0aGUgdHJhY2luZ1xuICogaW1wbGVtZW50YXRpb24uXG4gKlxuICogVGhlIGRlZmF1bHQgb2JqZWN0IGFjdHMgYXMgYSBuby1vcCBpbXBsZW1lbnRhdGlvbi5cbiAqXG4gKiBOb3RlIHRvIGltcGxlbWVudGF0b3JzOiBkZXJpdmVkIGNsYXNzZXMgY2FuIGNob29zZSB0byBkaXJlY3RseSBpbXBsZW1lbnQgdGhlXG4gKiBtZXRob2RzIGluIHRoZSBcIk9wZW5UcmFjaW5nIEFQSSBtZXRob2RzXCIgc2VjdGlvbiwgb3Igb3B0aW9uYWxseSB0aGUgc3Vic2V0IG9mXG4gKiB1bmRlcnNjb3JlLXByZWZpeGVkIG1ldGhvZHMgdG8gcGljayB1cCB0aGUgYXJndW1lbnQgY2hlY2tpbmcgYW5kIGhhbmRsaW5nXG4gKiBhdXRvbWF0aWNhbGx5IGZyb20gdGhlIGJhc2UgY2xhc3MuXG4gKi9cbnZhciBUcmFjZXIgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gVHJhY2VyKCkge1xuICAgIH1cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG4gICAgLy8gT3BlblRyYWNpbmcgQVBJIG1ldGhvZHNcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG4gICAgLyoqXG4gICAgICogU3RhcnRzIGFuZCByZXR1cm5zIGEgbmV3IFNwYW4gcmVwcmVzZW50aW5nIGEgbG9naWNhbCB1bml0IG9mIHdvcmsuXG4gICAgICpcbiAgICAgKiBGb3IgZXhhbXBsZTpcbiAgICAgKlxuICAgICAqICAgICAvLyBTdGFydCBhIG5ldyAocGFyZW50bGVzcykgcm9vdCBTcGFuOlxuICAgICAqICAgICB2YXIgcGFyZW50ID0gVHJhY2VyLnN0YXJ0U3BhbignRG9Xb3JrJyk7XG4gICAgICpcbiAgICAgKiAgICAgLy8gU3RhcnQgYSBuZXcgKGNoaWxkKSBTcGFuOlxuICAgICAqICAgICB2YXIgY2hpbGQgPSBUcmFjZXIuc3RhcnRTcGFuKCdsb2FkLWZyb20tZGInLCB7XG4gICAgICogICAgICAgICBjaGlsZE9mOiBwYXJlbnQuY29udGV4dCgpLFxuICAgICAqICAgICB9KTtcbiAgICAgKlxuICAgICAqICAgICAvLyBTdGFydCBhIG5ldyBhc3luYyAoRm9sbG93c0Zyb20pIFNwYW46XG4gICAgICogICAgIHZhciBjaGlsZCA9IFRyYWNlci5zdGFydFNwYW4oJ2FzeW5jLWNhY2hlLXdyaXRlJywge1xuICAgICAqICAgICAgICAgcmVmZXJlbmNlczogW1xuICAgICAqICAgICAgICAgICAgIG9wZW50cmFjaW5nLmZvbGxvd3NGcm9tKHBhcmVudC5jb250ZXh0KCkpXG4gICAgICogICAgICAgICBdLFxuICAgICAqICAgICB9KTtcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIC0gdGhlIG5hbWUgb2YgdGhlIG9wZXJhdGlvbiAoUkVRVUlSRUQpLlxuICAgICAqIEBwYXJhbSB7U3Bhbk9wdGlvbnN9IFtvcHRpb25zXSAtIG9wdGlvbnMgZm9yIHRoZSBuZXdseSBjcmVhdGVkIHNwYW4uXG4gICAgICogQHJldHVybiB7U3Bhbn0gLSBhIG5ldyBTcGFuIG9iamVjdC5cbiAgICAgKi9cbiAgICBUcmFjZXIucHJvdG90eXBlLnN0YXJ0U3BhbiA9IGZ1bmN0aW9uIChuYW1lLCBvcHRpb25zKSB7XG4gICAgICAgIGlmIChvcHRpb25zID09PSB2b2lkIDApIHsgb3B0aW9ucyA9IHt9OyB9XG4gICAgICAgIC8vIENvbnZlcnQgb3B0aW9ucy5jaGlsZE9mIHRvIGZpZWxkcy5yZWZlcmVuY2VzIGFzIG5lZWRlZC5cbiAgICAgICAgaWYgKG9wdGlvbnMuY2hpbGRPZikge1xuICAgICAgICAgICAgLy8gQ29udmVydCBmcm9tIGEgU3BhbiBvciBhIFNwYW5Db250ZXh0IGludG8gYSBSZWZlcmVuY2UuXG4gICAgICAgICAgICB2YXIgY2hpbGRPZiA9IEZ1bmN0aW9ucy5jaGlsZE9mKG9wdGlvbnMuY2hpbGRPZik7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5yZWZlcmVuY2VzKSB7XG4gICAgICAgICAgICAgICAgb3B0aW9ucy5yZWZlcmVuY2VzLnB1c2goY2hpbGRPZik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBvcHRpb25zLnJlZmVyZW5jZXMgPSBbY2hpbGRPZl07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkZWxldGUgKG9wdGlvbnMuY2hpbGRPZik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0YXJ0U3BhbihuYW1lLCBvcHRpb25zKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEluamVjdHMgdGhlIGdpdmVuIFNwYW5Db250ZXh0IGluc3RhbmNlIGZvciBjcm9zcy1wcm9jZXNzIHByb3BhZ2F0aW9uXG4gICAgICogd2l0aGluIGBjYXJyaWVyYC4gVGhlIGV4cGVjdGVkIHR5cGUgb2YgYGNhcnJpZXJgIGRlcGVuZHMgb24gdGhlIHZhbHVlIG9mXG4gICAgICogYGZvcm1hdC5cbiAgICAgKlxuICAgICAqIE9wZW5UcmFjaW5nIGRlZmluZXMgYSBjb21tb24gc2V0IG9mIGBmb3JtYXRgIHZhbHVlcyAoc2VlXG4gICAgICogRk9STUFUX1RFWFRfTUFQLCBGT1JNQVRfSFRUUF9IRUFERVJTLCBhbmQgRk9STUFUX0JJTkFSWSksIGFuZCBlYWNoIGhhc1xuICAgICAqIGFuIGV4cGVjdGVkIGNhcnJpZXIgdHlwZS5cbiAgICAgKlxuICAgICAqIENvbnNpZGVyIHRoaXMgcHNldWRvY29kZSBleGFtcGxlOlxuICAgICAqXG4gICAgICogICAgIHZhciBjbGllbnRTcGFuID0gLi4uO1xuICAgICAqICAgICAuLi5cbiAgICAgKiAgICAgLy8gSW5qZWN0IGNsaWVudFNwYW4gaW50byBhIHRleHQgY2Fycmllci5cbiAgICAgKiAgICAgdmFyIGhlYWRlcnNDYXJyaWVyID0ge307XG4gICAgICogICAgIFRyYWNlci5pbmplY3QoY2xpZW50U3Bhbi5jb250ZXh0KCksIFRyYWNlci5GT1JNQVRfSFRUUF9IRUFERVJTLCBoZWFkZXJzQ2Fycmllcik7XG4gICAgICogICAgIC8vIEluY29ycG9yYXRlIHRoZSB0ZXh0Q2FycmllciBpbnRvIHRoZSBvdXRib3VuZCBIVFRQIHJlcXVlc3QgaGVhZGVyXG4gICAgICogICAgIC8vIG1hcC5cbiAgICAgKiAgICAgT2JqZWN0LmFzc2lnbihvdXRib3VuZEhUVFBSZXEuaGVhZGVycywgaGVhZGVyc0NhcnJpZXIpO1xuICAgICAqICAgICAvLyAuLi4gc2VuZCB0aGUgaHR0cFJlcVxuICAgICAqXG4gICAgICogQHBhcmFtICB7U3BhbkNvbnRleHR9IHNwYW5Db250ZXh0IC0gdGhlIFNwYW5Db250ZXh0IHRvIGluamVjdCBpbnRvIHRoZVxuICAgICAqICAgICAgICAgY2FycmllciBvYmplY3QuIEFzIGEgY29udmVuaWVuY2UsIGEgU3BhbiBpbnN0YW5jZSBtYXkgYmUgcGFzc2VkXG4gICAgICogICAgICAgICBpbiBpbnN0ZWFkIChpbiB3aGljaCBjYXNlIGl0cyAuY29udGV4dCgpIGlzIHVzZWQgZm9yIHRoZVxuICAgICAqICAgICAgICAgaW5qZWN0KCkpLlxuICAgICAqIEBwYXJhbSAge3N0cmluZ30gZm9ybWF0IC0gdGhlIGZvcm1hdCBvZiB0aGUgY2Fycmllci5cbiAgICAgKiBAcGFyYW0gIHthbnl9IGNhcnJpZXIgLSBzZWUgdGhlIGRvY3VtZW50YXRpb24gZm9yIHRoZSBjaG9zZW4gYGZvcm1hdGBcbiAgICAgKiAgICAgICAgIGZvciBhIGRlc2NyaXB0aW9uIG9mIHRoZSBjYXJyaWVyIG9iamVjdC5cbiAgICAgKi9cbiAgICBUcmFjZXIucHJvdG90eXBlLmluamVjdCA9IGZ1bmN0aW9uIChzcGFuQ29udGV4dCwgZm9ybWF0LCBjYXJyaWVyKSB7XG4gICAgICAgIC8vIEFsbG93IHRoZSB1c2VyIHRvIHBhc3MgYSBTcGFuIGluc3RlYWQgb2YgYSBTcGFuQ29udGV4dFxuICAgICAgICBpZiAoc3BhbkNvbnRleHQgaW5zdGFuY2VvZiBzcGFuXzEuZGVmYXVsdCkge1xuICAgICAgICAgICAgc3BhbkNvbnRleHQgPSBzcGFuQ29udGV4dC5jb250ZXh0KCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2luamVjdChzcGFuQ29udGV4dCwgZm9ybWF0LCBjYXJyaWVyKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBTcGFuQ29udGV4dCBpbnN0YW5jZSBleHRyYWN0ZWQgZnJvbSBgY2FycmllcmAgaW4gdGhlIGdpdmVuXG4gICAgICogYGZvcm1hdGAuXG4gICAgICpcbiAgICAgKiBPcGVuVHJhY2luZyBkZWZpbmVzIGEgY29tbW9uIHNldCBvZiBgZm9ybWF0YCB2YWx1ZXMgKHNlZVxuICAgICAqIEZPUk1BVF9URVhUX01BUCwgRk9STUFUX0hUVFBfSEVBREVSUywgYW5kIEZPUk1BVF9CSU5BUlkpLCBhbmQgZWFjaCBoYXNcbiAgICAgKiBhbiBleHBlY3RlZCBjYXJyaWVyIHR5cGUuXG4gICAgICpcbiAgICAgKiBDb25zaWRlciB0aGlzIHBzZXVkb2NvZGUgZXhhbXBsZTpcbiAgICAgKlxuICAgICAqICAgICAvLyBVc2UgdGhlIGluYm91bmQgSFRUUCByZXF1ZXN0J3MgaGVhZGVycyBhcyBhIHRleHQgbWFwIGNhcnJpZXIuXG4gICAgICogICAgIHZhciBoZWFkZXJzQ2FycmllciA9IGluYm91bmRIVFRQUmVxLmhlYWRlcnM7XG4gICAgICogICAgIHZhciB3aXJlQ3R4ID0gVHJhY2VyLmV4dHJhY3QoVHJhY2VyLkZPUk1BVF9IVFRQX0hFQURFUlMsIGhlYWRlcnNDYXJyaWVyKTtcbiAgICAgKiAgICAgdmFyIHNlcnZlclNwYW4gPSBUcmFjZXIuc3RhcnRTcGFuKCcuLi4nLCB7IGNoaWxkT2YgOiB3aXJlQ3R4IH0pO1xuICAgICAqXG4gICAgICogQHBhcmFtICB7c3RyaW5nfSBmb3JtYXQgLSB0aGUgZm9ybWF0IG9mIHRoZSBjYXJyaWVyLlxuICAgICAqIEBwYXJhbSAge2FueX0gY2FycmllciAtIHRoZSB0eXBlIG9mIHRoZSBjYXJyaWVyIG9iamVjdCBpcyBkZXRlcm1pbmVkIGJ5XG4gICAgICogICAgICAgICB0aGUgZm9ybWF0LlxuICAgICAqIEByZXR1cm4ge1NwYW5Db250ZXh0fVxuICAgICAqICAgICAgICAgVGhlIGV4dHJhY3RlZCBTcGFuQ29udGV4dCwgb3IgbnVsbCBpZiBubyBzdWNoIFNwYW5Db250ZXh0IGNvdWxkXG4gICAgICogICAgICAgICBiZSBmb3VuZCBpbiBgY2FycmllcmBcbiAgICAgKi9cbiAgICBUcmFjZXIucHJvdG90eXBlLmV4dHJhY3QgPSBmdW5jdGlvbiAoZm9ybWF0LCBjYXJyaWVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9leHRyYWN0KGZvcm1hdCwgY2Fycmllcik7XG4gICAgfTtcbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG4gICAgLy8gRGVyaXZlZCBjbGFzc2VzIGNhbiBjaG9vc2UgdG8gaW1wbGVtZW50IHRoZSBiZWxvd1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cbiAgICAvLyBOT1RFOiB0aGUgaW5wdXQgdG8gdGhpcyBtZXRob2QgaXMgKmFsd2F5cyogYW4gYXNzb2NpYXRpdmUgYXJyYXkuIFRoZVxuICAgIC8vIHB1YmxpYy1mYWNpbmcgc3RhcnRTcGFuKCkgbWV0aG9kIG5vcm1hbGl6ZXMgdGhlIGFyZ3VtZW50cyBzbyB0aGF0XG4gICAgLy8gYWxsIE4gaW1wbGVtZW50YXRpb25zIGRvIG5vdCBuZWVkIHRvIHdvcnJ5IGFib3V0IHZhcmlhdGlvbnMgaW4gdGhlIGNhbGxcbiAgICAvLyBzaWduYXR1cmUuXG4gICAgLy9cbiAgICAvLyBUaGUgZGVmYXVsdCBiZWhhdmlvciByZXR1cm5zIGEgbm8tb3Agc3Bhbi5cbiAgICBUcmFjZXIucHJvdG90eXBlLl9zdGFydFNwYW4gPSBmdW5jdGlvbiAobmFtZSwgZmllbGRzKSB7XG4gICAgICAgIHJldHVybiBOb29wLnNwYW47XG4gICAgfTtcbiAgICAvLyBUaGUgZGVmYXVsdCBiZWhhdmlvciBpcyBhIG5vLW9wLlxuICAgIFRyYWNlci5wcm90b3R5cGUuX2luamVjdCA9IGZ1bmN0aW9uIChzcGFuQ29udGV4dCwgZm9ybWF0LCBjYXJyaWVyKSB7XG4gICAgfTtcbiAgICAvLyBUaGUgZGVmYXVsdCBiZWhhdmlvciBpcyB0byByZXR1cm4gYSBuby1vcCBTcGFuQ29udGV4dC5cbiAgICBUcmFjZXIucHJvdG90eXBlLl9leHRyYWN0ID0gZnVuY3Rpb24gKGZvcm1hdCwgY2Fycmllcikge1xuICAgICAgICByZXR1cm4gTm9vcC5zcGFuQ29udGV4dDtcbiAgICB9O1xuICAgIHJldHVybiBUcmFjZXI7XG59KCkpO1xuZXhwb3J0cy5UcmFjZXIgPSBUcmFjZXI7XG5leHBvcnRzLmRlZmF1bHQgPSBUcmFjZXI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD10cmFjZXIuanMubWFwIiwiLyoqXG4gKiBAdGhpcyB7UHJvbWlzZX1cbiAqL1xuZnVuY3Rpb24gZmluYWxseUNvbnN0cnVjdG9yKGNhbGxiYWNrKSB7XG4gIHZhciBjb25zdHJ1Y3RvciA9IHRoaXMuY29uc3RydWN0b3I7XG4gIHJldHVybiB0aGlzLnRoZW4oXG4gICAgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgIC8vIEB0cy1pZ25vcmVcbiAgICAgIHJldHVybiBjb25zdHJ1Y3Rvci5yZXNvbHZlKGNhbGxiYWNrKCkpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICByZXR1cm4gY29uc3RydWN0b3IucmVzb2x2ZShjYWxsYmFjaygpKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIHJldHVybiBjb25zdHJ1Y3Rvci5yZWplY3QocmVhc29uKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZmluYWxseUNvbnN0cnVjdG9yO1xuIiwiaW1wb3J0IHByb21pc2VGaW5hbGx5IGZyb20gJy4vZmluYWxseSc7XG5cbi8vIFN0b3JlIHNldFRpbWVvdXQgcmVmZXJlbmNlIHNvIHByb21pc2UtcG9seWZpbGwgd2lsbCBiZSB1bmFmZmVjdGVkIGJ5XG4vLyBvdGhlciBjb2RlIG1vZGlmeWluZyBzZXRUaW1lb3V0IChsaWtlIHNpbm9uLnVzZUZha2VUaW1lcnMoKSlcbnZhciBzZXRUaW1lb3V0RnVuYyA9IHNldFRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGlzQXJyYXkoeCkge1xuICByZXR1cm4gQm9vbGVhbih4ICYmIHR5cGVvZiB4Lmxlbmd0aCAhPT0gJ3VuZGVmaW5lZCcpO1xufVxuXG5mdW5jdGlvbiBub29wKCkge31cblxuLy8gUG9seWZpbGwgZm9yIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kXG5mdW5jdGlvbiBiaW5kKGZuLCB0aGlzQXJnKSB7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICBmbi5hcHBseSh0aGlzQXJnLCBhcmd1bWVudHMpO1xuICB9O1xufVxuXG4vKipcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqL1xuZnVuY3Rpb24gUHJvbWlzZShmbikge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgUHJvbWlzZSkpXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignUHJvbWlzZXMgbXVzdCBiZSBjb25zdHJ1Y3RlZCB2aWEgbmV3Jyk7XG4gIGlmICh0eXBlb2YgZm4gIT09ICdmdW5jdGlvbicpIHRocm93IG5ldyBUeXBlRXJyb3IoJ25vdCBhIGZ1bmN0aW9uJyk7XG4gIC8qKiBAdHlwZSB7IW51bWJlcn0gKi9cbiAgdGhpcy5fc3RhdGUgPSAwO1xuICAvKiogQHR5cGUgeyFib29sZWFufSAqL1xuICB0aGlzLl9oYW5kbGVkID0gZmFsc2U7XG4gIC8qKiBAdHlwZSB7UHJvbWlzZXx1bmRlZmluZWR9ICovXG4gIHRoaXMuX3ZhbHVlID0gdW5kZWZpbmVkO1xuICAvKiogQHR5cGUgeyFBcnJheTwhRnVuY3Rpb24+fSAqL1xuICB0aGlzLl9kZWZlcnJlZHMgPSBbXTtcblxuICBkb1Jlc29sdmUoZm4sIHRoaXMpO1xufVxuXG5mdW5jdGlvbiBoYW5kbGUoc2VsZiwgZGVmZXJyZWQpIHtcbiAgd2hpbGUgKHNlbGYuX3N0YXRlID09PSAzKSB7XG4gICAgc2VsZiA9IHNlbGYuX3ZhbHVlO1xuICB9XG4gIGlmIChzZWxmLl9zdGF0ZSA9PT0gMCkge1xuICAgIHNlbGYuX2RlZmVycmVkcy5wdXNoKGRlZmVycmVkKTtcbiAgICByZXR1cm47XG4gIH1cbiAgc2VsZi5faGFuZGxlZCA9IHRydWU7XG4gIFByb21pc2UuX2ltbWVkaWF0ZUZuKGZ1bmN0aW9uKCkge1xuICAgIHZhciBjYiA9IHNlbGYuX3N0YXRlID09PSAxID8gZGVmZXJyZWQub25GdWxmaWxsZWQgOiBkZWZlcnJlZC5vblJlamVjdGVkO1xuICAgIGlmIChjYiA9PT0gbnVsbCkge1xuICAgICAgKHNlbGYuX3N0YXRlID09PSAxID8gcmVzb2x2ZSA6IHJlamVjdCkoZGVmZXJyZWQucHJvbWlzZSwgc2VsZi5fdmFsdWUpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgcmV0O1xuICAgIHRyeSB7XG4gICAgICByZXQgPSBjYihzZWxmLl92YWx1ZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmVqZWN0KGRlZmVycmVkLnByb21pc2UsIGUpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXNvbHZlKGRlZmVycmVkLnByb21pc2UsIHJldCk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiByZXNvbHZlKHNlbGYsIG5ld1ZhbHVlKSB7XG4gIHRyeSB7XG4gICAgLy8gUHJvbWlzZSBSZXNvbHV0aW9uIFByb2NlZHVyZTogaHR0cHM6Ly9naXRodWIuY29tL3Byb21pc2VzLWFwbHVzL3Byb21pc2VzLXNwZWMjdGhlLXByb21pc2UtcmVzb2x1dGlvbi1wcm9jZWR1cmVcbiAgICBpZiAobmV3VmFsdWUgPT09IHNlbGYpXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBIHByb21pc2UgY2Fubm90IGJlIHJlc29sdmVkIHdpdGggaXRzZWxmLicpO1xuICAgIGlmIChcbiAgICAgIG5ld1ZhbHVlICYmXG4gICAgICAodHlwZW9mIG5ld1ZhbHVlID09PSAnb2JqZWN0JyB8fCB0eXBlb2YgbmV3VmFsdWUgPT09ICdmdW5jdGlvbicpXG4gICAgKSB7XG4gICAgICB2YXIgdGhlbiA9IG5ld1ZhbHVlLnRoZW47XG4gICAgICBpZiAobmV3VmFsdWUgaW5zdGFuY2VvZiBQcm9taXNlKSB7XG4gICAgICAgIHNlbGYuX3N0YXRlID0gMztcbiAgICAgICAgc2VsZi5fdmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgICAgZmluYWxlKHNlbGYpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiB0aGVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGRvUmVzb2x2ZShiaW5kKHRoZW4sIG5ld1ZhbHVlKSwgc2VsZik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gICAgc2VsZi5fc3RhdGUgPSAxO1xuICAgIHNlbGYuX3ZhbHVlID0gbmV3VmFsdWU7XG4gICAgZmluYWxlKHNlbGYpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmVqZWN0KHNlbGYsIGUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHJlamVjdChzZWxmLCBuZXdWYWx1ZSkge1xuICBzZWxmLl9zdGF0ZSA9IDI7XG4gIHNlbGYuX3ZhbHVlID0gbmV3VmFsdWU7XG4gIGZpbmFsZShzZWxmKTtcbn1cblxuZnVuY3Rpb24gZmluYWxlKHNlbGYpIHtcbiAgaWYgKHNlbGYuX3N0YXRlID09PSAyICYmIHNlbGYuX2RlZmVycmVkcy5sZW5ndGggPT09IDApIHtcbiAgICBQcm9taXNlLl9pbW1lZGlhdGVGbihmdW5jdGlvbigpIHtcbiAgICAgIGlmICghc2VsZi5faGFuZGxlZCkge1xuICAgICAgICBQcm9taXNlLl91bmhhbmRsZWRSZWplY3Rpb25GbihzZWxmLl92YWx1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gc2VsZi5fZGVmZXJyZWRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgaGFuZGxlKHNlbGYsIHNlbGYuX2RlZmVycmVkc1tpXSk7XG4gIH1cbiAgc2VsZi5fZGVmZXJyZWRzID0gbnVsbDtcbn1cblxuLyoqXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gSGFuZGxlcihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCwgcHJvbWlzZSkge1xuICB0aGlzLm9uRnVsZmlsbGVkID0gdHlwZW9mIG9uRnVsZmlsbGVkID09PSAnZnVuY3Rpb24nID8gb25GdWxmaWxsZWQgOiBudWxsO1xuICB0aGlzLm9uUmVqZWN0ZWQgPSB0eXBlb2Ygb25SZWplY3RlZCA9PT0gJ2Z1bmN0aW9uJyA/IG9uUmVqZWN0ZWQgOiBudWxsO1xuICB0aGlzLnByb21pc2UgPSBwcm9taXNlO1xufVxuXG4vKipcbiAqIFRha2UgYSBwb3RlbnRpYWxseSBtaXNiZWhhdmluZyByZXNvbHZlciBmdW5jdGlvbiBhbmQgbWFrZSBzdXJlXG4gKiBvbkZ1bGZpbGxlZCBhbmQgb25SZWplY3RlZCBhcmUgb25seSBjYWxsZWQgb25jZS5cbiAqXG4gKiBNYWtlcyBubyBndWFyYW50ZWVzIGFib3V0IGFzeW5jaHJvbnkuXG4gKi9cbmZ1bmN0aW9uIGRvUmVzb2x2ZShmbiwgc2VsZikge1xuICB2YXIgZG9uZSA9IGZhbHNlO1xuICB0cnkge1xuICAgIGZuKFxuICAgICAgZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgaWYgKGRvbmUpIHJldHVybjtcbiAgICAgICAgZG9uZSA9IHRydWU7XG4gICAgICAgIHJlc29sdmUoc2VsZiwgdmFsdWUpO1xuICAgICAgfSxcbiAgICAgIGZ1bmN0aW9uKHJlYXNvbikge1xuICAgICAgICBpZiAoZG9uZSkgcmV0dXJuO1xuICAgICAgICBkb25lID0gdHJ1ZTtcbiAgICAgICAgcmVqZWN0KHNlbGYsIHJlYXNvbik7XG4gICAgICB9XG4gICAgKTtcbiAgfSBjYXRjaCAoZXgpIHtcbiAgICBpZiAoZG9uZSkgcmV0dXJuO1xuICAgIGRvbmUgPSB0cnVlO1xuICAgIHJlamVjdChzZWxmLCBleCk7XG4gIH1cbn1cblxuUHJvbWlzZS5wcm90b3R5cGVbJ2NhdGNoJ10gPSBmdW5jdGlvbihvblJlamVjdGVkKSB7XG4gIHJldHVybiB0aGlzLnRoZW4obnVsbCwgb25SZWplY3RlZCk7XG59O1xuXG5Qcm9taXNlLnByb3RvdHlwZS50aGVuID0gZnVuY3Rpb24ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpIHtcbiAgLy8gQHRzLWlnbm9yZVxuICB2YXIgcHJvbSA9IG5ldyB0aGlzLmNvbnN0cnVjdG9yKG5vb3ApO1xuXG4gIGhhbmRsZSh0aGlzLCBuZXcgSGFuZGxlcihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCwgcHJvbSkpO1xuICByZXR1cm4gcHJvbTtcbn07XG5cblByb21pc2UucHJvdG90eXBlWydmaW5hbGx5J10gPSBwcm9taXNlRmluYWxseTtcblxuUHJvbWlzZS5hbGwgPSBmdW5jdGlvbihhcnIpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgIGlmICghaXNBcnJheShhcnIpKSB7XG4gICAgICByZXR1cm4gcmVqZWN0KG5ldyBUeXBlRXJyb3IoJ1Byb21pc2UuYWxsIGFjY2VwdHMgYW4gYXJyYXknKSk7XG4gICAgfVxuXG4gICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcnIpO1xuICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHJlc29sdmUoW10pO1xuICAgIHZhciByZW1haW5pbmcgPSBhcmdzLmxlbmd0aDtcblxuICAgIGZ1bmN0aW9uIHJlcyhpLCB2YWwpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmICh2YWwgJiYgKHR5cGVvZiB2YWwgPT09ICdvYmplY3QnIHx8IHR5cGVvZiB2YWwgPT09ICdmdW5jdGlvbicpKSB7XG4gICAgICAgICAgdmFyIHRoZW4gPSB2YWwudGhlbjtcbiAgICAgICAgICBpZiAodHlwZW9mIHRoZW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoZW4uY2FsbChcbiAgICAgICAgICAgICAgdmFsLFxuICAgICAgICAgICAgICBmdW5jdGlvbih2YWwpIHtcbiAgICAgICAgICAgICAgICByZXMoaSwgdmFsKTtcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgcmVqZWN0XG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBhcmdzW2ldID0gdmFsO1xuICAgICAgICBpZiAoLS1yZW1haW5pbmcgPT09IDApIHtcbiAgICAgICAgICByZXNvbHZlKGFyZ3MpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICByZWplY3QoZXgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJncy5sZW5ndGg7IGkrKykge1xuICAgICAgcmVzKGksIGFyZ3NbaV0pO1xuICAgIH1cbiAgfSk7XG59O1xuXG5Qcm9taXNlLnJlc29sdmUgPSBmdW5jdGlvbih2YWx1ZSkge1xuICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZS5jb25zdHJ1Y3RvciA9PT0gUHJvbWlzZSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlKSB7XG4gICAgcmVzb2x2ZSh2YWx1ZSk7XG4gIH0pO1xufTtcblxuUHJvbWlzZS5yZWplY3QgPSBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgcmVqZWN0KHZhbHVlKTtcbiAgfSk7XG59O1xuXG5Qcm9taXNlLnJhY2UgPSBmdW5jdGlvbihhcnIpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgIGlmICghaXNBcnJheShhcnIpKSB7XG4gICAgICByZXR1cm4gcmVqZWN0KG5ldyBUeXBlRXJyb3IoJ1Byb21pc2UucmFjZSBhY2NlcHRzIGFuIGFycmF5JykpO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBhcnIubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIFByb21pc2UucmVzb2x2ZShhcnJbaV0pLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgICB9XG4gIH0pO1xufTtcblxuLy8gVXNlIHBvbHlmaWxsIGZvciBzZXRJbW1lZGlhdGUgZm9yIHBlcmZvcm1hbmNlIGdhaW5zXG5Qcm9taXNlLl9pbW1lZGlhdGVGbiA9XG4gIC8vIEB0cy1pZ25vcmVcbiAgKHR5cGVvZiBzZXRJbW1lZGlhdGUgPT09ICdmdW5jdGlvbicgJiZcbiAgICBmdW5jdGlvbihmbikge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgc2V0SW1tZWRpYXRlKGZuKTtcbiAgICB9KSB8fFxuICBmdW5jdGlvbihmbikge1xuICAgIHNldFRpbWVvdXRGdW5jKGZuLCAwKTtcbiAgfTtcblxuUHJvbWlzZS5fdW5oYW5kbGVkUmVqZWN0aW9uRm4gPSBmdW5jdGlvbiBfdW5oYW5kbGVkUmVqZWN0aW9uRm4oZXJyKSB7XG4gIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiYgY29uc29sZSkge1xuICAgIGNvbnNvbGUud2FybignUG9zc2libGUgVW5oYW5kbGVkIFByb21pc2UgUmVqZWN0aW9uOicsIGVycik7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tY29uc29sZVxuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBQcm9taXNlO1xuIiwiKGZ1bmN0aW9uIChyb290LCBmYWN0b3J5KSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIC8vIFVuaXZlcnNhbCBNb2R1bGUgRGVmaW5pdGlvbiAoVU1EKSB0byBzdXBwb3J0IEFNRCwgQ29tbW9uSlMvTm9kZS5qcywgUmhpbm8sIGFuZCBicm93c2Vycy5cblxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoJ3N0YWNrZnJhbWUnLCBbXSwgZmFjdG9yeSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdC5TdGFja0ZyYW1lID0gZmFjdG9yeSgpO1xuICAgIH1cbn0odGhpcywgZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBmdW5jdGlvbiBfaXNOdW1iZXIobikge1xuICAgICAgICByZXR1cm4gIWlzTmFOKHBhcnNlRmxvYXQobikpICYmIGlzRmluaXRlKG4pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIFN0YWNrRnJhbWUoZnVuY3Rpb25OYW1lLCBhcmdzLCBmaWxlTmFtZSwgbGluZU51bWJlciwgY29sdW1uTnVtYmVyLCBzb3VyY2UpIHtcbiAgICAgICAgaWYgKGZ1bmN0aW9uTmFtZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLnNldEZ1bmN0aW9uTmFtZShmdW5jdGlvbk5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhcmdzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0QXJncyhhcmdzKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZmlsZU5hbWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5zZXRGaWxlTmFtZShmaWxlTmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxpbmVOdW1iZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5zZXRMaW5lTnVtYmVyKGxpbmVOdW1iZXIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb2x1bW5OdW1iZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5zZXRDb2x1bW5OdW1iZXIoY29sdW1uTnVtYmVyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc291cmNlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U291cmNlKHNvdXJjZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBTdGFja0ZyYW1lLnByb3RvdHlwZSA9IHtcbiAgICAgICAgZ2V0RnVuY3Rpb25OYW1lOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5mdW5jdGlvbk5hbWU7XG4gICAgICAgIH0sXG4gICAgICAgIHNldEZ1bmN0aW9uTmFtZTogZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICAgIHRoaXMuZnVuY3Rpb25OYW1lID0gU3RyaW5nKHYpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldEFyZ3M6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmFyZ3M7XG4gICAgICAgIH0sXG4gICAgICAgIHNldEFyZ3M6IGZ1bmN0aW9uICh2KSB7XG4gICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHYpICE9PSAnW29iamVjdCBBcnJheV0nKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJncyBtdXN0IGJlIGFuIEFycmF5Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmFyZ3MgPSB2O1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIE5PVEU6IFByb3BlcnR5IG5hbWUgbWF5IGJlIG1pc2xlYWRpbmcgYXMgaXQgaW5jbHVkZXMgdGhlIHBhdGgsXG4gICAgICAgIC8vIGJ1dCBpdCBzb21ld2hhdCBtaXJyb3JzIFY4J3MgSmF2YVNjcmlwdFN0YWNrVHJhY2VBcGlcbiAgICAgICAgLy8gaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC92OC93aWtpL0phdmFTY3JpcHRTdGFja1RyYWNlQXBpIGFuZCBHZWNrbydzXG4gICAgICAgIC8vIGh0dHA6Ly9teHIubW96aWxsYS5vcmcvbW96aWxsYS1jZW50cmFsL3NvdXJjZS94cGNvbS9iYXNlL25zSUV4Y2VwdGlvbi5pZGwjMTRcbiAgICAgICAgZ2V0RmlsZU5hbWU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZpbGVOYW1lO1xuICAgICAgICB9LFxuICAgICAgICBzZXRGaWxlTmFtZTogZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICAgIHRoaXMuZmlsZU5hbWUgPSBTdHJpbmcodik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0TGluZU51bWJlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGluZU51bWJlcjtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0TGluZU51bWJlcjogZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICAgIGlmICghX2lzTnVtYmVyKHYpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignTGluZSBOdW1iZXIgbXVzdCBiZSBhIE51bWJlcicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5saW5lTnVtYmVyID0gTnVtYmVyKHYpO1xuICAgICAgICB9LFxuXG4gICAgICAgIGdldENvbHVtbk51bWJlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY29sdW1uTnVtYmVyO1xuICAgICAgICB9LFxuICAgICAgICBzZXRDb2x1bW5OdW1iZXI6IGZ1bmN0aW9uICh2KSB7XG4gICAgICAgICAgICBpZiAoIV9pc051bWJlcih2KSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0NvbHVtbiBOdW1iZXIgbXVzdCBiZSBhIE51bWJlcicpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jb2x1bW5OdW1iZXIgPSBOdW1iZXIodik7XG4gICAgICAgIH0sXG5cbiAgICAgICAgZ2V0U291cmNlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zb3VyY2U7XG4gICAgICAgIH0sXG4gICAgICAgIHNldFNvdXJjZTogZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICAgIHRoaXMuc291cmNlID0gU3RyaW5nKHYpO1xuICAgICAgICB9LFxuXG4gICAgICAgIHRvU3RyaW5nOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBmdW5jdGlvbk5hbWUgPSB0aGlzLmdldEZ1bmN0aW9uTmFtZSgpIHx8ICd7YW5vbnltb3VzfSc7XG4gICAgICAgICAgICB2YXIgYXJncyA9ICcoJyArICh0aGlzLmdldEFyZ3MoKSB8fCBbXSkuam9pbignLCcpICsgJyknO1xuICAgICAgICAgICAgdmFyIGZpbGVOYW1lID0gdGhpcy5nZXRGaWxlTmFtZSgpID8gKCdAJyArIHRoaXMuZ2V0RmlsZU5hbWUoKSkgOiAnJztcbiAgICAgICAgICAgIHZhciBsaW5lTnVtYmVyID0gX2lzTnVtYmVyKHRoaXMuZ2V0TGluZU51bWJlcigpKSA/ICgnOicgKyB0aGlzLmdldExpbmVOdW1iZXIoKSkgOiAnJztcbiAgICAgICAgICAgIHZhciBjb2x1bW5OdW1iZXIgPSBfaXNOdW1iZXIodGhpcy5nZXRDb2x1bW5OdW1iZXIoKSkgPyAoJzonICsgdGhpcy5nZXRDb2x1bW5OdW1iZXIoKSkgOiAnJztcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbk5hbWUgKyBhcmdzICsgZmlsZU5hbWUgKyBsaW5lTnVtYmVyICsgY29sdW1uTnVtYmVyO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBTdGFja0ZyYW1lO1xufSkpO1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0ZnVuY3Rpb24oKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG5cdFx0ZnVuY3Rpb24oKSB7IHJldHVybiBtb2R1bGU7IH07XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBkZWZpbml0aW9uKSB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iaiwgcHJvcCkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7IH0iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8qKlxuICogTUlUIExpY2Vuc2VcbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTctcHJlc2VudCwgRWxhc3RpY3NlYXJjaCBCVlxuICpcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiAqIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiAqIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiAqIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiAqIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuICogZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqXG4gKiBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuICogYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4gKlxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuICogSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gKiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiAqIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiAqIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gKiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4gKiBUSEUgU09GVFdBUkUuXG4gKlxuICovXG5cbmltcG9ydCB7XG4gIGNyZWF0ZVNlcnZpY2VGYWN0b3J5LFxuICBib290c3RyYXAsXG4gIGlzQnJvd3NlclxufSBmcm9tICdAZWxhc3RpYy9hcG0tcnVtLWNvcmUnXG5pbXBvcnQgQXBtQmFzZSBmcm9tICcuL2FwbS1iYXNlJ1xuXG4vKipcbiAqIFVzZSBhIHNpbmdsZSBpbnN0YW5jZSBvZiBBcG1CYXNlIGFjcm9zcyBhbGwgaW5zdGFuY2Ugb2YgdGhlIGFnZW50XG4gKiBpbmNsdWRpbmcgdGhlIGluc3RhbmNlcyB1c2VkIGluIGZyYW1ld29yayBzcGVjaWZpYyBpbnRlZ3JhdGlvbnNcbiAqL1xuZnVuY3Rpb24gZ2V0QXBtQmFzZSgpIHtcbiAgaWYgKGlzQnJvd3NlciAmJiB3aW5kb3cuZWxhc3RpY0FwbSkge1xuICAgIHJldHVybiB3aW5kb3cuZWxhc3RpY0FwbVxuICB9XG4gIGNvbnN0IGVuYWJsZWQgPSBib290c3RyYXAoKVxuICBjb25zdCBzZXJ2aWNlRmFjdG9yeSA9IGNyZWF0ZVNlcnZpY2VGYWN0b3J5KClcbiAgY29uc3QgYXBtQmFzZSA9IG5ldyBBcG1CYXNlKHNlcnZpY2VGYWN0b3J5LCAhZW5hYmxlZClcblxuICBpZiAoaXNCcm93c2VyKSB7XG4gICAgd2luZG93LmVsYXN0aWNBcG0gPSBhcG1CYXNlXG4gIH1cblxuICByZXR1cm4gYXBtQmFzZVxufVxuXG5jb25zdCBhcG1CYXNlID0gZ2V0QXBtQmFzZSgpXG5jb25zdCBpbml0ID0gYXBtQmFzZS5pbml0LmJpbmQoYXBtQmFzZSlcblxuZXhwb3J0IGRlZmF1bHQgaW5pdFxuZXhwb3J0IHsgaW5pdCwgYXBtQmFzZSwgQXBtQmFzZSwgYXBtQmFzZSBhcyBhcG0gfVxuIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7OztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QTs7Ozs7Ozs7Ozs7OztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEE7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUxBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEE7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFEQTtBQUdBO0FBVkE7QUFZQTtBQWJBO0FBZUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNwV0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEE7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBTUE7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFQQTtBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFFQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFEQTtBQUdBO0FBVkE7QUFZQTtBQWJBO0FBZUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBUkE7QUFDQTtBQVVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFDQTtBQUNBO0FBZkE7QUFDQTtBQWlCQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFHQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQVJBO0FBVUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7QUFEQTtBQUpBO0FBSkE7QUFhQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFDQTtBQUNBOztBOzs7Ozs7Ozs7Ozs7O0FDMVVBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFEQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQURBO0FBQUE7QUFDQTtBQURBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBOUJBO0FBZ0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3UUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0REE7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQURBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQURBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBUEE7QUFTQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUxBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBTEE7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFEQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVhBO0FBQ0E7QUFhQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QTs7Ozs7Ozs7Ozs7QUNyS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0E7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ25EQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBREE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFEQTtBQUFBO0FBQ0E7QUFEQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFDQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBOzs7Ozs7Ozs7Ozs7O0FDM0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBOzs7Ozs7Ozs7Ozs7Ozs7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFDQTtBQUNBOztBOzs7Ozs7Ozs7Ozs7OztBQzFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBOzs7Ozs7Ozs7OztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0E7Ozs7Ozs7Ozs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QTs7Ozs7Ozs7Ozs7Ozs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFDQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQURBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBOzs7Ozs7Ozs7Ozs7Ozs7O0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUpBO0FBSkE7QUFXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0E7Ozs7Ozs7Ozs7Ozs7O0FDekhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFGQTtBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDeEJBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBOzs7Ozs7Ozs7Ozs7Ozs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBTEE7QUFKQTtBQUNBO0FBWUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0E7Ozs7Ozs7Ozs7Ozs7OztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QTs7Ozs7Ozs7OztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBOzs7Ozs7Ozs7Ozs7O0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQU5BO0FBUUE7QUFDQTtBQURBO0FBVEE7QUFhQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBRkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBRkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBREE7QUFHQTtBQUNBO0FBREE7QUFHQTtBQUNBO0FBYkE7QUFlQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQVRBO0FBV0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFUQTtBQVdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7QUFEQTtBQUdBO0FBWkE7QUFDQTtBQWNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0E7Ozs7Ozs7Ozs7Ozs7OztBQ3hKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMQTtBQUNBO0FBT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbE1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QTs7Ozs7Ozs7Ozs7Ozs7OztBQ2pYQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBREE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBREE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSEE7QUFLQTtBQVJBO0FBQ0E7QUFVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFKQTtBQVNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QTs7Ozs7Ozs7Ozs7Ozs7OztBQ3RMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7OztBOzs7Ozs7Ozs7Ozs7OztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFMQTtBQU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUVBO0FBQ0E7QUFDQTs7QTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3RJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0E7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBOzs7Ozs7Ozs7Ozs7O0FDWEE7QUFBQTtBQUFBO0FBQ0E7QUFEQTtBQUFBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFEQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBREE7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QTs7Ozs7Ozs7Ozs7Ozs7OztBQzNGQTtBQUFBO0FBQUE7QUFDQTtBQURBO0FBQUE7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQURBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFYQTtBQWFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFYQTtBQUNBO0FBYUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QTs7Ozs7Ozs7Ozs7Ozs7O0FDM0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUhBO0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUdBO0FBQ0E7QUFDQTtBQUZBO0FBQ0E7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBR0E7QUFBQTtBQUFBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFOQTtBQVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0E7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDaEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUtBO0FBQ0E7QUFDQTtBQUNBOzs7QTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBSkE7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBYkE7QUFtQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFLQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBS0E7QUFDQTtBQUNBO0FBRkE7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBRUE7QUFDQTtBQURBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFFQTtBQUNBO0FBREE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdk5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBOzs7Ozs7Ozs7Ozs7Ozs7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQUZBO0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBOzs7Ozs7Ozs7Ozs7Ozs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QTs7Ozs7Ozs7Ozs7Ozs7OztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0E7Ozs7Ozs7Ozs7Ozs7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFkQTtBQWdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBakJBO0FBbUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0E7Ozs7Ozs7Ozs7OztBQzlWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QTs7Ozs7Ozs7Ozs7O0FDdkZBO0FBQUE7QUFBQTtBQUNBO0FBREE7QUFBQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBREE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7QUFBQTtBQUFBO0FBQ0E7QUFNQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFEQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFKQTtBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUhBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUZBO0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFIQTtBQURBO0FBQ0E7QUFPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFGQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBOzs7Ozs7Ozs7Ozs7Ozs7QUNoWkE7QUFBQTtBQUFBO0FBQ0E7QUFEQTtBQUFBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFEQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBOzs7Ozs7Ozs7Ozs7OztBQzFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRkE7OztBOzs7Ozs7Ozs7Ozs7Ozs7OztBQ3VCQTtBQUNBO0FBZ0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBV0E7QUFDQTtBQUlBO0FBQ0E7QUFJQTtBQUNBO0FBQUE7QUFDQTtBQUVBO0FBS0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFFQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBTUE7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBU0E7QUFNQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBS0E7QUFDQTtBQUNBO0FBRkE7QUFDQTtBQUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBT0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQWdCQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBR0E7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUFBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQURBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7O0E7Ozs7Ozs7O0FDdlVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0EsYUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QTs7Ozs7Ozs7O0FDeE5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QTs7Ozs7Ozs7O0FDOURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QTs7Ozs7Ozs7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0E7Ozs7Ozs7OztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QTs7Ozs7Ozs7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QTs7Ozs7Ozs7O0FDOU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0E7Ozs7Ozs7OztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0E7Ozs7Ozs7Ozs7QUNsSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0E7Ozs7Ozs7Ozs7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0E7Ozs7Ozs7O0FDM1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0EsYUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBOzs7O0FDMUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDUEE7Ozs7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNtQkE7QUFLQTtBQUNBO0FBS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7Ozs7OztBIiwic291cmNlUm9vdCI6IiJ9