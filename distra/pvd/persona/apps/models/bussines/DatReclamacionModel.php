<?php
/**
 * Created by PhpStorm.
 * User: olorenzo
 * Date: 26/06/16
 * Time: 15:01
 */
class DatReclamacionModel extends ZendExt_Model implements IConceptoExport
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
        $this->objDomain = new DatReclamacion();
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
     * @param array $idpersona
     * @param $filtro
     * @param $limit
     * @param $start
     * @return mixed
     * @throws Exception
     */
    public function getReclamacion(array $idpersona)
    {
        try {
            $response = new StdClass();
            $response->data = $this->objDomain->getReclamacion($idpersona);
            foreach ($response->data as $k => $v) {

            }
            //print_r($response->data);die;
            $response->quantity = $this->objDomain->getCantReclamacion($idpersona);
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
    public function addReclamacion(array $data, $idpersona)
    {
        try {
            if (count($data) > 0) {
                $collection = new Doctrine_Collection('DatReclamacion');
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
    public function modReclamacion(array $data, array $ids)
    {
        try {
            if (count($data) > 0 && count($ids) > 0) {
                $collection = $this->objDomain->getById($ids);
                if (count($collection) > 0) {
                    foreach ($collection as $p => $v) {
                        foreach ($data[$v->idreclamacion] as $k => $val) {
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

    public function delReclamacion($id, $idpersona)
    {
        try {
            $arrayPersonas = $this->reflectArray($idpersona);
            $arrayIdByPerson = $this->reflectArray($id);
            $this->objDomain->delReclamacion($arrayIdByPerson, $arrayPersonas);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function concatDqlPersonaDataExport($query, $baseAlias)
    {
        return $query->addSelect('dmedio.*')->leftJoin($baseAlias . '.DatPersonamedio dmedio');
    }
}