<?php

/**
 *  Esta clase gestiona el acceso a datos de los productos mínimos y máximos
 * @copyright XETID
 * @author Divicion de Gestion de Entidades
 * @version 1.0
 */
class DocEmitidosRecibidosModel extends RecuperacionesInventarioModel
{
    public function __construct()
    {
        $this->configuracionHelper = ServiciosConfiguracionGeneralHelper::__init();
        parent::__construct();
    }

    public function devolverTipoDocumento($criterio)
    {
        $filtro['denominacion'] = $criterio;
        return $this->configuracionHelper->documentosPorSubsistemaEntidad(
                LogisticaGlobal::SUBSISTEMA_INV, $this->global->Estructura->idestructura, $filtro
            );
    }

    public function devolverClientesProveedores($params)
    {
        $clientesProveedores = $this->configuracionHelper->getClientesProveedorByParams(
            null, $this->global->Estructura->idestructura, true, true, true, $params['criterio'],
            $params['start'], $params['limit']
        );

       return $clientesProveedores;
    }

}
