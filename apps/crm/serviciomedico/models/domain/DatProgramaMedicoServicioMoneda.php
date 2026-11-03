<?php
/**
 * Created by PhpStorm.
 * User: work
 * Date: 05/02/18
 * Time: 2:56 PM
 */
class DatProgramaMedicoServicioMoneda extends BaseDatProgramaMedicoServicioMoneda
{

    public function setUp()
    {
        parent::setUp();
    }

    public function listarProgramasMedicosServicioMoneda($params){
        try {
            $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection();
            $where = '';
            $offset = '';

            $filters=DatProgramaMedicoServicioMoneda::getFilters($params);
//            print_r($params);
//            print_r($filters);die;
            if(count($filters))
                $where=" WHERE ".implode($filters, ' AND ');
            $result = $conexionActual->fetchAll("
                SELECT count(*) over(), pmsm.*, m.codigoiso as codigoiso
                FROM mod_programamedico.dat_programamedicoserviciomoneda pmsm
                LEFT JOIN mod_datosmaestros.nom_moneda m ON m.idmoneda=pmsm.idmoneda $where
            ");
            return array('success' => true, 'total' => count($result) == 0 ? 0 : $result[0]['count'], 'data' => $result);
        }catch (Exception $e) {
            throw $e;
        }
    }

    private function getFilters($params){
        $filters=array();

        foreach($params as $key=>$value){
            if($key=='idprogramamedicoservicio'){
                $filters[]="pmsm.idprogramamedicoservicio=".$value;
            }
        }
//        print_r($filters);die;
        return $filters;
    }

    public function guardarProgramaMedicoServicioMoneda($datos){
        $datos=(array)$datos;
        $instance=new DatProgramaMedicoServicioMoneda();
        if(isset($datos['idprogramamedicoserviciomoneda']) && $datos['idprogramamedicoserviciomoneda']!=''){
            $instance = Doctrine::getTable('DatProgramaMedicoServicioMoneda')
                ->find($datos['idprogramamedicoserviciomoneda']);
        }
//        $serv['idprogramamedico']=$idprogramamedico;
        $instance->synchronizeWithArray($datos);
//                $instance->idservicio=$serv[''];
        $instance->save();
        return $instance->idprogramamedicoserviciomoneda;
    }

}