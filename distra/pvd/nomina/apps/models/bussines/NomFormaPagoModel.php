<?php

/**
 * Modelo de negocio para gestionar las formas de pago.
 *
 * @author Tte. Darien Cabrera O.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Modelo de negocio
 * @uses NomFormaPago, Entidad forma de pago (Clase del dominio).
 * @copyright UCID
 * @version 1.0
 */
class NomFormaPagoModel extends ZendExt_Model
{

    /**
     * Constructor de la clase.
     */
    public function NomFormaPagoModel()
    {
        parent::ZendExt_Model();
    }

    /**
     * Obtener un listado de los datos de las formas de pago.
     *
     * @param int $inicio Inicio de la busqueda.
     * @param int $limite Limite maximo de la busqueda.
     * @return array Listado de formas de pago.
     */
    public function obtenerListadoFormasPago($inicio = 0, $limite = 10)
    {

        //Retornando el listado de formas de pago.
        return NomFormaPago::obtenerListadoFormasPago($inicio, $limite);
    }

    /**
     * Obtener la cantidad total de formas de pago.
     *
     * @return int Cantidad total de formas de pago.
     */
    public function obtenerCantidadTotalFormasPago()
    {

        //Retornando la cantidad total de formas de pago.
        return NomFormaPago::obtenerCantidadTotalFormasPago();
    }

    /**
     * Insertar una forma de pago.
     *
     * @param string $denom Denominacion de la forma de pago.
     * @param string $finicio Fecha de inicio de creacion de la forma de pago.
     * @param string $ffin Fecha de fin de uso de la forma de pago.
     * @param string $descrip Descripcion de la forma de pago.
     */
    public function adicionarFormaPago($denom, $finicio, $ffin, $descrip)
    {

        try {
            if (!NomFormaPago::existeDenominacionFormaPago($denom)) {
                //Se crea el objeto de la forma de pago.
                $objFormaPago = new NomFormaPago();

                //Insertando los datos de la forma de pago.
                $objFormaPago->denominacion = $denom;
                $fecha = split('/', $finicio);
                $objFormaPago->fechainicio = ($finicio) ? $fecha[2] . '/' . $fecha[1] . '/' . $fecha[0] : null;
                $fecha = split('/', $ffin);
                $objFormaPago->fechafin = ($ffin) ? $fecha[2] . '/' . $fecha[1] . '/' . $fecha[0] : null;
                $objFormaPago->descripcion = $descrip;

                //Guardando los datos.
                $objFormaPago->save();
                return 1;
            } else {
                return 0;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * Modificar una forma de pago.
     *
     * @param int $idform Identificador de la forma de pago.
     * @param string $denom Denominacion de la forma de pago.
     * @param string $finicio Fecha de inicio de creacion de la forma de pago.
     * @param string $ffin Fecha de fin de uso de la forma de pago.
     * @param string $descrip Descripcion de la forma de pago.
     */
    public function modificarFormaPago($idform, $denom, $finicio, $ffin, $descrip)
    {

        try {
            if (!NomFormaPago::existeDenominacionFormaPago($denom, $idform)) {
                //Obteniendo la forma de pago a modificar.
                $objFormaPago = NomFormaPago::obtenerObjFormaPagoDadoId($idform);

                //Modificando los datos de la forma de pago.
                $objFormaPago->denominacion = $denom;
                $fecha = split('/', $finicio);
                $objFormaPago->fechainicio = ($finicio) ? $fecha[2] . '/' . $fecha[1] . '/' . $fecha[0] : null;
                $fecha = split('/', $ffin);
                $objFormaPago->fechafin = ($ffin) ? $fecha[2] . '/' . $fecha[1] . '/' . $fecha[0] : null;
                $objFormaPago->descripcion = $descrip;

                //Guardando los datos.
                $objFormaPago->save();
                return 1;
            } else {
                return 0;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * Eliminar una forma de pago.
     *
     * @param int $idform Identificador de la forma de pago.
     */
    public function eliminarFormaPago($idform)
    {
        try {
            $r->cantRowAfected = Doctrine_Query::create()
                ->delete()
                ->from('NomFormaPago')
                ->where('idformapago = ?', $idform)
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

    //Exportar nomenclador
    public function fnExportarNomenclador($datos)
    {
        $obj = new DatNominaModel();
        $objPHPExcel = new PHPExcel();

        //Pintando la denominación del área
        $fila = 1;
        $columna = 1;
        $objPHPExcel->getActiveSheet()->mergeCells('A1:C1');
        $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, 'Formas y sitemas de pago', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $fila++;

        $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'A', $fila, 'Denominación', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $columna++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'B', $fila, 'Fecha inicio', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $columna++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'C', $fila, 'Fecha fin', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $fila++;

        //Pintando las monedas
        foreach ($datos as $denomformas => $forma) {
            $columna = 1;
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $forma['denominacion'], 't,l,b', '000000', 'Arial', 10, '000000', 'left', 'center', 0, 1);
            $columna++;
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $forma['fechainicio'], 't,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
            $columna++;
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $forma['fechafin'], 'r,t,b', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
            $fila++;
            foreach ($forma['sistemaspago'] as $sistemapago) {
                $columna = 1;
                $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $sistemapago['denominacion'], null, '000000', 'Arial', 10, '000000', 'left', 'center', 0, 0);
                $columna++;
                $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $sistemapago['fechainicio'], null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
                $columna++;
                $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $sistemapago['fechafin'], null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
                $fila++;
            }
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
