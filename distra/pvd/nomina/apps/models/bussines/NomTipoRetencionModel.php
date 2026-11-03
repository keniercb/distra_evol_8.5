<?php

/**
 * Modelo de negocio para gestionar los tipos de retenciones.
 *
 * @author Tte. Darien Cabrera O.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Modelo de negocio
 * @uses NomTipoRetencion, Entidad tipo de retencion (Clase del dominio).
 * @copyright UCID
 * @version 1.0
 */
class NomTipoRetencionModel extends ZendExt_Model
{

    /**
     * Constructor de la clase.
     */
    public function NomTipoRetencionModel()
    {
        parent::ZendExt_Model();
    }

    /**
     * Obtener un listado de los datos de los tipos de retenciones.
     *
     * @param int $inicio Inicio de la busqueda.
     * @param int $limite Limite maximo de la busqueda.
     * @return array Listado de tipos de retenciones.
     */
    public function obtenerListadoTiposRetencion($inicio = 0, $limite = 10)
    {

        //Retornando el listado de tipos de retenciones.
        return NomTipoRetencion::obtenerListadoTiposRetencion($inicio, $limite);
    }

    /**
     * Obtener la cantidad total de tipos de retenciones.
     *
     * @return int Cantidad total de tipos de retenciones.
     */
    public function obtenerCantidadTotalTiposRetencion()
    {

        //Retornando la cantidad total de tipos de retenciones.
        return NomTipoRetencion::obtenerCantidadTotalTiposRetencion();
    }

