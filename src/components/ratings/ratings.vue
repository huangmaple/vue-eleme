<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="36" :score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <ratingselect @select="selectRating" @toggle="toggleContent" :selectType="selectType"
        :onlyContent="onlyContent" :ratings="ratings">
      </ratingselect>
      <div class="rating-wrapper">
        <ul>
          <li v-show="needShow(rating.rateType,rating.text)" v-for="(rating,index) in ratings" class="rating-item" :key="index">
            <div class="avatar">
              <img :src="rating.avatar" width="28" height="28" alt="">
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"></star>
                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                <span class="fa" :class="{'fa-thumbs-up':rating.rateType === 0,'fa-thumbs-down':rating.rateType === 1}"></span>
                <span class="item" v-for="(item,index) in  rating.recommend" :key="index">{{item}}</span>
              </div>
              <div class="time">{{rating.rateTime | formatDate}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll';
import star from '../star/star.vue';
import split from '../split/split.vue';
import ratingselect from '../ratingselect/ratingselect.vue';
import {commonFormatDate} from '../../common/js/date.js';

const ALL = 2;

export default {
  name:'ratings',
  props:{
    seller:{
      type:Object
    }
  },
  data(){
    return {
      ratings: [],
      selectType: ALL,
      onlyContent: true
    }
  },
  created(){
    this.$http.get('/static/data.json').then(response => {
      if(response.status == 200){
        response = response.data;
        this.ratings = response.ratings;
        // console.log('ratings',this.ratings);
        this.$nextTick(() => {
          this.scroll = new BScroll(this.$refs.ratings,{
            click:true
          });
        });
      }
    });
  },
  methods:{
    selectRating(type){
      this.selectType = type;
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
  filters:{
    formatDate(time){
      let date = new Date(time);
      return commonFormatDate(date,'yyyy-MM-dd hh:mm');
    }
  },
  components:{
    star,
    split,
    ratingselect
  }
}
</script>

<style lang="scss" rel="sheetstyle/scss">
@import '../../common/css/mixin.scss';

  .ratings{
    position:absolute;
    left:0;
    top:174px;
    bottom:0;
    width:100%;
    overflow:hidden;
    .overview{
      display:flex;
      padding:18px 0;
      .overview-left{
        flex:0 0 137px;
        padding:6px 0;
        width:137px;
        border-right:1px solid rgba(7,17,27,0.1);
        text-align:center;
        @media only screen and (max-width:320px){
          flex:0 0 120px;
          width:120px;
        }
        .score{
          font-size:24px;
          color:rgb(255,153,0);
          line-height:28px;
          margin-bottom:6px;
        }
        .title{
          font-size:12px;
          color:rgb(7,17,27);
          line-height:18px;
          margin-bottom:8px;
        }
        .rank{
          font-size:10px;
          color:rgb(7,17,27);
          line-height:10px;
        }
      }
      .overview-right{
        flex:1;
        padding:6px 24px;
        text-align:center;
        @media only screen and (max-width: 320px) {
          padding-left: 6px;
        }
        .score-wrapper{
          font-size:0;
          margin-bottom:8px;
          .title{
            display:inline-block;
            font-size:12px;
            color:rgb(7,17,27);
            line-height:18px;
            vertical-align:top;
          }
          .star{
            display:inline-block;
            margin:0 12px;
            vertical-align:top;
          }
          .score{
            display:inline-block;
            font-size:12px;
            color:rgb(255,153,0);
            vertical-align:top;
          }
        }
        .delivery-wrapper{
          font-size:0;
          .title{
            vertical-align:top;
            display:inline-block;
            font-size:12px;
            color:rgb(7,17,27);
            line-height:18px;
            margin-right:12px;
          }
          .delivery{
            vertical-align:top;
            font-size:12px;
            color:rgb(147,153,159);
            line-height:18px;
          }
        }
      }
    }
    .rating-wrapper{
      position:relative;
      margin:0 18px;
      .rating-item{
        display:flex;
        padding:18px 0;
        border-bottom:1px solid rgba(7,17,27,0.1);
        .avatar{
          flex:0 0 28px;
          width:28px;
          margin-right:12px;
          img{
            border-radius:50%;
          }
        }
        .content{
          flex:1;
          font-size:0;
          .name{
            font-size:10px;
            color:rgb(7,17,27);
            line-height:12px;
            vertical-align:top;
            margin-bottom:4px;
          }
          .star-wrapper{
            margin-bottom:6px;
            .star{
              display:inline-block;
              margin-right:6px;
            }
            .delivery{
              display:inline-block;
              font-size:10px;
              font-weight:200;
              color:rgb(147,153,159);
              line-height:12px;
              vertical-align:top;
            }
          }
          .text{
            font-size:12px;
            color:rgb(7,17,27);
            line-height:18px;
            vertical-align:top;
            margin-bottom:8px;
          }
          .recommend{
            width:100%;
            height:20px;
            overflow:hidden;
            .fa-thumbs-up, .fa-thumbs-down{
              display:inline-block;
              font-size:12px;
              line-height:16px;
              vertical-align:top;
            }
            .fa-thumbs-up{
              color:rgb(0,160,220);
            }
            .fa-thumbs-down{
              color:rgb(183,187,191);
            }
            .item{
              display:inline-block;
              padding:0 6px;
              margin-left:8px;
              font-size:9px;
              color:rgb(147,153,159);
              line-height:16px;
              border:1px solid rgba(7,17,27,0.1);
              border-radius:2px;
              background-color:rgb(255,255,255);

            }
          }
          .time{
            position:absolute;
            right:0;
            top:0;
            font-size:10px;
            font-weight:200;
            color:rgb(147,153,159);
            line-height:12px;
          }
        }
      }
    }
  }
</style>