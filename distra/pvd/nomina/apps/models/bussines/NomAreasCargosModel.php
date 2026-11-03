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
class NomAreasCargosModel extends ZendExt_Model
{
    public $cell_align = 'left';
    public $cell_width = 100;

    /**
     * Constructor de la clase.
     */
    public function NomAreasCargosModel()
    {
        parent::ZendExt_Model();
    }

    public function obtenerEstructuraArea($idarea, $chek)
    {

        //Se obtienen los cargos de la plantilla especificada.
        $arrayCargos = NomAreasCargos::obtenerCargosByIdArea($idarea);
        // print_r($arrayCargos);die;
        $arrArbol = array();

        if (count($arrayCargos) > 0) {
            //Se obtienen los �conos de la aplicaci�n.
            $arriconos = $this->integrator->metadatos->obtenerConceptos();

            //Arreglo auxiliar con los cargos que contiene esa plantilla.
            $arrayAux = array();
            foreach ($arrayCargos as $valor => $value) {
                $arrayAux[] = $value['idcargo'];
            }
            // print_r($arrayAux);die;
            $arrCaminosCargos = $this->integrator->metadatos->getRutaEstructura($arrayAux);
            //print_r($arrCaminosCargos);die;
            $rcaminos = array();
            $contrcaminos = 0;
            foreach ($arrCaminosCargos as $cc => $rcam) {
                $rid = explode('/', $arrCaminosCargos[$cc]['rutaId']);
                $rtext = explode('/', $rcam['rutaDenominacion']);
                foreach ($rtext as $t => $text) {
                    $rcaminos[$contrcaminos]['idfila'] = $rid[$t];
                    if ($t == 0) {
                        $rcaminos[$contrcaminos]['idpadre'] = $rcaminos[$contrcaminos]['idfila'];
                    } else {
                        $rcaminos[$contrcaminos]['idpadre'] = $rid[$t - 1];
                    }
                    $estruc = $this->integrator->metadatos->DameEstructura($rid[$t]);
                    //print_r($estruc);die;
                    $rcaminos[$contrcaminos]['idnomeav'] = $estruc[0]->idtipo;
                    $rcaminos[$contrcaminos]['denominacion'] = $text;
                    $contrcaminos++;
                }
            }
            for ($i = 0; $i < count($rcaminos); $i++) {
                for ($j = $i + 1; $j < count($rcaminos); $j++) {
                    if ($rcaminos[$i]['idfila'] == $rcaminos[$j]['idfila']) {
                        unset($rcaminos[$j]);
                        $rcaminos = array_values($rcaminos);
                    }
                }
            }
            if (count($rcaminos) > 0) {

                foreach ($rcaminos as $i => $nodo) {
                    if ($nodo['idfila'] == $nodo['idpadre']) {
                        $n = $this->conformarNodo($nodo, $arriconos, $chek);
                        $n['children'] = $this->conformarArbolRecursivo($rcaminos, $nodo, $arriconos, $chek);
                        $n['expanded'] = true;
                        $arrArbol[] = $n;
                    }
                }
            }
        }
        //print_r($arrArbol);die;
        return $arrArbol;
    }

    /**
     * Funci�n auxiliar para conformar los nodos del �rbol.
     *
     * @param array nodo        Datos del cargo.
     * @param array arriconos    Datos de los �conos de la aplicaci�n.
     *
     * @return array Nodo.
     */
    private function conformarNodo($nodo, $arriconos, $chek)
    {

        $icono = $nodo['idnomeav'];
        foreach ($arriconos as $key => $value) {
            if ($value['idconcepto'] == $icono)
                $icono = $value['icon'];
        }
        $arr = array();
        $arr['id'] = $nodo['idfila'];
        $arr['text'] = $nodo['denominacion'];
        $arr['tipoestructura'] = $nodo['idnomeav'];
        $arr['icon'] = $icono;
        //$arr['icon'] = $nodo['icon'];
        if ($nodo['idnomeav'] == 7)
            $arr['leaf'] = true;
        else $arr['leaf'] = false;
        if ($chek) {
            $arr['checked'] = false;
        }
        $arr['qtip'] = '<b>' . $nodo['denominacion'] . '</b>';
        return $arr;
    }

