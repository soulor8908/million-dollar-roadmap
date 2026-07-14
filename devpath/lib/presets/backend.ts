// lib/presets/backend.ts
// 后端工程师面试全攻略预设：15 知识节点 + 35 道高频面试题 + 学习计划
// 覆盖：Java/Python/Go 语言、Spring/Django/FastAPI 框架、MySQL/Redis、
//       消息队列、微服务、分布式、系统设计

import type { KnowledgeNode, Question, ScheduleItem } from "../types";

const BACKEND_NODES: KnowledgeNode[] = [
  {
    id: "be-java-basic",
    title: "Java 基础",
    difficulty: 2,
    prerequisites: [],
    frequency: "高",
    summary: "集合（List/Set/Map）、IO/NIO、并发基础、JVM 常识、面向对象与泛型。",
    mastery: 0,
  },
  {
    id: "be-java-concurrent",
    title: "Java 并发",
    difficulty: 4,
    prerequisites: ["be-java-basic"],
    frequency: "高",
    summary: "线程池、synchronized 与 Lock、CAS、AQS、ConcurrentHashMap、ThreadLocal、volatile。",
    mastery: 0,
  },
  {
    id: "be-jvm",
    title: "JVM",
    difficulty: 4,
    prerequisites: ["be-java-basic"],
    frequency: "高",
    summary: "内存模型（堆/栈/方法区）、GC 算法与收集器、类加载机制、调优（jstat/jmap）。",
    mastery: 0,
  },
  {
    id: "be-spring",
    title: "Spring 框架",
    difficulty: 3,
    prerequisites: ["be-java-basic"],
    frequency: "高",
    summary: "IoC/DI、AOP（动态代理）、声明式事务、Spring Boot 自动配置、Spring MVC。",
    mastery: 0,
  },
  {
    id: "be-orm",
    title: "MyBatis/JPA",
    difficulty: 3,
    prerequisites: ["be-spring"],
    frequency: "中",
    summary: "ORM 映射、一二级缓存、动态 SQL、#{} 与 ${}、JPA Repository。",
    mastery: 0,
  },
  {
    id: "be-python-basic",
    title: "Python 基础",
    difficulty: 2,
    prerequisites: [],
    frequency: "中",
    summary: "GIL、装饰器、生成器、asyncio 异步、元类、垃圾回收（引用计数 + 分代）。",
    mastery: 0,
  },
  {
    id: "be-python-web",
    title: "Python Web",
    difficulty: 3,
    prerequisites: ["be-python-basic"],
    frequency: "中",
    summary: "Django（MTV/ORM/Admin）、Flask（轻量/蓝图）、FastAPI（异步/Pydantic/OpenAPI）。",
    mastery: 0,
  },
  {
    id: "be-go-basic",
    title: "Go 基础",
    difficulty: 2,
    prerequisites: [],
    frequency: "高",
    summary: "goroutine、channel、interface 隐式实现、错误处理（error/panic）、slice/map 底层。",
    mastery: 0,
  },
  {
    id: "be-go-concurrent",
    title: "Go 并发",
    difficulty: 4,
    prerequisites: ["be-go-basic"],
    frequency: "高",
    summary: "sync（Mutex/WaitGroup/Once）、Context 取消、select 多路复用、并发模式（fan-in/worker pool）。",
    mastery: 0,
  },
  {
    id: "be-mysql",
    title: "数据库 MySQL",
    difficulty: 4,
    prerequisites: [],
    frequency: "高",
    summary: "B+ 树索引、事务隔离级别、MVCC、行锁/间隙锁、explain 执行计划优化。",
    mastery: 0,
  },
  {
    id: "be-redis",
    title: "Redis",
    difficulty: 4,
    prerequisites: [],
    frequency: "高",
    summary: "五大数据结构、持久化（RDB/AOF）、主从哨兵/Cluster、缓存策略与一致性问题。",
    mastery: 0,
  },
  {
    id: "be-mq",
    title: "消息队列",
    difficulty: 4,
    prerequisites: [],
    frequency: "高",
    summary: "Kafka（分区/副本/顺序）、RabbitMQ（路由模型）、可靠性、顺序性、幂等性。",
    mastery: 0,
  },
  {
    id: "be-microservice",
    title: "微服务",
    difficulty: 4,
    prerequisites: ["be-spring"],
    frequency: "高",
    summary: "Spring Cloud、服务注册发现（Nacos/Eureka）、熔断降级（Sentinel）、网关（Gateway）。",
    mastery: 0,
  },
  {
    id: "be-distributed",
    title: "分布式",
    difficulty: 5,
    prerequisites: ["be-microservice"],
    frequency: "高",
    summary: "CAP/BASE、Raft/Paxos 一致性算法、分布式锁、分布式事务（2PC/TCC/Seata）。",
    mastery: 0,
  },
  {
    id: "be-system-design",
    title: "系统设计",
    difficulty: 5,
    prerequisites: ["be-distributed"],
    frequency: "高",
    summary: "限流（令牌桶/漏桶）、降级、分库分表、读写分离、设计模式、高可用架构。",
    mastery: 0,
  },
];

