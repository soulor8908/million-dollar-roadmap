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
  // ===== 补充题目：扩充各知识点覆盖度 =====
  // --- fe-html-css 补充 ---
  {
    id: "fe-37",
    nodeId: "fe-html-css",
    question: "什么是 BFC（块级格式化上下文）？如何触发？能解决什么问题？",
    answer: `BFC（Block Formatting Context）是一个独立的渲染区域，内部元素的布局不影响外部，外部也不影响内部。

触发 BFC 的常见条件：
- 根元素 html。
- float 不为 none。
- position 为 absolute / fixed。
- display 为 inline-block / flex / grid / table-cell / flow-root。
- overflow 不为 visible（如 hidden / auto）。

BFC 能解决的问题：
1. 清除浮动：父元素触发 BFC 后会包含浮动的子元素（高度塌陷修复）。
2. 避免 margin 折叠：相邻块级元素的垂直 margin 会折叠，把它们放入不同 BFC 可避免。
3. 阻止文字环绕浮动元素（实现两栏自适应布局）。

\`\`\`css
/* 推荐用 display:flow-root 触发 BFC，无副作用 */
.parent { display: flow-root; }
/* 老方案：overflow:hidden 也能触发，但可能裁剪子元素 */
.clearfix { overflow: hidden; }
\`\`\`

关键：BFC 是一块隔离的渲染区域，flow-root 是现代清除浮动的首选。`,
    keyPoints: ["BFC 内外布局隔离", "flow-root / overflow / float / position 触发", "清除浮动+防 margin 折叠+两栏布局"],
    followUps: ["margin 折叠的具体规则有哪些？", "flex/grid 容器是否也是 BFC？"],
    favorited: false,
  },
  {
    id: "fe-38",
    nodeId: "fe-html-css",
    question: "CSS 选择器优先级如何计算？!important 与内联样式谁更高？",
    answer: `优先级按特异性（specificity）计算，从高到低分四档（a, b, c, d）：
- a：内联样式（style="..."），记 1000。
- b：ID 选择器，每个记 100。
- c：类 / 伪类 / 属性选择器，每个记 10。
- d：元素 / 伪元素选择器，每个记 1。
- 通配符 *、组合符（>+~）不计数。

比较时从左到右逐档比较，高档相等再看低档。

\`\`\`css
#nav .item {}            /* 100 + 10 = 110 */
div.menu .item {}        /* 1 + 10 + 10 = 21 */
.menu .item {}           /* 10 + 10 = 20 */
\`\`\`

!important：打破特异性规则，强制最高；相同 !important 再比特异性。
- 内联 style + !important 仍高于普通 !important。
- 多个 !important 冲突时，按特异性高的胜出；特异性也相同则后者覆盖。

关键：!important 是逃生舱，滥用会破坏可维护性；优先靠特异性控制和 DOM 顺序管理。`,
    keyPoints: ["特异性四档 1000/100/10/1", "!important 高于普通声明", "!important 之间仍按特异性比较"],
    followUps: ["为什么通配符 * 优先级是 0？", "如何覆盖第三方库的 !important 样式？"],
    favorited: false,
  },
  {
    id: "fe-39",
    nodeId: "fe-html-css",
    question: "实现元素水平垂直居中有哪些方式？各自适用场景？",
    answer: `常见方案：

\`\`\`css
/* 1. Flex（最常用，适合已知/未知尺寸） */
.parent { display: flex; justify-content: center; align-items: center; }

/* 2. Grid（更简洁） */
.parent { display: grid; place-items: center; }

/* 3. 绝对定位 + transform（子元素已知/未知都行） */
.parent { position: relative; }
.child  { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); }

/* 4. 绝对定位 + margin:auto（需固定宽高） */
.parent { position: relative; }
.child  { position: absolute; inset: 0; margin: auto; width: 100px; height: 60px; }

/* 5. 行内对齐（行高/vertical-align，适合单行文本/行内块） */
.parent { text-align: center; line-height: 200px; }
\`\`\`

选择：
- 通用首选 Flex / Grid。
- transform 方案适合浮层/弹窗（不影响其他布局）。
- margin:auto 方案适合已知尺寸的居中弹层。

关键：Flex/Grid 是现代主流；transform 方案有兼容性好、不依赖父级的优点。`,
    keyPoints: ["Flex/Grid 是现代首选", "transform 方案适合浮层", "margin:auto 需固定宽高"],
    followUps: ["inset:0 是什么的简写？", "为什么 transform 居中不会触发重排？"],
    favorited: false,
  },
  // --- fe-js-core 补充 ---
  {
    id: "fe-40",
    nodeId: "fe-js-core",
    question: "this 的绑定规则有哪些？箭头函数的 this 与普通函数有何不同？",
    answer: `this 绑定四条规则（优先级从低到高）：
1. 默认绑定：独立函数调用，非严格模式 this=window/global，严格模式 undefined。
2. 隐式绑定：obj.fn() 时 this 指向 obj；引用赋值后会丢失绑定（const f = obj.fn; f()）。
3. 显式绑定：fn.call(obj, a)/fn.apply(obj, [a])/fn.bind(obj) 指定 this。
4. new 绑定：new fn() 时 this 指向新创建的对象。

箭头函数：没有自己的 this，沿词法作用域向上继承最近一层非箭头函数的 this（定义时确定，不可被 call/apply/bind 改变）。

\`\`\`js
const obj = {
  name: "A",
  show: () => console.log(this.name), // 继承外层（此处为 window/global）
  showNormal() { console.log(this.name); }, // 隐式绑定 obj
};
obj.show();       // undefined（继承外层 this）
obj.showNormal(); // "A"

// 经典坑：回调里的 this
class Timer {
  constructor() { this.count = 0; }
  start() {
    setInterval(() => this.count++, 1000); // 箭头继承 this=实例
  }
}
\`\`\`

关键：箭头函数适合回调保留外层 this；不能用箭头函数做对象方法（拿不到 obj）。`,
    keyPoints: ["四规则优先级 new > 显式 > 隐式 > 默认", "箭头函数词法继承 this 不可改", "回调中用箭头保留 this"],
    followUps: ["bind 和 call/apply 的区别？", "new 操作符内部 this 的形成过程？"],
    favorited: false,
  },
  {
    id: "fe-41",
    nodeId: "fe-js-core",
    question: "如何准确判断 JS 数据类型？typeof / instanceof / Object.prototype.toString 各自的局限？",
    answer: `1. typeof：判断原始类型，但 typeof null === "object"（历史 bug），typeof 函数 === "function"，引用类型除函数都返回 "object"。

2. instanceof：沿原型链判断，能区分数组/对象，但跨 iframe 失效；原始值 instanceof 包装类为 false。

3. Object.prototype.toString.call(x)：返回 "[object Type]"，最准确，能区分 Array/Date/RegExp/Error/Map/Set 等。

\`\`\`js
typeof undefined;        // "undefined"
typeof null;             // "object"（bug）
typeof [];               // "object"
typeof function(){};     // "function"

[] instanceof Array;     // true
"abc" instanceof String; // false（原始值）

Object.prototype.toString.call(null);      // "[object Null]"
Object.prototype.toString.call([]);        // "[object Array]"
Object.prototype.toString.call(new Map()); // "[object Map]"

// 推荐：精确类型判断
function typeOf(v) {
  return Object.prototype.toString.call(v).slice(8, -1).toLowerCase();
}
\`\`\`

关键：通用类型判断用 toString；判断数组优先 Array.isArray（跨 iframe 安全）；typeof 用于快速区分原始/引用。`,
    keyPoints: ["typeof null 为 object 是历史 bug", "instanceof 跨 iframe 失效", "toString.call 最准确"],
    followUps: ["Array.isArray 的原理？", "为什么 typeof null 是 object？"],
    favorited: false,
  },
  {
    id: "fe-42",
    nodeId: "fe-js-core",
    question: "实现一个深拷贝，要处理哪些情况？JSON 方案的局限？",
    answer: `JSON 方案：JSON.parse(JSON.stringify(obj))。
局限：
1. 丢失函数、undefined、Symbol。
2. Date 变字符串、RegExp 变空对象、Map/Set 丢失。
3. 循环引用直接报错。
4. NaN/Infinity 变 null。

递归深拷贝要点：
1. 处理原始值直接返回。
2. 处理 Date/RegExp/Map/Set 等特殊对象。
3. 用 WeakMap 记录已拷贝对象，解决循环引用。
4. 数组按数组初始化，对象按对象初始化。

\`\`\`js
function deepClone(obj, hash = new WeakMap()) {
  if (obj === null || typeof obj !== "object") return obj; // 原始值/函数
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  if (hash.has(obj)) return hash.get(obj); // 已拷贝过，解决循环引用

  const clone = Array.isArray(obj) ? [] : {};
  hash.set(obj, clone);
  // 只拷贝自身可枚举属性（含 Symbol）
  Reflect.ownKeys(obj).forEach(key => {
    clone[key] = deepClone(obj[key], hash);
  });
  return clone;
}

const a = { n: 1, arr: [2, 3], d: new Date(), s: Symbol("x") };
a.self = a; // 循环引用
deepClone(a); // 安全
\`\`\`

关键：循环引用用 WeakMap 缓存；结构化克隆 structuredClone(obj) 是浏览器原生 API，支持循环引用和大部分内置类型（但不支持函数）。`,
    keyPoints: ["JSON 方案丢失函数/Date/Map/Set 且不支持循环引用", "WeakMap 解决循环引用", "structuredClone 原生深拷贝"],
    followUps: ["structuredClone 有哪些不支持？", "如何高性能深拷贝大对象？"],
    favorited: false,
  },
  // --- fe-es6 补充 ---
  {
    id: "fe-43",
    nodeId: "fe-es6",
    question: "async/await 的原理？相比 Promise.then 有什么优势？错误如何处理？",
    answer: `async/await 是 Generator + 自动执行器的语法糖，让异步代码看起来像同步。
- async 函数总是返回 Promise（return 值会被 Promise.resolve 包装，throw 被 reject）。
- await 会暂停函数执行直到 Promise 完成，但不会阻塞主线程（交出执行权给事件循环）。

优势：
1. 代码线性可读，避免 .then 链嵌套。
2. try/catch 可捕获 await 抛出的错误，比 .catch 更自然。
3. 调试断点更友好（栈帧清晰）。

\`\`\`js
async function loadUser(id) {
  try {
    const user = await fetch(\`/api/user/\${id}\`).then(r => {
      if (!r.ok) throw new Error("网络错误");
      return r.json();
    });
    return user;
  } catch (err) {
    console.error("加载失败", err);
    return null; // 降级
  }
}

// 并发优化：用 Promise.all 而非逐个 await
const [a, b] = await Promise.all([fetchA(), fetchB()]);
\`\`\`

陷阱：
1. 串行 await 浪费时间，无关请求应 Promise.all 并发。
2. forEach 中的 await 不会等待（forEach 不返回 Promise），应改 for...of 或 Promise.all(arr.map(...))。

关键：await 不阻塞主线程只暂停当前 async 函数；forEach 不等 await，用 for...of。`,
    keyPoints: ["async 函数返回 Promise", "await 暂停函数不阻塞主线程", "forEach 不等 await，用 for...of/Promise.all"],
    followUps: ["如何在循环中控制并发数（p-limit 思路）？", "top-level await 的使用场景？"],
    favorited: false,
  },
  {
    id: "fe-44",
    nodeId: "fe-es6",
    question: "var / let / const 的区别？什么是暂时性死区（TDZ）？",
    answer: `三者区别：

| 特性 | var | let | const |
|---|---|---|---|
| 作用域 | 函数作用域 | 块级作用域 | 块级作用域 |
| 变量提升 | 是（初始化 undefined） | 有提升但 TDZ | 有提升但 TDZ |
| 重复声明 | 允许 | 禁止 | 禁止 |
| 重新赋值 | 允许 | 允许 | 禁止（但对象属性可改） |

暂时性死区（TDZ）：从作用域开始到 let/const 声明语句执行之间，访问变量抛 ReferenceError。

\`\`\`js
console.log(a); // undefined（var 提升）
var a = 1;

console.log(b); // ReferenceError（TDZ）
let b = 2;

const obj = { x: 1 };
obj.x = 2;       // OK，const 限制重新赋值不限制属性
obj = {};        // TypeError（不能重新赋值）

// 经典坑：for 循环闭包
for (var i = 0; i < 3; i++) setTimeout(() => console.log(i), 0); // 3 3 3
for (let j = 0; j < 3; j++) setTimeout(() => console.log(j), 0); // 0 1 2
\`\`\`

关键：let/const 块级作用域 + 每轮迭代新绑定解决 for 闭包问题；默认用 const，需变值用 let，避免 var。`,
    keyPoints: ["var 函数作用域，let/const 块级", "TDZ 访问抛 ReferenceError", "let 每轮迭代新绑定解决闭包"],
    followUps: ["const 对象属性可改的原因？", "为什么 var 在全局会成为 window 属性而 let 不会？"],
    favorited: false,
  },
  {
    id: "fe-45",
    nodeId: "fe-es6",
    question: "Set / Map / WeakMap / WeakSet 的区别？WeakMap 为什么不会内存泄漏？",
    answer: `Set：值不重复的集合，可遍历，存任意值。
Map：键值对集合，键可以是任意类型（包括对象），保持插入顺序。
WeakMap：键只能是对象（或非注册 symbol），键被回收后对应条目自动消失；不可遍历、无 size。
WeakSet：值只能是对象，弱引用，不可遍历。

WeakMap 不内存泄漏原因：键是弱引用，不阻止垃圾回收。当键对象在外部没有其他引用时，GC 会回收该对象，WeakMap 中对应条目随之消失。

\`\`\`js
// Map 强引用 → DOM 不被回收
const m = new Map();
m.set(domNode, { data: hugeData }); // 即使 domNode 从 DOM 树移除，Map 仍持有

// WeakMap 弱引用 → DOM 可回收
const wm = new WeakMap();
wm.set(domNode, { data: hugeData }); // domNode 移除后条目自动清理

// 典型用法：为对象附加私有数据
const meta = new WeakMap();
class Foo {
  constructor() { meta.set(this, { count: 0 }); }
  inc() { meta.get(this).count++; }
}
\`\`\`

关键：需要"为对象附加数据但不影响其生命周期"用 WeakMap；需要遍历/计数用 Map。`,
    keyPoints: ["WeakMap 键弱引用随对象回收消失", "WeakMap 键只能是对象不可遍历", "适合附加私有数据"],
    followUps: ["WeakRef 和 FinalizationRegistry 的用途？", "Map 和 Object 的性能差异？"],
    favorited: false,
  },
  {
    id: "fe-46",
    nodeId: "fe-es6",
    question: "箭头函数和普通函数有哪些区别？什么时候不能用箭头函数？",
    answer: `区别：
1. this：箭头函数无自己的 this，词法继承外层；普通函数由调用方式决定。
2. arguments：箭头函数无 arguments（可用 ...rest 替代）。
3. new：箭头函数不能 new（无 [[Construct]]，new 会报错）。
4. prototype：箭头函数无 prototype 属性。
5. call/apply/bind：不能改变箭头函数的 this（但仍能传参）。
6. yield：箭头函数不能作 Generator。

不能用箭头函数的场景：
1. 对象方法需要访问 this（指向对象）。
2. 构造函数 / 类构造器。
3. 原型方法。
4. 需要用 arguments 的场景。
5. Vue 的 methods/生命周期（Vue 2 通过 this 访问实例）。

\`\`\`js
const obj = {
  name: "A",
  // 错误：箭头函数 this 不指向 obj
  bad: () => console.log(this.name),
  // 正确：普通函数 this 指向 obj
  good() { console.log(this.name); },
};

// DOM 事件回调也常用箭头函数保留外层 this
button.addEventListener("click", () => this.handleClick());
\`\`\`

关键：箭头函数本质是"词法 this 的简写"，回调场景用箭头函数避免 this 丢失；方法/构造器不能用。`,
    keyPoints: ["箭头函数词法 this 不可改", "无 arguments/prototype 不能 new", "对象方法/构造器不能用"],
    followUps: ["为什么箭头函数不能当 Generator？", "class 中能用箭头函数作方法吗？有什么影响？"],
    favorited: false,
  },
  // --- fe-ts 补充 ---
  {
    id: "fe-47",
    nodeId: "fe-ts",
    question: "TypeScript 泛型的作用？如何对泛型加约束（extends）？",
    answer: `泛型（Generic）是类型的"参数"，让函数/接口/类可复用于多种类型，同时保持类型安全。

\`\`\`ts
// 函数泛型：T 由调用方推断
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}
first([1, 2, 3]);        // T 推断为 number
first(["a", "b"]);       // T 推断为 string

// 泛型约束：extends 限制 T 必须有某些属性
function getLen<T extends { length: number }>(x: T): number {
  return x.length; // 安全访问
}
getLen("abc");   // OK
getLen([1, 2]);  // OK
// getLen(123);  // 报错：number 没有 length

// keyof 约束：键必须是对象的属性
function pick<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
pick({ a: 1, b: "x" }, "a"); // 返回 number

// 默认泛型
function create<T = string>(): T[] { return []; }
\`\`\`

关键：泛型让类型随调用推断；extends 约束保证泛型上有必要属性；keyof T 配合实现类型安全的访问器。`,
    keyPoints: ["泛型是类型参数随调用推断", "extends 约束泛型必须有某属性", "keyof + 泛型实现安全访问"],
    followUps: ["条件类型 T extends U ? X : Y 怎么用？", "infer 关键字的作用？"],
    favorited: false,
  },
  {
    id: "fe-48",
    nodeId: "fe-ts",
    question: "TypeScript 的类型守卫有哪些？typeof / instanceof / in / 自定义类型谓词如何使用？",
    answer: `类型守卫（Type Guard）在条件块内收窄类型，让 TS 推断出更具体的类型。

\`\`\`ts
// 1. typeof：原始类型收窄
function pad(v: string | number) {
  if (typeof v === "string") return v.padStart(2, "0"); // v: string
  return String(v); // v: number
}

// 2. instanceof：类实例收窄
class Cat { meow() {} }
class Dog { bark() {} }
function speak(p: Cat | Dog) {
  if (p instanceof Cat) p.meow();
  else p.bark();
}

// 3. in：判断属性是否存在
type Fish = { swim(): void };
type Bird = { fly(): void };
function move(a: Fish | Bird) {
  if ("swim" in a) a.swim();
  else a.fly();
}

// 4. 自定义类型谓词（is）
function isString(v: unknown): v is string {
  return typeof v === "string";
}
if (isString(x)) x.toUpperCase(); // x: string
\`\`\`

关键：类型守卫让联合类型在分支内收窄；自定义 is 谓词可封装复杂判断，调用处自动收窄。`,
    keyPoints: ["typeof 收窄原始类型", "instanceof/in 收窄对象", "is 谓词自定义守卫"],
    followUps: ["as 断言和类型守卫的区别？", "unknown 和 any 在使用上有什么不同？"],
    favorited: false,
  },
  {
    id: "fe-49",
    nodeId: "fe-ts",
    question: "unknown 和 any 的区别？为什么推荐 unknown 而非 any？",
    answer: `any：放弃类型检查，任意操作都通过（含错误调用），等于关闭 TS。
unknown：类型安全的 any，"必须先收窄才能操作"，强制开发者显式判断。

\`\`\`ts
function run(v: any) {
  v.foo.bar();   // 不报错（运行时可能炸）
  v + 1;         // 不报错
}

function safeRun(v: unknown) {
  // v.foo();    // 报错：unknown 上不能直接操作
  if (typeof v === "string") v.toUpperCase(); // 收窄后 OK
  if (v instanceof Date) v.getTime();
}

// 典型场景：API 响应、JSON.parse 结果
const data: unknown = JSON.parse(text);
// 必须用类型守卫或 zod 校验后再用
\`\`\`

推荐 unknown 的原因：
1. 强制收窄，避免 silent bug。
2. 配合 zod / 类型守卫实现运行时 + 编译时双重校验。
3. 类型系统更安全，重构有保障。

关键：any 是逃生舱（应避免）；unknown 是"安全入口"，配合类型守卫收窄使用。`,
    keyPoints: ["any 关闭检查，unknown 必须收窄", "unknown 配合类型守卫/Schema 校验", "JSON.parse 结果用 unknown"],
    followUps: ["如何用 zod 校验 unknown？", "noImplicitAny 编译选项的作用？"],
    favorited: false,
  },
  {
    id: "fe-50",
    nodeId: "fe-ts",
    question: "tsconfig 中的 strict 模式包含哪些检查？列举几个常用的严格选项。",
    answer: `strict 是聚合开关，等价于同时开启：
- noImplicitAny：禁止隐式 any（参数/变量未标类型且无法推断时报错）。
- strictNullChecks：null/undefined 不再可赋给其他类型，必须显式标注 | null。
- strictFunctionTypes：函数参数双向检查改逆变检查。
- strictBindCallApply：bind/call/apply 参数严格校验。
- strictPropertyInitialization：类属性必须在构造函数中初始化。
- noImplicitThis：禁止 this 为隐式 any。
- alwaysStrict：编译产物加 "use strict"。

其他常用选项：
- noUnusedLocals / noUnusedParameters：未使用的变量/参数报错。
- noImplicitReturns：函数所有路径必须 return。
- noFallthroughCasesInSwitch：switch case 必须有 break/return。
- exactOptionalPropertyTypes：可选属性不能赋 undefined（更严格）。

\`\`\`json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true, // arr[i] 返回 T | undefined
    "noEmit": true
  }
}
\`\`\`

关键：strict 默认应开启；noUncheckedIndexedAccess 让数组下标返回包含 undefined，更安全。`,
    keyPoints: ["strict 聚合多个严格检查", "strictNullChecks 强制处理 null/undefined", "noUncheckedIndexedAccess 下标含 undefined"],
    followUps: ["strictNullChecks 开启后如何处理可能为 null 的值？", "noUncheckedIndexedAccess 有什么好处？"],
    favorited: false,
  },
  // --- fe-react-basic 补充 ---
  {
    id: "fe-51",
    nodeId: "fe-react-basic",
    question: "JSX 的本质是什么？虚拟 DOM 如何工作？",
    answer: `JSX 是 React.createElement 的语法糖，编译后是描述 UI 结构的 JS 对象。

\`\`\`jsx
// JSX
const el = <div className="box" onClick={fn}>Hi</div>;

// 编译后
const el = React.createElement("div", { className: "box", onClick: fn }, "Hi");

// 返回的虚拟 DOM 对象（简化）
{
  type: "div",
  props: { className: "box", onClick: fn, children: "Hi" },
  key: null,
  ref: null,
}
\`\`\`

虚拟 DOM 工作流程：
1. render 阶段：组件树转为虚拟 DOM 树（Fiber 节点）。
2. reconcile：新旧虚拟 DOM 树 diff，找出变更（type/key 比较）。
3. commit：将变更应用到真实 DOM（增删改、生命周期/Hook 副作用）。

优势：
1. 声明式：UI = f(state)，开发者描述状态对应 UI，框架处理 DOM。
2. 跨平台：虚拟 DOM 可渲染到 DOM、Native（React Native）、SSR。
3. 批处理：多次 setState 合并一次更新，减少 DOM 操作。

关键：JSX 是对象描述而非模板；虚拟 DOM 让 React 声明式 + 跨平台 + 批量更新。`,
    keyPoints: ["JSX = createElement 语法糖", "虚拟 DOM 是描述 UI 的 JS 对象", "diff 后批量 commit 到真实 DOM"],
    followUps: ["虚拟 DOM 一定比直接操作 DOM 快吗？", "React 18 的并发渲染如何利用虚拟 DOM？"],
    favorited: false,
  },
  {
    id: "fe-52",
    nodeId: "fe-react-basic",
    question: "React 中 Props 和 State 的区别？为什么 State 更新必须不可变（immutable）？",
    answer: `Props：父组件传入，只读，子组件不能修改；变化由父级驱动。
State：组件内部维护，可变（通过 setState），变化触发重渲染。

不可变更新原因：
1. React 用 Object.is 浅比较新旧 state 判断是否变化，直接 mutate 旧对象引用相同 → 检测不到变化 → 不重渲染。
2. 不可变更易追踪历史（时间旅行调试）、优化 shouldComponentUpdate / React.memo。
3. 并发模式下 mutate 可能导致不一致（中断恢复依赖快照）。

\`\`\`jsx
// 错误：直接 mutate
const [list, setList] = useState([1, 2]);
list.push(3); setList(list); // 引用未变，不重渲染

// 正确：返回新数组/对象
setList(prev => [...prev, 3]);
setUser(prev => ({ ...prev, name: "B" }));

// 嵌套更新：展开多层或用 immer
setForm(prev => ({ ...prev, addr: { ...prev.addr, city: "SH" } }));
\`\`\`

关键：永远返回新的引用而非 mutate；嵌套更新用展开或 immer 的 produce 简化。`,
    keyPoints: ["Props 只读 State 可变", "Object.is 浅比较检测变化", "返回新引用触发渲染"],
    followUps: ["immer 的 produce 如何简化不可变更新？", "useReducer 如何避免不可变更新样板？"],
    favorited: false,
  },
  {
    id: "fe-53",
    nodeId: "fe-react-basic",
    question: "React 中 ref 的作用？forwardRef 和 useImperativeHandle 怎么用？",
    answer: `ref 用于"绕过渲染流"直接访问 DOM 节点或组件实例，适合：聚焦输入、滚动、动画、测量尺寸、集成非 React 库。

\`\`\`jsx
// 1. 访问 DOM
function Input() {
  const ref = useRef(null);
  return <input ref={ref} onFocus={() => ref.current.focus()} />;
}

// 2. forwardRef：把 ref 转发给子组件的 DOM
const FancyInput = React.forwardRef((props, ref) => (
  <input ref={ref} className="fancy" />
));
const parentRef = useRef(null);
<FancyInput ref={parentRef} />; // parentRef 指向内部 input

// 3. useImperativeHandle：自定义暴露给父级的实例方法（而非整个 DOM）
const FancyInput = React.forwardRef((props, ref) => {
  const inputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    clear: () => { if (inputRef.current) inputRef.current.value = ""; },
  }), []);
  return <input ref={inputRef} />;
});
\`\`\`

注意：
- 函数组件默认不能接收 ref（需 forwardRef）；React 19 已重新引入 ref 作为 prop，可省略 forwardRef。
- 不要过度用 ref 操作 DOM，能用 state 控制的优先用 state（声明式）。

关键：ref 用于命令式访问；forwardRef 转发 ref；useImperativeHandle 控制暴露的 API。`,
    keyPoints: ["ref 绕过渲染流访问 DOM/实例", "forwardRef 转发 ref 给子组件", "useImperativeHandle 暴露自定义 API"],
    followUps: ["React 19 中 ref 作为 prop 的变化？", "useRef 和 createRef 的区别？"],
    favorited: false,
  },
  // --- fe-react-hooks 补充 ---
  {
    id: "fe-54",
    nodeId: "fe-react-hooks",
    question: "useRef 除了引用 DOM 还有哪些用途？为什么修改 ref.current 不触发重渲染？",
    answer: `useRef 返回一个 { current: T } 对象，整个组件生命周期保持同一引用。用途：

1. 引用 DOM/组件实例（最常见）。
2. 存储可变值但不触发重渲染（如定时器 id、上次值、计数器）。
3. 保存"最新值"供回调读取（避免 stale closure）。
4. 跨渲染保存闭包外的可变状态。

为什么不触发重渲染：useRef 的 current 是普通可变属性，修改它不调用 React 的状态更新机制（不调度渲染），与 setState 走不同路径。

\`\`\`jsx
function Timer() {
  const [count, setCount] = useState(0);
  const idRef = useRef(null);

  useEffect(() => {
    idRef.current = setInterval(() => setCount(c => c + 1), 1000);
    return () => clearInterval(idRef.current);
  }, []);

  return <button onClick={() => clearInterval(idRef.current)}>stop</button>;
}

// 用 ref 保存最新值（回调读取）
function Latest({ value }) {
  const latest = useRef(value);
  latest.current = value; // 每次渲染更新
  useEffect(() => {
    const id = setInterval(() => console.log(latest.current), 1000); // 永远读到最新
    return () => clearInterval(id);
  }, []);
}
\`\`\`

关键：ref 是"不触发渲染的可变容器"；适合存定时器、保存最新值给回调；不要把应渲染的状态放进 ref。`,
    keyPoints: ["useRef 是不触发渲染的可变容器", "存定时器 id/上次值/最新值", "ref.current 修改不调度渲染"],
    followUps: ["如何用 useRef 实现一个 usePrevious？", "useRef 和 useState 选型标准？"],
    favorited: false,
  },
  {
    id: "fe-55",
    nodeId: "fe-react-hooks",
    question: "useContext 的用法和性能陷阱？如何避免 Context 变化导致全量重渲染？",
    answer: `useContext：组件订阅一个 Context，当 Provider 的 value 变化时，所有消费该 Context 的组件都会重渲染。

\`\`\`jsx
const ThemeCtx = React.createContext("light");
function App() {
  return <ThemeCtx.Provider value="dark"><Page /></ThemeCtx.Provider>;
}
function Page() {
  const theme = useContext(ThemeCtx);
  return <div className={theme}>...</div>;
}
\`\`\`

性能陷阱：
1. value 是新对象/函数时，每次 Provider 重渲染都会触发所有消费者重渲染（即使内容没变）。
2. Context 没有按字段订阅，任何 value 引用变化都全员重渲染。

优化方案：
1. value 用 useMemo/useCallback 稳定引用。
2. 拆分 Context：把频繁变化的和稳定的分到不同 Context。
3. 用状态管理库（Zustand/Redux）的 selector 精确订阅，避免 Context 全员更新。
4. 第三方库：use-context-selector 提供按字段订阅。

\`\`\`jsx
// 稳定 value
const value = useMemo(() => ({ theme, setTheme }), [theme]);
<ThemeCtx.Provider value={value}>...</ThemeCtx.Provider>
\`\`\`

关键：Context 适合低频全局数据（主题/用户/语言）；高频或精细订阅用 Zustand/Redux 更优。`,
    keyPoints: ["Context value 引用变化触发全员重渲染", "useMemo/useCallback 稳定 value", "高频数据用 Zustand/Redux selector"],
    followUps: ["use-context-selector 如何实现按字段订阅？", "Context 和 Zustand 在中大型项目的选型？"],
    favorited: false,
  },
  {
    id: "fe-56",
    nodeId: "fe-react-hooks",
    question: "实现 useThrottle（节流）和 useIntersectionObserver（可见性监听）两个自定义 Hook。",
    answer: `节流（throttle）：单位时间内最多执行一次，适合滚动/resize 高频事件。

\`\`\`jsx
function useThrottle(value, delay = 300) {
  const [throttled, setThrottled] = useState(value);
  const last = useRef(0);
  useEffect(() => {
    const now = Date.now();
    const remain = delay - (now - last.current);
    if (remain <= 0) {
      last.current = now;
      setThrottled(value);
    } else {
      const id = setTimeout(() => {
        last.current = Date.now();
        setThrottled(value);
      }, remain);
      return () => clearTimeout(id);
    }
  }, [value, delay]);
  return throttled;
}

// 可见性监听
function useIntersectionObserver(ref, options = {}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const ob = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting);
    }, { threshold: 0.1, ...options });
    ob.observe(el);
    return () => ob.disconnect();
  }, [ref, options]);
  return visible;
}

// 用法：图片懒加载 / 无限滚动
const imgRef = useRef(null);
const show = useIntersectionObserver(imgRef);
return <img ref={imgRef} src={show ? src : placeholder} />;
\`\`\`

关键：节流用时间戳 + setTimeout 配合；IntersectionObserver 替代 scroll 事件，性能更好。`,
    keyPoints: ["节流=时间戳+setTimeout 补尾", "IntersectionObserver 替代 scroll 事件", "useEffect cleanup 释放 observer"],
    followUps: ["useDebounce 和 useThrottle 的区别？", "IntersectionObserver 的 rootMargin 有什么用？"],
    favorited: false,
  },
  // --- fe-react-advanced 补充 ---
  {
    id: "fe-57",
    nodeId: "fe-react-advanced",
    question: "React.lazy 和 Suspense 如何做组件懒加载？原理是什么？",
    answer: `React.lazy：动态 import() 包装组件，首次渲染时才加载 chunk。
Suspense：声明"等待区"，子组件未就绪时显示 fallback。

\`\`\`jsx
import { lazy, Suspense } from "react";
const Chart = lazy(() => import("./Chart"));

function App() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <Chart data={...} />
    </Suspense>
  );
}

// 路由级懒加载
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
\`\`\`

原理：
1. import() 返回 Promise，webpack/Vite 据此做代码分割（Code Splitting）生成独立 chunk。
2. React.lazy 把 Promise 包装成"挂起"的组件，首次渲染时 throw Promise（React 内部捕获）。
3. Suspense 捕获子树抛出的 Promise，显示 fallback；Promise resolve 后用加载结果重新渲染。

最佳实践：
1. 路由级懒加载（首屏体积小）。
2. 大型组件（图表/编辑器）按需加载。
3. 配合 prefetch（关键路由空闲时预取）。

关键：lazy + Suspense 让首屏只加载必要代码；本质是 throw Promise 让 React 等待异步资源。`,
    keyPoints: ["lazy 包装动态 import()", "Suspense 捕获 throw Promise 显示 fallback", "路由级懒加载减小首屏"],
    followUps: ["React 18 的 Suspense for Data Fetching 有什么不同？", "如何给 lazy 组件做错误边界？"],
    favorited: false,
  },
  {
    id: "fe-58",
    nodeId: "fe-react-advanced",
    question: "useTransition 和 useDeferredValue 解决什么问题？区别是什么？",
    answer: `两者都是 React 18 并发特性，把"低优先级"更新推迟，避免阻塞高优先级（如输入）。

useTransition：把 state 更新标记为低优先级。返回 [isPending, startTransition]。
- 适合：主动控制某次 setState 是非紧急的（如搜索结果列表）。

useDeferredValue：返回一个"延迟"的值副本，在主线程空闲时才追上最新值。
- 适合：只能拿到值、无法控制 setState 的场景（如来自 props）。

\`\`\`jsx
// useTransition：搜索框
function Search() {
  const [q, setQ] = useState("");
  const [list, setList] = useState([]);
  const [isPending, startTransition] = useTransition();

  const onChange = e => {
    setQ(e.target.value); // 高优先级：输入立即响应
    startTransition(() => setList(filter(e.target.value))); // 低优先级
  };
  return <>{isPending && <Spinner />}{list.map(...)}</>;
}

// useDeferredValue：deferred 是 q 的延迟副本
function Heavy({ q }) {
  const deferred = useDeferredValue(q);
  const list = useMemo(() => filter(deferred), [deferred]);
  return <>{list.map(...)}</>;
}
\`\`\`

关键：两者都让重计算不阻塞输入；useTransition 在"set 端"标记，useDeferredValue 在"用端"延迟。`,
    keyPoints: ["并发特性：低优先级更新不阻塞输入", "useTransition 标记 setState 低优先级", "useDeferredValue 延迟值副本"],
    followUps: ["isPending 如何做加载态 UI？", "并发模式下 useEffect 的执行时机有何变化？"],
    favorited: false,
  },
  {
    id: "fe-59",
    nodeId: "fe-react-advanced",
    question: "React 错误边界（Error Boundary）如何实现？能捕获哪些错误？",
    answer: `错误边界：类组件实现 static getDerivedStateFromError 或 componentDidCatch，捕获子树渲染/生命周期/构造函数的错误，显示降级 UI。

\`\`\`jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError(err) {
    return { hasError: true }; // 渲染阶段更新 state
  }
  componentDidCatch(err, info) {
    // 副作用：上报错误
    logError(err, info.componentStack);
  }
  render() {
    if (this.state.hasError) return <Fallback />;
    return this.props.children;
  }
}

// 使用
<ErrorBoundary><App /></ErrorBoundary>
\`\`\`

能捕获：渲染、生命周期、子组件构造函数错误。
不能捕获：事件回调错误、异步代码（setTimeout/Promise）、SSR 错误、ErrorBoundary 自身错误。

事件/异步错误处理：
\`\`\`jsx
try { await fetchData(); } catch (e) { setError(e); }
<button onClick={async () => { try { await save(); } catch(e){...} }} />
\`\`\`

关键：错误边界兜底渲染错误防白屏；事件/异步错误需 try/catch 或全局 window.onerror / unhandledrejection。`,
    keyPoints: ["类组件 getDerivedStateFromError/componentDidCatch", "不能捕获事件/异步错误", "事件异步用 try/catch"],
    followUps: ["React 19 函数组件能用错误边界吗？", "如何上报前端错误？"],
    favorited: false,
  },
  {
    id: "fe-60",
    nodeId: "fe-react-advanced",
    question: "React 中逻辑复用有哪些方式？HOC / Render Props / Hooks 的优劣？",
    answer: `1. HOC（高阶组件）：函数接收组件返回新组件。
\`\`\`jsx
function withLoading(Component) {
  return function Wrapped({ loading, ...props }) {
    return loading ? <Spinner /> : <Component {...props} />;
  };
}
const List = withLoading(RawList);
\`\`\`
缺点：嵌套地狱（多层 Wrapper）、props 来源不清、ref 转发麻烦、类型推导复杂。

2. Render Props：通过 prop 传函数复用逻辑。
\`\`\`jsx
<Mouse>{pos => <Dot {...pos} />}</Mouse>
\`\`\`
缺点：JSX 嵌套深、回调函数每次新建可能影响性能。

3. 自定义 Hooks（推荐）：
\`\`\`jsx
function useMouse() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const h = e => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);
  return pos;
}
function App() {
  const pos = useMouse();
  return <Dot {...pos} />;
}
\`\`\`
优点：无嵌套、组合自由、TS 友好、来源清晰。

关键：Hooks 是现代主流；HOC/Render Props 仅在改造老代码或需拦截渲染树时使用。`,
    keyPoints: ["Hooks 是现代主流逻辑复用方式", "HOC 嵌套地狱 props 来源不清", "Render Props 通过函数 prop 共享"],
    followUps: ["自定义 Hook 如何测试？", "Hooks 有哪些不能做的（vs HOC）？"],
    favorited: false,
  },
  // --- fe-vue-basic 补充 ---
  {
    id: "fe-61",
    nodeId: "fe-vue-basic",
    question: "Vue 3 中 ref 和 reactive 的区别？何时用哪个？",
    answer: `ref：包装任意值（含原始值）为响应式，通过 .value 访问；模板中自动解包。

reactive：仅对对象/数组生效，返回 Proxy 代理，直接访问属性。

\`\`\`js
import { ref, reactive } from "vue";

const count = ref(0);       // 原始值必须用 ref
count.value++;              // JS 中用 .value
// 模板：{{ count }}（自动解包）

const state = reactive({ user: { name: "A" }, list: [] });
state.user.name = "B";      // 直接改属性即可触发更新

// 响应式丢失陷阱：解构 reactive 会丢失响应式
let { user } = state;       // user 不再响应式
// 解决：用 toRefs / toRef
const { user } = toRefs(state);
\`\`\`

选择建议：
1. 原始值只能用 ref。
2. 简单对象状态可用 reactive（避免到处 .value）。
3. 从 composable 返回状态优先 ref（解构更安全，统一风格）。
4. 需要整体替换引用时用 ref（reactive 整体替换会丢响应式）。

关键：ref 通用（含原始值），reactive 仅对象；reactive 解构丢响应式需 toRefs。`,
    keyPoints: ["ref 通过 .value 访问，模板自动解包", "reactive 仅对象，返回 Proxy", "reactive 解构丢响应式用 toRefs"],
    followUps: ["ref 的 .value 在模板中为什么自动解包？", "reactive 整体替换为什么丢响应式？"],
    favorited: false,
  },
  {
    id: "fe-62",
    nodeId: "fe-vue-basic",
    question: "Vue 中 computed 和 watch 的区别？watch 的常见选项？",
    answer: `computed：计算属性，基于依赖缓存，依赖不变不重算，必须有返回值；适合派生数据。
watch：侦听器，监听值变化执行副作用（如发请求、操作 DOM）；适合响应式变化时的异步操作。

\`\`\`js
import { ref, computed, watch } from "vue";
const firstName = ref("A");
const lastName = ref("B");

const fullName = computed(() => \`\${firstName.value} \${lastName.value}\`);
// 只在 firstName/lastName 变化时重算

watch(fullName, (n, o) => {
  console.log("姓名从", o, "变为", n);
});

// watch 选项
watch(source, cb, {
  immediate: true,  // 立即执行一次
  deep: true,       // 深度监听对象内部变化
  flush: "post",    // DOM 更新后执行（默认 pre）
  once: true,       // 只触发一次（Vue 3.4+）
});

// 监听多个源
watch([a, b], ([na, nb]) => {});
// 监听 getter
watch(() => obj.field, (n, o) => {});
\`\`\`

选择：派生数据用 computed（带缓存）；异步/副作用用 watch；watchEffect 自动收集依赖无显式源。

关键：computed 缓存有返回值；watch 用于副作用；deep/immediate/flush 是常用选项。`,
    keyPoints: ["computed 缓存派生数据", "watch 执行副作用", "deep/immediate/flush/once 选项"],
    followUps: ["watchEffect 和 watch 的区别？", "computed 如何设置可写？"],
    favorited: false,
  },
  {
    id: "fe-63",
    nodeId: "fe-vue-basic",
    question: "Vue 模板编译的过程？常用指令有哪些？v-if 和 v-show 的区别？",
    answer: `模板编译三步：
1. Parse：模板字符串 → AST（抽象语法树）。
2. Transform：分析静态节点、提升静态树、标记 patchFlag。
3. Generate：AST → 渲染函数（h 函数 / _createElementBlock）。

Vue 3 编译优化：静态提升（hoistStatic）、PatchFlag（仅动态部分带标记）、Block Tree（diff 时只比动态节点）。

常用指令：
- v-bind（:）：绑定属性。
- v-on（@）：绑定事件。
- v-model：双向绑定。
- v-for：循环（需 :key）。
- v-if / v-else-if / v-else：条件渲染（创建/销毁）。
- v-show：条件显示（display:none 切换，元素不销毁）。
- v-html / v-text：插入 HTML/文本。

v-if vs v-show：
\`\`\`html
<!-- v-if：false 时不渲染 DOM，频繁切换开销大，初始 false 节省渲染 -->
<div v-if="show">A</div>

<!-- v-show：始终渲染 DOM，仅切换 display，初始开销大但切换快 -->
<div v-show="show">B</div>
\`\`\`

选择：频繁切换用 v-show；条件很少变且初始可能 false 用 v-if（避免初始渲染开销）。v-if 和 v-for 不要同时用在一个元素（v-if 优先级有问题）。

关键：模板编译为渲染函数；v-if 创建/销毁，v-show 仅切 display。`,
    keyPoints: ["模板 → AST → 渲染函数", "Vue 3 静态提升 + PatchFlag 优化", "v-if 销毁创建/v-show 切 display"],
    followUps: ["Vue 3 的 PatchFlag 如何加速 diff？", "v-for 为什么需要 key？"],
    favorited: false,
  },
  {
    id: "fe-64",
    nodeId: "fe-vue-basic",
    question: "Vue 3 的生命周期钩子有哪些？setup 中如何使用？",
    answer: `Vue 3 生命周期（Options API → Composition API）：
- beforeCreate / created → setup（替代，setup 本身就在这两者间执行）。
- beforeMount → onBeforeMount。
- mounted → onMounted。
- beforeUpdate → onBeforeUpdate。
- updated → onUpdated。
- beforeUnmount → onBeforeUnmount（Vue 2 是 beforeDestroy）。
- unmounted → onUnmounted（Vue 2 是 destroyed）。
- errorCaptured → onErrorCaptured。
- activated / deactivated（KeepAlive）→ onActivated / onDeactivated。

\`\`\`vue
<script setup>
import { onMounted, onUnmounted, ref } from "vue";

const timer = ref(0);
onMounted(() => {
  console.log("DOM 已挂载");
  timer.value = setInterval(() => console.log("tick"), 1000);
});
onUnmounted(() => {
  console.log("组件卸载，清理副作用");
  clearInterval(timer.value);
});
</script>
\`\`\`

执行顺序：父 beforeMount → 子 beforeMount → 子 mounted → 父 mounted。

关键：setup 替代 beforeCreate/created；副作用在 onMounted 启动、onUnmounted 清理。`,
    keyPoints: ["setup 替代 beforeCreate/created", "onMounted/onUnmounted 处理副作用", "父beforeMount→子→子mounted→父mounted"],
    followUps: ["KeepAlive 的 activated/deactivated 何时触发？", "onErrorCaptured 能捕获哪些错误？"],
    favorited: false,
  },
  // --- fe-vue-advanced 补充 ---
  {
    id: "fe-65",
    nodeId: "fe-vue-advanced",
    question: "Vue Router 的导航守卫有哪些？执行顺序？如何做权限控制？",
    answer: `导航守卫分三类：
1. 全局守卫：router.beforeEach / router.beforeResolve / router.afterEach。
2. 路由独享守卫：路由配置的 beforeEnter。
3. 组件内守卫：beforeRouteEnter / beforeRouteUpdate / beforeRouteLeave（Options API），Composition API 用 onBeforeRouteLeave / onBeforeRouteUpdate。

执行顺序（路由跳转）：
1. 失活组件 beforeRouteLeave → 2. 全局 beforeEach → 3. 路由 beforeEnter → 4. 激活组件 beforeRouteEnter → 5. 全局 beforeResolve → 6. 全局 afterEach → 7. 组件 mounted（DOM 更新）。

\`\`\`js
import { createRouter } from "vue-router";

const router = createRouter({ /* routes */ });

router.beforeEach((to, from) => {
  const token = localStorage.getItem("token");
  if (to.meta.auth && !token) {
    return { path: "/login", query: { redirect: to.fullPath } };
  }
  // 返回 false / 路由对象 / 不返回（放行）
});

router.beforeResolve(async (to) => {
  // 全局前置解析，适合等数据就绪
  if (to.meta.preload) await store.fetch(to.params.id);
});

router.afterEach((to) => {
  // 路由已确认，常用于埋点/标题
  document.title = to.meta.title || "App";
});
\`\`\`

权限控制：路由 meta 标记 roles；beforeEach 中按用户角色判断，无权则跳 403 或默认页。

关键：beforeEach 是权限拦截首选；next() 在 Vue Router 4 已可选，return 路由对象更直观。`,
    keyPoints: ["三类守卫：全局/独享/组件内", "beforeEach 做权限拦截", "Router 4 用 return 替代 next()"],
    followUps: ["beforeRouteEnter 为什么拿不到 this？", "如何做基于角色的动态路由？"],
    favorited: false,
  },
  {
    id: "fe-66",
    nodeId: "fe-vue-advanced",
    question: "如何抽离一个 Vue composable（自定义 Hook）？请举例 useFetch。",
    answer: `composable 是一个以 use 开头的函数，封装响应式状态 + 副作用，可在 setup 中复用。

\`\`\`ts
import { ref, shallowRef, isShallow, watch, unref } from "vue";

export function useFetch(url, options = {}) {
  const data = shallowRef(null);
  const error = ref(null);
  const loading = ref(false);

  async function run() {
    loading.value = true;
    error.value = null;
    try {
      const res = await fetch(unref(url), options);
      if (!res.ok) throw new Error("HTTP " + res.status);
      data.value = await res.json();
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  }

  // url 是 ref 时自动重新请求
  watch(() => unref(url), run, { immediate: true });

  return { data, error, loading, refresh: run };
}

// 使用
const { data, error, loading, refresh } = useFetch(() => \`/api/user/\${id.value}\`);
\`\`\`

要点：
1. 返回响应式引用（ref/shallowRef），消费者解构后仍响应式。
2. 用 shallowRef 存大对象避免深层响应式开销。
3. unref 支持传入 ref 或常量，watch 监听依赖变化自动重新请求。
4. 暴露 refresh 方法支持手动刷新。

关键：composable 把状态+副作用封装，比 mixin 来源清晰、无命名冲突、TS 友好。`,
    keyPoints: ["use 开头封装响应式状态+副作用", "返回 ref/shallowRef 解构仍响应式", "watch 自动响应 url 变化"],
    followUps: ["shallowRef 和 ref 的选择？", "composable 如何做单元测试？"],
    favorited: false,
  },
  {
    id: "fe-67",
    nodeId: "fe-vue-advanced",
    question: "Vue 3 的编译优化（PatchFlag / 静态提升 / Block Tree）如何提升 diff 性能？",
    answer: `Vue 2 diff：全量对比新旧 vnode 树，逐节点比 props/children，节点多时慢。

Vue 3 编译期优化（编译时就知道哪些是动态的）：

1. PatchFlag：编译时给每个动态节点打标记，运行时只 patch 标记部分。
\`\`\`js
// 模板 <div class="static">{{ msg }}</div>
// 编译为
createVNode("div", { class: "static" }, msg, PatchFlags.TEXT)
// 只需 patch 文本，跳过 class 比较
\`\`\`
PatchFlag 类型：TEXT（文本）、CLASS（class）、STYLE、PROPS、FULL_PROPS（key 变化）、HYDRATE_EVENTS 等。

2. 静态提升（hoistStatic）：纯静态节点提到 render 函数外，每次渲染复用同一引用，跳过 diff。
\`\`\`js
const _hoisted_1 = createVNode("div", null, "静态"); // render 外
function render() { return [_hoisted_1, dynamic]; }
\`\`\`

3. Block Tree：动态节点作为 Block，收集其子树的动态节点到 dynamicChildren 数组，diff 时只遍历该数组（跳过静态节点），复杂度从 O(n) 全树降到 O(动态节点数)。

4. 缓存事件处理器（cacheHandlers）：内联事件不会每次渲染新建函数，配合 v-on 缓存避免子组件无效更新。

关键：Vue 3 把 diff 从"全树"降到"仅动态节点"，编译时优化让运行时更轻。`,
    keyPoints: ["PatchFlag 标记动态部分只 patch 该部分", "静态提升复用静态节点跳过 diff", "Block Tree 只遍历动态节点数组"],
    followUps: ["为什么 v-for 不能直接提升？", "动态 key 切换如何影响 Block Tree？"],
    favorited: false,
  },
  {
    id: "fe-68",
    nodeId: "fe-vue-advanced",
    question: "KeepAlive 如何缓存组件？activated/deactivated 生命周期？",
    answer: `KeepAlive：缓存不活动的组件实例，切换时不再销毁，保留状态和 DOM。

\`\`\`vue
<template>
  <KeepAlive :include="['UserList', 'Profile']" :max="10">
    <component :is="currentComponent" />
  </KeepAlive>
</template>
\`\`\`

属性：
- include / exclude：匹配组件 name 缓存或排除（字符串/正则/数组）。
- max：最多缓存实例数，超 LRU 淘汰。

缓存后生命周期：
- 首次进入：mounted → activated。
- 切出（缓存）：deactivated（不触发 unmounted）。
- 再次进入：activated（不触发 mounted，实例已存在）。

\`\`\`js
import { onActivated, onDeactivated } from "vue";
onActivated(() => { /* 重新订阅/恢复定时器 */ });
onDeactivated(() => { /* 暂停订阅/清定时器，但保留状态 */ });
\`\`\`

注意：
1. KeepAlive 的子组件只能是单个根组件（多根会警告）。
2. 缓存组件过多占内存，用 max 控制 LRU。
3. 需要强制刷新缓存：用 :key 变化或 exclude 临时排除。

关键：KeepAlive 缓存实例保留状态；用 activated/deactivated 替代 mounted/unmounted 管理副作用。`,
    keyPoints: ["KeepAlive 缓存组件实例不销毁", "include/exclude/max 控制", "activated/deactivated 替代 mounted/unmounted"],
    followUps: ["KeepAlive 如何实现 LRU 缓存？", "include 匹配的是 name 还是路由？"],
    favorited: false,
  },
  // --- fe-state-mgmt 补充 ---
  {
    id: "fe-69",
    nodeId: "fe-state-mgmt",
    question: "Redux Toolkit（RTK）解决了什么痛点？createSlice 的用法？",
    answer: `Redux 痛点：模板代码多（action type/action creator/reducer 三件套）、不可变更新繁琐、配置 store 复杂、异步需手写 thunk。

RTK 解决：
1. createSlice：自动生成 action types 和 action creators，reducer 内可用"可变"语法（内置 Immer 自动转不可变）。
2. configureStore：默认集成 thunk、DevTools、序列化检测。
3. createAsyncThunk：标准化异步 action（pending/fulfilled/rejected）。
4. RTK Query：声明式数据获取 + 缓存。

\`\`\`js
import { createSlice, configureStore, createAsyncThunk } from "@reduxjs/toolkit";

const fetchUser = createAsyncThunk("user/fetch", async (id) => {
  const res = await fetch("/api/user/" + id);
  return res.json();
});

const userSlice = createSlice({
  name: "user",
  initialState: { data: null, status: "idle" },
  reducers: {
    // 看似 mutate，实为 Immer 转不可变
    clear(state) { state.data = null; },
  },
  extraReducers: (b) => b
    .addCase(fetchUser.pending, (s) => { s.status = "loading"; })
    .addCase(fetchUser.fulfilled, (s, a) => { s.data = a.payload; s.status = "done"; }),
});

export const { clear } = userSlice.actions;
const store = configureStore({ reducer: { user: userSlice.reducer } });

// 组件
import { useSelector, useDispatch } from "react-redux";
const data = useSelector(s => s.user.data);
const dispatch = useDispatch();
dispatch(fetchUser(1));
\`\`\`

关键：RTK 用 Immer 让 reducer 写可变语法仍是不可变；createAsyncThunk 标准化异步生命周期。`,
    keyPoints: ["createSlice 自动生成 action + Immer 不可变", "configureStore 默认集成 thunk/DevTools", "createAsyncThunk 三态"],
    followUps: ["RTK Query 和 React Query 区别？", "Immer 是如何把 mutate 转不可变的？"],
    favorited: false,
  },
  {
    id: "fe-70",
    nodeId: "fe-state-mgmt",
    question: "React Context 的性能问题如何诊断和优化？什么时候该换状态管理库？",
    answer: `Context 性能问题表现：Provider 的 value 引用变化时，所有消费该 Context 的组件（即使只用了部分字段）都重渲染。

诊断：
1. React DevTools Profiler 录制，查看哪些组件因 Context 重渲染。
2. 在组件 render 内 console.log，看是否在不该渲染时打印。
3. 检查 Provider value 是否每次新建对象/函数。

优化：
\`\`\`jsx
// 1. 稳定 value 引用
const value = useMemo(() => ({ user, theme }), [user, theme]);
<UserCtx.Provider value={value}>...</UserCtx.Provider>

// 2. 拆分 Context：稳定数据/频繁数据分离
<UserCtx.Provider value={user}><ThemeCtx.Provider value={theme}>{children}</ThemeCtx.Provider></UserCtx.Provider>

// 3. selector 模式：组件按需取
const useUser = () => useContext(UserCtx); // 全量消费

// 4. 第三方库 use-context-selector 按字段订阅
import { useContextSelector } from "use-context-selector";
const name = useContextSelector(UserCtx, s => s.name); // 仅 name 变化才渲染
\`\`\`

何时换状态管理库：
1. 全局状态多、订阅精细 → Zustand（selector 订阅，无 Provider）。
2. 复杂派生/异步流 → Redux Toolkit（中间件生态）。
3. 服务器状态 → React Query / SWR（缓存、失效、重新拉取）。
4. 不再因 Context 频繁更新 → 拆分仍不奏效时。

关键：低频全局数据用 Context；高频/精细订阅用 Zustand/Redux；服务器状态用 React Query。`,
    keyPoints: ["Context value 变化全员重渲染", "useMemo 稳定 value + 拆分 Context", "高频/精细订阅换 Zustand/Redux"],
    followUps: ["Zustand 的 selector 如何避免重渲染？", "React Query 和本地状态如何配合？"],
    favorited: false,
  },
  {
    id: "fe-71",
    nodeId: "fe-state-mgmt",
    question: "Redux / Zustand / Recoil / Jotai / React Context 选型对比？",
    answer: `选型维度：学习成本、模板代码、性能（订阅粒度）、生态、TS 友好、是否需要 Provider。

| 方案 | 模板 | 订阅粒度 | Provider | 适合场景 |
|---|---|---|---|---|
| Redux Toolkit | 中 | 字段（需 selector） | 是 | 大型应用、复杂异步流、可预测调试 |
| Zustand | 低 | 字段（selector） | 否 | 中小型项目、轻量全局状态 |
| Jotai | 低 | 原子（细粒度） | 是（Provider） | 高度依赖派生、状态图复杂 |
| Recoil | 中 | 原子 | 是 | 同 Jotai，社区活跃度下降 |
| React Context | 低 | 整个 value | 是 | 低频全局（主题/用户/语言） |

\`\`\`js
// Zustand
const useStore = create((set) => ({
  count: 0,
  inc: () => set(s => ({ count: s.count + 1 })),
}));
const count = useStore(s => s.count); // 仅订阅 count

// Jotai
const countAtom = atom(0);
const doubleAtom = atom(get => get(countAtom) * 2); // 派生
function C() {
  const [c, setC] = useAtom(countAtom);
  const d = useAtomValue(doubleAtom);
}
\`\`\`

实践建议：
- 新项目中小型：Zustand + React Query（服务器状态）。
- 大型企业：Redux Toolkit（约束 + 工具链成熟）。
- 复杂派生图：Jotai。
- 简单全局：Context（仅低频数据）。

关键：服务器状态优先 React Query/SWR；客户端状态按规模选 Zustand/RTK。`,
    keyPoints: ["Zustand 无 Provider + selector 订阅", "RTK 适合大型可预测应用", "服务器状态优先 React Query"],
    followUps: ["Jotai 的派生 atom 如何缓存？", "Redux 和 Zustand 的 devtools 体验差异？"],
    favorited: false,
  },
  {
    id: "fe-72",
    nodeId: "fe-state-mgmt",
    question: "Redux reducer 为什么要求纯函数？如何用 Immer 简化不可变更新？",
    answer: `纯函数要求原因：
1. 可预测：相同输入相同输出，无副作用，便于测试和调试（时间旅行）。
2. 性能：reducer 返回新引用 → React/RTK 检测到变化触发更新；mutate 旧 state 引用不变 → 检测不到 → 不渲染。
3. 历史追踪：Redux DevTools 依赖不可变快照实现"时间旅行"调试，mutate 会破坏历史。

Immer：用 Proxy 拦截 mutate 操作，生成新对象，让 reducer 写"可变"语法但仍返回不可变结果。

\`\`\`js
import { produce } from "immer";

// 手写不可变：繁琐
function reducer(state, action) {
  switch (action.type) {
    case "UPDATE":
      return {
        ...state,
        user: { ...state.user, addr: { ...state.user.addr, city: action.city } },
      };
  }
}

// Immer：写可变，自动转不可变
const reducer2 = produce((draft, action) => {
  switch (action.type) {
    case "UPDATE":
      draft.user.addr.city = action.city; // 直接 mutate draft
      // 不需要 return（除非整体替换）
  }
});

// RTK 内置 Immer，createSlice 的 reducers 直接写可变
\`\`\`

Immer 原理：
1. produce 接收 recipe，创建 draft（Proxy 包装 state）。
2. recipe 中 mutate draft，Immer 记录变更。
3. produce 基于变更生成新 state，未变部分复用旧引用（结构共享）。

关键：纯函数保证可预测 + 性能 + 时间旅行；Immer 用 Proxy 让"写可变"等于"返回不可变"。`,
    keyPoints: ["纯函数保证可预测/性能/时间旅行", "Immer Proxy 拦截 mutate 生成不可变", "RTK 内置 Immer"],
    followUps: ["Immer 的结构共享如何节省内存？", "immer 没有改变时返回的引用是同一个吗？"],
    favorited: false,
  },
  // --- fe-build-tools 补充 ---
  {
    id: "fe-73",
    nodeId: "fe-build-tools",
    question: "Webpack 常见的优化手段？如何做代码分割（Code Splitting）和分包？",
    answer: `优化方向：构建速度、产物体积、运行时性能。

构建速度：
1. cache：cache.type: "filesystem" 持久化缓存。
2. 多线程：thread-loader / terser-webpack-plugin parallel。
3. 缩小 loader 范围：include/exclude 排除 node_modules。
4. alias 缩短解析路径。
5. externals 把不变库（React/jQuery）走 CDN 不打包。

产物体积：
1. Tree Shaking：ESM + production 模式 + sideEffects:false。
2. 代码压缩：TerserPlugin / CssMinimizerPlugin。
3. 代码分割：SplitChunksPlugin。

\`\`\`js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendor: {
          test: /[\\\\/]node_modules[\\\\/]/,
          name: "vendor",
          chunks: "all",
        },
        // 把大库单独拆分
        react: {
          test: /[\\\\/]node_modules[\\\\/](react|react-dom)[\\\\/]/,
          name: "react",
          priority: 10,
        },
      },
    },
    runtimeChunk: "single", // 抽离 runtime
  },
};

// 动态导入：自动分割
import("./Chart").then(m => m.default);

// 魔法注释命名
import(/* webpackChunkName: "chart" */ "./Chart");
\`\`\`

运行时：
1. 按路由懒加载。
2. preload（关键资源提前加载）/ prefetch（空闲加载下一页）。
3. Module Federation（微前端共享模块）。

关键：splitChunks 拆 vendor/大库；动态 import 拆路由；Tree Shaking + 压缩减体积。`,
    keyPoints: ["splitChunks 拆 vendor/大库", "动态 import 自动分割", "持久化缓存+多线程加速构建"],
    followUps: ["Module Federation 如何实现微前端？", "SplitChunks 的 priority 有什么用？"],
    favorited: false,
  },
  {
    id: "fe-74",
    nodeId: "fe-build-tools",
    question: "Babel 的作用和原理？preset 和 plugin 的执行顺序？",
    answer: `Babel：把新版 JS/JSX/TS 转译为兼容版本（ES5+），让现代语法能在旧浏览器运行。

原理三步：
1. Parse：源码 → AST（@babel/parser）。
2. Transform：遍历 AST，按插件增删改节点（@babel/traverse）。
3. Generate：AST → 代码 + sourcemap（@babel/generator）。

\`\`\`js
// 箭头函数 → 普通函数（plugin 示例）
const arrowFn = () => 1;
// 经 @babel/plugin-transform-arrow-functions 后
var arrowFn = function() { return 1; };
\`\`\`

preset：一组插件集合（如 @babel/preset-env 按目标浏览器自动选插件；@babel/preset-react 含 JSX 转换；@babel/preset-typescript 含 TS 转换）。

执行顺序：
1. plugin 在 preset 之前执行。
2. plugin 之间：从前到后执行。
3. preset 之间：从后到前执行（逆序）。

\`\`\`json
{
  "presets": [
    ["@babel/preset-env", { "targets": "> 0.25%, not dead", "useBuiltIns": "usage", "corejs": 3 }],
    ["@babel/preset-react", { "runtime": "automatic" }],
    "@babel/preset-typescript"
  ],
  "plugins": [
    "@babel/plugin-proposal-decorators", // 先执行
    "@babel/plugin-proposal-class-properties"
  ]
}
\`\`\`

polyfill vs transform：
- transform：改语法（箭头函数、可选链）。
- polyfill：补 API（Promise、Array.includes），用 useBuiltIns: "usage" 按需注入 core-js。

关键：Babel = parse + transform + generate；preset 是插件包；plugin 先于 preset，preset 逆序执行。`,
    keyPoints: ["Babel 三步：parse/transform/generate", "preset 是插件集合", "plugin 先于 preset，preset 逆序"],
    followUps: ["@babel/preset-env 的 useBuiltIns 三种模式区别？", "Babel 和 SWC 的性能差异？"],
    favorited: false,
  },
  {
    id: "fe-75",
    nodeId: "fe-build-tools",
    question: "Source Map 是什么？开发环境和生产环境的策略？",
    answer: `Source Map：一个映射文件，把打包后的代码（压缩/转译）映射回源码位置，便于调试和错误定位。

格式：打包文件末尾 //# sourceMappingURL=app.js.map，map 文件包含 sources/names/mappings 等字段，mappings 用 VLQ 编码记录位置对应。

devtool 选项（Webpack）：
- eval：每模块用 eval 包裹，构建快无 sourcemap 行映射。
- cheap-source-map：行级映射，不含列，较快。
- source-map：完整独立 .map 文件，最详细。
- eval-cheap-module-source-map：开发常用，速度快 + 行映射 + 含 loader sourcemap。
- inline-source-map：map 内联到 JS（base64），文件大。
- hidden-source-map：生成 .map 但不加 sourceMappingURL（生产用，错误监控上传）。
- nosources-source-map：含映射但不含源码内容（生产可暴露行号不暴露源码）。

策略：
\`\`\`js
// 开发：快 + 可调试
devtool: "eval-cheap-module-source-map"

// 生产：错误监控需 sourcemap 但不暴露给用户
devtool: "hidden-source-map" // 生成 .map，不写引用
// 部署时上传 .map 到 Sentry，不部署到 CDN
\`\`\`

错误监控：Sentry / Bugsnag 等通过上传 sourcemap 还原生产环境错误栈到源码位置。

关键：dev 重速度+调试，prod 重不暴露源码+错误监控还原。`,
    keyPoints: ["sourcemap 映射打包代码到源码", "dev 用 eval-cheap-module-source-map", "prod 用 hidden-source-map + 上传错误监控"],
    followUps: ["VLQ 编码如何工作？", "Sentry 如何用 sourcemap 还原错误？"],
    favorited: false,
  },
  {
    id: "fe-76",
    nodeId: "fe-build-tools",
    question: "Turbopack / esbuild / SWC / Vite 各自定位和差异？",
    answer: `esbuild：Go 写的 JS 打包器/转译器，极快（无类型检查，只转译）。
- 用于：Vite 预构建依赖、tsup 库打包、Resend/Astro 等。
- 缺点：无完整 TS 类型检查、插件生态不如 Webpack/Rollup。

SWC：Rust 写的 Babel 替代，转译极快。
- 用于：Next.js 编译、Turbopack 底层。
- 优势：Babel 插件可移植（部分），速度快 10-20×。

Turbopack：Next.js 团队 Rust 写的打包器，取代 Webpack（dev 模式已稳定，build 仍 beta）。
- 增量编译，按函数粒度缓存，dev 启动极快。
- 与 Next.js 深度集成，生态受限。

Vite：dev 用原生 ESM + esbuild 预构建，prod 用 Rollup。
- 不绑框架，生态最广。
- dev 快但 prod 仍是 Rollup（大项目慢）。

Rollup：库打包首选，tree-shaking 强、产物干净（无运行时），但 dev 弱、CommonJS 支持差。

| 工具 | 语言 | 定位 | 优势 |
|---|---|---|---|
| esbuild | Go | 转译+打包 | 极快、生态广 |
| SWC | Rust | 转译 | Babel 替代 |
| Turbopack | Rust | 应用打包 | Next 集成 |
| Vite | JS | dev+prod | 框架无关 |
| Rollup | JS | 库打包 | tree-shaking |

\`\`\`js
// Vite 中替换底层转译器为 SWC（替换 Babel）
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()], // 使用 SWC 而非 Babel，开发/构建更快
  build: {
    target: "es2020",     // esbuild 转译目标
    minify: "esbuild",    // 用 esbuild 压缩（比 terser 快）
  },
});

// next.config.js 启用 Turbopack（Next 13+）
export default {
  experimental: { turbotrace: true },
  // dev: next dev --turbo
};
\`\`\`

关键：esbuild/SWC 是底层转译引擎；Vite/Rollup 偏应用/库打包；Turbopack 是 Next 专属。`,
    keyPoints: ["esbuild/SWC 是底层转译引擎", "Vite dev 用 esbuild prod 用 Rollup", "Turbopack 与 Next 深度集成"],
    followUps: ["Turbopack 为什么用 Rust？", "esbuild 为什么不做类型检查？"],
    favorited: false,
  },
  // --- fe-perf 补充 ---
  {
    id: "fe-77",
    nodeId: "fe-perf",
    question: "防抖（debounce）和节流（throttle）的区别？分别适合什么场景？",
    answer: `防抖：触发后延迟执行，延迟内再次触发则重新计时 → 只执行最后一次。适合：搜索输入、窗口 resize、表单校验、按钮防连点。
节流：单位时间内最多执行一次 → 固定频率执行。适合：滚动加载、鼠标移动、按钮防连点（需要立即反馈）。

\`\`\`js
// 防抖：触发 N 秒后才执行，N 秒内再次触发则重新计时
function debounce(fn, delay = 300) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// 节流（定时器版）：N 秒内只执行一次
function throttle(fn, delay = 300) {
  let timer = null;
  return function(...args) {
    if (timer) return;
    timer = setTimeout(() => {
      fn.apply(this, args);
      timer = null;
    }, delay);
  };
}

// 节流（时间戳版）：立即执行，尾部不补
function throttle2(fn, delay = 300) {
  let last = 0;
  return function(...args) {
    const now = Date.now();
    if (now - last >= delay) {
      last = now;
      fn.apply(this, args);
    }
  };
}

// 使用
input.addEventListener("input", debounce(search, 400));
window.addEventListener("scroll", throttle(onScroll, 200));
button.addEventListener("click", throttle(submit, 1000));
\`\`\`

变体：leading（立即执行一次）/ trailing（尾部补一次）选项，lodash 提供完整实现。

关键：防抖重"最后一次"，节流重"固定频率"；搜索用防抖、滚动用节流。`,
    keyPoints: ["防抖只执行最后一次", "节流固定频率执行一次", "防抖搜索/节流滚动"],
    followUps: ["leading/trailing 选项的作用？", "lodash 的 debounce 和 throttle 有什么高级选项？"],
    favorited: false,
  },
  {
    id: "fe-78",
    nodeId: "fe-perf",
    question: "前端图片优化有哪些手段？图片格式如何选？",
    answer: `优化维度：体积、加载、渲染、体验。

1. 格式选择：
- WebP：现代格式，比 JPEG/PNG 小 25-35%，支持有损/无损/透明，主流浏览器支持。
- AVIF：更先进的格式，比 WebP 再小 20%，但编码慢、兼容性稍差。
- JPEG：照片，有损。
- PNG：透明/无损，图标适合。
- SVG：矢量图标/插画，无损放大，体积小。
- 用 <picture> 多源 + type 回退：
\`\`\`html
<picture>
  <source srcset="hero.avif" type="image/avif" />
  <source srcset="hero.webp" type="image/webp" />
  <img src="hero.jpg" alt="..." loading="lazy" />
</picture>
\`\`\`

2. 加载优化：
- 响应式图片：srcset + sizes 按视口选合适尺寸。
\`\`\`html
<img srcset="small.jpg 480w, medium.jpg 800w, large.jpg 1200w"
     sizes="(max-width: 600px) 480px, 800px" src="medium.jpg" />
\`\`\`
- 懒加载：loading="lazy"（首屏外图片）。
- 预加载首屏关键图：<link rel="preload" as="image" href="hero.avip" fetchpriority="high" />。
- CDN：按设备/网络返回适配尺寸（?w=800）。

3. 体验：
- 渐进式加载：低质量占位图（LQIP）→ 模糊 → 清晰。
- blur-up：先显示模糊小图，大图加载完替换。
- aspect-ratio 预留位置，避免 CLS。

4. 体积压缩：工具 imagemin / sharp / squoosh；雪碧图（小图标合并）；Base64 内联（<4KB 小图）。

关键：格式选 AVIF/WebP + 降级；首屏 preload + 非首屏 lazy；响应式 srcset 按设备适配。`,
    keyPoints: ["WebP/AVIF 现代格式 + picture 回退", "srcset 响应式 + lazy 懒加载 + preload 首屏", "blur-up/LQIP 渐进式 + aspect-ratio 防 CLS"],
    followUps: ["AVIF 编码慢如何处理？", "Base64 内联的体积阈值如何确定？"],
    favorited: false,
  },
  {
    id: "fe-79",
    nodeId: "fe-perf",
    question: "如何用 Web Worker 处理大计算任务？有哪些限制？",
    answer: `Web Worker：在主线程之外的独立线程运行 JS，不阻塞 UI。适合大计算（数据处理、图像处理、加密、复杂算法）。

\`\`\`js
// 主线程
const worker = new Worker(new URL("./heavy.js", import.meta.url), { type: "module" });
worker.postMessage({ data: bigArray });
worker.onmessage = (e) => {
  console.log("结果", e.data);
  worker.terminate(); // 用完销毁
};

// heavy.js（worker 线程）
self.onmessage = (e) => {
  const result = heavyCompute(e.data.data);
  self.postMessage(result);
};
\`\`\`

限制：
1. 不能访问 DOM / window / document（独立全局环境 self）。
2. 通信靠 postMessage，数据默认结构化克隆（大对象开销大）。
3. 同源限制（部分场景）；模块 worker 用 import 拉外部脚本需同源或 CORS。
4. 不能直接读 localStorage（可用 IndexedDB）。

性能优化：
1. Transferable Objects（ArrayBuffer/OffscreenCanvas）转移所有权零拷贝：
\`\`\`js
const buf = new ArrayBuffer(1e8);
worker.postMessage(buf, [buf]); // 转移，主线程 buf 被清空
\`\`\`
2. OffscreenCanvas：把 canvas 渲染搬到 worker，主线程零渲染压力。
3. SharedArrayBuffer + Atomics：多线程共享内存（需 COOP/COEP 安全头）。

替代方案：
- 短任务：用 requestIdleCallback 切片。
- 流式数据：用 TransformStream 处理。
- WASM：把计算密集用 Rust/C 编译为 WASM。

关键：Worker 适合 >50ms 的纯计算任务；用 Transferable 零拷贝传大数据；OffscreenCanvas 把渲染搬离主线程。`,
    keyPoints: ["Worker 在独立线程不阻塞 UI", "postMessage 默认结构化克隆", "Transferable 零拷贝转移 ArrayBuffer"],
    followUps: ["SharedArrayBuffer 需要什么安全头？", "OffscreenCanvas 如何在 worker 中渲染？"],
    favorited: false,
  },
  // --- fe-browser 补充 ---
  {
    id: "fe-80",
    nodeId: "fe-browser",
    question: "重绘（Repaint）和回流/重排（Reflow）的区别？如何避免？",
    answer: `回流（Reflow/Layout）：元素几何属性（位置/尺寸）变化触发，重新计算布局。开销大。
重绘（Repaint）：元素外观（颜色/背景/阴影）变化触发，重新绘制像素，不重新布局。开销中。
合成（Composite）：transform/opacity 变化只影响合成层，不触发布局和绘制。开销最小。

触发回流的操作：
1. 改尺寸/位置：width/height/margin/padding/position/float。
2. 改字体：font-size/font-family。
3. 增删 DOM、改 textContent。
4. 读取触发布局的属性：offsetTop/scrollTop/getBoundingClientRect/clientWidth（强制同步布局）。
5. 窗口 resize。

优化：
1. 用 transform/opacity 做动画（走合成层，不回流）。
2. 批量改 DOM：DocumentFragment 一次性插入；或先 display:none 再操作再显示。
3. 避免逐条改 style，用 class 切换。
4. 避免布局抖动：不要在循环中读取布局属性后再写 DOM（强制布局反复触发）。
5. 用 will-change / transform: translateZ(0) 提升合成层（适度）。

\`\`\`js
// 错误：读+写交替触发强制布局
for (let i = 0; i < items.length; i++) {
  items[i].style.left = items[i].offsetLeft + 10 + "px"; // 每次都强制布局
}

// 正确：先读后写分离
const lefts = items.map(it => it.offsetLeft); // 一次性读
items.forEach((it, i) => { it.style.left = lefts[i] + 10 + "px"; });

// 动画用 transform
.box { transition: transform 0.2s; }
.box.move { transform: translateX(100px); } /* 不触发回流 */
\`\`\`

关键：回流 > 重绘 > 合成（开销递减）；动画优先 transform/opacity；读写分离避免布局抖动。`,
    keyPoints: ["回流>重绘>合成开销递减", "transform/opacity 走合成层", "读写分离避免布局抖动"],
    followUps: ["will-change 滥用有什么问题？", "强制同步布局（layout thrashing）如何检测？"],
    favorited: false,
  },
  {
    id: "fe-81",
    nodeId: "fe-browser",
    question: "V8 的垃圾回收机制？新生代/老生代如何回收？",
    answer: `V8 分代回收：堆分为新生代（短生命周期）和老生代（长生命周期），不同算法。

新生代（1-8MB，Scavenge 算法）：
- 分 From / To 两个半区。
- 新对象分配在 From。
- GC 时：从根遍历存活对象，复制到 To 并整理；From/To 角色互换。
- 复制后还存活的对象晋升到老生代（已过一次 GC 或占用 To 25%+）。
- 适合"朝生夕死"对象，速度快但空间利用率 50%。

老生代（大，标记-清除 + 标记-整理）：
- 标记-清除（Mark-Sweep）：从根遍历标记存活，清除未标记。产生碎片。
- 标记-整理（Mark-Compact）：标记后把存活对象移向一端，整理无碎片。开销大，触发频率低。
- 增量标记 + 并发标记：把标记任务切片，与主线程交替执行，减少停顿。

根（GC Roots）：全局对象、栈上变量、寄存器、活动函数的局部变量。

\`\`\`js
// 触发 GC 的常见场景
let huge = new Array(1e7); // 大对象
huge = null; // 解除引用，下次 GC 回收

// 闭包持有引用导致无法回收
function leak() {
  const big = new Array(1e6);
  return () => console.log("hi"); // 闭包不引用 big，V8 优化可能回收 big
}
\`\`\`

常见泄漏：
1. 全局变量（未声明直接赋值变全局）。
2. 闭包持有不必要的引用。
3. 定时器/事件监听未清理。
4. 脱离 DOM 树仍被引用。
5. console.log 持有对象引用（DevTools）。

关键：分代回收（新生代复制/老生代标记整理）+ 增量并发减少停顿；泄漏多源于引用未释放。`,
    keyPoints: ["新生代 Scavenge 复制算法", "老生代标记清除+标记整理", "增量+并发标记减少停顿"],
    followUps: ["WeakRef 和 FinalizationRegistry 如何配合 GC？", "如何用 Chrome DevTools 排查内存泄漏？"],
    favorited: false,
  },
  {
    id: "fe-82",
    nodeId: "fe-browser",
    question: "浏览器的同源策略是什么？跨域解决方案有哪些？CORS 如何配置？",
    answer: `同源策略：协议 + 域名 + 端口三者相同才同源。不同源的页面之间默认禁止：DOM 访问、Cookie/Storage 读取、AJAX 请求响应读取。目的：防恶意网站窃取数据。

跨域解决方案：

1. CORS（推荐）：服务端设置响应头允许跨域。
\`\`\`
# 简单请求（GET/HEAD/POST + 简单头）
Access-Control-Allow-Origin: https://app.com  # 或 *（不带 cookie 时）
Access-Control-Allow-Credentials: true        # 允许带 cookie

# 预检请求（PUT/DELETE 或自定义头）先发 OPTIONS
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400
\`\`\`
浏览器流程：简单请求直接发；复杂请求先 OPTIONS 预检，通过后发真实请求。

2. 代理（开发常用）：dev 服务器代理转发（避免浏览器跨域）。
\`\`\`js
// vite.config.js
server: { proxy: { "/api": { target: "https://api.com", changeOrigin: true } } }
// 生产：Nginx 反代
location /api/ { proxy_pass https://api.com/; }
\`\`\`

3. JSONP（老方案）：利用 <script> 不受同源限制，服务端返回回调函数调用。只支持 GET，安全性差，已淘汰。

4. postMessage：跨窗口通信（iframe / window.open / Worker）。
\`\`\`js
// 父 → iframe
iframe.contentWindow.postMessage(data, "https://child.com");
window.addEventListener("message", e => { if (e.origin === "https://parent.com") ... });
\`\`\`

5. document.domain：同主域不同子域共享 DOM（已废弃）。

关键：现代跨域首选 CORS（服务端配头）；开发用 dev proxy；跨窗口通信用 postMessage。`,
    keyPoints: ["同源=协议+域名+端口", "CORS 简单/预检请求", "dev 用代理、跨窗口用 postMessage"],
    followUps: ["为什么 cookie 默认不跨域？SameSite 影响？", "预检请求 OPTIOSN 缓存如何配置？"],
    favorited: false,
  },
  // --- fe-engineering 补充 ---
  {
    id: "fe-83",
    nodeId: "fe-engineering",
    question: "Monorepo 工具对比（pnpm workspaces / Turborepo / Nx / Lerna）？如何选型？",
    answer: `Monorepo：多个项目/包放在一个仓库管理，便于代码复用、统一配置、原子化提交。

工具对比：
1. pnpm workspaces：包管理层面的 monorepo，硬链接 + 符号链接省磁盘，依赖提升严谨。基础方案，足够中小项目。
2. Turborepo：构建调度层（Vercel 出品，Rust 重写），任务编排 + 远程缓存 + 增量构建，与 pnpm workspaces 配合。
3. Nx：功能最全，插件生态丰富（React/Angular/Node），代码生成器、依赖图分析、affected 命令。
4. Lerna：老牌工具，主要做版本管理与发布（已合并到 Nx，不再独立维护）。

\`\`\`json
// pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"

// package.json（根）
{
  "scripts": {
    "build": "turbo run build",
    "test": "turbo run test",
    "dev": "turbo run dev --parallel"
  }
}

// turbo.json（任务调度 + 缓存）
{
  "pipeline": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**"] },
    "test": { "dependsOn": ["build"] },
    "dev": { "cache": false, "persistent": true }
  }
}
\`\`\`

选型：
- 中小型 / 通用：pnpm workspaces + Turborepo（轻量、快）。
- 大型企业 / 多框架：Nx（插件多、生成器、依赖图）。
- 仅发版管理：Changesets（轻量）。

关键：pnpm workspaces 管依赖；Turborepo/Nx 管任务编排与缓存；Changesets 管版本发布。`,
    keyPoints: ["pnpm workspaces 管包依赖", "Turborepo 远程缓存+增量", "Nx 插件生态全"],
    followUps: ["Turborepo 的远程缓存如何配置？", "Nx 的 affected 命令原理？"],
    favorited: false,
  },
  {
    id: "fe-84",
    nodeId: "fe-engineering",
    question: "如何做 npm 包的版本管理和发布？Changesets 工作流？",
    answer: `版本规范：语义化版本 SemVer MAJOR.MINOR.PATCH：
- MAJOR：不兼容的 API 变更。
- MINOR：向后兼容的新功能。
- PATCH：向后兼容的 bug 修复。
- 预发布：1.0.0-beta.1，构建元数据 1.0.0+20260714。

发布流程（手写）：
1. 改代码 → 跑测试 → commit。
2. 改 version → changelog。
3. npm publish（先 npm login）。
4. 打 git tag → push。

Changesets 工作流（monorepo 友好）：
1. 开发者改代码后运行 npx changeset，选择影响包 + 版本类型 + 写变更说明，生成 .changeset/*.md。
2. PR 合并时 changeset 文件一起入库。
3. CI 跑 changeset version 自动改 package.json + 生成 CHANGELOG.md + 删 changeset 文件。
4. changeset publish 自动 publish 到 npm + 打 tag。

\`\`\`json
// .changeset/config.json
{
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": ["docs"]
}
\`\`\`

发布前检查：
1. npm whoami 确认登录态。
2. dry-run：npm publish --dry-run 看将要发布的文件。
3. files 字段限制发布内容，避免泄露源码。
4. prepublishOnly / prepublish 钩子跑测试。

关键：SemVer 三段 + 预发布；Changesets 把"改版本+chelog+publish"自动化，monorepo 友好。`,
    keyPoints: ["SemVer MAJOR.MINOR.PATCH", "Changesets 生成 .changeset/*.md", "version + publish 两步自动化"],
    followUps: ["monorepo 中如何处理包间依赖版本联动？", "如何撤销已发布的 npm 包？"],
    favorited: false,
  },
  {
    id: "fe-85",
    nodeId: "fe-engineering",
    question: "微前端有哪些方案？qiankun / Module Federation / Single-SPA 各自特点？",
    answer: `微前端：把多个独立子应用组合成一个整体，独立开发/部署/技术栈。解决巨石应用难维护、多团队协作。

方案对比：
1. 基座路由（qiankun / single-spa）：基座应用按路由加载子应用，子应用以 JS 沙箱 + 样式隔离方式挂载。
2. Module Federation（Webpack 5/Rspack 原生）：构建时共享模块，运行时远程加载，组件级共享。
3. Web Components：自定义元素封装子应用，天然隔离。
4. iframe：最简单隔离，但通信差、体验差、SEO 差。

qiankun（基于 single-spa）：
- 子应用导出 lifecycle（bootstrap/mount/unmount）。
- 基座 registerMicroApps 注册路由 → 子应用。
- JS 沙箱（Proxy 隔离 window）、样式隔离（shadowDOM / scoped）。
- 缺点：JS 沙箱有边界 case，样式隔离不完美，子应用需改造导出 lifecycle。

\`\`\`js
// qiankun 基座
import { registerMicroApps, start } from "qiankun";
registerMicroApps([
  { name: "react-app", entry: "//localhost:7100", activeRule: "/react", container: "#sub" },
  { name: "vue-app",  entry: "//localhost:7101", activeRule: "/vue",  container: "#sub" },
]);
start();

// 子应用 main.js
export async function bootstrap() {}
export async function mount(props) { render(props.container); }
export async function unmount() { /* 卸载 */ }
\`\`\`

Module Federation：
\`\`\`js
// 远程应用（host）暴露
new ModuleFederationPlugin({
  name: "remote",
  filename: "remoteEntry.js",
  exposes: { "./Button": "./src/Button" },
  shared: { react: { singleton: true } },
});

// 消费应用
new ModuleFederationPlugin({
  remotes: { remote: "remote@https://host/remoteEntry.js" },
});
import Button from "remote/Button";
\`\`\`

选型：路由级整合 + 隔离强 → qiankun；组件级共享 + 同技术栈 → Module Federation；简单隔离 → iframe/Web Components。

关键：qiankun 路由+JS 沙箱；MF 共享模块组件级；选型看隔离粒度与技术栈一致性。`,
    keyPoints: ["qiankun 路由+JS 沙箱+样式隔离", "Module Federation 共享模块/组件级", "Single-SPA 是 qiankun 底层"],
    followUps: ["qiankun 的 JS 沙箱如何实现？", "Module Federation 如何共享依赖版本？"],
    favorited: false,
  },
  {
    id: "fe-86",
    nodeId: "fe-engineering",
    question: "前端单元测试用什么工具？Vitest 和 Jest 的区别？如何写组件测试？",
    answer: `工具栈：Vitest（Vite 项目）/ Jest（Webpack/CRA 项目）+ Testing Library（DOM/React/Vue）+ jsdom（DOM 模拟）+ Playwright/Cypress（E2E）。

Vitest vs Jest：
- Vitest：Vite 驱动，ESM/TS 原生支持，配置复用 vite.config，watch 极快，API 兼容 Jest。
- Jest：CommonJS 为主，TS/ESM 需 babel/ts-jest 转换，生态成熟，CRA 老项目友好。
- 新项目（Vite/Next.js 13+）选 Vitest；老 CRA 选 Jest。

\`\`\`ts
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  test: { environment: "jsdom", globals: true, setupFiles: ["./setup.ts"] },
});

// 单元测试：纯函数
import { describe, it, expect } from "vitest";
import { add } from "./math";
describe("add", () => {
  it("两数相加", () => expect(add(1, 2)).toBe(3));
  it("NaN 处理", () => expect(add(NaN, 1)).toBeNaN());
});

// 组件测试：Testing Library
import { render, screen, fireEvent } from "@testing-library/react";
test("按钮点击递增", async () => {
  render(<Counter />);
  expect(screen.getByText("0")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /inc/i }));
  expect(await screen.findByText("1")).toBeInTheDocument();
});

// 异步：findByXxx 自动 wait
test("加载数据", async () => {
  render(<UserList />);
  expect(await screen.findByText("Alice")).toBeInTheDocument();
});

// Mock
vi.mock("../api", () => ({ fetchUser: vi.fn(() => Promise.resolve({ id: 1 })) }));
\`\`\`

测试原则：
1. 测行为不测实现（不测内部状态、不测私有方法）。
2. 用角色查询（getByRole）而非测试 id（更贴近无障碍）。
3. AAA 模式：Arrange-Act-Assert。
4. 覆盖率看核心路径，不追求 100%。

关键：Vitest 配 Vite 项目最快；Testing Library 测用户行为而非实现细节。`,
    keyPoints: ["Vitest 兼容 Jest API + Vite 驱动", "Testing Library 测行为不测实现", "getByRole 角色查询贴近无障碍"],
    followUps: ["如何 mock 模块的默认导出？", "MSW 如何 mock 网络请求？"],
    favorited: false,
  },
  // --- fe-mobile 补充 ---
  {
    id: "fe-87",
    nodeId: "fe-mobile",
    question: "移动端 1px 边框为什么变粗？有哪些解决方案？",
    answer: `原因：CSS 的 1px 是 CSS 像素，而高清屏设备像素比（DPR）= 2 或 3，1 CSS 像素对应 2-3 物理像素，1px 边框在物理像素上显示成 2-3px 视觉效果粗。

解决方案：

1. transform scale（最常用）：用 0.5px 视觉效果模拟。
\`\`\`css
.border-1px::after {
  content: "";
  position: absolute;
  left: 0; right: 0; bottom: 0;
  height: 1px;
  background: #ccc;
  transform: scaleY(0.5);
  transform-origin: 0 0;
}
/* DPR=3 用 0.33 */
@media (-webkit-min-device-pixel-ratio: 3) {
  .border-1px::after { transform: scaleY(0.33); }
}
\`\`\`

2. viewport 缩放：动态改 meta viewport scale=1/dpr，整个页面按物理像素渲染。
\`\`\`js
const dpr = window.devicePixelRatio || 1;
document.documentElement.style.fontSize = ...;
const meta = document.querySelector('meta[name=viewport]');
meta.setAttribute('content', \`width=device-width, initial-scale=\${1/dpr}\`);
\`\`\`

3. border-image / background-image：用 1px 图片填充。

4. box-shadow 模拟：
\`\`\`css
box-shadow: 0 0.5px 0 #ccc;
\`\`\`

5. 直接 0.5px（现代浏览器支持，iOS 8+、Chrome 86+）：
\`\`\`css
.border { border: 0.5px solid #ccc; }
\`\`\`

关键：transform scaleY(0.5) 兼容性最好；0.5px 最简单但需现代浏览器。`,
    keyPoints: ["DPR=2/3 导致 1 CSS 像素显粗", "transform scaleY(0.5) 模拟 0.5px", "viewport scale=1/dpr 整页适配"],
    followUps: ["viewport scale=1/dpr 对布局有什么副作用？", "DPR 与 CSS 像素关系？"],
    favorited: false,
  },
  {
    id: "fe-88",
    nodeId: "fe-mobile",
    question: "移动端触摸事件与 click 的 300ms 延迟？如何优化手势交互？",
    answer: `300ms 延迟来源：早期移动浏览器为判断"双击缩放"，等待 300ms 看是否有第二次点击才触发 click。

现代解决：
1. <meta name="viewport" content="width=device-width"> 后 Chrome 会移除延迟。
2. CSS touch-action: manipulation（禁用双击缩放）。
3. fastclick 库（已基本不需要）。
4. 用 touchstart 替代 click（但需注意滚动误触）。

触摸事件：touchstart / touchmove / touchend / touchcancel（多点触控支持 touches/targetTouches）。

手势识别：
- 单击：touchstart → touchend（无 move 或 move 距离 < 10px）。
- 长按：touchstart 后 500ms 不离开。
- 滑动：touchend 时计算位移 > 阈值且时间 < 300ms。
- 双指缩放/旋转：touchstart 时 touches.length === 2，跟踪两点距离/角度变化。

\`\`\`js
// 简易滑动手势
let startX = 0, startY = 0, startT = 0;
el.addEventListener("touchstart", e => {
  const t = e.touches[0];
  startX = t.clientX; startY = t.clientY; startT = Date.now();
});
el.addEventListener("touchend", e => {
  const t = e.changedTouches[0];
  const dx = t.clientX - startX, dy = t.clientY - startY;
  const dt = Date.now() - startT;
  if (dt < 300 && Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
    console.log(dx > 0 ? "右滑" : "左滑");
  }
});

// 防止滚动干扰
el.style.touchAction = "pan-y"; // 允许纵向滚动，自己处理横向
\`\`\`

最佳实践：
1. 现代项目优先 Pointer Events（统一鼠标/触摸/笔）。
2. 手势库：Hammer.js / use-gesture（React）。
3. 移动端慎用 hover（触摸会触发 hover 不易离开）。

关键：300ms 延迟用 viewport meta 或 touch-action 解决；手势识别靠 touchstart/move/end + 阈值判断；优先 Pointer Events 统一交互。`,
    keyPoints: ["300ms 延迟来自双击缩放判定", "viewport meta / touch-action 消除延迟", "Pointer Events 统一交互"],
    followUps: ["Pointer Events 相比 touch events 的优势？", "touch-action 各值的含义？"],
    favorited: false,
  },
  {
    id: "fe-89",
    nodeId: "fe-mobile",
    question: "React Native 的渲染原理？与 Web/Hybrid 的区别？",
    answer: `React Native（RN）：用 JS/React 写原生 App，RN 把组件树映射到原生组件（iOS UIKit / Android View），不是 WebView。

渲染流程：
1. JS 线程运行 React，产出虚拟 DOM 树（描述 Native 组件如 <View>/<Text>）。
2. Bridge（异步批量）把虚拟 DOM 操作序列化为 JSON 传到 Native 线程。
3. Native 线程根据 JSON 创建/更新原生组件（UIView/View）。
4. 原生线程布局 + 渲染。

新架构（0.68+）：
- JSI（JavaScript Interface）：JS 直接持有 C++ 引用，同步调用，替代 Bridge 序列化。
- Fabric：新渲染器，同步布局、并发渲染、更好动画。
- TurboModules：原生模块按需加载，同步调用。
- Hermes：RN 专用 JS 引擎，预编译字节码启动快。

RN vs Hybrid vs Web：
| 维度 | RN | Hybrid(WebView) | PWA/Web |
|---|---|---|---|
| 渲染 | 原生组件 | WebView | 浏览器 |
| 性能 | 接近原生 | 中 | 依赖浏览器 |
| 开发 | JS + React | HTML/JS + Bridge | Web 标准 |
| 发版 | 热更新(JS bundle) | 热更新(H5) | 即时 |
| 跨端 | iOS/Android | 全平台 | 全平台 |

\`\`\`jsx
// RN 组件写法与 React 几乎一致，但标签是原生组件
import { View, Text, Pressable, StyleSheet } from "react-native";

function Card({ title, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View>
        <Text style={styles.title}>{title}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { padding: 12, borderRadius: 8, backgroundColor: "#fff" },
  title: { fontSize: 16, fontWeight: "600" },
});

// 新架构 JSI 同步调用原生模块（不再走 Bridge 序列化）
// const result = NativeModules.Database.querySync("SELECT * FROM users");
\`\`\`

关键：RN 把 React 组件树映射到原生组件（非 WebView）；新架构用 JSI 同步通信，性能接近原生。`,
    keyPoints: ["RN 映射到原生组件非 WebView", "Bridge 异步序列化 / JSI 同步", "新架构 Fabric+TurboModules"],
    followUps: ["RN Bridge 的瓶颈是什么？", "Hermes 引擎为什么启动快？"],
    favorited: false,
  },
  {
    id: "fe-90",
    nodeId: "fe-mobile",
    question: "移动端性能优化的特殊关注点？如何处理首屏、滚动、动画？",
    answer: `移动端相比 PC：CPU/内存弱、网络不稳、屏幕小、电量敏感、触控交互。优化更激进。

首屏优化：
1. 首屏数据 SSR / 骨架屏，避免白屏。
2. 路由懒加载 + 关键 CSS 内联。
3. 图片 lazy + WebP/AVIF + 响应式 srcset。
4. 预连接关键域名 <link rel="preconnect">。
5. 减少 JS 体积（移动端解析慢，1MB JS 解析 ~1s）。

滚动优化：
1. 列表虚拟化（只渲染可视项）。
2. 滚动容器加 will-change: transform 或 overflow: scroll + -webkit-overflow-scrolling: touch（iOS 顺滑）。
3. 滚动事件用 passive: true 监听，不阻塞滚动。
4. overscroll-behavior: contain 防滚动穿透。
\`\`\`js
list.addEventListener("scroll", onScroll, { passive: true });
\`\`\`

动画优化：
1. 优先 transform / opacity（合成层，不触发回流）。
2. 避免大量 box-shadow / filter（绘制开销大）。
3. 复杂动画用 CSS animation / Web Animations API 而非 JS setInterval。
4. 内容动画用 will-change 提示，但别滥用（占内存）。

其他：
1. 防抖节流高频事件（resize/scroll/touchmove）。
2. 移动端慎用 hover（触摸触发不易离开）。
3. 用 IntersectionObserver 替代 scroll 事件做懒加载。
4. Web Worker 处理大计算避免卡帧。
5. Service Worker 缓存 App Shell，离线可用。
6. 内存敏感：及时解绑监听、清理大对象，防止低端机崩溃。

关键：移动端首屏先 SSR/骨架屏；滚动用虚拟列表 + passive；动画用 transform/opacity 走合成层。`,
    keyPoints: ["首屏 SSR/骨架屏+懒加载", "滚动虚拟列表+passive 监听", "动画用 transform/opacity 走合成层"],
    followUps: ["passive: true 为什么能提升滚动性能？", "如何检测移动端长任务？"],
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
