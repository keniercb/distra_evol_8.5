objGestionarEstado = new Utilidades.Cmp.Cmpgestionarestado(
    {
        subsistemaLlamada: 'planif',
        noUsarPaginado: false,

    }
);
objGestionarEstado.cargarCmpGestionarEstados();