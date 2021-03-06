<template>
  <transition name="move">
    <div v-show="showFlag" class="food" ref="food">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image" alt="">
          <div @click="hide" class="icon-back">
            <i class="fa fa-angle-left"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="new"><span class="sign">￥</span>{{food.price}}</span>
            <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <cartcontrol :food="food" v-on:add="addFood"></cartcontrol>
          </div>
          <transition name="fade">
            <div @click.stop.prevent="addFirst" class="buy" v-show="!food.count || food.count===0">加入购物车</div>
          </transition>
        </div>
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
          <div class="title">商品信息</div>
          <p class="text">{{food.info}}</p>
        </div>
        <split></split>
        <div class="rating">
          <div class="title">商品评价</div>
          <ratingselect @toggle="toggleContent" @select="selectRating" :selectType="selectType" :onlyContent="onlyContent" :desc="desc" :ratings="food.ratings"></ratingselect>
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li v-show="needShow(rating.rateType,rating.text)" v-for="(rating,index) in food.ratings" class="rating-item border-1px" :key="index">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img :src="rating.avatar" width="12px" height="12px" alt="" class="avatar">
                </div>
                <div class="time">{{rating.rateTime | formaDate}}</div>
               <p class="text">
                 <span class="fa" :class="{'fa-thumbs-up':rating.rateType === 0,'fa-thumbs-down':rating.rateType === 1}"></span>{{rating.text}}
               </p>
              </li>
            </ul>
            <div class="no-ratings" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Vue from 'vue';
import BScroll from 'better-scroll';
import cartcontrol from '../cartcontrol/cartcontrol.vue';
import split from '../split/split.vue';
import ratingselect from '../ratingselect/ratingselect.vue';
import {commonFormatDate} from '../../common/js/date.js';

const ALL = 2;

export default {
  name:"food",
  props:{
    food:{
      type:Object
    }
  },
  data(){
    return {
      showFlag: false,
      selectType: ALL,
      onlyContent: false,
      desc: {
        all: '全部',
        positive: '推荐',
        nagative: '吐槽'
      }
    }
  },
  methods:{
    show(){
      this.showFlag = true;

      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.food, {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      });
    },
    hide(){
      this.showFlag = false;
    },
    addFirst(event){
      console.log(event._constructed)
      if(!event._constructed){ //BS派发的事件中event._constructed为true，原生点击事件中没有这个属性。
        return;
      }
      this.$emit('add', event.target);
      Vue.set(this.food, 'count', 1);
    },
    addFood(target){
      this.$emit('add',target);
    },
    selectRating(type){
      this.selectType = type;
      // this.$nextTick(() => {    // Vue的DOM更新是异步的
      //   this.scroll.refresh();  // 改变高度后让BS重新计算才正确
      // });
    },
    toggleContent(){
      this.onlyContent = !this.onlyContent;
    },
    needShow(type,text){
      if(this.onlyContent && !text){  // 如果只显示内容，但无内容时，返回false
        return false;
      }else if(this.selectType == ALL){  // 如果是显示全部内容，每条直接返回true
        return true;
      }else{
        return type === this.selectType;
      }
    }
  },
  created(){
    
  },
  filters:{
    formaDate(time){
      let date = new Date(time);
      return commonFormatDate(date,'yyyy-MM-dd hh:mm')
    }
  },
  components:{
    cartcontrol,
    split,
    ratingselect
  }
}
</script>

<style lang="scss" rel="sheetstyle/scss">
  @import "../../common/css/mixin";

  .food{
    position:fixed;
    left:0;
    top:0;
    bottom:48px;
    z-index:30;
    width:100%;
    background:#fff;
    transform:translate3d(0,0,0);
    &.move-enter-active, &.move-leave-active {
      transition: all 0.2s linear;
    }
    &.move-enter, &.move-leave-active {
      transform: translate3d(100%, 0, 0);
    }
    .image-header{
      position:relative;
      width:100%;
      height:0;
      padding-top:100%;  /* 根据宽度计算, 所以显示的图片宽高相等（padding区域也显示图片）*/
      img{
        position:absolute;
        left:0;
        top:0;
        width:100;
        height:100%;
      }
      .icon-back{
        position:absolute;
        left:10px;
        top:10px;
        .fa-angle-left{
          display:block;
          padding:10px;
          font-size:20px;
          color:#fff;
        }
      }
    }
    .content{
      position:relative;
      padding:18px;
      .title{
        height:14px;
        font-size:14px;
        line-height:14px;
        font-weight:700;
        color:rgb(7,17,27);
        margin-bottom:8px;
      }
      .detail{
        font-size:0px;
        line-height:10px;
        height:10px;
        margin-bottom:18px;
        .sell-count, .rating{
          font-size:10px;
          color:rgb(147,153,159);
        }
        .sell-count{
          margin-right:12px;
        }
      }
      .price{
        font-size:0px;
        line-height:19px;
        .sign{
          font-size:11px;
        }
        .new{
          margin-right:8px;
          font-weight:900;
          font-size:16px;
          color:#fa3a12;
        }
        .old{
          text-decoration:line-through;
          font-size:10px;
          font-weight:700;
          color:rgb(147,153,159);
        }
      }
      .cartcontrol-wrapper{
        position:absolute;
        right:12px;
        bottom:10px;
      }
      .buy{
        position:absolute;
        right:18px;
        bottom:18px;
        z-index:10;
        height:24px;
        line-height:24px;
        padding:0 12px;
        box-sizing:border-box;
        border-radius:12px;
        font-size:10px;
        color:#fff;
        background:rgb(0,160,220);
        opacity:1;
        &.fade-enter-active, &.fade-leave-active {
          transition: all .2s;
        }
        &.fade-enter, &.fade-leave-to {
          opacity: 0;
          z-index: -1;
        }
      }
    }
    .info{
      position:relative;
      padding:18px;
      .title{
        line-height:14px;
        font-size:14px;
        margin-bottom:6px;
        color:rgb(7,17,27);
      }
      .text{
        padding:0 8px;
        font-size:12px;
        font-weight:200;
        color:rgb(77,85,93);
        line-height:24px;
      }
    }
    .rating{
      position:relative;
      padding-top:18px;
      .title{
        line-height:14px;
        margin-left:18px;
        font-size:14px;
        color:rgb(7,17,27);
      }
      .rating-wrapper{
        padding:0 18px;
        .rating-item{
          position:relative;
          padding:16px 0;
          @include border-1px(rgba(7,17,27,0.1));
          .user{
            position:absolute;
            right:0;
            top:16px;
            line-height:12px;
            font-size:0;
            .name{
              display:inline-block;
              font-size:10px;
              color:rgb(147,153,159);
              margin-right:6px;
              vertical-align:top;
            }
            .avatar{
              border-radius:50%;
            }
          }
          .time{
            font-size:10px;
            line-height:12px;
            color:rgb(147,153,159);
            margin-bottom:6px;
          }
        }
        .text{
          line-height:24px;
          font-size:12px;
          color:rgb(7,17,27);
          .fa-thumbs-up, .fa-thumbs-down{
            font-size:12px;
            line-height:16px;
            margin-right:4px
          }
          .fa-thumbs-up{
            color:rgb(0,160,220);
          }
          .fa-thumbs-down{
            color:rgb(147,153,159);
          }
        }
      }
    }
  }
</style>
