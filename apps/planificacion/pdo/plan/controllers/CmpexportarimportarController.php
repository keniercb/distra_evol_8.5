<?php

$address = dirname(dirname(__FILE__));
$address = str_ireplace('o/plan', 'o/comun/recursos/', $address);
include_once($address . 'IcalExporter.php');

class CmpexportarimportarController extends ZendExt_Controller_Secure
{

    /**
     * Inicializar los atributos de la clase
     */
    function init()
    {
        parent::init();

    }

    /**
     * Nombre de la funcion exportarAction
     * Descripcion Funcion que se encarga de exportar los datos de los
     * elementos seleccionados, en este caso en un archivo encriptado.
     *
     * @author * Mairelys Fernandez
     */
    function exportarAction()
    {   
        //include_once('A:\Trabajo\sites\sipac-gen.prod.xetid.cu\htdocs\sige\apps\planificacion\pdo\comun\recursos\IcalExporter.php');
        
        $address = dirname(dirname(__FILE__));
$address = str_ireplace('o/plan', 'o/comun/recursos/', $address);
include_once($address . 'IcalExporter.php');
        $export = new ICalExporter();
        $idusuario = $this->global->Perfil->idusuario;
        $arrayidelementos = json_decode(
            stripslashes($this->_request->getParam("arrayidelementos"))
        );
        $tipoelemento = $this->_request->getParam('tipoelemento');
        $opcionformato = $this->_request->getParam('opcionformato');
        $relacionEntreElem = $this->_request->getParam('relacion');
        $descendencia = $this->_request->getParam('descendencia');
        $repeticiones = $this->_request->getParam('repeticiones');
        $sincronizar = $this->_request->getParam('sincronizar');
        $dominioSincronizar = $this->_request->getParam('dominioSincronizar');
        $escenario = $this->_request->getParam('escenario');

        $objcmpintercambio = new CmpIntercambioModel();
        $objcmpintercambio->ExportarElementos(
            $idusuario, $arrayidelementos, $tipoelemento, $opcionformato,
            $relacionEntreElem, $descendencia, $repeticiones, $sincronizar,
            $dominioSincronizar, $escenario, $export
        );

    }


    /**
     * Nombre de la funcion importarAction
     * Descripcion Funcion que se encarga de insertar la informacion nueva en
     * la BD. Devuelve los elementos y arc nuevos y los repetidos.
     *
     * @author * Mairelys Fernandez
     */
    function importarAction()
    {
        $export = new ICalExporter();
        $idusuario = $this->global->Perfil->idusuario;
        $ical = 0;
        $fichero = $_FILES['file']['tmp_name'];
        if (file_exists($fichero)) {
            $propiedades = pathinfo($_FILES['file']['name']);
            $extension = $propiedades['extension'];

            $dirindex = $_SERVER['SCRIPT_FILENAME'];
            $temppath = substr($dirindex, 0, strrpos($dirindex, 'web'))
                . 'apps/planificacion/';
            $idimportacion = time();

            if ($extension == 'sipac') {
                $tempfile = $temppath . $idimportacion . ".db";
                copy($fichero, $tempfile);
                $objintercambiosipac = new IntercambioSipacModel();
                $respuesta = $objintercambiosipac->ImportarDatosSipac(
                    $tempfile
                );
            } else {
                if ($extension == 'xlsx' || $extension == 'xls') {

                    $tempfile
                        = $temppath . $idimportacion . "." . $extension;
                    copy($fichero, $tempfile);

                    //cargar archivo
                    $objPHPExcel = PHPExcel_IOFactory::load($tempfile);

                    $comprobacion = $this->ComprobarFormatoLibroExcel(
                        $objPHPExcel
                    );
                    if ($comprobacion != 0) {
                        ob_clean();
                        flush();
                        unlink($tempfile);
                        echo json_encode(
                            array('success'   => false,
                                  'respuesta' => $comprobacion)
                        );
                        return true;
                    }

                    $objintercambioexcel = new IntercambioExcelModel();
                    $respuesta = $objintercambioexcel->ImportarDatosExcel(
                        $objPHPExcel, $idimportacion
                    );
                    ob_clean();
                    flush();
                    unlink($tempfile);
                } else {
                    if ($extension == 'ics') {
                        $objactividades = new CmpgestionaractividadesModel();
                        $ical = file_get_contents($fichero);
                        $events = $export->toHash($ical, 'pa');
                        //print_r($events);die;

                        $respuesta = $objactividades->AdicionarDesdeIcal(
                            $events, $idusuario
                        );
                        //print_r($respuesta);die;

                    } else {
                        $objintercambiosipac = new IntercambioCalendarioModel();
                        $respuesta
                            = $objintercambiosipac->ImportarDatosCalendario(
                            $fichero
                        );
                    }
                }
            }

            echo json_encode($respuesta);

            /*$arrayfallos = array();
            if (isset($respuesta['fallos'])) {
                $arrayfallos = $respuesta['fallos'];
            }
            $arrayrepetidos = array();
            if (isset($respuesta['repetidos'])) {
                $arrayrepetidos = $respuesta['repetidos'];
            }
            //print_r($arrayrepetidos);die;
            echo json_encode(
                array('success'       => true,
                    'repetidos' => $arrayrepetidos,
                      'fallos'        => $arrayfallos,
                      'idimportacion' => $idimportacion, 'ical' => $ical)
            );*/
        }
    }

