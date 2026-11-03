<?php

/**
 *  Esta clase gestiona las facturas emitidas
 * @copyright XETID
 * @author Divicion de Gestion de Entidades
 * @version 1.0
 */
class FacturasEmitidasModel extends BaseModel
{

    public function __construct()
    {
        parent::__construct();
    }

    public function cargarActividadesExistentes($param)
        {
            $conn = Zend_Registry::get('conexion');
            $selec = "Select ca.*";
            $from = " FROM  mod_logtaller.conf_actividad ca
                left join mod_logtaller.dat_actividadentidad dae on ca.idactividad = dae.idactividad";
            $where = " Where  dae.identidad = {$this->global->Estructura->idestructura} AND ca.idindicador is null";
            $limit = "";
            if ($param['limit']) {
                $limit.= " LIMIT {$param['limit']} ";
            }
            if ($param['start']) {
                $limit.= "OFFSET {$param['start']} ";
            }
            $total = LogisticaDoctrineHelper::__init()->getConnection()->execute($selec. $from. $where)
                ->fetchAll(PDO::FETCH_ASSOC);

            $result = $conn->execute($selec.$from.$where. $limit)->fetchAll();

            return array('datos'=>$result, 'cantidad'=>count($total));
        }


}
