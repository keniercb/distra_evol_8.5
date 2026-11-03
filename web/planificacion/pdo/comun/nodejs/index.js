/*
 * Servidor tcp(socket-io)
 */

var io = require('socket.io'),
        http = require('http'),
        //dateFormat = require('dateformat'),
        socket = io.listen(9877); //puerto que no este en uso

socket.on('connection', function(client) {
    try {

        function dateFormat (date, fstr, utc) {
            utc = utc ? 'getUTC' : 'get';
            return fstr.replace (/%[YmdHMS]/g, function (m) {
                switch (m) {
                    case '%Y': return date[utc + 'FullYear'] (); // no leading zeros required
                    case '%m': m = 1 + date[utc + 'Month'] (); break;
                    case '%d': m = date[utc + 'Date'] (); break;
                    case '%H': m = date[utc + 'Hours'] (); break;
                    case '%M': m = date[utc + 'Minutes'] (); break;
                    case '%S': m = date[utc + 'Seconds'] (); break;
                    default: return m.slice (1); // unknown code, remove %
                }
                // add leading zero if required
                return ('0' + m).slice (-2);
            });
        }

        setInterval(function() {
            var fecha_hora_server = dateFormat( new Date(), "%d/%m/%Y %H:%M:%S", false);
            client.emit("validarIncumplimiento", fecha_hora_server);
        }, 10000); // se va a realizar la peticion cada 1 min
        
        client.on('disconnect', function() {});

        client.on('actualizarPorcientoCumplimiento', function(data) {
            client.broadcast.emit('actualizarPorcientoCumplimiento', data);
            //client.emit('actualizarPorcientoCumplimiento', data);
        });

        client.on('actualizarPorcientoCumplimientoDesdePert', function(data) {
            client.emit('actualizarPorcientoCumplimiento', data);
            client.broadcast.emit('actualizarPorcientoCumplimiento', data);
        });

        client.on('obtenerFechaHora', function() {
            client.emit('obtenerFechaHora', dateFormat( new Date(), "%d/%m/%Y %H:%M:%S", false));
        });

    }
    catch (exc) {
        client.emit('console', exc);
    }
});