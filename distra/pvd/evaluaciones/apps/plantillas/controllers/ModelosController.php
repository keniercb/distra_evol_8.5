<?php

/**
 * ReglasController
 * Modelo de negocio para gestionar reglas *
 *
 * @author     Javier  Rodr�guez L�pez  y  Oraldo Jacinto Sim�n
 * @package    Capital Humano
 * @subpackage Evaluaciones
 * @copyright  UCID-ERP Cuba
 * @version    1-0.0
 */
class ModelosController extends ZendExt_Controller_Secure
{

    private $estado;
    private $modelo;
    private $modeloModel;

    function init()
    {
        $this->modelo = new DatEvalmodelo();
        $this->modeloModel = new DatEvalmodeloModel();
        $this->estado = new NomEvalestadoModel();
        parent::init();
    }

    function modelosAction()
    {
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->render();
    }

    //Carga todas las planillas evaluativas permitiendo filtrarlas por nombre y dominio en caso de que se desee.
    function cargarPlanillasAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $iddominioevaluativo = $this->_request->getPost('iddominioevaluativo');
        $texto = $this->_request->getPost('texto');
        if ($iddominioevaluativo != null) {
            $r['datos'] = $this->pIntegrator->evaluaciones->BuscarPlanillasPorDomEval(
                $iddominioevaluativo, $limit, $start
            );
            $r['cantidad'] = count($r['datos']);
        } else {
            if ($texto != null) {
                $r['datos'] = $this->pIntegrator->evaluaciones->GetPlanillasPorTexto($texto, $limit, $start);
                $r['cantidad'] = count($r['datos']);
            } else {
                $r['datos'] = $this->pIntegrator->evaluaciones->BuscarPlanillasPorLimite($limit, $start);
                $cantidad = $this->modeloModel->CantPlanillasActivas();
                $r['cantidad'] = $cantidad[0]['count'];
            }

        }
        echo(json_encode($r));
    }

    //Carga todos los modelos para una planilla evaluativa dado su identificador.
    function cargarModelosAction()
    {
        $start = $this->_request->getPost('start');
        $limit = $this->_request->getPost('limit');
        $idplanilla = $this->_request->getPost('idplanilla');
        $modelos = $this->modelo->getModelosPorPlanilla($idplanilla, $start, $limit);

        foreach ($modelos as &$modelo) {
            if ($modelo['idexpresionmatematica']) {
                $formula = $this->pIntegrator->comun->BuscarTodosporarrIdExpresionMatematica(
                    array($modelo['idexpresionmatematica'])
                );

                $modelo['denomformula'] = $formula[0]['denominacion'];
            }
        }
        $r['datos'] = $modelos;
        $r['cantidad'] = $this->modelo->getCantidadModelosPorPlanilla($idplanilla);
        echo(json_encode($r));
    }

    //Carga todas las escalas de tipo cualitativas
    function cargarEscCualitativasAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $query = $this->_request->getPost('query');
        $objEscala = new DatEvalescala();
        if ($this->_request->getPost('query') != '') {
            $r['datos'] = $objEscala->getEscalasByDenom($query, $limit, $start);
            $cant = $objEscala->GetCantTotalByDenom($query);
            $r['cantidad'] = $cant;
        } else {
            $r['datos'] = $objEscala->getEscalasPorTipo(1, $limit, $start);
            $cant = $objEscala->getCantidadEscalasPorTipo(1);
            $r['cantidad'] = $cant[0]['cantidad'];
        }
        echo(json_encode($r));
    }

    //Carga todos los valores caualitativos de una esca cualitativa dado su identificador.
    function cargarResultadoAction()
    {
        $start = $this->_request->getPost('start');
        $limit = $this->_request->getPost('limit');
        $idescala = $this->_request->getPost('idescala');
        $objValores = new DatEvalescalavalorescualitativos();
        $r['datos'] = $objValores->GetEscalaValoresPoridescala($idescala, $start, $limit);
        $r['cantidad'] = count($r['datos']);
        echo(json_encode($r));
    }

    //Carga los hechos dado un valor cualitativo
    function cargarHechosAction()
    {
        $idmodelo = $this->_request->getPost('idmodelo');
        $r['datos'] = $this->modeloModel->GetHechosPorModelo($idmodelo);
        echo(json_encode($r));
    }

    //Carga todas las reglas existentes para una planilla evaluativa dado su identificador
    function cargarReglasAction()
    {
        $idmodelo = $this->_request->getPost('idmodelo');
        $DatEvalmodeloexpmatematica = new DatEvalmodeloexpmatematica();
        $arrModeloexpmatematica = $DatEvalmodeloexpmatematica->getArrIdExpMatematicaByModelo($idmodelo);

        if (!empty($arrModeloexpmatematica)) {
            $arrId = array();
            foreach ($arrModeloexpmatematica as $value) {
                $arrId[] = $value['idexpresionmatematica'];
            }

            $r->datos = $this->pIntegrator->comun->BuscarTodosporarrIdExpresionMatematica($arrId);
            foreach ($r->datos as &$dato) {
                foreach ($arrModeloexpmatematica as $value) {
                    if($dato['idexpresionmatematica'] == $value['idexpresionmatematica']){
                        $dato['idevalmodeloexpmatematica'] = $value['idevalmodeloexpmatematica'];
                    }
                }
            }
            echo(json_encode($r));
        } else {
            $r->datos = array();
            echo(json_encode($r));
        }
    }

    //Carga todos los estados en que puede estar un modelo.
    function cargarEstadosAction()
    {
        $objEst = new NomEvalestado();
        $arrEstados = $objEst->GetTodos();
        if (is_array($arrEstados)) {
            $arrEstados = array('cantidad' => count($arrEstados), 'datos' => $arrEstados);
            echo(json_encode($arrEstados));
        }
    }

    //Carga todos los dominios para las evaluaciones.
    function cargardominioEvalAction()
    {
        $iddominioevaluativo = $this->_request->getPost('iddominio');
        $idrecursovaluativo = $this->_request->getPost('idrecurso');
        $r = null;
        if ($iddominioevaluativo == -1 && $idrecursovaluativo == -1) {
            $objRecurso = new DatEvalrecursoevaluativo();
            $r = $objRecurso->GetTodos();
        } else {
            $objDominio = new DatEvaldominioevaluativo();
            $r = $objDominio->GetDominioEvaluativo($iddominioevaluativo, $idrecursovaluativo);
        }
        $nodos = array();
        if (count($r) > 0) {
            foreach ($r as $v) {
                if ($iddominioevaluativo == -1 && $idrecursovaluativo == -1) {
                    $nodos[] = array('id'          => $v['idrecursoevaluativo'], 'text' => $v['denom'],
                                     'descripcion' => $v['descripcion'], 'idpadre' => $v['idrecursoevaluativo']);
                } else {
                    $nodos[] = array('id'          => $v['iddominioevaluativo'], 'text' => $v['denom'],
                                     'descripcion' => $v['descripcion'], 'idpadre' => $v['idpadre']);
                }
            }
        }
        echo(json_encode($nodos));
    }

    function todosmodelosAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $objModelo = new DatEvalmodelo();
        $r['datos'] = $objModelo->GetPorLimite($limit, $start);
        $r['cantidad'] = $objModelo->GetCantTotal();
        echo(json_encode($r));
    }

    //Adiciona un nuevo modelo matem�tico  a una planilla evaluativa seleccionada.
    function adicionarmodeloAction()
    {
        $denom = $this->_request->getPost('denom');
        $objModelo = new DatEvalmodelo();
        $objModelo->denom = $denom;
        $objModelo->descripcion = $this->_request->getPost('descripcion');
        $objModelo->fechainicio = $this->_request->getPost('fechainicio');
        if ($this->_request->getPost('fechafin') == '') {
            $ff = null;
        } else {
            $ff = $this->_request->getPost('fechafin');
        }
        $objModelo->fechafin = $ff;
        $objModelo->idplanilla = $this->_request->getPost('idplanilla');
        $objModelo->idestado = $this->_request->getPost('idestado');
        if ($this->_request->getPost('idescala')) {
            $objModelo->idescala = $this->_request->getPost('idescala');
        }
        if ($this->_request->getPost('idexpresionmatematica')) {
            $objModelo->idexpresionmatematica = $this->_request->getPost('idexpresionmatematica');
        }
        $objModeloModel = new DatEvalmodeloModel();
        $objModeloModel->Insertar($objModelo);
        $r->success = true;
        echo(json_encode($r));
    }

    //Modifica los datos de un modelo matematico.
    function modificarmodeloAction()
    {
        $idmodelo = $this->_request->getPost('idmodelo');
        $objModeloModel = new DatEvalmodeloModel();
        $objModelo = $objModeloModel->getModelo($idmodelo);
        $objModelo->denom = $this->_request->getPost('denom');
        $objModelo->descripcion = $this->_request->getPost('descripcion');

        $idexpresionmatematica = $this->_request->getPost('idexpresionmatematica');
        $rEscala = json_decode($this->_request->getPost('rEscala'));
        $esFormula = json_decode($this->_request->getPost('rFormula'));

        if (is_numeric($this->_request->getPost('idestado'))) {
            $objModelo->idestado = $this->_request->getPost('idestado');
        }
        if ($this->_request->getPost('idescala') && $rEscala) {
            $objModelo->idescala = $this->_request->getPost('idescala');
        } else {
            $objModelo->idescala = null;
        }

        if ($esFormula && $idexpresionmatematica) {
            $objModelo->idexpresionmatematica = $idexpresionmatematica;
        } else {
            if($idexpresionmatematica) {
                $this->pIntegrator->comun->EliminarExpresionMatematica($idexpresionmatematica);
            }
            $objModelo->idexpresionmatematica = null;
        }

        $objModelo->fechainicio = $this->_request->getPost('fechainicio');
        if ($this->_request->getPost('fechafin') == '') {
            $ff = null;
        } else {
            $ff = $this->_request->getPost('fechafin');
        }
        $objModelo->fechafin = $ff;

        $objModeloModel->Actualizar($objModelo);
        $r->result = 1;
        //$r->mensaje = "El modelo matem&aacute;tico ha sido modificado satisfactoriamente.";
        echo(json_encode($r));
    }

    //Elimina un modelo matematico previamente seleccionado.
    function eliminarmodeloAction()
    {
        try {
            $idmodelo = $this->_request->getPost('idmodelo');
            $objModeloModel = new DatEvalModeloModel();
            $objModeloModel->Eliminar($idmodelo);
            $r->success = true;
            echo(json_encode($r));
        } catch (Exception $e) {
            if ($e->getCode() == 23503) { //Code for foreignKeyViolation
                $r->exception = 1;
                echo(json_encode($r));
            } else {
                echo(json_encode($e->getMessage()));
            }
        }
    }

    //Adiciona un nuevo hecho al modelo previamente seleccionado.
    function adicionarhechoAction()
    {
        $objHecho = new DatEvalhecho();
        $objHecho->idexpresionmatematica = $this->_request->getPost('idexpresionmatematica');
        $objHecho->idmodelo = $this->_request->getPost('idmodelo');
        $objHecho->idvalorescualitativos = $this->_request->getPost('idvalorescualitativos');
        $objModelo = new DatEvalmodelo();
        $cant_hecho = $objModelo->CantidadHechosPorModelo($this->_request->getPost('idmodelo'));
        $cant_hecho++;
        $objHecho->orden = $cant_hecho;
        $objHechoModel = new DatEvalhechoModel();
        $objHechoModel->Insertar($objHecho);
        $r->result = 1;
        $r->mensaje = "El hecho ha sido adicionado satisfactoriamente.";
        echo(json_encode($r));
    }

    //Elimina un hecho previamente seleccionado.
    function eliminarhechoAction()
    {
        try {
            $idhecho = $this->_request->getPost('idhecho');
            $aux = $this->pIntegrator->comun->EliminarExpresionMatematica($idexpresionmatematica);
            $objHechoModel = new DatEvalhechoModel();
            $objHechoModel->Eliminar($idhecho);
            $r->result = 1;
            $r->mensaje = "El hecho ha sido eliminado satisfactoriamente.";
            echo(json_encode($r));
        } catch (Exception $e) {
            if ($e->getCode() == 23503) { //Code for foreignKeyViolation
                $r->exception = 1;
                echo(json_encode($r));
            } else {
                echo(json_encode($e->getMessage()));
            }
        }
    }

    function actualizarordenhechoAction()
    {
        $arregloV = $this->_request->getPost('arrayVal');
        $arreglo = stripslashes($arregloV);
        $array = Json_decode($arreglo);
        $objHechoModel = new DatEvalhechoModel();
        foreach ($array as $v) {
            $objHecho = Doctrine::getTable('DatEvalhecho')->find($v[0]);
            $objHecho->orden = $v[1];
            $objHechoModel->Actualizar($objHecho);
        }
        $r->result = 1;
        $r->mensaje = "El orden de los hechos ha sido guardado satisfactoriamente.";
        echo(json_encode($r));
    }

    function addmodeloexpmatematicaAction()
    {
        $idmodelo = $this->_request->getPost('idmodelo');
        $idexpresionmatematica = $this->_request->getPost('idexpresionmatematica');
        $DatEvalmodeloexpmatematica = new DatEvalmodeloexpmatematica();
        $DatEvalmodeloexpmatematica->idmodelo = $idmodelo;
        $DatEvalmodeloexpmatematica->idexpresionmatematica = $idexpresionmatematica;
        $DatEvalmodeloexpmatematicaModel = new DatEvalmodeloexpmatematicaModel();
        $DatEvalmodeloexpmatematicaModel->Insertar($DatEvalmodeloexpmatematica);
        echo(json_encode($r->success = true));
    }

    function delmodeloexpmatematicaAction()
    {
        try {
            $idevalmodeloexpmatematica = $this->_request->getPost('idevalmodeloexpmatematica');
            $idexpresionmatematica = $this->_request->getPost('idexpresionmatematica');
            $arrIdHechos = json_decode(stripslashes($this->_request->getPost('arrIdHechos')));

            //Elimino las expresiones matematicas
            $aux = $this->pIntegrator->comun->EliminarExpresionMatematica($idexpresionmatematica);

            //Elimino la relacion con los modelos
            $DatEvalmodeloexpmatematicaModel = new DatEvalmodeloexpmatematicaModel();
            $DatEvalmodeloexpmatematicaModel->Eliminar($idevalmodeloexpmatematica);

            //Elimino la relacion con los hechos
            $objHechoModel = new DatEvalhechoModel();
            foreach ($arrIdHechos as $idhecho) {
                $objHechoModel->Eliminar($idhecho);
            }
            echo(json_encode($r['success'] = true));
        } catch (Exception $e) {
            if ($e->getCode() == 23503) { //Code for foreignKeyViolation
                $r->exception = 1;
                echo(json_encode($r));
            } else {
                echo(json_encode($e->getMessage()));
            }
        }
    }

    function getlistindicadoresplanillaAction()
    {
        $idplanilla = $this->_request->getPost('idplanilla');
        $DatEvalindicadoresplanilla = new DatEvalindicadoresplanilla();
        $indicadores = $DatEvalindicadoresplanilla->getListIndicadoresHojasByPlanilla($idplanilla);

        $cantidad = count($indicadores);

        $sql = "SELECT ip.idindicadorplanilla, ip.idindicador, ip.tipo, ip.abreviatura, ip.idpadre, ip.ayuda,
               ip.idplanilla, ip.eshoja, ip.calculado, ic.idexpresionmatematica as idexpresionmatematica
				FROM mod_evaluaciones.dat_evalindicadoresplanilla ip
				INNER JOIN mod_evaluaciones.dat_evalindicadorescalculado  ic ON (ic.idindicadorplanilla = ip.idindicadorplanilla)
                WHERE ip.idplanilla = {$idplanilla}";
        $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($sql);

        foreach($result as $r){
            $indicadores[$cantidad]['idindicadorplanilla'] = $r['idindicadorplanilla'];
            $indicadores[$cantidad]['abreviatura'] = $r['abreviatura'];
            $indicadores[$cantidad]['ayuda'] = $r['ayuda'];
            $indicadores[$cantidad]['calculado'] = $r['calculado'];
            $indicadores[$cantidad]['idindicador'] = $r['idindicador'];
            $indicadores[$cantidad]['idpadre'] = $r['idpadre'];
            $indicadores[$cantidad]['idplanilla'] = $r['idplanilla'];
            $indicadores[$cantidad]['tipo'] = $r['tipo'];
            $indicadores[$cantidad]['eshoja'] = $r['eshoja'];
            $indicadores[$cantidad]['idexpresionmatematica'] = $r['idexpresionmatematica'];
            $indicadores[$cantidad]['complementotextual'] = $r['complementotextual'];
            $cantidad++;
        }


        $arrIndTexto = array();
        $arrIndImagen = array();
        foreach ($indicadores as $indicador) {
            if ($indicador['tipo'] == true) {
                $arrIndTexto[] = $indicador['idindicador'];
            } else {
                $arrIndImagen[] = $indicador['idindicador'];
            }
        }
        if (count($arrIndTexto) > 0) {
            $arrIndTexto = $this->pIntegrator->evaluaciones->ObtenerIndicadoresTextPorId($arrIndTexto);
        }
        /* if (count($arrIndImagen) > 0) {
          $arrIndImagen = $this->pIntegrator->evaluaciones->ObtenerIndicadoresImagenPorId($arrIndImagen);
          } */
        $result = array();
        if (count($indicadores) > 0) {
            foreach ($indicadores as $indicador) {
                foreach ($arrIndTexto as $indTexto) {
                    if ($indicador['idindicador'] == $indTexto['idindicadortexto']) {
                        $values = array();
                        if (!empty($indicador['idescala'])) {
                            //Obtiene todos los valores de la escala
                            $arrValScale = DatEvalescala::getValuesByIdEscala($indicador['idescala']);
                            foreach ($arrValScale as $value) {
                                //Adiciona los valores de la escala a la respuesta
                                $values[] = array(
                                    $value['valor'],
                                    $value['denom']
                                );
                            }
                        }
                        $result[] = array('idindicador' => $indicador['idindicador'], 'denom' => $indTexto['denom'],
                                          'values'      => $values);
                    }
                }
                /* foreach ($arrIndImagen as $indImg) {
                  if ($indicador['idindicador'] == $indImg['idindicadorimagen']) {
                  $result[] = array_merge($indicador, $indImg);
                  }
                  } */
            }
        }
        $r['datos'] = $result;
        echo json_encode($r);
    }	
	 //Modifica los datos de un modelo matematico.
    function habilitarmodeloAction()
    {
	    $idusuario = $this->global->Perfil->idusuario;
		$idpersona = $this->global->Perfil->idpersona;
        /*$arraypersona[] = $idpersona;
        $persona = ZendExt_IoC::getInstance()->pvd->getPrincipalesDatosPersona($arraypersona, null, null, 0, null,null,null);*/

	    $idmodelo = $this->_request->getPost('idmodelo');
		$fecha = $this->_request->getPost('fecha');		
        $objModeloModel = new DatEvalmodeloModel();
        $objModelo = $objModeloModel->getModelo($idmodelo); 
        $objModelo->idestado = 0;
        
		$objModeloModel->Actualizar($objModelo);		

        $objTraza = new DatEvaltrazas();
        $objTraza->idpersona = $idpersona;
        $objTraza->fecha = $fecha;
        $objTraza->idmodelo = $idmodelo;         
        $objTrazasModel = new DatEvaltrazasModel();       
        $objTrazasModel->Insertar($objTraza);
       
		
        $r->result = 1;
        //$r->mensaje = "El modelo matem&aacute;tico ha sido modificado satisfactoriamente.";
				
        echo(json_encode($r));
    }
	function getTrazasAction()
    {
        $idmodelo = $this->_request->getPost('idmodelo');		
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');   
        $query = $this->_request->getPost('query');		
         
        $objDomain = new DatEvaltrazas();
        $r['datos'] = $objDomain->getTrazas($idmodelo, $query, $limit, $start);
		
        $r['cantidad'] = $objDomain->getCantTrazas($idmodelo,$this->_request->getPost('query'));

        echo json_encode($r);
    }


}
