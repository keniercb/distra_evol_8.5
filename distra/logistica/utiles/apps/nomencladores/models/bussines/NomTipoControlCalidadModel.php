<?php

/**
 * @class      NomTipoControlCalidadModel
 *
 *
 * @package    Produccion
 * @subpackage Nomencladores
 * @author     Pedro J.
 * @copyright  XETID-GE
 * @version    1.0
 */
class NomTipoControlCalidadModel extends NomencladoresModel
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function buscar($obj, $arrIdsInsertados, $returnobj = false)
    {
        $nomencladoresModel = new NomencladoresModel();
        $query = parent::buscar($obj, $arrIdsInsertados, true);
        $cant = $query['cant'];
        $query = $query['query'];
        $query->limit(($obj['limit']) ? $obj['limit'] : 30)
            ->offset(($obj['start']) ? $obj['start'] : 0)
            ->orderBy("{$obj['idnom']} DESC");
        $gastos = $query->fetchArray();
        foreach($gastos as &$gasto){
            $datosumedida = Doctrine::getTable('NomUnidadmedida')->find($gasto['idunidadmedida']);
            $gasto['umedida'] = $datosumedida->abreviaturaunidadmedida;
        }
        return array('cantidad' => $cant, 'datos' => $gastos);
    }
    

}
