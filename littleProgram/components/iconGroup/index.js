//Component Object
Component({
  properties: {
    iconList:{
      type:Array,
      value:[],
    },

  },
  data: {
    list:[]
  },
  methods: {
    dataInit(){
      this.setData({
        list:this.properties.iconList
      })
    },
    clickMe:function(r){
      
      if(r.currentTarget.dataset &&r.currentTarget.dataset.ev){
        
        this.triggerEvent("taps",{targetEv:r.currentTarget.dataset.ev})
      }
      
    }
  },
  created: function(){

  },
  attached: function(){
    this.dataInit()
  },
  ready: function(){

  },
  moved: function(){

  },
  detached: function(){

  },
});