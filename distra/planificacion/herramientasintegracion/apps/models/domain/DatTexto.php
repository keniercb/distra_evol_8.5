<?php

class DatTexto extends BaseDatTexto {

    public function setUp() {
        parent :: setUp();
        $this->hasOne('DatCelda', array('local' => 'idcelda', 'foreign' => 'idcelda'));
    }

    public function getByid($idtexto) {
        return Doctrine::getTable('DatTexto')->find($idtexto);
    }

    public function add($idcelda, $text) {
        try {
            $conn = Zend_Registry::get('conexion');
            $_query = "INSERT INTO mod_planifintegracion.dat_texto(idcelda, texto) VALUES ( $idcelda, '$text');";
            $res = $conn->fetchAll($_query);
            return $res[0];
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    public function delete($idtexto) {
        try {
            $conn = Zend_Registry::get('conexion');
            $_query = "DELETE FROM mod_planifintegracion.dat_texto WHERE idtexto=$idtexto RETURNING idtexto;";
            $res = $conn->fetchAll($_query);
            return $res[0];
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    public function update($idtexto, $text) {
        try {
            $conn = Zend_Registry::get('conexion');
            $_query = "UPDATE mod_planifintegracion.dat_texto SET texto='$text'  WHERE idtexto=$idtexto RETURNING idtexto;";
            $res = $conn->fetchAll($_query);
            return $res[0];
        } catch (Exception $exc) {
            throw $exc;
        }
    }

}
