<?php
/**
 * GestcartatecnologicaController
 * Controlador para gestionar las Cartas Tecnologicas
 *
 * @ author Damian Oscar Falcon Borras
 * @ package Planificaci?n
 * @ subpackage Planificaci?n Empresarial y Presupuestaria
 * @ copyright SPO-UAM
 * @ version 1.0-0
 * */
$dirWwww = $_SERVER["DOCUMENT_ROOT"];
//Direccion del Marco de trabajo relativa a la carpeta de publicacion.
$dirRelMt = "/";
//Direccion absoluta del marco de trabajo
$dirAbsMt = str_replace(
    "//", "/", dirname($dirWwww . "..") . "/" . $dirRelMt
);
$config["include_path"] = get_include_path();

$config['include_path'] .= '' . PATH_SEPARATOR . $dirAbsMt
    . 'apps/planificacion/planmeta/comun/lib/tcpdf/';
$config['include_path'] .= '' . PATH_SEPARATOR . $dirAbsMt
    . 'apps/planificacion/planmeta/comun/lib/tcpdf/config/';
$config['include_path'] .= '' . PATH_SEPARATOR . $dirAbsMt
    . 'apps/planificacion/planmeta/comun/lib/tcpdf/fonts/';
$config['include_path'] .= '' . PATH_SEPARATOR . $dirAbsMt
    . 'apps/planificacion/planmeta/comun/lib/tcpdf/include/';
$config['include_path'] .= '' . PATH_SEPARATOR . $dirAbsMt
    . 'apps/planificacion/planmeta/comun/lib/tcpdf/tools/';
set_include_path($config["include_path"]);

class ControlejecucionoaceController extends ZendExt_Controller_Secure
{

    /**
     * init
     * Inicializar el componente
     * */
    public function init()
    {
        parent::init();
    }

    public function controlejecucionoaceAction()
    {
        $this->render();
    }

    public function listarCentroBalanceAction()
    {
        ini_set("max_execution_time", 3600); //1hora
        $idcentrobalance = 1;
        $centrobalance
            = DatEntidaddatosnomenclador::getEntidadDadoComportamiento(
                $idcentrobalance
            );

        foreach ($centrobalance as $k => $valor) {
            $dat[$k]['idcentrobalance'] = $valor['identidaddatosnomenclador'];
            $datosentidad = $this->integrator->metadatos->DameEstructura(
                $valor['identidad']
            );
            $dat[$k]['centrobalance'] = $datosentidad[0]->denominacion;
        }

        echo json_encode(array('data' => $dat));
    }

