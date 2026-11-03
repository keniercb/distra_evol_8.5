<?php 
class DatAccionparticipanteModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getAccionesParticipantes($idaccion, $start = 0, $limit = null)
    {
        try {
            // Obtener participantes
            $obj = new DatAccionparticipante();
            $datos = $obj->getParticipantesByAccion($idaccion, $start, $limit);
            if (count($datos)==0) {
                $datos = Array();
            } else {
                $idcargos = Array();
                $idpersonas = Array();
                foreach ($datos as $d) {
                    array_push($idpersonas, $d['idpersona']);
                }
                $personas = ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersona(
                    $idpersonas, null, null, null, null, null, null, null, null, null, null
                );
                foreach ($personas->data as $person) {
                    if (!empty($person['idcargo'])) {
                        array_push($idcargos, $person['idcargo']);
                    }
                }
                if (count($idcargos) > 0) {
                    $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerDatosCargo($idcargos);
                }

                // Obtener periodos
                $periodos = NomPeriodo::getPeriodosActivos();
                $accion = DatAccionn::getById($idaccion);

                foreach ($datos as $p=>$part) {
                    $datos[$p]['alerta'] = 0;
                    //si hay que evaluar el periodo comprobar que este evaluado sino advertir
                    if (!empty($accion->frhasta)) {
                        foreach ($periodos as $pp) {
                            $f = $accion->frhasta;
                            list($day, $mon, $year) = explode('/', $f);
                            $dttemp = date('d/m/Y', mktime(0, 0, 0, $mon+$pp['tiempo'], $day, $year));
                            if (DatAccionparticipanteModel::compararFechas(date('d/m/Y'), $dttemp)>0) {
                                $evalimp = DatEvalimpacto::getEvalImpactoByAccionParticipantePer(
                                    $part['idaccionparticipante'], $pp['idperiodo']
                                );
                                if (count($evalimp)==0) {
                                    $datos[$p]['alerta'] = 1;
                                }
                            }
                        }
                    }
                    foreach ($personas->data as $per) {
                        if ($per['idpersona'] == $part['idpersona']) {
                            $datos[$p]['nombreyapellidos'] = $per['nombreapellidos'];
                            $datos[$p]['numid'] = $per['numid'];
                            foreach ($cargos as $c) {
                                if ($per['idcargo'] == $c['idcargo']) {
                                    $datos[$p]['cargo'] = $c['denominacion'];
                                    $datos[$p]['idcategoria']=$c['idcategoria'];
                                    $datos[$p]['categoria']= $c['categoria'];
                                }
                            }
                        }
                    }
                }
            }
            $resp->datos = $datos;
            $resp->cantidad = $obj->cantAcciones($idaccion);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getParticipantesByEstructura($idestructura, $filtro, $start = 0, $limit = null)
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
            $participantes = Array();
            $objap = new DatAccionparticipante();
            $participantes = $objap->getParticipantesByEstructuras($filtro, $estructuras, $start, $limit);
            $cantidad = $objap->cantParticipantesByEstructuras($filtro, $estructuras);
            if ($cantidad > 0) {
                foreach ($participantes as $a => $d) {
                    $estrr = array($d['identidad'], $d['idarea']);
                    if (!empty($d['ueb'])) {
                        array_push($estrr, $d['ueb']);
                    }
                    $etd = ZendExt_IoC::getInstance()->metadatos->ObtenerDatosEstructuraPorArrayID($estrr);
                    $participantes[$a]['entidad'] = $etd[0][0]->denominacion;
                    $participantes[$a]['area'] = $etd[1][0]->denominacion;
                    $cargo = ZendExt_IoC::getInstance()->metadatos->obtenerDatosCargo($d['idcargo']);
                    $participantes[$a]['cargo'] = $cargo[0]['denominacion'];
                    $participantes[$a]['idcategoria']=$cargo[0]['idcategoria'];
                    $participantes[$a]['categoria']=$cargo[0]['categoria'];
                    if (!empty($d['ueb'])) {
                        $participantes[$a]['ueb'] = $etd[2][0]->denominacion;
                        $u = $etd[0][0]->denominacion.'->'.$etd[2][0]->denominacion.'->'.$etd[1][0]->denominacion;
                        $participantes[$a]['entidad_area'] = $u;
                    } else {
                        $participantes[$a]['entidad_area'] = $etd[0][0]->denominacion.'->'.$etd[1][0]->denominacion;
                    }
                }
            }
            $resp->datos = $participantes;
            $resp->cantidad = $cantidad;
            return $resp;
        } catch (Exception $e) {
            return false;
        }
    }

    public function getAccionesByPersona($activo, $idpersona, $fdesde, $fhasta, $start, $limit)
    {
        try {
            $acciones = Array();
            $objap = new DatAccionparticipante();
            $acciones = $objap->getAccionesByPersona($activo, $idpersona, $fdesde, $fhasta, $start, $limit);
            $cantidad = $objap->cantAccionesByPersona($activo, $idpersona, $fdesde, $fhasta);
            $resp->datos = (count($acciones) > 0)?$acciones:Array();
            $resp->cantidad = $cantidad;
            return $resp;
        } catch (Exception $e) {
            return false;
        }
    }

    public function getAccionesNecByPersona($idpersona, $fdesde, $fhasta)
    {
        try {
            $result = Array();
            $objap = new DatAccionparticipante();
            $acciones = $objap->getAccionesNecByPersona($idpersona, $fdesde, $fhasta);
            $necesidades = DatNecesidad::getNecesidadesByPersona(1, $idpersona);
            foreach ($acciones as $p=>$acc) {
                $result[$p]['denominacion'] = $acc['denominacion'];
                $result[$p]['fdesde'] = $acc['fdesde'];
                $result[$p]['fhasta'] = $acc['fhasta'];
                $aseguramientos = '';
                foreach ($acc['DatAccionaseguramiento'] as $pa=>$aseg) {
                    if ($pa==0) {
                        $aseguramientos = $aseg['NomAseguramiento']['denominacion'];
                    } else {
                        $aseguramientos = $aseguramientos.', '.$aseg['NomAseguramiento']['denominacion'];
                    }
                }
                $result[$p]['aseguramientos'] = $aseguramientos;
                $necesper = Array();
                foreach ($acc['DatAccionnecesidad'] as $neces) {
                    foreach ($necesidades as $nper) {
                        if ($neces['idnecesidad'] == $nper['idnecesidad']) {
                           array_push($necesper, $nper['necesidad']);
                        }
                    }
                }
                $result[$p]['necesidades'] = $necesper;
            }
            return $result;
        } catch (Exception $e) {
            return false;
        }
    }

    public function addParticipante($idaccion, $idpersona)
    {
        try {
            $existe = DatAccionparticipante::existe($idaccion, $idpersona);
            if (count($existe) == 0) {
                $obj = new DatAccionparticipante();
                $obj->idaccion = $idaccion;
                $obj->idpersona = $idpersona;
                $obj->save();
                return true;
            } else {
                return false;
            }
        } catch (Exception $e) {
            return false;
        }
    }

    public function guardarResultado($idaccionparticipante, $observacion, $terminado, $resultado, $cursos)
    {
        try {
            $objpart = DatAccionparticipante::getById($idaccionparticipante);
            if (!empty($objpart)) {
                $objpart->observacion = (empty($observacion))?null:$observacion;
                $objpart->terminado = (empty($terminado))?0:$terminado;
                $objpart->resultado = (empty($resultado))?null:$resultado;
                $objpart->save();

                foreach ($cursos as $c) {
                    if (empty($c->idparticipantecurso)) {
                        $objpc = new DatParticipantecurso();
                        $objpc->idaccionparticipante = $idaccionparticipante;
                        $objpc->idaccioncurso = $c->idaccioncurso;
                        $objpc->resultado = $c->resultadocurso;
                        $objpc->save();
                    } else {
                        $objpc = DatParticipantecurso::getById($c->idparticipantecurso);
                        $objpc->resultado = $c->resultadocurso;
                        $objpc->save();
                    }
                }
                return true;
            }
        } catch (Exception $e) {
            return false;
        }
    }

    public function deleteParticipante($idaccionparticipante)
    {
        try {
            $obj = DatAccionparticipante::getById($idaccionparticipante);
            $obj->delete();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }

    public function getPersonasByIdcargoIdnecesidad($filtro, $idestructura, $necesidades, $inicio, $limite)
    {
        try {
            $obj = new DatAccionparticipante();
            $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, true);
            if (count($cargos) > 0) {
                foreach ($cargos as $h => $carg) {
                    $idcargos[$h] = $carg['idcargo'];
                }
                $datos = $obj->getPersonasByIdcargoIdnecesidad($filtro, $idcargos, $necesidades, $inicio, $limite);
                $cantidad = $obj->cantPersonasByIdcargoIdnecesidad($filtro, $idcargos, $necesidades);
            }

            if ($cantidad > 0) {
                $datos = DatAccionparticipanteModel::ordenarInfoByCargo($idcargos, $datos);
                foreach ($datos as $a => $d) {
                    $entidad = ZendExt_IoC::getInstance()->metadatos->DameEstructura($d['identidad']);
                    $datos[$a]['entidad'] = $entidad[0]->denominacion;
                    $area = ZendExt_IoC::getInstance()->metadatos->DameEstructura($d['idarea']);
                    $datos[$a]['area'] = $area[0]->denominacion;
                    $cargo = ZendExt_IoC::getInstance()->metadatos->obtenerDatosCargo($d['idcargo']);
                    $datos[$a]['cargo'] = $cargo[0]['denominacion'];
                    $datos[$a]['idcategoria']=$cargo[0]['idcategoria'];
                    $datos[$a]['categoria']=$cargo[0]['categoria'];
                    if (!empty($d['ueb'])) {
                        $ueb = ZendExt_IoC::getInstance()->metadatos->DameEstructura($d['ueb']);
                        $datos[$a]['ueb'] = $ueb[0]->denominacion;
                        $ea = $entidad[0]->denominacion .'->'.$ueb[0]->denominacion.'->'.$area[0]->denominacion;
                        $datos[$a]['entidad_area'] = $ea;
                    } else {
                        $datos[$a]['entidad_area'] = $entidad[0]->denominacion . '->' . $area[0]->denominacion;
                    }
                }
            }
            $result->datos = $datos;
            $result->cantidad = $cantidad;
            return $result;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function ordenarInfoByCargo(array $orden, array $datos)
    {
        $result = Array();
        $pos = count($datos);
        foreach ($orden as $val) {
            foreach ($datos as $obj) {
                if ($val == $obj['idcargo']) {
                    array_push($result, $obj);
                    $result[count($result)-1]['orden'] = $pos;
                    $pos--;
                }
            }
        }
        return $result;
    }

    private function compararFechas($primera, $segunda)
    {
        $valoresPrimera = explode("/", $primera);
        $valoresSegunda = explode("/", $segunda);
        $diaPrimera    = $valoresPrimera[0];
        $mesPrimera  = $valoresPrimera[1];
        $anyoPrimera   = $valoresPrimera[2];
        $diaSegunda   = $valoresSegunda[0];
        $mesSegunda = $valoresSegunda[1];
        $anyoSegunda  = $valoresSegunda[2];
        $diasPrimeraJuliano = gregoriantojd($mesPrimera, $diaPrimera, $anyoPrimera);
        $diasSegundaJuliano = gregoriantojd($mesSegunda, $diaSegunda, $anyoSegunda);
        if (!checkdate($mesPrimera, $diaPrimera, $anyoPrimera)) {
            // "La fecha ".$primera." no es v�lida";
            return 0;
        } else if (!checkdate($mesSegunda, $diaSegunda, $anyoSegunda)) {
            // "La fecha ".$segunda." no es v�lida";
            return 0;
        } else {
            return  $diasPrimeraJuliano - $diasSegundaJuliano;
        }
    }
}