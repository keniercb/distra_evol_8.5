<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class MovimientoLentoModel extends RecuperacionesInventarioModel
{
    private $serviciosConfiguracion;
    private $datosMaestrosHelper;

    public function __construct()
    {
        parent::__construct();
        $this->serviciosConfiguracion = ServiciosConfiguracionGeneralHelper::__init();
        $this->datosMaestrosHelper = DatosMaestrosHelper::__init();
        $this->arrayIddocs = array();
    }

    public function cargarProductos($params)
    {
        $encodeDeposito = Zend_Json::decode($params['idestructura']);
        //$diffDate = $this->calculaFecha($params['valor']);
        $fechafin = $params['fechafin']; 
        $fechafin = $fechafin ? "'{$fechafin}'" : 'null';
        $desde = $params['desde'] ? $params['desde'] : 'null';
        $hasta = $params['hasta'] ? $params['hasta'] : 'null';
        //$dateActual = $diffDate['fechafin'];
        $criterio = ($params['denominacion']) ? $params['denominacion'] : '';
        $idnaturaleza = ($params['idnaturaleza']) ? $params['idnaturaleza'] : 'null';
        $iddeposito = ($params['idestructura']) ? $params['idestructura'] : '{}';
        $idestructuracomun = $this->global->Estructura->idestructura;
        $idsubsistema = LogisticaGlobal::SUBSISTEMA_INV;
        $limit = $params['limit'];
        $start = $params['start'];


        $sql = "SELECT * FROM mod_loginventario.f_reclentomov(
          '{$iddeposito}',
          {$fechafin},
          {$desde},
          {$hasta},
          '{$criterio}',
          '{$idestructuracomun}',
          '{$idsubsistema}',
           {$idnaturaleza}
        )";
        $conn = Zend_Registry::get('conexion');
        return array(
            'cantidad' => $conn->execute($sql)->rowCount(),
            'datos' => $conn->execute($sql . " limit {$params['limit']} offset {$params['start']}")->fetchAll(PDO::FETCH_ASSOC)
        );
    }

    /* calcula una fecha, dada una cant de dias (fechaActual-dias = fechaFinal)
     * retorna un array
     * */
    public function calculaFecha($dias)
    {
        $fecha = $this->datosMaestrosHelper->getFechaContableSubsistemaObj(
                $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_INV);
        $dateActual = explode('/',$fecha->fecha);
        $dateActual = new DateTime("{$dateActual[2]}-{$dateActual[1]}-{$dateActual[0]}");
        $newDate = clone $dateActual;
        $day = ($dias) ? $dias : 0;
        $newDate = $newDate->modify("-{$day} day");
        return array('fechainicio' => $newDate->format('d-m-Y'), 'fechafin' => $dateActual->format('d-m-Y'));
    }


}
