<?php 
class DatRiesgoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getRiesgo($filtro, $idestructura, $limit = null, $start = 0)
    {
        try {
            $hijosest =  ZendExt_IoC::getInstance()->metadatos->DameHijosInternas($idestructura);
            $estructuras = array($idestructura);
            foreach ($hijosest as $est) {
                array_push($estructuras, $est->id);
            }
            $entidades = ZendExt_IoC::getInstance()->metadatos->BuscarEntidadbyDominio($idestructura);
            foreach ($entidades as $e) {
                array_push($estructuras, $e->idfila);
            }
            
            $obj = new DatRiesgo();
            $datos = $obj->getRiesgos($estructuras, $filtro, $start, $limit);
            
            if (count($datos)==0) {
                $datos = Array();
            } else {
                foreach ($datos as $p => $rie) {
                    $estructura = ZendExt_IoC::getInstance()->metadatos->DameEstructura($rie['idestructura']);
                    $datos[$p]['estructura'] = $estructura[0]->denominacion;
                    $idconsecuencia = DatRconsecuencia::getConsecuenciaPrincipalByRiesgo($rie['idriesgo']);
                    $objgp = new ConfGradopeligrosidad();
                    $gradop = $objgp->getConfGradopeligrosidad();
                    if (count($gradop) > 0) {
                        $arrIndGP = array(['idindicador' => 1, 'valor' => $rie['vfrecuencia']],
                            ['idindicador' => 2, 'valor' => $idconsecuencia[0]['vconsecuencia']],
                            ['idindicador' => 3, 'valor' => $rie['vprobabilidad']]);
                        $auxgradop = ZendExt_IoC_Inter::getInstance()->comun->EvaluarExpresionMatematica(
                            $gradop[0]['idexpresionmatematica'], $arrIndGP
                        );
                        if (!empty($auxgradop->valor)) {
                            $datos[$p]['gradopeligrosidad'] = $auxgradop->valor;
                            $arrIndicadores = array(['idindicador' => 1, 'valor' => $rie['vfrecuencia']],
                                ['idindicador' => 2, 'valor' => $idconsecuencia[0]['vconsecuencia']],
                                ['idindicador' => 3, 'valor' => $rie['vprobabilidad']],
                                ['idindicador' => 4,'valor' => $auxgradop->valor]);
                            $datosmag = $this->getMagnitud($arrIndicadores);
                            $datos[$p]['magnitud'] = $datosmag->valor;
                            $datos[$p]['orden'] = $datosmag->orden;
                        }
                    }
                }
            }
            $resp->datos = $datos;
            $resp->cantidad = $obj->cantRiesgos($estructuras, $filtro);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getMagnitud($indicadores)
    {
        //Comprueba que los indicadores que no han sido evaluados les pone 0
        foreach ($indicadores as $k => $ind) {
            if (empty($ind['valor'])) {
                $indicadores[$k]['valor'] = 0;
            }
        }
        $magnitudes = ConfMagnitudriesgo::getConfMagnitudriesgo();
        foreach ($magnitudes as $p => $mag) {
            $aux = ZendExt_IoC_Inter::getInstance()->comun->EvaluarExpresionMatematica(
                $mag['idexpresionmatematica'], $indicadores
            );
            if ($aux->valor == 1) {
                $mm->valor = $mag['denominacion'];
                $mm->orden = $mag['orden'];
                return $mm;
            }
        }
        return '';
    }
    
    public function addRiesgo($idnriesgo, $idestructura, $descripcion, $fdeteccion, $idfrecuencia, $idprobabilidad, $idnivelriesgo,
        $idsistema, $idpartesistema)
    {
        try {
            $existe = DatRiesgo::existe($idnriesgo, $idestructura);
            if (count($existe) == 0) {
                $obj = new DatRiesgo();
                $obj->idnriesgo = $idnriesgo;
                $obj->idestructura = $idestructura;
                $obj->descripcion = $descripcion;
                $obj->fdeteccion = $fdeteccion;
                $obj->idfrecuencia = $idfrecuencia;
                $obj->idprobabilidad = $idprobabilidad;
                $obj->idnivelriesgo = $idnivelriesgo;
                $obj->idsistema = (empty($idsistema)) ? null : $idsistema;
                $obj->idpartesistema = (empty($idpartesistema)) ? null : $idpartesistema;
                $obj->save();
                return true;
            } else {
                return false;
            }
        } catch (Exception $e) {
            return 2;
        }
    }
    
    public function updateRiesgo($idriesgo, $idnriesgo, $idestructura, $descripcion, $fdeteccion, $idfrecuencia, $idprobabilidad, $idnivelriesgo,
        $idsistema, $idpartesistema)
    {
        try {
            $obj = DatRiesgo::getById($idriesgo);
            $existe = DatRiesgo::existe($idnriesgo, $idestructura);
            if (count($existe) == 0 || $existe[0]['idriesgo'] == $idriesgo) {
                $obj->idnriesgo = $idnriesgo;
                $obj->idestructura = $idestructura;
                $obj->descripcion = $descripcion;
                $obj->fdeteccion = $fdeteccion;
                $obj->idfrecuencia = $idfrecuencia;
                $obj->idprobabilidad = $idprobabilidad;
                $obj->idnivelriesgo = $idnivelriesgo;
                $obj->idsistema = (empty($idsistema))?null:$idsistema;
                $obj->idpartesistema = (empty($idpartesistema)) ? null :$idpartesistema;
                $obj->save();
                return true;
            } else {
                return false;
            }
        } catch (Exception $e) {
            return 2;
        }
    }
    
    public function deleteRiesgo($idriesgo)
    {
        try {
            $obj = DatRiesgo::getById($idriesgo);
            $obj->delete();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }
    
    public function getMedidas($idriesgo, $limit = null, $start = 0)
    {
        try {
            $obj = new DatMedida();
            $datos = $obj->getMedidasByRiesgo($idriesgo, $limit, $start);
            if (count($datos)==0) {
                $datos = Array();
            }
            $resp->datos = $datos;
            $resp->cantidad = $obj->getCantMedidasByRiesgo($idriesgo);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }
    
    public function addMedida($idriesgo, $medida, $responsable, $fcumplimiento)
    {
        try {
            $existe = DatMedida::existeMed($idriesgo, $medida);
            if (count($existe) == 0) {
                $obj = new DatMedida();
                $obj->idriesgo = $idriesgo;
                $obj->medida = $medida;
                $obj->responsable = $responsable;
                $obj->fcumplimiento = $fcumplimiento;
                $obj->save();
                return true;
            } else {
                return false;
            }
        } catch (Exception $e) {
            return false;
        }
    }

    public function updateMedida($idmedida, $idriesgo, $medida, $responsable, $fcumplimiento)
    {
        try {
            $obj = DatMedida::getById($idmedida);
            $existe = DatMedida::existeMed($idriesgo, $medida);
            if (count($existe) == 0 || $existe[0]['idmedida'] == $idmedida) {
                $obj->idriesgo = $idriesgo;
                $obj->medida = $medida;
                $obj->responsable = $responsable;
                $obj->fcumplimiento = $fcumplimiento;
                $obj->save();
                return true;
            } else {
                return false;
            }
        } catch (Exception $e) {
            return false;
        }
    }
    
    public function deleteMedida($idmedida)
    {
        try {
            $obj = DatMedida::getById($idmedida);
            $obj->delete();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }
    
    public function getRecursos($idriesgo, $limit = null, $start = 0)
    {
        try {
            $obj = new DatRecursos();
            $datos = $obj->getRecursosByRiesgo($idriesgo, $limit, $start);
            if (count($datos)==0) {
                $datos = Array();
            }
            $resp->datos = $datos;
            $resp->cantidad = $obj->getCantRecursosByRiesgo($idriesgo);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }
    
    public function addRecurso($idriesgo, $idrecurso, $descripcion, $fdesde, $fhasta)
    {
        try {
            $existe = DatRecursos::existeRec($idriesgo, $idrecurso);
            if (count($existe) == 0) {
                $obj = new DatRecursos();
                $obj->idriesgo = $idriesgo;
                $obj->idrecurso = $idrecurso;
                $obj->descripcion = $descripcion;
                $obj->fdesde = $fdesde;
                $obj->fhasta = $fhasta;
                $obj->save();
                return true;
            } else {
                return false;
            }
        } catch (Exception $e) {
            return false;
        }
    }
    
    public function updateRecurso($iddrecurso, $idriesgo, $idrecurso, $descripcion, $fdesde, $fhasta)
    {
        try {
            $obj = DatRecursos::getById($iddrecurso);
            $existe = DatRecursos::existeRec($idriesgo, $idrecurso);
            if (count($existe) == 0 || $existe[0]['iddrecurso'] == $iddrecurso) {
                $obj->idriesgo = $idriesgo;
                $obj->idrecurso = $idrecurso;
                $obj->descripcion = $descripcion;
                $obj->fdesde = $fdesde;
                $obj->fhasta = $fhasta;
                $obj->save();
                return true;
            } else {
                return false;
            }
        } catch (Exception $e) {
            return false;
        }
    }
    
    public function deleteRecurso($iddrecurso)
    {
        try {
            $obj = DatRecursos::getById($iddrecurso);
            $obj->delete();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }

    public function addEvento($idriesgo, $idevento, $fregistro, $observaciones)
    {
        try {
            $existe = DatRiesgoevento::existeEvento($idriesgo, $idevento);
            if (count($existe) == 0) {
                $obj = new DatRiesgoevento();
                $obj->idriesgo = $idriesgo;
                $obj->idevento = $idevento;
                $obj->observaciones = $observaciones;
                $obj->fregistro = $fregistro;
                $obj->save();
                return true;
            } else {
                return false;
            }
        } catch (Exception $e) {
            return false;
        }
    }

    public function updateEvento($idriesgoevento, $idriesgo, $idevento, $fregistro, $observaciones)
    {
        try {
            $obj = DatRiesgoevento::getById($idriesgoevento);
            $existe = DatRiesgoevento::existeEvento($idriesgo, $idevento);
            if (count($existe) == 0 || $existe[0]['idriesgoevento'] == $idriesgoevento) {
                $obj->idriesgo = $idriesgo;
                $obj->idevento = $idevento;
                $obj->observaciones = $observaciones;
                $obj->fregistro = $fregistro;
                $obj->save();
                return true;
            } else {
                return false;
            }
        } catch (Exception $e) {
            return false;
        }
    }

    public function deleteEvento($idriesgoevento)
    {
        try {
            $obj = DatRiesgoevento::getById($idriesgoevento);
            $obj->delete();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }

    public function addConsecuencia($idriesgo, $idconsecuencia, $fregistro, $observaciones, $principal)
    {
        try {
            $existe = DatRconsecuencia::existeConsecuencia($idriesgo, $idconsecuencia);
            if (count($existe) == 0) {
                $obj = new DatRconsecuencia();
                $obj->idriesgo = $idriesgo;
                $obj->idconsecuencia = $idconsecuencia;
                $obj->fregistro = $fregistro;
                $obj->observaciones = $observaciones;
                $obj->principal = $principal;
                $obj->save();
                return true;
            } else {
                return false;
            }
        } catch (Exception $e) {
            return false;
        }
    }

    public function updateConsecuencia($idrconsecuencia, $idriesgo, $idconsecuencia, $fregistro, $observaciones,
        $principal)
    {
        try {
            $obj = DatRconsecuencia::getById($idrconsecuencia);
            $existe = DatRconsecuencia::existeConsecuencia($idriesgo, $idconsecuencia);
            if (count($existe) == 0 || $existe[0]['idrconsecuencia'] == $idrconsecuencia) {
                $obj->idriesgo = $idriesgo;
                $obj->idconsecuencia = $idconsecuencia;
                $obj->fregistro = $fregistro;
                $obj->observaciones = $observaciones;
                $obj->principal = $principal;
                $obj->save();
                return true;
            } else {
                return false;
            }
        } catch (Exception $e) {
            return false;
        }
    }

    public function deleteConsecuencia($idrconsecuencia)
    {
        try {
            $obj = DatRconsecuencia::getById($idrconsecuencia);
            $obj->delete();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }

    public function addPeligro($idriesgo, $idpeligro, $fregistro, $observaciones)
    {
        try {
            $existe = DatRpeligro::existePeligro($idriesgo, $idpeligro);
            if (count($existe) == 0) {
                $obj = new DatRpeligro();
                $obj->idriesgo = $idriesgo;
                $obj->idpeligro = $idpeligro;
                $obj->fregistro = $fregistro;
                $obj->observaciones = $observaciones;
                $obj->save();
                return true;
            } else {
                return false;
            }
        } catch (Exception $e) {
            return false;
        }
    }

    public function updatePeligro($idrpeligro, $idriesgo, $idpeligro, $fregistro, $observaciones)
    {
        try {
            $obj = DatRpeligro::getById($idrpeligro);
            $existe = DatRpeligro::existePeligro($idriesgo, $idpeligro);
            if (count($existe) == 0 || $existe[0]['idrpeligro'] == $idrpeligro) {
                $obj->idriesgo = $idriesgo;
                $obj->idpeligro = $idpeligro;
                $obj->fregistro = $fregistro;
                $obj->observaciones = $observaciones;
                $obj->save();
                return true;
            } else {
                return false;
            }
        } catch (Exception $e) {
            return false;
        }
    }

    public function deletePeligro($idrpeligro)
    {
        try {
            $obj = DatRpeligro::getById($idrpeligro);
            $obj->delete();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }

    public function getEventosByRiesgo($idriesgo, $limit, $start)
    {
        try {
            $obj = new DatRiesgoevento();
            $datos = $obj->getEventosByRiesgo($idriesgo, $limit, $start);
            if (count($datos)==0) {
                $datos = Array();
            }
            $resp->datos = $datos;
            $resp->cantidad = $obj->getCantEventosByRiesgo($idriesgo);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getConsecuenciasByRiesgo($idriesgo, $limit, $start)
    {
        try {
            $obj = new DatRconsecuencia();
            $datos = $obj->getConsecuenciasByRiesgo($idriesgo, $limit, $start);
            if (count($datos) == 0) {
                $datos = Array();
            }
            $resp->datos = $datos;
            $resp->cantidad = $obj->getCantConsecuenciasByRiesgo($idriesgo);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getPeligrosByRiesgo($idriesgo, $limit, $start)
    {
        try {
            $obj = new DatRpeligro();
            $datos = $obj->getPeligrosByRiesgo($idriesgo, $limit, $start);
            if (count($datos) == 0) {
                $datos = Array();
            }
            $resp->datos = $datos;
            $resp->cantidad = $obj->getCantPeligrosByRiesgo($idriesgo);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }
}