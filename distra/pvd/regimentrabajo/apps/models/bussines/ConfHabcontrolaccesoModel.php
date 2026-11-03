<?php

class ConfHabcontrolaccesoModel extends ZendExt_Model
{
    protected $ConfHabcontrolacceso;

    function __construct()
    {
        $this->ConfHabcontrolacceso = new ConfHabcontrolacceso();
    }

    public function setUp()
    {
        parent::ZendExt_Model();

    }

    public function getHabilitarcontrolacceso()
    {
        $resultado = array();
        $idestruct = array();
        $idestructreloj = array();
        $result = ConfHabcontrolacceso::getHabilitarcontrolacceso();
        //print_r('<pre>');print_r($result);die;
        foreach ($result as $key => $val) {
            $resultado[$key]['idca'] = $val['id'];
            if ($val['id'] == 1) {
                if ($val['habilitado'] == 1) {
                    $resultado[$key]['habilitadoca'] = true;
                    if ($val['fuente'] == 0) {
                        $resultado[$key]['habilitadoabd'] = true;
                        $resultado[$key]['habilitadosw'] = false;
                    } else if ($val['fuente'] == 1) {
                        $resultado[$key]['habilitadosw'] = true;
                        $resultado[$key]['habilitadoabd'] = false;
                    }
                    $resultado[$key]['dirautenticacion'] = $val['dirautenticacion'];
                    $resultado[$key]['dirdatos'] = $val['dirdatos'];
                } else {
                    $resultado[$key]['habilitadoca'] = false;
                    $resultado[$key]['habilitadoabd'] = false;
                    $resultado[$key]['habilitadosw'] = false;
                    $resultado[$key]['dirautenticacion'] = '';
                    $resultado[$key]['dirdatos'] = '';
                }
            } else if ($val['id'] == 2) {
                if ($val['habilitado'] == 1) {
                    $resultado[$key]['habilitadoca'] = true;
                    $resultado[$key]['dirdatos'] = $val['dirdatos'];
                }
                $resultado[$key]['habilitadoabd'] = false;
                $resultado[$key]['habilitadosw'] = false;
                $resultado[$key]['dirautenticacion'] = '';
                $ConfEstructuratempus = new ConfEstructuratempus();
                $idestructuras = $ConfEstructuratempus->getEstructuratempus();
                $resultado[$key]['direstructura'] = $idestructuras;
                foreach ($idestructuras as $k => $v){
                    array_push($idestruct,$v['idestructura']);
                }
                $resultado[$key]['estructuras'] = $idestruct;
            }else if ($val['id'] == 3){
                if ($val['habilitado'] == 1) {
                    $resultado[$key]['habilitadoca'] = true;
                    $resultado[$key]['dirdatos'] = '';
                }
                $resultado[$key]['habilitadoabd'] = false;
                $resultado[$key]['habilitadosw'] = false;
                $resultado[$key]['dirautenticacion'] = '';
                $ConfEstructurareloj = new ConfEstructurareloj();
                $idestructuras = $ConfEstructurareloj->getEstructurareloj();
                $resultado[$key]['direstructura'] = $idestructuras;
                foreach ($idestructuras as $k => $v){
                    array_push($idestructreloj,$v['idestructura']);
                }
                $resultado[$key]['estructuras'] = $idestructreloj;
            }
        }
        //print_r('<pre>');print_r($resultado);die;
        return $resultado;
    }

    public function getlistadoEstructuraTempus()
    {
        $ConfEstructuratempus = new ConfEstructuratempus();
        $idestructuras = $ConfEstructuratempus->getEstructuratempus();
        $resultado = array();
        foreach ($idestructuras as $k => $v){
            $r = ZendExt_IoC::getInstance()->metadatos->DameEstructura($v['idestructura']);
            $resultado[$k]['idestructura'] = $v['idestructura'];
            $resultado[$k]['denomestructura'] = $r[0]->denominacion;
            $resultado[$k]['dirapp'] = $v['dirapp'];
        }
        return $resultado;
    }

    public function getlistadoEstructuraReloj()
    {
        $ConfEstructurareloj = new ConfEstructurareloj();
        $idestructuras = $ConfEstructurareloj->getEstructurareloj();

        $resultado = array();
        foreach ($idestructuras as $k => $v){
            $r = ZendExt_IoC::getInstance()->metadatos->DameEstructura($v['idestructura']);
            $resultado[$k]['idestructura'] = $v['idestructura'];
            $resultado[$k]['denomestructura'] = $r[0]->denominacion;
            $resultado[$k]['dirserver'] = $v['dirserver'];
            $resultado[$k]['nombredb'] = $v['nombredb'];
            $resultado[$k]['usuario'] = $v['usuario'];
            $resultado[$k]['contrasena'] = $v['contrasena'];
        }
        return $resultado;
    }

