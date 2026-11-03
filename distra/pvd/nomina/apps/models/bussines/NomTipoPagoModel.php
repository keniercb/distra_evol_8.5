<?php

/**
 * Modelo de negocio para gestionar los tipos de pago.
 *
 * @author Tte. Darien Cabrera O.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Modelo de negocio
 * @uses NomTipoPago, Entidad tipo de pago (Clase del dominio).
 * @copyright UCID
 * @version 1.0
 */
class NomTipoPagoModel extends ZendExt_Model
{

    /**
     * Constructor de la clase.
     */
    public function NomTipoPagoModel()
    {
        parent::ZendExt_Model();
    }

    /**
     * Obtener un listado de los datos de los tipos de pago.
     *
     * @param int $inicio Inicio de la busqueda.
     * @param int $limite Limite maximo de la busqueda.
     * @return array Listado de tipos de pago.
     */
    public function obtenerListadoTiposPago($inicio = 0, $limite = 1000)
    {

        //Retornando el listado de tipos de pago.
        return NomTipoPago::obtenerListadoTiposPago($inicio, $limite);
    }

    /**
     * Obtener la cantidad total de tipos de pago.
     *
     * @return int Cantidad total de tipos de pago.
     */
    public function obtenerCantidadTotalTiposPago()
    {

        //Retornando la cantidad total de tipos de pago.
        return NomTipoPago::obtenerCantidadTotalTiposPago();
    }

    /**
     * Obtener un listado de los datos de todos los tipos de pago.
     *
     * @return array Listado de tipos de pago.
     */
    public function obtenerTodosTiposPago()
    {

        //Retornando el listado de tipos de pago.
        return NomTipoPago::obtenerTodosTiposPago();
    }

    /**
     * Insertar un tipo de pago.
     *
     * @param string $denom Denominacion del tipo de pago.
     * @param string $finicio Fecha de inicio de creacion del tipo de pago.
     * @param string $ffin Fecha de fin de uso del tipo de pago.
     * @param string $descrip Descripcion del tipo de pago.
     */
    public function adicionarTipoPago($denom, $sedesglosa, $modopago, $modoseleccionPersonas, $finicio, $ffin, $descrip, $idconfreportescertificaciones, $pagoxresultadosdestajo, $orden, $mismomes)
    {
        if (!NomTipoPago::findByIdOrDenom($denom)) {

            //Se crea el objeto del tipo de pago.
            $objTipoPago = new NomTipoPago();

            //Insertando los datos del tipo de pago.
            $objTipoPago->denominacion = $denom;
            $objTipoPago->sedesglosa = $sedesglosa;
            $objTipoPago->modopago = $modopago;
            $objTipoPago->modoseleccionpersonas = $modoseleccionPersonas;
            $fecha = split('/', $finicio);
            $objTipoPago->fechainicio = ($finicio) ? $fecha[2] . '/' . $fecha[1] . '/' . $fecha[0] : null;
            $fecha = split('/', $ffin);
            $objTipoPago->fechafin = ($ffin) ? $fecha[2] . '/' . $fecha[1] . '/' . $fecha[0] : null;
            $objTipoPago->descripcion = (!empty($descrip)) ? $descrip : null;
            $objTipoPago->pagoxresultadosdestajo = $pagoxresultadosdestajo;
            $objTipoPago->orden = $orden;
            $objTipoPago->mismomes = $mismomes;

            if ($idconfreportescertificaciones) {
                $objTipoPago->idconfreportescertificaciones = $idconfreportescertificaciones;
            }
            //Guardando los datos.
            $objTipoPago->save();
            return 2;
        } else {
            return 3;
        }
    }

