var serverAddress = "http://222.196.35.35:9080/GSMS/";

var originalId;
var MaxPage = 80;
var MinPage = 50;

var tools = {
	"left": {
		"iconCls": "icon-left",
		"text": "上张",
		"func": "changePage(0)"
	},
	"right": {
		"iconCls": "icon-right",
		"text": "下张",
		"func": "changePage(1)"
	},
	"add": {
		"iconCls": "icon-add",
		"text": "新建单据",
		"func": "addOrder()"
	},
	"save": {
		"iconCls": "icon-save",
		"text": "保存单据",
		"func": "saveOrder()"
	},
	"remove": {
		"iconCls": "icon-remove",
		"text": "删除单据",
		"func": "delateOrder()"
	},
	"ok": {
		"iconCls": "icon-ok",
		"text": "审核单据",
		"func": "checkOrder()"
	},
	"search": {
		"iconCls": "icon-search",
		"text": "查询",
		"func": "inquire()"
	},
	"help": {
		"iconCls": "icon-help",
		"text": "帮助",
		"func": "help()"
	}
};
// 各页面权限
var jurisdiction = {
	"pre_order": ["left", "right", "add", "save", "remove", "ok", "search"],
	"net_order": ["left", "help"],
}

function help() {
	$.messager.alert('提示', '有问题打110!');
}
// tabs创建
function menuHandler(item) {
	$('#tabs').tabs('add', {
		title: item.text,
		href: item.name,
		closable: true,
	});
}

function createtoolbar(htm) {
	htm = "pre_order";
	var content = "";
	for(let i in jurisdiction[htm]) {
		content += "<a href='###' class=\"easyui-linkbutton\" style='width:auto;' onclick='" + tools[jurisdiction[htm][i]].func + "' data-options=\"iconCls:'" + tools[jurisdiction[htm][i]].iconCls + "',plain:'true'\">" + tools[jurisdiction[htm][i]].text + "</a>";
	}
	$("#toolbarPO").append(content);
}

//S$(".easyui-datebox :text").attr("readonly", "readonly");

/**
 * 全网页统用
 * 
 * 通过input框 id 值来匹配
 * 
 * 将获取的后台信息填到各种框内
 * @param {Object} msg 后台获取的josn文件
 */
function fillInput(msg) {
	$('#contain').datagrid('loadData', msg.rows);
	$(".easyui-textbox").each(function(value) {
		var a = $(this).attr("id");
		var inputId = deletePreSymbol("input-", a);
		if(a) {
			$(this).textbox("setValue", msg[inputId]);
		}
	});
	$(".easyui-combobox").each(function(value) {
		var a = $(this).attr("id");
		var inputId = deletePreSymbol("combo-", a);
		if(a) {
			$(this).combobox("setValue", msg[inputId]);
		}
	});
	$(".easyui-datebox").each(function(value) {
		var a = $(this).attr("id");
		var inputId = deletePreSymbol("date-", a);
		if(a) {
			//$(this).datebox("setValue", msg[inputId]);
			$(this).datebox('setValue', '6/1/2012');
		}
	});
}

//删除 id 中input_的前缀
function deletePreSymbol(_presymbol, _str) {
	var len = _str.length;
	var pre_symbol_len = _presymbol.length;
	var _substr = _str.substring(pre_symbol_len, len);
	return _substr;
}

//-----上张------
function frontpage() {
	if(originalId > MinPage) {
		originalId--;
		$('#tabs').tabs('close', '销售单详情');
		$('#tabs').tabs('add', {
			title: '销售单详情',
			href: 'salesOrderDetail.html?' + originalId,
			closable: true,
		});
	} else {
		$.messager.alert('My Title', '没有上张!');
	}
}
//-----下张------
function nextpage() {
	if(originalId < MaxPage) {
		originalId++;
		$('#tabs').tabs('close', '销售单详情');
		$('#tabs').tabs('add', {
			title: '销售单详情',
			href: 'salesOrderDetail.html?' + originalId,
			closable: true,
		});
		//loadData();
	} else {
		$.messager.alert('My Title', '没有下张!');
	}
}

