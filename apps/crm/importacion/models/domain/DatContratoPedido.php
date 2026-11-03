<?php

class DatContratoPedido extends BaseDatContratoPedido
{

    public function setUp()
    {
        parent::setUp();
    }

    public function listarPedidos($params){
        $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection();
        $where='';
        $arraywhere=array();
        if($params['idcontrato']){
            $arraywhere[]='cp.idcontrato='.$params['idcontrato'];
        }
        if($params['idcontratopedidos']){
            $arraywhere[]='cp.idcontratopedido IN ('.$params['idcontratopedidos'].')';
        }
        if(count($arraywhere))
            $where='WHERE '.implode(' AND ', $arraywhere);
//        print($where);die;
        $pedidos = $conexionActual->fetchAll("
            SELECT cp.*, cpe.fechainicio as fechaestado, e.idestado, 
            e.nombre as estado, e.icono as iconoestado, e.inicial
            FROM mod_crmcontratacion.dat_contratopedido cp 
            LEFT JOIN mod_crmcontratacion.dat_contratopedidoestado cpe 
            ON (cpe.idcontratopedido=cp.idcontratopedido AND cpe.fechafin IS NULL)
            LEFT JOIN mod_crmcontratacion.nom_estado e ON e.idestado=cpe.idestado
            $where 
            ORDER BY cp.fechaestimada
        ");
        return $pedidos;
    }

    public function eliminarPedidos($array){
        $query = Doctrine_Query::create();
        $query->delete()->from('DatContratoPedido')
            ->whereIn('idcontratopedido', $array)
            ->execute();
    }
}
