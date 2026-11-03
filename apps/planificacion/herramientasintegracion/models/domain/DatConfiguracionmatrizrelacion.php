<?php

class DatConfiguracionmatrizrelacion extends BaseDatConfiguracionmatrizrelacion {

    public function setUp() {
        parent :: setUp();
        $this->hasMany('DatEstudiomatrizrelacion', array('local' => 'idconfiguracionmatrizrelacion', 'foreign' => 'idconfiguracionmatrizrelacion'));
    }

    public function getByid($idconfiguracionmatrizrelacion) {
        try {
            return Doctrine::getTable('DatConfiguracionmatrizrelacion')->find($idconfiguracionmatrizrelacion)->toArray();
        } catch (Exception $exc) {
            throw $exc;
        }
    }



    public function insertConfig($config) {
        try {
            $tipodato = $config['tipodato'] ? "true" : "false";
            $nombrerelacion = $config['nombrerelacion'] ?  $config['nombrerelacion'] : '';
            $total = $config['totaldatos'] ? "true" : "false";
            $cant = $config['cantrelaciones'] ? "true" : "false";
            $porciento = $config['porciento'] ? "true" : "false";
            $promedio = $config['promedio'] ? "true" : "false";
            $conn = Zend_Registry::get('conexion');
            $_query = "INSERT INTO mod_planifintegracion.dat_configuracionmatrizrelacion (tipodato,totaldatos,cantrelaciones,porciento,promedio,nombrerelacion)"
                    . " VALUES (" . $tipodato . "," . $total . "," . $cant . "," . $porciento . "," . $promedio . ",'$nombrerelacion' ) RETURNING idconfiguracionmatrizrelacion";
            $res = $conn->fetchAll($_query);
            return $res[0]["idconfiguracionmatrizrelacion"];
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    public function updateConfig($config) {
        try {
            $tipodato = $config['tipodato'] ? "true" : "false";
            $total = $config['totaldatos'] ? "true" : "false";
            $nombrerelacion = $config['nombrerelacion'] ?  $config['nombrerelacion'] : '';
            $cant = $config['cantrelaciones'] ? "true" : "false";
            $porciento = $config['porciento'] ? "true" : "false";
            $promedio = $config['promedio'] ? "true" : "false";
            $conn = Zend_Registry::get('conexion');
            $_query = "UPDATE mod_planifintegracion.dat_configuracionmatrizrelacion SET tipodato=" . $tipodato . ", totaldatos=" . $total . ", cantrelaciones=" . $cant . ", porciento=" . $porciento . ", promedio=" . $promedio . ",nombrerelacion= '$nombrerelacion' WHERE idconfiguracionmatrizrelacion=" . $config['idconfiguracionmatrizrelacion'] . " RETURNING idconfiguracionmatrizrelacion";
            $res = $conn->fetchAll($_query);
            return $res[0]["idconfiguracionmatrizrelacion"];
        } catch (Exception $exc) {
            throw $exc;
        }
    }

}
