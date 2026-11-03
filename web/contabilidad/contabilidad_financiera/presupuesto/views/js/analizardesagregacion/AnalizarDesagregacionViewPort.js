/**
 * Created by Emmanuel on 12/5/2017.
 */
/**
 *
 */
Ext.namespace('Contabilidad.AnalizarDesagregacionViewPort');
Ext.QuickTips.init();

Ext.Ajax.request({
    method: "POST",
    url: "cargaretiquetas",
    callback: function (options, success, response) {
        new Contabilidad.AnalizarDesagregacionViewPort.Viewport({
            idioma: Ext.decode(response.responseText),
            perfil: window.parent.perfil
        });
    }
});

Contabilidad.AnalizarDesagregacionViewPort.Viewport = Ext.extend(Ext.Viewport, {
    constructor: function (params) {
        Ext.apply(this, params);
        Ext.apply(this, {
            layout: 'fit',
            idioma: params.idioma,
            tipoSelecionado:-1//-1 Ninguno ,1 CentroCosto , 2 Ingreso , 3 Otros
        });
        this.crearMenu();
        this.crearGridDesagregacion();
        this.initEventos();

        this.PanelAnalisis = new Ext.Panel({
            id: "analisis",
            //title: this.idioma.lbAnalisis,
            border: false,
            frame: false,
            layout: 'border',
            items: [
                this.PanelGridDesagregacion,
                    this.PanelMenu
            ]
        });

        this.stMenu.load();
        this.items=this.PanelAnalisis;


        Contabilidad.AnalizarDesagregacionViewPort.Viewport.superclass.constructor.call(this, params);
    },
    crearMenu : function () {
        this.stMenu = new Ext.data.JsonStore({
            scope:this,
            url: 'obtenerEstructurasPadre',
            autoload: false,
            root: 'datos',
            fields: [
                {
                    name: 'codigocentrogrupo'
                }, {
                    name: 'concat'
                }, {
                    name: 'concatpadre'
                }, {
                    name: 'descripcioncentrogrupo'
                }, {
                    name: 'idanalisis'
                }, {
                    name: 'idcentrogrupo'
                }, {
                    name: 'idcuenta'
                }, {
                    name: 'idestado'
                }, {
                    name: 'idestructuracomun'
                }, {
                    name: 'idformato'
                }, {
                    name: 'idpadre'
                }, {
                    name: 'idtipo'
                }, {
                    name: 'nivel'
                }, {
                    name: 'ordender'
                }, {
                    name: 'ordenizq'
                }, {
                    name: 'text'
                }
            ]
        })
        this.arbol = new Ext.tree.TreePanel({
            region: 'center',
            layout: 'fit',
            split: true,
            border: false,
            // shadow: true,
            // margins: '3 0 0 3',
            // containerScroll: true,
            frame: false,
            autoScroll: true,
            // ddScroll: true,
            rootVisible: false,
            root: new Ext.tree.TreeNode({
                draggable: false,
                expanded: true,
                id: '0'
            })
        });

        this.PanelMenu = new Ext.Panel({
            title: this.idioma.lbCentroCosto,
            region      : 'west',
            layout: 'fit',
            // autoScroll: true,
            collapsible : true,
            // margins     : '3 0 3 3',
            // cmargins    : '3 3 3 3',
            tbar: [
                new Ext.app.SearchField({
                    store: this.stMenu,
                    width:280,
                    emptyText  : this.idioma.lbCriterioBuscar

                })
            ],
            items:[this.arbol]
        })
    },
    crearGridDesagregacion : function () {


        this.PanelGridDesagregacion = new Ext.Cont.GestDesagregacionPresup({
            idioma: this.idioma,
            perfil: this.perfil,
            scope: this,

        });
    },
    initEventos : function () {
        this.stMenu.on({
            scope : this,
            load : function (store,records) {
                if (store.getTotalCount()==0){
                    mostrarMensaje(1, this.idioma.msgNoBusqueda);
                    var rootNode = store.scope.arbol.getRootNode()
                    while (rootNode.firstChild) {
                        rootNode.removeChild(rootNode.firstChild);
                    }
                }
                else{
                    var rootNode = store.scope.arbol.getRootNode()
                    while (rootNode.firstChild) {
                        rootNode.removeChild(rootNode.firstChild);
                    }
                    var nodo =  this.arbol.getRootNode();
                    nodo.appendChild([new Ext.tree.TreeNode({
                        expanded: true,
                        scope : this,
                        text: this.idioma.lbNodoCentroCosto,
                        id: -1,
                        listeners: {


                        }
                    })]);
                    nodo.appendChild([new Ext.tree.TreeNode({
                        scope : this,
                        text: this.idioma.lbNodoIngresos,
                        id: -2,
                        listeners: {

                            scope : this,
                            'click': function(nodo, evento) {
                                if(this.PanelGridDesagregacion.cbEjercicio.isValid()) {
                                    this.PanelGridDesagregacion.reconfigurarGrid(this.PanelGridDesagregacion.cbEjercicio.getValue(),
                                        this.PanelGridDesagregacion.cbEjercicio.getRawValue(), this.PanelGridDesagregacion.idioma, null,true);
                                    this.tipoSelecionado=2;
                                }
                                else
                                {
                                    mostrarMensaje(1, this.idioma.msgSeleccionaEjercicio);
                                }
                            }
                        }
                    })]);
                    nodo.appendChild([new Ext.tree.TreeNode({
                        scope : this,
                        text: this.idioma.lbNodoOtrosConceptos,
                        id: -3,
                        listeners: {

                            scope : this,
                            'click': function(nodo, evento) {
                                if(this.PanelGridDesagregacion.cbEjercicio.isValid()) {
                                    this.PanelGridDesagregacion.reconfigurarGrid(this.PanelGridDesagregacion.cbEjercicio.getValue(),
                                        this.PanelGridDesagregacion.cbEjercicio.getRawValue(), this.PanelGridDesagregacion.idioma,null,null);
                                    this.tipoSelecionado=3;
                                }
                                else
                                {
                                    mostrarMensaje(1, this.idioma.msgSeleccionaEjercicio);
                                }
                            }
                        }
                    })]);
                    var nodoSinPadre=[];
                    store.each(function (record,scope) {
                        if(record.data.idcentrogrupo == record.data.idpadre || this.store.reader.jsonData.esBusqueda=='true')
                        {
                            var nodo = this.store.scope.arbol.getNodeById(-1);
                        }
                        else
                        {
                            var nodo = this.store.scope.arbol.getNodeById( record.data.idpadre);
                            if(!nodo){
                                nodoSinPadre.push(record);
                            }
                        }
                        if(nodo) {
                            nodo.appendChild([new Ext.tree.TreeNode({
                                scope: this,
                                text: record.data.text,
                                id: record.data.idcentrogrupo,
                                listeners: {
                                    scope: this,
                                    'click': function (nodo, evento) {
                                        if (this.store.scope.PanelGridDesagregacion.cbEjercicio.isValid()) {
                                            this.store.scope.PanelGridDesagregacion.idCentroCostoSeleccionado = record.data.idcentrogrupo;
                                            this.store.scope.PanelGridDesagregacion.textCentroCostoSeleccionado = record.data.text;
                                            this.store.scope.PanelGridDesagregacion.reconfigurarGrid(this.store.scope.PanelGridDesagregacion.cbEjercicio.getValue(),
                                                this.store.scope.PanelGridDesagregacion.cbEjercicio.getRawValue(), this.store.scope.PanelGridDesagregacion.idioma, this.data.idcentrogrupo, false);
                                            this.store.scope.tipoSelecionado = 1;
                                        }
                                        else {
                                            mostrarMensaje(1, this.store.scope.idioma.msgSeleccionaEjercicio);
                                        }
                                    }
                                }
                            })]);
                        }
                    })
                    var cont =1;
                    while (nodoSinPadre.length<=cont ){

                        var nodo = this.arbol.getNodeById( nodoSinPadre[cont].data.idpadre);

                        if(!nodo) {
                            var nodo = this.arbol.getNodeById(-1);
                        }

                        nodo.appendChild([new Ext.tree.TreeNode({
                            scope: this,
                            text: nodoSinPadre[cont].data.text,
                            id: nodoSinPadre[cont].data.idcentrogrupo,
                            listeners: {
                                scope: this,
                                'click': function (nodo, evento) {
                                    if (this.PanelGridDesagregacion.cbEjercicio.isValid()) {
                                        this.PanelGridDesagregacion.idCentroCostoSeleccionado = nodoSinPadre[cont].data.idcentrogrupo;
                                        this.PanelGridDesagregacion.textCentroCostoSeleccionado = nodoSinPadre[cont].data.text;
                                        this.PanelGridDesagregacion.reconfigurarGrid(this.PanelGridDesagregacion.cbEjercicio.getValue(),
                                            this.PanelGridDesagregacion.cbEjercicio.getRawValue(), this.PanelGridDesagregacion.idioma, this.data.idcentrogrupo, false);
                                        this.tipoSelecionado = 1;
                                    }
                                    else {
                                        mostrarMensaje(1, this.idioma.msgSeleccionaEjercicio);
                                    }
                                }
                            }
                        })]);

                        cont++;
                    }
                }

            }
        });
    }
});

