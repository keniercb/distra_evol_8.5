
UCID.portal.cargarAcciones(window.frameElement.id, function () {
    var idioma = LOG.util.UIManager.apply(Log.lb.cierre.Idioma, LOG.util.Idioma);
    idioma.msjDocPendientes ='documentos pendientes.';
    /*var VentanaInicial= new LOG.lb.cierre.component.View({
     idioma: idioma
     });
     VentanaInicial.init();
     VentanaInicial.view();*/
    var VentanaInicial = new log.lb.gestcierrepatrimonio.View({
        idioma: idioma,
        acciones: acciones_reportes
    });

    VentanaInicial.init();
    VentanaInicial.getPanelBusqueda().setColumns(2);

    VentanaInicial.addFilterComponent(
        new LOG.util.ComboBox({
            fieldLabel: 'Estado',
            hiddenName: 'estado',
            valueField: 'idestado',
            displayField: 'estado',
            triggerAction: 'all',
            editable: false,
            mode: 'local',
            store: new Ext.data.SimpleStore({
                fields: ['idestado', 'estado'],
                data: [
                    [1, LOG.lb.documento.Estado[1]],
                    [2, LOG.lb.documento.Estado[2]],
                    // [3, LOG.lb.documento.Estado[3]]
                ]
            })
        }));

    VentanaInicial.addFilterComponent(
        new LOG.util.ComboBox({
            fieldLabel: 'Tipo de documento',
            hiddenName: 'iddoc',
            valueField: 'iddoc',
            displayField: 'denominacion',
            triggerAction: 'all',
            editable: false,
            mode: 'local',
            store: new Ext.data.Store({
                url: '/logistica/activos_fijos/utiles/index.php/gestcierreaft/getTipoDocumento',
                autoLoad: true,
                baseParams: {
                    estado: 1
                },
                reader: new Ext.data.JsonReader({
                    totalProperty: 'total',
                    root: 'datos'
                }, [
                    {
                        name: 'denominacion'
                    }, {
                        name: 'iddoc'
                    }
                ])
            })
        }));

    VentanaInicial.addFilterComponent(
        new Ext.form.DateField({
            fieldLabel: 'Fecha',
            format: 'd/m/Y',
            id: 'fecha'
        }));

    VentanaInicial.addFilterComponent(
        new LOG.util.ComboBox({
            fieldLabel: 'Creado por',
            hiddenName: 'idusuario',
            valueField: 'idusuario',
            displayField: 'nombreusuario',
            triggerAction: 'all',
            editable: false,
            mode: 'local',
            store: new Ext.data.Store({
                url: '/logistica/activos_fijos/utiles/index.php/gestcierreaft/getCreadoPor',
                autoLoad: true,
                baseParams: {
                    estado: 1
                },
                reader: new Ext.data.JsonReader({
                    totalProperty: 'total',
                    root: 'datos'
                }, [
                    {
                        name: 'nombreusuario'
                    }, {
                        name: 'idusuario'
                    }
                ])
            })
        }));

    VentanaInicial.addFilterComponent(
        new Ext.form.NumberField({
            //anchor: '95%',
            fieldLabel: 'No. de documento',
            maxLength: '19',
            id: 'nrodoc'
        })
    );
    VentanaInicial.view();
});

