<?php

class DatRegimentrabajoModel extends ZendExt_Model implements IConceptoExport
{

    protected $objRegimen;

    function __construct()
    {
        $this->objRegimen = new DatRegimentrabajo();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getRegimenTrabajoByPersona(array $idpersona, $filtro, $limit, $start)
    {
        try {
            $tmp = new StdClass();
            $tmp->data = $this->objRegimen->getRegimenTrabajoByPersona($idpersona, $filtro, $limit, $start);

            foreach($tmp->data as $key=>$data){

                $regimen=ZendExt_IoC_Inter::getInstance()->regimentrabajo->getDenomRegimenGrupoTurnoTrabajo($data['idregimentrabajo'],$data['idgrupodescanso'],$data['idturnotrabajo']);
                $tmp->data[$key]['denomregimentrabajo']=$regimen->regimen;
                $tmp->data[$key]['denomgrupodescanso']=$regimen->grupo;
                $tmp->data[$key]['denomturnotrabajo']=$regimen->turno;
                if($data['idcargo']){
                    $cargo = ZendExt_IoC::getInstance()->metadatos->obtenerDatosCargo(array($data['idcargo']));
                    $tmp->data[$key]['cargo']=$cargo[0]['denominacion'];
                }else{
                    $tmp->data[$key]['cargo']="";
                }

            }
            $tmp->quantity = $this->objRegimen->getCantRegimenTrabajoByPersona($idpersona, $filtro);

            return $tmp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addRegimenTrabajo(array $data, $idpersona)
    {
        try {
            if (count($data) > 0) {
                $dirOficial = $this->objRegimen->obtenerRegimenActualPersona($idpersona, 1);
                $cant = 0;
                $collection = new Doctrine_Collection('DatRegimentrabajo');
                foreach ($data as $p => $array) {
                    foreach ($array as $k => $v) {
                        switch ($k) {
                            case 'actual':
                                $cant += ($this->isActual($array['fdesde'], $array['hasta']) && $v === 1) ? 1 : 0;
                                break;
                            default:
                                break;
                        }
                        $collection[$p][$k] = $v;
                    }
                    $collection[$p]['idpersona'] = $idpersona;
                }
                if (count($dirOficial) >= 1 && $cant >= 1) {
                    throw new Exception('', 3);
                }
                $collection->save();
            }
        } catch (Doctrine_Collection_Exception $e) {
            throw $e;
        }
    }

    protected function isActual($fi, $ff)
    {
        if (!empty($ff)) {
            $arrfi = explode('/', $fi);
            $arrff = explode('/', $ff);
            $arrfa = explode('/', $this->fechaActual);
            $fi = $arrfi[2] + $arrfi[1] + $arrfi[0];
            $ff = $arrff[2] + $arrff[1] + $arrff[0];
            $fa = $arrfa[2] + $arrfa[1] + $arrfa[0];

            return ($fi <= $fa && $fa <= $ff) ? true : false;
        }

        return true;
    }

    public function addRegimenTrabajoMasivo(array $data, $idregimentrabajo, $idgrupodescanso, $fdesde)
    {//print_r($data);die;
        try {
            /*$collection = new Doctrine_Collection('DatRegimentrabajo');
            if (count($data) > 0) {
                foreach ($data as $p => $val) {
                    $principal = $this->objRegimen->obtenerRegimenActualPersona($val['idpersona'],$val['idcargo'], 1);
                    if (count($principal) > 0) {
                        foreach ($principal as $key => $valor) {
                            $principal[$key]->fhasta = $fdesde;
                            $principal[$key]->actual = 0;
                        }
                        if ($principal->isModified()) {
                            $principal->save();
                        }
                    }
                }
                foreach ($data as $p => $val) {
                    $regimen = new DatRegimentrabajo();
                    $regimen['idpersona'] = $val['idpersona'];
                    $regimen['idregimentrabajo'] = $idregimentrabajo;
                    $regimen['idgrupodescanso'] = $idgrupodescanso;
                    $regimen['fdesde'] = $fdesde;
                    $regimen['actual'] = 1;
                    $regimen['idcargo'] = $val['idcargo'];
                    $collection->add($regimen);
                }
                $collection->save();
            }*/
            //print_r($data);die;
            if(count($data) > 0){
                $idpersonas = array();
                $idscargo = array();
                foreach ($data as $p => $val)
                {
                    array_push($idpersonas,$val['idpersona']);
                    //array_push($idscargo,$val['idcargo']);
                }
                $sql = "UPDATE mod_personaext.dat_regimentrabajo
                            SET actual = 0,fhasta = CURRENT_DATE
                            WHERE idpersona in (".implode(',',$idpersonas).") AND actual = 1;";
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $resultado = $conn->prepare($sql);
                $DBC = new PDO($resultado->getConnection()->getOptions()['dsn'], $resultado->getConnection()->getOptions()['username'], $resultado->getConnection()->getOptions()['password']);
                $res = $DBC->prepare($sql);
                $res->execute();

                /*$q = "INSERT INTO mod_personaext.dat_regimentrabajo (
                        actual,
                        fdesde,
                        idpersona,
                        idregimentrabajo,
                        idgrupodescanso,
                        idcargo)
                        VALUES ";
                $vals = array();

                foreach ($data as $p => $val){
                    array_push($vals,"(1,
                    cast('".$fdesde."' as date),
                    ".$val['idpersona'].",
                    ".$idregimentrabajo.",
                    ".$idgrupodescanso.",
                    ".$val['idcargo']."
                    )");
                }
                $q .= implode(',',$vals);
                $conn->fetchAll($q);*/
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();

                $vals = array();
                foreach ($data as $p => $val){
                    array_push($vals,"(1,
                    cast('".$fdesde."' as date),
                    ".$val['idpersona'].",
                    ".$idregimentrabajo.",
                    ".$idgrupodescanso.",
                    ".$val['idcargo']."
                    )");
                }
                $q = "INSERT INTO mod_personaext.dat_regimentrabajo (
                        actual,
                        fdesde,
                        idpersona,
                        idregimentrabajo,
                        idgrupodescanso,
                        idcargo)
                        VALUES " . implode(',', $vals) . ";";
                $resultadoq = $conn->prepare($q);
                $DBCq = new PDO($resultadoq->getConnection()->getOptions()['dsn'], $resultadoq->getConnection()->getOptions()['username'], $resultadoq->getConnection()->getOptions()['password']);
                $resq = $DBCq->prepare($q);
                $resq->execute();
            }
        } catch (Doctrine_Collection_Exception $e) {
            throw $e;
        }
    }

    public function modRegimenTrabajo(array $data, array $ids, $idpersona)
    {
        try {
            if (count($data) > 0 && count($ids) > 0) {
                $collection = $this->objRegimen->getById($ids);
                if (count($collection) > 0) {
                    foreach ($collection as $p => $v) {
                        foreach ($data[$v->idregimentrabajop] as $k => $val) {
                            $collection[$p]->$k = $val;
                            $collection[$p]->idpersona = $idpersona;
                        }
                    }
                    if ($collection->isModified()) {
                        $collection->save();
                    }
                }
            }
        } catch (Doctrine_Collection_Exception $e) {
            throw $e;
        }
    }

    public function delRegimenTrabajo(array $data, $idpersona)
    {
        try {
            if (count($data) > 0) {
                $this->objRegimen->delRegimenTrabajo($data, $idpersona);
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $data
     *
     * @return array
     */
    public function reflectArray($data)
    {
        if (is_array($data)) {
            return $data;
        } elseif (!empty($data)) {
            return array($data);
        } else {
            return array();
        }
    }

    public function getRegimenByPerson($idpersona, $filtro, $limit, $start)
    {
        try {
            return $this->objRegimen->getRegimenByPerson($idpersona, $filtro, $limit, $start);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function concatDqlPersonaDataExport($query, $baseAlias)
    {
        return $query->addSelect('reg.*')->leftJoin($baseAlias . '.DatRegimentrabajo reg');
    }

}