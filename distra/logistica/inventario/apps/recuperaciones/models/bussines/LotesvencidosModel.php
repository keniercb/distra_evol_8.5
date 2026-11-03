<?php

class LotesvencidosModel extends RecuperacionesInventarioModel
{

    private $serviciosConfiguracion;

    public function __construct()
    {
        parent::__construct();
        $this->serviciosConfiguracion = ServiciosConfiguracionGeneralHelper::__init();
        $this->arrayIddocs = array();
    }

    public function cargarLotesVencidos($params)
    {
//        $conn = Doctrine_Manager:: connection();
        $desde = ($params['desde']) ?  "'{$params['desde']}'": 'null';
        $hasta = ($params['hasta']) ? "'{$params['hasta']}'" : 'null';
        $sql = "select * from mod_loginventario.f_reclotevencido (
                '{$params['idestructura']}',
                {$desde},
                {$hasta}
        )";

        /*$resp = $conn->execute($sql);
        $result = $resp->fetchAll(PDO::FETCH_ASSOC);
        return array('datos' => $result, 'cantidad' => count($result));*/

        $conn = Zend_Registry::get('conexion');
        $result = $conn->fetchAll($sql);

        return array( 'cantidad' => count($result) ,'datos' => $result);

    }

}