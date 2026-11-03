/**
 * Panel para la gestion de la configuracion del componente Curva de conflicto
 * @copyright XETID Cuba
 * @author Ing. Frank David Corona Prendes
 * @version 1.0
 */
Planificacion.Integracion.ConfiguracionPanel = ExtExtend.Class({
    $extend: Ext.Panel,
    border: false,
    //constrain: true,
    initComponent: function() {
        var me = this;
        var idCmp = this.id;
        me.comps = ExtExtend.Components;

        me.controller = (me.controller) ? me.controller : new Planificacion.Integracion.CurvaconflictoController();
        me.etiquetas = me.controller._getLabel('Curvaconflicto');
        me.directorioImagenes = me.controller._getGlobals('dirImg');
        me.region = (me.region) ? me.region : 'west';
        //me.title = (me.title) ? me.title : me.etiquetas.titlePanelConfiguracion;

        me.validatorProyecto = new ExtExtend.FormValidator();
        me.validatorEscalaTiempo = new ExtExtend.FormValidator();

        me.idestudiocurvaconflicto = (me.idestudiocurvaconflicto) ? me.idestudiocurvaconflicto : null;

        me.btnPlantilla = new me.comps.buttons.btnExportar({
            tooltip: 'Cargar plantilla',
            text: 'Cargar plantilla',
            handler: function() {
                me.mostrarVentanaPlantilla();
            }
        });

        me.btnGuardarIntensidadconflicto = new me.comps.buttons.btnGuardar({
            tooltip: me.etiquetas.ttpguardar,
            disabled: true,
            handler: function() {
                me.controller.guardarIntensidadconflicto({
                    datosVariables: me.gpIntensidades.getChanges()
                });
            }
        });

        me.btnRecargarintensidadconflicto = new me.comps.buttons.btnActualizar({
            tooltip: me.etiquetas.ttpActualizar,
            handler: function() {
                me.stIntensidades.reload();
            }
        });

        me.recordIntensidades = Ext.data.Record.create([
            {name: 'idintensidadconflicto', type: 'int'},{name: 'idestudiocurvaconflicto', type: 'int'},
            {name: 'terminologia'},{name: 'descripcion'},{name: 'nivelintensidad'},{name: 'alerta'}
        ]);

        me.stIntensidades = new Ext.data.Store({
            url: Planificacion.Integracion.UrlModulo + "curvaconflicto/getintensidadconflicto",
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                root: 'data',
                id: 'idintensidadconflicto',
                totalProperty: 'cantidad_filas'
            }, me.recordIntensidades),
            listeners: {
                beforeload: function(th) {
                    th.baseParams = {
                        idestudiocurvaconflicto: me.idestudiocurvaconflicto
                    };
                },
                load: function(th) {
                    me.initValidatorIntensidadconflicto();
                    if (th.getCount() == 0) {
                        me.fireEvent('desabilitar');
                    }else{
                        me.fireEvent('habilitar');
                    }
                }
            }
        });

        me.smIntensidades = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        var columModelIntensidad = [];
        if(me.objproyecto.get('escala')){
            columModelIntensidad = [
                new Ext.grid.RowNumberer(),
                {header: me.etiquetas.headerTermonologia, width: 150, sortable: true, dataIndex: 'terminologia'},
                {header: 'Descripción', width: 200, sortable: true, id: 'terminologia' + idCmp, dataIndex: 'descripcion'},
                {header: me.etiquetas.headerNivelintensidad, width: 110, sortable: true, dataIndex: 'nivelintensidad', align: 'center', editor: new me.comps.fields.numberField({maskRe:/^[1-9][0-9]*$/,allowDecimals: false})}
            ];
        }else{
            columModelIntensidad = [
                new Ext.grid.RowNumberer(),
                {header: me.etiquetas.headerTermonologia, width: 150, sortable: true, dataIndex: 'terminologia', editor: new me.comps.fields.fieldDenom},
                {header: 'Descripción', width: 200, sortable: true, id: 'terminologia' + idCmp, dataIndex: 'descripcion', editor: new me.comps.fields.fieldDescripcion},
                {header: me.etiquetas.headerNivelintensidad, width: 110, sortable: true, dataIndex: 'nivelintensidad', align: 'center', editor: new me.comps.fields.numberField({maskRe:/^[1-9][0-9]*$/,allowDecimals: false})}
            ];
        }
        me.cmIntensidades = new Ext.grid.ColumnModel(columModelIntensidad);
        me.cmIntensidades.defaultSortable = true;

        me.gpIntensidades = new me.comps.containers.grids.rowEditorGrid({
            frame: true,
            title: (me.title) ? '<b>' + me.title + '</b>' :  '<b>' + me.etiquetas.fieldsetIntensidad + '</b>',
            store: me.stIntensidades,
            cm: me.cmIntensidades,
            sm: me.smIntensidades,
            stripeRows: true,
            addButtonTTip: me.etiquetas.ttpGip,
            delButtonTTip: me.etiquetas.ttpGip,
            clicksToEdit: 2,
            editable: true,
            delButtonMsg: '¿Está seguro que quiere eliminar la intensidad de conflicto seleccionada?',
            autoExpandColumn: 'terminologia' + idCmp,
            region: 'center',
            overCls: 'x-grid3-row-over',
            ctCls: 'x-grid3-row-selected',
            anchor: '100%',
            defaults: {autoScroll: true},
            loadMask: me.etiquetas.loadMaskGrid,
            plugins: [new me.comps.plugins.grid.changesValidator],
            tbarButtons: (me.objproyecto.get('escala')) ? [] : ['->', me.btnPlantilla],
            bbar: ['->', me.btnRecargarintensidadconflicto, me.btnGuardarIntensidadconflicto]
        });

        me.btnGuardartiempo = new me.comps.buttons.btnGuardar({
            tooltip: 'Guardar escala de tiempo',
            disabled: true,
            handler: function() {
                me.controller.guardarEscalatiempo();
            }
        });

        me.dfFechaInicio = new Ext.form.DateField({
            id: 'dfFechaInicio&' + idCmp,
            fieldLabel: 'Etapa temprana',
            anchor: '95%',
            format: 'd/m/Y',
            value: (me.objproyecto.get('fechainicio')) ? me.objproyecto.get('fechainicio') : null,
            vtype: 'daterange',
            endDateField: 'dfFechaInicioIntermedio&' + idCmp,
            readOnly: true,
            allowBlank: false,
            //disabled: true,
            listeners: {
                valid: function() {
                    me.dfFechaInicioIntermedio.enable(true);
                    me.btnGuardartiempo.enable(true);
                    me.fireEvent('habilitar');
                },
                invalid: function(){
                    me.dfFechaInicioIntermedio.disable(true);
                    me.btnGuardartiempo.disable(true);
                    me.fireEvent('desabilitar');
                }
            }
        });

        me.dfFechaInicioIntermedio = new Ext.form.DateField({
            id: 'dfFechaInicioIntermedio&' + idCmp,
            fieldLabel: 'Etapa intermedia',
            anchor: '95%',
            format: 'd/m/Y',
            value: (me.objproyecto.get('fechaintermedia')) ? me.objproyecto.get('fechaintermedia') : null,
            vtype: 'daterange',
            startDateField: 'dfFechaInicio&' + idCmp,
            //endDateField: 'dfFechaInicioAvanzado&' + idCmp,
            readOnly: true,
            //allowBlank: false,
            disabled: true,
            listeners: {
                valid: function() {
                    me.dfFechaInicioAvanzado.enable(true);
                },
                invalid: function(){
                    me.dfFechaInicioAvanzado.disable(true);
                }
            }
        });

        me.dfFechaInicioAvanzado = new Ext.form.DateField({
            id: 'dfFechaInicioAvanzado&' + idCmp,
            fieldLabel: 'Etapa avanzada',
            anchor: '100%',
            format: 'd/m/Y',
            value: (me.objproyecto.get('fechaavanzada')) ? me.objproyecto.get('fechaavanzada') : null,
            vtype: 'daterange',
            startDateField: 'dfFechaInicioIntermedio&' + idCmp,
            //endDateField: 'dfFechaFin&' + idCmp,
            readOnly: true,
            //allowBlank: false,
            disabled: true,
            listeners: {
                valid: function() {
                    //me.validarEscala();
                }
            }
        });

        me.taDescripcion = new Ext.form.HtmlEditor({
            fieldLabel: 'Descripción',
            name: 'descripcion',
            anchor: '100%',
            height: 115,
            enableAlignments: false,
            enableColors: false,
            enableFont: false,
            enableFontSize: false,
            enableFormat: false,
            enableLinks: false,
            enableLists: false,
            enableSourceEdit: false,
            value: (me.objproyecto.get('descripcion')) ? me.objproyecto.get('descripcion') : ''
        });

        me.panelEscalaTiempo = new Ext.Panel({
            title: me.etiquetas.fieldsetTiempo,
            region: 'south',
            layout: 'form',
            frame: true,
            height: 250,
            labelAlign: 'top',
            items: [
                {
                    layout: 'column',
                    defaults: {columnWidth: .33, layout: 'form', labelAlign: 'top'},
                    items: [
                        {items: [me.dfFechaInicio]},
                        {items: [me.dfFechaInicioIntermedio]},
                        {items: [me.dfFechaInicioAvanzado]}
                    ]
                }, me.taDescripcion
            ],
            bbar: ['->', me.btnGuardartiempo]
        });

        me.items = [me.gpIntensidades, me.panelEscalaTiempo];

        me.initValidatorIntensidadconflicto();
        //me.initValidatorEscalaTiempo();

        me.keys = [
            {key: 'i', alt: true, scope: me, stopEvent: true, fn: function() {me.gpIntensidades.onAdd();}},
            {key: Ext.EventObject.DELETE, scope: me, stopEvent: true, fn: function() {me.gpIntensidades.onDel();}},
            {key: 'h', alt: true, scope: me, stopEvent: true, fn: function() {me.btnAyuda.handler.call();}},
            {key: 'z', ctrl: true, alt: true, scope: me, stopEvent: true, fn: function() {me.btnRecargarintensidadconflicto.handler.call();}},
            {key: 'g', alt: true, scope: me, stopEvent: true, fn: function() {me.btnGuardarIntensidadconflicto.handler.call();}}
        ];
        me.controller._insertItem('intensidad', me);
        me.focus();
        me.controlEscala();

        this.on('resize', function (obj, adjWidth, adjHeight, rawWidth, rawHeight) {
            me.altura = adjHeight;
            me.ancho = adjWidth;
        });

        Planificacion.Integracion.ConfiguracionPanel.superclass.initComponent.call(me);
    },
    mostrarVentanaPlantilla: function(){
        var me = this;
        me.winPlantilla = new Planificacion.Integracion.Plantilla({
            width: me.ancho + 400,
            height: me.altura + 50,
            controller: me.controller
        });
        me.winPlantilla.show();

        me.winPlantilla.on('importar', function(store){
            var mensaje = '¿Est&aacute; seguro que desea aplicar la plantilla?';
            mostrarMensaje(2, mensaje, function(btn) {
                if (btn == 'ok') {
                    var lonImport = store.getCount();
                    if(lonImport > 0){
                        var datosImport = store.getRange(0, (lonImport -1));
                        for(var i = 0; i < lonImport; i++){
                            me.gpIntensidades.addButton.handler.call();
                            me.smIntensidades.selectLastRow();
                            me.smIntensidades.getSelected().set('terminologia', datosImport[i].data.terminologia);
                            me.smIntensidades.getSelected().set('descripcion', datosImport[i].data.descripcion);
                            me.smIntensidades.getSelected().set('nivelintensidad', datosImport[i].data.nivelintensidad);
                        }
                    }
                    mostrarMensaje(1, 'Las plantilla ha sido aplicada correctamente.');
                }
            });

        });
    },
    controlEscala: function(){
        var me = this;
        if(me.objproyecto.get('escala')){
            me.gpIntensidades.hideShowAddDelButtons(false);
            me.btnGuardarIntensidadconflicto.disable(true);
            me.btnRecargarintensidadconflicto.disable(true);
        }
    },
    initValidatorEscalaTiempo: function() {
        var me = this;
        var fields = {inicio: me.dfFechaInicio, intermedio: me.dfFechaInicioIntermedio, avanzada: me.dfFechaInicioAvanzado, desc: me.taDescripcion};
        var botones = [me.btnGuardartiempo];
        me.initValidator(me.validatorEscalaTiempo, fields, botones);
    },
    initValidatorIntensidadconflicto: function() {
        var me = this;
        var fields = {grid: me.gpIntensidades};
        var botones = [me.btnGuardarIntensidadconflicto];
        me.initValidator(me.validatorProyecto, fields, botones);
    },
    initValidator: function(validator, fields, buttons) {
        var res = [];
        ExtExtend.Utils.each(fields, function(i, v) {
            res.push(v);
        });
        validator = new ExtExtend.FormValidator({
            buttons: buttons,
            fields: res
        });
    }
});
Ext.reg('Planificacion.Integracion.ConfiguracionPanel', Planificacion.Integracion.ConfiguracionPanel);

