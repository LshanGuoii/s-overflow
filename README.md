:::
## Overflow 溢出盒子
### Attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |------------------------------ | ------ |
| auto-resize| 是否根据大小变化自动重新计算           | boolean    |  —                            | false   |
| auto-width| 计算容器宽度是否自动计算（需要消耗更多的性能）           | boolean    |  —                            | false   |
| auto-expand| 是否点击展开与收起           | boolean    |  —                            | false   |
| get-tail   |            | HTMLElement    |  —                            | —      |
| get-counter   | 溢出个数dom           | HTMLElement    |  —                            | —      |
| resize-delay   | 大小变化时重新计算延迟（ms）           | Number    |  —                            | 0      |
| min-count   | 支持最小显示数量，当触发时会在元素上添加show-min样式           | Number    |  —                            | 0      |


### Events
| 事件名称   | 说明           | 回调参数   |
|---------- |-------------- |---------- |
| counter      | 溢出个数改变 | 溢出个数, 展开按钮的宽度     |
| overflow      | 是否溢出 | —        |
| collapse-change      | 折叠事件 | 是否折叠     |

### Slots
| 事件名称    | 说明         |
|---------- |------------- |
| default     | 子项      |
| counter   | 溢出个数         |

### Methods
| 方法名称    | 说明         |
|---------- |------------- |
| refresh     | 重新计算，返回Promise      |
| expand   | 展开隐藏的选项         |
| collapse   | 收起隐藏的选项         |
