// lib/presets/frontend.ts
// 前端工程师面试全攻略预设：15 知识节点 + 36 道高频面试题 + 学习计划
// 覆盖：HTML/CSS、JS 核心、ES6+、TypeScript、React、Vue、状态管理、构建工具、
//       性能优化、浏览器原理、工程化、移动端

import type { KnowledgeNode, Question, ScheduleItem } from "../types";

const FRONTEND_NODES: KnowledgeNode[] = [
  {
    id: "fe-html-css",
    title: "HTML/CSS 基础",
    difficulty: 2,
    prerequisites: [],
    frequency: "高",
    summary: "盒模型（content-box vs border-box）、Flex 与 Grid 布局、响应式（媒体查询 / rem / vw）。",
    mastery: 0,
  },
  {
    id: "fe-js-core",
    title: "JavaScript 核心",
    difficulty: 3,
    prerequisites: [],
    frequency: "高",
    summary: "闭包、原型链、this 绑定规则、事件循环（宏任务/微任务）。",
    mastery: 0,
  },
  {
    id: "fe-es6",
    title: "ES6+",
    difficulty: 3,
    prerequisites: ["fe-js-core"],
    frequency: "高",
    summary: "Promise 链与错误处理、async/await、ESM 模块化、解构/展开、Symbol/Map/Set。",
    mastery: 0,
  },
  {
    id: "fe-ts",
    title: "TypeScript",
    difficulty: 3,
    prerequisites: ["fe-es6"],
    frequency: "高",
    summary: "类型系统（接口/类型别名）、泛型、工具类型（Partial/Pick/Omit/Record）、类型守卫。",
    mastery: 0,
  },
  {
    id: "fe-react-basic",
    title: "React 基础",
    difficulty: 3,
    prerequisites: ["fe-es6"],
    frequency: "高",
    summary: "JSX 本质、函数/类组件、Props 与 State、生命周期（对应 Hooks）、受控/非受控组件。",
    mastery: 0,
  },
  {
    id: "fe-react-hooks",
    title: "React Hooks",
    difficulty: 3,
    prerequisites: ["fe-react-basic"],
    frequency: "高",
    summary: "useState/useEffect/useMemo/useCallback/useRef/useContext + 自定义 Hook + 依赖陷阱。",
    mastery: 0,
  },
  {
    id: "fe-react-advanced",
    title: "React 进阶",
    difficulty: 4,
    prerequisites: ["fe-react-hooks"],
    frequency: "中",
    summary: "Context + useReducer、Suspense/懒加载、Concurrent 模式、Fiber 与调和、并发渲染。",
    mastery: 0,
  },
  {
    id: "fe-vue-basic",
    title: "Vue 基础",
    difficulty: 3,
    prerequisites: ["fe-es6"],
    frequency: "中",
    summary: "响应式原理（Proxy/defineProperty）、模板编译、指令、组件通信（props/emit/provide-inject）。",
    mastery: 0,
  },
  {
    id: "fe-vue-advanced",
    title: "Vue 进阶",
    difficulty: 4,
    prerequisites: ["fe-vue-basic"],
    frequency: "中",
    summary: "Composition API、setup 语法糖、Pinia 状态管理、Vue Router 守卫与动态路由。",
    mastery: 0,
  },
  {
    id: "fe-state-mgmt",
    title: "状态管理",
    difficulty: 4,
    prerequisites: ["fe-react-basic"],
    frequency: "高",
    summary: "Redux（reducer/中间件/异步 thunk-saga）、Zustand 极简、Recoil 原子化；选型与权衡。",
    mastery: 0,
  },
  {
    id: "fe-build-tools",
    title: "构建工具",
    difficulty: 3,
    prerequisites: ["fe-es6"],
    frequency: "高",
    summary: "Vite（ESM dev server + Rollup 打包）、Webpack（loader/plugin/分包）、Rollup、esbuild。",
    mastery: 0,
  },
  {
    id: "fe-perf",
    title: "性能优化",
    difficulty: 4,
    prerequisites: ["fe-react-hooks"],
    frequency: "高",
    summary: "懒加载、虚拟列表、memo/useMemo、打包优化（tree-shaking/code-split）、首屏指标。",
    mastery: 0,
  },
  {
    id: "fe-browser",
    title: "浏览器原理",
    difficulty: 4,
    prerequisites: ["fe-js-core"],
    frequency: "高",
    summary: "渲染流程（DOM/CSSOM/Render Tree/Layout/Paint）、HTTP 缓存、垃圾回收（V8）、安全（XSS/CSRF）。",
    mastery: 0,
  },
  {
    id: "fe-engineering",
    title: "工程化",
    difficulty: 3,
    prerequisites: ["fe-build-tools"],
    frequency: "中",
    summary: "ESLint/Prettier 统一规范、Husky + lint-staged 提交校验、CI/CD（GitHub Actions）、Monorepo。",
    mastery: 0,
  },
  {
    id: "fe-mobile",
    title: "移动端",
    difficulty: 3,
    prerequisites: ["fe-react-basic"],
    frequency: "中",
    summary: "rem/vw 适配、PWA（Service Worker/Manifest）、Hybrid（JSBridge）、React Native 跨端。",
    mastery: 0,
  },
];

