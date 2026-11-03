<?php

/**
 * GestIndicadoresController
 * Controlador para gestionar los indicadores
 *
 * @ author Dionisdel Ponce Santana
 * @ package PlanificaciÃƒÆ’Ã‚Â³n
 * @ subpackage PlanificaciÃƒÆ’Ã‚Â³n Empresarial y Presupuestaria
 * @ copyright UCID-ERP Cuba
 * @ version 2.0-0
 * */
class GestIndicadoresController extends ZendExt_Controller_Secure
{

    /**
     * init
     * Inicializar el mÃƒÆ’Ã‚Â³dulo
     * */
    public function init()
    {
        $this->objModel = new MultientidadModel();
        parent::init();
    }

//fin de la funciÃƒÆ’Ã‚Â³n init

    /**
     * gestIndicadores
     * Renderizar la vista
     * */
    public function gestIndicadoresAction()
    {
        //$jsayuda = $this->integrator->ayuda->devolverJS();
       // $this->view->jsayuda = $jsayuda;
        $this->render();
    }

    public function cargaInicialAction()
    {
        //servicio para obtener el id de la entidad que esta logueada
        $identidad = $this->global->Estructura->idestructura;

        $denoEntidad = $this->global->Estructura->denominacion;
        $compEntidad = DatEntidaddatosnomenclador::getIdentidaddatosnomenclador(
            $identidad
        );
        $entidadCB = NomIndicador::entidadEsCB($identidad);

        //temporal hasta que se haga un servicio que de el id del formato "Indicadores"
        $formato = $this->integrator->datosmaestros->listarFormatos();

        foreach ($formato as $valor) {
            if ($valor->nombre == 'Indicadores') {
                $idformatoInd = $valor->idformato;
                $nombreFormatoInd = "Indicadores";
            }
        }
        if ($idformatoInd == '') {
            echo("{'codMsg':21 }"); //no existe formato de indicadores
        } else {
            echo json_encode(
                array('identidad'        => $identidad,
                      'idformatoInd'     => $idformatoInd,
                      'nombreFormatoInd' => $nombreFormatoInd,
                      'entidadCB'        => $entidadCB,
                      'denoEntidad'      => $denoEntidad,
                      'compEntidad'      => $compEntidad[0][identidaddatosnomenclador])
            );
        }
    }

    /* permisoParaOperaciones
     * valida si el usuario logueado puede realizar operaciones sobre un indicador determinado
     *
     * @author Yasleiny GutiÃƒÆ’Ã‚Â©rrez Machado
     * @param '$idindicador'- identificador del indicador
     * @param '$operacion'- variable que indica la operacion que se desea realizar
     * @param '$identidad'- identificador de la entidad a la que pertenece el usuario logueado
     */

    public function permisoParaOperacionesAction()
    {
        $idindicador = $this->_request->getPost('idindicador');
       // $operacion = $this->_request->getPost('operacion');
        $rector = $this->_request->getPost('rector');
        $identidad = $this->global->Estructura->idestructura;

        //valida si el usuario tiene permisos
        if ((NomIndicador::esCentroBalance($idindicador, $identidad))
            || $rector
        ) {

            echo("{'codMsg':24 }");
        } else {
            echo("{'codMsg':25 }");
        } //el user no tiene permisos
    }

    /**
     * listarFormatos
     * Listar los formatos de los clasificadores (desde el mÃƒÆ’Ã‚Â³dulo ConfiguraciÃƒÆ’Ã‚Â³n)
     *
     * @return array, devuelve un arreglo de formatos
     * */
    public function listarFormatosAction()
    {
        //Obtener los formatos a travÃƒÆ’Ã‚Â©s del servicio BuscarFormato
        $formatos = $this->integrator->datosmaestros->listarFormatos();
        //Enviar el arreglo de formatos a la interfaz
        echo json_encode(array('data' => $formatos));
    }

    /**
     * listarFormatos
     * Listar los formatos de los clasificadores (desde el mÃƒÆ’Ã‚Â³dulo ConfiguraciÃƒÆ’Ã‚Â³n)
     *
     * @return array, devuelve un arreglo de formatos
     * */
    public function listarOqsatisfaceAction()
    {
        $organos = NomOrganosatisface::obtenerOS();
        echo json_encode(array('data' => $organos));
    }

    public function listarOqsatisfaceDadoViaAction()
    {
        $via = $this->_request->getPost('via');
        $organos = NomOrganosatisface::ObtenerOrganoSatisfaceVia($via);
        echo json_encode(array('data' => $organos));
    }

