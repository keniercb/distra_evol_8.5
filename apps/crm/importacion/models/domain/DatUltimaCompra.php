<?php

class DatUltimaCompra extends BaseDatUltimaCompra
{

    /**
     * Constructor de la clase
     */
    public function setUp()
    {
        parent::setUp();
    }

    public function getUltimaCompra($params){
        $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection();
        $where='';
        $filtros=$this->getFiltros($params);
        if(count($filtros)>0)
            $where=' WHERE '.implode(' AND ', $filtros);
        $result=$conexionActual->fetchAll(
            "SELECT uc.*, m.codigoiso
                FROM mod_crmcontratacion.dat_ultimacompra uc 
                LEFT JOIN mod_datosmaestros.nom_moneda m ON uc.idmoneda=m.idmoneda
                $where"
        );
        return $result;
    }

    public function saveUltimaCompra($params){
        try {
            $instance = $params['idultimacompra'] ?
                Doctrine::getTable('DatUltimaCompra')->find($params['idultimacompra'])
                : new DatUltimaCompra();
            $instance->idindicador = $params['idindicador'] ? $params['idindicador'] : null;
            $instance->codigo = $params['codigo'] ? $params['codigo'] : null;;
            $instance->idsolicitud = $params['idsolicitud'] ? $params['idsolicitud'] : null;
            $instance->cantidad = $params['cantidad'] ? $params['cantidad'] : null;;
            $instance->valor = $params['valor'] ? $params['valor'] : null;;
            $instance->idmoneda = $params['idmoneda'] ? $params['idmoneda'] : null;;
            $instance->save();
            return $instance->idultimacompra;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function eliminarUltimaCompra($ids){
        $query = Doctrine_Query::create();
        $query->delete()->from('DatUltimaCompra')
            ->whereIn('idultimacompra', $ids)
            ->execute();
    }

    private function getFiltros($params){
        $where = array();
        if($params['idsolicitud'])
            $where[]="uc.idsolicitud=".$params['idsolicitud'];
        if($params['idindicador'])
            $where[]="uc.idindicador=".$params['idindicador'];
        if($params['notIn'])
            $where[]="uc.idultimacompra NOT IN (".implode(',',$params['notIn']).')';
        return $where;
    }
    
}
