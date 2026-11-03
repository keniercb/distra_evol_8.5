<?php

class ActividadesFacturaModel extends AbstractCompositeModel
{

    public function ElementosFacturaModel()
    {
        parent::__construct();
    }

    public function initBaseModel()
    {
        $this->baseModel = new DatActividadesFactura();
    }

    /**
     *
     */
    public function getQuerySelectFields($alias)
    {
        $arrayQueryStrings = array('idactividad' => '_p.idactividad',);
        return $this->doctrineHelper->getStrSelectString(
            $arrayQueryStrings, $alias, '_p'
        );
    }

    /**
     *
     */
    public function addQueryFilters(Doctrine_Query $query, $aliasTabla, $parametros = array())
    {
        if ($parametros['actividad']) {
            $query->addWhere("$aliasTabla.idactividad is not null");
        }
    }

    public function beforeSave(Doctrine_Record $model, $parametros = array())
    {
        if (isset($parametros['idactividad']) && $parametros['idactividad'] != null
        ) {
            unset($parametros['idelementofactura']);
            unset($parametros['idfactura']);
            $model->DatActividadesFactura->synchronizeWithArray($parametros);
            if ($parametros['productos'] > 0) {
                foreach ($parametros['materiales'] as $index => $prod) {
                    if (!isset($prod->cantidad)) {
                        $prod->cantidad = $prod->cantplanif;
                    }
                    if (isset($prod->idprodservicio) && !$prod->idprodservicio) {
                        unset($prod->idprodservicio);
                    }
                    $prod->precio = ($prod->importecup) ? $prod->importecup : $prod->precio;
                    $prod->importetotal = $prod->precio * $prod->cantidad;
                    $datProdServ = new DatProdServicios();
                    $datProdServ->synchronizeWithArray($prod);
                    $model->DatProdServicios[$index] = $datProdServ;
                }
            }
        }
    }

    public function beforeDelete($identificador)
    {
    }

    public function initBaseRelation(Doctrine_Record $model)
    {
        $array[] = array('cardinalidad' => 'one', 'relation' => 'DatActividadesFactura',
            'properties' => array('local' => 'idelementofactura', 'foreign' => 'idelementofactura'));
        UtilesDoctrineModel::tryInyectRelactions($model, $array);
    }

    public function addJoinModel(
        Doctrine_Query $query, $aliasExterno, $aliasLocal, $includeSelect = true, $parametros = array()
    )
    {
        $query->leftJoin("$aliasExterno.DatActividadesFactura $aliasLocal");
        if ($parametros['criterio']) {
            /*$query->leftJoin("$aliasLocal.NomActividad na");
            $query->addWhere("na.denominacion ILIKE '%"
                . $parametros['criterio']['valor'] . "%'OR na.codigo ILIKE '%"
                . $parametros['criterio'] . "%'");*/
        }
        if ($includeSelect) {
            $query->addSelect($this->getQuerySelectFields($aliasLocal));
        }
    }
}