    /**
     * Modificar un tipo de pago.
     *
     * @param int $idtipopago Identificador del tipo de pago.
     * @param string $denom Denominacion del tipo de pago.
     * @param string $finicio Fecha de inicio de creacion del tipo de pago.
     * @param string $ffin Fecha de fin de uso del tipo de pago.
     * @param string $descrip Descripcion del tipo de pago.
     */
    public function modificarTipoPago($idtipopago, $denom, $sedesglosa, $modopago, $modoseleccionPersonas, $finicio, $ffin, $descrip, $idconfreportescertificaciones, $pagoxresultadosdestajo, $orden, $mismomes)
    {


        try {
            if (!NomTipoPago::findByIdOrDenom($denom, $idtipopago)) {

                //Obteniendo el tipo de pago a modificar.
                $objTipoPago = NomTipoPago::obtenerObjTipoPagoDadoId($idtipopago);

                //Modificando los datos del tipo de pago.
                $objTipoPago->denominacion = $denom;
                $objTipoPago->sedesglosa = (!empty($sedesglosa)) ? $sedesglosa : $objTipoPago->sedesglosa;
                $objTipoPago->modopago = (!empty($modopago)) ? $modopago : $objTipoPago->modopago;
                $objTipoPago->modoseleccionpersonas = (!empty($modoseleccionPersonas)) ? $modoseleccionPersonas : $objTipoPago->modoseleccionpersonas;
                $objTipoPago->pagoxresultadosdestajo = (!empty($pagoxresultadosdestajo)) ? $pagoxresultadosdestajo : $objTipoPago->pagoxresultadosdestajo;
                $fecha = split('/', $finicio);
                $objTipoPago->fechainicio = ($finicio) ? $fecha[2] . '/' . $fecha[1] . '/' . $fecha[0] : null;
                $fecha = split('/', $ffin);
                $objTipoPago->fechafin = ($ffin) ? $fecha[2] . '/' . $fecha[1] . '/' . $fecha[0] : null;
                $objTipoPago->descripcion = $descrip;
                // Actualizar idconfreportescertificaciones sólo si viene por parámetro (no vacío)
                if (isset($idconfreportescertificaciones) && $idconfreportescertificaciones !== '') {
                    $objTipoPago->idconfreportescertificaciones = $idconfreportescertificaciones;
                }
                $objTipoPago->orden = $orden;
                $objTipoPago->mismomes = $mismomes;

                //Guardando los datos.
                $objTipoPago->save();
                return 2;
            } else {
                return 3;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * Eliminar un tipo de pago.
     *
     * @param int $idtipopago Identificador del tipo de pago.
     */
    public function eliminarTipoPago($idtipopago)
    {

        try {
            $r->cantRowAfected = Doctrine_Query::create()
                ->delete()
                ->from('NomTipoPago')
                ->where('idtipopago = ?', $idtipopago)
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

    public function obtenerOrdenDisponible()
    {
        return NomTipoPago::obtenerOrdenDisponible();
    }

    //Exportar nomenclador
    public function fnExportarNomenclador($arr)
    {
        $obj = new DatNominaModel();
        $objPHPExcel = new PHPExcel();

        $fila = 1;
        $columna = 1;
        $objPHPExcel->getActiveSheet()->mergeCells('A1:G1');
        $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, 'Tipos de pago', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $fila++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'A', $fila, 'Denominación', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $columna++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(40);
        $obj->fnPintarCelda($objPHPExcel, 'B', $fila, 'Modo de selección de la persona', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $columna++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(50);
        $obj->fnPintarCelda($objPHPExcel, 'C', $fila, 'Reporte', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $columna++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'D', $fila, 'Fecha inicio', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $columna++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('E')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'E', $fila, 'Fecha fin', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $columna++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('F')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'F', $fila, 'Orden', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $columna++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('G')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'G', $fila, 'Dependencias', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $fila++;

        foreach ($arr as $val) {
            $modosel = ($val['modoseleccionpersonas'] == 1) ? 'Elaborar pagos' :
                (($val['modoseleccionpersonas'] == 2) ? 'Específicas' : 'Específicas reporte');
            $columna = 1;
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $val['denominacion'], null, '000000', 'Arial', 10, '000000', 'left', 'center', 0, 0);
            $columna++;
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $modosel, null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
            $columna++;
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $val['reporte'], null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
            $columna++;
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $val['fechainicio'], null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
            $columna++;
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $val['fechafin'], null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
            $columna++;
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $val['orden'], null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
            $columna++;

            $dependencias = '';
            if (!empty($val['dependencias'])) {
                foreach ($val['dependencias'] as $dep) {
                    $dependencias .= $dep['dependencia'] . '; ';
                }
                $dependencias = trim($dependencias, '; ');
            }
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $dependencias, null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
            $fila++;
        }

        //TERMINACION DEL EXCEL*********************************************************
        $objPHPExcel->setActiveSheetIndex(0);
        ob_end_clean();
        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment;filename="Nomenclador.xls" ');
        header('Cache-Control: max-age=0');
        header('Pragma: no-cache');
        header('Expires: 0');

        //$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        ob_end_clean();
        echo($objWriter->save('php://output'));
        $objPHPExcel->disconnectWorksheets();
        unset($objPHPExcel);
        return 1;
    }
}
