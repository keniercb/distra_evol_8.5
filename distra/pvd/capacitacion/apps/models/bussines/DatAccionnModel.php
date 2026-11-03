<?php 
class DatAccionnModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getAcciones($idestructura, $filtro, $desde, $hasta, $start = 0, $limit = null)
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
            $obj = new DatAccionn();
            $datos = $obj->getAcciones($estructuras, $filtro, $desde, $hasta, $start, $limit);
            if (count($datos)==0) {
                $datos = Array();
            } else {
                $now = date('d/m/Y');
                foreach ($datos as $p=>$acc) {
                    $datos[$p]['idscategorias'] = DatAccioncategoria::getIdCategoriasByAccion($acc['idaccion']);
                    $datos[$p]['necesidades'] = DatAccionnecesidadModel::getDenomNecesidadesByAccion($acc['idaccion']);
                    $estructura = ZendExt_IoC::getInstance()->metadatos->DameEstructura($acc['idestructura']);
                    $datos[$p]['estructura'] = $estructura[0]->denominacion;
                    foreach ($datos[$p]['idscategorias'] as $pc=>$cat) {
                        $categ =  ZendExt_IoC::getInstance()->metadatos->dameCategoriaOcupacional(
                            true, $cat['idcategoria']
                        );
                        $datos[$p]['categorias'][$pc] = $categ[0]['denominacion'];
                    }
                    if ($acc['frdesde'] == null && $this->compararFechas($acc['fdesde'], $now) > 0) {
                        $datos[$p]['estado'] = 1;//No iniciada
                    } else if (($now == $acc['frdesde'] || $this->compararFechas($now, $acc['frdesde']) > 0) && ($this->compararFechas($now, $acc['frhasta'])> 0)|| $now == $acc['frhasta']) {
                        $datos[$p]['estado'] = 2;//Terminada
                    } else if ($now == $acc['frdesde'] || ($this->compararFechas($now, $acc['frdesde'])> 0) && $this->compararFechas($acc['fhasta'], $now)> 0 && $acc['frhasta'] == null) {
                        $datos[$p]['estado'] = 3;//Iniciada
                    } else if ($acc['frhasta'] == null && ($this->compararFechas($now, $acc['fhasta']) > 0 || $now == $acc['fhasta'])) {
                        $datos[$p]['estado'] = 4;//Atrasada por no terminar
                    } else if ($acc['frdesde'] == null && ($this->compararFechas($now, $acc['fdesde']) > 0 || $now == $acc['fdesde'])) {
                        $datos[$p]['estado'] = 4;//Atrasada por no iniciar
                    }
                    if ($datos[$p]['estado'] == 2) {
                        //Buscar si tiene cursos atrasados o sin terminar
                        $existen = $this->existenCursosSinTerminarAtrazados($acc['idaccion']);
                        $datos[$p]['estado'] = ($existen == 1)?4:$datos[$p]['estado'];
                    }
                }
            }
            $resp->datos = $datos;
            $resp->cantidad = $obj->cantAcciones($estructuras, $filtro, $desde, $hasta);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function compararFechas($primera, $segunda)
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
            return 'invalid';
        }else if (!checkdate($mesSegunda, $diaSegunda, $anyoSegunda)){
            // "La fecha ".$segunda." no es v�lida";
            return 'invalid';
        } else {
            return  $diasPrimeraJuliano - $diasSegundaJuliano;
        }
    }

    private function existenCursosSinTerminarAtrazados($idaccion)
    {
        $cursos = DatAccioncursoModel::getAccionesCursos($idaccion);
        $existen = 2;
        foreach ($cursos->datos as $val) {
            if ($val['estado'] != 2) {
                $existen = 1;
            }
        }
        return $existen;
    }

    public function addAccion(
        $denominacion, $idmodoformacion, $fdesde, $fhasta, $duracion, $lugar,
        $idestructura, $arrayCategoria, $curso, $necesidades
    )
    {
        try {
            $existe = $existe = DatAccionn::existe($denominacion);
            if (count($existe) == 0) {
                $obj = new DatAccionn();
                $obj->denominacion = $denominacion;
                $obj->idmodoformacion = $idmodoformacion;
                $obj->fdesde = $fdesde;
                $obj->fhasta = $fhasta;
                $obj->frdesde = $fdesde;
                $obj->frhasta = $fhasta;
                $obj->duracion = (empty($duracion))?null:$duracion;
                $obj->lugar = (empty($lugar))?null:$lugar;
                $obj->idestructura = $idestructura;
                $obj->curso = (empty($curso))?null:$curso;
                $obj->save();
                if ($arrayCategoria[0]) {
                    DatAccioncategoriaModel::addCategoria($obj->idaccion, $arrayCategoria);
                }
                if (count($necesidades)>0) {
                    DatAccionnecesidadModel::addAccionNecesidad($obj->idaccion, $necesidades);
                }
                return true;
            } else {
                return false;
            }
        } catch (Exception $e) {
            return false;
        }
    }

    public function updateAccion(
        $idaccion, $denominacion, $idmodoformacion, $fdesde, $fhasta, $duracion,
        $lugar, $arrayCategoria, $curso, $necesidades
    )
    {
        try {
            $obj = DatAccionn::getById($idaccion);
            $existe = DatAccionn::existe($denominacion);
            if (count($existe) == 0 || $existe[0]['idaccion'] == $idaccion) {
                $obj->denominacion = $denominacion;
                $obj->idmodoformacion = $idmodoformacion;
                $obj->fdesde = $fdesde;
                $obj->fhasta = $fhasta;
                $obj->frdesde = $fdesde;
                $obj->frhasta = $fhasta;
                $obj->duracion = (empty($duracion))?null:$duracion;
                $obj->lugar = (empty($lugar))?null:$lugar;
                $obj->curso = (empty($curso))?0:$curso;
                $obj->save();
                if (count($arrayCategoria)>0) {
                    DatAccioncategoria::eliminarByAccion($idaccion);
                    DatAccioncategoriaModel::addCategoria($obj->idaccion, $arrayCategoria);
                }
                if (count($necesidades)>0) {
                    DatAccionnecesidad::eliminarByAccion($idaccion);
                    DatAccionnecesidadModel::addAccionNecesidad($obj->idaccion, $necesidades);
                }
                return true;
            } else {
                return false;
            }
        } catch (Exception $e) {
            return false;
        }
    }

    public function ejecutarAccion($idaccion, $frdesde, $frhasta, $observacion)
    {
        try {
            $obj = DatAccionn::getById($idaccion);
                $obj->frdesde = (empty($frdesde))?null:$frdesde;
                $obj->frhasta = (empty($frhasta))?null:$frhasta;
                $obj->observacion = (empty($observacion))?null:$observacion;
                $obj->save();
                return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function deleteAccion($idaccion)
    {
        try {
            $obj = DatAccionn::getById($idaccion);
            $obj->delete();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }

    public function getAccionesPlan($idestructura, $desde, $hasta)
    {
        $hijosest =  ZendExt_IoC::getInstance()->metadatos->DameHijosInternas($idestructura);
        $estructuras = array($idestructura);
        foreach ($hijosest as $est) {
            array_push($estructuras, $est->id);
        }
        $entidades = ZendExt_IoC::getInstance()->metadatos->BuscarEntidadbyDominio($idestructura);
        foreach ($entidades as $e) {
            array_push($estructuras, $e->idfila);
        }
        $datos = DatAccionn::getAccionesCursosByFechaEstructura($estructuras, $desde, $hasta);
        if (count($datos) > 0) {
            foreach ($datos as $p => $accion) {
                $estructura = ZendExt_IoC::getInstance()->metadatos->DameEstructura($accion['idestructura']);
                $datos[$p]['estructura'] = $estructura[0]->denominacion;
                /*foreach ($accion['DatAccioncurso'] as $pc => $curso) {
                    $datos[$p]['DatAccioncurso'][$pc]['curso'] = $curso['NomCurso']['denominacion'];
                }*/
                $participantes = DatAccionparticipanteModel::getAccionesParticipantes($accion['idaccion']);
                $datos[$p]['participantes'] = $participantes->datos;
            }
        } else {
            $datos = Array();
        }
        return $datos;
    }
}