    /**
     * longNivel
     * Longitud de los niveles de clasificadores
     *
     * @param 'idformato'- identificador del formato
     * @param 'nivel'- nivel del que se desea saber la longitud
     *
     * @return array, devuelve un arreglo con la longitud del nivel
     * */
    public function longNivelAction()
    {
        //Obtener el identificador de formato
        $idformato = $this->_request->getPost('idformato');

        //Obtener el nivel del formato que se desea del nivel del ÃƒÆ’Ã‚Â¡rbol
        $nivel = $this->_request->getPost('nivel');

        //Obtener la configuraciÃƒÆ’Ã‚Â³n por nodos de un formato
        $result = $this->integrator->datosmaestros->buscarParteFormato(
            $idformato
        );
        //Llamar al mÃƒÆ’Ã‚Â©todo longNivel en el modelo, para retornar longitud del nivel        
        //Inicializar variable en 0 para contar los niveles
        $longitud = 0;
        foreach ($result as $r) {
            if ($r->nivel == $nivel) {
                $longitud = $r->longitud;
                $denom = $r->nombre;
            }
        } //fin del foreach
        //Enviar la longitud del formato a la interfaz
        echo json_encode(
            array('codMsg'     => 20, 'longitud' => $longitud,
                  'denomnivel' => $denom)
        );
    }

    /**
     * cargarEntidades
     * Cargar el ÃƒÆ’Ã‚Â¡rbol de entidades segÃƒÆ’Ã‚Âºn la subordinaciÃƒÆ’Ã‚Â³n
     *
     * @param 'node'- nodo del cual se cargan los hijos
     *
     * @return array, devuelve un arreglo con los nodos hijos del nodo consultado
     * */
    public function listarPaisesAction()
    {

        $pais = $this->nomenclador->selectParam(
            'nom_pais', array('idpais', 'nombrepais')
        );
        echo json_encode(array('data' => $pais));
    }

