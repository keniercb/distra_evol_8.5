Ext.ns('Ext.erp');

Ext.erp.nomclasificacion = Ext.extend(Ext.erp.gridPanelNomenclador, {
    /**
     *
     **/
    constructor: function (config) {
        var _this = this;
        var _this = this;
        Ext.apply(this, config);
        this.bussinesModel = 'NomClasificacionModel';
        this.campoIdNomenclador = 'idclasificacion';
        config.codigo = false;
        config.usarFecha = true;

        this.storeFields = [{
            name: 'estadodocumento'
        }];

        this.columnsFields = [{
            dataIndex: 'estadodocumento',
            header: _this.idioma.lbEstadoDocumento,
            width: 95,
            renderer: function (v) {
                return LOG.tall.ordentrabajo.Estado[v];
            }
        }];

        Ext.erp.nomclasificacion.superclass.constructor.call(this, config);
        this.columnasNomenclador.config[1].width  = 120;
        this.columnasNomenclador.config[5].hidden = true;
        this.columnasNomenclador.config[6].hidden = true;
    },
    initFormFields: function(){
        var _this = this;
        this.cmbEstado = new LOG.util.ComboBox({
            fieldLabel: _this.idioma.lbEstadoDocumento,
            hiddenName: 'estadodocumento',
            valueField: 'estadodocumento',
            displayField: 'estado',
            editable: false,
            allowBlank: false,
            anchor: '50%',
            mode: 'local',
            store: new Ext.data.SimpleStore({
                fields: ['estadodocumento', 'estado'],
                data: [
                    [1, LOG.tall.ordentrabajo.Estado[1]],
                    [2, LOG.tall.ordentrabajo.Estado[2]],
                    [3, LOG.tall.ordentrabajo.Estado[3]],
                    [4, LOG.tall.ordentrabajo.Estado[4]],
                    [5, LOG.tall.ordentrabajo.Estado[5]],
                    [6, LOG.tall.ordentrabajo.Estado[6]],
                    [7, LOG.tall.ordentrabajo.Estado[7]],
                    [8, LOG.tall.ordentrabajo.Estado[8]],
                    [9, LOG.tall.ordentrabajo.Estado[9]],
                ]
            })
        });
        this.formFields = [{
            layout: 'column',
            items: [{
                columnWidth: 1,
                layout: 'form',
                items: this.cmbEstado
            }]
        }];
    }
});
