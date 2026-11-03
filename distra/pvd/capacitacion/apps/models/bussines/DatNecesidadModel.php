<?php 
class DatNecesidadModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getNecesidades($activo, $idpersona, $limit = null, $start = 0)
    {
        try {
            $obj = new DatNecesidad();
            $datos = $obj->getNecesidadesByPersona($activo, $idpersona, $limit, $start);
            if (count($datos)==0) {
                $datos = Array();
            }
            $resp->datos = $datos;
            $resp->cantidad = $obj->getCantNecesidadesByPersona($activo, $idpersona);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addNecesidad($idpersona, $idnecesidad, $descripcion, $fhasta, $idmodoformacion)
    {
        try {
            $existe = DatNecesidad::existeNec($idpersona, $idnecesidad);
            if (count($existe) == 0) {
                $obj = new DatNecesidad();
                $obj->idpersona = $idpersona;
                $obj->idnecesidad = $idnecesidad;
                $obj->descripcion = $descripcion;
                $obj->fhasta = $fhasta;
                $obj->idmodoformacion = $idmodoformacion;
                $obj->save();
                return true;
            } else {
                return false;
            }
        } catch (Exception $e) {
            return false;
        }
    }

    public function updateNecesidad($iddnecesidad, $idpersona, $idnecesidad, $descripcion, $fhasta, $idmodoformacion)
    {
        try {
            $obj = DatNecesidad::getById($iddnecesidad);
            $existe = DatNecesidad::existeNec($idpersona, $idnecesidad);
            if (count($existe) == 0 || $existe[0]['iddnecesidad'] == $iddnecesidad) {
                $obj->idnecesidad = $idnecesidad;
                $obj->descripcion = $descripcion;
                $obj->fhasta = $fhasta;
                $obj->idmodoformacion = $idmodoformacion;
                $obj->save();
                return true;
            } else {
                return false;
            }
        } catch (Exception $e) {
            return false;
        }
    }

    public function updateNecesidadVencida($iddnecesidad, $fhasta)
    {
        try {
            $obj = DatNecesidad::getById($iddnecesidad);
            $obj->fhasta = $fhasta;
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function deleteNecesidad($iddnecesidad)
    {
        try {
            $obj = DatNecesidad::getById($iddnecesidad);
            $obj->delete();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }

    public function getPersonasActivas($filtro, $inicio, $limite, $reciengraduado)
    {
        try {
            $obj = new DatNecesidad();
            $datos = $obj->getPersonasActivas($filtro, $inicio, $limite, $reciengraduado);
            $cantidad = $obj->cantPersonasActivas($filtro, $reciengraduado);
            foreach ($datos as $k => $sit) {
                $estructurasdatos = ZendExt_IoC::getInstance()->metadatos->ObtenerDatosEstructuraPorArrayID(
                    array($sit['identidad'], $sit['idarea'], $sit['idcargo'])
                );
                $datos[$k]['cargo'] = $estructurasdatos[3][0]->denominacion;
                $datos[$k]['orden'] = $sit['orden'];
                if ($estructurasdatos[0][0]->denominacion == '') {
                    $datos[$k]['entidad_area'] = '';
                } else {
                    $ea = $estructurasdatos[0][0]->denominacion . '->' . $estructurasdatos[1][0]->denominacion;
                    $datos[$k]['entidad_area'] = $ea;
                }
                $d = $datos[$k]['entidad_area'];
                $datos[$k]['entidad_area'] = (empty($d))?'No asignado a cargo':$d;
            }
            if ($cantidad == 0) {
                $datos = Array();
            }
            $result->datos = $datos;
            $result->cantidad = $cantidad;
            return $result;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getNecesidadesByEstructura($idestructura)
    {
        try {
            $resultado = Array();
            $idscargosGeneral = Array();
            $estructuras = ZendExt_IoC_Inter::getInstance()->movimientoslaborales->obtenerIdsConfig($idestructura);
            foreach ($estructuras[1] as $p => $est) {
                $idscargos = Array();
                $resultado[$p]['idestructura'] = $est[0]->idestructura;
                $resultado[$p]['estructura'] = $est[0]->denominacion;
                $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($est[0]->idestructura, true);
                if (count($cargos) > 0) {
                    foreach ($cargos as $carg) {
                        if (!in_array($carg['idcargo'], $idscargosGeneral)) {
                            array_push($idscargos, $carg['idcargo']);
                            array_push($idscargosGeneral, $carg['idcargo']);
                        }
                    }
                    $obj = new DatNecesidad();
                    $personassl = $obj->getSituacionByIdCargo($idscargos);
                    $idspersonas = Array();
                    foreach ($personassl as $per) {
                        array_push($idspersonas, $per['idpersona']);
                    }
                    $necesidades = $obj->getNecesidadesByArrayPersona($idspersonas);
                    $posper = 0;
                    foreach ($personassl as $pers) {
                        $posnec = 0;
                        $resultado[$p]['personas'][$posper]['nombre'] = $pers['nombreyapellidosorden'];
                        $posper++;
                        foreach ($necesidades as $n) {
                            if ($n['idpersona'] == $pers['idpersona']) {
                                $resultado[$p]['personas'][$posper-1]['necesidades'][$posnec] = $n;
                                $posnec++;
                            }
                        }
                        if ($posnec == 0) {
                            unset($resultado[$p]['personas'][$posper-1]);
                            $resultado[$p]['personas'] = array_values($resultado[$p]['personas']);
                            $posper--;
                        }
                    }
                }
            }
            return $resultado;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getNecesidadesGrafica($idestructura)
    {
        try {
            $series = Array();
            $categorias = Array();
            $idscargosGeneral = Array();
            $estructuras = ZendExt_IoC_Inter::getInstance()->movimientoslaborales->obtenerIdsConfig($idestructura);
            $identidad = $this->global->Estructura->idestructura;
            $necesidadesGen = NomNecesidaddecapacitacion::getNecesidadesActivos(1, $identidad);
            foreach ($estructuras[1] as $est) {
                $idscargos = Array();
                $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($est[0]->idestructura, true);
                if (count($cargos) > 0) {
                    foreach ($cargos as $carg) {
                        if (!in_array($carg['idcargo'], $idscargosGeneral)) {
                            array_push($idscargos, $carg['idcargo']);
                            array_push($idscargosGeneral, $carg['idcargo']);
                        }
                    }
                    $obj = new DatNecesidad();
                    $personassl = $obj->getSituacionByIdCargo($idscargos);
                    $idspersonas = Array();
                    foreach ($personassl as $per) {
                        array_push($idspersonas, $per['idpersona']);
                    }
                    foreach ($necesidadesGen as $f => $nec) {
                        $necesidadesGen[$f]['cant'] = 0;
                    }
                    $necesidades = $obj->getNecesidadesByArrayPersona($idspersonas);
                    $cantnecesidadesGen = Array();
                    foreach ($necesidadesGen as $f => $nec) {
                        foreach ($necesidades as $necint) {
                            if ($nec['idnecesidad'] == $necint['idnecesidad']) {
                                $necesidadesGen[$f]['cant'] += 1;
                            }
                        }
                    }
                    foreach ($necesidadesGen as $a => $nec) {
                        $cantnecesidadesGen[$a] = $nec['cant'];
                        if (!in_array($nec['necesidad'], $categorias)) {
                            array_push($categorias, $nec['necesidad']);
                        }
                    }
                    $serie = array(
                        'name' => (empty($est[0]->abreviatura))?$est[0]->denominacion:$est[0]->abreviatura,
                        'data' => $cantnecesidadesGen
                    );
                    array_push($series, $serie);
                }
            }
            $resultado->series = $series;
            $resultado->categorias = $categorias;
            return $resultado;
        } catch (Exception $e) {
            throw $e;
        }
    }
}