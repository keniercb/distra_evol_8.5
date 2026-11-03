/**
 * Created by replica on 24/09/14.
 */
Ext.ns('Ext.comun.arbol.aplicaciones');
Ext.comun.arbol.aplicaciones.treeEditable = Ext.extend(Ext.tree.TreePanel,{
    btnHeight 	: 74,
    btnWidth 	: 74,
    btnPadding 	: 40,
    top 		: 0,
    col 		: null,
    closable        : true,
    row 		: null,
    accesos		: [],
    fontColor 	: '000000',
    id          : 'treeditapp',
    region		: 'center',
    title		: 'Aplicaciones autom&aacute;ticas',
    listeners	: {
        checkchange  :function(node,chek){
            var icono;
            var modo='';
            if(node.attributes.icono=='falta'){
                icono="";
            }else{
                icono=node.attributes.icono;
            }
            if(chek){
                var  myMaske = new Ext.LoadMask(Ext.getBody(), {msg:'Guardando...'});

          var wndmode=new Ext.Window({
              modal: true,
              title: 'Modos de inicio',
              width: 220,
              id: 'wndmode',
              keys: [
                  {
                      key: 'x',
                      alt: true,
                      handler: function () {
                          node.ui.checkbox.checked = false;
                          Ext.getCmp('wndmode').destroy();
                      }
                  },
                  {
                      key: Ext.EventObject.ENTER,
                      handler: function () {
                          myMaske.show();
                          if (modo) {
                              var src = {
                                  aWinConfig: {
                                      id: node.id,
                                      text: node.text,
                                      referencia: "/" + node.attributes.referencia,
                                      index: 0,
                                      estado: 'agregar',
                                      icono: icono,
                                      modo: modo
                                  }
                              }
                              Ext.Ajax.request({
                                  url: '/portal/index.php/apariencia/guardarAccesoDirecto',
                                  method: 'POST',
                                  params: {
                                      acceso: Ext.encode(src),
                                      bandera: 'automatico'
                                  },
                                  callback: function (options, success, response) {
                                      var responseData = Ext.decode(response.responseText);
                                      mostrarMensaje(responseData.cod, responseData.mensaje);
                                      myMaske.hide();
                                  }
                              })
                              Ext.getCmp('wndmode').destroy();
                          }
                      }
                  }
              ],
              items: [new Ext.FormPanel({
                  border: false,
                  defaultType: 'radio',
                  frame: true,

                  layout: 'column',
                  defaults: {
                      columnWidth: '.5',
                      border: false
                  },
                  buttons: [{
                      iconCls: "cancelar",
                      text: 'Cancelar',
                      tooltip: "Cerrar ventana sin guardar los datos <b>(Alt+X)</b>",
                      handler: function () {
                          node.ui.checkbox.checked = false;
                          Ext.getCmp('wndmode').destroy();
                      }
                  }, {
                      disabled: true,
                      iconCls: "aceptar",
                      text: 'Aceptar',
                      id: 'btnAceptar',
                      tooltip: "Guardar datos y cerrar ventana <b>(Enter)</b>",
                      handler: function () {
                          myMaske.show();
                          if (modo) {
                              var src = {
                                  aWinConfig: {
                                      id: node.id,
                                      text: node.text,
                                      referencia: "/" + node.attributes.referencia,
                                      index: 0,
                                      estado: 'agregar',
                                      icono: icono,
                                      modo: modo
                                  }
                              }
                              Ext.Ajax.request({
                                  url: '/portal/index.php/apariencia/guardarAccesoDirecto',
                                  method: 'POST',
                                  params: {
                                      acceso: Ext.encode(src),
                                      bandera: 'automatico'
                                  },
                                  callback: function (options, success, response) {
                                      var responseData = Ext.decode(response.responseText);
                                      mostrarMensaje(responseData.cod, responseData.mensaje);
                                      myMaske.hide();
                                  }
                              })
                              Ext.getCmp('wndmode').destroy();

                          }
                      }
                  }],
                  items: [{
                      boxLabel: 'Minimizado',
                      name: 'fav-color',
                      inputValue: 'min',
                      listeners: {
                          check: function (rb, check) {
                              if (check) {
                                  Ext.getCmp('btnAceptar').enable(),
                                      modo = 'minimizado'
                              }
                          }
                      }
                  }, {
                      labelSeparator: ' ',
                      boxLabel: 'Maximizado',
                      name: 'fav-color',
                      inputValue: 'max',
                      listeners: {
                          check: function (rb, check) {
                              if (check) {
                                  Ext.getCmp('btnAceptar').enable(),
                                      modo = 'maximizado'
                              }
                          }
                      }
                  }]
              })]


          })
                wndmode.show();


            }else{
                mostrarMensaje(2,"¿Está seguro que quiere eliminar el inicio automático seleccionado?",function(param){
                    if(param=='ok'){
                var  myMaske1 = new Ext.LoadMask(Ext.getBody(), {msg:'Eliminando...'});
                myMaske1.show();
                var src={
                    aWinConfig : {
                        id : node.id,
                        text : node.text,
                        referencia : "/"+node.attributes.referencia,
                        index : 0,
                        estado:'eliminar'
                    }
                };
                Ext.Ajax.request({
                    url : '/portal/index.php/apariencia/guardarAccesoDirecto',
                    method : 'POST',
                    params : {
                        acceso : Ext.encode(src),
                        bandera : 'automatico'
                    },
                    callback : function(options, success, response) {
                        var  responseData = Ext.decode(response.responseText);
                        mostrarMensaje(responseData.cod,responseData.mensaje);
                        myMaske1.hide();
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
        var buscarEstructura= new Ext.form.TextField({
            width:170,
            emptyText: 'Buscar funcionalidad',
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
                },
                keydown: function (textField,eventObject){
                    var ok = textField.getValue().length < 30;
                    var key = eventObject.getKey();
                    console.log('keydown de aplicaciones automaticas');
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
                bandera: 'automatico'
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
        this.tbar = ['   ',
            buscarEstructura
        ];
        this.root 		= new Ext.tree.AsyncTreeNode({
            text        : 'Funcionalidades',
            draggable 	: false,
            id 			: 'idpadre'
        });
        Ext.comun.arbol.funcionalidades.treeEditable.superclass.initComponent.call(this);
    },
      guardarCambios:function (node,icono,modo){
        var src={
            aWinConfig : {
                id : node.id,
                text : node.text,
                referencia : "/"+node.attributes.referencia,
                index : 0,
                estado:'agregar',
                icono: icono,
                modo: modo
            }
        }
        Ext.Ajax.request({
            url: '/portal/index.php/apariencia/guardarAccesoDirecto',
            method: 'POST',
            params: {
                acceso: Ext.encode(src),
                bandera : 'automatico'
            },
            callback: function(options, success, response) {
                var  responseData = Ext.decode(response.responseText);
                mostrarMensaje(responseData.cod,responseData.mensaje);
            }
        })
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
    }
});