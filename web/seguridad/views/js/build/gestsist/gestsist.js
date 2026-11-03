/**
 * Created by lily on 9/03/15.
 */

Ext.define ('Conf.util.idioma.es', {

    alias: 'widget.idioma_es',
    idioma:{

        /**------------Comun-----------------------------**/
        cargando               : 'Cargando',
        buscar                 : 'Buscar',
        blankText              : 'Este campo es obligatorio.',
        fieldLabelDenominacion : 'Denominación',
        fieldLabelDescripcion  : 'Descripción',

        adicionarSub           : 'Adicionar subsistema <b style="float: right; margin-left: 125px; margin-top: -17px;">(Alt+I+S)</b>',
        adicionarFunc          : 'Adicionar funcionalidad <b style="float: right; margin-left: 125px; margin-top: -17px;">(Alt+I+F)</b>',
        adicionarRec           : 'Adicionar recurso <b style="float: right; margin-left: 110px; margin-top: -17px;">(Alt+I+R)</b>',

        titleArbolReferencia   : 'Árbol de Referencias',

        cancelar               : 'Cancelar',
        toolTipcancelar        : 'Cerrar ventana sin guardar los datos <b>(Alt+X)</b>',
        aceptar                : 'Aceptar',
        toolTipaceptar         : 'Guardar datos y cerrar ventana <b>(Enter)</b>',

        /**------------TreeDD.js-----------------------------**/
        titleTree              : 'Subsistemas registrados',

        /**------------PanelMenuIzquierdo.js-----------------------------**/
        adicionarMenuIz        : 'Adicionar componente', //<b>(Alt+I) + (S, F ó R)</b>
        adicionarCategoria     : 'Adicionar categoria <b>(Alt+I+C)</b>',
        adicionarCateg         : 'Adicionar categoria',
        adicionarSubsistema    : 'Adicionar subsistema <b>(Alt+I+S)</b>',

        adicionarFuncionalidad : 'Adicionar funcionalidad <b>(Alt+I+F)</b>',

        adicionarRecurso       : 'Adicionar recurso <b>(Alt+I+R)</b>',

        eliminarMenuIz         : 'Eliminar componente <b>(DEL)</b>',
        exportarSubsistema     : 'Exportar sistema <b>(Alt+E)</b>',
        importarSubsistema     : 'Importar sistema <b>(Ctrl+Alt+I)</b>',
        buscarMenuIz           : 'Buscar <b>(Alt+B)</b>',
        limpiarMenuIz          : 'Limpiar filtro <b>(Alt+L)</b>',

        /**------------PanelDerecho.js-----------------------------**/
        guardar                : 'Guardar cambios <b>(Alt+G)</b>',

        /**------------Formulario.js-----------------------------**/
        titleFieldset          : 'Información',

        fieldLabelAbreviatura  : 'Abreviatura',
        fieldLabelIcono        : 'Ícono',

        boxLabelVisibilidad    : 'Visibilidad',
        boxLabelExterno        : 'Externo',
        cajaReferencia         : 'Seleccione la referencia',
        fieldLabelReferencia   : 'Referencia',
        regexText1             : 'Solo admite caracteres alfanuméricos y los caracteres especiales (-_).',
        regexText2             : 'Solo admite caracteres alfanuméricos',
        buscarReferencia       : 'Buscar referencia <b>(Alt+W)</b>',
        maxLengthText          : 'La longitud máxima para este campo es {0}.',

        /**------------gridEditorAcciones.js-----------------------------**/
        buscarGrid             : 'Buscar acción <b>(Alt+B)</b>',
        limpiarGrid            : 'Limpiar filtro <b>(Ctrl+Alt+L)</b>',

        /**------------panelGrid.js-----------------------------**/
        adicionarAccion        : 'Adicionar acción <b>(Alt+I+A)</b>',
        eliminarAccion         : 'Eliminar acción <b>(Shift+D)</b>',

        /**------------contextMenu.js-----------------------------**/
        eliminarSub            : 'Eliminar subsistema<b style="float: right;  margin-top: -17px;">(DEL)</b>',
        eliminarFunc           : 'Eliminar funcionalidad<b style="float: right; margin-top: -17px;">(DEL)</b>',
        eliminarRec            : 'Eliminar recuso<b style="float: right;margin-left: 85px; margin-top: -17px; ">(DEL)</b>',

        textMaximoCaracteres   : 'El tama&ntilde;o m&aacute;ximo requerido es de {0} caracteres.',

        /**------------arbolRefSist.js-----------------------------**/
        textroot               : 'Subsistemas',

        /**------------arbolRefFunc.js-----------------------------**/
        textroot1              : 'Aplicaciones',

        /**------------storeTreeDD.js-----------------------------**/
        textstore              : 'Subsistemas',

        /**------------windowAccion.js-----------------------------**/
        titleWinAccion         : 'Adicionar acción',

        aplicar                : 'Aplicar',
        toolTipaplicar         : 'Guardar datos y limpiar los campos',

        /**------------windowImportarSistema.js-----------------------------**/
        titlewinImp            : 'Importar sistema',
        fieldLabelImp          : 'Seleccione el sistema para importar',

        /**------------configuracionSub.js-----------------------------**/
        titleFieldsetSubsistema    :'Información del subsistema',
        titleFieldsetFuncionalidad :'Información de la funcionalidad',
        titleFieldsetRecurso       :'Información del recurso',
        titleInsertarSubsistema    :'Insertar subsistema',
        titleInsertarFuncionalidad :'Insertar funcionalidad',
        titleInsertarRecurso       :'Insertar recurso',
        fieldLabelReferenciaExt    :'Referencia al servidor web',
        waitTitle                  :'Por favor espere...',
        waitMsgOnRender            :'Guardando posición',
        waitMsgImpSub              :'Importando sistema',
        informacion                :'Información',
        error                      :'Error',
        confirmacion               :'Confirmación',
        confirmPreg                :'¿Está seguro que quiere eliminar el subsistema seleccionado?',
        waitMsgElimSub             :'Eliminando datos del sistema',
        confirmPreg1               :'¿Está seguro que quiere eliminar la funcionalidad seleccionada?',
        waitMsgElimFunc            :'Eliminando datos de la funcionalidad',
        confirmPreg2               :'¿Está seguro que quiere eliminar el recurso seleccionado?',
        waitMsgElimRec             :'Eliminando datos del recurso',
        waitMsgAddSub              :'Guardando datos del sistema',
        waitMsgAddFunc             :'Guardando datos de la funcionalidad',
        msgErrorAddRec             :'Debe seleccionar al menos una acción para insertar el recurso.',
        msgErrorInsRec             :'Debe marcar al menos una acción para insertar un recurso.',
        waitMsgAddRec              :'Guardando datos del recurso',
        advertencia                :'Advertencia',
        msgAdvertencia             :'Si se le retiran todas las acciones al recurso dejará de existir. ¿Desea seguir con la operación?',
        msgAdvertencia1            :'Algunas acciones han sido desmarcadas. <br>Si desmarca una accion sera eliminada. ¿Desea seguir con la operación?</br>',
        confirmPreg3               :'¿Está seguro que quiere eliminar la acción seleccionada?',
        waitMsgElimAction          :"Eliminando la acción",
        waitMsgElimAction1         :"Eliminando acciones desmarcadas",
        waitMsgInsAcc              :"Insertando la acción",
        waitMsgModAcc              :"Guardando datos de las acciones modificadas",
        waitMsgModAccInt           :"Guardando cambios",
        noseencontrarondatos       :"No existen datos que se correspondan con los criterios de búsqueda especificados.",
        errorformulario            :"Revise los datos del formulario.",
        datossinguardar            :"Existen datos sin guardar, ¿desea continuar?"



    }

});
/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
/**
 * @class Ext.ux.CheckColumn
 * @extends Ext.grid.column.Column
 * <p>A Header subclass which renders a checkbox in each column cell which toggles the truthiness of the associated data field on click.</p>
 * <p><b>Note. As of ExtJS 3.3 this no longer has to be configured as a plugin of the GridPanel.</b></p>
 * <p>Example usage:</p>
 * <pre><code>
// create the grid
var grid = Ext.create('Ext.grid.Panel', {
    ...
    columns: [{
           text: 'Foo',
           ...
        },{
           xtype: 'checkcolumn',
           text: 'Indoor?',
           dataIndex: 'indoor',
           width: 55
        }
    ]
    ...
});
 * </code></pre>
 * In addition to toggling a Boolean value within the record data, this
 * class adds or removes a css class <tt>'x-grid-checked'</tt> on the td
 * based on whether or not it is checked to alter the background image used
 * for a column.
 */
Ext.define('Conf.ux.CheckColumn', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.checkcolumn',
    constructor: function() {

        var cssPrefix = Ext.baseCSSPrefix, cls = [cssPrefix + 'grid-checkheader-checked'];
        cls.push(cssPrefix + 'grid-checkheader');
        this.renderTpl =
            '<div id="{id}-titleContainer" class="' + Ext.baseCSSPrefix + 'column-header-inner">' +
            '<div id="{id}-checkboxContainer" class="' + cls.join(' ') + '">&#160;</div>'+
            '<span id="{id}-textEl" class="' + Ext.baseCSSPrefix + 'column-header-text">' +
            '{text}' +
            '</span>' +
            '<tpl if="!values.menuDisabled">'+
            '<div id="{id}-triggerEl" class="' + Ext.baseCSSPrefix + 'column-header-trigger"></div>'+
            '</tpl>' +
            '</div>';
        this.addEvents(
            /**
             * @event checkchange
             * Fires when the checked state of a row changes
             * @param {Ext.ux.CheckColumn} this
             * @param {Number} rowIndex The row index
             * @param {Boolean} checked True if the box is checked
             */
            'checkchange'
        );
        this.callParent(arguments);
    },

    initComponent: function() {
        var me = this;
        if (me.flex) {
            me.minWidth = me.minWidth || Ext.grid.plugin.HeaderResizer.prototype.minColWidth;
        }
        else {
            me.minWidth = me.width;
        }
        if (!me.triStateSort) {
            me.possibleSortStates.length = 2;
        }
        me.isGroupHeader = false;
        me.sortable = false;
        me.resizable = false;
        me.hideable = false;
        me.align = 'center';
        me.menuDisabled = true;

        me.addChildEls('titleContainer', 'checkboxContainer');
        me.callParent(arguments);
    },

    /**
     * @private
     * Process and refire events routed from the GridView's processEvent method.
     */
    processEvent: function(type, view, cell, recordIndex, cellIndex, e) {
        if (type == 'mousedown' || (type == 'keydown' && (e.getKey() == e.ENTER || e.getKey() == e.SPACE))) {
            var record = view.panel.store.getAt(recordIndex),
                dataIndex = this.dataIndex,
                checked = !record.get(dataIndex);
                
            record.set(dataIndex, checked);
            this.fireEvent('checkchange', this, recordIndex, checked);
            // cancel selection.
            return false;
        }
        else {

            return this.callParent(arguments);
        }
    },

    // Note: class names are not placed on the prototype bc renderer scope
    // is not in the header.
    renderer : function(value){
        var cssPrefix = Ext.baseCSSPrefix,
            cls = [cssPrefix + 'grid-checkheader'];

        if (value) {
            cls.push(cssPrefix + 'grid-checkheader-checked');
        }
        return '<div class="' + cls.join(' ') + '">&#160;</div>';
    },
    onElClick: function(e, t) {
        if(t.id == this.checkboxContainer.id){
            this.onHeaderClick(this.ownerCt.view,e,t);
        }
        this.callParent(arguments);
    },
    afterRender: function(me,e){
        var store = this.ownerCt.view.store;
        me = this;
        if(store) {
            store.on('load', function (store, records,success,opt,e) {
                var flag = true;
                for (var i = 0; i < store.data.length && flag; i++) {
                    var record = store.getAt(i), dataIndex = me.dataIndex;
                    if (!record.get(dataIndex)) {
                        flag = false;
                    }
                }
                var cssPrefix = Ext.baseCSSPrefix;
                var check = me.checkboxContainer.dom;
                if (!flag) {
                    check.setAttribute('class', cssPrefix + 'grid-checkheader');
                }else{
                    check.setAttribute('class',cssPrefix + 'grid-checkheader ' + cssPrefix + 'grid-checkheader-checked');
                }
            });
        }
        this.callParent(arguments);
    },
    onHeaderClick: function(gridView, e, t) {
        var dq = Ext.DomQuery;
        var cssPrefix = Ext.baseCSSPrefix, cls = cssPrefix + 'grid-checkheader-checked';
        cls = dq.is(t,'div.'+cls);
        if(cls){
            t.setAttribute('class',cssPrefix + 'grid-checkheader');
            this.changeSelect(gridView.ownerCt,false);
        }else{
            t.setAttribute('class',cssPrefix + 'grid-checkheader ' + cssPrefix + 'grid-checkheader-checked');
            this.changeSelect(gridView.ownerCt,true);
        }
    },
    changeSelect:function(grid,checked){
        var store = grid.getStore();
        for(var i = 0;i < store.data.length;i++){
            var record = store.getAt(i), dataIndex = this.dataIndex;
            if(record.get(dataIndex) != checked){
                record.set(dataIndex, checked);
                this.fireEvent('checkchange', this, i, checked);
            }
        }
    }

});

Ext.define("Msg.util",{
    statics:{
        MostrarMsg : function(code,title,text,fn,scope){
            /*Ext.Msg.INFO // 1
             Ext.Msg.WARNING		//2
             Ext.Msg.ERROR  //3
             Ext.Msg.QUESTION  //4*/
            if(fn == null){var func = function(){msg.close()};}
            else{func = fn;}
            var  band = 0;
            var btn_cancelar = {
                type:'button',
                text:'Cancelar',
                iconCls: 'cancelar',
                handler: function(){
                    Ext.getCmp('treeDD').keyMap.insertarSubsistema.setDisabled(false);
                    Ext.getCmp('treeDD').keyMap.insertarFuncionalidad.setDisabled(false);
                    Ext.getCmp('treeDD').keyMap.insertarRecurso.setDisabled(false);
                    Ext.getCmp('treeDD').keyMap.Importar.setDisabled(false);
                    Ext.getCmp('treeDD').keyMap.Exportar.setDisabled(false);

                    acept.destroy();
                    cancel.destroy();
                    msg.close()

                },
                scope: this
            };
            /* var cut = new Ext.KeyMap(Ext.getBody(), {
             key:Ext.EventObject.ENTER , // or Ext.EventObject.ENTER
             fn: function(){
             Ext.bind(func,scope)();
             msg.close();

             },
             scope: this
             });*/

            var btn_aceptar = {
                type:'button',
                text:'Aceptar',
                iconCls: 'aceptar',

                handler:function(){
                    Ext.bind(func,scope)();
                    acept.destroy();
                    cancel.destroy();
                    msg.close();

                } ,

                scope: this
            };
            if(code == 1){
                var	option = [btn_aceptar];
                var icon = Ext.Msg.INFO;
            }
            if(code == 2){
                var	option = [btn_aceptar];
                var icon = Ext.Msg.WARNING;
            }
            if(code == 3){
                var	option = [btn_aceptar];
                var icon = Ext.Msg.ERROR;
            }
            if(code == 4){
                var	option = [btn_cancelar,btn_aceptar];
                var icon = Ext.Msg.QUESTION;
            }



            var msg = new Ext.window.MessageBox({
                buttons: option,
                buttonAlign : 'center'

            }).show({
                    title: title,
                    msg: text,
                    scope : scope,
                    icon: icon
                });
            var acept = new Ext.util.KeyMap(Ext.getBody(), {
                key: Ext.EventObject.ENTER , // or Ext.EventObject.ENTER
                fn: function(){
                    Ext.bind(func,scope)();
                    msg.close();
                    acept.destroy();
                    cancel.destroy();
                },
                scope:this

            });
            var cancel = new Ext.util.KeyMap(Ext.getBody(), {
                key: Ext.EventObject.ENTER , // or Ext.EventObject.ENTER
                fn: function(){

                    msg.close();
                    acept.destroy();
                    cancel.destroy();
                },
                scope:this

            });

        },
        createBox: function (code,t, s){
            var resp = '';
            if(code == 3){resp ='<div class="msg"><div id="imgError"></div><h3>' + t + '</h3><p>' + s + '</p></div>';}
            if(code == 1){resp ='<div class="msg"><div id="imgOk"></div><h3>' + t + '</h3><p>' + s + '</p></div>';}

            return resp
        },
        msg : function(code,title, format){
            var msgCt ;
            if(!msgCt){
                if(code == 1) msgCt = Ext.DomHelper.insertFirst(document.body, {id:'msg-div'}, true);
                if(code == 3) msgCt = Ext.DomHelper.insertFirst(document.body, {id:'msg-error'}, true);

                var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 2));
                var m = Ext.DomHelper.append(msgCt, this.createBox(code,title, s), true);
                m.hide();
                m.slideIn('t').ghost("t", { delay: 2000, remove: true});
            }

        }
    }

});
/**
 * Add basic filtering to Ext.tree.Panel. Add as a mixin:
 * mixins: {
* treeFilter: 'MyApp.lib.TreeFilter'
* }
 */
Ext.define('Conf.lib.TreeFilter', {


    filterScope: this,

    filterByText: function(text) {
        this.filterBy(text, 'text');
    },


    /**
     * Filter the tree on a string, hiding all nodes expect those which match and their parents.
     * @param The term to filter on.
     * @param The field to filter on (i.e. 'text').
     */
    filterBy: function(text, by) {

        this.clearFilter();

        var view = this.getView(),
            me = this,
            nodesAndParents = [];

// Find the nodes which match the search term, expand them.
// Then add them and their parents to nodesAndParents.
        this.getRootNode().cascadeBy(function(tree, view){
            var currNode = this;

            if(currNode && currNode.data[by] && currNode.data[by].toString().toLowerCase().indexOf(text.toLowerCase()) > -1) {
                me.expandPath(currNode.getPath());

                do {
                    nodesAndParents.push(currNode.id);
                    currNode = currNode.parentNode;
                } while (currNode);
            }
        }, null, [me, view]);

// Hide all of the nodes which aren't in nodesAndParents
        this.getRootNode().cascadeBy(function(tree, view){
            var uiNode = view.getNodeByRecord(this);

            if(uiNode && !Ext.Array.contains(nodesAndParents, this.id)) {
                Ext.get(uiNode).setDisplayed('none');
            }
        }, null, [me, view]);
    },


    clearFilter: function() {
        var view = this.getView();

        this.getRootNode().cascadeBy(function(tree, view){
            var uiNode = view.getNodeByRecord(this);

            if(uiNode) {
                Ext.get(uiNode).setDisplayed('table-row');
            }
        }, null, [this, view]);
    },


    filtrarArbol: function (value,childNodes, haschildText)
    {

        var valuer = value;
        var _this = this;
        if (!valuer) {
           _this.clearFilter();
        }
        else {
            Ext.each(childNodes, function (node) {

                if(node){

                    var view = _this.getView();
                    var nodo = view.getNode(node);
                    node.haschildText = false;
                    if (node.isLeaf() || !node.isExpanded()) {
                        if ((node.data.text.toLowerCase().indexOf(valuer.toLowerCase()) != -1)) {
                            Ext.get(nodo).setDisplayed(true);
                            node.parentNode.haschildText = true;
                        }
                        else
                            Ext.get(nodo).setDisplayed(false);
                    }
                    else if (node.isExpanded() && node.childNodes.length > 0) {
                        _this.filtrarArbol(valuer,node.childNodes, node.haschildText);
                        if (node.haschildText) {
                            Ext.get(nodo).setDisplayed(true);
                            node.parentNode.haschildText = true;
                        }
                        else
                            Ext.get(nodo).setDisplayed(false);
                    }
                    else {
                        if (node.data.text.toLowerCase().indexOf(valuer.toLowerCase()) != -1) {
                            Ext.get(nodo).setDisplayed(true);
                            node.parentNode.haschildText = true;
                        }
                        else
                            Ext.get(nodo).setDisplayed(false);
                    }
                }


            });
        }
    },

    buscarMenuIzquierdo: function (value) {
        var arbol = this;
        if (!value) {
            arbol.clearFilter();
        }
        else if (value != undefined) {

            arbol.getRootNode().eachChild(function (n) {
                if(n) {
                    var view = arbol.getView();
                    var nodo = view.getNode(n);

                    n.haschildText = false;
                    if (n.isExpanded() && n.childNodes.length > 0) {

                        arbol.filtrarArbol(value, n.childNodes, n.haschildText);
                        if (n.haschildText)
                            Ext.get(nodo).setDisplayed(true);

                        else
                            Ext.get(nodo).setDisplayed(false);
                    }
                    else {
                        if (n.data.text.toLowerCase().indexOf(value.toLowerCase()) != -1) {
                            Ext.get(nodo).setDisplayed(true);
                            n.parentNode.haschildText = true;
                        }
                        else
                            Ext.get(nodo).setDisplayed(false);
                    }
                }
            }, this);

        }
    }


});
/**
 * Created by jmzaldivar on 15/12/15.
 */
Ext.define('Conf.model.ModelStoreComboBox', {
    extend : 'Ext.data.Model',
    fields  : [
        {name : 'icon'}
    ]

});/**
 * Created by lily on 3/02/15.
 */

