<?php

/**
 * Class NomRelacionModel
 * Clase que gestiona las relaciones de los permisos existentes de los conceptos
 *
 * @author    : Ing. Osvaldo M. Gonzalez Ortiz
 * @copyright Copyright (c) 2013 xetid
 */
class NomRelacionModel extends ZendExt_Model
{
    /**
     *
     */
    public function __construct()
    {
        parent::ZendExt_Model();
        $this->instance = new NomRelacion();
    }

    /**
     * Inserta un nuevo permiso a un concepto especificado
     *
     * @author    : Ing.Osvaldo Gonzalez
     *
     * @param $idPadre
     * @param $idHijo
     *
     * @return bool Retorna TRUE/FALSE en caso de realizar correctamente la inserción
     * @copyright Copyright (c) 2013 xetid
     */
    public function insertar($idPadre, $idHijo)
    {
        $this->instance->idrelacion = $this->buscarIdProximo();
        $this->instance->idpadre = $idPadre;
        $this->instance->idhijo = $idHijo;
        try{
            $this->instance->save();

            return true;
        } catch (Doctrine_Exception $ee){
            return false;
        }
    }

    /**
     * Elimina un permiso existente en un concepto especificado
     *
     * @author    : Ing.Osvaldo Gonzalez
     *
     * @param $idRelacion
     *
     * @return bool Retorna TRUE/FALSE en caso de realizar correctamente la eliminación
     * @copyright Copyright (c) 2013 xetid
     */
    public function eliminar($idRelacion)
    {
        $relacion = Doctrine::getTable('NomRelacion')->find($idRelacion);
        if (is_object($relacion)) {
            try{
                $result = $relacion->delete();

                return $result == 0 ? false : true;
            } catch (Doctrine_Exception $ee){
                return false;
            }
        }
    }

    /**
     * Devuelve el proximo id de la tabla
     *
     * @author    : Ing. Osvaldo M. Gonzalez
     * @return int : int, Devuelve el siguiente id de la tabla
     * @copyright Copyright (c) 2013 xetid
     */
    public function buscarIdProximo()
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getConnection('metaconfig');
        $query = Doctrine_Query::create($conn);
        $result = $query->select('max(a.idrelacion) as maximo')->from('NomRelacion a')->execute()->toArray();
        $proximo = isset($result[0]['maximo']) ? $result[0]['maximo'] + 1 : 1;

        return $proximo;
    }
}