<?php

/**
 * Modelo de negocio para gestionar los tipos de conceptos de percepciones y descuentos.
 *
 * @author Tte. Darien Cabrera O.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Modelo de negocio
 * @uses NomTipoConceptoPD, Entidad tipo de concepto de percepcion y descuento (Clase del dominio).
 * @copyright UCID
 * @version 1.0
 */
class NomTipoConceptoPDModel extends ZendExt_Model {

    /**
     * Constructor de la clase.
     */
    public function NomTipoConceptoPDModel() {
        parent::ZendExt_Model();
    }

    /**
     * Obtener un listado de los datos de los tipos de conceptos de percepciones y descuentos.
     * 
     * @param int $inicio Inicio de la busqueda.
     * @param int $limite Limite maximo de la busqueda.
     * @return array Listado de tipos de conceptos de percepciones y descuentos.
     */
    public function obtenerListadoTiposConceptoPD($inicio = 0, $limite = 10) {

        //Retornando el listado de tipos de conceptos de percepciones y descuentos.
        return NomTipoConceptoPD::obtenerListadoTiposConceptoPD($inicio, $limite);
    }

    /**
     * Obtener la cantidad total de tipos de conceptos de percepciones y descuentos.
     *
     * @return int Cantidad total de tipos de conceptos de percepciones y descuentos.
     */
    public function obtenerCantidadTotalTiposConceptoPD() {

        //Retornando la cantidad total de tipos de conceptos de percepciones y descuentos.
        return NomTipoConceptoPD::obtenerCantidadTotalTiposConceptoPD();
    }

    /**
     * Insertar un tipo de concepto de percepcion y descuento.
     * 
     * @param string $denom     Denominacion del tipo de concepto de percepcion y descuento.
     * @param string $finicio   Fecha de inicio de creacion del tipo de concepto de percepcion y descuento.
     * @param string $ffin      Fecha de fin de uso del tipo de concepto de percepcion y descuento.
     * @param string $descrip   Descripcion del tipo de concepto de percepcion y descuento.
     */
    public function adicionarTipoConceptoPD($denom, $finicio, $ffin, $descrip) {



        try {
            if(!NomTipoConceptoPD::findByIdOrDenom($denom)){

                //Se crea el objeto del tipo de concepto de percepcion y descuento.
                $objTipoConcepto = new NomTipoConceptoPD();

                //Insertando los datos del tipo de concepto de percepcion y descuento.
                $objTipoConcepto->denominacion = $denom;
                $fecha=split('/',$finicio);
                $objTipoConcepto->fechainicio = ($finicio)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
                $fecha=split('/',$ffin);
                $objTipoConcepto->fechafin = ($ffin)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
                $objTipoConcepto->descripcion = $descrip;

                //Guardando los datos.
                $objTipoConcepto->save();
                return 2;
            }else{
                return 3;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * Modificar un tipo de concepto de percepcion y descuento.
     * 
     * @param int $idtconcep    Identificador del tipo de concepto de percepcion y descuento.
     * @param string $denom     Denominacion del tipo de concepto de percepcion y descuento.
     * @param string $finicio   Fecha de inicio de creacion del tipo de concepto de percepcion y descuento.
     * @param string $ffin      Fecha de fin de uso del tipo de concepto de percepcion y descuento.
     * @param string $descrip   Descripcion del tipo de concepto de percepcion y descuento.
     */
    public function modificarTipoConceptoPD($idtconcep, $denom, $finicio, $ffin, $descrip) {



        try {
            if(!NomTipoConceptoPD::findByIdOrDenom($denom,$idtconcep)){
                //Obteniendo el tipo de concepto de percepcion y descuento a modificar.
                $objTipoConcepto = NomTipoConceptoPD::obtenerObjTipoConceptoPDDadoId($idtconcep);

                //Modificando los datos del tipo de concepto de percepcion y descuento.
                $objTipoConcepto->denominacion = $denom;
                $fecha=split('/',$finicio);
                $objTipoConcepto->fechainicio = ($finicio)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
                $fecha=split('/',$ffin);
                $objTipoConcepto->fechafin = ($ffin)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
                $objTipoConcepto->descripcion = $descrip;

                //Guardando los datos.
                $objTipoConcepto->save();
                return 2;
            }else{
                return 3;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * Eliminar un tipo de concepto de percepcion y descuento.
     * 
     * @param int $idtconcep    Identificador del tipo de concepto de percepcion y descuento.
     */
    public function eliminarTipoConceptoPD($idtipoconceptopd) {

         try {
			$r->cantRowAfected = Doctrine_Query::create()
				->delete()
				->from('NomTipoConceptoPD')
				->where('idtipoconceptopd = ?', $idtipoconceptopd)
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
        $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, 'Conceptos de percepciones y descuentos', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
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

        foreach ($arr as $val) {
            $columna = 1;
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $val['denominacion'], null, '000000', 'Arial', 10, '000000', 'left', 'left', 0, 0);
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
