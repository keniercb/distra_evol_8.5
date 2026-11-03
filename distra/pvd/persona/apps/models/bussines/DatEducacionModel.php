<?php

/**
 * Class DatEducacionModel
 */
class DatEducacionModel extends ZendExt_Model implements IConceptoExport
{
    /**
     * @var
     */
    protected $objEducacion;

    /**
     * @var
     */
    private $response;

    /**
     *
     */
    function __construct()
    {
        $this->objEducacion = new DatEducacion();
    }

    /**
     * @throws ZendExt_Exception
     */
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * @param $idpersona
     * @param $filtro
     * @param $limit
     * @param $start
     *
     * @return mixed
     * @throws Exception
     */
    public function getEducacionByPersona($idpersona, $limit, $start)
    {
        try {
            $this->response->data = $this->objEducacion->getEducacionByPersona(
                $this->reflectArray($idpersona), $limit, $start
            );
            $this->response->quantity = ($limit > 0) ? $this->objEducacion->getCantEducacionByPersona(
                $this->reflectArray($idpersona)
            ) : count($this->response->data);

            return $this->response;
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

    /**
     * @param array $data
     * @param       $idpersona
     *
     * @throws Doctrine_Collection_Exception
     * @throws Exception
     */
    public function addEducacion(array $data, $idpersona)
    {
        try {
            if (count($data) > 0) {
                $collection = new Doctrine_Collection('DatEducacion');
                foreach ($data as $p => $array) {
                    foreach ($array as $k => $v) {
                        $collection[$p][$k] = $v;
                    }
                    $collection[$p]['idpersona'] = $idpersona;
                }
                $collection->save();
            }
        } catch (Doctrine_Collection_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param array $data
     * @param array $ids
     *
     * @throws Doctrine_Collection_Exception
     * @throws Exception
     */
    public function modEducacion(array $data, array $ids)
    {
        try {
            if (count($data) > 0 && count($ids) > 0) {
                $collection = $this->objEducacion->getById($ids);
                if (count($collection) > 0) {
                    foreach ($collection as $p => $v) {
                        foreach ($data[$v->ideducacion] as $k => $val) {
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

    /**
     * @param $id
     * @param $idpersona
     *
     * @throws Exception
     */
    public function delEducacion($id, $idpersona)
    {
        try {
            $arrayPersonas = $this->reflectArray($idpersona);
            $arrayIdEducacion = $this->reflectArray($id);
            $this->objEducacion->delEducacion($arrayIdEducacion, $arrayPersonas);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function concatDqlPersonaDataExport($query, $baseAlias)
    {
        return $query->addSelect('deduc.*')->leftJoin($baseAlias . '.DatEducacion deduc');
    }
}