function isEnglish(char) {
	if(char[0] > 'a' && char[0] < 'z') {
		return true;
	}
}

var isChange = -1;

function createDialog() {
	var dialogContent = [{
		"class": "easyui-textbox",
		"id": "goodsName",
		"lable": "内部商品名",
		"missingMessage": "请输入商品名"
	}, {
		"class": "easyui-textbox",
		"id": "goodsType",
		"lable": "内部商品类型",
		"missingMessage": "请输入商品类型"
	}, {
		"class": "easyui-textbox",
		"id": "unit",
		"lable": "单位",
		"missingMessage": "请输入单位"
	}, {
		"class": "easyui-numberbox",
		"id": "num",
		"lable": "数量',precision:'2",
		"missingMessage": "请输入数量"
	}, {
		"class": "easyui-numberbox",
		"id": "price",
		"lable": "单价',precision:'2',prefix:'¥: ",
		"missingMessage": "请输入单价"
	}]
	var content = "";
	content += "<div id=\"dialogNew\" class=\"easyui-dialog\" onmousemove=\"sum();\"closed=\"true\" style=\"padding: 10px;\" data-options=\"onResize:function(){$(this).dialog('center');}\">";
	content += "<form id=\"formNew\" method=\"post\">";
	for(var i = 0; i < dialogContent.length; i++) {
		content += "<div>";
		content += "<input class=\"" + dialogContent[i].class + "\" id='" + dialogContent[i].id + "' name='" + dialogContent[i].id +
			"'  style='width:90%' data-options=\"label:'" + dialogContent[i].lable + "',required:true, missingMessage: '" + dialogContent[i].missingMessage + "'\">";
		content += "</div>";
	}
	content += "<div><input class='easyui-textbox' id='sumAccount' readonly='readonly'  style='width:90%'  data-options=\"label:'总价',precision:'2'\"></div>";
	content += "</form>";
	content += "<div style='text-align:center;padding:15px 0'>"
	content += "<a href=\"###\" class=\"easyui-linkbutton\" onclick=\"submitForm()\" style=\"display: inline-block; width:70px; maigin:0 50px;\">提交</a>";
	content += "<a href=\"###\" class=\"easyui-linkbutton\" onclick=\"clearForm()\" style=\"display: inline-block; width:70px; margin:0 20px;\">重置</a>";
	content += "</div>"
	content += "</div>"
	$("#dialog").append(content);
}

//双击行，弹出diaLog
//function changeDetails(row) {
//	$("#dialogNew").dialog({
//		closed: false,
//		width: 400,
//		height: 400,
//		title: '修改明细',
//	})
//	isChange = row;
//	$("#dialogNew").form('load', information[row]);
//}

//新增明细，弹出dialog
function addDetails() {
	$("#dialogNew").dialog({
		closed: false,
		width: 400,
		height: 400,
		title: '新增明细',
	})
	clearForm();
}

//function submitForm() {
//	let _goodsName = $("#goodsName").val();
//	let _goodsType = $("#goodsType").val();
//	let _unit = $("#unit").val();
//	let _num = $("#num").val();
//	let _price = $("#price").val();
//	let _sumPrice = _sum(_price, _num);
//	if(_goodsName != null && _goodsType != null && _unit != null && _num != null && _price != null && _sumPrice != null) {
//		if(isChange == -1) {
//			information.push({
//				"goodsName": _goodsName,
//				"goodsType": _goodsType,
//				"unit": _unit,
//				"num": _num,
//				"price": _price,
//				"sumPrice": _sumPrice
//			})
//		} else {
//			information[isChange] = {
//				"goodsName": _goodsName,
//				"goodsType": _goodsType,
//				"unit": _unit,
//				"num": _num,
//				"price": _price,
//				"sumPrice": _sumPrice
//			}
//			isChange = -1;
//		}
//		$('#dialogNew').dialog('close');
//		sunAll();
//		clearForm();
//		$('#contain').datagrid('loadData', information);
//	}
//}