    public function BuscarVia($denominacion)
    {

        $query = new Doctrine_Query();
        $result = $query->select('m.idviaadquisicion')
            ->from('NomViaadquisicion m')
            ->where('m.denominacion=?', $denominacion)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    /**
     * adicionar
     * Adicionar o modificar un indicador
     *
     * @param 'idindicador'- identificador del indicador
     * @param 'idformato'- identificador del formato
     * @param 'idcb'- identificador de la entidad que es centro de balance
     * @param 'denominacion'- denominacion del indicador que se va a adicionar o modificar
     * @param 'codigo'- codigo del indicador que se va a adicionar
     * @param 'cod_padre'- codigo del padre (para concatenar y seria el codigo a insertar)
     * @param 'idpadre'- identificador del indicador padre
     * @param 'pais'- identificador del indicador padre
     * @param 'descripcion'- descripcion del indicador que se va a adicionar o modificar
     * En caso de que sea un indicador material:
     * @param 'precio'- precio para el indicador que se va a adicionar o modificar si viene vacio se adiciona 0
     * @param 'idunidadmedida'- unidad de medida del indicador que se va a adicionar o modificar
     * @param 'numeropieza'- numero de pieza del indicador si viene vacio se adiciona adiciona -
     * @param 'naturaleza'- naturaleza del producto
     * @param 'orgabasteccentral'- si lo satisface un organo abastecedor central
     * @param 'sustimp'- si se satisface por sustitucuin de importaciones
     * @param 'impdirecta'- si es de importacion directa
     * @param 'flete'- valor para descontar en porciento por defecto 0
     * @param 'contingencia'- valor para descontar en porciento por defecto 0
     *
     * @return array, devuelve un mensaje si se adiciona o modifica correctamente el indicador
     * */
    public function adicionarAction()
    {

        //Si viene el id es para modificar, sino es que se va a adicionar un indicador nuevo
        $idviaadquisicion = $this->_request->getPost('idviaadquisicion');
        $idorganoSatisface = $this->_request->getPost('organoSatisface');
        $idindicador = $this->_request->getPost('idindicador');
        //Obtener idEstructura del usuario logueado en la aplicaciÃƒÆ’Ã‚Â³n
       // $idEstructura = $this->global->Estructura->idestructura;
        //Instancear el modelo de indicador
        $model = new NomIndicadorModel();
        if ($idindicador) {
            $ind = Doctrine::getTable('NomIndicador')->find($idindicador);
            $mensaje = "mod";
        } else {
            $ind = new NomIndicador();
            $ind->idformato = $this->_request->getPost('idformato');
            $ind->nivel = 0;
            $ind->idaprobacion = 1;
            $mensaje = "add";
        }
        //***Para adicionar en NomIndicador		
        if ($this->_request->getPost('denominacion')) {
            $ind->denominacion = $this->_request->getPost('denominacion');
        }
        $ind->idaprobacion = 1;
        if ($this->_request->getPost('idpadre')) {
            $ind->idpadre = $this->_request->getPost('idpadre');
            $idarbol = Doctrine::getTable('NomIndicador')->find($ind->idpadre);
            $ind->idarbol = $idarbol->idarbol;
        }

        if ($this->_request->getPost('codigo') != $ind->codigo) {
            $ind->codigo = $this->_request->getPost('padre')
                . $this->_request->getPost('codigo');
        }
        if ($this->_request->getPost('idpais')) {
            $ind->idpais = $this->_request->getPost('idpais');
        }
        if ($this->_request->getPost('descripcion') != '') {
            $ind->descripcion = $this->_request->getPost('descripcion');
        }
        if ($this->_request->getPost('nivelarbol')) {
            $ind->nivelarbol = $this->_request->getPost('nivelarbol');
        }
        if ($this->_request->getPost('idformato')) {
            $ind->idformato = $this->_request->getPost('idformato');
        }
        if ($this->_request->getPost('idunidadmedida')) {
            $ind->idumedida = $this->_request->getPost('idunidadmedida');
        }
        $ind->precio = ($this->_request->getPost('precio'))
            ? $this->_request->getPost('precio') : 0;
        $ind->preciodivisa = ($this->_request->getPost('preciodivisa'))
            ? $this->_request->getPost('preciodivisa') : 0;
        $ind->flete = ($this->_request->getPost('flete'))
            ? $this->_request->getPost('flete') : 0;
        $ind->contingencia = ($this->_request->getPost('contingencia'))
            ? $this->_request->getPost('contingencia') : 0;
        if ($this->_request->getPost('naturaleza')) {
            $ind->naturaleza = $this->_request->getPost('naturaleza');
        }
        if ($this->_request->getPost('numeropieza')) {
            $ind->numeropieza = ($this->_request->getPost('numeropieza'))
                ? $this->_request->getPost('numeropieza') : '-';
        }
        $ejeractual = NomEjercicioplanificacion::listarEjercicioActual();
        $ind->idejercicio = $ejeractual[0]['idejercicio'];
        $idboth = $model->Insertar($ind);

        //Para insertar en la tabla de nomenclador por tipo de via de adquisicion		
        if ($mensaje == "mod") { //si viene modificar
            /*$totalVA = DatIndicadorviaadquisicion::ObtenerViasAdquis(
                $idindicador
            );*/ //guardo las VA en la variable
            DatIndicadorviaadquisicion::EliminarVAdqInd($idindicador);
            DatIndicadorcentrobalance::EliminarCBInD($idindicador);
            $objmod = DatIndicadormodelo::getModelo($idindicador);
            if ($objmod->idmodelo != null) {
                if ($objmod->idmodelo != $this->_request->getPost('idmodelo')) {
                    //desasociar indicador a modelo
                    $objmod->delete();
                }
            }
            if ($this->_request->getPost('idmodelo') != null
                && $this->_request->getPost('idmodelo') != '-'
                && ($objmod->idmodelo != $this->_request->getPost('idmodelo'))
            ) {
                //adicionar plan directo
                $datIndicadormodelo = new DatIndicadormodelo();
                $datIndicadormodelo->idmodelo = $this->_request->getPost(
                    'idmodelo'
                );
                $datIndicadormodelo->idindicador = $idindicador;
                $datIndicadormodelo->save();
            }
        } else {

            if ($this->_request->getPost('idmodelo')
                && $this->_request->getPost('idmodelo') != '-'
            ) {
                //adicionar plan directo
                $datIndicadormodelo = new DatIndicadormodelo();
                $datIndicadormodelo->idmodelo = $this->_request->getPost(
                    'idmodelo'
                );
                $datIndicadormodelo->idindicador = $ind->idindicador;
                $datIndicadormodelo->save();
            }
        }
        $nom = new DatIndicadorviaadquisicion();
        $nom->idindicador = $idboth;
        $nom->idviaadquisicion = $idviaadquisicion;
        $nom->save();

        $idorganoSatisface = explode(',', $idorganoSatisface);
        if ($idorganoSatisface != null) {
            foreach ($idorganoSatisface as $a) {
                $dos = new DatIndicadorviaadquisicionorganosatisface();
                $dos->idorganosatisface = $a;
                $dos->idindicador = $idboth;
                $dos->idviaadquisicion
                    = $idviaadquisicion; //Sustitución de importaciones
                $dos->save();
            }
        }

        if ($this->_request->getPost('idcentrobalance')) { //Nom 6 es OAC			
            $idcentrobalance = $this->_request->getPost('idcentrobalance');
            $cb = explode(',', $idcentrobalance);
            if ($cb) {
                foreach ($cb as $c) {
                    $centrobal = new DatIndicadorcentrobalance();
                    $centrobal->idindicador = $idboth;
                    $centrobal->identidaddatosnomenclador = $c;
                    $centrobal->save();
                }
            }
        }
        echo json_encode(array('codMsgM' => 1, 'mensaje' => $mensaje));
    }

    /**
     * listar
     * Lista todos los indicadores
     *
     * @param 'start'- posiciÃƒÆ’Ã‚Â³n inicial a listar
     * @param 'limit'- posiciÃƒÆ’Ã‚Â³n final a listar
     * @param 'anode'- el indicador del que se desea listar sus hijos
     *
     * @return array, devuelve la lista de indicadores
     * */
    public function listarAction()
    {
        ini_set("max_execution_time", 600); //10min de conexion
        $unidades = $this->integrator->datosmaestros->listarUnidadesMedidaTodas(
        );
        $integrator = $this->integrator;
        $centrobalances = NomIndicadorModel::listarCentroBalance(
            $integrator, null, null
        );

        $paises = $this->nomenclador->selectParam(
            'nom_pais', array('idpais', 'nombrepais')
        );

        $start = $this->_request->getPost('start');
        $idejercicio = $this->_request->getPost('idejercicio');
        $limit = $this->_request->getPost('limit');
        $idpadre = ($this->_request->getPost('idpadre')) ?
            $idpadre = $this->_request->getPost('idpadre')
            : $idpadre = $this->_request->getPost('anode');
        $flagfiltros = 0;
        $idarbol = $this->_request->getPost('idarbol');

        $idcentrobalance = $this->_request->getPost('idcentrobalance');
        if ($this->_request->getPost('formato')) {
            $parametros ['idformato'] = $this->_request->getPost('formato');
        }

        if ($this->_request->getPost('ordender')) {
            $parametros ['ordender'] = $this->_request->getPost('ordender');
        }
        if ($this->_request->getPost('ordenizq')) {
            $parametros ['ordenizq'] = $this->_request->getPost('ordenizq');
        }

        $parametros['aprobacion'] = $this->_request->getPost('aprobacion');
        $parametros ['nivelarbol'] = $this->_request->getPost('nivelarbol');
        if ($this->_request->getPost('codigo') != '') {
            $parametros ['codigo'] = $this->_request->getPost('codigo');
        }
        if ($this->_request->getPost('denominacion')) {
            $parametros ['denominacion'] = $this->_request->getPost(
                'denominacion'
            );
        }
        if ($this->_request->getPost('numeropieza') != '') {
            $parametros ['numeropieza'] = $this->_request->getPost(
                'numeropieza'
            );
        }
        if ($this->_request->getPost('idcentrobalance')) {
            $parametros ['identidaddatosnomenclador']
                = $this->_request->getPost(
                    'idcentrobalance'
                );
        } //***ahora idcentrobalance es identidaddatosnomenclador en dat_indicadorcentrobalance */
        if ($this->_request->getPost('nivelplanif') != '') {
            $parametros ['nivel'] = $this->_request->getPost('nivelplanif');
        }
        if ($aprob != '') {
            if ($aprob == 'Si') { //4
                $parametros ['aprobacion'] = 4;
            } else {
                $parametros ['aprobacion'] = 1;
            }
        }
        if ($this->_request->getPost('rector') != 'true') {
            $idEstructura = $this->global->Estructura->idestructura;
            $identidaddatosnomenclador
                = DatEntidaddatosnomenclador::obtenerEntidades($idEstructura);
            if ($identidaddatosnomenclador[0] != null) {
                $parametros ['identidad'] = $idEstructura;
            }
        }

        if ($idcentrobalance) {
            $parametros ['identidaddatosnomenclador'] = $idcentrobalance;
        }

        if (is_array($this->_request->getPost('filtros'))) {
            foreach ($this->_request->getPost('filtros') as $datos) {
                if ($datos ['field'] == 'codigo') {
                    $parametros ['codigo'] = $datos ['data'] ['value'];
                    if (strlen($parametros ['codigo']) <= 3) {
                        $parametros ['nivelarbol'] = 1;
                    } else {
                        if (strlen($parametros ['codigo']) == 4) {
                            $parametros ['nivelarbol'] = 2;
                        } else {
                            if (strlen($parametros ['codigo']) == 5
                                || strlen(
                                    $parametros ['codigo']
                                ) == 6
                            ) {
                                $parametros ['nivelarbol'] = 3;
                            } else {
                                if (strlen($parametros ['codigo']) > 6) {
                                    $parametros ['nivelarbol'] = 4;
                                }
                            }
                        }
                    }
                } elseif ($datos ['field'] == 'numeropieza') {
                    $parametros ['numeropieza'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'denominacion') {
                    $parametros ['denominacion'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'denoum') {
                    $parametros ['idumedida'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'denomviaadquisicion') {
                    $parametros ['idviaadquisicion']
                        = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'denomorgansatisface') {
                    $parametros ['idorganosatisface']
                        = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'precio') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $parametros ['precio_condicion1']
                            = array('precio'    => $datos ['data'] ['value'],
                                    'condicion' => ">");
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $parametros ['precio_condicion2']
                            = array('precio'    => $datos ['data'] ['value'],
                                    'condicion' => "<");
                    } else {
                        $parametros ['precio_condicion3']
                            = array('precio'    => $datos ['data'] ['value'],
                                    'condicion' => "=");
                    }
                } elseif ($datos ['field'] == 'preciodivisa') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $parametros ['preciodivisa_condicion1']
                            = array('preciodivisa' => $datos ['data'] ['value'],
                                    'condicion'    => ">");
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $parametros ['preciodivisa_condicion2']
                            = array('preciodivisa' => $datos ['data'] ['value'],
                                    'condicion'    => "<");
                    } else {
                        $parametros ['preciodivisa_condicion3']
                            = array('preciodivisa' => $datos ['data'] ['value'],
                                    'condicion'    => "=");
                    }
                } elseif ($datos ['field'] == 'denocentrobalance') {
                    $parametros ['identidaddatosnomenclador']
                        = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'idaprobacion') {
                    if ($datos ['data'] ['value'] == 'true') {
                        $parametros ['idaprobacionsi'] = '1';
                    }
                    if ($datos ['data'] ['value'] == 'false') {
                        $parametros ['idaprobacionno'] = '0';
                    }
                } elseif ($datos ['field'] == 'nivel') {
                    if ($datos ['data'] ['value'] == 'true') {
                        $parametros ['nivelsi'] = '1';
                    }
                    if ($datos ['data'] ['value'] == 'false') {
                        $parametros ['nivelno'] = '0';
                    }
                } elseif ($datos ['field'] == 'estado') {
                    if ($datos ['data'] ['value'] == 'true') {
                        $parametros ['estadosi'] = '1';
                    }
                    if ($datos ['data'] ['value'] == 'false') {
                        $parametros ['estadono'] = '0';
                    }
                } else {
                    if ($datos ['field'] == 'uso') {
                        if ($datos ['data']['value'] == 'true') {
                            $parametros ['uso'] = '1';
                        }
                        if ($datos ['data']['value'] == 'false') {
                            $parametros ['uso'] = '0';
                        }
                    } elseif ($datos ['field'] == 'flete') {
                        if ($datos ['data'] ['comparison'] == "gt") {
                            $parametros ['flete_condicion1']
                                = array('flete'     => $datos ['data'] ['value'],
                                        'condicion' => ">");
                        } elseif ($datos ['data'] ['comparison'] == "lt") {
                            $parametros ['flete_condicion2']
                                = array('flete'     => $datos ['data'] ['value'],
                                        'condicion' => "<");
                        } else {
                            $parametros ['flete_condicion3']
                                = array('flete'     => $datos ['data'] ['value'],
                                        'condicion' => "=");
                        }
                    } elseif ($datos ['field'] == 'contingencia') {
                        if ($datos ['data'] ['comparison'] == "gt") {
                            $parametros ['contingencia_condicion1']
                                = array('contingencia' => $datos ['data'] ['value'],
                                        'condicion'    => ">");
                        } elseif ($datos ['data'] ['comparison'] == "lt") {
                            $parametros ['contingencia_condicion2']
                                = array('contingencia' => $datos ['data'] ['value'],
                                        'condicion'    => "<");
                        } else {
                            $parametros ['contingencia_condicion3']
                                = array('contingencia' => $datos ['data'] ['value'],
                                        'condicion'    => "=");
                        }
                    } elseif ($datos ['field'] == 'coeficiente') {
                        if ($datos ['data'] ['comparison'] == "gt") {
                            $parametros ['coeficiente_condicion1']
                                = array('coeficiente' => $datos ['data'] ['value'],
                                        'condicion'   => ">");
                        } elseif ($datos ['data'] ['comparison'] == "lt") {
                            $parametros ['coeficiente_condicion2']
                                = array('coeficiente' => $datos ['data'] ['value'],
                                        'condicion'   => "<");
                        } else {
                            $parametros ['coeficiente_condicion3']
                                = array('coeficiente' => $datos ['data'] ['value'],
                                        'condicion'   => "=");
                        }
                    } elseif ($datos ['field'] == 'naturaleza') {
                        $parametros ['naturaleza'] = $datos ['data'] ['value'];
                    } elseif ($datos ['field'] == 'denompais') {
                        $parametros ['idpais'] = $datos ['data'] ['value'];
                    } elseif ($datos ['field'] == 'nivelarbol') {
                        $parametros ['nivelarbol'] = $datos ['data'] ['value'];
                    } elseif ($datos ['field'] == 'uso') {
                        $parametros['uso'] = $datos['data']['value'];
                    } elseif ($datos ['field'] == 'idmodelo') {
                        $parametros['idmodelo'] = $datos['data']['value'];
                    }
                }
            }
        }

        $data = NomIndicadorModel::listarIndicadores(
            $parametros, $idpadre, $idarbol, $start, $limit,
            $unidades, $centrobalances, $paises, $flagfiltros
        );
        echo json_encode(
            array('final' => (int)$data->total, 'data' => $data->data)
        );
    }

