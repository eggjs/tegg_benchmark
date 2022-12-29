# benchmark

测试 egg/tegg 在极端性能场景下的性能测试

测试环境
型号名称：	MacBook Pro
型号标识符：	MacBookPro16,1
处理器名称：	六核Intel Core i7
处理器速度：	2.6 GHz
处理器数目：	1
核总数：	6
L2缓存（每个核）：	256 KB
L3缓存：	12 MB
超线程技术：	已启用
内存：	16 GB

启用 4 worker


# 性能测试
## Hello World
运行条件：

- egg 有 10000 个 service 对象
- tegg1.x 有 ${对象数量} 个 ContextProto
- tegg3.x 有 ${对象数量} 个 SingletonProto

测试结果：

- egg 比较平稳，但是性能较差。10000 个 service 对象对于 egg 来说是较大的压力。
- tegg1.x 性能衰减的很厉害，原因是对象越多初始化消耗的时间也就越多。
- tegg3.x 性能很高，原因是所有对象都是单例不会有额外的初始化时间。
  | 框架 | 对象数量 | QPS |
  | --- | --- | --- |
  | egg | 1 | 454.05 |
  | egg | 10 | 477.99 |
  | egg | 100 | 464.37 |
  | egg | 1000 | 431.99 |
  | egg | 10000 | 417.15 |
  | tegg1.x | 1 | 14737.03 |
  | tegg1.x | 10 | 8883.41 |
  | tegg1.x | 100 | 1641.77 |
  | tegg1.x | 1000 | 141.21 |
  | tegg1.x | 10000 | 8.51 |
  | tegg3.x | 1 | 17257.45 |
  | tegg3.x | 10 | 17991.89 |
  | tegg3.x | 100 | 17741.08 |
  | tegg3.x | 1000 | 18946.36 |
  | tegg3.x | 10000 | 18534.56 |


## Hello World + Service
运行条件：

- egg 有 10000 个 service 对象，并在 controller 访问了 ${对象数量} 个 service。
- tegg1.x 有 ${对象数量} 个 ContextProto，并在 controller 访问了 ${对象数量} 个 ContextProto。
- tegg3.x 有 ${对象数量} 个 SingletonProto，并在 controller 访问了 ${对象数量} 个 SingletonProto。

测试结果：

- egg 比较平稳，性能有衰减，加上了业务耗时，衰减正常。
- tegg1.x 性能衰减的很厉害，原因是对象越多初始化消耗的时间也就越多。
- tegg3.x 在 1000 个对象时性能还比较好，在 10000 个对象时性能衰减到了和 egg 一样的水平。（这里应该有优化的空间！）
  | 框架 | 对象数量 | QPS |
  | --- | --- | --- |
  | egg | 1 | 446.15 |
  | egg | 10 | 402.90 |
  | egg | 100 | 436.43 |
  | egg | 1000 | 310.44 |
  | egg | 10000 | 89.44 |
  | tegg1.x | 1 | 11761.98 |
  | tegg1.x | 10 | 9407.04 |
  | tegg1.x | 100 | 1549.32 |
  | tegg1.x | 1000 | 137.58 |
  | tegg1.x | 10000 | 8.02 |
  | tegg3.x | 1 | 18203.51 |
  | tegg3.x | 10 | 18647.91 |
  | tegg3.x | 100 | 16153.36 |
  | tegg3.x | 1000 | 4764.63 |
  | tegg3.x | 10000 | 471.16 |
