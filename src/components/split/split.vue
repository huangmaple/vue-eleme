<template>
  <div class="split"></div>
</template>

<script>
export default {
  name:'split',
  data(){
    return {}
  }
}
</script>

<style lang="scss" rel="sheetstyle/scss">
  @import "../../common/css/mixin";

  .split{
    position:relative;
    width:100%;
    height:16px;
    background:#f3f5f7;
    border-top:1px solid rgba(7,17,27,0.1);
    border-bottom:1px solid rgba(7,17,27,0.1);
  }
</style>

