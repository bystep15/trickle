#按需延迟加载中图片布局升级方案
Tags: FE

##基本原理和注意事项
1. 速度是相对的，取决于用户的感受，显得很快比真的很快更快；
2. 占位图片和最终实际图片大小完全一致；
3. 图片顺序加载（动态调整优先级）；
4. iOS和Android滑动事件的区别（Scroll事件在iOS中滚动过程中不触发）；
5. 对待不固定尺寸的图片用背景图的形式替代img标签，以避免CSS width、height等属性设置对占位空间的影响(CSS中img标签的`height: auto`按图片实际宽高比计算，跟设置的width和height属性无关)。

##关键代码
``` html
<div role="img"></div>
```
``` css
display: inline-block;
width: 图片真实尺寸 ;
max-width: 100%;
padding: 图片高宽比 0 0 0;
background: url(图片地址) no-repeat center center;
background-size: cover;
```

##备注
1. 在移动端和IE9+等同时支持max-width和background-size的浏览器中表现符合预期；
2. 在只支持max-width属性的IE7,8等浏览器中，背景图在实际width大于max-width的情况下，图片居中显示，边缘超出隐藏；
3. 两个属性都不支持的浏览器IE6中，当背景图在实际width大于max-width的情况下，图片占位和显示区域大于容器（暂时无解，从性能优化的角度，不建议出现这种情况）;
4. 在不需要显示区域自适应父级元素空间的终端中，针对上述问题2、3，使用img更合适；
5. 也可保证图片尺寸和显示空间大小完全匹配，则可避免问题2、3（这两个问题本来就违反性能优化原则）。

