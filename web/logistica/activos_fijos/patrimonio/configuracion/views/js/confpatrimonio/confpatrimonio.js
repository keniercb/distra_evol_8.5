Ext.ns('Ext.erp');
Ext.erp.confpatrimonio = Ext.extend(Ext.Panel, {
    tipo: 1,
    constructor: function(config) {
        conf = config;
        this.frame = true;
        this.layout = 'fit';
        this.getItemsTrans(config);
        Ext.erp.confpatrimonio.superclass.constructor.call(this, config);
    },
    getItemsTrans: function(config) {
        var _this = this;
        var items = [];
        //  console.info(config);
        if (acciones_reportes.length > 0) {
            for (var i = 0; i < acciones_reportes.length; i++) {
                switch (acciones_reportes[i].abreviatura) {
                    case 'CONFPARAMGENER':
                        var paramsGen = new Ext.erp.ParametrosGenerales({
                            etiquetas: config.idioma,
                            tipo: _this.tipo,
                        });                       
                        items.push(paramsGen);
                        break;
                    case 'CONFDATOSNATURALEZAS':
                        items.push(new Ext.aft.Conf.tiposMedios({
                            etiquetas: config.idioma,
                            tipo: _this.tipo
                            })
                        );
                        break;
                }
            }
        } else {
            mostrarMensaje(1, config.idioma.lbRecursos);
        }

        var tabGeneralTransp = new Ext.TabPanel({
            region: 'center',
            activeTab: 0,
            layoutOnTabChange: true,
            id: 'idTabGeneralTransp',
            items: items,
            autoWidth: true,
            listeners: {
                tabchange: function(p, t) {
                    initHotKeys(t);
                    if (t.id == 'estadosoperaciones') {
                        cargarStoresEstatus();
                    } else if (t.id == 'interfacesoperaciones') {
                        cargarStoresInterfaces();
                    } else if (t.id == 'gruposcuentas') {
                        cargarStoresGrupos();
                    }
                }
            }

        });

        this.items = [tabGeneralTransp];
        this.tbar = ['->', LOG.util.Prototipos.botonAyuda({
                id: 'idconfiguracionaft'
            })]
    },
    getParametrosGeneral: function(config) {

        return [new Ext.erp.ParametrosGeneralesPatr({
                etiquetas: config.idioma
            })];
    }
});



