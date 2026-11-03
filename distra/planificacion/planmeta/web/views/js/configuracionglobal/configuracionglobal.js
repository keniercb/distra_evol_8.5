var perfil = window.parent.UCID.portal.perfil;
Ext.QuickTips.init();
perfil.etiquetas = Object();

UCID.portal.cargarEtiquetas('configuracionglobal', cargarInterfaz);
// function CargarInterfaz
function cargarInterfaz() {

    mymask = new Ext.LoadMask(Ext.getBody(), {
        msg: perfil.etiquetas.lbEspere
    });

    winCFG = new Ext.Window({
        modal: true,
        title: perfil.etiquetas.lbTitWinCFG,
        closable: false,
        constrain: true,
        //layout:'fit',
        width: 300,
        autoHeight: true,
        items: new Ext.FormPanel({
            id: 'fpCFG',
            autoHeight: true,
            frame: true,
            labelAlign: 'top',
            layout: 'column',
            items: [{
                    layout: 'column',
                    items: [{
                            columnWidth: 1,
                            layout: 'form',
                            items: new Ext.form.NumberField({
                                id: 'nbejercicio',
                                tabIndex: 1,
                                fieldLabel: perfil.etiquetas.lbEjercicio,
                                anchor: '90%',
                                allowBlank: false,
                                maxLength: 4,
                                minLength: 4,
                                minValue: 2012,
                                maxValue: 2025

                            })
                        }, {
                            items: [{
                                    columnWidth: 1,
                                    layout: 'form',
                                    items: new Ext.form.NumberField({
                                        id: 'Mcomercial',
                                        tabIndex: 1,
                                        fieldLabel: perfil.etiquetas.lbMcomercial,
                                        anchor: '90%',
                                        allowBlank: false,
                                        allowDecimals: true,
                                        minValue: 0,
                                        maxValue: 100
                                    })
                                }]
                        }]
                }]
        }),
        buttons: [{
                icon: perfil.dirImg + 'aplicar.png',
                iconCls: 'btn',
                tabIndex: 2,
                text: perfil.etiquetas.lbBtnAplicar,
                id: 'btnApl',
                handler: function() {
                    configurarEJC();
                }
            }]
    });


    //funcion configurar ejercicio
    function configurarEJC() {
        if (Ext.getCmp('fpCFG').getForm().isValid()) {
            Ext.getCmp('fpCFG').getForm().submit({
                url: 'configurarEjercicio',
                waitMsg: perfil.etiquetas.lbEspere,
                failure: function(form, action) {
                    if (action.result.m == 1)
                        mostrarMensaje(action.result.m, 'Se ha configurado satisfactoriamente', function() {
                            listarejactual();
                        });
                }
            })
        }
    }
    function listarejactual() {
        mymask.show();
        Ext.Ajax.request({
            url: 'listarEjercicioActual',
            params: {
                a: 6
            },
            callback: function(options, success, response) {
                mymask.hide();
                responseData = Ext.decode(response.responseText);
                if (!winCFG.isVisible())
                    winCFG.show(Ext.getBody());
                if (responseData.ej) {
                    Ext.getCmp('nbejercicio').setValue(responseData.ej);
                    Ext.getCmp('Mcomercial').setValue(responseData.ej);
                }
            }
        });
    }
    listarejactual();
}// Endof cargarInterfaz
