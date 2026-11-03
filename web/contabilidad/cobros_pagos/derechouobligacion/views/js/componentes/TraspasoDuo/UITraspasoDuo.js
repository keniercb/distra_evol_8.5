Ext.namespace('Ext.UITraspasoDuo');

Ext.UITraspasoDuo = Ext.extend(Ext.Window, {
    constructor: function(scope)
    {
        scope.btnTraspasoCerrar = new Ext.Button({
            text: scope.etiquetas.lbBtnCerrar,
            tooltip: scope.etiquetas.lbBtnCerrar,
            tabIndex: 409,
//            icon: perfil.dirImg + 'cerrar.png',
            iconCls: 'cerrar',
            scope: this
        });

        scope.btnTraspasoAceptar = new Ext.Button({
            text: scope.etiquetas.lbBtnAceptar,
            tooltip: scope.etiquetas.lbBtnAceptar,
            tabIndex: 408,
//            icon: perfil.dirImg + 'aceptar.png',
            iconCls: 'aceptar',
            scope: this
        });

        scope.lTraspasoAction = new Ext.form.Label({
            text: scope.etiquetas.lbCancelNoDocDerecho,
            anchor: '100%',
            style: 'font-size:12px'
        });

        scope.lTraspasoVacio = new Ext.form.Label({
            id: 'lTraspasoVacio',
            text: '.',
            anchor: '100%',
            style: '<span style=color:transparent;border:none;>'
        });

        scope.cbTraspasoEntidad = new Ext.CONT.UIXCombo({
            emptyText: scope.etiquetas.lbSeleccione,
            allowBlank: false,
            fieldLabel: scope.etiquetas.lbEntidad,
            tabIndex: 1
        }, {
            identificador: 'Entidad',
            displayText: 'Entidad',
            url: 'loadTreeEntidades',
            autoLoad: false,
            singleSelect: true,
            reader: scope.jrEntidad = new Ext.data.JsonReader({
                id: 'idestructuracomun',
                root: 'tree'
            }, [{
                    name: '_parent',
                    mapping: 'idestructuraepadre'
                }, {
                    name: '_is_leaf',
                    mapping: 'leaf'
                }, {
                    name: 'text'
                }, {
                    name: 'idestructurae'
                }, {
                    name: 'idestructuracomun'
                }, {
                    name: 'idestructuraepadre'
                }, {
                    name: 'codigo',
                    mapping: 'codigoestructura'
                }, {
                    name: 'ordenizq'
                }, {
                    name: 'ordender'
                }])
        });

        scope.dfTraspasoFecha = new Ext.form.DateField({
            disabledClass: 'disabled-component',
            id: 'dfTraspasoFecha',
            fieldLabel: scope.etiquetas.lbFechaTraspaso,
            name: 'dfTraspasoFecha',
            maskRe: /^([0-9 \/\xf3\xf1\xe1\xe9\xed\xfa\xd1]+ ?[0-9.]*)+$/,
            selectOnFocus: true,
            readOnly: false,
            disabled: true,
            blankText: scope.etiquetas.lbBlankText,
            allowBlank: false,
            anchor: '100%',
            format: 'd/m/Y',
            editable: true,
            enableKeyEvents: true
        });

        scope.fpTraspasoDuo = new Ext.FormPanel({
            frame: true,
            border: false,
            id: 'fpTraspasoDuo',
            autoHeight: true,
            layout: 'form',
            labelAlign: 'left',
            items: [{
                    html: '<br>' + '<div style="font-size: 10pt">' + scope.etiquetas.lbDocSelecTraspaso + '<br>' + scope.numerosDoc + '<br>' + '</div>'
                }, {
                    html: '<br>' + '<div style="font-size: 10pt">' + scope.etiquetas.lbCtaTraspaso + '<br>' + scope.cuentas + '<br>' + '<br>' + '</div>'
                }, {
                    labelAlign: 'top',
                    layout: 'form',
                    items: [scope.cbTraspasoEntidad]
                }]
        });

        scope.tpTraspasoCCosto = new Ext.Panel({
            id: 'tpTraspasoCCosto',
            layout: 'form',
            labelAlign: 'top',
            frame: true,
            region: 'center',
            height: 400,
            anchor: '100%',
            bodyStyle: 'background-color:#fff;',
            items: [{}],
            listeners: {
                render: function(component) {
                    new Ext.Costo.Procesos.Nomencladores.Componentes.CCNAE({
                        id: 'ccnae',
                        hiquiererch: true,
                        showFullTree: true,
                        typeSelection: 1,
                        types: [1],
                        renderIn: component
                    }).on({
                        initialize: function(componentClass, UI) {
                            UI.on({
                                checkchange: function(node, checked) {
                                    if (checked) {
                                        var selections = componentClass.fGetSelections();
                                        if (Ext.isArray(selections) && selections.length > 0) {
                                            for (var i = 0; i < selections.length; i++) {
                                                if (node.id != selections[i].id) {
                                                    selections[i].getUI().toggleCheck();
                                                }
                                            }
                                        }
                                    }
                                }
                            });
                        }
                    });
                }
            }
        });

        Ext.apply(this, {
            modal: true,
            id: 'winTraspaso',
            frame: true,
            border: false,
            resizable: false,
            bodyStyle: 'padding:5px 5px 5px',
            layout: 'form',
            closable: false,
            title: scope.etiquetas.tTraspaso,
            width: '50%',
            autoHeight: true,
            items: [scope.fpTraspasoDuo/*, scope.tpTraspasoCCosto*/],
            buttons: [scope.btnTraspasoCerrar, scope.btnTraspasoAceptar]
        });

        return Ext.UITraspasoDuo.superclass.constructor.call(this);
    }
});