    /**
     * Funci�n auxiliar para conformar el �rbol de manera recursiva.
     *
     * @param array arrCaminos  Todos los cargos.
     * @param array nodo        Datos del cargo.
     * @param array arriconos    Datos de los �conos de la aplicaci�n.
     *
     * @return array Nodo.
     */
    private function conformarArbolRecursivo($arrCaminos, $nodo, $arriconos, $chek)
    {
        if ($nodo['idnomeav'] == 7)
            return;
        $arrHijos = $this->buscarHijos($arrCaminos, $nodo['idfila']);

        $arrArbol = array();
        foreach ($arrHijos as $k => &$v) {
            $n = $this->conformarNodo($v, $arriconos, $chek);
            $n['children'] = $this->conformarArbolRecursivo($arrCaminos, $v, $arriconos, $chek);
            $n['expanded'] = true;
            $arrArbol[] = $n;
            $i++;
        }
        return $arrArbol;
    }

    /**
     * Funci�n auxiliar para obtener los hijos dado un id del padre.
     *
     * @param array arrCaminos    Todos los cargos.
     * @param int idpadre            Datos del cargo.
     *
     * @return array Arreglo de hijos.
     */
    private function buscarHijos($arrCaminos, $idpadre)
    {
        $arr = array();
        foreach ($arrCaminos as $k => $v) {
            if ($v['idpadre'] == $idpadre && $v['idfila'] != $idpadre) {
                $arr[] = $v;
            }

        }

        return $arr;
    }

    /**
     * Obtener la estructura restante de estructura y composici�n.
     *
     * @param int $identidad Identificador de la entidad.
     * @return array Estructura restantes.
     */
    public function obtenerEstructuraRestantes($identidad, $nodo, $composicion, $multipleseleccioncargos, $idarea)
    {
        //Se obtiene el arreglo de iconos.
        //$arriconos = $this->integrator->metadatos->BuscartodosnomencladoresEAV();

        $arrArbol = array();

        if ($nodo == 'root') {

            $arrayEstru = $this->integrator->metadatos->DameEstructura($identidad);
            //print_r($arrayEstru);die;
            if ($arrayEstru[0]->idnomeav != '') {
                $icon = $this->buscarIcono($arriconos, $arrayEstru[0]->idnomeav);
                $icono = '/metadatos/comun/recursos/iconos/' . $icon . '.gif';
            }
            $arrArbol[0]['id'] = $arrayEstru[0]->idestructura;
            $arrArbol[0]['text'] = $arrayEstru[0]->denominacion;
            $arrArbol[0]['tipoestructura'] = $arrayEstru[0]->idnomeav;
            $arrArbol[0]['icon'] = $arrayEstru[0]->icon;
            if ($arrayEstru[0]->idnomeav == 4 || $arrayEstru[0]->idnomeav == 5) {
                $arrArbol[0]['checked'] = false;
                $arrArbol[0]['leaf'] = true;
            } else {
                $arrArbol[0]['leaf'] = false;
            }
            //$arrArbol[0]['qtip'] ='<b>'.$arrayEstru[0]->text.'</b>';
        } else {

            $arrayAux = array();
            $arrayCargos = array();

            //Si es un area que no tiene asociados cargos que estan en otra area
            if ($multipleseleccioncargos != 1) {
                $arrayCargos = NomAreasCargos::obtenerCargosRegistradorByIdEstruc($identidad);
                //Si es un area que no tiene asociados cargos que estan en otra area
            } else {
                $arrayCargos = NomAreasCargos::obtenerCargosByIdArea($idarea);
            }
            foreach ($arrayCargos as $key => $value) {
                $arrayAux[] = $value['idcargo'];
            }
            $hijosest = $this->integrator->metadatos->DameHijosEstructura($nodo);
            $lug = 0;

            foreach ($hijosest as $x => $y) {
                $exit = in_array($y->id, $arrayAux);
                $expicono = explode('=', $y->icon);
                $icono = '';
                if (count($expicono) > 1) {
                    $icono = '/metadatos/comun/recursos/iconos/' . $expicono[1] . '.gif';
                }
                //print_r($y->idconcepto);die;
                $arrArbol[$lug]['id'] = $y->id;
                $arrArbol[$lug]['text'] = $y->text;
                $arrArbol[$lug]['tipoestructura'] = $y->idconcepto;
                $arrArbol[$lug]['icon'] = $y->icon;


                if ($composicion == 1) {
                    if ($y->idconcepto == 7) {
                        if (!$exit)
                            $arrArbol[$lug]['checked'] = false;
                        $arrArbol[$lug]['leaf'] = true;
                    } else {
                        $arrArbol[$lug]['leaf'] = false;
                    }
                    //$arrArbol[$lug]['qtip'] ='<b>'.$y->text.'</b>';
                } else {
                    if ($y->idconcepto == 3) {
                        //if (!$exit)
                        $arrArbol[$lug]['checked'] = false;
                        $arrArbol[$lug]['leaf'] = true;
                    } else {
                        $arrArbol[$lug]['leaf'] = false;
                    }
                }


                $lug++;

            }
        }

        return $arrArbol;
    }

