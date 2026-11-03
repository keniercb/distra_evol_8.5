<?php

/**
 * Class NomCategoriaMilitarModel
 */
class NomCategoriaMilitarModel extends ZendExt_Model
{
    /**
     *
     */
    public function setUp()
    {
        parent::ZendExt_Model();
        $this->instance = new NomCategoriaMilitar();
    }

    /**
     * Descripción del método: Devuelve la(s) categorias militares
     *
     * @autor     : Ing. Osvaldo Manuel Gonzalez Ortis
     *
     * @param            $idCategoriaMilitar
     * @param            $start
     * @param            $limit
     *
     * @return array
     * @copyright Copyright (c) 2013 xetid
     */
    public static function dameCategorias($idCategoriaMilitar, $start, $limit)
    {
        $where = "1 = 1";
        if (is_numeric($idCategoriaMilitar)) {
            $where .= " AND c.idcategoriamilitar = $idCategoriaMilitar";
        }
        $query = Doctrine_Query::create();
        $query->select('c.*, c.idcategoriamilitar as id')->from('NomCategoriaMilitar c')->where($where)->orderBy(
              'c.idcategoriamilitar'
        );
        if ($limit) {
            $query->limit($limit);
            $query->offset($start);
        }
        $result = $query->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();

        return $result;
    }
}