Ext.define('Conf.model.ModelStoreGrid', {
    extend : 'Ext.data.Model',
    fields  : [
        {name : 'idfuncionalidad'},
        {name : 'idaccion'},
        {name : 'denominacion'},
        {name : 'descripcion'},
        {name : 'checked'}
    ]

});Ext.define('Conf.model.Subsistema', {
    extend : 'Ext.data.Model',
    proxy: {
        type: 'ajax',
        url: "cargarsistfuncRec"
    },
    fields  : [
        {name : 'id'},
        {name : 'idrecurso'},
        {name : 'denominacion', mapping: 'text'},
        {name : 'text'},
        {name : 'icon'},
        {name : 'abreviatura'},
        {name : 'descripcion'},
        {name : 'idfuncionalidad'},
        {name : 'leaf'},
        {name : 'type'},
        {name : 'idsistema'},
        {name : 'idpadre'},
        {name : 'icono'},
        {name : 'servidorweb'},
        {name : 'referencia'},
        {name : 'indice'},
        {name : 'visibilidad'},
        {name : 'externo', mapping: 'externa'}
    ]

});/**
 * Created by lily on 3/02/15.
 */
//Ext.require([
//    'Ext.data.*',
//    //'Ext.data.Store',
//]);
Ext.define('Conf.store.StoreGridEditor', {
    extend  : 'Ext.data.Store',
    model: 'Conf.model.ModelStoreGrid',
    pageSize: 20,
    proxy   : {
        type   : 'ajax',
        url : 'cargargridacciones',
        reader : {
            type          : 'json',
            root          : 'datos',
            totalProperty : 'cantidad_filas'
        }

    },
    listeners:{
        load:function(){
            //console.log(this.data.length);
            if(this.data.length==0)
                mostrarMensaje(1,this.proxy.extraParams.msg);
        },
        update:function(){
            Ext.getCmp('btnGuardar').enable();
        }
    }

});/**
 * Created by lily on 16/02/15.
 */
//Ext.require([
//    'Conf.model.Subsistema'
//]);
Ext.define('Conf.store.StoreTree', {
    extend  : 'Ext.data.TreeStore',
    model: 'Conf.model.Subsistema',
    root: {
        text: Ext.widget('idioma_es').idioma.textstore,//'Sistemas',
        id: '0',
        expanded: true
    }

});/**
 * Created by lily on 11/02/15.
 */
Ext.define('Conf.view.gestsist.arbolRefFunc', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.arbolRefFunc',

    initComponent: function () {

        this.arbolStore = Ext.create('Ext.data.TreeStore', {
            proxy: {
                type: 'ajax',
                url: 'cargarReferenciaFuncionalidades'
            },
            root: {
                text: perfil.etiquetas.textroot1,//'Aplicaciones',
                id: '0',
                expanded: true
            }
        });

        this.store = this.arbolStore;
        this.title = perfil.etiquetas.titleArbolReferencia;//'Árbol de Referencias';
        this.border = false;
        this.id = 'arbolRefFun';
        this.name = 'arbolRefFun';
        this.autoScroll = true;
        this.useArrows = true;
        this.viewConfig = {
            loadingText: perfil.etiquetas.cargando//'Cargando'
        };
        this.width = 285;
        this.height = '100%';
        this.callParent(arguments);
    }
});
/**
 * Created by lily on 18/02/15.
 */
Ext.define('Conf.view.gestsist.arbolRefSist', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.arbolRefSist',

    initComponent: function () {

        this.arbolStore = Ext.create('Ext.data.TreeStore', {
            proxy: {
                type: 'ajax',
                url: 'cargarArbolSistemaFisico'
            },
            root: {
                text: perfil.etiquetas.textroot,//'Subsistemas',
                id: 'root',
                expanded: true
            }
        });

        this.store = this.arbolStore;
        this.title = perfil.etiquetas.titleArbolReferencia; //'Árbol de Referencias';
        this.border = false;
        this.id = 'arbolRefSist';
        this.name = 'arbolRefSist';
        this.autoScroll = true;
        this.useArrows = true;
        this.viewConfig = {
            loadingText: perfil.etiquetas.cargando //'Cargando'
        };
        this.width = 285;
        this.height = '100%';
        this.callParent(arguments);
    }
});
/**
 * Created by lilianne on 27/01/15.
 */

Ext.define('Conf.view.gestsist.contextMenu', {
    extend: "Ext.menu.Menu",
    alias: 'widget.contextMenu',

    initComponent: function () {
        this.id = 'contextMenu';
        this.items = [];
        var subsistema = Ext.create('Ext.menu.Item', {
            id: 'addsubistema',
            iconCls: 'adicionar',
            text: perfil.etiquetas.adicionarSub,//'Adicionar subistema',
            action:'insertarSubsistema'
        });
        var funcionalidad = Ext.create('Ext.menu.Item', {
            id: 'addfuncionalidad',
            iconCls: 'adicionar',
            text: perfil.etiquetas.adicionarFunc,//'Adicionar funcionalidad',
            action:'insertarFuncionalidad'
        });
        var recurso = Ext.create('Ext.menu.Item', {
            id: 'addrecurso',
            iconCls: 'adicionar',
            text: perfil.etiquetas.adicionarRec,//'Adicionar recurso',
            action:'insertarRecurso'
        });
        var eliminarSub = Ext.create('Ext.menu.Item', {
            id: 'elimsubsistema',
            iconCls: 'eliminar',
            text: perfil.etiquetas.eliminarSub,//'Eliminar subsistema',
            action:'eliminarcomponente'
        });
        var eliminarFuc = Ext.create('Ext.menu.Item', {
            id: 'elimfuncionalidad',
            iconCls: 'eliminar',
            text: perfil.etiquetas.eliminarFunc,//'Eliminar funcionalidad',
            action:'eliminarcomponente'
        });
        var eliminarRec = Ext.create('Ext.menu.Item', {
            id: 'elimrecurso',
            iconCls: 'eliminar',
            text: perfil.etiquetas.eliminarRec,//'Eliminar recuso',
            action:'eliminarcomponente'
        });

        if(!this.record.isRoot()) {
            if (this.record.raw.type == 'sistema') {
                this.items.push(subsistema);
                this.items.push(funcionalidad);
                this.items.push(eliminarSub);
            }
            else if (this.record.raw.type == 'funcionalidad') {
                this.items.push(recurso);
                this.items.push(eliminarFuc);
            }
            else {
                this.items.push(eliminarRec);
            }
        }
        else{
            this.items.push(subsistema);
        }


        this.callParent(arguments);
    }
});
/**
 * Created by lilianne on 29/01/15.
 */
Ext.require([
    'Ext.form.*',
    'Ext.layout.container.Column',
    'Ext.tab.Panel',
    'Ext.fx.target.Element'
]);

Ext.define('Conf.view.gestsist.formularioPanel', {
    extend: 'Ext.form.Panel',
    alias: 'widget.formularioPanel',

    initComponent: function() {

        Ext.define("Controlpanel.model.estado", {
            extend : 'Ext.data.Model',
            fields  : [
                {type: 'string', name : 'icon'}
            ]
        });

        var store =  Ext.create('Ext.data.Store', {
            model: 'Conf.model.ModelStoreComboBox',
            proxy   : {
            type   : 'ajax',
            url : 'cargarCmbIconFonts',
            reader : {
                type          : 'json',
                root          : 'icons'
            }},
            autoLoad: true
        });

        var combo = Ext.create('Ext.form.field.ComboBox', {
            fieldLabel: perfil.etiquetas.fieldLabelIcono,
            displayField: 'icon',
            width: 320,
            labelWidth: 130,
            store:store,
            queryMode: 'local',
            name: 'icono',
            id: 'icono',
            nextTab:'descripcion',
            prevTab:'denominacion',
            hiddenName: 'icono',
            editable: true,
            typeAhead: true,
            forceSelection : true,
            tpl :   '<tpl for=".">'+
            '<li class="x-boundlist-item">'+
            '<span class="icondistra-{icon}"></span>'+
            '{icon}</li></tpl>',
            maxLength : 30,
            maxLengthText : perfil.etiquetas.maxLengthText

        });

        this.id = 'formularioPanel';
        this.name = 'formularioPanel';
        this.region = 'north';
        this.frame = true;
        this.border = false;
        this.bodyStyle = 'padding:5px 5px 2px';

        this.collapsible = true;
        this.collapseMode = 'mini';
        this.collapsed = false;
        this.split = true;
        this.animCollapse = true;
        this.hideCollapseTool = true;

        this.fieldDefaults = {
            msgTarget: 'qtip',
            labelWidth: 80,
            labelAlign: 'top'
        };
        this.defaults = {
            anchor: '99.5%'
        };
        this.items = [{
            xtype:'fieldset',
            id: 'fieldsetformPanel',
            name:'fieldsetformPanel',
            title: perfil.etiquetas.titleFieldset,//'Información',
            //collapsible: true,
            defaultType: 'textfield',
            layout: 'column',
            defaults: {
                anchor: '100%',
                style: 'padding: 8px 0 0 0'
            },
            height : 130,
            //store: record,
            items :[
                {
                xtype: 'container',
                columnWidth:.2,
                layout: 'anchor',
                defaultType: 'textfield',
                defaults: {anchor: '95%', enableKeyEvents: true},
                items: [{
                    fieldLabel: perfil.etiquetas.fieldLabelDenominacion,//'Denominación',
                    name:'denominacion',
                    id: 'denominacion',
                    allowBlank: false,
                    blankText: perfil.etiquetas.blankText,//'Este campo es obligatorio.',
                    regex: /(^([a-zA-ZáéíóúÁÉÍÓÚñÑ\d\_\s\-]*))[a-zA-ZáéíóúÁÉÍÓÚñÑ\d]$/,
                    regexText: perfil.etiquetas.regexText1,//"Solo admite caracteres alfanuméricos y los caracteres especiales (-_)."
                    nextTab:'icono',
                    prevTab:'btnBuscarReferencia',
                    maxLength: 60,
                    maxLengthText: perfil.etiquetas.textMaximoCaracteres,
                    listeners: {
                        keydown: function (textField,eventObject){
                            //console.log(eventObject);
                            var ok = textField.getValue().length < 60;
                            var key = eventObject.getKey();
                            //console.log(key);
                            if(key == 46){
                                //console.log(Ext.getCmp('treeDD').keyMap);
                                if(typeof(Ext.getCmp('treeDD').keyMap.DeleteComp) === "undefined"){
                                    textField.enableKeyEvents = true;
                                    return
                                }
                                else{
                                    Ext.getCmp('treeDD').keyMap.DeleteComp.setDisabled(true);
                                }

                            }
                            if(key == 68 && eventObject.shiftKey){
                                console.log('entro aqui');
                                if(typeof(Ext.getCmp('gridAcciones').keyMap.DeleteAction) === "undefined"){
                                    textField.enableKeyEvents = true;
                                    return
                                }
                                else{
                                    Ext.getCmp('gridAcciones').keyMap.DeleteAction.setDisabled(true);
                                    textField.enableKeyEvents = true;
                                    return;
                                }
                            }
                            if(key == 8 || key == 46 || key == 35 || key == 36 || key == 37 || key == 39){
                                textField.enableKeyEvents = true;
                                return;
                            }
                            else if(!ok){
                                eventObject.stopEvent();
                                return ;
                            }
                        }
                    }
                }, {
                    fieldLabel: perfil.etiquetas.fieldLabelAbreviatura,//'Abreviatura',
                    id: 'abreviatura',
                    name: 'abreviatura',
                    nextTab:'referencia',
                    prevTab:'visibilidad',
                    regex: /(^([a-zA-ZáéíóúÁÉÍÓÚñÑ\d\_\s\-]*))[a-zA-ZáéíóúÁÉÍÓÚñÑ\d]$/,
                    regexText: perfil.etiquetas.regexText1,//"Solo admite caracteres alfanuméricos y los caracteres especiales (-_)."
                    maxLength: 50,
                    maxLengthText: perfil.etiquetas.textMaximoCaracteres,

                    minLength: 2,
                    minLengthText: perfil.etiquetas.textMinimoCaracteres,

                    listeners: {
                        keydown: function (textField,eventObject){
                            //console.log(eventObject);
                            var ok = textField.getValue().length < 50;
                            var key = eventObject.getKey();
                            //console.log(key);
                            if(key == 46){
                                //console.log(Ext.getCmp('treeDD').keyMap);
                                if(typeof(Ext.getCmp('treeDD').keyMap.DeleteComp) === "undefined"){
                                    textField.enableKeyEvents = true;
                                    return
                                }
                                else{
                                    Ext.getCmp('treeDD').keyMap.DeleteComp.setDisabled(true);
                                }

                            }
                            if(key == 68 && eventObject.shiftKey){
                                //console.log('entro aqui');
                                if(typeof(Ext.getCmp('gridAcciones').keyMap.DeleteAction) === "undefined"){
                                    textField.enableKeyEvents = true;
                                    return
                                }
                                else{
                                    Ext.getCmp('gridAcciones').keyMap.DeleteAction.setDisabled(true);
                                    textField.enableKeyEvents = true;
                                    return;
                                }
                            }
                            if(key == 8 || key == 46 || key == 35 || key == 36 || key == 37 || key == 39){
                                textField.enableKeyEvents = true;
                                return;
                            }
                            else if(!ok){
                                eventObject.stopEvent();
                                return ;
                            }
                        }
                    }
                }]
                },
                {
                    xtype: 'container',
                    columnWidth:.2,
                    layout: 'anchor',
                    defaultType: 'textfield',
                    defaults: {anchor: '95%'},
                    items: [combo/*{
                        fieldLabel: perfil.etiquetas.fieldLabelIcono,//'Ícono',
                        name: 'icono',
                        regex: /(^([a-zA-ZáéíóúÁÉÍÓÚñÑ])+([a-zA-ZáéíóÁÉÍÓÚúñÑ\d\_\s]*))$/,
                        regexText: perfil.etiquetas.regexText2,//"Solo admite caracteres alfanuméricos."
                        enableKeyEvents: true,
                        listeners: {
                            keydown: function (textField,eventObject){
                                console.log(eventObject);
                                var ok = textField.getValue().length < 255;
                                var key = eventObject.getKey();
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
                        }*/,
                        {
                            xtype: 'container',
                            layout: 'column',
                            defaults: {anchor: '100%'},
                            id: 'refebuton',
                            //width: '100%',
                            items: [{
                                xtype: 'textfield',
                                //defaults: {anchor: '98%'},
                                columnWidth:.9,
                                id: 'referencia',
                                name: 'referencia',
                                nextTab:'btnBuscarReferencia',
                                prevTab:'abreviatura',
                                emptyText: perfil.etiquetas.cajaReferencia,//'Seleccione la referencia',
                                fieldLabel: perfil.etiquetas.fieldLabelReferencia,//'Referencia',
                                allowBlank: false,
                                blankText: perfil.etiquetas.blankText, //'Este campo es obligatorio.'
                                regex: /(^([a-zA-ZáéíóúÁÉÍÓÚñÑ])+([a-zA-ZáéíóúÁÉÍÓÚñÑ\d\_\s\-\.\:\/]*))[a-zA-ZáéíóúÁÉÍÓÚñÑ\d]$/,
                                regexText: "Solo admite caracteres alfanuméricos seguido de los caracteres especiales (-_/.:)",
                                enableKeyEvents: true,
                                maxLength: 255,
                                maxLengthText: perfil.etiquetas.textMaximoCaracteres,
                                listeners: {
                                    keydown: function (textField,eventObject){
                                        //console.log(eventObject);
                                        var ok = textField.getValue().length < 255;
                                        var key = eventObject.getKey();
                                        //console.log(key);
                                        if(key == 46){
                                            //console.log(Ext.getCmp('treeDD').keyMap);
                                            if(typeof(Ext.getCmp('treeDD').keyMap.DeleteComp) === "undefined"){
                                                textField.enableKeyEvents = true;
                                                return
                                            }
                                            else{
                                                Ext.getCmp('treeDD').keyMap.DeleteComp.setDisabled(true);
                                            }

                                        }
                                        if(key == 68 && eventObject.shiftKey){
                                            //console.log('entro aqui');
                                            if(typeof(Ext.getCmp('gridAcciones').keyMap.DeleteAction) === "undefined"){
                                                textField.enableKeyEvents = true;
                                                return
                                            }
                                            else{
                                                Ext.getCmp('gridAcciones').keyMap.DeleteAction.setDisabled(true);
                                                textField.enableKeyEvents = true;
                                                return;
                                            }
                                        }
                                        if(key == 8 || key == 46 || key == 37 || key == 39 || key == 35 || key == 36){
                                            textField.enableKeyEvents = true;
                                            return;
                                        }
                                        else if(!ok){
                                            eventObject.stopEvent();
                                            return ;
                                        }
                                    }
                                }

                            },
                            {

                                xtype: 'button',
                                columnWidth:.1,
                                //defaults: {anchor: '100%'},
                                //text:'...',
                                tooltip: perfil.etiquetas.buscarReferencia,//'Buscar referencia (Alt+W)',
                                margin: '21 0 0 0',
                                nextTab:'denominacion',
                                prevTab:'referencia',
                                //style: 'padding: 2px 15px 2px 2px',
                                //style:'top: 19',
                                //styleHtmlContent: true,
                                iconCls: 'buscar',
                                id: 'btnBuscarReferencia',
                                action: 'buscarReferencia'

                            }]
                        }
                        ]
                },
                {
                    xtype: 'container',
                    columnWidth:.5,
                    layout: 'anchor',
                    defaultType: 'textarea',
                    defaults: {anchor: '98%'},
                    items: [{
                        fieldLabel: perfil.etiquetas.fieldLabelDescripcion,//'Descripción',
                        id: 'descripcion',
                        name: 'descripcion',
                        nextTab:'visibilidad',
                        prevTab:'icono',
                        maxLength: 255,
                        maxLengthText: perfil.etiquetas.textMaximoCaracteres,
                        regex : /(^([a-zA-ZáéíóúÁÉÍÓÚñÑ])+([a-zA-ZáéíóúÁÉÍÓÚñÑ\d\_\-\,\.\s]*))$/,
                        regexText : perfil.etiquetas.regexValidaDescripcion,
                        height : '81%',
                        enableKeyEvents: true,
                        listeners: {
                            keydown: function (textField,eventObject){
                                //console.log(eventObject);
                                var ok = textField.getValue().length < 255;
                                var key = eventObject.getKey();
                                
                                //console.log(eventObject.shiftKey);
                                //console.log(eventObject.isSpecialKey());
                                if(key == 46 ){

                                    //console.log(Ext.getCmp('treeDD').keyMap);
                                    if(typeof(Ext.getCmp('treeDD').keyMap.DeleteComp) === "undefined"){
                                        textField.enableKeyEvents = true;
                                        return
                                    }
                                    else{
                                        Ext.getCmp('treeDD').keyMap.DeleteComp.setDisabled(true);
                                    }

                                }
                                if(key == 68 && eventObject.shiftKey){
                                    //console.log('entro aqui');
                                    if(typeof(Ext.getCmp('gridAcciones').keyMap.DeleteAction) === "undefined"){
                                        textField.enableKeyEvents = true;
                                        return
                                    }
                                    else{
                                        Ext.getCmp('gridAcciones').keyMap.DeleteAction.setDisabled(true);
                                        textField.enableKeyEvents = true;
                                        return;
                                    }
                                }
                                if(key == 8 || key == 46 || key == 35 || key == 36 || key == 37 || key == 39){
                                    textField.enableKeyEvents = true;
                                    return;
                                }
                                else if(!ok){
                                    eventObject.stopEvent();
                                    return ;
                                }
                            }
                        }
                    }]
                },
                {
                    xtype: 'container',
                    //width : 100,
                    columnWidth:.1,
                    layout: 'anchor',
                    defaultType: 'checkbox',//'checkboxgroup'
                    defaults: {
                        itemsAlign: 'center',
                        anchor: '100%',
                        hideEmptyLabel: false
                    },
                    style: 'padding:27px 0px 0px 5px',
                    items: [{
                        boxLabel: perfil.etiquetas.boxLabelVisibilidad,//'Visibilidad',
                        id: 'visibilidad',
                        name: 'visibilidad',
                        inputValue: 'visibilidad',
                        nextTab:'abreviatura',
                        prevTab:'descripcion'
                    }, {
                        boxLabel: perfil.etiquetas.boxLabelExterno,//'Externo',
                        id: 'externo',
                        name: 'externo',
                        style: 'padding: 7px 0px 0px 0px',
                        inputValue: 'externo',
                        nextTab:'abreviatura',
                        prevTab:'descripcion'
                    }]
                }

            ]
        }];


        this.callParent(arguments);
    }

});
/**
 * Created by lily on 3/02/15.
 */
//Ext.Loader.setConfig({
//    enabled: true
//});
//Ext.Loader.setPath('Ext.ux', '../ux');

Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.state.*',
    'Ext.form.*'
    //'Ext.ux.CheckColumn'
]);


