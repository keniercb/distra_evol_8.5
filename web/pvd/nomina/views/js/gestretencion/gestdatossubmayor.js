Ext.ns('Pvd.Nomina.Pago.Datossubmayor');

//Controlador de la vista del componente Gestionar retenciones.
Pvd.Nomina.Pago.Datossubmayor = Ext.extend(Ext.Window,{
    modal: true,
    title: 'Información',
    height: 500,
    constrain: true,
    width: 500,
    closeAction: 'hide',
    resizable: false,
   // autoHeight: true,
    layout: 'border',

    initComponent : function () {

        this.btnCancelargest = new Ext.Button({
            id: 'btnCancelarRepRetenc',
            iconCls: 'cancelar',
            text: "Cancelar",
            //tooltip: idioma.textToolTipCancelar
        });


        '<p><span style="color:grey;"><b>Datos pago </b></span></p>',
            '<p><span style="color:blue;"><b>Tipo de pago: </b>{tipopago}</span></p>',
            '<p><span style="color:blue;"><b>Per&iacute;odo de pago: </b>{periodopago}</span></p>',

            '<p><span style="color:blue;"><b>Rango de fechas: </b>{rangofechas}</span></p>',

        this.plantillaDatosNomina = new Ext.XTemplate(
            '<div>',
            '<center>'+
            '<justify>'+
                '<table WIDTH="100%" BORDER CELLPADDING=10 CELLSPACING=0 summary="Datos pago">' +
                    '<caption  style="color:grey;"><center>Datos pago</center></caption>' +
            '</justify>'+
            '</center>'+
            '</table>',
            '<div>',
            '<p><span align="justify" style="color:blue;"><b>Tipo de pago: </b>{tipopago}</span></p>',
            '<p><span align="justify" style="color:blue;"><b>Per&iacute;odo de pago: </b>{periodopago}</span></p>',

            '<p><span align="justify" style="color:blue;"><b>Rango de fechas: </b>{fechainicioperiodo}<b>-</b>{fechafinperiodo}</span></p>',
            '</div>'
        );
            //         '<tr> ' +
            //             '<p><span style="color:blue;"><b>Tipo de pago: </b>{tipopago}</span></p>', +
            //             '<p><span style="color:blue;"><b>Per&iacute;odo de pago: </b>{periodopago}</span></p>' +
            //             '<p><span style="color:blue;"><b>Rango de fechas: </b>{fechainicioperiodo}<b>-</b>{fechafinperiodo}</span></p>', +
            //         '</tr>' +
            //
            //         '<tr>'+
            //             '<th ALIGN=center scope="row">{tipopago}</td>' +
            //             '<td>{periodopago}</td>' +
            //             '<td>{fechainicioperiodo}<b>-</b>{fechafinperiodo}</td>'+
            //         '</tr>'+
            //
            //      '</table>'+
            // '</CENTER>',
            // '<br>',
            //
            // '</div>'

        // '<table WIDTH="100%" BORDER CELLPADDING=10 CELLSPACING=0 summary=" Datos persona">' +
        // '<caption  style="color:grey;"><center>Datos persona</center></caption>'+
        // '<tpl for="datospersona">'+
        // '<TR>' +
        // '<TH>{campo}</TH>' +
        // '<TD>{valor}</TD>' +
        // '</TR>'+
        // '</tpl>'+
        // '</table>',

        this.plantillaDatosNomina.compile();

        this.smDato = new Ext.grid.RowSelectionModel({
            singleSelect:true
        });

        this.storeDatos = new Ext.data.SimpleStore({
            // url: '/pvd/nomina/index.php/nomobra/obtenerListadoObras',
            fields: [
                {name: 'campo'},
                {name: 'valor'},

            ]
        });

        this.gpDatos = new Ext.grid.GridPanel({
            id:'gpDatos',
            title:'Datos persona',
            region:'center',
            columns: [
                {header:'Campo', width: 90, sortable: true, dataIndex: 'campo'}
                ,{header: 'Valor', width: 90, sortable: true, dataIndex: 'valor'}
            ],
            stripeRows: true,
            autoScroll:true,
            border: false,
            width: '100%',
            heigth: '100%',
            viewConfig: {forceFit: true},
            store: this.storeDatos,
            sm: this.smDato,
            //plugins:this.expanderObra,
            loadMask:{msg : 'cargando'},
        });



        this.pDatosPeriodo= new Ext.Panel({
            region     : 'center',
            height     : 95,
            width      : 300,
            //split      : true,
            autoScroll : true,
           // collapsible: true,
            //autoHeight: true,
            resizable: false,
        });

        this.pDatos= new Ext.Panel({
            layout      : 'border',
            region     : 'north',
            height     : 95,
            width      : 300,
            //split      : true,
            autoScroll : true,
           // collapsible: true,
            resizable: false,

            items:[this.pDatosPeriodo]
        });

        this.items = [this.pDatos,this.gpDatos];
        Pvd.Nomina.Pago.Datossubmayor.superclass.initComponent.call(this);

        },

    CompletarDatos                         : function (datos,idpersona) {

        var dat = {
            idelaborarpagos: null,
            idtipopago: null,
            tipopago: '',
            periodopago:'',
            fechapago:'',
            fechainicioperiodo:'',
            fechafinperiodo:'',

        };
        Ext.Ajax.request({
            url: '/pvd/nomina/index.php/gestretencion/obteneridelaborarpago',
            method: 'POST',
            params: {
                idnomina: datos.idnomina,
                idpersona: idpersona
            },
            callback: function (options, success, response) {
                responseData = Ext.decode(response.responseText);

                dat.tipopago = responseData.indicadores.tipopago;
                dat.periodopago = responseData.indicadores.periodopago;
                //dat.fechapago = responseData.indicadores.fechapago;
                dat.fechainicioperiodo = responseData.indicadores.fechainicioperiodo;
                dat.fechafinperiodo = responseData.indicadores.fechafinperiodo;
                var datospersona = responseData.valores;

                this.plantillaDatosNomina.overwrite(this.pDatosPeriodo.body, dat);
                var Aux = []
               Ext.each(datospersona,function(val){
                   Aux.push([val.campo,val.valor]);
               });
                this.storeDatos.loadData(Aux);

            }.createDelegate(this)
        });
    },


});

