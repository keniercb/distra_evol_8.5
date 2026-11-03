<?php

/**
 * Class DatAfeccionModel
 */
class DatAfeccionModel extends ZendExt_Model implements IConceptoExport
{
    /**
     * @var
     */
    protected $objAfeccion;

    /**
     * @var
     */
    private $response;

    /**
     *
     */
    function __construct()
    {
        $this->objAfeccion = new DatAfeccion();
    }

    /**
     *
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
    public function getAfeccionesByPersona($idpersona, $filtro, $limit, $start)
    {
        try {
            $this->response->data = $this->objAfeccion->getAfeccionesByPersona(
                $this->reflectArray($idpersona), $filtro, $limit, $start
            );
            $this->response->quantity = ($limit > 0) ? $this->objAfeccion->getCantAfeccionesByPersona(
                $this->reflectArray($idpersona), $filtro
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

    public function addAfecciones(array $data, $idpersona)
    {
        try {
            if (count($data) > 0) {
                $collection = new Doctrine_Collection('DatAfeccion');
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

    public function modAfecciones(array $data, array $ids)
    {
        try {
            if (count($data) > 0 && count($ids) > 0) {
                $collection = $this->objAfeccion->getById($ids);
                if (count($collection) > 0) {
                    foreach ($collection as $p => $v) {
                        foreach ($data[$v->idafeccion] as $k => $val) {
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

    public function delAfecciones($id, $idpersona)
    {
        try {
            $arrayPersonas = $this->reflectArray($idpersona);
            $arrayIdAfecciones = $this->reflectArray($id);
            $this->objAfeccion->delAfecciones($arrayIdAfecciones, $arrayPersonas);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function concatDqlPersonaDataExport($query, $baseAlias)
    {
        return $query->addSelect('dafec.*')->leftJoin($baseAlias . '.DatAfeccion dafec');
    }


}

