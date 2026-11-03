/**
 * Created by Osleidy on 16/01/2017.
 */
objCrudGantt = new Utilidades.Cmp.Cmpgantt({
    urlCargarActividades: '/planificacion/pdo/plan/index.php/cmpdiagramagantt/actividadesparagantt',
    urlEliminarActividad: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/eliminaractividades',
    urlActualizarPorciento: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/Actualizarporcientodecumplimiento',
    urlModificarActividad: '/planificacion/pdo/plan/index.php/cmpdiagramagantt/modificarFechaGantt',
    urlCargarPlanes: '/planificacion/pdo/plan/index.php/cmpdiagramagantt/cargarComboPlanes',
    usarDependencia: true,
    usarCrudActividades: true,
    subsistemaInicial: 1
});
objCrudGantt.Gantt();
