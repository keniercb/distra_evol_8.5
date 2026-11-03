<?php

class ConfVariablesReportesCertificacionesModel extends ZendExt_Model
{

    public function ConfVariablesReportesCertificacionesModel()
    {
        parent::ZendExt_Model();
    }

    /**
     * Obtener las variables dado un id de tipo de reporte o certificaci�n.
     *
     * @param numeric $idreporte Identificador del tipo de reporte o certificaci�n.
     *
     * @return array Listado de variables de tipos de reporte o certificaci�n.
     */
    public function obtenerVariablesDadoIdReporte($idreporte)
    {

        //Retornando el listado de variables de tipos de reporte o certificaci�n.
        return ConfVariablesReportesCertificaciones::obtenerVariablesReportesCertificacionesByIdReporte($idreporte);
    }

    public function obtenerVariables()
    {

        //Retornando el listado de variables de tipos de reporte o certificaci�n.
        return ConfVariablesReportesCertificaciones::obtenerVariables();
    }

    public function adicionarConfVariablesReportesCertificaciones($arregloDatos)
    {

        $obj = new ConfVariablesReportesCertificaciones();

        if (!$obj->findByIdOrDenom($arregloDatos['denominacion'], $arregloDatos['idconfreportescertificaciones'])) {
            $obj->denominacion = $arregloDatos['denominacion'];
            $obj->tipovalor = $arregloDatos['tipovalor'];
            $obj->idnomencladorreferencia = ($arregloDatos['idnomencladorreferencia'] == -1 ? null : $arregloDatos['idnomencladorreferencia']);
            $obj->nivelaplicarvalor = $arregloDatos['nivelaplicarvalor'];
            $obj->idconfreportescertificaciones = $arregloDatos['idconfreportescertificaciones'];
            $obj->lugaresdecimales = $arregloDatos['lugaresdecimales'];
            $obj->min = $arregloDatos['min'];
            $obj->max = $arregloDatos['max'];
            $obj->orden = $arregloDatos['orden'];
            $obj->calculable = ($arregloDatos['calculable'])?$arregloDatos['calculable']:null;
            $obj->idexpresionmatematica = ($arregloDatos['idexpresionmatematica'] != -1)?$arregloDatos['idexpresionmatematica']:null;
            $obj->descripcion = $arregloDatos['descripcion'];
            $obj->calculablehistoriconominasreportes = ($arregloDatos['calculablehistoriconominasreportes'])?$arregloDatos['calculablehistoriconominasreportes']:null;
            $obj->idexpresionmatematicahistoriconominasreportes = ($arregloDatos['idexpresionmatematicanominasreportes'] != -1)?$arregloDatos['idexpresionmatematicanominasreportes']:null;
            $obj->tiposnomina = $arregloDatos['tiposnomina'];
            $obj->idvariablesconfreportescertificacionesreportesanteriores = $arregloDatos['idvariablesconfreportescertificacionesreportesanteriores'];
            $obj->idvariablesconfreportescertiicacionesmesinicial = $arregloDatos['idvariablesconfreportescertiicacionesmesinicial'];
            $obj->save();
            return 1;
        } else {
            return 0;
        }

    }

    public function modificarConfVariablesReportesCertificaciones($id, $arregloDatos)
    {
        $obj1 = new ConfVariablesReportesCertificaciones();
        $obj = Doctrine::getTable('ConfVariablesReportesCertificaciones')->find($id);

        if (!$obj1->findByIdOrDenom($arregloDatos['denominacion'], $arregloDatos['idconfreportescertificaciones'], $id)) {
            $obj->denominacion = $arregloDatos['denominacion'];
            $obj->tipovalor = $arregloDatos['tipovalor'];
            $obj->idnomencladorreferencia = ($arregloDatos['idnomencladorreferencia'] == -1 ? null : $arregloDatos['idnomencladorreferencia']);
            $obj->nivelaplicarvalor = $arregloDatos['nivelaplicarvalor'];
            $obj->idconfreportescertificaciones = $arregloDatos['idconfreportescertificaciones'];
            $obj->lugaresdecimales = $arregloDatos['lugaresdecimales'];
            $obj->min = $arregloDatos['min'];
            $obj->max = $arregloDatos['max'];
            $obj->orden = $arregloDatos['orden'];
            $obj->tiposnomina = $arregloDatos['tiposnomina'];
            $obj->idvariablesconfreportescertificacionesreportesanteriores = $arregloDatos['idvariablesconfreportescertificacionesreportesanteriores'];
            $obj->idvariablesconfreportescertiicacionesmesinicial = $arregloDatos['idvariablesconfreportescertiicacionesmesinicial'];
            $obj->calculable = ($arregloDatos['calculable'])?$arregloDatos['calculable']:null;
            if($arregloDatos['calculable'] == 1 && $arregloDatos['idexpresionmatematica']){
                $obj->idexpresionmatematica = ($arregloDatos['idexpresionmatematica'])?$arregloDatos['idexpresionmatematica']:null;
            }else{
                $obj->idexpresionmatematica = null;
            }
            $obj->descripcion = $arregloDatos['descripcion'];
            $obj->calculablehistoriconominasreportes = ($arregloDatos['calculablehistoriconominasreportes'])?$arregloDatos['calculablehistoriconominasreportes']:null;
            if($arregloDatos['calculablehistoriconominasreportes'] == 1 && $arregloDatos['idexpresionmatematicanominasreportes']){
                $obj->idexpresionmatematicahistoriconominasreportes = ($arregloDatos['idexpresionmatematicanominasreportes'])?$arregloDatos['idexpresionmatematicanominasreportes']:$arregloDatos['idexpresionmatematicanominasreportes'];
            }else{
                $obj->idexpresionmatematicahistoriconominasreportes = null;
            }
            $obj->save();
            return 1;
        } else {
            return 0;
        }
    }

    public function eliminarConfVariablesReportesCertificaciones($id)
    {
        try {
            $obj = Doctrine::getTable('ConfVariablesReportesCertificaciones')->find($id);
            $obj->delete();
            return 1;
        } catch (Exception $e) {
            if ($e->getCode() == 23503) {//Code for foreignKeyViolation
                return 2;
            } else {
                return 3;
            }
        }

        $obj = Doctrine::getTable('ConfVariablesReportesCertificaciones')->find($id);

        $obj->delete();
    }

    public function obtenerDenominacionDadoIdVariablesCertificacion($idvariablesconfreportescertificaciones)
    {

        return ConfVariablesReportesCertificaciones::DevolverDenomDadoid($idvariablesconfreportescertificaciones);
    }

    public function adicionarFormulas($idvariablesconfreportescertificaciones, $idexpresionmatematica)
    {

        print_r($idvariablesconfreportescertificaciones);
        print_r("\n");
        print_r($idexpresionmatematica);               die;
        $obj = ConfVariablesReportesCertificaciones::getByid($idvariablesconfreportescertificaciones);
        $obj->expresionmatematica = $idexpresionmatematica;
        $obj->save();
        return 'ok';
    }

}