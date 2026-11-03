<?php

class DatLimitacionModel extends ZendExt_Model
{
    protected $objLimitacion;
    protected $objAccesoSinDominio;

    function __construct()
    {
        $this->objLimitacion = new DatLimitacion();
        $this->objAccesoSinDominio = new SegAccesosindominioModel();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getLimitacion($filtro, $limit, $start, $idestructura)
    {
        try {
            $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, true);
            if (count($cargos) > 0) {
                foreach ($cargos as $h => $carg) {
                    $idcargos[$h] = $carg['idcargo'];
                }
            }
            $datos= $this->objLimitacion->getLimitacion($filtro, $limit, $start, $idcargos);
            foreach ($datos as $a => $d) {
                $idueb = (empty($d['ueb']))?$d['identidad']:$d['ueb'];
                $estructura = ZendExt_IoC::getInstance()->metadatos->DameEstructura($idueb);
                $datos[$a]['ueb'] = $estructura[0]->denominacion;
                $datos[$a]['idestructura'] = $estructura[0]->idestructura;
            }
            $response->data =  $datos;
            $response->quantity = $this->objLimitacion->getCantLimitacion($filtro, $idcargos);
            return $response;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getPersonas($filtro, $inicio, $limite, $idestructura)
    {
        try {
            $idestructura = (isset($idestructura))?$idestructura:$this->global->Estructura->idestructura;
            $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, true);
            if (count($cargos) > 0) {
                foreach ($cargos as $h => $carg) {
                    $idcargos[$h] = $carg['idcargo'];
                }
            }
            $datos = $this->objLimitacion->getPersonasByIdCargo($filtro, $idcargos, $inicio, $limite);
            foreach ($datos as $a => $d) {
                $cargo = ZendExt_IoC::getInstance()->metadatos->obtenerDatosCargo($d['idcargo']);
                $datos[$a]['cargo'] = $cargo[0]['denominacion'];
            }
            $response->data =  $datos;
            $response->quantity = $this->objLimitacion->cantPersonasByIdCargo($filtro, $idcargos);
            return $response;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function  addLimitacion($idpersona, $idcausa, $fdesde, $fhasta, $idsituacionlaboralp)
    {
        try {
            $obj = new DatLimitacion();
            $obj->idpersona = $idpersona;
            $obj->idcausa = $idcausa;
            $obj->fdesde = $fdesde;
            $obj->fhasta = $fhasta;
            $obj->idsituacionlaboral = $idsituacionlaboralp;
            $obj->save();
            return true;
        } catch (Exception $e) {
           return false;
        }
    }

    public function updateLimitacion($idliminacion, $idpersona, $idcausa, $fdesde, $fhasta, $idsituacionlaboralp)
    {
        try {
            $obj = new DatLimitacion();
            $objlimit = $obj->getById($idliminacion);
            $objlimit->idpersona = $idpersona;
            $objlimit->idcausa = $idcausa;
            $objlimit->fdesde = $fdesde;
            $objlimit->fhasta = $fhasta;
            $objlimit->idsituacionlaboral = $idsituacionlaboralp;
            $objlimit->save();
            return true;
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    public function deleteLimitacion($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->delete()->from('DatLimitacion');
            if (is_array($arrids)) {
                $query->whereIn('idlimitacion', $arrids);
            } elseif (is_numeric($arrids)) {
                $query->where('idlimitacion = ?', $arrids);
            }
            $query->execute();
            return true;
        } catch (Doctrine_Exception $e) {
            if ($e->getCode() == 23503) {
                return false;
            } else {
                throw $e;
            }
        }
    }
}