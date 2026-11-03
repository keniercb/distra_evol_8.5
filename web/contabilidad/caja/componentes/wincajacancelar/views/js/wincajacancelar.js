//--Componete Window Caja-Fondo
Ext.ns('Caja.WindowCancelar');
Caja.WindowCancelar = Ext.extend(Ext.Window, {
    ifuncionalidad: window.parent.idFuncionalidad,
    constructor: function (params) {
        Ext.apply(this, params);
        Ext.apply(this, {
            width: 300,
            modal: true,
            autoValidate: true,
            autoShow: true,
            constrain: true,
            closable: false,
            layout: 'fit',
            closeAction: 'close',
            frame: true,
            resizable: false,
            title: 'Cancelar',
            // idioma: params.idioma,
            // perfil: params.perfil,
        });
        this.createButtons();
        this.initFunctions();
        this.createForm();
        this.initEventos();

        Caja.WindowCancelar.superclass.constructor.call(this);
    },
    initEventos: function () {
        var me = this;
        this.btnCerrar.on({
            scope: this,
            click: function () {
                me.close();
            }
        });

        this.btnAceptar.on({
            scope: this,
            click: function () {
                // me.cancelarDocumento();
                me.close();
            }
        });

    },
    createButtons: function () {
        this.btnCerrar = new Ext.Button({
            text: 'Cerrar',
            tooltip: 'Cerrar ventana sin guardar los datos.',
            iconCls: 'cancelar'
        });

        this.btnAceptar = new Ext.Button({
            text: 'Aceptar',
            disabled: true,
            tooltip: 'Guardar datos y cerrar ventana.',
            iconCls: 'aceptar'
        });
        this.buttons = [this.btnCerrar, this.btnAceptar];
    },
    createForm: function () {

        this.stMotivo = new Ext.data.Store({
            url: '/contabilidad/caja/componentes/wincajacancelar/index.php/wincajacancelar/motivoscancelacion',
            reader: new Ext.data.JsonReader({
                root: 'datos',
                id: 'idmotivocancelacion'
            }, [{
                name: 'idmotivocancelacion',
                mapping: 'idmotivocancelacion',
                type: 'string'
            }, {
                name: 'motivo',
                mapping: 'descripcion'
            }
            ]),
            sortInfo: {
                field: 'motivo',
                direction: 'ASC'
            },
            autoLoad: true
        });

        this.firstElement = this.cbmotivo = new Ext.form.ComboBox({
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: 'Motivo de cancelación',
            mode: 'local',
            name: 'cbxmotivo',
            tpl: '<tpl for="."><div ext:qtip="{motivo}" class="x-combo-list-item">{motivo}</div></tpl>',
            resizable: true,
            emptyText: 'Seleccione...',
            store: this.stMotivo,
            hiddenName: 'idmotivocancelacion',
            valueField: 'idmotivocancelacion',
            displayField: 'motivo',
            editable: false,
            typeAhead: true,
            msgTarget: 'qtip',
            maskRe: /^([0-9a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9a-zA-Z]*)+$/, // Solo letras, nÃºmeros y espacios
            regex: /^([0-9a-zA-Z \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9a-zA-Z]*)+$/,
            // regexText: etiquetas.lbSoloLetrasyNo,
            allowBlank: false,
            // blankText: etiquetas.lbCampoObligatorio,
            anchor: '100%',
            triggerAction: 'all'
        });

        this.dffechacancelacion = new Ext.form.DateField({
            id: 'dffechacancelacion',
            name: 'dffechacancelacion',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            fieldLabel: 'Fecha de cancelación',
            readOnly: true,
            msgTarget: 'qtip',
            allowBlank: false,
            // blankText: etiquetas.lbCampoObligatorio,
            format: 'd/m/Y', invalidText: 'El formato establecido: dd/mm/aaaa.',
            value: fechaContable,
            minValue: this.obtenerFechaInicio(fechaInicio, this.fecha),
            maxValue: fechaFin,
            editable: false,
            anchor: '100%'
        });

        this.fpCancelar = new Ext.FormPanel({
            id: 'fpcancelacion',
            region: 'north',
            labelAlign: 'top',
            frame: true,
            border: true,
            layout: 'form',
            autoHeight: true,
            modal: true,
            bodyStyle: 'padding:0px 10px 0px 10px',
            items: [this.cbmotivo, this.dffechacancelacion]
        });

        this.items = this.fpCancelar;
    },
    initFunctions: function () {
        var me = this;
        this.cancelarDocumento = function () {
            var arrayId = new Array();
            for (var i = 0; i < me.selections.length; i++) {
                arrayId.push(me.selections[i].data.iddocumento);
            }
            // var msgSuccess = (arrayId.length == 1) ? this.idioma.lbACancelRecargaSatisfact : this.idioma.lbACancelRecargasSatisfact;

            Ext.Ajax.request({
                scope: this,
                url: '/contabilidad/caja/componentes/wincajacancelar/index.php/wincajacancelar/cancelarDocumento',
                params: {
                    arrayIdDoc: Ext.encode(arrayId),
                    idmotivo: me.cbmotivo.getValue(),
                    fechacancelacion: me.dffechacancelacion.getRawValue()
                },
                callback: function (options, success, response) {
                    var respuesta = Ext.decode(response.responseText);
                    if (respuesta.codMg == '1') {
                        mostrarMensaje(1, msgSuccess);
                        mw.stRecarga.reload();
                        // Ext.MessageBox.hide();
                    }
                }
            });
        };

        this.obtenerFechaInicio = function (fechaInicio, fechaDocumento) {
            var arrFI = fechaInicio.split('/');
            var arrDO = fechaDocumento.split('/');
            var fechafi = new Date(+arrFI[2], arrFI[1] - 1, +arrFI[0]).setUTCHours(0, 0, 0, 0);
            var fechado = new Date(+arrDO[2], arrDO[1] - 1, +arrDO[0]).setUTCHours(0, 0, 0, 0);
            if (fechafi > fechado) {
                return fechaInicio;
            } else {
                return fechaDocumento;
            }
        };
    }
});