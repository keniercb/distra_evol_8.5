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
class NomSubcategoriasModel extends NomencladoresModel
{

    private $doctrineHelper;

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getCategorias($params) {
        $limit = $filtro = "";
        if ($params['query']) {

        }
        if (isset($params['start']) && isset($params['limit'])) {
            $limit .= " offset {$params['start']} limit {$params['limit']} ";
        }
        $respuesta = LogisticaDoctrineHelper::__init()->getConnection()->execute(
            "SELECT distinct scp.idsubcategoria, ncp.denominacion, ncp.idcategoriaprecio,
            COUNT(*) OVER() as total from mod_logfacturacion.nom_subcategoriaprecio scp
            inner join mod_logfacturacion.nom_categoriaprecio ncp on ncp.idcategoriaprecio = scp.idcategoria
			WHERE scp.idcategoriapadre = {$params['idpadre']} {$filtro} {$limit}"
        )->fetchAll(PDO::FETCH_ASSOC);
        return array('datos' => $respuesta, 'cantidad' => (count($respuesta) ? $respuesta[0]['total'] : 0));
    }

    public function getCategoriasPrecio($params) {
        $filtro = '';
        $respuesta = LogisticaDoctrineHelper::__init()->getConnection()->execute(
            "SELECT cp.*, COUNT(*) OVER() as total 
            FROM mod_logfacturacion.nom_categoriaprecio cp
			WHERE cp.idcategoriaprecio <> {$params['idcategoriaprecio']}  {$filtro}
			 offset {$params['start']} limit {$params['limit']}"
        )->fetchAll(PDO::FETCH_ASSOC);
        return array('datos' => $respuesta, 'cantidad' => (count($respuesta) ? (int) $respuesta[0]['total'] : 0));
    }

    public function adicionarRelacion($params) {
        $collection = new Doctrine_Collection('NomSubcategoriaprecio');
        foreach ($params['ids'] as $id) {
            $obj = new NomSubcategoriaprecio();
            $obj->idcategoria = $id;
            $obj->idcategoriapadre = $params['idpadre'];
            $collection->add($obj);
        }
        $collection->save();
    }

    public function eliminarSubcategorias($params) {
        if (count($params['datos'])) {
            Doctrine_Query::create()
                ->delete()
                ->from('NomSubcategoriaprecio')
                ->whereIn(
                    'idsubcategoria', $params['datos']
                )
                ->execute();
            return true;
        }
    }

}
