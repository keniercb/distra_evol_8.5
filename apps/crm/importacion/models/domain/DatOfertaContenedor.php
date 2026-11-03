<?php
/**
 * Created by PhpStorm.
 * User: work
 * Date: 05/02/18
 * Time: 2:56 PM
 */
class DatOfertaContenedor extends BaseDatOfertaContenedor
{

    public function setUp()
    {
        parent::setUp();
//        $this->hasMany('DatArriboEstado', array('local' => 'idarribo', 'foreign' => 'idarribo'));
    }

    public function getOfertasContenedores($params){
        $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection();
        $where='';
        $filtros=$this->getFiltros($params);
        if(count($filtros)>0)
            $where=' WHERE '.implode(' AND ', $filtros);
        $result=$conexionActual->fetchAll(
            "SELECT oc.*, tc.denominacion as tipocontenedor
                FROM mod_crmcontratacion.dat_ofertacontenedor oc 
                INNER JOIN mod_crmcontratacion.dat_oferta o ON o.idofertanegociosolicitud=oc.idoferta
                INNER JOIN mod_crmcontratacion.dat_ofertanegocio ofn ON ofn.idoferta=o.idofertanegocio
                INNER JOIN mod_crmcontratacion.nom_tipocontenedor tc ON tc.idtipocontenedor=oc.idtipocontenedor
                $where"
        );
        return $result;
    }

    public function saveOfertaContenedor($params){
        try {
            $instance = $params['idofertacontenedor'] ?
                Doctrine::getTable('DatOfertaContenedor')->find($params['idofertacontenedor'])
                : new DatOfertaContenedor();
            $instance->idoferta = $params['idoferta'] ? $params['idoferta'] : null;
            $instance->idtipocontenedor = $params['idtipocontenedor'] ? $params['idtipocontenedor'] : null;
            $instance->cantidad = $params['cantidad'] ? $params['cantidad'] : null;;
            $instance->save();
        } catch (Exception $e) {
            throw $e;
        }
    }

    private function getFiltros($params){
        $where = array();
        if($params['idoferta'])
            $where[]="o.idofertanegocio=".$params['idoferta'];
        if($params['idofertanegociosolicitud'])
            $where[]="oc.idoferta=".$params['idofertanegociosolicitud'];
        return $where;
    }


}