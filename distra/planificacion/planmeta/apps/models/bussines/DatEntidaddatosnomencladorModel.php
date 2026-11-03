<?php

/**
 * DatEntidaddatosnomencladorModel
 *
 *
 * @ author Drisis Silvia Díaz Rodriguez
 * @ package Planificación
 * @ subpackage Planificación Empresarial y Presupuestaria
 * @ copyright UCID-ERP Cuba
 * @ version 2.0-0
 * */
class DatEntidaddatosnomencladorModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function Insertar($identidad, $cb, $oc, $oe, $rector) {
        //seteo parámetros
        $result = 1;
        if ($oe == 'true') {
            $compEntOE = new DatEntidaddatosnomenclador();
            $compEntOE->identidad = $identidad;
            $compEntOE->iddatosnomenclador = 44;
            $compEntOE->save();
        }
        if ($cb == 'true') {
            $compEntCB = new DatEntidaddatosnomenclador();
            $compEntCB->identidad = $identidad;
            $compEntCB->iddatosnomenclador = 1;
            $compEntCB->save();
        }
        if ($oc == 'true') {
            $compEntOC = new DatEntidaddatosnomenclador();
            $compEntOC->identidad = $identidad;
            $compEntOC->iddatosnomenclador = 2;
            $compEntOC->save();
        }
        if ($rector == 'true') {
            $existeunaentidadrectora = DatEntidaddatosnomenclador::ExisteCompRector(176);
            if ($existeunaentidadrectora != true) {
                $compEntOC = new DatEntidaddatosnomenclador();
                $compEntOC->identidad = $identidad;
                $compEntOC->iddatosnomenclador = 176;
                $compEntOC->save();
            } else {
                $result = 2;
            }
        }
        return $result;
    }

    public function devolverDenomEnt($identidad) {
        $datosentidad = $this->integrator->metadatos->DameEstructura(
                $identidad
        );
        $denominacion = $datosentidad[0]->denominacion;
        return $denominacion;
    }

    static public function retornarArray($id) {
        switch ($id) {
            case 1 :
                return array('cb' => true);
                break;
            case 2 :
                return array('oc' => true);
                break;
            case 44 :
                return array('oe' => true);
                break;
            case 176 :
                return array('rector' => true);
                break;
        }
    }

    public function listarcomportamientos($params) {
        $arrayComport = NomDatosnomenclador::getDatosNomPorUriTipoNom(
                        'Comportamientodeentidad'/* 'Comportamientoporentidad' */
        );

        foreach ($arrayComport as $indice => $valor) {
            unset($arrayComport[$indice]);
            $arrayComport[$valor['uridatosnomenclador']] = $valor['iddatosnomenclador'];
        }

        $data = DatEntidaddatosnomenclador::getEntidaddatosnomenclador(
                        $arrayComport, $params
        );
        $arrayIdsent = array();

        foreach ($data->data as $indice => $valor) {
            $arrayIdsent[] = $valor['d__0']; //identidad
        }


        foreach ($data->data as $indice => $valor) {
            unset($data->data[$indice]);
            $data->data[$indice]['identidad'] = $valor['d__0'];
            $data->data[$indice]['denominacion'] = $this->devolverDenomEnt(
                    $valor['d__0']
            );
            $data->data[$indice]['cb'] = ($valor['d__1'] != null) ? '1' : '2';
            $data->data[$indice]['oc'] = ($valor['d__2'] != null) ? '1' : '2';
            $data->data[$indice]['oe'] = ($valor['d__3'] != null) ? '1' : '2';
            $data->data[$indice]['rector'] = ($valor['d__4'] != null) ? '1' : '2';
        }

        return $data;
    }

    public function estaEnarreglo($valor, $array) {
        $cont = 0;
        foreach ($array as $value) {
            if ($value == $valor) {
                $cont++;
            }
        }
        return $cont;
    }

    public function Eliminar($identidad) {
        $aux = new DatEntidaddatosnomenclador();
        $comportamientos = $aux->getComportamientoDadoEntidad($identidad);

        $i = 0;
        while ($i < count($comportamientos)) {
            $comp = Doctrine::getTable('DatEntidaddatosnomenclador')->find(
                    $comportamientos[$i]['identidaddatosnomenclador']
            );

            $comp->delete();

            $i++;
        }
    }

    public function Buscar($arrayentidades, $entidad) {

        $entidadesDos = array_unique($arrayentidades);
        $var = false;
        for ($i = 0; $i < count($entidadesDos); $i++) {
            if ($entidadesDos[$i] == $entidad) {
                $var = true;
            }
        }

        return $var;
    }

    public function obtenerIdEntidadDatosNomenclador($identCB) {

        $datos = DatEntidaddatosnomenclador::getIdentidaddatosnomenclador(
                        $identCB
        );
        return $datos;
    }

    public function ExisteidIndicacorCentroBalance($idindcb) {
        $existeidindcb = DatIndicadorcentrobalance::ExisteIndAsociadoCB(
                        $idindcb
        );
        return $existeidindcb;
    }

    public function listarOrganosDemandantes($params) {
        $integrator = ZendExt_IoC::getInstance();
        //obtener todos las entidades hijas de la estructura logueada
        $entidades = DatActividadentidad::auxObtenerEntidadesHijasComun($params['identidadlogueada']);
        $var = implode(',', $entidades);
        //obtener todas las entidades que son organos demandantes de las seleccionadas
        $identidadesOd = DatEntidaddatosnomenclador::getEntidadesOrganosDemandantesDadoArr($var);

        $identidades = implode(',', $identidadesOd);
        //buscar de los organos demandantes cuales tienen asociado el modelo
        $identidadesAsocAlModelo = DatEntidadmodelo::getEntidadesAsocModelo($identidades, $params['idmodelo']);

        foreach ($identidadesAsocAlModelo as $key => $value) {
            $data[$key]['idestructura'] = $value;
            $datosEntidad = $integrator->metadatos->DameEstructura($value);
            $data[$key]['denominacion'] = $datosEntidad[0]->denominacion;
        }
        return $data;
    }

}

//fin clase DatEntidaddatosnomencladorModel