Ext.define('Conf.view.gestsist.gridEditorActions', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.gridEditorActions',

    initComponent: function () {
        //this.rowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
        //    clicksToMoveEditor: 1,
        //    autoCancel: false
        //});
        this.cellEditing = Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 2
        });
        this.id = 'gridAcciones';
        this.region = 'center';
        this.frame = true;
        this.border = false;
        this.store = Ext.create('Conf.store.StoreGridEditor');
        this.plugins = [this.cellEditing];
        this.columns = [{
            hidden: true,
            header: 'idfuncionalidad',
            dataIndex: 'idfuncionalidad',
            flex: 1
        },
        {
            hidden: true,
            header: 'idaccion',
            dataIndex: 'idaccion',
            flex: 1
        },
        {
            xtype: 'checkcolumn',
            header: '',
            dataIndex: 'checked',
            width: 35,
            editor: {
                xtype: 'checkbox',
                cls: 'x-grid-checkheader-editor'
            }
        },
        {
            header: perfil.etiquetas.fieldLabelDenominacion,//'Denominación',
            dataIndex: 'denominacion',
            width: 160,
            editor: {
                allowBlank: false,
                blankText: 'Este campo es obligatorio.',
                regex: /(^([a-zA-ZáéíóúÁÉÍÓÚñÑ])+([a-zA-ZáéíóúÁÉÍÓÚñÑ\d\_\-]*))$/,
                regexText: "Solo admite caracteres alfanuméricos y los caracteres especiales (-_)."
            }
        }, {
            header: perfil.etiquetas.fieldLabelDescripcion,//'Descripción',
            dataIndex: 'descripcion',
            flex: 1,
            editor: {
                allowBlank: true,
                maxLength: 250,
                maxLengthText: perfil.etiquetas.textMaximoCaracteres
            }
        }];
        this.tbar = [{
            xtype: 'textfield',
            name: 'cajaTextoGrid',
            id: 'cajaTextoGrid',
            emptyText : perfil.etiquetas.buscaremtytext,//'Buscar',
            nextTab: 'btnBuscarGrid',
            prevTab: 'deleteAccion',
            action: 'buscarCajaGrid',
            enableKeyEvents: true,
            maskRe: /^[áéíóúÁÉÍÓÚ/a-zA-Z0-9\_\s\-]*$/,
            /*maxLength:60,
            maxLengthText: perfil.etiquetas.textMaximoCaracteres,*/
            listeners: {
                keydown: function (textField,eventObject){
                    var ok = textField.getValue().length < 60;
                    var key = eventObject.getKey();

                    if(key == 46 ){
                        if(typeof(Ext.getCmp('treeDD').keyMap.DeleteComp) === "undefined"){
                            textField.enableKeyEvents = true;
                            return
                        }
                        else{
                            Ext.getCmp('treeDD').keyMap.DeleteComp.setDisabled(true);
                            textField.enableKeyEvents = true;
                            return;
                        }
                    }
                    if(key == 68 && eventObject.shiftKey){
                        //console.log('entro aqui');
                        if(typeof(Ext.getCmp('gridAcciones').keyMap.DeleteAction) === "undefined"){
                            textField.enableKeyEvents = true;
                            return
                        }
                        else{
                            Ext.getCmp('gridAcciones').keyMap.DeleteAction.setDisabled(true);
                            textField.enableKeyEvents = true;
                            return;
                        }
                    }
                    if(key == 8 || key == 46 || key == 35 || key == 36 || key == 37 || key == 39){
                        textField.enableKeyEvents = true;
                        return;
                    }
                    else if(!ok){
                        eventObject.stopEvent();
                        return ;
                    }
                },
                keyup: function (textField,eventObject){

                    var key = eventObject.getKey();
                    if(key == 86 && eventObject.ctrlKey){
                        if(textField.getValue().length > 60){
                            var string = textField.getValue();
                            var nuevovalor = string.slice(0,60);
                            textField.setValue(nuevovalor);
                        }
                    }
                }

            }
        },
            {
                iconCls: 'buscar',
                disabled:true,
                text: perfil.etiquetas.buscarbuton,
                tooltip: perfil.etiquetas.buscarGrid,//'Buscar',
                name: 'btnBuscarGrid',
                id: 'btnBuscarGrid',
                nextTab: 'btnLimpiarGrid',
                prevTab: 'cajaTextoGrid',
                action: 'buscarGrid'
                //hidden: true
            },
            {
                iconCls: 'limpiar',
                disabled:true,
                text: perfil.etiquetas.limpiar,
                tooltip: perfil.etiquetas.limpiarGrid,//'Limpiar',
                name: 'btnLimpiarGrid',
                id: 'btnLimpiarGrid',
                nextTab: 'addAccion',
                prevTab: 'btnBuscarGrid',
                action: 'limpiarGrid'
        }];
        this.bbar = Ext.create('Ext.PagingToolbar', {
            store: this.store,
            displayInfo: true,
            displayMsg: 'Mostrando de {0} - {1} de {2}',
            emptyMsg: '0 Resultado a mostrar',
            beforePageText: 'Página',
            afterPageText: 'de {0}',
            firstText: 'Primera Página',
            prevText: 'Página anterior',
            nextText: 'Página siguiente',
            lastText: 'Última Página',
            refreshText: 'Actualizar'

        });

        //this.bbar.items.items[10].config = { nextTab: 'addAccion'};
        //console.log(this.bbar.items);

        this.callParent(arguments);
    }
});
/**
 * Created by lilianne on 28/01/15.
 */

Ext.define('Conf.view.gestsist.panelDerecho', {
    extend: "Ext.panel.Panel",
    alias: 'widget.panelDerecho',

    initComponent: function() {
        this.myformularioPanel = Ext.widget('formularioPanel');
        this.gridEditor = Ext.widget('panelGrid');
        this.border = false;
        this.id = 'panelderecho';
        this.name = 'panelderecho';
        this.region = 'center';
        this.layout = 'border';
        this.items = [
            this.myformularioPanel,
            this.gridEditor
        ];
        this.tbar = [
            {
                disabled: true,
                text: perfil.etiquetas.guardartext,
                id: 'btnGuardar',
                tooltip: perfil.etiquetas.guardar,//'Guardar',
                nextTab: 'btnAyuda',
                prevTab: 'btnLimpiarTreeDerecho',
                iconCls: 'guardar',
                action: 'guardarcambios'
            },'->',{
                text: 'Ayuda',
                iconCls: "ayuda",
                tooltip : 'Ayuda',
                name: 'btnAyuda',
                id: 'btnAyuda',
                nextTab: 'addAccion',
                prevTab: 'btnGuardar'
            }
        ];

        this.callParent(arguments);
    }
});
/**
 * Created by lily on 4/02/15.
 */
Ext.define('Conf.view.gestsist.panelGrid', {
    extend: "Ext.panel.Panel",
    alias: 'widget.panelGrid',

    initComponent: function () {
        this.border = false;
        this.id = 'panelGrid';
        this.name = 'panelGrid';
        this.title = 'Listado de acciones';
        this.region = 'center';
        this.layout = 'border';
        this.tbar = [
            {
                disabled: true,
                id: 'addAccion',
                text: 'Adicionar',
                tooltip: perfil.etiquetas.adicionarAccion,//'Adicionar',
                nextTab: 'deleteAccion',
                prevTab: 'btnAyuda',
                iconCls: 'adicionar',
                action:  'insertarAccion'
            },
            {
                disabled: true,
                id: 'deleteAccion',
                text: 'Eliminar',
                tooltip: perfil.etiquetas.eliminarAccion,//'Eliminar',
                nextTab: 'cajaTextoGrid',
                prevTab: 'addAccion',
                iconCls: 'eliminar',
                action: 'eliminarAccion'
            }
        ];
        this.gridacciones = Ext.widget('gridEditorActions');
        this.items = [this.gridacciones];
        this.callParent(arguments);
    }
});

/**
 * Created by lilianne on 26/01/15.
 */

Ext.define('Conf.view.gestsist.panelMenuIzquierdo', {
    extend: "Ext.panel.Panel",
    alias: 'widget.panelMenuIzquierdo',

    initComponent: function () {
        this.border = false;
        this.id = 'mIzquierdo';
        this.name = 'mIzquierdo';
        var adicionarCategoria = Ext.create('Ext.menu.Item', {
            id: 'addCategoria',
            text: perfil.etiquetas.adicionarCateg,//'Adicionar categoria',
            tooltip: perfil.etiquetas.adicionarCategoria,//'Adicionar categoria (Alt+I+C)',
            iconCls: 'adicionar',
            action:  'insertarCategoria'
        });
        var adicionarSubsistema = Ext.create('Ext.menu.Item', {
            id: 'addSubsistema',
            text: perfil.etiquetas.adicionarSub,//'Adicionar subsistema',
            tooltip: perfil.etiquetas.adicionarSubsistema,//'Adicionar subsistema (Alt+I+S)',
            iconCls: 'adicionar',
            action:  'insertarSubsistema'
        });
        var adicionarFuncionalidad = Ext.create('Ext.menu.Item', {
            id: 'addFuncionalidad',
            text: perfil.etiquetas.adicionarFunc,//'Adicionar funcionalidad',
            tooltip: perfil.etiquetas.adicionarFuncionalidad,//'Adicionar funcionalidad (Alt+I+F)',
            iconCls: 'adicionar',
            action:  'insertarFuncionalidad'
        });
        var adicionarRecurso = Ext.create('Ext.menu.Item', {
            id: 'addRecurso',
            text: perfil.etiquetas.adicionarRec,//'Adicionar recurso',
            tooltip: perfil.etiquetas.adicionarRecurso,//'Adicionar recurso(Alt+I+R)',
            iconCls: 'adicionar',
            action:  'insertarRecurso'
        });
        this.tbar = [
            {
                disabled: true,
                id: 'btnAdicionar',
                tooltip: perfil.etiquetas.adicionarMenuIz,//'Adicionar',
                nextTab: 'btnEliminar',
                prevTab: 'btnLimpiarTreeDerecho',
                iconCls: 'adicionar',
                menu: [adicionarCategoria,adicionarSubsistema,adicionarFuncionalidad,adicionarRecurso]
            },
            {
                disabled: true,
                id: 'btnEliminar',
                tooltip: perfil.etiquetas.eliminarMenuIz,//'Eliminar',
                nextTab: 'btnExportar',
                prevTab: 'btnAdicionar',
                iconCls: 'eliminar',
                action: 'eliminarcomponente'
            },
            {
                disabled: true,
                id: 'btnExportar',
                tooltip: perfil.etiquetas.exportarSubsistema,//'Exportar el subsistema seleccionado',
                nextTab: 'btnImportar',
                prevTab: 'btnEliminar',
                iconCls: 'exportar',
                action: 'exportarsubsistema'
            },
            {
                disabled: true,
                id: 'btnImportar',
                tooltip: perfil.etiquetas.importarSubsistema,//'Importar al sistema seleccionado',
                nextTab: 'cajaTextoDerechaArbol',
                prevTab: 'btnExportar',
                iconCls: 'importar',
                action: 'importarsubsistema'
            }

        ];
        this.bbar = [
            { xtype: 'textfield',
                name: 'cajaTextoDerechaArbol',
                id: 'cajaTextoDerechaArbol',
              //  fieldLabel: perfil.etiquetas.buscar,
                emptyText : 'Buscar',//perfil.etiquetas.buscar,//'Buscar',
                maskRe: /^[áéíóúÁÉÍÓÚ/a-zA-Z0-9\_\s\-]*$/,
               // labelAlign : 'left',
              //  labelWidth: 43,
               // labelPad: 5,
              //  labelSeparator : ':',
                nextTab: 'btnLimpiarTreeDerecho',
                prevTab: 'btnImportar',
                action: 'buscarTreeCaja',
                enableKeyEvents: true,
                listeners: {
                    keydown: function (textField,eventObject){
                        var ok = textField.getValue().length < 60;
                        var key = eventObject.getKey();
                        if(key == 46 ){
                            if(typeof(Ext.getCmp('treeDD').keyMap.DeleteComp) === "undefined"){
                                textField.enableKeyEvents = true;
                                return
                            }
                            else{
                                Ext.getCmp('treeDD').keyMap.DeleteComp.setDisabled(true);
                                textField.enableKeyEvents = true;
                                return;
                            }
                        }
                        if(key == 68 && eventObject.shiftKey){
                            //console.log('entro aqui');
                            if(typeof(Ext.getCmp('gridAcciones').keyMap.DeleteAction) === "undefined"){
                                textField.enableKeyEvents = true;
                                return
                            }
                            else{
                                Ext.getCmp('gridAcciones').keyMap.DeleteAction.setDisabled(true);
                                textField.enableKeyEvents = true;
                                return;
                            }
                        }
                        if(key == 8 || key == 46 || key == 35 || key == 36 || key == 37 || key == 39){
                            textField.enableKeyEvents = true;
                            return;
                        }
                        else if(!ok){
                            eventObject.stopEvent();
                            return ;
                        }

                    },
                    keyup: function (textField,eventObject){

                        var key = eventObject.getKey();
                        if(key == 86 && eventObject.ctrlKey){
                            if(textField.getValue().length > 60){
                                var string = textField.getValue();
                                var nuevovalor = string.slice(0,60);
                                textField.setValue(nuevovalor);
                            }
                        }
                    }
                }
            },
            {
                iconCls: 'buscar',
                disabled:true,
                tooltip: perfil.etiquetas.buscarMenuIz, //'Buscar (Alt+B)',
                name: 'btnBuscarTreeDerecho',
                id: 'btnBuscarTreeDerecho',
                nextTab: 'btnLimpiarTreeDerecho',
                prevTab: 'cajaTextoDerechaArbol',
                action: 'buscarTree',
                hidden: true,
            },
            {
                iconCls: 'limpiar',
                disabled:true,
                tooltip: perfil.etiquetas.limpiarMenuIz,//'Limpiar',
                name: 'btnLimpiarTreeDerecho',
                id: 'btnLimpiarTreeDerecho',
                nextTab: 'btnGuardar',
                prevTab: 'cajaTextoDerechaArbol',
                action: 'limpiarFiltroTree'
            }
        ];

        this.callParent(arguments);
    }
});
/**
 * Created by lilianne on 23/01/15.
 */

Ext.require([
    'Ext.tree.*',
    'Ext.data.*',
    'Ext.tip.*'
]);

Ext.define('Conf.view.gestsist.treeDragDrop', {
    extend: 'Ext.tree.Panel',
    alias: 'widget.treeDD',
    mixins: {
        treeFilter: 'Conf.lib.TreeFilter'
    },
    initComponent: function () {

        this.treeStore = Ext.create('Conf.store.StoreTree');

        this.store = this.treeStore;
        this.title = perfil.etiquetas.titleTree; //'Sistemas registrados';
        this.border = false;
        this.id = 'treeDD';
        this.name = 'treeDD';
        this.autoScroll = true;
        this.useArrows = true;
        this.viewConfig = {
            plugins: {
                ptype: 'treeviewdragdrop'
            },
            loadingText: perfil.etiquetas.cargando //'Cargando'
        };
        this.menu = Ext.widget('panelMenuIzquierdo');
        this.dockedItems = [ this.menu ];
        this.collapsible = true;
        this.collapseMode = 'mini';
        this.collapsed = false;
        this.split = true;
        this.animCollapse = true;
        this.hideCollapseTool = true;
        this.region = 'west';
        this.height = '100%';
        this.width = '23%';


        this.callParent(arguments);
    }
});


/**
 * Created by lily on 5/02/15.
 */


