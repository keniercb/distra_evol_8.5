Ext.ns('Gestionar.planinversiones');
Ext.QuickTips.init();

var perfil = window.parent.UCID.portal.perfil;

Gestionar.planinversiones.Vista = {
    init: function(idioma, modelo) {
        _this = this;
        _this.identidadselected;
        _this.entidadSeleccionada;

        _this.btnAyudaPlaninversion = new Ext.Button({
            id: 'btnAyudaPlaninversion',
            text: idioma.btnAyuda,
            icon: perfil.dirImg + 'ayuda.png',
            iconCls: 'btn'
        });
        _this.btndesgloses = new Ext.Button({
            id: 'btndesgloses',
            text: 'Desgloses',
            disabled: true,
            tooltip: 'Desgloses de la inversión seleccionada',
            iconCls: 'ver'
        });
        _this.btnModificarPlaninversion = new Ext.Button({
            id: 'btnModificarPlaninversion',
            text: idioma.btnModificar,
            tooltip: idioma.toolModificar,
            iconCls: 'modificar',
            disabled: true
        });

        _this.btnVerDetalles = new Ext.Button({
            id: 'btnVerDetalles',
            text: idioma.btnDetalle,
            tooltip: idioma.btnDetalles,
            iconCls: 'ver',
            disabled: true
        });

        _this.btnVerCuadre = new Ext.Button({
            id: 'btnVerCuadre',
            text: 'Ver cuadre'/*idioma.btnVerCuadre*/,
            tooltip: 'Ver cuadre de la inversion'/*idioma.btnVerCuadre*/,
            iconCls: 'ver',
            disabled: true
        });



        _this.btnVerFinaciamiento = new Ext.Button({
            id: 'btnVerFinaciamiento',
            text: idioma.btnFinaciamiento,
            tooltip: idioma.btnFinaciamiento,
            iconCls: 'ver',
            disabled: true
        });
        _this.cmbEjercicio = new Ext.form.ComboBox({
            emptyText: idioma.tlSeleccione,
            width: 165,
            id: 'idejercicio',
            store: modelo.stCbejercicio,
            displayField: 'ejercicio',
            valueField: 'idejercicio',
            typeAhead: true,
            mode: 'local',
            disabled: false,
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus: true,
            anchor: '95%',
            loadingText: 'Cargando...',
            allowBlank: false
        });

        _this.ChConsolidarr = new Ext.form.Checkbox({
            xtype: 'checkbox',
            disabled: true,
            boxLabel: 'General',
            listeners: {
                check: function(ch, cheque) {
                    if (cheque == true) {
                        Ext.getCmp('btnModificarPlaninversion').disable();
                    } else {
                        Ext.getCmp('btnModificarPlaninversion').enable();
                    }
                    Ext.getCmp('gpInversiones').getStore().reload({
                        params: {
                            start: 0,
                            limit: 20,
                            identidad: _this.identidadselected,
                            idejercicio: Ext.getCmp('idejercicio').getValue()
                        }
                    });
                }
            }

        });
        _this.ChVigente = new Ext.form.Checkbox({
            id: 'idvigente',
            xtype: 'checkbox',
            disabled: true,
            boxLabel: 'Vigentes',
            checked: false,
            listeners: {
                check: function(ch, chequeado) {
                    modelo.stIinversiones.reload({
                        params: {
                            start: 0,
                            limit: 20,
                            identidad: _this.identidadselected,
                            idejercicio: Ext.getCmp('idejercicio').getValue()
                        }
                    });
                }
            }

        });
//
//        this.btnGraficas = new Utilidades.Cmp.botonGrafica({
//            idioma: idioma,
//            idejercicio: _this.cmbEjercicio.getValue(),
//            ejercicio: _this.cmbEjercicio.getRawValue(),
//            nodeEntidad: _this.entidadSeleccionada
//        });
//
//        _this.btnGraficoInversion = this.btnGraficas.botonMenuGrafica();

        //------------------------------------------------------
        //modelo.stCbejercicio.reload();
        _this.tfaprobadoHV = new Ext.form.TextField({
            xtype: 'textfield',
            width: 210,
            regex: /^([a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]* ?[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]*[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]* ?[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ])+$/,
            maskRe: /^([a-z A-Z0-9áéíóú�?É�?ÓÚñÑ])$/,
            regexText: 'Este campo solo admite caracteres alfanúmericos',
            align: 'right',
            allowBlank: true,
            fieldLabel: 'Aprobado por'
        });
        _this.tfaprobadoA = new Ext.form.TextField({
            xtype: 'textfield',
            width: 200,
            regex: /^([a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]* ?[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]*[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]* ?[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ])+$/,
            maskRe: /^([a-z A-Z0-9áéíóú�?É�?ÓÚñÑ])$/,
            regexText: 'Este campo solo admite caracteres alfanúmericos',
            align: 'right',
            allowBlank: true,
            fieldLabel: 'Aprobado por'
        });
        _this.tfelaboradoVH = new Ext.form.TextField({
            xtype: 'textfield',
            width: 210,
            regex: /^([a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]* ?[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]*[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]* ?[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ])+$/,
            maskRe: /^([a-z A-Z0-9áéíóú�?É�?ÓÚñÑ])$/,
            regexText: 'Este campo solo admite caracteres alfanúmericos',
            align: 'right',
            allowBlank: true,
            fieldLabel: 'Elaborado por'
        });
        _this.tfelaboradoA = new Ext.form.TextField({
            xtype: 'textfield',
            width: 200,
            regex: /^([a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]* ?[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]*[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]* ?[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ])+$/,
            maskRe: /^([a-z A-Z0-9áéíóú�?É�?ÓÚñÑ])$/,
            regexText: 'Este campo solo admite caracteres alfanúmericos',
            align: 'right',
            allowBlank: true,
            fieldLabel: 'Elaborado por'
        });
        _this.tfgracia = new Ext.form.TextField({
            xtype: 'textfield',
            width: 200,
            regex: /^([0-9]*)$/,
            maskRe: /^([0-9]*)$/,
            regexText: 'Este campo solo admite caracteres alfanúmericos',
            align: 'right',
            fieldLabel: 'Gracia'
        });
        _this.tfamortizacion = new Ext.form.TextField({
            xtype: 'textfield',
            width: 200,
            regex: /^([0-9]* ?[.]*[0-9]*)$/,
            maskRe: /^([0-9]* ?[.]*[0-9]*)$/,
            regexText: 'Este campo solo admite caracteres alfan&uacute;mericos',
            align: 'right',
            //  disabled: true,
            fieldLabel: 'Amortizaci&oacute;n'
        });
        _this.tfinteres = new Ext.form.TextField({
            xtype: 'textfield',
            width: 200,
            regex: /^([0-9]* ?[.]*[0-9]*)$/,
            maskRe: /^([0-9]* ?[.]*[0-9]*)$/,
            regexText: 'Este campo solo admite caracteres alfan&uacute;mericos',
            align: 'right',
            fieldLabel: 'Inter&eacute;s'
        });
        _this.CmbEntidad = new Ext.ux.form.LovCombo({
            width: 210,
            align: 'right',
            mode: 'local',
            store: modelo.stEntidad,
            loadingText: 'Cargando...',
            valueField: 'identidad',
            displayField: 'entidad',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            fieldLabel: 'Entidad'

        });
        _this.CmbEntidadA = new Ext.ux.form.LovCombo({
            width: 200,
            align: 'right',
            mode: 'local',
            store: modelo.stEntidad,
            valueField: 'identidad',
            displayField: 'entidad',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            fieldLabel: 'Entidad'

        });
        _this.CmbEntidadAexcel = new Ext.ux.form.LovCombo({
            width: 200,
            align: 'right',
            mode: 'local',
            store: modelo.stEntidad,
            valueField: 'identidad',
            displayField: 'entidad',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            fieldLabel: 'Entidad'

        });

        _this.cbEntComponente = new Ext.ux.form.LovCombo({
            width: 160,
            align: 'right',
            mode: 'local',
            store: modelo.stEntidad,
            valueField: 'identidad',
            displayField: 'entidad',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            fieldLabel: 'Entidad',
            disabled: true,
            listWidth: 240,
            resizable: true

        });
        _this.CmbMoneda = new Ext.form.ComboBox({
            width: 200,
            align: 'right',
            allowBlank: false,
            mode: 'local',
            store: modelo.stMonedaRD,
            valueField: 'idmoneda',
            displayField: 'denominacion',
            // disabled: true,
            triggerAction: 'all',
            emptyText: '',
            fieldLabel: 'Moneda',
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });

        _this.CmbCredito = new Ext.ux.form.LovCombo({
            xtype: 'combo',
            width: 200,
            align: 'right',
            mode: 'local',
            store: modelo.stCredito,
            // disabled: true,
            valueField: 'idtipofinanciamiento',
            displayField: 'denominaciontipo',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            listWidth: 250,
            editable: true,
            allowBlank: true,
            enableQtip: true,
            typeAhead: true,
            fieldLabel: 'Cr&eacute;dito'

        });

        Ext.QuickTips.init();
        _this.CmbOrganismo = new Ext.ux.form.LovCombo({
            xtype: 'combo',
            width: 210,
            align: 'right',
            mode: 'local',
            store: modelo.stOrganismo,
            // disabled: true,
            valueField: 'idorganismo',
            displayField: 'organismo',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            listWidth: 250,
            editable: true,
            allowBlank: false,
            enableQtip: true,
            typeAhead: true,
            //selectOnFocus: true,
            fieldLabel: 'Organismo'//,
                    // tpl: '<tpl for="."><div ext:qtip="{organismo}" class="x-combo-list-item">{organismo}</div></tpl>'

        });
        _this.CmbOrganismoA = new Ext.ux.form.LovCombo({
            xtype: 'combo',
            width: 200,
            align: 'right',
            mode: 'local',
            store: modelo.stOrganismo,
            // disabled: true,
            valueField: 'idorganismo',
            displayField: 'organismo',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            listWidth: 250,
            editable: true,
            allowBlank: false,
            enableQtip: true,
            typeAhead: true,
            fieldLabel: 'Organismo'//,
                    //tpl: '<tpl for="."><div ext:qtip="{organismo}" class="x-combo-list-item">{organismo}</div></tpl>'

        });
        _this.CmbOrganismoAexcel = new Ext.ux.form.LovCombo({
            xtype: 'combo',
            width: 200,
            align: 'right',
            mode: 'local',
            store: modelo.stOrganismo,
            // disabled: true,
            valueField: 'idorganismo',
            displayField: 'organismo',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            listWidth: 250,
            editable: true,
            allowBlank: true,
            enableQtip: true,
            typeAhead: true,
            fieldLabel: 'Organismo'//,
                    //tpl: '<tpl for="."><div ext:qtip="{organismo}" class="x-combo-list-item">{organismo}</div></tpl>'

        });

        _this.cbOrganismoComponente = new Ext.ux.form.LovCombo({
            xtype: 'combo',
            width: 160,
            align: 'right',
            mode: 'local',
            store: modelo.stOrganismo,
            valueField: 'idorganismo',
            displayField: 'organismo',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            listWidth: 250,
            editable: true,
            allowBlank: false,
            enableQtip: true,
            typeAhead: true,
            fieldLabel: 'Organismo'
        });
        _this.Cmborganorector = new Ext.ux.form.LovCombo({
            xtype: 'combo',
            width: 200,
            align: 'right',
            mode: 'local',
            store: modelo.stOrganosatisface,
            // disabled: true,
            valueField: 'idorganosatisface',
            displayField: 'denominacion',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            listWidth: 250,
            editable: true,
            allowBlank: true,
            enableQtip: true,
            typeAhead: true,
            fieldLabel: 'Organo Rector'//,
                    // tpl: '<tpl for="."><div ext:qtip="{organismo}" class="x-combo-list-item">{organismo}</div></tpl>'

        });

        _this.ObservacionR = new Ext.form.TextArea({
            xtype: 'textarea',
            // id: 'idobservacionplan',
            anchor: '97%',
            fieldLabel: 'Observaciones',
            editable: true,
            height: 100,
            width: 700,
            style: 'margin-left:0px;margin-top:5.5px'
        });
        _this.ObservacionA = new Ext.form.TextArea({
            xtype: 'textarea',
            // id: 'idobservacionplan',
            anchor: '97%',
            fieldLabel: 'Observaciones',
            editable: true,
            height: 100,
            width: 700,
            style: 'margin-left:0px;margin-top:5.5px'
        });
        _this.fmreportePlan = new Ext.form.FormPanel({
            width: 470,
            height: 300,
            frame: true,
            region: "center",
            border: false,
            labelAlign: 'top',
            items: [{
                    layout: 'column',
                    items: [{
                            columnWidth: .5,
                            layout: 'form',
                            items: [_this.CmbOrganismo, _this.tfaprobadoHV]
                        }, {
                            columnWidth: .5,
                            layout: 'form',
                            items: [_this.CmbEntidad, _this.tfelaboradoVH]
                        }
                    ]
                }, {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: 1,
                            layout: 'form',
                            items: [_this.ObservacionR]
                        }
                    ]
                }
            ]
        });

//Elementos de la ventana obtener datos del reporte resumen de inversion en MP        

        _this.CmbOrganismoResumenInv = new Ext.ux.form.LovCombo({
            xtype: 'combo',
            width: 200,
            align: 'right',
            mode: 'local',
            store: modelo.stOrganismo,
            // disabled: true,
            valueField: 'idorganismo',
            displayField: 'organismo',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            listWidth: 250,
            editable: true,
            allowBlank: false,
            enableQtip: true,
            typeAhead: true,
            fieldLabel: 'Organismo',
            resizable: true//,
                    // tpl: '<tpl for="."><div ext:qtip="{organismo}" class="x-combo-list-item">{organismo}</div></tpl>'

        });
