<?php

class DatPersonaentidadModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }
    
    public function addPersonaEnt($idpersona, $idprocedenciasocial, $identidad, $fdesde, $fhasta)
    {
        try {
            $objPersEntidad = new DatPersonaentidad();
            $idpersonaentidad = null;
            $pe = $objPersEntidad->getByIdPersona($idpersona, $identidad);
            if (count($pe) == 0) {
                $objpe = new DatPersonaentidad();
                $objpe->idpersona = $idpersona;
                $objpe->idprocedenciasocial = (empty($idprocedenciasocial)) ? null : $idprocedenciasocial;
                $objpe->identidad = $identidad;
                $objpe->fdesde = $fdesde;
                $objpe->fhasta = (empty($fhasta))? null : $fhasta;
                $objpe->save();
                $idpersonaentidad = $objpe->idpersonaentidad;
            } else {
                $idpersonaentidad = $pe[0]['idpersonaentidad'];
                if ($pe[0]['fhasta'] != null) {
                    if (
                        $fhasta == '' ||
                        DatSituacionlaboralModel::compararFechas($fhasta, $pe[0]['fhasta']) == 1
                    ) {
                        $objpeviejo = $objPersEntidad->getById($pe[0]['idpersonaentidad']);
                        $objpeviejo->fhasta = (empty($fhasta))? null : $fhasta;
                        $objpeviejo->save();
                    }
                }
            }
            return $idpersonaentidad;
        } catch (Exception $e) {
            return false;
        }       
    }

    public function getExistenciaFT($idestructura)
    {
        try {
            $idcargos = Array();
            $obj = new DatPersonaentidad();
            if (!empty($idestructura)) {
                $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, true);
                if (count($cargos) > 0) {
                    $idcargos = DatSituacionlaboralModel::getIdCargos($cargos);
                }
            }
            $datos = $obj->getExistenciaFTByIdCargo($idcargos);
            $pos = 0;
            $posexist = 0;
            $result = Array();
            foreach ($datos as $d => $val) {                
                if ($d == 0 || $val['reup'] != $datos[$d-1]['reup']) {
                    $result[$pos]['reup'] = $val['reup'];
                    $pos++;
                }
                $result[$pos-1]['existencia'][$posexist]['numid'] = $val['numid'];
                $result[$pos-1]['existencia'][$posexist]['nombre'] = $val['nombre'];
                $result[$pos-1]['existencia'][$posexist]['snombre'] = $val['snombre'];
                $result[$pos-1]['existencia'][$posexist]['papel'] = $val['papel'];
                $result[$pos-1]['existencia'][$posexist]['sapel'] = $val['papel'];
                $result[$pos-1]['existencia'][$posexist]['sexo'] = $val['sexo'];
                $result[$pos-1]['existencia'][$posexist]['idsuin'] = $val['idsuin'];
                $result[$pos-1]['existencia'][$posexist]['identidad'] = $val['identidad'];
                $result[$pos-1]['existencia'][$posexist]['idprocedencia'] = $val['idprocedencia'];
                $result[$pos-1]['existencia'][$posexist]['falta'] = $val['falta'];
                $result[$pos-1]['existencia'][$posexist]['fbaja'] = $val['fbaja'];
                $result[$pos-1]['existencia'][$posexist]['idespcargo'] = $val['idespcargo'];
                $result[$pos-1]['existencia'][$posexist]['noalta'] = $val['noalta'];
                $result[$pos-1]['existencia'][$posexist]['idarea'] = $val['idarea'];
                $result[$pos-1]['existencia'][$posexist]['ueb'] = $val['ueb'];
                $result[$pos-1]['existencia'][$posexist]['denomueb'] = $val['denomueb'];
                $result[$pos-1]['existencia'][$posexist]['principal'] = $val['principal'];
                $result[$pos-1]['existencia'][$posexist]['idtipocontrato'] = $val['idtipocontrato'];
                $result[$pos-1]['existencia'][$posexist]['fdesde'] = $val['fdesde'];
                $result[$pos-1]['existencia'][$posexist]['fhasta'] = $val['fhasta'];
                $result[$pos-1]['existencia'][$posexist]['idsituacion'] = $val['idsituacion'];
                $result[$pos-1]['existencia'][$posexist]['idnomcargo'] = $val['idnomcargo'];
                $result[$pos-1]['existencia'][$posexist]['idcargo'] = $val['idcargo'];
                $result[$pos-1]['existencia'][$posexist]['idmotivo'] = $val['idmotivo'];
                $result[$pos-1]['existencia'][$posexist]['estado'] = $val['estado'];
                $result[$pos-1]['existencia'][$posexist]['idmodalidadempleo'] = $val['idmodalidadempleo'];
                $result[$pos-1]['existencia'][$posexist]['nromn'] = $val['nromn'];
                $posexist++;
            }

            return $result;
        } catch (Exception $e) {
            throw $e;
        }
    }
//add persona para importar la existencia
    public function addpersona($numid, $sexo, $nombre, $snombre, $papel, $sapel, $idsuin)
    {
        $existe = DatPersonaentidad::buscarPersona($numid, $idsuin);
        if (count($existe) == 0) {
            $idpersona = DatPersonaentidad::addPersona($nombre, $snombre, $papel, $sapel, $sexo, $idsuin);
            DatPersonaentidad::addCIPersona($idpersona, $numid);
            $result = array('idpersona' => $idpersona, 'mensaje' => 'OK', 'accion' => 1);
            return $result;
        } else {
            $result = array('idpersona' => $existe[0]['idpersona'], 'mensaje' => 'OK', 'accion' => 2);
            return $result;
        }
    }
}
