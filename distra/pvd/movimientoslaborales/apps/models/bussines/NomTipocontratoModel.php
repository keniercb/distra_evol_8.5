<?php 
class NomTipocontratoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getActiveTiposContrato($identidad)
    {
        try {
            $obj = new NomTipocontrato();
            $datos = $obj->getActiveTiposContrato();
            foreach ($datos as $i => $val) {
                $plantilla = $obj->getPlantilla($val['idtipocontrato'], $identidad);
                $datos[$i]['idplantilla'] = ($plantilla[0]['idplantilla']);
                if (empty($val['descripcion'])) {
                    $datos[$i]['descripcion'] = 'Sin descripci&oacute;n';
                } else {
                    $datos[$i]['descripcion'] = $val['descripcion'];
                }
            }
            return $datos;
        } catch (Exception $e) {
            throw $e;
        }
    }

    //Función para obtener los tipos de contrato
    public function getTiposContrato($denom, $inicio, $limit)
    {
        try {
            $identidad = $this->global->Estructura->idestructura;
            $obj = new NomTipocontrato();
            $datos = $obj->getTiposContrato($denom, $inicio, $limit);
            if (count($datos)==0) {
                $datos = Array();
            } else {
                foreach ($datos as $i => $val) {
                    $plantilla = $obj->getPlantilla($val['idtipocontrato'], $identidad);
                    $datos[$i]['idplantilla'] = ($plantilla[0]['idplantilla']);
                    if ($val['determinado'] == 1) {
                        $datos[$i]['tipo'] = 'Determinado';
                    } else if ($val['determinado'] == 2){
                        $datos[$i]['tipo'] = 'Eventual';
                    } else {
                        $datos[$i]['tipo'] = 'Indeterminado';
                    }

                }
            }
            $resp->datos = $datos;
            $resp->cantidad = $obj->cantTiposContrato($denom);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    //Función para obtener las plantillas
    public function getPlantillasByIdTipoplantilla($idconfiguracion)
    {
        try {
            $identidad = $this->global->Estructura->idestructura;
            $obj = new NomTipocontrato();
            $datos = $obj->getPlantillasByIdTipoplantilla($identidad, $idconfiguracion);
            foreach ($datos as $r => $v) {
                $result[$r]['idplantilla'] = $v['idplantilla'];
                $result[$r]['id'] = 'p-'.$v['idplantilla'];
                $result[$r]['text'] = $v['plantilla'];
                $result[$r]['iconCls'] = 'plantilla';
                $result[$r]['leaf'] = true;
            }
            if (count($datos)==0) {
                $result = Array();
            }
            return $result;
        } catch (Exception $e) {
            throw $e;
        }
    }

    //Función para adicionar tipo de contrato
    public function addTipoContrato(
        $denominacion,
        $plantilla,
        $descripcion,
        $determinado,
        $idplantilla
    )
    {
        try {
            $plantilla = ($plantilla=='')?null:$plantilla;
            $obj = new NomTipocontrato();
            $obj->denominacion = $denominacion;
            $obj->plantilla = $plantilla;
            $obj->descripcion = $descripcion;
            $obj->determinado = $determinado;
            $obj->save();
            //Asociar plantilla
            if ($plantilla == 1 && !empty($idplantilla)) {
                $objPTC = new DatPlantillatipocontratoModel();
                $objPTC->add($idplantilla, $obj->idtipocontrato);
            }
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function updateTipoContrato(
        $idtipocontrato,
        $denominacion,
        $plantilla,
        $descripcion,
        $determinado,
        $idplantilla
    )
    {
        try {
            $obj = NomTipocontrato::getById($idtipocontrato);
            $denom = NomTipocontrato::existeDenom($denominacion);
            $c = count($denom);
            if ($c == 0 || $denom[0]['denominacion'] == $obj->denominacion) {
                $obj->denominacion = $denominacion;
                $obj->plantilla = $plantilla;
                $obj->descripcion = $descripcion;
                $obj->determinado = $determinado;
                $obj->save();
                //Asociar plantilla
                $objPlantContrato = new DatPlantillatipocontrato();
                $identidad = $this->global->Estructura->idestructura;
                if ($plantilla == 1 && !empty($idplantilla)) {
                    $teniacon = $objPlantContrato->getByTipocontratoEnt(
                        $idtipocontrato,
                        $identidad
                    );
                    if (count($teniacon) > 0) {
                        $objPlantContrato->eliminarByTipocontrato(
                            $idtipocontrato,
                            $identidad
                        );
                    }
                    $objPTC = new DatPlantillatipocontratoModel();
                    $objPTC->add($idplantilla, $idtipocontrato);
                } else {
                    $objPlantContrato->eliminarByTipocontrato(
                        $idtipocontrato,
                        $identidad
                    );
                }
                return true;
            } else {
                return false;
            }
        } catch (Exception $e) {
            return false;
        }
    }

    public function deleteTipoContrato($idtipocontrato)
    {
        try {
            $obj = NomTipocontrato::getById($idtipocontrato);
            $obj->delete();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }

    public function existeDenom($denominacion)
    {
        return NomTipocontrato::existeDenom($denominacion);
    }

}