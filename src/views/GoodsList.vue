<template>
  <div >
    <nav-header></nav-header>
    <nav-bread>
        <span slot="bread">Goods</span>
    </nav-bread>
          <div class="accessory-result-page accessory-page">
        <div class="container">
          <div class="filter-nav">
            <span class="sortby">Sort by:</span>
            <a href="javascript:void(0)" class="default cur">Default</a>
            <a href="javascript:void(0)" class="price" @click="sortGoods">Price 
              <svg class="icon icon-arrow-short" :class="{'sort-up':sortflag}"><use xlink:href="#icon-arrow-short"></use></svg>
            </a>
            <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
          </div>
          <div class="accessory-result">
            <!-- filter -->
            <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterby}">
              <dl class="filter-price">
                <dt>Price:</dt>
                <dd><a href="javascript:void(0)" :class="{cur:priceChecked === 'all'}" @click="setPriceFilter('all')">All</a></dd>
                <dd v-for="(item,index) in priceFilter"  :key="index">
                  <a href="javascript:void(0)" @click="setPriceFilter(index)" :class="{cur:priceChecked === index}">{{item.startPrice}} - {{item.endPrice}}</a>
                </dd>
              </dl>
            </div>

            <!-- search result accessories list -->
            <div class="accessory-list-wrap">
              <div class="accessory-list col-4">
                <ul>
                  <li v-for="item in goodsList" :key="item.productId">
                    <div class="pic">
                      <a href="#"><img alt="" v-lazy="'/static/'+item.productImage"></a>
                    </div>
                    <div class="main">
                      <div class="name">{{item.productName}}</div>
                      <div class="price">{{item.salePrice}}</div>
                      <div class="btn-area">
                        <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                      </div>
                    </div>
                  </li>
                </ul>
                <div class="loadmore" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30">
                  <img src="../assets/loading-spinning-bubbles.svg" v-show="loading">
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
       
      <!-- <div class="md-overlay" v-show="overLayFlag" ></div> -->
      <modal :mdShow="mdShow" v-on:close="closeModal">
        <p slot="message">请先登录， 否则无法加入到购物车中!</p>
        <div slot="btnGroup">
          <a class="btn btn--m" @click="mdShow = false" href="javasript:;">关闭</a>
        </div>
      </modal>
      <modal :mdShow="mdShowCart" v-on:close="closeModal">
        <p slot="message">
          <svg class="icon-status-ok">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
          </svg>
          <span>加入购物车成功</span>
        </p>
        <div slot="btnGroup">
          <a class="btn btn--m" @click="mdShowCart = false" href="javasript:;">继续购物</a>
          <router-link to="/cart" class="btn btn--m" href="javasript:;">查看购物车</router-link>
        </div>
      </modal>
    <nav-footer></nav-footer>
  </div>
</template>

<script>
import '../assets/css/base.css'
import '../assets/css/product.css'
import '../assets/css/base.styl'
import '../assets/css/login.css'
import NavHeader from '../components/NavHeader'
import NavFooter from '../components/NavFooter'
import NavBread from '../components/NavBread'
import Modal from '../components/Modal'
import axios from 'axios'
export default {
  name: 'GoodsList',
  data(){
    return {
      goodsList:[],
      priceChecked:'all',
      filterby:false,
      overLayFlag:false,
      sortflag:true,
      page:1,
      pageSize:4,
      busy:true,
      loading:false,
      mdShow:false,
      mdShowCart:false,
      priceFilter:[
        {
          startPrice:0.00,
          endPrice:100
        },
        {
          startPrice:100.00,
          endPrice:500
        },
        {
          startPrice:500.00,
          endPrice:1000
        },
        {
          startPrice:1000.00,
          endPrice:5000
        }
      ]
    }
  },
  components:{
      NavHeader,NavFooter,NavBread,Modal
  },
  mounted(){
      this.getGoodsList()
  },
  methods:{
    
      getGoodsList(flag){
        let param = {
          page:this.page,
          pageSize:this.pageSize,
          sort:this.sortflag?1:-1,
          priceLevel:this.priceChecked
        }
        this.loading = true
          axios.get('/goods/list',{
            params:param
          })
          .then(res => {  
            this.loading = false        
            if(res.data.status == '0'){
              if(flag){
                this.goodsList = this.goodsList.concat(res.data.result.list)
                if(res.data.result.count < this.pageSize){
                  this.busy = true
                }else{
                  this.busy = false
                }
                
              }else{
                this.goodsList = res.data.result.list
                this.busy = false
              }
              
            }else{
              this.goodsList =[]
            }
              
          })
      },
      addCart(productId){
        axios.post('/goods/addCart',{productId:productId}).then(res => {
          
          if(res.data.status == 0){
            this.mdShowCart = true
            
            this.$store.dispatch('updateCartCount',{cartCount:1})
          }else{
            this.mdShow = true
          }
        })
      },
      sortGoods(){
        this.sortflag = !this.sortflag
        this.page = 1
        this.getGoodsList()
      },
      loadMore() {
        this.busy = true
        setTimeout(() => {
          this.page ++
          this.getGoodsList(true)
        }, 500);
      },
      setPriceFilter(index){
        this.priceChecked = index
        this.page = 1
        this.getGoodsList()
        this.closePop()
      },
      showFilterPop(){
        this.filterby = true
        this.overLayFlag = true
      },
      closePop(){
        this.overLayFlag = false
        this.filterby = false
      },
      closeModal(){
        
        this.mdShow = false
        this.mdShowCart = false
      }
  }
}
</script>

<style lang="stylus">
  .loadmore
      text-align center
      height 100px
      line-height 100px
  .icon-arrow-short
    transition all .3s ease-out
  .sort-up
    transform rotate(180deg)
    transition all .3s ease-out
</style>
