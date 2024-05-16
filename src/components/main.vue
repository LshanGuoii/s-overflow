<script>
import deriveCounter from "./deriveCounter";
import { addResizeListener, removeResizeListener } from "../utils/resize-event";
import Clickoutside from "../utils/clickoutside";
import { debounce } from "throttle-debounce";
export default {
  name: "ReOverflow",
  directives: { Clickoutside },
  props: {
    getTail: {
      type: Function,
      required: false,
    },
    getCounter: {
      type: Function,
      required: false,
    },
    autoResize: {
      type: Boolean,
      default: true,
    },
    autoWidth: {
      type: Boolean,
      default: false,
    },
    autoExpand: {
      type: Boolean,
      default: false,
    },
    resizeDelay: {
      type: Number,
      default: 0,
    },
    minCount: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      counter: 0,
      isExpand: false,
    };
  },
  mounted() {
    this.refresh();
    if (this.autoResize) {
      addResizeListener(this.$el, this.onResize);
    }
  },
  beforeDestroy() {
    this.resizeDebounce = null;
    if (this.$el) {
      removeResizeListener(this.$el, this.onResize);
    }
  },
  methods: {
    expand() {
      this.isExpand = true;
      this.$emit("collapse-change", false);
    },
    collapse() {
      this.isExpand = false;
      this.$emit("collapse-change", true);
    },
    onResize(entry) {
      if (entry && entry.contentRect) {
        if (this.width === entry.contentRect.width) {
          return;
        }
        this.width = entry.contentRect.width;
      }
      if (this.resizeDelay && this.resizeDelay > 0) {
        if (!this.resizeDebounce) {
          this.resizeDebounce = debounce(this.resizeDelay, this.refresh);
        }
        this.resizeDebounce();
        return;
      }
      this.resizeDebounce = null;
      this.refresh();
    },
    getCounterDom() {
      if (this.getCounter) {
        return this.getCounter();
      }
      return this.$refs.counter;
    },
    getTailDom() {
      if (this.$slots.tail && this.getTail) {
        return this.getTail();
      }
      return null;
    },
    doCalc(forceCalcWidth = false) {
      if (this.isExpand) {
        return;
      }
      try {
        this.totalCount = deriveCounter(
          this.$el,
          this.getCounterDom(),
          this.getTailDom(),
          {
            autoWidth: this.autoWidth || forceCalcWidth,
            minCount: this.minCount,
            updateCounter: (counter, counterWidth) => {
              this.counter = counter;
              this.$emit("counter", counter, counterWidth);
            },
            onUpdateOverflow: (overflow) => {
              this.$emit("overflow", overflow);
            },
          }
        );
      } catch (e) {
        console.warn("refresh deriveCounter error", e);
      }
    },
    refresh(forceCalcWidth) {
      if (this.isExpand) {
        return Promise.resolve();
      }
      if (!this.refreshPromise) {
        this.refreshPromise = new Promise((resolve) => {
          const run = () => {
            this.doCalc(forceCalcWidth);
            resolve();
            this.refreshPromise = null;
          };
          if (window.requestAnimationFrame) {
            requestAnimationFrame(run);
            return;
          }
          this.$nextTick(run);
        });
      }
      return this.refreshPromise;
    },
  },
  render() {
    this.$nextTick(this.refresh);
    const directives = [];
    if (this.autoExpand) {
      directives.push({
        name: "Clickoutside",
        value: this.collapse,
      });
    }
    return (
      <div
        {...{ directives }}
        class={["s-overflow", this.isExpand && "is-expand"]}
      >
        {this.$slots.default}
        {this.isExpand ? null : this.$scopedSlots.counter ? (
          this.$scopedSlots.counter(this.counter)
        ) : (
          <span
            ref="counter"
            class="s-overflow__counter"
            onClick={this.autoExpand ? this.expand : () => {}}
          >
            {this.counter}
          </span>
        )}
      </div>
    );
  },
};
</script>
