<?php 
class DatDominioestructuracontrolModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getEstructurascontrolByDominioyEstructura($iddominio, $idestructura)
    {
        $datos = DatDominioestructuracontrol::getEstructurascontrolByDominioyEstructura($iddominio, $idestructura);
        foreach ($datos['DatControlador'] as $r => $v) {
            $datos['DatControlador'][$r]['Controlados'] = DatDominioestructuracontrolModel::getControladosByDominioEstructuraPersona($iddominio, $idestructura, $v['idpersona']);
        }
        return $datos['DatControlador'];
    }

    public function getControladosByDominioEstructuraPersona($iddominio, $idestructura, $idpersona)
    {
        $datos = DatDominioestructuracontrol::getControladosByDominioEstructuraPersona(
            $iddominio,
            $idestructura,
            $idpersona
        );
        $cargos = array();
        $areas = array();
        if (count($datos) > 0) {
            foreach ($datos[0]['DatControlado'] as $c) {
                if (!empty($c['idcargo'])) {
                    array_push($cargos, $c['idcargo']);
                } else {
                    array_push($areas, $c);
                }
            }
            if (count($cargos) > 0) {
                $controlados = ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersona(
                    null,
                    null,
                    null,
                    null,
                    null,
                    $cargos,
                    null
                );
            }
            $controladosdelete = DatMovimientos::getMovimientosByIdcontrolador($datos[0]['idcontrolador'], 0);
            $controladosadd = DatMovimientos::getMovimientosByIdcontrolador($datos[0]['idcontrolador'], 1);
            $persid = array();
            foreach ($controladosadd as $pers) {
                array_push($persid, $pers['idpersona']);
            }
            if (count($persid) > 0) {
                $datospersonasadd = ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersona(
                    $persid,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null
                );
            }
            foreach ($controladosdelete as $persdel) {
                foreach ($controlados->data as $a => $perscont) {
                    if ($perscont['idpersona'] == $persdel['idpersona']) {
                        unset($controlados->data[$a]);
                        $controlados->data = array_values($controlados->data);
                    }
                }
            }
            if (count($controlados->data) == 0) {
                $controlados->data = Array();
            }
            foreach ($datospersonasadd->data as $padd) {
                array_push($controlados->data, $padd);
            }

            if (count($areas) > 0) {
                foreach ($areas as $are) {
                    array_push($controlados->data, $are);
                }
            }
        }
        return $controlados->data;
    }

    public function getControladosTiene($iddominio, $idestructura)
    {
        try {
            $result = DatDominioestructuracontrol::getControladosTiene($iddominio, $idestructura);
            return $result;
        } catch(Exception $e) {
            return false;
        }
    }

    public function getEstructurascontrolEvaluaciones($iddominio, $idestructura)
    {
        $datos = DatDominioestructuracontrol::getEstructurascontrolEvaluaciones($iddominio, $idestructura);
        foreach ($datos['DatControlador'] as $r => $v) {
            $datos['DatControlador'][$r]['Controlados'] = DatDominioestructuracontrolModel::getControladosByDominioEstructuraEvaluaciones($iddominio, $idestructura, $v['idpersona']);
        }
        return $datos['DatControlador'];
    }

    public function getControladosByDominioEstructuraEvaluaciones($iddominio, $idestructura, $idpersona)
    {
        $datos = DatDominioestructuracontrol::getControladosByDominioEstructuraPersona(
            $iddominio,
            $idestructura,
            $idpersona
        );

        $cargos = array();
        $areas = array();
        if (count($datos) > 0) {
            foreach ($datos[0]['DatControlado'] as $c) {
                if (!empty($c['idcargo'])) {
                    array_push($cargos, $c['idcargo']);
                } else {
                    array_push($areas, $c);
                }
            }

            if (count($cargos) > 0) {
                $controlados = ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersonaEvaluaciones(
                    null,
                    null,
                    null,
                    null,
                    null,
                    $cargos,
                    null
                );
            }

            $controladosdelete = DatMovimientos::getMovimientosByIdcontrolador($datos[0]['idcontrolador'], 0);

            $controladosadd = DatMovimientos::getMovimientosByIdcontrolador($datos[0]['idcontrolador'], 1);

            $persid = array();
            foreach ($controladosadd as $pers) {
                array_push($persid, $pers['idpersona']);
            }

            if (count($persid) > 0) {
                $datospersonasadd = ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersonaEvaluaciones(
                    $persid,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null
                );
            }

            foreach ($controladosdelete as $persdel) {
                foreach ($controlados as $a => $perscont) {
                    if ($perscont['idpersona'] == $persdel['idpersona']) {
                        unset($controlados[$a]);
                        $controlados = array_values($controlados);
                    }
                }
            }
            if (count($controlados) == 0) {
                $controlados = Array();
            }
            foreach ($datospersonasadd as $padd) {
                array_push($controlados, $padd);
            }

            if (count($areas) > 0) {
                foreach ($areas as $are) {
                    array_push($controlados, $are);
                }
            }
        }
        return $controlados;
    }

    public function getControladosByDominioEstructuraPersonaPluriempleo($iddominio, $idestructura, $idpersona)
    {
        $DEC = new DatDominioestructuracontrol();
        $controlador = $DEC->getControladorByDominioEstructuraPersona($iddominio, $idestructura, $idpersona);
        $ECM = new DatEstructuracontrolModel();
        $result = $ECM->getPersonasporcargo($controlador[0]['idcontrolador'],'s');

       return $result['datos'];
    }
}