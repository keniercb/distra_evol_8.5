<?php

/**
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 */
class DatMedioModel extends ZendExt_Model
{
    /**
     * CONSTRUCTOR
     */
    public function __construct()
    {
        parent::ZendExt_Model();
        $this->instance = new DatMedio();
    }

    /**
     * Descripción del método: Inserta un nuevo medio en la estructura
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $idmedio
     * @param $datos
     * @param $idProyecto
     * @param $modificar
     *
     * @return void : Permite insertar el elemento en la base de datos
     * @copyright Copyright (c) 2013 xetid
     */
    public function insertar($idmedio, $idProyecto, $datos, $modificar = false)
    {
        $object = new DatMedio();
        $object->idmedio = $idmedio;
        $object->idtipomedio = $datos['idtipomedio'];
        $object->idnommedio = $datos['idnommedio'];
        $object->cantidad = $datos['cantidad'];
        $object->idicono = $datos['icono'];
        $object->idproyecto = $idProyecto;
        $object->idestado = ($idProyecto != 0) ? ($modificar) ? 2 : 1 : 0;
        $object->save();

        return true;
    }

    /**
     * Descripción del método: Modificar un medio en la estructura
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Yoandry Borges
     * @modify    : Ing. Daymel Machado
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $idmedio
     * @param $datos
     * @param $proyecto
     *
     * @return void : Permite modificar el elemento de la base de datos
     * @copyright Copyright (c) 2013 xetid
     */
    public function modificar($idmedio, $proyecto, $datos)
    {
        $object = Doctrine::getTable('DatMedio')->findByDql("idmedio = $idmedio AND idproyecto = $proyecto")->getFirst(
        );
        if (is_object($object)) {
            $object->idtipomedio = $datos['idtipomedio'];
            $object->idnommedio = $datos['idnommedio'];
            $object->cantidad = $datos['cantidad'];
            $object->idicono = $datos['icono'];
            $object->save();

            return true;
        } else {
            $this->insertar($idmedio, $proyecto, $datos, true);
        }

        return false;
    }
}

