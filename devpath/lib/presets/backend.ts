// lib/presets/backend.ts
// 后端工程师（含 AI 后端方向）预设：31 知识节点 + 217 道高频面试题 + 学习计划
// 覆盖：语言基础（Java/Python/Go）→ Spring 全家桶 → 数据存储（MySQL/Redis/MQ）→
//       架构与设计（分布式/微服务/系统设计/API）→ AI 后端方向（LLM 网关/RAG/Agent/模型服务化/数据管道）→
//       运维与工程（容器/CI-CD/监控/安全）
// 大厂高频题标注 bigTech: true，答案结合真实项目场景（阿里双 11、美团外卖、字节抖音、腾讯微信支付等）

import type { KnowledgeNode, Question, ScheduleItem } from "../types";

const BACKEND_NODES: KnowledgeNode[] = [
  // ===== 语言基础（8 个节点） =====
  {
    id: "be-java-collection",
    title: "Java 集合框架",
    difficulty: 3,
    prerequisites: [],
    frequency: "高",
    bigTech: true,
    summary: "List/Set/Map/Queue 体系、HashMap 底层、ConcurrentHashMap 分段锁、并发集合（CopyOnWrite/BlockingQueue）。",
    mastery: 0,
  },
  {
    id: "be-java-concurrent",
    title: "Java 并发",
    difficulty: 4,
    prerequisites: ["be-java-collection"],
    frequency: "高",
    bigTech: true,
    summary: "线程池七参数、AQS、synchronized 与 Lock、volatile、CompletableFuture、ThreadLocal 内存泄漏。",
    mastery: 0,
  },
  {
    id: "be-jvm",
    title: "JVM 原理",
    difficulty: 4,
    prerequisites: ["be-java-collection"],
    frequency: "高",
    bigTech: true,
    summary: "内存模型（堆/栈/元空间）、GC 算法与收集器（G1/ZGC）、类加载双亲委派、JIT 编译、调优与 OOM 排查。",
    mastery: 0,
  },
  {
    id: "be-spring-core",
    title: "Spring 核心",
    difficulty: 3,
    prerequisites: ["be-java-collection"],
    frequency: "高",
    bigTech: true,
    summary: "IoC 容器、AOP 动态代理（JDK/CGLIB）、Bean 生命周期、循环依赖三级缓存、声明式事务传播。",
    mastery: 0,
  },
  {
    id: "be-spring-boot",
    title: "Spring Boot",
    difficulty: 3,
    prerequisites: ["be-spring-core"],
    frequency: "高",
    bigTech: true,
    summary: "自动配置（@Conditional）、Starter 机制、Actuator 监控、配置加载优先级、启动流程与 Conditional 装配。",
    mastery: 0,
  },
  {
    id: "be-spring-cloud",
    title: "Spring Cloud",
    difficulty: 4,
    prerequisites: ["be-spring-boot"],
    frequency: "高",
    bigTech: true,
    summary: "服务注册发现（Nacos/Eureka）、配置中心、Gateway 网关、Sentinel 熔断限流、OpenFeign、链路追踪。",
    mastery: 0,
  },
  {
    id: "be-python-advanced",
    title: "Python 进阶",
    difficulty: 3,
    prerequisites: [],
    frequency: "中",
    bigTech: true,
    summary: "GIL 锁、asyncio 协程、元类 metaclass、装饰器、闭包与作用域、引用计数 + 分代 GC。",
    mastery: 0,
  },
  {
    id: "be-go-advanced",
    title: "Go 进阶",
    difficulty: 4,
    prerequisites: [],
    frequency: "高",
    bigTech: true,
    summary: "goroutine 调度、channel、GMP 模型、interface 隐式实现、内存管理与 GC、context 取消传播。",
    mastery: 0,
  },
  // ===== 数据存储（6 个节点） =====
  {
    id: "be-mysql-index",
    title: "MySQL 索引与优化",
    difficulty: 4,
    prerequisites: [],
    frequency: "高",
    bigTech: true,
    summary: "B+ 树、聚簇/非聚簇索引、覆盖索引、索引下推 ICP、explain 执行计划、索引失效场景。",
    mastery: 0,
  },
  {
    id: "be-mysql-transaction",
    title: "MySQL 事务",
    difficulty: 4,
    prerequisites: ["be-mysql-index"],
    frequency: "高",
    bigTech: true,
    summary: "ACID、四种隔离级别、MVCC undo log 版本链、行锁/间隙锁/Next-Key、死锁排查、binlog/redolog/undolog。",
    mastery: 0,
  },
  {
    id: "be-redis-data",
    title: "Redis 数据结构与应用",
    difficulty: 3,
    prerequisites: [],
    frequency: "高",
    bigTech: true,
    summary: "5 种基础结构 + Stream、跳表实现、分布式锁、缓存淘汰策略、发布订阅、应用场景（计数/排行榜/红包）。",
    mastery: 0,
  },
  {
    id: "be-redis-cluster",
    title: "Redis 集群与高可用",
    difficulty: 4,
    prerequisites: ["be-redis-data"],
    frequency: "高",
    bigTech: true,
    summary: "主从复制、哨兵 Sentinel、Cluster 分片（16384 槽）、RDB/AOF 持久化对比、缓存与数据库一致性。",
    mastery: 0,
  },
  {
    id: "be-mq-kafka",
    title: "Kafka",
    difficulty: 4,
    prerequisites: [],
    frequency: "高",
    bigTech: true,
    summary: "Broker/Topic/Partition/Replica 架构、ISR、消息可靠性、顺序消息、消息堆积、Exactly-Once。",
    mastery: 0,
  },
  {
    id: "be-mq-rocketmq",
    title: "RocketMQ / RabbitMQ",
    difficulty: 4,
    prerequisites: ["be-mq-kafka"],
    frequency: "高",
    bigTech: true,
    summary: "事务消息、延迟消息、顺序消息、选型对比（吞吐/延迟/功能）、消息轨迹、消费幂等。",
    mastery: 0,
  },
  // ===== 架构与设计（8 个节点） =====
  {
    id: "be-distributed-tx",
    title: "分布式事务",
    difficulty: 5,
    prerequisites: ["be-mysql-transaction"],
    frequency: "高",
    bigTech: true,
    summary: "2PC/3PC、TCC、Saga、Seata（AT/TCC/Saga/XA）、本地消息表、最终一致性方案选型。",
    mastery: 0,
  },
  {
    id: "be-distributed-lock",
    title: "分布式锁",
    difficulty: 4,
    prerequisites: ["be-redis-data"],
    frequency: "高",
    bigTech: true,
    summary: "Redis SETNX + 过期、Redisson 看门狗续期、Redlock 争议、Zookeeper 临时顺序节点、锁粒度与性能。",
    mastery: 0,
  },
  {
    id: "be-consistency",
    title: "分布式一致性",
    difficulty: 5,
    prerequisites: ["be-distributed-lock"],
    frequency: "高",
    bigTech: true,
    summary: "CAP/BASE、Raft 选举与日志复制、Paxos、ZooKeeper ZAB、etcd 强一致性、注册中心选型。",
    mastery: 0,
  },
  {
    id: "be-limit",
    title: "限流与熔断",
    difficulty: 4,
    prerequisites: ["be-distributed-lock"],
    frequency: "高",
    bigTech: true,
    summary: "令牌桶/漏桶/滑动窗口、Sentinel 槽点链、Hystrix 隔离、熔断半开、降级策略、热点参数限流。",
    mastery: 0,
  },
  {
    id: "be-cache-pattern",
    title: "缓存模式",
    difficulty: 4,
    prerequisites: ["be-redis-data"],
    frequency: "高",
    bigTech: true,
    summary: "穿透/击穿/雪崩、Cache Aside/Read Through/Write Behind、双写一致性、布隆过滤器、缓存预热。",
    mastery: 0,
  },
  {
    id: "be-system-design",
    title: "系统设计",
    difficulty: 5,
    prerequisites: ["be-distributed-tx", "be-limit"],
    frequency: "高",
    bigTech: true,
    summary: "短链系统、秒杀、Feed 流（推/拉/推拉结合）、IM 长连接、排行榜、附近的人、设计权衡。",
    mastery: 0,
  },
  {
    id: "be-microservice",
    title: "微服务架构",
    difficulty: 4,
    prerequisites: ["be-spring-cloud"],
    frequency: "高",
    bigTech: true,
    summary: "拆分原则（DDD）、服务通信、治理（注册/熔断/限流）、链路追踪、Service Mesh、网关设计。",
    mastery: 0,
  },
  {
    id: "be-api-design",
    title: "API 设计",
    difficulty: 3,
    prerequisites: ["be-spring-boot"],
    frequency: "中",
    bigTech: true,
    summary: "RESTful 规范、GraphQL、gRPC、版本管理、幂等设计、错误码、Long polling/SSE/WebSocket。",
    mastery: 0,
  },
  // ===== AI 后端方向（5 个节点，重点新增） =====
  {
    id: "be-llm-gateway",
    title: "LLM API 网关",
    difficulty: 4,
    prerequisites: ["be-api-design", "be-redis-data"],
    frequency: "高",
    bigTech: true,
    summary: "多模型路由、Token 计费、限流降级、流式 SSE、上下文管理、Prompt 注入防护、火山方舟/OneAPI 架构。",
    mastery: 0,
  },
  {
    id: "be-rag-backend",
    title: "RAG 后端架构",
    difficulty: 4,
    prerequisites: ["be-llm-gateway"],
    frequency: "高",
    bigTech: true,
    summary: "向量库选型（Milvus/Pinecone/PGVector）、文档分块、Embedding 索引（HNSW/IVF）、混合检索、Rerank、通义 RAG。",
    mastery: 0,
  },
  {
    id: "be-agent-backend",
    title: "Agent 后端架构",
    difficulty: 5,
    prerequisites: ["be-llm-gateway"],
    frequency: "高",
    bigTech: true,
    summary: "Function Calling 工具调度、状态机、ReAct 推理、Multi-Agent 通信、记忆管理、错误恢复、豆包/Coze 架构。",
    mastery: 0,
  },
  {
    id: "be-model-serving",
    title: "模型服务化",
    difficulty: 5,
    prerequisites: ["be-llm-gateway"],
    frequency: "中",
    bigTech: true,
    summary: "vLLM/TGI/Triton、Continuous Batching、PagedAttention、KV Cache、量化（INT8/AWQ/GPTQ）、流式推理。",
    mastery: 0,
  },
  {
    id: "be-ai-data",
    title: "AI 数据管道",
    difficulty: 4,
    prerequisites: ["be-mq-kafka"],
    frequency: "中",
    bigTech: true,
    summary: "数据标注、清洗去重、特征工程、数据版本管理（DVC）、特征平台、数据质量监控、阿里 PAI 数据中台。",
    mastery: 0,
  },
  // ===== 运维与工程（5 个节点） =====
  {
    id: "be-container",
    title: "容器与编排",
    difficulty: 4,
    prerequisites: ["be-spring-boot"],
    frequency: "高",
    bigTech: true,
    summary: "Docker 镜像分层、K8s Pod/Deployment/Service、HPA 弹性、Service Mesh（Istio）、StatefulSet。",
    mastery: 0,
  },
  {
    id: "be-ci-cd",
    title: "CI/CD",
    difficulty: 3,
    prerequisites: ["be-container"],
    frequency: "中",
    bigTech: true,
    summary: "Jenkins/GitLab CI/GitHub Actions 流水线、蓝绿/金丝雀/灰度发布、回滚、阿里云效、制品管理。",
    mastery: 0,
  },
  {
    id: "be-monitoring",
    title: "监控与日志",
    difficulty: 3,
    prerequisites: ["be-spring-boot"],
    frequency: "中",
    bigTech: true,
    summary: "Prometheus 指标、Grafana 仪表盘、ELK 日志、SkyWalking/Zipkin 链路追踪、告警分级、SLO/SLI。",
    mastery: 0,
  },
  {
    id: "be-security",
    title: "后端安全",
    difficulty: 4,
    prerequisites: ["be-api-design"],
    frequency: "高",
    bigTech: true,
    summary: "JWT/OAuth2/SSO、SQL 注入、XSS/CSRF、越权（水平/垂直）、密钥管理、防重放、微信支付安全设计。",
    mastery: 0,
  },
];

