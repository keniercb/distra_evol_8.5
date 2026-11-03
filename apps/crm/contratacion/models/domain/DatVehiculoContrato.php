<?php

class DatVehiculoContrato extends BaseDatVehiculoContrato
{

    /**
     * Constructor de la clase
     */
    public function setUp()
    {
        parent::setUp();
    }

    public function getVehiculos($params){
        try{
            $objDoctrine = Doctrine_Manager::getInstance();
            $conexionActual = $objDoctrine->getCurrentConnection();
            $cond = [];
            $where = "";
            if($params['idcontrato']){
                $cond[] = "dvc.idcontrato = ". $params['idcontrato'];
            }
            if(count($cond)){
                $where = " where ".implode("AND",$cond);
            }
            $query = "SELECT dvc.*, nm.denominacion AS marca, nmo.denominacion AS modelo
                  FROM mod_crmcontratacion.dat_vehiculocontrato dvc 
                  ".$where;
            $datosindicadores= $conexionActual->fetchAll($query);
            return $datosindicadores;
        }catch (Doctrine_Exception $e){
            throw $e;
        }
    }

    public function eliminarVehiculo($array){
        $query = Doctrine_Query::create();
        $query->delete()->from('DatVehiculoContrato')
            ->whereIn('idvehiculocontrato',$array)
            ->execute();
    }

    public function guardarVehiculo($datos){
        try {
            $instance = $datos->idvehiculocontrato ? Doctrine::getTable('DatVehiculoContrato')
                ->find($datos->idvehiculocontrato)
                : new DatVehiculoContrato();
//        $instance->idclienteproveedor=$datos['idclienteproveedor'];
            $instance->idcontrato = $datos['idcontrato'];
            $instance->idindicador = $datos['idindicador'];
            $instance->save();
        }catch (Doctrine_Exception $e){
            throw $e;
        }
    }

}
