<?php

class ComportamientoEntidadProezaModel extends ComportamientoEntidadModel {

    public function listarComportamiento($parametros) {
        $idsentidades = "";
        foreach ($parametros['dominios'] as $value) {
            $idsentidades.=$value->id . ",";
        }
        $idsentidades.=$parametros['identidad'];
        $result = DatEntidaddatosnomencladorProeza::listarComportamiento($parametros, $idsentidades);        
        return $result;
    }

    public function guardarComportamiento($params) {
        $result = 0;
        $tieneindic = 0;
        $tienedatosplanif = 0;
        $arraycomportamiento = array();
        $organoconsumidor = DatEntidaddatosnomenclador::obtenerComportamiento('organoconsumidor');
        $arraycomportamiento['od'] = $organoconsumidor[0];
        $centrodebalance = DatEntidaddatosnomenclador::obtenerComportamiento('Centrodebalance');
        $arraycomportamiento['cb'] = $centrodebalance[0];
        $ejecutor = DatEntidaddatosnomenclador::obtenerComportamiento('ejecutor');
        $arraycomportamiento['ejecutor'] = $ejecutor[0];
        $rectorbalance = DatEntidaddatosnomenclador::obtenerComportamiento('rectorbalance');
        $arraycomportamiento['rector'] = $rectorbalance[0];
        $empresarial = DatEntidaddatosnomenclador::obtenerComportamiento('organoempresarial');
        $arraycomportamiento['empresarial'] = $empresarial[0];
        foreach ($params['datos'] as $value) {
            if ($value->od) {
                //preg si esxiste relacion 
                $comportamiento = Doctrine::getTable('DatEntidaddatosnomenclador')->findByDql("identidad = $value->identidad AND iddatosnomenclador={$arraycomportamiento['od']}");
                //sino existe insertar
                if (!$comportamiento[0]->identidaddatosnomenclador) {
                    $objComportamiento = new DatEntidaddatosnomenclador();
                    $objComportamiento->identidad = $value->identidad;
                    $objComportamiento->iddatosnomenclador = $arraycomportamiento['od'];
                    $objComportamiento->save();
                }
            } else {
                //eliminar
                //preguntar si el organo demandante tiene 
                $tienedatosplanif = DatEntidaddatosnomenclador::odConNivelesOPlan($value->identidad);
                if ($tienedatosplanif[0] == 1) {
                    //no se puede eliminar
                    $result++;
                } else {
                    $query = new Doctrine_Query();
                    $query->delete()->from('DatEntidaddatosnomenclador ')
                            ->where("identidad = $value->identidad AND iddatosnomenclador={$arraycomportamiento['od']}")->execute();
                }
            }
            if ($value->cb) {
                //preg si existe relacion 
                $comportamiento = Doctrine::getTable('DatEntidaddatosnomenclador')->findByDql("identidad = $value->identidad AND iddatosnomenclador={$arraycomportamiento['cb']}");
                //sino existe insertar
                if (!$comportamiento[0]->identidaddatosnomenclador) {
                    $objComportamiento = new DatEntidaddatosnomenclador();
                    $objComportamiento->identidad = $value->identidad;
                    $objComportamiento->iddatosnomenclador = $arraycomportamiento['cb'];
                    $objComportamiento->save();
                }
            } else {
                //eliminar
                //preguntar si el cb tiene algun indicador asociado
                $tieneindic = DatEntidaddatosnomenclador::cbConIndicadores($value->identidad);
                if ($tieneindic[0] == 1) {
                    //no se puede eliminar
                    $result++;
                } else {
                    $query = new Doctrine_Query();
                    $query->delete()->from('DatEntidaddatosnomenclador ')
                            ->where("identidad = $value->identidad AND iddatosnomenclador={$arraycomportamiento['cb']}")->execute();
                }
            }
            if ($value->ejecutor) {
                //preg si esxiste relacion $arraycomportamiento['od']
                $comportamiento = Doctrine::getTable('DatEntidaddatosnomenclador')->findByDql("identidad = $value->identidad AND iddatosnomenclador={$arraycomportamiento['ejecutor']}");
                //sino existe insertar
                if (!$comportamiento[0]->identidaddatosnomenclador) {
                    $objComportamiento = new DatEntidaddatosnomenclador();
                    $objComportamiento->identidad = $value->identidad;
                    $objComportamiento->iddatosnomenclador = $arraycomportamiento['ejecutor'];
                    $objComportamiento->save();
                }
            } else {
                //eliminar
                $query = new Doctrine_Query();
                $query->delete()->from('DatEntidaddatosnomenclador ')
                        ->where("identidad = $value->identidad AND iddatosnomenclador={$arraycomportamiento['ejecutor']}")->execute();
            }
            if ($value->organoempresarial) {
                //preg si esxiste relacion $arraycomportamiento['od']
                $comportamiento = Doctrine::getTable('DatEntidaddatosnomenclador')->findByDql("identidad = $value->identidad AND iddatosnomenclador={$arraycomportamiento['empresarial']}");
                //sino existe insertar
                if (!$comportamiento[0]->identidaddatosnomenclador) {
                    $objComportamiento = new DatEntidaddatosnomenclador();
                    $objComportamiento->identidad = $value->identidad;
                    $objComportamiento->iddatosnomenclador = $arraycomportamiento['empresarial'];
                    $objComportamiento->save();
                }
            } else {
                //eliminar
                $query = new Doctrine_Query();
                $query->delete()->from('DatEntidaddatosnomenclador ')
                        ->where("identidad = $value->identidad AND iddatosnomenclador={$arraycomportamiento['empresarial']}")->execute();
            }
        }
        return $result;
    }

}
