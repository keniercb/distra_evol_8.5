<?php

class DatReportesCertificacionesModel extends ZendExt_Model
{

    public function DatReportesCertificacionesModel()
    {
        parent::ZendExt_Model();
    }

    public function adicionarReportesCertificaciones($arregloDatos)
    {

        $obj = new DatReportesCertificaciones();

        $obj->idconfreportescertificaciones = $arregloDatos['idconfreportescertificaciones'];
        $obj->fechainicio = $arregloDatos['fechainicio'];
        $obj->fechafin = $arregloDatos['fechafin'];
        $obj->estado = $arregloDatos['estado'];
        $obj->identidad = $arregloDatos['identidad'];
        $obj->idusuario = $arregloDatos['idusuario'];

        $obj->save();
        $idreportescertificaciones = $obj->idreportescertificaciones;
        return $idreportescertificaciones;
    }

    public function modificarReportesCertificaciones($id, $arregloDatos)
    {

        $obj = Doctrine::getTable('DatReportesCertificaciones')->find($id);

        $obj->idconfreportescertificaciones = $arregloDatos['idconfreportescertificaciones'];
        $obj->fechainicio = $arregloDatos['fechainicio'];
        $obj->fechafin = $arregloDatos['fechafin'];
        $obj->estado = $arregloDatos['estado'];
        $obj->identidad = $arregloDatos['identidad'];

        $obj->save();
    }

    public function cambiarEstadoReportesCertificaciones($id, $estado, $datos = null)
    {

        $obj = Doctrine::getTable('DatReportesCertificaciones')->find($id);
        $obj->estado = $estado;
        $obj->datos = serialize($datos);
        $obj->save();
    }

    public function eliminarReportesCertificaciones($id, $estado)
    {
        $objDatElementosReportesCertificaciones = new DatElementosReportesCertificaciones();
        $objDatVariablesElementosReportesCertificaciones = new DatVariablesElementosReportesCertificaciones();
        if ($estado == 1) {
            $obj = Doctrine::getTable('DatReportesCertificaciones')->find($id);
            $obj->delete();
        } else if ($estado == 2) {
            $arridelementos = $objDatElementosReportesCertificaciones->obtenerIdElementosReportesCertificacionesXIdReporte($id);
            foreach ($arridelementos as $contelem => $idelemento) {
                $arrvariableselementoreporte = $objDatVariablesElementosReportesCertificaciones->obtenerIdVariablesElementosReportesCertificaciones($idelemento['idelementosreportescertificaciones']);
                foreach ($arrvariableselementoreporte as $count => $variable){
                    $objVariableDelete = Doctrine::getTable('DatVariablesElementosReportesCertificaciones')->find($variable['idvariableselementosreportescertificaciones']);
                    $objVariableDelete->delete();
                }
                $objElementoDelete = Doctrine::getTable('DatElementosReportesCertificaciones')->find($idelemento['idelementosreportescertificaciones']);
                $objElementoDelete->delete();
            }
            $obj = Doctrine::getTable('DatReportesCertificaciones')->find($id);
            $obj->delete();
        } else {
            $objHisReportesCertificaciones = new HisReportesCertificaciones();
            $objReportesCertificaciones = Doctrine::getTable('DatReportesCertificaciones')->find($id);

            $objHisReportesCertificaciones->idconfreportescertificaciones = $objReportesCertificaciones->idconfreportescertificaciones;
            $objHisReportesCertificaciones->fechainicio = $objReportesCertificaciones->fechainicio;
            $objHisReportesCertificaciones->fechafin = $objReportesCertificaciones->fechafin;
            $objHisReportesCertificaciones->estado = $objReportesCertificaciones->estado;
            $objHisReportesCertificaciones->identidad = $objReportesCertificaciones->identidad;
            $objHisReportesCertificaciones->idusuario = $objReportesCertificaciones->idusuario;
            $objHisReportesCertificaciones->save();

            $arridelementos = $objDatElementosReportesCertificaciones->obtenerIdElementosReportesCertificacionesXIdReporte($id);
            foreach ($arridelementos as $contelem => $idelemento) {
                $arrvariableselementoreporte = $objDatVariablesElementosReportesCertificaciones->obtenerIdVariablesElementosReportesCertificaciones($idelemento['idelementosreportescertificaciones']);
                $objElementoDelete = Doctrine::getTable('DatElementosReportesCertificaciones')->find($idelemento['idelementosreportescertificaciones']);
                $objElementoHisSave = new HisElementosReportesCertificaciones();
                $objElementoHisSave->idreportescertificaciones = $objHisReportesCertificaciones->idreportecertificacion;
                $objElementoHisSave->idelemento = $objElementoDelete->idelemento;
                $objElementoHisSave->aprobado = $objElementoDelete->aprobado;
                $objElementoHisSave->save();
                foreach ($arrvariableselementoreporte as $count => $variable) {
                    $objVariableDelete = Doctrine::getTable('DatVariablesElementosReportesCertificaciones')->find($variable['idvariableselementosreportescertificaciones']);
                    $objHisVariableSave = new HisVariablesElementosReportesCertificaciones();
                    $objHisVariableSave->idelementosreportescertificaciones = $objElementoHisSave->idhiselementosreportescertificaciones;
                    $objHisVariableSave->idvariablesconfreportescertificaciones = $objVariableDelete->idvariablesconfreportescertificaciones;
                    $objHisVariableSave->valor = $objVariableDelete->valor;
                    $objHisVariableSave->save();
                    $objVariableDelete->delete();
                }

                $objElementoDelete->delete();
            }
            $obj = Doctrine::getTable('DatReportesCertificaciones')->find($id);
            $obj->delete();

            $objReportesCertificaciones->delete();
        }
    }

