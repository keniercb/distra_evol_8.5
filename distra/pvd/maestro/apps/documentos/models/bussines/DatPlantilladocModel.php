<?php
class DatPlantilladocModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    //Función para obtener los tipos de documentos
    public function getDocumentos($denom, $fdesde, $fhasta, $inicio, $limit)
    {
        try {
            $identidad = $this->global->Estructura->idestructura;
            $obj = new DatPlantilladoc();
            $resp->data = $obj->getDocAll($denom, $fdesde, $fhasta, $identidad, $inicio, $limit);
            foreach ($resp->data as $k => $val) {
                $resp->data[$k]['entidad'] = $this->global->Estructura->denominacion;
                $conf = $obj->getConfigAsigByIdplantilla($val['idplantilladoc']);
                $resp->data[$k]['tipos'] = $this->mostrarDenom($conf);
                $confrec = $obj->getConfiguracionesPorPlantilla($val['idplantilladoc']);
                $resp->data[$k]['configuraciones'] = $this->mostrarDenomConfigrec($confrec);
            }
            $resp->cantidad = $obj->cantDocAll($denom, $fdesde, $fhasta, $identidad);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    private function mostrarDenom($arrayConfAsig)
    {
        $arrayDenom = '';
        foreach ($arrayConfAsig as $k => $val) {
            if ($k > 0 ) {
                $arrayDenom .= ', ';
            }
            if ($val['id'] == 101) {
                $arrayDenom .= 'Ficha de la persona(P)';
            } else if ($val['id'] == 201) {
                $arrayDenom .= 'Ficha de la persona(FT)';
            } else if ($val['id'] == 202) {
                $arrayDenom .= 'Contratos(FT)';
            } else if ($val['id'] == 203) {
                $arrayDenom .= 'Suplementos(FT)';
            }
        }
        return $arrayDenom;
    }

    private function mostrarDenomConfigrec($arrayConfAsig)
    {
        $arrayDenom = '';
        foreach ($arrayConfAsig as $k => $val) {
            if ($k > 0) {
                $arrayDenom .= ', ';
            }
            $arrayDenom .= $val['denominacion'];
        }
        return $arrayDenom;
    }

    //Función para adicionar documento
    public function addDocumento($denominacion, $fdesde, $fhasta, $descripcion, $idconfig, $tipoplantconfig)
    {
        try {
            $obj = new DatPlantilladoc();
            $obj->denominacion = $denominacion;
            $obj->fdesde = $fdesde;
            $obj->fhasta = $fhasta;
            $obj->descripcion = $descripcion;
            $obj->identidad = $this->global->Estructura->idestructura;
            $obj->save();
            if (count($idconfig) > 0) {
                ConfPlantilladocrecModel::addConfigPlantillaRec($idconfig, $obj->idplantilladoc);
            }
            if (count($tipoplantconfig) > 0) {
                $this->guardarConfAsig($tipoplantconfig, $obj->idplantilladoc, $obj->identidad);
            }
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    //Función para modificar documento
    public function updateDoc($idplantilla, $denominacion, $fdesde, $fhasta, $descripcion, $idconfig, $tipoplantconfig)
    {
        try {
            $obj = DatPlantilladoc::getById($idplantilla);
            $denom = DatPlantilladoc::existeDenom($denominacion, $obj->identidad);
            if (count($denom) == 0 || $denom[0]['denominacion'] == $obj->denominacion) {
                $obj->denominacion = $denominacion;
                $obj->fdesde = $fdesde;
                if ($fhasta) {
                    $obj->fhasta = $fhasta;
                }
                $obj->descripcion = $descripcion;
                $obj->save();
                ConfPlantilladocrecModel::addConfigPlantillaRec($idconfig, $obj->idplantilladoc);
                $this->guardarConfAsig($tipoplantconfig, $idplantilla, $obj->identidad);
                return true;
            } else {
                return false;
            }
        } catch (Exception $e) {
            return false;
        }
    }

    //Función para modificar el contenido del documento
    public function updateContenido($idplantilladoc, $contenido)
    {
        try {
            $obj = DatPlantilladoc::getById($idplantilladoc);
            $obj->contenido = $contenido;
            $obj->save();
            $r->succes = true;
            $r->codMsg = 1;
            $r->mensaje = 'El contenido ha sido guardado satisfactoriamente.';
        } catch (Exception $e) {
            $r->succes = true;
            $r->codMsg = 3;
            $r->mensaje = 'Ha ocurrido un error mientras se guardaba el contenido.';
        }
        return $r;
    }

    //Función para eliminar documento
    public function deleteDoc($idplantilladoc)
    {
        try {
            $obj = DatPlantilladoc::getById($idplantilladoc);
            $obj->delete();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }

    //Función para obtener el contenido de un documento
    public function  getContenidoByIdPlantilla($idplantilla, $idpersona)
    {
        $data = DatPlantilladoc::getContenidoByIdPlantilla($idplantilla);
        if (!empty($idpersona)) {
            $data['contenido'] = ConceptosModel::getDatosOtrosConceptos($data['contenido'], $idpersona);
        }
        return $data;
    }

    public function existeDenom($denominacion)
    {
        $identidad = $this->global->Estructura->idestructura;
        return DatPlantilladoc::existeDenom($denominacion, $identidad);
    }

    public function getConceptos($idconfiguracion, $idcampo)
    {
        $campos = ZendExt_IoC::getInstance()->reccomplejas->getFieldsForTree($idconfiguracion, $idcampo);
        $concepts = array();
        foreach ($campos as $i => $campo) {
            $concepts[$i] = $campo;
            $concepts[$i]['expanded'] = true;
            if ($campo['alias'] == 'foto') {
                $concepts[$i]['type'] = 'photo';
                $concepts[$i]['iconCls'] = 'photo';
            } else if ($campo['leaf']) {
                $concepts[$i]['type'] = 'data';
                $concepts[$i]['iconCls'] = 'font';
            }
        }
        return $concepts;
    }

    public function getConfiguraciones()
    {
        try {
            $resp->data = DatPlantilladoc::getConfiguraciones();
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function replicarEstructura($idplantilladoc, $entidades, $ent)
    {
         try {
            $configuracionesRecComP = ConfPlantilladocrecModel::getConfiguracionesByIdPlantilla($idplantilladoc);
            $configRecComp = Array();
            foreach ($configuracionesRecComP as $recup) {
                array_push($configRecComp, $recup['idconfiguracion']);
            }
            $configuracionesAsig = DatPlantilladocModel::getConfigAsigByIdplantilla($idplantilladoc);
            $configAsigFun = Array();
            foreach ($configuracionesAsig as $fun) {
                array_push($configAsigFun, $fun['id']);
            }

            if (count($entidades) > 0) {
                $rec = DatPlantilladoc::getById($idplantilladoc);
                foreach ($entidades as $i => $val) {
                    $entidad = ZendExt_IoC::getInstance()->metadatos->DameEstructura($val);
                    $obj = new DatPlantilladoc();
                    $obj->denominacion = $rec->denominacion . '('. $entidad[0]->denominacion . ')';
                    $obj->descripcion = $rec->descripcion . '(Replicada por '. $ent . ')';
                    $obj->fdesde = $rec->fdesde;
                    $obj->fhasta = $rec->fhasta;
                    $obj->contenido = $rec->contenido;
                    $obj->identidad = $val;
                    $obj->save();
                    if (count($configRecComp) > 0) {
                        ConfPlantilladocrecModel::addConfigPlantillaRec($configRecComp, $obj->idplantilladoc);
                    }
                    if (count($configAsigFun) > 0) {
                        $this->guardarConfAsig($configAsigFun, $obj->idplantilladoc, $obj->identidad);
                    }
                }
            }
            return 'success';
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function guardarConfAsig($arrayidconfig, $idplantilla, $identidad)
    {
        ConfPlantillafuncionalidad::deleteConfAll($identidad, $idplantilla);
        foreach ($arrayidconfig as $idconfig) {
            if($idconfig == 101 || $idconfig == 201 ){
                ConfPlantillafuncionalidad::deleteConf($idconfig, $identidad);
            }
            $obj = new ConfPlantillafuncionalidad();
            $obj->idconfiguracion = $idconfig;
            $obj->idplantilla = $idplantilla;
            $obj->save();
        }
    }

    public function getConfigAsigByIdplantilla($idplantilladoc)
    {
        try {
            $resp = DatPlantilladoc::getConfigAsigByIdplantilla($idplantilladoc);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }
}
