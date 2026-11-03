<?php

/**
 * @package       ERP-PCRM
 * @category      Model
 * @author        Ing. Rodain Terrer Molina <rterrer@xetid.cu>
 * @copyright (c) 2015, XETID
 */
class ConfComiteGeneral extends BaseConfComiteGeneral
{

    public function setUp()
    {
        // Aqui se reflejan las relaciones con las demas tablas hasMany para (*-*) y hasOne(1-*)
        parent::setUp();
    }

    public function getDatos($params){
        try {
//            $query = Doctrine_Query::create();
//            $result = $query->from('ConfComiteGeneral')->find;
//            $result=$result->toArray();
            $conexionActual = Doctrine_Manager::getInstance()->getCurrentConnection();
            $result=$conexionActual->fetchAll(
                "SELECT cg.* FROM mod_crmadministracion.conf_comitegeneral cg
                  WHERE cg.idestructuracomun=".$params['idestructuracomun']
            );
            foreach($result as $key=>$value){
//                print_r($value);die;

//                $temp=$conexionActual->fetchAll("
//                SELECT cp.idproceso, p.denominacion FROM mod_crmadministracion.dat_comiteproceso cp
//                LEFT JOIN mod_crmcontratacion.nom_proceso p ON (p.idproceso=cp.idproceso)
//                WHERE cp.idcomite=".$value['idcomitegeneral']);

                $temp=$conexionActual->fetchAll("
                SELECT t.idproceso, p.denominacion FROM mod_crmadministracion.dat_comitetransicion ct
                LEFT JOIN mod_crmcontratacion.nom_transicion t ON (t.idtransicion=ct.idtransicion)    
                LEFT JOIN mod_crmcontratacion.nom_proceso p ON (p.idproceso=t.idproceso)
                WHERE ct.idcomite=".$value['idcomitegeneral']);
                $datos = array('id' => '', 'nombre' => array());
                foreach($temp as $v){
                    $datos['id'] = $datos['id'] . $v['idproceso'] . ',';
                    $datos['nombre'][] = $v['denominacion'];
                }
                $result[$key]['idproceso']=trim($datos['id'], ',');
                $result[$key]['proceso'] = $datos['nombre'];
            }

            return $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function getDatosPrId($id){
        try {
//            $query = Doctrine_Query::create();
            $result = Doctrine::getTable('ConfComiteGeneral')->find($id);
            return $result->toArray();
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function guardarComite($params){
        try {
            $conf = $params['idcomitegeneral']?
                Doctrine::getTable('ConfComiteGeneral')->find($params['idcomitegeneral'])
                :new ConfComiteGeneral();
            $conf->nombre = $params['nombre'] ? $params['nombre'] : null;
            $conf->descripcion = $params['descripcion'] ? $params['descripcion'] : null;
            $conf->idestructuracomun = $params['idestructuracomun'] ? $params['idestructuracomun'] : null;
            $conf->pordefecto = $params['pordefecto'] ? $params['pordefecto'] : null;
            $conf->save();
            if($params['idproceso']){
                $exists = array();
//                $procesos=json_decode($params['idproceso']);
                foreach(explode(',',$params['idproceso']) as $v){
                    $tabla=Doctrine::getTable('DatComiteProceso')->findBySql(
                        'idproceso=' . $v . ' AND idcomite=' . $conf->idcomitegeneral
                    )->getFirst();

//                    print_r($tabla);
                    if(!$tabla) {
                        print('/*entro ++*/');
                        $comiteproceso=DatComiteProceso::guardarComiteProceso($v, $conf->idcomitegeneral);
                        $exists[] = $comiteproceso['idcomiteproceso'];
                    }else{
                        $exists[] = $tabla->idcomiteproceso;
                    }
                }
                foreach (
                    Doctrine::getTable('DatComiteProceso')
                        ->findBySql(
                            'idcomite='.$conf->idcomitegeneral.' AND idcomiteproceso NOT IN (' . implode(',', $exists) . ')'
                        ) as $aeliminar
                ) {
                    $aeliminar->delete();
                }
            }
            return array('code' => 1, 'success' => true);
        } catch (Doctrine_Exception $e) {
            return array('code' => $e->getCode(), 'msg' => $e->getMessage(), 'success' => false);
        }
    }

    public function eliminarComites($array){
        {
            try {
//                print_r($array);die;
                $query = Doctrine_Query::create();
                $query->delete()->from('ConfComiteGeneral')
                    ->whereIn('idcomitegeneral', $array)
                    ->execute();
                return array('code' => 1, 'success' => true);
            }catch (Doctrine_Exception $e) {
                return array('code' => $e->getCode(), 'msg' => $e->getMessage(), 'success' => false);
            }
        }
    }

}
