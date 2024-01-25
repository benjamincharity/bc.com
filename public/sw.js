var Un = Object.create;
var ot = Object.defineProperty;
var On = Object.getOwnPropertyDescriptor;
var kn = Object.getOwnPropertyNames;
var Hn = Object.getPrototypeOf,
  In = Object.prototype.hasOwnProperty;
var Nn = (e, t) => () => (e && (t = e((e = 0))), t);
var Y = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports),
  zn = (e, t) => {
    for (var r in t) ot(e, r, { get: t[r], enumerable: !0 });
  },
  Jt = (e, t, r, n) => {
    if ((t && typeof t == 'object') || typeof t == 'function')
      for (let a of kn(t))
        !In.call(e, a) &&
          a !== r &&
          ot(e, a, {
            get: () => t[a],
            enumerable: !(n = On(t, a)) || n.enumerable,
          });
    return e;
  };
var G = (e, t, r) => (
    (r = e != null ? Un(Hn(e)) : {}),
    Jt(
      t || !e || !e.__esModule
        ? ot(r, 'default', { value: e, enumerable: !0 })
        : r,
      e
    )
  ),
  Yt = (e) => Jt(ot({}, '__esModule', { value: !0 }), e);
var Mt = {};
zn(Mt, {
  AbortedDeferredError: () => Ve,
  Action: () => q,
  IDLE_BLOCKER: () => Ce,
  IDLE_FETCHER: () => Sr,
  IDLE_NAVIGATION: () => it,
  UNSAFE_DEFERRED_SYMBOL: () => _r,
  UNSAFE_DeferredData: () => st,
  UNSAFE_ErrorResponseImpl: () => Xe,
  UNSAFE_convertRouteMatchToUiMatch: () => cr,
  UNSAFE_convertRoutesToDataRoutes: () => Ke,
  UNSAFE_getResolveToMatches: () => gr,
  UNSAFE_invariant: () => F,
  UNSAFE_warning: () => ae,
  createBrowserHistory: () => qn,
  createHashHistory: () => $n,
  createMemoryHistory: () => Bn,
  createPath: () => de,
  createRouter: () => va,
  createStaticHandler: () => wa,
  defer: () => vr,
  generatePath: () => aa,
  getStaticContextFromError: () => Ra,
  getToPathname: () => da,
  isDeferredData: () => Ar,
  isRouteErrorResponse: () => Ge,
  joinPaths: () => Fe,
  json: () => Pt,
  matchPath: () => dt,
  matchRoutes: () => ye,
  normalizePathname: () => br,
  parsePath: () => oe,
  redirect: () => Lt,
  redirectDocument: () => wr,
  resolvePath: () => mr,
  resolveTo: () => yr,
  stripBasename: () => Ye,
});
function C() {
  return (
    (C = Object.assign
      ? Object.assign.bind()
      : function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var r = arguments[t];
            for (var n in r)
              Object.prototype.hasOwnProperty.call(r, n) && (e[n] = r[n]);
          }
          return e;
        }),
    C.apply(this, arguments)
  );
}
function Bn(e) {
  e === void 0 && (e = {});
  let { initialEntries: t = ['/'], initialIndex: r, v5Compat: n = !1 } = e,
    a;
  a = t.map((y, R) =>
    f(y, typeof y == 'string' ? null : y.state, R === 0 ? 'default' : void 0)
  );
  let s = u(r ?? a.length - 1),
    o = q.Pop,
    d = null;
  function u(y) {
    return Math.min(Math.max(y, 0), a.length - 1);
  }
  function m() {
    return a[s];
  }
  function f(y, R, w) {
    R === void 0 && (R = null);
    let b = fe(a ? m().pathname : '/', y, R, w);
    return (
      ae(
        b.pathname.charAt(0) === '/',
        'relative pathnames are not supported in memory history: ' +
          JSON.stringify(y)
      ),
      b
    );
  }
  function x(y) {
    return typeof y == 'string' ? y : de(y);
  }
  return {
    get index() {
      return s;
    },
    get action() {
      return o;
    },
    get location() {
      return m();
    },
    createHref: x,
    createURL(y) {
      return new URL(x(y), 'http://localhost');
    },
    encodeLocation(y) {
      let R = typeof y == 'string' ? oe(y) : y;
      return {
        pathname: R.pathname || '',
        search: R.search || '',
        hash: R.hash || '',
      };
    },
    push(y, R) {
      o = q.Push;
      let w = f(y, R);
      (s += 1),
        a.splice(s, a.length, w),
        n && d && d({ action: o, location: w, delta: 1 });
    },
    replace(y, R) {
      o = q.Replace;
      let w = f(y, R);
      (a[s] = w), n && d && d({ action: o, location: w, delta: 0 });
    },
    go(y) {
      o = q.Pop;
      let R = u(s + y),
        w = a[R];
      (s = R), d && d({ action: o, location: w, delta: y });
    },
    listen(y) {
      return (
        (d = y),
        () => {
          d = null;
        }
      );
    },
  };
}
function qn(e) {
  e === void 0 && (e = {});
  function t(n, a) {
    let { pathname: s, search: o, hash: d } = n.location;
    return fe(
      '',
      { pathname: s, search: o, hash: d },
      (a.state && a.state.usr) || null,
      (a.state && a.state.key) || 'default'
    );
  }
  function r(n, a) {
    return typeof a == 'string' ? a : de(a);
  }
  return ur(t, r, null, e);
}
function $n(e) {
  e === void 0 && (e = {});
  function t(a, s) {
    let {
      pathname: o = '/',
      search: d = '',
      hash: u = '',
    } = oe(a.location.hash.substr(1));
    return (
      !o.startsWith('/') && !o.startsWith('.') && (o = '/' + o),
      fe(
        '',
        { pathname: o, search: d, hash: u },
        (s.state && s.state.usr) || null,
        (s.state && s.state.key) || 'default'
      )
    );
  }
  function r(a, s) {
    let o = a.document.querySelector('base'),
      d = '';
    if (o && o.getAttribute('href')) {
      let u = a.location.href,
        m = u.indexOf('#');
      d = m === -1 ? u : u.slice(0, m);
    }
    return d + '#' + (typeof s == 'string' ? s : de(s));
  }
  function n(a, s) {
    ae(
      a.pathname.charAt(0) === '/',
      'relative pathnames are not supported in hash history.push(' +
        JSON.stringify(s) +
        ')'
    );
  }
  return ur(t, r, n, e);
}
function F(e, t) {
  if (e === !1 || e === null || typeof e > 'u') throw new Error(t);
}
function ae(e, t) {
  if (!e) {
    typeof console < 'u' && console.warn(t);
    try {
      throw new Error(t);
    } catch {}
  }
}
function Wn() {
  return Math.random().toString(36).substr(2, 8);
}
function Qt(e, t) {
  return { usr: e.state, key: e.key, idx: t };
}
function fe(e, t, r, n) {
  return (
    r === void 0 && (r = null),
    C(
      { pathname: typeof e == 'string' ? e : e.pathname, search: '', hash: '' },
      typeof t == 'string' ? oe(t) : t,
      { state: r, key: (t && t.key) || n || Wn() }
    )
  );
}
function de(e) {
  let { pathname: t = '/', search: r = '', hash: n = '' } = e;
  return (
    r && r !== '?' && (t += r.charAt(0) === '?' ? r : '?' + r),
    n && n !== '#' && (t += n.charAt(0) === '#' ? n : '#' + n),
    t
  );
}
function oe(e) {
  let t = {};
  if (e) {
    let r = e.indexOf('#');
    r >= 0 && ((t.hash = e.substr(r)), (e = e.substr(0, r)));
    let n = e.indexOf('?');
    n >= 0 && ((t.search = e.substr(n)), (e = e.substr(0, n))),
      e && (t.pathname = e);
  }
  return t;
}
function ur(e, t, r, n) {
  n === void 0 && (n = {});
  let { window: a = document.defaultView, v5Compat: s = !1 } = n,
    o = a.history,
    d = q.Pop,
    u = null,
    m = f();
  m == null && ((m = 0), o.replaceState(C({}, o.state, { idx: m }), ''));
  function f() {
    return (o.state || { idx: null }).idx;
  }
  function x() {
    d = q.Pop;
    let b = f(),
      p = b == null ? null : b - m;
    (m = b), u && u({ action: d, location: w.location, delta: p });
  }
  function g(b, p) {
    d = q.Push;
    let P = fe(w.location, b, p);
    r && r(P, b), (m = f() + 1);
    let U = Qt(P, m),
      T = w.createHref(P);
    try {
      o.pushState(U, '', T);
    } catch (O) {
      if (O instanceof DOMException && O.name === 'DataCloneError') throw O;
      a.location.assign(T);
    }
    s && u && u({ action: d, location: w.location, delta: 1 });
  }
  function y(b, p) {
    d = q.Replace;
    let P = fe(w.location, b, p);
    r && r(P, b), (m = f());
    let U = Qt(P, m),
      T = w.createHref(P);
    o.replaceState(U, '', T),
      s && u && u({ action: d, location: w.location, delta: 0 });
  }
  function R(b) {
    let p = a.location.origin !== 'null' ? a.location.origin : a.location.href,
      P = typeof b == 'string' ? b : de(b);
    return (
      F(
        p,
        'No window.location.(origin|href) available to create URL for href: ' +
          P
      ),
      new URL(P, p)
    );
  }
  let w = {
    get action() {
      return d;
    },
    get location() {
      return e(a, o);
    },
    listen(b) {
      if (u) throw new Error('A history only accepts one active listener');
      return (
        a.addEventListener(Gt, x),
        (u = b),
        () => {
          a.removeEventListener(Gt, x), (u = null);
        }
      );
    },
    createHref(b) {
      return t(a, b);
    },
    createURL: R,
    encodeLocation(b) {
      let p = R(b);
      return { pathname: p.pathname, search: p.search, hash: p.hash };
    },
    push: g,
    replace: y,
    go(b) {
      return o.go(b);
    },
  };
  return w;
}
function Vn(e) {
  return e.index === !0;
}
function Ke(e, t, r, n) {
  return (
    r === void 0 && (r = []),
    n === void 0 && (n = {}),
    e.map((a, s) => {
      let o = [...r, s],
        d = typeof a.id == 'string' ? a.id : o.join('-');
      if (
        (F(
          a.index !== !0 || !a.children,
          'Cannot specify children on an index route'
        ),
        F(
          !n[d],
          'Found a route id collision on id "' +
            d +
            `".  Route id's must be globally unique within Data Router usages`
        ),
        Vn(a))
      ) {
        let u = C({}, a, t(a), { id: d });
        return (n[d] = u), u;
      } else {
        let u = C({}, a, t(a), { id: d, children: void 0 });
        return (
          (n[d] = u), a.children && (u.children = Ke(a.children, t, o, n)), u
        );
      }
    })
  );
}
function ye(e, t, r) {
  r === void 0 && (r = '/');
  let n = typeof t == 'string' ? oe(t) : t,
    a = Ye(n.pathname || '/', r);
  if (a == null) return null;
  let s = fr(e);
  Xn(s);
  let o = null;
  for (let d = 0; o == null && d < s.length; ++d) o = na(s[d], ia(a));
  return o;
}
function cr(e, t) {
  let { route: r, pathname: n, params: a } = e;
  return { id: r.id, pathname: n, params: a, data: t[r.id], handle: r.handle };
}
function fr(e, t, r, n) {
  t === void 0 && (t = []), r === void 0 && (r = []), n === void 0 && (n = '');
  let a = (s, o, d) => {
    let u = {
      relativePath: d === void 0 ? s.path || '' : d,
      caseSensitive: s.caseSensitive === !0,
      childrenIndex: o,
      route: s,
    };
    u.relativePath.startsWith('/') &&
      (F(
        u.relativePath.startsWith(n),
        'Absolute route path "' +
          u.relativePath +
          '" nested under path ' +
          ('"' + n + '" is not valid. An absolute child route path ') +
          'must start with the combined path of all its parent routes.'
      ),
      (u.relativePath = u.relativePath.slice(n.length)));
    let m = Fe([n, u.relativePath]),
      f = r.concat(u);
    s.children &&
      s.children.length > 0 &&
      (F(
        s.index !== !0,
        'Index routes must not have child routes. Please remove ' +
          ('all child routes from route path "' + m + '".')
      ),
      fr(s.children, t, f, m)),
      !(s.path == null && !s.index) &&
        t.push({ path: m, score: ta(m, s.index), routesMeta: f });
  };
  return (
    e.forEach((s, o) => {
      var d;
      if (s.path === '' || !((d = s.path) != null && d.includes('?'))) a(s, o);
      else for (let u of hr(s.path)) a(s, o, u);
    }),
    t
  );
}
function hr(e) {
  let t = e.split('/');
  if (t.length === 0) return [];
  let [r, ...n] = t,
    a = r.endsWith('?'),
    s = r.replace(/\?$/, '');
  if (n.length === 0) return a ? [s, ''] : [s];
  let o = hr(n.join('/')),
    d = [];
  return (
    d.push(...o.map((u) => (u === '' ? s : [s, u].join('/')))),
    a && d.push(...o),
    d.map((u) => (e.startsWith('/') && u === '' ? '/' : u))
  );
}
function Xn(e) {
  e.sort((t, r) =>
    t.score !== r.score
      ? r.score - t.score
      : ra(
          t.routesMeta.map((n) => n.childrenIndex),
          r.routesMeta.map((n) => n.childrenIndex)
        )
  );
}
function ta(e, t) {
  let r = e.split('/'),
    n = r.length;
  return (
    r.some(Zt) && (n += ea),
    t && (n += Gn),
    r
      .filter((a) => !Zt(a))
      .reduce((a, s) => a + (Jn.test(s) ? Yn : s === '' ? Qn : Zn), n)
  );
}
function ra(e, t) {
  return e.length === t.length && e.slice(0, -1).every((n, a) => n === t[a])
    ? e[e.length - 1] - t[t.length - 1]
    : 0;
}
function na(e, t) {
  let { routesMeta: r } = e,
    n = {},
    a = '/',
    s = [];
  for (let o = 0; o < r.length; ++o) {
    let d = r[o],
      u = o === r.length - 1,
      m = a === '/' ? t : t.slice(a.length) || '/',
      f = dt(
        { path: d.relativePath, caseSensitive: d.caseSensitive, end: u },
        m
      );
    if (!f) return null;
    Object.assign(n, f.params);
    let x = d.route;
    s.push({
      params: n,
      pathname: Fe([a, f.pathname]),
      pathnameBase: br(Fe([a, f.pathnameBase])),
      route: x,
    }),
      f.pathnameBase !== '/' && (a = Fe([a, f.pathnameBase]));
  }
  return s;
}
function aa(e, t) {
  t === void 0 && (t = {});
  let r = e;
  r.endsWith('*') &&
    r !== '*' &&
    !r.endsWith('/*') &&
    (ae(
      !1,
      'Route path "' +
        r +
        '" will be treated as if it were ' +
        ('"' + r.replace(/\*$/, '/*') + '" because the `*` character must ') +
        'always follow a `/` in the pattern. To get rid of this warning, ' +
        ('please change the route path to "' + r.replace(/\*$/, '/*') + '".')
    ),
    (r = r.replace(/\*$/, '/*')));
  let n = r.startsWith('/') ? '/' : '',
    a = (o) => (o == null ? '' : typeof o == 'string' ? o : String(o)),
    s = r
      .split(/\/+/)
      .map((o, d, u) => {
        if (d === u.length - 1 && o === '*') return a(t['*']);
        let f = o.match(/^:([\w-]+)(\??)$/);
        if (f) {
          let [, x, g] = f,
            y = t[x];
          return F(g === '?' || y != null, 'Missing ":' + x + '" param'), a(y);
        }
        return o.replace(/\?$/g, '');
      })
      .filter((o) => !!o);
  return n + s.join('/');
}
function dt(e, t) {
  typeof e == 'string' && (e = { path: e, caseSensitive: !1, end: !0 });
  let [r, n] = oa(e.path, e.caseSensitive, e.end),
    a = t.match(r);
  if (!a) return null;
  let s = a[0],
    o = s.replace(/(.)\/+$/, '$1'),
    d = a.slice(1);
  return {
    params: n.reduce((m, f, x) => {
      let { paramName: g, isOptional: y } = f;
      if (g === '*') {
        let w = d[x] || '';
        o = s.slice(0, s.length - w.length).replace(/(.)\/+$/, '$1');
      }
      let R = d[x];
      return y && !R ? (m[g] = void 0) : (m[g] = sa(R || '', g)), m;
    }, {}),
    pathname: s,
    pathnameBase: o,
    pattern: e,
  };
}
function oa(e, t, r) {
  t === void 0 && (t = !1),
    r === void 0 && (r = !0),
    ae(
      e === '*' || !e.endsWith('*') || e.endsWith('/*'),
      'Route path "' +
        e +
        '" will be treated as if it were ' +
        ('"' + e.replace(/\*$/, '/*') + '" because the `*` character must ') +
        'always follow a `/` in the pattern. To get rid of this warning, ' +
        ('please change the route path to "' + e.replace(/\*$/, '/*') + '".')
    );
  let n = [],
    a =
      '^' +
      e
        .replace(/\/*\*?$/, '')
        .replace(/^\/*/, '/')
        .replace(/[\\.*+^${}|()[\]]/g, '\\$&')
        .replace(
          /\/:([\w-]+)(\?)?/g,
          (o, d, u) => (
            n.push({ paramName: d, isOptional: u != null }),
            u ? '/?([^\\/]+)?' : '/([^\\/]+)'
          )
        );
  return (
    e.endsWith('*')
      ? (n.push({ paramName: '*' }),
        (a += e === '*' || e === '/*' ? '(.*)$' : '(?:\\/(.+)|\\/*)$'))
      : r
        ? (a += '\\/*$')
        : e !== '' && e !== '/' && (a += '(?:(?=\\/|$))'),
    [new RegExp(a, t ? void 0 : 'i'), n]
  );
}
function ia(e) {
  try {
    return decodeURI(e);
  } catch (t) {
    return (
      ae(
        !1,
        'The URL path "' +
          e +
          '" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent ' +
          ('encoding (' + t + ').')
      ),
      e
    );
  }
}
function sa(e, t) {
  try {
    return decodeURIComponent(e);
  } catch (r) {
    return (
      ae(
        !1,
        'The value for the URL param "' +
          t +
          '" will not be decoded because' +
          (' the string "' +
            e +
            '" is a malformed URL segment. This is probably') +
          (' due to a bad percent encoding (' + r + ').')
      ),
      e
    );
  }
}
function Ye(e, t) {
  if (t === '/') return e;
  if (!e.toLowerCase().startsWith(t.toLowerCase())) return null;
  let r = t.endsWith('/') ? t.length - 1 : t.length,
    n = e.charAt(r);
  return n && n !== '/' ? null : e.slice(r) || '/';
}
function mr(e, t) {
  t === void 0 && (t = '/');
  let {
    pathname: r,
    search: n = '',
    hash: a = '',
  } = typeof e == 'string' ? oe(e) : e;
  return {
    pathname: r ? (r.startsWith('/') ? r : la(r, t)) : t,
    search: ua(n),
    hash: ca(a),
  };
}
function la(e, t) {
  let r = t.replace(/\/+$/, '').split('/');
  return (
    e.split('/').forEach((a) => {
      a === '..' ? r.length > 1 && r.pop() : a !== '.' && r.push(a);
    }),
    r.length > 1 ? r.join('/') : '/'
  );
}
function St(e, t, r, n) {
  return (
    "Cannot include a '" +
    e +
    "' character in a manually specified " +
    ('`to.' +
      t +
      '` field [' +
      JSON.stringify(n) +
      '].  Please separate it out to the ') +
    ('`to.' + r + '` field. Alternatively you may provide the full path as ') +
    'a string in <Link to="..."> and the router will parse it for you.'
  );
}
function pr(e) {
  return e.filter(
    (t, r) => r === 0 || (t.route.path && t.route.path.length > 0)
  );
}
function gr(e, t) {
  let r = pr(e);
  return t
    ? r.map((n, a) => (a === e.length - 1 ? n.pathname : n.pathnameBase))
    : r.map((n) => n.pathnameBase);
}
function yr(e, t, r, n) {
  n === void 0 && (n = !1);
  let a;
  typeof e == 'string'
    ? (a = oe(e))
    : ((a = C({}, e)),
      F(
        !a.pathname || !a.pathname.includes('?'),
        St('?', 'pathname', 'search', a)
      ),
      F(
        !a.pathname || !a.pathname.includes('#'),
        St('#', 'pathname', 'hash', a)
      ),
      F(!a.search || !a.search.includes('#'), St('#', 'search', 'hash', a)));
  let s = e === '' || a.pathname === '',
    o = s ? '/' : a.pathname,
    d;
  if (o == null) d = r;
  else {
    let x = t.length - 1;
    if (!n && o.startsWith('..')) {
      let g = o.split('/');
      for (; g[0] === '..'; ) g.shift(), (x -= 1);
      a.pathname = g.join('/');
    }
    d = x >= 0 ? t[x] : '/';
  }
  let u = mr(a, d),
    m = o && o !== '/' && o.endsWith('/'),
    f = (s || o === '.') && r.endsWith('/');
  return !u.pathname.endsWith('/') && (m || f) && (u.pathname += '/'), u;
}
function da(e) {
  return e === '' || e.pathname === ''
    ? '/'
    : typeof e == 'string'
      ? oe(e).pathname
      : e.pathname;
}
function fa(e) {
  return e instanceof Promise && e._tracked === !0;
}
function ha(e) {
  if (!fa(e)) return e;
  if (e._error) throw e._error;
  return e._data;
}
function Ge(e) {
  return (
    e != null &&
    typeof e.status == 'number' &&
    typeof e.statusText == 'string' &&
    typeof e.internal == 'boolean' &&
    'data' in e
  );
}
function va(e) {
  let t = e.window ? e.window : typeof window < 'u' ? window : void 0,
    r =
      typeof t < 'u' &&
      typeof t.document < 'u' &&
      typeof t.document.createElement < 'u',
    n = !r;
  F(
    e.routes.length > 0,
    'You must provide a non-empty routes array to createRouter'
  );
  let a;
  if (e.mapRouteProperties) a = e.mapRouteProperties;
  else if (e.detectErrorBoundary) {
    let i = e.detectErrorBoundary;
    a = (l) => ({ hasErrorBoundary: i(l) });
  } else a = Er;
  let s = {},
    o = Ke(e.routes, a, void 0, s),
    d,
    u = e.basename || '/',
    m = C(
      {
        v7_fetcherPersist: !1,
        v7_normalizeFormMethod: !1,
        v7_partialHydration: !1,
        v7_prependBasename: !1,
        v7_relativeSplatPath: !1,
      },
      e.future
    ),
    f = null,
    x = new Set(),
    g = null,
    y = null,
    R = null,
    w = e.hydrationData != null,
    b = ye(o, e.history.location, u),
    p = null;
  if (b == null) {
    let i = $(404, { pathname: e.history.location.pathname }),
      { matches: l, route: h } = lt(o);
    (b = l), (p = { [h.id]: i });
  }
  let P,
    U = b.some((i) => i.route.lazy),
    T = b.some((i) => i.route.loader);
  if (U) P = !1;
  else if (!T) P = !0;
  else if (m.v7_partialHydration) {
    let i = e.hydrationData ? e.hydrationData.loaderData : null,
      l = e.hydrationData ? e.hydrationData.errors : null;
    P = b.every(
      (h) =>
        h.route.loader &&
        h.route.loader.hydrate !== !0 &&
        ((i && i[h.route.id] !== void 0) || (l && l[h.route.id] !== void 0))
    );
  } else P = e.hydrationData != null;
  let O,
    c = {
      historyAction: e.history.action,
      location: e.history.location,
      matches: b,
      initialized: P,
      navigation: it,
      restoreScrollPosition: e.hydrationData != null ? !1 : null,
      preventScrollReset: !1,
      revalidation: 'idle',
      loaderData: (e.hydrationData && e.hydrationData.loaderData) || {},
      actionData: (e.hydrationData && e.hydrationData.actionData) || null,
      errors: (e.hydrationData && e.hydrationData.errors) || p,
      fetchers: new Map(),
      blockers: new Map(),
    },
    k = q.Pop,
    M = !1,
    H,
    se = !1,
    Z = new Map(),
    ne = null,
    Pe = !1,
    Re = !1,
    Qe = [],
    Ze = [],
    W = new Map(),
    et = 0,
    Ie = -1,
    Le = new Map(),
    ue = new Set(),
    je = new Map(),
    Ne = new Map(),
    ce = new Set(),
    Se = new Map(),
    xe = new Map(),
    pt = !1;
  function wn() {
    if (
      ((f = e.history.listen((i) => {
        let { action: l, location: h, delta: v } = i;
        if (pt) {
          pt = !1;
          return;
        }
        ae(
          xe.size === 0 || v != null,
          'You are trying to use a blocker on a POP navigation to a location that was not created by @remix-run/router. This will fail silently in production. This can happen if you are navigating outside the router via `window.history.pushState`/`window.location.hash` instead of using router navigation APIs.  This can also happen if you are using createHashRouter and the user manually changes the URL.'
        );
        let S = Kt({
          currentLocation: c.location,
          nextLocation: h,
          historyAction: l,
        });
        if (S && v != null) {
          (pt = !0),
            e.history.go(v * -1),
            rt(S, {
              state: 'blocked',
              location: h,
              proceed() {
                rt(S, {
                  state: 'proceeding',
                  proceed: void 0,
                  reset: void 0,
                  location: h,
                }),
                  e.history.go(v);
              },
              reset() {
                let j = new Map(c.blockers);
                j.set(S, Ce), Q({ blockers: j });
              },
            });
          return;
        }
        return Ee(l, h);
      })),
      r)
    ) {
      ja(t, Z);
      let i = () => Ma(t, Z);
      t.addEventListener('pagehide', i),
        (ne = () => t.removeEventListener('pagehide', i));
    }
    return c.initialized || Ee(q.Pop, c.location, { initialHydration: !0 }), O;
  }
  function Rn() {
    f && f(),
      ne && ne(),
      x.clear(),
      H && H.abort(),
      c.fetchers.forEach((i, l) => tt(l)),
      c.blockers.forEach((i, l) => Wt(l));
  }
  function Sn(i) {
    return x.add(i), () => x.delete(i);
  }
  function Q(i, l) {
    l === void 0 && (l = {}), (c = C({}, c, i));
    let h = [],
      v = [];
    m.v7_fetcherPersist &&
      c.fetchers.forEach((S, j) => {
        S.state === 'idle' && (ce.has(j) ? v.push(j) : h.push(j));
      }),
      [...x].forEach((S) =>
        S(c, {
          deletedFetchers: v,
          unstable_viewTransitionOpts: l.viewTransitionOpts,
          unstable_flushSync: l.flushSync === !0,
        })
      ),
      m.v7_fetcherPersist &&
        (h.forEach((S) => c.fetchers.delete(S)), v.forEach((S) => tt(S)));
  }
  function ze(i, l, h) {
    var v, S;
    let { flushSync: j } = h === void 0 ? {} : h,
      _ =
        c.actionData != null &&
        c.navigation.formMethod != null &&
        te(c.navigation.formMethod) &&
        c.navigation.state === 'loading' &&
        ((v = i.state) == null ? void 0 : v._isRedirect) !== !0,
      D;
    l.actionData
      ? Object.keys(l.actionData).length > 0
        ? (D = l.actionData)
        : (D = null)
      : _
        ? (D = c.actionData)
        : (D = null);
    let E = l.loaderData
        ? ir(c.loaderData, l.loaderData, l.matches || [], l.errors)
        : c.loaderData,
      A = c.blockers;
    A.size > 0 && ((A = new Map(A)), A.forEach((z, J) => A.set(J, Ce)));
    let K =
      M === !0 ||
      (c.navigation.formMethod != null &&
        te(c.navigation.formMethod) &&
        ((S = i.state) == null ? void 0 : S._isRedirect) !== !0);
    d && ((o = d), (d = void 0)),
      Pe ||
        k === q.Pop ||
        (k === q.Push
          ? e.history.push(i, i.state)
          : k === q.Replace && e.history.replace(i, i.state));
    let L;
    if (k === q.Pop) {
      let z = Z.get(c.location.pathname);
      z && z.has(i.pathname)
        ? (L = { currentLocation: c.location, nextLocation: i })
        : Z.has(i.pathname) &&
          (L = { currentLocation: i, nextLocation: c.location });
    } else if (se) {
      let z = Z.get(c.location.pathname);
      z
        ? z.add(i.pathname)
        : ((z = new Set([i.pathname])), Z.set(c.location.pathname, z)),
        (L = { currentLocation: c.location, nextLocation: i });
    }
    Q(
      C({}, l, {
        actionData: D,
        loaderData: E,
        historyAction: k,
        location: i,
        initialized: !0,
        navigation: it,
        revalidation: 'idle',
        restoreScrollPosition: Xt(i, l.matches || c.matches),
        preventScrollReset: K,
        blockers: A,
      }),
      { viewTransitionOpts: L, flushSync: j === !0 }
    ),
      (k = q.Pop),
      (M = !1),
      (se = !1),
      (Pe = !1),
      (Re = !1),
      (Qe = []),
      (Ze = []);
  }
  async function It(i, l) {
    if (typeof i == 'number') {
      e.history.go(i);
      return;
    }
    let h = Et(
        c.location,
        c.matches,
        u,
        m.v7_prependBasename,
        i,
        m.v7_relativeSplatPath,
        l?.fromRouteId,
        l?.relative
      ),
      {
        path: v,
        submission: S,
        error: j,
      } = er(m.v7_normalizeFormMethod, !1, h, l),
      _ = c.location,
      D = fe(c.location, v, l && l.state);
    D = C({}, D, e.history.encodeLocation(D));
    let E = l && l.replace != null ? l.replace : void 0,
      A = q.Push;
    E === !0
      ? (A = q.Replace)
      : E === !1 ||
        (S != null &&
          te(S.formMethod) &&
          S.formAction === c.location.pathname + c.location.search &&
          (A = q.Replace));
    let K =
        l && 'preventScrollReset' in l ? l.preventScrollReset === !0 : void 0,
      L = (l && l.unstable_flushSync) === !0,
      z = Kt({ currentLocation: _, nextLocation: D, historyAction: A });
    if (z) {
      rt(z, {
        state: 'blocked',
        location: D,
        proceed() {
          rt(z, {
            state: 'proceeding',
            proceed: void 0,
            reset: void 0,
            location: D,
          }),
            It(i, l);
        },
        reset() {
          let J = new Map(c.blockers);
          J.set(z, Ce), Q({ blockers: J });
        },
      });
      return;
    }
    return await Ee(A, D, {
      submission: S,
      pendingError: j,
      preventScrollReset: K,
      replace: l && l.replace,
      enableViewTransition: l && l.unstable_viewTransition,
      flushSync: L,
    });
  }
  function xn() {
    if (
      (gt(),
      Q({ revalidation: 'loading' }),
      c.navigation.state !== 'submitting')
    ) {
      if (c.navigation.state === 'idle') {
        Ee(c.historyAction, c.location, { startUninterruptedRevalidation: !0 });
        return;
      }
      Ee(k || c.historyAction, c.navigation.location, {
        overrideNavigation: c.navigation,
      });
    }
  }
  async function Ee(i, l, h) {
    H && H.abort(),
      (H = null),
      (k = i),
      (Pe = (h && h.startUninterruptedRevalidation) === !0),
      Tn(c.location, c.matches),
      (M = (h && h.preventScrollReset) === !0),
      (se = (h && h.enableViewTransition) === !0);
    let v = d || o,
      S = h && h.overrideNavigation,
      j = ye(v, l, u),
      _ = (h && h.flushSync) === !0;
    if (!j) {
      let J = $(404, { pathname: l.pathname }),
        { matches: ee, route: V } = lt(v);
      yt(),
        ze(
          l,
          { matches: ee, loaderData: {}, errors: { [V.id]: J } },
          { flushSync: _ }
        );
      return;
    }
    if (
      c.initialized &&
      !Re &&
      Ea(c.location, l) &&
      !(h && h.submission && te(h.submission.formMethod))
    ) {
      ze(l, { matches: j }, { flushSync: _ });
      return;
    }
    H = new AbortController();
    let D = $e(e.history, l, H.signal, h && h.submission),
      E,
      A;
    if (h && h.pendingError) A = { [Ue(j).route.id]: h.pendingError };
    else if (h && h.submission && te(h.submission.formMethod)) {
      let J = await En(D, l, h.submission, j, {
        replace: h.replace,
        flushSync: _,
      });
      if (J.shortCircuited) return;
      (E = J.pendingActionData),
        (A = J.pendingActionError),
        (S = xt(l, h.submission)),
        (_ = !1),
        (D = new Request(D.url, { signal: D.signal }));
    }
    let {
      shortCircuited: K,
      loaderData: L,
      errors: z,
    } = await Dn(
      D,
      l,
      j,
      S,
      h && h.submission,
      h && h.fetcherSubmission,
      h && h.replace,
      h && h.initialHydration === !0,
      _,
      E,
      A
    );
    K ||
      ((H = null),
      ze(
        l,
        C({ matches: j }, E ? { actionData: E } : {}, {
          loaderData: L,
          errors: z,
        })
      ));
  }
  async function En(i, l, h, v, S) {
    S === void 0 && (S = {}), gt();
    let j = Pa(l, h);
    Q({ navigation: j }, { flushSync: S.flushSync === !0 });
    let _,
      D = Je(v, l);
    if (!D.route.action && !D.route.lazy)
      _ = {
        type: N.error,
        error: $(405, {
          method: i.method,
          pathname: l.pathname,
          routeId: D.route.id,
        }),
      };
    else if (
      ((_ = await _e('action', i, D, v, s, a, u, m.v7_relativeSplatPath)),
      i.signal.aborted)
    )
      return { shortCircuited: !0 };
    if (we(_)) {
      let E;
      return (
        S && S.replace != null
          ? (E = S.replace)
          : (E = _.location === c.location.pathname + c.location.search),
        await Be(c, _, { submission: h, replace: E }),
        { shortCircuited: !0 }
      );
    }
    if (ve(_)) {
      let E = Ue(v, D.route.id);
      return (
        (S && S.replace) !== !0 && (k = q.Push),
        { pendingActionData: {}, pendingActionError: { [E.route.id]: _.error } }
      );
    }
    if (be(_)) throw $(400, { type: 'defer-action' });
    return { pendingActionData: { [D.route.id]: _.data } };
  }
  async function Dn(i, l, h, v, S, j, _, D, E, A, K) {
    let L = v || xt(l, S),
      z = S || j || dr(L),
      J = d || o,
      [ee, V] = tr(
        e.history,
        c,
        h,
        z,
        l,
        m.v7_partialHydration && D === !0,
        Re,
        Qe,
        Ze,
        ce,
        je,
        ue,
        J,
        u,
        A,
        K
      );
    if (
      (yt(
        (I) =>
          !(h && h.some((B) => B.route.id === I)) ||
          (ee && ee.some((B) => B.route.id === I))
      ),
      (Ie = ++et),
      ee.length === 0 && V.length === 0)
    ) {
      let I = qt();
      return (
        ze(
          l,
          C(
            { matches: h, loaderData: {}, errors: K || null },
            A ? { actionData: A } : {},
            I ? { fetchers: new Map(c.fetchers) } : {}
          ),
          { flushSync: E }
        ),
        { shortCircuited: !0 }
      );
    }
    if (!Pe && (!m.v7_partialHydration || !D)) {
      V.forEach((B) => {
        let le = c.fetchers.get(B.key),
          at = We(void 0, le ? le.data : void 0);
        c.fetchers.set(B.key, at);
      });
      let I = A || c.actionData;
      Q(
        C(
          { navigation: L },
          I
            ? Object.keys(I).length === 0
              ? { actionData: null }
              : { actionData: I }
            : {},
          V.length > 0 ? { fetchers: new Map(c.fetchers) } : {}
        ),
        { flushSync: E }
      );
    }
    V.forEach((I) => {
      W.has(I.key) && me(I.key), I.controller && W.set(I.key, I.controller);
    });
    let Me = () => V.forEach((I) => me(I.key));
    H && H.signal.addEventListener('abort', Me);
    let {
      results: bt,
      loaderResults: Ae,
      fetcherResults: pe,
    } = await Nt(c.matches, h, ee, V, i);
    if (i.signal.aborted) return { shortCircuited: !0 };
    H && H.signal.removeEventListener('abort', Me),
      V.forEach((I) => W.delete(I.key));
    let De = sr(bt);
    if (De) {
      if (De.idx >= ee.length) {
        let I = V[De.idx - ee.length].key;
        ue.add(I);
      }
      return await Be(c, De.result, { replace: _ }), { shortCircuited: !0 };
    }
    let { loaderData: vt, errors: wt } = or(c, h, ee, Ae, K, V, pe, Se);
    Se.forEach((I, B) => {
      I.subscribe((le) => {
        (le || I.done) && Se.delete(B);
      });
    });
    let Rt = qt(),
      Te = $t(Ie),
      nt = Rt || Te || V.length > 0;
    return C(
      { loaderData: vt, errors: wt },
      nt ? { fetchers: new Map(c.fetchers) } : {}
    );
  }
  function _n(i, l, h, v) {
    if (n)
      throw new Error(
        "router.fetch() was called during the server render, but it shouldn't be. You are likely calling a useFetcher() method in the body of your component. Try moving it to a useEffect or a callback."
      );
    W.has(i) && me(i);
    let S = (v && v.unstable_flushSync) === !0,
      j = d || o,
      _ = Et(
        c.location,
        c.matches,
        u,
        m.v7_prependBasename,
        h,
        m.v7_relativeSplatPath,
        l,
        v?.relative
      ),
      D = ye(j, _, u);
    if (!D) {
      qe(i, l, $(404, { pathname: _ }), { flushSync: S });
      return;
    }
    let {
      path: E,
      submission: A,
      error: K,
    } = er(m.v7_normalizeFormMethod, !0, _, v);
    if (K) {
      qe(i, l, K, { flushSync: S });
      return;
    }
    let L = Je(D, E);
    if (((M = (v && v.preventScrollReset) === !0), A && te(A.formMethod))) {
      Pn(i, l, E, L, D, S, A);
      return;
    }
    je.set(i, { routeId: l, path: E }), Ln(i, l, E, L, D, S, A);
  }
  async function Pn(i, l, h, v, S, j, _) {
    if ((gt(), je.delete(i), !v.route.action && !v.route.lazy)) {
      let B = $(405, { method: _.formMethod, pathname: h, routeId: l });
      qe(i, l, B, { flushSync: j });
      return;
    }
    let D = c.fetchers.get(i);
    he(i, La(_, D), { flushSync: j });
    let E = new AbortController(),
      A = $e(e.history, h, E.signal, _);
    W.set(i, E);
    let K = et,
      L = await _e('action', A, v, S, s, a, u, m.v7_relativeSplatPath);
    if (A.signal.aborted) {
      W.get(i) === E && W.delete(i);
      return;
    }
    if (m.v7_fetcherPersist && ce.has(i)) {
      if (we(L) || ve(L)) {
        he(i, ge(void 0));
        return;
      }
    } else {
      if (we(L))
        if ((W.delete(i), Ie > K)) {
          he(i, ge(void 0));
          return;
        } else
          return ue.add(i), he(i, We(_)), Be(c, L, { fetcherSubmission: _ });
      if (ve(L)) {
        qe(i, l, L.error);
        return;
      }
    }
    if (be(L)) throw $(400, { type: 'defer-action' });
    let z = c.navigation.location || c.location,
      J = $e(e.history, z, E.signal),
      ee = d || o,
      V =
        c.navigation.state !== 'idle'
          ? ye(ee, c.navigation.location, u)
          : c.matches;
    F(V, "Didn't find any matches after fetcher action");
    let Me = ++et;
    Le.set(i, Me);
    let bt = We(_, L.data);
    c.fetchers.set(i, bt);
    let [Ae, pe] = tr(
      e.history,
      c,
      V,
      _,
      z,
      !1,
      Re,
      Qe,
      Ze,
      ce,
      je,
      ue,
      ee,
      u,
      { [v.route.id]: L.data },
      void 0
    );
    pe
      .filter((B) => B.key !== i)
      .forEach((B) => {
        let le = B.key,
          at = c.fetchers.get(le),
          Fn = We(void 0, at ? at.data : void 0);
        c.fetchers.set(le, Fn),
          W.has(le) && me(le),
          B.controller && W.set(le, B.controller);
      }),
      Q({ fetchers: new Map(c.fetchers) });
    let De = () => pe.forEach((B) => me(B.key));
    E.signal.addEventListener('abort', De);
    let {
      results: vt,
      loaderResults: wt,
      fetcherResults: Rt,
    } = await Nt(c.matches, V, Ae, pe, J);
    if (E.signal.aborted) return;
    E.signal.removeEventListener('abort', De),
      Le.delete(i),
      W.delete(i),
      pe.forEach((B) => W.delete(B.key));
    let Te = sr(vt);
    if (Te) {
      if (Te.idx >= Ae.length) {
        let B = pe[Te.idx - Ae.length].key;
        ue.add(B);
      }
      return Be(c, Te.result);
    }
    let { loaderData: nt, errors: I } = or(
      c,
      c.matches,
      Ae,
      wt,
      void 0,
      pe,
      Rt,
      Se
    );
    if (c.fetchers.has(i)) {
      let B = ge(L.data);
      c.fetchers.set(i, B);
    }
    $t(Me),
      c.navigation.state === 'loading' && Me > Ie
        ? (F(k, 'Expected pending action'),
          H && H.abort(),
          ze(c.navigation.location, {
            matches: V,
            loaderData: nt,
            errors: I,
            fetchers: new Map(c.fetchers),
          }))
        : (Q({
            errors: I,
            loaderData: ir(c.loaderData, nt, V, I),
            fetchers: new Map(c.fetchers),
          }),
          (Re = !1));
  }
  async function Ln(i, l, h, v, S, j, _) {
    let D = c.fetchers.get(i);
    he(i, We(_, D ? D.data : void 0), { flushSync: j });
    let E = new AbortController(),
      A = $e(e.history, h, E.signal);
    W.set(i, E);
    let K = et,
      L = await _e('loader', A, v, S, s, a, u, m.v7_relativeSplatPath);
    if (
      (be(L) && (L = (await Tr(L, A.signal, !0)) || L),
      W.get(i) === E && W.delete(i),
      !A.signal.aborted)
    ) {
      if (ce.has(i)) {
        he(i, ge(void 0));
        return;
      }
      if (we(L))
        if (Ie > K) {
          he(i, ge(void 0));
          return;
        } else {
          ue.add(i), await Be(c, L);
          return;
        }
      if (ve(L)) {
        qe(i, l, L.error);
        return;
      }
      F(!be(L), 'Unhandled fetcher deferred data'), he(i, ge(L.data));
    }
  }
  async function Be(i, l, h) {
    let {
      submission: v,
      fetcherSubmission: S,
      replace: j,
    } = h === void 0 ? {} : h;
    l.revalidate && (Re = !0);
    let _ = fe(i.location, l.location, { _isRedirect: !0 });
    if ((F(_, 'Expected a location on the redirect navigation'), r)) {
      let z = !1;
      if (l.reloadDocument) z = !0;
      else if (xr.test(l.location)) {
        let J = e.history.createURL(l.location);
        z = J.origin !== t.location.origin || Ye(J.pathname, u) == null;
      }
      if (z) {
        j ? t.location.replace(l.location) : t.location.assign(l.location);
        return;
      }
    }
    H = null;
    let D = j === !0 ? q.Replace : q.Push,
      { formMethod: E, formAction: A, formEncType: K } = i.navigation;
    !v && !S && E && A && K && (v = dr(i.navigation));
    let L = v || S;
    if (ba.has(l.status) && L && te(L.formMethod))
      await Ee(D, _, {
        submission: C({}, L, { formAction: l.location }),
        preventScrollReset: M,
      });
    else {
      let z = xt(_, v);
      await Ee(D, _, {
        overrideNavigation: z,
        fetcherSubmission: S,
        preventScrollReset: M,
      });
    }
  }
  async function Nt(i, l, h, v, S) {
    let j = await Promise.all([
        ...h.map((E) => _e('loader', S, E, l, s, a, u, m.v7_relativeSplatPath)),
        ...v.map((E) =>
          E.matches && E.match && E.controller
            ? _e(
                'loader',
                $e(e.history, E.path, E.controller.signal),
                E.match,
                E.matches,
                s,
                a,
                u,
                m.v7_relativeSplatPath
              )
            : { type: N.error, error: $(404, { pathname: E.path }) }
        ),
      ]),
      _ = j.slice(0, h.length),
      D = j.slice(h.length);
    return (
      await Promise.all([
        lr(
          i,
          h,
          _,
          _.map(() => S.signal),
          !1,
          c.loaderData
        ),
        lr(
          i,
          v.map((E) => E.match),
          D,
          v.map((E) => (E.controller ? E.controller.signal : null)),
          !0
        ),
      ]),
      { results: j, loaderResults: _, fetcherResults: D }
    );
  }
  function gt() {
    (Re = !0),
      Qe.push(...yt()),
      je.forEach((i, l) => {
        W.has(l) && (Ze.push(l), me(l));
      });
  }
  function he(i, l, h) {
    h === void 0 && (h = {}),
      c.fetchers.set(i, l),
      Q(
        { fetchers: new Map(c.fetchers) },
        { flushSync: (h && h.flushSync) === !0 }
      );
  }
  function qe(i, l, h, v) {
    v === void 0 && (v = {});
    let S = Ue(c.matches, l);
    tt(i),
      Q(
        { errors: { [S.route.id]: h }, fetchers: new Map(c.fetchers) },
        { flushSync: (v && v.flushSync) === !0 }
      );
  }
  function zt(i) {
    return (
      m.v7_fetcherPersist &&
        (Ne.set(i, (Ne.get(i) || 0) + 1), ce.has(i) && ce.delete(i)),
      c.fetchers.get(i) || Sr
    );
  }
  function tt(i) {
    let l = c.fetchers.get(i);
    W.has(i) && !(l && l.state === 'loading' && Le.has(i)) && me(i),
      je.delete(i),
      Le.delete(i),
      ue.delete(i),
      ce.delete(i),
      c.fetchers.delete(i);
  }
  function jn(i) {
    if (m.v7_fetcherPersist) {
      let l = (Ne.get(i) || 0) - 1;
      l <= 0 ? (Ne.delete(i), ce.add(i)) : Ne.set(i, l);
    } else tt(i);
    Q({ fetchers: new Map(c.fetchers) });
  }
  function me(i) {
    let l = W.get(i);
    F(l, 'Expected fetch controller: ' + i), l.abort(), W.delete(i);
  }
  function Bt(i) {
    for (let l of i) {
      let h = zt(l),
        v = ge(h.data);
      c.fetchers.set(l, v);
    }
  }
  function qt() {
    let i = [],
      l = !1;
    for (let h of ue) {
      let v = c.fetchers.get(h);
      F(v, 'Expected fetcher: ' + h),
        v.state === 'loading' && (ue.delete(h), i.push(h), (l = !0));
    }
    return Bt(i), l;
  }
  function $t(i) {
    let l = [];
    for (let [h, v] of Le)
      if (v < i) {
        let S = c.fetchers.get(h);
        F(S, 'Expected fetcher: ' + h),
          S.state === 'loading' && (me(h), Le.delete(h), l.push(h));
      }
    return Bt(l), l.length > 0;
  }
  function Mn(i, l) {
    let h = c.blockers.get(i) || Ce;
    return xe.get(i) !== l && xe.set(i, l), h;
  }
  function Wt(i) {
    c.blockers.delete(i), xe.delete(i);
  }
  function rt(i, l) {
    let h = c.blockers.get(i) || Ce;
    F(
      (h.state === 'unblocked' && l.state === 'blocked') ||
        (h.state === 'blocked' && l.state === 'blocked') ||
        (h.state === 'blocked' && l.state === 'proceeding') ||
        (h.state === 'blocked' && l.state === 'unblocked') ||
        (h.state === 'proceeding' && l.state === 'unblocked'),
      'Invalid blocker state transition: ' + h.state + ' -> ' + l.state
    );
    let v = new Map(c.blockers);
    v.set(i, l), Q({ blockers: v });
  }
  function Kt(i) {
    let { currentLocation: l, nextLocation: h, historyAction: v } = i;
    if (xe.size === 0) return;
    xe.size > 1 && ae(!1, 'A router only supports one blocker at a time');
    let S = Array.from(xe.entries()),
      [j, _] = S[S.length - 1],
      D = c.blockers.get(j);
    if (
      !(D && D.state === 'proceeding') &&
      _({ currentLocation: l, nextLocation: h, historyAction: v })
    )
      return j;
  }
  function yt(i) {
    let l = [];
    return (
      Se.forEach((h, v) => {
        (!i || i(v)) && (h.cancel(), l.push(v), Se.delete(v));
      }),
      l
    );
  }
  function An(i, l, h) {
    if (((g = i), (R = l), (y = h || null), !w && c.navigation === it)) {
      w = !0;
      let v = Xt(c.location, c.matches);
      v != null && Q({ restoreScrollPosition: v });
    }
    return () => {
      (g = null), (R = null), (y = null);
    };
  }
  function Vt(i, l) {
    return (
      (y &&
        y(
          i,
          l.map((v) => cr(v, c.loaderData))
        )) ||
      i.key
    );
  }
  function Tn(i, l) {
    if (g && R) {
      let h = Vt(i, l);
      g[h] = R();
    }
  }
  function Xt(i, l) {
    if (g) {
      let h = Vt(i, l),
        v = g[h];
      if (typeof v == 'number') return v;
    }
    return null;
  }
  function Cn(i) {
    (s = {}), (d = Ke(i, a, void 0, s));
  }
  return (
    (O = {
      get basename() {
        return u;
      },
      get future() {
        return m;
      },
      get state() {
        return c;
      },
      get routes() {
        return o;
      },
      get window() {
        return t;
      },
      initialize: wn,
      subscribe: Sn,
      enableScrollRestoration: An,
      navigate: It,
      fetch: _n,
      revalidate: xn,
      createHref: (i) => e.history.createHref(i),
      encodeLocation: (i) => e.history.encodeLocation(i),
      getFetcher: zt,
      deleteFetcher: jn,
      dispose: Rn,
      getBlocker: Mn,
      deleteBlocker: Wt,
      _internalFetchControllers: W,
      _internalActiveDeferreds: Se,
      _internalSetRoutes: Cn,
    }),
    O
  );
}
function wa(e, t) {
  F(
    e.length > 0,
    'You must provide a non-empty routes array to createStaticHandler'
  );
  let r = {},
    n = (t ? t.basename : null) || '/',
    a;
  if (t != null && t.mapRouteProperties) a = t.mapRouteProperties;
  else if (t != null && t.detectErrorBoundary) {
    let g = t.detectErrorBoundary;
    a = (y) => ({ hasErrorBoundary: g(y) });
  } else a = Er;
  let s = C({ v7_relativeSplatPath: !1 }, t ? t.future : null),
    o = Ke(e, a, void 0, r);
  async function d(g, y) {
    let { requestContext: R } = y === void 0 ? {} : y,
      w = new URL(g.url),
      b = g.method,
      p = fe('', de(w), null, 'default'),
      P = ye(o, p, n);
    if (!_t(b) && b !== 'HEAD') {
      let T = $(405, { method: b }),
        { matches: O, route: c } = lt(o);
      return {
        basename: n,
        location: p,
        matches: O,
        loaderData: {},
        actionData: null,
        errors: { [c.id]: T },
        statusCode: T.status,
        loaderHeaders: {},
        actionHeaders: {},
        activeDeferreds: null,
      };
    } else if (!P) {
      let T = $(404, { pathname: p.pathname }),
        { matches: O, route: c } = lt(o);
      return {
        basename: n,
        location: p,
        matches: O,
        loaderData: {},
        actionData: null,
        errors: { [c.id]: T },
        statusCode: T.status,
        loaderHeaders: {},
        actionHeaders: {},
        activeDeferreds: null,
      };
    }
    let U = await m(g, p, P, R);
    return Oe(U) ? U : C({ location: p, basename: n }, U);
  }
  async function u(g, y) {
    let { routeId: R, requestContext: w } = y === void 0 ? {} : y,
      b = new URL(g.url),
      p = g.method,
      P = fe('', de(b), null, 'default'),
      U = ye(o, P, n);
    if (!_t(p) && p !== 'HEAD' && p !== 'OPTIONS') throw $(405, { method: p });
    if (!U) throw $(404, { pathname: P.pathname });
    let T = R ? U.find((M) => M.route.id === R) : Je(U, P);
    if (R && !T) throw $(403, { pathname: P.pathname, routeId: R });
    if (!T) throw $(404, { pathname: P.pathname });
    let O = await m(g, P, U, w, T);
    if (Oe(O)) return O;
    let c = O.errors ? Object.values(O.errors)[0] : void 0;
    if (c !== void 0) throw c;
    if (O.actionData) return Object.values(O.actionData)[0];
    if (O.loaderData) {
      var k;
      let M = Object.values(O.loaderData)[0];
      return (
        (k = O.activeDeferreds) != null &&
          k[T.route.id] &&
          (M[_r] = O.activeDeferreds[T.route.id]),
        M
      );
    }
  }
  async function m(g, y, R, w, b) {
    F(
      g.signal,
      'query()/queryRoute() requests must contain an AbortController signal'
    );
    try {
      if (te(g.method.toLowerCase()))
        return await f(g, R, b || Je(R, y), w, b != null);
      let p = await x(g, R, w, b);
      return Oe(p) ? p : C({}, p, { actionData: null, actionHeaders: {} });
    } catch (p) {
      if (_a(p)) {
        if (p.type === N.error) throw p.response;
        return p.response;
      }
      if (Da(p)) return p;
      throw p;
    }
  }
  async function f(g, y, R, w, b) {
    let p;
    if (!R.route.action && !R.route.lazy) {
      let T = $(405, {
        method: g.method,
        pathname: new URL(g.url).pathname,
        routeId: R.route.id,
      });
      if (b) throw T;
      p = { type: N.error, error: T };
    } else if (
      ((p = await _e('action', g, R, y, r, a, n, s.v7_relativeSplatPath, {
        isStaticRequest: !0,
        isRouteRequest: b,
        requestContext: w,
      })),
      g.signal.aborted)
    ) {
      let T = b ? 'queryRoute' : 'query';
      throw new Error(T + '() call aborted: ' + g.method + ' ' + g.url);
    }
    if (we(p))
      throw new Response(null, {
        status: p.status,
        headers: { Location: p.location },
      });
    if (be(p)) {
      let T = $(400, { type: 'defer-action' });
      if (b) throw T;
      p = { type: N.error, error: T };
    }
    if (b) {
      if (ve(p)) throw p.error;
      return {
        matches: [R],
        loaderData: {},
        actionData: { [R.route.id]: p.data },
        errors: null,
        statusCode: 200,
        loaderHeaders: {},
        actionHeaders: {},
        activeDeferreds: null,
      };
    }
    if (ve(p)) {
      let T = Ue(y, R.route.id),
        O = await x(g, y, w, void 0, { [T.route.id]: p.error });
      return C({}, O, {
        statusCode: Ge(p.error) ? p.error.status : 500,
        actionData: null,
        actionHeaders: C({}, p.headers ? { [R.route.id]: p.headers } : {}),
      });
    }
    let P = new Request(g.url, {
        headers: g.headers,
        redirect: g.redirect,
        signal: g.signal,
      }),
      U = await x(P, y, w);
    return C({}, U, p.statusCode ? { statusCode: p.statusCode } : {}, {
      actionData: { [R.route.id]: p.data },
      actionHeaders: C({}, p.headers ? { [R.route.id]: p.headers } : {}),
    });
  }
  async function x(g, y, R, w, b) {
    let p = w != null;
    if (p && !(w != null && w.route.loader) && !(w != null && w.route.lazy))
      throw $(400, {
        method: g.method,
        pathname: new URL(g.url).pathname,
        routeId: w?.route.id,
      });
    let U = (w ? [w] : Pr(y, Object.keys(b || {})[0])).filter(
      (M) => M.route.loader || M.route.lazy
    );
    if (U.length === 0)
      return {
        matches: y,
        loaderData: y.reduce(
          (M, H) => Object.assign(M, { [H.route.id]: null }),
          {}
        ),
        errors: b || null,
        statusCode: 200,
        loaderHeaders: {},
        activeDeferreds: null,
      };
    let T = await Promise.all([
      ...U.map((M) =>
        _e('loader', g, M, y, r, a, n, s.v7_relativeSplatPath, {
          isStaticRequest: !0,
          isRouteRequest: p,
          requestContext: R,
        })
      ),
    ]);
    if (g.signal.aborted) {
      let M = p ? 'queryRoute' : 'query';
      throw new Error(M + '() call aborted: ' + g.method + ' ' + g.url);
    }
    let O = new Map(),
      c = jr(y, U, T, b, O),
      k = new Set(U.map((M) => M.route.id));
    return (
      y.forEach((M) => {
        k.has(M.route.id) || (c.loaderData[M.route.id] = null);
      }),
      C({}, c, {
        matches: y,
        activeDeferreds: O.size > 0 ? Object.fromEntries(O.entries()) : null,
      })
    );
  }
  return { dataRoutes: o, query: d, queryRoute: u };
}
function Ra(e, t, r) {
  return C({}, t, {
    statusCode: 500,
    errors: { [t._deepestRenderedBoundaryId || e[0].id]: r },
  });
}
function Sa(e) {
  return (
    e != null &&
    (('formData' in e && e.formData != null) ||
      ('body' in e && e.body !== void 0))
  );
}
function Et(e, t, r, n, a, s, o, d) {
  let u, m;
  if (o) {
    u = [];
    for (let x of t)
      if ((u.push(x), x.route.id === o)) {
        m = x;
        break;
      }
  } else (u = t), (m = t[t.length - 1]);
  let f = yr(a || '.', gr(u, s), Ye(e.pathname, r) || e.pathname, d === 'path');
  return (
    a == null && ((f.search = e.search), (f.hash = e.hash)),
    (a == null || a === '' || a === '.') &&
      m &&
      m.route.index &&
      !jt(f.search) &&
      (f.search = f.search ? f.search.replace(/^\?/, '?index&') : '?index'),
    n &&
      r !== '/' &&
      (f.pathname = f.pathname === '/' ? r : Fe([r, f.pathname])),
    de(f)
  );
}
function er(e, t, r, n) {
  if (!n || !Sa(n)) return { path: r };
  if (n.formMethod && !_t(n.formMethod))
    return { path: r, error: $(405, { method: n.formMethod }) };
  let a = () => ({ path: r, error: $(400, { type: 'invalid-body' }) }),
    s = n.formMethod || 'get',
    o = e ? s.toUpperCase() : s.toLowerCase(),
    d = Mr(r);
  if (n.body !== void 0) {
    if (n.formEncType === 'text/plain') {
      if (!te(o)) return a();
      let g =
        typeof n.body == 'string'
          ? n.body
          : n.body instanceof FormData || n.body instanceof URLSearchParams
            ? Array.from(n.body.entries()).reduce((y, R) => {
                let [w, b] = R;
                return (
                  '' +
                  y +
                  w +
                  '=' +
                  b +
                  `
`
                );
              }, '')
            : String(n.body);
      return {
        path: r,
        submission: {
          formMethod: o,
          formAction: d,
          formEncType: n.formEncType,
          formData: void 0,
          json: void 0,
          text: g,
        },
      };
    } else if (n.formEncType === 'application/json') {
      if (!te(o)) return a();
      try {
        let g = typeof n.body == 'string' ? JSON.parse(n.body) : n.body;
        return {
          path: r,
          submission: {
            formMethod: o,
            formAction: d,
            formEncType: n.formEncType,
            formData: void 0,
            json: g,
            text: void 0,
          },
        };
      } catch {
        return a();
      }
    }
  }
  F(
    typeof FormData == 'function',
    'FormData is not available in this environment'
  );
  let u, m;
  if (n.formData) (u = Dt(n.formData)), (m = n.formData);
  else if (n.body instanceof FormData) (u = Dt(n.body)), (m = n.body);
  else if (n.body instanceof URLSearchParams) (u = n.body), (m = ar(u));
  else if (n.body == null) (u = new URLSearchParams()), (m = new FormData());
  else
    try {
      (u = new URLSearchParams(n.body)), (m = ar(u));
    } catch {
      return a();
    }
  let f = {
    formMethod: o,
    formAction: d,
    formEncType: (n && n.formEncType) || 'application/x-www-form-urlencoded',
    formData: m,
    json: void 0,
    text: void 0,
  };
  if (te(f.formMethod)) return { path: r, submission: f };
  let x = oe(r);
  return (
    t && x.search && jt(x.search) && u.append('index', ''),
    (x.search = '?' + u),
    { path: de(x), submission: f }
  );
}
function Pr(e, t) {
  let r = e;
  if (t) {
    let n = e.findIndex((a) => a.route.id === t);
    n >= 0 && (r = e.slice(0, n));
  }
  return r;
}
function tr(e, t, r, n, a, s, o, d, u, m, f, x, g, y, R, w) {
  let b = w ? Object.values(w)[0] : R ? Object.values(R)[0] : void 0,
    p = e.createURL(t.location),
    P = e.createURL(a),
    U = w ? Object.keys(w)[0] : void 0,
    O = Pr(r, U).filter((k, M) => {
      let { route: H } = k;
      if (H.lazy) return !0;
      if (H.loader == null) return !1;
      if (s)
        return H.loader.hydrate
          ? !0
          : t.loaderData[H.id] === void 0 &&
              (!t.errors || t.errors[H.id] === void 0);
      if (
        xa(t.loaderData, t.matches[M], k) ||
        d.some((ne) => ne === k.route.id)
      )
        return !0;
      let se = t.matches[M],
        Z = k;
      return rr(
        k,
        C(
          {
            currentUrl: p,
            currentParams: se.params,
            nextUrl: P,
            nextParams: Z.params,
          },
          n,
          {
            actionResult: b,
            defaultShouldRevalidate:
              o ||
              p.pathname + p.search === P.pathname + P.search ||
              p.search !== P.search ||
              Lr(se, Z),
          }
        )
      );
    }),
    c = [];
  return (
    f.forEach((k, M) => {
      if (s || !r.some((Pe) => Pe.route.id === k.routeId) || m.has(M)) return;
      let H = ye(g, k.path, y);
      if (!H) {
        c.push({
          key: M,
          routeId: k.routeId,
          path: k.path,
          matches: null,
          match: null,
          controller: null,
        });
        return;
      }
      let se = t.fetchers.get(M),
        Z = Je(H, k.path),
        ne = !1;
      x.has(M)
        ? (ne = !1)
        : u.includes(M)
          ? (ne = !0)
          : se && se.state !== 'idle' && se.data === void 0
            ? (ne = o)
            : (ne = rr(
                Z,
                C(
                  {
                    currentUrl: p,
                    currentParams: t.matches[t.matches.length - 1].params,
                    nextUrl: P,
                    nextParams: r[r.length - 1].params,
                  },
                  n,
                  { actionResult: b, defaultShouldRevalidate: o }
                )
              )),
        ne &&
          c.push({
            key: M,
            routeId: k.routeId,
            path: k.path,
            matches: H,
            match: Z,
            controller: new AbortController(),
          });
    }),
    [O, c]
  );
}
function xa(e, t, r) {
  let n = !t || r.route.id !== t.route.id,
    a = e[r.route.id] === void 0;
  return n || a;
}
function Lr(e, t) {
  let r = e.route.path;
  return (
    e.pathname !== t.pathname ||
    (r != null && r.endsWith('*') && e.params['*'] !== t.params['*'])
  );
}
function rr(e, t) {
  if (e.route.shouldRevalidate) {
    let r = e.route.shouldRevalidate(t);
    if (typeof r == 'boolean') return r;
  }
  return t.defaultShouldRevalidate;
}
async function nr(e, t, r) {
  if (!e.lazy) return;
  let n = await e.lazy();
  if (!e.lazy) return;
  let a = r[e.id];
  F(a, 'No route found in manifest');
  let s = {};
  for (let o in n) {
    let u = a[o] !== void 0 && o !== 'hasErrorBoundary';
    ae(
      !u,
      'Route "' +
        a.id +
        '" has a static property "' +
        o +
        '" defined but its lazy function is also returning a value for this property. ' +
        ('The lazy route property "' + o + '" will be ignored.')
    ),
      !u && !Kn.has(o) && (s[o] = n[o]);
  }
  Object.assign(a, s), Object.assign(a, C({}, t(a), { lazy: void 0 }));
}
async function _e(e, t, r, n, a, s, o, d, u) {
  u === void 0 && (u = {});
  let m,
    f,
    x,
    g = (w) => {
      let b,
        p = new Promise((P, U) => (b = U));
      return (
        (x = () => b()),
        t.signal.addEventListener('abort', x),
        Promise.race([
          w({ request: t, params: r.params, context: u.requestContext }),
          p,
        ])
      );
    };
  try {
    let w = r.route[e];
    if (r.route.lazy)
      if (w) {
        let b,
          p = await Promise.all([
            g(w).catch((P) => {
              b = P;
            }),
            nr(r.route, s, a),
          ]);
        if (b) throw b;
        f = p[0];
      } else if ((await nr(r.route, s, a), (w = r.route[e]), w)) f = await g(w);
      else if (e === 'action') {
        let b = new URL(t.url),
          p = b.pathname + b.search;
        throw $(405, { method: t.method, pathname: p, routeId: r.route.id });
      } else return { type: N.data, data: void 0 };
    else if (w) f = await g(w);
    else {
      let b = new URL(t.url),
        p = b.pathname + b.search;
      throw $(404, { pathname: p });
    }
    F(
      f !== void 0,
      'You defined ' +
        (e === 'action' ? 'an action' : 'a loader') +
        ' for route ' +
        ('"' +
          r.route.id +
          '" but didn\'t return anything from your `' +
          e +
          '` ') +
        'function. Please return a value or `null`.'
    );
  } catch (w) {
    (m = N.error), (f = w);
  } finally {
    x && t.signal.removeEventListener('abort', x);
  }
  if (Oe(f)) {
    let w = f.status;
    if (ya.has(w)) {
      let p = f.headers.get('Location');
      if (
        (F(
          p,
          'Redirects returned/thrown from loaders/actions must have a Location header'
        ),
        !xr.test(p))
      )
        p = Et(new URL(t.url), n.slice(0, n.indexOf(r) + 1), o, !0, p, d);
      else if (!u.isStaticRequest) {
        let P = new URL(t.url),
          U = p.startsWith('//') ? new URL(P.protocol + p) : new URL(p),
          T = Ye(U.pathname, o) != null;
        U.origin === P.origin && T && (p = U.pathname + U.search + U.hash);
      }
      if (u.isStaticRequest) throw (f.headers.set('Location', p), f);
      return {
        type: N.redirect,
        status: w,
        location: p,
        revalidate: f.headers.get('X-Remix-Revalidate') !== null,
        reloadDocument: f.headers.get('X-Remix-Reload-Document') !== null,
      };
    }
    if (u.isRouteRequest)
      throw { type: m === N.error ? N.error : N.data, response: f };
    let b;
    try {
      let p = f.headers.get('Content-Type');
      p && /\bapplication\/json\b/.test(p)
        ? f.body == null
          ? (b = null)
          : (b = await f.json())
        : (b = await f.text());
    } catch (p) {
      return { type: N.error, error: p };
    }
    return m === N.error
      ? { type: m, error: new Xe(w, f.statusText, b), headers: f.headers }
      : { type: N.data, data: b, statusCode: f.status, headers: f.headers };
  }
  if (m === N.error) return { type: m, error: f };
  if (Ar(f)) {
    var y, R;
    return {
      type: N.deferred,
      deferredData: f,
      statusCode: (y = f.init) == null ? void 0 : y.status,
      headers:
        ((R = f.init) == null ? void 0 : R.headers) &&
        new Headers(f.init.headers),
    };
  }
  return { type: N.data, data: f };
}
function $e(e, t, r, n) {
  let a = e.createURL(Mr(t)).toString(),
    s = { signal: r };
  if (n && te(n.formMethod)) {
    let { formMethod: o, formEncType: d } = n;
    (s.method = o.toUpperCase()),
      d === 'application/json'
        ? ((s.headers = new Headers({ 'Content-Type': d })),
          (s.body = JSON.stringify(n.json)))
        : d === 'text/plain'
          ? (s.body = n.text)
          : d === 'application/x-www-form-urlencoded' && n.formData
            ? (s.body = Dt(n.formData))
            : (s.body = n.formData);
  }
  return new Request(a, s);
}
function Dt(e) {
  let t = new URLSearchParams();
  for (let [r, n] of e.entries())
    t.append(r, typeof n == 'string' ? n : n.name);
  return t;
}
function ar(e) {
  let t = new FormData();
  for (let [r, n] of e.entries()) t.append(r, n);
  return t;
}
function jr(e, t, r, n, a) {
  let s = {},
    o = null,
    d,
    u = !1,
    m = {};
  return (
    r.forEach((f, x) => {
      let g = t[x].route.id;
      if (
        (F(!we(f), 'Cannot handle redirect results in processLoaderData'),
        ve(f))
      ) {
        let y = Ue(e, g),
          R = f.error;
        n && ((R = Object.values(n)[0]), (n = void 0)),
          (o = o || {}),
          o[y.route.id] == null && (o[y.route.id] = R),
          (s[g] = void 0),
          u || ((u = !0), (d = Ge(f.error) ? f.error.status : 500)),
          f.headers && (m[g] = f.headers);
      } else
        be(f)
          ? (a.set(g, f.deferredData), (s[g] = f.deferredData.data))
          : (s[g] = f.data),
          f.statusCode != null &&
            f.statusCode !== 200 &&
            !u &&
            (d = f.statusCode),
          f.headers && (m[g] = f.headers);
    }),
    n && ((o = n), (s[Object.keys(n)[0]] = void 0)),
    { loaderData: s, errors: o, statusCode: d || 200, loaderHeaders: m }
  );
}
function or(e, t, r, n, a, s, o, d) {
  let { loaderData: u, errors: m } = jr(t, r, n, a, d);
  for (let f = 0; f < s.length; f++) {
    let { key: x, match: g, controller: y } = s[f];
    F(
      o !== void 0 && o[f] !== void 0,
      'Did not find corresponding fetcher result'
    );
    let R = o[f];
    if (!(y && y.signal.aborted))
      if (ve(R)) {
        let w = Ue(e.matches, g?.route.id);
        (m && m[w.route.id]) || (m = C({}, m, { [w.route.id]: R.error })),
          e.fetchers.delete(x);
      } else if (we(R)) F(!1, 'Unhandled fetcher revalidation redirect');
      else if (be(R)) F(!1, 'Unhandled fetcher deferred data');
      else {
        let w = ge(R.data);
        e.fetchers.set(x, w);
      }
  }
  return { loaderData: u, errors: m };
}
function ir(e, t, r, n) {
  let a = C({}, t);
  for (let s of r) {
    let o = s.route.id;
    if (
      (t.hasOwnProperty(o)
        ? t[o] !== void 0 && (a[o] = t[o])
        : e[o] !== void 0 && s.route.loader && (a[o] = e[o]),
      n && n.hasOwnProperty(o))
    )
      break;
  }
  return a;
}
function Ue(e, t) {
  return (
    (t ? e.slice(0, e.findIndex((n) => n.route.id === t) + 1) : [...e])
      .reverse()
      .find((n) => n.route.hasErrorBoundary === !0) || e[0]
  );
}
function lt(e) {
  let t =
    e.length === 1
      ? e[0]
      : e.find((r) => r.index || !r.path || r.path === '/') || {
          id: '__shim-error-route__',
        };
  return {
    matches: [{ params: {}, pathname: '', pathnameBase: '', route: t }],
    route: t,
  };
}
function $(e, t) {
  let { pathname: r, routeId: n, method: a, type: s } = t === void 0 ? {} : t,
    o = 'Unknown Server Error',
    d = 'Unknown @remix-run/router error';
  return (
    e === 400
      ? ((o = 'Bad Request'),
        a && r && n
          ? (d =
              'You made a ' +
              a +
              ' request to "' +
              r +
              '" but ' +
              ('did not provide a `loader` for route "' + n + '", ') +
              'so there is no way to handle the request.')
          : s === 'defer-action'
            ? (d = 'defer() is not supported in actions')
            : s === 'invalid-body' && (d = 'Unable to encode submission body'))
      : e === 403
        ? ((o = 'Forbidden'),
          (d = 'Route "' + n + '" does not match URL "' + r + '"'))
        : e === 404
          ? ((o = 'Not Found'), (d = 'No route matches URL "' + r + '"'))
          : e === 405 &&
            ((o = 'Method Not Allowed'),
            a && r && n
              ? (d =
                  'You made a ' +
                  a.toUpperCase() +
                  ' request to "' +
                  r +
                  '" but ' +
                  ('did not provide an `action` for route "' + n + '", ') +
                  'so there is no way to handle the request.')
              : a && (d = 'Invalid request method "' + a.toUpperCase() + '"')),
    new Xe(e || 500, o, new Error(d), !0)
  );
}
function sr(e) {
  for (let t = e.length - 1; t >= 0; t--) {
    let r = e[t];
    if (we(r)) return { result: r, idx: t };
  }
}
function Mr(e) {
  let t = typeof e == 'string' ? oe(e) : e;
  return de(C({}, t, { hash: '' }));
}
function Ea(e, t) {
  return e.pathname !== t.pathname || e.search !== t.search
    ? !1
    : e.hash === ''
      ? t.hash !== ''
      : e.hash === t.hash
        ? !0
        : t.hash !== '';
}
function be(e) {
  return e.type === N.deferred;
}
function ve(e) {
  return e.type === N.error;
}
function we(e) {
  return (e && e.type) === N.redirect;
}
function Ar(e) {
  let t = e;
  return (
    t &&
    typeof t == 'object' &&
    typeof t.data == 'object' &&
    typeof t.subscribe == 'function' &&
    typeof t.cancel == 'function' &&
    typeof t.resolveData == 'function'
  );
}
function Oe(e) {
  return (
    e != null &&
    typeof e.status == 'number' &&
    typeof e.statusText == 'string' &&
    typeof e.headers == 'object' &&
    typeof e.body < 'u'
  );
}
function Da(e) {
  if (!Oe(e)) return !1;
  let t = e.status,
    r = e.headers.get('Location');
  return t >= 300 && t <= 399 && r != null;
}
function _a(e) {
  return e && Oe(e.response) && (e.type === N.data || e.type === N.error);
}
function _t(e) {
  return ga.has(e.toLowerCase());
}
function te(e) {
  return ma.has(e.toLowerCase());
}
async function lr(e, t, r, n, a, s) {
  for (let o = 0; o < r.length; o++) {
    let d = r[o],
      u = t[o];
    if (!u) continue;
    let m = e.find((x) => x.route.id === u.route.id),
      f = m != null && !Lr(m, u) && (s && s[u.route.id]) !== void 0;
    if (be(d) && (a || f)) {
      let x = n[o];
      F(x, 'Expected an AbortSignal for revalidating fetcher deferred result'),
        await Tr(d, x, a).then((g) => {
          g && (r[o] = g || r[o]);
        });
    }
  }
}
async function Tr(e, t, r) {
  if ((r === void 0 && (r = !1), !(await e.deferredData.resolveData(t)))) {
    if (r)
      try {
        return { type: N.data, data: e.deferredData.unwrappedData };
      } catch (a) {
        return { type: N.error, error: a };
      }
    return { type: N.data, data: e.deferredData.data };
  }
}
function jt(e) {
  return new URLSearchParams(e).getAll('index').some((t) => t === '');
}
function Je(e, t) {
  let r = typeof t == 'string' ? oe(t).search : t.search;
  if (e[e.length - 1].route.index && jt(r || '')) return e[e.length - 1];
  let n = pr(e);
  return n[n.length - 1];
}
function dr(e) {
  let {
    formMethod: t,
    formAction: r,
    formEncType: n,
    text: a,
    formData: s,
    json: o,
  } = e;
  if (!(!t || !r || !n)) {
    if (a != null)
      return {
        formMethod: t,
        formAction: r,
        formEncType: n,
        formData: void 0,
        json: void 0,
        text: a,
      };
    if (s != null)
      return {
        formMethod: t,
        formAction: r,
        formEncType: n,
        formData: s,
        json: void 0,
        text: void 0,
      };
    if (o !== void 0)
      return {
        formMethod: t,
        formAction: r,
        formEncType: n,
        formData: void 0,
        json: o,
        text: void 0,
      };
  }
}
function xt(e, t) {
  return t
    ? {
        state: 'loading',
        location: e,
        formMethod: t.formMethod,
        formAction: t.formAction,
        formEncType: t.formEncType,
        formData: t.formData,
        json: t.json,
        text: t.text,
      }
    : {
        state: 'loading',
        location: e,
        formMethod: void 0,
        formAction: void 0,
        formEncType: void 0,
        formData: void 0,
        json: void 0,
        text: void 0,
      };
}
function Pa(e, t) {
  return {
    state: 'submitting',
    location: e,
    formMethod: t.formMethod,
    formAction: t.formAction,
    formEncType: t.formEncType,
    formData: t.formData,
    json: t.json,
    text: t.text,
  };
}
function We(e, t) {
  return e
    ? {
        state: 'loading',
        formMethod: e.formMethod,
        formAction: e.formAction,
        formEncType: e.formEncType,
        formData: e.formData,
        json: e.json,
        text: e.text,
        data: t,
      }
    : {
        state: 'loading',
        formMethod: void 0,
        formAction: void 0,
        formEncType: void 0,
        formData: void 0,
        json: void 0,
        text: void 0,
        data: t,
      };
}
function La(e, t) {
  return {
    state: 'submitting',
    formMethod: e.formMethod,
    formAction: e.formAction,
    formEncType: e.formEncType,
    formData: e.formData,
    json: e.json,
    text: e.text,
    data: t ? t.data : void 0,
  };
}
function ge(e) {
  return {
    state: 'idle',
    formMethod: void 0,
    formAction: void 0,
    formEncType: void 0,
    formData: void 0,
    json: void 0,
    text: void 0,
    data: e,
  };
}
function ja(e, t) {
  try {
    let r = e.sessionStorage.getItem(Dr);
    if (r) {
      let n = JSON.parse(r);
      for (let [a, s] of Object.entries(n || {}))
        s && Array.isArray(s) && t.set(a, new Set(s || []));
    }
  } catch {}
}
function Ma(e, t) {
  if (t.size > 0) {
    let r = {};
    for (let [n, a] of t) r[n] = [...a];
    try {
      e.sessionStorage.setItem(Dr, JSON.stringify(r));
    } catch (n) {
      ae(
        !1,
        'Failed to save applied view transitions in sessionStorage (' + n + ').'
      );
    }
  }
}
var q,
  Gt,
  N,
  Kn,
  Jn,
  Yn,
  Gn,
  Qn,
  Zn,
  ea,
  Zt,
  Fe,
  br,
  ua,
  ca,
  Pt,
  Ve,
  st,
  vr,
  Lt,
  wr,
  Xe,
  Rr,
  ma,
  pa,
  ga,
  ya,
  ba,
  it,
  Sr,
  Ce,
  xr,
  Er,
  Dr,
  _r,
  ke = Nn(() => {
    (function (e) {
      (e.Pop = 'POP'), (e.Push = 'PUSH'), (e.Replace = 'REPLACE');
    })(q || (q = {}));
    Gt = 'popstate';
    (function (e) {
      (e.data = 'data'),
        (e.deferred = 'deferred'),
        (e.redirect = 'redirect'),
        (e.error = 'error');
    })(N || (N = {}));
    Kn = new Set(['lazy', 'caseSensitive', 'path', 'id', 'index', 'children']);
    (Jn = /^:[\w-]+$/),
      (Yn = 3),
      (Gn = 2),
      (Qn = 1),
      (Zn = 10),
      (ea = -2),
      (Zt = (e) => e === '*');
    (Fe = (e) => e.join('/').replace(/\/\/+/g, '/')),
      (br = (e) => e.replace(/\/+$/, '').replace(/^\/*/, '/')),
      (ua = (e) => (!e || e === '?' ? '' : e.startsWith('?') ? e : '?' + e)),
      (ca = (e) => (!e || e === '#' ? '' : e.startsWith('#') ? e : '#' + e)),
      (Pt = function (t, r) {
        r === void 0 && (r = {});
        let n = typeof r == 'number' ? { status: r } : r,
          a = new Headers(n.headers);
        return (
          a.has('Content-Type') ||
            a.set('Content-Type', 'application/json; charset=utf-8'),
          new Response(JSON.stringify(t), C({}, n, { headers: a }))
        );
      }),
      (Ve = class extends Error {}),
      (st = class {
        constructor(t, r) {
          (this.pendingKeysSet = new Set()),
            (this.subscribers = new Set()),
            (this.deferredKeys = []),
            F(
              t && typeof t == 'object' && !Array.isArray(t),
              'defer() only accepts plain objects'
            );
          let n;
          (this.abortPromise = new Promise((s, o) => (n = o))),
            (this.controller = new AbortController());
          let a = () => n(new Ve('Deferred data aborted'));
          (this.unlistenAbortSignal = () =>
            this.controller.signal.removeEventListener('abort', a)),
            this.controller.signal.addEventListener('abort', a),
            (this.data = Object.entries(t).reduce((s, o) => {
              let [d, u] = o;
              return Object.assign(s, { [d]: this.trackPromise(d, u) });
            }, {})),
            this.done && this.unlistenAbortSignal(),
            (this.init = r);
        }
        trackPromise(t, r) {
          if (!(r instanceof Promise)) return r;
          this.deferredKeys.push(t), this.pendingKeysSet.add(t);
          let n = Promise.race([r, this.abortPromise]).then(
            (a) => this.onSettle(n, t, void 0, a),
            (a) => this.onSettle(n, t, a)
          );
          return (
            n.catch(() => {}),
            Object.defineProperty(n, '_tracked', { get: () => !0 }),
            n
          );
        }
        onSettle(t, r, n, a) {
          if (this.controller.signal.aborted && n instanceof Ve)
            return (
              this.unlistenAbortSignal(),
              Object.defineProperty(t, '_error', { get: () => n }),
              Promise.reject(n)
            );
          if (
            (this.pendingKeysSet.delete(r),
            this.done && this.unlistenAbortSignal(),
            n === void 0 && a === void 0)
          ) {
            let s = new Error(
              'Deferred data for key "' +
                r +
                '" resolved/rejected with `undefined`, you must resolve/reject with a value or `null`.'
            );
            return (
              Object.defineProperty(t, '_error', { get: () => s }),
              this.emit(!1, r),
              Promise.reject(s)
            );
          }
          return a === void 0
            ? (Object.defineProperty(t, '_error', { get: () => n }),
              this.emit(!1, r),
              Promise.reject(n))
            : (Object.defineProperty(t, '_data', { get: () => a }),
              this.emit(!1, r),
              a);
        }
        emit(t, r) {
          this.subscribers.forEach((n) => n(t, r));
        }
        subscribe(t) {
          return this.subscribers.add(t), () => this.subscribers.delete(t);
        }
        cancel() {
          this.controller.abort(),
            this.pendingKeysSet.forEach((t, r) =>
              this.pendingKeysSet.delete(r)
            ),
            this.emit(!0);
        }
        async resolveData(t) {
          let r = !1;
          if (!this.done) {
            let n = () => this.cancel();
            t.addEventListener('abort', n),
              (r = await new Promise((a) => {
                this.subscribe((s) => {
                  t.removeEventListener('abort', n), (s || this.done) && a(s);
                });
              }));
          }
          return r;
        }
        get done() {
          return this.pendingKeysSet.size === 0;
        }
        get unwrappedData() {
          return (
            F(
              this.data !== null && this.done,
              'Can only unwrap data on initialized and settled deferreds'
            ),
            Object.entries(this.data).reduce((t, r) => {
              let [n, a] = r;
              return Object.assign(t, { [n]: ha(a) });
            }, {})
          );
        }
        get pendingKeys() {
          return Array.from(this.pendingKeysSet);
        }
      });
    (vr = function (t, r) {
      r === void 0 && (r = {});
      let n = typeof r == 'number' ? { status: r } : r;
      return new st(t, n);
    }),
      (Lt = function (t, r) {
        r === void 0 && (r = 302);
        let n = r;
        typeof n == 'number'
          ? (n = { status: n })
          : typeof n.status > 'u' && (n.status = 302);
        let a = new Headers(n.headers);
        return (
          a.set('Location', t), new Response(null, C({}, n, { headers: a }))
        );
      }),
      (wr = (e, t) => {
        let r = Lt(e, t);
        return r.headers.set('X-Remix-Reload-Document', 'true'), r;
      }),
      (Xe = class {
        constructor(t, r, n, a) {
          a === void 0 && (a = !1),
            (this.status = t),
            (this.statusText = r || ''),
            (this.internal = a),
            n instanceof Error
              ? ((this.data = n.toString()), (this.error = n))
              : (this.data = n);
        }
      });
    (Rr = ['post', 'put', 'patch', 'delete']),
      (ma = new Set(Rr)),
      (pa = ['get', ...Rr]),
      (ga = new Set(pa)),
      (ya = new Set([301, 302, 303, 307, 308])),
      (ba = new Set([307, 308])),
      (it = {
        state: 'idle',
        location: void 0,
        formMethod: void 0,
        formAction: void 0,
        formEncType: void 0,
        formData: void 0,
        json: void 0,
        text: void 0,
      }),
      (Sr = {
        state: 'idle',
        data: void 0,
        formMethod: void 0,
        formAction: void 0,
        formEncType: void 0,
        formData: void 0,
        json: void 0,
        text: void 0,
      }),
      (Ce = {
        state: 'unblocked',
        proceed: void 0,
        reset: void 0,
        location: void 0,
      }),
      (xr = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i),
      (Er = (e) => ({ hasErrorBoundary: !!e.hasErrorBoundary })),
      (Dr = 'remix-router-transitions');
    _r = Symbol('deferred');
  });
var Hr = Y((Fo, kr) => {
  kr.exports = {};
});
var Nr = Y((Uo, Ir) => {
  Ir.exports = {};
});
var Br = Y((Oo, zr) => {
  zr.exports = {};
});
var $r = Y((ko, qr) => {
  qr.exports = {};
});
var Kr = Y((Ho, Wr) => {
  Wr.exports = {};
});
var Xr = Y((Io, Vr) => {
  Vr.exports = {};
});
var Yr = Y((No, Jr) => {
  Jr.exports = {};
});
var Qr = Y((zo, Gr) => {
  Gr.exports = {};
});
var en = Y((Bo, Zr) => {
  Zr.exports = {};
});
var rn = Y((qo, tn) => {
  tn.exports = {};
});
var an = Y(($o, nn) => {
  nn.exports = {};
});
var Ut = Y((ft) => {
  'use strict';
  Object.defineProperty(ft, '__esModule', { value: !0 });
  var ct = (function (e) {
    return (
      (e.Development = 'development'),
      (e.Production = 'production'),
      (e.Test = 'test'),
      e
    );
  })({});
  function Qa(e) {
    return e === ct.Development || e === ct.Production || e === ct.Test;
  }
  ft.ServerMode = ct;
  ft.isServerMode = Qa;
});
var on = Y((He) => {
  'use strict';
  Object.defineProperty(He, '__esModule', { value: !0 });
  var Za = (ke(), Yt(Mt)),
    eo = Ut();
  function ht(e, t) {
    if (e instanceof Error && t !== eo.ServerMode.Development) {
      let r = new Error('Unexpected Server Error');
      return (r.stack = void 0), r;
    }
    return e;
  }
  function to(e, t) {
    return Object.entries(e).reduce(
      (r, [n, a]) => Object.assign(r, { [n]: ht(a, t) }),
      {}
    );
  }
  function ro(e, t) {
    let r = ht(e, t);
    return { message: r.message, stack: r.stack };
  }
  function no(e, t) {
    if (!e) return null;
    let r = Object.entries(e),
      n = {};
    for (let [a, s] of r)
      if (Za.isRouteErrorResponse(s))
        n[a] = { ...s, __type: 'RouteErrorResponse' };
      else if (s instanceof Error) {
        let o = ht(s, t);
        n[a] = {
          message: o.message,
          stack: o.stack,
          __type: 'Error',
          ...(o.name !== 'Error' ? { __subType: o.name } : {}),
        };
      } else n[a] = s;
    return n;
  }
  He.sanitizeError = ht;
  He.sanitizeErrors = to;
  He.serializeError = ro;
  He.serializeErrors = no;
});
var Ot = Y((ie) => {
  'use strict';
  Object.defineProperty(ie, '__esModule', { value: !0 });
  var mt = (ke(), Yt(Mt)),
    ao = on(),
    oo = (e, t = {}) => mt.json(e, t),
    io = (e, t = {}) => mt.defer(e, t),
    so = (e, t = 302) => mt.redirect(e, t),
    lo = (e, t = 302) => mt.redirectDocument(e, t);
  function uo(e) {
    let t = e;
    return (
      t &&
      typeof t == 'object' &&
      typeof t.data == 'object' &&
      typeof t.subscribe == 'function' &&
      typeof t.cancel == 'function' &&
      typeof t.resolveData == 'function'
    );
  }
  function co(e) {
    return (
      e != null &&
      typeof e.status == 'number' &&
      typeof e.statusText == 'string' &&
      typeof e.headers == 'object' &&
      typeof e.body < 'u'
    );
  }
  var fo = new Set([301, 302, 303, 307, 308]);
  function ln(e) {
    return fo.has(e);
  }
  function ho(e) {
    return ln(e.status);
  }
  function mo(e) {
    return e != null && typeof e.then == 'function' && e._tracked === !0;
  }
  var po = '__deferred_promise:';
  function go(e, t, r) {
    let n = new TextEncoder();
    return new ReadableStream({
      async start(s) {
        let o = {},
          d = [];
        for (let [m, f] of Object.entries(e.data))
          mo(f)
            ? ((o[m] = `${po}${m}`),
              (typeof f._data < 'u' || typeof f._error < 'u') && d.push(m))
            : (o[m] = f);
        s.enqueue(
          n.encode(
            JSON.stringify(o) +
              `

`
          )
        );
        for (let m of d) sn(s, n, m, e.data[m], r);
        let u = e.subscribe((m, f) => {
          f && sn(s, n, f, e.data[f], r);
        });
        await e.resolveData(t), u(), s.close();
      },
    });
  }
  function sn(e, t, r, n, a) {
    '_error' in n
      ? e.enqueue(
          t.encode(
            'error:' +
              JSON.stringify({
                [r]:
                  n._error instanceof Error
                    ? ao.serializeError(n._error, a)
                    : n._error,
              }) +
              `

`
          )
        )
      : e.enqueue(
          t.encode(
            'data:' +
              JSON.stringify({ [r]: n._data ?? null }) +
              `

`
          )
        );
  }
  ie.createDeferredReadableStream = go;
  ie.defer = io;
  ie.isDeferredData = uo;
  ie.isRedirectResponse = ho;
  ie.isRedirectStatusCode = ln;
  ie.isResponse = co;
  ie.json = oo;
  ie.redirect = so;
  ie.redirectDocument = lo;
});
var Or = {};
ke();
var At = (e, t = {}) => Pt(e, t);
var Aa = ['/build/', '/icons/'],
  Cr = 'asset-cache',
  Fr = 'data-cache',
  Ur = 'document-cache';
function re(...e) {
  console.debug(...e);
}
async function Ta(e) {
  re('Service worker installed');
}
async function Ca(e) {
  re('Service worker activated');
}
async function Fa(e) {
  let t = new Map();
  if (e.data.type === 'REMIX_NAVIGATION') {
    let { isMount: r, location: n, matches: a, manifest: s } = e.data,
      o = n.pathname + n.search + n.hash,
      [d, u, m] = await Promise.all([
        caches.open(Fr),
        caches.open(Ur),
        caches.match(o),
      ]);
    if (
      ((!m || !r) &&
        (re('Caching document for', o),
        t.set(
          o,
          u.add(o).catch((f) => {
            re(`Failed to cache document for ${o}:`, f);
          })
        )),
      r)
    ) {
      for (let f of a)
        if (s.routes[f.id].hasLoader) {
          let x = new URLSearchParams(n.search);
          x.set('_data', f.id);
          let g = x.toString();
          g = g ? `?${g}` : '';
          let y = n.pathname + g + n.hash;
          t.has(y) ||
            (re('Caching data for', y),
            t.set(
              y,
              d.add(y).catch((R) => {
                re(`Failed to cache data for ${y}:`, R);
              })
            ));
        }
    }
  }
  await Promise.all(t.values());
}
async function Ua(e) {
  let t = new URL(e.request.url);
  if (Oa(e.request)) {
    let r = await caches.match(e.request, {
      cacheName: Cr,
      ignoreVary: !0,
      ignoreSearch: !0,
    });
    if (r) return re('Serving asset from cache', t.pathname), r;
    re('Serving asset from network', t.pathname);
    let n = await fetch(e.request);
    return (
      n.status === 200 &&
        (await (await caches.open(Cr)).put(e.request, n.clone())),
      n
    );
  }
  if (ka(e.request))
    try {
      re('Serving data from network', t.pathname + t.search);
      let r = await fetch(e.request.clone());
      return await (await caches.open(Fr)).put(e.request, r.clone()), r;
    } catch {
      re(
        'Serving data from network failed, falling back to cache',
        t.pathname + t.search
      );
      let n = await caches.match(e.request);
      return n
        ? (n.headers.set('X-Remix-Worker', 'yes'), n)
        : At(
            { message: 'Network Error' },
            {
              status: 500,
              headers: { 'X-Remix-Catch': 'yes', 'X-Remix-Worker': 'yes' },
            }
          );
    }
  if (Ha(e.request))
    try {
      re('Serving document from network', t.pathname);
      let r = await fetch(e.request);
      return await (await caches.open(Ur)).put(e.request, r.clone()), r;
    } catch (r) {
      re(
        'Serving document from network failed, falling back to cache',
        t.pathname
      );
      let n = await caches.match(e.request);
      if (n) return n;
      throw r;
    }
  return fetch(e.request.clone());
}
function Tt(e, t) {
  return t.includes(e.method.toLowerCase());
}
function Oa(e) {
  return Tt(e, ['get']) && Aa.some((t) => e.url.startsWith(t));
}
function ka(e) {
  let t = new URL(e.url);
  return Tt(e, ['get']) && t.searchParams.get('_data');
}
function Ha(e) {
  return Tt(e, ['get']) && e.mode === 'navigate';
}
self.addEventListener('install', (e) => {
  e.waitUntil(Ta(e).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(Ca(e).then(() => self.clients.claim()));
});
self.addEventListener('message', (e) => {
  e.waitUntil(Fa(e));
});
self.addEventListener('fetch', (e) => {
  e.respondWith(
    (async () => {
      let t = {};
      try {
        t.response = await Ua(e);
      } catch (r) {
        t.error = r;
      }
      return Ia(e, t);
    })()
  );
});
async function Ia(e, { error: t, response: r }) {
  return r || new Response('Error: ' + t, { status: 500 });
}
var Na = G(Hr()),
  za = G(Nr()),
  Ba = G(Br()),
  qa = G($r()),
  $a = G(Kr()),
  Wa = G(Xr()),
  Ka = G(Yr()),
  Va = G(Qr()),
  Xa = G(en()),
  Ja = G(rn()),
  Ya = G(an());
var Ct = [
  '/build/root-FLSTTGBR.js',
  '/build/manifest-6BF465EB.js',
  '/build/entry.client-GCYNPXKC.js',
  '/build/__remix_entry_dev-4AM2EYRK.js',
  '/build/routes/manifest[.]webmanifest-5TSLQ42N.js',
  '/build/routes/feed[.xml]-T2YVFDI4.js',
  '/build/routes/articles_.tags_.$tag-6F5ZXZRY.js',
  '/build/routes/articles_.tags-VKH7VGOH.js',
  '/build/routes/articles_.$id-YEWFMVJM.js',
  '/build/routes/articles-K2TRZQVQ.js',
  '/build/routes/about-NUG65OYO.js',
  '/build/routes/_index-XDZJZEGS.js',
  '/build/routes/404-MN3SJPQ7.js',
  '/build/routes/$-TILFHGVP.js',
  '/build/_shared/runtime-QWW6WTEI.js',
  '/build/_shared/remix_hmr-MGNVQLUG.js',
  '/build/_shared/react-dom-DWCEFP2Q.js',
  '/build/_shared/react-JAEBBV56.js',
  '/build/_shared/jsx-runtime-QA7ESHHU.js',
  '/build/_shared/jsx-dev-runtime-J42BF2ES.js',
  '/build/_shared/esm-5LHNIP5A.js',
  '/build/_shared/client-JOU4YHLF.js',
  '/build/_shared/chunk-WZXBGIOM.js',
  '/build/_shared/chunk-V6UWXNT2.js',
  '/build/_shared/chunk-S2VO2VHD.js',
  '/build/_shared/chunk-PZDJHGND.js',
  '/build/_shared/chunk-OB3EQYEC.js',
  '/build/_shared/chunk-NQPDFHR5.js',
  '/build/_shared/chunk-NBEH4DGX.js',
  '/build/_shared/chunk-LU54BLTC.js',
  '/build/_shared/chunk-L3AF6RVZ.js',
  '/build/_shared/chunk-KQKFLMCB.js',
  '/build/_shared/chunk-KKL3OXSK.js',
  '/build/_shared/chunk-KGLT7VYR.js',
  '/build/_shared/chunk-IC77GIV6.js',
  '/build/_shared/chunk-GZYRKJXK.js',
  '/build/_shared/chunk-FMC2X5XU.js',
  '/build/_shared/chunk-F3JYS3A6.js',
  '/build/_shared/chunk-BNPGTLDH.js',
  '/build/_shared/chunk-7QRF24LN.js',
  '/build/_shared/chunk-6AOLVOSX.js',
  '/build/_shared/chunk-4KFOAMC6.js',
  '/build/_assets/shared-AVY6HOXY.css',
  '/build/_assets/github-BSSX6CBR.css',
];
var Ft = {
    root: {
      id: 'root',
      parentId: void 0,
      path: '',
      index: void 0,
      caseSensitive: void 0,
      module: Na,
    },
    'routes/manifest[.]webmanifest': {
      id: 'routes/manifest[.]webmanifest',
      parentId: 'root',
      path: 'manifest.webmanifest',
      index: void 0,
      caseSensitive: void 0,
      module: za,
    },
    'routes/articles_.tags_.$tag': {
      id: 'routes/articles_.tags_.$tag',
      parentId: 'root',
      path: 'articles/tags/:tag',
      index: void 0,
      caseSensitive: void 0,
      module: Ba,
    },
    'routes/articles_.tags': {
      id: 'routes/articles_.tags',
      parentId: 'root',
      path: 'articles/tags',
      index: void 0,
      caseSensitive: void 0,
      module: qa,
    },
    'routes/articles_.$id': {
      id: 'routes/articles_.$id',
      parentId: 'root',
      path: 'articles/:id',
      index: void 0,
      caseSensitive: void 0,
      module: $a,
    },
    'routes/feed[.xml]': {
      id: 'routes/feed[.xml]',
      parentId: 'root',
      path: 'feed.xml',
      index: void 0,
      caseSensitive: void 0,
      module: Wa,
    },
    'routes/articles': {
      id: 'routes/articles',
      parentId: 'root',
      path: 'articles',
      index: void 0,
      caseSensitive: void 0,
      module: Ka,
    },
    'routes/_index': {
      id: 'routes/_index',
      parentId: 'root',
      path: void 0,
      index: !0,
      caseSensitive: void 0,
      module: Va,
    },
    'routes/about': {
      id: 'routes/about',
      parentId: 'root',
      path: 'about',
      index: void 0,
      caseSensitive: void 0,
      module: Xa,
    },
    'routes/404': {
      id: 'routes/404',
      parentId: 'root',
      path: '404',
      index: void 0,
      caseSensitive: void 0,
      module: Ja,
    },
    'routes/$': {
      id: 'routes/$',
      parentId: 'root',
      path: '*',
      index: void 0,
      caseSensitive: void 0,
      module: Ya,
    },
  },
  ut = { module: Or };
ke();
var yn = G(Ut(), 1),
  X = G(Ot(), 1);
ke();
function dn(e) {
  let t = {};
  for (let r in e) t[r] = e[r];
  return t;
}
function kt(e, t = '') {
  let r = new URL(e.url),
    n = dt(t, r.pathname);
  return {
    ...Object.fromEntries(new URL(e.url).searchParams.entries()),
    ...n?.params,
  };
}
function yo(e) {
  let t = new URL(e.url),
    r = t.searchParams.getAll('index'),
    n = [];
  t.searchParams.delete('index');
  for (let a of r) a && n.push(a);
  for (let a of n) t.searchParams.append('index', a);
  return new Request(t.href, { ...dn(e), duplex: 'half' });
}
function bo(e) {
  let t = new URL(e.url);
  return (
    t.searchParams.delete('_data'),
    new Request(t.href, { ...dn(e), duplex: 'half' })
  );
}
function Ht({ event: e, loadContext: t, path: r }) {
  let n = bo(yo(e.request.clone())),
    a = kt(n, r);
  return { request: n, params: a, context: t };
}
function un(e, t) {
  return t.includes(e.method.toLowerCase());
}
function cn(e) {
  let t = new URL(e.url);
  return (
    un(e, ['post', 'delete', 'put', 'patch']) && t.searchParams.get('_data')
  );
}
function fn(e) {
  let t = new URL(e.url);
  return un(e, ['get']) && t.searchParams.get('_data');
}
var hn = G(Ot(), 1);
function mn(e) {
  return (0, hn.json)(e.error || { message: 'Unexpected Server Error' }, {
    status: e.status,
    statusText: e.statusText,
    headers: { 'X-Remix-Error': 'yes' },
  });
}
function pn(e) {
  return Array.from(e.headers.keys()).some((t) =>
    t.toLowerCase().startsWith('x-remix-')
  );
}
async function bn({
  defaultHandler: e,
  errorHandler: t,
  event: r,
  loadContext: n,
  routes: a,
}) {
  let o = new URL(r.request.url).searchParams.get('_data'),
    d = o ? a[o] : void 0,
    u = { request: r.request, params: kt(r.request, d?.path), context: n };
  try {
    if (fn(r.request) && d?.module.workerLoader)
      return await vo({
        event: r,
        loader: d.module.workerLoader,
        routeId: d.id,
        routePath: d.path,
        loadContext: n,
      }).then(gn);
    if (cn(r.request) && d?.module?.workerAction)
      return await wo({
        event: r,
        action: d.module.workerAction,
        routeId: d.id,
        routePath: d.path,
        loadContext: n,
      }).then(gn);
  } catch (m) {
    return Ro({ error: m, handler: (x) => t(x, u) });
  }
  return e(u);
}
async function vo({
  event: e,
  loadContext: t,
  loader: r,
  routeId: n,
  routePath: a,
}) {
  let s = Ht({ event: e, loadContext: t, path: a }),
    o = await r(s);
  if (o === void 0)
    throw new Error(
      `You defined a loader for route "${n}" but didn't return anything from your \`worker loader\` function. Please return a value or \`null\`.`
    );
  if ((0, X.isDeferredData)(o)) {
    if (o.init && (0, X.isRedirectStatusCode)(o.init.status || 200))
      return (0, X.redirect)(
        new Headers(o.init.headers).get('Location'),
        o.init
      );
    let d = (0, X.createDeferredReadableStream)(
        o,
        e.request.signal,
        yn.ServerMode.Production
      ),
      u = o.init || {},
      m = new Headers(u.headers);
    return (
      m.set('Content-Type', 'text/remix-deferred'),
      (u.headers = m),
      new Response(d, u)
    );
  }
  return (0, X.isResponse)(o) ? o : (0, X.json)(o);
}
async function wo({
  action: e,
  event: t,
  loadContext: r,
  routeId: n,
  routePath: a,
}) {
  let s = Ht({ event: t, loadContext: r, path: a }),
    o = await e(s);
  if (o === void 0)
    throw new Error(
      `You defined an action for route "${n}" but didn't return anything from your \`worker action\` function. Please return a value or \`null\`.`
    );
  return (0, X.isResponse)(o) ? o : (0, X.json)(o);
}
function Ro({ error: e, handler: t }) {
  if ((0, X.isResponse)(e)) return e.headers.set('X-Remix-Catch', 'yes'), e;
  if (Ge(e)) return e.error && t(e.error), mn(e);
  let r = e instanceof Error ? e : new Error('Unexpected Server Error');
  return (
    t(r),
    (0, X.json)(
      { message: r.message },
      { status: 500, headers: { 'X-Remix-Error': 'yes' } }
    )
  );
}
function gn(e) {
  if ((0, X.isRedirectResponse)(e)) {
    let t = new Headers(e.headers);
    return (
      t.set('X-Remix-Redirect', t.get('Location')),
      t.set('X-Remix-Status', String(e.status)),
      t.delete('Location'),
      e.headers.get('Set-Cookie') !== null &&
        t.set('X-Remix-Revalidate', 'yes'),
      new Response(null, { status: 204, headers: t })
    );
  }
  return !pn(e) && e.headers.set('X-Remix-Response', 'yes'), e;
}
var vn = self;
function So(e) {
  let t = ut.module.getLoadContext?.(e) || {};
  return { event: e, fetchFromServer: () => fetch(e.request.clone()), ...t };
}
var xo = ut.module.defaultFetchHandler || ((e) => fetch(e.request.clone())),
  Eo =
    ut.module.errorHandler ||
    ((e, { request: t }) => {
      t.signal.aborted || console.error(e);
    });
vn.__workerManifest = { assets: Ct, routes: Ft };
vn.addEventListener('fetch', (e) => {
  let t = bn({
    event: e,
    routes: Ft,
    defaultHandler: xo,
    errorHandler: Eo,
    loadContext: So(e),
  });
  return e.respondWith(t);
});
/*! Bundled license information:

@remix-run/router/dist/router.js:
  (**
   * @remix-run/router v1.14.2
   *
   * Copyright (c) Remix Software Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   *)

@remix-run/server-runtime/dist/mode.js:
  (**
   * @remix-run/server-runtime v2.5.0
   *
   * Copyright (c) Remix Software Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   *)

@remix-run/server-runtime/dist/errors.js:
  (**
   * @remix-run/server-runtime v2.5.0
   *
   * Copyright (c) Remix Software Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   *)

@remix-run/server-runtime/dist/responses.js:
  (**
   * @remix-run/server-runtime v2.5.0
   *
   * Copyright (c) Remix Software Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   *)

@remix-run/server-runtime/dist/esm/responses.js:
  (**
   * @remix-run/server-runtime v2.5.0
   *
   * Copyright (c) Remix Software Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   *)

@remix-run/server-runtime/dist/esm/index.js:
  (**
   * @remix-run/server-runtime v2.5.0
   *
   * Copyright (c) Remix Software Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE.md file in the root directory of this source tree.
   *
   * @license MIT
   *)
*/