    /**
     * Funci�n utilizada para buscar un icno de una estructura.
     *
     * @param $arr        Array de iconos.
     * @param $id        Identificador del icono.
     *
     * return stirn Icono
     */
    private function buscarIcono($arr, $id)
    {
        foreach ($arr as $i => $v) {
            if ($v['idnomeav'] == $id) return $v['icono'];
        }
        return 'No conocido';
    }

    /**
     * Insertar una estructura de plantilla nominal.
     *
     * @param int $idarea Identificador de la plantilla nominal.
     * @param int $identidad Identificador de la plantilla nominal.
     * @param int $arrayCargos Arreglo de cargos.
     */
    public function adicionarEstructuraArea($idarea, $identidad, $arrayCargos)
    {
        //Se obtiene los cargos por estructura.
        //$estruccargos=$this->integrator->metadatos->BuscarCargosXIdestructuraSinDominio($identidad);

        /*$arrayCargosEstruc=array();
        foreach($estruccargos as $e=>$value){
          $arrayCargosEstruc[$e]=$value['idcargo'];
        }

        //Se obtienen los cargos seleccionados
        foreach($arrayCargos as $v){
          $aux=array();
          $todosaux=$this->integrator->metadatos->BuscarCargosXIdestructuraSinDominio($v);
          foreach($todosaux as $t=>$val){
            $aux[$t]=$val['idcargo'];
          }
          $arrayCargosEstruc = array_diff($arrayCargosEstruc,$aux);
        }*/

        //Se obtienen los cargos registrados en las plantillas de esa entidad, para verificar que no se repitan
        $arrayCargosReg = ConfPlantillaNominalCargo::obtenerCargosRegistradorByIdEstruc($identidad);

        $arrayCargosEstruc = array();
        //Se verifican los que se van a insertar con los registrados.
        foreach ($arrayCargos as $i => $c) {
            $encontrado = 2;
            foreach ($arrayCargosReg as $j => $cr) {
                if ($c == $cr) {
                    $encontrado = 1;
                    break;
                }
            }
            if ($encontrado == 2) {
                $arrayCargosEstruc[] = $c;
            }
        }

        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $conn->beginTransaction();
        try {
            foreach ($arrayCargosEstruc as $k => $c) {
                /*//Se crea el objeto de la estruc plantilla nominal.
                $objEsctPlantillaN = new NomAreasCargos();
                //Insertando los datos de la  estructura plantilla nominal.
                $objEsctPlantillaN->idcargo = $c;
                $objEsctPlantillaN->idarea = $idarea;
                //Guardando los datos.
                $objEsctPlantillaN->save();*/
                $sql = "INSERT INTO mod_nomina.nom_areascargos(idarea, idcargo) VALUES (?, ?);";
                $conn->exec($sql, array($idarea, $c));/**/

            }
            $conn->commit();
        } catch (Exception $e) {
            $conn->rollback();
        }
    }