//        _this.CmbEntidadResumenInv = new Ext.form.ComboBox({
        _this.CmbEntidadResumenInv = new Ext.ux.form.LovCombo({
            xtype: 'combo',
            disabled: true,
            anchor: '97%',
            align: 'right',
            mode: 'local',
            store: modelo.stEntidad,
            valueField: 'identidad',
            displayField: 'entidad',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            editable: true,
            enableQtip: true,
            typeAhead: true,
            fieldLabel: 'Entidad',
            resizable: true//,
                    // tpl: '<tpl for="."><div ext:qtip="{entidad}" class="x-combo-list-item">{entidad}</div></tpl>'
        });
        _this.cbDenomInv = new Ext.ux.form.LovCombo({
            disabled: true,
            anchor: '98%',
            align: 'right',
            mode: 'local',
            store: modelo.stDenomInversion,
            valueField: 'idinversion',
            displayField: 'denominacion',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            editable: true,
            enableQtip: true,
            typeAhead: true,
            fieldLabel: 'Denominaci&oacute;n de la inversi&oacute;n',
            resizable: true
        });
        _this.tfaprobadoResumenInv = new Ext.form.TextField({
            xtype: 'textfield',
            anchor: '96%',
            regex: /^([a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]* ?[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]*[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]* ?[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ])+$/,
            maskRe: /^([a-z A-Z0-9áéíóú�?É�?ÓÚñÑ])$/,
            regexText: 'Este campo solo admite caracteres alfan&uacute;mericos',
            align: 'right',
            fieldLabel: 'Aprobado por'
        });
        _this.tfelaboradoResumenInv = new Ext.form.TextField({
            xtype: 'textfield',
            anchor: '96%',
            regex: /^([a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]* ?[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]*[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]* ?[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ])+$/,
            maskRe: /^([a-z A-Z0-9áéíóú�?É�?ÓÚñÑ])$/,
            regexText: 'Este campo solo admite caracteres alfanúmericos',
            align: 'right',
            fieldLabel: 'Elaborado por'
        });
        _this.ObservacionResumenInv = new Ext.form.TextArea({
            xtype: 'textarea',
            // id: 'idobservacionplan',
            anchor: '98%',
            fieldLabel: 'Observaciones',
            editable: true,
            height: 100,
            width: 700,
            style: 'margin-left:0px;margin-top:5.5px'
        });
        _this.btnCancelarResumenInv = new Ext.Button({
            text: 'Cancelar',
            iconCls: 'cancelar',
            tooltip: 'Cancelar'
        });
        _this.btnAceptarResumenInv = new Ext.Button({
            text: 'Aceptar',
            iconCls: 'aceptar',
            tooltip: 'Aceptar',
            id: 'btnAceptarResumenInv',
            disabled: false
        });

        _this.tamanoLetra = new Ext.form.ComboBox({
            width: 200,
            align: 'right',
            allowBlank: false,
            mode: 'local',
            store: modelo.stTamanoLetra,
            valueField: 'idtamano',
            displayField: 'tamano',
            // disabled: true,
            triggerAction: 'all',
            emptyText: 'Seleccione',
            fieldLabel: 'Tama\xF1o',
            //tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });

        _this.tipoLetra = new Ext.form.ComboBox({
            width: 200,
            align: 'right',
            allowBlank: false,
            mode: 'local',
            store: modelo.stTipoLetra,
            valueField: 'idletra',
            displayField: 'tipoLetra',
            // disabled: true,
            triggerAction: 'all',
            emptyText: 'Seleccione',
            fieldLabel: 'Tipo de letra',
            //tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });

        _this.fmreporteResumenInv = new Ext.form.FormPanel({
            width: 450,
            height: 350,
            frame: true,
            region: "center",
            border: false,
            labelAlign: 'top',
            items: [{
                    layout: 'column',
                    items: [{
                            columnWidth: .5,
                            layout: 'form',
                            items: _this.CmbOrganismoResumenInv
                        }, {
                            columnWidth: .5,
                            layout: 'form',
                            items: _this.CmbEntidadResumenInv
                        }
                    ]
                }/*, {
                 layout: 'column',
                 items: [{
                 columnWidth: 1,
                 layout: 'form',
                 items: _this.cbDenomInv
                 }
                 ]
                 }*/, {
                    layout: 'column',
                    items: [{
                            columnWidth: .5,
                            layout: 'form',
                            items: [_this.tfaprobadoResumenInv]
                        }, {
                            columnWidth: .5,
                            layout: 'form',
                            items: [_this.tfelaboradoResumenInv]
                        }
                    ]
                }, /*{
                 layout: 'column',
                 items: [{
                 columnWidth: .5,
                 layout: 'form',
                 items: [_this.tamanoLetra]
                 }, {
                 columnWidth: .5,
                 layout: 'form',
                 items: [_this.tipoLetra]
                 }
                 ]
                 },*/ {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: 1,
                            layout: 'form',
                            items: [_this.ObservacionResumenInv]
                        }
                    ]
                }
            ]
        });
//Elementos de la ventana obtener datos del reporte Maqueta 
        _this.CmbOrganismoMaqueta = new Ext.ux.form.LovCombo({
            xtype: 'combo',
            width: 160,
            align: 'right',
            store: modelo.stOrganismo,
            valueField: 'idorganismo',
            displayField: 'organismo',
            triggerAction: 'all',
            mode: 'local',
            emptyText: 'Seleccione...',
            listWidth: 250,
            editable: true,
            allowBlank: false,
            enableQtip: true,
            typeAhead: true,
            fieldLabel: 'Organismo'//,
                    // tpl: '<tpl for="."><div ext:qtip="{organismo}" class="x-combo-list-item">{organismo}</div></tpl>'

        });

        _this.cmbFormaPropRepMaqueta = new Ext.ux.form.LovCombo({
            xtype: 'combo',
            width: 200,
            align: 'right',
            store: modelo.stFormapropiedad,
            mode: 'local',
            valueField: 'idformapropiedad',
            displayField: 'denominacion',
            triggerAction: 'all',
            emptyText: idioma.tlSeleccione,
            listWidth: 250,
            editable: true,
            // allowBlank: false,
            enableQtip: true,
            typeAhead: true,
            fieldLabel: idioma.tlFormProp//,
                    // tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'

        });
        _this.cmbFormaPropExcel = new Ext.ux.form.LovCombo({
            xtype: 'combo',
            width: 200,
            align: 'right',
            store: modelo.stFormapropiedad,
            mode: 'local',
            valueField: 'idformapropiedad',
            displayField: 'denominacion',
            triggerAction: 'all',
            emptyText: idioma.tlSeleccione,
            listWidth: 250,
            editable: true,
            // allowBlank: false,
            enableQtip: true,
            typeAhead: true,
            fieldLabel: idioma.tlFormProp
                    // tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'

        });
        _this.cmbCompRepMaqueta = new Ext.ux.form.LovCombo({
            xtype: 'combo',
            width: 200,
            align: 'right',
            mode: 'local',
            anchor: '96%',
            store: modelo.stComponentes,
            // disabled: true,
            valueField: 'idetapa',
            displayField: 'denominacion',
            triggerAction: 'all',
            emptyText: idioma.tlSeleccione,
            listWidth: 250,
            editable: true,
            enableQtip: true,
            typeAhead: true,
            fieldLabel: 'Componentes'//,
                    // tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });

        _this.tfaprobadoMaqueta = new Ext.form.TextField({
            xtype: 'textfield',
            anchor: '96%',
            regex: /^([a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]* ?[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]*[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]* ?[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ])+$/,
            maskRe: /^([a-z A-Z0-9áéíóú�?É�?ÓÚñÑ])$/,
            regexText: 'Este campo solo admite caracteres alfan&uacute;mericos',
            align: 'right',
            //allowBlank: true,
            fieldLabel: 'Aprobado por'
        });
        _this.tfelaboradoMaqueta = new Ext.form.TextField({
            xtype: 'textfield',
            anchor: '96%',
            regex: /^([a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]* ?[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]*[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]* ?[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ])+$/,
            maskRe: /^([a-z A-Z0-9áéíóú�?É�?ÓÚñÑ])$/,
            regexText: 'Este campo solo admite caracteres alfan&uacute;mericos',
            align: 'right',
            //allowBlank: true,
            fieldLabel: 'Elaborado por'
        });
        _this.ObservacionMaqueta = new Ext.form.TextArea({
            xtype: 'textarea',
            regex: /^([a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]* ?[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]*[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]* ?[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ])+$/,
            maskRe: /^([a-z A-Z0-9áéíóú�?É�?ÓÚñÑ])$/,
            anchor: '98%',
            fieldLabel: 'Observaciones',
            editable: true,
            height: 100,
            width: 700,
            style: 'margin-left:0px;margin-top:5.5px'
        });
        _this.btnCancelarMaqueta = new Ext.Button({
            text: 'Cancelar',
            iconCls: 'cancelar',
            tooltip: 'Cancelar'
        });
        _this.btnAceptarMaqueta = new Ext.Button({
            text: 'Aceptar',
            iconCls: 'aceptar',
            tooltip: 'Aceptar'
        });

        _this.fmreporteMaqueta = new Ext.form.FormPanel({
            width: 600,
            height: 350,
            frame: true,
            region: "center",
            border: false,
            labelAlign: 'top',
            items: [{
                    layout: 'column',
                    items: [{
                            columnWidth: .3,
                            layout: 'form',
                            items: _this.CmbOrganismoMaqueta
                        }, {
                            columnWidth: .35,
                            layout: 'form',
                            items: _this.cmbFormaPropRepMaqueta
                        }, {
                            columnWidth: .35,
                            layout: 'form',
                            items: _this.cmbCompRepMaqueta
                        }
                    ]
                }, {
                    layout: 'column',
                    items: [{
                            columnWidth: .5,
                            layout: 'form',
                            items: [_this.tfaprobadoMaqueta]
                        }, {
                            columnWidth: .5,
                            layout: 'form',
                            items: [_this.tfelaboradoMaqueta]
                        }
                    ]
                }, {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: 1,
                            layout: 'form',
                            items: [_this.ObservacionMaqueta]
                        }
                    ]
                }
            ]
        });

        _this.fmreporteAcreedor = new Ext.form.FormPanel({
            width: 700,
            height: 300,
            frame: true,
            region: "center",
            border: false,
            labelAlign: 'top',
            items: [{
                    layout: 'column',
                    items: [{
                            columnWidth: .33,
                            layout: 'form',
                            items: [_this.CmbOrganismoA, _this.CmbCredito, _this.tfinteres]
                        }, {
                            columnWidth: .33,
                            layout: 'form',
                            items: [_this.CmbEntidadA, _this.tfgracia, _this.tfaprobadoA]
                        }, {
                            columnWidth: .33,
                            layout: 'form',
                            items: [_this.CmbMoneda, _this.tfamortizacion, _this.tfelaboradoA]
                        }
                    ]
                }, {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: .99,
                            layout: 'form',
                            items: [_this.ObservacionA]
                        }
                    ]
                }
            ]
        });
        _this.CmbOrganismoE = new Ext.ux.form.LovCombo({
            xtype: 'combo',
            width: 200,
            align: 'right',
            mode: 'local',
            store: modelo.stOrganismo,
            // disabled: true,
            valueField: 'idorganismo',
            displayField: 'organismo',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            listWidth: 250,
            editable: true,
            allowBlank: false,
            enableQtip: true,
            typeAhead: true,
            fieldLabel: 'Organismo'//,
                    //tpl: '<tpl for="."><div ext:qtip="{organismo}" class="x-combo-list-item">{organismo}</div></tpl>'

        });

        _this.tfaprobadoEmision = new Ext.form.TextField({
            id: 'idtfaprobadoemision',
            width: 200,
            allowBlank: true,
            regex: /^([a-zA-ZáéíóúñüÑ�?É�?ÓÚ\-\ \:\/\,\_\-\.\d()"'.]+ ?[a-zA-ZáéíóúñüÑ�?É�?ÓÚ\-\:\/\,\_\-\.\d()"'.]*)+$/,
            maskRe: /^([a-zA-ZáéíóúñüÑ�?É�?ÓÚ\-\ \:\/\,\_\-\.\d()"'.]+ ?[a-zA-ZáéíóúñüÑ�?É�?ÓÚ\-\:\/\,\_\-\.\d()"'.]*)+$/,
            regexText: idioma.tlLetras,
            fieldLabel: idioma.tlAprobado
        });
        _this.CmbFormaEmision = new Ext.ux.form.LovCombo({
            width: 200,
            align: 'right',
            allowBlank: false,
            mode: 'local',
            store: modelo.stFormapropiedad,
            valueField: 'idformapropiedad',
            displayField: 'denominacion',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            fieldLabel: 'Forma de propiedad'//,
                    // tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'

        });
        _this.tfelaboradoEmision = new Ext.form.TextField({
            xtype: 'textfield',
            width: 200,
            regex: /^([a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]* ?[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]*[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]* ?[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ])+$/,
            maskRe: /^([a-z A-Z0-9áéíóú�?É�?ÓÚñÑ])$/,
            regexText: 'Este campo solo admite caracteres alfan&uacute;mericos',
            align: 'right',
            allowBlank: true,
            fieldLabel: 'Elaborado por'
        });
        _this.ObservacionEmision = new Ext.form.TextArea({
            xtype: 'textarea',
            anchor: '97%',
            fieldLabel: 'Observaciones',
            editable: true,
            height: 100,
            width: 450,
            style: 'margin-left:0px;margin-top:5.5px'
        });
        _this.fmreporteEmision = new Ext.form.FormPanel({
            width: 450,
            height: 300,
            frame: true,
            region: "center",
            border: false,
            labelAlign: 'top',
            items: [{
                    layout: 'column',
                    items: [{
                            columnWidth: .5,
                            layout: 'form',
                            items: [_this.CmbOrganismoE, _this.tfaprobadoEmision]
                        }, {
                            columnWidth: .5,
                            layout: 'form',
                            items: [_this.CmbFormaEmision, _this.tfelaboradoEmision]
                        }
                    ]
                }, {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: 1,
                            layout: 'form',
                            items: [_this.ObservacionEmision]
                        }
                    ]
                }
            ]
        });
        _this.CmbOrganismoC = new Ext.ux.form.LovCombo({
            width: 200,
            align: 'right',
            allowBlank: false,
            mode: 'local',
            store: modelo.stOrganismo,
            valueField: 'idorganismo',
            displayField: 'organismo',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            fieldLabel: 'Organismo'//,
                    //tpl: '<tpl for="."><div ext:qtip="{organismo}" class="x-combo-list-item">{organismo}</div></tpl>'

        });
        _this.tfaprobadoC = new Ext.form.TextField({
            width: 200,
            allowBlank: true,
            regex: /^([a-zA-ZáéíóúñüÑ�?É�?ÓÚ\-\ \:\/\,\_\-\.\d()"'.]+ ?[a-zA-ZáéíóúñüÑ�?É�?ÓÚ\-\:\/\,\_\-\.\d()"'.]*)+$/,
            maskRe: /^([a-zA-ZáéíóúñüÑ�?É�?ÓÚ\-\ \:\/\,\_\-\.\d()"'.]+ ?[a-zA-ZáéíóúñüÑ�?É�?ÓÚ\-\:\/\,\_\-\.\d()"'.]*)+$/,
            regexText: idioma.tlLetras,
            fieldLabel: idioma.tlAprobado
        });


        _this.ChekCon = new Ext.form.Checkbox({
            xtype: 'checkbox',
            disabled: false,
            align: 'right',
            fieldLabel: 'Mostrar inversiones'

        });
        _this.CmbConstructores = new Ext.ux.form.LovCombo({
            width: 200,
            align: 'right',
            mode: 'local',
            store: modelo.stConstructor,
            // disabled: true,
            valueField: 'idconstructor',
            displayField: 'denomconstructor',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            listWidth: 250,
            typeAhead: true,
            fieldLabel: 'Constructores',
            tpl: '<tpl for="."><div ext:qtip="{denomconstructor}" class="x-combo-list-item">{denomconstructor}</div></tpl>'

        });
        _this.tfelaboradoC = new Ext.form.TextField({
            xtype: 'textfield',
            width: 200,
            regex: /^([a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]* ?[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]*[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]* ?[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ])+$/,
            maskRe: /^([a-z A-Z0-9áéíóú�?É�?ÓÚñÑ])$/,
            regexText: 'Este campo solo admite caracteres alfan&uacute;mericos',
            align: 'right',
            allowBlank: true,
            fieldLabel: 'Elaborado por'
        });
        _this.ObservacionC = new Ext.form.TextArea({
            xtype: 'textarea',
            anchor: '97%',
            fieldLabel: 'Observaciones',
            editable: true,
            height: 100,
            width: 450,
            style: 'margin-left:0px;margin-top:5.5px'
        });


        _this.CmbOrganismoCC = new Ext.ux.form.LovCombo({
            width: 200,
            align: 'right',
            allowBlank: false,
            mode: 'local',
            store: modelo.stOrganismo,
            valueField: 'idorganismo',
            displayField: 'organismo',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            fieldLabel: 'Organismo'//,
                    // tpl: '<tpl for="."><div ext:qtip="{organismo}" class="x-combo-list-item">{organismo}</div></tpl>'

        });

        _this.tfaprobadoCC = new Ext.form.TextField({
            width: 200,
            allowBlank: true,
            regex: /^([a-zA-ZáéíóúñüÑ�?É�?ÓÚ\-\ \:\/\,\_\-\.\d()"'.]+ ?[a-zA-ZáéíóúñüÑ�?É�?ÓÚ\-\:\/\,\_\-\.\d()"'.]*)+$/,
            maskRe: /^([a-zA-ZáéíóúñüÑ�?É�?ÓÚ\-\ \:\/\,\_\-\.\d()"'.]+ ?[a-zA-ZáéíóúñüÑ�?É�?ÓÚ\-\:\/\,\_\-\.\d()"'.]*)+$/,
            regexText: idioma.tlLetras,
            fieldLabel: idioma.tlAprobado
        });

        _this.tfelaboradoCC = new Ext.form.TextField({
            xtype: 'textfield',
            width: 200,
            regex: /^([a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]* ?[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]*[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]* ?[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ])+$/,
            maskRe: /^([a-z A-Z0-9áéíóú�?É�?ÓÚñÑ])$/,
            regexText: 'Este campo solo admite caracteres alfan&uacute;mericos',
            align: 'right',
            allowBlank: true,
            fieldLabel: 'Elaborado por'
        });

        _this.ObservacionCC = new Ext.form.TextArea({
            xtype: 'textarea',
            anchor: '97%',
            fieldLabel: 'Observaciones',
            editable: true,
            height: 100,
            width: 450,
            style: 'margin-left:0px;margin-top:5.5px'
        });


        _this.ChekCons = new Ext.form.Checkbox({
            xtype: 'checkbox',
            disabled: false,
            align: 'right',
            fieldLabel: 'Mostrar constructor'
        });

        _this.CmbProvinciaConstructorCC = new Ext.ux.form.LovCombo({
            fieldLabel: 'Provincia',
            width: 200,
            align: 'right',
            mode: 'local',
            store: modelo.stProvinciaConstructor,
            valueField: 'idprovincia',
            displayField: 'provincia',
            //allowBlank: false,
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            tpl: '<tpl for="."><div ext:qtip="{provincia}" class="x-combo-list-item">{provincia}</div></tpl>'

        });
        _this.CmbConstructoresCC = new Ext.ux.form.LovCombo({
            xtype: 'combo',
            width: 200,
            align: 'right',
            mode: 'local',
            store: modelo.stConstructor,
            // disabled: true,
            valueField: 'idconstructor',
            displayField: 'denomconstructor',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            listWidth: 250,
            editable: true,
            allowBlank: true,
            enableQtip: true,
            typeAhead: true,
            fieldLabel: 'Constructores',
            tpl: '<tpl for="."><div ext:qtip="{denomconstructor}" class="x-combo-list-item">{denomconstructor}</div></tpl>'

        });


        _this.CmbProvinciaConstructor = new Ext.ux.form.LovCombo({
            fieldLabel: 'Provincia',
            width: 200,
            align: 'right',
            mode: 'local',
            store: modelo.stProvinciaConstructor,
            valueField: 'idprovincia',
            displayField: 'provincia',
            //allowBlank: false,
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            tpl: '<tpl for="."><div ext:qtip="{provincia}" class="x-combo-list-item">{provincia}</div></tpl>'
        });

        //Formulario del reporte Automotor
        _this.tfelaboradoAuto = new Ext.form.TextField({
            xtype: 'textfield',
            width: 200,
            regex: /^([a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]* ?[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]*[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]* ?[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ])+$/,
            maskRe: /^([a-z A-Z0-9áéíóú�?É�?ÓÚñÑ])$/,
            regexText: 'Este campo solo admite caracteres alfan&uacute;mericos',
            align: 'right',
            allowBlank: true,
            fieldLabel: 'Elaborado por'
        });
        _this.tfaprobadoAuto = new Ext.form.TextField({
            width: 200,
            allowBlank: true,
            regex: /^([a-zA-ZáéíóúñüÑ�?É�?ÓÚ\-\ \:\/\,\_\-\.\d()"'.]+ ?[a-zA-ZáéíóúñüÑ�?É�?ÓÚ\-\:\/\,\_\-\.\d()"'.]*)+$/,
            maskRe: /^([a-zA-ZáéíóúñüÑ�?É�?ÓÚ\-\ \:\/\,\_\-\.\d()"'.]+ ?[a-zA-ZáéíóúñüÑ�?É�?ÓÚ\-\:\/\,\_\-\.\d()"'.]*)+$/,
            regexText: idioma.tlLetras,
            fieldLabel: idioma.tlAprobado
        });
        _this.CmbOrganismoAuto = new Ext.ux.form.LovCombo({
            xtype: 'combo',
            width: 200,
            align: 'right',
            mode: 'local',
            store: modelo.stOrganismo,
            // disabled: true,
            resizable: true,
            valueField: 'idorganismo',
            displayField: 'organismo',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            listWidth: 250,
            editable: true,
            allowBlank: false,
            enableQtip: true,
            typeAhead: true,
            fieldLabel: 'Organismo'//,
                    //tpl: '<tpl for="."><div ext:qtip="{organismo}" class="x-combo-list-item">{organismo}</div></tpl>'

        });
        _this.CmbMonedaAuto = new Ext.form.ComboBox({
            width: 200,
            align: 'right',
            allowBlank: true,
            mode: 'local',
            store: modelo.stMonedaAuto,
            valueField: 'idmonedaauto',
            displayField: 'moneda',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            fieldLabel: 'Moneda AutoMotor',
            tpl: '<tpl for="."><div ext:qtip="{moneda}" class="x-combo-list-item">{moneda}</div></tpl>'

        });
        _this.CmbFormaEquipos = new Ext.ux.form.LovCombo({
            width: 200,
            align: 'right',
            mode: 'local',
            allowBlank: true,
            store: modelo.stFormapropiedad,
            valueField: 'idformapropiedad',
            displayField: 'denominacion',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            fieldLabel: 'Forma de propiedad'//,
                    // tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'

        });
        _this.Cmbcompra = new Ext.form.ComboBox({
            width: 200,
            align: 'right',
            //allowBlank: false,
            mode: 'local',
            store: modelo.stComprarPlan,
            // disabled: true,
            valueField: 'idcomprar',
            displayField: 'denominacion',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            fieldLabel: 'Comprar',
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });
        _this.Cmbcomprarexcel = new Ext.form.ComboBox({
            width: 200,
            align: 'right',
            //allowBlank: false,
            mode: 'local',
            store: modelo.stComprarPlan,
            // disabled: true,
            valueField: 'idcomprar',
            displayField: 'denominacion',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            fieldLabel: 'Comprar',
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });
        _this.CmbformaPropiedadExcel = new Ext.ux.form.LovCombo({
            width: 200,
            align: 'right',
            mode: 'local',
            store: modelo.stFormapropiedad,
            valueField: 'idformapropiedad',
            displayField: 'denominacion',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            fieldLabel: 'Forma de propiedad'//,
                    // tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'

        });
        _this.Cmbadquirirexcel = new Ext.form.ComboBox({
            width: 200,
            align: 'right',
            //allowBlank: false,
            mode: 'local',
            store: modelo.stAdquirirexcel,
            // disabled: true,
            valueField: 'idadquisicion',
            displayField: 'denominacion',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            fieldLabel: 'Adquirir',
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });

        _this.CmbEntidadModeloPlan = new Ext.ux.form.LovCombo({
            fieldLabel: 'Plan',
            id: 'identidadmodelo',
            width: 200,
            align: 'right',
            mode: 'local',
            store: modelo.stModeloPlan,
            valueField: 'identidadmodelo',
            displayField: 'denominacion',
            //allowBlank: false,
            triggerAction: 'all',
            emptyText: 'Seleccione...'//,
                    //tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
        });
        _this.CmbformaPropiedad = new Ext.ux.form.LovCombo({
            width: 200,
            align: 'right',
            mode: 'local',
            store: modelo.stFormapropiedad,
            valueField: 'idformapropiedad',
            displayField: 'denominacion',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            fieldLabel: 'Forma de propiedad'
                    //  tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'

        });
        _this.ObservacionAuto = new Ext.form.TextArea({
            xtype: 'textarea',
            anchor: '97%',
            fieldLabel: 'Observaciones',
            editable: true,
            height: 100,
            width: 450,
            bodyStyle: "text-align: justify"
        });

        _this.fmreporteConstructorInv = new Ext.form.FormPanel({
            width: 450,
            height: 300,
            frame: true,
            region: "center",
            border: false,
            labelAlign: 'top',
            items: [{
                    layout: 'column',
                    items: [{
                            columnWidth: .5,
                            layout: 'form',
                            items: [_this.CmbOrganismoC, /* _this.CmbConstructores,*/ _this.tfaprobadoC, _this.tfelaboradoC]
                        }, {
                            columnWidth: .5,
                            layout: 'form',
                            items: [_this.ChekCon, _this.CmbProvinciaConstructor]
                        }
                    ]
                }, {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: 1,
                            layout: 'form',
                            items: [_this.ObservacionC]
                        }
                    ]
                }
            ]
        });

        _this.fmreporteConstructorInvCons = new Ext.form.FormPanel({
            width: 450,
            height: 300,
            frame: true,
            region: "center",
            border: false,
            labelAlign: 'top',
            items: [{
                    layout: 'column',
                    items: [{
                            columnWidth: .5,
                            layout: 'form',
                            items: [_this.CmbOrganismoCC, _this.tfaprobadoCC, _this.tfelaboradoCC]
                        }, {
                            columnWidth: .5,
                            layout: 'form',
                            items: [_this.ChekCons, _this.CmbProvinciaConstructorCC, _this.CmbformaPropiedad]
                        }
                    ]
                }, {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: 1,
                            layout: 'form',
                            items: [_this.ObservacionCC]
                        }
                    ]
                }
            ]
        });
        //ventana del reporte Automotor
        _this.fmreporteAutomotor = new Ext.form.FormPanel({
            width: 680,
            height: 300,
            frame: true,
            region: "center",
            border: false,
            labelAlign: 'top',
            items: [{
                    layout: 'column',
                    items: [{
                            columnWidth: .33,
                            layout: 'form',
                            items: [_this.CmbOrganismoAuto, _this.tfaprobadoAuto]
                        }, {
                            columnWidth: .33,
                            layout: 'form',
                            items: [_this.CmbFormaEquipos, _this.tfelaboradoAuto]
                        }, {
                            columnWidth: .33,
                            layout: 'form',
                            items: [_this.Cmbcompra]
                        }
                    ]
                }, {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: 1,
                            layout: 'form',
                            items: [_this.ObservacionAuto]
                        }
                    ]
                }
            ]
        });
        _this.fmreporteAutomotorexcel = new Ext.form.FormPanel({
            width: 550,
            height: 280,
            frame: true,
            region: "center",
            border: false,
            labelAlign: 'top',
            items: [{
                    layout: 'column',
                    items: [{
                            columnWidth: .50,
                            layout: 'form',
                            items: [_this.CmbOrganismoAexcel, _this.Cmborganorector, _this.Cmbadquirirexcel]
                        }, {
                            columnWidth: .50,
                            layout: 'form',
                            items: [_this.CmbEntidadAexcel, _this.cmbFormaPropExcel, _this.Cmbcomprarexcel]
                        }/*, {
                         columnWidth: .33,
                         layout: 'form',
                         items: [ ]
                         }*/
                    ]
                }
            ]
        });

        _this.cbReporte = new Ext.form.ComboBox({
            emptyText: idioma.tlSeleccione,
            width: 300,
            store: modelo.stReporte,
            displayField: 'reporte',
            valueField: 'idreporte',
            typeAhead: true,
            mode: 'local',
            disabled: false,
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus: true,
            anchor: '95%',
            loadingText: 'Cargando...',
            resizable: true,
            listWidth: 350,
            allowBlank: false,
            tpl: '<tpl for="."><div ext:qtip="{reporte}" class="x-combo-list-item">{reporte}</div></tpl>'
        });
        _this.btnAceptarR = new Ext.Button({
            text: 'Aceptar',
            iconCls: 'aceptar',
            tooltip: 'Aceptar',
            id: 'btnAceptarR',
            disabled: false
        });
        _this.btnAceptarCosnt = new Ext.Button({
            text: 'Aceptar',
            iconCls: 'aceptar',
            tooltip: 'Aceptar',
            id: 'btnAceptarCosnt',
            disabled: false
        });
        _this.btnAceptarCosntC = new Ext.Button({
            text: 'Aceptar',
            iconCls: 'aceptar',
            tooltip: 'Aceptar',
            id: 'btnAceptarCosntC',
            disabled: false
        });
        _this.btnAceptarA = new Ext.Button({
            text: 'Aceptar',
            iconCls: 'aceptar',
            tooltip: 'Aceptar',
            id: 'btnAceptarA',
            disabled: false
        });
        _this.btnAceptarE = new Ext.Button({
            text: 'Aceptar',
            iconCls: 'aceptar',
            tooltip: 'Aceptar',
            id: 'btnAceptarE',
            disabled: false
        });
        _this.btnAplicarE = new Ext.Button({
            text: 'Aplicar',
            iconCls: 'aplicar',
            tooltip: 'Aplicar',
            id: 'btnAplicarE',
            disabled: false
        });
        _this.btnAceptarAuto = new Ext.Button({
            text: 'Aceptar',
            iconCls: 'aceptar',
            tooltip: 'Aceptar',
            id: 'btnAceptarAuto',
            disabled: false
        });
        _this.btnAceptarAutoExcel = new Ext.Button({
            text: 'Aceptar',
            iconCls: 'aceptar',
            tooltip: 'Aceptar',
            id: 'btnAceptarAuto',
            enable: true
        });


        _this.btnCancelarR = new Ext.Button({
            text: 'Cancelar',
            iconCls: 'cancelar',
            tooltip: 'Cancelar'
        });

        _this.btnCancelarConst = new Ext.Button({
            text: 'Cancelar',
            iconCls: 'cancelar',
            tooltip: 'Cancelar'
        });
        _this.btnCancelarConstC = new Ext.Button({
            text: 'Cancelar',
            iconCls: 'cancelar',
            tooltip: 'Cancelar'
        });
        _this.btnCancelarA = new Ext.Button({
            text: 'Cancelar',
            iconCls: 'cancelar',
            tooltip: 'Cancelar'
        });
        _this.btnCancelarE = new Ext.Button({
            text: 'Cancelar',
            iconCls: 'cancelar',
            tooltip: 'Cancelar'
        });
        _this.btnCancelarAuto = new Ext.Button({
            text: 'Cancelar',
            iconCls: 'cancelar',
            tooltip: 'Cancelar'
        });
        _this.btnCancelarAutoExcel = new Ext.Button({
            text: 'Cancelar',
            iconCls: 'cancelar',
            tooltip: 'Cancelar'
        });

        _this.winReportePlan = new Ext.Window({
            id: 'winConfigReporte',
            width: 470,
            height: 300, //510,
            draggable: true,
            resizable: false,
            modal: true,
            closeAction: 'hide',
            items: [_this.fmreportePlan],
            buttons: [_this.btnCancelarR, _this.btnAceptarR]
        });

        _this.winReporteResumenInv = new Ext.Window({
            id: 'winConfigRptResumenInv',
            width: 450,
            height: 300, //510,
            resizable: false,
            modal: true,
            closeAction: 'hide',
            items: [_this.fmreporteResumenInv],
            buttons: [_this.btnCancelarResumenInv, _this.btnAceptarResumenInv]
        });
        _this.btnCancelarBalanceAutomor = new Ext.Button({
            text: 'Cancelar',
            iconCls: 'cancelar',
            tooltip: 'Cancelar'
        });
        _this.btnAceptarBalanceAutomor = new Ext.Button({
            text: 'Aceptar',
            iconCls: 'aceptar',
            tooltip: 'Aceptar',
            id: 'btnAceptarR',
            disabled: false
        });
        _this.cmbOrganoS = new Ext.form.ComboBox({
            width: 200,
            align: 'right',
            allowBlank: true,
            mode: 'local',
            store: modelo.storgSatisface,
            valueField: 'idorganosatisface',
            displayField: 'denominacion',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            fieldLabel: 'Organismo rector',
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'

        });
        _this.cmbProgramasReordena = new Ext.form.ComboBox({
            width: 200,
            align: 'right',
            allowBlank: true,
            mode: 'local',
            store: modelo.stProgramaP,
            valueField: 'idprogramada',
            displayField: 'denominacion',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            fieldLabel: 'Programas de reordenamiento',
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'

        });
        _this.cmbProgramasTotalDest = new Ext.form.ComboBox({
            width: 200,
            align: 'right',
            allowBlank: true,
            mode: 'local',
            store: modelo.stProgramaP,
            valueField: 'idprogramada',
            displayField: 'denominacion',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            fieldLabel: 'Programas destinos',
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'

        });
        _this.cmbAdquirir = new Ext.form.ComboBox({
            width: 200,
            align: 'right',
            allowBlank: true,
            mode: 'remote',
            store: modelo.stAdquirirexcel,
            valueField: 'idadquisicion',
            displayField: 'denominacion',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            fieldLabel: 'Adquirir',
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
          /*  listeners: {
                expand: function(combo) {
                    modelo.stAdquirirexcel.reload();
                }
            }*/

        });

        _this.fmreporteBalanceAutomor = new Ext.form.FormPanel({
            width: 650,
            height: 200,
            //    width: 700,
            //   height: 700,
            frame: true,
            region: "center",
            border: false,
            labelAlign: 'top',
            items: [/*{
             layout: 'column',
             items: [{
             columnWidth: 0.33,
             layout: 'form',
             items: [_this.cmbAdquirir, _this.cmbProgreorden]
             }, {
             columnWidth: 0.33,
             layout: 'form',
             items: [_this.cmbProgRepos, _this.cmbOrganoS]
             }]
             }*/
                {
                    layout: 'column',
                    items: [{
                            layout: 'form',
                            columnWidth: 0.33,
                            items: [_this.cmbOrganoS, _this.cmbProgramasTotalDest]
                        }, {
                            layout: 'form',
                            columnWidth: 0.33,
                            items: [_this.cmbAdquirir, _this.cmbProgramasReordena]
                        }
                    ]
                }
            ]
        });
        _this.winReporteBalanceAutomor = new Ext.Window({
            id: 'winBalanceAutomor',
            width: 650,
            height: 200,
            // width: 700,
            //   height: 700,
            resizable: false,
            modal: true,
            closeAction: 'hide',
            items: [_this.fmreporteBalanceAutomor],
            buttons: [_this.btnCancelarBalanceAutomor, _this.btnAceptarBalanceAutomor]
        });
        _this.winReporteMaqueta = new Ext.Window({
            id: 'winConfigRptMaqueta',
            width: 600,
            height: 300, //510,
            resizable: false,
            modal: true,
            closeAction: 'hide',
            items: [_this.fmreporteMaqueta],
            buttons: [_this.btnCancelarMaqueta, _this.btnAceptarMaqueta],
            listeners: {
                beforeshow: function() {
                    modelo.stFormapropiedad.load();
                }
            }
        });

        _this.winReporteConstructorM = new Ext.Window({
            //  id: 'winReporteConstructorM',
            width: 450,
            height: 350, //510,
            resizable: false,
            modal: true,
            closeAction: 'hide',
            items: [_this.fmreporteConstructorInv],
            buttons: [_this.btnCancelarConst, _this.btnAceptarCosnt]
        });

        _this.winReporteConstructorMC = new Ext.Window({
            //  id: 'winReporteConstructorM',
            width: 450,
            height: 350, //510,
            resizable: false,
            modal: true,
            closeAction: 'hide',
            items: [_this.fmreporteConstructorInvCons],
            buttons: [_this.btnCancelarConstC, _this.btnAceptarCosntC]
        });
        _this.winReporteAcreedor = new Ext.Window({
            id: 'winConfigReporteAcreedor',
            width: 700,
            height: 350, //510,
            draggable: true,
            resizable: false,
            modal: true,
            closeAction: 'hide',
            items: [_this.fmreporteAcreedor],
            buttons: [_this.btnCancelarA, _this.btnAceptarA]
        });
        _this.winReporteEmision = new Ext.Window({
            id: 'winConfigReporteEmision',
            width: 450,
            height: 300, //510,
            draggable: true,
            resizable: false,
            modal: true,
            closeAction: 'hide',
            items: [_this.fmreporteEmision],
            buttons: [_this.btnCancelarE, _this.btnAplicarE, _this.btnAceptarE]
        });
        _this.winReporteAutomotor = new Ext.Window({
            id: 'winReporteAutomotor',
            width: 680,
            height: 300, //510,
            resizable: false,
            modal: true,
            closeAction: 'hide',
            items: [_this.fmreporteAutomotor],
            buttons: [_this.btnCancelarAuto, _this.btnAceptarAuto]
        });

        //Ventana reporte de demanda de equipos
        _this.CmbEntidadRD = new Ext.ux.form.LovCombo({
            width: 200,
            align: 'right',
            mode: 'local',
            store: modelo.stEntidad,
            valueField: 'identidad',
            displayField: 'entidad',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            fieldLabel: 'Entidad'//,
                    //tpl: '<tpl for="."><div ext:qtip="{entidad}" class="x-combo-list-item">{entidad}</div></tpl>'

        });
        _this.CmbOrganismoRD = new Ext.ux.form.LovCombo({
            xtype: 'combo',
            width: 200,
            align: 'right',
            mode: 'local',
            store: modelo.stOrganismo,
            // disabled: true,
            valueField: 'idorganismo',
            displayField: 'organismo',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            listWidth: 250,
            editable: true,
            allowBlank: false,
            enableQtip: true,
            typeAhead: true,
            fieldLabel: 'Organismo'//,
                    //tpl: '<tpl for="."><div ext:qtip="{organismo}" class="x-combo-list-item">{organismo}</div></tpl>'

        });
        _this.CmbMonedaRD = new Ext.form.ComboBox({
            width: 200,
            align: 'right',
            allowBlank: true,
            mode: 'local',
            store: modelo.stMonedaRD,
            valueField: 'idmoneda',
            displayField: 'denominacion',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            fieldLabel: idioma.tlMoneda,
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
        });

        _this.CmbNivelesRD = new Ext.form.ComboBox({
            width: 200,
            align: 'right',
            allowBlank: false,
            mode: 'local',
            store: modelo.stNiveles,
            valueField: 'idnivel',
            displayField: 'nivel',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            fieldLabel: idioma.tlNiveles,
            tpl: '<tpl for="."><div ext:qtip="{nivel}" class="x-combo-list-item">{nivel}</div></tpl>'
        });
        _this.tfaprobado = new Ext.form.TextField({
            id: 'idtfaprobado',
            width: 200,
            allowBlank: true,
            regex: /^([a-zA-ZáéíóúñüÑ�?É�?ÓÚ\-\ \:\/\,\_\-\.\d()"'.]+ ?[a-zA-ZáéíóúñüÑ�?É�?ÓÚ\-\:\/\,\_\-\.\d()"'.]*)+$/,
            maskRe: /^([a-zA-ZáéíóúñüÑ�?É�?ÓÚ\-\ \:\/\,\_\-\.\d()"'.]+ ?[a-zA-ZáéíóúñüÑ�?É�?ÓÚ\-\:\/\,\_\-\.\d()"'.]*)+$/,
            regexText: idioma.tlLetras,
            fieldLabel: idioma.tlAprobado
        });
        _this.tfelaborado = new Ext.form.TextField({
            id: 'idtfelaborado',
            width: 200,
            allowBlank: true,
            regex: /^([a-zA-ZáéíóúñüÑ�?É�?ÓÚ\-\ \:\/\,\_\-\.\d()"'.]+ ?[a-zA-ZáéíóúñüÑ�?É�?ÓÚ\-\:\/\,\_\-\.\d()"'.]*)+$/,
            maskRe: /^([a-zA-ZáéíóúñüÑ�?É�?ÓÚ\-\ \:\/\,\_\-\.\d()"'.]+ ?[a-zA-ZáéíóúñüÑ�?É�?ÓÚ\-\:\/\,\_\-\.\d()"'.]*)+$/,
            regexText: idioma.tlLetras,
            fieldLabel: idioma.tlElaborado
        });

        _this.taObservaciones = new Ext.form.TextArea({
            id: 'idtaObservaciones',
            width: 600,
            regex: /^([a-zA-ZáéíóúñüÑ�?É�?ÓÚ\-\ \:\/\,\_\-\.\d()"'.]+ ?[a-zA-ZáéíóúñüÑ�?É�?ÓÚ\-\:\/\,\_\-\.\d()"'.]*)+$/,
            maskRe: /^([a-zA-ZáéíóúñüÑ�?É�?ÓÚ\-\ \:\/\,\_\-\.\d()"'.]+ ?[a-zA-ZáéíóúñüÑ�?É�?ÓÚ\-\:\/\,\_\-\.\d()"'.]*)+$/,
            regexText: idioma.tlLetras,
            align: 'right',
            fieldLabel: idioma.tlObservaciones
        });
        _this.Chkdemanda = new Ext.form.Checkbox({
            align: 'left',
            //allowBlank: false,
            hideLabel: true,
            //anchor: '100%',
            fieldLabel: 'Total Organismo',
            boxLabel: 'Total Organismo',
            disabled: false
        });

        _this.fmreporteDemandaE = new Ext.form.FormPanel({
            autoWidth: true,
            autoHeight: true,
            frame: true,
            border: false,
            labelAlign: 'top',
            items: [{
                    layout: 'column',
                    items: [{
                            columnWidth: 0.33,
                            layout: 'form'
                        }, {
                            columnWidth: 0.33,
                            layout: 'form'
                        }, {
                            columnWidth: 0.33,
                            layout: 'form',
                            items: [_this.Chkdemanda]
                        }]
                }, {
                    layout: 'column',
                    items: [{
                            columnWidth: 0.33,
                            layout: 'form',
                            items: [_this.CmbOrganismoRD, _this.CmbNivelesRD]
                        }, {
                            columnWidth: 0.33,
                            layout: 'form',
                            items: [_this.CmbEntidadRD, _this.tfelaborado]
                        }, {
                            columnWidth: 0.33,
                            layout: 'form',
                            items: [_this.CmbMonedaRD, _this.tfaprobado]
                        }]
                }, {
                    layout: 'column',
                    items: [
                        {
                            columnWidth: 0.99,
                            layout: 'form',
                            items: [_this.taObservaciones]
                        }
                    ]
                }
            ]
        });

        _this.btnAceptarRD = new Ext.Button({
            text: 'Aceptar',
            iconCls: 'aceptar',
            tooltip: 'Aceptar',
            disabled: false
        });
        _this.btnAceptarRDnew = new Ext.Button({
            text: 'A',
            iconCls: 'aceptar',
            tooltip: 'a',
            disabled: false
        });

        _this.btnCancelarRD = new Ext.Button({
            text: 'Cancelar',
            iconCls: 'cancelar',
            tooltip: 'Cancelar'
        });

        _this.winReporteDemandaEquipos = new Ext.Window({
            //id: 'winReporteDemandaEquipos',
            title: 'Reporte Demanda de Equipos',
            width: 640,
            height: 280, //510,
            draggable: true,
            resizable: false,
            modal: true,
            closeAction: 'hide',
            items: [_this.fmreporteDemandaE],
            buttons: [_this.btnCancelarRD, _this.btnAceptarRD]
        });



        _this.tpPlanInversion = new Ext.tree.TreePanel({
            title: idioma.tlOrganismos,
            border: true,
            region: 'west',
            split: true,
            width: 175,
            height: 300,
            collapsible: true,
            rootVisible: false,
            autoScroll: true,
            loader: modelo.loaderTreeinversiones,
            tbar: [{
                    iconCls: 'icon-expand-all',
                    tooltip: idioma.tlExpandir,
                    icon: perfil.dirImg + 'expand-all.gif',
                    handler: function() {
                        Gestionar.planinversiones.Vista.tpPlanInversion.root.expand(true);
                    }
                }, {
                    iconCls: 'icon-collapse-all',
                    tooltip: 'Colapsar',
                    icon: perfil.dirImg + 'collapse-all.gif',
                    handler: function() {
                        Gestionar.planinversiones.Vista.tpPlanInversion.root.collapse(true);
                    }
                }, {
                    iconCls: 'icon-collapse-all',
                    tooltip: 'Refrescar todas las entidades',
                    icon: perfil.dirImg + 'table_refresh.png',
                    handler: function() {
                        Gestionar.planinversiones.Vista.tpPlanInversion.root.reload();
                    }
                }, '-', {
                    xtype: 'textfield',
                    emptyText: idioma.tlFilentidad,
                    width: 90,
                    id: 'idfiltroent'
                }
            ],
            root: {
                text: 'Estructuras',
                expanded: true,
                id: '0'
            },
            listeners: {
                click: function(n) {
                    Ext.getCmp('btnModificarPlaninversion').disable();
                    Ext.getCmp('btnVerDetalles').disable();
                    Ext.getCmp('btnVerCuadre').disable();
                    Ext.getCmp('btnVerFinaciamiento').disable();
                }

            }
        });

//Elementos de inversion
        _this.smInversiones = new Ext.grid.RowSelectionModel({
            singleSelect: false,
            listeners: {
                rowselect: function(sm, fila, record) {
                    if (sm.getSelections().length == 1) {
                        Ext.getCmp('btnModificarPlaninversion').enable();
                        Ext.getCmp('btnVerDetalles').enable();
                        Ext.getCmp('btnVerCuadre').enable();
                        Ext.getCmp('btnVerFinaciamiento').enable();
                        /*if(sm.getSelected().data.equipos == 1){
                         Ext.getCmp('tabEquipo').expand(true);                            
                         modelo.stEquipos.reload();
                         }else{
                         Ext.getCmp('tabEquipo').collapse(true);
                         modelo.stEquipos.reload();
                         }*/
                    } else {
                        Ext.getCmp('btnModificarPlaninversion').disable();
                        Ext.getCmp('btnVerDetalles').disable();
                        Ext.getCmp('btnVerCuadre').disable();
                        Ext.getCmp('btnVerFinaciamiento').disable();
                    }
                }, rowdeselect: function(sm, fila, record) {
                    if (sm.getSelections().length == 1) {
                        Ext.getCmp('btnModificarPlaninversion').enable();
                        Ext.getCmp('btnVerDetalles').enable();
                        Ext.getCmp('btnVerCuadre').enable();
                        Ext.getCmp('btnVerFinaciamiento').enable();
                        if (sm.getSelected().data.equipos == 1) {
                            Ext.getCmp('tabEquipo').expand(true);
                            modelo.stEquipos.reload();

                        } else {
                            Ext.getCmp('tabEquipo').collapse(true);
                            modelo.stEquipos.reload();

                        }
                    } else {
                        Ext.getCmp('btnModificarPlaninversion').disable();
                        Ext.getCmp('btnVerDetalles').disable();
                        Ext.getCmp('btnVerCuadre').disable();
                        Ext.getCmp('btnVerFinaciamiento').disable();
                    }
                }
            }
        });

        _this.cmInversiones = new Ext.grid.ColumnModel([{
                header: idioma.tlcodigo,
                id: 'codigo',
                width: 100,
                sortable: true,
                dataIndex: 'codigo'
            }, {
                header: idioma.tlDenom,
                id: 'cdenominacion',
                width: 200,
                sortable: true,
                dataIndex: 'denominacion'
            }, {
                header: idioma.tlClasif,
                width: 200,
                sortable: true,
                dataIndex: 'clasificacion'
            }, {
                header: idioma.tlTipInvProg,
                width: 200,
                sortable: true,
                dataIndex: 'tipoinv'
            }, {
                header: idioma.tlProg,
                width: 200,
                tooltip: idioma.tlProg,
                sortable: true,
                dataIndex: 'programa'
            }, {
                header: idioma.tlCaract,
                width: 200,
                sortable: true,
                dataIndex: 'caracteristicas'
            }, {
                id: 'formaPropiedad',
                header: idioma.tlFormProp,
                width: 200,
                sortable: true,
                dataIndex: 'forma'
            }, {
                header: idioma.tlProv,
                width: 85,
                sortable: true,
                hidden: true,
                dataIndex: 'provincia'
            }, {
                header: idioma.tlFechaIn,
                width: 85,
                sortable: true,
                hidden: true,
                dataIndex: 'fechainicio'
            }, {
                header: idioma.tlFechaFi,
                width: 85,
                sortable: true,
                hidden: true,
                dataIndex: 'fechafin'
            }, {
                header: idioma.tlObjet,
                width: 85,
                sortable: true,
                hidden: true,
                dataIndex: 'objetivo'
            }, {
                header: idioma.tlEfecCe,
                width: 85,
                sortable: true,
                hidden: true,
                dataIndex: 'efecto'
            }, {
                header: 'V&iacute;a r&aacute;pida',
                width: 85,
                sortable: true,
                hidden: true,
                dataIndex: 'fasttrack',
                renderer: fnSiNo
            }, /* {
             header: idioma.tlPresEf,
             width: 85,
             sortable: true,
             hidden: true,
             dataIndex: 'presupuestoef'
             }, {
             header: idioma.tlFinancEf,
             width: 85,
             sortable: true,
             hidden: true,
             dataIndex: 'financiamientoef'
             }, */{
                header: idioma.tlDoc,
                width: 85,
                sortable: true,
                hidden: true,
                dataIndex: 'documento',
                renderer: fnSiNo
            }, {
                header: idioma.tlFinancista,
                width: 85,
                sortable: true,
                hidden: true,
                dataIndex: 'financista'
            }, {
                header: idioma.tlTipFinanc,
                width: 85,
                sortable: true,
                hidden: true,
                dataIndex: 'tipofinanciamiento'
            }, /*{
             header: idioma.tlCons,
             width: 85,
             sortable: true,
             hidden: true,
             dataIndex: 'constructor'
             }, */{
                header: idioma.tlEquipos,
                width: 85,
                sortable: true,
                hidden: true,
                dataIndex: 'equipos',
                renderer: fnSiNo
            }, {
                header: idioma.tlPlan,
                width: 85,
                sortable: true,
                hidden: true,
                dataIndex: 'plan'
            }, {
                header: "Cuadrada",
                width: 85,
                sortable: true,
                hidden: false,
                dataIndex: 'cuadrada',
                renderer: fnSiNo
            }
        ]);

        _this.filtrosinv = new Ext.grid.GridFilters({
            filters: [
                {
                    type: 'string',
                    dataIndex: 'codigo',
                    xtype: 'numberfield',
                    idTextField: 'filtrocodigo',
                    anchor: '95%',
                    fieldLabel: '',
                    disabled: false,
                    maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                    maskReregex: /^([0-9.]+ ?[0-9.]*)+$/
                }, {
                    type: 'string',
                    dataIndex: 'denominacion'
                }, {
                    type: 'string',
                    dataIndex: 'tipofinanciamiento'
                }, {
                    type: 'string',
                    dataIndex: 'financista'
                }, {
                    dataIndex: 'tipoinv',
                    type: 'listado',
                    idcombo: 'filtrotInv',
                    urlcb: 'listarComboTipoInversion',
                    idstore: 'idtipoinversion',
                    valueFieldcb: 'idtipoinversionprograma',
                    displayFieldcb: 'denominacion',
                    tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
                }, {
                    dataIndex: 'clasificacion',
                    type: 'listado',
                    idcombo: 'idclasificacion',
                    urlcb: 'listarComboClasificacion',
                    idstore: 'stidclasificacion',
                    valueFieldcb: 'idtipoinversion',
                    displayFieldcb: 'denominacion',
                    tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
                }, {
                    dataIndex: 'programa',
                    type: 'listado',
                    idcombo: 'filtrotProg',
                    urlcb: 'listarComboProgramada',
                    idstore: 'idprogramada',
                    valueFieldcb: 'idprogramada',
                    displayFieldcb: 'denominacion',
                    tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
                }, {
                    dataIndex: 'caracteristicas',
                    type: 'listado',
                    idcombo: 'filtrotInv',
                    urlcb: 'listarComboCaracteristica',
                    idstore: 'idcaracteristica',
                    valueFieldcb: 'idcaracteristica',
                    displayFieldcb: 'denominacion',
                    tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
                }, {
                    dataIndex: 'forma',
                    type: 'listado',
                    idcombo: 'idformapropiedad',
                    urlcb: 'listarComboFormaPropiedad',
                    idstore: 'stidformapropiedad',
                    valueFieldcb: 'idformapropiedad',
                    displayFieldcb: 'denominacion',
                    tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
                }, {
                    dataIndex: 'provincia',
                    type: 'listado',
                    idcombo: 'idprovincia',
                    urlcb: 'listarProvincias',
                    idstore: 'stidprovincia',
                    valueFieldcb: 'idprovincia',
                    displayFieldcb: 'provincia',
                    tpl: '<tpl for="."><div ext:qtip="{provincia}" class="x-combo-list-item">{provincia}</div></tpl>'
                }, {
                    type: 'date',
                    dateFormat: 'Y-m-d',
                    dataIndex: 'fechainicio'
                }, {
                    type: 'date',
                    dateFormat: 'Y-m-d',
                    dataIndex: 'fechafin'
                }, {
                    dataIndex: 'objetivo',
                    type: 'listado',
                    idcombo: 'idobjetivo',
                    urlcb: 'listarComboObjetivo',
                    idstore: 'stidobjetivo',
                    valueFieldcb: 'idobjetivo',
                    displayFieldcb: 'denominacion',
                    tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
                }, {
                    dataIndex: 'efecto',
                    type: 'listado',
                    idcombo: 'filtrotInv',
                    urlcb: 'listarComboEfecto',
                    idstore: 'stidefectocomercial',
                    valueFieldcb: 'idefectocomercial',
                    displayFieldcb: 'denominacion',
                    tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
                }, /*{
                 type: 'list',
                 dataIndex: 'idestadoinversion',
                 options: ['SI', 'NO']
                 }, {
                 type: 'list',
                 dataIndex: 'idestadoaprobacion',
                 options: ['SI', 'NO']
                 }, */{
                    type: 'list',
                    dataIndex: 'fasttrack',
                    options: ['Si', 'No']
                }, {
                    type: 'list',
                    dataIndex: 'equipos',
                    options: ['Si', 'No']
                }, {
                    type: 'list',
                    dataIndex: 'documento',
                    options: ['Si', 'No']
                }, {
                    type: 'list',
                    dataIndex: 'plan',
                    options: ['Resto de inversiones', 'Plan Mep', 'Plan B']
                }, {
                    type: 'list',
                    dataIndex: 'cuadrada',
                    options: ['Si', 'No']
                }
            ]
        });

        _this.btnLimpiarInversiones = new Ext.Button({
            text: idioma.btnLimpiar,
            tooltip: idioma.toolTipLimpiar,
            iconCls: 'limpiar'
        });

        _this.gpInversiones = new Ext.grid.GridPanel({
            frame: true,
            id: 'gpInversiones',
            title: idioma.tlInversiones,
            iconCls: 'icon-grid',
            region: 'center',
            autoWidth: true,
            autoScroll: true,
            autoExpandColumn: 'cdenominacion',
            store: modelo.stIinversiones,
            loadMask: {store: modelo.stIinversiones},
            plugins: _this.filtrosinv,
            sm: _this.smInversiones,
            cm: _this.cmInversiones,
            tbar: [_this.btnModificarPlaninversion, _this.btnVerDetalles, _this.btnVerCuadre, _this.btnVerFinaciamiento,
                _this.btndesgloses, /*_this.btnGraficoInversion,*/ _this.ChConsolidarr, '', _this.ChVigente],
            bbar: new Ext.PagingToolbar({
                pageSize: 20,
                id: 'ptformato',
                store: modelo.stIinversiones,
                displayInfo: true,
                items: ['-', _this.btnLimpiarInversiones]
            })
                    /*[new Ext.PagingToolbar({
                     pageSize: 20,
                     store: modelo.stIinversiones,
                     displayInfo: true,
                     width: 600,
                     displayMsg: idioma.msgResults,
                     emptyMsg: idioma.msgNoResults
                     }), '-', _this.btnLimpiarInversiones]**/
        });

//Elementos de equipos....
        _this.filtrosEquipos = new Ext.grid.GridFilters({
            filters: [
                {
                    type: 'string',
                    dataIndex: 'denominacion'
                }, {
                    type: 'string',
                    dataIndex: 'codigo',
                    xtype: 'numberfield',
                    anchor: '95%',
                    fieldLabel: '',
                    disabled: false,
                    maskRe: /^([0-9.]+ ?[0-9.]*)+$/,
                    maskReregex: /^([0-9.]+ ?[0-9.]*)+$/
                }, {
                    type: 'string',
                    dataIndex: 'descripcion'
                }, {
                    type: 'string',
                    dataIndex: 'orgrect'
                }, {
                    type: 'string',
                    dataIndex: 'viaadq'
                }, {
                    type: 'numeric',
                    dataIndex: 'cantidad'
                }, {
                    type: 'numeric',
                    dataIndex: 'precio'
                }, {
                    type: 'numeric',
                    dataIndex: 'preciodivisa'
                }, {
                    type: 'numeric',
                    dataIndex: 'importe'
                }, {
                    type: 'numeric',
                    dataIndex: 'importedivisa'
                }, {
                    dataIndex: 'adquirir',
                    type: 'listado',
                    idcombo: 'filtrot',
                    urlcb: '/planificacion/planmeta/index.php/inversiones/listarComboAdquisicion',
                    idstore: 'idadquisicion',
                    valueFieldcb: 'idadquisicion',
                    displayFieldcb: 'denominacion',
                    tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
                }, {
                    dataIndex: 'comprar',
                    type: 'listado',
                    idcombo: 'filtroc',
                    urlcb: '/planificacion/planmeta/index.php/inversiones/listarComboComprar',
                    idstore: 'idcomprar',
                    valueFieldcb: 'idcomprar',
                    displayFieldcb: 'denominacion',
                    tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>'
                }

            ]
        });

        _this.smEquipos = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });

        _this.cmEquipos = new Ext.grid.ColumnModel([{
                header: idioma.tlcodigo,
                width: 100,
                dataIndex: 'codigo',
                sortable: true
            }, {
                header: idioma.tlDenom,
                width: 200,
                sortable: true,
                dataIndex: 'denominacion'
            }, {
                header: idioma.tlDescrip,
                width: 200,
                sortable: true,
                dataIndex: 'descripcion'
            }, {
                header: idioma.tlViaadq,
                width: 200,
                sortable: true,
                //hidden: true,
                dataIndex: 'viaadq'
            }, {
                header: idioma.tlOrgrect,
                width: 200,
                sortable: true,
                //hidden: true,
                dataIndex: 'orgrect'
            }, {
                header: idioma.tlAdquirir,
                width: 200,
                sortable: true,
                //hidden: true,
                dataIndex: 'adquirir',
                // renderer: cambiarvalor
            }, /*{
             header: idioma.tlConcepto,
             width: 200,
             sortable: true,
             hidden: true,
             dataIndex: 'concepto'
             }, */{
                header: idioma.tlDonacion,
                width: 200,
                sortable: true,
                //hidden: true,
                dataIndex: 'comprar',
                //  renderer: cambiarvalor
            }, {
                header: idioma.tlCantidad,
                width: 200,
                sortable: true,
                hidden: true,
                dataIndex: 'cantidad'
            }, {
                header: idioma.tlPrecio,
                width: 200,
                sortable: true,
                hidden: true,
                dataIndex: 'precio'
            }, {
                header: idioma.tlImporte,
                width: 200,
                sortable: true,
                hidden: true,
                dataIndex: 'importe'
            }, {
                header: idioma.tlPrecioDivisa,
                width: 200,
                sortable: true,
                hidden: true,
                dataIndex: 'preciodivisa'
            }, {
                header: idioma.tlImporteDivisa,
                width: 200,
                sortable: true,
                hidden: true,
                dataIndex: 'importedivisa'
            }
        ]);

        function cambiarvalor(val) {
            if (val == 1) {
                return 'Si';
            }
            return 'No';
        }

        _this.btnEliEquipos = new Ext.Button({
            text: idioma.btnEliminar,
            tooltip: idioma.tooElimEquipo,
            iconCls: 'eliminar',
            disabled: true
        });

        _this.btnLimpiarEquipo = new Ext.Button({
            text: idioma.btnLimpiar,
            tooltip: idioma.toolTipLimpiar,
            iconCls: 'limpiar'
        });

        _this.gpEquipo = new Ext.grid.GridPanel({
            frame: true,
            title: idioma.tlEquipos,
            border: false,
            region: 'center',
            plugins: _this.filtrosEquipos,
            height: 265,
            width: 100,
            autoWidth: true,
            store: modelo.stEquipos,
            loadMask: {store: modelo.stEquipos},
            sm: _this.smEquipos,
            cm: _this.cmEquipos,
            tbar: [_this.btnEliEquipos],
            bbar: new Ext.PagingToolbar({
                pageSize: 10,
                id: 'equipos',
                store: modelo.stEquipos,
                displayInfo: true,
                items: ['-', _this.btnLimpiarEquipo]
            })
        });

        //Elementos de Ejecucion ....
        _this.btnGuardarEjecucion = new Ext.Button({
            text: idioma.btnGuardar,
            tooltip: idioma.tooGuarEquipo,
            iconCls: 'guardar'
                    //disabled: true
        });
        _this.tfejecutadototal = new Ext.form.TextField({
            xtype: 'textfield',
            id: 'idtfejecutadototal',
            width: 160,
            regex: /^([0-9.]+ ?[0-9.]*)+$/,
            maskRe: /^([0-9.])$/,
            regexText: idioma.tlAlfanume,
            align: 'right',
            //allowBlank: false,
            //anchor: '100%',
            fieldLabel: idioma.tlejecutadototal
        });
        _this.tfplan = new Ext.form.TextField({
            xtype: 'textfield',
            id: 'idtfplan',
            width: 160,
            regex: /^([0-9.]+ ?[0-9.]*)+$/,
            maskRe: /^([0-9.])$/,
            regexText: idioma.tlAlfanume,
            align: 'right',
            allowBlank: false,
            //anchor: '100%',
            fieldLabel: idioma.tlplan
        });
        _this.tfestimado = new Ext.form.TextField({
            xtype: 'textfield',
            id: 'idtfestimado',
            width: 160,
            regex: /^([0-9.]+ ?[0-9.]*)+$/,
            maskRe: /^([0-9.])$/,
            regexText: idioma.tlAlfanume,
            align: 'right',
            allowBlank: false,
            //anchor: '100%',
            fieldLabel: idioma.tlestimado
        });
        _this.tfreal = new Ext.form.TextField({
            xtype: 'textfield',
            id: 'idtfreal',
            width: 160,
            regex: /^([0-9.]+ ?[0-9.]*)+$/,
            maskRe: /^([0-9.])$/,
            regexText: idioma.tlAlfanume,
            align: 'right',
            allowBlank: false,
            //anchor: '100%',
            fieldLabel: idioma.tlreal
        });

        _this.CmbEje = new Ext.form.ComboBox({
            emptyText: idioma.tlSeleccione,
            width: 165,
            id: 'ideje',
            store: modelo.stCbejercicio,
            displayField: 'ejercicio',
            valueField: 'idejercicio',
            typeAhead: true,
            mode: 'local',
            disabled: false,
            forceSelection: true,
            triggerAction: 'all',
            selectOnFocus: true,
            anchor: '95%',
            loadingText: 'Cargando...',
            allowBlank: false
        });

        _this.fmEjecucion = new Ext.form.FormPanel({
            height: 250,
            width: 90,
            region: 'center',
            frame: true,
            border: false,
            labelAlign: 'left',
            items: [_this.tfejecutadototal, _this.tfplan, _this.tfestimado, _this.tfreal]
        });

        _this.pEjecucion = new Ext.Panel({
            frame: true,
            title: idioma.tlEjecucion,
            layout: 'border',
            region: 'center',
            height: 265,
            width: 100,
            border: false,
            tbar: [_this.btnGuardarEjecucion, '-', 'Ejercicio:', _this.CmbEje],
            items: [_this.fmEjecucion]
        });

        _this.tabEquipo = new Ext.TabPanel({
            id: 'tabEquipo',
            activeTab: 0,
            region: 'south',
            collapsible: true,
            collapsed: true,
            items: [_this.gpEquipo/*, _this.pEjecucion*/]
        });

        _this.pContenido = new Ext.Panel({
            frame: true,
            layout: 'border',
            region: 'center',
            //height: 200,
            width: 200,
            border: false,
            items: [_this.gpInversiones, _this.tabEquipo]
        });

        _this.pGeneral = new Ext.Panel({
            layout: 'border',
            border: false,
            width: 200,
            tbar: ['Reportes:', _this.cbReporte, ' ', 'Ejercicio:', _this.cmbEjercicio, '->', _this.btnAyudaPlaninversion],
            items: [_this.tpPlanInversion, _this.pContenido]
        });

        //Ventana que sale luego dar clic en el texfield Provincia
        _this.rootNodoDpt = {
            text: 'Cuba',
            id: 0
        }
        _this.ventanaDpt = new Ext.secodena.comun.window.winSelectDPA({
            rootNodo: _this.rootNodoDpt,
            sinTitulo: true,
            selPais: true,
            id: 'winDPAPersona'
        });

        _this.tfdenominacion = new Ext.form.TextField({
            xtype: 'textfield',
            id: 'idtfdenominacion',
            width: 160,
            //   regex: /^([a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]* ?[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]*[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ]* ?[a-zA-Z0-9áéíóú�?É�?ÓÚñÑ])+$/,
            // maskRe: /^([a-z A-Z0-9áéíóú�?É�?ÓÚñÑ])$/,
            regexText: idioma.tlAlfanume,
            align: 'right',
            allowBlank: false,
            //anchor: '100%',
            fieldLabel: idioma.tlDenom
        });

        _this.CmbFormaDePropiedad = new Ext.form.ComboBox({
            //id: 'idCmbFormaDePropiedadPlan',
            width: 160,
            align: 'right',
            allowBlank: false,
            mode: 'local',
            store: modelo.stFormapropiedad,
            valueField: 'idformapropiedad',
            displayField: 'denominacion',
            emptyText: 'Seleccione...',
            fieldLabel: 'Forma de propiedad',
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            listeners: {
                expand: function(combo) {
                    modelo.stFormapropiedad.reload();
                }
            }
        });

        _this.CmbObjetivo = new Ext.form.ComboBox({
            id: 'idCmbObjetivo',
            width: 160,
            align: 'right',
            mode: 'local',
            store: modelo.stObjetivo,
            valueField: 'idobjetivo',
            displayField: 'denominacion',
            allowBlank: false,
            emptyText: idioma.tlSeleccione,
            fieldLabel: idioma.tlObjet,
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            listeners: {
                expand: function(combo) {
                    modelo.stObjetivo.reload();
                }
            }
        });

        _this.CmbDesempenno = new Ext.form.ComboBox({
            id: 'idCmbDesempenno',
            width: 160,
            align: 'right',
            mode: 'local',
            allowBlank: false,
            store: modelo.stDesempenno,
            valueField: 'iddatdesempenno',
            displayField: 'denominacion',
            triggerAction: 'all',
            //forceSelection: true,
            //anchor: '100%',
            emptyText: idioma.tlSeleccione,
            fieldLabel: 'Desempe&ntilde;o',
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            listeners: {
                expand: function(combo) {
                    modelo.stDesempenno.reload();
                }
            }
        });

        _this.cmbClasificacion = new Ext.form.ComboBox({
            id: 'idcmbClasificacion',
            width: 160,
            align: 'right',
            hiddenName: 'idtipoinversion',
            valueField: 'idtipoinversion',
            displayField: 'denominacion',
            store: modelo.stClasificacion,
            allowBlank: false,
            mode: 'local',
            typeAhead: true,
            selectOnFocus: false,
            //anchor: '100%',
            emptyText: idioma.tlSeleccione,
            fieldLabel: idioma.tlClasif,
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            listeners: {
                expand: function(combo) {
                    modelo.stClasificacion.reload();
                }
            }
        });

        _this.tfProvincia = new Ext.form.TextField({
            xtype: 'textfield',
            id: 'idtfProvincia',
            width: 160,
            align: 'right',
            allowBlank: false,
            editable: false,
            readOnly: true,
            //anchor: '100%',
            fieldLabel: idioma.tlProv
        });

        _this.CmbEfectoEnComercio = new Ext.form.ComboBox({
            id: 'idCmbEfectoEnComercio',
            width: 160,
            align: 'right',
            mode: 'local',
            allowBlank: false,
            store: modelo.stEfecto,
            valueField: 'idefectocomercial',
            displayField: 'denominacion',
            //forceSelection: true,
            //anchor: '100%',
            emptyText: idioma.tlSeleccione,
            fieldLabel: idioma.tlComercioext,
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            listeners: {
                expand: function(combo) {
                    modelo.stEfecto.reload();
                }
            }
        });


        _this.CmbTipoInversion = new Ext.form.ComboBox({
            id: 'idCmbTipoInversion',
            width: 160,
            align: 'right',
            allowBlank: false,
            store: modelo.stTipoInversion,
            valueField: 'idtipoinversionprograma',
            displayField: 'denominacion',
            mode: 'local',
            emptyText: idioma.tlSeleccione,
            fieldLabel: "Tipo de inversi&oacute;n",
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            listeners: {
                expand: function(combo) {
                    modelo.stTipoInversion.reload();
                }
            }
        });

        _this.tfFechaInicio = new Ext.form.DateField({
            id: 'idFechaInicioP',
            width: 160,
            align: 'right',
            allowBlank: false,
            readOnly: true,
            // vtype: 'rangodefechas',
            endDateField: 'idFechaFinP',
            //startDateField:'idFechaFinP',
            //anchor: '100%',
            fieldLabel: idioma.tlFechaIn,
            format: 'd/m/Y'

        });

        _this.CmbEstado = new Ext.form.ComboBox({
            id: 'idCmbEstado',
            width: 160,
            align: 'right',
            mode: 'local',
            allowBlank: false,
            store: modelo.stEstado,
            valueField: 'idestado',
            displayField: 'denominacion',
            //forceSelection: true,
            //anchor: '100%',
            emptyText: idioma.tlSeleccione,
            fieldLabel: 'Estado', //idioma.tlComercioext,
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            listeners: {
                expand: function(combo) {
                    modelo.stEstado.reload();
                }
            }
        });

        _this.ChkFastTrack = new Ext.form.Checkbox({
            id: 'idFasttrack',
            width: 160,
            align: 'right',
            //allowBlank: false,
            hideLabel: true,
            //anchor: '100%',
            fieldLabel: idioma.tlFasttrack,
            boxLabel: 'V&iacute;a r&aacute;pida',
            disabled: false
                    /*listeners: {
                     render: function(ch, chequeado) {
                     if (cheque== 1) {                     
                     ch.setValue(true);
                     }
                     }
                     }*/
        });

        _this.CmbCaracteristica = new Ext.form.ComboBox({
            id: 'idCmbCaracteristica',
            width: 160,
            align: 'right',
            allowBlank: true,
            store: modelo.stCaracteristica,
            valueField: 'idcaracteristica',
            displayField: 'denominacion',
            // forceSelection: true,
            typeAhead: true,
            mode: 'local',
            emptyText: idioma.tlSeleccione,
            fieldLabel: idioma.tlCaract,
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            listeners: {
                expand: function(combo) {
                    modelo.stCaracteristica.reload();
                }
            }
        });
        _this.cmbMedioAmbiente = new Ext.form.ComboBox({
            id: 'idcmbMedioAmbiente',
            width: 160,
            align: 'right',
            allowBlank: true,
            store: modelo.stMedioAmbiente,
            valueField: 'idmedioambiente',
            displayField: 'denominacion',
            // forceSelection: true,
            typeAhead: true,
            mode: 'local',
            emptyText: idioma.tlSeleccione,
            fieldLabel: idioma.tlMedioAmbiente,
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            listeners: {
                expand: function(combo) {
                    modelo.stMedioAmbiente.reload();
                }
            }
        });

        _this.tfFechaFin = new Ext.form.DateField({
            id: 'idFechaFinP',
            width: 160,
            align: 'right',
            allowBlank: false,
            readOnly: true,
            startDateField: 'idFechaInicioP',
            fieldLabel: idioma.tlFechaFi,
            format: 'd/m/Y'
        });

        _this.tfAnalisis = new Ext.form.TextField({
            width: 160,
            align: 'right',
            allowBlank: false,
            fieldLabel: 'An&aacute;lisis post-inversi&oacute;n'//idioma.tlProv
        });
        _this.CmbProgramadaP = new Ext.form.ComboBox({
            width: 160,
            align: 'right',
            allowBlank: false,
            store: modelo.stProgramaP,
            valueField: 'idprogramada',
            displayField: 'denominacion',
            mode: 'local',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            fieldLabel: 'Programa',
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            listeners: {
                expand: function(combo) {
                    modelo.stProgramaP.reload();
                }
            }
        });

        _this.Observacion = new Ext.form.TextArea({
            xtype: 'textarea',
            id: 'idobservacionplan',
            anchor: '97%',
            fieldLabel: 'Observaciones',
            editable: true,
            height: 100,
            width: 450,
            style: 'margin-left:0px;margin-top:5.5px'
        });


        _this.fmAdicionarInversion = new Ext.form.FormPanel({
            width: 800,
            height: 220,
            region: 'north',
            frame: true,
            border: false,
            labelAlign: 'top',
            items: [{
                    layout: 'column',
                    items: [{
                            columnWidth: .25,
                            layout: 'form',
                            items: [_this.tfdenominacion, _this.CmbFormaDePropiedad, _this.CmbObjetivo, _this.CmbProgramadaP]
                        }, {
                            columnWidth: .25,
                            layout: 'form',
                            items: [_this.cmbClasificacion, _this.tfProvincia, _this.CmbEfectoEnComercio, _this.tfAnalisis]
                        }, {
                            columnWidth: .25,
                            layout: 'form',
                            items: [_this.CmbTipoInversion, _this.tfFechaInicio, _this.CmbDesempenno, _this.ChkFastTrack]
                        }, {
                            columnWidth: .25,
                            layout: 'form',
                            items: [_this.CmbCaracteristica, _this.tfFechaFin, _this.cmbMedioAmbiente]
                        }
                    ]
                }, _this.Observacion
            ]
        });

        _this.sm_presupuesto = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        _this.btnAdicionarPresupuesto = new Ext.Button({
            disabled: false,
            id: 'btnAdicionarPresupuesto',
            icon: perfil.dirImg + 'adicionar.png',
            iconCls: 'btn',
            tooltip: idioma.btnAdd,
            text: idioma.btnAdd
        });

        _this.btnEliminar = new Ext.Button({
            disabled: false,
            id: 'btnEliminar',
            icon: perfil.dirImg + 'eliminar.png',
            iconCls: 'btn',
            tooltip: idioma.btnEliminar,
            text: idioma.btnEliminar
        });
        _this.btnLimpiarPresupuesto = new Ext.Button({
            // text: idioma.btnLimpiar,
            tooltip: 'Limpiar',
            iconCls: 'limpiar'

        });

        _this.filtrosPresupuesto = new Ext.grid.GridFilters({
            filters: [{
                    type: 'numeric',
                    dataIndex: 'valor'
                }, {
                    type: 'listado',
                    dataIndex: 'moneda',
                    idcombo: 'idmoneda',
                    urlcb: '/planificacion/planmeta/index.php/inversiones/listarMoneda',
                    idstore: 'idmoneda',
                    valueFieldcb: 'idmoneda',
                    displayFieldcb: 'denominacion'
                }]
        });

        _this.grid_PresupuestoP = new Ext.grid.EditorGridPanel({
            title: 'Plan de preparaci&oacute;n',
            frame: true,
            height: 150,
            //width: 800,
            plugins: _this.filtrosPresupuesto,
            region: 'north',
            sm: _this.sm_presupuesto,
            store: modelo.stPresupuesto,
            tbar: [_this.btnAdicionarPresupuesto, _this.btnEliminar],
            columns: [{
                    header: idioma.tlValor,
                    dataIndex: 'valor',
                    width: 400,
                    // id: 'grid_Presupuesto',
                    sortable: true,
                    editor: new Ext.form.NumberField({
                        disabledClass: 'disabled-component',
                        selectOnFocus: true,
                        allowBlank: false,
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([1-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    })
                }, {
                    header: idioma.tlmoneda,
                    dataIndex: 'moneda',
                    width: 400,
                    sortable: true,
                    renderer: rendeMoneda,
                    editor: new Ext.form.ComboBox({
                        id: 'idmoneda',
                        mode: 'local',
                        triggerAction: 'all',
                        allowBlank: false,
                        emptyText: idioma.tlSeleccione,
                        valueField: 'idmoneda',
                        displayField: 'denominacion',
                        tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
                        store: modelo.stMonedas
                    })
                }]
        });

        _this.sm_financiamiento = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        _this.sm_erogacion = new Ext.grid.RowSelectionModel({
            singleSelect: true
        });

        _this.btnAdicionarFinan = new Ext.Button({
            disabled: false,
            id: 'btnAdicionarFinan',
            icon: perfil.dirImg + 'adicionar.png',
            iconCls: 'btn',
            tooltip: idioma.btnAdd,
            text: idioma.btnAdd
        });

        _this.btnEliminarFinan = new Ext.Button({
            disabled: false,
            id: 'btnEliminarFinan',
            icon: perfil.dirImg + 'eliminar.png',
            iconCls: 'btn',
            tooltip: idioma.btnEliminar,
            text: idioma.btnEliminar
        });

        _this.btnAdicionarErogacion = new Ext.Button({
            disabled: false,
            id: 'btnAdicionarErogacion',
            icon: perfil.dirImg + 'adicionar.png',
            iconCls: 'btn',
            tooltip: idioma.btnAdd,
            text: idioma.btnAdd
        });

        _this.btnEliminarErogacion = new Ext.Button({
            disabled: false,
            id: 'btnEliminarErogacion',
            icon: perfil.dirImg + 'eliminar.png',
            iconCls: 'btn',
            tooltip: idioma.btnEliminar,
            text: idioma.btnEliminar
        });
        _this.btnLimpiarfinanciamiento = new Ext.Button({
            // text: idioma.btnLimpiar,
            tooltip: 'Limpiar',
            iconCls: 'limpiar'

        });



        _this.filtrosFinanciamineto = new Ext.grid.GridFilters({
            filters: [{
                    type: 'numeric',
                    dataIndex: 'valor'
                }, {
                    type: 'listado',
                    dataIndex: 'moneda',
                    idcombo: 'idmoneda',
                    urlcb: '/planificacion/planmeta/index.php/inversiones/listarMoneda',
                    idstore: 'idmoneda',
                    valueFieldcb: 'idmoneda',
                    displayFieldcb: 'denominacion'
                }, {
                    type: 'listado',
                    dataIndex: 'tipo',
                    idcombo: 'idtipofinanciamiento',
                    urlcb: '/planificacion/planmeta/index.php/inversiones/listarTipoFinan',
                    idstore: 'idtipofinanciamiento',
                    valueFieldcb: 'idtipofinanciamiento',
                    displayFieldcb: 'denominaciontipo'
                }, {
                    type: 'listado',
                    dataIndex: 'financi',
                    idcombo: 'idfinancista',
                    urlcb: '/planificacion/planmeta/index.php/inversiones/listarFinancista',
                    idstore: 'idfinancista',
                    valueFieldcb: 'idfinancista',
                    displayFieldcb: 'denominaciontipo'
                }]
        });

        _this.grid_FinanciamientoP = new Ext.grid.EditorGridPanel({
            title: 'Financiamiento',
            frame: true,
            sm: _this.sm_financiamiento,
            height: 150,
            autoScroll: true,
            // width: 800,
            /* viewConfig: {//con esto salen todas las columnas y no hace falta una barra de desplazamiento horizontal
             forceFit: true
             },*/
            region: 'center',
            loadMask: {
                store: modelo.store_Financiamiento
            },
            plugins: _this.filtrosFinanciamineto,
            store: modelo.store_Financiamiento,
            tbar: [_this.btnAdicionarFinan, _this.btnEliminarFinan],
            columns: [
                {
                    header: "Qui&eacute;n Financia",
                    tooltip: 'Qui&eacute;n Financia',
                    dataIndex: 'financi',
                    width: 150,
                    sortable: true,
                    renderer: rendeFinancista,
                    //emptyText: 'Seleccione...',
                    editor: new Ext.form.ComboBox({
                        mode: 'local',
                        triggerAction: 'all',
                        allowBlank: false,
                        emptyText: 'Seleccione...',
                        valueField: 'idfinancista',
                        displayField: 'denominaciontipo',
                        store: modelo.stFinancista,
                        tpl: '<tpl for="."><div ext:qtip="{denominaciontipo}" class="x-combo-list-item">{denominaciontipo}</div></tpl>'
                    })
                },
                {
                    header: idioma.tlTipFinanc,
                    dataIndex: 'tipo',
                    width: 150,
                    sortable: true,
                    renderer: rendeTipoFin,
                    editor: new Ext.form.ComboBox({
                        mode: 'local',
                        triggerAction: 'all',
                        allowBlank: false,
                        emptyText: 'Seleccione...',
                        valueField: 'idtipofinanciamiento',
                        displayField: 'denominaciontipo',
                        store: modelo.stTipoFinan,
                        autoScroll: true,
                        tpl: '<tpl for="."><div ext:qtip="{denominaciontipo}" class="x-combo-list-item">{denominaciontipo}</div></tpl>'
                    })
                },
                {
                    header: "Gracia",
                    tooltip: 'Gracia',
                    dataIndex: 'gracia',
                    width: 100,
                    emptyText: 'Seleccione...',
                    sortable: true,
                    editor: new Ext.form.NumberField({
                        disabledClass: 'disabled-component',
                        selectOnFocus: true,
                        allowBlank: false
                    })
                },
                {
                    header: "Porciento Inter&eacute;s",
                    tooltip: 'Porciento',
                    dataIndex: 'porcientointeres',
                    width: 100,
                    emptyText: 'Seleccione...',
                    sortable: true,
                    editor: new Ext.form.NumberField({
                        disabledClass: 'disabled-component',
                        selectOnFocus: true,
                        allowBlank: false
                    })
                },
                {
                    header: "Plazo de amortizaci&oacute;n",
                    tooltip: 'Plzo de amortizaci&oacute;n',
                    dataIndex: 'plazoamortizacion',
                    width: 100,
                    emptyText: 'Seleccione...',
                    sortable: true,
                    editor: new Ext.form.NumberField({
                        disabledClass: 'disabled-component',
                        selectOnFocus: true,
                        allowBlank: false
                    })
                },
                {
                    header: idioma.tlValor,
                    dataIndex: 'valor',
                    width: 100,
                    sortable: true,
                    editor: new Ext.form.NumberField({
                        disabledClass: 'disabled-component',
                        selectOnFocus: true,
                        allowBlank: false,
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([1-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros'
                    })
                }, {
                    header: idioma.tlmoneda,
                    tooltip: 'Moneda',
                    dataIndex: 'moneda',
                    width: 200,
                    sortable: true,
                    renderer: rendeMoneda,
                    editor: new Ext.form.ComboBox({
                        id: 'idmoneda',
                        mode: 'local',
                        triggerAction: 'all',
                        allowBlank: false,
                        emptyText: idioma.tlSeleccione,
                        valueField: 'idmoneda',
                        displayField: 'denominacion',
                        //renderer: crearToolTip,
                        store: modelo.stMonedas




                    })
                }]
        });

        _this.grid_Erogacion = new Ext.grid.EditorGridPanel({
            title: 'Erogaci&oacute;n a l&iacute;quido de importaci&oacute;n',
            frame: true,
            sm: _this.sm_erogacion,
            height: 150,
            // width: 800,
            viewConfig: {//con esto salen todas las columnas y no hace falta una barra de desplazamiento horizontal
                forceFit: true
            },
            region: 'south',
            //plugins: _this.filtrosFinanciamineto,
            store: modelo.store_Erogacion,
            tbar: [_this.btnAdicionarErogacion, _this.btnEliminarErogacion],
            columns: [
                {
                    header: idioma.tlValor,
                    dataIndex: 'valor',
                    width: 200,
                    //id: 'grid_Presupuesto',
                    sortable: true,
                    editor: new Ext.form.NumberField({
                        disabledClass: 'disabled-component',
                        selectOnFocus: true,
                        allowBlank: false,
                        maskRe: /^([0-9]+ ?[0-9]*)+$/,
                        maskRegex: /^([0-9]+ ?[0-9]*)+$/,
                        regex: /^([1-9]+ ?[0-9]*)+$/,
                        regexText: 'Los valores deben ser n\xFAmeros enteros',
                    })
                }, {
                    header: idioma.tlmoneda,
                    tooltip: 'Moneda',
                    dataIndex: 'moneda',
                    width: 300,
                    sortable: true,
                    renderer: rendeMoneda,
                    editor: new Ext.form.ComboBox({
                        id: 'idmoneda',
                        mode: 'local',
                        triggerAction: 'all',
                        allowBlank: false,
                        emptyText: idioma.tlSeleccione,
                        valueField: 'idmoneda',
                        displayField: 'denominacion',
                        //renderer: crearToolTip,
                        store: modelo.stMonedas




                    })
                }]
        });


        _this.pPrincipal = new Ext.Panel({
            height: 550,
            region: 'center',
            //width:800,
            layout: 'fit',
            items: [_this.fmAdicionarInversion]
        });

        _this.tabAbajo = new Ext.TabPanel({
            id: 'tababajo',
            height: 200,
            activeTab: 0,
            region: 'south',
            items: [_this.grid_Erogacion, _this.grid_PresupuestoP, _this.grid_FinanciamientoP]
        });


        _this.win_add_inversiones = new Ext.Window({
            title: idioma.tlAddInv,
            width: 800,
            height: 620,
            layout: 'border',
            closeAction: 'hide',
            resizable: false,
            modal: true,
            items: [_this.pPrincipal, _this.tabAbajo],
            buttons: [_this.btnCancelarAddinversion = new Ext.Button({
                    id: 'btnCancelarAddinversion',
                    icon: perfil.dirImg + 'cancelar.png',
                    iconCls: 'btn',
                    tooltip: idioma.toolTipCancelar,
                    text: idioma.btnCancelar

                }), _this.btnAplicarAddinversion = new Ext.Button({
                    id: 'btnAplicarAddinversion',
                    icon: perfil.dirImg + 'aplicar.png',
                    iconCls: 'btn',
                    tooltip: idioma.toolTipAplicar,
                    text: idioma.btnAplicar,
                    disabled: false
                }), _this.btnAceptarAddinversion = new Ext.Button({
                    id: 'btnAceptarAddinversion',
                    icon: perfil.dirImg + 'aceptar.png',
                    iconCls: 'btn',
                    tooltip: idioma.toolTipAceptar,
                    text: idioma.btnAceptar,
                    disabled: false
                })]
        });



        _this.view = new Ext.Viewport({
            layout: 'fit',
            items: [_this.pGeneral]
        });

        /*Adicionar Equipos*/
        _this.smAddEquipos = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });

        _this.cmAddEquipos = new Ext.grid.ColumnModel([
            {
                header: idioma.tlcodigo,
                width: 50,
                dataIndex: 'codigo',
                sortable: true
            }, {
                header: idioma.tlPieza,
                width: 60,
                sortable: true,
                dataIndex: 'pieza'
            }, {
                header: idioma.tlDenom,
                width: 100,
                sortable: true,
                dataIndex: 'denominacion'
            }, {
                header: idioma.tlUM,
                width: 100,
                sortable: true,
                dataIndex: 'unidadmedida'
            }, {
                header: idioma.tlPreMN,
                width: 100,
                sortable: true,
                dataIndex: 'preciomn'
            }, {
                header: idioma.tlPreMLC,
                width: 100,
                sortable: true,
                dataIndex: 'preciomlc'
            }, {
                header: idioma.tlCentroBalan,
                width: 100,
                sortable: true,
                dataIndex: 'centrobalance'
            }, {
                header: idioma.tlNat,
                width: 100,
                sortable: true,
                dataIndex: 'naturaleza'
            }
        ]);

        _this.gpAddEquipo = new Ext.grid.GridPanel({
            frame: true,
            title: idioma.tlEquipos,
            border: false,
            height: 265,
            layout: 'fit',
            autoWidth: true,
            store: modelo.stAddEquipos,
            loadMask: {store: modelo.stAddEquipos},
            sm: _this.smAddEquipos,
            cm: _this.cmAddEquipos
        });

        _this.btnAceptar = new Ext.Button({
            text: idioma.btnAceptar,
            iconCls: 'aceptar',
            tooltip: idioma.toolTipAceptar,
            disabled: false,
            id: "idaceptarE"
        });

        _this.btnCancelar = new Ext.Button({
            text: idioma.btnCancelar,
            iconCls: 'cancelar',
            tooltip: idioma.toolTipCancelar
        });

        _this.winAddEquipos = new Ext.Window({
            title: idioma.tooAddEquipos,
            width: 800,
            height: 400,
            layout: 'fit',
            closeAction: 'hide',
            resizable: false,
            modal: true,
            frame: true,
            items: [_this.gpAddEquipo],
            buttons: [_this.btnCancelar, _this.btnAceptar]
        });
        _this.winReporteAutomotorexcel = new Ext.Window({
            title: 'Equipos automotores Excel',
            id: 'winReporteAutomotorexcel',
            width: 550,
            height: 280, //510,
            resizable: false,
            modal: true,
            closeAction: 'hide',
            items: [_this.fmreporteAutomotorexcel],
            buttons: [_this.btnCancelarAutoExcel, _this.btnAceptarAutoExcel]
        });
        /*Ver financiamiento */
        _this.smVerfinan = new Ext.grid.RowSelectionModel({
            singleSelect: false
        });

        _this.cmVerfinan = new Ext.grid.ColumnModel([
            {
                header: idioma.tlTipFinanc,
                width: 100,
                dataIndex: 'tipo',
                sortable: true
            }, {
                header: idioma.tlFinancista,
                width: 100,
                sortable: true,
                dataIndex: 'financi'
            }, {
                header: 'Gracia',
                width: 100,
                sortable: true,
                dataIndex: 'gracia'
            }, {
                header: "Plazo de amortizaci&oacute;n",
                width: 200,
                sortable: true,
                dataIndex: 'plazoamortizacion'
            }, {
                header: " % Inter&eacute;s",
                width: 100,
                sortable: true,
                dataIndex: 'porcientointeres'
            }, {
                header: idioma.tlValor,
                width: 100,
                sortable: true,
                dataIndex: 'valor'
            }, {
                header: idioma.tlmoneda,
                width: 100,
                sortable: true,
                dataIndex: 'moneda'
            }
        ]);

        _this.gpVerfinan = new Ext.grid.GridPanel({
            frame: true,
            border: false,
            height: 265,
            layout: 'fit',
            autoWidth: true,
            store: modelo.stVerfinan,
            loadMask: {store: modelo.stAddEquipos},
            sm: _this.smVerfinan,
            cm: _this.cmVerfinan
        });

        _this.btnCerrarVerfinan = new Ext.Button({
            text: idioma.tlCerrar,
            iconCls: 'cerrar',
            tooltip: idioma.tlTooCerrar
        });

        _this.winVerfinan = new Ext.Window({
            title: 'Ver financiamiento',
            width: 800,
            height: 400,
            layout: 'fit',
            closeAction: 'hide',
            resizable: false,
            modal: true,
            frame: true,
            items: [_this.gpVerfinan],
            buttons: [_this.btnCerrarVerfinan]
        });

        _this.btnAceptarCMExcel = new Ext.Button({
            text: 'Aceptar',
            iconCls: 'aceptar',
            tooltip: 'Aceptar'
        });

        _this.btnCancelarCMExcel = new Ext.Button({
            text: 'Cancelar',
            iconCls: 'cancelar',
            tooltip: 'Cancelar'
        });

        _this.CmbOrganismoCMExcel = new Ext.ux.form.LovCombo({
            xtype: 'combo',
            width: 210,
            align: 'right',
            mode: 'local',
            store: modelo.stOrganismo,
            valueField: 'idorganismo',
            displayField: 'organismo',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            //  listWidth: 250,
            editable: true,
            allowBlank: false,
            //  enableQtip: true,
            // typeAhead: true,
            // selectOnFocus: true,
            fieldLabel: 'Organismo'

        });

        _this.CmbEntidadCMExcel = new Ext.ux.form.LovCombo({
            width: 200,
            align: 'right',
            mode: 'local',
            store: modelo.stEntidad,
            valueField: 'identidad',
            displayField: 'entidad',
            triggerAction: 'all',
            emptyText: 'Seleccione...',
            fieldLabel: 'Entidad',
            allowBlank: true,
            disabled: true
        });

        _this.fmreporteCMExcel = new Ext.form.FormPanel({
            width: 470,
            height: 400,
            frame: true,
            region: "center",
            border: false,
            labelAlign: 'top',
            items: [{
                    layout: 'column',
                    items: [{
                            columnWidth: .5,
                            layout: 'form',
                            items: [_this.CmbOrganismoCMExcel]
                        }, {
                            columnWidth: .5,
                            layout: 'form',
                            items: [_this.CmbEntidadCMExcel]
                        }, {
                            columnWidth: .5,
                            layout: 'form',
                            items: [_this.CmbformaPropiedadExcel]
                        }
                    ]
                }
            ]
        });

        _this.winReporteCMExcel = new Ext.Window({
            title: 'Reporte Construcción y Montaje',
            width: 470,
            height: 200, //510,
            draggable: true,
            resizable: false,
            modal: true,
            closeAction: 'hide',
            items: [_this.fmreporteCMExcel],
            buttons: [_this.btnCancelarCMExcel, _this.btnAceptarCMExcel]
        });

        _this.cbForPropComponente = new Ext.ux.form.LovCombo({
            xtype: 'combo',
            width: 260,
            align: 'right',
            store: modelo.stFormapropiedad,
            mode: 'remote',
            valueField: 'idformapropiedad',
            displayField: 'denominacion',
            triggerAction: 'all',
            emptyText: idioma.tlSeleccione,
            listWidth: 250,
            editable: true,
            enableQtip: true,
            typeAhead: true,
            fieldLabel: idioma.tlFormProp,
            resizable: true
        });

        _this.cbCreditoComponente = new Ext.ux.form.LovCombo({
            xtype: 'combo',
            width: 260,
            align: 'right',
            store: modelo.stCredito,
            mode: 'remote',
            valueField: 'idtipofinanciamiento',
            displayField: 'denominaciontipo',
            triggerAction: 'all',
            emptyText: idioma.tlSeleccione,
            listWidth: 250,
            editable: true,
            enableQtip: true,
            typeAhead: true,
            fieldLabel: 'Crédito',
            resizable: true
        });

        _this.ChekComponente = new Ext.form.Checkbox({
            xtype: 'checkbox',
            disabled: false,
            align: 'right',
            fieldLabel: 'Mostrar inversiones'
        });

        _this.fmRptComponente = new Ext.form.FormPanel({
            width: 570,
            height: 180,
            frame: true,
            region: "center",
            border: false,
            labelAlign: 'top',
            items: [{
                    layout: 'column',
                    items: [{
                            columnWidth: .35,
                            layout: 'form',
                            items: _this.cbOrganismoComponente
                        }, {
                            columnWidth: .35,
                            layout: 'form',
                            items: _this.cbEntComponente
                        }, {
                            columnWidth: .3,
                            layout: 'form',
                            items: _this.ChekComponente
                        }
                    ]
                }, {
                    layout: 'column',
                    items: [{
                            columnWidth: .5,
                            layout: 'form',
                            items: [_this.cbForPropComponente]
                        }, {
                            columnWidth: .5,
                            layout: 'form',
                            items: [_this.cbCreditoComponente]
                        }
                    ]
                }
            ]
        });

        _this.btnAceptarComponente = new Ext.Button({
            text: 'Aceptar',
            iconCls: 'aceptar',
            tooltip: 'Aceptar',
            disabled: false
        });

        _this.btnCancelaComponente = new Ext.Button({
            text: 'Cancelar',
            iconCls: 'cancelar',
            tooltip: 'Cancelar'
        });

        _this.winRptComponente = new Ext.Window({
            id: 'constmontajeexcel',
            title: 'Reporte Componente',
            width: 570,
            height: 180,
            draggable: true,
            resizable: false,
            modal: true,
            closeAction: 'hide',
            items: [_this.fmRptComponente],
            buttons: [_this.btnCancelaComponente, _this.btnAceptarComponente]
        });

        _this.btnAceptarBalance = new Ext.Button({
            text: 'Aceptar',
            iconCls: 'aceptar',
            tooltip: 'Aceptar'
        });

        _this.btnCancelaBalance = new Ext.Button({
            text: 'Cancelar',
            iconCls: 'cancelar',
            tooltip: 'Cancelar'
        });
        _this.fmRptBalance = new Ext.form.FormPanel({
            width: 570,
            height: 180,
            frame: true,
            region: "center",
            border: false,
            labelAlign: 'top',
            /* items: [{
             
             }, {
             
             }
             ]*/
        });

        _this.winRptBalance = new Ext.Window({
            id: 'idvalance',
            title: 'Reporte Balance de equipos',
            width: 570,
            height: 180,
            draggable: true,
            resizable: false,
            modal: true,
            closeAction: 'hide',
            items: [_this.fmRptBalance],
            buttons: [_this.btnCancelaBalance, _this.btnAceptarBalance]
        });


        function rendeMoneda(idmoneda) {
            var index = modelo.stMonedas.find('idmoneda', idmoneda);
            if (index > -1) {
                var record = modelo.stMonedas.getAt(index);
                return record.get('denominacion');
            }
            return idmoneda;
        }

        function rendeFinancista(idfinancista) {
            var index = modelo.stFinancista.find('idfinancista', idfinancista);
            if (index > -1) {
                var record = modelo.stFinancista.getAt(index);
                return record.get('denominaciontipo');
            }
            return idfinancista;
        }

        function rendeTipoFin(idtipofinanciamiento) {
            var index = modelo.stTipoFinan.find('idtipofinanciamiento', idtipofinanciamiento);
            if (index > -1) {
                var record = modelo.stTipoFinan.getAt(index);
                return record.get('denominaciontipo');
            }
            return idtipofinanciamiento;
        }
        function fnSiNo(val, m, record, row, col) {
            var palabra = GetPalabraColumna(val, col);
            m.attr = 'ext:qtip="' + palabra + '"';
            if (val == 1) {
                return '<span><img src=' + perfil.dirImg + 'rector.png' + '>';
            }

            return '<span><img src=' + perfil.dirImg + 'no.png' + '>';
        }

        function GetPalabraColumna(val, col) {
            if (col == 3)
                return (val == 1) ? 'Activado' : 'Desactivado';
            if (col == 4)
                return (val == 1) ? 'Aprobado' : 'Desaprobado';
            if (col == 5)
                return (val == 1) ? 'Est&aacute; en uso' : 'No est&aacute; en uso';
        }
    }
};