    /**
     * Insertar un tipo de retencion.
     *
     * @param string $abrev Abreviatura del tipo de retencion.
     * @param string $denom Denominacion del tipo de retencion.
     * @param int $saldolim Si la retencion tiene saldo limite.
     * @param string $finicio Fecha de inicio de creacion del tipo de retencion.
     * @param string $ffin Fecha de fin de uso del tipo de retencion.
     * @param string $descrip Descripciondel tipo de retencion.
     */
    public function adicionarTipoRetencion($abrev, $denom, $saldolim, $finicio, $ffin, $descrip, $cuentacontable, $orden, $tienelimitemaximo, $cobrosypagos)
    {


        try {
            if (!NomTipoRetencion::findByIdOrDenom($denom)
                && !NomTipoRetencion::existeAbreviatura($abrev)) {

                //Se crea el objeto del tipo de retencion.
                $objTRetencion = new NomTipoRetencion();

                //Insertando los datos del tipo de retencion.
                $objTRetencion->abreviatura = $abrev;
                $objTRetencion->denominacion = $denom;
                $objTRetencion->saldolimite = $saldolim;
                $fecha = split('/', $finicio);
                $objTRetencion->fechainicio = ($finicio) ? $fecha[2] . '/' . $fecha[1] . '/' . $fecha[0] : null;
                $fecha = split('/', $ffin);
                $objTRetencion->fechafin = ($ffin) ? $fecha[2] . '/' . $fecha[1] . '/' . $fecha[0] : null;
                $objTRetencion->descripcion = $descrip;
                $objTRetencion->cuentacontable = (is_numeric($cuentacontable)) ? $cuentacontable : null;
                $objTRetencion->cobrosypagos = (is_numeric($cobrosypagos)) ? $cobrosypagos : null;
                $objTRetencion->orden = $orden;
                $objTRetencion->tienelimitemaximo = $tienelimitemaximo;

                //Guardando los datos.
                $objTRetencion->save();

                return 2;
            } else {
                return 3;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * Modificar un tipo de retencion.
     *
     * @param int $idtreten Identificador del tipo de retencion.
     * @param string $abrev Abreviatura del tipo de retencion.
     * @param string $denom Denominacion del tipo de retencion.
     * @param int $saldolim Si la retencion tiene saldo limite.
     * @param string $finicio Fecha de inicio de creacion del tipo de retencion.
     * @param string $ffin Fecha de fin de uso del tipo de retencion.
     * @param string $descrip Descripcion del tipo de retencion.
     */
    public function modificarTipoRetencion($idtreten, $abrev, $denom, $saldolim, $finicio, $ffin, $descrip, $cuentacontable, $orden, $tienelimitemaximo, $cobrosypagos)
    {


        try {

            if (!NomTipoRetencion::findByIdOrDenom($denom, $idtreten)
                && !NomTipoRetencion::existeAbreviaturaTipoRetencion($abrev, $idtreten)) {

                //Obteniendo el tipo de retencion a modificar.
                $objTRetencion = NomTipoRetencion::obtenerObjTipoRetencionDadoId($idtreten);

                //Modificando los datos del tipo de retencion.
                $objTRetencion->abreviatura = $abrev;
                $objTRetencion->denominacion = $denom;
                $objTRetencion->saldolimite = $saldolim;
                $fecha = split('/', $finicio);
                $objTRetencion->fechainicio = ($finicio) ? $fecha[2] . '/' . $fecha[1] . '/' . $fecha[0] : null;
                $fecha = split('/', $ffin);
                $objTRetencion->fechafin = ($ffin) ? $fecha[2] . '/' . $fecha[1] . '/' . $fecha[0] : null;
                $objTRetencion->descripcion = $descrip;
                $objTRetencion->cuentacontable = (is_numeric($cuentacontable)) ? $cuentacontable : null;
                $objTRetencion->cobrosypagos = (is_numeric($cobrosypagos)) ? $cobrosypagos : null;
                $objTRetencion->orden = $orden;
                $objTRetencion->tienelimitemaximo = $tienelimitemaximo;

                //Guardando los datos.
                $objTRetencion->save();
                return 2;
            } else {
                return 3;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * Eliminar un tipo de retencion.
     *
     * @param int $idtreten Identificador del tipo de retencion.
     */
    public function eliminarTipoRetencion($idtreten)
    {

        try {
            $r->cantRowAfected = Doctrine_Query::create()
                ->delete()
                ->from('NomTipoRetencion')
                ->where('idtiporetencion = ?', $idtreten)
                ->execute();
            return $r;
        } catch (Exception $e) {
            if ($e->getCode() == 23503) {//Code for foreignKeyViolation
                return 2;
            } else {
                return 1;
            }
        }
    }

    /**
     * Obtener todos los tipos de retenciones.
     *
     * @return array    Listado de tipos de retenciones.
     */
    public static function obtenerTodosTiposRetenciones()
    {
        return NomTipoRetencion::obtenerTodosTiposRetenciones();
    }

    //Exportar nomenclador
    public function fnExportarNomenclador($arr)
    {
        $obj = new DatNominaModel();
        $objPHPExcel = new PHPExcel();

        $fila = 1;
        $columna = 1;
        $objPHPExcel->getActiveSheet()->mergeCells('A1:I1');
        $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, 'Tipos de retenciones', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $fila++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'A', $fila, 'Abreviatura', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $columna++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'B', $fila, 'Denominación', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $columna++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'C', $fila, 'Saldo límite', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $columna++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'D', $fila, 'Límite máximo', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $columna++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('E')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'E', $fila, 'Cobros y pagos', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $columna++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('F')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'F', $fila, 'Orden', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $columna++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('G')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'G', $fila, 'Cuenta contable', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $columna++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('H')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'H', $fila, 'Fecha inicio', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $columna++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('I')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'I', $fila, 'Fecha fin', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $fila++;

        foreach ($arr as $val) {
            $columna = 1;
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $val['abreviatura'], null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
            $columna++;
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $val['denominacion'], null, '000000', 'Arial', 10, '000000', 'left', 'left', 0, 0);
            $columna++;
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $val['saldolimite'] == 1 ? 'Si' : 'No', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
            $columna++;
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $val['tienelimitemaximo'] == 1 ? 'Si' : 'No', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
            $columna++;
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, !empty($val['cobrosypagos']) ? 'Cuentas por cobrar' : 'Cuentas por pagar', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
            $columna++;
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $val['orden'], null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
            $columna++;
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $val['cuentacontable'], null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
            $columna++;
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $val['fechainicio'], null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
            $columna++;
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $val['fechafin'], null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
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
