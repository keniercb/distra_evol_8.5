Ext.ns('Ext.comun.arbol.iniciorapido');
Ext.comun.arbol.iniciorapido.treeEditable = Ext.extend(Ext.tree.TreePanel,{
	btnHeight 	: 74,
	btnWidth 	: 74,
	btnPadding 	: 40,
	left		: 94,
	top 		: 0,
        closable        : true,
        id              : 'treeditinicio',
	col 		: null,
	row 		: null,
	accesos		: [],
	fontColor 	: '000000',
    region		: 'center',
	title		: 'Inicio r&aacute;pido',
	listeners	: {
		checkchange  :function(node,chek){
			if(chek){
                var  myMask1 = new Ext.LoadMask(Ext.getBody(), {msg:'Guardando...'});
                myMask1.show();

                var src={
                    aWinConfig : {
                        id : node.id,
                        text : node.text,
                        referencia : "/"+node.attributes.referencia,
                        index : 0,
                        estado:'agregar',
                        icono: '../../views/js/portal/images/accesos.gif'

                    }
                };

                Ext.Ajax.request({
                    url: '/portal/index.php/apariencia/obtenerIconoFuncionalidad',
                    method: 'POST',
                    params: {
                        idfunc: src.aWinConfig.id
                    },
                    callback: function (options, success, response) {
                        var  responseData = Ext.decode(response.responseText);
                        src.aWinConfig.icono = responseData.icono ? responseData.icono : 'abrirventana';

                        Ext.Ajax.request({
                            url : '/portal/index.php/apariencia/guardarAccesoDirecto',
                            method : 'POST',
                            params : {
                                acceso : Ext.encode(src),
                                bandera : 'inicios'
                            },
                            callback : function(options, success, response) {
                                var  responseData = Ext.decode(response.responseText);
                                mostrarMensaje(responseData.cod,responseData.mensaje);
                                inicioRapido(src);
                                myMask1.hide();
                            }
                        });
                    }
                });

				   
			}else{
                mostrarMensaje(2,"¿Está seguro que quiere eliminar el inicio rápido seleccionado?",function(param){
                    if(param=='ok') {
                        var myMask = new Ext.LoadMask(Ext.getBody(), {msg: 'Eliminando...'});
                        myMask.show();
                        var obj1 = document.getElementById("TaskBarStart-xsplit");
                        var obj2 = document.getElementById("ux-taskbar-start");
                        var obj3 = document.getElementById("ux-taskbuttons-panel");

                        if (obj1.offsetLeft - 32 < 100) {
                            obj1.style.left = obj1.offsetLeft - 40 + "px";
                            obj2.style.width = obj2.offsetWidth - 40 + "px";
                            obj3.style.left = obj3.offsetLeft - 40 + "px";
                            obj3.style.width = obj3.offsetWidth + 40 + "px";
                        } else {
                            obj1.style.left = obj1.offsetLeft - 32 + "px";
                            obj2.style.width = obj2.offsetWidth - 32 + "px";
                            obj3.style.left = obj3.offsetLeft - 32 + "px";
                            obj3.style.width = obj3.offsetWidth + 32 + "px";
                        }

                        Ext.getCmp("shortcut" + node.attributes.id).destroy();
                        var src = {
                            aWinConfig: {
                                id: node.id,
                                text: node.text,
                                referencia: "/" + node.attributes.referencia,
                                index: 0,
                                estado: 'eliminar'
                            }
                        };

                        Ext.Ajax.request({
                            url: '/portal/index.php/apariencia/guardarAccesoDirecto',
                            method: 'POST',
                            params: {
                                acceso: Ext.encode(src),
                                bandera: 'inicios'
                            },
                            callback: function (options, success, response) {
                                var  responseData = Ext.decode(response.responseText);
                                mostrarMensaje(responseData.cod,responseData.mensaje);
                                myMask.hide();
                            }
                        });
                    }else{
                        node.ui.checkbox.checked=true;
                        return;
                    }
                });
			}
            }
		},

    initComponent: function() {
		this.initColRow()
        var self            = this;
        this.arreglo        = new Array();
        this.banderabus     = 0;
        var form = new Ext.form.FormPanel({
            baseCls: 'x-plain',
            labelWidth: 55,
            items: [{
                fieldLabel: 'Buscar',
                name: 'to',
                anchor:'100%'  // anchor width by percentage
            }]
        });
        var buscarEstructura= new Ext.form.TextField({
            width:170, 
            emptyText: 'Buscar funcionalidad',
           // fieldLabel:"Buscar",
            id: 'idfuncionalidad'+self.id,
            enableKeyEvents: true,
            listeners:{
                keyup : function(){
                    self.getRootNode().eachChild(function(n){
                        var funcionalidad= n.attributes.text;
                        var text= this.getValue();
                        if(funcionalidad.toLowerCase().indexOf(text.toLowerCase())!=-1){
                            n.getUI().show()
                        }else{
                            n.getUI().hide()
                        }

                    },this);
                    /*  self.loader.baseParams.criterio_busqueda = this.getValue();
                     self.root.reload();*/
                },
                keydown: function (textField,eventObject){
                    var ok = textField.getValue().length < 30;
                    var key = eventObject.getKey();
                    console.log('keydown del inicio rapido');
                    console.log(key);
                    if(key == 8 || key == 46 || key == 37 || key == 39){
                        textField.enableKeyEvents = true;
                        return;
                    }
                    else if(!ok){
                        eventObject.stopEvent();
                        return ;
                    }
                }
            }
        });
        var url         = '/portal/index.php/apariencia/obtenerFuncionalidades';
        this.loader = new Ext.tree.TreeLoader({
            dataUrl     : url,
            baseParams	: {
                ul: this.mostrar,
                bandera: 'inicios'
            },	
            listeners			: {            
                beforeload  : function( nod, d, anim ){
                    if(self.banderabus == 0)
                        this.baseParams.val = '';
                },
                load    : function( nod, d, anim ){
                    if(self.banderabus == 1)
                        self.banderabus = 0;
                }       
            }
        });
        
        this.useArrows = true;
        this.autoScroll = true;
        this.animate = true;
        this.region = this.region ? this.region : 'center';
        this.enableDD = false;
        this.containerScroll = true;
        this.height = this.height ? this.height : 250;
        this.tbar = [form,
            buscarEstructura
           /* new Ext.Button({
                id:'btnBuscarfuncionalidad',
                icon:perfil.dirImg+'buscar.png',
                iconCls:'biconmenu',
                cls:'btn',
                text:'S',
                //scale: 'large',
                //height: 80,
                //width: 80,
                tooltip:'Buscar una funcionalidad',

                handler:function(){
                    this.getRootNode().eachChild(function(n){
                        var funcionalidad= n.attributes.text;
                        var text= buscarEstructura.getValue();
                        if(funcionalidad.toLowerCase().indexOf(text.toLowerCase())!=-1){
                            n.getUI().show()
                        }else{
                            n.getUI().hide()
                        }

                    });
                }.createDelegate(this)
            })*/
        ];
        this.root 		= new Ext.tree.AsyncTreeNode({
            text        : 'Funcionalidades',
            draggable 	: false,
            id 			: 'idpadre'
        });
        Ext.comun.arbol.iniciorapido.treeEditable.superclass.initComponent.call(this);
    },
	setXY :function(item){
		var bottom = this.row.y + this.btnHeight;
		var overflow = this.isOverflow(this.row.y + this.btnHeight);

      if(overflow && bottom > (this.btnHeight + this.btnPadding)){
         this.col = {
            index: this.col.index++
            , x: this.col.x + this.btnWidth + this.btnPadding
         };
         this.row = {
            index: 1
            , y: this.btnPadding + this.top
         };
      }
      item.el.setXY([this.col.x, this.row.y]);
      this.row.index++;
      this.row.y = this.row.y + this.btnHeight + this.btnPadding;
   },
    isOverflow:function (y){
      if(y > (Ext.lib.Dom.getViewHeight()-20)){
         return true;
      }
      return false;
   },
   organizarIconos:function(){
    this.initColRow();
    for(var i = 0, len = this.accesos.length; i < len; i++){
       this.setXY(this.accesos[i]);
    }
   },
   initColRow:function (){
      this.col = {index: 1, x: this.btnPadding};
      this.row = {index: 1, y: this.btnPadding + this.top};
   },
   guardarCambios:function(src){
       
       Ext.Ajax.request({
           url : '/portal/index.php/apariencia/guardarAccesoDirecto',
           method : 'POST',
           params : {
               acceso : Ext.encode(src),
               bandera : 'inicios'
           },
           callback : function(options, success, response) {
               var  responseData = Ext.decode(response.responseText);
               mostrarMensaje(responseData.cod,responseData.mensaje);
           }
       });
    }
});
