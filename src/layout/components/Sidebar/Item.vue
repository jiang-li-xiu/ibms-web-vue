<!--
 * @Author: MJ
 * @Date: 2021-07-13 09:06:02
 * @LastEditors: MJ
 * @LastEditTime: 2021-09-23 15:16:58
 * @Description: 
-->
<script>
export default {
  name: "MenuItem",
  functional: true,
  props: {
    icon: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
  },
  render(h, context) {
    const { icon, title } = context.props;
    const vnodes = [];

    if (icon) {
      vnodes.push(<svg-icon icon-class={icon} />);
    }

    if (title) {
      vnodes.push(
        <span slot="title" title={title}>
          {title}
        </span>
      );
    }
    return vnodes;
  },
};
</script>
