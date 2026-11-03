/**
 * Creado por Danilo Milán Araujo
 */
var comun = require('../common');

module.exports = function (controllerInstance) {
    var BsnNotificacion = controllerInstance.defineController('BsnNotificacion', {
        classMethods: {
            associate: function (controllers, models) {
                this.models = models;
                this.ctrl = controllers
            },
			idIntervalo: null,
            internalo : 10000,
            sendMsgRoom : function(sockets, room, data){
                sockets.in(room).emit('notificaciones', JSON.stringify(data));
			},
            sendMsgRooms : function(sockets, data){
                var me = this;
                var rooms = me.obtenerDestinatarios();
                rooms.forEach(function(room){
                    me.sendMsgRoom(sockets, room, data);
                })
			},
            sendAllClients : function(sockets, data){
				sockets.emit('notificaciones', JSON.stringify(data));
			},
            unirASala : function(client, iddestinatario){
                salas[client.id] = salas[client.id] || {};
                salas[client.id].room = iddestinatario;
                client.join(iddestinatario);
            },
            quitarDestinatario : function(client){
                delete salas[client.id];
            },
            /*
             * Obtener todos los destinatarios(rooms)
             * return Array --- Arreglo de las iddestinatarios(usuarios)
             */
            obtenerDestinatarios : function () {
                var rooms = [];
                for (var idcliente in salas) {
                    if (salas.hasOwnProperty(idcliente)) {
                        var room = salas[idcliente];
                        if(rooms.indexOf(room.room) == -1){
                            rooms.push(room.room);
                        }
                    }
                }
                return rooms;
            },
			comenzarMonitoreo: function(sockets){
				var me = this;
				if(me.idIntervalo == null){
                    me.obtenerCantidadesNotificaciones(sockets);
					me.idIntervalo = setInterval(function(){
						me.obtenerCantidadesNotificaciones(sockets);
					}, me.internalo);
				}
				
			},
            enviarDatos : function(sockets, notis){
                var me = this;
                var cantidad = 0;
                for(var destinatario in notis){
                    if (notis.hasOwnProperty(destinatario)) {
                        var cantidades = me.obtenerCantidadesPorDestinatario(notis[destinatario]);
                        me.sendMsgRoom(sockets, destinatario, {success: true, notificaciones: cantidades});
                    }
                    cantidad++;
                }
                if(cantidad == 0){
                    me.sendAllClients(sockets, {success: true, notificaciones: []});
                }
            },
            obtenerCantidadesNotificaciones : function(sockets){
                var me = this;
                var rooms = me.obtenerDestinatarios();
                me.obtenerNotificacionesPorIddestinatario(rooms, function(notis){
                    me.enviarDatos(sockets,  notis);
                }, function(e){
                    me.sendAllClients(sockets, {success: false});
                });
            },
            agruparPorDestinatarios : function(rows){
                var destinatarios = {};
                rows.forEach(function(row){
                    if(!destinatarios[row.iddestinatario]){
                        destinatarios[row.iddestinatario] = [];
                    }
                    destinatarios[row.iddestinatario].push(row.idtipoaviso);
                });
                return destinatarios;
            },
            obtenerCantidadesPorDestinatario : function(idstipoavisosDestinatario){
                var me = this;
                var result = [];
                var cantidades_idtipoaviso = {};
                idstipoavisosDestinatario.forEach(function(idtipoaviso){
                    if(!cantidades_idtipoaviso[idtipoaviso]){
                        cantidades_idtipoaviso[idtipoaviso] = 0;
                    }
                    cantidades_idtipoaviso[idtipoaviso] += 1;
                });
                for(var idtipoaviso in cantidades_idtipoaviso){
                    if (cantidades_idtipoaviso.hasOwnProperty(idtipoaviso)) {
                        var r = me.getData(idtipoaviso);
                        result.push({
                            cantidad: cantidades_idtipoaviso[idtipoaviso],
                            idtipoaviso : idtipoaviso,
                            tipo : r.tipo,
                            iconClass : r.iconClass,
                            titulo : r.titulo
                        })
                    }
                }
                return result;
            },
            obtenerNotificacionesPorIddestinatario : function(iddestinatarios, cb, cbError){
                var me = this;
                me.models.DatEventoavisodestinatario.obtenerNotificacionesNoleidas(iddestinatarios, function(datos){
                    var n = me.agruparPorDestinatarios(datos);
                    cb(n);
                }, cbError);
            },
            getData : function(idtipoaviso){
                var tipo = '';
                var iconClass = '';
                var titulo = '';
                switch(idtipoaviso){
                    case '1':
                        tipo = 'info';
                        iconClass = 'icon-infor';
                        titulo = 'Información';
                        break;
                    case '2':
                        tipo = 'warning';
                        iconClass = 'icon-warning-sign';
                        titulo = 'Advertencia';
                        break;
                    case '3':
                        tipo = 'error';
                        iconClass = 'icon-remove';
                        titulo = 'Error';
                        break;
                    default :
                        tipo = 'alert';
                        iconClass = 'icon-bullhorn';
                        titulo = 'Alerta';
                        break;
                }
                return {
                    tipo : tipo,
                    titulo : titulo,
                    iconClass: iconClass
                };
            },
			obtenerArrayNotificaciones : function(arreglo){
				var arr = [];

				arreglo.forEach(function(row){
                    arr.push(getData(row));
				});
				

				return arr;
			},
            /*
             * Desconectar cliente(eliminarlo del objeto salas)
             * @params cliente_sio Object --- Instancia del Socket-io del cliente conectado
             */
            desconectarCliente : function(sockets){
				var me = this;
				var clientes = sockets.clients();
				if(clientes.length -1 == 0){
					console.log('no hay clientes conectados');
					clearInterval(me.idIntervalo);
					me.idIntervalo = null;
				}
            },

       
            prueba : function(){
                console.log(__dirname +'/../../../web/replica/views/images/');

            }



        }
    });
    return BsnNotificacion;
};