const BACKEND_QUESTIONS: Question[] = [
  // ===== Java 基础 =====
  {
    id: "be-1",
    nodeId: "be-java-basic",
    question: "HashMap 的底层原理？JDK 1.8 相比 1.7 有什么改进？",
    answer: `JDK 1.7：数组 + 链表，头插法（多线程可能成环导致死循环）。
JDK 1.8：数组 + 链表 + 红黑树（链表长度 ≥8 且数组 ≥64 转红黑树，≤6 退化为链表），尾插法。

put 流程：
1. hash(key) 扰动（高 16 位异或低 16 位）减少冲突。
2. (n-1) & hash 定位桶，空则直接放。
3. 冲突则：链表尾插（或红黑树插入）。
4. 超过阈值（capacity × 0.75）扩容（2 倍，重哈希）。

关键：扩容时 1.8 用高位 bit 判断新位置（原位置或原位置+oldCap），无需重算 hash，效率更高。`,
    keyPoints: ["数组+链表+红黑树", "1.8 尾插法避免死循环", "扩容 2 倍 + 高位 bit 判位置"],
    followUps: ["HashMap 为什么线程不安全？ConcurrentHashMap 怎么解决？", "负载因子为什么是 0.75？"],
    favorited: false,
  },
  {
    id: "be-2",
    nodeId: "be-java-basic",
    question: "ArrayList 和 LinkedList 的区别？各自适合什么场景？",
    answer: `ArrayList：基于动态数组，随机访问 O(1)，尾部插入均摊 O(1)，中间插入/删除 O(n)（需搬移）。
LinkedList：基于双向链表，随机访问 O(n)，头尾插入/删除 O(1)，中间需先遍历到位置。

场景：
- 频繁随机访问、尾部增删 → ArrayList（默认推荐）。
- 频繁头/中间增删 → LinkedList（但实际因缓存友好性，ArrayList 往往仍更快）。

关键：LinkedList 实现了 Deque，可当队列/栈用；ArrayList 扩容 1.5 倍，System.arraycopy 搬迁。`,
    keyPoints: ["ArrayList 数组随机访问 O(1)", "LinkedList 链表头尾增删 O(1)", "实际 ArrayList 缓存更友好"],
    followUps: ["ArrayList 扩容机制？", "Vector 和 ArrayList 区别？"],
    favorited: false,
  },
  {
    id: "be-3",
    nodeId: "be-java-basic",
    question: "Java 中 == 和 equals 的区别？String s = new String(\"a\") 创建了几个对象？",
    answer: `==：比较引用地址（基本类型比较值）。
equals：默认也是比较地址（Object），String/Integer 等重写后比较内容。

String s = new String("a")：
- 若常量池无 "a"：创建 2 个对象（堆中 new 的 + 常量池的 "a"）。
- 若常量池已有 "a"：创建 1 个对象（堆中 new 的）。

字符串常量池：JDK 1.7 后移到堆，intern() 可将字符串入池并返回池中引用。

\`\`\`java
String a = "ab";           // 常量池
String b = new String("ab"); // 堆 + 常量池
a == b;          // false（地址不同）
a.equals(b);     // true（内容相同）
b.intern() == a; // true（intern 返回常量池引用）
\`\`\``,
    keyPoints: ["== 比地址，equals 比内容", "new String 可能创建 2 个对象", "intern() 入常量池"],
    followUps: ["String 为什么设计成不可变？", "StringBuilder 和 StringBuffer 区别？"],
    favorited: false,
  },
  // ===== Java 并发 =====
  {
    id: "be-4",
    nodeId: "be-java-concurrent",
    question: "线程池的核心参数？拒绝策略有哪些？",
    answer: `ThreadPoolExecutor 七参数：
- corePoolSize：核心线程数。
- maximumPoolSize：最大线程数。
- keepAliveTime：空闲线程存活时间。
- unit：时间单位。
- workQueue：任务队列（LinkedBlockingQueue / ArrayBlockingQueue / SynchronousQueue）。
- threadFactory：线程工厂。
- handler：拒绝策略。

执行流程：核心线程满 → 入队列 → 队列满 → 开到最大线程 → 仍满 → 拒绝。

四种拒绝策略：
1. AbortPolicy（默认）：抛 RejectedExecutionException。
2. CallerRunsPolicy：由提交线程执行（降级，不丢任务）。
3. DiscardPolicy：静默丢弃。
4. DiscardOldestPolicy：丢弃队列最老任务，重试。

关键：Executors.newFixedThreadPool 用无界队列，易 OOM，生产推荐手动构造 ThreadPoolExecutor。`,
    keyPoints: ["七参数 + 执行流程", "核心→队列→最大→拒绝", "禁用 Executors，手动构造防 OOM"],
    followUps: ["为什么阿里规约禁止用 Executors？", "如何合理设置线程数（CPU 密集 vs IO 密集）？"],
    favorited: false,
  },
  {
    id: "be-5",
    nodeId: "be-java-concurrent",
    question: "synchronized 和 ReentrantLock 的区别？",
    answer: `1. 实现：synchronized 是 JVM 关键字（monitorenter/monitorexit）；ReentrantLock 是 JDK API（AQS）。
2. 灵活性：ReentrantLock 可公平/非公平、可中断（lockInterruptibly）、可超时（tryLock）、多 Condition。
3. 锁释放：synchronized 自动释放；ReentrantLock 必须 finally 手动 unlock。
4. 性能：JDK 1.6 后 synchronized 有锁升级（偏向→轻量→重量），性能接近，简单场景优先 synchronized。

\`\`\`java
ReentrantLock lock = new ReentrantLock(true); // 公平锁
lock.lock();
try {
  // 临界区
} finally {
  lock.unlock(); // 必须手动释放
}
\`\`\`

关键：复杂需求（可中断/超时/多条件）用 ReentrantLock；否则 synchronized 更简洁。`,
    keyPoints: ["synchronized JVM 层自动释放", "ReentrantLock API 层手动释放", "锁升级：偏向→轻量→重量"],
    followUps: ["AQS 的原理？", "什么是乐观锁/悲观锁？CAS 的 ABA 问题？"],
    favorited: false,
  },
  {
    id: "be-6",
    nodeId: "be-java-concurrent",
    question: "ConcurrentHashMap 在 JDK 1.8 的实现原理？",
    answer: `JDK 1.7：Segment 分段锁（默认 16 段，每段一个 ReentrantLock），并发度 = 段数。
JDK 1.8：Node 数组 + 链表/红黑树，锁粒度细化到桶（首节点）。

put 流程：
1. 计算 hash 定位桶。
2. 桶空：CAS 写入（无锁）。
3. 桶非空：synchronized 锁首节点，插入链表/红黑树。
4. 链表 ≥8 转红黑树。

size：用 baseCount + CounterCell 数组累加（类似 LongAdder），减少竞争。

关键：1.8 摒弃分段锁，用 CAS + synchronized 细化锁粒度，并发度更高；扩容支持多线程协助迁移。`,
    keyPoints: ["1.8 锁桶首节点（CAS+synchronized）", "摒弃分段锁，并发度更高", "size 用 CounterCell 分散计数"],
    followUps: ["ConcurrentHashMap 的 put 为什么不全用 CAS？", "扩容时如何多线程协助？"],
    favorited: false,
  },
  // ===== JVM =====
  {
    id: "be-7",
    nodeId: "be-jvm",
    question: "JVM 运行时内存区域划分？哪些是线程私有的？",
    answer: `线程私有：
- 程序计数器：当前线程执行的字节码行号。
- 虚拟机栈：方法栈帧（局部变量表/操作数栈/动态链接）。
- 本地方法栈：Native 方法。

线程共享：
- 堆：对象实例，GC 主战场（新生代 Eden + S0 + S1，老年代）。
- 方法区（元空间 Metaspace，JDK 8+）：类信息、常量池、静态变量。

\`\`\`
| 线程私有       | 线程共享     |
| PC/栈/本地栈  | 堆 / 方法区  |
\`\`\`

关键：JDK 8 把永久代（PermGen）改为元空间（用本地内存），解决 OOM:PermGen；字符串常量池移到堆。`,
    keyPoints: ["PC/栈/本地栈 线程私有", "堆/方法区 线程共享", "JDK 8 永久代→元空间（本地内存）"],
    followUps: ["为什么用元空间替代永久代？", "StackOverflowError 和 OOM 区别？"],
    favorited: false,
  },
  {
    id: "be-8",
    nodeId: "be-jvm",
    question: "常见的 GC 算法和垃圾收集器？G1 的特点？",
    answer: `GC 算法：
1. 标记-清除：产生碎片。
2. 标记-复制：新生代用（Eden:S0:S1 = 8:1:1），无碎片但浪费空间。
3. 标记-整理：老年代用，无碎片但慢。
4. 分代收集：新生代复制，老年代整理。

可达性分析：从 GC Roots（栈引用/静态变量/常量/JNI）出发找存活对象。

收集器：Serial → ParNew → Parallel Scavenge → CMS（老年代，并发标记清除）→ G1 → ZGC（低延迟）。

G1 特点：
- 把堆分成多个 Region（默认 2048），逻辑分代物理不分代。
- 可预测停顿：优先回收垃圾最多的 Region（Garbage First）。
- 整体标记-整理 + 局部复制，无碎片。

关键：G1 适合大堆（6GB+），ZGC 停顿 <10ms，适合超大堆低延迟场景。`,
    keyPoints: ["分代：新生代复制/老年代整理", "G1 Region 化可预测停顿", "GC Roots 可达性分析"],
    followUps: ["如何判断对象可回收？", "CMS 为什么被废弃？G1 如何解决碎片？"],
    favorited: false,
  },
  // ===== Spring =====
  {
    id: "be-9",
    nodeId: "be-spring",
    question: "Spring IoC 的理解？Bean 的生命周期？",
    answer: `IoC（控制反转）：对象创建和依赖注入由容器管理，解耦。DI（依赖注入）是实现方式（构造器/setter/字段）。

Bean 生命周期：
1. 实例化（反射创建对象）。
2. 属性注入（populateBean，处理 @Autowired）。
3. Aware 回调（BeanNameAware/BeanFactoryAware）。
4. BeanPostProcessor.postProcessBeforeInitialization。
5. 初始化：@PostConstruct → InitializingBean.afterPropertiesSet → init-method。
6. BeanPostProcessor.postProcessAfterInitialization（AOP 代理在此生成）。
7. 使用。
8. 销毁：@PreDestroy → DisposableBean.destroy → destroy-method。

循环依赖：通过三级缓存（singletonObjects/earlySingletonObjects/singletonFactories）解决 setter 注入循环，构造器循环无法解决。

关键：AOP 代理在 postProcessAfterInitialization 阶段生成（AnnotationAwareAspectJAutoProxyCreator）。`,
    keyPoints: ["IoC 容器管理对象创建与注入", "七步生命周期", "三级缓存解决 setter 循环依赖"],
    followUps: ["为什么构造器循环依赖无法解决？", "@Autowired 和 @Resource 区别？"],
    favorited: false,
  },
  {
    id: "be-10",
    nodeId: "be-spring",
    question: "Spring AOP 的实现原理？JDK 动态代理和 CGLIB 的区别？",
    answer: `AOP（面向切面）：通过动态代理在方法前后织入增强逻辑（日志/事务/权限）。

术语：JoinPoint（连接点）、Pointcut（切点）、Advice（通知：Before/After/Around）、Aspect（切面）。

两种代理：
- JDK 动态代理：基于接口（Proxy.newProxyInstance），目标类需实现接口。
- CGLIB：基于继承（生成子类），无需接口，但 final 类/方法无法代理。

Spring 选择：有接口默认 JDK 代理；可配置 proxyTargetClass=true 强制 CGLIB。Spring Boot 2.x 默认 CGLIB。

\`\`\`java
// JDK 代理简化
Object proxy = Proxy.newProxyInstance(
  loader, new Class[]{Service.class},
  (p, method, args) -> {
    System.out.println("before");
    Object res = method.invoke(target, args);
    System.out.println("after");
    return res;
  });
\`\`\`

关键：@Transactional 失效常因自调用（同类方法调用不走代理）或非 public 方法。`,
    keyPoints: ["JDK 代理基于接口，CGLIB 基于继承", "Spring Boot 默认 CGLIB", "事务失效：自调用/非 public"],
    followUps: ["@Transactional 失效的场景有哪些？", "AOP 中 Around 通知怎么用？"],
    favorited: false,
  },
  {
    id: "be-11",
    nodeId: "be-spring",
    question: "Spring Boot 自动配置原理？",
    answer: `核心：@SpringBootApplication = @SpringBootConfiguration + @EnableAutoConfiguration + @ComponentScan。

@EnableAutoConfiguration 通过 @Import(AutoConfigurationImportSelector) 加载自动配置类。

流程：
1. AutoConfigurationImportSelector 读取 META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports（Boot 3.x，旧版 spring.factories）。
2. 列出所有 AutoConfiguration 类。
3. 每个配置类用 @Conditional 条件过滤（@ConditionalOnClass/OnBean/OnMissingBean/OnProperty）。
4. 满足条件才注册 Bean，实现"约定优于配置"。

\`\`\`java
@Configuration
@ConditionalOnClass(DataSource.class)
@EnableConfigurationProperties(DataSourceProperties.class)
public class DataSourceAutoConfiguration {
  @Bean
  @ConditionalOnMissingBean
  public DataSource dataSource(DataSourceProperties props) { /* ... */ }
}
\`\`\`

关键：自定义 starter 只需写 AutoConfiguration + imports 文件，用户引入依赖即生效。`,
    keyPoints: ["@EnableAutoConfiguration 加载 imports", "@Conditional 条件装配", "OnMissingBean 允许用户覆盖"],
    followUps: ["如何自定义一个 Starter？", "@ConditionalOnMissingBean 的作用？"],
    favorited: false,
  },
  // ===== MyBatis/JPA =====
  {
    id: "be-12",
    nodeId: "be-orm",
    question: "MyBatis 中 #{} 和 ${} 的区别？为什么 #{} 能防 SQL 注入？",
    answer: `#{}：预编译占位符，会生成 ?，参数用 PreparedStatement.setXxx 设置，自动转义，防 SQL 注入。
\${}：字符串拼接，直接替换到 SQL 中，有注入风险，仅用于表名/列名/排序字段等不能预编译的位置。

\`\`\`xml
<!-- 安全：预编译 -->
<select id="get">
  SELECT * FROM user WHERE id = #{id}
</select>
<!-- 动态表名：只能用 \${} -->
<select id="getByTable">
  SELECT * FROM \${tableName} WHERE id = #{id}
</select>
\`\`\`

MyBatis 一级缓存：SqlSession 级别（默认开启），同 session 相同查询命中缓存。
二级缓存：Mapper 级别（namespace），需手动开启，分布式下有脏读问题，生产多用 Redis 替代。

关键：#{} 预编译防注入；\${} 拼接仅用于结构性参数且需校验白名单。`,
    keyPoints: ["#{} 预编译防注入", "${} 拼接用于表名/列名", "一级缓存 session 级，二级 namespace 级"],
    followUps: ["MyBatis 二级缓存在集群环境的脏读问题？", "动态 SQL 的 if/choose/foreach 用法？"],
    favorited: false,
  },
  {
    id: "be-13",
    nodeId: "be-orm",
    question: "JPA 的 N+1 问题是什么？如何解决？",
    answer: `N+1 问题：查询 N 条主实体后，对每条的关联属性单独发 1 次查询，共 N+1 次 SQL，性能差。

示例：查 10 个 Order，每个 Order 关联 User，默认 lazy 加载会触发 10 次查 User。

解决：
1. JOIN FETCH（JPQL）：一次 join 查出关联。
   \`\`\`jpql
   SELECT o FROM Order o JOIN FETCH o.user
   \`\`\`
2. @EntityGraph：声明抓取图，一次查询带出指定关联。
3. 批量查询：@BatchSize(size=50)，in 查询一次取多条关联。
4. 改为 eager？不推荐，影响所有查询。

关键：N+1 根因是延迟加载逐条触发；JOIN FETCH 用一条 SQL 解决，最常用。`,
    keyPoints: ["N+1：主查询后逐条查关联", "JOIN FETCH 一条 SQL 解决", "@EntityGraph 声明抓取图"],
    followUps: ["lazy 和 eager 加载的权衡？", "MyBatis 会遇到 N+1 吗？怎么避免？"],
    favorited: false,
  },
  // ===== Python 基础 =====
  {
    id: "be-14",
    nodeId: "be-python-basic",
    question: "Python GIL 是什么？对多线程的影响？如何绕过？",
    answer: `GIL（全局解释器锁，CPython）：同一时刻只有一个线程执行 Python 字节码，导致多线程无法利用多核做 CPU 密集任务。

影响：
- CPU 密集型：多线程无加速（甚至更慢，线程切换开销）。
- IO 密集型：多线程有效（IO 时释放 GIL，其他线程可执行）。

绕过：
1. multiprocessing：多进程，每进程独立 GIL（推荐 CPU 密集）。
2. C 扩展：numpy/计算库在 C 层释放 GIL。
3. Jython/IronPython：无 GIL（但生态差）。
4. asyncio：单线程并发，IO 密集高效。

\`\`\`python
from multiprocessing import Pool
with Pool(4) as p:
    results = p.map(heavy_task, range(100))  # 真并行
\`\`\`

关键：GIL 是 CPython 历史设计，IO 多用多线程/asyncio，CPU 多用多进程。`,
    keyPoints: ["GIL 同一时刻单线程执行字节码", "CPU 密集用多进程", "IO 密集多线程/asyncio 有效"],
    followUps: ["asyncio 的事件循环原理？", "为什么 GIL 不直接移除？"],
    favorited: false,
  },
  {
    id: "be-15",
    nodeId: "be-python-basic",
    question: "装饰器的原理？写一个带参数的计时装饰器。",
    answer: `装饰器本质是高阶函数：接收函数返回新函数，在不改原函数的前提下增加功能（@语法糖等价 func = deco(func)）。

带参数装饰器需要三层嵌套：参数层 → 装饰器层 → 包装层。

\`\`\`python
import time
from functools import wraps

def timer(label="cost"):
    def decorator(func):
        @wraps(func)  # 保留原函数元信息
        def wrapper(*args, **kwargs):
            start = time.time()
            result = func(*args, **kwargs)
            print(f"{label}: {func.__name__} {time.time()-start:.3f}s")
            return result
        return wrapper
    return decorator

@timer(label="耗时")  # 等价 myfunc = timer("耗时")(myfunc)
def myfunc(): ...
\`\`\`

关键：@wraps 保留 __name__/__doc__；类装饰器实现 __call__；functools.lru_cache 是常用缓存装饰器。`,
    keyPoints: ["装饰器 = 高阶函数", "带参数需三层嵌套", "@wraps 保留元信息"],
    followUps: ["类装饰器怎么写？", "functools.lru_cache 原理？"],
    favorited: false,
  },
  // ===== Python Web =====
  {
    id: "be-16",
    nodeId: "be-python-web",
    question: "Django、Flask、FastAPI 的定位和选型？",
    answer: `Django：全栈框架（"batteries included"）。
- 自带 ORM/Admin/表单/认证/中间件/模板，开箱即用。
- 同步为主（4.x 支持异步但生态有限）。
- 适合内容型/管理后台/CMS。

Flask：微框架。
- 只保留核心（路由/请求响应），扩展自选（SQLAlchemy/Flask-Login）。
- 灵活，适合中小项目/原型。

FastAPI：现代异步框架。
- 基于 asyncio + Pydantic 类型校验，自动生成 OpenAPI 文档。
- 性能接近 Go/Node（Starlette + uvicorn）。
- 适合 API 服务、高并发 IO 场景。

\`\`\`python
# FastAPI 示例
from fastapi import FastAPI
from pydantic import BaseModel
app = FastAPI()
class Item(BaseModel):
    name: str
    price: float
@app.post("/items")
async def create(item: Item):
    return item  # 自动类型校验 + 文档
\`\`\`

选型：内容站选 Django，微服务 API 选 FastAPI，灵活小项目选 Flask。`,
    keyPoints: ["Django 全栈同步", "Flask 微框架灵活", "FastAPI 异步 + 类型校验 + 自动文档"],
    followUps: ["FastAPI 为什么快？", "Django ORM 和 SQLAlchemy 区别？"],
    favorited: false,
  },
  {
    id: "be-17",
    nodeId: "be-python-web",
    question: "WSGI 和 ASGI 的区别？为什么 FastAPI 用 ASGI？",
    answer: `WSGI（Web Server Gateway Interface）：Python 同步 Web 标准（PEP 3333）。
- 每请求一个同步处理，阻塞等待 IO 时线程挂起。
- 服务器：uWSGI/gunicorn（sync workers）。
- 适合同步框架（Django 传统/Flask）。

ASGI（Asynchronous Server Gateway Interface）：异步标准。
- 支持 async/await，单线程内协程并发处理多请求，IO 不阻塞。
- 兼容 WSGI（可跑同步应用）。
- 服务器：uvicorn/hypercorn/daphne。
- 适合 FastAPI/Starlette/Django Channels。

为什么 FastAPI 用 ASGI：基于 asyncio 实现 IO 并发，单进程可处理大量连接，吞吐远高于 WSGI 同步模型。

关键：WSGI 同步一请求一线程；ASGI 异步协程并发，IO 密集场景吞吐高。`,
    keyPoints: ["WSGI 同步，ASGI 异步", "ASGI 兼容 WSGI", "uvicorn 是 ASGI 服务器"],
    followUps: ["gunicorn + uvicorn worker 是什么模式？", "Django 如何同时支持 WSGI/ASGI？"],
    favorited: false,
  },
  // ===== Go 基础 =====
  {
    id: "be-18",
    nodeId: "be-go-basic",
    question: "Go 中 slice 的底层结构？append 扩容规则？",
    answer: `slice 底层是一个结构体（runtime.slice）：
\`\`\`go
type slice struct {
  array unsafe.Pointer // 指向底层数组
  len   int            // 长度
  cap   int            // 容量
}
\`\`\`

append 扩容规则（Go 1.18+）：
- 若需要的 cap > 2×oldcap，新 cap = 需要值。
- 否则若 oldcap < 256，新 cap = 2×oldcap。
- 否则新 cap = oldcap + oldcap/4 + 192（平滑增长，避免大 slice 翻倍浪费）。

关键陷阱：
1. 多个 slice 共享底层数组，修改会影响彼此。
2. append 超过 cap 会分配新数组，原 slice 不感知。
3. 大 slice 截取后，底层数组无法 GC（用 copy 或 s[:n:n] 限定 cap）。

\`\`\`go
s := make([]int, 0, 3)
s = append(s, 1, 2, 3) // 未扩容，写入预分配
s = append(s, 4)        // 扩容，分配新数组
\`\`\``,
    keyPoints: ["slice = ptr + len + cap", "扩容：<256 翻倍，之后平滑增长", "共享底层数组的陷阱"],
    followUps: ["如何避免 slice 内存泄漏？", "make([]T, len) 和 make([]T, len, cap) 区别？"],
    favorited: false,
  },
  {
    id: "be-19",
    nodeId: "be-go-basic",
    question: "Go 的 interface 是如何实现的？为什么说鸭子类型？",
    answer: `Go interface 是隐式实现：类型只要实现了 interface 定义的全部方法，就自动满足该 interface，无需显式声明（鸭子类型）。

底层结构：
- iface（非空接口）：(*itab, data)，itab 含接口类型、实际类型、方法表。
- eface（空接口 interface{}）：(*_type, data)。

\`\`\`go
type Speaker interface { Speak() string }

type Dog struct{}
func (Dog) Speak() string { return "woof" }

var s Speaker = Dog{} // 隐式实现
\`\`\`

关键点：
1. 值接收者 vs 指针接收者：指针接收者实现的方法，只有指针类型满足 interface。
2. interface 内部存 (类型, 值)，nil 判断要小心（interface != nil 当类型非 nil 时即使值为 nil 也非 nil）。
3. 类型断言：v, ok := i.(T)；type switch 做多类型分支。

关键：Go 的隐式接口解耦了定义与实现，便于组合与测试（mock）。`,
    keyPoints: ["隐式实现（鸭子类型）", "iface 含 itab 方法表", "值接收者 vs 指针接收者影响 interface 满足"],
    followUps: ["interface 值为 nil 但 interface 本身非 nil 的问题？", "空接口和 any 的关系（Go 1.18）？"],
    favorited: false,
  },
  // ===== Go 并发 =====
  {
    id: "be-20",
    nodeId: "be-go-concurrent",
    question: "Go 中 goroutine 和 channel 的关系？为什么不要通过共享内存通信？",
    answer: `Go 并发哲学："不要通过共享内存通信，而通过通信共享内存"（Do not communicate by sharing memory; instead, share memory by communicating）。

goroutine：轻量级协程（~2KB 栈，可动态增长），由 Go runtime 调度（GMP 模型：G goroutine / M 线程 / P 处理器）。

channel：goroutine 间通信的管道，类型安全，自带同步。

\`\`\`go
// 生产者-消费者
ch := make(chan int, 3) // 带缓冲
go func() { ch <- 1; close(ch) }()
for v := range ch { fmt.Println(v) } // close 后 range 自动退出
\`\`\`

对比共享内存 + 锁：
- 共享内存：需 sync.Mutex 保护，易死锁、竞态。
- channel：天然同步（无缓冲发送阻塞直到接收），更安全、表达力强。

关键：无缓冲 channel 同步通信；有缓冲 channel 异步解耦；close 通知接收方结束。`,
    keyPoints: ["GMP 调度模型", "channel 通信代替共享内存", "无缓冲同步/有缓冲解耦"],
    followUps: ["GMP 模型中 P 的作用？", "channel 底层数据结构？发送/接收如何阻塞？"],
    favorited: false,
  },
  {
    id: "be-21",
    nodeId: "be-go-concurrent",
    question: "Context 的作用？如何用 Context 做超时和取消？",
    answer: `Context 用于在 goroutine 间传递截止时间/取消信号/请求范围值，解决 goroutine 泄漏。

核心方法：
- context.WithCancel(parent)：手动取消。
- context.WithTimeout(parent, dur)：超时自动取消。
- context.WithValue(parent, k, v）：传值（谨慎用，非传参手段）。

\`\`\`go
func handler(ctx context.Context) {
  ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
  defer cancel() // 退出时释放资源

  select {
  case <-work(ctx):
    fmt.Println("done")
  case <-ctx.Done():
    fmt.Println("timeout/cancel:", ctx.Err())
  }
}

func work(ctx context.Context) <-chan struct{} {
  ch := make(chan struct{})
  go func() {
    defer close(ch)
    // 每步检查 ctx 是否取消
    select {
    case <-time.After(5 * time.Second):
    case <-ctx.Done():
      return
    }
  }()
  return ch
}
\`\`\`

关键：Context 沿调用链传递，cancel 时所有子 context 一起取消，goroutine 应在 select 中监听 ctx.Done() 及时退出。`,
    keyPoints: ["Context 传取消/超时/值", "WithTimeout 超时取消", "select 监听 ctx.Done()"],
    followUps: ["Context 如何防止 goroutine 泄漏？", "WithValue 为什么不推荐传业务参数？"],
    favorited: false,
  },
  // ===== MySQL =====
  {
    id: "be-22",
    nodeId: "be-mysql",
    question: "MySQL InnoDB 为什么用 B+ 树做索引？相比 B 树/Hash/红黑树的优势？",
    answer: `B+ 树优势：
1. 非叶子节点只存索引不存数据，单页能放更多 key，树更矮，磁盘 IO 少（3 层可存千万级）。
2. 叶子节点用双向链表相连，范围查询高效（定位起点后顺序遍历）。
3. 数据稳定有序，等值/范围/排序都高效。

对比：
- B 树：非叶子也存数据，单页 key 少树更高；范围查询需回溯。
- Hash：等值 O(1) 极快，但不支持范围查询和排序。
- 红黑树：二叉，树高远大于 B+（千万级约 20+ 层），IO 次数多。

聚簇索引（InnoDB 主键）：叶子节点存整行数据。
二级索引：叶子存主键，需回表（用主键再查聚簇索引）。

关键：B+ 树为磁盘存储优化，矮树 + 叶子链表兼顾等值和范围查询。`,
    keyPoints: ["非叶只存 key 树矮 IO 少", "叶子链表范围查询快", "二级索引需回表"],
    followUps: ["什么是回表？如何用覆盖索引避免？", "为什么建议主键自增？"],
    favorited: false,
  },
  {
    id: "be-23",
    nodeId: "be-mysql",
    question: "MySQL 事务的隔离级别？MVCC 原理？",
    answer: `四个隔离级别：
1. 读未提交（READ UNCOMMITTED）：脏读。
2. 读已提交（READ COMMITTED）：解决脏读，有不可重复读。Oracle 默认。
3. 可重复读（REPEATABLE READ）：解决不可重复读，InnoDB 默认，用间隙锁解决幻读。
4. 串行化（SERIALIZABLE）：最高隔离，性能差。

MVCC（多版本并发控制）：通过隐藏列（trx_id 事务ID、roll_pointer 回滚指针）+ undo log 版本链实现快照读，读不加锁。

ReadView（读视图）：包含当前活跃事务列表。判断版本可见性：
- trx_id < min_trx：已提交，可见。
- trx_id > max_trx：未来事务，不可见。
- 在活跃列表中：未提交，不可见，沿 undo log 找上一版本。

RC：每次 SELECT 生成新 ReadView（能看到新提交）。
RR：事务首次 SELECT 生成 ReadView 并复用（保证可重复读）。

关键：MVCC 只对快照读（普通 SELECT）有效；当前读（SELECT ... FOR UPDATE / UPDATE）用锁。`,
    keyPoints: ["四个级别 + RR 默认", "MVCC = 版本链 + ReadView", "RC 每次/RR 首次生成 ReadView"],
    followUps: ["快照读和当前读区别？", "间隙锁如何解决幻读？"],
    favorited: false,
  },
  {
    id: "be-24",
    nodeId: "be-mysql",
    question: "如何用 explain 分析 SQL？索引失效的常见场景？",
    answer: `explain 关键字段：
- type：访问类型，从好到差：const > eq_ref > ref > range > index > ALL（全表扫描，需优化）。
- key：实际用的索引；key_len：索引使用长度（判断联合索引用了几列）。
- rows：估算扫描行数。
- Extra：Using index（覆盖索引好）、Using filesort（需优化）、Using temporary（需优化）。

索引失效场景：
1. 对索引列做函数/运算：WHERE YEAR(create_time) = 2024。
2. 隐式类型转换：字符串列 WHERE phone = 13800000000（数字）。
3. LIKE 左模糊：WHERE name LIKE '%abc'。
4. OR 连接非索引列。
5. 联合索引未遵循最左前缀。
6. != / NOT IN / IS NOT NULL（部分情况）。

优化：建联合索引覆盖查询列，避免回表；大分页用游标 WHERE id > last_id LIMIT 10。

关键：type=ALL、Extra 出现 filesort/temporary 通常需优化。`,
    keyPoints: ["type 越靠左越好，ALL 需优化", "索引失效：函数/隐式转换/左模糊", "联合索引最左前缀"],
    followUps: ["什么是覆盖索引和回表？", "大分页 LIMIT 1000000,10 如何优化？"],
    favorited: false,
  },
  // ===== Redis =====
  {
    id: "be-25",
    nodeId: "be-redis",
    question: "Redis 五大基础数据结构及底层实现？",
    answer: `1. String：SDS（动态字符串，O(1) 取长度，二进制安全，预分配减少扩容）。
2. List：quicklist（双向链表 + ziplist/listpack 节点，兼顾内存和效率）。
3. Hash：listpack（小） / hashtable（大，渐进式 rehash）。
4. Set：intset（纯整数） / hashtable。
5. ZSet（有序集合）：listpack（小） / skiplist + hashtable（大，跳表支持范围查询 O(logN)，hashtable 支持等值 O(1)）。

\`\`\`redis
ZADD rank 100 alice 90 bob
ZRANGE rank 0 -1 WITHSCORES   # 升序
ZRANGEBYSCORE rank 80 100     # 按分数范围
\`\`\`

高级结构：HyperLogLog（基数统计）、Bitmap（位图）、Stream（消息流）、Geo（地理位置）。

关键：ZSet 用跳表而非红黑树，因实现简单、范围查询友好、并发友好（局部修改）。`,
    keyPoints: ["String=SDS，ZSet=skiplist+hashtable", "小数据用 listpack 压缩省内存", "渐进式 rehash 避免阻塞"],
    followUps: ["为什么 ZSet 用跳表不用红黑树？", "渐进式 rehash 过程？"],
    favorited: false,
  },
  {
    id: "be-26",
    nodeId: "be-redis",
    question: "Redis 持久化 RDB 和 AOF 的区别？如何选择？",
    answer: `RDB（快照）：
- 某时刻全量数据二进制压缩文件，体积小恢复快。
- 触发：save（阻塞）/ bgsave（fork 子进程，COW）。
- 缺点：宕机丢失上次快照后的数据。

AOF（追加日志）：
- 记录每条写命令，文本格式，可读。
- 刷盘策略：always（每条 fsync，最安全最慢）/ everysec（默认，每秒）/ no（OS 决定）。
- AOF 重写：fork 子进程，按当前状态生成最小命令集，压缩文件。
- 缺点：文件大、恢复慢。

Redis 4.0+ 混合持久化：AOF 重写时前半段写 RDB 二进制，后半段追加增量 AOF 命令，兼顾恢复速度和数据安全。

选择：仅缓存可 RDB；数据重要用 AOF（everysec）+ RDB；生产推荐混合持久化。

关键：RDB 恢复快但可能丢数据；AOF 安全但慢；混合持久化两全。`,
    keyPoints: ["RDB 快照恢复快可能丢", "AOF 日志安全但慢", "混合持久化 RDB+AOF 兼顾"],
    followUps: ["AOF 重写过程？fork 期间写入命令怎么处理？", "bgsave 的 COW 原理？"],
    favorited: false,
  },
  {
    id: "be-27",
    nodeId: "be-redis",
    question: "缓存穿透/击穿/雪崩 的区别和解决方案？",
    answer: `缓存穿透：查询不存在的数据（如恶意攻击 id=-1），缓存和 DB 都没有，每次穿透到 DB。
解决：
1. 缓存空值（设短 TTL，如 60s）。
2. 布隆过滤器拦截非法 key。

缓存击穿：单个热点 key 过期瞬间，大量并发请求打到 DB。
解决：
1. 互斥锁（setnx）重建缓存，其他请求等待。
2. 热点 key 永不过期（逻辑过期，后台异步刷新）。

缓存雪崩：大量 key 同时过期或 Redis 宕机，请求全打 DB。
解决：
1. TTL 加随机值打散。
2. 多级缓存（本地 Caffeine + Redis）。
3. Redis 集群高可用 + 限流降级。

\`\`\`java
// 互斥锁防击穿
String val = redis.get(key);
if (val == null) {
  if (redis.setnx(lockKey, "1", 10)) {
    try { val = db.get(key); redis.set(key, val, 300); } finally { redis.del(lockKey); }
  } else { Thread.sleep(50); return get(key); } // 重试
}
\`\`\`

关键：穿透=查不存在（空值/布隆）；击穿=热点过期（互斥锁）；雪崩=大量过期（随机TTL+集群）。`,
    keyPoints: ["穿透：空值+布隆过滤器", "击穿：互斥锁/永不过期", "雪崩：随机TTL+多级缓存+限流"],
    followUps: ["布隆过滤器原理？能否删除？", "如何保证缓存与 DB 一致性？"],
    favorited: false,
  },
  // ===== 消息队列 =====
  {
    id: "be-28",
    nodeId: "be-mq",
    question: "Kafka 如何保证消息不丢失？高吞吐的原因？",
    answer: `不丢失三端保障：
1. 生产者：acks=all（所有 ISR 副本确认）+ 重试 + 幂等（enable.idempotence）+ 事务。
2. Broker：副本机制（replication.factor≥3, min.insync.replicas≥2）+ 磁盘持久化。
3. 消费者：手动提交 offset（关闭 enable.auto.commit），处理完业务再 commit。

高吞吐原因：
1. 顺序写磁盘（append，速度接近内存）。
2. 零拷贝（sendfile，数据不进用户态）。
3. 批量发送 + 压缩（gzip/snappy/lz4）。
4. 分区并行（多 partition 并行读写）。
5. PageCache 利用操作系统缓存。

关键：Kafka 用追加写 + 零拷贝 + 批量压缩实现百万级 TPS；acks=all + 副本保证可靠性。`,
    keyPoints: ["acks=all + 副本保证可靠", "顺序写+零拷贝+批量压缩高吞吐", "消费者手动提交 offset"],
    followUps: ["Kafka 如何保证消息顺序性？", "ISR 机制是什么？"],
    favorited: false,
  },
  {
    id: "be-29",
    nodeId: "be-mq",
    question: "如何保证消息的幂等性（不重复消费）？",
    answer: `MQ 的 exactly-once 难保证，网络重试/消费者重启会导致重复投递，需消费端做幂等。

方案：
1. 唯一约束：业务主键/唯一 ID 写 DB，利用唯一索引防重。
2. 去重表：处理前查去重表（message_id），已处理则跳过。
3. Redis SETNX：用 message_id 作 key，设 NX + TTL，处理成功标记。
4. 状态机：业务状态只能单向流转（如 待支付→已支付），重复消息因状态不满足被拒。
5. 乐观锁：UPDATE ... WHERE version = ?，重复更新影响 0 行。

\`\`\`java
// 去重表 + 事务
@Transactional
public void consume(Message msg) {
  if (dedupDao.exists(msg.getId())) return; // 已处理
  doBusiness(msg);
  dedupDao.insert(msg.getId()); // 同事务内记录
}
\`\`\`

关键：幂等键要全局唯一（业务 ID + 消息 ID），去重操作与业务操作在同一事务内。`,
    keyPoints: ["唯一约束/去重表防重", "Redis SETNX + TTL", "状态机/乐观锁天然幂等"],
    followUps: ["Kafka 生产者幂等原理？", "如何处理消息积压？"],
    favorited: false,
  },
  // ===== 微服务 =====
  {
    id: "be-30",
    nodeId: "be-microservice",
    question: "服务注册与发现原理？Nacos 和 Eureka 区别？",
    answer: `原理：
1. 服务启动时向注册中心注册（IP + 端口 + 元数据）。
2. 消费者从注册中心拉取服务列表并缓存本地。
3. 心跳续约：服务定时发心跳，超时未续约则剔除。
4. 注册中心变更通知消费者（push 或定时 pull）。

Eureka（AP）：
- 最终一致，节点间复制异步，保证可用性。
- 客户端缓存，注册中心挂了仍能调用（兜底）。
- 自我保护模式（心跳比例低时不再剔除，防网络分区误删）。

Nacos（AP/CP 可切换）：
- 默认 AP（临时实例，心跳），支持 CP（永久实例，Raft 强一致）。
- 自带配置中心（动态配置推送）。
- 支持健康检查、权重路由。
- Spring Cloud Alibaba 生态。

关键：AP 保证高可用（注册中心宕机不影响调用），CP 保证强一致。微服务多选 AP。`,
    keyPoints: ["注册+心跳+客户端缓存", "Eureka AP + 自我保护", "Nacos AP/CP 可切换 + 配置中心"],
    followUps: ["AP 和 CP 在服务发现场景如何取舍？", "Nacos 如何实现配置动态推送？"],
    favorited: false,
  },
  {
    id: "be-31",
    nodeId: "be-microservice",
    question: "熔断降级的作用？Sentinel 的熔断策略？",
    answer: `熔断降级：当下游服务故障/慢时，快速失败而非级联等待，防止雪崩，保护系统可用性。

熔断器三态：
- Closed：正常调用，统计失败率。
- Open：失败率达阈值，直接拒绝请求（快速失败/降级），不再调用下游。
- Half-Open：超时后放少量请求试探，成功则回 Closed，失败则回 Open。

Sentinel 熔断策略：
1. 慢调用比例：RT 超阈值的请求比例达阈值触发。
2. 异常比例：异常比例达阈值触发。
3. 异常数：异常数达阈值触发。

\`\`\`java
@SentinelResource(value = "queryOrder", fallback = "queryOrderFallback")
public Order queryOrder(String id) {
  return orderService.get(id);
}
public Order queryOrderFallback(String id) {
  return new Order(id, "默认商品"); // 降级返回兜底
}
\`\`\`

关键：熔断保护调用方（快速失败）；降级提供兜底（返回默认值/缓存）；限流保护被调方（控制 QPS）。`,
    keyPoints: ["熔断三态 Closed/Open/Half-Open", "Sentinel 慢调用/异常比例/异常数", "熔断保护调用方，限流保护被调方"],
    followUps: ["熔断和限流的区别？", "Hystrix 和 Sentinel 区别？"],
    favorited: false,
  },
  // ===== 分布式 =====
  {
    id: "be-32",
    nodeId: "be-distributed",
    question: "CAP 理论和 BASE 理论？为什么分布式系统难以同时满足强一致？",
    answer: `CAP：一致性（Consistency）、可用性（Availability）、分区容错（Partition tolerance）三选二。
- 网络分区（P）必然存在，故实际在 C 和 A 间权衡。
- CP：分区时拒绝写入保证一致（ZooKeeper/etcd）。
- AP：分区时允许不一致保证可用（Eureka/Cassandra）。

BASE：Basically Available（基本可用）、Soft state（软状态）、Eventually consistent（最终一致）。
- CAP 的 AP 延伸，放弃强一致，追求最终一致，换取高可用。

为什么难强一致：
1. 网络延迟不可控，同步复制会拖慢写入。
2. 分区时部分节点不可达，强一致需牺牲可用性。
3. 分布式事务协调开销大（2PC 阻塞、性能差）。

实践：金融核心用 CP + 强一致（TCC/Saga）；互联网多用 AP + 最终一致（消息可靠投递）。

关键：CAP 是分区时的取舍；BASE 是 AP 的工程实践，最终一致是主流。`,
    keyPoints: ["CAP 分区时 C/A 二选一", "BASE = 基本可用+软状态+最终一致", "金融 CP / 互联网 AP"],
    followUps: ["Raft 如何保证一致性？", "2PC 和 3PC 区别？"],
    favorited: false,
  },
  {
    id: "be-33",
    nodeId: "be-distributed",
    question: "分布式锁的实现方式？Redis 和 ZooKeeper 分布式锁的区别？",
    answer: `三种主流实现：DB 唯一索引、Redis、ZooKeeper/etcd。

Redis 分布式锁（SETNX + 过期）：
\`\`\`redis
SET lock_key <requestId> NX PX 30000  # 加锁+过期原子
\`\`\`
- 释放锁用 Lua 脚本校验 requestId（防误删别人的锁）。
- 问题：锁过期但业务未完成 → Redisson 看门狗自动续期。
- Redlock：多个 Redis 节点多数加锁成功，防单点故障（争议较大）。

ZooKeeper 分布式锁（临时顺序节点）：
1. 创建临时顺序节点 /lock/node-xxx。
2. 判断自己是否最小节点，是则获锁；否则监听前一个节点删除事件。
3. 释放锁：删除自己的节点；客户端宕机则临时节点自动删除（防死锁）。

对比：
- Redis：性能高，AP，锁过期有风险（看门狗缓解）。
- ZK：可靠性高，CP，客户端宕机自动释放，但性能较低。

关键：Redis 适合高性能场景；ZK/etcd 适合强一致可靠场景。`,
    keyPoints: ["Redis SETNX+过期+Lua 校验", "ZK 临时顺序节点+监听", "Redisson 看门狗续期"],
    followUps: ["Redis 锁误删问题怎么解决？", "Redlock 的争议是什么？"],
    favorited: false,
  },
  // ===== 系统设计 =====
  {
    id: "be-34",
    nodeId: "be-system-design",
    question: "限流算法有哪些？令牌桶和漏桶的区别？",
    answer: `四种限流算法：
1. 计数器（固定窗口）：单位时间计数，超限拒绝。临界点可能 2 倍流量（窗口边界突刺）。
2. 滑动窗口：细分小窗口滑动统计，平滑突刺。
3. 漏桶：固定速率漏水（处理），请求先入桶，满则拒绝。强制匀速，无法应对突发。
4. 令牌桶：固定速率放令牌入桶，请求消耗令牌，无令牌则拒绝。允许一定突发（桶满可攒令牌）。

漏桶 vs 令牌桶：
- 漏桶：出流恒定，平滑流量，拒绝突发。
- 令牌桶：允许突发（桶里令牌可一次性消耗），更灵活，主流选择。

\`\`\`java
// 令牌桶简化
while (true) {
  if (tokens < capacity) tokens += rate * elapsed; // 按速率补充
  if (request && tokens >= 1) { tokens--; pass(); } else { reject(); }
}
\`\`\`

实现：Guava RateLimiter（单机令牌桶）、Sentinel（滑动窗口）、Redis + Lua（分布式限流）。

关键：令牌桶允许突发更常用；分布式限流用 Redis + Lua 保证原子性。`,
    keyPoints: ["令牌桶允许突发，漏桶匀速", "滑动窗口平滑突刺", "Redis+Lua 分布式限流原子"],
    followUps: ["如何实现分布式限流？", "熔断、降级、限流的区别？"],
    favorited: false,
  },
  {
    id: "be-35",
    nodeId: "be-system-design",
    question: "分库分表的策略？分库分表后带来的问题如何解决？",
    answer: `分表（单库多表）：解决单表数据量大（千万级）。
分库（多库）：解决单库并发/连接/IO 瓶颈。

分片策略：
1. 范围分片：按 id/时间范围（0-1000 万一张），易扩容但热点。
2. Hash 分片：hash(id) % N，分布均匀但扩容需 rehash（一致性哈希缓解）。
3. 一致性哈希：节点变化只影响相邻数据。

带来的问题及解决：
1. 跨库 JOIN：避免 join，应用层组装；或冗余字段/宽表。
2. 分布式事务：用 Seata/TCC/消息最终一致。
3. 全局唯一 ID：Snowflake（雪花）、号段模式（Leaf）。
4. 跨库分页排序：禁用深分页；用游标 WHERE id > last_id；或 ES 异构查询。
5. 聚合统计：异构到 ES/ClickHouse 做 OLAP。

中间件：ShardingSphere（Java 生态）、MyCat、Vitess。

读写分离：主写从读，缓解读压力；注意主从延迟（强制读主/缓存）。

关键：先垂直拆（按业务/字段），再水平拆（分片）；引入 ES/ClickHouse 处理复杂查询。`,
    keyPoints: ["范围/Hash/一致性哈希分片", "全局 ID 用 Snowflake", "跨库 join/分页/事务靠异构+最终一致"],
    followUps: ["Snowflake 的时钟回拨问题？", "一致性哈希如何解决扩容数据迁移？"],
    favorited: false,
  },
];

// 生成学习计划：按拓扑顺序，每天 1-2 个节点
function buildSchedule(): ScheduleItem[] {
  // 拓扑顺序：语言基础 → 并发/JVM → 框架 → 数据存储 → 中间件 → 分布式 → 系统设计
  const order = [
    "be-java-basic",
    "be-python-basic",
    "be-go-basic",
    "be-java-concurrent",
    "be-jvm",
    "be-spring",
    "be-go-concurrent",
    "be-orm",
    "be-python-web",
    "be-mysql",
    "be-redis",
    "be-mq",
    "be-microservice",
    "be-distributed",
    "be-system-design",
  ] as const;

  const schedule: ScheduleItem[] = [];
  order.forEach((nodeId, idx) => {
    const day = Math.floor(idx / 2) + 1;
    schedule.push({
      day,
      nodeId,
      type: "learn",
      estimatedMinutes: 50,
      completed: false,
    });
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

export const BACKEND_PRESET = {
  topic: "后端工程师面试全攻略",
  knowledgeTree: BACKEND_NODES,
  questions: BACKEND_QUESTIONS,
  schedule: buildSchedule(),
};
