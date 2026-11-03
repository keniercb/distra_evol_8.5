<?php

/**
 * Modelo de negocio para gestionar los concepto de la retribución monetaria.
 *
 * @author Tte. Darien Cabrera O.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Modelo de negocio
 * @uses NomConceptoRM, Entidad concepto de la retribución monetaria (Clase del dominio).
 * @copyright UCID
 * @version 1.0
 */
class NomConceptoRMModel extends ZendExt_Model {

    /**
     * Constructor de la clase.
     */
    public function NomConceptoRMModel() {
        parent::ZendExt_Model();
    }

    /**
     * Obtener un listado de los datos de los conceptos de la retribución monetaria.
     * 
     * @param int $inicio Inicio de la búsqueda.
     * @param int $limite Limite maximo de la búsqueda.
	 *
     * @return array Listado de conceptos de la retribución monetaria.
     */
    public function obtenerListadoConceptosRM($inicio = 0, $limite = 10) {
        $arrayreturn = array();$cont = 0;
        //Retornando el listado de concepto.
        $arrayc = NomConceptoRM::obtenerListadoConceptosRM($inicio, $limite);
        if(count($arrayc) > 0){
            foreach($arrayc as $rcrm){
                $arrayreturn[$cont]['idconceptorm'] = $rcrm['idconceptorm'];
                $arrayreturn[$cont]['abreviatura'] = $rcrm['abreviatura'];
                $arrayreturn[$cont]['denominacion'] = $rcrm['denominacion'];
                $arrayreturn[$cont]['fechainicio'] = $rcrm['fechainicio'];
                $arrayreturn[$cont]['fechafin'] = $rcrm['fechafin'];
                $arrayreturn[$cont]['descripcion'] = $rcrm['descripcion'];
                $arrayreturn[$cont]['esconceptopagosalario'] = $rcrm['esconceptopagosalario'];
                if($rcrm['idparrafofiscal']){
                    $arrayreturn[$cont]['idparrafofiscal'] = $rcrm['idparrafofiscal'];
                    $rpf = $rpf = $this->integrator->datosmaestros->getClientesProveedorByParams($rcrm['idparrafofiscal'], null, null, true, null);
                    $arrayreturn[$cont]['denominacionpf'] = $rpf['datos'][0]['nombre'];
                }else{
                    $arrayreturn[$cont]['denominacionpf'] = '';
                }
                if($rcrm['idclienteproveedorcobropago']){
                    $rccp = $this->integrator->datosmaestros->getClientesProveedorByParams($rcrm['idparrafofiscal'], null, false, true, null);
                    //Recorriendo el proveedor para buscar la cuenta que coincide con la del concepto rm
                    foreach($rccp['datos'][0]['cobrospagos'] as $rccp){
                        if($rccp['idclienteproveedorcobropago'] == $rcrm['idclienteproveedorcobropago']){
                            $arrayreturn[$cont]['nombrecuenta'] = $rccp['nombrecuenta'];
                        }
                    }
                }else{
                    $arrayreturn[$cont]['nombrecuenta'] = '';
                }
                $cont++;
            }
        }
        return $arrayreturn;
    }

    /**
     * Obtener la cantidad total de conceptos de la retribución monetaria.
     *
     * @return int Cantidad total de conceptos de la retribución monetaria.
     */
    public function obtenerCantidadTotalConceptosRM() {
        return NomConceptoRM::obtenerCantidadTotalConceptosRM();
    }
	
	/**
     * Obtener todos los conceptos de la retribución monetaria.
     *
     * @return array Listado de conceptos de la retribucion monetaria.
     */
    public function obtenerTodosConceptosRM() {
        return NomConceptoRM::obtenerListadoConceptosRM();
    }

    /**
     * Insertar un concepto de la retribución monetaria.
     * 
     * @param string $abrev     Abreviatura del concepto.
     * @param string $denom     Denominacion del concepto.
     * @param date $finicio   	Fecha de inicio de creacion del concepto.
     * @param date $ffin      	Fecha de fin de uso del concepto.
     * @param string $descrip   Descripcion del concepto.
     */
    public function adicionarConceptoRetribucionMonetaria($abrev, $denom, $finicio, $ffin, $descrip, $idparrafofiscal, $idclienteproveedorcobropago) {


        try {
            if(!NomConceptoRM::findByIdOrDenom($denom)){

                //Se crea el objeto del concepto.
                $objConcepto = new NomConceptoRM();

                //Insertando los datos del concepto.
                $objConcepto->abreviatura = $abrev;
                $objConcepto->denominacion = $denom;
                $fecha=split('/',$finicio);
                $objConcepto->fechainicio = ($finicio)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
                $fecha=split('/',$ffin);
                $objConcepto->fechafin = ($ffin)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
                $objConcepto->descripcion = $descrip;
                $objConcepto->idparrafofiscal = ($idparrafofiscal)?$idparrafofiscal:null;
                $objConcepto->idclienteproveedorcobropago = ($idclienteproveedorcobropago)?$idclienteproveedorcobropago:null;

                //Guardando los datos.
                $objConcepto->save();
                return 2;
            }else{
                return 3;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * Modificar un concepto de la retribución monetaria.
     * 
     * @param int $idconcept    Identificador del concepto.
     * @param string $abrev     Abreviatura del concepto.
     * @param string $denom     Denominacion del concepto.
     * @param date $finicio   	Fecha de inicio de creacion del concepto.
     * @param date $ffin      	Fecha de fin de uso del concepto.
     * @param string $descrip   Descripcion del concepto.
     */
    public function modificarConceptoRetribucionMonetaria($idconcept, $abrev, $denom, $finicio, $ffin, $descrip, $idparrafofiscal, $idclienteproveedorcobropago) {



        try {
            if(!NomConceptoRM::findByIdOrDenom($denom,$idconcept)){

                //Obteniendo el concepto a modificar.
                $objConcepto = NomConceptoRM::obtenerObjConceptoRmDadoId($idconcept);

                //Modificando los datos del concepto.
                $objConcepto->abreviatura = $abrev;
                $objConcepto->denominacion = $denom;
                $fecha=split('/',$finicio);
                $objConcepto->fechainicio = ($finicio)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
                $fecha=split('/',$ffin);
                $objConcepto->fechafin = ($ffin)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
                $objConcepto->descripcion = $descrip;
                $objConcepto->idparrafofiscal = ($idparrafofiscal)?$idparrafofiscal:null;
                $objConcepto->idclienteproveedorcobropago = ($idclienteproveedorcobropago)?$idclienteproveedorcobropago:null;

                //Guardando los datos.
                $objConcepto->save();
                return 2;
            }else{
                return 3;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * Eliminar una concepto de la retribución monetaria.
     * 
     * @param int $idconcept    Identificador del concepto.
     */
    public function eliminarConceptoRetribucionMonetaria($idconcept) {

        try {
			$r->cantRowAfected = Doctrine_Query::create()
				->delete()
				->from('NomConceptoRM')
				->where('idconceptorm = ?', $idconcept)
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
        $objPHPExcel->getActiveSheet()->mergeCells('A1:D1');
        $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, 'Conceptos de retribución monetaria', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
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
        foreach ($datos as $item) {
            $columna = 1;
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $item['abreviatura'], null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
            $columna++;
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
