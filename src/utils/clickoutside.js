import Vue from 'vue';
import { on } from './dom';

const nodeList = [];
const ctx = '@@clickoutsideContext';

let startClick;
let seed = 0;

!Vue.prototype.$isServer && on(document, 'mousedown', e => (startClick = e));

!Vue.prototype.$isServer && on(document, 'mouseup', e => {
  nodeList.forEach((node, index) => {
    if (!node[ctx]) {
      nodeList.splice(index, 1);
      return;
    }
    node[ctx].documentHandler(e, startClick);
  });
});

function createDocumentHandler(el, binding, vnode) {
  return function(mouseup = {}, mousedown = {}) {
    if (!vnode ||
      !vnode.context ||
      !mouseup.target ||
      !mousedown.target ||
      el.contains(mouseup.target) ||
      el.contains(mousedown.target) ||
      el === mouseup.target ||
      (vnode.context.popperElm &&
      (vnode.context.popperElm.contains(mouseup.target) ||
      vnode.context.popperElm.contains(mousedown.target)))) return;

    if (binding.expression &&
      el[ctx].methodName &&
      vnode.context[el[ctx].methodName]) {
      vnode.context[el[ctx].methodName](mouseup, mousedown);
    } else {
      el[ctx].bindingFn && el[ctx].bindingFn(mouseup, mousedown);
    }
  };
}

function clearNullNodes() {
  let len = nodeList.length;

  for (let i = 0; i < len; i++) {
    if (!nodeList[i][ctx]) {
      nodeList.splice(i, 1);
      clearNullNodes();
      break;
    }
  }
}

/**
 * v-clickoutside
 * @desc 点击元素外面才会触发的事件
 * @example
 * ```vue
 * <div v-element-clickoutside="handleClose">
 * ```
 */
export default {
  bind(el, binding, vnode) {
    if (binding.value === false) {
      return;
    }
    const id = seed++;
    el[ctx] = {
      id,
      documentHandler: createDocumentHandler(el, binding, vnode),
      methodName: binding.expression,
      bindingFn: binding.value
    };
    if (el.dataset) {
      el.dataset.clickOutId = id;
    }
    nodeList.push(el);
  },

  update(el, binding, vnode) {
    if (el[ctx]) {
      el[ctx].documentHandler = createDocumentHandler(el, binding, vnode);
      el[ctx].methodName = binding.expression;
      el[ctx].bindingFn = binding.value;
    }
  },

  unbind(el) {
    const id = el[ctx] ? el[ctx].id : el.dataset ? Number(el.dataset.clickOutId) : null;
    if (id) {
      let len = nodeList.length;

      for (let i = 0; i < len; i++) {
        if (nodeList[i][ctx] && nodeList[i][ctx].id === id) {
          nodeList.splice(i, 1);
          break;
        }
      }
    }

    delete el[ctx];
    clearNullNodes();
  }
};
