/**
 * Creado por Danilo Milán Araujo
 */

module.exports = function (sequelize, DataTypes) {
    var DatEventoavisodestinatario = sequelize.define('DatEventoavisodestinatario',
        {
            id: { type: DataTypes.INTEGER, primaryKey: true},
            idaviso: { type: DataTypes.INTEGER, primaryKey: true},
            iddestinatario: { type: DataTypes.INTEGER, primaryKey: true},
            idevento: { type: DataTypes.INTEGER, primaryKey: true},
            originadopor: { type: DataTypes.INTEGER},
            fecha : {type: DataTypes.STRING},
            estado: { type: DataTypes.INTEGER}
        },
        {
            schema: 'mod_notificaciones',
            schemaDelimiter: '.',
            tableName: 'dat_eventoavisodestinatario',
            classMethods: {
                associate: function (models) {
                    //DatRepambiente.hasMany(models.DatRepconfiguracion, {foreignKey: 'idambiente'})
                },
                obtenerCantidadesNotificacionesNoleidas : function(cb, cbError){
                    var query = 'select count(idtipoaviso) as cantidad, idtipoaviso ' +
                        'from mod_notificaciones.dat_eventoavisodestinatario as e ' +
                        'inner join mod_notificaciones.dat_aviso as a on a.idaviso = e.idaviso ' +
                        'where e.estado = 1 group by a.idtipoaviso order by a.idtipoaviso';
                    this.consultaSelect(query, null, cb, cbError);
                    
                },
                obtenerNotificacionesNoleidas : function(iddestinatarios, cb, cbError){

			iddestinatarios = iddestinatarios || [];
				if(iddestinatarios.length == 0||iddestinatarios[0]== ''){
		 cb([0]);
			}else{
				var destinatarios = [];
				iddestinatarios.forEach(function(id){
					id = id.trim();
				        if(id != '' && id != null){
						destinatarios.push(id);
					}
				});
				destinatarios =  destinatarios.join(',');

                    var query = "select  iddestinatario, a.idtipoaviso from  mod_notificaciones.dat_eventoavisodestinatario as e " +
                        "inner join mod_notificaciones.dat_aviso as a on a.idaviso = e.idaviso " +
                        "where e.estado = 1 and iddestinatario in ("+destinatarios +")";
			
                    this.consultaSelect(query, null , cb, cbError);
                    //this.consultaSelect(query, [destinatarios], cb, cbError);
			}
                    

                }

            },
            instanceMethods: {}
        });

    return DatEventoavisodestinatario
};


