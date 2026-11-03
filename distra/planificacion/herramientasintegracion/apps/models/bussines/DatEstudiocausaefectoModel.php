<?php

class DatEstudioCausaefectoModel extends ZendExt_Model
{
    public function setUp() {
        parent::ZendExt_Model();
    }

    public static function obtenerEstudioByProyecto($idproyecto) {
        return DatEstudiocausaefecto::obtenerEstudioByProyecto($idproyecto);
    }

    /**
     * @param $idProyecto
     * @return mixed
     */
    static function getByProyecto($idProyecto) {
        return DatEstudiocausaefecto::getByProyecto($idProyecto);
    }
}