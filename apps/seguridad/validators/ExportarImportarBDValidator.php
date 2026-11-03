<?php

/**
 * Created by PhpStorm.
 * User: lianet
 * Date: 4/7/2018
 * Time: 16:04
 */
class ExportarImportarBDValidator
{

    public function validarSuperUsuarioBD()
    {
        DatBdModel::validarSuperUsuarioBD();
        return true;
    }

    public function validarCrearBDUsuarioBD()
    {
        DatBdModel::validarCrearBDUsuarioBD();
        return true;
    }

}