    public function setHabilitarcontrolacceso($servicioweb, $dirservautent, $dirservdatos, $basedatos, $idestructurastempus,$idestructurasANVIZ, $habCA, $habTempus,$habReloj,$puntosacceso)
    {
        try {
            $ConfHabcontrolacceso = new ConfHabcontrolacceso();
            if($habCA == 'false' && $habTempus == 'false' && $habReloj == 'false') {
                $obj = $ConfHabcontrolacceso->getById(1);
                $obj->habilitado = 0;
                $obj->fuente = 2;
                $obj->dirautenticacion = null;
                $obj->dirdatos = null;

                $obj2 = $ConfHabcontrolacceso->getById(2);
                $obj2->habilitado = 0;
                $obj2->fuente = 2;
                $obj2->dirautenticacion = null;
                $obj2->dirdatos = null;

                $obj3 = $ConfHabcontrolacceso->getById(3);
                $obj3->habilitado = 0;
                $obj3->fuente = 2;
                $obj3->dirautenticacion = null;
                $obj3->dirdatos = null;
            }else{
                if ($habCA == 'true')
                {
                    $obj = $ConfHabcontrolacceso->getById(1);
                    if ($servicioweb == 'true') {
                        $obj->habilitado = 1;
                        $obj->fuente = 1;
                        $obj->dirautenticacion = $dirservautent;
                        $obj->dirdatos = $dirservdatos;
                    } elseif ($basedatos == 'true') {
                        $obj->habilitado = 1;
                        $obj->fuente = 0;
                        $obj->dirautenticacion = null;
                        $obj->dirdatos = null;
                        $ConfPuntosacceso = new ConfPuntosacceso();
                        $ConfPuntosacceso->EliminarPuntosAcceso();
                        foreach ($puntosacceso as $v) {
                            $objptoacc = new ConfPuntosacceso();
                            $objptoacc->idpuntoacceso = $v->idpuntoacceso;
                            $objptoacc->denominacion = $v->denominacion;
                            $objptoacc->save();
                        }
                    }
                    if ($servicioweb == 'false' && $basedatos == 'false') {
                        $obj->habilitado = 0;
                        $obj->fuente = 2;
                        $obj->dirautenticacion = null;
                        $obj->dirdatos = null;
                    }
                    $obj2 = $ConfHabcontrolacceso->getById(2);
                    $obj2->habilitado = 0;
                    $obj2->fuente = 2;
                    $obj2->dirautenticacion = null;
                    $obj2->dirdatos = null;

                    $obj3 = $ConfHabcontrolacceso->getById(3);
                    $obj3->habilitado = 0;
                    $obj3->fuente = 2;
                    $obj3->dirautenticacion = null;
                    $obj3->dirdatos = null;
                }
                if ($habTempus == 'true'){
                    $obj = $ConfHabcontrolacceso->getById(2);
                    $obj->habilitado = 1;
                    $obj->fuente = 2;
                    $obj->dirautenticacion = null;
                    $obj->dirdatos = null;

                    $obj2 = $ConfHabcontrolacceso->getById(1);
                    $obj2->habilitado = 0;
                    $obj2->fuente = 2;
                    $obj2->dirautenticacion = null;
                    $obj2->dirdatos = null;

                    $ConfEstructuratempus = new ConfEstructuratempus();
                    $ConfEstructuratempus->DelEstructuratempus();
                    foreach ($idestructurastempus as $v) {
                        $objtemp = new ConfEstructuratempus();
                        $objtemp->idestructura = $v->idestructura;
                        $objtemp->dirapp = $v->dirapp;
                        $objtemp->save();
                    }

                    $obj3 = $ConfHabcontrolacceso->getById(3);
                    $obj3->habilitado = 0;
                    $obj3->fuente = 2;
                    $obj3->dirautenticacion = null;
                    $obj3->dirdatos = null;
                }
                if ($habReloj == 'true'){
                    $obj = $ConfHabcontrolacceso->getById(1);
                    $obj->habilitado = 0;
                    $obj->fuente = 2;
                    $obj->dirautenticacion = null;
                    $obj->dirdatos = null;

                    $obj2 = $ConfHabcontrolacceso->getById(2);
                    $obj2->habilitado = 0;
                    $obj2->fuente = 2;
                    $obj2->dirautenticacion = null;
                    $obj2->dirdatos = null;

                    $obj3 = $ConfHabcontrolacceso->getById(3);
                    $obj3->habilitado = 1;
                    $obj3->fuente = 2;
                    $obj3->dirautenticacion = null;
                    $obj3->dirdatos = null;

                    $ConfEstructurareloj = new ConfEstructurareloj();
                    $ConfEstructurareloj->DelEstructurareloj();

                    foreach ($idestructurasANVIZ as $v) {
                        $objreloj = new ConfEstructurareloj();
                        $objreloj->idestructura = $v->idestructura;
                        $objreloj->dirserver = $v->dirserver;
                        $objreloj->nombredb = $v->nombredb;
                        $objreloj->usuario = $v->usuario;
                        $objreloj->contrasena = $v->contrasena;
                        $objreloj->save();
                    }
                }
            }
            $obj->save();
            $obj2->save();
            $obj3->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function getlistadoPuntoAcceso()
    {
        $ConfPuntosAcceso = new ConfPuntosAcceso();
        $puntosacceso = $ConfPuntosAcceso->getPuntosAcceso();
        return $puntosacceso;
    }

    public function setPuntoAcceso($puntosacceso)
    {
        try {
            $objpuntosacceso = new ConfPuntosAcceso();
            $objpuntosacceso->EliminarPuntosAcceso();
            foreach ($puntosacceso as $v) {
                $objpuntosacceso = new ConfPuntosAcceso();
                $objpuntosacceso->denominacion = $v->denominacion;
                $objpuntosacceso->idpuntoacceso = $v->idpuntoacceso;
                $objhorario->save();
            }
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

}
