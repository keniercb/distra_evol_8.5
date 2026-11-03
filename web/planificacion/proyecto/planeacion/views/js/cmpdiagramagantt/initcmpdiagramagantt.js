/**
 
 */
objCrudGantt = new Utilidades.Cmp.Cmpdiagramagantt({
    maxWinPrincipal: true,
    noUsarCerrarWinP: true,
    urlCargarActividades: '/planificacion/proyecto/planeacion/index.php/cmpdiagramagantt/cargarDiagramaDeGantt',
    //urlCargarActividades: '/planificacion/pdo/plan/index.php/cmpdiagramagantt/actividadesparagantt',
    urlEliminarActividad: '/planificacion/proyecto/planeacion/index.php/cmpgestionaractividades/eliminaractividades',
    urlActualizarPorciento: '/planificacion/proyecto/planeacion/index.php/cmpgestionaractividades/Actualizarporcientodecumplimiento',
    urlModificarActividad: '/planificacion/proyecto/planeacion/index.php/cmpdiagramagantt/modificarFechaGantt',
    urlCargarPlanes: '/planificacion/pdo/plan/index.php/cmpdiagramagantt/cargarComboPlanes',
    usarDependencia: true,
    usarCrudActividades: true
});
objCrudGantt.Gantt();
