<?php
/**
 * Created by PhpStorm.
 * User: work
 * Date: 05/02/18
 * Time: 2:56 PM
 */
class DatProgramaMedicoServicio extends BaseDatProgramaMedicoServicio
{

    public function setUp()
    {
        parent::setUp();
    }

    public function listarProgramasMedicosServicios($params){
        try {
            $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection();
            $where = '';
            $where2 = '';
            $offset = '';
            $filters=DatProgramaMedicoServicio::getFilters($params);
            if(count($filters))
                $where=" WHERE ".implode($filters, ' AND ');
            $result = $conexionActual->fetchAll("
                SELECT count(pms.idprogramamedicoservicio) over(), pms.*
                FROM mod_programamedico.dat_programamedicoservicio pms ".$where
            );
            foreach($result as &$r){
                $r['total']=0;
                $monedas=DatProgramaMedicoServicioMoneda::listarProgramasMedicosServicioMoneda(
                    array('idprogramamedicoservicio'=>$r['idprogramamedicoservicio']));
//                print_r($monedas);die;
                if($monedas['success'])
                    foreach($monedas['data'] as $m){
                        $r['montomoneda_'.strtolower($m['codigoiso']).'_'.$m['idmoneda']]=$m['valor'];
                        $r['total']+=$m['valor']*$r['cantidad'];
                    }
            }
            return array('success' => true, 'total' => count($result) == 0 ? 0 : $result[0]['count'], 'data' => $result);
        }catch (Exception $e) {
            throw $e;
        }
    }

    private function getFilters($params){
        $filters=array();

        foreach($params as $key=>$value){
            if($key=='idprogramamedico'){
                $filters[]="pms.idprogramamedico=".$value;
            }
        }
//        print_r($filters);die;
        return $filters;
    }

    public function guardarProgramaMedicoServicio($datos){
        $datos=(array)$datos;
        $instance=new DatProgramaMedicoServicio();
        if(isset($datos['idprogramamedicoservicio']) && $datos['idprogramamedicoservicio']!=''){
            $instance = Doctrine::getTable('DatProgramaMedicoServicio')
                ->find($datos['idprogramamedicoservicio']);
        }
//        $serv['idprogramamedico']=$idprogramamedico;
        $instance->synchronizeWithArray($datos);
//                $instance->idservicio=$serv[''];
//        print_r($datos);die;
        $instance->save();
        foreach($datos as $k=>$v){
            if (preg_match('/montomoneda_/i', $k)) {
                $temp = explode('_', $k);
                $moneda_datos=array('valor'=>$v, 'idmoneda'=>$temp[2],
                    'idprogramamedicoservicio'=>$instance->idprogramamedicoservicio);
                $moneda = Doctrine::getTable('DatProgramaMedicoServicioMoneda')
                    ->findByDql(
                        'idprogramamedicoservicio=? AND idmoneda=?',
                        array($instance->idprogramamedicoservicio, $temp[2])
                    );
//                print('1:'.$instance->idprogramamedicoservicio.' 2:'.$temp[2].' || ');
                if ($moneda->count()) {
                    $moneda = $moneda->getFirst();
                    $moneda_datos['idprogramamedicoserviciomoneda']=$moneda->idprogramamedicoserviciomoneda;
                }
//                print_r($moneda_datos);die;
                DatProgramaMedicoServicioMoneda::guardarProgramaMedicoServicioMoneda($moneda_datos);
            }
        }
        return $instance->idprogramamedicoservicio;
    }

    public function eliminarProgramaMedicoServicio($params){
        try {
            $query = Doctrine_Query::create();
            $query->delete()->from('DatProgramaMedicoServicio')
                ->whereIn('idprogramamedico', json_decode($params['idprogramamedico']))
                ->execute();
        }catch (Exception $e) {
            throw $e;
        }
    }

}