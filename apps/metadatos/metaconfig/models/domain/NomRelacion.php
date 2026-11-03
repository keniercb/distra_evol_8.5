<?php

/**
 * Descripción de la clase: Generada por Doctrine Generate
 *
 * @author    : Generada por Doctrine Generate
 * @copyright Copyright (c) 2013 xetid
 * @version   Release: @package_version@
 */
class NomRelacion extends BaseNomRelacion
{
    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomConcepto', array('local' => 'idhijo', 'foreign' => 'idconcepto'));
    }

    /**
     * Obtiene el listado de todos los permisos existentes que posee un concepto
     * especificado
     *
     * @author    : Ing.Osvaldo Gonzalez
     *
     * @param $idpadre
     *
     * @return array Retorna un arreglo con todos los datos de los permisos
     * @copyright Copyright (c) 2013 xetid
     */
    public static function dameTodos($idpadre)
    {
        $query = new Doctrine_Query();
        $result = $query->select('r.idhijo, c.denominacion, c.orden')->from('NomRelacion r')->innerjoin(
                        'r.NomConcepto c'
        )->where('idpadre = ?', $idpadre)->orderBy('c.orden')->setHydrationMode(
                        Doctrine :: HYDRATE_ARRAY
            )->execute();

        return $result;
    }
}