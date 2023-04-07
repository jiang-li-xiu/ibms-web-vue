<!--
 * @Author: Yelucc
 * @Date: 2021-07-22 16:35:04
 * @LastEditors: MJ
 * @LastEditTime: 2021-09-23 12:03:37
 * @Description: 
-->
<template>
  <codemirror v-model="code" :options="cmOption" />
</template>

<script>
import dedent from "dedent";
import { codemirror } from "vue-codemirror";
// language
import "codemirror/mode/javascript/javascript.js";
// theme css
import "codemirror/theme/monokai.css";
// require active-line.js
import "codemirror/addon/selection/active-line.js";
// styleSelectedText
import "codemirror/addon/selection/mark-selection.js";
import "codemirror/addon/search/searchcursor.js";
// hint
import "codemirror/addon/hint/show-hint.js";
import "codemirror/addon/hint/show-hint.css";
import "codemirror/addon/hint/javascript-hint.js";
import "codemirror/addon/selection/active-line.js";
// highlightSelectionMatches
import "codemirror/addon/scroll/annotatescrollbar.js";
import "codemirror/addon/search/matchesonscrollbar.js";
import "codemirror/addon/search/searchcursor.js";
import "codemirror/addon/search/match-highlighter.js";
// keyMap
import "codemirror/mode/clike/clike.js";
import "codemirror/addon/edit/matchbrackets.js";
import "codemirror/addon/comment/comment.js";
import "codemirror/addon/dialog/dialog.js";
import "codemirror/addon/dialog/dialog.css";
import "codemirror/addon/search/searchcursor.js";
import "codemirror/addon/search/search.js";
import "codemirror/keymap/sublime.js";
// foldGutter
import "codemirror/addon/fold/foldgutter.css";
import "codemirror/addon/fold/brace-fold.js";
import "codemirror/addon/fold/comment-fold.js";
import "codemirror/addon/fold/foldcode.js";
import "codemirror/addon/fold/foldgutter.js";
import "codemirror/addon/fold/indent-fold.js";
import "codemirror/addon/fold/markdown-fold.js";
import "codemirror/addon/fold/xml-fold.js";

export default {
  name: "CodeEditor",
  title: "Mode: text/javascript & Theme: monokai",
  components: {
    codemirror,
  },
  props: {
    codeCall: {
      type: String,
    },
    cmOption: {
      type: Object,
      default: () => {
        return {
          tabSize: 2,
          styleActiveLine: false,
          lineNumbers: true,
          styleSelectedText: false,
          line: true,
          foldGutter: true,
          gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
          highlightSelectionMatches: {
            showToken: /\w/,
            annotateScrollbar: true,
          },
          mode: "text/javascript",
          // hint.js options
          cursorHeight: 1,
          hintOptions: {
            // 当匹配只有一项的时候是否自动补全
            completeSingle: false,
          },
          //快捷键 可提供三种模式 sublime、emacs、vim
          keyMap: "sublime",
          matchBrackets: true,
          showCursorWhenSelecting: true,
          theme: "monokai",
          extraKeys: { Ctrl: "autocomplete" },
        };
      },
    },
  },
  data() {
    return {
      code: dedent`
                    // 请在此处编写您的分析脚本（当前仅支持Javascript）,脚本使用核心代码模式，请在函数中完成分析。
                    // 在下方表格中声明所需的变量和变量来源
                    `,
    };
  },
  created() {
    if (this.codeCall) {
      this.code = this.codeCall;
    }
  },
  mounted() {
    setTimeout(() => {
      (this.styleSelectedText = true), (this.cmOption.styleActiveLine = true);
    }, 1800);
  },
  watch: {
    code(n) {
      this.$emit("update:code", n);
    },
  },
};
</script>

<style lang="scss" scoped>
.CodeMirror-focused .cm-matchhighlight {
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFklEQVQI12NgYGBgkKzc8x9CMDAwAAAmhwSbidEoSQAAAABJRU5ErkJggg==);
  background-position: bottom;
  // background-repeat: repeat-x;
}
.cm-matchhighlight {
  background-color: lightgreen;
}
.CodeMirror-selection-highlight-scrollbar {
  background-color: green;
}
</style>
