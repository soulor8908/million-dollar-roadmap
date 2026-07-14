// lib/presets/ai.ts
// AI 工程师面试全攻略预设：12 知识节点 + 28 道高频面试题 + 学习计划
// 覆盖：机器学习基础、经典算法（线性/逻辑回归、树、SVM）、神经网络与深度学习、
//       CNN/RNN/Transformer、大语言模型、计算机视觉、推荐系统

import type { KnowledgeNode, Question, ScheduleItem } from "../types";

const AI_NODES: KnowledgeNode[] = [
  {
    id: "ai-ml-basic",
    title: "机器学习基础",
    difficulty: 2,
    prerequisites: [],
    frequency: "高",
    summary: "监督/无监督/强化学习、过拟合与欠拟合、偏差-方差权衡、交叉验证、评估指标（准确率/精确率/召回率/F1/AUC）。",
    mastery: 0,
  },
  {
    id: "ai-linear-logistic",
    title: "线性回归与逻辑回归",
    difficulty: 3,
    prerequisites: ["ai-ml-basic"],
    frequency: "高",
    summary: "线性回归最小二乘、梯度下降、正则化（L1/Lasso、L2/Ridge）；逻辑回归 Sigmoid、极大似然、交叉熵。",
    mastery: 0,
  },
  {
    id: "ai-tree-rf",
    title: "决策树与随机森林",
    difficulty: 3,
    prerequisites: ["ai-ml-basic"],
    frequency: "高",
    summary: "信息增益/增益率/基尼指数、ID3/C4.5/CART、剪枝、Bagging 与随机森林、GBDT/XGBoost。",
    mastery: 0,
  },
  {
    id: "ai-svm",
    title: "支持向量机",
    difficulty: 4,
    prerequisites: ["ai-ml-basic"],
    frequency: "中",
    summary: "最大间隔、软间隔与松弛变量、核函数（线性/RBF/多项式）、SMO 求解、SVC/SVR。",
    mastery: 0,
  },
  {
    id: "ai-nn-basic",
    title: "神经网络基础",
    difficulty: 4,
    prerequisites: ["ai-ml-basic"],
    frequency: "高",
    summary: "前向传播、反向传播（链式法则）、激活函数（ReLU/Sigmoid/Tanh）、损失函数、梯度消失/爆炸、优化器（SGD/Adam）。",
    mastery: 0,
  },
  {
    id: "ai-dl-framework",
    title: "深度学习框架",
    difficulty: 3,
    prerequisites: ["ai-nn-basic"],
    frequency: "中",
    summary: "PyTorch（动态图/nn.Module/autograd）、TensorFlow（Keras/静态图）、张量操作、训练循环、GPU 加速、混合精度。",
    mastery: 0,
  },
  {
    id: "ai-cnn",
    title: "CNN 卷积神经网络",
    difficulty: 4,
    prerequisites: ["ai-nn-basic"],
    frequency: "高",
    summary: "卷积/池化/感受野、LeNet/AlexNet/VGG/ResNet、1×1 卷积、BatchNorm、迁移学习与微调。",
    mastery: 0,
  },
  {
    id: "ai-rnn-lstm",
    title: "RNN/LSTM 与序列建模",
    difficulty: 4,
    prerequisites: ["ai-nn-basic"],
    frequency: "高",
    summary: "RNN 结构与梯度消失、LSTM 门控机制、GRU、双向 RNN、Seq2Seq、注意力机制（Attention）。",
    mastery: 0,
  },
  {
    id: "ai-transformer",
    title: "Transformer",
    difficulty: 5,
    prerequisites: ["ai-rnn-lstm"],
    frequency: "高",
    summary: "Self-Attention、多头注意力、位置编码、Encoder/Decoder、LayerNorm、BERT（Encoder）、GPT（Decoder）。",
    mastery: 0,
  },
  {
    id: "ai-llm",
    title: "大语言模型",
    difficulty: 5,
    prerequisites: ["ai-transformer"],
    frequency: "高",
    summary: "Prompt Engineering、Fine-tuning（LoRA/QLoRA）、RLHF、RAG 检索增强、上下文窗口、幻觉与对齐。",
    mastery: 0,
  },
  {
    id: "ai-cv",
    title: "计算机视觉",
    difficulty: 4,
    prerequisites: ["ai-cnn"],
    frequency: "中",
    summary: "目标检测（YOLO/Faster R-CNN）、图像分割（语义/实例/U-Net）、Anchor-free、NMS、数据增强。",
    mastery: 0,
  },
  {
    id: "ai-recsys",
    title: "推荐系统",
    difficulty: 4,
    prerequisites: ["ai-ml-basic"],
    frequency: "中",
    summary: "协同过滤（UserCF/ItemCF/矩阵分解）、深度推荐（Wide&Deep/DIN）、召回-排序架构、特征工程、冷启动。",
    mastery: 0,
  },
];

