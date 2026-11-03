<?php
/**
 * Created by PhpStorm.
 * User: olorenzo
 * Date: 26/06/16
 * Time: 15:01
 */
class DatSituaciondefensaModel extends ZendExt_Model implements IConceptoExport
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
        $this->objDomain = new DatSituaciondefensa();
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
    public function getSituacionDefensa(array $idpersona, $limit, $start)
    {
        try {
            $response = new StdClass();
            $response->data = $this->objDomain->getSituacionDefensa($idpersona, $limit, $start);
            foreach ($response->data as $k => $v) {

            }
            $response->quantity = ($limit > 0)
                ? $this->objDomain->getCantSituaciondefensa($idpersona)
                : count($response->data);
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
    public function addSituacionDefensa(array $data, $idpersona)
    {
        try {
            if (count($data) > 0) {
                $collection = new Doctrine_Collection('DatSituaciondefensa');
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
    public function modSituacionDefensa(array $data, array $ids)
    {
        try {
            if (count($data) > 0 && count($ids) > 0) {
                $collection = $this->objDomain->getById($ids);
                if (count($collection) > 0) {
                    foreach ($collection as $p => $v) {
                        foreach ($data[$v->idsituaciondefensa] as $k => $val) {
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

    public function delSituacionDefensa($id, $idpersona)
    {
        try {
            $arrayPersonas = $this->reflectArray($idpersona);
            $arrayIdByPerson = $this->reflectArray($id);
            $this->objDomain->delSituacionDefensa($arrayIdByPerson, $arrayPersonas);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function concatDqlPersonaDataExport($query, $baseAlias)
    {
        return $query->addSelect('dmedio.*')->leftJoin($baseAlias . '.DatPersonamedio dmedio');
    }

    public function getPersonasByAsig($idasignaciondefensa)
    {
        $obj = new DatSituaciondefensa();
        try {
            $this->response->data = $obj->getPersonasByAsig($idasignaciondefensa);
            foreach ($this->response->data as $key => $a) {
                $this->response->data[$key]['idpersona'] = $a['idpersona'];
                $persona = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona(array($a['idpersona']), null, null, null, null, null);
                $this->response->data[$key]['nombreyapellidos'] = $persona->data[0]['nombreapellidos'];
                $this->response->data[$key]['numid'] = $persona->data[0]['numid'];
                $this->response->data[$key]['cargo'] = $persona->data[0]['denomcargo'];
                $this->response->data[$key]['idcargo'] = $persona->data[0]['idcargo'];
                $this->response->data[$key]['cargodefensa'] = $a['cargodefensa'];
            }

            $this->response->quantity = count($this->response->data);

            return $this->response;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getCantPersonaBySituacion()
    {
        $obj = new DatSituaciondefensa();
        $result=$obj->getCantPersonaBySituacion();
        return $result;
    }
}