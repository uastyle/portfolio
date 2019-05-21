var main={
	opt:{
		img:$("img"),
		deviceBut:$(".port_wrap span"),
		elementsPort:$(".wrap_prew")
	},

	devicePrew:function(){
		this.opt.deviceBut.on("click",function(){
			var t=$(this).parents(".wrap_prew").find(".prew"),
			e=$(this).attr("data-src"),
			n=$(this).attr("data-show");
			t.attr("id");
			main.opt.deviceBut.removeClass("active"),
			$(this).addClass("active"),
			t.attr("class","prew "+n),
			t.find("img").attr("src",e)
		})
	},
	init:function(){	
		main.devicePrew()
	}
};

$().ready(function(){
	main.init()
});