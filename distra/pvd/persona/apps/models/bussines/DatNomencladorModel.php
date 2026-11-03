<?php

class DatNomencladorModel extends ZendExt_Model
{
    protected $objnomencladores;

    function __construct()
    {
        $this->objnomencladores = new DatNomenclador();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getAllNomencladoresVisibles($id, $filtro)
    {
        return $this->objnomencladores->getAllNomencladores($this->reflectArray($id), $filtro);
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

    public function getNomencladores($id, $filtro, $limit, $start)
    {
        try {
            $response->data = $this->objnomencladores->getNomencladores(
                $this->reflectArray($id), $filtro, $limit, $start
            );
            $response->quantity = ($limit > 0) ? $this->objnomencladores->getCantNomencladores(
                $this->reflectArray($id), $filtro, $limit, $start
            ) : count($response->data);

            return $response;
        } catch (Exception $e) {
            throw $e;
        }
    }
}