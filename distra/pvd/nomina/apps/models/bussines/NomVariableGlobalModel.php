<?php

/**
 * Modelo de negocio para gestionar las variables globales.
 *
 * @author Tte. Darien Cabrera O.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Modelo de negocio
 * @uses NomVariableGlobal, Entidad variables globales (Clase del dominio).
 * @uses NomNivelConfiguracion, Entidad nivel de configuración (Clase del dominio).
 * @copyright UCID
 * @version 1.0
 */
class NomVariableGlobalModel extends ZendExt_Model {

    /**
     * Constructor de la clase.
     */
    public function NomVariableGlobalModel() {
        parent::ZendExt_Model();
    }

    /**
     * Obtener un listado de los datos de las variables globales.
     * 
     * @param int $inicio Inicio de la busqueda.
     * @param int $limite Limite maximo de la busqueda.
	 *
     * @return array Listado de variables globales.
     */
    public function obtenerListadoVariablesGlobales($inicio = 0, $limite = 10) {
        //Retornando el listado de variables globales.
        return NomVariableGlobal::obtenerListadoVariablesGlobales($inicio, $limite);
    }

    /**
     * Obtener la cantidad total de variables globales.
     *
     * @return int Cantidad total de variables globales.
     */
    public function obtenerCantidadTotalVariablesGlobales() {

        //Retornando la cantidad total de variables globales.
        return NomVariableGlobal::obtenerCantidadTotalVariablesGlobales();
    }
	
	/**
     * Obtener todas las variables globales
     *
     * @return array Listado de variables globales
     */
    public function obtenerTodasVariablesGlobales() {
        return NomVariableGlobal::obtenerTodasVariablesGlobal();
    }
	
    /**
     * Obtener el arreglo de niveles de configuración.
     *
     * @return array Listado de niveles de configuración.
     */
    public function obtenerArregloNivelesConfiguracion() {

        //Retornando el listado de niveles de configuración.
        return NomNivelConfiguracion::obtenerTodosNivelesConfiguracion();
    }

    /**
     * Insertar una variable global.
     * 
     * @param int $idnivel   			Identificador del nivel de configuración.
     * @param string $abrev     		Abreviatura de la variable global.
     * @param string $denom     		Denominacion de la variable global.
     * @param string $finicio   		Fecha de inicio de creacion de la variable global.
     * @param date $ffin      			Fecha de fin de uso de la variable global.
     * @param date $descrip   			Descripcion de la variable global.
	 * @param int $lugaresdecimales		Lugares decimales de la variable global.
     */
    public function adicionarVariableGlobal($idnivel, $abrev, $denom, $finicio, $ffin, $descrip, $lugaresdecimales) {



        try {
            if(!NomVariableGlobal::findByIdOrDenom($denom)){

                //Se crea el objeto de la variable global.
                $objVarGlobal = new NomVariableGlobal();

                //Insertando los datos de la variable global.
                $objVarGlobal->idnivelconfiguracion = $idnivel;
                $objVarGlobal->abreviatura = $abrev;
                $objVarGlobal->denominacion = $denom;
                $fecha=split('/',$finicio);
                $objVarGlobal->fechainicio = ($finicio)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
                $fecha=split('/',$ffin);
                $objVarGlobal->fechafin = ($ffin)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
                $objVarGlobal->descripcion = $descrip;
                $objVarGlobal->lugaresdecimales = $lugaresdecimales;

                //Guardando los datos.
                $objVarGlobal->save();
                return 2;
            }else{
                return 3;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * Modificar una variable global.
     * 
     * @param int $idvarglobal  		Identificador de la variable global.
     * @param int $idnivel   			Identificador del nivel de configuración.
     * @param string $abrev     		Abreviatura de la variable global.
     * @param string $denom     		Denominacion de la variable global.
     * @param string $finicio   		Fecha de inicio de creacion de la variable global.
     * @param date $ffin      			Fecha de fin de uso de la variable global.
     * @param date $descrip   			Descripcion de la variable global.
	 * @param int $lugaresdecimales		Lugares decimales de la variable global.
     */
    public function modificarVariableGlobal($idvarglobal, $idnivel, $abrev, $denom, $finicio, $ffin, $descrip, $lugaresdecimales) {



        try {
            if(!NomVariableGlobal::findByIdOrDenom($denom,$idvarglobal)){

                //Obteniendo la variable global a modificar.
                $objVarGlobal = NomVariableGlobal::obtenerObjVariableGlobalDadoId($idvarglobal);

                //Modificando los datos de la variable global.
                $objVarGlobal->idnivelconfiguracion = $idnivel;
                $objVarGlobal->abreviatura = $abrev;
                $objVarGlobal->denominacion = $denom;
                $fecha=split('/',$finicio);
                $objVarGlobal->fechainicio = ($finicio)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
                $fecha=split('/',$ffin);
                $objVarGlobal->fechafin = ($ffin)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
                $objVarGlobal->descripcion = $descrip;
                $objVarGlobal->lugaresdecimales = $lugaresdecimales;

                //Guardando los datos.
                $objVarGlobal->save();
                return 2;
            }else{
                return 3;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * Eliminar una variable global.
     * 
     * @param int $idvarglobal    Identificador de la variable global.
     */
    public function liminarVariableGlobal($idvarglobal) {

        try {
			$r->cantRowAfected = Doctrine_Query::create()
				->delete()
				->from('NomVariableGlobal')
				->where('idvariableglobal = ?', $idvarglobal)
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
        $objPHPExcel->getActiveSheet()->mergeCells('A1:F1');
        $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, 'Variables globales', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $fila++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'A', $fila, 'Abreviatura', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $columna++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'B', $fila, 'Denominación', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $columna++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'C', $fila, 'Nivel configuración', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $columna++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'D', $fila, 'Lugares decimales', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $columna++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('E')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'E', $fila, 'Fecha inicio', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $columna++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('F')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'F', $fila, 'Fecha fin', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $fila++;

        foreach ($arr as $val) {
            $columna = 1;
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $val['abreviatura'], null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
            $columna++;
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $val['denominacion'], null, '000000', 'Arial', 10, '000000', 'left', 'left', 0, 0);
            $columna++;
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $val['denomnivelconfiguracion'], null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
            $columna++;
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $val['lugaresdecimales'], null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
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
