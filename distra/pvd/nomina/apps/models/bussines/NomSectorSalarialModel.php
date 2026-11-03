  <?php

/**
 * Modelo de negocio para gestionar los sectores salariales.
 *
 * @author Tte. Darien Cabrera O.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Modelo de negocio
 * @uses NomSectorSalarial, Entidad sector salarial (Clase del dominio).
 * @copyright UCID
 * @version 1.0
 */
class NomSectorSalarialModel extends ZendExt_Model {

    /**
     * Constructor de la clase.
     */
    public function NomSectorSalarialModel() {
        parent::ZendExt_Model();
    }

    /**
     * Obtener un listado de los datos de los sectores salariales.
     * 
     * @param int $inicio Inicio de la busqueda.
     * @param int $limite Limite maximo de la busqueda.
     * @return array Listado de sectores salariales.
     */
    public function obtenerListadoSectores($inicio = 0, $limite = 10) {

        //Retornando el listado de sectores salariales.
        return NomSectorSalarial::obtenerListadoSectores($inicio, $limite);
    }

    /**
     * Obtener la cantidad total de sectores salariales.
     *
     * @return int Cantidad total de sectores salariales.
     */
    public function obtenerCantidadTotalSectores() {

        //Retornando la cantidad total de sectores salariales.
        return NomSectorSalarial::obtenerCantidadTotalSectores();
    }

    /**
     * Insertar un sector salarial.
     * 
     * @param string $abrev     Abreviatura del sector salarial.
     * @param string $denom     Denominacion del sector salarial.
     * @param string $finicio   Fecha de inicio de creacion del sector salarial.
     * @param string $ffin      Fecha de fin de uso del sector salarial.
     * @param string $descrip   Descripcion del sector salarial.
     */
    public function adicionarSectorSalarial($abrev, $denom, $finicio, $ffin, $descrip) {



        try {
            if(!NomSectorSalarial::findByIdOrDenom($denom)){

                //Se crea el objeto del sector salarial.
                $objSector = new NomSectorSalarial();

                //Insertando los datos del sector salarial.
                $objSector->abreviatura = $abrev;
                $objSector->denominacion = $denom;
                $fecha=split('/',$finicio);
                $objSector->fechainicio = ($finicio)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
                $fecha=split('/',$ffin);
                $objSector->fechafin = ($ffin)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
                $objSector->descripcion = $descrip;

                //Guardando los datos.
                $objSector->save();
                return 2;
            }else{
                return 3;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * Modificar un sector salarial.
     * 
     * @param int $idsector     Identificador del sector salarial.
     * @param string $abrev     Abreviatura del sector salarial.
     * @param string $denom     Denominacion del sector salarial.
     * @param string $finicio   Fecha de inicio de creacion del sector salarial.
     * @param string $ffin      Fecha de fin de uso del sector salarial.
     * @param string $descrip   Descripcion del sector salarial.
     */
    public function modificarSectorSalarial($idsector, $abrev, $denom, $finicio, $ffin, $descrip) {



        try {
            if(!NomSectorSalarial::findByIdOrDenom($denom,$idsector)){

                //Obteniendo el sector salarial a modificar.
                $objSector = NomSectorSalarial::obtenerObjSectorDadoId($idsector);

                //Modificando los datos del sector salarial.
                $objSector->abreviatura = $abrev;
                $objSector->denominacion = $denom;
                $fecha=split('/',$finicio);
                $objSector->fechainicio = ($finicio)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
                $fecha=split('/',$ffin);
                $objSector->fechafin = ($ffin)?$fecha[2].'/'.$fecha[1].'/'.$fecha[0]:null;
                $objSector->descripcion = $descrip;

                //Guardando los datos.
                $objSector->save();
                return 2;
            }else{
                return 3;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * Eliminar un sector salarial.
     * 
     * @param int $idsector    Identificador del sector salarial.
     */
    public function eliminarSectorSalarial($idsectorsalarial) {

        try {
			$r->cantRowAfected = Doctrine_Query::create()
				->delete()
				->from('NomSectorSalarial')
				->where('idsectorsalarial = ?', $idsectorsalarial)
				->execute();
			return $r;
		}
        catch (Exception $e){
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
        $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, 'Sectores salariales', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
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
