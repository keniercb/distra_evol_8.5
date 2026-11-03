<?php

class DatVariablesElementosReportesCertificacionesModel extends ZendExt_Model
{

    public function DatVariablesElementosReportesCertificacionesModel ()
    {
        parent::ZendExt_Model();
    }

    public function adicionarVariablesElementosReportesCertificaciones ($arregloElementos, $arregloObjVariables)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $conn->beginTransaction();
        $pos = 0;
        $coleccionVariablesElementos = new Doctrine_Collection('DatVariablesElementosReportesCertificaciones');
        foreach($arregloElementos as $k => $e) {
            foreach($arregloObjVariables as $i => $v) {
                $coleccionVariablesElementos[$pos]->idelementosreportescertificaciones = $e;
                $coleccionVariablesElementos[$pos]->idvariablesconfreportescertificaciones = $v->idvariable;
                $coleccionVariablesElementos[$pos]->valor = null;
                $pos++;
            }
        }
        $coleccionVariablesElementos->save();
        $conn->commit();
        return true;
    }

    public function modificarElementosReportesCertificaciones ($arregloElementos, $arregloVariables, $idtipoconfreportescertificaciones = null, $idreportescertificaciones = null)
    {
        $objDatVariablesElementosReportesCertificaciones = new DatVariablesElementosReportesCertificaciones();
        foreach($arregloElementos as $k => $e) {
            $idelementosreportescertificaciones = $e->idelementosreportescertificaciones;
            foreach($arregloVariables as $i => $v) {
                //Buscando si existe
                $existe = $objDatVariablesElementosReportesCertificaciones->existeDatVariablesElementosReportesCertificaciones($idelementosreportescertificaciones, $v);
                //Modificando en DatVariables por cada IdElemento
                if($existe == 1){
                    $idvariableselementosreportescertificaciones = $objDatVariablesElementosReportesCertificaciones->obtenerIdDatVariablesElementosReportesCertificaciones($idelementosreportescertificaciones, $v);
                    $objDatVariablesElementosReportesCertificacionesUpdate = $objDatVariablesElementosReportesCertificaciones->getByid($idvariableselementosreportescertificaciones);
                    $objDatVariablesElementosReportesCertificacionesUpdate->valor = ($e->$v != "" || $e->$v != null) ? $e->$v : 0;
                    $objDatVariablesElementosReportesCertificacionesUpdate->save();
                }
                //Insertando en DatVariables por cada IdElemento
                else{
                    $coleccionVariablesElementos = new DatVariablesElementosReportesCertificaciones();
                    $coleccionVariablesElementos->idelementosreportescertificaciones = $e->idelementosreportescertificaciones;
                    $coleccionVariablesElementos->idvariablesconfreportescertificaciones = $v;
                    $coleccionVariablesElementos->valor = ($e->$v != "" || $e->$v != null) ? $e->$v : 0;
                    $coleccionVariablesElementos->save();
                }


            }
        }
        return true;
    }

    public function eliminarElementosReportesCertificaciones ($id)
    {

        $obj = Doctrine::getTable('DatReportesCertificaciones')->find($id);

        $obj->delete();
    }

    public function setVariablesvalor ($arrayPersonasElementos)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $conn->beginTransaction();
        foreach($arrayPersonasElementos as $k => $v) {
            $arrVariable = DatVariablesElementosReportesCertificaciones::obtenerIdVariablesElementosReportesCertificaciones($v['idelementosreportescertificaciones']);
            $antiguedad = $v['annos'];
            if(!empty($antiguedad)){
                $sql = "UPDATE mod_nomina.dat_variableselementosreportescertificaciones SET valor = {$antiguedad}
                    WHERE idvariableselementosreportescertificaciones = {$arrVariable[0]['idvariableselementosreportescertificaciones']};";
                $conn->execute($sql);
            }
        }
        $conn->commit();
        return true;
    }


}