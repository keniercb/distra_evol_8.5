<?php

/**
 * Modelo de negocio para gestionar las situaciones laborales.
 *
 * @author Tte. Darien Cabrera O.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Modelo de negocio
 * @uses NomSituacionLaboral, Entidad situacion laboral (Clase del dominio).
 * @copyright UCID
 * @version 1.0
 */
class NomSituacionLaboralModel extends ZendExt_Model {

    /**
     * Constructor de la clase.
     */
    public function NomSituacionLaboralModel() {
        parent::ZendExt_Model();
    }

    /**
     * Obtener un listado de los datos de las situaciones laborales.
     * 
     * @param int $inicio Inicio de la busqueda.
     * @param int $limite Limite maximo de la busqueda.
     * @return array Listado de situaciones laborales.
     */
    public function obtenerListadoSituaciones($inicio = 0, $limite = 10) {

        //Retornando el listado de situaciones laborales.
        return NomSituacionLaboral::obtenerListadoSituaciones($inicio, $limite);
    }

    public function obtenerListadoDenomSituacionesLaborales() {

        //Retornando el listado de situaciones laborales.
        return NomSituacionLaboral::obtenerDenomSituacionesLaborales();
    }

   public function cargarconcepto($node) {

        //Retornando el listado de situaciones laborales.
            $arra= NomConceptoPercepcionDescuento::cargarconcepto($node);
       //print_r($arra);die;
           return $arra;


    }

    /**
     * Obtener la cantidad total de situaciones laborales.
     *
     * @return int Cantidad total de situaciones laborales.
     */
    public function obtenerCantidadTotalSituaciones() {

        //Retornando la cantidad total de situaciones laborales.
        return NomSituacionLaboral::obtenerCantidadTotalSituaciones();
    }

    /**
     * Insertar una situacion laboral.
     * 
     * @param string $abrev     Abreviatura de la situacion laboral.
     * @param string $denom     Denominacion de la situacion laboral.
	 * @param string $asoccargo	Si la situaci�n est� asociada a un cargo.
     * @param string $finicio   Fecha de inicio de creacion de la situacion laboral.
     * @param string $ffin      Fecha de fin de uso de la situacion laboral.
     * @param string $descrip   Descripcion de la situacion laboral.
     */
    public function adicionarSituacionLaboral($abrev, $denom, $finicio, $ffin, $descrip,$idconceptopercepciondescuento) {



        try {
            if(!NomSituacionLaboral::findByIdOrDenom($denom)){

                //Se crea el objeto de la situacion laboral.
                $objSituacion = new NomSituacionLaboral();

                //Insertando los datos de la situacion laboral.
                $objSituacion->abreviatura = $abrev;
                $objSituacion->denominacion = $denom;
                //$objSituacion->asociadoalcargo = $asociadocargo;
                $fecha=split('/',$finicio);
                $objSituacion->fechainicio = ($finicio)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
                $fecha=split('/',$ffin);
                $objSituacion->fechafin = ($ffin)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
                $objSituacion->descripcion = $descrip;

                //Guardando los datos.
                $objSituacion->save();
                $id = $objSituacion->idsituacionlaboral;

                foreach($idconceptopercepciondescuento as $k=>$v){
                    // print_r($idconceptopercepciondescuento);die;
                    $objSitServicio = new ConfConceptospdSituacionesServicio();
                    $objSitServicio->idsituacionservicio = $id;
                    $objSitServicio->idconceptopercepciondescuento = $v;
                    $objSitServicio->save();
                }
                return 2;
            }else{
                return 3;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * Modificar una situacion laboral.
     * 
     * @param int $idsituacion  Identificador de la situacion laboral.
     * @param string $abrev     Abreviatura de la situacion laboral.
     * @param string $denom     Denominacion de la situacion laboral.
	 * @param string $asoccargo	Si la situaci�n est� asociada a un cargo.
     * @param string $finicio   Fecha de inicio de creacion de la situacion laboral.
     * @param string $ffin      Fecha de fin de uso de la situacion laboral.
     * @param string $descrip   Descripcion de la situacion laboral.
     */
    public function modificarsituacionLaboral($idsituacion, $abrev, $denom, $finicio, $ffin, $descrip) {


        try {
            if(!NomSituacionLaboral::findByIdOrDenom($denom,$idsituacion)){

                //Obteniendo la situacion laboral a modificar.
                $objSituacion = NomSituacionLaboral::obtenerObjSituacionDadoId($idsituacion);

                //Modificando los datos de la situacion laboral.
                $objSituacion->abreviatura = $abrev;
                $objSituacion->denominacion = $denom;
                //$objSituacion->asociadoalcargo = $asociadocargo;
                $fecha=split('/',$finicio);
                $objSituacion->fechainicio = ($finicio)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
                $fecha=split('/',$ffin);
                $objSituacion->fechafin = ($ffin)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
                $objSituacion->descripcion = $descrip;

                //Guardando los datos.
                $objSituacion->save();

                return 2;
            }else{
                return 3;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * Eliminar una situacion laboral.
     * 
     * @param int $idsituacion    Identificador de la situacion laboral.
     */
    public function eliminarSituacionLaboral($idsituacion) {

        try {
			$r->cantRowAfected = Doctrine_Query::create()
				->delete()
				->from('NomSituacionLaboral')
				->where('idsituacionlaboral = ?', $idsituacion)
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
    public function fnExportarNomenclador($arr)
    {
        $obj = new DatNominaModel();
        $objPHPExcel = new PHPExcel();

        $fila = 1;
        $columna = 1;
        $objPHPExcel->getActiveSheet()->mergeCells('A1:D1');
        $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, 'Situaciones laborales', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $fila++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'A', $fila, 'Abreviatura', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $columna++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'B', $fila, 'Denominación', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $columna++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'C', $fila, 'Fecha inicio', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $columna++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'D', $fila, 'Fecha fin', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $fila++;

        foreach ($arr as $val) {
            $columna = 1;
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $val['abreviatura'], null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
            $columna++;
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $val['denominacion'], null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
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