//清空表单
function clearForm() {
	$('#formNew').form('clear');
}

//求价格与数量的乘积
function sum() {
	var _sum = document.getElementById("num").value * document.getElementById("price").value;
	if(_sum != 0) {
		$("#sumAccount").textbox('setValue', "¥ " + _sum);
	}
}

function _sum(a, b) {
	let _sum = a * b;
	if(_sum != 0)
		return _sum;
}

//求总价
function sunAll() {
	var sumAccount = 0;
	for(let x in information) {
		if(information[x].sumPrice != null)
			sumAccount += information[x].sumPrice;
	}
	$("#account").text("¥: " + sumAccount);
	$("#accountUpper").text(digitUppercase(sumAccount));
}
/** 数字金额大写转换(可以处理整数,小数,负数) */
var digitUppercase = function(n) {
	var fraction = ['角', '分'];
	var digit = [
		'零', '壹', '贰', '叁', '肆',
		'伍', '陆', '柒', '捌', '玖'
	];
	var unit = [
		['元', '万', '亿'],
		['', '拾', '佰', '仟']
	];
	var head = n < 0 ? '欠' : '';
	n = Math.abs(n);
	var s = '';
	for(var i = 0; i < fraction.length; i++) {
		s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '');
	}
	s = s || '整';
	n = Math.floor(n);
	for(var i = 0; i < unit[0].length && n > 0; i++) {
		var p = '';
		for(var j = 0; j < unit[1].length && n > 0; j++) {
			p = digit[n % 10] + unit[1][j] + p;
			n = Math.floor(n / 10);
		}
		s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
	}
	return head + s.replace(/(零.)*零元/, '元')
		.replace(/(零.)+/g, '零')
		.replace(/^整$/, '零元整');
};

//---------销售单 datagrid
$("#salesOrderInformation").datagrid({
	title: '销售单信息',
	rownumbers: true,
	pagination: true,
	fitColumns: true,
	url: 'http://222.196.35.35:9080/GSMS/logistics/salesorder/list',
	toolbar: [{
		iconCls: 'icon-print',
		plain: 'true',
		text: "打印原始销售单",
		handler: function() {}
	}, {
		iconCls: 'icon-print',
		plain: 'true',
		text: "打印执行销售单",
	}, {
		iconCls: 'icon-undo',
		plain: 'true',
		text: "查看所有数据",
	}],
	onDblClickRow: function(index, row) {
		var hasTab = $("#tabs").tabs('exists', '销售单详情');
		if(hasTab == false) {
			$('#tabs').tabs('add', {
				title: '销售单详情',
				href: 'salesOrderDetail.html?' + (row.ORIGINALORDER_ID + 1),
				closable: true,
			});
			originalId = row.ORIGINALORDER_ID + 1;
			//	loadData();
		} else {
			$('#tabs').tabs('close', '销售单详情');
			$('#tabs').tabs('add', {
				title: '销售单详情',
				href: 'salesOrderDetail.html?' + (row.ORIGINALORDER_ID + 1),
				closable: true,
			});
			originalId = row.ORIGINALORDER_ID + 1;
			//loadData();
		}
	},
});