//---------------------------------------------------------------------------------------------------------------------- Plantilla

/**
 * Panel para la gestion de la configuracion las plantillas de las intensidades del conflicto
 * @copyright XETID Cuba
 * @author Ing. Alejandro Medina Mejias
 * @version 1.0
 */
Planificacion.Integracion.Plantilla = ExtExtend.Class({
    $extend: Ext.Window,
    modal: true,
    closeAction: 'destroy',
    title: 'Gestionar plantillas',
    resizable: true,
    constrain: true,
    layout: 'border',
    initComponent: function() {
        var me = this;
        var idCmp = this.id;

        me.width  = (this.width)  ? this.width  : 1000;
        me.height = (this.height) ? this.height : 600;

        me.comps = ExtExtend.Components;
        me.controller = (me.controller) ? me.controller : new Planificacion.Integracion.CurvaconflictoController();
        me.etiquetas = me.controller._getLabel('Curvaconflicto');
        me.directorioImagenes = me.controller._getGlobals('dirImg');

        me.validatorPlantilla = new ExtExtend.FormValidator();
        me.validatorPlantillaDatos = new ExtExtend.FormValidator();

        //-------------------------------------------------------------------------------------------------------------- plantilla
        me.btnImportarPlantilla = new me.comps.buttons.btnAplicar({
            tooltip: 'Aplicar la plantilla',
            disabled: true,
            handler: function() {
                me.fireEvent('importar', me.stPlantillaDatos);
            }
        });

        me.btnGuardarPlantilla = new me.comps.buttons.btnGuardar({
            tooltip: 'Guardar plantilla',
            handler: function() {
                me.controller.guardarPlantilla(true);
            }
        });

        me.btnRecargarPlantilla = new me.comps.buttons.btnActualizar({
            tooltip: 'Actualizar plantilla',
            handler: function() {
                me.stPlantilla.reload();
            }
        });

        me.recordPlantilla = Ext.data.Record.create([
            {name: 'idintensidadconflictoplantilla', type: 'int'},{name: 'denominacion'},{name: 'descripcion'}
        ]);

        me.seleccionar = true;
        me.indexSeleccionado = -1;
        me.stPlantilla = new Ext.data.Store({
            url: Planificacion.Integracion.UrlModulo + "curvaconflicto/obtenerintensidadconflictoplantilla",
            autoLoad: true,
            reader: new Ext.data.JsonReader({
                root: 'data',
                id: 'idintensidadconflictoplantilla',
                totalProperty: 'cantidad_filas'
            }, me.recordPlantilla),
            listeners: {
                beforeload: function(th) {
                    if (me.smPlantilla.hasSelection()) {

                    }
                },
                load: function(th) {
                    me.initValidatorPlantilla();
                    if(th.getCount() > 0){
                        if(me.seleccionar){
                            me.smPlantilla.selectFirstRow();
                            me.seleccionar = false;
                        }
                        if(me.smPlantilla.hasSelection()){
                            me.gpPlantillaDatos.hideShowAddDelButtons(true);
                            me.btnGuardarPlantillaDatos.enable(true);
                            me.btnRecargarPlantillaDatos.enable(true);
                        }else{
                            me.gpPlantillaDatos.hideShowAddDelButtons(false);
                            me.btnGuardarPlantillaDatos.disable(true);
                            me.btnRecargarPlantillaDatos.disable(true);
                        }
                    }else{
                        me.seleccionar = true;
                        me.stPlantillaDatos.removeAll();
                        me.gpPlantillaDatos.hideShowAddDelButtons(false);
                        me.btnGuardarPlantillaDatos.disable(true);
                        me.btnRecargarPlantillaDatos.disable(true);
                        me.btnImportarPlantilla.disable(true);
                    }
                }
            }
        });

        me.smPlantilla = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                selectionchange: function(obj){
                    if(obj.hasSelection()){
                        if(obj.getSelected().data.idintensidadconflictoplantilla){
                            me.gpPlantillaDatos.hideShowAddDelButtons(true);
                            me.btnGuardarPlantillaDatos.enable(true);
                            me.btnRecargarPlantillaDatos.enable(true);
                            me.stPlantillaDatos.reload();
                        }
                    }else{
                        me.stPlantillaDatos.removeAll();
                        me.gpPlantillaDatos.hideShowAddDelButtons(false);
                        me.btnGuardarPlantillaDatos.disable(true);
                        me.btnRecargarPlantillaDatos.disable(true);
                        me.btnImportarPlantilla.disable(true);
                    }
                },
                rowselect: function(obj, rowIndex, rec){
                    me.indexSeleccionado = rowIndex;
                }
            }
        });

        me.cmPlantilla = new Ext.grid.ColumnModel([
            new Ext.grid.RowNumberer(),
            {hidden: true, dataIndex: 'idintensidadconflictoplantilla'},
            {header: 'Denominación', width: 200, sortable: true, dataIndex: 'denominacion', editor: new me.comps.fields.fieldDenom},
            {header: 'Descripción', width: 200, sortable: true, dataIndex: 'descripcion', id: 'descPlantilla&'+ idCmp, editor: new me.comps.fields.fieldDescripcion}
        ]);
        me.cmPlantilla.defaultSortable = true;

        me.gpPlantilla = new me.comps.containers.grids.rowEditorGrid({
            frame: true,
            title: 'Plantilla',
            store: me.stPlantilla,
            cm: me.cmPlantilla,
            sm: me.smPlantilla,
            stripeRows: true,
            addButtonTTip: 'plantilla',
            delButtonTTip: 'plantilla',
            clicksToEdit: 2,
            editable: true,
            delButtonMsg: '¿Está seguro que quiere eliminar la plantilla de laintensidad de conflicto seleccionada?',
            autoExpandColumn: 'descPlantilla&'+ idCmp,
            region: 'west',
            /*overCls: 'x-grid3-row-over',
            ctCls: 'x-grid3-row-selected',*/
            width: '40%',
            defaults: {autoScroll: true},
            loadMask: me.etiquetas.loadMaskGrid,
            plugins: [new me.comps.plugins.grid.changesValidator],
            tbarButtons: ['->', me.btnImportarPlantilla],
            bbar: ['->', me.btnRecargarPlantilla, me.btnGuardarPlantilla],
            listeners: {
                deleterecord: function(){
                    me.seleccionar = true;
                    //if(me.stPlantilla.getCount() > 0){
                        me.smPlantilla.selectRow(me.indexSeleccionado - 1);
                    //}
                }
            }
        });

        //-------------------------------------------------------------------------------------------------------------- Configuracion de la plantilla

        me.btnGuardarPlantillaDatos = new me.comps.buttons.btnGuardar({
            tooltip: 'Guardar datos de la plantilla',
            handler: function() {
                me.controller.guardarPlantilla(false);
            }
        });

        me.btnRecargarPlantillaDatos = new me.comps.buttons.btnActualizar({
            tooltip: 'Actualizar los datos de la plantilla',
            handler: function() {
                me.stPlantillaDatos.reload();
            }
        });

        me.recordPlantillaDatos = Ext.data.Record.create([
            {name: 'idintensidadconflictoplantilla', type: 'int'}, {name: 'terminologia'}, {name: 'descripcion'}, {name: 'nivelintensidad'}, {name: 'alerta'}, {name: 'orden', type: 'int'}
        ]);

        me.stPlantillaDatos = new Ext.data.Store({
            url: Planificacion.Integracion.UrlModulo + "curvaconflicto/obtenerintensidadconflictoplantilla",
            reader: new Ext.data.JsonReader({
                root: 'data',
                id: 'orden',
                totalProperty: 'cantidad_filas'
            }, me.recordPlantillaDatos),
            listeners: {
                beforeload: function(th) {
                    th.baseParams = {
                        idintensidadconflictoplantilla: me.smPlantilla.getSelected().data.idintensidadconflictoplantilla
                    };
                },
                load: function(th) {
                    me.initValidatorPlantillaDatos();
                    if(th.getCount() > 0){
                        me.btnImportarPlantilla.enable(true);
                    }
                }
            }
        });

        me.smPlantillaDatos = new Ext.grid.RowSelectionModel({
            singleSelect: true,
            listeners: {
                selectionchange: function(obj){
                    if(obj.hasSelection()){

                    }
                }
            }
        });

        me.cmPlantillaDatos = new Ext.grid.ColumnModel([
            new Ext.grid.RowNumberer(),
            {hidden: true, dataIndex: 'idintensidadconflictoplantilla'},
            {hidden: true, dataIndex: 'orden'},
            {header: 'Terminología', width: 200, sortable: true, dataIndex: 'terminologia', editor: new me.comps.fields.fieldDenom},
            {header: 'Descripción', sortable: true, dataIndex: 'descripcion', id: 'descPlantillaDatos&'+ idCmp, editor: new me.comps.fields.fieldDescripcion},
            {header: 'Nivel de intensidad', width: 110, sortable: true, dataIndex: 'nivelintensidad', align: 'center', editor: new me.comps.fields.numberField({maskRe:/^[1-9][0-9]*$/,allowDecimals: false})}
        ]);
        me.cmPlantillaDatos.defaultSortable = true;

        me.gpPlantillaDatos = new me.comps.containers.grids.rowEditorGrid({
            frame: true,
            title: 'Datos plantilla',
            store: me.stPlantillaDatos,
            cm: me.cmPlantillaDatos,
            sm: me.smPlantillaDatos,
            stripeRows: true,
            addButtonTTip: 'datos de la plantilla',
            delButtonTTip: 'datos de la plantilla',
            clicksToEdit: 2,
            editable: true,
            delButtonMsg: '¿Está seguro que quiere eliminar los datos de la plantilla de la intensidad de conflicto seleccionada?',
            autoExpandColumn: 'descPlantillaDatos&'+ idCmp,
            region: 'center',
            /*overCls: 'x-grid3-row-over',
             ctCls: 'x-grid3-row-selected',*/
            //width: 500,
            width: '60%',
            defaults: {autoScroll: true},
            loadMask: me.etiquetas.loadMaskGrid,
            plugins: [new me.comps.plugins.grid.changesValidator],
            bbar: ['->', me.btnRecargarPlantillaDatos, me.btnGuardarPlantillaDatos]
        });


        //--------------------------------------------------------------------------------------------------------------

        me.btnCerrar = new me.comps.buttons.btnCerrar({
            handler: function() {
                me.close();
            }
        });


        me.items = [me.gpPlantilla, me.gpPlantillaDatos];
        me.buttons = [me.btnCerrar]

        me.initValidatorPlantilla();
        me.initValidatorPlantillaDatos();

        me.controller._insertItem('plantilla', me);
        Planificacion.Integracion.Plantilla.superclass.initComponent.call(me);
    },
    initValidatorPlantilla: function() {
        var me = this;
        var fields = {grid: me.gpPlantilla};
        var botones = [me.btnGuardarPlantilla];
        me.initValidator(me.validatorPlantilla, fields, botones);
    },
    initValidatorPlantillaDatos: function() {
        var me = this;
        var fields = {grid: me.gpPlantillaDatos};
        var botones = [me.btnGuardarPlantillaDatos];
        me.initValidator(me.validatorPlantillaDatos, fields, botones);
    },
    initValidator: function(validator, fields, buttons) {
        var res = [];
        ExtExtend.Utils.each(fields, function(i, v) {
            res.push(v);
        });
        validator = new ExtExtend.FormValidator({
            buttons: buttons,
            fields: res
        });
    }
});
Ext.reg('Planificacion.Integracion.Plantilla', Planificacion.Integracion.Plantilla);

