<?php

/**
 * Modelo de negocio para gestionar las causas de exclusión.
 *
 * @author Tte. Frank Rodriguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Modelo de negocio
 * @uses NomCausasExclusionNomina, Entidad causas de exclusión (Clase del dominio).
 * @copyright UCID
 * @version 1.0
 */
class NomCausasExclusionNominaModel extends ZendExt_Model {

    /**
     * Constructor de la clase.
     */
    public function NomCausasExclusionNominaModel() {
        parent::ZendExt_Model();
    }

    /**
     * Obtener un listado de los datos de las causas de exclusión.
     * 
     * @param int $inicio Inicio de la búsqueda.
     * @param int $limite Limite maximo de la búsqueda.
	 *
     * @return array Listado de las causas de exclusión.
     */
    public function obtenerListadoCausasExclusionNomina($inicio = 0, $limite = 10) {
        //Retornando el listado de las causas de exclusión.
        return NomCausasExclusionNomina::obtenerListadoCausasExclusionNomina($inicio, $limite);
    }

    /**
     * Obtener la cantidad total de las causas de exclusión.
     *
     * @return int Cantidad total de las causas de exclusión.
     */
    public function obtenerCantidadTotalCausasExclusionNomina() {

        //Retornando la cantidad total de las causas de exclusión.
        return NomCausasExclusionNomina::obtenerCantidadTotalCausasExclusionNomina();
    }

    /**
     * Insertar una causa de exclusión.
     * 
     * @param string $denom     Denominación de la causa de exclusión.
     * @param string $finicio   Fecha de inicio de creacion de la causa de exclusión.
     * @param string $ffin      Fecha de fin de uso de la causa de exclusión.
     * @param string $descrip   Descripción de la causa de exclusión.
     */
    public function adicionarCausasExclusionNomina($denom, $finicio, $ffin, $descrip) {


        try {
            if(!NomCausasExclusionNomina::findByIdOrDenom($denom)){
                //Se crea el objeto de la causa de exclusión.
                $objCausasExclusionNomina = new NomCausasExclusionNomina();

                //Insertando los datos de la causa de exclusión.
                $objCausasExclusionNomina->denominacion = $denom;
                $fecha=split('/',$finicio);
                $objCausasExclusionNomina->fechainicio = ($finicio)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
                $fecha=split('/',$ffin);
                $objCausasExclusionNomina->fechafin = ($ffin)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
                $objCausasExclusionNomina->descripcion = $descrip;

                //Guardando los datos.
                $objCausasExclusionNomina->save();
                return 2;
            }else{
                return 3;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * Modificar una causa de exclusión.
     * 
     * @param int $idcausaexclusion   	Identificador de la causa de exclusión.
     * @param string $denom     		Denominación de la causa de exclusión.
     * @param string $finicio  			Fecha de inicio de creacion de la causa de exclusión.
     * @param string $ffin      		Fecha de fin de uso de la causa de exclusión.
     * @param string $descrip   		Descripción de la causa de exclusión.
     */
    public function modificarCausasExclusionNomina($idcausaexclusion, $denom, $finicio, $ffin, $descrip) {

        try {
            if(!NomCausasExclusionNomina::findByIdOrDenom($denom,$idcausaexclusion)){

                //Obteniendo la causa de exclusión a modificar.
                $objCausasExclusionNomina = NomCausasExclusionNomina::obtenerObjCausasExclusionNominaDadoId($idcausaexclusion);

                //Modificando los datos de la causa de exclusión.
                $objCausasExclusionNomina->denominacion = $denom;
                $fecha=split('/',$finicio);
                $objCausasExclusionNomina->fechainicio = ($finicio)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
                $fecha=split('/',$ffin);
                $objCausasExclusionNomina->fechafin = ($ffin)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
                $objCausasExclusionNomina->descripcion = $descrip;

                //Guardando los datos.
                $objCausasExclusionNomina->save();
                return 2;
            }else{
                return 3;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * Eliminar una causa de exclusión.
     * 
     * @param int $idcausaexclusion    Identificador de la causa de exclusión.
     */
    public function eliminarCausasExclusionNomina($idcausaexclusion) {
		try {
			$r->cantRowAfected = Doctrine_Query::create()
				->delete()
				->from('NomCausasExclusionNomina')
				->where('idcausaexclusion = ?', $idcausaexclusion)
				->execute();
			return $r;
		}catch (Exception $e){
            if($e->getCode() == 23503){//Code for foreignKeyViolation
                return 2;
            }else{
                return 1;
            }
        }
    }

    //Exportar nomenclador
    public function fnExportarNomenclador($arrCausas)
    {
        $obj = new DatNominaModel();
        $objPHPExcel = new PHPExcel();
        $fila = 1;
        $columna = 1;
        $objPHPExcel->getActiveSheet()->mergeCells('A1:D1');
        $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, 'Causas de exclusión de la nómina', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $fila++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'A', $fila, 'Denominación', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $columna++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'B', $fila, 'Fecha inicio', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $columna++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'C', $fila, 'Fecha fin', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $columna++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'D', $fila, 'Descripción', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $fila++;
        foreach ($arrCausas as $causa) {
            $columna = 1;
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $causa['denominacion'], null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
            $columna++;
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $causa['fechainicio'], null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
            $columna++;
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $causa['fechafin'], null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
            $columna++;
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $causa['descripcion'], null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
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