    private function ComprobarFormatoLibroExcel($objPHPExcel)
    {
        $respuesta = 0;
        if ($objPHPExcel->getSheetCount() == 3) {
            if ($objPHPExcel->getSheet(0)->getTitle() == 'Planificacion'
                || $objPHPExcel->getSheet(1)->getTitle()
                == 'Configuracion nivel superior'
                || $objPHPExcel->getSheet(2)->getTitle()
                == 'Configuracion nivel'
            ) {
                $objworksheet = $objPHPExcel->getSheet(0);
                $objworsheetNomencladores = $objPHPExcel->getSheet(1);
                $highestColumn = $objworksheet->getHighestColumn(
                ); //no puede ser diferente de 'R'
                $highestColumnIndex = PHPExcel_Cell::columnIndexFromString(
                    $highestColumn
                ); //no puede ser diferente a 18
                $highestColumnNomencladores
                    = $objworsheetNomencladores->getHighestColumn(
                ); //no puede ser diferente de 'K'
                $highestColumnIndexNomencladores
                    = PHPExcel_Cell::columnIndexFromString(
                    $highestColumnNomencladores
                ); //no puede ser diferente a 11

                if ($highestColumn == 'V' || $highestColumnIndex == 22
                    || $highestColumnNomencladores == 'K'
                    || $highestColumnIndexNomencladores == 11
                ) {
                    for ($column = 1; $column < $highestColumnIndex; $column++)
                    {
                        $stringFromColumnIndex
                            = PHPExcel_Cell::stringFromColumnIndex($column);
                        $coordenada = $stringFromColumnIndex
                            . '4'; // 4 representa la fila
                        $valorcelda = $objworksheet->getCell($coordenada)
                            ->getValue();

                        $respuesta = ($valorcelda == 'Tipo de elemento'
                            || $valorcelda == 'CAR'
                            || $valorcelda == 'Nivel'
                            || $valorcelda == 'Denominación'
                            || $valorcelda == 'Fecha de inicio'
                            || $valorcelda == 'Fecha fin'
                            || $valorcelda == 'Hora inicio'
                            || $valorcelda == 'Hora fin'
                            || $valorcelda == 'Categoría'
                            || $valorcelda == 'Tipo de actividad'
                            || $valorcelda == 'Actividad principal'
                            || $valorcelda == 'Actividad extraplan'
                            || $valorcelda == 'Capítulo del ARC'
                            || $valorcelda == 'Autor'
                            || $valorcelda
                            == 'Identificador de estado de aprobación'
                            || $valorcelda == 'Estado de aprobación'
                            || $valorcelda == 'Estado de cumplimiento'
                            || $valorcelda == 'Participantes'
                            || $valorcelda == 'Dirigentes'
                            || $valorcelda == 'Observaciones') ? 0 : 4;
                    }
                    $titulotabla = $objworsheetNomencladores->getCell('B3')
                        ->getValue();
                    for ($columnas = 1; $columnas < 7; $columnas++) {
                        $stringFromColumnIndex
                            = PHPExcel_Cell::stringFromColumnIndex($columnas);
                        $coordenada = $stringFromColumnIndex
                            . '3'; // 3 representa la fila
                        $valorcelda = $objworsheetNomencladores->getCell(
                            $coordenada
                        )->getValue();
                        $respuesta = ($titulotabla == 'Tabla de Nomencladores'
                            || $valorcelda == 'Nomencladores de Elementos'
                            || $valorcelda == 'Categoría del plan'
                            || $valorcelda == 'Unidad de Medida del Criterio'
                            || $valorcelda == 'Categoria de la actividad'
                            || $valorcelda == 'Estado de Cumplimiento'
                            || $valorcelda == 'Tipo de Actividad') ? 0 : 5;
                    }
                } else {
                    $respuesta = 3;
                }
            } else {
                $respuesta = 2;
            }//throw new ZendExt_Exception('PIE002')
        } else {
            $respuesta = 1;
        }//throw new ZendExt_Exception('PIE001')

        return $respuesta;
    }

