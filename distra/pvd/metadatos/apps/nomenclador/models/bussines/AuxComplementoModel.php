<?php

/**
 * Descripción del método: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate  *
 * @copyright Copyright (c) 2013 xetid
 * @version   Release: @package_version@
 */
class AuxComplementoModel extends ZendExt_Model
{
    /**
     *
     */
    public function __construct()
    {
        parent::ZendExt_Model();
        $this->instance = new AuxComplemento();
    }

    /**
     * Descripción del método: Inserta una nueva complemento
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     *
     * @param $idcomplemento
     *
     * @return bool :bool Devuelve TRUE en caso de que se haya adicionado satisfactoriamente
     * @copyright Copyright (c) 2013 xetid
     */
    public function insertar($idcomplemento)
    {
        $object = new AuxComplemento();
        $object->idcomplemento = $idcomplemento;
        $object->save();

        return true;
    }

    /**
     * Descripción del método: Elimina un complemento determinado
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     *
     * @param $idcomplemento
     *
     * @return bool :bool Devuelve TRUE en caso de que se haya eliminado satisfactoriamente
     * @copyright Copyright (c) 2013 xetid
     */
    public function eliminar($idcomplemento)
    {
        $object = Doctrine::getTable('AuxComplemento')->find($idcomplemento);
        if (is_object($object)) {
            $object->delete();

            return true;
        }

        return false;
    }
}