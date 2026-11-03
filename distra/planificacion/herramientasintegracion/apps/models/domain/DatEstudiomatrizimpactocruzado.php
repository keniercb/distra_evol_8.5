<?php

class DatEstudiomatrizimpactocruzado extends BaseDatEstudiomatrizimpactocruzado
{
    public function setUp() {
        parent:: setUp();
        $this->hasOne ('DatProyecto', array ('local' => 'idproyecto', 'foreign' => 'idproyecto'));
    }

    public function getByid($idestudiomatrizimpactocruzado) {
        return Doctrine::getTable('DatEstudiomatrizimpactocruzado')->find($idestudiomatrizimpactocruzado)->toArray();
    }

    /**
     * @copyright XETID Cuba
     * @author Ing Grabiel Montero Coello
     * @name getByProyecto
     * @param $idProyecto :Identificador del proyecto
     * @return mixed
     */
    static function getByProyecto($idProyecto) {
        return Doctrine::getTable('DatEstudiomatrizimpactocruzado')->findBy('idproyecto', $idProyecto, Doctrine::HYDRATE_ARRAY);
    }
}