Ext.define('Conf.view.gestsist.VentanaAddAccion', {
    extend: 'Ext.window.Window',
    alias: 'widget.ventanaAddAccion',

    initComponent: function(){
        this.title = perfil.etiquetas.titleWinAccion;//'Adicionar acción';
        this.layout = 'fit';
        this.height = 300;
        this.width = 350;
        this.modal = true;
        this.constrain = true,
        this.resizable = true;
        this.closable = true;
        this.closeAction = 'destroy';
        this.id = 'winAddAction';
        var _this = this;

        this.formularioAction = Ext.create('Ext.form.Panel', {
            frame:true,
            border: false,
            layout:'fit',
            bodyStyle:'padding:10px 9px 0 4px',
            fieldDefaults: {
                msgTarget: 'qtip',
                labelWidth: 75,
                labelAlign: 'top'
            },
            defaultType: 'textfield',

            items: [{
                xtype:'fieldset',
                id: 'fieldsetformAccion',
                name:'fieldsetformAccion',
                //collapsible: false,
                defaultType: 'textfield',
                //layout: 'form',
                defaults: {
                    anchor: '100%',
                    style: 'padding: 8px 0 0 0'
                },
                items :[
                   {
                        fieldLabel: perfil.etiquetas.fieldLabelDenominacion,//'Denominación',
                        name:'denominacionacc',
                        id: 'denominacionacc',
                        allowBlank: false,
                        blankText: 'Este campo es obligatorio.',
                        regex: /(^([a-zA-ZáéíóúÁÉÍÓÚñÑ])+([a-zA-ZáéíóúÁÉÍÓÚñÑ\d\_\-]*))$/,
                        prevTab: 'aceptar',
                        regexText: "Solo admite caracteres alfanuméricos y los caracteres especiales (-_).",
                        enableKeyEvents: true,
                        listeners: {
                            keyup: function(texfield, eventObject){
                                //console.log(texfield.isValid())
                                if(texfield.getValue() != "" && texfield.isValid()){
                                    Ext.getCmp('aplicar').enable();
                                    Ext.getCmp('aceptar').enable();
                                }
                                else{
                                    Ext.getCmp('aplicar').disable();
                                    Ext.getCmp('aceptar').disable();
                                }
                            },
                            keydown: function (textField,eventObject){
                                //console.log(eventObject);
                                var ok = textField.getValue().length < 60;
                                var key = eventObject.getKey();
                                //console.log(key);
                                if(key == 8 || key == 46 || key == 37 || key == 39 || key == 35 || key == 36){
                                    textField.enableKeyEvents = true;
                                    return;
                                }
                                else if(!ok){
                                    eventObject.stopEvent();
                                    return ;
                                }
                            }
                        }

                    }, {
                        xtype: 'textarea',
                        fieldLabel: perfil.etiquetas.fieldLabelDescripcion,//'Descripción',
                        defaultType: 'textarea',
                        name: 'descripcionacc',
                        maxLength: 250,
                        maxLengthText: perfil.etiquetas.textMaximoCaracteres,
                        height : '84%',
                        enableKeyEvents: true,
                        listeners: {
                            keydown: function (textField,eventObject){
                                //console.log(eventObject);
                                var ok = textField.getValue().length < 250;
                                var key = eventObject.getKey();
                                //console.log(key);
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
                    }
                ]
            }],

            buttons: [
                {
                iconCls: 'cancelar',
                id: 'cancelar',
                nextTab: 'aplicar',
                text: perfil.etiquetas.cancelar,//'Cancelar',
                tooltip: perfil.etiquetas.toolTipcancelar,//'Cerrar ventana sin guardar los datos',
                action:'closeWin'
            },{
                iconCls: 'aplicar',
                id: 'aplicar',
                disabled: true,
                nextTab: 'aceptar',
                prevTab: 'cancelar',
                text: perfil.etiquetas.aplicar,//'Aplicar',
                tooltip: perfil.etiquetas.toolTipaplicar,//'Guardar datos y limpiar los campos',
                action: 'agregarAccion'
            },{
                iconCls: 'aceptar',
                id:'aceptar',
                disabled: true,
                nextTab: 'denominacionacc',
                prevTab: 'aplicar',
                text: perfil.etiquetas.aceptar,//'Aceptar',
                tooltip: perfil.etiquetas.toolTipaceptar,//'Guardar datos y cerrar ventana',
                action: 'agregarAccion'
            }]


        });

        this.items = [this.formularioAction];

        this.callParent(arguments);
    }
});


/**
 * Created by lily on 13/02/15.
 */
Ext.define('Conf.view.gestsist.VentanaImportarSistema', {
    extend: 'Ext.window.Window',
    alias: 'widget.ventanaImportarSistema',

    initComponent: function(){
        this.title = perfil.etiquetas.titlewinImp;//'Importar sistema';
        this.layout = 'fit';
        this.width = 400,
        this.height = 165;
        this.modal = true;
        this.resizable = true;
        this.constrain = true;
        this.closable = true;
        this.closeAction = 'destroy';
        this.id = 'winImpSist';
        var _this = this;

        this.formularioImpSist = Ext.create('Ext.form.Panel', {

            bodyPadding: 10,
            layout: 'fit',
            id: 'formularioImpSist',
            name: 'formularioImpSist',
            frame:true,
            border: false,
            bodyStyle:'padding:5px 5px 2px',
            fieldDefaults: {
                msgTarget: 'side',
                labelWidth: 80,
                labelAlign: 'top'
            },
            defaults: { anchor: '99.5%' },

            items: [{
                xtype:'fieldset',
                id: 'fieldsetformImpSist',
                name:'fieldsetformImpSist',
                defaultType: 'textfield',
                defaults: {
                    anchor: '100%',
                    style: 'padding: 8px 0 8px 0'
                },
                items :[
                    {
                        xtype: 'filefield',
                        name:'fileUpload',
                        id:'fileUpload',
                        fieldLabel: perfil.etiquetas.fieldLabelImp,//'Seleccione el sistema para importar',
                        labelWidth: 50,
                        msgTarget: 'qtip',
                        allowBlank: false,
                        blankText: perfil.etiquetas.blankText, //'Este campo es obligatorio.',
                        anchor: '100%',
                        //buttonText: 'Buscar...',
                        buttonConfig:{
                            iconCls: 'buscar',
                            name: 'btnBuscarSistema',
                            id: 'btnBuscarSistema',
                            text: perfil.etiquetas.buscar,//'Buscar'
                            nextTab: 'cancelar',
                            prevTab: 'fileUpload'
                        }
                    }
                ]
            }],

            buttons: [{
                iconCls: 'cancelar',
                id: 'cancelar',
                nextTab: 'aceptar',
                prevTab: 'btnBuscarSistema',
                text: perfil.etiquetas.cancelar,//'Cancelar',
                tooltip:perfil.etiquetas.toolTipcancelar,//'Cerrar ventana sin guardar los datos',
                action:'closeWin'
            },{
                iconCls: 'aceptar',
                id:'aceptar',
                nextTab: 'fileUpload',
                prevTab: 'cancelar',
                text: perfil.etiquetas.aceptar,//'Aceptar',
                tooltip: perfil.etiquetas.toolTipaceptar, //'Guardar datos y cerrar ventana',
                action: 'importarSistema'
            }]

        });

        this.items = [this.formularioImpSist];

        this.callParent(arguments);
    }
});
/**
 * Created by lily on 11/02/15.
 */

Ext.define('Conf.view.gestsist.VentanaReferencia', {
    extend: 'Ext.window.Window',
    alias: 'widget.ventanaReferencia',

    initComponent: function() {
        //this.title = 'Referencia';
        this.layout = 'fit';
        this.height = 400;
        this.width = 300;
        this.modal = true;
        this.resizable = true;
        this.constrain = true;
        this.closable = true;
        this.closeAction = 'destroy';
        this.id = 'winReferencia';
        //this.frame = true;
        //this.items = this.arbolReferencia,
        this.buttons = [{
            iconCls: 'cancelar',
            id: 'cancelar',
            nextTab: 'aceptar',
            //prevTab: '',
            text: perfil.etiquetas.cancelar,//'Cancelar',
            tooltip:perfil.etiquetas.toolTipcancelar,//'Cerrar ventana sin guardar los datos',
            action:'closeWinRef'
            },{
            disabled: true,
            iconCls: 'aceptar',
            id:'aceptar',
            //nextTab: '',
            prevTab: 'cancelar',
            text: perfil.etiquetas.aceptar,//'Aceptar',
            tooltip:perfil.etiquetas.toolTipaceptar,//'Guardar datos y cerrar ventana',
            action: 'closeWin'
            }
        ];

        this.callParent(arguments);
    }

});
/**
 * Created by lilianne on 23/01/15.
 */
Ext.define('Conf.view.gestsist.Principal' ,{
    extend: 'Ext.panel.Panel',
    alias : 'widget.principal',

    initComponent: function() {
        this.id = 'principal';
        this.PanelWest = Ext.widget('treeDD');
        this.PanelDerecho = Ext.widget('panelDerecho');
        this.layout  = 'border';
        this.region = 'center'
        this.items = [

            this.PanelWest,
            this.PanelDerecho

        ];

        this.callParent(arguments);
    }
});
/**
 * Created by lilianne on 23/01/15.
 */
Ext.define('Conf.controller.Gestsist', {
    id: 'gestsist_controller',
    extend: 'Ext.app.Controller',

    views: [
        'gestsist.Principal',
        'gestsist.treeDragDrop',
        'gestsist.panelMenuIzquierdo',
        'gestsist.contextMenu',
        'gestsist.panelDerecho',
        'gestsist.formularioPanel',
        'gestsist.gridEditorActions',
        'gestsist.panelGrid',
        'gestsist.VentanaAddAccion',
        'gestsist.arbolRefFunc',
        'gestsist.arbolRefSist',
        'gestsist.VentanaReferencia',
        'gestsist.VentanaImportarSistema'
    ],

    refs: [{
        ref: 'principal',
        selector: 'principal'
    }],

    init: function() {
        var _this = this;
        contextmenu = null;
        insertarSub = false;
        insertarFunc = false;
        insertarRec = false;
        modificarSub = false;
        modificarFunc = false;
        modificarRec = false;
        recordNodoSelect = null;
        var ultimoRecord;
        estilo = null;

        this.control({

            'principal': {
                render: _this.onRenderPrincipal
            },

            'principal treepanel[name=treeDD]': {
                render: _this.onRender,
                beforeitemexpand :_this.onBeforeitemexpand,
                beforeload: _this.onBeforeload,
                load: _this.onLoad,
                itemclick: function(view, record, item){
                    Ext.getCmp('treeDD').getSelectionModel().select([record]);
                    function continuar() {
                        Ext.getCmp('gridAcciones').keyMap.DeleteAction.setDisabled(false);
                        Ext.getCmp('treeDD').keyMap.DeleteComp.setDisabled(false);
                        _this.onClick(view, record, item);

                    };
                    if(Ext.getCmp('btnGuardar').disabled==false) {
                        mostrarMensaje(2, perfil.etiquetas.datossinguardar,continuar);
                        //Msg.util.MostrarMsg(4,perfil.etiquetas.confirmacion,perfil.etiquetas.datossinguardar,continuar,this);
                    }
                    else
                    {
                        Ext.getCmp('gridAcciones').keyMap.DeleteAction.setDisabled(false);
                        Ext.getCmp('treeDD').keyMap.DeleteComp.setDisabled(false);
                        _this.onClick(view, record, item);
                    }

                },
                itemcontextmenu: _this.onItemcontextmenu,
                itemcollapse: _this.onItemcollapse
            },

            'panelMenuIzquierdo textfield[action=buscarTreeCaja]': {
                keyup: _this.filtrarTree
            },

            'panelMenuIzquierdo button[action=buscarTree]': {
                click: _this.filtrarTree
            },

            'panelMenuIzquierdo button[action=limpiarFiltroTree]': {
                click: _this.limpiarFiltroTree
            },

            'panelMenuIzquierdo menuitem[action=insertarSubsistema]': {
                click: _this.insertarSubsistema
            },

            'panelMenuIzquierdo menuitem[action=insertarFuncionalidad]': {
                click: _this.insertarFuncionalidad
            },

            'panelMenuIzquierdo menuitem[action=insertarRecurso]': {
                click: _this.insertarRecurso
            },

            'panelMenuIzquierdo button[action=importarsubsistema]': {
                click: _this.importarsubsistema
            },

            'panelMenuIzquierdo button[action=exportarsubsistema]': {
                click: _this.exportarsubsistema
            },

            'panelMenuIzquierdo button[action=eliminarcomponente]': {
                click: _this.eliminarcomponente
            },

            'contextMenu': {
                click: _this.onClickContextMenu
            },

            'panelDerecho': {
                render: _this.onRenderDerecho
            },

            'panelDerecho button[action=guardarcambios]': {
                click: _this.guardarcambios
            },

            'formularioPanel button[action=buscarReferencia]': {
                click: _this.buscarReferencia
            },


            'formularioPanel textfield[name=denominacion]': {
                change: _this.habilitarGuardar
            },

            'formularioPanel textfield[name=abreviatura]': {
                change: _this.habilitarGuardar
            },

            'formularioPanel combobox[name=icono]': {
                change: _this.habilitarGuardar
            },

            'formularioPanel textfield[name= referencia]': {
                change: _this.habilitarGuardar
            },

            'formularioPanel textarea[name=descripcion]': {
                change: _this.habilitarGuardar
            },

            'formularioPanel checkbox[name=visibilidad]': {
                change: _this.habilitarGuardar
            },

            'formularioPanel checkbox[name=externo]': {
                change: function(obj){
                    _this.habilitarGuardar(obj);
                    _this.resetearReferencia();
                }
            },

            'panelGrid button[action=insertarAccion]': {
                click: _this.insertarAccion
            },

            'panelGrid button[action=eliminarAccion]': {
                click: _this.eliminarAccion
            },

            'ventanaAddAccion': {
                render: _this.renderVentanaAddAccion
            },

            'ventanaAddAccion button[action=closeWin]': {
                click: _this.closeWin
            },

            'ventanaAddAccion button[action=agregarAccion]': {
                click: _this.agregarAccion
            },

            'gridEditorActions': {
                selectionchange: _this.selectionchange,
                beforeedit: _this.beforeeditGrid,
                beforeselect: function(){
                    Ext.getCmp('treeDD').keyMap.DeleteComp.setDisabled(false);
                    Ext.getCmp('gridAcciones').keyMap.DeleteAction.setDisabled(false);
                },
                render: _this.renderGrid
            },

            'gridEditorActions textfield[action = buscarCajaGrid]': {
                keyup: _this.buscarCajaAcciones
            },

            'gridEditorActions button[action = buscarGrid]': {
                click: _this.buscarrAcciones
            },

            'gridEditorActions button[action = limpiarGrid]': {
                click: _this.limpiarCajaRecargargrid
            },

            'ventanaReferencia button[action=closeWin]': {
                click: _this.closeWin
            },

            'ventanaReferencia button[action=closeWinRef]': {
                click: _this.closeWinRef
            },

            'ventanaReferencia': {
                render: _this.renderVentanaReferencia
            },

            'arbolRefFunc': {
                beforeload: _this.onBeforeloadArboRefFunc,
                itemclick: _this.onClickArboRefFunc
            },
            'arbolRefSist': {
                beforeload: _this.onBeforeloadArboRefSist,
                itemclick: _this.onClickArboRefSist
            },

            'ventanaImportarSistema button[action=closeWin]': {
                click: _this.closeWin
            },

            'ventanaImportarSistema': {
                render: _this.renderVentanaImportarSistema
            },

            'ventanaImportarSistema button[action=importarSistema]': {
                click: _this.importarSistema
            }
        });
    },

    onRenderPrincipal: function () {
        this.keyMap = Ext.widget('keymapController');

    },

    onRender: function(arbolPanel){
        var _this = this;
        arbolPanel.getView().on('beforedrop', function(node,data, overModel,dropPosition, dropFunction, eOpts){   
            var indice = 0;
            var idsistemaDestino = 0;
            var idsitemaOrigen = 0;
            var indiceNodo = 0;
            var idsistema = null;
            var idfuncionalidad = null;
            _this.modIndex = function(idsistemaDestino,indice){         
                if (data.records[0].raw.type == 'funcionalidad') {
                    Ext.Ajax.request({
                        url: 'modificarRelacionFuncionalidadSitema',
                        method: 'POST',
                        params: {
                            idsistemaDestino: idsistemaDestino,
                            idfuncionalidad: data.records[0].raw.idfuncionalidad,
                            indice: indice
                        },

                        waitTitle: perfil.etiquetas.waitTitle,//"Por favor espere...",
                        waitMsg: perfil.etiquetas.waitMsgOnRender,//'Guardando posición',

                        callback: function (options, success, response) {
                            _this.recargarNodo();
                            arbolPanel.getSelectionModel().select([data.records[0]]);                           
                        }
                    });
                }
                else if(data.records[0].raw.type == 'sistema'){
                    Ext.Ajax.request({
                        url: 'modificarRelacionSistemaSitema',
                        method: 'POST',
                        params: {
                            idsistemaDestino: idsistemaDestino,
                            idsistema: data.records[0].raw.idsistema,
                            indice: indice

                        },
                        waitTitle: perfil.etiquetas.waitTitle,//"Por favor espere...",
                        waitMsg: perfil.etiquetas.waitMsgOnRender,//'Guardando posición',

                        callback: function (options, success, response) {
                            _this.recargarNodo();
                            arbolPanel.getSelectionModel().select([data.records[0]]);
                        }
                    });
                }
            };

            _this.moverRecursoHeredado = function(idFuncionalidadAdoptiva, idrecurso, externo,nodoAdoptivo, nodoContenedor){
                Ext.Ajax.request({
                    url: 'moverRecursoHeredado',
                    method: 'POST',
                    params: {
                        idfuncionalidadAdoptiva: idFuncionalidadAdoptiva,
                        idrecurso: idrecurso,
                        externo: externo

                    },
                    waitTitle: perfil.etiquetas.waitTitle,//"Por favor espere...",
                    waitMsg: perfil.etiquetas.waitMsgOnRender,//'Guardando posición',

                    callback: function (options, success, response) {
                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsg == 1) {

                        }
                        else{
                            mostrarMensaje(6,responseData.mensaje);
                            //Msg.util.msg(3, perfil.etiquetas.error, responseData.mensaje);
                        }
                        recordNodoSelect = nodoContenedor;
                        _this.recargarNodo();
                        arbolPanel.getSelectionModel().select([data.records[0]]);
                        recordNodoSelect = nodoAdoptivo;
                        _this.recargarNodo();
                        arbolPanel.getSelectionModel().select([data.records[0]]);

                    }
                });
            }
          
            _this.existeRecurso = function(idrecurso, idfuncionalidadAdoptiva){           
                var xhr = new XMLHttpRequest();
                var formulario = new FormData();
                formulario.append("idfuncionalidadAdoptiva", idfuncionalidadAdoptiva);
                formulario.append("idrecurso",idrecurso);
                xhr.open("POST", "existeRecurso", false); //FALSE, para sincronizar hago una petición síncrona para facilitar la recepción
                xhr.send(formulario);
                var responseData = Ext .decode(xhr.responseText);
                return responseData
            }
           
            switch (dropPosition){
                case 'before':
                    console.log('entro al before');
                    console.log(data.records[0].raw.type);
                    console.log(overModel.raw.type);
                    console.log(data.records[0].raw.heredado);
                    if(data.records[0].raw.type == 'sistema' &&  overModel.raw.type == 'recurso')
                        return false;
                    else if(data.records[0].raw.type == 'funcionalidad' && overModel.raw.type == 'recurso')
                        return false;
                    if(data.records[0].raw.type == 'funcionalidad' && overModel.parentNode.isRoot()){
                        return false;
                    }
                    else if(data.records[0].raw.type == 'recurso' &&  overModel.raw.type == 'sistema')
                        return false;
                    if(data.records[0].raw.type == 'recurso' &&  overModel.raw.type == 'funcionalidad')
                        return false;
                    if(data.records[0].raw.type == 'recurso' &&  overModel.raw.type == 'recurso'){
                        if(!data.records[0].raw.heredado && data.records[0].raw.idfuncionalidad != overModel.parentNode.raw.idfuncionalidad){

                            idfuncionalidadAdoptiva = overModel.parentNode.raw.idfuncionalidad;
                            idrecursomovido = data.records[0].raw.idrecurso;
                            externo = data.records[0].parentNode.raw.externa;                           
                            var responseData =  _this.existeRecurso(idrecursomovido, idfuncionalidadAdoptiva);                          
                            if(responseData.length > 0)
                                return false;
                            else
                                _this.moverRecursoHeredado(idfuncionalidadAdoptiva,idrecursomovido, externo, overModel.parentNode, data.records[0].parentNode);


                        }
                        else if(data.records[0].raw.heredado && data.records[0].raw.idfuncionalidad != overModel.parentNode.raw.idfuncionalidad){
                            if(data.records[0].parentNode.raw.idfuncionalidad != overModel.parentNode.raw.idfuncionalidad) {

                                idfuncionalidadAdoptiva = overModel.parentNode.raw.idfuncionalidad;
                                idrecursomovido = data.records[0].raw.idrecurso;
                                externo = data.records[0].raw.externo;
                                var responseData = _this.existeRecurso(idrecursomovido, idfuncionalidadAdoptiva);                              
                                if (responseData.length > 0)
                                    return false;
                                else
                                    _this.moverRecursoHeredado(idfuncionalidadAdoptiva, idrecursomovido,externo, overModel.parentNode, data.records[0].parentNode);
                            }
                            else
                                return false;
                        }
                        else{
                            return false;
                        }
                      
                    }
                    else if(data.records[0].raw.type == 'sistema' || data.records[0].raw.type == 'funcionalidad'){
                        indice = overModel.raw.indice;
                        if(overModel.parentNode.raw){
                            idsistemaDestino = overModel.parentNode.raw.idsistema;
                        }
                        else{
                            idsistemaDestino = overModel.parentNode.data.id;
                        }
                        if(data.records[0].raw.type == 'sistema'){
                            if(data.records[0].parentNode.raw){
                                idsitemaOrigen = data.records[0].parentNode.raw.idsistema;
                            }
                            else{
                                idsitemaOrigen = data.records[0].parentNode.data.id;
                            }
                            indiceNodo = data.records[0].raw.indice;
                            idsistema = data.records[0].raw.idsistema;
                        }
                        else if(data.records[0].raw.type == 'funcionalidad'){
                            if(data.records[0].parentNode.raw){
                                idsitemaOrigen = data.records[0].parentNode.raw.idsistema;
                            }
                            else{
                                idsitemaOrigen = data.records[0].parentNode.data.id;
                            }
                            indiceNodo = data.records[0].raw.indice;
                            idfuncionalidad = data.records[0].raw.idfuncionalidad;
                        }                      
                        Ext.Ajax.request({
                            url: 'modificarIndice',
                            method: 'POST',
                            params: {
                                idsitemaOrigen:  idsitemaOrigen,
                                indiceNodo: indiceNodo,
                                indice: indice,
                                idsistemaDestino: idsistemaDestino,
                                idsistema: idsistema,
                                idfuncionalidad: idfuncionalidad

                            },

                            waitTitle: perfil.etiquetas.waitTitle,//"Por favor espere...",
                            waitMsg: perfil.etiquetas.waitMsgOnRender,//'Guardando posición',

                            callback: function (options, success, response) {

                            }
                        });
                        recordNodoSelect = overModel.parentNode;
                        _this.modIndex(idsistemaDestino,indice);
                    }
                    break;
                case 'after':

                    if(data.records[0].raw.type == 'sistema' &&  overModel.raw.type == 'recurso')
                        return false;
                    else if(data.records[0].raw.type == 'funcionalidad' && overModel.raw.type == 'recurso')
                        return false;
                    if(data.records[0].raw.type == 'funcionalidad' && overModel.parentNode.isRoot()){
                        return false;
                    }
                    else if(data.records[0].raw.type == 'recurso' &&  overModel.raw.type == 'sistema')
                        return false;
                    if(data.records[0].raw.type == 'recurso' &&  overModel.raw.type == 'funcionalidad')
                        return false;
                    else if(data.records[0].raw.type == 'recurso' &&  overModel.raw.type == 'recurso'){
                        if(!data.records[0].raw.heredado && data.records[0].raw.idfuncionalidad != overModel.parentNode.raw.idfuncionalidad){

                            idfuncionalidadAdoptiva = overModel.parentNode.raw.idfuncionalidad;
                            idrecursomovido = data.records[0].raw.idrecurso;
                            externo = data.records[0].parentNode.raw.externa;                           
                            var responseData =  _this.existeRecurso(idrecursomovido, idfuncionalidadAdoptiva);                            
                            if(responseData.length > 0)
                                return false;
                            else
                                _this.moverRecursoHeredado(idfuncionalidadAdoptiva,idrecursomovido, externo,overModel.parentNode, data.records[0].parentNode);

                        }
                        else if(data.records[0].raw.heredado && data.records[0].raw.idfuncionalidad != overModel.parentNode.raw.idfuncionalidad){

                            if(data.records[0].parentNode.raw.idfuncionalidad != overModel.parentNode.raw.idfuncionalidad) {

                                idfuncionalidadAdoptiva = overModel.parentNode.raw.idfuncionalidad;
                                idrecursomovido = data.records[0].raw.idrecurso;
                                externo = data.records[0].raw.externo;                             
                                var responseData = _this.existeRecurso(idrecursomovido, idfuncionalidadAdoptiva);                               
                                if (responseData.length > 0)
                                    return false;
                                else
                                    _this.moverRecursoHeredado(idfuncionalidadAdoptiva, idrecursomovido, externo,overModel.parentNode, data.records[0].parentNode);
                            }
                            else
                                return false;

                        }
                        else{
                            return false;
                        }                  
                    }
                    else{
                        indice = parseInt(overModel.raw.indice)+1;
                        if(overModel.parentNode.raw){
                            idsistemaDestino = overModel.parentNode.raw.idsistema;
                        }
                        else{
                            idsistemaDestino = overModel.parentNode.data.id;
                        }
                        if(data.records[0].raw.type == 'sistema'){
                            if(data.records[0].parentNode.raw){
                                idsitemaOrigen = data.records[0].parentNode.raw.idsistema;
                            }
                            else{
                                idsitemaOrigen = data.records[0].parentNode.data.id;
                            }
                            indiceNodo = data.records[0].raw.indice;
                            idsistema = data.records[0].raw.idsistema;
                        }
                        else if(data.records[0].raw.type == 'funcionalidad'){
                            if(data.records[0].parentNode.raw){
                                idsitemaOrigen = data.records[0].parentNode.raw.idsistema;
                            }
                            else{
                                idsitemaOrigen = data.records[0].parentNode.data.id;
                            }
                            indiceNodo = data.records[0].raw.indice;
                            idfuncionalidad = data.records[0].raw.idfuncionalidad;
                        }                       
                        Ext.Ajax.request({
                            url: 'modificarIndice',
                            method: 'POST',
                            params: {
                                idsitemaOrigen:  idsitemaOrigen,
                                indiceNodo: indiceNodo,
                                indice: indice,
                                idsistemaDestino: idsistemaDestino,
                                idsistema: idsistema,
                                idfuncionalidad: idfuncionalidad

                            },

                            waitTitle: perfil.etiquetas.waitTitle,//"Por favor espere...",
                            waitMsg: perfil.etiquetas.waitMsgOnRender,//'Guardando posición',

                            callback: function (options, success, response) {

                            }
                        });
                        recordNodoSelect = overModel.parentNode;
                        _this.modIndex(idsistemaDestino,indice);

                    }
                    break;
                case 'append':
                    console.log('entro al append');
                    console.log(data.records[0].raw.type);
                    console.log(overModel.raw.type);
                    console.log(data.records[0].raw.heredado);
                    if(overModel.isRoot() && data.records[0].raw.type == 'funcionalidad')
                        return false;
                    else if(!overModel.isRoot()){
                        if(data.records[0].raw.type == 'sistema' && overModel.raw.type == 'funcionalidad' || overModel.raw.type == 'recurso')
                            return false;
                        else if(data.records[0].raw.type == 'funcionalidad' && overModel.raw.type == 'funcionalidad' || overModel.raw.type == 'recurso')
                            return false;
                        else if(data.records[0].raw.type == 'recurso' && overModel.raw.type == 'sistema' || overModel.raw.type == 'recurso')
                            return false;
                    }
                    if(overModel.isExpanded()){
                        if(overModel.raw.type != 'funcionalidad'){
                            indice = overModel.childNodes.length;
                            if(overModel.raw){
                                idsistemaDestino = overModel.raw.idsistema;
                                recordNodoSelect = overModel;
                                _this.modIndex(idsistemaDestino,indice);
                            }
                            else{
                                idsistemaDestino = overModel.data.id;
                                recordNodoSelect = overModel;
                                _this.modIndex(idsistemaDestino,indice);
                            }
                        }
                        else if(overModel.raw.type == 'funcionalidad'){
                            if(!data.records[0].raw.heredado && data.records[0].raw.idfuncionalidad != overModel.raw.idfuncionalidad){
                                idfuncionalidadAdoptiva = overModel.raw.idfuncionalidad;
                                idrecursomovido = data.records[0].raw.idrecurso;
                                externo = data.records[0].parentNode.raw.externa;                            
                                var responseData =  _this.existeRecurso(idrecursomovido, idfuncionalidadAdoptiva);                             
                                if(responseData.length > 0)
                                    return false;
                                else
                                    _this.moverRecursoHeredado(idfuncionalidadAdoptiva,idrecursomovido, externo,overModel, data.records[0].parentNode);

                            }
                            else if(data.records[0].raw.heredado && data.records[0].raw.idfuncionalidad != overModel.raw.idfuncionalidad){
                                if(data.records[0].parentNode.raw.idfuncionalidad != overModel.raw.idfuncionalidad){
                                    idfuncionalidadAdoptiva = overModel.raw.idfuncionalidad;
                                    idrecursomovido = data.records[0].raw.idrecurso;
                                    externo = data.records[0].raw.externo;                                  
                                    var responseData =  _this.existeRecurso(idrecursomovido, idfuncionalidadAdoptiva);                                   
                                    if(responseData.length > 0)
                                        return false;
                                    else
                                        _this.moverRecursoHeredado(idfuncionalidadAdoptiva,idrecursomovido,externo, overModel, data.records[0].parentNode);

                                }
                                else
                                    return false;

                            }
                            else{
                                return false;
                            }                           
                        }

                    }
                    else if(overModel.raw.type == 'funcionalidad'){
                        overModel.expand();
                        if(!data.records[0].raw.heredado && data.records[0].raw.idfuncionalidad != overModel.raw.idfuncionalidad){
                            idfuncionalidadAdoptiva = overModel.raw.idfuncionalidad;
                            idrecursomovido = data.records[0].raw.idrecurso;
                            externo = data.records[0].parentNode.raw.externa;                       
                            var responseData =  _this.existeRecurso(idrecursomovido, idfuncionalidadAdoptiva);                            
                            if(responseData.length > 0)
                                return false;
                            else
                                _this.moverRecursoHeredado(idfuncionalidadAdoptiva,idrecursomovido,externo, overModel, data.records[0].parentNode);

                        }
                        else if(data.records[0].raw.heredado && data.records[0].raw.idfuncionalidad != overModel.raw.idfuncionalidad){
                            if(data.records[0].parentNode.raw.idfuncionalidad != overModel.raw.idfuncionalidad){
                                idfuncionalidadAdoptiva = overModel.raw.idfuncionalidad;
                                idrecursomovido = data.records[0].raw.idrecurso;
                                externo = data.records[0].raw.externo;                               
                                var responseData =  _this.existeRecurso(idrecursomovido, idfuncionalidadAdoptiva);                              
                                if(responseData.length > 0)
                                    return false;
                                else
                                    _this.moverRecursoHeredado(idfuncionalidadAdoptiva,idrecursomovido,externo, overModel, data.records[0].parentNode);

                            }
                            else
                                return false;

                        }
                        else{
                            return false;
                        }
                    }
                    else if(overModel.raw && overModel.raw.type != 'funcionalidad'){
                        Ext.Ajax.request({
                            url: 'cantidadHijos',
                            method: 'POST',
                            params: {
                                idsitema: overModel.raw.idsistema
                            },

                            callback: function (options, success, response) {
                                responseData = Ext.decode(response.responseText);
                                indice = responseData.cantidadHijos+1;
                                idsistemaDestino = overModel.raw.idsistema;
                                recordNodoSelect = overModel;
                                _this.modIndex(idsistemaDestino,indice);
                            }
                        });
                    }
                    else{
                        Ext.Ajax.request({
                            url: 'cantidadHijos',
                            method: 'POST',
                            params: {
                                idsitema: overModel.data.id
                            },

                            callback: function (options, success, response) {
                                responseData = Ext.decode(response.responseText);
                                indice = responseData.cantidadHijos+1;
                                idsistemaDestino = overModel.data.id;
                                recordNodoSelect = overModel;
                                _this.modIndex(idsistemaDestino,indice);

                            }
                        });
                    }



                    break;
            }       

        });

        arbolPanel.keyMap = Ext.widget('keymapController');

        arbolPanel.keyMap.pressAltIS(this);
        arbolPanel.keyMap.pressAltIF(this);
        arbolPanel.keyMap.pressAltIR(this);
        arbolPanel.keyMap.deleteComponente(this,arbolPanel);
        arbolPanel.keyMap.buscarTree(this);
        arbolPanel.keyMap.limpiarTree(this);
        arbolPanel.keyMap.importarSubsistema(this);
        arbolPanel.keyMap.exportarSubsistema(this);

        Ext.getCmp('cajaTextoDerechaArbol').focus(false, 200);

    },

    onRenderDerecho: function(){      
        Ext.getCmp('fieldsetformPanel').disable();
        Ext.getCmp('fieldsetformPanel').collapse();

        Ext.getCmp('panelGrid').disable();
        Ext.getCmp('addAccion').disable();
        Ext.getCmp('deleteAccion').disable();

        this.keyMap.pressAltG(this);
        this.keyMap.abrirReferencia(this);
    },

    onBeforeload: function (store, operation) {
        if (!operation.node.isRoot()) {
            if (operation.node.raw.idsistema)
                operation.params.idsistema = operation.node.raw.idsistema;
            if (operation.node.raw.idfuncionalidad) {
                operation.params.idfuncionalidad = operation.node.raw.idfuncionalidad;
                operation.params.referencia = operation.node.raw.referencia;
                operation.params.externa = operation.node.raw.externa;
            }
            operation.params.type = operation.node.raw.type;
            operation.params.start = 0;
            operation.params.limit = 0;
        }

    },

    onLoad: function(store, records, successful, operation, eOpts ){
        Ext.getCmp('treeDD').fireEvent('itemclick',records,records);
    },

    onBeforeitemexpand: function (nodo) {
        recordNodoSelect = nodo;
        Ext.getCmp('treeDD').getSelectionModel().select([nodo]);
    },

    onItemcollapse: function (node, eOpts ){
        Ext.getCmp('treeDD').fireEvent('itemclick',node,node);
    },
    onClick : function (view, record, item) {
        Ext.getCmp('gridAcciones').getStore().proxy.extraParams.msg = perfil.etiquetas.noseencontrarondatos;
        Ext.getCmp('treeDD').keyMap.DeleteComp.setDisabled(false);
        Ext.getCmp('gridAcciones').keyMap.DeleteAction.setDisabled(false);

        this.ultimoRecord=record;

        Ext.getCmp('btnGuardar').disable();
        recordNodoSelect = record;
        insertarSub = false;
        insertarFunc = false;
        insertarRec = false;

        Ext.getCmp('gridAcciones').getStore().removeAll();
        Ext.getCmp('cajaTextoGrid').reset();

        if (!record.isRoot()) {
            if (record.raw.idsistema == undefined) {
                if (record.raw.type == 'recurso') {
                    modificarSub = false;
                    modificarFunc = false;
                    modificarRec = true;
                    Ext.getCmp('gridAcciones').enable();
                    Ext.getCmp('fieldsetformPanel').setTitle(perfil.etiquetas.titleFieldsetRecurso);

                    Ext.getCmp('btnEliminar').enable();
                    Ext.getCmp('btnAdicionar').disable();

                    Ext.getCmp('addCategoria').hide();
                    Ext.getCmp('addSubsistema').hide();
                    Ext.getCmp('addFuncionalidad').hide();
                    Ext.getCmp('addRecurso').hide();

                    Ext.getCmp('addCategoria').disable();
                    Ext.getCmp('addSubsistema').disable();
                    Ext.getCmp('addFuncionalidad').disable();
                    Ext.getCmp('addRecurso').disable();

                    Ext.getCmp('btnImportar').disable();
                    Ext.getCmp('btnExportar').disable();

                    Ext.getCmp('panelGrid').enable();
                    Ext.getCmp('addAccion').disable();
                    Ext.getCmp('deleteAccion').disable();

                    if(recordNodoSelect.raw.heredado){
                         var externoRec = recordNodoSelect.raw.externo;
                    }
                    else{
                        var externoRec = recordNodoSelect.raw.externo ? recordNodoSelect.raw.externo : recordNodoSelect.parentNode.raw.externa;
                    }

                    Ext.getCmp('gridAcciones').getStore().loadPage(1,{
                        params:{
                            idfuncionalidad: recordNodoSelect.raw.idfuncionalidad,
                            idrecurso: recordNodoSelect.raw.idrecurso,
                            externa:  externoRec,
                            referencia: recordNodoSelect.parentNode.raw.referencia,
                            start:0,
                            limit:20
                        }
                    });

                    Ext.getCmp('gridAcciones').columns[2].show();

                    if(recordNodoSelect.raw.heredado){
                        if(recordNodoSelect.raw.externo){
                            var externo = true;
                            Ext.getCmp('externo').show();
                        }
                        else{
                            var externo = false;
                            Ext.getCmp('externo').hide();
                        }
                    }
                    else{
                        if(record.parentNode.raw.externa){
                            var externo = true;
                            Ext.getCmp('externo').show();

                        }
                        else{
                            var externo = false;
                            Ext.getCmp('externo').hide();
                        }
                    }



                    Ext.getCmp('descripcion').nextTab = 'abreviatura';
                    Ext.getCmp('abreviatura').nextTab = 'denominacion';
                    Ext.getCmp('abreviatura').prevTab = 'descripcion';
                    Ext.getCmp('denominacion').prevTab = 'abreviatura';

                    Ext.getCmp('visibilidad').hide();
                    Ext.getCmp('refebuton').hide();
                    Ext.getCmp('referencia').disable();


                    var recordModel = Ext.create('Conf.model.Subsistema', {
                        'denominacion' :  record.raw.text,
                        'icono': record.raw.icono,
                        'icon': record.raw.icono,
                        'abreviatura': record.raw.abreviatura,
                        'descripcion': record.raw.descripcion,
                        //'referencia': record.raw.referencia,
                        //'visibilidad': record.raw.visibilidad,
                        'externo': externo
                    });

                    Ext.getCmp('externo').setReadOnly(true);


                    if (Ext.getCmp('abreviatura').labelEl) {
                        Ext.getCmp('abreviatura').labelEl.dom.innerHTML = perfil.etiquetas.fieldLabelReferencia;//'Referencia';
                    }
                    else {
                        Ext.getCmp('abreviatura').fieldLabel = perfil.etiquetas.fieldLabelReferencia;//'Referencia';
                    }

                }
                else{ //funcionalidad
                    modificarSub = false;
                    modificarFunc = true;
                    modificarRec = false;

                    Ext.getCmp('fieldsetformPanel').setTitle(perfil.etiquetas.titleFieldsetFuncionalidad);

                    var recordModel = Ext.create('Conf.model.Subsistema', {
                        'denominacion' :  record.raw.text,
                        'icono': record.raw.icono,
                        'icon': record.raw.icono,
                        'abreviatura': record.raw.abreviatura,
                        'descripcion': record.raw.descripcion,
                        'referencia': record.raw.referencia,
                        'visibilidad': record.raw.visibilidad,
                        'externo': record.raw.externa
                    });

                    Ext.getCmp('btnEliminar').enable();

                    Ext.getCmp('btnAdicionar').enable();
                    Ext.getCmp('addCategoria').hide();
                    Ext.getCmp('addSubsistema').hide();
                    Ext.getCmp('addFuncionalidad').hide();
                    Ext.getCmp('addRecurso').show();

                    Ext.getCmp('addCategoria').disable();
                    Ext.getCmp('addSubsistema').disable();
                    Ext.getCmp('addFuncionalidad').disable();
                    Ext.getCmp('addRecurso').enable();

                    Ext.getCmp('btnImportar').disable();
                    Ext.getCmp('btnExportar').disable();

                    Ext.getCmp('gridAcciones').getStore().loadPage(1,{
                        params:{
                            idfuncionalidad: recordNodoSelect.raw.idfuncionalidad,
                            idrecurso: recordNodoSelect.raw.idrecurso,
                            externa:   recordNodoSelect.raw.externa,
                            referencia: recordNodoSelect.raw.referencia,
                            start:0,
                            limit:20
                        }
                    });

                    Ext.getCmp('deleteAccion').disable();

                    if(record.raw.externa){
                        Ext.getCmp('addAccion').enable();
                        Ext.getCmp('gridAcciones').columns[2].hide();
                        Ext.getCmp('externo').show();
                    }
                    else{ //funcionalidad interna
                        Ext.getCmp('addAccion').disable();
                        Ext.getCmp('gridAcciones').columns[2].show();
                        Ext.getCmp('externo').hide();
                    }
                    Ext.getCmp('panelGrid').enable();

                    Ext.getCmp('referencia').enable();
                    Ext.getCmp('refebuton').show();
                    Ext.getCmp('visibilidad').show();                 


                    if(Ext.getCmp('referencia').labelEl){
                        Ext.getCmp('referencia').labelEl.dom.innerHTML = perfil.etiquetas.fieldLabelReferencia;//'Referencia';
                    }
                    Ext.getCmp('referencia').columnWidth = 0.9;
                    Ext.getCmp('btnBuscarReferencia').columnWidth = 0.1;
                    Ext.getCmp('btnBuscarReferencia').show();
                    Ext.getCmp('referencia').allowBlank = false;

                    Ext.getCmp('externo').setReadOnly(true);

                    if (Ext.getCmp('abreviatura').labelEl) {
                        Ext.getCmp('abreviatura').labelEl.dom.innerHTML = perfil.etiquetas.fieldLabelAbreviatura;//'Abreviatura'
                    }
                    else {
                        Ext.getCmp('abreviatura').fieldLabel = perfil.etiquetas.fieldLabelAbreviatura;//'Abreviatura'
                    }

                    Ext.getCmp('descripcion').nextTab = 'visibilidad';
                    Ext.getCmp('abreviatura').nextTab = 'referencia';
                    Ext.getCmp('abreviatura').prevTab = 'visibilidad';
                    Ext.getCmp('visibilidad').prevTab = 'descripcion';

                    Ext.getCmp('referencia').nextTab = 'btnBuscarReferencia';
                    Ext.getCmp('denominacion').prevTab = 'btnBuscarReferencia';
                }
            }
            else{ //sistema

                modificarSub = true;
                modificarFunc = false;
                modificarRec = false;

                Ext.getCmp('externo').show();
                Ext.getCmp('referencia').enable();
                Ext.getCmp('refebuton').show();
                Ext.getCmp('visibilidad').hide();


                Ext.getCmp('fieldsetformPanel').setTitle(perfil.etiquetas.titleFieldsetSubsistema);
                if(record.raw.servidorweb){
                    var recordModel = Ext.create('Conf.model.Subsistema', {
                        'denominacion' :  record.raw.text,
                        'icono': record.raw.icono,
                        'icon': record.raw.icono,
                        'abreviatura': record.raw.abreviatura,
                        'descripcion': record.raw.descripcion,
                        'referencia': record.raw.servidorweb,
                        'visibilidad': record.raw.visibilidad,
                        'externo': true
                    });

                    if(record.parentNode.isRoot()) {
                        Ext.getCmp('externo').setReadOnly(false);

                        Ext.getCmp('descripcion').nextTab = 'externo';
                        Ext.getCmp('externo').nextTab = 'abreviatura';
                        Ext.getCmp('abreviatura').prevTab = 'externo';
                        Ext.getCmp('abreviatura').nextTab = 'referencia';
                        Ext.getCmp('externo').prevTab = 'descripcion';

                    }
                    else{
                        if(record.parentNode.raw.servidorweb)
                            Ext.getCmp('externo').setReadOnly(true);
                        else
                            Ext.getCmp('externo').setReadOnly(false);

                        Ext.getCmp('descripcion').nextTab = 'abreviatura';
                        Ext.getCmp('abreviatura').prevTab = 'descripcion';
                        Ext.getCmp('abreviatura').nextTab = 'referencia';

                    }

                }
                else{
                    var recordModel = Ext.create('Conf.model.Subsistema', {
                        'denominacion' :  record.raw.text,
                        'icono': record.raw.icono,
                        'icon': record.raw.icono,
                        'abreviatura': record.raw.abreviatura,
                        'descripcion': record.raw.descripcion,
                        'referencia': record.raw.referencia,
                        'visibilidad': record.raw.visibilidad,
                        'externo': false
                    });
                    Ext.getCmp('externo').setReadOnly(false);

                    Ext.getCmp('descripcion').nextTab = 'externo';
                    Ext.getCmp('externo').nextTab = 'abreviatura';
                    Ext.getCmp('abreviatura').prevTab = 'externo';
                    Ext.getCmp('abreviatura').nextTab = 'referencia';
                    Ext.getCmp('externo').prevTab = 'descripcion';

                }

                Ext.getCmp('btnEliminar').enable();
                Ext.getCmp('btnAdicionar').enable();
                Ext.getCmp('addCategoria').hide();
                Ext.getCmp('addSubsistema').show();
                Ext.getCmp('addFuncionalidad').show();
                Ext.getCmp('addRecurso').hide();

                Ext.getCmp('addCategoria').disable();
                Ext.getCmp('addSubsistema').enable();
                Ext.getCmp('addFuncionalidad').enable();
                Ext.getCmp('addRecurso').disable();

                Ext.getCmp('btnImportar').enable();
                Ext.getCmp('btnExportar').enable();

                Ext.getCmp('panelGrid').disable();
                Ext.getCmp('addAccion').disable();
                Ext.getCmp('deleteAccion').disable();


                if (recordNodoSelect.raw.servidorweb ) {
                    if(modificarSub) {
                        if (Ext.getCmp('referencia').labelEl) {
                            Ext.getCmp('referencia').labelEl.dom.innerHTML = perfil.etiquetas.fieldLabelReferenciaExt;//'Referencia al servidor web';
                        }
                        else {
                            Ext.getCmp('referencia').fieldLabel = perfil.etiquetas.fieldLabelReferenciaExt;//'Referencia al servidor web';
                        }

                        Ext.getCmp('referencia').columnWidth = 1.0;
                        Ext.getCmp('btnBuscarReferencia').hide();

                        Ext.getCmp('referencia').nextTab = 'denominacion';
                        Ext.getCmp('denominacion').prevTab = 'referencia';
                    }
                }
                else {
                    if (Ext.getCmp('referencia').labelEl) {
                        Ext.getCmp('referencia').labelEl.dom.innerHTML = perfil.etiquetas.fieldLabelReferencia;//'Referencia';
                    }
                    else {
                        Ext.getCmp('referencia').fieldLabel = perfil.etiquetas.fieldLabelReferencia;//'Referencia';
                    }
                    Ext.getCmp('referencia').columnWidth = 0.9;
                    Ext.getCmp('btnBuscarReferencia').columnWidth = 0.1;
                    Ext.getCmp('btnBuscarReferencia').show();
                    Ext.getCmp('referencia').allowBlank = true;


                    Ext.getCmp('referencia').nextTab = 'btnBuscarReferencia';
                    Ext.getCmp('denominacion').prevTab = 'btnBuscarReferencia';
                }


                if (Ext.getCmp('abreviatura').labelEl) {
                    Ext.getCmp('abreviatura').labelEl.dom.innerHTML = perfil.etiquetas.fieldLabelAbreviatura;//'Abreviatura'
                }
                else {
                    Ext.getCmp('abreviatura').fieldLabel = perfil.etiquetas.fieldLabelAbreviatura;//'Abreviatura'
                }

            }

            Ext.getCmp('formularioPanel').loadRecord(recordModel);
            recordcombo = null;
            if(recordModel.data.icono)
                recordcombo = Ext.getCmp('icono').getStore().findRecord('icon',recordModel.data.icono);
            if(recordcombo)
                Ext.getCmp('icono').selectedIndex = recordcombo.index;
            else
                Ext.getCmp('icono').selectedIndex = null;

            Ext.getCmp('fieldsetformPanel').enable();
            Ext.getCmp('fieldsetformPanel').expand();         

        }
        else{//es la raiz

            Ext.getCmp('fieldsetformPanel').setTitle(perfil.etiquetas.titleFieldsetSubsistema);
            Ext.getCmp('formularioPanel').getForm().reset();
            Ext.getCmp('fieldsetformPanel').disable();
            Ext.getCmp('fieldsetformPanel').collapse();

            Ext.getCmp('panelGrid').disable();
            Ext.getCmp('addAccion').disable();
            Ext.getCmp('deleteAccion').disable();

            Ext.getCmp('btnAdicionar').enable();
            Ext.getCmp('addCategoria').hide();
            Ext.getCmp('addSubsistema').show();
            Ext.getCmp('addFuncionalidad').hide();
            Ext.getCmp('addRecurso').hide();

            Ext.getCmp('addCategoria').disable();
            Ext.getCmp('addSubsistema').enable();
            Ext.getCmp('addFuncionalidad').disable();
            Ext.getCmp('addRecurso').disable();

            Ext.getCmp('btnEliminar').disable();
            Ext.getCmp('btnImportar').enable();
            Ext.getCmp('btnExportar').disable();
          

        }
    },

    onItemcontextmenu: function(view,record, item, index, evento, eOpts){
        evento.stopEvent();
     
        Ext.getCmp('btnGuardar').disable();
        if(contextmenu!=null){
            contextmenu.destroy();
        }

        Ext.getCmp('treeDD').fireEvent('itemclick',record,record);
        Ext.getCmp('treeDD').getSelectionModel().select([record]);
        contextmenu = Ext.widget('contextMenu',{record: record});
        contextmenu.showAt(evento.getXY());
    },

    filtrarTree: function(){
        var tree = Ext.getCmp('treeDD');
        var caja = Ext.getCmp('cajaTextoDerechaArbol');
        if(Ext.getCmp('cajaTextoDerechaArbol').getValue()!='') {
            Ext.getCmp('btnBuscarTreeDerecho').enable();
            Ext.getCmp('btnLimpiarTreeDerecho').enable();
        }
        else
        {
            Ext.getCmp('btnBuscarTreeDerecho').disable();
            Ext.getCmp('btnLimpiarTreeDerecho').disable();
        }
        tree.buscarMenuIzquierdo(caja.value);
    },

    limpiarFiltroTree: function(){
        var tree = Ext.getCmp('treeDD');
        Ext.getCmp('cajaTextoDerechaArbol').reset();
        Ext.getCmp('btnBuscarTreeDerecho').disable();
        Ext.getCmp('btnLimpiarTreeDerecho').disable();
        tree.clearFilter();

    },

    insertarSubsistema: function(){

        Ext.getCmp('referencia').enable();
        Ext.getCmp('refebuton').show();
        Ext.getCmp('visibilidad').hide();
        Ext.getCmp('referencia').allowBlank = true;

        if (Ext.getCmp('abreviatura').labelEl) {
            Ext.getCmp('abreviatura').labelEl.dom.innerHTML = perfil.etiquetas.fieldLabelAbreviatura;//'Abreviatura'
        }
        else {
            Ext.getCmp('abreviatura').fieldLabel = perfil.etiquetas.fieldLabelAbreviatura;//'Abreviatura'
        }


        Ext.getCmp('formularioPanel').getForm().reset();
        Ext.getCmp('fieldsetformPanel').setTitle(perfil.etiquetas.titleInsertarSubsistema);
        Ext.getCmp('fieldsetformPanel').enable();
        Ext.getCmp('fieldsetformPanel').expand() ;

        insertarSub = true;
        insertarFunc = false;
        insertarRec = false;
        modificarSub = false;
        modificarFunc = false;
        modificarRec = false;

        if(!recordNodoSelect.isRoot()) {
            if (recordNodoSelect.raw.servidorweb) {
                Ext.getCmp('externo').setReadOnly(true);
                Ext.getCmp('externo').setValue(true);
                Ext.getCmp('referencia').setValue(Ext.getCmp('formularioPanel').getRecord().data.referencia);

                Ext.getCmp('descripcion').nextTab = 'abreviatura';
                Ext.getCmp('abreviatura').prevTab = 'descripcion';
                Ext.getCmp('abreviatura').nextTab = 'referencia';
                Ext.getCmp('referencia').nextTab = 'denominacion';
                Ext.getCmp('denominacion').prevTab = 'referencia';
            }
            else{
                Ext.getCmp('externo').setReadOnly(false);
                Ext.getCmp('externo').setValue(false);
                Ext.getCmp('referencia').reset();

                Ext.getCmp('descripcion').nextTab = 'externo';
                Ext.getCmp('externo').nextTab = 'abreviatura';
                Ext.getCmp('abreviatura').prevTab = 'externo';
                Ext.getCmp('abreviatura').nextTab = 'referencia';
                Ext.getCmp('externo').prevTab = 'descripcion';
                Ext.getCmp('referencia').nextTab = 'btnBuscarReferencia';
                Ext.getCmp('denominacion').prevTab = 'btnBuscarReferencia';
            }

        }
        else{
            Ext.getCmp('externo').show();
            Ext.getCmp('externo').setReadOnly(false);
            Ext.getCmp('externo').setValue(false);
            Ext.getCmp('referencia').reset();

            Ext.getCmp('descripcion').nextTab = 'externo';
            Ext.getCmp('externo').nextTab = 'abreviatura';
            Ext.getCmp('abreviatura').prevTab = 'externo';
            Ext.getCmp('abreviatura').nextTab = 'referencia';
            Ext.getCmp('externo').prevTab = 'descripcion';
            Ext.getCmp('referencia').nextTab = 'btnBuscarReferencia';
            Ext.getCmp('denominacion').prevTab = 'btnBuscarReferencia';
        }



    } ,

    insertarFuncionalidad: function(){

        Ext.getCmp('referencia').allowBlank = false;
        Ext.getCmp('visibilidad').show();
        Ext.getCmp('referencia').enable();
        Ext.getCmp('refebuton').show();
      

        Ext.getCmp('descripcion').nextTab = 'visibilidad';
        Ext.getCmp('visibilidad').nextTab = 'abreviatura';
        Ext.getCmp('abreviatura').prevTab = 'visibilidad';
        Ext.getCmp('visibilidad').prevTab = 'descripcion';

        Ext.getCmp('abreviatura').nextTab = 'referencia';
        Ext.getCmp('referencia').nextTab = 'btnBuscarReferencia';
        Ext.getCmp('denominacion').prevTab = 'btnBuscarReferencia';


        if (Ext.getCmp('abreviatura').labelEl) {
            Ext.getCmp('abreviatura').labelEl.dom.innerHTML = perfil.etiquetas.fieldLabelAbreviatura;//'Abreviatura'
        }
        else {
            Ext.getCmp('abreviatura').fieldLabel = perfil.etiquetas.fieldLabelAbreviatura;//'Abreviatura'
        }

        Ext.getCmp('formularioPanel').getForm().reset();
        Ext.getCmp('fieldsetformPanel').setTitle(perfil.etiquetas.titleInsertarFuncionalidad);

        Ext.getCmp('fieldsetformPanel').enable();
        Ext.getCmp('fieldsetformPanel').expand() ;

        insertarSub = false;
        insertarFunc = true;
        insertarRec = false;
        modificarSub = false;
        modificarFunc = false;
        modificarRec = false;

        if(!recordNodoSelect.isRoot()) {
            if (recordNodoSelect.raw.servidorweb) {
                Ext.getCmp('externo').show();
                Ext.getCmp('externo').setReadOnly(true);
                Ext.getCmp('externo').setValue(true);             
            }
            else{
                Ext.getCmp('externo').hide();
                Ext.getCmp('externo').setReadOnly(false);
                Ext.getCmp('externo').setValue(false);              
            }

        }
    },

    insertarRecurso: function(){
        var _this = this;
        var arrayAccionesChequeadas = _this.obtenerAccionesChequeadasGrid();
        if(arrayAccionesChequeadas.length == 0) {
            mostrarMensaje(6,perfil.etiquetas.msgErrorInsRec);         
            return;
        }
        Ext.getCmp('visibilidad').hide();
        Ext.getCmp('referencia').disable();
        Ext.getCmp('refebuton').hide();

        Ext.getCmp('descripcion').nextTab = 'abreviatura';
        Ext.getCmp('abreviatura').nextTab = 'denominacion';
        Ext.getCmp('abreviatura').prevTab = 'descripcion';
        Ext.getCmp('denominacion').prevTab = 'abreviatura';

        if (Ext.getCmp('abreviatura').labelEl) {
            Ext.getCmp('abreviatura').labelEl.dom.innerHTML = perfil.etiquetas.fieldLabelReferencia;//'Referencia';
        }
        else {
            Ext.getCmp('abreviatura').fieldLabel = perfil.etiquetas.fieldLabelReferencia;//'Referencia';
        }

        Ext.getCmp('formularioPanel').getForm().reset();
        Ext.getCmp('fieldsetformPanel').setTitle(perfil.etiquetas.titleInsertarRecurso);

        Ext.getCmp('fieldsetformPanel').enable();
        Ext.getCmp('fieldsetformPanel').expand() ;


        Ext.getCmp('addAccion').disable();
        Ext.getCmp('deleteAccion').disable();


        insertarSub = false;
        insertarFunc = false;
        insertarRec = true;
        modificarSub = false;
        modificarFunc = false;
        modificarRec = false;

        if (recordNodoSelect.raw.externa) {
            Ext.getCmp('externo').show();
            Ext.getCmp('externo').setReadOnly(true);
            Ext.getCmp('externo').setValue(true);
            Ext.getCmp('gridAcciones').columns[2].show();
            
        }
        else{
            Ext.getCmp('gridAcciones').getStore().removeAll();
            Ext.getCmp('gridAcciones').getStore().loadPage(1,{
                params:{
                    idfuncionalidad: recordNodoSelect.raw.idfuncionalidad,
                    idrecurso: recordNodoSelect.raw.idrecurso,
                    externa: recordNodoSelect.raw.externa,
                    insertarRec: true,
                    referencia: recordNodoSelect.raw.referencia,
                    start:0,
                    limit:20
                }
            });
            Ext.getCmp('externo').hide();
            Ext.getCmp('externo').setReadOnly(true);
            Ext.getCmp('externo').setValue(false);
            Ext.getCmp('gridAcciones').columns[2].show();           
        }

    },

    importarsubsistema: function(){
        var winImpSist = Ext.widget('ventanaImportarSistema');
        winImpSist.formularioImpSist.getForm().reset();
        winImpSist.show();
        winImpSist.center();
    },

    importarSistema: function(button){
        var _this = this;
        if(Ext.getCmp('formularioImpSist').getForm().isValid()){
            if(recordNodoSelect.raw){
                var idsistema = recordNodoSelect.raw.idsistema;
            }
            else{
                var idsistema = recordNodoSelect.data.id;
            }

            Ext.getCmp('formularioImpSist').getForm().submit({
                url: 'importarXML',
                timeout:360000,
                params:{
                    idsistema: idsistema
                },
                waitTitle: perfil.etiquetas.waitTitle, //"Por favor espere...",
                waitMsg: perfil.etiquetas.waitMsgImpSub,//'Importando sistema',

                success: function(form, action) {
                    if (action.result.codMsg == 1) {
                        mostrarMensaje(7,action.result.mensaje);                 
                        button.up('window').close();
                        _this.recargarNodo();
                    }
                },
                failure: function(form, action) {
                    button.up('window').close();
                    mostrarMensaje(6,action.result.mensaje);                    
                }
            });
        }
    },

    renderVentanaImportarSistema: function(win){
        this.keyMap.pressAltX(this, win);
        this.keyMap.pressEnter(this, win);
    },

    exportarsubsistema: function(){
        document.getElementById('idsistema').value = recordNodoSelect.raw.idsistema;
        var formularioexportar = document.getElementById('exportarsistemas');
        formularioexportar.action = 'exportarsistema';
        formularioexportar.submit();
    },

    eliminarcomponente: function(){
        var _this = this;
        if (!recordNodoSelect.isRoot()) {

            Ext.getCmp('treeDD').keyMap.insertarSubsistema.setDisabled(true);
            Ext.getCmp('treeDD').keyMap.insertarFuncionalidad.setDisabled(true);
            Ext.getCmp('treeDD').keyMap.insertarRecurso.setDisabled(true);
            Ext.getCmp('treeDD').keyMap.Importar.setDisabled(true);
            Ext.getCmp('treeDD').keyMap.Exportar.setDisabled(true);

            switch(recordNodoSelect.raw.type) {
                case 'sistema':
                {
                    _this.eliminarSistema();//ya
                }
                    break;
                case 'funcionalidad':
                {
                    _this.eliminarFuncionalidad();
                }
                    break;
                case 'recurso':
                {
                    _this.eliminarRecurso();
                }
                    break;
            }
        }
    },

    eliminarSistema: function(){
        var _this = this;
        mostrarMensaje(2, perfil.etiquetas.confirmPreg, eliminasist);
        //Msg.util.MostrarMsg(4,perfil.etiquetas.confirmacion,perfil.etiquetas.confirmPreg,eliminasist,this);
        function eliminasist(btn) {
            if(btn == 'YES') {
                Ext.Ajax.request({
                    url: 'eliminarsistema',
                    method: 'POST',
                    params: {
                        idsistema: recordNodoSelect.raw.idsistema
                    },
                    waitTitle: perfil.etiquetas.waitTitle,//"Por favor espere...",
                    waitMsg: perfil.etiquetas.waitMsgElimSub,//'Eliminando datos del sistema',
                    callback: function (options, success, response) {
                        Ext.getCmp('treeDD').keyMap.insertarSubsistema.setDisabled(false);
                        Ext.getCmp('treeDD').keyMap.insertarFuncionalidad.setDisabled(false);
                        Ext.getCmp('treeDD').keyMap.insertarRecurso.setDisabled(false);
                        Ext.getCmp('treeDD').keyMap.Importar.setDisabled(false);
                        Ext.getCmp('treeDD').keyMap.Exportar.setDisabled(false);

                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsg == 1) {
                            mostrarMensaje(7, responseData.mensaje);
                            recordNodoSelect = recordNodoSelect.parentNode;
                            _this.recargarNodo();
                            Ext.getCmp('treeDD').getSelectionModel().select([recordNodoSelect]);
                        }
                        else
                            mostrarMensaje(6, responseData.mensaje);
                    }
                });
            }
        };
    },

    eliminarFuncionalidad: function(){
        var _this = this;
        mostrarMensaje(2, perfil.etiquetas.confirmPreg1,eliminafunc);
        //Msg.util.MostrarMsg(4,perfil.etiquetas.confirmacion,perfil.etiquetas.confirmPreg1,eliminafunc,this);
        function eliminafunc(btn) {
            if(btn == "YES") {
                Ext.Ajax.request({
                    url: 'eliminarfuncionalidad',
                    method: 'POST',
                    params: {
                        idfuncionalidad: recordNodoSelect.raw.idfuncionalidad
                    },
                    waitTitle: perfil.etiquetas.waitTitle,//"Por favor espere...",
                    waitMsg: perfil.etiquetas.waitMsgElimFunc,//'Eliminando datos de la funcionalidad',
                    callback: function (options, success, response) {
                        Ext.getCmp('treeDD').keyMap.insertarSubsistema.setDisabled(false);
                        Ext.getCmp('treeDD').keyMap.insertarFuncionalidad.setDisabled(false);
                        Ext.getCmp('treeDD').keyMap.insertarRecurso.setDisabled(false);
                        Ext.getCmp('treeDD').keyMap.Importar.setDisabled(false);
                        Ext.getCmp('treeDD').keyMap.Exportar.setDisabled(false);

                        responseData = Ext.decode(response.responseText);
                        if (responseData.codMsg == 1) {

                            mostrarMensaje(7, responseData.mensaje);
                            recordNodoSelect = recordNodoSelect.parentNode;
                            _this.recargarNodo();
                            Ext.getCmp('treeDD').getSelectionModel().select([recordNodoSelect]);
                        }
                        else if (responseData.codMsg == 3 || responseData.codMsg == 4 || responseData.codMsg == 6) {
                            mostrarMensaje(6, responseData.mensaje);
                        }
                    }
                });
            }
        };
    },

    eliminarRecurso: function () {
        var _this = this;
        mostrarMensaje(2, perfil.etiquetas.confirmPreg2, _this.eliminarec.bind(_this, _this));
        //Msg.util.MostrarMsg(4, perfil.etiquetas.confirmacion, perfil.etiquetas.confirmPreg2, _this.eliminarec, this);

    },

    eliminarec: function (t, btn) {
        if(btn == 'YES') {
            var arrayRecursosElim = [];
            arrayRecursosElim.push(recordNodoSelect.raw.idrecurso, recordNodoSelect.raw.heredado);
            Ext.Ajax.request({
                url: 'eliminarRecursos',
                method: 'POST',
                params: {
                    arrayRecursosElim: Ext.encode(arrayRecursosElim),
                    idfuncionalidad: recordNodoSelect.parentNode.raw.idfuncionalidad
                },
                waitTitle: perfil.etiquetas.waitTitle,//"Por favor espere...",
                waitMsg: perfil.etiquetas.waitMsgElimRec,//'Eliminando datos del recurso',
                callback: function (options, success, response) {
                    Ext.getCmp('treeDD').keyMap.insertarSubsistema.setDisabled(false);
                    Ext.getCmp('treeDD').keyMap.insertarFuncionalidad.setDisabled(false);
                    Ext.getCmp('treeDD').keyMap.insertarRecurso.setDisabled(false);
                    Ext.getCmp('treeDD').keyMap.Importar.setDisabled(false);
                    Ext.getCmp('treeDD').keyMap.Exportar.setDisabled(false);

                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsg == 1) {
                        mostrarMensaje(7, responseData.mensaje);
                        recordNodoSelect = recordNodoSelect.parentNode;
                        t.recargarNodo();
                        Ext.getCmp('treeDD').getSelectionModel().select([recordNodoSelect]);
                    }
                    else if (responseData.codMsg == 3) {
                        mostrarMensaje(7, responseData.mensaje);
                    }
                }
            });
        }
    },

    recargarNodo: function () {
        Ext.getCmp('icono').getStore().clearFilter();

        var store = Ext.getCmp('treeDD').getStore();
        if (!recordNodoSelect.isRoot()) {
            if (recordNodoSelect.isExpanded()) {
                recordNodoSelect.removeAll();
                store.load({node: recordNodoSelect});
            }
            else {
                recordNodoSelect.expand();
            }
        }
        else {
            recordNodoSelect.removeAll();
            store.load();
        }

    },

    habilitarGuardar: function(obj){       
        if(this.cambiosFormulario())
        Ext.getCmp('btnGuardar').enable();
        else
            Ext.getCmp('btnGuardar').disable();
    },

    resetearReferencia: function(){    
        if(!recordNodoSelect.isRoot()){           
            if (recordNodoSelect.raw.idsistema) {
                Ext.getCmp('refebuton').show();
                if (Ext.getCmp('formularioPanel').getRecord().data.externo != Ext.getCmp('externo').checked) {
                    if (recordNodoSelect.raw.servidorweb) {
                        if (Ext.getCmp('referencia').labelEl) {
                            Ext.getCmp('referencia').labelEl.dom.innerHTML = perfil.etiquetas.fieldLabelReferencia;//'Referencia';
                        }
                        else {
                            Ext.getCmp('referencia').fieldLabel = perfil.etiquetas.fieldLabelReferencia;//'Referencia';
                        }
                        Ext.getCmp('referencia').columnWidth = 0.9;
                        Ext.getCmp('btnBuscarReferencia').columnWidth = 0.1;
                        Ext.getCmp('btnBuscarReferencia').show();

                        Ext.getCmp('referencia').nextTab = 'btnBuscarReferencia';
                        Ext.getCmp('denominacion').prevTab = 'btnBuscarReferencia';

                    }
                    else {
                        if (Ext.getCmp('referencia').labelEl) {
                            Ext.getCmp('referencia').labelEl.dom.innerHTML = perfil.etiquetas.fieldLabelReferenciaExt;//'Referencia al servidor web';
                        }
                        else {
                            Ext.getCmp('referencia').fieldLabel = perfil.etiquetas.fieldLabelReferenciaExt;//'Referencia al servidor web';
                        }

                        Ext.getCmp('referencia').columnWidth = 1.0;
                        Ext.getCmp('btnBuscarReferencia').hide();

                        Ext.getCmp('referencia').nextTab = 'denominacion';
                        Ext.getCmp('denominacion').prevTab = 'referencia';

                    }
                    Ext.getCmp('referencia').reset();
                }
                else {
                    if (recordNodoSelect.raw.servidorweb ) {
                        if(insertarSub || modificarSub) {
                            if (Ext.getCmp('referencia').labelEl) {
                                Ext.getCmp('referencia').labelEl.dom.innerHTML = perfil.etiquetas.fieldLabelReferenciaExt;//'Referencia al servidor web';
                            }
                            else {
                                Ext.getCmp('referencia').fieldLabel = perfil.etiquetas.fieldLabelReferenciaExt;//'Referencia al servidor web';
                            }

                            Ext.getCmp('referencia').columnWidth = 1.0;
                            Ext.getCmp('btnBuscarReferencia').hide();

                            Ext.getCmp('referencia').nextTab = 'denominacion';
                            Ext.getCmp('denominacion').prevTab = 'referencia';
                        }
                    }
                    else {
                        if (Ext.getCmp('referencia').labelEl) {
                            Ext.getCmp('referencia').labelEl.dom.innerHTML = perfil.etiquetas.fieldLabelReferencia;//'Referencia';
                        }
                        else {
                            Ext.getCmp('referencia').fieldLabel = perfil.etiquetas.fieldLabelReferencia;//'Referencia';
                        }
                        Ext.getCmp('referencia').columnWidth = 0.9;
                        Ext.getCmp('btnBuscarReferencia').columnWidth = 0.1;
                        Ext.getCmp('btnBuscarReferencia').show();

                        Ext.getCmp('referencia').nextTab = 'btnBuscarReferencia';
                        Ext.getCmp('denominacion').prevTab = 'btnBuscarReferencia';
                    }
                    if (insertarSub) {
                        Ext.getCmp('referencia').reset();
                    }
                    else if (modificarSub) {
                        Ext.getCmp('referencia').setValue(Ext.getCmp('formularioPanel').getRecord().data.referencia);
                    }

                }
            }
        }
        else{
            if(Ext.getCmp('externo').checked){
                if (Ext.getCmp('referencia').labelEl) {
                    Ext.getCmp('referencia').labelEl.dom.innerHTML = perfil.etiquetas.fieldLabelReferenciaExt;//'Referencia al servidor web';
                }
                else {
                    Ext.getCmp('referencia').fieldLabel = perfil.etiquetas.fieldLabelReferenciaExt;//'Referencia al servidor web';
                }

                Ext.getCmp('referencia').columnWidth = 1.0;
                Ext.getCmp('btnBuscarReferencia').hide();

                Ext.getCmp('referencia').nextTab = 'denominacion';
                Ext.getCmp('denominacion').prevTab = 'referencia';
            }
            else{
                if (Ext.getCmp('referencia').labelEl) {
                    Ext.getCmp('referencia').labelEl.dom.innerHTML = perfil.etiquetas.fieldLabelReferencia;//'Referencia';
                }
                else {
                    Ext.getCmp('referencia').fieldLabel = perfil.etiquetas.fieldLabelReferencia;//'Referencia';
                }
                Ext.getCmp('referencia').columnWidth = 0.9;
                Ext.getCmp('btnBuscarReferencia').columnWidth = 0.1;
                Ext.getCmp('btnBuscarReferencia').show();

                Ext.getCmp('referencia').nextTab = 'btnBuscarReferencia';
                Ext.getCmp('denominacion').prevTab = 'btnBuscarReferencia';
            }
        }

    },

    guardarcambios: function(){
      this.guardarcambiosFormulario();
    },
    cambiosFormulario:function(){
        var hubocambiosForm = false;
        if(Ext.getCmp('formularioPanel').getValues().denominacion)
        if(!recordNodoSelect.isRoot()) {

            //verificando si hubo cambios//
            if (Ext.getCmp('formularioPanel').getForm().isValid()) {
              
                if (Ext.getCmp('formularioPanel').getRecord().data.denominacion != Ext.getCmp('formularioPanel').getValues().denominacion) {                    
                    hubocambiosForm = true;
                }
                if (Ext.getCmp('formularioPanel').getRecord().data.icono != Ext.getCmp('icono').getValue() ) {                    
                    if(Ext.getCmp('icono').getValue())
                    {
                        hubocambiosForm = true;
                    }
                    else
                    if(Ext.getCmp('formularioPanel').getRecord().data.icono)
                    {
                        hubocambiosForm = true;
                    }

                }
                if (Ext.getCmp('formularioPanel').getRecord().data.abreviatura != Ext.getCmp('formularioPanel').getValues().abreviatura) {                

                    if(Ext.getCmp('formularioPanel').getValues().abreviatura)
                    {
                        hubocambiosForm = true;
                    }
                    else
                    if(Ext.getCmp('formularioPanel').getRecord().data.abreviatura)
                    {
                        hubocambiosForm = true;
                    }
                }
                if (Ext.getCmp('formularioPanel').getRecord().data.referencia != Ext.getCmp('formularioPanel').getValues().referencia)
                {

                    if(!modificarRec)
                    {
                    if(Ext.getCmp('formularioPanel').getRecord().data.referencia != "Seleccione la referencia"){
                        hubocambiosForm = true;
                    }
                    else
                    {
                        if(Ext.getCmp('formularioPanel').getValues().referencia!=""&&Ext.getCmp('formularioPanel').getValues().referencia!="Seleccione la referencia")
                        {
                            hubocambiosForm = true;
                        }
                    }
                    }
                }
                if (Ext.getCmp('formularioPanel').getRecord().data.descripcion != Ext.getCmp('formularioPanel').getValues().descripcion) {
                    
                    if(Ext.getCmp('formularioPanel').getValues().descripcion)
                    {
                        hubocambiosForm = true;
                    }
                    else
                    
                    if(Ext.getCmp('formularioPanel').getRecord().data.descripcion)
                    {
                        hubocambiosForm = true;
                    }

                }
                if (Ext.getCmp('formularioPanel').getRecord().data.visibilidad != Ext.getCmp('visibilidad').checked) {
                    
                    if(Ext.getCmp('visibilidad').checked)
                    {
                        hubocambiosForm = true;
                    }
                    else
                   
                    if(Ext.getCmp('formularioPanel').getRecord().data.visibilidad)
                    {
                        hubocambiosForm = true;
                    }
                    
                }
                if (Ext.getCmp('formularioPanel').getRecord().data.externo != Ext.getCmp('externo').checked) {
                 
                    if(Ext.getCmp('externo').checked)
                    {
                        hubocambiosForm = true;
                    }
                    else
                   
                    if(Ext.getCmp('formularioPanel').getRecord().data.externo)
                    {
                        hubocambiosForm = true;
                    }
                  
                }
            }
        }
        else
        {           
            if(Ext.getCmp('formularioPanel').getValues().denominacion)           
            {               
                hubocambiosForm=true;
            }
        }
        return hubocambiosForm;
    },
    guardarcambiosFormulario: function(){     
            if (Ext.getCmp('formularioPanel').getForm().isValid()) {
               
                if (insertarSub)//Insertando subsistema
                    this.addSubsistema();
                else if (insertarFunc)//Insertando funcionalidad
                    this.addFuncionalidad();
                else if (insertarRec)//Insertando recurso
                    this.addRecurso();
                else
                if (this.cambiosFormulario()) {
                    if (modificarSub) {
                        this.modSubsistema();
                    }
                    else if (modificarFunc) {
                        this.salvarDatosGrid();
                        this.modFuncionalidad();
                    }
                    else if (modificarRec) {
                        this.modRecurso();
                    }
                }
                else
                if (!this.cambiosFormulario() && modificarFunc) {
                    this.salvarDatosGrid();
                }
                else
                if (!this.cambiosFormulario() && modificarRec) {
                    this.modRecurso();
                }

            }
            else
                mostrarMensaje(6,perfil.etiquetas.errorformulario);      
    },

    addSubsistema: function(){
        var _this = this;
        var idsistema = 0;
        if(!recordNodoSelect.isRoot()){
            idsistema = recordNodoSelect.raw.idsistema;
        }

        Ext.getCmp('formularioPanel').getForm().submit({
            url: 'insertarsistema',
            params:{
                idpadre: idsistema
            },
            waitTitle: perfil.etiquetas.waitTitle,//"Por favor espere...",
            waitMsg: perfil.etiquetas.waitMsgAddSub,//'Guardando datos del sistema',

            success: function(form, action) {
                Ext.getCmp('btnGuardar').disable();
                if (action.result.codMsg == 1) {
                    mostrarMensaje(7, action.result.mensaje);
                    _this.recargarNodo();
                }
            },
            failure: function(form, action) {
                mostrarMensaje(6, action.result.mensaje);
            }
        });
    },

    addFuncionalidad: function(){
        var _this = this;
        Ext.getCmp('formularioPanel').getForm().submit({
            url: 'insertarfuncionalidad',
            params:{
                idsistema: recordNodoSelect.raw.idsistema,
                index: recordNodoSelect.getDepth()
            },

            waitTitle: perfil.etiquetas.waitTitle,//"Por favor espere...",
            waitMsg: perfil.etiquetas.waitMsgAddFunc,//'Guardando datos de la funcionalidad',

            success: function(form, action) {
                Ext.getCmp('btnGuardar').disable();
                if (action.result.codMsg == 1) {                   
                    mostrarMensaje(7, action.result.mensaje);
                    _this.recargarNodo();
                }
            },
            failure: function(form, action) {              
                mostrarMensaje(6, action.result.mensaje);
            }
        });

    },

    addRecurso: function(){
        var _this = this;
        var arrayAccChequeadas = _this.obtenerAccionesChequeadasGrid();
        var arrayIdaction = [];
        if(arrayAccChequeadas.length == 0) {          
            mostrarMensaje(6, perfil.etiquetas.msgErrorAddRec);
            return;
        }
       
        Ext.getCmp('formularioPanel').getForm().submit({
            url: 'insertarRecursos',
            params:{
                arrayAccionesChecked:Ext.encode(arrayAccChequeadas),
                idfuncionalidad:recordNodoSelect.raw.idfuncionalidad
            },

            waitTitle: perfil.etiquetas.waitTitle,//"Por favor espere...",
            waitMsg: perfil.etiquetas.waitMsgAddRec,//'Guardando datos del recurso',

            success: function(form, action) {
                Ext.getCmp('btnGuardar').disable();
                if (action.result.codMsg == 1) {
                   
                    mostrarMensaje(7, action.result.mensaje);
                    _this.recargarNodo();
                }
            },
            failure: function(form, action) {
                mostrarMensaje(6, action.result.mensaje);
                
            }
        });

    },

    modSubsistema: function(){
        var _this = this;
        var idpadre = 0;
        if(!recordNodoSelect.parentNode.isRoot()){
            idpadre = recordNodoSelect.raw.idpadre;
        }
        Ext.getCmp('formularioPanel').getForm().submit({
            url: 'modificarsistema',            
            params:{
                idsistema: recordNodoSelect.raw.idsistema,
                idpadre: idpadre
            },
            waitTitle: perfil.etiquetas.waitTitle,//"Por favor espere...",
            waitMsg: perfil.etiquetas.waitMsgAddSub,//'Guardando datos del sistema',

            success: function(form, action) {
                Ext.getCmp('btnGuardar').disable();
                if (action.result.codMsg == 1) {
                    recordNodoSelect = recordNodoSelect.parentNode;
                   
                    mostrarMensaje(7, action.result.mensaje);
                    _this.recargarNodo();
                }
            },
            failure: function(form, action) {                
                mostrarMensaje(6, action.result.mensaje);
            }
        });


    },

    modFuncionalidad: function(){
        var _this = this;
        Ext.getCmp('formularioPanel').getForm().submit({
            url: 'modificarfuncionalidad',
            params: {
                idfuncionalidad: recordNodoSelect.raw.idfuncionalidad,
                idsistema: recordNodoSelect.parentNode.raw.idsistema
            },

            waitTitle: perfil.etiquetas.waitTitle,//"Por favor espere...",
            waitMsg: perfil.etiquetas.waitMsgAddFunc,//'Guardando datos de la funcionalidad',

            success: function(form, action) {
                Ext.getCmp('btnGuardar').disable();
                if (action.result.codMsg == 1) {                    
                    mostrarMensaje(7, action.result.mensaje);
                    recordNodoSelect = recordNodoSelect.parentNode;
                    _this.recargarNodo();
                }
            },
            failure: function(form, action) {             
                mostrarMensaje(6, action.result.mensaje);          
            }
        });

    },

    modRecurso: function(){
       
        var _this = this;
        var arrayAccChequeadas = _this.obtenerAccionesChequeadasGrid();
        var arrayAccionesDesche = _this.obtenerAccionesDesqueadasGrid();
        var arrayAccionesDeschecked = [];
        var arrayActionchecked = [];

        if(arrayAccionesDesche[0].idacciones.length > 0) {
            for (var i = 0; i < arrayAccionesDesche[0].idacciones.length; i++) {
                arrayAccionesDeschecked.push(arrayAccionesDesche[0].idacciones[i]);
            }
        }
        if(arrayAccChequeadas.length == 0) {
            mostrarMensaje(2, perfil.etiquetas.msgAdvertencia, _this.eliminarec.bind(_this, _this));
            //Msg.util.MostrarMsg(4,perfil.etiquetas.advertencia, perfil.etiquetas.msgAdvertencia, _this.eliminarec,this);
            return;
        }
        for (var i = 0; i < arrayAccChequeadas.length; i++) {
            arrayActionchecked.push(arrayAccChequeadas[i].idaccion);
        }

       
        Ext.getCmp('formularioPanel').getForm().submit({
            timeout: '180',
            url: 'validarRecurso',
            params:{
                arrayAccionesChecked:Ext.encode(arrayActionchecked),//aqui son las acciones chequeadas
                idfuncionalidad: recordNodoSelect.raw.idfuncionalidad,
                idrecurso: recordNodoSelect.raw.idrecurso,
                arrayAccionesElim:Ext.encode(arrayAccionesDeschecked)//aqui las acciones deschequeadas
            },

            waitTitle: perfil.etiquetas.waitTitle,//"Por favor espere...",
            waitMsg: perfil.etiquetas.waitMsgAddRec,//'Guardando datos del recurso',

            success: function(form, action) {
                Ext.getCmp('btnGuardar').disable();
                if (action.result.codMsg == 1) {
                  
                    mostrarMensaje(7, action.result.mensaje);
                    recordNodoSelect = recordNodoSelect.parentNode;
                    _this.recargarNodo();
                    Ext.getCmp('treeDD').getSelectionModel().select([recordNodoSelect]);
                }
            },
            failure: function(form, action) {
                if (action.result.codMsg == 2) {
                    mostrarMensaje(2, action.result.mensaje, _this.eliminarec);
                    //Msg.util.MostrarMsg(2, perfil.etiquetas.advertencia, action.result.mensaje, _this.eliminarec,this);
                }
                else{
                    mostrarMensaje(6, action.result.mensaje);                 
                }

            }
        });
    },

    insertarAccion: function(){
        var winAccion = Ext.widget('ventanaAddAccion');
        winAccion.formularioAction.getForm().reset();
        winAccion.show();
        winAccion.center();
    },

    eliminarAccion: function(button,event){
        var _this = this;
        _this.eliminarAction();
    },

    eliminarAction: function(arrayActionEliminar){
        var _this = this;
        var denominacionAccion = [];
        if(arrayActionEliminar) {
            if (arrayActionEliminar[0].denominacionAcciones.length > 0) {
                for (var i = 0; i < arrayActionEliminar[0].denominacionAcciones.length; i++) {
                    denominacionAccion.push(arrayActionEliminar[0].denominacionAcciones[i]);
                }
                mostrarMensaje(2, perfil.etiquetas.msgAdvertencia1, elimina);
                //Msg.util.MostrarMsg(4, perfil.etiquetas.advertencia, perfil.etiquetas.msgAdvertencia1, elimina, this);
            }
        }
        else {
            denominacionAccion.push(Ext.getCmp('gridAcciones').getSelectionModel().selected.items[0].data.denominacion);
            mostrarMensaje(2, perfil.etiquetas.confirmPreg3, elimina);
            //Msg.util.MostrarMsg(4, perfil.etiquetas.confirmacion, perfil.etiquetas.confirmPreg3, elimina, this);
        }

        function elimina(btn) {
            if (btn == "YES"){
                if (denominacionAccion.length == 1) {
                    var waitMsg = perfil.etiquetas.waitMsgElimAction;//"Eliminando la acción";
                }
                else {
                    var waitMsg = perfil.etiquetas.waitMsgElimAction1;//"Eliminando acciones desmarcadas";
                }
            Ext.Ajax.request({
                url: 'eliminarAccioneExterna',
                method: 'POST',
                params: {
                    denominacionAccion: Ext.encode(denominacionAccion),
                    idfuncionalidad: recordNodoSelect.data.idfuncionalidad
                },
                waitTitle: perfil.etiquetas.waitTitle,//"Por favor espere...",
                waitMsg: waitMsg,

                callback: function (options, success, response) {
                    responseData = Ext.decode(response.responseText);
                    if (responseData.codMsg == 1) {
                        mostrarMensaje(7, responseData.mensaje);
                        var sm = Ext.getCmp('gridAcciones').getSelectionModel();
                        if (denominacionAccion.length == 1) {
                            Ext.getCmp('gridAcciones').store.remove(sm.getSelection());

                        }
                        else {
                            for (var i = 0; i < arrayActionEliminar[0].records.length; i++) {
                                Ext.getCmp('gridAcciones').store.remove(arrayActionEliminar[0].records[i]);
                            }
                        }


                    }
                    else if (responseData.codMsg == 3) {
                        mostrarMensaje(6, responseData.mensaje);
                        var sm = Ext.getCmp('gridAcciones').getSelectionModel();
                        if (denominacionAccion.length > 1) {
                            if (responseData.denominaciones) {
                                for (var i = 0; i < arrayActionEliminar[0].records.length; i++) {
                                    var denomi = arrayActionEliminar[0].records[i].raw.denominacion;
                                    for (var j = 0; j < responseData.denominaciones.length; j++) {
                                        if (responseData.denominaciones[j] == denomi) {
                                            Ext.getCmp('gridAcciones').store.remove(arrayActionEliminar[0].records[i]);
                                        }
                                    }
                                }
                            }
                        }
                    }

                    if (Ext.getCmp('gridAcciones').store.getCount() > 0) {
                        sm.select(0);
                    }

                }
            });
            }
        }

    },

    selectionchange: function(view, records){
        Ext.getCmp('treeDD').keyMap.DeleteComp.setDisabled(false);
        Ext.getCmp('gridAcciones').keyMap.DeleteAction.setDisabled(false);
        if(!(insertarRec || modificarRec)){
            if(recordNodoSelect.raw.idfuncionalidad && recordNodoSelect.raw.externa)
                Ext.getCmp('deleteAccion').setDisabled(!records.length);
        }
    },

    beforeeditGrid: function(gridObj){
        Ext.getCmp('treeDD').keyMap.DeleteComp.setDisabled(true);
        Ext.getCmp('gridAcciones').keyMap.DeleteAction.setDisabled(true);
        if(modificarFunc) {
            if (!recordNodoSelect.raw.externa) {
                if (gridObj.column.dataIndex == 'denominacion')
                    gridObj.cancel = true;
            }
        }
        if(insertarRec || modificarRec){
            if(gridObj.column.dataIndex == 'denominacion' || gridObj.column.dataIndex == 'descripcion')
                gridObj.cancel = true;
        }
    },

    renderGrid: function(grid,eOpts){
        grid.getStore().on('beforeload', function(store,operation,eOpts){
            if(recordNodoSelect.raw.type == "recurso") {
                store.proxy.extraParams.idfuncionalidad = recordNodoSelect.raw.idfuncionalidad;
                store.proxy.extraParams.idrecurso = recordNodoSelect.raw.idrecurso;
                store.proxy.extraParams.externa = recordNodoSelect.parentNode.raw.externa;
                store.proxy.extraParams.referencia = recordNodoSelect.parentNode.raw.referencia;
            }
            else if(recordNodoSelect.raw.type == "funcionalidad"){
                store.proxy.extraParams.idfuncionalidad = recordNodoSelect.raw.idfuncionalidad;
                store.proxy.extraParams.idrecurso = recordNodoSelect.raw.idrecurso;
                store.proxy.extraParams.externa = recordNodoSelect.raw.externa;
                store.proxy.extraParams.referencia = recordNodoSelect.raw.referencia;
            }
        });

        grid.keyMap = Ext.widget('keymapController');
        grid.keyMap.pressAltIA(this);
        grid.keyMap.deleteAccion(this,grid);
        grid.keyMap.limpiarGrid(this);
        grid.keyMap.buscarGrid(this);
    },

    closeWin:function (button) {
       
        button.up('window').close();
        Ext.getCmp('referencia').setValue(this.referenciaAux);
    },

    renderVentanaAddAccion: function(win){
        this.keyMap.pressAltX(this, win);
        this.keyMap.pressEnter(this, win);
        Ext.getCmp('denominacionacc').focus(false, 200);
    },

    agregarAccion:function(button){

        if(Ext.getCmp('winAddAction').formularioAction.getForm().isValid()) {

            Ext.getCmp('winAddAction').formularioAction.getForm().submit({
                url: 'adicionarAccioneExterna',
                params: {
                    idfuncionalidad: recordNodoSelect.raw.idfuncionalidad
                },
                waitTitle: perfil.etiquetas.waitTitle,//"Por favor espere...",
                waitMsg: perfil.etiquetas.waitMsgInsAcc,//"Insertando la acción",

                success: function(form, action) {

                    if (action.result.codMsg == 1) {

                   
                        mostrarMensaje(7, action.result.mensaje);
                        //Create a model instance
                        var accion = Ext.create('Conf.model.ModelStoreGrid', {
                            denominacion: Ext.getCmp('winAddAction').formularioAction.getForm().getFields().items[0].rawValue,
                            descripcion: Ext.getCmp('winAddAction').formularioAction.getForm().getFields().items[1].rawValue,
                            checked: true,
                            idfuncionalidad: recordNodoSelect.raw.idfuncionalidad,
                            idaccion: action.result.idaccion
                        });
                        accion.raw = {
                            denominacion: Ext.getCmp('winAddAction').formularioAction.getForm().getFields().items[0].rawValue,
                            descripcion: Ext.getCmp('winAddAction').formularioAction.getForm().getFields().items[1].rawValue,
                            checked: true,
                            idfuncionalidad: recordNodoSelect.raw.idfuncionalidad,
                            idaccion: action.result.idaccion
                        };
                        Ext.getCmp('gridAcciones').store.insert(0, accion);
                        Ext.getCmp('gridAcciones').cellEditing.startEditByPosition({row: 0, column: 0});

                        if (button.getId() == "aplicar"){
                            button.up('window').formularioAction.getForm().reset();
                            Ext.getCmp('aplicar').disable();
                            Ext.getCmp('aceptar').disable();
                        }
                        else
                            button.up('window').close();

                    }
                },
                failure: function(form, action) {
                   
                    mostrarMensaje(6, action.result.mensaje);

                }
            });
        }
    },

    buscarReferencia: function(){
        var arbolReferencia = null;

        if(!recordNodoSelect.isRoot()) {
            if(modificarSub || modificarFunc || modificarRec) {

                switch(recordNodoSelect.raw.type) {
                    case 'sistema':
                    {
                        arbolReferencia = Ext.widget('arbolRefSist');
                    }
                        break;
                    case 'funcionalidad':
                    {
                        arbolReferencia = Ext.widget('arbolRefFunc');
                    }
                        break;
                    case 'recurso':
                    {
                        arbolReferencia = Ext.create('Ext.form.Panel', {
                            title: 'Simple Form',
                            bodyPadding: 5,                       
                            layout: 'anchor',
                            defaults: {
                                anchor: '100%'
                            },                         
                            defaultType: 'textfield',
                            items: [{
                                fieldLabel: 'First Name',
                                name: 'first',
                                allowBlank: false
                            },{
                                fieldLabel: 'Last Name',
                                name: 'last',
                                allowBlank: false
                            }]
                        });
                    }
                        break;
                }
            }
            else if(insertarSub || insertarFunc || insertarRec){
                if(insertarSub)
                    arbolReferencia = Ext.widget('arbolRefSist');
                else if(insertarFunc)
                    arbolReferencia = Ext.widget('arbolRefFunc');
                else if(insertarRec){
                    arbolReferencia = Ext.create('Ext.form.Panel', {
                        title: 'Simple Form',
                        bodyPadding: 5,                  
                        layout: 'anchor',
                        defaults: {
                            anchor: '100%'
                        },                      
                        defaultType: 'textfield',
                        items: [{
                            fieldLabel: 'First Name',
                            name: 'first',
                            allowBlank: false
                        },{
                            fieldLabel: 'Last Name',
                            name: 'last',
                            allowBlank: false
                        }]
                    });
                }
            }
        }
        else{
            arbolReferencia = Ext.widget('arbolRefSist');
        }
        var winReferecnia = Ext.widget('ventanaReferencia');
        winReferecnia.items.add(arbolReferencia);
        winReferecnia.show();
        winReferecnia.center();
    },

    onBeforeloadArboRefFunc: function (store, operation) {
        Ext.getCmp('arbolRefFun').fireEvent('itemclick',operation.node,operation.node);
        if (operation.node.raw.id){
            operation.params.id = operation.node.raw.id;
            operation.params.text = operation.node.raw.text;
            operation.params.type = operation.node.raw.type;
        }
    },

    onClickArboRefFunc : function (view, record, item) {

        if(record.raw) {
            if (record.raw.type == 'action') {

                this.referenciaAux = record.raw.referencia;
                Ext.getCmp('aceptar').enable();              
            } else {
                Ext.getCmp('aceptar').disable();
            }
        }else
        {
            Ext.getCmp('aceptar').disable();
        }
    },

    closeWinRef:function (button) {        
        button.up('window').close();

    },

    renderVentanaReferencia: function(win){
        this.keyMap.pressAltX(this, win);
        this.keyMap.pressEnter(this, win);
    },

    onClickContextMenu: function(menu, item, eventObject, object){
        var _this = this;       
        switch(item.action) {
            case 'insertarSubsistema':
            {
                _this.insertarSubsistema();
            }
                break;
            case 'insertarFuncionalidad':
            {
                _this.insertarFuncionalidad();
            }
                break;
            case 'insertarRecurso':
            {
                _this.insertarRecurso();
            }
                break;
            case 'eliminarcomponente':
            {
                _this.eliminarcomponente();
            }
                break;
        }

    },

    onBeforeloadArboRefSist: function (store, operation) {
        Ext.getCmp('arbolRefSist').fireEvent('itemclick',operation.node,operation.node);
    },

    onClickArboRefSist : function (view, record, item) {


        if(record.raw) {
            this.referenciaAux = record.raw.id;
            Ext.getCmp('aceptar').enable();
        }
        else {
            Ext.getCmp('aceptar').disable();
        }
    },

    obtenerAccionesChequeadasGrid: function () {
        var array = [];
        Ext.getCmp('gridAcciones').store.each(function () {
            this.commit();
            if (this.data.checked) {
                array.push({
                    idaccion: this.data.idaccion,
                    idfuncionalidad: this.data.idfuncionalidad,
                    denominacion: this.data.denominacion,
                    descripcion: this.data.descripcion
                });
            }
        });

        return array;
    },

    obtenerAccionesDesqueadasGrid: function () {
        var array = [];
        var arrayIdAction = [];
        var arrayDenominacion = [];
        var arrayRecords = [];
        Ext.getCmp('gridAcciones').store.each(function () {
            this.commit();
            if (!this.data.checked) {
                arrayIdAction.push(this.raw.idaccion);
                arrayDenominacion.push(this.raw.denominacion);
                arrayRecords.push(this);

            }
        });
        array.push({
            denominacionAcciones: arrayDenominacion,
            idacciones: arrayIdAction,
            records:arrayRecords
        });

        return array;
    },
    salvarDatosGrid: function(){

        var _this = this;

        var recordsModificados = Ext.getCmp('gridAcciones').getStore().getUpdatedRecords();
        var arrayRecordsModificadosChequeados = [];

        var arrayAccionesChequeadas = _this.obtenerAccionesChequeadasGrid();
        var arrayAccionesDesChequeadas = _this.obtenerAccionesDesqueadasGrid();

        for(var i = 0; i < recordsModificados.length; i++) {
            var huboCambiosEngrid = false;

            if(recordsModificados[i].data.checked){
                if(recordsModificados[i].data.denominacion != recordsModificados[i].raw.denominacion){
                    huboCambiosEngrid = true;
                }
                if(recordsModificados[i].data.descripcion != recordsModificados[i].raw.descripcion){
                    huboCambiosEngrid = true;
                }
            }

            if(huboCambiosEngrid){
                arrayRecordsModificadosChequeados.push({
                    idaccion: recordsModificados[i].data.idaccion,
                    idfuncionalidad: recordsModificados[i].data.idfuncionalidad,
                    denominacion: recordsModificados[i].data.denominacion,
                    descripcion: recordsModificados[i].data.descripcion
                });
            }

        }

        if(recordNodoSelect.raw.externa) {
            if(arrayAccionesDesChequeadas[0].idacciones.length > 0) {
                _this.eliminarAction(arrayAccionesDesChequeadas);
            }
            if(arrayRecordsModificadosChequeados.length > 0){
                _this.modificarAccion(arrayRecordsModificadosChequeados);
            }
        }
        else{
            if(arrayRecordsModificadosChequeados.length > 0 ) {
                _this.gestionarAccionesInternas(arrayAccionesDesChequeadas,arrayAccionesChequeadas);
            }
            else{                
                for (var i = 0; i < recordsModificados.length; i++) {
                    var huboCambiosEngrid = false;
                    if(recordsModificados[i].data.checked != recordsModificados[i].raw.checked){
                            huboCambiosEngrid = true;
                    }
                    if(huboCambiosEngrid){
                        _this.gestionarAccionesInternas(arrayAccionesDesChequeadas,arrayAccionesChequeadas);
                        return;
                    }

                }
            }
        }

    },

    modificarAccion: function(arrayRecordsModificadosChequeados){
        var _this = this;
        var myMask = new Ext.LoadMask(Ext.getBody(), {msg:"Guardando datos de las acciones modificadas..."});
        if(!this.cambiosFormulario())
            myMask.show();

        Ext.Ajax.request({
            url: 'modificarAccioneExterna',
            method: 'POST',
            params: {
                arrayAcciones: Ext.encode(arrayRecordsModificadosChequeados)
            },
            waitTitle: perfil.etiquetas.waitTitle,//"Por favor espere...",
            waitMsg: perfil.etiquetas.waitMsgModAcc,//"Guardando datos de las acciones modificadas",
            callback: function (options, success, response) {
                myMask.hide();
                if(success==true)
                {
                    Ext.getCmp('btnGuardar').disable();
                }
                responseData = Ext.decode(response.responseText);
                Ext.getCmp('gridAcciones').getStore().load({
                    params:{
                        idfuncionalidad: recordNodoSelect.raw.idfuncionalidad,
                        idrecurso: recordNodoSelect.raw.idrecurso,
                        externa:   recordNodoSelect.raw.externa,
                        referencia: recordNodoSelect.raw.referencia,
                        start:0,
                        limit:20
                    }
                });
                if (responseData.codMsg == 1) {                   
                    mostrarMensaje(7, responseData.mensaje);
                }
                else if(responseData.codMsg == 3){                 
                    mostrarMensaje(6, responseData.mensaje);
                }


            }
        });
    },

    gestionarAccionesInternas: function (arrayActionEliminar, arrayActionInsertar) {
       
        var myMask = new Ext.LoadMask(Ext.getBody(), {msg:"Guardando datos de las acciones modificadas..."});
        if(!this.cambiosFormulario())
            myMask.show();
        var _this = this;
        var denominacionAccionesEliminar = [];

        if (arrayActionEliminar) {
            if (arrayActionEliminar[0].denominacionAcciones.length > 0) {
                for (var i = 0; i < arrayActionEliminar[0].denominacionAcciones.length; i++) {
                    denominacionAccionesEliminar.push(arrayActionEliminar[0].denominacionAcciones[i]);
                }

            }
        }
        else {
            denominacionAccionesEliminar.push(Ext.getCmp('gridAcciones').getSelectionModel().selected.items[0].data.denominacion);

        }
        Ext.Ajax.request({
            url: 'insertaraccion',
            method: 'POST',
            params: {
                accionesChequeadas: Ext.encode(arrayActionInsertar),
                denominacionAccionesEliminar: Ext.encode(denominacionAccionesEliminar),
                idfuncionalidad: recordNodoSelect.data.idfuncionalidad
            },
            waitTitle: perfil.etiquetas.waitTitle,//"Por favor espere...",
            waitMsg: perfil.etiquetas.waitMsgModAccInt,//"Guardando cambios",
            callback: function (options, success, response) {
                myMask.hide();
             
                if(success==true)
                {
                    Ext.getCmp('btnGuardar').disable();
                }
                responseData = Ext.decode(response.responseText);
                if (responseData.codMsg == 1) {                   
                    mostrarMensaje(7, responseData.mensaje);
                }
                else if (responseData.codMsg == 3) {                  
                    mostrarMensaje(6, responseData.mensaje);
                }

                Ext.getCmp('gridAcciones').getStore().loadPage(1,{
                    params:{
                        idfuncionalidad: recordNodoSelect.raw.idfuncionalidad,
                        idrecurso: recordNodoSelect.raw.idrecurso,
                        externa:   recordNodoSelect.raw.externa,
                        referencia: recordNodoSelect.raw.referencia,
                        start:0,
                        limit:20
                    }
                });

            }
        });

    },
    buscarCajaAcciones:function(){

  
        if(Ext.getCmp('cajaTextoGrid').getValue()!="") {
            Ext.getCmp('btnBuscarGrid').enable();
            Ext.getCmp('btnLimpiarGrid').enable();
        }
        else
        {
            Ext.getCmp('btnBuscarGrid').disable();
            Ext.getCmp('btnLimpiarGrid').disable();
        }
     
    },

    buscarrAcciones: function () {
        Ext.getCmp('gridAcciones').getStore().proxy.extraParams.msg = perfil.etiquetas.noseencontrarondatossearch;
        if(recordNodoSelect.raw.type == "recurso") {
            Ext.getCmp('gridAcciones').getStore().loadPage(1, {
                params: {
                    denominacion: Ext.getCmp('cajaTextoGrid').getValue(),
                    idfuncionalidad: recordNodoSelect.raw.idfuncionalidad,
                    idrecurso: recordNodoSelect.raw.idrecurso,
                    externa: recordNodoSelect.raw.externo ? recordNodoSelect.raw.externo : recordNodoSelect.parentNode.raw.externa,
                    referencia: recordNodoSelect.parentNode.raw.referencia,
                    start: 0,
                    limit: 20
                }
            });
        }
        else if(recordNodoSelect.raw.type == "funcionalidad"){
            Ext.getCmp('gridAcciones').getStore().loadPage(1, {
                params: {
                    denominacion: Ext.getCmp('cajaTextoGrid').getValue(),
                    idfuncionalidad: recordNodoSelect.raw.idfuncionalidad,
                    idrecurso: recordNodoSelect.raw.idrecurso,
                    externa: recordNodoSelect.raw.externa,
                    referencia: recordNodoSelect.raw.referencia,
                    start: 0,
                    limit: 20
                }
            });
        }

    },

    limpiarCajaRecargargrid: function () {
        Ext.getCmp('cajaTextoGrid').reset();
        Ext.getCmp('btnBuscarGrid').disable();
        Ext.getCmp('btnLimpiarGrid').disable();

        if(recordNodoSelect.raw.type == "recurso") {
            Ext.getCmp('gridAcciones').getStore().loadPage(1, {
                params: {
                    idfuncionalidad: recordNodoSelect.raw.idfuncionalidad,
                    idrecurso: recordNodoSelect.raw.idrecurso,
                    externa: recordNodoSelect.raw.externo ? recordNodoSelect.raw.externo : recordNodoSelect.parentNode.raw.externa,
                    referencia: recordNodoSelect.parentNode.raw.referencia,
                    msg : perfil.etiquetas.noseencontrarondatos,
                    start: 0,
                    limit: 20
                }
            });
        }
        else if(recordNodoSelect.raw.type == "funcionalidad"){
            Ext.getCmp('gridAcciones').getStore().loadPage(1, {
                params: {
                    idfuncionalidad: recordNodoSelect.raw.idfuncionalidad,
                    idrecurso: recordNodoSelect.raw.idrecurso,
                    externa: recordNodoSelect.raw.externa,
                    referencia: recordNodoSelect.raw.referencia,
                    msg : perfil.etiquetas.noseencontrarondatos,
                    start: 0,
                    limit: 20
                }
            });
        }
    }






});
/**
 * Created by lily on 6/03/15.
 */

