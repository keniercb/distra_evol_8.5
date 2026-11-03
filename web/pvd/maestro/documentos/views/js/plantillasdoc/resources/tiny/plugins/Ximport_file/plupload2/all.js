/*! jQuery v1.11.1 | (c) 2005, 2014 jQuery Foundation, Inc. | jquery.org/license */
!function (d, c) {
    "object" == typeof module && "object" == typeof module.exports ? module.exports = d.document ? c(d, !0) : function (b) {
        if (!b.document) {
            throw new Error("jQuery requires a window with a document");
        }
        return c(b);
    } : c(d);
}("undefined" != typeof window ? window : this, function (a, b) {
    var c = [], d = c.slice, e = c.concat, f = c.push, g = c.indexOf, h = {}, i = h.toString, j = h.hasOwnProperty, k = {}, l = "1.11.1", m = function (a, b) {
        return new m.fn.init(a, b);
    }, n = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, o = /^-ms-/, p = /-([\da-z])/gi, q = function (a, b) {
        return b.toUpperCase();
    };
    m.fn = m.prototype = {
        jquery: l, constructor: m, selector: "", length: 0, toArray: function () {
            return d.call(this);
        }, get: function (a) {
            return null != a ? 0 > a ? this[a + this.length] : this[a] : d.call(this);
        }, pushStack: function (a) {
            var b = m.merge(this.constructor(), a);
            return b.prevObject = this, b.context = this.context, b;
        }, each: function (a, b) {
            return m.each(this, a, b);
        }, map: function (a) {
            return this.pushStack(m.map(this, function (b, c) {
                return a.call(b, c, b);
            }));
        }, slice: function () {
            return this.pushStack(d.apply(this, arguments));
        }, first: function () {
            return this.eq(0);
        }, last: function () {
            return this.eq(-1);
        }, eq: function (a) {
            var b = this.length, c = +a + (0 > a ? b : 0);
            return this.pushStack(c >= 0 && b > c ? [this[c]] : []);
        }, end: function () {
            return this.prevObject || this.constructor(null);
        }, push: f, sort: c.sort, splice: c.splice
    }, m.extend = m.fn.extend = function () {
        var a, b, c, d, e, f, g = arguments[0] || {}, h = 1, i = arguments.length, j = !1;
        for ("boolean" == typeof g && (j = g, g = arguments[h] || {}, h++), "object" == typeof g || m.isFunction(g) || (g = {}), h === i && (g = this, h--); i > h; h++) {
            if (null != (e = arguments[h])) {
                for (d in e) {
                    a = g[d], c = e[d], g !== c && (j && c && (m.isPlainObject(c) || (b = m.isArray(c))) ? (b ? (b = !1, f = a && m.isArray(a) ? a : []) : f = a && m.isPlainObject(a) ? a : {}, g[d] = m.extend(j, f, c)) : void 0 !== c && (g[d] = c));
                }
            }
        }
        return g;
    }, m.extend({
        expando: "jQuery" + (l + Math.random()).replace(/\D/g, ""), isReady: !0, error: function (a) {
            throw new Error(a);
        }, noop: function () {
        }, isFunction: function (a) {
            return "function" === m.type(a);
        }, isArray: Array.isArray || function (a) {
            return "array" === m.type(a);
        }, isWindow: function (a) {
            return null != a && a == a.window;
        }, isNumeric: function (a) {
            return !m.isArray(a) && a - parseFloat(a) >= 0;
        }, isEmptyObject: function (a) {
            var b;
            for (b in a) {
                return !1;
            }
            return !0;
        }, isPlainObject: function (a) {
            var b;
            if (!a || "object" !== m.type(a) || a.nodeType || m.isWindow(a)) {
                return !1;
            }
            try {
                if (a.constructor && !j.call(a, "constructor") && !j.call(a.constructor.prototype, "isPrototypeOf")) {
                    return !1;
                }
            } catch (c) {
                return !1;
            }
            if (k.ownLast) {
                for (b in a) {
                    return j.call(a, b);
                }
            }
            for (b in a) {
            }
            return void 0 === b || j.call(a, b);
        }, type: function (a) {
            return null == a ? a + "" : "object" == typeof a || "function" == typeof a ? h[i.call(a)] || "object" : typeof a;
        }, globalEval: function (b) {
            b && m.trim(b) && (a.execScript || function (b) {
                a.eval.call(a, b);
            })(b);
        }, camelCase: function (a) {
            return a.replace(o, "ms-").replace(p, q);
        }, nodeName: function (a, b) {
            return a.nodeName && a.nodeName.toLowerCase() === b.toLowerCase();
        }, each: function (a, b, c) {
            var d, e = 0, f = a.length, g = r(a);
            if (c) {
                if (g) {
                    for (; f > e; e++) {
                        if (d = b.apply(a[e], c), d === !1) {
                            break;
                        }
                    }
                } else {
                    for (e in a) {
                        if (d = b.apply(a[e], c), d === !1) {
                            break;
                        }
                    }
                }
            } else {
                if (g) {
                    for (; f > e; e++) {
                        if (d = b.call(a[e], e, a[e]), d === !1) {
                            break;
                        }
                    }
                } else {
                    for (e in a) {
                        if (d = b.call(a[e], e, a[e]), d === !1) {
                            break;
                        }
                    }
                }
            }
            return a;
        }, trim: function (a) {
            return null == a ? "" : (a + "").replace(n, "");
        }, makeArray: function (a, b) {
            var c = b || [];
            return null != a && (r(Object(a)) ? m.merge(c, "string" == typeof a ? [a] : a) : f.call(c, a)), c;
        }, inArray: function (a, b, c) {
            var d;
            if (b) {
                if (g) {
                    return g.call(b, a, c);
                }
                for (d = b.length, c = c ? 0 > c ? Math.max(0, d + c) : c : 0; d > c; c++) {
                    if (c in b && b[c] === a) {
                        return c;
                    }
                }
            }
            return -1;
        }, merge: function (a, b) {
            var c = +b.length, d = 0, e = a.length;
            while (c > d) {
                a[e++] = b[d++];
            }
            if (c !== c) {
                while (void 0 !== b[d]) {
                    a[e++] = b[d++];
                }
            }
            return a.length = e, a;
        }, grep: function (a, b, c) {
            for (var d, e = [], f = 0, g = a.length, h = !c; g > f; f++) {
                d = !b(a[f], f), d !== h && e.push(a[f]);
            }
            return e;
        }, map: function (a, b, c) {
            var d, f = 0, g = a.length, h = r(a), i = [];
            if (h) {
                for (; g > f; f++) {
                    d = b(a[f], f, c), null != d && i.push(d);
                }
            } else {
                for (f in a) {
                    d = b(a[f], f, c), null != d && i.push(d);
                }
            }
            return e.apply([], i);
        }, guid: 1, proxy: function (a, b) {
            var c, e, f;
            return "string" == typeof b && (f = a[b], b = a, a = f), m.isFunction(a) ? (c = d.call(arguments, 2), e = function () {
                return a.apply(b || this, c.concat(d.call(arguments)));
            }, e.guid = a.guid = a.guid || m.guid++, e) : void 0;
        }, now: function () {
            return +new Date;
        }, support: k
    }), m.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (a, b) {
        h["[object " + b + "]"] = b.toLowerCase();
    });
    function r(a) {
        var b = a.length, c = m.type(a);
        return "function" === c || m.isWindow(a) ? !1 : 1 === a.nodeType && b ? !0 : "array" === c || 0 === b || "number" == typeof b && b > 0 && b - 1 in a;
    }

    var s = function (a) {
        var b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u = "sizzle" + -new Date, v = a.document, w = 0, x = 0, y = gb(), z = gb(), A = gb(), B = function (a, b) {
            return a === b && (l = !0), 0;
        }, C = "undefined", D = 1 << 31, E = {}.hasOwnProperty, F = [], G = F.pop, H = F.push, I = F.push, J = F.slice, K = F.indexOf || function (a) {
                for (var b = 0, c = this.length; c > b; b++) {
                    if (this[b] === a) {
                        return b;
                    }
                }
                return -1;
            }, L = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", M = "[\\x20\\t\\r\\n\\f]", N = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", O = N.replace("w", "w#"), P = "\\[" + M + "*(" + N + ")(?:" + M + "*([*^$|!~]?=)" + M + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + O + "))|)" + M + "*\\]", Q = ":(" + N + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + P + ")*)|.*)\\)|)", R = new RegExp("^" + M + "+|((?:^|[^\\\\])(?:\\\\.)*)" + M + "+$", "g"), S = new RegExp("^" + M + "*," + M + "*"), T = new RegExp("^" + M + "*([>+~]|" + M + ")" + M + "*"), U = new RegExp("=" + M + "*([^\\]'\"]*?)" + M + "*\\]", "g"), V = new RegExp(Q), W = new RegExp("^" + O + "$"), X = {
            ID: new RegExp("^#(" + N + ")"),
            CLASS: new RegExp("^\\.(" + N + ")"),
            TAG: new RegExp("^(" + N.replace("w", "w*") + ")"),
            ATTR: new RegExp("^" + P),
            PSEUDO: new RegExp("^" + Q),
            CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + M + "*(even|odd|(([+-]|)(\\d*)n|)" + M + "*(?:([+-]|)" + M + "*(\\d+)|))" + M + "*\\)|)", "i"),
            bool: new RegExp("^(?:" + L + ")$", "i"),
            needsContext: new RegExp("^" + M + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + M + "*((?:-\\d)?\\d*)" + M + "*\\)|)(?=[^-]|$)", "i")
        }, Y = /^(?:input|select|textarea|button)$/i, Z = /^h\d$/i, $ = /^[^{]+\{\s*\[native \w/, _ = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, ab = /[+~]/, bb = /'|\\/g, cb = new RegExp("\\\\([\\da-f]{1,6}" + M + "?|(" + M + ")|.)", "ig"), db = function (a, b, c) {
            var d = "0x" + b - 65536;
            return d !== d || c ? b : 0 > d ? String.fromCharCode(d + 65536) : String.fromCharCode(d >> 10 | 55296, 1023 & d | 56320);
        };
        try {
            I.apply(F = J.call(v.childNodes), v.childNodes), F[v.childNodes.length].nodeType;
        } catch (eb) {
            I = {
                apply: F.length ? function (a, b) {
                    H.apply(a, J.call(b));
                } : function (a, b) {
                    var c = a.length, d = 0;
                    while (a[c++] = b[d++]) {
                    }
                    a.length = c - 1;
                }
            };
        }
        function fb(a, b, d, e) {
            var f, h, j, k, l, o, r, s, w, x;
            if ((b ? b.ownerDocument || b : v) !== n && m(b), b = b || n, d = d || [], !a || "string" != typeof a) {
                return d;
            }
            if (1 !== (k = b.nodeType) && 9 !== k) {
                return [];
            }
            if (p && !e) {
                if (f = _.exec(a)) {
                    if (j = f[1]) {
                        if (9 === k) {
                            if (h = b.getElementById(j), !h || !h.parentNode) {
                                return d;
                            }
                            if (h.id === j) {
                                return d.push(h), d;
                            }
                        } else {
                            if (b.ownerDocument && (h = b.ownerDocument.getElementById(j)) && t(b, h) && h.id === j) {
                                return d.push(h), d;
                            }
                        }
                    } else {
                        if (f[2]) {
                            return I.apply(d, b.getElementsByTagName(a)), d;
                        }
                        if ((j = f[3]) && c.getElementsByClassName && b.getElementsByClassName) {
                            return I.apply(d, b.getElementsByClassName(j)), d;
                        }
                    }
                }
                if (c.qsa && (!q || !q.test(a))) {
                    if (s = r = u, w = b, x = 9 === k && a, 1 === k && "object" !== b.nodeName.toLowerCase()) {
                        o = g(a), (r = b.getAttribute("id")) ? s = r.replace(bb, "\\$&") : b.setAttribute("id", s), s = "[id='" + s + "'] ", l = o.length;
                        while (l--) {
                            o[l] = s + qb(o[l]);
                        }
                        w = ab.test(a) && ob(b.parentNode) || b, x = o.join(",");
                    }
                    if (x) {
                        try {
                            return I.apply(d, w.querySelectorAll(x)), d;
                        } catch (y) {
                        } finally {
                            r || b.removeAttribute("id");
                        }
                    }
                }
            }
            return i(a.replace(R, "$1"), b, d, e);
        }

        function gb() {
            var a = [];

            function b(c, e) {
                return a.push(c + " ") > d.cacheLength && delete b[a.shift()], b[c + " "] = e;
            }

            return b;
        }

        function hb(a) {
            return a[u] = !0, a;
        }

        function ib(a) {
            var b = n.createElement("div");
            try {
                return !!a(b);
            } catch (c) {
                return !1;
            } finally {
                b.parentNode && b.parentNode.removeChild(b), b = null;
            }
        }

        function jb(a, b) {
            var c = a.split("|"), e = a.length;
            while (e--) {
                d.attrHandle[c[e]] = b;
            }
        }

        function kb(a, b) {
            var c = b && a, d = c && 1 === a.nodeType && 1 === b.nodeType && (~b.sourceIndex || D) - (~a.sourceIndex || D);
            if (d) {
                return d;
            }
            if (c) {
                while (c = c.nextSibling) {
                    if (c === b) {
                        return -1;
                    }
                }
            }
            return a ? 1 : -1;
        }

        function lb(a) {
            return function (b) {
                var c = b.nodeName.toLowerCase();
                return "input" === c && b.type === a;
            };
        }

        function mb(a) {
            return function (b) {
                var c = b.nodeName.toLowerCase();
                return ("input" === c || "button" === c) && b.type === a;
            };
        }

        function nb(a) {
            return hb(function (b) {
                return b = +b, hb(function (c, d) {
                    var e, f = a([], c.length, b), g = f.length;
                    while (g--) {
                        c[e = f[g]] && (c[e] = !(d[e] = c[e]));
                    }
                });
            });
        }

        function ob(a) {
            return a && typeof a.getElementsByTagName !== C && a;
        }

        c = fb.support = {}, f = fb.isXML = function (a) {
            var b = a && (a.ownerDocument || a).documentElement;
            return b ? "HTML" !== b.nodeName : !1;
        }, m = fb.setDocument = function (a) {
            var b, e = a ? a.ownerDocument || a : v, g = e.defaultView;
            return e !== n && 9 === e.nodeType && e.documentElement ? (n = e, o = e.documentElement, p = !f(e), g && g !== g.top && (g.addEventListener ? g.addEventListener("unload", function () {
                m();
            }, !1) : g.attachEvent && g.attachEvent("onunload", function () {
                m();
            })), c.attributes = ib(function (a) {
                return a.className = "i", !a.getAttribute("className");
            }), c.getElementsByTagName = ib(function (a) {
                return a.appendChild(e.createComment("")), !a.getElementsByTagName("*").length;
            }), c.getElementsByClassName = $.test(e.getElementsByClassName) && ib(function (a) {
                return a.innerHTML = "<div class='a'></div><div class='a i'></div>", a.firstChild.className = "i", 2 === a.getElementsByClassName("i").length;
            }), c.getById = ib(function (a) {
                return o.appendChild(a).id = u, !e.getElementsByName || !e.getElementsByName(u).length;
            }), c.getById ? (d.find.ID = function (a, b) {
                if (typeof b.getElementById !== C && p) {
                    var c = b.getElementById(a);
                    return c && c.parentNode ? [c] : [];
                }
            }, d.filter.ID = function (a) {
                var b = a.replace(cb, db);
                return function (a) {
                    return a.getAttribute("id") === b;
                };
            }) : (delete d.find.ID, d.filter.ID = function (a) {
                var b = a.replace(cb, db);
                return function (a) {
                    var c = typeof a.getAttributeNode !== C && a.getAttributeNode("id");
                    return c && c.value === b;
                };
            }), d.find.TAG = c.getElementsByTagName ? function (a, b) {
                return typeof b.getElementsByTagName !== C ? b.getElementsByTagName(a) : void 0;
            } : function (a, b) {
                var c, d = [], e = 0, f = b.getElementsByTagName(a);
                if ("*" === a) {
                    while (c = f[e++]) {
                        1 === c.nodeType && d.push(c);
                    }
                    return d;
                }
                return f;
            }, d.find.CLASS = c.getElementsByClassName && function (a, b) {
                return typeof b.getElementsByClassName !== C && p ? b.getElementsByClassName(a) : void 0;
            }, r = [], q = [], (c.qsa = $.test(e.querySelectorAll)) && (ib(function (a) {
                a.innerHTML = "<select msallowclip=''><option selected=''></option></select>", a.querySelectorAll("[msallowclip^='']").length && q.push("[*^$]=" + M + "*(?:''|\"\")"), a.querySelectorAll("[selected]").length || q.push("\\[" + M + "*(?:value|" + L + ")"), a.querySelectorAll(":checked").length || q.push(":checked");
            }), ib(function (a) {
                var b = e.createElement("input");
                b.setAttribute("type", "hidden"), a.appendChild(b).setAttribute("name", "D"), a.querySelectorAll("[name=d]").length && q.push("name" + M + "*[*^$|!~]?="), a.querySelectorAll(":enabled").length || q.push(":enabled", ":disabled"), a.querySelectorAll("*,:x"), q.push(",.*:");
            })), (c.matchesSelector = $.test(s = o.matches || o.webkitMatchesSelector || o.mozMatchesSelector || o.oMatchesSelector || o.msMatchesSelector)) && ib(function (a) {
                c.disconnectedMatch = s.call(a, "div"), s.call(a, "[s!='']:x"), r.push("!=", Q);
            }), q = q.length && new RegExp(q.join("|")), r = r.length && new RegExp(r.join("|")), b = $.test(o.compareDocumentPosition), t = b || $.test(o.contains) ? function (a, b) {
                var c = 9 === a.nodeType ? a.documentElement : a, d = b && b.parentNode;
                return a === d || !(!d || 1 !== d.nodeType || !(c.contains ? c.contains(d) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(d)));
            } : function (a, b) {
                if (b) {
                    while (b = b.parentNode) {
                        if (b === a) {
                            return !0;
                        }
                    }
                }
                return !1;
            }, B = b ? function (a, b) {
                if (a === b) {
                    return l = !0, 0;
                }
                var d = !a.compareDocumentPosition - !b.compareDocumentPosition;
                return d ? d : (d = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1, 1 & d || !c.sortDetached && b.compareDocumentPosition(a) === d ? a === e || a.ownerDocument === v && t(v, a) ? -1 : b === e || b.ownerDocument === v && t(v, b) ? 1 : k ? K.call(k, a) - K.call(k, b) : 0 : 4 & d ? -1 : 1);
            } : function (a, b) {
                if (a === b) {
                    return l = !0, 0;
                }
                var c, d = 0, f = a.parentNode, g = b.parentNode, h = [a], i = [b];
                if (!f || !g) {
                    return a === e ? -1 : b === e ? 1 : f ? -1 : g ? 1 : k ? K.call(k, a) - K.call(k, b) : 0;
                }
                if (f === g) {
                    return kb(a, b);
                }
                c = a;
                while (c = c.parentNode) {
                    h.unshift(c);
                }
                c = b;
                while (c = c.parentNode) {
                    i.unshift(c);
                }
                while (h[d] === i[d]) {
                    d++;
                }
                return d ? kb(h[d], i[d]) : h[d] === v ? -1 : i[d] === v ? 1 : 0;
            }, e) : n;
        }, fb.matches = function (a, b) {
            return fb(a, null, null, b);
        }, fb.matchesSelector = function (a, b) {
            if ((a.ownerDocument || a) !== n && m(a), b = b.replace(U, "='$1']"), !(!c.matchesSelector || !p || r && r.test(b) || q && q.test(b))) {
                try {
                    var d = s.call(a, b);
                    if (d || c.disconnectedMatch || a.document && 11 !== a.document.nodeType) {
                        return d;
                    }
                } catch (e) {
                }
            }
            return fb(b, n, null, [a]).length > 0;
        }, fb.contains = function (a, b) {
            return (a.ownerDocument || a) !== n && m(a), t(a, b);
        }, fb.attr = function (a, b) {
            (a.ownerDocument || a) !== n && m(a);
            var e = d.attrHandle[b.toLowerCase()], f = e && E.call(d.attrHandle, b.toLowerCase()) ? e(a, b, !p) : void 0;
            return void 0 !== f ? f : c.attributes || !p ? a.getAttribute(b) : (f = a.getAttributeNode(b)) && f.specified ? f.value : null;
        }, fb.error = function (a) {
            throw new Error("Syntax error, unrecognized expression: " + a);
        }, fb.uniqueSort = function (a) {
            var b, d = [], e = 0, f = 0;
            if (l = !c.detectDuplicates, k = !c.sortStable && a.slice(0), a.sort(B), l) {
                while (b = a[f++]) {
                    b === a[f] && (e = d.push(f));
                }
                while (e--) {
                    a.splice(d[e], 1);
                }
            }
            return k = null, a;
        }, e = fb.getText = function (a) {
            var b, c = "", d = 0, f = a.nodeType;
            if (f) {
                if (1 === f || 9 === f || 11 === f) {
                    if ("string" == typeof a.textContent) {
                        return a.textContent;
                    }
                    for (a = a.firstChild; a; a = a.nextSibling) {
                        c += e(a);
                    }
                } else {
                    if (3 === f || 4 === f) {
                        return a.nodeValue;
                    }
                }
            } else {
                while (b = a[d++]) {
                    c += e(b);
                }
            }
            return c;
        }, d = fb.selectors = {
            cacheLength: 50,
            createPseudo: hb,
            match: X,
            attrHandle: {},
            find: {},
            relative: {
                ">": {dir: "parentNode", first: !0},
                " ": {dir: "parentNode"},
                "+": {dir: "previousSibling", first: !0},
                "~": {dir: "previousSibling"}
            },
            preFilter: {
                ATTR: function (a) {
                    return a[1] = a[1].replace(cb, db), a[3] = (a[3] || a[4] || a[5] || "").replace(cb, db), "~=" === a[2] && (a[3] = " " + a[3] + " "), a.slice(0, 4);
                }, CHILD: function (a) {
                    return a[1] = a[1].toLowerCase(), "nth" === a[1].slice(0, 3) ? (a[3] || fb.error(a[0]), a[4] = +(a[4] ? a[5] + (a[6] || 1) : 2 * ("even" === a[3] || "odd" === a[3])), a[5] = +(a[7] + a[8] || "odd" === a[3])) : a[3] && fb.error(a[0]), a;
                }, PSEUDO: function (a) {
                    var b, c = !a[6] && a[2];
                    return X.CHILD.test(a[0]) ? null : (a[3] ? a[2] = a[4] || a[5] || "" : c && V.test(c) && (b = g(c, !0)) && (b = c.indexOf(")", c.length - b) - c.length) && (a[0] = a[0].slice(0, b), a[2] = c.slice(0, b)), a.slice(0, 3));
                }
            },
            filter: {
                TAG: function (a) {
                    var b = a.replace(cb, db).toLowerCase();
                    return "*" === a ? function () {
                        return !0;
                    } : function (a) {
                        return a.nodeName && a.nodeName.toLowerCase() === b;
                    };
                }, CLASS: function (a) {
                    var b = y[a + " "];
                    return b || (b = new RegExp("(^|" + M + ")" + a + "(" + M + "|$)")) && y(a, function (a) {
                        return b.test("string" == typeof a.className && a.className || typeof a.getAttribute !== C && a.getAttribute("class") || "");
                    });
                }, ATTR: function (a, b, c) {
                    return function (d) {
                        var e = fb.attr(d, a);
                        return null == e ? "!=" === b : b ? (e += "", "=" === b ? e === c : "!=" === b ? e !== c : "^=" === b ? c && 0 === e.indexOf(c) : "*=" === b ? c && e.indexOf(c) > -1 : "$=" === b ? c && e.slice(-c.length) === c : "~=" === b ? (" " + e + " ").indexOf(c) > -1 : "|=" === b ? e === c || e.slice(0, c.length + 1) === c + "-" : !1) : !0;
                    };
                }, CHILD: function (a, b, c, d, e) {
                    var f = "nth" !== a.slice(0, 3), g = "last" !== a.slice(-4), h = "of-type" === b;
                    return 1 === d && 0 === e ? function (a) {
                        return !!a.parentNode;
                    } : function (b, c, i) {
                        var j, k, l, m, n, o, p = f !== g ? "nextSibling" : "previousSibling", q = b.parentNode, r = h && b.nodeName.toLowerCase(), s = !i && !h;
                        if (q) {
                            if (f) {
                                while (p) {
                                    l = b;
                                    while (l = l[p]) {
                                        if (h ? l.nodeName.toLowerCase() === r : 1 === l.nodeType) {
                                            return !1;
                                        }
                                    }
                                    o = p = "only" === a && !o && "nextSibling";
                                }
                                return !0;
                            }
                            if (o = [g ? q.firstChild : q.lastChild], g && s) {
                                k = q[u] || (q[u] = {}), j = k[a] || [], n = j[0] === w && j[1], m = j[0] === w && j[2], l = n && q.childNodes[n];
                                while (l = ++n && l && l[p] || (m = n = 0) || o.pop()) {
                                    if (1 === l.nodeType && ++m && l === b) {
                                        k[a] = [w, n, m];
                                        break;
                                    }
                                }
                            } else {
                                if (s && (j = (b[u] || (b[u] = {}))[a]) && j[0] === w) {
                                    m = j[1];
                                } else {
                                    while (l = ++n && l && l[p] || (m = n = 0) || o.pop()) {
                                        if ((h ? l.nodeName.toLowerCase() === r : 1 === l.nodeType) && ++m && (s && ((l[u] || (l[u] = {}))[a] = [w, m]), l === b)) {
                                            break;
                                        }
                                    }
                                }
                            }
                            return m -= e, m === d || m % d === 0 && m / d >= 0;
                        }
                    };
                }, PSEUDO: function (a, b) {
                    var c, e = d.pseudos[a] || d.setFilters[a.toLowerCase()] || fb.error("unsupported pseudo: " + a);
                    return e[u] ? e(b) : e.length > 1 ? (c = [a, a, "", b], d.setFilters.hasOwnProperty(a.toLowerCase()) ? hb(function (a, c) {
                        var d, f = e(a, b), g = f.length;
                        while (g--) {
                            d = K.call(a, f[g]), a[d] = !(c[d] = f[g]);
                        }
                    }) : function (a) {
                        return e(a, 0, c);
                    }) : e;
                }
            },
            pseudos: {
                not: hb(function (a) {
                    var b = [], c = [], d = h(a.replace(R, "$1"));
                    return d[u] ? hb(function (a, b, c, e) {
                        var f, g = d(a, null, e, []), h = a.length;
                        while (h--) {
                            (f = g[h]) && (a[h] = !(b[h] = f));
                        }
                    }) : function (a, e, f) {
                        return b[0] = a, d(b, null, f, c), !c.pop();
                    };
                }), has: hb(function (a) {
                    return function (b) {
                        return fb(a, b).length > 0;
                    };
                }), contains: hb(function (a) {
                    return function (b) {
                        return (b.textContent || b.innerText || e(b)).indexOf(a) > -1;
                    };
                }), lang: hb(function (a) {
                    return W.test(a || "") || fb.error("unsupported lang: " + a), a = a.replace(cb, db).toLowerCase(), function (b) {
                        var c;
                        do {
                            if (c = p ? b.lang : b.getAttribute("xml:lang") || b.getAttribute("lang")) {
                                return c = c.toLowerCase(), c === a || 0 === c.indexOf(a + "-");
                            }
                        } while ((b = b.parentNode) && 1 === b.nodeType);
                        return !1;
                    };
                }), target: function (b) {
                    var c = a.location && a.location.hash;
                    return c && c.slice(1) === b.id;
                }, root: function (a) {
                    return a === o;
                }, focus: function (a) {
                    return a === n.activeElement && (!n.hasFocus || n.hasFocus()) && !!(a.type || a.href || ~a.tabIndex);
                }, enabled: function (a) {
                    return a.disabled === !1;
                }, disabled: function (a) {
                    return a.disabled === !0;
                }, checked: function (a) {
                    var b = a.nodeName.toLowerCase();
                    return "input" === b && !!a.checked || "option" === b && !!a.selected;
                }, selected: function (a) {
                    return a.parentNode && a.parentNode.selectedIndex, a.selected === !0;
                }, empty: function (a) {
                    for (a = a.firstChild; a; a = a.nextSibling) {
                        if (a.nodeType < 6) {
                            return !1;
                        }
                    }
                    return !0;
                }, parent: function (a) {
                    return !d.pseudos.empty(a);
                }, header: function (a) {
                    return Z.test(a.nodeName);
                }, input: function (a) {
                    return Y.test(a.nodeName);
                }, button: function (a) {
                    var b = a.nodeName.toLowerCase();
                    return "input" === b && "button" === a.type || "button" === b;
                }, text: function (a) {
                    var b;
                    return "input" === a.nodeName.toLowerCase() && "text" === a.type && (null == (b = a.getAttribute("type")) || "text" === b.toLowerCase());
                }, first: nb(function () {
                    return [0];
                }), last: nb(function (a, b) {
                    return [b - 1];
                }), eq: nb(function (a, b, c) {
                    return [0 > c ? c + b : c];
                }), even: nb(function (a, b) {
                    for (var c = 0; b > c; c += 2) {
                        a.push(c);
                    }
                    return a;
                }), odd: nb(function (a, b) {
                    for (var c = 1; b > c; c += 2) {
                        a.push(c);
                    }
                    return a;
                }), lt: nb(function (a, b, c) {
                    for (var d = 0 > c ? c + b : c; --d >= 0;) {
                        a.push(d);
                    }
                    return a;
                }), gt: nb(function (a, b, c) {
                    for (var d = 0 > c ? c + b : c; ++d < b;) {
                        a.push(d);
                    }
                    return a;
                })
            }
        }, d.pseudos.nth = d.pseudos.eq;
        for (b in {radio: !0, checkbox: !0, file: !0, password: !0, image: !0}) {
            d.pseudos[b] = lb(b);
        }
        for (b in {submit: !0, reset: !0}) {
            d.pseudos[b] = mb(b);
        }
        function pb() {
        }

        pb.prototype = d.filters = d.pseudos, d.setFilters = new pb, g = fb.tokenize = function (a, b) {
            var c, e, f, g, h, i, j, k = z[a + " "];
            if (k) {
                return b ? 0 : k.slice(0);
            }
            h = a, i = [], j = d.preFilter;
            while (h) {
                (!c || (e = S.exec(h))) && (e && (h = h.slice(e[0].length) || h), i.push(f = [])), c = !1, (e = T.exec(h)) && (c = e.shift(), f.push({
                    value: c,
                    type: e[0].replace(R, " ")
                }), h = h.slice(c.length));
                for (g in d.filter) {
                    !(e = X[g].exec(h)) || j[g] && !(e = j[g](e)) || (c = e.shift(), f.push({
                        value: c,
                        type: g,
                        matches: e
                    }), h = h.slice(c.length));
                }
                if (!c) {
                    break;
                }
            }
            return b ? h.length : h ? fb.error(a) : z(a, i).slice(0);
        };
        function qb(a) {
            for (var b = 0, c = a.length, d = ""; c > b; b++) {
                d += a[b].value;
            }
            return d;
        }

        function rb(a, b, c) {
            var d = b.dir, e = c && "parentNode" === d, f = x++;
            return b.first ? function (b, c, f) {
                while (b = b[d]) {
                    if (1 === b.nodeType || e) {
                        return a(b, c, f);
                    }
                }
            } : function (b, c, g) {
                var h, i, j = [w, f];
                if (g) {
                    while (b = b[d]) {
                        if ((1 === b.nodeType || e) && a(b, c, g)) {
                            return !0;
                        }
                    }
                } else {
                    while (b = b[d]) {
                        if (1 === b.nodeType || e) {
                            if (i = b[u] || (b[u] = {}), (h = i[d]) && h[0] === w && h[1] === f) {
                                return j[2] = h[2];
                            }
                            if (i[d] = j, j[2] = a(b, c, g)) {
                                return !0;
                            }
                        }
                    }
                }
            };
        }

        function sb(a) {
            return a.length > 1 ? function (b, c, d) {
                var e = a.length;
                while (e--) {
                    if (!a[e](b, c, d)) {
                        return !1;
                    }
                }
                return !0;
            } : a[0];
        }

        function tb(a, b, c) {
            for (var d = 0, e = b.length; e > d; d++) {
                fb(a, b[d], c);
            }
            return c;
        }

        function ub(a, b, c, d, e) {
            for (var f, g = [], h = 0, i = a.length, j = null != b; i > h; h++) {
                (f = a[h]) && (!c || c(f, d, e)) && (g.push(f), j && b.push(h));
            }
            return g;
        }

        function vb(a, b, c, d, e, f) {
            return d && !d[u] && (d = vb(d)), e && !e[u] && (e = vb(e, f)), hb(function (f, g, h, i) {
                var j, k, l, m = [], n = [], o = g.length, p = f || tb(b || "*", h.nodeType ? [h] : h, []), q = !a || !f && b ? p : ub(p, m, a, h, i), r = c ? e || (f ? a : o || d) ? [] : g : q;
                if (c && c(q, r, h, i), d) {
                    j = ub(r, n), d(j, [], h, i), k = j.length;
                    while (k--) {
                        (l = j[k]) && (r[n[k]] = !(q[n[k]] = l));
                    }
                }
                if (f) {
                    if (e || a) {
                        if (e) {
                            j = [], k = r.length;
                            while (k--) {
                                (l = r[k]) && j.push(q[k] = l);
                            }
                            e(null, r = [], j, i);
                        }
                        k = r.length;
                        while (k--) {
                            (l = r[k]) && (j = e ? K.call(f, l) : m[k]) > -1 && (f[j] = !(g[j] = l));
                        }
                    }
                } else {
                    r = ub(r === g ? r.splice(o, r.length) : r), e ? e(null, g, r, i) : I.apply(g, r);
                }
            });
        }

        function wb(a) {
            for (var b, c, e, f = a.length, g = d.relative[a[0].type], h = g || d.relative[" "], i = g ? 1 : 0, k = rb(function (a) {
                return a === b;
            }, h, !0), l = rb(function (a) {
                return K.call(b, a) > -1;
            }, h, !0), m = [function (a, c, d) {
                return !g && (d || c !== j) || ((b = c).nodeType ? k(a, c, d) : l(a, c, d));
            }]; f > i; i++) {
                if (c = d.relative[a[i].type]) {
                    m = [rb(sb(m), c)];
                } else {
                    if (c = d.filter[a[i].type].apply(null, a[i].matches), c[u]) {
                        for (e = ++i; f > e; e++) {
                            if (d.relative[a[e].type]) {
                                break;
                            }
                        }
                        return vb(i > 1 && sb(m), i > 1 && qb(a.slice(0, i - 1).concat({value: " " === a[i - 2].type ? "*" : ""})).replace(R, "$1"), c, e > i && wb(a.slice(i, e)), f > e && wb(a = a.slice(e)), f > e && qb(a));
                    }
                    m.push(c);
                }
            }
            return sb(m);
        }

        function xb(a, b) {
            var c = b.length > 0, e = a.length > 0, f = function (f, g, h, i, k) {
                var l, m, o, p = 0, q = "0", r = f && [], s = [], t = j, u = f || e && d.find.TAG("*", k), v = w += null == t ? 1 : Math.random() || 0.1, x = u.length;
                for (k && (j = g !== n && g); q !== x && null != (l = u[q]); q++) {
                    if (e && l) {
                        m = 0;
                        while (o = a[m++]) {
                            if (o(l, g, h)) {
                                i.push(l);
                                break;
                            }
                        }
                        k && (w = v);
                    }
                    c && ((l = !o && l) && p--, f && r.push(l));
                }
                if (p += q, c && q !== p) {
                    m = 0;
                    while (o = b[m++]) {
                        o(r, s, g, h);
                    }
                    if (f) {
                        if (p > 0) {
                            while (q--) {
                                r[q] || s[q] || (s[q] = G.call(i));
                            }
                        }
                        s = ub(s);
                    }
                    I.apply(i, s), k && !f && s.length > 0 && p + b.length > 1 && fb.uniqueSort(i);
                }
                return k && (w = v, j = t), r;
            };
            return c ? hb(f) : f;
        }

        return h = fb.compile = function (a, b) {
            var c, d = [], e = [], f = A[a + " "];
            if (!f) {
                b || (b = g(a)), c = b.length;
                while (c--) {
                    f = wb(b[c]), f[u] ? d.push(f) : e.push(f);
                }
                f = A(a, xb(e, d)), f.selector = a;
            }
            return f;
        }, i = fb.select = function (a, b, e, f) {
            var i, j, k, l, m, n = "function" == typeof a && a, o = !f && g(a = n.selector || a);
            if (e = e || [], 1 === o.length) {
                if (j = o[0] = o[0].slice(0), j.length > 2 && "ID" === (k = j[0]).type && c.getById && 9 === b.nodeType && p && d.relative[j[1].type]) {
                    if (b = (d.find.ID(k.matches[0].replace(cb, db), b) || [])[0], !b) {
                        return e;
                    }
                    n && (b = b.parentNode), a = a.slice(j.shift().value.length);
                }
                i = X.needsContext.test(a) ? 0 : j.length;
                while (i--) {
                    if (k = j[i], d.relative[l = k.type]) {
                        break;
                    }
                    if ((m = d.find[l]) && (f = m(k.matches[0].replace(cb, db), ab.test(j[0].type) && ob(b.parentNode) || b))) {
                        if (j.splice(i, 1), a = f.length && qb(j), !a) {
                            return I.apply(e, f), e;
                        }
                        break;
                    }
                }
            }
            return (n || h(a, o))(f, b, !p, e, ab.test(a) && ob(b.parentNode) || b), e;
        }, c.sortStable = u.split("").sort(B).join("") === u, c.detectDuplicates = !!l, m(), c.sortDetached = ib(function (a) {
            return 1 & a.compareDocumentPosition(n.createElement("div"));
        }), ib(function (a) {
            return a.innerHTML = "<a href='#'></a>", "#" === a.firstChild.getAttribute("href");
        }) || jb("type|href|height|width", function (a, b, c) {
            return c ? void 0 : a.getAttribute(b, "type" === b.toLowerCase() ? 1 : 2);
        }), c.attributes && ib(function (a) {
            return a.innerHTML = "<input/>", a.firstChild.setAttribute("value", ""), "" === a.firstChild.getAttribute("value");
        }) || jb("value", function (a, b, c) {
            return c || "input" !== a.nodeName.toLowerCase() ? void 0 : a.defaultValue;
        }), ib(function (a) {
            return null == a.getAttribute("disabled");
        }) || jb(L, function (a, b, c) {
            var d;
            return c ? void 0 : a[b] === !0 ? b.toLowerCase() : (d = a.getAttributeNode(b)) && d.specified ? d.value : null;
        }), fb;
    }(a);
    m.find = s, m.expr = s.selectors, m.expr[":"] = m.expr.pseudos, m.unique = s.uniqueSort, m.text = s.getText, m.isXMLDoc = s.isXML, m.contains = s.contains;
    var t = m.expr.match.needsContext, u = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, v = /^.[^:#\[\.,]*$/;

    function w(a, b, c) {
        if (m.isFunction(b)) {
            return m.grep(a, function (a, d) {
                return !!b.call(a, d, a) !== c;
            });
        }
        if (b.nodeType) {
            return m.grep(a, function (a) {
                return a === b !== c;
            });
        }
        if ("string" == typeof b) {
            if (v.test(b)) {
                return m.filter(b, a, c);
            }
            b = m.filter(b, a);
        }
        return m.grep(a, function (a) {
            return m.inArray(a, b) >= 0 !== c;
        });
    }

    m.filter = function (a, b, c) {
        var d = b[0];
        return c && (a = ":not(" + a + ")"), 1 === b.length && 1 === d.nodeType ? m.find.matchesSelector(d, a) ? [d] : [] : m.find.matches(a, m.grep(b, function (a) {
            return 1 === a.nodeType;
        }));
    }, m.fn.extend({
        find: function (a) {
            var b, c = [], d = this, e = d.length;
            if ("string" != typeof a) {
                return this.pushStack(m(a).filter(function () {
                    for (b = 0; e > b; b++) {
                        if (m.contains(d[b], this)) {
                            return !0;
                        }
                    }
                }));
            }
            for (b = 0; e > b; b++) {
                m.find(a, d[b], c);
            }
            return c = this.pushStack(e > 1 ? m.unique(c) : c), c.selector = this.selector ? this.selector + " " + a : a, c;
        }, filter: function (a) {
            return this.pushStack(w(this, a || [], !1));
        }, not: function (a) {
            return this.pushStack(w(this, a || [], !0));
        }, is: function (a) {
            return !!w(this, "string" == typeof a && t.test(a) ? m(a) : a || [], !1).length;
        }
    });
    var x, y = a.document, z = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/, A = m.fn.init = function (a, b) {
        var c, d;
        if (!a) {
            return this;
        }
        if ("string" == typeof a) {
            if (c = "<" === a.charAt(0) && ">" === a.charAt(a.length - 1) && a.length >= 3 ? [null, a, null] : z.exec(a), !c || !c[1] && b) {
                return !b || b.jquery ? (b || x).find(a) : this.constructor(b).find(a);
            }
            if (c[1]) {
                if (b = b instanceof m ? b[0] : b, m.merge(this, m.parseHTML(c[1], b && b.nodeType ? b.ownerDocument || b : y, !0)), u.test(c[1]) && m.isPlainObject(b)) {
                    for (c in b) {
                        m.isFunction(this[c]) ? this[c](b[c]) : this.attr(c, b[c]);
                    }
                }
                return this;
            }
            if (d = y.getElementById(c[2]), d && d.parentNode) {
                if (d.id !== c[2]) {
                    return x.find(a);
                }
                this.length = 1, this[0] = d;
            }
            return this.context = y, this.selector = a, this;
        }
        return a.nodeType ? (this.context = this[0] = a, this.length = 1, this) : m.isFunction(a) ? "undefined" != typeof x.ready ? x.ready(a) : a(m) : (void 0 !== a.selector && (this.selector = a.selector, this.context = a.context), m.makeArray(a, this));
    };
    A.prototype = m.fn, x = m(y);
    var B = /^(?:parents|prev(?:Until|All))/, C = {children: !0, contents: !0, next: !0, prev: !0};
    m.extend({
        dir: function (a, b, c) {
            var d = [], e = a[b];
            while (e && 9 !== e.nodeType && (void 0 === c || 1 !== e.nodeType || !m(e).is(c))) {
                1 === e.nodeType && d.push(e), e = e[b];
            }
            return d;
        }, sibling: function (a, b) {
            for (var c = []; a; a = a.nextSibling) {
                1 === a.nodeType && a !== b && c.push(a);
            }
            return c;
        }
    }), m.fn.extend({
        has: function (a) {
            var b, c = m(a, this), d = c.length;
            return this.filter(function () {
                for (b = 0; d > b; b++) {
                    if (m.contains(this, c[b])) {
                        return !0;
                    }
                }
            });
        }, closest: function (a, b) {
            for (var c, d = 0, e = this.length, f = [], g = t.test(a) || "string" != typeof a ? m(a, b || this.context) : 0; e > d; d++) {
                for (c = this[d]; c && c !== b; c = c.parentNode) {
                    if (c.nodeType < 11 && (g ? g.index(c) > -1 : 1 === c.nodeType && m.find.matchesSelector(c, a))) {
                        f.push(c);
                        break;
                    }
                }
            }
            return this.pushStack(f.length > 1 ? m.unique(f) : f);
        }, index: function (a) {
            return a ? "string" == typeof a ? m.inArray(this[0], m(a)) : m.inArray(a.jquery ? a[0] : a, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
        }, add: function (a, b) {
            return this.pushStack(m.unique(m.merge(this.get(), m(a, b))));
        }, addBack: function (a) {
            return this.add(null == a ? this.prevObject : this.prevObject.filter(a));
        }
    });
    function D(a, b) {
        do {
            a = a[b];
        } while (a && 1 !== a.nodeType);
        return a;
    }

    m.each({
        parent: function (a) {
            var b = a.parentNode;
            return b && 11 !== b.nodeType ? b : null;
        }, parents: function (a) {
            return m.dir(a, "parentNode");
        }, parentsUntil: function (a, b, c) {
            return m.dir(a, "parentNode", c);
        }, next: function (a) {
            return D(a, "nextSibling");
        }, prev: function (a) {
            return D(a, "previousSibling");
        }, nextAll: function (a) {
            return m.dir(a, "nextSibling");
        }, prevAll: function (a) {
            return m.dir(a, "previousSibling");
        }, nextUntil: function (a, b, c) {
            return m.dir(a, "nextSibling", c);
        }, prevUntil: function (a, b, c) {
            return m.dir(a, "previousSibling", c);
        }, siblings: function (a) {
            return m.sibling((a.parentNode || {}).firstChild, a);
        }, children: function (a) {
            return m.sibling(a.firstChild);
        }, contents: function (a) {
            return m.nodeName(a, "iframe") ? a.contentDocument || a.contentWindow.document : m.merge([], a.childNodes);
        }
    }, function (a, b) {
        m.fn[a] = function (c, d) {
            var e = m.map(this, b, c);
            return "Until" !== a.slice(-5) && (d = c), d && "string" == typeof d && (e = m.filter(d, e)), this.length > 1 && (C[a] || (e = m.unique(e)), B.test(a) && (e = e.reverse())), this.pushStack(e);
        };
    });
    var E = /\S+/g, F = {};

    function G(a) {
        var b = F[a] = {};
        return m.each(a.match(E) || [], function (a, c) {
            b[c] = !0;
        }), b;
    }

    m.Callbacks = function (a) {
        a = "string" == typeof a ? F[a] || G(a) : m.extend({}, a);
        var b, c, d, e, f, g, h = [], i = !a.once && [], j = function (l) {
            for (c = a.memory && l, d = !0, f = g || 0, g = 0, e = h.length, b = !0; h && e > f; f++) {
                if (h[f].apply(l[0], l[1]) === !1 && a.stopOnFalse) {
                    c = !1;
                    break;
                }
            }
            b = !1, h && (i ? i.length && j(i.shift()) : c ? h = [] : k.disable());
        }, k = {
            add: function () {
                if (h) {
                    var d = h.length;
                    !function f(b) {
                        m.each(b, function (b, c) {
                            var d = m.type(c);
                            "function" === d ? a.unique && k.has(c) || h.push(c) : c && c.length && "string" !== d && f(c);
                        });
                    }(arguments), b ? e = h.length : c && (g = d, j(c));
                }
                return this;
            }, remove: function () {
                return h && m.each(arguments, function (a, c) {
                    var d;
                    while ((d = m.inArray(c, h, d)) > -1) {
                        h.splice(d, 1), b && (e >= d && e--, f >= d && f--);
                    }
                }), this;
            }, has: function (a) {
                return a ? m.inArray(a, h) > -1 : !(!h || !h.length);
            }, empty: function () {
                return h = [], e = 0, this;
            }, disable: function () {
                return h = i = c = void 0, this;
            }, disabled: function () {
                return !h;
            }, lock: function () {
                return i = void 0, c || k.disable(), this;
            }, locked: function () {
                return !i;
            }, fireWith: function (a, c) {
                return !h || d && !i || (c = c || [], c = [a, c.slice ? c.slice() : c], b ? i.push(c) : j(c)), this;
            }, fire: function () {
                return k.fireWith(this, arguments), this;
            }, fired: function () {
                return !!d;
            }
        };
        return k;
    }, m.extend({
        Deferred: function (a) {
            var b = [["resolve", "done", m.Callbacks("once memory"), "resolved"], ["reject", "fail", m.Callbacks("once memory"), "rejected"], ["notify", "progress", m.Callbacks("memory")]], c = "pending", d = {
                state: function () {
                    return c;
                }, always: function () {
                    return e.done(arguments).fail(arguments), this;
                }, then: function () {
                    var a = arguments;
                    return m.Deferred(function (c) {
                        m.each(b, function (b, f) {
                            var g = m.isFunction(a[b]) && a[b];
                            e[f[1]](function () {
                                var a = g && g.apply(this, arguments);
                                a && m.isFunction(a.promise) ? a.promise().done(c.resolve).fail(c.reject).progress(c.notify) : c[f[0] + "With"](this === d ? c.promise() : this, g ? [a] : arguments);
                            });
                        }), a = null;
                    }).promise();
                }, promise: function (a) {
                    return null != a ? m.extend(a, d) : d;
                }
            }, e = {};
            return d.pipe = d.then, m.each(b, function (a, f) {
                var g = f[2], h = f[3];
                d[f[1]] = g.add, h && g.add(function () {
                    c = h;
                }, b[1 ^ a][2].disable, b[2][2].lock), e[f[0]] = function () {
                    return e[f[0] + "With"](this === e ? d : this, arguments), this;
                }, e[f[0] + "With"] = g.fireWith;
            }), d.promise(e), a && a.call(e, e), e;
        }, when: function (a) {
            var b = 0, c = d.call(arguments), e = c.length, f = 1 !== e || a && m.isFunction(a.promise) ? e : 0, g = 1 === f ? a : m.Deferred(), h = function (a, b, c) {
                return function (e) {
                    b[a] = this, c[a] = arguments.length > 1 ? d.call(arguments) : e, c === i ? g.notifyWith(b, c) : --f || g.resolveWith(b, c);
                };
            }, i, j, k;
            if (e > 1) {
                for (i = new Array(e), j = new Array(e), k = new Array(e); e > b; b++) {
                    c[b] && m.isFunction(c[b].promise) ? c[b].promise().done(h(b, k, c)).fail(g.reject).progress(h(b, j, i)) : --f;
                }
            }
            return f || g.resolveWith(k, c), g.promise();
        }
    });
    var H;
    m.fn.ready = function (a) {
        return m.ready.promise().done(a), this;
    }, m.extend({
        isReady: !1, readyWait: 1, holdReady: function (a) {
            a ? m.readyWait++ : m.ready(!0);
        }, ready: function (a) {
            if (a === !0 ? !--m.readyWait : !m.isReady) {
                if (!y.body) {
                    return setTimeout(m.ready);
                }
                m.isReady = !0, a !== !0 && --m.readyWait > 0 || (H.resolveWith(y, [m]), m.fn.triggerHandler && (m(y).triggerHandler("ready"), m(y).off("ready")));
            }
        }
    });
    function I() {
        y.addEventListener ? (y.removeEventListener("DOMContentLoaded", J, !1), a.removeEventListener("load", J, !1)) : (y.detachEvent("onreadystatechange", J), a.detachEvent("onload", J));
    }

    function J() {
        (y.addEventListener || "load" === event.type || "complete" === y.readyState) && (I(), m.ready());
    }

    m.ready.promise = function (b) {
        if (!H) {
            if (H = m.Deferred(), "complete" === y.readyState) {
                setTimeout(m.ready);
            } else {
                if (y.addEventListener) {
                    y.addEventListener("DOMContentLoaded", J, !1), a.addEventListener("load", J, !1);
                } else {
                    y.attachEvent("onreadystatechange", J), a.attachEvent("onload", J);
                    var c = !1;
                    try {
                        c = null == a.frameElement && y.documentElement;
                    } catch (d) {
                    }
                    c && c.doScroll && !function e() {
                        if (!m.isReady) {
                            try {
                                c.doScroll("left");
                            } catch (a) {
                                return setTimeout(e, 50);
                            }
                            I(), m.ready();
                        }
                    }();
                }
            }
        }
        return H.promise(b);
    };
    var K = "undefined", L;
    for (L in m(k)) {
        break;
    }
    k.ownLast = "0" !== L, k.inlineBlockNeedsLayout = !1, m(function () {
        var a, b, c, d;
        c = y.getElementsByTagName("body")[0], c && c.style && (b = y.createElement("div"), d = y.createElement("div"), d.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", c.appendChild(d).appendChild(b), typeof b.style.zoom !== K && (b.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1", k.inlineBlockNeedsLayout = a = 3 === b.offsetWidth, a && (c.style.zoom = 1)), c.removeChild(d));
    }), function () {
        var a = y.createElement("div");
        if (null == k.deleteExpando) {
            k.deleteExpando = !0;
            try {
                delete a.test;
            } catch (b) {
                k.deleteExpando = !1;
            }
        }
        a = null;
    }(), m.acceptData = function (a) {
        var b = m.noData[(a.nodeName + " ").toLowerCase()], c = +a.nodeType || 1;
        return 1 !== c && 9 !== c ? !1 : !b || b !== !0 && a.getAttribute("classid") === b;
    };
    var M = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, N = /([A-Z])/g;

    function O(a, b, c) {
        if (void 0 === c && 1 === a.nodeType) {
            var d = "data-" + b.replace(N, "-$1").toLowerCase();
            if (c = a.getAttribute(d), "string" == typeof c) {
                try {
                    c = "true" === c ? !0 : "false" === c ? !1 : "null" === c ? null : +c + "" === c ? +c : M.test(c) ? m.parseJSON(c) : c;
                } catch (e) {
                }
                m.data(a, b, c);
            } else {
                c = void 0;
            }
        }
        return c;
    }

    function P(a) {
        var b;
        for (b in a) {
            if (("data" !== b || !m.isEmptyObject(a[b])) && "toJSON" !== b) {
                return !1;
            }
        }
        return !0;
    }

    function Q(a, b, d, e) {
        if (m.acceptData(a)) {
            var f, g, h = m.expando, i = a.nodeType, j = i ? m.cache : a, k = i ? a[h] : a[h] && h;
            if (k && j[k] && (e || j[k].data) || void 0 !== d || "string" != typeof b) {
                return k || (k = i ? a[h] = c.pop() || m.guid++ : h), j[k] || (j[k] = i ? {} : {toJSON: m.noop}), ("object" == typeof b || "function" == typeof b) && (e ? j[k] = m.extend(j[k], b) : j[k].data = m.extend(j[k].data, b)), g = j[k], e || (g.data || (g.data = {}), g = g.data), void 0 !== d && (g[m.camelCase(b)] = d), "string" == typeof b ? (f = g[b], null == f && (f = g[m.camelCase(b)])) : f = g, f;
            }
        }
    }

    function R(a, b, c) {
        if (m.acceptData(a)) {
            var d, e, f = a.nodeType, g = f ? m.cache : a, h = f ? a[m.expando] : m.expando;
            if (g[h]) {
                if (b && (d = c ? g[h] : g[h].data)) {
                    m.isArray(b) ? b = b.concat(m.map(b, m.camelCase)) : b in d ? b = [b] : (b = m.camelCase(b), b = b in d ? [b] : b.split(" ")), e = b.length;
                    while (e--) {
                        delete d[b[e]];
                    }
                    if (c ? !P(d) : !m.isEmptyObject(d)) {
                        return;
                    }
                }
                (c || (delete g[h].data, P(g[h]))) && (f ? m.cleanData([a], !0) : k.deleteExpando || g != g.window ? delete g[h] : g[h] = null);
            }
        }
    }

    m.extend({
        cache: {},
        noData: {"applet ": !0, "embed ": !0, "object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"},
        hasData: function (a) {
            return a = a.nodeType ? m.cache[a[m.expando]] : a[m.expando], !!a && !P(a);
        },
        data: function (a, b, c) {
            return Q(a, b, c);
        },
        removeData: function (a, b) {
            return R(a, b);
        },
        _data: function (a, b, c) {
            return Q(a, b, c, !0);
        },
        _removeData: function (a, b) {
            return R(a, b, !0);
        }
    }), m.fn.extend({
        data: function (a, b) {
            var c, d, e, f = this[0], g = f && f.attributes;
            if (void 0 === a) {
                if (this.length && (e = m.data(f), 1 === f.nodeType && !m._data(f, "parsedAttrs"))) {
                    c = g.length;
                    while (c--) {
                        g[c] && (d = g[c].name, 0 === d.indexOf("data-") && (d = m.camelCase(d.slice(5)), O(f, d, e[d])));
                    }
                    m._data(f, "parsedAttrs", !0);
                }
                return e;
            }
            return "object" == typeof a ? this.each(function () {
                m.data(this, a);
            }) : arguments.length > 1 ? this.each(function () {
                m.data(this, a, b);
            }) : f ? O(f, a, m.data(f, a)) : void 0;
        }, removeData: function (a) {
            return this.each(function () {
                m.removeData(this, a);
            });
        }
    }), m.extend({
        queue: function (a, b, c) {
            var d;
            return a ? (b = (b || "fx") + "queue", d = m._data(a, b), c && (!d || m.isArray(c) ? d = m._data(a, b, m.makeArray(c)) : d.push(c)), d || []) : void 0;
        }, dequeue: function (a, b) {
            b = b || "fx";
            var c = m.queue(a, b), d = c.length, e = c.shift(), f = m._queueHooks(a, b), g = function () {
                m.dequeue(a, b);
            };
            "inprogress" === e && (e = c.shift(), d--), e && ("fx" === b && c.unshift("inprogress"), delete f.stop, e.call(a, g, f)), !d && f && f.empty.fire();
        }, _queueHooks: function (a, b) {
            var c = b + "queueHooks";
            return m._data(a, c) || m._data(a, c, {
                empty: m.Callbacks("once memory").add(function () {
                    m._removeData(a, b + "queue"), m._removeData(a, c);
                })
            });
        }
    }), m.fn.extend({
        queue: function (a, b) {
            var c = 2;
            return "string" != typeof a && (b = a, a = "fx", c--), arguments.length < c ? m.queue(this[0], a) : void 0 === b ? this : this.each(function () {
                var c = m.queue(this, a, b);
                m._queueHooks(this, a), "fx" === a && "inprogress" !== c[0] && m.dequeue(this, a);
            });
        }, dequeue: function (a) {
            return this.each(function () {
                m.dequeue(this, a);
            });
        }, clearQueue: function (a) {
            return this.queue(a || "fx", []);
        }, promise: function (a, b) {
            var c, d = 1, e = m.Deferred(), f = this, g = this.length, h = function () {
                --d || e.resolveWith(f, [f]);
            };
            "string" != typeof a && (b = a, a = void 0), a = a || "fx";
            while (g--) {
                c = m._data(f[g], a + "queueHooks"), c && c.empty && (d++, c.empty.add(h));
            }
            return h(), e.promise(b);
        }
    });
    var S = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source, T = ["Top", "Right", "Bottom", "Left"], U = function (a, b) {
        return a = b || a, "none" === m.css(a, "display") || !m.contains(a.ownerDocument, a);
    }, V = m.access = function (a, b, c, d, e, f, g) {
        var h = 0, i = a.length, j = null == c;
        if ("object" === m.type(c)) {
            e = !0;
            for (h in c) {
                m.access(a, b, h, c[h], !0, f, g);
            }
        } else {
            if (void 0 !== d && (e = !0, m.isFunction(d) || (g = !0), j && (g ? (b.call(a, d), b = null) : (j = b, b = function (a, b, c) {
                    return j.call(m(a), c);
                })), b)) {
                for (; i > h; h++) {
                    b(a[h], c, g ? d : d.call(a[h], h, b(a[h], c)));
                }
            }
        }
        return e ? a : j ? b.call(a) : i ? b(a[0], c) : f;
    }, W = /^(?:checkbox|radio)$/i;
    !function () {
        var a = y.createElement("input"), b = y.createElement("div"), c = y.createDocumentFragment();
        if (b.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", k.leadingWhitespace = 3 === b.firstChild.nodeType, k.tbody = !b.getElementsByTagName("tbody").length, k.htmlSerialize = !!b.getElementsByTagName("link").length, k.html5Clone = "<:nav></:nav>" !== y.createElement("nav").cloneNode(!0).outerHTML, a.type = "checkbox", a.checked = !0, c.appendChild(a), k.appendChecked = a.checked, b.innerHTML = "<textarea>x</textarea>", k.noCloneChecked = !!b.cloneNode(!0).lastChild.defaultValue, c.appendChild(b), b.innerHTML = "<input type='radio' checked='checked' name='t'/>", k.checkClone = b.cloneNode(!0).cloneNode(!0).lastChild.checked, k.noCloneEvent = !0, b.attachEvent && (b.attachEvent("onclick", function () {
                k.noCloneEvent = !1;
            }), b.cloneNode(!0).click()), null == k.deleteExpando) {
            k.deleteExpando = !0;
            try {
                delete b.test;
            } catch (d) {
                k.deleteExpando = !1;
            }
        }
    }(), function () {
        var b, c, d = y.createElement("div");
        for (b in {submit: !0, change: !0, focusin: !0}) {
            c = "on" + b, (k[b + "Bubbles"] = c in a) || (d.setAttribute(c, "t"), k[b + "Bubbles"] = d.attributes[c].expando === !1);
        }
        d = null;
    }();
    var X = /^(?:input|select|textarea)$/i, Y = /^key/, Z = /^(?:mouse|pointer|contextmenu)|click/, $ = /^(?:focusinfocus|focusoutblur)$/, _ = /^([^.]*)(?:\.(.+)|)$/;

    function ab() {
        return !0;
    }

    function bb() {
        return !1;
    }

    function cb() {
        try {
            return y.activeElement;
        } catch (a) {
        }
    }

    m.event = {
        global: {},
        add: function (a, b, c, d, e) {
            var f, g, h, i, j, k, l, n, o, p, q, r = m._data(a);
            if (r) {
                c.handler && (i = c, c = i.handler, e = i.selector), c.guid || (c.guid = m.guid++), (g = r.events) || (g = r.events = {}), (k = r.handle) || (k = r.handle = function (a) {
                    return typeof m === K || a && m.event.triggered === a.type ? void 0 : m.event.dispatch.apply(k.elem, arguments);
                }, k.elem = a), b = (b || "").match(E) || [""], h = b.length;
                while (h--) {
                    f = _.exec(b[h]) || [], o = q = f[1], p = (f[2] || "").split(".").sort(), o && (j = m.event.special[o] || {}, o = (e ? j.delegateType : j.bindType) || o, j = m.event.special[o] || {}, l = m.extend({
                        type: o,
                        origType: q,
                        data: d,
                        handler: c,
                        guid: c.guid,
                        selector: e,
                        needsContext: e && m.expr.match.needsContext.test(e),
                        namespace: p.join(".")
                    }, i), (n = g[o]) || (n = g[o] = [], n.delegateCount = 0, j.setup && j.setup.call(a, d, p, k) !== !1 || (a.addEventListener ? a.addEventListener(o, k, !1) : a.attachEvent && a.attachEvent("on" + o, k))), j.add && (j.add.call(a, l), l.handler.guid || (l.handler.guid = c.guid)), e ? n.splice(n.delegateCount++, 0, l) : n.push(l), m.event.global[o] = !0);
                }
                a = null;
            }
        },
        remove: function (a, b, c, d, e) {
            var f, g, h, i, j, k, l, n, o, p, q, r = m.hasData(a) && m._data(a);
            if (r && (k = r.events)) {
                b = (b || "").match(E) || [""], j = b.length;
                while (j--) {
                    if (h = _.exec(b[j]) || [], o = q = h[1], p = (h[2] || "").split(".").sort(), o) {
                        l = m.event.special[o] || {}, o = (d ? l.delegateType : l.bindType) || o, n = k[o] || [], h = h[2] && new RegExp("(^|\\.)" + p.join("\\.(?:.*\\.|)") + "(\\.|$)"), i = f = n.length;
                        while (f--) {
                            g = n[f], !e && q !== g.origType || c && c.guid !== g.guid || h && !h.test(g.namespace) || d && d !== g.selector && ("**" !== d || !g.selector) || (n.splice(f, 1), g.selector && n.delegateCount--, l.remove && l.remove.call(a, g));
                        }
                        i && !n.length && (l.teardown && l.teardown.call(a, p, r.handle) !== !1 || m.removeEvent(a, o, r.handle), delete k[o]);
                    } else {
                        for (o in k) {
                            m.event.remove(a, o + b[j], c, d, !0);
                        }
                    }
                }
                m.isEmptyObject(k) && (delete r.handle, m._removeData(a, "events"));
            }
        },
        trigger: function (b, c, d, e) {
            var f, g, h, i, k, l, n, o = [d || y], p = j.call(b, "type") ? b.type : b, q = j.call(b, "namespace") ? b.namespace.split(".") : [];
            if (h = l = d = d || y, 3 !== d.nodeType && 8 !== d.nodeType && !$.test(p + m.event.triggered) && (p.indexOf(".") >= 0 && (q = p.split("."), p = q.shift(), q.sort()), g = p.indexOf(":") < 0 && "on" + p, b = b[m.expando] ? b : new m.Event(p, "object" == typeof b && b), b.isTrigger = e ? 2 : 3, b.namespace = q.join("."), b.namespace_re = b.namespace ? new RegExp("(^|\\.)" + q.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, b.result = void 0, b.target || (b.target = d), c = null == c ? [b] : m.makeArray(c, [b]), k = m.event.special[p] || {}, e || !k.trigger || k.trigger.apply(d, c) !== !1)) {
                if (!e && !k.noBubble && !m.isWindow(d)) {
                    for (i = k.delegateType || p, $.test(i + p) || (h = h.parentNode); h; h = h.parentNode) {
                        o.push(h), l = h;
                    }
                    l === (d.ownerDocument || y) && o.push(l.defaultView || l.parentWindow || a);
                }
                n = 0;
                while ((h = o[n++]) && !b.isPropagationStopped()) {
                    b.type = n > 1 ? i : k.bindType || p, f = (m._data(h, "events") || {})[b.type] && m._data(h, "handle"), f && f.apply(h, c), f = g && h[g], f && f.apply && m.acceptData(h) && (b.result = f.apply(h, c), b.result === !1 && b.preventDefault());
                }
                if (b.type = p, !e && !b.isDefaultPrevented() && (!k._default || k._default.apply(o.pop(), c) === !1) && m.acceptData(d) && g && d[p] && !m.isWindow(d)) {
                    l = d[g], l && (d[g] = null), m.event.triggered = p;
                    try {
                        d[p]();
                    } catch (r) {
                    }
                    m.event.triggered = void 0, l && (d[g] = l);
                }
                return b.result;
            }
        },
        dispatch: function (a) {
            a = m.event.fix(a);
            var b, c, e, f, g, h = [], i = d.call(arguments), j = (m._data(this, "events") || {})[a.type] || [], k = m.event.special[a.type] || {};
            if (i[0] = a, a.delegateTarget = this, !k.preDispatch || k.preDispatch.call(this, a) !== !1) {
                h = m.event.handlers.call(this, a, j), b = 0;
                while ((f = h[b++]) && !a.isPropagationStopped()) {
                    a.currentTarget = f.elem, g = 0;
                    while ((e = f.handlers[g++]) && !a.isImmediatePropagationStopped()) {
                        (!a.namespace_re || a.namespace_re.test(e.namespace)) && (a.handleObj = e, a.data = e.data, c = ((m.event.special[e.origType] || {}).handle || e.handler).apply(f.elem, i), void 0 !== c && (a.result = c) === !1 && (a.preventDefault(), a.stopPropagation()));
                    }
                }
                return k.postDispatch && k.postDispatch.call(this, a), a.result;
            }
        },
        handlers: function (a, b) {
            var c, d, e, f, g = [], h = b.delegateCount, i = a.target;
            if (h && i.nodeType && (!a.button || "click" !== a.type)) {
                for (; i != this; i = i.parentNode || this) {
                    if (1 === i.nodeType && (i.disabled !== !0 || "click" !== a.type)) {
                        for (e = [], f = 0; h > f; f++) {
                            d = b[f], c = d.selector + " ", void 0 === e[c] && (e[c] = d.needsContext ? m(c, this).index(i) >= 0 : m.find(c, this, null, [i]).length), e[c] && e.push(d);
                        }
                        e.length && g.push({elem: i, handlers: e});
                    }
                }
            }
            return h < b.length && g.push({elem: this, handlers: b.slice(h)}), g;
        },
        fix: function (a) {
            if (a[m.expando]) {
                return a;
            }
            var b, c, d, e = a.type, f = a, g = this.fixHooks[e];
            g || (this.fixHooks[e] = g = Z.test(e) ? this.mouseHooks : Y.test(e) ? this.keyHooks : {}), d = g.props ? this.props.concat(g.props) : this.props, a = new m.Event(f), b = d.length;
            while (b--) {
                c = d[b], a[c] = f[c];
            }
            return a.target || (a.target = f.srcElement || y), 3 === a.target.nodeType && (a.target = a.target.parentNode), a.metaKey = !!a.metaKey, g.filter ? g.filter(a, f) : a;
        },
        props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            props: "char charCode key keyCode".split(" "), filter: function (a, b) {
                return null == a.which && (a.which = null != b.charCode ? b.charCode : b.keyCode), a;
            }
        },
        mouseHooks: {
            props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function (a, b) {
                var c, d, e, f = b.button, g = b.fromElement;
                return null == a.pageX && null != b.clientX && (d = a.target.ownerDocument || y, e = d.documentElement, c = d.body, a.pageX = b.clientX + (e && e.scrollLeft || c && c.scrollLeft || 0) - (e && e.clientLeft || c && c.clientLeft || 0), a.pageY = b.clientY + (e && e.scrollTop || c && c.scrollTop || 0) - (e && e.clientTop || c && c.clientTop || 0)), !a.relatedTarget && g && (a.relatedTarget = g === a.target ? b.toElement : g), a.which || void 0 === f || (a.which = 1 & f ? 1 : 2 & f ? 3 : 4 & f ? 2 : 0), a;
            }
        },
        special: {
            load: {noBubble: !0}, focus: {
                trigger: function () {
                    if (this !== cb() && this.focus) {
                        try {
                            return this.focus(), !1;
                        } catch (a) {
                        }
                    }
                }, delegateType: "focusin"
            }, blur: {
                trigger: function () {
                    return this === cb() && this.blur ? (this.blur(), !1) : void 0;
                }, delegateType: "focusout"
            }, click: {
                trigger: function () {
                    return m.nodeName(this, "input") && "checkbox" === this.type && this.click ? (this.click(), !1) : void 0;
                }, _default: function (a) {
                    return m.nodeName(a.target, "a");
                }
            }, beforeunload: {
                postDispatch: function (a) {
                    void 0 !== a.result && a.originalEvent && (a.originalEvent.returnValue = a.result);
                }
            }
        },
        simulate: function (a, b, c, d) {
            var e = m.extend(new m.Event, c, {type: a, isSimulated: !0, originalEvent: {}});
            d ? m.event.trigger(e, null, b) : m.event.dispatch.call(b, e), e.isDefaultPrevented() && c.preventDefault();
        }
    }, m.removeEvent = y.removeEventListener ? function (a, b, c) {
        a.removeEventListener && a.removeEventListener(b, c, !1);
    } : function (a, b, c) {
        var d = "on" + b;
        a.detachEvent && (typeof a[d] === K && (a[d] = null), a.detachEvent(d, c));
    }, m.Event = function (a, b) {
        return this instanceof m.Event ? (a && a.type ? (this.originalEvent = a, this.type = a.type, this.isDefaultPrevented = a.defaultPrevented || void 0 === a.defaultPrevented && a.returnValue === !1 ? ab : bb) : this.type = a, b && m.extend(this, b), this.timeStamp = a && a.timeStamp || m.now(), void (this[m.expando] = !0)) : new m.Event(a, b);
    }, m.Event.prototype = {
        isDefaultPrevented: bb,
        isPropagationStopped: bb,
        isImmediatePropagationStopped: bb,
        preventDefault: function () {
            var a = this.originalEvent;
            this.isDefaultPrevented = ab, a && (a.preventDefault ? a.preventDefault() : a.returnValue = !1);
        },
        stopPropagation: function () {
            var a = this.originalEvent;
            this.isPropagationStopped = ab, a && (a.stopPropagation && a.stopPropagation(), a.cancelBubble = !0);
        },
        stopImmediatePropagation: function () {
            var a = this.originalEvent;
            this.isImmediatePropagationStopped = ab, a && a.stopImmediatePropagation && a.stopImmediatePropagation(), this.stopPropagation();
        }
    }, m.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, function (a, b) {
        m.event.special[a] = {
            delegateType: b, bindType: b, handle: function (a) {
                var c, d = this, e = a.relatedTarget, f = a.handleObj;
                return (!e || e !== d && !m.contains(d, e)) && (a.type = f.origType, c = f.handler.apply(this, arguments), a.type = b), c;
            }
        };
    }), k.submitBubbles || (m.event.special.submit = {
        setup: function () {
            return m.nodeName(this, "form") ? !1 : void m.event.add(this, "click._submit keypress._submit", function (a) {
                var b = a.target, c = m.nodeName(b, "input") || m.nodeName(b, "button") ? b.form : void 0;
                c && !m._data(c, "submitBubbles") && (m.event.add(c, "submit._submit", function (a) {
                    a._submit_bubble = !0;
                }), m._data(c, "submitBubbles", !0));
            });
        }, postDispatch: function (a) {
            a._submit_bubble && (delete a._submit_bubble, this.parentNode && !a.isTrigger && m.event.simulate("submit", this.parentNode, a, !0));
        }, teardown: function () {
            return m.nodeName(this, "form") ? !1 : void m.event.remove(this, "._submit");
        }
    }), k.changeBubbles || (m.event.special.change = {
        setup: function () {
            return X.test(this.nodeName) ? (("checkbox" === this.type || "radio" === this.type) && (m.event.add(this, "propertychange._change", function (a) {
                "checked" === a.originalEvent.propertyName && (this._just_changed = !0);
            }), m.event.add(this, "click._change", function (a) {
                this._just_changed && !a.isTrigger && (this._just_changed = !1), m.event.simulate("change", this, a, !0);
            })), !1) : void m.event.add(this, "beforeactivate._change", function (a) {
                var b = a.target;
                X.test(b.nodeName) && !m._data(b, "changeBubbles") && (m.event.add(b, "change._change", function (a) {
                    !this.parentNode || a.isSimulated || a.isTrigger || m.event.simulate("change", this.parentNode, a, !0);
                }), m._data(b, "changeBubbles", !0));
            });
        }, handle: function (a) {
            var b = a.target;
            return this !== b || a.isSimulated || a.isTrigger || "radio" !== b.type && "checkbox" !== b.type ? a.handleObj.handler.apply(this, arguments) : void 0;
        }, teardown: function () {
            return m.event.remove(this, "._change"), !X.test(this.nodeName);
        }
    }), k.focusinBubbles || m.each({focus: "focusin", blur: "focusout"}, function (a, b) {
        var c = function (a) {
            m.event.simulate(b, a.target, m.event.fix(a), !0);
        };
        m.event.special[b] = {
            setup: function () {
                var d = this.ownerDocument || this, e = m._data(d, b);
                e || d.addEventListener(a, c, !0), m._data(d, b, (e || 0) + 1);
            }, teardown: function () {
                var d = this.ownerDocument || this, e = m._data(d, b) - 1;
                e ? m._data(d, b, e) : (d.removeEventListener(a, c, !0), m._removeData(d, b));
            }
        };
    }), m.fn.extend({
        on: function (a, b, c, d, e) {
            var f, g;
            if ("object" == typeof a) {
                "string" != typeof b && (c = c || b, b = void 0);
                for (f in a) {
                    this.on(f, b, c, a[f], e);
                }
                return this;
            }
            if (null == c && null == d ? (d = b, c = b = void 0) : null == d && ("string" == typeof b ? (d = c, c = void 0) : (d = c, c = b, b = void 0)), d === !1) {
                d = bb;
            } else {
                if (!d) {
                    return this;
                }
            }
            return 1 === e && (g = d, d = function (a) {
                return m().off(a), g.apply(this, arguments);
            }, d.guid = g.guid || (g.guid = m.guid++)), this.each(function () {
                m.event.add(this, a, d, c, b);
            });
        }, one: function (a, b, c, d) {
            return this.on(a, b, c, d, 1);
        }, off: function (a, b, c) {
            var d, e;
            if (a && a.preventDefault && a.handleObj) {
                return d = a.handleObj, m(a.delegateTarget).off(d.namespace ? d.origType + "." + d.namespace : d.origType, d.selector, d.handler), this;
            }
            if ("object" == typeof a) {
                for (e in a) {
                    this.off(e, b, a[e]);
                }
                return this;
            }
            return (b === !1 || "function" == typeof b) && (c = b, b = void 0), c === !1 && (c = bb), this.each(function () {
                m.event.remove(this, a, c, b);
            });
        }, trigger: function (a, b) {
            return this.each(function () {
                m.event.trigger(a, b, this);
            });
        }, triggerHandler: function (a, b) {
            var c = this[0];
            return c ? m.event.trigger(a, b, c, !0) : void 0;
        }
    });
    function db(a) {
        var b = eb.split("|"), c = a.createDocumentFragment();
        if (c.createElement) {
            while (b.length) {
                c.createElement(b.pop());
            }
        }
        return c;
    }

    var eb = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video", fb = / jQuery\d+="(?:null|\d+)"/g, gb = new RegExp("<(?:" + eb + ")[\\s/>]", "i"), hb = /^\s+/, ib = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, jb = /<([\w:]+)/, kb = /<tbody/i, lb = /<|&#?\w+;/, mb = /<(?:script|style|link)/i, nb = /checked\s*(?:[^=]|=\s*.checked.)/i, ob = /^$|\/(?:java|ecma)script/i, pb = /^true\/(.*)/, qb = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g, rb = {
        option: [1, "<select multiple='multiple'>", "</select>"],
        legend: [1, "<fieldset>", "</fieldset>"],
        area: [1, "<map>", "</map>"],
        param: [1, "<object>", "</object>"],
        thead: [1, "<table>", "</table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        _default: k.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
    }, sb = db(y), tb = sb.appendChild(y.createElement("div"));
    rb.optgroup = rb.option, rb.tbody = rb.tfoot = rb.colgroup = rb.caption = rb.thead, rb.th = rb.td;
    function ub(a, b) {
        var c, d, e = 0, f = typeof a.getElementsByTagName !== K ? a.getElementsByTagName(b || "*") : typeof a.querySelectorAll !== K ? a.querySelectorAll(b || "*") : void 0;
        if (!f) {
            for (f = [], c = a.childNodes || a; null != (d = c[e]); e++) {
                !b || m.nodeName(d, b) ? f.push(d) : m.merge(f, ub(d, b));
            }
        }
        return void 0 === b || b && m.nodeName(a, b) ? m.merge([a], f) : f;
    }

    function vb(a) {
        W.test(a.type) && (a.defaultChecked = a.checked);
    }

    function wb(a, b) {
        return m.nodeName(a, "table") && m.nodeName(11 !== b.nodeType ? b : b.firstChild, "tr") ? a.getElementsByTagName("tbody")[0] || a.appendChild(a.ownerDocument.createElement("tbody")) : a;
    }

    function xb(a) {
        return a.type = (null !== m.find.attr(a, "type")) + "/" + a.type, a;
    }

    function yb(a) {
        var b = pb.exec(a.type);
        return b ? a.type = b[1] : a.removeAttribute("type"), a;
    }

    function zb(a, b) {
        for (var c, d = 0; null != (c = a[d]); d++) {
            m._data(c, "globalEval", !b || m._data(b[d], "globalEval"));
        }
    }

    function Ab(a, b) {
        if (1 === b.nodeType && m.hasData(a)) {
            var c, d, e, f = m._data(a), g = m._data(b, f), h = f.events;
            if (h) {
                delete g.handle, g.events = {};
                for (c in h) {
                    for (d = 0, e = h[c].length; e > d; d++) {
                        m.event.add(b, c, h[c][d]);
                    }
                }
            }
            g.data && (g.data = m.extend({}, g.data));
        }
    }

    function Bb(a, b) {
        var c, d, e;
        if (1 === b.nodeType) {
            if (c = b.nodeName.toLowerCase(), !k.noCloneEvent && b[m.expando]) {
                e = m._data(b);
                for (d in e.events) {
                    m.removeEvent(b, d, e.handle);
                }
                b.removeAttribute(m.expando);
            }
            "script" === c && b.text !== a.text ? (xb(b).text = a.text, yb(b)) : "object" === c ? (b.parentNode && (b.outerHTML = a.outerHTML), k.html5Clone && a.innerHTML && !m.trim(b.innerHTML) && (b.innerHTML = a.innerHTML)) : "input" === c && W.test(a.type) ? (b.defaultChecked = b.checked = a.checked, b.value !== a.value && (b.value = a.value)) : "option" === c ? b.defaultSelected = b.selected = a.defaultSelected : ("input" === c || "textarea" === c) && (b.defaultValue = a.defaultValue);
        }
    }

    m.extend({
        clone: function (a, b, c) {
            var d, e, f, g, h, i = m.contains(a.ownerDocument, a);
            if (k.html5Clone || m.isXMLDoc(a) || !gb.test("<" + a.nodeName + ">") ? f = a.cloneNode(!0) : (tb.innerHTML = a.outerHTML, tb.removeChild(f = tb.firstChild)), !(k.noCloneEvent && k.noCloneChecked || 1 !== a.nodeType && 11 !== a.nodeType || m.isXMLDoc(a))) {
                for (d = ub(f), h = ub(a), g = 0; null != (e = h[g]); ++g) {
                    d[g] && Bb(e, d[g]);
                }
            }
            if (b) {
                if (c) {
                    for (h = h || ub(a), d = d || ub(f), g = 0; null != (e = h[g]); g++) {
                        Ab(e, d[g]);
                    }
                } else {
                    Ab(a, f);
                }
            }
            return d = ub(f, "script"), d.length > 0 && zb(d, !i && ub(a, "script")), d = h = e = null, f;
        }, buildFragment: function (a, b, c, d) {
            for (var e, f, g, h, i, j, l, n = a.length, o = db(b), p = [], q = 0; n > q; q++) {
                if (f = a[q], f || 0 === f) {
                    if ("object" === m.type(f)) {
                        m.merge(p, f.nodeType ? [f] : f);
                    } else {
                        if (lb.test(f)) {
                            h = h || o.appendChild(b.createElement("div")), i = (jb.exec(f) || ["", ""])[1].toLowerCase(), l = rb[i] || rb._default, h.innerHTML = l[1] + f.replace(ib, "<$1></$2>") + l[2], e = l[0];
                            while (e--) {
                                h = h.lastChild;
                            }
                            if (!k.leadingWhitespace && hb.test(f) && p.push(b.createTextNode(hb.exec(f)[0])), !k.tbody) {
                                f = "table" !== i || kb.test(f) ? "<table>" !== l[1] || kb.test(f) ? 0 : h : h.firstChild, e = f && f.childNodes.length;
                                while (e--) {
                                    m.nodeName(j = f.childNodes[e], "tbody") && !j.childNodes.length && f.removeChild(j);
                                }
                            }
                            m.merge(p, h.childNodes), h.textContent = "";
                            while (h.firstChild) {
                                h.removeChild(h.firstChild);
                            }
                            h = o.lastChild;
                        } else {
                            p.push(b.createTextNode(f));
                        }
                    }
                }
            }
            h && o.removeChild(h), k.appendChecked || m.grep(ub(p, "input"), vb), q = 0;
            while (f = p[q++]) {
                if ((!d || -1 === m.inArray(f, d)) && (g = m.contains(f.ownerDocument, f), h = ub(o.appendChild(f), "script"), g && zb(h), c)) {
                    e = 0;
                    while (f = h[e++]) {
                        ob.test(f.type || "") && c.push(f);
                    }
                }
            }
            return h = null, o;
        }, cleanData: function (a, b) {
            for (var d, e, f, g, h = 0, i = m.expando, j = m.cache, l = k.deleteExpando, n = m.event.special; null != (d = a[h]); h++) {
                if ((b || m.acceptData(d)) && (f = d[i], g = f && j[f])) {
                    if (g.events) {
                        for (e in g.events) {
                            n[e] ? m.event.remove(d, e) : m.removeEvent(d, e, g.handle);
                        }
                    }
                    j[f] && (delete j[f], l ? delete d[i] : typeof d.removeAttribute !== K ? d.removeAttribute(i) : d[i] = null, c.push(f));
                }
            }
        }
    }), m.fn.extend({
        text: function (a) {
            return V(this, function (a) {
                return void 0 === a ? m.text(this) : this.empty().append((this[0] && this[0].ownerDocument || y).createTextNode(a));
            }, null, a, arguments.length);
        }, append: function () {
            return this.domManip(arguments, function (a) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var b = wb(this, a);
                    b.appendChild(a);
                }
            });
        }, prepend: function () {
            return this.domManip(arguments, function (a) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var b = wb(this, a);
                    b.insertBefore(a, b.firstChild);
                }
            });
        }, before: function () {
            return this.domManip(arguments, function (a) {
                this.parentNode && this.parentNode.insertBefore(a, this);
            });
        }, after: function () {
            return this.domManip(arguments, function (a) {
                this.parentNode && this.parentNode.insertBefore(a, this.nextSibling);
            });
        }, remove: function (a, b) {
            for (var c, d = a ? m.filter(a, this) : this, e = 0; null != (c = d[e]); e++) {
                b || 1 !== c.nodeType || m.cleanData(ub(c)), c.parentNode && (b && m.contains(c.ownerDocument, c) && zb(ub(c, "script")), c.parentNode.removeChild(c));
            }
            return this;
        }, empty: function () {
            for (var a, b = 0; null != (a = this[b]); b++) {
                1 === a.nodeType && m.cleanData(ub(a, !1));
                while (a.firstChild) {
                    a.removeChild(a.firstChild);
                }
                a.options && m.nodeName(a, "select") && (a.options.length = 0);
            }
            return this;
        }, clone: function (a, b) {
            return a = null == a ? !1 : a, b = null == b ? a : b, this.map(function () {
                return m.clone(this, a, b);
            });
        }, html: function (a) {
            return V(this, function (a) {
                var b = this[0] || {}, c = 0, d = this.length;
                if (void 0 === a) {
                    return 1 === b.nodeType ? b.innerHTML.replace(fb, "") : void 0;
                }
                if (!("string" != typeof a || mb.test(a) || !k.htmlSerialize && gb.test(a) || !k.leadingWhitespace && hb.test(a) || rb[(jb.exec(a) || ["", ""])[1].toLowerCase()])) {
                    a = a.replace(ib, "<$1></$2>");
                    try {
                        for (; d > c; c++) {
                            b = this[c] || {}, 1 === b.nodeType && (m.cleanData(ub(b, !1)), b.innerHTML = a);
                        }
                        b = 0;
                    } catch (e) {
                    }
                }
                b && this.empty().append(a);
            }, null, a, arguments.length);
        }, replaceWith: function () {
            var a = arguments[0];
            return this.domManip(arguments, function (b) {
                a = this.parentNode, m.cleanData(ub(this)), a && a.replaceChild(b, this);
            }), a && (a.length || a.nodeType) ? this : this.remove();
        }, detach: function (a) {
            return this.remove(a, !0);
        }, domManip: function (a, b) {
            a = e.apply([], a);
            var c, d, f, g, h, i, j = 0, l = this.length, n = this, o = l - 1, p = a[0], q = m.isFunction(p);
            if (q || l > 1 && "string" == typeof p && !k.checkClone && nb.test(p)) {
                return this.each(function (c) {
                    var d = n.eq(c);
                    q && (a[0] = p.call(this, c, d.html())), d.domManip(a, b);
                });
            }
            if (l && (i = m.buildFragment(a, this[0].ownerDocument, !1, this), c = i.firstChild, 1 === i.childNodes.length && (i = c), c)) {
                for (g = m.map(ub(i, "script"), xb), f = g.length; l > j; j++) {
                    d = i, j !== o && (d = m.clone(d, !0, !0), f && m.merge(g, ub(d, "script"))), b.call(this[j], d, j);
                }
                if (f) {
                    for (h = g[g.length - 1].ownerDocument, m.map(g, yb), j = 0; f > j; j++) {
                        d = g[j], ob.test(d.type || "") && !m._data(d, "globalEval") && m.contains(h, d) && (d.src ? m._evalUrl && m._evalUrl(d.src) : m.globalEval((d.text || d.textContent || d.innerHTML || "").replace(qb, "")));
                    }
                }
                i = c = null;
            }
            return this;
        }
    }), m.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function (a, b) {
        m.fn[a] = function (a) {
            for (var c, d = 0, e = [], g = m(a), h = g.length - 1; h >= d; d++) {
                c = d === h ? this : this.clone(!0), m(g[d])[b](c), f.apply(e, c.get());
            }
            return this.pushStack(e);
        };
    });
    var Cb, Db = {};

    function Eb(b, c) {
        var d, e = m(c.createElement(b)).appendTo(c.body), f = a.getDefaultComputedStyle && (d = a.getDefaultComputedStyle(e[0])) ? d.display : m.css(e[0], "display");
        return e.detach(), f;
    }

    function Fb(a) {
        var b = y, c = Db[a];
        return c || (c = Eb(a, b), "none" !== c && c || (Cb = (Cb || m("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement), b = (Cb[0].contentWindow || Cb[0].contentDocument).document, b.write(), b.close(), c = Eb(a, b), Cb.detach()), Db[a] = c), c;
    }

    !function () {
        var a;
        k.shrinkWrapBlocks = function () {
            if (null != a) {
                return a;
            }
            a = !1;
            var b, c, d;
            return c = y.getElementsByTagName("body")[0], c && c.style ? (b = y.createElement("div"), d = y.createElement("div"), d.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", c.appendChild(d).appendChild(b), typeof b.style.zoom !== K && (b.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1", b.appendChild(y.createElement("div")).style.width = "5px", a = 3 !== b.offsetWidth), c.removeChild(d), a) : void 0;
        };
    }();
    var Gb = /^margin/, Hb = new RegExp("^(" + S + ")(?!px)[a-z%]+$", "i"), Ib, Jb, Kb = /^(top|right|bottom|left)$/;
    a.getComputedStyle ? (Ib = function (a) {
        return a.ownerDocument.defaultView.getComputedStyle(a, null);
    }, Jb = function (a, b, c) {
        var d, e, f, g, h = a.style;
        return c = c || Ib(a), g = c ? c.getPropertyValue(b) || c[b] : void 0, c && ("" !== g || m.contains(a.ownerDocument, a) || (g = m.style(a, b)), Hb.test(g) && Gb.test(b) && (d = h.width, e = h.minWidth, f = h.maxWidth, h.minWidth = h.maxWidth = h.width = g, g = c.width, h.width = d, h.minWidth = e, h.maxWidth = f)), void 0 === g ? g : g + "";
    }) : y.documentElement.currentStyle && (Ib = function (a) {
        return a.currentStyle;
    }, Jb = function (a, b, c) {
        var d, e, f, g, h = a.style;
        return c = c || Ib(a), g = c ? c[b] : void 0, null == g && h && h[b] && (g = h[b]), Hb.test(g) && !Kb.test(b) && (d = h.left, e = a.runtimeStyle, f = e && e.left, f && (e.left = a.currentStyle.left), h.left = "fontSize" === b ? "1em" : g, g = h.pixelLeft + "px", h.left = d, f && (e.left = f)), void 0 === g ? g : g + "" || "auto";
    });
    function Lb(a, b) {
        return {
            get: function () {
                var c = a();
                if (null != c) {
                    return c ? void delete this.get : (this.get = b).apply(this, arguments);
                }
            }
        };
    }

    !function () {
        var b, c, d, e, f, g, h;
        if (b = y.createElement("div"), b.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", d = b.getElementsByTagName("a")[0], c = d && d.style) {
            c.cssText = "float:left;opacity:.5", k.opacity = "0.5" === c.opacity, k.cssFloat = !!c.cssFloat, b.style.backgroundClip = "content-box", b.cloneNode(!0).style.backgroundClip = "", k.clearCloneStyle = "content-box" === b.style.backgroundClip, k.boxSizing = "" === c.boxSizing || "" === c.MozBoxSizing || "" === c.WebkitBoxSizing, m.extend(k, {
                reliableHiddenOffsets: function () {
                    return null == g && i(), g;
                }, boxSizingReliable: function () {
                    return null == f && i(), f;
                }, pixelPosition: function () {
                    return null == e && i(), e;
                }, reliableMarginRight: function () {
                    return null == h && i(), h;
                }
            });
            function i() {
                var b, c, d, i;
                c = y.getElementsByTagName("body")[0], c && c.style && (b = y.createElement("div"), d = y.createElement("div"), d.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px", c.appendChild(d).appendChild(b), b.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute", e = f = !1, h = !0, a.getComputedStyle && (e = "1%" !== (a.getComputedStyle(b, null) || {}).top, f = "4px" === (a.getComputedStyle(b, null) || {width: "4px"}).width, i = b.appendChild(y.createElement("div")), i.style.cssText = b.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", i.style.marginRight = i.style.width = "0", b.style.width = "1px", h = !parseFloat((a.getComputedStyle(i, null) || {}).marginRight)), b.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", i = b.getElementsByTagName("td"), i[0].style.cssText = "margin:0;border:0;padding:0;display:none", g = 0 === i[0].offsetHeight, g && (i[0].style.display = "", i[1].style.display = "none", g = 0 === i[0].offsetHeight), c.removeChild(d));
            }
        }
    }(), m.swap = function (a, b, c, d) {
        var e, f, g = {};
        for (f in b) {
            g[f] = a.style[f], a.style[f] = b[f];
        }
        e = c.apply(a, d || []);
        for (f in b) {
            a.style[f] = g[f];
        }
        return e;
    };
    var Mb = /alpha\([^)]*\)/i, Nb = /opacity\s*=\s*([^)]*)/, Ob = /^(none|table(?!-c[ea]).+)/, Pb = new RegExp("^(" + S + ")(.*)$", "i"), Qb = new RegExp("^([+-])=(" + S + ")", "i"), Rb = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
    }, Sb = {letterSpacing: "0", fontWeight: "400"}, Tb = ["Webkit", "O", "Moz", "ms"];

    function Ub(a, b) {
        if (b in a) {
            return b;
        }
        var c = b.charAt(0).toUpperCase() + b.slice(1), d = b, e = Tb.length;
        while (e--) {
            if (b = Tb[e] + c, b in a) {
                return b;
            }
        }
        return d;
    }

    function Vb(a, b) {
        for (var c, d, e, f = [], g = 0, h = a.length; h > g; g++) {
            d = a[g], d.style && (f[g] = m._data(d, "olddisplay"), c = d.style.display, b ? (f[g] || "none" !== c || (d.style.display = ""), "" === d.style.display && U(d) && (f[g] = m._data(d, "olddisplay", Fb(d.nodeName)))) : (e = U(d), (c && "none" !== c || !e) && m._data(d, "olddisplay", e ? c : m.css(d, "display"))));
        }
        for (g = 0; h > g; g++) {
            d = a[g], d.style && (b && "none" !== d.style.display && "" !== d.style.display || (d.style.display = b ? f[g] || "" : "none"));
        }
        return a;
    }

    function Wb(a, b, c) {
        var d = Pb.exec(b);
        return d ? Math.max(0, d[1] - (c || 0)) + (d[2] || "px") : b;
    }

    function Xb(a, b, c, d, e) {
        for (var f = c === (d ? "border" : "content") ? 4 : "width" === b ? 1 : 0, g = 0; 4 > f; f += 2) {
            "margin" === c && (g += m.css(a, c + T[f], !0, e)), d ? ("content" === c && (g -= m.css(a, "padding" + T[f], !0, e)), "margin" !== c && (g -= m.css(a, "border" + T[f] + "Width", !0, e))) : (g += m.css(a, "padding" + T[f], !0, e), "padding" !== c && (g += m.css(a, "border" + T[f] + "Width", !0, e)));
        }
        return g;
    }

    function Yb(a, b, c) {
        var d = !0, e = "width" === b ? a.offsetWidth : a.offsetHeight, f = Ib(a), g = k.boxSizing && "border-box" === m.css(a, "boxSizing", !1, f);
        if (0 >= e || null == e) {
            if (e = Jb(a, b, f), (0 > e || null == e) && (e = a.style[b]), Hb.test(e)) {
                return e;
            }
            d = g && (k.boxSizingReliable() || e === a.style[b]), e = parseFloat(e) || 0;
        }
        return e + Xb(a, b, c || (g ? "border" : "content"), d, f) + "px";
    }

    m.extend({
        cssHooks: {
            opacity: {
                get: function (a, b) {
                    if (b) {
                        var c = Jb(a, "opacity");
                        return "" === c ? "1" : c;
                    }
                }
            }
        },
        cssNumber: {
            columnCount: !0,
            fillOpacity: !0,
            flexGrow: !0,
            flexShrink: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {"float": k.cssFloat ? "cssFloat" : "styleFloat"},
        style: function (a, b, c, d) {
            if (a && 3 !== a.nodeType && 8 !== a.nodeType && a.style) {
                var e, f, g, h = m.camelCase(b), i = a.style;
                if (b = m.cssProps[h] || (m.cssProps[h] = Ub(i, h)), g = m.cssHooks[b] || m.cssHooks[h], void 0 === c) {
                    return g && "get" in g && void 0 !== (e = g.get(a, !1, d)) ? e : i[b];
                }
                if (f = typeof c, "string" === f && (e = Qb.exec(c)) && (c = (e[1] + 1) * e[2] + parseFloat(m.css(a, b)), f = "number"), null != c && c === c && ("number" !== f || m.cssNumber[h] || (c += "px"), k.clearCloneStyle || "" !== c || 0 !== b.indexOf("background") || (i[b] = "inherit"), !(g && "set" in g && void 0 === (c = g.set(a, c, d))))) {
                    try {
                        i[b] = c;
                    } catch (j) {
                    }
                }
            }
        },
        css: function (a, b, c, d) {
            var e, f, g, h = m.camelCase(b);
            return b = m.cssProps[h] || (m.cssProps[h] = Ub(a.style, h)), g = m.cssHooks[b] || m.cssHooks[h], g && "get" in g && (f = g.get(a, !0, c)), void 0 === f && (f = Jb(a, b, d)), "normal" === f && b in Sb && (f = Sb[b]), "" === c || c ? (e = parseFloat(f), c === !0 || m.isNumeric(e) ? e || 0 : f) : f;
        }
    }), m.each(["height", "width"], function (a, b) {
        m.cssHooks[b] = {
            get: function (a, c, d) {
                return c ? Ob.test(m.css(a, "display")) && 0 === a.offsetWidth ? m.swap(a, Rb, function () {
                    return Yb(a, b, d);
                }) : Yb(a, b, d) : void 0;
            }, set: function (a, c, d) {
                var e = d && Ib(a);
                return Wb(a, c, d ? Xb(a, b, d, k.boxSizing && "border-box" === m.css(a, "boxSizing", !1, e), e) : 0);
            }
        };
    }), k.opacity || (m.cssHooks.opacity = {
        get: function (a, b) {
            return Nb.test((b && a.currentStyle ? a.currentStyle.filter : a.style.filter) || "") ? 0.01 * parseFloat(RegExp.$1) + "" : b ? "1" : "";
        }, set: function (a, b) {
            var c = a.style, d = a.currentStyle, e = m.isNumeric(b) ? "alpha(opacity=" + 100 * b + ")" : "", f = d && d.filter || c.filter || "";
            c.zoom = 1, (b >= 1 || "" === b) && "" === m.trim(f.replace(Mb, "")) && c.removeAttribute && (c.removeAttribute("filter"), "" === b || d && !d.filter) || (c.filter = Mb.test(f) ? f.replace(Mb, e) : f + " " + e);
        }
    }), m.cssHooks.marginRight = Lb(k.reliableMarginRight, function (a, b) {
        return b ? m.swap(a, {display: "inline-block"}, Jb, [a, "marginRight"]) : void 0;
    }), m.each({margin: "", padding: "", border: "Width"}, function (a, b) {
        m.cssHooks[a + b] = {
            expand: function (c) {
                for (var d = 0, e = {}, f = "string" == typeof c ? c.split(" ") : [c]; 4 > d; d++) {
                    e[a + T[d] + b] = f[d] || f[d - 2] || f[0];
                }
                return e;
            }
        }, Gb.test(a) || (m.cssHooks[a + b].set = Wb);
    }), m.fn.extend({
        css: function (a, b) {
            return V(this, function (a, b, c) {
                var d, e, f = {}, g = 0;
                if (m.isArray(b)) {
                    for (d = Ib(a), e = b.length; e > g; g++) {
                        f[b[g]] = m.css(a, b[g], !1, d);
                    }
                    return f;
                }
                return void 0 !== c ? m.style(a, b, c) : m.css(a, b);
            }, a, b, arguments.length > 1);
        }, show: function () {
            return Vb(this, !0);
        }, hide: function () {
            return Vb(this);
        }, toggle: function (a) {
            return "boolean" == typeof a ? a ? this.show() : this.hide() : this.each(function () {
                U(this) ? m(this).show() : m(this).hide();
            });
        }
    });
    function Zb(a, b, c, d, e) {
        return new Zb.prototype.init(a, b, c, d, e);
    }

    m.Tween = Zb, Zb.prototype = {
        constructor: Zb, init: function (a, b, c, d, e, f) {
            this.elem = a, this.prop = c, this.easing = e || "swing", this.options = b, this.start = this.now = this.cur(), this.end = d, this.unit = f || (m.cssNumber[c] ? "" : "px");
        }, cur: function () {
            var a = Zb.propHooks[this.prop];
            return a && a.get ? a.get(this) : Zb.propHooks._default.get(this);
        }, run: function (a) {
            var b, c = Zb.propHooks[this.prop];
            return this.pos = b = this.options.duration ? m.easing[this.easing](a, this.options.duration * a, 0, 1, this.options.duration) : a, this.now = (this.end - this.start) * b + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), c && c.set ? c.set(this) : Zb.propHooks._default.set(this), this;
        }
    }, Zb.prototype.init.prototype = Zb.prototype, Zb.propHooks = {
        _default: {
            get: function (a) {
                var b;
                return null == a.elem[a.prop] || a.elem.style && null != a.elem.style[a.prop] ? (b = m.css(a.elem, a.prop, ""), b && "auto" !== b ? b : 0) : a.elem[a.prop];
            }, set: function (a) {
                m.fx.step[a.prop] ? m.fx.step[a.prop](a) : a.elem.style && (null != a.elem.style[m.cssProps[a.prop]] || m.cssHooks[a.prop]) ? m.style(a.elem, a.prop, a.now + a.unit) : a.elem[a.prop] = a.now;
            }
        }
    }, Zb.propHooks.scrollTop = Zb.propHooks.scrollLeft = {
        set: function (a) {
            a.elem.nodeType && a.elem.parentNode && (a.elem[a.prop] = a.now);
        }
    }, m.easing = {
        linear: function (a) {
            return a;
        }, swing: function (a) {
            return 0.5 - Math.cos(a * Math.PI) / 2;
        }
    }, m.fx = Zb.prototype.init, m.fx.step = {};
    var $b, _b, ac = /^(?:toggle|show|hide)$/, bc = new RegExp("^(?:([+-])=|)(" + S + ")([a-z%]*)$", "i"), cc = /queueHooks$/, dc = [ic], ec = {
        "*": [function (a, b) {
            var c = this.createTween(a, b), d = c.cur(), e = bc.exec(b), f = e && e[3] || (m.cssNumber[a] ? "" : "px"), g = (m.cssNumber[a] || "px" !== f && +d) && bc.exec(m.css(c.elem, a)), h = 1, i = 20;
            if (g && g[3] !== f) {
                f = f || g[3], e = e || [], g = +d || 1;
                do {
                    h = h || ".5", g /= h, m.style(c.elem, a, g + f);
                } while (h !== (h = c.cur() / d) && 1 !== h && --i);
            }
            return e && (g = c.start = +g || +d || 0, c.unit = f, c.end = e[1] ? g + (e[1] + 1) * e[2] : +e[2]), c;
        }]
    };

    function fc() {
        return setTimeout(function () {
            $b = void 0;
        }), $b = m.now();
    }

    function gc(a, b) {
        var c, d = {height: a}, e = 0;
        for (b = b ? 1 : 0; 4 > e; e += 2 - b) {
            c = T[e], d["margin" + c] = d["padding" + c] = a;
        }
        return b && (d.opacity = d.width = a), d;
    }

    function hc(a, b, c) {
        for (var d, e = (ec[b] || []).concat(ec["*"]), f = 0, g = e.length; g > f; f++) {
            if (d = e[f].call(c, b, a)) {
                return d;
            }
        }
    }

    function ic(a, b, c) {
        var d, e, f, g, h, i, j, l, n = this, o = {}, p = a.style, q = a.nodeType && U(a), r = m._data(a, "fxshow");
        c.queue || (h = m._queueHooks(a, "fx"), null == h.unqueued && (h.unqueued = 0, i = h.empty.fire, h.empty.fire = function () {
            h.unqueued || i();
        }), h.unqueued++, n.always(function () {
            n.always(function () {
                h.unqueued--, m.queue(a, "fx").length || h.empty.fire();
            });
        })), 1 === a.nodeType && ("height" in b || "width" in b) && (c.overflow = [p.overflow, p.overflowX, p.overflowY], j = m.css(a, "display"), l = "none" === j ? m._data(a, "olddisplay") || Fb(a.nodeName) : j, "inline" === l && "none" === m.css(a, "float") && (k.inlineBlockNeedsLayout && "inline" !== Fb(a.nodeName) ? p.zoom = 1 : p.display = "inline-block")), c.overflow && (p.overflow = "hidden", k.shrinkWrapBlocks() || n.always(function () {
            p.overflow = c.overflow[0], p.overflowX = c.overflow[1], p.overflowY = c.overflow[2];
        }));
        for (d in b) {
            if (e = b[d], ac.exec(e)) {
                if (delete b[d], f = f || "toggle" === e, e === (q ? "hide" : "show")) {
                    if ("show" !== e || !r || void 0 === r[d]) {
                        continue;
                    }
                    q = !0;
                }
                o[d] = r && r[d] || m.style(a, d);
            } else {
                j = void 0;
            }
        }
        if (m.isEmptyObject(o)) {
            "inline" === ("none" === j ? Fb(a.nodeName) : j) && (p.display = j);
        } else {
            r ? "hidden" in r && (q = r.hidden) : r = m._data(a, "fxshow", {}), f && (r.hidden = !q), q ? m(a).show() : n.done(function () {
                m(a).hide();
            }), n.done(function () {
                var b;
                m._removeData(a, "fxshow");
                for (b in o) {
                    m.style(a, b, o[b]);
                }
            });
            for (d in o) {
                g = hc(q ? r[d] : 0, d, n), d in r || (r[d] = g.start, q && (g.end = g.start, g.start = "width" === d || "height" === d ? 1 : 0));
            }
        }
    }

    function jc(a, b) {
        var c, d, e, f, g;
        for (c in a) {
            if (d = m.camelCase(c), e = b[d], f = a[c], m.isArray(f) && (e = f[1], f = a[c] = f[0]), c !== d && (a[d] = f, delete a[c]), g = m.cssHooks[d], g && "expand" in g) {
                f = g.expand(f), delete a[d];
                for (c in f) {
                    c in a || (a[c] = f[c], b[c] = e);
                }
            } else {
                b[d] = e;
            }
        }
    }

    function kc(a, b, c) {
        var d, e, f = 0, g = dc.length, h = m.Deferred().always(function () {
            delete i.elem;
        }), i = function () {
            if (e) {
                return !1;
            }
            for (var b = $b || fc(), c = Math.max(0, j.startTime + j.duration - b), d = c / j.duration || 0, f = 1 - d, g = 0, i = j.tweens.length; i > g; g++) {
                j.tweens[g].run(f);
            }
            return h.notifyWith(a, [j, f, c]), 1 > f && i ? c : (h.resolveWith(a, [j]), !1);
        }, j = h.promise({
            elem: a,
            props: m.extend({}, b),
            opts: m.extend(!0, {specialEasing: {}}, c),
            originalProperties: b,
            originalOptions: c,
            startTime: $b || fc(),
            duration: c.duration,
            tweens: [],
            createTween: function (b, c) {
                var d = m.Tween(a, j.opts, b, c, j.opts.specialEasing[b] || j.opts.easing);
                return j.tweens.push(d), d;
            },
            stop: function (b) {
                var c = 0, d = b ? j.tweens.length : 0;
                if (e) {
                    return this;
                }
                for (e = !0; d > c; c++) {
                    j.tweens[c].run(1);
                }
                return b ? h.resolveWith(a, [j, b]) : h.rejectWith(a, [j, b]), this;
            }
        }), k = j.props;
        for (jc(k, j.opts.specialEasing); g > f; f++) {
            if (d = dc[f].call(j, a, k, j.opts)) {
                return d;
            }
        }
        return m.map(k, hc, j), m.isFunction(j.opts.start) && j.opts.start.call(a, j), m.fx.timer(m.extend(i, {
            elem: a,
            anim: j,
            queue: j.opts.queue
        })), j.progress(j.opts.progress).done(j.opts.done, j.opts.complete).fail(j.opts.fail).always(j.opts.always);
    }

    m.Animation = m.extend(kc, {
        tweener: function (a, b) {
            m.isFunction(a) ? (b = a, a = ["*"]) : a = a.split(" ");
            for (var c, d = 0, e = a.length; e > d; d++) {
                c = a[d], ec[c] = ec[c] || [], ec[c].unshift(b);
            }
        }, prefilter: function (a, b) {
            b ? dc.unshift(a) : dc.push(a);
        }
    }), m.speed = function (a, b, c) {
        var d = a && "object" == typeof a ? m.extend({}, a) : {
            complete: c || !c && b || m.isFunction(a) && a,
            duration: a,
            easing: c && b || b && !m.isFunction(b) && b
        };
        return d.duration = m.fx.off ? 0 : "number" == typeof d.duration ? d.duration : d.duration in m.fx.speeds ? m.fx.speeds[d.duration] : m.fx.speeds._default, (null == d.queue || d.queue === !0) && (d.queue = "fx"), d.old = d.complete, d.complete = function () {
            m.isFunction(d.old) && d.old.call(this), d.queue && m.dequeue(this, d.queue);
        }, d;
    }, m.fn.extend({
        fadeTo: function (a, b, c, d) {
            return this.filter(U).css("opacity", 0).show().end().animate({opacity: b}, a, c, d);
        }, animate: function (a, b, c, d) {
            var e = m.isEmptyObject(a), f = m.speed(b, c, d), g = function () {
                var b = kc(this, m.extend({}, a), f);
                (e || m._data(this, "finish")) && b.stop(!0);
            };
            return g.finish = g, e || f.queue === !1 ? this.each(g) : this.queue(f.queue, g);
        }, stop: function (a, b, c) {
            var d = function (a) {
                var b = a.stop;
                delete a.stop, b(c);
            };
            return "string" != typeof a && (c = b, b = a, a = void 0), b && a !== !1 && this.queue(a || "fx", []), this.each(function () {
                var b = !0, e = null != a && a + "queueHooks", f = m.timers, g = m._data(this);
                if (e) {
                    g[e] && g[e].stop && d(g[e]);
                } else {
                    for (e in g) {
                        g[e] && g[e].stop && cc.test(e) && d(g[e]);
                    }
                }
                for (e = f.length; e--;) {
                    f[e].elem !== this || null != a && f[e].queue !== a || (f[e].anim.stop(c), b = !1, f.splice(e, 1));
                }
                (b || !c) && m.dequeue(this, a);
            });
        }, finish: function (a) {
            return a !== !1 && (a = a || "fx"), this.each(function () {
                var b, c = m._data(this), d = c[a + "queue"], e = c[a + "queueHooks"], f = m.timers, g = d ? d.length : 0;
                for (c.finish = !0, m.queue(this, a, []), e && e.stop && e.stop.call(this, !0), b = f.length; b--;) {
                    f[b].elem === this && f[b].queue === a && (f[b].anim.stop(!0), f.splice(b, 1));
                }
                for (b = 0; g > b; b++) {
                    d[b] && d[b].finish && d[b].finish.call(this);
                }
                delete c.finish;
            });
        }
    }), m.each(["toggle", "show", "hide"], function (a, b) {
        var c = m.fn[b];
        m.fn[b] = function (a, d, e) {
            return null == a || "boolean" == typeof a ? c.apply(this, arguments) : this.animate(gc(b, !0), a, d, e);
        };
    }), m.each({
        slideDown: gc("show"),
        slideUp: gc("hide"),
        slideToggle: gc("toggle"),
        fadeIn: {opacity: "show"},
        fadeOut: {opacity: "hide"},
        fadeToggle: {opacity: "toggle"}
    }, function (a, b) {
        m.fn[a] = function (a, c, d) {
            return this.animate(b, a, c, d);
        };
    }), m.timers = [], m.fx.tick = function () {
        var a, b = m.timers, c = 0;
        for ($b = m.now(); c < b.length; c++) {
            a = b[c], a() || b[c] !== a || b.splice(c--, 1);
        }
        b.length || m.fx.stop(), $b = void 0;
    }, m.fx.timer = function (a) {
        m.timers.push(a), a() ? m.fx.start() : m.timers.pop();
    }, m.fx.interval = 13, m.fx.start = function () {
        _b || (_b = setInterval(m.fx.tick, m.fx.interval));
    }, m.fx.stop = function () {
        clearInterval(_b), _b = null;
    }, m.fx.speeds = {slow: 600, fast: 200, _default: 400}, m.fn.delay = function (a, b) {
        return a = m.fx ? m.fx.speeds[a] || a : a, b = b || "fx", this.queue(b, function (b, c) {
            var d = setTimeout(b, a);
            c.stop = function () {
                clearTimeout(d);
            };
        });
    }, function () {
        var a, b, c, d, e;
        b = y.createElement("div"), b.setAttribute("className", "t"), b.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", d = b.getElementsByTagName("a")[0], c = y.createElement("select"), e = c.appendChild(y.createElement("option")), a = b.getElementsByTagName("input")[0], d.style.cssText = "top:1px", k.getSetAttribute = "t" !== b.className, k.style = /top/.test(d.getAttribute("style")), k.hrefNormalized = "/a" === d.getAttribute("href"), k.checkOn = !!a.value, k.optSelected = e.selected, k.enctype = !!y.createElement("form").enctype, c.disabled = !0, k.optDisabled = !e.disabled, a = y.createElement("input"), a.setAttribute("value", ""), k.input = "" === a.getAttribute("value"), a.value = "t", a.setAttribute("type", "radio"), k.radioValue = "t" === a.value;
    }();
    var lc = /\r/g;
    m.fn.extend({
        val: function (a) {
            var b, c, d, e = this[0];
            if (arguments.length) {
                return d = m.isFunction(a), this.each(function (c) {
                    var e;
                    1 === this.nodeType && (e = d ? a.call(this, c, m(this).val()) : a, null == e ? e = "" : "number" == typeof e ? e += "" : m.isArray(e) && (e = m.map(e, function (a) {
                        return null == a ? "" : a + "";
                    })), b = m.valHooks[this.type] || m.valHooks[this.nodeName.toLowerCase()], b && "set" in b && void 0 !== b.set(this, e, "value") || (this.value = e));
                });
            }
            if (e) {
                return b = m.valHooks[e.type] || m.valHooks[e.nodeName.toLowerCase()], b && "get" in b && void 0 !== (c = b.get(e, "value")) ? c : (c = e.value, "string" == typeof c ? c.replace(lc, "") : null == c ? "" : c);
            }
        }
    }), m.extend({
        valHooks: {
            option: {
                get: function (a) {
                    var b = m.find.attr(a, "value");
                    return null != b ? b : m.trim(m.text(a));
                }
            }, select: {
                get: function (a) {
                    for (var b, c, d = a.options, e = a.selectedIndex, f = "select-one" === a.type || 0 > e, g = f ? null : [], h = f ? e + 1 : d.length, i = 0 > e ? h : f ? e : 0; h > i; i++) {
                        if (c = d[i], !(!c.selected && i !== e || (k.optDisabled ? c.disabled : null !== c.getAttribute("disabled")) || c.parentNode.disabled && m.nodeName(c.parentNode, "optgroup"))) {
                            if (b = m(c).val(), f) {
                                return b;
                            }
                            g.push(b);
                        }
                    }
                    return g;
                }, set: function (a, b) {
                    var c, d, e = a.options, f = m.makeArray(b), g = e.length;
                    while (g--) {
                        if (d = e[g], m.inArray(m.valHooks.option.get(d), f) >= 0) {
                            try {
                                d.selected = c = !0;
                            } catch (h) {
                                d.scrollHeight;
                            }
                        } else {
                            d.selected = !1;
                        }
                    }
                    return c || (a.selectedIndex = -1), e;
                }
            }
        }
    }), m.each(["radio", "checkbox"], function () {
        m.valHooks[this] = {
            set: function (a, b) {
                return m.isArray(b) ? a.checked = m.inArray(m(a).val(), b) >= 0 : void 0;
            }
        }, k.checkOn || (m.valHooks[this].get = function (a) {
            return null === a.getAttribute("value") ? "on" : a.value;
        });
    });
    var mc, nc, oc = m.expr.attrHandle, pc = /^(?:checked|selected)$/i, qc = k.getSetAttribute, rc = k.input;
    m.fn.extend({
        attr: function (a, b) {
            return V(this, m.attr, a, b, arguments.length > 1);
        }, removeAttr: function (a) {
            return this.each(function () {
                m.removeAttr(this, a);
            });
        }
    }), m.extend({
        attr: function (a, b, c) {
            var d, e, f = a.nodeType;
            if (a && 3 !== f && 8 !== f && 2 !== f) {
                return typeof a.getAttribute === K ? m.prop(a, b, c) : (1 === f && m.isXMLDoc(a) || (b = b.toLowerCase(), d = m.attrHooks[b] || (m.expr.match.bool.test(b) ? nc : mc)), void 0 === c ? d && "get" in d && null !== (e = d.get(a, b)) ? e : (e = m.find.attr(a, b), null == e ? void 0 : e) : null !== c ? d && "set" in d && void 0 !== (e = d.set(a, c, b)) ? e : (a.setAttribute(b, c + ""), c) : void m.removeAttr(a, b));
            }
        }, removeAttr: function (a, b) {
            var c, d, e = 0, f = b && b.match(E);
            if (f && 1 === a.nodeType) {
                while (c = f[e++]) {
                    d = m.propFix[c] || c, m.expr.match.bool.test(c) ? rc && qc || !pc.test(c) ? a[d] = !1 : a[m.camelCase("default-" + c)] = a[d] = !1 : m.attr(a, c, ""), a.removeAttribute(qc ? c : d);
                }
            }
        }, attrHooks: {
            type: {
                set: function (a, b) {
                    if (!k.radioValue && "radio" === b && m.nodeName(a, "input")) {
                        var c = a.value;
                        return a.setAttribute("type", b), c && (a.value = c), b;
                    }
                }
            }
        }
    }), nc = {
        set: function (a, b, c) {
            return b === !1 ? m.removeAttr(a, c) : rc && qc || !pc.test(c) ? a.setAttribute(!qc && m.propFix[c] || c, c) : a[m.camelCase("default-" + c)] = a[c] = !0, c;
        }
    }, m.each(m.expr.match.bool.source.match(/\w+/g), function (a, b) {
        var c = oc[b] || m.find.attr;
        oc[b] = rc && qc || !pc.test(b) ? function (a, b, d) {
            var e, f;
            return d || (f = oc[b], oc[b] = e, e = null != c(a, b, d) ? b.toLowerCase() : null, oc[b] = f), e;
        } : function (a, b, c) {
            return c ? void 0 : a[m.camelCase("default-" + b)] ? b.toLowerCase() : null;
        };
    }), rc && qc || (m.attrHooks.value = {
        set: function (a, b, c) {
            return m.nodeName(a, "input") ? void (a.defaultValue = b) : mc && mc.set(a, b, c);
        }
    }), qc || (mc = {
        set: function (a, b, c) {
            var d = a.getAttributeNode(c);
            return d || a.setAttributeNode(d = a.ownerDocument.createAttribute(c)), d.value = b += "", "value" === c || b === a.getAttribute(c) ? b : void 0;
        }
    }, oc.id = oc.name = oc.coords = function (a, b, c) {
        var d;
        return c ? void 0 : (d = a.getAttributeNode(b)) && "" !== d.value ? d.value : null;
    }, m.valHooks.button = {
        get: function (a, b) {
            var c = a.getAttributeNode(b);
            return c && c.specified ? c.value : void 0;
        }, set: mc.set
    }, m.attrHooks.contenteditable = {
        set: function (a, b, c) {
            mc.set(a, "" === b ? !1 : b, c);
        }
    }, m.each(["width", "height"], function (a, b) {
        m.attrHooks[b] = {
            set: function (a, c) {
                return "" === c ? (a.setAttribute(b, "auto"), c) : void 0;
            }
        };
    })), k.style || (m.attrHooks.style = {
        get: function (a) {
            return a.style.cssText || void 0;
        }, set: function (a, b) {
            return a.style.cssText = b + "";
        }
    });
    var sc = /^(?:input|select|textarea|button|object)$/i, tc = /^(?:a|area)$/i;
    m.fn.extend({
        prop: function (a, b) {
            return V(this, m.prop, a, b, arguments.length > 1);
        }, removeProp: function (a) {
            return a = m.propFix[a] || a, this.each(function () {
                try {
                    this[a] = void 0, delete this[a];
                } catch (b) {
                }
            });
        }
    }), m.extend({
        propFix: {"for": "htmlFor", "class": "className"}, prop: function (a, b, c) {
            var d, e, f, g = a.nodeType;
            if (a && 3 !== g && 8 !== g && 2 !== g) {
                return f = 1 !== g || !m.isXMLDoc(a), f && (b = m.propFix[b] || b, e = m.propHooks[b]), void 0 !== c ? e && "set" in e && void 0 !== (d = e.set(a, c, b)) ? d : a[b] = c : e && "get" in e && null !== (d = e.get(a, b)) ? d : a[b];
            }
        }, propHooks: {
            tabIndex: {
                get: function (a) {
                    var b = m.find.attr(a, "tabindex");
                    return b ? parseInt(b, 10) : sc.test(a.nodeName) || tc.test(a.nodeName) && a.href ? 0 : -1;
                }
            }
        }
    }), k.hrefNormalized || m.each(["href", "src"], function (a, b) {
        m.propHooks[b] = {
            get: function (a) {
                return a.getAttribute(b, 4);
            }
        };
    }), k.optSelected || (m.propHooks.selected = {
        get: function (a) {
            var b = a.parentNode;
            return b && (b.selectedIndex, b.parentNode && b.parentNode.selectedIndex), null;
        }
    }), m.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function () {
        m.propFix[this.toLowerCase()] = this;
    }), k.enctype || (m.propFix.enctype = "encoding");
    var uc = /[\t\r\n\f]/g;
    m.fn.extend({
        addClass: function (a) {
            var b, c, d, e, f, g, h = 0, i = this.length, j = "string" == typeof a && a;
            if (m.isFunction(a)) {
                return this.each(function (b) {
                    m(this).addClass(a.call(this, b, this.className));
                });
            }
            if (j) {
                for (b = (a || "").match(E) || []; i > h; h++) {
                    if (c = this[h], d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(uc, " ") : " ")) {
                        f = 0;
                        while (e = b[f++]) {
                            d.indexOf(" " + e + " ") < 0 && (d += e + " ");
                        }
                        g = m.trim(d), c.className !== g && (c.className = g);
                    }
                }
            }
            return this;
        }, removeClass: function (a) {
            var b, c, d, e, f, g, h = 0, i = this.length, j = 0 === arguments.length || "string" == typeof a && a;
            if (m.isFunction(a)) {
                return this.each(function (b) {
                    m(this).removeClass(a.call(this, b, this.className));
                });
            }
            if (j) {
                for (b = (a || "").match(E) || []; i > h; h++) {
                    if (c = this[h], d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(uc, " ") : "")) {
                        f = 0;
                        while (e = b[f++]) {
                            while (d.indexOf(" " + e + " ") >= 0) {
                                d = d.replace(" " + e + " ", " ");
                            }
                        }
                        g = a ? m.trim(d) : "", c.className !== g && (c.className = g);
                    }
                }
            }
            return this;
        }, toggleClass: function (a, b) {
            var c = typeof a;
            return "boolean" == typeof b && "string" === c ? b ? this.addClass(a) : this.removeClass(a) : this.each(m.isFunction(a) ? function (c) {
                m(this).toggleClass(a.call(this, c, this.className, b), b);
            } : function () {
                if ("string" === c) {
                    var b, d = 0, e = m(this), f = a.match(E) || [];
                    while (b = f[d++]) {
                        e.hasClass(b) ? e.removeClass(b) : e.addClass(b);
                    }
                } else {
                    (c === K || "boolean" === c) && (this.className && m._data(this, "__className__", this.className), this.className = this.className || a === !1 ? "" : m._data(this, "__className__") || "");
                }
            });
        }, hasClass: function (a) {
            for (var b = " " + a + " ", c = 0, d = this.length; d > c; c++) {
                if (1 === this[c].nodeType && (" " + this[c].className + " ").replace(uc, " ").indexOf(b) >= 0) {
                    return !0;
                }
            }
            return !1;
        }
    }), m.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function (a, b) {
        m.fn[b] = function (a, c) {
            return arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b);
        };
    }), m.fn.extend({
        hover: function (a, b) {
            return this.mouseenter(a).mouseleave(b || a);
        }, bind: function (a, b, c) {
            return this.on(a, null, b, c);
        }, unbind: function (a, b) {
            return this.off(a, null, b);
        }, delegate: function (a, b, c, d) {
            return this.on(b, a, c, d);
        }, undelegate: function (a, b, c) {
            return 1 === arguments.length ? this.off(a, "**") : this.off(b, a || "**", c);
        }
    });
    var vc = m.now(), wc = /\?/, xc = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
    m.parseJSON = function (b) {
        if (a.JSON && a.JSON.parse) {
            return a.JSON.parse(b + "");
        }
        var c, d = null, e = m.trim(b + "");
        return e && !m.trim(e.replace(xc, function (a, b, e, f) {
            return c && b && (d = 0), 0 === d ? a : (c = e || b, d += !f - !e, "");
        })) ? Function("return " + e)() : m.error("Invalid JSON: " + b);
    }, m.parseXML = function (b) {
        var c, d;
        if (!b || "string" != typeof b) {
            return null;
        }
        try {
            a.DOMParser ? (d = new DOMParser, c = d.parseFromString(b, "text/xml")) : (c = new ActiveXObject("Microsoft.XMLDOM"), c.async = "false", c.loadXML(b));
        } catch (e) {
            c = void 0;
        }
        return c && c.documentElement && !c.getElementsByTagName("parsererror").length || m.error("Invalid XML: " + b), c;
    };
    var yc, zc, Ac = /#.*$/, Bc = /([?&])_=[^&]*/, Cc = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm, Dc = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, Ec = /^(?:GET|HEAD)$/, Fc = /^\/\//, Gc = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/, Hc = {}, Ic = {}, Jc = "*/".concat("*");
    try {
        zc = location.href;
    } catch (Kc) {
        zc = y.createElement("a"), zc.href = "", zc = zc.href;
    }
    yc = Gc.exec(zc.toLowerCase()) || [];
    function Lc(a) {
        return function (b, c) {
            "string" != typeof b && (c = b, b = "*");
            var d, e = 0, f = b.toLowerCase().match(E) || [];
            if (m.isFunction(c)) {
                while (d = f[e++]) {
                    "+" === d.charAt(0) ? (d = d.slice(1) || "*", (a[d] = a[d] || []).unshift(c)) : (a[d] = a[d] || []).push(c);
                }
            }
        };
    }

    function Mc(a, b, c, d) {
        var e = {}, f = a === Ic;

        function g(h) {
            var i;
            return e[h] = !0, m.each(a[h] || [], function (a, h) {
                var j = h(b, c, d);
                return "string" != typeof j || f || e[j] ? f ? !(i = j) : void 0 : (b.dataTypes.unshift(j), g(j), !1);
            }), i;
        }

        return g(b.dataTypes[0]) || !e["*"] && g("*");
    }

    function Nc(a, b) {
        var c, d, e = m.ajaxSettings.flatOptions || {};
        for (d in b) {
            void 0 !== b[d] && ((e[d] ? a : c || (c = {}))[d] = b[d]);
        }
        return c && m.extend(!0, a, c), a;
    }

    function Oc(a, b, c) {
        var d, e, f, g, h = a.contents, i = a.dataTypes;
        while ("*" === i[0]) {
            i.shift(), void 0 === e && (e = a.mimeType || b.getResponseHeader("Content-Type"));
        }
        if (e) {
            for (g in h) {
                if (h[g] && h[g].test(e)) {
                    i.unshift(g);
                    break;
                }
            }
        }
        if (i[0] in c) {
            f = i[0];
        } else {
            for (g in c) {
                if (!i[0] || a.converters[g + " " + i[0]]) {
                    f = g;
                    break;
                }
                d || (d = g);
            }
            f = f || d;
        }
        return f ? (f !== i[0] && i.unshift(f), c[f]) : void 0;
    }

    function Pc(a, b, c, d) {
        var e, f, g, h, i, j = {}, k = a.dataTypes.slice();
        if (k[1]) {
            for (g in a.converters) {
                j[g.toLowerCase()] = a.converters[g];
            }
        }
        f = k.shift();
        while (f) {
            if (a.responseFields[f] && (c[a.responseFields[f]] = b), !i && d && a.dataFilter && (b = a.dataFilter(b, a.dataType)), i = f, f = k.shift()) {
                if ("*" === f) {
                    f = i;
                } else {
                    if ("*" !== i && i !== f) {
                        if (g = j[i + " " + f] || j["* " + f], !g) {
                            for (e in j) {
                                if (h = e.split(" "), h[1] === f && (g = j[i + " " + h[0]] || j["* " + h[0]])) {
                                    g === !0 ? g = j[e] : j[e] !== !0 && (f = h[0], k.unshift(h[1]));
                                    break;
                                }
                            }
                        }
                        if (g !== !0) {
                            if (g && a["throws"]) {
                                b = g(b);
                            } else {
                                try {
                                    b = g(b);
                                } catch (l) {
                                    return {
                                        state: "parsererror",
                                        error: g ? l : "No conversion from " + i + " to " + f
                                    };
                                }
                            }
                        }
                    }
                }
            }
        }
        return {state: "success", data: b};
    }

    m.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: zc,
            type: "GET",
            isLocal: Dc.test(yc[1]),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": Jc,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {xml: /xml/, html: /html/, json: /json/},
            responseFields: {xml: "responseXML", text: "responseText", json: "responseJSON"},
            converters: {"* text": String, "text html": !0, "text json": m.parseJSON, "text xml": m.parseXML},
            flatOptions: {url: !0, context: !0}
        },
        ajaxSetup: function (a, b) {
            return b ? Nc(Nc(a, m.ajaxSettings), b) : Nc(m.ajaxSettings, a);
        },
        ajaxPrefilter: Lc(Hc),
        ajaxTransport: Lc(Ic),
        ajax: function (a, b) {

            "object" == typeof a && (b = a, a = void 0), b = b || {};
            var c, d, e, f, g, h, i, j, k = m.ajaxSetup({}, b), l = k.context || k, n = k.context && (l.nodeType || l.jquery) ? m(l) : m.event, o = m.Deferred(), p = m.Callbacks("once memory"), q = k.statusCode || {}, r = {}, s = {}, t = 0, u = "canceled", v = {
                readyState: 0,
                getResponseHeader: function (a) {
                    var b;
                    if (2 === t) {
                        if (!j) {
                            j = {};
                            while (b = Cc.exec(f)) {
                                j[b[1].toLowerCase()] = b[2];
                            }
                        }
                        b = j[a.toLowerCase()];
                    }
                    return null == b ? null : b;
                },
                getAllResponseHeaders: function () {
                    return 2 === t ? f : null;
                },
                setRequestHeader: function (a, b) {
                    var c = a.toLowerCase();
                    return t || (a = s[c] = s[c] || a, r[a] = b), this;
                },
                overrideMimeType: function (a) {
                    return t || (k.mimeType = a), this;
                },
                statusCode: function (a) {
                    var b;
                    if (a) {
                        if (2 > t) {
                            for (b in a) {
                                q[b] = [q[b], a[b]];
                            }
                        } else {
                            v.always(a[v.status]);
                        }
                    }
                    return this;
                },
                abort: function (a) {
                    var b = a || u;
                    return i && i.abort(b), x(0, b), this;
                }
            };
            if (o.promise(v).complete = p.add, v.success = v.done, v.error = v.fail, k.url = ((a || k.url || zc) + "").replace(Ac, "").replace(Fc, yc[1] + "//"), k.type = b.method || b.type || k.method || k.type, k.dataTypes = m.trim(k.dataType || "*").toLowerCase().match(E) || [""], null == k.crossDomain && (c = Gc.exec(k.url.toLowerCase()), k.crossDomain = !(!c || c[1] === yc[1] && c[2] === yc[2] && (c[3] || ("http:" === c[1] ? "80" : "443")) === (yc[3] || ("http:" === yc[1] ? "80" : "443")))), k.data && k.processData && "string" != typeof k.data && (k.data = m.param(k.data, k.traditional)), Mc(Hc, k, b, v), 2 === t) {
                return v;
            }
            h = k.global, h && 0 === m.active++ && m.event.trigger("ajaxStart"), k.type = k.type.toUpperCase(), k.hasContent = !Ec.test(k.type), e = k.url, k.hasContent || (k.data && (e = k.url += (wc.test(e) ? "&" : "?") + k.data, delete k.data), k.cache === !1 && (k.url = Bc.test(e) ? e.replace(Bc, "$1_=" + vc++) : e + (wc.test(e) ? "&" : "?") + "_=" + vc++)), k.ifModified && (m.lastModified[e] && v.setRequestHeader("If-Modified-Since", m.lastModified[e]), m.etag[e] && v.setRequestHeader("If-None-Match", m.etag[e])), (k.data && k.hasContent && k.contentType !== !1 || b.contentType) && v.setRequestHeader("Content-Type", k.contentType), v.setRequestHeader("Accept", k.dataTypes[0] && k.accepts[k.dataTypes[0]] ? k.accepts[k.dataTypes[0]] + ("*" !== k.dataTypes[0] ? ", " + Jc + "; q=0.01" : "") : k.accepts["*"]);
            for (d in k.headers) {
                v.setRequestHeader(d, k.headers[d]);
            }
            if (k.beforeSend && (k.beforeSend.call(l, v, k) === !1 || 2 === t)) {
                return v.abort();
            }
            u = "abort";
            for (d in {success: 1, error: 1, complete: 1}) {
                v[d](k[d]);
            }
            if (i = Mc(Ic, k, b, v)) {
                v.readyState = 1, h && n.trigger("ajaxSend", [v, k]), k.async && k.timeout > 0 && (g = setTimeout(function () {
                    v.abort("timeout");
                }, k.timeout));
                try {
                    t = 1, i.send(r, x);
                } catch (w) {
                    if (!(2 > t)) {
                        throw w;
                    }
                    x(-1, w);
                }
            } else {
                x(-1, "No Transport");
            }
            function x(a, b, c, d) {
                var j, r, s, u, w, x = b;
                2 !== t && (t = 2, g && clearTimeout(g), i = void 0, f = d || "", v.readyState = a > 0 ? 4 : 0, j = a >= 200 && 300 > a || 304 === a, c && (u = Oc(k, v, c)), u = Pc(k, u, v, j), j ? (k.ifModified && (w = v.getResponseHeader("Last-Modified"), w && (m.lastModified[e] = w), w = v.getResponseHeader("etag"), w && (m.etag[e] = w)), 204 === a || "HEAD" === k.type ? x = "nocontent" : 304 === a ? x = "notmodified" : (x = u.state, r = u.data, s = u.error, j = !s)) : (s = x, (a || !x) && (x = "error", 0 > a && (a = 0))), v.status = a, v.statusText = (b || x) + "", j ? o.resolveWith(l, [r, x, v]) : o.rejectWith(l, [v, x, s]), v.statusCode(q), q = void 0, h && n.trigger(j ? "ajaxSuccess" : "ajaxError", [v, k, j ? r : s]), p.fireWith(l, [v, x]), h && (n.trigger("ajaxComplete", [v, k]), --m.active || m.event.trigger("ajaxStop")));
            }

            return v;
        },
        getJSON: function (a, b, c) {
            return m.get(a, b, c, "json");
        },
        getScript: function (a, b) {
            return m.get(a, void 0, b, "script");
        }
    }), m.each(["get", "post"], function (a, b) {
        m[b] = function (a, c, d, e) {
            return m.isFunction(c) && (e = e || d, d = c, c = void 0), m.ajax({
                url: a,
                type: b,
                dataType: e,
                data: c,
                success: d
            });
        };
    }), m.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function (a, b) {
        m.fn[b] = function (a) {
            return this.on(b, a);
        };
    }), m._evalUrl = function (a) {
        return m.ajax({url: a, type: "GET", dataType: "script", async: !1, global: !1, "throws": !0});
    }, m.fn.extend({
        wrapAll: function (a) {
            if (m.isFunction(a)) {
                return this.each(function (b) {
                    m(this).wrapAll(a.call(this, b));
                });
            }
            if (this[0]) {
                var b = m(a, this[0].ownerDocument).eq(0).clone(!0);
                this[0].parentNode && b.insertBefore(this[0]), b.map(function () {
                    var a = this;
                    while (a.firstChild && 1 === a.firstChild.nodeType) {
                        a = a.firstChild;
                    }
                    return a;
                }).append(this);
            }
            return this;
        }, wrapInner: function (a) {
            return this.each(m.isFunction(a) ? function (b) {
                m(this).wrapInner(a.call(this, b));
            } : function () {
                var b = m(this), c = b.contents();
                c.length ? c.wrapAll(a) : b.append(a);
            });
        }, wrap: function (a) {
            var b = m.isFunction(a);
            return this.each(function (c) {
                m(this).wrapAll(b ? a.call(this, c) : a);
            });
        }, unwrap: function () {
            return this.parent().each(function () {
                m.nodeName(this, "body") || m(this).replaceWith(this.childNodes);
            }).end();
        }
    }), m.expr.filters.hidden = function (a) {
        return a.offsetWidth <= 0 && a.offsetHeight <= 0 || !k.reliableHiddenOffsets() && "none" === (a.style && a.style.display || m.css(a, "display"));
    }, m.expr.filters.visible = function (a) {
        return !m.expr.filters.hidden(a);
    };
    var Qc = /%20/g, Rc = /\[\]$/, Sc = /\r?\n/g, Tc = /^(?:submit|button|image|reset|file)$/i, Uc = /^(?:input|select|textarea|keygen)/i;

    function Vc(a, b, c, d) {
        var e;
        if (m.isArray(b)) {
            m.each(b, function (b, e) {
                c || Rc.test(a) ? d(a, e) : Vc(a + "[" + ("object" == typeof e ? b : "") + "]", e, c, d);
            });
        } else {
            if (c || "object" !== m.type(b)) {
                d(a, b);
            } else {
                for (e in b) {
                    Vc(a + "[" + e + "]", b[e], c, d);
                }
            }
        }
    }

    m.param = function (a, b) {
        var c, d = [], e = function (a, b) {
            b = m.isFunction(b) ? b() : null == b ? "" : b, d[d.length] = encodeURIComponent(a) + "=" + encodeURIComponent(b);
        };
        if (void 0 === b && (b = m.ajaxSettings && m.ajaxSettings.traditional), m.isArray(a) || a.jquery && !m.isPlainObject(a)) {
            m.each(a, function () {
                e(this.name, this.value);
            });
        } else {
            for (c in a) {
                Vc(c, a[c], b, e);
            }
        }
        return d.join("&").replace(Qc, "+");
    }, m.fn.extend({
        serialize: function () {
            return m.param(this.serializeArray());
        }, serializeArray: function () {
            return this.map(function () {
                var a = m.prop(this, "elements");
                return a ? m.makeArray(a) : this;
            }).filter(function () {
                var a = this.type;
                return this.name && !m(this).is(":disabled") && Uc.test(this.nodeName) && !Tc.test(a) && (this.checked || !W.test(a));
            }).map(function (a, b) {
                var c = m(this).val();
                return null == c ? null : m.isArray(c) ? m.map(c, function (a) {
                    return {name: b.name, value: a.replace(Sc, "\r\n")};
                }) : {name: b.name, value: c.replace(Sc, "\r\n")};
            }).get();
        }
    }), m.ajaxSettings.xhr = void 0 !== a.ActiveXObject ? function () {
        return !this.isLocal && /^(get|post|head|put|delete|options)$/i.test(this.type) && Zc() || $c();
    } : Zc;
    var Wc = 0, Xc = {}, Yc = m.ajaxSettings.xhr();
    a.ActiveXObject && m(a).on("unload", function () {
        for (var a in Xc) {
            Xc[a](void 0, !0);
        }
    }), k.cors = !!Yc && "withCredentials" in Yc, Yc = k.ajax = !!Yc, Yc && m.ajaxTransport(function (a) {
        if (!a.crossDomain || k.cors) {
            var b;
            return {
                send: function (c, d) {
                    var e, f = a.xhr(), g = ++Wc;
                    if (f.open(a.type, a.url, a.async, a.username, a.password), a.xhrFields) {
                        for (e in a.xhrFields) {
                            f[e] = a.xhrFields[e];
                        }
                    }
                    a.mimeType && f.overrideMimeType && f.overrideMimeType(a.mimeType), a.crossDomain || c["X-Requested-With"] || (c["X-Requested-With"] = "XMLHttpRequest");
                    for (e in c) {
                        void 0 !== c[e] && f.setRequestHeader(e, c[e] + "");
                    }
                    f.send(a.hasContent && a.data || null), b = function (c, e) {
                        var h, i, j;
                        if (b && (e || 4 === f.readyState)) {
                            if (delete Xc[g], b = void 0, f.onreadystatechange = m.noop, e) {
                                4 !== f.readyState && f.abort();
                            } else {
                                j = {}, h = f.status, "string" == typeof f.responseText && (j.text = f.responseText);
                                try {
                                    i = f.statusText;
                                } catch (k) {
                                    i = "";
                                }
                                h || !a.isLocal || a.crossDomain ? 1223 === h && (h = 204) : h = j.text ? 200 : 404;
                            }
                        }
                        j && d(h, i, j, f.getAllResponseHeaders());
                    }, a.async ? 4 === f.readyState ? setTimeout(b) : f.onreadystatechange = Xc[g] = b : b();
                }, abort: function () {
                    b && b(void 0, !0);
                }
            };
        }
    });
    function Zc() {
        try {
            return new a.XMLHttpRequest;
        } catch (b) {
        }
    }

    function $c() {
        try {
            return new a.ActiveXObject("Microsoft.XMLHTTP");
        } catch (b) {
        }
    }

    m.ajaxSetup({
        accepts: {script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},
        contents: {script: /(?:java|ecma)script/},
        converters: {
            "text script": function (a) {
                return m.globalEval(a), a;
            }
        }
    }), m.ajaxPrefilter("script", function (a) {
        void 0 === a.cache && (a.cache = !1), a.crossDomain && (a.type = "GET", a.global = !1);
    }), m.ajaxTransport("script", function (a) {
        if (a.crossDomain) {
            var b, c = y.head || m("head")[0] || y.documentElement;
            return {
                send: function (d, e) {
                    b = y.createElement("script"), b.async = !0, a.scriptCharset && (b.charset = a.scriptCharset), b.src = a.url, b.onload = b.onreadystatechange = function (a, c) {
                        (c || !b.readyState || /loaded|complete/.test(b.readyState)) && (b.onload = b.onreadystatechange = null, b.parentNode && b.parentNode.removeChild(b), b = null, c || e(200, "success"));
                    }, c.insertBefore(b, c.firstChild);
                }, abort: function () {
                    b && b.onload(void 0, !0);
                }
            };
        }
    });
    var _c = [], ad = /(=)\?(?=&|$)|\?\?/;
    m.ajaxSetup({
        jsonp: "callback", jsonpCallback: function () {
            var a = _c.pop() || m.expando + "_" + vc++;
            return this[a] = !0, a;
        }
    }), m.ajaxPrefilter("json jsonp", function (b, c, d) {
        var e, f, g, h = b.jsonp !== !1 && (ad.test(b.url) ? "url" : "string" == typeof b.data && !(b.contentType || "").indexOf("application/x-www-form-urlencoded") && ad.test(b.data) && "data");
        return h || "jsonp" === b.dataTypes[0] ? (e = b.jsonpCallback = m.isFunction(b.jsonpCallback) ? b.jsonpCallback() : b.jsonpCallback, h ? b[h] = b[h].replace(ad, "$1" + e) : b.jsonp !== !1 && (b.url += (wc.test(b.url) ? "&" : "?") + b.jsonp + "=" + e), b.converters["script json"] = function () {
            return g || m.error(e + " was not called"), g[0];
        }, b.dataTypes[0] = "json", f = a[e], a[e] = function () {
            g = arguments;
        }, d.always(function () {
            a[e] = f, b[e] && (b.jsonpCallback = c.jsonpCallback, _c.push(e)), g && m.isFunction(f) && f(g[0]), g = f = void 0;
        }), "script") : void 0;
    }), m.parseHTML = function (a, b, c) {
        if (!a || "string" != typeof a) {
            return null;
        }
        "boolean" == typeof b && (c = b, b = !1), b = b || y;
        var d = u.exec(a), e = !c && [];
        return d ? [b.createElement(d[1])] : (d = m.buildFragment([a], b, e), e && e.length && m(e).remove(), m.merge([], d.childNodes));
    };
    var bd = m.fn.load;
    m.fn.load = function (a, b, c) {
        if ("string" != typeof a && bd) {
            return bd.apply(this, arguments);
        }
        var d, e, f, g = this, h = a.indexOf(" ");
        return h >= 0 && (d = m.trim(a.slice(h, a.length)), a = a.slice(0, h)), m.isFunction(b) ? (c = b, b = void 0) : b && "object" == typeof b && (f = "POST"), g.length > 0 && m.ajax({
            url: a,
            type: f,
            dataType: "html",
            data: b
        }).done(function (a) {
            e = arguments, g.html(d ? m("<div>").append(m.parseHTML(a)).find(d) : a);
        }).complete(c && function (a, b) {
            g.each(c, e || [a.responseText, b, a]);
        }), this;
    }, m.expr.filters.animated = function (a) {
        return m.grep(m.timers, function (b) {
            return a === b.elem;
        }).length;
    };
    var cd = a.document.documentElement;

    function dd(a) {
        return m.isWindow(a) ? a : 9 === a.nodeType ? a.defaultView || a.parentWindow : !1;
    }

    m.offset = {
        setOffset: function (a, b, c) {
            var d, e, f, g, h, i, j, k = m.css(a, "position"), l = m(a), n = {};
            "static" === k && (a.style.position = "relative"), h = l.offset(), f = m.css(a, "top"), i = m.css(a, "left"), j = ("absolute" === k || "fixed" === k) && m.inArray("auto", [f, i]) > -1, j ? (d = l.position(), g = d.top, e = d.left) : (g = parseFloat(f) || 0, e = parseFloat(i) || 0), m.isFunction(b) && (b = b.call(a, c, h)), null != b.top && (n.top = b.top - h.top + g), null != b.left && (n.left = b.left - h.left + e), "using" in b ? b.using.call(a, n) : l.css(n);
        }
    }, m.fn.extend({
        offset: function (a) {
            if (arguments.length) {
                return void 0 === a ? this : this.each(function (b) {
                    m.offset.setOffset(this, a, b);
                });
            }
            var b, c, d = {top: 0, left: 0}, e = this[0], f = e && e.ownerDocument;
            if (f) {
                return b = f.documentElement, m.contains(b, e) ? (typeof e.getBoundingClientRect !== K && (d = e.getBoundingClientRect()), c = dd(f), {
                    top: d.top + (c.pageYOffset || b.scrollTop) - (b.clientTop || 0),
                    left: d.left + (c.pageXOffset || b.scrollLeft) - (b.clientLeft || 0)
                }) : d;
            }
        }, position: function () {
            if (this[0]) {
                var a, b, c = {top: 0, left: 0}, d = this[0];
                return "fixed" === m.css(d, "position") ? b = d.getBoundingClientRect() : (a = this.offsetParent(), b = this.offset(), m.nodeName(a[0], "html") || (c = a.offset()), c.top += m.css(a[0], "borderTopWidth", !0), c.left += m.css(a[0], "borderLeftWidth", !0)), {
                    top: b.top - c.top - m.css(d, "marginTop", !0),
                    left: b.left - c.left - m.css(d, "marginLeft", !0)
                };
            }
        }, offsetParent: function () {
            return this.map(function () {
                var a = this.offsetParent || cd;
                while (a && !m.nodeName(a, "html") && "static" === m.css(a, "position")) {
                    a = a.offsetParent;
                }
                return a || cd;
            });
        }
    }), m.each({scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function (a, b) {
        var c = /Y/.test(b);
        m.fn[a] = function (d) {
            return V(this, function (a, d, e) {
                var f = dd(a);
                return void 0 === e ? f ? b in f ? f[b] : f.document.documentElement[d] : a[d] : void (f ? f.scrollTo(c ? m(f).scrollLeft() : e, c ? e : m(f).scrollTop()) : a[d] = e);
            }, a, d, arguments.length, null);
        };
    }), m.each(["top", "left"], function (a, b) {
        m.cssHooks[b] = Lb(k.pixelPosition, function (a, c) {
            return c ? (c = Jb(a, b), Hb.test(c) ? m(a).position()[b] + "px" : c) : void 0;
        });
    }), m.each({Height: "height", Width: "width"}, function (a, b) {
        m.each({padding: "inner" + a, content: b, "": "outer" + a}, function (c, d) {
            m.fn[d] = function (d, e) {
                var f = arguments.length && (c || "boolean" != typeof d), g = c || (d === !0 || e === !0 ? "margin" : "border");
                return V(this, function (b, c, d) {
                    var e;
                    return m.isWindow(b) ? b.document.documentElement["client" + a] : 9 === b.nodeType ? (e = b.documentElement, Math.max(b.body["scroll" + a], e["scroll" + a], b.body["offset" + a], e["offset" + a], e["client" + a])) : void 0 === d ? m.css(b, c, g) : m.style(b, c, d, g);
                }, b, f ? d : void 0, f, null);
            };
        });
    }), m.fn.size = function () {
        return this.length;
    }, m.fn.andSelf = m.fn.addBack, "function" == typeof define && define.amd && define("jquery", [], function () {
        return m;
    });
    var ed = a.jQuery, fd = a.$;
    return m.noConflict = function (b) {
        return a.$ === m && (a.$ = fd), b && a.jQuery === m && (a.jQuery = ed), m;
    }, typeof b === K && (a.jQuery = a.$ = m), m;
});
var j_doksoft_file = jQuery.noConflict();
!function (bb, aT) {
    function a0(d, b) {
        for (var f, a = [], c = 0; c < d.length; ++c) {
            if (f = aU[d[c]] || aZ(d[c]), !f) {
                throw"module definition dependecy not found: " + d[c];
            }
            a.push(f);
        }
        b.apply(null, a);
    }

    function a6(c, a, b) {
        if ("string" != typeof c) {
            throw"invalid module definition, module id must be defined and be a string";
        }
        if (a === aT) {
            throw"invalid module definition, dependencies must be specified";
        }
        if (b === aT) {
            throw"invalid module definition, definition function must be specified";
        }
        a0(a, function () {
            aU[c] = b.apply(null, arguments);
        });
    }

    function aV(a) {
        return !!aU[a];
    }

    function aZ(b) {
        for (var d = bb, a = b.split(/[.\/]/), c = 0; c < a.length; ++c) {
            if (!d[a[c]]) {
                return;
            }
            d = d[a[c]];
        }
        return d;
    }

    function bf(g) {
        for (var d = 0; d < g.length; d++) {
            for (var e = bb, f = g[d], b = f.split(/[.\/]/), c = 0; c < b.length - 1; ++c) {
                e[b[c]] === aT && (e[b[c]] = {}), e = e[b[c]];
            }
            e[b[b.length - 1]] = aU[f];
        }
    }

    var aU = {}, aS = "moxie/core/utils/Basic", bd = "moxie/core/I18n", a2 = "moxie/core/utils/Mime", bc = "moxie/core/utils/Env", ba = "moxie/core/utils/Dom", a7 = "moxie/core/Exceptions", aY = "moxie/core/EventTarget", a1 = "moxie/core/utils/Encode", a8 = "moxie/runtime/Runtime", aR = "moxie/runtime/RuntimeClient", aO = "moxie/file/Blob", aQ = "moxie/file/File", aA = "moxie/file/FileInput", bg = "moxie/file/FileDrop", aP = "moxie/runtime/RuntimeTarget", be = "moxie/file/FileReader", aj = "moxie/core/utils/Url", ag = "moxie/file/FileReaderSync", aE = "moxie/xhr/FormData", ai = "moxie/xhr/XMLHttpRequest", an = "moxie/runtime/Transporter", av = "moxie/image/Image", aB = "moxie/runtime/html5/Runtime", ao = "moxie/runtime/html5/file/Blob", aq = "moxie/core/utils/Events", ap = "moxie/runtime/html5/file/FileInput", aC = "moxie/runtime/html5/file/FileDrop", az = "moxie/runtime/html5/file/FileReader", aw = "moxie/runtime/html5/xhr/XMLHttpRequest", am = "moxie/runtime/html5/utils/BinaryReader", a3 = "moxie/runtime/html5/image/JPEGHeaders", af = "moxie/runtime/html5/image/ExifParser", aD = "moxie/runtime/html5/image/JPEG", aN = "moxie/runtime/html5/image/PNG", ay = "moxie/runtime/html5/image/ImageInfo", aW = "moxie/runtime/html5/image/MegaPixel", ac = "moxie/runtime/html5/image/Image", a5 = "moxie/runtime/flash/Runtime", ae = "moxie/runtime/flash/file/Blob", ad = "moxie/runtime/flash/file/FileInput", ab = "moxie/runtime/flash/file/FileReader", aM = "moxie/runtime/flash/file/FileReaderSync", au = "moxie/runtime/flash/xhr/XMLHttpRequest", aa = "moxie/runtime/flash/runtime/Transporter", ar = "moxie/runtime/flash/image/Image", al = "moxie/runtime/silverlight/Runtime", aX = "moxie/runtime/silverlight/file/Blob", a9 = "moxie/runtime/silverlight/file/FileInput", a4 = "moxie/runtime/silverlight/file/FileDrop", aH = "moxie/runtime/silverlight/file/FileReader", aK = "moxie/runtime/silverlight/file/FileReaderSync", aJ = "moxie/runtime/silverlight/xhr/XMLHttpRequest", ah = "moxie/runtime/silverlight/runtime/Transporter", ax = "moxie/runtime/silverlight/image/Image", aL = "moxie/runtime/html4/Runtime", aF = "moxie/runtime/html4/file/FileInput", aI = "moxie/runtime/html4/file/FileReader", ak = "moxie/runtime/html4/xhr/XMLHttpRequest", aG = "moxie/runtime/html4/image/Image";
    a6(aS, [], function () {
        var p = function (c) {
            var a;
            return c === a ? "undefined" : null === c ? "null" : c.nodeType ? "node" : {}.toString.call(c).match(/\s([a-z|A-Z]+)/)[1].toLowerCase();
        }, y = function (a) {
            var c;
            return h(arguments, function (e, d) {
                d > 0 && h(e, function (i, f) {
                    i !== c && (p(a[f]) === p(i) && ~w(p(i), ["array", "object"]) ? y(a[f], i) : a[f] = i);
                });
            }), a;
        }, h = function (s, f) {
            var A, d, l, u;
            if (s) {
                try {
                    A = s.length;
                } catch (c) {
                    A = u;
                }
                if (A === u) {
                    for (d in s) {
                        if (s.hasOwnProperty(d) && f(s[d], d) === !1) {
                            return;
                        }
                    }
                } else {
                    for (l = 0; A > l; l++) {
                        if (f(s[l], l) === !1) {
                            return;
                        }
                    }
                }
            }
        }, k = function (a) {
            var c;
            if (!a || "object" !== p(a)) {
                return !0;
            }
            for (c in a) {
                return !1;
            }
            return !0;
        }, b = function (c, f) {
            function a(i) {
                "function" === p(c[i]) && c[i](function (l) {
                    ++i < e && !l ? a(i) : f(l);
                });
            }

            var d = 0, e = c.length;
            "function" !== p(f) && (f = function () {
            }), c && c.length || f(), a(d);
        }, g = function (f, c) {
            var a = 0, d = f.length, l = new Array(d);
            h(f, function (i, o) {
                i(function (r) {
                    if (r) {
                        return c(r);
                    }
                    var n = [].slice.call(arguments);
                    n.shift(), l[o] = n, a++, a === d && (l.unshift(null), c.apply(this, l));
                });
            });
        }, w = function (d, c) {
            if (c) {
                if (Array.prototype.indexOf) {
                    return Array.prototype.indexOf.call(c, d);
                }
                for (var f = 0, a = c.length; a > f; f++) {
                    if (c[f] === d) {
                        return f;
                    }
                }
            }
            return -1;
        }, z = function (c, e) {
            var a = [];
            "array" !== p(c) && (c = [c]), "array" !== p(e) && (e = [e]);
            for (var d in c) {
                -1 === w(c[d], e) && a.push(c[d]);
            }
            return a.length ? a : !1;
        }, x = function (d, c) {
            var a = [];
            return h(d, function (f) {
                -1 !== w(f, c) && a.push(f);
            }), a.length ? a : null;
        }, v = function (c) {
            var a, d = [];
            for (a = 0; a < c.length; a++) {
                d[a] = c[a];
            }
            return d;
        }, j = function () {
            var a = 0;
            return function (d) {
                var e = (new Date).getTime().toString(32), c;
                for (c = 0; 5 > c; c++) {
                    e += Math.floor(65535 * Math.random()).toString(32);
                }
                return (d || "o_") + e + (a++).toString(32);
            };
        }(), q = function (a) {
            return a ? String.prototype.trim ? String.prototype.trim.call(a) : a.toString().replace(/^\s*/, "").replace(/\s*$/, "") : a;
        }, m = function (c) {
            if ("string" != typeof c) {
                return c;
            }
            var a = {t: 1099511627776, g: 1073741824, m: 1048576, k: 1024}, d;
            return c = /^([0-9]+)([mgk]?)$/.exec(c.toLowerCase().replace(/[^0-9mkg]/g, "")), d = c[2], c = +c[1], a.hasOwnProperty(d) && (c *= a[d]), c;
        };
        return {
            guid: j,
            typeOf: p,
            extend: y,
            each: h,
            isEmptyObj: k,
            inSeries: b,
            inParallel: g,
            inArray: w,
            arrayDiff: z,
            arrayIntersect: x,
            toArray: v,
            trim: q,
            parseSizeStr: m
        };
    }), a6(bd, [aS], function (b) {
        var a = {};
        return {
            addI18n: function (c) {
                return b.extend(a, c);
            }, translate: function (c) {
                return a[c] || c;
            }, _: function (c) {
                return this.translate(c);
            }, sprintf: function (c) {
                var d = [].slice.call(arguments, 1);
                return c.replace(/%[a-z]/g, function () {
                    var e = d.shift();
                    return "undefined" !== b.typeOf(e) ? e : "";
                });
            }
        };
    }), a6(a2, [aS, bd], function (c, b) {
        var d = "application/msword,doc dot,application/pdf,pdf,application/pgp-signature,pgp,application/postscript,ps ai eps,application/rtf,rtf,application/vnd.ms-excel,xls xlb,application/vnd.ms-powerpoint,ppt pps pot,application/zip,zip,application/x-shockwave-flash,swf swfl,application/vnd.openxmlformats-officedocument.wordprocessingml.document,docx,application/vnd.openxmlformats-officedocument.wordprocessingml.template,dotx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,xlsx,application/vnd.openxmlformats-officedocument.presentationml.presentation,pptx,application/vnd.openxmlformats-officedocument.presentationml.template,potx,application/vnd.openxmlformats-officedocument.presentationml.slideshow,ppsx,application/x-javascript,js,application/json,json,audio/mpeg,mp3 mpga mpega mp2,audio/x-wav,wav,audio/x-m4a,m4a,audio/ogg,oga ogg,audio/aiff,aiff aif,audio/flac,flac,audio/aac,aac,audio/ac3,ac3,audio/x-ms-wma,wma,image/bmp,bmp,image/gif,gif,image/jpeg,jpg jpeg jpe,image/photoshop,psd,image/png,png,image/svg+xml,svg svgz,image/tiff,tiff tif,text/plain,asc txt text diff log,text/html,htm html xhtml,text/css,css,text/csv,csv,text/rtf,rtf,video/mpeg,mpeg mpg mpe m2v,video/quicktime,qt mov,video/mp4,mp4,video/x-m4v,m4v,video/x-flv,flv,video/x-ms-wmv,wmv,video/avi,avi,video/webm,webm,video/3gpp,3gpp 3gp,video/3gpp2,3g2,video/vnd.rn-realvideo,rv,video/ogg,ogv,video/x-matroska,mkv,application/vnd.oasis.opendocument.formula-template,otf,application/octet-stream,exe", a = {
            mimes: {}, extensions: {}, addMimeType: function (j) {
                var g = j.split(/,/), k, f, h;
                for (k = 0; k < g.length; k += 2) {
                    for (h = g[k + 1].split(/ /), f = 0; f < h.length; f++) {
                        this.mimes[h[f]] = g[k];
                    }
                    this.extensions[g[k]] = h;
                }
            }, extList2mimes: function (h, m) {
                var g = this, k, l, e, j, f = [];
                for (l = 0; l < h.length; l++) {
                    for (k = h[l].extensions.split(/\s*,\s*/), e = 0; e < k.length; e++) {
                        if ("*" === k[e]) {
                            return [];
                        }
                        if (j = g.mimes[k[e]]) {
                            -1 === c.inArray(j, f) && f.push(j);
                        } else {
                            if (!m || !/^\w+$/.test(k[e])) {
                                return [];
                            }
                            f.push("." + k[e]);
                        }
                    }
                }
                return f;
            }, mimes2exts: function (f) {
                var g = this, e = [];
                return c.each(f, function (h) {
                    if ("*" === h) {
                        return e = [], !1;
                    }
                    var i = h.match(/^(\w+)\/(\*|\w+)$/);
                    i && ("*" === i[2] ? c.each(g.extensions, function (k, j) {
                        new RegExp("^" + i[1] + "/").test(j) && [].push.apply(e, g.extensions[j]);
                    }) : g.extensions[h] && [].push.apply(e, g.extensions[h]));
                }), e;
            }, mimes2extList: function (g) {
                var e = [], f = [];
                return "string" === c.typeOf(g) && (g = c.trim(g).split(/\s*,\s*/)), f = this.mimes2exts(g), e.push({
                    title: b.translate("Files"),
                    extensions: f.length ? f.join(",") : "*"
                }), e.mimes = g, e;
            }, getFileExtension: function (g) {
                var f = g && g.match(/\.([^.]+)$/);
                return f ? f[1].toLowerCase() : "";
            }, getFileMime: function (f) {
                return this.mimes[this.getFileExtension(f)] || "";
            }
        };
        return a.addMimeType(d), a;
    }), a6(bc, [aS], function (d) {
        function b(l, q, j) {
            var k = 0, g = 0, h = 0, m = {
                dev: -6,
                alpha: -5,
                a: -5,
                beta: -4,
                b: -4,
                RC: -3,
                rc: -3,
                "#": -2,
                p: 1,
                pl: 1
            }, v = function (i) {
                return i = ("" + i).replace(/[_\-+]/g, "."), i = i.replace(/([^.\d]+)/g, ".$1.").replace(/\.{2,}/g, "."), i.length ? i.split(".") : [-8];
            }, p = function (i) {
                return i ? isNaN(i) ? m[i] || -7 : parseInt(i, 10) : 0;
            };
            for (l = v(l), q = v(q), g = Math.max(l.length, q.length), k = 0; g > k; k++) {
                if (l[k] != q[k]) {
                    if (l[k] = p(l[k]), q[k] = p(q[k]), l[k] < q[k]) {
                        h = -1;
                        break;
                    }
                    if (l[k] > q[k]) {
                        h = 1;
                        break;
                    }
                }
            }
            if (!j) {
                return h;
            }
            switch (j) {
                case">":
                case"gt":
                    return h > 0;
                case">=":
                case"ge":
                    return h >= 0;
                case"<=":
                case"le":
                    return 0 >= h;
                case"==":
                case"=":
                case"eq":
                    return 0 === h;
                case"<>":
                case"!=":
                case"ne":
                    return 0 !== h;
                case"":
                case"<":
                case"lt":
                    return 0 > h;
                default:
                    return null;
            }
        }

        var f = function (N) {
            var A = "", G = "?", J = "function", C = "undefined", F = "object", Q = "major", B = "model", x = "name", P = "type", I = "vendor", O = "version", M = "architecture", K = "console", D = "mobile", H = "tablet", L = {
                has: function (h, g) {
                    return -1 !== g.toLowerCase().indexOf(h.toLowerCase());
                }, lowerize: function (g) {
                    return g.toLowerCase();
                }
            }, q = {
                rgx: function () {
                    for (var E, g = 0, w, R, y, v, i, r, o = arguments; g < o.length; g += 2) {
                        var m = o[g], e = o[g + 1];
                        if (typeof E === C) {
                            E = {};
                            for (y in e) {
                                v = e[y], typeof v === F ? E[v[0]] = N : E[v] = N;
                            }
                        }
                        for (w = R = 0; w < m.length; w++) {
                            if (i = m[w].exec(this.getUA())) {
                                for (y = 0; y < e.length; y++) {
                                    r = i[++R], v = e[y], typeof v === F && v.length > 0 ? 2 == v.length ? E[v[0]] = typeof v[1] == J ? v[1].call(this, r) : v[1] : 3 == v.length ? E[v[0]] = typeof v[1] !== J || v[1].exec && v[1].test ? r ? r.replace(v[1], v[2]) : N : r ? v[1].call(this, r, v[2]) : N : 4 == v.length && (E[v[0]] = r ? v[3].call(this, r.replace(v[1], v[2])) : N) : E[v] = r ? r : N;
                                }
                                break;
                            }
                        }
                        if (i) {
                            break;
                        }
                    }
                    return E;
                }, str: function (h, g) {
                    for (var l in g) {
                        if (typeof g[l] === F && g[l].length > 0) {
                            for (var e = 0; e < g[l].length; e++) {
                                if (L.has(g[l][e], h)) {
                                    return l === G ? N : l;
                                }
                            }
                        } else {
                            if (L.has(g[l], h)) {
                                return l === G ? N : l;
                            }
                        }
                    }
                    return h;
                }
            }, j = {
                browser: {
                    oldsafari: {
                        major: {1: ["/8", "/1", "/3"], 2: "/4", "?": "/"},
                        version: {
                            "1.0": "/8",
                            1.2: "/1",
                            1.3: "/3",
                            "2.0": "/412",
                            "2.0.2": "/416",
                            "2.0.3": "/417",
                            "2.0.4": "/419",
                            "?": "/"
                        }
                    }
                },
                device: {sprint: {model: {"Evo Shift 4G": "7373KT"}, vendor: {HTC: "APA", Sprint: "Sprint"}}},
                os: {
                    windows: {
                        version: {
                            ME: "4.90",
                            "NT 3.11": "NT3.51",
                            "NT 4.0": "NT4.0",
                            2000: "NT 5.0",
                            XP: ["NT 5.1", "NT 5.2"],
                            Vista: "NT 6.0",
                            7: "NT 6.1",
                            8: "NT 6.2",
                            8.1: "NT 6.3",
                            RT: "ARM"
                        }
                    }
                }
            }, k = {
                browser: [[/(opera\smini)\/((\d+)?[\w\.-]+)/i, /(opera\s[mobiletab]+).+version\/((\d+)?[\w\.-]+)/i, /(opera).+version\/((\d+)?[\w\.]+)/i, /(opera)[\/\s]+((\d+)?[\w\.]+)/i], [x, O, Q], [/\s(opr)\/((\d+)?[\w\.]+)/i], [[x, "Opera"], O, Q], [/(kindle)\/((\d+)?[\w\.]+)/i, /(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?((\d+)?[\w\.]+)*/i, /(avant\s|iemobile|slim|baidu)(?:browser)?[\/\s]?((\d+)?[\w\.]*)/i, /(?:ms|\()(ie)\s((\d+)?[\w\.]+)/i, /(rekonq)((?:\/)[\w\.]+)*/i, /(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron)\/((\d+)?[\w\.-]+)/i], [x, O, Q], [/(trident).+rv[:\s]((\d+)?[\w\.]+).+like\sgecko/i], [[x, "IE"], O, Q], [/(yabrowser)\/((\d+)?[\w\.]+)/i], [[x, "Yandex"], O, Q], [/(comodo_dragon)\/((\d+)?[\w\.]+)/i], [[x, /_/g, " "], O, Q], [/(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?((\d+)?[\w\.]+)/i], [x, O, Q], [/(dolfin)\/((\d+)?[\w\.]+)/i], [[x, "Dolphin"], O, Q], [/((?:android.+)crmo|crios)\/((\d+)?[\w\.]+)/i], [[x, "Chrome"], O, Q], [/((?:android.+))version\/((\d+)?[\w\.]+)\smobile\ssafari/i], [[x, "Android Browser"], O, Q], [/version\/((\d+)?[\w\.]+).+?mobile\/\w+\s(safari)/i], [O, Q, [x, "Mobile Safari"]], [/version\/((\d+)?[\w\.]+).+?(mobile\s?safari|safari)/i], [O, Q, x], [/webkit.+?(mobile\s?safari|safari)((\/[\w\.]+))/i], [x, [Q, q.str, j.browser.oldsafari.major], [O, q.str, j.browser.oldsafari.version]], [/(konqueror)\/((\d+)?[\w\.]+)/i, /(webkit|khtml)\/((\d+)?[\w\.]+)/i], [x, O, Q], [/(navigator|netscape)\/((\d+)?[\w\.-]+)/i], [[x, "Netscape"], O, Q], [/(swiftfox)/i, /(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?((\d+)?[\w\.\+]+)/i, /(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix)\/((\d+)?[\w\.-]+)/i, /(mozilla)\/((\d+)?[\w\.]+).+rv\:.+gecko\/\d+/i, /(uc\s?browser|polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|qqbrowser)[\/\s]?((\d+)?[\w\.]+)/i, /(links)\s\(((\d+)?[\w\.]+)/i, /(gobrowser)\/?((\d+)?[\w\.]+)*/i, /(ice\s?browser)\/v?((\d+)?[\w\._]+)/i, /(mosaic)[\/\s]((\d+)?[\w\.]+)/i], [x, O, Q]],
                engine: [[/(presto)\/([\w\.]+)/i, /(webkit|trident|netfront|netsurf|amaya|lynx|w3m)\/([\w\.]+)/i, /(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i, /(icab)[\/\s]([23]\.[\d\.]+)/i], [x, O], [/rv\:([\w\.]+).*(gecko)/i], [O, x]],
                os: [[/(windows)\snt\s6\.2;\s(arm)/i, /(windows\sphone(?:\sos)*|windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i], [x, [O, q.str, j.os.windows.version]], [/(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i], [[x, "Windows"], [O, q.str, j.os.windows.version]], [/\((bb)(10);/i], [[x, "BlackBerry"], O], [/(blackberry)\w*\/?([\w\.]+)*/i, /(tizen)\/([\w\.]+)/i, /(android|webos|palm\os|qnx|bada|rim\stablet\sos|meego)[\/\s-]?([\w\.]+)*/i], [x, O], [/(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]+)*/i], [[x, "Symbian"], O], [/mozilla.+\(mobile;.+gecko.+firefox/i], [[x, "Firefox OS"], O], [/(nintendo|playstation)\s([wids3portablevu]+)/i, /(mint)[\/\s\(]?(\w+)*/i, /(joli|[kxln]?ubuntu|debian|[open]*suse|gentoo|arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk)[\/\s-]?([\w\.-]+)*/i, /(hurd|linux)\s?([\w\.]+)*/i, /(gnu)\s?([\w\.]+)*/i], [x, O], [/(cros)\s[\w]+\s([\w\.]+\w)/i], [[x, "Chromium OS"], O], [/(sunos)\s?([\w\.]+\d)*/i], [[x, "Solaris"], O], [/\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]+)*/i], [x, O], [/(ip[honead]+)(?:.*os\s*([\w]+)*\slike\smac|;\sopera)/i], [[x, "iOS"], [O, /_/g, "."]], [/(mac\sos\sx)\s?([\w\s\.]+\w)*/i], [x, [O, /_/g, "."]], [/(haiku)\s(\w+)/i, /(aix)\s((\d)(?=\.|\)|\s)[\w\.]*)*/i, /(macintosh|mac(?=_powerpc)|plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos)/i, /(unix)\s?([\w\.]+)*/i], [x, O]]
            }, z = function (g) {
                var h = g || (window && window.navigator && window.navigator.userAgent ? window.navigator.userAgent : A);
                this.getBrowser = function () {
                    return q.rgx.apply(this, k.browser);
                }, this.getEngine = function () {
                    return q.rgx.apply(this, k.engine);
                }, this.getOS = function () {
                    return q.rgx.apply(this, k.os);
                }, this.getResult = function () {
                    return {ua: this.getUA(), browser: this.getBrowser(), engine: this.getEngine(), os: this.getOS()};
                }, this.getUA = function () {
                    return h;
                }, this.setUA = function (i) {
                    return h = i, this;
                }, this.setUA(h);
            };
            return (new z).getResult();
        }(), a = function () {
            var e = {
                define_property: function () {
                    return !1;
                }(), create_canvas: function () {
                    var g = document.createElement("canvas");
                    return !(!g.getContext || !g.getContext("2d"));
                }(), return_response_type: function (h) {
                    try {
                        if (-1 !== d.inArray(h, ["", "text", "document"])) {
                            return !0;
                        }
                        if (window.XMLHttpRequest) {
                            var j = new XMLHttpRequest;
                            if (j.open("get", "/"), "responseType" in j) {
                                return j.responseType = h, j.responseType !== h ? !1 : !0;
                            }
                        }
                    } catch (g) {
                    }
                    return !1;
                }, use_data_uri: function () {
                    var g = new Image;
                    return g.onload = function () {
                        e.use_data_uri = 1 === g.width && 1 === g.height;
                    }, setTimeout(function () {
                        g.src = "data:image/gif;base64,R0lGODlhAQABAIAAAP8AAAAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";
                    }, 1), !1;
                }(), use_data_uri_over32kb: function () {
                    return e.use_data_uri && ("IE" !== c.browser || c.version >= 9);
                }, use_data_uri_of: function (g) {
                    return e.use_data_uri && 33000 > g || e.use_data_uri_over32kb();
                }, use_fileinput: function () {
                    var g = document.createElement("input");
                    return g.setAttribute("type", "file"), !g.disabled;
                }
            };
            return function (h) {
                var g = [].slice.call(arguments);
                return g.shift(), "function" === d.typeOf(e[h]) ? e[h].apply(this, g) : !!e[h];
            };
        }(), c = {
            can: a,
            browser: f.browser.name,
            version: parseFloat(f.browser.major),
            os: f.os.name,
            osVersion: f.os.version,
            verComp: b,
            swf_url: "../flash/Moxie.swf",
            xap_url: "../silverlight/Moxie.xap",
            global_event_dispatcher: "moxie.core.EventTarget.instance.dispatchEvent"
        };
        return c.OS = c.os, c;
    }), a6(ba, [bc], function (h) {
        var d = function (a) {
            return "string" != typeof a ? a : document.getElementById(a);
        }, k = function (i, a) {
            if (!i.className) {
                return !1;
            }
            var l = new RegExp("(^|\\s+)" + a + "(\\s+|$)");
            return l.test(i.className);
        }, c = function (i, a) {
            k(i, a) || (i.className = i.className ? i.className.replace(/\s+$/, "") + " " + a : a);
        }, g = function (i, a) {
            if (i.className) {
                var l = new RegExp("(^|\\s+)" + a + "(\\s+|$)");
                i.className = i.className.replace(l, function (o, m, p) {
                    return " " === m && " " === p ? " " : "";
                });
            }
        }, j = function (i, a) {
            return i.currentStyle ? i.currentStyle[a] : window.getComputedStyle ? window.getComputedStyle(i, null)[a] : void 0;
        }, b = function (x, m) {
            function p(u) {
                var o, z, a = 0, s = 0;
                return u && (z = u.getBoundingClientRect(), o = "CSS1Compat" === y.compatMode ? y.documentElement : y.body, a = z.left + o.scrollLeft, s = z.top + o.scrollTop), {
                    x: a,
                    y: s
                };
            }

            var e = 0, l = 0, v, y = document, w, q;
            if (x = x, m = m || y.body, x && x.getBoundingClientRect && "IE" === h.browser && (!y.documentMode || y.documentMode < 8)) {
                return w = p(x), q = p(m), {x: w.x - q.x, y: w.y - q.y};
            }
            for (v = x; v && v != m && v.nodeType;) {
                e += v.offsetLeft || 0, l += v.offsetTop || 0, v = v.offsetParent;
            }
            for (v = x.parentNode; v && v != m && v.nodeType;) {
                e -= v.scrollLeft || 0, l -= v.scrollTop || 0, v = v.parentNode;
            }
            return {x: e, y: l};
        }, f = function (a) {
            return {w: a.offsetWidth || a.clientWidth, h: a.offsetHeight || a.clientHeight};
        };
        return {get: d, hasClass: k, addClass: c, removeClass: g, getStyle: j, getPos: b, getSize: f};
    }), a6(a7, [aS], function (b) {
        function a(d, c) {
            var f;
            for (f in d) {
                if (d[f] === c) {
                    return f;
                }
            }
            return null;
        }

        return {
            RuntimeError: function () {
                function d(f) {
                    this.code = f, this.name = a(c, f), this.message = this.name + ": RuntimeError " + this.code;
                }

                var c = {NOT_INIT_ERR: 1, NOT_SUPPORTED_ERR: 9, JS_ERR: 4};
                return b.extend(d, c), d.prototype = Error.prototype, d;
            }(), OperationNotAllowedException: function () {
                function c(d) {
                    this.code = d, this.name = "OperationNotAllowedException";
                }

                return b.extend(c, {NOT_ALLOWED_ERR: 1}), c.prototype = Error.prototype, c;
            }(), ImageError: function () {
                function d(f) {
                    this.code = f, this.name = a(c, f), this.message = this.name + ": ImageError " + this.code;
                }

                var c = {WRONG_FORMAT: 1, MAX_RESOLUTION_ERR: 2};
                return b.extend(d, c), d.prototype = Error.prototype, d;
            }(), FileException: function () {
                function d(f) {
                    this.code = f, this.name = a(c, f), this.message = this.name + ": FileException " + this.code;
                }

                var c = {
                    NOT_FOUND_ERR: 1,
                    SECURITY_ERR: 2,
                    ABORT_ERR: 3,
                    NOT_READABLE_ERR: 4,
                    ENCODING_ERR: 5,
                    NO_MODIFICATION_ALLOWED_ERR: 6,
                    INVALID_STATE_ERR: 7,
                    SYNTAX_ERR: 8
                };
                return b.extend(d, c), d.prototype = Error.prototype, d;
            }(), DOMException: function () {
                function d(f) {
                    this.code = f, this.name = a(c, f), this.message = this.name + ": DOMException " + this.code;
                }

                var c = {
                    INDEX_SIZE_ERR: 1,
                    DOMSTRING_SIZE_ERR: 2,
                    HIERARCHY_REQUEST_ERR: 3,
                    WRONG_DOCUMENT_ERR: 4,
                    INVALID_CHARACTER_ERR: 5,
                    NO_DATA_ALLOWED_ERR: 6,
                    NO_MODIFICATION_ALLOWED_ERR: 7,
                    NOT_FOUND_ERR: 8,
                    NOT_SUPPORTED_ERR: 9,
                    INUSE_ATTRIBUTE_ERR: 10,
                    INVALID_STATE_ERR: 11,
                    SYNTAX_ERR: 12,
                    INVALID_MODIFICATION_ERR: 13,
                    NAMESPACE_ERR: 14,
                    INVALID_ACCESS_ERR: 15,
                    VALIDATION_ERR: 16,
                    TYPE_MISMATCH_ERR: 17,
                    SECURITY_ERR: 18,
                    NETWORK_ERR: 19,
                    ABORT_ERR: 20,
                    URL_MISMATCH_ERR: 21,
                    QUOTA_EXCEEDED_ERR: 22,
                    TIMEOUT_ERR: 23,
                    INVALID_NODE_TYPE_ERR: 24,
                    DATA_CLONE_ERR: 25
                };
                return b.extend(d, c), d.prototype = Error.prototype, d;
            }(), EventException: function () {
                function c(d) {
                    this.code = d, this.name = "EventException";
                }

                return b.extend(c, {UNSPECIFIED_EVENT_TYPE_ERR: 0}), c.prototype = Error.prototype, c;
            }()
        };
    }), a6(aY, [a7, aS], function (b, a) {
        function c() {
            var d = {};
            a.extend(this, {
                uid: null, init: function () {
                    this.uid || (this.uid = a.guid("uid_"));
                }, addEventListener: function (k, g, j, l) {
                    var f = this, h;
                    return k = a.trim(k), /\s/.test(k) ? void a.each(k.split(/\s+/), function (i) {
                        f.addEventListener(i, g, j, l);
                    }) : (k = k.toLowerCase(), j = parseInt(j, 10) || 0, h = d[this.uid] && d[this.uid][k] || [], h.push({
                        fn: g,
                        priority: j,
                        scope: l || this
                    }), d[this.uid] || (d[this.uid] = {}), void (d[this.uid][k] = h));
                }, hasEventListener: function (f) {
                    return f ? !(!d[this.uid] || !d[this.uid][f]) : !!d[this.uid];
                }, removeEventListener: function (h, f) {
                    h = h.toLowerCase();
                    var g = d[this.uid] && d[this.uid][h], j;
                    if (g) {
                        if (f) {
                            for (j = g.length - 1; j >= 0; j--) {
                                if (g[j].fn === f) {
                                    g.splice(j, 1);
                                    break;
                                }
                            }
                        } else {
                            g = [];
                        }
                        g.length || (delete d[this.uid][h], a.isEmptyObj(d[this.uid]) && delete d[this.uid]);
                    }
                }, removeAllEventListeners: function () {
                    d[this.uid] && delete d[this.uid];
                }, dispatchEvent: function (h) {
                    var e, f, m, p, n = {}, k = !0, g;
                    if ("string" !== a.typeOf(h)) {
                        if (p = h, "string" !== a.typeOf(p.type)) {
                            throw new b.EventException(b.EventException.UNSPECIFIED_EVENT_TYPE_ERR);
                        }
                        h = p.type, p.total !== g && p.loaded !== g && (n.total = p.total, n.loaded = p.loaded), n.async = p.async || !1;
                    }
                    if (-1 !== h.indexOf("::") ? !function (i) {
                            e = i[0], h = i[1];
                        }(h.split("::")) : e = this.uid, h = h.toLowerCase(), f = d[e] && d[e][h]) {
                        f.sort(function (l, i) {
                            return i.priority - l.priority;
                        }), m = [].slice.call(arguments), m.shift(), n.type = h, m.unshift(n);
                        var j = [];
                        a.each(f, function (i) {
                            m[0].target = i.scope, j.push(n.async ? function (l) {
                                setTimeout(function () {
                                    l(i.fn.apply(i.scope, m) === !1);
                                }, 1);
                            } : function (l) {
                                l(i.fn.apply(i.scope, m) === !1);
                            });
                        }), j.length && a.inSeries(j, function (i) {
                            k = !i;
                        });
                    }
                    return k;
                }, bind: function () {
                    this.addEventListener.apply(this, arguments);
                }, unbind: function () {
                    this.removeEventListener.apply(this, arguments);
                }, unbindAll: function () {
                    this.removeAllEventListeners.apply(this, arguments);
                }, trigger: function () {
                    return this.dispatchEvent.apply(this, arguments);
                }, convertEventPropsToHandlers: function (g) {
                    var h;
                    "array" !== a.typeOf(g) && (g = [g]);
                    for (var f = 0; f < g.length; f++) {
                        h = "on" + g[f], "function" === a.typeOf(this[h]) ? this.addEventListener(g[f], this[h]) : "undefined" === a.typeOf(this[h]) && (this[h] = null);
                    }
                }
            });
        }

        return c.instance = new c, c;
    }), a6(a1, [], function () {
        var c = function (f) {
            return unescape(encodeURIComponent(f));
        }, b = function (f) {
            return decodeURIComponent(escape(f));
        }, d = function (z, q) {
            if ("function" == typeof window.atob) {
                return q ? b(window.atob(z)) : window.atob(z);
            }
            var w = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", g, k, C, E, D, B, v, A, y = 0, x = 0, j = "", t = [];
            if (!z) {
                return z;
            }
            z += "";
            do {
                E = w.indexOf(z.charAt(y++)), D = w.indexOf(z.charAt(y++)), B = w.indexOf(z.charAt(y++)), v = w.indexOf(z.charAt(y++)), A = E << 18 | D << 12 | B << 6 | v, g = A >> 16 & 255, k = A >> 8 & 255, C = 255 & A, t[x++] = 64 == B ? String.fromCharCode(g) : 64 == v ? String.fromCharCode(g, k) : String.fromCharCode(g, k, C);
            } while (y < z.length);
            return j = t.join(""), q ? b(j) : j;
        }, a = function (F, q) {
            if (q && c(F), "function" == typeof window.btoa) {
                return window.btoa(F);
            }
            var x = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", e, k, D, G, E, C, w, B, A = 0, y = 0, j = "", v = [];
            if (!F) {
                return F;
            }
            do {
                e = F.charCodeAt(A++), k = F.charCodeAt(A++), D = F.charCodeAt(A++), B = e << 16 | k << 8 | D, G = B >> 18 & 63, E = B >> 12 & 63, C = B >> 6 & 63, w = 63 & B, v[y++] = x.charAt(G) + x.charAt(E) + x.charAt(C) + x.charAt(w);
            } while (A < F.length);
            j = v.join("");
            var z = F.length % 3;
            return (z ? j.slice(0, z - 3) : j) + "===".slice(z || 3);
        };
        return {utf8_encode: c, utf8_decode: b, atob: d, btoa: a};
    }), a6(a8, [aS, ba, aY], function (d, b, g) {
        function a(h, e, o, q, p) {
            var m = this, i, k = d.guid(e + "_"), j = p || "browser";
            h = h || {}, f[k] = this, o = d.extend({
                access_binary: !1,
                access_image_binary: !1,
                display_media: !1,
                do_cors: !1,
                drag_and_drop: !1,
                filter_by_extension: !0,
                resize_image: !1,
                report_upload_progress: !1,
                return_response_headers: !1,
                return_response_type: !1,
                return_status_code: !0,
                send_custom_headers: !1,
                select_file: !1,
                select_folder: !1,
                select_multiple: !0,
                send_binary_string: !1,
                send_browser_cookies: !0,
                send_multipart: !0,
                slice_blob: !1,
                stream_upload: !1,
                summon_file_dialog: !1,
                upload_filesize: !0,
                use_http_method: !0
            }, o), h.preferred_caps && (j = a.getMode(q, h.preferred_caps, j)), i = function () {
                var l = {};
                return {
                    exec: function (u, v, s, t) {
                        return i[v] && (l[u] || (l[u] = {
                            context: this,
                            instance: new i[v]
                        }), l[u].instance[s]) ? l[u].instance[s].apply(this, t) : void 0;
                    }, removeInstance: function (n) {
                        delete l[n];
                    }, removeAllInstances: function () {
                        var r = this;
                        d.each(l, function (s, n) {
                            "function" === d.typeOf(s.instance.destroy) && s.instance.destroy.call(s.context), r.removeInstance(n);
                        });
                    }
                };
            }(), d.extend(this, {
                initialized: !1,
                uid: k,
                type: e,
                mode: a.getMode(q, h.required_caps, j),
                shimid: k + "_container",
                clients: 0,
                options: h,
                can: function (l, v) {
                    var s = arguments[2] || o;
                    if ("string" === d.typeOf(l) && "undefined" === d.typeOf(v) && (l = a.parseCaps(l)), "object" === d.typeOf(l)) {
                        for (var u in l) {
                            if (!this.can(u, l[u], s)) {
                                return !1;
                            }
                        }
                        return !0;
                    }
                    return "function" === d.typeOf(s[l]) ? s[l].call(this, v) : v === s[l];
                },
                getShimContainer: function () {
                    var r, l = b.get(this.shimid);
                    return l || (r = this.options.container ? b.get(this.options.container) : document.body, l = document.createElement("div"), l.id = this.shimid, l.className = "moxie-shim moxie-shim-" + this.type, d.extend(l.style, {
                        position: "absolute",
                        top: "0px",
                        left: "0px",
                        width: "1px",
                        height: "1px",
                        overflow: "hidden"
                    }), r.appendChild(l), r = null), l;
                },
                getShim: function () {
                    return i;
                },
                shimExec: function (r, l) {
                    var s = [].slice.call(arguments, 2);
                    return m.getShim().exec.call(this, this.uid, r, l, s);
                },
                exec: function (r, l) {
                    var s = [].slice.call(arguments, 2);
                    return m[r] && m[r][l] ? m[r][l].apply(this, s) : m.shimExec.apply(this, arguments);
                },
                destroy: function () {
                    if (m) {
                        var l = b.get(this.shimid);
                        l && l.parentNode.removeChild(l), i && i.removeAllInstances(), this.unbindAll(), delete f[this.uid], this.uid = null, k = m = i = l = null;
                    }
                }
            }), this.mode && h.required_caps && !this.can(h.required_caps) && (this.mode = !1);
        }

        var c = {}, f = {};
        return a.order = "html5,flash,silverlight,html4", a.getRuntime = function (h) {
            return f[h] ? f[h] : !1;
        }, a.addConstructor = function (i, h) {
            h.prototype = g.instance, c[i] = h;
        }, a.getConstructor = function (h) {
            return c[h] || null;
        }, a.getInfo = function (i) {
            var h = a.getRuntime(i);
            return h ? {
                uid: h.uid, type: h.type, mode: h.mode, can: function () {
                    return h.can.apply(h, arguments);
                }
            } : null;
        }, a.parseCaps = function (e) {
            var h = {};
            return "string" !== d.typeOf(e) ? e || {} : (d.each(e.split(","), function (i) {
                h[i] = !0;
            }), h);
        }, a.can = function (j, h) {
            var l, i = a.getConstructor(j), k;
            return i ? (l = new i({required_caps: h}), k = l.mode, l.destroy(), !!k) : !1;
        }, a.thatCan = function (j, h) {
            var k = (h || a.order).split(/\s*,\s*/);
            for (var i in k) {
                if (a.can(k[i], j)) {
                    return k[i];
                }
            }
            return null;
        }, a.getMode = function (h, k, e) {
            var j = null;
            if ("undefined" === d.typeOf(e) && (e = "browser"), k && !d.isEmptyObj(h)) {
                if (d.each(k, function (p, l) {
                        if (h.hasOwnProperty(l)) {
                            var m = h[l](p);
                            if ("string" == typeof m && (m = [m]), j) {
                                if (!(j = d.arrayIntersect(j, m))) {
                                    return j = !1;
                                }
                            } else {
                                j = m;
                            }
                        }
                    }), j) {
                    return -1 !== d.inArray(e, j) ? e : j[0];
                }
                if (j === !1) {
                    return !1;
                }
            }
            return e;
        }, a.capTrue = function () {
            return !0;
        }, a.capFalse = function () {
            return !1;
        }, a.capTest = function (h) {
            return function () {
                return !!h;
            };
        }, a;
    }), a6(aR, [a7, aS, a8], function (c, b, d) {
        return function a() {
            var e;
            b.extend(this, {
                connectRuntime: function (h) {
                    function i(k) {
                        var l, j;
                        return k.length ? (l = k.shift(), (j = d.getConstructor(l)) ? (e = new j(h), e.bind("Init", function () {
                            e.initialized = !0, setTimeout(function () {
                                e.clients++, f.trigger("RuntimeInit", e);
                            }, 1);
                        }), e.bind("Error", function () {
                            e.destroy(), i(k);
                        }), e.mode ? void e.init() : void e.trigger("Error")) : void i(k)) : (f.trigger("RuntimeError", new c.RuntimeError(c.RuntimeError.NOT_INIT_ERR)), void (e = null));
                    }

                    var f = this, g;
                    if ("string" === b.typeOf(h) ? g = h : "string" === b.typeOf(h.ruid) && (g = h.ruid), g) {
                        if (e = d.getRuntime(g)) {
                            return e.clients++, e;
                        }
                        throw new c.RuntimeError(c.RuntimeError.NOT_INIT_ERR);
                    }
                    i((h.runtime_order || d.order).split(/\s*,\s*/));
                }, getRuntime: function () {
                    return e && e.uid ? e : (e = null, null);
                }, disconnectRuntime: function () {
                    e && --e.clients <= 0 && (e.destroy(), e = null);
                }
            });
        };
    }), a6(aO, [aS, a1, aR], function (d, b, f) {
        function a(h, e) {
            function g(j, m, l) {
                var i, k = c[this.uid];
                return "string" === d.typeOf(k) && k.length ? (i = new a(null, {
                    type: l,
                    size: m - j
                }), i.detach(k.substr(j, i.size)), i) : null;
            }

            f.call(this), h && this.connectRuntime(h), e ? "string" === d.typeOf(e) && (e = {data: e}) : e = {}, d.extend(this, {
                uid: e.uid || d.guid("uid_"),
                ruid: h,
                size: e.size || 0,
                type: e.type || "",
                slice: function (j, i, k) {
                    return this.isDetached() ? g.apply(this, arguments) : this.getRuntime().exec.call(this, "Blob", "slice", this.getSource(), j, i, k);
                },
                getSource: function () {
                    return c[this.uid] ? c[this.uid] : null;
                },
                detach: function (i) {
                    this.ruid && (this.getRuntime().exec.call(this, "Blob", "destroy"), this.disconnectRuntime(), this.ruid = null), i = i || "";
                    var j = i.match(/^data:([^;]*);base64,/);
                    j && (this.type = j[1], i = b.atob(i.substring(i.indexOf("base64,") + 7))), this.size = i.length, c[this.uid] = i;
                },
                isDetached: function () {
                    return !this.ruid && "string" === d.typeOf(c[this.uid]);
                },
                destroy: function () {
                    this.detach(), delete c[this.uid];
                }
            }), e.data ? this.detach(e.data) : c[this.uid] = e;
        }

        var c = {};
        return a;
    }), a6(aQ, [aS, a2, aO], function (c, b, d) {
        function a(f, h) {
            var j, e;
            if (h || (h = {}), e = h.type && "" !== h.type ? h.type : b.getFileMime(h.name), h.name) {
                j = h.name.replace(/\\/g, "/"), j = j.substr(j.lastIndexOf("/") + 1);
            } else {
                var g = e.split("/")[0];
                j = c.guid(("" !== g ? g : "file") + "_"), b.extensions[e] && (j += "." + b.extensions[e][0]);
            }
            d.apply(this, arguments), c.extend(this, {
                type: e || "",
                name: j || c.guid("file_"),
                lastModifiedDate: h.lastModifiedDate || (new Date).toLocaleString()
            });
        }

        return a.prototype = d.prototype, a;
    }), a6(aA, [aS, a2, ba, a7, aY, bd, aQ, a8, aR], function (j, q, f, h, b, d, m, v, p) {
        function k(e) {
            var n = this, l, i, a;
            if (-1 !== j.inArray(j.typeOf(e), ["string", "node"]) && (e = {browse_button: e}), i = f.get(e.browse_button), !i) {
                throw new h.DOMException(h.DOMException.NOT_FOUND_ERR);
            }
            a = {
                accept: [{title: d.translate("All Files"), extensions: "*"}],
                name: "file",
                multiple: !1,
                required_caps: !1,
                container: i.parentNode || document.body
            }, e = j.extend({}, a, e), "string" == typeof e.required_caps && (e.required_caps = v.parseCaps(e.required_caps)), "string" == typeof e.accept && (e.accept = q.mimes2extList(e.accept)), l = f.get(e.container), l || (l = document.body), "static" === f.getStyle(l, "position") && (l.style.position = "relative"), l = i = null, p.call(n), j.extend(n, {
                uid: j.guid("uid_"), ruid: null, shimid: null, files: null, init: function () {
                    n.convertEventPropsToHandlers(g), n.bind("RuntimeInit", function (o, c) {
                        n.ruid = c.uid, n.shimid = c.shimid, n.bind("Ready", function () {
                            n.trigger("Refresh");
                        }, 999), n.bind("Change", function () {
                            var r = c.exec.call(n, "FileInput", "getFiles");
                            n.files = [], j.each(r, function (s) {
                                return 0 === s.size ? !0 : void n.files.push(new m(n.ruid, s));
                            });
                        }, 999), n.bind("Refresh", function () {
                            var u, x, r, w;
                            r = f.get(e.browse_button), w = f.get(c.shimid), r && (u = f.getPos(r, f.get(e.container)), x = f.getSize(r), w && j.extend(w.style, {
                                top: u.y + "px",
                                left: u.x + "px",
                                width: x.w + "px",
                                height: x.h + "px"
                            })), w = r = null;
                        }), c.exec.call(n, "FileInput", "init", e);
                    }), n.connectRuntime(j.extend({}, e, {required_caps: {select_file: !0}}));
                }, disable: function (c) {
                    var o = this.getRuntime();
                    o && o.exec.call(this, "FileInput", "disable", "undefined" === j.typeOf(c) ? !0 : c);
                }, refresh: function () {
                    n.trigger("Refresh");
                }, destroy: function () {
                    var c = this.getRuntime();
                    c && (c.exec.call(this, "FileInput", "destroy"), this.disconnectRuntime()), "array" === j.typeOf(this.files) && j.each(this.files, function (o) {
                        o.destroy();
                    }), this.files = null;
                }
            });
        }

        var g = ["ready", "change", "cancel", "mouseenter", "mouseleave", "mousedown", "mouseup"];
        return k.prototype = b.instance, k;
    }), a6(bg, [bd, ba, a7, aS, aQ, aR, aY, a2], function (h, m, f, g, b, d, k, p) {
        function l(i) {
            var c = this, e;
            "string" == typeof i && (i = {drop_zone: i}), e = {
                accept: [{
                    title: h.translate("All Files"),
                    extensions: "*"
                }], required_caps: {drag_and_drop: !0}
            }, i = "object" == typeof i ? g.extend({}, e, i) : e, i.container = m.get(i.drop_zone) || document.body, "static" === m.getStyle(i.container, "position") && (i.container.style.position = "relative"), "string" == typeof i.accept && (i.accept = p.mimes2extList(i.accept)), d.call(c), g.extend(c, {
                uid: g.guid("uid_"),
                ruid: null,
                files: null,
                init: function () {
                    c.convertEventPropsToHandlers(j), c.bind("RuntimeInit", function (n, a) {
                        c.ruid = a.uid, c.bind("Drop", function () {
                            var o = a.exec.call(c, "FileDrop", "getFiles");
                            c.files = [], g.each(o, function (q) {
                                c.files.push(new b(c.ruid, q));
                            });
                        }, 999), a.exec.call(c, "FileDrop", "init", i), c.dispatchEvent("ready");
                    }), c.connectRuntime(i);
                },
                destroy: function () {
                    var a = this.getRuntime();
                    a && (a.exec.call(this, "FileDrop", "destroy"), this.disconnectRuntime()), this.files = null;
                }
            });
        }

        var j = ["ready", "dragenter", "dragleave", "drop", "error"];
        return l.prototype = k.instance, l;
    }), a6(aP, [aS, aR, aY], function (c, b, d) {
        function a() {
            this.uid = c.guid("uid_"), b.call(this), this.destroy = function () {
                this.disconnectRuntime(), this.unbindAll();
            };
        }

        return a.prototype = d.instance, a;
    }), a6(be, [aS, a1, a7, aY, aO, aQ, aP], function (g, k, d, f, b, c, h) {
        function l() {
            function a(r, o) {
                function n(i) {
                    e.readyState = l.DONE, e.error = i, e.trigger("error"), s();
                }

                function s() {
                    m.destroy(), m = null, e.trigger("loadend");
                }

                function q(i) {
                    m.bind("Error", function (v, u) {
                        n(u);
                    }), m.bind("Progress", function (t) {
                        e.result = i.exec.call(m, "FileReader", "getResult"), e.trigger(t);
                    }), m.bind("Load", function (t) {
                        e.readyState = l.DONE, e.result = i.exec.call(m, "FileReader", "getResult"), e.trigger(t), s();
                    }), i.exec.call(m, "FileReader", "read", r, o);
                }

                if (m = new h, this.convertEventPropsToHandlers(j), this.readyState === l.LOADING) {
                    return n(new d.DOMException(d.DOMException.INVALID_STATE_ERR));
                }
                if (this.readyState = l.LOADING, this.trigger("loadstart"), o instanceof b) {
                    if (o.isDetached()) {
                        var p = o.getSource();
                        switch (r) {
                            case"readAsText":
                            case"readAsBinaryString":
                                this.result = p;
                                break;
                            case"readAsDataURL":
                                this.result = "data:" + o.type + ";base64," + k.btoa(p);
                        }
                        this.readyState = l.DONE, this.trigger("load"), s();
                    } else {
                        q(m.connectRuntime(o.ruid));
                    }
                } else {
                    n(new d.DOMException(d.DOMException.NOT_FOUND_ERR));
                }
            }

            var e = this, m;
            g.extend(this, {
                uid: g.guid("uid_"),
                readyState: l.EMPTY,
                result: null,
                error: null,
                readAsBinaryString: function (i) {
                    a.call(this, "readAsBinaryString", i);
                },
                readAsDataURL: function (i) {
                    a.call(this, "readAsDataURL", i);
                },
                readAsText: function (i) {
                    a.call(this, "readAsText", i);
                },
                abort: function () {
                    this.result = null, -1 === g.inArray(this.readyState, [l.EMPTY, l.DONE]) && (this.readyState === l.LOADING && (this.readyState = l.DONE), m && m.getRuntime().exec.call(this, "FileReader", "abort"), this.trigger("abort"), this.trigger("loadend"));
                },
                destroy: function () {
                    this.abort(), m && (m.getRuntime().exec.call(this, "FileReader", "destroy"), m.disconnectRuntime()), e = m = null;
                }
            });
        }

        var j = ["loadstart", "progress", "load", "abort", "error", "loadend"];
        return l.EMPTY = 0, l.LOADING = 1, l.DONE = 2, l.prototype = f.instance, l;
    }), a6(aj, [], function () {
        var b = function (l, f) {
            for (var g = ["source", "scheme", "authority", "userInfo", "user", "pass", "host", "port", "relative", "path", "directory", "file", "query", "fragment"], d = g.length, e = {
                http: 80,
                https: 443
            }, j = {}, m = /^(?:([^:\/?#]+):)?(?:\/\/()(?:(?:()(?:([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?()(?:(()(?:(?:[^?#\/]*\/)*)()(?:[^?#]*))(?:\\?([^#]*))?(?:#(.*))?)/, k = m.exec(l || ""); d--;) {
                k[d] && (j[g[d]] = k[d]);
            }
            if (!j.scheme) {
                f && "string" != typeof f || (f = b(f || document.location.href)), j.scheme = f.scheme, j.host = f.host, j.port = f.port;
                var h = "";
                /^[^\/]/.test(j.path) && (h = f.path, /(\/|\/[^\.]+)$/.test(h) ? h += "/" : h = h.replace(/\/[^\/]+$/, "/")), j.path = h + (j.path || "");
            }
            return j.port || (j.port = e[j.scheme] || 80), j.port = parseInt(j.port, 10), j.path || (j.path = "/"), delete j.source, j;
        }, a = function (e) {
            var f = {http: 80, https: 443}, d = b(e);
            return d.scheme + "://" + d.host + (d.port !== f[d.scheme] ? ":" + d.port : "") + d.path + (d.query ? d.query : "");
        }, c = function (d) {
            function e(f) {
                return [f.scheme, f.host, f.port].join("/");
            }

            return "string" == typeof d && (d = b(d)), e(b()) === e(d);
        };
        return {parseUrl: b, resolveUrl: a, hasSameOrigin: c};
    }), a6(ag, [aS, aR, a1], function (b, a, c) {
        return function () {
            function d(l, h) {
                if (!h.isDetached()) {
                    var g = this.connectRuntime(h.ruid).exec.call(this, "FileReaderSync", "read", l, h);
                    return this.disconnectRuntime(), g;
                }
                var k = h.getSource();
                switch (l) {
                    case"readAsBinaryString":
                        return k;
                    case"readAsDataURL":
                        return "data:" + h.type + ";base64," + c.btoa(k);
                    case"readAsText":
                        for (var m = "", f = 0, j = k.length; j > f; f++) {
                            m += String.fromCharCode(k[f]);
                        }
                        return m;
                }
            }

            a.call(this), b.extend(this, {
                uid: b.guid("uid_"), readAsBinaryString: function (f) {
                    return d.call(this, "readAsBinaryString", f);
                }, readAsDataURL: function (f) {
                    return d.call(this, "readAsDataURL", f);
                }, readAsText: function (f) {
                    return d.call(this, "readAsText", f);
                }
            });
        };
    }), a6(aE, [a7, aS, aO], function (c, b, d) {
        function a() {
            var g, f = [];
            b.extend(this, {
                append: function (i, j) {
                    var e = this, h = b.typeOf(j);
                    j instanceof d ? g = {name: i, value: j} : "array" === h ? (i += "[]", b.each(j, function (k) {
                        e.append(i, k);
                    })) : "object" === h ? b.each(j, function (l, k) {
                        e.append(i + "[" + k + "]", l);
                    }) : "null" === h || "undefined" === h || "number" === h && isNaN(j) ? e.append(i, "false") : f.push({
                        name: i,
                        value: j.toString()
                    });
                }, hasBlob: function () {
                    return !!this.getBlob();
                }, getBlob: function () {
                    return g && g.value || null;
                }, getBlobName: function () {
                    return g && g.name || null;
                }, each: function (e) {
                    b.each(f, function (h) {
                        e(h.value, h.name);
                    }), g && e(g.value, g.name);
                }, destroy: function () {
                    g = null, f = [];
                }
            });
        }

        return a;
    }), a6(ai, [aS, a7, aY, a1, aj, a8, aP, aO, ag, aE, bc, a2], function (G, k, z, C, w, y, J, q, j, I, B, H) {
        function F() {
            this.uid = G.guid("uid_");
        }

        function D() {
            function bh(n, g) {
                return o.hasOwnProperty(n) ? 1 === arguments.length ? B.can("define_property") ? o[n] : K[n] : void (B.can("define_property") ? o[n] = g : K[n] = g) : void 0;
            }

            function V(n) {
                function g() {
                    bi && (bi.destroy(), bi = null), u.dispatchEvent("loadend"), u = null;
                }

                function v(L) {
                    bi.bind("LoadStart", function (M) {
                        bh("readyState", D.LOADING), u.dispatchEvent("readystatechange"), u.dispatchEvent(M), p && u.upload.dispatchEvent(M);
                    }), bi.bind("Progress", function (M) {
                        bh("readyState") !== D.LOADING && (bh("readyState", D.LOADING), u.dispatchEvent("readystatechange")), u.dispatchEvent(M);
                    }), bi.bind("UploadProgress", function (M) {
                        p && u.upload.dispatchEvent({
                            type: "progress",
                            lengthComputable: !1,
                            total: M.total,
                            loaded: M.loaded
                        });
                    }), bi.bind("Load", function (M) {
                        bh("readyState", D.DONE), bh("status", Number(L.exec.call(bi, "XMLHttpRequest", "getStatus") || 0)), bh("statusText", x[bh("status")] || ""), bh("response", L.exec.call(bi, "XMLHttpRequest", "getResponse", bh("responseType"))), ~G.inArray(bh("responseType"), ["text", ""]) ? bh("responseText", bh("response")) : "document" === bh("responseType") && bh("responseXML", bh("response")), a = L.exec.call(bi, "XMLHttpRequest", "getAllResponseHeaders"), u.dispatchEvent("readystatechange"), bh("status") > 0 ? (p && u.upload.dispatchEvent(M), u.dispatchEvent(M)) : (i = !0, u.dispatchEvent("error")), g();
                    }), bi.bind("Abort", function (M) {
                        u.dispatchEvent(M), g();
                    }), bi.bind("Error", function (M) {
                        i = !0, bh("readyState", D.DONE), u.dispatchEvent("readystatechange"), X = !0, u.dispatchEvent(M), g();
                    }), L.exec.call(bi, "XMLHttpRequest", "send", {
                        url: W,
                        method: bl,
                        async: t,
                        user: bk,
                        password: e,
                        headers: r,
                        mimeType: at,
                        encoding: c,
                        responseType: u.responseType,
                        withCredentials: u.withCredentials,
                        options: f
                    }, n);
                }

                var u = this;
                l = (new Date).getTime(), bi = new J, "string" == typeof f.required_caps && (f.required_caps = y.parseCaps(f.required_caps)), f.required_caps = G.extend({}, f.required_caps, {return_response_type: u.responseType}), n instanceof I && (f.required_caps.send_multipart = !0), m || (f.required_caps.do_cors = !0), f.ruid ? v(bi.connectRuntime(f)) : (bi.bind("RuntimeInit", function (M, L) {
                    v(L);
                }), bi.bind("RuntimeError", function (M, L) {
                    u.dispatchEvent("RuntimeError", L);
                }), bi.connectRuntime(f));
            }

            function bj() {
                bh("responseText", ""), bh("responseXML", null), bh("response", null), bh("status", 0), bh("statusText", ""), l = Y = null;
            }

            var K = this, o = {
                timeout: 0,
                readyState: D.UNSENT,
                withCredentials: !1,
                status: 0,
                statusText: "",
                responseType: "",
                responseXML: null,
                responseText: null,
                response: null
            }, t = !0, W, bl, r = {}, bk, e, c = null, at = null, d = !1, h = !1, p = !1, X = !1, i = !1, m = !1, l, Y, Q = null, s = null, f = {}, bi, a = "", Z;
            G.extend(this, o, {
                uid: G.guid("uid_"), upload: new F, open: function (M, n, L, v, N) {
                    var g;
                    if (!M || !n) {
                        throw new k.DOMException(k.DOMException.SYNTAX_ERR);
                    }
                    if (/[\u0100-\uffff]/.test(M) || C.utf8_encode(M) !== M) {
                        throw new k.DOMException(k.DOMException.SYNTAX_ERR);
                    }
                    if (~G.inArray(M.toUpperCase(), ["CONNECT", "DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT", "TRACE", "TRACK"]) && (bl = M.toUpperCase()), ~G.inArray(bl, ["CONNECT", "TRACE", "TRACK"])) {
                        throw new k.DOMException(k.DOMException.SECURITY_ERR);
                    }
                    if (n = C.utf8_encode(n), g = w.parseUrl(n), m = w.hasSameOrigin(g), W = w.resolveUrl(n), (v || N) && !m) {
                        throw new k.DOMException(k.DOMException.INVALID_ACCESS_ERR);
                    }
                    if (bk = v || g.user, e = N || g.pass, t = L || !0, t === !1 && (bh("timeout") || bh("withCredentials") || "" !== bh("responseType"))) {
                        throw new k.DOMException(k.DOMException.INVALID_ACCESS_ERR);
                    }
                    d = !t, h = !1, r = {}, bj.call(this), bh("readyState", D.OPENED), this.convertEventPropsToHandlers(["readystatechange"]), this.dispatchEvent("readystatechange");
                }, setRequestHeader: function (n, u) {
                    var g = ["accept-charset", "accept-encoding", "access-control-request-headers", "access-control-request-method", "connection", "content-length", "cookie", "cookie2", "content-transfer-encoding", "date", "expect", "host", "keep-alive", "origin", "referer", "te", "trailer", "transfer-encoding", "upgrade", "user-agent", "via"];
                    if (bh("readyState") !== D.OPENED || h) {
                        throw new k.DOMException(k.DOMException.INVALID_STATE_ERR);
                    }
                    if (/[\u0100-\uffff]/.test(n) || C.utf8_encode(n) !== n) {
                        throw new k.DOMException(k.DOMException.SYNTAX_ERR);
                    }
                    return n = G.trim(n).toLowerCase(), ~G.inArray(n, g) || /^(proxy\-|sec\-)/.test(n) ? !1 : (r[n] ? r[n] += ", " + u : r[n] = u, !0);
                }, getAllResponseHeaders: function () {
                    return a || "";
                }, getResponseHeader: function (g) {
                    return g = g.toLowerCase(), i || ~G.inArray(g, ["set-cookie", "set-cookie2"]) ? null : a && "" !== a && (Z || (Z = {}, G.each(a.split(/\r\n/), function (u) {
                        var v = u.split(/:\s+/);
                        2 === v.length && (v[0] = G.trim(v[0]), Z[v[0].toLowerCase()] = {
                            header: v[0],
                            value: G.trim(v[1])
                        });
                    })), Z.hasOwnProperty(g)) ? Z[g].header + ": " + Z[g].value : null;
                }, overrideMimeType: function (g) {
                    var n, u;
                    if (~G.inArray(bh("readyState"), [D.LOADING, D.DONE])) {
                        throw new k.DOMException(k.DOMException.INVALID_STATE_ERR);
                    }
                    if (g = G.trim(g.toLowerCase()), /;/.test(g) && (n = g.match(/^([^;]+)(?:;\scharset\=)?(.*)$/)) && (g = n[1], n[2] && (u = n[2])), !H.mimes[g]) {
                        throw new k.DOMException(k.DOMException.SYNTAX_ERR);
                    }
                    Q = g, s = u;
                }, send: function (v, g) {
                    if (f = "string" === G.typeOf(g) ? {ruid: g} : g ? g : {}, this.convertEventPropsToHandlers(A), this.upload.convertEventPropsToHandlers(A), this.readyState !== D.OPENED || h) {
                        throw new k.DOMException(k.DOMException.INVALID_STATE_ERR);
                    }
                    if (v instanceof q) {
                        f.ruid = v.ruid, at = v.type || "application/octet-stream";
                    } else {
                        if (v instanceof I) {
                            if (v.hasBlob()) {
                                var u = v.getBlob();
                                f.ruid = u.ruid, at = u.type || "application/octet-stream";
                            }
                        } else {
                            "string" == typeof v && (c = "UTF-8", at = "text/plain;charset=UTF-8", v = C.utf8_encode(v));
                        }
                    }
                    this.withCredentials || (this.withCredentials = f.required_caps && f.required_caps.send_browser_cookies && !m), p = !d && this.upload.hasEventListener(), i = !1, X = !v, d || (h = !0), V.call(this, v);
                }, abort: function () {
                    if (i = !0, d = !1, ~G.inArray(bh("readyState"), [D.UNSENT, D.OPENED, D.DONE])) {
                        bh("readyState", D.UNSENT);
                    } else {
                        if (bh("readyState", D.DONE), h = !1, !bi) {
                            throw new k.DOMException(k.DOMException.INVALID_STATE_ERR);
                        }
                        bi.getRuntime().exec.call(bi, "XMLHttpRequest", "abort", X), X = !0;
                    }
                }, destroy: function () {
                    bi && ("function" === G.typeOf(bi.destroy) && bi.destroy(), bi = null), this.unbindAll(), this.upload && (this.upload.unbindAll(), this.upload = null);
                }
            });
        }

        var x = {
            100: "Continue",
            101: "Switching Protocols",
            102: "Processing",
            200: "OK",
            201: "Created",
            202: "Accepted",
            203: "Non-Authoritative Information",
            204: "No Content",
            205: "Reset Content",
            206: "Partial Content",
            207: "Multi-Status",
            226: "IM Used",
            300: "Multiple Choices",
            301: "Moved Permanently",
            302: "Found",
            303: "See Other",
            304: "Not Modified",
            305: "Use Proxy",
            306: "Reserved",
            307: "Temporary Redirect",
            400: "Bad Request",
            401: "Unauthorized",
            402: "Payment Required",
            403: "Forbidden",
            404: "Not Found",
            405: "Method Not Allowed",
            406: "Not Acceptable",
            407: "Proxy Authentication Required",
            408: "Request Timeout",
            409: "Conflict",
            410: "Gone",
            411: "Length Required",
            412: "Precondition Failed",
            413: "Request Entity Too Large",
            414: "Request-URI Too Long",
            415: "Unsupported Media Type",
            416: "Requested Range Not Satisfiable",
            417: "Expectation Failed",
            422: "Unprocessable Entity",
            423: "Locked",
            424: "Failed Dependency",
            426: "Upgrade Required",
            500: "Internal Server Error",
            501: "Not Implemented",
            502: "Bad Gateway",
            503: "Service Unavailable",
            504: "Gateway Timeout",
            505: "HTTP Version Not Supported",
            506: "Variant Also Negotiates",
            507: "Insufficient Storage",
            510: "Not Extended"
        };
        F.prototype = z.instance;
        var A = ["loadstart", "progress", "abort", "error", "load", "timeout", "loadend"], E = 1, b = 2;
        return D.UNSENT = 0, D.OPENED = 1, D.HEADERS_RECEIVED = 2, D.LOADING = 3, D.DONE = 4, D.prototype = z.instance, D;
    }), a6(an, [aS, a1, aR, aY], function (d, b, f, a) {
        function c() {
            function h() {
                g = k = 0, m = this.result = null;
            }

            function e(o, r) {
                var l = this;
                p = r, l.bind("TransportingProgress", function (i) {
                    k = i.loaded, g > k && -1 === d.inArray(l.state, [c.IDLE, c.DONE]) && n.call(l);
                }, 999), l.bind("TransportingComplete", function () {
                    k = g, l.state = c.DONE, m = null, l.result = p.exec.call(l, "Transporter", "getAsBlob", o || "");
                }, 999), l.state = c.BUSY, l.trigger("TransportingStarted"), n.call(l);
            }

            function n() {
                var o = this, r, l = g - k;
                j > l && (j = l), r = b.btoa(m.substr(k, j)), p.exec.call(o, "Transporter", "receive", r, g);
            }

            var q, p, m, g, k, j;
            f.call(this), d.extend(this, {
                uid: d.guid("uid_"),
                state: c.IDLE,
                result: null,
                transport: function (o, v, s) {
                    var i = this;
                    if (s = d.extend({chunk_size: 204798}, s), (q = s.chunk_size % 3) && (s.chunk_size += 3 - q), j = s.chunk_size, h.call(this), m = o, g = o.length, "string" === d.typeOf(s) || s.ruid) {
                        e.call(i, v, this.connectRuntime(s));
                    } else {
                        var l = function (u, r) {
                            i.unbind("RuntimeInit", l), e.call(i, v, r);
                        };
                        this.bind("RuntimeInit", l), this.connectRuntime(s);
                    }
                },
                abort: function () {
                    var i = this;
                    i.state = c.IDLE, p && (p.exec.call(i, "Transporter", "clear"), i.trigger("TransportingAborted")), h.call(i);
                },
                destroy: function () {
                    this.unbindAll(), p = null, this.disconnectRuntime(), h.call(this);
                }
            });
        }

        return c.IDLE = 0, c.BUSY = 1, c.DONE = 2, c.prototype = a.instance, c;
    }), a6(av, [aS, ba, a7, ag, ai, a8, aR, an, bc, aY, aO, aQ, a1], function (x, C, k, q, b, j, A, D, B, z, m, y, w) {
        function v() {
            function e(c) {
                c || (c = this.getRuntime().exec.call(this, "Image", "getInfo")), this.size = c.size, this.width = c.width, this.height = c.height, this.type = c.type, this.meta = c.meta, "" === this.name && (this.name = c.name);
            }

            function h(l) {
                var c = x.typeOf(l);
                try {
                    if (l instanceof v) {
                        if (!l.size) {
                            throw new k.DOMException(k.DOMException.INVALID_STATE_ERR);
                        }
                        a.apply(this, arguments);
                    } else {
                        if (l instanceof m) {
                            if (!~x.inArray(l.type, ["image/jpeg", "image/png"])) {
                                throw new k.ImageError(k.ImageError.WRONG_FORMAT);
                            }
                            f.apply(this, arguments);
                        } else {
                            if (-1 !== x.inArray(c, ["blob", "file"])) {
                                h.call(this, new y(null, l), arguments[1]);
                            } else {
                                if ("string" === c) {
                                    /^data:[^;]*;base64,/.test(l) ? h.call(this, new m(null, {data: l}), arguments[1]) : d.apply(this, arguments);
                                } else {
                                    if ("node" !== c || "img" !== l.nodeName.toLowerCase()) {
                                        throw new k.DOMException(k.DOMException.TYPE_MISMATCH_ERR);
                                    }
                                    h.call(this, l.src, arguments[1]);
                                }
                            }
                        }
                    }
                } catch (n) {
                    this.trigger("error", n.code);
                }
            }

            function a(l, o) {
                var c = this.connectRuntime(l.ruid);
                this.ruid = c.uid, c.exec.call(this, "Image", "loadFromImage", l, "undefined" === x.typeOf(o) ? !0 : o);
            }

            function f(l, p) {
                function c(i) {
                    o.ruid = i.uid, i.exec.call(o, "Image", "loadFromBlob", l);
                }

                var o = this;
                o.name = l.name || "", l.isDetached() ? (this.bind("RuntimeInit", function (n, i) {
                    c(i);
                }), p && "string" == typeof p.required_caps && (p.required_caps = j.parseCaps(p.required_caps)), this.connectRuntime(x.extend({
                    required_caps: {
                        access_image_binary: !0,
                        resize_image: !0
                    }
                }, p))) : c(this.connectRuntime(l.ruid));
            }

            function d(o, l) {
                var p = this, c;
                c = new b, c.open("get", o), c.responseType = "blob", c.onprogress = function (i) {
                    p.trigger(i);
                }, c.onload = function () {
                    f.call(p, c.response, !0);
                }, c.onerror = function (i) {
                    p.trigger(i);
                }, c.onloadend = function () {
                    c.destroy();
                }, c.bind("RuntimeError", function (n, i) {
                    p.trigger("RuntimeError", i);
                }), c.send(null, l);
            }

            A.call(this), x.extend(this, {
                uid: x.guid("uid_"),
                ruid: null,
                name: "",
                size: 0,
                width: 0,
                height: 0,
                type: "",
                meta: {},
                clone: function () {
                    this.load.apply(this, arguments);
                },
                load: function () {
                    this.bind("Load Resize", function () {
                        e.call(this);
                    }, 999), this.convertEventPropsToHandlers(g), h.apply(this, arguments);
                },
                downsize: function (l) {
                    var c = {width: this.width, height: this.height, crop: !1, preserveHeaders: !0};
                    l = "object" == typeof l ? x.extend(c, l) : x.extend(c, {
                        width: arguments[0],
                        height: arguments[1],
                        crop: arguments[2],
                        preserveHeaders: arguments[3]
                    });
                    try {
                        if (!this.size) {
                            throw new k.DOMException(k.DOMException.INVALID_STATE_ERR);
                        }
                        if (this.width > v.MAX_RESIZE_WIDTH || this.height > v.MAX_RESIZE_HEIGHT) {
                            throw new k.ImageError(k.ImageError.MAX_RESOLUTION_ERR);
                        }
                        this.getRuntime().exec.call(this, "Image", "downsize", l.width, l.height, l.crop, l.preserveHeaders);
                    } catch (n) {
                        this.trigger("error", n.code);
                    }
                },
                crop: function (i, c, l) {
                    this.downsize(i, c, !0, l);
                },
                getAsCanvas: function () {
                    if (!B.can("create_canvas")) {
                        throw new k.RuntimeError(k.RuntimeError.NOT_SUPPORTED_ERR);
                    }
                    var c = this.connectRuntime(this.ruid);
                    return c.exec.call(this, "Image", "getAsCanvas");
                },
                getAsBlob: function (i, c) {
                    if (!this.size) {
                        throw new k.DOMException(k.DOMException.INVALID_STATE_ERR);
                    }
                    return i || (i = "image/jpeg"), "image/jpeg" !== i || c || (c = 90), this.getRuntime().exec.call(this, "Image", "getAsBlob", i, c);
                },
                getAsDataURL: function (i, c) {
                    if (!this.size) {
                        throw new k.DOMException(k.DOMException.INVALID_STATE_ERR);
                    }
                    return this.getRuntime().exec.call(this, "Image", "getAsDataURL", i, c);
                },
                getAsBinaryString: function (i, c) {
                    var l = this.getAsDataURL(i, c);
                    return w.atob(l.substring(l.indexOf("base64,") + 7));
                },
                embed: function (F) {
                    function n() {
                        if (B.can("create_canvas")) {
                            var c = K.getAsCanvas();
                            if (c) {
                                return F.appendChild(c), c = null, K.destroy(), void t.trigger("embedded");
                            }
                        }
                        var i = K.getAsDataURL(I, E);
                        if (!i) {
                            throw new k.ImageError(k.ImageError.WRONG_FORMAT);
                        }
                        if (B.can("use_data_uri_of", i.length)) {
                            F.innerHTML = '<img src="' + i + '" width="' + K.width + '" height="' + K.height + '" />', K.destroy(), t.trigger("embedded");
                        } else {
                            var l = new D;
                            l.bind("TransportingComplete", function () {
                                M = t.connectRuntime(this.result.ruid), t.bind("Embedded", function () {
                                    x.extend(M.getShimContainer().style, {
                                        top: "0px",
                                        left: "0px",
                                        width: K.width + "px",
                                        height: K.height + "px"
                                    }), M = null;
                                }, 999), M.exec.call(t, "ImageView", "display", this.result.uid, u, G), K.destroy();
                            }), l.transport(w.atob(i.substring(i.indexOf("base64,") + 7)), I, x.extend({}, s, {
                                required_caps: {display_media: !0},
                                runtime_order: "flash,silverlight",
                                container: F
                            }));
                        }
                    }

                    var t = this, K, I, E, H, s = arguments[1] || {}, u = this.width, G = this.height, M;
                    try {
                        if (!(F = C.get(F))) {
                            throw new k.DOMException(k.DOMException.INVALID_NODE_TYPE_ERR);
                        }
                        if (!this.size) {
                            throw new k.DOMException(k.DOMException.INVALID_STATE_ERR);
                        }
                        if (this.width > v.MAX_RESIZE_WIDTH || this.height > v.MAX_RESIZE_HEIGHT) {
                            throw new k.ImageError(k.ImageError.MAX_RESOLUTION_ERR);
                        }
                        if (I = s.type || this.type || "image/jpeg", E = s.quality || 90, H = "undefined" !== x.typeOf(s.crop) ? s.crop : !1, s.width) {
                            u = s.width, G = s.height || u;
                        } else {
                            var J = C.getSize(F);
                            J.w && J.h && (u = J.w, G = J.h);
                        }
                        return K = new v, K.bind("Resize", function () {
                            n.call(t);
                        }), K.bind("Load", function () {
                            K.downsize(u, G, H, !1);
                        }), K.clone(this, !1), K;
                    } catch (L) {
                        this.trigger("error", L.code);
                    }
                },
                destroy: function () {
                    this.ruid && (this.getRuntime().exec.call(this, "Image", "destroy"), this.disconnectRuntime()), this.unbindAll();
                }
            });
        }

        var g = ["progress", "load", "error", "resize", "embedded"];
        return v.MAX_RESIZE_WIDTH = 6500, v.MAX_RESIZE_HEIGHT = 6500, v.prototype = z.instance, v;
    }), a6(aB, [aS, a7, a8, bc], function (g, d, j, c) {
        function f(e) {
            var k = this, i = j.capTest, a = j.capTrue, l = g.extend({
                access_binary: i(window.FileReader || window.File && window.File.getAsDataURL),
                access_image_binary: function () {
                    return k.can("access_binary") && !!b.Image;
                },
                display_media: i(c.can("create_canvas") || c.can("use_data_uri_over32kb")),
                do_cors: i(window.XMLHttpRequest && "withCredentials" in new XMLHttpRequest),
                drag_and_drop: i(function () {
                    var m = document.createElement("div");
                    return ("draggable" in m || "ondragstart" in m && "ondrop" in m) && ("IE" !== c.browser || c.version > 9);
                }()),
                filter_by_extension: i(function () {
                    return "Chrome" === c.browser && c.version >= 28 || "IE" === c.browser && c.version >= 10;
                }()),
                return_response_headers: a,
                return_response_type: function (m) {
                    return "json" === m && window.JSON ? !0 : c.can("return_response_type", m);
                },
                return_status_code: a,
                report_upload_progress: i(window.XMLHttpRequest && (new XMLHttpRequest).upload),
                resize_image: function () {
                    return k.can("access_binary") && c.can("create_canvas");
                },
                select_file: function () {
                    return c.can("use_fileinput") && window.File;
                },
                select_folder: function () {
                    return k.can("select_file") && "Chrome" === c.browser && c.version >= 21;
                },
                select_multiple: function () {
                    return !(!k.can("select_file") || "Safari" === c.browser && "Windows" === c.os || "iOS" === c.os && c.verComp(c.osVersion, "7.0.4", "<"));
                },
                send_binary_string: i(window.XMLHttpRequest && ((new XMLHttpRequest).sendAsBinary || window.Uint8Array && window.ArrayBuffer)),
                send_custom_headers: i(window.XMLHttpRequest),
                send_multipart: function () {
                    return !!(window.XMLHttpRequest && (new XMLHttpRequest).upload && window.FormData) || k.can("send_binary_string");
                },
                slice_blob: i(window.File && (File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice)),
                stream_upload: function () {
                    return k.can("slice_blob") && k.can("send_multipart");
                },
                summon_file_dialog: i(function () {
                    return "Firefox" === c.browser && c.version >= 4 || "Opera" === c.browser && c.version >= 12 || "IE" === c.browser && c.version >= 10 || !!~g.inArray(c.browser, ["Chrome", "Safari"]);
                }()),
                upload_filesize: a
            }, arguments[2]);
            j.call(this, e, arguments[1] || h, l), g.extend(this, {
                init: function () {
                    this.trigger("Init");
                }, destroy: function (m) {
                    return function () {
                        m.call(k), m = k = null;
                    };
                }(this.destroy)
            }), g.extend(this.getShim(), b);
        }

        var h = "html5", b = {};
        return j.addConstructor(h, f), b;
    }), a6(ao, [aB, aO], function (b, a) {
        function c() {
            function d(j, g, k) {
                var f;
                if (!window.File.prototype.slice) {
                    return (f = window.File.prototype.webkitSlice || window.File.prototype.mozSlice) ? f.call(j, g, k) : null;
                }
                try {
                    return j.slice(), j.slice(g, k);
                } catch (h) {
                    return j.slice(g, k - g);
                }
            }

            this.slice = function () {
                return new a(this.getRuntime().uid, d.apply(this, arguments));
            };
        }

        return b.Blob = c;
    }), a6(aq, [aS], function (h) {
        function d() {
            this.returnValue = !1;
        }

        function k() {
            this.cancelBubble = !0;
        }

        var c = {}, g = "moxie_" + h.guid(), j = function (p, i, n, m) {
            var q, e;
            i = i.toLowerCase(), p.addEventListener ? (q = n, p.addEventListener(i, q, !1)) : p.attachEvent && (q = function () {
                var a = window.event;
                a.target || (a.target = a.srcElement), a.preventDefault = d, a.stopPropagation = k, n(a);
            }, p.attachEvent("on" + i, q)), p[g] || (p[g] = h.guid()), c.hasOwnProperty(p[g]) || (c[p[g]] = {}), e = c[p[g]], e.hasOwnProperty(i) || (e[i] = []), e[i].push({
                func: q,
                orig: n,
                key: m
            });
        }, b = function (l, r, p) {
            var e, m;
            if (r = r.toLowerCase(), l[g] && c[l[g]] && c[l[g]][r]) {
                e = c[l[g]][r];
                for (var i = e.length - 1; i >= 0 && (e[i].orig !== p && e[i].key !== p || (l.removeEventListener ? l.removeEventListener(r, e[i].func, !1) : l.detachEvent && l.detachEvent("on" + r, e[i].func), e[i].orig = null, e[i].func = null, e.splice(i, 1), p === m)); i--) {
                }
                if (e.length || delete c[l[g]][r], h.isEmptyObj(c[l[g]])) {
                    delete c[l[g]];
                    try {
                        delete l[g];
                    } catch (q) {
                        l[g] = m;
                    }
                }
            }
        }, f = function (a, e) {
            a && a[g] && h.each(c[a[g]], function (m, l) {
                b(a, l, e);
            });
        };
        return {addEvent: j, removeEvent: b, removeAllEvents: f};
    }), a6(ap, [aB, aS, ba, aq, a2, bc], function (g, d, j, c, f, h) {
        function b() {
            var k = [], i;
            d.extend(this, {
                init: function (x) {
                    var w = this, v = w.getRuntime(), n, t, r, o, a, e;
                    i = x, k = [], r = i.accept.mimes || f.extList2mimes(i.accept, v.can("filter_by_extension")), t = v.getShimContainer(), t.innerHTML = '<input id="' + v.uid + '" type="file" style="font-size:999px;opacity:0;"' + (i.multiple && v.can("select_multiple") ? "multiple" : "") + (i.directory && v.can("select_folder") ? "webkitdirectory directory" : "") + (r ? ' accept="' + r.join(",") + '"' : "") + " />", n = j.get(v.uid), d.extend(n.style, {
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%"
                    }), o = j.get(i.browse_button), v.can("summon_file_dialog") && ("static" === j.getStyle(o, "position") && (o.style.position = "relative"), a = parseInt(j.getStyle(o, "z-index"), 10) || 1, o.style.zIndex = a, t.style.zIndex = a - 1, c.addEvent(o, "click", function (m) {
                        var l = j.get(v.uid);
                        l && !l.disabled && l.click(), m.preventDefault();
                    }, w.uid)), e = v.can("summon_file_dialog") ? o : t, c.addEvent(e, "mouseover", function () {
                        w.trigger("mouseenter");
                    }, w.uid), c.addEvent(e, "mouseout", function () {
                        w.trigger("mouseleave");
                    }, w.uid), c.addEvent(e, "mousedown", function () {
                        w.trigger("mousedown");
                    }, w.uid), c.addEvent(j.get(i.container), "mouseup", function () {
                        w.trigger("mouseup");
                    }, w.uid), n.onchange = function q() {
                        if (k = [], i.directory ? d.each(this.files, function (m) {
                                "." !== m.name && k.push(m);
                            }) : k = [].slice.call(this.files), "IE" !== h.browser && "IEMobile" !== h.browser) {
                            this.value = "";
                        } else {
                            var l = this.cloneNode(!0);
                            this.parentNode.replaceChild(l, this), l.onchange = q;
                        }
                        w.trigger("change");
                    }, w.trigger({type: "ready", async: !0}), t = null;
                }, getFiles: function () {
                    return k;
                }, disable: function (m) {
                    var l = this.getRuntime(), a;
                    (a = j.get(l.uid)) && (a.disabled = !!m);
                }, destroy: function () {
                    var a = this.getRuntime(), e = a.getShim(), l = a.getShimContainer();
                    c.removeAllEvents(l, this.uid), c.removeAllEvents(i && j.get(i.container), this.uid), c.removeAllEvents(i && j.get(i.browse_button), this.uid), l && (l.innerHTML = ""), e.removeInstance(this.uid), k = i = l = e = null;
                }
            });
        }

        return g.FileInput = b;
    }), a6(aC, [aB, aS, ba, aq, a2], function (d, b, g, a, c) {
        function f() {
            function n(h) {
                if (!h.dataTransfer || !h.dataTransfer.types) {
                    return !1;
                }
                var l = b.toArray(h.dataTransfer.types || []);
                return -1 !== b.inArray("Files", l) || -1 !== b.inArray("public.file-url", l) || -1 !== b.inArray("application/x-moz-file", l);
            }

            function i(l) {
                for (var o = [], h = 0; h < l.length; h++) {
                    [].push.apply(o, l[h].extensions.split(/\s*,\s*/));
                }
                return -1 === b.inArray("*", o) ? o : [];
            }

            function r(h) {
                if (!m.length) {
                    return !0;
                }
                var l = c.getFileExtension(h.name);
                return !l || -1 !== b.inArray(l, m);
            }

            function v(l, o) {
                var h = [];
                b.each(l, function (u) {
                    var s = u.webkitGetAsEntry();
                    if (s) {
                        if (s.isFile) {
                            var w = u.getAsFile();
                            r(w) && p.push(w);
                        } else {
                            h.push(s);
                        }
                    }
                }), h.length ? t(h, o) : o();
            }

            function t(l, o) {
                var h = [];
                b.each(l, function (s) {
                    h.push(function (e) {
                        q(s, e);
                    });
                }), b.inSeries(h, function () {
                    o();
                });
            }

            function q(l, h) {
                l.isFile ? l.file(function (o) {
                    r(o) && p.push(o), h();
                }, function () {
                    h();
                }) : l.isDirectory ? j(l, h) : h();
            }

            function j(s, l) {
                function u(w) {
                    o.readEntries(function (e) {
                        e.length ? ([].push.apply(h, e), u(w)) : w();
                    }, w);
                }

                var h = [], o = s.createReader();
                u(function () {
                    t(h, l);
                });
            }

            var p = [], m = [], k;
            b.extend(this, {
                init: function (l) {
                    var h = this, e;
                    k = l, m = i(k.accept), e = k.container, a.addEvent(e, "dragover", function (o) {
                        n(o) && (o.preventDefault(), o.dataTransfer.dropEffect = "copy");
                    }, h.uid), a.addEvent(e, "drop", function (o) {
                        n(o) && (o.preventDefault(), p = [], o.dataTransfer.items && o.dataTransfer.items[0].webkitGetAsEntry ? v(o.dataTransfer.items, function () {
                            h.trigger("drop");
                        }) : (b.each(o.dataTransfer.files, function (s) {
                            r(s) && p.push(s);
                        }), h.trigger("drop")));
                    }, h.uid), a.addEvent(e, "dragenter", function (o) {
                        h.trigger("dragenter");
                    }, h.uid), a.addEvent(e, "dragleave", function (o) {
                        h.trigger("dragleave");
                    }, h.uid);
                }, getFiles: function () {
                    return p;
                }, destroy: function () {
                    a.removeAllEvents(k && g.get(k.container), this.uid), p = m = k = null;
                }
            });
        }

        return d.FileDrop = f;
    }), a6(az, [aB, a1, aS], function (c, b, d) {
        function a() {
            function h(i) {
                return b.atob(i.substring(i.indexOf("base64,") + 7));
            }

            var f, g = !1;
            d.extend(this, {
                read: function (j, i) {
                    var k = this;
                    f = new window.FileReader, f.addEventListener("progress", function (l) {
                        k.trigger(l);
                    }), f.addEventListener("load", function (l) {
                        k.trigger(l);
                    }), f.addEventListener("error", function (l) {
                        k.trigger(l, f.error);
                    }), f.addEventListener("loadend", function () {
                        f = null;
                    }), "function" === d.typeOf(f[j]) ? (g = !1, f[j](i.getSource())) : "readAsBinaryString" === j && (g = !0, f.readAsDataURL(i.getSource()));
                }, getResult: function () {
                    return f && f.result ? g ? h(f.result) : f.result : null;
                }, abort: function () {
                    f && f.abort();
                }, destroy: function () {
                    f = null;
                }
            });
        }

        return c.FileReader = a;
    }), a6(aw, [aB, aS, a2, aj, aQ, aO, aE, a7, bc], function (h, m, f, g, b, d, k, p, l) {
        function j() {
            function q(w, u) {
                var x = this, c, v;
                c = u.getBlob().getSource(), v = new window.FileReader, v.onload = function () {
                    u.append(u.getBlobName(), new d(null, {type: c.type, data: v.result})), n.send.call(x, w, u);
                }, v.readAsBinaryString(c);
            }

            function s() {
                return !window.XMLHttpRequest || "IE" === l.browser && l.version < 8 ? function () {
                    for (var u = ["Msxml2.XMLHTTP.6.0", "Microsoft.XMLHTTP"], c = 0; c < u.length; c++) {
                        try {
                            return new ActiveXObject(u[c]);
                        } catch (v) {
                        }
                    }
                }() : new window.XMLHttpRequest;
            }

            function a(u) {
                var c = u.responseXML, v = u.responseText;
                return "IE" === l.browser && v && c && !c.documentElement && /[^\/]+\/[^\+]+\+xml/.test(u.getResponseHeader("Content-Type")) && (c = new window.ActiveXObject("Microsoft.XMLDOM"), c.async = !1, c.validateOnParse = !1, c.loadXML(v)), c && ("IE" === l.browser && 0 !== c.parseError || !c.documentElement || "parsererror" === c.documentElement.tagName) ? null : c;
            }

            function r(x) {
                var v = "----moxieboundary" + (new Date).getTime(), y = "--", u = "\r\n", w = "", c = this.getRuntime();
                if (!c.can("send_binary_string")) {
                    throw new p.RuntimeError(p.RuntimeError.NOT_SUPPORTED_ERR);
                }
                return i.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + v), x.each(function (z, t) {
                    w += z instanceof d ? y + v + u + 'Content-Disposition: form-data; name="' + t + '"; filename="' + unescape(encodeURIComponent(z.name || "blob")) + '"' + u + "Content-Type: " + (z.type || "application/octet-stream") + u + u + z.getSource() + u : y + v + u + 'Content-Disposition: form-data; name="' + t + '"' + u + u + unescape(encodeURIComponent(z)) + u;
                }), w += y + v + y + u;
            }

            var n = this, i, o;
            m.extend(this, {
                send: function (z, x) {
                    var u = this, e = "Mozilla" === l.browser && l.version >= 4 && l.version < 7, y = "Android Browser" === l.browser, c = !1;
                    if (o = z.url.replace(/^.+?\/([\w\-\.]+)$/, "$1").toLowerCase(), i = s(), i.open(z.method, z.url, z.async, z.user, z.password), x instanceof d) {
                        x.isDetached() && (c = !0), x = x.getSource();
                    } else {
                        if (x instanceof k) {
                            if (x.hasBlob()) {
                                if (x.getBlob().isDetached()) {
                                    x = r.call(u, x), c = !0;
                                } else {
                                    if ((e || y) && "blob" === m.typeOf(x.getBlob().getSource()) && window.FileReader) {
                                        return void q.call(u, z, x);
                                    }
                                }
                            }
                            if (x instanceof k) {
                                var w = new window.FormData;
                                x.each(function (A, v) {
                                    A instanceof d ? w.append(v, A.getSource()) : w.append(v, A);
                                }), x = w;
                            }
                        }
                    }
                    i.upload ? (z.withCredentials && (i.withCredentials = !0), i.addEventListener("load", function (v) {
                        u.trigger(v);
                    }), i.addEventListener("error", function (v) {
                        u.trigger(v);
                    }), i.addEventListener("progress", function (v) {
                        u.trigger(v);
                    }), i.upload.addEventListener("progress", function (v) {
                        u.trigger({type: "UploadProgress", loaded: v.loaded, total: v.total});
                    })) : i.onreadystatechange = function t() {
                        switch (i.readyState) {
                            case 1:
                                break;
                            case 2:
                                break;
                            case 3:
                                var B, v;
                                try {
                                    g.hasSameOrigin(z.url) && (B = i.getResponseHeader("Content-Length") || 0), i.responseText && (v = i.responseText.length);
                                } catch (A) {
                                    B = v = 0;
                                }
                                u.trigger({type: "progress", lengthComputable: !!B, total: parseInt(B, 10), loaded: v});
                                break;
                            case 4:
                                i.onreadystatechange = function () {
                                }, u.trigger(0 === i.status ? "error" : "load");
                        }
                    }, m.isEmptyObj(z.headers) || m.each(z.headers, function (A, v) {
                        i.setRequestHeader(v, A);
                    }), "" !== z.responseType && "responseType" in i && (i.responseType = "json" !== z.responseType || l.can("return_response_type", "json") ? z.responseType : "text"), c ? i.sendAsBinary ? i.sendAsBinary(x) : !function () {
                        for (var A = new Uint8Array(x.length), v = 0; v < x.length; v++) {
                            A[v] = 255 & x.charCodeAt(v);
                        }
                        i.send(A.buffer);
                    }() : i.send(x), u.trigger("loadstart");
                }, getStatus: function () {
                    try {
                        if (i) {
                            return i.status;
                        }
                    } catch (c) {
                    }
                    return 0;
                }, getResponse: function (x) {
                    var v = this.getRuntime();
                    try {
                        switch (x) {
                            case"blob":
                                var u = new b(v.uid, i.response), y = i.getResponseHeader("Content-Disposition");
                                if (y) {
                                    var c = y.match(/filename=([\'\"'])([^\1]+)\1/);
                                    c && (o = c[2]);
                                }
                                return u.name = o, u.type || (u.type = f.getFileMime(o)), u;
                            case"json":
                                return l.can("return_response_type", "json") ? i.response : 200 === i.status && window.JSON ? JSON.parse(i.responseText) : null;
                            case"document":
                                return a(i);
                            default:
                                return "" !== i.responseText ? i.responseText : null;
                        }
                    } catch (w) {
                        return null;
                    }
                }, getAllResponseHeaders: function () {
                    try {
                        return i.getAllResponseHeaders();
                    } catch (c) {
                    }
                    return "";
                }, abort: function () {
                    i && i.abort();
                }, destroy: function () {
                    n = o = null;
                }
            });
        }

        return h.XMLHttpRequest = j;
    }), a6(am, [], function () {
        return function () {
            function c(k, j) {
                var l = b ? 0 : -8 * (j - 1), h = 0, g;
                for (g = 0; j > g; g++) {
                    h |= d.charCodeAt(k + g) << Math.abs(l + 8 * g);
                }
                return h;
            }

            function f(h, g, i) {
                i = 3 === arguments.length ? i : d.length - g - 1, d = d.substr(0, g) + h + d.substr(i + g);
            }

            function a(l, j, h) {
                var m = "", g = b ? 0 : -8 * (h - 1), k;
                for (k = 0; h > k; k++) {
                    m += String.fromCharCode(j >> Math.abs(g + 8 * k) & 255);
                }
                f(m, l, h);
            }

            var b = !1, d;
            return {
                II: function (g) {
                    return g === aT ? b : void (b = g);
                }, init: function (g) {
                    b = !1, d = g;
                }, SEGMENT: function (j, h, g) {
                    switch (arguments.length) {
                        case 1:
                            return d.substr(j, d.length - j - 1);
                        case 2:
                            return d.substr(j, h);
                        case 3:
                            f(g, j, h);
                            break;
                        default:
                            return d;
                    }
                }, BYTE: function (e) {
                    return c(e, 1);
                }, SHORT: function (e) {
                    return c(e, 2);
                }, LONG: function (g, e) {
                    return e === aT ? c(g, 4) : void a(g, e, 4);
                }, SLONG: function (e) {
                    var g = c(e, 4);
                    return g > 2147483647 ? g - 4294967296 : g;
                }, STRING: function (g, h) {
                    var e = "";
                    for (h += g; h > g; g++) {
                        e += String.fromCharCode(c(g, 1));
                    }
                    return e;
                }
            };
        };
    }), a6(a3, [am], function (b) {
        return function a(h) {
            var d = [], f, g, c, e = 0;
            if (f = new b, f.init(h), 65496 === f.SHORT(0)) {
                for (g = 2; g <= h.length;) {
                    if (c = f.SHORT(g), c >= 65488 && 65495 >= c) {
                        g += 2;
                    } else {
                        if (65498 === c || 65497 === c) {
                            break;
                        }
                        e = f.SHORT(g + 2) + 2, c >= 65505 && 65519 >= c && d.push({
                            hex: c,
                            name: "APP" + (15 & c),
                            start: g,
                            length: e,
                            segment: f.SEGMENT(g, e)
                        }), g += e;
                    }
                }
                return f.init(null), {
                    headers: d, restore: function (j) {
                        var i, k;
                        for (f.init(j), g = 65504 == f.SHORT(2) ? 4 + f.SHORT(4) : 2, k = 0, i = d.length; i > k; k++) {
                            f.SEGMENT(g, 0, d[k].segment), g += d[k].length;
                        }
                        return j = f.SEGMENT(), f.init(null), j;
                    }, strip: function (k) {
                        var m, j, l;
                        for (j = new a(k), m = j.headers, j.purge(), f.init(k), l = m.length; l--;) {
                            f.SEGMENT(m[l].start, m[l].length, "");
                        }
                        return k = f.SEGMENT(), f.init(null), k;
                    }, get: function (k) {
                        for (var i = [], l = 0, j = d.length; j > l; l++) {
                            d[l].name === k.toUpperCase() && i.push(d[l].segment);
                        }
                        return i;
                    }, set: function (l, j) {
                        var p = [], k, m, i;
                        for ("string" == typeof j ? p.push(j) : p = j, k = m = 0, i = d.length; i > k && (d[k].name === l.toUpperCase() && (d[k].segment = p[m], d[k].length = p[m].length, m++), !(m >= p.length)); k++) {
                        }
                    }, purge: function () {
                        d = [], f.init(null), f = null;
                    }
                };
            }
        };
    }), a6(af, [aS, am], function (b, c) {
        return function a() {
            function g(B, v) {
                var x = e.SHORT(B), l, t, E, D, C, A, y, q, w = [], z = {};
                for (l = 0; x > l; l++) {
                    if (y = A = B + 12 * l + 2, E = v[e.SHORT(y)], E !== aT) {
                        switch (D = e.SHORT(y += 2), C = e.LONG(y += 2), y += 4, w = [], D) {
                            case 1:
                            case 7:
                                for (C > 4 && (y = e.LONG(y) + m.tiffHeader), t = 0; C > t; t++) {
                                    w[t] = e.BYTE(y + t);
                                }
                                break;
                            case 2:
                                C > 4 && (y = e.LONG(y) + m.tiffHeader), z[E] = e.STRING(y, C - 1);
                                continue;
                            case 3:
                                for (C > 2 && (y = e.LONG(y) + m.tiffHeader), t = 0; C > t; t++) {
                                    w[t] = e.SHORT(y + 2 * t);
                                }
                                break;
                            case 4:
                                for (C > 1 && (y = e.LONG(y) + m.tiffHeader), t = 0; C > t; t++) {
                                    w[t] = e.LONG(y + 4 * t);
                                }
                                break;
                            case 5:
                                for (y = e.LONG(y) + m.tiffHeader, t = 0; C > t; t++) {
                                    w[t] = e.LONG(y + 4 * t) / e.LONG(y + 4 * t + 4);
                                }
                                break;
                            case 9:
                                for (y = e.LONG(y) + m.tiffHeader, t = 0; C > t; t++) {
                                    w[t] = e.SLONG(y + 4 * t);
                                }
                                break;
                            case 10:
                                for (y = e.LONG(y) + m.tiffHeader, t = 0; C > t; t++) {
                                    w[t] = e.SLONG(y + 4 * t) / e.SLONG(y + 4 * t + 4);
                                }
                                break;
                            default:
                                continue;
                        }
                        q = 1 == C ? w[0] : w, z[E] = d.hasOwnProperty(E) && "object" != typeof q ? d[E][q] : q;
                    }
                }
                return z;
            }

            function j() {
                var i = m.tiffHeader;
                return e.II(18761 == e.SHORT(i)), 42 !== e.SHORT(i += 2) ? !1 : (m.IFD0 = m.tiffHeader + e.LONG(i += 2), f = g(m.IFD0, h.tiff), "ExifIFDPointer" in f && (m.exifIFD = m.tiffHeader + f.ExifIFDPointer, delete f.ExifIFDPointer), "GPSInfoIFDPointer" in f && (m.gpsIFD = m.tiffHeader + f.GPSInfoIFDPointer, delete f.GPSInfoIFDPointer), !0);
            }

            function k(y, B, s) {
                var w, p, q, A = 0;
                if ("string" == typeof B) {
                    var v = h[y.toLowerCase()];
                    for (var z in v) {
                        if (v[z] === B) {
                            B = z;
                            break;
                        }
                    }
                }
                w = m[y.toLowerCase() + "IFD"], p = e.SHORT(w);
                for (var x = 0; p > x; x++) {
                    if (q = w + 12 * x + 2, e.SHORT(q) == B) {
                        A = q + 8;
                        break;
                    }
                }
                return A ? (e.LONG(A, s), !0) : !1;
            }

            var e, h, f, m = {}, d;
            return e = new c, h = {
                tiff: {
                    274: "Orientation",
                    270: "ImageDescription",
                    271: "Make",
                    272: "Model",
                    305: "Software",
                    34665: "ExifIFDPointer",
                    34853: "GPSInfoIFDPointer"
                },
                exif: {
                    36864: "ExifVersion",
                    40961: "ColorSpace",
                    40962: "PixelXDimension",
                    40963: "PixelYDimension",
                    36867: "DateTimeOriginal",
                    33434: "ExposureTime",
                    33437: "FNumber",
                    34855: "ISOSpeedRatings",
                    37377: "ShutterSpeedValue",
                    37378: "ApertureValue",
                    37383: "MeteringMode",
                    37384: "LightSource",
                    37385: "Flash",
                    37386: "FocalLength",
                    41986: "ExposureMode",
                    41987: "WhiteBalance",
                    41990: "SceneCaptureType",
                    41988: "DigitalZoomRatio",
                    41992: "Contrast",
                    41993: "Saturation",
                    41994: "Sharpness"
                },
                gps: {0: "GPSVersionID", 1: "GPSLatitudeRef", 2: "GPSLatitude", 3: "GPSLongitudeRef", 4: "GPSLongitude"}
            }, d = {
                ColorSpace: {1: "sRGB", 0: "Uncalibrated"},
                MeteringMode: {
                    0: "Unknown",
                    1: "Average",
                    2: "CenterWeightedAverage",
                    3: "Spot",
                    4: "MultiSpot",
                    5: "Pattern",
                    6: "Partial",
                    255: "Other"
                },
                LightSource: {
                    1: "Daylight",
                    2: "Fliorescent",
                    3: "Tungsten",
                    4: "Flash",
                    9: "Fine weather",
                    10: "Cloudy weather",
                    11: "Shade",
                    12: "Daylight fluorescent (D 5700 - 7100K)",
                    13: "Day white fluorescent (N 4600 -5400K)",
                    14: "Cool white fluorescent (W 3900 - 4500K)",
                    15: "White fluorescent (WW 3200 - 3700K)",
                    17: "Standard light A",
                    18: "Standard light B",
                    19: "Standard light C",
                    20: "D55",
                    21: "D65",
                    22: "D75",
                    23: "D50",
                    24: "ISO studio tungsten",
                    255: "Other"
                },
                Flash: {
                    0: "Flash did not fire.",
                    1: "Flash fired.",
                    5: "Strobe return light not detected.",
                    7: "Strobe return light detected.",
                    9: "Flash fired, compulsory flash mode",
                    13: "Flash fired, compulsory flash mode, return light not detected",
                    15: "Flash fired, compulsory flash mode, return light detected",
                    16: "Flash did not fire, compulsory flash mode",
                    24: "Flash did not fire, auto mode",
                    25: "Flash fired, auto mode",
                    29: "Flash fired, auto mode, return light not detected",
                    31: "Flash fired, auto mode, return light detected",
                    32: "No flash function",
                    65: "Flash fired, red-eye reduction mode",
                    69: "Flash fired, red-eye reduction mode, return light not detected",
                    71: "Flash fired, red-eye reduction mode, return light detected",
                    73: "Flash fired, compulsory flash mode, red-eye reduction mode",
                    77: "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected",
                    79: "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected",
                    89: "Flash fired, auto mode, red-eye reduction mode",
                    93: "Flash fired, auto mode, return light not detected, red-eye reduction mode",
                    95: "Flash fired, auto mode, return light detected, red-eye reduction mode"
                },
                ExposureMode: {0: "Auto exposure", 1: "Manual exposure", 2: "Auto bracket"},
                WhiteBalance: {0: "Auto white balance", 1: "Manual white balance"},
                SceneCaptureType: {0: "Standard", 1: "Landscape", 2: "Portrait", 3: "Night scene"},
                Contrast: {0: "Normal", 1: "Soft", 2: "Hard"},
                Saturation: {0: "Normal", 1: "Low saturation", 2: "High saturation"},
                Sharpness: {0: "Normal", 1: "Soft", 2: "Hard"},
                GPSLatitudeRef: {N: "North latitude", S: "South latitude"},
                GPSLongitudeRef: {E: "East longitude", W: "West longitude"}
            }, {
                init: function (i) {
                    return m = {tiffHeader: 10}, i !== aT && i.length ? (e.init(i), 65505 === e.SHORT(0) && "EXIF\x00" === e.STRING(4, 5).toUpperCase() ? j() : !1) : !1;
                }, TIFF: function () {
                    return f;
                }, EXIF: function () {
                    var i;
                    if (i = g(m.exifIFD, h.exif), i.ExifVersion && "array" === b.typeOf(i.ExifVersion)) {
                        for (var o = 0, l = ""; o < i.ExifVersion.length; o++) {
                            l += String.fromCharCode(i.ExifVersion[o]);
                        }
                        i.ExifVersion = l;
                    }
                    return i;
                }, GPS: function () {
                    var i;
                    return i = g(m.gpsIFD, h.gps), i.GPSVersionID && "array" === b.typeOf(i.GPSVersionID) && (i.GPSVersionID = i.GPSVersionID.join(".")), i;
                }, setExif: function (l, i) {
                    return "PixelXDimension" !== l && "PixelYDimension" !== l ? !1 : k("exif", l, i);
                }, getBinary: function () {
                    return e.SEGMENT();
                }, purge: function () {
                    e.init(null), e = f = null, m = {};
                }
            };
        };
    }), a6(aD, [aS, a7, a3, am, af], function (d, b, g, a, c) {
        function f(e) {
            function p() {
                for (var l = 0, h, o; l <= q.length;) {
                    if (h = n.SHORT(l += 2), h >= 65472 && 65475 >= h) {
                        return l += 5, {height: n.SHORT(l), width: n.SHORT(l += 2)};
                    }
                    o = n.SHORT(l += 2), l += o - 2;
                }
                return null;
            }

            function r() {
                m && i && n && (m.purge(), i.purge(), n.init(null), q = k = i = m = n = null);
            }

            var q, n, i, m, k, j;
            if (q = e, n = new a, n.init(q), 65496 !== n.SHORT(0)) {
                throw new b.ImageError(b.ImageError.WRONG_FORMAT);
            }
            i = new g(e), m = new c, j = !!m.init(i.get("app1")[0]), k = p.call(this), d.extend(this, {
                type: "image/jpeg",
                size: q.length,
                width: k && k.width || 0,
                height: k && k.height || 0,
                setExif: function (h, l) {
                    return j ? ("object" === d.typeOf(h) ? d.each(h, function (s, o) {
                        m.setExif(o, s);
                    }) : m.setExif(h, l), void i.set("app1", m.getBinary())) : !1;
                },
                writeHeaders: function () {
                    return arguments.length ? i.restore(arguments[0]) : q = i.restore(q);
                },
                stripHeaders: function (h) {
                    return i.strip(h);
                },
                purge: function () {
                    r.call(this);
                }
            }), j && (this.meta = {tiff: m.TIFF(), exif: m.EXIF(), gps: m.GPS()});
        }

        return f;
    }), a6(aN, [a7, aS, am], function (c, b, d) {
        function a(h) {
            function e() {
                var l, i;
                return l = m.call(this, 8), "IHDR" == l.type ? (i = l.start, {
                    width: n.LONG(i),
                    height: n.LONG(i += 4)
                }) : null;
            }

            function f() {
                n && (n.init(null), p = j = k = g = n = null);
            }

            function m(s) {
                var o, u, l, q;
                return o = n.LONG(s), u = n.STRING(s += 4, 4), l = s += 4, q = n.LONG(s + o), {
                    length: o,
                    type: u,
                    start: l,
                    CRC: q
                };
            }

            var p, n, k, g, j;
            p = h, n = new d, n.init(p), function () {
                var o = 0, q = 0, l = [35152, 20039, 3338, 6666];
                for (q = 0; q < l.length; q++, o += 2) {
                    if (l[q] != n.SHORT(o)) {
                        throw new c.ImageError(c.ImageError.WRONG_FORMAT);
                    }
                }
            }(), j = e.call(this), b.extend(this, {
                type: "image/png",
                size: p.length,
                width: j.width,
                height: j.height,
                purge: function () {
                    f.call(this);
                }
            }), f.call(this);
        }

        return a;
    }), a6(ay, [aS, a7, aD, aN], function (c, b, d, a) {
        return function (f) {
            var g = [d, a], e;
            e = function () {
                for (var h = 0; h < g.length; h++) {
                    try {
                        return new g[h](f);
                    } catch (i) {
                    }
                }
                throw new b.ImageError(b.ImageError.WRONG_FORMAT);
            }(), c.extend(this, {
                type: "", size: 0, width: 0, height: 0, setExif: function () {
                }, writeHeaders: function (h) {
                    return h;
                }, stripHeaders: function (h) {
                    return h;
                }, purge: function () {
                }
            }), c.extend(this, e), this.purge = function () {
                e.purge(), e = null;
            };
        };
    }), a6(aW, [], function () {
        function b(L, H, B) {
            var D = L.naturalWidth, P = L.naturalHeight, A = B.width, t = B.height, N = B.x || 0, G = B.y || 0, M = H.getContext("2d");
            a(L) && (D /= 2, P /= 2);
            var K = 1024, I = document.createElement("canvas");
            I.width = I.height = K;
            for (var C = I.getContext("2d"), F = c(L, D, P), J = 0; P > J;) {
                for (var q = J + K > P ? P - J : K, j = 0; D > j;) {
                    var n = j + K > D ? D - j : K;
                    C.clearRect(0, 0, K, K), C.drawImage(L, -j, -J);
                    var z = j * A / D + N << 0, Q = Math.ceil(n * A / D), k = J * t / P / F + G << 0, O = Math.ceil(q * t / P / F);
                    M.drawImage(I, 0, 0, n, q, z, k, Q, O), j += K;
                }
                J += K;
            }
            I = C = null;
        }

        function a(h) {
            var f = h.naturalWidth, j = h.naturalHeight;
            if (f * j > 1048576) {
                var d = document.createElement("canvas");
                d.width = d.height = 1;
                var g = d.getContext("2d");
                return g.drawImage(h, -f + 1, 0), 0 === g.getImageData(0, 0, 1, 1).data[3];
            }
            return !1;
        }

        function c(k, v, g) {
            var j = document.createElement("canvas");
            j.width = 1, j.height = g;
            var d = j.getContext("2d");
            d.drawImage(k, 0, 0);
            for (var f = d.getImageData(0, 0, 1, g).data, p = 0, w = g, q = g; q > p;) {
                var m = f[4 * (q - 1) + 3];
                0 === m ? w = q : p = q, q = w + p >> 1;
            }
            j = null;
            var h = q / g;
            return 0 === h ? 1 : h;
        }

        return {isSubsampled: a, renderTo: b};
    }), a6(ac, [aB, aS, a7, a1, aQ, ay, aW, a2, bc], function (h, m, f, g, b, d, k, p, l) {
        function j() {
            function t() {
                if (!H && !B) {
                    throw new f.ImageError(f.DOMException.INVALID_STATE_ERR);
                }
                return H || B;
            }

            function z(c) {
                return g.atob(c.substring(c.indexOf("base64,") + 7));
            }

            function n(v, c) {
                return "data:" + (c || "") + ";base64," + g.btoa(v);
            }

            function u(v) {
                var c = this;
                B = new Image, B.onerror = function () {
                    r.call(this), c.trigger("error", f.ImageError.WRONG_FORMAT);
                }, B.onload = function () {
                    c.trigger("load");
                }, B.src = /^data:[^;]*;base64,/.test(v) ? v : n(v, C.type);
            }

            function s(x, v) {
                var c = this, w;
                return window.FileReader ? (w = new FileReader, w.onload = function () {
                    v(this.result);
                }, w.onerror = function () {
                    c.trigger("error", f.ImageError.WRONG_FORMAT);
                }, w.readAsDataURL(x), void 0) : v(x.getAsDataURL());
            }

            function q(x, E, e, w) {
                var N = this, Q, P, M = 0, y = 0, L, K, I, J;
                if (o = w, J = this.meta && this.meta.tiff && this.meta.tiff.Orientation || 1, -1 !== m.inArray(J, [5, 6, 7, 8])) {
                    var O = x;
                    x = E, E = O;
                }
                return L = t(), e ? (x = Math.min(x, L.width), E = Math.min(E, L.height), Q = Math.max(x / L.width, E / L.height)) : Q = Math.min(x / L.width, E / L.height), Q > 1 && !e && w ? void this.trigger("Resize") : (H || (H = document.createElement("canvas")), K = Math.round(L.width * Q), I = Math.round(L.height * Q), e ? (H.width = x, H.height = E, K > x && (M = Math.round((K - x) / 2)), I > E && (y = Math.round((I - E) / 2))) : (H.width = K, H.height = I), o || i(H.width, H.height, J), a.call(this, L, H, -M, -y, K, I), this.width = H.width, this.height = H.height, A = !0, void N.trigger("Resize"));
            }

            function a(y, v, I, c, x, E) {
                if ("iOS" === l.OS) {
                    k.renderTo(y, v, {width: x, height: E, x: I, y: c});
                } else {
                    var w = v.getContext("2d");
                    w.drawImage(y, I, c, x, E);
                }
            }

            function i(w, v, x) {
                switch (x) {
                    case 5:
                    case 6:
                    case 7:
                    case 8:
                        H.width = v, H.height = w;
                        break;
                    default:
                        H.width = w, H.height = v;
                }
                var c = H.getContext("2d");
                switch (x) {
                    case 2:
                        c.translate(w, 0), c.scale(-1, 1);
                        break;
                    case 3:
                        c.translate(w, v), c.rotate(Math.PI);
                        break;
                    case 4:
                        c.translate(0, v), c.scale(1, -1);
                        break;
                    case 5:
                        c.rotate(0.5 * Math.PI), c.scale(1, -1);
                        break;
                    case 6:
                        c.rotate(0.5 * Math.PI), c.translate(0, -v);
                        break;
                    case 7:
                        c.rotate(0.5 * Math.PI), c.translate(w, -v), c.scale(-1, 1);
                        break;
                    case 8:
                        c.rotate(-0.5 * Math.PI), c.translate(-w, 0);
                }
            }

            function r() {
                D && (D.purge(), D = null), F = B = H = C = null, A = !1;
            }

            var G = this, B, D, H, F, C, A = !1, o = !0;
            m.extend(this, {
                loadFromBlob: function (x) {
                    var v = this, c = v.getRuntime(), w = arguments.length > 1 ? arguments[1] : !0;
                    if (!c.can("access_binary")) {
                        throw new f.RuntimeError(f.RuntimeError.NOT_SUPPORTED_ERR);
                    }
                    return C = x, x.isDetached() ? (F = x.getSource(), void u.call(this, F)) : void s.call(this, x.getSource(), function (y) {
                        w && (F = z(y)), u.call(v, y);
                    });
                }, loadFromImage: function (v, c) {
                    this.meta = v.meta, C = new b(null, {
                        name: v.name,
                        size: v.size,
                        type: v.type
                    }), u.call(this, c ? F = v.getAsBinaryString() : v.getAsDataURL());
                }, getInfo: function () {
                    var c = this.getRuntime(), e;
                    return !D && F && c.can("access_image_binary") && (D = new d(F)), e = {
                        width: t().width || 0,
                        height: t().height || 0,
                        type: C.type || p.getFileMime(C.name),
                        size: F && F.length || C.size || 0,
                        name: C.name || "",
                        meta: D && D.meta || this.meta || {}
                    };
                }, downsize: function () {
                    q.apply(this, arguments);
                }, getAsCanvas: function () {
                    return H && (H.id = this.uid + "_canvas"), H;
                }, getAsBlob: function (v, c) {
                    return v !== this.type && q.call(this, this.width, this.height, !1), new b(null, {
                        name: C.name || "",
                        type: v,
                        data: G.getAsBinaryString.call(this, v, c)
                    });
                }, getAsDataURL: function (v) {
                    var c = arguments[1] || 90;
                    if (!A) {
                        return B.src;
                    }
                    if ("image/jpeg" !== v) {
                        return H.toDataURL("image/png");
                    }
                    try {
                        return H.toDataURL("image/jpeg", c / 100);
                    } catch (w) {
                        return H.toDataURL("image/jpeg");
                    }
                }, getAsBinaryString: function (w, v) {
                    if (!A) {
                        return F || (F = z(G.getAsDataURL(w, v))), F;
                    }
                    if ("image/jpeg" !== w) {
                        F = z(G.getAsDataURL(w, v));
                    } else {
                        var x;
                        v || (v = 90);
                        try {
                            x = H.toDataURL("image/jpeg", v / 100);
                        } catch (c) {
                            x = H.toDataURL("image/jpeg");
                        }
                        F = z(x), D && (F = D.stripHeaders(F), o && (D.meta && D.meta.exif && D.setExif({
                            PixelXDimension: this.width,
                            PixelYDimension: this.height
                        }), F = D.writeHeaders(F)), D.purge(), D = null);
                    }
                    return A = !1, F;
                }, destroy: function () {
                    G = null, r.call(this), this.getRuntime().getShim().removeInstance(this.uid);
                }
            });
        }

        return h.Image = j;
    }), a6(a5, [aS, bc, ba, a7, a8], function (g, k, d, f, b) {
        function c() {
            var i;
            try {
                i = navigator.plugins["Shockwave Flash"], i = i.description;
            } catch (a) {
                try {
                    i = new ActiveXObject("ShockwaveFlash.ShockwaveFlash").GetVariable("$version");
                } catch (m) {
                    i = "0.0";
                }
            }
            return i = i.match(/\d+/g), parseFloat(i[0] + "." + i[1]);
        }

        function h(i) {
            var m = this, e;
            i = g.extend({swf_url: k.swf_url}, i), b.call(this, i, l, {
                access_binary: function (a) {
                    return a && "browser" === m.mode;
                },
                access_image_binary: function (a) {
                    return a && "browser" === m.mode;
                },
                display_media: b.capTrue,
                do_cors: b.capTrue,
                drag_and_drop: !1,
                report_upload_progress: function () {
                    return "client" === m.mode;
                },
                resize_image: b.capTrue,
                return_response_headers: !1,
                return_response_type: function (a) {
                    return "json" === a && window.JSON ? !0 : !g.arrayDiff(a, ["", "text", "document"]) || "browser" === m.mode;
                },
                return_status_code: function (a) {
                    return "browser" === m.mode || !g.arrayDiff(a, [200, 404]);
                },
                select_file: b.capTrue,
                select_multiple: b.capTrue,
                send_binary_string: function (a) {
                    return a && "browser" === m.mode;
                },
                send_browser_cookies: function (a) {
                    return a && "browser" === m.mode;
                },
                send_custom_headers: function (a) {
                    return a && "browser" === m.mode;
                },
                send_multipart: b.capTrue,
                slice_blob: function (a) {
                    return a && "browser" === m.mode;
                },
                stream_upload: function (a) {
                    return a && "browser" === m.mode;
                },
                summon_file_dialog: !1,
                upload_filesize: function (a) {
                    return g.parseSizeStr(a) <= 2097152 || "client" === m.mode;
                },
                use_http_method: function (a) {
                    return !g.arrayDiff(a, ["GET", "POST"]);
                }
            }, {
                access_binary: function (a) {
                    return a ? "browser" : "client";
                }, access_image_binary: function (a) {
                    return a ? "browser" : "client";
                }, report_upload_progress: function (a) {
                    return a ? "browser" : "client";
                }, return_response_type: function (a) {
                    return g.arrayDiff(a, ["", "text", "json", "document"]) ? "browser" : ["client", "browser"];
                }, return_status_code: function (a) {
                    return g.arrayDiff(a, [200, 404]) ? "browser" : ["client", "browser"];
                }, send_binary_string: function (a) {
                    return a ? "browser" : "client";
                }, send_browser_cookies: function (a) {
                    return a ? "browser" : "client";
                }, send_custom_headers: function (a) {
                    return a ? "browser" : "client";
                }, stream_upload: function (a) {
                    return a ? "client" : "browser";
                }, upload_filesize: function (a) {
                    return g.parseSizeStr(a) >= 2097152 ? "client" : "browser";
                }
            }, "client"), c() < 10 && (this.mode = !1), g.extend(this, {
                getShim: function () {
                    return d.get(this.uid);
                }, shimExec: function (o, a) {
                    var p = [].slice.call(arguments, 2);
                    return m.getShim().exec(this.uid, o, a, p);
                }, init: function () {
                    var q, a, p;
                    p = this.getShimContainer(), g.extend(p.style, {
                        position: "absolute",
                        top: "-8px",
                        left: "-8px",
                        width: "9px",
                        height: "9px",
                        overflow: "hidden"
                    }), q = '<object id="' + this.uid + '" type="application/x-shockwave-flash" data="' + i.swf_url + '" ', "IE" === k.browser && (q += 'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" '), q += 'width="100%" height="100%" style="outline:0"><param name="movie" value="' + i.swf_url + '" /><param name="flashvars" value="uid=' + escape(this.uid) + "&target=" + k.global_event_dispatcher + '" /><param name="wmode" value="transparent" /><param name="allowscriptaccess" value="always" /></object>', "IE" === k.browser ? (a = document.createElement("div"), p.appendChild(a), a.outerHTML = q, a = p = null) : p.innerHTML = q, e = setTimeout(function () {
                        m && !m.initialized && m.trigger("Error", new f.RuntimeError(f.RuntimeError.NOT_INIT_ERR));
                    }, 5000);
                }, destroy: function (a) {
                    return function () {
                        a.call(m), clearTimeout(e), i = e = a = m = null;
                    };
                }(this.destroy)
            }, j);
        }

        var l = "flash", j = {};
        return b.addConstructor(l, h), j;
    }), a6(ae, [a5, aO], function (b, a) {
        var c = {
            slice: function (g, j, d, f) {
                var h = this.getRuntime();
                return 0 > j ? j = Math.max(g.size + j, 0) : j > 0 && (j = Math.min(j, g.size)), 0 > d ? d = Math.max(g.size + d, 0) : d > 0 && (d = Math.min(d, g.size)), g = h.shimExec.call(this, "Blob", "slice", j, d, f || ""), g && (g = new a(h.uid, g)), g;
            }
        };
        return b.Blob = c;
    }), a6(ad, [a5], function (b) {
        var a = {
            init: function (c) {
                this.getRuntime().shimExec.call(this, "FileInput", "init", {
                    name: c.name,
                    accept: c.accept,
                    multiple: c.multiple
                }), this.trigger("ready");
            }
        };
        return b.FileInput = a;
    }), a6(ab, [a5, a1], function (d, b) {
        function f(g, h) {
            switch (h) {
                case"readAsText":
                    return b.atob(g, "utf8");
                case"readAsBinaryString":
                    return b.atob(g);
                case"readAsDataURL":
                    return g;
            }
            return null;
        }

        var a = "", c = {
            read: function (i, g) {
                var h = this, j = h.getRuntime();
                return "readAsDataURL" === i && (a = "data:" + (g.type || "") + ";base64,"), h.bind("Progress", function (e, k) {
                    k && (a += f(k, i));
                }), j.shimExec.call(this, "FileReader", "readAsBase64", g.uid);
            }, getResult: function () {
                return a;
            }, destroy: function () {
                a = null;
            }
        };
        return d.FileReader = c;
    }), a6(aM, [a5, a1], function (c, b) {
        function d(f, g) {
            switch (g) {
                case"readAsText":
                    return b.atob(f, "utf8");
                case"readAsBinaryString":
                    return b.atob(f);
                case"readAsDataURL":
                    return f;
            }
            return null;
        }

        var a = {
            read: function (j, g) {
                var f, h = this.getRuntime();
                return (f = h.shimExec.call(this, "FileReaderSync", "readAsBase64", g.uid)) ? ("readAsDataURL" === j && (f = "data:" + (g.type || "") + ";base64," + f), d(f, j, g.type)) : null;
            }
        };
        return c.FileReaderSync = a;
    }), a6(au, [a5, aS, aO, aQ, ag, aE, an], function (h, d, k, c, g, j, b) {
        var f = {
            send: function (p, n) {
                function a() {
                    p.transport = m.mode, m.shimExec.call(t, "XMLHttpRequest", "send", p, n);
                }

                function w(l, i) {
                    m.shimExec.call(t, "XMLHttpRequest", "appendBlob", l, i.uid), n = null, a();
                }

                function v(l, i) {
                    var r = new b;
                    r.bind("TransportingComplete", function () {
                        i(this.result);
                    }), r.transport(l.getSource(), l.type, {ruid: m.uid});
                }

                var t = this, m = t.getRuntime();
                if (d.isEmptyObj(p.headers) || d.each(p.headers, function (l, i) {
                        m.shimExec.call(t, "XMLHttpRequest", "setRequestHeader", i, l.toString());
                    }), n instanceof j) {
                    var q;
                    if (n.each(function (l, i) {
                            l instanceof k ? q = i : m.shimExec.call(t, "XMLHttpRequest", "append", i, l);
                        }), n.hasBlob()) {
                        var o = n.getBlob();
                        o.isDetached() ? v(o, function (i) {
                            o.destroy(), w(q, i);
                        }) : w(q, o);
                    } else {
                        n = null, a();
                    }
                } else {
                    n instanceof k ? n.isDetached() ? v(n, function (i) {
                        n.destroy(), n = i.uid, a();
                    }) : (n = n.uid, a()) : a();
                }
            }, getResponse: function (l) {
                var p, m, i = this.getRuntime();
                if (m = i.shimExec.call(this, "XMLHttpRequest", "getResponseAsBlob")) {
                    if (m = new c(i.uid, m), "blob" === l) {
                        return m;
                    }
                    try {
                        if (p = new g, ~d.inArray(l, ["", "text"])) {
                            return p.readAsText(m);
                        }
                        if ("json" === l && window.JSON) {
                            return JSON.parse(p.readAsText(m));
                        }
                    } finally {
                        m.destroy();
                    }
                }
                return null;
            }, abort: function (i) {
                var a = this.getRuntime();
                a.shimExec.call(this, "XMLHttpRequest", "abort"), this.dispatchEvent("readystatechange"), this.dispatchEvent("abort");
            }
        };
        return h.XMLHttpRequest = f;
    }), a6(aa, [a5, aO], function (b, a) {
        var c = {
            getAsBlob: function (f) {
                var g = this.getRuntime(), d = g.shimExec.call(this, "Transporter", "getAsBlob", f);
                return d ? new a(g.uid, d) : null;
            }
        };
        return b.Transporter = c;
    }), a6(ar, [a5, aS, an, aO, ag], function (d, b, g, a, c) {
        var f = {
            loadFromBlob: function (l) {
                function j(i) {
                    k.shimExec.call(h, "Image", "loadFromBlob", i.uid), h = k = null;
                }

                var h = this, k = h.getRuntime();
                if (l.isDetached()) {
                    var m = new g;
                    m.bind("TransportingComplete", function () {
                        j(m.result.getSource());
                    }), m.transport(l.getSource(), l.type, {ruid: k.uid});
                } else {
                    j(l.getSource());
                }
            }, loadFromImage: function (i) {
                var h = this.getRuntime();
                return h.shimExec.call(this, "Image", "loadFromImage", i.uid);
            }, getAsBlob: function (j, h) {
                var k = this.getRuntime(), i = k.shimExec.call(this, "Image", "getAsBlob", j, h);
                return i ? new a(k.uid, i) : null;
            }, getAsDataURL: function () {
                var i = this.getRuntime(), h = i.Image.getAsBlob.apply(this, arguments), j;
                return h ? (j = new c, j.readAsDataURL(h)) : null;
            }
        };
        return d.Image = f;
    }), a6(al, [aS, bc, ba, a7, a8], function (g, k, d, f, b) {
        function c(x) {
            var C = !1, q = null, w, m, p, A, D, B = 0;
            try {
                try {
                    q = new ActiveXObject("AgControl.AgControl"), q.IsVersionSupported(x) && (C = !0), q = null;
                } catch (z) {
                    var v = navigator.plugins["Silverlight Plug-In"];
                    if (v) {
                        for (w = v.description, "1.0.30226.2" === w && (w = "2.0.30226.2"), m = w.split("."); m.length > 3;) {
                            m.pop();
                        }
                        for (; m.length < 4;) {
                            m.push(0);
                        }
                        for (p = x.split("."); p.length > 4;) {
                            p.pop();
                        }
                        do {
                            A = parseInt(p[B], 10), D = parseInt(m[B], 10), B++;
                        } while (B < p.length && A === D);
                        D >= A && !isNaN(A) && (C = !0);
                    }
                }
            } catch (y) {
                C = !1;
            }
            return C;
        }

        function h(i) {
            var m = this, e;
            i = g.extend({xap_url: k.xap_url}, i), b.call(this, i, l, {
                access_binary: b.capTrue,
                access_image_binary: b.capTrue,
                display_media: b.capTrue,
                do_cors: b.capTrue,
                drag_and_drop: !1,
                report_upload_progress: b.capTrue,
                resize_image: b.capTrue,
                return_response_headers: function (a) {
                    return a && "client" === m.mode;
                },
                return_response_type: function (a) {
                    return "json" !== a ? !0 : !!window.JSON;
                },
                return_status_code: function (a) {
                    return "client" === m.mode || !g.arrayDiff(a, [200, 404]);
                },
                select_file: b.capTrue,
                select_multiple: b.capTrue,
                send_binary_string: b.capTrue,
                send_browser_cookies: function (a) {
                    return a && "browser" === m.mode;
                },
                send_custom_headers: function (a) {
                    return a && "client" === m.mode;
                },
                send_multipart: b.capTrue,
                slice_blob: b.capTrue,
                stream_upload: !0,
                summon_file_dialog: !1,
                upload_filesize: b.capTrue,
                use_http_method: function (a) {
                    return "client" === m.mode || !g.arrayDiff(a, ["GET", "POST"]);
                }
            }, {
                return_response_headers: function (a) {
                    return a ? "client" : "browser";
                }, return_status_code: function (a) {
                    return g.arrayDiff(a, [200, 404]) ? "client" : ["client", "browser"];
                }, send_browser_cookies: function (a) {
                    return a ? "browser" : "client";
                }, send_custom_headers: function (a) {
                    return a ? "client" : "browser";
                }, use_http_method: function (a) {
                    return g.arrayDiff(a, ["GET", "POST"]) ? "client" : ["client", "browser"];
                }
            }), c("2.0.31005.0") && "Opera" !== k.browser || (this.mode = !1), g.extend(this, {
                getShim: function () {
                    return d.get(this.uid).content.Moxie;
                }, shimExec: function (o, a) {
                    var p = [].slice.call(arguments, 2);
                    return m.getShim().exec(this.uid, o, a, p);
                }, init: function () {
                    var a;
                    a = this.getShimContainer(), a.innerHTML = '<object id="' + this.uid + '" data="data:application/x-silverlight," type="application/x-silverlight-2" width="100%" height="100%" style="outline:none;"><param name="source" value="' + i.xap_url + '"/><param name="background" value="Transparent"/><param name="windowless" value="true"/><param name="enablehtmlaccess" value="true"/><param name="initParams" value="uid=' + this.uid + ",target=" + k.global_event_dispatcher + '"/></object>', e = setTimeout(function () {
                        m && !m.initialized && m.trigger("Error", new f.RuntimeError(f.RuntimeError.NOT_INIT_ERR));
                    }, "Windows" !== k.OS ? 10000 : 5000);
                }, destroy: function (a) {
                    return function () {
                        a.call(m), clearTimeout(e), i = e = a = m = null;
                    };
                }(this.destroy)
            }, j);
        }

        var l = "silverlight", j = {};
        return b.addConstructor(l, h), j;
    }), a6(aX, [al, aS, ae], function (b, a, c) {
        return b.Blob = a.extend({}, c);
    }), a6(a9, [al], function (b) {
        var a = {
            init: function (d) {
                function c(g) {
                    for (var f = "", h = 0; h < g.length; h++) {
                        f += ("" !== f ? "|" : "") + g[h].title + " | *." + g[h].extensions.replace(/,/g, ";*.");
                    }
                    return f;
                }

                this.getRuntime().shimExec.call(this, "FileInput", "init", c(d.accept), d.name, d.multiple), this.trigger("ready");
            }
        };
        return b.FileInput = a;
    }), a6(a4, [al, ba, aq], function (c, b, d) {
        var a = {
            init: function () {
                var h = this, f = h.getRuntime(), g;
                return g = f.getShimContainer(), d.addEvent(g, "dragover", function (i) {
                    i.preventDefault(), i.stopPropagation(), i.dataTransfer.dropEffect = "copy";
                }, h.uid), d.addEvent(g, "dragenter", function (i) {
                    i.preventDefault();
                    var j = b.get(f.uid).dragEnter(i);
                    j && i.stopPropagation();
                }, h.uid), d.addEvent(g, "drop", function (i) {
                    i.preventDefault();
                    var j = b.get(f.uid).dragDrop(i);
                    j && i.stopPropagation();
                }, h.uid), f.shimExec.call(this, "FileDrop", "init");
            }
        };
        return c.FileDrop = a;
    }), a6(aH, [al, aS, ab], function (b, a, c) {
        return b.FileReader = a.extend({}, c);
    }), a6(aK, [al, aS, aM], function (b, a, c) {
        return b.FileReaderSync = a.extend({}, c);
    }), a6(aJ, [al, aS, au], function (b, a, c) {
        return b.XMLHttpRequest = a.extend({}, c);
    }), a6(ah, [al, aS, aa], function (b, a, c) {
        return b.Transporter = a.extend({}, c);
    }), a6(ax, [al, aS, ar], function (b, a, c) {
        return b.Image = a.extend({}, c, {
            getInfo: function () {
                var g = this.getRuntime(), h = ["tiff", "exif", "gps"], d = {meta: {}}, f = g.shimExec.call(this, "Image", "getInfo");
                return f.meta && a.each(h, function (l) {
                    var j = f.meta[l], p, m, i, k;
                    if (j && j.keys) {
                        for (d.meta[l] = {}, m = 0, i = j.keys.length; i > m; m++) {
                            p = j.keys[m], k = j[p], k && (/^(\d|[1-9]\d+)$/.test(k) ? k = parseInt(k, 10) : /^\d*\.\d+$/.test(k) && (k = parseFloat(k)), d.meta[l][p] = k);
                        }
                    }
                }), d.width = parseInt(f.width, 10), d.height = parseInt(f.height, 10), d.size = parseInt(f.size, 10), d.type = f.type, d.name = f.name, d;
            }
        });
    }), a6(aL, [aS, a7, a8, bc], function (g, d, j, c) {
        function f(e) {
            var k = this, i = j.capTest, a = j.capTrue;
            j.call(this, e, h, {
                access_binary: i(window.FileReader || window.File && File.getAsDataURL),
                access_image_binary: !1,
                display_media: i(b.Image && (c.can("create_canvas") || c.can("use_data_uri_over32kb"))),
                do_cors: !1,
                drag_and_drop: !1,
                filter_by_extension: i(function () {
                    return "Chrome" === c.browser && c.version >= 28 || "IE" === c.browser && c.version >= 10;
                }()),
                resize_image: function () {
                    return b.Image && k.can("access_binary") && c.can("create_canvas");
                },
                report_upload_progress: !1,
                return_response_headers: !1,
                return_response_type: function (l) {
                    return "json" === l && window.JSON ? !0 : !!~g.inArray(l, ["text", "document", ""]);
                },
                return_status_code: function (l) {
                    return !g.arrayDiff(l, [200, 404]);
                },
                select_file: function () {
                    return c.can("use_fileinput");
                },
                select_multiple: !1,
                send_binary_string: !1,
                send_custom_headers: !1,
                send_multipart: !0,
                slice_blob: !1,
                stream_upload: function () {
                    return k.can("select_file");
                },
                summon_file_dialog: i(function () {
                    return "Firefox" === c.browser && c.version >= 4 || "Opera" === c.browser && c.version >= 12 || !!~g.inArray(c.browser, ["Chrome", "Safari"]);
                }()),
                upload_filesize: a,
                use_http_method: function (l) {
                    return !g.arrayDiff(l, ["GET", "POST"]);
                }
            }), g.extend(this, {
                init: function () {
                    this.trigger("Init");
                }, destroy: function (l) {
                    return function () {
                        l.call(k), l = k = null;
                    };
                }(this.destroy)
            }), g.extend(this.getShim(), b);
        }

        var h = "html4", b = {};
        return j.addConstructor(h, f), b;
    }), a6(aF, [aL, aS, ba, aq, a2, bc], function (g, d, j, c, f, h) {
        function b() {
            function m() {
                var s = this, e = s.getRuntime(), v, t, o, u, a, q;
                q = d.guid("uid_"), v = e.getShimContainer(), i && (o = j.get(i + "_form"), o && d.extend(o.style, {top: "100%"})), u = document.createElement("form"), u.setAttribute("id", q + "_form"), u.setAttribute("method", "post"), u.setAttribute("enctype", "multipart/form-data"), u.setAttribute("encoding", "multipart/form-data"), d.extend(u.style, {
                    overflow: "hidden",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%"
                }), a = document.createElement("input"), a.setAttribute("id", q), a.setAttribute("type", "file"), a.setAttribute("name", n.name || "Filedata"), a.setAttribute("accept", k.join(",")), d.extend(a.style, {
                    fontSize: "999px",
                    opacity: 0
                }), u.appendChild(a), v.appendChild(u), d.extend(a.style, {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%"
                }), "IE" === h.browser && h.version < 10 && d.extend(a.style, {filter: "progid:DXImageTransform.Microsoft.Alpha(opacity=0)"}), a.onchange = function () {
                    var r;
                    this.value && (r = this.files ? this.files[0] : {name: this.value}, l = [r], this.onchange = function () {
                    }, m.call(s), s.bind("change", function p() {
                        var x = j.get(q), w = j.get(q + "_form"), y;
                        s.unbind("change", p), s.files.length && x && w && (y = s.files[0], x.setAttribute("id", y.uid), w.setAttribute("id", y.uid + "_form"), w.setAttribute("target", y.uid + "_iframe")), x = w = null;
                    }, 998), a = u = null, s.trigger("change"));
                }, e.can("summon_file_dialog") && (t = j.get(n.browse_button), c.removeEvent(t, "click", s.uid), c.addEvent(t, "click", function (p) {
                    a && !a.disabled && a.click(), p.preventDefault();
                }, s.uid)), i = q, v = o = t = null;
            }

            var i, l = [], k = [], n;
            d.extend(this, {
                init: function (p) {
                    var r = this, e = r.getRuntime(), q;
                    n = p, k = p.accept.mimes || f.extList2mimes(p.accept, e.can("filter_by_extension")), q = e.getShimContainer(), function () {
                        var s, o, a;
                        s = j.get(p.browse_button), e.can("summon_file_dialog") && ("static" === j.getStyle(s, "position") && (s.style.position = "relative"), o = parseInt(j.getStyle(s, "z-index"), 10) || 1, s.style.zIndex = o, q.style.zIndex = o - 1), a = e.can("summon_file_dialog") ? s : q, c.addEvent(a, "mouseover", function () {
                            r.trigger("mouseenter");
                        }, r.uid), c.addEvent(a, "mouseout", function () {
                            r.trigger("mouseleave");
                        }, r.uid), c.addEvent(a, "mousedown", function () {
                            r.trigger("mousedown");
                        }, r.uid), c.addEvent(j.get(p.container), "mouseup", function () {
                            r.trigger("mouseup");
                        }, r.uid), s = null;
                    }(), m.call(this), q = null, r.trigger({type: "ready", async: !0});
                }, getFiles: function () {
                    return l;
                }, disable: function (o) {
                    var a;
                    (a = j.get(i)) && (a.disabled = !!o);
                }, destroy: function () {
                    var p = this.getRuntime(), a = p.getShim(), o = p.getShimContainer();
                    c.removeAllEvents(o, this.uid), c.removeAllEvents(n && j.get(n.container), this.uid), c.removeAllEvents(n && j.get(n.browse_button), this.uid), o && (o.innerHTML = ""), a.removeInstance(this.uid), i = l = k = n = o = a = null;
                }
            });
        }

        return g.FileInput = b;
    }), a6(aI, [aL, az], function (b, a) {
        return b.FileReader = a;
    }), a6(ak, [aL, aS, ba, aj, a7, aq, aO, aE], function (g, k, d, f, b, c, h, l) {
        function j() {
            function m(y) {
                var v = this, q, x, o, w, p = !1;
                if (a) {
                    if (q = a.id.replace(/_iframe$/, ""), x = d.get(q + "_form")) {
                        for (o = x.getElementsByTagName("input"), w = o.length; w--;) {
                            switch (o[w].getAttribute("type")) {
                                case"hidden":
                                    o[w].parentNode.removeChild(o[w]);
                                    break;
                                case"file":
                                    p = !0;
                            }
                        }
                        o = [], p || x.parentNode.removeChild(x), x = null;
                    }
                    setTimeout(function () {
                        c.removeEvent(a, "load", v.uid), a.parentNode && a.parentNode.removeChild(a);
                        var e = v.getRuntime().getShimContainer();
                        e.children.length || e.parentNode.removeChild(e), e = a = null, y();
                    }, 1);
                }
            }

            var i, n, a;
            k.extend(this, {
                send: function (t, s) {
                    function q() {
                        var v = o.getShimContainer() || document.body, p = document.createElement("div");
                        p.innerHTML = '<iframe id="' + r + '_iframe" name="' + r + '_iframe" src="javascript:&quot;&quot;" style="display:none"></iframe>', a = p.firstChild, v.appendChild(a), c.addEvent(a, "load", function () {
                            var y;
                            try {
                                y = a.contentWindow.document || a.contentDocument || window.frames[a.id].document, /^4(0[0-9]|1[0-7]|2[2346])\s/.test(y.title) ? i = y.title.replace(/^(\d+).*$/, "$1") : (i = 200, n = k.trim(y.body.innerHTML), e.trigger({
                                    type: "progress",
                                    loaded: n.length,
                                    total: n.length
                                }), x && e.trigger({
                                    type: "uploadprogress",
                                    loaded: x.size || 1025,
                                    total: x.size || 1025
                                }));
                            } catch (w) {
                                if (!f.hasSameOrigin(t.url)) {
                                    return void m.call(e, function () {
                                        e.trigger("error");
                                    });
                                }
                                i = 404;
                            }
                            m.call(e, function () {
                                e.trigger("load");
                            });
                        }, e.uid);
                    }

                    var e = this, o = e.getRuntime(), r, z, u, x;
                    if (i = n = null, s instanceof l && s.hasBlob()) {
                        if (x = s.getBlob(), r = x.uid, u = d.get(r), z = d.get(r + "_form"), !z) {
                            throw new b.DOMException(b.DOMException.NOT_FOUND_ERR);
                        }
                    } else {
                        r = k.guid("uid_"), z = document.createElement("form"), z.setAttribute("id", r + "_form"), z.setAttribute("method", t.method), z.setAttribute("enctype", "multipart/form-data"), z.setAttribute("encoding", "multipart/form-data"), z.setAttribute("target", r + "_iframe"), o.getShimContainer().appendChild(z);
                    }
                    s instanceof l && s.each(function (v, w) {
                        if (v instanceof h) {
                            u && u.setAttribute("name", w);
                        } else {
                            var p = document.createElement("input");
                            k.extend(p, {
                                type: "hidden",
                                name: w,
                                value: v
                            }), u ? z.insertBefore(p, u) : z.appendChild(p);
                        }
                    }), z.setAttribute("action", t.url), q(), z.submit(), e.trigger("loadstart");
                }, getStatus: function () {
                    return i;
                }, getResponse: function (o) {
                    if ("json" === o && "string" === k.typeOf(n) && window.JSON) {
                        try {
                            return JSON.parse(n.replace(/^\s*<pre[^>]*>/, "").replace(/<\/pre>\s*$/, ""));
                        } catch (p) {
                            return null;
                        }
                    }
                    return n;
                }, abort: function () {
                    var e = this;
                    a && a.contentWindow && (a.contentWindow.stop ? a.contentWindow.stop() : a.contentWindow.document.execCommand ? a.contentWindow.document.execCommand("Stop") : a.src = "about:blank"), m.call(this, function () {
                        e.dispatchEvent("abort");
                    });
                }
            });
        }

        return g.XMLHttpRequest = j;
    }), a6(aG, [aL, ac], function (b, a) {
        return b.Image = a;
    }), bf([aS, bd, a2, bc, ba, a7, aY, a1, a8, aR, aO, aQ, aA, bg, aP, be, aj, ag, aE, ai, an, av, aq]);
}(this);
(function (c) {
    var a = {}, d = c.moxie.core.utils.Basic.inArray;
    return function b(h) {
        var f, g;
        for (f in h) {
            g = typeof h[f], g === "object" && !~d(f, ["Exceptions", "Env", "Mime"]) ? b(h[f]) : g === "function" && (a[f] = h[f]);
        }
    }(c.moxie), a.Env = c.moxie.core.utils.Env, a.Mime = c.moxie.core.utils.Mime, a.Exceptions = c.moxie.core.Exceptions, c.mOxie = a, c.o || (c.o = a), a;
})(this);
(function (f, b, h) {
    function c(k) {
        function j(p, n, o) {
            var m = {
                chunks: "slice_blob",
                jpgresize: "send_binary_string",
                pngresize: "send_binary_string",
                progress: "report_upload_progress",
                multi_selection: "select_multiple",
                dragdrop: "drag_and_drop",
                drop_element: "drag_and_drop",
                headers: "send_custom_headers",
                urlstream_upload: "send_binary_string",
                canSendBinary: "send_binary",
                triggerDialog: "summon_file_dialog"
            };
            m[p] ? l[m[p]] = n : o || (l[p] = n);
        }

        var i = k.required_features, l = {};
        if (typeof i == "string") {
            g.each(i.split(/\s*,\s*/), function (m) {
                j(m, !0);
            });
        } else {
            if (typeof i == "object") {
                g.each(i, function (n, m) {
                    j(m, n);
                });
            } else {
                if (i === !0) {
                    k.chunk_size > 0 && (l.slice_blob = !0);
                    if (k.resize.enabled || !k.multipart) {
                        l.send_binary_string = !0;
                    }
                    g.each(k, function (n, m) {
                        j(m, !!n, !0);
                    });
                }
            }
        }
        return l;
    }

    var d = f.setTimeout, a = {}, g = {
        VERSION: "2.1.2",
        STOPPED: 1,
        STARTED: 2,
        QUEUED: 1,
        UPLOADING: 2,
        FAILED: 4,
        DONE: 5,
        GENERIC_ERROR: -100,
        HTTP_ERROR: -200,
        IO_ERROR: -300,
        SECURITY_ERROR: -400,
        INIT_ERROR: -500,
        FILE_SIZE_ERROR: -600,
        FILE_EXTENSION_ERROR: -601,
        FILE_DUPLICATE_ERROR: -602,
        IMAGE_FORMAT_ERROR: -700,
        MEMORY_ERROR: -701,
        IMAGE_DIMENSIONS_ERROR: -702,
        mimeTypes: b.mimes,
        ua: b.ua,
        typeOf: b.typeOf,
        extend: b.extend,
        guid: b.guid,
        get: function (l) {
            var k = [], e;
            b.typeOf(l) !== "array" && (l = [l]);
            var j = l.length;
            while (j--) {
                e = b.get(l[j]), e && k.push(e);
            }
            return k.length ? k : null;
        },
        each: b.each,
        getPos: b.getPos,
        getSize: b.getSize,
        xmlEncode: function (j) {
            var i = {"<": "lt", ">": "gt", "&": "amp", '"': "quot", "'": "#39"}, k = /[<>&\"\']/g;
            return j ? ("" + j).replace(k, function (l) {
                return i[l] ? "&" + i[l] + ";" : l;
            }) : j;
        },
        toArray: b.toArray,
        inArray: b.inArray,
        addI18n: b.addI18n,
        translate: b.translate,
        isEmptyObj: b.isEmptyObj,
        hasClass: b.hasClass,
        addClass: b.addClass,
        removeClass: b.removeClass,
        getStyle: b.getStyle,
        addEvent: b.addEvent,
        removeEvent: b.removeEvent,
        removeAllEvents: b.removeAllEvents,
        cleanName: function (j) {
            var i, k;
            k = [/[\300-\306]/g, "A", /[\340-\346]/g, "a", /\307/g, "C", /\347/g, "c", /[\310-\313]/g, "E", /[\350-\353]/g, "e", /[\314-\317]/g, "I", /[\354-\357]/g, "i", /\321/g, "N", /\361/g, "n", /[\322-\330]/g, "O", /[\362-\370]/g, "o", /[\331-\334]/g, "U", /[\371-\374]/g, "u"];
            for (i = 0; i < k.length; i += 2) {
                j = j.replace(k[i], k[i + 1]);
            }
            return j = j.replace(/\s+/g, "_"), j = j.replace(/[^a-z0-9_\-\.]+/gi, ""), j;
        },
        buildUrl: function (j, i) {
            var k = "";
            return g.each(i, function (m, l) {
                k += (k ? "&" : "") + encodeURIComponent(l) + "=" + encodeURIComponent(m);
            }), k && (j += (j.indexOf("?") > 0 ? "&" : "?") + k), j;
        },
        formatSize: function (k) {
            function i(m, l) {
                return Math.round(m * Math.pow(10, l)) / Math.pow(10, l);
            }

            if (k === h || /\D/.test(k)) {
                return g.translate("N/A");
            }
            var j = Math.pow(1024, 4);
            return k > j ? i(k / j, 1) + " " + g.translate("tb") : k > (j /= 1024) ? i(k / j, 1) + " " + g.translate("gb") : k > (j /= 1024) ? i(k / j, 1) + " " + g.translate("mb") : k > 1024 ? Math.round(k / 1024) + " " + g.translate("kb") : k + " " + g.translate("b");
        },
        parseSize: b.parseSizeStr,
        predictRuntime: function (l, m) {
            var k, j;
            return k = new g.Uploader(l), j = b.Runtime.thatCan(k.getOption().required_features, m || l.runtimes), k.destroy(), j;
        },
        addFileFilter: function (j, i) {
            a[j] = i;
        }
    };
    g.addFileFilter("mime_types", function (j, i, k) {
        j.length && !j.regexp.test(i.name) ? (this.trigger("Error", {
            code: g.FILE_EXTENSION_ERROR,
            message: g.translate("File extension error."),
            file: i
        }), k(!1)) : k(!0);
    }), g.addFileFilter("max_file_size", function (k, i, l) {
        var j;
        k = g.parseSize(k), i.size !== j && k && i.size > k ? (this.trigger("Error", {
            code: g.FILE_SIZE_ERROR,
            message: g.translate("File size error."),
            file: i
        }), l(!1)) : l(!0);
    }), g.addFileFilter("prevent_duplicates", function (k, i, l) {
        if (k) {
            var j = this.files.length;
            while (j--) {
                if (i.name === this.files[j].name && i.size === this.files[j].size) {
                    this.trigger("Error", {
                        code: g.FILE_DUPLICATE_ERROR,
                        message: g.translate("Duplicate file error."),
                        file: i
                    }), l(!1);
                    return;
                }
            }
        }
        l(!0);
    }), g.Uploader = function (X) {
        function V() {
            var l, k = 0, m;
            if (this.state == g.STARTED) {

                for (m = 0; m < W.length; m++) {
                    !l && W[m].status == g.QUEUED ? (l = W[m], this.trigger("BeforeUpload", l) && (l.status = g.UPLOADING, this.trigger("UploadFile", l))) : k++;
                }
                k == W.length && (this.state !== g.STOPPED && (this.state = g.STOPPED, this.trigger("StateChanged")), this.trigger("UploadComplete", W));
            }
        }

        function s(k) {
            k.percent = k.size > 0 ? Math.ceil(k.loaded / k.size * 100) : 100, aa();
        }

        function aa() {
            var l, k;
            Y.reset();
            for (l = 0; l < W.length; l++) {
                k = W[l], k.size !== h ? (Y.size += k.origSize, Y.loaded += k.loaded * k.origSize / k.size) : Y.size = h, k.status == g.DONE ? Y.uploaded++ : k.status == g.FAILED ? Y.failed++ : Y.queued++;
            }
            Y.size === h ? Y.percent = W.length > 0 ? Math.ceil(Y.uploaded / W.length * 100) : 0 : (Y.bytesPerSec = Math.ceil(Y.loaded / ((+(new Date) - J || 1) / 1000)), Y.percent = Y.size > 0 ? Math.ceil(Y.loaded / Y.size * 100) : 0);
        }

        function z() {
            var k = Z[0] || U[0];
            return k ? k.getRuntime().uid : !1;
        }

        function G(l, m) {
            if (l.ruid) {
                var k = b.Runtime.getInfo(l.ruid);
                if (k) {
                    return k.can(m);
                }
            }
            return !1;
        }

        function j() {
            this.bind("FilesAdded FilesRemoved", function (k) {
                k.trigger("QueueChanged"), k.refresh();
            }), this.bind("CancelUpload", n), this.bind("BeforeUpload", I), this.bind("UploadFile", R), this.bind("UploadProgress", r), this.bind("StateChanged", K), this.bind("QueueChanged", aa), this.bind("Error", ac), this.bind("FileUploaded", q), this.bind("Destroy", H);
        }

        function t(v, w) {
            var p = this, l = 0, m = [], k = {
                runtime_order: v.runtimes,
                required_caps: v.required_features,
                preferred_caps: Q,
                swf_url: v.flash_swf_url,
                xap_url: v.silverlight_xap_url
            };
            g.each(v.runtimes.split(/\s*,\s*/), function (e) {
                v[e] && (k[e] = v[e]);
            }), v.browse_button && g.each(v.browse_button, function (e) {
                m.push(function (x) {
                    var u = new b.FileInput(g.extend({}, k, {
                        accept: v.filters.mime_types,
                        name: v.file_data_name,
                        multiple: v.multi_selection,
                        container: v.container,
                        browse_button: e
                    }));
                    u.onready = function () {
                        var y = b.Runtime.getInfo(this.ruid);
                        b.extend(p.features, {
                            chunks: y.can("slice_blob"),
                            multipart: y.can("send_multipart"),
                            multi_selection: y.can("select_multiple")
                        }), l++, Z.push(this), x();
                    }, u.onchange = function () {
                        p.addFile(this.files);
                    }, u.bind("mouseenter mouseleave mousedown mouseup", function (y) {
                        B || (v.browse_button_hover && ("mouseenter" === y.type ? b.addClass(e, v.browse_button_hover) : "mouseleave" === y.type && b.removeClass(e, v.browse_button_hover)), v.browse_button_active && ("mousedown" === y.type ? b.addClass(e, v.browse_button_active) : "mouseup" === y.type && b.removeClass(e, v.browse_button_active)));
                    }), u.bind("mousedown", function () {
                        p.trigger("Browse");
                    }), u.bind("error runtimeerror", function () {
                        u = null, x();
                    }), u.init();
                });
            }), v.drop_element && g.each(v.drop_element, function (u) {
                m.push(function (x) {
                    var e = new b.FileDrop(g.extend({}, k, {drop_zone: u}));
                    e.onready = function () {
                        var y = b.Runtime.getInfo(this.ruid);
                        p.features.dragdrop = y.can("drag_and_drop"), l++, U.push(this), x();
                    }, e.ondrop = function () {
                        p.addFile(this.files);
                    }, e.bind("error runtimeerror", function () {
                        e = null, x();
                    }), e.init();
                });
            }), b.inSeries(m, function () {
                typeof w == "function" && w(l);
            });
        }

        function i(p, m, k) {
            var l = new b.Image;
            try {
                l.onload = function () {
                    if (m.width > this.width && m.height > this.height && m.quality === h && m.preserve_headers && !m.crop) {
                        return this.destroy(), k(p);
                    }
                    l.downsize(m.width, m.height, m.crop, m.preserve_headers);
                }, l.onresize = function () {
                    k(this.getAsBlob(p.type, m.quality)), this.destroy();
                }, l.onerror = function () {
                    k(p);
                }, l.load(p);
            } catch (u) {
                k(p);
            }
        }

        function o(v, w, m) {
            function p(y, u, A) {
                var x = ab[y];
                switch (y) {
                    case"max_file_size":
                        y === "max_file_size" && (ab.max_file_size = ab.filters.max_file_size = u);
                        break;
                    case"chunk_size":
                        if (u = g.parseSize(u)) {
                            ab[y] = u, ab.send_file_name = !0;
                        }
                        break;
                    case"multipart":
                        ab[y] = u, u || (ab.send_file_name = !0);
                        break;
                    case"unique_names":
                        ab[y] = u, u && (ab.send_file_name = !0);
                        break;
                    case"filters":
                        g.typeOf(u) === "array" && (u = {mime_types: u}), A ? g.extend(ab.filters, u) : ab.filters = u, u.mime_types && (ab.filters.mime_types.regexp = function (D) {
                            var C = [];
                            return g.each(D, function (E) {
                                g.each(E.extensions.split(/,/), function (L) {
                                    /^\s*\*\s*$/.test(L) ? C.push("\\.*") : C.push("\\." + L.replace(new RegExp("[" + "/^$.*+?|()[]{}\\".replace(/./g, "\\$&") + "]", "g"), "\\$&"));
                                });
                            }), new RegExp("(" + C.join("|") + ")$", "i");
                        }(ab.filters.mime_types));
                        break;
                    case"resize":
                        A ? g.extend(ab.resize, u, {enabled: !0}) : ab.resize = u;
                        break;
                    case"prevent_duplicates":
                        ab.prevent_duplicates = ab.filters.prevent_duplicates = !!u;
                        break;
                    case"browse_button":
                    case"drop_element":
                        u = g.get(u);
                    case"container":
                    case"runtimes":
                    case"multi_selection":
                    case"flash_swf_url":
                    case"silverlight_xap_url":
                        ab[y] = u, A || (k = !0);
                        break;
                    default:
                        ab[y] = u;
                }
                A || l.trigger("OptionChanged", y, u, x);
            }

            var l = this, k = !1;
            typeof v == "object" ? g.each(v, function (x, u) {
                p(u, x, m);
            }) : p(v, w, m), m ? (ab.required_features = c(g.extend({}, ab)), Q = c(g.extend({}, ab, {required_features: !0}))) : k && (l.trigger("Destroy"), t.call(l, ab, function (u) {
                u ? (l.runtime = b.Runtime.getInfo(z()).type, l.trigger("Init", {runtime: l.runtime}), l.trigger("PostInit")) : l.trigger("Error", {
                    code: g.INIT_ERROR,
                    message: g.translate("Init error.")
                });
            }));
        }

        function I(m, k) {
            if (m.settings.unique_names) {
                var p = k.name.match(/\.([^.]+)$/), l = "part";
                p && (l = p[1]), k.target_name = k.id + "." + l;
            }
        }

        function R(x, l) {
            function v() {
                C-- > 0 ? d(k, 1000) : (l.loaded = w, x.trigger("Error", {
                    code: g.HTTP_ERROR,
                    message: g.translate("HTTP Error."),
                    file: l,
                    response: P.responseText,
                    status: P.status,
                    responseHeaders: P.getAllResponseHeaders()
                }));
            }

            function k() {
                var u, e, p = {}, E;
                if (l.status !== g.UPLOADING || x.state === g.STOPPED) {
                    return;
                }
                x.settings.send_file_name && (p.name = l.target_name || l.name), D && A.chunks && y.size > D ? (E = Math.min(D, y.size - w), u = y.slice(w, w + E)) : (E = y.size, u = y), D && A.chunks && (x.settings.send_chunk_number ? (p.chunk = Math.ceil(w / D), p.chunks = Math.ceil(y.size / D)) : (p.offset = w, p.total = y.size)), P = new b.XMLHttpRequest, P.upload && (P.upload.onprogress = function (L) {
                    l.loaded = Math.min(l.size, w + L.loaded), x.trigger("UploadProgress", l);
                }), P.onload = function () {
                    if (P.status >= 400) {
                        v();
                        return;
                    }
                    C = x.settings.max_retries, E < y.size ? (u.destroy(), w += E, l.loaded = Math.min(w, y.size), x.trigger("ChunkUploaded", l, {
                        offset: l.loaded,
                        total: y.size,
                        response: P.responseText,
                        status: P.status,
                        responseHeaders: P.getAllResponseHeaders()
                    }), b.Env.browser === "Android Browser" && x.trigger("UploadProgress", l)) : l.loaded = l.size, u = e = null, !w || w >= y.size ? (l.size != l.origSize && (y.destroy(), y = null), x.trigger("UploadProgress", l), l.status = g.DONE, x.trigger("FileUploaded", l, {
                        response: P.responseText,
                        status: P.status,
                        responseHeaders: P.getAllResponseHeaders()
                    })) : d(k, 1);
                }, P.onerror = function () {
                    v();
                }, P.onloadend = function () {
                    this.destroy(), P = null;
                }, x.settings.multipart && A.multipart ? (P.open("post", m, !0), g.each(x.settings.headers, function (M, L) {
                    P.setRequestHeader(L, M);
                }), e = new b.FormData, g.each(g.extend(p, x.settings.multipart_params), function (M, L) {
                    e.append(L, M);
                }), e.append(x.settings.file_data_name, u), P.send(e, {
                    runtime_order: x.settings.runtimes,
                    required_caps: x.settings.required_features,
                    preferred_caps: Q,
                    swf_url: x.settings.flash_swf_url,
                    xap_url: x.settings.silverlight_xap_url
                })) : (m = g.buildUrl(x.settings.url, g.extend(p, x.settings.multipart_params)), P.open("post", m, !0), P.setRequestHeader("Content-Type", "application/octet-stream"), g.each(x.settings.headers, function (M, L) {
                    P.setRequestHeader(L, M);
                }), P.send(u, {
                    runtime_order: x.settings.runtimes,
                    required_caps: x.settings.required_features,
                    preferred_caps: Q,
                    swf_url: x.settings.flash_swf_url,
                    xap_url: x.settings.silverlight_xap_url
                }));
            }

            var m = x.settings.url, D = x.settings.chunk_size, C = x.settings.max_retries, A = x.features, w = 0, y;
            l.loaded && (w = l.loaded = D ? D * Math.floor(l.loaded / D) : 0), y = l.getSource(), x.settings.resize.enabled && G(y, "send_binary_string") && !!~b.inArray(y.type, ["image/jpeg", "image/png"]) ? i.call(this, y, x.settings.resize, function (p) {
                y = p, l.size = p.size, k();
            }) : k();
        }

        function r(l, k) {
            s(k);
        }

        function K(l) {
            if (l.state == g.STARTED) {
                J = +(new Date);
            } else {
                if (l.state == g.STOPPED) {
                    for (var k = l.files.length - 1; k >= 0; k--) {
                        l.files[k].status == g.UPLOADING && (l.files[k].status = g.QUEUED, aa());
                    }
                }
            }
        }

        function n() {
            P && P.abort();
        }

        function q(k) {
            aa(), d(function () {
                V.call(k);
            }, 1);
        }

        function ac(l, k) {
            k.code === g.INIT_ERROR ? l.destroy() : k.file && (k.file.status = g.FAILED, s(k.file), l.state == g.STARTED && (l.trigger("CancelUpload"), d(function () {
                V.call(l);
            }, 1)));
        }

        function H(k) {
            k.stop(), g.each(W, function (l) {
                l.destroy();
            }), W = [], Z.length && (g.each(Z, function (l) {
                l.destroy();
            }), Z = []), U.length && (g.each(U, function (l) {
                l.destroy();
            }), U = []), Q = {}, B = !1, J = P = null, Y.reset();
        }

        var F = g.guid(), ab, W = [], Q = {}, Z = [], U = [], J, Y, B = !1, P;
        ab = {
            runtimes: b.Runtime.order,
            max_retries: 0,
            chunk_size: 0,
            multipart: !0,
            multi_selection: !0,
            file_data_name: "file",
            flash_swf_url: "js/Moxie.swf",
            silverlight_xap_url: "js/Moxie.xap",
            filters: {mime_types: [], prevent_duplicates: !1, max_file_size: 0},
            resize: {enabled: !1, preserve_headers: !0, crop: !1},
            send_file_name: !0,
            send_chunk_number: !0
        }, o.call(this, X, null, !0), Y = new g.QueueProgress, g.extend(this, {
            id: F,
            uid: F,
            state: g.STOPPED,
            features: {},
            runtime: null,
            files: W,
            settings: ab,
            total: Y,
            init: function () {
                var k = this;
                typeof ab.preinit == "function" ? ab.preinit(k) : g.each(ab.preinit, function (e, l) {
                    k.bind(l, e);
                }), j.call(this);
                if (!ab.browse_button || !ab.url) {
                    this.trigger("Error", {code: g.INIT_ERROR, message: g.translate("Init error.")});
                    return;
                }
                t.call(this, ab, function (e) {
                    typeof ab.init == "function" ? ab.init(k) : g.each(ab.init, function (l, m) {
                        k.bind(m, l);
                    }), e ? (k.runtime = b.Runtime.getInfo(z()).type, k.trigger("Init", {runtime: k.runtime}), k.trigger("PostInit")) : k.trigger("Error", {
                        code: g.INIT_ERROR,
                        message: g.translate("Init error.")
                    });
                });
            },
            setOption: function (l, k) {
                o.call(this, l, k, !this.runtime);
            },
            getOption: function (k) {
                return k ? ab[k] : ab;
            },
            refresh: function () {
                Z.length && g.each(Z, function (k) {
                    k.trigger("Refresh");
                }), this.trigger("Refresh");
            },
            start: function () {

                this.state != g.STARTED && (this.state = g.STARTED, this.trigger("StateChanged"), V.call(this));
            },
            stop: function () {
                this.state != g.STOPPED && (this.state = g.STOPPED, this.trigger("StateChanged"), this.trigger("CancelUpload"));
            },
            disableBrowse: function () {
                B = arguments[0] !== h ? arguments[0] : !0, Z.length && g.each(Z, function (k) {
                    k.disable(B);
                }), this.trigger("DisableBrowse", B);
            },
            getFile: function (l) {
                var k;
                for (k = W.length - 1; k >= 0; k--) {
                    if (W[k].id === l) {
                        return W[k];
                    }
                }
            },
            addFile: function (x, A) {
                function y(u, C) {
                    var l = [];
                    b.each(v.settings.filters, function (e, D) {
                        a[D] && l.push(function (E) {
                            a[D].call(v, e, u, function (L) {
                                E(!L);
                            });
                        });
                    }), b.inSeries(l, C);
                }

                function w(u) {
                    var l = b.typeOf(u);
                    if (u instanceof b.File) {

                        if (!u.ruid && !u.isDetached()) {
                            if (!k) {
                                return !1;
                            }
                            u.ruid = k, u.connectRuntime(k);
                        }
                        w(new g.File(u));
                    } else {

                        u instanceof b.Blob ? (w(u.getSource()), u.destroy()) : u instanceof g.File ? (A && (u.name = A), p.push(function (e) {
                            y(u, function (C) {
                                C || (W.push(u), m.push(u), v.trigger("FileFiltered", u)), d(e, 1);
                            });
                        })) : b.inArray(l, ["file", "blob"]) !== -1 ? w(new b.File(null, u)) : l === "node" && b.typeOf(u.files) === "filelist" ? b.each(u.files, w) : l === "array" && (A = null, b.each(u, w));
                    }
                }

                var v = this, p = [], m = [], k;
                k = z(), w(x), p.length && b.inSeries(p, function () {
                    m.length && v.trigger("FilesAdded", m);
                });
            },
            removeFile: function (l) {
                var k = typeof l == "string" ? l : l.id;
                for (var m = W.length - 1; m >= 0; m--) {
                    if (W[m].id === k) {
                        return this.splice(m, 1)[0];
                    }
                }
            },
            splice: function (p, l) {
                var m = W.splice(p === h ? 0 : p, l === h ? W.length : l), k = !1;
                return this.state == g.STARTED && (g.each(m, function (u) {
                    if (u.status === g.UPLOADING) {
                        return k = !0, !1;
                    }
                }), k && this.stop()), this.trigger("FilesRemoved", m), g.each(m, function (u) {
                    u.destroy();
                }), k && this.start(), m;
            },
            bind: function (m, k, p) {
                var l = this;
                g.Uploader.prototype.bind.call(this, m, function () {
                    var u = [].slice.call(arguments);
                    return u.splice(0, 1, l), k.apply(this, u);
                }, 0, p);
            },
            destroy: function () {
                this.trigger("Destroy"), ab = Y = null, this.unbindAll();
            }
        });
    }, g.Uploader.prototype = b.EventTarget.instance, g.File = function () {
        function j(e) {
            g.extend(this, {
                id: g.guid(),
                name: e.name || e.fileName,
                type: e.type || "",
                size: e.size || e.fileSize,
                origSize: e.size || e.fileSize,
                loaded: 0,
                percent: 0,
                status: g.QUEUED,
                lastModifiedDate: e.lastModifiedDate || (new Date).toLocaleString(),
                getNative: function () {
                    var k = this.getSource().getSource();
                    return b.inArray(b.typeOf(k), ["blob", "file"]) !== -1 ? k : null;
                },
                getSource: function () {
                    return i[this.id] ? i[this.id] : null;
                },
                destroy: function () {
                    var k = this.getSource();
                    k && (k.destroy(), delete i[this.id]);
                }
            }), i[this.id] = e;
        }

        var i = {};
        return j;
    }(), g.QueueProgress = function () {
        var i = this;
        i.size = 0, i.loaded = 0, i.uploaded = 0, i.failed = 0, i.queued = 0, i.percent = 0, i.bytesPerSec = 0, i.reset = function () {
            i.size = i.loaded = i.uploaded = i.failed = i.queued = i.percent = i.bytesPerSec = 0;
        };
    }, f.plupload = g;
})(window, mOxie);
(function (d, b) {
    function c(g) {
        return plupload.translate(g) || g;
    }

    function a(e, g) {
        g.contents().each(function (h, i) {
            i = d(i), i.is(".plupload") || i.remove();
        }), g.prepend('<div class="plupload_wrapper plupload_scroll"><div id="' + e + '_container" class="plupload_container">' + '<div class="plupload">' + '<div class="plupload_header">' + '<div class="plupload_header_content">' + '<div class="plupload_header_title">' + c("Select files") + "</div>" + '<div class="plupload_header_text">' + c("Add files to the upload queue and click the start button.") + "</div>" + "</div>" + "</div>" + '<div class="plupload_content">' + '<div class="plupload_filelist_header">' + '<div class="plupload_file_name">' + c("Nombre del archivo") + "</div>" + '<div class="plupload_file_action">&nbsp;</div>' + '<div class="plupload_file_status"><span>' + c("Estado") + "</span></div>" + '<div class="plupload_file_size">' + c("Tamaño") + "</div>" + '<div class="plupload_clearer">&nbsp;</div>' + "</div>" + '<ul id="' + e + '_filelist" class="plupload_filelist"></ul>' + '<div class="plupload_filelist_footer">' + '<div class="plupload_file_name">' + '<div class="plupload_buttons">' + '<a href="#" class="plupload_button plupload_add" id="' + e + '_browse">' + ' <i class="glyphicon glyphicon-upload"></i> ' + c("Adicionar archivo") + "</a>" + '<a href="#" class="plupload_button plupload_start">' +' <i class="glyphicon glyphicon-import"></i> '+ c("Importar") + "</a>" + "</div>" + '<span class="plupload_upload_status"></span>' + "</div>" + '<div class="plupload_file_action"></div>' + '<div class="plupload_file_status"><span class="plupload_total_status">0%</span></div>' + '<div class="plupload_file_size"><span class="plupload_total_file_size">0 b</span></div>' + '<div class="plupload_progress">' + '<div class="plupload_progress_container">' + '<div class="plupload_progress_bar"></div>' + "</div>" + "</div>" + '<div class="plupload_clearer">&nbsp;</div>' + "</div>" + "</div>" + "</div>" + "</div>" + '<input type="hidden" id="' + e + '_count" name="' + e + '_count" value="0" />' + "</div>");
    }

    var f = {};
    d.fn.pluploadQueue = function (e) {

        return e ? (this.each(function () {
            function q(h) {

                var p;
                flagImportProyect = false;
                h.status == plupload.DONE && (p = "plupload_done"), h.status == plupload.FAILED && (p = "plupload_failed"), h.status == plupload.QUEUED && (p = "plupload_delete"), h.status == plupload.UPLOADING && (p = "plupload_uploading");
                var l = d("#" + h.id).attr("class", p).find("a").css("display", "block");
                switch (p) {
                    case 'plupload_delete':
                        l.attr("class", 'glyphicon glyphicon-remove-circle');
                        l.attr("title", 'Click para eliminar archivo');

                    break;
                    case 'plupload_failed':

                        l.attr("class", 'glyphicon glyphicon-ban-circle');
                        l.attr("title", h.hint);

                    break;
                    case 'plupload_done':

                        l.attr("class", 'glyphicon glyphicon-ok-sign');
                        var titleWin = $('#winImport-title').html();
                        if (titleWin.indexOf('proyecto') === -1) {
                            l.attr("title", 'El índice ha sido importado satisfactoriamente');

                        }
                        else {
                            l.attr("title", 'El proyecto ha sido importado satisfactoriamente');
                            flagImportProyect = true;
                        }

                        break;
                }

            }

            function k() {

                d("span.plupload_total_status", i).html(j.total.percent + "%"), d("div.plupload_progress_bar", i).css("width", j.total.percent + "%"), d("span.plupload_upload_status", i).html(b.sprintf(c("Uploaded %d/%d files"), j.total.uploaded, j.files.length));
            }

            function n() {
                var p = d("ul.plupload_filelist", i).html(""), h = 0, l;
                d.each(j.files, function (s, u) {
                    l = "", u.status == plupload.DONE && (u.target_name && (l += '<input type="hidden" name="' + m + "_" + h + '_tmpname" value="' + plupload.xmlEncode(u.target_name) + '" />'), l += '<input type="hidden" name="' + m + "_" + h + '_name" value="' + plupload.xmlEncode(u.name) + '" />', l += '<input type="hidden" name="' + m + "_" + h + '_status" value="' + (u.status == plupload.DONE ? "done" : "failed") + '" />', h++, d("#" + m + "_count").val(h)), p.append('<li id="' + u.id + '">' + '<div class="plupload_file_name"><span>' + u.name + "</span></div>" + '<div class="plupload_file_action"><a href="#"></a></div>' + '<div class="plupload_file_status">' + u.percent + "%</div>" + '<div class="plupload_file_size">' + plupload.formatSize(u.size) + "</div>" + '<div class="plupload_clearer">&nbsp;</div>' + l + "</li>"), q(u), d("#" + u.id + ".plupload_delete a").click(function (r) {
                        d("#" + u.id).remove(), j.removeFile(u), r.preventDefault();
                    });
                }), d("span.plupload_total_file_size", i).html(plupload.formatSize(j.total.size)), j.total.queued === 0 ? d("span.plupload_add_text", i).html(c("Add Files")) : d("span.plupload_add_text", i).html(b.sprintf(c("%d files queued"), j.total.queued)), d("a.plupload_start", i).toggleClass("plupload_disabled", j.files.length == j.total.uploaded + j.total.failed), p[0].scrollTop = p[0].scrollHeight, k(), !j.files.length && j.features.dragdrop && j.settings.dragdrop && d("#" + m + "_filelist").append('<li class="plupload_droptext">' + c("Arrastrar archivo(s).") + "</li>");
            }

            function o() {
                delete f[m], j.destroy(), i.html(g), j = i = g = null;
            }

            var j, i, m, g;
            i = d(this), m = i.attr("id"), m || (m = plupload.guid(), i.attr("id", m)), g = i.html(), a(m, i), e = d.extend({
                dragdrop: !0,
                browse_button: m + "_browse",
                container: m
            }, e), e.dragdrop && (e.drop_element = m + "_filelist"), j = new plupload.Uploader(e), f[m] = j, j.bind("UploadFile", function (h, l) {
                d("#" + l.id).addClass("plupload_current_file");
            }), j.bind("Init", function (h, l) {
                !e.unique_names && e.rename && i.on("click", "#" + m + "_filelist div.plupload_file_name span", function (y) {
                    var w = d(y.target), t, v, x, p = "";
                    t = h.getFile(w.parents("li")[0].id), x = t.name, v = /^(.+)(\.[^.]+)$/.exec(x), v && (x = v[1], p = v[2]), w.hide().after('<input type="text" />'), w.next().val(x).focus().blur(function () {
                        w.show().next().remove();
                    }).keydown(function (r) {
                        var s = d(this);
                        r.keyCode == 13 && (r.preventDefault(), t.name = s.val() + p, w.html(t.name), s.blur());
                    });
                }), d("#" + m + "_container"), d("a.plupload_start", i).click(function (p) {
                    d(this).hasClass("plupload_disabled") || j.start(), p.preventDefault();
                }), d("a.plupload_stop", i).click(function (p) {
                    p.preventDefault(), j.stop();
                }), d("a.plupload_start", i).addClass("plupload_disabled");
            }), j.bind("Error", function (l, r) {
                var h = r.file, p;
                h && (p = r.message, r.details && (p += " (" + r.details + ")"), r.code == plupload.FILE_SIZE_ERROR && alert(c("Error: File too large:") + " " + h.name), r.code == plupload.FILE_EXTENSION_ERROR && tinymce.activeEditor.windowManager.MsgFlotante(3,'El archivo tiene una extensi\u00f3n inv\u00e1lida.'), h.hint = p, d("#" + h.id).attr("class", "plupload_failed").find("a").css("display", "block").attr("title", p)), r.code === plupload.INIT_ERROR && setTimeout(function () {
                    o();
                }, 1);
            }), j.bind("PostInit", function (h) {
                h.settings.dragdrop && h.features.dragdrop && d("#" + m + "_filelist").append('<li class="plupload_droptext">' + c("Arrastrar archivo(s).") + "</li>");
            }), j.init(), j.bind("StateChanged", function () {
                j.state === plupload.STARTED ? (d("li.plupload_delete a,div.plupload_buttons", i).hide(), j.disableBrowse(!0), d("span.plupload_upload_status,div.plupload_progress,a.plupload_stop", i).css("display", "block"), d("span.plupload_upload_status", i).html("Uploaded " + j.total.uploaded + "/" + j.files.length + " files"), e.multiple_queues && d("span.plupload_total_status,span.plupload_total_file_size", i).show()) : (n(), d("a.plupload_stop,div.plupload_progress", i).hide(), d("a.plupload_delete", i).css("display", "block"), e.multiple_queues && j.total.uploaded + j.total.failed == j.files.length && (d(".plupload_buttons,.plupload_upload_status", i).css("display", "inline"), j.disableBrowse(!1), d(".plupload_start", i).addClass("plupload_disabled"), d("span.plupload_total_status,span.plupload_total_file_size", i).hide()));
            }), j.bind("FilesAdded", n), j.bind("FilesRemoved", function () {
                var h = d("#" + m + "_filelist").scrollTop();
                n(), d("#" + m + "_filelist").scrollTop(h);
            }), j.bind("FileUploaded", function (l, h) {
                q(h);
            }), j.bind("UploadProgress", function (h, l) {
                d("#" + l.id + " div.plupload_file_status", i).html(l.percent + "%"), q(l), k();
            }), e.setup && e.setup(j);
        }), this) : f[d(this[0]).attr("id")];
    };
})(j_doksoft_file, mOxie);
j_doksoft_file(function () {
    var a = [];
    if (window["doksoft_file_allowedExt"] != "*") {
        a = [{title: "Acceptable files", extensions: window["doksoft_file_allowedExt"]}];
    }
    //a = [{title: "Acceptable files", extensions: "aplication/zip"}];
    window["doksoftPlupload2"] = j_doksoft_file("#plupload2_doksoft_file").pluploadQueue({
        runtimes: "html5,flash",
        url: window["doksoft_file_doksoftUploaderUrl"],
        unique_names: true,
        filters: a,
        flash_swf_url: window["doksoft_file_tinyMCEPluginPath"] + "plupload2/Moxie.swf",
        silverlight_xap_url: window["doksoft_file_tinyMCEPluginPath"] + "plupload2/Moxie.xap",
        init: {
            FileUploaded: function (d, c, b) {

                var resp = JSON.parse(b.response);

                    if(resp.succes){
                        if(!flagImportProyect){
                            var toadd = resp.html.replace(/nav/g, " ");
                            $('#menuIndice').html(toadd);
                        }

                    }else{
                        d.trigger("Error", {code: 500, message: resp.mensaje, details: "", file: c});

                    }

                /*if (b.response.substr(0, 1) == "!") {
                 console.log('mmmm');
                 d.trigger("Error", {code: 500, message: b.response.substr(1), details: "", file: c});
                 } else {*/
                if (window["doksoft_file_doksoftUploadedFiles"][window["doksoft_file_doksoftUploadedFiles"].length - 1] != b.response) {

                    window["doksoft_file_doksoftUploadedFiles"].push(b.response);

                }

            }
        }
    });
    window["doksoft_file_doksoftUploadedFiles"] = [];
});
