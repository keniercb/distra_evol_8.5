<?php

class ComportamientoEntidadModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function listarComportamiento($parametros) {
        $idsentidades = "";
        foreach ($parametros['dominios'] as $value) {
            $idsentidades.=$value->id . ",";
        }
        $idsentidades.=$parametros['identidad'];
        $result = DatEntidaddatosnomenclador::listarComportamiento($parametros, $idsentidades);
        return $result;
    }

    public function guardarComportamiento($params) {
        $result = 0;
        $tieneindic = 0;
        $tienedatosplanif = 0;
        $arraycomportamiento = array();
        $organoconsumidor = DatEntidaddatosnomenclador::obtenerComportamiento('organoconsumidor');
        $arraycomportamiento['od'] = $organoconsumidor[0];
        $centrodebalance = DatEntidaddatosnomenclador::obtenerComportamiento('centrodebalance');
        $arraycomportamiento['cb'] = $centrodebalance[0];
        $ejecutor = DatEntidaddatosnomenclador::obtenerComportamiento('ejecutor');
        $arraycomportamiento['ejecutor'] = $ejecutor[0];
        $rectorbalance = DatEntidaddatosnomenclador::obtenerComportamiento('rectorbalance');
        $arraycomportamiento['rector'] = $rectorbalance[0];
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
                $tienedatosplanif = DatEntidaddatosnomenclador::odConNivelesOPlan($value->identidad)[0];
                if ($tienedatosplanif == 1) {
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
                $tieneindic = DatEntidaddatosnomenclador::cbConIndicadores($value->identidad)[0];
                if ($tieneindic == 1) {
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
        }
        return $result;
    }

    public function guardarRector($identidad) {
        $result = 0;
        $rector = DatEntidaddatosnomenclador::obtenerComportamiento('rectorbalance');
        $rector = $rector[0];
        //preg si existe relacion alguna entidad con comportamiento de rector
        $comportamiento = Doctrine::getTable('DatEntidaddatosnomenclador')->findByDql(" iddatosnomenclador=$rector");

        //sino existe insertar
        if (!$comportamiento[0]->identidaddatosnomenclador) {
            $objComportamiento = new DatEntidaddatosnomenclador();
            $objComportamiento->identidad = $identidad;
            $objComportamiento->iddatosnomenclador = $rector;
            $objComportamiento->save();
            $result++;
        } else {
            //si existe elimino el anterior y luego inserto el nuevo porque solo una entidad puede tener rector                   
            $query = new Doctrine_Query();
            $query->delete()->from('DatEntidaddatosnomenclador ')
                    ->where("iddatosnomenclador=$rector")->execute();
            $objComportamiento = new DatEntidaddatosnomenclador();
            $objComportamiento->identidad = $identidad;
            $objComportamiento->iddatosnomenclador = $rector;
            $objComportamiento->save();
            $result++;
        }

        return $result;
    }

    public function listarCentroBalance() {
        $idcentrobalance = 1;
        $centrobalance = DatEntidaddatosnomenclador::getEntidadDadoComportamiento($idcentrobalance);
        foreach ($centrobalance as $k => $valor) {
            $dat[$k]['idcentrobalance'] = $valor['identidaddatosnomenclador'];
            $datosentidad = $this->integrator->metadatos->DameEstructura($valor['identidad']);
            $dat[$k]['centrobalance'] = $datosentidad[0]->denominacion;
        }
        return $dat;
    }

}