    /**
     * Eliminar una estructura de plantilla nominal.
     *
     * @param int $idplantilla Identificador de la plantilla nominal.
     * @param int $arrayCargos Arreglo de cargos.
     */
    public function eliminarEstructuraArea($idplantilla, $arrayCargos)
    {

        NomAreasCargos::eliminarArrayCargos($idplantilla, $arrayCargos);

    }

    //Exportar nomenclador
    public function fnExportarNomenclador($idarea, $area, $arrEstruc)
    {
        //print_r($arrEstruc);die;
        $obj = new DatNominaModel();
        $objPHPExcel = new PHPExcel();

        //Pintando la denominación del área
        $fila = 1;
        $columna = 1;
        $objPHPExcel->getActiveSheet()->mergeCells('A1:I1');
        $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $area, null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);

        //Pintando los cargos
        $fila++;
        foreach ($arrEstruc as $pos => $estructura) {
            if (!empty($estructura['children'])) {
                $columna = 1;
                $objPHPExcel->getActiveSheet()->getColumnDimension(chr($columna + 64))->setWidth(5);
                $this->fnPintarImagen($objPHPExcel, chr($columna + 64) . $fila, $estructura['tipoestructura']);
                //$this->fnGuardarImagen($estructura['icon']);
                $columna = 2;
                $objPHPExcel->getActiveSheet()->getColumnDimension(chr($columna + 64))->setWidth($this->cell_width);
                $obj->fnPintarCelda($objPHPExcel,chr($columna + 64), $fila, $estructura['text'],null, '000000', 'Arial', 10, '000000', $this->cell_align, 'center', 0, 1);
                $fila++;
                //$columna++;
                $this->fnCargosRecursivo($objPHPExcel, $columna, $fila, $estructura['children']);
            }

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

    public function fnCargosRecursivo(&$objPHPExcel, &$nivel, &$fila, $arrEstruc)
    {
        $obj = new DatNominaModel();
        foreach ($arrEstruc as $pos => $estructura) {
            $arrEstruc[$pos]['nivel'] = (($pos + 1) == count($arrEstruc)) ? $nivel++ : $nivel;
            $columna = 1;
            $objPHPExcel->getActiveSheet()->getColumnDimension(chr($columna + 64))->setWidth(5);
            $this->fnPintarImagen($objPHPExcel, chr($columna + 64) . $fila, $estructura['tipoestructura']);
            //$this->fnGuardarImagen($estructura['icon']);
            $columna = 2;
            $objPHPExcel->getActiveSheet()->getColumnDimension(chr($columna + 64))->setWidth($this->cell_width);
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $estructura['text'], null, '000000', 'Arial', 10, '000000', $this->cell_align, 'center', 0, 1);
            $fila++;
            if (!empty($estructura['children'])) {
                //$columna++;
                $this->fnCargosRecursivo($objPHPExcel, $columna, $fila, $estructura['children']);
            }
        }
        //$columna = 1;
    }

    public function fnGuardarImagen($imagebase64)
    {
        //texto plano de imagen en base 64
        $base_to_php = explode(',', $imagebase64);
        $imagebin = base64_decode($base_to_php[1]);

        //ruta donde se guardará momentáneamente en el servidor
        $dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
        $filepath = $dir_www . "/pvd/nomina/views/images/icon2.png";

        //guardando la imagen
        file_put_contents($filepath, file_get_contents($imagebase64));
    }

    public function fnPintarImagen(&$objPHPExcel, $celda, $tipoestructura)
    {
        $dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
        $imagepath = $dir_www . "/pvd/nomina/views/images/icon_estructuras/" . $tipoestructura . ".png";
        if (file_exists($imagepath)) {
            $objPHPExcelDrawing = new PHPExcel_Worksheet_Drawing();
            $objPHPExcelDrawing->setPath($imagepath);
            $objPHPExcelDrawing->setCoordinates($celda);
            $objPHPExcelDrawing->setResizeProportional(false);
            $objPHPExcelDrawing->setWidth(15);
            $objPHPExcelDrawing->setHeight(15);
            $objPHPExcelDrawing->setOffsetX(2);
            $objPHPExcelDrawing->setOffsetY(2);

            $objPHPExcelDrawing->setWorksheet($objPHPExcel->getActiveSheet());
        }
    }
}
