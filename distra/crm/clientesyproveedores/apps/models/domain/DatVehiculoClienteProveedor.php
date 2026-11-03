<?php

class DatVehiculoClienteProveedor extends BaseDatVehiculoClienteProveedor
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
                  LEFT JOIN mod_datosmaestros.nom_marca nm ON (dvc.idmarca=nm.idmarca)
                  LEFT JOIN mod_datosmaestros.nom_modelo nmo ON (dvc.idmodelo=nmo.idmodelo)
                  ".$where;
            $datosindicadores= $conexionActual->fetchAll($query);

            return $datosindicadores;
        }catch (Doctrine_Exception $e){
            throw $e;
        }
    }

    public function eliminarVehiculo($array){
        $query = Doctrine_Query::create();
        $query->delete()->from('DatVehiculoClienteProveedor')
            ->whereIn('idvehiculocontrato',$array)
            ->execute();
    }

}