const BACKEND_QUESTIONS: Question[] = [
  // ===== 1. be-java-collection Java 集合框架 =====
  {
    id: "be-1",
    nodeId: "be-java-collection",
    question: "阿里双 11 商品详情页商品属性展示，HashMap 和 ConcurrentHashMap 在 JDK 1.8 的底层实现差异？",
    bigTech: true,
    answer: `JDK 1.8 HashMap：数组 + 链表 + 红黑树（链表 ≥8 且数组 ≥64 转红黑树，≤6 退化），put 时尾插法、扩容 2 倍并用高位 bit 判位置。
ConcurrentHashMap 1.8：放弃分段锁，采用 CAS + synchronized 锁单个桶头节点，并发度等于桶数。put 时先 CAS 占空桶，否则 synchronized 锁链表/红黑树头节点。

\`\`\`java
// ConcurrentHashMap 1.8 put 简化逻辑
final V putVal(K key, V value, boolean onlyIfAbsent) {
    int hash = spread(key.hashCode());
    for (Node<K,V>[] tab = table;;) {
        Node<K,V> f; int n, i, fh;
        if (tab == null || (n = tab.length) == 0) tab = initTable();
        else if ((f = tabAt(tab, i = (n - 1) & hash)) == null) {
            if (casTabAt(tab, i, null, new Node<>(hash, key, value, null))) break; // CAS 占空桶
        } else {
            synchronized (f) { /* 链表/树插入 */ }
        }
    }
}
\`\`\`

踩坑：双 11 商品属性并发读多写少，HashMap 直接用会丢数据，必须用 ConcurrentHashMap；size() 是估算值不能强依赖；computeIfAbsent 内嵌长任务会持有桶锁阻塞整个桶。`,
    keyPoints: ["HashMap 1.8 数组+链表+红黑树", "ConcurrentHashMap 1.8 锁桶头节点", "CAS 占空桶 + synchronized 锁链表"],
    followUps: ["HashMap 扩容为什么是 2 倍？", "ConcurrentHashMap size() 为什么不准？"],
    favorited: false,
  },
  {
    id: "be-2",
    nodeId: "be-java-collection",
    question: "美团外卖骑手位置上报用 CopyOnWriteArrayList 还是 ConcurrentLinkedQueue？两者区别？",
    bigTech: true,
    answer: `CopyOnWriteArrayList：写时复制，读无锁，写时复制整个数组，适合"读多写极少"场景（如配置监听器）。
ConcurrentLinkedQueue：基于 CAS 的无锁并发队列（Michael-Scott 算法），读写都高并发，适合生产消费场景。

骑手位置上报每秒数次写入 + 多消费者读取，写远多于读，应选 ConcurrentLinkedQueue 作为消息缓冲，再用线程池异步落库。CopyOnWriteArrayList 写时复制大数组会引发 GC 抖动。

\`\`\`java
// 骑手位置上报缓冲队列
ConcurrentLinkedQueue<Location> queue = new ConcurrentLinkedQueue<>();
queue.offer(new Location(riderId, lat, lng, System.currentTimeMillis()));
// 消费线程批量取
List<Location> batch = new ArrayList<>(500);
while (queue.peek() != null && batch.size() < 500) {
    Location loc = queue.poll();
    if (loc != null) batch.add(loc);
}
if (!batch.isEmpty()) batchInsert(batch); // 批量入库
\`\`\`

踩坑：ConcurrentLinkedQueue 的 size() 是 O(n)，不要在循环里调用；批量消费要限制单次大小避免压垮数据库；队列无界，下游阻塞会导致 OOM，应配合背压或换 BlockingQueue。`,
    keyPoints: ["CopyOnWrite 写时复制读无锁", "ConcurrentLinkedQueue CAS 无锁", "写多读多用 Queue"],
    followUps: ["CopyOnWriteArrayList 为什么不适合写多场景？", "LinkedBlockingQueue 和 ConcurrentLinkedQueue 区别？"],
    favorited: false,
  },
  {
    id: "be-3",
    nodeId: "be-java-collection",
    question: "TreeMap 底层为什么用红黑树而不是 AVL 树或 B+ 树？",
    answer: `红黑树是弱平衡二叉树（最长路径不超过最短 2 倍），AVL 是强平衡（高度差 ≤1）。红黑树插入/删除旋转次数更少（最多 3 次），查询略慢于 AVL 但综合性能更优，适合内存中频繁增删。
B+ 树是多叉树，专为磁盘 IO 优化（扇出大、高度低），内存中单 key 比较无优势。TreeMap 在 JVM 内使用，红黑树最合适。

\`\`\`java
// TreeMap 按自然序/Comparator 排序，红黑树保证 O(log n)
TreeMap<String, Integer> orderMap = new TreeMap<>();
orderMap.put("ORDER_2024_001", 100);
orderMap.put("ORDER_2024_002", 200);
// 子区间查询 O(log n)：取某天订单
SortedMap<String, Integer> sub = orderMap.subMap("ORDER_2024_001", "ORDER_2024_002");
\`\`\`

踩坑：TreeMap 的 key 必须 Comparable 或构造时传 Comparator，否则 ClassCastException；并发修改用 ConcurrentSkipListMap（跳表 + 无锁）替代。`,
    keyPoints: ["红黑树弱平衡旋转少", "AVL 查询快但增删贵", "B+ 树适合磁盘 IO"],
    followUps: ["红黑树和 B 树的应用场景差异？", "ConcurrentSkipListMap 为什么用跳表？"],
    favorited: false,
  },
  {
    id: "be-4",
    nodeId: "be-java-collection",
    question: "ArrayBlockingQueue 和 LinkedBlockingQueue 在线程池里的选型差异？",
    bigTech: true,
    answer: `ArrayBlockingQueue：有界数组，put/take 用同一把 ReentrantLock，吞吐略低但内存可控。
LinkedBlockingQueue：链表默认无界（Integer.MAX_VALUE），put/take 用两把锁（头尾分离），吞吐高但有 OOM 风险。

阿里 Java 开发手册强制线程池用有界队列，禁止用 Executors.newFixedThreadPool（其内部 LinkedBlockingQueue 无界）正是这个原因——任务堆积导致 OOM。

\`\`\`java
// 阿里规约推荐：手动构造有界线程池
ThreadPoolExecutor pool = new ThreadPoolExecutor(
    8, 16, 60L, TimeUnit.SECONDS,
    new ArrayBlockingQueue<>(1000), // 有界队列防 OOM
    new ThreadFactoryBuilder().setNameFormat("biz-%d").build(),
    new ThreadPoolExecutor.CallerRunsPolicy() // 拒绝策略：让调用方执行背压
);
\`\`\`

踩坑：LinkedBlockingQueue 两把锁吞吐高但无界时 GC 压力大；SynchronousQueue 不存元素直接交接（newCachedThreadPool 用），适合高吞吐但任务必须立即处理；PriorityBlockingQueue 适合延迟任务。`,
    keyPoints: ["ArrayBlockingQueue 单锁有界", "LinkedBlockingQueue 双锁高吞吐", "阿里规约禁无界队列"],
    followUps: ["Executors.newFixedThreadPool 为什么被禁？", "SynchronousQueue 是什么场景用？"],
    favorited: false,
  },
  {
    id: "be-5",
    nodeId: "be-java-collection",
    question: "HashMap 多线程下 1.7 头插法为什么会死循环？1.8 是否完全解决了并发问题？",
    bigTech: true,
    answer: `1.7 扩容时头插法会反转链表顺序，多线程并发扩容可能形成环形链表，get 时死循环 CPU 100%。
1.8 改尾插法，扩容时保持原顺序，不再成环，但 HashMap 仍非线程安全：put 可能丢数据（两个线程同时写空桶）、size 不准、迭代器 ConcurrentModificationException 弱一致。

\`\`\`java
// 1.7 扩容头插法（伪代码）—— 多线程并发可能成环
void transfer(Entry[] newTable) {
    for (Entry<K,V> e : table) {
        while (e != null) {
            Entry<K,V> next = e.next; // 线程 B 此处挂起，next 指向 e
            int i = indexFor(e.hash, newTable.length);
            e.next = newTable[i]; // 头插
            newTable[i] = e;
            e = next;
        }
    }
}
\`\`\`

踩坑：1.8 没有彻底解决并发，只是不再死循环；高并发必须用 ConcurrentHashMap；用 Collections.synchronizedMap 性能差只适合老代码兼容。`,
    keyPoints: ["1.7 头插法扩容成环", "1.8 尾插法不成环但仍非线程安全", "并发用 ConcurrentHashMap"],
    followUps: ["1.8 HashMap 丢数据的具体场景？", "ConcurrentHashMap 1.7 分段锁为什么被弃用？"],
    favorited: false,
  },
  {
    id: "be-6",
    nodeId: "be-java-collection",
    question: "WeakHashMap 和 HashMap 的区别？什么场景用 WeakHashMap？",
    answer: `WeakHashMap 的 key 是 WeakReference，key 只被 WeakReference 引用时下次 GC 会被回收，对应 entry 自动清除。
HashMap 的 key 是强引用，必须手动 remove 才能释放。

适用场景：缓存"对象 → 元数据"映射，对象生命周期主导缓存生命周期。如 ThreadLocal 的 ThreadLocalMap 用弱引用 key 防止 ThreadLocal 对象泄漏（但 value 仍是强引用，需手动 remove）。

\`\`\`java
// 用 WeakHashMap 做 Class → 元数据缓存，类卸载时自动清理
WeakHashMap<Class<?>, BeanInfo> beanInfoCache = new WeakHashMap<>();
BeanInfo info = beanInfoCache.computeIfAbsent(clazz, this::introspect);
\`\`\`

踩坑：WeakHashMap 的 key 回收依赖 GC，不要用它做有 SLA 的缓存；value 不会自动弱化，需用 WeakReference 包装 value；Tomcat 类加载器隔离场景常用 WeakHashMap 防类泄漏。`,
    keyPoints: ["WeakHashMap key 弱引用", "GC 时自动清 entry", "适合对象生命周期主导的缓存"],
    followUps: ["ThreadLocalMap 的 key 也是弱引用为什么还会泄漏？", "软引用和弱引用区别？"],
    favorited: false,
  },
  {
    id: "be-7",
    nodeId: "be-java-collection",
    question: "字节抖音用户标签 Set 选型：HashSet vs TreeSet vs ConcurrentSkipListSet？",
    bigTech: true,
    answer: `HashSet：基于 HashMap，O(1) 增删查，无序。
TreeSet：基于 TreeMap 红黑树，O(log n)，有序且支持范围查询。
ConcurrentSkipListSet：基于 ConcurrentSkipListMap 跳表，O(log n)，有序 + 高并发安全。

抖音用户标签"高并发读 + 偶发更新 + 需要排序展示"，用 ConcurrentSkipListSet 兼顾并发与有序；若仅去重无需排序用 Collections.newSetFromMap(new ConcurrentHashMap<>()) 性能更好。

\`\`\`java
// 用户标签并发有序集合
ConcurrentSkipListSet<String> tags = new ConcurrentSkipListSet<>();
tags.add("数码"); tags.add("游戏"); tags.add("美食");
// 并发安全 + 自然序遍历
for (String t : tags) System.out.println(t);
\`\`\`

踩坑：HashSet 不是线程安全的，并发 add 可能丢元素；TreeSet 排序依赖 Comparable，标签频繁变更时红黑树调整开销大；跳表内存比红黑树大约 2 倍（多层索引）。`,
    keyPoints: ["HashSet O(1) 无序", "TreeSet 红黑树有序", "ConcurrentSkipListSet 并发有序"],
    followUps: ["跳表为什么比红黑树更适合并发？", "HashSet 并发为什么会丢元素？"],
    favorited: false,
  },

  // ===== 2. be-java-concurrent Java 并发 =====
  {
    id: "be-8",
    nodeId: "be-java-concurrent",
    question: "阿里双 11 网关线程池如何设置 7 参数？拒绝策略选什么？",
    bigTech: true,
    answer: `七参数：corePoolSize、maximumPoolSize、keepAliveTime、unit、workQueue、threadFactory、handler。
设置原则：CPU 密集型 core = N+1；IO 密集型 core = 2N。双 11 网关是典型 IO 密集，core=2N，max=4N，队列有界（如 10000），拒绝策略用 CallerRunsPolicy 让 Tomcat 线程背压，避免雪崩。

\`\`\`java
int cpu = Runtime.getRuntime().availableProcessors();
ThreadPoolExecutor gatewayPool = new ThreadPoolExecutor(
    cpu * 2, cpu * 4, 60L, TimeUnit.SECONDS,
    new ArrayBlockingQueue<>(10000),
    new ThreadFactoryBuilder().setNameFormat("gateway-%d").build(),
    new ThreadPoolExecutor.CallerRunsPolicy()
);
// 监控队列水位，超过 80% 触发降级
if (gatewayPool.getQueue().size() > 8000) degradeService();
\`\`\`

踩坑：core=max 可省去扩缩容抖动但浪费资源；Abort 抛异常会污染调用栈；Discard 静默丢任务难排查；CallerRunsPolicy 会让 Tomcat 线程阻塞，需配合超时；动态调参推荐美团 DynamicTp 或阿里 Sentinel。`,
    keyPoints: ["CPU 密集 N+1 / IO 密集 2N", "有界队列防 OOM", "CallerRunsPolicy 背压"],
    followUps: ["线程池是如何从 core 扩到 max 的？", "如何动态调整线程池参数？"],
    favorited: false,
  },
  {
    id: "be-9",
    nodeId: "be-java-concurrent",
    question: "AQS 原理？ReentrantLock 公平锁和非公平锁如何用 AQS 实现？",
    bigTech: true,
    answer: `AQS = volatile int state + CLH 双向 FIFO 队列。子类重写 tryAcquire/tryRelease 操作 state。
ReentrantLock：state 0 表示空闲，>0 表示重入次数。
非公平锁 tryAcquire：先 CAS 抢 state，成功就插队。
公平锁 tryAcquire：先 hasQueuedPredecessors() 判断队列前面是否有人，有则排队，避免饥饿。

\`\`\`java
// 非公平锁 tryAcquire（简化）
final boolean nonfairTryAcquire(int acquires) {
    int c = getState();
    if (c == 0) {
        if (compareAndSetState(0, acquires)) { setExclusiveOwnerThread(current); return true; }
    } else if (current == getExclusiveOwnerThread()) {
        setState(c + acquires); return true; // 重入
    }
    return false;
}
\`\`\`

踩坑：非公平锁吞吐高但可能让某些线程长时间拿不到锁；公平锁每次都要查队列，上下文切换多；AQS 的 condition 队列适合生产消费模型；CountDownLatch/Semaphore 都基于 AQS 共享模式。`,
    keyPoints: ["AQS = state + CLH 队列", "非公平 CAS 抢锁", "公平先判断队列"],
    followUps: ["AQS 独占模式和共享模式区别？", "Semaphore 如何基于 AQS？"],
    favorited: false,
  },
  {
    id: "be-10",
    nodeId: "be-java-concurrent",
    question: "美团外卖订单创建场景，synchronized 和 ReentrantLock 如何选？",
    bigTech: true,
    answer: `synchronized：JVM 原语，自动释放，锁升级（偏向→轻量→重量），不可中断。
ReentrantLock：API 层锁，需手动 unlock（finally），支持公平/非公平、tryLock 超时、Condition 多条件、可中断。

订单创建场景：高并发 + 需要超时返回（不能让请求一直阻塞）+ 多条件等待（库存不足等待、支付完成唤醒）→ ReentrantLock + Condition。如果只是简单同步块用 synchronized 更轻量。

\`\`\`java
// 订单创建：tryLock 超时 + Condition
ReentrantLock lock = new ReentrantLock();
Condition stockReady = lock.newCondition();
public Order createOrder(Long skuId) throws TimeoutException {
    if (!lock.tryLock(500, TimeUnit.MILLISECONDS)) throw new TimeoutException();
    try {
        while (stockOf(skuId) <= 0) {
            if (!stockReady.await(1, TimeUnit.SECONDS)) throw new TimeoutException("库存未补充");
        }
        return doCreate(skuId);
    } finally { lock.unlock(); }
}
\`\`\`

踩坑：ReentrantLock 必须在 finally 释放，否则死锁；tryLock 时间别设太长，否则拖垮上游；synchronized 在 JDK 6 后性能与 ReentrantLock 接近，能用 synchronized 优先用；锁粒度要细，按 orderId 分段锁比全局锁吞吐高几十倍。`,
    keyPoints: ["synchronized JVM 原语自动释放", "ReentrantLock 支持超时/中断/Condition", "tryLock + 超时控制"],
    followUps: ["synchronized 锁升级过程？", "Condition 的 await/signal 怎么和 Lock 配合？"],
    favorited: false,
  },
  {
    id: "be-11",
    nodeId: "be-java-concurrent",
    question: "volatile 的两大作用？为什么不能保证原子性？双 11 计数器为什么用 AtomicLong？",
    bigTech: true,
    answer: `volatile 两大作用：可见性（写后立即刷主存，读强制从主存）+ 禁止指令重排序（插入内存屏障）。不保证原子性：i++ 是"读-改-写"三步，多个线程交错会丢更新。

双 11 UV 计数用 AtomicLong（CAS 自旋）而非 volatile long，正是这个原因。高并发下 AtomicLong CAS 失败率高，用 LongAdder（分段累加）性能提升 10 倍以上。

\`\`\`java
// 错：volatile 不保证 i++ 原子
private volatile long count = 0;
count++; // 丢更新

// 对：LongAdder 分段累加，高并发性能最佳
LongAdder uv = new LongAdder();
uv.increment();
long total = uv.sum(); // 合并所有 Cell

// 中等并发用 AtomicLong
AtomicLong pv = new AtomicLong();
pv.getAndIncrement();
\`\`\`

踩坑：volatile 适合"一写多读"标志位（如 shutdown flag）；Double-Checked Singletons 必须用 volatile 防止"半初始化对象"逃逸（new 不是原子操作）；LongAdder.sum() 不是强一致，最终一致场景才用。`,
    keyPoints: ["volatile 可见性 + 禁重排序", "不保证原子性", "高并发计数用 LongAdder"],
    followUps: ["DCL 单例为什么必须 volatile？", "CAS 的 ABA 问题怎么解决？"],
    favorited: false,
  },
  {
    id: "be-12",
    nodeId: "be-java-concurrent",
    question: "CompletableFuture 如何编排异步任务？腾讯视频转码流水线如何用？",
    bigTech: true,
    answer: `CompletableFuture 支持链式编排：thenApply（同步转换）、thenApplyAsync（异步转换）、thenCombine（合并两个 future）、allOf/anyOf（等待多任务）。
腾讯视频转码流水线：上传 → 抽帧 → 多清晰度转码（4K/1080P/720P 并行）→ 生成封面 → 写库。多清晰度并行用 allOf 合并。

\`\`\`java
// 转码流水线：4K/1080P 并行转码，全部完成后写库
CompletableFuture<Void> pipeline = uploadVideo(req)
    .thenComposeAsync(this::extractFrames)
    .thenApplyAsync(this::generateCover)
    .thenCombine(
        CompletableFuture.allOf(
            transcodeAsync(video, "4K"),
            transcodeAsync(video, "1080P"),
            transcodeAsync(video, "720P")
        ),
        (cover, ignored) -> new VideoMeta(video, cover)
    )
    .thenAcceptAsync(this::persist)
    .exceptionally(ex -> { log.error("转码失败", ex); return null; });
\`\`\`

踩坑：thenApply 默认用前一步的线程池，可能阻塞上游，关键步骤用 thenApplyAsync 指定独立线程池；默认 ForkJoinPool.commonPool 共用易拖垮全局，必须显式传 Executor；exceptionally 只能捕获前面所有阶段异常；超时用 orTimeout(5, SECONDS)（JDK 9+）。`,
    keyPoints: ["thenApply/thenCombine/allOf 编排", "并行任务用 allOf", "显式线程池避免 commonPool 拖垮"],
    followUps: ["CompletableFuture 默认线程池有什么坑？", "thenApply 和 thenCompose 区别？"],
    favorited: false,
  },
  {
    id: "be-13",
    nodeId: "be-java-concurrent",
    question: "ThreadLocal 为什么会内存泄漏？美团 ThreadLocal 用法有什么规范？",
    bigTech: true,
    answer: `ThreadLocalMap 的 key 是 WeakReference<ThreadLocal>，value 是强引用。ThreadLocal 实例被回收后 key 变 null，但 value 仍被 Entry 强引用，且 Thread 长生命周期（如线程池），value 无法回收 → 泄漏。

美团规约：1）用 static final 修饰 ThreadLocal 防止 key 被回收成 null；2）用完显式 remove()，尤其在线程池场景；3）ThreadLocal.withInitial 提供初始值避免 NPE。

\`\`\`java
// 阿里规约：static final + try-finally remove
private static final ThreadLocal<TraceContext> TRACE = ThreadLocal.withInitial(TraceContext::new);

try {
    TRACE.get().setTraceId(reqId);
    doBusiness();
} finally {
    TRACE.remove(); // 必须！线程池线程复用，不清理会污染下次任务
}
\`\`\`

踩坑：线程池场景 ThreadLocal 不 remove 是最常见泄漏源；InheritableThreadLocal 不能跨线程池传递，要用阿里 TransmittableThreadLocal（TTL）；Spring 的 RequestContextHolder 也用 ThreadLocal，异步链路会丢失需手动传递。`,
    keyPoints: ["key 弱引用 value 强引用", "线程池场景必须 remove", "跨线程池用 TTL"],
    followUps: ["InheritableThreadLocal 为什么不能跨线程池？", "TTL 如何实现跨线程池传递？"],
    favorited: false,
  },
  {
    id: "be-14",
    nodeId: "be-java-concurrent",
    question: "字节抖音直播点赞计数高并发场景：AtomicLong vs LongAdder vs 锁？",
    bigTech: true,
    answer: `点赞是典型"高频写 + 低频读"场景。
AtomicLong：单 CAS，高并发自旋失败率高，QPS 上万后性能急剧下降。
LongAdder：分段 Cell 累加，写分散到多个 Cell，读时 sum 合并，高并发写性能 5-10 倍于 AtomicLong。
锁：完全不适合，序列化写吞吐最低。

抖音直播间百万级 QPS 点赞用 LongAdder + 定时批量入库，热修复后 CPU 从 80% 降到 30%。

\`\`\`java
// 直播间点赞 LongAdder + 批量入库
LongAdder likeCount = new LongAdder();
// 用户点赞：高并发写，分散到 Cell
public void onLike(long roomId) { likeCount.increment(); }
// 定时刷库：低频读
@Scheduled(fixedRate = 1000)
public void flush() {
    long total = likeCount.sumThenReset(); // 读后清零
    likeService.batchUpdate(roomId, total);
}
\`\`\`

踩坑：sumThenReset 非原子，多读线程会丢数据，只能单消费者；LongAdder 内存比 AtomicLong 大（多个 Cell）；强一致读（如支付余额）不能用 LongAdder，必须用 AtomicLong 或锁。`,
    keyPoints: ["LongAdder 分段写吞吐高", "适合高频写低频读", "sumThenReset 非原子"],
    followUps: ["LongAdder 内部 Cell 怎么分散？", "强一致计数器用什么？"],
    favorited: false,
  },

  // ===== 3. be-jvm JVM 原理 =====
  {
    id: "be-15",
    nodeId: "be-jvm",
    question: "JVM 内存区域划分？美团 OOM 排查：堆溢出 vs 元空间溢出 vs 栈溢出？",
    bigTech: true,
    answer: `JVM 内存：堆（对象）、方法区/元空间（类元信息、JDK 8 后移出堆）、虚拟机栈（栈帧）、本地方法栈、程序计数器、直接内存。
OOM 类型：1）Java heap space：对象太多/内存泄漏；2）Metaspace：动态生成类（CGLIB/反射）；3）GC overhead：GC 花费 >98% 时间回收 <2% 内存；4）Direct memory buffer：NIO ByteBuffer.allocateDirect 没释放；5）StackOverflowError：递归过深。

\`\`\`shell
# 美团 OOM 三板斧
# 1. 看堆概况
jmap -heap <pid>
# 2. dump 堆
jmap -dump:format=b,file=heap.hprof <pid>
# 3. MAT/Arthas 分析大对象
# Arthas 在线排查
[arthas@1234]$ dashboard      # 看 GC 和内存
[arthas@1234]$ heapdump /tmp/heap.hprof
\`\`\`

踩坑：堆 OOM 多是 HashMap 当缓存不淘汰、ThreadLocal 不 remove、大 List 一次查出；元空间 OOM 多是动态代理类爆炸，加 -XX:MaxMetaspaceSize；栈溢出调小 -Xss 反而更易溢出，应排查递归；OOM 前 -XX:+HeapDumpOnOutOfMemoryError 自动 dump。`,
    keyPoints: ["堆/元空间/栈/直接内存", "heap/Metaspace/GC overhead", "jmap dump + MAT 分析"],
    followUps: ["为什么 JDK 8 把永久代替换为元空间？", "直接内存泄漏怎么排查？"],
    favorited: false,
  },
  {
    id: "be-16",
    nodeId: "be-jvm",
    question: "G1 和 CMS 区别？阿里双 11 为什么换 ZGC？",
    bigTech: true,
    answer: `CMS（老年代并发标记清除）：低停顿但有碎片，Concurrent Mode Failure 退化为 Serial Old 全堆 STW，JDK 9 弃用、14 移除。
G1：分 Region（Eden/Survivor/Old/Humongous），标记整理无碎片，可预测停顿（-XX:MaxGCPauseMillis），适合 8G+ 堆。
ZGC：染色指针 + 读屏障，停顿 <10ms 且不随堆增大，TB 级堆可用，适合双 11 大堆低延迟。

\`\`\`shell
# 双 11 推荐：16G+ 堆用 ZGC
java -Xmx16g -Xms16g \
  -XX:+UseZGC -XX:+ZGenerational \
  -XX:+HeapDumpOnOutOfMemoryError \
  -XX:HeapDumpPath=/data/dump/ \
  -jar app.jar

# G1 调优（中小堆）
java -Xmx8g -XX:+UseG1GC -XX:MaxGCPauseMillis=200 -XX:G1HeapRegionSize=16m
\`\`\`

踩坑：G1 的 Humongous 对象（>region 一半）直接进老年代，大数组要调 region size；ZGC JDK 15 前吞吐稍低；生产别用 ParallelGC，STW 长；GC 日志加 -Xlog:gc*:/path/gc.log 方便事后分析。`,
    keyPoints: ["CMS 标记清除有碎片", "G1 Region + 可预测停顿", "ZGC 染色指针 TB 级"],
    followUps: ["G1 的 Mixed GC 是什么？", "ZGC 染色指针如何实现？"],
    favorited: false,
  },
  {
    id: "be-17",
    nodeId: "be-jvm",
    question: "类加载双亲委派模型？为什么打破它？Tomcat 和 SPI 各怎么打破？",
    bigTech: true,
    answer: `双亲委派：类加载请求先委派父加载器，父找不到再自己加载。保证核心类（如 java.lang.String）由 Bootstrap 加载，防止伪造。
打破场景：1）SPI（JDBC Driver）——核心类反向依赖实现类，用 Thread.contextClassLoader；2）Tomcat —— 不同 Web 应用隔离，每个 Context 有独立 WebappClassLoader，先自己加载再委派父；3）OSGi —— 网状委派。

\`\`\`java
// Tomcat WebappClassLoader 打破双亲委派（简化）
@Override
protected Class<?> loadClass(String name, boolean resolve) throws ClassNotFoundException {
    Class<?> c = findLoadedClass(name);
    if (c == null) {
        try { c = findClass(name); }  // 先自己找（打破）
        catch (ClassNotFoundException e) {
            c = super.loadClass(name, resolve); // 找不到再委派父
        }
    }
    if (resolve) resolveClass(c);
    return c;
}
\`\`\`

踩坑：JDBC 4.0 用 ServiceLoader + ContextClassLoader 加载 Driver，所以 Class.forName 在 JDK 6 后非必需；Tomcat 多应用同 jar 不同版本必须靠 WebappClassLoader 隔离；热部署要清类加载器否则元空间爆；自定义类加载器要重写 findClass 不是 loadClass。`,
    keyPoints: ["双亲委派先父后子", "SPI 用 ContextClassLoader", "Tomcat WebappClassLoader 反向"],
    followUps: ["为什么 JDK 核心 SPI 要打破双亲委派？", "热部署如何避免元空间泄漏？"],
    favorited: false,
  },
  {
    id: "be-18",
    nodeId: "be-jvm",
    question: "JIT 编译（C1/C2）原理？字节抖音为什么关闭部分 JIT 优化？",
    bigTech: true,
    answer: `JVM 解释执行 + JIT 编译热点代码为机器码。C1（Client）快速编译，简单优化；C2（Server）激进优化（逃逸分析、内联、循环展开），吞吐高但编译耗 CPU。
分层编译（Tiered）：先 C1 快速暖机，热点足够热再 C2 深度优化。

字节抖音推荐服务在容器化初期，C2 编译耗 CPU 抢占业务线程，启动慢，曾用 -XX:TieredStopAtLevel=1 只用 C1 加速启动，再切换到分层编译。

\`\`\`shell
# 抖音推荐服务 JVM 启动优化
java -XX:+TieredCompilation \
  -XX:TieredStopAtLevel=1 \      # 只用 C1 加速启动（牺牲峰值）
  -XX:+UseJVMCICompiler=on \     # 或换 GraalVM
  -jar recommendation.jar

# 阿里 Dragonwell AOT 预编译
java -XX:+UseAOTCompilation -XX:AOTLibrary=app.aot -jar app.jar
\`\`\`

踩坑：C2 逃逸分析未生效时对象仍在堆分配，加 -XX:+DoEscapeAnalysis 确认；即时编译的"逆优化"在去优化时会 STW；预热脚本（如京东 JaeRequestWarmup）触发 JIT 后再放流量，避免首请求慢。`,
    keyPoints: ["C1 快编译 C2 深优化", "分层编译先 C1 后 C2", "逃逸分析栈上分配"],
    followUps: ["逃逸分析如何决定对象栈上分配？", "GraalVM AOT 和 JIT 的区别？"],
    favorited: false,
  },
  {
    id: "be-19",
    nodeId: "be-jvm",
    question: "Full GC 频繁如何排查？美团一次线上 Full GC 飙升的案例分析？",
    bigTech: true,
    answer: `Full GC 触发原因：1）老年代空间不足（大对象/内存泄漏）；2）元空间不足；3）System.gc() 显式调用；4）CMS Concurrent Mode Failure；5）RMI 分布式 GC。
排查步骤：1）jstat -gcutil 看 FGCT 增长频率；2）GC 日志看 Full GC 原因；3）dump 看老年代大对象；4）定位代码。

美团案例：日志组件异步队列无界，大促日志暴涨，老年代被未消费 LogEvent 填满，Full GC 每秒一次，接口 P99 从 50ms 飙到 5s。修复：队列改有界 + 拒绝策略丢弃 DEBUG 日志。

\`\`\`java
// 故障代码：无界队列堆积日志
LinkedBlockingQueue<LogEvent> queue = new LinkedBlockingQueue<>(); // 无界！

// 修复：有界队列 + 降级
ArrayBlockingQueue<LogEvent> queue = new ArrayBlockingQueue<>(10000);
if (!queue.offer(event)) { // 队满丢弃 DEBUG/INFO
    if (event.level >= Level.WARN) blockingPut(event);
}
\`\`\`

踩坑：System.gc() 默认触发 Full GC，加 -XX:+DisableExplicitGC 禁用；RMI 默认 1 小时一次 System.gc，需 -Dsun.rmi.dgc.client/server.gcInterval=36000000；CMS 的 Concurrent Mode Failure 多是晋升速率过快，调大老年代或新生代。`,
    keyPoints: ["Full GC 五大原因", "jstat + GC 日志 + dump", "无界队列是常见元凶"],
    followUps: ["如何区分 Minor GC 和 Full GC？", "CMS Concurrent Mode Failure 如何避免？"],
    favorited: false,
  },
  {
    id: "be-20",
    nodeId: "be-jvm",
    question: "对象内存布局？为什么 8 字节对齐？指针压缩是什么？",
    bigTech: true,
    answer: `64 位 JVM 对象布局：对象头（MarkWord 8B + KlassPointer 4B 压缩/8B 不压缩）+ 实例数据 + 对齐填充（8 字节倍数）。
8 字节对齐：CPU 缓存行（64B）和原子性需要，避免跨缓存行读写引发伪共享。
指针压缩（-XX:+UseCompressedOops，堆 <32G 默认开）：把 8B 指针压缩成 4B，节省 50% 指针内存，所以 32G 是分水岭。

\`\`\`java
// 用 JOL 查看对象布局
<dependency>
  <groupId>org.openjdk.jol</groupId>
  <artifactId>jol-core</artifactId>
</dependency>
// 打印 HashMap 对象布局
System.out.println(ClassLayout.parseInstance(new HashMap<>()).toPrintable());
// 输出：HEADER(12) + padding(4) = 16B 一个空 HashMap
\`\`\`

踩坑：堆 >32G 必须关指针压缩，对象头从 12B 变 16B，反而占内存更多，所以单实例堆建议 ≤31G；MarkWord 存 hashCode/锁状态/GC 分代年龄，锁升级会改写它；对齐填充让 Long[] 比 long[] 多占 50% 内存（每个 Long 对象 16B 包装）。`,
    keyPoints: ["对象头 + 实例数据 + 对齐", "8B 对齐匹配缓存行", "32G 是指针压缩分水岭"],
    followUps: ["MarkWord 在不同锁状态如何变化？", "为什么堆超 32G 反而更耗内存？"],
    favorited: false,
  },
  {
    id: "be-21",
    nodeId: "be-jvm",
    question: "线上 CPU 100% 如何定位？阿里 Arthas 排查三步法？",
    bigTech: true,
    answer: `三步法：1）top 找 CPU 高的 Java 进程 pid；2）top -Hp pid 找 CPU 高的线程 tid（十进制）；3）printf "%x\\n" tid 转 16 进制，jstack pid | grep tid 找栈定位代码。Arthas 一站式：thread -n 5 看占用最高线程，profiler 生成火焰图。

\`\`\`shell
# 阿里 Arthas CPU 排查
# 1. 启动 Arthas
java -jar arthas-boot.jar <pid>
# 2. 看 CPU 最高的 5 个线程
[arthas@1234]$ thread -n 5
# 3. 看具体栈
[arthas@1234]$ thread <threadId>
# 4. 火焰图
[arthas@1234]$ profiler start; sleep 30; profiler stop --format html
# 5. 反编译看 JIT 后代码
[arthas@1234]$ jad com.demo.Service
\`\`\`

踩坑：CPU 高常见死循环（while(true) 无 sleep）、正则灾难回溯、GC 线程占满（看是否 GC 频繁而非业务）；jstack 多打几次看栈是否变化判断死锁/活锁；Arthas watch 看方法入参出参，trace 看调用链耗时，对线上无侵入但会影响性能。`,
    keyPoints: ["top → top -Hp → jstack", "Arthas thread -n 5", "profiler 火焰图"],
    followUps: ["死锁如何用 jstack 排查？", "Arthas trace 和 watch 区别？"],
    favorited: false,
  },

  // ===== 4. be-spring-core Spring 核心 =====
  {
    id: "be-22",
    nodeId: "be-spring-core",
    question: "Spring IoC 容器初始化流程？BeanDefinition 作用？",
    bigTech: true,
    answer: `IoC 容器初始化：1）资源定位（XML/注解/Configuration 类）；2）BeanDefinition 加载和解析（Bean 的元数据：class、scope、lazy、依赖）；3）注册到 BeanDefinitionRegistry；4）getBean 触发实例化（懒加载）或 refresh() 后实例化（非懒）。
BeanDefinition 是 Bean 的"图纸"，BeanFactoryPostProcessor 可改图纸（如占位符替换），BeanPostProcessor 改成品 Bean。

\`\`\`java
// 自定义 BeanFactoryPostProcessor 改 BeanDefinition（如动态注册 Mapper）
@Component
public class MapperScannerPostProcessor implements BeanDefinitionRegistryPostProcessor {
    @Override
    public void postProcessBeanDefinitionRegistry(BeanDefinitionRegistry registry) {
        ClassPathMapperScanner scanner = new ClassPathMapperScanner(registry);
        scanner.setAnnotationClass(Mapper.class);
        scanner.registerFilters();
        scanner.scan("com.demo.mapper");
    }
}
\`\`\`

踩坑：@Configuration(proxyBeanMethods=false) 关闭 Full 模式省启动时间，但 @Bean 间相互调用会重建对象；BeanDefinition 不实例化对象，beanFactory.getBean 才真正创建；MyBatis Mapper 没有实现类，靠 MapperFactoryBean + BeanDefinition 注册代理。`,
    keyPoints: ["定位→加载→注册→实例化", "BeanDefinition 是图纸", "BeanFactoryPostProcessor 改图纸"],
    followUps: ["BeanFactory 和 ApplicationContext 区别？", "@Configuration 全模式和轻量模式区别？"],
    favorited: false,
  },
  {
    id: "be-23",
    nodeId: "be-spring-core",
    question: "Spring AOP 用 JDK 动态代理还是 CGLIB？美团性能对比？",
    bigTech: true,
    answer: `JDK 动态代理：基于接口，Proxy.newProxyInstance 生成 $Proxy0 实现 InvocationHandler。
CGLIB：基于继承，生成目标类子类重写方法，需 final 类不能代理。
Spring 默认：有接口用 JDK，无接口用 CGLIB；@EnableAspectJAutoProxy(proxyTargetClass=true) 强制 CGLIB。

美团 RPC 框架 Swan 实测：JDK 代理反射调用比 CGLIB FastClass 慢 30%，且 CGLIB 生成子类可被 JIT 内联，所以 Dubbo/Swan 默认 javassist 或 CGLIB。

\`\`\`java
// 强制 CGLIB 代理（Spring Boot 2.x 默认）
@Configuration
@EnableAspectJAutoProxy(proxyTargetClass = true)
public class AopConfig {}

// 自定义 AOP 切面（美团日志组件）
@Aspect
@Component
public class TraceAspect {
    @Around("@annotation(com.demo.Trace)")
    public Object trace(ProceedingJoinPoint pjp) throws Throwable {
        long start = System.currentTimeMillis();
        try { return pjp.proceed(); }
        finally { metrics.timer(pjp.getSignature().getName(), System.currentTimeMillis() - start); }
    }
}
\`\`\`

踩坑：CGLIB 不能代理 final 方法和 final 类；JDK 代理只能代理接口方法，类自有方法调不到；@Transactional 自调用（同类方法互相调用）失效——因为不走代理对象，需注入自己或用 AopContext.currentProxy()。`,
    keyPoints: ["JDK 接口代理 / CGLIB 子类代理", "CGLIB FastClass 性能更好", "自调用失效要走代理对象"],
    followUps: ["@Transactional 自调用为什么失效？", "AspectJ 编译时织入和 Spring AOP 区别？"],
    favorited: false,
  },
  {
    id: "be-24",
    nodeId: "be-spring-core",
    question: "Bean 生命周期完整流程？循环依赖为什么用三级缓存解决？",
    bigTech: true,
    answer: `Bean 生命周期：1）实例化（构造器）；2）属性填充（依赖注入）；3）初始化（BeanPostProcessor.before → @PostConstruct → InitializingBean.afterPropertiesSet → init-method → BeanPostProcessor.after）；4）使用；5）销毁（@PreDestroy → DisposableBean.destroy → destroy-method）。
三级缓存：singletonObjects（成品）、earlySingletonObjects（半成品已暴露）、singletonFactories（ObjectFactory 可生成代理）。循环依赖时，A 依赖 B、B 依赖 A，B 创建时从三级缓存拿到 A 的 ObjectFactory 调用提前生成半成品 A。

\`\`\`java
// 三级缓存核心代码（DefaultSingletonRegistry）
Map<String, Object> singletonObjects = new ConcurrentHashMap<>();      // 一级：成品
Map<String, Object> earlySingletonObjects = new ConcurrentHashMap<>(); // 二级：半成品
Map<String, ObjectFactory<?>> singletonFactories = new HashMap<>();    // 三级：工厂

// A 实例化后立即放入三级缓存
addSingletonFactory(beanName, () -> getEarlyBeanReference(beanName, mbd, bean));
\`\`\`

踩坑：构造器注入循环依赖无法解决（实例化阶段就报错），必须改 setter；@Async 的代理由后置处理器生成，循环依赖 + @Async 会启动报错；Spring Boot 2.6+ 默认 spring.main.allow-circular-references=false 禁止循环依赖，倒逼重构。`,
    keyPoints: ["实例化→填充→初始化→销毁", "三级缓存暴露半成品", "构造器注入循环依赖无解"],
    followUps: ["为什么需要三级而非二级？", "@Async 循环依赖为什么报错？"],
    favorited: false,
  },
  {
    id: "be-25",
    nodeId: "be-spring-core",
    question: "Spring 事务传播行为？美团订单 + 库存事务如何配置？",
    bigTech: true,
    answer: `7 种传播：REQUIRED（默认，有则加入无则新建）、REQUIRES_NEW（挂起当前，新建独立事务）、SUPPORTS、NOT_SUPPORTED、NEVER、MANDATORY、NESTED（嵌套，依赖外层回滚点）。
订单 + 库存场景：主流程 createOrder 是 REQUIRED，记录日志用 REQUIRES_NEW（订单失败日志要留），扣库存用 REQUIRED（和订单同生共死），发奖励券用 NESTED（券失败只回滚券不影响订单）。

\`\`\`java
@Service
public class OrderService {
    @Transactional(required)  // 主事务
    public void createOrder(OrderReq req) {
        orderDao.insert(req);
        stockService.deduct(req.getSkuId());           // REQUIRED，同事务
        couponService.grant(req.getUserId());           // NESTED，独立回滚点
        logService.record(req, "CREATE");               // REQUIRES_NEW，独立事务
    }
}
class LogService {
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void record(OrderReq req, String action) { logDao.insert(...); }
}
\`\`\`

踩坑：自调用不走代理，事务和传播都失效；REQUIRES_NEW 持有两个数据库连接，连接池小易死锁；NESTED 依赖数据库 savepoint，MySQL InnoDB 支持；rollbackFor 默认只回滚 RuntimeException，业务异常要 rollbackFor = Exception.class。`,
    keyPoints: ["REQUIRED 默认", "REQUIRES_NEW 独立事务", "NESTED 嵌套回滚点"],
    followUps: ["REQUIRES_NEW 为什么容易死锁？", "rollbackFor 默认行为是什么？"],
    favorited: false,
  },
  {
    id: "be-26",
    nodeId: "be-spring-core",
    question: "@Autowired 和 @Resource 区别？阿里为什么推荐构造器注入？",
    bigTech: true,
    answer: `@Autowired（Spring）：按类型注入，多实现用 @Qualifier 指定 name；可加在字段/构造器/setter；required=false 容忍找不到。
@Resource（JSR-250）：按 name 注入，找不到再按 type；name+type 都可指定。
构造器注入优势：1）依赖不可变 final；2）初始化完成即可用，无 NPE；3）易单元测试（new 出来）；4）暴露依赖过多提醒类设计臃肿。Spring 4.3+ 单构造器可省 @Autowired。

\`\`\`java
// 阿里规约：构造器注入
@Service
public class OrderService {
    private final OrderRepo orderRepo;
    private final StockClient stockClient;
    // 单构造器省 @Autowired
    public OrderService(OrderRepo orderRepo, StockClient stockClient) {
        this.orderRepo = orderRepo;
        this.stockClient = stockClient;
    }
}
// 字段注入（不推荐，难测试 + 不能 final）
// @Autowired private OrderRepo orderRepo;
\`\`\`

踩坑：字段注入循环依赖不报错悄悄用三级缓存，掩盖设计问题；构造器注入循环依赖启动直接报错，倒逼重构；@Autowired 加 List<Interface> 可注入所有实现，做策略模式；Lombok @RequiredArgsConstructor 自动生成构造器，配合 final 字段最简洁。`,
    keyPoints: ["@Autowired 按 type", "@Resource 按 name", "构造器注入 final + 可测试"],
    followUps: ["@Autowired 注入 List 怎么工作？", "Lombok @RequiredArgsConstructor 原理？"],
    favorited: false,
  },
  {
    id: "be-27",
    nodeId: "be-spring-core",
    question: "Spring 事件机制 ApplicationEvent？订单创建后异步通知多系统如何用？",
    answer: `Spring 事件：ApplicationEventPublisher 发布 ApplicationEvent，@EventListener 监听。@Async 异步执行。ApplicationEventPublisher.publishEvent 同步调用所有监听器（@Async 才异步）。
订单创建后通知：库存、券、积分、推送、风控多系统，用事件解耦，新增系统不改订单代码。

\`\`\`java
// 订单事件 + 多系统异步监听
public class OrderCreatedEvent extends ApplicationEvent {
    public final Long orderId;
    public OrderCreatedEvent(Object src, Long orderId) { super(src); this.orderId = orderId; }
}
@Service
public class OrderService {
    @Autowired private ApplicationEventPublisher publisher;
    @Transactional
    public void create(OrderReq req) {
        Long id = orderDao.insert(req);
        publisher.publishEvent(new OrderCreatedEvent(this, id)); // 同事务内同步
    }
}
@Component
public class StockListener {
    @Async @EventListener @TransactionalEventListener(phase = AFTER_COMMIT)
    public void on(OrderCreatedEvent e) { stockService.deduct(e.orderId); }
    // AFTER_COMMIT 保证订单事务提交后再扣库存，避免回滚不一致
}
\`\`\`

踩坑：默认 @EventListener 同步执行，监听器抛异常会回滚主事务；@TransactionalEventListener(phase=AFTER_COMMIT) 在事务提交后才触发，避免"扣了库存订单回滚"；@Async 需配 @EnableAsync + 自定义线程池，否则用默认 SimpleAsyncTaskExecutor 每次新建线程；事件最终一致用 MQ 更稳。`,
    keyPoints: ["publishEvent + @EventListener", "@Async 异步", "@TransactionalEventListener AFTER_COMMIT"],
    followUps: ["@TransactionalExecutor 和 @Async 区别？", "事件 vs MQ 各适用什么场景？"],
    favorited: false,
  },
  {
    id: "be-28",
    nodeId: "be-spring-core",
    question: "Spring 扩展点 BeanPostProcessor 和 BeanFactoryPostProcessor 区别？阿里扩展案例？",
    bigTech: true,
    answer: `BeanFactoryPostProcessor：在 BeanDefinition 加载后、Bean 实例化前，可修改 BeanDefinition（如改 class、属性值、注册新 Bean）。Spring 启动早期执行。
BeanPostProcessor：在 Bean 实例化后、初始化前后，可替换/包装 Bean 实例（如生成代理）。@Autowired、@ConfigurationProperties 都靠它。
阿里 Sentinel DataSource AutoConfig 用 BeanFactoryPostProcessor 动态注册规则源 Bean；HSF RPC 用 BeanPostProcessor 给 @RpcService 标注 Bean 注入远程代理。

\`\`\`java
// 阿里 Sentinel 动态注册规则源 Bean
public class SentinelRuleSourcePostProcessor implements BeanDefinitionRegistryPostProcessor {
    @Override
    public void postProcessBeanDefinitionRegistry(BeanDefinitionRegistry registry) {
        if (rulesEnabled()) {
            BeanDefinition bd = new RootBeanDefinition(NacosDataSource.class);
            bd.getConstructorArgumentValues().addGenericArgumentValue(serverAddr);
            registry.registerBeanDefinition("flowRuleSource", bd);
        }
    }
}

// HSF 远程代理注入（BeanPostProcessor）
public class HsfProxyPostProcessor implements BeanPostProcessor {
    @Override public Object postProcessBeforeInitialization(Object bean, String name) {
        if (bean.getClass().isAnnotationPresent(RpcService.class)) {
            return HsfProxyFactory.create(bean.getClass()); // 替换为远程代理
        }
        return bean;
    }
}
\`\`\`

踩坑：BeanPostProcessor 不能拦截自己依赖的 Bean（鸡生蛋）；BeanFactoryPostProcessor 改 BeanDefinition 后该 Bean 还未实例化；@Autowired 的 AutowiredAnnotationBeanPostProcessor 必须早注册，否则其他 Bean 注入失效；@ConfigurationProperties 的 ConfigurationPropertiesBindingPostProcessor 处理属性绑定。`,
    keyPoints: ["BFPP 改图纸 / BPP 改成品", "BFPP 启动早期 / BPP 实例化后", "Sentinel/HSF 用扩展点"],
    followUps: ["BeanPostProcessor 怎么实现 @Autowired？", "Spring 启动顺序里两个扩展点何时执行？"],
    favorited: false,
  },

  // ===== 5. be-spring-boot Spring Boot =====
  {
    id: "be-29",
    nodeId: "be-spring-boot",
    question: "Spring Boot 自动配置原理？@EnableAutoConfiguration 如何工作？",
    bigTech: true,
    answer: `@SpringBootApplication = @SpringBootConfiguration + @ComponentScan + @EnableAutoConfiguration。
@EnableAutoConfiguration 通过 @Import(AutoConfigurationImportSelector.class) 加载 META-INF/spring.factories（2.7+ 改为 META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports）中所有 AutoConfiguration 类。
每个 AutoConfiguration 用 @Conditional 系列注解（ConditionalOnClass/Bean/MissingBean/Property）判断是否生效，只有条件满足才装配 Bean。

\`\`\`java
// 自定义 RedisAutoConfiguration 简化版
@AutoConfiguration
@ConditionalOnClass(RedisTemplate.class)
@EnableConfigurationProperties(RedisProperties.class)
public class RedisAutoConfiguration {
    @Bean
    @ConditionalOnMissingBean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory) {
        RedisTemplate<String, Object> t = new RedisTemplate<>();
        t.setConnectionFactory(factory);
        return t;
    }
}
// 注册：META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports
// com.demo.RedisAutoConfiguration
\`\`\`

踩坑：@ConditionalOnMissingBean 让用户 Bean 覆盖默认配置，所以"约定大于配置"；spring.factories 2.7 弃用但仍兼容，新项目用 imports 文件；启动慢可加 --debug 看哪些 AutoConfiguration 不匹配；@ConditionalOnBean 有顺序问题，尽量用 @ConditionalOnClass。`,
    keyPoints: ["@Import 加载 AutoConfiguration", "@Conditional 系列条件装配", "spring.factories / imports 文件"],
    followUps: ["@ConditionalOnBean 有什么坑？", "如何查看哪些自动配置类生效？"],
    favorited: false,
  },
  {
    id: "be-30",
    nodeId: "be-spring-boot",
    question: "Starter 机制如何设计？美团 Cat 监控 Starter 怎么写？",
    bigTech: true,
    answer: `Starter = 自动配置类 + 配置属性类 + 依赖打包。命名规范：官方 spring-boot-starter-xxx，第三方 xxx-spring-boot-starter。
设计：1）Properties 类绑定 yml；2）AutoConfiguration 装配 Bean；3）META-INF/spring/...imports 注册；4）pom 把依赖收口进 starter。

\`\`\`java
// 美团 Cat 监控 Starter
@ConfigurationProperties(prefix = "cat")
public class CatProperties {
    private String domain; private String servers; private boolean enabled = true;
    // getter/setter
}
@AutoConfiguration
@ConditionalOnClass(Cat.class)
@EnableConfigurationProperties(CatProperties.class)
@ConditionalOnProperty(prefix = "cat", name = "enabled", havingValue = "true", matchIfMissing = true)
public class CatAutoConfiguration {
    @Bean @ConditionalOnMissingBean
    public Cat cat(CatProperties props) {
        return new Cat.Builder().domain(props.getDomain()).servers(props.getServers()).build();
    }
    @Bean public CatWebMvcInterceptor catInterceptor() { return new CatWebMvcInterceptor(); }
}
// 用户使用：<dependency><artifactId>cat-spring-boot-starter</artifactId></dependency>
// application.yml: cat.domain=order-service / cat.servers=10.0.0.1:2280
\`\`\`

踩坑：Starter 内 Bean 用 @ConditionalOnMissingBean 让用户可覆盖；starter 不要包含业务代码，只做自动装配；配置 key 用独立前缀避免冲突；启动时打日志告诉用户生效了哪些配置便于排查。`,
    keyPoints: ["Starter = 自动配置 + Properties + 依赖", "命名 xxx-spring-boot-starter", "@ConditionalOnMissingBean 可覆盖"],
    followUps: ["Starter 内如何暴露健康检查？", "Starter 之间如何控制加载顺序？"],
    favorited: false,
  },
  {
    id: "be-31",
    nodeId: "be-spring-boot",
    question: "Spring Boot 配置加载优先级？Nacos 配置和本地 yml 谁覆盖谁？",
    bigTech: true,
    answer: `优先级（高 → 低）：1）命令行参数 --xxx；2）SPRING_APPLICATION_JSON；3）ServletConfig/ServletContext；4）JNDI；5）Java 系统属性；6）操作系统环境变量；7）RandomValuePropertySource；8）jar 包外 application-{profile}.yml；9）jar 包内 application-{profile}.yml；10）jar 包外 application.yml；11）jar 包内 application.yml；12）@PropertySource。
Spring Cloud Bootstrap：Nacos 配置在 application 之前加载，默认 application 优先级高（覆盖 Nacos），用 spring.cloud.config.override-none=true 让本地不覆盖远程。

\`\`\`yaml
# bootstrap.yml（Nacos 加载早于 application.yml）
spring:
  cloud:
    nacos:
      config:
        server-addr: nacos.prod:8848
        namespace: prod
        # 远程优先，本地无法覆盖
        override-none: false  # 默认 false，远程配置可被本地覆盖
        allow-override: true  # 允许本地覆盖
        override-system-properties: false
# application.yml
myapp:
  timeout: 3000  # 若 Nacos 同 key，看 override-none 决定谁覆盖
\`\`\`

踩坑：bootstrap.yml 在 Spring Cloud 2020+ 默认禁用，需 spring.cloud.bootstrap.enabled=true 或改用 spring.config.import；本地调试加 -Dspring.profiles.active=dev 切环境；敏感配置用 Nacos + 加密，不要进 yml 提交 Git；@RefreshScope + /actuator/refresh 才能动态刷新。`,
    keyPoints: ["命令行 > 系统属性 > 环境变量 > jar 外 yml > jar 内 yml", "Nacos bootstrap 优先", "override-none 控制覆盖方向"],
    followUps: ["@RefreshScope 如何实现配置动态刷新？", "Spring Cloud 2020 为什么禁用 bootstrap？"],
    favorited: false,
  },
  {
    id: "be-32",
    nodeId: "be-spring-boot",
    question: "Spring Boot 启动流程？阿里如何优化启动时间（秒级 → 亚秒）？",
    bigTech: true,
    answer: `启动流程：1）SpringApplication.run；2）创建 SpringApplicationRunListener；3）prepareEnvironment 加载配置；4）createApplicationContext（Servlet 用 AnnotationConfigServletWebServerApplicationContext）；5）refreshContext：注册 BeanDefinition → 实例化 BeanFactoryPostProcessor → 注册 BeanPostProcessor → 实例化单例 Bean → onRefresh 启动 Tomcat → finishRefresh 发布 ApplicationReadyEvent。

阿里优化：1）懒加载 spring.main.lazy-init=true（启动快，首请求慢）；2）排除未用 AutoConfiguration（spring.autoconfigure.exclude）；3）ApplicationContextFactory 用定制轻量上下文；4）Spring Boot 3 + GraalVM Native Image AOT 编译，启动 50ms；5）Dragonwell AOT。

\`\`\`java
// 阿里秒级启动优化
@SpringBootApplication(exclude = {
    DataSourceAutoConfiguration.class,  // 排除未用
    RedisAutoConfiguration.class
})
public class App {
    public static void main(String[] args) {
        new SpringApplicationBuilder(App.class)
            .lazyInitialization(true)                // 懒加载
            .logStartupInfo(false)
            .bannerMode(Banner.Mode.OFF)
            .run(args);
    }
}
# GraalVM Native Image
native-image -H:Name=app -H:ConfigurationFileDirectories=meta app.jar
\`\`\`

踩坑：懒加载让首请求慢（JIT/连接池冷启动），生产慎用；Native Image 不支持反射（需配置 reflect-config.json），CGLIB/动态代理要适配；Spring Boot 3 Native 仍在完善，第三方库兼容性是坑；启动慢可加 -Ddebug 看哪个 Bean 初始化久。`,
    keyPoints: ["run → 环境 → 上下文 → refresh → Tomcat", "lazy-init / 排除 AutoConfig", "GraalVM Native AOT"],
    followUps: ["lazy-init 为什么生产慎用？", "Native Image 反射为什么不支持？"],
    favorited: false,
  },
  {
    id: "be-33",
    nodeId: "be-spring-boot",
    question: "Actuator 端点有哪些？阿里如何二次封装做生产监控？",
    bigTech: true,
    answer: `Actuator 端点：/health（健康检查，DB/Redis/GC 探针）、/info（应用信息）、/metrics（Micrometer 指标）、/env（环境配置）、/loggers（动态调日志级别）、/heapdump（堆 dump）、/threaddump（线程 dump）、/refresh（刷新配置）、/shutdown（优雅关闭）。
生产端点只暴露 /health 给 K8s liveness/readiness，其他端点接 Prometheus 拉取或网关鉴权后访问。

\`\`\`java
// 阿里生产 Actuator 配置
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus,loggers  # 只暴露必要端点
        exclude: env,heapdump,threaddump                  # 敏感端点排除
  endpoint:
    health:
      show-details: when-authorized  # 鉴权后才显示详情
      probes:
        enabled: true                # 暴露 liveness/readiness 给 K8s
    shutdown:
      enabled: true                  # 启用优雅关闭
// 自定义健康检查
@Component
public class KafkaHealthIndicator implements HealthIndicator {
    @Override public Health health() {
        return kafkaClient.isConnected() ? Health.up().build() : Health.down().build();
    }
}
\`\`\`

踩坑：/env 默认脱敏密码字段，但加密弱仍可能泄露，生产必须配 management.security 鉴权；/heapdump 生产慎开，几十 MB 文件被恶意频繁拉取耗带宽；/shutdown 默认关闭，开启必须配密码；K8s readiness 用 /health/readiness，liveness 用 /health/liveness 区分启动期与运行期。`,
    keyPoints: ["/health /metrics /loggers /heapdump", "K8s 用 liveness/readiness", "敏感端点鉴权"],
    followUps: ["Micrometer 和 Prometheus 关系？", "K8s liveness 和 readiness 区别？"],
    favorited: false,
  },
  {
    id: "be-34",
    nodeId: "be-spring-boot",
    question: "@Conditional 系列注解有哪些？ConditionalOnBean 的坑？",
    answer: `@Conditional 系：ConditionalOnClass（类路径有类）、ConditionalOnMissingClass、ConditionalOnBean（容器有 Bean）、ConditionalOnMissingBean、ConditionalOnProperty（配置项满足）、ConditionalOnResource（资源存在）、ConditionalOnWebApplication（Web 环境）、ConditionalOnExpression（SpEL）。
ConditionalOnBean 坑：Bean 装配顺序不确定，AutoConfiguration 之间若 A 依赖 B 的 Bean，A 的 ConditionalOnBean 可能因 B 未初始化而失效。Spring Boot 用 AutoConfigureAfter/Before/@Order 保证顺序。

\`\`\`java
// ConditionalOnBean 坑：必须 AutoConfigureAfter 保证顺序
@AutoConfiguration
@ConditionalOnClass(DataSource.class)
@AutoConfigureAfter(DataSourceAutoConfiguration.class) // 等 DataSource 装完
public class MyBatisAutoConfiguration {
    @Bean
    @ConditionalOnBean(DataSource.class)  // 必须在 DataSource 后判定
    public SqlSessionFactory sqlSessionFactory(DataSource ds) { ... }
}
// 用 ConditionalOnClass 替代更稳
@ConditionalOnClass(SqlSessionFactory.class)  // 类路径判定无顺序依赖
\`\`\`

踩坑：@ConditionalOnBean 适合本 AutoConfiguration 内已声明 Bean 判定，跨 AutoConfiguration 不可靠；@ConditionalOnProperty 缺省值用 matchIfMissing；@Profile 是另一种条件，按 spring.profiles.active 激活；自定义条件实现 Condition 接口 + @Conditional。`,
    keyPoints: ["ConditionalOnClass/Bean/Property/Web", "ConditionalOnBean 跨配置不可靠", "AutoConfigureAfter 保证顺序"],
    followUps: ["自定义 Condition 怎么写？", "@Profile 和 @ConditionalOnProperty 区别？"],
    favorited: false,
  },
  {
    id: "be-35",
    nodeId: "be-spring-boot",
    question: "Spring Boot 优雅停机如何配置？K8s 滚动更新不丢请求？",
    bigTech: true,
    answer: `优雅停机：1）接收 SIGTERM 信号；2）停止接收新请求；3）等待在途请求处理完；4）关闭数据库连接/线程池/MQ Consumer；5）退出。
Spring Boot 2.3+ 内置 graceful shutdown，配 server.shutdown=graceful + spring.lifecycle.timeout-per-shutdown-phase=30s。
K8s 配合：preStop 钩子 sleep 5s 等待 Endpoints 摘除，readinessProbe 立即失败防止新流量，terminationGracePeriodSeconds=45。

\`\`\`yaml
# Spring Boot 优雅停机
server:
  shutdown: graceful
spring:
  lifecycle:
    timeout-per-shutdown-phase: 30s
# K8s Deployment
spec:
  template:
    spec:
      containers:
      - name: app
        lifecycle:
          preStop:
            exec:
              command: ["sh", "-c", "sleep 5"]  # 等 Endpoints 摘除
        readinessProbe:
          httpGet: { path: /health/liveness, port: 8080 }
      terminationGracePeriodSeconds: 45
\`\`\`

踩坑：preStop 的 sleep 是关键，K8s 摘除 Endpoints 异步，立即 SIGTERM 会有请求打到正在关闭的 Pod；SIGTERM 后 Spring Boot 默认立即关 Tomcat，必须配 server.shutdown=graceful；MQ Consumer 优雅停止要 unregister consumer 再处理完在途消息；线程池用 shutdown() + awaitTermination(30s) + shutdownNow() 兜底。`,
    keyPoints: ["SIGTERM → 停新请求 → 处理在途 → 关资源", "server.shutdown=graceful", "K8s preStop sleep"],
    followUps: ["为什么 preStop 要 sleep？", "线程池如何优雅关闭？"],
    favorited: false,
  },

  // ===== 6. be-spring-cloud Spring Cloud =====
  {
    id: "be-36",
    nodeId: "be-spring-cloud",
    question: "字节抖音用 Nacos 还是 Eureka？服务注册中心选型？",
    bigTech: true,
    answer: `Eureka：AP 模型，节点间 P2P 复制，可用性优先，能容忍部分节点宕机；自保护模式（85% 心跳丢失不再剔除）防止网络分区误删；客户端缓存注册表，注册中心挂了仍能调用。
Nacos：支持 AP（默认）/CP 切换（CP 用 Raft），同时是注册中心和配置中心；支持命名空间、分组、权重、健康检查；阿里开源生态完善。

抖音微服务体量大 + 需要配置中心一体化，选 Nacos；早期 Netflix OSS 用户用 Eureka（已停止维护）。CP 模式注册中心（ZK/Consul/etcd）适合强一致场景（如分布式锁），不适合注册中心（网络分区时大量服务被误剔除）。

\`\`\`java
// Nacos 注册 + 配置一体化
@SpringBootApplication
@EnableDiscoveryClient
public class App {
    public static void main(String[] args) { SpringApplication.run(App.class, args); }
}
// bootstrap.yml
spring:
  cloud:
    nacos:
      discovery:
        server-addr: nacos.prod:8848
        namespace: prod
        cluster-name: BJ         // 同机房优先
        metadata:
          version: 1.0.0
      config:
        server-addr: nacos.prod:8848
        file-extension: yaml
        shared-configs:
          - data-id: common.yaml  // 共享配置
            refresh: true
\`\`\`

踩坑：Nacos AP 模式服务列表短暂不一致（秒级），强一致场景切 CP；Eureka 自保护模式生产常关闭或调整阈值（eureka.server.renewal-percent-threshold）；服务实例 metadata 用来灰度路由（按 version 路由）；Nacos 2.x gRPC 长连接比 1.x HTTP 心跳省资源 10 倍。`,
    keyPoints: ["Eureka AP / Nacos AP+CP", "注册中心用 AP", "Nacos 配置注册一体"],
    followUps: ["为什么注册中心选 AP 不选 CP？", "Nacos AP 和 CP 如何切换？"],
    favorited: false,
  },
  {
    id: "be-37",
    nodeId: "be-spring-cloud",
    question: "Spring Cloud Gateway 路由 + 过滤器原理？字节网关鉴权过滤器如何写？",
    bigTech: true,
    answer: `Gateway = Route（id + uri + predicate + filter）+ Predicate（断言匹配请求）+ Filter（前置/后置处理）。基于 Reactor + Netty 异步非阻塞，性能优于 Zuul 1.x 同步。
路由流程：请求 → Predicate 匹配 → 前置 Filter → 转发下游 → 后置 Filter → 响应。
字节网关鉴权：自定义 GlobalFilter 校验 JWT，校验失败返回 401，校验通过把 userId 注入 header 透传下游。

\`\`\`java
// 字节网关 JWT 鉴权过滤器
@Component
@Order(-100)  // 优先级（数字越小越先执行）
public class AuthFilter implements GlobalFilter {
    @Autowired private JwtService jwt;
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest req = exchange.getRequest();
        String path = req.getPath().value();
        if (path.startsWith("/public/")) return chain.filter(exchange); // 白名单
        String token = req.getHeaders().getFirst("Authorization");
        if (token == null) return unauthorized(exchange, "missing token");
        try {
            Claims claims = jwt.parse(token.replace("Bearer ", ""));
            ServerHttpRequest mutated = req.mutate()
                .header("X-User-Id", claims.getSubject())
                .build();
            return chain.filter(exchange.mutate().request(mutated).build());
        } catch (Exception e) {
            return unauthorized(exchange, "invalid token");
        }
    }
}
\`\`\`

踩坑：GlobalFilter 全局生效，GatewayFilter 仅特定 Route；@Order 控制顺序，鉴权应在最前；Netty 不能用阻塞操作，必须用 reactive（jwt 解析若同步要 wrap inMono.fromCallable + boundedElastic）；限流用 RequestRateLimiter + Redis，熔断用 circuitbreaker；网关聚合日志要 requestId 透传。`,
    keyPoints: ["Route + Predicate + Filter", "Reactor + Netty 异步", "GlobalFilter 鉴权"],
    followUps: ["Gateway 和 Zuul 区别？", "GlobalFilter 和 GatewayFilter 区别？"],
    favorited: false,
  },
  {
    id: "be-38",
    nodeId: "be-spring-cloud",
    question: "Sentinel 限流熔断原理？阿里双 11 如何用？",
    bigTech: true,
    answer: `Sentinel：滑动窗口统计 + 槽点链（Slot Chain）处理。责任链：NodeSelectorSlot → ClusterBuilderSlot → StatisticSlot（统计 QPS/RT）→ FlowSlot（限流）→ DegradeSlot（熔断）→ SystemSlot（系统保护）→ AuthoritySlot（黑白名单）。
熔断策略：慢调用比例、异常比例、异常数；半开探测。限流算法：滑动窗口、漏桶（匀速）、预热（WarmUp）。
阿里双 11：网关层按 API 限流（如秒杀 API 1 万 QPS），应用层按接口 + 用户维度限流（防恶意刷），下游依赖熔断（DB 慢时熔断保护上游）。

\`\`\`java
// Sentinel 双 11 秒杀限流
@SentinelResource(value = "seckill", blockHandler = "seckillBlocked", fallback = "seckillFallback")
public OrderResult seckill(Long skuId, Long userId) {
    return doSeckill(skuId, userId);
}
public OrderResult seckillBlocked(Long skuId, Long userId, BlockException ex) {
    return OrderResult.fail("当前秒杀火爆，请稍后再试");
}
// Nacos 动态规则
FlowRule rule = new FlowRule("seckill");
rule.setGrade(RuleConstant.FLOW_GRADE_QPS);
rule.setCount(10000);                  // 全局 1 万 QPS
rule.setLimitApp("default");
rule.setStrategy(RuleConstant.STRATEGY_DIRECT);
FlowRuleManager.loadRules(Collections.singletonList(rule));
\`\`\`

踩坑：blockHandler 处理限流降级，fallback 处理业务异常，两者方法签名不同；sentinel-datasource-nacos 支持规则动态推送；热点参数限流（ParamFlowRule）按 skuId 限流，防单 SKU 拖垮全局；熔断半开默认 5s，可调；Sentinel 集群限流（Token Server）适合网关层。`,
    keyPoints: ["槽点链 + 滑动窗口", "慢调用/异常熔断", "@SentinelResource 注解"],
    followUps: ["Sentinel 和 Hystrix 区别？", "集群限流如何实现？"],
    favorited: false,
  },
  {
    id: "be-39",
    nodeId: "be-spring-cloud",
    question: "OpenFeign 原理？阿里如何集成 Sentinel + Feign？",
    bigTech: true,
    answer: `OpenFeign = 接口 + 注解 → 动态代理。@EnableFeignClients 扫描 @FeignClient 接口，FeignClientFactoryBean 创建 JDK 代理，方法调用 → 编码 HTTP 请求 → 负载均衡选实例 → 执行 → 解码响应。
集成 Sentinel：feign.sentinel.enabled=true，Feign 自动用 Sentinel 包装每个方法，触发限流走 fallback。

\`\`\`java
// 阿里 Feign + Sentinel + fallback
@FeignClient(name = "stock-service", fallback = StockClientFallback.class)
public interface StockClient {
    @PostMapping("/stock/deduct")
    Result deduct(@RequestBody DeductReq req);
}
@Component
public class StockClientFallback implements StockClient {
    @Override public Result deduct(DeductReq req) {
        // 兜底：本地缓存 / 默认值 / 异步重试
        return Result.fail("库存服务暂不可用");
    }
}
// fallbackFactory 拿到异常做精细降级
@FeignClient(name = "stock-service", fallbackFactory = StockFallbackFactory.class)
public interface StockClientV2 { ... }
@Component
public class StockFallbackFactory implements FallbackFactory<StockClient> {
    @Override public StockClient create(Throwable cause) {
        return new StockClient() {
            @Override public Result deduct(DeductReq req) {
                if (cause instanceof FlowException) return Result.fail("限流");
                return Result.fail("系统异常");
            }
        };
    }
}
\`\`\`

踩坑：fallback 无异常入参，fallbackFactory 能拿异常细分；Feign 默认不打印请求日志，调 Logger.Level.FULL；超时分别配 connectTimeout 和 readTimeout；Feign + Ribbon/LoadBalancer 重试默认不开启，开启后要警惕幂等性；Hystrix 已停止维护，新项目用 Resilience4j 或 Sentinel。`,
    keyPoints: ["Feign 动态代理 + 负载均衡", "feign.sentinel.enabled 集成", "fallback vs fallbackFactory"],
    followUps: ["Feign 如何做负载均衡？", "Resilience4j 和 Sentinel 区别？"],
    favorited: false,
  },
  {
    id: "be-40",
    nodeId: "be-spring-cloud",
    question: "服务雪崩如何防止？字节熔断降级策略？",
    bigTech: true,
    answer: `雪崩原因：下游慢 → 上游线程池耗尽 → 上游也慢 → 全链路阻塞。
防止：1）熔断（Circuit Breaker）：下游异常率超阈值快速失败，半开探测恢复；2）限流：控制进入下游 QPS；3）隔离：信号量/线程池隔离避免互相拖累；4）降级：返回兜底值；5）超时：所有调用必设超时。
字节抖音策略：调用推荐/搜索等下游用熔断（异常率 50% 触发），核心 API 用限流（QPS 上限），非核心功能（如评论）降级返回空。

\`\`\`java
// 字节 Resilience4j 熔断 + 限流
@Configuration
public class ResilienceConfig {
    @Bean
    public CircuitBreakerRegistry circuitRegistry() {
        CircuitBreakerConfig config = CircuitBreakerConfig.custom()
            .failureRateThreshold(50)             // 异常率 50% 触发
            .slowCallRateThreshold(60)            // 慢调用比例 60% 触发
            .slowCallDurationThreshold(Duration.ofSeconds(2))
            .waitDurationInOpenState(Duration.ofSeconds(20))   // 开启 20s 后半开
            .slidingWindowSize(100)               // 滑动窗口 100 次
            .minimumNumberOfCalls(20)             // 最少 20 次才统计
            .build();
        return CircuitBreakerRegistry.of(config);
    }
}
// 使用
@Service
public class RecommendService {
    @CircuitBreaker(name = "recommend", fallbackMethod = "fallback")
    @TimeLimiter(name = "recommend")
    public CompletableFuture<RecommendResp> recommend(long uid) {
        return CompletableFuture.supplyAsync(() -> client.recommend(uid));
    }
    public CompletableFuture<RecommendResp> fallback(long uid, Throwable t) {
        return CompletableFuture.completedFuture(RecommendResp.cached(uid));
    }
}
\`\`\`

踩坑：熔断半开探测请求量少，可能误判恢复，多次半开失败要延长 waitDuration；线程池隔离开销大但隔离强，信号量隔离轻量但不支持异步超时；超时层次：网关 > 应用 > RPC > DB，外层要大于内层总和；限流和熔断都要监控告警，否则静默降级难发现。`,
    keyPoints: ["熔断/限流/隔离/降级/超时五板斧", "熔断半开探测", "Resilience4j 配置"],
    followUps: ["熔断器三种状态如何切换？", "信号量隔离和线程池隔离区别？"],
    favorited: false,
  },
  {
    id: "be-41",
    nodeId: "be-spring-cloud",
    question: "Spring Cloud Config vs Nacos Config vs Apollo？阿里配置中心选型？",
    bigTech: true,
    answer: `Spring Cloud Config：基于 Git，无 UI 推送改 Git，需 Bus + MQ 广播刷新，运维复杂。
Nacos Config：注册配置一体，AP/CP 可切，支持命名空间/分组/灰度发布，阿里开源。
Apollo：携程开源，UI 强大，多环境/多集群/灰度发布/权限/审计完善，CTO 模式支持，配置实时推送（HTTP 长轮询）。
阿里内部用 Diamond/Configserver，开源版用 Nacos；中大型企业多选 Apollo（功能更全）。

\`\`\`java
// Apollo 客户端
@Configuration
@EnableApolloConfig
public class AppConfig {}
@Component
public class OrderConfig {
    @Value("${order.timeout:3000}")
    private int timeout;
    @ApolloConfigChangeListener
    private void onChange(ConfigChangeEvent event) {
        if (event.changedKeys().contains("order.timeout")) {
            refreshPool();  // 配置变更时重建线程池
        }
    }
}
// Nacos @RefreshScope
@RestController
@RefreshScope
public class OrderController {
    @Value("${order.timeout:3000}") private int timeout;
}
\`\`\`

踩坑：Spring Cloud Config 不能实时推送（要 Bus），新项目别选；Apollo 监听器在变更时同步执行，慢操作要异步；@RefreshScope 重建 Bean 但不重建依赖它的 Bean（如不刷新 Controller 已注入的 Service），需手动重启或重新注入；敏感配置（数据库密码）用加密 + KMS，不要明文存配置中心。`,
    keyPoints: ["Config Git / Nacos 一体 / Apollo 功能强", "Apollo 灰度发布 + 审计", "@RefreshScope 动态刷新"],
    followUps: ["@RefreshScope 不刷新依赖的 Bean 怎么办？", "Apollo 灰度发布如何实现？"],
    favorited: false,
  },
  {
    id: "be-42",
    nodeId: "be-spring-cloud",
    question: "分布式链路追踪原理？字节 SkyWalking 部署架构？",
    bigTech: true,
    answer: `链路追踪核心：Trace（一次请求全局 ID）+ Span（一个操作）+ Parent Span ID（父子关系）。Agent 在 HTTP/RPC/MQ/Kafka 入口生成 traceId，透传到下游（HTTP header / RPC attachment / MQ header）。
采样：全量采样压力大，按比例（如 1%）或按异常请求采样。
字节用 SkyWalking（阿里也用）：Agent（无侵入字节码增强）→ OAP Server（聚合分析）→ ES/MySQL（存储）→ UI（拓扑图 + 调用链）。

\`\`\`java
// SkyWalking Agent 无侵入接入
# 启动参数挂载 agent
java -javaagent:/data/skywalking-agent/skywalking-agent.jar \
  -Dskywalking.agent.service_name=order-service \
  -Dskywalking.collector.backend_service=oap:11800 \
  -jar app.jar
// 手动埋点（异常场景）
@Trace
public Order createOrder(OrderReq req) {
    ContextManager.currentSpan().tag("orderId", String.valueOf(req.getId()));
    return doCreate(req);
}
// 跨服务透传（HTTP）
String traceId = TraceContext.traceId();
HttpHeaders headers = new HttpHeaders();
headers.add("SW8", TraceContext.serialize()); // 透传 SW8 header
\`\`\`

踩坑：SkyWalking Agent 字节码增强会和 Arthas/CGLIB 冲突；采样率不能 0，否则性能问题难排查；traceId 必须全链路透传，跨 MQ/线程池要手动传递（SkyWalking 8.x 自动透传大部分场景）；存储 ES 大流量要分索引 + TTL，否则磁盘爆；traceId 落日志便于关联；MDC 把 traceId 注入日志上下文。`,
    keyPoints: ["Trace + Span + ParentId", "Agent 无侵入 + OAP + ES", "traceId 跨服务透传"],
    followUps: ["SkyWalking 和 Zipkin 区别？", "traceId 跨线程池如何透传？"],
    favorited: false,
  },

  // ===== 7. be-python-advanced Python 进阶 =====
  {
    id: "be-43",
    nodeId: "be-python-advanced",
    question: "Python GIL 为什么存在？多线程为什么不能利用多核？美团爬虫如何绕过？",
    bigTech: true,
    answer: `GIL（全局解释器锁）：CPython 解释器级别的互斥锁，同一时刻只允许一个线程执行 Python 字节码。设计原因：CPython 内存管理（引用计数）非线程安全，加 GIL 简化实现。
影响：CPU 密集型多线程无法用多核；IO 密集型多线程仍有效（IO 时释放 GIL）。
绕过：1）multiprocessing 多进程；2）C 扩展（NumPy/Pandas 内部释放 GIL）；3）Jython/PyPy（无 GIL）；4）Python 3.13+ 实验性 No-GIL。

\`\`\`python
# 美团爬虫：IO 密集用 asyncio + aiohttp（GIL 在 IO 时释放）
import asyncio, aiohttp
async def fetch(session, url):
    async with session.get(url) as resp:
        return await resp.text()
async def crawl(urls):
    async with aiohttp.ClientSession() as session:
        return await asyncio.gather(*[fetch(session, u) for u in urls])
# CPU 密集（解析 HTML）用 ProcessPoolExecutor
from concurrent.futures import ProcessPoolExecutor
with ProcessPoolExecutor(max_workers=4) as pool:
    results = list(pool.map(parse_html, htmls))
\`\`\`

踩坑：CPU 密集多线程反而比单线程慢（GIL 切换开销）；multiprocessing 进程间内存不共享，序列化开销大，用 shared_memory 或 Manager 共享；CPU 密集型任务可考虑用 Cython/Rust 加 norelse 释放 GIL；多进程启动慢，长任务才划算。`,
    keyPoints: ["GIL 解释器级互斥锁", "CPU 密集多线程无效", "IO 用 asyncio / CPU 用多进程"],
    followUps: ["Python 3.13 No-GIL 怎么实现的？", "C 扩展如何释放 GIL？"],
    favorited: false,
  },
  {
    id: "be-44",
    nodeId: "be-python-advanced",
    question: "asyncio 协程原理？事件循环 + Future + Task 关系？",
    bigTech: true,
    answer: `协程：用户态轻量线程，由事件循环调度。async def 定义协程函数，await 挂起当前协程让出执行权。
事件循环（EventLoop）：单线程轮询 IO 就绪事件，调度就绪的协程恢复执行。
Future：异步结果占位符；Task：包装协程的 Future，事件循环调度执行。

\`\`\`python
import asyncio
async def fetch_url(url):
    reader, writer = await asyncio.open_connection(url, 80)
    writer.write(b"GET / HTTP/1.1\\r\\n\\r\\n")
    await writer.drain()
    data = await reader.read(1024)
    writer.close()
    return data
async def main():
    # 并发 1000 个请求
    tasks = [asyncio.create_task(fetch_url(u)) for u in urls]
    results = await asyncio.gather(*tasks, return_exceptions=True)
asyncio.run(main())
# 限制并发数（信号量）
sem = asyncio.Semaphore(100)
async def limited_fetch(url):
    async with sem:
        return await fetch_url(url)
\`\`\`

踩坑：asyncio 单线程，CPU 密集会阻塞循环，CPU 任务用 run_in_executor 丢线程池；asyncio.gather 默认一异常全失败，return_exceptions=True 容错；asyncio.run 每次创建新循环，不要嵌套；HTTP 客户端用 aiohttp 不能用 requests（同步阻塞）；Python 3.11+ asyncio.TaskGroup 更优雅。`,
    keyPoints: ["协程 + 事件循环 + Future/Task", "await 让出执行权", "Semaphore 限并发"],
    followUps: ["asyncio 和 gevent 区别？", "asyncio 如何调度协程？"],
    favorited: false,
  },
  {
    id: "be-45",
    nodeId: "be-python-advanced",
    question: "元类 metaclass 作用？ORM/Django Model 如何用？",
    answer: `元类是"类的类"，type 是默认元类。class Foo 触发 type.__call__ → type.__new__ + type.__init__ 创建类对象。
元类用途：1）拦截类创建，自动注入属性/方法；2）注册类（插件系统）；3）DSL（Django ORM 把字段定义转 SQL）。
Django Model：ModelBase 元类扫描 _meta.fields 收集 Field 实例，生成数据库表元数据；SQLAlchemy Declarative 同理。

\`\`\`python
# 简化版 ORM 元类
class Field:
    def __init__(self, type): self.type = type
class ModelMeta(type):
    def __new__(mcs, name, bases, ns):
        if name == "Model": return super().__new__(mcs, name, bases, ns)
        fields = {k: v for k, v in ns.items() if isinstance(v, Field)}
        ns["_fields"] = fields
        ns["_table"] = name.lower()
        return super().__new__(mcs, name, bases, ns)
class Model(metaclass=ModelMeta):
    pass
class User(Model):
    id = Field("int")
    name = Field("str")
print(User._fields)  # {'id': Field('int'), 'name': Field('str')}
print(User._table)   # 'user'
\`\`\`

踩坑：元类增加魔法让代码难调试，能用装饰器/继承就别用元类；元类继承复杂（多继承时元类冲突）；Django Model 的字段定义在类层级（不是实例），避免可变默认值；dataclass（3.7+）能替代 90% 元类场景，更易理解。`,
    keyPoints: ["元类是类的类", "拦截类创建注入属性", "Django ORM ModelBase"],
    followUps: ["type 元类如何创建类？", "dataclass 和元类区别？"],
    favorited: false,
  },
  {
    id: "be-46",
    nodeId: "be-python-advanced",
    question: "装饰器原理？带参数装饰器 + functools.wraps 怎么写？",
    bigTech: true,
    answer: `装饰器：本质是高阶函数，接收函数返回新函数。@decorator 等价于 func = decorator(func)。
带参数装饰器：三层嵌套——外层接收参数，中层接收函数，内层接收实际参数。functools.wraps 保留原函数元信息（__name__/__doc__）。

\`\`\`python
from functools import wraps
import time
# 带参数装饰器：美团接口耗时监控
def metric(name, threshold=1.0):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            start = time.time()
            try:
                result = func(*args, **kwargs)
                return result
            finally:
                cost = time.time() - start
                if cost > threshold:
                    report_slow(name, cost)  # 上报慢调用
        return wrapper
    return decorator
@metric("order.create", threshold=0.5)
def create_order(req):
    """创建订单"""
    return do_create(req)
print(create_order.__name__)  # create_order（wraps 保留）
\`\`\`

踩坑：@wraps 必须加，否则原函数元信息丢失，traceback 难定位；带参装饰器三层嵌套易写错；类装饰器用 __call__ 实现，可保持状态（如缓存）；functools.lru_cache 内置缓存装饰器，maxsize 控制大小；装饰器叠加从下往上执行装饰，从上往下调用包装。`,
    keyPoints: ["装饰器 = 高阶函数", "@deco 等价 func=deco(func)", "带参数三层嵌套 + wraps"],
    followUps: ["类装饰器如何实现？", "functools.lru_cache 原理？"],
    favorited: false,
  },
  {
    id: "be-47",
    nodeId: "be-python-advanced",
    question: "Python 闭包和作用域 LEGB？为什么默认参数是可变对象有坑？",
    bigTech: true,
    answer: `LEGB 查找顺序：Local → Enclosing（闭包外层）→ Global → Builtin。
闭包：内层函数引用外层函数变量，外层函数返回后变量仍存活（在 __closure__ 中）。
默认参数坑：可变默认参数（list/dict）在函数定义时只创建一次，多次调用共享同一对象，导致状态污染。

\`\`\`python
# 闭包：累加器
def make_accumulator():
    total = 0
    def add(n):
        nonlocal total   # 修改外层变量用 nonlocal
        total += n
        return total
    return add
acc = make_accumulator()
acc(1); acc(2)  # 3

# 坑：可变默认参数共享
def append_item(item, lst=[]):  # 错！lst 在函数定义时创建一次
    lst.append(item)
    return lst
append_item(1)  # [1]
append_item(2)  # [1, 2]（不是 [2]！）

# 正确：用 None 哨兵
def append_safe(item, lst=None):
    if lst is None: lst = []
    lst.append(item)
    return lst
\`\`\`

踩坑：可变默认参数是 Python 经典面试题，pylint 会告警 W0102；闭包修改变量用 nonlocal（局部）、global（全局）；list/dict 局部变量也别用 *args 收集后修改；延迟绑定：闭包在循环里捕获循环变量，到调用时变量已是最后值，要默认参数固定。`,
    keyPoints: ["LEGB 作用域", "闭包 __closure__", "可变默认参数共享"],
    followUps: ["nonlocal 和 global 区别？", "闭包延迟绑定怎么修？"],
    favorited: false,
  },
  {
    id: "be-48",
    nodeId: "be-python-advanced",
    question: "Python GC：引用计数 + 分代回收？循环引用如何处理？",
    answer: `Python GC：1）引用计数（主）：对象引用 +1/-1，归零立即回收，快但不能处理循环引用；2）分代回收（辅）：定期扫描"容器对象"（list/dict/实例）解决循环引用，分 3 代，越老扫描越少；3）标记清除：从根对象出发标记可达对象，清除不可达。
循环引用：a.b = b, b.a = a，引用计数都是 1 无法回收，分代回收检测后清除。

\`\`\`python
import gc
class Node:
    def __init__(self): self.ref = None
a = Node(); b = Node()
a.ref = b; b.ref = a  # 循环引用
del a; del b           # 引用计数都还是 1，分代 GC 才回收
gc.collect()           # 手动触发
# 弱引用打破循环
import weakref
a.ref = weakref.ref(b)  # 弱引用不计引用计数

# 调试循环引用
gc.set_debug(gc.DEBUG_LEAK)
gc.collect()
print(gc.garbage)  # 无法清除的对象（有 __del__ 的循环引用）
\`\`\`

踩坑：定义 __del__ 的循环引用（Python 3.4 前）无法被 GC 回收，进 gc.garbage；__slots__ 节省内存但禁用属性动态添加；大量小对象用 __slots__ + numpy/Pandas 提升性能；gc 模块阈值调高减少 GC 频率提升吞吐；C 扩展对象的引用计数要手动 Py_INCREF/DECREF。`,
    keyPoints: ["引用计数 + 分代 + 标记清除", "循环引用靠分代 GC", "weakref 打破循环"],
    followUps: ["__del__ 对 GC 有什么影响？", "__slots__ 为什么省内存？"],
    favorited: false,
  },
  {
    id: "be-49",
    nodeId: "be-python-advanced",
    question: "美团推荐服务用 Python 还是 C++？GIL 限制下如何提升性能？",
    bigTech: true,
    answer: `美团推荐场景：在线服务用 C++/Java（高性能），离线训练用 Python（生态好），特征抽取用 Python + Cython/Rust 加速。
GIL 限制下提速方法：1）C 扩展（Cython/numpy 内部释放 GIL）；2）multiprocessing 多进程；3）PyPy JIT；4）Numba JIT（数值计算）；5）Rust + PyO3；6）Python 3.13 No-GIL。

\`\`\`python
# 美团特征计算：Cython 释放 GIL
# features.pyx
cimport cython
from libc.math cimport sqrt
@cython.boundscheck(False)
@cython.wraparound(False)
cdef double compute_score(double[:] vec) nogil:  # nogil 释放 GIL
    cdef double s = 0.0
    cdef int i
    for i in range(vec.shape[0]):
        s += vec[i] * vec[i]
    return sqrt(s)
# 多线程调用（释放 GIL 后真正并行）
from concurrent.futures import ThreadPoolExecutor
with ThreadPoolExecutor(8) as pool:
    scores = list(pool.map(compute_score_py, vectors))
\`\`\`

踩坑：Cython 编译部署复杂，CI 要编译 .so；numpy 操作本身 C 实现已释放 GIL，尽量用向量化代替循环；multiprocessing 序列化开销大，大数据用 shared_memory；Python 3.13 No-GIL 兼容性还在改善，C 扩展需重新编译；在线服务用 gunicorn + uvicorn workers 多进程充分利用多核。`,
    keyPoints: ["在线 C++ 离线 Python", "Cython nogil 释放 GIL", "numpy 向量化"],
    followUps: ["Cython 和 Numba 区别？", "Python 3.13 No-GIL 兼容性如何？"],
    favorited: false,
  },

  // ===== 8. be-go-advanced Go 进阶 =====
  {
    id: "be-50",
    nodeId: "be-go-advanced",
    question: "GMP 调度模型？goroutine 为什么轻量？字节 Go 微服务 QPS 如何？",
    bigTech: true,
    answer: `GMP：G（goroutine，用户态协程 2KB 栈）、M（内核线程）、P（处理器，调度上下文，GOMAXPROCS 个）。
调度：G 在 P 的本地队列（256 容量）+ 全局队列。M 绑定 P 执行 G，本地空了从全局/其他 P 偷一半（work stealing）。
goroutine 轻量：2KB 初始栈（可扩缩）、用户态切换（无系统调用）、创建销毁成本极低。
字节 Go 微服务单机 100 万 goroutine、10 万 QPS 常见。

\`\`\`go
// 字节微服务高并发 HTTP 服务
func main() {
    http.HandleFunc("/api/feed", feedHandler)
    // GOMAXPROCS 默认 CPU 核数
    runtime.GOMAXPROCS(runtime.NumCPU())
    http.ListenAndServe(":8080", nil)
}
func feedHandler(w http.ResponseWriter, r *http.Request) {
    // 每请求一个 goroutine，2KB 栈可扩到 1GB
    uid := r.URL.Query().Get("uid")
    ch := make(chan *Feed, 3)
    go fetchRecommend(uid, ch)  // 并发拉取多个数据源
    go fetchFollow(uid, ch)
    go fetchHot(uid, ch)
    var feeds []*Feed
    for i := 0; i < 3; i++ {
        feeds = append(feeds, <-ch)
    }
    json.NewEncoder(w).Encode(merge(feeds))
}
\`\`\`

踩坑：goroutine 泄漏（channel 等待方退出但发送方阻塞），用 context.Context 传播取消；GOMAXPROCS > CPU 核数不提升性能反而增加切换；cgo 调用会锁定 M（sysmon 不能抢占）；高并发 channel 用 buffered 避免阻塞；pprof 看 goroutine 数量防泄漏。`,
    keyPoints: ["GMP: G/M/P", "goroutine 2KB 栈用户态切换", "work stealing 调度"],
    followUps: ["goroutine 泄漏如何排查？", "GMP 中 P 的本地队列满了怎么办？"],
    favorited: false,
  },
  {
    id: "be-51",
    nodeId: "be-go-advanced",
    question: "channel 原理？无缓冲 vs 有缓冲？关闭 channel 注意事项？",
    bigTech: true,
    answer: `channel 底层：hchan 结构含循环数组（缓冲）、发送/接收 goroutine 队列、互斥锁。
无缓冲：发送和接收必须同时存在（同步握手），否则阻塞。
有缓冲：缓冲未满发送不阻塞，未空接收不阻塞（异步）。
关闭：只能由发送方关闭；关闭后接收方读完数据后返回零值（用 v, ok := <-ch 判断）；重复关闭或向已关闭 channel 发送 panic。

\`\`\`go
// 字节抖音点赞：worker pool + channel
func likeWorker(id int, jobs <-chan LikeReq, results chan<- LikeResp, ctx context.Context) {
    for {
        select {
        case <-ctx.Done():
            return
        case req, ok := <-jobs:
            if !ok { return }  // channel 关闭
            results <- processLike(req)
        }
    }
}
func main() {
    ctx, cancel := context.WithCancel(context.Background())
    defer cancel()
    jobs := make(chan LikeReq, 1000)
    results := make(chan LikeResp, 1000)
    for i := 0; i < 100; i++ { go likeWorker(i, jobs, results, ctx); }
    // 生产者
    go func() { defer close(jobs); for _, r := range reqs { jobs <- r } }()
    // 收集结果
    for i := 0; i < len(reqs); i++ { fmt.Println(<-results) }
}
\`\`\`

踩坑：关闭已关闭 channel panic；向已关闭 channel 发送 panic；for range channel 在 close 后自动退出；select + default 实现非阻塞；nil channel 的发送接收永久阻塞（select 中可用于禁用分支）；缓冲大小按生产消费速率差设，过大掩盖背压。`,
    keyPoints: ["channel 循环数组 + goroutine 队列", "无缓冲同步 / 有缓冲异步", "只能发送方 close"],
    followUps: ["nil channel 在 select 中有什么用？", "channel 底层 hchan 结构？"],
    favorited: false,
  },
  {
    id: "be-52",
    nodeId: "be-go-advanced",
    question: "interface 隐式实现？nil interface 坑？Go 错误处理最佳实践？",
    bigTech: true,
    answer: `interface 隐式实现：不需要 implements 关键字，结构体实现接口所有方法即视为实现（鸭子类型）。
nil interface 坑：interface 内部是 (type, value) 二元组，只要 type 不为 nil 接口就不为 nil，即使 value 为 nil。错误赋值导致 nil 检查失效。
错误处理：error 作为返回值（无异常），if err != nil 显式处理；errors.Is/As 处理包装错误；defer + recover 处理 panic。

\`\`\`go
// nil interface 坑
type MyError struct{ msg string }
func (e *MyError) Error() string { return e.msg }
func bad() error {
    var err *MyError = nil
    return err  // 返回 (*MyError, nil)，接口非 nil！
}
func good() error {
    return nil  // 返回 (nil, nil)，接口为 nil
}
// 错误包装（Go 1.13+）
if err := doSomething(); err != nil {
    return fmt.Errorf("operation failed: %w", err)  // %w 包装
}
// 错误判断
if errors.Is(err, sql.ErrNoRows) { /* ... */ }
var pe *PathError
if errors.As(err, &pe) { /* 取出 PathError */ }

// panic 恢复（中间件）
func recoverMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        defer func() {
            if rec := recover(); rec != nil {
                log.Printf("panic: %v\\n%s", rec, debug.Stack())
                http.Error(w, "internal error", 500)
            }
        }()
        next.ServeHTTP(w, r)
    })
}
\`\`\`

踩坑：函数返回 error 接口时，不要返回具体类型 nil 指针（接口非 nil）；errors.Is 比对错误值（如 io.EOF），errors.As 比对类型；defer recover 不能跨 goroutine；error 要早返回，避免嵌套；自定义错误类型实现 Is/As 方法支持深度匹配。`,
    keyPoints: ["interface (type, value) 二元组", "nil interface 坑", "error 显式处理 + Is/As"],
    followUps: ["error wrapping 的 %w 和 %v 区别？", "panic 何时使用？"],
    favorited: false,
  },
  {
    id: "be-53",
    nodeId: "be-go-advanced",
    question: "context.Context 如何传播取消？美团 Go 服务超时控制？",
    bigTech: true,
    answer: `context 四种：context.Background（根）、context.TODO（待定）、WithCancel、WithTimeout/WithDeadline、WithValue。
传播：函数第一个参数传 context，下游操作（HTTP/DB/MQ）监听 ctx.Done()。父 ctx 取消，所有子 ctx 自动取消。
美团规范：所有 RPC 函数第一参数 ctx；超时用 WithTimeout；requestId 用 WithValue 透传；cancel 函数必须 defer 调用防泄漏。

\`\`\`go
// 美团 Go 服务：超时 + 取消传播
func GetUser(ctx context.Context, uid string) (*User, error) {
    ctx, cancel := context.WithTimeout(ctx, 500*time.Millisecond)
    defer cancel()  // 必须调用，否则子 ctx 泄漏
    // RPC 调用自动响应 ctx 取消
    resp, err := rpcClient.Call(ctx, "User.Get", &Req{Uid: uid})
    if err != nil { return nil, err }
    // 监听取消做清理
    select {
    case <-ctx.Done():
        cleanup()  // 超时清理
        return nil, ctx.Err()
    default:
        return resp.User, nil
    }
}
// HTTP 中间件注入 traceId
func traceMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        traceId := r.Header.Get("X-Trace-Id")
        if traceId == "" { traceId = uuid.New().String() }
        ctx := context.WithValue(r.Context(), "traceId", traceId)
        next.ServeHTTP(w, r.WithContext(ctx))
    })
}
\`\`\`

踩坑：WithValue 只传请求元数据（traceId/userId），别用来传业务参数（破坏函数签名）；cancel 不调用会泄漏子 ctx 直到超时；ctx 不要存为结构体字段，函数参数传递；net/http 自动监听 ctx 取消，但 DB driver 不一定支持；context.Value 的 key 用自定义类型防冲突。`,
    keyPoints: ["ctx 父子传播取消", "WithTimeout + defer cancel", "WithValue 传元数据"],
    followUps: ["context.Value 为什么不能传业务参数？", "ctx 取消后 DB 操作如何响应？"],
    favorited: false,
  },
  {
    id: "be-54",
    nodeId: "be-go-advanced",
    question: "Go 内存管理：逃逸分析？栈 vs 堆分配？美团如何优化？",
    bigTech: true,
    answer: `逃逸分析：编译器决定变量分配栈还是堆。栈分配快（函数返回自动回收），堆分配需 GC。
逃逸场景：1）取地址且地址逃逸出函数（返回指针）；2）interface{} 动态类型；3）闭包捕获；4）大小超栈分配上限；5）被发送到 channel。
美团优化：1）避免返回局部变量指针；2）预分配切片 make([]T, 0, n)；3）sync.Pool 复用对象减少 GC；4）[]byte 转 string 用 unsafe（避免拷贝）。

\`\`\`go
// 美团 Go 内存优化
// 1. 预分配切片（避免多次扩容）
users := make([]User, 0, 100)  // 已知容量预分配
for _, u := range data { users = append(users, u) }

// 2. sync.Pool 复用 buffer
var bufPool = sync.Pool{
    New: func() interface{} { return new(bytes.Buffer) },
}
func handle(w http.ResponseWriter, r *http.Request) {
    buf := bufPool.Get().(*bytes.Buffer)
    buf.Reset()
    defer bufPool.Put(buf)
    json.NewEncoder(buf).Encode(data)
    w.Write(buf.Bytes())
}

// 3. 检查逃逸
// go build -gcflags="-m -l" main.go
\`\`\`

踩坑：返回指针虽方便但触发逃逸，热路径考虑值返回；interface 参数（如 fmt.Println）会让参数逃逸；[]byte 转 string 默认拷贝，用 unsafe.String 零拷贝（不能修改原 byte）；sync.Pool 对象在 GC 时可能被清空，不能保证常驻；大对象用指针避免值拷贝但要权衡 GC 压力。`,
    keyPoints: ["逃逸分析决定栈/堆", "返回指针/interface 逃逸", "sync.Pool 复用"],
    followUps: ["如何用 -gcflags 看逃逸？", "sync.Pool 为什么 GC 时清空？"],
    favorited: false,
  },
  {
    id: "be-55",
    nodeId: "be-go-advanced",
    question: "Go GC：三色标记 + 混合写屏障？低延迟如何调优？",
    bigTech: true,
    answer: `Go GC：并发三色标记 + 混合写屏障。
三色：白（未访问）→ 灰（已访问未扫描）→ 黑（已扫描）。从根出发标记可达对象，最后清除白色。
写屏障：标记期间修改指针时，把新对象标灰，避免漏标。Go 1.8+ 混合写屏障（Dijkstra + Yuasa），无需 STW 第二阶段。
调优：GOGC=100（默认，堆翻倍触发 GC），低延迟调 GOGC=200 或 GOMEMLIMIT；Go 1.19+ 软内存限制 GOMEMLIMIT。

\`\`\`go
// 字节 Go GC 调优
// 1. 设置 GOGC（默认 100，即堆翻倍触发）
// GOGC=200 减少频率，提升吞吐，但内存翻 3 倍
// 2. GOMEMLIMIT 软限制（Go 1.19+）
// GOMEMLIMIT=8GiB 限制堆到 8G，超限时 GOGC 失效，按内存限制调度
// 3. 看 GC 日志
// GODEBUG=gctrace=1 打印每次 GC
// runtime.ReadMemStats 监控
var m runtime.MemStats
runtime.ReadMemStats(&m)
fmt.Printf("Alloc=%d HeapInuse=%d NumGC=%d\\n", m.Alloc, m.HeapInuse, m.NumGC)
// 4. 设置 GC 百分比
debug.SetGCPercent(200)
// 5. 强制 GC（测试用）
runtime.GC()
\`\`\`

踩坑：GOGC 调大减少 GC 频率但内存涨；GOMEMLIMIT 接近容器内存限制时频繁 GC，留 10% buffer；Go 1.5 三色并发后 STW < 10ms，无需纠结 STW；大量小对象用 sync.Pool 减少 GC 压力；指针越少 GC 越快，大数组用值类型而非指针切片；pprof heap 看分配热点。`,
    keyPoints: ["三色标记 + 混合写屏障", "GOGC 触发阈值", "GOMEMLIMIT 软限制"],
    followUps: ["三色标记为什么需要写屏障？", "GOMEMLIMIT 和 GOGC 关系？"],
    favorited: false,
  },
  {
    id: "be-56",
    nodeId: "be-go-advanced",
    question: "Go 并发模式：worker pool / fan-in fan-out / pipeline？字节如何用？",
    bigTech: true,
    answer: `常见模式：1）Worker Pool：固定 goroutine 数消费任务，控制并发防爆炸；2）Fan-out/Fan-in：分发任务到多个 worker，再合并结果；3）Pipeline：阶段式流水线，每阶段一组 goroutine；4）Tee：广播一个 channel 到多个；5）Done Channel：可取消的生成器。
字节抖音 Feed 流：用户请求 fan-out 到推荐/关注/热门三个 worker 并发拉数据，fan-in 合并排序后返回。

\`\`\`go
// 字节 Feed 流：fan-out + fan-in
func fetchFeed(ctx context.Context, uid string) ([]Feed, error) {
    ctx, cancel := context.WithTimeout(ctx, 800*time.Millisecond)
    defer cancel()
    // fan-out
    recommendCh := fetchRecommend(ctx, uid)
    followCh := fetchFollow(ctx, uid)
    hotCh := fetchHot(ctx, uid)
    // fan-in：合并三个 channel
    merged := fanIn(ctx, recommendCh, followCh, hotCh)
    var feeds []Feed
    for feed := range merged {
        feeds = append(feeds, feed)
    }
    sort.Slice(feeds, func(i, j int) bool { return feeds[i].Score > feeds[j].Score })
    return feeds, nil
}
func fanIn(ctx context.Context, channels ...<-chan Feed) <-chan Feed {
    var wg sync.WaitGroup
    out := make(chan Feed)
    multiplex := func(c <-chan Feed) {
        defer wg.Done()
        for v := range c { select { case out <- v: case <-ctx.Done(): return } }
    }
    wg.Add(len(channels))
    for _, c := range channels { go multiplex(c) }
    go func() { wg.Wait(); close(out) }()
    return out
}
\`\`\`

踩坑：fan-out 数量限制（用 semaphore 或 worker pool）防止 goroutine 爆炸；fan-in 合并时一定 close 输出 channel；ctx 取消要让所有 goroutine 退出（select ctx.Done）；pipeline 阶段间缓冲 channel 大小要平衡；errgroup.WithContext 简化错误传播和取消。`,
    keyPoints: ["Worker Pool / Fan-out / Fan-in / Pipeline", "fanIn 合并多 channel", "ctx 取消传播"],
    followUps: ["errgroup 和 sync.WaitGroup 区别？", "Pipeline 模式如何处理错误？"],
    favorited: false,
  },

  // ===== 9. be-mysql-index MySQL 索引与优化 =====
  {
    id: "be-57",
    nodeId: "be-mysql-index",
    question: "MySQL 为什么用 B+ 树不用 B 树/红黑树/跳表？",
    bigTech: true,
    answer: `B+ 树优势：1）非叶子节点不存数据，扇出大（InnoDB 默认 16KB 页，单页可存 1000+ 索引项，3 层 B+ 树可存千万级数据）；2）数据有序链表，范围查询高效；3）所有数据在叶子节点，查询稳定 O(log n)。
B 树：非叶子存数据，扇出小，相同数据树更深 IO 多；红黑树：二叉树高度高，IO 次数多；跳表：内存结构优秀，磁盘 IO 不如 B+ 树。
Redis 用跳表（内存访问），MySQL 用 B+ 树（磁盘 IO）。

\`\`\`sql
-- InnoDB 主键索引（聚簇）：叶子存整行数据
-- 二级索引（非聚簇）：叶子存主键值，需回表
-- 看索引结构
SHOW INDEX FROM orders;
-- 索引高度（InnoDB 16KB 页）
-- 3 层 B+ 树：根页 + 中间页 + 叶子页
-- 单页索引项 ≈ 16KB / (索引键大小 + 指针 6B)
\`\`\`

踩坑：InnoDB 主键索引和数据一起存（聚簇），所以主键选型重要（自增 ID > UUID，UUID 让 B+ 树频繁分裂）；二级索引查询需回表，覆盖索引避免回表；页大小 innodb_page_size 默认 16KB，可调大减少 IO；B+ 树高度通常 3-4 层，查询 3-4 次 IO。`,
    keyPoints: ["B+ 树非叶子扇出大", "叶子链表范围查询优", "InnoDB 聚簇 + 二级回表"],
    followUps: ["InnoDB 主键为什么推荐自增？", "B+ 树高度怎么算？"],
    favorited: false,
  },
  {
    id: "be-58",
    nodeId: "be-mysql-index",
    question: "聚簇索引 vs 二级索引？回表是什么？覆盖索引如何避免？",
    bigTech: true,
    answer: `聚簇索引（Clustered）：叶子节点存整行数据，InnoDB 主键索引即聚簇，一张表只有一个。无主键时 InnoDB 选唯一非空索引或生成隐式 ROWID。
二级索引（Secondary）：叶子节点存主键值，查询需回表（用主键再查聚簇索引拿完整行）。
覆盖索引（Covering）：查询字段都在索引里（包括主键），不用回表，explain 显示 Extra: Using index。

\`\`\`sql
-- 美团订单表索引设计
CREATE TABLE orders (
    id BIGINT PRIMARY KEY,           -- 聚簇索引
    user_id BIGINT NOT NULL,
    status TINYINT,
    amount DECIMAL(10,2),
    created_at DATETIME,
    INDEX idx_user_status(user_id, status),       -- 联合索引
    INDEX idx_created(created_at, id, amount)     -- 覆盖索引：按时间排序 + 拿 amount
);
-- 覆盖索引示例：查询字段全在 idx_created 里
EXPLAIN SELECT id, amount, created_at FROM orders
WHERE created_at > '2024-01-01' ORDER BY created_at LIMIT 100;
-- Extra: Using index（覆盖索引，无回表）

-- 二级索引回表示例
EXPLAIN SELECT * FROM orders WHERE user_id = 100;
-- Extra: NULL（回表）
\`\`\`

踩坑：SELECT * 强制回表，只查需要的字段；联合索引最左前缀原则，(a,b,c) 索引 a/b/c/ab/abc 可用，b/ac 不用 a；范围查询右侧字段失效（a=1 and b>2 and c=3，c 用不到索引）；ORDER BY 字段尽量进索引避免 filesort。`,
    keyPoints: ["聚簇存整行 / 二级存主键", "回表是二级查聚簇", "覆盖索引 Using index"],
    followUps: ["最左前缀原则怎么用？", "SELECT * 为什么慢？"],
    favorited: false,
  },
  {
    id: "be-59",
    nodeId: "be-mysql-index",
    question: "索引下推 ICP 是什么？MySQL 5.6 后哪些场景受益？",
    bigTech: true,
    answer: `索引下推（Index Condition Pushdown, ICP）：MySQL 5.6 引入，把 WHERE 条件"下推"到存储引擎层在索引上过滤，减少回表次数。
无 ICP：存储引擎按索引取出所有满足最左前缀的记录，回表后 Server 层再过滤。
有 ICP：存储引擎在索引上先用 WHERE 其他条件过滤，只对真正满足的记录回表。

\`\`\`sql
-- 索引 (name, age, addr)
CREATE INDEX idx_name_age_addr ON users(name, age, addr);
-- 查询：name 用索引，age 用索引，addr 因 name 是 LIKE 范围查询本不能用索引
-- 但 ICP 让 addr 在索引层过滤
EXPLAIN SELECT * FROM users
WHERE name LIKE '张%' AND age = 25 AND addr LIKE '北京%';
-- Extra: Using index condition（ICP 生效）

-- 关闭 ICP 对比
SET optimizer_switch='index_condition_pushdown=off';
EXPLAIN SELECT * FROM users WHERE name LIKE '张%' AND age = 25 AND addr LIKE '北京%';
-- Extra: Using where（无 ICP，回表后过滤）

-- 联合索引 (a,b,c) 上的查询
-- a = 1 AND b > 5 AND c = 3
-- 无 ICP：用 a + b 取记录，全部回表后过滤 c
-- 有 ICP：在索引上同时过滤 c，只对真正满足的回表
\`\`\`

踩坑：ICP 仅对二级索引生效，聚簇索引不需要；ICP 减少回表次数不减少索引扫描次数；ICP 对 LIKE 'xx%'（前缀匹配）有效，对 LIKE '%xx'（左模糊）无效；EXPLAIN 显示 Using index condition 表示 ICP 生效，Using where 是 Server 层过滤。`,
    keyPoints: ["ICP 把 WHERE 下推到引擎层", "减少回表次数", "5.6+ 引入"],
    followUps: ["ICP 对哪些 LIKE 有效？", "Using index 和 Using index condition 区别？"],
    favorited: false,
  },
  {
    id: "be-60",
    nodeId: "be-mysql-index",
    question: "explain 各字段含义？阿里 DBA 如何分析慢 SQL？",
    bigTech: true,
    answer: `explain 关键字段：
- type：访问类型，从好到差 system > const > eq_ref > ref > range > index > ALL，至少到 range，禁 ALL。
- key：实际用的索引；possible_keys：可能用的；rows：估算扫描行数。
- Extra：Using index（覆盖）/ Using where（Server 过滤）/ Using temporary（临时表）/ Using filesort（额外排序）/ Using index condition（ICP）。
- key_len：索引使用长度，判断联合索引用了几列。

\`\`\`sql
-- 阿里 DBA 慢 SQL 分析
-- 1. 开启慢日志
SET GLOBAL slow_query_log = ON;
SET GLOBAL long_query_time = 1;
-- 2. 用 pt-query-digest 分析
-- pt-query-digest /var/lib/mysql/slow.log
-- 3. explain 慢 SQL
EXPLAIN SELECT * FROM orders WHERE user_id = 100 AND status = 1 ORDER BY created_at DESC LIMIT 10;
-- type=ref, key=idx_user_status, rows=1, Extra=Using filesort
-- filesort 意味着额外排序，需优化
-- 4. 优化：联合索引加 created_at
CREATE INDEX idx_user_status_created ON orders(user_id, status, created_at);
-- 再 explain：filesort 消失
-- 5. 强制索引（特殊情况）
SELECT * FROM orders FORCE INDEX(idx_user_status_created) WHERE ...;
\`\`\`

踩坑：rows 是估算值，可能偏差大，看 filtered 字段（过滤后剩余比例）；Using temporary + Using filesort 是性能杀手，必优化；type=ALL 全表扫描是禁忌，加索引或限制条件；FORCE INDEX 谨慎用，统计信息过期会让优化器选错索引，先 ANALYZE TABLE；OPTIMIZER_TRACE 看优化器决策过程。`,
    keyPoints: ["type/key/rows/Extra 关键字段", "Using filesort/temporary 要优化", "联合索引 key_len 判断"],
    followUps: ["filesort 如何消除？", "FORCE INDEX 何时用？"],
    favorited: false,
  },
  {
    id: "be-61",
    nodeId: "be-mysql-index",
    question: "索引失效场景？阿里订单查询 LIKE/函数/类型转换失效案例？",
    bigTech: true,
    answer: `索引失效场景：1）LIKE 左模糊（'%xx'）；2）对索引列做运算/函数（WHERE YEAR(create_time) = 2024）；3）隐式类型转换（VARCHAR 列 WHERE phone = 13800000000 数字）；4）OR 两边非全索引；5）!=、<>、NOT IN（数据分布差大时）；6）联合索引非最左前缀；7）ORDER BY 与索引顺序不一致；8）索引列 IS NULL（取决于 MySQL 版本，5.6+ 可用）。

\`\`\`sql
-- 阿里案例：电话号隐式转换失效
-- phone 是 VARCHAR，查询传数字，MySQL 把 phone 转 number，索引失效
EXPLAIN SELECT * FROM users WHERE phone = 13800000000;
-- type=ALL（全表扫描，索引失效）
-- 修复：传字符串
EXPLAIN SELECT * FROM users WHERE phone = '13800000000';
-- type=ref

-- 函数失效：按月查询
EXPLAIN SELECT * FROM orders WHERE DATE(created_at) = '2024-01-15';
-- type=ALL（函数让索引失效）
-- 修复：范围查询
EXPLAIN SELECT * FROM orders
WHERE created_at >= '2024-01-15' AND created_at < '2024-01-16';
-- type=range

-- LIKE 左模糊：用全文索引或 ES
EXPLAIN SELECT * FROM goods WHERE name LIKE '%手机%';
-- type=ALL
-- 修复：前缀匹配或全文索引
ALTER TABLE goods ADD FULLTEXT INDEX ft_name(name);
SELECT * FROM goods WHERE MATCH(name) AGAINST('手机');
\`\`\`

踩坑：隐式转换最隐蔽，参数类型必须和列一致；函数失效改用范围或生成列索引（5.7+）；OR 改 UNION ALL；!= 在小结果集可用，大表慎用；索引列允许 NULL 影响索引效率，建议 NOT NULL DEFAULT；监控慢日志定期优化。`,
    keyPoints: ["LIKE 左模糊/函数/隐式转换失效", "OR/!=/最左前缀", "范围查询替代函数"],
    followUps: ["隐式转换如何排查？", "生成列索引怎么用？"],
    favorited: false,
  },
  {
    id: "be-62",
    nodeId: "be-mysql-index",
    question: "联合索引最左前缀？MySQL 索引合并？(a,b,c) 索引哪些查询能用？",
    bigTech: true,
    answer: `最左前缀：联合索引 (a,b,c) 按字段顺序匹配，可用的查询：a / a,b / a,b,c / a,b,c like 'xx%'；不可用：b / b,c / a,c 的 c（a 用，c 不用，因 a 范围查询后 c 失效）。
索引合并（Index Merge）：MySQL 5.0+ 多个单列索引可以用 OR/AND 合并结果。但效率低于联合索引，生产建议建联合索引。

\`\`\`sql
-- 联合索引 (user_id, status, created_at)
CREATE INDEX idx_user_status_created ON orders(user_id, status, created_at);
-- 能用
SELECT * FROM orders WHERE user_id = 100;                          -- 用 a
SELECT * FROM orders WHERE user_id = 100 AND status = 1;           -- 用 a,b
SELECT * FROM orders WHERE user_id = 100 AND status = 1 AND created_at > '2024-01-01';  -- 用 a,b,c
SELECT * FROM orders WHERE user_id = 100 AND created_at > '2024-01-01';  -- 用 a，c 不用（跳过 b）
SELECT * FROM orders WHERE user_id = 100 AND status > 1;          -- 用 a,b（status 范围）
SELECT * FROM orders WHERE user_id = 100 AND status > 1 AND created_at > '2024-01-01';  -- 用 a,b，c 不用（status 是范围）
-- 不能用（最左前缀不满足）
SELECT * FROM orders WHERE status = 1;                             -- 不用索引
SELECT * FROM orders WHERE created_at > '2024-01-01';              -- 不用索引
SELECT * FROM orders WHERE status = 1 AND created_at > '2024-01-01'; -- 不用索引

-- 索引合并（少用）
SELECT * FROM orders WHERE user_id = 100 OR status = 1;
-- type=index_merge，user_id 索引 + status 索引合并，效率低于联合索引
\`\`\`

踩坑：联合索引字段顺序按"区分度高 + 查询频繁"放前；范围查询（>、<、BETWEEN、LIKE 'xx%'）右侧字段失效；ORDER BY 字段顺序要和索引一致才能避免 filesort；覆盖索引 + 最左前缀是日常优化核心；OR 改 UNION ALL 往往更快。`,
    keyPoints: ["最左前缀按字段顺序", "范围查询右侧失效", "索引合并效率低"],
    followUps: ["联合索引字段顺序怎么定？", "OR 改 UNION ALL 何时更快？"],
    favorited: false,
  },
  {
    id: "be-63",
    nodeId: "be-mysql-index",
    question: "阿里双 11 订单表十亿级如何分库分表？分片键怎么选？",
    bigTech: true,
    answer: `分库分表策略：1）垂直分库（按业务：订单库/库存库）；2）水平分表（按 user_id hash 取模分 N 张表）；3）时间分表（按月分 orders_202401/orders_202402）。
分片键选择：高频查询字段（user_id）作为分片键，保证单用户查询直击单库单表。
范围分片 vs Hash 分片：范围分片（按时间/id 区间）易扩容但有热点；Hash 分片均匀但扩容需 rehash。

\`\`\`java
// 阿里 TDDL/ShardingSphere 分库分表
// 1. 分片规则：user_id % 16 取表，user_id / 16 % 4 取库
// 配置 ShardingSphere
// shardingsphere.yaml
// actualDataNodes: ds_${0..3}.orders_${0..15}
// databaseStrategy:
//   standard:
//     shardingColumn: user_id
//     shardingAlgorithm: db_hash_mod
// tableStrategy:
//   standard:
//     shardingColumn: user_id
//     shardingAlgorithm: table_hash_mod

// 2. Java 注入分片键
@ShardingKey("userId")
public List<Order> queryOrders(Long userId, Date start, Date end) {
    return orderMapper.selectByUserAndTime(userId, start, end);
}

// 3. 全局查询（不带分片键）走 ES 或 TiDB
// 双 11 历史订单查询走 HBase（按时间归档）
\`\`\`

踩坑：跨库 JOIN 困难，业务层组装或冗余字段；分布式事务成本高，避免跨库事务；不带分片键查询会扫所有库（广播），高 QPS 场景禁用；扩容用一致性 hash 或预分库（提前建好 1024 库）；冷热分离：热数据 MySQL + 冷数据 HBase/TiDB；分片键一旦定难改，设计阶段要慎重。`,
    keyPoints: ["水平/垂直分库分表", "分片键选高频查询字段", "扩容需预分库"],
    followUps: ["分库分表后如何扩容？", "跨库 JOIN 怎么解决？"],
    favorited: false,
  },

  // ===== 10. be-mysql-transaction MySQL 事务 =====
  {
    id: "be-64",
    nodeId: "be-mysql-transaction",
    question: "MySQL 四种隔离级别？阿里为什么选 RC 不选 RR？",
    bigTech: true,
    answer: `四种隔离级别（隔离性从弱到强）：读未提交（Read Uncommitted）/ 读已提交（Read Committed，RC）/ 可重复读（Repeatable Read，RR，MySQL 默认）/ 串行化（Serializable）。
并发问题：脏读（读未提交）/ 不可重复读（同一事务两次读结果不同）/ 幻读（范围查询结果变化）。
MySQL RR 用 MVCC + 间隙锁解决幻读，但 RR 在 binlog statement 格式下有主从一致问题，所以阿里/美团生产用 RC + row binlog。

\`\`\`sql
-- 查看/设置隔离级别
SELECT @@transaction_isolation;  -- 默认 REPEATABLE-READ
-- 阿里规约：生产用 READ-COMMITTED
SET GLOBAL transaction_isolation = 'READ-COMMITTED';
-- 配置文件
[mysqld]
transaction-isolation = READ-COMMITTED
binlog_format = ROW  -- RC 必须配 ROW binlog

-- RC vs RR 区别
-- RC：每条 SELECT 重新生成 read view，看到最新已提交数据
-- RR：事务首次 SELECT 生成 read view，整个事务复用，保证可重复读
\`\`\`

踩坑：RC 不防幻读（范围查询会看到新数据），需加锁 SELECT ... FOR UPDATE；RR 的间隙锁在高并发写时易死锁；RR binlog statement 模式主从不一致；Serializable 性能差，几乎不用；隔离级别越高并发越低，权衡一致性和性能。`,
    keyPoints: ["RU/RC/RR/Serializable", "MySQL 默认 RR，阿里用 RC", "RC 配 ROW binlog"],
    followUps: ["RR 如何解决幻读？", "RC 为什么不防幻读？"],
    favorited: false,
  },
  {
    id: "be-65",
    nodeId: "be-mysql-transaction",
    question: "MVCC 原理？undo log 版本链？美团订单查询如何工作？",
    bigTech: true,
    answer: `MVCC（多版本并发控制）：每行隐藏字段 trx_id（最近修改事务 ID）、roll_pointer（指向 undo log 版本）。事务读取时生成 read view，按可见性算法选版本。
read view 可见性：行的 trx_id < 最小活跃事务 ID（已提交）可见；trx_id > 最大事务 ID（未来事务）不可见；trx_id 在活跃列表中不可见，沿 roll_pointer 找前一个版本直到可见。

\`\`\`sql
-- 美团订单查询 MVCC 工作流程
-- 1. 行结构（隐藏字段）
-- id | user_id | amount | trx_id | roll_pointer
-- 100| 1001    | 99.00  | 200    | -> undo log
-- 2. undo log 版本链
-- 版本1: amount=99.00, trx_id=200 (当前)
-- 版本2: amount=88.00, trx_id=180 (旧)
-- 版本3: amount=77.00, trx_id=150 (更旧)

-- 3. 事务 A (trx_id=210) SELECT * FROM orders WHERE id = 100
--    生成 read view: [活跃事务=190, 200, 210], 最大=210, 最小=190
--    行 trx_id=200 在活跃列表中 → 不可见
--    沿 roll_pointer 找版本2 trx_id=180 < 最小活跃 190 → 可见
--    返回 amount=88.00

-- 4. 验证 MVCC
SELECT * FROM orders WHERE id = 100;  -- 看到旧版本
-- 另一个事务提交修改后，本事务仍看到旧值（RR）
\`\`\`

踩坑：长事务持有 read view，导致 undo log 无法回收（purge 阻塞），表空间膨胀；长事务还会阻塞其他事务的更新（旧版本不能清除）；监控 information_schema.innodb_trx 找长事务；RC 每条 SELECT 新建 read view，RR 仅首次新建；MVCC 仅在快照读（普通 SELECT）生效，当前读（SELECT FOR UPDATE）走锁。`,
    keyPoints: ["MVCC 隐藏 trx_id + roll_pointer", "read view 可见性算法", "长事务阻塞 purge"],
    followUps: ["长事务有什么危害？", "快照读和当前读区别？"],
    favorited: false,
  },
  {
    id: "be-66",
    nodeId: "be-mysql-transaction",
    question: "行锁/间隙锁/Next-Key 锁？美团订单死锁案例分析？",
    bigTech: true,
    answer: `InnoDB 锁：1）记录锁（Record Lock）：锁单行索引；2）间隙锁（Gap Lock）：锁索引区间但不锁记录，防幻读，仅在 RR 生效；3）Next-Key Lock：记录锁 + 前面间隙锁（默认），锁左开右闭区间。
死锁：两个事务互相持有对方需要的锁，InnoDB 检测到死锁回滚代价小的事务。
美团案例：两事务同时 INSERT 不同订单但 user_id 在同一间隙，都拿间隙锁互等，InnoDB 杀一个事务。

\`\`\`sql
-- 美团订单死锁案例
-- 表 orders INDEX(user_id)，已有 user_id=100,200
-- 事务 A: INSERT orders(user_id) VALUES(150);  -- 持 (100,200) 间隙锁
-- 事务 B: INSERT orders(user_id) VALUES(180);  -- 持 (100,200) 间隙锁
-- A 等 B 释放，B 等 A 释放 → 死锁

-- 查看死锁日志
SHOW ENGINE INNODB STATUS\\G
-- LATEST DETECTED DEADLOCK
-- *** (1) TRANSACTION: INSERT INTO orders ...
-- *** (1) WAITING FOR LOCK: lock_mode X insert intention waiting
-- *** (2) TRANSACTION: INSERT INTO orders ...
-- *** (2) HOLDS THE LOCK(S): lock_mode X
-- *** WE ROLL BACK TRANSACTION (2)

-- 修复：1) 改 RC 隔离（无间隙锁）2) user_id 用唯一索引 3) 重试机制
\`\`\`

踩坑：间隙锁只在 RR 生效，RC 无间隙锁无此死锁；唯一索引等值查询命中记录降级为记录锁，无间隙锁；INSERT 触发 insert intention lock，与间隙锁冲突；减少事务长度（不嵌套 RPC）、固定加锁顺序（按主键升序）防死锁；死锁后业务层重试。`,
    keyPoints: ["记录锁/间隙锁/Next-Key", "间隙锁防幻读仅 RR", "insert intention 与间隙锁冲突"],
    followUps: ["唯一索引等值命中为什么无间隙锁？", "如何避免死锁？"],
    favorited: false,
  },
  {
    id: "be-67",
    nodeId: "be-mysql-transaction",
    question: "binlog / redo log / undo log 区别？两阶段提交是什么？",
    bigTech: true,
    answer: `三种日志：
- redo log（InnoDB 引擎层）：物理日志，记录"某页某偏移改成什么"，crash 后恢复已提交事务，循环写。
- undo log（InnoDB 引擎层）：逻辑日志，记录"反向操作"，回滚事务 + MVCC 版本链。
- binlog（Server 层）：逻辑日志，记录 SQL/行变更，主从复制 + 时间点恢复，追加写。
两阶段提交（2PC）：写 redo log（prepare）→ 写 binlog → 写 redo log（commit），保证 binlog 和 redo log 一致。

\`\`\`sql
-- 两阶段提交流程
-- 1. 事务执行，修改 buffer pool
-- 2. 写 redo log（prepare 状态）
-- 3. 写 binlog
-- 4. 写 redo log（commit 状态）
-- 5. 事务提交成功

-- crash 恢复
-- redo log 有 commit 标记 → 已提交，恢复
-- redo log prepare 但 binlog 完整 → 提交（binlog 可能已复制到从库）
-- redo log prepare 且 binlog 不完整 → 回滚（用 undo log）

-- 查看 binlog
SHOW BINLOG EVENTS IN 'mysql-bin.000001';
-- 查看参数
SHOW VARIABLES LIKE 'innodb_flush_log_at_trx_commit';  -- 1 = 每事务刷盘
SHOW VARIABLES LIKE 'sync_binlog';  -- 1 = 每事务刷盘
\`\`\`

踩坑：innodb_flush_log_at_trx_commit=1 + sync_binlog=1 是双 1 配置保证不丢数据，但性能略降；redo log 循环写有覆盖风险，要够大；binlog 三种格式：statement（SQL）、row（行变更，推荐）、mixed；row 格式 binlog 大但准确，主从一致好；GTID 模式主从切换更简单。`,
    keyPoints: ["redo 物理/undo 逻辑/binlog 逻辑", "2PC 保证 binlog 与 redo 一致", "双 1 配置防丢数据"],
    followUps: ["binlog 三种格式区别？", "redo log 循环写如何不覆盖？"],
    favorited: false,
  },
  {
    id: "be-68",
    nodeId: "be-mysql-transaction",
    question: "美团外卖订单状态流转如何保证一致性？分布式事务方案？",
    bigTech: true,
    answer: `美团外卖订单状态：待支付 → 已支付 → 商家接单 → 制作中 → 骑手取餐 → 配送中 → 已送达。状态流转涉及订单服务、支付服务、商家服务、骑手服务多系统。
一致性方案：1）状态机引擎（防非法状态迁移）；2）本地消息表 + MQ 最终一致；3）TCC 业务层补偿；4）Saga 长事务。
美团实际：核心交易用 TCC（保证强一致），辅助流程用本地消息表（最终一致）。

\`\`\`java
// 美团 TCC：订单状态流转
// Try: 预占资源（订单标记 PAYING，扣减预占库存）
@TwoPhaseBusinessAction(name = "payOrder", commitMethod = "confirm", rollbackMethod = "cancel")
public void tryPay(OrderContext ctx) {
    orderDao.updateStatus(ctx.getOrderId(), OrderStatus.PAYING);
    stockService.freeze(ctx.getSkuId(), ctx.getQty());  // 预占库存
}
// Confirm: 真正扣减
public void confirm(OrderContext ctx) {
    orderDao.updateStatus(ctx.getOrderId(), OrderStatus.PAID);
    stockService.deduct(ctx.getSkuId(), ctx.getQty());  // 真扣
}
// Cancel: 释放预占
public void cancel(OrderContext ctx) {
    orderDao.updateStatus(ctx.getOrderId(), OrderStatus.CANCELED);
    stockService.unfreeze(ctx.getSkuId(), ctx.getQty());
}

// 本地消息表（辅助流程）
@Transactional
public void paid(Long orderId) {
    orderDao.updateStatus(orderId, OrderStatus.PAID);
    msgDao.insert(new LocalMsg("ORDER_PAID", orderId));  // 同事务插消息表
}
// 定时扫消息表发 MQ
\`\`\`

踩坑：TCC Try/Confirm/Cancel 必须幂等（网络重试）；Confirm/Cancel 失败要重试 + 人工兜底；空回滚（Try 未执行但 Cancel 调用）需事务记录表判断；悬挂（Cancel 先于 Try）也要事务记录；Saga 补偿要可逆；状态机用枚举 + 校验防非法迁移。`,
    keyPoints: ["状态机防非法迁移", "TCC 强一致 + 本地消息表最终一致", "TCC 幂等 + 空回滚 + 悬挂"],
    followUps: ["TCC 空回滚怎么处理？", "Saga 补偿如何设计？"],
    favorited: false,
  },
  {
    id: "be-69",
    nodeId: "be-mysql-transaction",
    question: "MySQL 主从延迟如何排查？美团读写分离一致性问题？",
    bigTech: true,
    answer: `主从延迟原因：1）大事务（binlog 单条耗时）；2）从库单线程回放（5.7+ 并行复制）；3）从库硬件差；4）网络抖动；5）从库查询压力。
排查：SHOW SLAVE STATUS\\G 看 Seconds_Behind_Master；pt-heartbeat 监控真实延迟（不受系统时间影响）。
美团方案：1）从库 5.7+ 并行复制（LOGICAL_CLOCK）；2）强一致读走主库；3）关键操作后短延迟内读主库；4）分库降低单库压力。

\`\`\`sql
-- 排查主从延迟
SHOW SLAVE STATUS\\G
-- 关注：Seconds_Behind_Master, Slave_IO_Running, Slave_SQL_Running
-- 真实延迟监控
-- pt-heartbeat --daemonize -D test --create-table
-- pt-heartbeat --check --master-server-id 1

-- 5.7+ 并行复制
CHANGE MASTER TO MASTER_DELAY = 0;
SET GLOBAL slave_parallel_type = 'LOGICAL_CLOCK';
SET GLOBAL slave_parallel_workers = 16;
SET GLOBAL binlog_transaction_dependency_tracking = 'WRITESET';

-- 从库读不到刚写入的数据（延迟）解决：强制读主
// 业务代码
public Order readOrder(Long id) {
    if (justWritten(id)) {  // 刚写强制读主
        return readFromMaster(id);
    }
    return readFromSlave(id);
}
\`\`\`

踩坑：Seconds_Behind_Master 不可靠（受系统时间影响）；大事务拆分；从库并行复制对 DDL 无效；半同步复制（semi-sync）保证主从一致但降低主库性能；写后读一致性用 GTID_session 或客户端缓存；分库后跨库事务难，业务层组装。`,
    keyPoints: ["主从延迟 5 大原因", "并行复制 LOGICAL_CLOCK", "强一致读走主库"],
    followUps: ["半同步复制如何工作？", "pt-heartbeat 为什么比 SBM 准？"],
    favorited: false,
  },
  {
    id: "be-70",
    nodeId: "be-mysql-transaction",
    question: "MySQL 死锁如何排查？information_schema 哪些表有用？",
    answer: `排查步骤：1）SHOW ENGINE INNODB STATUS\\G 看 LATEST DETECTED DEADLOCK；2）开启 innodb_print_all_deadlocks 把所有死锁日志写 error log；3）结合 binlog/业务日志定位事务 SQL。
information_schema：INNODB_TRX（当前事务）、INNODB_LOCKS（锁信息，8.0 改 performance_schema.data_locks）、INNODB_LOCK_WAITS（锁等待）。

\`\`\`sql
-- 1. 开启完整死锁日志
SET GLOBAL innodb_print_all_deadlocks = ON;
-- 错误日志路径
SHOW VARIABLES LIKE 'log_error';

-- 2. 查看当前事务
SELECT * FROM information_schema.INNODB_TRX;
-- trx_id, trx_state, trx_started, trx_rows_locked, trx_query

-- 3. 查看锁信息（MySQL 8.0）
SELECT * FROM performance_schema.data_locks;
-- 8.0 前: SELECT * FROM information_schema.INNODB_LOCKS;

-- 4. 查看锁等待
SELECT * FROM performance_schema.data_lock_waits;

-- 5. 找阻塞源
SELECT r.trx_id AS waiting_trx, r.trx_query AS waiting_query,
       b.trx_id AS blocking_trx, b.trx_query AS blocking_query
FROM performance_schema.data_lock_waits w
JOIN information_schema.INNODB_TRX b ON b.trx_id = w.blocking_engine_transaction_id
JOIN information_schema.INNODB_TRX r ON r.trx_id = w.requesting_engine_transaction_id;

-- 6. 杀事务
KILL <connection_id>;
\`\`\`

踩坑：死锁日志要看 RECORD LOCKS 部分定位具体锁；事务持有锁长但不阻塞时不在 LOCK_WAITS；KILL 仅断连接，事务需等下次 SQL 才回滚；预防：缩短事务、固定加锁顺序、避免大事务、用 RC 减少间隙锁；监控死锁次数超阈值告警。`,
    keyPoints: ["SHOW ENGINE INNODB STATUS", "innodb_print_all_deadlocks", "INNODB_TRX/LOCKS/WAITS"],
    followUps: ["如何预防死锁？", "死锁后事务如何回滚？"],
    favorited: false,
  },

  // ===== 11. be-redis-data Redis 数据结构与应用 =====
  {
    id: "be-71",
    nodeId: "be-redis-data",
    question: "Redis 五大数据结构底层实现？美团用哪些？",
    bigTech: true,
    answer: `五大数据结构及底层：
- String：SDS（动态字符串），存 int/embstr/raw 三种编码。
- List：quicklist（双向链表 + ziplist 节点，7.0 后 listpack）。
- Hash：ziplist（小）或 hashtable（大）。
- Set：intset（纯整数）或 hashtable。
- ZSet：ziplist（小）或 skiplist + hashtable（大，跳表支持范围，hashtable 支持 O(1) 查分值）。
美团场景：购物车 Hash、商品排序 ZSet、关注列表 Set、消息流 List、库存 String。

\`\`\`bash
# 美团购物车
HSET cart:user:1001 sku_001 2 sku_002 1   # 商品ID → 数量
HGET cart:user:1001 sku_001
HINCRBY cart:user:1001 sku_001 1

# 商品销量排行（ZSet）
ZADD sales_rank 100 sku_001 200 sku_002
ZREVRANGE sales_rank 0 9 WITHSCORES      # TOP10

# 库存扣减（String + Lua 原子）
SET stock:sku_001 100
EVAL "if redis.call('GET', KEYS[1]) >= ARGV[1] then return redis.call('DECRBY', KEYS[1], ARGV[1]) else return -1 end" 1 stock:sku_001 1
\`\`\`

踩坑：String 存对象别用 JSON 大字符串，Hash 拆字段便于部分更新；大 Hash/ZSet 内存优化用 ziplist 编码（hash-max-ziplist-entries）；ZSet 跳表内存比红黑树大；Set 集合运算（SUNION/SINTER）大数据阻塞 Redis，用 SCAN 替代。`,
    keyPoints: ["5 种结构 + 底层编码", "ZSet = 跳表 + hashtable", "购物车/排行/库存场景"],
    followUps: ["ZSet 为什么用跳表？", "Hash 何时从 ziplist 转 hashtable？"],
    favorited: false,
  },
  {
    id: "be-72",
    nodeId: "be-redis-data",
    question: "Redis 跳表为什么用？比红黑树好在哪？",
    bigTech: true,
    answer: `跳表（SkipList）：多层链表，最底层全量数据有序，上层每隔几个节点抽一层（概率 1/2），查询从最高层往下走 O(log n)。
Redis ZSet 选跳表原因：1）实现简单（链表 + 随机层数）比红黑树好实现；2）范围查询天然支持（zrange 直接走底层链表）红黑树需中序遍历；3）并发友好（链表 CAS）红黑树平衡需旋转锁；4）内存可接受（每节点 1.33 指针平均）；5）缓存友好（连续访问）。

\`\`\`c
// Redis 跳表结构（简化）
typedef struct zskiplistNode {
    sds ele;                          // 元素
    double score;                     // 分值
    struct zskiplistNode *backward;   // 后退指针
    struct zskiplistLevel {
        struct zskiplistNode *forward; // 前进指针
        unsigned long span;            // 跨度（用于 rank）
    } level[];                         // 多层
} zskiplistNode;

// ZRANGE 范围查询：定位起点后走底层链表，O(log n + M)
// ZRANGEBYSCORE sales_rank 100 500 LIMIT 0 10
\`\`\`

踩坑：跳表最大层数 ZSKIPLIST_MAXLEVEL=32（Redis 7+ 64），概率 0.25；跳表 + hashtable 双结构：跳表负责排序范围，hashtable 负责 O(1) 查分值；红黑树范围查询需要中序遍历效率低；Java ConcurrentSkipListMap 也是跳表，并发安全。`,
    keyPoints: ["跳表多层链表 O(log n)", "范围查询天然支持", "实现简单并发友好"],
    followUps: ["跳表为什么最大 32 层？", "ZSet 为什么还要 hashtable？"],
    favorited: false,
  },
  {
    id: "be-73",
    nodeId: "be-redis-data",
    question: "微信红包 Redis 设计？如何防超发、防重复领？",
    bigTech: true,
    answer: `微信红包场景：发红包（拆分为多个子红包）+ 抢红包（原子扣减库存 + 随机金额）+ 拆红包记录。
设计：1）红包总库存 String，Lua 脚本原子扣减防超发；2）已抢用户 Set 防重复；3）拆分红包用 List（红包个数=List 长度，rpop 取一个）；4）领取记录 Hash 存用户→金额。

\`\`\`lua
-- 抢红包 Lua 脚本（原子操作）
-- KEYS[1]=红包库存 key, KEYS[2]=已抢用户 Set key, KEYS[3]=红包明细 List key
-- ARGV[1]=userId, ARGV[2]=红包 ID
local stock = redis.call('GET', KEYS[1])
if not stock or tonumber(stock) <= 0 then return -1 end  -- 库存不足
if redis.call('SISMEMBER', KEYS[2], ARGV[1]) == 1 then return -2 end  -- 已领过
local amount = redis.call('RPOP', KEYS[3])  -- 取随机金额
if not amount then return -3 end  -- 红包已抢完
redis.call('SADD', KEYS[2], ARGV[1])  -- 标记已领
redis.call('DECR', KEYS[1])           -- 扣库存
redis.call('HSET', 'redpacket:log:' .. ARGV[2], ARGV[1], amount)  -- 记录
return amount
\`\`\`

踩坑：Lua 脚本保证原子但执行慢影响吞吐，红包高峰拆分到多 key 分片；SISMEMBER + SADD 非原子，必须 Lua 包裹；随机金额算法用二倍均值法（剩余金额 = (剩余金额/剩余人数) × 2 随机）避免最后一个人抢光；异步落库 + 对账兜底；热点红包用本地缓存预扣减。`,
    keyPoints: ["Lua 脚本原子防超发", "Set 防重复领", "List 存拆分红包"],
    followUps: ["随机金额算法？", "热点红包如何分片？"],
    favorited: false,
  },
  {
    id: "be-74",
    nodeId: "be-redis-data",
    question: "Redis 持久化 RDB vs AOF？美团选哪个？",
    bigTech: true,
    answer: `RDB：二进制快照，bgsave fork 子进程 dump，恢复快但可能丢数据（间隔期内）。
AOF：追加命令日志，appendfsync always（每次写同步，最安全但慢）/ everysec（每秒同步，默认，最多丢 1 秒）/ no（OS 决定）。AOF 文件大，重写压缩。
混合持久化（4.0+）：AOF 重写时基础部分用 RDB，增量部分用 AOF，兼具两者优势。
美团：主从架构下从库不持久化，主库用 AOF everysec + RDB 兜底，混合持久化是首选。

\`\`\`bash
# 美团推荐配置
# redis.conf
save 900 1                # RDB 触发条件（生产可关闭 save ""）
appendonly yes            # 开 AOF
appendfsync everysec      # 每秒刷盘
auto-aof-rewrite-percentage 100  # AOF 重写触发
auto-aof-rewrite-min-size 64mb
aof-use-rdb-preamble yes  # 4.0+ 混合持久化

# 触发 AOF 重写
BGREWRITEAOF
# 查看持久化状态
INFO persistence
\`\`\`

踩坑：RDB fork 大内存实例时复制页表慢（COW 优化但仍 STW 几百 ms）；AOF 重写也 fork，同样问题；AOF 文件损坏用 redis-check-aof --fix 修复；不要同时依赖 RDB 和 AOF 都开（增加 fork 开销）；持久化到 SSD 或独立磁盘避免和业务 IO 竞争。`,
    keyPoints: ["RDB 快照快恢复可能丢", "AOF 日志安全文件大", "混合持久化最佳"],
    followUps: ["fork 大内存实例为什么慢？", "AOF 重写如何工作？"],
    favorited: false,
  },
  {
    id: "be-75",
    nodeId: "be-redis-data",
    question: "Redis 缓存淘汰策略？美团如何选 noeviction 还是 allkeys-lru？",
    bigTech: true,
    answer: `8 种淘汰策略：
- noeviction：不淘汰，写直接报错（默认）。
- allkeys-lru/allkeys-lfu/allkeys-random：所有 key 中淘汰（LRU/LFU/随机）。
- volatile-lru/volatile-lfu/volatile-random/volatile-ttl：仅淘汰设了 expire 的 key。
美团选型：缓存场景用 allkeys-lru（缓存可丢）；混合场景（缓存+持久数据）用 volatile-lru（只淘汰可过期的）；LFU（4.0+）比 LRU 抗"冷数据被刷"更优。

\`\`\`bash
# 美团推荐配置
maxmemory 8gb
maxmemory-policy allkeys-lru  # 纯缓存
# 或 volatile-lru（缓存 + 持久数据共存）

# LFU 配置（4.0+）
maxmemory-policy allkeys-lfu
lfu-log-factor 10  # 越大访问次数衰减越慢
lfu-decay-time 1   # 衰减周期（分钟）

# 查看淘汰情况
INFO stats | grep evicted
# evicted_keys: 12345  # 已淘汰数量
\`\`\`

踩坑：noeviction 写失败业务要处理（重试或降级）；LRU 是近似 LRU（采样 5 个），增大 maxmemory-samples 提升精度但耗 CPU；volatile-* 只淘汰设 TTL 的，永久 key 不淘汰可能撑爆内存；大 key 淘汰单次阻塞（4.0+ 异步淘汰 lazyfree-lazy-eviction）；缓存预热避免冷启动雪崩。`,
    keyPoints: ["8 种策略：noeviction/allkeys/volatile", "缓存用 allkeys-lru", "LFU 比 LRU 抗扫描"],
    followUps: ["LRU 近似算法如何实现？", "LFU 衰减如何工作？"],
    favorited: false,
  },
  {
    id: "be-76",
    nodeId: "be-redis-data",
    question: "Redis Stream 替代 Kafka 做轻量消息队列？美团怎么选？",
    answer: `Redis Stream（5.0+）：支持多消费者组、ACK 机制、消息持久化、可回溯，比 Pub/Sub 可靠，比 Kafka 轻量。
适用场景：QPS < 10 万、消息量小、不需要分区的轻量队列。Kafka 适合高吞吐、分区、大数据流。
美团：内部小流量业务用 Redis Stream（如订单事件、配置变更通知），核心交易用 Kafka/RocketMQ。

\`\`\`bash
# Redis Stream 生产消费
# 生产
XADD orders * user_id 1001 amount 99.00
# 消费者组
XGROUP CREATE orders order_group $ MKSTREAM
# 消费（阻塞 + 组）
XREADGROUP GROUP order_group consumer_1 COUNT 10 BLOCK 5000 STREAMS orders >
# ACK
XACK orders order_group <message_id>
# 查看未 ACK（PEL）
XPENDING orders order_group
# 死信处理：claim 转移给其他消费者
XCLAIM orders order_group consumer_2 60000 <message_id>
# 限制最大长度（保留最近 N 条）
XADD orders MAXLEN 10000 * user_id 1001 amount 99.00
\`\`\`

踩坑：Stream 内存占用大，长度无限制会撑爆，用 MAXLEN 限制；PEL（pending entries list）需定期 XCLAIM 处理死信；消费者崩溃后未 ACK 消息不能被其他消费者自动接管，要 XCLAIM；高可靠场景用 Kafka/RocketMQ，Stream 仅适合轻量；Stream 不支持分区，单实例 QPS 上限低。`,
    keyPoints: ["Stream 多消费组 + ACK + 持久化", "适合轻量队列", "PEL 死信 XCLAIM"],
    followUps: ["Stream 和 Pub/Sub 区别？", "Stream 如何处理消费者崩溃？"],
    favorited: false,
  },
  {
    id: "be-77",
    nodeId: "be-redis-data",
    question: "Redis 大 key / 热 key 如何处理？阿里双 11 案例？",
    bigTech: true,
    answer: `大 key：单 key 体积大（String > 10KB、Hash/List/Set > 1 万元素）。危害：阻塞主线程、网络阻塞、集群迁移卡顿、淘汰一次清空慢。
热 key：单 key QPS 极高（如热门商品 ID）。危害：单分片 CPU 瓶颈、集群倾斜。
处理大 key：1）拆分（按时间/哈希分多个 key）；2）删除用 UNLINK 异步；3）压缩（gzip）。
处理热 key：1）本地缓存（Caffeine）；2）多副本（写多份 key 分散读）；3）读写分离。

\`\`\`bash
# 阿里双 11 大 key 排查
# 1. 找大 key
redis-cli --bigkeys
# 2. 找热 key
redis-cli --hotkeys   # 需开 LFU
# 3. memory usage 看具体 key
MEMORY USAGE user:followers:1001
# 4. 异步删除大 key
UNLINK user:followers:1001

# 热 key 多副本方案
# 写时同步到多个 key
SET hot_key_0 value
SET hot_key_1 value
SET hot_key_2 value
# 读时随机选
local idx = math.random(0, 2)
redis.call('GET', 'hot_key_' .. idx)
\`\`\`

踩坑：大 key 删除 DEL 会阻塞主线程几秒，必须 UNLINK；集群 slot 迁移时大 key 卡住整个迁移；热 key 监控用 redis-cli --hotkeys（需 maxmemory-policy LFU）或代理层统计；本地缓存注意一致性（订阅 key 失效）；拆分大 key 注意事务性丢失（多 key 非原子）。`,
    keyPoints: ["大 key 拆分 + UNLINK 异步删", "热 key 本地缓存 + 多副本", "redis-cli --bigkeys/hotkeys"],
    followUps: ["大 key 怎么拆分？", "热 key 本地缓存一致性？"],
    favorited: false,
  },

  // ===== 12. be-redis-cluster Redis 集群与高可用 =====
  {
    id: "be-78",
    nodeId: "be-redis-cluster",
    question: "Redis 主从复制原理？全量 + 增量？美团故障切换？",
    bigTech: true,
    answer: `主从复制：1）全量同步：从库连主库发 PSYNC，主库 BGSAVE 生成 RDB 发给从库，期间写命令缓存在 repl_backlog，RDB 发完后再发缓冲命令；2）增量同步：从库断线重连，主库根据 offset 从 repl_backlog 发送增量命令。
故障切换：主库宕机，需 Sentinel 自动选从库升级为主库；客户端订阅 +switch-master 事件重连新主库。
美团：主从 + Sentinel + VIP（或 DNS），故障切换秒级；核心业务用 Cluster。

\`\`\`bash
# 主从配置
# redis.conf
slaveof 10.0.0.1 6379        # 或 replicaof 5.0+
masterauth <password>        # 主库密码
# 从库只读
replica-read-only yes

# Sentinel 配置
sentinel monitor mymaster 10.0.0.1 6379 2  # 主库地址 + quorum
sentinel down-after-milliseconds mymaster 30000  # 30s 不可达判定下线
sentinel failover-timeout mymaster 180000
sentinel parallel-syncs mymaster 1  # 同时同步的从库数

# 查看主从状态
INFO replication
# role:master / slave
# master_link_status:up
\`\`\`

踩坑：全量同步时主库 fork 阻塞，大库影响整个集群；repl_backlog 默认 1MB 易丢增量，大流量调大到 256MB；网络分区时从库仍可读旧数据，业务要容忍；Sentinel quorum 必须 > 节点/2 防脑裂；故障切换后客户端要重新路由到新主库。`,
    keyPoints: ["全量 BGSAVE+RDB+缓冲命令", "增量 repl_backlog+offset", "Sentinel quorum 防脑裂"],
    followUps: ["repl_backlog 作用？", "Sentinel 选举算法？"],
    favorited: false,
  },
  {
    id: "be-79",
    nodeId: "be-redis-cluster",
    question: "Redis Cluster 16384 槽位原理？为什么是 16384 不是 65536？",
    bigTech: true,
    answer: `Cluster：所有节点分片存储，每个节点负责一部分槽位（slot），共 16384 个槽。key 用 CRC16(key) mod 16384 计算槽位，节点间 Gossip 协议同步拓扑。
为什么 16384 不是 65536：1）心跳包小（每节点 16384/8=2KB 槽位 bitmap，65536 是 8KB）；2）集群节点数实际不超过 1000；3）CRC16 高位偏移不够（数据集中度问题）。
客户端：MOVED 重定向（永久迁移）/ ASK 重定向（临时迁移）。

\`\`\`bash
# Cluster 搭建
# 1. 启动 6 个 Redis 实例（3 主 3 从）
redis-server --port 7000 --cluster-enabled yes --cluster-config-file nodes.conf
# 2. 创建集群
redis-cli --cluster create 127.0.0.1:7000 127.0.0.1:7001 127.0.0.1:7002 \\
  127.0.0.1:7003 127.0.0.1:7004 127.0.0.1:7005 --cluster-replicas 1
# 3. 查看集群
redis-cli -p 7000 CLUSTER NODES
redis-cli -p 7000 CLUSTER INFO
# 4. 槽位分配
CLUSTER ADDSLOTS 0..5460     # 节点 7000
CLUSTER ADDSLOTS 5461..10922 # 节点 7001
CLUSTER ADDSLOTS 10923..16383 # 节点 7002

# 5. 客户端重定向
SET key value
# (error) MOVED 5474 127.0.0.1:7001  # 重定向到 7001
\`\`\`

踩坑：跨槽位操作不支持（MSET/MULTI 多 key），用 hash tag {} 让相关 key 在同槽位；集群最少 3 主 3 从（投票选主需 >N/2）；扩容时槽位迁移期间 ASK 重定向；客户端缓存槽位映射表减少重定向；节点故障从库升级需 Gossip 选主，期间该槽位不可用。`,
    keyPoints: ["16384 槽 + CRC16", "Gossip 同步拓扑", "MOVED/ASK 重定向"],
    followUps: ["hash tag 怎么用？", "集群最少几节点？"],
    favorited: false,
  },
  {
    id: "be-80",
    nodeId: "be-redis-cluster",
    question: "Sentinel vs Cluster 区别？美团如何选？",
    bigTech: true,
    answer: `Sentinel：主从架构 + 哨兵监控，单主多从，主库宕机选从库升级。容量受单主限制，适合中等规模（< 30GB）。
Cluster：分片架构，多主多从，数据分散到多节点，可水平扩展，适合大规模（> 100GB / 高 QPS）。
美团选型：1）小业务（< 10GB）用 Sentinel；2）大业务用 Cluster；3）超大规模用 Codis/Tair（阿里）。

\`\`\`bash
# Sentinel 部署（1 主 2 从 3 哨兵）
# redis-7000 (master)
# redis-7001, redis-7002 (slave)
# sentinel-26379, 26380, 26381 (sentinel)
# 客户端连 Sentinel 获取主库地址
redis-cli -p 26379 SENTINEL get-master-addr-by-name mymaster

# Cluster 部署（3 主 3 从）
# 自动分片 + 高可用
redis-cli --cluster create 7000 7001 7002 7003 7004 7005 --cluster-replicas 1

# Cluster 扩容
redis-cli --cluster add-node 7006 7000      # 加入新节点
redis-cli --cluster reshard 7000            # 迁移槽位
redis-cli --cluster rebalance 7000          # 自动平衡
\`\`\`

踩坑：Sentinel 单主瓶颈，写入 QPS 受单实例限制；Cluster 不支持跨槽事务/多 key 操作，业务要适配；Codis/Tair 比 Cluster 多了 Proxy 层（客户端不用感知集群），但代理层增加延迟；Codis 的 Rehash 在线迁移慢，Cluster 槽位迁移快；Tair 阿里内部增强版，支持冷热分离、持久内存。`,
    keyPoints: ["Sentinel 主从+哨兵 / Cluster 分片", "Sentinel 适合中等规模", "Cluster 水平扩展"],
    followUps: ["Codis 和 Cluster 区别？", "Cluster 如何在线扩容？"],
    favorited: false,
  },
  {
    id: "be-81",
    nodeId: "be-redis-cluster",
    question: "缓存与数据库一致性：双删、Canal、消息订阅？阿里方案？",
    bigTech: true,
    answer: `一致性方案：1）Cache Aside：先更新 DB 再删缓存（最常用，最终一致）；2）延迟双删：更新 DB 前删一次，更新后异步延迟再删一次（防读到旧值缓存）；3）订阅 binlog：Canal 订阅 MySQL binlog 异步删缓存（解耦）；4）消息队列：更新 DB 后发 MQ，消费者删缓存。
阿里方案：核心业务用 Canal 订阅 binlog 删缓存 + 兜底延迟双删，强一致用分布式锁串行化。

\`\`\`java
// 阿里 Cache Aside + 延迟双删
@Transactional
public void updateUser(User user) {
    redis.del("user:" + user.getId());       // 1. 先删缓存
    userDao.update(user);                     // 2. 更新 DB
    // 3. 延迟再删（异步，防并发读旧值）
    scheduledExecutor.schedule(() -> {
        redis.del("user:" + user.getId());
    }, 500, TimeUnit.MILLISECONDS);
}

// Canal 订阅 binlog 删缓存
@Component
public class CanalClient {
    @Subscribe
    public void onRowChange(CanalEntry.Entry entry) {
        if (entry.getHeader().getTableName().equals("users")) {
            for (CanalEntry.RowData row : rowChange.getRowDatasList()) {
                String id = getAfterColumn(row, "id");
                redis.del("user:" + id);
            }
        }
    }
}
\`\`\`

踩坑：先删缓存再更新 DB，并发读可能把旧值写回缓存，所以要先更新 DB 再删缓存；删缓存失败要重试（消息队列 + 死信兜底）；强一致场景用分布式锁串行化读写（牺牲并发）；过期时间是兜底，所有 key 必须设 TTL；Canal 单点故障要 HA。`,
    keyPoints: ["Cache Aside 先更新 DB 再删缓存", "延迟双删防并发读旧值", "Canal 订阅 binlog 解耦"],
    followUps: ["先删缓存还是后删缓存？", "Canal 单点如何 HA？"],
    favorited: false,
  },
  {
    id: "be-82",
    nodeId: "be-redis-cluster",
    question: "Redis 主从切换脑裂如何防止？min-slaves-to-write 是什么？",
    answer: `脑裂：网络分区时主库仍接受写入，从库被选为新主，原主恢复后写入丢失。
防止：min-slaves-to-write（5.7+ 改 min-replicas-to-write）：主库至少有 N 个从库同步成功才接受写入，否则拒绝写入（保护主库）。
配合 min-replicas-max-lag：从库延迟超 N 秒不计入有效从库。

\`\`\`bash
# 主库配置
min-replicas-to-write 1        # 至少 1 个从库同步
min-replicas-max-lag 10        # 从库延迟超 10s 不算有效

# Sentinel 配置（防脑裂）
sentinel deny-scripts-reconfig yes
sentinel client-reconfig-script mymaster /usr/bin/notify.sh  # 切换通知

# 客户端故障切换
# 1. 订阅 +switch-master 事件
redis-cli -p 26379 SUBSCRIBE +switch-master
# 2. 收到事件后重连新主库
# 3. Jedis/Lettuce 内置 Sentinel 支持
\`\`\`

踩坑：min-replicas-to-write 设过高（如 2）会牺牲可用性，主从架构至少 1 主 1 从配 1；网络分区时主库拒绝写入业务要降级（写入 MQ 暂存）；Sentinel 故障切换期间有秒级写入丢失（旧主写入未同步）；客户端要支持 Sentinel 自动故障切换；多机房部署用 Sentinel 跨机房部署。`,
    keyPoints: ["脑裂主库继续写丢数据", "min-replicas-to-write 拒绝写", "Sentinel 自动切换"],
    followUps: ["min-replicas-to-write 设多少？", "多机房如何部署 Sentinel？"],
    favorited: false,
  },
  {
    id: "be-83",
    nodeId: "be-redis-cluster",
    question: "阿里 Tair 持久内存版 vs 开源 Redis？性能/成本差异？",
    bigTech: true,
    answer: `Tair（阿里云 Redis 增强版）：1）持久内存版（基于 AEP/PMEM）：内存级性能 + 持久化，重启不丢数据；2）TairZset/Doc/Vector 等扩展数据结构；3）多线程模型（开源 Redis 6.0 仅 IO 多线程，命令仍单线程）；4）冷热分离：热数据内存 + 冷数据 SSD。
开源 Redis：单线程模型（命令执行），主从+Cluster，数据结构标准 5 种 + Stream。
性能：Tair 持久内存版 QPS 2-3 倍开源 Redis，延迟相当；成本低于纯内存。

\`\`\`bash
# Tair 扩展数据结构
# TairZset 支持多维分数（开