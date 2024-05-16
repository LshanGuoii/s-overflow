const hiddenAttr = 'v-hidden';
export const showMinClass = 'show-min';
const getWidth = (el, autoWidth = false) => {
  if (!el) {
    return 0;
  }
  let result = 0;
  let _display, _visibility, _hiddenAttrChildren;
  // 计算容器宽度是否自动计算
  if (autoWidth) {
  // NOTE: 1 DOM access here
    _display = el.style.display;
    _visibility = el.style.visibility;
    // 这样的操作是为了暂时调整元素的显示方式和可见性，以便在获取元素宽度之前，确保元素的显示不会影响到计算结果。
    el.style.display = 'flex'; el.style.visibility = 'hidden';
    _hiddenAttrChildren = [];
    if (el.children) {
      Array.from(el.children).forEach(child => {
        // 不可见
        if (child.hasAttribute(hiddenAttr)) {
          child.removeAttribute(hiddenAttr);
          _hiddenAttrChildren.push(child);
        }
      });
    }
    // eslint-disable-next-line no-unused-vars
    const calcWidthToForceRepaint = el.offsetWidth;
  }

  let outerWidth = 0;
  if (window.getComputedStyle) {
    const styles = window.getComputedStyle(el);
    outerWidth = parseFloat(styles.marginLeft) + parseFloat(styles.marginRight);
  }

  if (el.getBoundingClientRect) {
    result = el.getBoundingClientRect().width + outerWidth;
  } else {
    result = el.offsetWidth + outerWidth;
  }
  if (autoWidth) {
  // reset element styles
    _hiddenAttrChildren.forEach(child => child.setAttribute(hiddenAttr, ''));
    
    el.style.display = _display; el.style.visibility = _visibility;
  }
  return result;
};

export default (dom, counterDom, tailDom, options) => {

  if (!dom || !counterDom) return;
  if (counterDom.hasAttribute(hiddenAttr)) {
    counterDom.removeAttribute(hiddenAttr);
  }

  dom.classList.remove(showMinClass);

  const { children } = dom;
  const containerWidth = getWidth(dom, options ? options.autoWidth : false);
  const childWidths = [];
  let childWidthSum = tailDom ? getWidth(tailDom) : 0;
  let overflow = false;
  const len = dom.children.length - (tailDom ? 1 : 0);
  let restCount;
  let minCount = options.minCount || 0;
  minCount = Math.min(minCount, len);

  const counterWidth = getWidth(counterDom);

  for (let i = 0; i < len - 1; ++i) {
    if (i < 0) continue;
    const child = children[i];
    // 隐藏元素
    if (overflow) {
      if (!child.hasAttribute(hiddenAttr)) {
        child.setAttribute(hiddenAttr, '');
      }
      continue;
    } else if (child.hasAttribute(hiddenAttr)) {
      child.removeAttribute(hiddenAttr);
    }
    const childWidth = getWidth(child);
    // 记录宽度总和
    childWidthSum += childWidth;
    // 记录每个元素宽度
    childWidths[i] = childWidth;
    // 是否达到溢出条件
    const isExceedWidth = childWidthSum > containerWidth;
    if (isExceedWidth && (i >= minCount || minCount <= 0)) {
      for (let j = i; j >= 0; --j) {
        restCount = len - 1 - j;
        childWidthSum -= childWidths[j];
        const inContainer = childWidthSum + counterWidth <= containerWidth;
        // 目前元素达到溢出条件  （超容器 || 一个元素 || (最小显示>0 && 当前元素位置等于最小数量 && 未溢出)）
        if (inContainer || j === 0 || (minCount > 0 && j === minCount && !inContainer)) {
          overflow = true;
          i = j - 1;
          if (tailDom) {
            // tail too long or 1st element too long
            // we only consider tail now
            if (i === -1) {
              tailDom.style.maxWidth = `${containerWidth - counterWidth}px`;
              tailDom.style.boxSizing = 'border-box';
            } else {
              tailDom.style.maxWidth = '';
            }
          }
          break;
        }
      }
    }
  }

  if (minCount > 0 && overflow) {
    if (childWidthSum + counterWidth > containerWidth) {
      dom.classList.add(showMinClass);
    }
  }

  const { onUpdateOverflow, updateCounter } = options || {};
  if (!overflow) {
    if (onUpdateOverflow !== undefined) {
      onUpdateOverflow(false);
    }
    counterDom.setAttribute(hiddenAttr, '');
  } else {
    if (onUpdateOverflow !== undefined) {
      onUpdateOverflow(true);
    }
  }
  if (updateCounter !== undefined) {
    updateCounter(restCount || 0, counterWidth);
  }
  return len;
  
};
