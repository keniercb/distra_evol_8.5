<?php
/**
 * Created by PhpStorm.
 * User: Ignacio Barrera Lópe
 * Date: 26/03/2018
 * Time: 11:19
 */

class DatFichacostoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function listarnaturaleza()
    {
        $naturalezas = DatFichacosto::listarnaturaleza();
        return $naturalezas;
    }

    public function listarnaturalezaficha($params)
    {
        $naturalezas = DatFichacosto::listarnaturalezaficha($params);
        return $naturalezas;
    }

    public function guardarConfiguracion($params)
    {
        $count = 0;


        foreach ($params['confnaturaleza'] as $item) {
            DatFichacosto::guardarConfiguracionNaturaleza($item);
            $count++;
        }
        return $count;

    }

    public function listarfichacosto($params)
    {
        $ficha = DatFichacosto::listarfichacosto($params);
        return $ficha;
    }

    public function addnaturalezaficha($params)
    {
        $count = 0;
        foreach ($params['naturalezas'] as $item) {
            $ficha = new DatFichacosto();
            $ficha->idnaturaleza = $item->idnaturaleza;
            $ficha->save();
            $count++;
        }
        return $count;
    }

    public function eliminarrelacionficha($params)
    {

        $eliminados = 0;
        if ($params['relaciones'] != null) {
            $idfichacosto_array = array();
            foreach ($params['relaciones'] as $item) {
                $idfichacosto_array[] = $item->idfichacosto;
                $eliminados++;
            }
            $idfichacosto_lista = implode(',', $idfichacosto_array);
            $res = DatFichacosto::eliminarrelacionficha($idfichacosto_lista);
        }
        return $res;
    }

    public function listarautorficha($params)
    {
        $autorFicha = DatDatosautorficha::listarautorficha($params);
        return $autorFicha;
    }

    public function guardarconfautor($params)
    {
        $res = null;
        if ($params['iddatosautorficha']) {
            $datosautorficha = Doctrine::getTable('DatDatosautorficha')->findByDql(
                "iddatosautorficha = {$params['iddatosautorficha']}"
            );
            $datosautorficha[0]->empresasubordinada = $params['subordinada'];
            $datosautorficha[0]->confeccionada = $params['confeccionado'];
            $datosautorficha[0]->cargoconf = $params['cargoConfeccionado'];
            $datosautorficha[0]->telefonoconf = $params['telefonoConfeccionado'];
            $datosautorficha[0]->aprobada = $params['aprobado'];
            $datosautorficha[0]->cargoaprob = $params['cargoAprobado'];
            $datosautorficha[0]->telefonoaprob = $params['telefonoAprobado'];
            $datosautorficha[0]->save();
            $res = "update";
        } else {
            $datAutor = new DatDatosautorficha();
            $datAutor->empresasubordinada = $params['subordinada'];
            $datAutor->confeccionada = $params['confeccionado'];
            $datAutor->cargoconf = $params['cargoConfeccionado'];
            $datAutor->telefonoconf = $params['telefonoConfeccionado'];
            $datAutor->aprobada = $params['aprobado'];
            $datAutor->cargoaprob = $params['cargoAprobado'];
            $datAutor->telefonoaprob = $params['telefonoAprobado'];
            $datAutor->save();
            $res = "add";
        }


        return $res;
    }

    public function eliminarconfautor($params)
    {

        $eliminados = 0;
        if ($params['datosautorficha'] != null) {
            $datosautorficha_array = array();
            foreach ($params['datosautorficha'] as $item) {
                $datosautorficha_array[] = $item->iddatosautorficha;
                $eliminados++;
            }
            $datosautorficha_lista = implode(',', $datosautorficha_array);
            $res = DatDatosautorficha::eliminarconfautor($datosautorficha_lista);
        }
        return $res;
    }
}