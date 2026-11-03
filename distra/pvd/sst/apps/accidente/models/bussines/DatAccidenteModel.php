<?php 
class DatAccidenteModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getAccidentes($filtro, $identidad, $finicio, $ffin, $inicio, $limite)
    {
        try {
            $hijosest =  ZendExt_IoC::getInstance()->metadatos->DameHijosInternas($identidad);
            $estructuras = array($identidad);
            foreach ($hijosest as $est) {
                array_push($estructuras, $est->id);
            }
            $entidades = ZendExt_IoC::getInstance()->metadatos->BuscarEntidadbyDominio($identidad);
            foreach ($entidades as $e) {
                array_push($estructuras, $e->idfila);
            }
            $datos = DatAccidente::getAccidentes($estructuras, $filtro, $finicio, $ffin, $inicio, $limite);
            if (count($datos)==0) {
                $datos = Array();
            } else {
                foreach ($datos as $p=>$acc) {
                    $datos[$p]['equip']  = ($acc['equiparado'] == 1)?'Si': 'No';
                    $estructura = ZendExt_IoC::getInstance()->metadatos->DameEstructura($acc['identidad']);
                    $datos[$p]['estructura'] = $estructura[0]->denominacion;
                }
            }
            $resp->datos = $datos;
            $resp->cantidad = DatAccidente::cantAccidentes($estructuras, $filtro, $finicio, $ffin);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function add(
        $identidad, $lugar, $idtipoaccidente, $idformaaccidente, $idagente, $fecha, $hora, $descripcion, $equiparado
    )
    {
        try {
            $obj = new DatAccidente();
            $obj->lugar = $lugar;
            $obj->idtipoaccidente = $idtipoaccidente;
            $obj->idformaaccidente = $idformaaccidente;
            $obj->idagente = $idagente;
            $obj->fecha = $fecha;
            $obj->hora = $hora;
            $obj->descripcion = $descripcion;
            $obj->identidad = $identidad;
            $obj->equiparado = $equiparado;
            $obj->save();
            return true;
           
        } catch (Exception $e) {
            return false;
        }
    }

    public function update(
        $idaccidente, $lugar, $idtipoaccidente, $idformaaccidente, $idagente, $fecha, $hora, $descripcion, $equiparado
    )
    {
        try {            
            $obj = DatAccidente::getById($idaccidente);
            $obj->lugar = $lugar;
            $obj->idtipoaccidente = $idtipoaccidente;
            $obj->idformaaccidente = $idformaaccidente;
            $obj->idagente = $idagente;
            $obj->fecha = $fecha;
            $obj->hora = $hora;
            $obj->descripcion = $descripcion;
            $obj->equiparado = $equiparado;
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function delete($idaccidente)
    {
        try {
            $obj = DatAccidente::getById($idaccidente);
            $obj->delete();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }

    public function getAccidentesReporteIndic($identidad)
    {
        try {
            $fecha = date('d/m/Y');
            $f = explode('/', $fecha);
            $year = $f[2];
            $accidentestrabact = DatAccidente::getAccidentesAnno($year, 0, $identidad);
            $canttraactmort = 0;
            foreach ($accidentestrabact as $v) {
                $ex = DatAccidenteimplicado::existeFallecido($v['idaccidente'], $identidad);
                if (count($ex) > 0) {
                    $canttraactmort++;
                }
            }
            $datos->canttrabuno = count($accidentestrabact);
            $datos->canttrabunom = $canttraactmort;
            $accidentestrabant = DatAccidente::getAccidentesAnno($year-1, 0, $identidad);
            $canttraantmort = 0;
            foreach ($accidentestrabant as $v) {
                $ex = DatAccidenteimplicado::existeFallecido($v['idaccidente'], $identidad);
                if (count($ex) > 0) {
                    $canttraantmort++;
                }
            }
            $datos->canttrabdos = count($accidentestrabant);
            $datos->canttrabdosm = $canttraantmort;
            $accidentesequipact = DatAccidente::getAccidentesAnno($year, 1, $identidad);
            $cantequipactmort = 0;
            foreach ($accidentesequipact as $v) {
                $ex = DatAccidenteimplicado::existeFallecido($v['idaccidente'], $identidad);
                if (count($ex) > 0) {
                    $cantequipactmort++;
                }
            }
            $datos->cantequipuno = count($accidentesequipact);
            $datos->cantequipunom = $cantequipactmort;
            $accidentesequipant = DatAccidente::getAccidentesAnno($year-1, 1, $identidad);
            $cantequipantmort = 0;
            foreach ($accidentesequipant as $v) {
                $ex = DatAccidenteimplicado::existeFallecido($v['idaccidente'], $identidad);
                if (count($ex) > 0) {
                    $cantequipantmort++;
                }
            }
            $datos->cantequipdos = count($accidentesequipant);
            $datos->cantequipdosm = $cantequipantmort;
            $lestrabact = DatImplicadopartecuerpo::getLesionadosAnno($year, 0, $identidad);
            $lestrabactmuj = 0;
            $personas = Array();
            if (count($lestrabact)>0) {
                foreach ($lestrabact as $v) {
                    array_push($personas, $v['idpersona']);
                }
                $fem = DatImplicadopartecuerpo::isFemenino($personas);
                $lestrabactmuj = count($fem);
            }
            $datos->cantlesuno = count($lestrabact);
            $datos->cantlesunom = $lestrabactmuj;
            
            $lestrabant = DatImplicadopartecuerpo::getLesionadosAnno($year-1, 0, $identidad);
            $lestrabantmuj = 0;
            $personas = Array();
            if (count($lestrabant)>0) {
                foreach ($lestrabant as $v) {
                    array_push($personas, $v['idpersona']);
                }
                $fem = DatImplicadopartecuerpo::isFemenino($personas);
                $lestrabantmuj = count($fem);
            }
            $datos->cantlesdos = count($lestrabant);
            $datos->cantlesdosm = $lestrabantmuj;

            $lesequipact = DatImplicadopartecuerpo::getLesionadosAnno($year, 1, $identidad);
            $lesequipactmuj = 0;
            $personas = Array();
            if (count($lesequipact)>0) {
                foreach ($lesequipact as $v) {
                    array_push($personas, $v['idpersona']);
                }
                $fem = DatImplicadopartecuerpo::isFemenino($personas);
                $lesequipactmuj = count($fem);
            }
            $datos->cantlesequipuno = count($lesequipact);
            $datos->cantlesequip1m = $lesequipactmuj;

            $lesequipant = DatImplicadopartecuerpo::getLesionadosAnno($year-1, 1, $identidad);
            $lesequipantmuj = 0;
            $personas = Array();
            if (count($lesequipant)>0) {
                foreach ($lesequipant as $v) {
                    array_push($personas, $v['idpersona']);
                }
                $fem = DatImplicadopartecuerpo::isFemenino($personas);
                $lesequipantmuj = count($fem);
            }
            $datos->cantlesequipdos = count($lesequipant);
            $datos->cantlesequipdosm = $lesequipantmuj;
            
            $fallecidos = DatAccidenteimplicado::existeFallecido(null, $identidad, $year, 0);
            $datos->cantfalltrab = count($fallecidos);
            $personas = Array();
            if (count($fallecidos)>0) {
                foreach ($fallecidos as $v) {
                    array_push($personas, $v['idpersona']);
                }
                $fem = DatImplicadopartecuerpo::isFemenino($personas);
                $datos->cantfalltrabm = count($fem);
            } else {
                $datos->cantfalltrabm = 0;
            }
            $fallecidosant = DatAccidenteimplicado::existeFallecido(null, $identidad, $year-1, 0);
            $datos->cantfalltrabant = count($fallecidosant);
            $personas = Array();
            if (count($fallecidosant)>0) {
                foreach ($fallecidosant as $v) {
                    array_push($personas, $v['idpersona']);
                }
                $fem = DatImplicadopartecuerpo::isFemenino($personas);
                $datos->cantfalltrabmant = count($fem);
            } else {
                $datos->cantfalltrabmant = 0;
            }
            return $datos;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getDatosAccidente($idaccidente)
    {
        $accidente = DatAccidente::getAccidenteById($idaccidente);
        $accidente['implicados'] = DatAccidenteimplicado::getImplicados($idaccidente);
        $accidente['causas'] = DatAccidentecausa::getCausas($idaccidente);
        $accidente['recomendaciones'] = DatAccidenterecomendacion::getRecomendaciones($idaccidente);
        $accidente['conclusiones'] = DatAccidenteconclusiones::getConclusiones($idaccidente);
        $accidente['equiparado'] = ($accidente['equiparado'] == 0)?'No':'Si';
        return $accidente;
    }
}