Ext.ns('Ext.comun.arbol.funcionalidades');
Ext.comun.arbol.funcionalidades.treeEditable = Ext.extend(Ext.tree.TreePanel,{
	btnHeight 	: 74,
	btnWidth 	: 74,
	btnPadding 	: 40,
        closable        : true,
	top 		: 0,
	col 		: null,
        id              :'treeeditaccesos',
	row 		: null,
	accesos		: [],
	fontColor 	: '000000',
        region		: 'center',
	title		: 'Accesos directos',
	listeners	: {
		checkchange  :function(node,chek){

			if(chek){
                var  myMask = new Ext.LoadMask(Ext.getBody(), {msg:'Guardando...'});
                myMask.show();
                Ext.Ajax.request({
                    url: '/portal/index.php/apariencia/obtenerIconoFuncionalidad',
                    method: 'POST',
                    params: {
                        idfunc: node.id
                    },
                    callback: function (options, succes, response) {
                        var responseData = Ext.decode(response.responseText);

                        var src={
                            aWinConfig : {
                                id : node.id,
                                text : node.text,
                                referencia : "/"+node.attributes.referencia,
                                index : 0,
                                estado:'agregar',
                                icono: responseData.icono ? responseData.icono : '/portal/views/js/portal/apariencia/imagen/Icons/1.png'
                            }
                        };

                        crearAcceso(src);

                        Ext.Ajax.request({
                            url: '/portal/index.php/apariencia/guardarAccesoDirecto',
                            method: 'POST',
                            params: {
                                acceso: Ext.encode(src),
                                bandera: 'accesos'
                            },
                            callback: function(options, success, response) {
                                var  responseData = Ext.decode(response.responseText);
                                mostrarMensaje(responseData.cod,responseData.mensaje);
                                myMask.hide();
                            }
                        });
                    }
                });

			}else{
                var self1 = this;
                mostrarMensaje(2,"¿Está seguro que quiere eliminar el acceso directo seleccionado?",function(param){
                 if(param=='ok'){
                     var  myMaskelim = new Ext.LoadMask(Ext.getBody(), {msg:'Eliminando...'});
                     myMaskelim.show();
                     var el = document.getElementsByName(node.attributes.id)[0];
                     Ext.get(document.getElementsByName(node.id)[0].id).remove();
                     Ext.apariencia.shortcuts.Desktop.clearPosition(el.getAttribute('column'),el.getAttribute('row'));
                     var s = [];
                     for(var i = 0, len = self1.accesos.length; i < len; i++){
                         if(self1.accesos[i] != btn){
                             s.push(self1.accesos[i]);
                         }
                     }
                     self1.accesos = s;
                     self1.organizarIconos();
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
                             bandera: 'accesos'
                         },
                         callback : function(options, success, response) {
                             var  responseData = Ext.decode(response.responseText);
                             mostrarMensaje(responseData.cod,responseData.mensaje);
                             myMaskelim.hide();
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
            xtype: "textfield",
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
                    console.log('keydown de accesos directos');
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
                bandera:  'accesos'
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
Ext.ns('Ext.comun.wind');
Ext.comun.wind.Rename = Ext.extend(Ext.Window, {
    title: 'Cambiar nombre',
    heigth: 195,
    modal: true,
    width: 300,
    resizable: false,
    id: 'winRename',
    initComponent: function () {
        this.self = this;
        var html = this.name.html.getElementsByTagName('div')[0];
        var tooltip = this.name.html.parentElement;
        var obj = this.name;
        var myMask = new Ext.LoadMask(Ext.getBody(), {msg: 'Guardando'});

        this.items = [new Ext.FormPanel({
            labelWidth: 48,
            defaultValues:null,
            frame: true,
            bodyStyle: 'padding:5px 5px 0',
            //width: 300,
            defaults: {width: 180},
            defaultType: 'textfield',
            buttonAlign: "right",
            listeners:{
              clientvalidation:function(form,valid){
                  if(form.defaultValues == null)
                    form.defaultValues = form.getForm().getValues(true);
                  if(valid && form.defaultValues != form.getForm().getValues(true))
                    Ext.getCmp('idaceptar').enable();
                  else
                      Ext.getCmp('idaceptar').disable();
              }
            },
            buttons: [
                {
                    text: 'Cancelar',
                    id: 'idcancel',
                    nextTab: 'idaceptar',
                    prevTab: 'flname',
                    iconCls: 'cancelar',
                    tooltip: 'Cerrar ventana sin guardar los datos <b>(Alt+X)</b>',
                    //style: 'padding:3px 0 0 6px',
                    handler: function () {
                        Ext.getCmp('winRename').destroy();
                    }
                }, {
                    text: 'Aceptar',
                    nextTab : 'flname',
                    prevTab: 'idcancel',
                    disabled: true,
                    id: 'idaceptar',
                    iconCls: 'aceptar',
                    tooltip: 'Guardar los datos y cerrar la ventana <b>(Enter)</b>',
                    //style: 'padding:3px 2px 0 0',
                    handler: function () {
                        guardarCambios();
                    }
                }],
            items: [{
                xtype: 'textfield',
                anchor: '99%',
                fieldLabel: 'Nombre',
                name: 'first',
                id: 'flname',
                prevTab : 'idaceptar',
                nextTab: 'idcancel',
                allowBlank: false,
                value: html.innerHTML,
                enableKeyEvents: true,

                maxLength: 30,
                maxLengthText: 'El tama&ntilde;o m&aacute;ximo requerido es de {0} caracteres.',
                //regex: /(^([a-zA-ZáéíóúÁÉÍÓÚñÑ])+([a-zA-ZáéíóúÁÉÍÓÚñÑ\d\_\s\-]*)+([a-zA-ZáéíóúÁÉÍÓÚñÑ\d\_\-]))$/,
                regex: /(^([a-zA-ZáéíóúÁÉÍÓÚñÑ\d])+([a-zA-ZáéíóúÁÉÍÓÚñÑ\d\_\-]+[\s]{0,1}[a-zA-ZáéíóúÁÉÍÓÚñÑ\d\_\-]+)*(([\s]{0,1})[a-zA-ZáéíóúÁÉÍÓÚñÑ\d])*)$/,
                regexText:"Solo admite caracteres alfanum&eacute;ricos y los caracteres especiales (-_).",
                listeners: {
                    keydown: function (textField, eventObject) {
                        //console.log(textField.isValid());
                        var ok = textField.getValue().length < 30;
                        var key = eventObject.getKey();

                        if(key == 88 && eventObject.altKey){
                            textField.enableKeyEvents = true;
                            return;
                        }
                        if (key == 8  || key == 13 || key == 35 || key == 36 || key == 37 || key == 39 || key == 46) {
                            textField.enableKeyEvents = true;
                            return;
                        }
                        else if (!ok) {
                            eventObject.stopEvent();
                            return;
                        }
                    }
                }

            }]

        })];
        this.keys = [
            {
                key: 'x',
                alt: true,
                fn: function () {
                    Ext.getCmp('winRename').destroy();
                }
            },
            {
                key: Ext.EventObject.ENTER,
                fn: function () {
                    if (!Ext.getCmp('idaceptar').disabled) {
                        guardarCambios();
                    }
                }
            }
        ];

        function guardarCambios() {
            myMask.show();
            var newname = Ext.getCmp('flname').container.dom.childNodes[0].value
            html.innerHTML = newname
            tooltip.title = newname
            var src = {
                aWinConfig: {
                    id: obj.id,
                    text: newname,
                    referencia: obj.href,
                    icono: obj.icon,
                    index: 0,
                    estado: 'modificar'
                }
            };
            Ext.Ajax.request({
                url: '/portal/index.php/apariencia/guardarAccesoDirecto',
                method: 'POST',
                params: {
                    acceso: Ext.encode(src),
                    bandera: 'accesos'
                },
                callback: function (options, success, response) {
                    var responseData = Ext.decode(response.responseText);
                    mostrarMensaje(responseData.cod, responseData.mensaje);
                    myMask.hide();
                }
            });
            Ext.getCmp('winRename').destroy()

        };


        Ext.getCmp('flname').focus(false, 200);
        Ext.comun.wind.Rename.superclass.initComponent.call(this);
    }
});
Ext.comun.wind.Reicon = Ext.extend(Ext.Window, {
    id: 'winReicon',
    title: ' Cambiar &iacute;cono',
    width         : 450,
    height        : 400,
    modal         :true,
    layout        : 'fit',
    maximizable         : true,
    resizable       : true,
    minimizable     : true,
    taskbar: null,
    taskButton: null,
    activeWindow: null,
    listeners: {
            activate: function(){this.markActive(this)},
            beforeshow: function(){this.markActive(this)},
            deactivate: function(){this.markInactive(this)},
            minimize: function(){this.minimizeWin(this)},
            close: function(){this.removeWin(this)}
    },
    initComponent: function() {
        this.taskbar = window.parent.MyDesktop.getDesktop().taskbar;
        var tb = this.taskbar;

      var desktopEl = Ext.get('x-desktop');
      this.render(desktopEl);
      this.self = this;
      this.obj=this.name;
       this.buttons=[{
                        text: 'Cancelar',
                         iconCls:'cancelar',
                        handler: function() {
                            Ext.getCmp('winReicon').destroy()
                            Ext.getCmp('cargaricono').destroy()
                        }
                    }];
        var imagebrowser = new Ext.ux.ImageBrowser({
            reiconmenu: true,
            width : 514,
            height : 450,
            ind: 'acceso',
            id:'cargaricono',
            directorio: 'web/portal/views/js/portal/apariencia/imagen/Icons/',
            listURL : '/portal/index.php/apariencia/listadeIconosMenu',
            uploadURL : 'uploadimage.php',
            deleteURL : 'deleteimage.php'
        });
        this.items = [
            imagebrowser
          ];
        this.taskButton = tb.addTaskButton(this);
        Ext.comun.wind.Rename.superclass.initComponent.call(this);
    },
    asignarIcono : function(param){
        var  myMask = new Ext.LoadMask(Ext.getBody(), {msg:'Guardando'});
        myMask.show();
        var dir=param;
        //dir=dir.replace('/portal','../..');
        this.obj.html.getElementsByTagName('span')[0].setAttribute('class', 'acceso-directo icondistra-'+dir);

           	  var src={ aWinConfig : {
								id : this.obj.id,
								text : this.obj.html.textContent,
								referencia : this.obj.href,
                                icono: dir,
								index : 0,
								estado:'modificar'
							}
						};
        Ext.Ajax.request({
            url : '/portal/index.php/apariencia/guardarAccesoDirecto',
            method : 'POST',
            params : {
                acceso : Ext.encode(src),
                bandera:'accesos'
            },
            callback : function(options, success, response) {
                var  responseData = Ext.decode(response.responseText);
                mostrarMensaje(responseData.cod,"El &iacutecono ha sido cambiado satisfactoriamente.");
                myMask.hide();
            }
        });
        //Ext.getCmp('winReicon').destroy()

    },
    minimizeWin: function(win){
        win.minimized = true;
        win.hide();
    },

    markActive: function(win){
        if(this.activeWindow && this.activeWindow != win){
            this.markInactive(this.activeWindow);
        }
        this.taskbar.setActiveButton(win.taskButton);
        this.activeWindow = win;
        Ext.fly(win.taskButton.el).addClass('active-win');
        win.minimized = false;
    },

    markInactive: function(win){
        if(win == this.activeWindow){
            this.activeWindow = null;
            Ext.fly(win.taskButton.el).removeClass('active-win');
        }
    },

    removeWin: function(win){
        this.taskbar.removeTaskButton(win.taskButton);
    }
});
Ext.comun.wind.ReiconMenu = Ext.extend(Ext.Window, {
    title: 'Cambiar icono',
    width         : 450,
    height        : 400,
    modal         :true,
    layout        : 'fit',
    maximizable         : true,
    resizable       : true,
    id: 'winReiconSeg',
    taskbar: null,
    taskButton: null,
    activeWindow: null,
    listeners: {
        activate: function(){this.markActive(this)},
        beforeshow: function(){this.markActive(this)},
        deactivate: function(){this.markInactive(this)},
        minimize: function(){this.minimizeWin(this)},
        close: function(){this.removeWin(this)}
    },
    initComponent: function() {
        this.taskbar = window.parent.MyDesktop.getDesktop().taskbar;
        var tb = this.taskbar;

        var desktopEl = Ext.get('x-desktop');
        this.render(desktopEl);
        this.self = this;
        this.obj=this.name;
        this.menu=this.inicio;
        this.buttons=[{
            text: 'Cancelar',
            iconCls:'cancelar',
            handler: function() {
                Ext.getCmp('winReiconSeg').destroy()
                Ext.getCmp('cargariconoseg').destroy()
            }
        }];
        var imagebrowser = new Ext.ux.ImageBrowser({
            reiconmenu: true,
            width : 514,
            height : 450,
            ind: this.obj.text ? 'menu' : 'rapido',
            id:'cargariconoseg',
            directorio: 'web/lib/ExtJS/temas/default/images/iconos/',
            listURL : '/portal/index.php/apariencia/listadeIconosMenu',
            uploadURL : 'uploadimage.php',
            deleteURL : 'deleteimage.php'
        });
        this.items = [
            imagebrowser
        ];
        this.taskButton = tb.addTaskButton(this);
        Ext.comun.wind.ReiconMenu.superclass.initComponent.call(this);
    },
    asignarIconoInicio : function(param){
        var  myMask = new Ext.LoadMask(Ext.getBody(), {msg:'Guardando'});
        myMask.show();
        document.getElementById(this.obj).setAttribute('class', 'x-btn-text empty-text inicio-rapido icondistra-'+param);
        //document.getElementById(this.obj).setAttribute('style',"background-image: url("+dir+");background-size: cover !important;background-repeat: no-repeat !important;background-position: center !important;");

        var src={ aWinConfig : {
            id: this.srcrapido.aWinConfig.id,
            text:this.srcrapido.aWinConfig.text,
            icono: param,
            estado:'modificar'
        }
        };
        Ext.Ajax.request({
         url : '/portal/index.php/apariencia/guardarAccesoDirecto',
         method : 'POST',
         params : {
         acceso : Ext.encode(src),
         bandera:'inicios'
         },
         callback : function(options, success, response) {
             var  responseData = Ext.decode(response.responseText);
             mostrarMensaje(responseData.cod,responseData.mensaje);
             myMask.hide();
         }
         });
        //Ext.getCmp('winReiconSeg').close()

    },
    asignarIconoMenu : function(param){

        var  myMask = new Ext.LoadMask(Ext.getBody(), {msg:'Guardando...'});
        myMask.show();
        var iconname = param;
        var bandera = this.obj.funcionalidad == true ? 'funcionalidad' : 'sistema';
        var identidad = this.obj.windowId;
        Ext.get(this.obj.el.dom.id).update('<span class="x-menu-item-icon icondistra-'+iconname+'">'+this.obj.text+'</span>');

         Ext.Ajax.request({
         url : '/portal/index.php/apariencia/guardarIconoMenu',
         method : 'POST',
         params : {
         icon : iconname,
         bandera:bandera,
         identidad:identidad
         },
         callback : function(options, success, response) {
             var  responseData = Ext.decode(response.responseText);
             mostrarMensaje(responseData.cod,responseData.mensaje);
             myMask.hide();
         }
         });
        Ext.getCmp('winReiconSeg').close()

    },
    minimizeWin: function(win){
        win.minimized = true;
        win.hide();
    },

    markActive: function(win){
        if(this.activeWindow && this.activeWindow != win){
            this.markInactive(this.activeWindow);
        }
        this.taskbar.setActiveButton(win.taskButton);
        this.activeWindow = win;
        Ext.fly(win.taskButton.el).addClass('active-win');
        win.minimized = false;
    },

    markInactive: function(win){
        if(win == this.activeWindow){
            this.activeWindow = null;
            Ext.fly(win.taskButton.el).removeClass('active-win');
        }
    },

    removeWin: function(win){
        this.taskbar.removeTaskButton(win.taskButton);
    }

});