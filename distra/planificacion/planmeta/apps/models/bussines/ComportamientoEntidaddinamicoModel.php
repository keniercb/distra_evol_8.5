<?php

class ComportamientoEntidaddinamicoModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function obtenerColumnasDinamicasComportamientoEntidad() {
        return NomDatosnomenclador::servicioObtenerDatosnom('comportamientodeentidad', true);
    }

    public function obtenerEntidadesHijas($identidad, $entidad) {
        try {
            $integrator = ZendExt_IoC::getInstance();
            $excluir = array(7, 8, 9, 10);
            $dominios = $integrator->metadatos->DameHijosEstructura($identidad, $excluir);
            $entidades = array();
            foreach ($dominios as $key => $value) {
                $entidades[$key][identidad] = $value->id;
                $entidades[$key][denominacion] = $value->denominacion;
            }
            $arrayentidad['identidad'] = $identidad;
            $arrayentidad['denominacion'] = $entidad;
            array_unshift($entidades, $arrayentidad);
            return $entidades;
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function listarComportamiento($params) {
        $idsentidades = "";
        foreach ($params['dominios'] as $value) {
            $idsentidades.=$value->id . ",";
        }
        $idsentidades.=$params['identidad'];
        $params['idsentidades'] = $idsentidades;
        $result = DatEntidaddatosnomenclador::listarComportamientoDinamico($params);
        return $result;
    }

    public function guardarComportamiento($params) {
        $result = 0;
        foreach ($params['datos'] as $dato) {
            foreach ($params['columnas'] as $columna) {
                $var = $columna->uridatosnomenclador;
                if (isset($dato->$var)) {//el comportamiento fue modificado
                    $objEntidaddatosnomenclador = Doctrine::getTable('DatEntidaddatosnomenclador')->findByDql("iddatosnomenclador = $columna->iddatosnomenclador and identidad=$dato->identidad");
                    if ($dato->$var == 1) {//hay que ponerle el comportamiento
                        if ($objEntidaddatosnomenclador[0]->identidaddatosnomenclador == null) {
                            //no existe la relacion por lo tanto la creo
                            $objEntidaddatosnomenclador = new DatEntidaddatosnomenclador();
                            $objEntidaddatosnomenclador->identidad = $dato->identidad;
                            $objEntidaddatosnomenclador->iddatosnomenclador = $columna->iddatosnomenclador;
                            $objEntidaddatosnomenclador->save();
                            $result++;
                        }
                    } else {//hay que quitarle el comportamiento
                        if ($objEntidaddatosnomenclador[0]->identidaddatosnomenclador) {
                            //existe la relacion por lo tanto la elimino
                            //esta validacion debe sustituirse por una solucion en la arquitectura de datos
                            if ($columna->uridatosnomenclador == 'centrodebalance') {
                                $tieneindic = DatEntidaddatosnomenclador::cbConIndicadores($dato->identidad);
                                if ($tieneindic [0] == 0) {
                                    $objEntidaddatosnomenclador[0]->delete();
                                    $result++;
                                }
                            } else
                            //esta validacion solo es para sisplan, queda pendiente una solucion definitiva para todos los sistemas
                            if ($columna->uridatosnomenclador == 'organoconsumidor') {
                                $tienedatosplanif = DatEntidaddatosnomenclador::odConNivelesOPlan($dato->identidad);
                                if ($tienedatosplanif [0] == 0) {
                                    $objEntidaddatosnomenclador[0]->delete();
                                    $result++;
                                }
                            } else {
                                $objEntidaddatosnomenclador[0]->delete();
                                $result++;
                            }
                        }
                    }
                }
            }
        }
        return $result;
    }

    public function guardarRector($params) {
        $result = 0;
        //pregunto si existe relacion de alguna entidad con el comportamiento rector(valor por defecto)
        $comportamiento = Doctrine::getTable('DatEntidaddatosnomenclador')->findByDql(" iddatosnomenclador={$params['iddatosnomenclador']}");
        //si no existe insertar
        if (!$comportamiento[0]->identidaddatosnomenclador) {
            $objEntidaddatosnomenclador = new DatEntidaddatosnomenclador();
            $objEntidaddatosnomenclador->identidad = $params['identidad'];
            $objEntidaddatosnomenclador->iddatosnomenclador = $params['iddatosnomenclador'];
            $objEntidaddatosnomenclador->save();
            $result++;
        } else {
            //si existe elimino el anterior y luego inserto el nuevo porque solo una entidad puede ser rector(valor por defecto)
            $query = new Doctrine_Query();
            $query->delete()->from('DatEntidaddatosnomenclador ')
                    ->where("iddatosnomenclador={$params['iddatosnomenclador']}")->execute();
            $objEntidaddatosnomenclador = new DatEntidaddatosnomenclador();
            $objEntidaddatosnomenclador->identidad = $params['identidad'];
            $objEntidaddatosnomenclador->iddatosnomenclador = $params['iddatosnomenclador'];
            $objEntidaddatosnomenclador->save();
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

    public function obtenerEntidadesDadoComportamiento($uri_comportamiento, $identidades = null) {
        $entrada_como_arreglo = false;
        if ($identidades != null) {
            if (gettype($identidades) == 'array') {
                $identidades = implode(',', $identidades);
                $entrada_como_arreglo = true;
            }
        }

        $identidades_dado_comportamiento = DatEntidaddatosnomenclador::obtenerEntidadesDadoComportamiento($uri_comportamiento, $identidades);

        if (!$entrada_como_arreglo) {
            $identidades_dado_comportamiento = implode(',', $identidades_dado_comportamiento);
        }

        return $identidades_dado_comportamiento;
    }

}
