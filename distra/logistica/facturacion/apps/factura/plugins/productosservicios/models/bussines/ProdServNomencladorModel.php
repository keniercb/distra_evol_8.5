<?php

class ProdServNomencladorModel extends AbstractCompositeModel
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
        $this->baseModel = new DatProdServNomenclador();
    }

    /**
     *
     */
    public function getQuerySelectFields($alias)
    {
        $arrayQueryStrings =
            array('idindicador' => '_p.idindicador', 'tipo' => '_p.tipo', 'idtipoprecio' => '_p.idtipoprecio',);
        return $this->doctrineHelper->getStrSelectString(
            $arrayQueryStrings, $alias, '_p'
        );
    }

    /**
     *
     */
    public function addQueryFilters(Doctrine_Query $query, $aliasTabla, $parametros = array())
    {
        if ($parametros['tipo']) {
            $query->addWhere(
                "$aliasTabla.tipo = ?", array($parametros['tipo'])
            );
        }
    }

    public function beforeSave(Doctrine_Record $model, $parametros = array())
    {
        if (isset($parametros['idindicador']) && $parametros['idindicador'] != null && !isset($parametros['idregnumerico'])
        ) {
            if (count($parametros['materiales']) > 0) {
                $modeloFact = new GestionarFacturaModel(
                    array('alias' => 'facturaLog', 'subsistema' => LogisticaGlobal::SUBSISTEMA_FAC)
                );
                $sumar = array();
                foreach ($parametros['materiales'] as $index => &$prod) {
                    $prod = (array)$prod;
                    $prod['idtipoprecio'] = $parametros['idtipoprecio'];
                    $value = new stdClass();
                    $value->idindicador = $prod['idindicador'];
                    $value->idtipoprecio = $parametros['idtipoprecio'];
                    $value->idestructura = $parametros['idestructura'];
                    $prec = $modeloFact->getPrecio($value);
                    $prod['preciobase'] = $prec['precioventa'];
                    $prod['importetotal'] = $prod['preciobase'] * $prod['cantidad'];

                    $datProdServ = new DatProdServicios();
                    if (!$prod['idprodservicio']) {
                        unset($prod['idprodservicio']);
                    }
                    $datProdServ->synchronizeWithArray($prod);
                    $obj = new DatDesglosemonedaprodserv();
                    $obj->idmoneda = $modeloFact->getDualidadMonedas()->idmoneda;
                    $obj->precio = $prec['datos'][$modeloFact->getDualidadMonedas()->idmoneda]['precioventa'];
                    if ($parametros['preciopromedio'] == 1) {
                        $sumar[$modeloFact->getDualidadMonedas()->idmoneda] += $obj->precio;
                    }
                    $datProdServ->DatDesglosemonedaprodserv->add($obj);
                    if ($modeloFact->getDualidadMonedas()->idmonedaalternativa) {
                        $obj = new DatDesglosemonedaprodserv();
                        $obj->idmoneda = $modeloFact->getDualidadMonedas()->idmonedaalternativa;
                        $obj->precio = $prec['datos'][$modeloFact->getDualidadMonedas()->idmonedaalternativa]['precioventa'];
                        if ($parametros['preciopromedio'] == 1) {
                            $sumar[$modeloFact->getDualidadMonedas()->idmonedaalternativa] += $obj->precio;
                        }
                        $datProdServ->DatDesglosemonedaprodserv->add($obj);
                    }
                    $model->DatProdServicios[$index] = $datProdServ;
                    unset($prec);
                }
                $parametros['cobromateriales'] = $sumar;
            }
            $model->DatProdServNomenclador->synchronizeWithArray($parametros);
        }
    }

    public function beforeDelete($identificador)
    {
    }

    public function initBaseRelation(Doctrine_Record $model)
    {
        $array[] = array('cardinalidad' => 'one', 'relation' => 'DatProdServNomenclador',
            'properties' => array('local' => 'idelementofactura', 'foreign' => 'idelementofactura'));
        UtilesDoctrineModel::tryInyectRelactions($model, $array);
    }

    public function addJoinModel(
        Doctrine_Query $query, $aliasExterno, $aliasLocal, $includeSelect = true, $parametros = array()
    )
    {
        if(isset($parametros['tipo'])){
            $query->leftJoin("$aliasExterno.DatProdServNomenclador $aliasLocal");
            $this->maestroP->addQueryNomIndicador($query, $aliasLocal, 'i', 'ih');
            $query->addSelect("(SELECT COUNT(ncil.idindicador) FROM NomIndicadorcilindro ncil WHERE ncil.idindicador = i.idindicador) as cilindro");
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
