
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    const is_client = typeof window !== 'undefined';
    let now$1 = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function beforeUpdate(fn) {
        get_current_component().$$.before_update.push(fn);
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now$1() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.4' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /**
     * @typedef {Object} WrappedComponent Object returned by the `wrap` method
     * @property {SvelteComponent} component - Component to load (this is always asynchronous)
     * @property {RoutePrecondition[]} [conditions] - Route pre-conditions to validate
     * @property {Object} [props] - Optional dictionary of static props
     * @property {Object} [userData] - Optional user data dictionary
     * @property {bool} _sveltesparouter - Internal flag; always set to true
     */

    /**
     * @callback AsyncSvelteComponent
     * @returns {Promise<SvelteComponent>} Returns a Promise that resolves with a Svelte component
     */

    /**
     * @callback RoutePrecondition
     * @param {RouteDetail} detail - Route detail object
     * @returns {boolean|Promise<boolean>} If the callback returns a false-y value, it's interpreted as the precondition failed, so it aborts loading the component (and won't process other pre-condition callbacks)
     */

    /**
     * @typedef {Object} WrapOptions Options object for the call to `wrap`
     * @property {SvelteComponent} [component] - Svelte component to load (this is incompatible with `asyncComponent`)
     * @property {AsyncSvelteComponent} [asyncComponent] - Function that returns a Promise that fulfills with a Svelte component (e.g. `{asyncComponent: () => import('Foo.svelte')}`)
     * @property {SvelteComponent} [loadingComponent] - Svelte component to be displayed while the async route is loading (as a placeholder); when unset or false-y, no component is shown while component
     * @property {object} [loadingParams] - Optional dictionary passed to the `loadingComponent` component as params (for an exported prop called `params`)
     * @property {object} [userData] - Optional object that will be passed to events such as `routeLoading`, `routeLoaded`, `conditionsFailed`
     * @property {object} [props] - Optional key-value dictionary of static props that will be passed to the component. The props are expanded with {...props}, so the key in the dictionary becomes the name of the prop.
     * @property {RoutePrecondition[]|RoutePrecondition} [conditions] - Route pre-conditions to add, which will be executed in order
     */

    /**
     * Wraps a component to enable multiple capabilities:
     * 1. Using dynamically-imported component, with (e.g. `{asyncComponent: () => import('Foo.svelte')}`), which also allows bundlers to do code-splitting.
     * 2. Adding route pre-conditions (e.g. `{conditions: [...]}`)
     * 3. Adding static props that are passed to the component
     * 4. Adding custom userData, which is passed to route events (e.g. route loaded events) or to route pre-conditions (e.g. `{userData: {foo: 'bar}}`)
     * 
     * @param {WrapOptions} args - Arguments object
     * @returns {WrappedComponent} Wrapped component
     */
    function wrap$1(args) {
        if (!args) {
            throw Error('Parameter args is required')
        }

        // We need to have one and only one of component and asyncComponent
        // This does a "XNOR"
        if (!args.component == !args.asyncComponent) {
            throw Error('One and only one of component and asyncComponent is required')
        }

        // If the component is not async, wrap it into a function returning a Promise
        if (args.component) {
            args.asyncComponent = () => Promise.resolve(args.component);
        }

        // Parameter asyncComponent and each item of conditions must be functions
        if (typeof args.asyncComponent != 'function') {
            throw Error('Parameter asyncComponent must be a function')
        }
        if (args.conditions) {
            // Ensure it's an array
            if (!Array.isArray(args.conditions)) {
                args.conditions = [args.conditions];
            }
            for (let i = 0; i < args.conditions.length; i++) {
                if (!args.conditions[i] || typeof args.conditions[i] != 'function') {
                    throw Error('Invalid parameter conditions[' + i + ']')
                }
            }
        }

        // Check if we have a placeholder component
        if (args.loadingComponent) {
            args.asyncComponent.loading = args.loadingComponent;
            args.asyncComponent.loadingParams = args.loadingParams || undefined;
        }

        // Returns an object that contains all the functions to execute too
        // The _sveltesparouter flag is to confirm the object was created by this router
        const obj = {
            component: args.asyncComponent,
            userData: args.userData,
            conditions: (args.conditions && args.conditions.length) ? args.conditions : undefined,
            props: (args.props && Object.keys(args.props).length) ? args.props : {},
            _sveltesparouter: true
        };

        return obj
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    function parse$1(str, loose) {
    	if (str instanceof RegExp) return { keys:false, pattern:str };
    	var c, o, tmp, ext, keys=[], pattern='', arr = str.split('/');
    	arr[0] || arr.shift();

    	while (tmp = arr.shift()) {
    		c = tmp[0];
    		if (c === '*') {
    			keys.push('wild');
    			pattern += '/(.*)';
    		} else if (c === ':') {
    			o = tmp.indexOf('?', 1);
    			ext = tmp.indexOf('.', 1);
    			keys.push( tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length) );
    			pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
    			if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
    		} else {
    			pattern += '/' + tmp;
    		}
    	}

    	return {
    		keys: keys,
    		pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
    	};
    }

    /* node_modules/svelte-spa-router/Router.svelte generated by Svelte v3.46.4 */

    const { Error: Error_1, Object: Object_1, console: console_1 } = globals;

    // (251:0) {:else}
    function create_else_block$1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*props*/ 4)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*props*/ ctx[2])])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[7]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(251:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (244:0) {#if componentParams}
    function create_if_block$3(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [{ params: /*componentParams*/ ctx[1] }, /*props*/ ctx[2]];
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*componentParams, props*/ 6)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*componentParams*/ 2 && { params: /*componentParams*/ ctx[1] },
    					dirty & /*props*/ 4 && get_spread_object(/*props*/ ctx[2])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[6]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(244:0) {#if componentParams}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$3, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*componentParams*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function wrap(component, userData, ...conditions) {
    	// Use the new wrap method and show a deprecation warning
    	// eslint-disable-next-line no-console
    	console.warn('Method `wrap` from `svelte-spa-router` is deprecated and will be removed in a future version. Please use `svelte-spa-router/wrap` instead. See http://bit.ly/svelte-spa-router-upgrading');

    	return wrap$1({ component, userData, conditions });
    }

    /**
     * @typedef {Object} Location
     * @property {string} location - Location (page/view), for example `/book`
     * @property {string} [querystring] - Querystring from the hash, as a string not parsed
     */
    /**
     * Returns the current location from the hash.
     *
     * @returns {Location} Location object
     * @private
     */
    function getLocation$1() {
    	const hashPosition = window.location.href.indexOf('#/');

    	let location = hashPosition > -1
    	? window.location.href.substr(hashPosition + 1)
    	: '/';

    	// Check if there's a querystring
    	const qsPosition = location.indexOf('?');

    	let querystring = '';

    	if (qsPosition > -1) {
    		querystring = location.substr(qsPosition + 1);
    		location = location.substr(0, qsPosition);
    	}

    	return { location, querystring };
    }

    const loc$1 = readable(null, // eslint-disable-next-line prefer-arrow-callback
    function start(set) {
    	set(getLocation$1());

    	const update = () => {
    		set(getLocation$1());
    	};

    	window.addEventListener('hashchange', update, false);

    	return function stop() {
    		window.removeEventListener('hashchange', update, false);
    	};
    });

    const location = derived(loc$1, $loc => $loc.location);
    const querystring = derived(loc$1, $loc => $loc.querystring);
    const params = writable(undefined);

    async function push(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	// Note: this will include scroll state in history even when restoreScrollState is false
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined,
    		undefined
    	);

    	window.location.hash = (location.charAt(0) == '#' ? '' : '#') + location;
    }

    async function pop() {
    	// Execute this code when the current call stack is complete
    	await tick();

    	window.history.back();
    }

    async function replace(location) {
    	if (!location || location.length < 1 || location.charAt(0) != '/' && location.indexOf('#/') !== 0) {
    		throw Error('Invalid parameter location');
    	}

    	// Execute this code when the current call stack is complete
    	await tick();

    	const dest = (location.charAt(0) == '#' ? '' : '#') + location;

    	try {
    		const newState = { ...history.state };
    		delete newState['__svelte_spa_router_scrollX'];
    		delete newState['__svelte_spa_router_scrollY'];
    		window.history.replaceState(newState, undefined, dest);
    	} catch(e) {
    		// eslint-disable-next-line no-console
    		console.warn('Caught exception while replacing the current page. If you\'re running this in the Svelte REPL, please note that the `replace` method might not work in this environment.');
    	}

    	// The method above doesn't trigger the hashchange event, so let's do that manually
    	window.dispatchEvent(new Event('hashchange'));
    }

    function link$1(node, opts) {
    	opts = linkOpts$1(opts);

    	// Only apply to <a> tags
    	if (!node || !node.tagName || node.tagName.toLowerCase() != 'a') {
    		throw Error('Action "link" can only be used with <a> tags');
    	}

    	updateLink$1(node, opts);

    	return {
    		update(updated) {
    			updated = linkOpts$1(updated);
    			updateLink$1(node, updated);
    		}
    	};
    }

    // Internal function used by the link function
    function updateLink$1(node, opts) {
    	let href = opts.href || node.getAttribute('href');

    	// Destination must start with '/' or '#/'
    	if (href && href.charAt(0) == '/') {
    		// Add # to the href attribute
    		href = '#' + href;
    	} else if (!href || href.length < 2 || href.slice(0, 2) != '#/') {
    		throw Error('Invalid value for "href" attribute: ' + href);
    	}

    	node.setAttribute('href', href);

    	node.addEventListener('click', event => {
    		// Prevent default anchor onclick behaviour
    		event.preventDefault();

    		if (!opts.disabled) {
    			scrollstateHistoryHandler$1(event.currentTarget.getAttribute('href'));
    		}
    	});
    }

    // Internal function that ensures the argument of the link action is always an object
    function linkOpts$1(val) {
    	if (val && typeof val == 'string') {
    		return { href: val };
    	} else {
    		return val || {};
    	}
    }

    /**
     * The handler attached to an anchor tag responsible for updating the
     * current history state with the current scroll state
     *
     * @param {string} href - Destination
     */
    function scrollstateHistoryHandler$1(href) {
    	// Setting the url (3rd arg) to href will break clicking for reasons, so don't try to do that
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined,
    		undefined
    	);

    	// This will force an update as desired, but this time our scroll state will be attached
    	window.location.hash = href;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, []);
    	let { routes = {} } = $$props;
    	let { prefix = '' } = $$props;
    	let { restoreScrollState = false } = $$props;

    	/**
     * Container for a route: path, component
     */
    	class RouteItem {
    		/**
     * Initializes the object and creates a regular expression from the path, using regexparam.
     *
     * @param {string} path - Path to the route (must start with '/' or '*')
     * @param {SvelteComponent|WrappedComponent} component - Svelte component for the route, optionally wrapped
     */
    		constructor(path, component) {
    			if (!component || typeof component != 'function' && (typeof component != 'object' || component._sveltesparouter !== true)) {
    				throw Error('Invalid component object');
    			}

    			// Path must be a regular or expression, or a string starting with '/' or '*'
    			if (!path || typeof path == 'string' && (path.length < 1 || path.charAt(0) != '/' && path.charAt(0) != '*') || typeof path == 'object' && !(path instanceof RegExp)) {
    				throw Error('Invalid value for "path" argument - strings must start with / or *');
    			}

    			const { pattern, keys } = parse$1(path);
    			this.path = path;

    			// Check if the component is wrapped and we have conditions
    			if (typeof component == 'object' && component._sveltesparouter === true) {
    				this.component = component.component;
    				this.conditions = component.conditions || [];
    				this.userData = component.userData;
    				this.props = component.props || {};
    			} else {
    				// Convert the component to a function that returns a Promise, to normalize it
    				this.component = () => Promise.resolve(component);

    				this.conditions = [];
    				this.props = {};
    			}

    			this._pattern = pattern;
    			this._keys = keys;
    		}

    		/**
     * Checks if `path` matches the current route.
     * If there's a match, will return the list of parameters from the URL (if any).
     * In case of no match, the method will return `null`.
     *
     * @param {string} path - Path to test
     * @returns {null|Object.<string, string>} List of paramters from the URL if there's a match, or `null` otherwise.
     */
    		match(path) {
    			// If there's a prefix, check if it matches the start of the path.
    			// If not, bail early, else remove it before we run the matching.
    			if (prefix) {
    				if (typeof prefix == 'string') {
    					if (path.startsWith(prefix)) {
    						path = path.substr(prefix.length) || '/';
    					} else {
    						return null;
    					}
    				} else if (prefix instanceof RegExp) {
    					const match = path.match(prefix);

    					if (match && match[0]) {
    						path = path.substr(match[0].length) || '/';
    					} else {
    						return null;
    					}
    				}
    			}

    			// Check if the pattern matches
    			const matches = this._pattern.exec(path);

    			if (matches === null) {
    				return null;
    			}

    			// If the input was a regular expression, this._keys would be false, so return matches as is
    			if (this._keys === false) {
    				return matches;
    			}

    			const out = {};
    			let i = 0;

    			while (i < this._keys.length) {
    				// In the match parameters, URL-decode all values
    				try {
    					out[this._keys[i]] = decodeURIComponent(matches[i + 1] || '') || null;
    				} catch(e) {
    					out[this._keys[i]] = null;
    				}

    				i++;
    			}

    			return out;
    		}

    		/**
     * Dictionary with route details passed to the pre-conditions functions, as well as the `routeLoading`, `routeLoaded` and `conditionsFailed` events
     * @typedef {Object} RouteDetail
     * @property {string|RegExp} route - Route matched as defined in the route definition (could be a string or a reguar expression object)
     * @property {string} location - Location path
     * @property {string} querystring - Querystring from the hash
     * @property {object} [userData] - Custom data passed by the user
     * @property {SvelteComponent} [component] - Svelte component (only in `routeLoaded` events)
     * @property {string} [name] - Name of the Svelte component (only in `routeLoaded` events)
     */
    		/**
     * Executes all conditions (if any) to control whether the route can be shown. Conditions are executed in the order they are defined, and if a condition fails, the following ones aren't executed.
     * 
     * @param {RouteDetail} detail - Route detail
     * @returns {boolean} Returns true if all the conditions succeeded
     */
    		async checkConditions(detail) {
    			for (let i = 0; i < this.conditions.length; i++) {
    				if (!await this.conditions[i](detail)) {
    					return false;
    				}
    			}

    			return true;
    		}
    	}

    	// Set up all routes
    	const routesList = [];

    	if (routes instanceof Map) {
    		// If it's a map, iterate on it right away
    		routes.forEach((route, path) => {
    			routesList.push(new RouteItem(path, route));
    		});
    	} else {
    		// We have an object, so iterate on its own properties
    		Object.keys(routes).forEach(path => {
    			routesList.push(new RouteItem(path, routes[path]));
    		});
    	}

    	// Props for the component to render
    	let component = null;

    	let componentParams = null;
    	let props = {};

    	// Event dispatcher from Svelte
    	const dispatch = createEventDispatcher();

    	// Just like dispatch, but executes on the next iteration of the event loop
    	async function dispatchNextTick(name, detail) {
    		// Execute this code when the current call stack is complete
    		await tick();

    		dispatch(name, detail);
    	}

    	// If this is set, then that means we have popped into this var the state of our last scroll position
    	let previousScrollState = null;

    	let popStateChanged = null;

    	if (restoreScrollState) {
    		popStateChanged = event => {
    			// If this event was from our history.replaceState, event.state will contain
    			// our scroll history. Otherwise, event.state will be null (like on forward
    			// navigation)
    			if (event.state && event.state.__svelte_spa_router_scrollY) {
    				previousScrollState = event.state;
    			} else {
    				previousScrollState = null;
    			}
    		};

    		// This is removed in the destroy() invocation below
    		window.addEventListener('popstate', popStateChanged);

    		afterUpdate(() => {
    			// If this exists, then this is a back navigation: restore the scroll position
    			if (previousScrollState) {
    				window.scrollTo(previousScrollState.__svelte_spa_router_scrollX, previousScrollState.__svelte_spa_router_scrollY);
    			} else {
    				// Otherwise this is a forward navigation: scroll to top
    				window.scrollTo(0, 0);
    			}
    		});
    	}

    	// Always have the latest value of loc
    	let lastLoc = null;

    	// Current object of the component loaded
    	let componentObj = null;

    	// Handle hash change events
    	// Listen to changes in the $loc store and update the page
    	// Do not use the $: syntax because it gets triggered by too many things
    	const unsubscribeLoc = loc$1.subscribe(async newLoc => {
    		lastLoc = newLoc;

    		// Find a route matching the location
    		let i = 0;

    		while (i < routesList.length) {
    			const match = routesList[i].match(newLoc.location);

    			if (!match) {
    				i++;
    				continue;
    			}

    			const detail = {
    				route: routesList[i].path,
    				location: newLoc.location,
    				querystring: newLoc.querystring,
    				userData: routesList[i].userData,
    				params: match && typeof match == 'object' && Object.keys(match).length
    				? match
    				: null
    			};

    			// Check if the route can be loaded - if all conditions succeed
    			if (!await routesList[i].checkConditions(detail)) {
    				// Don't display anything
    				$$invalidate(0, component = null);

    				componentObj = null;

    				// Trigger an event to notify the user, then exit
    				dispatchNextTick('conditionsFailed', detail);

    				return;
    			}

    			// Trigger an event to alert that we're loading the route
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoading', Object.assign({}, detail));

    			// If there's a component to show while we're loading the route, display it
    			const obj = routesList[i].component;

    			// Do not replace the component if we're loading the same one as before, to avoid the route being unmounted and re-mounted
    			if (componentObj != obj) {
    				if (obj.loading) {
    					$$invalidate(0, component = obj.loading);
    					componentObj = obj;
    					$$invalidate(1, componentParams = obj.loadingParams);
    					$$invalidate(2, props = {});

    					// Trigger the routeLoaded event for the loading component
    					// Create a copy of detail so we don't modify the object for the dynamic route (and the dynamic route doesn't modify our object too)
    					dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    						component,
    						name: component.name,
    						params: componentParams
    					}));
    				} else {
    					$$invalidate(0, component = null);
    					componentObj = null;
    				}

    				// Invoke the Promise
    				const loaded = await obj();

    				// Now that we're here, after the promise resolved, check if we still want this component, as the user might have navigated to another page in the meanwhile
    				if (newLoc != lastLoc) {
    					// Don't update the component, just exit
    					return;
    				}

    				// If there is a "default" property, which is used by async routes, then pick that
    				$$invalidate(0, component = loaded && loaded.default || loaded);

    				componentObj = obj;
    			}

    			// Set componentParams only if we have a match, to avoid a warning similar to `<Component> was created with unknown prop 'params'`
    			// Of course, this assumes that developers always add a "params" prop when they are expecting parameters
    			if (match && typeof match == 'object' && Object.keys(match).length) {
    				$$invalidate(1, componentParams = match);
    			} else {
    				$$invalidate(1, componentParams = null);
    			}

    			// Set static props, if any
    			$$invalidate(2, props = routesList[i].props);

    			// Dispatch the routeLoaded event then exit
    			// We need to clone the object on every event invocation so we don't risk the object to be modified in the next tick
    			dispatchNextTick('routeLoaded', Object.assign({}, detail, {
    				component,
    				name: component.name,
    				params: componentParams
    			})).then(() => {
    				params.set(componentParams);
    			});

    			return;
    		}

    		// If we're still here, there was no match, so show the empty component
    		$$invalidate(0, component = null);

    		componentObj = null;
    		params.set(undefined);
    	});

    	onDestroy(() => {
    		unsubscribeLoc();
    		popStateChanged && window.removeEventListener('popstate', popStateChanged);
    	});

    	const writable_props = ['routes', 'prefix', 'restoreScrollState'];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	function routeEvent_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function routeEvent_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    	};

    	$$self.$capture_state = () => ({
    		readable,
    		writable,
    		derived,
    		tick,
    		_wrap: wrap$1,
    		wrap,
    		getLocation: getLocation$1,
    		loc: loc$1,
    		location,
    		querystring,
    		params,
    		push,
    		pop,
    		replace,
    		link: link$1,
    		updateLink: updateLink$1,
    		linkOpts: linkOpts$1,
    		scrollstateHistoryHandler: scrollstateHistoryHandler$1,
    		onDestroy,
    		createEventDispatcher,
    		afterUpdate,
    		parse: parse$1,
    		routes,
    		prefix,
    		restoreScrollState,
    		RouteItem,
    		routesList,
    		component,
    		componentParams,
    		props,
    		dispatch,
    		dispatchNextTick,
    		previousScrollState,
    		popStateChanged,
    		lastLoc,
    		componentObj,
    		unsubscribeLoc
    	});

    	$$self.$inject_state = $$props => {
    		if ('routes' in $$props) $$invalidate(3, routes = $$props.routes);
    		if ('prefix' in $$props) $$invalidate(4, prefix = $$props.prefix);
    		if ('restoreScrollState' in $$props) $$invalidate(5, restoreScrollState = $$props.restoreScrollState);
    		if ('component' in $$props) $$invalidate(0, component = $$props.component);
    		if ('componentParams' in $$props) $$invalidate(1, componentParams = $$props.componentParams);
    		if ('props' in $$props) $$invalidate(2, props = $$props.props);
    		if ('previousScrollState' in $$props) previousScrollState = $$props.previousScrollState;
    		if ('popStateChanged' in $$props) popStateChanged = $$props.popStateChanged;
    		if ('lastLoc' in $$props) lastLoc = $$props.lastLoc;
    		if ('componentObj' in $$props) componentObj = $$props.componentObj;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*restoreScrollState*/ 32) {
    			// Update history.scrollRestoration depending on restoreScrollState
    			history.scrollRestoration = restoreScrollState ? 'manual' : 'auto';
    		}
    	};

    	return [
    		component,
    		componentParams,
    		props,
    		routes,
    		prefix,
    		restoreScrollState,
    		routeEvent_handler,
    		routeEvent_handler_1
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {
    			routes: 3,
    			prefix: 4,
    			restoreScrollState: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get routes() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get restoreScrollState() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set restoreScrollState(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }

    /* ../../app_web_module_nanogrid-svelte/components/Gear.svelte generated by Svelte v3.46.4 */
    const file$c = "../../app_web_module_nanogrid-svelte/components/Gear.svelte";

    function create_fragment$c(ctx) {
    	let canvas_1;

    	const block = {
    		c: function create() {
    			canvas_1 = element("canvas");
    			attr_dev(canvas_1, "width", /*width*/ ctx[0]);
    			attr_dev(canvas_1, "height", /*width*/ ctx[0]);
    			attr_dev(canvas_1, "class", /*classes*/ ctx[2]);
    			add_location(canvas_1, file$c, 106, 2, 3080);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, canvas_1, anchor);
    			/*canvas_1_binding*/ ctx[13](canvas_1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*width*/ 1) {
    				attr_dev(canvas_1, "width", /*width*/ ctx[0]);
    			}

    			if (dirty & /*width*/ 1) {
    				attr_dev(canvas_1, "height", /*width*/ ctx[0]);
    			}

    			if (dirty & /*classes*/ 4) {
    				attr_dev(canvas_1, "class", /*classes*/ ctx[2]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(canvas_1);
    			/*canvas_1_binding*/ ctx[13](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let classes;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Gear', slots, []);
    	let { width = 0, className = "", teethAmount = 40, pitchRadius = 50, baseCircleRadius = 45, axisRadius = 5, sidePerforationRadius = 12, sidePerforationDistance = 25, sidePerforationAmount = 4, color = "#999", colorPerforation = "#444" } = $$props;
    	let canvas;

    	onMount(() => {
    		const ctx = canvas.getContext("2d");
    		const ang = Math.PI / 180;
    		let percent = width / 100;
    		let x = width / 2;
    		let y = width / 2;
    		let gear_color = color;
    		let holes_color = colorPerforation;

    		/* ----------- Poligon 1 ----------- */
    		let px = [];

    		let py = [];

    		/* ----------- Poligon 2 ----------- */
    		let px2 = [];

    		let py2 = [];

    		/* ----------- Inner Circle ----------- */
    		let px3 = [];

    		let py3 = [];

    		/* ----------- End Vars ----------- */
    		ctx.clearRect(0, 0, width, width);

    		for (let counter = 0; counter <= teethAmount - 1; counter++) {
    			px[counter] = Math.cos(360 / teethAmount * counter * ang) * pitchRadius * percent;
    			py[counter] = Math.sin(360 / teethAmount * counter * -ang) * pitchRadius * percent;
    		}

    		/* --------------------- Second Shape --------------------- */
    		for (let counter = 0; counter <= teethAmount - 1; counter++) {
    			px2[counter] = Math.cos((360 / (teethAmount * 2) + 360 / teethAmount * counter) * ang) * baseCircleRadius * percent;
    			py2[counter] = Math.sin((360 / (teethAmount * 2) + 360 / teethAmount * counter) * -ang) * baseCircleRadius * percent;
    		}

    		/* --------------------- Circles --------------------- */
    		for (let counter = 0; counter <= sidePerforationAmount - 1; counter++) {
    			px3[counter] = Math.cos(360 / sidePerforationAmount * counter * ang) * sidePerforationDistance * percent;
    			py3[counter] = Math.sin(360 / sidePerforationAmount * counter * -ang) * sidePerforationDistance * percent;
    		}

    		ctx.beginPath();
    		ctx.moveTo(x + px[0], y + py[0]);
    		ctx.lineTo(x + px2[0], y + py2[0]);

    		for (let counter = 1; counter <= teethAmount - 1; counter++) {
    			ctx.lineTo(x + px[counter], y + py[counter]);
    			ctx.lineTo(x + px2[counter], y + py2[counter]);
    		}

    		ctx.fillStyle = gear_color;
    		ctx.fill();
    		ctx.strokeStyle = "rgba(100,100,100,1)";
    		ctx.stroke();
    		ctx.closePath();
    		ctx.beginPath();
    		ctx.arc(x, y, axisRadius * percent, 0, Math.PI * 2, true);
    		ctx.fillStyle = holes_color;
    		ctx.fill();
    		ctx.closePath();

    		for (let counter = 0; counter <= sidePerforationAmount - 1; counter++) {
    			ctx.beginPath();
    			ctx.arc(x + px3[counter], y + py3[counter], sidePerforationRadius * percent, 0, Math.PI * 2, true);
    			ctx.fillStyle = holes_color;
    			ctx.fill();
    			ctx.closePath();
    		}
    	});

    	const writable_props = [
    		'width',
    		'className',
    		'teethAmount',
    		'pitchRadius',
    		'baseCircleRadius',
    		'axisRadius',
    		'sidePerforationRadius',
    		'sidePerforationDistance',
    		'sidePerforationAmount',
    		'color',
    		'colorPerforation'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Gear> was created with unknown prop '${key}'`);
    	});

    	function canvas_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			canvas = $$value;
    			$$invalidate(1, canvas);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('className' in $$props) $$invalidate(3, className = $$props.className);
    		if ('teethAmount' in $$props) $$invalidate(4, teethAmount = $$props.teethAmount);
    		if ('pitchRadius' in $$props) $$invalidate(5, pitchRadius = $$props.pitchRadius);
    		if ('baseCircleRadius' in $$props) $$invalidate(6, baseCircleRadius = $$props.baseCircleRadius);
    		if ('axisRadius' in $$props) $$invalidate(7, axisRadius = $$props.axisRadius);
    		if ('sidePerforationRadius' in $$props) $$invalidate(8, sidePerforationRadius = $$props.sidePerforationRadius);
    		if ('sidePerforationDistance' in $$props) $$invalidate(9, sidePerforationDistance = $$props.sidePerforationDistance);
    		if ('sidePerforationAmount' in $$props) $$invalidate(10, sidePerforationAmount = $$props.sidePerforationAmount);
    		if ('color' in $$props) $$invalidate(11, color = $$props.color);
    		if ('colorPerforation' in $$props) $$invalidate(12, colorPerforation = $$props.colorPerforation);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		width,
    		className,
    		teethAmount,
    		pitchRadius,
    		baseCircleRadius,
    		axisRadius,
    		sidePerforationRadius,
    		sidePerforationDistance,
    		sidePerforationAmount,
    		color,
    		colorPerforation,
    		canvas,
    		classes
    	});

    	$$self.$inject_state = $$props => {
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('className' in $$props) $$invalidate(3, className = $$props.className);
    		if ('teethAmount' in $$props) $$invalidate(4, teethAmount = $$props.teethAmount);
    		if ('pitchRadius' in $$props) $$invalidate(5, pitchRadius = $$props.pitchRadius);
    		if ('baseCircleRadius' in $$props) $$invalidate(6, baseCircleRadius = $$props.baseCircleRadius);
    		if ('axisRadius' in $$props) $$invalidate(7, axisRadius = $$props.axisRadius);
    		if ('sidePerforationRadius' in $$props) $$invalidate(8, sidePerforationRadius = $$props.sidePerforationRadius);
    		if ('sidePerforationDistance' in $$props) $$invalidate(9, sidePerforationDistance = $$props.sidePerforationDistance);
    		if ('sidePerforationAmount' in $$props) $$invalidate(10, sidePerforationAmount = $$props.sidePerforationAmount);
    		if ('color' in $$props) $$invalidate(11, color = $$props.color);
    		if ('colorPerforation' in $$props) $$invalidate(12, colorPerforation = $$props.colorPerforation);
    		if ('canvas' in $$props) $$invalidate(1, canvas = $$props.canvas);
    		if ('classes' in $$props) $$invalidate(2, classes = $$props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className*/ 8) {
    			$$invalidate(2, classes = ["gear", className].join(" ").replace(/\s+/g, " ").trim());
    		}
    	};

    	return [
    		width,
    		canvas,
    		classes,
    		className,
    		teethAmount,
    		pitchRadius,
    		baseCircleRadius,
    		axisRadius,
    		sidePerforationRadius,
    		sidePerforationDistance,
    		sidePerforationAmount,
    		color,
    		colorPerforation,
    		canvas_1_binding
    	];
    }

    class Gear extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {
    			width: 0,
    			className: 3,
    			teethAmount: 4,
    			pitchRadius: 5,
    			baseCircleRadius: 6,
    			axisRadius: 7,
    			sidePerforationRadius: 8,
    			sidePerforationDistance: 9,
    			sidePerforationAmount: 10,
    			color: 11,
    			colorPerforation: 12
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Gear",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get width() {
    		throw new Error("<Gear>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Gear>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get className() {
    		throw new Error("<Gear>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set className(value) {
    		throw new Error("<Gear>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get teethAmount() {
    		throw new Error("<Gear>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set teethAmount(value) {
    		throw new Error("<Gear>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pitchRadius() {
    		throw new Error("<Gear>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pitchRadius(value) {
    		throw new Error("<Gear>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get baseCircleRadius() {
    		throw new Error("<Gear>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set baseCircleRadius(value) {
    		throw new Error("<Gear>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get axisRadius() {
    		throw new Error("<Gear>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set axisRadius(value) {
    		throw new Error("<Gear>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sidePerforationRadius() {
    		throw new Error("<Gear>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sidePerforationRadius(value) {
    		throw new Error("<Gear>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sidePerforationDistance() {
    		throw new Error("<Gear>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sidePerforationDistance(value) {
    		throw new Error("<Gear>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sidePerforationAmount() {
    		throw new Error("<Gear>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sidePerforationAmount(value) {
    		throw new Error("<Gear>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Gear>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Gear>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get colorPerforation() {
    		throw new Error("<Gear>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set colorPerforation(value) {
    		throw new Error("<Gear>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* ../../app_web_module_nanogrid-svelte/components/Container.svelte generated by Svelte v3.46.4 */
    const file$b = "../../app_web_module_nanogrid-svelte/components/Container.svelte";

    function create_fragment$b(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", /*classes*/ ctx[0]);
    			add_location(div, file$b, 17, 2, 338);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*classes*/ 1) {
    				attr_dev(div, "class", /*classes*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Container', slots, ['default']);
    	let { className = "", width = "" } = $$props;
    	let computedWidth, classes;

    	beforeUpdate(() => {
    		computedWidth = width !== "" ? `sz${width}` : "";
    		$$invalidate(0, classes = ["container", className, computedWidth].join(" ").replace(/\s+/g, " ").trim());
    	});

    	const writable_props = ['className', 'width'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Container> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('className' in $$props) $$invalidate(1, className = $$props.className);
    		if ('width' in $$props) $$invalidate(2, width = $$props.width);
    		if ('$$scope' in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		beforeUpdate,
    		className,
    		width,
    		computedWidth,
    		classes
    	});

    	$$self.$inject_state = $$props => {
    		if ('className' in $$props) $$invalidate(1, className = $$props.className);
    		if ('width' in $$props) $$invalidate(2, width = $$props.width);
    		if ('computedWidth' in $$props) computedWidth = $$props.computedWidth;
    		if ('classes' in $$props) $$invalidate(0, classes = $$props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [classes, className, width, $$scope, slots];
    }

    class Container extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, { className: 1, width: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Container",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get className() {
    		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set className(value) {
    		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Container>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Container>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* ../../app_web_module_nanogrid-svelte/components/Icon.svelte generated by Svelte v3.46.4 */

    const file$a = "../../app_web_module_nanogrid-svelte/components/Icon.svelte";

    function create_fragment$a(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			attr_dev(span, "class", /*computedClasses*/ ctx[0]);
    			add_location(span, file$a, 8, 2, 153);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Icon', slots, []);
    	let { glyph = "" } = $$props;
    	let { direction = "bottom" } = $$props;
    	let computedClasses = ["icon", glyph, direction].join(" ").trim();
    	const writable_props = ['glyph', 'direction'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Icon> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('glyph' in $$props) $$invalidate(1, glyph = $$props.glyph);
    		if ('direction' in $$props) $$invalidate(2, direction = $$props.direction);
    	};

    	$$self.$capture_state = () => ({ glyph, direction, computedClasses });

    	$$self.$inject_state = $$props => {
    		if ('glyph' in $$props) $$invalidate(1, glyph = $$props.glyph);
    		if ('direction' in $$props) $$invalidate(2, direction = $$props.direction);
    		if ('computedClasses' in $$props) $$invalidate(0, computedClasses = $$props.computedClasses);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [computedClasses, glyph, direction];
    }

    class Icon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { glyph: 1, direction: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Icon",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get glyph() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set glyph(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get direction() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set direction(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const contentDB = [
      {
        header: `Hi! My name is Miguel Rivas`,
        content: `I'm a Frontend Developer living in Santo Domingo.`,
      },
      {
        header: `Why Me?`,
        content: `I work with HTML/JADE/HAML, CSS/SASS/LESS, and the Adobe Suite (Illustrator, Photoshop, Indesign, Flash and Premiere). I also love git and have been known to roll up my sleeves and work with basic Ruby on Rails and PHP.`,
      },
      {
        header: `Experience in the area`,
        content: `I've work as Front-End Developer for <strong>Cerveza Presidente</strong> in the web app <strong>Destapa El Coro</strong> and in the page of <strong>Carnaval Presidente 2015</strong>. also I worked with other brand as Orange, Pepsi and Outback.`,
      },
    ];

    /* src/views/Home.svelte generated by Svelte v3.46.4 */
    const file$9 = "src/views/Home.svelte";

    // (26:4) {#if contentDB[contentIndex].content}
    function create_if_block$2(ctx) {
    	let p;
    	let raw_value = contentDB[/*contentIndex*/ ctx[0]].content + "";

    	const block = {
    		c: function create() {
    			p = element("p");
    			add_location(p, file$9, 26, 5, 784);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			p.innerHTML = raw_value;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*contentIndex*/ 1 && raw_value !== (raw_value = contentDB[/*contentIndex*/ ctx[0]].content + "")) p.innerHTML = raw_value;		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(26:4) {#if contentDB[contentIndex].content}",
    		ctx
    	});

    	return block;
    }

    // (24:3) <Container>
    function create_default_slot$3(ctx) {
    	let h1;
    	let raw_value = contentDB[/*contentIndex*/ ctx[0]].header + "";
    	let t0;
    	let t1;
    	let button0;
    	let icon0;
    	let t2;
    	let button1;
    	let icon1;
    	let t3;
    	let gear0;
    	let t4;
    	let gear1;
    	let t5;
    	let gear2;
    	let t6;
    	let gear3;
    	let t7;
    	let gear4;
    	let t8;
    	let gear5;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = contentDB[/*contentIndex*/ ctx[0]].content && create_if_block$2(ctx);

    	icon0 = new Icon({
    			props: { direction: "left", glyph: "chevron" },
    			$$inline: true
    		});

    	icon1 = new Icon({
    			props: { direction: "right", glyph: "chevron" },
    			$$inline: true
    		});

    	gear0 = new Gear({
    			props: {
    				sidePerforationRadius: "5",
    				sidePerforationDistance: "32",
    				sidePerforationAmount: "7",
    				width: "180",
    				className: "rtr g1"
    			},
    			$$inline: true
    		});

    	gear1 = new Gear({
    			props: {
    				axisRadius: "10",
    				sidePerforationRadius: "8",
    				sidePerforationAmount: "3",
    				width: "160",
    				className: "rtr g2"
    			},
    			$$inline: true
    		});

    	gear2 = new Gear({
    			props: {
    				teethAmount: "25",
    				axisRadius: "15",
    				sidePerforationRadius: "8",
    				sidePerforationAmount: "0",
    				width: "52",
    				className: "rtl g3"
    			},
    			$$inline: true
    		});

    	gear3 = new Gear({
    			props: {
    				teethAmount: "25",
    				width: "100",
    				className: "rtl g4"
    			},
    			$$inline: true
    		});

    	gear4 = new Gear({
    			props: {
    				teethAmount: "30",
    				axisRadius: "8",
    				sidePerforationRadius: "3",
    				sidePerforationDistance: "35",
    				sidePerforationAmount: "10",
    				width: "180",
    				className: "rtr g5"
    			},
    			$$inline: true
    		});

    	gear5 = new Gear({
    			props: {
    				axisRadius: "3",
    				sidePerforationRadius: "8",
    				sidePerforationAmount: "5",
    				width: "165",
    				className: "rtl g6"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();
    			button0 = element("button");
    			create_component(icon0.$$.fragment);
    			t2 = space();
    			button1 = element("button");
    			create_component(icon1.$$.fragment);
    			t3 = space();
    			create_component(gear0.$$.fragment);
    			t4 = space();
    			create_component(gear1.$$.fragment);
    			t5 = space();
    			create_component(gear2.$$.fragment);
    			t6 = space();
    			create_component(gear3.$$.fragment);
    			t7 = space();
    			create_component(gear4.$$.fragment);
    			t8 = space();
    			create_component(gear5.$$.fragment);
    			add_location(h1, file$9, 24, 4, 689);
    			attr_dev(button0, "class", "scrn_btn prev");
    			add_location(button0, file$9, 29, 4, 846);
    			attr_dev(button1, "class", "scrn_btn next");
    			add_location(button1, file$9, 37, 4, 1003);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			h1.innerHTML = raw_value;
    			insert_dev(target, t0, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button0, anchor);
    			mount_component(icon0, button0, null);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, button1, anchor);
    			mount_component(icon1, button1, null);
    			insert_dev(target, t3, anchor);
    			mount_component(gear0, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(gear1, target, anchor);
    			insert_dev(target, t5, anchor);
    			mount_component(gear2, target, anchor);
    			insert_dev(target, t6, anchor);
    			mount_component(gear3, target, anchor);
    			insert_dev(target, t7, anchor);
    			mount_component(gear4, target, anchor);
    			insert_dev(target, t8, anchor);
    			mount_component(gear5, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[2], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*contentIndex*/ 1) && raw_value !== (raw_value = contentDB[/*contentIndex*/ ctx[0]].header + "")) h1.innerHTML = raw_value;
    			if (contentDB[/*contentIndex*/ ctx[0]].content) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(t1.parentNode, t1);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon0.$$.fragment, local);
    			transition_in(icon1.$$.fragment, local);
    			transition_in(gear0.$$.fragment, local);
    			transition_in(gear1.$$.fragment, local);
    			transition_in(gear2.$$.fragment, local);
    			transition_in(gear3.$$.fragment, local);
    			transition_in(gear4.$$.fragment, local);
    			transition_in(gear5.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon0.$$.fragment, local);
    			transition_out(icon1.$$.fragment, local);
    			transition_out(gear0.$$.fragment, local);
    			transition_out(gear1.$$.fragment, local);
    			transition_out(gear2.$$.fragment, local);
    			transition_out(gear3.$$.fragment, local);
    			transition_out(gear4.$$.fragment, local);
    			transition_out(gear5.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t0);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button0);
    			destroy_component(icon0);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(button1);
    			destroy_component(icon1);
    			if (detaching) detach_dev(t3);
    			destroy_component(gear0, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(gear1, detaching);
    			if (detaching) detach_dev(t5);
    			destroy_component(gear2, detaching);
    			if (detaching) detach_dev(t6);
    			destroy_component(gear3, detaching);
    			if (detaching) detach_dev(t7);
    			destroy_component(gear4, detaching);
    			if (detaching) detach_dev(t8);
    			destroy_component(gear5, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(24:3) <Container>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let section;
    	let div3;
    	let container;
    	let t0;
    	let div2;
    	let div1;
    	let gear;
    	let t1;
    	let div0;
    	let section_transition;
    	let current;

    	container = new Container({
    			props: {
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	gear = new Gear({
    			props: {
    				teethAmount: "25",
    				axisRadius: "15",
    				sidePerforationRadius: "8",
    				sidePerforationAmount: "0",
    				width: "52"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			section = element("section");
    			div3 = element("div");
    			create_component(container.$$.fragment);
    			t0 = space();
    			div2 = element("div");
    			div1 = element("div");
    			create_component(gear.$$.fragment);
    			t1 = space();
    			div0 = element("div");
    			attr_dev(div0, "class", "screen");
    			add_location(div0, file$9, 95, 5, 2235);
    			attr_dev(div1, "class", "bone");
    			add_location(div1, file$9, 87, 4, 2066);
    			attr_dev(div2, "class", "screen-container");
    			add_location(div2, file$9, 86, 3, 2031);
    			attr_dev(div3, "class", "monitor");
    			add_location(div3, file$9, 22, 2, 648);
    			attr_dev(section, "class", "home");
    			add_location(section, file$9, 21, 1, 567);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div3);
    			mount_component(container, div3, null);
    			append_dev(div3, t0);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			mount_component(gear, div1, null);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const container_changes = {};

    			if (dirty & /*$$scope, contentIndex*/ 17) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(container.$$.fragment, local);
    			transition_in(gear.$$.fragment, local);

    			add_render_callback(() => {
    				if (!section_transition) section_transition = create_bidirectional_transition(section, fly, { y: -500, duration: 400, opacity: 1 }, true);
    				section_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(container.$$.fragment, local);
    			transition_out(gear.$$.fragment, local);
    			if (!section_transition) section_transition = create_bidirectional_transition(section, fly, { y: -500, duration: 400, opacity: 1 }, false);
    			section_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(container);
    			destroy_component(gear);
    			if (detaching && section_transition) section_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	let contentIndex = 0;

    	let movePage = movement => {
    		if (contentIndex + movement > contentDB.length - 1) {
    			$$invalidate(0, contentIndex = 0);
    		} else if (contentIndex + movement < 0) {
    			$$invalidate(0, contentIndex = contentDB.length - 1);
    		} else {
    			$$invalidate(0, contentIndex += movement);
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		movePage(-1);
    	};

    	const click_handler_1 = () => {
    		movePage(1);
    	};

    	$$self.$capture_state = () => ({
    		fly,
    		Gear,
    		Container,
    		Icon,
    		contentDB,
    		contentIndex,
    		movePage
    	});

    	$$self.$inject_state = $$props => {
    		if ('contentIndex' in $$props) $$invalidate(0, contentIndex = $$props.contentIndex);
    		if ('movePage' in $$props) $$invalidate(1, movePage = $$props.movePage);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [contentIndex, movePage, click_handler, click_handler_1];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* ../../app_web_module_nanogrid-svelte/components/ScrollArea.svelte generated by Svelte v3.46.4 */
    const file$8 = "../../app_web_module_nanogrid-svelte/components/ScrollArea.svelte";

    function create_fragment$8(ctx) {
    	let div;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);
    	let div_levels = [/*$$restProps*/ ctx[1], { class: /*computedClasses*/ ctx[0] }];
    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$8, 26, 2, 509);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "scroll", /*scroll_handler*/ ctx[7], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$restProps*/ 2 && /*$$restProps*/ ctx[1],
    				(!current || dirty & /*computedClasses*/ 1) && { class: /*computedClasses*/ ctx[0] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	const omit_props_names = ["horizontal","vertical","color"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ScrollArea', slots, ['default']);
    	let { horizontal = true, vertical = true, color = "transparent" } = $$props;
    	let computedHorizontal = !horizontal ? "no-horizontal" : "";
    	let computedVertical = !vertical ? "no-vertical" : "";
    	let computedClasses, computedLabel;

    	beforeUpdate(() => {
    		$$invalidate(0, computedClasses = ["scroll-area", color, computedHorizontal, computedVertical].join(" ").replace(/\s+/g, " ").trim());
    	});

    	function scroll_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('horizontal' in $$new_props) $$invalidate(2, horizontal = $$new_props.horizontal);
    		if ('vertical' in $$new_props) $$invalidate(3, vertical = $$new_props.vertical);
    		if ('color' in $$new_props) $$invalidate(4, color = $$new_props.color);
    		if ('$$scope' in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		beforeUpdate,
    		horizontal,
    		vertical,
    		color,
    		computedHorizontal,
    		computedVertical,
    		computedClasses,
    		computedLabel
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('horizontal' in $$props) $$invalidate(2, horizontal = $$new_props.horizontal);
    		if ('vertical' in $$props) $$invalidate(3, vertical = $$new_props.vertical);
    		if ('color' in $$props) $$invalidate(4, color = $$new_props.color);
    		if ('computedHorizontal' in $$props) computedHorizontal = $$new_props.computedHorizontal;
    		if ('computedVertical' in $$props) computedVertical = $$new_props.computedVertical;
    		if ('computedClasses' in $$props) $$invalidate(0, computedClasses = $$new_props.computedClasses);
    		if ('computedLabel' in $$props) computedLabel = $$new_props.computedLabel;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		computedClasses,
    		$$restProps,
    		horizontal,
    		vertical,
    		color,
    		$$scope,
    		slots,
    		scroll_handler
    	];
    }

    class ScrollArea extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { horizontal: 2, vertical: 3, color: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ScrollArea",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get horizontal() {
    		throw new Error("<ScrollArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set horizontal(value) {
    		throw new Error("<ScrollArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get vertical() {
    		throw new Error("<ScrollArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set vertical(value) {
    		throw new Error("<ScrollArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<ScrollArea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<ScrollArea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const roundUpNumber = (value) => {
      let rest = value % 5;
      let hasNoClassEquivalent = rest > 0;
      if (hasNoClassEquivalent) {
        value = value - rest + 5;
      }
      return value;
    };

    const reduceFraction = (n, d) => {
      let numerator = n;
      let denominator = d;
      let minVal = Math.min(n, d);
      for (let c = minVal; c > 0; c--) {
        if (numerator % c === 0 && denominator % c === 0) {
          numerator /= c;
          denominator /= c;
        }
      }
      return [numerator, denominator];
    };

    const validateSize = (size) => {
      let width, height;
      let widthStyle, heightStyle;
      let hasHeight = /[,]/.test(size);

      width = size.split(',')[0] || "";
      height = size.split(',')[1] || "";

      //---------------------------------------------- calculating width
      let isBinomial = /[-]/.test(width);
      let numerator, denominator, subtraction;

      //------------------ calculating width: subtraction -> (10%-5)
      if (isBinomial) {
        subtraction = width.split('-')[1];
        width = width.split('-')[0];

        if (/[*]/.test(subtraction)) {
          let formula = subtraction.split('*');
          subtraction = formula[0] * formula[1];
        } else if (/[/]/.test(subtraction)) {
          let formula = subtraction.split('/');
          subtraction = formula[0] / formula[1];
        }

        subtraction = roundUpNumber(parseInt(subtraction));
      }

      let isPercent = /[%]/.test(width);
      let isFraction = /[/]/.test(width);

      //------------------ calculating width: converting percent into a fraction
      if (isPercent) {
        numerator = parseInt(width);
        denominator = 100;
      }

      //------------------ calculating width: fraction
      if (isFraction) {
        let fraction = width.split('/');
        numerator = parseInt(fraction[0]);
        denominator = parseInt(fraction[1]);
      } else if (!isPercent) {
        numerator = roundUpNumber(parseInt(width));
      }

      //------------------ calculating width: reducing fraction to the simplest form
      if (numerator && denominator) {
        const newVals = reduceFraction(numerator, denominator);
        numerator = newVals[0];
        denominator = newVals[1];
      }

      if (typeof numerator !== 'undefined') {
        width = 'w' + numerator;
      }

      if (denominator) {
        width += 'd' + denominator;
      }

      if (subtraction) {
        width += 'm' + subtraction;
      }

      if (!isPercent && !isFraction && numerator > 300) {
        widthStyle = `flex-basis: ${numerator}px; max-width: ${numerator}px;`;
        width = undefined;
      }

      if (subtraction > 300) {
        let newSize = `calc(${numerator / denominator * 100}% - ${subtraction}px)`;
        widthStyle = `flex-basis: ${newSize}; max-width: ${newSize};`;
        width = undefined;
      }

      //---------------------------------------------- calculating height

      if (hasHeight) {
        let isAbsolute;
        isPercent = /[%]/.test(height);
        isAbsolute = /[vh]/.test(height);
        isFraction = /[/]/.test(height);

        numerator = denominator = undefined;

        //------------------ calculating height: converting percent into a fraction
        if (isPercent) {
          numerator = parseInt(height);
          denominator = 100;
        }

        //------------------ calculating height: fraction
        if (isFraction) {
          let fraction = height.split('/');
          numerator = parseInt(fraction[0]);
          denominator = parseInt(fraction[1]);
        } else if (!isPercent) {
          numerator = roundUpNumber(parseInt(height));
        }

        //------------------ calculating height: reducing fraction to the simplest form
        if (numerator && denominator) {
          const newVals = reduceFraction(numerator, denominator);
          numerator = newVals[0];
          denominator = newVals[1];
        }

        if (typeof numerator !== 'undefined') {
          height = 'h' + numerator;
        }

        if (denominator) {
          height += 'd' + denominator;
        }

        if (isAbsolute) {
          height += 'vh';
        }

        if (!isPercent && !isFraction && numerator > 300) {
          heightStyle = `height: ${numerator}px;`;
          height = undefined;
        }
      }
      return { class: [width, height].join(' '), style: [widthStyle, heightStyle].join(' ') };
    };

    const validateSpacing = (size) => {
      let value = +size;
      if (value > 0) {
        value = Math.min(Math.max(value, 0.25), 4);

        let rest = value % 0.25;
        if (rest !== 0) {
          value = value - rest;
        }

        return value > 0 ? `sp${value * 100}` : '';
      }
      return "";
    };

    /* ../../app_web_module_nanogrid-svelte/components/Row.svelte generated by Svelte v3.46.4 */
    const file$7 = "../../app_web_module_nanogrid-svelte/components/Row.svelte";

    function create_fragment$7(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[14].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[13], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", /*computedClasses*/ ctx[0]);
    			add_location(div, file$7, 32, 2, 750);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8192)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[13],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[13])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[13], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*computedClasses*/ 1) {
    				attr_dev(div, "class", /*computedClasses*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let computedSpacing;
    	let computedGroup;
    	let computedIntegrated;
    	let computedVertical;
    	let computedGrid;
    	let computedClasses;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Row', slots, ['default']);
    	let { breakpoint = "", group = false, spacing = undefined, integrated = false, vertical = false, grid = false, className = "" } = $$props;

    	const writable_props = [
    		'breakpoint',
    		'group',
    		'spacing',
    		'integrated',
    		'vertical',
    		'grid',
    		'className'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Row> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('breakpoint' in $$props) $$invalidate(1, breakpoint = $$props.breakpoint);
    		if ('group' in $$props) $$invalidate(2, group = $$props.group);
    		if ('spacing' in $$props) $$invalidate(3, spacing = $$props.spacing);
    		if ('integrated' in $$props) $$invalidate(4, integrated = $$props.integrated);
    		if ('vertical' in $$props) $$invalidate(5, vertical = $$props.vertical);
    		if ('grid' in $$props) $$invalidate(6, grid = $$props.grid);
    		if ('className' in $$props) $$invalidate(7, className = $$props.className);
    		if ('$$scope' in $$props) $$invalidate(13, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		validateSpacing,
    		breakpoint,
    		group,
    		spacing,
    		integrated,
    		vertical,
    		grid,
    		className,
    		computedSpacing,
    		computedGrid,
    		computedVertical,
    		computedIntegrated,
    		computedGroup,
    		computedClasses
    	});

    	$$self.$inject_state = $$props => {
    		if ('breakpoint' in $$props) $$invalidate(1, breakpoint = $$props.breakpoint);
    		if ('group' in $$props) $$invalidate(2, group = $$props.group);
    		if ('spacing' in $$props) $$invalidate(3, spacing = $$props.spacing);
    		if ('integrated' in $$props) $$invalidate(4, integrated = $$props.integrated);
    		if ('vertical' in $$props) $$invalidate(5, vertical = $$props.vertical);
    		if ('grid' in $$props) $$invalidate(6, grid = $$props.grid);
    		if ('className' in $$props) $$invalidate(7, className = $$props.className);
    		if ('computedSpacing' in $$props) $$invalidate(8, computedSpacing = $$props.computedSpacing);
    		if ('computedGrid' in $$props) $$invalidate(9, computedGrid = $$props.computedGrid);
    		if ('computedVertical' in $$props) $$invalidate(10, computedVertical = $$props.computedVertical);
    		if ('computedIntegrated' in $$props) $$invalidate(11, computedIntegrated = $$props.computedIntegrated);
    		if ('computedGroup' in $$props) $$invalidate(12, computedGroup = $$props.computedGroup);
    		if ('computedClasses' in $$props) $$invalidate(0, computedClasses = $$props.computedClasses);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*spacing*/ 8) {
    			$$invalidate(8, computedSpacing = spacing ? validateSpacing(spacing) : "");
    		}

    		if ($$self.$$.dirty & /*group*/ 4) {
    			$$invalidate(12, computedGroup = group ? "nano-group" : "");
    		}

    		if ($$self.$$.dirty & /*integrated*/ 16) {
    			$$invalidate(11, computedIntegrated = integrated ? "integrated" : "");
    		}

    		if ($$self.$$.dirty & /*vertical*/ 32) {
    			$$invalidate(10, computedVertical = vertical ? "vertical" : "");
    		}

    		if ($$self.$$.dirty & /*grid*/ 64) {
    			$$invalidate(9, computedGrid = grid ? "grid" : "");
    		}

    		if ($$self.$$.dirty & /*breakpoint, computedGroup, computedIntegrated, computedVertical, computedGrid, computedSpacing, className*/ 8066) {
    			$$invalidate(0, computedClasses = [
    				"nano-row",
    				breakpoint,
    				computedGroup,
    				computedIntegrated,
    				computedVertical,
    				computedGrid,
    				computedSpacing,
    				className
    			].join(" ").replace(/\s+/g, " ").trim());
    		}
    	};

    	return [
    		computedClasses,
    		breakpoint,
    		group,
    		spacing,
    		integrated,
    		vertical,
    		grid,
    		className,
    		computedSpacing,
    		computedGrid,
    		computedVertical,
    		computedIntegrated,
    		computedGroup,
    		$$scope,
    		slots
    	];
    }

    class Row extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {
    			breakpoint: 1,
    			group: 2,
    			spacing: 3,
    			integrated: 4,
    			vertical: 5,
    			grid: 6,
    			className: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Row",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get breakpoint() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set breakpoint(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get group() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set group(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spacing() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spacing(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get integrated() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set integrated(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get vertical() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set vertical(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get grid() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set grid(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get className() {
    		throw new Error("<Row>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set className(value) {
    		throw new Error("<Row>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* ../../app_web_module_nanogrid-svelte/components/Column.svelte generated by Svelte v3.46.4 */
    const file$6 = "../../app_web_module_nanogrid-svelte/components/Column.svelte";

    function create_fragment$6(ctx) {
    	let div;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", /*computedClasses*/ ctx[1]);
    			attr_dev(div, "style", /*computedStyle*/ ctx[0]);
    			add_location(div, file$6, 21, 2, 517);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*computedClasses*/ 2) {
    				attr_dev(div, "class", /*computedClasses*/ ctx[1]);
    			}

    			if (!current || dirty & /*computedStyle*/ 1) {
    				attr_dev(div, "style", /*computedStyle*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Column', slots, ['default']);
    	let { size = undefined, mode = "column", className = "" } = $$props;
    	let computedSize, computedStyle, computedClasses;

    	beforeUpdate(() => {
    		computedSize = size ? validateSize(size).class : "";
    		$$invalidate(0, computedStyle = size ? validateSize(size).style : "");
    		$$invalidate(1, computedClasses = [mode, computedSize, className].join(" ").replace(/\s+/g, " ").trim());
    	});

    	const writable_props = ['size', 'mode', 'className'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Column> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('size' in $$props) $$invalidate(2, size = $$props.size);
    		if ('mode' in $$props) $$invalidate(3, mode = $$props.mode);
    		if ('className' in $$props) $$invalidate(4, className = $$props.className);
    		if ('$$scope' in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		validateSize,
    		beforeUpdate,
    		size,
    		mode,
    		className,
    		computedSize,
    		computedStyle,
    		computedClasses
    	});

    	$$self.$inject_state = $$props => {
    		if ('size' in $$props) $$invalidate(2, size = $$props.size);
    		if ('mode' in $$props) $$invalidate(3, mode = $$props.mode);
    		if ('className' in $$props) $$invalidate(4, className = $$props.className);
    		if ('computedSize' in $$props) computedSize = $$props.computedSize;
    		if ('computedStyle' in $$props) $$invalidate(0, computedStyle = $$props.computedStyle);
    		if ('computedClasses' in $$props) $$invalidate(1, computedClasses = $$props.computedClasses);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [computedStyle, computedClasses, size, mode, className, $$scope, slots];
    }

    class Column extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { size: 2, mode: 3, className: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Column",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get size() {
    		throw new Error("<Column>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Column>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get mode() {
    		throw new Error("<Column>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set mode(value) {
    		throw new Error("<Column>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get className() {
    		throw new Error("<Column>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set className(value) {
    		throw new Error("<Column>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      return Constructor;
    }

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

    function _inheritsLoose(subClass, superClass) {
      subClass.prototype = Object.create(superClass.prototype);
      subClass.prototype.constructor = subClass;

      _setPrototypeOf(subClass, superClass);
    }

    function _getPrototypeOf(o) {
      _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
      return _getPrototypeOf(o);
    }

    function _setPrototypeOf(o, p) {
      _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
      };

      return _setPrototypeOf(o, p);
    }

    function _isNativeReflectConstruct() {
      if (typeof Reflect === "undefined" || !Reflect.construct) return false;
      if (Reflect.construct.sham) return false;
      if (typeof Proxy === "function") return true;

      try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
        return true;
      } catch (e) {
        return false;
      }
    }

    function _construct(Parent, args, Class) {
      if (_isNativeReflectConstruct()) {
        _construct = Reflect.construct;
      } else {
        _construct = function _construct(Parent, args, Class) {
          var a = [null];
          a.push.apply(a, args);
          var Constructor = Function.bind.apply(Parent, a);
          var instance = new Constructor();
          if (Class) _setPrototypeOf(instance, Class.prototype);
          return instance;
        };
      }

      return _construct.apply(null, arguments);
    }

    function _isNativeFunction(fn) {
      return Function.toString.call(fn).indexOf("[native code]") !== -1;
    }

    function _wrapNativeSuper(Class) {
      var _cache = typeof Map === "function" ? new Map() : undefined;

      _wrapNativeSuper = function _wrapNativeSuper(Class) {
        if (Class === null || !_isNativeFunction(Class)) return Class;

        if (typeof Class !== "function") {
          throw new TypeError("Super expression must either be null or a function");
        }

        if (typeof _cache !== "undefined") {
          if (_cache.has(Class)) return _cache.get(Class);

          _cache.set(Class, Wrapper);
        }

        function Wrapper() {
          return _construct(Class, arguments, _getPrototypeOf(this).constructor);
        }

        Wrapper.prototype = Object.create(Class.prototype, {
          constructor: {
            value: Wrapper,
            enumerable: false,
            writable: true,
            configurable: true
          }
        });
        return _setPrototypeOf(Wrapper, Class);
      };

      return _wrapNativeSuper(Class);
    }

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

    function _unsupportedIterableToArray(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
    }

    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length) len = arr.length;

      for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

      return arr2;
    }

    function _createForOfIteratorHelperLoose(o, allowArrayLike) {
      var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
      if (it) return (it = it.call(o)).next.bind(it);

      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;
        return function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    // these aren't really private, but nor are they really useful to document

    /**
     * @private
     */
    var LuxonError = /*#__PURE__*/function (_Error) {
      _inheritsLoose(LuxonError, _Error);

      function LuxonError() {
        return _Error.apply(this, arguments) || this;
      }

      return LuxonError;
    }( /*#__PURE__*/_wrapNativeSuper(Error));
    /**
     * @private
     */


    var InvalidDateTimeError = /*#__PURE__*/function (_LuxonError) {
      _inheritsLoose(InvalidDateTimeError, _LuxonError);

      function InvalidDateTimeError(reason) {
        return _LuxonError.call(this, "Invalid DateTime: " + reason.toMessage()) || this;
      }

      return InvalidDateTimeError;
    }(LuxonError);
    /**
     * @private
     */

    var InvalidIntervalError = /*#__PURE__*/function (_LuxonError2) {
      _inheritsLoose(InvalidIntervalError, _LuxonError2);

      function InvalidIntervalError(reason) {
        return _LuxonError2.call(this, "Invalid Interval: " + reason.toMessage()) || this;
      }

      return InvalidIntervalError;
    }(LuxonError);
    /**
     * @private
     */

    var InvalidDurationError = /*#__PURE__*/function (_LuxonError3) {
      _inheritsLoose(InvalidDurationError, _LuxonError3);

      function InvalidDurationError(reason) {
        return _LuxonError3.call(this, "Invalid Duration: " + reason.toMessage()) || this;
      }

      return InvalidDurationError;
    }(LuxonError);
    /**
     * @private
     */

    var ConflictingSpecificationError = /*#__PURE__*/function (_LuxonError4) {
      _inheritsLoose(ConflictingSpecificationError, _LuxonError4);

      function ConflictingSpecificationError() {
        return _LuxonError4.apply(this, arguments) || this;
      }

      return ConflictingSpecificationError;
    }(LuxonError);
    /**
     * @private
     */

    var InvalidUnitError = /*#__PURE__*/function (_LuxonError5) {
      _inheritsLoose(InvalidUnitError, _LuxonError5);

      function InvalidUnitError(unit) {
        return _LuxonError5.call(this, "Invalid unit " + unit) || this;
      }

      return InvalidUnitError;
    }(LuxonError);
    /**
     * @private
     */

    var InvalidArgumentError = /*#__PURE__*/function (_LuxonError6) {
      _inheritsLoose(InvalidArgumentError, _LuxonError6);

      function InvalidArgumentError() {
        return _LuxonError6.apply(this, arguments) || this;
      }

      return InvalidArgumentError;
    }(LuxonError);
    /**
     * @private
     */

    var ZoneIsAbstractError = /*#__PURE__*/function (_LuxonError7) {
      _inheritsLoose(ZoneIsAbstractError, _LuxonError7);

      function ZoneIsAbstractError() {
        return _LuxonError7.call(this, "Zone is an abstract class") || this;
      }

      return ZoneIsAbstractError;
    }(LuxonError);

    /**
     * @private
     */
    var n = "numeric",
        s = "short",
        l = "long";
    var DATE_SHORT = {
      year: n,
      month: n,
      day: n
    };
    var DATE_MED = {
      year: n,
      month: s,
      day: n
    };
    var DATE_MED_WITH_WEEKDAY = {
      year: n,
      month: s,
      day: n,
      weekday: s
    };
    var DATE_FULL = {
      year: n,
      month: l,
      day: n
    };
    var DATE_HUGE = {
      year: n,
      month: l,
      day: n,
      weekday: l
    };
    var TIME_SIMPLE = {
      hour: n,
      minute: n
    };
    var TIME_WITH_SECONDS = {
      hour: n,
      minute: n,
      second: n
    };
    var TIME_WITH_SHORT_OFFSET = {
      hour: n,
      minute: n,
      second: n,
      timeZoneName: s
    };
    var TIME_WITH_LONG_OFFSET = {
      hour: n,
      minute: n,
      second: n,
      timeZoneName: l
    };
    var TIME_24_SIMPLE = {
      hour: n,
      minute: n,
      hourCycle: "h23"
    };
    var TIME_24_WITH_SECONDS = {
      hour: n,
      minute: n,
      second: n,
      hourCycle: "h23"
    };
    var TIME_24_WITH_SHORT_OFFSET = {
      hour: n,
      minute: n,
      second: n,
      hourCycle: "h23",
      timeZoneName: s
    };
    var TIME_24_WITH_LONG_OFFSET = {
      hour: n,
      minute: n,
      second: n,
      hourCycle: "h23",
      timeZoneName: l
    };
    var DATETIME_SHORT = {
      year: n,
      month: n,
      day: n,
      hour: n,
      minute: n
    };
    var DATETIME_SHORT_WITH_SECONDS = {
      year: n,
      month: n,
      day: n,
      hour: n,
      minute: n,
      second: n
    };
    var DATETIME_MED = {
      year: n,
      month: s,
      day: n,
      hour: n,
      minute: n
    };
    var DATETIME_MED_WITH_SECONDS = {
      year: n,
      month: s,
      day: n,
      hour: n,
      minute: n,
      second: n
    };
    var DATETIME_MED_WITH_WEEKDAY = {
      year: n,
      month: s,
      day: n,
      weekday: s,
      hour: n,
      minute: n
    };
    var DATETIME_FULL = {
      year: n,
      month: l,
      day: n,
      hour: n,
      minute: n,
      timeZoneName: s
    };
    var DATETIME_FULL_WITH_SECONDS = {
      year: n,
      month: l,
      day: n,
      hour: n,
      minute: n,
      second: n,
      timeZoneName: s
    };
    var DATETIME_HUGE = {
      year: n,
      month: l,
      day: n,
      weekday: l,
      hour: n,
      minute: n,
      timeZoneName: l
    };
    var DATETIME_HUGE_WITH_SECONDS = {
      year: n,
      month: l,
      day: n,
      weekday: l,
      hour: n,
      minute: n,
      second: n,
      timeZoneName: l
    };

    /**
     * @private
     */
    // TYPES

    function isUndefined(o) {
      return typeof o === "undefined";
    }
    function isNumber(o) {
      return typeof o === "number";
    }
    function isInteger(o) {
      return typeof o === "number" && o % 1 === 0;
    }
    function isString(o) {
      return typeof o === "string";
    }
    function isDate(o) {
      return Object.prototype.toString.call(o) === "[object Date]";
    } // CAPABILITIES

    function hasRelative() {
      try {
        return typeof Intl !== "undefined" && !!Intl.RelativeTimeFormat;
      } catch (e) {
        return false;
      }
    } // OBJECTS AND ARRAYS

    function maybeArray(thing) {
      return Array.isArray(thing) ? thing : [thing];
    }
    function bestBy(arr, by, compare) {
      if (arr.length === 0) {
        return undefined;
      }

      return arr.reduce(function (best, next) {
        var pair = [by(next), next];

        if (!best) {
          return pair;
        } else if (compare(best[0], pair[0]) === best[0]) {
          return best;
        } else {
          return pair;
        }
      }, null)[1];
    }
    function pick(obj, keys) {
      return keys.reduce(function (a, k) {
        a[k] = obj[k];
        return a;
      }, {});
    }
    function hasOwnProperty(obj, prop) {
      return Object.prototype.hasOwnProperty.call(obj, prop);
    } // NUMBERS AND STRINGS

    function integerBetween(thing, bottom, top) {
      return isInteger(thing) && thing >= bottom && thing <= top;
    } // x % n but takes the sign of n instead of x

    function floorMod(x, n) {
      return x - n * Math.floor(x / n);
    }
    function padStart(input, n) {
      if (n === void 0) {
        n = 2;
      }

      var isNeg = input < 0;
      var padded;

      if (isNeg) {
        padded = "-" + ("" + -input).padStart(n, "0");
      } else {
        padded = ("" + input).padStart(n, "0");
      }

      return padded;
    }
    function parseInteger(string) {
      if (isUndefined(string) || string === null || string === "") {
        return undefined;
      } else {
        return parseInt(string, 10);
      }
    }
    function parseFloating(string) {
      if (isUndefined(string) || string === null || string === "") {
        return undefined;
      } else {
        return parseFloat(string);
      }
    }
    function parseMillis(fraction) {
      // Return undefined (instead of 0) in these cases, where fraction is not set
      if (isUndefined(fraction) || fraction === null || fraction === "") {
        return undefined;
      } else {
        var f = parseFloat("0." + fraction) * 1000;
        return Math.floor(f);
      }
    }
    function roundTo(number, digits, towardZero) {
      if (towardZero === void 0) {
        towardZero = false;
      }

      var factor = Math.pow(10, digits),
          rounder = towardZero ? Math.trunc : Math.round;
      return rounder(number * factor) / factor;
    } // DATE BASICS

    function isLeapYear(year) {
      return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    }
    function daysInYear(year) {
      return isLeapYear(year) ? 366 : 365;
    }
    function daysInMonth(year, month) {
      var modMonth = floorMod(month - 1, 12) + 1,
          modYear = year + (month - modMonth) / 12;

      if (modMonth === 2) {
        return isLeapYear(modYear) ? 29 : 28;
      } else {
        return [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][modMonth - 1];
      }
    } // covert a calendar object to a local timestamp (epoch, but with the offset baked in)

    function objToLocalTS(obj) {
      var d = Date.UTC(obj.year, obj.month - 1, obj.day, obj.hour, obj.minute, obj.second, obj.millisecond); // for legacy reasons, years between 0 and 99 are interpreted as 19XX; revert that

      if (obj.year < 100 && obj.year >= 0) {
        d = new Date(d);
        d.setUTCFullYear(d.getUTCFullYear() - 1900);
      }

      return +d;
    }
    function weeksInWeekYear(weekYear) {
      var p1 = (weekYear + Math.floor(weekYear / 4) - Math.floor(weekYear / 100) + Math.floor(weekYear / 400)) % 7,
          last = weekYear - 1,
          p2 = (last + Math.floor(last / 4) - Math.floor(last / 100) + Math.floor(last / 400)) % 7;
      return p1 === 4 || p2 === 3 ? 53 : 52;
    }
    function untruncateYear(year) {
      if (year > 99) {
        return year;
      } else return year > 60 ? 1900 + year : 2000 + year;
    } // PARSING

    function parseZoneInfo(ts, offsetFormat, locale, timeZone) {
      if (timeZone === void 0) {
        timeZone = null;
      }

      var date = new Date(ts),
          intlOpts = {
        hourCycle: "h23",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      };

      if (timeZone) {
        intlOpts.timeZone = timeZone;
      }

      var modified = _extends({
        timeZoneName: offsetFormat
      }, intlOpts);

      var parsed = new Intl.DateTimeFormat(locale, modified).formatToParts(date).find(function (m) {
        return m.type.toLowerCase() === "timezonename";
      });
      return parsed ? parsed.value : null;
    } // signedOffset('-5', '30') -> -330

    function signedOffset(offHourStr, offMinuteStr) {
      var offHour = parseInt(offHourStr, 10); // don't || this because we want to preserve -0

      if (Number.isNaN(offHour)) {
        offHour = 0;
      }

      var offMin = parseInt(offMinuteStr, 10) || 0,
          offMinSigned = offHour < 0 || Object.is(offHour, -0) ? -offMin : offMin;
      return offHour * 60 + offMinSigned;
    } // COERCION

    function asNumber(value) {
      var numericValue = Number(value);
      if (typeof value === "boolean" || value === "" || Number.isNaN(numericValue)) throw new InvalidArgumentError("Invalid unit value " + value);
      return numericValue;
    }
    function normalizeObject(obj, normalizer) {
      var normalized = {};

      for (var u in obj) {
        if (hasOwnProperty(obj, u)) {
          var v = obj[u];
          if (v === undefined || v === null) continue;
          normalized[normalizer(u)] = asNumber(v);
        }
      }

      return normalized;
    }
    function formatOffset(offset, format) {
      var hours = Math.trunc(Math.abs(offset / 60)),
          minutes = Math.trunc(Math.abs(offset % 60)),
          sign = offset >= 0 ? "+" : "-";

      switch (format) {
        case "short":
          return "" + sign + padStart(hours, 2) + ":" + padStart(minutes, 2);

        case "narrow":
          return "" + sign + hours + (minutes > 0 ? ":" + minutes : "");

        case "techie":
          return "" + sign + padStart(hours, 2) + padStart(minutes, 2);

        default:
          throw new RangeError("Value format " + format + " is out of range for property format");
      }
    }
    function timeObject(obj) {
      return pick(obj, ["hour", "minute", "second", "millisecond"]);
    }
    var ianaRegex = /[A-Za-z_+-]{1,256}(:?\/[A-Za-z0-9_+-]{1,256}(\/[A-Za-z0-9_+-]{1,256})?)?/;

    /**
     * @private
     */


    var monthsLong = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var monthsNarrow = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
    function months(length) {
      switch (length) {
        case "narrow":
          return [].concat(monthsNarrow);

        case "short":
          return [].concat(monthsShort);

        case "long":
          return [].concat(monthsLong);

        case "numeric":
          return ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

        case "2-digit":
          return ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

        default:
          return null;
      }
    }
    var weekdaysLong = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    var weekdaysShort = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    var weekdaysNarrow = ["M", "T", "W", "T", "F", "S", "S"];
    function weekdays(length) {
      switch (length) {
        case "narrow":
          return [].concat(weekdaysNarrow);

        case "short":
          return [].concat(weekdaysShort);

        case "long":
          return [].concat(weekdaysLong);

        case "numeric":
          return ["1", "2", "3", "4", "5", "6", "7"];

        default:
          return null;
      }
    }
    var meridiems = ["AM", "PM"];
    var erasLong = ["Before Christ", "Anno Domini"];
    var erasShort = ["BC", "AD"];
    var erasNarrow = ["B", "A"];
    function eras(length) {
      switch (length) {
        case "narrow":
          return [].concat(erasNarrow);

        case "short":
          return [].concat(erasShort);

        case "long":
          return [].concat(erasLong);

        default:
          return null;
      }
    }
    function meridiemForDateTime(dt) {
      return meridiems[dt.hour < 12 ? 0 : 1];
    }
    function weekdayForDateTime(dt, length) {
      return weekdays(length)[dt.weekday - 1];
    }
    function monthForDateTime(dt, length) {
      return months(length)[dt.month - 1];
    }
    function eraForDateTime(dt, length) {
      return eras(length)[dt.year < 0 ? 0 : 1];
    }
    function formatRelativeTime(unit, count, numeric, narrow) {
      if (numeric === void 0) {
        numeric = "always";
      }

      if (narrow === void 0) {
        narrow = false;
      }

      var units = {
        years: ["year", "yr."],
        quarters: ["quarter", "qtr."],
        months: ["month", "mo."],
        weeks: ["week", "wk."],
        days: ["day", "day", "days"],
        hours: ["hour", "hr."],
        minutes: ["minute", "min."],
        seconds: ["second", "sec."]
      };
      var lastable = ["hours", "minutes", "seconds"].indexOf(unit) === -1;

      if (numeric === "auto" && lastable) {
        var isDay = unit === "days";

        switch (count) {
          case 1:
            return isDay ? "tomorrow" : "next " + units[unit][0];

          case -1:
            return isDay ? "yesterday" : "last " + units[unit][0];

          case 0:
            return isDay ? "today" : "this " + units[unit][0];

        }
      }

      var isInPast = Object.is(count, -0) || count < 0,
          fmtValue = Math.abs(count),
          singular = fmtValue === 1,
          lilUnits = units[unit],
          fmtUnit = narrow ? singular ? lilUnits[1] : lilUnits[2] || lilUnits[1] : singular ? units[unit][0] : unit;
      return isInPast ? fmtValue + " " + fmtUnit + " ago" : "in " + fmtValue + " " + fmtUnit;
    }

    function stringifyTokens(splits, tokenToString) {
      var s = "";

      for (var _iterator = _createForOfIteratorHelperLoose(splits), _step; !(_step = _iterator()).done;) {
        var token = _step.value;

        if (token.literal) {
          s += token.val;
        } else {
          s += tokenToString(token.val);
        }
      }

      return s;
    }

    var _macroTokenToFormatOpts = {
      D: DATE_SHORT,
      DD: DATE_MED,
      DDD: DATE_FULL,
      DDDD: DATE_HUGE,
      t: TIME_SIMPLE,
      tt: TIME_WITH_SECONDS,
      ttt: TIME_WITH_SHORT_OFFSET,
      tttt: TIME_WITH_LONG_OFFSET,
      T: TIME_24_SIMPLE,
      TT: TIME_24_WITH_SECONDS,
      TTT: TIME_24_WITH_SHORT_OFFSET,
      TTTT: TIME_24_WITH_LONG_OFFSET,
      f: DATETIME_SHORT,
      ff: DATETIME_MED,
      fff: DATETIME_FULL,
      ffff: DATETIME_HUGE,
      F: DATETIME_SHORT_WITH_SECONDS,
      FF: DATETIME_MED_WITH_SECONDS,
      FFF: DATETIME_FULL_WITH_SECONDS,
      FFFF: DATETIME_HUGE_WITH_SECONDS
    };
    /**
     * @private
     */

    var Formatter = /*#__PURE__*/function () {
      Formatter.create = function create(locale, opts) {
        if (opts === void 0) {
          opts = {};
        }

        return new Formatter(locale, opts);
      };

      Formatter.parseFormat = function parseFormat(fmt) {
        var current = null,
            currentFull = "",
            bracketed = false;
        var splits = [];

        for (var i = 0; i < fmt.length; i++) {
          var c = fmt.charAt(i);

          if (c === "'") {
            if (currentFull.length > 0) {
              splits.push({
                literal: bracketed,
                val: currentFull
              });
            }

            current = null;
            currentFull = "";
            bracketed = !bracketed;
          } else if (bracketed) {
            currentFull += c;
          } else if (c === current) {
            currentFull += c;
          } else {
            if (currentFull.length > 0) {
              splits.push({
                literal: false,
                val: currentFull
              });
            }

            currentFull = c;
            current = c;
          }
        }

        if (currentFull.length > 0) {
          splits.push({
            literal: bracketed,
            val: currentFull
          });
        }

        return splits;
      };

      Formatter.macroTokenToFormatOpts = function macroTokenToFormatOpts(token) {
        return _macroTokenToFormatOpts[token];
      };

      function Formatter(locale, formatOpts) {
        this.opts = formatOpts;
        this.loc = locale;
        this.systemLoc = null;
      }

      var _proto = Formatter.prototype;

      _proto.formatWithSystemDefault = function formatWithSystemDefault(dt, opts) {
        if (this.systemLoc === null) {
          this.systemLoc = this.loc.redefaultToSystem();
        }

        var df = this.systemLoc.dtFormatter(dt, _extends({}, this.opts, opts));
        return df.format();
      };

      _proto.formatDateTime = function formatDateTime(dt, opts) {
        if (opts === void 0) {
          opts = {};
        }

        var df = this.loc.dtFormatter(dt, _extends({}, this.opts, opts));
        return df.format();
      };

      _proto.formatDateTimeParts = function formatDateTimeParts(dt, opts) {
        if (opts === void 0) {
          opts = {};
        }

        var df = this.loc.dtFormatter(dt, _extends({}, this.opts, opts));
        return df.formatToParts();
      };

      _proto.resolvedOptions = function resolvedOptions(dt, opts) {
        if (opts === void 0) {
          opts = {};
        }

        var df = this.loc.dtFormatter(dt, _extends({}, this.opts, opts));
        return df.resolvedOptions();
      };

      _proto.num = function num(n, p) {
        if (p === void 0) {
          p = 0;
        }

        // we get some perf out of doing this here, annoyingly
        if (this.opts.forceSimple) {
          return padStart(n, p);
        }

        var opts = _extends({}, this.opts);

        if (p > 0) {
          opts.padTo = p;
        }

        return this.loc.numberFormatter(opts).format(n);
      };

      _proto.formatDateTimeFromString = function formatDateTimeFromString(dt, fmt) {
        var _this = this;

        var knownEnglish = this.loc.listingMode() === "en",
            useDateTimeFormatter = this.loc.outputCalendar && this.loc.outputCalendar !== "gregory",
            string = function string(opts, extract) {
          return _this.loc.extract(dt, opts, extract);
        },
            formatOffset = function formatOffset(opts) {
          if (dt.isOffsetFixed && dt.offset === 0 && opts.allowZ) {
            return "Z";
          }

          return dt.isValid ? dt.zone.formatOffset(dt.ts, opts.format) : "";
        },
            meridiem = function meridiem() {
          return knownEnglish ? meridiemForDateTime(dt) : string({
            hour: "numeric",
            hourCycle: "h12"
          }, "dayperiod");
        },
            month = function month(length, standalone) {
          return knownEnglish ? monthForDateTime(dt, length) : string(standalone ? {
            month: length
          } : {
            month: length,
            day: "numeric"
          }, "month");
        },
            weekday = function weekday(length, standalone) {
          return knownEnglish ? weekdayForDateTime(dt, length) : string(standalone ? {
            weekday: length
          } : {
            weekday: length,
            month: "long",
            day: "numeric"
          }, "weekday");
        },
            maybeMacro = function maybeMacro(token) {
          var formatOpts = Formatter.macroTokenToFormatOpts(token);

          if (formatOpts) {
            return _this.formatWithSystemDefault(dt, formatOpts);
          } else {
            return token;
          }
        },
            era = function era(length) {
          return knownEnglish ? eraForDateTime(dt, length) : string({
            era: length
          }, "era");
        },
            tokenToString = function tokenToString(token) {
          // Where possible: http://cldr.unicode.org/translation/date-time-1/date-time#TOC-Standalone-vs.-Format-Styles
          switch (token) {
            // ms
            case "S":
              return _this.num(dt.millisecond);

            case "u": // falls through

            case "SSS":
              return _this.num(dt.millisecond, 3);
            // seconds

            case "s":
              return _this.num(dt.second);

            case "ss":
              return _this.num(dt.second, 2);
            // fractional seconds

            case "uu":
              return _this.num(Math.floor(dt.millisecond / 10), 2);

            case "uuu":
              return _this.num(Math.floor(dt.millisecond / 100));
            // minutes

            case "m":
              return _this.num(dt.minute);

            case "mm":
              return _this.num(dt.minute, 2);
            // hours

            case "h":
              return _this.num(dt.hour % 12 === 0 ? 12 : dt.hour % 12);

            case "hh":
              return _this.num(dt.hour % 12 === 0 ? 12 : dt.hour % 12, 2);

            case "H":
              return _this.num(dt.hour);

            case "HH":
              return _this.num(dt.hour, 2);
            // offset

            case "Z":
              // like +6
              return formatOffset({
                format: "narrow",
                allowZ: _this.opts.allowZ
              });

            case "ZZ":
              // like +06:00
              return formatOffset({
                format: "short",
                allowZ: _this.opts.allowZ
              });

            case "ZZZ":
              // like +0600
              return formatOffset({
                format: "techie",
                allowZ: _this.opts.allowZ
              });

            case "ZZZZ":
              // like EST
              return dt.zone.offsetName(dt.ts, {
                format: "short",
                locale: _this.loc.locale
              });

            case "ZZZZZ":
              // like Eastern Standard Time
              return dt.zone.offsetName(dt.ts, {
                format: "long",
                locale: _this.loc.locale
              });
            // zone

            case "z":
              // like America/New_York
              return dt.zoneName;
            // meridiems

            case "a":
              return meridiem();
            // dates

            case "d":
              return useDateTimeFormatter ? string({
                day: "numeric"
              }, "day") : _this.num(dt.day);

            case "dd":
              return useDateTimeFormatter ? string({
                day: "2-digit"
              }, "day") : _this.num(dt.day, 2);
            // weekdays - standalone

            case "c":
              // like 1
              return _this.num(dt.weekday);

            case "ccc":
              // like 'Tues'
              return weekday("short", true);

            case "cccc":
              // like 'Tuesday'
              return weekday("long", true);

            case "ccccc":
              // like 'T'
              return weekday("narrow", true);
            // weekdays - format

            case "E":
              // like 1
              return _this.num(dt.weekday);

            case "EEE":
              // like 'Tues'
              return weekday("short", false);

            case "EEEE":
              // like 'Tuesday'
              return weekday("long", false);

            case "EEEEE":
              // like 'T'
              return weekday("narrow", false);
            // months - standalone

            case "L":
              // like 1
              return useDateTimeFormatter ? string({
                month: "numeric",
                day: "numeric"
              }, "month") : _this.num(dt.month);

            case "LL":
              // like 01, doesn't seem to work
              return useDateTimeFormatter ? string({
                month: "2-digit",
                day: "numeric"
              }, "month") : _this.num(dt.month, 2);

            case "LLL":
              // like Jan
              return month("short", true);

            case "LLLL":
              // like January
              return month("long", true);

            case "LLLLL":
              // like J
              return month("narrow", true);
            // months - format

            case "M":
              // like 1
              return useDateTimeFormatter ? string({
                month: "numeric"
              }, "month") : _this.num(dt.month);

            case "MM":
              // like 01
              return useDateTimeFormatter ? string({
                month: "2-digit"
              }, "month") : _this.num(dt.month, 2);

            case "MMM":
              // like Jan
              return month("short", false);

            case "MMMM":
              // like January
              return month("long", false);

            case "MMMMM":
              // like J
              return month("narrow", false);
            // years

            case "y":
              // like 2014
              return useDateTimeFormatter ? string({
                year: "numeric"
              }, "year") : _this.num(dt.year);

            case "yy":
              // like 14
              return useDateTimeFormatter ? string({
                year: "2-digit"
              }, "year") : _this.num(dt.year.toString().slice(-2), 2);

            case "yyyy":
              // like 0012
              return useDateTimeFormatter ? string({
                year: "numeric"
              }, "year") : _this.num(dt.year, 4);

            case "yyyyyy":
              // like 000012
              return useDateTimeFormatter ? string({
                year: "numeric"
              }, "year") : _this.num(dt.year, 6);
            // eras

            case "G":
              // like AD
              return era("short");

            case "GG":
              // like Anno Domini
              return era("long");

            case "GGGGG":
              return era("narrow");

            case "kk":
              return _this.num(dt.weekYear.toString().slice(-2), 2);

            case "kkkk":
              return _this.num(dt.weekYear, 4);

            case "W":
              return _this.num(dt.weekNumber);

            case "WW":
              return _this.num(dt.weekNumber, 2);

            case "o":
              return _this.num(dt.ordinal);

            case "ooo":
              return _this.num(dt.ordinal, 3);

            case "q":
              // like 1
              return _this.num(dt.quarter);

            case "qq":
              // like 01
              return _this.num(dt.quarter, 2);

            case "X":
              return _this.num(Math.floor(dt.ts / 1000));

            case "x":
              return _this.num(dt.ts);

            default:
              return maybeMacro(token);
          }
        };

        return stringifyTokens(Formatter.parseFormat(fmt), tokenToString);
      };

      _proto.formatDurationFromString = function formatDurationFromString(dur, fmt) {
        var _this2 = this;

        var tokenToField = function tokenToField(token) {
          switch (token[0]) {
            case "S":
              return "millisecond";

            case "s":
              return "second";

            case "m":
              return "minute";

            case "h":
              return "hour";

            case "d":
              return "day";

            case "M":
              return "month";

            case "y":
              return "year";

            default:
              return null;
          }
        },
            tokenToString = function tokenToString(lildur) {
          return function (token) {
            var mapped = tokenToField(token);

            if (mapped) {
              return _this2.num(lildur.get(mapped), token.length);
            } else {
              return token;
            }
          };
        },
            tokens = Formatter.parseFormat(fmt),
            realTokens = tokens.reduce(function (found, _ref) {
          var literal = _ref.literal,
              val = _ref.val;
          return literal ? found : found.concat(val);
        }, []),
            collapsed = dur.shiftTo.apply(dur, realTokens.map(tokenToField).filter(function (t) {
          return t;
        }));

        return stringifyTokens(tokens, tokenToString(collapsed));
      };

      return Formatter;
    }();

    var Invalid = /*#__PURE__*/function () {
      function Invalid(reason, explanation) {
        this.reason = reason;
        this.explanation = explanation;
      }

      var _proto = Invalid.prototype;

      _proto.toMessage = function toMessage() {
        if (this.explanation) {
          return this.reason + ": " + this.explanation;
        } else {
          return this.reason;
        }
      };

      return Invalid;
    }();

    /**
     * @interface
     */

    var Zone = /*#__PURE__*/function () {
      function Zone() {}

      var _proto = Zone.prototype;

      /**
       * Returns the offset's common name (such as EST) at the specified timestamp
       * @abstract
       * @param {number} ts - Epoch milliseconds for which to get the name
       * @param {Object} opts - Options to affect the format
       * @param {string} opts.format - What style of offset to return. Accepts 'long' or 'short'.
       * @param {string} opts.locale - What locale to return the offset name in.
       * @return {string}
       */
      _proto.offsetName = function offsetName(ts, opts) {
        throw new ZoneIsAbstractError();
      }
      /**
       * Returns the offset's value as a string
       * @abstract
       * @param {number} ts - Epoch milliseconds for which to get the offset
       * @param {string} format - What style of offset to return.
       *                          Accepts 'narrow', 'short', or 'techie'. Returning '+6', '+06:00', or '+0600' respectively
       * @return {string}
       */
      ;

      _proto.formatOffset = function formatOffset(ts, format) {
        throw new ZoneIsAbstractError();
      }
      /**
       * Return the offset in minutes for this zone at the specified timestamp.
       * @abstract
       * @param {number} ts - Epoch milliseconds for which to compute the offset
       * @return {number}
       */
      ;

      _proto.offset = function offset(ts) {
        throw new ZoneIsAbstractError();
      }
      /**
       * Return whether this Zone is equal to another zone
       * @abstract
       * @param {Zone} otherZone - the zone to compare
       * @return {boolean}
       */
      ;

      _proto.equals = function equals(otherZone) {
        throw new ZoneIsAbstractError();
      }
      /**
       * Return whether this Zone is valid.
       * @abstract
       * @type {boolean}
       */
      ;

      _createClass(Zone, [{
        key: "type",
        get:
        /**
         * The type of zone
         * @abstract
         * @type {string}
         */
        function get() {
          throw new ZoneIsAbstractError();
        }
        /**
         * The name of this zone.
         * @abstract
         * @type {string}
         */

      }, {
        key: "name",
        get: function get() {
          throw new ZoneIsAbstractError();
        }
        /**
         * Returns whether the offset is known to be fixed for the whole year.
         * @abstract
         * @type {boolean}
         */

      }, {
        key: "isUniversal",
        get: function get() {
          throw new ZoneIsAbstractError();
        }
      }, {
        key: "isValid",
        get: function get() {
          throw new ZoneIsAbstractError();
        }
      }]);

      return Zone;
    }();

    var singleton$1 = null;
    /**
     * Represents the local zone for this JavaScript environment.
     * @implements {Zone}
     */

    var SystemZone = /*#__PURE__*/function (_Zone) {
      _inheritsLoose(SystemZone, _Zone);

      function SystemZone() {
        return _Zone.apply(this, arguments) || this;
      }

      var _proto = SystemZone.prototype;

      /** @override **/
      _proto.offsetName = function offsetName(ts, _ref) {
        var format = _ref.format,
            locale = _ref.locale;
        return parseZoneInfo(ts, format, locale);
      }
      /** @override **/
      ;

      _proto.formatOffset = function formatOffset$1(ts, format) {
        return formatOffset(this.offset(ts), format);
      }
      /** @override **/
      ;

      _proto.offset = function offset(ts) {
        return -new Date(ts).getTimezoneOffset();
      }
      /** @override **/
      ;

      _proto.equals = function equals(otherZone) {
        return otherZone.type === "system";
      }
      /** @override **/
      ;

      _createClass(SystemZone, [{
        key: "type",
        get:
        /** @override **/
        function get() {
          return "system";
        }
        /** @override **/

      }, {
        key: "name",
        get: function get() {
          return new Intl.DateTimeFormat().resolvedOptions().timeZone;
        }
        /** @override **/

      }, {
        key: "isUniversal",
        get: function get() {
          return false;
        }
      }, {
        key: "isValid",
        get: function get() {
          return true;
        }
      }], [{
        key: "instance",
        get:
        /**
         * Get a singleton instance of the local zone
         * @return {SystemZone}
         */
        function get() {
          if (singleton$1 === null) {
            singleton$1 = new SystemZone();
          }

          return singleton$1;
        }
      }]);

      return SystemZone;
    }(Zone);
    var dtfCache = {};

    function makeDTF(zone) {
      if (!dtfCache[zone]) {
        dtfCache[zone] = new Intl.DateTimeFormat("en-US", {
          hour12: false,
          timeZone: zone,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit"
        });
      }

      return dtfCache[zone];
    }

    var typeToPos = {
      year: 0,
      month: 1,
      day: 2,
      hour: 3,
      minute: 4,
      second: 5
    };

    function hackyOffset(dtf, date) {
      var formatted = dtf.format(date).replace(/\u200E/g, ""),
          parsed = /(\d+)\/(\d+)\/(\d+),? (\d+):(\d+):(\d+)/.exec(formatted),
          fMonth = parsed[1],
          fDay = parsed[2],
          fYear = parsed[3],
          fHour = parsed[4],
          fMinute = parsed[5],
          fSecond = parsed[6];
      return [fYear, fMonth, fDay, fHour, fMinute, fSecond];
    }

    function partsOffset(dtf, date) {
      var formatted = dtf.formatToParts(date),
          filled = [];

      for (var i = 0; i < formatted.length; i++) {
        var _formatted$i = formatted[i],
            type = _formatted$i.type,
            value = _formatted$i.value,
            pos = typeToPos[type];

        if (!isUndefined(pos)) {
          filled[pos] = parseInt(value, 10);
        }
      }

      return filled;
    }

    var ianaZoneCache = {};
    /**
     * A zone identified by an IANA identifier, like America/New_York
     * @implements {Zone}
     */

    var IANAZone = /*#__PURE__*/function (_Zone) {
      _inheritsLoose(IANAZone, _Zone);

      /**
       * @param {string} name - Zone name
       * @return {IANAZone}
       */
      IANAZone.create = function create(name) {
        if (!ianaZoneCache[name]) {
          ianaZoneCache[name] = new IANAZone(name);
        }

        return ianaZoneCache[name];
      }
      /**
       * Reset local caches. Should only be necessary in testing scenarios.
       * @return {void}
       */
      ;

      IANAZone.resetCache = function resetCache() {
        ianaZoneCache = {};
        dtfCache = {};
      }
      /**
       * Returns whether the provided string is a valid specifier. This only checks the string's format, not that the specifier identifies a known zone; see isValidZone for that.
       * @param {string} s - The string to check validity on
       * @example IANAZone.isValidSpecifier("America/New_York") //=> true
       * @example IANAZone.isValidSpecifier("Sport~~blorp") //=> false
       * @deprecated This method returns false some valid IANA names. Use isValidZone instead
       * @return {boolean}
       */
      ;

      IANAZone.isValidSpecifier = function isValidSpecifier(s) {
        return this.isValidZone(s);
      }
      /**
       * Returns whether the provided string identifies a real zone
       * @param {string} zone - The string to check
       * @example IANAZone.isValidZone("America/New_York") //=> true
       * @example IANAZone.isValidZone("Fantasia/Castle") //=> false
       * @example IANAZone.isValidZone("Sport~~blorp") //=> false
       * @return {boolean}
       */
      ;

      IANAZone.isValidZone = function isValidZone(zone) {
        if (!zone) {
          return false;
        }

        try {
          new Intl.DateTimeFormat("en-US", {
            timeZone: zone
          }).format();
          return true;
        } catch (e) {
          return false;
        }
      };

      function IANAZone(name) {
        var _this;

        _this = _Zone.call(this) || this;
        /** @private **/

        _this.zoneName = name;
        /** @private **/

        _this.valid = IANAZone.isValidZone(name);
        return _this;
      }
      /** @override **/


      var _proto = IANAZone.prototype;

      /** @override **/
      _proto.offsetName = function offsetName(ts, _ref) {
        var format = _ref.format,
            locale = _ref.locale;
        return parseZoneInfo(ts, format, locale, this.name);
      }
      /** @override **/
      ;

      _proto.formatOffset = function formatOffset$1(ts, format) {
        return formatOffset(this.offset(ts), format);
      }
      /** @override **/
      ;

      _proto.offset = function offset(ts) {
        var date = new Date(ts);
        if (isNaN(date)) return NaN;

        var dtf = makeDTF(this.name),
            _ref2 = dtf.formatToParts ? partsOffset(dtf, date) : hackyOffset(dtf, date),
            year = _ref2[0],
            month = _ref2[1],
            day = _ref2[2],
            hour = _ref2[3],
            minute = _ref2[4],
            second = _ref2[5]; // because we're using hour12 and https://bugs.chromium.org/p/chromium/issues/detail?id=1025564&can=2&q=%2224%3A00%22%20datetimeformat


        var adjustedHour = hour === 24 ? 0 : hour;
        var asUTC = objToLocalTS({
          year: year,
          month: month,
          day: day,
          hour: adjustedHour,
          minute: minute,
          second: second,
          millisecond: 0
        });
        var asTS = +date;
        var over = asTS % 1000;
        asTS -= over >= 0 ? over : 1000 + over;
        return (asUTC - asTS) / (60 * 1000);
      }
      /** @override **/
      ;

      _proto.equals = function equals(otherZone) {
        return otherZone.type === "iana" && otherZone.name === this.name;
      }
      /** @override **/
      ;

      _createClass(IANAZone, [{
        key: "type",
        get: function get() {
          return "iana";
        }
        /** @override **/

      }, {
        key: "name",
        get: function get() {
          return this.zoneName;
        }
        /** @override **/

      }, {
        key: "isUniversal",
        get: function get() {
          return false;
        }
      }, {
        key: "isValid",
        get: function get() {
          return this.valid;
        }
      }]);

      return IANAZone;
    }(Zone);

    var singleton = null;
    /**
     * A zone with a fixed offset (meaning no DST)
     * @implements {Zone}
     */

    var FixedOffsetZone = /*#__PURE__*/function (_Zone) {
      _inheritsLoose(FixedOffsetZone, _Zone);

      /**
       * Get an instance with a specified offset
       * @param {number} offset - The offset in minutes
       * @return {FixedOffsetZone}
       */
      FixedOffsetZone.instance = function instance(offset) {
        return offset === 0 ? FixedOffsetZone.utcInstance : new FixedOffsetZone(offset);
      }
      /**
       * Get an instance of FixedOffsetZone from a UTC offset string, like "UTC+6"
       * @param {string} s - The offset string to parse
       * @example FixedOffsetZone.parseSpecifier("UTC+6")
       * @example FixedOffsetZone.parseSpecifier("UTC+06")
       * @example FixedOffsetZone.parseSpecifier("UTC-6:00")
       * @return {FixedOffsetZone}
       */
      ;

      FixedOffsetZone.parseSpecifier = function parseSpecifier(s) {
        if (s) {
          var r = s.match(/^utc(?:([+-]\d{1,2})(?::(\d{2}))?)?$/i);

          if (r) {
            return new FixedOffsetZone(signedOffset(r[1], r[2]));
          }
        }

        return null;
      };

      function FixedOffsetZone(offset) {
        var _this;

        _this = _Zone.call(this) || this;
        /** @private **/

        _this.fixed = offset;
        return _this;
      }
      /** @override **/


      var _proto = FixedOffsetZone.prototype;

      /** @override **/
      _proto.offsetName = function offsetName() {
        return this.name;
      }
      /** @override **/
      ;

      _proto.formatOffset = function formatOffset$1(ts, format) {
        return formatOffset(this.fixed, format);
      }
      /** @override **/
      ;

      /** @override **/
      _proto.offset = function offset() {
        return this.fixed;
      }
      /** @override **/
      ;

      _proto.equals = function equals(otherZone) {
        return otherZone.type === "fixed" && otherZone.fixed === this.fixed;
      }
      /** @override **/
      ;

      _createClass(FixedOffsetZone, [{
        key: "type",
        get: function get() {
          return "fixed";
        }
        /** @override **/

      }, {
        key: "name",
        get: function get() {
          return this.fixed === 0 ? "UTC" : "UTC" + formatOffset(this.fixed, "narrow");
        }
      }, {
        key: "isUniversal",
        get: function get() {
          return true;
        }
      }, {
        key: "isValid",
        get: function get() {
          return true;
        }
      }], [{
        key: "utcInstance",
        get:
        /**
         * Get a singleton instance of UTC
         * @return {FixedOffsetZone}
         */
        function get() {
          if (singleton === null) {
            singleton = new FixedOffsetZone(0);
          }

          return singleton;
        }
      }]);

      return FixedOffsetZone;
    }(Zone);

    /**
     * A zone that failed to parse. You should never need to instantiate this.
     * @implements {Zone}
     */

    var InvalidZone = /*#__PURE__*/function (_Zone) {
      _inheritsLoose(InvalidZone, _Zone);

      function InvalidZone(zoneName) {
        var _this;

        _this = _Zone.call(this) || this;
        /**  @private */

        _this.zoneName = zoneName;
        return _this;
      }
      /** @override **/


      var _proto = InvalidZone.prototype;

      /** @override **/
      _proto.offsetName = function offsetName() {
        return null;
      }
      /** @override **/
      ;

      _proto.formatOffset = function formatOffset() {
        return "";
      }
      /** @override **/
      ;

      _proto.offset = function offset() {
        return NaN;
      }
      /** @override **/
      ;

      _proto.equals = function equals() {
        return false;
      }
      /** @override **/
      ;

      _createClass(InvalidZone, [{
        key: "type",
        get: function get() {
          return "invalid";
        }
        /** @override **/

      }, {
        key: "name",
        get: function get() {
          return this.zoneName;
        }
        /** @override **/

      }, {
        key: "isUniversal",
        get: function get() {
          return false;
        }
      }, {
        key: "isValid",
        get: function get() {
          return false;
        }
      }]);

      return InvalidZone;
    }(Zone);

    /**
     * @private
     */
    function normalizeZone(input, defaultZone) {

      if (isUndefined(input) || input === null) {
        return defaultZone;
      } else if (input instanceof Zone) {
        return input;
      } else if (isString(input)) {
        var lowered = input.toLowerCase();
        if (lowered === "local" || lowered === "system") return defaultZone;else if (lowered === "utc" || lowered === "gmt") return FixedOffsetZone.utcInstance;else return FixedOffsetZone.parseSpecifier(lowered) || IANAZone.create(input);
      } else if (isNumber(input)) {
        return FixedOffsetZone.instance(input);
      } else if (typeof input === "object" && input.offset && typeof input.offset === "number") {
        // This is dumb, but the instanceof check above doesn't seem to really work
        // so we're duck checking it
        return input;
      } else {
        return new InvalidZone(input);
      }
    }

    var now = function now() {
      return Date.now();
    },
        defaultZone = "system",
        defaultLocale = null,
        defaultNumberingSystem = null,
        defaultOutputCalendar = null,
        throwOnInvalid;
    /**
     * Settings contains static getters and setters that control Luxon's overall behavior. Luxon is a simple library with few options, but the ones it does have live here.
     */


    var Settings = /*#__PURE__*/function () {
      function Settings() {}

      /**
       * Reset Luxon's global caches. Should only be necessary in testing scenarios.
       * @return {void}
       */
      Settings.resetCaches = function resetCaches() {
        Locale.resetCache();
        IANAZone.resetCache();
      };

      _createClass(Settings, null, [{
        key: "now",
        get:
        /**
         * Get the callback for returning the current timestamp.
         * @type {function}
         */
        function get() {
          return now;
        }
        /**
         * Set the callback for returning the current timestamp.
         * The function should return a number, which will be interpreted as an Epoch millisecond count
         * @type {function}
         * @example Settings.now = () => Date.now() + 3000 // pretend it is 3 seconds in the future
         * @example Settings.now = () => 0 // always pretend it's Jan 1, 1970 at midnight in UTC time
         */
        ,
        set: function set(n) {
          now = n;
        }
        /**
         * Set the default time zone to create DateTimes in. Does not affect existing instances.
         * Use the value "system" to reset this value to the system's time zone.
         * @type {string}
         */

      }, {
        key: "defaultZone",
        get:
        /**
         * Get the default time zone object currently used to create DateTimes. Does not affect existing instances.
         * The default value is the system's time zone (the one set on the machine that runs this code).
         * @type {Zone}
         */
        function get() {
          return normalizeZone(defaultZone, SystemZone.instance);
        }
        /**
         * Get the default locale to create DateTimes with. Does not affect existing instances.
         * @type {string}
         */
        ,
        set: function set(zone) {
          defaultZone = zone;
        }
      }, {
        key: "defaultLocale",
        get: function get() {
          return defaultLocale;
        }
        /**
         * Set the default locale to create DateTimes with. Does not affect existing instances.
         * @type {string}
         */
        ,
        set: function set(locale) {
          defaultLocale = locale;
        }
        /**
         * Get the default numbering system to create DateTimes with. Does not affect existing instances.
         * @type {string}
         */

      }, {
        key: "defaultNumberingSystem",
        get: function get() {
          return defaultNumberingSystem;
        }
        /**
         * Set the default numbering system to create DateTimes with. Does not affect existing instances.
         * @type {string}
         */
        ,
        set: function set(numberingSystem) {
          defaultNumberingSystem = numberingSystem;
        }
        /**
         * Get the default output calendar to create DateTimes with. Does not affect existing instances.
         * @type {string}
         */

      }, {
        key: "defaultOutputCalendar",
        get: function get() {
          return defaultOutputCalendar;
        }
        /**
         * Set the default output calendar to create DateTimes with. Does not affect existing instances.
         * @type {string}
         */
        ,
        set: function set(outputCalendar) {
          defaultOutputCalendar = outputCalendar;
        }
        /**
         * Get whether Luxon will throw when it encounters invalid DateTimes, Durations, or Intervals
         * @type {boolean}
         */

      }, {
        key: "throwOnInvalid",
        get: function get() {
          return throwOnInvalid;
        }
        /**
         * Set whether Luxon will throw when it encounters invalid DateTimes, Durations, or Intervals
         * @type {boolean}
         */
        ,
        set: function set(t) {
          throwOnInvalid = t;
        }
      }]);

      return Settings;
    }();

    var _excluded = ["base"],
        _excluded2 = ["padTo", "floor"];

    var intlLFCache = {};

    function getCachedLF(locString, opts) {
      if (opts === void 0) {
        opts = {};
      }

      var key = JSON.stringify([locString, opts]);
      var dtf = intlLFCache[key];

      if (!dtf) {
        dtf = new Intl.ListFormat(locString, opts);
        intlLFCache[key] = dtf;
      }

      return dtf;
    }

    var intlDTCache = {};

    function getCachedDTF(locString, opts) {
      if (opts === void 0) {
        opts = {};
      }

      var key = JSON.stringify([locString, opts]);
      var dtf = intlDTCache[key];

      if (!dtf) {
        dtf = new Intl.DateTimeFormat(locString, opts);
        intlDTCache[key] = dtf;
      }

      return dtf;
    }

    var intlNumCache = {};

    function getCachedINF(locString, opts) {
      if (opts === void 0) {
        opts = {};
      }

      var key = JSON.stringify([locString, opts]);
      var inf = intlNumCache[key];

      if (!inf) {
        inf = new Intl.NumberFormat(locString, opts);
        intlNumCache[key] = inf;
      }

      return inf;
    }

    var intlRelCache = {};

    function getCachedRTF(locString, opts) {
      if (opts === void 0) {
        opts = {};
      }

      var _opts = opts;
          _opts.base;
          var cacheKeyOpts = _objectWithoutPropertiesLoose(_opts, _excluded); // exclude `base` from the options


      var key = JSON.stringify([locString, cacheKeyOpts]);
      var inf = intlRelCache[key];

      if (!inf) {
        inf = new Intl.RelativeTimeFormat(locString, opts);
        intlRelCache[key] = inf;
      }

      return inf;
    }

    var sysLocaleCache = null;

    function systemLocale() {
      if (sysLocaleCache) {
        return sysLocaleCache;
      } else {
        sysLocaleCache = new Intl.DateTimeFormat().resolvedOptions().locale;
        return sysLocaleCache;
      }
    }

    function parseLocaleString(localeStr) {
      // I really want to avoid writing a BCP 47 parser
      // see, e.g. https://github.com/wooorm/bcp-47
      // Instead, we'll do this:
      // a) if the string has no -u extensions, just leave it alone
      // b) if it does, use Intl to resolve everything
      // c) if Intl fails, try again without the -u
      var uIndex = localeStr.indexOf("-u-");

      if (uIndex === -1) {
        return [localeStr];
      } else {
        var options;
        var smaller = localeStr.substring(0, uIndex);

        try {
          options = getCachedDTF(localeStr).resolvedOptions();
        } catch (e) {
          options = getCachedDTF(smaller).resolvedOptions();
        }

        var _options = options,
            numberingSystem = _options.numberingSystem,
            calendar = _options.calendar; // return the smaller one so that we can append the calendar and numbering overrides to it

        return [smaller, numberingSystem, calendar];
      }
    }

    function intlConfigString(localeStr, numberingSystem, outputCalendar) {
      if (outputCalendar || numberingSystem) {
        localeStr += "-u";

        if (outputCalendar) {
          localeStr += "-ca-" + outputCalendar;
        }

        if (numberingSystem) {
          localeStr += "-nu-" + numberingSystem;
        }

        return localeStr;
      } else {
        return localeStr;
      }
    }

    function mapMonths(f) {
      var ms = [];

      for (var i = 1; i <= 12; i++) {
        var dt = DateTime.utc(2016, i, 1);
        ms.push(f(dt));
      }

      return ms;
    }

    function mapWeekdays(f) {
      var ms = [];

      for (var i = 1; i <= 7; i++) {
        var dt = DateTime.utc(2016, 11, 13 + i);
        ms.push(f(dt));
      }

      return ms;
    }

    function listStuff(loc, length, defaultOK, englishFn, intlFn) {
      var mode = loc.listingMode(defaultOK);

      if (mode === "error") {
        return null;
      } else if (mode === "en") {
        return englishFn(length);
      } else {
        return intlFn(length);
      }
    }

    function supportsFastNumbers(loc) {
      if (loc.numberingSystem && loc.numberingSystem !== "latn") {
        return false;
      } else {
        return loc.numberingSystem === "latn" || !loc.locale || loc.locale.startsWith("en") || new Intl.DateTimeFormat(loc.intl).resolvedOptions().numberingSystem === "latn";
      }
    }
    /**
     * @private
     */


    var PolyNumberFormatter = /*#__PURE__*/function () {
      function PolyNumberFormatter(intl, forceSimple, opts) {
        this.padTo = opts.padTo || 0;
        this.floor = opts.floor || false;

        opts.padTo;
            opts.floor;
            var otherOpts = _objectWithoutPropertiesLoose(opts, _excluded2);

        if (!forceSimple || Object.keys(otherOpts).length > 0) {
          var intlOpts = _extends({
            useGrouping: false
          }, opts);

          if (opts.padTo > 0) intlOpts.minimumIntegerDigits = opts.padTo;
          this.inf = getCachedINF(intl, intlOpts);
        }
      }

      var _proto = PolyNumberFormatter.prototype;

      _proto.format = function format(i) {
        if (this.inf) {
          var fixed = this.floor ? Math.floor(i) : i;
          return this.inf.format(fixed);
        } else {
          // to match the browser's numberformatter defaults
          var _fixed = this.floor ? Math.floor(i) : roundTo(i, 3);

          return padStart(_fixed, this.padTo);
        }
      };

      return PolyNumberFormatter;
    }();
    /**
     * @private
     */


    var PolyDateFormatter = /*#__PURE__*/function () {
      function PolyDateFormatter(dt, intl, opts) {
        this.opts = opts;
        var z;

        if (dt.zone.isUniversal) {
          // UTC-8 or Etc/UTC-8 are not part of tzdata, only Etc/GMT+8 and the like.
          // That is why fixed-offset TZ is set to that unless it is:
          // 1. Representing offset 0 when UTC is used to maintain previous behavior and does not become GMT.
          // 2. Unsupported by the browser:
          //    - some do not support Etc/
          //    - < Etc/GMT-14, > Etc/GMT+12, and 30-minute or 45-minute offsets are not part of tzdata
          var gmtOffset = -1 * (dt.offset / 60);
          var offsetZ = gmtOffset >= 0 ? "Etc/GMT+" + gmtOffset : "Etc/GMT" + gmtOffset;

          if (dt.offset !== 0 && IANAZone.create(offsetZ).valid) {
            z = offsetZ;
            this.dt = dt;
          } else {
            // Not all fixed-offset zones like Etc/+4:30 are present in tzdata.
            // So we have to make do. Two cases:
            // 1. The format options tell us to show the zone. We can't do that, so the best
            // we can do is format the date in UTC.
            // 2. The format options don't tell us to show the zone. Then we can adjust them
            // the time and tell the formatter to show it to us in UTC, so that the time is right
            // and the bad zone doesn't show up.
            z = "UTC";

            if (opts.timeZoneName) {
              this.dt = dt;
            } else {
              this.dt = dt.offset === 0 ? dt : DateTime.fromMillis(dt.ts + dt.offset * 60 * 1000);
            }
          }
        } else if (dt.zone.type === "system") {
          this.dt = dt;
        } else {
          this.dt = dt;
          z = dt.zone.name;
        }

        var intlOpts = _extends({}, this.opts);

        if (z) {
          intlOpts.timeZone = z;
        }

        this.dtf = getCachedDTF(intl, intlOpts);
      }

      var _proto2 = PolyDateFormatter.prototype;

      _proto2.format = function format() {
        return this.dtf.format(this.dt.toJSDate());
      };

      _proto2.formatToParts = function formatToParts() {
        return this.dtf.formatToParts(this.dt.toJSDate());
      };

      _proto2.resolvedOptions = function resolvedOptions() {
        return this.dtf.resolvedOptions();
      };

      return PolyDateFormatter;
    }();
    /**
     * @private
     */


    var PolyRelFormatter = /*#__PURE__*/function () {
      function PolyRelFormatter(intl, isEnglish, opts) {
        this.opts = _extends({
          style: "long"
        }, opts);

        if (!isEnglish && hasRelative()) {
          this.rtf = getCachedRTF(intl, opts);
        }
      }

      var _proto3 = PolyRelFormatter.prototype;

      _proto3.format = function format(count, unit) {
        if (this.rtf) {
          return this.rtf.format(count, unit);
        } else {
          return formatRelativeTime(unit, count, this.opts.numeric, this.opts.style !== "long");
        }
      };

      _proto3.formatToParts = function formatToParts(count, unit) {
        if (this.rtf) {
          return this.rtf.formatToParts(count, unit);
        } else {
          return [];
        }
      };

      return PolyRelFormatter;
    }();
    /**
     * @private
     */


    var Locale = /*#__PURE__*/function () {
      Locale.fromOpts = function fromOpts(opts) {
        return Locale.create(opts.locale, opts.numberingSystem, opts.outputCalendar, opts.defaultToEN);
      };

      Locale.create = function create(locale, numberingSystem, outputCalendar, defaultToEN) {
        if (defaultToEN === void 0) {
          defaultToEN = false;
        }

        var specifiedLocale = locale || Settings.defaultLocale; // the system locale is useful for human readable strings but annoying for parsing/formatting known formats

        var localeR = specifiedLocale || (defaultToEN ? "en-US" : systemLocale());
        var numberingSystemR = numberingSystem || Settings.defaultNumberingSystem;
        var outputCalendarR = outputCalendar || Settings.defaultOutputCalendar;
        return new Locale(localeR, numberingSystemR, outputCalendarR, specifiedLocale);
      };

      Locale.resetCache = function resetCache() {
        sysLocaleCache = null;
        intlDTCache = {};
        intlNumCache = {};
        intlRelCache = {};
      };

      Locale.fromObject = function fromObject(_temp) {
        var _ref = _temp === void 0 ? {} : _temp,
            locale = _ref.locale,
            numberingSystem = _ref.numberingSystem,
            outputCalendar = _ref.outputCalendar;

        return Locale.create(locale, numberingSystem, outputCalendar);
      };

      function Locale(locale, numbering, outputCalendar, specifiedLocale) {
        var _parseLocaleString = parseLocaleString(locale),
            parsedLocale = _parseLocaleString[0],
            parsedNumberingSystem = _parseLocaleString[1],
            parsedOutputCalendar = _parseLocaleString[2];

        this.locale = parsedLocale;
        this.numberingSystem = numbering || parsedNumberingSystem || null;
        this.outputCalendar = outputCalendar || parsedOutputCalendar || null;
        this.intl = intlConfigString(this.locale, this.numberingSystem, this.outputCalendar);
        this.weekdaysCache = {
          format: {},
          standalone: {}
        };
        this.monthsCache = {
          format: {},
          standalone: {}
        };
        this.meridiemCache = null;
        this.eraCache = {};
        this.specifiedLocale = specifiedLocale;
        this.fastNumbersCached = null;
      }

      var _proto4 = Locale.prototype;

      _proto4.listingMode = function listingMode() {
        var isActuallyEn = this.isEnglish();
        var hasNoWeirdness = (this.numberingSystem === null || this.numberingSystem === "latn") && (this.outputCalendar === null || this.outputCalendar === "gregory");
        return isActuallyEn && hasNoWeirdness ? "en" : "intl";
      };

      _proto4.clone = function clone(alts) {
        if (!alts || Object.getOwnPropertyNames(alts).length === 0) {
          return this;
        } else {
          return Locale.create(alts.locale || this.specifiedLocale, alts.numberingSystem || this.numberingSystem, alts.outputCalendar || this.outputCalendar, alts.defaultToEN || false);
        }
      };

      _proto4.redefaultToEN = function redefaultToEN(alts) {
        if (alts === void 0) {
          alts = {};
        }

        return this.clone(_extends({}, alts, {
          defaultToEN: true
        }));
      };

      _proto4.redefaultToSystem = function redefaultToSystem(alts) {
        if (alts === void 0) {
          alts = {};
        }

        return this.clone(_extends({}, alts, {
          defaultToEN: false
        }));
      };

      _proto4.months = function months$1(length, format, defaultOK) {
        var _this = this;

        if (format === void 0) {
          format = false;
        }

        if (defaultOK === void 0) {
          defaultOK = true;
        }

        return listStuff(this, length, defaultOK, months, function () {
          var intl = format ? {
            month: length,
            day: "numeric"
          } : {
            month: length
          },
              formatStr = format ? "format" : "standalone";

          if (!_this.monthsCache[formatStr][length]) {
            _this.monthsCache[formatStr][length] = mapMonths(function (dt) {
              return _this.extract(dt, intl, "month");
            });
          }

          return _this.monthsCache[formatStr][length];
        });
      };

      _proto4.weekdays = function weekdays$1(length, format, defaultOK) {
        var _this2 = this;

        if (format === void 0) {
          format = false;
        }

        if (defaultOK === void 0) {
          defaultOK = true;
        }

        return listStuff(this, length, defaultOK, weekdays, function () {
          var intl = format ? {
            weekday: length,
            year: "numeric",
            month: "long",
            day: "numeric"
          } : {
            weekday: length
          },
              formatStr = format ? "format" : "standalone";

          if (!_this2.weekdaysCache[formatStr][length]) {
            _this2.weekdaysCache[formatStr][length] = mapWeekdays(function (dt) {
              return _this2.extract(dt, intl, "weekday");
            });
          }

          return _this2.weekdaysCache[formatStr][length];
        });
      };

      _proto4.meridiems = function meridiems$1(defaultOK) {
        var _this3 = this;

        if (defaultOK === void 0) {
          defaultOK = true;
        }

        return listStuff(this, undefined, defaultOK, function () {
          return meridiems;
        }, function () {
          // In theory there could be aribitrary day periods. We're gonna assume there are exactly two
          // for AM and PM. This is probably wrong, but it's makes parsing way easier.
          if (!_this3.meridiemCache) {
            var intl = {
              hour: "numeric",
              hourCycle: "h12"
            };
            _this3.meridiemCache = [DateTime.utc(2016, 11, 13, 9), DateTime.utc(2016, 11, 13, 19)].map(function (dt) {
              return _this3.extract(dt, intl, "dayperiod");
            });
          }

          return _this3.meridiemCache;
        });
      };

      _proto4.eras = function eras$1(length, defaultOK) {
        var _this4 = this;

        if (defaultOK === void 0) {
          defaultOK = true;
        }

        return listStuff(this, length, defaultOK, eras, function () {
          var intl = {
            era: length
          }; // This is problematic. Different calendars are going to define eras totally differently. What I need is the minimum set of dates
          // to definitely enumerate them.

          if (!_this4.eraCache[length]) {
            _this4.eraCache[length] = [DateTime.utc(-40, 1, 1), DateTime.utc(2017, 1, 1)].map(function (dt) {
              return _this4.extract(dt, intl, "era");
            });
          }

          return _this4.eraCache[length];
        });
      };

      _proto4.extract = function extract(dt, intlOpts, field) {
        var df = this.dtFormatter(dt, intlOpts),
            results = df.formatToParts(),
            matching = results.find(function (m) {
          return m.type.toLowerCase() === field;
        });
        return matching ? matching.value : null;
      };

      _proto4.numberFormatter = function numberFormatter(opts) {
        if (opts === void 0) {
          opts = {};
        }

        // this forcesimple option is never used (the only caller short-circuits on it, but it seems safer to leave)
        // (in contrast, the rest of the condition is used heavily)
        return new PolyNumberFormatter(this.intl, opts.forceSimple || this.fastNumbers, opts);
      };

      _proto4.dtFormatter = function dtFormatter(dt, intlOpts) {
        if (intlOpts === void 0) {
          intlOpts = {};
        }

        return new PolyDateFormatter(dt, this.intl, intlOpts);
      };

      _proto4.relFormatter = function relFormatter(opts) {
        if (opts === void 0) {
          opts = {};
        }

        return new PolyRelFormatter(this.intl, this.isEnglish(), opts);
      };

      _proto4.listFormatter = function listFormatter(opts) {
        if (opts === void 0) {
          opts = {};
        }

        return getCachedLF(this.intl, opts);
      };

      _proto4.isEnglish = function isEnglish() {
        return this.locale === "en" || this.locale.toLowerCase() === "en-us" || new Intl.DateTimeFormat(this.intl).resolvedOptions().locale.startsWith("en-us");
      };

      _proto4.equals = function equals(other) {
        return this.locale === other.locale && this.numberingSystem === other.numberingSystem && this.outputCalendar === other.outputCalendar;
      };

      _createClass(Locale, [{
        key: "fastNumbers",
        get: function get() {
          if (this.fastNumbersCached == null) {
            this.fastNumbersCached = supportsFastNumbers(this);
          }

          return this.fastNumbersCached;
        }
      }]);

      return Locale;
    }();

    /*
     * This file handles parsing for well-specified formats. Here's how it works:
     * Two things go into parsing: a regex to match with and an extractor to take apart the groups in the match.
     * An extractor is just a function that takes a regex match array and returns a { year: ..., month: ... } object
     * parse() does the work of executing the regex and applying the extractor. It takes multiple regex/extractor pairs to try in sequence.
     * Extractors can take a "cursor" representing the offset in the match to look at. This makes it easy to combine extractors.
     * combineExtractors() does the work of combining them, keeping track of the cursor through multiple extractions.
     * Some extractions are super dumb and simpleParse and fromStrings help DRY them.
     */

    function combineRegexes() {
      for (var _len = arguments.length, regexes = new Array(_len), _key = 0; _key < _len; _key++) {
        regexes[_key] = arguments[_key];
      }

      var full = regexes.reduce(function (f, r) {
        return f + r.source;
      }, "");
      return RegExp("^" + full + "$");
    }

    function combineExtractors() {
      for (var _len2 = arguments.length, extractors = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        extractors[_key2] = arguments[_key2];
      }

      return function (m) {
        return extractors.reduce(function (_ref, ex) {
          var mergedVals = _ref[0],
              mergedZone = _ref[1],
              cursor = _ref[2];

          var _ex = ex(m, cursor),
              val = _ex[0],
              zone = _ex[1],
              next = _ex[2];

          return [_extends({}, mergedVals, val), mergedZone || zone, next];
        }, [{}, null, 1]).slice(0, 2);
      };
    }

    function parse(s) {
      if (s == null) {
        return [null, null];
      }

      for (var _len3 = arguments.length, patterns = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
        patterns[_key3 - 1] = arguments[_key3];
      }

      for (var _i = 0, _patterns = patterns; _i < _patterns.length; _i++) {
        var _patterns$_i = _patterns[_i],
            regex = _patterns$_i[0],
            extractor = _patterns$_i[1];
        var m = regex.exec(s);

        if (m) {
          return extractor(m);
        }
      }

      return [null, null];
    }

    function simpleParse() {
      for (var _len4 = arguments.length, keys = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        keys[_key4] = arguments[_key4];
      }

      return function (match, cursor) {
        var ret = {};
        var i;

        for (i = 0; i < keys.length; i++) {
          ret[keys[i]] = parseInteger(match[cursor + i]);
        }

        return [ret, null, cursor + i];
      };
    } // ISO and SQL parsing


    var offsetRegex = /(?:(Z)|([+-]\d\d)(?::?(\d\d))?)/,
        isoTimeBaseRegex = /(\d\d)(?::?(\d\d)(?::?(\d\d)(?:[.,](\d{1,30}))?)?)?/,
        isoTimeRegex = RegExp("" + isoTimeBaseRegex.source + offsetRegex.source + "?"),
        isoTimeExtensionRegex = RegExp("(?:T" + isoTimeRegex.source + ")?"),
        isoYmdRegex = /([+-]\d{6}|\d{4})(?:-?(\d\d)(?:-?(\d\d))?)?/,
        isoWeekRegex = /(\d{4})-?W(\d\d)(?:-?(\d))?/,
        isoOrdinalRegex = /(\d{4})-?(\d{3})/,
        extractISOWeekData = simpleParse("weekYear", "weekNumber", "weekDay"),
        extractISOOrdinalData = simpleParse("year", "ordinal"),
        sqlYmdRegex = /(\d{4})-(\d\d)-(\d\d)/,
        // dumbed-down version of the ISO one
    sqlTimeRegex = RegExp(isoTimeBaseRegex.source + " ?(?:" + offsetRegex.source + "|(" + ianaRegex.source + "))?"),
        sqlTimeExtensionRegex = RegExp("(?: " + sqlTimeRegex.source + ")?");

    function int(match, pos, fallback) {
      var m = match[pos];
      return isUndefined(m) ? fallback : parseInteger(m);
    }

    function extractISOYmd(match, cursor) {
      var item = {
        year: int(match, cursor),
        month: int(match, cursor + 1, 1),
        day: int(match, cursor + 2, 1)
      };
      return [item, null, cursor + 3];
    }

    function extractISOTime(match, cursor) {
      var item = {
        hours: int(match, cursor, 0),
        minutes: int(match, cursor + 1, 0),
        seconds: int(match, cursor + 2, 0),
        milliseconds: parseMillis(match[cursor + 3])
      };
      return [item, null, cursor + 4];
    }

    function extractISOOffset(match, cursor) {
      var local = !match[cursor] && !match[cursor + 1],
          fullOffset = signedOffset(match[cursor + 1], match[cursor + 2]),
          zone = local ? null : FixedOffsetZone.instance(fullOffset);
      return [{}, zone, cursor + 3];
    }

    function extractIANAZone(match, cursor) {
      var zone = match[cursor] ? IANAZone.create(match[cursor]) : null;
      return [{}, zone, cursor + 1];
    } // ISO time parsing


    var isoTimeOnly = RegExp("^T?" + isoTimeBaseRegex.source + "$"); // ISO duration parsing

    var isoDuration = /^-?P(?:(?:(-?\d{1,9}(?:\.\d{1,9})?)Y)?(?:(-?\d{1,9}(?:\.\d{1,9})?)M)?(?:(-?\d{1,9}(?:\.\d{1,9})?)W)?(?:(-?\d{1,9}(?:\.\d{1,9})?)D)?(?:T(?:(-?\d{1,9}(?:\.\d{1,9})?)H)?(?:(-?\d{1,9}(?:\.\d{1,9})?)M)?(?:(-?\d{1,20})(?:[.,](-?\d{1,9}))?S)?)?)$/;

    function extractISODuration(match) {
      var s = match[0],
          yearStr = match[1],
          monthStr = match[2],
          weekStr = match[3],
          dayStr = match[4],
          hourStr = match[5],
          minuteStr = match[6],
          secondStr = match[7],
          millisecondsStr = match[8];
      var hasNegativePrefix = s[0] === "-";
      var negativeSeconds = secondStr && secondStr[0] === "-";

      var maybeNegate = function maybeNegate(num, force) {
        if (force === void 0) {
          force = false;
        }

        return num !== undefined && (force || num && hasNegativePrefix) ? -num : num;
      };

      return [{
        years: maybeNegate(parseFloating(yearStr)),
        months: maybeNegate(parseFloating(monthStr)),
        weeks: maybeNegate(parseFloating(weekStr)),
        days: maybeNegate(parseFloating(dayStr)),
        hours: maybeNegate(parseFloating(hourStr)),
        minutes: maybeNegate(parseFloating(minuteStr)),
        seconds: maybeNegate(parseFloating(secondStr), secondStr === "-0"),
        milliseconds: maybeNegate(parseMillis(millisecondsStr), negativeSeconds)
      }];
    } // These are a little braindead. EDT *should* tell us that we're in, say, America/New_York
    // and not just that we're in -240 *right now*. But since I don't think these are used that often
    // I'm just going to ignore that


    var obsOffsets = {
      GMT: 0,
      EDT: -4 * 60,
      EST: -5 * 60,
      CDT: -5 * 60,
      CST: -6 * 60,
      MDT: -6 * 60,
      MST: -7 * 60,
      PDT: -7 * 60,
      PST: -8 * 60
    };

    function fromStrings(weekdayStr, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr) {
      var result = {
        year: yearStr.length === 2 ? untruncateYear(parseInteger(yearStr)) : parseInteger(yearStr),
        month: monthsShort.indexOf(monthStr) + 1,
        day: parseInteger(dayStr),
        hour: parseInteger(hourStr),
        minute: parseInteger(minuteStr)
      };
      if (secondStr) result.second = parseInteger(secondStr);

      if (weekdayStr) {
        result.weekday = weekdayStr.length > 3 ? weekdaysLong.indexOf(weekdayStr) + 1 : weekdaysShort.indexOf(weekdayStr) + 1;
      }

      return result;
    } // RFC 2822/5322


    var rfc2822 = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|(?:([+-]\d\d)(\d\d)))$/;

    function extractRFC2822(match) {
      var weekdayStr = match[1],
          dayStr = match[2],
          monthStr = match[3],
          yearStr = match[4],
          hourStr = match[5],
          minuteStr = match[6],
          secondStr = match[7],
          obsOffset = match[8],
          milOffset = match[9],
          offHourStr = match[10],
          offMinuteStr = match[11],
          result = fromStrings(weekdayStr, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr);
      var offset;

      if (obsOffset) {
        offset = obsOffsets[obsOffset];
      } else if (milOffset) {
        offset = 0;
      } else {
        offset = signedOffset(offHourStr, offMinuteStr);
      }

      return [result, new FixedOffsetZone(offset)];
    }

    function preprocessRFC2822(s) {
      // Remove comments and folding whitespace and replace multiple-spaces with a single space
      return s.replace(/\([^)]*\)|[\n\t]/g, " ").replace(/(\s\s+)/g, " ").trim();
    } // http date


    var rfc1123 = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), (\d\d) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4}) (\d\d):(\d\d):(\d\d) GMT$/,
        rfc850 = /^(Monday|Tuesday|Wedsday|Thursday|Friday|Saturday|Sunday), (\d\d)-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-(\d\d) (\d\d):(\d\d):(\d\d) GMT$/,
        ascii = /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ( \d|\d\d) (\d\d):(\d\d):(\d\d) (\d{4})$/;

    function extractRFC1123Or850(match) {
      var weekdayStr = match[1],
          dayStr = match[2],
          monthStr = match[3],
          yearStr = match[4],
          hourStr = match[5],
          minuteStr = match[6],
          secondStr = match[7],
          result = fromStrings(weekdayStr, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr);
      return [result, FixedOffsetZone.utcInstance];
    }

    function extractASCII(match) {
      var weekdayStr = match[1],
          monthStr = match[2],
          dayStr = match[3],
          hourStr = match[4],
          minuteStr = match[5],
          secondStr = match[6],
          yearStr = match[7],
          result = fromStrings(weekdayStr, yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr);
      return [result, FixedOffsetZone.utcInstance];
    }

    var isoYmdWithTimeExtensionRegex = combineRegexes(isoYmdRegex, isoTimeExtensionRegex);
    var isoWeekWithTimeExtensionRegex = combineRegexes(isoWeekRegex, isoTimeExtensionRegex);
    var isoOrdinalWithTimeExtensionRegex = combineRegexes(isoOrdinalRegex, isoTimeExtensionRegex);
    var isoTimeCombinedRegex = combineRegexes(isoTimeRegex);
    var extractISOYmdTimeAndOffset = combineExtractors(extractISOYmd, extractISOTime, extractISOOffset);
    var extractISOWeekTimeAndOffset = combineExtractors(extractISOWeekData, extractISOTime, extractISOOffset);
    var extractISOOrdinalDateAndTime = combineExtractors(extractISOOrdinalData, extractISOTime, extractISOOffset);
    var extractISOTimeAndOffset = combineExtractors(extractISOTime, extractISOOffset);
    /**
     * @private
     */

    function parseISODate(s) {
      return parse(s, [isoYmdWithTimeExtensionRegex, extractISOYmdTimeAndOffset], [isoWeekWithTimeExtensionRegex, extractISOWeekTimeAndOffset], [isoOrdinalWithTimeExtensionRegex, extractISOOrdinalDateAndTime], [isoTimeCombinedRegex, extractISOTimeAndOffset]);
    }
    function parseRFC2822Date(s) {
      return parse(preprocessRFC2822(s), [rfc2822, extractRFC2822]);
    }
    function parseHTTPDate(s) {
      return parse(s, [rfc1123, extractRFC1123Or850], [rfc850, extractRFC1123Or850], [ascii, extractASCII]);
    }
    function parseISODuration(s) {
      return parse(s, [isoDuration, extractISODuration]);
    }
    var extractISOTimeOnly = combineExtractors(extractISOTime);
    function parseISOTimeOnly(s) {
      return parse(s, [isoTimeOnly, extractISOTimeOnly]);
    }
    var sqlYmdWithTimeExtensionRegex = combineRegexes(sqlYmdRegex, sqlTimeExtensionRegex);
    var sqlTimeCombinedRegex = combineRegexes(sqlTimeRegex);
    var extractISOYmdTimeOffsetAndIANAZone = combineExtractors(extractISOYmd, extractISOTime, extractISOOffset, extractIANAZone);
    var extractISOTimeOffsetAndIANAZone = combineExtractors(extractISOTime, extractISOOffset, extractIANAZone);
    function parseSQL(s) {
      return parse(s, [sqlYmdWithTimeExtensionRegex, extractISOYmdTimeOffsetAndIANAZone], [sqlTimeCombinedRegex, extractISOTimeOffsetAndIANAZone]);
    }

    var INVALID$2 = "Invalid Duration"; // unit conversion constants

    var lowOrderMatrix = {
      weeks: {
        days: 7,
        hours: 7 * 24,
        minutes: 7 * 24 * 60,
        seconds: 7 * 24 * 60 * 60,
        milliseconds: 7 * 24 * 60 * 60 * 1000
      },
      days: {
        hours: 24,
        minutes: 24 * 60,
        seconds: 24 * 60 * 60,
        milliseconds: 24 * 60 * 60 * 1000
      },
      hours: {
        minutes: 60,
        seconds: 60 * 60,
        milliseconds: 60 * 60 * 1000
      },
      minutes: {
        seconds: 60,
        milliseconds: 60 * 1000
      },
      seconds: {
        milliseconds: 1000
      }
    },
        casualMatrix = _extends({
      years: {
        quarters: 4,
        months: 12,
        weeks: 52,
        days: 365,
        hours: 365 * 24,
        minutes: 365 * 24 * 60,
        seconds: 365 * 24 * 60 * 60,
        milliseconds: 365 * 24 * 60 * 60 * 1000
      },
      quarters: {
        months: 3,
        weeks: 13,
        days: 91,
        hours: 91 * 24,
        minutes: 91 * 24 * 60,
        seconds: 91 * 24 * 60 * 60,
        milliseconds: 91 * 24 * 60 * 60 * 1000
      },
      months: {
        weeks: 4,
        days: 30,
        hours: 30 * 24,
        minutes: 30 * 24 * 60,
        seconds: 30 * 24 * 60 * 60,
        milliseconds: 30 * 24 * 60 * 60 * 1000
      }
    }, lowOrderMatrix),
        daysInYearAccurate = 146097.0 / 400,
        daysInMonthAccurate = 146097.0 / 4800,
        accurateMatrix = _extends({
      years: {
        quarters: 4,
        months: 12,
        weeks: daysInYearAccurate / 7,
        days: daysInYearAccurate,
        hours: daysInYearAccurate * 24,
        minutes: daysInYearAccurate * 24 * 60,
        seconds: daysInYearAccurate * 24 * 60 * 60,
        milliseconds: daysInYearAccurate * 24 * 60 * 60 * 1000
      },
      quarters: {
        months: 3,
        weeks: daysInYearAccurate / 28,
        days: daysInYearAccurate / 4,
        hours: daysInYearAccurate * 24 / 4,
        minutes: daysInYearAccurate * 24 * 60 / 4,
        seconds: daysInYearAccurate * 24 * 60 * 60 / 4,
        milliseconds: daysInYearAccurate * 24 * 60 * 60 * 1000 / 4
      },
      months: {
        weeks: daysInMonthAccurate / 7,
        days: daysInMonthAccurate,
        hours: daysInMonthAccurate * 24,
        minutes: daysInMonthAccurate * 24 * 60,
        seconds: daysInMonthAccurate * 24 * 60 * 60,
        milliseconds: daysInMonthAccurate * 24 * 60 * 60 * 1000
      }
    }, lowOrderMatrix); // units ordered by size

    var orderedUnits$1 = ["years", "quarters", "months", "weeks", "days", "hours", "minutes", "seconds", "milliseconds"];
    var reverseUnits = orderedUnits$1.slice(0).reverse(); // clone really means "create another instance just like this one, but with these changes"

    function clone$1(dur, alts, clear) {
      if (clear === void 0) {
        clear = false;
      }

      // deep merge for vals
      var conf = {
        values: clear ? alts.values : _extends({}, dur.values, alts.values || {}),
        loc: dur.loc.clone(alts.loc),
        conversionAccuracy: alts.conversionAccuracy || dur.conversionAccuracy
      };
      return new Duration(conf);
    }

    function antiTrunc(n) {
      return n < 0 ? Math.floor(n) : Math.ceil(n);
    } // NB: mutates parameters


    function convert(matrix, fromMap, fromUnit, toMap, toUnit) {
      var conv = matrix[toUnit][fromUnit],
          raw = fromMap[fromUnit] / conv,
          sameSign = Math.sign(raw) === Math.sign(toMap[toUnit]),
          // ok, so this is wild, but see the matrix in the tests
      added = !sameSign && toMap[toUnit] !== 0 && Math.abs(raw) <= 1 ? antiTrunc(raw) : Math.trunc(raw);
      toMap[toUnit] += added;
      fromMap[fromUnit] -= added * conv;
    } // NB: mutates parameters


    function normalizeValues(matrix, vals) {
      reverseUnits.reduce(function (previous, current) {
        if (!isUndefined(vals[current])) {
          if (previous) {
            convert(matrix, vals, previous, vals, current);
          }

          return current;
        } else {
          return previous;
        }
      }, null);
    }
    /**
     * A Duration object represents a period of time, like "2 months" or "1 day, 1 hour". Conceptually, it's just a map of units to their quantities, accompanied by some additional configuration and methods for creating, parsing, interrogating, transforming, and formatting them. They can be used on their own or in conjunction with other Luxon types; for example, you can use {@link DateTime#plus} to add a Duration object to a DateTime, producing another DateTime.
     *
     * Here is a brief overview of commonly used methods and getters in Duration:
     *
     * * **Creation** To create a Duration, use {@link Duration#fromMillis}, {@link Duration#fromObject}, or {@link Duration#fromISO}.
     * * **Unit values** See the {@link Duration#years}, {@link Duration.months}, {@link Duration#weeks}, {@link Duration#days}, {@link Duration#hours}, {@link Duration#minutes}, {@link Duration#seconds}, {@link Duration#milliseconds} accessors.
     * * **Configuration** See  {@link Duration#locale} and {@link Duration#numberingSystem} accessors.
     * * **Transformation** To create new Durations out of old ones use {@link Duration#plus}, {@link Duration#minus}, {@link Duration#normalize}, {@link Duration#set}, {@link Duration#reconfigure}, {@link Duration#shiftTo}, and {@link Duration#negate}.
     * * **Output** To convert the Duration into other representations, see {@link Duration#as}, {@link Duration#toISO}, {@link Duration#toFormat}, and {@link Duration#toJSON}
     *
     * There's are more methods documented below. In addition, for more information on subtler topics like internationalization and validity, see the external documentation.
     */


    var Duration = /*#__PURE__*/function () {
      /**
       * @private
       */
      function Duration(config) {
        var accurate = config.conversionAccuracy === "longterm" || false;
        /**
         * @access private
         */

        this.values = config.values;
        /**
         * @access private
         */

        this.loc = config.loc || Locale.create();
        /**
         * @access private
         */

        this.conversionAccuracy = accurate ? "longterm" : "casual";
        /**
         * @access private
         */

        this.invalid = config.invalid || null;
        /**
         * @access private
         */

        this.matrix = accurate ? accurateMatrix : casualMatrix;
        /**
         * @access private
         */

        this.isLuxonDuration = true;
      }
      /**
       * Create Duration from a number of milliseconds.
       * @param {number} count of milliseconds
       * @param {Object} opts - options for parsing
       * @param {string} [opts.locale='en-US'] - the locale to use
       * @param {string} opts.numberingSystem - the numbering system to use
       * @param {string} [opts.conversionAccuracy='casual'] - the conversion system to use
       * @return {Duration}
       */


      Duration.fromMillis = function fromMillis(count, opts) {
        return Duration.fromObject({
          milliseconds: count
        }, opts);
      }
      /**
       * Create a Duration from a JavaScript object with keys like 'years' and 'hours'.
       * If this object is empty then a zero milliseconds duration is returned.
       * @param {Object} obj - the object to create the DateTime from
       * @param {number} obj.years
       * @param {number} obj.quarters
       * @param {number} obj.months
       * @param {number} obj.weeks
       * @param {number} obj.days
       * @param {number} obj.hours
       * @param {number} obj.minutes
       * @param {number} obj.seconds
       * @param {number} obj.milliseconds
       * @param {Object} [opts=[]] - options for creating this Duration
       * @param {string} [opts.locale='en-US'] - the locale to use
       * @param {string} opts.numberingSystem - the numbering system to use
       * @param {string} [opts.conversionAccuracy='casual'] - the conversion system to use
       * @return {Duration}
       */
      ;

      Duration.fromObject = function fromObject(obj, opts) {
        if (opts === void 0) {
          opts = {};
        }

        if (obj == null || typeof obj !== "object") {
          throw new InvalidArgumentError("Duration.fromObject: argument expected to be an object, got " + (obj === null ? "null" : typeof obj));
        }

        return new Duration({
          values: normalizeObject(obj, Duration.normalizeUnit),
          loc: Locale.fromObject(opts),
          conversionAccuracy: opts.conversionAccuracy
        });
      }
      /**
       * Create a Duration from DurationLike.
       *
       * @param {Object | number | Duration} durationLike
       * One of:
       * - object with keys like 'years' and 'hours'.
       * - number representing milliseconds
       * - Duration instance
       * @return {Duration}
       */
      ;

      Duration.fromDurationLike = function fromDurationLike(durationLike) {
        if (isNumber(durationLike)) {
          return Duration.fromMillis(durationLike);
        } else if (Duration.isDuration(durationLike)) {
          return durationLike;
        } else if (typeof durationLike === "object") {
          return Duration.fromObject(durationLike);
        } else {
          throw new InvalidArgumentError("Unknown duration argument " + durationLike + " of type " + typeof durationLike);
        }
      }
      /**
       * Create a Duration from an ISO 8601 duration string.
       * @param {string} text - text to parse
       * @param {Object} opts - options for parsing
       * @param {string} [opts.locale='en-US'] - the locale to use
       * @param {string} opts.numberingSystem - the numbering system to use
       * @param {string} [opts.conversionAccuracy='casual'] - the conversion system to use
       * @see https://en.wikipedia.org/wiki/ISO_8601#Durations
       * @example Duration.fromISO('P3Y6M1W4DT12H30M5S').toObject() //=> { years: 3, months: 6, weeks: 1, days: 4, hours: 12, minutes: 30, seconds: 5 }
       * @example Duration.fromISO('PT23H').toObject() //=> { hours: 23 }
       * @example Duration.fromISO('P5Y3M').toObject() //=> { years: 5, months: 3 }
       * @return {Duration}
       */
      ;

      Duration.fromISO = function fromISO(text, opts) {
        var _parseISODuration = parseISODuration(text),
            parsed = _parseISODuration[0];

        if (parsed) {
          return Duration.fromObject(parsed, opts);
        } else {
          return Duration.invalid("unparsable", "the input \"" + text + "\" can't be parsed as ISO 8601");
        }
      }
      /**
       * Create a Duration from an ISO 8601 time string.
       * @param {string} text - text to parse
       * @param {Object} opts - options for parsing
       * @param {string} [opts.locale='en-US'] - the locale to use
       * @param {string} opts.numberingSystem - the numbering system to use
       * @param {string} [opts.conversionAccuracy='casual'] - the conversion system to use
       * @see https://en.wikipedia.org/wiki/ISO_8601#Times
       * @example Duration.fromISOTime('11:22:33.444').toObject() //=> { hours: 11, minutes: 22, seconds: 33, milliseconds: 444 }
       * @example Duration.fromISOTime('11:00').toObject() //=> { hours: 11, minutes: 0, seconds: 0 }
       * @example Duration.fromISOTime('T11:00').toObject() //=> { hours: 11, minutes: 0, seconds: 0 }
       * @example Duration.fromISOTime('1100').toObject() //=> { hours: 11, minutes: 0, seconds: 0 }
       * @example Duration.fromISOTime('T1100').toObject() //=> { hours: 11, minutes: 0, seconds: 0 }
       * @return {Duration}
       */
      ;

      Duration.fromISOTime = function fromISOTime(text, opts) {
        var _parseISOTimeOnly = parseISOTimeOnly(text),
            parsed = _parseISOTimeOnly[0];

        if (parsed) {
          return Duration.fromObject(parsed, opts);
        } else {
          return Duration.invalid("unparsable", "the input \"" + text + "\" can't be parsed as ISO 8601");
        }
      }
      /**
       * Create an invalid Duration.
       * @param {string} reason - simple string of why this datetime is invalid. Should not contain parameters or anything else data-dependent
       * @param {string} [explanation=null] - longer explanation, may include parameters and other useful debugging information
       * @return {Duration}
       */
      ;

      Duration.invalid = function invalid(reason, explanation) {
        if (explanation === void 0) {
          explanation = null;
        }

        if (!reason) {
          throw new InvalidArgumentError("need to specify a reason the Duration is invalid");
        }

        var invalid = reason instanceof Invalid ? reason : new Invalid(reason, explanation);

        if (Settings.throwOnInvalid) {
          throw new InvalidDurationError(invalid);
        } else {
          return new Duration({
            invalid: invalid
          });
        }
      }
      /**
       * @private
       */
      ;

      Duration.normalizeUnit = function normalizeUnit(unit) {
        var normalized = {
          year: "years",
          years: "years",
          quarter: "quarters",
          quarters: "quarters",
          month: "months",
          months: "months",
          week: "weeks",
          weeks: "weeks",
          day: "days",
          days: "days",
          hour: "hours",
          hours: "hours",
          minute: "minutes",
          minutes: "minutes",
          second: "seconds",
          seconds: "seconds",
          millisecond: "milliseconds",
          milliseconds: "milliseconds"
        }[unit ? unit.toLowerCase() : unit];
        if (!normalized) throw new InvalidUnitError(unit);
        return normalized;
      }
      /**
       * Check if an object is a Duration. Works across context boundaries
       * @param {object} o
       * @return {boolean}
       */
      ;

      Duration.isDuration = function isDuration(o) {
        return o && o.isLuxonDuration || false;
      }
      /**
       * Get  the locale of a Duration, such 'en-GB'
       * @type {string}
       */
      ;

      var _proto = Duration.prototype;

      /**
       * Returns a string representation of this Duration formatted according to the specified format string. You may use these tokens:
       * * `S` for milliseconds
       * * `s` for seconds
       * * `m` for minutes
       * * `h` for hours
       * * `d` for days
       * * `M` for months
       * * `y` for years
       * Notes:
       * * Add padding by repeating the token, e.g. "yy" pads the years to two digits, "hhhh" pads the hours out to four digits
       * * The duration will be converted to the set of units in the format string using {@link Duration#shiftTo} and the Durations's conversion accuracy setting.
       * @param {string} fmt - the format string
       * @param {Object} opts - options
       * @param {boolean} [opts.floor=true] - floor numerical values
       * @example Duration.fromObject({ years: 1, days: 6, seconds: 2 }).toFormat("y d s") //=> "1 6 2"
       * @example Duration.fromObject({ years: 1, days: 6, seconds: 2 }).toFormat("yy dd sss") //=> "01 06 002"
       * @example Duration.fromObject({ years: 1, days: 6, seconds: 2 }).toFormat("M S") //=> "12 518402000"
       * @return {string}
       */
      _proto.toFormat = function toFormat(fmt, opts) {
        if (opts === void 0) {
          opts = {};
        }

        // reverse-compat since 1.2; we always round down now, never up, and we do it by default
        var fmtOpts = _extends({}, opts, {
          floor: opts.round !== false && opts.floor !== false
        });

        return this.isValid ? Formatter.create(this.loc, fmtOpts).formatDurationFromString(this, fmt) : INVALID$2;
      }
      /**
       * Returns a string representation of a Duration with all units included
       * To modify its behavior use the `listStyle` and any Intl.NumberFormat option, though `unitDisplay` is especially relevant. See {@link Intl.NumberFormat}.
       * @param opts - On option object to override the formatting. Accepts the same keys as the options parameter of the native `Int.NumberFormat` constructor, as well as `listStyle`.
       * @example
       * ```js
       * var dur = Duration.fromObject({ days: 1, hours: 5, minutes: 6 })
       * dur.toHuman() //=> '1 day, 5 hours, 6 minutes'
       * dur.toHuman({ listStyle: "long" }) //=> '1 day, 5 hours, and 6 minutes'
       * dur.toHuman({ unitDisplay: "short" }) //=> '1 day, 5 hr, 6 min'
       * ```
       */
      ;

      _proto.toHuman = function toHuman(opts) {
        var _this = this;

        if (opts === void 0) {
          opts = {};
        }

        var l = orderedUnits$1.map(function (unit) {
          var val = _this.values[unit];

          if (isUndefined(val)) {
            return null;
          }

          return _this.loc.numberFormatter(_extends({
            style: "unit",
            unitDisplay: "long"
          }, opts, {
            unit: unit.slice(0, -1)
          })).format(val);
        }).filter(function (n) {
          return n;
        });
        return this.loc.listFormatter(_extends({
          type: "conjunction",
          style: opts.listStyle || "narrow"
        }, opts)).format(l);
      }
      /**
       * Returns a JavaScript object with this Duration's values.
       * @example Duration.fromObject({ years: 1, days: 6, seconds: 2 }).toObject() //=> { years: 1, days: 6, seconds: 2 }
       * @return {Object}
       */
      ;

      _proto.toObject = function toObject() {
        if (!this.isValid) return {};
        return _extends({}, this.values);
      }
      /**
       * Returns an ISO 8601-compliant string representation of this Duration.
       * @see https://en.wikipedia.org/wiki/ISO_8601#Durations
       * @example Duration.fromObject({ years: 3, seconds: 45 }).toISO() //=> 'P3YT45S'
       * @example Duration.fromObject({ months: 4, seconds: 45 }).toISO() //=> 'P4MT45S'
       * @example Duration.fromObject({ months: 5 }).toISO() //=> 'P5M'
       * @example Duration.fromObject({ minutes: 5 }).toISO() //=> 'PT5M'
       * @example Duration.fromObject({ milliseconds: 6 }).toISO() //=> 'PT0.006S'
       * @return {string}
       */
      ;

      _proto.toISO = function toISO() {
        // we could use the formatter, but this is an easier way to get the minimum string
        if (!this.isValid) return null;
        var s = "P";
        if (this.years !== 0) s += this.years + "Y";
        if (this.months !== 0 || this.quarters !== 0) s += this.months + this.quarters * 3 + "M";
        if (this.weeks !== 0) s += this.weeks + "W";
        if (this.days !== 0) s += this.days + "D";
        if (this.hours !== 0 || this.minutes !== 0 || this.seconds !== 0 || this.milliseconds !== 0) s += "T";
        if (this.hours !== 0) s += this.hours + "H";
        if (this.minutes !== 0) s += this.minutes + "M";
        if (this.seconds !== 0 || this.milliseconds !== 0) // this will handle "floating point madness" by removing extra decimal places
          // https://stackoverflow.com/questions/588004/is-floating-point-math-broken
          s += roundTo(this.seconds + this.milliseconds / 1000, 3) + "S";
        if (s === "P") s += "T0S";
        return s;
      }
      /**
       * Returns an ISO 8601-compliant string representation of this Duration, formatted as a time of day.
       * Note that this will return null if the duration is invalid, negative, or equal to or greater than 24 hours.
       * @see https://en.wikipedia.org/wiki/ISO_8601#Times
       * @param {Object} opts - options
       * @param {boolean} [opts.suppressMilliseconds=false] - exclude milliseconds from the format if they're 0
       * @param {boolean} [opts.suppressSeconds=false] - exclude seconds from the format if they're 0
       * @param {boolean} [opts.includePrefix=false] - include the `T` prefix
       * @param {string} [opts.format='extended'] - choose between the basic and extended format
       * @example Duration.fromObject({ hours: 11 }).toISOTime() //=> '11:00:00.000'
       * @example Duration.fromObject({ hours: 11 }).toISOTime({ suppressMilliseconds: true }) //=> '11:00:00'
       * @example Duration.fromObject({ hours: 11 }).toISOTime({ suppressSeconds: true }) //=> '11:00'
       * @example Duration.fromObject({ hours: 11 }).toISOTime({ includePrefix: true }) //=> 'T11:00:00.000'
       * @example Duration.fromObject({ hours: 11 }).toISOTime({ format: 'basic' }) //=> '110000.000'
       * @return {string}
       */
      ;

      _proto.toISOTime = function toISOTime(opts) {
        if (opts === void 0) {
          opts = {};
        }

        if (!this.isValid) return null;
        var millis = this.toMillis();
        if (millis < 0 || millis >= 86400000) return null;
        opts = _extends({
          suppressMilliseconds: false,
          suppressSeconds: false,
          includePrefix: false,
          format: "extended"
        }, opts);
        var value = this.shiftTo("hours", "minutes", "seconds", "milliseconds");
        var fmt = opts.format === "basic" ? "hhmm" : "hh:mm";

        if (!opts.suppressSeconds || value.seconds !== 0 || value.milliseconds !== 0) {
          fmt += opts.format === "basic" ? "ss" : ":ss";

          if (!opts.suppressMilliseconds || value.milliseconds !== 0) {
            fmt += ".SSS";
          }
        }

        var str = value.toFormat(fmt);

        if (opts.includePrefix) {
          str = "T" + str;
        }

        return str;
      }
      /**
       * Returns an ISO 8601 representation of this Duration appropriate for use in JSON.
       * @return {string}
       */
      ;

      _proto.toJSON = function toJSON() {
        return this.toISO();
      }
      /**
       * Returns an ISO 8601 representation of this Duration appropriate for use in debugging.
       * @return {string}
       */
      ;

      _proto.toString = function toString() {
        return this.toISO();
      }
      /**
       * Returns an milliseconds value of this Duration.
       * @return {number}
       */
      ;

      _proto.toMillis = function toMillis() {
        return this.as("milliseconds");
      }
      /**
       * Returns an milliseconds value of this Duration. Alias of {@link toMillis}
       * @return {number}
       */
      ;

      _proto.valueOf = function valueOf() {
        return this.toMillis();
      }
      /**
       * Make this Duration longer by the specified amount. Return a newly-constructed Duration.
       * @param {Duration|Object|number} duration - The amount to add. Either a Luxon Duration, a number of milliseconds, the object argument to Duration.fromObject()
       * @return {Duration}
       */
      ;

      _proto.plus = function plus(duration) {
        if (!this.isValid) return this;
        var dur = Duration.fromDurationLike(duration),
            result = {};

        for (var _iterator = _createForOfIteratorHelperLoose(orderedUnits$1), _step; !(_step = _iterator()).done;) {
          var k = _step.value;

          if (hasOwnProperty(dur.values, k) || hasOwnProperty(this.values, k)) {
            result[k] = dur.get(k) + this.get(k);
          }
        }

        return clone$1(this, {
          values: result
        }, true);
      }
      /**
       * Make this Duration shorter by the specified amount. Return a newly-constructed Duration.
       * @param {Duration|Object|number} duration - The amount to subtract. Either a Luxon Duration, a number of milliseconds, the object argument to Duration.fromObject()
       * @return {Duration}
       */
      ;

      _proto.minus = function minus(duration) {
        if (!this.isValid) return this;
        var dur = Duration.fromDurationLike(duration);
        return this.plus(dur.negate());
      }
      /**
       * Scale this Duration by the specified amount. Return a newly-constructed Duration.
       * @param {function} fn - The function to apply to each unit. Arity is 1 or 2: the value of the unit and, optionally, the unit name. Must return a number.
       * @example Duration.fromObject({ hours: 1, minutes: 30 }).mapUnits(x => x * 2) //=> { hours: 2, minutes: 60 }
       * @example Duration.fromObject({ hours: 1, minutes: 30 }).mapUnits((x, u) => u === "hour" ? x * 2 : x) //=> { hours: 2, minutes: 30 }
       * @return {Duration}
       */
      ;

      _proto.mapUnits = function mapUnits(fn) {
        if (!this.isValid) return this;
        var result = {};

        for (var _i = 0, _Object$keys = Object.keys(this.values); _i < _Object$keys.length; _i++) {
          var k = _Object$keys[_i];
          result[k] = asNumber(fn(this.values[k], k));
        }

        return clone$1(this, {
          values: result
        }, true);
      }
      /**
       * Get the value of unit.
       * @param {string} unit - a unit such as 'minute' or 'day'
       * @example Duration.fromObject({years: 2, days: 3}).get('years') //=> 2
       * @example Duration.fromObject({years: 2, days: 3}).get('months') //=> 0
       * @example Duration.fromObject({years: 2, days: 3}).get('days') //=> 3
       * @return {number}
       */
      ;

      _proto.get = function get(unit) {
        return this[Duration.normalizeUnit(unit)];
      }
      /**
       * "Set" the values of specified units. Return a newly-constructed Duration.
       * @param {Object} values - a mapping of units to numbers
       * @example dur.set({ years: 2017 })
       * @example dur.set({ hours: 8, minutes: 30 })
       * @return {Duration}
       */
      ;

      _proto.set = function set(values) {
        if (!this.isValid) return this;

        var mixed = _extends({}, this.values, normalizeObject(values, Duration.normalizeUnit));

        return clone$1(this, {
          values: mixed
        });
      }
      /**
       * "Set" the locale and/or numberingSystem.  Returns a newly-constructed Duration.
       * @example dur.reconfigure({ locale: 'en-GB' })
       * @return {Duration}
       */
      ;

      _proto.reconfigure = function reconfigure(_temp) {
        var _ref = _temp === void 0 ? {} : _temp,
            locale = _ref.locale,
            numberingSystem = _ref.numberingSystem,
            conversionAccuracy = _ref.conversionAccuracy;

        var loc = this.loc.clone({
          locale: locale,
          numberingSystem: numberingSystem
        }),
            opts = {
          loc: loc
        };

        if (conversionAccuracy) {
          opts.conversionAccuracy = conversionAccuracy;
        }

        return clone$1(this, opts);
      }
      /**
       * Return the length of the duration in the specified unit.
       * @param {string} unit - a unit such as 'minutes' or 'days'
       * @example Duration.fromObject({years: 1}).as('days') //=> 365
       * @example Duration.fromObject({years: 1}).as('months') //=> 12
       * @example Duration.fromObject({hours: 60}).as('days') //=> 2.5
       * @return {number}
       */
      ;

      _proto.as = function as(unit) {
        return this.isValid ? this.shiftTo(unit).get(unit) : NaN;
      }
      /**
       * Reduce this Duration to its canonical representation in its current units.
       * @example Duration.fromObject({ years: 2, days: 5000 }).normalize().toObject() //=> { years: 15, days: 255 }
       * @example Duration.fromObject({ hours: 12, minutes: -45 }).normalize().toObject() //=> { hours: 11, minutes: 15 }
       * @return {Duration}
       */
      ;

      _proto.normalize = function normalize() {
        if (!this.isValid) return this;
        var vals = this.toObject();
        normalizeValues(this.matrix, vals);
        return clone$1(this, {
          values: vals
        }, true);
      }
      /**
       * Convert this Duration into its representation in a different set of units.
       * @example Duration.fromObject({ hours: 1, seconds: 30 }).shiftTo('minutes', 'milliseconds').toObject() //=> { minutes: 60, milliseconds: 30000 }
       * @return {Duration}
       */
      ;

      _proto.shiftTo = function shiftTo() {
        for (var _len = arguments.length, units = new Array(_len), _key = 0; _key < _len; _key++) {
          units[_key] = arguments[_key];
        }

        if (!this.isValid) return this;

        if (units.length === 0) {
          return this;
        }

        units = units.map(function (u) {
          return Duration.normalizeUnit(u);
        });
        var built = {},
            accumulated = {},
            vals = this.toObject();
        var lastUnit;

        for (var _iterator2 = _createForOfIteratorHelperLoose(orderedUnits$1), _step2; !(_step2 = _iterator2()).done;) {
          var k = _step2.value;

          if (units.indexOf(k) >= 0) {
            lastUnit = k;
            var own = 0; // anything we haven't boiled down yet should get boiled to this unit

            for (var ak in accumulated) {
              own += this.matrix[ak][k] * accumulated[ak];
              accumulated[ak] = 0;
            } // plus anything that's already in this unit


            if (isNumber(vals[k])) {
              own += vals[k];
            }

            var i = Math.trunc(own);
            built[k] = i;
            accumulated[k] = (own * 1000 - i * 1000) / 1000; // plus anything further down the chain that should be rolled up in to this

            for (var down in vals) {
              if (orderedUnits$1.indexOf(down) > orderedUnits$1.indexOf(k)) {
                convert(this.matrix, vals, down, built, k);
              }
            } // otherwise, keep it in the wings to boil it later

          } else if (isNumber(vals[k])) {
            accumulated[k] = vals[k];
          }
        } // anything leftover becomes the decimal for the last unit
        // lastUnit must be defined since units is not empty


        for (var key in accumulated) {
          if (accumulated[key] !== 0) {
            built[lastUnit] += key === lastUnit ? accumulated[key] : accumulated[key] / this.matrix[lastUnit][key];
          }
        }

        return clone$1(this, {
          values: built
        }, true).normalize();
      }
      /**
       * Return the negative of this Duration.
       * @example Duration.fromObject({ hours: 1, seconds: 30 }).negate().toObject() //=> { hours: -1, seconds: -30 }
       * @return {Duration}
       */
      ;

      _proto.negate = function negate() {
        if (!this.isValid) return this;
        var negated = {};

        for (var _i2 = 0, _Object$keys2 = Object.keys(this.values); _i2 < _Object$keys2.length; _i2++) {
          var k = _Object$keys2[_i2];
          negated[k] = this.values[k] === 0 ? 0 : -this.values[k];
        }

        return clone$1(this, {
          values: negated
        }, true);
      }
      /**
       * Get the years.
       * @type {number}
       */
      ;

      /**
       * Equality check
       * Two Durations are equal iff they have the same units and the same values for each unit.
       * @param {Duration} other
       * @return {boolean}
       */
      _proto.equals = function equals(other) {
        if (!this.isValid || !other.isValid) {
          return false;
        }

        if (!this.loc.equals(other.loc)) {
          return false;
        }

        function eq(v1, v2) {
          // Consider 0 and undefined as equal
          if (v1 === undefined || v1 === 0) return v2 === undefined || v2 === 0;
          return v1 === v2;
        }

        for (var _iterator3 = _createForOfIteratorHelperLoose(orderedUnits$1), _step3; !(_step3 = _iterator3()).done;) {
          var u = _step3.value;

          if (!eq(this.values[u], other.values[u])) {
            return false;
          }
        }

        return true;
      };

      _createClass(Duration, [{
        key: "locale",
        get: function get() {
          return this.isValid ? this.loc.locale : null;
        }
        /**
         * Get the numbering system of a Duration, such 'beng'. The numbering system is used when formatting the Duration
         *
         * @type {string}
         */

      }, {
        key: "numberingSystem",
        get: function get() {
          return this.isValid ? this.loc.numberingSystem : null;
        }
      }, {
        key: "years",
        get: function get() {
          return this.isValid ? this.values.years || 0 : NaN;
        }
        /**
         * Get the quarters.
         * @type {number}
         */

      }, {
        key: "quarters",
        get: function get() {
          return this.isValid ? this.values.quarters || 0 : NaN;
        }
        /**
         * Get the months.
         * @type {number}
         */

      }, {
        key: "months",
        get: function get() {
          return this.isValid ? this.values.months || 0 : NaN;
        }
        /**
         * Get the weeks
         * @type {number}
         */

      }, {
        key: "weeks",
        get: function get() {
          return this.isValid ? this.values.weeks || 0 : NaN;
        }
        /**
         * Get the days.
         * @type {number}
         */

      }, {
        key: "days",
        get: function get() {
          return this.isValid ? this.values.days || 0 : NaN;
        }
        /**
         * Get the hours.
         * @type {number}
         */

      }, {
        key: "hours",
        get: function get() {
          return this.isValid ? this.values.hours || 0 : NaN;
        }
        /**
         * Get the minutes.
         * @type {number}
         */

      }, {
        key: "minutes",
        get: function get() {
          return this.isValid ? this.values.minutes || 0 : NaN;
        }
        /**
         * Get the seconds.
         * @return {number}
         */

      }, {
        key: "seconds",
        get: function get() {
          return this.isValid ? this.values.seconds || 0 : NaN;
        }
        /**
         * Get the milliseconds.
         * @return {number}
         */

      }, {
        key: "milliseconds",
        get: function get() {
          return this.isValid ? this.values.milliseconds || 0 : NaN;
        }
        /**
         * Returns whether the Duration is invalid. Invalid durations are returned by diff operations
         * on invalid DateTimes or Intervals.
         * @return {boolean}
         */

      }, {
        key: "isValid",
        get: function get() {
          return this.invalid === null;
        }
        /**
         * Returns an error code if this Duration became invalid, or null if the Duration is valid
         * @return {string}
         */

      }, {
        key: "invalidReason",
        get: function get() {
          return this.invalid ? this.invalid.reason : null;
        }
        /**
         * Returns an explanation of why this Duration became invalid, or null if the Duration is valid
         * @type {string}
         */

      }, {
        key: "invalidExplanation",
        get: function get() {
          return this.invalid ? this.invalid.explanation : null;
        }
      }]);

      return Duration;
    }();

    var INVALID$1 = "Invalid Interval"; // checks if the start is equal to or before the end

    function validateStartEnd(start, end) {
      if (!start || !start.isValid) {
        return Interval.invalid("missing or invalid start");
      } else if (!end || !end.isValid) {
        return Interval.invalid("missing or invalid end");
      } else if (end < start) {
        return Interval.invalid("end before start", "The end of an interval must be after its start, but you had start=" + start.toISO() + " and end=" + end.toISO());
      } else {
        return null;
      }
    }
    /**
     * An Interval object represents a half-open interval of time, where each endpoint is a {@link DateTime}. Conceptually, it's a container for those two endpoints, accompanied by methods for creating, parsing, interrogating, comparing, transforming, and formatting them.
     *
     * Here is a brief overview of the most commonly used methods and getters in Interval:
     *
     * * **Creation** To create an Interval, use {@link Interval#fromDateTimes}, {@link Interval#after}, {@link Interval#before}, or {@link Interval#fromISO}.
     * * **Accessors** Use {@link Interval#start} and {@link Interval#end} to get the start and end.
     * * **Interrogation** To analyze the Interval, use {@link Interval#count}, {@link Interval#length}, {@link Interval#hasSame}, {@link Interval#contains}, {@link Interval#isAfter}, or {@link Interval#isBefore}.
     * * **Transformation** To create other Intervals out of this one, use {@link Interval#set}, {@link Interval#splitAt}, {@link Interval#splitBy}, {@link Interval#divideEqually}, {@link Interval#merge}, {@link Interval#xor}, {@link Interval#union}, {@link Interval#intersection}, or {@link Interval#difference}.
     * * **Comparison** To compare this Interval to another one, use {@link Interval#equals}, {@link Interval#overlaps}, {@link Interval#abutsStart}, {@link Interval#abutsEnd}, {@link Interval#engulfs}
     * * **Output** To convert the Interval into other representations, see {@link Interval#toString}, {@link Interval#toISO}, {@link Interval#toISODate}, {@link Interval#toISOTime}, {@link Interval#toFormat}, and {@link Interval#toDuration}.
     */


    var Interval = /*#__PURE__*/function () {
      /**
       * @private
       */
      function Interval(config) {
        /**
         * @access private
         */
        this.s = config.start;
        /**
         * @access private
         */

        this.e = config.end;
        /**
         * @access private
         */

        this.invalid = config.invalid || null;
        /**
         * @access private
         */

        this.isLuxonInterval = true;
      }
      /**
       * Create an invalid Interval.
       * @param {string} reason - simple string of why this Interval is invalid. Should not contain parameters or anything else data-dependent
       * @param {string} [explanation=null] - longer explanation, may include parameters and other useful debugging information
       * @return {Interval}
       */


      Interval.invalid = function invalid(reason, explanation) {
        if (explanation === void 0) {
          explanation = null;
        }

        if (!reason) {
          throw new InvalidArgumentError("need to specify a reason the Interval is invalid");
        }

        var invalid = reason instanceof Invalid ? reason : new Invalid(reason, explanation);

        if (Settings.throwOnInvalid) {
          throw new InvalidIntervalError(invalid);
        } else {
          return new Interval({
            invalid: invalid
          });
        }
      }
      /**
       * Create an Interval from a start DateTime and an end DateTime. Inclusive of the start but not the end.
       * @param {DateTime|Date|Object} start
       * @param {DateTime|Date|Object} end
       * @return {Interval}
       */
      ;

      Interval.fromDateTimes = function fromDateTimes(start, end) {
        var builtStart = friendlyDateTime(start),
            builtEnd = friendlyDateTime(end);
        var validateError = validateStartEnd(builtStart, builtEnd);

        if (validateError == null) {
          return new Interval({
            start: builtStart,
            end: builtEnd
          });
        } else {
          return validateError;
        }
      }
      /**
       * Create an Interval from a start DateTime and a Duration to extend to.
       * @param {DateTime|Date|Object} start
       * @param {Duration|Object|number} duration - the length of the Interval.
       * @return {Interval}
       */
      ;

      Interval.after = function after(start, duration) {
        var dur = Duration.fromDurationLike(duration),
            dt = friendlyDateTime(start);
        return Interval.fromDateTimes(dt, dt.plus(dur));
      }
      /**
       * Create an Interval from an end DateTime and a Duration to extend backwards to.
       * @param {DateTime|Date|Object} end
       * @param {Duration|Object|number} duration - the length of the Interval.
       * @return {Interval}
       */
      ;

      Interval.before = function before(end, duration) {
        var dur = Duration.fromDurationLike(duration),
            dt = friendlyDateTime(end);
        return Interval.fromDateTimes(dt.minus(dur), dt);
      }
      /**
       * Create an Interval from an ISO 8601 string.
       * Accepts `<start>/<end>`, `<start>/<duration>`, and `<duration>/<end>` formats.
       * @param {string} text - the ISO string to parse
       * @param {Object} [opts] - options to pass {@link DateTime#fromISO} and optionally {@link Duration#fromISO}
       * @see https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
       * @return {Interval}
       */
      ;

      Interval.fromISO = function fromISO(text, opts) {
        var _split = (text || "").split("/", 2),
            s = _split[0],
            e = _split[1];

        if (s && e) {
          var start, startIsValid;

          try {
            start = DateTime.fromISO(s, opts);
            startIsValid = start.isValid;
          } catch (e) {
            startIsValid = false;
          }

          var end, endIsValid;

          try {
            end = DateTime.fromISO(e, opts);
            endIsValid = end.isValid;
          } catch (e) {
            endIsValid = false;
          }

          if (startIsValid && endIsValid) {
            return Interval.fromDateTimes(start, end);
          }

          if (startIsValid) {
            var dur = Duration.fromISO(e, opts);

            if (dur.isValid) {
              return Interval.after(start, dur);
            }
          } else if (endIsValid) {
            var _dur = Duration.fromISO(s, opts);

            if (_dur.isValid) {
              return Interval.before(end, _dur);
            }
          }
        }

        return Interval.invalid("unparsable", "the input \"" + text + "\" can't be parsed as ISO 8601");
      }
      /**
       * Check if an object is an Interval. Works across context boundaries
       * @param {object} o
       * @return {boolean}
       */
      ;

      Interval.isInterval = function isInterval(o) {
        return o && o.isLuxonInterval || false;
      }
      /**
       * Returns the start of the Interval
       * @type {DateTime}
       */
      ;

      var _proto = Interval.prototype;

      /**
       * Returns the length of the Interval in the specified unit.
       * @param {string} unit - the unit (such as 'hours' or 'days') to return the length in.
       * @return {number}
       */
      _proto.length = function length(unit) {
        if (unit === void 0) {
          unit = "milliseconds";
        }

        return this.isValid ? this.toDuration.apply(this, [unit]).get(unit) : NaN;
      }
      /**
       * Returns the count of minutes, hours, days, months, or years included in the Interval, even in part.
       * Unlike {@link Interval#length} this counts sections of the calendar, not periods of time, e.g. specifying 'day'
       * asks 'what dates are included in this interval?', not 'how many days long is this interval?'
       * @param {string} [unit='milliseconds'] - the unit of time to count.
       * @return {number}
       */
      ;

      _proto.count = function count(unit) {
        if (unit === void 0) {
          unit = "milliseconds";
        }

        if (!this.isValid) return NaN;
        var start = this.start.startOf(unit),
            end = this.end.startOf(unit);
        return Math.floor(end.diff(start, unit).get(unit)) + 1;
      }
      /**
       * Returns whether this Interval's start and end are both in the same unit of time
       * @param {string} unit - the unit of time to check sameness on
       * @return {boolean}
       */
      ;

      _proto.hasSame = function hasSame(unit) {
        return this.isValid ? this.isEmpty() || this.e.minus(1).hasSame(this.s, unit) : false;
      }
      /**
       * Return whether this Interval has the same start and end DateTimes.
       * @return {boolean}
       */
      ;

      _proto.isEmpty = function isEmpty() {
        return this.s.valueOf() === this.e.valueOf();
      }
      /**
       * Return whether this Interval's start is after the specified DateTime.
       * @param {DateTime} dateTime
       * @return {boolean}
       */
      ;

      _proto.isAfter = function isAfter(dateTime) {
        if (!this.isValid) return false;
        return this.s > dateTime;
      }
      /**
       * Return whether this Interval's end is before the specified DateTime.
       * @param {DateTime} dateTime
       * @return {boolean}
       */
      ;

      _proto.isBefore = function isBefore(dateTime) {
        if (!this.isValid) return false;
        return this.e <= dateTime;
      }
      /**
       * Return whether this Interval contains the specified DateTime.
       * @param {DateTime} dateTime
       * @return {boolean}
       */
      ;

      _proto.contains = function contains(dateTime) {
        if (!this.isValid) return false;
        return this.s <= dateTime && this.e > dateTime;
      }
      /**
       * "Sets" the start and/or end dates. Returns a newly-constructed Interval.
       * @param {Object} values - the values to set
       * @param {DateTime} values.start - the starting DateTime
       * @param {DateTime} values.end - the ending DateTime
       * @return {Interval}
       */
      ;

      _proto.set = function set(_temp) {
        var _ref = _temp === void 0 ? {} : _temp,
            start = _ref.start,
            end = _ref.end;

        if (!this.isValid) return this;
        return Interval.fromDateTimes(start || this.s, end || this.e);
      }
      /**
       * Split this Interval at each of the specified DateTimes
       * @param {...DateTime} dateTimes - the unit of time to count.
       * @return {Array}
       */
      ;

      _proto.splitAt = function splitAt() {
        var _this = this;

        if (!this.isValid) return [];

        for (var _len = arguments.length, dateTimes = new Array(_len), _key = 0; _key < _len; _key++) {
          dateTimes[_key] = arguments[_key];
        }

        var sorted = dateTimes.map(friendlyDateTime).filter(function (d) {
          return _this.contains(d);
        }).sort(),
            results = [];
        var s = this.s,
            i = 0;

        while (s < this.e) {
          var added = sorted[i] || this.e,
              next = +added > +this.e ? this.e : added;
          results.push(Interval.fromDateTimes(s, next));
          s = next;
          i += 1;
        }

        return results;
      }
      /**
       * Split this Interval into smaller Intervals, each of the specified length.
       * Left over time is grouped into a smaller interval
       * @param {Duration|Object|number} duration - The length of each resulting interval.
       * @return {Array}
       */
      ;

      _proto.splitBy = function splitBy(duration) {
        var dur = Duration.fromDurationLike(duration);

        if (!this.isValid || !dur.isValid || dur.as("milliseconds") === 0) {
          return [];
        }

        var s = this.s,
            idx = 1,
            next;
        var results = [];

        while (s < this.e) {
          var added = this.start.plus(dur.mapUnits(function (x) {
            return x * idx;
          }));
          next = +added > +this.e ? this.e : added;
          results.push(Interval.fromDateTimes(s, next));
          s = next;
          idx += 1;
        }

        return results;
      }
      /**
       * Split this Interval into the specified number of smaller intervals.
       * @param {number} numberOfParts - The number of Intervals to divide the Interval into.
       * @return {Array}
       */
      ;

      _proto.divideEqually = function divideEqually(numberOfParts) {
        if (!this.isValid) return [];
        return this.splitBy(this.length() / numberOfParts).slice(0, numberOfParts);
      }
      /**
       * Return whether this Interval overlaps with the specified Interval
       * @param {Interval} other
       * @return {boolean}
       */
      ;

      _proto.overlaps = function overlaps(other) {
        return this.e > other.s && this.s < other.e;
      }
      /**
       * Return whether this Interval's end is adjacent to the specified Interval's start.
       * @param {Interval} other
       * @return {boolean}
       */
      ;

      _proto.abutsStart = function abutsStart(other) {
        if (!this.isValid) return false;
        return +this.e === +other.s;
      }
      /**
       * Return whether this Interval's start is adjacent to the specified Interval's end.
       * @param {Interval} other
       * @return {boolean}
       */
      ;

      _proto.abutsEnd = function abutsEnd(other) {
        if (!this.isValid) return false;
        return +other.e === +this.s;
      }
      /**
       * Return whether this Interval engulfs the start and end of the specified Interval.
       * @param {Interval} other
       * @return {boolean}
       */
      ;

      _proto.engulfs = function engulfs(other) {
        if (!this.isValid) return false;
        return this.s <= other.s && this.e >= other.e;
      }
      /**
       * Return whether this Interval has the same start and end as the specified Interval.
       * @param {Interval} other
       * @return {boolean}
       */
      ;

      _proto.equals = function equals(other) {
        if (!this.isValid || !other.isValid) {
          return false;
        }

        return this.s.equals(other.s) && this.e.equals(other.e);
      }
      /**
       * Return an Interval representing the intersection of this Interval and the specified Interval.
       * Specifically, the resulting Interval has the maximum start time and the minimum end time of the two Intervals.
       * Returns null if the intersection is empty, meaning, the intervals don't intersect.
       * @param {Interval} other
       * @return {Interval}
       */
      ;

      _proto.intersection = function intersection(other) {
        if (!this.isValid) return this;
        var s = this.s > other.s ? this.s : other.s,
            e = this.e < other.e ? this.e : other.e;

        if (s >= e) {
          return null;
        } else {
          return Interval.fromDateTimes(s, e);
        }
      }
      /**
       * Return an Interval representing the union of this Interval and the specified Interval.
       * Specifically, the resulting Interval has the minimum start time and the maximum end time of the two Intervals.
       * @param {Interval} other
       * @return {Interval}
       */
      ;

      _proto.union = function union(other) {
        if (!this.isValid) return this;
        var s = this.s < other.s ? this.s : other.s,
            e = this.e > other.e ? this.e : other.e;
        return Interval.fromDateTimes(s, e);
      }
      /**
       * Merge an array of Intervals into a equivalent minimal set of Intervals.
       * Combines overlapping and adjacent Intervals.
       * @param {Array} intervals
       * @return {Array}
       */
      ;

      Interval.merge = function merge(intervals) {
        var _intervals$sort$reduc = intervals.sort(function (a, b) {
          return a.s - b.s;
        }).reduce(function (_ref2, item) {
          var sofar = _ref2[0],
              current = _ref2[1];

          if (!current) {
            return [sofar, item];
          } else if (current.overlaps(item) || current.abutsStart(item)) {
            return [sofar, current.union(item)];
          } else {
            return [sofar.concat([current]), item];
          }
        }, [[], null]),
            found = _intervals$sort$reduc[0],
            final = _intervals$sort$reduc[1];

        if (final) {
          found.push(final);
        }

        return found;
      }
      /**
       * Return an array of Intervals representing the spans of time that only appear in one of the specified Intervals.
       * @param {Array} intervals
       * @return {Array}
       */
      ;

      Interval.xor = function xor(intervals) {
        var _Array$prototype;

        var start = null,
            currentCount = 0;

        var results = [],
            ends = intervals.map(function (i) {
          return [{
            time: i.s,
            type: "s"
          }, {
            time: i.e,
            type: "e"
          }];
        }),
            flattened = (_Array$prototype = Array.prototype).concat.apply(_Array$prototype, ends),
            arr = flattened.sort(function (a, b) {
          return a.time - b.time;
        });

        for (var _iterator = _createForOfIteratorHelperLoose(arr), _step; !(_step = _iterator()).done;) {
          var i = _step.value;
          currentCount += i.type === "s" ? 1 : -1;

          if (currentCount === 1) {
            start = i.time;
          } else {
            if (start && +start !== +i.time) {
              results.push(Interval.fromDateTimes(start, i.time));
            }

            start = null;
          }
        }

        return Interval.merge(results);
      }
      /**
       * Return an Interval representing the span of time in this Interval that doesn't overlap with any of the specified Intervals.
       * @param {...Interval} intervals
       * @return {Array}
       */
      ;

      _proto.difference = function difference() {
        var _this2 = this;

        for (var _len2 = arguments.length, intervals = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          intervals[_key2] = arguments[_key2];
        }

        return Interval.xor([this].concat(intervals)).map(function (i) {
          return _this2.intersection(i);
        }).filter(function (i) {
          return i && !i.isEmpty();
        });
      }
      /**
       * Returns a string representation of this Interval appropriate for debugging.
       * @return {string}
       */
      ;

      _proto.toString = function toString() {
        if (!this.isValid) return INVALID$1;
        return "[" + this.s.toISO() + " \u2013 " + this.e.toISO() + ")";
      }
      /**
       * Returns an ISO 8601-compliant string representation of this Interval.
       * @see https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
       * @param {Object} opts - The same options as {@link DateTime#toISO}
       * @return {string}
       */
      ;

      _proto.toISO = function toISO(opts) {
        if (!this.isValid) return INVALID$1;
        return this.s.toISO(opts) + "/" + this.e.toISO(opts);
      }
      /**
       * Returns an ISO 8601-compliant string representation of date of this Interval.
       * The time components are ignored.
       * @see https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
       * @return {string}
       */
      ;

      _proto.toISODate = function toISODate() {
        if (!this.isValid) return INVALID$1;
        return this.s.toISODate() + "/" + this.e.toISODate();
      }
      /**
       * Returns an ISO 8601-compliant string representation of time of this Interval.
       * The date components are ignored.
       * @see https://en.wikipedia.org/wiki/ISO_8601#Time_intervals
       * @param {Object} opts - The same options as {@link DateTime#toISO}
       * @return {string}
       */
      ;

      _proto.toISOTime = function toISOTime(opts) {
        if (!this.isValid) return INVALID$1;
        return this.s.toISOTime(opts) + "/" + this.e.toISOTime(opts);
      }
      /**
       * Returns a string representation of this Interval formatted according to the specified format string.
       * @param {string} dateFormat - the format string. This string formats the start and end time. See {@link DateTime#toFormat} for details.
       * @param {Object} opts - options
       * @param {string} [opts.separator =  ' – '] - a separator to place between the start and end representations
       * @return {string}
       */
      ;

      _proto.toFormat = function toFormat(dateFormat, _temp2) {
        var _ref3 = _temp2 === void 0 ? {} : _temp2,
            _ref3$separator = _ref3.separator,
            separator = _ref3$separator === void 0 ? " – " : _ref3$separator;

        if (!this.isValid) return INVALID$1;
        return "" + this.s.toFormat(dateFormat) + separator + this.e.toFormat(dateFormat);
      }
      /**
       * Return a Duration representing the time spanned by this interval.
       * @param {string|string[]} [unit=['milliseconds']] - the unit or units (such as 'hours' or 'days') to include in the duration.
       * @param {Object} opts - options that affect the creation of the Duration
       * @param {string} [opts.conversionAccuracy='casual'] - the conversion system to use
       * @example Interval.fromDateTimes(dt1, dt2).toDuration().toObject() //=> { milliseconds: 88489257 }
       * @example Interval.fromDateTimes(dt1, dt2).toDuration('days').toObject() //=> { days: 1.0241812152777778 }
       * @example Interval.fromDateTimes(dt1, dt2).toDuration(['hours', 'minutes']).toObject() //=> { hours: 24, minutes: 34.82095 }
       * @example Interval.fromDateTimes(dt1, dt2).toDuration(['hours', 'minutes', 'seconds']).toObject() //=> { hours: 24, minutes: 34, seconds: 49.257 }
       * @example Interval.fromDateTimes(dt1, dt2).toDuration('seconds').toObject() //=> { seconds: 88489.257 }
       * @return {Duration}
       */
      ;

      _proto.toDuration = function toDuration(unit, opts) {
        if (!this.isValid) {
          return Duration.invalid(this.invalidReason);
        }

        return this.e.diff(this.s, unit, opts);
      }
      /**
       * Run mapFn on the interval start and end, returning a new Interval from the resulting DateTimes
       * @param {function} mapFn
       * @return {Interval}
       * @example Interval.fromDateTimes(dt1, dt2).mapEndpoints(endpoint => endpoint.toUTC())
       * @example Interval.fromDateTimes(dt1, dt2).mapEndpoints(endpoint => endpoint.plus({ hours: 2 }))
       */
      ;

      _proto.mapEndpoints = function mapEndpoints(mapFn) {
        return Interval.fromDateTimes(mapFn(this.s), mapFn(this.e));
      };

      _createClass(Interval, [{
        key: "start",
        get: function get() {
          return this.isValid ? this.s : null;
        }
        /**
         * Returns the end of the Interval
         * @type {DateTime}
         */

      }, {
        key: "end",
        get: function get() {
          return this.isValid ? this.e : null;
        }
        /**
         * Returns whether this Interval's end is at least its start, meaning that the Interval isn't 'backwards'.
         * @type {boolean}
         */

      }, {
        key: "isValid",
        get: function get() {
          return this.invalidReason === null;
        }
        /**
         * Returns an error code if this Interval is invalid, or null if the Interval is valid
         * @type {string}
         */

      }, {
        key: "invalidReason",
        get: function get() {
          return this.invalid ? this.invalid.reason : null;
        }
        /**
         * Returns an explanation of why this Interval became invalid, or null if the Interval is valid
         * @type {string}
         */

      }, {
        key: "invalidExplanation",
        get: function get() {
          return this.invalid ? this.invalid.explanation : null;
        }
      }]);

      return Interval;
    }();

    /**
     * The Info class contains static methods for retrieving general time and date related data. For example, it has methods for finding out if a time zone has a DST, for listing the months in any supported locale, and for discovering which of Luxon features are available in the current environment.
     */

    var Info = /*#__PURE__*/function () {
      function Info() {}

      /**
       * Return whether the specified zone contains a DST.
       * @param {string|Zone} [zone='local'] - Zone to check. Defaults to the environment's local zone.
       * @return {boolean}
       */
      Info.hasDST = function hasDST(zone) {
        if (zone === void 0) {
          zone = Settings.defaultZone;
        }

        var proto = DateTime.now().setZone(zone).set({
          month: 12
        });
        return !zone.isUniversal && proto.offset !== proto.set({
          month: 6
        }).offset;
      }
      /**
       * Return whether the specified zone is a valid IANA specifier.
       * @param {string} zone - Zone to check
       * @return {boolean}
       */
      ;

      Info.isValidIANAZone = function isValidIANAZone(zone) {
        return IANAZone.isValidZone(zone);
      }
      /**
       * Converts the input into a {@link Zone} instance.
       *
       * * If `input` is already a Zone instance, it is returned unchanged.
       * * If `input` is a string containing a valid time zone name, a Zone instance
       *   with that name is returned.
       * * If `input` is a string that doesn't refer to a known time zone, a Zone
       *   instance with {@link Zone#isValid} == false is returned.
       * * If `input is a number, a Zone instance with the specified fixed offset
       *   in minutes is returned.
       * * If `input` is `null` or `undefined`, the default zone is returned.
       * @param {string|Zone|number} [input] - the value to be converted
       * @return {Zone}
       */
      ;

      Info.normalizeZone = function normalizeZone$1(input) {
        return normalizeZone(input, Settings.defaultZone);
      }
      /**
       * Return an array of standalone month names.
       * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
       * @param {string} [length='long'] - the length of the month representation, such as "numeric", "2-digit", "narrow", "short", "long"
       * @param {Object} opts - options
       * @param {string} [opts.locale] - the locale code
       * @param {string} [opts.numberingSystem=null] - the numbering system
       * @param {string} [opts.locObj=null] - an existing locale object to use
       * @param {string} [opts.outputCalendar='gregory'] - the calendar
       * @example Info.months()[0] //=> 'January'
       * @example Info.months('short')[0] //=> 'Jan'
       * @example Info.months('numeric')[0] //=> '1'
       * @example Info.months('short', { locale: 'fr-CA' } )[0] //=> 'janv.'
       * @example Info.months('numeric', { locale: 'ar' })[0] //=> '١'
       * @example Info.months('long', { outputCalendar: 'islamic' })[0] //=> 'Rabiʻ I'
       * @return {Array}
       */
      ;

      Info.months = function months(length, _temp) {
        if (length === void 0) {
          length = "long";
        }

        var _ref = _temp === void 0 ? {} : _temp,
            _ref$locale = _ref.locale,
            locale = _ref$locale === void 0 ? null : _ref$locale,
            _ref$numberingSystem = _ref.numberingSystem,
            numberingSystem = _ref$numberingSystem === void 0 ? null : _ref$numberingSystem,
            _ref$locObj = _ref.locObj,
            locObj = _ref$locObj === void 0 ? null : _ref$locObj,
            _ref$outputCalendar = _ref.outputCalendar,
            outputCalendar = _ref$outputCalendar === void 0 ? "gregory" : _ref$outputCalendar;

        return (locObj || Locale.create(locale, numberingSystem, outputCalendar)).months(length);
      }
      /**
       * Return an array of format month names.
       * Format months differ from standalone months in that they're meant to appear next to the day of the month. In some languages, that
       * changes the string.
       * See {@link Info#months}
       * @param {string} [length='long'] - the length of the month representation, such as "numeric", "2-digit", "narrow", "short", "long"
       * @param {Object} opts - options
       * @param {string} [opts.locale] - the locale code
       * @param {string} [opts.numberingSystem=null] - the numbering system
       * @param {string} [opts.locObj=null] - an existing locale object to use
       * @param {string} [opts.outputCalendar='gregory'] - the calendar
       * @return {Array}
       */
      ;

      Info.monthsFormat = function monthsFormat(length, _temp2) {
        if (length === void 0) {
          length = "long";
        }

        var _ref2 = _temp2 === void 0 ? {} : _temp2,
            _ref2$locale = _ref2.locale,
            locale = _ref2$locale === void 0 ? null : _ref2$locale,
            _ref2$numberingSystem = _ref2.numberingSystem,
            numberingSystem = _ref2$numberingSystem === void 0 ? null : _ref2$numberingSystem,
            _ref2$locObj = _ref2.locObj,
            locObj = _ref2$locObj === void 0 ? null : _ref2$locObj,
            _ref2$outputCalendar = _ref2.outputCalendar,
            outputCalendar = _ref2$outputCalendar === void 0 ? "gregory" : _ref2$outputCalendar;

        return (locObj || Locale.create(locale, numberingSystem, outputCalendar)).months(length, true);
      }
      /**
       * Return an array of standalone week names.
       * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
       * @param {string} [length='long'] - the length of the weekday representation, such as "narrow", "short", "long".
       * @param {Object} opts - options
       * @param {string} [opts.locale] - the locale code
       * @param {string} [opts.numberingSystem=null] - the numbering system
       * @param {string} [opts.locObj=null] - an existing locale object to use
       * @example Info.weekdays()[0] //=> 'Monday'
       * @example Info.weekdays('short')[0] //=> 'Mon'
       * @example Info.weekdays('short', { locale: 'fr-CA' })[0] //=> 'lun.'
       * @example Info.weekdays('short', { locale: 'ar' })[0] //=> 'الاثنين'
       * @return {Array}
       */
      ;

      Info.weekdays = function weekdays(length, _temp3) {
        if (length === void 0) {
          length = "long";
        }

        var _ref3 = _temp3 === void 0 ? {} : _temp3,
            _ref3$locale = _ref3.locale,
            locale = _ref3$locale === void 0 ? null : _ref3$locale,
            _ref3$numberingSystem = _ref3.numberingSystem,
            numberingSystem = _ref3$numberingSystem === void 0 ? null : _ref3$numberingSystem,
            _ref3$locObj = _ref3.locObj,
            locObj = _ref3$locObj === void 0 ? null : _ref3$locObj;

        return (locObj || Locale.create(locale, numberingSystem, null)).weekdays(length);
      }
      /**
       * Return an array of format week names.
       * Format weekdays differ from standalone weekdays in that they're meant to appear next to more date information. In some languages, that
       * changes the string.
       * See {@link Info#weekdays}
       * @param {string} [length='long'] - the length of the month representation, such as "narrow", "short", "long".
       * @param {Object} opts - options
       * @param {string} [opts.locale=null] - the locale code
       * @param {string} [opts.numberingSystem=null] - the numbering system
       * @param {string} [opts.locObj=null] - an existing locale object to use
       * @return {Array}
       */
      ;

      Info.weekdaysFormat = function weekdaysFormat(length, _temp4) {
        if (length === void 0) {
          length = "long";
        }

        var _ref4 = _temp4 === void 0 ? {} : _temp4,
            _ref4$locale = _ref4.locale,
            locale = _ref4$locale === void 0 ? null : _ref4$locale,
            _ref4$numberingSystem = _ref4.numberingSystem,
            numberingSystem = _ref4$numberingSystem === void 0 ? null : _ref4$numberingSystem,
            _ref4$locObj = _ref4.locObj,
            locObj = _ref4$locObj === void 0 ? null : _ref4$locObj;

        return (locObj || Locale.create(locale, numberingSystem, null)).weekdays(length, true);
      }
      /**
       * Return an array of meridiems.
       * @param {Object} opts - options
       * @param {string} [opts.locale] - the locale code
       * @example Info.meridiems() //=> [ 'AM', 'PM' ]
       * @example Info.meridiems({ locale: 'my' }) //=> [ 'နံနက်', 'ညနေ' ]
       * @return {Array}
       */
      ;

      Info.meridiems = function meridiems(_temp5) {
        var _ref5 = _temp5 === void 0 ? {} : _temp5,
            _ref5$locale = _ref5.locale,
            locale = _ref5$locale === void 0 ? null : _ref5$locale;

        return Locale.create(locale).meridiems();
      }
      /**
       * Return an array of eras, such as ['BC', 'AD']. The locale can be specified, but the calendar system is always Gregorian.
       * @param {string} [length='short'] - the length of the era representation, such as "short" or "long".
       * @param {Object} opts - options
       * @param {string} [opts.locale] - the locale code
       * @example Info.eras() //=> [ 'BC', 'AD' ]
       * @example Info.eras('long') //=> [ 'Before Christ', 'Anno Domini' ]
       * @example Info.eras('long', { locale: 'fr' }) //=> [ 'avant Jésus-Christ', 'après Jésus-Christ' ]
       * @return {Array}
       */
      ;

      Info.eras = function eras(length, _temp6) {
        if (length === void 0) {
          length = "short";
        }

        var _ref6 = _temp6 === void 0 ? {} : _temp6,
            _ref6$locale = _ref6.locale,
            locale = _ref6$locale === void 0 ? null : _ref6$locale;

        return Locale.create(locale, null, "gregory").eras(length);
      }
      /**
       * Return the set of available features in this environment.
       * Some features of Luxon are not available in all environments. For example, on older browsers, relative time formatting support is not available. Use this function to figure out if that's the case.
       * Keys:
       * * `relative`: whether this environment supports relative time formatting
       * @example Info.features() //=> { relative: false }
       * @return {Object}
       */
      ;

      Info.features = function features() {
        return {
          relative: hasRelative()
        };
      };

      return Info;
    }();

    function dayDiff(earlier, later) {
      var utcDayStart = function utcDayStart(dt) {
        return dt.toUTC(0, {
          keepLocalTime: true
        }).startOf("day").valueOf();
      },
          ms = utcDayStart(later) - utcDayStart(earlier);

      return Math.floor(Duration.fromMillis(ms).as("days"));
    }

    function highOrderDiffs(cursor, later, units) {
      var differs = [["years", function (a, b) {
        return b.year - a.year;
      }], ["quarters", function (a, b) {
        return b.quarter - a.quarter;
      }], ["months", function (a, b) {
        return b.month - a.month + (b.year - a.year) * 12;
      }], ["weeks", function (a, b) {
        var days = dayDiff(a, b);
        return (days - days % 7) / 7;
      }], ["days", dayDiff]];
      var results = {};
      var lowestOrder, highWater;

      for (var _i = 0, _differs = differs; _i < _differs.length; _i++) {
        var _differs$_i = _differs[_i],
            unit = _differs$_i[0],
            differ = _differs$_i[1];

        if (units.indexOf(unit) >= 0) {
          var _cursor$plus;

          lowestOrder = unit;
          var delta = differ(cursor, later);
          highWater = cursor.plus((_cursor$plus = {}, _cursor$plus[unit] = delta, _cursor$plus));

          if (highWater > later) {
            var _cursor$plus2;

            cursor = cursor.plus((_cursor$plus2 = {}, _cursor$plus2[unit] = delta - 1, _cursor$plus2));
            delta -= 1;
          } else {
            cursor = highWater;
          }

          results[unit] = delta;
        }
      }

      return [cursor, results, highWater, lowestOrder];
    }

    function _diff (earlier, later, units, opts) {
      var _highOrderDiffs = highOrderDiffs(earlier, later, units),
          cursor = _highOrderDiffs[0],
          results = _highOrderDiffs[1],
          highWater = _highOrderDiffs[2],
          lowestOrder = _highOrderDiffs[3];

      var remainingMillis = later - cursor;
      var lowerOrderUnits = units.filter(function (u) {
        return ["hours", "minutes", "seconds", "milliseconds"].indexOf(u) >= 0;
      });

      if (lowerOrderUnits.length === 0) {
        if (highWater < later) {
          var _cursor$plus3;

          highWater = cursor.plus((_cursor$plus3 = {}, _cursor$plus3[lowestOrder] = 1, _cursor$plus3));
        }

        if (highWater !== cursor) {
          results[lowestOrder] = (results[lowestOrder] || 0) + remainingMillis / (highWater - cursor);
        }
      }

      var duration = Duration.fromObject(results, opts);

      if (lowerOrderUnits.length > 0) {
        var _Duration$fromMillis;

        return (_Duration$fromMillis = Duration.fromMillis(remainingMillis, opts)).shiftTo.apply(_Duration$fromMillis, lowerOrderUnits).plus(duration);
      } else {
        return duration;
      }
    }

    var numberingSystems = {
      arab: "[\u0660-\u0669]",
      arabext: "[\u06F0-\u06F9]",
      bali: "[\u1B50-\u1B59]",
      beng: "[\u09E6-\u09EF]",
      deva: "[\u0966-\u096F]",
      fullwide: "[\uFF10-\uFF19]",
      gujr: "[\u0AE6-\u0AEF]",
      hanidec: "[〇|一|二|三|四|五|六|七|八|九]",
      khmr: "[\u17E0-\u17E9]",
      knda: "[\u0CE6-\u0CEF]",
      laoo: "[\u0ED0-\u0ED9]",
      limb: "[\u1946-\u194F]",
      mlym: "[\u0D66-\u0D6F]",
      mong: "[\u1810-\u1819]",
      mymr: "[\u1040-\u1049]",
      orya: "[\u0B66-\u0B6F]",
      tamldec: "[\u0BE6-\u0BEF]",
      telu: "[\u0C66-\u0C6F]",
      thai: "[\u0E50-\u0E59]",
      tibt: "[\u0F20-\u0F29]",
      latn: "\\d"
    };
    var numberingSystemsUTF16 = {
      arab: [1632, 1641],
      arabext: [1776, 1785],
      bali: [6992, 7001],
      beng: [2534, 2543],
      deva: [2406, 2415],
      fullwide: [65296, 65303],
      gujr: [2790, 2799],
      khmr: [6112, 6121],
      knda: [3302, 3311],
      laoo: [3792, 3801],
      limb: [6470, 6479],
      mlym: [3430, 3439],
      mong: [6160, 6169],
      mymr: [4160, 4169],
      orya: [2918, 2927],
      tamldec: [3046, 3055],
      telu: [3174, 3183],
      thai: [3664, 3673],
      tibt: [3872, 3881]
    };
    var hanidecChars = numberingSystems.hanidec.replace(/[\[|\]]/g, "").split("");
    function parseDigits(str) {
      var value = parseInt(str, 10);

      if (isNaN(value)) {
        value = "";

        for (var i = 0; i < str.length; i++) {
          var code = str.charCodeAt(i);

          if (str[i].search(numberingSystems.hanidec) !== -1) {
            value += hanidecChars.indexOf(str[i]);
          } else {
            for (var key in numberingSystemsUTF16) {
              var _numberingSystemsUTF = numberingSystemsUTF16[key],
                  min = _numberingSystemsUTF[0],
                  max = _numberingSystemsUTF[1];

              if (code >= min && code <= max) {
                value += code - min;
              }
            }
          }
        }

        return parseInt(value, 10);
      } else {
        return value;
      }
    }
    function digitRegex(_ref, append) {
      var numberingSystem = _ref.numberingSystem;

      if (append === void 0) {
        append = "";
      }

      return new RegExp("" + numberingSystems[numberingSystem || "latn"] + append);
    }

    var MISSING_FTP = "missing Intl.DateTimeFormat.formatToParts support";

    function intUnit(regex, post) {
      if (post === void 0) {
        post = function post(i) {
          return i;
        };
      }

      return {
        regex: regex,
        deser: function deser(_ref) {
          var s = _ref[0];
          return post(parseDigits(s));
        }
      };
    }

    var NBSP = String.fromCharCode(160);
    var spaceOrNBSP = "( |" + NBSP + ")";
    var spaceOrNBSPRegExp = new RegExp(spaceOrNBSP, "g");

    function fixListRegex(s) {
      // make dots optional and also make them literal
      // make space and non breakable space characters interchangeable
      return s.replace(/\./g, "\\.?").replace(spaceOrNBSPRegExp, spaceOrNBSP);
    }

    function stripInsensitivities(s) {
      return s.replace(/\./g, "") // ignore dots that were made optional
      .replace(spaceOrNBSPRegExp, " ") // interchange space and nbsp
      .toLowerCase();
    }

    function oneOf(strings, startIndex) {
      if (strings === null) {
        return null;
      } else {
        return {
          regex: RegExp(strings.map(fixListRegex).join("|")),
          deser: function deser(_ref2) {
            var s = _ref2[0];
            return strings.findIndex(function (i) {
              return stripInsensitivities(s) === stripInsensitivities(i);
            }) + startIndex;
          }
        };
      }
    }

    function offset(regex, groups) {
      return {
        regex: regex,
        deser: function deser(_ref3) {
          var h = _ref3[1],
              m = _ref3[2];
          return signedOffset(h, m);
        },
        groups: groups
      };
    }

    function simple(regex) {
      return {
        regex: regex,
        deser: function deser(_ref4) {
          var s = _ref4[0];
          return s;
        }
      };
    }

    function escapeToken(value) {
      return value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&");
    }

    function unitForToken(token, loc) {
      var one = digitRegex(loc),
          two = digitRegex(loc, "{2}"),
          three = digitRegex(loc, "{3}"),
          four = digitRegex(loc, "{4}"),
          six = digitRegex(loc, "{6}"),
          oneOrTwo = digitRegex(loc, "{1,2}"),
          oneToThree = digitRegex(loc, "{1,3}"),
          oneToSix = digitRegex(loc, "{1,6}"),
          oneToNine = digitRegex(loc, "{1,9}"),
          twoToFour = digitRegex(loc, "{2,4}"),
          fourToSix = digitRegex(loc, "{4,6}"),
          literal = function literal(t) {
        return {
          regex: RegExp(escapeToken(t.val)),
          deser: function deser(_ref5) {
            var s = _ref5[0];
            return s;
          },
          literal: true
        };
      },
          unitate = function unitate(t) {
        if (token.literal) {
          return literal(t);
        }

        switch (t.val) {
          // era
          case "G":
            return oneOf(loc.eras("short", false), 0);

          case "GG":
            return oneOf(loc.eras("long", false), 0);
          // years

          case "y":
            return intUnit(oneToSix);

          case "yy":
            return intUnit(twoToFour, untruncateYear);

          case "yyyy":
            return intUnit(four);

          case "yyyyy":
            return intUnit(fourToSix);

          case "yyyyyy":
            return intUnit(six);
          // months

          case "M":
            return intUnit(oneOrTwo);

          case "MM":
            return intUnit(two);

          case "MMM":
            return oneOf(loc.months("short", true, false), 1);

          case "MMMM":
            return oneOf(loc.months("long", true, false), 1);

          case "L":
            return intUnit(oneOrTwo);

          case "LL":
            return intUnit(two);

          case "LLL":
            return oneOf(loc.months("short", false, false), 1);

          case "LLLL":
            return oneOf(loc.months("long", false, false), 1);
          // dates

          case "d":
            return intUnit(oneOrTwo);

          case "dd":
            return intUnit(two);
          // ordinals

          case "o":
            return intUnit(oneToThree);

          case "ooo":
            return intUnit(three);
          // time

          case "HH":
            return intUnit(two);

          case "H":
            return intUnit(oneOrTwo);

          case "hh":
            return intUnit(two);

          case "h":
            return intUnit(oneOrTwo);

          case "mm":
            return intUnit(two);

          case "m":
            return intUnit(oneOrTwo);

          case "q":
            return intUnit(oneOrTwo);

          case "qq":
            return intUnit(two);

          case "s":
            return intUnit(oneOrTwo);

          case "ss":
            return intUnit(two);

          case "S":
            return intUnit(oneToThree);

          case "SSS":
            return intUnit(three);

          case "u":
            return simple(oneToNine);

          case "uu":
            return simple(oneOrTwo);

          case "uuu":
            return intUnit(one);
          // meridiem

          case "a":
            return oneOf(loc.meridiems(), 0);
          // weekYear (k)

          case "kkkk":
            return intUnit(four);

          case "kk":
            return intUnit(twoToFour, untruncateYear);
          // weekNumber (W)

          case "W":
            return intUnit(oneOrTwo);

          case "WW":
            return intUnit(two);
          // weekdays

          case "E":
          case "c":
            return intUnit(one);

          case "EEE":
            return oneOf(loc.weekdays("short", false, false), 1);

          case "EEEE":
            return oneOf(loc.weekdays("long", false, false), 1);

          case "ccc":
            return oneOf(loc.weekdays("short", true, false), 1);

          case "cccc":
            return oneOf(loc.weekdays("long", true, false), 1);
          // offset/zone

          case "Z":
          case "ZZ":
            return offset(new RegExp("([+-]" + oneOrTwo.source + ")(?::(" + two.source + "))?"), 2);

          case "ZZZ":
            return offset(new RegExp("([+-]" + oneOrTwo.source + ")(" + two.source + ")?"), 2);
          // we don't support ZZZZ (PST) or ZZZZZ (Pacific Standard Time) in parsing
          // because we don't have any way to figure out what they are

          case "z":
            return simple(/[a-z_+-/]{1,256}?/i);

          default:
            return literal(t);
        }
      };

      var unit = unitate(token) || {
        invalidReason: MISSING_FTP
      };
      unit.token = token;
      return unit;
    }

    var partTypeStyleToTokenVal = {
      year: {
        "2-digit": "yy",
        numeric: "yyyyy"
      },
      month: {
        numeric: "M",
        "2-digit": "MM",
        short: "MMM",
        long: "MMMM"
      },
      day: {
        numeric: "d",
        "2-digit": "dd"
      },
      weekday: {
        short: "EEE",
        long: "EEEE"
      },
      dayperiod: "a",
      dayPeriod: "a",
      hour: {
        numeric: "h",
        "2-digit": "hh"
      },
      minute: {
        numeric: "m",
        "2-digit": "mm"
      },
      second: {
        numeric: "s",
        "2-digit": "ss"
      }
    };

    function tokenForPart(part, locale, formatOpts) {
      var type = part.type,
          value = part.value;

      if (type === "literal") {
        return {
          literal: true,
          val: value
        };
      }

      var style = formatOpts[type];
      var val = partTypeStyleToTokenVal[type];

      if (typeof val === "object") {
        val = val[style];
      }

      if (val) {
        return {
          literal: false,
          val: val
        };
      }

      return undefined;
    }

    function buildRegex(units) {
      var re = units.map(function (u) {
        return u.regex;
      }).reduce(function (f, r) {
        return f + "(" + r.source + ")";
      }, "");
      return ["^" + re + "$", units];
    }

    function match(input, regex, handlers) {
      var matches = input.match(regex);

      if (matches) {
        var all = {};
        var matchIndex = 1;

        for (var i in handlers) {
          if (hasOwnProperty(handlers, i)) {
            var h = handlers[i],
                groups = h.groups ? h.groups + 1 : 1;

            if (!h.literal && h.token) {
              all[h.token.val[0]] = h.deser(matches.slice(matchIndex, matchIndex + groups));
            }

            matchIndex += groups;
          }
        }

        return [matches, all];
      } else {
        return [matches, {}];
      }
    }

    function dateTimeFromMatches(matches) {
      var toField = function toField(token) {
        switch (token) {
          case "S":
            return "millisecond";

          case "s":
            return "second";

          case "m":
            return "minute";

          case "h":
          case "H":
            return "hour";

          case "d":
            return "day";

          case "o":
            return "ordinal";

          case "L":
          case "M":
            return "month";

          case "y":
            return "year";

          case "E":
          case "c":
            return "weekday";

          case "W":
            return "weekNumber";

          case "k":
            return "weekYear";

          case "q":
            return "quarter";

          default:
            return null;
        }
      };

      var zone = null;
      var specificOffset;

      if (!isUndefined(matches.z)) {
        zone = IANAZone.create(matches.z);
      }

      if (!isUndefined(matches.Z)) {
        if (!zone) {
          zone = new FixedOffsetZone(matches.Z);
        }

        specificOffset = matches.Z;
      }

      if (!isUndefined(matches.q)) {
        matches.M = (matches.q - 1) * 3 + 1;
      }

      if (!isUndefined(matches.h)) {
        if (matches.h < 12 && matches.a === 1) {
          matches.h += 12;
        } else if (matches.h === 12 && matches.a === 0) {
          matches.h = 0;
        }
      }

      if (matches.G === 0 && matches.y) {
        matches.y = -matches.y;
      }

      if (!isUndefined(matches.u)) {
        matches.S = parseMillis(matches.u);
      }

      var vals = Object.keys(matches).reduce(function (r, k) {
        var f = toField(k);

        if (f) {
          r[f] = matches[k];
        }

        return r;
      }, {});
      return [vals, zone, specificOffset];
    }

    var dummyDateTimeCache = null;

    function getDummyDateTime() {
      if (!dummyDateTimeCache) {
        dummyDateTimeCache = DateTime.fromMillis(1555555555555);
      }

      return dummyDateTimeCache;
    }

    function maybeExpandMacroToken(token, locale) {
      if (token.literal) {
        return token;
      }

      var formatOpts = Formatter.macroTokenToFormatOpts(token.val);

      if (!formatOpts) {
        return token;
      }

      var formatter = Formatter.create(locale, formatOpts);
      var parts = formatter.formatDateTimeParts(getDummyDateTime());
      var tokens = parts.map(function (p) {
        return tokenForPart(p, locale, formatOpts);
      });

      if (tokens.includes(undefined)) {
        return token;
      }

      return tokens;
    }

    function expandMacroTokens(tokens, locale) {
      var _Array$prototype;

      return (_Array$prototype = Array.prototype).concat.apply(_Array$prototype, tokens.map(function (t) {
        return maybeExpandMacroToken(t, locale);
      }));
    }
    /**
     * @private
     */


    function explainFromTokens(locale, input, format) {
      var tokens = expandMacroTokens(Formatter.parseFormat(format), locale),
          units = tokens.map(function (t) {
        return unitForToken(t, locale);
      }),
          disqualifyingUnit = units.find(function (t) {
        return t.invalidReason;
      });

      if (disqualifyingUnit) {
        return {
          input: input,
          tokens: tokens,
          invalidReason: disqualifyingUnit.invalidReason
        };
      } else {
        var _buildRegex = buildRegex(units),
            regexString = _buildRegex[0],
            handlers = _buildRegex[1],
            regex = RegExp(regexString, "i"),
            _match = match(input, regex, handlers),
            rawMatches = _match[0],
            matches = _match[1],
            _ref6 = matches ? dateTimeFromMatches(matches) : [null, null, undefined],
            result = _ref6[0],
            zone = _ref6[1],
            specificOffset = _ref6[2];

        if (hasOwnProperty(matches, "a") && hasOwnProperty(matches, "H")) {
          throw new ConflictingSpecificationError("Can't include meridiem when specifying 24-hour format");
        }

        return {
          input: input,
          tokens: tokens,
          regex: regex,
          rawMatches: rawMatches,
          matches: matches,
          result: result,
          zone: zone,
          specificOffset: specificOffset
        };
      }
    }
    function parseFromTokens(locale, input, format) {
      var _explainFromTokens = explainFromTokens(locale, input, format),
          result = _explainFromTokens.result,
          zone = _explainFromTokens.zone,
          specificOffset = _explainFromTokens.specificOffset,
          invalidReason = _explainFromTokens.invalidReason;

      return [result, zone, specificOffset, invalidReason];
    }

    var nonLeapLadder = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
        leapLadder = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];

    function unitOutOfRange(unit, value) {
      return new Invalid("unit out of range", "you specified " + value + " (of type " + typeof value + ") as a " + unit + ", which is invalid");
    }

    function dayOfWeek(year, month, day) {
      var js = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
      return js === 0 ? 7 : js;
    }

    function computeOrdinal(year, month, day) {
      return day + (isLeapYear(year) ? leapLadder : nonLeapLadder)[month - 1];
    }

    function uncomputeOrdinal(year, ordinal) {
      var table = isLeapYear(year) ? leapLadder : nonLeapLadder,
          month0 = table.findIndex(function (i) {
        return i < ordinal;
      }),
          day = ordinal - table[month0];
      return {
        month: month0 + 1,
        day: day
      };
    }
    /**
     * @private
     */


    function gregorianToWeek(gregObj) {
      var year = gregObj.year,
          month = gregObj.month,
          day = gregObj.day,
          ordinal = computeOrdinal(year, month, day),
          weekday = dayOfWeek(year, month, day);
      var weekNumber = Math.floor((ordinal - weekday + 10) / 7),
          weekYear;

      if (weekNumber < 1) {
        weekYear = year - 1;
        weekNumber = weeksInWeekYear(weekYear);
      } else if (weekNumber > weeksInWeekYear(year)) {
        weekYear = year + 1;
        weekNumber = 1;
      } else {
        weekYear = year;
      }

      return _extends({
        weekYear: weekYear,
        weekNumber: weekNumber,
        weekday: weekday
      }, timeObject(gregObj));
    }
    function weekToGregorian(weekData) {
      var weekYear = weekData.weekYear,
          weekNumber = weekData.weekNumber,
          weekday = weekData.weekday,
          weekdayOfJan4 = dayOfWeek(weekYear, 1, 4),
          yearInDays = daysInYear(weekYear);
      var ordinal = weekNumber * 7 + weekday - weekdayOfJan4 - 3,
          year;

      if (ordinal < 1) {
        year = weekYear - 1;
        ordinal += daysInYear(year);
      } else if (ordinal > yearInDays) {
        year = weekYear + 1;
        ordinal -= daysInYear(weekYear);
      } else {
        year = weekYear;
      }

      var _uncomputeOrdinal = uncomputeOrdinal(year, ordinal),
          month = _uncomputeOrdinal.month,
          day = _uncomputeOrdinal.day;

      return _extends({
        year: year,
        month: month,
        day: day
      }, timeObject(weekData));
    }
    function gregorianToOrdinal(gregData) {
      var year = gregData.year,
          month = gregData.month,
          day = gregData.day;
      var ordinal = computeOrdinal(year, month, day);
      return _extends({
        year: year,
        ordinal: ordinal
      }, timeObject(gregData));
    }
    function ordinalToGregorian(ordinalData) {
      var year = ordinalData.year,
          ordinal = ordinalData.ordinal;

      var _uncomputeOrdinal2 = uncomputeOrdinal(year, ordinal),
          month = _uncomputeOrdinal2.month,
          day = _uncomputeOrdinal2.day;

      return _extends({
        year: year,
        month: month,
        day: day
      }, timeObject(ordinalData));
    }
    function hasInvalidWeekData(obj) {
      var validYear = isInteger(obj.weekYear),
          validWeek = integerBetween(obj.weekNumber, 1, weeksInWeekYear(obj.weekYear)),
          validWeekday = integerBetween(obj.weekday, 1, 7);

      if (!validYear) {
        return unitOutOfRange("weekYear", obj.weekYear);
      } else if (!validWeek) {
        return unitOutOfRange("week", obj.week);
      } else if (!validWeekday) {
        return unitOutOfRange("weekday", obj.weekday);
      } else return false;
    }
    function hasInvalidOrdinalData(obj) {
      var validYear = isInteger(obj.year),
          validOrdinal = integerBetween(obj.ordinal, 1, daysInYear(obj.year));

      if (!validYear) {
        return unitOutOfRange("year", obj.year);
      } else if (!validOrdinal) {
        return unitOutOfRange("ordinal", obj.ordinal);
      } else return false;
    }
    function hasInvalidGregorianData(obj) {
      var validYear = isInteger(obj.year),
          validMonth = integerBetween(obj.month, 1, 12),
          validDay = integerBetween(obj.day, 1, daysInMonth(obj.year, obj.month));

      if (!validYear) {
        return unitOutOfRange("year", obj.year);
      } else if (!validMonth) {
        return unitOutOfRange("month", obj.month);
      } else if (!validDay) {
        return unitOutOfRange("day", obj.day);
      } else return false;
    }
    function hasInvalidTimeData(obj) {
      var hour = obj.hour,
          minute = obj.minute,
          second = obj.second,
          millisecond = obj.millisecond;
      var validHour = integerBetween(hour, 0, 23) || hour === 24 && minute === 0 && second === 0 && millisecond === 0,
          validMinute = integerBetween(minute, 0, 59),
          validSecond = integerBetween(second, 0, 59),
          validMillisecond = integerBetween(millisecond, 0, 999);

      if (!validHour) {
        return unitOutOfRange("hour", hour);
      } else if (!validMinute) {
        return unitOutOfRange("minute", minute);
      } else if (!validSecond) {
        return unitOutOfRange("second", second);
      } else if (!validMillisecond) {
        return unitOutOfRange("millisecond", millisecond);
      } else return false;
    }

    var INVALID = "Invalid DateTime";
    var MAX_DATE = 8.64e15;

    function unsupportedZone(zone) {
      return new Invalid("unsupported zone", "the zone \"" + zone.name + "\" is not supported");
    } // we cache week data on the DT object and this intermediates the cache


    function possiblyCachedWeekData(dt) {
      if (dt.weekData === null) {
        dt.weekData = gregorianToWeek(dt.c);
      }

      return dt.weekData;
    } // clone really means, "make a new object with these modifications". all "setters" really use this
    // to create a new object while only changing some of the properties


    function clone(inst, alts) {
      var current = {
        ts: inst.ts,
        zone: inst.zone,
        c: inst.c,
        o: inst.o,
        loc: inst.loc,
        invalid: inst.invalid
      };
      return new DateTime(_extends({}, current, alts, {
        old: current
      }));
    } // find the right offset a given local time. The o input is our guess, which determines which
    // offset we'll pick in ambiguous cases (e.g. there are two 3 AMs b/c Fallback DST)


    function fixOffset(localTS, o, tz) {
      // Our UTC time is just a guess because our offset is just a guess
      var utcGuess = localTS - o * 60 * 1000; // Test whether the zone matches the offset for this ts

      var o2 = tz.offset(utcGuess); // If so, offset didn't change and we're done

      if (o === o2) {
        return [utcGuess, o];
      } // If not, change the ts by the difference in the offset


      utcGuess -= (o2 - o) * 60 * 1000; // If that gives us the local time we want, we're done

      var o3 = tz.offset(utcGuess);

      if (o2 === o3) {
        return [utcGuess, o2];
      } // If it's different, we're in a hole time. The offset has changed, but the we don't adjust the time


      return [localTS - Math.min(o2, o3) * 60 * 1000, Math.max(o2, o3)];
    } // convert an epoch timestamp into a calendar object with the given offset


    function tsToObj(ts, offset) {
      ts += offset * 60 * 1000;
      var d = new Date(ts);
      return {
        year: d.getUTCFullYear(),
        month: d.getUTCMonth() + 1,
        day: d.getUTCDate(),
        hour: d.getUTCHours(),
        minute: d.getUTCMinutes(),
        second: d.getUTCSeconds(),
        millisecond: d.getUTCMilliseconds()
      };
    } // convert a calendar object to a epoch timestamp


    function objToTS(obj, offset, zone) {
      return fixOffset(objToLocalTS(obj), offset, zone);
    } // create a new DT instance by adding a duration, adjusting for DSTs


    function adjustTime(inst, dur) {
      var oPre = inst.o,
          year = inst.c.year + Math.trunc(dur.years),
          month = inst.c.month + Math.trunc(dur.months) + Math.trunc(dur.quarters) * 3,
          c = _extends({}, inst.c, {
        year: year,
        month: month,
        day: Math.min(inst.c.day, daysInMonth(year, month)) + Math.trunc(dur.days) + Math.trunc(dur.weeks) * 7
      }),
          millisToAdd = Duration.fromObject({
        years: dur.years - Math.trunc(dur.years),
        quarters: dur.quarters - Math.trunc(dur.quarters),
        months: dur.months - Math.trunc(dur.months),
        weeks: dur.weeks - Math.trunc(dur.weeks),
        days: dur.days - Math.trunc(dur.days),
        hours: dur.hours,
        minutes: dur.minutes,
        seconds: dur.seconds,
        milliseconds: dur.milliseconds
      }).as("milliseconds"),
          localTS = objToLocalTS(c);

      var _fixOffset = fixOffset(localTS, oPre, inst.zone),
          ts = _fixOffset[0],
          o = _fixOffset[1];

      if (millisToAdd !== 0) {
        ts += millisToAdd; // that could have changed the offset by going over a DST, but we want to keep the ts the same

        o = inst.zone.offset(ts);
      }

      return {
        ts: ts,
        o: o
      };
    } // helper useful in turning the results of parsing into real dates
    // by handling the zone options


    function parseDataToDateTime(parsed, parsedZone, opts, format, text, specificOffset) {
      var setZone = opts.setZone,
          zone = opts.zone;

      if (parsed && Object.keys(parsed).length !== 0) {
        var interpretationZone = parsedZone || zone,
            inst = DateTime.fromObject(parsed, _extends({}, opts, {
          zone: interpretationZone,
          specificOffset: specificOffset
        }));
        return setZone ? inst : inst.setZone(zone);
      } else {
        return DateTime.invalid(new Invalid("unparsable", "the input \"" + text + "\" can't be parsed as " + format));
      }
    } // if you want to output a technical format (e.g. RFC 2822), this helper
    // helps handle the details


    function toTechFormat(dt, format, allowZ) {
      if (allowZ === void 0) {
        allowZ = true;
      }

      return dt.isValid ? Formatter.create(Locale.create("en-US"), {
        allowZ: allowZ,
        forceSimple: true
      }).formatDateTimeFromString(dt, format) : null;
    }

    function _toISODate(o, extended) {
      var longFormat = o.c.year > 9999 || o.c.year < 0;
      var c = "";
      if (longFormat && o.c.year >= 0) c += "+";
      c += padStart(o.c.year, longFormat ? 6 : 4);

      if (extended) {
        c += "-";
        c += padStart(o.c.month);
        c += "-";
        c += padStart(o.c.day);
      } else {
        c += padStart(o.c.month);
        c += padStart(o.c.day);
      }

      return c;
    }

    function _toISOTime(o, extended, suppressSeconds, suppressMilliseconds, includeOffset) {
      var c = padStart(o.c.hour);

      if (extended) {
        c += ":";
        c += padStart(o.c.minute);

        if (o.c.second !== 0 || !suppressSeconds) {
          c += ":";
        }
      } else {
        c += padStart(o.c.minute);
      }

      if (o.c.second !== 0 || !suppressSeconds) {
        c += padStart(o.c.second);

        if (o.c.millisecond !== 0 || !suppressMilliseconds) {
          c += ".";
          c += padStart(o.c.millisecond, 3);
        }
      }

      if (includeOffset) {
        if (o.isOffsetFixed && o.offset === 0) {
          c += "Z";
        } else if (o.o < 0) {
          c += "-";
          c += padStart(Math.trunc(-o.o / 60));
          c += ":";
          c += padStart(Math.trunc(-o.o % 60));
        } else {
          c += "+";
          c += padStart(Math.trunc(o.o / 60));
          c += ":";
          c += padStart(Math.trunc(o.o % 60));
        }
      }

      return c;
    } // defaults for unspecified units in the supported calendars


    var defaultUnitValues = {
      month: 1,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0
    },
        defaultWeekUnitValues = {
      weekNumber: 1,
      weekday: 1,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0
    },
        defaultOrdinalUnitValues = {
      ordinal: 1,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0
    }; // Units in the supported calendars, sorted by bigness

    var orderedUnits = ["year", "month", "day", "hour", "minute", "second", "millisecond"],
        orderedWeekUnits = ["weekYear", "weekNumber", "weekday", "hour", "minute", "second", "millisecond"],
        orderedOrdinalUnits = ["year", "ordinal", "hour", "minute", "second", "millisecond"]; // standardize case and plurality in units

    function normalizeUnit(unit) {
      var normalized = {
        year: "year",
        years: "year",
        month: "month",
        months: "month",
        day: "day",
        days: "day",
        hour: "hour",
        hours: "hour",
        minute: "minute",
        minutes: "minute",
        quarter: "quarter",
        quarters: "quarter",
        second: "second",
        seconds: "second",
        millisecond: "millisecond",
        milliseconds: "millisecond",
        weekday: "weekday",
        weekdays: "weekday",
        weeknumber: "weekNumber",
        weeksnumber: "weekNumber",
        weeknumbers: "weekNumber",
        weekyear: "weekYear",
        weekyears: "weekYear",
        ordinal: "ordinal"
      }[unit.toLowerCase()];
      if (!normalized) throw new InvalidUnitError(unit);
      return normalized;
    } // this is a dumbed down version of fromObject() that runs about 60% faster
    // but doesn't do any validation, makes a bunch of assumptions about what units
    // are present, and so on.
    // this is a dumbed down version of fromObject() that runs about 60% faster
    // but doesn't do any validation, makes a bunch of assumptions about what units
    // are present, and so on.


    function quickDT(obj, opts) {
      var zone = normalizeZone(opts.zone, Settings.defaultZone),
          loc = Locale.fromObject(opts),
          tsNow = Settings.now();
      var ts, o; // assume we have the higher-order units

      if (!isUndefined(obj.year)) {
        for (var _iterator = _createForOfIteratorHelperLoose(orderedUnits), _step; !(_step = _iterator()).done;) {
          var u = _step.value;

          if (isUndefined(obj[u])) {
            obj[u] = defaultUnitValues[u];
          }
        }

        var invalid = hasInvalidGregorianData(obj) || hasInvalidTimeData(obj);

        if (invalid) {
          return DateTime.invalid(invalid);
        }

        var offsetProvis = zone.offset(tsNow);

        var _objToTS = objToTS(obj, offsetProvis, zone);

        ts = _objToTS[0];
        o = _objToTS[1];
      } else {
        ts = tsNow;
      }

      return new DateTime({
        ts: ts,
        zone: zone,
        loc: loc,
        o: o
      });
    }

    function diffRelative(start, end, opts) {
      var round = isUndefined(opts.round) ? true : opts.round,
          format = function format(c, unit) {
        c = roundTo(c, round || opts.calendary ? 0 : 2, true);
        var formatter = end.loc.clone(opts).relFormatter(opts);
        return formatter.format(c, unit);
      },
          differ = function differ(unit) {
        if (opts.calendary) {
          if (!end.hasSame(start, unit)) {
            return end.startOf(unit).diff(start.startOf(unit), unit).get(unit);
          } else return 0;
        } else {
          return end.diff(start, unit).get(unit);
        }
      };

      if (opts.unit) {
        return format(differ(opts.unit), opts.unit);
      }

      for (var _iterator2 = _createForOfIteratorHelperLoose(opts.units), _step2; !(_step2 = _iterator2()).done;) {
        var unit = _step2.value;
        var count = differ(unit);

        if (Math.abs(count) >= 1) {
          return format(count, unit);
        }
      }

      return format(start > end ? -0 : 0, opts.units[opts.units.length - 1]);
    }

    function lastOpts(argList) {
      var opts = {},
          args;

      if (argList.length > 0 && typeof argList[argList.length - 1] === "object") {
        opts = argList[argList.length - 1];
        args = Array.from(argList).slice(0, argList.length - 1);
      } else {
        args = Array.from(argList);
      }

      return [opts, args];
    }
    /**
     * A DateTime is an immutable data structure representing a specific date and time and accompanying methods. It contains class and instance methods for creating, parsing, interrogating, transforming, and formatting them.
     *
     * A DateTime comprises of:
     * * A timestamp. Each DateTime instance refers to a specific millisecond of the Unix epoch.
     * * A time zone. Each instance is considered in the context of a specific zone (by default the local system's zone).
     * * Configuration properties that effect how output strings are formatted, such as `locale`, `numberingSystem`, and `outputCalendar`.
     *
     * Here is a brief overview of the most commonly used functionality it provides:
     *
     * * **Creation**: To create a DateTime from its components, use one of its factory class methods: {@link DateTime#local}, {@link DateTime#utc}, and (most flexibly) {@link DateTime#fromObject}. To create one from a standard string format, use {@link DateTime#fromISO}, {@link DateTime#fromHTTP}, and {@link DateTime#fromRFC2822}. To create one from a custom string format, use {@link DateTime#fromFormat}. To create one from a native JS date, use {@link DateTime#fromJSDate}.
     * * **Gregorian calendar and time**: To examine the Gregorian properties of a DateTime individually (i.e as opposed to collectively through {@link DateTime#toObject}), use the {@link DateTime#year}, {@link DateTime#month},
     * {@link DateTime#day}, {@link DateTime#hour}, {@link DateTime#minute}, {@link DateTime#second}, {@link DateTime#millisecond} accessors.
     * * **Week calendar**: For ISO week calendar attributes, see the {@link DateTime#weekYear}, {@link DateTime#weekNumber}, and {@link DateTime#weekday} accessors.
     * * **Configuration** See the {@link DateTime#locale} and {@link DateTime#numberingSystem} accessors.
     * * **Transformation**: To transform the DateTime into other DateTimes, use {@link DateTime#set}, {@link DateTime#reconfigure}, {@link DateTime#setZone}, {@link DateTime#setLocale}, {@link DateTime.plus}, {@link DateTime#minus}, {@link DateTime#endOf}, {@link DateTime#startOf}, {@link DateTime#toUTC}, and {@link DateTime#toLocal}.
     * * **Output**: To convert the DateTime to other representations, use the {@link DateTime#toRelative}, {@link DateTime#toRelativeCalendar}, {@link DateTime#toJSON}, {@link DateTime#toISO}, {@link DateTime#toHTTP}, {@link DateTime#toObject}, {@link DateTime#toRFC2822}, {@link DateTime#toString}, {@link DateTime#toLocaleString}, {@link DateTime#toFormat}, {@link DateTime#toMillis} and {@link DateTime#toJSDate}.
     *
     * There's plenty others documented below. In addition, for more information on subtler topics like internationalization, time zones, alternative calendars, validity, and so on, see the external documentation.
     */


    var DateTime = /*#__PURE__*/function () {
      /**
       * @access private
       */
      function DateTime(config) {
        var zone = config.zone || Settings.defaultZone;
        var invalid = config.invalid || (Number.isNaN(config.ts) ? new Invalid("invalid input") : null) || (!zone.isValid ? unsupportedZone(zone) : null);
        /**
         * @access private
         */

        this.ts = isUndefined(config.ts) ? Settings.now() : config.ts;
        var c = null,
            o = null;

        if (!invalid) {
          var unchanged = config.old && config.old.ts === this.ts && config.old.zone.equals(zone);

          if (unchanged) {
            var _ref = [config.old.c, config.old.o];
            c = _ref[0];
            o = _ref[1];
          } else {
            var ot = zone.offset(this.ts);
            c = tsToObj(this.ts, ot);
            invalid = Number.isNaN(c.year) ? new Invalid("invalid input") : null;
            c = invalid ? null : c;
            o = invalid ? null : ot;
          }
        }
        /**
         * @access private
         */


        this._zone = zone;
        /**
         * @access private
         */

        this.loc = config.loc || Locale.create();
        /**
         * @access private
         */

        this.invalid = invalid;
        /**
         * @access private
         */

        this.weekData = null;
        /**
         * @access private
         */

        this.c = c;
        /**
         * @access private
         */

        this.o = o;
        /**
         * @access private
         */

        this.isLuxonDateTime = true;
      } // CONSTRUCT

      /**
       * Create a DateTime for the current instant, in the system's time zone.
       *
       * Use Settings to override these default values if needed.
       * @example DateTime.now().toISO() //~> now in the ISO format
       * @return {DateTime}
       */


      DateTime.now = function now() {
        return new DateTime({});
      }
      /**
       * Create a local DateTime
       * @param {number} [year] - The calendar year. If omitted (as in, call `local()` with no arguments), the current time will be used
       * @param {number} [month=1] - The month, 1-indexed
       * @param {number} [day=1] - The day of the month, 1-indexed
       * @param {number} [hour=0] - The hour of the day, in 24-hour time
       * @param {number} [minute=0] - The minute of the hour, meaning a number between 0 and 59
       * @param {number} [second=0] - The second of the minute, meaning a number between 0 and 59
       * @param {number} [millisecond=0] - The millisecond of the second, meaning a number between 0 and 999
       * @example DateTime.local()                                  //~> now
       * @example DateTime.local({ zone: "America/New_York" })      //~> now, in US east coast time
       * @example DateTime.local(2017)                              //~> 2017-01-01T00:00:00
       * @example DateTime.local(2017, 3)                           //~> 2017-03-01T00:00:00
       * @example DateTime.local(2017, 3, 12, { locale: "fr" })     //~> 2017-03-12T00:00:00, with a French locale
       * @example DateTime.local(2017, 3, 12, 5)                    //~> 2017-03-12T05:00:00
       * @example DateTime.local(2017, 3, 12, 5, { zone: "utc" })   //~> 2017-03-12T05:00:00, in UTC
       * @example DateTime.local(2017, 3, 12, 5, 45)                //~> 2017-03-12T05:45:00
       * @example DateTime.local(2017, 3, 12, 5, 45, 10)            //~> 2017-03-12T05:45:10
       * @example DateTime.local(2017, 3, 12, 5, 45, 10, 765)       //~> 2017-03-12T05:45:10.765
       * @return {DateTime}
       */
      ;

      DateTime.local = function local() {
        var _lastOpts = lastOpts(arguments),
            opts = _lastOpts[0],
            args = _lastOpts[1],
            year = args[0],
            month = args[1],
            day = args[2],
            hour = args[3],
            minute = args[4],
            second = args[5],
            millisecond = args[6];

        return quickDT({
          year: year,
          month: month,
          day: day,
          hour: hour,
          minute: minute,
          second: second,
          millisecond: millisecond
        }, opts);
      }
      /**
       * Create a DateTime in UTC
       * @param {number} [year] - The calendar year. If omitted (as in, call `utc()` with no arguments), the current time will be used
       * @param {number} [month=1] - The month, 1-indexed
       * @param {number} [day=1] - The day of the month
       * @param {number} [hour=0] - The hour of the day, in 24-hour time
       * @param {number} [minute=0] - The minute of the hour, meaning a number between 0 and 59
       * @param {number} [second=0] - The second of the minute, meaning a number between 0 and 59
       * @param {number} [millisecond=0] - The millisecond of the second, meaning a number between 0 and 999
       * @param {Object} options - configuration options for the DateTime
       * @param {string} [options.locale] - a locale to set on the resulting DateTime instance
       * @param {string} [options.outputCalendar] - the output calendar to set on the resulting DateTime instance
       * @param {string} [options.numberingSystem] - the numbering system to set on the resulting DateTime instance
       * @example DateTime.utc()                                              //~> now
       * @example DateTime.utc(2017)                                          //~> 2017-01-01T00:00:00Z
       * @example DateTime.utc(2017, 3)                                       //~> 2017-03-01T00:00:00Z
       * @example DateTime.utc(2017, 3, 12)                                   //~> 2017-03-12T00:00:00Z
       * @example DateTime.utc(2017, 3, 12, 5)                                //~> 2017-03-12T05:00:00Z
       * @example DateTime.utc(2017, 3, 12, 5, 45)                            //~> 2017-03-12T05:45:00Z
       * @example DateTime.utc(2017, 3, 12, 5, 45, { locale: "fr" })          //~> 2017-03-12T05:45:00Z with a French locale
       * @example DateTime.utc(2017, 3, 12, 5, 45, 10)                        //~> 2017-03-12T05:45:10Z
       * @example DateTime.utc(2017, 3, 12, 5, 45, 10, 765, { locale: "fr" }) //~> 2017-03-12T05:45:10.765Z with a French locale
       * @return {DateTime}
       */
      ;

      DateTime.utc = function utc() {
        var _lastOpts2 = lastOpts(arguments),
            opts = _lastOpts2[0],
            args = _lastOpts2[1],
            year = args[0],
            month = args[1],
            day = args[2],
            hour = args[3],
            minute = args[4],
            second = args[5],
            millisecond = args[6];

        opts.zone = FixedOffsetZone.utcInstance;
        return quickDT({
          year: year,
          month: month,
          day: day,
          hour: hour,
          minute: minute,
          second: second,
          millisecond: millisecond
        }, opts);
      }
      /**
       * Create a DateTime from a JavaScript Date object. Uses the default zone.
       * @param {Date} date - a JavaScript Date object
       * @param {Object} options - configuration options for the DateTime
       * @param {string|Zone} [options.zone='local'] - the zone to place the DateTime into
       * @return {DateTime}
       */
      ;

      DateTime.fromJSDate = function fromJSDate(date, options) {
        if (options === void 0) {
          options = {};
        }

        var ts = isDate(date) ? date.valueOf() : NaN;

        if (Number.isNaN(ts)) {
          return DateTime.invalid("invalid input");
        }

        var zoneToUse = normalizeZone(options.zone, Settings.defaultZone);

        if (!zoneToUse.isValid) {
          return DateTime.invalid(unsupportedZone(zoneToUse));
        }

        return new DateTime({
          ts: ts,
          zone: zoneToUse,
          loc: Locale.fromObject(options)
        });
      }
      /**
       * Create a DateTime from a number of milliseconds since the epoch (meaning since 1 January 1970 00:00:00 UTC). Uses the default zone.
       * @param {number} milliseconds - a number of milliseconds since 1970 UTC
       * @param {Object} options - configuration options for the DateTime
       * @param {string|Zone} [options.zone='local'] - the zone to place the DateTime into
       * @param {string} [options.locale] - a locale to set on the resulting DateTime instance
       * @param {string} options.outputCalendar - the output calendar to set on the resulting DateTime instance
       * @param {string} options.numberingSystem - the numbering system to set on the resulting DateTime instance
       * @return {DateTime}
       */
      ;

      DateTime.fromMillis = function fromMillis(milliseconds, options) {
        if (options === void 0) {
          options = {};
        }

        if (!isNumber(milliseconds)) {
          throw new InvalidArgumentError("fromMillis requires a numerical input, but received a " + typeof milliseconds + " with value " + milliseconds);
        } else if (milliseconds < -MAX_DATE || milliseconds > MAX_DATE) {
          // this isn't perfect because because we can still end up out of range because of additional shifting, but it's a start
          return DateTime.invalid("Timestamp out of range");
        } else {
          return new DateTime({
            ts: milliseconds,
            zone: normalizeZone(options.zone, Settings.defaultZone),
            loc: Locale.fromObject(options)
          });
        }
      }
      /**
       * Create a DateTime from a number of seconds since the epoch (meaning since 1 January 1970 00:00:00 UTC). Uses the default zone.
       * @param {number} seconds - a number of seconds since 1970 UTC
       * @param {Object} options - configuration options for the DateTime
       * @param {string|Zone} [options.zone='local'] - the zone to place the DateTime into
       * @param {string} [options.locale] - a locale to set on the resulting DateTime instance
       * @param {string} options.outputCalendar - the output calendar to set on the resulting DateTime instance
       * @param {string} options.numberingSystem - the numbering system to set on the resulting DateTime instance
       * @return {DateTime}
       */
      ;

      DateTime.fromSeconds = function fromSeconds(seconds, options) {
        if (options === void 0) {
          options = {};
        }

        if (!isNumber(seconds)) {
          throw new InvalidArgumentError("fromSeconds requires a numerical input");
        } else {
          return new DateTime({
            ts: seconds * 1000,
            zone: normalizeZone(options.zone, Settings.defaultZone),
            loc: Locale.fromObject(options)
          });
        }
      }
      /**
       * Create a DateTime from a JavaScript object with keys like 'year' and 'hour' with reasonable defaults.
       * @param {Object} obj - the object to create the DateTime from
       * @param {number} obj.year - a year, such as 1987
       * @param {number} obj.month - a month, 1-12
       * @param {number} obj.day - a day of the month, 1-31, depending on the month
       * @param {number} obj.ordinal - day of the year, 1-365 or 366
       * @param {number} obj.weekYear - an ISO week year
       * @param {number} obj.weekNumber - an ISO week number, between 1 and 52 or 53, depending on the year
       * @param {number} obj.weekday - an ISO weekday, 1-7, where 1 is Monday and 7 is Sunday
       * @param {number} obj.hour - hour of the day, 0-23
       * @param {number} obj.minute - minute of the hour, 0-59
       * @param {number} obj.second - second of the minute, 0-59
       * @param {number} obj.millisecond - millisecond of the second, 0-999
       * @param {Object} opts - options for creating this DateTime
       * @param {string|Zone} [opts.zone='local'] - interpret the numbers in the context of a particular zone. Can take any value taken as the first argument to setZone()
       * @param {string} [opts.locale='system's locale'] - a locale to set on the resulting DateTime instance
       * @param {string} opts.outputCalendar - the output calendar to set on the resulting DateTime instance
       * @param {string} opts.numberingSystem - the numbering system to set on the resulting DateTime instance
       * @example DateTime.fromObject({ year: 1982, month: 5, day: 25}).toISODate() //=> '1982-05-25'
       * @example DateTime.fromObject({ year: 1982 }).toISODate() //=> '1982-01-01'
       * @example DateTime.fromObject({ hour: 10, minute: 26, second: 6 }) //~> today at 10:26:06
       * @example DateTime.fromObject({ hour: 10, minute: 26, second: 6 }, { zone: 'utc' }),
       * @example DateTime.fromObject({ hour: 10, minute: 26, second: 6 }, { zone: 'local' })
       * @example DateTime.fromObject({ hour: 10, minute: 26, second: 6 }, { zone: 'America/New_York' })
       * @example DateTime.fromObject({ weekYear: 2016, weekNumber: 2, weekday: 3 }).toISODate() //=> '2016-01-13'
       * @return {DateTime}
       */
      ;

      DateTime.fromObject = function fromObject(obj, opts) {
        if (opts === void 0) {
          opts = {};
        }

        obj = obj || {};
        var zoneToUse = normalizeZone(opts.zone, Settings.defaultZone);

        if (!zoneToUse.isValid) {
          return DateTime.invalid(unsupportedZone(zoneToUse));
        }

        var tsNow = Settings.now(),
            offsetProvis = !isUndefined(opts.specificOffset) ? opts.specificOffset : zoneToUse.offset(tsNow),
            normalized = normalizeObject(obj, normalizeUnit),
            containsOrdinal = !isUndefined(normalized.ordinal),
            containsGregorYear = !isUndefined(normalized.year),
            containsGregorMD = !isUndefined(normalized.month) || !isUndefined(normalized.day),
            containsGregor = containsGregorYear || containsGregorMD,
            definiteWeekDef = normalized.weekYear || normalized.weekNumber,
            loc = Locale.fromObject(opts); // cases:
        // just a weekday -> this week's instance of that weekday, no worries
        // (gregorian data or ordinal) + (weekYear or weekNumber) -> error
        // (gregorian month or day) + ordinal -> error
        // otherwise just use weeks or ordinals or gregorian, depending on what's specified

        if ((containsGregor || containsOrdinal) && definiteWeekDef) {
          throw new ConflictingSpecificationError("Can't mix weekYear/weekNumber units with year/month/day or ordinals");
        }

        if (containsGregorMD && containsOrdinal) {
          throw new ConflictingSpecificationError("Can't mix ordinal dates with month/day");
        }

        var useWeekData = definiteWeekDef || normalized.weekday && !containsGregor; // configure ourselves to deal with gregorian dates or week stuff

        var units,
            defaultValues,
            objNow = tsToObj(tsNow, offsetProvis);

        if (useWeekData) {
          units = orderedWeekUnits;
          defaultValues = defaultWeekUnitValues;
          objNow = gregorianToWeek(objNow);
        } else if (containsOrdinal) {
          units = orderedOrdinalUnits;
          defaultValues = defaultOrdinalUnitValues;
          objNow = gregorianToOrdinal(objNow);
        } else {
          units = orderedUnits;
          defaultValues = defaultUnitValues;
        } // set default values for missing stuff


        var foundFirst = false;

        for (var _iterator3 = _createForOfIteratorHelperLoose(units), _step3; !(_step3 = _iterator3()).done;) {
          var u = _step3.value;
          var v = normalized[u];

          if (!isUndefined(v)) {
            foundFirst = true;
          } else if (foundFirst) {
            normalized[u] = defaultValues[u];
          } else {
            normalized[u] = objNow[u];
          }
        } // make sure the values we have are in range


        var higherOrderInvalid = useWeekData ? hasInvalidWeekData(normalized) : containsOrdinal ? hasInvalidOrdinalData(normalized) : hasInvalidGregorianData(normalized),
            invalid = higherOrderInvalid || hasInvalidTimeData(normalized);

        if (invalid) {
          return DateTime.invalid(invalid);
        } // compute the actual time


        var gregorian = useWeekData ? weekToGregorian(normalized) : containsOrdinal ? ordinalToGregorian(normalized) : normalized,
            _objToTS2 = objToTS(gregorian, offsetProvis, zoneToUse),
            tsFinal = _objToTS2[0],
            offsetFinal = _objToTS2[1],
            inst = new DateTime({
          ts: tsFinal,
          zone: zoneToUse,
          o: offsetFinal,
          loc: loc
        }); // gregorian data + weekday serves only to validate


        if (normalized.weekday && containsGregor && obj.weekday !== inst.weekday) {
          return DateTime.invalid("mismatched weekday", "you can't specify both a weekday of " + normalized.weekday + " and a date of " + inst.toISO());
        }

        return inst;
      }
      /**
       * Create a DateTime from an ISO 8601 string
       * @param {string} text - the ISO string
       * @param {Object} opts - options to affect the creation
       * @param {string|Zone} [opts.zone='local'] - use this zone if no offset is specified in the input string itself. Will also convert the time to this zone
       * @param {boolean} [opts.setZone=false] - override the zone with a fixed-offset zone specified in the string itself, if it specifies one
       * @param {string} [opts.locale='system's locale'] - a locale to set on the resulting DateTime instance
       * @param {string} [opts.outputCalendar] - the output calendar to set on the resulting DateTime instance
       * @param {string} [opts.numberingSystem] - the numbering system to set on the resulting DateTime instance
       * @example DateTime.fromISO('2016-05-25T09:08:34.123')
       * @example DateTime.fromISO('2016-05-25T09:08:34.123+06:00')
       * @example DateTime.fromISO('2016-05-25T09:08:34.123+06:00', {setZone: true})
       * @example DateTime.fromISO('2016-05-25T09:08:34.123', {zone: 'utc'})
       * @example DateTime.fromISO('2016-W05-4')
       * @return {DateTime}
       */
      ;

      DateTime.fromISO = function fromISO(text, opts) {
        if (opts === void 0) {
          opts = {};
        }

        var _parseISODate = parseISODate(text),
            vals = _parseISODate[0],
            parsedZone = _parseISODate[1];

        return parseDataToDateTime(vals, parsedZone, opts, "ISO 8601", text);
      }
      /**
       * Create a DateTime from an RFC 2822 string
       * @param {string} text - the RFC 2822 string
       * @param {Object} opts - options to affect the creation
       * @param {string|Zone} [opts.zone='local'] - convert the time to this zone. Since the offset is always specified in the string itself, this has no effect on the interpretation of string, merely the zone the resulting DateTime is expressed in.
       * @param {boolean} [opts.setZone=false] - override the zone with a fixed-offset zone specified in the string itself, if it specifies one
       * @param {string} [opts.locale='system's locale'] - a locale to set on the resulting DateTime instance
       * @param {string} opts.outputCalendar - the output calendar to set on the resulting DateTime instance
       * @param {string} opts.numberingSystem - the numbering system to set on the resulting DateTime instance
       * @example DateTime.fromRFC2822('25 Nov 2016 13:23:12 GMT')
       * @example DateTime.fromRFC2822('Fri, 25 Nov 2016 13:23:12 +0600')
       * @example DateTime.fromRFC2822('25 Nov 2016 13:23 Z')
       * @return {DateTime}
       */
      ;

      DateTime.fromRFC2822 = function fromRFC2822(text, opts) {
        if (opts === void 0) {
          opts = {};
        }

        var _parseRFC2822Date = parseRFC2822Date(text),
            vals = _parseRFC2822Date[0],
            parsedZone = _parseRFC2822Date[1];

        return parseDataToDateTime(vals, parsedZone, opts, "RFC 2822", text);
      }
      /**
       * Create a DateTime from an HTTP header date
       * @see https://www.w3.org/Protocols/rfc2616/rfc2616-sec3.html#sec3.3.1
       * @param {string} text - the HTTP header date
       * @param {Object} opts - options to affect the creation
       * @param {string|Zone} [opts.zone='local'] - convert the time to this zone. Since HTTP dates are always in UTC, this has no effect on the interpretation of string, merely the zone the resulting DateTime is expressed in.
       * @param {boolean} [opts.setZone=false] - override the zone with the fixed-offset zone specified in the string. For HTTP dates, this is always UTC, so this option is equivalent to setting the `zone` option to 'utc', but this option is included for consistency with similar methods.
       * @param {string} [opts.locale='system's locale'] - a locale to set on the resulting DateTime instance
       * @param {string} opts.outputCalendar - the output calendar to set on the resulting DateTime instance
       * @param {string} opts.numberingSystem - the numbering system to set on the resulting DateTime instance
       * @example DateTime.fromHTTP('Sun, 06 Nov 1994 08:49:37 GMT')
       * @example DateTime.fromHTTP('Sunday, 06-Nov-94 08:49:37 GMT')
       * @example DateTime.fromHTTP('Sun Nov  6 08:49:37 1994')
       * @return {DateTime}
       */
      ;

      DateTime.fromHTTP = function fromHTTP(text, opts) {
        if (opts === void 0) {
          opts = {};
        }

        var _parseHTTPDate = parseHTTPDate(text),
            vals = _parseHTTPDate[0],
            parsedZone = _parseHTTPDate[1];

        return parseDataToDateTime(vals, parsedZone, opts, "HTTP", opts);
      }
      /**
       * Create a DateTime from an input string and format string.
       * Defaults to en-US if no locale has been specified, regardless of the system's locale. For a table of tokens and their interpretations, see [here](https://moment.github.io/luxon/#/parsing?id=table-of-tokens).
       * @param {string} text - the string to parse
       * @param {string} fmt - the format the string is expected to be in (see the link below for the formats)
       * @param {Object} opts - options to affect the creation
       * @param {string|Zone} [opts.zone='local'] - use this zone if no offset is specified in the input string itself. Will also convert the DateTime to this zone
       * @param {boolean} [opts.setZone=false] - override the zone with a zone specified in the string itself, if it specifies one
       * @param {string} [opts.locale='en-US'] - a locale string to use when parsing. Will also set the DateTime to this locale
       * @param {string} opts.numberingSystem - the numbering system to use when parsing. Will also set the resulting DateTime to this numbering system
       * @param {string} opts.outputCalendar - the output calendar to set on the resulting DateTime instance
       * @return {DateTime}
       */
      ;

      DateTime.fromFormat = function fromFormat(text, fmt, opts) {
        if (opts === void 0) {
          opts = {};
        }

        if (isUndefined(text) || isUndefined(fmt)) {
          throw new InvalidArgumentError("fromFormat requires an input string and a format");
        }

        var _opts = opts,
            _opts$locale = _opts.locale,
            locale = _opts$locale === void 0 ? null : _opts$locale,
            _opts$numberingSystem = _opts.numberingSystem,
            numberingSystem = _opts$numberingSystem === void 0 ? null : _opts$numberingSystem,
            localeToUse = Locale.fromOpts({
          locale: locale,
          numberingSystem: numberingSystem,
          defaultToEN: true
        }),
            _parseFromTokens = parseFromTokens(localeToUse, text, fmt),
            vals = _parseFromTokens[0],
            parsedZone = _parseFromTokens[1],
            specificOffset = _parseFromTokens[2],
            invalid = _parseFromTokens[3];

        if (invalid) {
          return DateTime.invalid(invalid);
        } else {
          return parseDataToDateTime(vals, parsedZone, opts, "format " + fmt, text, specificOffset);
        }
      }
      /**
       * @deprecated use fromFormat instead
       */
      ;

      DateTime.fromString = function fromString(text, fmt, opts) {
        if (opts === void 0) {
          opts = {};
        }

        return DateTime.fromFormat(text, fmt, opts);
      }
      /**
       * Create a DateTime from a SQL date, time, or datetime
       * Defaults to en-US if no locale has been specified, regardless of the system's locale
       * @param {string} text - the string to parse
       * @param {Object} opts - options to affect the creation
       * @param {string|Zone} [opts.zone='local'] - use this zone if no offset is specified in the input string itself. Will also convert the DateTime to this zone
       * @param {boolean} [opts.setZone=false] - override the zone with a zone specified in the string itself, if it specifies one
       * @param {string} [opts.locale='en-US'] - a locale string to use when parsing. Will also set the DateTime to this locale
       * @param {string} opts.numberingSystem - the numbering system to use when parsing. Will also set the resulting DateTime to this numbering system
       * @param {string} opts.outputCalendar - the output calendar to set on the resulting DateTime instance
       * @example DateTime.fromSQL('2017-05-15')
       * @example DateTime.fromSQL('2017-05-15 09:12:34')
       * @example DateTime.fromSQL('2017-05-15 09:12:34.342')
       * @example DateTime.fromSQL('2017-05-15 09:12:34.342+06:00')
       * @example DateTime.fromSQL('2017-05-15 09:12:34.342 America/Los_Angeles')
       * @example DateTime.fromSQL('2017-05-15 09:12:34.342 America/Los_Angeles', { setZone: true })
       * @example DateTime.fromSQL('2017-05-15 09:12:34.342', { zone: 'America/Los_Angeles' })
       * @example DateTime.fromSQL('09:12:34.342')
       * @return {DateTime}
       */
      ;

      DateTime.fromSQL = function fromSQL(text, opts) {
        if (opts === void 0) {
          opts = {};
        }

        var _parseSQL = parseSQL(text),
            vals = _parseSQL[0],
            parsedZone = _parseSQL[1];

        return parseDataToDateTime(vals, parsedZone, opts, "SQL", text);
      }
      /**
       * Create an invalid DateTime.
       * @param {string} reason - simple string of why this DateTime is invalid. Should not contain parameters or anything else data-dependent
       * @param {string} [explanation=null] - longer explanation, may include parameters and other useful debugging information
       * @return {DateTime}
       */
      ;

      DateTime.invalid = function invalid(reason, explanation) {
        if (explanation === void 0) {
          explanation = null;
        }

        if (!reason) {
          throw new InvalidArgumentError("need to specify a reason the DateTime is invalid");
        }

        var invalid = reason instanceof Invalid ? reason : new Invalid(reason, explanation);

        if (Settings.throwOnInvalid) {
          throw new InvalidDateTimeError(invalid);
        } else {
          return new DateTime({
            invalid: invalid
          });
        }
      }
      /**
       * Check if an object is a DateTime. Works across context boundaries
       * @param {object} o
       * @return {boolean}
       */
      ;

      DateTime.isDateTime = function isDateTime(o) {
        return o && o.isLuxonDateTime || false;
      } // INFO

      /**
       * Get the value of unit.
       * @param {string} unit - a unit such as 'minute' or 'day'
       * @example DateTime.local(2017, 7, 4).get('month'); //=> 7
       * @example DateTime.local(2017, 7, 4).get('day'); //=> 4
       * @return {number}
       */
      ;

      var _proto = DateTime.prototype;

      _proto.get = function get(unit) {
        return this[unit];
      }
      /**
       * Returns whether the DateTime is valid. Invalid DateTimes occur when:
       * * The DateTime was created from invalid calendar information, such as the 13th month or February 30
       * * The DateTime was created by an operation on another invalid date
       * @type {boolean}
       */
      ;

      /**
       * Returns the resolved Intl options for this DateTime.
       * This is useful in understanding the behavior of formatting methods
       * @param {Object} opts - the same options as toLocaleString
       * @return {Object}
       */
      _proto.resolvedLocaleOptions = function resolvedLocaleOptions(opts) {
        if (opts === void 0) {
          opts = {};
        }

        var _Formatter$create$res = Formatter.create(this.loc.clone(opts), opts).resolvedOptions(this),
            locale = _Formatter$create$res.locale,
            numberingSystem = _Formatter$create$res.numberingSystem,
            calendar = _Formatter$create$res.calendar;

        return {
          locale: locale,
          numberingSystem: numberingSystem,
          outputCalendar: calendar
        };
      } // TRANSFORM

      /**
       * "Set" the DateTime's zone to UTC. Returns a newly-constructed DateTime.
       *
       * Equivalent to {@link DateTime#setZone}('utc')
       * @param {number} [offset=0] - optionally, an offset from UTC in minutes
       * @param {Object} [opts={}] - options to pass to `setZone()`
       * @return {DateTime}
       */
      ;

      _proto.toUTC = function toUTC(offset, opts) {
        if (offset === void 0) {
          offset = 0;
        }

        if (opts === void 0) {
          opts = {};
        }

        return this.setZone(FixedOffsetZone.instance(offset), opts);
      }
      /**
       * "Set" the DateTime's zone to the host's local zone. Returns a newly-constructed DateTime.
       *
       * Equivalent to `setZone('local')`
       * @return {DateTime}
       */
      ;

      _proto.toLocal = function toLocal() {
        return this.setZone(Settings.defaultZone);
      }
      /**
       * "Set" the DateTime's zone to specified zone. Returns a newly-constructed DateTime.
       *
       * By default, the setter keeps the underlying time the same (as in, the same timestamp), but the new instance will report different local times and consider DSTs when making computations, as with {@link DateTime#plus}. You may wish to use {@link DateTime#toLocal} and {@link DateTime#toUTC} which provide simple convenience wrappers for commonly used zones.
       * @param {string|Zone} [zone='local'] - a zone identifier. As a string, that can be any IANA zone supported by the host environment, or a fixed-offset name of the form 'UTC+3', or the strings 'local' or 'utc'. You may also supply an instance of a {@link DateTime#Zone} class.
       * @param {Object} opts - options
       * @param {boolean} [opts.keepLocalTime=false] - If true, adjust the underlying time so that the local time stays the same, but in the target zone. You should rarely need this.
       * @return {DateTime}
       */
      ;

      _proto.setZone = function setZone(zone, _temp) {
        var _ref2 = _temp === void 0 ? {} : _temp,
            _ref2$keepLocalTime = _ref2.keepLocalTime,
            keepLocalTime = _ref2$keepLocalTime === void 0 ? false : _ref2$keepLocalTime,
            _ref2$keepCalendarTim = _ref2.keepCalendarTime,
            keepCalendarTime = _ref2$keepCalendarTim === void 0 ? false : _ref2$keepCalendarTim;

        zone = normalizeZone(zone, Settings.defaultZone);

        if (zone.equals(this.zone)) {
          return this;
        } else if (!zone.isValid) {
          return DateTime.invalid(unsupportedZone(zone));
        } else {
          var newTS = this.ts;

          if (keepLocalTime || keepCalendarTime) {
            var offsetGuess = zone.offset(this.ts);
            var asObj = this.toObject();

            var _objToTS3 = objToTS(asObj, offsetGuess, zone);

            newTS = _objToTS3[0];
          }

          return clone(this, {
            ts: newTS,
            zone: zone
          });
        }
      }
      /**
       * "Set" the locale, numberingSystem, or outputCalendar. Returns a newly-constructed DateTime.
       * @param {Object} properties - the properties to set
       * @example DateTime.local(2017, 5, 25).reconfigure({ locale: 'en-GB' })
       * @return {DateTime}
       */
      ;

      _proto.reconfigure = function reconfigure(_temp2) {
        var _ref3 = _temp2 === void 0 ? {} : _temp2,
            locale = _ref3.locale,
            numberingSystem = _ref3.numberingSystem,
            outputCalendar = _ref3.outputCalendar;

        var loc = this.loc.clone({
          locale: locale,
          numberingSystem: numberingSystem,
          outputCalendar: outputCalendar
        });
        return clone(this, {
          loc: loc
        });
      }
      /**
       * "Set" the locale. Returns a newly-constructed DateTime.
       * Just a convenient alias for reconfigure({ locale })
       * @example DateTime.local(2017, 5, 25).setLocale('en-GB')
       * @return {DateTime}
       */
      ;

      _proto.setLocale = function setLocale(locale) {
        return this.reconfigure({
          locale: locale
        });
      }
      /**
       * "Set" the values of specified units. Returns a newly-constructed DateTime.
       * You can only set units with this method; for "setting" metadata, see {@link DateTime#reconfigure} and {@link DateTime#setZone}.
       * @param {Object} values - a mapping of units to numbers
       * @example dt.set({ year: 2017 })
       * @example dt.set({ hour: 8, minute: 30 })
       * @example dt.set({ weekday: 5 })
       * @example dt.set({ year: 2005, ordinal: 234 })
       * @return {DateTime}
       */
      ;

      _proto.set = function set(values) {
        if (!this.isValid) return this;
        var normalized = normalizeObject(values, normalizeUnit),
            settingWeekStuff = !isUndefined(normalized.weekYear) || !isUndefined(normalized.weekNumber) || !isUndefined(normalized.weekday),
            containsOrdinal = !isUndefined(normalized.ordinal),
            containsGregorYear = !isUndefined(normalized.year),
            containsGregorMD = !isUndefined(normalized.month) || !isUndefined(normalized.day),
            containsGregor = containsGregorYear || containsGregorMD,
            definiteWeekDef = normalized.weekYear || normalized.weekNumber;

        if ((containsGregor || containsOrdinal) && definiteWeekDef) {
          throw new ConflictingSpecificationError("Can't mix weekYear/weekNumber units with year/month/day or ordinals");
        }

        if (containsGregorMD && containsOrdinal) {
          throw new ConflictingSpecificationError("Can't mix ordinal dates with month/day");
        }

        var mixed;

        if (settingWeekStuff) {
          mixed = weekToGregorian(_extends({}, gregorianToWeek(this.c), normalized));
        } else if (!isUndefined(normalized.ordinal)) {
          mixed = ordinalToGregorian(_extends({}, gregorianToOrdinal(this.c), normalized));
        } else {
          mixed = _extends({}, this.toObject(), normalized); // if we didn't set the day but we ended up on an overflow date,
          // use the last day of the right month

          if (isUndefined(normalized.day)) {
            mixed.day = Math.min(daysInMonth(mixed.year, mixed.month), mixed.day);
          }
        }

        var _objToTS4 = objToTS(mixed, this.o, this.zone),
            ts = _objToTS4[0],
            o = _objToTS4[1];

        return clone(this, {
          ts: ts,
          o: o
        });
      }
      /**
       * Add a period of time to this DateTime and return the resulting DateTime
       *
       * Adding hours, minutes, seconds, or milliseconds increases the timestamp by the right number of milliseconds. Adding days, months, or years shifts the calendar, accounting for DSTs and leap years along the way. Thus, `dt.plus({ hours: 24 })` may result in a different time than `dt.plus({ days: 1 })` if there's a DST shift in between.
       * @param {Duration|Object|number} duration - The amount to add. Either a Luxon Duration, a number of milliseconds, the object argument to Duration.fromObject()
       * @example DateTime.now().plus(123) //~> in 123 milliseconds
       * @example DateTime.now().plus({ minutes: 15 }) //~> in 15 minutes
       * @example DateTime.now().plus({ days: 1 }) //~> this time tomorrow
       * @example DateTime.now().plus({ days: -1 }) //~> this time yesterday
       * @example DateTime.now().plus({ hours: 3, minutes: 13 }) //~> in 3 hr, 13 min
       * @example DateTime.now().plus(Duration.fromObject({ hours: 3, minutes: 13 })) //~> in 3 hr, 13 min
       * @return {DateTime}
       */
      ;

      _proto.plus = function plus(duration) {
        if (!this.isValid) return this;
        var dur = Duration.fromDurationLike(duration);
        return clone(this, adjustTime(this, dur));
      }
      /**
       * Subtract a period of time to this DateTime and return the resulting DateTime
       * See {@link DateTime#plus}
       * @param {Duration|Object|number} duration - The amount to subtract. Either a Luxon Duration, a number of milliseconds, the object argument to Duration.fromObject()
       @return {DateTime}
       */
      ;

      _proto.minus = function minus(duration) {
        if (!this.isValid) return this;
        var dur = Duration.fromDurationLike(duration).negate();
        return clone(this, adjustTime(this, dur));
      }
      /**
       * "Set" this DateTime to the beginning of a unit of time.
       * @param {string} unit - The unit to go to the beginning of. Can be 'year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second', or 'millisecond'.
       * @example DateTime.local(2014, 3, 3).startOf('month').toISODate(); //=> '2014-03-01'
       * @example DateTime.local(2014, 3, 3).startOf('year').toISODate(); //=> '2014-01-01'
       * @example DateTime.local(2014, 3, 3).startOf('week').toISODate(); //=> '2014-03-03', weeks always start on Mondays
       * @example DateTime.local(2014, 3, 3, 5, 30).startOf('day').toISOTime(); //=> '00:00.000-05:00'
       * @example DateTime.local(2014, 3, 3, 5, 30).startOf('hour').toISOTime(); //=> '05:00:00.000-05:00'
       * @return {DateTime}
       */
      ;

      _proto.startOf = function startOf(unit) {
        if (!this.isValid) return this;
        var o = {},
            normalizedUnit = Duration.normalizeUnit(unit);

        switch (normalizedUnit) {
          case "years":
            o.month = 1;
          // falls through

          case "quarters":
          case "months":
            o.day = 1;
          // falls through

          case "weeks":
          case "days":
            o.hour = 0;
          // falls through

          case "hours":
            o.minute = 0;
          // falls through

          case "minutes":
            o.second = 0;
          // falls through

          case "seconds":
            o.millisecond = 0;
            break;
          // no default, invalid units throw in normalizeUnit()
        }

        if (normalizedUnit === "weeks") {
          o.weekday = 1;
        }

        if (normalizedUnit === "quarters") {
          var q = Math.ceil(this.month / 3);
          o.month = (q - 1) * 3 + 1;
        }

        return this.set(o);
      }
      /**
       * "Set" this DateTime to the end (meaning the last millisecond) of a unit of time
       * @param {string} unit - The unit to go to the end of. Can be 'year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second', or 'millisecond'.
       * @example DateTime.local(2014, 3, 3).endOf('month').toISO(); //=> '2014-03-31T23:59:59.999-05:00'
       * @example DateTime.local(2014, 3, 3).endOf('year').toISO(); //=> '2014-12-31T23:59:59.999-05:00'
       * @example DateTime.local(2014, 3, 3).endOf('week').toISO(); // => '2014-03-09T23:59:59.999-05:00', weeks start on Mondays
       * @example DateTime.local(2014, 3, 3, 5, 30).endOf('day').toISO(); //=> '2014-03-03T23:59:59.999-05:00'
       * @example DateTime.local(2014, 3, 3, 5, 30).endOf('hour').toISO(); //=> '2014-03-03T05:59:59.999-05:00'
       * @return {DateTime}
       */
      ;

      _proto.endOf = function endOf(unit) {
        var _this$plus;

        return this.isValid ? this.plus((_this$plus = {}, _this$plus[unit] = 1, _this$plus)).startOf(unit).minus(1) : this;
      } // OUTPUT

      /**
       * Returns a string representation of this DateTime formatted according to the specified format string.
       * **You may not want this.** See {@link DateTime#toLocaleString} for a more flexible formatting tool. For a table of tokens and their interpretations, see [here](https://moment.github.io/luxon/#/formatting?id=table-of-tokens).
       * Defaults to en-US if no locale has been specified, regardless of the system's locale.
       * @param {string} fmt - the format string
       * @param {Object} opts - opts to override the configuration options on this DateTime
       * @example DateTime.now().toFormat('yyyy LLL dd') //=> '2017 Apr 22'
       * @example DateTime.now().setLocale('fr').toFormat('yyyy LLL dd') //=> '2017 avr. 22'
       * @example DateTime.now().toFormat('yyyy LLL dd', { locale: "fr" }) //=> '2017 avr. 22'
       * @example DateTime.now().toFormat("HH 'hours and' mm 'minutes'") //=> '20 hours and 55 minutes'
       * @return {string}
       */
      ;

      _proto.toFormat = function toFormat(fmt, opts) {
        if (opts === void 0) {
          opts = {};
        }

        return this.isValid ? Formatter.create(this.loc.redefaultToEN(opts)).formatDateTimeFromString(this, fmt) : INVALID;
      }
      /**
       * Returns a localized string representing this date. Accepts the same options as the Intl.DateTimeFormat constructor and any presets defined by Luxon, such as `DateTime.DATE_FULL` or `DateTime.TIME_SIMPLE`.
       * The exact behavior of this method is browser-specific, but in general it will return an appropriate representation
       * of the DateTime in the assigned locale.
       * Defaults to the system's locale if no locale has been specified
       * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
       * @param formatOpts {Object} - Intl.DateTimeFormat constructor options and configuration options
       * @param {Object} opts - opts to override the configuration options on this DateTime
       * @example DateTime.now().toLocaleString(); //=> 4/20/2017
       * @example DateTime.now().setLocale('en-gb').toLocaleString(); //=> '20/04/2017'
       * @example DateTime.now().toLocaleString({ locale: 'en-gb' }); //=> '20/04/2017'
       * @example DateTime.now().toLocaleString(DateTime.DATE_FULL); //=> 'April 20, 2017'
       * @example DateTime.now().toLocaleString(DateTime.TIME_SIMPLE); //=> '11:32 AM'
       * @example DateTime.now().toLocaleString(DateTime.DATETIME_SHORT); //=> '4/20/2017, 11:32 AM'
       * @example DateTime.now().toLocaleString({ weekday: 'long', month: 'long', day: '2-digit' }); //=> 'Thursday, April 20'
       * @example DateTime.now().toLocaleString({ weekday: 'short', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }); //=> 'Thu, Apr 20, 11:27 AM'
       * @example DateTime.now().toLocaleString({ hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }); //=> '11:32'
       * @return {string}
       */
      ;

      _proto.toLocaleString = function toLocaleString(formatOpts, opts) {
        if (formatOpts === void 0) {
          formatOpts = DATE_SHORT;
        }

        if (opts === void 0) {
          opts = {};
        }

        return this.isValid ? Formatter.create(this.loc.clone(opts), formatOpts).formatDateTime(this) : INVALID;
      }
      /**
       * Returns an array of format "parts", meaning individual tokens along with metadata. This is allows callers to post-process individual sections of the formatted output.
       * Defaults to the system's locale if no locale has been specified
       * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat/formatToParts
       * @param opts {Object} - Intl.DateTimeFormat constructor options, same as `toLocaleString`.
       * @example DateTime.now().toLocaleParts(); //=> [
       *                                   //=>   { type: 'day', value: '25' },
       *                                   //=>   { type: 'literal', value: '/' },
       *                                   //=>   { type: 'month', value: '05' },
       *                                   //=>   { type: 'literal', value: '/' },
       *                                   //=>   { type: 'year', value: '1982' }
       *                                   //=> ]
       */
      ;

      _proto.toLocaleParts = function toLocaleParts(opts) {
        if (opts === void 0) {
          opts = {};
        }

        return this.isValid ? Formatter.create(this.loc.clone(opts), opts).formatDateTimeParts(this) : [];
      }
      /**
       * Returns an ISO 8601-compliant string representation of this DateTime
       * @param {Object} opts - options
       * @param {boolean} [opts.suppressMilliseconds=false] - exclude milliseconds from the format if they're 0
       * @param {boolean} [opts.suppressSeconds=false] - exclude seconds from the format if they're 0
       * @param {boolean} [opts.includeOffset=true] - include the offset, such as 'Z' or '-04:00'
       * @param {string} [opts.format='extended'] - choose between the basic and extended format
       * @example DateTime.utc(1983, 5, 25).toISO() //=> '1982-05-25T00:00:00.000Z'
       * @example DateTime.now().toISO() //=> '2017-04-22T20:47:05.335-04:00'
       * @example DateTime.now().toISO({ includeOffset: false }) //=> '2017-04-22T20:47:05.335'
       * @example DateTime.now().toISO({ format: 'basic' }) //=> '20170422T204705.335-0400'
       * @return {string}
       */
      ;

      _proto.toISO = function toISO(_temp3) {
        var _ref4 = _temp3 === void 0 ? {} : _temp3,
            _ref4$format = _ref4.format,
            format = _ref4$format === void 0 ? "extended" : _ref4$format,
            _ref4$suppressSeconds = _ref4.suppressSeconds,
            suppressSeconds = _ref4$suppressSeconds === void 0 ? false : _ref4$suppressSeconds,
            _ref4$suppressMillise = _ref4.suppressMilliseconds,
            suppressMilliseconds = _ref4$suppressMillise === void 0 ? false : _ref4$suppressMillise,
            _ref4$includeOffset = _ref4.includeOffset,
            includeOffset = _ref4$includeOffset === void 0 ? true : _ref4$includeOffset;

        if (!this.isValid) {
          return null;
        }

        var ext = format === "extended";

        var c = _toISODate(this, ext);

        c += "T";
        c += _toISOTime(this, ext, suppressSeconds, suppressMilliseconds, includeOffset);
        return c;
      }
      /**
       * Returns an ISO 8601-compliant string representation of this DateTime's date component
       * @param {Object} opts - options
       * @param {string} [opts.format='extended'] - choose between the basic and extended format
       * @example DateTime.utc(1982, 5, 25).toISODate() //=> '1982-05-25'
       * @example DateTime.utc(1982, 5, 25).toISODate({ format: 'basic' }) //=> '19820525'
       * @return {string}
       */
      ;

      _proto.toISODate = function toISODate(_temp4) {
        var _ref5 = _temp4 === void 0 ? {} : _temp4,
            _ref5$format = _ref5.format,
            format = _ref5$format === void 0 ? "extended" : _ref5$format;

        if (!this.isValid) {
          return null;
        }

        return _toISODate(this, format === "extended");
      }
      /**
       * Returns an ISO 8601-compliant string representation of this DateTime's week date
       * @example DateTime.utc(1982, 5, 25).toISOWeekDate() //=> '1982-W21-2'
       * @return {string}
       */
      ;

      _proto.toISOWeekDate = function toISOWeekDate() {
        return toTechFormat(this, "kkkk-'W'WW-c");
      }
      /**
       * Returns an ISO 8601-compliant string representation of this DateTime's time component
       * @param {Object} opts - options
       * @param {boolean} [opts.suppressMilliseconds=false] - exclude milliseconds from the format if they're 0
       * @param {boolean} [opts.suppressSeconds=false] - exclude seconds from the format if they're 0
       * @param {boolean} [opts.includeOffset=true] - include the offset, such as 'Z' or '-04:00'
       * @param {boolean} [opts.includePrefix=false] - include the `T` prefix
       * @param {string} [opts.format='extended'] - choose between the basic and extended format
       * @example DateTime.utc().set({ hour: 7, minute: 34 }).toISOTime() //=> '07:34:19.361Z'
       * @example DateTime.utc().set({ hour: 7, minute: 34, seconds: 0, milliseconds: 0 }).toISOTime({ suppressSeconds: true }) //=> '07:34Z'
       * @example DateTime.utc().set({ hour: 7, minute: 34 }).toISOTime({ format: 'basic' }) //=> '073419.361Z'
       * @example DateTime.utc().set({ hour: 7, minute: 34 }).toISOTime({ includePrefix: true }) //=> 'T07:34:19.361Z'
       * @return {string}
       */
      ;

      _proto.toISOTime = function toISOTime(_temp5) {
        var _ref6 = _temp5 === void 0 ? {} : _temp5,
            _ref6$suppressMillise = _ref6.suppressMilliseconds,
            suppressMilliseconds = _ref6$suppressMillise === void 0 ? false : _ref6$suppressMillise,
            _ref6$suppressSeconds = _ref6.suppressSeconds,
            suppressSeconds = _ref6$suppressSeconds === void 0 ? false : _ref6$suppressSeconds,
            _ref6$includeOffset = _ref6.includeOffset,
            includeOffset = _ref6$includeOffset === void 0 ? true : _ref6$includeOffset,
            _ref6$includePrefix = _ref6.includePrefix,
            includePrefix = _ref6$includePrefix === void 0 ? false : _ref6$includePrefix,
            _ref6$format = _ref6.format,
            format = _ref6$format === void 0 ? "extended" : _ref6$format;

        if (!this.isValid) {
          return null;
        }

        var c = includePrefix ? "T" : "";
        return c + _toISOTime(this, format === "extended", suppressSeconds, suppressMilliseconds, includeOffset);
      }
      /**
       * Returns an RFC 2822-compatible string representation of this DateTime
       * @example DateTime.utc(2014, 7, 13).toRFC2822() //=> 'Sun, 13 Jul 2014 00:00:00 +0000'
       * @example DateTime.local(2014, 7, 13).toRFC2822() //=> 'Sun, 13 Jul 2014 00:00:00 -0400'
       * @return {string}
       */
      ;

      _proto.toRFC2822 = function toRFC2822() {
        return toTechFormat(this, "EEE, dd LLL yyyy HH:mm:ss ZZZ", false);
      }
      /**
       * Returns a string representation of this DateTime appropriate for use in HTTP headers. The output is always expressed in GMT.
       * Specifically, the string conforms to RFC 1123.
       * @see https://www.w3.org/Protocols/rfc2616/rfc2616-sec3.html#sec3.3.1
       * @example DateTime.utc(2014, 7, 13).toHTTP() //=> 'Sun, 13 Jul 2014 00:00:00 GMT'
       * @example DateTime.utc(2014, 7, 13, 19).toHTTP() //=> 'Sun, 13 Jul 2014 19:00:00 GMT'
       * @return {string}
       */
      ;

      _proto.toHTTP = function toHTTP() {
        return toTechFormat(this.toUTC(), "EEE, dd LLL yyyy HH:mm:ss 'GMT'");
      }
      /**
       * Returns a string representation of this DateTime appropriate for use in SQL Date
       * @example DateTime.utc(2014, 7, 13).toSQLDate() //=> '2014-07-13'
       * @return {string}
       */
      ;

      _proto.toSQLDate = function toSQLDate() {
        if (!this.isValid) {
          return null;
        }

        return _toISODate(this, true);
      }
      /**
       * Returns a string representation of this DateTime appropriate for use in SQL Time
       * @param {Object} opts - options
       * @param {boolean} [opts.includeZone=false] - include the zone, such as 'America/New_York'. Overrides includeOffset.
       * @param {boolean} [opts.includeOffset=true] - include the offset, such as 'Z' or '-04:00'
       * @param {boolean} [opts.includeOffsetSpace=true] - include the space between the time and the offset, such as '05:15:16.345 -04:00'
       * @example DateTime.utc().toSQL() //=> '05:15:16.345'
       * @example DateTime.now().toSQL() //=> '05:15:16.345 -04:00'
       * @example DateTime.now().toSQL({ includeOffset: false }) //=> '05:15:16.345'
       * @example DateTime.now().toSQL({ includeZone: false }) //=> '05:15:16.345 America/New_York'
       * @return {string}
       */
      ;

      _proto.toSQLTime = function toSQLTime(_temp6) {
        var _ref7 = _temp6 === void 0 ? {} : _temp6,
            _ref7$includeOffset = _ref7.includeOffset,
            includeOffset = _ref7$includeOffset === void 0 ? true : _ref7$includeOffset,
            _ref7$includeZone = _ref7.includeZone,
            includeZone = _ref7$includeZone === void 0 ? false : _ref7$includeZone,
            _ref7$includeOffsetSp = _ref7.includeOffsetSpace,
            includeOffsetSpace = _ref7$includeOffsetSp === void 0 ? true : _ref7$includeOffsetSp;

        var fmt = "HH:mm:ss.SSS";

        if (includeZone || includeOffset) {
          if (includeOffsetSpace) {
            fmt += " ";
          }

          if (includeZone) {
            fmt += "z";
          } else if (includeOffset) {
            fmt += "ZZ";
          }
        }

        return toTechFormat(this, fmt, true);
      }
      /**
       * Returns a string representation of this DateTime appropriate for use in SQL DateTime
       * @param {Object} opts - options
       * @param {boolean} [opts.includeZone=false] - include the zone, such as 'America/New_York'. Overrides includeOffset.
       * @param {boolean} [opts.includeOffset=true] - include the offset, such as 'Z' or '-04:00'
       * @param {boolean} [opts.includeOffsetSpace=true] - include the space between the time and the offset, such as '05:15:16.345 -04:00'
       * @example DateTime.utc(2014, 7, 13).toSQL() //=> '2014-07-13 00:00:00.000 Z'
       * @example DateTime.local(2014, 7, 13).toSQL() //=> '2014-07-13 00:00:00.000 -04:00'
       * @example DateTime.local(2014, 7, 13).toSQL({ includeOffset: false }) //=> '2014-07-13 00:00:00.000'
       * @example DateTime.local(2014, 7, 13).toSQL({ includeZone: true }) //=> '2014-07-13 00:00:00.000 America/New_York'
       * @return {string}
       */
      ;

      _proto.toSQL = function toSQL(opts) {
        if (opts === void 0) {
          opts = {};
        }

        if (!this.isValid) {
          return null;
        }

        return this.toSQLDate() + " " + this.toSQLTime(opts);
      }
      /**
       * Returns a string representation of this DateTime appropriate for debugging
       * @return {string}
       */
      ;

      _proto.toString = function toString() {
        return this.isValid ? this.toISO() : INVALID;
      }
      /**
       * Returns the epoch milliseconds of this DateTime. Alias of {@link DateTime#toMillis}
       * @return {number}
       */
      ;

      _proto.valueOf = function valueOf() {
        return this.toMillis();
      }
      /**
       * Returns the epoch milliseconds of this DateTime.
       * @return {number}
       */
      ;

      _proto.toMillis = function toMillis() {
        return this.isValid ? this.ts : NaN;
      }
      /**
       * Returns the epoch seconds of this DateTime.
       * @return {number}
       */
      ;

      _proto.toSeconds = function toSeconds() {
        return this.isValid ? this.ts / 1000 : NaN;
      }
      /**
       * Returns the epoch seconds (as a whole number) of this DateTime.
       * @return {number}
       */
      ;

      _proto.toUnixInteger = function toUnixInteger() {
        return this.isValid ? Math.floor(this.ts / 1000) : NaN;
      }
      /**
       * Returns an ISO 8601 representation of this DateTime appropriate for use in JSON.
       * @return {string}
       */
      ;

      _proto.toJSON = function toJSON() {
        return this.toISO();
      }
      /**
       * Returns a BSON serializable equivalent to this DateTime.
       * @return {Date}
       */
      ;

      _proto.toBSON = function toBSON() {
        return this.toJSDate();
      }
      /**
       * Returns a JavaScript object with this DateTime's year, month, day, and so on.
       * @param opts - options for generating the object
       * @param {boolean} [opts.includeConfig=false] - include configuration attributes in the output
       * @example DateTime.now().toObject() //=> { year: 2017, month: 4, day: 22, hour: 20, minute: 49, second: 42, millisecond: 268 }
       * @return {Object}
       */
      ;

      _proto.toObject = function toObject(opts) {
        if (opts === void 0) {
          opts = {};
        }

        if (!this.isValid) return {};

        var base = _extends({}, this.c);

        if (opts.includeConfig) {
          base.outputCalendar = this.outputCalendar;
          base.numberingSystem = this.loc.numberingSystem;
          base.locale = this.loc.locale;
        }

        return base;
      }
      /**
       * Returns a JavaScript Date equivalent to this DateTime.
       * @return {Date}
       */
      ;

      _proto.toJSDate = function toJSDate() {
        return new Date(this.isValid ? this.ts : NaN);
      } // COMPARE

      /**
       * Return the difference between two DateTimes as a Duration.
       * @param {DateTime} otherDateTime - the DateTime to compare this one to
       * @param {string|string[]} [unit=['milliseconds']] - the unit or array of units (such as 'hours' or 'days') to include in the duration.
       * @param {Object} opts - options that affect the creation of the Duration
       * @param {string} [opts.conversionAccuracy='casual'] - the conversion system to use
       * @example
       * var i1 = DateTime.fromISO('1982-05-25T09:45'),
       *     i2 = DateTime.fromISO('1983-10-14T10:30');
       * i2.diff(i1).toObject() //=> { milliseconds: 43807500000 }
       * i2.diff(i1, 'hours').toObject() //=> { hours: 12168.75 }
       * i2.diff(i1, ['months', 'days']).toObject() //=> { months: 16, days: 19.03125 }
       * i2.diff(i1, ['months', 'days', 'hours']).toObject() //=> { months: 16, days: 19, hours: 0.75 }
       * @return {Duration}
       */
      ;

      _proto.diff = function diff(otherDateTime, unit, opts) {
        if (unit === void 0) {
          unit = "milliseconds";
        }

        if (opts === void 0) {
          opts = {};
        }

        if (!this.isValid || !otherDateTime.isValid) {
          return Duration.invalid("created by diffing an invalid DateTime");
        }

        var durOpts = _extends({
          locale: this.locale,
          numberingSystem: this.numberingSystem
        }, opts);

        var units = maybeArray(unit).map(Duration.normalizeUnit),
            otherIsLater = otherDateTime.valueOf() > this.valueOf(),
            earlier = otherIsLater ? this : otherDateTime,
            later = otherIsLater ? otherDateTime : this,
            diffed = _diff(earlier, later, units, durOpts);

        return otherIsLater ? diffed.negate() : diffed;
      }
      /**
       * Return the difference between this DateTime and right now.
       * See {@link DateTime#diff}
       * @param {string|string[]} [unit=['milliseconds']] - the unit or units units (such as 'hours' or 'days') to include in the duration
       * @param {Object} opts - options that affect the creation of the Duration
       * @param {string} [opts.conversionAccuracy='casual'] - the conversion system to use
       * @return {Duration}
       */
      ;

      _proto.diffNow = function diffNow(unit, opts) {
        if (unit === void 0) {
          unit = "milliseconds";
        }

        if (opts === void 0) {
          opts = {};
        }

        return this.diff(DateTime.now(), unit, opts);
      }
      /**
       * Return an Interval spanning between this DateTime and another DateTime
       * @param {DateTime} otherDateTime - the other end point of the Interval
       * @return {Interval}
       */
      ;

      _proto.until = function until(otherDateTime) {
        return this.isValid ? Interval.fromDateTimes(this, otherDateTime) : this;
      }
      /**
       * Return whether this DateTime is in the same unit of time as another DateTime.
       * Higher-order units must also be identical for this function to return `true`.
       * Note that time zones are **ignored** in this comparison, which compares the **local** calendar time. Use {@link DateTime#setZone} to convert one of the dates if needed.
       * @param {DateTime} otherDateTime - the other DateTime
       * @param {string} unit - the unit of time to check sameness on
       * @example DateTime.now().hasSame(otherDT, 'day'); //~> true if otherDT is in the same current calendar day
       * @return {boolean}
       */
      ;

      _proto.hasSame = function hasSame(otherDateTime, unit) {
        if (!this.isValid) return false;
        var inputMs = otherDateTime.valueOf();
        var adjustedToZone = this.setZone(otherDateTime.zone, {
          keepLocalTime: true
        });
        return adjustedToZone.startOf(unit) <= inputMs && inputMs <= adjustedToZone.endOf(unit);
      }
      /**
       * Equality check
       * Two DateTimes are equal iff they represent the same millisecond, have the same zone and location, and are both valid.
       * To compare just the millisecond values, use `+dt1 === +dt2`.
       * @param {DateTime} other - the other DateTime
       * @return {boolean}
       */
      ;

      _proto.equals = function equals(other) {
        return this.isValid && other.isValid && this.valueOf() === other.valueOf() && this.zone.equals(other.zone) && this.loc.equals(other.loc);
      }
      /**
       * Returns a string representation of a this time relative to now, such as "in two days". Can only internationalize if your
       * platform supports Intl.RelativeTimeFormat. Rounds down by default.
       * @param {Object} options - options that affect the output
       * @param {DateTime} [options.base=DateTime.now()] - the DateTime to use as the basis to which this time is compared. Defaults to now.
       * @param {string} [options.style="long"] - the style of units, must be "long", "short", or "narrow"
       * @param {string|string[]} options.unit - use a specific unit or array of units; if omitted, or an array, the method will pick the best unit. Use an array or one of "years", "quarters", "months", "weeks", "days", "hours", "minutes", or "seconds"
       * @param {boolean} [options.round=true] - whether to round the numbers in the output.
       * @param {number} [options.padding=0] - padding in milliseconds. This allows you to round up the result if it fits inside the threshold. Don't use in combination with {round: false} because the decimal output will include the padding.
       * @param {string} options.locale - override the locale of this DateTime
       * @param {string} options.numberingSystem - override the numberingSystem of this DateTime. The Intl system may choose not to honor this
       * @example DateTime.now().plus({ days: 1 }).toRelative() //=> "in 1 day"
       * @example DateTime.now().setLocale("es").toRelative({ days: 1 }) //=> "dentro de 1 día"
       * @example DateTime.now().plus({ days: 1 }).toRelative({ locale: "fr" }) //=> "dans 23 heures"
       * @example DateTime.now().minus({ days: 2 }).toRelative() //=> "2 days ago"
       * @example DateTime.now().minus({ days: 2 }).toRelative({ unit: "hours" }) //=> "48 hours ago"
       * @example DateTime.now().minus({ hours: 36 }).toRelative({ round: false }) //=> "1.5 days ago"
       */
      ;

      _proto.toRelative = function toRelative(options) {
        if (options === void 0) {
          options = {};
        }

        if (!this.isValid) return null;
        var base = options.base || DateTime.fromObject({}, {
          zone: this.zone
        }),
            padding = options.padding ? this < base ? -options.padding : options.padding : 0;
        var units = ["years", "months", "days", "hours", "minutes", "seconds"];
        var unit = options.unit;

        if (Array.isArray(options.unit)) {
          units = options.unit;
          unit = undefined;
        }

        return diffRelative(base, this.plus(padding), _extends({}, options, {
          numeric: "always",
          units: units,
          unit: unit
        }));
      }
      /**
       * Returns a string representation of this date relative to today, such as "yesterday" or "next month".
       * Only internationalizes on platforms that supports Intl.RelativeTimeFormat.
       * @param {Object} options - options that affect the output
       * @param {DateTime} [options.base=DateTime.now()] - the DateTime to use as the basis to which this time is compared. Defaults to now.
       * @param {string} options.locale - override the locale of this DateTime
       * @param {string} options.unit - use a specific unit; if omitted, the method will pick the unit. Use one of "years", "quarters", "months", "weeks", or "days"
       * @param {string} options.numberingSystem - override the numberingSystem of this DateTime. The Intl system may choose not to honor this
       * @example DateTime.now().plus({ days: 1 }).toRelativeCalendar() //=> "tomorrow"
       * @example DateTime.now().setLocale("es").plus({ days: 1 }).toRelative() //=> ""mañana"
       * @example DateTime.now().plus({ days: 1 }).toRelativeCalendar({ locale: "fr" }) //=> "demain"
       * @example DateTime.now().minus({ days: 2 }).toRelativeCalendar() //=> "2 days ago"
       */
      ;

      _proto.toRelativeCalendar = function toRelativeCalendar(options) {
        if (options === void 0) {
          options = {};
        }

        if (!this.isValid) return null;
        return diffRelative(options.base || DateTime.fromObject({}, {
          zone: this.zone
        }), this, _extends({}, options, {
          numeric: "auto",
          units: ["years", "months", "days"],
          calendary: true
        }));
      }
      /**
       * Return the min of several date times
       * @param {...DateTime} dateTimes - the DateTimes from which to choose the minimum
       * @return {DateTime} the min DateTime, or undefined if called with no argument
       */
      ;

      DateTime.min = function min() {
        for (var _len = arguments.length, dateTimes = new Array(_len), _key = 0; _key < _len; _key++) {
          dateTimes[_key] = arguments[_key];
        }

        if (!dateTimes.every(DateTime.isDateTime)) {
          throw new InvalidArgumentError("min requires all arguments be DateTimes");
        }

        return bestBy(dateTimes, function (i) {
          return i.valueOf();
        }, Math.min);
      }
      /**
       * Return the max of several date times
       * @param {...DateTime} dateTimes - the DateTimes from which to choose the maximum
       * @return {DateTime} the max DateTime, or undefined if called with no argument
       */
      ;

      DateTime.max = function max() {
        for (var _len2 = arguments.length, dateTimes = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          dateTimes[_key2] = arguments[_key2];
        }

        if (!dateTimes.every(DateTime.isDateTime)) {
          throw new InvalidArgumentError("max requires all arguments be DateTimes");
        }

        return bestBy(dateTimes, function (i) {
          return i.valueOf();
        }, Math.max);
      } // MISC

      /**
       * Explain how a string would be parsed by fromFormat()
       * @param {string} text - the string to parse
       * @param {string} fmt - the format the string is expected to be in (see description)
       * @param {Object} options - options taken by fromFormat()
       * @return {Object}
       */
      ;

      DateTime.fromFormatExplain = function fromFormatExplain(text, fmt, options) {
        if (options === void 0) {
          options = {};
        }

        var _options = options,
            _options$locale = _options.locale,
            locale = _options$locale === void 0 ? null : _options$locale,
            _options$numberingSys = _options.numberingSystem,
            numberingSystem = _options$numberingSys === void 0 ? null : _options$numberingSys,
            localeToUse = Locale.fromOpts({
          locale: locale,
          numberingSystem: numberingSystem,
          defaultToEN: true
        });
        return explainFromTokens(localeToUse, text, fmt);
      }
      /**
       * @deprecated use fromFormatExplain instead
       */
      ;

      DateTime.fromStringExplain = function fromStringExplain(text, fmt, options) {
        if (options === void 0) {
          options = {};
        }

        return DateTime.fromFormatExplain(text, fmt, options);
      } // FORMAT PRESETS

      /**
       * {@link DateTime#toLocaleString} format like 10/14/1983
       * @type {Object}
       */
      ;

      _createClass(DateTime, [{
        key: "isValid",
        get: function get() {
          return this.invalid === null;
        }
        /**
         * Returns an error code if this DateTime is invalid, or null if the DateTime is valid
         * @type {string}
         */

      }, {
        key: "invalidReason",
        get: function get() {
          return this.invalid ? this.invalid.reason : null;
        }
        /**
         * Returns an explanation of why this DateTime became invalid, or null if the DateTime is valid
         * @type {string}
         */

      }, {
        key: "invalidExplanation",
        get: function get() {
          return this.invalid ? this.invalid.explanation : null;
        }
        /**
         * Get the locale of a DateTime, such 'en-GB'. The locale is used when formatting the DateTime
         *
         * @type {string}
         */

      }, {
        key: "locale",
        get: function get() {
          return this.isValid ? this.loc.locale : null;
        }
        /**
         * Get the numbering system of a DateTime, such 'beng'. The numbering system is used when formatting the DateTime
         *
         * @type {string}
         */

      }, {
        key: "numberingSystem",
        get: function get() {
          return this.isValid ? this.loc.numberingSystem : null;
        }
        /**
         * Get the output calendar of a DateTime, such 'islamic'. The output calendar is used when formatting the DateTime
         *
         * @type {string}
         */

      }, {
        key: "outputCalendar",
        get: function get() {
          return this.isValid ? this.loc.outputCalendar : null;
        }
        /**
         * Get the time zone associated with this DateTime.
         * @type {Zone}
         */

      }, {
        key: "zone",
        get: function get() {
          return this._zone;
        }
        /**
         * Get the name of the time zone.
         * @type {string}
         */

      }, {
        key: "zoneName",
        get: function get() {
          return this.isValid ? this.zone.name : null;
        }
        /**
         * Get the year
         * @example DateTime.local(2017, 5, 25).year //=> 2017
         * @type {number}
         */

      }, {
        key: "year",
        get: function get() {
          return this.isValid ? this.c.year : NaN;
        }
        /**
         * Get the quarter
         * @example DateTime.local(2017, 5, 25).quarter //=> 2
         * @type {number}
         */

      }, {
        key: "quarter",
        get: function get() {
          return this.isValid ? Math.ceil(this.c.month / 3) : NaN;
        }
        /**
         * Get the month (1-12).
         * @example DateTime.local(2017, 5, 25).month //=> 5
         * @type {number}
         */

      }, {
        key: "month",
        get: function get() {
          return this.isValid ? this.c.month : NaN;
        }
        /**
         * Get the day of the month (1-30ish).
         * @example DateTime.local(2017, 5, 25).day //=> 25
         * @type {number}
         */

      }, {
        key: "day",
        get: function get() {
          return this.isValid ? this.c.day : NaN;
        }
        /**
         * Get the hour of the day (0-23).
         * @example DateTime.local(2017, 5, 25, 9).hour //=> 9
         * @type {number}
         */

      }, {
        key: "hour",
        get: function get() {
          return this.isValid ? this.c.hour : NaN;
        }
        /**
         * Get the minute of the hour (0-59).
         * @example DateTime.local(2017, 5, 25, 9, 30).minute //=> 30
         * @type {number}
         */

      }, {
        key: "minute",
        get: function get() {
          return this.isValid ? this.c.minute : NaN;
        }
        /**
         * Get the second of the minute (0-59).
         * @example DateTime.local(2017, 5, 25, 9, 30, 52).second //=> 52
         * @type {number}
         */

      }, {
        key: "second",
        get: function get() {
          return this.isValid ? this.c.second : NaN;
        }
        /**
         * Get the millisecond of the second (0-999).
         * @example DateTime.local(2017, 5, 25, 9, 30, 52, 654).millisecond //=> 654
         * @type {number}
         */

      }, {
        key: "millisecond",
        get: function get() {
          return this.isValid ? this.c.millisecond : NaN;
        }
        /**
         * Get the week year
         * @see https://en.wikipedia.org/wiki/ISO_week_date
         * @example DateTime.local(2014, 12, 31).weekYear //=> 2015
         * @type {number}
         */

      }, {
        key: "weekYear",
        get: function get() {
          return this.isValid ? possiblyCachedWeekData(this).weekYear : NaN;
        }
        /**
         * Get the week number of the week year (1-52ish).
         * @see https://en.wikipedia.org/wiki/ISO_week_date
         * @example DateTime.local(2017, 5, 25).weekNumber //=> 21
         * @type {number}
         */

      }, {
        key: "weekNumber",
        get: function get() {
          return this.isValid ? possiblyCachedWeekData(this).weekNumber : NaN;
        }
        /**
         * Get the day of the week.
         * 1 is Monday and 7 is Sunday
         * @see https://en.wikipedia.org/wiki/ISO_week_date
         * @example DateTime.local(2014, 11, 31).weekday //=> 4
         * @type {number}
         */

      }, {
        key: "weekday",
        get: function get() {
          return this.isValid ? possiblyCachedWeekData(this).weekday : NaN;
        }
        /**
         * Get the ordinal (meaning the day of the year)
         * @example DateTime.local(2017, 5, 25).ordinal //=> 145
         * @type {number|DateTime}
         */

      }, {
        key: "ordinal",
        get: function get() {
          return this.isValid ? gregorianToOrdinal(this.c).ordinal : NaN;
        }
        /**
         * Get the human readable short month name, such as 'Oct'.
         * Defaults to the system's locale if no locale has been specified
         * @example DateTime.local(2017, 10, 30).monthShort //=> Oct
         * @type {string}
         */

      }, {
        key: "monthShort",
        get: function get() {
          return this.isValid ? Info.months("short", {
            locObj: this.loc
          })[this.month - 1] : null;
        }
        /**
         * Get the human readable long month name, such as 'October'.
         * Defaults to the system's locale if no locale has been specified
         * @example DateTime.local(2017, 10, 30).monthLong //=> October
         * @type {string}
         */

      }, {
        key: "monthLong",
        get: function get() {
          return this.isValid ? Info.months("long", {
            locObj: this.loc
          })[this.month - 1] : null;
        }
        /**
         * Get the human readable short weekday, such as 'Mon'.
         * Defaults to the system's locale if no locale has been specified
         * @example DateTime.local(2017, 10, 30).weekdayShort //=> Mon
         * @type {string}
         */

      }, {
        key: "weekdayShort",
        get: function get() {
          return this.isValid ? Info.weekdays("short", {
            locObj: this.loc
          })[this.weekday - 1] : null;
        }
        /**
         * Get the human readable long weekday, such as 'Monday'.
         * Defaults to the system's locale if no locale has been specified
         * @example DateTime.local(2017, 10, 30).weekdayLong //=> Monday
         * @type {string}
         */

      }, {
        key: "weekdayLong",
        get: function get() {
          return this.isValid ? Info.weekdays("long", {
            locObj: this.loc
          })[this.weekday - 1] : null;
        }
        /**
         * Get the UTC offset of this DateTime in minutes
         * @example DateTime.now().offset //=> -240
         * @example DateTime.utc().offset //=> 0
         * @type {number}
         */

      }, {
        key: "offset",
        get: function get() {
          return this.isValid ? +this.o : NaN;
        }
        /**
         * Get the short human name for the zone's current offset, for example "EST" or "EDT".
         * Defaults to the system's locale if no locale has been specified
         * @type {string}
         */

      }, {
        key: "offsetNameShort",
        get: function get() {
          if (this.isValid) {
            return this.zone.offsetName(this.ts, {
              format: "short",
              locale: this.locale
            });
          } else {
            return null;
          }
        }
        /**
         * Get the long human name for the zone's current offset, for example "Eastern Standard Time" or "Eastern Daylight Time".
         * Defaults to the system's locale if no locale has been specified
         * @type {string}
         */

      }, {
        key: "offsetNameLong",
        get: function get() {
          if (this.isValid) {
            return this.zone.offsetName(this.ts, {
              format: "long",
              locale: this.locale
            });
          } else {
            return null;
          }
        }
        /**
         * Get whether this zone's offset ever changes, as in a DST.
         * @type {boolean}
         */

      }, {
        key: "isOffsetFixed",
        get: function get() {
          return this.isValid ? this.zone.isUniversal : null;
        }
        /**
         * Get whether the DateTime is in a DST.
         * @type {boolean}
         */

      }, {
        key: "isInDST",
        get: function get() {
          if (this.isOffsetFixed) {
            return false;
          } else {
            return this.offset > this.set({
              month: 1
            }).offset || this.offset > this.set({
              month: 5
            }).offset;
          }
        }
        /**
         * Returns true if this DateTime is in a leap year, false otherwise
         * @example DateTime.local(2016).isInLeapYear //=> true
         * @example DateTime.local(2013).isInLeapYear //=> false
         * @type {boolean}
         */

      }, {
        key: "isInLeapYear",
        get: function get() {
          return isLeapYear(this.year);
        }
        /**
         * Returns the number of days in this DateTime's month
         * @example DateTime.local(2016, 2).daysInMonth //=> 29
         * @example DateTime.local(2016, 3).daysInMonth //=> 31
         * @type {number}
         */

      }, {
        key: "daysInMonth",
        get: function get() {
          return daysInMonth(this.year, this.month);
        }
        /**
         * Returns the number of days in this DateTime's year
         * @example DateTime.local(2016).daysInYear //=> 366
         * @example DateTime.local(2013).daysInYear //=> 365
         * @type {number}
         */

      }, {
        key: "daysInYear",
        get: function get() {
          return this.isValid ? daysInYear(this.year) : NaN;
        }
        /**
         * Returns the number of weeks in this DateTime's year
         * @see https://en.wikipedia.org/wiki/ISO_week_date
         * @example DateTime.local(2004).weeksInWeekYear //=> 53
         * @example DateTime.local(2013).weeksInWeekYear //=> 52
         * @type {number}
         */

      }, {
        key: "weeksInWeekYear",
        get: function get() {
          return this.isValid ? weeksInWeekYear(this.weekYear) : NaN;
        }
      }], [{
        key: "DATE_SHORT",
        get: function get() {
          return DATE_SHORT;
        }
        /**
         * {@link DateTime#toLocaleString} format like 'Oct 14, 1983'
         * @type {Object}
         */

      }, {
        key: "DATE_MED",
        get: function get() {
          return DATE_MED;
        }
        /**
         * {@link DateTime#toLocaleString} format like 'Fri, Oct 14, 1983'
         * @type {Object}
         */

      }, {
        key: "DATE_MED_WITH_WEEKDAY",
        get: function get() {
          return DATE_MED_WITH_WEEKDAY;
        }
        /**
         * {@link DateTime#toLocaleString} format like 'October 14, 1983'
         * @type {Object}
         */

      }, {
        key: "DATE_FULL",
        get: function get() {
          return DATE_FULL;
        }
        /**
         * {@link DateTime#toLocaleString} format like 'Tuesday, October 14, 1983'
         * @type {Object}
         */

      }, {
        key: "DATE_HUGE",
        get: function get() {
          return DATE_HUGE;
        }
        /**
         * {@link DateTime#toLocaleString} format like '09:30 AM'. Only 12-hour if the locale is.
         * @type {Object}
         */

      }, {
        key: "TIME_SIMPLE",
        get: function get() {
          return TIME_SIMPLE;
        }
        /**
         * {@link DateTime#toLocaleString} format like '09:30:23 AM'. Only 12-hour if the locale is.
         * @type {Object}
         */

      }, {
        key: "TIME_WITH_SECONDS",
        get: function get() {
          return TIME_WITH_SECONDS;
        }
        /**
         * {@link DateTime#toLocaleString} format like '09:30:23 AM EDT'. Only 12-hour if the locale is.
         * @type {Object}
         */

      }, {
        key: "TIME_WITH_SHORT_OFFSET",
        get: function get() {
          return TIME_WITH_SHORT_OFFSET;
        }
        /**
         * {@link DateTime#toLocaleString} format like '09:30:23 AM Eastern Daylight Time'. Only 12-hour if the locale is.
         * @type {Object}
         */

      }, {
        key: "TIME_WITH_LONG_OFFSET",
        get: function get() {
          return TIME_WITH_LONG_OFFSET;
        }
        /**
         * {@link DateTime#toLocaleString} format like '09:30', always 24-hour.
         * @type {Object}
         */

      }, {
        key: "TIME_24_SIMPLE",
        get: function get() {
          return TIME_24_SIMPLE;
        }
        /**
         * {@link DateTime#toLocaleString} format like '09:30:23', always 24-hour.
         * @type {Object}
         */

      }, {
        key: "TIME_24_WITH_SECONDS",
        get: function get() {
          return TIME_24_WITH_SECONDS;
        }
        /**
         * {@link DateTime#toLocaleString} format like '09:30:23 EDT', always 24-hour.
         * @type {Object}
         */

      }, {
        key: "TIME_24_WITH_SHORT_OFFSET",
        get: function get() {
          return TIME_24_WITH_SHORT_OFFSET;
        }
        /**
         * {@link DateTime#toLocaleString} format like '09:30:23 Eastern Daylight Time', always 24-hour.
         * @type {Object}
         */

      }, {
        key: "TIME_24_WITH_LONG_OFFSET",
        get: function get() {
          return TIME_24_WITH_LONG_OFFSET;
        }
        /**
         * {@link DateTime#toLocaleString} format like '10/14/1983, 9:30 AM'. Only 12-hour if the locale is.
         * @type {Object}
         */

      }, {
        key: "DATETIME_SHORT",
        get: function get() {
          return DATETIME_SHORT;
        }
        /**
         * {@link DateTime#toLocaleString} format like '10/14/1983, 9:30:33 AM'. Only 12-hour if the locale is.
         * @type {Object}
         */

      }, {
        key: "DATETIME_SHORT_WITH_SECONDS",
        get: function get() {
          return DATETIME_SHORT_WITH_SECONDS;
        }
        /**
         * {@link DateTime#toLocaleString} format like 'Oct 14, 1983, 9:30 AM'. Only 12-hour if the locale is.
         * @type {Object}
         */

      }, {
        key: "DATETIME_MED",
        get: function get() {
          return DATETIME_MED;
        }
        /**
         * {@link DateTime#toLocaleString} format like 'Oct 14, 1983, 9:30:33 AM'. Only 12-hour if the locale is.
         * @type {Object}
         */

      }, {
        key: "DATETIME_MED_WITH_SECONDS",
        get: function get() {
          return DATETIME_MED_WITH_SECONDS;
        }
        /**
         * {@link DateTime#toLocaleString} format like 'Fri, 14 Oct 1983, 9:30 AM'. Only 12-hour if the locale is.
         * @type {Object}
         */

      }, {
        key: "DATETIME_MED_WITH_WEEKDAY",
        get: function get() {
          return DATETIME_MED_WITH_WEEKDAY;
        }
        /**
         * {@link DateTime#toLocaleString} format like 'October 14, 1983, 9:30 AM EDT'. Only 12-hour if the locale is.
         * @type {Object}
         */

      }, {
        key: "DATETIME_FULL",
        get: function get() {
          return DATETIME_FULL;
        }
        /**
         * {@link DateTime#toLocaleString} format like 'October 14, 1983, 9:30:33 AM EDT'. Only 12-hour if the locale is.
         * @type {Object}
         */

      }, {
        key: "DATETIME_FULL_WITH_SECONDS",
        get: function get() {
          return DATETIME_FULL_WITH_SECONDS;
        }
        /**
         * {@link DateTime#toLocaleString} format like 'Friday, October 14, 1983, 9:30 AM Eastern Daylight Time'. Only 12-hour if the locale is.
         * @type {Object}
         */

      }, {
        key: "DATETIME_HUGE",
        get: function get() {
          return DATETIME_HUGE;
        }
        /**
         * {@link DateTime#toLocaleString} format like 'Friday, October 14, 1983, 9:30:33 AM Eastern Daylight Time'. Only 12-hour if the locale is.
         * @type {Object}
         */

      }, {
        key: "DATETIME_HUGE_WITH_SECONDS",
        get: function get() {
          return DATETIME_HUGE_WITH_SECONDS;
        }
      }]);

      return DateTime;
    }();
    function friendlyDateTime(dateTimeish) {
      if (DateTime.isDateTime(dateTimeish)) {
        return dateTimeish;
      } else if (dateTimeish && dateTimeish.valueOf && isNumber(dateTimeish.valueOf())) {
        return DateTime.fromJSDate(dateTimeish);
      } else if (dateTimeish && typeof dateTimeish === "object") {
        return DateTime.fromObject(dateTimeish);
      } else {
        throw new InvalidArgumentError("Unknown datetime argument: " + dateTimeish + ", of type " + typeof dateTimeish);
      }
    }

    var DateTime_1 = DateTime;

    const initialDate = { years: 1990, months: 5, days: 5, hours: 13, };

    const helpers = {
      dateToNumber(date) {
        return parseInt(date.split("/").join(""));
      },
      turingDate(date) {
        const newDate = DateTime_1.fromISO(date.replace(/[/]/g, "-")).minus(initialDate);
        return `J${newDate.year} M${newDate.month < 10 ? `0${newDate.month}` : newDate.month} T${newDate.day < 10 ? `0${newDate.day}` : newDate.day}`;
      },
      currentTuringDate() {
        const newDate = DateTime_1.now().minus(initialDate);
        return `J${newDate.year} M${newDate.month < 10 ? `0${newDate.month}` : newDate.month} T${newDate.day < 10 ? `0${newDate.day}` : newDate.day}`;
      },
      getID(client, date) {
        client = client.replace(/[\s./]/g, "").toLowerCase();
        date = date.replace(/\//g, "");
        return `${client}_${date}`;
      },
      getNewID(client, date) {
        client = client.replace(/[\s./]/g, "").toLowerCase();
        date = date.replace(/\//g, "");
        return `${date}_${client}`;
      },
      spinalCase(label) {
        return label
          .replace(/[!,.*+?^${(|[\\})\]:]/g, '')
          .replace(/&/g, 'and')
          .trim()
          .replace(/[ ]{1,}/g, "-")
          .toLowerCase();
      },
      pascalCase(label) {
        return label
          .replace(/[!,.*+?^${(|[\\})\]:]/g, '')
          .replace(/&/g, 'and')
          .trim()
          .replace(/[ ]{1,}/g, "");
      },
      titleCase(label) {
        return label
          .replace(/_/g, " ")
          .replace(/(?:^\w|[A-Z]|\b\w)/g, word => {
            return word.toUpperCase();
          })
          .trim()
          .replace(/-/g, " ");
      },
      hexToDec(number) {
        return parseInt(number, 16);
      },
      decToHex(number) {
        return (number).toString(16);
      },
      rad: Math.PI / 180,
      deg: 180 / Math.PI,
    };

    const tool = {
      html: "HTML",
      erb: "HTML/ERB",
      pug: "Pug",
      jade: "Pug",
      haml: "Haml",
      slim: "Slim",
      css: "CSS",
      sass: "SCSS",
      scss: "SCSS",
      less: "Less",
      cucumber: "Cucumber",
      unity: "Unity",
      rails: "Ruby on Rails",
      php: "PHP",
      python: "Python",
      javascript: "Javascript",
      vue: "Vue",
      angular: "Angular",
      react: "React",
      grunt: "GruntJS",
      three: "ThreeJS",
      jQuery: "jQuery",
      json: "JSON",
      miva: "Miva",
      markdown: "Markdown",
      bootstrap: "Bootstrap",
      git: "Git",
      flash: "Adobe Flash",
      illustrator: "Adobe Illustrator",
      photoshop: "Adobe Photoshop",
      indesign: "Adobe Indesign",
      afterEffects: "Adobe After Effects",
      premiere: "Adobe Premiere",
      inkscape: "Inkscape",
      typescript: "TypeScript",
      vuex: "Vuex",
      vueRouter: "Vue Router",
      sizzle: "Sizzle",
      lodash: "Lodash",
      velocity: "Velocity.js",
      canvas: "Canvas",
      sweetAlert: "Sweetalert",
      stellar: "stellarJS",
      animate: "Animate CSS",
      snapSVG: "snapSVG",
      chartJS: "ChartJS",
      wordpress: "Wordpress",
      kotlin: "Kotlin",
      tweenMax: "TweenMax",
      firebase: "Firebase",
      webpack: "Webpack",
      mysql: "MySQL",
      jest: "Jest",
      blender: "Blender",
      maya: "Maya",
      drupal: "Drupal",
      scribus: "Scribus",
      redux: "Redux",
      mongo: "MongoDB",
      gulp: "Gulp",
      svg: "SVG",
      joomla: "Joomla",
      highlight: "Highlight.js",
      freehand: "Freehand",
      sk1: "SK1",
      fireworks: "Fireworks",
      corelDraw: "Corel Draw",
      autocad: "Autocad",
      gimp: "Gimp",
      pencil: "Pencil",
      gmap: "Google Maps",
      axios: "Axios",
      pascal: "Pascal",
      c: "C++",
      vb: "Visual Basic",
      vfoxpro: "Visual FoxPro",
      bash: "Bash",
      linux: "Linux",
      excel: "Microsoft Excel",
      word: "Microsoft Word",
      powerpoint: "Microsoft Powerpoint",
      dreamweaver: "Adobe Dreamweaver",
      as2: "ActionScript 2",
      as3: "ActionScript 3",
      tkinter: "Tkinter",
      konva: "Konva",
      i18n: "vue-i18n",
    };

    const type = {
      userFlow: "User Flow",
      wireFrame: "Wireframe",
      app: "Application",
      prototype: "Prototype",
      landingPage: "Landing Page",
      motionGraphics: "Motion Graphics",
      animation3D: "3D Animation",
      document: "Documentation",
      module: "Module",
      socialMedia: "Social Media",
      graphicDesign: "Graphic Design",
      group: "Group",
      location: "Location",
    };

    const client = {
      presidente: "Cerveza Presidente",
      drLogic: "DrLogic",
      descubria: "Descubria",
      capitalDBG: "Capital DBG",
      miguelRivas: "Miguel Rivas",
      pepsi: "Pepsi",
      redRock: "Red Rock",
      itla: "ITLA",
      pixelPerfectTree: "Pixel Perfect Tree",
      bprBank: "BPR Bank",
      voxel: "Voxel Cube Games",
      orange: "Orange",
      apap: "APAP",
      enovational: "Enovational",
      socialNetwork: "Social Network",
      jellyfish: "Jellyfish",
      plantTherapy: "Plant Therapy",
      avante: "Avante Marketing",
      delJardin: "Pasteleria del Jardin",
      cosplayDominicano: "Cosplay Dominicano",
      highschool: "Highschool.com.do",
      outback: "Outback Steakhouse",
      tiempoExtra: "TiempoExtra",
      homeGallery: "Home Gallery",
      sdq: "SDQ Training Center",
      harinaBlanquita: "Harina Blanquita",
      mangoBajito: "Mango Bajito",
      codepen: "Codepen",
      studioSeveral: "Studio Several",
      itesa: "ITESA",
    };

    const user = {
      "name": "Jesus",
      "middleName": "Miguel",
      "lastName": "Rivas",
      "title": "Frontend Developer",
      "website": "miguel-rivas.github.io",
      "email": "miguel.portfolio.gi7pt@simplelogin.fr",
      "location": {
        "city": "Washington",
        "state": "DC"
      },
      "media": {
        "codepen": {
          "user": "planetwurlex"
        },
        "issuu": {
          "user": "jemiguelrivas"
        },
        "linkedin": {
          "user": "jemiguelrivas"
        },
        "github": {
          "user": "jmiguelrivas",
          "development": "miguel-rivas-lab",
          "production": "miguel-rivas"
        }
      }
    };

    const linkWeb = (item) => `https://${user.media.github.production}.github.io/${item}`;
    const linkGithub = (item) => `https://github.com/${user.media.github.production}/${item}`;
    const linkCodepen = (item) => `https://codepen.io/${user.media.codepen.user}/pen/${item}`;
    const linkVimeo = (id) => `https://player.vimeo.com/video/${id}`;

    const projects = [
      {
        date: "2021/12/20",
        title: "Portfolio 2022",
        types: type.app,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.vue,
          tool.vuex,
          tool.vueRouter,
          tool.typescript,
          tool.three,
          tool.scss,
          tool.git,
          tool.chartJS,
          tool.konva,
          tool.pug,
          tool.i18n,
        ],
        links: [
          {
            url: linkWeb("2022-vue"),
            text: "App",
            self: false,
          },
          {
            url: linkGithub("2022-vue"),
            text: "Github",
            self: false,
          },
        ],
        children: [
          helpers.getNewID(client.itla, "2011/07/06"),
          helpers.getNewID(client.itla, "2011/07/25"),
          helpers.getNewID(client.miguelRivas, "2012/11/06"),
          helpers.getNewID(client.miguelRivas, "2015/05/23"),
          helpers.getNewID(client.miguelRivas, "2015/05/25"),
          helpers.getNewID(client.miguelRivas, "2015/05/28"),
          helpers.getNewID(client.miguelRivas, "2017/01/01"),
          helpers.getNewID(client.miguelRivas, "2017/02/20"),
          helpers.getNewID(client.miguelRivas, "2018/06/27"),
          helpers.getNewID(client.miguelRivas, "2021/03/22"),
          helpers.getNewID(client.miguelRivas, "2021/02/27"),
          helpers.getNewID(client.miguelRivas, "2022/01/05"),
          helpers.getNewID(client.miguelRivas, "2022/01/24"),
          helpers.getNewID(client.miguelRivas, "2022/02/02"),
          helpers.getNewID(client.miguelRivas, "2022/02/07"),
          helpers.getNewID(client.miguelRivas, "2022/02/20"),
        ],
      },

      {
        date: "2022/03/04",
        title: "Grid Gallery",
        types: type.prototype,
        clients: [
          client.miguelRivas,
        ],
        disabled: true,
        tools: [
          tool.vue,
          tool.vuex,
          tool.vueRouter,
          tool.typescript,
          tool.scss,
          tool.git,
          tool.pug,
        ],
      },

      {
        date: "2022/02/20",
        title: "Pixel Editor",
        types: type.prototype,
        clients: [
          client.miguelRivas,
        ],
        disabled: true,
        tools: [
          tool.vue,
          tool.vuex,
          tool.vueRouter,
          tool.typescript,
          tool.scss,
          tool.git,
          tool.konva,
          tool.pug,
        ],
      },


      {
        date: "2022/02/07",
        title: "Avatar Builder",
        types: type.prototype,
        clients: [
          client.miguelRivas,
        ],
        disabled: true,
        tools: [
          tool.vue,
          tool.vuex,
          tool.vueRouter,
          tool.typescript,
          tool.scss,
          tool.git,
          tool.konva,
          tool.pug,
        ],
      },

      {
        date: "2022/02/02",
        title: "3D House",
        types: type.prototype,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.scss,
          tool.git,
          tool.pug,
        ],
        disabled: true,
      },


      {
        date: "2022/01/24",
        title: "Map 3D",
        types: type.animation3D,
        disabled: true,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.blender,
        ],
      },

      {
        date: "2008/12/05",
        title: "Falling Code / Game",
        types: type.app,
        disabled: true,
        clients: [
          client.itesa,
        ],
        tools: [
          tool.vb,
        ],
        links: [
          {
            url: linkGithub("visualbasic"),
            text: "Github",
            self: false,
          },
        ],
      },
      {
        date: "2008/11/11",
        title: "Bouncing Shapes",
        types: type.app,
        disabled: true,
        clients: [
          client.itesa,
        ],
        tools: [
          tool.vb,
        ],
        links: [
          {
            url: linkGithub("visualbasic"),
            text: "Github",
            self: false,
          },
        ],
        children: [
          helpers.getNewID(client.itesa, "2008/05/16"),
        ],
      },
      {
        date: "2008/05/16",
        title: "Analog Clock",
        types: type.app,
        disabled: true,
        clients: [
          client.itesa,
        ],
        tools: [
          tool.vb,
        ],
        links: [
          {
            url: linkGithub("visualbasic"),
            text: "Github",
            self: false,
          },
        ],
      },
      {
        date: "2005/10/01",
        title: "ATM",
        types: type.app,
        disabled: true,
        clients: [
          client.itesa,
        ],
        tools: [
          tool.pascal,
        ],
        links: [
          {
            url: linkGithub("pascal-2004"),
            text: "Github",
            self: false,
          },
        ],
      },
      {
        date: "2005/10/02",
        title: "Bubble Sort",
        types: type.app,
        disabled: true,
        clients: [
          client.itesa,
        ],
        tools: [
          tool.pascal,
        ],
        links: [],
      },
      {
        date: "2005/10/03",
        title: "Infinite Menu",
        types: type.app,
        disabled: true,
        clients: [
          client.itesa,
        ],
        tools: [
          tool.pascal,
        ],
        links: [
          {
            url: linkGithub("pascal-2004"),
            text: "Github",
            self: false,
          },
        ],
      },
      {
        date: "2005/10/04",
        title: "Fibonacci Sequence",
        types: type.app,
        disabled: true,
        clients: [
          client.itesa,
        ],
        tools: [
          tool.pascal,
        ],
        links: [
          {
            url: linkGithub("pascal-2004"),
            text: "Github",
            self: false,
          },
        ],
      },
      {
        date: "2005/10/05",
        title: "Summatory / Accumulator",
        types: type.app,
        disabled: true,
        clients: [
          client.itesa,
        ],
        tools: [
          tool.pascal,
        ],
        links: [
          {
            url: linkGithub("pascal-2004"),
            text: "Github",
            self: false,
          },
        ],
      },
      {
        date: "2005/09/28",
        title: "Random Number",
        types: type.app,
        disabled: true,
        clients: [
          client.itesa,
        ],
        tools: [
          tool.pascal,
        ],
        links: [
          {
            url: linkGithub("pascal-2004"),
            text: "Github",
            self: false,
          },
        ],
      },
      {
        date: "2007/09/04",
        title: "Pacman Pixel Draw",
        types: type.app,
        disabled: true,
        clients: [
          client.itesa,
        ],
        tools: [
          tool.c,
        ],
        links: [],
        children: [
          helpers.getNewID(client.miguelRivas, "2021/11/08"),
        ],
      },
      {
        date: "2008/05/17",
        title: "Tetravex",
        types: type.app,
        disabled: true,
        clients: [
          client.itesa,
        ],
        tools: [
          tool.vb,
        ],
        links: [],
      },
      {
        date: "2008/05/18",
        title: "Minesweeper",
        types: type.app,
        disabled: true,
        clients: [
          client.itesa,
        ],
        tools: [
          tool.vb,
        ],
        links: [],
      },
      {
        date: "2006/01/05",
        title: "Falling Code / Matrix Effect",
        types: type.app,
        disabled: true,
        clients: [
          client.itesa,
        ],
        tools: [
          tool.vb,
        ],
        links: [],
      },
      {
        date: "2013/12/06",
        title: "Pasteleria Del Jardin",
        types: type.socialMedia,
        disabled: true,
        clients: [
          client.delJardin,
        ],
        tools: [
          tool.illustrator,
        ],
        links: [
          {
            url: "https://issuu.com/jemiguelrivas/docs/ptf1_000/8",
            text: "Document",
            self: false,
          },
        ],
      },
      {
        date: "2013/06/18",
        title: "Lanza tu Promo",
        types: type.socialMedia,
        disabled: true,
        clients: [
          client.highschool,
        ],
        tools: [
          tool.illustrator,
        ],
        links: [
          {
            url: "https://issuu.com/jemiguelrivas/docs/ptf1_000/10",
            text: "Document",
            self: false,
          },
        ],
      },
      {
        date: "2013/05/28",
        title: "Audrey Hepburn",
        types: type.document,
        disabled: true,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.photoshop,
        ],
        links: [
          {
            url: "https://issuu.com/jemiguelrivas/docs/ptf1_000/12",
            text: "Document",
            self: false,
          },
        ],
      },
      {
        date: "2013/03/21",
        title: "Audio 2",
        types: type.document,
        disabled: true,
        clients: [
          client.itla,
        ],
        tools: [
          tool.illustrator,
        ],
        links: [
          {
            url: "https://issuu.com/jemiguelrivas/docs/ptf1_000/14",
            text: "Document",
            self: false,
          },
        ],
      },
      {
        date: "2012/11/26",
        title: "Beauty is a Beast",
        types: type.document,
        disabled: true,
        clients: [
          client.itla,
        ],
        tools: [
          tool.illustrator,
        ],
        links: [
          {
            url: "https://issuu.com/jemiguelrivas/docs/ptf1_000/16",
            text: "Document",
            self: false,
          },
        ],
      },
      {
        date: "2012/10/24",
        title: "Linux Grub",
        types: type.document,
        disabled: true,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.freehand,
        ],
        links: [
          {
            url: "https://issuu.com/jemiguelrivas/docs/ptf1_000/24",
            text: "Document",
            self: false,
          },
        ],
      },
      {
        date: "2019/07/10",
        title: "Play Sound",
        types: type.prototype,
        disabled: true,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.javascript,
        ],
        links: [
          {
            url: linkCodepen("bPzVPJ"),
            text: "Codepen Prototype",
          },
        ],
      },
      {
        date: "2020/08/08",
        title: "Switch",
        types: type.prototype,
        disabled: true,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.scss,
          tool.slim,
        ],
        links: [
          {
            url: linkCodepen("LYNEwLZ"),
            text: "Codepen Prototype",
          },
        ],
      },
      {
        date: "2020/06/17",
        title: "Toggle Arrow",
        types: type.prototype,
        disabled: true,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.scss,
          tool.slim,
        ],
        links: [
          {
            url: linkCodepen("VwembzX"),
            text: "Codepen Prototype",
          },
        ],
      },
      {
        date: "2020/08/18",
        title: "Range Slider",
        types: type.prototype,
        disabled: true,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.scss,
          tool.slim,
        ],
        links: [
          {
            url: linkCodepen("qBZNMyQ"),
            text: "Codepen Prototype",
          },
        ],
      },
      {
        date: "2011/07/17",
        title: "Madre Naturaleza",
        types: type.document,
        disabled: true,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.sk1,
        ],
        links: [
          {
            url: "https://issuu.com/jemiguelrivas/docs/ptf1_000/40",
            text: "Document",
            self: false,
          },
        ],
      },
      {
        date: "2011/04/24",
        title: "El Montaje",
        types: type.document,
        disabled: true,
        clients: [
          client.itla,
        ],
        tools: [
          tool.flash,
        ],
        links: [
          {
            url: "https://issuu.com/jemiguelrivas/docs/ptf1_000/42",
            text: "Document",
            self: false,
          },
        ],
      },
      {
        date: "2011/02/22",
        title: "Transformer",
        types: type.document,
        disabled: true,
        clients: [
          client.itla,
        ],
        tools: [
          tool.illustrator,
        ],
        links: [
          {
            url: "https://issuu.com/jemiguelrivas/docs/ptf1_000/44",
            text: "Document",
            self: false,
          },
        ],
      },
      {
        date: "2009/04/27",
        title: "Flygon",
        types: type.document,
        disabled: true,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.fireworks,
        ],
        links: [
          {
            url: "https://issuu.com/jemiguelrivas/docs/ptf1_000/48",
            text: "Document",
            self: false,
          },
        ],
      },
      {
        date: "2012/12/12",
        title: "Baká",
        types: type.document,
        disabled: true,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.indesign,
          tool.pencil,
        ],
        links: [
          {
            url: "https://issuu.com/jemiguelrivas/docs/ptf2_000/16",
            text: "Document",
            self: false,
          },
          {
            url: "https://issuu.com/jemiguelrivas/docs/ptf3_005/28",
            text: "Document",
            self: false,
          },
        ],
      },
      {
        date: "2012/06/14",
        title: "Le Machine",
        types: type.document,
        disabled: true,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.inkscape,
        ],
        links: [
          {
            url: "https://issuu.com/jemiguelrivas/docs/ptf2_000/18",
            text: "Document",
            self: false,
          },
        ],
      },
      {
        date: "2012/01/16",
        title: "Stars",
        types: type.document,
        disabled: true,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.inkscape,
          tool.html,
          tool.javascript,
          tool.css,
        ],
        links: [
          {
            url: "https://issuu.com/jemiguelrivas/docs/ptf2_000/20",
            text: "Document",
            self: false,
          },
        ],
      },
      {
        date: "2012/06/25",
        title: "Water Matters",
        types: type.document,
        disabled: true,
        clients: [
          client.itla,
        ],
        tools: [
          tool.indesign,
        ],
        links: [
          {
            url: "https://issuu.com/jemiguelrivas/docs/ptf2_000/24",
            text: "Document",
            self: false,
          },
        ],
      },
      {
        date: "2012/06/21",
        title: "Wickhop",
        types: type.document,
        disabled: true,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.inkscape,
        ],
        links: [
          {
            url: "https://issuu.com/jemiguelrivas/docs/ptf2_000/28",
            text: "Document",
            self: false,
          },
        ],
      },
      {
        date: "2012/04/29",
        title: "Corel Draw",
        types: type.document,
        disabled: true,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.corelDraw,
        ],
        links: [
          {
            url: "https://issuu.com/jemiguelrivas/docs/ptf2_000/34",
            text: "Document",
            self: false,
          },
        ],
      },
      {
        date: "2011/08/03",
        title: "MP4",
        types: type.document,
        disabled: true,
        clients: [
          client.itla,
        ],
        tools: [
          tool.flash,
        ],
        links: [
          {
            url: "https://issuu.com/jemiguelrivas/docs/ptf2_000/38",
            text: "Document",
            self: false,
          },
        ],
      },
      {
        date: "2011/04/25",
        title: "Dream",
        types: type.document,
        disabled: true,
        clients: [
          client.itla,
        ],
        tools: [
          tool.illustrator,
        ],
        links: [
          {
            url: "https://issuu.com/jemiguelrivas/docs/ptf2_000/40",
            text: "Document",
            self: false,
          },
        ],
      },
      {
        date: "2010/12/27",
        title: "Lapices de Colores",
        types: type.document,
        disabled: true,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.fireworks,
        ],
        links: [
          {
            url: "https://issuu.com/jemiguelrivas/docs/ptf3_005/48",
            text: "Document",
            self: false,
          },
        ],
      },
      {
        date: "2012/07/14",
        title: "Living Walls",
        types: type.graphicDesign,
        disabled: true,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.inkscape,
        ],
        links: [
          {
            url: "https://issuu.com/jemiguelrivas/docs/ptf3_005/42",
            text: "Document",
            self: false,
          },
        ],
      },
      {
        date: "2012/08/23",
        title: "Tambora",
        types: type.document,
        disabled: true,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.inkscape,
          tool.indesign,
        ],
        links: [
          {
            url: "https://issuu.com/jemiguelrivas/docs/ptf3_005/38",
            text: "Document",
            self: false,
          },
        ],
      },
      {
        date: "2012/09/20",
        title: "T-Magazine",
        types: type.document,
        disabled: true,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.scribus,
        ],
        links: [
          {
            url: "https://issuu.com/jemiguelrivas/docs/ptf3_005/32",
            text: "Document",
            self: false,
          },
        ],
      },
      {
        date: "2013/11/30",
        title: "AguacateKun Identidad",
        types: type.document,
        disabled: true,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.autocad,
          tool.illustrator,
          tool.indesign,
        ],
        links: [
          {
            url: "https://issuu.com/jemiguelrivas/docs/ptf3_005/14",
            text: "Document",
            self: false,
          },
        ],
      },
      {
        date: "2013/01/20",
        title: "Libro de Cuentos",
        types: type.graphicDesign,
        disabled: true,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.gimp,
        ],
        links: [
          {
            url: "https://issuu.com/jemiguelrivas/docs/ptf2_000/10",
            text: "Document",
            self: false,
          },
          {
            url: "https://issuu.com/jemiguelrivas/docs/ptf2_000/14",
            text: "Document",
            self: false,
          },
        ],
      },
      {
        date: "2013/12/03",
        title: "Vacaciones Navideñas",
        types: type.socialMedia,
        disabled: true,
        clients: [
          client.descubria,
        ],
        tools: [
          tool.illustrator,
        ],
        links: [
          {
            url: "https://issuu.com/jemiguelrivas/docs/ptf3_005/12",
            text: "Document",
            self: false,
          },
        ],
      },
      {
        date: "2013/08/03",
        title: "Social Network Facebook",
        types: type.socialMedia,
        disabled: true,
        clients: [
          client.socialNetwork,
        ],
        tools: [
          tool.illustrator,
        ],
        links: [
          {
            url: "https://issuu.com/jemiguelrivas/docs/ptf3_005/16",
            text: "Document",
            self: false,
          },
        ],
      },
      {
        date: "2013/07/06",
        title: "Facebook App",
        types: type.graphicDesign,
        disabled: true,
        clients: [
          client.tiempoExtra,
        ],
        tools: [
          tool.illustrator,
        ],
        links: [
          {
            url: "https://issuu.com/jemiguelrivas/docs/ptf3_005/18",
            text: "Document",
            self: false,
          },
        ],
      },
      {
        date: "2013/07/05",
        title: "Home Gallery Facebook",
        types: type.socialMedia,
        disabled: true,
        clients: [
          client.homeGallery,
        ],
        tools: [
          tool.illustrator,
        ],
        links: [
          {
            url: "https://issuu.com/jemiguelrivas/docs/ptf3_005/20",
            text: "Document",
            self: false,
          },
        ],
      },
      {
        date: "2013/07/05",
        title: "SDQ Training Center Facebook",
        types: type.socialMedia,
        disabled: true,
        clients: [
          client.sdq,
        ],
        tools: [
          tool.illustrator,
        ],
        links: [
          {
            url: "https://issuu.com/jemiguelrivas/docs/ptf3_005/22",
            text: "Document",
            self: false,
          },
        ],
      },
      {
        date: "2013/06/27",
        title: "Harina Blaquita Facebook",
        types: type.socialMedia,
        disabled: true,
        clients: [
          client.harinaBlanquita,
        ],
        tools: [
          tool.illustrator,
          tool.photoshop,
        ],
        links: [
          {
            url: "https://issuu.com/jemiguelrivas/docs/ptf3_005/24",
            text: "Document",
            self: false,
          },
        ],
      },
      {
        date: "2012/12/29",
        title: "Jenny Aquino",
        types: type.graphicDesign,
        disabled: true,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.inkscape,
        ],
        links: [
          {
            url: "https://issuu.com/jemiguelrivas/docs/ptf3_005/26",
            text: "Document",
            self: false,
          },
        ],
      },
      {
        date: "2012/10/12",
        title: "Blindness Poster",
        types: type.graphicDesign,
        disabled: true,
        clients: [
          client.itla,
        ],
        tools: [
          tool.photoshop,
        ],
        links: [
          {
            url: "https://issuu.com/jemiguelrivas/docs/ptf3_005/30",
            text: "Document",
            self: false,
          },
        ],
      },
      {
        date: "2012/09/13",
        title: "Diseño de Productos",
        types: type.document,
        disabled: true,
        clients: [
          client.itla,
        ],
        tools: [
          tool.indesign,
        ],
        links: [
          {
            url: "https://issuu.com/jemiguelrivas/docs/ptf3_005/34",
            text: "Document",
            self: false,
          },
        ],
      },
      {
        date: "2012/04/16",
        title: "Raspberry Pi C",
        types: type.graphicDesign,
        disabled: true,
        clients: [
          client.itla,
        ],
        tools: [
          tool.inkscape,
        ],
        links: [
          {
            url: "https://issuu.com/jemiguelrivas/docs/ptf3_005/44",
            text: "Document",
            self: false,
          },
        ],
      },
      {
        date: "2012/02/28",
        title: "Maggiver",
        types: type.document,
        disabled: true,
        clients: [
          client.mangoBajito,
        ],
        tools: [
          tool.inkscape,
        ],
        links: [
          {
            url: "https://issuu.com/jemiguelrivas/docs/ptf3_005/46",
            text: "Document",
            self: false,
          },
        ],
      },
      {
        date: "2013/12/15",
        title: "Badges",
        types: type.graphicDesign,
        disabled: true,
        clients: [
          client.cosplayDominicano,
        ],
        tools: [
          tool.illustrator,
        ],
        links: [
          {
            url: "https://issuu.com/jemiguelrivas/docs/ptf2_000/8",
            text: "Document",
            self: false,
          },
        ],
      },

      {
        date: "2012/10/26",
        title: "Print Portfolio",
        types: type.document,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.indesign,
        ],
        links: [
          {
            url: "https://issuu.com/jemiguelrivas/docs/ptf3_005",
            text: "Portfolio 3",
            self: false,
          },
          {
            url: "https://issuu.com/jemiguelrivas/docs/ptf2_000",
            text: "Portfolio 2",
            self: false,
          },
          {
            url: "https://issuu.com/jemiguelrivas/docs/ptf1_000",
            text: "Portfolio 1",
            self: false,
          },
        ],
        children: [
          helpers.getNewID(client.miguelRivas, "2009/04/27"),
          helpers.getNewID(client.itla, "2010/07/07"),
          helpers.getNewID(client.miguelRivas, "2010/12/27"),
          helpers.getNewID(client.itla, "2011/06/22"),
          helpers.getNewID(client.itla, "2011/02/22"),
          helpers.getNewID(client.itla, "2011/04/24"),
          helpers.getNewID(client.itla, "2011/04/25"),
          helpers.getNewID(client.itla, "2011/07/06"),
          helpers.getNewID(client.miguelRivas, "2011/07/17"),
          helpers.getNewID(client.itla, "2011/07/25"),
          helpers.getNewID(client.itla, "2011/07/31"),
          helpers.getNewID(client.itla, "2011/08/03"),
          helpers.getNewID(client.itla, "2011/11/15"),
          helpers.getNewID(client.itla, "2011/11/18"),
          helpers.getNewID(client.itla, "2011/12/05"),
          helpers.getNewID(client.miguelRivas, "2012/01/16"),
          helpers.getNewID(client.mangoBajito, "2012/02/28"),
          helpers.getNewID(client.itla, "2012/04/16"),
          helpers.getNewID(client.miguelRivas, "2012/04/29"),
          helpers.getNewID(client.miguelRivas, "2012/06/14"),
          helpers.getNewID(client.miguelRivas, "2012/06/21"),
          helpers.getNewID(client.itla, "2012/06/25"),
          helpers.getNewID(client.miguelRivas, "2012/07/14"),
          helpers.getNewID(client.itla, "2012/07/24"),
          helpers.getNewID(client.miguelRivas, "2012/08/23"),
          helpers.getNewID(client.miguelRivas, "2012/09/26"),
          helpers.getNewID(client.itla, "2012/09/13"),
          helpers.getNewID(client.miguelRivas, "2012/09/20"),
          helpers.getNewID(client.itla, "2012/10/12"),
          helpers.getNewID(client.miguelRivas, "2012/10/24"),
          helpers.getNewID(client.miguelRivas, "2012/11/06"),
          helpers.getNewID(client.itla, "2012/11/26"),
          helpers.getNewID(client.miguelRivas, "2012/12/12"),
          helpers.getNewID(client.miguelRivas, "2012/12/29"),
          helpers.getNewID(client.miguelRivas, "2013/01/20"),
          helpers.getNewID(client.itla, "2013/03/21"),
          helpers.getNewID(client.miguelRivas, "2013/05/28"),
          helpers.getNewID(client.highschool, "2013/06/18"),
          helpers.getNewID(client.harinaBlanquita, "2013/06/27"),
          helpers.getNewID(client.sdq, "2013/07/05"),
          helpers.getNewID(client.homeGallery, "2013/07/05"),
          helpers.getNewID(client.tiempoExtra, "2013/07/06"),
          helpers.getNewID(client.socialNetwork, "2013/08/03"),
          helpers.getNewID(client.miguelRivas, "2013/11/30"),
          helpers.getNewID(client.descubria, "2013/12/03"),
          helpers.getNewID(client.delJardin, "2013/12/06"),
          helpers.getNewID(client.cosplayDominicano, "2013/12/15"),
          helpers.getNewID(client.miguelRivas, "2014/02/09"),
        ],
      },

      {
        date: "2015/01/03",
        title: "Mainfront",
        types: type.app,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.pug,
          tool.jQuery,
          tool.grunt,
          tool.scss,
          tool.illustrator,
          tool.git,
        ],
        disabled: true,
        links: [
          {
            url: linkWeb("main-front"),
            text: "App",
            self: false,
          },
          {
            url: linkGithub("main-front"),
            text: "Github",
            self: false,
          },
        ],
      },
      {
        date: "2015/04/19",
        title: "CSS Study",
        types: type.app,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.angular,
          tool.sweetAlert,
          tool.illustrator,
          tool.scss,
          tool.pug,
          tool.git,
        ],
        links: [
          {
            url: linkWeb("css-study"),
            text: "App",
            self: false,
          },
          {
            url: linkGithub("css-study"),
            text: "Github",
            self: false,
          },
        ],
      },
      {
        date: "2021/03/24",
        title: "Hello",
        types: type.app,
        disabled: true,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.vue,
          tool.illustrator,
          tool.scss,
          tool.git,
        ],
        links: [
          {
            url: `${linkWeb("hello")}`,
            text: "berlin",
            params: ["city=berlin"],
            self: false,
          },
          {
            url: `${linkWeb("hello")}`,
            text: "dusseldorf",
            params: ["city=dusseldorf"],
            self: false,
          },
          {
            url: `${linkWeb("hello")}`,
            text: "melbourne",
            params: ["city=melbourne"],
            self: false,
          },
          {
            url: `${linkWeb("hello")}`,
            text: "schwangau",
            params: ["city=schwangau"],
            self: false,
          },
          {
            url: `${linkWeb("hello")}`,
            text: "texas",
            params: ["city=texas"],
            self: false,
          },
          {
            url: linkGithub("hello"),
            text: "Github",
            self: false,
          },
        ],
      },
      {
        date: "2015/04/26",
        title: "Evolution of the Web",
        types: type.app,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.stellar,
          tool.inkscape,
          tool.pug,
          tool.git,
          tool.scss,
        ],
        links: [
          {
            url: linkWeb("evolution-web"),
            text: "App",
            self: false,
          },
          {
            url: linkGithub("evolution-web"),
            text: "Github",
            self: false,
          },
        ],
      },
      {
        date: "2015/05/14",
        title: "Robotic Screen",
        types: type.prototype,
        disabled: true,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.pug,
          tool.scss,
          tool.illustrator,
        ],
        links: [
          {
            url: linkCodepen("oXxPvw"),
            text: "Codepen Prototype",
          },
        ],
      },
      {
        date: "2015/05/23",
        title: "Minivan",
        types: type.prototype,
        clients: [
          client.miguelRivas,
        ],
        disabled: true,
        tools: [
          tool.pug,
          tool.scss,
        ],
      },
      {
        date: "2015/05/25",
        title: "Windows Form",
        types: type.prototype,
        disabled: true,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.scss,
          tool.jade,
          tool.illustrator,
        ],
      },
      {
        date: "2015/05/28",
        title: "Gear Builder",
        types: type.prototype,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.canvas,
          tool.pug,
          tool.scss,
        ],
        disabled: true,
        children: [
          helpers.getNewID(client.itesa, "2008/05/16"),
        ],
      },
      {
        date: "2015/12/07",
        title: "SVG 101",
        types: type.prototype,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.stellar,
          tool.snapSVG,
          tool.pug,
          tool.scss,
          tool.illustrator,
          tool.git,
        ],
        links: [
          {
            url: linkWeb("svg-101"),
            text: "Prototype",
            self: false,
          },
          {
            url: linkGithub("svg-101"),
            text: "Github",
            self: false,
          },
        ],
      },
      {
        date: "2015/12/22",
        title: "Tetravex",
        types: type.app,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.javascript,
          tool.pug,
          tool.scss,
          tool.sizzle,
          tool.lodash,
          tool.velocity,
          tool.illustrator,
          tool.inkscape,
          tool.git,
        ],
        links: [
          {
            url: linkWeb("tetravex"),
            text: "App",
            self: false,
          },
          {
            url: linkGithub("tetravex"),
            text: "Github",
            self: false,
          },
        ],
      },
      {
        date: "2017/02/20",
        title: "Pills",
        types: type.prototype,
        disabled: true,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.slim,
          tool.scss,
        ],
      },
      {
        date: "2010/07/07",
        title: "French Toast",
        disabled: true,
        types: type.motionGraphics,
        clients: [
          client.itla,
        ],
        tools: [
          tool.flash,
        ],
        links: [
          {
            url: linkVimeo("224945169"),
            text: "Video",
            self: false,
          },
        ],
      },
      {
        date: "2012/07/24",
        title: "La Guerra de Vectores",
        types: type.motionGraphics,
        disabled: true,
        clients: [
          client.itla,
        ],
        tools: [
          tool.flash,
        ],
        links: [
          {
            url: linkVimeo("175240185"),
            text: "Video",
            self: false,
          },
        ],
      },
      {
        date: "2016/11/21",
        title: "Wurlex",
        types: type.animation3D,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.unity,
          tool.premiere,
        ],
        links: [
          {
            url: linkVimeo("224977703"),
            text: "Video",
            self: false,
          },
        ],
        children: [
          helpers.getNewID(client.itla, "2011/04/25"),
        ],
      },
      {
        date: "2014/02/09",
        title: "Screens Portfolio",
        types: type.app,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.pug,
          tool.scss,
          tool.jQuery,
          tool.php,
          tool.git,
        ],
        links: [
          {
            url: linkWeb("2014"),
            text: "App",
            self: false,
          },
          {
            url: linkGithub("2014"),
            text: "Github",
            self: false,
          },
        ],
        children: [
          helpers.getNewID(client.miguelRivas, "2012/01/16"),
          helpers.getNewID(client.miguelRivas, "2015/05/14"),
          helpers.getNewID(client.miguelRivas, "2015/05/28"),
        ],
      },
      {
        date: "2016/08/11",
        title: "Spirit Portfolio",
        types: type.app,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.pug,
          tool.scss,
          tool.jQuery,
          tool.php,
          tool.git,
        ],
        links: [
          {
            url: linkWeb("2016"),
            text: "App",
            self: false,
          },
          {
            url: linkGithub("2016"),
            text: "Github",
            self: false,
          },
        ],
      },
      {
        date: "2021/08/12",
        title: "Portfolio 2021",
        types: type.app,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.vue,
          tool.vuex,
          tool.vueRouter,
          tool.typescript,
          tool.three,
          tool.scss,
          tool.git,
          tool.chartJS,
          tool.firebase,
          tool.highlight,
          tool.gmap,
          tool.axios,
        ],
        links: [
          {
            url: linkWeb("2021-vue"),
            text: "App",
            self: false,
          },
          {
            url: linkGithub("2021-vue"),
            text: "Github",
            self: false,
          },
        ],
        children: [
          helpers.getNewID(client.miguelRivas, "2012/11/06"),
          helpers.getNewID(client.miguelRivas, "2015/05/28"),
          helpers.getNewID(client.miguelRivas, "2017/01/01"),
          helpers.getNewID(client.miguelRivas, "2018/06/27"),
          helpers.getNewID(client.miguelRivas, "2021/03/22"),
          helpers.getNewID(client.miguelRivas, "2021/09/12"),
          helpers.getNewID(client.miguelRivas, "2021/02/27"),
        ],
      },
      {
        date: "2018/01/01",
        title: "Grid Portfolio",
        types: type.app,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.angular,
          tool.scss,
          tool.git,
        ],
        links: [
          {
            url: linkWeb("2018"),
            text: "Home",
            self: false,
          },
          {
            url: linkWeb("2018/drlogic.html"),
            text: "DrLogic",
            self: false,
          },
          {
            url: linkWeb("2018/apap.html"),
            text: "Apap",
            self: false,
          },
          {
            url: linkWeb("2018/bpr.html"),
            text: "BPR Bank",
            self: false,
          },
          {
            url: linkWeb("2018/presidente.html"),
            text: "Presidente",
            self: false,
          },
          {
            url: linkWeb("2018/tests.html"),
            text: "Tests",
            self: false,
          },
          {
            url: linkVimeo("260621089"),
            text: "Video",
            self: false,
          },
          {
            url: linkGithub("2018"),
            text: "Github",
            self: false,
          },
        ],
        children: [
          helpers.getNewID(client.miguelRivas, "2021/03/24"),
        ]
      },
      {
        date: "2016/01/11",
        title: "HTML/LOVE",
        types: type.landingPage,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.haml,
          tool.scss,
          tool.illustrator,
          tool.animate,
          tool.git,
        ],
        links: [
          {
            url: linkWeb("html-love"),
            text: "App",
            self: false,
          },
          {
            url: linkGithub("html-love"),
            text: "Github",
            self: false,
          },
        ],
      },
      {
        date: "2021/03/22",
        title: "Nano Grid",
        types: type.module,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.vue,
          tool.scss,
          tool.git,
          tool.typescript,
        ],
        disabled: true,
        links: [
          {
            url: "https://www.npmjs.com/package/nano-grid",
            text: "Node Module",
          },
          {
            url: linkGithub("nano-grid"),
            text: "Github",
            self: false,
          },
        ],
        children: [
          helpers.getNewID(client.miguelRivas, "2019/07/10"),
          helpers.getNewID(client.miguelRivas, "2020/08/18"),
        ],
      },
      {
        date: "2021/09/12",
        title: "MR Kernel",
        types: type.module,
        clients: [
          client.miguelRivas,
        ],
        tools: [

          tool.typescript,
          tool.scss,
          tool.git,
        ],
        links: [
          {
            url: "https://www.npmjs.com/package/mr-kernel",
            text: "Node Module",
          },
          {
            url: linkGithub("mr-kernel"),
            text: "Github",
            self: false,
          },
        ],
        disabled: true,
      },
      {
        date: "2012/09/26",
        title: "Tips of Design",
        types: type.document,
        disabled: true,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.indesign,
        ],
      },
      {
        date: "2017/03/05",
        title: "Art Direction",
        types: type.document,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.indesign,
          tool.illustrator,
          tool.photoshop,
        ],
        disabled: true,
      },
      {
        date: "2015/05/10",
        title: "Bootstrap Prototype",
        types: type.landingPage,
        disabled: true,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.bootstrap,
          tool.pug,
          tool.illustrator,
          tool.scss,
        ]
      },
      {
        date: "2021/03/26",
        title: "3D Viewer",
        types: type.app,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.react,
          tool.redux,
          tool.three,
          tool.firebase,
          tool.scss,
          tool.typescript,
          tool.git,
        ],
        disabled: true,
        links: [
          {
            url: linkWeb("2021-react"),
            text: "App",
            self: false,
          },
          {
            url: linkGithub("2021-react"),
            text: "Github",
            self: false,
          },
        ],
        children: [
          helpers.getNewID(client.miguelRivas, "2021/03/22"),
          helpers.getNewID(client.miguelRivas, "2021/09/12"),
          helpers.getNewID(client.itla, "2011/07/06"),
          helpers.getNewID(client.itla, "2011/06/22"),
          helpers.getNewID(client.itla, "2011/07/25"),
        ],
      },
      {
        date: "2017/01/01",
        title: "FlatCSS",
        types: type.module,
        disabled: true,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.pug,
          tool.css,
          tool.git,
        ],
        links: [
          {
            url: linkWeb("flat-css"),
            text: "App",
            self: false,
          },
          {
            url: linkGithub("flat-css"),
            text: "Github",
            self: false,
          },
        ],
      },
      {
        date: "2020/10/04",
        title: "Fake Audience",
        types: type.app,
        disabled: true,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.kotlin,
          tool.git,
        ],
        links: [
          {
            url: linkGithub("fake_audience"),
            text: "Github",
            self: false,
          }
        ],
      },
      {
        date: "2021/02/27",
        title: "3D Graph Colors",
        types: type.prototype,
        disabled: true,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.three,
        ],
      },
      {
        date: "2020/05/09",
        title: "Animated SVG Header",
        types: type.prototype,
        disabled: true,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.tweenMax,
          tool.html,
          tool.scss,
        ],
        links: [
          {
            url: linkCodepen("zYvjwEM"),
            text: "Codepen Prototype",
          },
        ]
      },
      {
        date: "2020/03/23",
        title: "Xpinner",
        types: type.prototype,
        disabled: true,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.svg,
          tool.scss,
        ],
        links: [
          {
            url: linkCodepen("VwLGgYv"),
            text: "Codepen Prototype",
          },
        ]
      },
      {
        date: "2018/06/27",
        title: "Color Wheel Creator",
        types: type.prototype,
        disabled: true,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.javascript,
          tool.scss,
        ],
        links: [
          {
            url: linkCodepen("ERdMLO"),
            text: "Codepen Prototype",
          },
        ],
      },
      {
        date: "2018/09/11",
        title: "Movie projector",
        types: type.prototype,
        disabled: true,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.svg,
          tool.scss,
        ],
        links: [
          {
            url: linkCodepen("rZdMYj"),
            text: "Codepen Prototype",
          },
        ]
      },
      {
        date: "2018/05/31",
        title: "Check Animation",
        types: type.prototype,
        disabled: true,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.svg,
          tool.scss,
        ],
        links: [
          {
            url: linkCodepen("ZRGpbQ"),
            text: "Codepen Prototype",
          },
        ]
      },
      {
        date: "2018/03/28",
        title: "Bounce Animation",
        types: type.prototype,
        disabled: true,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.canvas,
        ],
        links: [
          {
            url: linkCodepen("GxyMMz"),
            text: "Codepen Prototype",
          },
        ],
      },
      {
        date: "2015/05/29",
        title: "Spinners",
        types: type.prototype,
        disabled: true,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.pug,
          tool.scss,
        ],
        links: [
          {
            url: linkCodepen("eNgRRe"),
            text: "Codepen Prototype",
          },
        ],
      },
      {
        date: "2012/11/06",
        title: "Drakkar",
        types: type.animation3D,
        disabled: true,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.blender,
        ],
        links: [
          {
            url: "https://sketchfab.com/3d-models/drakkar-d0f14c73155e460cb848a3db80e1cb07",
            text: "3D Model",
            self: false,
          },
        ],
      },
      {
        date: "2011/12/05",
        title: "Reloj",
        types: type.animation3D,
        disabled: true,
        clients: [
          client.itla,
        ],
        tools: [
          tool.maya,
        ],
        links: [
          {
            url: "https://issuu.com/jemiguelrivas/docs/ptf1_000/28",
            text: "Document",
            self: false,
          },
        ],
      },
      {
        date: "2011/11/15",
        title: "Pencil Sharpener",
        types: type.animation3D,
        disabled: true,
        clients: [
          client.itla,
        ],
        tools: [
          tool.maya,
        ],
        links: [
          {
            url: "https://issuu.com/jemiguelrivas/docs/ptf1_000/30",
            text: "Document",
            self: false,
          },
        ],
      },
      {
        date: "2011/11/18",
        title: "Batteries: depth of field",
        types: type.animation3D,
        disabled: true,
        clients: [
          client.itla,
        ],
        tools: [
          tool.maya,
        ],
        links: [
          {
            url: "https://issuu.com/jemiguelrivas/docs/ptf1_000/30",
            text: "Document",
            self: false,
          },
        ],
      },
      {
        date: "2011/07/25",
        title: "Audi",
        types: type.animation3D,
        disabled: true,
        clients: [
          client.itla,
        ],
        tools: [
          tool.maya,
        ],
        links: [
          {
            url: "https://issuu.com/jemiguelrivas/docs/ptf1_000/32",
            text: "Document",
            self: false,
          },
        ],
      },
      {
        date: "2011/07/31",
        title: "Mackbook Pro",
        types: type.animation3D,
        disabled: true,
        clients: [
          client.itla,
        ],
        tools: [
          tool.maya,
        ],
        links: [
          {
            url: "https://issuu.com/jemiguelrivas/docs/ptf1_000/34",
            text: "Document",
            self: false,
          },
        ],
      },
      {
        date: "2011/06/22",
        title: "Backpack",
        types: type.animation3D,
        disabled: true,
        clients: [
          client.itla,
        ],
        tools: [
          tool.maya,
        ],
        links: [
          {
            url: "https://issuu.com/jemiguelrivas/docs/ptf1_000/36",
            text: "Document",
            self: false,
          },
        ],
      },
      {
        date: "2011/07/06",
        title: "X-wing",
        types: type.animation3D,
        disabled: true,
        clients: [
          client.itla,
        ],
        tools: [
          tool.maya,
        ],
        links: [
          {
            url: "https://issuu.com/jemiguelrivas/docs/ptf1_000/38",
            text: "Document",
            self: false,
          },
        ],
      },
      {
        date: "2014/06/16",
        title: "Destapa el Coro",
        types: type.app,
        clients: [
          client.presidente,
        ],
        disabled: true,
        tools: [
          tool.html,
          tool.jQuery,
          tool.grunt,
          tool.css,
          tool.git,
        ],
        links: [
          {
            url: linkWeb("presidente-destapa-coro"),
            text: "App",
            self: false,
          },
          {
            url: linkGithub("presidente-destapa-coro"),
            text: "Github",
            self: false,
          },
        ],
      },
      {
        date: "2015/03/30",
        title: "Pacman",
        disabled: true,
        types: type.motionGraphics,
        clients: [
          client.presidente,
        ],
        tools: [
          tool.flash,
        ],
        links: [
          {
            url: linkVimeo("175240177"),
            text: "Video",
            self: false,
          },
        ],
      },
      {
        date: "2015/03/24",
        title: "BigPapi Selfie",
        types: type.motionGraphics,
        clients: [
          client.pepsi,
        ],
        tools: [
          tool.flash,
        ],
        disabled: true,
        links: [
          {
            url: linkVimeo("175240184"),
            text: "Video",
            self: false,
          },
        ],
      },
      {
        date: "2015/04/18",
        title: "Carnaval Presidente 2015",
        types: type.landingPage,
        disabled: true,
        clients: [
          client.presidente,
        ],
        tools: [
          tool.html,
          tool.jQuery,
          tool.grunt,
          tool.scss,
          tool.php,
          tool.git,
        ],
        links: [
          {
            url: linkWeb("presidente-carnaval-2015/filter.html"),
            text: "Filter",
            self: false,
          },
          {
            url: linkWeb("presidente-carnaval-2015/home.html"),
            text: "Home",
            self: false,
          },
          {
            url: linkGithub("presidente-carnaval-2015"),
            text: "Github",
            self: false,
          },
        ],
      },
      {
        date: "2015/05/20",
        title: "Recarga Con RedRock",
        types: type.motionGraphics,
        disabled: true,
        clients: [
          client.redRock,
        ],
        tools: [
          tool.flash,
        ],
        links: [
          {
            url: linkVimeo("175240186"),
            text: "Video",
            self: false,
          },
        ],
      },
      {
        date: "2015/10/23",
        title: "Retrobrindis",
        types: type.app,
        disabled: true,
        clients: [
          client.presidente,
        ],
        tools: [
          tool.html,
          tool.css,
          tool.jQuery,
          tool.php,
          tool.git,
        ],
        links: [
          {
            url: linkWeb("presidente-retro-brindis"),
            text: "App",
            self: false,
          },
          {
            url: linkGithub("presidente-retro-brindis"),
            text: "Github",
            self: false,
          },
        ],
      },
      {
        date: "2015/11/12",
        title: "Mineriza a tu Familia",
        types: type.app,
        clients: [
          client.apap,
        ],
        tools: [
          tool.pug,
          tool.jQuery,
          tool.css,
          tool.git,
        ],
        links: [
          {
            url: linkWeb("apap-mineriza-familia"),
            text: "App",
            self: false,
          },
          {
            url: linkGithub("apap-mineriza-familia"),
            text: "Github",
            self: false,
          },
        ],
        children: [
          helpers.getNewID(client.miguelRivas, "2017/04/04"),
        ],
      },
      {
        date: "2017/04/04",
        title: "Promo",
        types: type.motionGraphics,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.afterEffects,
          tool.premiere,
        ],
        links: [
          {
            url: linkVimeo("211801157"),
            text: "Video",
            self: false,
          },
        ],
        disabled: true,
      },
      {
        date: "2015/12/16",
        title: "Verano Presidente 2015",
        types: type.prototype,
        disabled: true,
        clients: [
          client.presidente,
        ],
        tools: [
          tool.html,
          tool.jQuery,
          tool.css,
          tool.git,
        ],
        links: [
          {
            url: linkWeb("presidente-verano-2015"),
            text: "Filter",
            self: false,
          },
          {
            url: linkWeb("presidente-loader"),
            text: "Loader",
            self: false,
          },
          {
            url: linkGithub("presidente-verano-2015"),
            text: "Github",
            self: false,
          },
        ],
      },
      {
        date: "2016/02/22",
        title: "Website",
        types: type.app,
        clients: [
          client.drLogic,
        ],
        tools: [
          tool.haml,
          tool.scss,
          tool.jQuery,
          tool.bootstrap,
          tool.rails,
          tool.git,
        ],
        links: [
          {
            url: linkWeb("drlogic/home.html"),
            text: "Home",
            self: false,
          },
          {
            url: linkWeb("drlogic/about-us.html"),
            text: "About Us",
            self: false,
          },
          {
            url: linkWeb("drlogic/contact-us.html"),
            text: "Contact Us",
            self: false,
          },
          {
            url: linkWeb("drlogic/portfolio.html"),
            text: "Portfolio",
            self: false,
          },
          {
            url: linkWeb("drlogic/404.html"),
            text: "404",
            self: false,
          },
          {
            url: linkGithub("drlogic"),
            text: "Github",
            self: false,
          },
        ],
        children: [
          helpers.getNewID(client.drLogic, "2016/03/08"),
          helpers.getNewID(client.miguelRivas, "2017/03/06"),
        ],
      },
      {
        date: "2017/03/06",
        title: "Promo",
        types: type.animation3D,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.flash,
        ],
        links: [
          {
            url: linkVimeo("207152756"),
            text: "Video",
            self: false,
          },
        ],
        disabled: true,
      },
      {
        date: "2016/03/08",
        title: "Terms and Conditions",
        types: type.document,
        clients: [
          client.drLogic,
        ],
        tools: [
          tool.indesign,
        ],
        disabled: true,
      },
      {
        date: "2016/06/16",
        title: "Server Prompt",
        types: type.prototype,
        clients: [
          client.pixelPerfectTree,
        ],
        tools: [
          tool.haml,
          tool.scss,
          tool.illustrator,
          tool.rails,
          tool.git,
        ],
        disabled: true,
        links: [
          {
            url: linkWeb("pixel-server-prompt/404"),
            text: "404",
            self: false,
          },
          {
            url: linkWeb("pixel-server-prompt/500"),
            text: "500",
            self: false,
          },
          {
            url: linkGithub("pixel-server-prompt"),
            text: "Github",
            self: false,
          },
        ],
      },
      {
        date: "2016/06/30",
        title: "Animated Header",
        types: type.prototype,
        clients: [
          client.voxel,
        ],
        tools: [
          tool.haml,
          tool.scss,
          tool.photoshop,
          tool.rails,
          tool.git,
        ],
        disabled: true,
        links: [
          {
            url: linkWeb("voxel-animation"),
            text: "Animated Header",
            self: false,
          },
          {
            url: linkGithub("voxel-animation"),
            text: "Github",
            self: false,
          },
        ],
      },
      {
        date: "2015/05/27",
        title: "Orange Reel",
        types: type.motionGraphics,
        clients: [
          client.orange,
        ],
        tools: [
          tool.premiere,
        ],
        links: [
          {
            url: linkVimeo("212177083"),
            text: "Video",
            self: false,
          },
        ],
        children: [
          helpers.getNewID(client.orange, "2015/03/22"),
          helpers.getNewID(client.orange, "2015/03/24"),
          helpers.getNewID(client.orange, "2015/03/31"),
          helpers.getNewID(client.orange, "2015/04/24"),
          helpers.getNewID(client.orange, "2015/05/22"),
        ],
      },
      {
        date: "2015/03/22",
        title: "Essentials",
        types: type.motionGraphics,
        clients: [
          client.orange,
        ],
        tools: [
          tool.flash,
        ],
        disabled: true,
      },
      {
        date: "2015/03/24",
        title: "Selfie",
        types: type.motionGraphics,
        clients: [
          client.orange,
        ],
        tools: [
          tool.flash,
        ],
        disabled: true,
      },
      {
        date: "2015/04/24",
        title: "Café",
        types: type.motionGraphics,
        clients: [
          client.orange,
        ],
        tools: [
          tool.flash,
        ],
        disabled: true,
      },
      {
        date: "2015/05/22",
        title: "Día de las Madres",
        types: type.motionGraphics,
        clients: [
          client.orange,
        ],
        tools: [
          tool.flash,
        ],
        disabled: true,
      },
      {
        date: "2015/03/31",
        title: "Snorkeling",
        types: type.motionGraphics,
        clients: [
          client.orange,
        ],
        tools: [
          tool.flash,
        ],
        disabled: true,
      },
      {
        date: "2014/01/14",
        title: "Descubria Website",
        types: type.app,
        disabled: true,
        clients: [
          client.descubria,
        ],
        tools: [
          tool.html,
          tool.css,
          tool.jQuery,
          tool.git,
        ],
        links: [
          {
            url: linkWeb("descubria"),
            text: "Home",
            self: false,
          },
          {
            url: linkGithub("descubria"),
            text: "Github",
            self: false,
          },
        ],
      },
      {
        date: "2014/08/06",
        title: "Server Prompt",
        types: type.prototype,
        clients: [
          client.capitalDBG,
        ],
        tools: [
          tool.html,
          tool.css,
          tool.illustrator,
          tool.git,
        ],
        disabled: true,
        links: [
          {
            url: linkWeb("capital-dbg-server-prompt"),
            text: "Prototype",
            self: false,
          },
          {
            url: linkGithub("capital-dbg-server-prompt"),
            text: "Github",
            self: false,
          },
        ],
      },
      {
        date: "2015/10/28",
        title: "Test",
        types: type.landingPage,
        disabled: true,
        clients: [
          client.pixelPerfectTree,
        ],
        tools: [
          tool.pug,
          tool.scss,
          tool.jQuery,
          tool.illustrator,
          tool.git,
        ],
        links: [
          {
            url: linkWeb("test-pixel-perfect-tree"),
            text: "Test",
            self: false,
          },
          {
            url: linkGithub("test-pixel-perfect-tree"),
            text: "Github",
            self: false,
          },
        ],
      },
      {
        clients: [
          client.presidente,
        ],
        title: "Destapa el Coro: User Flow",
        date: "2014/06/02",
        tools: [
          tool.illustrator,
        ],
        types: type.userFlow,
        disabled: true,
      },
      {
        date: "2020/05/05",
        title: "Popkern",
        types: type.module,
        clients: [
          client.enovational,
        ],
        tools: [
          tool.vue,
          tool.vueRouter,
          tool.rails,
          tool.slim,
          tool.scss,
          tool.git,
          tool.three,
          tool.tweenMax,
        ],
        children: [
          helpers.getNewID(client.miguelRivas, "2020/03/23"),
          helpers.getNewID(client.miguelRivas, "2020/05/09"),
          helpers.getNewID(client.miguelRivas, "2020/06/17"),
          helpers.getNewID(client.miguelRivas, "2020/08/18"),
        ],
        disabled: true,
      },
      {
        date: "2017/09/20",
        title: "Lemon Deal",
        types: type.landingPage,
        clients: [
          client.plantTherapy,
        ],
        tools: [
          tool.html,
          tool.miva,
          tool.css,
          tool.jQuery,
          tool.illustrator,
        ],
        disabled: true,
      },
      {
        date: "2017/12/01",
        title: "25 Days of Christmas",
        types: type.landingPage,
        clients: [
          client.plantTherapy,
        ],
        tools: [
          tool.html,
          tool.miva,
          tool.css,
          tool.jQuery,
          tool.illustrator,
        ],
        disabled: true,
      },
      {
        date: "2015/08/03",
        title: "SIP",
        types: type.app,
        clients: [
          client.capitalDBG,
        ],
        tools: [
          tool.pug,
          tool.scss,
          tool.jQuery,
        ],
        disabled: true,
      },
      {
        date: "2014/10/18",
        title: "Presidente Photo Assignmet",
        types: type.app,
        clients: [
          client.presidente,
        ],
        tools: [
          tool.html,
          tool.jQuery,
          tool.grunt,
          tool.php,
          tool.scss,
        ],
        disabled: true,
      },
      {
        date: "2014/11/05",
        title: "Pronosticos: Wireframe",
        types: type.wireFrame,
        clients: [
          client.presidente,
        ],
        tools: [
          tool.illustrator,
        ],
        disabled: true,
      },
      {
        date: "2016/01/29",
        title: "Shop.pr",
        types: type.document,
        clients: [
          client.pixelPerfectTree,
        ],
        tools: [
          tool.illustrator,
        ],
        disabled: true,
      },
      {
        date: "2017/08/04",
        title: "Chakras",
        disabled: true,
        types: type.wireFrame,
        clients: [
          client.plantTherapy,
        ],
        tools: [
          tool.illustrator,
        ]
      },
      {
        date: "2016/02/18",
        title: "BPR Bank",
        types: type.app,
        clients: [
          client.bprBank,
        ],
        tools: [
          tool.haml,
          tool.scss,
          tool.jQuery,
          tool.bootstrap,
          tool.rails,
          tool.git,
        ],
        disabled: true,
      },
      {
        date: "2016/06/24",
        title: "Social Media Posts",
        types: type.socialMedia,
        disabled: true,
        clients: [
          client.voxel,
        ],
        tools: [
          tool.photoshop,
          tool.illustrator,
        ]
      },
      {
        date: "2019/01/01",
        title: "MSEC Financial Disclosures Portal",
        types: type.app,
        clients: [
          client.enovational,
        ],
        tools: [
          tool.html,
          tool.rails,
          tool.scss,
          tool.git,
          tool.bootstrap,
        ],
        disabled: true,
        links: [
          {
            url: "https://efds.ethics.maryland.gov/",
            text: "Website",
          },
        ],
        children: [
          helpers.getNewID(client.miguelRivas, "2018/05/31"),
        ],
      },
      {
        date: "2018/05/01",
        title: "MDA Vetboard Portal",
        types: type.app,
        clients: [
          client.enovational,
        ],
        tools: [
          tool.html,
          tool.rails,
          tool.scss,
          tool.git,
          tool.bootstrap,
        ],
        disabled: true,
        links: [
          {
            url: "https://portal.mda.maryland.gov/",
            text: "Website"
          },
        ],
        children: [
          helpers.getNewID(client.miguelRivas, "2018/05/31"),
        ],
      },
      {
        date: "2018/06/25",
        title: "Maryland Onestop",
        types: type.app,
        disabled: true,
        clients: [
          client.enovational,
        ],
        tools: [
          tool.vue,
          tool.rails,
          tool.scss,
          tool.git,
          tool.bootstrap,
        ],
        children: [
          helpers.getNewID(client.enovational, "2020/05/05"),
        ],
      },
      {
        date: "2018/09/04",
        title: "Formability",
        types: type.app,
        disabled: true,
        clients: [
          client.enovational,
        ],
        tools: [
          tool.vue,
          tool.vueRouter,
          tool.vuex,
          tool.rails,
          tool.scss,
          tool.git,
          tool.bootstrap,
        ],
        children: [
          helpers.getNewID(client.miguelRivas, "2018/05/31"),
          helpers.getNewID(client.miguelRivas, "2018/06/27"),
          helpers.getNewID(client.miguelRivas, "2018/09/11"),
          helpers.getNewID(client.enovational, "2020/05/05"),
        ],
        links: [
          // {
          //   url: linkWeb("formability/demo"),
          //   text: "Demo",
          //   self: false,
          // },
          // {
          //   url: linkWeb("formability/401"),
          //   text: "401",
          //   self: false,
          // },
          // {
          //   url: linkWeb("formability/404"),
          //   text: "404",
          //   self: false,
          // },
          // {
          //   url: linkWeb("formability/500"),
          //   text: "500",
          //   self: false,
          // },
        ],
      },
      {
        date: "2021/06/21",
        title: "Connections Academy",
        types: type.app,
        disabled: true,
        clients: [
          client.jellyfish,
        ],
        tools: [
          tool.php,
          tool.wordpress,
          tool.html,
          tool.scss,
          tool.git,
          tool.grunt,
        ]
      },
      {
        date: "2021/11/08",
        title: "Bitmap Creator",
        types: type.app,
        disabled: true,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.python,
          tool.tkinter,
        ],
        links: [
          {
            url: linkGithub("bitmap-creator"),
            text: "Github",
            self: false,
          },
          {
            url: linkVimeo("643739212"),
            text: "Video",
            self: false,
          },
        ],
      },
      {
        date: "2021/11/14",
        title: "Spirit 3D",
        types: type.animation3D,
        disabled: true,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.blender,
        ],
        links: [
          {
            url: "https://sketchfab.com/3d-models/monster-3d-435d64cdb0a042dfba2ae21d7d5a6986",
            text: "Spirit",
            self: false,
          },
          {
            url: "https://sketchfab.com/3d-models/404-section-4752fcc0d7714e7fbec4747a2fe10ba9",
            text: "404 section",
            self: false,
          },
        ],
      },
      {
        date: "2021/12/21",
        title: "Kaspar Island",
        types: type.animation3D,
        disabled: true,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.blender,
        ],
        links: [],
      },
      {
        date: "2021/12/30",
        title: "Iqra Island",
        types: type.animation3D,
        disabled: true,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.blender,
        ],
        links: [],
      },
      {
        date: "2021/12/10",
        title: "Goose",
        types: type.animation3D,
        disabled: true,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.blender,
        ],
        links: [],
      },
      {
        date: "2022/01/05",
        title: "MR Universe",
        types: type.animation3D,
        disabled: true,
        clients: [
          client.miguelRivas,
        ],
        tools: [
          tool.unity,
        ],
        children: [
          helpers.getNewID(client.miguelRivas, "2021/11/14"),
          helpers.getNewID(client.miguelRivas, "2021/12/10"),
          helpers.getNewID(client.miguelRivas, "2021/12/21"),
          helpers.getNewID(client.miguelRivas, "2021/12/30"),
        ],
        links: [
          {
            url: "https://play.google.com/store/apps/details?id=com.miguelrivas.github.io.MRUniverse",
            text: "Google Play",
            self: false,
          },
        ],
      },
    ];

    function sortByDate(a, b) {
      return helpers.dateToNumber(b.date) - helpers.dateToNumber(a.date);
    }

    /* ------------------------------------- */

    function uncompressProjectsDBtoJSON(db) {
      const result = {};
      db.forEach(entry => {
        const disabled = entry.disabled ? true : false;
        const children = entry.children || [];

        let links = [];
        if (entry.links?.length > 0) {
          links = entry.links.map(
            link => {
              const params = link.params?.length ? `?${link.params.join("&")}` : '';
              const url = link.url;

              return {
                "url": `${url}${params}`,
                "text": link.text,
                "self": link.self,
              }
            }
          );
        }

        const project = {
          "title": entry.title,
          "clients": entry.clients,
          "date": entry.date,
          "turingDate": helpers.turingDate(entry.date),
          "types": entry.types,
          "links": links,
          "disabled": disabled,
          "tools": entry.tools,
          "children": children,
          "group": false,
          "location": false,
          "image": "",
        };
       
        const id = helpers.getNewID(project.clients[0], project.date);

        try {
          project.image = `https://miguel-rivas.github.io/zapp/img/preview-wide/${id}.jpg`;
        }
        catch {
          project.image = require(`@/img/miguelrivas.jpg`);
        }
        result[id] = project;
      });

      return result;
    }


    /* ------------------------------------- */

    const projectsDBObj = uncompressProjectsDBtoJSON(projects);
    Object.values(projectsDBObj).sort(sortByDate);

    const allDBListVisible = Object.values(projectsDBObj).filter((item) => !item.disabled).sort(sortByDate);

    /* src/views/Projects.svelte generated by Svelte v3.46.4 */
    const file$5 = "src/views/Projects.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[0] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (16:7) <Column size="3/5">
    function create_default_slot_4$1(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*entry*/ ctx[0].image)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*entry*/ ctx[0].header + " preview");
    			add_location(img, file$5, 16, 8, 603);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$1.name,
    		type: "slot",
    		source: "(16:7) <Column size=\\\"3/5\\\">",
    		ctx
    	});

    	return block;
    }

    // (34:8) {#if entry.tools.length > 0}
    function create_if_block$1(ctx) {
    	let ul;
    	let each_value_1 = /*entry*/ ctx[0].tools;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1$1(get_each_context_1$1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "skills");
    			add_location(ul, file$5, 34, 9, 1019);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*allDBListVisible*/ 0) {
    				each_value_1 = /*entry*/ ctx[0].tools;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1$1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(34:8) {#if entry.tools.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (36:10) {#each entry.tools as li}
    function create_each_block_1$1(ctx) {
    	let li;
    	let raw_value = /*li*/ ctx[3] + "";

    	const block = {
    		c: function create() {
    			li = element("li");
    			add_location(li, file$5, 36, 11, 1086);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			li.innerHTML = raw_value;
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(36:10) {#each entry.tools as li}",
    		ctx
    	});

    	return block;
    }

    // (19:7) <Column size="2/5">
    function create_default_slot_3$1(ctx) {
    	let h2;
    	let raw0_value = /*entry*/ ctx[0].clients[0] + "";
    	let t0;
    	let h3;
    	let raw1_value = /*entry*/ ctx[0].title + "";
    	let t1;
    	let h4;
    	let raw2_value = /*entry*/ ctx[0].types + "";
    	let t2;
    	let h5;
    	let time;
    	let raw3_value = /*entry*/ ctx[0].turingDate + "";
    	let t3;
    	let if_block_anchor;
    	let if_block = /*entry*/ ctx[0].tools.length > 0 && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			t0 = space();
    			h3 = element("h3");
    			t1 = space();
    			h4 = element("h4");
    			t2 = space();
    			h5 = element("h5");
    			time = element("time");
    			t3 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			add_location(h2, file$5, 19, 8, 713);
    			add_location(h3, file$5, 22, 8, 774);
    			add_location(h4, file$5, 25, 8, 830);
    			add_location(time, file$5, 29, 9, 900);
    			add_location(h5, file$5, 28, 8, 886);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			h2.innerHTML = raw0_value;
    			insert_dev(target, t0, anchor);
    			insert_dev(target, h3, anchor);
    			h3.innerHTML = raw1_value;
    			insert_dev(target, t1, anchor);
    			insert_dev(target, h4, anchor);
    			h4.innerHTML = raw2_value;
    			insert_dev(target, t2, anchor);
    			insert_dev(target, h5, anchor);
    			append_dev(h5, time);
    			time.innerHTML = raw3_value;
    			insert_dev(target, t3, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (/*entry*/ ctx[0].tools.length > 0) if_block.p(ctx, dirty);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(h4);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(h5);
    			if (detaching) detach_dev(t3);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(19:7) <Column size=\\\"2/5\\\">",
    		ctx
    	});

    	return block;
    }

    // (15:6) <Row spacing="4" breakpoint="lg">
    function create_default_slot_2$1(ctx) {
    	let column0;
    	let t;
    	let column1;
    	let current;

    	column0 = new Column({
    			props: {
    				size: "3/5",
    				$$slots: { default: [create_default_slot_4$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	column1 = new Column({
    			props: {
    				size: "2/5",
    				$$slots: { default: [create_default_slot_3$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(column0.$$.fragment);
    			t = space();
    			create_component(column1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(column0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(column1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const column0_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				column0_changes.$$scope = { dirty, ctx };
    			}

    			column0.$set(column0_changes);
    			const column1_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				column1_changes.$$scope = { dirty, ctx };
    			}

    			column1.$set(column1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(column0.$$.fragment, local);
    			transition_in(column1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(column0.$$.fragment, local);
    			transition_out(column1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(column0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(column1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(15:6) <Row spacing=\\\"4\\\" breakpoint=\\\"lg\\\">",
    		ctx
    	});

    	return block;
    }

    // (13:4) {#each allDBListVisible as entry}
    function create_each_block$1(ctx) {
    	let article;
    	let row;
    	let t;
    	let current;

    	row = new Row({
    			props: {
    				spacing: "4",
    				breakpoint: "lg",
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			article = element("article");
    			create_component(row.$$.fragment);
    			t = space();
    			attr_dev(article, "class", "nano-box");
    			add_location(article, file$5, 13, 5, 501);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			mount_component(row, article, null);
    			append_dev(article, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    			destroy_component(row);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(13:4) {#each allDBListVisible as entry}",
    		ctx
    	});

    	return block;
    }

    // (12:3) <Container width="1450" className="gallery">
    function create_default_slot_1$2(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = allDBListVisible;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*allDBListVisible*/ 0) {
    				each_value = allDBListVisible;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(12:3) <Container width=\\\"1450\\\" className=\\\"gallery\\\">",
    		ctx
    	});

    	return block;
    }

    // (11:2) <ScrollArea color="burn-orange">
    function create_default_slot$2(ctx) {
    	let container;
    	let current;

    	container = new Container({
    			props: {
    				width: "1450",
    				className: "gallery",
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(container.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(container, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const container_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(container.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(container.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(container, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(11:2) <ScrollArea color=\\\"burn-orange\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let section;
    	let scrollarea;
    	let current;

    	scrollarea = new ScrollArea({
    			props: {
    				color: "burn-orange",
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			section = element("section");
    			create_component(scrollarea.$$.fragment);
    			attr_dev(section, "class", "projects");
    			add_location(section, file$5, 9, 1, 348);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			mount_component(scrollarea, section, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const scrollarea_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				scrollarea_changes.$$scope = { dirty, ctx };
    			}

    			scrollarea.$set(scrollarea_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scrollarea.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scrollarea.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(scrollarea);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Projects', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Projects> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		ScrollArea,
    		Row,
    		Column,
    		Container,
    		allDBListVisible
    	});

    	return [];
    }

    class Projects extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Projects",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/components/Star.svelte generated by Svelte v3.46.4 */
    const file$4 = "src/components/Star.svelte";

    function create_fragment$4(ctx) {
    	let canvas_1;

    	const block = {
    		c: function create() {
    			canvas_1 = element("canvas");
    			attr_dev(canvas_1, "width", /*width*/ ctx[3]);
    			attr_dev(canvas_1, "height", /*height*/ ctx[4]);
    			attr_dev(canvas_1, "class", /*classes*/ ctx[2]);
    			attr_dev(canvas_1, "style", /*computedStyle*/ ctx[1]);
    			add_location(canvas_1, file$4, 120, 1, 3467);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, canvas_1, anchor);
    			/*canvas_1_binding*/ ctx[15](canvas_1);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*classes*/ 4) {
    				attr_dev(canvas_1, "class", /*classes*/ ctx[2]);
    			}

    			if (dirty & /*computedStyle*/ 2) {
    				attr_dev(canvas_1, "style", /*computedStyle*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(canvas_1);
    			/*canvas_1_binding*/ ctx[15](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let classes;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Star', slots, []);
    	let { className = "", translation = "200", x = 0, y = 0, sides = 5, rotation = 0, starRadius = 50, innerRadius = 25, starColor = "#f5e65d", originTranslation = 150 } = $$props;
    	let computedTranslation = translation.split(",");

    	let xTranslation = computedTranslation[0],
    		yTranslation = computedTranslation[1] || computedTranslation[0];

    	let width = +starRadius * 2 + +xTranslation;
    	let height = +starRadius * 2 + +yTranslation;
    	let canvas, computedStyle;

    	beforeUpdate(() => {
    		$$invalidate(1, computedStyle = `bottom: ${y}px; `);

    		if (x >= 0) {
    			$$invalidate(1, computedStyle += `left: ${Math.abs(x)}px`);
    		} else {
    			$$invalidate(1, computedStyle += `right: ${Math.abs(x)}px`);
    		}

    		computedStyle.replace(/\s+/g, " ").trim();
    	});

    	onMount(() => {
    		const ctx = canvas.getContext("2d");
    		const ang = Math.PI / 180;

    		let originX = width - starRadius - xTranslation,
    			originY = height - starRadius - yTranslation,
    			px = [],
    			py = [],
    			px2 = [],
    			py2 = [];

    		/* --------------------- defining points --------------------- */
    		for (let counter = 0; counter <= sides - 1; counter++) {
    			px[counter] = Math.cos((rotation + 360 / sides * counter) * ang) * starRadius;
    			py[counter] = Math.sin((rotation + 360 / sides * counter) * -ang) * starRadius;

    			/* --------------------- second shape --------------------- */
    			px2[counter] = Math.cos((rotation + 360 / (sides * 2) + 360 / sides * counter) * ang) * innerRadius;

    			py2[counter] = Math.sin((rotation + 360 / (sides * 2) + 360 / sides * counter) * -ang) * innerRadius;
    		}

    		/* --------------------- drawing the tail --------------------- */
    		ctx.beginPath();

    		ctx.moveTo(originX + px[1], originY + py[1]);
    		ctx.lineTo(originX + px2[3], originY + py2[3]);
    		ctx.lineTo(width - originTranslation, height - originTranslation);
    		ctx.fillStyle = "#d19c4b";
    		ctx.fill();
    		ctx.closePath();
    		ctx.beginPath();
    		ctx.moveTo(originX + px[3], originY + py[3]);
    		ctx.lineTo(originX + px2[3], originY + py2[3]);
    		ctx.lineTo(width - originTranslation, height - originTranslation);
    		ctx.fillStyle = "#453415";
    		ctx.fill();
    		ctx.closePath();
    		ctx.beginPath();
    		ctx.moveTo(originX + px[1], originY + py[1]);
    		ctx.lineTo(originX + px2[4], originY + py2[4]);
    		ctx.lineTo(width - originTranslation, height - originTranslation);
    		ctx.fillStyle = "#63471b";
    		ctx.fill();
    		ctx.closePath();
    		ctx.beginPath();
    		ctx.moveTo(originX + px[4], originY + py[4]);
    		ctx.lineTo(originX + px2[4], originY + py2[4]);
    		ctx.lineTo(width - originTranslation, height - originTranslation);
    		ctx.fillStyle = "#7a5321";
    		ctx.fill();
    		ctx.closePath();
    		ctx.beginPath();
    		ctx.moveTo(originX + px[0], originY + py[0]);
    		ctx.lineTo(originX + px2[4], originY + py2[4]);
    		ctx.lineTo(width - originTranslation, height - originTranslation);
    		ctx.fillStyle = "#a5742a";
    		ctx.fill();
    		ctx.closePath();

    		/* --------------------- drawing the star --------------------- */
    		ctx.beginPath();

    		ctx.moveTo(originX + px[0], originY + py[0]);
    		ctx.lineTo(originX + px2[0], originY + py2[0]);

    		for (let counter = 1; counter <= sides - 1; counter++) {
    			ctx.lineTo(originX + px[counter], originY + py[counter]);
    			ctx.lineTo(originX + px2[counter], originY + py2[counter]);
    		}

    		ctx.fillStyle = starColor;
    		ctx.fill();
    		ctx.closePath();
    	});

    	const writable_props = [
    		'className',
    		'translation',
    		'x',
    		'y',
    		'sides',
    		'rotation',
    		'starRadius',
    		'innerRadius',
    		'starColor',
    		'originTranslation'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Star> was created with unknown prop '${key}'`);
    	});

    	function canvas_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			canvas = $$value;
    			$$invalidate(0, canvas);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('className' in $$props) $$invalidate(5, className = $$props.className);
    		if ('translation' in $$props) $$invalidate(6, translation = $$props.translation);
    		if ('x' in $$props) $$invalidate(7, x = $$props.x);
    		if ('y' in $$props) $$invalidate(8, y = $$props.y);
    		if ('sides' in $$props) $$invalidate(9, sides = $$props.sides);
    		if ('rotation' in $$props) $$invalidate(10, rotation = $$props.rotation);
    		if ('starRadius' in $$props) $$invalidate(11, starRadius = $$props.starRadius);
    		if ('innerRadius' in $$props) $$invalidate(12, innerRadius = $$props.innerRadius);
    		if ('starColor' in $$props) $$invalidate(13, starColor = $$props.starColor);
    		if ('originTranslation' in $$props) $$invalidate(14, originTranslation = $$props.originTranslation);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		beforeUpdate,
    		className,
    		translation,
    		x,
    		y,
    		sides,
    		rotation,
    		starRadius,
    		innerRadius,
    		starColor,
    		originTranslation,
    		computedTranslation,
    		xTranslation,
    		yTranslation,
    		width,
    		height,
    		canvas,
    		computedStyle,
    		classes
    	});

    	$$self.$inject_state = $$props => {
    		if ('className' in $$props) $$invalidate(5, className = $$props.className);
    		if ('translation' in $$props) $$invalidate(6, translation = $$props.translation);
    		if ('x' in $$props) $$invalidate(7, x = $$props.x);
    		if ('y' in $$props) $$invalidate(8, y = $$props.y);
    		if ('sides' in $$props) $$invalidate(9, sides = $$props.sides);
    		if ('rotation' in $$props) $$invalidate(10, rotation = $$props.rotation);
    		if ('starRadius' in $$props) $$invalidate(11, starRadius = $$props.starRadius);
    		if ('innerRadius' in $$props) $$invalidate(12, innerRadius = $$props.innerRadius);
    		if ('starColor' in $$props) $$invalidate(13, starColor = $$props.starColor);
    		if ('originTranslation' in $$props) $$invalidate(14, originTranslation = $$props.originTranslation);
    		if ('computedTranslation' in $$props) computedTranslation = $$props.computedTranslation;
    		if ('xTranslation' in $$props) xTranslation = $$props.xTranslation;
    		if ('yTranslation' in $$props) yTranslation = $$props.yTranslation;
    		if ('width' in $$props) $$invalidate(3, width = $$props.width);
    		if ('height' in $$props) $$invalidate(4, height = $$props.height);
    		if ('canvas' in $$props) $$invalidate(0, canvas = $$props.canvas);
    		if ('computedStyle' in $$props) $$invalidate(1, computedStyle = $$props.computedStyle);
    		if ('classes' in $$props) $$invalidate(2, classes = $$props.classes);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*className*/ 32) {
    			$$invalidate(2, classes = ["star", className].join(" ").replace(/\s+/g, " ").trim());
    		}
    	};

    	return [
    		canvas,
    		computedStyle,
    		classes,
    		width,
    		height,
    		className,
    		translation,
    		x,
    		y,
    		sides,
    		rotation,
    		starRadius,
    		innerRadius,
    		starColor,
    		originTranslation,
    		canvas_1_binding
    	];
    }

    class Star extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			className: 5,
    			translation: 6,
    			x: 7,
    			y: 8,
    			sides: 9,
    			rotation: 10,
    			starRadius: 11,
    			innerRadius: 12,
    			starColor: 13,
    			originTranslation: 14
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Star",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get className() {
    		throw new Error("<Star>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set className(value) {
    		throw new Error("<Star>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get translation() {
    		throw new Error("<Star>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set translation(value) {
    		throw new Error("<Star>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get x() {
    		throw new Error("<Star>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x(value) {
    		throw new Error("<Star>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y() {
    		throw new Error("<Star>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y(value) {
    		throw new Error("<Star>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sides() {
    		throw new Error("<Star>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sides(value) {
    		throw new Error("<Star>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rotation() {
    		throw new Error("<Star>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rotation(value) {
    		throw new Error("<Star>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get starRadius() {
    		throw new Error("<Star>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set starRadius(value) {
    		throw new Error("<Star>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get innerRadius() {
    		throw new Error("<Star>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set innerRadius(value) {
    		throw new Error("<Star>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get starColor() {
    		throw new Error("<Star>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set starColor(value) {
    		throw new Error("<Star>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get originTranslation() {
    		throw new Error("<Star>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set originTranslation(value) {
    		throw new Error("<Star>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* ../../app_web_module_nanogrid-svelte/node_modules/svelte-spa-router/Router.svelte generated by Svelte v3.46.4 */

    /**
     * @typedef {Object} Location
     * @property {string} location - Location (page/view), for example `/book`
     * @property {string} [querystring] - Querystring from the hash, as a string not parsed
     */
    /**
     * Returns the current location from the hash.
     *
     * @returns {Location} Location object
     * @private
     */
    function getLocation() {
    	const hashPosition = window.location.href.indexOf('#/');

    	let location = hashPosition > -1
    	? window.location.href.substr(hashPosition + 1)
    	: '/';

    	// Check if there's a querystring
    	const qsPosition = location.indexOf('?');

    	let querystring = '';

    	if (qsPosition > -1) {
    		querystring = location.substr(qsPosition + 1);
    		location = location.substr(0, qsPosition);
    	}

    	return { location, querystring };
    }

    const loc = readable(null, // eslint-disable-next-line prefer-arrow-callback
    function start(set) {
    	set(getLocation());

    	const update = () => {
    		set(getLocation());
    	};

    	window.addEventListener('hashchange', update, false);

    	return function stop() {
    		window.removeEventListener('hashchange', update, false);
    	};
    });

    derived(loc, $loc => $loc.location);
    derived(loc, $loc => $loc.querystring);

    function link(node, opts) {
    	opts = linkOpts(opts);

    	// Only apply to <a> tags
    	if (!node || !node.tagName || node.tagName.toLowerCase() != 'a') {
    		throw Error('Action "link" can only be used with <a> tags');
    	}

    	updateLink(node, opts);

    	return {
    		update(updated) {
    			updated = linkOpts(updated);
    			updateLink(node, updated);
    		}
    	};
    }

    // Internal function used by the link function
    function updateLink(node, opts) {
    	let href = opts.href || node.getAttribute('href');

    	// Destination must start with '/' or '#/'
    	if (href && href.charAt(0) == '/') {
    		// Add # to the href attribute
    		href = '#' + href;
    	} else if (!href || href.length < 2 || href.slice(0, 2) != '#/') {
    		throw Error('Invalid value for "href" attribute: ' + href);
    	}

    	node.setAttribute('href', href);

    	node.addEventListener('click', event => {
    		// Prevent default anchor onclick behaviour
    		event.preventDefault();

    		if (!opts.disabled) {
    			scrollstateHistoryHandler(event.currentTarget.getAttribute('href'));
    		}
    	});
    }

    // Internal function that ensures the argument of the link action is always an object
    function linkOpts(val) {
    	if (val && typeof val == 'string') {
    		return { href: val };
    	} else {
    		return val || {};
    	}
    }

    /**
     * The handler attached to an anchor tag responsible for updating the
     * current history state with the current scroll state
     *
     * @param {string} href - Destination
     */
    function scrollstateHistoryHandler(href) {
    	// Setting the url (3rd arg) to href will break clicking for reasons, so don't try to do that
    	history.replaceState(
    		{
    			...history.state,
    			__svelte_spa_router_scrollX: window.scrollX,
    			__svelte_spa_router_scrollY: window.scrollY
    		},
    		undefined,
    		undefined
    	);

    	// This will force an update as desired, but this time our scroll state will be attached
    	window.location.hash = href;
    }

    /* ../../app_web_module_nanogrid-svelte/components/Btn.svelte generated by Svelte v3.46.4 */
    const file$3 = "../../app_web_module_nanogrid-svelte/components/Btn.svelte";

    // (47:2) {:else}
    function create_else_block(ctx) {
    	let button;
    	let icon;
    	let t;
    	let current;
    	let mounted;
    	let dispose;

    	icon = new Icon({
    			props: {
    				glyph: /*glyph*/ ctx[0],
    				direction: /*direction*/ ctx[2]
    			},
    			$$inline: true
    		});

    	let if_block = /*text*/ ctx[1] !== "" && create_if_block_2(ctx);

    	let button_levels = [
    		/*$$restProps*/ ctx[6],
    		{ class: /*computedClasses*/ ctx[4] },
    		{ title: /*computedLabel*/ ctx[5] },
    		{ "aria-label": /*computedLabel*/ ctx[5] }
    	];

    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(icon.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			set_attributes(button, button_data);
    			add_location(button, file$3, 47, 4, 945);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(icon, button, null);
    			append_dev(button, t);
    			if (if_block) if_block.m(button, null);
    			if (button.autofocus) button.focus();
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[12], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const icon_changes = {};
    			if (dirty & /*glyph*/ 1) icon_changes.glyph = /*glyph*/ ctx[0];
    			if (dirty & /*direction*/ 4) icon_changes.direction = /*direction*/ ctx[2];
    			icon.$set(icon_changes);

    			if (/*text*/ ctx[1] !== "") {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2(ctx);
    					if_block.c();
    					if_block.m(button, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [
    				dirty & /*$$restProps*/ 64 && /*$$restProps*/ ctx[6],
    				(!current || dirty & /*computedClasses*/ 16) && { class: /*computedClasses*/ ctx[4] },
    				(!current || dirty & /*computedLabel*/ 32) && { title: /*computedLabel*/ ctx[5] },
    				(!current || dirty & /*computedLabel*/ 32) && { "aria-label": /*computedLabel*/ ctx[5] }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			destroy_component(icon);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(47:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (32:2) {#if to !== ""}
    function create_if_block(ctx) {
    	let a;
    	let icon;
    	let t;
    	let current;
    	let mounted;
    	let dispose;

    	icon = new Icon({
    			props: {
    				glyph: /*glyph*/ ctx[0],
    				direction: /*direction*/ ctx[2]
    			},
    			$$inline: true
    		});

    	let if_block = /*text*/ ctx[1] !== "" && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			a = element("a");
    			create_component(icon.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(a, "class", /*computedClasses*/ ctx[4]);
    			attr_dev(a, "title", /*computedLabel*/ ctx[5]);
    			attr_dev(a, "aria-label", /*computedLabel*/ ctx[5]);
    			attr_dev(a, "href", /*to*/ ctx[3]);
    			add_location(a, file$3, 32, 4, 656);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);
    			mount_component(icon, a, null);
    			append_dev(a, t);
    			if (if_block) if_block.m(a, null);
    			current = true;

    			if (!mounted) {
    				dispose = action_destroyer(link.call(null, a));
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const icon_changes = {};
    			if (dirty & /*glyph*/ 1) icon_changes.glyph = /*glyph*/ ctx[0];
    			if (dirty & /*direction*/ 4) icon_changes.direction = /*direction*/ ctx[2];
    			icon.$set(icon_changes);

    			if (/*text*/ ctx[1] !== "") {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					if_block.m(a, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (!current || dirty & /*computedClasses*/ 16) {
    				attr_dev(a, "class", /*computedClasses*/ ctx[4]);
    			}

    			if (!current || dirty & /*computedLabel*/ 32) {
    				attr_dev(a, "title", /*computedLabel*/ ctx[5]);
    			}

    			if (!current || dirty & /*computedLabel*/ 32) {
    				attr_dev(a, "aria-label", /*computedLabel*/ ctx[5]);
    			}

    			if (!current || dirty & /*to*/ 8) {
    				attr_dev(a, "href", /*to*/ ctx[3]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			destroy_component(icon);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(32:2) {#if to !== \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    // (56:6) {#if text !== ""}
    function create_if_block_2(ctx) {
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*text*/ ctx[1]);
    			attr_dev(span, "class", "caption");
    			add_location(span, file$3, 56, 8, 1155);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*text*/ 2) set_data_dev(t, /*text*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(56:6) {#if text !== \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    // (41:6) {#if text !== ""}
    function create_if_block_1(ctx) {
    	let span;
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(/*text*/ ctx[1]);
    			attr_dev(span, "class", "caption");
    			add_location(span, file$3, 41, 8, 854);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*text*/ 2) set_data_dev(t, /*text*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(41:6) {#if text !== \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*to*/ ctx[3] !== "") return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	const omit_props_names = ["glyph","size","text","title","direction","mode","to","color","active"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Btn', slots, []);
    	let { glyph = "", size = "", text = "", title = "", direction = "bottom", mode = "flat", to = "", color = "transparent", active = false } = $$props;
    	let computedClasses, computedLabel;

    	beforeUpdate(() => {
    		let isActive = active ? "active" : "";
    		let btnType = `btn ${mode}`;
    		$$invalidate(5, computedLabel = text !== "" ? undefined : title);
    		$$invalidate(4, computedClasses = [btnType, color, size, isActive].join(" ").replace(/\s+/g, " ").trim());
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(6, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('glyph' in $$new_props) $$invalidate(0, glyph = $$new_props.glyph);
    		if ('size' in $$new_props) $$invalidate(7, size = $$new_props.size);
    		if ('text' in $$new_props) $$invalidate(1, text = $$new_props.text);
    		if ('title' in $$new_props) $$invalidate(8, title = $$new_props.title);
    		if ('direction' in $$new_props) $$invalidate(2, direction = $$new_props.direction);
    		if ('mode' in $$new_props) $$invalidate(9, mode = $$new_props.mode);
    		if ('to' in $$new_props) $$invalidate(3, to = $$new_props.to);
    		if ('color' in $$new_props) $$invalidate(10, color = $$new_props.color);
    		if ('active' in $$new_props) $$invalidate(11, active = $$new_props.active);
    	};

    	$$self.$capture_state = () => ({
    		Icon,
    		link,
    		beforeUpdate,
    		glyph,
    		size,
    		text,
    		title,
    		direction,
    		mode,
    		to,
    		color,
    		active,
    		computedClasses,
    		computedLabel
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('glyph' in $$props) $$invalidate(0, glyph = $$new_props.glyph);
    		if ('size' in $$props) $$invalidate(7, size = $$new_props.size);
    		if ('text' in $$props) $$invalidate(1, text = $$new_props.text);
    		if ('title' in $$props) $$invalidate(8, title = $$new_props.title);
    		if ('direction' in $$props) $$invalidate(2, direction = $$new_props.direction);
    		if ('mode' in $$props) $$invalidate(9, mode = $$new_props.mode);
    		if ('to' in $$props) $$invalidate(3, to = $$new_props.to);
    		if ('color' in $$props) $$invalidate(10, color = $$new_props.color);
    		if ('active' in $$props) $$invalidate(11, active = $$new_props.active);
    		if ('computedClasses' in $$props) $$invalidate(4, computedClasses = $$new_props.computedClasses);
    		if ('computedLabel' in $$props) $$invalidate(5, computedLabel = $$new_props.computedLabel);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		glyph,
    		text,
    		direction,
    		to,
    		computedClasses,
    		computedLabel,
    		$$restProps,
    		size,
    		title,
    		mode,
    		color,
    		active,
    		click_handler
    	];
    }

    class Btn extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			glyph: 0,
    			size: 7,
    			text: 1,
    			title: 8,
    			direction: 2,
    			mode: 9,
    			to: 3,
    			color: 10,
    			active: 11
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Btn",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get glyph() {
    		throw new Error("<Btn>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set glyph(value) {
    		throw new Error("<Btn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Btn>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Btn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get text() {
    		throw new Error("<Btn>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Btn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Btn>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Btn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get direction() {
    		throw new Error("<Btn>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set direction(value) {
    		throw new Error("<Btn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get mode() {
    		throw new Error("<Btn>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set mode(value) {
    		throw new Error("<Btn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get to() {
    		throw new Error("<Btn>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error("<Btn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get color() {
    		throw new Error("<Btn>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Btn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<Btn>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<Btn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/views/Contact.svelte generated by Svelte v3.46.4 */
    const file$2 = "src/views/Contact.svelte";

    function create_fragment$2(ctx) {
    	let section;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let form;
    	let input0;
    	let t1;
    	let input1;
    	let t2;
    	let textarea;
    	let t3;
    	let btn;
    	let t4;
    	let star0;
    	let t5;
    	let star1;
    	let t6;
    	let star2;
    	let t7;
    	let star3;
    	let t8;
    	let star4;
    	let t9;
    	let star5;
    	let t10;
    	let star6;
    	let t11;
    	let star7;
    	let t12;
    	let star8;
    	let t13;
    	let star9;
    	let t14;
    	let div1;
    	let div1_style_value;
    	let t15;
    	let div2;
    	let div2_style_value;
    	let t16;
    	let div3;
    	let div3_style_value;
    	let current;
    	let mounted;
    	let dispose;

    	btn = new Btn({
    			props: {
    				color: "emerald",
    				text: "Send",
    				mode: "flat"
    			},
    			$$inline: true
    		});

    	star0 = new Star({
    			props: {
    				x: -/*mX*/ ctx[0] * 0.008,
    				y: /*mX*/ ctx[0] * 0.005,
    				className: "st4 left",
    				translation: "500, 180"
    			},
    			$$inline: true
    		});

    	star1 = new Star({
    			props: {
    				x: /*mX*/ ctx[0] * 0.008,
    				y: /*mX*/ ctx[0] * 0.005,
    				className: "st4 right",
    				translation: "500, 180"
    			},
    			$$inline: true
    		});

    	star2 = new Star({
    			props: {
    				x: -/*mX*/ ctx[0] * 0.004,
    				y: -/*mY*/ ctx[1] * 0.006,
    				className: "st3 left",
    				translation: "350, 350"
    			},
    			$$inline: true
    		});

    	star3 = new Star({
    			props: {
    				x: /*mX*/ ctx[0] * 0.004,
    				y: -/*mY*/ ctx[1] * 0.006,
    				className: "st3 right",
    				translation: "350, 350"
    			},
    			$$inline: true
    		});

    	star4 = new Star({
    			props: {
    				x: -/*mY*/ ctx[1] * 0.005,
    				y: /*mX*/ ctx[0] * 0.002,
    				className: "st2 left",
    				translation: "470, 300"
    			},
    			$$inline: true
    		});

    	star5 = new Star({
    			props: {
    				x: /*mY*/ ctx[1] * 0.005,
    				y: /*mX*/ ctx[0] * 0.002,
    				className: "st2 right",
    				translation: "470, 300"
    			},
    			$$inline: true
    		});

    	star6 = new Star({
    			props: {
    				x: -/*mX*/ ctx[0] * 0.006,
    				y: /*mY*/ ctx[1] * 0.005,
    				className: "st5 left",
    				translation: "400, 30",
    				starRadius: "70",
    				innerRadius: "35"
    			},
    			$$inline: true
    		});

    	star7 = new Star({
    			props: {
    				x: /*mX*/ ctx[0] * 0.006,
    				y: /*mY*/ ctx[1] * 0.005,
    				className: "st5 right",
    				translation: "400, 30",
    				starRadius: "70",
    				innerRadius: "35"
    			},
    			$$inline: true
    		});

    	star8 = new Star({
    			props: {
    				x: -/*mY*/ ctx[1] * 0.002,
    				y: /*mX*/ ctx[0] * 0.003,
    				className: "st1 left",
    				translation: "350, 200",
    				starRadius: "40",
    				innerRadius: "20"
    			},
    			$$inline: true
    		});

    	star9 = new Star({
    			props: {
    				x: /*mY*/ ctx[1] * 0.002,
    				y: /*mX*/ ctx[0] * 0.003,
    				className: "st1 right",
    				translation: "350, 200",
    				starRadius: "40",
    				innerRadius: "20"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			section = element("section");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			form = element("form");
    			input0 = element("input");
    			t1 = space();
    			input1 = element("input");
    			t2 = space();
    			textarea = element("textarea");
    			t3 = space();
    			create_component(btn.$$.fragment);
    			t4 = space();
    			create_component(star0.$$.fragment);
    			t5 = space();
    			create_component(star1.$$.fragment);
    			t6 = space();
    			create_component(star2.$$.fragment);
    			t7 = space();
    			create_component(star3.$$.fragment);
    			t8 = space();
    			create_component(star4.$$.fragment);
    			t9 = space();
    			create_component(star5.$$.fragment);
    			t10 = space();
    			create_component(star6.$$.fragment);
    			t11 = space();
    			create_component(star7.$$.fragment);
    			t12 = space();
    			create_component(star8.$$.fragment);
    			t13 = space();
    			create_component(star9.$$.fragment);
    			t14 = space();
    			div1 = element("div");
    			t15 = space();
    			div2 = element("div");
    			t16 = space();
    			div3 = element("div");
    			if (!src_url_equal(img.src, img_src_value = "./imgs/form-header.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "form-header");
    			add_location(img, file$2, 17, 6, 405);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "name", "name");
    			attr_dev(input0, "placeholder", "Name");
    			add_location(input0, file$2, 19, 8, 490);
    			attr_dev(input1, "type", "email");
    			attr_dev(input1, "name", "email");
    			attr_dev(input1, "placeholder", "Email");
    			add_location(input1, file$2, 20, 8, 551);
    			attr_dev(textarea, "name", "topic");
    			attr_dev(textarea, "cols", "30");
    			attr_dev(textarea, "rows", "10");
    			attr_dev(textarea, "placeholder", "Message");
    			add_location(textarea, file$2, 21, 8, 615);
    			add_location(form, file$2, 18, 6, 475);
    			attr_dev(div0, "class", "form-container");
    			add_location(div0, file$2, 16, 4, 370);
    			attr_dev(div1, "class", "bird b1");
    			attr_dev(div1, "style", div1_style_value = `transform: translate(${/*mX*/ ctx[0] * -0.005}px, ${/*mY*/ ctx[1] * -0.007}px)`);
    			add_location(div1, file$2, 97, 4, 2248);
    			attr_dev(div2, "class", "bird b2");
    			attr_dev(div2, "style", div2_style_value = `transform: translate(${/*mY*/ ctx[1] * -0.003}px, ${/*mX*/ ctx[0] * 0.002}px)`);
    			add_location(div2, file$2, 98, 4, 2343);
    			attr_dev(div3, "class", "bird b3");
    			attr_dev(div3, "style", div3_style_value = `transform: translate(${/*mX*/ ctx[0] * 0.009}px, ${/*mY*/ ctx[1] * -0.008}px)`);
    			add_location(div3, file$2, 99, 4, 2437);
    			attr_dev(section, "class", "contact");
    			add_location(section, file$2, 15, 2, 340);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div0);
    			append_dev(div0, img);
    			append_dev(div0, t0);
    			append_dev(div0, form);
    			append_dev(form, input0);
    			append_dev(form, t1);
    			append_dev(form, input1);
    			append_dev(form, t2);
    			append_dev(form, textarea);
    			append_dev(form, t3);
    			mount_component(btn, form, null);
    			append_dev(div0, t4);
    			mount_component(star0, div0, null);
    			append_dev(div0, t5);
    			mount_component(star1, div0, null);
    			append_dev(div0, t6);
    			mount_component(star2, div0, null);
    			append_dev(div0, t7);
    			mount_component(star3, div0, null);
    			append_dev(div0, t8);
    			mount_component(star4, div0, null);
    			append_dev(div0, t9);
    			mount_component(star5, div0, null);
    			append_dev(div0, t10);
    			mount_component(star6, div0, null);
    			append_dev(div0, t11);
    			mount_component(star7, div0, null);
    			append_dev(div0, t12);
    			mount_component(star8, div0, null);
    			append_dev(div0, t13);
    			mount_component(star9, div0, null);
    			append_dev(section, t14);
    			append_dev(section, div1);
    			append_dev(section, t15);
    			append_dev(section, div2);
    			append_dev(section, t16);
    			append_dev(section, div3);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "mousemove", /*moveObjects*/ ctx[2], false, false, false),
    					listen_dev(window, "load", /*moveObjects*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const star0_changes = {};
    			if (dirty & /*mX*/ 1) star0_changes.x = -/*mX*/ ctx[0] * 0.008;
    			if (dirty & /*mX*/ 1) star0_changes.y = /*mX*/ ctx[0] * 0.005;
    			star0.$set(star0_changes);
    			const star1_changes = {};
    			if (dirty & /*mX*/ 1) star1_changes.x = /*mX*/ ctx[0] * 0.008;
    			if (dirty & /*mX*/ 1) star1_changes.y = /*mX*/ ctx[0] * 0.005;
    			star1.$set(star1_changes);
    			const star2_changes = {};
    			if (dirty & /*mX*/ 1) star2_changes.x = -/*mX*/ ctx[0] * 0.004;
    			if (dirty & /*mY*/ 2) star2_changes.y = -/*mY*/ ctx[1] * 0.006;
    			star2.$set(star2_changes);
    			const star3_changes = {};
    			if (dirty & /*mX*/ 1) star3_changes.x = /*mX*/ ctx[0] * 0.004;
    			if (dirty & /*mY*/ 2) star3_changes.y = -/*mY*/ ctx[1] * 0.006;
    			star3.$set(star3_changes);
    			const star4_changes = {};
    			if (dirty & /*mY*/ 2) star4_changes.x = -/*mY*/ ctx[1] * 0.005;
    			if (dirty & /*mX*/ 1) star4_changes.y = /*mX*/ ctx[0] * 0.002;
    			star4.$set(star4_changes);
    			const star5_changes = {};
    			if (dirty & /*mY*/ 2) star5_changes.x = /*mY*/ ctx[1] * 0.005;
    			if (dirty & /*mX*/ 1) star5_changes.y = /*mX*/ ctx[0] * 0.002;
    			star5.$set(star5_changes);
    			const star6_changes = {};
    			if (dirty & /*mX*/ 1) star6_changes.x = -/*mX*/ ctx[0] * 0.006;
    			if (dirty & /*mY*/ 2) star6_changes.y = /*mY*/ ctx[1] * 0.005;
    			star6.$set(star6_changes);
    			const star7_changes = {};
    			if (dirty & /*mX*/ 1) star7_changes.x = /*mX*/ ctx[0] * 0.006;
    			if (dirty & /*mY*/ 2) star7_changes.y = /*mY*/ ctx[1] * 0.005;
    			star7.$set(star7_changes);
    			const star8_changes = {};
    			if (dirty & /*mY*/ 2) star8_changes.x = -/*mY*/ ctx[1] * 0.002;
    			if (dirty & /*mX*/ 1) star8_changes.y = /*mX*/ ctx[0] * 0.003;
    			star8.$set(star8_changes);
    			const star9_changes = {};
    			if (dirty & /*mY*/ 2) star9_changes.x = /*mY*/ ctx[1] * 0.002;
    			if (dirty & /*mX*/ 1) star9_changes.y = /*mX*/ ctx[0] * 0.003;
    			star9.$set(star9_changes);

    			if (!current || dirty & /*mX, mY*/ 3 && div1_style_value !== (div1_style_value = `transform: translate(${/*mX*/ ctx[0] * -0.005}px, ${/*mY*/ ctx[1] * -0.007}px)`)) {
    				attr_dev(div1, "style", div1_style_value);
    			}

    			if (!current || dirty & /*mY, mX*/ 3 && div2_style_value !== (div2_style_value = `transform: translate(${/*mY*/ ctx[1] * -0.003}px, ${/*mX*/ ctx[0] * 0.002}px)`)) {
    				attr_dev(div2, "style", div2_style_value);
    			}

    			if (!current || dirty & /*mX, mY*/ 3 && div3_style_value !== (div3_style_value = `transform: translate(${/*mX*/ ctx[0] * 0.009}px, ${/*mY*/ ctx[1] * -0.008}px)`)) {
    				attr_dev(div3, "style", div3_style_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(btn.$$.fragment, local);
    			transition_in(star0.$$.fragment, local);
    			transition_in(star1.$$.fragment, local);
    			transition_in(star2.$$.fragment, local);
    			transition_in(star3.$$.fragment, local);
    			transition_in(star4.$$.fragment, local);
    			transition_in(star5.$$.fragment, local);
    			transition_in(star6.$$.fragment, local);
    			transition_in(star7.$$.fragment, local);
    			transition_in(star8.$$.fragment, local);
    			transition_in(star9.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(btn.$$.fragment, local);
    			transition_out(star0.$$.fragment, local);
    			transition_out(star1.$$.fragment, local);
    			transition_out(star2.$$.fragment, local);
    			transition_out(star3.$$.fragment, local);
    			transition_out(star4.$$.fragment, local);
    			transition_out(star5.$$.fragment, local);
    			transition_out(star6.$$.fragment, local);
    			transition_out(star7.$$.fragment, local);
    			transition_out(star8.$$.fragment, local);
    			transition_out(star9.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(btn);
    			destroy_component(star0);
    			destroy_component(star1);
    			destroy_component(star2);
    			destroy_component(star3);
    			destroy_component(star4);
    			destroy_component(star5);
    			destroy_component(star6);
    			destroy_component(star7);
    			destroy_component(star8);
    			destroy_component(star9);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Contact', slots, []);
    	let mX = 1, mY = 1;

    	function moveObjects(event) {
    		$$invalidate(0, mX = parseInt(event.clientX) || 1);
    		$$invalidate(1, mY = parseInt(event.clientY) || 1);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Contact> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Star, Btn, mX, mY, moveObjects });

    	$$self.$inject_state = $$props => {
    		if ('mX' in $$props) $$invalidate(0, mX = $$props.mX);
    		if ('mY' in $$props) $$invalidate(1, mY = $$props.mY);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [mX, mY, moveObjects];
    }

    class Contact extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Contact",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    const Store = writable({
      theme: 'night'
    });

    /* src/components/Navigation.svelte generated by Svelte v3.46.4 */
    const file$1 = "src/components/Navigation.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	return child_ctx;
    }

    // (38:12) {#each navigation as nav}
    function create_each_block_1(ctx) {
    	let btn;
    	let current;

    	btn = new Btn({
    			props: {
    				glyph: /*nav*/ ctx[10].icon,
    				size: "md",
    				mode: "transparent",
    				color: "burn-orange",
    				direction: "top",
    				to: /*nav*/ ctx[10].route[0],
    				active: /*nav*/ ctx[10].route.includes(/*currentLocation*/ ctx[0]),
    				title: `${/*nav*/ ctx[10].tooltip} button`
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(btn.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(btn, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const btn_changes = {};
    			if (dirty & /*currentLocation*/ 1) btn_changes.active = /*nav*/ ctx[10].route.includes(/*currentLocation*/ ctx[0]);
    			btn.$set(btn_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(btn.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(btn.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(btn, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(38:12) {#each navigation as nav}",
    		ctx
    	});

    	return block;
    }

    // (51:12) {#each skins as skin}
    function create_each_block(ctx) {
    	let btn;
    	let current;

    	function click_handler() {
    		return /*click_handler*/ ctx[6](/*skin*/ ctx[7]);
    	}

    	btn = new Btn({
    			props: {
    				glyph: /*skin*/ ctx[7].icon,
    				size: "md",
    				mode: "transparent",
    				color: "gold-tips",
    				direction: "top",
    				active: /*$Store*/ ctx[1].theme === /*skin*/ ctx[7].evento,
    				title: `${/*skin*/ ctx[7].tooltip} button`
    			},
    			$$inline: true
    		});

    	btn.$on("click", click_handler);

    	const block = {
    		c: function create() {
    			create_component(btn.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(btn, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const btn_changes = {};
    			if (dirty & /*$Store*/ 2) btn_changes.active = /*$Store*/ ctx[1].theme === /*skin*/ ctx[7].evento;
    			btn.$set(btn_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(btn.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(btn.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(btn, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(51:12) {#each skins as skin}",
    		ctx
    	});

    	return block;
    }

    // (37:10) <Column>
    function create_default_slot_4(ctx) {
    	let t0;
    	let hr;
    	let t1;
    	let each1_anchor;
    	let current;
    	let each_value_1 = /*navigation*/ ctx[2];
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const out = i => transition_out(each_blocks_1[i], 1, 1, () => {
    		each_blocks_1[i] = null;
    	});

    	let each_value = /*skins*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out_1 = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t0 = space();
    			hr = element("hr");
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each1_anchor = empty();
    			add_location(hr, file$1, 49, 12, 1727);
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(target, anchor);
    			}

    			insert_dev(target, t0, anchor);
    			insert_dev(target, hr, anchor);
    			insert_dev(target, t1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*navigation, currentLocation*/ 5) {
    				each_value_1 = /*navigation*/ ctx[2];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    						transition_in(each_blocks_1[i], 1);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						transition_in(each_blocks_1[i], 1);
    						each_blocks_1[i].m(t0.parentNode, t0);
    					}
    				}

    				group_outros();

    				for (i = each_value_1.length; i < each_blocks_1.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (dirty & /*skins, $Store, setSkin*/ 26) {
    				each_value = /*skins*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each1_anchor.parentNode, each1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out_1(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks_1[i]);
    			}

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks_1 = each_blocks_1.filter(Boolean);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				transition_out(each_blocks_1[i]);
    			}

    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks_1, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(hr);
    			if (detaching) detach_dev(t1);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(37:10) <Column>",
    		ctx
    	});

    	return block;
    }

    // (36:8) <Row vertical={true}>
    function create_default_slot_3(ctx) {
    	let column;
    	let current;

    	column = new Column({
    			props: {
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(column.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(column, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const column_changes = {};

    			if (dirty & /*$$scope, $Store, currentLocation*/ 8195) {
    				column_changes.$$scope = { dirty, ctx };
    			}

    			column.$set(column_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(column.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(column.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(column, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(36:8) <Row vertical={true}>",
    		ctx
    	});

    	return block;
    }

    // (35:6) <Container>
    function create_default_slot_2(ctx) {
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				vertical: true,
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(row.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(row, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const row_changes = {};

    			if (dirty & /*$$scope, $Store, currentLocation*/ 8195) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(row, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(35:6) <Container>",
    		ctx
    	});

    	return block;
    }

    // (34:4) <ScrollArea color="burn-orange">
    function create_default_slot_1$1(ctx) {
    	let container;
    	let current;

    	container = new Container({
    			props: {
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(container.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(container, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const container_changes = {};

    			if (dirty & /*$$scope, $Store, currentLocation*/ 8195) {
    				container_changes.$$scope = { dirty, ctx };
    			}

    			container.$set(container_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(container.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(container.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(container, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(34:4) <ScrollArea color=\\\"burn-orange\\\">",
    		ctx
    	});

    	return block;
    }

    // (33:2) <Column size="50" className="main-panel">
    function create_default_slot$1(ctx) {
    	let scrollarea;
    	let current;

    	scrollarea = new ScrollArea({
    			props: {
    				color: "burn-orange",
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(scrollarea.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(scrollarea, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const scrollarea_changes = {};

    			if (dirty & /*$$scope, $Store, currentLocation*/ 8195) {
    				scrollarea_changes.$$scope = { dirty, ctx };
    			}

    			scrollarea.$set(scrollarea_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(scrollarea.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(scrollarea.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(scrollarea, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(33:2) <Column size=\\\"50\\\" className=\\\"main-panel\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let column;
    	let current;

    	column = new Column({
    			props: {
    				size: "50",
    				className: "main-panel",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(column.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(column, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const column_changes = {};

    			if (dirty & /*$$scope, $Store, currentLocation*/ 8195) {
    				column_changes.$$scope = { dirty, ctx };
    			}

    			column.$set(column_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(column.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(column.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(column, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let currentLocation;
    	let $location;
    	let $Store;
    	validate_store(location, 'location');
    	component_subscribe($$self, location, $$value => $$invalidate(5, $location = $$value));
    	validate_store(Store, 'Store');
    	component_subscribe($$self, Store, $$value => $$invalidate(1, $Store = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Navigation', slots, []);

    	const navigation = [
    		{
    			icon: "avo",
    			route: ["/home", "/"],
    			tooltip: "Home"
    		},
    		{
    			icon: "duck",
    			route: ["/projects"],
    			tooltip: "Projects"
    		},
    		{
    			icon: "paper-plane",
    			route: ["/contact"],
    			tooltip: "Contact Me"
    		}
    	];

    	const skins = [
    		{
    			icon: "leaf",
    			evento: "clock",
    			tooltip: "Tree Clock"
    		},
    		{
    			icon: "teapot",
    			evento: "underwater",
    			tooltip: "Underwater"
    		},
    		{
    			icon: "fire",
    			evento: "dragon",
    			tooltip: "Dragon"
    		},
    		{
    			icon: "brightness",
    			evento: "sunset",
    			tooltip: "Sunset"
    		},
    		{
    			icon: "fire",
    			evento: "dragon-night",
    			tooltip: "Dragon Night"
    		},
    		{
    			icon: "moon",
    			evento: "night",
    			tooltip: "Night"
    		}
    	];

    	function setSkin(skin) {
    		set_store_value(Store, $Store.theme = skin, $Store);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Navigation> was created with unknown prop '${key}'`);
    	});

    	const click_handler = skin => setSkin(skin.evento);

    	$$self.$capture_state = () => ({
    		Row,
    		Column,
    		Btn,
    		Container,
    		ScrollArea,
    		location,
    		Store,
    		navigation,
    		skins,
    		setSkin,
    		currentLocation,
    		$location,
    		$Store
    	});

    	$$self.$inject_state = $$props => {
    		if ('currentLocation' in $$props) $$invalidate(0, currentLocation = $$props.currentLocation);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$location*/ 32) {
    			$$invalidate(0, currentLocation = $location);
    		}
    	};

    	return [currentLocation, $Store, navigation, skins, setSkin, $location, click_handler];
    }

    class Navigation extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navigation",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.46.4 */
    const file = "src/App.svelte";

    // (52:3) <Column size="100%-50" className="workarea">
    function create_default_slot_1(ctx) {
    	let router;
    	let t0;
    	let div0;
    	let t1;
    	let footer;
    	let div1;
    	let t2;
    	let div2;
    	let t3;
    	let div3;
    	let current;

    	router = new Router({
    			props: { routes: /*routes*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    			t0 = space();
    			div0 = element("div");
    			t1 = space();
    			footer = element("footer");
    			div1 = element("div");
    			t2 = space();
    			div2 = element("div");
    			t3 = space();
    			div3 = element("div");
    			attr_dev(div0, "class", "bk-ornament");
    			add_location(div0, file, 53, 4, 1498);
    			attr_dev(div1, "class", "clouds");
    			add_location(div1, file, 55, 5, 1544);
    			attr_dev(div2, "class", "city");
    			add_location(div2, file, 56, 5, 1572);
    			attr_dev(div3, "class", "mountains");
    			add_location(div3, file, 57, 5, 1598);
    			add_location(footer, file, 54, 4, 1530);
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, footer, anchor);
    			append_dev(footer, div1);
    			append_dev(footer, t2);
    			append_dev(footer, div2);
    			append_dev(footer, t3);
    			append_dev(footer, div3);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(52:3) <Column size=\\\"100%-50\\\" className=\\\"workarea\\\">",
    		ctx
    	});

    	return block;
    }

    // (50:2) <Row className="nano-app">
    function create_default_slot(ctx) {
    	let navigation;
    	let t;
    	let column;
    	let current;
    	navigation = new Navigation({ $$inline: true });

    	column = new Column({
    			props: {
    				size: "100%-50",
    				className: "workarea",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(navigation.$$.fragment);
    			t = space();
    			create_component(column.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(navigation, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(column, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const column_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				column_changes.$$scope = { dirty, ctx };
    			}

    			column.$set(column_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navigation.$$.fragment, local);
    			transition_in(column.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navigation.$$.fragment, local);
    			transition_out(column.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navigation, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(column, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(50:2) <Row className=\\\"nano-app\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let row;
    	let current;

    	row = new Row({
    			props: {
    				className: "nano-app",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(row.$$.fragment);
    			attr_dev(main, "class", /*computedClasses*/ ctx[0]);
    			add_location(main, file, 48, 1, 1344);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(row, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const row_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				row_changes.$$scope = { dirty, ctx };
    			}

    			row.$set(row_changes);

    			if (!current || dirty & /*computedClasses*/ 1) {
    				attr_dev(main, "class", /*computedClasses*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(row.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(row.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(row);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $Store;
    	let $location;
    	validate_store(Store, 'Store');
    	component_subscribe($$self, Store, $$value => $$invalidate(2, $Store = $$value));
    	validate_store(location, 'location');
    	component_subscribe($$self, location, $$value => $$invalidate(3, $location = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	let routes = {
    		"/home": Home,
    		"/projects": Projects,
    		"/contact": Contact,
    		"*": Home
    	};

    	let currentHour = new Date().toLocaleString("en-US", { hour: "numeric", hour12: false });

    	if (currentHour >= 0 && currentHour <= 4) {
    		set_store_value(Store, $Store.theme = "dragon", $Store);
    	} else if (currentHour >= 5 && currentHour <= 11) {
    		set_store_value(Store, $Store.theme = "clock", $Store);
    	} else if (currentHour >= 12 && currentHour <= 14) {
    		set_store_value(Store, $Store.theme = "underwater", $Store);
    	} else if (currentHour >= 15 && currentHour <= 17) {
    		set_store_value(Store, $Store.theme = "sunset", $Store);
    	} else if (currentHour >= 18 && currentHour <= 20) {
    		set_store_value(Store, $Store.theme = "dragon-night", $Store);
    	}

    	let computedClasses;

    	beforeUpdate(() => {
    		let currentLocation = `section-${$location.substring(1)}`;
    		$$invalidate(0, computedClasses = ["svelte-theme", $Store.theme, currentLocation].join(" ").replace(/\s+/g, " ").trim());
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Router,
    		Home,
    		Projects,
    		Contact,
    		Navigation,
    		Row,
    		Column,
    		Store,
    		location,
    		beforeUpdate,
    		routes,
    		currentHour,
    		computedClasses,
    		$Store,
    		$location
    	});

    	$$self.$inject_state = $$props => {
    		if ('routes' in $$props) $$invalidate(1, routes = $$props.routes);
    		if ('currentHour' in $$props) currentHour = $$props.currentHour;
    		if ('computedClasses' in $$props) $$invalidate(0, computedClasses = $$props.computedClasses);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [computedClasses, routes];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
