<?php

/**
 * @class      ClasificacioncontableModel
 *
 *
 * @package    Inventario
 * @subpackage Inventario
 * @author     Maricet Estevez
 * @copyright  XETID-GE
 * @version    1.0
 */
class NomCuentasuministradorModel extends NomencladoresModel
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function buscar($obj, $arrIdsInsertados, $returnobj = false)
    {
        $nomencladoresModel = new NomencladoresModel();
        $query = parent::buscar($obj, $arrIdsInsertados, true);

        /*$query = $nomencladoresModel->buscarEntidad(array(
            'idnom'=> 'idcuentasuministrador','modelo'=>'NomCuentasuministrador'
        ), true);*/
        $cant = $query['cant'];
        $query = $query['query'];
        $query->limit(($obj['limit']) ? $obj['limit'] : 30)
            ->offset(($obj['start']) ? $obj['start'] : 0)
            ->orderBy("{$obj['idnom']} DESC");
        $cuentas = $query->fetchArray();
        $monedas = LogisticaGlobal::__init()->getMonedaEntidad();
        foreach($cuentas as &$cuenta){
            $cuenta['codigoiso'] = ($cuenta['idmoneda'] == $monedas->idmoneda)
                ? $monedas->codigoiso
                : $monedas->codigoisoalt;
        }
        return array('cantidad' => $cant, 'datos' => $cuentas);
    }
    

}
