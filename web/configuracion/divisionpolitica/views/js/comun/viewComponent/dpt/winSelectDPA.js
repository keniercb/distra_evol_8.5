Ext.ns('Ext.secodena.comun.tree');
Ext.secodena.stPaises;
Ext.secodena.cbPaises;
Ext.secodena.tfFilter;
Ext.secodena.treeFilter;
Ext.secodena.comun.tree.TreeDPA = Ext.extend(Ext.tree.TreePanel, {
		initComponent      : function ()
		{
				var _this = this;
				this.nodo = (this.nodo && this.nodo.getName()) ? this.nodo : null;
				var rootTitle = (this.rootNodo && this.rootNodo.text) ? this.rootNodo.text : false;
				var rootId = (this.rootNodo && this.rootNodo.id) ? this.rootNodo.id : false;
				var idCmp = this.id;
				var rootNodo = new Ext.tree.AsyncTreeNode({
						text     : (rootTitle) ? rootTitle : Ext.idioma.dpt.lbRootTitle, //perfil.etiquetas.lbRootArbolDispEspec,
						draggable: false,
						id       : (rootId) ? rootId : 'rootNodoDpa' + idCmp,
						nivel    : 0,
						ruta     : _this.rootNodo.ruta,
						rutaDenom: _this.rootNodo.rutaDenom
				});
				var objPais = new Pais();
				Ext.secodena.stPaises = new Ext.data.Store({
						url      : "/configuracion/divisionpolitica/index.php/gestpais/getnompaises",
						id       : 'stPaises' + idCmp,
						autoLoad : true,
						reader   : new Ext.data.JsonReader({
								root         : 'root',
								id           : 'rdPaises' + idCmp,
								totalProperty: 'cantidad_filas'
						}, objPais.getRecord()),
						listeners: {
								beforeload: function ()
								{
										Secodena.mostrarMascara('dpt02', '', Ext.idioma.dpt.msgLoad);
								},
								load      : function ()
								{
										Secodena.ocultarMascara('dpt02');
										if (this.nodo) {
												Ext.secodena.cbPaises.setValue(this.nodo.get('idpais'));
										}
								}.createDelegate(this)
						}
				});
				Ext.secodena.cbPaises = new Ext.form.ComboBox({
						fieldLabel    : Ext.idioma.dpt.lbPaises,
						emptyText     : Ext.idioma.dpt.msgEmptyCombo,
						store         : Ext.secodena.stPaises,
						id            : "cbPaises" + idCmp,
						editable      : true,
						triggerAction : 'all',
						forceSelection: true,
						displayField  : 'denominacion',
						valueField    : 'idpais',
						hiddenName    : 'idpais',
						mode          : 'local',
						width         : '250',
						listeners     : {
								select: function (cb, rec, ind)
								{
										objPais.set(rec);
										if (!this.nodo) {
												this.nodo = new DPA();
										}
										this.nodo.set('Pais', objPais);
										this.root.setText(objPais.get('denominacion'));
										this.root.reload();
								}.createDelegate(this)
						}
				});
				var _this = this;
				Ext.secodena.tfFilter = new Ext.form.TextField({
						width    : 200,
						emptyText: Ext.idioma.dpt.msgEmptyCombo,
						listeners: {
								render: function (f)
								{
										f.el.on('keydown', _this.filterTree, f, {buffer: 350});
								}
						}
				});
				Ext.secodena.treeFilter = new Ext.tree.TreeFilter(_this, {
						clearBlank: true,
						autoClear : true
				});
				this.root = rootNodo;
				this.autoScroll = true;
				this.autoShow = true;
				if (!this.sinTitulo) {
						this.title = Ext.idioma.dpt.lbPanelTitulo;
				}
				this.region = (this.region) ? this.region : "center";
				this.rootVisible = (this.rootVisible) ? true : false;
				if (this.selPais) {
						this.tbar = [
								{
										text: Ext.idioma.dpt.lbPaises + ':'
								},
								Ext.secodena.cbPaises
						];
				}
				if (this.filter) {
						this.tbar = [
								{
										text: Ext.idioma.dpt.lbPaises + ':'
								},
								Ext.secodena.tfFilter
						];
				}
				this.loader = new Ext.tree.TreeLoader({
						dataUrl  : '/configuracion/divisionpolitica/index.php/gestdpa/gettreedpa',
						listeners: {
								beforeload: function (th, node)
								{
										th.baseParams.tiporaiz = this.tiporaiz;
										if (this.nodo && this.nodo.get('idpais')) {
												th.baseParams.idpais = this.nodo.get('idpais');
										} else {
												if (node.attributes.idpais) {
														th.baseParams.idpais = node.attributes.idpais;
												}
										}
								}.createDelegate(this)
						}
				});
				this.on('click', function (n, evt)
				{
						if (n != this.root) {
								if (n.attributes.iddpt) {
										this.createObjectDpa(true, n);
								} else {
										this.createObjectPais(true, n);
								}
								this.seleccionarElemento();
						}
				});
				Ext.secodena.comun.tree.TreeDPA.superclass.initComponent.call(this);
				this.on('render', function ()
				{
						this.root.expand();
				})
		},
		filterTree         : function (tf)
		{
				Ext.secodena.treeFilter.filter(Ext.secodena.tfFilter.getValue());
		},
		seleccionarElemento: function ()
		{
				if (this.nodo.isValid()) {
						this.fireEvent('dameseleccion', this, this.nodo);
						return true;
				} else {
						return false;
				}
		},
		createObjectDpa    : function (isNode, nodo)
		{
				this.nodo = (this.nodo && this.nodo.getName() == 'DPA') ? this.nodo : new DPA();
				if (isNode) {
						this.nodo.set({
								iddpt       : nodo.id,
								denominacion: nodo.text,
								idnivelestr : nodo.attributes.idnivelestructural,
								nivelestr   : nodo.attributes.tpest,
								rutaDenom   : nodo.attributes.rutaDenom,
								ruta        : nodo.attributes.ruta
						});
						this.nodo.nivel = nodo.attributes.nivel;
				} else {
						if (nodo instanceof Object && nodo.getName() == 'DPA') {
								this.nodo.set(nodo.get());
						}
				}
		},
		createObjectPais   : function (isNode, nodo)
		{
				this.nodo = (this.nodo && this.nodo.getName() == 'Pais') ? this.nodo : new Pais();
				if (isNode) {
						this.nodo.set({
								idpais      : nodo.attributes.idpais,
								denominacion: nodo.text,
								codigo      : nodo.attributes.codigo,
								alias       : nodo.attributes.alias
						});
						this.nodo.nivel = nodo.attributes.nivel;
				} else {
						if (nodo instanceof Object && nodo.getName() == 'Pais') {
								this.nodo.set(nodo.get());
						}
				}
		},
		loadData           : function ()
		{
				if (this.nodo && this.nodo.get('ruta')) {
						this.expandPath(this.nodo.ruta);
				}
		},
		load               : function ()
		{
				if (this.nodo && this.nodo.isValid()) {
						Ext.secodena.cbPaises.setValue(this.nodo.get('idpais'));
				}
		}, notifyEvent     : function (animateTarget, title, msg, icon, time, callback)
		{
				var notification = new Ext.Cont.Notification({
						animateTarget: animateTarget,
						fnc          : (callback) ? callback : Ext.emptyFn,
						iconbox      : icon,
						iconCls      : "icon-waiting",
						title        : title,
						html         : msg,
						hideDelay    : (time) ? time : 5000
				});
				notification.box();
		}
});
Ext.reg('configsecodena-nomencladores-panelselectdpa', Ext.secodena.comun.tree.TreeDPA);
Ext.ns('Ext.secodena.comun.window');
Ext.secodena.comun.window.winSelectDPA = Ext.extend(Ext.Window, {
		nivel           : 0,
		paises          : true,
		comunas         : true,
		initComponent   : function ()
		{
				var _this = this;
				this.rootNodo.ruta = (this.rootNodo.ruta) ? this.rootNodo.ruta : this.rootNodo.id;
				this.rootNodo.rutaDenom = (this.rootNodo.rutaDenom) ? this.rootNodo.rutaDenom : this.rootNodo.text;
				this.id = (this.id) ? this.id : 'winSelectDPA';
				var idCmp = this.id;
				this.isLoad = false;
				this.nodo = (this.nodo && this.nodo.getName()) ? this.nodo : null;
				var btnAceptarDPA = new Ext.Button({
						disabled: true,
						id      : 'btnAceptarDPA' + idCmp,
						iconCls : 'aceptar',
						text    : Ext.idioma.dpt.lbAceptar,
						tooltip : Ext.idioma.dpt.ttipAceptar,
						handler : function ()
						{
								this.aceptarSeleccion(true);
						}.createDelegate(this)
				});
				var btnCancelarDPA = new Ext.Button({
						id     : 'btnCancelarDPA' + idCmp,
						iconCls: 'cancelar',
						text   : Ext.idioma.dpt.lbCancelar,
						tooltip: Ext.idioma.dpt.ttipCancelar,
						handler: function ()
						{
								this.destroy();
						}.createDelegate(this)
				});
				var objComuna = new NomComuna();
				this.stComunas = new Ext.data.Store({
						url      : "/configuracion/divisionpolitica/index.php/nomconfigsecodena/getcomunas",
						id       : 'stComunas' + idCmp,
						reader   : new Ext.data.JsonReader({
								root         : 'root',
								id           : 'rdComunas' + idCmp,
								totalProperty: 'cantidad_filas'
						}, objComuna.getRecord()),
						listeners: {
								beforeload: function (st)
								{
										Secodena.mostrarMascara('dpt01', '', Ext.idioma.dpt.msgLoad);
										if (this.nodo && this.nodo.get('iddpt')) {
												st.baseParams.iddpt = this.nodo.get('iddpt');
										}
								}.createDelegate(this),
								load      : function (st)
								{
										Secodena.ocultarMascara('dpt01');
										cbComuna.enable();
										if (this.nodo) {
												cbComuna.setValue(this.nodo.get('idcomuna'));
										}
								}.createDelegate(this)
						}
				});
				var that = this;
				var cbComuna = new Ext.form.ComboBox({
						fieldLabel   : Ext.idioma.dpt.lbComuna,
						emptyText    : Ext.idioma.dpt.lbEmptyCombo,
						store        : that.stComunas,
						tabIndex     : Secodena.TabController.next(),
						id           : "cbComuna" + idCmp,
						extendField  : 'descripcion',
						enableQtip   : true,
						triggerAction: 'all',
						editable     : true,
						displayField : 'denominacion',
						valueField   : 'idcomuna',
						disabled     : true,
						mode         : 'local',
						anchor       : '100%',
						listeners    : {
								select: function (cb, rec, ind)
								{
										this.nodo.set('NomComuna', rec);
								}.createDelegate(this),
								blur  : function (cb)
								{
										if (cb.getValue() == '') {
												this.nodo.set('NomComuna', null);
										}
								}.createDelegate(this)
						}
				});
				var tfDireccionDPA = new Ext.form.TextArea({
						id        : 'tfDireccionDPA' + idCmp,
						anchor    : "100%",
						height    : 60,
						fieldLabel: Ext.idioma.dpt.lbDireccion,
						name      : 'direccion',
						value     : (this.nodo) ? this.nodo.get('direccion') : '',
						listeners : {
								change: function (tf, newt, oldt)
								{
										this.nodo.set('direccion', newt);
								}.createDelegate(this)
						}
				});
				var fpDatosDireccion = new Ext.form.FormPanel({
						layout     : 'form',
						labelAlign : 'top',
						frame      : true,
						height     : 155,
						bodyBorder : false,
						border     : false,
						autoScroll : false,
						autoShow   : true,
						hideBorders: true,
						region     : 'south',
						items      : [
								cbComuna, tfDireccionDPA]
				});
				var nodoSel = this.nodo;
				var tipoRaiz = this.tiporaiz;
				var selPais = this.selPais;
				var filter = this.filter;
				var sinTitulo = this.sinTitulo;
				var tpDpaSeleccion = new Ext.secodena.comun.tree.TreeDPA({
						id        : 'tpTreeDPA' + idCmp,
						tiporaiz  : tipoRaiz,
						selPais   : selPais,
						buttonAcep: btnAceptarDPA,
						filter    : filter,
						sinTitulo : sinTitulo,
						rootNodo  : _this.rootNodo,
						nodo      : nodoSel
				});
				tpDpaSeleccion.on('dameseleccion', function (obj, data)
				{
						btnAceptarDPA.disable();
						if (data && data.getName()) {
								if (data.nivel >= this.nivel) {
										this.nodo = data;
										if (this.locate) {
												cbComuna.clearValue();
												cbComuna.disable();
												if (data.getName() == 'Pais') {
														this.stComunas.removeAll();
												} else {
														this.stComunas.load();
												}
										}
										btnAceptarDPA.enable();
								}
						}
				}.createDelegate(this));
				tpDpaSeleccion.loader.on('load', function (This, node, response)
				{
						var hijos = node.childNodes;
						for (var i = 0; i < hijos.length; i++) {
								hijos[i].attributes.nivel = node.attributes.nivel + 1;
								hijos[i].attributes.rutaDenom = node.attributes.rutaDenom + '/' + hijos[i].attributes.denominacion;
								hijos[i].attributes.ruta = node.attributes.ruta + '/' + hijos[i].id;
						}
						if (!tpDpaSeleccion.getRootNode().hasChildNodes()) {
								tpDpaSeleccion.getRootNode().getUI().hide();
								mostrarMensaje(1, Ext.idioma.dpt.DPAconfigurado);
						} else {
								tpDpaSeleccion.getRootNode().getUI().show();
						}
				}, this);
				if (this.locate) {
						this.items = [tpDpaSeleccion, fpDatosDireccion];
				} else {
						this.items = [tpDpaSeleccion];
				}
				Ext.apply(this, {
						layout     : 'border',
						modal      : true,
						closeAction: 'destroy',
						id         : (_this.id) ? _this.id : 'wnSeleccionaDPA' + idCmp,
						title      : (_this.title) ? _this.title : Ext.idioma.dpt.lbWinTitulo,
						resizable  : false,
						width      : (_this.width) ? _this.width : 410,
						height     : (_this.height) ? _this.height : 500,
						buttons    : [btnCancelarDPA, btnAceptarDPA]
				});
				Ext.secodena.comun.window.winSelectDPA.superclass.initComponent.call(this);
				this.addEvents({
						'dameseleccion': true
				});
				this.on('show', function ()
				{
						if (!this.isLoad) {
								this.load();
						}
				});
		},
		aceptarSeleccion: function (btn)
		{
				if (this.nodo) {
						this.fireEvent('dameseleccion', this, this.nodo, btn);
				} else {
						return false;
				}
		},
		load            : function ()
		{
				this.items.items[0].load();
				if (this.nodo && this.nodo.isValid()) {
						if (this.nodo.getName() == 'DPA') {
								this.stComunas.load();
						}
				} else {
						this.items.items[0].load();
				}
		},
		getSeleccion    : function ()
		{
				return this.nodo;
		}
});
Ext.reg('configsecodena-nomencladores-winselectdpa', Ext.secodena.comun.window.winSelectDPA);