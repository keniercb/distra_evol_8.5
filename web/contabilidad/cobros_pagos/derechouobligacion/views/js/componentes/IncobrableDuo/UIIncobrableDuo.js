Ext.namespace('Ext.UIIncobrableDuo');

Ext.UIIncobrableDuo = Ext.extend(Ext.Window, {
    constructor: function(scope)
    {
        scope.btnIncobrableCerrar = new Ext.Button({
            text: scope.etiquetas.lbBtnCerrar,
            tooltip: scope.etiquetas.lbBtnCerrar,
            tabIndex: 409,
//            icon: perfil.dirImg + 'cerrar.png',
            iconCls: 'cerrar',
            scope: this
        });

        scope.btnIncobrableAceptar = new Ext.Button({
            text: scope.etiquetas.lbBtnAceptar,
            tooltip: scope.etiquetas.lbBtnAceptar,
            tabIndex: 408,
//            icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            scope: this
        });

        scope.cbIncobrableOperacion = new Ext.form.ComboBox({
            id: 'cbIncobrableOperacion',
            fieldLabel: scope.etiquetas.lbOperacion, //'Operaci&oacute;n',
            emptyText: scope.etiquetas.lbSeleccione, //'Seleccione...',
            mode: 'local',
            disabled: true,
            hiddenName: 'idoperacion',
            store: scope.stIncobrableOperacion,
            valueField: 'idoperacion',
            displayField: 'denominacion',
            //typeAhead : true,
            forceSelection: true,
            triggerAction: 'all',
            anchor: '100%',
            resizable: true,
            allowBlank: true,
            editable: true,
            maskRe: /^([a-zA-Z0-9 \xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[a-zA-Z]*)+$/,
            tpl: '<tpl for="."><div ext:qtip="{denominacion}" class="x-combo-list-item">{denominacion}</div></tpl>',
            disabledClass: 'disabled-component',
            selectOnFocus: true,
            enableKeyEvents: true
        });

        scope.lIncobrableAction = new Ext.form.Label({
            text: scope.etiquetas.lbCancelNoDocDerecho,
            anchor: '100%',
            style: 'font-size:12px'
        });

        scope.lIncobrableNumeroDocumento = new Ext.form.Label({
            text: scope.numeros,
            anchor: '100%',
            style: 'font-size:12px'
        });

        scope.lIncobrableVacio = new Ext.form.Label({
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

        scope.dfIncobrableFecha = new Ext.form.DateField({
            disabledClass: 'disabled-component',
            id: 'dfIncobrableFecha',
            fieldLabel: scope.etiquetas.lbFechaCancel,
            name: 'dfIncobrableFecha',
            maskRe: /^([0-9 \/\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9.]*)+$/,
            selectOnFocus: true,
            readOnly: false,
            blankText: scope.etiquetas.lbBlankText,
            allowBlank: false,
            anchor: '100%',
            format: 'd/m/Y',
            editable: true
        });

        scope.fpIncobrableDuo = new Ext.FormPanel({
            frame: true,
            border: false,
            id: 'fpBuscarDuo',
            autoHeight: true,
            layout: 'form',
            labelAlign: 'top',
            items: [{
                    html: '<div style="font-size: 10pt">' + ((scope.tipoDuo == 1 || scope.tipoDuo == 3) ? scope.etiquetas.lbCancelNoDocDerecho : scope.etiquetas.lbCancelNoDocOblig) + '<br>' + '<br>' + scope.numeros + '<br><br>' + '</div>'
                }, scope.cbIncobrableOperacion]
        });

        Ext.apply(this, {
            modal: true,
            id: 'winIncobrable',
            frame: true,
            resizable: true,
            bodyStyle: 'padding:5px 5px 5px',
            border: false,
            closable: false,
            title: scope.etiquetas.lbBtnIncobrable,
            width: '40%',
            items: scope.fpIncobrableDuo,
            buttons: [scope.btnIncobrableCerrar, scope.btnIncobrableAceptar]
        });

        return Ext.UIIncobrableDuo.superclass.constructor.call(this);
    }
});
