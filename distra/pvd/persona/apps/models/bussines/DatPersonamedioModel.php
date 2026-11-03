<?php
/**
 * Created by PhpStorm.
 * User: olorenzo
 * Date: 26/06/16
 * Time: 15:01
 */
class DatPersonamedioModel extends ZendExt_Model implements IConceptoExport
{
    protected $objDomain;

    protected $response;

    protected $logSrv;

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    function __construct()
    {
        $this->objDomain = new DatPersonamedio();
        $this->logSrv = new LogisticaService();
    }

    /**
     * @param $data
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

    /**
     * @param $val
     * @param $index
     * @param $array
     * @param null $id
     * @return bool
     */
    protected function verifExist($val, $index, $array, $id = null)
    {
        $cantd = count($array);
        if ($cantd > 0) {
            while ($cantd > 0) {
                $arr = $array[$cantd - 1];
                if ((isset($id) && isset($arr['idpersonamedio'])) && $arr['idpersonamedio'] == $id) {
                    $cantd--;
                } elseif ($arr[$index] == $val) {
                    return true;
                } else {
                    $cantd--;
                }
            }
        }
        return false;
    }

    /**
     * @param array $idpersona
     * @param $filtro
     * @param $limit
     * @param $start
     * @return mixed
     * @throws Exception
     */
    public function getMediosByPerson(array $idpersona, $limit, $start)
    {
        try {
            $response = new StdClass();
            $response->data = $this->objDomain->getMediosByPerson($idpersona, $limit, $start);
            foreach ($response->data as $k => $v) {
               $obj=new NomMedioModel();
                $denom=$obj->getById($v['idmedio']);
                $response->data[$k]['dmedio'] = $denom[0]['denominacion'];
            }

            $response->quantity = ($limit > 0)
                ? $this->objDomain->getCantMediosByPerson($idpersona)
                : count($response->data);
            //print_r($response);die;
            return $response;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param array $data
     * @param $idpersona
     * @throws Exception
     */
    public function addMediosPersona(array $data, $idpersona)
    {
        try {
            if (count($data) > 0) {
                $collection = new Doctrine_Collection('DatPersonamedio');
                foreach ($data as $p => $array) {
                    foreach ($array as $k => $v) {
                        $collection[$p][$k] = $v;
                    }
                    $collection[$p]['idpersona'] = $idpersona;
                }
                $collection->save();
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param array $data
     * @param array $ids
     * @throws Doctrine_Collection_Exception
     * @throws Exception
     */
    public function modMediosPersona(array $data, array $ids)
    {
        try {
            if (count($data) > 0 && count($ids) > 0) {
                $collection = $this->objDomain->getById($ids);
                if (count($collection) > 0) {
                    foreach ($collection as $p => $v) {
                        foreach ($data[$v->idpersonamedio] as $k => $val) {
                            $collection[$p]->$k = $val;
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

    public function delMediosPersona($id, $idpersona)
    {
        try {
            $arrayPersonas = $this->reflectArray($idpersona);
            $arrayIdMediosByPerson = $this->reflectArray($id);
            $this->objDomain->delMediosByPerson($arrayIdMediosByPerson, $arrayPersonas);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function concatDqlPersonaDataExport($query, $baseAlias)
    {
        return $query->addSelect('dmedio.*')->leftJoin($baseAlias . '.DatPersonamedio dmedio');
    }
}