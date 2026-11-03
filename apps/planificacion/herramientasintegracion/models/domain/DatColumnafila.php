<?php

class DatColumnafila extends BaseDatColumnafila
{
    public function setUp() {
        parent:: setUp();
        $this->hasMany('DatEstudiomatrizrelacion', array('local' => 'idestudiomatrizrelacion', 'foreign' => 'idestudiomatrizrelacion'));
    }

    public function getByid($idcolumnafila) {
        return Doctrine::getTable('DatColumnafila')->find($idcolumnafila)->toArray();
    }

    public function insertColunmaFila($pParams) {
        try {
            $denom = $pParams['denominacion'];
            $idestudio = $pParams['idestudiomatrizrelacion'];
            $desc = $pParams['descripcion'] ? $pParams['descripcion'] : "";
            $fila = $pParams['fila'] ? "true" : "false";
            $conn = Zend_Registry::get('conexion');
            $_query = "INSERT INTO mod_planifintegracion.dat_columnafila (denominacion,descripcion,fila,idestudiomatrizrelacion)
            VALUES ('" . $denom . "','" . $desc . "'," . $fila . "," . $idestudio . ") RETURNING idcolumnafila";
            $res = $conn->fetchAll($_query);
            return $res[0]['idcolumnafila'];
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    public function getColumns($idproyecto) {
        try {
            $conn = Zend_Registry::get('conexion');
            $_query = "SELECT * FROM mod_planifintegracion.dat_columnafila dcf WHERE idestudiomatrizrelacion=$idproyecto AND fila=false";
            $res = $conn->fetchAll($_query);
            return $res;
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    public function getRows($idproyecto) {
        try {
            $conn = Zend_Registry::get('conexion');
            $_query = "SELECT * FROM mod_planifintegracion.dat_columnafila dcf WHERE idestudiomatrizrelacion=$idproyecto AND fila=true";
            $res = $conn->fetchAll($_query);
            return $res;
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    public function getColumnsRows($idproyecto) {
        try {
            $conn = Zend_Registry::get('conexion');
            $_query = "SELECT * FROM mod_planifintegracion.dat_columnafila dcf WHERE idestudiomatrizrelacion=$idproyecto";
            $res = $conn->fetchAll($_query);
            return $res;
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    public function deleteColunmaFila($pParams) {
        try {
            $conn = Zend_Registry::get('conexion');
            $_query = "DELETE FROM mod_planifintegracion.dat_columnafila dcf WHERE dcf.idcolumnafila=" . $pParams['idcolumnrow'] . " AND dcf.idestudiomatrizrelacion=" . $pParams['idestudiomatrizrelacion'] . " RETURNING dcf.idcolumnafila";
            $res = $conn->fetchAll($_query);
            return $res[0];
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    public function updateColunmaFila($pParams) {
        try {
            $denom = $pParams['denominacion'];
            $idestudio = $pParams['idestudiomatrizrelacion'];
            $desc = $pParams['descripcion'] ? $pParams['descripcion'] : "";
            $idcolumnRow = $pParams['idcolumnrow'];
            $conn = Zend_Registry::get('conexion');
            $_query = "UPDATE mod_planifintegracion.dat_columnafila dcf SET  denominacion='$denom', descripcion='$desc' WHERE dcf.idcolumnafila=$idcolumnRow AND dcf.idestudiomatrizrelacion=$idestudio;";
            $res = $conn->fetchAll($_query);
            return $res;
        } catch (Exception $exc) {
            throw $exc;
        }
    }
}