<?php

class ActivosfacturaModel extends AbstractCompositeModel
{

    private $maestroP;
    private $configuracionHelper;

    public function __construct()
    {
        parent::__construct();
        $this->maestroP = new MaestroProductoModel();
        $this->configuracionHelper = ServiciosConfiguracionGeneralHelper::__init();
    }

    public function initBaseModel()
    {
        $this->baseModel = new DatActivosfactura();
    }

    /**
     *
     */
    public function getQuerySelectFields($alias)
    {
        $arrayQueryStrings = array('idtipoprecio' => '_p.idtipoprecio', 'idregnumerico' => '_p.idregnumerico',
            'tipo' => '0', 'idproducto' => '_p.idproducto',);
        return $this->doctrineHelper->getStrSelectString(
            $arrayQueryStrings, $alias, '_p'
        );
    }

    /**
     *
     */
    public function addQueryFilters(Doctrine_Query $query, $aliasTabla, $parametros = array())
    {
        if ($parametros['activosfijos']) {
            $query->addWhere("$aliasTabla.idregnumerico is not null");
        }
    }

    public function beforeSave(Doctrine_Record $model, $parametros = array())
    {
        if (isset($parametros['idregnumerico']) && $parametros['idregnumerico'] != null
        ) {
            $model->DatActivosfactura->synchronizeWithArray($parametros);
            /*if ($parametros['productos'] > 0) {
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
            }*/
        }
    }

    public function beforeDelete($identificador)
    {
    }

    public function initBaseRelation(Doctrine_Record $model)
    {
        $array[] = array('cardinalidad' => 'one', 'relation' => 'DatActivosfactura',
            'properties' => array('local' => 'idelementofactura', 'foreign' => 'idelementofactura'));
        UtilesDoctrineModel::tryInyectRelactions($model, $array);
    }

    public function addJoinModel(
        Doctrine_Query $query, $aliasExterno, $aliasLocal, $includeSelect = true, $parametros = array()
    )
    {
        if (isset($parametros['activosfijos'])){
            $query->leftJoin("$aliasExterno.DatActivosfactura $aliasLocal");
            $this->maestroP->addQueryNomIndicador($query, $aliasLocal, 'i', 'ih');
            $this->configuracionHelper->getQueryJoinUnidadMedida(
                $query, 'i', 'um', 'um.abreviaturaunidadmedida as umedida', 'leftJoin'
            );
            $parametros['grid'] = true;
            $this->maestroP->addFiltersQueryIndicador($query, 'i', $parametros);
            if ($includeSelect) {
                $query->addSelect($this->getQuerySelectFields($aliasLocal));
            }
        }
    }
}
