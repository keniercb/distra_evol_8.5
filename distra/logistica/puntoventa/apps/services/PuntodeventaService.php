<?php

if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class PuntodeventaService extends ZendExt_Model
{
    private $ventasModel, $terminalPuntoVenta, $pedidoTiendaModel;

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->ventasModel = new VentaspuntoventaModel();
        $this->terminalPuntoVenta = new TerminalpuntoventaModel();
        $this->pedidoTiendaModel = new PedidotiendaModel();
    }

    public function getJsNomencladores()
    {
        return '<script type="text/javascript"
        src="/logistica/facturacion/puntoventa/views/js/nomencladores/tipocaja.component.js"></script>
        <script type="text/javascript"
        src="/logistica/facturacion/puntoventa/views/js/nomencladores/modopago.component.js"></script>
        <script type="text/javascript"
        src="/logistica/facturacion/puntoventa/views/js/nomencladores/tasacambio.component.js"></script>
        <script type="text/javascript"
        src="/logistica/facturacion/puntoventa/views/js/nomencladores/tiempo.component.js"></script>
        <script type="text/javascript"
        src="/logistica/facturacion/puntoventa/views/js/nomencladores/descuento.component.js"></script>
        <script type="text/javascript"
        src="/logistica/facturacion/puntoventa/views/js/nomencladores/pos.component.js"></script>'
        ;
    }

    public function obtenerVentaRealizadaServicio($params)
    {
        return $this->ventasModel->ventasRealizadas($params);
    }

    public function cerrarSesionServicio($params)
    {
        return $this->terminalPuntoVenta->cerrarSesion($params);
    }
    
    public function cambiarEstadoVenta($params)
    {
        return $this->terminalPuntoVenta->cambiarEstadoVenta($params);
    }

    public function getImporteXEntidadesByIdop ($arrayIdOpcomercio, $fechainicio, $fechafin) {
        return $this->pedidoTiendaModel->getImporteXEntidadesByIdop($arrayIdOpcomercio, $fechainicio, $fechafin);
    }

    public function existeIdAbo($codigo, $idestructura)
    {
        return $this->ventasModel->existeIdAbo($codigo, $idestructura);
    }

    public function existeVentaCliente($idcliente, $idestructuracomun, $idestructuraop)
    {
        return $this->ventasModel->existeVentaCliente($idcliente, $idestructuracomun, $idestructuraop);
    }
}
