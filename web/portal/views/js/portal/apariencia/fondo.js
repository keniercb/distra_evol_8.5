/*
autor		: Liv�n Alejandro Capote Vald�s
versi�n		: 1.1
Descripci�n	: Carga las im�genes para cambiar el fondo de escritorio.
@Ultima modificación: 28/Noviembre/2014 por Juan Luis R.guez H.dez
@Ultima modificación: 21/Enero/2015 por Carlos Sarmiento Samper
@Ultima modificación: 17/Marzo/2015 por Carlos Sarmiento Samper
*/
Ext.ux.ImageBrowser = function(config) {

        var _this = this;
	  // PRIVATEstyle

	  // cache data by image name for easy lookup
	  var lookup = {};

	  
	  // currently selected image data
	  var data;
    var  myMask = new Ext.LoadMask(Ext.getBody(), {msg:'Cargando...'});

	  // turn indicator on to indicate image list is loading
	  var indicatorOn = function() {
          myMask.show();
		if (Ext.getCmp('img-browser-view')) {
		  //Ext.getCmp('img-browser-view').getTopToolbar().items.map.indicator.disable();
		}
	  };

	  // turn indicator off
	  var indicatorOff = function() {
          myMask.hide();
		if (Ext.getCmp('img-browser-view')) {
		  //Ext.getCmp('img-browser-view').getTopToolbar().items.map.indicator.enable();
		}
	  };

	  // format loaded image data
		var formatData = function(data) {
			if(data.name) {
				data.label = (data.name.length > 15)
					? data.name.substr(0, 12) + '...' : data.name;
				data.title = "Nombre: " + data.name +
					"<br>Dimensiones: " + data.width + " x " + data.height +
					"<br>Tama&ntilde;o: " + ((data.size < 1024) ? data.size + " bytes"
						: (Math.round(((data.size * 10) / 1024)) / 10) + " KB");
			}
			else if(data.icon){
				data.label = (data.icon.length > 15)
					? data.icon.substr(0, 12) + '...' : data.icon;
				data.title = "Nombre: " + data.icon +
					"<br>Dimensiones: icono";
			}

		if (data.width > data.height) {
		  if (data.width < 80) {
			  data.thumbwidth = data.width;
			  data.thumbheight = data.height;
		  } else {
			  data.thumbwidth = 80;
			  data.thumbheight = 80 / data.width * data.height;
			}
		} else {
		  if (data.height < 80) {
			  data.thumbwidth = data.width;
			  data.thumbheight = data.height;
		  } else {
			  data.thumbwidth = 80 / data.height * data.width;
			  data.thumbheight = 80;
			}
		}
			if(data.width == '' && data.height == '') {
				data.thumbwidth = 80;
				data.thumbheight = 80;
			}
		  data.thumbleft = (Math.round((80 - data.thumbwidth) / 2)) + "px";
		  data.thumbtop = (Math.round((80 - data.thumbheight) / 2)) + "px";
		  data.thumbwidth = Math.round(data.thumbwidth) + "px";
		  data.thumbheight = Math.round(data.thumbheight) + "px";
		data.name ? lookup[data.name] = data : lookup[data.icon] = data;
		return data;
	  };

	  // create the image upload form
	  var form = Ext.getBody().createChild({
		tag: 'form',
		cls: 'x-hidden'
	  });

	  // called if image was uploaded successfully
	  var uploadSuccess = function(response, options) {
		indicatorOff();
		response = Ext.util.JSON.decode(response.responseText);
                mostrarMensaje(response.codMsg , response.mensaje);
                _this.reset();
	  };

	  // called if image was not uploaded successfully
	  var uploadFailure = function(response, options) {
		indicatorOff();
          response = Ext.util.JSON.decode(response.responseText);
          mostrarMensaje(response.codMsg, response.mensaje);
	  };
		/*M�todo desarrollado por Livan Capote Vald�s*/
	  var uploadFile = function(record) {
          var stringtype = record.dom.files[0].type;
          var type = stringtype.split('/');
          //console.log(type);
          if(type[1] != 'gif' && type[1] != 'jpg' && type[1] != 'jpeg' &&  type[1] !=  'png'){
              mostrarMensaje(6, "El archivo seleccionado no es v&aacutelido.");
          }
          else{
              indicatorOn();
              record.appendTo(form);
              console.log(record);
              console.log(record.dom.files[0].type);
              Ext.Ajax.request({
                  method: 'post',
                  params:{directorio:config.directorio,config:config.ind},
                  url: '/portal/index.php/apariencia/subirImagen',
                  isUpload: true,
                  form: form,
                  callback: function (options, success, response) {
                      response = Ext.util.JSON.decode(response.responseText);
                      indicatorOff();
                      mostrarMensaje(response.codMsg , response.mensaje);
                      _this.reset();
                  },
                  // success: uploadSuccess,
                  //failure: uploadFailure,
                  scope: this
              });
          }

	  };

	  /*----------------------------------------------------------------*/
	  /*--------------Funci�n para eliminar las im�genes----------------*/
	  var deleteImage = function(doDelete) {
          if (doDelete == "ok") {
             indicatorOn();
		  Ext.Ajax.request({
			 method: 'post',
			url: '/portal/index.php/apariencia/eliminarImagen',
			params: {
				directorio:config.directorio,
				imagen:data.name,
				url: data.url
			} ,
			success: function(response) {
                var  responseData = Ext.decode(response.responseText);
                mostrarMensaje(responseData.cod,responseData.mensaje);
			   indicatorOff();
                _this.reset();
			 },
			 scope: _this
		   });
		 }
	  };

	/*----------------------------------------------------------------*/
	/*-----Mensaje de confirmaci�n de eliminaci�n de las im�genes-----*/
	var confirmDelete = function() {
        //if(UCID.portal.perfil.background == data.url){
        //    mostrarMensaje(1,'La imagen seleccionada no se puede eliminar debido a que está en uso.');
        //}
        //else
        //{
        mostrarMensaje(2, "¿Est&aacute; seguro que quiere eliminar la imagen seleccionada?", deleteImage);
        //}
	};
	/*----------------------------------------------------------------*/
	/*-------------json store para cargar las im�genes----------------*/
	var thumbTemplate = new Ext.XTemplate(
		'<tpl for=".">',
			'<div class="thumb-wrap" id="{name}">',
				'<div class="thumb"><img src="{url}" ext:qtip="{title}" style="top:{thumbtop}; left:{thumbleft}; width:{thumbwidth}; height:{thumbheight};"></div>',
				'<span>{label}</span>',
		  '</div>',
		'</tpl>'
	);
	thumbTemplate.compile();
	/*----------------------------------------------------------------*/
	/*-------------template para cargar los iconos----------------*/
	var thumbTemplateIcons = new Ext.XTemplate(
		'<tpl for=".">',
		'<div class="thumb-wrap" id="{icon}">',
		'<div class="thumb"><span class="icondistra-{icon}" ext:qtip="{title}" style="top:{thumbtop}; left:{thumbleft}; width:{thumbwidth}; height:{thumbheight};"></div>',
		'<span>{label}</span>',
		'</div>',
		'</tpl>'
	);
	thumbTemplateIcons.compile();
	/*----------------------------------------------------------------*/
	/*-------------json store para cargar las im�genes----------------*/
	var store = new Ext.data.JsonStore({
    url: config.listURL,
    params :{
    	directorio:config.directorio
    },
    root: 'images',
    fields: [
      'name',
      {name: 'width', type: 'float'},
      {name: 'height', type: 'float'},
      {name: 'size', type: 'float'},
      'url'
    ],
	listeners: {
		'beforeload': {fn: indicatorOn, scope: this},
		'load': {fn: indicatorOff, scope: this},
		'loadexception': {fn: indicatorOff, scope: this}
	}
	});
	store.load();
	/*----------------------------------------------------------------*/
	/*-------------json store para cargar los iconos----------------*/
	var storeIcons = new Ext.data.JsonStore({
		url: config.listURL,
		root: 'icons',
		fields: [
			'icon',
			{name: 'width', type: 'float'},
			{name: 'height', type: 'float'},
			{name: 'size', type: 'float'}
		],
		listeners: {
			'beforeload': {fn: indicatorOn, scope: this},
			'load': {fn: indicatorOff, scope: this},
			'loadexception': {fn: indicatorOff, scope: this}
		}
	});
	storeIcons.load();
	/*-----------------------------------------------------------------------*/
	/*Funci�n que se llama cuando el usuario cambia la selecci�n de la im�gen*/
	var selectionChanged = function() {
		if(!config.reiconmenu)
     		Ext.getCmp('delete-btn').enable();
    var selNode = view.getSelectedNodes();
		if (selNode && selNode.length > 0) {
			selNode = selNode[0];
			//Ext.getCmp('select-btn').enable();
			if(!config.reiconmenu)
				Ext.getCmp('delete-btn').enable();
      data = lookup[selNode.id];
		} else {
	   // Ext.getCmp('select-btn').disable();
			if(!config.reiconmenu)
				Ext.getCmp('delete-btn').disable();
		}
	};
	
	/*-----------------------------------------------------------------*/
	/*-Funci�n que se llama con el dobleclik para cambiar las im�genes-*/
	var doCallback = function(a,b,c,d) {
		var node	=	a.store.data.items[b].data;
            //**-Aqui el config ese nunca viene con el atributo ind--**/
		   if(config.ind=='acceso'){
                Ext.getCmp('winReicon').asignarIcono(node.icon);
           }else if(config.ind=='menu'){
               Ext.getCmp('winReiconSeg').asignarIconoMenu(node.icon);
           }else if(config.ind=='rapido') {
               Ext.getCmp('winReiconSeg').asignarIconoInicio(node.icon);
           }else{

		//guardando el fondo
		Ext.Ajax.request({
			method: 'post',
			url: '/portal/index.php/apariencia/guardarFondo',
			params: {dirFondo:node.url} ,
			success: function(response) {
              document.body.style.background="#f3f3f3 url('"+node.url+"')no-repeat left top";
              UCID.portal.perfil.background = node.url;
                var  responseData = Ext.decode(response.responseText);
                mostrarMensaje(1,responseData.mensaje);
			},
			 scope: this
		   });
	   }
  };

	/*----------------------------------------------------------------*/
	/*-------------Excepci�n de cargando im�genes----------------*/
	var onLoadException = function(v,o) {
    view.getEl().update('<div style="padding:10px;">Error cargando im�genes.</div>');
	};
	/*----------------------------------------------------------------*/
	/*-------------------Declaraci�n del viewport---------------------*/
	var view = new Ext.DataView({
		tpl: config.reiconmenu ? thumbTemplateIcons : thumbTemplate,
		singleSelect: true,
		overClass: 'x-view-over',
		itemSelector: 'div.thumb-wrap',
		emptyText : '<div style="padding:10px;">No existen datos que se correspondan con los criterios de búsqueda especificados.</div>',
		store: config.reiconmenu ? storeIcons : store,
		listeners: {
			'selectionchange': {fn: selectionChanged, scope: this, buffer: 100},
			'dblclick': {fn: doCallback, scope: this},
			'loadexception': {fn: onLoadException, scope: this},
			'beforeselect': {fn: function(view) {
			return view.store.getRange().length > 0;
	    }}
		},
		prepareData: formatData.createDelegate(this)
	});
 	/*----------------------------------------------------------------*/
	/*------------------Para filtrar las im�genes---------------------*/
	var filterView = function() {
		var filter = Ext.getCmp('filter');
		config.reiconmenu == false ? view.store.filter('name', filter.getValue(),true) : view.store.filter('icon', filter.getValue(),true);
	};
    var hotkey=new Ext.KeyMap(Ext.getDoc(), [
   /* {
        key: 's',
        ctrl: true,
        shift: true,
        //fn: uploadFile.createDelegate(this),
        fn: function(){
           // console.log('EEE',Ext.getCmp('addfile-btn'));
            console.log('Este',Ext.getCmp('addfile-btn'));
           Ext.getCmp('addfile-btn').onMouseDown();
           // Ext.getCmp('addfile-btn').handler;
        },
        stopEvent:true
    },*/
    //{
    //    key: 'e',
    //    ctrl: true,
    //    shift: true,
    //    fn:confirmDelete,
    //    stopEvent:true
    //} ,
    {
        key: Ext.EventObject.DELETE,
        shift: false,
        ctrl: false,
        fn:confirmDelete,
        stopEvent:true
    }

]);

  	/*----------------------------------------------------------------*/
	/*---------------------Otras configuraciones----------------------*/

	  Ext.applyIf(config, {
          title: 'Im&aacute;genes',
          id: config.id,
          layout: 'fit',
          minWidth: 514,
          minHeight: 500,
          modal: true,
          closeAction: 'hide',
          border: false,
          listeners:{
              activate:function () {
                  hotkey.enable();
              },
              deactivate:function(){
                  hotkey.disable();
              }

          },
			items: [{
				id: 'img-browser-view-'+config.id,
				cls: 'img-browser-view',
				autoScroll: true,
				items: [view],
		  tbar: ['Filtrar:', ' ',
		  {
			xtype: 'textfield',
			id: 'filter',
            emptyText: 'Criterio a buscar',
			selectOnFocus: true,
            enableKeyEvents: true,
			width: 100,
			listeners: {
				'render': {fn: function() {
					Ext.getCmp('filter').getEl().on('keyup', function() {

						filterView();
				}, this, {buffer:500});
				}, scope: this},
                focus :function(){
                  //  console.log('focus');
                    hotkey.disable();
                 },
                blur:function(){
                  //  console.log('blur');
                    hotkey.enable();
                },
                keydown: function (textField,eventObject){
                    var ok = textField.getValue().length < 30;
                    var key = eventObject.getKey();
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
		  }, '-',!config.reiconmenu ? {
            xtype: 'fileuploadbutton',
			id: 'addfile-btn',
			iconCls: 'subirfichero',
            //tooltip:'Subir imagen (Ctrl+Shift+S)' ,
			text: 'Subir imagen',
            tooltip:"Subir Imagen",
			handler: uploadFile.createDelegate(this),
			scope: this
		  } : '', !config.reiconmenu ?{

			id:'delete-btn',
			iconCls:'eliminar',
            tooltip:'Eliminar imagen <b>(DEL)</b>',
			text:'Eliminar imagen',
            disabled: true,
			handler: confirmDelete,
			scope: this
		  } : '',hotkey,' ']
			}],
			keys:[{
				key: 27, // Esc key
				handler: function() {
				  this.hide();
				},
				scope: this
			}]
		});
  	/*----------------------------------------------------------------*/
	/*-------Ext.Window constructor pasando la configuraci�n----------*/
	Ext.ux.ImageBrowser.superclass.constructor.call(this, config);

  	/*----------------------------------------------------------------*/
	/*-----------------------Refrescar las im�genes-------------------*/
	this.reset = function() {
		view.getEl().dom.parentNode.scrollTop = 0;
		store.reload();
		Ext.getCmp('filter').reset();
	};
}
	// Ext.ux.ImageBrowser
	// extension of Ext.Window
	Ext.extend(Ext.ux.ImageBrowser, Ext.Panel, {

	  // overrides Ext.Window.show
	  show: function(animateTarget, cb, scope) {

		// reset view if previously used
		if (this.rendered) {
		  this.reset();
		}
		
		// call Ext.Window.show
		Ext.ux.ImageBrowser.superclass.show.call(this, animateTarget, cb, scope);
	  }
	});
