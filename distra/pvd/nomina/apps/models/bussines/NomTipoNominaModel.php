<?php

/**
 * Modelo de negocio para gestionar los tipos de nómina.
 *
 * @author Tte. Frank Rodriguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Modelo de negocio
 * @uses NomTipoNomina, Entidad tipo de nómina (Clase del dominio).
 * @copyright UCID
 * @version 1.0
 */
class NomTipoNominaModel extends ZendExt_Model
{

    /**
     * Constructor de la clase.
     */
    public function NomTipoNominaModel()
    {
        parent::ZendExt_Model();
    }

    /**
     * Obtener un listado de los datos de los tipos de nómina.
     *
     * @param int $inicio Inicio de la busqueda.
     * @param int $limite Limite maximo de la busqueda.
     * @return array Listado de tipos de nómina.
     */
    public function obtenerListadoTiposNomina($inicio = 0, $limite = 10)
    {
        //Retornando el listado de tipos de nómina.
        $arrayreturn = array();
        $cont = 0;
        $arrayTipoNomina = NomTipoNomina::obtenerListadoTiposNomina($inicio, $limite);


        foreach ($arrayTipoNomina as $i => $value) {
            $arrayreturn[$cont]['idtiponomina'] = $value['idtiponomina'];
            $arrayreturn[$cont]['denominacion'] = $value['denominacion'];
            $arrayreturn[$cont]['fechainicio'] = $value['fechainicio'];
            $arrayreturn[$cont]['fechafin'] = $value['fechafin'];
            $arrayreturn[$cont]['descripcion'] = $value['descripcion'];
            $arrayreturn[$cont]['acumulavacaciones'] = $value['acumulavacaciones'];
            $arrayreturn[$cont]['liquidavacaciones'] = $value['liquidavacaciones'];
            $arrayreturn[$cont]['acumulasnc'] = $value['acumulasnc'];
            $arrayreturn[$cont]['tipomoneda'] = ($value['tipomoneda'] == 01) ? 1 : 2;
            $arrayreturn[$cont]['reintegro'] = $value['reintegro'];
            $arrayreturn[$cont]['textreintegro'] = ($value['reintegro'] == 1) ? 'Si' : 'No';
            $arrayreturn[$cont]['idoperacioncontable'] = $value['operacioncontable'];
            $arrayreturn[$cont]['idoperacioncontablecuentasporcobrar'] = $value['operacioncontablecuentasporcobrar'];
            if ($value['operacioncontable'] > 0) {
                $arraydatosopcc = $this->integrator->datosmaestros->obtenerOperaciones(null, null, null, $value['operacioncontable']);
                $arrayreturn[$cont]['denomoperacioncontable'] = $arraydatosopcc['data'][0]['denominacion'];
                $arrayreturn[$cont]['denomoperacioncontable'] = $arraydatosopcc[0]['denominacion'];
            } else {
                $arrayreturn[$cont]['denomoperacioncontable'] = "";
            }

            if ($value['operacioncontablecuentasporcobrar'] > 0) {
                $arraydatosopcc = $this->integrator->datosmaestros->obtenerOperaciones(null, null, null, $value['operacioncontablecuentasporcobrar']);
                $arrayreturn[$cont]['denomoperacioncontablecuentaspcobrar'] = $arraydatosopcc['data'][0]['denominacion'];
                $arrayreturn[$cont]['denomoperacioncontablecuentaspcobrar'] = $arraydatosopcc[0]['denominacion'];
            } else {
                $arrayreturn[$cont]['denomoperacioncontablecuentaspcobrar'] = "";
            }
            $cont++;
        }

        return $arrayreturn;
    }

    /**
     * Obtener la cantidad total de tipos de nómina.
     *
     * @return int Cantidad total de tipos de nómina.
     */
    public function obtenerCantidadTotalTiposNomina()
    {

        //Retornando la cantidad total de tipos de nómina.
        return NomTipoNomina::obtenerCantidadTotalTiposNomina();
    }

