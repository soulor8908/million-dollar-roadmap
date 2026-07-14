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
  // ===== Java 基础（扩充） =====
  {
    id: "be-36",
    nodeId: "be-java-basic",
    question: "Java 泛型擦除是什么？带来哪些限制？",
    answer: `泛型擦除（Type Erasure）：编译后泛型类型信息被擦除，运行时 ArrayList<String> 和 ArrayList<Integer> 都是同一个 ArrayList.class，无法在运行时区分泛型参数。

擦除规则：无边界 <T> 擦除为 Object；有边界 <T extends Number> 擦除为 Number；调用处编译器自动插入 checkcast。

限制：
1. 不能 new T()、new T[]（运行时类型未知）。
2. 不能用基本类型作泛型参数（List<int> 不行，要 List<Integer>）。
3. 不能用 instanceof 判断泛型类型（instanceof List<String> 编译错）。
4. 静态字段/静态方法不能引用类的泛型参数。
5. 重载冲突：void m(List<String>) 和 void m(List<Integer>) 编译报错（擦除后签名相同）。

\`\`\`java
// 运行时拿不到泛型参数
List<String> a = new ArrayList<>();
List<Integer> b = new ArrayList<>();
System.out.println(a.getClass() == b.getClass()); // true

// 通过匿名子类 + 反射保留泛型信息
Type t = new TypeToken<List<String>>(){}.getType();
\`\`\`

关键：擦除为兼容 JDK 1.5 之前的字节码；运行时泛型不可用，需靠 Class<T> 参数或 TypeToken 传递类型。`,
    keyPoints: ["编译期擦除，运行时无泛型", "不能 new T() / instanceof 泛型", "靠 Class<T> 或 TypeToken 传类型"],
    followUps: ["为什么 Java 选择擦除而不是具化（reified）？", "Kotlin 的 reified 泛型怎么实现？"],
    favorited: false,
  },
  {
    id: "be-37",
    nodeId: "be-java-basic",
    question: "Integer 缓存机制？自动装箱有哪些陷阱？",
    answer: `Integer 缓存：IntegerCache 默认缓存 -128~127 的 Integer 对象，valueOf 在此范围返回缓存实例，故 == 比较可能为 true，超出范围则 false。

\`\`\`java
Integer a = 127;  // Integer.valueOf(127) → 命中缓存
Integer b = 127;
System.out.println(a == b);      // true

Integer c = 128;  // new Integer
Integer d = 128;
System.out.println(c == d);      // false！必须用 equals
System.out.println(c.equals(d)); // true

// 自动装箱陷阱：循环中累加产生大量临时对象
Integer sum = 0;
for (int i = 0; i < 1000; i++) sum += i; // 每次 += 都拆箱+装箱
\`\`\`

陷阱：
1. Integer == 在缓存范围外不可靠，必须 equals。
2. 自动装箱在循环/高频路径会创建大量临时对象，GC 压力大。
3. Integer 为 null 时自动拆箱抛 NullPointerException。
4. 缓存范围可由 -XX:AutoBoxCacheMax 扩大上限。

关键：包装类比较永远用 equals；高频路径优先基本类型；注意拆箱 NPE。`,
    keyPoints: ["IntegerCache -128~127", "缓存范围外 == 为 false", "自动装箱循环有性能/NPE 陷阱"],
    followUps: ["如何让 Integer == 比较安全？", "-XX:AutoBoxCacheMax 作用是什么？"],
    favorited: false,
  },
  {
    id: "be-38",
    nodeId: "be-java-basic",
    question: "Stream API 的惰性求值原理？Optional 怎么用避免 NPE？",
    answer: `Stream 操作分两类：
- 中间操作（lazy）：filter/map/sorted 等，调用时只记录操作，不执行。
- 终端操作（eager）：collect/count/forEach 等，触发流水线执行。

惰性求值：终端操作才触发遍历，且能"短路"（findFirst/findAny 找到即停），避免无效计算。

\`\`\`java
// 惰性 + 短路：找到第一个大于 3 的即停止，只打印 0~4
int r = IntStream.range(0, 100)
    .peek(i -> System.out.println("peek " + i))
    .filter(i -> i > 3)
    .findFirst()
    .orElse(-1);

// collect 分组
Map<String, List<Person>> byCity = list.stream()
    .collect(Collectors.groupingBy(Person::getCity));
\`\`\`

Optional：包装可能为 null 的返回值，强制调用方显式处理。

\`\`\`java
// 链式替代 if (x != null)
String name = Optional.ofNullable(user)
    .map(User::getName)
    .map(String::toUpperCase)
    .orElse("UNKNOWN");

// orElseThrow 替代抛 NPE
User u = repo.findById(id)
    .orElseThrow(() -> new BizException("用户不存在"));
\`\`\`

关键：Stream 惰性求值短路省计算；不要做副作用（forEach 内修改外部状态）；Optional 用作返回类型，不要做字段或参数。`,
    keyPoints: ["中间操作 lazy，终端才触发", "短路 findFirst 省 CPU", "Optional 链式 + orElse/orElseThrow"],
    followUps: ["Stream 并行流（parallel）有什么坑？", "Optional 为什么不推荐做字段？"],
    favorited: false,
  },
  // ===== Java 并发（扩充） =====
  {
    id: "be-39",
    nodeId: "be-java-concurrent",
    question: "CompletableFuture 的用法？如何编排异步任务？",
    answer: `CompletableFuture 是 Java 8 引入的异步编排工具，支持链式调用、组合、异常处理，比 Future（只能 get 阻塞）强大得多。

常用 API：
- supplyAsync/runAsync：异步执行（默认 ForkJoinPool，建议传自定义线程池）。
- thenApply/thenAccept/thenRun：上一步结果传给下一步。
- thenCompose：串联两个异步任务（flatMap）。
- thenCombine：合并两个独立任务结果。
- allOf/anyOf：等待全部/任一完成。
- exceptionally/handle/whenComplete：异常处理。

\`\`\`java
ExecutorService pool = Executors.newFixedThreadPool(8);

// 串联：查用户 → 查订单 → 计算总价
CompletableFuture<Integer> future = CompletableFuture
    .supplyAsync(() -> userService.findById(1L), pool)   // User
    .thenComposeAsync(u -> orderService.findByUser(u.getId()), pool) // List<Order>
    .thenApplyAsync(orders -> orders.stream().mapToInt(Order::getAmount).sum(), pool);

// 异常兜底
future.exceptionally(ex -> { log.error("失败", ex); return 0; });

// 合并两个独立任务
CompletableFuture<String> f1 = CompletableFuture.supplyAsync(() -> "A");
CompletableFuture<String> f2 = CompletableFuture.supplyAsync(() -> "B");
f1.thenCombine(f2, (a, b) -> a + b).join(); // "AB"
\`\`\`

关键：默认线程池 ForkJoinPool 并发度低，IO 密集任务务必传自定义线程池；join 抛 unchecked，get 抛 checked；避免在 thenApply 中阻塞调用。`,
    keyPoints: ["supplyAsync + thenCompose 串联", "allOf/anyOf 组合", "默认 ForkJoinPool 不够用，传自定义池"],
    followUps: ["CompletableFuture 默认线程池为什么不适合 IO 密集？", "thenApply 和 thenCompose 区别？"],
    favorited: false,
  },
  {
    id: "be-40",
    nodeId: "be-java-concurrent",
    question: "ThreadLocal 原理？为什么会内存泄漏？如何避免？",
    answer: `ThreadLocal：每个线程独立副本，常用于线程上下文（用户信息、TraceId、数据库连接）。

原理：每个 Thread 有一个 ThreadLocalMap，key 是 ThreadLocal 弱引用，value 是强引用的实际数据。

\`\`\`java
private static final ThreadLocal<UserContext> CTX = ThreadLocal.withInitial(UserContext::new);

CTX.get().setUserId(uid); // 线程内取用
CTX.get().getUserId();
CTX.remove(); // 用完必须清理！
\`\`\`

内存泄漏原因：
1. ThreadLocalMap 的 key 是弱引用，value 是强引用。
2. ThreadLocal 对象被回收后 key 变 null，但 value 仍被 Entry 强引用，无法回收。
3. 线程池线程长期存活，ThreadLocalMap 一直存在 → value 泄漏。

InheritableThreadLocal：子线程可继承父线程的值（构造时复制），但线程池复用线程不触发继承 → 用 TransmittableThreadLocal（阿里）解决。

避免方式：
1. 用完务必 remove()（try-finally）。
2. ThreadLocal 字段尽量 static final，避免实例被回收后 key 失效。
3. 线程池场景用 TransmittableThreadLocal 透传。

关键：弱引用 key + 强引用 value 是泄漏根因；线程池复用放大问题；remove 是唯一解。`,
    keyPoints: ["ThreadLocalMap key 弱引用 value 强引用", "线程池复用导致泄漏", "remove() 必须执行"],
    followUps: ["InheritableThreadLocal 在线程池为什么不生效？", "TransmittableThreadLocal 原理？"],
    favorited: false,
  },
  {
    id: "be-41",
    nodeId: "be-java-concurrent",
    question: "ForkJoinPool 和普通线程池的区别？适用场景？",
    answer: `ForkJoinPool：分治框架专用线程池，核心是"工作窃取"（work-stealing）：每个线程有自己的双端队列，空闲时从其他线程队列尾部偷任务，减少竞争、提高利用率。

对比普通线程池（ThreadPoolExecutor）：
- ThreadPoolExecutor：所有线程共享一个 workQueue，竞争集中。
- ForkJoinPool：每线程一个 deque，自己 LIFO 处理（栈顶），偷任务 FIFO（队列尾），减少冲突。

\`\`\`java
// 递归分治求和
class SumTask extends RecursiveTask<Long> {
  private final long[] arr; private final int lo, hi;
  protected Long compute() {
    if (hi - lo <= 1000) return sum(arr, lo, hi); // 阈值直接算
    int mid = (lo + hi) >>> 1;
    SumTask left = new SumTask(arr, lo, mid);
    SumTask right = new SumTask(arr, mid, hi);
    left.fork();            // 异步执行左半
    long r = right.compute(); // 当前算右半
    return r + left.join();  // 合并
  }
}
long result = pool.invoke(new SumTask(arr, 0, arr.length));
\`\`\`

适用场景：
- CPU 密集 + 可分治任务（归并排序、大数组统计、树的遍历）。
- CompletableFuture 默认用 ForkJoinPool.commonPool()（parallelism = CPU 核数 - 1）。

注意：IO 密集任务不要用 ForkJoinPool（线程少、阻塞会拖垮）；parallelStream 共享 commonPool，内部阻塞会拖慢其他并行流。

关键：工作窃取是核心；适合 CPU 密集分治；不适合阻塞 IO。`,
    keyPoints: ["工作窃取减少队列竞争", "适合 CPU 密集分治任务", "parallelStream 共享 commonPool"],
    followUps: ["parallelStream 有什么坑？", "ForkJoinPool 和 ThreadPoolExecutor 谁更适合 IO？"],
    favorited: false,
  },
  // ===== JVM（扩充） =====
  {
    id: "be-42",
    nodeId: "be-jvm",
    question: "哪些对象可作为 GC Roots？可达性分析过程？",
    answer: `GC Roots 是可达性分析的起点，从 GC Roots 出发能遍历到的对象都存活，遍历不到的视为可回收。

可作为 GC Roots 的对象：
1. 虚拟机栈中引用的对象（方法局部变量、参数）。
2. 本地方法栈中 JNI 引用的对象。
3. 方法区中类静态变量引用的对象。
4. 方法区中常量引用的对象。
5. Java 虚拟机内部引用（基本类型 Class、常驻异常对象、ClassLoader）。
6. 被同步锁（synchronized）持有的对象。
7. JMXBean、JVMTI 等 JVM 内部引用。

\`\`\`java
// 局部变量 obj 是 GC Root
public void demo() {
  Object obj = new Object(); // obj 在栈帧，new 的对象可达，不回收
  obj = null;                 // 断开引用，下次 GC 可回收
}

// 静态变量是 GC Root，引用的对象不会回收
private static final List<byte[]> CACHE = new ArrayList<>();
\`\`\`

分析过程：
1. 枚举 GC Roots（需 SafePoint 暂停所有线程）。
2. 从 Roots 遍历对象图（标记存活）。
3. 三色标记：白（未访问）/灰（访问中，子节点未处理完）/黑（已完成）。
4. 并发标记阶段用写屏障记录引用变化（SATB/增量更新）。

关键：GC Roots 是"肯定不会被回收"的起点；静态变量和栈引用最常见；三色标记 + 写屏障解决并发标记漏标。`,
    keyPoints: ["栈/本地栈/静态变量/常量是 GC Roots", "三色标记 + 写屏障", "SafePoint 枚举 Roots"],
    followUps: ["什么是三色标记的漏标问题？", "SafePoint 和 SafeRegion 区别？"],
    favorited: false,
  },
  {
    id: "be-43",
    nodeId: "be-jvm",
    question: "Java 对象的内存布局？对象头包含什么？",
    answer: `在 64 位 JVM（开启压缩指针）下，对象内存布局分三部分：对象头（Header）、实例数据（Instance Data）、对齐填充（Padding）。

对象头（HotSpot）：
- Mark Word（8 字节）：哈希码、GC 分代年龄、锁状态（无锁/偏向/轻量/重量）、偏向线程 ID 等。
- 类元数据指针（4 字节，压缩后）：指向 Class 元数据（Klass）。
- 数组长度（4 字节，仅数组对象有）。

实例数据：各字段（按类型宽度排序，父类字段在前），引用压缩后 4 字节。

对齐填充：补齐到 8 字节整数倍。

\`\`\`java
// 用 jol 查看对象布局
import org.openjdk.jol.info.ClassLayout;
Object o = new Object();
System.out.println(ClassLayout.parseInstance(o).toPrintable());
// 输出：12 字节对象头(8 MarkWord + 4 Klass) + 0 实例数据 + 4 对齐 = 16 字节
\`\`\`

锁升级在 Mark Word 中的体现：
- 无锁：存 hashCode、分代年龄。
- 偏向锁：存线程 ID。
- 轻量级锁：指向栈中 Lock Record。
- 重量级锁：指向 ObjectMonitor（mutex）。

关键：对象头是锁与 GC 的载体；压缩指针（-XX:+UseCompressedOops）省内存；对象大小 8 字节对齐。`,
    keyPoints: ["对象头 = MarkWord + Klass 指针", "MarkWord 存锁状态/哈希/年龄", "8 字节对齐"],
    followUps: ["偏向锁为什么在 JDK 15 后被废弃？", "压缩指针如何节省内存？"],
    favorited: false,
  },
  {
    id: "be-44",
    nodeId: "be-jvm",
    question: "类加载器的双亲委派模型？为什么要打破它？",
    answer: `类加载器层次（从上到下）：
- Bootstrap ClassLoader（C++）：加载 rt.jar 等核心类（java.*）。
- Extension/Platform ClassLoader：加载 ext 目录 / JDK 9+ 平台模块。
- Application ClassLoader：加载 classpath。
- 自定义 ClassLoader。

双亲委派：收到加载请求时先委派父加载器，父加载失败才自己加载。保证核心类（如 java.lang.Object）只被 Bootstrap 加载，防止恶意替换，保证类型安全。

\`\`\`java
// 自定义类加载器需重写 findClass（不要重写 loadClass 以保留双亲委派）
class MyLoader extends ClassLoader {
  protected Class<?> findClass(String name) throws ClassNotFoundException {
    byte[] data = loadClassData(name); // 自定义字节码来源
    return defineClass(name, data, 0, data.length);
  }
}
\`\`\`

打破双亲委派的场景：
1. SPI（JDBC Driver）：核心接口在 Bootstrap，实现类在 classpath → 用线程上下文类加载器（TCCL）反向加载。
2. Tomcat：每个 webapp 独立 ClassLoader，webapp 间隔离，且优先自己加载（重写 loadClass）。
3. OSGi/热部署：网状加载，模块独立。
4. JDK 9 模块化：层级仍是双亲委派，但按模块解析。

关键：双亲委派保证核心类安全与唯一；SPI/Tomcat/热部署需打破，靠 TCCL 或重写 loadClass。`,
    keyPoints: ["父加载器优先，保证核心类唯一", "SPI 用 TCCL 打破", "Tomcat 重写 loadClass 隔离 webapp"],
    followUps: ["Tomcat 的类加载器结构？", "线程上下文类加载器解决什么问题？"],
    favorited: false,
  },
  {
    id: "be-45",
    nodeId: "be-jvm",
    question: "JIT 编译原理？常见的内存溢出场景及排查？",
    answer: `JIT（Just-In-Time）编译：JVM 把热点代码（频繁执行的"热点"）编译成机器码缓存，提升运行速度。

热点探测：基于方法调用计数器 + 回边计数器，超过阈值（-XX:CompileThreshold，C2 默认 10000）触发编译。
编译器：
- C1（Client）：快速编译，简单优化。
- C2（Server）：慢但深度优化（逃逸分析、标量替换、锁消除、内联）。
- 分层编译（Tiered）：先 C1 后 C2（JDK 默认）。

\`\`\`bash
# 查看即时编译日志
java -XX:+PrintCompilation -XX:+UnlockDiagnosticVMOptions -XX:+PrintInlining MyApp
# 关键优化：逃逸分析
java -XX:+DoEscapeAnalysis -XX:+EliminateAllocations MyApp  # 栈上分配/标量替换
\`\`\`

常见 OOM 场景及排查：
1. java.lang.OutOfMemoryError: Java heap space → 堆内存不足，-Xmx 调大或查内存泄漏（jmap -histo 看大对象）。
2. Metaspace → 动态生成类太多（CGLIB/反射），-XX:MaxMetaspaceSize 调大。
3. GC overhead limit exceeded → GC 花费 >98% 时间回收 <2% 内存，多为泄漏。
4. Direct buffer memory → NIO 堆外内存未释放。
5. unable to create new native thread → 线程数超限。

\`\`\`bash
# 排查堆内存泄漏
jmap -dump:live,format=b,file=heap.hprof <pid>  # 导出堆
jmap -histo:live <pid> | head -30              # 看对象直方图
# 用 MAT/jvisualvm 分析 hprof
\`\`\`

关键：JIT 靠热点探测 + 分层编译优化；OOM 先分类型再 dump 分析；生产建议加 -XX:+HeapDumpOnOutOfMemoryError 自动 dump。`,
    keyPoints: ["热点探测触发 JIT", "C1 快/C2 深，逃逸分析优化", "OOM 分类型 + dump 排查"],
    followUps: ["逃逸分析和栈上分配的关系？", "如何定位 Metaspace OOM？"],
    favorited: false,
  },
  // ===== Spring（扩充） =====
  {
    id: "be-46",
    nodeId: "be-spring",
    question: "Spring 三级缓存如何解决循环依赖？为什么构造器循环无法解决？",
    answer: `循环依赖：A 依赖 B，B 依赖 A。Spring 用三级缓存解决单例 setter/字段注入的循环依赖。

三级缓存（DefaultSingletonBeanRegistry）：
- singletonObjects（一级）：完整成品 Bean。
- earlySingletonObjects（二级）：提前暴露的半成品（已实例化未注入完）。
- singletonFactories（三级）：ObjectFactory，按需生成早期引用（可能是代理）。

\`\`\`java
// 简化流程：创建 A
1. 实例化 A（构造器），放入三级缓存（ObjectFactory）。
2. 注入 A 的属性 B → 创建 B。
3. 实例化 B，注入 B 的属性 A → 从三级缓存拿到 A 的早期引用（必要时生成代理），放入二级缓存，移除三级。
4. B 注入完成，B 成品放一级。
5. 回到 A，拿到 B，A 注入完成，A 成品放一级，移除二级。
\`\`\`

为什么要三级而非二级：如果 A 需要被 AOP 代理，提前暴露的必须是代理对象。三级缓存存 ObjectFactory，调用时才决定返回原始对象还是代理（保证注入的和最终的是同一个代理），避免重复创建。

构造器循环无法解决：构造器注入时实例化就需要依赖，而此时对象还未创建，无法提前暴露，Spring 直接抛 BeanCurrentlyInCreationException。

关键：三级缓存让"提前暴露"与"代理生成"解耦；只解决单例 setter/字段注入循环；构造器循环必须重构。`,
    keyPoints: ["三级缓存：成品/半成品/ObjectFactory", "三级为代理生成留延迟", "构造器循环无法解决"],
    followUps: ["@Async 的循环依赖为什么会有问题？", "Spring Boot 2.6 为什么默认禁止循环依赖？"],
    favorited: false,
  },
  {
    id: "be-47",
    nodeId: "be-spring",
    question: "@Transactional 失效的场景有哪些？如何避免？",
    answer: `@Transactional 基于 AOP 代理，失效本质是"没走代理"或"异常被吞"。

常见失效场景：
1. 自调用：同类中方法 A 调方法 B（B 有 @Transactional），this 调用不走代理 → 失效。
2. 非 public 方法：默认只代理 public。
3. 异常被 catch 吞掉：没抛出代理无法感知 → 不回滚。
4. 回滚异常类型不对：默认只回滚 RuntimeException/Error，checked 异常不回滚。
5. 异常类型不匹配 rollbackFor：抛了但 rollbackFor 未包含。
6. 数据库不支持事务（MyISAM）。
7. 传播行为配置不当（NOT_SUPPORTED/NEVER）。
8. 类未被 Spring 管理（没加 @Service）。

\`\`\`java
// 失效：自调用
@Service
public class OrderService {
  public void batch() { this.create(); } // this 不走代理，create 事务失效
  @Transactional public void create() { ... }
}

// 解决1：注入自己
@Autowired private OrderService self;
public void batch() { self.create(); } // 走代理

// 解决2：从 AopContext 拿代理
((OrderService) AopContext.currentProxy()).create();

// 正确配置回滚
@Transactional(rollbackFor = Exception.class) // checked 异常也回滚
public void pay() throws IOException { ... }
\`\`\`

关键：失效核心是"绕过代理"；自调用用自注入或 AopContext；务必指定 rollbackFor = Exception.class。`,
    keyPoints: ["自调用不走代理失效", "非 public / 异常被吞失效", "rollbackFor = Exception.class"],
    followUps: ["事务传播行为有哪些？", "嵌套事务和 REQUIRED_NEW 区别？"],
    favorited: false,
  },
  {
    id: "be-48",
    nodeId: "be-spring",
    question: "Spring MVC 一次请求的完整处理流程？",
    answer: `Spring MVC 核心是 DispatcherServlet，统一接收并分发请求。

完整流程：
1. 请求到达 DispatcherServlet。
2. DispatcherServlet 调用 HandlerMapping 找到 Handler（Controller 方法）+ HandlerInterceptor 链。
3. 调用 HandlerAdapter 执行 Handler。
4. HandlerInterceptor.preHandle（前置拦截）。
5. 执行 Controller 方法（参数解析、数据绑定、@RequestBody 反序列化）。
6. Controller 返回 ModelAndView 或 ResponseEntity。
7. HandlerInterceptor.postHandle（后置处理）。
8. 结果处理：@ResponseBody → HttpMessageConverter 写 JSON；视图 → ViewResolver 渲染。
9. HandlerInterceptor.afterCompletion（完成回调）。
10. 响应返回客户端。

\`\`\`java
@RestController
@RequestMapping("/api/orders")
public class OrderController {
  @PostMapping
  public Result<Order> create(@Valid @RequestBody OrderDTO dto) {
    Order o = orderService.create(dto); // Service @Transactional
    return Result.ok(o); // HttpMessageConverter(jackson) 转 JSON
  }
}
\`\`\`

关键组件：
- HandlerMapping：RequestMappingHandlerMapping（@RequestMapping）。
- HandlerAdapter：RequestMappingHandlerAdapter（参数解析、返回值处理）。
- HttpMessageConverter：Jackson 处理 JSON。
- MultipartResolver：文件上传。
- ExceptionHandler：@ControllerAdvice 统一异常。

关键：DispatcherServlet 是中央调度器；拦截器 pre/post/afterCompletion 三阶段；@ResponseBody 走 MessageConverter 而非视图。`,
    keyPoints: ["DispatcherServlet 统一分发", "HandlerMapping/Adapter/Interceptor", "@ResponseBody 走 MessageConverter"],
    followUps: ["拦截器和过滤器（Filter）的区别？", "@ControllerAdvice 如何统一异常？"],
    favorited: false,
  },
  // ===== MyBatis/JPA（扩充） =====
  {
    id: "be-49",
    nodeId: "be-orm",
    question: "MyBatis 动态 SQL 常用标签？foreach 如何防止 SQL 注入？",
    answer: `动态 SQL 标签：if、choose/when/otherwise、where、set、trim、foreach、sql/include。

\`\`\`xml
<!-- where 自动去掉首个 AND/OR -->
<select id="search" resultType="User">
  SELECT * FROM user
  <where>
    <if test="name != null and name != ''">
      AND name LIKE CONCAT('%', #{name}, '%')
    </if>
    <if test="status != null">
      AND status = #{status}
    </if>
  </where>
</select>

<!-- foreach 批量查询：collection/list，item/separator/open/close -->
<select id="findByIds" resultType="User">
  SELECT * FROM user WHERE id IN
  <foreach collection="ids" item="id" open="(" separator="," close=")">
    #{id}
  </foreach>
</select>

<!-- set 自动去掉末尾逗号 -->
<update id="update">
  UPDATE user
  <set>
    <if test="name != null">name = #{name},</if>
    <if test="age != null">age = #{age},</if>
  </set>
  WHERE id = #{id}
</update>
\`\`\`

foreach 防注入：foreach 内部用 #{} 占位符，生成多个 ?，参数走 PreparedStatement，安全。绝不能用 \${} 拼接 id 值（有注入风险），\${} 仅用于表名/列名等结构性参数且需白名单校验。

批量优化：大批量 IN 查询注意 SQL 长度限制，可分批（每次 500-1000）；批量插入用 foreach + VALUES 多行，或 BATCH 执行器。

关键：where/set/trim 自动处理 SQL 拼接细节；foreach 用 #{} 防 SQL 注入；大批量要分批。`,
    keyPoints: ["where/set 自动去 AND/逗号", "foreach 配合 #{} 防注入", "大批量 IN 需分批"],
    followUps: ["MyBatis 的 BATCH 执行器原理？", "trim 标签 prefixOverrides 作用？"],
    favorited: false,
  },
  {
    id: "be-50",
    nodeId: "be-orm",
    question: "HikariCP 和 Druid 连接池的区别？如何选型与调参？",
    answer: `HikariCP：性能极高（号称最快），代码精简，Spring Boot 2.x 默认。
- 优化：FastList（无范围检查）、ConcurrentBag（无锁借取连接）、字节码级优化。
- 配置简单：maximumPoolSize、minimumIdle、connectionTimeout、idleTimeout、maxLifetime。

Druid：阿里开源，功能丰富，监控强。
- 自带 SQL 防火墙（防注入）、慢 SQL 监控、StatFilter 统计。
- 提供 Druid Monitor 监控页面。
- 配置项多：initialSize、minIdle、maxActive、keepAlive、wallConfig 等。

\`\`\`java
// HikariCP 配置（Spring Boot）
spring.datasource.hikari.maximum-pool-size=20
spring.datasource.hikari.minimum-idle=10
spring.datasource.hikari.connection-timeout=30000
spring.datasource.hikari.idle-timeout=600000
spring.datasource.hikari.max-lifetime=1800000

// Druid 配置
spring.datasource.druid.initial-size=5
spring.datasource.druid.max-active=20
spring.datasource.druid.stat-view-servlet.enabled=true   // 监控页
spring.datasource.druid.filter.stat.slow-sql-millis=1000 // 慢 SQL
\`\`\`

调参要点：
- 连接数公式（HikariCP 官方）：pool_size = ((core_count × 2) + effective_spindle_count)，一般 10-20 够用，并非越大越好（过多会拖慢 DB）。
- maxLifetime < 数据库 wait_timeout（如 MySQL 默认 8h），避免连接失效。
- minimumIdle 建议等于 maximumPoolSize（HikariCP 推荐固定大小，减少抖动）。

选型：追求性能/简单用 HikariCP；需要监控/SQL 防火墙/国产化用 Druid。

关键：HikariCP 快而精简，Druid 功能全监控强；连接数不是越大越好；maxLifetime 要小于 DB 超时。`,
    keyPoints: ["HikariCP 性能最强", "Druid 监控+SQL 防火墙", "连接数并非越大越好"],
    followUps: ["HikariCP 为什么快？", "连接池 maxLifetime 为什么要小于 wait_timeout？"],
    favorited: false,
  },
  {
    id: "be-51",
    nodeId: "be-orm",
    question: "MyBatis-Plus 分页插件原理？深度分页如何优化？",
    answer: `分页插件原理：MyBatis-Plus 的 PaginationInnerInterceptor 拦截 Executor.query，在 SQL 执行前：
1. 执行 count SQL 查询总数（自动改写原 SQL 为 SELECT COUNT(*)）。
2. 在原 SQL 后拼接 LIMIT offset, size。
3. 用 dialect（数据库方言）适配不同数据库的分页语法。

\`\`\`java
// 配置插件
@Bean
public MybatisPlusInterceptor mybatisPlusInterceptor() {
  MybatisPlusInterceptor i = new MybatisPlusInterceptor();
  i.addInnerInterceptor(new PaginationInnerInterceptor(DbType.MYSQL));
  return i;
}

// 使用
Page<User> page = new Page<>(1, 10); // 第1页，每页10
userMapper.selectPage(page, queryWrapper);
page.getRecords(); // 数据
page.getTotal();   // 总数
\`\`\`

深度分页问题：LIMIT 1000000, 10 会扫描 100 万行再丢弃，越往后越慢。

优化方案：
1. 游标分页（推荐）：WHERE id > last_id ORDER BY id LIMIT 10，走索引，O(1)。
2. 覆盖索引 + 延迟关联：先走覆盖索引查 id，再 join 取数据。
   \`\`\`sql
   SELECT t.* FROM user t
   INNER JOIN (SELECT id FROM user ORDER BY id LIMIT 1000000, 10) tmp
   ON t.id = tmp.id;
   \`\`\`
3. 业务限制：禁止跳页，只允许"下一页"；或限制最大页数。
4. ES/ClickHouse 异构：复杂搜索走搜索引擎。

关键：分页插件拦截改写 SQL；深度分页用游标或延迟关联；count 慢时可异步或缓存。`,
    keyPoints: ["拦截器改写 SQL + count", "深度分页用游标 WHERE id > last_id", "延迟关联避免回表百万行"],
    followUps: ["count 查询慢怎么优化？", "MyBatis 插件（Interceptor）的实现原理？"],
    favorited: false,
  },
  {
    id: "be-52",
    nodeId: "be-orm",
    question: "MyBatis 和 JPA 的缓存机制？二级缓存为什么生产慎用？",
    answer: `MyBatis 缓存：
- 一级缓存：SqlSession 级别，默认开启。同一 session 相同查询命中缓存。增删改会清空该 session 缓存。Spring 中每个 service 方法（默认每次 mapper 调用新建 session）一级缓存基本失效。
- 二级缓存：Mapper（namespace）级别，需手动开启（<cache/> 或 @CacheNamespace）。跨 session 共享。序列化存储。

JPA/Hibernate 缓存：
- 一级缓存：EntityManager/Session 级别（持久化上下文），默认开启。
- 二级缓存：进程级，需配置 provider（EhCache/Caffeine）+ @Cache 注解。

\`\`\`xml
<!-- MyBatis 开启二级缓存 -->
<mapper namespace="com.xx.UserMapper">
  <cache eviction="LRU" flushInterval="60000" size="512" readOnly="false"/>
</mapper>
\`\`\`

二级缓存生产慎用原因：
1. 粒度粗：namespace 级，该 namespace 任意增删改清空整个缓存，命中率低。
2. 多表联查脏读：查询涉及多表时，任一表更新无法精准失效，导致读到旧数据。
3. 分布式不一致：本地缓存在集群节点间不同步。
4. 序列化开销：readOnly=false 时对象需序列化，性能损耗。

生产实践：
- 关闭 ORM 二级缓存。
- 用 Redis/Caffeine 在业务层自建缓存，精准控制 key 与失效。
- 配合 Canal 监听 binlog 主动失效缓存。

关键：一级缓存 session 级基本够用；二级缓存粒度粗、多表脏读、分布式不一致，生产多用 Redis 替代。`,
    keyPoints: ["一级 SqlSession 级默认开", "二级 namespace 级粒度粗", "生产用 Redis 业务层缓存"],
    followUps: ["如何保证缓存与 DB 一致性？", "Canal 监听 binlog 失效缓存的流程？"],
    favorited: false,
  },
  // ===== Python 基础（扩充） =====
  {
    id: "be-53",
    nodeId: "be-python-basic",
    question: "生成器的原理？yield 和 yield from 的区别？",
    answer: `生成器（Generator）：一种惰性求值的迭代器，用 yield 暂停函数并返回值，下次 next() 从暂停处继续，按需生成，节省内存。

原理：包含 yield 的函数调用时不执行，返回 generator 对象。next() 执行到 yield 暂停（保存栈帧局部变量）；再次 next() 恢复执行。

\`\`\`python
def fib():
    a, b = 0, 1
    while True:
        yield a       # 暂停并返回 a
        a, b = b, a + b

g = fib()
print([next(g) for _ in range(10)])  # 按需取 10 个，不占内存

# 读取大文件按行生成
def read_lines(path):
    with open(path) as f:
        for line in f:
            yield line.strip()
\`\`\`

yield from（Python 3.3）：委托给子生成器，把子生成器的 yield 直接透传给外层调用方，并接收 send/throw 返回值。

\`\`\`python
def chain(*iterables):
    for it in iterables:
        yield from it  # 等价于 for x in it: yield x，但支持 send/close

list(chain([1,2], [3,4]))  # [1,2,3,4]
\`\`\`

应用：流式处理大文件、无限序列、协程（async/await 底层基于生成器）。

关键：yield 暂停恢复省内存；yield from 委托子生成器并透传 send；生成器是协程的雏形。`,
    keyPoints: ["yield 暂停恢复惰性求值", "省内存处理大数据", "yield from 委托子生成器"],
    followUps: ["生成器和迭代器的区别？", "send() 如何向生成器传值？"],
    favorited: false,
  },
  {
    id: "be-54",
    nodeId: "be-python-basic",
    question: "上下文管理器原理？写一个支持 with 的数据库连接管理器。",
    answer: `上下文管理器（Context Manager）：配合 with 语句，保证资源（文件/连接/锁）正确获取与释放，即使抛异常也能清理。

实现方式：
1. 实现 __enter__ 和 __exit__ 协议。
2. contextlib.contextmanager 装饰器（基于生成器）。

\`\`\`python
# 方式1：实现协议
class DBConn:
    def __init__(self, dsn):
        self.dsn = dsn
    def __enter__(self):
        self.conn = connect(self.dsn)  # 获取资源
        return self.conn
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.conn.close()  # 必然执行
        return False  # False 表示不吞异常，True 表示吞掉

with DBConn(dsn) as conn:
    conn.execute("SELECT 1")  # 即使抛异常，__exit__ 也会 close

# 方式2：contextmanager 装饰器
from contextlib import contextmanager

@contextmanager
def db_conn(dsn):
    conn = connect(dsn)
    try:
        yield conn          # yield 前是 __enter__，后是 __exit__
    finally:
        conn.close()
\`\`\`

__exit__ 返回 True 会吞掉异常（慎用）；返回 False/None 异常继续抛出。

contextlib.suppress、contextlib.redirect_stdout 是内置实用上下文管理器。

Asynccontextmanager（async with）：异步版本，配合 async/__aexit__。

关键：with 保证资源释放；__enter__ 获取、__exit__ 释放；contextmanager 装饰器更简洁。`,
    keyPoints: ["__enter__/__exit__ 协议", "contextmanager 装饰器简化", "__exit__ 返回 True 吞异常"],
    followUps: ["contextmanager 装饰器原理？", "async with 和 with 区别？"],
    favorited: false,
  },
  {
    id: "be-55",
    nodeId: "be-python-basic",
    question: "元类（metaclass）的作用？__new__ 和 __init__ 的区别？",
    answer: `元类（Metaclass）：创建类的类。普通类用 type 创建（type 是默认元类）。元类用于在类创建时定制类的行为（如 ORM 模型字段收集、单例、接口校验）。

类创建过程：metaclass.__new__ → metaclass.__init__ → （实例化时）class.__new__ → class.__init__。

\`\`\`python
# 元类：自动收集子类字段（ORM 风格）
class ModelMeta(type):
    def __new__(mcs, name, bases, ns):
        fields = {k: v for k, v in ns.items() if isinstance(v, Field)}
        ns['_fields'] = fields
        return super().__new__(mcs, name, bases, ns)

class Field: pass
class User(metaclass=ModelMeta):
    name = Field()
    age = Field()
print(User._fields)  # {'name':..., 'age':...}

# type 动态创建类
Dog = type('Dog', (object,), {'bark': lambda self: 'woof'})
Dog().bark()  # 'woof'
\`\`\`

__new__ vs __init__：
- __new__：创建实例（分配内存返回对象），是类方法，第一个参数是 cls。不可变类型（str/tuple）只能在 __new__ 修改值。
- __init__：初始化实例（已创建），第一个参数是 self，返回 None。

\`\`\`python
class Singleton:
    _inst = None
    def __new__(cls, *a, **kw):
        if cls._inst is None:
            cls._inst = super().__new__(cls)
        return cls._inst  # __new__ 控制实例创建实现单例
\`\`\`

关键：元类定制类创建（type 是根元类）；__new__ 创建对象（单例/不可变类型），__init__ 初始化。`,
    keyPoints: ["元类创建类，type 是默认元类", "ORM 用元类收集字段", "__new__ 创建/__init__ 初始化"],
    followUps: ["Django ORM 的 Model 如何用元类？", "type() 创建类和 class 语句的关系？"],
    favorited: false,
  },
  {
    id: "be-56",
    nodeId: "be-python-basic",
    question: "Python 的垃圾回收机制？引用计数 + 分代回收如何配合？",
    answer: `Python GC（CPython）三种机制配合：

1. 引用计数（主要）：
- 每个对象有 ob_refcnt，引用 +1/释放 -1，归零立即回收。
- 优点：即时、简单。缺点：无法处理循环引用；频繁增减有开销。

\`\`\`python
import sys
a = [1,2,3]
sys.getrefcount(a)  # 2（a + getrefcount 参数）

# 循环引用：引用计数无法回收
a = []; b = []
a.append(b); b.append(a)
del a; del b  # refcnt 仍为 1，靠分代回收
\`\`\`

2. 标记-清除（分代回收）：
- 专门处理容器对象（list/dict/实例）的循环引用。
- 从根对象出发标记可达对象，清除不可达的循环引用环。

3. 分代回收（优化）：
- 对象分三代（0/1/2），新建对象在第 0 代。
- 第 0 代回收阈值触发 → 存活晋升第 1 代 → 第 1 代触发回收 → 晋升第 2 代。
- 老对象回收频率低，因为"越老越可能存活"。

\`\`\`python
import gc
gc.get_threshold()  # (700, 10, 10) 第0代分配700次触发
gc.collect()         # 手动全代回收
gc.disable()         # 禁用分代（仅引用计数，循环引用会泄漏）
\`\`\`

关键：引用计数即时回收但无法处理循环引用；分代标记清除补位；weakref 可避免循环引用。`,
    keyPoints: ["引用计数即时回收", "分代标记清除处理循环引用", "三代回收越老越少"],
    followUps: ["weakref 如何避免循环引用？", "为什么 CPython 用引用计数而 Java 不用？"],
    favorited: false,
  },
  // ===== Python Web（扩充） =====
  {
    id: "be-57",
    nodeId: "be-python-web",
    question: "Django ORM 的查询优化？select_related 和 prefetch_related 区别？",
    answer: `Django ORM 默认 lazy loading，访问外键关联才查 DB，易产生 N+1 问题。两个方法预加载关联：

- select_related：一对一/外键（正向），用 JOIN 一次查询带出，SQL 一条。
- prefetch_related：多对多/反向外键，用额外 IN 查询，Python 层组装，两条 SQL。

\`\`\`python
# N+1 问题：100 本书逐本查作者
books = Book.objects.all()        # 1 次
for b in books:
    print(b.author.name)          # 100 次！共 101 次 SQL

# select_related：JOIN 一次查出（外键正向）
books = Book.objects.select_related('author').all()  # 1 次 JOIN
for b in books:
    print(b.author.name)          # 0 次额外查询

# prefetch_related：反向外键/多对多，额外 IN 查询
authors = Author.objects.prefetch_related('book_set').all()
# 2 次：SELECT * FROM author; SELECT * FROM book WHERE author_id IN (...)

# 链式 + 多层
Book.objects.select_related('author__country').prefetch_related('tags')
\`\`\`

其他优化：
- only/defer：只取需要的字段，延迟加载大字段。
- values/values_list：取字典/元组，跳过模型实例化，更快。
- bulk_create/bulk_update：批量操作。
- count()/exists()：用 SELECT COUNT / LIMIT 1 替代 len()/if qs。

关键：正向外键用 select_related（JOIN），反向/多对多用 prefetch_related（IN）；避免在循环里访问关联。`,
    keyPoints: ["select_related 用 JOIN 一次", "prefetch_related 用 IN 两次", "避免循环内访问外键"],
    followUps: ["Django ORM 和 SQLAlchemy 的区别？", "only/defer 何时使用？"],
    favorited: false,
  },
  {
    id: "be-58",
    nodeId: "be-python-web",
    question: "FastAPI 异步原理？async 路由和同步路由混用有什么坑？",
    answer: `FastAPI 基于 Starlette + asyncio，单进程事件循环内协程并发处理请求，IO 时切换协程而非线程，IO 密集场景吞吐高。

异步原理：
- 事件循环（uvloop，比默认 asyncio 快 2-4 倍）监听 IO 就绪。
- async def 路由是协程，遇到 await 让出执行权。
- 阻塞 IO 必须用异步库（asyncpg/aiohttp/httpx async）。

\`\`\`python
from fastapi import FastAPI
import httpx, asyncio

app = FastAPI()

# 异步路由：协程，await 时让出
@app.get("/users/{uid}")
async def get_user(uid: int):
    async with httpx.AsyncClient() as c:
        r = await c.get(f"https://api.test/{uid}")  # 非阻塞
    return r.json()

# 同步路由：FastAPI 放到线程池跑，不阻塞事件循环
@app.get("/sync/{uid}")
def get_user_sync(uid: int):
    return db.query(uid)  # 同步 DB 驱动
\`\`\`

混用坑：
1. async 路由里调用同步阻塞代码（requests/同步 DB 驱动）→ 阻塞整个事件循环，所有请求卡住！必须用 run_in_executor 或换异步库。
2. 同步路由会占用线程池（默认 40 线程），高并发同步路由耗尽线程池。
3. 混用同步/异步 DB 驱动需分别管理连接池。

并发模型：uvicorn 多 worker（进程）× 单进程事件循环 × 协程。CPU 密集仍需多进程（gunicorn -k uvicorn.workers.UvicornWorker -w 4）。

关键：async 路由必须全程非阻塞，同步阻塞代码会卡死事件循环；CPU 密集用多进程。`,
    keyPoints: ["async 路由协程并发", "阻塞调用会卡死事件循环", "同步路由走线程池"],
    followUps: ["uvloop 为什么比 asyncio 快？", "如何把同步库用在 async 路由？"],
    favorited: false,
  },
  {
    id: "be-59",
    nodeId: "be-python-web",
    question: "Django/FastAPI 中间件原理？如何实现一个请求耗时日志中间件？",
    answer: `中间件（Middleware）：洋葱模型，请求按顺序穿过各中间件到达视图，响应反向穿过，可在前后做统一处理（鉴权/日志/CORS/限流）。

Django 中间件：基于可调用对象，实现 __init__ + __call__（新式）或 process_request/process_response（旧式）。

\`\`\`python
# Django 新式中间件
import time
class TimingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
    def __call__(self, request):
        start = time.time()
        response = self.get_response(request)  # 进入视图
        cost = (time.time() - start) * 1000
        response['X-Response-Time'] = f'{cost:.0f}ms'
        log.info(f'{request.path} {cost:.0f}ms')
        return response

# settings.py
MIDDLEWARE = [
    ...,
    'myapp.middleware.TimingMiddleware',
]
\`\`\`

FastAPI 中间件：基于 ASGI，用 @app.middleware 或纯 ASGI 中间件。

\`\`\`python
from fastapi import FastAPI, Request
import time

app = FastAPI()

@app.middleware("http")
async def timing(request: Request, call_next):
    start = time.time()
    response = await call_next(request)  # 等待路由处理
    cost = (time.time() - start) * 1000
    response.headers["X-Response-Time"] = f"{cost:.0f}ms"
    log.info(f"{request.url.path} {cost:.0f}ms")
    return response
\`\`\`

执行顺序：Django 请求阶段从上到下，响应从下到上；FastAPI add_middleware 后注册的反向包裹（洋葱式）。

关键：洋葱模型，前后都能处理；统一处理横切关注点；注意中间件顺序（鉴权应靠前）。`,
    keyPoints: ["洋葱模型前后处理", "Django __call__ 新式中间件", "FastAPI @app.middleware"],
    followUps: ["中间件和装饰器的区别？", "CORS 中间件原理？"],
    favorited: false,
  },
  {
    id: "be-60",
    nodeId: "be-python-web",
    question: "Celery 的架构？如何保证异步任务的可靠性？",
    answer: `Celery：Python 分布式任务队列，常用于异步任务（发邮件/导出/定时任务）。

架构：Producer（生产者）→ Broker（消息代理 Redis/RabbitMQ）→ Worker（消费者）→ Backend（结果存储 Redis/DB）。

\`\`\`python
from celery import Celery

app = Celery('tasks', broker='redis://localhost:6379/0',
             backend='redis://localhost:6379/1')

@app.task(bind=True, max_retries=3, acks_late=True)
def send_email(self, to, subject):
    try:
        smtp.send(to, subject)
    except SMTPError as exc:
        raise self.retry(exc=exc, countdown=60)  # 失败重试

# 调用
result = send_email.delay('a@b.com', 'hi')  # 异步
result.get(timeout=30)  # 等待结果
\`\`\`

可靠性保证：
1. acks_late=True：任务执行完才 ack 消息，worker 崩溃消息重投。
2. 任务重试：max_retries + retry(countdown) 指数退避。
3. 幂等：任务可能重复执行，业务需幂等（去重表/状态机）。
4. 死信队列：超过重试次数进死信，人工处理。
5. 任务超时：time_limit（硬超时，SIGKILL）/ soft_time_limit（软超时，抛异常）。
6. 持久化 broker：RabbitMQ 持久化队列 + 消息 delivery_mode=2。

定时任务：Celery Beat 调度器，读 schedule 配置定时投递任务。

常见问题：
- 任务堆积：加 worker/并发数，或拆分大任务。
- 内存泄漏：worker 长跑泄漏，配置 max_tasks_per_child 定期重启 worker。

关键：acks_late + 重试 + 幂等保证可靠；Beat 做定时；max_tasks_per_child 防泄漏。`,
    keyPoints: ["Broker+Worker+Backend 架构", "acks_late + 重试保可靠", "幂等防重复执行"],
    followUps: ["Celery 和 RQ/Dramatiq 区别？", "如何监控 Celery 任务？"],
    favorited: false,
  },
  // ===== Go 基础（扩充） =====
  {
    id: "be-61",
    nodeId: "be-go-basic",
    question: "Go 的 GMP 调度模型？goroutine 为什么轻量？",
    answer: `GMP 模型：
- G（goroutine）：用户态协程，~2KB 起始栈可动态增长，由 runtime 调度。
- M（Machine/Thread）：操作系统线程，真正执行 G。
- P（Processor）：逻辑处理器，持本地 G 队列，GOMAXPROCS 决定数量。M 必须绑定 P 才能执行 G。

调度流程：
1. 新建 goroutine 放入当前 P 的本地队列（满则放全局队列）。
2. M 绑定 P，从本地队列取 G 执行。
3. 本地空了 → 从全局队列取 → 从其他 P 偷（work stealing）。
4. G 阻塞（系统调用）→ M 解绑 P，P 给其他 M 用；阻塞返回后 M 尝试找空闲 P，找不到则 G 入全局队列，M 休眠。

\`\`\`go
func main() {
    runtime.GOMAXPROCS(4) // P 数量，默认 = CPU 核数
    for i := 0; i < 100; i++ {
        go func(i int) { // 创建 G
            time.Sleep(time.Second)
            fmt.Println(i)
        }(i)
    }
    select {} // 阻塞主 goroutine
}
\`\`\`

goroutine 轻量原因：
1. 栈小（2KB 起步，按需扩缩），线程栈固定 MB 级。
2. 用户态调度，切换只需保存少量寄存器，无内核态切换开销。
3. 创建/销毁在 runtime 内完成，不经过系统调用。

关键：GMP 中 P 是核心（本地队列+调度权限）；work stealing 均衡负载；系统调用阻塞时 P 让渡保持并行。`,
    keyPoints: ["G 协程/M 线程/P 逻辑处理器", "work stealing 均衡负载", "goroutine 2KB 栈用户态切换"],
    followUps: ["系统调用阻塞时 GMP 如何处理？", "GOMAXPROCS 设多少合适？"],
    favorited: false,
  },
  {
    id: "be-62",
    nodeId: "be-go-basic",
    question: "Go 的 error 处理机制？error 和 panic 的区别？如何自定义错误？",
    answer: `Go 错误处理哲学：error 是值，显式处理而非异常。函数多返回值，调用方必须检查 err。

\`\`\`go
// 标准模式：多返回值
func divide(a, b int) (int, error) {
    if b == 0 {
        return 0, errors.New("divide by zero") // 创建错误
    }
    return a / b, nil
}

if r, err := divide(10, 0); err != nil {
    log.Println(err) // 显式处理
    return
}

// 自定义错误类型
type BizError struct {
    Code int
    Msg  string
}
func (e *BizError) Error() string { return fmt.Sprintf("[%d] %s", e.Code, e.Msg) }

func find(id int) (*User, error) {
    if id <= 0 {
        return nil, &BizError{Code: 400, Msg: "invalid id"}
    }
    return &User{}, nil
}

// errors.Is / errors.As 判断（Go 1.13+）
if errors.Is(err, sql.ErrNoRows) { ... }
var be *BizError
if errors.As(err, &be) { fmt.Println(be.Code) }

// fmt.Errorf 包装 + %w 保留链
fmt.Errorf("find user: %w", err)
\`\`\`

error vs panic：
- error：可预期的业务错误，调用方处理。
- panic：不可恢复的严重错误（数组越界/nil 指针/初始化失败），向上传播直到 recover 或崩溃。
- panic/recover 类似 try/catch，但仅用于不可恢复场景，不用于业务流程。

\`\`\`go
defer func() {
    if r := recover(); r != nil {
        log.Println("recovered:", r) // 防止崩溃
    }
}()
panic("fatal") // 仅严重错误
\`\`\`

关键：error 是值需显式检查；自定义错误实现 Error()；errors.Is/As 判断；panic 仅不可恢复场景。`,
    keyPoints: ["error 是值显式处理", "自定义错误实现 Error() 接口", "panic 仅不可恢复+recover"],
    followUps: ["Go 1.13 的错误包装（%w）原理？", "为什么 Go 不用异常而用 error？"],
    favorited: false,
  },
  {
    id: "be-63",
    nodeId: "be-go-basic",
    question: "Go map 为什么并发不安全？sync.Map 和加锁 map 怎么选？",
    answer: `Go 内置 map 不是并发安全的：并发读写会触发 fatal error: concurrent map read and map write（直接 panic，且无法 recover），因为 map 内部没有锁，扩容/搬迁时并发访问会破坏结构。

\`\`\`go
// 并发不安全：fatal error
m := make(map[int]int)
go func() { for i := 0; i < 1000; i++ { m[1] = i } }()
go func() { for i := 0; i < 1000; i++ { _ = m[1] } }()

// 方案1：sync.RWMutex + map（读多写少）
var (
    mu sync.RWMutex
    m  = make(map[string]int)
)
func get(k string) int {
    mu.RLock(); defer mu.RUnlock()
    return m[k]
}
func set(k string, v int) {
    mu.Lock(); defer mu.Unlock()
    m[k] = v
}
\`\`\`

sync.Map：官方并发安全 map，用空间换时间，适合读多写少且 key 稳定。

\`\`\`go
var sm sync.Map
sm.Store("a", 1)
v, ok := sm.Load("a")
sm.LoadOrStore("b", 2) // 不存在则存
sm.Range(func(k, v any) bool { return true })
sm.Delete("a")
\`\`\`

选型：
- 写多/通用：sync.RWMutex + map（更灵活，类型安全需自己包装）。
- 读多写少、key 稳定、高并发：sync.Map（无锁读路径，性能好）。
- 强类型：用泛型封装或第三方 concurrent-map。

sync.Map 原理：read map（无锁 atomic 读）+ dirty map（有锁写），miss 多时 dirty 升级为 read。

关键：map 并发读写直接 fatal；读多写少用 sync.Map；通用用 RWMutex+map。`,
    keyPoints: ["map 并发读写直接 fatal", "RWMutex+map 通用", "sync.Map 读多写少无锁读"],
    followUps: ["sync.Map 的 read/dirty 结构？", "如何用泛型封装并发安全 map？"],
    favorited: false,
  },
  {
    id: "be-64",
    nodeId: "be-go-basic",
    question: "Go defer 的执行顺序和参数求值时机？defer 有哪些陷阱？",
    answer: `defer：函数返回前（LIFO 后进先出）执行，常用于资源释放。defer 参数在 defer 语句时求值，不是执行时。

\`\`\`go
// 1. LIFO 顺序：3 2 1
func main() {
    defer fmt.Println(1)
    defer fmt.Println(2)
    defer fmt.Println(3)
}

// 2. 参数立即求值（defer 语句时，非执行时）
func a() {
    i := 1
    defer fmt.Println(i) // 打印 1（立即求值）
    i = 10
    return
}

// 3. 闭包引用变量（执行时取最新值）
func b() {
    i := 1
    defer func() { fmt.Println(i) }() // 打印 10（闭包引用）
    i = 10
    return
}
\`\`\`

defer 与 return 值：return 先赋值返回值，再执行 defer，最后返回。命名返回值会被 defer 修改。

\`\`\`go
func c() (result int) {
    defer func() { result++ }() // 命名返回值，defer 可改
    return 5  // result=5 → defer 改成 6 → 返回 6
}
// 匿名返回值 defer 改不了
func d() int {
    r := 5
    defer func() { r++ }() // 改的是局部 r，不影响返回值
    return r  // 返回 5
}
\`\`\`

性能：defer 有开销（注册/调用），Go 1.14+ 对简单 defer 做了内联优化（open-coded defer），开销大幅降低，但循环内 defer 仍有成本，建议循环内用闭包或显式释放。

陷阱：
1. defer 在 for 循环累积，资源延迟到函数结束才释放 → 用匿名函数立即释放。
2. defer 闭包捕获循环变量（Go 1.22 前）→ 全是最后一个值。
3. defer nil 函数 panic。

关键：defer LIFO + 参数立即求值；命名返回值可被 defer 修改；循环内 defer 注意及时释放。`,
    keyPoints: ["LIFO 后进先出", "参数 defer 时求值，闭包执行时取值", "命名返回值可被 defer 改"],
    followUps: ["Go 1.22 循环变量作用域变化？", "defer 的性能开销？"],
    favorited: false,
  },
  // ===== Go 并发（扩充） =====
  {
    id: "be-65",
    nodeId: "be-go-concurrent",
    question: "channel 什么时候该关闭？关闭 channel 的原则和陷阱？",
    answer: `channel 关闭原则：只由发送方关闭，接收方不应关闭。关闭表示"不再有数据"，用于通知接收方结束（如 range 退出）。

\`\`\`go
// 正确：发送方 close，接收方 range 退出
func producer(ch chan<- int) {
    defer close(ch) // 发送完关闭
    for i := 0; i < 10; i++ { ch <- i }
}

func consumer(ch <-chan int) {
    for v := range ch { // close 后 range 自动退出
        fmt.Println(v)
    }
}

// 判断 channel 是否关闭
v, ok := <-ch // ok=false 表示已关闭且无数据
\`\`\`

关闭陷阱：
1. 重复 close：panic: close of closed channel。
2. 向已关闭 channel 发送：panic: send on closed channel。
3. 关闭 nil channel：永久阻塞（不会 panic，但 close(nil) 会 panic）。
4. 多个发送者关闭：无法确定谁该 close → 用额外"停止"信号 channel 或 sync.Once。

\`\`\`go
// 多生产者优雅退出：额外 done channel
func worker(id int, ch chan<- int, done <-chan struct{}) {
    for {
        select {
        case <-done:
            return // 收到停止信号
        case ch <- produce(id):
        }
    }
}
// 协调者：关闭 done 通知所有 worker 退出，最后一个再 close ch
\`\`\`

从已关闭 channel 接收：不会 panic，返回零值 + ok=false，可无限接收。所以接收方无需关心是否关闭，range/for-select 配合 ok 判断即可。

关键：发送方 close；多发送者用 done channel 协调；接收已关闭 channel 返回零值不 panic。`,
    keyPoints: ["只发送方关闭", "重复 close/send on closed 会 panic", "多发送者用 done channel 协调"],
    followUps: ["如何安全关闭多发送者 channel？", "nil channel 在 select 中的用途？"],
    favorited: false,
  },
  {
    id: "be-66",
    nodeId: "be-go-concurrent",
    question: "sync.Mutex 和 sync.RWMutex 的区别？读写锁什么场景反而更慢？",
    answer: `sync.Mutex：互斥锁，同一时刻只有一个 goroutine 持有（读/写都互斥）。

sync.RWMutex：读写锁，允许多个读同时持有，写独占。读多写少场景提升并发读吞吐。

\`\`\`go
var (
    mu   sync.Mutex
    rwmu sync.RWMutex
    data = make(map[string]int)
)

// Mutex：读写都互斥
func getMutex(k string) int {
    mu.Lock(); defer mu.Unlock()
    return data[k]
}

// RWMutex：读用 RLock（可并发），写用 Lock（独占）
func getRW(k string) int {
    rwmu.RLock(); defer rwmu.RUnlock() // 多个读并发
    return data[k]
}
func setRW(k string, v int) {
    rwmu.Lock(); defer rwmu.Unlock() // 写独占
    data[k] = v
}
\`\`\`

RWMutex 反而更慢的场景：
1. 写多读少：写要等所有读释放，且写饥饿（Go RWMutex 写优先），读被阻塞，开销比 Mutex 大。
2. 临界区极短：RWMutex 内部维护 reader 计数（atomic + semaphore），RLock/RUnlock 开销 > Mutex.Lock/Unlock，临界区短时得不偿失。
3. 低并发：单 goroutine 时读写锁额外开销无收益。

RWMutex 注意：
- 不可重入（同 goroutine 重复 RLock 可能死锁，若中间有写等待）。
- 不要在持有读锁时升级为写锁（会死锁）。
- 写锁优先（防读饥饿），但读多时写延迟高。

关键：Mutex 简单通用；RWMutex 仅读多写少 + 临界区较长时才划算；否则 Mutex 更优。`,
    keyPoints: ["Mutex 读写都互斥", "RWMutex 读共享写独占", "写多/临界区短 Mutex 更优"],
    followUps: ["RWMutex 读写饥饿如何处理？", "Go 锁不可重入的原因？"],
    favorited: false,
  },
  {
    id: "be-67",
    nodeId: "be-go-concurrent",
    question: "sync.Pool 的作用和原理？为什么不能用来做缓存？",
    answer: `sync.Pool：临时对象池，复用对象减少 GC 压力，适合"短生命周期、高频创建"的对象（如 bytes.Buffer、JSON 序列化缓冲）。

\`\`\`go
var bufPool = sync.Pool{
    New: func() any { return new(bytes.Buffer) },
}

func writeJSON(v any) ([]byte, error) {
    buf := bufPool.Get().(*bytes.Buffer)
    defer func() {
        buf.Reset()            // 用完重置
        bufPool.Put(buf)       // 放回池
    }()
    enc := json.NewEncoder(buf)
    if err := enc.Encode(v); err != nil {
        return nil, err
    }
    out := make([]byte, buf.Len())
    copy(out, buf.Bytes())
    return out, nil
}
\`\`\`

原理：
- 每个 P 有本地池（poolLocal，无锁），Get/Put 优先本地，miss 时从其他 P 偷，再 miss 调 New。
- GC 时 Pool 中对象会被清除（victim 缓存一轮后清），所以 Pool 不保证对象常驻。

不能做缓存的原因：
1. GC 时清空：Pool 设计就是"临时"复用，GC 会清掉对象，不保证命中率，不适合持久缓存。
2. 无容量/过期控制：不能像 LRU 设大小和 TTL。
3. 对象可能随时消失：Get 可能返回新对象（New），不可靠。

正确用途：复用可重置的临时对象（buffer/临时结构体），减少分配和 GC。不要存"状态对象"或期望长期保留的数据。

关键：sync.Pool 是 GC 友好的临时对象复用池；GC 会清空，不能当缓存；用完必须 Reset 再 Put。`,
    keyPoints: ["复用临时对象减 GC", "P 本地池无锁 + 偷取", "GC 清空，不能当缓存"],
    followUps: ["sync.Pool 在 GC 时如何清理？", "为什么 Put 前要 Reset？"],
    favorited: false,
  },
  {
    id: "be-68",
    nodeId: "be-go-concurrent",
    question: "sync.WaitGroup 的用法？有哪些常见错误？",
    answer: `sync.WaitGroup：等待一组 goroutine 完成。主 goroutine 调 Add(n) 增加计数，子 goroutine 完成调 Done()（即 Add(-1)），Wait() 阻塞到计数归零。

\`\`\`go
func fetchAll(urls []string) []string {
    var wg sync.WaitGroup
    results := make([]string, len(urls))

    for i, url := range urls {
        wg.Add(1) // 必须在 goroutine 外 Add
        go func(i int, url string) {
            defer wg.Done()        // 完成时 Done
            results[i] = fetch(url) // 各写各的索引，无竞争
        }(i, url)
    }
    wg.Wait() // 等待全部完成
    return results
}

// 优雅退出 + 超时
func fetchWithTimeout(urls []string) {
    var wg sync.WaitGroup
    for _, u := range urls {
        wg.Add(1)
        go func(u string) { defer wg.Done(); fetch(u) }(u)
    }
    done := make(chan struct{})
    go func() { wg.Wait(); close(done) }()
    select {
    case <-done:
        fmt.Println("all done")
    case <-time.After(5 * time.Second):
        fmt.Println("timeout") // 超时放弃等待（goroutine 仍在跑）
    }
}
\`\`\`

常见错误：
1. Add 在 goroutine 内：可能 Wait 已执行时 Add 还没调用 → panic: sync: negative WaitGroup counter 或 Wait 提前返回。必须在启动 goroutine 前在主 goroutine Add。
2. 忘记 Done：用 defer wg.Done() 避免遗漏。
3. 计数器变负：Done 次数 > Add 次数 → panic。
4. Wait 后复用：WaitGroup 不可重用（Go 1.20 前会 panic），如需复用每次新建或确保 Wait 返回后再 Add。
5. WaitGroup 不能 Copy：必须传指针。

关键：Add 在 goroutine 外；defer Done；传指针不能 copy；Wait 后别复用。`,
    keyPoints: ["Add 在 goroutine 外", "defer Done 防遗漏", "传指针不能 copy"],
    followUps: ["WaitGroup 和 errgroup 区别？", "WaitGroup 能否复用？"],
    favorited: false,
  },
  // ===== MySQL（扩充） =====
  {
    id: "be-69",
    nodeId: "be-mysql",
    question: "什么是索引下推（ICP）？覆盖索引如何避免回表？",
    answer: `索引下推（Index Condition Pushdown，ICP，MySQL 5.6+）：把部分 WHERE 条件下推到存储引擎层，在遍历二级索引时就过滤，减少回表次数。

无 ICP：二级索引找到匹配记录 → 逐条回表取整行 → server 层过滤。
有 ICP：二级索引遍历时先用可下推条件过滤 → 只对满足的记录回表。

\`\`\`sql
-- 联合索引 (a, b)
SELECT * FROM t WHERE a = 1 AND b LIKE '%abc';
-- 无 ICP：a=1 的所有记录都回表，再 server 层过滤 b
-- 有 ICP：在索引上用 b LIKE 过滤，减少回表

-- explain Extra 看到 "Using index condition" 表示用了 ICP
\`\`\`

覆盖索引（Covering Index）：查询的列全部包含在索引中，无需回表（聚簇索引）。explain Extra 显示 "Using index"。

\`\`\`sql
-- 索引 (name, age)
SELECT name, age FROM user WHERE name = 'tom'; -- 覆盖索引，不回表
SELECT * FROM user WHERE name = 'tom';          -- 需回表取其他列

-- 优化：建联合索引覆盖高频查询列
ALTER TABLE user ADD INDEX idx_name_age_city (name, age, city);
SELECT name, age, city FROM user WHERE name = 'tom'; -- 覆盖索引
\`\`\`

回表代价：二级索引存主键，需再查聚簇索引（一次额外 IO）。覆盖索引消除回表，大幅提升。

关键：ICP 在索引层过滤减少回表；覆盖索引直接从索引取数据不回表；explain 看 Using index/index condition。`,
    keyPoints: ["ICP 索引层过滤减回表", "覆盖索引 Using index 不回表", "联合索引覆盖查询列"],
    followUps: ["最左前缀原则？", "ICP 在什么条件下触发？"],
    favorited: false,
  },
  {
    id: "be-70",
    nodeId: "be-mysql",
    question: "InnoDB 的行锁、间隙锁、临键锁？如何解决幻读？",
    answer: `InnoDB 锁（RR 隔离级别下）：
1. 记录锁（Record Lock）：锁住索引上的单条记录。
2. 间隙锁（Gap Lock）：锁住索引区间（开区间），防止插入，解决幻读。
3. 临键锁（Next-Key Lock）：记录锁 + 前面的间隙锁（左开右闭），RR 默认加临键锁。

\`\`\`sql
-- 表数据 id: 1, 5, 10, 15
-- 事务 A（RR）
BEGIN;
SELECT * FROM t WHERE id BETWEEN 5 AND 10 FOR UPDATE;
-- 加锁：临键 (1,5], (5,10], (10,15) → 锁住 5/10 记录 + 间隙

-- 事务 B
INSERT INTO t VALUES (7);  -- 阻塞（间隙 (5,10) 被锁）→ 防幻读
INSERT INTO t VALUES (12); -- 阻塞（间隙 (10,15) 被锁）
INSERT INTO t VALUES (20); -- 成功（间隙 (15, +∞) 未锁，除非范围查询到 15+）
\`\`\`

幻读解决：
- 快照读（普通 SELECT）：MVCC，事务内读同一快照，不会看到新插入。
- 当前读（SELECT ... FOR UPDATE / UPDATE / DELETE）：临键锁锁住间隙，阻止其他事务插入，保证再读结果一致。

\`\`\`sql
-- 当前读防幻读
BEGIN;
SELECT * FROM t WHERE id > 5 FOR UPDATE; -- 临键锁 (5,+∞)，阻止插入 id>5
-- 其他事务 INSERT id=8 阻塞
SELECT * FROM t WHERE id > 5; -- 再读结果不变
COMMIT;
\`\`\`

RC 隔离级别：无间隙锁，只有记录锁，会有幻读（但并发更高）。

死锁：多个事务间隙锁交叉等待 → 死锁。InnoDB 自动检测回滚代价小的事务。减少死锁：按固定顺序加锁、缩短事务、用 RC。

关键：RR 用临键锁（记录+间隙）解决当前读幻读；MVCC 解决快照读幻读；间隙锁可能引发死锁。`,
    keyPoints: ["临键锁=记录锁+间隙锁", "RR 当前读防幻读", "间隙锁可能死锁"],
    followUps: ["RC 为什么没有间隙锁？", "如何减少死锁？"],
    favorited: false,
  },
  {
    id: "be-71",
    nodeId: "be-mysql",
    question: "MySQL 主从复制原理？binlog 三种格式如何选？主从延迟怎么解决？",
    answer: `主从复制流程：
1. 主库执行事务，写 binlog（二进制日志）。
2. 主库 dump 线程将 binlog 发给从库 IO 线程。
3. 从库 IO 线程写 relay log（中继日志）。
4. 从库 SQL 线程读 relay log 重放，数据同步。

\`\`\`bash
# 主库配置
[mysqld]
server-id = 1
log-bin = mysql-bin
binlog_format = ROW          # 推荐 ROW
# binlog-do-db / binlog-ignore-db 过滤

# 从库配置
[mysqld]
server-id = 2
relay-log = relay-bin
read-only = 1                # 从库只读
# CHANGE MASTER TO MASTER_HOST='...', MASTER_LOG_FILE='...', MASTER_LOG_POS=...
\`\`\`

binlog 三种格式：
1. STATEMENT：记 SQL 语句，体积小，但非确定函数（NOW/UUID/RAND）导致不一致。
2. ROW：记每行变更（默认推荐），数据一致性好，但体积大。
3. MIXED：自动选择，折中。

主从延迟原因：
- 从库单 SQL 线程串行重放，跟不上主库并发写。
- 大事务/DDL 慢。
- 从库硬件差/网络抖动。

延迟解决：
1. MySQL 5.7+ 并行复制（基于组提交 group commit / WRITESET），多线程重放。
2. 大事务拆小。
3. 从库 SSD/升配。
4. 读写分离时关键写后读走主库（强制读主/延迟判断）。
5. 半同步复制（semi-sync）：主库等至少一个从库 ack 才返回，保证不丢（但降性能）。

关键：binlog → relay log → 重放；ROW 格式一致性最好；并行复制缓解延迟。`,
    keyPoints: ["binlog/relay log/SQL 线程重放", "ROW 格式一致性最好", "并行复制缓解延迟"],
    followUps: ["半同步复制原理？", "GTID 复制相比传统位点有什么优势？"],
    favorited: false,
  },
  // ===== Redis（扩充） =====
  {
    id: "be-72",
    nodeId: "be-redis",
    question: "Redis 主从、哨兵、Cluster 三种架构的区别？",
    answer: `1. 主从复制：一主多从，主写从读，读写分离。
- 简单，主库负责写+同步，从库负责读。
- 无自动故障转移：主库挂了需手动切换，可用性低。

2. 哨兵（Sentinel）：主从 + 哨兵监控，自动故障转移。
- Sentinel 进程监控主从存活，主库挂了自动选举从库升主。
- 客户端连 Sentinel 获取主库地址。
- 仍单主写入，受单机内存限制；哨兵本身要高可用（3+ 节点）。

3. Cluster：分片集群，多主多从，数据分散。
- 16384 个哈希槽（slot），CRC16(key) % 16384 定位节点。
- 每个主节点负责一部分槽，配从节点做高可用。
- 主挂由从顶上（集群内置故障检测）。
- 支持水平扩展，突破单机内存/性能上限。

\`\`\`bash
# Cluster 创建（6 节点 3主3从）
redis-cli --cluster create 127.0.0.1:7000 127.0.0.1:7001 ... \
  --cluster-replicas 1

# 客户端（带 MOVED/ASK 重定向）
redis-cli -c -p 7000 set k v  # -c 自动跟随重定向

# 扩容：添加节点 + 迁移 slot
redis-cli --cluster add-node 127.0.0.1:7006 127.0.0.1:7000
redis-cli --cluster reshard 127.0.0.1:7000  # 迁移槽
\`\`\`

Cluster 限制：
- 不支持跨 slot 的多键操作（除非 hash tag 同 slot）。
- 事务/Lua 脚本需在单 slot。
- 客户端需感知集群拓扑。

选型：数据量小用主从/哨兵；数据量大需扩展用 Cluster。

关键：主从无容灾、哨兵自动故障转移单主、Cluster 分片扩展多主。`,
    keyPoints: ["主从读写分离无容灾", "哨兵自动故障转移", "Cluster 16384 槽分片扩展"],
    followUps: ["Cluster 的 Gossip 协议？", "hash tag 怎么让多 key 在同 slot？"],
    favorited: false,
  },
  {
    id: "be-73",
    nodeId: "be-redis",
    question: "Redis 的过期策略和内存淘汰策略？",
    answer: `过期策略（key 到期如何删除）：
1. 惰性删除：访问 key 时检查过期，过期则删。优点省 CPU，缺点过期 key 不访问会堆积。
2. 定期删除：每隔一段时间随机抽一批 key 检查过期，删过期的。配合惰性删除兜底。
Redis 同时用两者：惰性 + 定期（每 100ms 抽样）。

\`\`\`redis
SET token:abc "data" EX 3600   # 3600 秒过期
EXPIRE key 60                   # 设置过期
TTL key                          # 剩余时间（-1 永久，-2 不存在/已过期）
PERSIST key                      # 移除过期
\`\`\`

内存淘汰策略（内存满 maxmemory 时如何淘汰）：8 种
- noeviction：不淘汰，写入报错（默认）。
- allkeys-lru / volatile-lru：所有/有过期 key 中 LRU 淘汰。
- allkeys-lfu / volatile-lfu：LFU（频率）淘汰（Redis 4.0+）。
- allkeys-random / volatile-random：随机淘汰。
- volatile-ttl：优先淘汰 TTL 短的。

\`\`\`conf
# redis.conf
maxmemory 4gb
maxmemory-policy allkeys-lru   # 缓存场景推荐
\`\`\`

LRU 实现：Redis 用近似 LRU（采样），默认随机抽 5 个淘汰最久未用，sample 越大越精确越慢（maxmemory-samples）。
LFU：用 Morris 计数器概率性记录访问频率，更精准反映热点。

选型：纯缓存用 allkeys-lru/lfu；混合存储（部分持久数据）用 volatile-lru 只淘汰有过期的。

关键：惰性+定期删除过期；内存满按淘汰策略；缓存推荐 allkeys-lru/lfu。`,
    keyPoints: ["惰性+定期删除过期", "8 种淘汰策略", "近似 LRU/LFU 采样"],
    followUps: ["LRU 和 LFU 哪个更适合缓存？", "Redis 近似 LRU 为什么不用双向链表？"],
    favorited: false,
  },
  {
    id: "be-74",
    nodeId: "be-redis",
    question: "Redlock 算法的原理和争议？单节点 Redis 分布式锁有哪些坑？",
    answer: `单节点 Redis 分布式锁：SET key value NX PX 30000，value 用唯一 requestId，释放用 Lua 校验 requestId 防误删。

\`\`\`lua
-- 释放锁的 Lua 脚本（原子：校验 + 删除）
if redis.call('get', KEYS[1]) == ARGV[1] then
    return redis.call('del', KEYS[1])
else
    return 0
end
\`\`\`

单节点锁的坑：
1. 锁过期业务未完成 → 别人拿到锁，并发。解决：Redisson 看门狗（watchdog）自动续期。
2. 主从切换丢锁：主库加锁后未同步到从库就宕机，从库升主后锁丢失 → Redlock 解决。
3. 误删别人锁 → Lua 校验 requestId。

Redlock（Antirez 提出）：在 N（通常 5）个独立 Redis 主节点上同时加锁，超过半数（N/2+1）成功且耗时小于锁 TTL，则加锁成功。

\`\`\`bash
# Redlock 流程（5 节点）
1. 记录开始时间 T1。
2. 依次向 5 个节点 SET NX PX 加锁（短超时）。
3. 加锁成功数 >= 3 且 (TTL - (T2-T1)) > 0 → 加锁成功。
4. 失败则向所有节点释放锁。
\`\`\`

争议（Martin Kleppmann 批评）：
1. 依赖时钟：节点时钟漂移/跳变会导致锁提前过期或判断错误。
2. GC 暂停：客户端 STW 期间锁过期，恢复后仍以为持有锁，导致并发。
3. Redlock 既不是 AP 也不是严格 CP：网络分区时仍有问题。

实践建议：
- 大多数场景单节点 Redis 锁（+Redisson 看门狗）足够，兜底用业务幂等。
- 强一致要求用 ZooKeeper/etcd 临时顺序节点锁。
- Redlock 适合对可靠性有要求但不极端的场景。

关键：单节点锁用 NX+Lua+看门狗；Redlock 多数派但对时钟/GC 敏感；强一致用 ZK。`,
    keyPoints: ["单节点 NX+Lua 防误删+看门狗续期", "Redlock 多数派加锁", "争议：时钟/GC/分区"],
    followUps: ["Redisson 看门狗如何续期？", "ZooKeeper 锁为什么更可靠？"],
    favorited: false,
  },
  // ===== 消息队列（扩充） =====
  {
    id: "be-75",
    nodeId: "be-mq",
    question: "如何保证消息的顺序性？全局有序和分区有序的区别？",
    answer: `顺序消息分两类：
1. 全局有序：整个 Topic 单分区（单队列），所有消息严格有序。吞吐低（无并行），很少用。
2. 分区/分片有序：同一业务 key 的消息发到同一分区，分区内有序，不同分区并行。主流方案。

Kafka/RocketMQ 顺序保证：
- 生产端：相同 key 用相同 hash → 同一 partition（Kafka）/queue（RocketMQ）。
- 消费端：单分区单消费者串行消费。

\`\`\`java
// Kafka：按 key 路由到同一分区
ProducerRecord<String, String> rec = new ProducerRecord<>(
    "orders", orderId, payload); // key=orderId，同订单同分区
producer.send(rec);

// RocketMQ：MessageQueueSelector
producer.send(msg, (mqs, m, arg) -> {
    int idx = Math.abs(arg.hashCode()) % mqs.size();
    return mqs.get(idx); // 同 orderId 选同 queue
}, orderId);
\`\`\`

消费有序的坑：
1. 消费端多线程：分区分配给多线程会乱序 → 必须单线程串行，或按 key 二级分发（HashedWheelTimer/锁）。
2. 消费失败重试：失败消息重投到队尾会破坏顺序 → 阻塞等待或本地排队。
3. 扩容缩容：rebalance 时分区重分配，瞬间可能乱序。

RocketMQ 顺序消费：MessageListenerOrderly（单线程消费一个队列），vs 并发消费 MessageListenerConcurrently。

权衡：顺序消费牺牲并行度，吞吐下降。需在"顺序"和"吞吐"间取舍，多数业务只需分区有序（同 key 有序）。

关键：全局有序单分区吞吐低；分区有序按 key 路由 + 单线程消费；消费失败处理影响顺序。`,
    keyPoints: ["全局有序单分区吞吐低", "分区有序按 key 路由+串行消费", "消费失败重试破坏顺序"],
    followUps: ["Kafka rebalance 会不会破坏顺序？", "如何兼顾顺序和吞吐？"],
    favorited: false,
  },
  {
    id: "be-76",
    nodeId: "be-mq",
    question: "消息堆积如何处理？消费者追不上生产者怎么办？",
    answer: `消息堆积：生产速度 > 消费速度，消息在 broker 堆积，影响延迟和磁盘。

应急处理：
1. 临时扩容消费者（注意分区数限制：Kafka 消费者数不能超过分区数，否则多余消费者空闲）。
2. 增加分区数（Kafka 可动态增分区，但会破坏 key 顺序）。
3. 消费端降级：非核心逻辑跳过/异步化，只处理关键字段。

\`\`\`java
// 临时快速消费：跳过非关键处理，先清积压
@KafkaListener(topics = "orders")
public void on(Message msg) {
    if (isBacklog()) {
        saveToDB(msg);           // 只存，不执行重逻辑
        // 后台任务补偿处理
    } else {
        processFully(msg);       // 正常处理
    }
}
\`\`\`

长期方案：
1. 提升单机消费能力：批量消费（一次拉一批）、异步处理（消费后丢线程池）、业务优化（减少 DB 操作/缓存）。
2. 水平扩容：增加分区 + 消费者。
3. 死信队列：处理失败的消息转 DLQ，不阻塞主流程。
4. 削峰填谷：消费者按能力拉取（max.poll.records 控制批量），避免压垮下游。

Kafka 跳过堆积（极端情况）：重置消费位点到最新（跳过历史），丢失数据但恢复实时。

RocketMQ：堆积超过阈值可临时调大 consumeThreadMin/Max，或用 PUSH 模式自适应。

关键：应急扩消费者/分区+降级；长期提单机吞吐+水平扩容；失败转死信不阻塞。`,
    keyPoints: ["扩消费者受分区数限制", "批量+异步提单机吞吐", "死信队列防阻塞"],
    followUps: ["Kafka 消费者数超过分区数会怎样？", "如何监控消息堆积？"],
    favorited: false,
  },
  {
    id: "be-77",
    nodeId: "be-mq",
    question: "Kafka、RocketMQ、RabbitMQ 的对比与选型？",
    answer: `三者定位不同：

Kafka：高吞吐流式消息平台。
- 顺序写磁盘 + 零拷贝 + 批量，百万级 TPS。
- 拉模式（消费者主动拉），适合日志/大数据/流处理。
- 顺序消息按 partition，事务支持弱（有事务但开销大）。
- 生态强（Kafka Streams/Connect/Flink 集成）。

RocketMQ：阿里开源，金融级可靠。
- 基于 Kafka 思想优化，支持事务消息（半消息+回查）。
- 支持定时/延迟消息、顺序消息、死信队列。
- 单机吞吐低于 Kafka（十万级），但延迟消息/事务更强。
- 适合电商交易/金融场景。

RabbitMQ：AMQP 协议，路由能力强。
- 丰富的交换器（direct/fanout/topic/headers），灵活路由。
- 推模式，低延迟，吞吐万级。
- 消息确认（ack/nack）、死信、TTL、镜像队列高可用。
- 适合复杂路由/低延迟/小规模业务。

\`\`\`text
| 维度     | Kafka        | RocketMQ     | RabbitMQ     |
|----------|--------------|--------------|--------------|
| 吞吐     | 百万级       | 十万级       | 万级         |
| 延迟     | ms 级        | ms 级        | μs~ms 级     |
| 顺序     | 分区有序     | 分区有序     | 队列有序     |
| 事务消息 | 弱           | 强（半消息） | 无           |
| 延迟消息 | 无原生       | 原生支持     | 插件/TTL+DLX |
| 路由     | 弱           | 一般         | 强           |
| 场景     | 日志/大数据  | 交易/金融    | 业务路由     |
\`\`\`

选型：
- 日志采集/大数据流：Kafka。
- 电商交易/事务/延迟：RocketMQ。
- 复杂路由/低延迟/中小规模：RabbitMQ。

关键：Kafka 吞吐王，RocketMQ 事务/延迟强，RabbitMQ 路由灵活。`,
    keyPoints: ["Kafka 高吞吐日志流", "RocketMQ 事务/延迟消息", "RabbitMQ 路由强低延迟"],
    followUps: ["RocketMQ 事务消息原理？", "RabbitMQ 的镜像队列与 quorum queue？"],
    favorited: false,
  },
  {
    id: "be-78",
    nodeId: "be-mq",
    question: "死信队列和延迟消息的实现原理？",
    answer: `死信队列（DLQ，Dead Letter Queue）：消息变成"死信"后被转发到的特殊队列，用于后续排查/重试。

消息变死信的条件（RabbitMQ）：
1. 消息被 nack/reject 且 requeue=false。
2. 消息 TTL 过期。
3. 队列长度超限。

\`\`\`python
# RabbitMQ：绑定死信交换器
args = {
    "x-dead-letter-exchange": "dlx.exchange",
    "x-dead-letter-routing-key": "dlx.key",
    "x-message-ttl": 60000,  # 60s 后进死信 → 实现延迟
}
channel.queue_declare("orders", arguments=args)
\`\`\`

延迟消息实现：
1. RabbitMQ：TTL + DLX。消息进带 TTL 的队列，过期转死信队列被消费 = 延迟。
   缺点：TTL 队列头阻塞（队头未过期，后面过期也出不去）→ 用 rabbitmq_delayed_message_exchange 插件。
2. RocketMQ：原生延迟消息（开源版固定 18 个延迟级别 1s/5s/...2h；5.x 支持任意时间）。
3. Redis：ZSet（score=到期时间）轮询，或 Redisson DelayedQueue。
4. 时间轮：本地/分布式时间轮，精确延迟。

\`\`\`java
// RocketMQ 延迟消息
Message msg = new Message("topic", "delay demo".getBytes());
msg.setDelayTimeLevel(3); // 1s/5s/10s/... 第 3 级 = 10s
producer.send(msg);

// Redis ZSet 延迟任务
long execAt = System.currentTimeMillis() + 60_000;
jedis.zadd("delay_tasks", execAt, taskId);
// 定时轮询
Set<String> due = jedis.zrangeByScore("delay_tasks", 0, now);
\`\`\`

死信处理：消费死信队列 → 人工介入/告警/有限次重试后丢弃，避免无限重试堆积。

关键：死信队列接收失败/过期/超长消息；延迟靠 TTL+DLX/原生延迟/ZSet/时间轮。`,
    keyPoints: ["死信：nack/TTL/超长", "延迟：TTL+DLX/原生/ZSet", "死信需有限重试+告警"],
    followUps: ["RabbitMQ TTL 队列头阻塞问题？", "RocketMQ 5.x 任意延迟怎么实现？"],
    favorited: false,
  },
  // ===== 微服务（扩充） =====
  {
    id: "be-79",
    nodeId: "be-microservice",
    question: "分布式链路追踪的原理？TraceId/SpanId 如何传递？",
    answer: `链路追踪：记录一个请求经过各微服务的调用链，用于排查延迟/故障定位。

核心概念（OpenTracing/OpenTelemetry）：
- Trace：一次完整请求链路，唯一 TraceId。
- Span：一次操作（一个服务调用），有 SpanId + ParentSpanId，组成有向无环树。
- 上下文传播：TraceId/SpanId 通过请求头跨服务传递。

\`\`\`java
// OpenTelemetry 注入/提取（HTTP 头）
// 服务 A 调用服务 B 时，注入 trace 上下文
TextMapPropagator prop = openTelemetry.getPropagators().getTextMapPropagator();
prop.inject(Context.current(), headers, (c, k, v) -> c.put(k, v));
// headers 带 traceparent: 00-{traceId}-{spanId}-01

// 服务 B 接收时提取
Context ctx = prop.extract(Context.current(), headers, getter);
Span span = tracer.spanBuilder("handleB").setParent(ctx).startSpan();
\`\`\`

传递方式：
- HTTP：W3C traceparent 头（00-<traceId>-<spanId>-<flags>）。
- RPC/gRPC：metadata。
- MQ：消息属性（生产者注入，消费者提取）。
- 异步线程：需手动透传 Context（或用 ThreadLocal/TransmittableThreadLocal）。

采样：全量采集开销大，通常采样 1-10%，慢请求/错误必采（tail-based sampling）。

主流方案：SkyWalking（Java agent 无侵入）、Jaeger、Zipkin、阿里 ARMS。OpenTelemetry 是统一标准。

关键：TraceId 贯穿全链路，SpanId 构成父子树；跨服务靠请求头传播；采样降低开销。`,
    keyPoints: ["Trace/Span 组成调用树", "traceparent 头跨服务传递", "采样降开销"],
    followUps: ["OpenTelemetry 和 SkyWalking 区别？", "异步线程如何透传 trace？"],
    favorited: false,
  },
  {
    id: "be-80",
    nodeId: "be-microservice",
    question: "API 网关的作用？Spring Cloud Gateway 的核心概念？",
    answer: `API 网关：微服务统一入口，承担横切关注点：
- 路由转发（按路径转发到后端服务）。
- 鉴权（统一 JWT/Token 校验）。
- 限流熔断。
- 日志监控/链路追踪。
- 协议转换（HTTP→gRPC）、请求/响应改写。
- 灰度发布（按头/权重路由）。

Spring Cloud Gateway 核心：
- Route：路由（id + predicate + filter）。
- Predicate：断言（Path/Method/Header/Host/Query/After 等）。
- Filter：过滤器（前置/后置，全局/路由级）。
- 基于 Netty + Reactor 异步非阻塞，性能优于 Zuul 1.x。

\`\`\`java
// 配置式路由
spring.cloud.gateway.routes:
  - id: order-service
    uri: lb://order-service        # 负载均衡
    predicates:
      - Path=/api/orders/**
    filters:
      - StripPrefix=1              # 去掉 /api 前缀
      - AddRequestHeader=X-Trace,abc

// 编程式 + 全局过滤器（鉴权）
@Component
public class AuthFilter implements GlobalFilter {
  public Mono<Void> filter(ServerWebExchange ex, GatewayFilterChain chain) {
    String token = ex.getRequest().getHeaders().getFirst("Authorization");
    if (!jwtUtil.verify(token)) {
      ex.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
      return ex.getResponse().setComplete();
    }
    return chain.filter(ex); // 放行
  }
}
\`\`\`

限流：内置 RequestRateLimiter（基于 Redis + Lua 令牌桶）。
服务发现：集成 Nacos/Eureka，uri 用 lb://service-name 自动负载均衡。

关键：网关统一入口做鉴权/限流/路由；Gateway 基于 Reactor 异步高性能；Predicate 路由 + Filter 增强。`,
    keyPoints: ["网关统一鉴权/限流/路由", "Gateway Route+Predicate+Filter", "Reactor 异步高性能"],
    followUps: ["Gateway 和 Zuul 区别？", "网关如何做灰度发布？"],
    favorited: false,
  },
  {
    id: "be-81",
    nodeId: "be-microservice",
    question: "配置中心的作用？Nacos 如何实现配置动态推送？",
    answer: `配置中心：集中管理各环境/服务配置，支持动态更新（不重启生效）、版本回滚、灰度发布、命名空间隔离。

解决的问题：
1. 配置散落各服务，难统一管理。
2. 改配置需重新打包部署。
3. 多环境（dev/test/prod）配置切换。
4. 敏感配置安全管控。

Nacos 配置模型：Namespace（环境隔离）→ Group（业务分组）→ DataId（配置文件）。

\`\`\`yaml
# bootstrap.yml
spring:
  application:
    name: order-service
  cloud:
    nacos:
      config:
        server-addr: nacos:8848
        namespace: prod
        group: ORDER
        file-extension: yaml

# 注入配置
@Value("\${order.timeout:3000}")
private int timeout;

// 配置变更自动刷新
@RefreshScope
@RestController
public class OrderController {
  @Value("\${order.timeout:3000}")
  private int timeout; // 配置变更后自动更新
}
\`\`\`

动态推送原理（长轮询）：
1. 客户端启动拉取配置并缓存本地。
2. 客户端发起长轮询（hold 住请求 30s），监听配置变化。
3. 服务端配置变更 → 持有的长轮询立即返回 → 客户端拉取新配置。
4. 推送变更内容到 @RefreshScope Bean（销毁重建）。

对比：Apollo 也是长轮询；Spring Cloud Config 需配合 Bus（MQ 广播）或 webhook。

关键：配置中心集中管理+动态推送；Nacos 用长轮询实现准实时推送；@RefreshScope 让 Bean 感知变更。`,
    keyPoints: ["集中管理+动态推送不重启", "Namespace/Group/DataId 模型", "长轮询准实时推送"],
    followUps: ["Nacos 和 Apollo 区别？", "@RefreshScope 如何实现配置刷新？"],
    favorited: false,
  },
  {
    id: "be-82",
    nodeId: "be-microservice",
    question: "微服务间通信方式？gRPC 和 REST 如何选型？",
    answer: `微服务通信两大类：

1. 同步通信：
- REST（HTTP/JSON）：通用、易调试、跨语言、生态好。性能一般（文本序列化、HTTP 开销）。
- gRPC（HTTP/2 + Protobuf）：二进制高效、强类型、双向流、跨语言。需 proto 定义，调试稍复杂。
- Dubbo（TCP + 自定义协议）：阿里 RPC 框架，高性能，Java 生态。

2. 异步通信：
- 消息队列（Kafka/RocketMQ）：解耦、削峰、最终一致。适合非实时业务。

\`\`\`protobuf
// gRPC：proto 定义
syntax = "proto3";
service OrderService {
  rpc GetOrder(OrderReq) returns (OrderResp);
}
message OrderReq { int64 id = 1; }
message OrderResp { int64 id = 1; string name = 2; }
\`\`\`

\`\`\`java
// gRPC 调用（强类型 stub）
OrderServiceGrpc.OrderServiceBlockingStub stub =
    OrderServiceGrpc.newBlockingStub(channel);
OrderResp resp = stub.getOrder(OrderReq.newBuilder().setId(1L).build());

// REST 调用
Order order = restTemplate.getForObject("/orders/1", Order.class);
\`\`\`

选型：
- 对外 API / 前端交互 / 简单查询：REST（通用易用）。
- 内部服务间高频调用 / 低延迟 / 大数据量：gRPC（Protobuf 比 JSON 快 3-10 倍）。
- 解耦 / 异步 / 削峰：消息队列。
- Java 全栈追求性能：Dubbo。

gRPC 优势：HTTP/2 多路复用（单连接多请求）、Protobuf 紧凑、流式传输。
REST 优势：浏览器/curl 直接调、文档化、无需 stub。

关键：对外 REST，对内 gRPC，异步用 MQ；gRPC 性能强但需 proto，REST 通用易调试。`,
    keyPoints: ["REST 通用易调试", "gRPC Protobuf 高性能强类型", "异步用 MQ 解耦"],
    followUps: ["gRPC 为什么比 REST 快？", "Dubbo 和 gRPC 区别？"],
    favorited: false,
  },
  // ===== 分布式（扩充） =====
  {
    id: "be-83",
    nodeId: "be-distributed",
    question: "分布式事务的方案？2PC、TCC、Seata 各有什么优缺点？",
    answer: `分布式事务：跨库/跨服务保证数据一致性。

1. 2PC（两阶段提交）：
- 阶段一：协调者通知各参与者"准备"，各参与者锁资源写 undo/redo 并 ready。
- 阶段二：全部 ready → commit；任一 no → rollback。
- 缺点：同步阻塞、协调者单点、超时不确定、性能差。XA 协议是其实现。

2. TCC（Try-Confirm-Cancel）：
- Try：预留资源（冻结库存/冻结余额）。
- Confirm：确认提交（扣减冻结）。
- Cancel：取消（解冻）。
- 业务侵入大，但性能好，最终一致。

\`\`\`java
// TCC 示例（Seata @TwoPhaseBusinessAction）
@TwoPhaseBusinessAction(name = "deduct", commitMethod = "confirm", rollbackMethod = "cancel")
public boolean tryDeduct(BusinessActionContext ctx, long acctId, BigDecimal amt) {
    // Try：冻结金额（记录 frozen 字段）
    accountMapper.freeze(acctId, amt);
    return true;
}
public boolean confirm(BusinessActionContext ctx) {
    accountMapper.deductFrozen(ctx.getActionContext("acctId"), amt); // 扣减冻结
    return true;
}
public boolean cancel(BusinessActionContext ctx) {
    accountMapper.unfreeze(...); // 解冻
    return true;
}
\`\`\`

3. Seata 模式：
- AT 模式（默认）：基于本地事务 + undo log 自动补偿，业务无侵入。一阶段提交本地事务+记录 undo，二阶段异步提交/回滚（回滚用 undo 反向补偿）。有全局锁，性能中等。
- TCC 模式：手动实现 Try/Confirm/Cancel，性能高。
- Saga 模式：长事务，正向 + 补偿，适合多步骤业务。
- XA 模式：强一致，性能差。

4. 本地消息表 / 事务消息（最终一致）：
- 本地事务 + 消息表同库写入 → 定时/MQ 投递 → 消费方幂等处理。最终一致，性能好，主流电商方案。

选型：强一致短事务用 Seata AT；高性能用 TCC；长流程用 Saga；最终一致用事务消息。

关键：2PC 强一致但阻塞；TCC 性能好侵入大；Seata AT 无侵入；消息表最终一致最常用。`,
    keyPoints: ["2PC 阻塞强一致", "TCC Try/Confirm/Cancel 侵入大", "Seata AT 无侵入+消息表最终一致"],
    followUps: ["Seata AT 的全局锁原理？", "事务消息如何保证最终一致？"],
    favorited: false,
  },
  {
    id: "be-84",
    nodeId: "be-distributed",
    question: "一致性哈希的原理？如何解决数据倾斜和节点扩容迁移？",
    answer: `一致性哈希：把节点和 key 都映射到 0~2³² 的哈希环上，key 顺时针找到的第一个节点即为归属节点。相比 hash % N，节点增减只影响相邻段数据，迁移量小。

\`\`\`python
import hashlib

def hash_fn(s):
    return int(hashlib.md5(s.encode()).hexdigest(), 16) % (2**32)

class ConsistentHash:
    def __init__(self, nodes=None, replicas=3):
        self.ring = {}       # 哈希值 → 节点
        self.replicas = replicas  # 虚拟节点数
        for n in (nodes or []):
            self.add_node(n)

    def add_node(self, node):
        for i in range(self.replicas):
            h = hash_fn(f"{node}#{i}")   # 虚拟节点
            self.ring[h] = node
        self._sorted = sorted(self.ring)

    def remove_node(self, node):
        for i in range(self.replicas):
            self.ring.pop(hash_fn(f"{node}#{i}"), None)
        self._sorted = sorted(self.ring)

    def get_node(self, key):
        h = hash_fn(key)
        # 顺时针找第一个 >= h 的节点
        for slot in self._sorted:
            if slot >= h:
                return self.ring[slot]
        return self.ring[self._sorted[0]]  # 环回 0
\`\`\`

虚拟节点（Virtual Node）：解决数据倾斜。每个物理节点映射多个虚拟节点（如 150 个）分散到环上，使数据分布均匀。节点少时尤其重要。

扩容：新节点加入，只需迁移环上新节点到前一个节点之间的 key，迁移量 ≈ 总数据/N。
缩容：移除节点，其数据迁到顺时针下一个节点。

对比 hash % N：N 变化时几乎所有 key 要重新分布（迁移量大）；一致性哈希只迁移相邻段。

应用：Redis Cluster 用 hash slot（16384 槽，类似思想但固定槽）；Memcached 一致性哈希；Dubbo 负载均衡。

关键：哈希环顺时针找节点；虚拟节点解决倾斜；增减只迁移相邻段。`,
    keyPoints: ["哈希环顺时针定位", "虚拟节点解决倾斜", "增减节点只迁移相邻段"],
    followUps: ["Redis Cluster 为什么用固定槽而非一致性哈希环？", "虚拟节点数设多少合适？"],
    favorited: false,
  },
  {
    id: "be-85",
    nodeId: "be-distributed",
    question: "分布式 ID 生成方案？Snowflake 的时钟回拨问题如何解决？",
    answer: `分布式 ID 要求：全局唯一、趋势递增、高性能、高可用。

主流方案：
1. UUID：本地生成无依赖，但无序（影响 B+ 树索引性能）、长（36 字符）。
2. 数据库自增/号段：简单，但单点瓶颈。号段模式（一次取一批）缓解。
3. Snowflake（雪花）：64 位 = 1 符号位 + 41 时间戳 + 10 机器位 + 12 序列位，每毫秒 4096 个。
4. Redis INCR：原子自增，但依赖 Redis。
5. 美团 Leaf / 百度 UidGenerator：综合方案。

\`\`\`java
// Snowflake 结构
// | 1bit 符号 | 41bit 毫秒时间戳 | 10bit 机器ID | 12bit 序列 |
// 0 | 000...41 位时间 | 0000000000 机器 | 000000000000 序列 |

public synchronized long nextId() {
    long now = System.currentTimeMillis();
    if (now < lastTs) {
        // 时钟回拨！
        throw new ClockBackwardsException(now - lastTs);
    }
    if (now == lastTs) {
        seq = (seq + 1) & 0xFFF; // 4095
        if (seq == 0) now = tilNextMillis(lastTs); // 同毫秒溢出等下一毫秒
    } else {
        seq = 0;
    }
    lastTs = now;
    return (now - EPOCH) << 22 | machineId << 12 | seq;
}
\`\`\`

时钟回拨问题：机器时钟回退（NTP 同步/手动调），导致生成的时间戳 < 上次，可能生成重复 ID。

解决：
1. 回拨小（如 <5ms）：等待追平（sleep 回拨时长）。
2. 回拨大：抛异常/告警。
3. 拨号借用：用之前记录的最大时间戳 + 序列继续（百度 UidGenerator 思路）。
4. 不依赖时间：美团的雪花号段模式，每次取号段。
5. Leaf-Snowflake：用 ZooKeeper 持久化上次时间戳，启动时校验回拨。

机器位分配：数据库/ZK 分配唯一 workerId，避免冲突。

关键：Snowlake 时间戳+机器+序列；时钟回拨用等待/异常/ZK 持久化解决；机器位需唯一分配。`,
    keyPoints: ["Snowflake = 时间戳+机器ID+序列", "时钟回拨等待/异常/ZK", "workerId 唯一分配"],
    followUps: ["Snowflake 为什么趋势递增？", "号段模式相比雪花有什么优势？"],
    favorited: false,
  },
  {
    id: "be-86",
    nodeId: "be-distributed",
    question: "Raft 协议的原理？Leader 选举和日志复制过程？",
    answer: `Raft：易于理解的一致性算法（比 Paxos 简单），用于 etcd/Consul/TiKV。通过"选主 + 日志复制"实现强一致。

三种角色：Follower、Candidate、Leader。
Term（任期）：单调递增的逻辑时钟，防止过期 Leader。

Leader 选举：
1. 初始都是 Follower，超时未收到心跳 → 变 Candidate，Term+1，投自己，发 RequestVote。
2. 获多数票 → 成为 Leader，周期发心跳维持权威。
3. 同 Term 多 Candidate 分裂 → 超时重选（随机超时避免活锁）。

日志复制：
1. Leader 收到写请求，追加到本地日志（Uncommitted）。
2. 并发 AppendEntries 复制到所有 Follower。
3. 多数 Follower 确认 → Leader 标记 Committed，应用到状态机，返回客户端成功。
4. Leader 下次心跳告知 Follower commitIndex，Follower 应用。

\`\`\`text
写流程（3 节点）：
Client → Leader: SET x=5
Leader 日志: [x=5](uncommitted)
Leader → Follower1: AppendEntries [x=5]  ✓
Leader → Follower2: AppendEntries [x=5]  ✓  (含 Leader 自身 = 多数)
Leader commit [x=5] → 应用状态机 → 返回 Client OK
Leader 下次心跳 → Follower commit 并应用
\`\`\`

安全性保证：
- 一个 Term 只有一个 Leader。
- 已 commit 的日志不会丢：新 Leader 必含所有已 commit 日志（选举约束：候选人的日志至少和多数派一样新）。
- 日志连续匹配：AppendEntries 带 prevLogIndex/prevLogTerm，不匹配则 Follower 截断重发。

对比 Paxos：Raft 强 Leader，更易实现；Multi-Paxos 更通用但复杂。

关键：Raft 选主+多数派日志复制=强一致；已 commit 不丢；随机超时防活锁。`,
    keyPoints: ["选主+多数派日志复制", "已 commit 日志不丢", "Term 防过期 Leader"],
    followUps: ["Raft 脑裂如何处理？", "Raft 和 Paxos 的区别？"],
    favorited: false,
  },
  // ===== 系统设计（扩充） =====
  {
    id: "be-87",
    nodeId: "be-system-design",
    question: "设计一个短链系统（短 URL 生成与跳转）？",
    answer: `短链系统：长 URL → 短码 → 跳转回长 URL。

核心流程：
1. 生成：长 URL → 唯一短码（如 7 位 Base62）。
2. 存储：短码 → 长 URL 映射（DB/缓存）。
3. 跳转：访问短码 → 查长 URL → 302 重定向。

短码生成方案：
1. 哈希：MD5/MurmurHash 长URL 取前几位 + Base62。需处理冲突。
2. 自增 ID + Base62：发号器（Snowflake）分配自增 ID，转 Base62。无冲突，可预测。
3. 预生成：离线生成一批随机码存池，用时取。防预测。

\`\`\`java
// 自增 ID 转 Base62
String BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
String toBase62(long id) {
    StringBuilder sb = new StringBuilder();
    while (id > 0) {
        sb.insert(0, BASE62.charAt((int)(id % 62)));
        id /= 62;
    }
    return sb.toString(); // id=1000000000 → "15FTGf"
}
\`\`\`

\`\`\`python
# 跳转服务
@app.get("/{code}")
def redirect(code):
    url = redis.get(f"url:{code}")  # 缓存优先
    if not url:
        record = db.query("SELECT long_url FROM url_map WHERE code=?", code)
        url = record.long_url if record else None
        if not url: return 404
        redis.setex(f"url:{code}", 86400, url)  # 缓存1天
    db.execute("UPDATE url_map SET clicks=clicks+1 WHERE code=?", code)  # 统计
    return RedirectResponse(url, status_code=302)
\`\`\`

存储估算：100 亿条 URL，每条 500 字节 ≈ 5TB，分库分表（按短码 hash）。
性能：读多写少，Redis 缓存热点短码；布隆过滤器防穿透。

关键点：
- 302（临时）vs 301（永久）：301 浏览器缓存不经过服务端，无法统计；302 每次跳转可统计点击。
- 自定义短码：用户指定，需查重。
- 防滥用：频控/黑名单。

关键：发号器+Base62 生成无冲突短码；Redis 缓存 + 分库分表；302 便于统计。`,
    keyPoints: ["发号器+Base62 生成短码", "Redis 缓存+分库分表", "302 重定向便于统计"],
    followUps: ["如何防止短码被预测？", "短链过期如何处理？"],
    favorited: false,
  },
  {
    id: "be-88",
    nodeId: "be-system-design",
    question: "设计一个秒杀系统？如何应对瞬间高并发？",
    answer: `秒杀特点：瞬间流量峰值极高（万倍日常）、库存有限、防超卖、防黄牛。

架构核心：层层削峰，让尽量少请求到 DB。

1. 前端/CDN：
- 静态页面 CDN 缓存，按钮防重复点击（点击后置灰倒计时）。
- 答题/验证码错峰 + 防机器人。

2. 网关层：
- 限流（令牌桶/滑动窗口），超出直接拒绝。
- 黑名单（黄牛 IP/设备）。

3. 缓存层（核心）：
- 商品/库存预热到 Redis。
- 库存扣减用 Lua 原子操作（查库存 + 扣减 + 记录用户），防超卖。

\`\`\`lua
-- Redis Lua 原子扣库存
local stock = tonumber(redis.call('get', KEYS[1]))
local bought = redis.call('sismember', KEYS[2], ARGV[1]) -- 用户是否已买
if bought == 1 then return -2 end          -- 重复购买
if stock <= 0 then return -1 end           -- 库存不足
redis.call('decr', KEYS[1])                -- 扣库存
redis.call('sadd', KEYS[2], ARGV[1])       -- 记录已买
return 1                                   -- 成功
\`\`\`

4. 异步下单：
- 扣库存成功 → 发 MQ → 消费者异步创建订单 + 扣 DB 库存。
- 前端轮询/长连接返回结果。

\`\`\`java
// 秒杀入口
public Result seckill(long itemId, long userId) {
    Long r = redis.execute(luaScript, Arrays.asList("stock:"+itemId, "bought:"+itemId), userId);
    if (r == -1) return Result.fail("售罄");
    if (r == -2) return Result.fail("重复购买");
    mq.send(new OrderMsg(itemId, userId));  // 异步下单
    return Result.ok("排队中");             // 前端轮询订单状态
}
\`\`\`

5. DB 层：
- 库存表乐观锁：UPDATE stock SET num=num-1 WHERE item_id=? AND num>0。
- 分库分表分散订单写压力。

6. 兜底：
- 库存预热时只放少量库存到 Redis，DB 持久库存兜底。
- 熔断降级：下游（支付/物流）故障时降级。

关键：CDN/网关/缓存层层削峰；Redis Lua 原子扣库存防超卖；MQ 异步下单保护 DB。`,
    keyPoints: ["层层削峰 CDN+网关+缓存", "Redis Lua 原子扣库存防超卖", "MQ 异步下单保护 DB"],
    followUps: ["如何防止黄牛刷单？", "秒杀库存预热怎么做？"],
    favorited: false,
  },
  {
    id: "be-89",
    nodeId: "be-system-design",
    question: "设计一个 Feed 流系统（微博/Twitter 时间线）？推拉模式如何选？",
    answer: `Feed 流：用户看到关注人最新内容的列表，核心是"如何高效生成收件箱时间线"。

三种模式：

1. 拉模式（读扩散）：
- 发帖：只写入发帖人的"发件箱"。
- 读 Feed：实时查所有关注人的发件箱，合并排序。
- 优点：发帖快。缺点：读放大（关注多人时合并查询重）。适合读少/关注少。

2. 推模式（写扩散）：
- 发帖：写入自己发件箱 + 主动推送到所有粉丝的"收件箱"。
- 读 Feed：直接读自己收件箱。
- 优点：读极快。缺点：写放大（大 V 发帖要推百万粉丝）。适合粉丝少/普通用户。

3. 推拉结合（主流）：
- 普通用户（粉丝少）发帖用推模式，推到粉丝收件箱。
- 大 V（粉丝多）发帖用拉模式，只写发件箱，粉丝读时再拉合并。
- 粉丝读 Feed：收件箱（普通用户推送）+ 实时拉取关注的大 V 发件箱 → 合并排序。

\`\`\`python
# 发帖（推拉结合）
def post(user_id, content):
    post_id = snowflake_next()
    # 写自己发件箱
    redis.zadd(f"outbox:{user_id}", {post_id: now_ts})
    db.save(Post(id=post_id, uid=user_id, content=content))
    if is_big_v(user_id):
        return  # 大 V 不推，粉丝拉取时合并
    # 普通用户推到粉丝收件箱
    for fan_id in get_fans(user_id, limit=10000):
        redis.zadd(f"inbox:{fan_id}", {post_id: now_ts})
        redis.zremrangebyrank(f"inbox:{fan_id}", 0, -1001)  # 只保留最近1000条

# 读 Feed
def feed(user_id):
    inbox = redis.zrevrange(f"inbox:{user_id}", 0, 99)  # 收件箱
    big_v_posts = []
    for big_v in get_following_big_vs(user_id):
        big_v_posts += redis.zrevrange(f"outbox:{big_v}", 0, 99)  # 拉大V
    all_posts = merge_and_sort(inbox + big_v_posts)[:50]  # 合并排序
    return [db.get(pid) for pid in all_posts]
\`\`\`

存储：收件箱/发件箱用 Redis ZSet（score=时间戳）+ DB 持久化。
缓存：活跃用户收件箱常驻 Redis，不活跃回源。
排序：按时间（默认）或按互动/算法（推荐流）。

关键：推模式读快写放大，拉模式写快读放大；推拉结合大 V 拉、普通人推；ZSet 按时间排序。`,
    keyPoints: ["推模式写扩散读快", "拉模式读扩散写快", "推拉结合：大V拉+普通人推"],
    followUps: ["如何处理取关后 Feed 中的内容？", "推荐流和时间线流的区别？"],
    favorited: false,
  },
  {
    id: "be-90",
    nodeId: "be-system-design",
    question: "设计一个 IM（即时通讯）系统？消息如何保证可靠投递与顺序？",
    answer: `IM 系统核心：实时推送 + 消息可靠 + 全端同步 + 顺序一致。

架构分层：
1. 接入层：长连接网关（WebSocket/TCP），维持百万连接，负载均衡。
2. 逻辑层：消息路由、会话管理、在线状态。
3. 存储层：消息库（按会话分片）、离线消息、未读数。

\`\`\`python
# 发消息流程（可靠投递）
def send_msg(from_uid, to_uid, content):
    msg_id = snowflake_next()       # 全局唯一递增
    seq = next_seq(conversation_id(from_uid, to_uid))  # 会话内递增序号
    msg = Message(id=msg_id, seq=seq, frm=from_uid, content=content)
    # 1. 落库（会话按 hash 分片）
    db.save(msg)
    # 2. 写收件人消息队列/收件箱
    redis.zadd(f"inbox:{to_uid}", {msg_id: seq})
    # 3. 在线则推送
    if is_online(to_uid):
        push(to_uid, msg)           # 通过长连接推送
    # 4. 写发送者 ACK 待确认
    return msg_id
\`\`\`

可靠投递（不丢消息）：
1. 客户端发送：带本地消息 ID，服务端去重 + 落库 + 返回服务端 msgId。
2. 服务端推送：带 msgId，客户端收到后 ACK，服务端标记已送达；未 ACK 则重推（离线时存离线消息）。
3. 离线消息：用户上线后拉取 > last_ack_msgId 的消息。

顺序保证：
- 全局 msgId（Snowflake）趋势递增，但跨会话无需严格顺序。
- 会话内用 seq（单调递增），客户端按 seq 排序展示。
- 单聊：会话 ID = min(uid) + max(uid)，消息按 seq 顺序。

多端同步：
- 每个设备维护 last_sync_seq，上线后增量拉取 > last_sync_seq 的消息。
- 已读同步：未读数存服务端，多端同步。

存储与扩展：
- 消息按会话 ID 分库分表（hash），单会话消息顺序写入。
- 热数据（近期）Redis ZSet，冷数据归档 DB/对象存储。
- 群消息：写扩散（小群推到每人收件箱）vs 读扩散（大群成员拉取）。

推送通道：iOS 走 APNs 离线推送，Android 走厂商推送通道（FCM/小米/华为），前台用长连接。

关键：msgId 去重 + 落库 + ACK 重投保证可靠；会话内 seq 保证顺序；多端按 seq 增量同步。`,
    keyPoints: ["msgId 去重+落库+ACK 重投", "会话内 seq 保顺序", "多端按 last_sync_seq 增量同步"],
    followUps: ["群聊消息推拉如何选？", "如何保证消息不重复展示？"],
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
