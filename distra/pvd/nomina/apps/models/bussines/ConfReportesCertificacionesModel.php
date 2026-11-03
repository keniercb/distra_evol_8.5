<?php

class ConfReportesCertificacionesModel extends ZendExt_Model
{

    public function ConfReportesCertificacionesModel()
    {
        parent::ZendExt_Model();
    }

    /**
     * Obtener todos los tipos de reportes y certificaciones.
     *
     * @return array Listado de tipos de reportes y certificaciones.
     */
    public function obtenerArregloTiposReportes()
    {

        //Retornando el listado de tipos de reportes.
        return ConfReportesCertificaciones::obtenerTodosTiposReportesCertificaciones();
    }

    public function adicionarConfReportesCertificaciones($arregloDatos)
    {

        $obj = new ConfReportesCertificaciones();
        if (!$obj->findByIdOrDenom($arregloDatos['denominacion'])) {
            $obj->denominacion = $arregloDatos['denominacion'];
            $obj->nivel = $arregloDatos['nivel'];
            $obj->obligatorioprocesarlo = $arregloDatos['obligatorioprocesarlo'];
            $obj->aprobacionelementos = $arregloDatos['aprobacionelementos'];
            $obj->aplicaren = $arregloDatos['aplicaren'];
            $obj->deresultados = $arregloDatos['deresultados'];
            $obj->comportamientoreportesc4 = $arregloDatos['comportamientoreportesc4'];
            $obj->mesessnc = (is_numeric($arregloDatos['meses']))?$arregloDatos['meses']:null;
            $obj->tiposeleccionpersonas = (is_numeric($arregloDatos['tiposeleccionpersonas']))?$arregloDatos['tiposeleccionpersonas']:null;

            $obj->save();
            return 1;
        } else {
            return 0;
        }


    }

    public function modificarConfReportesCertificaciones($id, $arregloDatos)
    {

        $obj = Doctrine::getTable('ConfReportesCertificaciones')->find($id);
        if (!$obj->findByIdOrDenom($arregloDatos['denominacion'], $id)) {
            $obj->denominacion = $arregloDatos['denominacion'];
            $obj->nivel = $arregloDatos['nivel'];
            $obj->obligatorioprocesarlo = $arregloDatos['obligatorioprocesarlo'];
            $obj->aprobacionelementos = $arregloDatos['aprobacionelementos'];
            $obj->aplicaren = $arregloDatos['aplicaren'];
            $obj->deresultados = $arregloDatos['deresultados'];
            $obj->comportamientoreportesc4 = $arregloDatos['comportamientoreportesc4'];
            $obj->mesessnc = (is_numeric($arregloDatos['meses']))?$arregloDatos['meses']:null;
            $obj->tiposeleccionpersonas = (is_numeric($arregloDatos['tiposeleccionpersonas']))?$arregloDatos['tiposeleccionpersonas']:null;

            $obj->save();
            return 1;
        } else {
            return 0;
        }
    }

    public function eliminarConfReportesCertificaciones($id)
    {

        /* $obj = Doctrine::getTable('ConfReportesCertificaciones')->find($id);

         $obj->delete();*/
        try {
            $r->cantRowAfected = Doctrine_Query::create()
                ->delete()
                ->from('ConfReportesCertificaciones')
                ->where('idconfreportescertificaciones = ?', $id)
                ->execute();
            return $r;
        } catch (Exception $e) {
            if ($e->getCode() == 23503) { //Code for foreignKeyViolation
                return 2;
            } else {
                return 1;
            }
        }
    }

    public function obtenerTodosTiposReportesCertificacionesConVariables()
    {
        return ConfReportesCertificaciones::obtenerTodosTiposReportesCertificacionesConVariables(0, 1000);
    }

}