<?php

class DatFotoModel extends ZendExt_Model implements IConceptoExport
{
    protected $objFoto;

    protected $response;

    function __construct()
    {
        $this->objFoto = new DatFoto();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getFotosByPersona($idpersona, $filtro, $limit, $start, array $arrImgs, $in)
    {
        try {
            $this->response->datos = $this->objFoto->getFotosByPersona(
                $idpersona, $filtro, $limit, $start, $arrImgs, $in
            );
            $this->response->cantidad = $this->objFoto->getCantFotosByPersona($idpersona, $filtro, $arrImgs, $in);

            return $this->response;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addFotos(array $fotos, $idpersona)
    {
        try {
            if (isset($idpersona)) {
                if (count($fotos) > 0) {
                    $cantdPrinc = 0;
                    $imgPrinc = $this->objFoto->getFotoPrincipalByPersona(array($idpersona));
                    $collection = new Doctrine_Collection(Doctrine_Core::getTable('DatFoto'));
                    foreach ($fotos as $k => $v) {
                        $collection[$k]->foto = $v->foto;
                        $collection[$k]->descripcion = $v->descripcion;
                        $collection[$k]->principal = $v->principal;
                        $cantdPrinc += ($v->principal == 1) ? 1 : 0;
                        $collection[$k]->fdesde = $v->fdesde;
                        $collection[$k]->fhasta = $v->fhasta;
                        $collection[$k]->idpersona = $idpersona;
                    }
                    if (count($imgPrinc) > 0 && $cantdPrinc > 0) {
                        throw new Exception('Ya existe una foto como principal', 3);
                    }
                    $collection->save();
                }
            } else {
                throw new  Exception('No existe la persona a la cual asignar las fotos', 3);
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function delFotos($idfoto, $idpersona)
    {
        try {
            $this->objFoto->delFotos($this->reflectArray($idfoto), $this->reflectArray($idpersona));
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

    public function setAsFotoPrincipal(array $idfoto, array $oldfoto, $idpersona)
    {
        try {
            if ($idfoto != $oldfoto) {
                $this->objFoto->updatePrincipalFoto($oldfoto, 'principal', 0);
                $this->objFoto->updatePrincipalFoto($idfoto, 'principal', 1);
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function generateCollection(array $fotos)
    {
        try {
            $collection = new Doctrine_Collection(Doctrine_Core::getTable('DatFoto'));
            foreach ($fotos as $k => $v) {
                $collection[$k]->foto = $v->imgbase64;
                $collection[$k]->descripcion = $v->descripcion != '' ? $v->descripcion : null;
                $collection[$k]->principal = $v->principal != '' ? $v->principal : null;
                $collection[$k]->fdesde = $v->fdesde;
                $collection[$k]->fhasta = $v->fhasta != '' ? $v->fhasta : null;
            }

            return $collection;
        } catch (Doctrine_Collection_Exception $e) {
            throw $e;
        }
    }

    public function getFotoPrincipal(array $idpersona)
    {
        try {
            $tmp = $this->objFoto->getFotoPrincipalByPersona($idpersona);

            return ($tmp) ? $tmp[0] : array();
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function concatDqlPersonaDataExport($query, $baseAlias)
    {
        return $query->addSelect('dfoto.*')->leftJoin($baseAlias . '.DatFoto dfoto');
    }
}

