<?php

/**
 * Class NomCategoriaMilitar
 */
class NomCategoriaMilitar extends BaseNomCategoriaMilitar
{
    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('NomGrado', array('local' => 'idcategoriamilitar', 'foreign' => 'idcategoriamilitar'));
    }

    /**
     * Descripción del método: Busca todos los datos de las categorias militares
     *
     * @author    : Ing. Osvaldo Gonzalez
     * @return array Retorna un arreglo con todos los datos de los salarios
     * @copyright Copyright (c) 2013 xetid
     */
    public static function dameTodosVisibles()
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomCategoriaMilitar')->setHydrationMode(Doctrine :: HYDRATE_ARRAY)->execute();

        return $result;
    }
}