<?php

class DatNiveleducacionalModel extends ZendExt_Model
{
    protected $objDomain;

    protected $response;

    function __construct()
    {
        $this->objDomain = new DatNiveleducacional();
        $this->objEstructuraService = new EyCServices();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }


    public function getNiveleducacional($idpersona)
    {

        try {
            $data = $this->objDomain->getNiveleducacional(
                $idpersona
            );
            //print_r($data);die;

           foreach ($data as $c => $array) {

                $niveleducacional = NomNiveleducacional::getNivelByID($array['idniveleducacional']);
                $data[$c]['niveleducacional'] =$niveleducacional[0]['denominacion'];
               $titulo = NomTitulo::getById($array['idtitulo']);
               $data[$c]['titulo'] = $titulo->denominacion;
           }

            $this->response->data = $data;
            return $this->response;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addNiveleducacional(array $data, $idpersona)
    {

        try {
            if (count($data) > 0) {
                $collection = new Doctrine_Collection('DatNiveleducacional');
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

    public function modNiveleducacional(array $data, array $ids)
    {
        try {

            if (count($data) > 0 && count($ids) > 0) {
                $collection = $this->objDomain->getById($ids, false);

                if (count($collection) > 0) {
                    foreach ($collection as $p => $v) {
                        foreach ($data[$v->idniveleducacionalp] as $k => $val) {
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

    public function delNiveleducacional($id, $idPersona)
    {
        try {
            return $this->objDomain->delNiveleducacional(Utiles::reflectArray($id), $idPersona);
        } catch (Exception $e) {
            throw $e;
        }
    }

}