#按需延迟加载中图片布局升级方案
Tags: FE

##基本原理和注意事项
1. 速度是相对的，取决于用户的感受，显得很快比真的很快更快；
2. 占位图片和最终实际图片大小完全一致；
3. 图片顺序加载（动态调整优先级，类似一个堆栈，出栈会清空所有相同key的元素）；
4. iOS和Android滑动事件的区别（Scroll事件在iOS7中滚动过程中不触发，iOS8中会触发，iOS6-未测试，为减少代码复杂性，不解决此问题，直接使用Scroll事件做监听）；
5. 对待不固定尺寸的图片用背景图的形式替代img标签，以避免CSS width、height等属性设置对占位空间的影响(CSS中img标签的`height: auto`按图片实际宽高比计算，跟设置的width和height属性无关)。

##关键代码
第一种情况，img显示的最终尺寸与width和height属性所标记的尺寸不一致。
``` html
<div role="img" class="lazyload-img" style="width: 图片宽度px;">
    <div style="padding: 图片高宽百分比% 0 0 0;">
        <img data-lazyload-original="图片路径" />
    </div>
</div>
```
``` css
.lazyload-img {
    display: inline-block;
    max-width: 100%;
}

.lazyload-img > div {
    position: relative;
    display: block;
    width: 100%;
    background: #999 no-repeat center center;
    background-size: cover;
}

.lazyload-img > div > img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url(占位图片地址) no-repeat center center;
    background-size: 63px 75px;
    /* 下面会适当加快图片的渲染，但由于手机浏览器渲染问题，会导致重复渲染（不请求）
    -webkit-transform: translate3d(0, 0, 0);
    -moz-transform: translate3d(0, 0, 0);
    -ms-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
    */
}
```
第二种情况，img显示的尺寸是固定的，比如已经通过CSS样式确定
``` html
<img src="" data-lazyload-original="真实图片地址" data-lazyload-state="interactive|loading|complete" />
```

##备注
1. 在移动端和IE9+等同时支持max-width和background-size的浏览器中表现符合预期；
2. 在只支持max-width属性的IE7,8等浏览器中，背景图在实际width大于max-width的情况下，图片居中显示，边缘超出隐藏；
3. 两个属性都不支持的浏览器IE6中，当背景图在实际width大于max-width的情况下，图片占位和显示区域大于容器（暂时无解，从性能优化的角度，不建议出现这种情况）;
4. 在不需要显示区域自适应父级元素空间的终端中，针对上述问题2、3，使用img更合适；
5. 也可保证图片尺寸和显示空间大小完全匹配，则可避免问题2、3（这两个问题本来就违反性能优化原则）。

