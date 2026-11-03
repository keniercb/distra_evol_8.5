<?php

class DatDemandatiempoModel extends ZendExt_Model {

    public function init() {
        parent::ZendExt_Model();
    }

//    public function Guardar($DatDemandatiempo) {
//        $DatDemandatiempo->save();
//    }

//    public function Eliminar($DatDemandatiempo) {
//        $DatDemandatiempo->delete();
//    }

    public function obtenerComportamientoEjecutorProductor($params) {
        $comportamiento = array();
        $obj = DatEntidaddatosnomenclador::getComport($params['identidad']);
        $ejecutor = NomDatosnomenclador::getDatosNomPorUriTipoNom("Comportamientodeentidad", "ejecutor");
        $organoempresarial = NomDatosnomenclador::getDatosNomPorUriTipoNom("Comportamientodeentidad", "organoempresarial");
        $organorector = NomDatosnomenclador::getDatosNomPorUriTipoNom("Comportamientodeentidad", "rectorbalance");
        $pos = 0;
        foreach ($obj as $entidad) {
            if ($entidad['iddatosnomenclador'] == $ejecutor[0]['iddatosnomenclador']) {//Organo ejecutor
                $comportamiento[$pos]['idtipocomportamiento'] = 1;
                $comportamiento[$pos]['denominacion'] = "Ejecutor";
                $pos++;
            } else if ($entidad['iddatosnomenclador'] == $organoempresarial[0]['iddatosnomenclador']) {//Organo empresarial
                $comportamiento[$pos]['idtipocomportamiento'] = 2;
                $comportamiento[$pos]['denominacion'] = "Proveedor";
                $pos++;
            } else if ($entidad['iddatosnomenclador'] == $organorector[0]['iddatosnomenclador']) {//Organo rector
                $comportamiento[$pos]['idtipocomportamiento'] = 3;
                $comportamiento[$pos]['denominacion'] = "Rector";
                $pos++;
            }
        }
        return $comportamiento;
    }

    public function listarEntidadesEjecutoras($params) {
        $data = DatDemandatiempo::listarEntidadesEjecutoras($params);
        return $data;
    }

    public function adicionarDesag($params) {
        $arraysidentidad = $params['identidades'];
        $total = count($arraysidentidad);
        $count = 0;
        foreach ($arraysidentidad as $obj) {
            $params['identidad'] = $obj->identidad;
            $data = DatDemandatiempo::adicionarDesag($params);
            if ($data == 1) {
                $count++;
            }
        }
        $calc = $total - $count;
        if ($calc == 0)
            return 1;
        else
        if ($calc > 0 && $calc != $total)
            return 0;
        else if ($calc == $total)
            return 2;
    }

    public function eliminarDesag($params) {
        $arraysdemadTiempo = $params['iddesag'];
        $total = count($arraysdemadTiempo);
        $count = 0;
        foreach ($arraysdemadTiempo as $key => $obj) {
            $params['iddemandatiempo'] = $obj->iddemandatiempo;
            $data = DatDemandatiempo::eliminarDesag($params);
            if ($data == 1) {
                $count++;
            }
        }
        $calc = $total - $count;
        if ($calc == 0)
            return 1;
        else
        if ($calc > 0 && $calcc != $total)
            return 0;
        else
            return 2;
    }

    public function aprobarDesaprobarPlan($params) {
        $actualizados = 0;
        if ($params['demandas'][0]->iddemanda != null) {
            
           
            $total = count($params['demandas']);
            foreach ($params['demandas'] as $demanda) {
                $ObjDatDemanda = Doctrine::getTable('DatDemanda')->findByDql("iddemanda =" . $demanda->iddemanda);
                if ($ObjDatDemanda[0]->idaprobacionplan == $params['valorAComprobar']) {
                    $listDesagDemanda = DatDemandatiempo::listadoDesagValidasDadoDemanda($demanda);
                    


                    if ($params['accion'] == 0 || ($ObjDatDemanda[0]->idaprobacion == 4 && $listDesagDemanda[0]['total'] == $listDesagDemanda[0]['totalvalidados'] && $listDesagDemanda[0]['plantalleres'] == $demanda->cantidadconfirmada /*&& $listTotalDesagDemanda[0]['totaldesagregado'] == $demanda->cantidadconfirmada*/)) {

                        //si estoy desaprobando... o la cantidad final es mayor que 0 (porque se está aprobando)
                        $fecha = strftime("%d/%m/%Y %T", time());
                        $ObjDatDemanda[0]->idaprobacionplan = $params['idaprobacion'];
                        $ObjDatDemanda[0]->idusuario = $params['idusuario'];
                        $ObjDatDemanda[0]->fecha = $fecha;
                       // print_r( $ObjDatDemanda[0]->idaprobacionplan);die;
                        $ObjDatDemanda->save();
                        $actualizados++;
                    }
                }
            }
        }
        if ($total == $actualizados) {
            return 1;
        } else if ($total > $actualizados) {
            if ($actualizados == 0) {
                return 0;
            } else {
                return 2;
            }
        }
    }

}
