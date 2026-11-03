<?php

/**
 * @class         ProductoModel
 * Extension
 *
 * @package       Utiles
 * @subpackage    Plugin
 * @author        Maricet Estevez
 * @copyright (c) 2014, XETID
 * @version       1.0
 */
class ProductoModel extends ExtensionesModel  //SuministradorModel
{

    private $servConfig, $logisticaDoctrine;

    public function __construct()
    {
        parent::__construct();
        $this->servConfig = ServiciosConfiguracionGeneralHelper::__init();
        $this->logisticaDoctrine = LogisticaDoctrineHelper::__init();
    }

    public function cargarDatos($parametros)
    {
        $prodMaest = new MaestroProductoModel();
        unset($parametros['tipo']);
        $datos = $prodMaest->cargarGridNomenclador($parametros, false);
        return $datos['datos'];
    }

    /**
     * Metodo que aplica los filtros del indicador a la busqueda del grid de productos
     *
     * @param Doctrine_Query $query
     * @param type           $parametros
     * @param type           $as
     */
    public function addQueryIndicadorFilers(Doctrine_Query $query, $parametros = array(), $as = 'i')
    {
        if ($parametros['criterio']) {
            $criterio = $parametros['criterio'];
            $query->andWhere("({$as}.denominacion ilike '%{$criterio}%' or {$as}.codigo like '%{$criterio}%')");
        }
        if ($parametros['denominacion']) {
            $query->andWhere("{$as}.denominacion ilike '%{$parametros['denominacion']}%'");
        }
        if ($parametros['codigo']) {
            $query->andWhere("{$as}.codigo like '%{$parametros['codigo']}%'");
        }


        $query->andWhere("ih.almacenado = ?", array(1));
    }

}
