<?php

class DatCelda extends BaseDatCelda {

    public function setUp() {
        parent :: setUp();
        $this->hasOne('DatColumnafila', array('local' => 'idcolumna', 'foreign' => 'idcolumnafila'));
        $this->hasOne('DatColumnafila', array('local' => 'idfila', 'foreign' => 'idcolumnafila'));
        $this->hasMany('DatTexto', array('local' => 'idcelda', 'foreign' => 'idcelda'));
    }

    public function getByid($idcelda) {
        return Doctrine::getTable('DatCelda')->find($idcelda)->toArray();
    }

    public function getCell($colId, $rowId) {
        try {
            $conn = Zend_Registry::get('conexion');
            $_query = "SELECT idcelda FROM mod_planifintegracion.dat_celda WHERE idcolumna=$colId AND idfila=$rowId;";
            $res = $conn->fetchAll($_query);
            return $res[0];
        } catch (Exception $exc) {
            throw $exc;
        };
    }

    public function getCells($colIds, $rowIds) {
        try {
            $idsColls = "(" . implode(",", $colIds) . ")";
            $idsRows = "(" . implode(",", $rowIds) . ")";
            $conn = Zend_Registry::get('conexion');
            $_query = "SELECT dc.idcelda,dt.idtexto,dc.idcolumna,dc.idfila,dc.numero, dt.texto FROM mod_planifintegracion.dat_celda dc
                        LEFT JOIN  mod_planifintegracion.dat_texto dt ON  dc.idcelda= dt.idcelda
                        WHERE dc.idcolumna IN $idsColls
                        AND dc.idfila IN $idsRows";
            $res = $conn->fetchAll($_query);
            return $res;
        } catch (Exception $exc) {
            throw $exc;
        };
    }

    public function addCell($pParams) {
        try {
            $conn = Zend_Registry::get('conexion');
            $column = $pParams["column"];
            $row = $pParams["row"];
            $numberName = $pParams["value"]["new"]["number"] ? ", numero" : "";
            $numberVal = $pParams["value"]["new"]["number"] ? ", " . $pParams["value"]["new"]["number"] : "";
            $_query = "INSERT INTO mod_planifintegracion.dat_celda(idcolumna, idfila $numberName) VALUES ($column ,$row $numberVal)RETURNING idcelda;";
            $res = $conn->fetchAll($_query);
            return $res[0];
        } catch (Exception $exc) {
            throw $exc;
        };
    }

    public function delCell($pParams) {
        try {
            $conn = Zend_Registry::get('conexion');
            $column = $pParams["column"];
            $row = $pParams["row"];
            $_query = "DELETE FROM mod_planifintegracion.dat_celda WHERE idcolumna=$column AND idfila=$row RETURNING idcelda;";
            $res = $conn->fetchAll($_query);
            return $res[0];
        } catch (Exception $exc) {
            throw $exc;
        };
    }

    public function updateNumberCell($pParams) {
        try {
            $conn = Zend_Registry::get('conexion');
            $column = $pParams["column"];
            $row = $pParams["row"];
            $number = $pParams["number"];
            $_query = "UPDATE mod_planifintegracion.dat_celda SET numero=$number WHERE idcolumna=$column AND idfila=$row RETURNING idcelda;";
            $res = $conn->fetchAll($_query);
            return $res[0];
        } catch (Exception $exc) {
            throw $exc;
        };
    }

}