Ext.app.SearchField = Ext.extend(Ext.form.TwinTriggerField, {
    initComponent : function(){
        Ext.app.SearchField.superclass.initComponent.call(this);
        this.on('specialkey', function(f, e){
            if(e.getKey() == e.ENTER){
                this.onTrigger2Click();
            }
        }, this);
    },

    validationEvent:false,
    validateOnBlur:false,
    trigger1Class:'x-form-clear-trigger',
    trigger2Class:'x-form-search-trigger',
    hideTrigger1:true,
    width:180,
    hasSearch : false,
    paramName : 'query',

    onTrigger1Click : function(){
        if(this.hasSearch){
            this.el.dom.value = '';
            var o = {start: 0};
            this.store.baseParams = this.store.baseParams || {};
            this.store.baseParams[this.paramName] = '';
            this.store.reload({params:o});
            this.triggers[0].hide();
            this.hasSearch = false;
        }
    },

    onTrigger2Click : function(){
        var v = this.getRawValue();
        if(v.length < 1){
            this.onTrigger1Click();
            return;
        }
        var o = {start: 0};
        this.store.baseParams = this.store.baseParams || {};
        this.store.baseParams[this.paramName] = v;
        this.store.reload({params:o});
        this.hasSearch = true;
        this.triggers[0].show();
    }
});