    /**
     * Nombre de la función devolverDatosElementosHijosAction
     * Descripcion Funcion que devuelve los hijos de un elemento/arc determinado.
     *
     * @author * Mairelys Fernandez
     */
    function devolverDatosElementosHijosAction()
    {
        $idimportacion = $this->_request->getParam('importacion');
        $idelemento = $this->_request->getParam('anode');
        $tipo = $this->_request->getParam('tipo');
        $objetoimpmodel = new CmpIntercambioModel();
        $respuesta = $objetoimpmodel->devolverElementosHijos(
            $idimportacion, $idelemento, $tipo
        );
        if (isset($respuesta)) {
            echo json_encode(
                array('success' => true, 'infhijos' => $respuesta['infhijos'])
            );
        } else {
            echo json_encode(array('success' => true, 'infhijos' => array()));
        }
    }

    /**
     * Nombre de la funcion devolverDatosElementosHijosAction
     * Descripcion Funcion que sobrescribe o no, segun la seleccion del usuario,
     * los elementos en la BD y devuelve los elementos de un tipo determinado.
     *
     * @author * Mairelys Fernandez
     */
    public function insertarInformacionAction()
    {
        $sobrescribir = $this->_request->getPost('sobrescribir');
        $idimportacion = $this->_request->getPost('idimportacion');
        $tipoelemento = $this->_request->getPost('tipoelemento');
        $iddominio = $this->global->Perfil->iddominio;
        $idusuario = $this->global->Perfil->idusuario;
        $session = Zend_Registry::get('session');
        $certificado = $session->certificado;
        $objcmpintercambio = new CmpIntercambioModel();
        $respuesta = $objcmpintercambio->InsertarInformacionBDLocal(
            $sobrescribir, $idimportacion, $tipoelemento, $iddominio,
            $idusuario, $certificado
        ); //8

        if (isset($respuesta['resultado'])) {
            echo json_encode(
                array('success' => true, "total" => $respuesta['total'],
                      "campos"  => $respuesta['resultado'])
            );
        }
        if (!isset($respuesta)) {
            echo json_encode(
                array('success' => true, 'total' => 0, 'campos' => array())
            );
        }
        $this->cancelarAction($idimportacion);
    }

    /**
     * Nombre de la funcion datosElementoComparacionAction
     * Descripcion Funcion que devuelve la informacion de un elemento que se
     * encuentra en la BD y la que esta en las tablas de respaldo
     * (inf. del fichero) para hacer la comparacion.
     *
     * @author * Mairelys Fernandez
     */
    function datosElementoComparacionAction()
    {
        $id = $this->_request->getParam('idelemento');
        $tipo = $this->_request->getParam('tipoelemento');
        $idimportacion = $this->_request->getParam('importacion');
        $objcmpintercambio = new CmpIntercambioModel();
        $respuesta = $objcmpintercambio->comparacion_Persistido_Repetido(
            $id, $tipo, $idimportacion
        ); //6

        if (isset($respuesta)) {
            echo json_encode(
                array('success'           => true,
                      'datosAImport'      => $respuesta['datosAImport'],
                      'datosPersistentes' => $respuesta['datosPersistentes'])
            );
        } else {
            echo json_encode(
                array('success'           => true, 'datosAImport' => array(),
                      'datosPersistentes' => array())
            );
        }
    }

    public function cancelarAction($idimportacion = null)
    {
        $idimportacion = $this->_request->getPost('idimportacion');
        $dirindex = $_SERVER['SCRIPT_FILENAME'];
        $temppath = substr($dirindex, 0, strrpos($dirindex, 'web'))
            . 'apps/planificacion/temp/';
        unlink($temppath . $idimportacion . ".db");
    }


    public function definirElementosFinalesAction()
    {
        $parametros->arrayElementosExistentes = json_decode(
            stripslashes($this->_request->getParam("arrayElementosExistentes"))
        );
        $parametros->arrayIdElementosOriginales = json_decode(
            stripslashes(
                $this->_request->getParam("arrayIdElementosOriginales")
            )
        );
        $parametros->accion = $this->_request->getParam("accion");

        $objcmpintercambio = new CmpIntercambioModel();
        $respuesta = $objcmpintercambio->DefinirElementosFinales($parametros);
        echo json_encode(array('respuesta' => $respuesta));
    }
}

