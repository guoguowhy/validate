(function(root,factory,plug){
	factory(root.jQuery,plug);
})(window,function(jquery,plug){

	//配置项 默认参数  
	var __DEFAULT__ = {
		trigger:"change",
	}

	//配置的规则引擎
	var __RULES__ = {
		required:function(){
			return this.val() != "";
		},
		regex:function(){
			return new RegExp(this.data("bv-regex")).test(this.val());
		},
		email:function(){
			return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(this.val());
		},
		match:function(){
			var $t = $(this.data("bv-match"));
	 		if($t.val()){
	 			var res = $t.val()===this.val();
		 		if(res){
		 			$t.next().remove();
		 			$t.parents(".form-group").removeClass("has-error").addClass("has-success");
		 		}
		 		return res;
	 		}else{
	 			return true;
	 		}
		},
		maxlength : function(){
	 		return this.val().length<=Number(this.data("bv-maxlength"));
	 	},
	 	minlength : function(){
	 		return this.val().length>=Number(this.data("bv-minlength"));
	 	},
	 	phone:function(){
	 		return /^(0\d{2,3}-?\d{7,8}|1[3|4|5|7|8][0-9]{9})$/.test(this.val());
	 	}

	}

	var __PROTOTYPE__ = {
		_submit : function(){
			var errors = this.$fields.trigger(this.trigger).filter(".has-error").length;
			if(errors===0){
				this.submitType=="normal"&&this.get(0).submit();
				this.submitType=="ajax"&&this._ajaxSubmit();
			}
		},
		_ajaxSubmit : function(){
			alert("ajax提交");
		}
	};


	$.fn[plug] = function(options){
		var $this = this;
		$.extend(this, __DEFAULT__, options,__PROTOTYPE__);
		
		this.$fields = this.find("input,select,textarea").not("[type=button],[type=reset],[type=submit]");

		this.$fields.on(this.trigger,function(){
			var $field = $(this);
			$field.next("p").remove();
			var $group = $field.parents(".form-group").removeClass("has-success has-error");
			var result = true;
			var message = "";
			$.each(__RULES__,function(rule,validater){
				if($field.data("bv-"+rule)){
					result = validater.call($field);
					if(!result){
						message = $field.data("bv-"+rule+"-message");
					}
					return result;
				}
			});

			!result&&$field.after("<p class='color'>"+message+"</p>");
			$this.addClass(result?"has-success":"has-error");
		});

		this.find("[data-bv-submit=true]").on("click",function(){
			$this._submit();
		})
	}	

},'validate');