    public function listarDemandaAction()
    {

        $params['filtros'] = $this->_request->getPost('filtros');
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['idvalor'] = $this->_request->getPost('idvalor');
        $params['idcant'] = $this->_request->getPost('idcant');
        $params['idmes'] = $this->_request->getPost('idmes');

        ini_set("max_execution_time", 3600);
        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $datos) {
                if ($datos ['field'] == 'codigo') {
                    $params ['filtros']['codigo'] = $datos ['data'] ['value'];
                } else {
                    if ($datos ['field'] == 'denominacion') {
                        $params ['filtros']['denominacion']
                            = $datos ['data'] ['value'];
                    } else {
                        if ($datos ['field'] == 'numeropieza') {
                            $params ['filtros']['numeropieza']
                                = $datos ['data'] ['value'];
                        } else {
                            if ($datos ['field'] == 'um') {
                                $params ['filtros']['um']
                                    = $datos ['data'] ['value'];
                            } else {
                                if ($datos ['field'] == 'preciodemanda') {
                                    $params ['filtros']['preciodemanda']
                                        = $datos ['data'] ['value'];
                                } else {
                                    if ($datos ['field'] == 'demanda') {
                                        $params ['filtros']['demanda']
                                            = $datos ['data'] ['value'];
                                    } else {
                                        if ($datos ['field']
                                            == 'importeplanif'
                                        ) {
                                            $params ['filtros']['importeplanif']
                                                = $datos ['data'] ['value'];
                                        } else {
                                            if ($datos ['field']
                                                == 'precioejecutado'
                                            ) {
                                                $params ['filtros']['precioejecutado']
                                                    = $datos ['data'] ['value'];
                                            } else {
                                                if ($datos ['field']
                                                    == 'importecontratado'
                                                ) {
                                                    $params ['filtros']['importecontratado']
                                                        = $datos ['data'] ['value'];
                                                } else {
                                                    if ($datos ['field']
                                                        == 'viaadquisicion'
                                                    ) {
                                                        $params ['filtros']['viaadquisicion']
                                                            = $datos ['data'] ['value'];
                                                    } else {
                                                        if ($datos ['field']
                                                            == 'organosatisface'
                                                        ) {
                                                            $params ['filtros']['organosatisface']
                                                                = $datos ['data'] ['value'];
                                                        } else {
                                                            if ($datos ['field']
                                                                == 'naturaleza'
                                                            ) {
                                                                $params ['filtros']['naturaleza']
                                                                    = $datos ['data'] ['value'];
                                                            } else {
                                                                if ($datos ['field']
                                                                    == 'centrobalance'
                                                                ) {
                                                                    $params ['filtros']['centrobalance']
                                                                        = $datos ['data'] ['value'];
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        $obj = new DatEjecucionoaceModel();
        $todos = $obj->idIndic();
        foreach ($todos as $value) {
            if( $value['idindicador']!=""){
            if ($obj->listarDemanda($params, $value['idindicador']) == null) {
                continue;
            } else {
                $ind[] = $obj->listarDemanda($params, $value['idindicador']);
            }
            }
            $k = 0;
            if ($ind != null) {

            }
            foreach ($ind as $kData) {
                foreach ($kData->data as $valor) {

                    $indicadores[$k]['codigo'] = $valor['codigo'];
                    $indicadores[$k]['denominacion'] = $valor['denominacion'];
                    $indicadores[$k]['numeropieza'] = $valor['numeropieza'];
                    $indicadores[$k]['um'] = $valor['um'];
                    $indicadores[$k]['precio'] = number_format(
                        $valor['precio'], '3', '.', ','
                    );$indicadores[$k]['ejecutar'] = number_format(
                        $valor['ejecutar'], '3', '.', ','
                    );
                    $indicadores[$k]['importeplanif'] = number_format(
                        $valor['importeplanif'], '3', '.', ','
                    );
                    $importecontratado = $valor['contratado']
                        * $valor['preciocontrado'];
                    $indicadores[$k]['importecontratadototal']
                        = $importecontratado;
                    $indicadores[$k]['importecontratado'] = number_format(
                        $importecontratado, '3', '.', ','
                    );
                    $importeejecutado = $valor['ejecutado']
                        * $valor['precioejecutado'];

                    $porciento=($importeejecutado*100)/$importecontratado;
                    $indicadores[$k]['porciento'] = number_format(
                        $porciento, '1', '.', ','
                    );


                    $indicadores[$k]['importeejecutadototal']
                        = $importeejecutado;
                    $indicadores[$k]['importeejecutado'] = number_format(
                        $importeejecutado, '3', '.', ','
                    );
                    $indicadores[$k]['viaadquisicion']
                        = $valor['viaadquisicion'];
                    $indicadores[$k]['idejecucionoace']
                        = $valor['idejecucionoace'];
                    $indicadores[$k]['organosatisface']
                        = $valor['organosatisface'];
                    $indicadores[$k]['naturaleza'] = $valor['naturaleza'];
                    $indicadores[$k]['idajusteexistenciacb']
                        = $valor['idajusteexistenciacb'];
                    $datosentidad
                        = $this->integrator->metadatos->DameEstructura(
                            $valor['identidad']
                        );
                    $indicadores[$k]['centrobalance']
                        = $datosentidad[0]->denominacion;
                    $indicadores[$k]['idejecucionoace']
                        = $valor['idejecucionoace'];
                    $indicadores[$k]['tipo'] = $valor['tipo'];
                    $indicadores[$k]['idejecucionoaceindicador']
                        = $valor['idejecucionoaceindicador'];
                    $indicadores[$k]['mes'] = $valor['mes'];
                    $indicadores[$k]['demanda'] = number_format(
                        $valor['cantidad'], '3', '.', ','
                    );
                    $indicadores[$k]['contratado'] = number_format(
                        $valor['contratado'], '3', '.', ','
                    );
                    $indicadores[$k]['ejecutado'] = number_format(
                        $valor['ejecutado'], '3', '.', ','
                    );
                    $indicadores[$k]['idindicador'] = $valor['idindicador'];
                    if ($valor['preciocontrado'] == 0) {
                        $indicadores[$k]['preciocontrado'] = number_format(
                            $valor['precio'], '3', '.', ','
                        );
                    } else {
                        $indicadores[$k]['preciocontrado'] = number_format(
                            $valor['preciocontrado'], '3', '.', ','
                        );
                    }
                    if ($valor['precioejecutado'] == 0
                        && $valor['preciocontrado'] != 0
                    ) {
                        $indicadores[$k]['precioejecutado'] = number_format(
                            $valor['preciocontrado'], '3', '.', ','
                        );
                    } else {
                        if ($valor['precioejecutado'] == 0
                            && $valor['preciocontrado'] == 0
                        ) {
                            $indicadores[$k]['precioejecutado'] = number_format(
                                $valor['precio'], '3', '.', ','
                            );
                        } else {
                            if ($valor['precioejecutado'] != 0) {
                                $indicadores[$k]['precioejecutado']
                                    = number_format(
                                        $valor['precioejecutado'], '3', '.', ','
                                    );
                            }
                        }
                    }
                    $k++;
                }
            }
        }

        foreach ($indicadores as $valor) {
            $sumacontratado += $valor['importecontratadototal'];
            $sumaejecutado += $valor['importeejecutadototal'];
            $sumaaprobado+=$valor['importeplanif'];
            $indicadores[0][sumacontratado] = number_format(
                $sumacontratado, '3', '.', ','
            );
            $indicadores[0][sumaeje] = number_format(
                $sumaejecutado, '3', '.', ','
            );
            $indicadores[0][sumaaprobado] = number_format(
                $sumaaprobado, '3', '.', ','
            );
        }
        if ($indicadores == null) {
            echo json_encode(array('data' => array()));
        } else {
            echo json_encode(array('data' => $indicadores));
        }
    }

    public function listarTotalAction()
    {
        $obj = new DatEjecucionoaceModel();

        $todos = $obj->listarTotal();
        $sumaCont=0;
        $sumEjec=0;
        $sumaplanif=0;

        foreach ($todos->data as $valor) {
            $sumaCont += $valor['importecontratado'];
            $sumEjec += $valor['importeejecutado'];
            $sumaplanif +=  $valor['importeplanif'];

        }
        $t[0]['importeplanif'] = $sumaplanif;
        $t[0]['importecontratado'] = $sumaCont;
        $t[0]['importeejecutado'] = $sumEjec;

        echo json_encode(array('data' => $t));
    }

    public function listarPermisoCBAction()
    {
        ini_set("max_execution_time", 3600); //1hora
        $idcentrobalance = 1;
        $idejercicio = 15;
        $centrobalance = DatEjecucionoaceModel::getEntidadDadoComportamiento(
            $idcentrobalance, $idejercicio
        );

        foreach ($centrobalance->data as $k => $val) {
            $dato[$k]['idcentrobalance'] = $val['idcentrobalance'];
            $datosentidad = $this->integrator->metadatos->DameEstructura(
                $val['identidad']
            );
            $dato[$k]['centrobalance'] = $datosentidad[0]->denominacion;
            $dato[$k]['puntualizar'] = $val['puntualizar'];
            $dato[$k]['idejecucionpermiso'] = $val['idejecucionpermiso'];
        }

        echo json_encode(
            array('data'  => array_slice(
                $dato, $this->_request->getPost('start'),
                $this->_request->getPost('limit')
            ),
                  'total' => count($dato))
        );
    }

    public function listarIndicadoresAction()
    {
        ini_set("max_execution_time", 3600);
        $params['idmes'] = $this->_request->getPost('idmes');

        $indicador = DatEjecucionoace::listarIndicadores($params);

        foreach ($indicador->data as $k => $valor) {
            $dat[$k]['codigo'] = $valor['codigo'];
            $dat[$k]['idindicador'] = $valor['idindicador'];
            $dat[$k]['denominacion'] = $valor['denominacion'];
            $dat[$k]['numeropieza'] = $valor['numeropieza'];
            $dat[$k]['um'] = $valor['denominacionunidadmedida'];
            $dat[$k]['precio'] = $valor['precio'];
        }
        echo json_encode(
            array('data'  => array_slice(
                $dat, $this->_request->getPost('start'),
                $this->_request->getPost('limit')
            ),
                  'total' => count($dat))
        );
    }
    public function listarOrganosAction()
    {
       $obj= new NomOrganosatisface();
        $result= $obj->obtenerOS();

        echo json_encode( array('data' => $result ));
    }

    public function adicionarIndicadorAction()
    {
        ini_set("max_execution_time", 3600); //1hora
        $params['indicador'] = json_decode(
            stripslashes($this->_request->getPost('indicador'))
        );
        $params['cantidad'] = $this->_request->getPost('cantidad');
        $params['mes'] = $this->_request->getPost('idmes');
        $params['identidad'] = $this->global->Estructura->idestructura;
        $params['tipo'] = 1;
        $model = new DatEjecucionoaceModel();

        $datos = $model->adicionarIndicador($params);

        if ($datos) {
            echo json_encode(array('codMsgA' => 1));
        } else {
            echo json_encode(array('codMsgA' => 22));
        }
    }

    public function adicionarPermisoAction()
    {
        $params['idpermisos'] = json_decode(
            stripslashes($this->_request->getPost('idpermisos'))
        );
        $model = new DatEjecucionoaceModel();
        $datos = $model->adicionarP($params['idpermisos']);
        if ($datos) {
            echo json_encode(array('codMsgA' => 1));
        } else {
            echo json_encode(array('codMsgA' => 22));
        }
    }

    public function guardarEjecucionAction()
    {
        $params['idejecucion'] = json_decode(
            stripslashes($this->_request->getPost('idejecucion'))
        );
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['modificados'] = json_decode(
            stripslashes($this->_request->getPost('modificados'))
        );
        $params['mes'] = $this->_request->getPost('idmes');
        $model = new DatEjecucionoaceModel();
        $datos = $model->guardarEjecucion($params);
        if ($datos) {
            echo json_encode(array('codMsgA' => 1));
        } else {
            echo json_encode(array('codMsgA' => 1));
        }
    }

    public function guardarPuntualAction()
    {

        $params['idpuntual'] = json_decode(
            stripslashes($this->_request->getPost('idpuntual'))
        );

        $model = new DatEjecucionoaceModel();

        $datos = $model->guardarPuntual($params);
        if ($datos) {
            echo json_encode(array('codMsgA' => 1));
        } else {
            echo json_encode(array('codMsgA' => 22));
        }
    }

    public function eliminarIndicadorAction()
    {
        $params['indicador'] = json_decode(
            stripslashes($this->_request->getPost('indicador'))
        );
        $params['mes'] = $this->_request->getPost('idmes');
        $model = new DatEjecucionoaceModel();
        $datos = $model->eliminarIndicador($params);
        if ($datos) {
            echo json_encode(array('codMsgA' => 1));
        } else {
            echo json_encode(array('codMsgA' => 3));
        }
    }

    public function exportarAction()
    {
        $params['filtros'] = json_decode(
            stripslashes($this->_request->getParam('filtros'))
        );
        $params['indicadores'] = json_decode(
            stripslashes($this->_request->getParam('indicadores'))
        );
        $params['idejercicio'] = $this->_request->getParam('idejercicio');
        DatEjecucionoaceModel::exportarAExcel($params);
    }

    public function exportarPuntualAction()
    {
        $params['filtros'] = json_decode(
            stripslashes($this->_request->getParam('filtros'))
        );
        $params['indicadores'] = json_decode(
            stripslashes($this->_request->getParam('indicadores'))
        );
        $params['idejercicio'] = $this->_request->getParam('idejercicio');
        DatEjecucionoaceModel::exportarPuntualAExcel($params);
    }

    public function reporteEjecucionAction()
    {

        //$parametros['nupieza'] = $this->_request->getParam('nupieza');
        //$parametros['denominacion'] = $this->_request->getParam('denominacion');
       // $parametros['codigo'] = $this->_request->getParam('codigo');
        $parametros['cbname'] = $this->_request->getParam('cbname');
        $parametros['idorgano'] = $this->_request->getParam('idorgano');
        $parametros['organo'] = $this->_request->getParam('organo');
        $parametros['idejercicio'] = $this->_request->getParam('idejercicio');
        $parametros['mes'] = $this->_request->getParam('mes');
        $parametros['mesname'] = $this->_request->getParam('mesname');
        $parametros['centrobalance'] = $this->_request->getParam('centrobalance');
        $parametros['reporte'] = $this->_request->getParam('reporte');
        $integ = $this->integrator;
        $obj = new GenerarPdfEjecucion($parametros,$integ);
        $obj->export();
    }

}
