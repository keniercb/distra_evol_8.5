<?php 
class DatAccidenteimplicadoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getImplicados($idaccidente, $filtro, $inicio, $limite)
    {
        try {
            $datos = DatAccidenteimplicado::getImplicados($idaccidente, $filtro, $inicio, $limite);
            if (count($datos)==0) {
                $datos = Array();
            } else {
                foreach ($datos as $p => $val) {
                    $cargo = ZendExt_IoC::getInstance()->metadatos->obtenerDatosCargo($val['idcargo']);
                    $datos[$p]['cargo'] = $cargo[0]['denominacion'];
                    $lesiones = DatImplicadopartecuerpo::getPartescuerpo($val['idaccidenteimplicado']);
                    foreach ($lesiones as $pl => $les) {
                        $datos[$p]['lesiones'][$pl] = $les['idimplicadopartecuerpo'];
                    }
                }
            }
            $resp->datos = $datos;
            $resp->cantidad = DatAccidenteimplicado::cantImplicados($idaccidente, $filtro);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getDatosImplicado($idaccidenteimplicado)
    {
        try {
            $datos = DatAccidenteimplicado::getDatosByImplicado($idaccidenteimplicado);
            if (count($datos)==0) {
                $datos = Array();
            } else {
                foreach ($datos as $p => $val) {
                    $cargo = ZendExt_IoC::getInstance()->metadatos->obtenerDatosCargo($val['idcargo']);
                    $datos[$p]['cargo'] = $cargo[0]['denominacion'];
                    $datos[$p]['categoria'] = $cargo[0]['categoria'];
                    $datos[$p]['sexo'] = ($val['idpersona'] == 0)?'Femenino':'Masculino';
                    $datos[$p]['cantaccidentes'] = DatAccidenteimplicado::getCantAccidenteBypersona($val['idpersona']);
                    $datos[$p]['niveleducacional'] = DatAccidenteimplicado::getNivelEduByPersona($val['idpersona']);
                }
            }
            return $datos;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function add($idaccidente, $idpersona, $idtipoinvalidez, $tareahabitual)
    {
        try {
            $existe = DatAccidenteimplicado::existePersona($idaccidente, $idpersona);
            if (count($existe) == 0) {
                $obj = new DatAccidenteimplicado();
                $obj->idaccidente = $idaccidente;
                $obj->idpersona = $idpersona;
                $obj->idtipoinvalidez = (empty($idtipoinvalidez))?null:$idtipoinvalidez;
                $obj->tareahabitual = (empty($tareahabitual))?null:$tareahabitual;
                $obj->save();
                return true;
            } else {
                return 2;
            }
        } catch (Exception $e) {
            return false;
        }
    }

    public function update($idaccidenteimplicado, $idtipoinvalidez, $tareahabitual)
    {
        try {
            $obj = DatAccidenteimplicado::getById($idaccidenteimplicado);
            if (isset($idtipoinvalidez)) {
                $obj->idtipoinvalidez = $idtipoinvalidez;
            }
            if (isset($tareahabitual)) {
                $obj->tareahabitual = $tareahabitual;
            }
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function updateFallecimiento($idaccidenteimplicado, $ff, $desc)
    {
        try {
            $obj = DatAccidenteimplicado::getById($idaccidenteimplicado);
            if (isset($ff)) {
                $obj->ffallecimiento = $ff;
            }
            if (isset($desc)) {
                $obj->descfallecido = $desc;
            }
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function delete($idaccidenteimplicado)
    {
        try {
            $obj = DatAccidenteimplicado::getById($idaccidenteimplicado);
            $obj->delete();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }

    public function addLesion($idaccidenteimplicado, $idnaturalezalesion, $idpartecuerpo, $descripcion)
    {
        try {
            $obj = new DatImplicadopartecuerpo();
            $obj->idaccidenteimplicado = $idaccidenteimplicado;
            $obj->idpartecuerpo = $idpartecuerpo;
            $obj->idnaturalezalesion = $idnaturalezalesion;
            $obj->descripcion = $descripcion;
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function updateLesion($idimplicadopartecuerpo, $idnaturalezalesion, $idpartecuerpo, $descripcion)
    {
        try {
            $obj = DatImplicadopartecuerpo::getById($idimplicadopartecuerpo);
            $obj->idpartecuerpo = $idpartecuerpo;
            $obj->idnaturalezalesion = $idnaturalezalesion;
            $obj->descripcion = $descripcion;
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function deleteLesion($idimplicadopartecuerpo)
    {
        try {
            $obj = DatImplicadopartecuerpo::getById($idimplicadopartecuerpo);
            $obj->delete();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }
    
    public function getSubsidios($idaccidenteimplicado, $inicio, $limite)
    {
        try {
            $datos = DatImplicadosubsidio::getSubsidios($idaccidenteimplicado, $inicio, $limite);
            if (count($datos)==0) {
                $datos = Array();
            }
            $resp->datos = $datos;
            $resp->cantidad = DatImplicadosubsidio::cantSubsidios($idaccidenteimplicado);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }
    
    public function addSubsidio($idaccidenteimplicado, $denominacion, $importe)
    {
        try {
            $obj = new DatImplicadosubsidio();
            $obj->idaccidenteimplicado = $idaccidenteimplicado;
            $obj->denominacion = $denominacion;
            $obj->importe = $importe;
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }
    
    public function updateSubsidio($idimplicadosubsidio, $denominacion, $importe)
    {
        try {
            $obj = DatImplicadosubsidio::getById($idimplicadosubsidio);
            $obj->denominacion = $denominacion;
            $obj->importe = $importe;
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }
    
    public function deleteSubsidio($idimplicadosubsidio)
    {
        try {
            $obj = DatImplicadosubsidio::getById($idimplicadosubsidio);
            $obj->delete();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }

    
}