//------------------跳转后页面datagrid-------------------
$("#details").datagrid({
	pagination: true,
	onDblClickRow: function(index, row) {
		changeDetails(index);
		//	var ed = $(this).datagrid('getEditor', {
		//index: index

		//	});
		//getDetails(index, row);
	},
	columns: [
		[{
			field: 'INTERNAL_NAME',
			title: '*内部商品名',
			width: '16%',
			align: 'center',
		}, {
			field: 'INTERNAL_TYPE',
			title: '*内部商品类型',
			width: '16%',
			align: 'center',
		}, {
			field: 'UNIT_NAME',
			title: '*单位',
			width: '16%',
			align: 'center',
		}, {
			field: 'AMOUNT',
			title: '*数量',
			width: '16%',
			align: 'center',
		}, {
			field: 'UNIT_PRICE',
			title: '*单价',
			width: '16%',
			align: 'center',
			precision: '2',
			formatter: function(value, row, index) {
				if(value) {
					return "￥ " + value + "元";
				}
			}
		}, {
			field: 'SELF_SUM',
			title: '*总价',
			width: '16%',
			align: 'center',
			formatter: function(value, row, index) {
				if(value) {
					return "￥ " + value + "元";
				}
			}
		}]
	]
});

//-----上张------
function frontpage() {
	if(originalId > MinPage) {
		originalId--;
		$('#tabs').tabs('close', '销售单详情');
		$('#tabs').tabs('add', {
			title: '销售单详情',
			href: 'salesOrderDetail.html?' + originalId,
			closable: true,
		});
		//loadData();
	} else {
		$.messager.alert('My Title', '没有上张!');
	}
}
//-----下张------
function nextpage() {
	if(originalId < MaxPage) {
		originalId++;
		$('#tabs').tabs('close', '销售单详情');
		$('#tabs').tabs('add', {
			title: '销售单详情',
			href: 'salesOrderDetail.html?' + originalId,
			closable: true,
		});
		//loadData();
	} else {
		$.messager.alert('My Title', '没有下张!');
	}
}

//双击行，弹出diaLog
function getDetails(index, row) {
	$("#dialogDetail").dialog({
		closed: false,
		width: 400,
		height: 400,
		title: '修改明细',
		onResize: function() {
			$(this).dialog('center');
		},
		modal: true,
		buttons: [{
			text: '保存',
			iconCls: 'icon-ok',
			handler: function() {
				alert('edit');
				row.INTERNAL_NAME = "aaaaaaaaaaa";
				//			$('#contain').datagrid('loadData', information);
			}
		}, {
			text: '取消',
			iconCls: 'icon-cancel',
			handler: function() {
				$("#dialogDetail").dialog({
					closed: true,
				});
			}
		}]
	})
	isChange = index;
	$("#goodsName").textbox('setValue', row.INTERNAL_NAME);
	$("#goodsType").textbox('setValue', row.INTERNAL_TYPE);
	$("#unit").textbox('setValue', row.UNIT_NAME);
	$("#num").textbox('setValue', row.AMOUNT);
	$("#price").textbox('setValue', row.UNIT_PRICE);
	$("#sumAccount").textbox('setValue', row.AMOUNT * row.UNIT_PRICE);
}

//销售单详情页面跳转所用
function loadData() {
	$.ajax({
		dataType: 'JSON',
		type: "get",
		url: "http://222.196.35.35:9080/GSMS/logistics/originalorder/pre.do?ID=" + originalId,
		success: function(msg) {
			$('#details').datagrid('loadData', msg);
			$("#ORDER_NO").textbox('setValue', msg.ORDER_NO);
			$("#CUSTOMER_TYPE").textbox('setValue', msg.CUSTOMER_TYPE);
			$("#CUSTOMER_NAME").textbox('setValue', msg.CUSTOMER_NAME);
			$("#CREATE_TIME").textbox('setValue', msg.CREATE_TIME);
			$("#MEMO").textbox('setValue', msg.MEMO);
			$("#AUDITOR_TIME").textbox('setValue', msg.AUDITOR_TIME);
			$("#PRINTCOUNT").textbox('setValue', msg.PRINTCOUNT);
			$("#CREATE_MAN").textbox('setValue', msg.CREATE_MAN);
			let rows = $("#details").datagrid('getRows');
			let sum = 0;
			for(let i = 0; i < rows.length; i++) {
				sum += rows[i].SUM;
			}
			$("#detailsAccount").text("￥ " + sum);
			let uper = digitUppercase(sum);
			$("#detailsAccountUpper").text(uper);
		}
	});
}