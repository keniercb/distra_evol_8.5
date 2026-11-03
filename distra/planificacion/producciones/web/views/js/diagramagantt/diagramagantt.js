objCrudGantt = new Utilidades.Cmp.Cmpcrudgantt({
    maxWinPrincipal:true,
    noUsarCerrarWinP:true,
    urlCargarActividades: '/planificacion/pdo/plan/index.php/cmpdiagramagantt/actividadesparagantt',
    urlEliminarActividad: '/planificacion/pdo/plan/index.php/cmpgestionaractividades/eliminaractividades',
    urlActualizarPorciento:'/planificacion/pdo/plan/index.php/cmpgestionaractividades/Actualizarporcientodecumplimiento',
    urlModificarActividad:'/planificacion/pdo/plan/index.php/cmpdiagramagantt/modificarFechaGantt',
    urlCargarPlanes: '/planificacion/pdo/plan/index.php/cmpdiagramagantt/cargarComboPlanes',
    usarDependencia:true,
    usarCrudActividades:true
});
objCrudGantt.Gantt();