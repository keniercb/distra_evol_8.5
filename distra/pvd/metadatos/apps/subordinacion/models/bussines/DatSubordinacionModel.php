<?php

/**
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 */
class DatSubordinacionModel extends ZendExt_Model
{
    /**
     * Descripción del método: Constructur de la clase
     *
     * @author    : Ing. Javier Limonta
     * @copyright Copyright (c) 2013 xetid
     */
    public function __construct()
    {
        parent::ZendExt_Model();
        $this->instance = new DatSubordinacion();
    }

    /**
     * Descripción del método: Inserta una nueva subordinación
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $idHijo
     * @param $idPadre
     * @param $idNomSub
     *
     * @return bool : Retorna true en caso de la nueva subordinacion sea insertada
     * @copyright Copyright (c) 2013 xetid
     */
    public function insertarSubordinacion($idHijo, $idPadre, $idNomSub)
    {
        $this->instance->idhijo = $idHijo;
        $this->instance->idpadre = $idPadre;
        $this->instance->idnomsubordinacion = $idNomSub;
        $this->instance->save();
        return TRUE;
    }

    /**
     * Descripción del método: Buqueda de la cantidad de hijos que
     * posee un hijo de una subordinacion especificada
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $idHijo
     * @param $idSub
     *
     * @return int : Retorna la cantidad de hijos que posee el elemento
     * @copyright Copyright (c) 2013 xetid
     */
    public function buscarExisteIdHijo($idHijo, $idSub)
    {
        $query = Doctrine_Query::create();
        $result = $query->select("idnomsubordinacion")
        ->from('DatSubordinacion')
        ->where("(idhijo = $idHijo AND idnomsubordinacion = $idSub)")
        ->execute()
        ->count();
        return $result;
    }

    /**
     * Descripción del método: Elimina una subordinacion especificada
     * y todos los elementos que la contienen como padre
     *
     * @author    : Ing. Javier Limonta
     * @modify    : Ing. Osvaldo M. Gonzalez
     *
     * @param $idEstructura
     * @param $idsub
     *
     * @return bool : Retorna TRUE en caso de que se hayan eliminado correctamente
     * @copyright Copyright (c) 2013 xetid
     */
    public function eliminarSubordinacion($idEstructura, $idsub)
    {
        $query = Doctrine_Query::create();
        $result = $query->from('DatSubordinacion')
        ->where("(idhijo = $idEstructura OR idpadre = $idEstructura ) AND idnomsubordinacion = $idsub ")
        ->execute();
        foreach ($result as $key => $value) {
            if ($key > 0) {
                $this->eliminarSubordinacion($value->idhijo, $idsub);
            }
            /** @noinspection PhpUndefinedMethodInspection */
            $value->delete();
        }
        return TRUE;
    }
}