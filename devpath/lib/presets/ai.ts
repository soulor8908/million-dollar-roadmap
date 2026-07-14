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
