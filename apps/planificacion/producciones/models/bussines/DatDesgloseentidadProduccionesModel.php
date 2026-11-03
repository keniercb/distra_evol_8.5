<?php

//require_once __DIR__ . '/../../planmeta/models/bussines/DatDesgloseentidadModel.php';

class DatDesgloseentidadProduccionesModel extends DatDesgloseentidadModel {

    public function setUp() {
        parent::ZendExt_Model();
    }

    /*     * *** FUNCION DE INTEGRACION DE BASE DEL PLAN CON PLAN **** */

    public function actualizarPlan($params) {
        $modelPlan = new DatModeloModel();
        $arrayColumnasnomencladastablametadato = $modelPlan->servicioBp($params['idtipomodelo']);
        $arrayParametros = array();
        $arrayParametros[] = $params['idEstructura'];
        $arrayParametros[] = $params ['idmodelo'];
        $arrayParametros[] = $arrayColumnasnomencladastablametadato['idtabla'];
        $arrayParametros[] = $params ['iddesglose'];
        $arrayParametros[] = $params['idejercicio'];
        $arrayParametros[] = $params ['idespecialidad'];
        if ($params['tipoplan'] == 1)
            $arrayParametros[] = 'ip.precioventa';
        else
        if ($params['tipoplan'] == 0)
            $arrayParametros[] = 'ip.precio';
        //print_r($arrayParametros);die;
        $conn = Doctrine_Manager:: connection();
        $query = "select * from mod_spouam.f_integraciondesglose11(?,?,?,?,?,?,?)";
        $res = $conn->execute($query, $arrayParametros);
        $result = $res->fetchAll();
        /* $idmodelo = $params ['idmodelo'];
          $tieneSalida = Doctrine::getTable('DatActividadmodelosalida')->findByDql("idmodelo = $idmodelo");
          if ($tieneSalida[0]->idmodelo != null) {
          $query = "select * from mod_planificacion.f_integraciondesglosesalida(?,?,?,?,?,?,?)";
          $res = $conn->execute($query, $arrayParametros);
          $result = $res->fetchAll();
          } */
        return 1;
    }

    /*     * *** FIN FUNCION DE INTEGRACION DE BASE DEL PLAN CON PLAN **** */
}
