<?php

/**
 * @class     PedidoService
 * Aqui se encuentran todos los servicios de pedido
 *
 * @copyright XETID
 * @author    DivisiÃ³n de GestiÃ³n de Entidades
 * @version   1.0
 */
class PedidoService extends ZendExt_Model
{
    private $pedido;

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->pedido = new PedidoModel(array('alias' => 'pedido', 'subsistema' => LogisticaGlobal::SUBSISTEMA_INV));
    }

    public function cargarDocPedido($params)
    {
        $params['estado'] = 3;
        if ($params['talleres'] == true) {
            $params['distribucion'] = false;
        } else {
            $params['distribucion'] = true;
        }
        $params['idejercicio'] = ServiciosConfiguracionGeneralHelper::__init()
            ->getEjercicioActualSubsistema($this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_INV);
        return $this->pedido->devolverDocumentos($params);
    }

    public function aprobarDistribucion($params)
    {
        return $this->pedido->aprobarDistribucion($params);
    }

    public function cargarProductosXPedido($idpedido, $servicio = 0)
    {
        return $this->pedido->productosByidPedido($idpedido, $servicio);
    }

    public function cargarServiciosXPedido($idpedido)
    {
        return $this->pedido->cargarServiciosExtras(array('idpedido' => $idpedido));
    }

    public function cargarClientesAprobados()
    {
        return $this->pedido->cargarClientesAprobados();
    }

    public function adicionarPedido($idcliente, $productos = array(), $servicios = array(), $idordentrabajo)
    {
        $confPedido = new ConfiguraciondistribucionService();
        $vigencia = $confPedido->devolverConfiguracion()[0]['vigenciapedido'];
        $date = date("d-m-Y");
        $mod_date = strtotime($date . "+ {$vigencia} days");
        $fechavencimiento = date("d-m-Y", $mod_date);
        $datos = array(
            'action' => 'adicionarDocumento',
            'productosExtras' => $productos,
            'serviciosExtras' => $servicios,
            'idcliente' => $idcliente,
            'fechavencimiento' => $fechavencimiento,
            'estado' => 3,
            'aprobadopor' => $this->global->Perfil->idusuario,
            'documentos' => array('idpadre' => $idordentrabajo)
        );
        return $this->pedido->adicionarDocumento($datos);
    }

    public function cargarPedidoByOrdenTrabajo($params)
    {
        $params['estado'] = 3;
        $params['idejercicio'] = ServiciosConfiguracionGeneralHelper::__init()
            ->getEjercicioActualSubsistema($this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_INV);
        return $this->pedido->cargarPedidoByOrdenTrabajo($params);
    }
    
    public function devolverProductosByPedido($params)
    {
        return $this->pedido->cargarProductosExtras($params);
    }

    public function cargarDocumentosGenerados($params)
    {
        return $this->pedido->getEstadoEjecucionPedido($params);
    }

}