Ext.define('Conf.controller.KeyMap', {

    alias: 'widget.keymapController',

    init: function (){},


    pressAltIA: function(_this){

        if(typeof(this.insertarAccion) === "undefined"){
            this.insertarAccion = new Ext.KeyMap(Ext.getBody(), {
                key: Ext.EventObject.I,
                key: Ext.EventObject.A,
                alt: true,
                defaultEventAction:'stopEvent',
                fn: function () {
                    if(!Ext.getCmp('addAccion').disabled) {
                        _this.insertarAccion();
                    }
                },
                scope: _this
            });
        }
    },

    pressAltIS: function(_this){

        if(typeof(this.insertarSubsistema) === "undefined"){
            this.insertarSubsistema = new Ext.KeyMap(Ext.getBody(), {
                key: Ext.EventObject.I,
                key: Ext.EventObject.S,
                alt: true,
                  defaultEventAction:'stopEvent',
                fn: function () {
                    if(!Ext.getCmp('addSubsistema').disabled) {
                        _this.insertarSubsistema();
                    }
                },
                scope: _this
            });
        }
    },

    pressAltIF: function(_this){

        if(typeof(this.insertarFuncionalidad) === "undefined"){
            this.insertarFuncionalidad = new Ext.KeyMap(Ext.getBody(), {
                key: Ext.EventObject.I,
                key: Ext.EventObject.F,
                alt: true,
                defaultEventAction:'stopEvent',
                fn: function () {
                    if(!Ext.getCmp('addFuncionalidad').disabled) {
                        _this.insertarFuncionalidad();
                    }
                },
                scope: _this
            });
        }
    },

    pressAltIR: function(_this){

        if(typeof(this.insertarRecurso) === "undefined"){
            this.insertarRecurso = new Ext.KeyMap(Ext.getBody(), {
                key: Ext.EventObject.I,
                key: Ext.EventObject.R,
                alt: true,
                defaultEventAction:'stopEvent',
                fn: function () {
                    if(!Ext.getCmp('addRecurso').disabled) {
                        _this.insertarRecurso();
                    }
                },
                scope: _this
            });
        }
    },

    pressAltG: function(_this){

        if(typeof(this.Guardar) === "undefined"){
            this.Guardar = new Ext.KeyMap(Ext.getBody(), {
                key: Ext.EventObject.G,
                alt: true,
                defaultEventAction:'stopEvent',
                fn: function () {
                    if(!Ext.getCmp('btnGuardar').disabled) {
                        _this.guardarcambiosFormulario();
                    }
                },
                scope: _this
            });
        }
    },

    deleteComponente: function(_this,arbolPanel){

            if(typeof(this.DeleteComp) === "undefined"){
                this.DeleteComp = new Ext.KeyMap(Ext.getBody(), {
                    key: Ext.EventObject.DELETE,
                    shift: false,
                    ctrl: false,
                    defaultEventAction:'stopEvent',
                    fn: function () {
                        if(!Ext.getCmp('btnEliminar').disabled) {
                            _this.eliminarcomponente();
                        }
                    },
                    scope: arbolPanel
                });
            }

    },

    deleteAccion: function(_this,grid){

            if(typeof(this.DeleteAction) === "undefined"){
                this.DeleteAction = new Ext.KeyMap(Ext.getBody(), {
                    key: Ext.EventObject.D,
                    shift: true,
                    ctrl: false,
                    defaultEventAction:'stopEvent',
                    fn: function () {
                        if(!Ext.getCmp('deleteAccion').disabled) {
                            _this.eliminarAccion();
                        }
                    },
                    scope: grid
                });
            }

    },

    buscarTree: function(_this){

        if(typeof(this.BuscarTree) === "undefined"){
            this.BuscarTree = new Ext.KeyMap(Ext.getBody(), {
                key: Ext.EventObject.B,
                alt: true,
                defaultEventAction:'stopEvent',
                fn: function () {
                    if(!Ext.getCmp('btnBuscarTreeDerecho').disabled) {
                        _this.filtrarTree();
                    }
                },
                scope: _this
            });
        }
    },

    limpiarTree: function(_this){

        if(typeof(this.LimpiarTree) === "undefined"){
            this.LimpiarTree = new Ext.KeyMap(Ext.getBody(), {
                key: Ext.EventObject.L,
                alt: true,
                ctrl: false,
                defaultEventAction:'stopEvent',
                fn: function () {
                    if(!Ext.getCmp('btnLimpiarTreeDerecho').disabled) {
                        _this.limpiarFiltroTree();
                    }
                },
                scope: _this
            });
        }
    },

    buscarGrid: function(_this){
        if(typeof(this.BuscandoGrid) === "undefined"){
            this.BuscandoGrid = new Ext.KeyMap(Ext.getBody(), {
                key: Ext.EventObject.B,
                alt: true,
                //ctrl:true,
                defaultEventAction:'stopEvent',
                fn: function () {
                    if(!Ext.getCmp('btnBuscarGrid').disabled) {
                        _this.buscarrAcciones();
                    }
                },
                scope: _this
            });
        }
    },

    limpiarGrid: function(_this){

        if(typeof(this.LimpiarGrid) === "undefined"){
            this.LimpiarGrid = new Ext.KeyMap(Ext.getBody(), {
                //key: Ext.EventObject.G,
                key: Ext.EventObject.L,
                alt: true,
                ctrl:true,
                defaultEventAction:'stopEvent',
                fn: function () {
                    if(!Ext.getCmp('btnLimpiarGrid').disabled) {
                        _this.limpiarCajaRecargargrid();
                    }
                },
                scope: _this
            });
        }
    },

    importarSubsistema: function(_this){

        if(typeof(this.Importar) === "undefined"){
            this.Importar = new Ext.KeyMap(Ext.getBody(), {
                key: Ext.EventObject.I,
                alt: true,
                ctrl:true,
                defaultEventAction:'stopEvent',
                fn: function () {
                    if(!Ext.getCmp('btnImportar').disabled) {
                        _this.importarsubsistema();
                    }
                },
                scope: _this
            });
        }
    },

    exportarSubsistema: function(_this){

        if(typeof(this.Exportar) === "undefined"){
            this.Exportar = new Ext.KeyMap(Ext.getBody(), {
                key: Ext.EventObject.E,
                alt: true,
                defaultEventAction:'stopEvent',
                fn: function () {
                    if(!Ext.getCmp('btnExportar').disabled) {
                        _this.exportarsubsistema();
                    }
                },
                scope: _this
            });
        }
    },

    abrirReferencia: function(_this){

        if(typeof(this.Referencia) === "undefined"){
            this.Referencia = new Ext.KeyMap(Ext.getBody(), {
                key: Ext.EventObject.W,
                alt: true,
                defaultEventAction:'stopEvent',
                fn: function () {
                    if(!Ext.getCmp('btnBuscarReferencia').disabled) {
                        _this.buscarReferencia();
                    }
                },
                scope: _this
            });
        }
    },

    pressAltX: function(_this, win){

        this.close = new Ext.KeyMap(win.getEl(), {
            key: Ext.EventObject.X,
            alt: true,
            defaultEventAction:'stopEvent',
            fn: function () {
                win.close();
            },
            scope: _this
        });
    },

    pressEnter: function(_this, win){

        this.enter = new Ext.KeyMap(win.getEl(), {
            key: Ext.EventObject.ENTER,
            //  defaultEventAction:'stopEvent',
            fn: function () {
                switch (win.getId()) {
                    case 'winReferencia':
                        if(!Ext.getCmp('aceptar').isDisabled()){
                            win.close();
                        }
                        break;
                    case 'winAddAction':
                        if(!Ext.getCmp('aceptar').isDisabled()){
                           _this.agregarAccion(Ext.getCmp('aceptar'));
                        }
                        break;
                    case 'winImpSist':
                        if(!Ext.getCmp('aceptar').isDisabled()){
                            _this.importarSistema(Ext.getCmp('aceptar'));
                        }
                        break;
                }

            },
            scope: _this
        });
    }



});
/**
 * Created by lilianne on 23/01/15.
 */
/**
 * Override para resolver los bugs con los scroll en los grids. *
 */
Ext.grid.Panel.override({
    initComponent: function () {
        var me = this;

        me.callParent();

        me.on('scrollershow', function (scroller) {
            if (scroller && scroller.scrollEl) {
                scroller.clearManagedListeners();
                scroller.mon(scroller.scrollEl, 'scroll', scroller.onElScroll, scroller);
            }
        });
    }
});

Zeolides.App({
    modulo: 'gestsist',

    name: 'Conf',

    appFolder: 'app',

    controllers: [
        'Gestsist'
    ],


    launch: function() {

        //Conf.idioma = Ext.widget('idioma_es').idioma;

        Ext.create('Ext.container.Viewport', {
            layout: 'border',
            items: [
                {
                    xtype: 'principal'
                }
            ]
        });
    }
});