    public function activarReporteEliminado($id)
    {
        $objHisElementosReportesCertificaciones = new HisElementosReportesCertificaciones();
        $objHisVariablesElementosReportesCertificaciones = new HisVariablesElementosReportesCertificaciones();

        $objReportesCertificaciones = new DatReportesCertificaciones();
        $objHisReportesCertificaciones = Doctrine::getTable('HisReportesCertificaciones')->find($id);

        $objReportesCertificaciones->idconfreportescertificaciones = $objHisReportesCertificaciones->idconfreportescertificaciones;
        $objReportesCertificaciones->fechainicio = $objHisReportesCertificaciones->fechainicio;
        $objReportesCertificaciones->fechafin = $objHisReportesCertificaciones->fechafin;
        $objReportesCertificaciones->estado = $objHisReportesCertificaciones->estado;
        $objReportesCertificaciones->identidad = $objHisReportesCertificaciones->identidad;
        $objReportesCertificaciones->idusuario = $objHisReportesCertificaciones->idusuario;
        $objReportesCertificaciones->save();

        $arridelementos = $objHisElementosReportesCertificaciones->obteneridhiselementosreportescertificacionesXIdReporte($id);
        foreach ($arridelementos as $contelem => $idelemento) {
            $arrvariableselementoreporte = $objHisVariablesElementosReportesCertificaciones->obtenerIdVariablesElementosReportesCertificaciones($idelemento['idhiselementosreportescertificaciones']);
            $objElementoDelete = Doctrine::getTable('HisElementosReportesCertificaciones')->find($idelemento['idhiselementosreportescertificaciones']);

            $objElementoSave = new DatElementosReportesCertificaciones();
            $objElementoSave->idreportescertificaciones = $objReportesCertificaciones->idreportescertificaciones;
            $objElementoSave->idelemento = $objElementoDelete->idelemento;
            $objElementoSave->aprobado = $objElementoDelete->aprobado;
            $objElementoSave->save();
            foreach ($arrvariableselementoreporte as $count => $variable) {
                $objVariableDelete = Doctrine::getTable('HisVariablesElementosReportesCertificaciones')->find($variable['idhisvariableselementosreportescertificaciones']);
                $objVariableSave = new DatVariablesElementosReportesCertificaciones();
                $objVariableSave->idelementosreportescertificaciones = $objElementoSave->idelementosreportescertificaciones;
                $objVariableSave->idvariablesconfreportescertificaciones = $objVariableDelete->idvariablesconfreportescertificaciones;
                $objVariableSave->valor = $objVariableDelete->valor;
                //print_r($objVariableSave);die;
                $objVariableSave->save();
                $objVariableDelete->delete();
            }

            $objElementoDelete->delete();
        }
        $obj = Doctrine::getTable('HisReportesCertificaciones')->find($id);
        $obj->delete();

        $objHisReportesCertificaciones->delete();

    }