const AI_QUESTIONS: Question[] = [
  // ===== 机器学习基础 =====
  {
    id: "ai-1",
    nodeId: "ai-ml-basic",
    question: "解释偏差-方差权衡（Bias-Variance Tradeoff），过拟合和欠拟合分别对应什么？",
    answer: `偏差（Bias）：模型预测值与真实值的平均差异，反映模型拟合能力。偏差高 = 欠拟合（模型太简单）。
方差（Variance）：模型对不同训练集预测结果的波动，反映对训练数据的敏感度。方差高 = 过拟合（学到噪声）。

期望误差 = 偏差² + 方差 + 不可约噪声。

- 欠拟合（高偏差）：训练误差和测试误差都高。解决：增加模型复杂度、加特征、减少正则。
- 过拟合（高方差）：训练误差低、测试误差高。解决：增数据、降复杂度、正则化（L1/L2/Dropout）、早停、交叉验证。

\`\`\`
复杂度低 ──→ 复杂度高
偏差高(欠拟合) ──→ 最优 ──→ 方差高(过拟合)
\`\`\`

关键：偏差与方差此消彼长，目标是找到总误差最低的平衡点。`,
    keyPoints: ["误差 = 偏差² + 方差 + 噪声", "高偏差=欠拟合，高方差=过拟合", "正则化/增数据降方差"],
    followUps: ["集成学习如何降低方差？", "L1 和 L2 正则化降低方差的方式有何不同？"],
    favorited: false,
  },
  {
    id: "ai-2",
    nodeId: "ai-ml-basic",
    question: "精确率、召回率、F1、AUC 的含义？什么场景该看重哪个？",
    answer: `二分类混淆矩阵：TP（真阳）/ FP（假阳）/ TN（真阴）/ FN（假阴）。

- 精确率 Precision = TP / (TP + FP)：预测为正中真正为正的比例。
- 召回率 Recall = TP / (TP + FN)：真实为正中被找出的比例。
- F1 = 2 × P × R / (P + R)：精确率和召回率的调和平均。
- AUC：ROC 曲线下面积，衡量正样本排在负样本前面的概率，对类别不平衡不敏感。

场景侧重：
- 医疗诊断/欺诈检测：看重召回率（漏诊代价高，宁可误报）。
- 垃圾邮件/推荐：看重精确率（误判正常邮件代价高）。
- 类别不平衡：用 AUC/PR-AUC，不用准确率（Accuracy）。

关键：F1 平衡精确率和召回率；AUC 阈值无关，适合不平衡数据。`,
    keyPoints: ["Precision=TP/(TP+FP), Recall=TP/(TP+FN)", "F1 调和平均 P 和 R", "AUC 阈值无关，适合不平衡"],
    followUps: ["ROC 和 PR 曲线的区别？", "类别极度不平衡时用 AUC 还是 PR-AUC？"],
    favorited: false,
  },
  {
    id: "ai-3",
    nodeId: "ai-ml-basic",
    question: "什么是交叉验证？K 折交叉验证的流程？",
    answer: `交叉验证：将数据分成多份，轮流用其中一份做验证、其余做训练，多次评估取平均，更可靠地估计模型泛化能力，减少单次划分的随机性。

K 折（K-Fold）流程：
1. 将数据均分为 K 份。
2. 第 i 轮：第 i 份做验证集，其余 K-1 份做训练集。
3. 重复 K 次，每份都做一次验证。
4. K 次评估指标取平均作为最终结果。

常见变体：
- 分层 K 折（Stratified K-Fold）：每折类别比例与整体一致，适合不平衡数据。
- 留一法（LOO）：K=N，每次留一个样本，计算量大但数据利用率高。
- 时间序列交叉验证：不能打乱时间，用前 n 天训练预测第 n+1 天。

\`\`\`python
from sklearn.model_selection import cross_val_score
scores = cross_val_score(model, X, y, cv=5, scoring="f1")  # 5 折
print(scores.mean(), scores.std())
\`\`\`

关键：交叉验证用于模型选择和调参，最终模型需在全量数据上重新训练。`,
    keyPoints: ["K 折轮流做验证取平均", "分层 K 折保类别比例", "时间序列不能随机打乱"],
    followUps: ["交叉验证能防止过拟合吗？", "数据泄露在交叉验证中如何避免？"],
    favorited: false,
  },
  // ===== 线性回归与逻辑回归 =====
  {
    id: "ai-4",
    nodeId: "ai-linear-logistic",
    question: "梯度下降的原理？学习率过大/过小有什么问题？",
    answer: `梯度下降：沿损失函数负梯度方向更新参数，逐步逼近最小值。

\`\`\`
θ = θ - η · ∇L(θ)    # η 为学习率
\`\`\`

学习率影响：
- 过大：步长太大，可能跳过最优解，震荡甚至发散（损失不降反升）。
- 过小：收敛极慢，易陷入局部最优，训练时间长。

变体：
- 批量梯度下降（BGD）：全量数据算梯度，稳定但慢。
- 随机梯度下降（SGD）：单样本算梯度，快但噪声大。
- 小批量（Mini-batch）：折中，深度学习主流（batch 32-256）。
- Momentum/Adam：动量加速 + 自适应学习率，收敛更快更稳。

关键：学习率是最重要超参；常用学习率衰减（warmup + cosine decay）和自适应优化器（Adam）。`,
    keyPoints: ["负梯度方向更新", "学习率过大震荡/过小慢", "Mini-batch + Adam 主流"],
    followUps: ["Adam 优化器原理？", "学习率预热（warmup）作用？"],
    favorited: false,
  },
  {
    id: "ai-5",
    nodeId: "ai-linear-logistic",
    question: "L1 和 L2 正则化的区别？为什么 L1 能产生稀疏解？",
    answer: `L1 正则化（Lasso）：损失加 λ·Σ|wᵢ|，约束项为参数绝对值之和。
L2 正则化（Ridge）：损失加 λ·Σwᵢ²，约束项为参数平方和。

区别：
1. L1 产生稀疏解（部分权重归零），可用作特征选择。
2. L2 使权重趋于小且分散（不归零），平滑但非稀疏。
3. L1 在 w=0 处不可导，需次梯度/坐标下降；L2 处处可导，梯度简单。

为什么 L1 稀疏：
- 几何上：L1 约束区域是菱形（顶点在坐标轴上），等值线最先在顶点相切 → 某些维度为 0。
- L2 约束区域是圆，相切点一般在非坐标轴 → 权重小但不为 0。
- 梯度视角：L1 梯度为 ±λ（常数），w 接近 0 时仍被推向 0；L2 梯度为 2λw，w→0 时推力→0，不易归零。

\`\`\`
L(w) = Loss(w) + λ·||w||₁   # L1
L(w) = Loss(w) + λ·||w||₂²  # L2
\`\`\`

关键：L1 做特征选择，L2 防过拟合；Elastic Net 结合两者。`,
    keyPoints: ["L1 稀疏可做特征选择", "L2 平滑权重分散", "L1 菱形顶点相切致稀疏"],
    followUps: ["Elastic Net 是什么？", "正则化系数 λ 如何选择？"],
    favorited: false,
  },
  // ===== 决策树与随机森林 =====
  {
    id: "ai-6",
    nodeId: "ai-tree-rf",
    question: "决策树划分特征的标准有哪些？信息增益 vs 基尼指数？",
    answer: `划分标准衡量"划分后纯度提升"。

1. 信息增益（ID3）：用信息熵。
   信息熵 H(D) = -Σ pₖ log pₖ，信息增益 = H(D) - Σ |Dᵢ|/|D| · H(Dᵢ)。
   缺点：偏向取值多的特征（如 ID）。

2. 增益率（C4.5）：信息增益 / 固有熵，修正偏向多值特征。

3. 基尼指数（CART 分类）：Gini(D) = 1 - Σ pₖ²，衡量随机抽两个样本不同类概率。
   基尼越小越纯，计算比熵快（无 log）。

对比信息增益和基尼：
- 信息增益用对数，计算稍慢；基尼用平方，更快。
- 大多数场景两者效果接近；基尼偏向隔离高频类，熵更均衡。
- CART 用基尼（也支持回归，用平方误差）。

关键：ID3 信息增益、C4.5 增益率、CART 基尼/平方误差；CART 生成二叉树。`,
    keyPoints: ["ID3 信息增益/C4.5 增益率/CART 基尼", "信息增益偏向多值特征", "基尼计算快无 log"],
    followUps: ["CART 如何处理连续值和缺失值？", "决策树如何剪枝？"],
    favorited: false,
  },
  {
    id: "ai-7",
    nodeId: "ai-tree-rf",
    question: "随机森林为什么能降低过拟合？Bagging 的原理？",
    answer: `Bagging（Bootstrap Aggregating）：
1. 从训练集有放回采样生成多个子训练集（Bootstrap）。
2. 每个子集训练一棵独立的决策树。
3. 分类投票/回归平均得到结果。

随机森林 = Bagging + 决策树 + 特征随机：
- 每棵树分裂时只从随机子集特征中选最优（特征随机），进一步降低树间相关性。
- 每棵树不剪枝，单棵树高方差易过拟合。

为什么能降低过拟合：
- 多棵树相互独立，误差不相关，平均后方差降低（σ²/n，n 为树数）。
- 特征随机去相关，避免所有树偏向同一强特征，提升多样性。
- 集成结果比单棵树泛化更好。

\`\`\`python
from sklearn.ensemble import RandomForestClassifier
rf = RandomForestClassifier(n_estimators=100, max_features="sqrt", oob_score=True)
rf.fit(X_train, y_train)
\`\`\`

关键：Bagging 降方差（适合高方差模型如深决策树）；Boosting（GBDT/XGBoost）降偏差（串联纠错）。`,
    keyPoints: ["Bagging 有放回采样训练多棵树", "随机森林加特征随机去相关", "平均降方差，适合深决策树"],
    followUps: ["Bagging 和 Boosting 区别？", "XGBoost 相比 GBDT 的改进？"],
    favorited: false,
  },
  // ===== 支持向量机 =====
  {
    id: "ai-8",
    nodeId: "ai-svm",
    question: "SVM 的核心思想？为什么要用核函数？",
    answer: `SVM 寻找一个最大化分类间隔的超平面，间隔 = 离超平面最近样本（支持向量）到超平面的距离的 2 倍。

线性可分 SVM：
- 最小化 1/2 ||w||²（等价最大化间隔 2/||w||）。
- 约束 yᵢ(w·xᵢ + b) ≥ 1。

软间隔：引入松弛变量 ξᵢ 允许部分样本错分，目标 min 1/2||w||² + C·Σξᵢ，C 权衡间隔与错分。

核函数：
- 线性不可分时，把数据映射到高维空间使其可分。
- 核函数 K(xᵢ, xⱼ) = φ(xᵢ)·φ(xⱼ) 直接计算高维内积，无需显式映射（核技巧），避免维度爆炸。
- 常用：线性核、RBF（高斯）核 K=exp(-γ||xᵢ-xⱼ||²)、多项式核。

关键：SVM 只由支持向量决定，泛化好；核技巧把低维非线性转为高维线性，计算量可控。`,
    keyPoints: ["最大化分类间隔", "软间隔引入松弛变量和 C", "核技巧隐式高维映射避免维度爆炸"],
    followUps: ["RBF 核的 γ 参数影响？", "SVM 如何处理多分类？"],
    favorited: false,
  },
  {
    id: "ai-9",
    nodeId: "ai-svm",
    question: "SVM 的对偶问题是什么？为什么要求对偶？",
    answer: `原始问题（带约束优化）通过拉格朗日乘子法转化为对偶问题：
- 引入拉格朗日乘子 αᵢ ≥ 0。
- 对 w, b 求偏导置 0，代入得对偶问题：max Σαᵢ - 1/2 ΣΣ αᵢαⱼyᵢyⱼ(xᵢ·xⱼ)，约束 Σαᵢyᵢ=0, 0≤αᵢ≤C。
- 解出 α 后，w = Σαᵢyᵢxᵢ，αᵢ>0 的样本即支持向量。

为什么求对偶：
1. 引入核函数：对偶问题只涉及内积 xᵢ·xⱼ，可直接替换为 K(xᵢ,xⱼ) 实现核技巧。
2. 求解更高效：原问题维度 = 特征数 d，对偶问题维度 = 样本数 n；当 d 远大于 n 时对偶更高效。
3. 支持向量稀疏：多数 αᵢ=0，只少数支持向量参与预测，预测快。

SMO 算法：每次选两个 α 优化（因约束 Σαᵢyᵢ=0），解析求解，迭代收敛。

关键：对偶化使核技巧自然引入，且支持向量稀疏化加速预测。`,
    keyPoints: ["拉格朗日乘子转对偶", "对偶只涉内积便于核技巧", "支持向量 α>0 稀疏"],
    followUps: ["SMO 算法流程？", "支持向量为何稀疏？"],
    favorited: false,
  },
  // ===== 神经网络基础 =====
  {
    id: "ai-10",
    nodeId: "ai-nn-basic",
    question: "反向传播算法的原理？链式法则如何应用？",
    answer: `反向传播：用链式法则从输出层向输入层逐层计算损失对各参数的梯度，用于梯度下降更新。

前向传播：z = W·x + b，a = σ(z)，逐层计算到输出，记录中间值。
反向传播：从损失 L 出发，计算 ∂L/∂w、∂L/∂b。

链式法则（单神经元）：
\`\`\`
∂L/∂w = ∂L/∂a · ∂a/∂z · ∂z/∂w
       = ∂L/∂a · σ'(z) · x
\`\`\`

对一层：
- ∂L/∂z = ∂L/∂a ⊙ σ'(z)（激活函数导数逐元素）。
- ∂L/∂W = (∂L/∂z)·xᵀ，∂L/∂b = ∂L/∂z。
- 向前一层传递：∂L/∂x = Wᵀ·∂L/∂z。

\`\`\`python
# 简化反向传播
dA = -(Y / A - (1-Y)/(1-A))   # 损失对输出导数
dZ = dA * sigmoid_derivative(Z)
dW = dZ @ X.T / m
db = dZ.sum(axis=1, keepdims=True) / m
dA_prev = W.T @ dZ            # 传给上一层
\`\`\`

关键：反向传播 = 链式法则 + 复用前向中间值；自动微分（autograd）自动完成。`,
    keyPoints: ["链式法则逐层求梯度", "∂L/∂z = ∂L/∂a ⊙ σ'(z)", "梯度向前层传递 ∂L/∂x=Wᵀ·∂L/∂z"],
    followUps: ["梯度消失的原因和解决？", "自动微分和数值微分区别？"],
    favorited: false,
  },
  {
    id: "ai-11",
    nodeId: "ai-nn-basic",
    question: "为什么 ReLU 比 Sigmoid 更常用？ReLU 的缺点及改进？",
    answer: `ReLU 优点：
1. 计算简单（max(0,x)），无指数运算。
2. 正区间梯度恒为 1，缓解梯度消失，深网络可训练。
3. 产生稀疏激活（负值归零），有正则化效果。

Sigmoid 缺点：
1. 饱和区梯度趋于 0，深网络梯度消失。
2. 输出非零均值（恒正），影响收敛。
3. 指数计算开销大。

ReLU 缺点：神经元死亡（Dead ReLU）——负输入梯度为 0，若某神经元一直负则永不更新。

改进：
- Leaky ReLU / PReLU：负区间给小斜率（如 0.01x），避免死亡。
- ELU：负区间平滑（α(eˣ-1)），零均值。
- GELU：高斯误差线性单元，Transformer 常用，平滑且性能好。
- Swish：x·σ(βx)，在深层网络表现优于 ReLU。

关键：ReLU 简单且缓解梯度消失，是隐藏层默认；Transformer/BERT 常用 GELU。`,
    keyPoints: ["ReLU 正区间梯度恒 1 防消失", "ReLU 有神经元死亡问题", "Leaky/GELU 改进"],
    followUps: ["为什么 Sigmoid 会导致梯度消失？", "GELU 为什么在 Transformer 中常用？"],
    favorited: false,
  },
  {
    id: "ai-12",
    nodeId: "ai-nn-basic",
    question: "Adam 优化器的原理？相比 SGD 的优势？",
    answer: `Adam（Adaptive Moment Estimation）结合 Momentum（一阶矩）和 RMSProp（二阶矩）：
- 一阶矩（动量）：m = β₁·m + (1-β₁)·g，累积梯度方向。
- 二阶矩（自适应学习率）：v = β₂·v + (1-β₂)·g²，累积梯度平方。
- 偏差修正：m̂ = m/(1-β₁ᵗ)，v̂ = v/(1-β₂ᵗ)（修正初期偏差）。
- 更新：θ = θ - η · m̂ / (√v̂ + ε)。

\`\`\`python
m = beta1 * m + (1-beta1) * g
v = beta2 * v + (1-beta2) * g**2
m_hat = m / (1 - beta1**t)
v_hat = v / (1 - beta2**t)
theta -= lr * m_hat / (sqrt(v_hat) + eps)
\`\`\`

优势（vs SGD）：
1. 自适应学习率：每个参数独立调整（梯度大的步长小，梯度小的步长大）。
2. 动量加速收敛且抑制震荡。
3. 对超参数不敏感（默认 β₁=0.9, β₂=0.999, ε=1e-8 即可）。
4. 收敛快，适合稀疏梯度（NLP/Embedding）。

注意：Adam 泛化可能不如 SGD+Momentum（部分 CV 任务）；常用 AdamW（解耦权重衰减）训练 Transformer。`,
    keyPoints: ["Adam = 一阶动量 + 二阶自适应", "偏差修正修正初期", "AdamW 解耦权重衰减"],
    followUps: ["AdamW 和 Adam 区别？", "为什么 Adam 泛化有时不如 SGD？"],
    favorited: false,
  },
  // ===== 深度学习框架 =====
  {
    id: "ai-13",
    nodeId: "ai-dl-framework",
    question: "PyTorch 的 autograd 原理？动态图相比静态图的优势？",
    answer: `autograd：基于计算图的反向自动微分。
- 前向传播时自动构建计算图，记录每个张量操作的父节点和反向函数。
- 调用 loss.backward() 从叶子节点反向遍历，用链式法则累积梯度到 .grad。

动态图（PyTorch）vs 静态图（TensorFlow 1.x）：
- 动态图：每次前向即时构建图，可用 Python 控制流（if/for），调试友好，像写普通 Python。
- 静态图：先定义图再执行，优化空间大（融合/分布式），但调试难、不灵活。

\`\`\`python
import torch
x = torch.tensor(2.0, requires_grad=True)
y = x ** 2 + 3 * x     # 前向，记录计算图
y.backward()            # 反向，自动求导
print(x.grad)           # dy/dx = 2x + 3 = 7.0
\`\`\`

TensorFlow 2.x 默认 eager mode（动态图）+ tf.function 编译为静态图优化，两者趋同。

关键：动态图灵活易调试，是研究主流；静态图性能优适合生产部署。`,
    keyPoints: ["autograd 自动构建计算图求导", "动态图灵活易调试", "静态图性能优可优化"],
    followUps: ["requires_grad 和 no_grad 的作用？", "tf.function 如何加速？"],
    favorited: false,
  },
  {
    id: "ai-14",
    nodeId: "ai-dl-framework",
    question: "什么是混合精度训练？为什么能加速？",
    answer: `混合精度训练（Mixed Precision）：同时用 FP16（半精度）和 FP32（单精度）训练，兼顾速度和精度。

加速原因：
1. FP16 显存减半 → 可用更大 batch / 更大模型。
2. GPU Tensor Core 对 FP16 矩阵乘法有数倍加速（如 Volta/Ampere）。
3. 显存带宽占用减半，数据搬运更快。

精度保障（防 FP16 溢出/下溢）：
1. 权重主副本用 FP32（master weights）：更新时 FP16 算梯度，FP32 累加更新，避免小梯度舍入为 0。
2. Loss Scaling：将 loss 放大（如 ×2¹⁶），梯度同步放大避免下溢，更新前再缩回。

\`\`\`python
from torch.cuda.amp import autocast, GradScaler
scaler = GradScaler()
for x, y in loader:
    with autocast():           # 自动混合精度
        loss = model(x, y)
    scaler.scale(loss).backward()
    scaler.step(optimizer)
    scaler.update()
\`\`\`

关键：混合精度 = FP16 计算 + FP32 主权重 + Loss Scaling，提速省显存且不掉精度。`,
    keyPoints: ["FP16 计算快省显存 + FP32 保精度", "Loss Scaling 防梯度下溢", "Tensor Core 加速矩阵乘"],
    followUps: ["BF16 和 FP16 有什么区别？为什么 LLM 训练用 BF16？", "GradScaler 如何选择 scale？"],
    favorited: false,
  },
  // ===== CNN =====
  {
    id: "ai-15",
    nodeId: "ai-cnn",
    question: "卷积层中感受野的概念？如何计算？",
    answer: `感受野（Receptive Field）：特征图上某点对应输入图像的区域大小，决定该点能"看到"原图多大范围。

计算（逐层递推）：
- 单层 3×3 卷积（stride=1, padding=1）：感受野 = 3。
- 两层 3×3 卷积：感受野 = 3 + (3-1)×1 = 5。
- 通式：RFₖ = RFₖ₋₁ + (kernel - 1) × ∏(strideᵢ)（累乘之前所有 stride）。

\`\`\`
第1层 3×3(s=1): RF=3
第2层 3×3(s=1): RF=3+(3-1)*1=5
第3层 3×3(s=2): RF=5+(3-1)*1*1=7
第4层 3×3(s=1): RF=7+(3-1)*1*1*2=11
\`\`\`

意义：
- 感受野越大，能捕获全局信息；太小则只看局部。
- 深层感受野大，适合语义；浅层感受野小，适合细节。
- 两个 3×3 卷积堆叠（RF=5）等效一个 5×5，但参数更少（18 vs 25）且非线性更多。

关键：VGG 用小卷积堆叠扩大感受野；空洞卷积（Dilated Conv）不增加参数也能扩大感受野。`,
    keyPoints: ["感受野 = 特征点对应原图区域", "RFₖ = RFₖ₋₁ + (k-1)×∏stride", "小卷积堆叠等效大卷积省参数"],
    followUps: ["空洞卷积如何扩大感受野？", "为什么深层特征图感受野大？"],
    favorited: false,
  },
  {
    id: "ai-16",
    nodeId: "ai-cnn",
    question: "ResNet 的残差连接解决了什么问题？为什么有效？",
    answer: `问题：网络加深后训练误差反而上升（退化问题 Degradation），不是过拟合，而是深网络难优化（梯度消失/爆炸）。

残差连接（Skip Connection）：H(x) = F(x) + x，学习残差 F(x) = H(x) - x。

\`\`\`
输入 x ──→ [卷积层] ──→ F(x) ──┐
   │                           + ──→ H(x)
   └───────────────────────────┘
\`\`\`

为什么有效：
1. 梯度直连：恒等映射支路让梯度可直达浅层，缓解梯度消失。
2. 恒等映射易学：若某层最优是恒等，只需 F(x)=0（权重置零），比学 H(x)=x 容易。
3. 残差更小更易优化：F(x) 通常比 H(x) 数值小，优化空间更平滑。
4. 不增参数不增计算（仅加法）。

效果：ResNet 可训练 152 层甚至更深，误差持续下降；成为现代 backbone 基础。

关键：残差连接让深网络可训练，是 ResNet/Vision Transformer 等的现代标配。`,
    keyPoints: ["H(x)=F(x)+x 学残差", "恒等支路缓解梯度消失", "退化问题非过拟合是优化难"],
    followUps: ["为什么残差连接能缓解梯度消失？", "ResNet 的 1×1 卷积作用？"],
    favorited: false,
  },
  {
    id: "ai-17",
    nodeId: "ai-cnn",
    question: "什么是迁移学习？如何微调（Fine-tune）一个预训练模型？",
    answer: `迁移学习：将源任务上学到的知识迁移到目标任务，解决目标数据少的问题。深度学习常用预训练模型微调。

微调流程：
1. 选预训练模型（如 ImageNet 上的 ResNet/ViT，或 CLIP）。
2. 替换最后一层分类头为目标类别数。
3. 策略选择：
   - 冻结主干（Freeze）：只训练新分类头，适合小数据集。
   - 全量微调：所有层参与训练，适合大数据集，学习率主干小（如 1e-4）、新层大（如 1e-3）。
   - 逐层解冻：先训分类头，再逐步解冻深层，渐进式。
4. 数据增强 + 较小学习率（比从头训练小 10×）。

\`\`\`python
import torchvision.models as M
model = M.resnet50(weights=M.ResNet50_Weights.DEFAULT)
for p in model.parameters(): p.requires_grad = False  # 冻结
model.fc = nn.Linear(model.fc.in_features, num_classes)  # 换头
optimizer = torch.optim.Adam(model.fc.parameters(), lr=1e-3)
\`\`\`

关键：预训练提供好的特征初始化；小数据冻结主干防破坏特征，大数据全量微调效果更好。`,
    keyPoints: ["预训练+换分类头", "冻结主干(小数据)/全量微调(大数据)", "微调学习率要小"],
    followUps: ["如何避免微调时遗忘预训练知识？", "CLIP 的零样本和少样本迁移？"],
    favorited: false,
  },
  // ===== RNN/LSTM =====
  {
    id: "ai-18",
    nodeId: "ai-rnn-lstm",
    question: "RNN 为什么会有梯度消失？LSTM 如何解决？",
    answer: `RNN 梯度消失：反向传播时梯度沿时间步连乘，若雅可比矩阵谱半径<1，梯度指数衰减，长程依赖学不到（梯度消失）；>1 则梯度爆炸。

LSTM 解决：通过门控机制和细胞状态的长程通路。

LSTM 三个门 + 细胞状态：
- 遗忘门 f = σ(Wf·[hₜ₋₁, xₜ])：决定保留多少旧记忆。
- 输入门 i = σ(Wi·[hₜ₋₁, xₜ])：决定写入多少新信息。
- 候选 Ĉ = tanh(Wc·[hₜ₋₁, xₜ])：新候选记忆。
- 细胞更新 Cₜ = f⊙Cₜ₋₁ + i⊙Ĉ：遗忘旧 + 写入新。
- 输出门 o = σ(Wo·[hₜ₋₁, xₜ])：决定输出。
- 隐藏 hₜ = o⊙tanh(Cₜ)。

为什么缓解梯度消失：
- 细胞状态 Cₜ = f⊙Cₜ₋₁ + i⊙Ĉ，梯度 ∂Cₜ/∂Cₜ₋₁ = f，遗忘门 f 接近 1 时梯度直传，形成"高速公路"，长程依赖得以保留。
- 加法而非纯连乘，避免雅可比谱半径<1 衰减。

GRU 简化版：合并遗忘门和输入门为更新门，无单独细胞状态，参数少速度快，效果接近。

关键：LSTM 门控 + 加法细胞状态提供长程梯度通路，缓解梯度消失。`,
    keyPoints: ["RNN 连乘致梯度消失/爆炸", "LSTM 细胞状态加法更新梯度直传", "遗忘门接近1时长程保留"],
    followUps: ["GRU 和 LSTM 区别？", "梯度爆炸如何解决（梯度裁剪）？"],
    favorited: false,
  },
  {
    id: "ai-19",
    nodeId: "ai-rnn-lstm",
    question: "注意力机制（Attention）的原理？Seq2Seq 中如何使用？",
    answer: `Attention：解码每一步动态关注输入序列的不同部分，计算加权上下文，而非固定向量。

Seq2Seq + Attention 流程：
1. Encoder 输出隐藏状态序列 h₁...hₙ。
2. 解码第 t 步：
   - 计算注意力分数：scoreₜᵢ = score(sₜ₋₁, hᵢ)（点积/加性/缩放点积）。
   - softmax 归一化：αₜᵢ = softmax(scoreₜᵢ)。
   - 加权求和上下文：cₜ = Σ αₜᵢ · hᵢ。
   - 解码：sₜ = RNN(sₜ₋₁, [yₜ₋₁, cₜ])。

\`\`\`
Attention(Q, K, V) = softmax(QKᵀ / √dₖ) · V
\`\`\`

意义：
- 解决长序列信息瓶颈（Encoder 不必压缩成定长向量）。
- 提供可解释性（注意力权重可视化对齐）。
- 是 Transformer 的核心基础。

关键：Attention 用 Query 对 Key 打分，对 Value 加权求和；动态聚焦相关信息。`,
    keyPoints: ["score→softmax→加权求和", "解决定长向量瓶颈", "Q/K/V 三要素（Transformer 基础）"],
    followUps: ["加性注意力和点积注意力区别？", "为什么要除以 √dₖ？"],
    favorited: false,
  },
  // ===== Transformer =====
  {
    id: "ai-20",
    nodeId: "ai-transformer",
    question: "Self-Attention 的计算过程？为什么用多头注意力？",
    answer: `Self-Attention：序列内每个位置与所有位置计算关联（Q=K=V 来自同一输入）。

计算：
1. 输入 X 经线性变换得 Q=XWQ, K=XWK, V=XWV。
2. 注意力权重 A = softmax(QKᵀ / √dₖ)。
3. 输出 = A·V。

\`\`\`python
def attention(Q, K, V):
    d_k = Q.size(-1)
    scores = Q @ K.transpose(-2, -1) / d_k ** 0.5
    attn = scores.softmax(dim=-1)
    return attn @ V
\`\`\`

多头注意力（Multi-Head）：将 Q/K/V 分成 h 组，各自做 attention 后拼接。
- 不同头关注不同子空间（语法/语义/位置），表达能力更强。
- 总计算量与单头相近（维度拆分）。

为什么除以 √dₖ：QKᵇ 点积维度 dₖ，方差随 dₖ 增大，softmax 进入饱和区梯度小；缩放稳定梯度。

关键：Self-Attention 让每位置直接全局交互（O(n²) 并行），是 Transformer 摒弃 RNN 的核心。`,
    keyPoints: ["Q/K/V 来自同一输入", "softmax(QKᵀ/√dₖ)V", "多头关注不同子空间"],
    followUps: ["Self-Attention 的复杂度？如何优化长序列？", "为什么除以 √dₖ？"],
    favorited: false,
  },
  {
    id: "ai-21",
    nodeId: "ai-transformer",
    question: "Transformer 为什么需要位置编码？有哪些方式？",
    answer: `原因：Self-Attention 是排列不变的（对输入顺序无感知），打乱 token 顺序结果不变。但语言有顺序语义，需注入位置信息。

位置编码方式：
1. 正弦/余弦编码（原始 Transformer）：
   PE(pos, 2i) = sin(pos / 10000^(2i/d))
   PE(pos, 2i+1) = cos(pos / 10000^(2i/d))
   - 不同频率的正余弦编码绝对和相对位置。
   - 可外推到更长序列。

2. 可学习位置编码（BERT/GPT）：
   - 每个位置一个可训练向量。
   - 简单但无法外推（超出训练长度失效）。

3. 相对位置编码（T5/Transformer-XL）：
   - 编码 token 间相对距离，泛化更好。

4. RoPE 旋转位置编码（LLaMA）：
   - 通过旋转矩阵在 Q/K 上编码相对位置，兼顾外推和效率，现代 LLM 主流。

\`\`\`
输入 = Token Embedding + Position Encoding（相加）
\`\`\`

关键：位置编码注入序列顺序；RoPE 因外推性好成为 LLM 主流。`,
    keyPoints: ["Attention 排列不变需位置信息", "正余弦可外推/可学习简单/RoPE 主流", "RoPE 编码相对位置外推好"],
    followUps: ["RoPE 的原理？为什么支持外推？", "ALiBi 位置编码如何外推？"],
    favorited: false,
  },
  {
    id: "ai-22",
    nodeId: "ai-transformer",
    question: "BERT 和 GPT 的架构区别？各自适合什么任务？",
    answer: `BERT（Encoder-only，双向）：
- 只用 Transformer Encoder，注意力双向（能看到上下文）。
- 预训练：MLM（掩码语言模型，随机 mask 15% token 预测）+ NSP。
- 适合理解类任务：文本分类、NER、问答、相似度。
- 生成能力弱（非自回归）。

GPT（Decoder-only，单向）：
- 只用 Transformer Decoder，注意力单向（只能看前文，causal mask）。
- 预训练：自回归语言建模（预测下一个 token）。
- 适合生成类任务：对话、续写、翻译、摘要、代码生成。
- 理解任务也能做（通过 prompt）。

架构差异：
- BERT：双向 self-attention，无 causal mask。
- GPT：masked self-attention（下三角），自回归生成。

趋势：GPT 路线（Decoder-only + 自回归）因强大的零样本/少样本能力和可扩展性，成为 LLM 主流（GPT-3/4、LLaMA、Qwen 均为 Decoder-only）。

关键：BERT 双向理解强；GPT 单向生成强 + 通用，Decoder-only 成主流。`,
    keyPoints: ["BERT Encoder 双向理解", "GPT Decoder 单向自回归生成", "Decoder-only 成 LLM 主流"],
    followUps: ["为什么 Decoder-only 成为主流？", "MLM 和自回归预训练的区别？"],
    favorited: false,
  },
  // ===== 大语言模型 =====
  {
    id: "ai-23",
    nodeId: "ai-llm",
    question: "什么是 RAG？相比 Fine-tuning 的优势？RAG 的流程？",
    answer: `RAG（Retrieval-Augmented Generation，检索增强生成）：检索外部知识库 + LLM 生成，解决 LLM 知识过时/幻觉/私有数据问题。

流程：
1. 离线索引：文档切片 → Embedding 模型编码 → 存入向量数据库（FAISS/Milvus/Pinecone）。
2. 在线检索：用户问题 Embedding → 向量库相似度检索 Top-K 片段。
3. 拼接 Prompt：将检索片段 + 问题 + 指令组成 prompt。
4. LLM 生成：基于检索内容回答，标注来源。

\`\`\`
问题 → Embedding → 向量检索 Top-K → [检索片段+问题] → LLM → 答案
\`\`\`

RAG vs Fine-tuning：
- RAG：知识更新快（改库即可）、可溯源、适合事实型问答、无需训练。
- Fine-tuning：改变模型风格/能力、内化领域推理模式、适合格式/语气定制。
- 二者互补：Fine-tune 调能力，RAG 补知识。

优化：重排序（Rerank，如 Cross-Encoder）、查询改写、混合检索（向量+关键词 BM25）、分块策略。

关键：RAG 用外部知识降低幻觉且可溯源；Fine-tune 调能力；二者常结合。`,
    keyPoints: ["检索+生成降低幻觉可溯源", "索引→检索→拼接→生成", "RAG 补知识 / Fine-tune 调能力"],
    followUps: ["如何评估 RAG 系统？", "向量检索和 BM25 关键词检索如何结合？"],
    favorited: false,
  },
  {
    id: "ai-24",
    nodeId: "ai-llm",
    question: "RLHF 的流程？为什么需要 RLHF？LoRA 微调的原理？",
    answer: `RLHF（Reinforcement Learning from Human Feedback）三阶段：
1. SFT（监督微调）：用人工高质量回答微调基座模型。
2. 奖励模型（RM）：人工对模型多个输出排序，训练一个打分模型预测人类偏好。
3. PPO 强化学习：用 RM 的分数作奖励，PPO 算法优化策略模型，让输出更符合人类偏好；加 KL 散度约束防止偏离 SFT 太远。

为什么需要 RLHF：SFT 只学格式，难以对齐人类价值观（有用/无害/诚实）；RLHF 用偏好信号优化，提升回答质量和安全性。DPO 是 RLHF 的简化替代（无需显式 RM，直接用偏好对优化）。

LoRA（Low-Rank Adaptation）：
- 冻结预训练权重 W，旁路低秩矩阵 ΔW = A·B（A∈ℝ^(d×r), B∈ℝ^(r×k), r≪d）。
- 只训练 A、B，参数量从 d×k 降到 (d+k)×r。
- 推理时 W' = W + A·B 可合并，无额外延迟。

\`\`\`python
# PEFT 库
from peft import LoraConfig, get_peft_model
config = LoraConfig(r=8, lora_alpha=16, target_modules=["q_proj","v_proj"])
model = get_peft_model(base_model, config)  # 可训练参数 <1%
\`\`\`

关键：RLHF 对齐人类偏好；LoRA 低秩旁路高效微调，显存友好，是 LLM 微调主流。`,
    keyPoints: ["RLHF: SFT→RM→PPO 对齐偏好", "LoRA 冻结W训低秩A·B", "DPO 免 RM 简化"],
    followUps: ["DPO 相比 PPO 的优势？", "QLoRA 如何进一步省显存？"],
    favorited: false,
  },
  // ===== 计算机视觉 =====
  {
    id: "ai-25",
    nodeId: "ai-cv",
    question: "YOLO 的检测原理？相比两阶段（Faster R-CNN）的优势？",
    answer: `YOLO（You Only Look Once）：单阶段检测，把检测当回归问题，一次前向输出所有框。

原理：
1. 输入图像划分 S×S 网格。
2. 每个网格预测 B 个边界框（x,y,w,h + 置信度）+ C 个类别概率。
3. 输出张量 S×S×(B×5+C)，NMS 去除冗余框。

演进：YOLOv1→v8/v11，anchor-free、解耦头、FPN 多尺度、Mosaic 增强、CIoU 损失等持续优化。

两阶段（Faster R-CNN）：
1. RPN 生成候选区域（Proposal）。
2. 对候选区域分类 + 回归。

对比：
- YOLO：单阶段，速度快（实时），精度略低，适合检测密集/实时场景。
- Faster R-CNN：两阶段，精度高，速度慢，适合高精度要求。

关键：YOLO 用回归思想一次出框，速度优势大；现代 YOLO（v8/v11）精度也接近两阶段。`,
    keyPoints: ["YOLO 单阶段回归一次出框", "网格预测 B 个框 + C 类", "两阶段精度高单阶段速度快"],
    followUps: ["NMS 原理？Soft-NMS 改进？", "Anchor-free 相比 anchor-based 优势？"],
    favorited: false,
  },
  {
    id: "ai-26",
    nodeId: "ai-cv",
    question: "语义分割、实例分割、全景分割的区别？U-Net 的结构特点？",
    answer: `三种分割：
- 语义分割（Semantic）：每个像素分类，同类不区分个体（如所有"车"标同色）。代表：FCN、U-Net、DeepLab。
- 实例分割（Instance）：每个像素分类 + 区分同类不同个体（每辆车不同色）。代表：Mask R-CNN、SOLO。
- 全景分割（Panoramic）：语义 + 实例统一，背景（stuff）语义分割 + 前景（thing）实例分割。代表：Panoptic FPN。

U-Net 结构特点（医学图像经典）：
1. 编码器（下采样）：卷积 + 池化逐层降维，提取特征。
2. 解码器（上采样）：转置卷积/上采样逐层恢复分辨率。
3. 跳跃连接（Skip Connection）：将编码器同层特征拼接到解码器，融合浅层细节与深层语义。
4. 形状对称如"U"，输出与输入同尺寸的分割掩码。

\`\`\`
Encoder(下采样) → 瓶颈 → Decoder(上采样)
    │                          │
    └── Skip Connection ───────┘  (拼接细节)
\`\`\`

关键：U-Net 跳跃连接融合多尺度特征，小数据集医学分割表现好，是分割任务的基础架构。`,
    keyPoints: ["语义/实例/全景三级递进", "U-Net 对称编解码+跳跃连接", "跳跃连接融合细节与语义"],
    followUps: ["DeepLab 的空洞卷积作用？", "Mask R-CNN 如何在检测上加分割？"],
    favorited: false,
  },
  // ===== 推荐系统 =====
  {
    id: "ai-27",
    nodeId: "ai-recsys",
    question: "协同过滤的原理？UserCF 和 ItemCF 区别？矩阵分解如何改进？",
    answer: `协同过滤（CF）：利用群体行为模式推荐，"和你相似的人喜欢什么"或"和你喜欢的物品相似的物品"。

UserCF（基于用户）：
1. 找与目标用户兴趣相似的用户（余弦/皮尔逊相似度）。
2. 推荐相似用户喜欢但目标用户未接触的物品。
3. 适合新闻推荐（兴趣传播，时效性强）。

ItemCF（基于物品）：
1. 计算物品间相似度（共现频次）。
2. 推荐与用户历史物品相似的物品。
3. 适合电商（兴趣稳定，物品关系持久）。

矩阵分解（MF）改进：
- User-Item 评分矩阵稀疏，MF 将其分解为低维用户隐向量 P 和物品隐向量 Q。
- 预测 rûᵢ = pᵤ·qᵢ，降维捕捉潜在因子，泛化更好。
- 加入偏置和隐式反馈（SVD++）。

\`\`\`
R ≈ P · Qᵀ     (m×n) = (m×k)·(k×n)
预测: r̂ = p_u · q_i
\`\`\`

关键：UserCF 适新闻（兴趣传播），ItemCF 适电商（物品稳定）；矩阵分解降维缓解稀疏。`,
    keyPoints: ["UserCF 找相似用户/ItemCF 找相似物品", "MF 分解为隐向量降维", "UserCF 适新闻 ItemCF 适电商"],
    followUps: ["矩阵分解如何训练（ALS/SGD）？", "冷启动怎么解决？"],
    favorited: false,
  },
  {
    id: "ai-28",
    nodeId: "ai-recsys",
    question: "推荐系统的召回-排序架构？Wide&Deep 和 DIN 的思想？",
    answer: `工业推荐系统分阶段（漏斗）：
1. 召回（Retrieval）：从百万级物品快速筛出数百候选（多路召回：协同过滤/向量/标签/热门）。
2. 粗排（Pre-ranking）：轻量模型对数百候选打分，保留数十。
3. 精排（Ranking）：复杂模型对数十候选精准打分排序。
4. 重排（Re-ranking）：考虑多样性/新颖性/业务规则。

Wide & Deep：
- Wide 部分（线性模型）：记忆能力强，捕捉特征交叉（如"男×青年×游戏"高频共现）。
- Deep 部分（MLP）：泛化能力强，对稀疏特征 embedding 后学习非线性。
- 联合训练，兼顾记忆与泛化。

DIN（Deep Interest Network）：
- 用户兴趣多样，不同商品激活不同兴趣。
- 引入注意力机制：候选商品对用户历史行为加权（相关的历史行为权重高）。
- 相比把历史行为 pooling 成定长向量，DIN 动态激活相关兴趣，效果更好。

\`\`\`
DIN: 兴趣向量 = Σ attention(候选物品, 历史行为ᵢ) · 历史行为ᵢ
\`\`\`

关键：召回重速度（多路+向量），精排重精度（深度模型）；Wide&Deep 记忆+泛化；DIN 动态兴趣。`,
    keyPoints: ["召回-粗排-精排-重排漏斗", "Wide&Deep 记忆+泛化", "DIN 注意力激活用户兴趣"],
    followUps: ["多路召回如何融合？", "如何提升推荐多样性？"],
    favorited: false,
  },
  // ===== 机器学习基础（补充） =====
  {
    id: "ai-29",
    nodeId: "ai-ml-basic",
    question: "什么是特征工程？数值特征和类别特征分别如何处理？",
    answer: `特征工程：从原始数据构造/转换特征让模型更易学到规律，"数据和特征决定上限，模型只是逼近上限"。

数值特征处理：
1. 缺失值：删除 / 填充（均值、中位数、众数、模型预测）。
2. 缩放：标准化 (x-μ)/σ、归一化 (x-min)/(max-min)。线性/距离类模型（KNN/SVM/逻辑回归）必需；树模型只需排序不敏感。
3. 分箱：连续值离散化（等频/等宽/卡方），引入非线性。
4. 对数变换：右偏分布 log(1+x)，让分布更接近正态。

类别特征处理：
1. One-Hot：无序类别，高基数易维度爆炸。
2. Label/Ordinal Encoding：有序类别。
3. Target Encoding：用目标均值编码，需在交叉验证内部计算防泄露。
4. Embedding：高基数类别（如商品 ID）。

特征选择：过滤法（方差/相关系数）、包裹法（递归特征消除 RFE）、嵌入法（L1/树重要性）。

\`\`\`python
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
num_pipe = Pipeline([("imp", SimpleImputer(strategy="median")),
                     ("sc", StandardScaler())])
cat_pipe = Pipeline([("imp", SimpleImputer(strategy="most_frequent")),
                     ("oh", OneHotEncoder(handle_unknown="ignore"))])
\`\`\`

关键：树模型对单调变换不敏感，线性/距离类模型对缩放敏感；Target Encoding 必须在交叉验证内部做防泄露。`,
    keyPoints: ["数值缩放对距离/线性模型必需，树模型不需要", "高基数类别用 Target/Embedding", "特征选择防维度灾难"],
    followUps: ["特征交叉如何避免组合爆炸？", "Target Encoding 如何防数据泄露？"],
    favorited: false,
  },
  {
    id: "ai-30",
    nodeId: "ai-ml-basic",
    question: "类别不平衡（如正样本仅 1%）如何处理？各方法优缺点？",
    answer: `类别不平衡时准确率虚高（全预测负类也有 99%），需特殊处理。

处理方法：
1. 重采样：过采样少数类（SMOTE 合成新样本，可能过拟合）；欠采样多数类（简单但丢信息）；组合 SMOTE + Tomek Links。
2. 类权重（class_weight）：损失中少数类加权，等价调整决策阈值，不丢数据。
3. 阈值调整：默认 0.5 不优，按 F1/PR 曲线选最优阈值。
4. Focal Loss：-α(1-p)^γ log(p)，降低易分样本权重聚焦难分（检测任务常用）。
5. 评估指标：用 PR-AUC/F1/Recall，不用 Accuracy。
6. 集成方法：BalancedRandomForest / EasyEnsemble。

\`\`\`python
from sklearn.utils.class_weight import compute_class_weight
from sklearn.ensemble import RandomForestClassifier
import numpy as np
weights = compute_class_weight("balanced", classes=np.unique(y), y=y)
rf = RandomForestClassifier(class_weight="balanced", n_estimators=200)
# SMOTE 合成少数类
from imblearn.over_sampling import SMOTE
X_res, y_res = SMOTE(random_state=42).fit_resample(X, y)
\`\`\`

关键：先看 Recall/PR-AUC；类权重最简不丢数据，SMOTE 合成少数类，Focal Loss 聚焦难样本。`,
    keyPoints: ["重采样/类权重/阈值调整/Focal Loss", "评估用 PR-AUC+F1 不用 Accuracy", "SMOTE 合成样本防过拟合"],
    followUps: ["Focal Loss 的 α 和 γ 如何调？", "为什么 AUC 在极度不平衡时也可能高估？"],
    favorited: false,
  },
  {
    id: "ai-31",
    nodeId: "ai-ml-basic",
    question: "多分类评估指标？宏平均（Macro）和微平均（Micro）的区别？",
    answer: `多分类把每个类分别视为正类计算 P/R/F1 再聚合。

- 宏平均（Macro）：各类指标算术平均，每类等权，关注小类。Macro-F1 = (F1₁+...+F1ₖ)/K。
- 微平均（Micro）：先汇总所有类的 TP/FP/FN 再算，每样本等权，由大类主导。Micro-P = ΣTP/(ΣTP+ΣFP)。
- 加权平均（Weighted）：按各类样本数加权平均。

选择：
- 不平衡且关注小类 → Macro（小类差会拉低分数）。
- 整体表现/以大类为主 → Micro。
- 大多数多分类报告 Macro-F1 更能反映"每类都做好"。

其他指标：混淆矩阵看类间混淆；Top-k 准确率（ImageNet 用 Top-5）；Cohen's Kappa 考虑随机一致性。

\`\`\`python
from sklearn.metrics import classification_report, f1_score
print(classification_report(y_true, y_pred, digits=4))
macro_f1 = f1_score(y_true, y_pred, average="macro")
micro_f1 = f1_score(y_true, y_pred, average="micro")
weighted_f1 = f1_score(y_true, y_pred, average="weighted")
\`\`\`

关键：Macro 类等权关注小类，Micro 样本等权大类主导；多分类看 Macro-F1 + 混淆矩阵。`,
    keyPoints: ["Macro 类等权关注小类", "Micro 样本等权大类主导", "多分类看 Macro-F1 + 混淆矩阵"],
    followUps: ["多标签分类如何评估？", "Top-k 准确率什么时候用？"],
    favorited: false,
  },
  // ===== 线性回归与逻辑回归（补充） =====
  {
    id: "ai-32",
    nodeId: "ai-linear-logistic",
    question: "逻辑回归如何做多分类？OvR 和 Softmax 回归的区别？",
    answer: `逻辑回归原生二分类，多分类两种方案：

1. OvR（One-vs-Rest）：训练 K 个二分类器，第 i 个区分"类 i vs 其他"，预测取置信度最高。简单高效，适合类多；缺点是类别不平衡放大、分类器不协调。

2. Softmax 回归（Multinomial Logistic）：直接建模多类概率 pᵢ = exp(zᵢ)/Σⱼ exp(zⱼ)，损失为交叉熵 L = -Σ yᵢ log(pᵢ)。所有类联合优化，概率和为 1，适合类间互斥任务。

3. OvO（One-vs-One）：每两类训一个分类器，K(K-1)/2 个，投票决定。适合 SVM 等不易扩展的模型。

\`\`\`python
from sklearn.linear_model import LogisticRegression
# OvR
clf_ovr = LogisticRegression(multi_class="ovr", solver="liblinear")
# Softmax（multinomial）
clf_softmax = LogisticRegression(multi_class="multinomial", solver="lbfgs")
clf_softmax.fit(X, y)  # 类别互斥时优先
\`\`\`

关键：类别互斥用 Softmax（联合优化）；类多且稀疏用 OvR（高效）。`,
    keyPoints: ["OvR 训 K 个二分类器取最大置信", "Softmax 联合优化概率和为1", "互斥用 Softmax / 类多用 OvR"],
    followUps: ["Softmax 和 Sigmoid 的关系？", "为什么 Softmax 用交叉熵而不是 MSE？"],
    favorited: false,
  },
  {
    id: "ai-33",
    nodeId: "ai-linear-logistic",
    question: "SGD、Momentum、RMSProp、Adam 优化器的演进与区别？",
    answer: `优化器围绕"方向（一阶动量）+ 步长（二阶动量）"两路改进。

1. SGD：θ -= η·g。简单但震荡、易卡局部最优、对学习率敏感。
2. Momentum：v = βv + g；θ -= η·v。累积历史梯度方向，加速收敛、抑制震荡。
3. Nesterov：先按动量前瞻一步再算梯度，比 Momentum 收敛更快。
4. AdaGrad：累积梯度平方和 η/√(Σg²)，稀疏特征友好，但分母单调增→后期步长趋零。
5. RMSProp：v = βv + (1-β)g²；用指数移动平均替代累加，解决 AdaGrad 后期步长过小。
6. Adam：一阶动量 m（Momentum）+ 二阶动量 v（RMSProp）+ 偏差修正。

\`\`\`python
# Adam 等价更新
m = beta1 * m + (1 - beta1) * g          # 一阶动量
v = beta2 * v + (1 - beta2) * g * g       # 二阶动量
m_hat = m / (1 - beta1 ** t)              # 偏差修正
v_hat = v / (1 - beta2 ** t)
theta -= lr * m_hat / (sqrt(v_hat) + eps)
\`\`\`

经验：稀疏数据/NLP/Embedding → Adam；CV 大批训练 → SGD+Momentum 泛化更好；Transformer/LLM → AdamW（解耦权重衰减）。

关键：Momentum 加速方向，RMSProp 自适应步长，Adam = 两者合体；AdamW 适合 Transformer。`,
    keyPoints: ["Momentum 累积方向 / RMSProp 自适应步长", "Adam = 一阶+二阶+偏差修正", "AdamW 解耦权重衰减"],
    followUps: ["为什么 Adam 泛化有时不如 SGD+Momentum？", "AdamW 解耦权重衰减的原理？"],
    favorited: false,
  },
  {
    id: "ai-34",
    nodeId: "ai-linear-logistic",
    question: "学习率调度策略有哪些？warmup 为什么对训练重要？",
    answer: `固定学习率难以兼顾收敛速度和最终精度，调度策略动态调整。

常见策略：
1. Step Decay：每 N 个 epoch 衰减 γ 倍（如每 30 epoch ×0.1）。
2. Exponential：η_t = η₀·γ^t。
3. Cosine Annealing：η_t = η_min + 0.5(η₀-η_min)(1+cos(πt/T))。平滑下降，CV/Transformer 常用。
4. OneCycle：先 warmup 升到 max_lr，再 cosine 降到 min_lr。超参少效果稳。
5. ReduceLROnPlateau：监控验证指标，平台期自动降学习率。
6. Warmup：前 N 步线性升学习率（0→η₀），再按上述策略衰减。

为什么 warmup 重要：
- 训练初期权重随机，大学习率会让参数剧烈震荡甚至发散（尤其 Adam 早期二阶矩未稳）。
- warmup 让优化器先"热身"建立稳定的动量估计，再加大步长，再衰减精调。
- 大 batch / 大模型训练 warmup 几乎是标配。

\`\`\`python
import torch
from torch.optim.lr_scheduler import CosineAnnealingLR, LinearLR
optim = torch.optim.AdamW(model.parameters(), lr=3e-4)
warmup = LinearLR(optim, start_factor=0.1, total_iters=500)
cosine = CosineAnnealingLR(optim, T_max=total_steps - 500)
scheduler = torch.optim.lr_scheduler.SequentialLR(
    optim, schedulers=[warmup, cosine], milestones=[500])
\`\`\`

关键：warmup 防初期发散 + cosine 平滑衰减是现代深度学习默认配方。`,
    keyPoints: ["Cosine/OneCycle/Step/Plateau 调度", "warmup 防初期发散建稳定动量", "大 batch 大模型 warmup 必备"],
    followUps: ["OneCycle 超参如何选？", "为什么大 batch 需要更长 warmup？"],
    favorited: false,
  },
  {
    id: "ai-35",
    nodeId: "ai-linear-logistic",
    question: "什么是早停（Early Stopping）？如何设置才不会过早停止？",
    answer: `早停：监控验证集指标，连续若干轮不提升就停止训练，防止过拟合，把训练轮数当正则化超参。

机制：每 epoch 在验证集评估 → 记录最优指标 → 当前未超最优+min_delta 则 patience_count++ → 达到 patience 阈值停止 → 回滚到最优权重。

关键超参：
- patience：容忍多少轮不提升，太小过早停止，太大浪费算力。常见 5-20。
- min_delta：判定"提升"的最小幅度，过滤噪声。
- 监控指标：val_loss vs val_metric（业务指标）。

避免过早停止：
- 用移动平均/平滑后的指标判断，避免单轮抖动。
- patience 设大些（10-20），尤其学习率衰减后波动小。
- 配合学习率调度：loss 平台时先降学习率而非直接停。
- restore_best_weights=True 保证拿最优而非最后一轮。

\`\`\`python
from tensorflow.keras.callbacks import EarlyStopping
es = EarlyStopping(monitor="val_loss", patience=10,
                   min_delta=1e-4, restore_best_weights=True)
model.fit(X, y, validation_split=0.2, callbacks=[es], epochs=200)
# PyTorch 手动：best_state = copy.deepcopy(model.state_dict())
\`\`\`

关键：早停 = 训练轮数即正则；patience + min_delta + restore_best_weights 三要素防过早停止。`,
    keyPoints: ["验证指标连续 patience 轮不提升即停", "min_delta 过滤噪声", "restore_best_weights 取最优权重"],
    followUps: ["早停和 L2 正则等价吗？", "patience 设多大合适？"],
    favorited: false,
  },
  // ===== 决策树与随机森林（补充） =====
  {
    id: "ai-36",
    nodeId: "ai-tree-rf",
    question: "随机森林的特征重要性如何计算？为什么会有偏差？",
    answer: `随机森林提供两种特征重要性：

1. MDI（Mean Decrease Impurity，基尼重要性）：每个节点分裂带来的不纯度下降（基尼/熵）×该节点样本占比，累加到分裂特征，所有树平均归一化。缺点：偏向高基数特征（连续值/类别多），可能给"无用但取值多"的特征高重要性；相关特征平分重要性。

2. MDA（Permutation Importance，排列重要性）：训练后在验证集打乱某特征，看指标下降多少。模型无关、无高基数偏差，但相关特征互相替代时会低估。

\`\`\`python
from sklearn.ensemble import RandomForestClassifier
from sklearn.inspection import permutation_importance
rf = RandomForestClassifier(n_estimators=200, random_state=0).fit(X, y)
print(rf.feature_importances_)  # MDI
result = permutation_importance(rf, X_val, y_val, n_repeats=10, random_state=0)
print(result.importances_mean)  # MDA
\`\`\`

SHAP 值：基于博弈论 Shapley 值，提供每个样本每特征的贡献，最严谨但计算贵。

关键：MDI 偏高基数特征，MDA 模型无关更稳；SHAP 最严谨但贵。`,
    keyPoints: ["MDI 偏高基数特征", "MDA 打乱特征看指标下降", "SHAP 基于 Shapley 值最严谨"],
    followUps: ["SHAP 和 LIME 区别？", "相关特征会让重要性低估吗？"],
    favorited: false,
  },
  {
    id: "ai-37",
    nodeId: "ai-tree-rf",
    question: "GBDT、XGBoost、LightGBM 三者区别？各自的核心改进？",
    answer: `三者都是梯度提升决策树（Boosting），后一版在前一版上改进。

GBDT（基础版）：
- 拟合负梯度（残差）串联加树，CART 回归树。
- 缺点：串行训练慢、对缺失值/类别特征处理弱。

XGBoost 改进：
1. 目标函数二阶泰勒展开（用一阶+二阶梯度），收敛更快更准。
2. 正则化项（叶子数 + L2）控制复杂度。
3. 支持特征抽样、列采样、行采样。
4. 缺失值自动学默认方向。
5. 直方图近似分裂算法加速。
6. 并行化（特征粒度）。

LightGBM 改进：
1. Leaf-wise 生长（按叶子增益最大分裂）vs XGBoost 的 level-wise，深但易过拟合需限 max_depth。
2. GOSS（基于梯度的单侧采样）：保留梯度大的样本。
3. EFB（互斥特征捆绑）：把稀疏互斥特征捆绑降维。
4. 直方图算法 + 类别特征原生支持，速度极快、内存省。

\`\`\`bash
# XGBoost 与 LightGBM 训练速度对比（同样数据 LightGBM 常快 3-5 倍）
pip install xgboost lightgbm
\`\`\`

CatBoost：类别特征原生处理（Target Statistics + 排序提升防泄露），有序提升防预测偏移，对类别特征丰富数据效果好。

关键：XGBoost 二阶导+正则+并行；LightGBM leaf-wise+GOSS+EFB 极速；CatBoost 类别特征强。`,
    keyPoints: ["XGBoost 二阶导+正则+并行", "LightGBM leaf-wise+GOSS+EFB 极速", "CatBoost 类别特征原生处理"],
    followUps: ["leaf-wise 为什么易过拟合？", "直方图算法如何加速分裂？"],
    favorited: false,
  },
  {
    id: "ai-38",
    nodeId: "ai-tree-rf",
    question: "决策树如何剪枝？预剪枝和后剪枝的区别？",
    answer: `剪枝防止决策树过深过拟合。

预剪枝（Pre-pruning，生成时限制）：
- max_depth：限制最大深度。
- min_samples_split：节点继续分裂所需最小样本数。
- min_samples_leaf：叶子节点最小样本数。
- max_leaf_nodes：最大叶子数。
- min_impurity_decrease：分裂需带来的最小不纯度下降。
- 优点：快、防过深；缺点：可能欠拟合（贪心提前停止，错过后续有益分裂）。

后剪枝（Post-pruning，生成后回溯剪）：
- 先让树充分生长，再自底向上评估：剪掉某子树后验证集误差是否下降，下降则用叶子替换子树。
- CCP（Cost-Complexity Pruning，CART 用）：引入复杂度惩罚 α，找最优子树。
- REP（Reduced Error Pruning）：用验证集剪。
- 优点：保留更多结构不易欠拟合；缺点：训练成本高。

\`\`\`python
from sklearn.tree import DecisionTreeClassifier
# 预剪枝
clf = DecisionTreeClassifier(max_depth=5, min_samples_leaf=20,
                             min_impurity_decrease=1e-4, ccp_alpha=0.01)
clf.fit(X_train, y_train)  # ccp_alpha 控制后剪枝强度
\`\`\`

关键：预剪枝快但可能欠拟合，后剪枝稳但贵；sklearn 用 ccp_alpha 实现 CCP 后剪枝。`,
    keyPoints: ["预剪枝生成时限深/限样本", "后剪枝生成后回溯用叶子替子树", "ccp_alpha 控制 CCP 后剪枝"],
    followUps: ["ccp_alpha 如何选择？", "为什么后剪枝通常比预剪枝效果好？"],
    favorited: false,
  },
  {
    id: "ai-39",
    nodeId: "ai-tree-rf",
    question: "CatBoost 如何处理类别特征？相比普通 One-Hot 的优势？",
    answer: `CatBoost（Categorical Boosting）：Yandex 开源，对类别特征原生支持。

类别特征处理（Target Statistics + 排序）：
1. 普通 One-Hot：高基数类别（如城市/商品 ID）会维度爆炸、稀疏、树分裂低效。
2. CatBoost 用 Target Statistics：把类别值替换为目标均值编码，但朴素编码会泄露标签。
3. 有序 Target Statistics（Ordered TS）：对每个样本，只用它之前（按随机排列）的样本算目标均值，避免标签泄露和预测偏移。
4. 组合特征：自动构造类别特征组合（如"城市×品类"），捕捉交互。

Ordered Boosting：训练时每棵树只用"之前"样本算梯度，等价于无偏的提升，减少预测偏移。

对称树：CatBoost 用对称（oblivious）树，同层所有节点用同一分裂条件，推理快、抗过拟合。

\`\`\`python
from catboost import CatBoostClassifier, Pool
train_pool = Pool(X_train, y_train, cat_features=["city", "device"])
model = CatBoostClassifier(iterations=1000, depth=6, learning_rate=0.05,
                           eval_metric="AUC", random_seed=42)
model.fit(train_pool, eval_set=val_pool, early_stopping_rounds=50)
\`\`\`

关键：CatBoost 有序 Target Statistics 防泄露 + Ordered Boosting 防偏移 + 对称树快，类别特征丰富时优势明显。`,
    keyPoints: ["有序 Target Statistics 防标签泄露", "Ordered Boosting 防预测偏移", "对称树推理快抗过拟合"],
    followUps: ["Ordered TS 为什么能防泄露？", "对称树和普通 CART 树区别？"],
    favorited: false,
  },
  // ===== 支持向量机（补充） =====
  {
    id: "ai-40",
    nodeId: "ai-svm",
    question: "如何选择 SVM 的核函数？线性核、RBF 核、多项式核适用场景？",
    answer: `核函数选择经验：

1. 线性核 K(x,z)=x·z：特征数远大于样本数（如文本高维稀疏）时优先，无需升维，速度快，泛化好。
2. RBF 核 K=exp(-γ||x-z||²)：最通用，适合样本数中等、非线性边界；γ 控制影响范围。γ 大→只近样本影响→易过拟合；γ 小→远样本也影响→平滑可能欠拟合。
3. 多项式核 K=(γx·z+r)^d：适合特征间有明显交互；高次易数值不稳定，一般 d≤3。

选择流程：
- 先试线性核（快、可解释），作为基线。
- 再试 RBF 核，网格搜索 C 和 γ。
- 特征数 >> 样本数用线性；样本数 >> 特征数且非线性用 RBF。
- 文本/基因等高维稀疏数据线性核常胜出。

参数：C（惩罚系数）权衡间隔与错分，C 大→过拟合，C 小→欠拟合；γ 与 C 常联合网格搜索（对数尺度）。

\`\`\`python
from sklearn.svm import SVC
from sklearn.model_selection import GridSearchCV
param_grid = {"C": [0.1, 1, 10, 100],
              "gamma": [1e-3, 1e-2, 1e-1, 1, "scale", "auto"]}
grid = GridSearchCV(SVC(kernel="rbf"), param_grid, cv=5, scoring="f1")
grid.fit(X, y)
\`\`\`

关键：先线性核基线，再 RBF 网格搜索 C/γ；高维稀疏用线性，非线性用 RBF。`,
    keyPoints: ["高维稀疏用线性核", "RBF 最通用 γ 控制影响范围", "C/γ 对数网格搜索"],
    followUps: ["RBF 的 γ 和 C 如何互相影响？", "核函数如何自定义？"],
    favorited: false,
  },
  {
    id: "ai-41",
    nodeId: "ai-svm",
    question: "SVM 如何做多分类？OvR 和 OvO 哪个更适合 SVM？",
    answer: `SVM 原生二分类，多分类用分解策略：

1. OvR（One-vs-Rest）：训 K 个 SVM，每个区分"类 i vs 其余"，预测取决策值最大。需训 K 个模型。

2. OvO（One-vs-One）：每两类训一个 SVM，共 K(K-1)/2 个，预测时投票（Max Wins）。需训 K(K-1)/2 个模型，但每个只在小子集上训练。

为什么 SVM 常用 OvO：
- SVM 训练复杂度约 O(n²)~O(n³)，样本数大时极慢。
- OvO 每个分类器只在 2 类子集训练（样本少），单次快；OvR 要在全量上训，慢。
- 类别数 K 不大时，K(K-1)/2 个小模型总开销仍低于 K 个全量大模型。
- libsvm 默认 OvO。

DAG-SVM：OvO 的优化，用有向无环图把 K(K-1)/2 次决策减到 K-1 次。

\`\`\`python
from sklearn.svm import SVC
from sklearn.multiclass import OneVsOneClassifier, OneVsRestClassifier
base = SVC(kernel="rbf", C=1.0, gamma="scale", decision_function_shape="ovo")
ovo = OneVsOneClassifier(base)   # OvO
ovr = OneVsRestClassifier(base)  # OvR
ovo.fit(X, y)
\`\`\`

关键：SVM 训练复杂度高，OvO 每个子分类器样本少总开销低，libsvm 默认 OvO。`,
    keyPoints: ["OvR 训 K 个全量模型", "OvO 训 K(K-1)/2 个小子集模型", "SVM 因复杂度高常选 OvO"],
    followUps: ["OvO 投票平票怎么办？", "DAG-SVM 如何加速？"],
    favorited: false,
  },
  {
    id: "ai-42",
    nodeId: "ai-svm",
    question: "SVM 和逻辑回归（LR）的区别？什么场景选哪个？",
    answer: `两者都是线性分类器（SVM 用核可非线性），但优化目标不同。

差异：
1. 损失函数：
   - LR：对数损失（交叉熵），最大化似然，输出概率。
   - SVM：hinge loss，最大化间隔，输出决策值（非概率）。
2. 决策边界：
   - SVM 只由支持向量决定，边界附近的点影响大，对远点不敏感，鲁棒。
   - LR 所有样本都影响（梯度按概率差），远点也参与，对异常点更敏感。
3. 概率输出：LR 天然输出概率；SVM 需 Platt scaling 后处理转概率。
4. 核技巧：SVM 易扩展核函数处理非线性；LR 核化也可但不如 SVM 常用。

场景选择：
- 线性可分、需要概率和可解释性 → LR（快、稳、可解释）。
- 高维稀疏（文本）→ 线性 SVM 或 LR 都行，LR 更易工程化。
- 中小样本非线性 → RBF 核 SVM。
- 大数据 → LR/线性 SVM（线性核 SVM 等价近 LR）；树模型/XGBoost 更常用。
- 类别不平衡 → LR 用 class_weight 更自然。

\`\`\`python
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
lr = LogisticRegression(C=1.0, class_weight="balanced")
svm = SVC(kernel="rbf", C=1.0, gamma="scale", probability=True)  # probability 输出概率
\`\`\`

关键：SVM 关注间隔和支持向量（小样本鲁棒），LR 关注全样本概率（可解释、大样本工程化）。`,
    keyPoints: ["SVM hinge loss 最大化间隔", "LR 交叉熵输出概率", "小样本非线性用 SVM / 大样本概率用 LR"],
    followUps: ["hinge loss 和 log loss 形状区别？", "为什么 SVM 对异常点更鲁棒？"],
    favorited: false,
  },
  {
    id: "ai-43",
    nodeId: "ai-svm",
    question: "SVR（支持向量回归）的原理？ε-不敏感损失是什么？SVM 主要参数如何调优？",
    answer: `SVR（Support Vector Regression）：把 SVM 思想用于回归。

原理：找一个超平面 f(x)=w·x+b，让预测值与真实值差距不超过 ε（容忍带），同时最大化"间隔"（最小化 ||w||²）。带内样本不产生损失。

ε-不敏感损失：L(y, f(x)) = max(0, |y - f(x)| - ε)。
- 预测误差 < ε：损失为 0（带内）。
- 误差 > ε：线性损失（带外，类似 hinge）。
- ε 大→容忍多→支持向量少→平滑但可能欠拟合；ε 小→严格→易过拟合。

软间隔：引入松弛变量 ξ，允许部分样本超出 ε 带，目标 min 1/2||w||² + C·Σξ。

参数调优（SVM/SVR 通用）：
1. C（惩罚系数）：权衡间隔与误差。C 大→过拟合；C 小→欠拟合。
2. γ（RBF 核）：γ 大→过拟合；γ 小→欠拟合。
3. ε（SVR 专有）：控制容忍带宽度。
4. 调参策略：C 和 γ 用对数网格搜索（如 C∈{0.1,1,10,100}, γ∈{0.001,0.01,0.1,1}），交叉验证。

\`\`\`python
from sklearn.svm import SVR
from sklearn.model_selection import GridSearchCV
param_grid = {"C": [0.1, 1, 10, 100],
              "gamma": ["scale", 0.001, 0.01, 0.1, 1],
              "epsilon": [0.01, 0.1, 0.5]}
grid = GridSearchCV(SVR(kernel="rbf"), param_grid, cv=5, scoring="neg_mean_squared_error")
grid.fit(X, y)
\`\`\`

关键：SVR 用 ε-不敏感损失只惩罚带外样本；C/γ/ε 三参数对数网格搜索调优。`,
    keyPoints: ["ε-不敏感损失只惩罚带外样本", "C 权衡间隔与误差", "C/γ/ε 对数网格搜索"],
    followUps: ["ε 如何选择？", "SVR 和岭回归的区别？"],
    favorited: false,
  },
  // ===== 神经网络基础（补充） =====
  {
    id: "ai-44",
    nodeId: "ai-nn-basic",
    question: "神经网络为什么要做权重初始化？Xavier 和 He 初始化的区别？",
    answer: `权重初始化决定训练能否启动：全零初始化会让同层神经元对称（学到相同特征、梯度相同、永远一样），无法学习。

好的初始化目标：前向传播时各层激活值方差稳定（不爆炸/消失），反向传播时各层梯度方差稳定。

1. Xavier（Glorot）初始化（适合 tanh/sigmoid）：
   - Var(W) = 1/n_in（或 2/(n_in+n_out)）。
   - 假设激活函数线性且零均值（tanh 接近），让前向方差不变。
   - sigmoid 饱和区问题没完全解决（非零均值）。

2. He（Kaiming）初始化（适合 ReLU 系列）：
   - Var(W) = 2/n_in。
   - ReLU 把负值归零，方差减半，所以 He 比 Xavier 大 √2 倍补偿，让 ReLU 后方差稳定。

3. LeCun 初始化（适合 SELU）：Var(W)=1/n_in，配合自归一化网络。

经验：ReLU 用 He，tanh 用 Xavier；批量归一化（BN）能放宽对初始化的依赖。

\`\`\`python
import torch.nn as nn
# He 初始化（ReLU）
layer = nn.Linear(256, 128)
nn.init.kaiming_normal_(layer.weight, mode="fan_in", nonlinearity="relu")
nn.init.zeros_(layer.bias)
# Xavier 初始化（tanh）
nn.init.xavier_uniform_(layer.weight)
\`\`\`

关键：全零初始化致对称性破坏；ReLU 用 He（2/n_in），tanh 用 Xavier；BN 放宽初始化依赖。`,
    keyPoints: ["全零初始化致对称性无法学习", "He 初始化适合 ReLU", "Xavier 适合 tanh/sigmoid"],
    followUps: ["为什么 ReLU 需要更大的初始化方差？", "BN 如何放宽初始化要求？"],
    favorited: false,
  },
  {
    id: "ai-45",
    nodeId: "ai-nn-basic",
    question: "批归一化（BatchNorm）的原理？训练和推理时有什么不同？",
    answer: `BatchNorm（BN）：在每个 mini-batch 内对每层激活做归一化（减均值除标准差），再用可学习的 γ、β 缩放平移，稳定训练、加速收敛、放宽初始化要求。

公式：
- 训练：μ_B, σ_B 为当前 batch 统计；x̂ = (x-μ_B)/√(σ_B²+ε)；y = γ·x̂ + β。
- 同时用滑动平均累积 running_mean、running_var。

训练 vs 推理：
- 训练：用当前 batch 的均值/方差（batch 依赖）。
- 推理：用训练阶段累积的 running_mean/running_var（固定），与单样本无关，保证推理稳定。

作用：
1. 缓解内部协变量偏移（ICS），让每层输入分布稳定。
2. 平滑损失曲面，可用更大学习率、收敛更快。
3. 一定正则化效果（batch 内统计引入噪声）。
4. 放宽对初始化的依赖。

陷阱：
- batch 太小时统计不准，BN 效果差（用 GroupNorm/LayerNorm 替代）。
- 训练/推理模式必须正确切换（model.train() / model.eval()），否则推理用 batch 统计会出错。
- RNN/序列模型用 LayerNorm 更合适。

\`\`\`python
import torch.nn as nn
model = nn.Sequential(
    nn.Linear(784, 256), nn.BatchNorm1d(256), nn.ReLU(),
    nn.Linear(256, 10))
model.train()  # 训练用 batch 统计
model.eval()   # 推理用 running 统计
\`\`\`

关键：BN 用 batch 统计归一化+可学习仿射；训练用 batch 统计，推理用累积 running 统计，需正确切换模式。`,
    keyPoints: ["batch 内归一化 + γ/β 仿射", "训练用 batch 统计推理用 running", "放宽初始化加速收敛"],
    followUps: ["BN 和 LayerNorm 的区别？", "为什么 batch 小时 BN 效果差？"],
    favorited: false,
  },
  {
    id: "ai-46",
    nodeId: "ai-nn-basic",
    question: "Dropout 的原理？训练和推理有什么不同？为什么能防过拟合？",
    answer: `Dropout：训练时按概率 p 随机将神经元置零（连同输出），推理时不丢弃但缩放输出。

机制：
- 训练：每个神经元以概率 p 被 drop（输出置 0），存活神经元输出乘 1/(1-p) 缩放（inverted dropout，使推理无需缩放）。
- 推理：所有神经元参与，不 drop，不缩放。

为什么防过拟合：
1. 相当于每次训练一个不同子网络，集成效果（模型平均）。
2. 阻止神经元共适应（co-adaptation），不让某些神经元过度依赖其他神经元，强制学鲁棒特征。
3. 增加噪声，等价于正则化。

常见设置：
- 全连接层 p=0.5（经典）。
- 卷积层 p=0.1~0.3（特征空间相关性强，drop 太多伤性能），或用 Spatial Dropout 整个通道 drop。
- 推理时用 Monte Carlo Dropout（多次随机推理取平均）可估计不确定性。

\`\`\`python
import torch.nn as nn
net = nn.Sequential(
    nn.Linear(784, 512), nn.ReLU(), nn.Dropout(0.5),
    nn.Linear(512, 256), nn.ReLU(), nn.Dropout(0.3),
    nn.Linear(256, 10))
net.train()  # 训练时启用 dropout
net.eval()   # 推理时关闭 dropout
\`\`\`

关键：Dropout 训练随机置零 + 缩放（inverted dropout），推理不 drop；防过拟合靠子网络集成与去共适应。`,
    keyPoints: ["训练随机 drop + 缩放", "推理不 drop（inverted dropout）", "子网络集成 + 去共适应防过拟合"],
    followUps: ["Dropout 和 BN 一起用要注意什么？", "Spatial Dropout 和普通 Dropout 区别？"],
    favorited: false,
  },
  // ===== 深度学习框架（补充） =====
  {
    id: "ai-47",
    nodeId: "ai-dl-framework",
    question: "PyTorch 中如何自定义 nn.Module？前向传播和参数管理？",
    answer: `nn.Module 是 PyTorch 所有模型/层的基类，提供参数管理、子模块注册、autograd 钩子、设备迁移、保存加载等。

自定义模型步骤：
1. 继承 nn.Module。
2. __init__ 中定义子层（赋值给 self 自动注册参数）。
3. forward 中实现前向传播（可用 Python 控制流）。
4. 无需手写反向传播，autograd 自动完成。

参数管理：
- self.parameters() 返回所有可学习参数（递归子模块）。
- self.named_parameters() 返回 (名字, 参数)。
- nn.Parameter() 把张量标记为可学习。
- .to(device) / .cuda() 迁移设备。
- .train() / .eval() 切换模式（影响 BN/Dropout）。

\`\`\`python
import torch
import torch.nn as nn
class MLP(nn.Module):
    def __init__(self, in_dim, hidden, n_classes):
        super().__init__()
        self.fc1 = nn.Linear(in_dim, hidden)
        self.bn = nn.BatchNorm1d(hidden)
        self.act = nn.ReLU()
        self.drop = nn.Dropout(0.5)
        self.fc2 = nn.Linear(hidden, n_classes)
    def forward(self, x):
        x = self.drop(self.act(self.bn(self.fc1(x))))
        return self.fc2(x)
model = MLP(784, 256, 10).cuda()
opt = torch.optim.AdamW(model.parameters(), lr=1e-3)
\`\`\`

关键：nn.Module 自动注册子层和参数；forward 写前向，autograd 自动反向；parameters() 统一管理。`,
    keyPoints: ["继承 nn.Module + __init__ 定义层", "forward 实现前向 autograd 自动反向", "parameters() 自动递归收集"],
    followUps: ["nn.Sequential 和自定义 Module 区别？", "如何冻结部分层？"],
    favorited: false,
  },
  {
    id: "ai-48",
    nodeId: "ai-dl-framework",
    question: "TensorFlow Keras 的 Sequential 和函数式 API 区别？如何选择？",
    answer: `Keras 提供三种建模型方式：

1. Sequential API：
   - 层线性堆叠，单输入单输出，简单直观。
   - 不支持多输入/输出、分支、跳连。
   \`\`\`python
   from tensorflow.keras import Sequential
   from tensorflow.keras.layers import Dense, ReLU
   model = Sequential([Dense(256, input_shape=(784,)), ReLU(), Dense(10)])
   \`\`\`

2. 函数式 API（Functional）：
   - 用张量作为层的"输入输出"，可建任意 DAG 结构：多输入/输出、残差连接、共享层。
   - 灵活且仍高层易用，最常用。
   \`\`\`python
   from tensorflow.keras import Input, Model
   from tensorflow.keras.layers import Dense, Add
   x_in = Input(shape=(784,))
   h = Dense(256, activation="relu")(x_in)
   h = Dense(256)(h)
   res = Add()([h, Dense(256)(x_in)])   # 残差连接
   out = Dense(10)(res)
   model = Model(x_in, out)
   \`\`\`

3. 子类化 Model（subclassing）：类似 PyTorch nn.Module，最大灵活性，可写动态控制流，但调试和序列化稍复杂。

选择：
- 简单线性 → Sequential。
- 多输入/输出、跳连、共享层 → 函数式（首选）。
- 动态控制流/复杂研究 → 子类化。

关键：Sequential 简单线性，函数式支持任意拓扑（多入多出/跳连/共享），子类化最灵活。`,
    keyPoints: ["Sequential 线性堆叠", "函数式支持多入多出/跳连/共享层", "子类化最灵活可写控制流"],
    followUps: ["函数式 API 如何共享层？", "Keras 子类化和 PyTorch Module 区别？"],
    favorited: false,
  },
  {
    id: "ai-49",
    nodeId: "ai-dl-framework",
    question: "PyTorch 中如何使用 GPU 和分布式训练？DataParallel 和 DDP 区别？",
    answer: `GPU 训练基础：
1. 模型和数据迁移到 GPU：model.cuda() / model.to("cuda")；inputs = inputs.cuda()。
2. 单卡训练循环照常。

多卡训练：

DataParallel（DP，单机多卡，旧）：
- model = nn.DataParallel(model)。
- 主 GPU 分发数据、收集梯度，单进程多线程。
- 缺点：GIL 限制、主卡负载不均（显存爆）、不支持多机、慢。

DistributedDataParallel（DDP，推荐）：
- 多进程，每卡一个进程，各自前向反向，梯度通过 AllReduce 同步。
- 显存均衡、无 GIL、支持多机、速度快。
- 需 init_process_group 设置 backend（nccl for GPU）。

\`\`\`python
import torch.distributed as dist
from torch.nn.parallel import DistributedDataParallel as DDP
from torch.utils.data import DataLoader, DistributedSampler
dist.init_process_group("nccl")
rank = dist.get_rank()
torch.cuda.set_device(rank)
model = MLP(...).cuda(rank)
model = DDP(model, device_ids=[rank])
sampler = DistributedSampler(dataset, shuffle=True)
loader = DataLoader(dataset, batch_size=64, sampler=sampler)
# 启动：torchrun --nproc_per_node=4 train.py
\`\`\`

关键：DP 单进程多线程有 GIL 和负载不均；DDP 多进程 AllReduce 同步梯度，均衡高效，是分布式训练标准。`,
    keyPoints: ["DP 单进程多线程有 GIL 和负载不均", "DDP 多进程 AllReduce 同步梯度", "DDP 支持多机是分布式标准"],
    followUps: ["DDP 中如何保证各进程数据不同？", "混合精度 + DDP 如何配合？"],
    favorited: false,
  },
  {
    id: "ai-50",
    nodeId: "ai-dl-framework",
    question: "PyTorch 中如何保存和加载模型？state_dict 和完整模型有何区别？",
    answer: `PyTorch 保存方式：

1. 只存 state_dict（推荐）：只存参数张量（权重/偏置/BN running 统计），不存代码。
   - 保存：torch.save(model.state_dict(), "model.pt")。
   - 加载：model = MyModel(...); model.load_state_dict(torch.load("model.pt"))。
   - 优点：与代码解耦、可移植、可部分加载（迁移学习）、版本兼容好。
   - 缺点：加载需先有模型定义代码。

2. 存完整模型（pickle 整个对象）：torch.save(model, "model.pt")；torch.load("model.pt")。
   - 缺点：依赖类定义路径，重构/迁移易失败，不推荐用于生产。

保存训练检查点（含优化器状态，可断点续训）：
\`\`\`python
checkpoint = {"epoch": epoch,
              "model": model.state_dict(),
              "optimizer": optimizer.state_dict(),
              "scheduler": scheduler.state_dict(),
              "best_metric": best}
torch.save(checkpoint, f"ckpt_ep{epoch}.pt")
# 恢复
ckpt = torch.load("ckpt.pt", map_location="cpu")
model.load_state_dict(ckpt["model"])
optimizer.load_state_dict(ckpt["optimizer"])
\`\`\`

部分加载（迁移学习/LoRA）：
- load_state_dict(strict=False) 忽略不匹配的键，便于换分类头或加载部分预训练权重。

关键：推荐只存 state_dict（解耦可移植），检查点含优化器状态可续训，strict=False 支持部分加载。`,
    keyPoints: ["只存 state_dict 解耦可移植", "完整模型 pickle 依赖类路径不推荐", "检查点含优化器状态可续训"],
    followUps: ["strict=False 何时用？", "如何只加载部分层权重？"],
    favorited: false,
  },
  // ===== CNN（补充） =====
  {
    id: "ai-51",
    nodeId: "ai-cnn",
    question: "池化层的作用？Max Pooling、Average Pooling、Global Average Pooling 区别？",
    answer: `池化层（Pooling）：对特征图下采样，降维、减计算、扩大感受野、提供一定平移不变性。

1. Max Pooling：取窗口内最大值。保留最强特征（边缘/纹理），最常用；对噪声有一定鲁棒性（只取最大）。缺点：丢位置信息。

2. Average Pooling：取窗口内平均值。保留整体特征分布，平滑；不如 Max 常用。

3. Global Average Pooling（GAP）：对整张特征图求平均，输出单值/通道。替代全连接层，大幅减参数、防过拟合，GoogLeNet/ResNet 末尾常用。

4. Global Max Pooling：对整张特征图求最大值。

池化 vs 步长卷积：
- 现代网络（ResNet 后）有时用 stride=2 卷积替代池化做下采样（可学习，参数可控）。
- 池化无可学习参数，更轻量。

\`\`\`python
import torch.nn as nn
pool = nn.MaxPool2d(kernel_size=2, stride=2)        # 输出 H/2 x W/2
gap = nn.AdaptiveAvgPool2d(1)                       # 输出 1x1（每通道）
# ResNet 末尾：conv -> BN -> ReLU -> GAP -> Linear
\`\`\`

关键：Max Pooling 保留强特征最常用；GAP 替代全连接减参数防过拟合；现代网络常用 stride 卷积替代池化。`,
    keyPoints: ["Max Pooling 保留强特征最常用", "GAP 替代全连接减参数防过拟合", "stride 卷积可替代池化"],
    followUps: ["为什么 Max Pooling 提供平移不变性？", "GAP 和全连接哪个更易过拟合？"],
    favorited: false,
  },
  {
    id: "ai-52",
    nodeId: "ai-cnn",
    question: "经典 CNN 架构如何演进？LeNet/AlexNet/VGG/ResNet/EfficientNet 各自贡献？",
    answer: `CNN 架构演进脉络（每代解决前代瓶颈）：

1. LeNet（1998）：卷积+池化+全连接，手写数字识别，证明卷积可行。

2. AlexNet（2012）：深层（8 层）、ReLU、Dropout、GPU 训练、数据增强、LRN。引爆深度学习。

3. VGG（2014）：用堆叠 3×3 小卷积替代大卷积（两个 3×3 等效 5×5，参数更少非线性更多），统一架构，19 层。贡献：小卷积堆叠思想。

4. GoogLeNet/Inception（2014）：Inception 模块多尺度并行卷积（1×1/3×3/5×5），1×1 卷积降维，GAP 替代全连接，22 层但参数少。

5. ResNet（2015）：残差连接解决退化问题，可训 152 层，成为现代 backbone 基础。

6. DenseNet（2017）：密集连接，每层连到所有后续层，特征复用。

7. MobileNet/ShuffleNet：深度可分离卷积 + 通道 shuffle，面向移动端轻量化。

8. EfficientNet（2019）：复合缩放（同时按比例缩放深度/宽度/分辨率），NAS 搜索基线结构，用更少参数达更高精度。

9. Vision Transformer（2020）：用 Transformer 替代卷积，大规模数据上超越 CNN。

\`\`\`python
import torchvision.models as M
resnet = M.resnet50(weights=M.ResNet50_Weights.DEFAULT)
efficient = M.efficientnet_b0(weights=M.EfficientNet_B0_Weights.DEFAULT)
mobilenet = M.mobilenet_v3_small(weights=M.MobileNet_V3_Small_Weights.DEFAULT)
\`\`\`

关键：小卷积堆叠(VGG)→多尺度(Inception)→残差(ResNet)→轻量化(MobileNet)→复合缩放(EfficientNet)→ViT。`,
    keyPoints: ["VGG 小卷积堆叠", "ResNet 残差连接可训深", "EfficientNet 复合缩放"],
    followUps: ["1×1 卷积的作用？", "深度可分离卷积为什么省计算？"],
    favorited: false,
  },
  {
    id: "ai-53",
    nodeId: "ai-cnn",
    question: "1×1 卷积的作用是什么？为什么在 Inception 和 ResNet 中广泛使用？",
    answer: `1×1 卷积（Pointwise Convolution）：卷积核大小 1×1，对每个像素位置跨通道线性组合，不改变空间尺寸。

核心作用：
1. 通道数变换（升降维）：
   - 升维：1×1 把 C_in 通道变 C_out（C_out > C_in）。
   - 降维：把高通道特征图降到低通道，减少计算和参数（Inception 用 1×1 先降维再做 3×3/5×5，叫瓶颈结构 Bottleneck）。

2. 跨通道信息融合：线性组合所有通道，学习通道间关系。

3. 增加非线性：1×1 卷积后接 ReLU 等激活，相当于在每个像素位置做一次 MLP（Network in Network 思想），提升表达能力，不改变空间尺寸。

4. 替代全连接：配合 GAP，1×1 卷积可做分类头，参数比全连接少。

瓶颈结构（Bottleneck Block，ResNet）：
- 1×1 降维 → 3×3 卷积 → 1×1 升维。
- 中间 3×3 在低通道计算，大幅省 FLOPs。

\`\`\`python
import torch.nn as nn
# 瓶颈块：256 -> 64 -> 64 -> 256
bottleneck = nn.Sequential(
    nn.Conv2d(256, 64, 1, bias=False), nn.BatchNorm2d(64), nn.ReLU(),  # 降维
    nn.Conv2d(64, 64, 3, padding=1, bias=False), nn.BatchNorm2d(64), nn.ReLU(),  # 3x3
    nn.Conv2d(64, 256, 1, bias=False), nn.BatchNorm2d(256))  # 升维
\`\`\`

关键：1×1 卷积做通道升降维 + 跨通道融合 + 增加非线性；瓶颈结构降维省计算，是 Inception/ResNet 标配。`,
    keyPoints: ["1×1 做通道升降维", "跨通道信息融合 + 增加非线性", "瓶颈结构降维省计算"],
    followUps: ["深度可分离卷积如何用 1×1？", "1×1 卷积和全连接的等价关系？"],
    favorited: false,
  },
  // ===== RNN/LSTM（补充） =====
  {
    id: "ai-54",
    nodeId: "ai-rnn-lstm",
    question: "GRU 相比 LSTM 简化了什么？为什么效果接近？如何选择？",
    answer: `GRU（Gated Recurrent Unit）：LSTM 的简化版，合并门控、去掉独立细胞状态。

GRU 结构：
- 重置门 r = σ(Wr·[hₜ₋₁, xₜ])：控制用多少历史信息计算候选。
- 更新门 z = σ(Wz·[hₜ₋₁, xₜ])：同时控制遗忘和写入（合并 LSTM 的遗忘门+输入门）。
- 候选 ĥ = tanh(W·[r⊙hₜ₋₁, xₜ])。
- 隐藏 hₜ = (1-z)⊙hₜ₋₁ + z⊙ĥ。

相比 LSTM 简化：
1. 2 个门 vs LSTM 3 个门 + 细胞状态，参数少约 1/3，计算快。
2. 无独立细胞状态 Cₜ，直接用 hₜ 同时承担记忆和输出。
3. 更新门 z 同时决定遗忘旧信息和写入新信息（耦合），LSTM 遗忘门和输入门独立。

为什么效果接近：
- 核心机制（门控 + 加法更新提供长程梯度通路）保留，仍缓解梯度消失。
- 大多数序列任务 LSTM 和 GRU 表现差异不大。

选择经验：
- 数据少/求速度 → GRU（参数少、不易过拟合、快）。
- 数据多/长序列/复杂依赖 → LSTM（表达能力略强）。
- 现代任务多用 Transformer，RNN 在资源受限/流式场景仍有用。

\`\`\`python
import torch.nn as nn
gru = nn.GRU(input_size=128, hidden_size=256, num_layers=2,
             batch_first=True, bidirectional=True, dropout=0.3)
lstm = nn.LSTM(input_size=128, hidden_size=256, num_layers=2, batch_first=True)
\`\`\`

关键：GRU 合并门控去细胞状态参数少 1/3，保留加法梯度通路效果接近 LSTM；小数据/求速度用 GRU。`,
    keyPoints: ["GRU 2 门合并 LSTM 遗忘+输入", "无独立细胞状态参数少 1/3", "保留加法梯度通路效果接近"],
    followUps: ["GRU 更新门为什么能合并遗忘和输入？", "什么场景 LSTM 优于 GRU？"],
    favorited: false,
  },
  {
    id: "ai-55",
    nodeId: "ai-rnn-lstm",
    question: "双向 RNN 的原理？为什么不能用于语言模型？适合什么任务？",
    answer: `双向 RNN（BiRNN/BiLSTM/BiGRU）：同时用前向和后向两个 RNN，每个时刻的输出融合过去和未来上下文。

结构：
- 前向 RNN：h→ₜ = f(xₜ, h→ₜ₋₁)，从左到右。
- 后向 RNN：h←ₜ = f(xₜ, h←ₜ₊₁)，从右到左。
- 输出 hₜ = [h→ₜ; h←ₜ]（拼接），包含双向上下文。

为什么不能用于语言模型（LM）：
- 语言模型是自回归预测下一个 token，推理时只有上文（未来未知）。
- BiRNN 的后向 RNN 用了未来信息，破坏因果性，无法用于在线生成/预测下一词。
- 用 BiRNN 做 LM 会数据泄露，训练指标虚高但无法部署。

适合的任务（输入完整序列、需要全上下文理解）：
- 序列标注：NER、POS、分词（每个位置看全句判标签）。
- 文本分类/相似度：情感、句对匹配（BERT 也是双向）。
- 语音识别声学模型、OCR。
- 机器翻译的编码器（编码端可双向，解码端必须单向）。

\`\`\`python
import torch.nn as nn
bilstm = nn.LSTM(input_size=128, hidden_size=256, bidirectional=True, batch_first=True)
out, _ = bilstm(x)  # out.shape: (batch, seq, 512) 前256+后256 拼接
\`\`\`

关键：BiRNN 融合双向上下文，适合理解类任务（标注/分类/编码器）；语言模型需因果性只能单向。`,
    keyPoints: ["前向+后向 RNN 输出拼接", "用了未来信息破坏因果性", "适合标注/分类/编码器不适合自回归 LM"],
    followUps: ["ELMo 为什么能用 BiLSTM？", "解码器为什么必须单向？"],
    favorited: false,
  },
  {
    id: "ai-56",
    nodeId: "ai-rnn-lstm",
    question: "Seq2Seq 编码器-解码器结构？为什么需要注意力机制？",
    answer: `Seq2Seq（Encoder-Decoder）：编码器把输入序列压缩成定长上下文向量 c，解码器从 c 生成输出序列。用于翻译、摘要、对话。

基本结构：
- Encoder（RNN/LSTM/GRU）：读入 x₁...xₙ，最终隐藏状态作为上下文 c。
- Decoder：以 c 和已生成 token 为输入，逐步生成 y₁...yₘ。
- 训练用 teacher forcing（输入用真实上一步 token，加速收敛）；推理用上一步预测（自回归）。

定长上下文瓶颈：
- 整个输入序列被压缩成一个固定向量 c，长序列信息丢失严重。
- 解码器每步只看到同一个 c，无法动态聚焦输入不同部分。
- 长句翻译质量急剧下降。

为什么需要注意力：
- Attention 让解码每步动态对编码器所有隐藏状态加权求和，得到该步专属上下文 cₜ。
- 解码第 t 步聚焦输入最相关部分，缓解定长瓶颈。
- 提供可解释性（对齐权重可视化）。
- 是 Transformer 的基础。

\`\`\`python
# 简化 Seq2Seq + Attention
class Decoder(nn.Module):
    def forward(self, y_prev, h, enc_outs):
        scores = torch.matmul(h, enc_outs.transpose(-2,-1))  # 对齐分数
        attn = scores.softmax(dim=-1)
        ctx = torch.matmul(attn, enc_outs)  # 动态上下文
        return self.rnn(y_prev, ctx, h)
\`\`\`

关键：Seq2Seq 编码器压缩成定长向量，长序列瓶颈；Attention 解码每步动态加权聚焦，缓解瓶颈且可解释。`,
    keyPoints: ["Encoder 压缩成定长上下文", "定长向量是长序列瓶颈", "Attention 动态加权缓解瓶颈"],
    followUps: ["teacher forcing 的缺点？", "Attention 如何解决长句翻译问题？"],
    favorited: false,
  },
  {
    id: "ai-57",
    nodeId: "ai-rnn-lstm",
    question: "梯度裁剪（Gradient Clipping）的原理？为什么 RNN 训练常需要它？",
    answer: `梯度裁剪：限制梯度范数/数值范围，防止梯度爆炸导致训练不稳定。

两种方式：
1. 按范数裁剪（最常用）：若 ||g|| > max_norm，则 g = g · max_norm / ||g||，缩放到阈值内。保留梯度方向只缩放大小。
2. 按值裁剪：把每个梯度元素截断到 [-clip_value, clip_value]，简单但改变方向。

为什么 RNN 需要：
- RNN 反向传播沿时间步连乘，雅可比矩阵谱半径 > 1 时梯度指数增长 → 梯度爆炸。
- 梯度爆炸会让参数更新过大、损失突变为 NaN，训练崩溃。
- 梯度裁剪是缓解梯度爆炸最直接有效的手段（梯度消失需用 LSTM/GRU/残差/门控解决）。

经验：
- RNN/Transformer 训练常用 max_norm=1.0~5.0。
- Transformer/LLM 训练梯度裁剪几乎必备。
- 配合学习率预热、AdamW 效果更稳。

\`\`\`python
import torch
# PyTorch 训练循环
optimizer.zero_grad()
loss.backward()
torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)  # 范数裁剪
optimizer.step()
# TensorFlow
gradients = [tf.clip_by_norm(g, 5.0) for g in gradients]
\`\`\`

关键：梯度裁剪防爆炸（缩放范数保留方向），RNN/Transformer 训练必备；梯度消失需用 LSTM/残差/门控解决。`,
    keyPoints: ["按范数裁剪保留方向缩放大小", "RNN 时间步连乘易梯度爆炸", "Transformer/LLM 训练必备"],
    followUps: ["梯度爆炸和梯度消失哪个更易处理？", "范数裁剪和值裁剪区别？"],
    favorited: false,
  },
  // ===== Transformer（补充） =====
  {
    id: "ai-58",
    nodeId: "ai-transformer",
    question: "Transformer 为什么用 LayerNorm 而不是 BatchNorm？Pre-Norm 和 Post-Norm 区别？",
    answer: `Transformer 用 LayerNorm（LN）而非 BatchNorm（BN）的原因：

1. 序列长度可变：BN 在 batch 维归一化，要求各样本同维度；NLP 序列长度不一，padding 后 BN 统计受 padding 污染。LN 在特征维归一化，与序列长度和 batch 无关。

2. batch 大小敏感：BN 依赖 batch 统计，batch 小（如推理/微调）统计不准；LN 每个 token 独立归一化，无 batch 依赖，训练推理一致。

3. 文本语义特征维度差异大：LN 对每个 token 的特征维归一化更合理。

LN 公式：对单个样本单 token 的特征向量 x∈ℝ^d，x̂=(x-μ)/σ，y=γ·x̂+β（μ,σ 沿 d 维算）。

Pre-Norm vs Post-Norm：
- Post-Norm（原始 Transformer）：x' = LN(x + Sublayer(x))。残差后再 LN。深训难，需 warmup，但性能上限略高。
- Pre-Norm（GPT/LLaMA 等主流）：x' = x + Sublayer(LN(x))。先 LN 再子层，残差直连。深训稳定，无需精细 warmup，现代 LLM 主流。

\`\`\`python
import torch.nn as nn
class PreNormBlock(nn.Module):
    def __init__(self, d, fn):
        super().__init__()
        self.norm = nn.LayerNorm(d)
        self.fn = fn
    def forward(self, x):
        return x + self.fn(self.norm(x))   # Pre-Norm 残差直连
\`\`\`

关键：序列变长/batch 小 → 用 LN；Pre-Norm 残差直连深训稳，是现代 LLM 主流。`,
    keyPoints: ["LN 在特征维归一化与 batch/序列无关", "BN batch 小/序列变长不稳", "Pre-Norm 残差直连深训稳主流"],
    followUps: ["RMSNorm 和 LayerNorm 区别？", "为什么 Pre-Norm 更稳定？"],
    favorited: false,
  },
  {
    id: "ai-59",
    nodeId: "ai-transformer",
    question: "Transformer 的 Encoder 和 Decoder 结构区别？因果掩码（Causal Mask）作用？",
    answer: `Encoder-Decoder Transformer（原始翻译模型）：

Encoder（编码器，N 层堆叠）：
- 每层：多头自注意力 + FFN，各带残差和 LayerNorm。
- 自注意力双向（每个 token 看全句），用于理解输入。

Decoder（解码器，N 层堆叠）：
- 每层三个子模块：
  1. Masked 自注意力（带因果掩码）。
  2. 交叉注意力（Cross-Attention）：Query 来自解码器，Key/Value 来自编码器输出。
  3. FFN。
- 自回归生成：每步只能看已生成的前文。

因果掩码（Causal Mask）：
- 自注意力中给未来位置加 -∞ 屏蔽，softmax 后权重为 0，保证生成第 t 个 token 时只看前 t-1 个。
- 是下三角矩阵，实现"看不见未来"。
- 没有因果掩码就会数据泄露（看到答案），训练指标虚高但无法自回归生成。

Padding Mask：屏蔽 padding 位置，不让注意力关注无意义的 PAD token。

\`\`\`python
import torch
def causal_mask(seq_len):
    mask = torch.triu(torch.ones(seq_len, seq_len), diagonal=1).bool()
    return mask  # True 处被屏蔽（设为 -inf）
# scores = scores.masked_fill(mask, float("-inf"))
\`\`\`

现代趋势：GPT 系只用 Decoder（masked 自注意力 + 自回归）；BERT 只用 Encoder（双向）；T5/BART 用完整 Encoder-Decoder。

关键：Encoder 双向理解，Decoder 带因果掩码自回归；交叉注意力连接编码器输出；GPT 只 Decoder，BERT 只 Encoder。`,
    keyPoints: ["Encoder 双向自注意力", "Decoder 因果掩码 + 交叉注意力", "因果掩码屏蔽未来防泄露"],
    followUps: ["交叉注意力的 Q/K/V 来自哪？", "Padding Mask 和 Causal Mask 如何叠加？"],
    favorited: false,
  },
  {
    id: "ai-60",
    nodeId: "ai-transformer",
    question: "Transformer 训练有哪些关键技巧？为什么需要大 batch 和 warmup？",
    answer: `Transformer 训练比 CNN/RNN 更"娇贵"，需一系列技巧稳定训练：

1. Warmup 学习率：前 N 步线性升学习率，再衰减（cosine/inverse-sqrt）。
   - 原因：初期 LayerNorm/Adam 二阶矩未稳，大学习率致发散；warmup 让优化器先建立稳定统计。

2. 大 batch 训练：Transformer 对 batch 敏感，大 batch（千到万 token）泛化更好。
   - 但大 batch 需更大学习率（线性/平方根缩放），更长 warmup。
   - LLM 常用梯度累加模拟大 batch。

3. AdamW 优化器 + 权重衰减：解耦权重衰减，比 Adam+L2 正则更有效，Transformer 标配。

4. 梯度裁剪：max_norm=1.0，防梯度爆炸（注意力 softmax 数值不稳定时易爆）。

5. Label Smoothing：标签 0/1 平滑成如 0.1/0.9，防过自信、提泛化，翻译任务常用 0.1。

6. 数值稳定：注意力分数除以 √dₖ；softmax 前减最大值防溢出；用 BF16/FP32 混合精度。

7. Dropout：残差、注意力权重、Embedding 处加 Dropout 防过拟合（小模型）。

8. 位置编码：RoPE/ALiBi 提升长度外推。

\`\`\`python
import torch
optimizer = torch.optim.AdamW(model.parameters(), lr=5e-5, weight_decay=0.01)
scheduler = transformers.get_linear_schedule_with_warmup(
    optimizer, num_warmup_steps=500, num_training_steps=total)
torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
\`\`\`

关键：warmup + AdamW + 梯度裁剪 + 大 batch 是 Transformer 训练标配；Label Smoothing/数值稳定防过拟合与发散。`,
    keyPoints: ["warmup 防初期发散", "AdamW + 梯度裁剪标配", "大 batch + Label Smoothing 提泛化"],
    followUps: ["为什么 Transformer 对 batch 敏感？", "Label Smoothing 为什么提泛化？"],
    favorited: false,
  },
  // ===== 大语言模型（补充） =====
  {
    id: "ai-61",
    nodeId: "ai-llm",
    question: "LLM 的预训练-微调范式？Pretrain → SFT → RLHF 各阶段目标？",
    answer: `现代 LLM 训练分三阶段：

1. 预训练（Pretrain）：
   - 海量无标注文本（万亿 token），自回归预测下一 token。
   - 目标：学语言规律、世界知识、推理能力。
   - 计算量最大（占 99%+ 算力），数据质量决定上限。
   - 得到"基座模型"（base model）。

2. 监督微调（SFT, Supervised Fine-Tuning）：
   - 用高质量"指令-回答"对微调，让模型学会按指令格式回答。
   - 目标：对齐指令格式，学会遵循指令（不是学新知识）。
   - 数据量小（万到百万条），但质量要求极高。
   - 得到"指令模型"（instruct/chat model）。

3. RLHF（人类反馈强化学习）：
   - RM（奖励模型）学人类偏好，PPO/DPO 优化策略模型。
   - 目标：对齐人类价值观（有用、无害、诚实），提升回答质量和安全性。
   - 进一步精细调整风格、拒绝有害请求。

范式本质：
- Pretrain 给能力（知识+推理）。
- SFT 给格式（遵循指令）。
- RLHF 给偏好（对齐价值观）。
- 能力主要来自预训练，后两阶段主要是"激活和引导"已有能力。

\`\`\`bash
# 典型开源流程
# 1. 预训练：llama预训练脚本 + 万亿 token
# 2. SFT：用 Alpaca/ShareGPT 等指令数据微调
# 3. RLHF：训练 RM + PPO/DPO 对齐
\`\`\`

关键：Pretrain 学能力，SFT 学指令格式，RLHF 对齐人类偏好；能力上限由预训练决定。`,
    keyPoints: ["Pretrain 自回归学能力", "SFT 学指令格式", "RLHF 对齐人类偏好"],
    followUps: ["为什么 SFT 不学新知识？", "DPO 相比 PPO 简化了什么？"],
    favorited: false,
  },
  {
    id: "ai-62",
    nodeId: "ai-llm",
    question: "Prompt Engineering 有哪些核心技巧？Few-shot 和 Zero-shot 区别？",
    answer: `Prompt Engineering：通过设计输入提示引导 LLM 输出更好结果，不改模型权重。

核心技巧：
1. 角色设定：让模型扮演专家（"你是资深数据工程师"），激活相关知识与语气。

2. Few-shot（少样本）：给几个示例（输入-输出对），让模型学模式再推理。
   - Zero-shot：不给示例，直接提问，依赖模型预训练能力。
   - Few-shot 适合格式固定/复杂推理，Zero-shot 适合简单任务。

3. 思维链（Chain-of-Thought, CoT）：要求"逐步思考"，让模型展示推理过程，显著提升数学/逻辑/多步推理。
   - "Let's think step by step"。

4. 结构化输出：要求 JSON/Markdown 表格，便于程序解析。

5. 任务分解：把复杂任务拆成子步骤，逐步执行（如 Plan-and-Solve）。

6. 自一致性（Self-Consistency）：多次采样取多数票，提升推理稳健性。

7. ReAct：Reason + Act，交替推理和调用工具。

\`\`\`python
prompt = """你是数据工程师。判断以下 SQL 是否符合规范，输出 JSON。
示例：
输入: SELECT * FROM users WHERE id=1
输出: {"valid": true, "reason": "标准查询"}

输入: {user_sql}
输出:"""
\`\`\`

最佳实践：明确角色、给示例、要 CoT、指定输出格式；复杂任务分解；迭代测试。

关键：Few-shot 给模式、CoT 促推理、结构化输出便于解析；角色设定激活相关能力。`,
    keyPoints: ["Few-shot 给示例学模式", "CoT 逐步思考提推理", "结构化输出便于解析"],
    followUps: ["CoT 为什么能提升推理？", "ReAct 如何结合推理和工具？"],
    favorited: false,
  },
  {
    id: "ai-63",
    nodeId: "ai-llm",
    question: "LLM 推理有哪些优化技术？KV Cache 原理？为什么能大幅加速？",
    answer: `LLM 推理（自回归生成）瓶颈：每生成一个 token 都要重算注意力，序列越长越慢。优化技术：

1. KV Cache（最基础）：
   - 缓存已生成 token 的 Key、Value 矩阵，新 token 只算新 K/V 追加，不重算历史。
   - 复杂度从 O(n²·d) 降到 O(n·d) 每步，大幅加速。
   - 代价：显存随序列长度线性增长（长上下文显存吃紧）。

2. PagedAttention（vLLM）：把 KV Cache 分页管理（类似 OS 虚拟内存），减少碎片，支持高并发批处理。

3. 量化：FP16 → INT8/INT4，减显存、加速推理（GPTQ/AWQ/GGUF）。

4. 投机解码（Speculative Decoding）：小模型草拟多个 token，大模型批量验证，加速 2-3 倍。

5. Flash Attention：IO 感知的注意力算法，减少 HBM 读写，加速训练和推理。

6. 连续批处理（Continuous Batching）：动态拼 batch，不同请求不同长度，提升 GPU 利用率。

7. 注意力优化：Sliding Window、GQA（分组查询注意力）减 KV Cache 大小。

\`\`\`python
# HuggingFace 启用 KV Cache（默认开启）
outputs = model.generate(input_ids, max_new_tokens=100, use_cache=True)
# vLLM 高吞吐推理（PagedAttention + 连续批处理）
# python -m vllm.entrypoints.api_server --model meta-llama/Llama-2-7b-chat-hf
\`\`\`

关键：KV Cache 缓存历史 K/V 避免重算，是 LLM 推理加速基础；量化/PagedAttention/投机解码/Flash Attention 进一步提升吞吐。`,
    keyPoints: ["KV Cache 缓存历史 K/V 避免重算", "PagedAttention 分页减碎片", "量化/投机解码/Flash Attention 加速"],
    followUps: ["KV Cache 显存如何优化（GQA）？", "投机解码如何保证输出不变？"],
    favorited: false,
  },
  {
    id: "ai-64",
    nodeId: "ai-llm",
    question: "LLM 量化有哪些方法？GPTQ、AWQ、INT4 量化的区别与权衡？",
    answer: `量化：把 FP16/FP32 权重压成 INT8/INT4，减显存、加速推理，是 LLM 部署的关键技术。

量化分类：
1. 训练后量化（PTQ）：训练完直接量化权重，无需重训，最实用。
2. 量化感知训练（QAT）：训练时模拟量化，精度更高但需训练成本。

主要方法：

GPTQ（基于二阶信息的逐层量化）：
- 用 Hessian 矩阵逆逐列量化，最小化量化误差。
- INT4 精度损失小，主流后训练量化方法之一。
- 需校准数据集。

AWQ（Activation-aware Weight Quantization）：
- 观察"激活值大"的通道对应权重更重要，对这些通道保留高精度（混合精度）。
- 比 GPTQ 推理更快（无需重排序），显存友好。
- 适合实际部署。

GGUF（llama.cpp）：CPU/边缘端量化格式，支持 2-8 bit 多种量化，跨平台。

权衡：
- INT4：显存减 75%，速度提升，精度损失约 1-3%（任务相关）。
- INT8：显存减 50%，几乎无损，硬件支持广。
- 量化越低，精度损失越大；长文本生成/复杂推理对量化更敏感。

\`\`\`bash
# 常用量化工具
pip install auto-gptq   # GPTQ 量化
pip install autoawq     # AWQ 量化
# 加载 AWQ INT4 模型
python -c "from transformers import AutoModelForCausalLM; m = AutoModelForCausalLM.from_pretrained('TheBloke/Llama-2-7B-AWQ', device_map='auto')"
\`\`\`

关键：GPTQ 用 Hessian 逐列量化精度高；AWQ 保护重要通道推理快；INT4 省 75% 显存是部署关键，精度损失可控。`,
    keyPoints: ["GPTQ Hessian 逐列量化精度高", "AWQ 保护重要通道推理快", "INT4 省 75% 显存部署关键"],
    followUps: ["量化对推理质量影响如何评估？", "QAT 为什么比 PTQ 精度高？"],
    favorited: false,
  },
  // ===== 计算机视觉（补充） =====
  {
    id: "ai-65",
    nodeId: "ai-cv",
    question: "CV 数据增强有哪些方法？Mixup、CutMix、Mosaic 原理与区别？",
    answer: `数据增强：通过对训练图像做变换扩充数据多样性，防过拟合、提升泛化，是 CV 必备。

基础增强（几何+色彩）：
- 几何：随机裁剪、翻转、旋转、缩放、平移。
- 色彩：亮度/对比度/饱和度抖动、HSV 调整、灰度化。
- AutoAugment：用搜索得到的最优增强策略组合。
- RandAugment：简化版，随机选 N 个变换。

进阶增强（图像混合）：

1. Mixup：对两幅图及其标签做线性插值。
   - x̃ = λ·x₁ + (1-λ)·x₂，ỹ = λ·y₁ + (1-λ)·y₂。
   - 生成"混合"图像，标签也混合，相当于 label smoothing，提升鲁棒性。

2. CutMix：从图 B 裁一块贴到图 A，标签按面积比混合。
   - 比 Mixup 保留更多局部纹理信息，检测/分割更友好。

3. Mosaic（YOLOv4+）：把 4 幅图拼成一幅（2×2），一次看到 4 个目标。
   - 增大 batch 等效多样性，丰富背景，对小目标友好。
   - YOLO 系列标配。

4. Copy-Paste：把目标抠出贴到其他图，增实例数（实例分割）。

\`\`\`python
import albumentations as A
transform = A.Compose([
    A.RandomResizedCrop(224, 224),
    A.HorizontalFlip(p=0.5),
    A.ColorJitter(0.2, 0.2, 0.2, p=0.5),
    A.Normalize(),
])
# Mixup 简化实现
lam = np.random.beta(0.2, 0.2)
x_mix = lam * x1 + (1 - lam) * x2
y_mix = lam * y1 + (1 - lam) * y2
\`\`\`

关键：基础增强增多样性；Mixup 线性插值 label smoothing；CutMix 保局部纹理；Mosaic 拼四图丰富背景。`,
    keyPoints: ["Mixup 线性插值标签混合", "CutMix 裁块贴图保局部纹理", "Mosaic 拼四图丰富背景小目标友好"],
    followUps: ["Mixup 为什么能防过拟合？", "Mosaic 对小目标为什么有效？"],
    favorited: false,
  },
  {
    id: "ai-66",
    nodeId: "ai-cv",
    question: "目标检测如何评估？IoU、mAP、AP50、AP75 的含义？",
    answer: `目标检测评估基于"预测框 vs 真实框"的匹配。

IoU（Intersection over Union）= 交集面积 / 并集面积。衡量两框重合度，通常 IoU≥0.5 算正确检测。

评估流程：
1. 对每个预测框，与同类别真实框算 IoU。
2. IoU ≥ 阈值（如 0.5）且类别正确 → TP；否则 FP；漏检的真实框 → FN。
3. 按置信度排序，逐个累加 TP/FP，画 PR 曲线。
4. AP = PR 曲线下面积（单类）。

核心指标：
- AP@IoU=0.5（AP50）：IoU 阈值 0.5 的单类 AP，宽松。
- AP@IoU=0.5:0.95（COCO mAP）：IoU 从 0.5 到 0.95 步长 0.05 取平均，严格，COCO 标准。
- AP75：IoU=0.75 的 AP，定位精度要求高。
- mAP：所有类别 AP 的平均，综合指标。

AP50 vs AP75：AP50 看检测到没（粗定位），AP75 看定位准不准（精定位）。

按尺寸：COCO 还分 AP_small/medium/large，评估不同尺度目标。

\`\`\`python
# COCO 评估
from pycocotools.coco import COCO
from pycocotools.cocoeval import COCOeval
coco_gt = COCO("gt.json")
coco_dt = coco_gt.loadRes("pred.json")
eval = COCOeval(coco_gt, coco_dt, "bbox")
eval.evaluate(); eval.accumulate(); eval.summarize()
# 输出 AP @[IoU=0.50:0.95] 等多指标
\`\`\`

关键：IoU 衡量框重合；AP50 宽松看检测，AP75 严格看定位；COCO mAP（0.5:0.95）是行业标准。`,
    keyPoints: ["IoU = 交并比阈值 0.5", "AP50 宽松 AP75 严格看定位", "COCO mAP 0.5:0.95 行业标准"],
    followUps: ["mAP 和 F1 的区别？", "小目标 AP 为什么低？"],
    favorited: false,
  },
  {
    id: "ai-67",
    nodeId: "ai-cv",
    question: "OCR（光学字符识别）的原理？CRNN + CTC 如何工作？",
    answer: `OCR 把图像中的文字转成文本，分文本检测（找文字位置）和文本识别（识别字符）两阶段。

文本检测：找到文字区域框（DB、CRAFT、PSENet 等），与目标检测类似但针对细长文字。

文本识别经典方案：CRNN + CTC

CRNN（Convolutional Recurrent Neural Network）：
1. CNN 提取特征图（如 ResNet），输出 H'×W'×C，把每列（宽度方向一列）当作一个时间步的特征序列。
2. BiLSTM 序列建模，捕捉字符间上下文依赖。
3. 线性层输出每步各字符的概率分布。

CTC（Connectionist Temporal Classification）：
- 问题：CNN 输出序列长度与真实标签字符数不一定对应（一个字符可能占多列，或有空白列）。
- CTC 引入 blank（空白）符号，对齐变长序列，无需逐字符标注。
- 解码：合并连续相同字符，去掉 blank，得到最终文本。
- 损失：对所有可能的对齐路径求和的负对数似然。

优势：端到端训练，无需字符级位置标注；支持不定长文本。

\`\`\`python
import torch.nn as nn
class CRNN(nn.Module):
    def __init__(self, n_classes):
        super().__init__()
        self.cnn = nn.Sequential(nn.Conv2d(1,64,3,1,1), nn.ReLU(),
                                 nn.MaxPool2d(2), nn.Conv2d(64,128,3,1,1),
                                 nn.ReLU(), nn.MaxPool2d(2))
        self.rnn = nn.LSTM(128*8, 256, bidirectional=True, batch_first=True)
        self.fc = nn.Linear(256*2, n_classes)  # n_classes 含 blank
    def forward(self, x):
        f = self.cnn(x)              # (B,C,H,W)
        b,c,h,w = f.shape
        f = f.permute(0,3,1,2).reshape(b, w, c*h)  # 按宽度序列化
        f,_ = self.rnn(f)
        return self.fc(f)            # (B, W, n_classes)
# CTC 损失
loss = nn.CTCLoss(blank=n_classes-1, zero_infinity=True)
\`\`\`

关键：CRNN 用 CNN 提特征 + BiLSTM 序列建模；CTC 用 blank 对齐变长序列，无需字符级标注，端到端训练。`,
    keyPoints: ["CNN 提特征按列序列化 + BiLSTM 建模", "CTC 引入 blank 对齐变长序列", "端到端无需字符级标注"],
    followUps: ["CTC 解码的两种方式？", "Attention-based OCR 和 CTC 区别？"],
    favorited: false,
  },
  {
    id: "ai-68",
    nodeId: "ai-cv",
    question: "人脸识别的原理？FaceNet、ArcFace 区别？Triplet Loss 和 ArcFace Loss？",
    answer: `人脸识别流程：
1. 人脸检测（MTCNN/RetinaFace）找到人脸框和关键点。
2. 人脸对齐（用关键点仿射变换到标准位置）。
3. 特征提取（CNN 把人脸映射成 embedding 向量）。
4. 比对：计算 embedding 间余弦相似度/欧氏距离，判断是否同一人或检索最相似身份。

核心是学一个判别性 embedding 空间：同人脸近、不同人远。

损失函数演进：

1. Triplet Loss（FaceNet）：
   - 选 anchor（基准）、positive（同身份）、negative（不同身份）三元组。
   - Loss = max(0, d(a,p) - d(a,n) + margin)，拉近 a-p、推远 a-n。
   - 难点：三元组采样策略（hard mining）影响大，训练慢。

2. Center Loss：每类学一个中心，拉近样本到类中心，与 softmax 联合，减小类内方差。

3. SphereFace / CosFace / ArcFace（角度间隔，主流）：
   - 把 softmax 权重归一化，用 cosθ 替代点积，在角度空间加间隔 margin。
   - ArcFace：cos(θ + m)，在角度上加间隔，类间更分开、类内更紧凑。
   - 训练稳定、精度高，工业主流。

\`\`\`python
import torch.nn as nn
class ArcFaceLoss(nn.Module):
    def __init__(self, in_features, out_features, s=30.0, m=0.50):
        super().__init__()
        self.W = nn.Parameter(torch.randn(out_features, in_features))
        self.s, self.m = s, m
    def forward(self, embedding, labels):
        W = nn.functional.normalize(self.W, dim=1)
        x = nn.functional.normalize(embedding, dim=1)
        cos = x @ W.t()                      # cosθ
        theta = torch.acos(cos.clamp(-1+1e-7, 1-1e-7))
        target_logits = torch.cos(theta + self.m)  # ArcFace 加间隔
        logits = cos * 1.0
        logits[range(len(labels)), labels] = target_logits
        return nn.functional.cross_entropy(self.s * logits, labels)
\`\`\`

关键：人脸识别靠判别性 embedding；Triplet Loss 三元组采样难，ArcFace 角度间隔训练稳精度高是主流。`,
    keyPoints: ["CNN 提 embedding 比对相似度", "Triplet Loss 三元组采样难", "ArcFace 角度间隔类内紧类间开主流"],
    followUps: ["ArcFace 的 s 和 m 如何调？", "人脸对齐为什么重要？"],
    favorited: false,
  },
  // ===== 推荐系统（补充） =====
  {
    id: "ai-69",
    nodeId: "ai-recsys",
    question: "DeepFM、Deep&Cross（DCN）等深度推荐模型的核心思想？",
    answer: `深度推荐模型围绕"显式特征交叉 + 深度网络泛化"融合，改进 Wide&Deep 的手工特征交叉。

1. DeepFM：
   - FM 侧替代 Wide&Deep 的宽侧，自动学二阶特征交叉（无需手工构造交叉特征）。
   - Deep 侧 MLP 学高阶非线性。
   - FM 和 Deep 共享 Embedding，联合训练，端到端学交叉。
   - 公式：FM 二阶项 = 0.5·Σ((Σvᵢxᵢ)² - Σvᵢ²xᵢ²)。

2. Deep & Cross Network（DCN）：
   - Cross 侧通过特殊交叉层显式构造有限阶特征交叉：xₗ₊₁ = x₀⊙(W·xₗ) + xₗ，每层增加一阶交叉。
   - Deep 侧标准 MLP。
   - 能自动学到高阶交叉且参数高效（每层仅 d 个参数）。

3. xDeepFM：Cross 层改为向量级交叉（CIN），更显式且可控。

4. FiBiNET：引入 SENet 对特征重要性动态加权 + 双线性交叉。

5. AutoInt：用多头自注意力学特征间交互，自动发现重要交叉。

共同架构：稀疏特征 → Embedding → (显式交叉层 + 深度 MLP) → 拼接 → 输出层（sigmoid 预测点击率）。

\`\`\`python
import torch.nn as nn
class DeepFM(nn.Module):
    def __init__(self, n_fields, emb_dim, hidden):
        super().__init__()
        self.embeddings = nn.ModuleList([nn.Embedding(n, emb_dim) for n in n_fields])
        self.deep = nn.Sequential(nn.Linear(len(n_fields)*emb_dim, hidden), nn.ReLU(),
                                  nn.Linear(hidden, 1))
    def forward(self, x):  # x: (batch, n_fields)
        embs = [emb(x[:,i]) for i, emb in enumerate(self.embeddings)]
        s = sum(embs)  # FM 二阶
        fm2 = 0.5*((s**2).sum(1) - sum(e**2 for e in embs).sum(1))
        deep_out = self.deep(torch.cat(embs, 1))
        return fm2 + deep_out.squeeze()
\`\`\`

关键：DeepFM 用 FM 自动学二阶交叉，DCN 用 Cross 层显式高阶交叉，都免手工特征工程。`,
    keyPoints: ["DeepFM 用 FM 自动学二阶交叉", "DCN Cross 层显式高阶交叉参数高效", "共享 Embedding 端到端"],
    followUps: ["FM 和 DeepFM 的关系？", "DCN 的 Cross 层为什么参数高效？"],
    favorited: false,
  },
  {
    id: "ai-70",
    nodeId: "ai-recsys",
    question: "推荐系统的冷启动问题？用户冷启动、物品冷启动如何解决？",
    answer: `冷启动：新用户/新物品缺乏行为数据，协同过滤等方法失效。

三类冷启动：
1. 用户冷启动：新用户无历史行为。
2. 物品冷启动：新物品无交互记录。
3. 系统冷启动：新系统无任何数据。

解决策略：

用户冷启动：
- 注册信息利用：年龄/性别/地域/兴趣标签做人口统计学推荐。
- 引导选择：让用户选兴趣标签，冷启动即个性化。
- 热门/榜单推荐：先推全局热门，逐步收集行为。
- 跨域迁移：用用户在其他产品的行为画像。
- 主动探索：用 Explore-Exploit（多臂老虎机）平衡推荐新内容和利用已知偏好。

物品冷启动：
- 基于内容：用物品的文本/图像/标签特征（CB）推荐，不依赖交互。
- 基于属性相似：找属性相近的热门物品，继承流量。
- 专家/种子用户冷启：先给小范围测试收集反馈。

通用：
- 混合推荐：CF + 内容 + 热门 + 规则多路融合。
- 元学习/MAML：用元学习快速适配新用户少样本。
- Embedding 泛化：用物品内容 embedding 补充协同过滤。

\`\`\`python
# 简化：新用户用热门 + 标签匹配
def cold_start_user(user_tags, item_tags, popular_items, top_k=10):
    scores = {i: 0.6*popular_score[i] + 0.4*tag_overlap(user_tags, item_tags[i])
              for i in all_items}
    return sorted(scores, key=scores.get, reverse=True)[:top_k]
\`\`\`

关键：用户冷启动靠属性/热门/探索；物品冷启动靠内容/属性相似；混合推荐 + E&E 平衡探索与利用。`,
    keyPoints: ["用户冷启动靠属性/热门/E&E 探索", "物品冷启动靠内容/属性相似", "混合推荐 + 元学习少样本适配"],
    followUps: ["多臂老虎机如何用于冷启动？", "内容推荐和协同过滤如何互补？"],
    favorited: false,
  },
  {
    id: "ai-71",
    nodeId: "ai-recsys",
    question: "推荐多样性为什么重要？MMR 和 DPP 如何提升多样性？",
    answer: `只追求相关性会让推荐同质化（如全推同类商品），用户体验差、信息茧房。多样性让推荐既相关又丰富。

多样性的维度：
- 类目多样性：覆盖不同类目。
- 新颖性：推荐长尾/未接触物品。
- 惊喜度：超出预期但有价值。

提升多样性的方法：

1. MMR（Maximal Marginal Relevance）：
   - 贪心选择：每步选"与查询相关 - λ·与已选最大相似"最大的物品。
   - 公式：MMR = argmax [ Sim(d, q) - λ·max_{d'∈S} Sim(d, d') ]。
   - λ 平衡相关性和多样性，简单有效。

2. DPP（Determinantal Point Process，行列式点过程）：
   - 把候选集建模为点过程，选中子集的概率正比于相似度矩阵的行列式。
   - 行列式衡量子集"体积"，自动惩罚相似物品（相似则行列式小）。
   - 能在相关性和多样性间做全局最优权衡，效果优于 MMR。
   - 有快速近似算法（如滑动窗口 DPP）适合在线。

3. 业务规则：类目打散（每页强制不同类目）、去重、限频次。

4. 多目标优化：相关性 + 多样性 + 新颖性加权，或用强化学习长期奖励。

\`\`\`python
import numpy as np
def mmr(query_sim, item_sim, lam=0.5, k=10):
    selected = []
    candidates = list(range(len(query_sim)))
    for _ in range(k):
        scores = [query_sim[i] - lam * max([item_sim[i][j] for j in selected] or [0])
                  for i in candidates]
        best = candidates[int(np.argmax(scores))]
        selected.append(best)
        candidates.remove(best)
    return selected
\`\`\`

关键：MMR 贪心平衡相关-相似（λ 调节）；DPP 行列式全局最优惩罚相似，效果更好；类目打散是简单业务规则。`,
    keyPoints: ["MMR 贪心选相关-相似最大", "DPP 行列式全局最优惩罚相似", "多样性防信息茧房提体验"],
    followUps: ["DPP 的行列式为什么能衡量多样性？", "多样性和相关性如何权衡？"],
    favorited: false,
  },
  {
    id: "ai-72",
    nodeId: "ai-recsys",
    question: "推荐系统特征工程有哪些要点？用户特征、物品特征、上下文特征如何构造？",
    answer: `推荐系统特征分三大类，特征工程质量直接决定模型上限。

1. 用户特征（User Features）：
   - 静态属性：年龄、性别、地域、设备、会员等级。
   - 行为统计：近 7/30 天点击数、购买数、活跃度、留存。
   - 偏好画像：类目偏好分布、价格偏好、品牌偏好（从历史行为聚合）。
   - 序列特征：最近 N 次点击/购买的物品 id 序列（DIN/Transformer 建模）。
   - Embedding：User2Vec、图 embedding（社交关系）。

2. 物品特征（Item Features）：
   - 静态属性：类目、品牌、价格、标签、上架时间、地域。
   - 内容特征：标题/描述文本 embedding、图像 embedding、视频特征。
   - 统计特征：历史 CTR、CVR、销量、评分、转化率、流行度随时间衰减。
   - 质量特征：退货率、好评率。

3. 上下文特征（Context Features）：
   - 时间：小时、星期、节假日、季节、时段（早中晚）。
   - 场景：请求场景（首页/详情页/搜索）、位置、网络、设备。
   - 实时环境：天气、热门事件。

4. 交叉特征：用户×类目偏好、用户×时段偏好、物品×地域热度。

特征处理：
- 离散特征 Embedding（高基数如物品 id）。
- 连续特征分箱或归一化。
- 序列特征用 attention/Transformer 聚合。
- 在线实时特征用特征服务平台（如 Feast）。

\`\`\`python
# 特征示例（结构化）
features = {
    "user_age": 28, "user_city": "北京",
    "user_click_7d": 120, "user_pref_cat": "数码",
    "item_cat": "手机", "item_price": 4999, "item_ctr_7d": 0.12,
    "hour": 21, "is_weekend": False,
    "user_cat_pref": 0.85,  # 用户对该类目偏好分
}
# 序列特征：最近点击物品 id 列表
recent_items = [101, 205, 88, 1024]
\`\`\`

关键：用户特征看画像+行为序列，物品特征看属性+统计，上下文特征看时间场景；交叉特征和实时特征是工业级关键。`,
    keyPoints: ["用户特征含画像+行为序列", "物品特征含属性+统计+内容 embedding", "上下文含时间场景 + 交叉特征"],
    followUps: ["实时特征如何工程实现？", "行为序列特征如何建模（DIN/Transformer）？"],
    favorited: false,
  },
];

// 生成学习计划：按拓扑顺序，每天 1-2 个节点
function buildSchedule(): ScheduleItem[] {
  // 拓扑顺序：ML 基础 → 经典算法 → 神经网络 → 深度学习 → Transformer/LLM → 应用
  const order = [
    "ai-ml-basic",
    "ai-linear-logistic",
    "ai-tree-rf",
    "ai-svm",
    "ai-nn-basic",
    "ai-dl-framework",
    "ai-cnn",
    "ai-rnn-lstm",
    "ai-cv",
    "ai-recsys",
    "ai-transformer",
    "ai-llm",
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

export const AI_PRESET = {
  topic: "AI 工程师面试全攻略",
  knowledgeTree: AI_NODES,
  questions: AI_QUESTIONS,
  schedule: buildSchedule(),
};