const FRONTEND_QUESTIONS: Question[] = [
  // ===== HTML/CSS 基础 =====
  {
    id: "fe-1",
    nodeId: "fe-html-css",
    question: "请说明 CSS 盒模型，content-box 和 border-box 有什么区别？",
    answer: `盒模型由 content + padding + border + margin 组成。

- content-box（默认）：width = content 宽度，设置 padding/border 会撑大元素总尺寸。
- border-box：width = content + padding + border，更符合直觉，便于布局计算。

\`\`\`css
/* 全局推荐 */
* { box-sizing: border-box; }
\`\`\`

关键：border-box 下元素总宽 = width，不会因 padding/border 溢出。`,
    keyPoints: ["box-sizing 切换两种模型", "border-box 利于固定宽布局", "margin 不计入 width 但影响外部占位"],
    followUps: ["margin 重叠（折叠）发生在什么场景？如何避免？", "如何实现元素垂直居中（至少 3 种）？"],
    favorited: false,
  },
  {
    id: "fe-2",
    nodeId: "fe-html-css",
    question: "Flex 布局中主轴/交叉轴如何确定？justify-content 和 align-items 分别作用于哪个轴？",
    answer: `flex-direction 决定主轴方向（默认 row 水平），与之垂直的是交叉轴。

- justify-content：沿主轴分布（flex-start/center/space-between/space-around/space-evenly）。
- align-items：沿交叉轴对齐（stretch/center/flex-start/flex-end/baseline）。
- align-content：多行时控制行间距（需 flex-wrap: wrap）。

\`\`\`css
.container {
  display: flex;
  justify-content: center;  /* 主轴居中 */
  align-items: center;      /* 交叉轴居中 */
}
\`\`\``,
    keyPoints: ["flex-direction 定主轴", "justify-content 主轴 / align-items 交叉轴", "flex: 1 等价 flex: 1 1 0%"],
    followUps: ["flex: 1 的三个值分别代表什么？", "Grid 相比 Flex 适合什么场景？"],
    favorited: false,
  },
  {
    id: "fe-3",
    nodeId: "fe-html-css",
    question: "如何实现响应式布局？rem/em/vw/vh 有何区别？",
    answer: `响应式核心：媒体查询 + 弹性单位 + 流式布局。

单位区别：
- px：绝对像素。
- em：相对父元素 font-size（嵌套会累积）。
- rem：相对根元素 html font-size（推荐，配合根字号缩放）。
- vw/vh：视口宽/高的 1%（适合全屏布局）。

\`\`\`css
html { font-size: 16px; }
@media (max-width: 768px) { html { font-size: 14px; } }
.title { font-size: 1.25rem; } /* 跟随根字号缩放 */
\`\`\`

移动端常用：动态设置 html font-size = clientWidth / 设计稿宽 × 100，再用 rem 布局。`,
    keyPoints: ["rem 相对根字号，em 相对父级", "vw/vh 相对视口", "postcss-pxtorem 自动换算"],
    followUps: ["postcss-px-to-viewport 的原理？", "1px 边框在高清屏变粗怎么解决？"],
    favorited: false,
  },
  // ===== JavaScript 核心 =====
  {
    id: "fe-4",
    nodeId: "fe-js-core",
    question: "什么是闭包？闭包的常见应用场景和内存泄漏风险？",
    answer: `闭包 = 函数 + 其词法作用域的引用。内层函数引用了外层变量，使外层变量在函数执行完后仍不被回收。

应用：
1. 数据私有化（模块模式）
2. 函数柯里化 / 偏函数
3. 缓存（memoize）
4. 回调中保存状态

\`\`\`js
// 数据私有化
function createCounter() {
  let count = 0; // 外部无法直接访问
  return {
    inc: () => ++count,
    get: () => count,
  };
}
\`\`\`

内存泄漏风险：闭包长期持有大对象引用（如 DOM、定时器），若未及时释放会导致内存不回收。
解决：用完后置 null、及时 clearInterval、移除事件监听。`,
    keyPoints: ["闭包 = 函数 + 词法作用域引用", "实现私有变量/缓存/柯里化", "长生命周期闭包要主动释放引用"],
    followUps: ["闭包变量存在堆还是栈？为什么？", "IIFE（立即执行函数）与闭包的关系？"],
    favorited: false,
  },
  {
    id: "fe-5",
    nodeId: "fe-js-core",
    question: "简述 JS 原型链，instanceof 的判断原理？如何实现一个 instanceof？",
    answer: `每个对象有 __proto__ 指向其构造函数的 prototype。访问属性时沿 __proto__ 链向上查找，直到 Object.prototype 或 null。

instanceof 原理：沿着左侧对象的原型链查找，看是否有右侧函数的 prototype。

\`\`\`js
function myInstanceof(obj, Fn) {
  let proto = Object.getPrototypeOf(obj);
  while (proto !== null) {
    if (proto === Fn.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}
\`\`\`

关键：instanceof 只看原型链，不关心类型声明；原始值（如 5） instanceof Number 为 false。`,
    keyPoints: ["__proto__ 链查找", "instanceof 比对 Fn.prototype", "Object.create(null) 无原型链"],
    followUps: ["new 操作符做了什么？手写 new。", "Object.create 和 new 的区别？"],
    favorited: false,
  },
  {
    id: "fe-6",
    nodeId: "fe-js-core",
    question: "事件循环（Event Loop）中宏任务和微任务的执行顺序？",
    answer: `执行顺序：同步代码 → 清空微任务队列 → 执行一个宏任务 → 再清空微任务 → 循环。

- 宏任务：setTimeout、setInterval、I/O、UI 渲染、postMessage、setImmediate(Node)。
- 微任务：Promise.then/catch/finally、queueMicrotask、MutationObserver、process.nextTick(Node, 最高优先级)。

\`\`\`js
console.log(1);
setTimeout(() => console.log(2));          // 宏
Promise.resolve().then(() => console.log(3)); // 微
console.log(4);
// 输出：1 4 3 2
\`\`\`

关键：每轮宏任务执行完都会清空所有微任务；微任务中产生的新微任务也会在当轮清空。`,
    keyPoints: ["同步 → 微任务 → 宏任务", "每轮宏任务后清空全部微任务", "await 后续代码相当于 .then 微任务"],
    followUps: ["async/await 中 await 后的代码属于宏任务还是微任务？", "requestAnimationFrame 在哪一阶段？"],
    favorited: false,
  },
  // ===== ES6+ =====
  {
    id: "fe-7",
    nodeId: "fe-es6",
    question: "Promise 的状态流转规则？如何串行执行多个异步任务并收集结果？",
    answer: `Promise 三态：pending → fulfilled（resolve）或 pending → rejected（reject），状态一经改变不可逆。

串行执行（按顺序，前一个完成才执行下一个）：

\`\`\`js
async function runSerial(tasks) {
  const results = [];
  for (const task of tasks) {
    results.push(await task()); // 逐个等待
  }
  return results;
}

// 或者 reduce
tasks.reduce((p, task) => p.then(res => task().then(r => [...res, r])), Promise.resolve([]));
\`\`\`

对比：Promise.all 是并行（全部完成），Promise.allSettled 容错（不因一个失败而中断），
Promise.race 取最快，Promise.any 取最先成功。`,
    keyPoints: ["状态不可逆", "串行用 for-await 或 reduce", "all/allSettled/race/any 区别"],
    followUps: ["Promise.all 中一个 reject，其他请求还会继续吗？结果如何？", "如何取消一个 Promise？"],
    favorited: false,
  },
  {
    id: "fe-8",
    nodeId: "fe-es6",
    question: "ESM（import/export）和 CommonJS（require）的区别？",
    answer: `1. 加载时机：ESM 是编译时静态确定依赖（可 tree-shaking）；CommonJS 是运行时加载。
2. 引用方式：ESM 导出的是引用（绑定），原值变化可见；CommonJS 导出的是值拷贝。
3. 顶层 this：ESM 为 undefined，CommonJS 为 module.exports。
4. 异步：ESM 顶层 await；CommonJS 不支持。
5. 浏览器原生支持 ESM（<script type="module">）。

\`\`\`js
// ESM - 引用绑定
// lib.mjs
export let count = 0;
export function inc() { count++; }
// main.mjs
import { count, inc } from './lib.mjs';
inc(); console.log(count); // 1，引用可见
\`\`\`

关键：tree-shaking 依赖 ESM 的静态分析；CommonJS 动态 require 无法静态优化。`,
    keyPoints: ["ESM 静态加载可 tree-shake", "ESM 引用绑定 vs CJS 值拷贝", "Vite/Webpack 优先 ESM"],
    followUps: ["动态 import() 是 ESM 还是 CommonJS？", "package.json 的 exports 字段作用？"],
    favorited: false,
  },
  // ===== TypeScript =====
  {
    id: "fe-9",
    nodeId: "fe-ts",
    question: "TypeScript 中 type 和 interface 的区别？如何选择？",
    answer: `相同点：都能描述对象形状、支持扩展（interface extends / type &）。

区别：
- interface：可声明合并（同名自动合并），只能描述对象/函数类型。
- type：可表示联合、交叉、元组、条件类型、映射类型等，更灵活，但不能声明合并。

选择建议：定义对象/类的公共 API 用 interface（可扩展合并）；需要联合、工具类型用 type。

\`\`\`ts
interface User { name: string; }
interface User { age: number; } // 声明合并 -> { name; age }

type Status = "ok" | "error"; // type 才能做联合
type Pair<T> = [T, T];         // type 才能做元组
\`\`\``,
    keyPoints: ["interface 可声明合并", "type 支持联合/元组/条件类型", "对外 API 用 interface，复杂类型用 type"],
    followUps: ["什么是索引签名？Record<K,V> 相比有什么优势？", "如何让两个 interface 互斥（不能同时存在某属性）？"],
    favorited: false,
  },
  {
    id: "fe-10",
    nodeId: "fe-ts",
    question: "简述 TypeScript 工具类型 Partial / Required / Pick / Omit / Record 的作用，并实现一个 Partial。",
    answer: `- Partial<T>：所有属性变可选。
- Required<T>：所有属性变必填。
- Pick<T,K>：从 T 中挑选键 K。
- Omit<T,K>：从 T 中排除键 K。
- Record<K,V>：构造键为 K、值为 V 的对象类型。

\`\`\`ts
// 手写 Partial
type MyPartial<T> = {
  [K in keyof T]?: T[K];
};

// 手写 Omit = Pick + Exclude
type MyOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
\`\`\`

关键：映射类型 [K in keyof T] 遍历键；? 修饰符控制可选；-? 移除可选（实现 Required）。`,
    keyPoints: ["映射类型 [K in keyof T]", "? 加可选 / -? 移除可选", "Exclude 基于 extends 条件类型"],
    followUps: ["如何实现 DeepPartial（深层可选）？", "ReturnType 是如何实现的？"],
    favorited: false,
  },
  // ===== React 基础 =====
  {
    id: "fe-11",
    nodeId: "fe-react-basic",
    question: "React 中受控组件和非受控组件的区别？何时使用？",
    answer: `- 受控组件：表单值由 state 控制，onChange 同步更新。数据是"单一数据源"。
- 非受控组件：值由 DOM 自身管理，通过 ref 读取。类似传统 HTML。

\`\`\`jsx
// 受控
function Controlled() {
  const [val, setVal] = useState("");
  return <input value={val} onChange={e => setVal(e.target.value)} />;
}

// 非受控
function Uncontrolled() {
  const ref = useRef(null);
  return <input ref={ref} defaultValue="" />;
}
\`\`\`

选择：需要实时校验/格式化/联动用受控；一次性提交、性能敏感的大表单用非受控（如 react-hook-form）。`,
    keyPoints: ["受控 = value 受 state 控制", "非受控 = ref 读取 DOM", "大表单用非受控减少 re-render"],
    followUps: ["受控组件频繁输入导致卡顿怎么优化？", "react-hook-form 为什么性能更好？"],
    favorited: false,
  },
  {
    id: "fe-12",
    nodeId: "fe-react-basic",
    question: "React 类组件生命周期及对应 Hooks 写法？",
    answer: `挂载：constructor → getDerivedStateFromProps → render → componentDidMount
更新：getDerivedStateFromProps → shouldComponentUpdate → render → getSnapshotBeforeUpdate → componentDidUpdate
卸载：componentWillUnmount

对应 Hooks：
- componentDidMount → useEffect(fn, [])
- componentDidUpdate → useEffect(fn, [deps])
- componentWillUnmount → useEffect return cleanup
- shouldComponentUpdate → React.memo / useMemo / useCallback

\`\`\`jsx
// 挂载 + 卸载
useEffect(() => {
  const id = setInterval(tick, 1000);
  return () => clearInterval(id); // 对应 componentWillUnmount
}, []);
\`\`\`

关键：Hooks 不再按生命周期阶段组织，而是按"副作用 + 依赖"组织，更聚焦数据流。`,
    keyPoints: ["useEffect 第二参数控制执行时机", "cleanup 函数对应卸载", "Hooks 按副作用而非阶段组织"],
    followUps: ["useEffect 和 useLayoutEffect 的区别？", "getSnapshotBeforeUpdate 用途是什么？"],
    favorited: false,
  },
  {
    id: "fe-13",
    nodeId: "fe-react-basic",
    question: "React 中 key 的作用？用 index 作 key 有什么问题？",
    answer: `key 是 diff 时识别列表元素的身份标识。React 用 key 判断哪些元素"可复用"。

用 index 作 key 的问题：
1. 列表顺序变化（插入/删除/排序）时，React 会错位复用，导致状态错乱（如输入框内容串位）。
2. 性能下降：本应销毁重建的节点被错误复用，触发额外更新。

正确做法：用稳定且唯一的业务 id 作 key。

\`\`\`jsx
// 错误：用 index
{items.map((item, i) => <Item key={i} data={item} />)}
// 正确：用稳定 id
{items.map(item => <Item key={item.id} data={item} />)}
\`\`\`

关键：key 在兄弟节点间唯一即可，无需全局唯一；key 应稳定，避免每次渲染变化。`,
    keyPoints: ["key 用于 diff 复用判断", "index 作 key 导致状态错位", "用稳定业务 id"],
    followUps: ["key 必须全局唯一吗？", "为什么说 key 是性能优化的关键？"],
    favorited: false,
  },
  // ===== React Hooks =====
  {
    id: "fe-14",
    nodeId: "fe-react-hooks",
    question: "useEffect 的依赖数组为空、有依赖、无依赖分别什么效果？常见陷阱？",
    answer: `- 无第二参数：每次渲染后都执行。
- []：仅在挂载后执行一次（常用于订阅/定时器）。
- [deps]：deps 任一变化才执行。

陷阱：
1. 依赖遗漏：使用了外部变量但未列入 deps → 闭包捕获旧值（stale closure）。
2. 依赖过多：把对象/函数作为依赖 → 每次引用变化都触发 → 用 useMemo/useCallback 稳定引用。
3. 副作用中 setState 未清理 → 异步回调在卸载后更新已卸载组件。

\`\`\`jsx
useEffect(() => {
  const ctrl = new AbortController();
  fetch(url, { signal: ctrl.signal }).then(setData);
  return () => ctrl.abort(); // 清理，避免卸载后更新
}, [url]); // url 变化才重新请求
\`\`\``,
    keyPoints: ["[] 只执行一次", "依赖遗漏导致 stale closure", "对象/函数依赖需 useMemo/useCallback 稳定"],
    followUps: ["eslint exhaustive-deps 规则为什么重要？", "如何避免 effect 内的无限循环 setState？"],
    favorited: false,
  },
  {
    id: "fe-15",
    nodeId: "fe-react-hooks",
    question: "useMemo 和 useCallback 的区别和使用场景？过度使用有什么问题？",
    answer: `- useMemo(() => fn, deps)：缓存计算结果（值）。
- useCallback(fn, deps)：缓存函数引用（等价 useMemo(() => fn, deps)）。

场景：
1. 该值/函数作为子组件 props，且子组件用 React.memo 优化 → 稳定引用避免子组件无效重渲染。
2. 该值作为其他 useEffect/useMemo 的依赖 → 稳定引用避免 effect 反复触发。
3. 计算开销大的派生数据 → useMemo 缓存。

过度使用问题：
- 每次缓存本身有比较 deps 的开销，简单场景反而更慢。
- 增加心智负担和代码复杂度。

\`\`\`jsx
const sorted = useMemo(() => heavySort(list), [list]);
const handleClick = useCallback(() => doSomething(id), [id]);
\`\`\`

原则：先测后优化，只对昂贵计算和 props 传递的引用做缓存。`,
    keyPoints: ["useMemo 缓存值 / useCallback 缓存函数", "配合 React.memo 优化子组件", "简单场景不必用，避免反向优化"],
    followUps: ["React.memo 默认浅比较，如何自定义比较？", "为什么不能用 if 包裹 Hook？"],
    favorited: false,
  },
  {
    id: "fe-16",
    nodeId: "fe-react-hooks",
    question: "如何自定义一个 useDebounce Hook？",
    answer: `防抖：多次触发只执行最后一次，延迟时间内再触发则重新计时。

\`\`\`jsx
function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id); // 每次 value 变化清除旧定时器
  }, [value, delay]);
  return debounced;
}

// 使用：搜索框
const [kw, setKw] = useState("");
const debouncedKw = useDebounce(kw, 500);
useEffect(() => { if (debouncedKw) search(debouncedKw); }, [debouncedKw]);
\`\`\`

关键：useEffect 的 cleanup 负责清除上一次定时器，实现"重新计时"。`,
    keyPoints: ["useEffect + setTimeout + cleanup", "cleanup 实现重新计时", "返回防抖后的值供其他 effect 依赖"],
    followUps: ["如何实现 useThrottle（节流）？", "useDebounce 和 debounce 函数的区别？"],
    favorited: false,
  },
  // ===== React 进阶 =====
  {
    id: "fe-17",
    nodeId: "fe-react-advanced",
    question: "useReducer 和 useState 的区别？何时该用 useReducer？",
    answer: `useState：单一状态，setter 直接赋值，适合简单独立状态。
useReducer：状态 + action → reducer 纯函数返回新状态，适合：
1. 状态逻辑复杂、相互依赖（如表单多字段联动）。
2. 下一个状态依赖前一个。
3. 多个子组件共享同一状态逻辑（通过 dispatch 传递，避免 prop drilling）。

\`\`\`jsx
function reducer(state, action) {
  switch (action.type) {
    case "inc": return { count: state.count + 1 };
    case "set": return { count: action.payload };
    default: return state;
  }
}
const [state, dispatch] = useReducer(reducer, { count: 0 });
\`\`\`

关键：reducer 是纯函数，便于测试；dispatch 引用稳定，适合传给深层子组件。`,
    keyPoints: ["reducer 纯函数集中管理逻辑", "dispatch 引用稳定", "复杂/联动状态用 useReducer"],
    followUps: ["useReducer 能替代 Redux 吗？", "如何结合 Context 共享 dispatch？"],
    favorited: false,
  },
  {
    id: "fe-18",
    nodeId: "fe-react-advanced",
    question: "React Fiber 是什么？时间切片（Time Slicing）如何提升体验？",
    answer: `Fiber 是 React 16 重写的虚拟 DOM 节点结构，支持可中断/可恢复的渲染。

核心：
1. 链表化：每个 Fiber 节点记录 child/sibling/return，渲染可暂停并从任意节点恢复。
2. 时间切片：将大任务拆成小片（约 5ms），每片后让出主线程处理输入/动画，避免长任务卡顿。
3. 双缓冲：current 树与 workInProgress 树，提交时替换，保证 UI 一致。
4. 优先级：lane 模型区分任务优先级（用户输入 > 数据更新）。

Concurrent 模式（React 18 默认开启）基于 Fiber 实现：useTransition（标记非紧急更新）、Suspense（等待异步数据/组件）。

关键：Fiber 让 React 能中断渲染、按优先级调度，是并发特性的基础。`,
    keyPoints: ["Fiber 链表结构可中断/恢复", "时间切片避免长任务卡帧", "lane 优先级调度"],
    followUps: ["useTransition 解决什么问题？", "Suspense 如何配合懒加载？"],
    favorited: false,
  },
  // ===== Vue 基础 =====
  {
    id: "fe-19",
    nodeId: "fe-vue-basic",
    question: "Vue 3 的响应式原理（Proxy）相比 Vue 2（defineProperty）有什么优势？",
    answer: `Vue 2：Object.defineProperty 劫持已有属性 getter/setter。
- 无法监听新增/删除属性（需 Vue.set / this.$set）。
- 无法监听数组索引和 length 变化（需重写数组方法）。
- 需深层递归遍历，初始化开销大。

Vue 3：Proxy 代理整个对象。
- 自动监听新增/删除属性。
- 直接监听数组。
- 惰性响应式：访问时才递归代理（reactive），性能更好。
- 支持 Map/Set/WeakMap。

\`\`\`js
// Vue 3 简化原理
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key, receiver) {
      track(target, key); // 收集依赖
      return Reflect.get(target, key, receiver);
    },
    set(target, key, val, receiver) {
      const res = Reflect.set(target, key, val, receiver);
      trigger(target, key); // 触发更新
      return res;
    },
  });
}
\`\`\``,
    keyPoints: ["Proxy 代理整对象，defineProperty 劫持单属性", "Proxy 支持新增/删除/数组", "Vue 3 惰性递归性能更好"],
    followUps: ["ref 和 reactive 的区别？", "为什么 reactive 要用 Proxy 而非 Reflect 即可？"],
    favorited: false,
  },
  {
    id: "fe-20",
    nodeId: "fe-vue-basic",
    question: "Vue 组件间通信有哪些方式？",
    answer: `1. 父→子：props
2. 子→父：emit 触发自定义事件
3. 父→后代：provide / inject（跨层级传值）
4. 任意组件：事件总线（mitt，Vue 3 移除 $on/$emit）或状态管理（Pinia）
5. 父直接访问子：ref 拿到子组件实例（defineExpose 暴露方法）
6. v-model：双向绑定（props + emit 的语法糖）

\`\`\`vue
<!-- 子组件 -->
<script setup>
const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue"]);
</script>

<!-- 父组件 -->
<Child v-model="msg" />
\`\`\`

关键：大型项目优先用 Pinia；provide/inject 适合组件库主题注入；v-model 是 props+emit 封装。`,
    keyPoints: ["props / emit 单向流", "provide/inject 跨层", "Pinia 全局状态"],
    followUps: ["v-model 在 Vue 3 如何绑定多个值？", "provide/inject 如何保持响应式？"],
    favorited: false,
  },
  // ===== Vue 进阶 =====
  {
    id: "fe-21",
    nodeId: "fe-vue-advanced",
    question: "Composition API 相比 Options API 的优势？setup 语法糖做了什么？",
    answer: `Composition API 优势：
1. 逻辑聚合：同一功能的响应式数据/方法/生命周期集中在一处，而非分散在 data/methods/computed。
2. 逻辑复用：抽取为 composable 函数（useXxx），比 mixin 更清晰（无命名冲突、来源明确）。
3. 更好的 TS 类型推导。

setup 语法糖（<script setup>）：
- 编译时自动将顶层变量暴露给模板，无需 return。
- 自动声明 props/emits（defineProps/defineEmits 编译期宏，无需 import）。
- 性能更好（编译优化）。

\`\`\`vue
<script setup>
import { ref, onMounted } from "vue";
const count = ref(0);
const inc = () => count.value++;
onMounted(() => console.log("mounted"));
</script>
<template><button @click="inc">{{ count }}</button></template>
\`\`\``,
    keyPoints: ["逻辑聚合与复用（composable）", "script setup 自动暴露变量", "TS 友好"],
    followUps: ["如何抽取一个 useMouse composable？", "defineExpose 的作用？"],
    favorited: false,
  },
  {
    id: "fe-22",
    nodeId: "fe-vue-advanced",
    question: "Pinia 相比 Vuex 有哪些改进？",
    answer: `1. 更简单：无 mutations，直接在 action 里修改 state（Vue 3 的 Proxy 让 mutation 步骤多余）。
2. 模块化：每个 store 独立文件，无需 modules 注册，TS 类型自动推导。
3. 更轻量：体积更小，API 更少。
4. 支持 Composition API：可用 setup 函数式定义 store。
5. 支持 SSR 与更好的 DevTools。

\`\`\`js
// 定义 store
export const useCounter = defineStore("counter", () => {
  const count = ref(0);
  const double = computed(() => count.value * 2);
  function inc() { count.value++; }
  return { count, double, inc };
});

// 使用
const counter = useCounter();
counter.inc();
\`\`\`

关键：Pinia 是 Vue 官方推荐的新一代状态管理，Vuex 进入维护模式。`,
    keyPoints: ["无 mutations", "store 独立无需 modules", "Composition 风格 + TS 友好"],
    followUps: ["Pinia 如何做持久化（pinia-plugin-persistedstate）？", "Pinia 跨 store 互相调用？"],
    favorited: false,
  },
  // ===== 状态管理 =====
  {
    id: "fe-23",
    nodeId: "fe-state-mgmt",
    question: "Redux 的三大原则和数据流？中间件的作用？",
    answer: `三大原则：
1. 单一数据源：整个应用 state 存于一棵 store 树。
2. state 只读：唯一改变方式是 dispatch action。
3. 纯函数修改：reducer 是 (state, action) => newState 的纯函数。

单向数据流：UI dispatch(action) → reducer 计算 → 新 state → UI 更新。

中间件（如 redux-thunk / redux-saga）拦截 dispatch，处理异步副作用：
- thunk：action 可以是函数，接收 dispatch/getState，适合简单异步。
- saga：基于 generator，用 takeEvery/put 描述副作用，适合复杂流程（并发、取消、轮询）。

\`\`\`js
// reducer
function counter(state = 0, action) {
  switch (action.type) {
    case "INC": return state + 1;
    default: return state;
  }
}
const store = createStore(counter, applyMiddleware(thunk));
\`\`\`

关键：Redux 适合大型应用的状态可预测管理，但模板代码多；现代多用 Redux Toolkit 简化。`,
    keyPoints: ["单一数据源 + 只读 + 纯函数", "单向数据流", "中间件处理异步副作用"],
    followUps: ["Redux Toolkit 的 createSlice 解决了什么痛点？", "Redux 和 Zustand 在大型项目的选型？"],
    favorited: false,
  },
  {
    id: "fe-24",
    nodeId: "fe-state-mgmt",
    question: "Zustand 和 Recoil 的设计理念差异？",
    answer: `Zustand：极简，基于 hooks 的全局 store。
- 一个 store 用 create 定义，返回 hooks，按需订阅（选择器 selector）。
- 无 provider 包裹，无 action/reducer 样板，直接 set 修改。
- 适合中小型项目快速上手。

\`\`\`js
const useStore = create((set) => ({
  count: 0,
  inc: () => set((s) => ({ count: s.count + 1 })),
}));
const count = useStore((s) => s.count); // 选择器，仅订阅 count
\`\`\`

Recoil：原子化（atom）状态。
- 状态拆成最小粒度 atom，组件订阅 atom，更新原子只重渲染订阅它的组件。
- selector 派生状态，自动缓存。
- 更细粒度的依赖追踪，适合复杂依赖图，但 API 较重，社区活跃度下降。

关键：Zustand 简单实用、生态好；Recoil 理念先进但迁移成本高，目前采用率低。`,
    keyPoints: ["Zustand 极简 hooks store + selector", "Recoil 原子化细粒度订阅", "选型：Zustand 更主流"],
    followUps: ["Zustand 的 selector 如何避免重复渲染？", "Recoil 的 selector 缓存策略？"],
    favorited: false,
  },
  // ===== 构建工具 =====
  {
    id: "fe-25",
    nodeId: "fe-build-tools",
    question: "Vite 为什么开发环境那么快？和生产构建用什么？",
    answer: `开发环境快的原因：
1. 利用浏览器原生 ESM：请求即编译，按需转换，启动无需打包（不像 Webpack 要先构建整个依赖图）。
2. 依赖预构建（esbuild）：node_modules 用 esbuild 打成 ESM 并缓存，esbuild 用 Go 写速度极快。
3. HMR 精准：修改文件只失效该模块，通过 ESM import 链定位更新范围，速度与项目规模无关。

生产构建：用 Rollup（成熟、tree-shaking 好、产物小），可通过插件兼容 Webpack 生态。

\`\`\`js
// vite.config.js
export default {
  build: { rollupOptions: { output: { manualChunks: { vendor: ["react", "react-dom"] } } } },
};
\`\`\`

关键：dev 用原生 ESM + esbuild 预构建；prod 用 Rollup 打包。`,
    keyPoints: ["dev 原生 ESM 按需编译", "esbuild 预构建依赖", "prod 用 Rollup"],
    followUps: ["Vite 的依赖预构建解决了什么问题？", "Vite 和 Webpack 的 HMR 原理差异？"],
    favorited: false,
  },
  {
    id: "fe-26",
    nodeId: "fe-build-tools",
    question: "Webpack 中 Loader 和 Plugin 的区别？tree-shaking 原理？",
    answer: `Loader：文件加载器，把非 JS 资源（css/less/ts/图片）转换成 JS 模块，链式调用（从后往前）。
Plugin：插件，基于事件钩子（compiler/compilation 的 tapable 事件）扩展构建流程（如 HtmlWebpackPlugin 生成 HTML、DefinePlugin 注入变量、MiniCssExtractPlugin 抽离 CSS）。

tree-shaking 原理：
1. 基于 ESM 静态分析，标记模块的导出是否被引用。
2. 压缩阶段（Terser）删除未被引用的导出（side-effect-free）。
3. package.json 的 sideEffects:false 声明模块无副作用，允许更激进删除。

\`\`\`js
module.exports = {
  module: { rules: [{ test: /\.tsx?$/, use: "ts-loader" }] },
  plugins: [new HtmlWebpackPlugin({ template: "./index.html" })],
};
\`\`\`

关键：tree-shaking 必须 ESM + production 模式 + 标注 sideEffects。`,
    keyPoints: ["Loader 转换资源，Plugin 扩展流程", "tree-shaking 依赖 ESM 静态分析", "sideEffects 影响删除力度"],
    followUps: ["如何写一个简易 Loader？", "CommonJS 为什么无法 tree-shake？"],
    favorited: false,
  },
  // ===== 性能优化 =====
  {
    id: "fe-27",
    nodeId: "fe-perf",
    question: "前端首屏性能指标有哪些（Core Web Vitals）？如何优化 LCP？",
    answer: `Core Web Vitals：
- LCP（Largest Contentful Paint）：最大内容绘制，目标 < 2.5s。
- FID/INP（Interaction to Next Paint）：首次输入延迟/交互响应，目标 < 200ms。
- CLS（Cumulative Layout Shift）：累积布局偏移，目标 < 0.1。

优化 LCP：
1. 减少关键资源：内联关键 CSS、defer/async 非 critical JS。
2. 优化图片：WebP/AVIF、lazy-load、响应式 srcset、CDN。
3. 预连接关键源：<link rel="preconnect">、<link rel="preload">。
4. SSR/SSG：服务端渲染首屏，减少客户端 JS 执行。
5. 减少打包体积：code-splitting、tree-shaking。

\`\`\`html
<link rel="preload" as="image" href="hero.webp" />
<img src="hero.webp" loading="eager" fetchpriority="high" />
<img src="other.webp" loading="lazy" />
\`\`\``,
    keyPoints: ["LCP<2.5s / INP<200ms / CLS<0.1", "LCP 优化：关键资源 + 图片 + SSR", "preload 预加载关键资源"],
    followUps: ["如何测量 LCP？", "CLS 产生的原因及预防？"],
    favorited: false,
  },
  {
    id: "fe-28",
    nodeId: "fe-perf",
    question: "长列表如何做虚拟滚动？简述实现思路。",
    answer: `虚拟滚动：只渲染可视区域的少量元素，滚动时动态替换，DOM 数量恒定。

实现思路：
1. 容器固定高度，内层"撑高"元素（总高 = itemHeight × total）产生滚动条。
2. 监听 scrollTop，计算 startIndex = floor(scrollTop / itemHeight)。
3. 渲染 [startIndex, startIndex + visibleCount] 区间，用 transform translateY 偏移到正确位置。
4. 上下各预渲染几条（overscan）避免滚动白屏。

\`\`\`jsx
function VirtualList({ items, itemHeight, visibleCount }) {
  const [scrollTop, setScrollTop] = useState(0);
  const start = Math.floor(scrollTop / itemHeight);
  const end = Math.min(start + visibleCount, items.length);
  return (
    <div style={{ height: visibleCount * itemHeight, overflow: "auto" }}
         onScroll={e => setScrollTop(e.target.scrollTop)}>
      <div style={{ height: items.length * itemHeight, position: "relative" }}>
        {items.slice(start, end).map((it, i) => (
          <div key={start + i} style={{ position: "absolute", top: (start + i) * itemHeight, height: itemHeight }}>
            {it}
          </div>
        ))}
      </div>
    </div>
  );
}
\`\`\`

成熟库：react-window（定高）、react-virtualized（变高）。`,
    keyPoints: ["只渲染可视区 + 撑高容器", "scrollTop 计算起止索引", "transform 偏移 + overscan 预渲染"],
    followUps: ["变高 item 如何实现虚拟滚动？", "react-window 和 react-virtualized 区别？"],
    favorited: false,
  },
  {
    id: "fe-29",
    nodeId: "fe-perf",
    question: "React 中如何避免不必要的重渲染？",
    answer: `1. React.memo：对子组件做浅比较 props，props 不变则跳过渲染。
2. useMemo/useCallback：稳定传给子组件的对象/函数引用，配合 memo 生效。
3. 状态下沉：把频繁变化的 state 放到叶子组件，避免父级大范围重渲染。
4. 拆分组件：把变化部分隔离，缩小重渲染范围。
5. useReducer + dispatch：dispatch 引用稳定，避免传函数 prop。
6. 虚拟列表：长列表只渲染可见项。
7. key 稳定：帮助 diff 复用节点。

\`\`\`jsx
const Child = React.memo(function Child({ onClick }) { /* ... */ });
const Parent = () => {
  const handleClick = useCallback(() => {}, []); // 稳定引用
  return <Child onClick={handleClick} />;
};
\`\`\`

注意：Profiler 测量后再优化，避免过早优化；memo 本身有比较成本。`,
    keyPoints: ["React.memo 浅比较", "useMemo/useCallback 稳定引用", "状态下沉缩小渲染范围"],
    followUps: ["如何用 React DevTools Profiler 定位重渲染？", "为什么 setState 传相同值仍可能渲染？"],
    favorited: false,
  },
  // ===== 浏览器原理 =====
  {
    id: "fe-30",
    nodeId: "fe-browser",
    question: "浏览器从输入 URL 到页面展示经历了哪些过程？",
    answer: `1. URL 解析：判断搜索/地址，补全协议。
2. DNS 解析：域名 → IP（递归查询，浏览器/系统/路由器/ISP 缓存）。
3. TCP 三次握手（HTTPS 还有 TLS 握手）。
4. 发送 HTTP 请求 → 服务器响应（协商缓存 304 / 200）。
5. 浏览器解析响应：
   - 解析 HTML 构建 DOM。
   - 解析 CSS 构建 CSSOM。
   - 合并成 Render Tree（不包含 display:none、head）。
   - Layout（布局/回流）：计算几何位置。
   - Paint（绘制）：填充像素。
   - Composite（合成）：分层合成交给 GPU。
6. 执行 JS（可能阻塞解析，defer/async 优化）。
7. 触发 load 事件。

关键：回流（几何变化）开销 > 重绘（外观变化）> 合成（transform/opacity 走合成层，性能最佳）。`,
    keyPoints: ["DNS→TCP→HTTP→解析→渲染", "回流>重绘>合成", "合成层用 transform/opacity"],
    followUps: ["defer 和 async 的区别？", "为什么操作 DOM 慢？"],
    favorited: false,
  },
  {
    id: "fe-31",
    nodeId: "fe-browser",
    question: "HTTP 缓存策略（强缓存与协商缓存）？",
    answer: `强缓存（不发请求，直接用本地）：
- Cache-Control: max-age=31536000（优先级高于 Expires）。
- 命中返回 200 (from disk/memory cache)。

协商缓存（发请求询问是否变化）：
- Last-Modified / If-Modified-Since：基于修改时间（精度秒）。
- ETag / If-None-Match：基于内容哈希（更精确，优先级高于 Last-Modified）。
- 未变返回 304 Not Modified，变了返回 200 + 新资源。

\`\`\`
# 典型策略
# 入口 HTML：不缓存或短缓存
Cache-Control: no-cache
# 静态资源（带 hash）：长缓存 + 协商
Cache-Control: max-age=31536000, immutable
\`\`\`

关键：带 hash 文件名 + 长强缓存；入口 HTML 用 no-cache 每次协商，保证能拿到新 hash 引用。`,
    keyPoints: ["强缓存 Cache-Control max-age", "协商缓存 ETag 优先 Last-Modified", "hash 文件名 + 长缓存策略"],
    followUps: ["no-cache 和 no-store 区别？", "immutable 的作用？"],
    favorited: false,
  },
  {
    id: "fe-32",
    nodeId: "fe-browser",
    question: "XSS 和 CSRF 攻击原理及防御？",
    answer: `XSS（跨站脚本）：注入恶意脚本到页面执行。
- 存储型：存入 DB 后回显（如评论）。
- 反射型：URL 参数回显。
- DOM 型：前端代码操作不当。
防御：输出转义（HTML/JS/URL 上下文）、CSP（Content-Security-Policy 限制脚本源）、HttpOnly Cookie 防止 JS 读取、框架默认转义（React/Vue 默认 escape）。

CSRF（跨站请求伪造）：利用用户已登录凭证，诱导发起跨站请求。
防御：
1. SameSite Cookie（Lax/Strict 阻止跨站携带）。
2. CSRF Token：服务端下发一次性 token，请求带上校验。
3. 关键操作二次确认（验证码/密码）。
4. 检查 Referer/Origin。

关键：XSS 防注入（转义 + CSP），CSRF 防冒用（SameSite + Token）。`,
    keyPoints: ["XSS 输出转义 + CSP + HttpOnly", "CSRF SameSite + Token", "React/Vue 默认转义防 XSS"],
    followUps: ["CSP 如何配置？", "SameSite=Lax 和 Strict 的区别？"],
    favorited: false,
  },
  // ===== 工程化 =====
  {
    id: "fe-33",
    nodeId: "fe-engineering",
    question: "Husky + lint-staged 的作用和工作流？",
    answer: `Husky：管理 Git hooks（pre-commit / commit-msg 等），让 hook 跟随项目走（旧版 .husky 目录）。

lint-staged：只对 git 暂存区（staged）的文件执行 lint/format/test，避免全量检查，速度快。

工作流：
1. git add 暂存改动。
2. git commit 触发 pre-commit hook。
3. lint-staged 读取配置，对暂存文件跑 ESLint --fix / Prettier --write。
4. 若有错误无法自动修复，提交被中止。
5. commit-msg hook 用 commitlint 校验提交信息规范（Conventional Commits）。

\`\`\`json
// package.json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{css,md}": ["prettier --write"]
  }
}
\`\`\`

关键：保证进入仓库的代码符合规范，CI 前在本地拦截。`,
    keyPoints: ["Husky 管理 git hooks", "lint-staged 只检查暂存文件", "commitlint 校验提交信息"],
    followUps: ["如何跳过 hook 提交（--no-verify）？为什么不推荐？", "pre-commit 和 pre-push 如何选择？"],
    favorited: false,
  },
  {
    id: "fe-34",
    nodeId: "fe-engineering",
    question: "前端 CI/CD 通常包含哪些环节？",
    answer: `CI（持续集成）：
1. install：缓存依赖，pnpm/npm ci 按锁文件安装。
2. lint：ESLint + Prettier + type-check（tsc --noEmit）。
3. test：单测（Vitest/Jest）+ 覆盖率阈值。
4. build：生产构建 + 产物缓存。

CD（持续部署）：
1. 部署预览环境（PR Preview，每条 PR 独立 URL）。
2. 部署 staging → 人工/自动验证。
3. 部署 production（蓝绿/灰度/回滚）。

\`\`\`yaml
# .github/workflows/ci.yml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint && pnpm typecheck
      - run: pnpm test
      - run: pnpm build
\`\`\`

关键：CI 在 PR 时跑全量校验，CD 自动化部署 + 可回滚。`,
    keyPoints: ["CI: install/lint/test/build", "CD: preview→staging→prod", "缓存依赖加速"],
    followUps: ["pnpm 比 npm 快的原因？", "如何做蓝绿部署？"],
    favorited: false,
  },
  // ===== 移动端 =====
  {
    id: "fe-35",
    nodeId: "fe-mobile",
    question: "PWA 的核心技术有哪些？Service Worker 能做什么？",
    answer: `PWA（Progressive Web App）核心技术：
1. Service Worker：离线代理，拦截 fetch 请求，可缓存资源实现离线可用。
2. Web App Manifest：manifest.json 让应用可"安装"到桌面，自定义图标/启动页。
3. Push Notification：推送通知（需用户授权）。
4. HTTPS：Service Worker 必须在 HTTPS（localhost 除外）。

Service Worker 生命周期：install → activate → fetch 事件拦截。
- 可预缓存 App Shell，运行时动态缓存（Cache-First / Network-First 策略）。
- 后台同步（Background Sync）。

\`\`\`js
// sw.js 简化
self.addEventListener("install", e => {
  e.waitUntil(caches.open("v1").then(c => c.addAll(["/", "/app.js"])));
});
self.addEventListener("fetch", e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
\`\`\`

关键：Service Worker 是独立线程，不能操作 DOM，通过 postMessage 通信。`,
    keyPoints: ["Service Worker 离线缓存", "Manifest 可安装", "必须 HTTPS"],
    followUps: ["Service Worker 更新机制？", "Cache-First 和 Network-First 适用场景？"],
    favorited: false,
  },
  {
    id: "fe-36",
    nodeId: "fe-mobile",
    question: "Hybrid App 中 JSBridge 的原理？",
    answer: `JSBridge 是 Native 和 WebView 之间的通信桥梁。

Native → JS：Native 直接执行 WebView 中的 JS 代码（evaluateJavaScript / loadUrl）。

JS → Native（拦截机制）：
1. URL Scheme 拦截：JS 创建 iframe，src 设为自定义 scheme（如 myapp://action?params），Native 拦截 webView shouldStartLoadWithRequest 解析。
2. 注入 API：Native 往 WebView window 注入对象（如 window.webkit.messageHandlers），JS 直接调用，性能更好（现代首选）。

回调机制：JS 调用 Native 时生成唯一 callbackId，Native 处理完通过 evaluateJavaScript 回调 window.bridge._invokeCallback(callbackId, result)。

\`\`\`js
// JS 侧调用
bridge.invoke("scanCode", { type: "qr" }, (res) => console.log(res));
\`\`\`

关键：JSBridge 让 H5 复用 Native 能力（相机/定位/支付），是 Hybrid 混合开发的基础。`,
    keyPoints: ["Native→JS 用 evaluateJavaScript", "JS→Native 用 URL 拦截或注入 API", "callbackId 异步回调"],
    followUps: ["注入 API 方式相比 URL Scheme 的优势？", "如何保证 JSBridge 调用顺序？"],
    favorited: false,
  },
];