    public function getElementosReporte($identidad, $idreportescertificaciones)
    {
        $arrElempersona = DatElementosReportesCertificaciones::obtenerElementosReportesCertificacionesPersona($idreportescertificaciones, $identidad);
        $aux = array();
        foreach ($arrElempersona as $k => $v) {
            $aux[$v['idelemento']] = $v;
        }
        $arrElempersona = $aux;
        foreach ($arrElempersona as $k => $v) {
            //milena
            $certfAnnos = ConfCertificacionAnnoServic::obtenerAnnoservcyFechadadoidpersona($v['idelemento'], $identidad);
            $arrElempersona[$k]['annos'] = str_ireplace(',', '.', $certfAnnos[0]['antuguedad']);
            $arrElempersona[$k]['annosentidad'] = str_ireplace(',', '.', $certfAnnos[0]['annosserventidad']);
            $arrElempersona[$k]['reporteantiguedad'] = str_ireplace(',', '.', $certfAnnos[0]['reporteantiguedad']);
        }
        return $arrElempersona;
    }

    public function obtenerDatosReportePeriodoPago($idreportescertificaciones, $identidad/*, $fechainicio, $fechafin*/)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "select distinct(dep.idelaborarpagos),drc.idreportescertificaciones, drc.idconfreportescertificaciones,
            drc.fechainicio,drc.fechafin, dep.idperiodopago, dep.fechainicioperiodo, dep.fechafinperiodo, ntp.idtipopago
			from mod_nomina.dat_reportescertificaciones drc
		    inner join mod_nomina.nom_tipopago ntp on (ntp.idconfreportescertificaciones = drc.idconfreportescertificaciones and ntp.modoseleccionpersonas = 3)
			inner join mod_nomina.dat_elaborarpagos dep on (dep.idtipopago = ntp.idtipopago and dep.fechainicioperiodo = drc.fechainicio and  dep.fechafinperiodo = drc.fechafin)
			inner join mod_nomina.dat_nomina dn on (dn.idelaborarpago = dep.idelaborarpagos)
			where drc.idreportescertificaciones = ? and dep.identidad = ?  and dn.aprobada = 0;";
        return $conn->fetchAll($sql, array($idreportescertificaciones, $identidad));
    }

    public function duplicarReportesCertificaciones($arregloDatos)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $conn->beginTransaction();

        //Salvando en DatReportesCertificaciones
        $reporteold = DatReportesCertificaciones::obtenerObjReporteDadoId($arregloDatos['idreportescertificaciones']);
        $sql = "INSERT INTO mod_nomina.dat_reportescertificaciones(idconfreportescertificaciones, fechainicio, fechafin, estado, identidad, idusuario, descripcion)
                VALUES ({$reporteold->idconfreportescertificaciones}," . "'{$arregloDatos['fechainicio']}'" . "," . "'{$arregloDatos['fechafin']}'" . ",1,
                        {$reporteold->identidad},{$reporteold->idusuario}," . "'{$arregloDatos['descripcion']}'" . ") returning idreportescertificaciones;";
        $r = $conn->fetchAll($sql);
        $idreportescertificaciones = $r[0]['idreportescertificaciones'];

        //Salvando en DatElementosReportesCertificaciones
        $elemreporteold = DatElementosReportesCertificaciones::obtenerElementosReportesCertificaciones($arregloDatos['idreportescertificaciones']);
        if (!empty($elemreporteold)) {
            foreach ($elemreporteold as $elemento) {
                $sql = "INSERT INTO mod_nomina.dat_elementosreportescertificaciones(idreportescertificaciones, idelemento, aprobado)
                    VALUES ({$idreportescertificaciones}, {$elemento['idelemento']}, {$elemento['aprobado']}) returning idelementosreportescertificaciones;";
                $r = $conn->fetchAll($sql);
                $idelemento = $r[0]['idelementosreportescertificaciones'];

                //Salvando en DatVariablesElementosReportesCertificaciones
                $varreporteold = DatVariablesElementosReportesCertificaciones::obtenerVariablesXElementosReportesCertificaciones($elemento['idelementosreportescertificaciones']);
                if (!empty($varreporteold)) {
                    foreach ($varreporteold as $variable) {
                        $valor = (!empty($variable['valor'])) ? $variable['valor'] : 0;
                        $sql = "INSERT INTO mod_nomina.dat_variableselementosreportescertificaciones(idelementosreportescertificaciones, idvariablesconfreportescertificaciones, valor)  
                            VALUES ({$idelemento}, {$variable['idvariablesconfreportescertificaciones']}, {$valor});";
                        $conn->execute($sql);
                    }
                }
            }
        }
        $conn->commit();
    }
}