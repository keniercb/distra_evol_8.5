<?php

/**
 * Modelo de negocio para gestionar las cuentas del cierre.
 *
 * @author Ing.Elizabeth Cordero Diaz
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Modelo de negocio
 * @uses Nomcuentascierre (Clase del dominio).
 * @version 1.0
 */


 class NomcuentascierreModel extends ZendExt_Model {
 
     /**
      * Constructor de la clase.
      */
     public function NomcuentascierreModel() {
         parent::ZendExt_Model();
     }
 
      /**
      * Obtener un listado de los datos de las CC.
      * 
      * @param int $inicio Inicio de la busqueda.
      * @param int $limite Limite maximo de la busqueda.
      *
      * @return array Listado de las CC
      */
     public function obtenerListadoCuentas($inicio = 0, $limit = 10) {
 
         //Retornando el listado de las CC.
         return Nomcuentascierre::obtenerListadoCuentas($inicio, $limit);
        
     }
 
     /**
      * Obtener la cantidad total de las CC.
      *
      * @return int Cantidad total de las CC.
      */
     public function obtenerCantidadTotalCuentas() {
 
         //Retornando la cantidad total de las CC.
         return Nomcuentascierre::obtenerCantidadTotalCuentas();
     }
 
	 public function obtenerTodasCuentas() {
 
        //Retornando el listado de las CC.
        return Nomcuentascierre::obtenerTodasCuentas();
    }
    
        public function obtenerCuentas() {      
            //Devolviendo el listado de las CC en forma de arreglo.
            $mg=Doctrine_Manager::getInstance();
            $cont = 0;
            $conn=$mg->getCurrentConnection(); 
            $sql="SELECT distinct(dc.idcuenta) , concat(dc.concatcta,'-', dc.denomcuenta) as cuenta, dc.denomcuenta from mod_nomina.dat_comprobantenomina dc order by dc.idcuenta;";
            //print_r($sql);die;
            $cuentas = $conn->fetchAll($sql); 
            $conn->commit(); //print_r($cuentas);die; 

            foreach ($cuentas as $key ) {            
                $datos[$cont]['idcuenta']=$key['idcuenta'];
                $datos[$cont]['denomcuenta']=$key['denomcuenta'];
                $datos[$cont]['cuenta']=$key['cuenta'];
                $cont ++;              
           } //print_r($datos);die;
           return $datos;
         }

        
     /**
      * Insertar una CC.
      * 
      * @param string $cuenta     Denominacion de la CC
      * @param string $descrip   Descripcion de la CC
      */
     public function adicionarCC($idcuenta,$tipo) {
        if(Nomcuentascierre::existeCC($idcuenta) == 0){
            if (!Nomcuentascierre::findByIDOrDenom($idcuenta)) {
                //Obteniendo la cuenta a modificar.
                $objCC = new Nomcuentascierre();  
                    //Insertando los datos de la CC
                    $objCC->id=$id;
                    $objCC-> idcuenta = $idcuenta;
                    $objCC->tipo = $tipo;
                    //Guardando los datos.
                    $objCC->save();
                    return 2;
                } 
            }
            else{
                return 3;
            }
        
    } 
     
 
     /**
      * Modificar una CC.
      * 
      * @param int $idcuenta   Identificador de la CC
      * @param string $cuenta     Denominacion de la CC
      * @param string $descrip   Descripcion de la CC
      */
    //  public function modificarCC($idcuenta,$tipo) {
    //     if(Nomcuentascierre::existeCC($idcuenta) == 0){
    //        if(!Nomcuentascierre::findByIDOrDenom($idcuenta)){ 
    //              //Obteniendo la CC a modificar.
    //              $objCC = Nomcuentascierre::obtenerObjCCDadoID($idcuenta);  //print_r($objCC);die;
    //             //  //Modificando los datos de la CC
    //              $objCC->idcuenta = $idcuenta; 
    //               $objCC->tipo=$tipo;
    //              //Guardando los datos.
    //              $objCC->save();
    //              return 2;
    //          }
    //         }
    //          else{
    //              return 3;
    //          }
           
    //         }
 
     /**
      * Eliminar una CC.
      * 
      * @param int $idcuenta    Identificador de la CC
      */
    //  public function eliminarCC($idcuenta) {
 
    //      $r->cantRowAfected = Doctrine_Query::create()
    //              ->delete()
    //              ->from('Nomcuentascierre')
    //              ->where('idcuenta = ?', $idcuenta)
    //              ->execute();
    //          return $r; print_r($r);die;
    //  }
   
    public function obtenerOrdenDisponible()
    {
        return Nomcuentascierre::obtenerOrdenDisponible();
    }
      //Exportar nomenclador
    public function fnExportarNomenclador($arrCuentas)
    {
        $obj = new DatNominaModel();
        $objPHPExcel = new PHPExcel();
        $fila = 1;
        $columna = 1;
        $objPHPExcel->getActiveSheet()->mergeCells('A1:D1');
        $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, 'Cuentas de Cierre', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $fila++;

        $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'A', $fila, 'IdCuenta', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $columna++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'B', $fila, 'Tipo Cuenta', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $columna++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'B', $fila, 'Cuenta', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $columna++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'C', $fila, 'Descripcion', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $columna++;
        $fila++;
        foreach ($arrCuentas as $item) {
            $columna = 1;
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $item['idcuenta'], null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
            $columna++;
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $item['tipo'], null, '000000', 'Arial', 10, '000000', 'left', 'center', 0, 0);
            $columna++;
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $item['cuenta'], null, '000000', 'Arial', 10, '000000', 'left', 'center', 0, 0);
            $columna++;
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $item['descripcion'], null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
            $columna++;
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
 