// 生成学习计划：按拓扑顺序，每天 1-2 个节点，学习 + 次日复习
function buildSchedule(): ScheduleItem[] {
  // 拓扑顺序：基础 → JS → 框架 → 进阶/优化/工程
  const order = [
    "fe-html-css",
    "fe-js-core",
    "fe-es6",
    "fe-browser",
    "fe-ts",
    "fe-react-basic",
    "fe-vue-basic",
    "fe-build-tools",
    "fe-react-hooks",
    "fe-state-mgmt",
    "fe-mobile",
    "fe-engineering",
    "fe-react-advanced",
    "fe-vue-advanced",
    "fe-perf",
  ] as const;

  const schedule: ScheduleItem[] = [];
  let day = 1;
  order.forEach((nodeId, idx) => {
    // 每天安排 1-2 个 learn，难度高的单独一天
    const dayForLearn = Math.floor(idx / 2) + 1;
    day = dayForLearn;
    schedule.push({
      day,
      nodeId,
      type: "learn",
      estimatedMinutes: 45,
      completed: false,
    });
    // 次日复习
    schedule.push({
      day: day + 1,
      nodeId,
      type: "review",
      estimatedMinutes: 15,
      completed: false,
    });
  });
  return schedule;
}

export const FRONTEND_PRESET = {
  topic: "前端工程师面试全攻略",
  knowledgeTree: FRONTEND_NODES,
  questions: FRONTEND_QUESTIONS,
  schedule: buildSchedule(),
};