    /**
     * eliminar
     * Eliminar un indicador dado su identificador
     *
     * @param 'idindicador' - identificador del indicador
     *
     * @return array, devuelve un mensaje si se elimina correctamente el indicador
     * */
    public function eliminarAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $indicadores = json_decode(
            stripslashes($this->_request->getPost('idindicador'))
        );
        $ejeractual = NomEjercicioplanificacion::listarEjercicioActual();
        $idejercicio = $ejeractual[0]['idejercicio'];
        $model = new NomIndicadorModel();
        $result = $model->Eliminar($indicadores, $idejercicio);
        echo $result; //se ha eliminado satisfactoriamente
    }

    /**
     * activar
     * Cambia el estado de un indicador (activado o desactivado)
     *
     * @param 'estado'- estado que va a tomar el indicador
     * @param 'idindicador'- identificador del indicador
     *
     * @return array, devuelve un mensaje con el estado del indicador (activado o desactivado)
     * */
    public function activarAction()
    {
        $params = json_decode(
            stripslashes($this->_request->getPost('idindicador'))
        );
        $estado = $this->_request->getPost('estado');
        $idindicadores = NomIndicadorModel::ObtenerIdIndicadores(
            $params, $estado
        );
        $ejeractual = NomEjercicioplanificacion::listarEjercicioActual();
        $idejercicio = $ejeractual[0]['idejercicio'];
        if (NomIndicadorModel::activar_desactivar_en_postorden(
            $idindicadores, $estado
        )
        ) {
            $dat->codMsgM = 1;
        } else {
            $dat->codMsgM = 25;
        }
        if ($estado == 0) {
            $dat->mensaje = 'desactivado';
        } else {
            $dat->mensaje = 'activado';
        }

        echo json_encode($dat);
    }

    /**
     * cargartbcomboestados
     * Cargar un estado para realizar la bÃƒÆ’Ã‚Âºsqueda
     *
     * @param 'idestado'- valor del estado
     * @param 'estado'- estado del combo
     *
     * @return devuelve un estado
     * */
    public function cargartbcomboestadosAction()
    {
        $data->data [] = array('idnivelplanif' => 1, 'nivelplanif' => 'Si');
        $data->data [] = array('idnivelplanif' => 0, 'nivelplanif' => 'No');
        echo json_encode($data);
    }

    //fin de la funciÃƒÆ’Ã‚Â³n cargartbcomboestados	

    /**
     * cargarformind
     * Carga el formato de l indicador especificado
     *
     * @param 'idindicador'- identificador de un indicador
     *
     * @return array, devuelve un mensaje con el estado del indicador
     * */
    public function cargarformindAction()
    {
        $idind = $this->_request->getPost('idindicador');
        $data->data [] = Doctrine::getTable('NomIndicador')->find($idind)
            ->toArray();
        echo json_encode($data);
    }

    //fin de la funciÃƒÆ’Ã‚Â³n cargarformind

    /**
     * cargarUM
     * Carga un listado con las unidades de medida existentes
     *
     * @return array, devuelve un listado con las unidades de medida
     * */
    public function cargarUMAction()
    {
        $unidades = $this->integrator->datosmaestros->listarUnidadesMedidaTodas(
        );
        foreach ($unidades as $key => $value) {
            $unidades[$key]->nombreum = strtoupper($value->nombreum);
        }
        echo json_encode(array('data' => $unidades));
    }

    /**
     * listarCentroBalance
     * Carga un listado con las entidades que son centro de balance
     *
     * @return array, devuelve un listado con las entidades que son centro de balance
     * */
    public function listarCentroBalanceAction()
    {
        $idpadre = $this->_request->getPost('idpadre');
        $idindicador = $this->_request->getPost('idindicador');
        $integrator = $this->integrator;
        echo json_encode(
            array('data' => NomIndicadorModel::listarCentroBalance(
                $integrator, $idpadre, $idindicador
            ))
        );
    }

    public function listarViaAdqAction()
    {
        echo json_encode(NomViaadquisicionModel::listarViaAdq());
    }

    //DEFINE EL NIVEL DE PLANIFICACION
    public function definirnivelPLanificacionAction()
    {
        $indicadores = json_decode(
            stripslashes($this->_request->getPost('idindicadores'))
        );
        $defnivel = $this->_request->getPost('defnivel');
        $ejeractual = NomEjercicioplanificacion::listarEjercicioActual();
        $idejercicio = $ejeractual[0]['idejercicio'];
        $idindicadores = "";
        foreach ($indicadores as $k => $valor) {
            $idindicadores[$k] = $valor->idindicador;
        }
        $indicadoresNoEnUso = NomIndicadorModel::ObtenerIndicadoresNoEnUso(
            $idindicadores, $idejercicio
        );

        $operacionrealizada = false;

        foreach ($indicadoresNoEnUso as $value) {

            if ($defnivel == 0) { //si es 0 es adicionar nivel de planif
                $ind = NomIndicadorModel::chequearNivel(
                    $value['ordenizq'], $value['ordender'], $value['idarbol']
                ); //$izq,$der

                if ($ind) { //SI VIENE IND ES QUE YA HAY UN IND CON NIVEL DE P EN LA RAMA
                    $noprocedenrama[]
                        = $value['denominacion']; //los guardo en un arreglo para informarle al final
                } else {
                    $operacionrealizada = NomIndicador::cambiarNivel(
                        $value['idindicador']
                    );
                }
            }
            if ($defnivel == 1) { //si es 1 es eliminar el  nivel de planif
                $operacionrealizada = NomIndicador::borrarNivel(
                    $value['idindicador']
                ); //BORRA EL NP NO EL INDICADOR
            }
        }
        if ($noprocedenrama) { // si hay algo en este arreglo es que alguno no se puedo definir como NP
            $dat->codMsgM = 23;
            $dat->noproceden = $noprocedenrama;
        } else {
            if ($operacionrealizada == true) {
                $dat->codMsgM = 1;
            } else {
                $dat->codMsgM = 22;
            }
        }
        echo json_encode($dat);
    }

    /**
     * listarNaturaleza
     * Carga un listado con los tipos de naturaleza de un indicador
     *
     * @return array, devuelve un listado con los tipos de naturaleza de un indicador
     * */
    public function listarNaturalezaAction()
    {

        $idnaturaleza
            = 2; //poner fijo los tipos de nomencladores o buscar por denominacion, en este caso 'Naturaleza'
        $natura = NomDatosnomenclador::ObtenerDatosNomenclador($idnaturaleza);
        foreach ($natura as $k => $valor) {
            $naturaleza [$k] ['naturaleza'] = $valor ['iddatosnomenclador'];
            $naturaleza [$k] ['denominacion']
                = $valor ['nom_datosnomenclador_denominacion'];
        }
        echo json_encode(array('data' => $naturaleza));
    }

    public function exportarIndicadoresAExcelAction()
    {
        $identidaddatosnom = $_GET['identidad'];
        ExportarImportarModel::ExportarIndicadoresAExcel(
            $identidaddatosnom
        );
    }

    public function nuevoexportarAction()
    {
        PlanmetaService::exportarindicadores();
    }

    public function exportarindicadoresDriAction()
    {
        NomIndicadorModel::exportarindicadores(array());
    }

    public function gestionarAprobacionAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idindicadorespadres = json_decode(
            stripslashes($this->_request->getPost('idindicador'))
        );
        $idaprobacion = $this->_request->getPost('idaprobacion');
        $ejeractual = NomEjercicioplanificacion::listarEjercicioActual();
        $idejercicio = $ejeractual[0]['idejercicio'];
        $idindicadores = NomIndicadorModel::ObtenerIdIndicadoresAprobar(
            $idindicadorespadres, $idaprobacion
        );

        $result = NomIndicadorModel::aprobar_desaprobar_en_postorden(
            $idindicadores, $idaprobacion
        );


        if (!$result) {
            echo("{'codMsgM':21 }");
        } else {
            echo("{'codMsgM':1 }");
        }
    }

    public function cargarcomboNivelArbolAction()
    {
        $data->data [] = array('idnivelarbol' => 1,
                               'nivelarbol'   => 'GenÃƒÆ’Ã‚Â©rico');
        $data->data [] = array('idnivelarbol' => 2,
                               'nivelarbol'   => 'SubgenÃƒÆ’Ã‚Â©rico');
        $data->data [] = array('idnivelarbol' => 3,
                               'nivelarbol'   => 'EspecÃƒÆ’Ã‚Â­fico');
        $data->data [] = array('idnivelarbol' => 4, 'nivelarbol' => 'Surtido');
        echo json_encode($data);
    }

    public function cargartbcomoaprobacionAction()
    {
        $data->data [] = array('idaprobacion' => 1, 'aprobacion' => 'No');
        $data->data [] = array('idaprobacion' => 4, 'aprobacion' => 'Si');
        echo json_encode($data);
    }

    public function listarViaadquisicionAction()
    {
        echo json_encode(NomIndicadorModel::listarnombresViaadquisicion());
    }

    public function listarorganoSatisfaceAction()
    {
        echo json_encode(NomIndicadorModel::listarnombresorganoSatisface());
    }

    public function validarUsoIndicadorAction()
    {
        $idindicador = $this->_request->getPost('idindicador');
        echo DatPlanificacionModel::validardadoIdIndicador($idindicador);
    }

    public function listarActividadesAction()
    {
        $params['idindicador'] = $this->_request->getPost('idindicador');
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['start'] = $this->_request->getPost('start');
        $params['limit'] = $this->_request->getPost('limit');
        $params['filtros'] = $this->_request->getPost('filtros');
        echo json_encode(DatPlanificacionModel::listarActividades($params));
    }

    public function listarActividadesConIndicadorAction()
    {
        $params['idindicador'] = $this->_request->getPost('idindicador');
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['start'] = $this->_request->getPost('start');
        $params['limit'] = $this->_request->getPost('limit');
        $params['filtros'] = $this->_request->getPost('filtros');
        echo json_encode(
            NomIndicadorModel::listarActividadesConIndicador($params)
        );
    }

    public function listarPlanesAction()
    {
        $params['idindicador'] = $this->_request->getPost('idindicador');
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['start'] = $this->_request->getPost('start');
        $params['limit'] = $this->_request->getPost('limit');
        $params['filtros'] = $this->_request->getPost('filtros');
        echo json_encode(DatPlanificacionModel::listarPlanes($params));
    }

    public function validarUsoIndicadorDespAction()
    {
        $idindicador = json_decode(
            stripslashes($this->_request->getPost('idindicador'))
        );
        echo DatPlanificacionModel::validardadoIdIndicador($idindicador);
    }

    /**
     * listarModelos
     * Lista todos los modelos
     *
     * @return array, devuelve la lista de modelos
     * */
    public function listarTodosPlanesAction()
    {

        $global = ZendExt_GlobalConcept::getInstance();
        $idEstructura = $global->Estructura->idestructura;
        $data->data = DatEntidadmodelo::servBP_getModeloAsocEntidad(
            $idEstructura
        );
        $data->data [] = array('idmodelo' => '-', 'denominacion' => '-');
        echo json_encode($data);
    }

    public function getEjerciciosAction()
    {

        $data->data = NomEjercicioplanificacion::listarEjercicioActualByUri();
        $data->idejercicioactual
            = NomEjercicioplanificacion::obtenerDenEjercicioActual();
        echo json_encode($data);
    }


    public function listarHijosRectorAction()
    {

        $datosentidad = DatPlanificacion::listarHijosRector();
        foreach ($datosentidad as $k => $valor) {
            $dat [$k] ['identi'] = $valor['identidadpadre'];
            $dat [$k] ['denominacion'] = $valor['denomentidadpadre'];
        }
        echo json_encode(array('data' => $dat));
    }

    public function calcularCoeficienteAction()
    {
        ini_set("max_execution_time", 36000); // 10horas
        $parametros['idindicador'] = json_decode(
            stripslashes($this->_request->getPost('arrayidindicadores'))
        );
        $parametros['coeficiente'] = $this->_request->getPost('coeficiente');

        $data = NomIndicadorModel::calcularCoeficiente($parametros);

        if ($data == '1') {
            echo json_encode(array('codMsg' => 22));
        } else {
            echo json_encode(array('codMsg' => 20));
        }
    }

}

//fin de la clase GestIndicadoresController
