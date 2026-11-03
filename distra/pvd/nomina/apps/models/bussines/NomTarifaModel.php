<?php

/**
 * Modelo de negocio para gestionar los tarifas.
 *
 * @author Tte. Frank Rodriguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Modelo de negocio
 * @uses NomTarifa, Entidad tipo de nómina (Clase del dominio).
 * @copyright UCID
 * @version 1.0
 */
class NomTarifaModel extends ZendExt_Model {

    /**
     * Constructor de la clase.
     */
    public function NomTarifaModel() {
        parent::ZendExt_Model();
    }

    /**
     * Obtener un listado de los datos de las tarifas.
     * 
     * @param int $inicio Inicio de la busqueda.
     * @param int $limite Limite maximo de la busqueda.
	 *
     * @return array Listado de tarifas.
     */
    public function obtenerListadoTarifa($inicio = 0, $limite = 10) {
        //Retornando el listado de tarifas.
        return NomTarifa::obtenerListadoTarifa($inicio, $limite);
    }

    /**
     * Obtener la cantidad total de tarifas.
     *
     * @return int Cantidad total de tarifas.
     */
    public function obtenerCantidadTotalTarifa() {

        //Retornando la cantidad total de tarifas.
        return NomTarifa::obtenerCantidadTotalTarifa();
    }
	
	/**
     * Obtener el listado de todas las tarifas.
     * 
     * @return array Listado de tarifas.
     */
    public function obtenerListadoTodasTarifa() {
        //Retornando el listado de tarifas.
        return NomTarifa::obtenerTodasTarifas();
    }
	
    /**
     * Insertar un tipo de nómina.
     * 
     * @param string $denom     Denominacion de la tarifa.
     * @param string $finicio   Fecha de inicio de creacion de la tarifa.
     * @param string $ffin      Fecha de fin de uso de la tarifa.
     * @param string $descrip   Descripcion de la tarifa.
     */
    public function adicionarTarifa($denom, $finicio, $ffin, $descrip) {

        try {
            if(!NomTarifa::findByIdOrDenom($denom)){

                //Se crea el objeto de la tarifa.
                $objTarifa = new NomTarifa();

                //Insertando los datos de la tarifa.
                $objTarifa->denominacion = $denom;
                $fecha=split('/',$finicio);
                $objTarifa->fechainicio = ($finicio)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
                $fecha=split('/',$ffin);
                $objTarifa->fechafin = ($ffin)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
                $objTarifa->descripcion = $descrip;

                //Guardando los datos.
                $objTarifa->save();
                return 2;
            }else{
                return 3;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
        
    }

    /**
     * Modificar una tarifa.
     * 
     * @param int $idtarifa   Identificador de la tarifa.
     * @param string $denom     Denominacion de la tarifa.
     * @param string $finicio   Fecha de inicio de la tarifa.
     * @param string $ffin      Fecha de fin de uso de la tarifa.
     * @param string $descrip   Descripcion de la tarifa.
     */
    public function modificarTarifa($idtarifa, $denom, $finicio, $ffin, $descrip) {


        try {
            if(!NomTarifa::findByIdOrDenom($denom,$idtarifa)){

                //Obteniendo la tarifa a modificar.
                $objTarifa = NomTarifa::obtenerObjTarifaDadoId($idtarifa);

                //Modificando los datos de la tarifa.
                $objTarifa->denominacion = $denom;
                $fecha=split('/',$finicio);
                $objTarifa->fechainicio = ($finicio)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
                $fecha=split('/',$ffin);
                $objTarifa->fechafin = ($ffin)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
                $objTarifa->descripcion = $descrip;

                //Guardando los datos.
                $objTarifa->save();
                return 2;
            }else{
                return 3;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * Eliminar una tarifa.
     * 
     * @param int $idtarifa    Identificador de la tarifa.
     */
    public function eliminarTarifa($idtarifa) {

        try {
			$r->cantRowAfected = Doctrine_Query::create()
				->delete()
				->from('NomTarifa')
				->where('idtarifa = ?', $idtarifa)
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
    public function fnExportarNomenclador($datos)
    {
        $obj = new DatNominaModel();
        $objPHPExcel = new PHPExcel();
        $fila = 1;
        $columna = 1;
        $objPHPExcel->getActiveSheet()->mergeCells('A1:C1');
        $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, 'Frecuencias de pago', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
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
        foreach ($datos as $item) {
            $columna = 1;
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $item['denominacion'], null, '000000', 'Arial', 10, '000000', 'left', 'center', 0, 0);
            $columna++;
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $item['fechainicio'], null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
            $columna++;
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $item['fechafin'], null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
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
