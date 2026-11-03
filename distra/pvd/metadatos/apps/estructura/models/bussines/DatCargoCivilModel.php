<?php

/**
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 */
class DatCargoCivilModel extends ZendExt_Model
{
    public function __construct()
    {
        parent::ZendExt_Model();
        $this->instance = new DatCargocivil();
    }

    /**
     *  Descripción del método: Inserta un cargo civil
     *
     * @author    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     * @modify    : Ing. Yoandry Borges
     *
     * @param $idCargo
     * @param $datos
     * @param $proyecto
     *
     * @return mixed : Permite insertar el elemento en la base de datos
     * @copyright Copyright (c) 2013 xetid
     */
    public function insertarCargoCivil($idCargo, $datos, $proyecto)
    {
        $this->instance->idcargo = $idCargo;
        $this->instance->idcategocup = $datos['idCategoria'];
        $this->instance->idproyecto = $proyecto;
        $this->instance->save();

        return true;
    }

    /**
     * Descripción del método: Busca la cantidad de elementos que existen con
     * los id correspondientes a los pasados por parametros
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @params    : $idCargo, id de la tabla Cargo
     * @params    : $idCategocup, id de la tabla categoria ocupacional
     *
     * @copyright Copyright (c) 2013 xetid
     */
    public function existeCargoCivil($idCargo, $idCategoria)
    {
        $query = new Doctrine_Query();
        $datos = $query->from('DatCargocivil')->where("idcargo = $idCargo, idcategocup = $idCategoria")->execute();
        $result = $datos->toArray();

        return (count($result)) > 0 ? true : false;
    }

    /**
     * Descripción del método: Modifica una cargo civil determinado
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param     : $idCargo
     * @param     : $datos
     * @param     : $proyecto
     *
     * @return bool
     * @copyright Copyright (c) 2013 xetid
     */
    public function modificarCargoCivil($idCargo, $datos, $proyecto)
    {
        $object = Doctrine::getTable('DatCargocivil')->findByDql("idcargo = $idCargo AND idproyecto = $proyecto")
                          ->getFirst();
        if (is_object($object)) {
            $object->idcategocup = $datos['idCategoria'];
            $object->save();

            return true;
        } else {
            return $this->insertarCargoCivil($idCargo, $datos, $proyecto, true);
        }
    }
}
