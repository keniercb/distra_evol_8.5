<?php

class DatEstudiomatrizrelacion extends BaseDatEstudiomatrizrelacion {

    static function getByProyecto($idProyecto)
    {
        return Doctrine::getTable('DatEstudiomatrizrelacion')->findBy('idproyecto', $idProyecto)->toArray();
    }

    public function setUp() {
        try {
            parent:: setUp();
            $this->hasOne('DatProyecto', array('local' => 'idproyecto', 'foreign' => 'idproyecto'));
        } catch (Exception $exc) {
            echo $exc->getTraceAsString();
        }
    }

    public function getByid($idestudiomatrizrelacion) {
        try {
            return Doctrine::getTable('DatEstudiomatrizrelacion')->find($idestudiomatrizrelacion)->toArray();
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    public function getConfig($idproyecto) {
        try {
            $conn = Zend_Registry::get('conexion');
            $_query = "SELECT * FROM mod_planifintegracion.dat_estudiomatrizrelacion demr
                    LEFT JOIN mod_planifintegracion.dat_configuracionmatrizrelacion dcmr
                    ON demr.idconfiguracionmatrizrelacion = dcmr.idconfiguracionmatrizrelacion
                    WHERE demr.idproyecto = ?";
            $res = $conn->fetchAll($_query, array($idproyecto));
            return $res[0];
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    public function setConfig($idproyecto, $idconfig) {
        try {
            $conn = Zend_Registry::get('conexion');
            $_query = "UPDATE mod_planifintegracion.dat_estudiomatrizrelacion SET idconfiguracionmatrizrelacion=" . $idconfig . " WHERE idproyecto=" . $idproyecto . " RETURNING idproyecto";
            $res = $conn->fetchAll($_query);
            return $res[0]["idproyecto"];
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    public function getTexts($idproyecto) {
        try {
            $conn = Zend_Registry::get('conexion');
            $_query = "SELECT DISTINCT idtexto, texto , dc.idcelda ,dcf.* FROM  mod_planifintegracion.dat_estudiomatrizrelacion  emr
                        INNER JOIN mod_planifintegracion.dat_columnafila dcf ON emr.idestudiomatrizrelacion=dcf.idestudiomatrizrelacion
                        INNER JOIN mod_planifintegracion.dat_celda dc ON dcf.idcolumnafila=dc.idcolumna OR dcf.idcolumnafila=dc.idfila
                        INNER JOIN mod_planifintegracion.dat_texto dt ON dc.idcelda=dt.idcelda
                        WHERE  idproyecto=$idproyecto";
            $res = $conn->fetchAll($_query);
            return $res;
        } catch (Exception $exc) {
            throw $exc;
        }
    }

}
