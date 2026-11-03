<?php

/**
 * Modelo de negocio para gestionar los salarios específicos.
 *
 * @author Tte. Frank Rodriguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Modelo de negocio
 * @uses NomSalarioEspecifico, Entidad forma de pago (Clase del dominio).
 * @copyright UCID
 * @version 1.0
 */
class NomSalarioEspecificoModel extends ZendExt_Model
{

    /**
     * Constructor de la clase.
     */
    public function NomSalarioEspecificoModel()
    {
        parent::ZendExt_Model();
    }

    /**
     * Obtener un listado de los datos de los salarios específicos.
     *
     * @param int $inicio Inicio de la busqueda.
     * @param int $limite Limite maximo de la busqueda.
     *
     * @return array Listado de salarios específico.
     */
    public function obtenerListadoSalarioEspecifico($idsectorsalarial, $inicio = 0, $limite = 10)
    {
        //Retornando el listado de salario específico.
        return NomSalarioEspecifico::obtenerListadoSalarioEspecifico($idsectorsalarial, $inicio, $limite);
    }

    /**
     * Obtener la cantidad total de salario específico.
     *
     * @return int Cantidad total de salario específico.
     */
    public function obtenerCantidadTotalSalarioEspecifico($idsectorsalarial)
    {

        //Retornando la cantidad total de salario específico.
        return NomSalarioEspecifico::obtenerCantidadTotalSalarioEspecifico($idsectorsalarial);
    }

    /**
     * Insertar un salario específico.
     *
     * @param string $denom Denominacion del salario específico.
     * @param string $finicio Fecha de inicio del salario específico.
     * @param string $ffin Fecha de fin de uso del salario específico.
     * @param string $descrip Descripcion del salario específico.
     * @param int $sector Identificador del sector salarial.
     */
    public function adicionarSalarioEspecifico($denom, $salario, $finicio, $ffin, $descrip, $sector)
    {
        //Se crea el objeto del salario específico.
        $objSalarioEspecifico = new NomSalarioEspecifico();

        //Insertando los datos del salario específico.
        $objSalarioEspecifico->denominacioncargo = $denom;
        $objSalarioEspecifico->salario = $salario;
        $fecha = split('/', $finicio);
        $objSalarioEspecifico->fechainicio = ($finicio) ? $fecha[2] . '/' . $fecha[1] . '/' . $fecha[0] : null;
        $fecha = split('/', $ffin);
        $objSalarioEspecifico->fechafin = ($ffin) ? $fecha[2] . '/' . $fecha[1] . '/' . $fecha[0] : null;
        $objSalarioEspecifico->descripcion = $descrip;
        $objSalarioEspecifico->idsectorsalarial = $sector;

        //Guardando los datos.
        $objSalarioEspecifico->save();
    }

    /**
     * Modificar un salario específico.
     *
     * @param int $idform Identificador del salario específico.
     * @param string $denom Denominacion del salario específico.
     * @param string $finicio Fecha de inicio de creacion del salario específico.
     * @param string $ffin Fecha de fin de uso del salario específico.
     * @param string $descrip Descripción del salario específico.
     * @param int $sector Identificador del sector salarial.
     */
    public function modificarSalarioEspecifico($idsalarioesp, $denom, $salario, $finicio, $ffin, $descrip, $sector)
    {
        //Obteniendo el salario específico.
        $objSalarioEspecifico = NomSalarioEspecifico::obtenerObjSalarioEspecificoDadoId($idsalarioesp);

        //Modificando los datos del salario específico.
        $objSalarioEspecifico->idsalarioespecifico = $idsalarioesp;
        $objSalarioEspecifico->denominacioncargo = $denom;
        $objSalarioEspecifico->salario = $salario;
        $fecha = split('/', $finicio);
        $objSalarioEspecifico->fechainicio = ($finicio) ? $fecha[2] . '/' . $fecha[1] . '/' . $fecha[0] : null;
        $fecha = split('/', $ffin);
        $objSalarioEspecifico->fechafin = ($ffin) ? $fecha[2] . '/' . $fecha[1] . '/' . $fecha[0] : null;
        $objSalarioEspecifico->descripcion = $descrip;
        $objSalarioEspecifico->idsectorsalarial = $sector;

        //Guardando los datos.
        $objSalarioEspecifico->save();
    }

    /**
     * Eliminar un salario específico.
     *
     * @param int $idsalarioesp Identificador del salario específico.
     */
    public function eliminarSalarioEspecifico($idsalarioesp)
    {
        try {
            $r->cantRowAfected = Doctrine_Query::create()
                ->delete()
                ->from('NomSalarioEspecifico')
                ->where('idsalarioespecifico = ?', $idsalarioesp)
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

    //Exportar nomenclador
    public function fnExportarNomenclador($datos)
    {
        $obj = new DatNominaModel();
        $objPHPExcel = new PHPExcel();

        //Pintando la denominación del área
        $fila = 1;
        $columna = 1;
        $objPHPExcel->getActiveSheet()->mergeCells('A1:D1');
        $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, 'Salarios específicos', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $fila++;

        $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'A', $fila, 'Denominación del cargo', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $columna++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'B', $fila, 'Salario', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $columna++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'C', $fila, 'Fecha inicio', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $columna++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'D', $fila, 'Fecha fin', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $fila++;
        //Pintando las monedas
        foreach ($datos as $denomformas => $sector) {
            $objPHPExcel->getActiveSheet()->mergeCells('A' . $fila . ':D' . $fila);
            $obj->fnPintarCelda($objPHPExcel, 'A', $fila, $sector['denominacion'], null, '000000', 'Arial', 10, '000000', 'left', 'center', 0, 1);
            $fila++;
            foreach ($sector['salariosespecificos'] as $salariosesp) {
                $columna = 1;
                $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $salariosesp['denominacioncargo'], null, '000000', 'Arial', 10, '000000', 'left', 'center', 0, 0);
                $columna++;
                $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $salariosesp['salario'], null, '000000', 'Arial', 10, '000000', 'left', 'center', 0, 0);
                $columna++;
                $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $salariosesp['fechainicio'], null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
                $columna++;
                $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $salariosesp['fechafin'], null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
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
