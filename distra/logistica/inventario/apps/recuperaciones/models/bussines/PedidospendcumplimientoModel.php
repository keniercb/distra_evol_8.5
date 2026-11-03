<?php
/**
 * Esta clase gestiona el acceso a datos de los documentos en proceso
 * @copyright XETID
 * @author Divicion de Gestion de Entidades
 * @version 1.0
 */
class PedidospendcumplimientoModel extends DocumentoLogisticaModel
{
    private $serviciosConfiguracion;

    public function __construct()
    {
        parent::__construct(array('noexception' => true ,'alias'=>'pedido'));
        $this->serviciosConfiguracion = ServiciosConfiguracionGeneralHelper::__init();
    }
    /**
     * Funcion que permite obtener los documentos en proceso.
     * @params $params (arreglo de parametros a filtrar)
     * @author Manuel Yhon Figueroa
     * @return array
     */
    public function getDocumentos($params = array())
    {/*
        $sql = "select * from mod_loginventario.f_recpedidopendientecumpto(
             {$params['idestructura']},
            {$params['criterio']},
            {$params['valor']},
            {$this->global->Estructura->idestructura},{$params['subsistema']}) ";
        $conn = Zend_Registry::get('conexion');
        return array(
            'cantidad' => $conn->execute($sql)->rowCount(),
            'datos' => $conn->execute($sql . " limit {$params['limit']} offset {$params['start']}")->fetchAll(PDO::FETCH_ASSOC)
        );*/
        $params['idestructura'] = Zend_Json::decode($params['idestructura']);
        $params['porsubsistema'] = true;
        $params['subsistema'] = LogisticaGlobal::SUBSISTEMA_INV;
        $params['alias'] = array('pedido');
        $query = $this->devolverDocumentos($params);
        $query->addSelect(
            "(Case when (SELECT Count(__dppd.estado) FROM DatProductopedido __dppd "
            . "WHERE __dppd.idpedido = d.iddocumento and __dppd.estado = 1)>0 then 1"
            ." WHEN (SELECT Count(__dppd1.estado) FROM DatProductopedido __dppd1 "
            ." WHERE __dppd1.idpedido = d.iddocumento and __dppd1.estado = 3)>0 then 3"
            ." WHEN (SELECT Count(__dppd2.estado) FROM DatProductopedido __dppd2 "
            ." WHERE __dppd2.idpedido = d.iddocumento and __dppd2.estado = 2)>0 then 2"
            ." else 0 end) as estadopedido"
        );
        $query->addSelect(
            "(SELECT dp.fechavencimiento FROM DatPedido dp "
            . "WHERE dp.iddocumento = d.iddocumento) as fechavencimiento"
        );
        $query->addSelect(
            "(SELECT COUNT(_dpp.idpedido) FROM DatProductopedido _dpp "
            . "WHERE _dpp.idpedido = d.iddocumento and _dpp.servicio = 0) as productos "
        );
        $query->addSelect(
            "(SELECT COUNT(_dpps.idpedido) FROM DatProductopedido _dpps "
            . "WHERE _dpps.idpedido = d.iddocumento and _dpps.servicio = 1) as servicios "
        );
        $query->addSelect(
            "(SELECT COUNT(_drp.idpedido) FROM DatReclamopedido _drp "
            . "WHERE _drp.idpedido = d.iddocumento) as reclamos "
        );
        $query->addWhere(
            "(SELECT COUNT(n.estado) FROM DatProductopedido n "
            . "WHERE n.idpedido = d.iddocumento and n.estado = 4) = 0"
        );
        if($params['numeroref']){
            $query->addWhere("d.numeroref =?",$params['numeroref']);
        }
        return array('cantidad' => $query->count(),
            'iddoc' => $this->getIddoc(),
            'datos' => $this->cargarClientesDocumentos(
                LogisticaDoctrineHelper::__init()->addQueryLimits($query, $params)->fetchArray()
            )
        );
    }

    /**
     * Funcion que permite obtener los clientes.
     * @params $params (arreglo de parametros a filtrar)
     * @author Manuel Yhon Figueroa
     * @return array
     */
    public function cargarClientes($parametros)
    {
        $idcliente = $this->serviciosConfiguracion->getClienteProveedorByUser($this->global->Perfil->idusuario);
        $filtro = array();
        $filtro['nombre'] = $parametros['query'];
        $clientes = $this->serviciosConfiguracion->getClientesProveedorByParams(
            $idcliente, $this->global->Estructura->idestructura, true, true, false, $filtro, $parametros['start'],
            $parametros['limit']
        );
        return $clientes;
    }
}