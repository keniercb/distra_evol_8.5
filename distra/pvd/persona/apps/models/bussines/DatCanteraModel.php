<?php

class DatCanteraModel extends ZendExt_Model
{
    protected $objDomain;

    protected $response;

    function __construct()
    {
        $this->objDomain = new DatCantera();
        $this->objEstructuraService = new EyCServices();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getCargos($valor/*, $limit, $start*/)
    {
        $cargos = $this->objEstructuraService->getAllCargos($valor/*, $limit, $start*/);
        $array = array();
        foreach ($cargos as $key => $v) {
            $array[$key]['idcargopropuesto'] = $v['idnomcargo'];
            $array[$key]['denominacion'] = $v['denominacion'];
        }
        return $array;
    }


    public function getCanteras($idpersona)
    {
        try {
            $data = $this->objDomain->getCanteras(
                $idpersona
            );

            foreach ($data as $c => $array) {

                $estructura = $this->objEstructuraService->getEstructura($array['idorganismo']);

                $data[$c]['organismo'] = $estructura[0]->denominacion;

                $cargo = $this->objEstructuraService->getAllCargos($array['idcargopropuesto'], null, null);

                $data[$c]['cargopropuesto'] = $cargo[0]['denominacion'];


            }

            $this->response->data = $data;
            return $this->response;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addCantera(array $data, $idpersona)
    {
        try {
            if (count($data) > 0) {
                $collection = new Doctrine_Collection('DatCantera');
                foreach ($data as $p => $array) {
                    foreach ($array as $k => $v) {
                        $collection[$p][$k] = (!empty($v) || $v != '') ? $v : null;
                    }
                    $collection[$p]['idpersona'] = $idpersona;
                }
                $collection->save();
            }
        } catch (Doctrine_Collection_Exception $e) {

            throw $e;
        }
    }

    public function modCantera(array $data, array $ids)
    {
        try {

            if (count($data) > 0 && count($ids) > 0) {
                $collection = $this->objDomain->getById($ids, false);
                if (count($collection) > 0) {
                    foreach ($collection as $p => $v) {
                        foreach ($data[$v->idcantera] as $k => $val) {
                            $collection[$p]->$k = (!empty($val)) ? $val : null;
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

    public function delCantera($id, $idPersona)
    {
        try {
            return $this->objDomain->delCantera(Utiles::reflectArray($id), $idPersona);
        } catch (Exception $e) {
            throw $e;
        }
    }

}