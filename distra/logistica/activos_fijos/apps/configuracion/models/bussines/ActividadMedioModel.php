<?php

/**
 *
 */
class ActividadMedioModel extends NomencladoresModel
{

    /**
     *
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     *
     */
    public function buscar($obj)
    {
        $arrQuery = parent::buscar($obj, array(), true);

        $objQuery = $arrQuery['query'];
        //para que las cosas de melfi cargen independiente a las de AFT

        if(!$obj["acction"]){
            $objQuery->addSelect("nd.denominacion as descripciontc")
                ->addWhere(
                    'm.iddepreciacion = nd.iddepreciacion'
                )->innerjoin('m.NomDepreciacion nd');
        }




        $datos = $objQuery->fetchArray();
        $cantidad = $objQuery->count();

        return array('cantidad' => $cantidad, 'datos' => $datos);
    }

    /**
     *
     */
    public function insertarNomenclador($array, $returnInstanacia = false)
    {
        if ($array['codigo']) {
            $existeCod = parent::existeCodigo($array);
        }
        $existedenominacion = parent::existedenominacion($array);
        if ($existeCod == 0 && $existedenominacion == 0) {
            $obj = new $array['modelo']();
            $obj->synchronizeWithArray($array);

            if (!$returnInstanacia) {
                $obj->save();
            }
            $bandera = 1;
        } else {
            if ($existedenominacion > 0 && ($existeCod > 0 && $array['codigo'])
            ) {
                $bandera = -1;
            } else {
                if ($existedenominacion > 0) {
                    $bandera = -2;
                } else {
                    $bandera = -3;
                }
            }
        }

        return ($returnInstanacia && $bandera == 1) ? $obj : $bandera;
    }

    /**
     * @param       $alias
     * @param bool  $select
     * @param array $paramsWhere
     *
     * @return Doctrine_Query
     */
    public function getQueryNomActividad($alias, $select = false, $paramsWhere = array())
    {
        $query = new Doctrine_Query();
        $query->from("NomActividadMedio {$alias}");
        $query->select("{$alias}.idactividad");

        if ($select) {
            $this->getSelectQueryNomActividad($query, $alias, '');
        }

        if ($paramsWhere) {
            $this->getWhereQueryNomActividad($query, $alias, $paramsWhere);
        }

        return $query;
    }

    /**
     * @param Doctrine_Query $query
     * @param                $alias
     * @param                $aliasExt
     * @param int            $join
     * @param bool           $select
     * @param array          $paramsWhere
     */
    public function getJoinQueryNomActividad(
    Doctrine_Query &$query, $alias, $aliasExt, $join = 1, $select = false, $paramsWhere = array(), $posAlias = ''
    )
    {
        if (!$query) {
            $query = new Doctrine_Query();
            $query->from("NomActividadMedio {$alias}");
        } else {

            if ($join) {
                $query->innerJoin("{$aliasExt}.NomActividadMedio {$alias}");
            } else {
                $query->leftJoin("{$aliasExt}.NomActividadMedio {$alias}");
            }
        }

        if ($select) {
            $this->getSelectQueryNomActividad($query, $alias, $posAlias);
        }

        if ($paramsWhere) {
            $this->getWhereQueryNomActividad($query, $alias, $paramsWhere);
        }
    }

    /**
     * @param Doctrine_Query $query
     * @param                $alias
     * @param string         $postAlias
     */
    public function getSelectQueryNomActividad(Doctrine_Query &$query, $alias, $postAlias = '')
    {
        $columnNames = Doctrine::getTable('NomActividadMedio')->getColumnNames();

        foreach ($columnNames as $columna) {
            $query->addSelect("{$alias}.{$columna} AS {$columna}$postAlias");
        }
    }

    /**
     * @param Doctrine_Query $query
     * @param                $alias
     * @param array          $paramsWhere
     */
    public function getWhereQueryNomActividad(Doctrine_Query &$query, $alias, $paramsWhere = array())
    {
        ComunAFTModel::getInstance()->getFiltroGenerico($query, $alias, 'NomActividadMedio', $paramsWhere);
    }

}
