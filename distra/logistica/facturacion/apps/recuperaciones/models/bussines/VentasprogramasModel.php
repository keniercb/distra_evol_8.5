<?php

/**
 *  Esta clase gestiona las facturas emitidas
 * @copyright XETID
 * @author Divicion de Gestion de Entidades
 * @version 1.0
 */
class VentasprogramasModel extends BaseModel
{

    public function __construct()
    {
        parent::__construct();
    }
    public function cargarActividadesExistentes($param){
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

        public function cargarOrganismos($param){

            //print_r($param);die;
            $conn = Zend_Registry::get('conexion');
            $select = "Select org.idorganismo,org.codigo,org.nombre";
            $from = " FROM mod_crmclienteproveedor.nom_organismo org";
            $limit = "";  
            if ($param['limit']) {
                $limit.= " LIMIT {$param['limit']} ";
            }
            if ($param['start']) {
                $limit.= "OFFSET {$param['start']} ";
            }
            if($param['criterio']){
                $from.= " where org.codigo ILIKE '%{$param['criterio']}%' or org.nombre ILIKE '%{$param['criterio']}%'";
            }
            $total = LogisticaDoctrineHelper::__init()->getConnection()->execute($select. $from)
            ->fetchAll(PDO::FETCH_ASSOC);

            $result = $conn->execute($select.$from.$filter.$limit)->fetchAll();

            return array('datos'=>$result, 'cantidad'=>count($total));           
        }


       
}
