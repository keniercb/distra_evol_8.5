<?php

class NomDatosnomencladorModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function Insertar(NomDatosnomenclador $NomDatosnomenclador) {
        $NomDatosnomenclador->save();
    }

    public function Actualizar(NomDatosnomenclador $NomDatosnomenclador) {
        $NomDatosnomenclador->save();
    }

    public function Eliminar($NomDatosnomenclador) {
        if ($NomDatosnomenclador) {

            try {
                $NomDatosnomenclador[0]->delete();
                return 1;
            } catch (Doctrine_Exception $e) {
                if ($e->getCode() == '23503') {
                    return $e->getCode();
                }
            }
        } else {
            return 3;
        }
    }

    public function getDatosNomDadoIdTipoNom($idtn) {
        return NomDatosnomenclador::getDatosNomPorIdTipoNom($idtn);
    }

    public function ObtenerDatosDadoIdDatosNom($ids) {
        return NomDatosnomenclador::ObtenerDatosDadoIdDatosNom($ids);
    }

    public function listarDatosNomencladorDadoDenomTipoComp($denomtipo) {
        $tipocomp = NomTiponomenclador::NomTiponomenclador($denomtipo);
        $tiponomasociado = DatTipocomponentetiponomencladorModel::getAsocPorTipoComp(
                        $tipocomp[0]['idtipocomponente']
        );
        return NomDatosnomencladorModel::getDatosNomDadoIdTipoNom(
                        $tiponomasociado[0]['idtiponomenclador']
        );
    }

    public function listarSR() {
        return NomDatosnomenclador::ObtenerDatosNomenclador(5);
    }

    public function listarDestinos() {
        return NomDatosnomenclador::ObtenerDatosNomenclador(4);
    }

    public function listarOACE() {
        return NomDatosnomenclador::ObtenerDatosNomenclador(6);
    }

    public function obtenerDatosNomencladorByDenominacion($denominacion) {
        return NomDatosnomenclador::obtenerDatosNomencladorByDenominacion(
                        $denominacion
        );
    }

    public function reutilizarNomenclador($idreal, $idreutilizar) {
        $datosdatosnom = new DatDatosnomencladordatosnomenclador();
        $datonom = new NomDatosnomenclador();
        $hijos = $datosdatosnom->obtenerHijosById($idreutilizar);
        $cantdescidreal = $datonom->obtenerCantdescendenteById($idreal);
        $cantupdatedesc = $cantdescidreal[0]['cantdescendente'] + count($hijos);
        $datonom->updateCantdescendente($cantupdatedesc, $idreal);
        $idpadre = $datosdatosnom->obtenerIdPadre($idreutilizar);
        if (!$idpadre) {
            $datosdatosnom->iddatosnomencladorpadre = $idreal;
            $datosdatosnom->iddatosnomencladorhijo = $idreutilizar;
            $datosdatosnom->save();
        }
        $cantdescidreutilizar = $datonom->obtenerCantdescendenteById(
                $idpadre[0]['iddatosnomencladorpadre']
        );
        if (count($hijos) == 0) {
            $cantupdateDesc = $cantdescidreutilizar[0]['cantdescendente'] - 1;
        } else {
            $cantupdateDesc = $cantdescidreutilizar[0]['cantdescendente'] - count($hijos);
        }
        $datonom->updateCantdescendente(
                $cantupdateDesc, $idpadre[0]['iddatosnomencladorpadre']
        );
        $datosdatosnom->reutilizar($idreal, $idreutilizar);
    }


}

//fin clase
