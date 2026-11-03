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
class NomCilindroModel extends NomencladoresModel
{

    private $doctrineHelper;

    public function setUp()
    {
        parent::ZendExt_Model();
        $this->doctrineHelper = LogisticaDoctrineHelper::__init();
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
        $query->leftJoin('m.NomUnidadmedida um');
        $query->addSelect('um.abreviaturaunidadmedida as abreviaturaunidadmedida');
        $query->limit(($obj['limit']) ? $obj['limit'] : 30)
            ->offset(($obj['start']) ? $obj['start'] : 0)
            ->orderBy("{$obj['idnom']} DESC");
        $cuentas = $query->fetchArray();
        /*$monedas = LogisticaGlobal::__init()->getMonedaEntidad();
        foreach($cuentas as &$cuenta){
            $cuenta['codigoiso'] = ($cuenta['idmoneda'] == $monedas->idmoneda)
                ? $monedas->codigoiso
                : $monedas->codigoisoalt;
        }*/
        return array('cantidad' => $cant, 'datos' => $cuentas);
    }

    public function adicionarcilindro($params) {
        $collection = new Doctrine_Collection('NomIndicadorcilindro');
        foreach ($params['ids'] as $id) {
            $obj = new NomIndicadorcilindro();
            $obj->idindicador = $id;
            $obj->idusuario = $this->global->Perfil->idusuario;
            $obj->fecha = date("d/m/Y");
            $collection->add($obj);
        }
        $collection->save();
    }

    public function getProductos($params)
    {
        $limit = $filtro = "";
        if ($params['query']) {
            $filtro .= " and (ni.numeropieza ilike '%{$params['query']}%' or 
            ni.denominacion ilike '%{$params['query']}%') ";
        }
        if (isset($params['start']) && isset($params['limit'])) {
            $limit .= " offset {$params['start']} limit {$params['limit']} ";
        }
        $respuesta = LogisticaDoctrineHelper::__init()->getConnection()->execute(
            "SELECT distinct dp.idindicador, (ni.numeropieza || ' ' ||ni.denominacion) as denominacion, ni.numeropieza, 
            COUNT(*) OVER() as total from mod_logfacturacion.nom_indicadorcilindro dp
            inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
			WHERE true {$filtro} 
			order by ni.numeropieza{$limit}"
        )->fetchAll(PDO::FETCH_ASSOC);
        return array('datos' => $respuesta, 'cantidad' => (count($respuesta) ? $respuesta[0]['total'] : 0));
    }

    public function eliminarProdCilindro($params) {
        if (count($params['datos'])) {
            Doctrine_Query::create()
                ->delete()
                ->from('NomIndicadorcilindro')
                ->whereIn(
                    'idindicador', $params['datos']
                )
                ->execute();
            return true;
        }
    }

}
