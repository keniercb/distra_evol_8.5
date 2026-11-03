<?php

/**
 * Modelo de negocio para gestionar los salarios escalas.
 *
 * @author Tte. Darien Cabrera O.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Modelo de negocio
 * @uses NomSalarioEscala, Entidad salario escala (Clase del dominio).
 * @copyright UCID
 * @version 1.0
 */
class NomSalarioEscalaModel extends ZendExt_Model
{

    /**
     * Constructor de la clase.
     */
    public function NomSalarioEscalaModel()
    {
        parent::ZendExt_Model();
    }


    /**
     * Obtener el arreglo de la estructura necesario para construir dinámicamente la vista a partir
     * de los sectores salariales.
     *
     * @return array Arreglo de estructura.
     */
    public function obtenerArregloEstructura()
    {

        //Obteniendo los datos de los sectores salariales.
        $sectores = NomSectorSalarial::obtenerTodosSectores();

        //Arreglo de los campos para insertar los salarios escala de cada sector salarial.
        $campos = array();

        //Insertando los datos en los arreglos.
        foreach ($sectores as $llave => $valor) {


            //Encabezado del textfield para insertar el salario escala(Abreviatura del sector salarial).
            $campos[$llave]['header'] = $valor['abreviatura'];

            //Nombre del textfield que hace de referencia al store de los salarios escala.
            $campos[$llave]['name'] = 'sector_' . $valor['idsectorsalarial'];
        }

        //Retornando el arreglo de la estructura.
        return array("campos" => $campos);
    }

    /**
     * Obtener un listado de los datos de los salarios esclas.
     *
     * @param int $inicio Inicio de la busqueda.
     * @param int $limite Limite maximo de la busqueda.
     *
     * @return array Listado de salarios escalas.
     */
    public function obtenerListadoSalariosEscalas($inicio = 0, $limite = 10)
    {
        /* select *
         from mod_nomina.nom_salarioescala se
         inner join mod_nomina.nom_grupoescala ge on ge.idgrupoescala = se.idgrupoescala
         inner join mod_nomina.nom_sectorsalarial ss on ss.idsectorsalarial = se.idsectorsalarial*/

        //Array con los grupos escalas que se van a listar sus salarios escalas.
        $arrayGE = NomSalarioEscala::obtenerGruposEscalasListar($inicio, $limite);
        //Se estructura el arreglo a devolver.
        $resultado = array();

        foreach ($arrayGE as $key => $value) {
            $resultado[$key]['idgrupoescala'] = $value['idgrupoescala'];
            //Arreglo de identificadores de salarios escalas.
            $arrayIdSalEsc = array();

            //Se obtienen los salarios escalas del grupo escala especificado.
            $arraySalEsc = NomSalarioEscala::obtenerSalariosEscalasByIdGrupoE($value['idgrupoescala']);
            foreach ($arraySalEsc as $llave => $valor) {
                if ($llave == 0) {
                    $resultado[$key]['denomgrupoescala'] = $valor['denominacion'];
                    $resultado[$key]['fechainicio'] = $valor['fechainicio'];
                    $resultado[$key]['fechafin'] = $valor['fechafin'];
                }
                $arrayIdSalEsc[] = $valor['idsalarioescala'];
                $resultado[$key]['sector_' . $valor['idsectorsalarial']] = $valor['salario'];
            }
            $resultado[$key]['arrayidsalesc'] = $arrayIdSalEsc;
        }
        //Retornando el listado de salarios escalas.
        return $resultado;
    }

    /**
     * Obtener la cantidad total de salarios escalas.
     *
     * @return int Cantidad total de salarios escalas.
     */
    public function obtenerCantidadTotalSalariosEscalas()
    {

        //Retornando la cantidad total de salarios escalas.
        return NomSalarioEscala::obtenerCantidadTotalSalariosEscalas();
    }

    /**
     * Insertar salarios escalas.
     *
     * @param int $idgrupoescala Identificador del grupo escala.
     * @param string $finicio Fecha de inicio de creacion del salario escala.
     * @param string $ffin Fecha de fin de uso del salario escala.
     * @param array $salarios Arreglo de salarios escalas.
     */
    public function adicionarSalariosEscalas($idgrupoescala, $finicio, $ffin, $salarios)
    {

        //Se recorre el arreglo de salarios y se va insertando.
        foreach ($salarios as $key => $value) {

            //Se obtiene el id del sector y el importe.
            list($aux, $idsector, $salario) = split('[_-]', $value);

            //Se crea el objeto del salario escala.
            $objSalEsc = new NomSalarioEscala();

            //Insertando los datos del tipo de pago.
            $objSalEsc->idgrupoescala = $idgrupoescala;
            $objSalEsc->idsectorsalarial = $idsector;
            $fecha = split('/', $finicio);
            $objSalEsc->fechainicio = ($finicio) ? $fecha[2] . '/' . $fecha[1] . '/' . $fecha[0] : null;
            $fecha = split('/', $ffin);
            $objSalEsc->fechafin = ($ffin) ? $fecha[2] . '/' . $fecha[1] . '/' . $fecha[0] : null;
            $objSalEsc->salario = ($salario) ? $salario : 0;

            //Guardando los datos.
            $objSalEsc->save();
        }

    }

    /**
     * Modificar salarios escalas.
     *
     * @param int $idgrupoescala Identificador del grupo escala.
     * @param string $finicio Fecha de inicio de creacion del salario escala.
     * @param string $ffin Fecha de fin de uso del salario escala.
     * @param array $salarios Arreglo de salarios escalas.
     */
    public function modificarSalariosEscalas($idgrupoescala, $finicio, $ffin, $salarios)
    {

        $this->eliminarSalariosEscalas($idgrupoescala);
        $this->adicionarSalariosEscalas($idgrupoescala, $finicio, $ffin, $salarios);
    }

    /**
     * Eliminar salarios escalas.
     *
     * @param int $idgrupoescala Identificador del tipo de pago.
     */
    public function eliminarSalariosEscalas($idgrupoescala)
    {

        try {
            $r->cantRowAfected = Doctrine_Query::create()
                ->delete()
                ->from('NomSalarioEscala')
                ->where('idgrupoescala = ?', $idgrupoescala)
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
    public function fnExportarNomenclador($arr, $arrEstruc)
    {
        //print_r($arrEstruc);die;
        //print_r($arr);die;
        $obj = new DatNominaModel();
        $objPHPExcel = new PHPExcel();
        $fila = 1;
        $columna = 1;

        //Definiendo la cantidad de columnas que tiene el reporte
        $cant = count($arrEstruc['campos']) + 2;
        $objPHPExcel->getActiveSheet()->mergeCells('A1:' . chr($columna + $cant + 64) . '1');
        $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, 'Salarios escalas', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $fila++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'A', $fila, 'Grupo escala', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $columna++;
        foreach ($arrEstruc['campos'] as $campoest) {
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $campoest['header'], null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
            $columna++;
        }

        $objPHPExcel->getActiveSheet()->getColumnDimension(chr($columna + 64))->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, 'Fecha inicio', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $columna++;
        $objPHPExcel->getActiveSheet()->getColumnDimension(chr($columna + 64))->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, 'Fecha fin', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $fila++;

        foreach ($arr as $val) {
            $columna = 1;
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $val['denomgrupoescala'], null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
            $columna++;
            foreach ($arrEstruc['campos'] as $campoest) {
                $valor = (!empty($val[$campoest['name']])) ? $val[$campoest['name']] : '';
                $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $valor, null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
                $columna++;
            }
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