    /**
     * Insertar un tipo de nómina.
     *
     * @param string $denom Denominacion del tipo de nómina.
     * @param numeric $acum Acumula vacaciones.
     * @param date $finicio Fecha de inicio de creacion del tipo de nómina.
     * @param date $ffin Fecha de fin de uso del tipo de nómina.
     * @param string $descrip Descripcion del tipo de nómina.
     */
    public function adicionarTipoNomina($denom, $acum, $acumsnc, $reintegro, $finicio, $ffin, $tipomoneda, $operacioncc, $operacioncontablecuentasporcobrar, $descrip)
    {


        try {
            if (!NomTipoNomina::findByIdOrDenom($denom)) {

                //Se crea el objeto del tipo de nómina.
                $objTipoNomina = new NomTipoNomina();

                //Insertando los datos del tipo de nómina.
                $objTipoNomina->denominacion = $denom;
                $objTipoNomina->acumulavacaciones = $acum;
                $objTipoNomina->acumulasnc = $acumsnc;
                $objTipoNomina->reintegro = $reintegro;
                $objTipoNomina->tipomoneda = ($tipomoneda == 1) ? '01' : '02';
                $fecha = split('/', $finicio);
                $objTipoNomina->fechainicio = ($finicio) ? $fecha[2] . '/' . $fecha[1] . '/' . $fecha[0] : null;
                $fecha = split('/', $ffin);
                $objTipoNomina->fechafin = ($ffin) ? $fecha[2] . '/' . $fecha[1] . '/' . $fecha[0] : null;
                $objTipoNomina->operacioncontable = ($operacioncc != '') ? $operacioncc : 0;
                $objTipoNomina->operacioncontablecuentasporcobrar = ($operacioncontablecuentasporcobrar != '') ? $operacioncontablecuentasporcobrar : 0;
                $objTipoNomina->descripcion = $descrip;

                //Guardando los datos.
                $objTipoNomina->save();
                return 2;
            } else {
                return 3;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }

    }

    /**
     * Modificar un tipo de nómina.
     *
     * @param int $idtiponomina Identificador del tipo de nómina.
     * @param string $denom Denominacion del tipo de nómina.
     * @param numeric $acum Acumula vacaciones.
     * @param date $finicio Fecha de inicio de creacion del tipo de nómina.
     * @param date $ffin Fecha de fin de uso del tipo de nómina.
     * @param string $descrip Descripcion del tipo de nómina.
     */
    public function modificarTipoNomina($idtiponomina, $denom, $acum, $acumsnc, $reintegro, $finicio, $ffin, $tipomoneda, $operacioncc, $operacioncontablecuentasporcobrar, $descrip)
    {


        try {
            if (!NomTipoNomina::findByIdOrDenom($denom, $idtiponomina)) {

                //Obteniendo el tipo de nómina a modificar.
                $objTipoNomina = NomTipoNomina::obtenerObjTipoNominaDadoId($idtiponomina);

                //Modificando los datos del tipo de nómina.
                $objTipoNomina->denominacion = $denom;
                $objTipoNomina->acumulavacaciones = (!empty($acum)) ? $acum : $objTipoNomina->acumulavacaciones;
                $objTipoNomina->acumulasnc = (!empty($acumsnc)) ? $acumsnc : $objTipoNomina->acumulasnc;
                $objTipoNomina->reintegro = (!empty($reintegro)) ? $reintegro : $objTipoNomina->reintegro;
                $objTipoNomina->tipomoneda = ($tipomoneda == 2) ? '02' : '01';
                $fecha = split('/', $finicio);
                $objTipoNomina->fechainicio = ($finicio) ? $fecha[2] . '/' . $fecha[1] . '/' . $fecha[0] : null;
                $fecha = split('/', $ffin);
                $objTipoNomina->fechafin = ($ffin) ? $fecha[2] . '/' . $fecha[1] . '/' . $fecha[0] : null;
                $objTipoNomina->operacioncontable = (empty($operacioncc) ? NULL : $operacioncc);
                $objTipoNomina->operacioncontablecuentasporcobrar = ($operacioncontablecuentasporcobrar != '') ? $operacioncontablecuentasporcobrar : 0;
                $objTipoNomina->descripcion = $descrip;

                //Guardando los datos.
                $objTipoNomina->save();
                return 2;
            } else {
                return 3;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * Eliminar un tipo de nómina.
     *
     * @param int $idtiponomina Identificador del tipo de nómina.
     */
    public function eliminarTipoNomina($idtiponomina)
    {

        try {
            $r->cantRowAfected = Doctrine_Query::create()
                ->delete()
                ->from('NomTipoNomina')
                ->where('idtiponomina = ?', $idtiponomina)
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
    public function fnExportarNomenclador($arr)
    {
        $obj = new DatNominaModel();
        $objPHPExcel = new PHPExcel();

        $fila = 1;
        $columna = 1;
        $objPHPExcel->getActiveSheet()->mergeCells('A1:H1');
        $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, 'Tipos de nóminas', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $fila++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'A', $fila, 'Denominación', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $columna++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'B', $fila, 'Acumula vacaciones', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $columna++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'C', $fila, 'Acumula SNC-225', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $columna++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'D', $fila, 'Reintegro', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $columna++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('E')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'E', $fila, 'Tipo moneda', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $columna++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('F')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'F', $fila, 'Operación contable', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $columna++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('G')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'G', $fila, 'Fecha inicio', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $columna++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('H')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'H', $fila, 'Fecha fin', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $fila++;

        foreach ($arr as $val) {
            $columna = 1;
            $vac = ($val['acumulavacaciones'] != 1) ? (($val['acumulavacaciones'] == 2) ?
                'Liquida vacaciones' : 'No acumula ni liquida')
                : 'Acumula vacaciones';
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $val['denominacion'], null, '000000', 'Arial', 10, '000000', 'left', 'left', 0, 0);
            $columna++;
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $vac, null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
            $columna++;
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $val['acumulasnc'] == 1 ? 'Si' : 'No', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
            $columna++;
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $val['textreintegro'], null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
            $columna++;
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $val['tipomoneda'] == 1 ? 'MN' : 'CUC', null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
            $columna++;
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $val['denomoperacioncontable'], null, '000000', 'Arial', 10, '000000', 'left', 'left', 0, 0);
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
