# LOFTER 作者页文章收起 / 展开

一个简单的油猴（Tampermonkey）脚本，让 LOFTER 作者页的长文默认收起，方便浏览文章列表。

## 安装

在已安装 Tampermonkey 的浏览器中，点击下面的链接，然后在油猴页面确认安装：

**[安装脚本](https://raw.githubusercontent.com/lyfhxsy/lofter-collapse/main/lofter-collapse.user.js)**

也可以打开仓库里的 `lofter-collapse.user.js`，复制全部代码，在油猴的「添加新脚本」页面粘贴并保存。

安装后刷新 LOFTER 作者页即可。

## 功能

- 长文默认保留标题与开头约 240 像素的预览。
- 点击「展开全文 ↓」在当前页面展开。
- 展开后可从上方或末尾点击「收起正文 ↑」。
- 从文章末尾收起时返回该文章开头，方便继续浏览。
- 保留标签、评论、热度和翻页功能。
- 单篇文章详情页及归档页不折叠。
- 无外部依赖，不发送网络请求。

## 调整预览高度

修改脚本中的数值即可，单位为像素：

```javascript
const PREVIEW_HEIGHT = 240;
```

## 适用范围

按 `zhenrongyiya.lofter.com` 作者页的模板结构适配，文章容器选择器为 `.block.article > .main > .content`。使用相同结构的主题也适用；其他主题可能需要调整选择器。

每次刷新或翻页后，长文重新默认收起，不保存展开状态。
