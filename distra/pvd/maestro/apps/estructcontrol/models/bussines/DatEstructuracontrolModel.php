<?php
class DatEstructuracontrolModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getEstructurascontrol()
    {
        $identidadentrada = $_SESSION['Zeolides']['entidad']->idestructura;
        $estructuras = array($identidadentrada);
        $estructurasInternas = ZendExt_IoC::getInstance()->metadatos->DameHijosInternas($identidadentrada);
        foreach ($estructurasInternas as $k => $val) {
            array_push($estructuras, $val->id);
        }
        $entidades = ZendExt_IoC::getInstance()->metadatos->BuscarEntidadbyDominio($identidadentrada);
        foreach ($entidades as $e) {
            array_push($estructuras, $e->idfila);
        }
        $datos = DatEstructuracontrol::getEstructurascontrolAll($estructuras, $identidadentrada);
        foreach ($datos as $d=>$v) {
            $estructura = ZendExt_IoC::getInstance()->metadatos->DameEstructura($v['DatDominioestructuracontrol'][0]['idestructura']);
            $entidad = ZendExt_IoC::getInstance()->metadatos->DameEstructura($v['identidad']);
            $datos[$d]['estructura'] = $estructura[0]->denominacion;
            $datos[$d]['entidad'] = 'Creado por: '.$entidad[0]->denominacion;
            $datos[$d]['idestructura'] = $v['DatDominioestructuracontrol'][0]['idestructura'];
            foreach ($v['DatDominioestructuracontrol'] as $t=>$dominio) {
                if ($t > 0) {
                    $datos[$d]['dominio'] .= ', ';
                    $datos[$d]['iddominios'] .= ',';
                }
                $datos[$d]['dominio'] .= $dominio['NomDominio']['denominacion'];
                $datos[$d]['iddominios'] .= $dominio['iddominio'];
            }
        }
        return $datos;
    }

    public function addEstructuracontrol($denominacion, $idestructura, $dominios, $plantilla)
    {
        try {
            $objEstControl = new DatEstructuracontrol();
            $objEstControl->denominacion = $denominacion;
            $objEstControl->identidad = $_SESSION['Zeolides']['entidad']->idestructura;
            $objEstControl->save();
            foreach ($dominios as $v) {
                $objDomEstControl = new DatDominioestructuracontrol();
                $objDomEstControl->iddominio = $v;
                $objDomEstControl->idestructuracontrol = $objEstControl->idestructuracontrol;
                $objDomEstControl->idestructura = $idestructura;
                $objDomEstControl->save();
            }
            if (!empty($plantilla)) {
                $configuracion = DatControlador::getControladorByIdestructuracontrol($plantilla);
                foreach ($configuracion as $conf) {
                    $objcont = new DatControlador();
                    $objcont->idestructuracontrol = $objEstControl->idestructuracontrol;
                    $objcont->idcargo = $conf['idcargo'];
                    $objcont->idpersona = $conf['idpersona'];
                    $objcont->save();
                    foreach ($conf['DatControlado'] as $cont) {
                        $objcontdo = new DatControlado();
                        $objcontdo->idcontrolador = $objcont->idcontrolador;
                        $objcontdo->idcargo = $cont['idcargo'];
                        $objcontdo->save();
                    }
                    foreach ($conf['DatMovimientos'] as $mov) {
                        $objmov = new DatMovimientos();
                        $objmov->idcontrolador = $objcont->idcontrolador;
                        $objmov->idpersona = $mov['idpersona'];
                        $objmov->accion = $mov['accion'];
                        $objmov->save();
                    }
                }
            }
            return true;
        } catch(Exception $e) {
            return false;
        }
    }

    public function updateEstructuracontrol($idestructuracontrol, $denominacion, $idestructura, $dominios, $plantilla)
    {
        try {
            $objEstControl = DatEstructuracontrol::getById($idestructuracontrol);
            $objEstControl->denominacion = $denominacion;
            $objEstControl->save();
            DatDominioestructuracontrol::deleteByEstControl($idestructuracontrol);
            foreach ($dominios as $v) {
                $objDomEstControl = new DatDominioestructuracontrol();
                $objDomEstControl->iddominio = $v;
                $objDomEstControl->idestructuracontrol = $objEstControl->idestructuracontrol;
                $objDomEstControl->idestructura = $idestructura;
                $objDomEstControl->save();
            }
            if (!empty($plantilla)) {
                DatControlador::deleteControladorByEstControl($idestructuracontrol);
                //Adicionar toda la configuracion de la estructura de control que desea usar como plantilla.
                $configuracion = DatControlador::getControladorByIdestructuracontrol($plantilla);
                foreach ($configuracion as $conf) {
                    $objcont = new DatControlador();
                    $objcont->idestructuracontrol = $idestructuracontrol;
                    $objcont->idcargo = $conf['idcargo'];
                    $objcont->idpersona = $conf['idpersona'];
                    $objcont->save();
                    foreach ($conf['DatControlado'] as $cont) {
                        $objcontdo = new DatControlado();
                        $objcontdo->idcontrolador = $objcont->idcontrolador;
                        $objcontdo->idcargo = $cont['idcargo'];
                        $objcontdo->save();
                    }
                    foreach ($conf['DatMovimientos'] as $mov) {
                        $objmov = new DatMovimientos();
                        $objmov->idcontrolador = $objcont->idcontrolador;
                        $objmov->idpersona = $mov['idpersona'];
                        $objmov->accion = $mov['accion'];
                        $objmov->save();
                    }
                }
            }
            return true;
        } catch(Exception $e) {
            return false;
        }
    }

    public function deleteEstructuracontrol($ids)
    {
        try{
            foreach ($ids as $v) {
                $objEstControl = DatEstructuracontrol::getById($v);
                $objEstControl->delete();
            }
            return true;
        } catch(Exception $e){
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }

    function getPersonasporcargo($idnode,$idn)
    {
        $DEC = new DatEstructuracontrol();
        if ($idnode != null) {
            if ($idn[0] == 's') {
                $arrayCargos = DatControlado::getControladoByIdcontrolador($idnode);
            }
            $cargos = array();
            if (count($arrayCargos) > 0) {
                foreach ($arrayCargos as $c) {
                    if (!empty($c['idcargo'])) {
                        array_push($cargos, $c['idcargo']);
                    } else {
                        $cargosarea = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura(
                            $c['idarea'],
                            true
                        );
                        if (count($cargosarea) > 0) {
                            foreach ($cargosarea as $carg) {
                                if (!in_array($carg['idcargo'], $cargos)) {
                                    array_push($cargos, $carg['idcargo']);
                                }
                            }
                        }
                    }
                }
                if (count($cargos) > 0) {
                    $personas = $DEC->GetPersonas($cargos,array());
                }
                $personasdelete = DatMovimientos::getMovimientosByIdcontrolador($idnode, 0);
            }
            $personasadd = DatMovimientos::getMovimientosByIdcontrolador($idnode, 1);

            $persid = array();
            $pernocargsid = array();
            $carsid = array();
            foreach ($personasadd as $pers) {
               if(!empty($pers['idcargo']))
               {
                   array_push($persid, $pers['idpersona']);
                   array_push($carsid, $pers['idcargo']);
               }
               else
               {
                   array_push($pernocargsid,$pers['idpersona']);
               }
            }
            if (count($persid) > 0) {
                $datospersonasadd = $DEC->GetPersonas($carsid,$persid);
            }
            if(count($pernocargsid) > 0) {
                $datospersonasadd1 = $DEC->GetPersonas(array(),$pernocargsid);
                if (count($datospersonasadd)>0) {
                    $datospersonasadd = array_merge($datospersonasadd,$datospersonasadd1);
                } else {
                    $datospersonasadd = $datospersonasadd1;
                }
            }
            foreach($personas as $r => $peop) {
                foreach($datospersonasadd as $peadd) {
                    if($peop['idpersona'] == $peadd['idpersona']) {
                        unset($personas[$r]);
                    }
                }
            }

            $arrToGetEstructDen = array();
            if(count($personas) > 0)
                $arrToGetEstructDen = array_merge($arrToGetEstructDen,$personas);
            if(count($datospersonasadd) > 0)
                $arrToGetEstructDen = array_merge($arrToGetEstructDen,$datospersonasadd);

            $denomEstructs = $this->getEstructDenoms($arrToGetEstructDen);

            foreach ($personas as $a => $perscont) {
                $existe = false;
                foreach ($personasdelete as $persdel) {
                    if ($perscont['idpersona'] == $persdel['idpersona'] && $perscont['idcargo'] == $persdel['idcargo']) {
                        unset($personas[$a]);
                        $existe = true;
                    }
                }
                if(!$existe) {

                    $personas[$a]['denomarea'] = $denomEstructs[$personas[$a]['idarea']]->denominacion;
                    $personas[$a]['denomcargo'] = $denomEstructs[$personas[$a]['idcargo']]->denominacion;
                    $personas[$a]['add'] = 0;
                }
            }
            $added = array();

            foreach ($datospersonasadd as $persadd) {
                $existe = false;
                foreach($personas as $k => $per) {
                    if($per['idpersona'] == $persadd['idpersona'] &&  $per['idcargo'] == $persadd['idcargo']) {
                        $existe = true;
                        break;
                    }
                }
                if(!$existe) {
                    if(empty($persadd['idcargo'])){
                        $persadd['denomcargo'] = 'Sin cargo';
                    } else {
                        $persadd['denomcargo'] = $denomEstructs[$persadd['idcargo']]->denominacion;
                    }
                    $persadd['add'] = 1;
                    if(empty($persadd['idarea'])){
                        $persadd['denomarea'] = 'Fuera de plantilla';
                    } else {
                        $persadd['denomarea'] = $denomEstructs[$persadd['idarea']]->denominacion;
                    }
                    array_push($added, $persadd);
                }
            }
            if (count($personas) > 0) {
                $personas = array_merge($personas,$added);
            } else {
                $personas = $added;
            }
            if (count($personas)>0) {
                return array('datos' => $personas, 'cantidad' => count($personas));
            } else {
                return array('datos' => array(), 'cantidad' => 0);
            }
        } else {
            return array('datos' => array(), 'cantidad' => 0);
        }
    }

    private function getEstructDenoms($arreglo)
    {
        $ids = array();
        foreach($arreglo as $arr)
        {
            if(array_key_exists('idarea',$arr) && !empty($arr['idarea']))
                array_push($ids,$arr['idarea']);
            if(array_key_exists('idcargo',$arr) && !empty($arr['idarea']))
                array_push($ids,$arr['idcargo']);
        }
        $idsLimpios = array_unique($ids);
        $temp = ZendExt_IoC::getInstance()->metadatos->ObtenerDatosEstructuraPorArrayID($idsLimpios);
        $result = array();
        foreach($temp as $t)
        {
            $result[$t[0]->idestructura] = $t[0];
        }
        return $result;
    }
}