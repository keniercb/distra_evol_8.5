<?php

/**
 * Modelo de negocio para gestionar los período de vacaciones.
 *
 * @author Tte. Darien Cabrera O.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Modelo de negocio
 * @uses NomPeriodoVacaciones, Entidad periodo de vacaciones (Clase del dominio).
 * @copyright UCID
 * @version 1.0
 */
class NomPeriodoVacacionesModel extends ZendExt_Model {

    /**
     * Constructor de la clase.
     */
    public function NomPeriodoVacacionesModel() {
        parent::ZendExt_Model();
    }

    /**
     * Obtener un listado de los datos de los períodos de vacaciones.
     * 
     * @param int $inicio Inicio de la busqueda.
     * @param int $limite Limite maximo de la busqueda.
	 *
     * @return array Listado de período de vacaciones.
     */
    public function obtenerListadoPeriodoVacaciones($inicio = 0, $limite = 10) {
        //Retornando el listado de período de vacaciones
        return NomPeriodoVacaciones::obtenerListadoPeriodoVacaciones($inicio, $limite);
    }

    /**
     * Obtener la cantidad total de período de vacaciones.
     *
     * @return int Cantidad total de período de vacaciones.
     */
    public function obtenerCantidadTotalPeriodoVacaciones() {

        //Retornando la cantidad total de período de vacaciones.
        return NomPeriodoVacaciones::obtenerCantidadTotalPeriodoVacaciones();
    }

    /**
     * Insertar un período de vacaciones.
     * 
     * @param numeric $tiempootorgar    Tiempo a otorgar del período de vacaciones.
     * @param numeric $tiempodescontar  Tiempo a descontar del período de vacaciones.
     * @param string $finicio           Fecha de inicio de creacion del período de vacaciones.
     * @param string $ffin              Fecha de fin de uso del período de vacaciones.
     * @param string $descrip           Descripcion del período de vacaciones.
     */
    public function adicionarPeriodoVacaciones($tiempootorgar, $tiempodescontar, $finicio, $ffin, $descrip) {
        //Se crea el objeto del período de vacaciones.
        $objPerVac = new NomPeriodoVacaciones();

        //Insertando los datos del período de vacaciones.
        $objPerVac->tiempootorgar = $tiempootorgar;
        $objPerVac->tiempodescontar = $tiempodescontar;
        $fecha=split('/',$finicio); 
        $objPerVac->fechainicio = ($finicio)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
        $fecha=split('/',$ffin);   
        $objPerVac->fechafin = ($ffin)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
        $objPerVac->descripcion = $descrip;
        
        //Guardando los datos.
        $objPerVac->save();
        
    }

    /**
     * Modificar un período de vacaciones.
     * 
     * @param numeric $idperiodovac     Tiempo a otorgar del período de vacaciones.
     * @param numeric $tiempootorgar    Tiempo a otorgar del período de vacaciones.
     * @param numeric $tiempodescontar  Tiempo a descontar del período de vacaciones.
     * @param string $finicio           Fecha de inicio de creacion del período de vacaciones.
     * @param string $ffin              Fecha de fin de uso del período de vacaciones.
     * @param string $descrip           Descripcion del período de vacaciones.
     */
    public function modificarPeriodoVacaciones($idperiodovac, $tiempootorgar, $tiempodescontar, $finicio, $ffin, $descrip) {

        //Obteniendo el período de vacaciones a modificar.
        $objPerVac = NomPeriodoVacaciones::obtenerObjPeriodoVacDadoId($idperiodovac);
        
        //Modificando los datos del período de vacaciones.
        $objPerVac->tiempootorgar = $tiempootorgar;
        $objPerVac->tiempodescontar = $tiempodescontar;
        $fecha=split('/',$finicio); 
        $objPerVac->fechainicio = ($finicio)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
        $fecha=split('/',$ffin);   
        $objPerVac->fechafin = ($ffin)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
        $objPerVac->descripcion = $descrip;
        
        //Guardando los datos.
        $objPerVac->save();
    }

    /**
     * Eliminar un período de vacaciones.
     * 
     * @param int $idperiodovac    Identificador del período de vacaciones.
     */
    public function eliminarPeriodoVacaciones($idperiodovac) {

        //Obteniendo el período de vacaciones a eliminar.
        $objPerVac = NomPeriodoVacaciones::obtenerObjPeriodoVacDadoId($idperiodovac);

        //Borrando el período de vacaciones.
        $objPerVac->delete();
    }

    //Exportar nomenclador
    public function fnExportarNomenclador($arr)
    {
        $obj = new DatNominaModel();
        $objPHPExcel = new PHPExcel();

        $fila = 1;
        $columna = 1;
        $objPHPExcel->getActiveSheet()->mergeCells('A1:D1');
        $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, 'Períodos de vacaciones', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $fila++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'A', $fila, 'Días a otorgar', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $columna++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'B', $fila, 'Días a descontar', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $columna++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'C', $fila, 'Fecha inicio', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $columna++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'D', $fila, 'Fecha fin', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $columna++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('E')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'E', $fila, 'Descripción', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $fila++;

        foreach ($arr as $val) {
            $columna = 1;
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $val['tiempootorgar'], null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
            $columna++;
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $val['tiempodescontar'], null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
            $columna++;
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $val['fechainicio'], null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
            $columna++;
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $val['fechafin'], null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
            $columna++;
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $val['descripcion'], null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
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
