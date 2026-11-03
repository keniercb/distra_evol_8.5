Ext.ns('Ext.Persona');

Ext.Persona.factoryFieldsSituacionLaboral = function (readOnly) {
    var id = Ext.id();

    var dfDesde = {
        xtype: 'datefield',
        id: 'fdesde' + id,
        name: 'fdesde',
        fieldLabel: 'Desde',
        anchor: '90%',
        format: 'd/m/Y',
        editable: true,
        readOnly: false,
        allowBlank: false,
        anchor: '90%',
        vtype: 'daterange',
        endDateField: 'fhasta' + id
    };

    var dfHasta = {
        xtype: 'datefield',
        id: 'fhasta' + id,
        name: 'fhasta',
        fieldLabel: 'Hasta',
        anchor: '100%',
        format: 'd/m/Y',
        editable: true,
        hideParent: true,
        readOnly: false,
        anchor: '90%',
        vtype: 'daterange',
        startDateField: 'fdesde' + id
    };

    var cbSituacionLaboral = {
        xtype: 'combo_situacion',
        allowBlank: false,
        readOnly: true,
        selectOnFocus: true,
        editable: false,
        name: 'denomsituacion',
        hideParent: true,
        anchor: '90%'
    };

    var tfEntidad = {
        xtype: 'textfield',
        fieldLabel: 'Entidad',
        name: 'denomentidad',
        anchor: '90%',
        readOnly: readOnly || false,
        hideParent: true
    };

    var tfArea = {
        xtype: 'textfield',
        allowBlank: true,
        fieldLabel: '&Aacute;rea',
        name: 'denomarea',
        readOnly: readOnly || false,
        anchor: '90%',
        hideParent: true
    };

    var tfCargo = {
        xtype: 'trigger',
        allowBlank: false,
        fieldLabel: 'Cargo',
        name: 'denomcargo',
        readOnly: readOnly || false,
        anchor: '100%',
        triggerClass: 'x-form-search-trigger',
        hideParent: true
    };

    var tfNoAlta = {
        xtype: 'textfield',
        fieldLabel: 'No alta',
        name: 'noalta',
        anchor: '90%',
        regex: /(^[\d*]+)(\/[\d*]{4})$/,
        regexText: 'Formato: #/Fecha, Ej:78/' + new Date().format('Y')
    };

    return {
        dfDesde: dfDesde,
        dfHasta: dfHasta,
        cbSituacionLaboral: cbSituacionLaboral,
        tfEntidad: tfEntidad,
        tfArea: tfArea,
        tfCargo: tfCargo,
        tfNoAlta: tfNoAlta
    };
}