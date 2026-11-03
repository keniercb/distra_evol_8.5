Ext.namespace('Ext.UICancelarDuo');

Ext.UICancelarDuo = Ext.extend(Ext.Window, {
    constructor: function(scope)
    {
        scope.btnCancelarCerrar = new Ext.Button({
            text: 'Cancelar',//scope.etiquetas.lbBtnCerrar,
            tooltip: 'Cerrar ventana sin guardar los datos',//scope.etiquetas.lbBtnCerrar,
            tabIndex: 409,
//            icon: perfil.dirImg + 'cerrar.png',
            iconCls: 'cerrar',
            scope: this
        });

        scope.btnCancelarAceptar = new Ext.Button({
            id: 'btnCancelarAceptar',
            text: scope.etiquetas.lbBtnAceptar,
            tooltip: 'Guardar datos y cerrar ventana',//scope.etiquetas.lbBtnAceptar,
            disabled: true,
            tabIndex: 408,
//            icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            scope: this
        });

        scope.cbCancelarMotivo = new Ext.form.ComboBox({
            editable: true,
            //width : '50',
            allowBlank: false,
            store: scope.stCancelarMotivo,
            valueField: 'idmotivocancelacion',
            displayField: 'descripcion',
            hiddenName: 'idmotivocancelacion',
            disabledClass: 'disabled-component',
            id: 'cbCancelarMotivo',
            selectOnFocus: true,
            resizable: true,
            forceSelection: true,
            mode: 'local',
            triggerAction: 'all',
            fieldLabel: scope.etiquetas.lbMotivoCancel,
            anchor: '100%',
            tpl: '<tpl for="."><div ext:qtip="{descripcion}" class="x-combo-list-item">{descripcion}</div></tpl>',
            enableKeyEvents: true,
            listeners: {
                keypress: function(t, e) {
                    if ((e.getKey() == 8) || (e.getKey() == 46)) // para el suprimir y borrar
                    {
                        this.clearValue();
                    }
                }
            }
        });

//        scope.cbCancelarOperacion = new Ext.form.ComboBox({
//            editable: false,
//            store: scope.stCancelarOperacion,
//            allowBlank: false,
//            valueField: 'idoperacion',
//            displayField: 'denominacion',
//            hiddenName: 'idoperacion',
//            disabledClass: 'disabled-component',
//            id: 'cbCancelarOperacion',
//            selectOnFocus: true,
//            resizable: true,
//            //typeAhead : true,
//            mode: 'local',
//            triggerAction: 'all',
//            fieldLabel: scope.etiquetas.lbOperacCancel,
//            anchor: '100%',
//            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
//            enableKeyEvents: true,
//            listeners: {
//                keypress: function(t, e) {
//                    if ((e.getKey() == 8) || (e.getKey() == 46)) // para el suprimir y borrar
//                    {
//                        this.clearValue();
//                    }
//                }
//            }
//        });

        scope.lCancelarAction = new Ext.form.Label({
            text: scope.etiquetas.lbCancelNoDocDerecho,
            anchor: '100%',
            style: 'font-size:12px'
        });

        scope.lCancelarNumeroDocumento = new Ext.form.Label({
            text: scope.numeros,
            anchor: '100%',
            style: 'font-size:12px'
        });

        scope.lCancelarVacio = new Ext.form.Label({
            text: '',
            anchor: '100%',
            style: 'font-size:12px'
        });

        scope.fpShowNumeros = new Ext.Panel({
            id: "panelimporte",
            layout: 'form',
            frame: true,
            border: false,
            html: ((scope.tipoDuo == 1 || scope.tipoDuo == 3) ? scope.etiquetas.lbCancelNoDocDerecho : scope.etiquetas.lbCancelNoDocOblig) + '<br>' + scope.numeros + '<br><br>',
            autoScroll: true,
            items: ''
        });

        scope.dfCancelarFecha = new Ext.form.DateField({
            disabledClass: 'disabled-component',
            id: 'dfCancelarFecha',
            fieldLabel: scope.etiquetas.lbFechaCancel,
            name: 'dfCancelarFecha',
            maskRe: /^([0-9 \/\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9.]*)+$/,
            selectOnFocus: true,
            readOnly: false,
            blankText: scope.etiquetas.lbBlankText,
            allowBlank: false,
            anchor: '100%',
            format: 'd/m/Y',
            editable: true
        });
        
        var question = scope.etiquetas.lbConfirmCancel.replace('<#artDuo>',
                        (scope.arrayIdDuo.length > 1) ? scope.artTextoP.toLowerCase():scope.artTexto.toLowerCase()).replace('<#tipoDuo>',
                        (scope.arrayIdDuo.length > 1) ? scope.textDuoP.toLowerCase():scope.textDuo.toLowerCase()).replace('<#sel>',
                        (scope.tipoDuo ==  1 || scope.tipoDuo ==  2) ? ((scope.arrayIdDuo.length > 1) ? scope.etiquetas.lbSelFP : scope.etiquetas.lbSelF):((scope.arrayIdDuo.length > 1) ? scope.etiquetas.lbSelMP : scope.etiquetas.lbSelM));

        scope.fpCancelarDuo = new Ext.FormPanel({
            frame: true,
            border: false,
            id: 'fpBuscarDuo',
            autoHeight: true,
            layout: 'form',
            labelAlign: 'top',
            items: [{
                    //html: '<div style="font-size: 10pt">' + ((scope.tipoDuo == 1 || scope.tipoDuo == 3) ? scope.etiquetas.lbCancelNoDocDerecho : scope.etiquetas.lbCancelNoDocOblig) + '<br>' + '<br>' + scope.numeros + '<br><br>' + '</div>'
                    html: '<div style="font-size: 10pt">' + question + '<br>' + '<br>' + scope.numeros + '<br><br>' + '</div>'
                }, scope.cbCancelarMotivo/*, scope.dfCancelarFecha*/]
        });

//        if (scope.cInicial == 1)
//            scope.fpCancelarDuo.add(scope.cbCancelarOperacion);

        Ext.apply(this, {
            modal: true,
            id: 'winCancelar',
            frame: true,
            resizable: true,
            bodyStyle: 'padding:5px 5px 5px',
            border: false,
            closable: false,
            defaultButton: 'btnCancelarAceptar',
            title: scope.etiquetas.lbBtnCancelar,
            width: '27%',
            constrain: true,
            items: scope.fpCancelarDuo,
            buttons: [scope.btnCancelarCerrar, scope.btnCancelarAceptar]
        });

        return Ext.UICancelarDuo.superclass.constructor.call(this);
    }
});
