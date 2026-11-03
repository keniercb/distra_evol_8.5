<?php

/**
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 */
class DatCargoMilitarModel extends ZendExt_Model
{
    /**
     * Constructor de la clase
     */
    public function __construct()
    {
        parent::ZendExt_Model();
        $this->instance = new DatCargomilitar();
    }

    /**
     * Descripción del método: Inserta un nuevo cargo militar
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     * @modify    : Ing. Daymel Machado Cabrera
     *
     * @param $idCargo
     * @param $datos
     * @param $proyecto
     *
     * @return int Devuelve el identificador del cargo
     * @copyright Copyright (c) 2013 xetid
     */
    public function insertarCargoMilitar($idCargo, $datos, $proyecto)
    {
        $this->instance->idcargo = $idCargo;
        $this->instance->idgrado = $datos[idGrado];
        $this->instance->idproyecto = $proyecto;
        $this->instance->save();

        return $idCargo;
    }

    /**
     * Modifica el cargo militar definido
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     *
     * @param $idCargo
     * @param $datos
     * @param $proyecto
     *
     * @return bool
     * @copyright Copyright (c) 2013 xetid
     */
    public function modificarCargoMilitar($idCargo, $datos, $proyecto)
    {
        $object = Doctrine::getTable('DatCargomilitar')->findByDql("idcargo = $idCargo AND idproyecto = $proyecto")
                          ->getFirst();
        if (is_object($object)) {
            $object->idgrado = $datos[idGrado];
            $object->save();

            return true;
        } else {
            return $this->insertarCargoMilitar($idCargo, $datos, $proyecto);
        }
    }
}
