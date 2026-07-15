# 🔧 后端学习路线（详细版 v2.0）

> **目标**：6 个月内具备独立开发全栈项目的能力，能 hold 住 AI 知识库 / 性能监控等项目的后端。
>
> **每周预算**：工作日午休 0.5h + 公司晚间 1h（Go 替代部分刷题时间）+ 周末 2h ≈ **7.5h/周**
>
> **学习方法**：每学完一个模块，**必须产出一个小 demo**（不写 demo 等于没学）。所有 demo 存到 `backend/demos/` 目录。

## 技术选型：Go（推荐）

| 原因 | 说明 |
|------|------|
| 语法接近 JS | 学习曲线平缓，前端转后端低成本 |
| 云原生热门 | K8s/Docker 生态主力语言 |
| AI Infra 方向 | vLLM、TensorRT-LLM 等都用 Go 做周边 |
| 并发模型简洁 | Goroutine 学一个就够，比 Java 线程池简单 |

---

## Month 1：Go 基础（Week 1-4，约 30h）

### Week 1：语法基础 + 工具链

**学习资料**：
- 🌐 [A Tour of Go](https://go.dev/tour/welcome/list)（官方互动教程，必做，约 4h）
- 🌐 [Go by Example](https://gobyexample.com/)（按知识点查代码示例）
- 📖 [《Go 语言圣经》中文版](https://gopl-zh.com/)（重点读第 1-4 章）

**学什么**：
- Day 1-2：变量、类型、流程控制（if/for/switch）
- Day 3：函数、多返回值、defer
- Day 4：结构体、方法
- Day 5-7：包管理、go mod、go run/build/test

**学多少**：
- 完成 Tour of Go 全部练习
- 用 Go 重写 2 道 LeetCode 简单题（如两数之和、反转链表）

**产出**：`backend/demos/week1-hello/` — 包含 5 个小练习 + 2 道 LeetCode 题解

---

### Week 2：集合类型 + 接口

**学习资料**：
- 📖 [《Go 语言圣经》第 4-7 章](https://gopl-zh.com/ch4)（接口与类型系统）
- 🌐 [Effective Go](https://go.dev/doc/effective_go)（官方最佳实践）

**学什么**：
- Day 1-2：数组、切片（slice 原理、append 扩容）
- Day 3：map、遍历
- Day 4-5：接口（interface）、类型断言、空接口
- Day 6-7：错误处理（error、panic、recover）

**学多少**：
- 写一个「学生成绩管理」CLI：增删改查学生 + 按分数排序 + 持久化到 JSON 文件
- 完成 Go by Example 的 slice/map/interfaces 三个章节练习

**产出**：`backend/demos/week2-student-cli/`

---

### Week 3：并发编程（Go 的核心优势）

**学习资料**：
- 📖 [《Go 语言圣经》第 8 章](https://gopl-zh.com/ch8)（Goroutine 和 Channel）
- 🎥 [Go Concurrency Patterns](https://www.youtube.com/watch?v=f6kdp0TYVgA)（Google I/O 2012，经典演讲，约 40min）
- 🌐 [Go 并发可视化](https://divan.dev/posts/go_concurrency_visualize/)

**学什么**：
- Day 1-2：Goroutine 启动、sync.WaitGroup
- Day 3-4：Channel（无缓冲/有缓冲、select、关闭）
- Day 5：并发模式（Worker Pool、Fan-in/Fan-out、Pipeline）
- Day 6-7：sync.Mutex、sync.Once、context.Context

**学多少**：
- 写一个「并发爬虫」：10 个 goroutine 并发抓 100 个 URL，用 channel 汇总结果，超时用 context 控制
- 完成「Worker Pool」模式实现

**产出**：`backend/demos/week3-concurrent-crawler/`

---

### Week 4：标准库 + 测试

**学习资料**：
- 📖 [Go 标准库文档](https://pkg.go.dev/std)
- 🌐 [Learn Go with Tests](https://github.com/quii/learn-go-with-tests)（TDD 方式学 Go，强烈推荐）

**学什么**：
- Day 1-2：io、fmt、strings、strconv
- Day 3：os、filepath、io/ioutil
- Day 4-5：encoding/json、net/http（写一个 Hello World 服务器）
- Day 6-7：testing 包、表驱动测试、benchmark

**学多少**：
- 用 net/http 写一个返回 JSON 的 API：`/api/time` 返回当前时间
- 给 Week 2-3 的 demo 补全单元测试，覆盖率 >70%

**产出**：`backend/demos/week4-http-api/`

---

## Month 2：Web 开发（Week 5-8，约 30h）

### Week 5：Gin 框架 + RESTful API

**学习资料**：
- 🌐 [Gin 官方文档](https://gin-gonic.com/docs/)（快速开始 + 教程）
- 🎥 [Gin 框架教程](https://www.bilibili.com/video/BV17i4y1T7xB/)（B 站李文周，约 3h）
- 📖 [Gin 中文文档](https://gin-gonic.com/zh-cn/docs/)

**学什么**：
- Day 1-2：路由、参数绑定（Query/Path/Body）、中间件
- Day 3-4：JSON 校验（binding tags）、错误处理中间件
- Day 5：分组路由、版本管理
- Day 6-7：JWT 鉴权中间件

**学多少**：
- 写一个「待办事项 API」：CRUD + 用户登录 + JWT 鉴权
- 接口文档用 Markdown 手写，存到 `backend/demos/week5-todo-api/api.md`

**产出**：`backend/demos/week5-todo-api/`

---

### Week 6：数据库 + ORM

**学习资料**：
- 🌐 [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)（英文，按章节做练习）
- 🌐 [GORM 官方文档](https://gorm.io/zh_CN/docs/)（中文）
- 🎥 [PostgreSQL 入门到精通](https://www.bilibili.com/video/BV1j54y1d7e4/)（B 站，挑前 20 集看）

**学什么**：
- Day 1-2：SQL 基础（CREATE/INSERT/SELECT/UPDATE/DELETE、JOIN、索引）
- Day 3：PostgreSQL 安装、psql 客户端、pgAdmin
- Day 4-5：GORM 模型定义、AutoMigrate、CRUD、关联（Has Many/Belongs To）
- Day 6-7：事务、Hook、Scopes

**学多少**：
- 把 Week 5 的待办事项 API 从内存存储改成 PostgreSQL + GORM
- 设计 3 张表：users、todos、tags（多对多）
- 写 5 个核心查询的 SQL（不用 ORM 跑一遍，理解底层）

**产出**：`backend/demos/week6-todo-pg/`

---

### Week 7：项目结构 + 配置 + 日志

**学习资料**：
- 🌐 [Standard Go Project Layout](https://github.com/golang-standards/project-layout)（社区约定）
- 🌐 [Viper 配置管理](https://github.com/spf13/viper)
- 🌐 [Zap 高性能日志](https://github.com/uber-go/zap)

**学什么**：
- Day 1-2：项目分层（cmd/internal/pkg、handler/service/repository）
- Day 3：Viper 读 YAML 配置 + 环境变量覆盖
- Day 4-5：Zap 结构化日志 + 日志分级 + 文件轮转
- Day 6-7：优雅关闭（signal + context + timeout）

**学多少**：
- 重构 Week 6 的项目为标准三层结构
- 添加配置文件 + 日志 + 优雅关闭
- 用 Makefile 管理构建命令

**产出**：`backend/demos/week7-clean-arch/`

---

### Week 8：实战项目（API 服务器）

**学习资料**：
- 🌐 [Go 项目模板](https://github.com/golang-standards/project-layout)
- 🌐 [Docker 入门](https://docs.docker.com/get-started/)（只需看前 5 章）

**学什么**：
- Day 1-2：整合前三周内容，做一个完整的「博客 API」
- Day 3：分页、过滤、排序
- Day 4：文件上传（图片）
- Day 5：Rate Limit（限流）
- Day 6-7：Docker 化部署

**学多少**：
- 完整 API：users + posts + comments + tags
- 写 docker-compose.yml（Go + PostgreSQL）
- 用 curl 或 Postman 跑通全部接口

**产出**：`backend/demos/week8-blog-api/` + 可运行的 Docker 部署

---

## Month 3：进阶能力（Week 9-12，约 30h）

### Week 9：Redis 缓存 + 消息队列入门

**学习资料**：
- 🌐 [Redis 官方教程](https://redis.io/docs/getting-started/)（基础数据结构）
- 🌐 [go-redis 文档](https://redis.uptrace.dev/guide/)
- 🌐 [NATS 中文教程](https://nats-io.github.io/docs/)

**学什么**：
- Day 1-2：Redis 5 种数据结构（string/list/hash/set/zset）
- Day 3：缓存策略（Cache-Aside、Write-Through、TTL）
- Day 4-5：go-redis 客户端、分布式锁
- Day 6-7：消息队列（NATS 或 Kafka 入门）

**学多少**：
- 给博客 API 加上 Redis 缓存（热点文章缓存 5min）
- 写一个「文章浏览量统计」demo：浏览事件发到 NATS，消费者聚合写库

**产出**：`backend/demos/week9-redis-mq/`

---

### Week 10：gRPC + 微服务

**学习资料**：
- 🌐 [gRPC 官方 Go 教程](https://grpc.io/docs/languages/go/basics/)
- 🌐 [Protocol Buffers 教程](https://protobuf.dev/programming-guides/proto3/)
- 🎥 [gRPC Go 实战](https://www.bilibili.com/video/BV1tT4y1F7YR/)（B 站）

**学什么**：
- Day 1-2：Protobuf 定义、生成 Go 代码
- Day 3-4：gRPC 四种调用模式（Unary/Server Stream/Client Stream/Bidi）
- Day 5：拦截器（Interceptor）、超时控制
- Day 6-7：服务注册与发现（etcd 或 Consul）

**学多少**：
- 把博客 API 拆成两个服务：user-service + post-service，用 gRPC 通信
- 用 etcd 做服务注册

**产出**：`backend/demos/week10-grpc-micro/`

---

### Week 11：可观测性（日志 + 指标 + 追踪）

**学习资料**：
- 🌐 [OpenTelemetry Go](https://opentelemetry.io/docs/languages/go/)
- 🌐 [Prometheus + Grafana 教程](https://prometheus.io/docs/tutorials/)

**学什么**：
- Day 1-2：Prometheus 指标埋点（Counter/Gauge/Histogram）
- Day 3：Grafana 仪表盘配置
- Day 4-5：OpenTelemetry 分布式追踪
- Day 6-7：结构化日志聚合（Loki 或 ELK）

**学多少**：
- 给 Week 10 的微服务加：QPS 指标、P99 延迟、错误率
- 加 Jaeger 追踪跨服务调用链

**产出**：`backend/demos/week11-observability/`

---

### Week 12：综合实战

**学什么**：
- 整合 Month 1-3 所有技术，做一个完整的微服务小项目
- 主题自选：聊天室、短链服务、文件分享、监控告警

**学多少**：
- ≥2 个微服务，gRPC 通信
- PostgreSQL + Redis
- Prometheus 指标 + 日志
- Docker Compose 一键启动
- README 写部署说明

**产出**：`backend/demos/week12-final/`

---

## Month 4-5：项目实战（约 60h）

> 这两个月不再单独学知识点，而是**结合项目 2（AI 知识库）/ 项目 3（性能监控）做真实开发**。
> 学什么由项目需求驱动，遇到不会的就现学。

### Week 13-16：AI 知识库后端

**学习资料**（按需）：
- 🌐 [pgvector 教程](https://github.com/pgvector/pgvector)
- 🌐 [OpenAI Go SDK](https://github.com/sashabaranov/go-openai)
- 🌐 [Embedding 模型选型](https://platform.openai.com/docs/guides/embeddings)

**项目目标**：
- 文档上传 → 切片 → Embedding → 存 pgvector
- 检索：问题 → Embedding → 相似度搜索 → 返回 Top-K 片段
- API：上传/检索/对话三个核心接口

### Week 17-20：性能监控后端

**学习资料**（按需）：
- 🌐 [Time Series Database 对比](https://prometheus.io/docs/prometheus/latest/storage/)
- 🌐 [InfluxDB Go 客户端](https://github.com/influxdata/influxdb-client-go)

**项目目标**：
- 接收 Agent 上报的指标数据
- 时序存储（Prometheus 或 InfluxDB）
- 告警规则引擎（阈值触发）
- 仪表盘 API

---

## Month 6：面试准备（约 30h）

### 系统设计（Week 21-22）

**学习资料**：
- 📖 [System Design Primer](https://github.com/donnemartin/system-design-primer)（GitHub 经典项目，英文）
- 📖 [《数据密集型应用系统设计》](https://book.douban.com/subject/30329536/)（DDIA，必读经典）
- 🎥 [系统设计面试题合集](https://www.bilibili.com/video/BV1xE411F7Wj/)（B 站）

**学什么**：
- 经典题：设计短链、设计 Twitter、设计秒杀系统、设计消息队列
- 八股：Redis 持久化、MySQL 索引、CAP/BASE、一致性哈希、限流算法

### 分布式基础（Week 23）

**学习资料**：
- 📖 DDIA 第 5-9 章（复制、分区、事务、一致性）
- 🌐 [MIT 6.824 分布式系统](https://pdos.csail.mit.edu/6.824/)（看前 5 节课视频）

### 简历 + 模拟面试（Week 24）

- 整理这 5 个月的项目经验，写成简历
- 找朋友 mock interview 2 次
- 复盘博客写 1 篇：5 个月学习路径复盘

---

## 📚 资源清单汇总

### 必看（按优先级）

| # | 资源 | 类型 | 时长 | 用途 |
|---|------|------|------|------|
| 1 | [A Tour of Go](https://go.dev/tour/welcome/list) | 互动教程 | 4h | 入门必做 |
| 2 | [《Go 语言圣经》中文版](https://gopl-zh.com/) | 在线书 | 选读 | 深入语法 |
| 3 | [Go by Example](https://gobyexample.com/) | 示例 | 随查 | 速查语法 |
| 4 | [Learn Go with Tests](https://github.com/quii/learn-go-with-tests) | 教程 | 20h | TDD 学 Go |
| 5 | [Gin 官方文档](https://gin-gonic.com/docs/) | 文档 | 3h | Web 框架 |
| 6 | [GORM 文档](https://gorm.io/zh_CN/docs/) | 文档 | 4h | ORM |
| 7 | [PostgreSQL Tutorial](https://www.postgresqltutorial.com/) | 教程 | 8h | 数据库 |
| 8 | [System Design Primer](https://github.com/donnemartin/system-design-primer) | 仓库 | 20h | 系统设计 |
| 9 | [DDIA](https://book.douban.com/subject/30329536/) | 书 | 30h | 分布式圣经 |

### B 站视频（中文）

| 视频 | 时长 | 用途 |
|------|------|------|
| [李文周 Go 语言教程](https://www.bilibili.com/video/BV17i4y1T7xB/) | 3h | Gin 框架入门 |
| [PostgreSQL 入门到精通](https://www.bilibili.com/video/BV1j54y1d7e4/) | 选看 | 数据库 |
| [gRPC Go 实战](https://www.bilibili.com/video/BV1tT4y1F7YR/) | 2h | 微服务 |
| [系统设计面试题](https://www.bilibili.com/video/BV1xE411F7Wj/) | 8h | 系统设计 |

### 进阶（按需选读）

- [Effective Go](https://go.dev/doc/effective_go) — 官方最佳实践
- [Go Concurrency Patterns](https://www.youtube.com/watch?v=f6kdp0TYVgA) — Google I/O 演讲
- [Standard Go Project Layout](https://github.com/golang-standards/project-layout) — 项目结构约定
- [Viper](https://github.com/spf13/viper) / [Zap](https://github.com/uber-go/zap) — 配置 + 日志
- [OpenTelemetry Go](https://opentelemetry.io/docs/languages/go/) — 可观测性
- [MIT 6.824](https://pdos.csail.mit.edu/6.824/) — 分布式系统课程

---

## ✅ 每周自检清单

- [ ] 本周 demo 是否产出？（没 demo = 没学到东西）
- [ ] 本周代码 commit 次数 ≥3？
- [ ] 是否写了 ≥100 字学习笔记存到 `backend/notes/`？
- [ ] 下周计划是否清晰？
